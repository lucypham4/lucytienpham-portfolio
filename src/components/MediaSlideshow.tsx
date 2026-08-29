"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Stills cycled in place, one at a time, the way a GIF would. It lives in its
 * own client component so MediaBlock — and every page that renders it — can
 * stay on the server.
 *
 * Positioning is left to the caller's `className`: the stills stack absolutely
 * inside it, so that box has to be the positioning context.
 */
export default function MediaSlideshow({
  items,
  interval = 1000,
  priority = false,
  className = "",
}: {
  items: { src: string; alt?: string }[];
  interval?: number;
  priority?: boolean;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // A picture that swaps every second is exactly the motion this setting is
    // asking us to drop, so hold the first still instead.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      interval,
    );
    return () => window.clearInterval(id);
  }, [items.length, interval]);

  return (
    // One picture as far as assistive tech is concerned, rather than a stack of
    // three that all get read out while only one is on screen.
    <div
      role="img"
      aria-label={items[0]?.alt ?? ""}
      className={`overflow-hidden bg-shell ${className}`}
    >
      {items.map((item, i) => (
        <Image
          key={item.src}
          src={item.src}
          alt=""
          width={900}
          height={1200}
          priority={priority && i === 0}
          // Cut, don't fade: a cross-fade puts both pages on screen at once,
          // which on a book spread just reads as a smear. Cover rather than
          // contain so the still fills the frame edge to edge, no letterboxing.
          className={`absolute inset-0 h-full w-full object-cover ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
