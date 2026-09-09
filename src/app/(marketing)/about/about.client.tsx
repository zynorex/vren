"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ShieldCheck,
  Globe,
  Coins,
  Cpu,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Lock,
  Unlock,
  Sparkles,
  Terminal,
  Layers,
  ExternalLink,
  ChevronDown,
  TrendingUp,
  Wallet,
  Code2,
  Flame,
  Scale,
  Compass,
  Building2,
  Bot,
  Laptop,
  Radio,
  BookOpen,
  Share2,
} from "lucide-react";
import { AboutToranaCanvas } from "./AboutToranaCanvas";

gsap.registerPlugin(ScrollTrigger);

// Four Purusharthas — Indian Classical Philosophy mapped to Cypherpunk Architecture
const PURUSHARTHAS = [
  {
    id: "dharma",
    name: "Dharma",
    devanagari: "धर्म",
    title: "Righteous Order & Open Source Truth",
    summary:
      "Legacy finance relies on subjective terms of service that can be rewritten at any moment. Artha replaces human discretion with immutable smart contracts. Code is the unbending arbiter.",
    quote:
      "Dharma is not an abstract dogma; it is the natural law of programmatic fairness.",
    details: [
      "Open-source Solidity smart contracts audited and verified on Polygonscan",
      "No backdoor withdrawal keys or subjective compliance freezes",
      "Algorithmic execution that treats every developer identically regardless of passport",
    ],
  },
  {
    id: "artha",
    name: "Artha",
    devanagari: "अर्थ",
    title: "Sovereign Wealth & Purposeful Creation",
    summary:
      "In Vedic thought, Artha is the legitimate acquisition of wealth and material resources required to support one's purpose. It is not greed; it is the vital foundation that allows builders to sustain their craft.",
    quote:
      "Allowing Revenue To flow Honestly, Autonomously — this is the true expansion of ARTHA.",
    details: [
      "Instant block settlement in USDC — money directly in your wallet in ~2 seconds",
      "1.5% hardcoded protocol fee ceiling, mathematically preventing extractive rent-seeking",
      "Full sovereign custody — you never have to ask permission to withdraw what you earned",
    ],
  },
  {
    id: "kama",
    name: "Kama",
    devanagari: "काम",
    title: "Creative Passion & Frictionless Delight",
    summary:
      "Great software is art. Builders should spend their waking hours perfecting algorithms, designing interfaces, and delighting users — not wrestling merchant KYC portals and banking bureaucracies.",
    quote:
      "A developer writing code should never have to feel like a beggar in front of a banking gatekeeper.",
    details: [
      "Install one NPM package (@vren/sdk) and gate features with 3 lines of React",
      "No paperwork, no incorporation prerequisites, no 3-week verification delays",
      "Delightful end-user checkout experience with 1-click wallet signatures",
    ],
  },
  {
    id: "moksha",
    name: "Moksha",
    devanagari: "मोक्ष",
    title: "Liberation from Centralized Rent-Seekers",
    summary:
      "Ultimate autonomy is independence from centralized points of control. When financial rails are public utilities rather than private monopolies, the global creative class is truly liberated.",
    quote:
      "True liberation for the builder is knowing that no executive in Silicon Valley can shut down your livelihood.",
    details: [
      "Decentralized state storage: subscriptions are tokenized as ERC-1155 on Polygon",
      "Zero vendor lock-in: verify subscription validity directly from public RPC nodes",
      "Permanent continuity: if Artha's website goes down tomorrow, your contracts run forever",
    ],
  },
];

// Protocol Flow Simulation Steps
const PROTOCOL_STEPS = [
  {
    num: "01",
    label: "End User Subscription",
    actor: "End User / Wallet",
    description:
      "The user clicks subscribe on your application. The @vren/sdk invokes an ERC-20 approve and initiates the transaction directly to VrenSubscription.sol on Polygon PoS.",
    code: `// Client-side checkout with @vren/sdk\nconst { subscribe } = useSubscribe();\n\nawait subscribe({\n  planId: "pro-annual",\n  currency: "USDC",\n  amount: "120.00"\n});`,
    networkDetail: "Polygon Mainnet (Chain ID 137) · Gas: < $0.003",
  },
  {
    num: "02",
    label: "Atomic Smart Contract Execution",
    actor: "VrenSubscription.sol",
    description:
      "In a single atomic transaction block, the contract verifies the payment, mints an ERC-1155 dynamic subscription NFT with encoded expiration timestamp, and triggers split settlement.",
    code: `// VrenSubscription.sol (Solidity v0.8.20)\nfunction subscribe(uint256 planId) external nonReentrant {\n    uint256 fee = (plan.price * PROTOCOL_FEE) / BASIS_POINTS;\n    usdc.transferFrom(msg.sender, creatorWallet, plan.price - fee);\n    usdc.transferFrom(msg.sender, treasury, fee);\n    _mint(msg.sender, tokenId, 1, "");\n}`,
    networkDetail: "Atomic Transaction · 0 Custodial Intermediate Pool",
  },
  {
    num: "03",
    label: "Instant Settlement (98.5%)",
    actor: "Creator Payout Wallet",
    description:
      "There is no 7-day holding period or minimum payout threshold. Exactly 98.5% of the USDC transfers immediately into the developer's non-custodial wallet inside the same block.",
    code: `// Instant block settlement receipt\n{\n  "status": "success",\n  "blockNumber": 58492014,\n  "creatorPayout": "118.20 USDC",\n  "protocolFee": "1.80 USDC (1.5%)",\n  "settlementLatency": "2.1 seconds"\n}`,
    networkDetail: "Direct Wallet-to-Wallet Routing · Instant Finality",
  },
  {
    num: "04",
    label: "Cryptographic Access Gating",
    actor: "Client & Backend Verifier",
    description:
      "The developer's application verifies the user's active token. Access is granted instantly based on pure cryptographic ownership on-chain, with zero reliance on centralized auth servers.",
    code: `// Gating verification in Next.js Server Component\nimport { Vren } from "@vren/sdk";\n\nconst vren = new Vren({ appId: process.env.VREN_APP_ID });\nconst { hasAccess, expiry } = await vren.gate("pro-tier", userWallet);\n\nif (!hasAccess) redirect("/pricing");`,
    networkDetail: "Trustless RPC Read · Zero Auth Server Bottleneck",
  },
];

// Persona / Builder Showcases
const BUILDER_PERSONAS = [
  {
    id: "ai-engineers",
    role: "Autonomous AI Engineers & Model Creators",
    icon: Bot,
    headline: "Monetize custom LLMs and inference APIs with wallet signatures as API keys.",
    challenge:
      "AI builders launching specialized agents and fine-tuned models face massive API abuse and chargeback fraud on legacy gateways. Traditional payment providers ban AI API keys without notice.",
    solution:
      "With Artha, developers attach on-chain subscription tiers directly to HTTP headers. Users sign a payload with their wallet. No credit card chargebacks, no merchant account rejections.",
    quote:
      "“We deployed an autonomous financial analysis agent. Within 48 hours, users from 28 countries were subscribing in USDC. Artha eliminated 3 weeks of merchant paperwork.”",
    author: "Kavya S., Founder of Synthetix Intelligence",
  },
  {
    id: "indie-saas",
    role: "Global Micro-SaaS Founders",
    icon: Laptop,
    headline: "Launch global SaaS without paying $500 for Delaware shell corporations.",
    challenge:
      "For a solo developer in Bengaluru, Lagos, or Buenos Aires, Stripe Atlas requires foreign incorporation, Delaware franchise taxes, US registered agents, and international wire friction.",
    solution:
      "Artha provides sovereign payment infrastructure from day one. You deploy a smart contract, paste your contract address into the dashboard, and accept payments from every internet citizen.",
    quote:
      "“Legacy payment rails forced us into thousands of dollars in accounting fees before our first customer. Artha let us ship and get paid on day zero.”",
    author: "Rohan D., Creator of DevPulse Monitoring",
  },
  {
    id: "open-source",
    role: "Open Source Maintainers",
    icon: Code2,
    headline: "Transform GitHub repositories into sustainable, dignified livelihoods.",
    challenge:
      "Donations and sponsor buttons rarely cover living expenses. Maintainers hesitate to monetize because building enterprise licensing and paywalls is a full-time engineering effort.",
    solution:
      "Use @vren/sdk to gate enterprise private npm releases, priority GitHub issue triage, and private community discussions with cryptographic subscription passes.",
    quote:
      "“I turned my open-source CLI into a sustainable business by offering token-gated priority support. It respects privacy while funding ongoing development.”",
    author: "Vikram N., Lead Maintainer of VectorLite",
  },
  {
    id: "web3-collectives",
    role: "Decentralized Collectives & Research DAOs",
    icon: Radio,
    headline: "Gate research vaults, discord channels, and developer tooling on-chain.",
    challenge:
      "Decentralized collectives cannot open traditional corporate bank accounts. Using fiat platforms forces an individual member to take on personal tax liability and single-point-of-failure risk.",
    solution:
      "Artha contracts route subscription revenue directly to Gnosis Safe multi-signature treasury wallets, ensuring collective ownership and full auditability.",
    quote:
      "“All subscription proceeds flow directly into our 3-of-5 community multi-sig. No single person touches the fiat; the treasury is transparent on-chain.”",
    author: "Anya K., Core Contributor at OpenCrypto Labs",
  },
];

// Protocol Roadmap
const ROADMAP_PHASES = [
  {
    phase: "Phase 01",
    tag: "LIVE & OPERATIONAL",
    title: "Foundational Protocol & Polygon PoS Mainnet",
    status: "completed",
    items: [
      "VrenRegistry.sol & VrenSubscription.sol deployment on Polygon (Chain ID 137)",
      "USDC payment routing with atomic 1.5% protocol fee ceiling",
      "Dynamic ERC-1155 subscription tokens with embedded metadata and expiration",
      "@vren/sdk client and server packages published on NPM",
      "Real-time developer dashboard with MRR, subscriber retention, and webhook feeds",
    ],
  },
  {
    phase: "Phase 02",
    tag: "IN ACTIVE ROLLOUT",
    title: "Multi-Chain Expansion & Account Abstraction",
    status: "in-progress",
    items: [
      "Deployment across leading Layer 2 networks: Base, Arbitrum One, and Optimism",
      "Chainlink CCIP cross-chain settlement for single-click payments from any chain",
      "EIP-7702 & ERC-4337 smart account support for gas-sponsored frictionless checkout",
      "Automated recurrent allowance streaming for seamless monthly renewals",
    ],
  },
  {
    phase: "Phase 03",
    tag: "Q3 2026",
    title: "Zero-Knowledge Access & Private Gating",
    status: "upcoming",
    items: [
      "ZK-Snark proof generation for private access verification without revealing wallet address",
      "Decentralized metadata storage anchored on IPFS and Arweave permanent web",
      "Decentralized relayer network allowing community-incentivized webhook processing",
      "Native integrations for Next.js 16, Remix, Astro, Fastify, and Go SDKs",
    ],
  },
  {
    phase: "Phase 04",
    tag: "VISION",
    title: "Autonomous Protocol Governance & Global Mesh",
    status: "upcoming",
    items: [
      "Transition of protocol administrative parameters to community token governance",
      "Decentralized arbitration framework for programmatic refund resolution",
      "Autonomous AI agent commerce standard: machine-to-machine subscription contracts",
      "Hardware wallet physical access passes linking on-chain subscriptions to real-world venues",
    ],
  },
];

// FAQ Items
const FAQ_ITEMS = [
  {
    q: "Why was Artha created when platforms like Stripe and PayPal already exist?",
    a: "Stripe and PayPal were built for a 20th-century banking hierarchy. Over 70% of the world's population lives in countries where Stripe either does not operate or imposes punitive restrictions (such as 180-day rolling reserves, arbitrary KYC account closures, and 12-15% cumulative cross-border fees). Artha was built from the ground up on public blockchain rails to ensure that any developer anywhere on earth can monetize their software with zero permission and instant settlement.",
  },
  {
    q: "Does Artha ever hold or custody my funds?",
    a: "Never. Artha is strictly non-custodial. The smart contract does not hold a pooled balance. When an end user subscribes, the smart contract routes 98.5% of the USDC directly to your designated payout wallet in the exact same transaction block. Artha's team cannot freeze your funds, seize your balance, or reverse legitimate transactions.",
  },
  {
    q: "How does recurring billing work on blockchain without giving up private keys?",
    a: "Traditional recurring billing requires storing plaintext credit cards and billing users without explicit per-transaction action. On-chain, Artha uses two approaches: (1) Time-locked ERC-1155 passes where users choose their billing duration (monthly, quarterly, annual) and receive notifications when their pass nears expiration, and (2) Pre-approved ERC-20 allowance streams where users grant permission for automatic monthly deductions capped at the exact plan price.",
  },
  {
    q: "What happens to my payment infrastructure if Artha's website goes offline?",
    a: "Your payments and access gating keep functioning without interruption. Because VrenSubscription.sol is permanently deployed to the Polygon blockchain, anyone can call the contract directly. The @vren/sdk can read subscription state directly from any public Polygon RPC node without passing through our servers.",
  },
  {
    q: "What are the exact fees involved?",
    a: "Artha charges a flat 1.5% fee on subscription transactions. This fee is hardcoded into the smart contract with a maximum immutable ceiling of 10% that can never be exceeded by anyone. There are no monthly maintenance fees, no account setup fees, and no foreign exchange fees. Network gas fees on Polygon PoS typically average less than $0.005 per transaction.",
  },
  {
    q: "Is it legal to use Artha for software subscriptions?",
    a: "Yes. Accepting cryptocurrency or stablecoins (USDC) for software services, digital goods, and API access is legal across the vast majority of global jurisdictions. Developers simply record the USDC received as business revenue according to their local tax guidelines. Because USDC is a regulated 1:1 US Dollar backed stablecoin, accounting and conversion are straightforward.",
  },
];

export default function AboutClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [activePurushartha, setActivePurushartha] = useState(1); // Default to Artha
  const [mrr, setMrr] = useState(10000); // Default to $10,000 MRR for calculator
  const [activeStep, setActiveStep] = useState(0);
  const [activePersona, setActivePersona] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // GSAP Animations
  useGSAP(
    () => {
      // Hero timeline
      const heroTl = gsap.timeline();
      heroTl
        .fromTo(
          ".reveal-badge",
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
        )
        .fromTo(
          ".reveal-hero-title",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".reveal-hero-sub",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          ".reveal-hero-stats",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" },
          "-=0.3"
        );

      // Section scroll reveals
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
        gsap.fromTo(
          section,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              once: true,
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  // Calculator calculations
  const legacyRate = 0.029; // 2.9%
  const legacyFixedPerTx = 0.3; // 30 cents
  const crossBorderFee = 0.02; // 2%
  const fxConversion = 0.025; // 2.5%
  const avgSubscriptionPrice = 30; // Assume $30/month average plan
  const totalSubscribers = Math.round(mrr / avgSubscriptionPrice);

  const legacyTotalFees =
    mrr * (legacyRate + crossBorderFee + fxConversion) +
    totalSubscribers * legacyFixedPerTx;
  const arthaTotalFees = mrr * 0.015; // 1.5% flat
  const monthlySavings = Math.max(0, legacyTotalFees - arthaTotalFees);
  const annualSavings = monthlySavings * 12;
  const legacyEffectivePercent = ((legacyTotalFees / mrr) * 100).toFixed(1);

  return (
    <div
      ref={containerRef}
      className="bg-parchment text-charcoal font-body min-h-screen pt-28 pb-32 selection:bg-terracotta selection:text-white"
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* ========================================================================= */}
        {/* SECTION 1: HERO MANIFESTO & TORANA VISUAL                                */}
        {/* ========================================================================= */}
        <section className="pt-8 pb-20 border-b border-border-subtle">
          {/* Eyebrow / Provenance badge */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 reveal-badge">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cream border border-border-subtle text-charcoal font-mono text-[12px] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
              <span>Built in Bharat · Deployed Worldwide · Protocol v1.0</span>
            </div>

            <div className="flex items-center gap-3 font-mono text-[13px] text-text-secondary">
              <span className="font-display font-semibold text-charcoal">अर्थ</span>
              <span className="text-border-subtle">/</span>
              <span>Allowing Revenue To flow Honestly, Autonomously</span>
            </div>
          </div>

          {/* Hero Grid: Left Typography, Right Torana Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7">
              <h1 className="reveal-hero-title font-display font-medium text-[48px] sm:text-[64px] lg:text-[76px] leading-[1.05] tracking-tight text-charcoal mb-6 text-balance">
                Your revenue. <br />
                <span className="italic font-serif text-terracotta">Your terms.</span> <br />
                Zero permission.
              </h1>

              <p className="reveal-hero-sub font-body text-[20px] sm:text-[24px] leading-[1.4] text-text-secondary mb-8 max-w-[620px] text-balance">
                Artha (VREN) is the sovereign payment infrastructure layer for
                builders the traditional financial system decided to exclude. Instant
                block settlement, hardcoded 1.5% fees, and dynamic ERC-1155 access
                passports.
              </p>

              {/* Core Principles Pills */}
              <div className="reveal-hero-stats flex flex-wrap gap-2.5 mb-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-cream text-charcoal font-ui text-[13px] font-medium border border-border-subtle">
                  <ShieldCheck className="w-4 h-4 text-terracotta" /> Sovereign Autonomy
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-cream text-charcoal font-ui text-[13px] font-medium border border-border-subtle">
                  <Globe className="w-4 h-4 text-sage" /> Borderless by Code
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-cream text-charcoal font-ui text-[13px] font-medium border border-border-subtle">
                  <Coins className="w-4 h-4 text-warm-gold" /> 1.5% Hardcoded Fee Ceiling
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-cream text-charcoal font-ui text-[13px] font-medium border border-border-subtle">
                  <Zap className="w-4 h-4 text-sky" /> ~2s Block Settlement
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-charcoal text-parchment rounded-md font-ui text-[15px] font-medium hover:bg-terracotta transition-colors shadow-sm"
                >
                  Deploy Smart Contract
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dev-docs"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-border-subtle text-charcoal rounded-md font-ui text-[15px] font-medium hover:border-charcoal transition-colors shadow-xs"
                >
                  <Terminal className="w-4 h-4 text-text-secondary" />
                  Read Developer Guide
                </Link>
              </div>
            </div>

            {/* Right Column: 3D Torana Gateway Visual */}
            <div className="lg:col-span-5 relative">
              <div className="w-full aspect-[4/3] sm:aspect-square bg-white border border-border-subtle rounded-2xl shadow-md overflow-hidden relative group">
                <AboutToranaCanvas />

                {/* Caption overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md border border-border-subtle/80 rounded-lg p-3.5 flex items-center justify-between shadow-xs pointer-events-auto">
                  <div className="flex flex-col">
                    <span className="font-ui text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                      The Torana Symbol
                    </span>
                    <span className="font-display text-[13px] text-charcoal font-medium">
                      Ancient sacred threshold meets on-chain value flow
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-terracotta bg-terracotta/10 px-2 py-0.5 rounded">
                    POLYGON PoS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-10 border-t border-border-subtle/60">
            <div>
              <div className="font-mono text-[32px] lg:text-[40px] font-medium text-charcoal">
                1.5%
              </div>
              <div className="font-ui text-[13px] text-text-secondary font-medium mt-1">
                Protocol fee ceiling
              </div>
              <div className="font-body text-[12px] text-stone">Hardcoded in Solidity</div>
            </div>
            <div>
              <div className="font-mono text-[32px] lg:text-[40px] font-medium text-charcoal">
                &lt; 3 sec
              </div>
              <div className="font-ui text-[13px] text-text-secondary font-medium mt-1">
                Settlement latency
              </div>
              <div className="font-body text-[12px] text-stone">Direct to creator wallet</div>
            </div>
            <div>
              <div className="font-mono text-[32px] lg:text-[40px] font-medium text-charcoal">
                ERC-1155
              </div>
              <div className="font-ui text-[13px] text-text-secondary font-medium mt-1">
                Dynamic token standard
              </div>
              <div className="font-body text-[12px] text-stone">Portable access passport</div>
            </div>
            <div>
              <div className="font-mono text-[32px] lg:text-[40px] font-medium text-charcoal">
                100%
              </div>
              <div className="font-ui text-[13px] text-text-secondary font-medium mt-1">
                Non-custodial
              </div>
              <div className="font-body text-[12px] text-stone">Zero intermediary risk</div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: THE GENESIS STORY & THE SILENT WALL                           */}
        {/* ========================================================================= */}
        <section className="py-24 border-b border-border-subtle reveal-section">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <span className="font-mono text-[12px] uppercase tracking-widest text-terracotta font-semibold block mb-3">
                01 / The Origin
              </span>
              <h2 className="font-display font-medium text-[36px] sm:text-[46px] leading-[1.1] tracking-tight text-charcoal mb-6">
                The silent wall of legacy finance.
              </h2>
              <p className="font-body text-[17px] text-text-secondary leading-relaxed">
                Why was Artha built? Because the internet democratized code, but
                the banking system weaponized borders.
              </p>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="bg-white border border-border-subtle rounded-xl p-8 lg:p-10 shadow-xs">
                <p className="font-body text-[19px] sm:text-[21px] text-charcoal leading-relaxed mb-6">
                  Every year, hundreds of thousands of exceptional developers in
                  India, Nigeria, Brazil, Pakistan, the Philippines, and across
                  the global South build world-class AI models, SaaS tools, and
                  open-source libraries.
                </p>
                <p className="font-body text-[17px] text-text-secondary leading-relaxed mb-6">
                  Then comes the moment of monetization — and they collide with a
                  wall. Stripe Atlas demands Delaware entities, US EINs, and
                  overseas bank accounts. PayPal slaps 180-day rolling reserves on
                  new accounts. Traditional payment gateways extract 8% to 15% in
                  cross-border conversion tolls and chargeback fees. If an
                  unaccountable algorithm flags their zip code, their balance is
                  frozen indefinitely.
                </p>
                <div className="p-4 bg-cream/70 border-l-2 border-terracotta rounded-r-md">
                  <p className="font-display text-[16px] text-charcoal font-medium italic">
                    “A builder who writes code in Patna, Lagos, or Medellín has
                    earned the exact same right to capture the value of their labor
                    as a founder in San Francisco. Artha is the door that was always
                    supposed to be open.”
                  </p>
                  <span className="font-mono text-[12px] text-stone mt-2 block">
                    — Ayush Kumar, Founder of Artha (VREN)
                  </span>
                </div>
              </div>

              {/* Side-by-Side Comparison: Legacy Fiat vs The Artha Standard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Legacy Fiat Trap */}
                <div className="bg-white/60 border border-border-subtle rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4 text-[#b91c1c]">
                    <XCircle className="w-5 h-5" />
                    <h3 className="font-display font-medium text-[18px] text-charcoal">
                      The Legacy Fiat Trap
                    </h3>
                  </div>
                  <ul className="space-y-3.5 font-body text-[15px] text-text-secondary">
                    <li className="flex items-start gap-2.5">
                      <span className="text-stone mt-0.5">•</span>
                      <span>
                        <strong>7 to 14 day payout holds</strong>, holding cash flow hostage.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-stone mt-0.5">•</span>
                      <span>
                        <strong>Arbitrary account bans</strong> without human appeal or explanation.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-stone mt-0.5">•</span>
                      <span>
                        <strong>2.9% + 30¢ + 2% cross-border + 3% FX</strong> eating 8-12% of revenue.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-stone mt-0.5">•</span>
                      <span>
                        <strong>42 supported countries</strong>, leaving 70% of the globe locked out.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* The Artha Standard */}
                <div className="bg-white border-2 border-terracotta/40 rounded-xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-terracotta text-white font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-bl-lg font-semibold">
                    The Artha Standard
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-sage">
                    <CheckCircle2 className="w-5 h-5" />
                    <h3 className="font-display font-medium text-[18px] text-charcoal">
                      Sovereign Cryptographic Rails
                    </h3>
                  </div>
                  <ul className="space-y-3.5 font-body text-[15px] text-charcoal">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                      <span>
                        <strong>Instant block settlement (~2s)</strong> directly to your personal wallet.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                      <span>
                        <strong>Immutable smart contracts</strong> — no human or corporation can freeze you.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                      <span>
                        <strong>Flat 1.5% fee ceiling</strong>, hardcoded into bytecode forever.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                      <span>
                        <strong>Universal access</strong>: anyone with an internet connection & a wallet.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: THE PHILOSOPHY OF ARTHA (PURUSHARTHAS)                         */}
        {/* ========================================================================= */}
        <section className="py-24 border-b border-border-subtle reveal-section">
          <div className="max-w-3xl mb-16">
            <span className="font-mono text-[12px] uppercase tracking-widest text-terracotta font-semibold block mb-3">
              02 / Philosophical Heritage
            </span>
            <h2 className="font-display font-medium text-[36px] sm:text-[48px] leading-[1.1] tracking-tight text-charcoal mb-6">
              Ancient wisdom for the decentralized economy.
            </h2>
            <p className="font-body text-[18px] text-text-secondary leading-relaxed">
              In classical Indian philosophy, life is governed by the four
              <strong> Purusharthas</strong> — the noble aims of human existence.
              Artha translates to wealth, material purpose, and the means to live
              with sovereignty. Here is how ancient principles map directly to modern
              cypherpunk architecture:
            </p>
          </div>

          {/* Interactive Purushartha Tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {PURUSHARTHAS.map((p, index) => {
              const isActive = activePurushartha === index;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePurushartha(index)}
                  className={`text-left p-6 rounded-xl border transition-all duration-300 relative ${
                    isActive
                      ? "bg-charcoal text-white border-charcoal shadow-md"
                      : "bg-white text-charcoal border-border-subtle hover:border-charcoal/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`font-mono text-[12px] uppercase tracking-widest ${
                        isActive ? "text-warm-gold" : "text-text-secondary"
                      }`}
                    >
                      Pillar 0{index + 1}
                    </span>
                    <span
                      className={`font-display font-bold text-[18px] ${
                        isActive ? "text-warm-gold" : "text-terracotta"
                      }`}
                    >
                      {p.devanagari}
                    </span>
                  </div>
                  <h3 className="font-display font-medium text-[22px] tracking-tight mb-1">
                    {p.name}
                  </h3>
                  <p
                    className={`font-body text-[13px] line-clamp-2 ${
                      isActive ? "text-parchment/80" : "text-text-secondary"
                    }`}
                  >
                    {p.title}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Purushartha Detail Panel */}
          <div className="bg-white border border-border-subtle rounded-2xl p-8 lg:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-display font-bold text-[32px] text-terracotta">
                    {PURUSHARTHAS[activePurushartha].devanagari}
                  </span>
                  <div className="h-6 w-[1px] bg-border-subtle" />
                  <span className="font-display font-medium text-[28px] text-charcoal">
                    {PURUSHARTHAS[activePurushartha].name}
                  </span>
                  <span className="font-mono text-[12px] text-text-secondary bg-cream px-2.5 py-1 rounded">
                    PURUSHARTHA {activePurushartha + 1}
                  </span>
                </div>

                <h4 className="font-display font-medium text-[22px] text-charcoal mb-4">
                  {PURUSHARTHAS[activePurushartha].title}
                </h4>

                <p className="font-body text-[17px] text-text-secondary leading-relaxed mb-6">
                  {PURUSHARTHAS[activePurushartha].summary}
                </p>

                <ul className="space-y-3 font-body text-[15px] text-charcoal mb-6">
                  {PURUSHARTHAS[activePurushartha].details.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-terracotta shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-5 bg-cream/60 border border-border-subtle rounded-xl p-8 flex flex-col justify-between min-h-[260px]">
                <div className="font-serif italic text-[20px] text-charcoal leading-snug">
                  “{PURUSHARTHAS[activePurushartha].quote}”
                </div>
                <div className="flex items-center gap-3 pt-6 border-t border-border-subtle/80 mt-6">
                  <div className="w-8 h-8 rounded-full bg-charcoal text-warm-gold flex items-center justify-center font-display font-bold text-[14px]">
                    अ
                  </div>
                  <div>
                    <div className="font-ui text-[13px] font-semibold text-charcoal">
                      The Artha Creed
                    </div>
                    <div className="font-mono text-[11px] text-stone">
                      Principle 0{activePurushartha + 1} of 04
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: THE 4 STRUCTURAL PILLARS OF THE PROTOCOL                      */}
        {/* ========================================================================= */}
        <section className="py-24 border-b border-border-subtle reveal-section">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="font-mono text-[12px] uppercase tracking-widest text-terracotta font-semibold block mb-3">
                03 / Technical Foundations
              </span>
              <h2 className="font-display font-medium text-[36px] sm:text-[48px] leading-[1.1] tracking-tight text-charcoal">
                Four pillars of engineering discipline.
              </h2>
            </div>
            <p className="font-body text-[16px] text-text-secondary max-w-[420px]">
              Every architectural decision in Artha is designed to eliminate
              intermediaries and maximize developer sovereignty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-white border border-border-subtle rounded-xl p-8 flex flex-col justify-between hover:border-charcoal/50 transition-all group shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-lg bg-cream flex items-center justify-center text-charcoal mb-6 group-hover:bg-terracotta group-hover:text-white transition-colors">
                  <Unlock className="w-5 h-5" />
                </div>
                <span className="font-mono text-[11px] text-stone uppercase tracking-widest block mb-2">
                  Pillar 01
                </span>
                <h3 className="font-display font-medium text-[22px] text-charcoal mb-3">
                  Sovereign Autonomy
                </h3>
                <p className="font-body text-[15px] text-text-secondary leading-relaxed">
                  Direct wallet-to-wallet routing. The moment a user subscribes,
                  funds are transferred to your address in the same block. No
                  payout queues, no rolling reserves, and no third-party balance
                  sheets.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-border-subtle/60 font-mono text-[12px] text-stone">
                Solidity: Direct ERC-20 transfer
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-border-subtle rounded-xl p-8 flex flex-col justify-between hover:border-charcoal/50 transition-all group shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-lg bg-cream flex items-center justify-center text-charcoal mb-6 group-hover:bg-sage group-hover:text-white transition-colors">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="font-mono text-[11px] text-stone uppercase tracking-widest block mb-2">
                  Pillar 02
                </span>
                <h3 className="font-display font-medium text-[22px] text-charcoal mb-3">
                  Borderless Equality
                </h3>
                <p className="font-body text-[15px] text-text-secondary leading-relaxed">
                  Smart contracts do not check passports or credit scores. Any
                  creator with a public address is treated identically to a
                  Silicon Valley unicorn. Every internet citizen stands on equal
                  footing.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-border-subtle/60 font-mono text-[12px] text-stone">
                195+ Countries · Zero Geo-blocking
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-border-subtle rounded-xl p-8 flex flex-col justify-between hover:border-charcoal/50 transition-all group shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-lg bg-cream flex items-center justify-center text-charcoal mb-6 group-hover:bg-warm-gold group-hover:text-white transition-colors">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="font-mono text-[11px] text-stone uppercase tracking-widest block mb-2">
                  Pillar 03
                </span>
                <h3 className="font-display font-medium text-[22px] text-charcoal mb-3">
                  Cryptographic Verification
                </h3>
                <p className="font-body text-[15px] text-text-secondary leading-relaxed">
                  Dynamic ERC-1155 tokens act as tamper-proof subscription
                  passports. Your backend checks wallet token validity directly
                  via public RPC nodes without calling proprietary licensing
                  servers.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-border-subtle/60 font-mono text-[12px] text-stone">
                Token Standard: ERC-1155 Time-Lock
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-border-subtle rounded-xl p-8 flex flex-col justify-between hover:border-charcoal/50 transition-all group shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-lg bg-cream flex items-center justify-center text-charcoal mb-6 group-hover:bg-sky group-hover:text-white transition-colors">
                  <Scale className="w-5 h-5" />
                </div>
                <span className="font-mono text-[11px] text-stone uppercase tracking-widest block mb-2">
                  Pillar 04
                </span>
                <h3 className="font-display font-medium text-[22px] text-charcoal mb-3">
                  Radical Transparency
                </h3>
                <p className="font-body text-[15px] text-text-secondary leading-relaxed">
                  A flat 1.5% protocol fee ceiling is hardcoded into the immutable
                  smart contract. It can never be silently raised to 10% or 30%.
                  You can inspect the bytecode and audits on Polygonscan anytime.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-border-subtle/60 font-mono text-[12px] text-stone">
                Ceiling: 10% max invariant · 1.5% active
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: INTERACTIVE PROTOCOL FLOW SIMULATOR                            */}
        {/* ========================================================================= */}
        <section className="py-24 border-b border-border-subtle reveal-section">
          <div className="max-w-3xl mb-16">
            <span className="font-mono text-[12px] uppercase tracking-widest text-terracotta font-semibold block mb-3">
              04 / Protocol Architecture
            </span>
            <h2 className="font-display font-medium text-[36px] sm:text-[48px] leading-[1.1] tracking-tight text-charcoal mb-6">
              How value moves: The 4-step atomic lifecycle.
            </h2>
            <p className="font-body text-[18px] text-text-secondary leading-relaxed">
              Click through the execution stages below to see how Artha
              orchestrates payment, token minting, and feature gating with
              mathematical finality.
            </p>
          </div>

          {/* Stepper Header */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {PROTOCOL_STEPS.map((step, idx) => {
              const isCurrent = activeStep === idx;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`p-5 rounded-xl border text-left transition-all ${
                    isCurrent
                      ? "bg-charcoal text-white border-charcoal shadow-md"
                      : "bg-white text-charcoal border-border-subtle hover:border-charcoal/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-mono text-[12px] font-semibold ${
                        isCurrent ? "text-warm-gold" : "text-terracotta"
                      }`}
                    >
                      STEP {step.num}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isCurrent ? "bg-warm-gold animate-ping" : "bg-stone/30"
                      }`}
                    />
                  </div>
                  <div className="font-display font-medium text-[16px] leading-snug">
                    {step.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stepper Content Console */}
          <div className="bg-charcoal text-parchment rounded-2xl p-8 lg:p-12 shadow-xl border border-[#2d2b27]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Info */}
              <div className="lg:col-span-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[13px] px-3 py-1 rounded bg-[#252420] text-warm-gold border border-warm-gold/20">
                      {PROTOCOL_STEPS[activeStep].actor}
                    </span>
                    <span className="font-mono text-[12px] text-stone">
                      Phase {PROTOCOL_STEPS[activeStep].num} of 04
                    </span>
                  </div>

                  <h3 className="font-display font-medium text-[28px] sm:text-[32px] leading-tight text-white mb-4">
                    {PROTOCOL_STEPS[activeStep].label}
                  </h3>

                  <p className="font-body text-[17px] text-parchment/80 leading-relaxed mb-6">
                    {PROTOCOL_STEPS[activeStep].description}
                  </p>
                </div>

                <div className="p-4 bg-[#23221e] border border-[#33322d] rounded-lg mt-auto">
                  <div className="flex items-center gap-2 font-mono text-[12px] text-stone mb-1">
                    <Zap className="w-3.5 h-3.5 text-warm-gold" />
                    <span>NETWORK METRICS</span>
                  </div>
                  <div className="font-ui text-[14px] text-parchment font-medium">
                    {PROTOCOL_STEPS[activeStep].networkDetail}
                  </div>
                </div>
              </div>

              {/* Right Code Workbench */}
              <div className="lg:col-span-6 bg-[#121211] border border-[#2d2b27] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-[#191918] border-b border-[#2d2b27]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    <span className="font-mono text-[11px] text-stone ml-2">
                      execution-proof.ts
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-warm-gold">
                    polygon:137
                  </span>
                </div>

                <div className="p-5 font-mono text-[13px] leading-relaxed overflow-x-auto text-[#d4d1c9]">
                  <pre>{PROTOCOL_STEPS[activeStep].code}</pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: INTERACTIVE REVENUE FREEDOM CALCULATOR                         */}
        {/* ========================================================================= */}
        <section className="py-24 border-b border-border-subtle reveal-section">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: Explainer & Controls */}
            <div className="lg:col-span-5">
              <span className="font-mono text-[12px] uppercase tracking-widest text-terracotta font-semibold block mb-3">
                05 / Revenue Freedom Calculator
              </span>
              <h2 className="font-display font-medium text-[36px] sm:text-[46px] leading-[1.1] tracking-tight text-charcoal mb-6">
                Calculate what you surrender to middleman rails.
              </h2>
              <p className="font-body text-[17px] text-text-secondary leading-relaxed mb-8">
                Legacy processors advertise 2.9% + 30¢, but hide 2% cross-border
                fees and 2-3% currency conversion spreads. Use the slider to see
                how much Artha saves your balance sheet each year.
              </p>

              {/* Slider Component */}
              <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-xs mb-6">
                <div className="flex justify-between items-baseline mb-4">
                  <label className="font-ui text-[13px] font-semibold text-charcoal uppercase tracking-wider">
                    Monthly Recurring Revenue (MRR)
                  </label>
                  <span className="font-mono text-[24px] font-semibold text-terracotta">
                    ${mrr.toLocaleString()}
                  </span>
                </div>

                <input
                  type="range"
                  min={1000}
                  max={100000}
                  step={1000}
                  value={mrr}
                  onChange={(e) => setMrr(Number(e.target.value))}
                  className="w-full h-2 bg-sand rounded-lg appearance-none cursor-pointer accent-terracotta"
                />

                <div className="flex justify-between font-mono text-[11px] text-stone mt-2">
                  <span>$1,000 / mo</span>
                  <span>$50,000 / mo</span>
                  <span>$100,000 / mo</span>
                </div>
              </div>

              <div className="p-4 bg-cream/70 rounded-lg border border-border-subtle flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-terracotta shrink-0" />
                <span className="font-body text-[14px] text-charcoal">
                  Estimated {totalSubscribers.toLocaleString()} subscribers at an
                  average of ${avgSubscriptionPrice}/month.
                </span>
              </div>
            </div>

            {/* Right: Dynamic Calculation Comparison Board */}
            <div className="lg:col-span-7">
              <div className="bg-white border-2 border-charcoal rounded-2xl p-8 lg:p-10 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-charcoal text-parchment font-mono text-[11px] uppercase tracking-wider px-4 py-1 rounded-bl-xl font-semibold">
                  LIVE SIMULATION
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 pb-8 border-b border-border-subtle">
                  {/* Legacy Box */}
                  <div className="flex flex-col">
                    <span className="font-mono text-[12px] uppercase tracking-widest text-[#b91c1c] font-semibold mb-1">
                      Legacy Gateway (Stripe/PayPal)
                    </span>
                    <span className="font-display font-medium text-[36px] text-charcoal">
                      ${Math.round(legacyTotalFees).toLocaleString()}
                      <span className="text-[16px] text-stone font-normal">
                        {" "}
                        / mo
                      </span>
                    </span>
                    <span className="font-mono text-[12px] text-stone mt-1">
                      ~{legacyEffectivePercent}% effective toll (2.9% + $0.30 +
                      2% cross-border + 2.5% FX)
                    </span>
                    <span className="font-body text-[13px] text-[#b91c1c] mt-3 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> 7-day payout delay + KYC risk
                    </span>
                  </div>

                  {/* Artha Box */}
                  <div className="flex flex-col">
                    <span className="font-mono text-[12px] uppercase tracking-widest text-sage font-semibold mb-1">
                      Artha Protocol (Polygon PoS)
                    </span>
                    <span className="font-display font-medium text-[36px] text-terracotta">
                      ${Math.round(arthaTotalFees).toLocaleString()}
                      <span className="text-[16px] text-stone font-normal">
                        {" "}
                        / mo
                      </span>
                    </span>
                    <span className="font-mono text-[12px] text-stone mt-1">
                      1.5% fixed smart contract fee (0% FX spread)
                    </span>
                    <span className="font-body text-[13px] text-sage mt-3 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Instant block settlement (2s)
                    </span>
                  </div>
                </div>

                {/* Savings Callout */}
                <div className="bg-cream rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="font-ui text-[12px] uppercase tracking-widest text-text-secondary font-semibold block">
                      Annual Builder Value Preserved
                    </span>
                    <div className="font-display font-medium text-[42px] sm:text-[48px] text-charcoal leading-none mt-1">
                      +${Math.round(annualSavings).toLocaleString()}
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-terracotta text-white rounded-md font-ui text-[14px] font-semibold hover:bg-terracotta-dark transition-colors shadow-sm shrink-0"
                  >
                    Claim Your Sovereignty
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: BUILDER PERSONAS & REAL-WORLD SHOWCASES                       */}
        {/* ========================================================================= */}
        <section className="py-24 border-b border-border-subtle reveal-section">
          <div className="max-w-3xl mb-16">
            <span className="font-mono text-[12px] uppercase tracking-widest text-terracotta font-semibold block mb-3">
              06 / Who We Build For
            </span>
            <h2 className="font-display font-medium text-[36px] sm:text-[48px] leading-[1.1] tracking-tight text-charcoal mb-6">
              Engineered for the internet's frontier creators.
            </h2>
            <p className="font-body text-[18px] text-text-secondary leading-relaxed">
              Artha powers diverse monetization models across the globe — from
              autonomous AI inference servers to open-source developer tooling.
            </p>
          </div>

          {/* Persona Selection Tabs */}
          <div className="flex flex-wrap gap-3 mb-10">
            {BUILDER_PERSONAS.map((persona, index) => {
              const IconComponent = persona.icon;
              const isSelected = activePersona === index;
              return (
                <button
                  key={persona.id}
                  onClick={() => setActivePersona(index)}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border font-ui text-[14px] font-medium transition-all ${
                    isSelected
                      ? "bg-charcoal text-white border-charcoal shadow-sm"
                      : "bg-white text-charcoal border-border-subtle hover:border-charcoal/40"
                  }`}
                >
                  <IconComponent
                    className={`w-4 h-4 ${
                      isSelected ? "text-warm-gold" : "text-terracotta"
                    }`}
                  />
                  {persona.role}
                </button>
              );
            })}
          </div>

          {/* Selected Persona Showcase Card */}
          <div className="bg-white border border-border-subtle rounded-2xl p-8 lg:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-7">
                <span className="font-mono text-[12px] text-terracotta uppercase tracking-wider font-semibold block mb-2">
                  CASE STUDY & ARCHITECTURE
                </span>
                <h3 className="font-display font-medium text-[28px] sm:text-[34px] leading-tight text-charcoal mb-6">
                  {BUILDER_PERSONAS[activePersona].headline}
                </h3>

                <div className="space-y-6 font-body text-[16px] leading-relaxed">
                  <div>
                    <h4 className="font-ui text-[13px] uppercase tracking-wider font-bold text-charcoal mb-2">
                      The Challenge with Legacy Rails
                    </h4>
                    <p className="text-text-secondary">
                      {BUILDER_PERSONAS[activePersona].challenge}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-ui text-[13px] uppercase tracking-wider font-bold text-charcoal mb-2">
                      The Artha Solution
                    </h4>
                    <p className="text-charcoal font-medium">
                      {BUILDER_PERSONAS[activePersona].solution}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-cream/70 border border-border-subtle rounded-xl p-8 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-white border border-border-subtle flex items-center justify-center text-terracotta mb-6 shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <p className="font-serif italic text-[18px] sm:text-[20px] text-charcoal leading-relaxed mb-6">
                    {BUILDER_PERSONAS[activePersona].quote}
                  </p>
                </div>
                <div className="pt-6 border-t border-border-subtle font-mono text-[12px] text-text-secondary">
                  {BUILDER_PERSONAS[activePersona].author}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 8: ENGINEERING BENCHMARKS & PROTOCOL SPECS                       */}
        {/* ========================================================================= */}
        <section className="py-24 border-b border-border-subtle reveal-section">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <span className="font-mono text-[12px] uppercase tracking-widest text-terracotta font-semibold block mb-3">
                07 / On-Chain Verification
              </span>
              <h2 className="font-display font-medium text-[36px] sm:text-[46px] leading-[1.1] tracking-tight text-charcoal mb-6">
                Engineered for maximum gas efficiency.
              </h2>
              <p className="font-body text-[17px] text-text-secondary leading-relaxed mb-6">
                Payments should not consume half of a subscription in transaction
                fees. Artha leverages Polygon PoS for near-instant confirmations
                and fractions-of-a-cent execution costs.
              </p>
              <div className="flex flex-col gap-3 font-mono text-[13px]">
                <div className="flex items-center justify-between p-3 bg-white border border-border-subtle rounded-md">
                  <span className="text-text-secondary">Chain ID:</span>
                  <span className="font-semibold text-charcoal">137 (Polygon PoS)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white border border-border-subtle rounded-md">
                  <span className="text-text-secondary">Settlement Asset:</span>
                  <span className="font-semibold text-charcoal">USDC (PoS Native)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white border border-border-subtle rounded-md">
                  <span className="text-text-secondary">Token Standard:</span>
                  <span className="font-semibold text-charcoal">ERC-1155 Multi-Token</span>
                </div>
              </div>
            </div>

            {/* Right: Technical Spec Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-2 font-mono text-[12px] text-terracotta uppercase tracking-wider font-semibold">
                  <Zap className="w-4 h-4" /> Average Gas Cost
                </div>
                <div className="font-mono text-[36px] font-medium text-charcoal">
                  $0.0038
                </div>
                <p className="font-body text-[14px] text-text-secondary mt-2">
                  Optimized assembly and minimal storage writes keep minting and
                  settlement gas costs under half a cent.
                </p>
              </div>

              <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-2 font-mono text-[12px] text-sage uppercase tracking-wider font-semibold">
                  <TrendingUp className="w-4 h-4" /> Block Finality
                </div>
                <div className="font-mono text-[36px] font-medium text-charcoal">
                  ~2.1 sec
                </div>
                <p className="font-body text-[14px] text-text-secondary mt-2">
                  Polygon's Bor consensus layer provides probabilistic finality in
                  two seconds, enabling real-time UI unlocks.
                </p>
              </div>

              <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-2 font-mono text-[12px] text-warm-gold uppercase tracking-wider font-semibold">
                  <ShieldCheck className="w-4 h-4" /> Non-Reentrant Logic
                </div>
                <div className="font-mono text-[36px] font-medium text-charcoal">
                  Audited
                </div>
                <p className="font-body text-[14px] text-text-secondary mt-2">
                  OpenZeppelin ReentrancyGuard and SafeERC20 implementations
                  prevent state manipulation and re-entrancy vectors.
                </p>
              </div>

              <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-2 font-mono text-[12px] text-sky uppercase tracking-wider font-semibold">
                  <Terminal className="w-4 h-4" /> Zero Dependency Reads
                </div>
                <div className="font-mono text-[36px] font-medium text-charcoal">
                  100% On-Chain
                </div>
                <p className="font-body text-[14px] text-text-secondary mt-2">
                  Subscription expiration timestamps are written directly to
                  contract mapping storage, readable by any Web3 library.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 9: PROTOCOL ROADMAP                                               */}
        {/* ========================================================================= */}
        <section className="py-24 border-b border-border-subtle reveal-section">
          <div className="max-w-3xl mb-16">
            <span className="font-mono text-[12px] uppercase tracking-widest text-terracotta font-semibold block mb-3">
              08 / The Journey Ahead
            </span>
            <h2 className="font-display font-medium text-[36px] sm:text-[48px] leading-[1.1] tracking-tight text-charcoal mb-6">
              Protocol evolution & roadmap.
            </h2>
            <p className="font-body text-[18px] text-text-secondary leading-relaxed">
              From our battle-tested Polygon core to multi-chain account
              abstraction and zero-knowledge privacy gates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROADMAP_PHASES.map((phase) => (
              <div
                key={phase.phase}
                className="bg-white border border-border-subtle rounded-xl p-6 flex flex-col justify-between shadow-xs hover:border-charcoal/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[12px] font-bold text-charcoal">
                      {phase.phase}
                    </span>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-semibold ${
                        phase.status === "completed"
                          ? "bg-sage/15 text-sage"
                          : phase.status === "in-progress"
                          ? "bg-terracotta/15 text-terracotta animate-pulse"
                          : "bg-cream text-stone"
                      }`}
                    >
                      {phase.tag}
                    </span>
                  </div>

                  <h3 className="font-display font-medium text-[19px] text-charcoal mb-4">
                    {phase.title}
                  </h3>

                  <ul className="space-y-2.5 font-body text-[14px] text-text-secondary">
                    {phase.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-stone mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-border-subtle/60 font-mono text-[11px] text-stone">
                  {phase.status === "completed"
                    ? "✓ Verified On-Chain"
                    : phase.status === "in-progress"
                    ? "⚡ Active Engineering"
                    : "⏳ Architectural Review"}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 10: INTERACTIVE FAQ ACCORDION                                     */}
        {/* ========================================================================= */}
        <section className="py-24 border-b border-border-subtle reveal-section">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <span className="font-mono text-[12px] uppercase tracking-widest text-terracotta font-semibold block mb-3">
                09 / Inquiries & Clarity
              </span>
              <h2 className="font-display font-medium text-[36px] sm:text-[46px] leading-[1.1] tracking-tight text-charcoal mb-6">
                Frequently examined questions.
              </h2>
              <p className="font-body text-[17px] text-text-secondary leading-relaxed mb-6">
                Technical, legal, and operational questions answered with absolute
                candor.
              </p>
              <div className="p-4 bg-cream rounded-lg border border-border-subtle font-body text-[14px] text-text-secondary">
                Have a specialized integration or institutional question? Read
                our full technical specification in{" "}
                <Link
                  href="/dev-docs"
                  className="text-charcoal font-semibold underline underline-offset-2"
                >
                  Developer Documentation
                </Link>
                .
              </div>
            </div>

            {/* Accordion list */}
            <div className="lg:col-span-8 space-y-4">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-border-subtle rounded-xl overflow-hidden transition-all shadow-xs"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-6 flex items-center justify-between gap-4 font-display font-medium text-[19px] text-charcoal hover:text-terracotta transition-colors"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-stone shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-terracotta" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 font-body text-[16px] text-text-secondary leading-relaxed border-t border-border-subtle/50">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 11: FOUNDER MANIFESTO & CALL TO ACTION                            */}
        {/* ========================================================================= */}
        <section className="pt-24 pb-12 reveal-section">
          <div className="bg-charcoal text-parchment rounded-3xl p-8 sm:p-14 lg:p-18 relative overflow-hidden border border-[#2d2b27] shadow-2xl">
            {/* Background geometric accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-warm-gold/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-[#252420] border border-warm-gold/30 flex items-center justify-center font-display font-bold text-[24px] text-warm-gold mb-6 shadow-inner">
                अर्थ
              </div>

              <span className="font-mono text-[13px] uppercase tracking-widest text-warm-gold font-semibold mb-4">
                THE FOUNDER'S CREED
              </span>

              <h2 className="font-display font-medium text-[36px] sm:text-[52px] lg:text-[64px] leading-[1.1] tracking-tight text-white mb-8 text-balance">
                The internet is borderless. <br />
                Your revenue must be too.
              </h2>

              <p className="font-body text-[19px] sm:text-[22px] leading-[1.5] text-parchment/80 mb-10 max-w-[720px] text-balance">
                You do not need to ask for permission. You do not need to wait in a
                queue. Deploy your smart contract today, accept payments from any
                wallet in the world, and reclaim sovereign ownership over your
                livelihood.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-terracotta text-white rounded-md font-ui text-[16px] font-semibold hover:bg-terracotta-dark transition-all shadow-md hover:scale-[1.02]"
                >
                  Deploy in 3 Minutes
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/dev-docs"
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-transparent border border-parchment/30 text-parchment rounded-md font-ui text-[16px] font-medium hover:bg-white/10 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-warm-gold" />
                  Read Documentation
                </Link>
              </div>

              <div className="flex items-center gap-4 text-stone font-mono text-[12px] pt-8 border-t border-white/10">
                <span>POLYGON POS: 137</span>
                <span>•</span>
                <span>USDC CONTRACT VERIFIED</span>
                <span>•</span>
                <span>AUDITED ERC-1155 ENGINE</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
