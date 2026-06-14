import type { Metadata } from "next";
import HowItWorksClient from "./how-it-works.client";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how VREN uses smart contracts, multi-signature verification, and USDC to facilitate decentralized subscription payments.",
  openGraph: {
    title: "How VREN Works",
    description:
      "Learn how VREN uses smart contracts, multi-signature verification, and USDC to facilitate decentralized subscription payments.",
    url: "/how-it-works",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "How VREN Works",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How VREN Works",
    description: "Learn how VREN uses smart contracts, multi-signature verification, and USDC.",
    images: ["/og-image.png"],
  },
};

export default function HowItWorksPage() {
  return <HowItWorksClient />;
}
