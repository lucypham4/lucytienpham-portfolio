import AboutPhotos, { type Photo } from "@/components/AboutPhotos";

export const metadata = {
  title: "About",
  description: "Lucy Pham — a multidisciplinary designer.",
};

/* Each photograph carries its own date and note in the middle column, newest
   first. The dimensions are the file's own, so the column holds the right
   amount of space for each picture before it loads. */
const photos: Photo[] = [
  {
    src: "/assets/img-5877.jpg",
    width: 1000,
    height: 735,
    date: "February 27, 2026",
    caption: "My mom’s hometown where cashew trees grow in the mountains",
  },
  {
    src: "/assets/dji-20251209.jpg",
    width: 1000,
    height: 750,
    date: "December 9, 2025",
    caption:
      "Night snorkeling in Roatan. Not pictured is a box jellyfish I almost swam into",
  },
  {
    src: "/assets/img-5876.jpg",
    width: 1000,
    height: 1304,
    date: "September 7, 2025",
    caption: "Big happy lily pads at Blue Cliff Monastery",
  },
  {
    src: "/assets/img-1727-1-1.avif",
    width: 1047,
    height: 1395,
    date: "July 21, 2024",
    caption: "Overlooking Shenandoah National Park",
  },
  {
    src: "/assets/img-5875.jpg",
    width: 1000,
    height: 1318,
    date: "January 11, 2024",
    caption:
      "WWOOFing in Florida. Painted some bathroom murals for an organic farm",
  },
  {
    // No date on this one, so it sits after everything that has one.
    src: "/assets/dsc00035-1-1.avif",
    width: 1479,
    height: 990,
    date: "Date unknown",
    caption: "Titi posing for the camera",
  },
];

export default function AboutPage() {
  return (
    <div className="shell-wide py-5 sm:py-8">
      {/* Three columns on a wide screen: the photographs on the far left, each
          one's date and note beside it, and the bio pinned on the right. The
          bio is written first so a narrow screen reads it before the
          photographs, then placed into the last column on a wide one. */}
      <section className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Body-copy size, but in full-contrast ink rather than the softer grey
            running text uses. */}
        <div className="text-lg leading-8 font-normal text-ink lg:sticky lg:top-[136px] lg:col-start-2 lg:row-start-1 lg:self-start">
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

        <AboutPhotos photos={photos} />
      </section>
    </div>
  );
}
