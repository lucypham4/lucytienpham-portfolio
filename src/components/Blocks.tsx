import Image from "next/image";
import type { Block } from "@/content/types";
import { slugify } from "@/lib/slug";
import BookGallery from "./BookGallery";
import MediaTabs from "./MediaTabs";
import MediaBlock from "./MediaBlock";

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

function BlockView({ block }: { block: Block }) {
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
        <h3 className="mt-10 text-2xl leading-8 font-semibold text-ink">
          {block.text}
        </h3>
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
              <MediaBlock media={block.media} />
            </div>
          ) : (
            <MediaBlock media={block.media} />
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
                <MediaBlock media={m} />
              </div>
            ) : (
              <MediaBlock key={i} media={m} />
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
          {/* Each side is a `flex-1` share of the row, not a size set by the
              image's own content — so filling right up to its half of the
              margins is guaranteed at any width, nothing to wrap. */}
          <div className="min-w-0 flex-1">
            <MediaBlock media={block.from} className="rounded-xl2" />
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
          <div className="min-w-0 flex-1">
            <MediaBlock media={block.to} className="rounded-xl2" />
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
              <h4 className="text-base leading-6 font-semibold text-ink">
                {item.title}
              </h4>
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
          <MediaBlock media={block.media} />
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

export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </>
  );
}
