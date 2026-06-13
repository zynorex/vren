"use client";

import { useEffect, useState } from "react";

export function Preloader() {
  // 0 = loading (visible), 1 = sliding up, 2 = removed from DOM
  const [loadingState, setLoadingState] = useState(0); 

  useEffect(() => {
    // Only show the preloader once per session to avoid annoying the user
    if (sessionStorage.getItem("artha_preloader_seen")) {
      setLoadingState(2);
      return;
    }

    // Sequence the loading animation
    const timer1 = setTimeout(() => setLoadingState(1), 1600); // Trigger the upward slide
    const timer2 = setTimeout(() => {
      setLoadingState(2);
      sessionStorage.setItem("artha_preloader_seen", "true");
    }, 2800); // Fully remove from DOM after slide finishes

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (loadingState === 2) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-charcoal text-parchment transition-transform duration-[1200ms] ease-[cubic-bezier(0.85,0,0.15,1)] ${
        loadingState === 1 ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="flex flex-col items-center">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2 mb-8 opacity-0 animate-[fade-in_800ms_ease-out_forwards]">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute top-1 left-1 w-1.5 h-6 bg-parchment" />
            <div className="absolute top-1 right-1 w-1.5 h-6 bg-parchment" />
            <div className="absolute top-1 left-0 w-8 h-1.5 bg-terracotta" />
            <div className="absolute top-[8px] left-[14px] w-[3px] h-[10px] bg-parchment" />
          </div>
          <span className="font-display font-medium tracking-[0.2em] leading-none text-3xl">
            ARTHA
          </span>
        </div>
        
        {/* Progressive Loading Line */}
        <div className="w-[180px] h-[1px] bg-[#3d3c37] relative overflow-hidden opacity-0 animate-[fade-in_400ms_ease-out_400ms_forwards]">
          <div className="absolute top-0 left-0 h-full bg-terracotta w-full origin-left animate-[progress-line_1.2s_cubic-bezier(0.16,1,0.3,1)_forwards]"></div>
        </div>
      </div>
    </div>
  );
}
