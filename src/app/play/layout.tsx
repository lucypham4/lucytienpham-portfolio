// The page itself is a client component (it owns the lightbox state), so its
// metadata lives here instead.
export const metadata = {
  title: "Play",
  description: "Personal and experimental work by Lucy Pham.",
};

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
