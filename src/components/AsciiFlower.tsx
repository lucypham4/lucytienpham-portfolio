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
 * A press waters the flower first: streaks of flickering letters fall at 45°
 * from the top left over the whole plant, each soaking in at a letter of it.
 * The flower answers RAIN_LEAD_MS in, while the rest of the water falls.
 */
const RAIN_DROPS = 110;
/** Letters in one streak. */
const RAIN_LENGTH = 5;
/** What a streak is made of. Each letter re-rolls at the rhythm of the hover
 *  scatter, so the water flickers as it falls. */
const RAIN_GLYPHS = "abcdefghijklmnopqrstuvwxyz";
/** Drops set off across this long, so the water arrives as a shower. */
const RAIN_SPAWN_MS = 700;
/** How fast a drop falls, in rows per millisecond, each drop a little
 *  faster or slower. Measured against the flower rather than in pixels, so
 *  a shower takes as long at any width. */
const RAIN_SPEED = 0.12;
const RAIN_SPEED_SPREAD = 0.03;
/** The shower's letters against the flower's, so they stand out from it. */
const RAIN_SCALE = 1.5;
/** How far apart a streak's letters sit along its path, in rows: about one
 *  letter's advance at RAIN_SCALE. */
const RAIN_STEP = Math.SQRT1_2;
/** Used if the site's blue token is missing. */
const RAIN_FALLBACK = "#339af0";
/** How long the water falls before the flower starts to close and bloom. */
const RAIN_LEAD_MS = 500;

type Point = { x: number; y: number; born: number };

/** One falling streak. Positions are in grid cells, fractional, with the
 *  head of the streak at (col, row) when it sets off at `born`. */
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
  /** When the last streak has soaked in. */
  ends: number;
};

/** Rows the head has fallen since it set off. A step down one row is a step
 *  across CELL_ASPECT columns, which keeps the path at 45° on screen. */
const headRow = (drop: Drop, now: number) =>
  drop.row + (now - drop.born) * drop.speed;

/** The letter in place `k` of streak `n` during flicker step `step`: random
 *  looking, but steady until the step changes. */
function rainGlyph(n: number, k: number, step: number) {
  let h = (n * 374761393 + k * 668265263 + step * 1274126177) | 0;
  h = Math.imul(h ^ (h >>> 13), 1103515245);
  h ^= h >>> 16;
  return RAIN_GLYPHS[(h >>> 0) % RAIN_GLYPHS.length];
}

/** Aims a shower at the plant as it stands in `cells`. */
function makeRain(cells: Uint8Array, now: number): Rain {
  const lit: number[] = [];
  for (let i = 0; i < cells.length; i++) {
    const col = i % FLOWER_COLS;
    if (cells[i] && col >= BOX.col && col < BOX.col + BOX.cols) lit.push(i);
  }

  const drops: Drop[] = [];
  let ends = now;
  // Every streak starts wholly above the top edge.
  const start = BOX.row - RAIN_LENGTH * RAIN_STEP - 1;
  for (let k = 0; k < RAIN_DROPS && lit.length; k++) {
    // Each streak soaks in at a letter of the plant picked at random, so the
    // water falls over the whole of it rather than only its near edge.
    const target = lit[(Math.random() * lit.length) | 0];
    const lands = Math.floor(target / FLOWER_COLS);
    const col = (target % FLOWER_COLS) - (lands - start) * CELL_ASPECT;

    const born = now + Math.random() * RAIN_SPAWN_MS;
    const speed = RAIN_SPEED + (Math.random() * 2 - 1) * RAIN_SPEED_SPREAD;
    // The tail lands a streak's length behind the head.
    const soaked = born + (lands - start + RAIN_LENGTH * RAIN_STEP) / speed;
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

/**
 * At rest the flower sways in a breeze: waves roll across it from the top
 * left to the bottom right, pushing each letter along that diagonal and
 * letting it spring back, with a little flutter across the wind. Letters
 * higher up the plant move most; the foot of the stem stays put.
 */
/** How long one wave takes to pass a given letter. */
const WIND_PERIOD_MS = 2600;
/** The distance between waves, as a share of the flower's width. */
const WIND_WAVELENGTH = 0.45;
/** The breeze swells and eases over this long. */
const WIND_GUST_MS = 7300;
/** How far a wave pushes the top of the flower, in letter widths. */
const WIND_PUSH = 3;
/** How far each letter quivers across the wind, in letter widths. */
const WIND_FLUTTER = 0.6;
/** The breeze drops while the flower is watered and blooms, and picks up
 *  again over this long once it is open. */
const WIND_EASE_MS = 700;

export default function AsciiFlower({ onPick }: { onPick: () => void }) {
  const base = useRef<HTMLCanvasElement>(null);
  const reveal = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLButtonElement>(null);
  const points = useRef<Point[]>([]);
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

    /** How hard the breeze blows right now, 0 to 1. */
    let breeze = 0;
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
      const clock = performance.now();
      const gust = 0.65 + 0.35 * Math.sin((clock / WIND_GUST_MS) * Math.PI * 2);

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

          // Each letter's own offset, so neighbours move out of step.
          const seed = (row * 12.9898 + col * 78.233) % (Math.PI * 2);

          // Flecks off the main body drift on their own slow, quiet cycle,
          // each out of step with its neighbours.
          let floatX = 0;
          let floatY = 0;
          if (DETACHED[i]) {
            const t = (clock / FLOAT_PERIOD_MS) * Math.PI * 2;
            floatY = Math.sin(t + seed) * FLOAT_AMPLITUDE;
            floatX = Math.cos(t * 0.85 + seed) * FLOAT_AMPLITUDE * 0.6;
          }

          // The breeze: a wave travelling along the top-left to bottom-right
          // diagonal pushes the letter down and right, then lets it back.
          const lift = breeze > 0 ? Math.max(0, 1 - y / (height * 0.92)) : 0;
          if (lift > 0) {
            const reach = lift ** 1.5 * breeze * cellW;
            const phase =
              ((x + y) / (width * WIND_WAVELENGTH) - clock / WIND_PERIOD_MS) *
              Math.PI *
              2;
            const push = (0.5 + 0.5 * Math.sin(phase)) * gust * WIND_PUSH;
            const flutter = Math.sin(phase * 2.3 + seed) * WIND_FLUTTER;
            floatX += (push + flutter) * reach * Math.SQRT1_2;
            floatY += (push - flutter) * reach * Math.SQRT1_2;
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

      if (!scatter && now.rain) paintRain(ctx, now.rain);
    };

    /** The shower, drawn over the plant: each letter turned to lie along
     *  its 45° path, the head brightest, gone once it reaches its landing. */
    const paintRain = (ctx: CanvasRenderingContext2D, rain: Rain) => {
      const t = performance.now();
      const step = Math.floor(t / SCATTER_MS);
      const turn = Math.SQRT1_2 * dpr;
      ctx.fillStyle = token("--color-grad-blue") || RAIN_FALLBACK;
      ctx.font = ctx.font.replace(/[\d.]+px/, `${cellH * RAIN_SCALE}px`);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      rain.drops.forEach((drop, n) => {
        if (t < drop.born) return;
        const head = headRow(drop, t);
        for (let k = 0; k < RAIN_LENGTH; k++) {
          const row = head - k * RAIN_STEP;
          if (row > drop.lands) continue;
          const col = drop.col + (row - drop.row) * CELL_ASPECT;
          const x = (col - BOX.col + 0.5) * cellW;
          const y = (row - BOX.row + 0.5) * cellH;
          ctx.globalAlpha = 1 - k * 0.16;
          ctx.setTransform(turn, turn, -turn, turn, x * dpr, y * dpr);
          ctx.fillText(rainGlyph(n, k, step), 0, 0);
        }
      });

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.textAlign = "start";
      ctx.textBaseline = "top";
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
    let lastTick = performance.now();
    let leaning = "";
    let drawn = -1;

    const tick = (now: number) => {
      const s = shot.current;
      let dirty = false;

      // A moment into the shower the flower answers; the rest of the water
      // keeps falling while it closes and blooms.
      if (s.rain) {
        dirty = true;
        if (!s.rain.answered && now - s.rain.began >= RAIN_LEAD_MS) {
          s.rain.answered = true;
          beginCycle(s, now);
          pick.current();
        }
        if (s.rain.answered && now >= s.rain.ends) s.rain = null;
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

      // The breeze blows only while the flower is open and at rest, easing
      // in and out rather than stopping dead.
      const still = s.began === null && !s.rain;
      const eased = Math.min(1, (now - lastTick) / WIND_EASE_MS);
      lastTick = now;
      breeze = still
        ? Math.min(1, breeze + eased)
        : Math.max(0, breeze - eased);
      if (breeze > 0) dirty = true;

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
    s.rain = makeRain(FRAMES[Math.min(Math.max(s.frame, 0), LAST)], now);
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
    </button>
  );
}
