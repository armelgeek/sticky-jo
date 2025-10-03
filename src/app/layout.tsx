import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stick Figure Video Generator",
  description: "Transform your videos into minimalist stick figure animations with synchronized lip movements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
