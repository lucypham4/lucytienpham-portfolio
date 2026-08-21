import { NextResponse, type NextRequest } from "next/server";

// Legacy Webflow URLs that differ from their new paths only by case.
//
// These can't live in next.config.ts: `redirects()` matches `source`
// case-insensitively, so a "/Play" -> "/play" rule also matches "/play" and
// redirects it to itself forever. Matching on the exact pathname here avoids
// that loop.
const legacyPaths = new Map([["/Play", "/play"]]);

export function middleware(request: NextRequest) {
  const destination = legacyPaths.get(request.nextUrl.pathname);
  if (destination) {
    return NextResponse.redirect(new URL(destination, request.url), 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/Play"],
};
