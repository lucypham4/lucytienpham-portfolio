"use client";

import { useEffect, useRef } from "react";

/** How far ahead of the screen a video starts loading, so it is usually
 *  playing by the time it scrolls in. */
const AHEAD = "400px 0px";

/**
 * A silent looping clip that costs nothing until it is about to be seen.
 * Until then only its poster shows; as it nears the screen it loads and
 * plays, and it pauses again once it has scrolled away. An `autoPlay` video
 * would download in full on page load, wherever it sits on the page.
 */
export default function LazyVideo({
  poster,
  webm,
  mp4,
  className = "",
}: {
  poster: string;
  webm?: string;
  mp4: string;
  className?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const node = video.current;
    if (!node) return;
    // React sets `muted` as a property, which browsers require to be true
    // before they let a video play without a click.
    node.muted = true;

    const watch = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // A browser can refuse to autoplay (power saving, for one); the
          // poster simply stays up.
          node.play().catch(() => {});
        } else {
          node.pause();
        }
      },
      { rootMargin: AHEAD },
    );
    watch.observe(node);
    return () => watch.disconnect();
  }, []);

  return (
    <video
      ref={video}
      className={className}
      poster={poster}
      preload="none"
      loop
      muted
      playsInline
    >
      {webm && <source src={webm} type="video/webm" />}
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
