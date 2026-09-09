"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const COLORS = {
  terracotta: "#d97757",
  gold: "#c9a07c",
  sage: "#788c5d",
  charcoal: "#191918",
};

const NODE_COUNT = 12;

function randomHex(): string {
  const chars = "0123456789abcdef";
  let hex = "0x";
  for (let i = 0; i < 6; i++) hex += chars[Math.floor(Math.random() * 16)];
  return hex;
}

export function PageLoader() {
  const container = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const pulseRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const orbitalRef = useRef<HTMLDivElement>(null);
  const [hexText, setHexText] = useState("0x00000000");

  useEffect(() => {
    const interval = setInterval(() => setHexText(randomHex()), 150);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();

    gsap.set([logoRef.current, pulseRef.current], { autoAlpha: 1 });
    gsap.set(lettersRef.current, { y: 30, opacity: 0, rotateX: 45 });
    gsap.set(nodesRef.current, { scale: 0, opacity: 0 });
    gsap.set(barRef.current, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(statusRef.current, { opacity: 0, y: 8 });
    gsap.set(orbitalRef.current, { rotation: 0, opacity: 0, scale: 0.7 });

    // Pulse breathe
    tl.fromTo(pulseRef.current, {
      scale: 0,
      opacity: 0,
    }, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
    });

    // Orbital ring
    tl.to(orbitalRef.current, {
      opacity: 0.6,
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    }, 0.1);

    // Constellation nodes
    nodesRef.current.forEach((el, i) => {
      if (!el) return;
      tl.to(el, {
        scale: 1,
        opacity: 0.6,
        duration: 0.3,
        delay: i * 0.03,
        ease: "back.out(2)",
      }, 0.2);
    });

    // Logo scale in
    tl.fromTo(logoRef.current, {
      scale: 0.6,
      opacity: 0,
    }, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.5)",
    }, 0.1);

    // Letters stagger
    tl.to(lettersRef.current, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 0.5,
      stagger: 0.07,
      ease: "back.out(2)",
    }, 0.3);

    // Progress bar
    tl.to(barRef.current, {
      scaleX: 1,
      duration: 1.5,
      ease: "power2.inOut",
    }, 0.5);

    // Status text
    tl.to(statusRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out",
    }, 0.5);

    // Continuous orbital spin
    gsap.to(orbitalRef.current, {
      rotation: 360,
      duration: 6,
      repeat: -1,
      ease: "none",
    });

    // Continuous pulse
    gsap.to(pulseRef.current, {
      scale: 1.2,
      opacity: 0.5,
      duration: 1.2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: 0.6,
    });

    // Status text pulse
    tl.to(statusRef.current, {
      opacity: 0.4,
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    }, "+=0.2");

  }, { scope: container });

  const nodePositions = Array.from({ length: NODE_COUNT }, (_, i) => {
    const angle = (Math.PI * 2 * i) / NODE_COUNT;
    const r = 72;
    return {
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      size: i % 3 === 0 ? 3 : 1.5,
    };
  });

  return (
    <div
      ref={container}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-charcoal text-parchment"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,119,87,0.05)_0%,transparent_60%)] pointer-events-none" />

      <div className="flex flex-col items-center relative z-10">

        {/* Center logo area */}
        <div className="relative mb-6">
          {/* Center pulse */}
          <div
            ref={pulseRef}
            className="absolute inset-0 m-auto w-10 h-10 rounded-full opacity-0 invisible"
            style={{
              background: `radial-gradient(circle, ${COLORS.terracotta}30, transparent 70%)`,
              filter: "blur(8px)",
            }}
          />

          {/* Orbital ring */}
          <div ref={orbitalRef} className="absolute -inset-8 pointer-events-none">
            <svg className="w-full h-full" viewBox="-80 -80 160 160">
              <circle cx="0" cy="0" r="72" fill="none" stroke={COLORS.terracotta} strokeWidth="0.4" strokeDasharray="3 8" opacity="0.3" />
            </svg>
            {/* Constellation nodes */}
            {nodePositions.map((pt, i) => (
              <div
                key={i}
                ref={(el) => { nodesRef.current[i] = el; }}
                className="absolute rounded-full"
                style={{
                  width: pt.size,
                  height: pt.size,
                  backgroundColor: i % 3 === 0 ? COLORS.terracotta : COLORS.gold,
                  left: `calc(50% + ${pt.x}px)`,
                  top: `calc(50% + ${pt.y}px)`,
                  transform: "translate(-50%, -50%)",
                  boxShadow: i % 3 === 0 ? `0 0 6px ${COLORS.terracotta}50` : "none",
                }}
              />
            ))}
          </div>

          {/* Logo */}
          <div ref={logoRef} className="relative w-14 h-14 opacity-0 invisible">
            <svg viewBox="0 0 60 60" className="w-full h-full">
              {/* Geometric V mark as an SVG — simpler than Image for page loader */}
              <g opacity="0.9">
                <polygon
                  points="30,6 10,50 22,50 30,34 38,50 50,50"
                  fill="none"
                  stroke={COLORS.terracotta}
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <circle cx="30" cy="30" r="2" fill={COLORS.terracotta} opacity="0.6" />
              </g>
            </svg>
          </div>
        </div>

        {/* Letters */}
        <div className="overflow-hidden pb-1 mb-5">
          <div className="flex" style={{ perspective: "400px" }}>
            {"VREN".split("").map((char, i) => (
              <span
                key={i}
                ref={(el) => { lettersRef.current[i] = el; }}
                className="inline-block font-display font-medium text-white tracking-[0.2em]"
                style={{
                  fontSize: "clamp(28px, 4vw, 40px)",
                  textShadow: `0 0 20px ${COLORS.terracotta}30`,
                  transformStyle: "preserve-3d",
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-[180px] h-[1px] bg-white/[0.06] overflow-hidden mb-4">
          <div
            ref={barRef}
            className="h-full w-full"
            style={{
              background: `linear-gradient(90deg, ${COLORS.terracotta}, ${COLORS.gold})`,
            }}
          />
        </div>

        {/* Status */}
        <p ref={statusRef} className="font-mono text-[9px] uppercase tracking-[0.25em] text-dim flex items-center gap-2">
          <span className="text-terracotta/40">{hexText}</span>
          <span>Loading…</span>
        </p>
      </div>
    </div>
  );
}
