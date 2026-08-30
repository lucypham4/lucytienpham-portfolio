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

/** Character cells are about half again as tall as they are wide. The width
 *  itself comes from whatever room the column gives the piece, so the flower
 *  fills it rather than sitting at a fixed size. */
const CELL_ASPECT = 6 / 3.9;

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

/** Blends two `#rrggbb` colours; t=0 is `a`, t=1 is `b`. */
function mixHex(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) + (((pb >> 16) & 255) - ((pa >> 16) & 255)) * t);
  const g = Math.round(((pa >> 8) & 255) + (((pb >> 8) & 255) - ((pa >> 8) & 255)) * t);
  const bl = Math.round((pa & 255) + ((pb & 255) - (pa & 255)) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

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

/** The box the drawing actually occupies across every frame, so the empty
 *  columns down one side are not paid for in width. */
const BOX = (() => {
  let minCol = FLOWER_COLS;
  let maxCol = 0;
  let minRow = FLOWER_ROWS;
  let maxRow = 0;
  for (const cells of FRAMES) {
    for (let row = 0; row < FLOWER_ROWS; row++) {
      for (let col = 0; col < FLOWER_COLS; col++) {
        if (!cells[row * FLOWER_COLS + col]) continue;
        if (col < minCol) minCol = col;
        if (col > maxCol) maxCol = col;
        if (row < minRow) minRow = row;
        if (row > maxRow) maxRow = row;
      }
    }
  }
  return {
    col: minCol,
    row: minRow,
    cols: maxCol - minCol + 1,
    rows: maxRow - minRow + 1,
  };
})();

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

/**
 * Cells that never touch the bloom's main body in the open frame — flecks
 * that sit off on their own rather than joining a petal. They drift free
 * instead of holding a fixed cell.
 */
const DETACHED = (() => {
  const cells = FRAMES[LAST];
  const total = FLOWER_COLS * FLOWER_ROWS;
  const component = new Int32Array(total).fill(-1);
  const sizes: number[] = [];
  const stack: number[] = [];

  for (let start = 0; start < total; start++) {
    if (!cells[start] || component[start] !== -1) continue;
    const id = sizes.length;
    let size = 0;
    stack.push(start);
    component[start] = id;
    while (stack.length) {
      const i = stack.pop()!;
      size++;
      const row = Math.floor(i / FLOWER_COLS);
      const col = i % FLOWER_COLS;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          const r = row + dr;
          const c = col + dc;
          if (r < 0 || r >= FLOWER_ROWS || c < 0 || c >= FLOWER_COLS) continue;
          const j = r * FLOWER_COLS + c;
          if (!cells[j] || component[j] !== -1) continue;
          component[j] = id;
          stack.push(j);
        }
      }
    }
    sizes.push(size);
  }

  let mainId = 0;
  for (let id = 1; id < sizes.length; id++) {
    if (sizes[id] > sizes[mainId]) mainId = id;
  }

  const out = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    out[i] = cells[i] && component[i] !== mainId ? 1 : 0;
  }
  return out;
})();

const FLOAT_ANY = DETACHED.some(Boolean);
/** How often a detached letter's drift is re-evaluated. */
const FLOAT_MS = 45;
/** One full up-and-down cycle. */
const FLOAT_PERIOD_MS = 3400;
/** How far a detached letter strays from its cell, in cells' worth of pixel. */
const FLOAT_AMPLITUDE = 1.6;

export default function AsciiFlower({ onPick }: { onPick: () => void }) {
  const base = useRef<HTMLCanvasElement>(null);
  const reveal = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLButtonElement>(null);
  const points = useRef<Point[]>([]);
  const cursor = useRef<{ x: number; y: number } | null>(null);

  /** Everything the loop needs, held in refs so a press never restarts it. */
  const shot = useRef({
    frame: 0,
    /** Opens contrasted against the page; a press hands it the clip's colours. */
    colour: false,
    /** Colour the spread is moving toward, while a cycle runs. */
    next: false,
    /** How far the colour has washed out from the heart, 0 to 1. */
    spread: 1,
    /** When the running cycle began; null once it has finished. */
    began: null as number | null,
  });

  useEffect(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let cellW = 3.9;
    let cellH = cellW * CELL_ASPECT;
    let width = BOX.cols * cellW;
    let height = BOX.rows * cellH;

    const measure = () => {
      const room = stage.current?.clientWidth;
      if (!room) return false;
      const next = room / BOX.cols;
      if (Math.abs(next - cellW) < 0.01) return false;
      cellW = next;
      cellH = cellW * CELL_ASPECT;
      width = room;
      height = BOX.rows * cellH;
      return true;
    };

    const token = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    const size = (canvas: HTMLCanvasElement) => {
      if (canvas.width === Math.round(width * dpr)) return;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
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

      size(canvas);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${cellH}px var(--font-mono, ui-monospace, monospace)`;
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

          const x = (col - BOX.col) * cellW;
          const y = (row - BOX.row) * cellH;

          // Flecks off the main body drift on their own slow, quiet cycle,
          // each out of step with its neighbours.
          let floatX = 0;
          let floatY = 0;
          if (DETACHED[i]) {
            const phase = (row * 12.9898 + col * 78.233) % (Math.PI * 2);
            const t = (performance.now() / FLOAT_PERIOD_MS) * Math.PI * 2;
            floatY = Math.sin(t + phase) * FLOAT_AMPLITUDE;
            floatX = Math.cos(t * 0.85 + phase) * FLOAT_AMPLITUDE * 0.6;
          }

          // Lean toward the cursor, falling off with distance and capped so a
          // letter never drifts far from its own cell. The same falloff
          // also decides how much of the letter's own hue shows through.
          let leanX = 0;
          let leanY = 0;
          let near = 0;
          if (at) {
            const dx = at.x - x;
            const dy = at.y - y;
            const away = Math.hypot(dx, dy) || 1;
            near = Math.max(0, 1 - away / PULL_RADIUS);
            const pull = near * PULL_MAX;
            leanX = (dx / away) * pull;
            leanY = (dy / away) * pull;
          }

          if (scatter) {
            // Scattered glyphs carry the letter's own hue, so the streak
            // reads as the flower's colours rather than blank noise.
            ctx.fillStyle = PALETTE[slot - 1];
          } else {
            // Cells the wash has already reached wear the new colour.
            const turned = REACH[i] <= now.spread;
            const active = turned ? now.next : now.colour;
            ctx.fillStyle = active
              ? PALETTE[slot - 1]
              : near > 0
                ? mixHex(ink, PALETTE[slot - 1], near)
                : ink;
          }

          ctx.fillText(
            scatter
              ? NOISE[(Math.random() * NOISE.length) | 0]
              : PHRASE[(col + row * 5) % PHRASE.length],
            x + leanX + floatX,
            y + leanY + floatY,
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
    let lastFloat = 0;
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

      // The detached flecks drift on their own clock, independent of
      // anything else that would otherwise ask for a redraw.
      if (FLOAT_ANY && now - lastFloat > FLOAT_MS) {
        lastFloat = now;
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

    measure();
    repaint();

    // Follow the column: the flower is sized from the room it is given.
    const onResize = () => {
      if (measure()) repaint();
    };
    window.addEventListener("resize", onResize);

    // The ink and background are read per paint, so without this the flower
    // keeps the old palette after a theme switch until something else asks
    // for a repaint.
    const watchTheme = new MutationObserver(repaint);
    watchTheme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      watchTheme.disconnect();
    };
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
