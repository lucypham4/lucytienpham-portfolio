"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * What fades in, outermost first: once an element is picked, nothing inside
 * it is, so a card or a figure arrives as one piece rather than in layers.
 * `[role="img"]` is a slideshow; `[data-reveal]` opts anything else in.
 */
const TARGETS = [
  "a.block",
  ".grow-frame",
  "[role='img']",
  "[data-reveal]",
  "figure",
  "picture",
  "img",
  "video",
  "iframe",
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "ul",
  "ol",
  "blockquote",
  "table",
].join(",");

/** How far above the bottom of the screen an element's top must come, as
 *  a share of the screen's height, before it fades in, so it isn't spent
 *  while barely peeking in. */
const LINE = 0.92;
/** Elements arriving together follow one another by this much, up to a cap,
 *  so a row of cards reads left to right rather than all at once. */
const STAGGER_MS = 80;
const MAX_STAGGER = 4;

/**
 * Fades each block of the page up into place as it is scrolled to. Only
 * what starts below the screen is touched: whatever is on screen when the
 * page opens is already painted and stays put, so the first view (and its
 * largest image) is never held back. The case-study side nav, and anything
 * else under `[data-no-reveal]`, is left alone. Without script, or with
 * reduced motion asked for, everything simply shows.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.querySelector("main");
    if (!main) return;

    let pending: HTMLElement[] = [];
    let frame = 0;

    const show = (node: HTMLElement, delay: number) => {
      node.style.transitionDelay = `${delay}ms`;
      node.classList.add("reveal-in");
      node.classList.remove("reveal-pending");
      // Clear up afterwards: a lingering transform would trap anything
      // fixed inside it (the lightbox) and hold a compositing layer.
      const done = (event: TransitionEvent) => {
        if (event.target !== node) return;
        node.classList.remove("reveal-in");
        node.style.transitionDelay = "";
        node.removeEventListener("transitionend", done);
      };
      node.addEventListener("transitionend", done);
    };

    // Checked on every scroll rather than by an IntersectionObserver: a long
    // jump (a side-nav link, a flung scroll) can carry an element from below
    // the screen to above it without it ever being on screen in between,
    // which an observer never reports, and it would stay hidden.
    const check = () => {
      frame = 0;
      const line = window.innerHeight * LINE;
      let order = 0;
      pending = pending.filter((node) => {
        if (node.getBoundingClientRect().top > line) return true;
        show(node, Math.min(order++, MAX_STAGGER) * STAGGER_MS);
        return false;
      });
      if (!pending.length) stop();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    const stop = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };

    // A frame's wait lets a client-side navigation scroll back to the top
    // first, so the new page is measured where it will be seen.
    const start = requestAnimationFrame(() => {
      const picked: HTMLElement[] = [];
      for (const el of main.querySelectorAll<HTMLElement>(TARGETS)) {
        if (el.closest("[data-no-reveal]")) continue;
        if (picked.some((p) => p.contains(el))) continue;
        picked.push(el);
      }
      pending = picked.filter(
        (el) => el.getBoundingClientRect().top > window.innerHeight,
      );
      if (!pending.length) return;
      for (const el of pending) el.classList.add("reveal-pending");
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
    });

    return () => {
      cancelAnimationFrame(start);
      cancelAnimationFrame(frame);
      stop();
      // Leaving the page mid-way: nothing may stay hidden for next time.
      for (const el of pending) el.classList.remove("reveal-pending");
    };
  }, [pathname]);

  return null;
}
