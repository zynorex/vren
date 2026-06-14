"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

const sections = [
  {
    id: "quickstart",
    eyebrow: "01 — Quickstart",
    title: "Install and integrate in minutes",
    description:
      "Add VREN to any React or Node.js project with a single package. The SDK handles all blockchain complexity so your team ships features, not infrastructure.",
    code: `npm install @vren/sdk`,
    language: "bash",
  },
  {
    id: "provider",
    eyebrow: "02 — Provider Setup",
    title: "Wrap your app with VrenProvider",
    description:
      "The VrenProvider initializes your configuration once at the root of your application, making your appId and contract address available to all child components via React context.",
    code: `import { VrenProvider } from "@vren/sdk/react";

export default function App({ children }) {
  return (
    <VrenProvider
      config={{
        appId: "0xYOUR_APP_ID",
        network: "polygon",
      }}
    >
      {children}
    </VrenProvider>
  );
}`,
    language: "tsx",
  },
  {
    id: "gating",
    eyebrow: "03 — Access Gating",
    title: "Gate any feature with useGate()",
    description:
      "The useGate hook checks the connected wallet's subscription status against the VREN smart contract in real time. It caches the result for 30 seconds to prevent redundant RPC calls.",
    code: `import { useGate } from "@vren/sdk/react";

export function PremiumFeature() {
  const { data, isLoading } = useGate("premium");

  if (isLoading) return <Spinner />;
  if (!data?.access) return <UpgradePrompt />;

  return <YourPremiumContent />;
}`,
    language: "tsx",
  },
  {
    id: "subscribe",
    eyebrow: "04 — Subscribe",
    title: "Accept payments with useSubscribe()",
    description:
      "Trigger a USDC subscription directly from your UI. The hook manages wallet confirmation and transaction state, exposing isPending, isConfirming, and isConfirmed flags.",
    code: `import { useSubscribe } from "@vren/sdk/react";

export function SubscribeButton({ planId }) {
  const { subscribe, isPending, isConfirmed } = useSubscribe();

  return (
    <button
      onClick={() => subscribe(planId)}
      disabled={isPending}
    >
      {isPending ? "Confirming…" : "Subscribe"}
    </button>
  );
}`,
    language: "tsx",
  },
  {
    id: "contracts",
    eyebrow: "05 — Smart Contracts",
    title: "Deployed, audited Solidity core",
    description:
      "VREN consists of two EVM contracts: VrenRegistry (app identity and payout routing) and VrenSubscription (ERC-1155 minting and USDC payment splitting). Both are open source.",
    items: [
      { label: "VrenRegistry.sol", note: "App registration and ownership" },
      { label: "VrenSubscription.sol", note: "ERC-1155 · SafeERC20 · Pausable · ReentrancyGuard" },
      { label: "Target network", note: "Polygon PoS Mainnet (chainId 137)" },
      { label: "Fee", note: "1.5% platform fee, max ceiling 10%, configurable" },
    ],
  },
];

const references = [
  { method: "GET", path: "/api/v1/subscription/:wallet", note: "Check access status" },
  { method: "POST", path: "/api/webhooks/polygon", note: "Relayer event sink (HMAC verified)" },
];

export default function DevDocsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".reveal",
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "expo.out", delay: 0.1 }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-parchment text-charcoal font-body min-h-screen pt-32 pb-32">
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-24 reveal">
          <div className="lg:col-span-5">
            <span className="font-ui text-[11px] tracking-widest uppercase text-terracotta font-bold mb-4 block">
              Developer Documentation
            </span>
            <h1 className="font-display font-medium text-[56px] lg:text-[72px] leading-[1.0] tracking-tight text-charcoal">
              Build with<br />VREN
            </h1>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-end">
            <p className="font-body text-[22px] lg:text-[26px] leading-[1.4] text-charcoal mb-8 text-balance">
              Everything you need to add permissionless, blockchain-native subscriptions to your product — from SDK to smart contracts to webhooks.
            </p>
            <div className="flex items-center gap-6">
              <a href="#quickstart"
                className="font-ui text-[14px] font-medium text-charcoal border-b border-charcoal/30 hover:border-terracotta hover:text-terracotta transition-colors pb-0.5">
                Get started →
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="font-ui text-[14px] text-text-secondary hover:text-charcoal transition-colors">
                GitHub ↗
              </a>
            </div>
          </div>
        </div>

        {/* ── Sections ────────────────────────────────────────────── */}
        <div className="border-t border-border-subtle">
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="reveal grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 py-20 border-b border-border-subtle"
            >
              {/* Left */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <span className="font-ui text-[11px] tracking-widest uppercase text-terracotta font-bold">
                  {section.eyebrow}
                </span>
                <h2 className="font-display text-[28px] lg:text-[34px] font-medium leading-[1.15] tracking-tight text-charcoal">
                  {section.title}
                </h2>
                <p className="font-body text-[17px] text-text-secondary leading-[1.65]">
                  {section.description}
                </p>
              </div>

              {/* Right */}
              <div className="lg:col-span-7">
                {section.code && (
                  <div className="bg-charcoal rounded-2xl overflow-hidden">
                    {/* Terminal bar */}
                    <div className="flex items-center gap-1.5 px-5 py-3 border-b border-white/5">
                      <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                      <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                      <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                      <span className="ml-3 font-mono text-[11px] text-white/30">
                        {section.language}
                      </span>
                    </div>
                    <pre className="p-6 lg:p-8 font-mono text-[13px] lg:text-[14px] leading-[1.7] text-[#F5F0E8] overflow-x-auto">
                      <code>{section.code}</code>
                    </pre>
                  </div>
                )}
                {section.items && (
                  <div className="flex flex-col divide-y divide-border-subtle">
                    {section.items.map((item) => (
                      <div key={item.label} className="flex items-start justify-between py-5 gap-6">
                        <span className="font-mono text-[14px] text-charcoal font-medium">{item.label}</span>
                        <span className="font-body text-[14px] text-text-secondary text-right">{item.note}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* ── API Reference ────────────────────────────────────────── */}
          <div className="reveal grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 py-20 border-b border-border-subtle">
            <div className="lg:col-span-5 flex flex-col gap-4">
              <span className="font-ui text-[11px] tracking-widest uppercase text-terracotta font-bold">
                06 — REST API
              </span>
              <h2 className="font-display text-[28px] lg:text-[34px] font-medium leading-[1.15] tracking-tight text-charcoal">
                HTTP Endpoints
              </h2>
              <p className="font-body text-[17px] text-text-secondary leading-[1.65]">
                For server-side access checks and receiving on-chain events in your backend, VREN exposes a minimal REST surface.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="flex flex-col divide-y divide-border-subtle">
                {references.map((ref) => (
                  <div key={ref.path} className="flex items-center justify-between py-5 gap-6">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        ref.method === "GET"
                          ? "bg-sage/10 text-sage"
                          : "bg-terracotta/10 text-terracotta"
                      }`}>
                        {ref.method}
                      </span>
                      <span className="font-mono text-[14px] text-charcoal">{ref.path}</span>
                    </div>
                    <span className="font-body text-[13px] text-text-secondary">{ref.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Back to development page ─────────────────────────────── */}
        <div className="reveal mt-20 flex items-center justify-between">
          <Link
            href="/development"
            className="font-ui text-[14px] font-medium text-charcoal inline-flex items-center gap-2 hover:text-terracotta transition-colors group"
          >
            <span className="transform transition-transform duration-300 group-hover:-translate-x-1">←</span>
            Back to countdown
          </Link>
          <span className="font-ui text-[13px] text-text-muted">VREN Protocol — Pre-release docs v0.2.0</span>
        </div>

      </div>
    </div>
  );
}
