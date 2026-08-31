"use client";

import { useMemo, useState } from "react";
import type { Media } from "@/content/types";
import Lightbox from "./Lightbox";
import MediaBlock from "./MediaBlock";

type Part = { label: string; caption?: string; images: Media[] };

/**
 * Tabbed parts of a book. Each part renders as a photo grid on a solid black
 * card — fixed black in both themes, since these are book photos shot on a
 * black backdrop, unlike the tinted `shell` panel `framed` media sits on —
 * and every image opens a lightbox that pages through the *whole book*, not
 * just the part it was clicked from.
 */
export default function BookGallery({ parts }: { parts: Part[] }) {
  const [active, setActive] = useState(0);
  const [lightboxAt, setLightboxAt] = useState<number | null>(null);

  // One flat, book-ordered list of every real image, plus a lookup from
  // (part, image-within-part) to its position in that list — a pending slot
  // has no place in it, since there is nothing yet to page through.
  const { flatSrcs, indexOf } = useMemo(() => {
    const flatSrcs: string[] = [];
    const indexOf = new Map<string, number>();
    parts.forEach((part, pi) => {
      part.images.forEach((media, ii) => {
        if (media.type !== "image") return;
        indexOf.set(`${pi}-${ii}`, flatSrcs.length);
        flatSrcs.push(media.src);
      });
    });
    return { flatSrcs, indexOf };
  }, [parts]);

  const part = parts[active];

  return (
    <figure className="mt-8">
      <div
        role="tablist"
        aria-label="Book parts"
        className="flex flex-wrap justify-center gap-3"
      >
        {parts.map((p, i) => (
          <button
            key={p.label}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`rounded-pill px-5 py-2 text-base leading-6 transition-colors ${
              i === active
                ? "bg-shell font-semibold text-ink"
                : "cursor-pointer text-grey hover:text-ink"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl2 bg-black p-3 sm:p-5">
        {/* Equal padding on every side (`p-3`/`p-5`) and an equal `gap` between
            cells — the mismatched borders came from cropping each book to a
            fixed box, not from the padding itself. Nothing here crops: every
            image keeps its own proportions and is simply scaled down to fit,
            so a wide spread and a narrower cover sit at different sizes
            within the same, evenly spaced grid rather than being forced into
            identical boxes. */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {part.images.map((media, i) => {
            const key = `${active}-${i}`;
            if (media.type !== "image") {
              return (
                <div key={key} className="flex items-center justify-center">
                  <MediaBlock media={media} />
                </div>
              );
            }
            return (
              <button
                key={key}
                type="button"
                onClick={() => setLightboxAt(indexOf.get(key) ?? 0)}
                aria-label={media.alt ? `View ${media.alt} up close` : "View image up close"}
                className="relative flex cursor-zoom-in items-center justify-center hover:z-10"
              >
                <MediaBlock
                  media={media}
                  className="rounded-card transition-transform duration-300 hover:scale-105"
                />
              </button>
            );
          })}
        </div>
      </div>

      {part.caption && (
        <p className="mt-3 text-center text-sm leading-6 text-grey">{part.caption}</p>
      )}

      {lightboxAt !== null && (
        <Lightbox
          images={flatSrcs}
          startAt={lightboxAt}
          onClose={() => setLightboxAt(null)}
        />
      )}
    </figure>
  );
}
