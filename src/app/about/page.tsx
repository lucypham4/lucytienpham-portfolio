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
      {/* Body-copy size, but in full-contrast ink rather than the softer grey
          running text uses. The bio is written first so a narrow screen reads
          it before the photographs, then placed into the right column on a
          wide one. */}
      <section className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
        <div className="text-lg leading-8 font-normal text-ink sm:col-start-2 sm:row-start-1 sm:sticky sm:top-[136px] sm:self-start">
          {/* The opening line doubles as the page heading, as on the home
              page, so the page keeps exactly one. */}
          <h1>
            Lucy is a multidisciplinary designer with a background in Management
            Information Systems and Graphic Design. Her visual design skills and
            business sense have driven her career, including her most recent
            role designing at The Washington Post.
          </h1>
          <p className="mt-6">
            Offscreen, she’s drawing, painting, hiking, and teaching her cat
            new tricks. She enjoys incorporating her cultural experiences into
            her designs. A prime example is this portfolio’s logo, which was
            inspired by the accent marks in her Vietnamese name, Cát Tiên Phạm.
          </p>
          <p className="mt-6">She also says hi.</p>
        </div>

        {/* One column of photographs, centred in its half of the grid and
            scrolled past the pinned bio. */}
        <div className="flex flex-col items-center gap-8 sm:col-start-1 sm:row-start-1">
          {photos.map((src) => (
            <Image
              key={src}
              src={src}
              alt=""
              width={900}
              height={1200}
              className="h-auto w-1/2 rounded-card object-cover"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
