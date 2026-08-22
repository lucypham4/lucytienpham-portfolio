"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "@/components/Lightbox";

type PlayItem = {
  labels: string[];
  href?: string;
  media:
    | { type: "image"; src: string; group?: string[] }
    | { type: "video"; poster: string; mp4: string; webm?: string }
    | { type: "embed"; src: string };
};

const items: PlayItem[] = [
  {
    labels: ["Interactive Prototype", "Fear & Greed Visualizer"],
    href: "https://lucypham4.github.io/Fear-Greed-Visualizer/",
    media: {
      type: "video",
      poster: "/assets/screen-recording-2026-04-30-at-12-55-15-am-poster-0000000.jpg",
      mp4: "/assets/screen-recording-2026-04-30-at-12-55-15-am-mp4.mp4",
      webm: "/assets/screen-recording-2026-04-30-at-12-55-15-am-webm.webm",
    },
  },
  {
    labels: ["Still Life, Charcoal"],
    media: {
      type: "image",
      src: "/assets/2025-08-28-12-36-5.jpeg",
      group: [
        "/assets/2025-08-28-12-36-5.jpeg",
        "/assets/2025-08-28-12-36-page-1.jpeg",
      ],
    },
  },
  {
    labels: ["Human Generated"],
    media: { type: "image", src: "/assets/human-generated.webp" },
  },
  {
    labels: ["Typography Project", "Poster Design"],
    media: {
      type: "image",
      src: "/assets/type-specimen-posters3.png",
      group: [
        "/assets/type-specimen-posters3.png",
        "/assets/type-specimen-posters2.png",
        "/assets/type-specimen-posters.png",
      ],
    },
  },
  {
    labels: [],
    media: {
      type: "image",
      src: "/assets/1757023079568-e1078af3-f26a-435c-bff0-8228110fa901-1.jpg",
    },
  },
  {
    labels: ["Cat Face", "Personal Brand, Motion Concept"],
    media: { type: "embed", src: "https://cdn.lottielab.com/l/4bqRgEy2H6HrbW.html" },
  },
  {
    labels: ["Album Cover"],
    media: {
      type: "image",
      src: "/assets/album-cover.webp",
      group: ["/assets/album-cover.webp", "/assets/2-album-cover.webp"],
    },
  },
  {
    labels: ["Massimo Vignelli Posters"],
    media: { type: "image", src: "/assets/massimo-vignelli-posters.webp" },
  },
];

function Labels({ labels }: { labels: string[] }) {
  if (!labels.length) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-4 opacity-0 transition-opacity group-hover:opacity-100">
      {labels.map((label) => (
        <span
          key={label}
          className="rounded-card bg-bg/95 px-3 py-1.5 text-xs font-semibold tracking-[0.5px] text-ink uppercase shadow-sm"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function Media({ media }: { media: PlayItem["media"] }) {
  if (media.type === "video") {
    return (
      <video
        className="w-full rounded-card"
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
  if (media.type === "embed") {
    return (
      <div className="aspect-square w-full overflow-hidden rounded-card bg-shell">
        <iframe
          src={media.src}
          title="Cat Face"
          className="h-full w-full border-0"
        />
      </div>
    );
  }
  return (
    <Image
      src={media.src}
      alt=""
      width={1200}
      height={1200}
      className="h-auto w-full rounded-card"
    />
  );
}

export default function PlayPage() {
  const [viewing, setViewing] = useState<string[] | null>(null);

  return (
    <div className="shell py-20">
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {items.map((item, i) => {
          const inner = (
            <div className="group relative break-inside-avoid overflow-hidden rounded-card">
              <Media media={item.media} />
              <Labels labels={item.labels} />
            </div>
          );

          // Links go to their project; every still opens up close instead.
          if (item.href) {
            return (
              <a
                key={i}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block break-inside-avoid"
              >
                {inner}
              </a>
            );
          }

          if (item.media.type === "image") {
            const group = item.media.group ?? [item.media.src];
            return (
              <button
                key={i}
                type="button"
                onClick={() => setViewing(group)}
                aria-label={
                  item.labels[0]
                    ? `View ${item.labels[0]} up close`
                    : "View image up close"
                }
                className="block w-full cursor-zoom-in break-inside-avoid text-left"
              >
                {inner}
              </button>
            );
          }

          return (
            <div key={i} className="break-inside-avoid">
              {inner}
            </div>
          );
        })}
      </div>

      {viewing && (
        <Lightbox
          images={viewing}
          startAt={0}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}
