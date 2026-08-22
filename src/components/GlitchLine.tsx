"use client";

import { useEffect, useRef, useState } from "react";

/** Drawn from while a line is resolving, so the noise reads as the same
 *  typeface rather than as symbols. */
const NOISE = "abcdefghijklmnopqrstuvwxyz0123456789/\\|<>*#%&$";

const SCRAMBLE_MS = 620;
const FRAME_MS = 38;

/**
 * Swaps one line for another by flickering through noise: each character
 * settles at its own moment, left to right, so the line resolves rather than
 * simply cutting over.
 */
export default function GlitchLine({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [shown, setShown] = useState(text);
  const settled = useRef(text);

  useEffect(() => {
    if (text === settled.current) return;
    const from = settled.current;
    settled.current = text;

    const started = performance.now();
    const length = Math.max(from.length, text.length);

    const timer = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - started) / SCRAMBLE_MS);

      let out = "";
      for (let i = 0; i < length; i++) {
        const target = text[i] ?? "";
        // Each character has its own settling point across the sweep.
        const settlesAt = (i / length) * 0.75;
        if (progress >= settlesAt + 0.25) {
          out += target;
        } else if (progress >= settlesAt) {
          // Keep spaces intact so the line does not turn into a solid block.
          out += target === " " ? " " : NOISE[(Math.random() * NOISE.length) | 0];
        } else {
          out += from[i] ?? "";
        }
      }

      setShown(progress >= 1 ? text : out);
      if (progress >= 1) window.clearInterval(timer);
    }, FRAME_MS);

    return () => window.clearInterval(timer);
  }, [text]);

  return (
    <span aria-live="polite" className={className}>
      {shown}
    </span>
  );
}
