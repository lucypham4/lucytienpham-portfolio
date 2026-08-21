import Link from "next/link";
import MediaBlock from "@/components/MediaBlock";
import { projects } from "@/content/projects";

export default function Home() {
  return (
    <>
      <section className="shell pt-20 pb-24">
        <h1 className="max-w-4xl text-[36px] leading-[46px] font-normal text-ink md:text-[48px] md:leading-[60px]">
          Lucy is a designer <strong className="font-bold">bridging the gap</strong>{" "}
          between business objectives and user experiences.
        </h1>
      </section>

      <section id="work" className="shell pb-24">
        <div className="flex flex-col gap-20">
          {projects.map((project, i) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="group block"
            >
              <div className="overflow-hidden rounded-xl2">
                <MediaBlock
                  media={project.thumb}
                  priority={i === 0}
                  className="rounded-xl2 transition-opacity group-hover:opacity-80"
                />
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  {project.categories.map((cat) => (
                    <span
                      key={cat}
                      className="rounded-card border border-line-soft px-3 py-1.5 text-xs font-semibold tracking-[1px] text-ink uppercase"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <h2 className="text-[36px] leading-[44px] font-bold text-ink">
                  {project.title}
                </h2>
                <p className="max-w-2xl text-lg leading-8 text-grey">
                  {project.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
