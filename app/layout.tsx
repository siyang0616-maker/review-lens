import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Review-to-Revenue AI",
  description: "Turn customer reviews, inquiries, and sales notes into weekly revenue actions."
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
