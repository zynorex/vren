import type { Metadata } from "next";
import BlogClient from "./blog.client";

export const metadata: Metadata = {
  title: "Blog | VREN",
  description:
    "Engineering insights, product updates, and thoughts on decentralized finance from the team at VREN.",
  openGraph: {
    title: "Blog | VREN",
    description:
      "Engineering insights, product updates, and thoughts on decentralized finance from the team at VREN.",
    url: "/blog",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VREN Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | VREN",
    description: "Thoughts on decentralized finance from VREN.",
    images: ["/og-image.png"],
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
