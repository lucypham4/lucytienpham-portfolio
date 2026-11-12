"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** How far ahead of the screen a video starts playing, so it is usually
 *  running by the time it scrolls in. */
const AHEAD = "400px 0px";

/**
 * A muted, looping clip that costs nothing until it is about to be seen.
 * Until then only its poster shows (`preload="none"`); as it nears the
 * screen it loads and plays, and it pauses again once it has scrolled away,
 * so a page of looping recordings isn't decoding every one of them at once.
 *
 * It respects `prefers-reduced-motion`: with reduced motion it holds on the
 * poster behind a play button instead of autoplaying.
 *
 * Given `sizes`, the poster is instead a responsive image laid under the
 * video, so a small screen fetches a small file (a `poster` has no srcset).
 * A video without a poster is transparent until its first frame, so the
 * image shows through until then.
 */
export default function LazyVideo({
  poster,
  mp4,
  webm,
  alt,
  eager = false,
  priority = false,
  sizes,
  className = "",
}: {
  poster: string;
  mp4: string;
  webm?: string;
  alt?: string;
  /** Load straight away rather than on approach, for a hero. */
  eager?: boolean;
  /** Same as `eager`, and marks the poster image as high priority. */
  priority?: boolean;
  /** How wide the video shows, as an `<img sizes>` value; see above. */
  sizes?: string;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(true);
  // Unknown until the client has read the preference, so the server markup
  // never autoplays for someone who asked for less motion.
  const [reduced, setReduced] = useState<boolean | null>(null);
  const soon = eager || priority;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: AHEAD },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Playback is driven from here rather than `autoPlay`, which would download
  // every clip on page load wherever it sits on the page.
  useEffect(() => {
    const el = video.current;
    if (!el || reduced !== false) return;
    // React sets `muted` as a property, which browsers require to be true
    // before they let a video play without a click.
    el.muted = true;
    // A browser can refuse to autoplay (power saving, for one); the poster
    // simply stays up.
    if (inView) el.play().catch(() => {});
    else el.pause();
  }, [inView, reduced]);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  // `.grow-media` positions the box itself (globals.css); anything else needs
  // to be a positioning context for the button and the poster image.
  const positioned = /\bgrow-media\b/.test(className) ? "" : "relative";

  return (
    // Kept out of the scroll reveal: a fade or transform on a playing video
    // can leave Safari showing a stuck frame while the clip runs underneath.
    <div ref={box} data-no-reveal className={`${positioned} overflow-hidden ${className}`}>
      {sizes && (
        <Image
          src={poster}
          alt=""
          // Only the shape of the srcset comes from these; the box sizes it.
          width={1600}
          height={900}
          sizes={sizes}
          priority={priority}
          fetchPriority={priority ? "high" : undefined}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <video
        ref={video}
        className="relative h-full w-full object-cover"
        poster={sizes ? undefined : poster}
        preload={soon ? "metadata" : "none"}
        muted
        loop
        playsInline
        aria-label={alt}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
      >
        {webm && <source src={webm} type="video/webm" />}
        <source src={mp4} type="video/mp4" />
      </video>

      {reduced && (
        <button
          type="button"
          onClick={toggle}
          aria-label={paused ? "Play video" : "Pause video"}
          className={`absolute flex cursor-pointer items-center justify-center rounded-full bg-ink/75 text-bg transition-opacity hover:bg-ink ${
            paused
              ? "top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2"
              : "right-4 bottom-4 h-10 w-10 opacity-70"
          }`}
        >
          <svg aria-hidden viewBox="0 0 24 24" className={paused ? "ml-1 h-7 w-7" : "h-4 w-4"}>
            {paused ? (
              <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
            ) : (
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
            )}
          </svg>
        </button>
      )}
    </div>
  );
}
