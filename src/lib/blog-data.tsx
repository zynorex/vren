import React from "react";

export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  slug: string;
  content: React.ReactNode;
}

const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <p className="font-body text-[18px] lg:text-[20px] text-text-secondary leading-[1.7] mb-8">
    {children}
  </p>
);

const Heading2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-[28px] lg:text-[36px] text-charcoal leading-[1.2] tracking-tight mt-16 mb-6">
    {children}
  </h2>
);

const Heading3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-display text-[22px] lg:text-[26px] text-charcoal leading-[1.2] tracking-tight mt-10 mb-4">
    {children}
  </h3>
);

const CodeBlock = ({ children, language = "typescript" }: { children: React.ReactNode, language?: string }) => (
  <div className="bg-[#111528] rounded-xl overflow-hidden mb-10 border border-[#1e2444] shadow-md">
    <div className="flex items-center px-4 py-3 bg-[#0a0f2e] border-b border-[#1e2444]">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
        <div className="w-3 h-3 rounded-full bg-[#28C840]" />
      </div>
      <span className="ml-4 font-mono text-[11px] text-[#6b6660] uppercase tracking-widest">{language}</span>
    </div>
    <pre className="p-6 overflow-x-auto">
      <code className="font-mono text-[14px] text-[#f7f4ee] leading-[1.6]">
        {children}
      </code>
    </pre>
  </div>
);

const Quote = ({ children }: { children: React.ReactNode }) => (
  <blockquote className="border-l-4 border-terracotta pl-6 lg:pl-8 py-2 my-10 font-body text-[20px] lg:text-[24px] text-charcoal italic leading-[1.6]">
    {children}
  </blockquote>
);

const List = ({ items }: { items: string[] }) => (
  <ul className="list-disc pl-6 mb-8 space-y-3">
    {items.map((item, i) => (
      <li key={i} className="font-body text-[18px] lg:text-[20px] text-text-secondary leading-[1.7]">
        {item}
      </li>
    ))}
  </ul>
);

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "Why we chose Polygon PoS over Ethereum Mainnet",
    excerpt: "An architectural deep dive into our decision to deploy the VREN registry and subscription contracts on Polygon. How we evaluated transaction finality, gas overhead, and ecosystem maturity.",
    date: "Jun 14, 2026",
    category: "Engineering",
    readTime: "6 min read",
    slug: "polygon-vs-ethereum",
    content: (
      <>
        <Paragraph>
          When building a decentralized payment infrastructure, the first critical technical decision is selecting the execution environment. The blockchain you choose dictates the latency of your application, the cost of customer acquisition, and ultimately, the viability of your business model. For VREN, that choice was Polygon Proof-of-Stake (PoS).
        </Paragraph>
        <Paragraph>
          This was not an arbitrary decision. We spent three months benchmarking Ethereum Mainnet, Arbitrum, Optimism, Base, and Polygon across four strict dimensions: transaction finality, gas overhead per subscription, RPC reliability, and stablecoin liquidity.
        </Paragraph>
        
        <Heading2>The Economics of Micro-Subscriptions</Heading2>
        <Paragraph>
          VREN is designed to replace traditional payment gateways like Stripe. If a developer in India wants to charge a $5/month subscription for their API, the transaction fee architecture must support that.
        </Paragraph>
        <Paragraph>
          On Ethereum Mainnet, an ERC-1155 minting operation (which is what happens under the hood when a user subscribes via VREN) costs between $15 and $40 in gas fees depending on network congestion. A user cannot pay a $30 execution fee for a $5 subscription. It fundamentally breaks the SaaS economic model.
        </Paragraph>
        <Quote>
          "Infrastructure that scales economically is just as important as infrastructure that scales technically."
        </Quote>
        <Paragraph>
          On Polygon PoS, that exact same ERC-1155 minting operation costs roughly $0.001. This allows the developer to abstract the gas cost entirely if they wish, or let the user pay a negligible network fee that does not induce friction at the checkout step.
        </Paragraph>

        <Heading2>Finality and The User Experience</Heading2>
        <Paragraph>
          Web2 users expect instant gratification. When they click "Subscribe," the UI must transition to an "Unlocked" state within seconds. While Optimistic Rollups (like Arbitrum and Optimism) offer excellent throughput, their 7-day challenge period creates complexities for instantaneous, irreversible settlement on the protocol level without centralized liquidity providers.
        </Paragraph>
        <Paragraph>
          Polygon PoS, combined with our webhook architecture, allows us to achieve perceived finality in under 3 seconds. The VREN SDK listens to the network, and the moment the block is propagated, the client UI unlocks.
        </Paragraph>

        <Heading2>Liquidity: The USDC Standard</Heading2>
        <Paragraph>
          Ultimately, developers want to be paid in stable, predictable currency. Polygon possesses one of the deepest pools of native, Circle-issued USDC outside of Ethereum Mainnet. Users do not need to bridge wrapped tokens or rely on fragmented liquidity pools. They pay in native USDC, and the developer receives native USDC.
        </Paragraph>
        <List items={[
          "Native USDC support directly issued by Circle.",
          "Sub-cent gas fees enabling micro-transactions.",
          "Widespread centralized exchange (CEX) off-ramps in emerging markets."
        ]} />
        <Paragraph>
          By building on Polygon, VREN provides the security and cryptographic guarantees of a public ledger, combined with the unit economics of a centralized database. It is the only architecture that makes borderless SaaS viable today.
        </Paragraph>
      </>
    )
  },
  {
    title: "Building an offline-first SDK for decentralized payments",
    excerpt: "Traditional SDKs fail gracefully. Web3 SDKs often fail catastrophically. Here is how we engineered the VREN SDK to degrade gracefully when RPC endpoints drop.",
    date: "May 28, 2026",
    category: "Engineering",
    readTime: "8 min read",
    slug: "offline-first-sdk",
    content: (
      <>
        <Paragraph>
          The most fragile layer of any decentralized application is the bridge between the client and the blockchain: the RPC (Remote Procedure Call) endpoint. When building the VREN SDK, we recognized that if the RPC goes down, the developer's application goes down. We could not allow our payment infrastructure to be the single point of failure for our customers.
        </Paragraph>

        <Heading2>The Problem with Naive Reads</Heading2>
        <Paragraph>
          Most Web3 SDKs execute a synchronous read operation against the blockchain every time they need to verify state. If you use a naive implementation to check if a user has an active subscription, your code looks like this:
        </Paragraph>
        
        <CodeBlock>
{`// The naive approach
const hasAccess = await publicClient.readContract({
  address: VREN_CONTRACT,
  abi: VREN_ABI,
  functionName: "hasAccess",
  args: [appId, userWallet]
});`}
        </CodeBlock>

        <Paragraph>
          If the public RPC is rate-limited, this call throws an error, and the user is suddenly locked out of software they paid for. This is unacceptable for enterprise-grade SaaS.
        </Paragraph>

        <Heading2>The VREN Fallback Architecture</Heading2>
        <Paragraph>
          We engineered the VREN SDK with a three-tier fallback mechanism:
        </Paragraph>
        <List items={[
          "Primary RPC: Developer-provided dedicated endpoint (e.g., Alchemy or Infura).",
          "Secondary RPC: Public aggregators (e.g., Ankr, LlamaNodes).",
          "Tertiary Cache: IndexedDB local state representing the last known valid block."
        ]} />
        
        <Paragraph>
          When `vren.gate()` is called, we attempt the Primary RPC. If we receive a 429 (Too Many Requests) or a timeout, we instantly failover to the Secondary RPC. If the entire network is congested or the client goes completely offline, we query the Tertiary Cache.
        </Paragraph>
        <Quote>
          "A user who paid for a 30-day subscription should not lose access because AWS us-east-1 is experiencing localized routing issues."
        </Quote>

        <Heading2>Cryptographic Proof Caching</Heading2>
        <Paragraph>
          How do we securely cache blockchain state locally without opening the door to manipulation? When a user subscribes, the VREN webhook issues a cryptographically signed JWT containing their `planId` and `expiry`, signed by the developer's private key. 
        </Paragraph>
        <Paragraph>
          This token is stored in `IndexedDB`. When the SDK falls back to the tertiary cache, it doesn't just trust a boolean; it verifies the signature of the JWT offline. This allows the application to remain functional on an airplane, in a tunnel, or during a massive network outage, while maintaining absolute cryptographic security.
        </Paragraph>
      </>
    )
  },
  {
    title: "The geometry of trust: Designing the VREN brand",
    excerpt: "Trust in financial technology is usually established through legal compliance. In decentralized systems, trust is established through code and communicated through design. A look at the Indian architectural heritage behind our brand.",
    date: "May 10, 2026",
    category: "Design",
    readTime: "5 min read",
    slug: "geometry-of-trust",
    content: (
      <>
        <Paragraph>
          Design in financial technology is a delicate exercise. If it looks too playful, people won't trust you with their money. If it looks too corporate, developers won't trust you with their code. For VREN, we had to solve a third variable: establishing trust while proudly asserting our origins in the global south.
        </Paragraph>

        <Heading2>The Torana and the Shiroreka</Heading2>
        <Paragraph>
          The VREN logo is an abstraction of two ancient Indian architectural and typographic elements.
        </Paragraph>
        <Paragraph>
          The first is the **Torana** — the sacred gateway found in Buddhist and Hindu architecture, most famously at the Sanchi Stupa built in the 3rd century BCE. It consists of two vertical pillars connected by a horizontal crossbar. It represents a threshold: the passage from the chaotic outside world into a structured, sacred interior. VREN acts as this threshold for developers, converting the chaotic open web into structured, predictable revenue.
        </Paragraph>
        <Paragraph>
          The second reference is the **Shiroreka** (शिरोरेखा) — the continuous horizontal line that runs across the top of Devanagari script, connecting individual characters into unified words. It is the unifying element of Sanskrit typography. In our mark, the warm gold crossbar serves this exact function.
        </Paragraph>

        <Heading2>Typography: Space Grotesk meets Inter</Heading2>
        <Paragraph>
          We rely on two contrasting typefaces to do all the heavy lifting. Space Grotesk is our display face. Its geometric construction echoes the logo mark perfectly. It feels slightly mechanical, reflecting the smart contract logic that powers our platform.
        </Paragraph>
        <Paragraph>
          For body copy, we use Inter. Inter is the invisible workhorse of the modern web. When explaining complex cryptographic concepts or pricing structures, the typography should disappear. Inter disappears gracefully.
        </Paragraph>
        <Quote>
          "If it needs decoration, the structure is weak. Fix the structure."
        </Quote>
        
        <Heading2>The Palette of Heritage</Heading2>
        <Paragraph>
          Instead of the clinical whites and generic blues of traditional SaaS, VREN uses Ivory (Parchment) and Midnight Navy (Charcoal). Our accent color is Warm Gold. This palette is drawn directly from Indian heritage — the deep shadow of carved stone temples and the warm gleam of gold leaf in lamplight.
        </Paragraph>
        <Paragraph>
          It is premium without asking for permission. It is Indian without apology.
        </Paragraph>
      </>
    )
  },
  {
    title: "Announcing VREN 1.0: Allowing Revenue To flow Honestly, Autonomously",
    excerpt: "Today we are bringing VREN out of beta. After months of testing and security audits, the protocol is live on mainnet and ready for production workloads.",
    date: "Apr 22, 2026",
    category: "Company",
    readTime: "4 min read",
    slug: "announcing-vren",
    content: (
      <>
        <Paragraph>
          Six months ago, we set out to solve a problem that nobody in Silicon Valley was talking about because it didn't affect them. If you are a developer in San Francisco, accepting money on the internet takes three minutes and an API key. If you are a developer in Lagos, Karachi, or Dhaka, it can take months of paperwork, and you will likely be rejected anyway.
        </Paragraph>
        <Paragraph>
          Today, we are thrilled to announce the 1.0 release of VREN: a decentralized payment layer designed specifically for builders locked out of the traditional financial infrastructure.
        </Paragraph>

        <Heading2>What is VREN 1.0?</Heading2>
        <Paragraph>
          VREN allows any developer to accept subscription payments from anywhere in the world, instantly, without a bank account or a corporate entity. By deploying an ERC-1155 smart contract to the Polygon network, your users can subscribe to your software using USDC.
        </Paragraph>
        <List items={[
          "Instant settlement directly to your wallet.",
          "A flat, hardcoded 1.5% platform fee.",
          "Zero geographic restrictions or arbitrary account freezes."
        ]} />

        <Heading2>Security and Audits</Heading2>
        <Paragraph>
          Handling financial infrastructure requires absolute paranoia. Prior to this 1.0 release, the core `VrenRegistry` and `VrenSubscription` smart contracts underwent rigorous external audits. We have implemented strict `ReentrancyGuard` patterns across all state-changing functions, and the treasury address logic relies entirely on on-chain registry verification.
        </Paragraph>
        <Paragraph>
          The smart contracts are immutable. We cannot freeze your funds, we cannot alter your subscription logic, and we cannot deplatform you. The code is law.
        </Paragraph>

        <Heading2>The Road Ahead</Heading2>
        <Paragraph>
          Our immediate focus post-launch is expanding the `@vren/sdk` to support more frontend frameworks natively. While our React hooks are production-ready, we are actively developing dedicated libraries for Vue, Svelte, and Python (for API gating).
        </Paragraph>
        <Paragraph>
          To the developers who have been testing VREN in beta: thank you. Your feedback shaped this protocol. To the developers discovering us today: your revenue is finally on your terms. Start building.
        </Paragraph>
      </>
    )
  },
  {
    title: "How to gate Next.js 15 App Router routes on-chain",
    excerpt: "A practical guide to implementing server-side wallet verification using the new Next.js 15 capabilities and the VREN SDK.",
    date: "Mar 15, 2026",
    category: "Tutorial",
    readTime: "7 min read",
    slug: "gate-nextjs-15",
    content: (
      <>
        <Paragraph>
          One of the most powerful paradigms introduced in recent web development is moving authorization logic to the server edge. In this tutorial, we will demonstrate how to secure a Next.js 15 App Router route using the VREN SDK, ensuring that only users with an active on-chain subscription can access your premium content.
        </Paragraph>

        <Heading2>The Architecture</Heading2>
        <Paragraph>
          Traditional Web3 applications gate content on the client side. The user connects their wallet, the React component reads the blockchain state, and if the user holds the token, the UI unlocks. The flaw here is obvious: a malicious user can simply inspect the network requests, bypass the client-side boolean, and access the raw data.
        </Paragraph>
        <Paragraph>
          With Next.js 15 Server Components, we verify the blockchain state on the server before the HTML is ever generated. 
        </Paragraph>

        <Heading2>Implementation</Heading2>
        <Paragraph>
          First, install the VREN SDK and your preferred wallet connection library (e.g., wagmi). When the user connects their wallet on the client, you must set a secure HTTP-only cookie containing their wallet address.
        </Paragraph>
        
        <CodeBlock>
{`// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Vren } from '@vren/sdk';

const vren = new Vren({
  appId: process.env.VREN_APP_ID!,
  network: "polygon"
});

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const wallet = request.cookies.get('user_wallet')?.value;
    
    if (!wallet) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verify on-chain subscription state
    const result = await vren.gate('pro', wallet as \`0x\${string}\`);
    
    if (!result.access) {
      return NextResponse.redirect(new URL('/pricing', request.url));
    }
  }
  return NextResponse.next();
}`}
        </CodeBlock>

        <Paragraph>
          Because `vren.gate()` executes at the middleware layer using viem under the hood, the check happens in milliseconds. The unauthorized user is redirected to the `/pricing` page before the `/dashboard` route even begins to render.
        </Paragraph>

        <Heading2>Optimizing RPC Calls</Heading2>
        <Paragraph>
          If your application experiences high traffic, executing an RPC call on every single page navigation will quickly exhaust your Alchemy or Infura rate limits. To solve this, we recommend caching the result of the `vren.gate()` check in Redis (e.g., via Upstash) with a Time-To-Live (TTL) of 5 minutes.
        </Paragraph>
        <Paragraph>
          The VREN webhook system can then be used to actively invalidate this Redis cache the moment a user cancels or their subscription expires on-chain, creating a perfectly synchronized, highly performant gating system.
        </Paragraph>
      </>
    )
  }
];
