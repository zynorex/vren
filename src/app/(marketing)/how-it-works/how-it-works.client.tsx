"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Search } from "lucide-react";

export default function HowItWorksPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".reveal",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.1 }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-parchment text-charcoal font-body min-h-screen pt-32 pb-32">
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-20 reveal">
          <div className="lg:col-span-5">
            <h1 className="font-display font-medium text-[56px] lg:text-[72px] leading-[1.1] tracking-tight text-charcoal">
              How It Works
            </h1>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-end pt-4">
            <p className="font-body text-[22px] lg:text-[28px] leading-[1.4] text-charcoal mb-8 text-balance">
              The mechanics of autonomy. A precise technical breakdown of how the VREN protocol replaces traditional fiat gateways with absolute programmatic certainty.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 items-center">
              <span className="font-ui text-[14px] font-semibold text-charcoal">Architecture layers:</span>
              <a href="#" className="font-ui text-[14px] text-text-secondary hover:text-charcoal underline underline-offset-4 decoration-border-subtle hover:decoration-charcoal transition-all">Smart Contracts</a>
              <a href="#" className="font-ui text-[14px] text-text-secondary hover:text-charcoal underline underline-offset-4 decoration-border-subtle hover:decoration-charcoal transition-all">The Minting Event</a>
              <a href="#" className="font-ui text-[14px] text-text-secondary hover:text-charcoal underline underline-offset-4 decoration-border-subtle hover:decoration-charcoal transition-all">Verification</a>
              <a href="#" className="font-ui text-[14px] text-text-secondary hover:text-charcoal underline underline-offset-4 decoration-border-subtle hover:decoration-charcoal transition-all">Settlement</a>
            </div>
          </div>
        </div>

        {/* 4 Columns Principles Grid */}
        <div className="border-t border-b border-border-subtle py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 reveal">
          <div className="flex flex-col">
            <h3 className="font-display font-medium text-[22px] text-charcoal mb-4">Protocol Deployment</h3>
            <p className="font-body text-[16px] text-text-secondary leading-relaxed">
              You initialize an isolated smart contract on the blockchain. This contract acts as your autonomous vault and access controller. There is no approval process.
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-display font-medium text-[22px] text-charcoal mb-4">The Minting Event</h3>
            <p className="font-body text-[16px] text-text-secondary leading-relaxed">
              Users interact with the VREN frontend. The specified crypto funds are transferred into your vault, and a unique cryptographic token representing their subscription is minted.
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-display font-medium text-[22px] text-charcoal mb-4">Verification</h3>
            <p className="font-body text-[16px] text-text-secondary leading-relaxed">
              Your server checks their connected wallet address. If the wallet holds a valid, unexpired token issued by your contract, access is granted. The verification cannot be spoofed.
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-display font-medium text-[22px] text-charcoal mb-4">Settlement</h3>
            <p className="font-body text-[16px] text-text-secondary leading-relaxed">
              You possess exclusive administrative rights to call the withdrawal function. When you do, the entire balance is transferred to your personal wallet instantly.
            </p>
          </div>
        </div>

        {/* Featured Split Section */}
        <div className="border-b border-border-subtle py-16 grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-16 reveal">
          
          {/* Left: Huge Graphic + Text */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="w-full aspect-[16/9] bg-charcoal relative overflow-hidden mb-8 flex items-end p-8 sm:p-12">
              {/* Background Grid simulating the screenshot */}
              <div className="absolute inset-0 grid grid-cols-[repeat(16,1fr)] grid-rows-[repeat(9,1fr)] opacity-[0.4]">
                 {Array.from({length: 144}).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-[#3d3c37] flex items-center justify-center font-mono text-[14px] text-stone">
                      {Math.floor(Math.random() * 9)}
                    </div>
                 ))}
              </div>
              {/* Yellow Highlight Bar */}
              <div className="absolute top-0 bottom-0 left-[25%] w-[6.25%] bg-[#c5b358]/80 mix-blend-hard-light"></div>
              
              <h2 className="relative z-10 font-display font-medium text-[36px] sm:text-[48px] lg:text-[64px] leading-[1] tracking-tight text-white max-w-[90%] drop-shadow-md">
                Absolute programmatic certainty.
              </h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
              <h3 className="font-display font-medium text-[32px] sm:text-[40px] leading-[1.1] tracking-tight text-charcoal max-w-[480px]">
                Immutable Logic: Webhooks are a single point of failure
              </h3>
              <div className="flex flex-col md:w-[320px] shrink-0">
                <span className="font-mono text-[12px] text-text-secondary uppercase tracking-widest mb-3">Architecture · May 7, 2026</span>
                <p className="font-body text-[16px] text-text-secondary leading-relaxed">
                  Unlike traditional gateways that rely on centralized databases and fragile HTTP webhooks, VREN uses immutable smart contracts to guarantee access and settlement mathematically.
                </p>
              </div>
            </div>
          </div>

          {/* Right: List of Updates */}
          <div className="lg:col-span-4 flex flex-col">
            {[
              {
                tag: "Integration · May 8, 2026",
                title: "Client-side Flow",
                desc: "The React SDK handles wallet connection, network switching, and transaction signing out of the box."
              },
              {
                tag: "Security · Apr 24, 2026",
                title: "Reentrancy Protection",
                desc: "Our contracts employ OpenZeppelin's ReentrancyGuard to prevent recursive withdrawal attacks."
              },
              {
                tag: "Network · Mar 18, 2026",
                title: "Cross-chain Compatibility",
                desc: "Deploy the exact same compiled bytecode to Polygon, Arbitrum, Optimism, or Ethereum Mainnet."
              },
              {
                tag: "Frontend · Dec 18, 2025",
                title: "Optimistic Updates",
                desc: "The UI instantly reflects subscription status while waiting for block confirmations using Wagmi."
              }
            ].map((item, idx, arr) => (
              <div key={idx} className={`pb-8 ${idx !== arr.length - 1 ? 'border-b border-border-subtle mb-8' : ''}`}>
                <span className="font-mono text-[12px] text-text-secondary uppercase tracking-widest mb-3 block">{item.tag}</span>
                <h4 className="font-display font-medium text-[24px] leading-[1.2] text-charcoal mb-3">{item.title}</h4>
                <p className="font-body text-[16px] text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Technical Specs Table Section */}
        <div className="mt-20 reveal">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-display font-medium text-[40px] leading-[1.1] tracking-tight text-charcoal">Technical Specs</h2>
            
            {/* Search Box */}
            <div className="relative w-full max-w-[320px] hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full bg-white border border-border-subtle rounded-md py-2.5 pl-12 pr-4 font-ui text-[14px] text-charcoal placeholder:text-stone focus:outline-none focus:border-terracotta transition-colors shadow-sm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16">
            
            {/* Left: Table */}
            <div className="lg:col-span-8 flex flex-col">
              {/* Table Header */}
              <div className="grid grid-cols-12 pb-4 border-b border-charcoal/20 font-ui text-[11px] text-text-secondary uppercase tracking-widest font-semibold">
                <div className="col-span-4 md:col-span-3">Module</div>
                <div className="col-span-8 md:col-span-3 hidden md:block">Type</div>
                <div className="col-span-8 md:col-span-6">Description</div>
              </div>

              {/* Table Rows */}
              <div className="flex flex-col">
                {[
                  { d: "VrenSubscription", c: "Solidity", t: "Core ERC-1155 token contract with tiered subscription logic" },
                  { d: "VrenRegistry", c: "Solidity", t: "Factory contract for tracking individual builder deployments" },
                  { d: "SDK Core", c: "TypeScript", t: "Client library for gating routes and validating signatures" },
                  { d: "useGate", c: "React Hook", t: "Declarative UI component for conditionally rendering premium content" },
                  { d: "Wagmi Config", c: "Configuration", t: "WalletConnect and injected provider bindings" },
                  { d: "ethers.js", c: "Dependency", t: "Low-level JSON-RPC communication layer" },
                  { d: "Next.js", c: "Framework", t: "Server-side rendering and API route integration" },
                  { d: "Turborepo", c: "Architecture", t: "Monorepo build system for the packages and web app" },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-12 py-5 border-b border-border-subtle hover:bg-white transition-colors items-center cursor-pointer group">
                    <div className="col-span-4 md:col-span-3 font-mono text-[13px] text-text-secondary">{row.d}</div>
                    <div className="col-span-8 md:col-span-3 hidden md:block font-body text-[14px] text-text-secondary">{row.c}</div>
                    <div className="col-span-8 md:col-span-6 font-body text-[15px] text-charcoal group-hover:text-terracotta transition-colors pr-4">{row.t}</div>
                  </div>
                ))}
              </div>
              
              <button className="w-full py-4 mt-8 bg-transparent border border-border-subtle rounded-[4px] font-ui text-[14px] font-medium text-text-secondary hover:text-charcoal hover:bg-white transition-all shadow-sm flex justify-center items-center gap-2">
                See more <span>↓</span>
              </button>
            </div>

            {/* Right: Graphic */}
            <div className="lg:col-span-4 mt-12 lg:mt-0 flex flex-col">
              <div className="w-full aspect-[4/3] lg:aspect-square bg-sky rounded-[8px] flex items-center justify-center p-8 shadow-inner relative overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-[60%] h-[60%] text-white drop-shadow-md relative z-10">
                  {/* Hexagon/Block geometry */}
                  <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="transparent" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
                  <polygon points="50,10 85,30 50,50 15,30" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <polygon points="50,50 85,30 85,70 50,90" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <polygon points="15,70 50,90 50,50 15,30" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  
                  {/* Center Node */}
                  <circle cx="50" cy="50" r="4" fill="white"/>
                </svg>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
