import type { Metadata } from "next";

// A review-only copy of the portfolio for Dive Club. The link is public, but
// it is not meant to be found, so it stays out of search results (and out of
// the sitemap and the site's navigation).
export const metadata: Metadata = {
  robots: { index: false },
};

export default function DiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Inflight's review widget. It is rendered here, in this layout only,
          so it exists on /dive and its subpages and nowhere else. An async
          script with a `src` is hoisted by React into the document <head> of
          the server-rendered HTML, so it is in the page source rather than
          added after hydration. `data-path` also scopes the widget to /dive on
          Inflight's side. Do not add a second, unscoped copy. */}
      <script
        src="https://inflight.co/widget.js"
        data-org="aius9qpt"
        data-path="/dive"
        async
      />
      {children}
    </>
  );
}
