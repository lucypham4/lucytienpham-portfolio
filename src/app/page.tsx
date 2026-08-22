import Link from "next/link";
import MediaBlock from "@/components/MediaBlock";
import { projects } from "@/content/projects";

export default function Home() {
  return (
    <>
      <section className="shell-wide pt-5 pb-24 sm:pt-8">
        {/* Same grid as the work below, so the line occupies exactly the left
            column and wraps where the first card does. */}
        <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
          <h1 className="text-lg leading-8 font-normal text-ink">
            Lucy is a designer{" "}
            <strong className="font-bold">bridging the gap</strong> between
            business objectives and user experiences.
          </h1>
        </div>
      </section>

      <section id="work" className="shell-wide pb-5 sm:pb-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2">
          {projects.map((project, i) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="group block"
            >
              {/* Every thumbnail is 16:9, so this frame aligns the rows
                  without cropping any of them. */}
              <div className="aspect-video overflow-hidden rounded-xl2">
                <MediaBlock
                  media={project.thumb}
                  priority={i === 0}
                  className="h-full rounded-xl2 transition-opacity group-hover:opacity-80"
                />
              </div>

              <div className="mt-5 flex flex-col gap-3">
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
                <h2 className="text-[28px] leading-9 font-normal text-ink">
                  {project.title}
                </h2>
                <p className="text-base leading-7 text-grey">
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
