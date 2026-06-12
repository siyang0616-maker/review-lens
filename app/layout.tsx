import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Review Lens",
  description: "Understand what native reviewers really mean, not just what they wrote."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
