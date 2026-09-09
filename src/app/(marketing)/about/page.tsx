import type { Metadata } from "next";
import AboutClient from "./about.client";

export const metadata: Metadata = {
  title: "About Artha (VREN) | Allowing Revenue To flow Honestly, Autonomously",
  description:
    "Artha (VREN) builds sovereign, borderless payment and subscription infrastructure on Polygon PoS. Built for developers the traditional financial system excluded — zero permission, instant settlement, and hardcoded 1.5% fees.",
  keywords: [
    "Artha",
    "VREN Protocol",
    "web3 payments",
    "decentralized subscriptions",
    "Polygon PoS",
    "USDC payments",
    "ERC-1155 subscriptions",
    "permissionless payments",
    "Stripe alternative",
    "crypto SaaS monetization",
    "developer infrastructure",
  ],
  openGraph: {
    title: "About Artha (VREN) — Your Revenue. Your Terms.",
    description:
      "Allowing Revenue To flow Honestly, Autonomously. Sovereign payment infrastructure for developers worldwide. Instant settlement, hardcoded 1.5% fee ceiling, and non-custodial custody.",
    url: "/about",
    siteName: "Artha Protocol",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "About Artha Protocol",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Artha (VREN) — Sovereign Payment Infrastructure",
    description:
      "The payment layer for builders Stripe said no to. Built in Bharat, deployed worldwide.",
    images: ["/og-image.png"],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
