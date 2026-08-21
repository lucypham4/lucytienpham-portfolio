import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black px-6 py-10 text-white md:px-[100px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4">
          <Image
            src="/assets/logo.svg"
            alt=""
            width={72}
            height={72}
            className="h-[72px] w-[72px]"
          />
          <h2 className="text-[40px] leading-[48px] font-bold">Let&apos;s collab</h2>
        </div>

        <div className="flex flex-col gap-6 md:items-end">
          <p className="max-w-sm text-2xl leading-8 font-semibold md:text-right">
            Feel free to contact me for a project, feedback, or even just to chat
            :)
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/lucy-tien-pham/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="transition-opacity hover:opacity-90"
            >
              <Image
                src="/assets/linkedin.svg"
                alt="LinkedIn"
                width={33}
                height={32}
              />
            </a>
            <a
              href="mailto:lucypham4@gmail.com"
              aria-label="Email"
              className="transition-opacity hover:opacity-90"
            >
              <Image src="/assets/mail.svg" alt="Email" width={40} height={32} />
            </a>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-[1440px] text-xs leading-5 uppercase">
        ®2025 All rights reserved to Lucy-Tien Pham
      </p>
    </footer>
  );
}
