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

  return (
    <div className="relative mx-auto max-w-[1040px]">
      <AsciiFlower onPick={() => setIndex((i) => (i + 1) % LINES.length)} />

      {/* Laid over the heart of the bloom. It lets the pointer through, so
          hovering and pressing still reach the flower underneath. */}
      <h1 className="intro-over pointer-events-none absolute inset-x-0 top-[40%] mx-auto max-w-[30ch] -translate-y-1/2 px-4 text-center text-2xl leading-9 font-normal text-ink sm:text-[32px] sm:leading-[44px]">
        <GlitchLine text={LINES[index]} />
      </h1>
    </div>
  );
}
