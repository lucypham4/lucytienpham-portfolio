import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Blocks from "@/components/Blocks";
import MediaBlock from "@/components/MediaBlock";
import { getProject, projects } from "@/content/projects";

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
  grad: "bg-linear-to-b from-grad-blue/20 to-white",
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

  return (
    <article className="pb-24">
      {project.hero.fullBleed && project.hero.media ? (
        <>
          <div className="relative h-[45vh] min-h-[320px] w-full">
            <MediaBlock
              media={project.hero.media}
              priority
              className="h-full rounded-none"
            />
          </div>
          <header className="shell pt-14">
            <h1 className="text-[48px] leading-[56px] font-bold text-ink">
              {project.hero.headline}
            </h1>
            <p className="mt-4 text-xl leading-8 text-grey">{project.tagline}</p>
          </header>
        </>
      ) : (
        <header className={`${accentBg[project.accent ?? "none"]} pt-16 pb-14`}>
          <div className="shell">
            {project.hero.eyebrow && (
              <p className="eyebrow">{project.hero.eyebrow}</p>
            )}
            <h1 className="mt-3 max-w-4xl text-[48px] leading-[56px] font-bold text-ink">
              {project.hero.headline}
            </h1>
          </div>
          {project.hero.media && (
            <div className="shell mt-12">
              <MediaBlock media={project.hero.media} priority />
            </div>
          )}
        </header>
      )}

      <div className="shell">
        {project.overview && (
          <section className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.4fr]">
            <div>
              {project.overview.logo && (
                <Image
                  src={project.overview.logo.src}
                  alt={project.title}
                  width={project.overview.logo.width}
                  height={project.overview.logo.height}
                  className="h-auto w-40"
                />
              )}
              {project.overview.media && (
                <MediaBlock media={project.overview.media} />
              )}
            </div>
            <div>
              <p className="eyebrow">Overview</p>
              <p
                className="prose-body mt-3 text-lg leading-8"
                dangerouslySetInnerHTML={{ __html: project.overview.html }}
              />
            </div>
          </section>
        )}

        {project.stats && (
          <div className="mt-10 flex flex-wrap gap-4">
            {project.stats.map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-pill bg-green px-6 py-3 text-white"
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
          <dl className="mt-12 grid grid-cols-1 gap-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {project.meta.map((m) => (
              <div key={m.label}>
                <dt className="eyebrow text-grey">{m.label}</dt>
                <dd className="mt-2 text-sm leading-6 text-ink">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-4">
          <Blocks blocks={project.blocks} />
        </div>

        <nav className="mt-24 border-t border-line pt-8">
          <p className="eyebrow text-grey">Next project</p>
          <Link
            href={`/work/${next.slug}`}
            className="mt-2 inline-block text-[36px] leading-[44px] font-bold text-ink transition-opacity hover:opacity-80"
          >
            {next.title} →
          </Link>
        </nav>
      </div>
    </article>
  );
}
