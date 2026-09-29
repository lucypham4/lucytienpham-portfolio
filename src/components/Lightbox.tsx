"use client";

import Image from "next/image";
import { LIGHTBOX } from "@/lib/sizes";
import { useCallback, useEffect, useState } from "react";

/** Every position in a set of `count`, nearest `from` first, alternating
 *  forward and back and wrapping round the ends. */
function byDistance(count: number, from: number) {
  const order = [from];
  for (let d = 1; order.length < count; d++) {
    order.push((from + d) % count);
    if (order.length < count) order.push((from - d + count) % count);
  }
  return order;
}

/** How much of the screen's height a picture may take. */
const MAX_HEIGHT = "85vh";

/**
 * Full-screen viewer for the Play grid. Some tiles stand for a set of images
 * rather than one, so the viewer pages through the whole group.
 *
 * Every image in the set is laid in the same spot from the moment the
 * viewer opens, only the current one showing, so they all download in the
 * background (the one clicked first) and paging is instant rather than a
 * fresh download each time. They are added nearest-first, outward from the
 * one clicked, since browsers fetch in page order: the next and previous
 * pictures arrive before the far end of the set.
 */
export default function Lightbox({
  images,
  startAt,
  onClose,
}: {
  images: string[];
  startAt: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startAt);
  const many = images.length > 1;
  // Each picture's own width over height, once it has loaded. It sizes the
  // picture to fill the viewer: the optimizer never enlarges a file past
  // its original, and a browser shows a smaller file than it asked for at
  // that file's size, so a modest original would otherwise sit small.
  const [ratios, setRatios] = useState<Record<string, number>>({});

  const step = useCallback(
    (by: number) => setIndex((i) => (i + by + images.length) % images.length),
    [images.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (!many) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);

    // Hold the page still while the viewer is open.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [many, onClose, step]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 sm:p-8"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-card text-3xl leading-none text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        &times;
      </button>

      {many && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="absolute left-2 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-card text-3xl leading-none text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:left-6"
          >
            &#8249;
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="absolute right-2 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-card text-3xl leading-none text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:right-6"
          >
            &#8250;
          </button>
        </>
      )}

      {/* Stop clicks on the picture itself from dismissing the viewer. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="grid w-full max-w-6xl place-items-center"
      >
        {byDistance(images.length, startAt).map((i) => {
          const src = images[i];
          const current = i === index;
          const ratio = ratios[src] ?? 4 / 3;
          return (
            <Image
              key={i}
              src={src}
              alt=""
              aria-hidden={!current}
              width={2400}
              height={1800}
              sizes={LIGHTBOX}
              {...(i === startAt
                ? { priority: true, fetchPriority: "high" as const }
                : { loading: "eager" as const, fetchPriority: "low" as const })}
              onLoad={(e) => {
                const img = e.currentTarget;
                if (!img.naturalHeight) return;
                setRatios((known) =>
                  known[src]
                    ? known
                    : { ...known, [src]: img.naturalWidth / img.naturalHeight },
                );
              }}
              style={{
                gridArea: "1 / 1",
                aspectRatio: ratio,
                width: `min(100%, calc(${MAX_HEIGHT} * ${ratio}))`,
                height: "auto",
              }}
              // Hidden ones stay painted (opacity, not visibility), so each
              // is already decoded when its turn comes.
              className={`max-w-none rounded-card object-contain ${
                current ? "" : "pointer-events-none opacity-0"
              }`}
            />
          );
        })}
      </div>

      {many && (
        <p className="absolute bottom-5 text-sm leading-6 text-white/70">
          {index + 1} / {images.length}
        </p>
      )}
    </div>
  );
}
