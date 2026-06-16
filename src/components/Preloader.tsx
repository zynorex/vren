"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Preloader() {
  const [loadingState, setLoadingState] = useState(0); 
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Only show the preloader once per session
    if (sessionStorage.getItem("vren_preloader_seen")) {
      setLoadingState(2);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("vren_preloader_seen", "true");
        setLoadingState(2);
      }
    });

    // Initial state
    gsap.set(logoRef.current, { scale: 0.9, opacity: 0, y: 20 });
    gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(textRef.current, { opacity: 0, y: 10, filter: "blur(4px)" });

    // Animation sequence
    tl.to(logoRef.current, {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 1.4,
      ease: "power3.out"
    })
    .to(textRef.current, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.8")
    .to(progressRef.current, {
      scaleX: 1,
      duration: 1.6,
      ease: "power4.inOut"
    }, "-=0.4")
    .to([logoRef.current, textRef.current, progressRef.current], {
      y: -40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.in"
    }, "+=0.3")
    .to(containerRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: "expo.inOut"
    });

  }, { scope: containerRef });

  if (loadingState === 2) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-charcoal text-parchment overflow-hidden"
    >
      <div className="flex flex-col items-center z-10">
        <div ref={logoRef} className="relative w-32 h-32 mb-8 drop-shadow-2xl">
          <Image 
            src="/transparentLogo.png" 
            alt="VREN" 
            fill 
            className="object-contain"
            priority
          />
        </div>
        
        <div ref={textRef} className="font-display tracking-[0.4em] text-[15px] mb-10 text-parchment/90 uppercase font-medium">
          VREN Protocol
        </div>

        <div className="w-[240px] h-[2px] bg-white/10 overflow-hidden rounded-full">
          <div ref={progressRef} className="h-full bg-terracotta w-full rounded-full"></div>
        </div>
      </div>
      
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,87,0.08)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />
    </div>
  );
}
