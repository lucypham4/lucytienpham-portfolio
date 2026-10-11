/**
 * The review-only copy of the portfolio lives under this path. Every internal
 * link on it is built from this base so a reviewer never lands on a public
 * page.
 */
export const DIVE_BASE = "/dive";

/** The base a page is served under: "/dive" on the review copy, "" elsewhere. */
export function baseFor(pathname: string) {
  return pathname === DIVE_BASE || pathname.startsWith(`${DIVE_BASE}/`)
    ? DIVE_BASE
    : "";
}
