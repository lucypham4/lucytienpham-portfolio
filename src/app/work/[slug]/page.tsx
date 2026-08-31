import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Blocks from "@/components/Blocks";
import CaseStudyNav, { type NavSection } from "@/components/CaseStudyNav";
import MediaBlock from "@/components/MediaBlock";
import { getProject, projects } from "@/content/projects";
import { slugify } from "@/lib/slug";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.tagline };
}

const accentBg = {
  mint: "bg-mint",
  grad: "bg-linear-to-b from-grad-blue/20 to-bg",
  none: "",
} as const;

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const next =
    projects[(projects.findIndex((p) => p.slug === slug) + 1) % projects.length];

  const sections: NavSection[] = [
    { id: "overview", label: "Overview" },
    ...project.blocks
      .filter((b) => b.kind === "section")
      .map((b) => ({ id: slugify(b.label), label: b.label })),
  ];

  // Several projects use the same sentence for both, so only show it once.
  const showTagline =
    !project.hero.hideTagline && project.tagline !== project.hero.headline;

  return (
    <article className="pb-6 md:pb-10">
      <header className={accentBg[project.accent ?? "none"]}>
        {project.hero.media &&
          (project.hero.fullBleed ? (
            <div className="h-[45vh] min-h-[320px] w-full overflow-hidden">
              <MediaBlock media={project.hero.media} priority fit="fill" />
            </div>
          ) : (
            <div className="shell pt-6 md:pt-10">
              {/* Panelled splashes match the plain ones' 16:9 footprint so
                  every case study opens at the same height. By default the
                  asset is contained inside padding rather than filling the
                  panel — `panelFill` opts a photograph into covering the
                  rounded box edge to edge instead. */}
              {project.hero.panel ? (
                <div
                  className={`aspect-video overflow-hidden rounded-xl2 ${
                    project.hero.panelFill ? "" : "bg-shell p-6 md:p-10"
                  }`}
                >
                  <MediaBlock
                    media={project.hero.media}
                    priority
                    fit={project.hero.panelFill ? "fill" : "contain"}
                  />
                </div>
              ) : (
                <MediaBlock media={project.hero.media} priority />
              )}
            </div>
          ))}
      </header>

      {/* The nav column is `auto`-tracked rather than a fixed 190px so
          CaseStudyNav can collapse its own width and let this column shrink
          with it — the content column (1fr) reflows to fill the freed
          space automatically. */}
      <div className="shell grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[auto_1fr] lg:gap-16">
        <CaseStudyNav sections={sections} />

        <div className="min-w-0">
          {/* Title lives in the content column so it lines up with the copy
              below it rather than spanning across the side nav. */}
          <h1 className="text-[40px] leading-[48px] font-normal text-ink">
            {project.hero.headline}
          </h1>
          {showTagline && (
            <p className="mt-4 max-w-3xl text-xl leading-8 text-grey">
              {project.tagline}
            </p>
          )}

          <div id="overview" className="mt-12 scroll-mt-[112px] sm:scroll-mt-[136px]">
            {project.overview && (
              <section>
                {project.overview.media && (
                  <div className="mb-10 max-w-sm">
                    <MediaBlock media={project.overview.media} />
                  </div>
                )}
                <div>
                  <p className="eyebrow">{project.overview.label ?? "Overview"}</p>
                  <p
                    className="prose-body mt-3"
                    dangerouslySetInnerHTML={{ __html: project.overview.html }}
                  />
                  {project.overview.impact && (
                    <>
                      <p className="eyebrow mt-8">
                        {project.overview.impactLabel ?? "Impact"}
                      </p>
                      <p className="prose-body mt-3">
                        {project.overview.impact}
                      </p>
                    </>
                  )}
                </div>
              </section>
            )}

            {project.stats && (
              <div className="mt-10 flex flex-wrap gap-4">
                {project.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-pill bg-ink px-6 py-3 text-bg"
                  >
                    {stat.icon && (
                      <Image src={stat.icon} alt="" width={24} height={24} />
                    )}
                    <span className="text-sm font-semibold">{stat.text}</span>
                  </div>
                ))}
              </div>
            )}

            {project.meta && (
              <dl className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3">
                {project.meta.map((m) => (
                  <div key={m.label}>
                    <dt className="eyebrow">{m.label}</dt>
                    {/* Values may carry newlines to list team members. */}
                    <dd className="mt-2 text-sm leading-6 whitespace-pre-line text-grey">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="mt-28">
            <Blocks blocks={project.blocks} />
          </div>

          <nav className="mt-24">
            <p className="eyebrow text-grey">Next project</p>
            <Link
              href={`/work/${next.slug}`}
              className="eyebrow mt-2 inline-block text-ink transition-opacity hover:opacity-80"
            >
              {next.title} →
            </Link>
          </nav>
        </div>
      </div>
    </article>
  );
}
