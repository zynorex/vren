"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

export default function ChangelogPage() {
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
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col items-center">
        
        {/* Header Section */}
        <div className="text-center mb-16 reveal">
          <span className="font-ui text-xs tracking-widest uppercase text-terracotta font-semibold mb-6 block">Updates</span>
          <h1 className="font-display font-medium text-[56px] lg:text-[72px] leading-[1.1] tracking-tight text-charcoal mb-6">
            Changelog
          </h1>
          <p className="font-body text-[20px] lg:text-[24px] text-text-secondary max-w-2xl mx-auto">
            The latest updates and architectural improvements to the VREN protocol.
          </p>
        </div>

        {/* Single Changelog Card */}
        <div className="w-full max-w-[900px] bg-white border border-border-subtle rounded-2xl shadow-[0_8px_40px_rgba(25,25,24,0.04)] overflow-hidden reveal">
          <div className="border-b border-border-subtle bg-bg-surface p-8 lg:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="font-ui text-[13px] text-terracotta tracking-[0.15em] uppercase font-bold mb-2">
                Latest Release
              </span>
              <h2 className="font-display text-[32px] lg:text-[40px] leading-tight text-charcoal tracking-tight">
                Protocol v0.2.0
              </h2>
            </div>
            <div className="font-mono text-[14px] text-text-secondary bg-white px-4 py-2 rounded-md border border-border-subtle shadow-sm w-fit h-fit">
              June 14, 2026
            </div>
          </div>
          
          <div className="p-8 lg:p-12 flex flex-col gap-8 bg-white">
            <p className="font-body text-[19px] leading-[1.6] text-text-secondary">
              This release focuses on establishing the enterprise-grade foundation for both the smart contract layer and the frontend architecture. We have completely rewritten the core Solidity protocols to support SafeERC20 and dynamic registry connections, while establishing a permanent mathematical layout grid for the UI.
            </p>
            
            <div className="flex flex-col gap-6">
              <h3 className="font-display text-[24px] text-charcoal border-b border-border-subtle pb-4">
                Key Improvements
              </h3>
              
              <ul className="flex flex-col gap-5">
                <li className="flex gap-4">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-terracotta shrink-0"></div>
                  <div className="flex flex-col">
                    <span className="font-ui font-semibold text-charcoal text-[16px] mb-1">Smart Contract Overhaul</span>
                    <span className="font-body text-[16px] text-text-secondary leading-relaxed">Integrated OpenZeppelin SafeERC20, Pausable architecture, and dynamic payout routing through VrenRegistry. Hardhat compiler updated to target the cancun EVM upgrade.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-terracotta shrink-0"></div>
                  <div className="flex flex-col">
                    <span className="font-ui font-semibold text-charcoal text-[16px] mb-1">Standardized Editorial Grid</span>
                    <span className="font-body text-[16px] text-text-secondary leading-relaxed">Established the permanent Light Theme (Parchment/Charcoal) mathematical layout grid. Both /about and /how-it-works now utilize this architecture for a premium reading experience.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-terracotta shrink-0"></div>
                  <div className="flex flex-col">
                    <span className="font-ui font-semibold text-charcoal text-[16px] mb-1">Terminal UI Redesign</span>
                    <span className="font-body text-[16px] text-text-secondary leading-relaxed">The homepage integration section has been polished with a custom macOS terminal UI, featuring strict syntax highlighting aligned with core brand colors.</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-8 border-t border-border-subtle">
              <Link href="/how-it-works" className="font-ui text-[15px] font-medium text-charcoal inline-flex items-center gap-2 hover:text-terracotta transition-colors group">
                View Protocol Architecture
                <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
