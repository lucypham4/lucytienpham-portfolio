export type Media =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; poster: string; mp4: string; webm?: string };

export type MediaSize = "sm" | "md";

export type Block =
  /** Green uppercase eyebrow that opens a case-study section. */
  | { kind: "section"; label: string }
  | { kind: "heading"; text: string }
  | { kind: "text"; html: string }
  | { kind: "callout"; html: string }
  /**
   * `size` caps how wide a block renders. Tall phone screenshots become
   * unreadably large at full column width, so they opt into a narrower frame.
   */
  | { kind: "media"; media: Media; caption?: string; size?: MediaSize }
  | { kind: "grid"; media: Media[]; cols?: 2 | 3 | 4; size?: MediaSize }
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
  hero: {
    media?: Media;
    headline: string;
    fullBleed?: boolean;
    /** Sit the splash on a rounded tinted panel rather than bare on the page. */
    panel?: boolean;
    /** Suppress the tagline under the headline where it adds nothing. */
    hideTagline?: boolean;
  };
  accent?: "grad" | "none";
  overview?: {
    html: string;
    /** Short outcome statement shown under the overview copy. */
    impact?: string;
    media?: Media;
  };
  meta?: Meta;
  stats?: { icon?: string; text: string }[];
  blocks: Block[];
};
