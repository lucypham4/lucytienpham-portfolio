"use client";

import { useState } from "react";
import AsciiFlower from "./AsciiFlower";
import GlitchLine from "./GlitchLine";

/** Cycled rather than picked at random, so every click changes the line and
 *  all three are reachable. */
const LINES = [
  "Multi-disciplinary designer creating and reimagining experiences.",
  "Bridging the gap between business objectives and user experiences.",
  "Probably making art with questionable posture.",
];

export default function HomeIntro() {
  const [index, setIndex] = useState(0);

  return (
    <div className="grid grid-cols-1 items-center gap-x-8 gap-y-8 sm:grid-cols-2">
      <AsciiFlower onPick={() => setIndex((i) => (i + 1) % LINES.length)} />

      <h1 className="text-2xl leading-9 font-normal text-ink">
        <GlitchLine text={LINES[index]} />
      </h1>
    </div>
  );
}
