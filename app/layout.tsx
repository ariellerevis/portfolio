import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arielle Revis | Portfolio",
  description: "Arielle Revis portfolio, presented as a focused IDE-inspired workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
