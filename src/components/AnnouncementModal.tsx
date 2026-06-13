"use client";

import { useState, useEffect } from "react";

export function AnnouncementModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if the user has already seen the banner
    const hasSeen = localStorage.getItem("artha_announcement_seen");
    if (hasSeen === "true") return;

    // Show after 10 seconds of site arrival
    const timer = setTimeout(() => setIsOpen(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem("artha_announcement_seen", "true");
  };

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-parchment/70 backdrop-blur-lg animate-[fade-in_400ms_ease-out_forwards]">
      <div className="relative w-full max-w-lg bg-white border border-border-subtle rounded-2xl p-10 shadow-[0_32px_64px_rgba(25,25,24,0.12)] animate-[fade-in-up_500ms_cubic-bezier(0.16,1,0.3,1)_forwards]">
        
        {/* Close Button */}
        <button 
          onClick={handleDismiss}
          className="absolute top-6 right-6 text-stone hover:text-charcoal transition-colors focus:outline-none"
          aria-label="Close announcement"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Modal Content */}
        <div className="flex flex-col items-center text-center pt-2">
          
          <h2 className="font-display text-3xl lg:text-4xl text-charcoal mb-4 tracking-tight">
            Active Development
          </h2>
          
          <p className="font-body text-[18px] lg:text-[20px] text-text-secondary leading-[1.6] mb-10 text-balance">
            The ARTHA Protocol is currently undergoing core engineering and rigorous smart contract security audits. Mainnet deployment is scheduled for Q3 2026.
          </p>
          
          <button 
            onClick={handleDismiss}
            className="w-full bg-charcoal hover:bg-[#2b2a27] text-parchment font-ui text-[15px] font-medium py-3.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            Acknowledge & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
