"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Animated subscription card that simulates the VREN payment flow.
 * Cycles through: Idle → Processing → Minted → Reset
 */
export function SubscriptionCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "processing" | "minted">("idle");

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => {
        if (p === "idle") return "processing";
        if (p === "processing") return "minted";
        return "idle";
      });
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Subtle float animation
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      y: -6, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut",
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className="hero-card relative w-full max-w-[340px] mx-auto lg:mx-0 rounded-2xl border border-border-subtle bg-white shadow-[0_24px_64px_rgba(25,25,24,0.10)] overflow-hidden opacity-0"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border-subtle bg-parchment/60">
        <div className="flex items-center justify-between mb-1">
          <span className="font-display text-[18px] font-medium text-charcoal tracking-tight">Pro Plan</span>
          <span className="font-mono text-[10px] text-text-muted bg-cream px-2 py-0.5 rounded-full border border-border-subtle">
            POLYGON
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-display text-[36px] font-medium text-charcoal leading-none tracking-tight">$19</span>
          <span className="font-ui text-[13px] text-text-muted">/month</span>
        </div>
        <p className="font-ui text-[12px] text-text-secondary mt-2">Billed in USDC on Polygon PoS</p>
      </div>

      {/* Features */}
      <div className="px-6 py-4 space-y-2.5">
        {["Unlimited API calls", "Premium dashboard", "Priority support", "Custom webhooks"].map((f) => (
          <div key={f} className="flex items-center gap-2.5">
            <svg className="w-3.5 h-3.5 text-sage shrink-0" viewBox="0 0 16 16" fill="none">
              <path d="M2 8.5L6 12.5L14 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-ui text-[13px] text-text-secondary">{f}</span>
          </div>
        ))}
      </div>

      {/* CTA Button — animated phases */}
      <div className="px-6 pb-6 pt-2">
        <button
          className={`w-full py-3 rounded-lg font-ui text-[14px] font-semibold transition-all duration-500 flex items-center justify-center gap-2 ${
            phase === "idle"
              ? "bg-charcoal text-parchment hover:bg-[#2b2a27]"
              : phase === "processing"
              ? "bg-warm-gold/20 text-warm-gold border border-warm-gold/30"
              : "bg-sage/15 text-sage border border-sage/30"
          }`}
        >
          {phase === "idle" && (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Pay with USDC
            </>
          )}
          {phase === "processing" && (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Confirming on Polygon...
            </>
          )}
          {phase === "minted" && (
            <>
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M2 8.5L6 12.5L14 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              NFT Minted — Access Granted
            </>
          )}
        </button>
      </div>

      {/* Bottom bar */}
      <div className="h-1 w-full overflow-hidden">
        <div
          className={`h-full transition-all duration-[2000ms] ease-linear ${
            phase === "idle" ? "w-0 bg-charcoal" :
            phase === "processing" ? "w-3/4 bg-warm-gold" :
            "w-full bg-sage"
          }`}
        />
      </div>
    </div>
  );
}
