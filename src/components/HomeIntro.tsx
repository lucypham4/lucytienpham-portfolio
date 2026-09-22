"use client";

import { useEffect, useRef, useState } from "react";
import AsciiFlower from "./AsciiFlower";
import GlitchLine from "./GlitchLine";
import {
  NOISE,
  PULL_MAX,
  PULL_RADIUS,
  SCATTER_MS,
  TRAIL_MS,
  TRAIL_RADIUS,
} from "@/lib/scatter";

/** Cycled rather than picked at random, so every click changes the line and
 *  all three are reachable. */
const LINES = [
  "Multidisciplinary designer creating and reimagining experiences.",
  "Bridging the gap between business objectives and user experiences.",
  "Probably making art with questionable posture.",
];

type Point = { x: number; y: number; born: number };

export default function HomeIntro() {
  const [index, setIndex] = useState(0);
  const area = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLHeadingElement>(null);

  // The line scatters under the cursor exactly as the flower does: the same
  // trail, the same noise, the same lean. It listens on the whole intro, so
  // the pointer reaches it whether it sits over the flower or below it.
  useEffect(() => {
    const root = area.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let points: Point[] = [];
    let cursor: { x: number; y: number } | null = null;
    let raf = 0;
    let lastScatter = 0;

    const letters = () =>
      Array.from(line.current?.querySelectorAll<HTMLElement>("[data-ch]") ?? []);

    const settle = () => {
      for (const el of letters()) {
        el.style.removeProperty("--s");
        el.style.transform = "";
        delete el.dataset.n;
      }
    };

    const tick = (now: number) => {
      points = points.filter((p) => now - p.born < TRAIL_MS);
      const reroll = now - lastScatter > SCATTER_MS;
      if (reroll) lastScatter = now;

      for (const el of letters()) {
        const box = el.getBoundingClientRect();
        const x = box.left + box.width / 2;
        const y = box.top + box.height / 2;

        // Mirrors the flower's reveal mask: each trail point is a soft disc
        // that shrinks and fades with age; the strongest one wins.
        let s = 0;
        for (const p of points) {
          const age = (now - p.born) / TRAIL_MS;
          const reach = TRAIL_RADIUS * (1 - age * 0.55) * 0.72;
          const d = Math.hypot(p.x - x, p.y - y);
          const v = (1 - age) ** 2 * Math.max(0, 1 - d / reach);
          if (v > s) s = v;
        }

        let leanX = 0;
        let leanY = 0;
        if (cursor) {
          const dx = cursor.x - x;
          const dy = cursor.y - y;
          const away = Math.hypot(dx, dy) || 1;
          const pull = Math.max(0, 1 - away / PULL_RADIUS) * PULL_MAX;
          leanX = (dx / away) * pull;
          leanY = (dy / away) * pull;
        }

        el.style.transform =
          leanX || leanY ? `translate(${leanX}px, ${leanY}px)` : "";
        if (s > 0.01) {
          el.style.setProperty("--s", s.toFixed(3));
          if (reroll || !el.dataset.n) {
            el.dataset.n = NOISE[(Math.random() * NOISE.length) | 0];
          }
        } else if (el.dataset.n) {
          el.style.removeProperty("--s");
          delete el.dataset.n;
        }
      }

      if (points.length || cursor) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
        settle();
      }
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      cursor = { x: e.clientX, y: e.clientY };
      points.push({ x: e.clientX, y: e.clientY, born: performance.now() });
      if (points.length > 18) points.shift();
      wake();
    };
    const onLeave = () => {
      cursor = null;
      points = [];
      wake();
    };

    root.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Pressing the line does what pressing the flower does.
  const pressFlower = () =>
    area.current?.querySelector<HTMLButtonElement>(".ascii-art")?.click();

  return (
    <div ref={area} className="relative mx-auto max-w-[1040px]">
      <AsciiFlower onPick={() => setIndex((i) => (i + 1) % LINES.length)} />

      {/* Below the flower on phones; from sm up it is laid over the heart of
          the bloom and lets the pointer through to the flower underneath. */}
      <h1
        ref={line}
        onClick={pressFlower}
        className="intro-over mx-auto mt-6 max-w-[30ch] cursor-pointer px-4 text-center text-xl leading-[30px] font-normal text-ink select-none sm:pointer-events-none sm:absolute sm:inset-x-0 sm:top-[calc(40%+8px)] sm:mt-0 sm:-translate-y-1/2 sm:text-[26px] sm:leading-9"
      >
        <GlitchLine text={LINES[index]} />
      </h1>
    </div>
  );
}
