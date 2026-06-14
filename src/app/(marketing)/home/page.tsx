import type { Metadata } from "next";
import HomeClient from "./home.client";

export const metadata: Metadata = {
  title: "VREN Protocol",
  description:
    "VREN is the permissionless payment infrastructure layer for builders the traditional financial system decided to exclude. Accept USDC subscriptions on Polygon with no KYC, no intermediaries, and instant settlement.",
  openGraph: {
    title: "VREN | Your revenue. Your terms.",
    description:
      "The borderless payment infrastructure for the internet economy. Deploy subscription smart contracts on Polygon and accept USDC from anywhere in the world.",
    url: "/home",
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
      "The borderless payment infrastructure for the internet economy.",
    images: ["/og-image.png"],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
