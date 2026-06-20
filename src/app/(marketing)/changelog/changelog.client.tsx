"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

/* ─── Types ──────────────────────────────────────────────────────────── */

type ChangeType = "feature" | "fix" | "improvement" | "security" | "breaking";
type Impact = "major" | "minor" | "patch";

interface Change {
  title: string;
  description: string;
  type: ChangeType;
}

interface Release {
  version: string;
  date: string;
  impact: Impact;
  title: string;
  summary: string;
  changes: Change[];
}

/* ─── Badge Styles ───────────────────────────────────────────────────── */

const TYPE_STYLES: Record<ChangeType, { bg: string; text: string; label: string }> = {
  feature:     { bg: "bg-[#e8f5e8]", text: "text-[#2d7a2d]", label: "Feature" },
  fix:         { bg: "bg-[#fde8e8]", text: "text-[#c0392b]", label: "Fix" },
  improvement: { bg: "bg-[#e8f0fd]", text: "text-[#2c5fa1]", label: "Improvement" },
  security:    { bg: "bg-[#fdf3e8]", text: "text-[#b8860b]", label: "Security" },
  breaking:    { bg: "bg-[#f3e8fd]", text: "text-[#7b2d8b]", label: "Breaking" },
};

const IMPACT_STYLES: Record<Impact, { bg: string; text: string; label: string }> = {
  major: { bg: "bg-terracotta",    text: "text-white",      label: "Major" },
  minor: { bg: "bg-warm-gold/20",  text: "text-warm-gold",  label: "Minor" },
  patch: { bg: "bg-sand",          text: "text-dim",        label: "Patch" },
};

/* ─── Release Data ───────────────────────────────────────────────────── */

const RELEASES: Release[] = [
  {
    version: "0.5.0",
    date: "June 21, 2026",
    impact: "major",
    title: "Pricing Redesign & Production Deployment Fix",
    summary:
      "Completely redesigned the pricing page inspired by Anthropic/Claude's layout. Fixed a critical Vercel deployment failure caused by Edge Function size limits, and merged all pending changes to master for production.",
    changes: [
      {
        title: "Pricing Page Redesign",
        description:
          "Built an entirely new pricing page with Individual/Team tab toggle, SVG tier icons, expandable accordion FAQs, comparison table, and progressive feature labeling. Inspired by Anthropic/Claude's pricing aesthetic.",
        type: "feature",
      },
      {
        title: "Edge Function Size Limit Fix",
        description:
          "Resolved Vercel production build failure (\"Edge Function _middleware size is 1.02 MB\"). Removed next-auth from the Edge runtime entirely; middleware now uses raw cookie checks. Bundle reduced from 1.02 MB to 143 KB.",
        type: "fix",
      },
      {
        title: "Production Merge to Master",
        description:
          "Merged all pending dev/construction-pages commits into master. Previous PRs had left the middleware fix stranded on the feature branch, causing repeated Vercel deploy failures.",
        type: "fix",
      },
      {
        title: "Auth Config Split Architecture",
        description:
          "Created auth.config.ts for edge-compatible NextAuth configuration, separating lightweight providers from heavy Prisma database operations to prevent Edge runtime bloat.",
        type: "improvement",
      },
    ],
  },
  {
    version: "0.4.0",
    date: "June 19, 2026",
    impact: "major",
    title: "Google Authentication with NextAuth v5",
    summary:
      "Replaced the SIWE (Sign-In with Ethereum) login flow with Google OAuth via NextAuth v5. Updated Prisma schema to support email-based authentication while keeping wallet as optional.",
    changes: [
      {
        title: "Google OAuth Integration",
        description:
          "Implemented NextAuth v5 with Google Provider. Session management uses JWT strategy with automatic developer upsert on sign-in. Replaced iron-session with NextAuth's built-in session handling.",
        type: "feature",
      },
      {
        title: "Prisma Schema Update",
        description:
          "Modified the Developer model to make wallet optional and enforce email uniqueness, enabling a smooth transition from Web3-only auth to email-based Google OAuth.",
        type: "breaking",
      },
      {
        title: "Protected Route Middleware",
        description:
          "Added edge middleware to protect dashboard, API, and admin routes. Unauthenticated users are redirected to /login with a redirect parameter preserved.",
        type: "security",
      },
    ],
  },
  {
    version: "0.3.0",
    date: "June 16, 2026",
    impact: "major",
    title: "Login UI & Homepage Hero Redesign",
    summary:
      "Delivered a professional login page with Google OAuth button and redesigned the homepage hero section with cinematic GSAP animations and the VREN Preloader component.",
    changes: [
      {
        title: "Login Page",
        description:
          "Built a clean, centered login UI with Google sign-in button, brand identity, and redirect-aware authentication flow. Consistent with the parchment/charcoal design system.",
        type: "feature",
      },
      {
        title: "Homepage Hero with GSAP",
        description:
          "Redesigned the hero section with staggered text reveals, scroll-triggered feature cards, and a floating terminal UI showcasing SDK integration code.",
        type: "improvement",
      },
      {
        title: "Preloader Component",
        description:
          "Added a branded preloader with the VREN logo, progress bar animation, and smooth exit transition. Runs once per session using sessionStorage detection.",
        type: "feature",
      },
    ],
  },
  {
    version: "0.2.0",
    date: "June 15, 2026",
    impact: "major",
    title: "Dashboard Architecture & Subscription Management",
    summary:
      "Established the full authenticated dashboard shell with sidebar navigation, and built out all core management pages for plans, subscribers, transactions, analytics, API keys, and settings.",
    changes: [
      {
        title: "Dashboard Layout & Navigation",
        description:
          "Implemented a persistent sidebar layout with icon-based navigation, active route highlighting, and responsive collapse behavior for mobile viewports.",
        type: "feature",
      },
      {
        title: "Management Modules",
        description:
          "Created placeholder UI for Plans, Subscribers, Transactions, Analytics, API Keys, and Settings pages. Each module features consistent card-based layouts ready for data integration.",
        type: "feature",
      },
      {
        title: "Session-Aware Routing",
        description:
          "Dashboard pages now validate authentication state server-side. Unauthenticated access returns a redirect to /login with the original path preserved.",
        type: "security",
      },
    ],
  },
  {
    version: "0.1.0",
    date: "June 14, 2026",
    impact: "major",
    title: "Foundation Release",
    summary:
      "Initial project setup including the design system, all marketing pages, Prisma database schema, Polygon webhook infrastructure, and the development countdown page.",
    changes: [
      {
        title: "Design System & Typography",
        description:
          "Established the Parchment/Charcoal light theme with custom Anthropic fonts (Sans, Serif, Mono), Tailwind v4 theme tokens, and reusable shadow/radius scales.",
        type: "feature",
      },
      {
        title: "Marketing Pages",
        description:
          "Built About, How It Works, Pricing, Blog (with MDX-style posts), Developer Docs, and Changelog pages. All pages feature GSAP scroll-triggered animations.",
        type: "feature",
      },
      {
        title: "Prisma Schema & Database",
        description:
          "Defined core models: Developer, App, Plan, Subscriber, and WebhookEvent. Configured Supabase PostgreSQL with connection pooling via PgBouncer.",
        type: "feature",
      },
      {
        title: "Polygon Webhook Route",
        description:
          "Implemented /api/webhooks/polygon with HMAC-SHA256 signature verification, idempotent event processing, and automatic subscriber state management.",
        type: "security",
      },
      {
        title: "Development Countdown",
        description:
          "Created a branded countdown landing page at /development showing time until public launch, with animated progress indicators.",
        type: "feature",
      },
    ],
  },
  {
    version: "0.0.1",
    date: "June 13, 2026",
    impact: "patch",
    title: "Project Initialization",
    summary:
      "Scaffolded the Next.js 16 application with Turbopack, configured TypeScript, Tailwind CSS v4, and established the initial project structure.",
    changes: [
      {
        title: "Next.js 16 Scaffold",
        description:
          "Initialized the project with create-next-app, configured Turbopack for fast local development, and set up the app router directory structure.",
        type: "feature",
      },
      {
        title: "Root Layout & Fonts",
        description:
          "Configured the root layout with custom local fonts (AnthropicSans, AnthropicSerif, AnthropicMono), global CSS variables, and SEO metadata.",
        type: "feature",
      },
    ],
  },
];

/* ─── Stats ──────────────────────────────────────────────────────────── */

const STATS = {
  totalReleases: RELEASES.length,
  majorFeatures: RELEASES.reduce((acc, r) => acc + r.changes.filter((c) => c.type === "feature").length, 0),
  fixes: RELEASES.reduce((acc, r) => acc + r.changes.filter((c) => c.type === "fix").length, 0),
  daysInDev: Math.ceil((new Date().getTime() - new Date("2026-06-13").getTime()) / (1000 * 60 * 60 * 24)),
};

/* ─── Filter Types ───────────────────────────────────────────────────── */

const FILTER_OPTIONS: { value: ChangeType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "feature", label: "Feature" },
  { value: "fix", label: "Fix" },
  { value: "improvement", label: "Improvement" },
  { value: "security", label: "Security" },
];

const IMPACT_FILTER_OPTIONS: { value: Impact | "all"; label: string }[] = [
  { value: "all", label: "All Impact" },
  { value: "major", label: "Major only" },
  { value: "minor", label: "Minor" },
];

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function ChangelogClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [typeFilter, setTypeFilter] = useState<ChangeType | "all">("all");
  const [impactFilter, setImpactFilter] = useState<Impact | "all">("all");
  const [search, setSearch] = useState("");

  // Filter releases
  const filteredReleases = RELEASES.filter((release) => {
    // Impact filter
    if (impactFilter !== "all" && release.impact !== impactFilter) return false;
    // Search filter
    if (search) {
      const q = search.toLowerCase();
      const matchesTitle = release.title.toLowerCase().includes(q);
      const matchesVersion = release.version.toLowerCase().includes(q);
      const matchesChanges = release.changes.some(
        (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      );
      if (!matchesTitle && !matchesVersion && !matchesChanges) return false;
    }
    // Type filter
    if (typeFilter !== "all") {
      const hasType = release.changes.some((c) => c.type === typeFilter);
      if (!hasType) return false;
    }
    return true;
  });

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.fromTo(".cl-eyebrow", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "expo.out" }, 0.1)
        .fromTo(".cl-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out" }, 0.25)
        .fromTo(".cl-subtitle", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "expo.out" }, 0.4)
        .fromTo(".cl-stats", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "expo.out" }, 0.5)
        .fromTo(".cl-controls", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "expo.out" }, 0.6);

      ScrollTrigger.batch(".release-card", {
        onEnter: (batch) =>
          gsap.fromTo(batch, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "expo.out" }),
        start: "top 90%",
        once: true,
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="bg-parchment text-charcoal font-body min-h-screen pt-32 lg:pt-40 pb-28">
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* ══════════════ HEADER ══════════════ */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="cl-eyebrow inline-flex items-center gap-1.5 font-mono text-[12px] text-sage bg-[#e8f0e8] px-2.5 py-1 rounded-full opacity-0">
                <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
                LIVE
              </span>
              <span className="cl-eyebrow font-ui text-[12px] text-text-muted opacity-0">
                Last updated {RELEASES[0].date}
              </span>
            </div>
            <h1 className="cl-title font-display font-medium text-[48px] lg:text-[64px] leading-[1.05] tracking-tight text-charcoal mb-4 opacity-0">
              Changelog
            </h1>
            <p className="cl-subtitle font-body text-[18px] lg:text-[20px] text-text-secondary leading-[1.6] max-w-lg opacity-0">
              Track every release, fix, and security hardening across VREN.
              Use filters to jump to what matters.
            </p>
          </div>

          {/* Release Health Card */}
          <div className="cl-stats w-full lg:w-auto lg:min-w-[320px] bg-white border border-border-subtle rounded-2xl shadow-sm overflow-hidden opacity-0">
            <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
              <span className="font-ui text-[14px] font-semibold text-charcoal">Release Health</span>
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full font-bold">
                Snapshot
              </span>
            </div>
            <div className="grid grid-cols-2 divide-x divide-y divide-border-subtle">
              <div className="px-5 py-4">
                <p className="font-ui text-[11px] text-text-muted uppercase tracking-wider mb-1">Total releases</p>
                <p className="font-display text-[28px] text-charcoal leading-none">{STATS.totalReleases}</p>
              </div>
              <div className="px-5 py-4">
                <p className="font-ui text-[11px] text-text-muted uppercase tracking-wider mb-1">Major features</p>
                <p className="font-display text-[28px] text-charcoal leading-none">{STATS.majorFeatures}</p>
              </div>
              <div className="px-5 py-4">
                <p className="font-ui text-[11px] text-text-muted uppercase tracking-wider mb-1">Fixes &amp; security</p>
                <p className="font-display text-[28px] text-charcoal leading-none">{STATS.fixes}</p>
              </div>
              <div className="px-5 py-4">
                <p className="font-ui text-[11px] text-text-muted uppercase tracking-wider mb-1">Days in dev</p>
                <p className="font-display text-[28px] text-charcoal leading-none">{STATS.daysInDev}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════ CONTROLS ══════════════ */}
        <div className="cl-controls bg-white border border-border-subtle rounded-2xl shadow-sm p-5 mb-10 opacity-0">
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search releases, versions, or changes"
                className="w-full pl-10 pr-4 py-2.5 bg-parchment border border-border-subtle rounded-xl font-body text-[14px] text-charcoal placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-all"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-ui text-[11px] tracking-[0.08em] uppercase text-text-muted font-semibold mr-1 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M3 4h18M7 9h10M10 14h4" />
              </svg>
              Quick Filters
            </span>
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTypeFilter(opt.value)}
                className={`px-3 py-1.5 rounded-lg font-ui text-[12px] font-medium transition-all duration-200 cursor-pointer ${
                  typeFilter === opt.value
                    ? "bg-charcoal text-parchment shadow-sm"
                    : "bg-parchment text-text-secondary border border-border-subtle hover:border-charcoal/30"
                }`}
              >
                {opt.label}
              </button>
            ))}

            <div className="w-px h-5 bg-border-subtle mx-1 hidden sm:block" />

            {IMPACT_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setImpactFilter(opt.value)}
                className={`px-3 py-1.5 rounded-lg font-ui text-[12px] font-medium transition-all duration-200 cursor-pointer ${
                  impactFilter === opt.value
                    ? "bg-charcoal text-parchment shadow-sm"
                    : "bg-parchment text-text-secondary border border-border-subtle hover:border-charcoal/30"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ══════════════ RELEASE TIMELINE ══════════════ */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border-subtle hidden lg:block" />

          <div className="flex flex-col gap-6">
            {filteredReleases.length === 0 && (
              <div className="text-center py-16">
                <p className="font-ui text-[15px] text-text-muted">No releases match your filters.</p>
                <button
                  onClick={() => { setTypeFilter("all"); setImpactFilter("all"); setSearch(""); }}
                  className="mt-3 font-ui text-[14px] text-terracotta hover:underline cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {filteredReleases.map((release) => {
              const impactStyle = IMPACT_STYLES[release.impact];
              const totalChanges = release.changes.length;
              const filteredChanges =
                typeFilter === "all"
                  ? release.changes
                  : release.changes.filter((c) => c.type === typeFilter);

              return (
                <div key={release.version} className="release-card flex gap-6 opacity-0">

                  {/* Timeline Dot (desktop only) */}
                  <div className="hidden lg:flex flex-col items-center shrink-0 pt-7">
                    <div className="w-[9px] h-[9px] rounded-full bg-charcoal border-2 border-parchment ring-1 ring-border-subtle z-10" />
                  </div>

                  {/* Card */}
                  <div className="flex-1 bg-white border border-border-subtle rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">

                    {/* Card Header */}
                    <div className="p-6 lg:p-8 pb-0">
                      <div className="flex flex-wrap items-center gap-2.5 mb-4">
                        {/* Version */}
                        <span className="font-mono text-[12px] font-bold text-charcoal bg-cream px-2.5 py-1 rounded-lg border border-border-subtle">
                          {release.version}
                        </span>

                        {/* Impact Badge */}
                        <span className={`font-ui text-[10px] tracking-[0.08em] uppercase font-bold px-2.5 py-1 rounded-lg ${impactStyle.bg} ${impactStyle.text}`}>
                          {impactStyle.label}
                        </span>

                        {/* Date */}
                        <span className="font-ui text-[12px] text-text-muted flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <path d="M16 2v4M8 2v4M3 10h18" />
                          </svg>
                          {release.date}
                        </span>

                        {/* Spacer → right-aligned items */}
                        <div className="flex-1" />

                        {/* Change count */}
                        <span className="font-ui text-[11px] text-text-muted flex items-center gap-1 border border-border-subtle rounded-lg px-2.5 py-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" d="M12 3v18M3 12h18" strokeWidth={1.5} />
                          </svg>
                          {totalChanges} changes
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-[22px] lg:text-[26px] tracking-tight text-charcoal leading-snug mb-3">
                        {release.title}
                      </h3>

                      {/* Summary */}
                      <p className="font-body text-[15px] text-text-secondary leading-[1.65] max-w-3xl">
                        {release.summary}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="mx-6 lg:mx-8 my-5 h-px bg-border-subtle" />

                    {/* Changes List */}
                    <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredChanges.map((change, ci) => {
                          const typeStyle = TYPE_STYLES[change.type];
                          return (
                            <div
                              key={ci}
                              className="group bg-parchment/60 border border-border-subtle rounded-xl p-4 hover:bg-cream/60 transition-colors duration-200"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`font-ui text-[10px] tracking-[0.08em] uppercase font-bold px-2 py-0.5 rounded-md ${typeStyle.bg} ${typeStyle.text}`}>
                                  {typeStyle.label}
                                </span>
                              </div>
                              <h4 className="font-ui font-semibold text-[14px] text-charcoal mb-1.5 leading-snug">
                                {change.title}
                              </h4>
                              <p className="font-body text-[13px] text-text-secondary leading-[1.6]">
                                {change.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════════ FOOTER CTA ══════════════ */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/dev-docs"
              className="font-ui text-[14px] font-medium text-charcoal flex items-center gap-2 hover:text-terracotta transition-colors group"
            >
              View Protocol Architecture
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <span className="hidden sm:block text-text-muted">·</span>
            <Link
              href="/blog"
              className="font-ui text-[14px] font-medium text-charcoal flex items-center gap-2 hover:text-terracotta transition-colors group"
            >
              Read the Blog
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
