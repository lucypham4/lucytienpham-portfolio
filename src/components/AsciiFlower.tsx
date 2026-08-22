"use client";

import { useEffect, useRef } from "react";
import {
  FLOWER_COLS,
  FLOWER_FRAMES,
  FLOWER_ROWS,
  PALETTE,
} from "@/content/flower-frames";

/** Tiled through the drawing so the flower is spelled out of her name. */
const PHRASE = "lucy cat tien pham ";

/** What the cursor scatters the letters into: a spread of glyph weights so the
 *  disturbed cells read as static rather than as words. */
const NOISE = "0]M%bBhqZdpr#Q\\uX!k&@aWJZvC<K^9z;~+\"{}|/$IwvY*=?3T7";

/** Character cell. Small enough that the grid reads as the clip rather than as
 *  lettering, while each glyph is still legible up close. */
const CELL_W = 3.9;
const CELL_H = 6;
const FONT_PX = 6;

const TRAIL_MS = 520;
const TRAIL_RADIUS = 45;
/** How often the disturbed letters re-roll while hovered. */
const SCATTER_MS = 70;
/** Letters lean toward the cursor, never straying more than this from where
 *  they belong, and only within reach of it. */
const PULL_MAX = 2;
const PULL_RADIUS = 110;

/**
 * A press runs one unbroken cycle: the flower closes back to a bud and opens
 * again. The new colour is released from the heart the instant it is pressed
 * and washes outward while that happens, rather than waiting its turn.
 */
const WILT_MS = 1100;
const BLOOM_MS = 1700;
const CYCLE_MS = WILT_MS + BLOOM_MS;
const SPREAD_MS = 900;

type Point = { x: number; y: number; born: number };

function decode(rle: string) {
  const cells = new Uint8Array(FLOWER_COLS * FLOWER_ROWS);
  let at = 0;
  for (let i = 0; i < rle.length; i += 2) {
    const slot = parseInt(rle[i], 36);
    const run = parseInt(rle[i + 1], 36);
    cells.fill(slot, at, at + run);
    at += run;
  }
  return cells;
}

const FRAMES = FLOWER_FRAMES.map(decode);
const LAST = FRAMES.length - 1;

/**
 * How far each cell sits from the heart of the bloom, as 0 to 1. The colour
 * change is released from the centre and washes outward along this.
 */
const REACH = (() => {
  const open = FRAMES[LAST];
  let sumX = 0;
  let sumY = 0;
  let n = 0;
  for (let row = 0; row < FLOWER_ROWS; row++) {
    for (let col = 0; col < FLOWER_COLS; col++) {
      if (!open[row * FLOWER_COLS + col]) continue;
      sumX += col;
      sumY += row;
      n++;
    }
  }
  const heartX = n ? sumX / n : FLOWER_COLS / 2;
  const heartY = n ? sumY / n : FLOWER_ROWS / 2;

  const out = new Float32Array(FLOWER_COLS * FLOWER_ROWS);
  let far = 1;
  for (let row = 0; row < FLOWER_ROWS; row++) {
    for (let col = 0; col < FLOWER_COLS; col++) {
      // Columns are about half as wide as rows are tall, so the sweep stays
      // round rather than stretching sideways.
      const d = Math.hypot((col - heartX) * 0.5, row - heartY);
      out[row * FLOWER_COLS + col] = d;
      if (d > far) far = d;
    }
  }
  for (let i = 0; i < out.length; i++) out[i] /= far;
  return out;
})();

export default function AsciiFlower({ onPick }: { onPick: () => void }) {
  const base = useRef<HTMLCanvasElement>(null);
  const reveal = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLButtonElement>(null);
  const points = useRef<Point[]>([]);
  const cursor = useRef<{ x: number; y: number } | null>(null);

  /** Everything the loop needs, held in refs so a press never restarts it. */
  const shot = useRef({
    frame: 0,
    /** Opens in the clip's own colours. */
    colour: true,
    /** Colour the spread is moving toward, while a cycle runs. */
    next: true,
    /** How far the colour has washed out from the heart, 0 to 1. */
    spread: 1,
    /** When the running cycle began; null once it has finished. */
    began: null as number | null,
  });

  useEffect(() => {
    const width = FLOWER_COLS * CELL_W;
    const height = FLOWER_ROWS * CELL_H;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const token = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    const size = (canvas: HTMLCanvasElement) => {
      if (canvas.width === width * dpr) return;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    /**
     * `scatter` paints the disturbed layer: random glyphs in the page's own
     * background colour, so where the cursor passes the flower reads as having
     * been scattered away rather than recoloured.
     */
    const paint = (canvas: HTMLCanvasElement | null, scatter = false) => {
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const ink = token("--color-ink");
      const bg = token("--color-bg");

      size(canvas);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${FONT_PX}px var(--font-mono, ui-monospace, monospace)`;
      ctx.textBaseline = "top";

      const now = shot.current;
      const cells = FRAMES[Math.min(Math.max(now.frame, 0), LAST)];
      if (!cells) return;

      const at = cursor.current;

      for (let row = 0; row < FLOWER_ROWS; row++) {
        for (let col = 0; col < FLOWER_COLS; col++) {
          const i = row * FLOWER_COLS + col;
          const slot = cells[i];
          if (!slot) continue;

          const x = col * CELL_W;
          const y = row * CELL_H;

          // Lean toward the cursor, falling off with distance and capped so a
          // letter never drifts far from its own cell.
          let leanX = 0;
          let leanY = 0;
          if (at) {
            const dx = at.x - x;
            const dy = at.y - y;
            const away = Math.hypot(dx, dy) || 1;
            const pull = Math.max(0, 1 - away / PULL_RADIUS) * PULL_MAX;
            leanX = (dx / away) * pull;
            leanY = (dy / away) * pull;
          }

          if (scatter) {
            ctx.fillStyle = bg;
          } else {
            // Cells the wash has already reached wear the new colour.
            const turned = REACH[i] <= now.spread;
            ctx.fillStyle = (turned ? now.next : now.colour)
              ? PALETTE[slot - 1]
              : ink;
          }

          ctx.fillText(
            scatter
              ? NOISE[(Math.random() * NOISE.length) | 0]
              : PHRASE[(col + row * 5) % PHRASE.length],
            x + leanX,
            y + leanY,
          );
        }
      }
    };

    const repaint = () => {
      paint(base.current);
      paint(reveal.current, true);
    };

    // Open on load the same way a press does, minus the closing half.
    shot.current.began = performance.now() - WILT_MS;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shot.current.frame = LAST;
      shot.current.began = null;
      repaint();
      return;
    }

    let raf = 0;
    let lastScatter = 0;
    let leaning = "";
    let drawn = -1;

    const tick = (now: number) => {
      const s = shot.current;
      let dirty = false;

      if (s.began !== null) {
        const t = now - s.began;

        // The wash runs from the moment of the press, alongside the closing
        // and opening rather than between them.
        const spread = Math.min(1, t / SPREAD_MS);
        if (spread !== s.spread) {
          s.spread = spread;
          dirty = true;
        }

        if (t < WILT_MS) {
          // Closing: the recorded bloom, played backwards.
          s.frame = Math.round(LAST * (1 - t / WILT_MS));
        } else if (t < CYCLE_MS) {
          s.frame = Math.round(LAST * ((t - WILT_MS) / BLOOM_MS));
        } else {
          s.frame = LAST;
          s.spread = 1;
          s.colour = s.next;
          s.began = null;
        }
      }

      if (s.frame !== drawn) {
        drawn = s.frame;
        dirty = true;
      }

      // Redraw when the pointer moves, so the letters follow it.
      const at = cursor.current;
      const where = at ? `${Math.round(at.x)},${Math.round(at.y)}` : "";
      if (where !== leaning) {
        leaning = where;
        dirty = true;
      }

      if (dirty) paint(base.current);

      points.current = points.current.filter((p) => now - p.born < TRAIL_MS);

      // Re-scatter while the cursor is over the piece, slower than the frame
      // rate so the static reads as flicker rather than a blur.
      if (points.current.length && now - lastScatter > SCATTER_MS) {
        lastScatter = now;
        paint(reveal.current, true);
      }

      const mask = points.current
        .map((p) => {
          const age = (now - p.born) / TRAIL_MS;
          const radius = TRAIL_RADIUS * (1 - age * 0.55);
          const alpha = (1 - age) ** 2;
          return `radial-gradient(circle ${radius}px at ${p.x}px ${p.y}px, rgba(0,0,0,${alpha}) 0%, rgba(0,0,0,0) 72%)`;
        })
        .join(",");

      // An empty trail must hide the layer, so fall back to a transparent mask
      // rather than "none", which would remove the mask and reveal all of it.
      const applied = mask || "linear-gradient(#0000, #0000)";
      const node = reveal.current;
      if (node) {
        node.style.maskImage = applied;
        node.style.webkitMaskImage = applied;
      }

      raf = requestAnimationFrame(tick);
    };

    repaint();
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const track = (e: React.MouseEvent) => {
    const box = stage.current?.getBoundingClientRect();
    if (!box) return;
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    cursor.current = { x, y };
    points.current.push({ x, y, born: performance.now() });
    if (points.current.length > 18) points.current.shift();
  };

  const press = () => {
    const s = shot.current;
    // A press during a cycle restarts it rather than stacking another.
    s.colour = s.next;
    s.next = !s.colour;
    s.spread = 0;
    s.began = performance.now();
    onPick();
  };

  return (
    <button
      ref={stage}
      type="button"
      onClick={press}
      onMouseLeave={() => {
        points.current = [];
        cursor.current = null;
      }}
      onMouseMove={track}
      aria-label="Change the intro line and the flower's colours"
      className="ascii-art relative block w-full cursor-pointer select-none"
    >
      <span aria-hidden className="ascii-halo" />
      <canvas ref={base} aria-hidden className="ascii-canvas" />
      <canvas ref={reveal} aria-hidden className="ascii-canvas ascii-reveal" />
    </button>
  );
}
