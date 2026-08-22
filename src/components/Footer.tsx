export default function Footer() {
  return (
    <footer className="bg-bg py-5 text-ink sm:py-8">
      {/* Same container as the nav and page body, so the two ends line up. */}
      <div className="shell-wide flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 uppercase">© 2026 Lucy-Tien Pham</p>

        <div className="flex items-center gap-8">
          <a
            href="https://www.linkedin.com/in/lucy-tien-pham/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg leading-7 underline-offset-4 transition-opacity hover:underline hover:opacity-80"
          >
            LinkedIn
          </a>
          <a
            href="mailto:lucypham4@gmail.com"
            className="text-lg leading-7 underline-offset-4 transition-opacity hover:underline hover:opacity-80"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
