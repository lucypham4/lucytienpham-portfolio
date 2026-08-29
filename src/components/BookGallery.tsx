"use client";

import { useMemo, useState } from "react";
import type { Media } from "@/content/types";
import Lightbox from "./Lightbox";
import MediaBlock from "./MediaBlock";

type Part = { label: string; caption?: string; images: Media[] };

/**
 * Tabbed parts of a book. Each part renders as a photo grid on a solid
 * black/white card — full contrast in both themes, unlike the tinted `shell`
 * panel `framed` media sits on — and every image opens a lightbox that pages
 * through the *whole book*, not just the part it was clicked from.
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

      <div className="mt-6 rounded-xl2 bg-black p-3 dark:bg-white sm:p-5">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {part.images.map((media, i) => {
            const key = `${active}-${i}`;
            if (media.type !== "image") {
              return (
                <div key={key} className="aspect-[4/3] overflow-hidden rounded-card">
                  <MediaBlock media={media} fit="fill" />
                </div>
              );
            }
            return (
              <button
                key={key}
                type="button"
                onClick={() => setLightboxAt(indexOf.get(key) ?? 0)}
                aria-label={media.alt ? `View ${media.alt} up close` : "View image up close"}
                className="grow-frame aspect-[4/3] cursor-zoom-in"
              >
                <MediaBlock media={media} fit="grow" className="rounded-card" />
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
