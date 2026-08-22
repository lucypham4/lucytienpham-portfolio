import type { Metadata } from "next";
import Script from "next/script";
import { Open_Sans, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
});

// The ASCII piece is a Roboto Mono specimen, so it is set in the real face.
const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lucytienpham.com"),
  title: {
    default: "Lucy Pham Portfolio",
    template: "%s | Lucy Pham Portfolio",
  },
  description:
    "Lucy is a designer bridging the gap between business objectives and user experiences.",
  openGraph: {
    title: "Lucy Pham Portfolio",
    description:
      "Lucy is a designer bridging the gap between business objectives and user experiences.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The theme script stamps data-theme on <html> before React hydrates, so
    // the server markup and the client tree differ here by design.
    <html
      lang="en"
      className={`${openSans.variable} ${robotoMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="font-sans min-h-full flex flex-col">
        {/* Runs before first paint so the page never flashes the wrong
            palette. Light is the default; only an explicit choice moves off it. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var s=localStorage.getItem('theme');document.documentElement.dataset.theme=s==='dark'?'dark':'light';}catch(e){document.documentElement.dataset.theme='light';}})();`}
        </Script>
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
