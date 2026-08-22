"use client";

import { useEffect, useRef } from "react";

const COLS = 62;
const ROWS = 38;

/** Two octahedra stacked point to point — the poster's pair of diamonds, given
 *  depth so they can actually turn rather than just squash. */
const CENTRES = [-0.98, 0.98];

/** Surface points of an octahedron: any direction, pushed out to |x|+|y|+|z|=1. */
function octahedron(step: number) {
  const points: [number, number, number][] = [];

  for (let i = 0; i <= step; i++) {
    const phi = (i / step) * Math.PI - Math.PI / 2;
    // Fewer samples near the poles, where the rings shrink to nothing.
    const ring = Math.max(4, Math.round(Math.cos(phi) * step * 2));

    for (let j = 0; j < ring; j++) {
      const theta = (j / ring) * Math.PI * 2;
      const x = Math.cos(phi) * Math.cos(theta);
      const y = Math.sin(phi);
      const z = Math.cos(phi) * Math.sin(theta);
      const norm = Math.abs(x) + Math.abs(y) + Math.abs(z);
      points.push([x / norm, y / norm, z / norm]);
    }
  }
  return points;
}

const SHAPE = octahedron(26);

/** Denser glyphs read as nearer, which is what gives the form its shading. */
const RAMP = "·:aaAA";

type Point = { x: number; y: number; born: number };

const TRAIL_MS = 520;
const TRAIL_RADIUS = 90;
const FOCAL = 3.4;

export default function AsciiDiamonds({ onPick }: { onPick: () => void }) {
  const base = useRef<HTMLPreElement>(null);
  const glow = useRef<HTMLPreElement>(null);
  const stage = useRef<HTMLButtonElement>(null);
  const points = useRef<Point[]>([]);
  const hovered = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let last = performance.now();
    let angle = 0;

    const cells = new Array<string>(COLS * ROWS);
    const depth = new Float32Array(COLS * ROWS);

    const render = (a: number) => {
      cells.fill(" ");
      depth.fill(-Infinity);

      const cos = Math.cos(a);
      const sin = Math.sin(a);

      for (const centre of CENTRES) {
        for (const [px, py, pz] of SHAPE) {
          // Spin about the vertical axis, so x and z mix and y is untouched.
          const x = px * cos + pz * sin;
          const z = -px * sin + pz * cos;
          const y = py + centre;

          const scale = FOCAL / (FOCAL - z);
          const col = Math.round((COLS - 1) / 2 + x * scale * (COLS / 2.6));
          const row = Math.round((ROWS - 1) / 2 + y * scale * (ROWS / 4.4));
          if (col < 0 || col >= COLS || row < 0 || row >= ROWS) continue;

          const at = row * COLS + col;
          if (z <= depth[at]) continue;
          depth[at] = z;
          const shade = Math.min(
            RAMP.length - 1,
            Math.max(0, Math.round(((z + 1) / 2) * (RAMP.length - 1))),
          );
          cells[at] = RAMP[shade];
        }
      }

      let out = "";
      for (let r = 0; r < ROWS; r++) {
        out += cells.slice(r * COLS, (r + 1) * COLS).join("") + "\n";
      }
      if (base.current) base.current.textContent = out;
      if (glow.current) glow.current.textContent = out;
    };

    render(0);
    if (reduced.matches) return;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;

      if (!hovered.current) angle += dt * 0.00042;
      render(angle);

      if (glow.current) {
        points.current = points.current.filter((p) => now - p.born < TRAIL_MS);

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
      className="ascii-art relative block w-full cursor-pointer select-none"
    >
      <span aria-hidden className="ascii-halo" />
      <pre ref={base} aria-hidden className="ascii-layer ascii-base" />
      <pre ref={glow} aria-hidden className="ascii-layer ascii-glow" />
    </button>
  );
}
