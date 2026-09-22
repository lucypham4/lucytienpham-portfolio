"use client";

import { useEffect, useRef } from "react";
import {
  FLOWER_ALPHABET,
  FLOWER_CELL_ASPECT,
  FLOWER_COLS,
  FLOWER_FRAMES,
  FLOWER_ROWS,
  FLOWER_TONES,
  PALETTE,
} from "@/content/flower-frames";

/**
 * The letters of her name, sorted from least ink to most. Each tone picks
 * from its own pair, so the flower's shading is drawn with "lucy cat tien
 * pham" the way the clip shades with its glyph ramp.
 */
const RAMP = ["", "il", "lt", "tc", "cy", "ue", "an", "ph", "hm"];
/** How strongly each tone is inked, faintest fleck to brightest petal. */
const TONE_ALPHA = [0, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.93, 1];

/** What the cursor scatters the letters into: a spread of glyph weights so the
 *  disturbed cells read as static rather than as words. */
const NOISE = "0]M%bBhqZdpr#Q\\uX!k&@aWJZvC<K^9z;~+\"{}|/$IwvY*=?3T7";

/** Character cells keep the clip's proportions. The width itself comes from
 *  whatever room the column gives the piece, so the flower fills it rather
 *  than sitting at a fixed size. */
const CELL_ASPECT = FLOWER_CELL_ASPECT;

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

/**
 * A press waters the flower first: tags reading "Water", in the same style
 * as the project tags, fall at 45° from the top left and soak in at letters
 * of the plant. The flower answers RAIN_LEAD_MS in, while the rest fall.
 */
/** The most tags a shower uses; how many it does depends on the width. */
const RAIN_MAX = 20;
const RAIN_MIN = 8;
/** One tag per this many pixels of the flower's width. */
const RAIN_PX_PER_DROP = 40;
/** Tags set off across this long, so the water arrives as a shower. */
const RAIN_SPAWN_MS = 700;
/** How fast a tag falls, in rows per millisecond, each a little faster or
 *  slower. Measured against the flower rather than in pixels, so a shower
 *  takes as long at any width. */
const RAIN_SPEED = 0.12;
const RAIN_SPEED_SPREAD = 0.03;
/** Tags set off this many rows above the top edge, clear of it. */
const RAIN_ABOVE = 20;
/** Over this many rows before landing, a tag fades as it soaks in. */
const RAIN_SOAK = 4;
/** How long the water falls before the flower starts to close and bloom. */
const RAIN_LEAD_MS = 500;

type Point = { x: number; y: number; born: number };

/** One falling tag. Positions are in grid cells, fractional, with the
 *  tag's centre at (col, row) when it sets off at `born`. */
type Drop = {
  col: number;
  row: number;
  born: number;
  speed: number;
  lands: number;
};

type Rain = {
  drops: Drop[];
  began: number;
  /** Whether the flower has started its cycle for this shower yet. */
  answered: boolean;
  /** When the last tag has soaked in. */
  ends: number;
};

/** Rows a tag has fallen since it set off. A step down one row is a step
 *  across CELL_ASPECT columns, which keeps the path at 45° on screen. */
const fallenTo = (drop: Drop, now: number) =>
  drop.row + (now - drop.born) * drop.speed;

/** Aims `count` tags at the plant as it stands in `cells`. */
function makeRain(cells: Uint8Array, count: number, now: number): Rain {
  const lit: number[] = [];
  for (let i = 0; i < cells.length; i++) {
    const col = i % FLOWER_COLS;
    if (cells[i] && col >= BOX.col && col < BOX.col + BOX.cols) lit.push(i);
  }

  const drops: Drop[] = [];
  let ends = now;
  const start = BOX.row - RAIN_ABOVE;
  for (let k = 0; k < count && lit.length; k++) {
    // Each tag soaks in at a letter of the plant picked at random, so the
    // water falls over the whole of it rather than only its near edge.
    const target = lit[(Math.random() * lit.length) | 0];
    const lands = Math.floor(target / FLOWER_COLS);
    const col = (target % FLOWER_COLS) - (lands - start) * CELL_ASPECT;

    const born = now + Math.random() * RAIN_SPAWN_MS;
    const speed = RAIN_SPEED + (Math.random() * 2 - 1) * RAIN_SPEED_SPREAD;
    const soaked = born + (lands - start) / speed;
    if (soaked > ends) ends = soaked;
    drops.push({ col, row: start, born, speed, lands });
  }
  return { drops, began: now, answered: false, ends };
}

type Shot = {
  frame: number;
  colour: boolean;
  next: boolean;
  spread: number;
  began: number | null;
  rain: Rain | null;
};

/** Starts the close-and-bloom, handing the flower the other colours. A cycle
 *  already running restarts rather than stacking another. */
function beginCycle(s: Shot, now: number) {
  s.colour = s.next;
  s.next = !s.colour;
  s.spread = 0;
  s.began = now;
}

/** A `#rgb` or `#rrggbb` colour as a number. The build shortens colours
 *  where it can, so the page's white arrives as `#fff`. */
function hexValue(hex: string) {
  const digits = hex.slice(1);
  return parseInt(
    digits.length === 3 ? digits.replace(/./g, "$&$&") : digits,
    16,
  );
}

/** Blends two hex colours; t=0 is `a`, t=1 is `b`. */
function mixHex(a: string, b: string, t: number) {
  const pa = hexValue(a);
  const pb = hexValue(b);
  const r = Math.round(((pa >> 16) & 255) + (((pb >> 16) & 255) - ((pa >> 16) & 255)) * t);
  const g = Math.round(((pa >> 8) & 255) + (((pb >> 8) & 255) - ((pa >> 8) & 255)) * t);
  const bl = Math.round((pa & 255) + ((pb & 255) - (pa & 255)) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function decode(rle: string) {
  const cells = new Uint8Array(FLOWER_COLS * FLOWER_ROWS);
  let at = 0;
  for (let i = 0; i < rle.length; i += 2) {
    const code = FLOWER_ALPHABET.indexOf(rle[i]);
    const run = FLOWER_ALPHABET.indexOf(rle[i + 1]);
    cells.fill(code, at, at + run);
    at += run;
  }
  return cells;
}

/** A cell's code is 1 + hue * tones + (tone - 1); 0 is empty. */
const hueOf = (code: number) => Math.floor((code - 1) / FLOWER_TONES);
const toneOf = (code: number) => ((code - 1) % FLOWER_TONES) + 1;

/** Which of its tone's letters a cell wears, fixed per cell so the texture
 *  holds still between frames instead of shimmering. */
const pickOf = (row: number, col: number) =>
  ((row * 7 + col * 13 + ((row * col) % 5)) % 2) as 0 | 1;

const FRAMES = FLOWER_FRAMES.map(decode);
const LAST = FRAMES.length - 1;

/** Share of a frame's letters the box may leave out at each side. A few
 *  specks flung wide of the petals would otherwise set the flower's width,
 *  leaving the bloom small inside a box that is mostly empty. */
const SPECK_SHARE = 0.005;

/**
 * The box the drawing occupies. Sideways it spans the petals of every frame,
 * less the stray specks past them, so the edge of the box is the edge of the
 * bloom. Top to bottom it keeps everything, so the stem keeps its tail.
 */
const BOX = (() => {
  let minCol = FLOWER_COLS;
  let maxCol = 0;
  let minRow = FLOWER_ROWS;
  let maxRow = 0;
  const perCol = new Uint32Array(FLOWER_COLS);
  for (const cells of FRAMES) {
    perCol.fill(0);
    let total = 0;
    for (let row = 0; row < FLOWER_ROWS; row++) {
      for (let col = 0; col < FLOWER_COLS; col++) {
        if (!cells[row * FLOWER_COLS + col]) continue;
        perCol[col]++;
        total++;
        if (row < minRow) minRow = row;
        if (row > maxRow) maxRow = row;
      }
    }
    if (!total) continue;

    const spare = total * SPECK_SHARE;
    let first = 0;
    let skipped = 0;
    while (skipped + perCol[first] <= spare) skipped += perCol[first++];
    let last = FLOWER_COLS - 1;
    skipped = 0;
    while (skipped + perCol[last] <= spare) skipped += perCol[last--];

    if (first < minCol) minCol = first;
    if (last > maxCol) maxCol = last;
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
      // Columns are narrower than rows are tall, so the sweep stays round
      // rather than stretching sideways.
      const d = Math.hypot((col - heartX) / CELL_ASPECT, row - heartY);
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
      // The grid is fine enough that a petal's glyphs can sit a cell apart,
      // so neighbours two cells off still count as touching.
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
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
  const pills = useRef<(HTMLSpanElement | null)[]>([]);
  const cursor = useRef<{ x: number; y: number } | null>(null);

  /** Everything the loop needs, held in refs so a press never restarts it. */
  const shot = useRef<Shot>({
    frame: 0,
    /** Opens in the clip's colours; a press trades them for the page's ink. */
    colour: true,
    /** Colour the spread is moving toward, while a cycle runs. */
    next: true,
    /** How far the colour has washed out from the heart, 0 to 1. */
    spread: 1,
    /** When the running cycle began; null once it has finished. */
    began: null,
    /** The shower on its way down, if any. */
    rain: null,
  });

  /** The latest onPick, for the loop to call once the water has landed. */
  const pick = useRef(onPick);
  useEffect(() => {
    pick.current = onPick;
  }, [onPick]);

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
     * `scatter` paints the disturbed layer: random glyphs in the other
     * side's colour. In colour that is the page's own background, so where
     * the cursor passes the flower reads as having been scattered away
     * rather than recoloured.
     */
    const paint = (canvas: HTMLCanvasElement | null, scatter = false) => {
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const ink = token("--color-ink");
      const ground = token("--color-bg");

      size(canvas);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      // Canvas fonts can't read CSS variables, so resolve the face first —
      // otherwise the whole string is rejected and it falls back to 10px sans.
      const mono = token("--font-mono") || "ui-monospace";
      ctx.font = `700 ${cellH}px ${mono}, monospace`;
      ctx.textBaseline = "top";

      const now = shot.current;
      const cells = FRAMES[Math.min(Math.max(now.frame, 0), LAST)];
      if (!cells) return;

      const at = cursor.current;

      for (let row = 0; row < FLOWER_ROWS; row++) {
        for (let col = 0; col < FLOWER_COLS; col++) {
          const i = row * FLOWER_COLS + col;
          const code = cells[i];
          if (!code) continue;
          // Specks past the edge of the bloom are left out; see BOX.
          if (col < BOX.col || col >= BOX.col + BOX.cols) continue;
          const hue = PALETTE[hueOf(code)];
          const tone = toneOf(code);

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

          // Cells the wash has already reached wear the new colour.
          const turned = REACH[i] <= now.spread;
          const active = turned ? now.next : now.colour;

          // The cursor always shows the other side: in ink, the letter's
          // own hue shows through near it and scatters in that hue; in
          // colour, the page's background (white, or black when dark) does
          // instead, so the bloom is brushed away where the cursor passes.
          if (scatter) {
            ctx.fillStyle = active ? ground : hue;
          } else if (active) {
            ctx.fillStyle = near > 0 ? mixHex(hue, ground, near) : hue;
          } else {
            ctx.fillStyle = near > 0 ? mixHex(ink, hue, near) : ink;
          }
          ctx.globalAlpha = TONE_ALPHA[tone];

          ctx.fillText(
            scatter
              ? NOISE[(Math.random() * NOISE.length) | 0]
              : RAMP[tone][pickOf(row, col)],
            x + leanX + floatX,
            y + leanY + floatY,
          );
        }
      }
    };

    /** Moves the shower's tags to where they have fallen, and hides the
     *  ones not yet set off or already soaked in. */
    const placeRain = (t: number) => {
      const rain = shot.current.rain;
      pills.current.forEach((pill, k) => {
        if (!pill) return;
        const drop = rain?.drops[k];
        const row = drop ? fallenTo(drop, t) : 0;
        if (!drop || t < drop.born || row >= drop.lands) {
          if (pill.style.opacity !== "0") pill.style.opacity = "0";
          return;
        }
        const col = drop.col + (row - drop.row) * CELL_ASPECT;
        const x = (col - BOX.col + 0.5) * cellW;
        const y = (row - BOX.row + 0.5) * cellH;
        pill.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(45deg)`;
        pill.style.opacity = String(Math.min(1, (drop.lands - row) / RAIN_SOAK));
      });
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

      // A moment into the shower the flower answers; the rest of the water
      // keeps falling while it closes and blooms.
      if (s.rain) {
        if (!s.rain.answered && now - s.rain.began >= RAIN_LEAD_MS) {
          s.rain.answered = true;
          beginCycle(s, now);
          pick.current();
        }
        if (s.rain.answered && now >= s.rain.ends) s.rain = null;
        placeRain(now);
      }

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
    // Water already on its way lands before any more is poured.
    if (s.rain) return;
    const now = performance.now();
    // Without motion there is no shower to watch, so answer straight away.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      beginCycle(s, now);
      onPick();
      return;
    }
    const room = stage.current?.clientWidth ?? 0;
    const count = Math.min(
      RAIN_MAX,
      Math.max(RAIN_MIN, Math.round(room / RAIN_PX_PER_DROP)),
    );
    s.rain = makeRain(FRAMES[Math.min(Math.max(s.frame, 0), LAST)], count, now);
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
      aria-label="Water the flower to change the intro line and its colours"
      className="ascii-art relative block w-full cursor-pointer select-none"
    >
      <span aria-hidden className="ascii-halo" />
      <canvas ref={base} aria-hidden className="ascii-canvas" />
      <canvas ref={reveal} aria-hidden className="ascii-canvas ascii-reveal" />
      {/* The watering tags, styled as the project tags on the home page. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {Array.from({ length: RAIN_MAX }, (_, k) => (
          <span
            key={k}
            ref={(el) => {
              pills.current[k] = el;
            }}
            className="absolute top-0 left-0 rounded-card border border-line-soft bg-bg px-3 py-1.5 text-xs font-semibold tracking-[1px] whitespace-nowrap text-ink uppercase opacity-0 will-change-transform"
          >
            Water
          </span>
        ))}
      </span>
    </button>
  );
}
