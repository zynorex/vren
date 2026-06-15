"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function PageLoader() {
  const container = useRef<HTMLDivElement>(null);
  const vrenRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Ensure elements are visible before animating
      gsap.set([vrenRef.current, textRef.current, barRef.current], { autoAlpha: 1 });

      // Animate letters staggering up
      const letters = vrenRef.current?.querySelectorAll(".letter");
      if (letters) {
        tl.from(letters, {
          y: 100,
          opacity: 0,
          rotation: 10,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.08,
        });
      }

      // Progress bar growing
      tl.fromTo(
        barRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power2.inOut",
        },
        "-=0.6"
      );

      // Monospace text fade in
      tl.from(
        textRef.current,
        {
          opacity: 0,
          y: 10,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=1"
      );

      // Continuous slow pulse on the text for professional feel
      tl.to(textRef.current, {
        opacity: 0.6,
        duration: 1,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    },
    { scope: container }
  );

  return (
    <div
      ref={container}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-charcoal text-parchment"
    >
      <div className="flex flex-col items-center relative z-10">
        {/* Mask container for letters */}
        <div className="overflow-hidden pb-2 mb-6">
          <div ref={vrenRef} className="flex font-display font-medium tracking-[0.15em] text-5xl md:text-6xl text-white opacity-0 invisible">
            {"VREN".split("").map((letter, i) => (
              <span key={i} className="letter inline-block">
                {letter}
              </span>
            ))}
          </div>
        </div>

        {/* Loading Bar container */}
        <div className="w-[200px] h-[1px] bg-[#333333] mb-6 overflow-hidden">
          <div ref={barRef} className="h-full bg-terracotta w-full opacity-0 invisible" />
        </div>

        {/* Status Text */}
        <p ref={textRef} className="font-mono text-[11px] uppercase tracking-widest text-text-muted opacity-0 invisible">
          Initializing environment...
        </p>
      </div>

      {/* Subtle background noise/grid for high-end feel */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
