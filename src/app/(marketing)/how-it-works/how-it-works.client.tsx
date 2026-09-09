"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ShieldCheck,
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
  Wallet,
  Code2,
  Scale,
  RefreshCw,
  Copy,
  Check,
  Server,
  Cpu,
  Globe,
  Coins,
  AlertTriangle,
  FileCode2,
  Box,
  Key,
} from "lucide-react";
import { HowItWorksCanvas } from "./HowItWorksCanvas";

gsap.registerPlugin(ScrollTrigger);

// ── 5-PHASE LIFECYCLE DATA ──────────────────────────────────────────
const PROTOCOL_PHASES = [
  {
    phase: "01",
    name: "Protocol Provisioning",
    tagline: "Initialize App & Define Subscription Tiers",
    actor: "Developer / CLI or Dashboard",
    actorColor: "#6a9bcc",
    summary:
      "A developer registers their application on-chain via VrenRegistry.sol and defines one or more subscription plans specifying price in USDC (6 decimals) and validity duration in seconds. No KYC, no merchant accounts, no paperwork.",
    solidityCode: `// VrenSubscription.sol
function createPlan(
    bytes32 appId,
    uint256 planId,
    uint256 price,       // e.g. 29_000_000 for 29 USDC
    uint256 duration     // e.g. 30 days = 2,592,000 seconds
) external whenNotPaused {
    require(registry.isOwner(appId, msg.sender), "Not app owner");
    require(duration > 0, "Duration must be > 0");
    require(!plans[appId][planId].active, "Plan already exists");

    plans[appId][planId] = Plan({
        price: price,
        duration: duration,
        active: true
    });
    emit PlanCreated(appId, planId, price, duration);
}`,
    sdkCode: `import { Vren } from "@vren/sdk";

// Initialize client with your app ID
const vren = new Vren({
  appId: "0x4a8f9c1b...3e02",
  network: "polygon", // Chain ID 137
});

// Or create a plan programmatically
await vren.createPlan({
  planId: 1,
  priceUSDC: 29.00,
  durationDays: 30,
});`,
    networkDetail: "Stored directly in EVM storage mapping: plans[appId][planId]",
    executionLatency: "1 block (~2.1s)",
  },
  {
    phase: "02",
    name: "One-Click Approval & Execution",
    tagline: "Atomic ERC-20 Pull & Transaction Signing",
    actor: "Subscriber / Web3 Wallet",
    actorColor: "#d97757",
    summary:
      "The end user connects their wallet (MetaMask, Rainbow, Coinbase Wallet) and approves the exact USDC amount. The frontend dispatches a single call to subscribe(appId, planId). ReentrancyGuard and Pausable checks execute before any balance changes.",
    solidityCode: `// VrenSubscription.sol
function subscribe(bytes32 appId, uint256 planId)
    external
    nonReentrant
    whenNotPaused
{
    Plan memory plan = plans[appId][planId];
    require(plan.active, "Plan inactive or non-existent");

    address devWallet = registry.getPayoutWallet(appId);
    require(devWallet != address(0), "Invalid payout wallet");

    // Pull USDC tokens safely using OpenZeppelin SafeERC20
    uint256 fee = (plan.price * platformFeeBps) / 10000;
    uint256 devAmount = plan.price - fee;

    if (fee > 0) usdc.safeTransferFrom(msg.sender, treasury, fee);
    if (devAmount > 0) usdc.safeTransferFrom(msg.sender, devWallet, devAmount);
    // ... continues to minting
}`,
    sdkCode: `import { useVren } from "@vren/react";

export function SubscribeButton({ planId }: { planId: number }) {
  const { subscribe, isLoading } = useVren();

  const handleCheckout = async () => {
    // Automatically prompts USDC approve() then subscribe()
    const tx = await subscribe({ planId });
    console.log("Subscribed on Polygon:", tx.hash);
  };

  return (
    <button onClick={handleCheckout} disabled={isLoading}>
      {isLoading ? "Confirming on Polygon..." : "Subscribe for 29 USDC"}
    </button>
  );
}`,
    networkDetail: "SafeERC20.safeTransferFrom ensures exact allowance consumption",
    executionLatency: "Signature: ~450ms · Polygon finality: ~2.1s",
  },
  {
    phase: "03",
    name: "Direct Split Settlement",
    tagline: "98.5% Directly to Creator, 1.5% to Treasury",
    actor: "Smart Contract Settlement Engine",
    actorColor: "#788c5d",
    summary:
      "Unlike Stripe or Paddle which lock money in a 7 to 14-day rolling reserve, Artha's smart contract executes an atomic split. Exactly 98.5% of the USDC is transferred directly to the creator's payout wallet inside the same Ethereum Virtual Machine block.",
    solidityCode: `// Atomic Block Settlement Details
// Input: 100.00 USDC (100,000,000 units)
// platformFeeBps = 150 (1.5%)

uint256 fee = (100_000_000 * 150) / 10_000; // = 1.50 USDC
uint256 devAmount = 100_000_000 - fee;       // = 98.50 USDC

// Immediate wallet-to-wallet routing inside same EVM transaction:
usdc.safeTransferFrom(subscriber, creatorWallet, 98_500_000);
usdc.safeTransferFrom(subscriber, treasuryWallet, 1_500_000);

// Invariant: Contract balance remains 0 at start and end of call.
// No custodial pool. No risk of protocol insolvency.`,
    sdkCode: `// Settlement Receipt Object (Returned by SDK)
{
  "status": "confirmed",
  "blockNumber": 58492014,
  "transactionHash": "0x7f2a...8e1b",
  "grossAmount": "29.00 USDC",
  "creatorPayout": "28.565 USDC (98.5%)",
  "protocolFee": "0.435 USDC (1.5%)",
  "creatorWallet": "0x8F92...412c",
  "custodyDuration": "0.000 seconds (Instant atomic settlement)"
}`,
    networkDetail: "Non-custodial invariant: smart contract never holds custody of creator funds",
    executionLatency: "0ms holding period · Instant balance availability",
  },
  {
    phase: "04",
    name: "The Dynamic ERC-1155 Pass",
    tagline: "Self-Sovereign Credential Minted to User Wallet",
    actor: "ERC-1155 Token Standard",
    actorColor: "#c9a07c",
    summary:
      "The contract updates its internal subscriptions table with the new expiry timestamp (extending current validity if the user already has an active pass) and mints an ERC-1155 token to the subscriber's wallet. The token serves as an un-forgeable, transferable cryptographic credential.",
    solidityCode: `// VrenSubscription.sol
Subscription storage currentSub = subscriptions[appId][msg.sender];
uint256 newExpiry;

if (currentSub.active && currentSub.expiry > block.timestamp) {
    // Extend existing unexpired subscription
    newExpiry = currentSub.expiry + plan.duration;
} else {
    // Fresh subscription starting from current block timestamp
    newExpiry = block.timestamp + plan.duration;
}

currentSub.planId = planId;
currentSub.expiry = newExpiry;
currentSub.active = true;

uint256 tokenId = ++_tokenIdCounter;
_mint(msg.sender, tokenId, 1, "");

emit Subscribed(appId, msg.sender, planId, tokenId, newExpiry);`,
    sdkCode: `// Inspecting Token & Expiry via SDK
const sub = await vren.getSubscription("0x71C4...3A9b");

console.log(sub);
// Output:
// {
//   planId: 1,
//   expiry: 1789401822,
//   expiresAt: "2026-10-09T18:43:42.000Z",
//   active: true,
//   daysRemaining: 30
// }`,
    networkDetail: "ERC-1155 standard enables gas-efficient multi-token accounting on Polygon",
    executionLatency: "Minted in the same atomic block",
  },
  {
    phase: "05",
    name: "Sovereign Access Gating",
    tagline: "Cryptographic RPC Verification Without Auth Servers",
    actor: "Client & Backend Verifier",
    actorColor: "#191918",
    summary:
      "When the subscriber accesses protected routes or API endpoints, the developer's server executes hasAccess(appId, wallet). Because this is an eth_call (read-only view function), it costs 0 gas and can be queried directly against any public Polygon RPC node without depending on Artha's servers.",
    solidityCode: `// VrenSubscription.sol - Free View Function (0 Gas)
function hasAccess(bytes32 appId, address wallet)
    external
    view
    returns (bool)
{
    Subscription memory sub = subscriptions[appId][wallet];
    return sub.active && sub.expiry > block.timestamp;
}

function getSubscription(bytes32 appId, address wallet)
    external
    view
    returns (uint256 planId, uint256 expiry, bool active)
{
    Subscription memory sub = subscriptions[appId][wallet];
    return (
        sub.planId,
        sub.expiry,
        sub.active && sub.expiry > block.timestamp
    );
}`,
    sdkCode: `// Server Component / API Route (Next.js or Express)
import { Vren } from "@vren/sdk";

const vren = new Vren({ appId: process.env.VREN_APP_ID! });

export async function GET(req: Request) {
  const userWallet = req.headers.get("x-wallet-address") as \`0x\${string}\`;
  
  // 0 gas RPC call directly to Polygon PoS
  const { access, tier, expiresAt } = await vren.gate("pro-feature", userWallet);

  if (!access) {
    return Response.json({ error: "Active pass required" }, { status: 403 });
  }

  return Response.json({ status: "ok", tier, expiresAt, data: "Premium analytics" });
}`,
    networkDetail: "Pure eth_call read · Zero dependency on centralized databases",
    executionLatency: "< 80ms RPC response latency",
  },
];

// ── THE 3 PERSPECTIVES DATA ─────────────────────────────────────────
const PERSPECTIVES = [
  {
    id: "developer",
    title: "For Builders & SaaS Founders",
    subtitle: "Deploy global subscription infrastructure without legal corporate overhead.",
    icon: Code2,
    badge: "Builder Experience",
    points: [
      {
        h: "Day 0 Monetization",
        p: "No need to register a Delaware C-Corp, purchase US registered agents, or apply for merchant IDs. Connect your wallet and begin accepting USDC.",
      },
      {
        h: "Instant Payout Settlement",
        p: "Funds arrive directly in your self-custody wallet inside the transaction block (~2.1s). No 7-day holds, no rolling reserves, no arbitrary payout delays.",
      },
      {
        h: "1.5% Protocol Fee Ceiling",
        p: "Hardcoded fee limit in the contract bytecode. No 2.9% + 30¢ base + 2% cross-border + 2.5% FX conversions that eat 12% to 15% of your revenue.",
      },
      {
        h: "Zero Chargeback Liability",
        p: "Blockchain transactions are final and irreversible. Eliminate the threat of malicious chargebacks, disputes, and payment processor fines.",
      },
    ],
  },
  {
    id: "subscriber",
    title: "For Customers & Subscribers",
    subtitle: "Sovereign subscriptions with privacy, transparency, and self-custody.",
    icon: Wallet,
    badge: "Subscriber Experience",
    points: [
      {
        h: "1-Click Cryptographic Checkout",
        p: "Pay with USDC on Polygon in one click. No entering 16-digit credit card numbers, billing addresses, or CVVs into insecure checkout forms.",
      },
      {
        h: "No Surprise Recurring Charges",
        p: "Smart contracts cannot silently charge your wallet without your signed approval. You hold complete control over when and how you renew.",
      },
      {
        h: "Self-Sovereign Access Pass",
        p: "Your subscription is tokenized as an ERC-1155 pass in your own wallet. It cannot be revoked by a disgruntled customer support agent.",
      },
      {
        h: "Instant 1-Click Cancellation",
        p: "Cancel directly on-chain anytime by calling cancel(appId). You don't have to navigate 5 confirmation pages or call customer support.",
      },
    ],
  },
  {
    id: "protocol",
    title: "Under the Hood: Smart Contract Engine",
    subtitle: "The mathematics, opcodes, and invariants running on Polygon PoS.",
    icon: Cpu,
    badge: "EVM State Machine",
    points: [
      {
        h: "Non-Custodial Architecture",
        p: "The contract does not pool subscriber funds. Every transfer routes atomically to the creator's payout wallet using SafeERC20.",
      },
      {
        h: "ReentrancyGuard Hardening",
        p: "OpenZeppelin's mutex guard prevents recursive call attacks during payment pulls and token minting operations.",
      },
      {
        h: "Polygon PoS Gas Efficiency",
        p: "Executing a full subscription consumes ~68,412 gas units, translating to less than $0.003 at typical network gas prices.",
      },
      {
        h: "Trustless Read Invariant",
        p: "hasAccess() is a pure view function with 0 gas cost. Anyone can query verification proofs using public RPCs without API keys.",
      },
    ],
  },
];

// ── CODE MATRIX DATA ────────────────────────────────────────────────
const CODE_SNIPPETS = [
  {
    lang: "Next.js (App Router)",
    filename: "app/api/premium/route.ts",
    code: `import { NextRequest, NextResponse } from "next/server";
import { Vren } from "@vren/sdk";

// Initialize VREN client with your registered App ID
const vren = new Vren({
  appId: process.env.VREN_APP_ID as \`0x\${string}\`,
  network: "polygon", // Chain ID 137
});

export async function GET(request: NextRequest) {
  const wallet = request.headers.get("x-user-wallet") as \`0x\${string}\`;

  if (!wallet) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
  }

  // Pure eth_call read against Polygon RPC (0 gas)
  const result = await vren.gate("pro-analytics", wallet);

  if (!result.access) {
    return NextResponse.json(
      { error: "Active subscription pass required", reason: result.reason },
      { status: 403 }
    );
  }

  // Access granted: return gated payload
  return NextResponse.json({
    authorized: true,
    tier: result.tier,
    expiresAt: result.expiresAt,
    data: {
      metrics: [120, 340, 890, 1420],
      analyticsReport: "Q3 Sovereign Commerce Insights",
    },
  });
}`,
  },
  {
    lang: "React / Client",
    filename: "components/SubscriptionGate.tsx",
    code: `"use client";

import { useVren } from "@vren/react";
import { Lock, Sparkles } from "lucide-react";

export function ProFeature({ children }: { children: React.ReactNode }) {
  const { hasAccess, isChecking, subscribe, isSubscribing } = useVren({
    appId: "0x4a8f9c1b2e3d4f5a6b7c8d9e0f1a2b3c4d5e6f7a",
  });

  if (isChecking) {
    return <div className="animate-pulse p-6 bg-cream rounded-lg">Verifying pass on Polygon...</div>;
  }

  if (!hasAccess) {
    return (
      <div className="border border-border-subtle p-8 rounded-xl text-center bg-white">
        <Lock className="w-8 h-8 text-terracotta mx-auto mb-3" />
        <h3 className="font-display font-medium text-xl text-charcoal mb-2">Pro Access Required</h3>
        <p className="font-body text-dim text-sm mb-6 max-w-sm mx-auto">
          Subscribe with USDC on Polygon for instant, non-custodial access.
        </p>
        <button
          onClick={() => subscribe({ planId: 1 })}
          disabled={isSubscribing}
          className="px-6 py-3 rounded-lg bg-charcoal text-parchment font-ui text-sm hover:bg-[#2b2a27]"
        >
          {isSubscribing ? "Confirming on Polygon..." : "Subscribe for 29 USDC"}
        </button>
      </div>
    );
  }

  return <>{children}</>;
}`,
  },
  {
    lang: "Node.js / Express",
    filename: "middleware/vrenAuth.ts",
    code: `import { Request, Response, NextFunction } from "express";
import { Vren } from "@vren/sdk";

const vren = new Vren({
  appId: process.env.VREN_APP_ID as \`0x\${string}\`,
  network: "polygon",
});

export async function requireSubscription(req: Request, res: Response, next: NextFunction) {
  const wallet = req.headers["x-subscriber-wallet"] as \`0x\${string}\`;

  if (!wallet) {
    return res.status(401).json({ error: "Missing x-subscriber-wallet header" });
  }

  try {
    const { access, tier, expiresAt } = await vren.gate("api-tier", wallet);

    if (!access) {
      return res.status(403).json({
        error: "Subscription expired or not found",
        upgradeUrl: "https://yourapp.com/checkout",
      });
    }

    // Attach verified metadata to request
    (req as any).subscription = { tier, expiresAt };
    next();
  } catch (error) {
    res.status(500).json({ error: "Failed to verify on-chain credential", details: error });
  }
}`,
  },
  {
    lang: "Python / FastAPI",
    filename: "routers/inference.py",
    code: `from fastapi import APIRouter, Header, HTTPException
from web3 import Web3

router = APIRouter()
w3 = Web3(Web3.HTTPProvider("https://polygon-rpc.com"))

# VrenSubscription ABI snippet
VREN_ABI = [
    {
        "name": "hasAccess",
        "type": "function",
        "inputs": [{"name": "appId", "type": "bytes32"}, {"name": "wallet", "type": "address"}],
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "view"
    }
]

VREN_CONTRACT = w3.eth.contract(address="0xA35b...8291", abi=VREN_ABI)
APP_ID = bytes.fromhex("4a8f9c1b2e3d4f5a6b7c8d9e0f1a2b3c4d5e6f7a000000000000000000000000")

@router.post("/v1/models/generate")
async def generate_response(prompt: str, x_wallet: str = Header(...)):
    # Verify directly against Polygon node (0 gas, read-only)
    has_access = VREN_CONTRACT.functions.hasAccess(APP_ID, w3.to_checksum_address(x_wallet)).call()
    
    if not has_access:
        raise HTTPException(status_code=403, detail="Active VREN subscription required")
        
    return {"status": "success", "result": "Fine-tuned AI inference output", "wallet": x_wallet}`,
  },
  {
    lang: "Pure RPC / Viem",
    filename: "utils/verifyPureRPC.ts",
    code: `import { createPublicClient, http, parseAbi } from "viem";
import { polygon } from "viem/chains";

// Zero external SDK dependencies — pure EVM RPC call
const client = createPublicClient({
  chain: polygon,
  transport: http("https://polygon-rpc.com"),
});

const ABI = parseAbi([
  "function hasAccess(bytes32 appId, address wallet) external view returns (bool)",
  "function getSubscription(bytes32 appId, address wallet) external view returns (uint256 planId, uint256 expiry, bool active)"
]);

export async function checkPass(appId: \`0x\${string}\`, wallet: \`0x\${string}\`): Promise<boolean> {
  const hasAccess = await client.readContract({
    address: "0xA35b8291...21c3",
    abi: ABI,
    functionName: "hasAccess",
    args: [appId, wallet],
  });

  return hasAccess;
}`,
  },
];

// ── FAQ DATA ────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "How does Artha handle recurring subscription renewals without custodial keys?",
    a: "Unlike Web2 processors that store credit cards in a vault and automatically bill them without permission, Web3 respects user sovereignty. Subscriptions on Artha can be renewed either by the user executing a 1-click renewal transaction, or via an approved ERC-20 token allowance. When renewed before expiry, the contract seamlessly extends the existing subscription timestamp (currentSub.expiry + plan.duration), guaranteeing uninterrupted access without resetting credentials.",
  },
  {
    q: "What happens if Artha's website or frontend goes offline?",
    a: "Your subscriptions continue operating completely uninterrupted. Artha's smart contracts live permanently on the Polygon blockchain, and your subscriber credentials are held as ERC-1155 tokens in user wallets. Your application can query public Polygon RPC nodes directly (via viem, ethers, or Web3.py) to verify hasAccess() with zero dependency on Artha's servers, domain, or team.",
  },
  {
    q: "Why does Artha settle in USDC on Polygon rather than Ethereum L1 or credit cards?",
    a: "Polygon PoS delivers ~2.1-second block times and sub-penny gas fees (< $0.003 per transaction), making recurring micro-subscriptions economically viable. Native USDC on Polygon provides dollar-pegged stability, global liquidity, and instant convertibility into local fiat currencies via local off-ramps in 195+ countries without bank wire friction.",
  },
  {
    q: "Can developers cancel a subscriber or issue a refund?",
    a: "Yes. VrenSubscription.sol includes a cancelSubscription(appId, subscriber) function callable exclusively by the registered app owner. This allows developers to revoke credentials immediately in cases of terms violation or agreed refunds, emitting a transparent Cancelled on-chain event.",
  },
  {
    q: "How are chargebacks and payment disputes eliminated mathematically?",
    a: "On legacy networks (Visa, Mastercard, Stripe), consumers can initiate chargebacks up to 120 days after a transaction, forcing developers to pay $15 to $50 dispute penalties and losing their revenue. On Polygon PoS, transactions achieve cryptographic finality in ~2.1 seconds. Once a block is committed, the USDC transfer is mathematically irreversible.",
  },
  {
    q: "What are the exact fees and can the protocol raise them unexpectedly?",
    a: "The protocol fee is hardcoded at 1.5% (platformFeeBps = 150). The contract enforces a strict ceiling (require(_newFee <= 1000, 'Fee cannot exceed 10%')) in bytecode. Unlike centralized platforms that hike fees from 5% to 15% once builders are locked in, Artha's fee economics are governed openly and transparently on-chain.",
  },
];

export default function HowItWorksClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Interactive states
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [codeTab, setCodeTab] = useState<"solidity" | "sdk">("solidity");
  const [selectedPerspective, setSelectedPerspective] = useState<string>("developer");
  const [codeMatrixIndex, setCodeMatrixIndex] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Live Sandbox Simulation States
  const [sandboxPlan, setSandboxPlan] = useState<{ id: number; name: string; price: number; duration: string }>({
    id: 1,
    name: "Pro Builder",
    price: 29,
    duration: "30 Days",
  });
  const [sandboxStage, setSandboxStage] = useState<"idle" | "approving" | "mining" | "confirmed">("idle");
  const [sandboxAccess, setSandboxAccess] = useState<boolean>(false);
  const [sandboxTxData, setSandboxTxData] = useState<{
    hash: string;
    block: number;
    gasUsed: number;
    tokenId: number;
    expiry: string;
  } | null>(null);

  // Run Sandbox Simulation
  const handleRunSandbox = () => {
    setSandboxStage("approving");

    setTimeout(() => {
      setSandboxStage("mining");

      setTimeout(() => {
        const fakeBlock = 58492000 + Math.floor(Math.random() * 500);
        const fakeHash = "0x" + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("") + "...";
        const fakeToken = 1400 + Math.floor(Math.random() * 100);
        const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        setSandboxTxData({
          hash: fakeHash,
          block: fakeBlock,
          gasUsed: 68412,
          tokenId: fakeToken,
          expiry: expiryDate,
        });

        setSandboxStage("confirmed");
        setSandboxAccess(true);
      }, 1200);
    }, 800);
  };

  const handleResetSandbox = () => {
    setSandboxStage("idle");
    setSandboxAccess(false);
    setSandboxTxData(null);
  };

  // Copy code helper
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  useGSAP(
    () => {
      gsap.fromTo(
        ".reveal-hero",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out", delay: 0.1 }
      );
    },
    { scope: containerRef }
  );

  const currentPhase = PROTOCOL_PHASES[activePhaseIndex];
  const activePerspectiveData = PERSPECTIVES.find((p) => p.id === selectedPerspective) || PERSPECTIVES[0];

  return (
    <div ref={containerRef} className="bg-parchment text-charcoal font-body min-h-screen pt-28 sm:pt-36 pb-32">
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* ── 1. HERO SECTION ────────────────────────────────────────── */}
        <header className="mb-20">
          <div className="flex flex-wrap items-center gap-3 mb-6 reveal-hero">
            <span className="font-mono text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-cream text-terracotta font-semibold border border-sand">
              विधि · VIDHI · ARCHITECTURE SPECIFICATION
            </span>
            <span className="font-mono text-xs text-text-muted">
              Polygon PoS · Chain ID 137 · Non-Custodial Protocol v1.0
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-7">
              <h1 className="reveal-hero font-display font-medium text-[44px] sm:text-[60px] lg:text-[76px] leading-[1.02] tracking-tight text-charcoal">
                The Mechanics of Autonomy.
              </h1>
              <p className="reveal-hero font-body text-xl sm:text-2xl text-dim mt-6 leading-relaxed text-balance">
                A precise, end-to-end breakdown of how smart contracts, ERC-1155 dynamic credentials, and atomic block settlements replace fragile fiat gateways with mathematical certainty.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-end pt-2 reveal-hero">
              <div className="grid grid-cols-2 gap-4 bg-surface p-6 rounded-2xl border border-border-subtle shadow-sm">
                <div>
                  <span className="font-display text-2xl lg:text-3xl text-charcoal font-medium">~2.1s</span>
                  <span className="font-ui text-xs text-dim block mt-1 uppercase tracking-wider">
                    Block Finality
                  </span>
                </div>
                <div>
                  <span className="font-display text-2xl lg:text-3xl text-terracotta font-medium">98.5%</span>
                  <span className="font-ui text-xs text-dim block mt-1 uppercase tracking-wider">
                    Instant Creator Split
                  </span>
                </div>
                <div className="border-t border-border-subtle pt-4">
                  <span className="font-display text-2xl lg:text-3xl text-charcoal font-medium">0%</span>
                  <span className="font-ui text-xs text-dim block mt-1 uppercase tracking-wider">
                    Escrow & Custody Hold
                  </span>
                </div>
                <div className="border-t border-border-subtle pt-4">
                  <span className="font-display text-2xl lg:text-3xl text-charcoal font-medium">1.5%</span>
                  <span className="font-ui text-xs text-dim block mt-1 uppercase tracking-wider">
                    Hardcoded Fee Cap
                  </span>
                </div>
              </div>

              {/* Quick nav pills */}
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="font-ui text-xs text-dim font-medium self-center mr-1">Jump to:</span>
                {[
                  { label: "Simulator", href: "#canvas-section" },
                  { label: "Perspectives", href: "#perspectives-section" },
                  { label: "5-Phase Flow", href: "#lifecycle-section" },
                  { label: "Sandbox", href: "#sandbox-section" },
                  { label: "Code Matrix", href: "#code-section" },
                  { label: "Security", href: "#security-section" },
                ].map((pill, i) => (
                  <a
                    key={i}
                    href={pill.href}
                    className="font-mono text-xs px-2.5 py-1 rounded-md bg-white hover:bg-cream border border-border-subtle text-dim hover:text-charcoal transition-colors shadow-2xs"
                  >
                    {pill.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* ── 2. INTERACTIVE PROTOCOL VALUE CANVAS ───────────────────── */}
        <section id="canvas-section" className="mb-24">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs text-terracotta uppercase tracking-widest block mb-1">
                Visual State Machine
              </span>
              <h2 className="font-display font-medium text-2xl sm:text-3xl text-charcoal">
                Autonomous Value & Credential Routing
              </h2>
            </div>
            <p className="font-body text-sm text-dim max-w-md">
              Click any node in the architecture to inspect its EVM contract call, gas usage, and settlement invariants.
            </p>
          </div>

          <HowItWorksCanvas />
        </section>

        {/* ── 3. THE 3 PERSPECTIVES SWITCHER ─────────────────────────── */}
        <section id="perspectives-section" className="mb-28 border-t border-border-subtle pt-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-mono text-xs text-terracotta uppercase tracking-widest block mb-2">
              Tripartite Architecture
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-charcoal tracking-tight">
              One Protocol. Three Perspectives.
            </h2>
            <p className="font-body text-dim text-base sm:text-lg mt-3">
              Explore how Artha redesigns the payment stack for builders, subscribers, and the underlying smart contract state machine.
            </p>

            {/* Toggle Tabs */}
            <div className="inline-flex p-1.5 bg-cream/70 rounded-xl border border-border-subtle mt-8 max-w-full overflow-x-auto">
              {PERSPECTIVES.map((p) => {
                const Icon = p.icon;
                const isSelected = selectedPerspective === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPerspective(p.id)}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg font-ui text-xs sm:text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-white text-charcoal shadow-sm"
                        : "text-dim hover:text-charcoal"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? "text-terracotta" : "text-stone"}`} />
                    <span>{p.title.split(":")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Perspective Detail Card */}
          <div className="bg-surface rounded-2xl border border-border-subtle p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-border-subtle">
              <div>
                <span className="font-mono text-xs text-terracotta font-semibold uppercase tracking-widest block mb-1">
                  {activePerspectiveData.badge}
                </span>
                <h3 className="font-display font-medium text-2xl sm:text-3xl text-charcoal">
                  {activePerspectiveData.title}
                </h3>
              </div>
              <p className="font-body text-base text-dim max-w-lg">
                {activePerspectiveData.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              {activePerspectiveData.points.map((pt, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center shrink-0 mt-1 border border-border-subtle">
                    <CheckCircle2 className="w-4 h-4 text-terracotta" />
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-lg text-charcoal mb-1">
                      {pt.h}
                    </h4>
                    <p className="font-body text-sm text-dim leading-relaxed">
                      {pt.p}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. THE 5-PHASE PROTOCOL LIFECYCLE ──────────────────────── */}
        <section id="lifecycle-section" className="mb-28 border-t border-border-subtle pt-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <div>
              <span className="font-mono text-xs text-terracotta uppercase tracking-widest block mb-2">
                Step-by-Step Execution
              </span>
              <h2 className="font-display font-medium text-3xl sm:text-5xl text-charcoal tracking-tight">
                The 5-Phase Protocol Lifecycle
              </h2>
            </div>
            <p className="font-body text-dim text-base max-w-md">
              From contract provisioning to zero-gas RPC access gating, follow the exact deterministic lifecycle of a sovereign subscription.
            </p>
          </div>

          {/* Phase selector tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {PROTOCOL_PHASES.map((p, idx) => {
              const isActive = activePhaseIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActivePhaseIndex(idx)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    isActive
                      ? "bg-charcoal text-parchment border-charcoal shadow-md"
                      : "bg-surface hover:bg-cream/60 border-border-subtle text-charcoal"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-mono text-xs font-bold ${isActive ? "text-warm-gold" : "text-terracotta"}`}>
                      PHASE {p.phase}
                    </span>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: p.actorColor }}
                    />
                  </div>
                  <h4 className="font-display font-medium text-sm sm:text-base leading-tight">
                    {p.name}
                  </h4>
                </button>
              );
            })}
          </div>

          {/* Active Phase Deep Dive Card */}
          <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden shadow-md">
            <div className="p-6 sm:p-8 lg:p-10 border-b border-border-subtle bg-white">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs px-3 py-1 rounded bg-cream border border-sand text-charcoal font-semibold">
                    Actor: {currentPhase.actor}
                  </span>
                  <span className="font-mono text-xs text-dim">
                    Latency: {currentPhase.executionLatency}
                  </span>
                </div>
                <span className="font-mono text-xs text-terracotta font-medium">
                  {currentPhase.networkDetail}
                </span>
              </div>

              <h3 className="font-display font-medium text-2xl sm:text-3xl text-charcoal mb-2">
                Phase {currentPhase.phase}: {currentPhase.name}
              </h3>
              <p className="font-mono text-xs text-terracotta uppercase tracking-wider mb-4">
                {currentPhase.tagline}
              </p>
              <p className="font-body text-base sm:text-lg text-dim leading-relaxed max-w-4xl">
                {currentPhase.summary}
              </p>
            </div>

            {/* Synchronized Code Box */}
            <div className="p-6 sm:p-8 bg-[#191918] text-[#e8e6dc]">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-warm-gold" />
                  <span className="font-mono text-xs text-sand font-medium">
                    Verified Execution Code
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex p-1 rounded-lg bg-white/10 text-xs font-mono">
                    <button
                      onClick={() => setCodeTab("solidity")}
                      className={`px-3 py-1 rounded transition-colors ${
                        codeTab === "solidity"
                          ? "bg-warm-gold text-charcoal font-semibold"
                          : "text-stone hover:text-white"
                      }`}
                    >
                      Solidity Contract
                    </button>
                    <button
                      onClick={() => setCodeTab("sdk")}
                      className={`px-3 py-1 rounded transition-colors ${
                        codeTab === "sdk"
                          ? "bg-warm-gold text-charcoal font-semibold"
                          : "text-stone hover:text-white"
                      }`}
                    >
                      TypeScript SDK
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      handleCopyCode(
                        codeTab === "solidity" ? currentPhase.solidityCode : currentPhase.sdkCode
                      )
                    }
                    className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-stone hover:text-white transition-colors"
                    title="Copy snippet"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-sage" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <pre className="font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto text-[#d4cfbf] p-2">
                <code>{codeTab === "solidity" ? currentPhase.solidityCode : currentPhase.sdkCode}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* ── 5. LIVE PROTOCOL SANDBOX SIMULATOR ─────────────────────── */}
        <section id="sandbox-section" className="mb-28 border-t border-border-subtle pt-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-mono text-xs text-terracotta uppercase tracking-widest block mb-2">
              Hands-On Playground
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-charcoal tracking-tight">
              Interactive Protocol Sandbox
            </h2>
            <p className="font-body text-dim text-base sm:text-lg mt-3">
              Test drive the entire transaction lifecycle right in your browser. Watch the simulated block mine on Polygon, mint the credential, and un-gate protected routes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Checkout Modal Simulator */}
            <div className="lg:col-span-6 bg-surface rounded-2xl border border-border-subtle p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-6 border-b border-border-subtle mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center border border-border-subtle">
                    <Wallet className="w-4 h-4 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-lg text-charcoal">
                      Checkout Modal Simulator
                    </h3>
                    <span className="font-mono text-[11px] text-dim">
                      Simulating Wallet: 0x71C4...3A9b
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleResetSandbox}
                  className="text-xs font-mono text-dim hover:text-charcoal flex items-center gap-1.5 px-2 py-1 rounded bg-cream hover:bg-sand transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              {/* Plan Picker */}
              <div className="space-y-3 mb-6">
                {[
                  { id: 1, name: "Pro Builder", price: 29, duration: "30 Days" },
                  { id: 2, name: "Autonomous AI Agent", price: 99, duration: "30 Days" },
                  { id: 3, name: "Enterprise Cluster", price: 299, duration: "365 Days" },
                ].map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => {
                      if (sandboxStage === "idle") setSandboxPlan(plan);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      sandboxPlan.id === plan.id
                        ? "border-terracotta bg-terracotta/5 shadow-2xs"
                        : "border-border-subtle hover:border-stone bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          sandboxPlan.id === plan.id
                            ? "border-terracotta bg-terracotta text-white"
                            : "border-stone"
                        }`}
                      >
                        {sandboxPlan.id === plan.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <h4 className="font-display font-medium text-sm text-charcoal">
                          {plan.name}
                        </h4>
                        <span className="font-mono text-xs text-dim">{plan.duration} access pass</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-display font-medium text-base text-charcoal">
                        {plan.price}.00 USDC
                      </span>
                      <span className="font-mono text-[10px] text-sage block">
                        98.5% instant split
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Split Breakdown */}
              <div className="bg-cream/60 rounded-xl p-4 border border-border-subtle mb-6 text-xs font-mono space-y-2">
                <div className="flex justify-between text-dim">
                  <span>Gross Subscription:</span>
                  <span className="text-charcoal font-semibold">{sandboxPlan.price}.00 USDC</span>
                </div>
                <div className="flex justify-between text-dim">
                  <span>Creator Instant Payout (98.5%):</span>
                  <span className="text-sage font-semibold">
                    {(sandboxPlan.price * 0.985).toFixed(3)} USDC
                  </span>
                </div>
                <div className="flex justify-between text-dim">
                  <span>Protocol Treasury (1.5%):</span>
                  <span className="text-terracotta font-semibold">
                    {(sandboxPlan.price * 0.015).toFixed(3)} USDC
                  </span>
                </div>
                <div className="flex justify-between text-dim pt-2 border-t border-border-subtle">
                  <span>Estimated Polygon Gas:</span>
                  <span className="text-charcoal font-medium">~$0.0028 (68,412 gas)</span>
                </div>
              </div>

              {/* Action Button */}
              {sandboxStage === "idle" && (
                <button
                  onClick={handleRunSandbox}
                  className="w-full py-3.5 rounded-xl bg-charcoal text-parchment font-ui text-sm font-medium hover:bg-[#2b2a27] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Zap className="w-4 h-4 text-warm-gold" />
                  Simulate 1-Click Subscribe ({sandboxPlan.price} USDC)
                </button>
              )}

              {sandboxStage === "approving" && (
                <div className="w-full py-3.5 rounded-xl bg-cream border border-border-subtle text-charcoal font-ui text-sm font-medium flex items-center justify-center gap-2 animate-pulse">
                  <Sparkles className="w-4 h-4 text-terracotta animate-spin" />
                  Approving {sandboxPlan.price} USDC on Polygon...
                </div>
              )}

              {sandboxStage === "mining" && (
                <div className="w-full py-3.5 rounded-xl bg-charcoal text-parchment font-ui text-sm font-medium flex items-center justify-center gap-2 animate-pulse">
                  <Box className="w-4 h-4 text-warm-gold animate-bounce" />
                  Mining Atomic Transaction on Block #58492014...
                </div>
              )}

              {sandboxStage === "confirmed" && (
                <div className="space-y-3">
                  <div className="w-full py-3 rounded-xl bg-sage/15 border border-sage/40 text-sage font-ui text-sm font-medium flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sage" />
                    Confirmed! ERC-1155 Token #{sandboxTxData?.tokenId} Minted
                  </div>
                  <button
                    onClick={() => {
                      setSandboxAccess(false);
                      setSandboxStage("idle");
                    }}
                    className="w-full py-2.5 rounded-lg border border-border-subtle font-ui text-xs text-dim hover:text-charcoal hover:bg-cream transition-colors"
                  >
                    Simulate Expiration or Cancellation
                  </button>
                </div>
              )}
            </div>

            {/* Right: Real-time Terminal & Route Gate Status */}
            <div className="lg:col-span-6 space-y-6">
              {/* Terminal Log */}
              <div className="bg-[#191918] rounded-2xl border border-white/10 p-6 font-mono text-xs text-[#d4cfbf] shadow-md">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="text-[11px] text-stone pl-2">Polygon PoS Telemetry Log</span>
                  </div>
                  <span className="text-[10px] text-warm-gold">RPC: polygon-rpc.com</span>
                </div>

                <div className="space-y-2 h-44 overflow-y-auto pr-2">
                  <p className="text-stone">// Listening for contract events on 0xA35b...8291</p>
                  {sandboxStage !== "idle" && (
                    <p className="text-[#6a9bcc]">
                      &gt; USDC.approve(spender: 0xA35b...8291, amount: {sandboxPlan.price * 1e6})
                    </p>
                  )}
                  {(sandboxStage === "mining" || sandboxStage === "confirmed") && (
                    <>
                      <p className="text-terracotta">
                        &gt; VrenSubscription.subscribe(appId: 0x4a8f..., planId: {sandboxPlan.id})
                      </p>
                      <p className="text-sand">&gt; Checking ReentrancyGuard: OK</p>
                      <p className="text-sage">&gt; safeTransferFrom creator: {(sandboxPlan.price * 0.985).toFixed(3)} USDC</p>
                    </>
                  )}
                  {sandboxStage === "confirmed" && sandboxTxData && (
                    <>
                      <p className="text-warm-gold">
                        &gt; _mint(to: 0x71C4...3A9b, tokenId: {sandboxTxData.tokenId}, amount: 1)
                      </p>
                      <p className="text-white font-semibold">
                        &gt; Block #{sandboxTxData.block} Sealed · Gas Used: {sandboxTxData.gasUsed} (~$0.0028)
                      </p>
                      <p className="text-stone truncate">
                        &gt; TxHash: {sandboxTxData.hash}
                      </p>
                    </>
                  )}
                  {sandboxStage === "idle" && (
                    <p className="text-stone/60">
                      &gt; Awaiting transaction trigger from simulator...
                    </p>
                  )}
                </div>
              </div>

              {/* Developer Gated Route Preview */}
              <div className="bg-surface rounded-2xl border border-border-subtle p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-dim" />
                    <span className="font-mono text-xs font-semibold text-charcoal">
                      Developer Route: GET /api/v1/private-inference
                    </span>
                  </div>
                  {sandboxAccess ? (
                    <span className="px-2.5 py-1 rounded-full bg-sage/15 text-sage border border-sage/30 font-mono text-[11px] font-semibold flex items-center gap-1.5">
                      <Unlock className="w-3 h-3" /> 200 OK (UNLOCKED)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-terracotta/15 text-terracotta border border-terracotta/30 font-mono text-[11px] font-semibold flex items-center gap-1.5">
                      <Lock className="w-3 h-3" /> 403 FORBIDDEN (LOCKED)
                    </span>
                  )}
                </div>

                <div className="bg-cream/50 rounded-xl p-4 border border-border-subtle font-mono text-xs">
                  {sandboxAccess ? (
                    <div className="text-charcoal space-y-1">
                      <p className="text-sage font-semibold">// Cryptographic Verification Succeeded</p>
                      <p>{`{`}</p>
                      <p className="pl-4 text-dim">{`"hasAccess": true,`}</p>
                      <p className="pl-4 text-dim">{`"tier": "${sandboxPlan.name}",`}</p>
                      <p className="pl-4 text-dim">{`"expiresAt": "${sandboxTxData?.expiry || ""}",`}</p>
                      <p className="pl-4 text-charcoal font-medium">{`"gatedData": "Autonomous AI weights & unlimited streaming unlocked."`}</p>
                      <p>{`}`}</p>
                    </div>
                  ) : (
                    <div className="text-dim space-y-1">
                      <p className="text-terracotta font-semibold">// Verification Check Failed</p>
                      <p>{`{`}</p>
                      <p className="pl-4">{`"hasAccess": false,`}</p>
                      <p className="pl-4">{`"reason": "no_active_subscription_nft",`}</p>
                      <p className="pl-4">{`"error": "HTTP 403: Wallet 0x71C4...3A9b does not hold valid pass"`}</p>
                      <p>{`}`}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. LEGACY FIAT GATEWAYS VS. ARTHA PROTOCOL ────────────── */}
        <section className="mb-28 border-t border-border-subtle pt-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs text-terracotta uppercase tracking-widest block mb-2">
              Architectural Contrast
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-5xl text-charcoal tracking-tight">
              The Seven Intermediaries vs. Zero Middlemen
            </h2>
            <p className="font-body text-dim text-base sm:text-lg mt-4">
              Traditional gateways insert an obstacle course of banks, processors, and currency converters between your code and your revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* The Legacy Fiat Trap */}
            <div className="bg-surface rounded-2xl border border-red-200/60 p-6 sm:p-8 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between pb-6 border-b border-border-subtle mb-6">
                <div>
                  <span className="font-mono text-xs text-red-600 font-semibold uppercase tracking-wider block mb-1">
                    The Legacy Fiat Trap
                  </span>
                  <h3 className="font-display font-medium text-2xl text-charcoal">
                    Traditional Gateway Pipeline
                  </h3>
                </div>
                <XCircle className="w-6 h-6 text-red-500" />
              </div>

              {/* 7 Hop Stack */}
              <div className="space-y-3 font-mono text-xs">
                {[
                  { step: "1", title: "Credit Card Network", desc: "Visa / Mastercard 1.5% interchange toll" },
                  { step: "2", title: "Issuing Bank", desc: "Random fraud blocks & 3D Secure drop-offs" },
                  { step: "3", title: "Acquiring Gateway", desc: "Stripe / Paddle 2.9% + $0.30 fixed fee" },
                  { step: "4", title: "Merchant of Record", desc: "Cross-border 1.5% to 2.0% foreign tax surcharge" },
                  { step: "5", title: "Currency Converter", desc: "2.0% to 3.5% hidden FX markup on payout" },
                  { step: "6", title: "Risk Assessment Hold", desc: "5% to 10% rolling reserves frozen for 90 days" },
                  { step: "7", title: "Final Bank Wire", desc: "7 to 14 day delay before money hits your account" },
                ].map((hop, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-red-50/50 border border-red-100">
                    <span className="w-5 h-5 rounded-full bg-red-200/70 text-red-700 flex items-center justify-center font-bold text-[10px]">
                      {hop.step}
                    </span>
                    <div className="flex-1 flex justify-between items-center">
                      <span className="text-charcoal font-medium">{hop.title}</span>
                      <span className="text-dim text-[11px]">{hop.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle flex justify-between items-center text-xs font-mono">
                <span className="text-red-700 font-semibold">Total Revenue Toll: 8% to 14%</span>
                <span className="text-dim">Payout Time: 7 to 14 days</span>
              </div>
            </div>

            {/* The Artha Protocol Standard */}
            <div className="bg-surface rounded-2xl border border-sage/50 p-6 sm:p-8 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between pb-6 border-b border-border-subtle mb-6">
                <div>
                  <span className="font-mono text-xs text-sage font-semibold uppercase tracking-wider block mb-1">
                    The Artha Standard
                  </span>
                  <h3 className="font-display font-medium text-2xl text-charcoal">
                    Autonomous Smart Contract Pipeline
                  </h3>
                </div>
                <CheckCircle2 className="w-6 h-6 text-sage" />
              </div>

              {/* 2-Step Sovereign Flow */}
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-sage/10 border border-sage/30">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-sage text-white flex items-center justify-center font-bold text-[10px]">
                      1
                    </span>
                    <span className="text-charcoal font-semibold text-sm">
                      End User Wallet Approves & Subscribes
                    </span>
                  </div>
                  <p className="font-body text-dim text-xs leading-relaxed pl-7">
                    USDC transfers directly from subscriber to VrenSubscription.sol on Polygon PoS. Zero intermediaries, zero card networks.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-sage/10 border border-sage/30">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-sage text-white flex items-center justify-center font-bold text-[10px]">
                      2
                    </span>
                    <span className="text-charcoal font-semibold text-sm">
                      Instant Atomic Block Split (2.1 seconds)
                    </span>
                  </div>
                  <p className="font-body text-dim text-xs leading-relaxed pl-7">
                    98.5% routes directly to the creator payout wallet. 1.5% routes to protocol treasury. ERC-1155 pass is minted in the exact same transaction block.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-cream border border-border-subtle">
                  <span className="text-charcoal font-semibold block mb-1">
                    Zero Intermediary Invariants:
                  </span>
                  <ul className="space-y-1 text-dim text-[11px] list-disc list-inside">
                    <li>Zero custody hold: funds never sit in an Artha corporate account</li>
                    <li>Zero chargebacks: cryptographic finality prevents payment clawbacks</li>
                    <li>Zero geo-fencing: accepts USDC from all 195+ countries without bias</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle flex justify-between items-center text-xs font-mono">
                <span className="text-sage font-bold">Total Revenue Toll: 1.5% Flat</span>
                <span className="text-charcoal font-semibold">Payout Time: ~2.1 seconds</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. MULTI-STACK INTEGRATION CODE MATRIX ─────────────────── */}
        <section id="code-section" className="mb-28 border-t border-border-subtle pt-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-mono text-xs text-terracotta uppercase tracking-widest block mb-2">
                Developer Integration
              </span>
              <h2 className="font-display font-medium text-3xl sm:text-5xl text-charcoal tracking-tight">
                Integrate in 3 Lines of Code
              </h2>
            </div>
            <p className="font-body text-dim text-base max-w-md">
              Whether you build with Next.js, Express, FastAPI, or raw RPC calls, gating premium routes with Artha is dead simple.
            </p>
          </div>

          <div className="bg-[#191918] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
            {/* Header / Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-white/10 bg-[#212120]">
              <div className="flex flex-wrap items-center gap-2">
                {CODE_SNIPPETS.map((tab, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCodeMatrixIndex(idx)}
                    className={`px-3.5 py-1.5 rounded-lg font-mono text-xs transition-colors ${
                      codeMatrixIndex === idx
                        ? "bg-warm-gold text-charcoal font-bold shadow-sm"
                        : "text-stone hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {tab.lang}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-stone hidden sm:inline">
                  {CODE_SNIPPETS[codeMatrixIndex].filename}
                </span>
                <button
                  onClick={() => handleCopyCode(CODE_SNIPPETS[codeMatrixIndex].code)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-sage" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-6 sm:p-8 overflow-x-auto">
              <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-[#d4cfbf]">
                <code>{CODE_SNIPPETS[codeMatrixIndex].code}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* ── 8. SMART CONTRACT SECURITY & INVARIANTS ────────────────── */}
        <section id="security-section" className="mb-28 border-t border-border-subtle pt-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs text-terracotta uppercase tracking-widest block mb-2">
              Cryptographic Hardening
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-charcoal tracking-tight">
              Smart Contract Security Invariants
            </h2>
            <p className="font-body text-dim text-base sm:text-lg mt-3">
              VrenSubscription.sol is built with audited OpenZeppelin v5 primitives, non-reentrant execution locks, and mathematically enforced non-custodial payouts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Reentrancy Guard",
                desc: "All state-mutating functions (subscribe, createPlan) employ OpenZeppelin's ReentrancyGuard mutex lock, rendering recursive withdrawal attacks impossible.",
              },
              {
                icon: Key,
                title: "Non-Custodial Flow",
                desc: "Funds never pool inside the smart contract. Payments transfer atomically from subscriber to creator in the exact same call, eliminating insolvency risk.",
              },
              {
                icon: Layers,
                title: "Checks-Effects-Interactions",
                desc: "Strict adherence to the CEI pattern: contract validation occurs first, state storage updates second, and token transfers execute last.",
              },
              {
                icon: AlertTriangle,
                title: "Pausable Circuit Breakers",
                desc: "Emergency pause functionality can freeze new subscriptions during market emergencies without endangering existing subscriber tokens or creator balances.",
              },
            ].map((sec, i) => {
              const Icon = sec.icon;
              return (
                <div key={i} className="bg-surface rounded-xl border border-border-subtle p-6 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center mb-4 border border-border-subtle">
                    <Icon className="w-5 h-5 text-terracotta" />
                  </div>
                  <h3 className="font-display font-medium text-lg text-charcoal mb-2">
                    {sec.title}
                  </h3>
                  <p className="font-body text-sm text-dim leading-relaxed">
                    {sec.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 9. NETWORK & GAS ECONOMICS MATRIX ──────────────────────── */}
        <section className="mb-28 border-t border-border-subtle pt-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-mono text-xs text-terracotta uppercase tracking-widest block mb-2">
                Network Economics
              </span>
              <h2 className="font-display font-medium text-3xl sm:text-5xl text-charcoal tracking-tight">
                Why Polygon PoS is the Sweet Spot
              </h2>
            </div>
            <p className="font-body text-dim text-base max-w-md">
              Comparing average subscription execution costs, block finality latency, and native USDC liquidity across major blockchain networks.
            </p>
          </div>

          <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border-subtle bg-cream/50 text-dim">
                    <th className="p-4 sm:p-5 font-semibold">Network</th>
                    <th className="p-4 sm:p-5 font-semibold">Avg. Gas Cost</th>
                    <th className="p-4 sm:p-5 font-semibold">Block Finality</th>
                    <th className="p-4 sm:p-5 font-semibold">Native USDC</th>
                    <th className="p-4 sm:p-5 font-semibold">Suitability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  <tr className="bg-terracotta/5 font-semibold text-charcoal">
                    <td className="p-4 sm:p-5 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-terracotta" />
                      Polygon PoS (Chain 137)
                    </td>
                    <td className="p-4 sm:p-5 text-sage font-bold">&lt; $0.003</td>
                    <td className="p-4 sm:p-5 text-charcoal">~2.1 seconds</td>
                    <td className="p-4 sm:p-5 text-sage">Yes (Over $1B native)</td>
                    <td className="p-4 sm:p-5 text-terracotta font-bold">Ideal for Micro-SaaS</td>
                  </tr>
                  <tr className="text-dim">
                    <td className="p-4 sm:p-5 font-medium text-charcoal">Ethereum L1 Mainnet</td>
                    <td className="p-4 sm:p-5 text-red-600 font-semibold">$18.00 - $45.00</td>
                    <td className="p-4 sm:p-5">12.0 seconds</td>
                    <td className="p-4 sm:p-5">Yes</td>
                    <td className="p-4 sm:p-5 text-stone">Too expensive for subs</td>
                  </tr>
                  <tr className="text-dim">
                    <td className="p-4 sm:p-5 font-medium text-charcoal">Arbitrum One</td>
                    <td className="p-4 sm:p-5">$0.08 - $0.20</td>
                    <td className="p-4 sm:p-5">~0.25 seconds</td>
                    <td className="p-4 sm:p-5">Yes</td>
                    <td className="p-4 sm:p-5 text-dim">High L1 posting cost</td>
                  </tr>
                  <tr className="text-dim">
                    <td className="p-4 sm:p-5 font-medium text-charcoal">Base (Coinbase L2)</td>
                    <td className="p-4 sm:p-5">$0.01 - $0.04</td>
                    <td className="p-4 sm:p-5">~2.0 seconds</td>
                    <td className="p-4 sm:p-5">Yes</td>
                    <td className="p-4 sm:p-5 text-dim">Roadmapped Phase 2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── 10. ARCHITECTURE FAQ ACCORDION ─────────────────────────── */}
        <section className="mb-28 border-t border-border-subtle pt-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-mono text-xs text-terracotta uppercase tracking-widest block mb-2">
              Developer Knowledge Base
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-charcoal tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="font-body text-dim text-base sm:text-lg mt-3">
              Deep-dive answers to developer questions regarding security, custody, renewals, and legal compliance.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-surface rounded-xl border border-border-subtle overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-cream/40 transition-colors"
                  >
                    <h3 className="font-display font-medium text-base sm:text-lg text-charcoal">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className={`w-4 h-4 text-dim shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-terracotta" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-border-subtle/50 text-dim font-body text-sm sm:text-base leading-relaxed animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 11. ACTIONABLE OUTRO & NEXT STEPS ──────────────────────── */}
        <section className="bg-charcoal text-parchment rounded-3xl p-8 sm:p-14 lg:p-20 relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl relative z-10">
            <span className="font-mono text-xs text-warm-gold uppercase tracking-widest block mb-4">
              Launch Your Sovereign Revenue Stream
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight mb-6 text-white">
              Ready to leave centralized payment traps behind?
            </h2>
            <p className="font-body text-stone text-lg sm:text-xl leading-relaxed mb-10 text-balance">
              Deploy your first plan on Polygon in under 60 seconds. Paste your contract into your application, install @vren/sdk, and accept payments from builders worldwide.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/dashboard"
                className="px-8 py-4 rounded-xl bg-warm-gold text-charcoal font-ui text-sm font-semibold hover:bg-[#d6b08e] transition-colors flex items-center gap-2 shadow-lg"
              >
                <span>Launch App in Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dev-docs"
                className="px-8 py-4 rounded-xl border border-stone/40 text-parchment font-ui text-sm font-medium hover:border-white hover:bg-white/5 transition-colors"
              >
                Read Developer Documentation
              </Link>
            </div>
          </div>

          {/* Devanagari background watermark */}
          <div className="absolute -bottom-10 -right-10 font-display font-bold text-[180px] sm:text-[260px] text-white/[0.03] select-none pointer-events-none leading-none">
            विधि
          </div>
        </section>

      </div>
    </div>
  );
}
