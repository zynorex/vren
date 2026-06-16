"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const TIERS = [
  {
    name: "Free",
    price: "$0",
    interval: "forever",
    description: "For side projects and experimental applications.",
    features: [
      "Up to 100 active subscriptions",
      "Basic dashboard analytics",
      "Standard email support",
      "Community Discord access",
      "1.5% platform transaction fee",
    ],
    cta: "Start for free",
    href: "/dev-docs",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    interval: "per month",
    description: "For independent creators and growing businesses.",
    features: [
      "Unlimited active subscriptions",
      "Advanced MRR and churn analytics",
      "Priority email support",
      "Custom webhook endpoints",
      "Exportable subscriber data",
      "1.5% platform transaction fee",
    ],
    cta: "Upgrade to Pro",
    href: "/dashboard",
    highlight: true,
  },
  {
    name: "Business",
    price: "$79",
    interval: "per month",
    description: "For scaled enterprises requiring custom infrastructure.",
    features: [
      "Everything in Pro",
      "Dedicated Slack channel",
      "Custom smart contract deployment",
      "API rate limit increases",
      "Multi-signature treasury support",
      "Negotiable volume pricing",
    ],
    cta: "Contact Sales",
    href: "mailto:sales@vren.dev",
    highlight: false,
  },
];

const COMPARISON = [
  {
    feature: "Platform Fee",
    vren: "1.5%",
    stripe: "2.9% + 30¢",
    unlock: "Up to 10%",
    diy: "0% (+ Gas)",
  },
  {
    feature: "Geographic Reach",
    vren: "Global",
    stripe: "~46 Countries",
    unlock: "Global",
    diy: "Global",
  },
  {
    feature: "Integration Time",
    vren: "< 3 mins",
    stripe: "Days to Weeks",
    unlock: "Hours",
    diy: "Months",
  },
  {
    feature: "Censorship Resistance",
    vren: "High",
    stripe: "Zero",
    unlock: "High",
    diy: "High",
  },
  {
    feature: "Maintenance Burden",
    vren: "None",
    stripe: "High (API Updates)",
    unlock: "Low",
    diy: "Extreme (Audits)",
  },
  {
    feature: "Payout Settlement",
    vren: "Instant",
    stripe: "2 to 7 days",
    unlock: "Instant",
    diy: "Instant",
  },
];

const FAQS = [
  {
    q: "How does the 1.5% platform fee work?",
    a: "The fee is deducted automatically at the smart contract level at the moment of transaction. When a user pays for a subscription in USDC, the contract routes 98.5% directly to your designated payout wallet and 1.5% to the VREN treasury. There are no invoices or end-of-month true-ups.",
  },
  {
    q: "Do I have to pay gas fees for my users?",
    a: "By default, users pay their own gas (typically less than a cent on Polygon) when subscribing. However, the VREN SDK supports integration with account abstraction providers (like Biconomy or Alchemy) if you choose to sponsor gas for a completely gasless experience.",
  },
  {
    q: "Can I migrate away from VREN later?",
    a: "Yes. Your subscription data lives on the Polygon blockchain, not in a proprietary silo. You can always write your own interface to read your users' subscription states directly from the contract, making vendor lock-in cryptographically impossible.",
  },
  {
    q: "Are there any volume discounts?",
    a: "Yes. For applications processing over $50,000 in monthly recurring revenue (MRR), we offer custom platform fee arrangements under our Business tier. Contact our sales team for details.",
  },
];

export default function PricingClient() {
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

      // Pricing Cards
      ScrollTrigger.batch(".pricing-card", {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "expo.out" }
          ),
        start: "top 85%",
        once: true,
      });

      // Comparison Table
      gsap.fromTo(
        ".comparison-table",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".comparison-table",
            start: "top 85%",
            once: true,
          },
        }
      );

      // FAQs
      ScrollTrigger.batch(".faq-item", {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "expo.out" }
          ),
        start: "top 90%",
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
      <section className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 pt-36 lg:pt-52 pb-24 lg:pb-32">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <span className="hero-eyebrow font-ui text-[11px] tracking-[0.2em] uppercase text-terracotta font-bold mb-8 opacity-0">
            Pricing & Economics
          </span>
          <h1
            className="hero-title font-display font-medium tracking-tight text-charcoal leading-[1.05] mb-8 opacity-0"
            style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
          >
            Predictable infrastructure.
            <br />
            <span className="text-terracotta">Transparent margins.</span>
          </h1>
          <p className="hero-sub font-body text-[20px] lg:text-[24px] leading-[1.55] text-text-secondary max-w-2xl text-balance opacity-0">
            No hidden fees. No currency conversion spreads. No arbitrary account
            freezes holding your revenue hostage. Just a simple, immutable fee
            structure built on mathematics, not corporate policy.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: Pricing Tiers
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 pb-24 lg:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`pricing-card flex flex-col p-8 lg:p-10 rounded-2xl transition-all duration-300 opacity-0 ${
                tier.highlight
                  ? "bg-charcoal text-parchment shadow-2xl scale-100 lg:scale-[1.02] z-10 border border-warm-gold"
                  : "bg-white border border-border-subtle text-charcoal shadow-sm hover:shadow-md"
              }`}
            >
              {tier.highlight && (
                <div className="mb-6 inline-flex w-fit">
                  <span className="font-ui text-[10px] tracking-[0.15em] uppercase text-charcoal bg-warm-gold px-3 py-1 rounded-full font-bold">
                    Recommended
                  </span>
                </div>
              )}
              <h3 className="font-display text-[24px] tracking-tight mb-2">
                {tier.name}
              </h3>
              <p
                className={`font-body text-[15px] mb-8 ${
                  tier.highlight ? "text-[#a09e95]" : "text-text-secondary"
                }`}
              >
                {tier.description}
              </p>

              <div className="flex items-baseline gap-2 mb-10 border-b border-border-subtle pb-8">
                <span className="font-display text-[48px] leading-none tracking-tight">
                  {tier.price}
                </span>
                <span
                  className={`font-ui text-[14px] ${
                    tier.highlight ? "text-[#a09e95]" : "text-text-secondary"
                  }`}
                >
                  / {tier.interval}
                </span>
              </div>

              <ul className="flex flex-col gap-4 flex-1 mb-10">
                {tier.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        tier.highlight ? "text-warm-gold" : "text-terracotta"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span
                      className={`font-body text-[15px] leading-snug ${
                        tier.highlight ? "text-[#e0ded5]" : "text-charcoal"
                      }`}
                    >
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={`w-full text-center py-4 rounded-lg font-ui text-[15px] font-medium transition-all duration-300 ${
                  tier.highlight
                    ? "bg-warm-gold text-charcoal hover:bg-white hover:shadow-lg"
                    : "bg-charcoal text-parchment hover:bg-[#2b2a27] hover:shadow-md"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: Comparison Table
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-[1200px] mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="grow-line w-full h-px bg-border-subtle mb-16" />
        <div className="mb-16">
          <span className="font-ui text-[11px] tracking-[0.2em] uppercase text-terracotta font-bold mb-6 block">
            Competitive Analysis
          </span>
          <h2 className="font-display text-[40px] lg:text-[56px] leading-[1.08] tracking-tight text-charcoal max-w-3xl">
            How we stack up.
          </h2>
        </div>

        <div className="comparison-table overflow-x-auto opacity-0">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b-2 border-charcoal">
                <th className="py-6 px-4 font-ui text-[12px] uppercase tracking-[0.1em] text-text-muted w-1/4">
                  Feature
                </th>
                <th className="py-6 px-6 font-display text-[22px] text-charcoal bg-[#f5f3ec] border-x border-t border-border-subtle rounded-t-xl w-[22%] text-center">
                  VREN
                </th>
                <th className="py-6 px-4 font-ui text-[14px] font-semibold text-charcoal w-1/5 text-center">
                  Stripe
                </th>
                <th className="py-6 px-4 font-ui text-[14px] font-semibold text-charcoal w-1/5 text-center">
                  Unlock Protocol
                </th>
                <th className="py-6 px-4 font-ui text-[14px] font-semibold text-charcoal w-1/5 text-center">
                  DIY Smart Contract
                </th>
              </tr>
            </thead>
            <tbody className="font-body text-[15px] text-charcoal">
              {COMPARISON.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-border-subtle hover:bg-[#fafafa] transition-colors"
                >
                  <td className="py-5 px-4 text-text-secondary font-medium">
                    {row.feature}
                  </td>
                  <td className="py-5 px-6 font-semibold bg-[#f5f3ec] border-x border-border-subtle text-center text-terracotta">
                    {row.vren}
                  </td>
                  <td className="py-5 px-4 text-center">{row.stripe}</td>
                  <td className="py-5 px-4 text-center">{row.unlock}</td>
                  <td className="py-5 px-4 text-center">{row.diy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: FAQs
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-[1000px] mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="grow-line w-full h-px bg-border-subtle mb-16" />
        <div className="mb-16 text-center">
          <h2 className="font-display text-[40px] lg:text-[48px] leading-[1.08] tracking-tight text-charcoal">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {FAQS.map((faq, i) => (
            <div key={i} className="faq-item flex flex-col opacity-0">
              <h4 className="font-display text-[22px] tracking-tight text-charcoal mb-4">
                {faq.q}
              </h4>
              <p className="font-body text-[16px] text-text-secondary leading-[1.65]">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5: CTA Band
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-charcoal">
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-28 lg:py-36">
          <div className="flex flex-col items-center text-center">
            <h2 className="font-display text-[40px] lg:text-[64px] leading-[1.05] tracking-tight text-parchment max-w-3xl mb-8">
              Start accepting payments. Without asking permission.
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/dev-docs"
                className="bg-parchment text-charcoal font-ui text-[15px] font-medium px-10 py-4 rounded-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-px flex items-center gap-2 group"
              >
                Read the Docs
                <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="/dashboard"
                className="font-ui text-[15px] font-medium px-8 py-4 border border-[#2e2e2c] rounded-lg text-stone hover:text-parchment hover:border-parchment/30 transition-all duration-300"
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
