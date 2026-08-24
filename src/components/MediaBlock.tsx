import Image from "next/image";
import type { Media } from "@/content/types";
import MediaSlideshow from "./MediaSlideshow";

/**
 * How the asset sits in its box. Picking one here rather than overriding with
 * `className` keeps conflicting Tailwind sizing utilities off the element.
 *
 * - `cover`   — natural height at full width, rounded (the default in-flow look)
 * - `contain` — whole asset fitted inside a fixed box, for panelled splashes
 * - `fill`    — fills a fixed box edge to edge, for full-bleed splashes
 * - `grow`    — fills a `.grow-frame` from outside the flow, so hovering can
 *               push it past the frame's edges without moving the layout
 */
type Fit = "cover" | "contain" | "fill" | "bounded" | "grow";

const fitClassNames: Record<Fit, string> = {
  cover: "h-auto w-full rounded-card object-cover",
  contain: "h-full w-full object-contain",
  fill: "h-full w-full object-cover",
  grow: "grow-media",
  // Keeps tall screenshots inside the viewport instead of running past it.
  bounded: "mx-auto h-auto max-h-[70vh] w-auto max-w-full rounded-card",
};

export default function MediaBlock({
  media,
  className = "",
  priority = false,
  fit = "cover",
}: {
  media: Media;
  className?: string;
  priority?: boolean;
  fit?: Fit;
}) {
  const fitClasses = fitClassNames[fit];

  // `cover` sizes itself from the asset's own height, which a composed box has
  // none of, so those two give themselves the same 16:9 footprint a thumbnail
  // would have had. `grow` is already absolute, so it is a positioning context
  // for stacked contents; the rest have to be told to be one.
  const boxClasses =
    fit === "cover" ? "aspect-video w-full rounded-card" : fitClasses;
  const stackClasses = fit === "grow" ? boxClasses : `relative ${boxClasses}`;

  if (media.type === "slideshow") {
    return (
      <MediaSlideshow
        items={media.items}
        interval={media.interval}
        priority={priority}
        className={`${stackClasses} ${className}`}
      />
    );
  }

  if (media.type === "pending") {
    return (
      <div
        className={`${boxClasses} ${className} flex items-center justify-center border border-dashed border-line bg-shell p-6`}
      >
        <span className="max-w-[36ch] text-center text-sm leading-6 text-grey">
          {media.note}
        </span>
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <video
        className={`${fitClasses} ${className}`}
        poster={media.poster}
        autoPlay
        loop
        muted
        playsInline
      >
        {media.webm && <source src={media.webm} type="video/webm" />}
        <source src={media.mp4} type="video/mp4" />
      </video>
    );
  }

  return (
    <Image
      src={media.src}
      alt={media.alt ?? ""}
      width={1600}
      height={1000}
      priority={priority}
      className={`${fitClasses} ${className}`}
    />
  );
}
