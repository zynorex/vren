"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    num: "01",
    title: "Permissionless Onboarding",
    body: "There is no application process. No KYC form. No manual review queue. You deploy a smart contract to Polygon, register your application on the VREN registry, and your payment infrastructure is live. The entire process takes less than three minutes.",
  },
  {
    num: "02",
    title: "Instant Settlement",
    body: "When a user subscribes, USDC flows directly to your designated payout wallet within the same block. There is no seven day hold period, no minimum balance requirement, and no intermediary bank sitting between you and the money your product earned.",
  },
  {
    num: "03",
    title: "Global by Default",
    body: "VREN operates on public blockchains. There are no supported country lists, no currency conversion intermediaries, and no arbitrary sanctions on where talent is allowed to exist. If your users have a wallet, they can pay you. Period.",
  },
  {
    num: "04",
    title: "Transparent Fee Architecture",
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

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-parchment text-charcoal font-body overflow-hidden">

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: Hero
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 pt-36 lg:pt-52 pb-24 lg:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

          {/* Left: Headline */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center gap-3 mb-10">
              <span className="w-10 h-px bg-terracotta" />
              <span className="font-ui text-[11px] tracking-[0.2em] uppercase text-terracotta font-bold">
                Built in India
              </span>
            </div>
            <h1 className="font-display font-medium tracking-tight text-charcoal leading-[0.95]"
              style={{ fontSize: "clamp(56px, 10vw, 130px)" }}>
              <span className="hero-line block overflow-hidden">Your revenue.</span>
              <span className="hero-line block overflow-hidden text-terracotta">Your terms.</span>
            </h1>
          </div>

          {/* Right: Subtext and CTAs */}
          <div className="lg:col-span-5 flex flex-col pt-4 lg:pt-20">
            <p className="hero-sub font-body text-[20px] lg:text-[26px] leading-[1.45] text-charcoal mb-10 text-balance opacity-0">
              VREN is the payment infrastructure layer for builders the traditional financial system decided to exclude. We replace closed networks with open smart contracts so that any developer, anywhere, can capture the value they create.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 hero-cta opacity-0">
              <Link href="/dev-docs"
                className="bg-charcoal text-parchment font-ui text-[15px] font-medium px-8 py-4 rounded-lg transition-all duration-300 hover:bg-[#2b2a27] hover:shadow-lg hover:-translate-y-px flex items-center gap-2 group">
                Start Building
                <span className="transform transition-transform duration-300 group-hover:translate-x-1 font-light">→</span>
              </Link>
              <Link href="/how-it-works"
                className="font-ui text-[15px] font-medium px-8 py-4 border border-border-subtle rounded-lg text-charcoal hover:border-charcoal transition-colors duration-300">
                How It Works
              </Link>
            </div>

            <div className="mt-16 flex items-center gap-8 border-t border-border-subtle pt-8">
              <div className="hero-stat flex flex-col opacity-0">
                <span className="font-display text-[28px] text-charcoal leading-none">ERC 1155</span>
                <span className="font-ui text-[11px] text-text-muted uppercase tracking-[0.15em] mt-2">Standard</span>
              </div>
              <div className="w-px h-10 bg-border-subtle" />
              <div className="hero-stat flex flex-col opacity-0">
                <span className="font-display text-[28px] text-charcoal leading-none">1.5%</span>
                <span className="font-ui text-[11px] text-text-muted uppercase tracking-[0.15em] mt-2">Platform Fee</span>
              </div>
              <div className="w-px h-10 bg-border-subtle" />
              <div className="hero-stat flex flex-col opacity-0">
                <span className="font-display text-[28px] text-charcoal leading-none">Polygon</span>
                <span className="font-ui text-[11px] text-text-muted uppercase tracking-[0.15em] mt-2">Network</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: The Problem
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-24 lg:py-32">
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
          <div className="lg:col-span-7 flex flex-col gap-10 scroll-reveal">
            <p className="font-body text-[19px] lg:text-[22px] text-text-secondary leading-[1.55]">
              We observed a structural flaw in the internet economy. Your ability to capture the value you create is entirely dependent on where you were born. Traditional payment infrastructure excludes over 60 countries, arbitrarily blocking millions of developers from monetizing their work. Not because their products are inferior. Not because their code is substandard. But because they were born on the wrong side of a banking regulation.
            </p>
            <p className="font-body text-[19px] lg:text-[22px] text-text-secondary leading-[1.55]">
              VREN was built to eliminate that dependency. We replaced the closed, permissioned infrastructure of legacy finance with open, composable smart contracts on Polygon. The result is a payment layer where the quality of your product is the only variable that determines your success.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: Features
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-24 lg:py-32">
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
            <div key={f.num} className="feature-card flex flex-col border-t border-border-subtle pt-8 pb-12 group opacity-0">
              <span className="font-mono text-[12px] text-text-muted mb-5 group-hover:text-terracotta transition-colors duration-300">{f.num}</span>
              <h3 className="font-display text-[24px] lg:text-[28px] text-charcoal mb-4 tracking-tight">{f.title}</h3>
              <p className="font-body text-[17px] text-text-secondary leading-[1.65]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: Code Integration
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-[1200px] mx-auto px-6 lg:px-12 py-24 lg:py-32">
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

          {/* Right: Terminal */}
          <div className="bg-[#161616] flex flex-col">
            <div className="w-full h-12 border-b border-[#2a2a2a] flex items-center px-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="ml-6 font-mono text-[11px] text-[#666666] tracking-[0.1em] uppercase">app.tsx</div>
            </div>
            <div className="p-8 lg:p-10 flex-1 flex flex-col justify-center">
              <pre className="font-mono text-[13px] lg:text-[14px] leading-[1.85] text-[#e0e0e0] overflow-x-auto whitespace-pre">
<span className="text-[#6a9bcc]">import</span>{" { useGate } "}<span className="text-[#6a9bcc]">from</span>{" "}<span className="text-[#788c5d]">{'"@vren/sdk/react"'}</span>{";\n\n"}<span className="text-[#d97757]">function</span>{" "}<span className="text-white">PremiumDashboard</span>{"() {\n  "}<span className="text-[#d97757]">const</span>{" { data } = "}<span className="text-[#c9a07c]">useGate</span>{"("}<span className="text-[#788c5d]">{'"pro"'}</span>{");\n\n  "}<span className="text-[#d97757]">if</span>{" (!data?.access) "}<span className="text-[#d97757]">return</span>{" <UpgradePrompt />;\n  "}<span className="text-[#d97757]">return</span>{" <Dashboard />;\n}"}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5: Stats Band
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
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

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6: Use Cases (Dark Band)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-charcoal text-parchment py-28 lg:py-40">
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">
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
          SECTION 7: How It Works
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-28 lg:py-40">
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
      <section className="w-full bg-charcoal">
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-28 lg:py-36">
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
