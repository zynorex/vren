import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import { Providers } from "./providers";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vren.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VREN | Your revenue. Your terms.",
    template: "%s | VREN Protocol",
  },
  description:
    "VREN is the permissionless payment infrastructure layer for builders the traditional financial system decided to exclude. Deploy subscription smart contracts and accept USDC from anywhere in the world.",
  keywords: [
    "VREN",
    "blockchain payments",
    "web3 subscriptions",
    "ERC-1155",
    "Polygon",
    "permissionless payments",
    "smart contract subscriptions",
    "USDC payments",
    "decentralized finance",
    "developer SDK",
  ],
  authors: [{ name: "VREN Protocol" }],
  creator: "VREN Protocol",
  publisher: "VREN Protocol",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "VREN Protocol",
    title: "VREN | Your revenue. Your terms.",
    description:
      "The borderless payment infrastructure for the internet economy. Deploy subscription smart contracts on Polygon and accept USDC from anywhere in the world.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VREN Protocol — Your revenue. Your terms.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VREN | Your revenue. Your terms.",
    description:
      "The borderless payment infrastructure for the internet economy. Deploy subscription smart contracts on Polygon and accept USDC from anywhere in the world.",
    images: ["/og-image.png"],
    creator: "@vrenprotocol",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
