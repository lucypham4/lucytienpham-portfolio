import Image from "next/image";

export const metadata = {
  title: "About",
  description: "Lucy Pham — a multidisciplinary designer.",
};

const photos = [
  "/assets/dsc09154-1-1.avif",
  "/assets/dsc00629-1.avif",
  "/assets/img-1727-1-1.avif",
  "/assets/img-0522.avif",
  "/assets/dsc00035-1-1.avif",
  "/assets/img-0913-1-1.avif",
];

export default function AboutPage() {
  return (
    <div className="shell-wide py-5 sm:py-8">
      {/* Same grid and type as the home intro, so the two pages open alike.
          The bio is written first so a narrow screen reads it before the
          photographs, then placed into the right column on a wide one. */}
      <section className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
        <div className="text-2xl leading-9 font-normal text-ink sm:col-start-2 sm:row-start-1 sm:sticky sm:top-[136px] sm:self-start">
          <h1>Hello I&apos;m Lucy,</h1>
          <p className="mt-6">a multidisciplinary designer.</p>
          <p className="mt-6">
            My experience comes from roles in brand development, graphic design,
            UX research and design, and data visualization. I base all of my
            decisions on user research and business value, whether I&apos;m
            designing a marketing flyer or a webpage.
          </p>
          <p className="mt-6">
            Fun fact: My Vietnamese name is Cát Tiên Phạm, and the accent marks
            were used to create my logo!
          </p>
        </div>

        {/* One column of photographs, scrolled past the pinned bio. */}
        <div className="flex flex-col gap-4 sm:col-start-1 sm:row-start-1">
          {photos.map((src) => (
            <Image
              key={src}
              src={src}
              alt=""
              width={900}
              height={1200}
              className="h-auto w-full rounded-card object-cover"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
