"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* ─── Tier Data ──────────────────────────────────────────────────────── */

const INDIVIDUAL_TIERS = [
  {
    name: "Free",
    tagline: "Experiment and explore",
    price: "$0",
    interval: "forever",
    cta: "Start building",
    href: "/dev-docs",
    highlight: false,
    features: [
      "Up to 100 active subscriptions",
      "Basic dashboard analytics",
      "Community Discord access",
      "Standard email support",
      "1.5% platform transaction fee",
    ],
  },
  {
    name: "Pro",
    tagline: "Ship and scale",
    price: "$19",
    interval: "per month",
    cta: "Get Pro",
    href: "/dashboard",
    highlight: true,
    features: [
      "Unlimited active subscriptions",
      "Advanced MRR & churn analytics",
      "Priority email support",
      "Custom webhook endpoints",
      "Exportable subscriber data",
      "1.5% platform transaction fee",
    ],
  },
  {
    name: "Business",
    tagline: "Custom infrastructure",
    price: "$79",
    interval: "per month",
    cta: "Contact Sales",
    href: "mailto:sales@vren.dev",
    highlight: false,
    features: [
      "Everything in Pro",
      "Dedicated Slack channel",
      "Custom smart contract deployment",
      "API rate limit increases",
      "Multi-signature treasury support",
      "Negotiable volume pricing",
    ],
  },
];

const TEAM_TIERS = [
  {
    name: "Team",
    tagline: "For growing teams",
    price: "$49",
    interval: "per seat / month",
    cta: "Get Team plan",
    href: "/dashboard",
    highlight: false,
    features: [
      "Everything in Pro",
      "Centralized billing & admin",
      "Team-level analytics dashboard",
      "Shared webhook configurations",
      "Role-based access control",
      "Priority support SLA",
    ],
  },
  {
    name: "Enterprise",
    tagline: "For large organizations",
    price: "Custom",
    interval: "tailored pricing",
    cta: "Contact Sales",
    href: "mailto:sales@vren.dev",
    highlight: true,
    features: [
      "Everything in Team",
      "Dedicated account manager",
      "Custom SLA agreements",
      "On-chain audit reports",
      "Multi-signature governance",
      "Volume fee negotiation",
      "SSO & SCIM provisioning",
    ],
  },
];

/* ─── Comparison Data ────────────────────────────────────────────────── */

const COMPARISON = [
  { feature: "Platform Fee", vren: "1.5%", stripe: "2.9% + 30¢", unlock: "Up to 10%", diy: "0% (+ Gas)" },
  { feature: "Geographic Reach", vren: "Global", stripe: "~46 Countries", unlock: "Global", diy: "Global" },
  { feature: "Integration Time", vren: "< 3 mins", stripe: "Days to Weeks", unlock: "Hours", diy: "Months" },
  { feature: "Censorship Resistance", vren: "High", stripe: "None", unlock: "High", diy: "High" },
  { feature: "Maintenance Burden", vren: "None", stripe: "High", unlock: "Low", diy: "Extreme" },
  { feature: "Payout Settlement", vren: "Instant", stripe: "2–7 days", unlock: "Instant", diy: "Instant" },
];

/* ─── FAQ Data ───────────────────────────────────────────────────────── */

const FAQS = [
  {
    q: "How does the 1.5% platform fee work?",
    a: "The fee is deducted automatically at the smart contract level at the moment of transaction. When a user pays for a subscription in USDC, the contract routes 98.5% directly to your designated payout wallet and 1.5% to the VREN treasury. There are no invoices or end-of-month true-ups.",
  },
  {
    q: "Do I have to pay gas fees for my users?",
    a: "By default, users pay their own gas (typically less than a cent on Polygon). However, the VREN SDK supports integration with account abstraction providers if you choose to sponsor gas for a completely gasless experience.",
  },
  {
    q: "Can I migrate away from VREN later?",
    a: "Yes. Your subscription data lives on the Polygon blockchain, not in a proprietary silo. You can always write your own interface to read your users' subscription states directly from the contract, making vendor lock-in cryptographically impossible.",
  },
  {
    q: "Are there any volume discounts?",
    a: "Yes. For applications processing over $50,000 in monthly recurring revenue (MRR), we offer custom platform fee arrangements under our Business tier. Contact our sales team for details.",
  },
  {
    q: "What currencies does VREN support?",
    a: "Currently VREN processes all subscriptions in USDC on Polygon. This gives you a stable, dollar-denominated revenue stream without currency conversion fees or volatility risk.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "Yes. Every new account starts on the Free tier with full access to core features. You can upgrade to Pro at any time, and we offer a 14-day money-back guarantee if it's not the right fit.",
  },
];

/* ─── Tier Icon SVGs ─────────────────────────────────────────────────── */

function TierIcon({ tier }: { tier: string }) {
  if (tier === "Free" || tier === "Team") {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="shrink-0">
        <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="4" fill="currentColor" />
      </svg>
    );
  }
  if (tier === "Pro" || tier === "Enterprise") {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="shrink-0">
        <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="10" r="3" fill="currentColor" />
        <circle cx="10" cy="20" r="3" fill="currentColor" />
        <circle cx="22" cy="20" r="3" fill="currentColor" />
        <line x1="16" y1="13" x2="10" y2="17" stroke="currentColor" strokeWidth="1.2" />
        <line x1="16" y1="13" x2="22" y2="17" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="shrink-0">
      <rect x="3" y="3" width="26" height="26" rx="6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="12" r="3" fill="currentColor" />
      <circle cx="10" cy="22" r="3" fill="currentColor" />
      <circle cx="22" cy="22" r="3" fill="currentColor" />
      <line x1="16" y1="15" x2="10" y2="19" stroke="currentColor" strokeWidth="1.2" />
      <line x1="16" y1="15" x2="22" y2="19" stroke="currentColor" strokeWidth="1.2" />
      <line x1="10" y1="22" x2="22" y2="22" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/* ─── Check Icon ─────────────────────────────────────────────────────── */

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={`w-[18px] h-[18px] shrink-0 ${className || ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

/* ─── FAQ Item ───────────────────────────────────────────────────────── */

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="faq-item border-b border-border-subtle opacity-0"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-7 text-left group cursor-pointer"
        aria-expanded={open}
      >
        <span className="font-display text-[18px] lg:text-[20px] tracking-tight text-charcoal pr-8 group-hover:text-terracotta transition-colors">
          {q}
        </span>
        <span
          className={`text-dim text-[20px] font-light shrink-0 transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          maxHeight: open ? contentRef.current?.scrollHeight + "px" : "0px",
          opacity: open ? 1 : 0,
        }}
      >
        <p className="font-body text-[16px] text-text-secondary leading-[1.7] pb-7 max-w-[680px]">
          {a}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function PricingClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"individual" | "teams">("individual");

  const tiers = tab === "individual" ? INDIVIDUAL_TIERS : TEAM_TIERS;

  useGSAP(
    () => {
      // Hero
      const heroTl = gsap.timeline();
      heroTl
        .fromTo(".pricing-eyebrow", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "expo.out" }, 0.15)
        .fromTo(".pricing-title", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out" }, 0.3)
        .fromTo(".pricing-subtitle", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out" }, 0.5)
        .fromTo(".pricing-toggle", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "expo.out" }, 0.65);

      // Cards
      ScrollTrigger.batch(".pricing-card", {
        onEnter: (batch) =>
          gsap.fromTo(batch, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "expo.out" }),
        start: "top 88%",
        once: true,
      });

      // Comparison
      gsap.fromTo(".comparison-section", { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: "expo.out",
        scrollTrigger: { trigger: ".comparison-section", start: "top 85%", once: true },
      });

      // FAQs
      ScrollTrigger.batch(".faq-item", {
        onEnter: (batch) =>
          gsap.fromTo(batch, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "expo.out" }),
        start: "top 92%",
        once: true,
      });

      // Dividers
      gsap.utils.toArray<HTMLElement>(".grow-line").forEach((el) => {
        gsap.fromTo(el, { scaleX: 0, transformOrigin: "left center" }, {
          scaleX: 1, duration: 1.2, ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-parchment text-charcoal font-body overflow-hidden">

      {/* ══════════════ HERO ══════════════ */}
      <section className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 pt-36 lg:pt-48 pb-16 lg:pb-20">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <span className="pricing-eyebrow font-ui text-[11px] tracking-[0.2em] uppercase text-terracotta font-bold mb-6 opacity-0">
            Pricing
          </span>
          <h1
            className="pricing-title font-display font-medium tracking-tight text-charcoal leading-[1.05] mb-6 opacity-0"
            style={{ fontSize: "clamp(40px, 7vw, 80px)" }}
          >
            Plans that scale{" "}
            <span className="text-terracotta">with you</span>
          </h1>
          <p className="pricing-subtitle font-body text-[18px] lg:text-[22px] leading-[1.6] text-text-secondary max-w-xl text-balance opacity-0">
            No hidden fees. No arbitrary freezes. Just a simple, immutable fee
            structure enforced by mathematics.
          </p>
        </div>
      </section>

      {/* ══════════════ TAB TOGGLE ══════════════ */}
      <section className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 pb-12 flex justify-center">
        <div className="pricing-toggle inline-flex bg-cream rounded-xl p-1 opacity-0">
          <button
            onClick={() => setTab("individual")}
            className={`px-6 py-2.5 rounded-lg font-ui text-[14px] font-medium transition-all duration-300 cursor-pointer ${
              tab === "individual"
                ? "bg-charcoal text-parchment shadow-md"
                : "text-text-secondary hover:text-charcoal"
            }`}
          >
            Individual
          </button>
          <button
            onClick={() => setTab("teams")}
            className={`px-6 py-2.5 rounded-lg font-ui text-[14px] font-medium transition-all duration-300 cursor-pointer ${
              tab === "teams"
                ? "bg-charcoal text-parchment shadow-md"
                : "text-text-secondary hover:text-charcoal"
            }`}
          >
            Team &amp; Enterprise
          </button>
        </div>
      </section>

      {/* ══════════════ PRICING CARDS ══════════════ */}
      <section className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 pb-24 lg:pb-32">
        <div
          className={`grid gap-6 items-stretch ${
            tiers.length === 3
              ? "grid-cols-1 md:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2 max-w-[900px] mx-auto"
          }`}
        >
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`pricing-card flex flex-col rounded-2xl transition-all duration-300 opacity-0 ${
                tier.highlight
                  ? "bg-charcoal text-parchment shadow-xl ring-1 ring-warm-gold/40"
                  : "bg-white border border-border-subtle shadow-sm hover:shadow-md"
              }`}
            >
              {/* Card Header */}
              <div className="p-8 lg:p-10 pb-0">
                <div className="flex items-center gap-3 mb-6">
                  <span className={tier.highlight ? "text-warm-gold" : "text-terracotta"}>
                    <TierIcon tier={tier.name} />
                  </span>
                  <div>
                    <h3 className="font-display text-[20px] tracking-tight leading-none">
                      {tier.name}
                    </h3>
                    <p className={`font-body text-[13px] mt-1 ${tier.highlight ? "text-stone" : "text-text-muted"}`}>
                      {tier.tagline}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-display text-[44px] leading-none tracking-tight">
                    {tier.price}
                  </span>
                  <span className={`font-ui text-[13px] ${tier.highlight ? "text-stone" : "text-text-secondary"}`}>
                    {tier.interval}
                  </span>
                </div>

                {/* CTA */}
                <Link
                  href={tier.href}
                  className={`mt-6 w-full text-center py-3.5 rounded-xl font-ui text-[14px] font-medium transition-all duration-300 block ${
                    tier.highlight
                      ? "bg-parchment text-charcoal hover:bg-white hover:shadow-lg"
                      : "bg-charcoal text-parchment hover:bg-[#2b2a27] hover:shadow-md"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>

              {/* Divider */}
              <div className={`mx-8 lg:mx-10 my-6 h-px ${tier.highlight ? "bg-white/10" : "bg-border-subtle"}`} />

              {/* Features */}
              <div className="px-8 lg:px-10 pb-8 lg:pb-10 flex-1">
                <p className={`font-ui text-[11px] tracking-[0.12em] uppercase mb-4 ${tier.highlight ? "text-stone" : "text-text-muted"}`}>
                  {tier.name === "Free" ? "Includes" : tier.name === "Pro" ? "Everything in Free, and" : tier.name === "Team" ? "Everything in Pro, and" : "Everything in Team, and"}
                </p>
                <ul className="flex flex-col gap-3.5">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckIcon className={`mt-0.5 ${tier.highlight ? "text-warm-gold" : "text-terracotta"}`} />
                      <span className={`font-body text-[15px] leading-snug ${tier.highlight ? "text-[#e8e6dc]" : "text-charcoal"}`}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Highlight badge */}
              {tier.highlight && (
                <div className="px-8 lg:px-10 pb-6">
                  <p className="font-ui text-[12px] text-stone/80 text-center">
                    No commitment. Cancel anytime.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footnote */}
        <p className="text-center font-ui text-[13px] text-text-muted mt-8">
          All plans include a flat 1.5% platform fee on transactions. No hidden costs. Prices exclude applicable taxes.
        </p>
      </section>

      {/* ══════════════ COMPARISON TABLE ══════════════ */}
      <section className="w-full max-w-[1200px] mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="grow-line w-full h-px bg-border-subtle mb-16" />
        <div className="comparison-section opacity-0">
          <div className="mb-12">
            <span className="font-ui text-[11px] tracking-[0.2em] uppercase text-terracotta font-bold mb-4 block">
              Competitive Analysis
            </span>
            <h2 className="font-display text-[36px] lg:text-[48px] leading-[1.08] tracking-tight text-charcoal">
              How VREN compares.
            </h2>
          </div>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="border-b-2 border-charcoal">
                  <th className="py-5 px-4 font-ui text-[11px] uppercase tracking-[0.1em] text-text-muted w-[22%]">
                    Feature
                  </th>
                  <th className="py-5 px-5 font-display text-[18px] text-charcoal bg-cream/60 rounded-tl-xl border-x border-t border-border-subtle w-[20%] text-center">
                    VREN
                  </th>
                  <th className="py-5 px-4 font-ui text-[13px] font-semibold text-text-secondary w-[18%] text-center">
                    Stripe
                  </th>
                  <th className="py-5 px-4 font-ui text-[13px] font-semibold text-text-secondary w-[20%] text-center">
                    Unlock Protocol
                  </th>
                  <th className="py-5 px-4 font-ui text-[13px] font-semibold text-text-secondary w-[20%] text-center">
                    DIY Contract
                  </th>
                </tr>
              </thead>
              <tbody className="font-body text-[14px] text-charcoal">
                {COMPARISON.map((row, idx) => (
                  <tr key={idx} className="border-b border-border-subtle hover:bg-cream/30 transition-colors">
                    <td className="py-4.5 px-4 text-text-secondary font-medium text-[14px]">
                      {row.feature}
                    </td>
                    <td className="py-4.5 px-5 font-semibold bg-cream/60 border-x border-border-subtle text-center text-terracotta text-[14px]">
                      {row.vren}
                    </td>
                    <td className="py-4.5 px-4 text-center text-[14px]">{row.stripe}</td>
                    <td className="py-4.5 px-4 text-center text-[14px]">{row.unlock}</td>
                    <td className="py-4.5 px-4 text-center text-[14px]">{row.diy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ══════════════ FAQS ══════════════ */}
      <section className="w-full max-w-[800px] mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="grow-line w-full h-px bg-border-subtle mb-16" />
        <div className="mb-12 text-center">
          <h2 className="font-display text-[36px] lg:text-[48px] leading-[1.08] tracking-tight text-charcoal">
            Frequently asked questions
          </h2>
        </div>
        <div className="border-t border-border-subtle">
          {FAQS.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </section>

      {/* ══════════════ CTA BAND ══════════════ */}
      <section className="w-full bg-charcoal">
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-24 lg:py-32">
          <div className="flex flex-col items-center text-center">
            <h2 className="font-display text-[36px] lg:text-[56px] leading-[1.05] tracking-tight text-parchment max-w-3xl mb-4">
              Start accepting payments.
              <br />
              <span className="text-warm-gold">Without asking permission.</span>
            </h2>
            <p className="font-body text-[17px] text-stone max-w-xl mb-10 leading-[1.6]">
              Deploy your first subscription contract in under three minutes.
              No KYC. No intermediaries. Just code and commerce.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/dev-docs"
                className="bg-parchment text-charcoal font-ui text-[15px] font-medium px-10 py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-px flex items-center gap-2 group"
              >
                Read the Docs
                <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="/dashboard"
                className="font-ui text-[15px] font-medium px-8 py-4 border border-[#2e2e2c] rounded-xl text-stone hover:text-parchment hover:border-parchment/30 transition-all duration-300"
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
