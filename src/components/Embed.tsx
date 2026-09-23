"use client";

import { useEffect, useRef, useState } from "react";

/** A new player width is asked for only when the frame changes by more than
 *  this, so small resizes don't reload the player. */
const RESIZE_STEP = 40;

/**
 * A third-party player in a frame of the given shape. Facebook's player lays
 * itself out at the width named in its URL rather than the frame's, so for
 * those the width (and matching height) is measured here and written into
 * the URL; other players are passed through as given.
 */
export default function Embed({
  src,
  title,
  ratio,
}: {
  src: string;
  title: string;
  /** Width over height. */
  ratio: number;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const sized = src.startsWith("https://www.facebook.com/plugins/");
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = frame.current;
    if (!sized || !node) return;
    const measure = () => {
      const next = Math.round(node.clientWidth);
      setWidth((current) =>
        Math.abs(next - current) > RESIZE_STEP ? next : current,
      );
    };
    measure();
    const watch = new ResizeObserver(measure);
    watch.observe(node);
    return () => watch.disconnect();
  }, [sized]);

  let url: string | undefined = src;
  if (sized) {
    if (width) {
      const u = new URL(src);
      u.searchParams.set("width", String(width));
      u.searchParams.set("height", String(Math.round(width / ratio)));
      url = u.toString();
    } else {
      url = undefined;
    }
  }

  return (
    <div
      ref={frame}
      style={{ aspectRatio: ratio }}
      className="w-full overflow-hidden rounded-card bg-shell"
    >
      {url && (
        <iframe
          src={url}
          title={title}
          // Third-party players are heavy; fetch them only as they near the
          // screen.
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full border-0"
        />
      )}
    </div>
  );
}
