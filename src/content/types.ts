export type Media =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; poster: string; mp4: string; webm?: string }
  /**
   * Stills cycled in place the way a GIF would, for a thumbnail that has to
   * stand for a whole artefact rather than a single screen. `interval` is the
   * hold per still in milliseconds.
   */
  | {
      type: "slideshow";
      items: { src: string; alt?: string }[];
      interval?: number;
    }
  /**
   * A slot whose artwork has not been handed over yet. It renders as a labelled
   * dashed box so an in-progress case study can be laid out and reviewed
   * without broken images. Delete the type once nothing uses it.
   */
  | { type: "pending"; note: string };

export type MediaSize = "sm" | "md";

export type TabItem = {
  label: string;
  media: Media[];
  cols?: 2 | 3 | 4;
  /** A short line shown under the tab's media, in place of body copy. */
  caption?: string;
};

export type Block =
  /**
   * Opens a case-study section. `label` is the short name the side nav shows;
   * `heading` is the longer sentence rendered on the page, falling back to the
   * label when the short name already reads as a heading.
   */
  | { kind: "section"; label: string; heading?: string }
  | { kind: "heading"; text: string }
  | { kind: "text"; html: string }
  | { kind: "callout"; html: string }
  /** Something a stakeholder actually said, set apart from the narration. */
  | { kind: "quote"; text: string; attribution?: string }
  /**
   * `size` caps how wide a block renders. Tall phone screenshots become
   * unreadably large at full column width, so they opt into a narrower frame.
   */
  | {
      kind: "media";
      media: Media;
      caption?: string;
      size?: MediaSize;
      /**
       * Sit the asset on a fixed black card instead of bare on the page. For
       * artwork that needs one ground to stay legible in both themes — e.g.
       * white line art that would vanish against a light page.
       */
      framed?: boolean;
    }
  | {
      kind: "grid";
      media: Media[];
      cols?: 2 | 3 | 4;
      size?: MediaSize;
      /** Same fixed-black card `media.framed` uses, with items centered
       * (so mismatched aspect ratios sit aligned to a shared middle) rather
       * than each filling its own column top-down. */
      framed?: boolean;
    }
  /** Two images side by side with a small arrow between them, both capped to
   * the same height so neither's own proportions dominate the pairing. */
  | { kind: "pair"; from: Media; to: Media }
  | { kind: "cards"; items: { title: string; body?: string; icon?: string }[] }
  | { kind: "list"; items: string[] }
  /** A media block paired with a bullet list in the same row, media on the left. */
  | { kind: "mediaList"; media: Media; items: string[] }
  | { kind: "beforeAfter"; before: Media; after: Media }
  /** A group of media shown one panel at a time behind centred tabs. */
  | { kind: "tabs"; items: TabItem[] }
  /**
   * Tabbed parts of a book, each shown as a photo grid on a solid black/white
   * card — full contrast in both themes, rather than the neutral tinted panel
   * `framed` media uses. Every image opens a lightbox that pages through every
   * part's images as one sequence, not just the part it was opened from.
   */
  | {
      kind: "bookGallery";
      parts: { label: string; caption?: string; images: Media[] }[];
    }
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
    /**
     * With `panel`, fill the panel edge to edge (cover fit, no padding)
     * instead of containing the asset inside whitespace. For photography;
     * leave off for a logo or screenshot that needs the breathing room.
     */
    panelFill?: boolean;
    /** Suppress the tagline under the headline where it adds nothing. */
    hideTagline?: boolean;
  };
  accent?: "grad" | "none";
  overview?: {
    html: string;
    /** Eyebrow over `html`. Defaults to "Overview" — override for e.g. "Challenge". */
    label?: string;
    /** Short outcome statement shown under the overview copy. */
    impact?: string;
    /** Eyebrow over `impact`. Defaults to "Impact" — override for e.g. "Approach". */
    impactLabel?: string;
    media?: Media;
  };
  meta?: Meta;
  stats?: { icon?: string; text: string }[];
  blocks: Block[];
};
