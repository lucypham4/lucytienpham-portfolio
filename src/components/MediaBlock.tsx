import Image from "next/image";
import type { Media } from "@/content/types";

export default function MediaBlock({
  media,
  className = "",
  priority = false,
}: {
  media: Media;
  className?: string;
  priority?: boolean;
}) {
  if (media.type === "video") {
    return (
      <video
        className={`w-full rounded-card object-cover ${className}`}
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
      className={`h-auto w-full rounded-card object-cover ${className}`}
    />
  );
}
