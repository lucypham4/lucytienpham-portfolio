import type { Comparison } from "@/content/types";
import MediaBlock from "./MediaBlock";

/**
 * Before and after side by side at every width, each under a coloured pill
 * and a short label, on a tinted panel so the pair reads as one comparison.
 */
export default function Compare({ before, after }: Comparison) {
  const sides = { before, after };
  return (
    <figure className="mt-8 rounded-xl2 bg-shell p-3 sm:p-8">
      <div className="grid grid-cols-2 gap-3 sm:gap-8">
        {(["before", "after"] as const).map((side) => (
          <div key={side} className="flex min-w-0 flex-col">
            <span
              className={`self-start rounded-pill px-3 py-1 text-sm font-semibold tracking-[1px] uppercase ${
                side === "before"
                  ? "bg-before text-before-ink"
                  : "bg-after text-after-ink"
              }`}
            >
              {side === "before" ? "Before" : "After"}
            </span>
            <p className="mt-3 mb-4 text-base leading-6 text-ink sm:text-lg sm:leading-7">
              {sides[side].label}
            </p>
            <div className="mt-auto">
              <MediaBlock media={sides[side].media} />
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
