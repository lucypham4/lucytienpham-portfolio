"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A muted, looping recording that loads only once it nears the viewport and
 * respects `prefers-reduced-motion`: with reduced motion it holds on the
 * poster behind a play button instead of autoplaying.
 *
 * It also pauses while scrolled out of view, so a page of looping phone
 * recordings isn't decoding every one of them at once.
 */
export default function LazyVideo({
  poster,
  mp4,
  webm,
  alt,
  eager = false,
  className = "",
}: {
  poster: string;
  mp4: string;
  webm?: string;
  alt?: string;
  /** Load straight away rather than on approach, for a hero. */
  eager?: boolean;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(eager);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(true);
  // Unknown until the client has read the preference, so the server markup
  // never autoplays for someone who asked for less motion.
  const [reduced, setReduced] = useState<boolean | null>(null);

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
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Setting `autoPlay` after mount doesn't start playback by itself, so the
  // autoplaying case is driven from here too.
  useEffect(() => {
    const el = video.current;
    if (!el || reduced !== false) return;
    if (inView) el.play().catch(() => {});
    else el.pause();
  }, [near, inView, reduced]);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  return (
    <div ref={box} className={`relative ${className}`}>
      {near && (
        <video
          ref={video}
          className="h-full w-full object-cover"
          poster={poster}
          autoPlay={reduced === false}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
        >
          {webm && <source src={webm} type="video/webm" />}
          <source src={mp4} type="video/mp4" />
        </video>
      )}

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
