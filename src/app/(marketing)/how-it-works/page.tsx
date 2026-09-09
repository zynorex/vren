import type { Metadata } from "next";
import HowItWorksClient from "./how-it-works.client";

export const metadata: Metadata = {
  title: "How It Works | Artha Protocol — Non-Custodial Web3 Subscriptions on Polygon",
  description:
    "Explore the architecture of Artha: how Polygon PoS smart contracts, ERC-1155 dynamic credentials, and atomic USDC block splits settle global subscriptions in 2.1 seconds with 0% custody.",
  keywords: [
    "Web3 subscriptions",
    "Polygon PoS payments",
    "ERC-1155 subscription pass",
    "USDC recurring payments",
    "non-custodial payment gateway",
    "Artha protocol",
    "VREN protocol",
    "crypto SaaS monetization",
    "developer payment rails",
  ],
  openGraph: {
    title: "How Artha Works — The Mechanics of Sovereign Subscriptions",
    description:
      "A precise technical breakdown of how smart contracts, ERC-1155 credentials, and atomic 98.5% splits replace opaque fiat gateways with mathematical certainty.",
    url: "/how-it-works",
    siteName: "Artha Protocol",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "How Artha Works - Architecture & Value Stream",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Artha Works — The Mechanics of Sovereign Subscriptions",
    description:
      "A precise technical breakdown of how smart contracts, ERC-1155 credentials, and atomic splits replace opaque fiat gateways with mathematical certainty.",
    images: ["/og-image.png"],
  },
};

export default function HowItWorksPage() {
  return <HowItWorksClient />;
}