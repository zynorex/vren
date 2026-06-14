"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ChangelogPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".reveal",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.1 }
    );
  }, { scope: containerRef });

  const changelogData = [
    {
      date: "Sunday, June 14, 2026",
      version: "v0.2.0",
      updates: [
        {
          category: "Smart Contracts",
          title: "Enterprise-grade Solidity Overhaul",
          description: "Completely rewrote ArthaSubscription.sol and ArthaRegistry.sol. Implemented SafeERC20, OpenZeppelin Pausable functionality, and dynamic cross-contract payout verification. Configured Hardhat TSConfig to target the cancun EVM upgrade to resolve opcode compilation issues."
        },
        {
          category: "Frontend Architecture",
          title: "Standardized 12-Column Editorial Grid",
          description: "Established the permanent Light Theme (Parchment/Charcoal) structural grid for informational pages. Rebuilt the About and How It Works pages from scratch using this exact mathematical ratio, including bespoke SVG graphics and GSAP entrance animations."
        },
        {
          category: "UI / UX",
          title: "Homepage Code Integration Redesign",
          description: "Polished the 'Integration in 3 lines' section on the homepage to achieve a high-fidelity aesthetic. Added a custom macOS terminal UI with strict syntax highlighting matching the core brand colors (Terracotta, Sage, Warm Gold)."
        }
      ]
    },
    {
      date: "Saturday, June 13, 2026",
      version: "v0.1.0",
      updates: [
        {
          category: "Infrastructure",
          title: "Turborepo Monorepo Migration",
          description: "Transitioned the ARTHA platform into a professional-grade pnpm workspace monorepo. Established clear boundaries between apps/web (Next.js), packages/contracts (Hardhat), and packages/sdk (TypeScript wrapper)."
        },
        {
          category: "Design System",
          title: "Initialization of Design Bible",
          description: "Tokenized the 'Built in India' geometric design specifications into globals.css. Integrated Space Grotesk (Display) and Inter (Body) fonts. Built the custom Torana gateway preloader to enforce the brand ethos."
        },
        {
          category: "Dependencies",
          title: "Workspace Dependency Resolution",
          description: "Resolved critical build errors by correctly hoisting and linking shared packages like lucide-react across the pnpm workspace."
        }
      ]
    }
  ];

  return (
    <div ref={containerRef} className="bg-parchment text-charcoal font-body min-h-screen pt-32 pb-32">
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-24 reveal">
          <div className="lg:col-span-5">
            <h1 className="font-display font-medium text-[56px] lg:text-[72px] leading-[1.1] tracking-tight text-charcoal">
              Changelog
            </h1>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-end pt-4">
            <p className="font-body text-[22px] lg:text-[28px] leading-[1.4] text-charcoal mb-8 text-balance">
              A precise, chronological record of technical updates, architectural shifts, and design system evolutions across the ARTHA monorepo.
            </p>
          </div>
        </div>

        {/* Timeline Log */}
        <div className="border-t border-border-subtle pt-16 reveal">
          {changelogData.map((release, index) => (
            <div key={index} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-24 last:mb-0">
              
              {/* Left Column: Date & Version */}
              <div className="lg:col-span-3 flex flex-col pt-2">
                <span className="font-mono text-[13px] text-text-secondary uppercase tracking-widest mb-3">
                  {release.date}
                </span>
                <span className="font-display text-[24px] font-medium text-charcoal">
                  Release {release.version}
                </span>
              </div>
              
              {/* Right Column: Updates List */}
              <div className="lg:col-span-9 flex flex-col gap-12 lg:border-l lg:border-border-subtle lg:pl-16">
                {release.updates.map((update, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-4 h-[1px] bg-terracotta"></span>
                      <span className="font-ui text-[11px] font-bold text-terracotta tracking-[0.15em] uppercase">
                        {update.category}
                      </span>
                    </div>
                    <h3 className="font-display text-[28px] md:text-[32px] font-medium leading-[1.2] text-charcoal mb-4 tracking-tight">
                      {update.title}
                    </h3>
                    <p className="font-body text-[17px] md:text-[19px] leading-[1.6] text-[#555555] max-w-3xl">
                      {update.description}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
