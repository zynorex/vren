"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/* ───────────────────────────────────────────────────────────
   CONFIG
   ─────────────────────────────────────────────────────────── */
const PARTICLE_COUNT = 60;
const HEX_STREAM_COUNT = 14;
const RING_SEGMENTS = 36;

const COLORS = {
  terracotta: "#d97757",
  terracottaDark: "#c96442",
  gold: "#c9a07c",
  sage: "#788c5d",
  charcoal: "#191918",
  parchment: "#faf9f5",
  dim: "#6b6960",
};

/* ───────────────────────────────────────────────────────────
   UTILITIES — deterministic seed-based random for SSR safety
   ─────────────────────────────────────────────────────────── */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (Math.PI * 2 * i) / PARTICLE_COUNT;
    const r1 = seededRandom(i * 7 + 1);
    const r2 = seededRandom(i * 13 + 2);
    const r3 = seededRandom(i * 19 + 3);
    const r4 = seededRandom(i * 31 + 4);
    const r5 = seededRandom(i * 37 + 5);
    const radius = 120 + r1 * 180;
    return {
      id: i,
      finalX: Math.cos(angle) * radius,
      finalY: Math.sin(angle) * radius,
      size: 1.5 + r2 * 2.5,
      delay: r3 * 0.4,
      orbitRadius: 60 + r4 * 100,
      orbitSpeed: 0.3 + r5 * 0.7,
      color: r3 > 0.6 ? COLORS.terracotta : r4 > 0.5 ? COLORS.gold : COLORS.sage,
    };
  });
}

function generateRingPoints() {
  return Array.from({ length: RING_SEGMENTS }, (_, i) => {
    const angle = (Math.PI * 2 * i) / RING_SEGMENTS;
    const r = 140;
    return { x: Math.cos(angle) * r, y: Math.sin(angle) * r, angle };
  });
}

function deterministicHex(seed: number): string {
  const chars = "0123456789abcdef";
  let hex = "0x";
  for (let j = 0; j < 8; j++) hex += chars[Math.floor(seededRandom(seed * 100 + j) * 16)];
  return hex;
}

function randomHex(): string {
  const chars = "0123456789abcdef";
  let hex = "0x";
  for (let i = 0; i < 8; i++) hex += chars[Math.floor(Math.random() * 16)];
  return hex;
}

/* ───────────────────────────────────────────────────────────
   COMPONENT
   ─────────────────────────────────────────────────────────── */
export function Preloader() {
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasLayerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const ringDotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const logoRef = useRef<HTMLDivElement>(null);
  const logoGlowRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const taglineRef = useRef<HTMLDivElement>(null);
  const hexStreamsRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const shockwaveRef = useRef<HTMLDivElement>(null);
  const curtainTopRef = useRef<HTMLDivElement>(null);
  const curtainBottomRef = useRef<HTMLDivElement>(null);
  const orbitalRingRef = useRef<HTMLDivElement>(null);
  const centerPulseRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);

  // Deterministic data — safe for SSR
  const particles = useMemo(() => generateParticles(), []);
  const ringPoints = useMemo(() => generateRingPoints(), []);

  const setParticleRef = useCallback((el: HTMLDivElement | null, i: number) => {
    particlesRef.current[i] = el;
  }, []);
  const setRingDotRef = useCallback((el: HTMLDivElement | null, i: number) => {
    ringDotsRef.current[i] = el;
  }, []);
  const setLetterRef = useCallback((el: HTMLSpanElement | null, i: number) => {
    lettersRef.current[i] = el;
  }, []);
  const setHexRef = useCallback((el: HTMLDivElement | null, i: number) => {
    hexStreamsRef.current[i] = el;
  }, []);

  // Mount detection
  useEffect(() => { setMounted(true); }, []);

  // Hex stream content cycling (client-only)
  useEffect(() => {
    if (!mounted || done) return;
    const interval = setInterval(() => {
      hexStreamsRef.current.forEach((el) => {
        if (el) el.textContent = randomHex();
      });
    }, 120);
    return () => clearInterval(interval);
  }, [mounted, done]);

  // GSAP animations — only run after mount
  useGSAP(() => {
    if (!mounted) return;

    if (sessionStorage.getItem("vren_preloader_seen")) {
      setDone(true);
      return;
    }

    const master = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("vren_preloader_seen", "true");
        setDone(true);
      },
    });

    /* ── Initial sets ───────────────────────────── */
    gsap.set(particlesRef.current, { scale: 0, opacity: 0, x: 0, y: 0 });
    gsap.set(ringDotsRef.current, { scale: 0, opacity: 0 });
    gsap.set(logoRef.current, { scale: 0, opacity: 0, rotation: -180 });
    gsap.set(logoGlowRef.current, { scale: 0, opacity: 0 });
    gsap.set(lettersRef.current, { y: 80, opacity: 0, rotateX: 90 });
    gsap.set(taglineRef.current, { y: 20, opacity: 0, filter: "blur(8px)" });
    gsap.set(hexStreamsRef.current, { opacity: 0, y: 30 });
    gsap.set(progressTrackRef.current, { scaleX: 0, opacity: 0 });
    gsap.set(progressBarRef.current, { scaleX: 0 });
    gsap.set(progressTextRef.current, { opacity: 0 });
    gsap.set(shockwaveRef.current, { scale: 0, opacity: 0 });
    gsap.set(orbitalRingRef.current, { rotation: 0, opacity: 0, scale: 0.5 });
    gsap.set(centerPulseRef.current, { scale: 0, opacity: 0 });
    gsap.set(bloomRef.current, { scale: 0, opacity: 0 });
    gsap.set([curtainTopRef.current, curtainBottomRef.current], { yPercent: 0 });

    /* ═══════════════════════════════════════════════
       PHASE 1: THE VOID — Center pulse breathes
       ═══════════════════════════════════════════════ */
    const phase1 = gsap.timeline();
    phase1.to(centerPulseRef.current, {
      scale: 1, opacity: 1, duration: 0.6, ease: "power2.out",
    })
    .to(centerPulseRef.current, {
      scale: 1.4, opacity: 0.6, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut",
    })
    .to(centerPulseRef.current, {
      scale: 30, opacity: 0, duration: 0.5, ease: "power3.in",
    });
    master.add(phase1);

    /* ═══════════════════════════════════════════════
       PHASE 2: PARTICLE ERUPTION
       ═══════════════════════════════════════════════ */
    const phase2 = gsap.timeline();
    particles.forEach((p, i) => {
      const el = particlesRef.current[i];
      if (!el) return;
      phase2.to(el, {
        x: p.finalX, y: p.finalY, scale: 1, opacity: 0.8,
        duration: 0.8, delay: p.delay, ease: "power3.out",
      }, 0);
    });
    phase2.to(orbitalRingRef.current, {
      opacity: 1, scale: 1, duration: 0.6, ease: "power2.out",
    }, 0.2);
    ringPoints.forEach((_, i) => {
      const el = ringDotsRef.current[i];
      if (!el) return;
      phase2.to(el, {
        scale: 1, opacity: 0.7, duration: 0.3, delay: i * 0.02, ease: "back.out(2)",
      }, 0.3);
    });
    master.add(phase2, "-=0.2");

    gsap.to(orbitalRingRef.current, {
      rotation: 360, duration: 8, repeat: -1, ease: "none",
    });

    /* ═══════════════════════════════════════════════
       PHASE 3: LOGO FORGE
       ═══════════════════════════════════════════════ */
    const phase3 = gsap.timeline();
    phase3.to(bloomRef.current, {
      scale: 2, opacity: 0.8, duration: 0.3, ease: "power2.out",
    }).to(bloomRef.current, {
      scale: 3.5, opacity: 0, duration: 0.6, ease: "power2.in",
    });
    phase3.to(logoRef.current, {
      scale: 1, opacity: 1, rotation: 0, duration: 1, ease: "back.out(1.7)",
    }, 0);
    phase3.to(logoGlowRef.current, {
      scale: 1, opacity: 1, duration: 0.8, ease: "power2.out",
    }, 0.2);
    particles.forEach((p, i) => {
      const el = particlesRef.current[i];
      if (!el) return;
      phase3.to(el, {
        x: p.finalX * 0.6, y: p.finalY * 0.6, opacity: 0.4,
        duration: 0.6, ease: "power2.inOut",
      }, 0.2);
    });
    master.add(phase3, "-=0.3");

    /* ═══════════════════════════════════════════════
       PHASE 4: TYPOGRAPHY CASCADE
       ═══════════════════════════════════════════════ */
    const phase4 = gsap.timeline();
    "VREN".split("").forEach((_, i) => {
      const el = lettersRef.current[i];
      if (!el) return;
      phase4.to(el, {
        y: 0, opacity: 1, rotateX: 0, duration: 0.5, ease: "back.out(2.5)",
      }, i * 0.12);
    });
    phase4.to(shockwaveRef.current, {
      scale: 4, opacity: 0.6, duration: 0.15, ease: "power2.out",
    }, 0.36).to(shockwaveRef.current, {
      scale: 12, opacity: 0, duration: 0.6, ease: "power2.out",
    });
    phase4.to(hexStreamsRef.current, {
      opacity: 0.25, y: 0, duration: 0.4, stagger: 0.04, ease: "power2.out",
    }, 0.2);
    master.add(phase4, "-=0.1");

    /* ═══════════════════════════════════════════════
       PHASE 5: PROGRESS & TAGLINE
       ═══════════════════════════════════════════════ */
    const phase5 = gsap.timeline();
    phase5.to(taglineRef.current, {
      y: 0, opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out",
    }).to(progressTrackRef.current, {
      scaleX: 1, opacity: 1, duration: 0.3, ease: "power2.out",
    }, "-=0.3").to(progressTextRef.current, {
      opacity: 1, duration: 0.2,
    }, "-=0.1").to(progressBarRef.current, {
      scaleX: 1, duration: 1.0, ease: "power2.inOut",
    });
    master.add(phase5, "-=0.2");

    /* ═══════════════════════════════════════════════
       PHASE 6: COLLAPSE & CURTAIN TEAR
       ═══════════════════════════════════════════════ */
    const phase6 = gsap.timeline();
    phase6.to(hexStreamsRef.current, {
      opacity: 0, y: -20, duration: 0.25, stagger: 0.02, ease: "power2.in",
    }).to(particlesRef.current, {
      x: 0, y: 0, scale: 0, opacity: 0, duration: 0.4, ease: "power3.in",
    }, 0).to(orbitalRingRef.current, {
      scale: 0, opacity: 0, duration: 0.4, ease: "power3.in",
    }, 0).to([logoGlowRef.current, taglineRef.current, progressTrackRef.current, progressTextRef.current], {
      opacity: 0, y: -15, duration: 0.25, stagger: 0.03, ease: "power2.in",
    }, 0.1).to(logoRef.current, {
      scale: 0.5, opacity: 0, duration: 0.3, ease: "power2.in",
    }, 0.2).to(lettersRef.current, {
      y: -50, opacity: 0, duration: 0.25, stagger: 0.03, ease: "power2.in",
    }, 0.15);
    phase6.to(curtainTopRef.current, {
      yPercent: -100, duration: 0.7, ease: "expo.inOut",
    }, 0.45).to(curtainBottomRef.current, {
      yPercent: 100, duration: 0.7, ease: "expo.inOut",
    }, 0.45);
    master.add(phase6, "-=0.1");

  }, { scope: containerRef, dependencies: [mounted] });

  if (done) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] overflow-hidden">

      {/* ── CURTAIN HALVES ─────────────────────────── */}
      <div ref={curtainTopRef} className="absolute inset-x-0 top-0 h-1/2 bg-charcoal z-[1]" />
      <div ref={curtainBottomRef} className="absolute inset-x-0 bottom-0 h-1/2 bg-charcoal z-[1]" />

      {/* ── MAIN STAGE ─────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center z-[2]">

        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Background radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,119,87,0.06)_0%,transparent_60%)] pointer-events-none" />

        {/* ── Center pulse (Phase 1) ──── */}
        <div
          ref={centerPulseRef}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 16,
            height: 16,
            background: `radial-gradient(circle, ${COLORS.terracotta}, ${COLORS.terracottaDark})`,
            boxShadow: `0 0 40px ${COLORS.terracotta}, 0 0 80px ${COLORS.terracotta}40`,
          }}
        />

        {/* ── Particle field (Phase 2) ── */}
        <div ref={canvasLayerRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {particles.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => setParticleRef(el, i)}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 ${p.size * 3}px ${p.color}80`,
              }}
            />
          ))}
        </div>

        {/* ── Orbital ring (Phase 2) ──── */}
        <div ref={orbitalRingRef} className="absolute pointer-events-none" style={{ width: 280, height: 280 }}>
          <svg className="absolute inset-0 w-full h-full" viewBox="-150 -150 300 300">
            <circle cx="0" cy="0" r="140" fill="none" stroke={COLORS.terracotta} strokeWidth="0.5" strokeDasharray="4 8" opacity="0.3" />
            <circle cx="0" cy="0" r="100" fill="none" stroke={COLORS.gold} strokeWidth="0.3" strokeDasharray="2 12" opacity="0.2" />
          </svg>
          {ringPoints.map((pt, i) => (
            <div
              key={i}
              ref={(el) => setRingDotRef(el, i)}
              className="absolute rounded-full"
              style={{
                width: i % 4 === 0 ? 4 : 2,
                height: i % 4 === 0 ? 4 : 2,
                backgroundColor: i % 4 === 0 ? COLORS.terracotta : COLORS.gold,
                left: `calc(50% + ${pt.x}px)`,
                top: `calc(50% + ${pt.y}px)`,
                transform: "translate(-50%, -50%)",
                boxShadow: i % 4 === 0 ? `0 0 8px ${COLORS.terracotta}60` : "none",
              }}
            />
          ))}
        </div>

        {/* ── Light bloom (Phase 3) ───── */}
        <div
          ref={bloomRef}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 100,
            height: 100,
            background: `radial-gradient(circle, ${COLORS.gold}60, transparent 70%)`,
          }}
        />

        {/* ── Logo + Glow (Phase 3) ──── */}
        <div className="absolute flex flex-col items-center">
          <div className="relative">
            <div
              ref={logoGlowRef}
              className="absolute -inset-8 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${COLORS.terracotta}18 0%, transparent 70%)`,
                filter: "blur(20px)",
              }}
            />
            <div ref={logoRef} className="relative w-24 h-24 md:w-28 md:h-28">
              <Image
                src="/transparentLogo.png"
                alt="VREN"
                fill
                className="object-contain drop-shadow-[0_0_30px_rgba(217,119,87,0.3)]"
                priority
              />
            </div>
          </div>

          {/* ── Shockwave ring (Phase 4) ── */}
          <div
            ref={shockwaveRef}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 20,
              height: 20,
              top: "calc(100% + 40px)",
              border: `1px solid ${COLORS.terracotta}`,
            }}
          />

          {/* ── Letter cascade (Phase 4) ── */}
          <div className="mt-6 overflow-hidden pb-1">
            <div className="flex" style={{ perspective: "600px" }}>
              {"VREN".split("").map((char, i) => (
                <span
                  key={i}
                  ref={(el) => setLetterRef(el, i)}
                  className="inline-block font-display font-semibold text-white tracking-[0.2em]"
                  style={{
                    fontSize: "clamp(32px, 5vw, 52px)",
                    textShadow: `0 0 40px ${COLORS.terracotta}40`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          {/* ── Tagline (Phase 5) ────── */}
          <div
            ref={taglineRef}
            className="mt-4 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-stone"
          >
            Open Payment Infrastructure
          </div>

          {/* ── Progress bar (Phase 5) ── */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <div
              ref={progressTrackRef}
              className="w-[200px] h-[1px] overflow-hidden"
              style={{
                transformOrigin: "center",
                background: `linear-gradient(90deg, transparent, ${COLORS.dim}40, transparent)`,
              }}
            >
              <div
                ref={progressBarRef}
                className="h-full w-full"
                style={{
                  transformOrigin: "left center",
                  background: `linear-gradient(90deg, ${COLORS.terracotta}, ${COLORS.gold})`,
                }}
              />
            </div>
            <span
              ref={progressTextRef}
              className="font-mono text-[9px] uppercase tracking-[0.25em] text-dim"
            >
              Initializing protocol…
            </span>
          </div>
        </div>

        {/* ── Hex data streams (Phase 4) ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {Array.from({ length: HEX_STREAM_COUNT }, (_, i) => {
            const angle = (360 / HEX_STREAM_COUNT) * i;
            const radius = 220 + (i % 3) * 40;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            return (
              <div
                key={i}
                ref={(el) => setHexRef(el, i)}
                className="absolute font-mono text-[9px] text-terracotta/30 whitespace-nowrap"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                }}
              >
                {deterministicHex(i)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
