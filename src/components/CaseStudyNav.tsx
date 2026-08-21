"use client";

import { useEffect, useState } from "react";

export type NavSection = { id: string; label: string };

export default function CaseStudyNav({
  title,
  sections,
}: {
  title: string;
  sections: NavSection[];
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (!targets.length) return;

    // Track which section heading sits closest above the top of the viewport,
    // so the highlight follows reading position rather than whatever happens
    // to be intersecting.
    const onScroll = () => {
      const marker = window.scrollY + 140;
      let current = targets[0];
      for (const el of targets) {
        if (el.offsetTop <= marker) current = el;
      }
      setActive(current.id);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  return (
    <aside className="hidden lg:block">
      <nav
        aria-label="Case study sections"
        className="sticky top-28 flex flex-col gap-4 self-start"
      >
        <p className="text-xs font-semibold tracking-[1px] text-grey uppercase">
          {title}
        </p>
        {sections.map((section) => {
          const isActive = section.id === active;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={isActive ? "true" : undefined}
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
