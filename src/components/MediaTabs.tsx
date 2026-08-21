"use client";

import { useState } from "react";
import type { TabItem } from "@/content/types";
import MediaBlock from "./MediaBlock";

const gridCols = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

/**
 * Media shown one panel at a time behind centred tabs. Panels stay mounted and
 * are hidden with a class rather than the `hidden` attribute, which `grid`
 * would otherwise override.
 */
export default function MediaTabs({
  items,
  ariaLabel,
}: {
  items: TabItem[];
  ariaLabel: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <figure className="mt-8">
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="flex flex-wrap justify-center gap-3"
      >
        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <button
              key={item.label}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(i)}
              className={`relative rounded-pill px-5 py-2 text-base leading-6 transition-colors ${
                isActive
                  ? "shine-border bg-shell font-semibold text-ink"
                  : "text-grey hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {items.map((item, i) => {
          const many = item.media.length > 1;
          const visible = i === active;
          return (
            <div
              key={item.label}
              className={
                visible
                  ? many
                    ? `grid grid-cols-1 gap-4 ${gridCols[item.cols ?? 2]}`
                    : ""
                  : "hidden"
              }
            >
              {item.media.map((m, j) => (
                <MediaBlock key={j} media={m} fit={many ? "cover" : "bounded"} />
              ))}
            </div>
          );
        })}
      </div>
    </figure>
  );
}
