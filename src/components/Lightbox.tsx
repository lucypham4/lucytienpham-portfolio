"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

/**
 * Full-screen viewer for the Play grid. Some tiles stand for a set of images
 * rather than one, so the viewer pages through the whole group.
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
        className="relative flex max-h-full w-full max-w-6xl items-center justify-center"
      >
        <Image
          src={images[index]}
          alt=""
          width={2400}
          height={1800}
          className="max-h-[85vh] w-auto max-w-full rounded-card object-contain"
          priority
        />
      </div>

      {many && (
        <p className="absolute bottom-5 text-sm leading-6 text-white/70">
          {index + 1} / {images.length}
        </p>
      )}
    </div>
  );
}
