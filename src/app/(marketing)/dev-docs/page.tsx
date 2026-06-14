import type { Metadata } from "next";
import DevDocsClient from "./dev-docs.client";

export const metadata: Metadata = {
  title: "Developer Documentation",
  description:
    "Everything you need to integrate VREN into your application. Install the SDK, deploy a subscription smart contract on Polygon, and start accepting USDC payments in minutes.",
  openGraph: {
    title: "Developer Docs | VREN Protocol",
    description:
      "Install the VREN SDK, wrap your app in VrenProvider, and call useGate to gate any feature behind a blockchain subscription. Full documentation for the smart contracts, REST API, and React hooks.",
    url: "/dev-docs",
    images: [
      {
        url: "/og-image-docs.png",
        width: 1200,
        height: 630,
        alt: "VREN Developer Documentation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Docs | VREN Protocol",
    description:
      "Install the VREN SDK and start accepting permissionless USDC subscriptions on Polygon.",
    images: ["/og-image-docs.png"],
  },
};

export default function DevDocsPage() {
  return <DevDocsClient />;
}
