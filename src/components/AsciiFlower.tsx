"use client";

import { useEffect, useRef, useState } from "react";

const COLS = 74;
const ROWS = 38;

/** Where the bloom sits; the stem runs from just below it to the bottom. */
const HEART_ROW = 14;
const STEM_TOP = HEART_ROW + 2;

/** Monospace cells are about half as wide as tall, so horizontal distances are
 *  stretched to keep the flower from looking squashed. */
const ASPECT = 1.7;

const PETALS = 13;
const STAMENS = 17;
const PETAL_LEN = 13;
const STAMEN_LEN = 21;

/** Tiled through the drawing so the flower is spelled out of her name. */
const PHRASE = "lucy cat tien pham ";

const TRAIL_MS = 520;
const TRAIL_RADIUS = 90;
const BLOOM_MS = 2600;

type Point = { x: number; y: number; born: number };

/** Petals and stem are drawn onto separate grids so each can take its own
 *  colour — a single <pre> can only be one colour at a time. */
type Frame = { petals: string; stem: string };

const easeOut = (t: number) => 1 - (1 - t) ** 3;

function draw(bloom: number): Frame {
  const petalCells = new Array<string>(COLS * ROWS).fill(" ");
  const stemCells = new Array<string>(COLS * ROWS).fill(" ");
  const cx = (COLS - 1) / 2;

  const put = (grid: string[], x: number, y: number, char?: string) => {
    const col = Math.round(x);
    const row = Math.round(y);
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;
    const at = row * COLS + col;
    grid[at] = char ?? PHRASE[(col + row * 5) % PHRASE.length];
  };

  // A spider lily flowers on a bare stem, so there is nothing here but the
  // stalk: two cells wide, leaning very slightly as it rises.
  const stemTop = STEM_TOP - Math.round(bloom * 2);
  for (let row = stemTop; row < ROWS; row++) {
    const lean = Math.sin((row - stemTop) * 0.11) * 1.2;
    put(stemCells, cx + lean, row);
    put(stemCells, cx + lean + 1, row);
  }

  // Petals: furled and upright in the bud, spreading and recurving as it opens.
  // They reach past the horizontal and their lengths vary, so the outline stays
  // ragged instead of closing into a dome.
  for (let p = 0; p < PETALS; p++) {
    const base = Math.PI * (-0.06 + (1.12 * p) / (PETALS - 1));
    const angle = Math.PI / 2 + (base - Math.PI / 2) * bloom;
    const vary = 0.76 + 0.24 * Math.abs(Math.sin(p * 2.399));
    const length = PETAL_LEN * vary * (0.16 + 0.84 * bloom);

    for (let s = 0; s <= 1; s += 0.018) {
      const reach = length * s;
      // The tip falls away, which is what makes a spider lily look recurved.
      const droop = bloom * 9 * s ** 3;
      const x = cx + Math.cos(angle) * reach * ASPECT;
      const y = HEART_ROW - Math.sin(angle) * reach + droop;
      put(petalCells, x, y);
      // A little body near the base, tapering to a single stroke at the tip.
      if (s < 0.45) put(petalCells, x + 1, y);
    }
  }

  // Stamens: longer, sparser, arcing well past the petals to a dark tip.
  for (let t = 0; t < STAMENS; t++) {
    const base = Math.PI * (-0.1 + (1.2 * t) / (STAMENS - 1));
    const angle = Math.PI / 2 + (base - Math.PI / 2) * bloom;
    const length = STAMEN_LEN * (0.1 + 0.9 * bloom);
    let tipX = cx;
    let tipY = HEART_ROW;

    for (let s = 0; s <= 1; s += 0.05) {
      const reach = length * s;
      const lift = bloom * 3 * Math.sin(Math.PI * s);
      const droop = bloom * 9 * s ** 3;
      tipX = cx + Math.cos(angle) * reach * ASPECT;
      tipY = HEART_ROW - Math.sin(angle) * reach - lift + droop;
      put(petalCells, tipX, tipY);
    }
    if (bloom > 0.35) put(petalCells, tipX, tipY, "@");
  }

  const rows = (grid: string[]) => {
    let out = "";
    for (let r = 0; r < ROWS; r++) {
      out += grid.slice(r * COLS, (r + 1) * COLS).join("") + "\n";
    }
    return out;
  };

  return { petals: rows(petalCells), stem: rows(stemCells) };
}

const TRUE_PETAL = "#e0452a";
const TRUE_STEM = "var(--color-green)";
const MONO = "var(--color-ink)";

export default function AsciiFlower({ onPick }: { onPick: () => void }) {
  // Starts contrasting with the page; a click flips it to the real colours.
  const [trueColour, setTrueColour] = useState(false);

  const petalsBase = useRef<HTMLPreElement>(null);
  const stemBase = useRef<HTMLPreElement>(null);
  const petalsAlt = useRef<HTMLPreElement>(null);
  const stemAlt = useRef<HTMLPreElement>(null);
  const stage = useRef<HTMLButtonElement>(null);
  const points = useRef<Point[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const paint = (frame: Frame) => {
      for (const node of [petalsBase.current, petalsAlt.current]) {
        if (node) node.textContent = frame.petals;
      }
      for (const node of [stemBase.current, stemAlt.current]) {
        if (node) node.textContent = frame.stem;
      }
    };

    if (reduced.matches) {
      paint(draw(1));
      return;
    }

    let raf = 0;
    const opened = performance.now();

    const tick = (now: number) => {
      // Blooms once and holds; only a reload starts it over.
      const bloom = Math.min(1, (now - opened) / BLOOM_MS);
      if (bloom < 1) paint(draw(easeOut(bloom)));
      else if (!points.current.length && bloom === 1) paint(draw(1));

      points.current = points.current.filter((p) => now - p.born < TRAIL_MS);

      const mask = points.current
        .map((p) => {
          const age = (now - p.born) / TRAIL_MS;
          const radius = TRAIL_RADIUS * (1 - age * 0.55);
          const alpha = (1 - age) ** 2;
          return `radial-gradient(circle ${radius}px at ${p.x}px ${p.y}px, rgba(0,0,0,${alpha}) 0%, rgba(0,0,0,0) 72%)`;
        })
        .join(",");

      // An empty trail must hide the layer, so fall back to a transparent
      // mask rather than "none", which would remove the mask and reveal it.
      const applied = mask || "linear-gradient(#0000, #0000)";
      for (const node of [petalsAlt.current, stemAlt.current]) {
        if (!node) continue;
        node.style.maskImage = applied;
        node.style.webkitMaskImage = applied;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const track = (e: React.MouseEvent) => {
    const box = stage.current?.getBoundingClientRect();
    if (!box) return;
    points.current.push({
      x: e.clientX - box.left,
      y: e.clientY - box.top,
      born: performance.now(),
    });
    if (points.current.length > 18) points.current.shift();
  };

  return (
    <button
      ref={stage}
      type="button"
      onClick={() => {
        setTrueColour((on) => !on);
        onPick();
      }}
      onMouseLeave={() => (points.current = [])}
      onMouseMove={track}
      aria-label="Change the intro line and the flower's colours"
      className="ascii-art relative block w-full cursor-pointer select-none"
      style={
        {
          // The hover trail always reveals whichever palette is not showing.
          "--petal-now": trueColour ? TRUE_PETAL : MONO,
          "--stem-now": trueColour ? TRUE_STEM : MONO,
          "--petal-alt": trueColour ? MONO : TRUE_PETAL,
          "--stem-alt": trueColour ? MONO : TRUE_STEM,
        } as React.CSSProperties
      }
    >
      <span aria-hidden className="ascii-halo" />
      <pre ref={petalsBase} aria-hidden className="ascii-layer ascii-petals" />
      <pre ref={stemBase} aria-hidden className="ascii-layer ascii-stem" />
      <pre
        ref={petalsAlt}
        aria-hidden
        className="ascii-layer ascii-petals-alt"
      />
      <pre ref={stemAlt} aria-hidden className="ascii-layer ascii-stem-alt" />
    </button>
  );
}
