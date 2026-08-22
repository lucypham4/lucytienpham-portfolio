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

/** Character cell. Small enough that the grid reads as the clip rather than as
 *  lettering, while each glyph is still legible up close. */
const CELL_W = 3.9;
const CELL_H = 6;
const FONT_PX = 6;

const TRAIL_MS = 520;
const TRAIL_RADIUS = 90;
const BLOOM_MS = 3200;

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
  // ink. The hover trail always reveals whichever of the two is hidden.
  const [trueColour, setTrueColour] = useState(true);
  // Bumped on every click to replay the bloom from the bud.
  const [run, setRun] = useState(0);

  const base = useRef<HTMLCanvasElement>(null);
  const reveal = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLButtonElement>(null);
  const points = useRef<Point[]>([]);
  const frame = useRef(0);

  useEffect(() => {
    const width = FLOWER_COLS * CELL_W;
    const height = FLOWER_ROWS * CELL_H;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const ink = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-ink")
      .trim();

    const paint = (canvas: HTMLCanvasElement | null, colours: boolean) => {
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${FONT_PX}px var(--font-mono, ui-monospace, monospace)`;
      ctx.textBaseline = "top";

      const cells = FRAMES[frame.current];
      for (let row = 0; row < FLOWER_ROWS; row++) {
        for (let col = 0; col < FLOWER_COLS; col++) {
          const slot = cells[row * FLOWER_COLS + col];
          if (!slot) continue;
          ctx.fillStyle = colours ? PALETTE[slot - 1] : ink;
          ctx.fillText(
            PHRASE[(col + row * 5) % PHRASE.length],
            col * CELL_W,
            row * CELL_H,
          );
        }
      }
    };

    const repaint = () => {
      paint(base.current, trueColour);
      paint(reveal.current, !trueColour);
    };

    repaint();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frame.current = FRAMES.length - 1;
      repaint();
      return;
    }

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
        setRun((n) => n + 1);
        onPick();
      }}
      onMouseLeave={() => (points.current = [])}
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
