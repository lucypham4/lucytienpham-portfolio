// The flower's drawn width over its height: the box AsciiFlower draws into
// (209 letters by 104 rows, see BOX there), each letter FLOWER_CELL_ASPECT
// times as tall as it is wide. Kept apart from the frames, which are large,
// so the home page can hold the flower's space before its code has loaded.
// AsciiFlower warns in development if this stops matching its data.
export const FLOWER_ASPECT = 209 / (104 * 1.6651);

/** How far the cursor's pull reaches around it, in pixels. The tagline's
 *  hover colour uses the same reach as the flower's own letters. */
export const PULL_RADIUS = 110;
