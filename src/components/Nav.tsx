"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { label: "Home", href: "/" },
  { label: "work", href: "/#work" },
  { label: "Play", href: "/play" },
  { label: "About", href: "/about" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-2.5 md:px-[100px]">
        <Link
          href="/"
          className="transition-opacity hover:opacity-80"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/assets/frame-17.svg"
            alt="Lucy Pham"
            width={56}
            height={56}
            className="h-14 w-14"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href.replace("/#work", "/");
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`rounded-card px-4 py-2 text-base uppercase tracking-[1px] transition-colors hover:bg-line ${
                  active ? "text-ink" : "text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`block h-0.5 w-5 bg-ink transition-transform ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-ink transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-ink transition-transform ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-line bg-white px-6 pb-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-3 text-base uppercase tracking-[1px]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
