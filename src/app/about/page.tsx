"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hero Entrance
    gsap.fromTo(
      ".hero-text",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, stagger: 0.15, ease: "power4.out", delay: 0.2 }
    );

    // Vertical Scroll Reveals
    const revealElements = gsap.utils.toArray(".reveal-section");
    revealElements.forEach((el: any) => {
      gsap.fromTo(
        el,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%", // Triggers when the top of the element hits 85% of the viewport height
            toggleActions: "play none none none", // Only play once
          },
        }
      );
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-parchment text-charcoal font-body overflow-x-hidden min-h-screen">
      
      {/* HERO SECTION */}
      <section className="min-h-[80vh] w-full max-w-full overflow-hidden flex flex-col items-center justify-center px-6 lg:px-12 pt-32">
        <div className="flex items-center gap-3 mb-12 opacity-0 hero-text">
          <span className="w-8 h-[1px] bg-terracotta"></span>
          <span className="font-ui text-xs tracking-[0.2em] uppercase text-terracotta font-semibold">
            Our Mission
          </span>
          <span className="w-8 h-[1px] bg-terracotta"></span>
        </div>
        
        <h1 className="font-display font-medium text-[50px] md:text-[80px] lg:text-[120px] leading-[1.05] tracking-tight text-center max-w-5xl mb-8 opacity-0 hero-text break-words w-full">
          Software is borderless.
        </h1>
        <h1 className="font-body italic text-[40px] md:text-[70px] lg:text-[100px] leading-[1] text-terracotta text-center opacity-0 hero-text break-words w-full">
          Now, the revenue is too.
        </h1>
      </section>

      {/* THE PROBLEM SECTION */}
      <section className="w-full max-w-[1200px] mx-auto px-6 lg:px-12 py-32 border-t border-border-subtle reveal-section opacity-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-5">
            <h2 className="font-display text-[40px] md:text-[60px] leading-[1.1] tracking-tight">
              The Geographic Lottery
            </h2>
          </div>
          <div className="lg:col-span-7 flex flex-col gap-8 text-[20px] lg:text-[24px] text-text-secondary leading-relaxed">
            <p>
              We observed a structural flaw in the internet economy: your ability to capture the value you create is entirely dependent on where you were born. A developer in San Francisco and a developer in Lagos can write the exact same code, yet over 60 countries are systematically excluded by traditional banking layers.
            </p>
            <p>
              Traditional payment gateways like Stripe are bound by archaic banking regulations, meaning millions of developers are arbitrarily blocked from monetizing their work.
            </p>
            <p className="text-terracotta italic font-medium">
              This is a failure of infrastructure, not talent.
            </p>
          </div>
        </div>
      </section>

      {/* THE PROTOCOL (VERTICAL TIMELINE) */}
      <section className="w-full bg-charcoal text-parchment py-32 mt-16">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="mb-24 reveal-section opacity-0">
            <span className="font-ui text-xs tracking-widest uppercase text-stone font-semibold mb-6 block">The Mechanism</span>
            <h2 className="font-display text-[40px] md:text-[80px] leading-[1] tracking-tight">
              Absolute Autonomy.
            </h2>
          </div>

          <div className="flex flex-col gap-12 lg:gap-0 border-l border-[#3d3c37] ml-4 lg:ml-8">
            
            {/* Step 1 */}
            <div className="relative pl-12 lg:pl-24 pb-24 lg:pb-32 reveal-section opacity-0">
              <div className="absolute top-0 -left-[17px] w-8 h-8 rounded-full bg-charcoal border-2 border-terracotta flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-terracotta"></div>
              </div>
              <span className="font-mono text-terracotta text-2xl mb-4 block">01</span>
              <h3 className="font-display text-[40px] md:text-[60px] leading-[1.1] mb-6">Deploy Protocol</h3>
              <p className="font-body text-[20px] md:text-[24px] text-stone leading-relaxed max-w-2xl">
                Initialize an isolated smart contract on the blockchain. This contract acts as your autonomous vault and access controller. No permission. No KYC.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative pl-12 lg:pl-24 pb-24 lg:pb-32 reveal-section opacity-0">
              <div className="absolute top-0 -left-[17px] w-8 h-8 rounded-full bg-charcoal border-2 border-terracotta flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-terracotta"></div>
              </div>
              <span className="font-mono text-terracotta text-2xl mb-4 block">02</span>
              <h3 className="font-display text-[40px] md:text-[60px] leading-[1.1] mb-6">The Minting Event</h3>
              <p className="font-body text-[20px] md:text-[24px] text-stone leading-relaxed max-w-2xl">
                Users interact with your frontend to purchase a time-bound ERC-1155 NFT. Funds are transferred into your smart contract vault instantly and securely.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative pl-12 lg:pl-24 reveal-section opacity-0">
              <div className="absolute top-0 -left-[17px] w-8 h-8 rounded-full bg-charcoal border-2 border-terracotta flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-terracotta"></div>
              </div>
              <span className="font-mono text-terracotta text-2xl mb-4 block">03</span>
              <h3 className="font-display text-[40px] md:text-[60px] leading-[1.1] mb-6">Autonomous Settlement</h3>
              <p className="font-body text-[20px] md:text-[24px] text-stone leading-relaxed max-w-2xl">
                Zero rolling reserves. Zero platform taxes. You possess the exclusive administrative rights to call the withdrawal function, shifting the liquidity instantly to your wallet.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER PUSH */}
      <section className="h-[40vh] w-full flex items-center justify-center bg-parchment reveal-section opacity-0">
        <h2 className="font-display text-[40px] lg:text-[60px] text-charcoal tracking-tight">Welcome to ARTHA.</h2>
      </section>

    </div>
  );
}
