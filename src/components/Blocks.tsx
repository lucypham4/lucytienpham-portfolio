import Image from "next/image";
import type { Block } from "@/content/types";
import { slugify } from "@/lib/slug";
import BeforeAfter from "./BeforeAfter";
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
          className="mt-20 scroll-mt-28 text-[32px] leading-10 font-normal text-ink-soft first:mt-0"
        >
          {block.heading ?? block.label}
        </h2>
      );

    case "quote":
      return (
        <figure className="mt-8">
          <blockquote className="rounded-xl2 border border-line px-8 py-6 text-lg leading-8 text-ink">
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

    case "media":
      return (
        <figure className={`mt-8 ${block.size ? sizeCap[block.size] : ""}`}>
          <MediaBlock media={block.media} />
          {block.caption && (
            <figcaption className="mt-3 text-sm leading-6 text-grey">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "grid":
      return (
        <div
          className={`mt-8 grid grid-cols-1 gap-4 ${gridCols[block.cols ?? 2]} ${
            block.size ? sizeCap[block.size] : ""
          }`}
        >
          {block.media.map((m, i) => (
            <MediaBlock key={i} media={m} />
          ))}
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

    case "beforeAfter":
      return <BeforeAfter before={block.before} after={block.after} />;

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
