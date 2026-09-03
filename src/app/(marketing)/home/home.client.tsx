"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { HeroCanvas } from "@/components/HeroCanvas";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { CodeWorkbench } from "@/components/CodeWorkbench";

gsap.registerPlugin(ScrollTrigger);

const TECH_STACK = [
  "Polygon", "USDC", "ERC-1155", "Viem", "Wagmi",
  "Hardhat", "OpenZeppelin", "Supabase", "Vercel", "Next.js", "TypeScript", "Tailwind CSS v4",
];

const FEATURES = [
  {
    num: "01",
    title: "Permissionless Onboarding",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    body: "There is no application process. No KYC form. No manual review queue. You deploy a smart contract to Polygon, register your application on the VREN registry, and your payment infrastructure is live. The entire process takes less than three minutes.",
  },
  {
    num: "02",
    title: "Instant Settlement",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    body: "When a user subscribes, USDC flows directly to your designated payout wallet within the same block. There is no seven day hold period, no minimum balance requirement, and no intermediary bank sitting between you and the money your product earned.",
  },
  {
    num: "03",
    title: "Global by Default",
    icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
    body: "VREN operates on public blockchains. There are no supported country lists, no currency conversion intermediaries, and no arbitrary sanctions on where talent is allowed to exist. If your users have a wallet, they can pay you. Period.",
  },
  {
    num: "04",
    title: "Transparent Fee Architecture",
    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    body: "The platform fee is a flat 1.5 percent, hardcoded into the smart contract with a maximum ceiling of 10 percent that can never be exceeded. You can read the Solidity source yourself. There are no hidden charges.",
  },
];

const USE_CASES = [
  {
    title: "SaaS Subscriptions",
    body: "Deploy a recurring payment contract that grants users a time bound ERC 1155 NFT. Connect it to your Next.js application to gate premium routes, dashboards, and API endpoints with a single React hook.",
  },
  {
    title: "API Access Control",
    body: "Monetize machine learning models, data feeds, or any HTTP API. Users purchase compute credits or subscription tiers on chain. Their wallet signature becomes the API key. No OAuth configuration required.",
  },
  {
    title: "Creator Communities",
    body: "Replace Patreon and Substack with infrastructure you own. Launch a private Discord, a gated content vault, or a members only newsletter where access is cryptographically verified by on chain subscription status.",
  },
  {
    title: "Open Source Funding",
    body: "Offer a premium support tier, early access to releases, or priority issue resolution. Contributors subscribe through your VREN contract and you fund development without diluting equity or signing enterprise agreements.",
  },
];

const STATS = [
  { value: "1.5%", label: "Platform Fee", note: "Hardcoded ceiling, fully transparent" },
  { value: "ERC 1155", label: "Token Standard", note: "Battle tested, broadly supported" },
  { value: "<3 min", label: "Time to Deploy", note: "From zero to accepting payments" },
  { value: "137", label: "Chain ID", note: "Polygon PoS Mainnet" },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hero text reveal
    const heroTl = gsap.timeline();
    heroTl
      .fromTo(".hero-line",
        { y: 80, opacity: 0, rotationX: 8 },
        { y: 0, opacity: 1, rotationX: 0, duration: 1.4, stagger: 0.15, ease: "expo.out" },
        0.3
      )
      .fromTo(".hero-sub",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "expo.out" },
        0.8
      )
      .fromTo(".hero-cta",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "expo.out" },
        1.0
      )
      .fromTo(".hero-stat",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "expo.out" },
        1.2
      )
      .fromTo(".hero-card",
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "expo.out" },
        1.0
      );

    // Scroll triggered sections
    gsap.utils.toArray<HTMLElement>(".scroll-reveal").forEach((el) => {
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        }
      );
    });

    // Feature cards stagger
    ScrollTrigger.batch(".feature-card", {
      onEnter: (batch) =>
        gsap.fromTo(batch,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "expo.out" }
        ),
      start: "top 88%",
      once: true,
    });

    // Use case cards
    ScrollTrigger.batch(".usecase-card", {
      onEnter: (batch) =>
        gsap.fromTo(batch,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: "expo.out" }
        ),
      start: "top 88%",
      once: true,
    });

    // Stats
    ScrollTrigger.batch(".stat-item", {
      onEnter: (batch) =>
        gsap.fromTo(batch,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "expo.out" }
        ),
      start: "top 90%",
      once: true,
    });

    // Divider lines growing in from left
    gsap.utils.toArray<HTMLElement>(".grow-line").forEach((el) => {
      gsap.fromTo(el,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1, duration: 1.2, ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        }
      );
    });

    // Logo Parallax and floating effect
    gsap.to(".hero-logo-bg", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Fix: use rotation + scale only — avoid y conflict with yPercent parallax
    gsap.to(".hero-logo-bg", {
      rotation: 6,
      scale: 1.05,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Marquee infinite scroll
    gsap.to(".marquee-track", {
      x: "-50%",
      duration: 40,
      ease: "none",
      repeat: -1,
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-parchment text-charcoal font-body overflow-hidden">

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: Hero
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full max-w-360 mx-auto px-6 lg:px-12 pt-36 lg:pt-52 pb-24 lg:pb-40 min-h-screen flex flex-col justify-center overflow-hidden">

        {/* Three.js waving grid canvas */}
        <HeroCanvas />

        {/* Background Logo Element */}
        <div className="hero-logo-bg absolute top-1/2 left-2/3 -translate-y-1/2 -translate-x-1/2 w-150 h-150 lg:w-200 lg:h-200 opacity-[0.04] pointer-events-none z-0">
          <Image 
            src="/transparentLogo.png" 
            alt="VREN Logo Background" 
            fill 
            className="object-contain drop-shadow-[0_0_100px_rgba(201,168,76,0.5)]" 
            priority
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start relative z-10">

          {/* Left: Headline + CTAs */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center gap-3 mb-10 opacity-0 hero-line">
              <span className="w-10 h-px bg-terracotta" />
              <span className="font-ui text-[11px] tracking-[0.2em] uppercase text-terracotta font-bold">
                Built in India
              </span>
            </div>
            <h1 className="font-display font-medium tracking-tight text-charcoal leading-[0.95] drop-shadow-sm"
              style={{ fontSize: "clamp(56px, 10vw, 130px)" }}>
              <span className="hero-line block overflow-hidden">Your revenue.</span>
              <span className="hero-line block overflow-hidden text-terracotta">Your terms.</span>
            </h1>

            <p className="hero-sub font-body text-[18px] lg:text-[22px] leading-normal text-text-secondary mt-10 mb-10 max-w-xl text-balance opacity-0">
              Open payment infrastructure on Polygon. Accept USDC subscriptions with no KYC, no intermediaries, and instant settlement.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 hero-cta opacity-0">
              <Link href="/dev-docs"
                className="bg-charcoal text-parchment font-ui text-[15px] font-medium px-8 py-4 rounded-lg transition-all duration-300 hover:bg-[#2b2a27] hover:shadow-xl hover:-translate-y-1 flex items-center gap-2 group border border-transparent">
                Start Building
                <span className="transform transition-transform duration-300 group-hover:translate-x-1 font-light">→</span>
              </Link>
              <Link href="/how-it-works"
                className="font-ui text-[15px] font-medium px-8 py-4 border border-border-subtle rounded-lg text-charcoal hover:border-charcoal hover:bg-white/50 transition-all duration-300 backdrop-blur-sm">
                How It Works
              </Link>
            </div>

            <div className="mt-16 flex items-center gap-6 lg:gap-8 border-t border-border-subtle pt-8">
              <div className="hero-stat flex flex-col opacity-0">
                <span className="font-display text-[26px] lg:text-[28px] text-charcoal leading-none">ERC 1155</span>
                <span className="font-ui text-[11px] text-text-muted uppercase tracking-[0.15em] mt-2">Standard</span>
              </div>
              <div className="w-px h-10 bg-border-subtle" />
              <div className="hero-stat flex flex-col opacity-0">
                <span className="font-display text-[26px] lg:text-[28px] text-charcoal leading-none">1.5%</span>
                <span className="font-ui text-[11px] text-text-muted uppercase tracking-[0.15em] mt-2">Platform Fee</span>
              </div>
              <div className="w-px h-10 bg-border-subtle" />
              <div className="hero-stat flex flex-col opacity-0">
                <span className="font-display text-[26px] lg:text-[28px] text-charcoal leading-none">Polygon</span>
                <span className="font-ui text-[11px] text-text-muted uppercase tracking-[0.15em] mt-2">Network</span>
              </div>
            </div>
          </div>

          {/* Right: Live Product Preview */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end lg:pt-8">
            <SubscriptionCard />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: The Problem
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-360 mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="grow-line w-full h-px bg-border-subtle mb-16" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-5 scroll-reveal">
            <span className="font-ui text-[11px] tracking-[0.2em] uppercase text-terracotta font-bold mb-6 block">
              The Problem
            </span>
            <h2 className="font-display text-[40px] lg:text-[56px] leading-[1.08] tracking-tight text-charcoal">
              The geographic lottery of global finance.
            </h2>
          </div>
          <div className="lg:col-span-7 flex flex-col gap-8 scroll-reveal">
            <p className="font-body text-[19px] lg:text-[21px] text-text-secondary leading-[1.55]">
              Traditional payment infrastructure forces developers into a geographic lottery. Where you were born dictates whether you're allowed to accept payment for your software.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-xl border border-terracotta/20 bg-terracotta/5 flex flex-col justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-terracotta font-semibold">Exclusion</span>
                <div className="my-4">
                  <span className="font-display text-[32px] text-charcoal font-medium">60+</span>
                  <p className="font-ui text-[12px] text-text-secondary mt-1">Countries blocked by legacy payment gateways</p>
                </div>
              </div>
              <div className="p-6 rounded-xl border border-border-subtle bg-white shadow-xs flex flex-col justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted font-semibold">Payout Friction</span>
                <div className="my-4">
                  <span className="font-display text-[32px] text-charcoal font-medium">7–14d</span>
                  <p className="font-ui text-[12px] text-text-secondary mt-1">Average bank settlement delay & hold periods</p>
                </div>
              </div>
              <div className="p-6 rounded-xl border border-border-subtle bg-white shadow-xs flex flex-col justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted font-semibold">Hidden Rake</span>
                <div className="my-4">
                  <span className="font-display text-[32px] text-charcoal font-medium">3.5%+</span>
                  <p className="font-ui text-[12px] text-text-secondary mt-1">Combined transaction & cross-border fees</p>
                </div>
              </div>
            </div>
            <p className="font-body text-[17px] text-text-secondary leading-[1.6]">
              VREN replaces closed, permissioned legacy networks with open smart contracts on Polygon. The quality of your software is the only variable that determines your revenue.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: Features
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-360 mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="grow-line w-full h-px bg-border-subtle mb-16" />
        <div className="mb-16 scroll-reveal">
          <span className="font-ui text-[11px] tracking-[0.2em] uppercase text-terracotta font-bold mb-6 block">
            Core Principles
          </span>
          <h2 className="font-display text-[40px] lg:text-[56px] leading-[1.08] tracking-tight text-charcoal max-w-3xl">
            Infrastructure designed for sovereignty, not surveillance.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
          {FEATURES.map((f) => (
            <div key={f.num} className="feature-card flex flex-col border-t border-border-subtle pt-8 pb-12 group opacity-0 transition-all duration-300 hover:-translate-y-1 relative pl-0 hover:pl-4">
              {/* Hover accent bar */}
              <div className="absolute left-0 top-8 bottom-12 w-[2px] bg-terracotta scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
              <div className="flex items-center gap-3 mb-5">
                <svg className="w-5 h-5 text-terracotta/70 group-hover:text-terracotta transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={f.icon} />
                </svg>
                <span className="font-mono text-[12px] text-text-muted group-hover:text-terracotta transition-colors duration-300">{f.num}</span>
              </div>
              <h3 className="font-display text-[24px] lg:text-[28px] text-charcoal mb-4 tracking-tight">{f.title}</h3>
              <p className="font-body text-[17px] text-text-secondary leading-[1.65]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: Code Integration
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-300 mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border-subtle rounded-2xl overflow-hidden bg-white shadow-[0_16px_48px_rgba(25,25,24,0.06)]">

          {/* Left: Copy */}
          <div className="p-10 lg:p-16 flex flex-col justify-center lg:border-r border-border-subtle">
            <span className="font-ui text-[11px] tracking-[0.15em] uppercase text-terracotta font-bold mb-6">
              Developer Experience
            </span>
            <h3 className="font-display text-[32px] lg:text-[42px] leading-[1.1] text-charcoal mb-6 tracking-tight">
              Three lines of code. Full access control.
            </h3>
            <p className="font-body text-[17px] text-text-secondary leading-[1.65] mb-10">
              Import the SDK, wrap your application in the VREN provider, and call the useGate hook wherever you need to verify a subscription. The smart contract handles payment routing, NFT minting, and expiry verification. Your frontend just asks one question: does this wallet have access?
            </p>
            <Link href="/dev-docs" className="font-ui text-charcoal text-[15px] font-medium pb-1 border-b border-charcoal hover:text-terracotta hover:border-terracotta transition-colors inline-flex items-center gap-2 w-fit group">
              Read the documentation
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Right: Interactive Code Workbench */}
          <CodeWorkbench />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5: Stats Band
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-360 mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grow-line w-full h-px bg-border-subtle mb-16" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {STATS.map((s) => (
            <div key={s.label} className="stat-item flex flex-col opacity-0">
              <span className="font-display text-[36px] lg:text-[44px] text-charcoal leading-none tracking-tight">{s.value}</span>
              <span className="font-ui text-[13px] font-semibold text-charcoal mt-3 mb-1">{s.label}</span>
              <span className="font-body text-[14px] text-text-secondary">{s.note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ BUILT ON OPEN INFRASTRUCTURE ══════════════ */}
      <div className="w-full border-y border-border-subtle py-5 overflow-hidden bg-cream/50">
        <div className="marquee-track flex w-max">
          {[...TECH_STACK, ...TECH_STACK].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-6 px-8 font-ui text-[12px] text-text-muted uppercase tracking-[0.18em] font-semibold whitespace-nowrap"
            >
              {item}
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-stone/40" />
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6: Use Cases (Dark Band)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-charcoal text-parchment py-28 lg:py-40">
        <div className="w-full max-w-360 mx-auto px-6 lg:px-12">
          <div className="mb-20 scroll-reveal">
            <span className="font-ui text-[11px] tracking-[0.2em] uppercase text-stone font-bold mb-6 block">
              Capabilities
            </span>
            <h2 className="font-display text-[40px] lg:text-[56px] leading-[1.08] tracking-tight text-parchment max-w-4xl">
              What you can build with VREN.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
            {USE_CASES.map((uc) => (
              <div key={uc.title} className="usecase-card flex flex-col border-t border-[#2e2e2c] pt-8 pb-12 opacity-0">
                <h3 className="font-display text-[22px] lg:text-[26px] text-parchment mb-4 tracking-tight">{uc.title}</h3>
                <p className="font-body text-[16px] text-stone leading-[1.65]">{uc.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          COMPARISON TABLE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-360 mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="grow-line w-full h-px bg-border-subtle mb-16" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-14 scroll-reveal">
          <div className="lg:col-span-5">
            <span className="font-ui text-[11px] tracking-[0.2em] uppercase text-terracotta font-bold mb-6 block">Why VREN</span>
            <h2 className="font-display text-[40px] lg:text-[56px] leading-[1.08] tracking-tight text-charcoal">Built differently.</h2>
          </div>
          <div className="lg:col-span-7 flex items-end">
            <p className="font-body text-[18px] lg:text-[20px] text-text-secondary leading-[1.55]">
              Every other payment rail was designed for a world with borders. VREN was designed for the internet.
            </p>
          </div>
        </div>
        <div className="scroll-reveal overflow-x-auto rounded-2xl border border-border-subtle shadow-sm">
          <table className="w-full min-w-150 text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="px-5 py-4 bg-cream/80 font-ui text-[11px] text-text-muted uppercase tracking-wider">Feature</th>
                <th className="px-5 py-4 bg-terracotta/8 border-l-2 border-terracotta/40 font-ui text-[13px] font-bold text-terracotta shadow-[inset_0_0_20px_rgba(217,119,87,0.06)]">
                  <div className="flex items-center gap-2">
                    VREN
                    <span className="font-ui text-[9px] font-bold uppercase tracking-wider bg-terracotta text-white px-2 py-0.5 rounded-full">Recommended</span>
                  </div>
                </th>
                <th className="px-5 py-4 bg-cream/80 font-ui text-[13px] font-semibold text-charcoal">Stripe / Traditional</th>
                <th className="px-5 py-4 bg-cream/80 font-ui text-[13px] font-semibold text-charcoal">Generic Crypto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {[
                ["KYC Required",          "No",                  "Yes — full review",        "No"],
                ["Country restrictions",  "None",                "60+ countries blocked",    "None"],
                ["Settlement speed",      "Instant",             "3–7 business days",        "Instant"],
                ["Platform fee",          "1.5% flat ceiling",   "2.9% + $0.30 per txn",    "Gas cost only"],
                ["Open source",           "Fully open",          "Proprietary",              "Varies"],
                ["Subscription NFTs",     "ERC-1155 built-in",   "Not available",            "Build it yourself"],
                ["Vendor lock-in",        "None",                "API + pricing lock-in",    "None"],
              ].map(([feature, vren, stripe, crypto], i) => (
                <tr key={feature} className={i % 2 === 0 ? "bg-white" : "bg-parchment/40"}>
                  <td className="px-5 py-4 font-ui text-[13px] font-semibold text-charcoal">{feature}</td>
                  <td className="px-5 py-4 font-body text-[14px] text-charcoal bg-terracotta/4 border-l-2 border-terracotta/20 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-sage shrink-0" viewBox="0 0 16 16" fill="none"><path d="M2 8.5L6 12.5L14 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {vren}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-body text-[14px] text-text-secondary">{stripe}</td>
                  <td className="px-5 py-4 font-body text-[14px] text-text-secondary">{crypto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7: How It Works
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-360 mx-auto px-6 lg:px-12 py-28 lg:py-40">
        <div className="grow-line w-full h-px bg-border-subtle mb-16" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-20 scroll-reveal">
          <div className="lg:col-span-5">
            <span className="font-ui text-[11px] tracking-[0.2em] uppercase text-terracotta font-bold mb-6 block">
              Architecture
            </span>
            <h2 className="font-display text-[40px] lg:text-[56px] leading-[1.08] tracking-tight text-charcoal">
              Four steps from zero to revenue.
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="font-body text-[19px] lg:text-[22px] text-text-secondary leading-[1.55]">
              VREN is composed of two audited Solidity contracts, a TypeScript SDK, and a set of React hooks. The entire integration path is designed to be completed in a single afternoon.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Register", body: "Call registerApp on the VREN Registry contract. This generates a unique appId tied to your wallet and sets your payout address." },
            { step: "02", title: "Create Plans", body: "Define subscription tiers with price (in USDC) and duration (in seconds). Each plan is stored on chain and immediately available to your users." },
            { step: "03", title: "Integrate the SDK", body: "Install @vren/sdk, wrap your app in VrenProvider, and use the useGate hook to check subscription status on any route or component." },
            { step: "04", title: "Collect Revenue", body: "When a user subscribes, USDC is split automatically. 98.5 percent goes directly to your payout wallet. 1.5 percent goes to the VREN treasury." },
          ].map((s) => (
            <div key={s.step} className="feature-card flex flex-col border-t border-border-subtle pt-8 opacity-0">
              <span className="font-mono text-[12px] text-terracotta mb-4">{s.step}</span>
              <h3 className="font-display text-[20px] lg:text-[22px] text-charcoal mb-3 tracking-tight">{s.title}</h3>
              <p className="font-body text-[15px] text-text-secondary leading-[1.65]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 8: CTA Band
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-charcoal relative overflow-hidden">
        {/* Ambient dot grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        {/* Terracotta radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-terracotta/[0.06] rounded-full blur-[100px] pointer-events-none" />
        <div className="w-full max-w-360 mx-auto px-6 lg:px-12 py-28 lg:py-36 relative z-10">
          <div className="scroll-reveal flex flex-col items-center text-center">
            <h2 className="font-display text-[40px] lg:text-[64px] leading-[1.05] tracking-tight text-parchment max-w-3xl mb-8">
              Your product deserves a payment layer that does not discriminate.
            </h2>
            <p className="font-body text-[18px] lg:text-[22px] text-stone max-w-2xl mb-12 text-balance">
              VREN is free to start, open source, and live on Polygon Mainnet. Deploy your first subscription contract today.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/dev-docs"
                className="bg-parchment text-charcoal font-ui text-[15px] font-medium px-10 py-4 rounded-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-px flex items-center gap-2 group">
                Start Building
                <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link href="/about"
                className="font-ui text-[15px] font-medium px-8 py-4 border border-[#2e2e2c] rounded-lg text-stone hover:text-parchment hover:border-parchment/30 transition-all duration-300">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
