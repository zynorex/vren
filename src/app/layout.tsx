import type { Metadata } from "next";
import localFont from "next/font/local";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { PageReveal } from "@/components/PageReveal";
import { AnnouncementModal } from "@/components/AnnouncementModal";
import { Preloader } from "@/components/Preloader";
import "./globals.css";

const anthropicSans = localFont({
  src: "./fonts/AnthropicSans-Roman.woff2",
  variable: "--font-anthropic-sans",
  display: "swap",
});

const anthropicSerif = localFont({
  src: "./fonts/AnthropicSerif-Roman.woff2",
  variable: "--font-anthropic-serif",
  display: "swap",
});

const anthropicMono = localFont({
  src: "./fonts/AnthropicMono-Roman.woff2",
  variable: "--font-anthropic-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARTHA | Your revenue. Your terms.",
  description: "The payment layer for builders Stripe said no to.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth overflow-x-hidden ${anthropicSans.variable} ${anthropicSerif.variable} ${anthropicMono.variable}`}>
      <body
        className={`antialiased bg-parchment text-charcoal font-body selection:bg-terracotta selection:text-white overflow-x-hidden m-0 p-0`}
      >
        <Preloader />
        <NavBar />
        <PageReveal>
          {children}
          <Footer />
        </PageReveal>
        <AnnouncementModal />
      </body>
    </html>
  );
}
