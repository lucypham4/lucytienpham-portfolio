import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black px-6 py-10 text-white md:px-[100px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <Image
          src="/assets/logo.svg"
          alt=""
          width={72}
          height={72}
          className="h-[72px] w-[72px]"
        />

        <div className="flex items-center gap-8">
          <a
            href="https://www.linkedin.com/in/lucy-tien-pham/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg leading-7 underline-offset-4 transition-opacity hover:underline hover:opacity-90"
          >
            LinkedIn
          </a>
          <a
            href="mailto:lucypham4@gmail.com"
            className="text-lg leading-7 underline-offset-4 transition-opacity hover:underline hover:opacity-90"
          >
            Email
          </a>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-[1440px] text-xs leading-5 uppercase">
        © 2025 Lucy-Tien Pham
      </p>
    </footer>
  );
}
