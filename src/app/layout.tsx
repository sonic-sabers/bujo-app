import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Bujo UI - Modern React Component Library",
  description:
    "Explore a comprehensive collection of responsive, accessible UI components built with React, Tailwind CSS, and Framer Motion. Ready to use in your next project.",
  keywords: [
    "React",
    "UI Components",
    "Tailwind CSS",
    "Framer Motion",
    "Component Library",
    "Bujo UI",
  ],
  authors: [{ name: "Bujo UI Team" }],
  openGraph: {
    title: "Bujo UI - Modern React Component Library",
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
