"use client";

/**
 * Reads and writes data-theme on <html> directly rather than holding the theme
 * in React state: the attribute is already set before hydration by the inline
 * script in layout.tsx, so mirroring it in state would only risk a mismatch.
 * Which icon shows is decided in CSS by the same attribute.
 */
export default function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private browsing can refuse storage; the theme still applies.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-card text-ink transition-colors hover:bg-line"
    >
      {/* Moon while light, sun while dark — each offers the other mode. */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="h-5 w-5 dark:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 13.2A8.2 8.2 0 0 1 10.8 4a8.2 8.2 0 1 0 9.2 9.2Z" />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="hidden h-5 w-5 dark:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.6v2.2M12 19.2v2.2M4.2 12H2M22 12h-2.2M6.5 6.5 4.9 4.9M19.1 19.1l-1.6-1.6M17.5 6.5l1.6-1.6M4.9 19.1l1.6-1.6" />
      </svg>
    </button>
  );
}
