import type { Metadata } from "next";
import { Great_Vibes, Inter } from "next/font/google";
import "./globals.css";
import FloatingCart from "@/components/FloatingCart";

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KingsBakery — Desserts Worthy of a Crown",
  description: "Experience handcrafted luxury desserts and exclusive tasting boxes from KingsBakery. Made fresh daily with artisanal ingredients and delivered directly to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${greatVibes.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-cream text-text-dark font-sans selection:bg-gold-light selection:text-text-dark">
        {children}
        <FloatingCart />
      </body>
    </html>
  );
}
