"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Search } from "lucide-react";

export default function AboutPage() {
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
              About
            </h1>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-end pt-4">
            <p className="font-body text-[22px] lg:text-[28px] leading-[1.4] text-charcoal mb-8 text-balance">
              VREN builds borderless payment infrastructure for the internet economy — so that developers anywhere can capture the value they create without seeking permission from traditional financial gatekeepers.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 items-center">
              <span className="font-ui text-[14px] font-semibold text-charcoal">Core principles:</span>
              <a href="#" className="font-ui text-[14px] text-text-secondary hover:text-charcoal underline underline-offset-4 decoration-border-subtle hover:decoration-charcoal transition-all">Autonomy</a>
              <a href="#" className="font-ui text-[14px] text-text-secondary hover:text-charcoal underline underline-offset-4 decoration-border-subtle hover:decoration-charcoal transition-all">Borderless</a>
              <a href="#" className="font-ui text-[14px] text-text-secondary hover:text-charcoal underline underline-offset-4 decoration-border-subtle hover:decoration-charcoal transition-all">Cryptography</a>
              <a href="#" className="font-ui text-[14px] text-text-secondary hover:text-charcoal underline underline-offset-4 decoration-border-subtle hover:decoration-charcoal transition-all">Smart Contracts</a>
            </div>
          </div>
        </div>

        {/* 4 Columns Principles Grid */}
        <div className="border-t border-b border-border-subtle py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 reveal">
          <div className="flex flex-col">
            <h3 className="font-display font-medium text-[22px] text-charcoal mb-4">Autonomy</h3>
            <p className="font-body text-[16px] text-text-secondary leading-relaxed">
              The mission of the Autonomy protocol is to eliminate rolling reserves, arbitrary bans, and manual payout reviews, ensuring builders have sovereign control over their revenue.
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-display font-medium text-[22px] text-charcoal mb-4">Borderless</h3>
            <p className="font-body text-[16px] text-text-secondary leading-relaxed">
              We work to understand the geographical restrictions of legacy finance and develop smart contract primitives that treat all internet citizens equally.
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-display font-medium text-[22px] text-charcoal mb-4">Cryptography</h3>
            <p className="font-body text-[16px] text-text-secondary leading-relaxed">
              Working closely with security auditors, our Cryptography team explores how zero-knowledge proofs and asymmetric encryption can secure decentralized subscriptions.
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-display font-medium text-[22px] text-charcoal mb-4">Smart Contracts</h3>
            <p className="font-body text-[16px] text-text-secondary leading-relaxed">
              The Smart Contracts division analyzes the implications of frontier decentralized applications for scalability, gas optimization, and cross-chain composability.
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
              <div className="absolute top-0 bottom-0 left-[37.5%] w-[6.25%] bg-[#c5b358]/80 mix-blend-hard-light"></div>
              
              <h2 className="relative z-10 font-display font-medium text-[36px] sm:text-[48px] lg:text-[64px] leading-[1] tracking-tight text-white max-w-[90%] drop-shadow-md">
                What if we could rewrite the internet's financial rails?
              </h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
              <h3 className="font-display font-medium text-[32px] sm:text-[40px] leading-[1.1] tracking-tight text-charcoal max-w-[480px]">
                Protocol v1: Turning code into sovereign companies
              </h3>
              <div className="flex flex-col md:w-[320px] shrink-0">
                <span className="font-mono text-[12px] text-text-secondary uppercase tracking-widest mb-3">Autonomy · May 7, 2026</span>
                <p className="font-body text-[16px] text-text-secondary leading-relaxed">
                  Smart contracts talk in bytecode but think in pure logic. In this paper, we detail how VREN translates legal subscription terms into immutable on-chain agreements.
                </p>
              </div>
            </div>
          </div>

          {/* Right: List of Updates */}
          <div className="lg:col-span-4 flex flex-col">
            {[
              {
                tag: "Borderless · May 8, 2026",
                title: "Teaching the Protocol why",
                desc: "New research on how we've reduced gas fees and misalignment across L2 networks."
              },
              {
                tag: "Smart Contracts · Apr 24, 2026",
                title: "Project Decentral",
                desc: "We created a marketplace for independent builders across the globe, with one big twist: everything is settled in stablecoins."
              },
              {
                tag: "Cryptography · Mar 18, 2026",
                title: "What 81,000 builders want",
                desc: "We invited developers to share how they use Web3 infrastructure. Here is the largest qualitative study of its kind."
              },
              {
                tag: "Autonomy · Dec 18, 2025",
                title: "Project Vendor: Phase two",
                desc: "In June, we revealed that we'd set up a small experiment: an AI shopkeeper running complex real-world tasks on-chain."
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

        {/* Publications Table Section */}
        <div className="mt-20 reveal">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-display font-medium text-[40px] leading-[1.1] tracking-tight text-charcoal">Publications</h2>
            
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
                <div className="col-span-4 md:col-span-3">Date</div>
                <div className="col-span-8 md:col-span-3 hidden md:block">Category</div>
                <div className="col-span-8 md:col-span-6">Title</div>
              </div>

              {/* Table Rows */}
              <div className="flex flex-col">
                {[
                  { d: "Jun 8, 2026", c: "Smart Contracts", t: "Paving the way for agents in blockchain" },
                  { d: "Jun 5, 2026", c: "Smart Contracts", t: "Making the Protocol a chemist" },
                  { d: "Jun 3, 2026", c: "Cryptography", t: "What we learned mapping a year's worth of threats" },
                  { d: "May 27, 2026", c: "Autonomy", t: "Coding agents in the social sciences" },
                  { d: "May 22, 2026", c: "Announcements", t: "Project Classwing: An initial update" },
                  { d: "May 14, 2026", c: "Cryptography", t: "2028: Two scenarios for global crypto leadership" },
                  { d: "May 8, 2026", c: "Borderless", t: "Teaching the Protocol why" },
                  { d: "May 7, 2026", c: "Autonomy", t: "Natural Language Autoencoders: Turning thoughts into text" },
                  { d: "May 7, 2026", c: "Borderless", t: "Donating our open-source alignment tool" },
                  { d: "May 7, 2026", c: "Cryptography", t: "Focus areas for The VREN Institute" },
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
              <div className="w-full aspect-[4/3] lg:aspect-square bg-sage rounded-[8px] flex items-center justify-center p-8 shadow-inner relative overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-[60%] h-[60%] text-white drop-shadow-md relative z-10">
                  {/* Nodes */}
                  <circle cx="30" cy="30" r="4.5" fill="currentColor"/>
                  <circle cx="70" cy="20" r="4.5" fill="currentColor"/>
                  <circle cx="50" cy="50" r="5.5" fill="currentColor"/>
                  <circle cx="20" cy="70" r="4.5" fill="currentColor"/>
                  <circle cx="60" cy="80" r="4.5" fill="currentColor"/>
                  
                  {/* Connections */}
                  <line x1="30" y1="30" x2="50" y2="50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="70" y1="20" x2="50" y2="50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="20" y1="70" x2="50" y2="50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="60" y1="80" x2="50" y2="50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>

                  {/* Cursor Arrow */}
                  <path d="M45,55 L85,65 L70,70 L85,95 L75,100 L60,75 L50,85 Z" fill="transparent" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                  <path d="M45,55 L85,65 L70,70 L85,95 L75,100 L60,75 L50,85 Z" fill="currentColor" opacity="0.2"/>
                </svg>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
