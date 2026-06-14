"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

const TARGET_DATE = new Date("2026-09-19T00:00:00Z").getTime();

function getTimeLeft() {
  const now = Date.now();
  const distance = Math.max(0, TARGET_DATE - now);
  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, "0"),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, "0"),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0"),
    seconds: Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, "0"),
  };
}

export default function DevelopmentPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.fromTo(".anim-logo",
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }, 0.2)
      .fromTo(".anim-badge",
      { y: 8, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }, 0.5)
      .fromTo(".anim-title",
      { y: 40, opacity: 0, clipPath: "inset(100% 0 0 0)" },
      { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 1.2 }, 0.6)
      .fromTo(".anim-sub",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9 }, 0.9)
      .fromTo(".anim-divider",
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.8, transformOrigin: "left center" }, 1.1)
      .fromTo(".anim-countdown",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.08 }, 1.2)
      .fromTo(".anim-footer",
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }, 1.6);

    gsap.to(".spin-slow", {
      rotation: 360, duration: 25, repeat: -1, ease: "linear"
    });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-[#111110] text-[#F5F0E8] overflow-hidden flex flex-col items-center justify-between"
      style={{ padding: "clamp(24px, 4vh, 48px) clamp(24px, 5vw, 80px)" }}
    >
      {/* ── Ambient glow ─────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(196,90,63,0.08) 0%, transparent 70%)" }} />
      </div>

      {/* ── TOP: Logo + badge ─────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="anim-logo">
          <Image
            src="/transparentLogo.png"
            alt="VREN"
            width={52}
            height={52}
            className="object-contain"
          />
        </div>
        <div className="anim-badge flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
          <span className="font-ui text-[11px] tracking-[0.3em] uppercase text-[#888882]">
            Protocol Initializing
          </span>
        </div>
      </div>

      {/* ── MIDDLE: Hero text + countdown ────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-5xl gap-0">

        {/* Wordmark */}
        <h1
          className="anim-title font-display font-medium tracking-tighter text-[#F5F0E8] leading-none"
          style={{ fontSize: "clamp(72px, 16vw, 180px)" }}
        >
          VREN
        </h1>

        {/* Tagline */}
        <p
          className="anim-sub font-body text-[#888882] font-light text-balance mt-3"
          style={{ fontSize: "clamp(14px, 1.8vw, 20px)", maxWidth: "560px" }}
        >
          The borderless payment infrastructure for the internet economy goes live on{" "}
          <span className="text-terracotta font-normal">September&nbsp;19,&nbsp;2026</span>.
        </p>

        {/* Divider */}
        <div className="anim-divider w-full max-w-2xl h-px bg-[#2a2a28] mt-8 mb-8" />

        {/* Countdown */}
        <div className="grid grid-cols-4 w-full max-w-2xl">
          {([
            { value: timeLeft.days, label: "Days" },
            { value: timeLeft.hours, label: "Hours" },
            { value: timeLeft.minutes, label: "Minutes" },
            { value: timeLeft.seconds, label: "Seconds" },
          ] as const).map(({ value, label }, i) => (
            <div key={label} className="anim-countdown flex flex-col items-center relative">
              {i > 0 && (
                <span className="absolute left-0 top-1/3 -translate-y-1/2 text-[#2a2a28] font-display font-light"
                  style={{ fontSize: "clamp(24px, 5vw, 60px)" }}>:</span>
              )}
              <span
                className="font-display font-medium leading-none tracking-tighter tabular-nums text-[#F5F0E8]"
                style={{ fontSize: "clamp(40px, 9vw, 110px)" }}
              >
                {value}
              </span>
              <span
                className="font-ui uppercase tracking-[0.18em] text-[#555550] mt-1 font-semibold"
                style={{ fontSize: "clamp(9px, 0.9vw, 12px)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM: CTA + spin ────────────────────────────────────────── */}
      <div className="anim-footer relative z-10 flex flex-col items-center gap-5">
        <button className="group relative flex items-center gap-2.5 px-7 py-3 border border-[#2e2e2c] rounded-full overflow-hidden hover:border-[#F5F0E8]/30 transition-colors duration-500">
          <div className="absolute inset-0 bg-[#F5F0E8] translate-y-[102%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
          <span className="relative z-10 font-ui text-[12px] tracking-[0.15em] uppercase text-[#888882] group-hover:text-[#111110] transition-colors duration-300">
            Read Developer Docs
          </span>
          <svg className="relative z-10 text-[#888882] group-hover:text-[#111110] transition-colors duration-300" width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M1 11L11 1M11 1H3.5M11 1V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <svg className="spin-slow text-terracotta opacity-25" width="32" height="32" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1" />
          <path d="M20 0V40M0 20H40" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.6" />
        </svg>
      </div>
    </div>
  );
}
