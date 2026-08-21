export type Media =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; poster: string; mp4: string; webm?: string };

export type Block =
  /** Green uppercase eyebrow that opens a case-study section. */
  | { kind: "section"; label: string }
  | { kind: "heading"; text: string }
  | { kind: "text"; html: string }
  | { kind: "callout"; html: string }
  | { kind: "media"; media: Media; caption?: string; frame?: boolean }
  | { kind: "grid"; media: Media[]; cols?: 2 | 3 | 4 }
  | { kind: "cards"; items: { title: string; body?: string; icon?: string }[] }
  | { kind: "list"; items: string[] }
  | { kind: "beforeAfter"; before: Media; after: Media }
  | { kind: "embed"; src: string; title: string; ratio?: number };

export type Meta = { label: string; value: string }[];

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  categories: string[];
  /** Home-page card thumbnail. */
  thumb: Media;
  /** Hero treatment on the case-study page itself. */
  hero: { media?: Media; eyebrow?: string; headline: string; fullBleed?: boolean };
  accent?: "mint" | "grad" | "none";
  overview?: {
    html: string;
    logo?: { src: string; width: number; height: number };
    media?: Media;
  };
  meta?: Meta;
  stats?: { icon?: string; text: string }[];
  blocks: Block[];
};
