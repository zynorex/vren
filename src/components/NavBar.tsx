"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Image src="/logo.png" alt="VREN Logo" width={40} height={40} className="object-contain" />
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
              VREN
            </span>
          </div>
        </Link>

        {/* Right Section: Links + Split Button */}
        <div className="flex items-center gap-2 lg:gap-4">
          
          {/* Navigation Links (Serif, 20px, Right-aligned) */}
          <div className="hidden lg:flex items-center text-charcoal font-body text-[20px]">
            <Link href="/how-it-works" className="px-[12px] py-[22px] hover:text-terracotta transition-colors">
              How It Works
            </Link>
            <Link href="/about" className="px-[12px] py-[22px] hover:text-terracotta transition-colors">
              About
            </Link>
            
            <div className="group relative px-[12px] py-[22px] cursor-pointer flex items-center gap-1.5 hover:text-terracotta transition-colors">
              <span>Resources</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-1 transition-transform group-hover:rotate-180">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              {/* Dropdown Menu (CSS Driven) */}
              <div className="absolute top-full right-0 w-48 bg-white border border-border-subtle rounded-xl shadow-[0_16px_40px_rgba(25,25,24,0.08)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex flex-col py-2 z-50">
                <Link href="/dev-docs" className="px-5 py-2.5 text-[17px] text-text-secondary hover:text-charcoal hover:bg-parchment/60 transition-colors">
                  Developers
                </Link>
                <Link href="/pricing" className="px-5 py-2.5 text-[17px] text-text-secondary hover:text-charcoal hover:bg-parchment/60 transition-colors">
                  Pricing
                </Link>
                <Link href="/dev-docs" className="px-5 py-2.5 text-[17px] text-text-secondary hover:text-charcoal hover:bg-parchment/60 transition-colors">
                  Documentation
                </Link>
                <Link href="/blog" className="px-5 py-2.5 text-[17px] text-text-secondary hover:text-charcoal hover:bg-parchment/60 transition-colors">
                  Blog
                </Link>
                <Link href="/changelog" className="px-5 py-2.5 text-[17px] text-text-secondary hover:text-charcoal hover:bg-parchment/60 transition-colors">
                  Changelog
                </Link>
              </div>
            </div>
          </div>

          <div className="w-4 hidden lg:block"></div>

          {/* Desktop Login Button */}
          <Link href="/login" className="hidden lg:flex items-center h-10 px-5 bg-charcoal text-parchment font-ui text-[15px] font-medium rounded-lg shadow-sm hover:bg-[#2b2a27] hover:-translate-y-[1px] hover:shadow-md transition-all cursor-pointer">
            Login
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-charcoal hover:text-terracotta focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[68px] bg-parchment border-b border-border-subtle p-6 flex flex-col gap-4 shadow-xl z-50">
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="font-body text-[20px] text-charcoal hover:text-terracotta transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="font-body text-[20px] text-charcoal hover:text-terracotta transition-colors"
          >
            About
          </Link>
          <Link
            href="/dev-docs"
            onClick={() => setMobileMenuOpen(false)}
            className="font-body text-[20px] text-charcoal hover:text-terracotta transition-colors"
          >
            Developers & Docs
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="font-body text-[20px] text-charcoal hover:text-terracotta transition-colors"
          >
            Pricing
          </Link>
          <div className="pt-2 border-t border-border-subtle">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center h-12 w-full bg-charcoal text-parchment font-ui text-[15px] font-medium rounded-lg shadow-sm"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
