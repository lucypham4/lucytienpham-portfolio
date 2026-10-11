# lucytienpham.com

Product design portfolio for Lucy-Tien Pham, rebuilt from Webflow as a Next.js app.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## How content works

All case study content lives in [`src/content/projects.ts`](src/content/projects.ts). Each project
is a `Project` object, and its body is an array of typed `Block`s (`section`, `heading`, `text`,
`media`, `grid`, `cards`, `list`, `beforeAfter`, `callout`, `embed`) defined in
[`src/content/types.ts`](src/content/types.ts). To edit a case study, change the data — the page
template in `src/app/work/[slug]/page.tsx` renders whatever blocks it finds.

Adding a project to `projects` automatically creates its `/work/<slug>` page and its home page card.

The Play page's grid is a separate list in [`src/app/play/page.tsx`](src/app/play/page.tsx).

## Assets

Images and videos were downloaded from the old Webflow CDN and live in `public/assets/`. Nothing
loads from Webflow at runtime, so the site keeps working after that subscription lapses.

## Design tokens

Colors, fonts, and radii from the original site are defined as Tailwind theme variables in
[`src/app/globals.css`](src/app/globals.css). The site uses Open Sans throughout, matching Webflow.

## Review copy at /dive

`/dive` (with `/dive/about`, `/dive/play` and `/dive/work/<slug>`) is a review-only copy of the portfolio for
Dive Club. It renders the same components and content as the public site; the route files in
[`src/app/dive`](src/app/dive) only pass `base="/dive"` so every internal link stays inside it. The shared
nav reads the base from the URL (see [`src/lib/dive.ts`](src/lib/dive.ts)).

- Its layout ([`src/app/dive/layout.tsx`](src/app/dive/layout.tsx)) is the only place the Inflight widget
  `<script>` is rendered, so it is in the server-rendered `<head>` of `/dive` pages and absent everywhere else.
  Don't add a second, unscoped copy to the root layout.
- Those pages are `noindex`, there is no sitemap, and the public nav doesn't link to them.
- The link is public, not password-protected.

## Deploying

Build with `npm run build`. Every page is statically prerendered, so it can be hosted on Vercel,
Netlify, or any static-capable Node host.
