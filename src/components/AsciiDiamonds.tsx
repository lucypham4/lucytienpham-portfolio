"use client";

import { useEffect, useRef } from "react";

/** Rows per diamond; columns are twice that so the shape reads square, since
 *  a monospace cell is roughly half as wide as it is tall. */
const ROWS = 15;
const COLS = ROWS * 2;

function diamond(char: string) {
  const cy = (ROWS - 1) / 2;
  const cx = (COLS - 1) / 2;
  const lines: string[] = [];

  for (let r = 0; r < ROWS; r++) {
    let line = "";
    for (let c = 0; c < COLS; c++) {
      const inside = Math.abs(c - cx) / cx + Math.abs(r - cy) / cy <= 1;
      line += inside ? char : " ";
    }
    lines.push(line);
  }
  return lines.join("\n");
}

// Built once at module load — a pure function of the constants above, so the
// server and client always produce identical markup.
const ART = `${diamond("a")}\n\n${diamond("a")}`;

type Point = { x: number; y: number; born: number };

const TRAIL_MS = 520;
const TRAIL_RADIUS = 90;

export default function AsciiDiamonds({ onPick }: { onPick: () => void }) {
  const rotor = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLPreElement>(null);
  const stage = useRef<HTMLButtonElement>(null);
  const points = useRef<Point[]>([]);
  const hovered = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    let frame = 0;
    let last = performance.now();
    let angle = 0;
    // 0 while spinning, 1 once settled flat under the cursor.
    let settle = 0;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;

      // Hovering eases the spin to flat, so the trail lands where the cursor
      // actually is rather than on a foreshortened, moving surface.
      settle = hovered.current
        ? Math.min(1, settle + dt / 260)
        : Math.max(0, settle - dt / 420);

      if (!hovered.current) angle = (angle + dt * 0.028) % 360;

      if (rotor.current) {
        rotor.current.style.transform = `rotateX(${angle * (1 - settle)}deg)`;
      }

      if (glow.current) {
        points.current = points.current.filter(
          (p) => now - p.born < TRAIL_MS,
        );

        const mask = points.current
          .map((p) => {
            const age = (now - p.born) / TRAIL_MS;
            const radius = TRAIL_RADIUS * (1 - age * 0.55);
            const alpha = (1 - age) ** 2;
            return `radial-gradient(circle ${radius}px at ${p.x}px ${p.y}px, rgba(0,0,0,${alpha}) 0%, rgba(0,0,0,0) 72%)`;
          })
          .join(",");

        glow.current.style.maskImage = mask || "none";
        glow.current.style.webkitMaskImage = mask || "none";
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const track = (e: React.MouseEvent) => {
    const box = stage.current?.getBoundingClientRect();
    if (!box) return;
    points.current.push({
      x: e.clientX - box.left,
      y: e.clientY - box.top,
      born: performance.now(),
    });
    // Cap the trail so a fast drag cannot pile up hundreds of gradients.
    if (points.current.length > 18) points.current.shift();
  };

  return (
    <button
      ref={stage}
      type="button"
      onClick={onPick}
      onMouseEnter={() => (hovered.current = true)}
      onMouseLeave={() => {
        hovered.current = false;
        points.current = [];
      }}
      onMouseMove={track}
      aria-label="Change the intro line"
      className="ascii-art group relative block w-full cursor-pointer select-none"
    >
      <div ref={rotor} className="ascii-rotor">
        <pre aria-hidden className="ascii-layer ascii-base">
          {ART}
        </pre>
        <pre ref={glow} aria-hidden className="ascii-layer ascii-glow">
          {ART}
        </pre>
      </div>
    </button>
  );
}
