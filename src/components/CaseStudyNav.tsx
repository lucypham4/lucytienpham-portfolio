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
    <aside className="hidden lg:block">
      <nav
        aria-label="Case study sections"
        className="sticky top-[136px] flex flex-col gap-4 self-start"
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
              className={`text-base leading-6 transition-colors ${
                isActive ? "font-semibold text-ink" : "text-grey hover:text-ink"
              }`}
            >
              {section.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
