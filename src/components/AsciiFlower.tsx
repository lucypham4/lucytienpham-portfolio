"use client";

import { useEffect, useRef, useState } from "react";
import {
  FLOWER_COLS,
  FLOWER_FRAMES,
  FLOWER_ROWS,
} from "@/content/flower-frames";

/** Tiled through the drawing so the flower is spelled out of her name. */
const PHRASE = "lucy cat tien pham ";

const TRAIL_MS = 520;
const TRAIL_RADIUS = 90;
/** Long enough to read as a bloom rather than a flicker between stills. */
const BLOOM_MS = 3400;

/** One layer per colour band: a <pre> can only be one colour, so each of the
 *  five bands the footage was sorted into gets its own copy of the grid. */
const BANDS = [1, 2, 3, 4, 5] as const;

type Point = { x: number; y: number; born: number };

function decode(rle: string) {
  const cells = new Uint8Array(FLOWER_COLS * FLOWER_ROWS);
  let at = 0;
  for (let i = 0; i < rle.length; i += 2) {
    const code = rle.charCodeAt(i) - 48;
    const run = parseInt(rle[i + 1], 36);
    cells.fill(code, at, at + run);
    at += run;
  }
  return cells;
}

/** Split one frame into a string per colour band, spelled out of the phrase. */
function split(cells: Uint8Array) {
  return BANDS.map((band) => {
    let out = "";
    for (let row = 0; row < FLOWER_ROWS; row++) {
      for (let col = 0; col < FLOWER_COLS; col++) {
        const at = row * FLOWER_COLS + col;
        out +=
          cells[at] === band ? PHRASE[(col + row * 5) % PHRASE.length] : " ";
      }
      out += "\n";
    }
    return out;
  });
}

const SPLIT = FLOWER_FRAMES.map((rle) => split(decode(rle)));

export default function AsciiFlower({ onPick }: { onPick: () => void }) {
  // Opens contrasting with the page; a click flips it to the flower's own
  // colours, sampled from the footage.
  const [trueColour, setTrueColour] = useState(false);

  const nowLayers = useRef<(HTMLPreElement | null)[]>([]);
  const altLayers = useRef<(HTMLPreElement | null)[]>([]);
  const stage = useRef<HTMLButtonElement>(null);
  const points = useRef<Point[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const paint = (index: number) => {
      SPLIT[index].forEach((text, i) => {
        const now = nowLayers.current[i];
        const alt = altLayers.current[i];
        if (now) now.textContent = text;
        if (alt) alt.textContent = text;
      });
    };

    if (reduced.matches) {
      paint(SPLIT.length - 1);
      return;
    }

    let raf = 0;
    // Paint the bud straight away: waiting for the first animation frame
    // leaves the piece blank if that frame is delayed.
    paint(0);
    let shown = 0;
    const opened = performance.now();

    const tick = (now: number) => {
      // Blooms once and holds on the last frame; only a reload replays it.
      const progress = Math.min(1, (now - opened) / BLOOM_MS);
      const index = Math.min(
        SPLIT.length - 1,
        Math.floor(progress * SPLIT.length),
      );
      if (index !== shown) {
        paint(index);
        shown = index;
      }

      points.current = points.current.filter((p) => now - p.born < TRAIL_MS);

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
      for (const node of altLayers.current) {
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
      data-true={trueColour ? "" : undefined}
      className="ascii-art relative block w-full cursor-pointer select-none"
    >
      <span aria-hidden className="ascii-halo" />

      {BANDS.map((band, i) => (
        <pre
          key={`now-${band}`}
          aria-hidden
          ref={(el) => {
            nowLayers.current[i] = el;
          }}
          className={`ascii-layer ascii-band-${band}`}
        />
      ))}

      {BANDS.map((band, i) => (
        <pre
          key={`alt-${band}`}
          aria-hidden
          ref={(el) => {
            altLayers.current[i] = el;
          }}
          className={`ascii-layer ascii-alt ascii-band-${band}`}
        />
      ))}
    </button>
  );
}
