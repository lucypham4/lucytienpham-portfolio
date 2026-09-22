"use client";

import { useState } from "react";
import AsciiFlower from "./AsciiFlower";
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

  return (
    <div className="grid grid-cols-1 items-center gap-x-8 gap-y-8 sm:grid-cols-2">
      <div className="intro-flower relative">
        <AsciiFlower
          onPick={() => {
            setIndex((i) => (i + 1) % LINES.length);
            setPressed(true);
          }}
        />
        <span
          aria-hidden
          className={`flower-hint pointer-events-none absolute bottom-0 left-0 text-xs font-semibold tracking-[1px] text-grey uppercase transition-opacity duration-500 ${
            pressed ? "opacity-0" : ""
          }`}
        >
          Water for a surprise
        </span>
      </div>

      {/* Layered over the flower, which reaches in under its first letters. */}
      <h1 className="relative z-10 text-2xl leading-9 font-normal text-ink">
        <GlitchLine text={LINES[index]} />
      </h1>
    </div>
  );
}
