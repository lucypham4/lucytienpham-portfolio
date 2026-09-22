// `sizes` values for images, measured from where each one actually renders.
// Without them a browser assumes an image fills the whole screen and fetches
// a file sized for that: case-study images arrived 3840px wide to fill an
// 806px column. Widths are the largest seen at each breakpoint.

/** The case-study text column: 806px at most, beside the sidebar from lg. */
export const COLUMN = "(min-width: 1140px) 810px, (min-width: 1024px) 70vw, 100vw";

/** Full width of the screen, as the full-bleed case-study hero is. */
export const BLEED = "100vw";

/** Two, three or four across within the column (grids), one on phones. */
export const GRID = "(min-width: 1140px) 400px, (min-width: 640px) 50vw, 100vw";

/** Before-and-after pair: two across, either side of an arrow, at any width. */
export const PAIR = "(min-width: 1140px) 370px, 45vw";

/** The picture beside a list, a little under half the column from md. */
export const MEDIA_LIST = "(min-width: 1140px) 330px, (min-width: 768px) 40vw, 100vw";

/** Book spreads, two across on a black panel. */
export const BOOK = "(min-width: 1140px) 380px, 50vw";

/** Tall screenshots capped to a phone's width, and to a narrow column. */
export const CAP_SM = "320px";
export const CAP_MD = "(min-width: 600px) 560px, 100vw";

/** The small picture above a case study's overview (max-w-sm). */
export const OVERVIEW = "(min-width: 420px) 384px, 100vw";

/** Home page project thumbnails: one column on phones, two from sm. */
export const HOME_GRID = "(min-width: 1400px) 652px, (min-width: 640px) 50vw, 100vw";

/** Play tiles: one, two, then three masonry columns. */
export const PLAY_TILE =
  "(min-width: 1400px) 350px, (min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw";

/** About photos: two across in the wide column from sm. */
export const ABOUT_PHOTO =
  "(min-width: 1400px) 420px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw";

/** The lightbox: up to max-w-6xl, less its padding. */
export const LIGHTBOX = "(min-width: 1200px) 1152px, 100vw";

/** A case-study hero set inside the page shell rather than full-bleed. */
export const HERO_BOX = "(min-width: 1140px) 1060px, 100vw";
