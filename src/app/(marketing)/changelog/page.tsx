import type { Metadata } from "next";
import ChangelogClient from "./changelog.client";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Follow the development of VREN Protocol. Read the latest updates on protocol changes, smart contract deployments, and SDK releases.",
  openGraph: {
    title: "VREN Changelog",
    description:
      "Read the latest updates on VREN protocol changes, smart contract deployments, and SDK releases.",
    url: "/changelog",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VREN Protocol Changelog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VREN Changelog",
    description: "Read the latest updates on VREN protocol changes.",
    images: ["/og-image.png"],
  },
};

export default function ChangelogPage() {
  return <ChangelogClient />;
}
