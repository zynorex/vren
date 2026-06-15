"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const POSTS = [
  {
    title: "Why we chose Polygon PoS over Ethereum Mainnet",
    excerpt: "An architectural deep dive into our decision to deploy the VREN registry and subscription contracts on Polygon. How we evaluated transaction finality, gas overhead, and ecosystem maturity.",
    date: "Jun 14, 2026",
    category: "Engineering",
    readTime: "6 min read",
    slug: "/blog/polygon-vs-ethereum",
  },
  {
    title: "Building an offline-first SDK for decentralized payments",
    excerpt: "Traditional SDKs fail gracefully. Web3 SDKs often fail catastrophically. Here is how we engineered the VREN SDK to degrade gracefully when RPC endpoints drop.",
    date: "May 28, 2026",
    category: "Engineering",
    readTime: "8 min read",
    slug: "/blog/offline-first-sdk",
  },
  {
    title: "The geometry of trust: Designing the VREN brand",
    excerpt: "Trust in financial technology is usually established through legal compliance. In decentralized systems, trust is established through code and communicated through design. A look at the Indian architectural heritage behind our brand.",
    date: "May 10, 2026",
    category: "Design",
    readTime: "5 min read",
    slug: "/blog/geometry-of-trust",
  },
  {
    title: "Announcing VREN 1.0: Allowing Revenue To flow Honestly, Autonomously",
    excerpt: "Today we are bringing VREN out of beta. After months of testing and security audits, the protocol is live on mainnet and ready for production workloads.",
    date: "Apr 22, 2026",
    category: "Company",
    readTime: "4 min read",
    slug: "/blog/announcing-vren",
  },
  {
    title: "How to gate Next.js 15 App Router routes on-chain",
    excerpt: "A practical guide to implementing server-side wallet verification using the new Next.js 15 capabilities and the VREN SDK.",
    date: "Mar 15, 2026",
    category: "Tutorial",
    readTime: "7 min read",
    slug: "/blog/gate-nextjs-15",
  },
];

export default function BlogClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hero reveal
      const heroTl = gsap.timeline();
      heroTl
        .fromTo(
          ".hero-eyebrow",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "expo.out" },
          0.2
        )
        .fromTo(
          ".hero-title",
          { y: 50, opacity: 0, rotationX: 10 },
          { y: 0, opacity: 1, rotationX: 0, duration: 1.2, ease: "expo.out" },
          0.4
        )
        .fromTo(
          ".hero-sub",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "expo.out" },
          0.6
        );

      // Blog posts
      ScrollTrigger.batch(".blog-post", {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: "expo.out" }
          ),
        start: "top 85%",
        once: true,
      });

      // Divider lines growing in
      gsap.utils.toArray<HTMLElement>(".grow-line").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-parchment text-charcoal font-body overflow-hidden"
    >
      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: Hero
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 pt-36 lg:pt-52 pb-20 lg:pb-28">
        <div className="flex flex-col items-start max-w-4xl">
          <span className="hero-eyebrow font-ui text-[11px] tracking-[0.2em] uppercase text-terracotta font-bold mb-8 opacity-0">
            Journal
          </span>
          <h1
            className="hero-title font-display font-medium tracking-tight text-charcoal leading-[1.05] mb-8 opacity-0"
            style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
          >
            Engineering, design, and economics.
          </h1>
          <p className="hero-sub font-body text-[20px] lg:text-[24px] leading-[1.55] text-text-secondary max-w-2xl text-balance opacity-0">
            Notes on building decentralized payment infrastructure for the modern web. We write about our architectural decisions, design philosophy, and the future of open finance.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: Posts List
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-[1200px] mx-auto px-6 lg:px-12 pb-32 lg:pb-40">
        <div className="grow-line w-full h-px bg-border-subtle mb-8" />
        
        <div className="flex flex-col">
          {POSTS.map((post, i) => (
            <Link href={post.slug} key={i} className="blog-post block group opacity-0">
              <article className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-12 lg:py-16 border-b border-border-subtle">
                {/* Meta Information (Left side on desktop) */}
                <div className="md:col-span-3 flex md:flex-col gap-4 md:gap-2 pt-1 font-ui text-[13px] text-text-secondary">
                  <span className="font-semibold text-charcoal">{post.category}</span>
                  <span className="hidden md:inline text-border-subtle">—</span>
                  <span className="md:hidden text-border-subtle">•</span>
                  <span>{post.date}</span>
                  <span className="hidden md:inline text-border-subtle">—</span>
                  <span className="md:hidden text-border-subtle">•</span>
                  <span>{post.readTime}</span>
                </div>

                {/* Content (Right side on desktop) */}
                <div className="md:col-span-9 flex flex-col">
                  <h2 className="font-display text-[28px] lg:text-[36px] leading-[1.15] tracking-tight text-charcoal mb-4 group-hover:text-terracotta transition-colors duration-300">
                    {post.title}
                  </h2>
                  <p className="font-body text-[17px] lg:text-[19px] leading-[1.6] text-text-secondary max-w-3xl">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-8 flex items-center gap-2 font-ui text-[14px] font-medium text-terracotta opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Read article
                    <span>→</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
        
        {/* Pagination placeholder */}
        <div className="mt-16 flex items-center justify-between font-ui text-[14px] text-text-secondary">
          <button className="flex items-center gap-2 hover:text-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            <span>←</span> Previous
          </button>
          <span>Page 1 of 1</span>
          <button className="flex items-center gap-2 hover:text-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            Next <span>→</span>
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: Newsletter CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-charcoal">
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-24 lg:py-32">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
            <div className="flex flex-col max-w-2xl">
              <h2 className="font-display text-[32px] lg:text-[48px] leading-[1.05] tracking-tight text-parchment mb-4">
                Receive engineering updates.
              </h2>
              <p className="font-body text-[18px] text-stone text-balance">
                A sporadic newsletter covering our protocol design decisions, cryptography, and product releases. No marketing spam.
              </p>
            </div>
            
            <div className="w-full lg:w-auto flex-1 max-w-md">
              <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="flex-1 bg-[#1a1a19] border border-[#2e2e2c] text-parchment px-5 py-4 rounded-lg font-ui text-[15px] focus:outline-none focus:border-warm-gold focus:ring-1 focus:ring-warm-gold transition-all"
                  required
                />
                <button 
                  type="submit"
                  className="bg-parchment text-charcoal font-ui text-[15px] font-medium px-8 py-4 rounded-lg transition-all duration-300 hover:bg-[#e8e6dc] shrink-0"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
