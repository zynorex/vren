import type { Metadata } from "next";
import PricingClient from "./pricing.client";

export const metadata: Metadata = {
  title: "Pricing | VREN",
  description:
    "Transparent economics. A flat 1.5% platform fee on transactions. Compare VREN's pricing against traditional payment processors and other decentralized solutions.",
  openGraph: {
    title: "Pricing | VREN",
    description:
      "Transparent economics. A flat 1.5% platform fee on transactions. No hidden fees, no geography restrictions.",
    url: "/pricing",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VREN Pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | VREN",
    description: "Transparent economics for a decentralized payment layer.",
    images: ["/og-image.png"],
  },
};

export default function PricingPage() {
  return <PricingClient />;
}
