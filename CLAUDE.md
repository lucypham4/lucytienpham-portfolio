@AGENTS.md

## Case study copy

The `tagline` on every project in `src/content/projects.ts` is the description shown on its home-page card. Write it in the tense that matches the project's status:

- **Finished project** (the end date in `meta` has passed): simple past, e.g. "Built a scalable digital stage for diverse voices." Never an "-ing" form.
- **Ongoing project** (no end date yet, or it ends in the future): present, e.g. "Building a scalable digital stage for diverse voices."

Apply this to every new case study, and when a project's status changes, update its tagline. If `hero.headline` repeats the tagline, change both so they stay identical (`CaseStudy.tsx` shows the tagline under the headline only when they differ).
