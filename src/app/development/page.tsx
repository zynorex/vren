import type { Metadata } from "next";
import DevelopmentClient from "./development.client";

export const metadata: Metadata = {
  title: "Coming Soon",
  description:
    "VREN Protocol goes live on September 19, 2026. The borderless payment infrastructure for the internet economy is almost here.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "VREN Protocol — Coming September 19, 2026",
    description:
      "The borderless payment infrastructure for the internet economy goes live on September 19, 2026. No KYC. No intermediaries. Your revenue, your terms.",
    url: "/development",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VREN Protocol — Coming September 19, 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VREN Protocol — Coming September 19, 2026",
    description:
      "The borderless payment infrastructure for the internet economy. Launching September 19, 2026.",
    images: ["/og-image.png"],
  },
};

export default function DevelopmentPage() {
  return <DevelopmentClient />;
}
