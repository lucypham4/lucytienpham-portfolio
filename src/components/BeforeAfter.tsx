"use client";

import { useState } from "react";
import type { Media } from "@/content/types";
import MediaBlock from "./MediaBlock";

/**
 * Before/after pairs shown one at a time behind a pair of tabs, so the two
 * states can be compared in place rather than side by side at half width.
 */
export default function BeforeAfter({
  before,
  after,
}: {
  before: Media;
  after: Media;
}) {
  const [showing, setShowing] = useState<"before" | "after">("before");

  const tabs = [
    { key: "before" as const, label: "Before", media: before },
    { key: "after" as const, label: "After", media: after },
  ];

  return (
    <figure className="mt-8">
      <div role="tablist" aria-label="Before and after" className="flex gap-2">
        {tabs.map((tab) => {
          const isActive = showing === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setShowing(tab.key)}
              className={`rounded-pill px-5 py-2 text-base leading-6 transition-colors ${
                isActive
                  ? "bg-shell font-semibold text-ink"
                  : "text-grey hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {tabs.map((tab) => (
          <div key={tab.key} hidden={showing !== tab.key}>
            <MediaBlock media={tab.media} />
          </div>
        ))}
      </div>
    </figure>
  );
}
