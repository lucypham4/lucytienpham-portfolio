"use client";

import { useEffect, useRef, useState } from "react";
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
const BLOOM_MS = 3200;
/** How often the disturbed letters re-roll while hovered. */
const SCATTER_MS = 70;
/** Letters lean toward the cursor, never straying more than this from where
 *  they belong, and only within reach of it. */
const PULL_MAX = 2;
const PULL_RADIUS = 110;

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

export default function AsciiFlower({ onPick }: { onPick: () => void }) {
  // Opens in the clip's own colours; a click flips it to a single contrasting
  // ink. Hovering scatters the letters into the background colour.
  const [trueColour, setTrueColour] = useState(true);
  // Bumped on every click to replay the bloom from the bud.
  const [run, setRun] = useState(0);

  const base = useRef<HTMLCanvasElement>(null);
  const reveal = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLButtonElement>(null);
  const points = useRef<Point[]>([]);
  const cursor = useRef<{ x: number; y: number } | null>(null);
  const frame = useRef(0);

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
    const paint = (
      canvas: HTMLCanvasElement | null,
      colours: boolean,
      scatter = false,
    ) => {
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      // Read per paint so the colours follow a theme change without a remount.
      const fill = scatter ? token("--color-bg") : token("--color-ink");

      size(canvas);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${FONT_PX}px var(--font-mono, ui-monospace, monospace)`;
      ctx.textBaseline = "top";

      const at = cursor.current;
      const cells = FRAMES[Math.min(frame.current, FRAMES.length - 1)];
      if (!cells) return;
      for (let row = 0; row < FLOWER_ROWS; row++) {
        for (let col = 0; col < FLOWER_COLS; col++) {
          const slot = cells[row * FLOWER_COLS + col];
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

          ctx.fillStyle = scatter || !colours ? fill : PALETTE[slot - 1];
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
      paint(base.current, trueColour);
      paint(reveal.current, !trueColour, true);
    };

    let lastScatter = 0;
    let leaning = "";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frame.current = FRAMES.length - 1;
      repaint();
      return;
    }

    // Rewind before painting: a click replays the bloom from the bud, and
    // painting first would draw with whatever index the last run left behind.
    let raf = 0;
    frame.current = 0;
    repaint();
    const opened = performance.now();

    const tick = (now: number) => {
      // Blooms once and holds on the last frame; only a reload replays it.
      const progress = Math.min(1, (now - opened) / BLOOM_MS);
      const next = Math.min(
        FRAMES.length - 1,
        Math.floor(progress * FRAMES.length),
      );
      if (next !== frame.current) {
        frame.current = next;
        repaint();
      }

      // Redraw only when the cursor has actually moved, so the letters follow
      // it without the piece repainting itself forever while idle.
      const at = cursor.current;
      const where = at ? `${Math.round(at.x)},${Math.round(at.y)}` : "";
      if (where !== leaning) {
        leaning = where;
        paint(base.current, trueColour);
      }

      points.current = points.current.filter((p) => now - p.born < TRAIL_MS);

      // Re-scatter while the cursor is over the piece, slower than the frame
      // rate so the static reads as flicker rather than a blur.
      if (points.current.length && now - lastScatter > SCATTER_MS) {
        lastScatter = now;
        paint(reveal.current, !trueColour, true);
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

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trueColour, run]);

  const track = (e: React.MouseEvent) => {
    const box = stage.current?.getBoundingClientRect();
    if (!box) return;
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    cursor.current = { x, y };
    points.current.push({ x, y, born: performance.now() });
    if (points.current.length > 18) points.current.shift();
  };

  return (
    <button
      ref={stage}
      type="button"
      onClick={() => {
        setTrueColour((on) => !on);
        setRun((n) => n + 1);
        onPick();
      }}
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
