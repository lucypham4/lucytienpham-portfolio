"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * The photograph column on the About page, and the notes beside it.
 *
 * A note belongs to exactly one photograph, so it is only shown while that
 * photograph is crossing the line the bio is pinned to: it fades in as the
 * photograph reaches the line, sticks there while the photograph scrolls past,
 * and fades out once the photograph has gone by. Clicking a photograph scrolls
 * it onto that line, which is what brings its note out. Narrower than three
 * columns there is no line to align to, so the notes simply sit under their
 * pictures — see the `.photo-note` rules in globals.css.
 */

/** The bio's `lg:top-[136px]`: the line notes are revealed on. */
const STICKY_TOP = 136;

/** Three columns start at Tailwind's `lg`. */
const THREE_COLUMNS = "(width >= 64rem)";

export type Photo = {
  src: string;
  width: number;
  height: number;
  date: string;
  caption: string;
};

export default function AboutPhotos({ photos }: { photos: Photo[] }) {
  const column = useRef<HTMLDivElement>(null);
  const figures = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);
  // Room under the last photograph, so it can be scrolled up to the line like
  // any other rather than stranding its note at the foot of the page.
  const [tail, setTail] = useState(0);

  useEffect(() => {
    const wide = window.matchMedia(THREE_COLUMNS);
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!wide.matches) {
        setActive(null);
        setTail(0);
        return;
      }

      let next: number | null = null;
      figures.current.forEach((figure, i) => {
        if (!figure) return;
        const { top, bottom } = figure.getBoundingClientRect();
        if (top <= STICKY_TOP && bottom > STICKY_TOP) next = i;
      });
      setActive(next);

      const last = figures.current[figures.current.length - 1];
      if (last) {
        setTail(
          Math.max(0, window.innerHeight - STICKY_TOP - last.offsetHeight),
        );
      }
    };

    const schedule = () => {
      frame ||= requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    wide.addEventListener("change", schedule);
    // requestAnimationFrame does not fire in a backgrounded tab, so anything
    // that moved while the page was away is measured when it comes back.
    document.addEventListener("visibilitychange", schedule);

    // The photographs are lazily loaded, so the column keeps growing after the
    // first paint and every measurement above has to be taken again.
    const resizes = new ResizeObserver(schedule);
    if (column.current) resizes.observe(column.current);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      wide.removeEventListener("change", schedule);
      document.removeEventListener("visibilitychange", schedule);
      resizes.disconnect();
    };
  }, []);

  const jumpTo = (i: number) => {
    const figure = figures.current[i];
    if (!figure) return;
    const top = figure.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top - STICKY_TOP, behavior: "smooth" });
  };

  return (
    <div
      ref={column}
      style={{ paddingBottom: tail }}
      className="flex flex-col gap-12 lg:col-start-1 lg:row-start-1"
    >
      {photos.map(({ src, width, height, date, caption }, i) => (
        <figure
          key={src}
          ref={(figure) => {
            figures.current[i] = figure;
          }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8"
        >
          {/* The frame holds the picture's own proportions; see `.grow-frame`
              in globals.css for what hovering does. */}
          <button
            type="button"
            onClick={() => jumpTo(i)}
            aria-label={caption}
            style={{ aspectRatio: `${width} / ${height}` }}
            className="grow-frame block w-full cursor-pointer self-start"
          >
            <Image
              src={src}
              alt=""
              width={width}
              height={height}
              className="grow-media rounded-card"
            />
          </button>
          <figcaption
            data-active={active === i}
            className="photo-note lg:sticky lg:top-[136px] lg:self-start"
          >
            <p className="text-xs font-semibold tracking-[1px] text-ink uppercase">
              {date}
            </p>
            <p className="mt-2 text-base leading-7 text-grey">{caption}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
