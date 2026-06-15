"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { BlogPost } from "@/lib/blog-data";

export default function BlogPostClient({ post }: { post: BlogPost }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();
      
      tl.fromTo(
        ".back-link",
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
      )
      .fromTo(
        ".post-meta",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" },
        "-=0.4"
      )
      .fromTo(
        ".post-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "expo.out" },
        "-=0.6"
      )
      .fromTo(
        ".post-content",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" },
        "-=0.8"
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-parchment text-charcoal font-body overflow-hidden selection:bg-terracotta/20"
    >
      <main className="w-full max-w-[800px] mx-auto px-6 lg:px-12 pt-36 lg:pt-48 pb-32">
        {/* Back Link */}
        <Link 
          href="/blog"
          className="back-link inline-flex items-center gap-2 font-ui text-[14px] font-medium text-text-secondary hover:text-charcoal transition-colors mb-16 opacity-0"
        >
          <span>←</span> Back to Journal
        </Link>

        {/* Article Header */}
        <header className="mb-16 border-b border-border-subtle pb-16">
          <div className="post-meta flex flex-wrap items-center gap-3 md:gap-4 font-ui text-[13px] tracking-wide text-text-secondary mb-8 uppercase opacity-0">
            <span className="font-semibold text-terracotta">{post.category}</span>
            <span className="text-border-subtle">•</span>
            <span>{post.date}</span>
            <span className="text-border-subtle">•</span>
            <span>{post.readTime}</span>
          </div>

          <h1 
            className="post-title font-display font-medium leading-[1.08] tracking-tight text-charcoal opacity-0 text-balance"
            style={{ fontSize: "clamp(36px, 6vw, 64px)" }}
          >
            {post.title}
          </h1>
        </header>

        {/* Article Content */}
        <article className="post-content opacity-0">
          {post.content}
        </article>

        {/* Article Footer */}
        <footer className="mt-24 pt-12 border-t border-border-subtle">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex flex-col gap-2">
              <span className="font-ui text-[12px] uppercase tracking-widest text-text-secondary font-semibold">Share this article</span>
              <div className="flex gap-4 font-ui text-[15px] font-medium text-charcoal">
                <a href={`https://twitter.com/intent/tweet?text=\${encodeURIComponent(post.title)}&url=https://vren.dev/blog/\${post.slug}`} target="_blank" rel="noreferrer" className="hover:text-terracotta transition-colors">Twitter (X)</a>
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=https://vren.dev/blog/\${post.slug}&title=\${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer" className="hover:text-terracotta transition-colors">LinkedIn</a>
              </div>
            </div>
            
            <Link 
              href="/blog"
              className="bg-charcoal text-parchment font-ui text-[14px] font-medium px-6 py-3 rounded-lg hover:bg-[#2b2a27] hover:shadow-md transition-all duration-300"
            >
              Read more articles
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
