"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type NavSection = { id: string; label: string };

/**
 * Distance below the viewport top that counts as "you are reading here".
 * Must clear the sticky site header plus the sections' scroll-margin, or a
 * clicked section lands just above the marker and the previous one lights up.
 */
const READING_LINE = 220;

export default function CaseStudyNav({ sections }: { sections: NavSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [collapsed, setCollapsed] = useState(false);

  // While a click-triggered smooth scroll is in flight the intermediate
  // positions would drag the highlight backwards, so the spy pauses.
  const lockedUntil = useRef(0);

  const measure = useCallback(() => {
    if (Date.now() < lockedUntil.current) return;

    const marker = window.scrollY + READING_LINE;
    let current = sections[0]?.id ?? "";

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top + window.scrollY;
      if (top <= marker) current = section.id;
    }

    setActive(current);
  }, [sections]);

  useEffect(() => {
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    return () => window.removeEventListener("scroll", measure);
  }, [measure]);

  return (
    // `hidden lg:block` lives on this plain wrapper so it carries no
    // overflow/positioning of its own — sticky below is computed against the
    // nearest ancestor with non-visible overflow, so nesting it inside an
    // overflow-hidden aside (the previous version) pinned it to that short
    // aside's box instead of the viewport, and it stopped tracking scroll.
    <aside className="hidden lg:block">
      {/* Sticky, width-transition, and the clip that produces the collapse
          all live on this one element instead, since overflow-hidden here
          only clips this element's own children — it doesn't affect its own
          stickiness the way an ancestor's would. */}
      <nav
        aria-label="Case study sections"
        className={`sticky top-[136px] flex shrink-0 flex-col self-start overflow-hidden transition-[width] duration-300 ease-out ${
          collapsed ? "w-10" : "w-[190px]"
        }`}
      >
        {/* Fixed at the panel's full width regardless of collapse state, so
            the button — first in source order, flush with the left edge —
            stays put and visible while the nav's own width clips everything
            past it from the right. */}
        <div className="flex w-[190px] flex-col">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand section list" : "Collapse section list"}
            className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink"
          >
            {/* Bordered just around the icon, not the whole button — at 40px
                collapsed the nav can't fit a wider bordered box without
                clipping it, so the border stays on the one part that's
                always fully visible. */}
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-card border border-line-soft">
              <svg
                aria-hidden
                viewBox="0 0 12 12"
                className={`h-3 w-3 transition-transform duration-300 ${
                  collapsed ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M7.5 3 4.5 6l3 3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className={collapsed ? "opacity-0" : "opacity-100"}>Sections</span>
          </button>

          <div
            className={`flex flex-col gap-4 pt-4 transition-opacity duration-200 ${
              collapsed ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            {sections.map((section) => {
              const isActive = section.id === active;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => {
                    setActive(section.id);
                    lockedUntil.current = Date.now() + 900;
                  }}
                  className={`text-base leading-6 whitespace-nowrap transition-colors ${
                    isActive ? "font-semibold text-ink" : "text-grey hover:text-ink"
                  }`}
                >
                  {section.label}
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}
