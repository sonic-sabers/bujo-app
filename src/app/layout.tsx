import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BojuUI - Modern React Component Library",
  description:
    "Explore a comprehensive collection of responsive, accessible UI components built with React, Tailwind CSS, and Framer Motion. Ready to use in your next project.",
  keywords: [
    "React",
    "UI Components",
    "Tailwind CSS",
    "Framer Motion",
    "Component Library",
    "BojuUI",
  ],
  authors: [{ name: "BojuUI Team" }],
  openGraph: {
    title: "BojuUI - Modern React Component Library",
    description: "Responsive, accessible UI components for React",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans`}
      >
        <main className="relative">{children}</main>
      </body>
    </html>
  );
}
