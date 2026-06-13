"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex justify-center ${
        scrolled
          ? "bg-parchment/95 backdrop-blur-md shadow-sm"
          : "bg-parchment"
      }`}
    >
      <div className="w-full max-w-[1440px] px-6 lg:px-8 h-[68px] flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center group cursor-pointer shrink-0">
          <div className="relative w-8 h-8 flex items-center justify-center z-10">
            <div className="absolute top-1 left-1 w-1.5 h-6 bg-charcoal" />
            <div className="absolute top-1 right-1 w-1.5 h-6 bg-charcoal" />
            <div className="absolute top-1 left-0 w-8 h-1.5 bg-terracotta" />
            <div className="absolute top-[8px] left-[14px] w-[3px] h-[10px] bg-charcoal" />
          </div>
          
          <div 
            className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center ${
              scrolled ? "max-w-0 opacity-0" : "max-w-[100px] opacity-100"
            }`}
          >
            <span 
              className={`pl-2 font-display font-semibold tracking-wide leading-none text-xl text-charcoal transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                scrolled ? "-translate-x-full" : "translate-x-0"
              }`}
            >
              ARTHA
            </span>
          </div>
        </Link>

        {/* Right Section: Links + Split Button */}
        <div className="flex items-center gap-2 lg:gap-4">
          
          {/* Navigation Links (Serif, 20px, Right-aligned) */}
          <div className="hidden lg:flex items-center text-charcoal font-body text-[20px]">
            <Link href="#" className="px-[12px] py-[22px] hover:text-terracotta transition-colors">
              Developers
            </Link>
            <Link href="#" className="px-[12px] py-[22px] hover:text-terracotta transition-colors">
              Pricing
            </Link>
            <div className="group relative px-[12px] py-[22px] cursor-pointer flex items-center gap-1.5 hover:text-terracotta transition-colors">
              <span>Resources</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-1 transition-transform group-hover:rotate-180">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <Link href="#" className="px-[12px] py-[22px] hover:text-terracotta transition-colors">
              Company
            </Link>
          </div>

          <div className="w-4 hidden lg:block"></div>

          {/* Split CTA Button */}
          <div className="flex items-center h-10 shadow-sm transition-transform hover:-translate-y-[1px] hover:shadow-md cursor-pointer group">
            <div className="bg-charcoal text-parchment font-ui text-[16px] font-medium h-full flex items-center px-4 rounded-l-lg border-r border-[#3d3c37] group-hover:bg-[#2b2a27] transition-colors">
              Try ARTHA
            </div>
            <div className="bg-charcoal text-parchment h-full flex items-center justify-center px-3 rounded-r-lg group-hover:bg-[#2b2a27] transition-colors">
              <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L6 5.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
