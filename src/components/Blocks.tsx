import Image from "next/image";
import { createElement, type ReactNode } from "react";
import type { Block } from "@/content/types";
import { slugify } from "@/lib/slug";
import BookGallery from "./BookGallery";
import MediaTabs from "./MediaTabs";
import MediaBlock from "./MediaBlock";
import { CAP_MD, CAP_SM, GRID, MEDIA_LIST, PAIR } from "@/lib/sizes";

const gridCols = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

// Caps for tall screenshots that would otherwise fill the whole column.
// Centred so a narrowed image sits under the middle of the copy above it.
const sizeCap = {
  sm: "max-w-[320px] mx-auto",
  md: "max-w-[560px] mx-auto",
} as const;

/** A heading tag, h2 to h4. */
type Heading = "h2" | "h3" | "h4";

/** The heading one level below `level` (1 is the page's h1), capped at h4. */
const below = (level: number): Heading =>
  `h${Math.min(Math.max(level + 1, 2), 4)}` as Heading;

/** A heading whose level is chosen by its place on the page. */
function HeadingAt({
  tag,
  className,
  children,
}: {
  tag: Heading;
  className: string;
  children: ReactNode;
}) {
  return createElement(tag, { className }, children);
}

/**
 * `outer` is the level of the nearest heading above this block, so headings
 * inside it can sit one level lower and never skip one (h1 straight to h3,
 * say), whatever order a case study's blocks come in.
 */
function BlockView({ block, outer }: { block: Block; outer: number }) {
  switch (block.kind) {
    case "section":
      return (
        <h2
          id={slugify(block.label)}
          className="mt-20 scroll-mt-[112px] sm:scroll-mt-[136px] text-[32px] leading-10 font-normal text-ink-soft first:mt-0"
        >
          {block.heading ?? block.label}
        </h2>
      );

    case "quote":
      return (
        <figure className="mt-8">
          <blockquote className="rounded-xl2 border border-line px-8 py-6 text-center text-lg leading-8 text-ink">
            &ldquo;{block.text}&rdquo;
          </blockquote>
          {block.attribution && (
            <figcaption className="mt-3 text-sm leading-6 text-grey">
              {block.attribution}
            </figcaption>
          )}
        </figure>
      );

    case "heading":
      return (
        <HeadingAt
          tag={below(outer)}
          className="mt-10 text-2xl leading-8 font-semibold text-ink"
        >
          {block.text}
        </HeadingAt>
      );

    case "text":
      return (
        <p
          className="prose-body mt-4"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );

    case "callout":
      return (
        <p
          className="mt-8 rounded-xl2 bg-shell px-8 py-8 text-2xl leading-9 font-semibold text-ink"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );

    case "media": {
      // `framed` only matters once real artwork lands — a pending slot
      // already renders its own dashed box, so a frame here would nest.
      const frame = block.framed && block.media.type !== "pending";
      return (
        <figure className={`mt-8 ${block.size ? sizeCap[block.size] : ""}`}>
          {frame ? (
            <div className="mx-auto max-w-[560px] rounded-xl2 bg-black p-8">
              <MediaBlock media={block.media} sizes={CAP_MD} />
            </div>
          ) : (
            <MediaBlock
              media={block.media}
              sizes={
                block.size === "sm"
                  ? CAP_SM
                  : block.size === "md"
                    ? CAP_MD
                    : undefined
              }
            />
          )}
          {block.caption && (
            <figcaption className="mt-3 text-sm leading-6 text-grey">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case "grid": {
      const grid = (
        <div
          className={`grid grid-cols-1 gap-4 ${gridCols[block.cols ?? 2]} ${
            block.size ? sizeCap[block.size] : ""
          }`}
        >
          {block.media.map((m, i) =>
            block.framed ? (
              <div key={i} className="flex items-center justify-center">
                <MediaBlock media={m} sizes={GRID} />
              </div>
            ) : (
              <MediaBlock key={i} media={m} sizes={GRID} />
            ),
          )}
        </div>
      );
      return block.framed ? (
        <div className="mt-8 rounded-xl2 bg-black p-8">{grid}</div>
      ) : (
        <div className="mt-8">{grid}</div>
      );
    }

    case "pair":
      return (
        <div className="mt-8 flex items-center gap-4 sm:gap-6">
          {/* Each side is a `flex-1` share of the row, and the `aspect-video`
              box (not the image's own content) sets its size — so the two
              sides match regardless of the source assets' own aspect ratios. */}
          <div className="aspect-video min-w-0 flex-1 overflow-hidden rounded-xl2">
            <MediaBlock media={block.from} fit="fill" sizes={PAIR} />
          </div>
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-6 w-6 shrink-0 text-grey"
          >
            <path
              d="M4 12h15M13 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="aspect-video min-w-0 flex-1 overflow-hidden rounded-xl2">
            <MediaBlock media={block.to} fit="fill" sizes={PAIR} />
          </div>
        </div>
      );

    case "cards":
      return (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {block.items.map((item, i) => (
            <div
              key={i}
              className="rounded-card border border-line-soft p-6"
            >
              {item.icon && (
                <Image
                  src={item.icon}
                  alt=""
                  width={28}
                  height={28}
                  className="mb-4 h-7 w-7"
                />
              )}
              <HeadingAt
                tag={below(outer)}
                className="text-base leading-6 font-semibold text-ink"
              >
                {item.title}
              </HeadingAt>
              {item.body && (
                <p className="mt-2 text-sm leading-6 text-grey">{item.body}</p>
              )}
            </div>
          ))}
        </div>
      );

    case "list":
      return (
        <ul className="mt-6 flex flex-col gap-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-lg leading-8 text-ink-soft">
              <span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "mediaList":
      return (
        <div className="mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_1.4fr]">
          <MediaBlock media={block.media} sizes={MEDIA_LIST} />
          <ul className="flex flex-col gap-2">
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-3 text-lg leading-8 text-ink-soft">
                <span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "beforeAfter":
      return (
        <MediaTabs
          ariaLabel="Before and after"
          items={[
            { label: "Before", media: [block.before] },
            { label: "After", media: [block.after] },
          ]}
        />
      );

    case "tabs":
      return <MediaTabs ariaLabel="Project views" items={block.items} />;

    case "bookGallery":
      return <BookGallery parts={block.parts} />;

    case "embed":
      return (
        <figure className="mt-8">
          <div className="aspect-video w-full overflow-hidden rounded-card bg-shell">
            <iframe
              src={block.src}
              title={block.title}
              allow="autoplay"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
          <figcaption className="mt-3 text-sm leading-6 text-grey">
            {block.title}
          </figcaption>
        </figure>
      );
  }
}

/** The level of the last heading before block `i`: 1 for the page's h1
 *  until a section (h2) or sub-heading appears. */
function levelBefore(blocks: Block[], i: number) {
  let level = 1;
  for (let j = 0; j < i; j++) {
    const block = blocks[j];
    if (block.kind === "section") level = 2;
    else if (block.kind === "heading") level = Math.min(Math.max(level + 1, 2), 4);
  }
  return level;
}

export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} outer={levelBefore(blocks, i)} />
      ))}
    </>
  );
}
