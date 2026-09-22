// The cursor's scatter, shared by the flower and the intro line laid over it
// so the two read as one surface.

/** What the cursor scatters letters into: a spread of glyph weights so the
 *  disturbed letters read as static rather than as words. */
export const NOISE = "0]M%bBhqZdpr#Q\\uX!k&@aWJZvC<K^9z;~+\"{}|/$IwvY*=?3T7";

/** How long a point of the cursor's trail lingers, and how far it reaches. */
export const TRAIL_MS = 520;
export const TRAIL_RADIUS = 45;
/** How often the disturbed letters re-roll while hovered. */
export const SCATTER_MS = 70;
/** Letters lean toward the cursor, never straying more than this from where
 *  they belong, and only within reach of it. */
export const PULL_MAX = 2;
export const PULL_RADIUS = 110;
