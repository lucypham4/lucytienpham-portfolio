import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
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
    <html lang="en" className={`${openSans.variable} h-full antialiased`}>
      <body className="font-sans min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
