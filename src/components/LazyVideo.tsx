"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/** How far ahead of the screen a video starts loading, so it is usually
 *  playing by the time it scrolls in. */
const AHEAD = "400px 0px";

/**
 * A silent looping clip that costs nothing until it is about to be seen.
 * Until then only its poster shows; as it nears the screen it loads and
 * plays, and it pauses again once it has scrolled away. An `autoPlay` video
 * would download in full on page load, wherever it sits on the page.
 *
 * Given `sizes`, the poster is instead a responsive image laid under the
 * video, so a small screen fetches a small file (a `poster` has no srcset).
 * A video is transparent until its first frame, so the image shows through
 * until then. Both fill the same box, so this is only for a `className`
 * that positions the video absolutely, like `.grow-media`.
 */
export default function LazyVideo({
  poster,
  webm,
  mp4,
  className = "",
  sizes,
  priority = false,
}: {
  poster: string;
  webm?: string;
  mp4: string;
  className?: string;
  /** How wide the video shows, as an `<img sizes>` value; see above. */
  sizes?: string;
  priority?: boolean;
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

  const clip = (
    <video
      ref={video}
      className={className}
      poster={sizes ? undefined : poster}
      preload="none"
      loop
      muted
      playsInline
    >
      {webm && <source src={webm} type="video/webm" />}
      <source src={mp4} type="video/mp4" />
    </video>
  );

  if (!sizes) return clip;
  return (
    <>
      <Image
        src={poster}
        alt=""
        // Only the shape of the srcset comes from these; the class sizes it.
        width={1600}
        height={900}
        sizes={sizes}
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
        className={className}
      />
      {clip}
    </>
  );
}
