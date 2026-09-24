"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import LogoMark from "./LogoMark";
import ThemeToggle from "./ThemeToggle";

const links = [
  { label: "Home", href: "/" },
  { label: "work", href: "/#work" },
  { label: "Play", href: "/play" },
  { label: "About", href: "/about" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Hide the bar when scrolling down, bring it back on the way up.
  useEffect(() => {
    let last = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last;

      // Ignore jitter, and never hide the bar at the very top of the page.
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 120);
        last = y;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Home is always its top. Left to itself, Next scrolls the new page's
  // first block into view unless it's already clear of the header, but the
  // intro starts under the page's scroll padding (globals.css), so Next
  // passes over it and lands on the work grid instead. So these links opt
  // out of Next's scroll (`scroll={false}`) and go to the top here, before
  // the home page paints.
  const toTop = useRef(false);
  useLayoutEffect(() => {
    if (!toTop.current || pathname !== "/") return;
    toTop.current = false;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // Going "home" from the home page is not a navigation, so there is nothing
  // to wait for: clear any #work left in the address bar and glide up.
  const goHome = (e: React.MouseEvent) => {
    setOpen(false);
    if (pathname !== "/") {
      toTop.current = true;
      return;
    }
    e.preventDefault();
    window.history.replaceState(null, "", "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // A hidden bar must not swallow the menu that is open inside it.
  const toggleMenu = () =>
    setOpen((wasOpen) => {
      if (!wasOpen) setHidden(false);
      return !wasOpen;
    });

  return (
    <header
      className={`sticky top-0 z-50 bg-bg/80 backdrop-blur-md transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="shell-wide flex items-center justify-between py-5 sm:py-8">
        <Link
          href="/"
          scroll={false}
          className="transition-opacity hover:opacity-80"
          onClick={goHome}
        >
          <LogoMark className="h-14 w-14" />
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
                scroll={link.href !== "/"}
                onClick={link.href === "/" ? goHome : undefined}
                className={`rounded-card px-4 py-2 text-base uppercase tracking-[1px] transition-colors hover:bg-line ${
                  active ? "text-ink" : "text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={toggleMenu}
            className="flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 md:hidden"
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
      </div>

      {open && (
        <nav className="flex flex-col border-t border-line bg-bg px-6 pb-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              scroll={link.href !== "/"}
              onClick={link.href === "/" ? goHome : () => setOpen(false)}
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
