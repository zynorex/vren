import type { Metadata } from "next";
import AboutClient from "./about.client";

export const metadata: Metadata = {
  title: "About",
  description:
    "VREN builds borderless payment infrastructure for the internet economy. Our mission is to ensure builders have sovereign control over their revenue.",
  openGraph: {
    title: "About VREN Protocol",
    description:
      "VREN builds borderless payment infrastructure for the internet economy. Our mission is to ensure builders have sovereign control over their revenue.",
    url: "/about",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "About VREN Protocol",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About VREN Protocol",
    description: "VREN builds borderless payment infrastructure for the internet economy.",
    images: ["/og-image.png"],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
