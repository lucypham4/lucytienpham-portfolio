"use client";

import { useRef, useState } from "react";
import AsciiFlower, { PULL_RADIUS } from "./AsciiFlower";
import GlitchLine from "./GlitchLine";

/** Cycled rather than picked at random, so every click changes the line and
 *  all three are reachable. */
const LINES = [
  "Multidisciplinary designer creating and reimagining experiences.",
  "Bridging the gap between business objectives and user experiences.",
  "Probably making art with questionable posture.",
];

export default function HomeIntro() {
  const [index, setIndex] = useState(0);
  /** Whether the flower has been pressed yet; the hint bows out once it has. */
  const [pressed, setPressed] = useState(false);
  const area = useRef<HTMLDivElement>(null);
  const tagline = useRef<HTMLHeadingElement>(null);

  // The tagline takes the flower's colours around the cursor, over the same
  // reach and falloff as the flower's own letters. It follows the pointer
  // anywhere in the intro, so it answers as the cursor nears it from the
  // flower too.
  const follow = (e: React.MouseEvent) => {
    const line = tagline.current;
    if (!line) return;
    const box = line.getBoundingClientRect();
    line.style.setProperty("--bloom-x", `${e.clientX - box.left}px`);
    line.style.setProperty("--bloom-y", `${e.clientY - box.top}px`);
  };
  const leave = () => {
    tagline.current?.style.removeProperty("--bloom-x");
    tagline.current?.style.removeProperty("--bloom-y");
  };

  // The button waters the flower exactly as pressing the flower does.
  const water = () =>
    area.current?.querySelector<HTMLButtonElement>(".ascii-art")?.click();

  return (
    <div
      ref={area}
      onMouseMove={follow}
      onMouseLeave={leave}
      className="grid grid-cols-1 items-center gap-x-8 gap-y-8 sm:grid-cols-2"
    >
      <div className="intro-flower relative">
        <AsciiFlower
          onPick={() => {
            setIndex((i) => (i + 1) % LINES.length);
            setPressed(true);
          }}
        />
      </div>

      {/* Layered over the flower, which reaches in under the tagline's first
          letters. The button keeps its room once it has faded, so the
          tagline does not shift. */}
      <div className="relative z-10 flex flex-col items-start gap-6">
        <h1
          ref={tagline}
          style={{ "--bloom-reach": `${PULL_RADIUS}px` } as React.CSSProperties}
          className="relative text-2xl leading-9 font-normal text-ink"
        >
          <GlitchLine text={LINES[index]} echoClassName="tagline-bloom" />
        </h1>
        <button
          type="button"
          onClick={water}
          tabIndex={pressed ? -1 : 0}
          aria-hidden={pressed}
          className={`cursor-pointer rounded-card border border-line-soft px-3 py-1.5 text-xs font-semibold tracking-[1px] text-ink uppercase transition-[opacity,background-color] duration-500 hover:bg-line ${
            pressed ? "pointer-events-none opacity-0" : ""
          }`}
        >
          Water for a surprise
        </button>
      </div>
    </div>
  );
}
