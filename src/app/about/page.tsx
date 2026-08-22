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
    <div className="shell py-6 md:py-10">
      <section className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.2fr] md:items-start">
        <Image
          src="/assets/lp-headshot-1-5x.avif"
          alt="Lucy Pham"
          width={900}
          height={1100}
          priority
          className="h-auto w-full rounded-xl2 object-cover"
        />

        <div>
          <h1 className="text-[40px] leading-[48px] font-normal text-ink">
            Hello I&apos;m Lucy,
          </h1>
          <p className="mt-6 text-2xl leading-9 text-ink">
            a multidisciplinary designer.
          </p>
          <p className="prose-body mt-6 text-lg leading-8">
            My experience comes from roles in brand development, graphic design,
            UX research and design, and data visualization. I base all of my
            decisions on user research and business value, whether I&apos;m
            designing a marketing flyer or a webpage.
          </p>
          <p className="prose-body mt-4 text-lg leading-8">
            Fun fact: My Vietnamese name is Cát Tiên Phạm, and the accent marks
            were used to create my logo!
          </p>
        </div>
      </section>

      <section className="mt-20 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
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
      </section>
    </div>
  );
}
