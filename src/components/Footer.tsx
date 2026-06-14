import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full bg-charcoal text-parchment pt-20 pb-16">
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-8 flex flex-col lg:flex-row justify-between gap-16 lg:gap-8">
        
        {/* Left Side: Brand & Copyright */}
        <div className="flex flex-col justify-between h-full min-h-[300px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <Image src="/logo.png" alt="VREN Logo" width={32} height={32} className="object-contain" />
            </div>
            <div className="font-display font-medium tracking-[0.2em] leading-none text-2xl text-parchment">
              VREN
            </div>
          </Link>

          {/* Copyright & Socials */}
          <div className="flex flex-col gap-4 mt-auto">
            <div className="flex items-center gap-6 text-stone">
              <a href="#" className="hover:text-parchment transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-parchment transition-colors">X</a>
              <a href="#" className="hover:text-parchment transition-colors">YouTube</a>
            </div>
            <p className="font-ui text-[13px] text-stone">
              © {new Date().getFullYear()} VREN Protocol.
            </p>
          </div>
        </div>

        {/* Right Side: 4-Column Asymmetric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 lg:w-3/4 max-w-[900px]">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <h3 className="font-ui text-[12px] font-medium text-parchment tracking-wide">Products</h3>
              <div className="flex flex-col gap-3 font-ui text-[12px] font-normal tracking-[-0.24px] text-stone">
                <Link href="#" className="hover:text-parchment transition-colors">Gateway</Link>
                <Link href="#" className="hover:text-parchment transition-colors">Smart Contracts</Link>
                <Link href="#" className="hover:text-parchment transition-colors">Dashboard</Link>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-ui text-[12px] font-medium text-parchment tracking-wide">Ecosystem</h3>
              <div className="flex flex-col gap-3 font-ui text-[12px] font-normal tracking-[-0.24px] text-stone">
                <Link href="#" className="hover:text-parchment transition-colors">Partners</Link>
                <Link href="#" className="hover:text-parchment transition-colors">Integrations</Link>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <h3 className="font-ui text-[12px] font-medium text-parchment tracking-wide">Solutions</h3>
              <div className="flex flex-col gap-3 font-ui text-[12px] font-normal tracking-[-0.24px] text-stone">
                <Link href="#" className="hover:text-parchment transition-colors">For Enterprise</Link>
                <Link href="#" className="hover:text-parchment transition-colors">For Creators</Link>
                <Link href="#" className="hover:text-parchment transition-colors">For Open Source</Link>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-ui text-[12px] font-medium text-parchment tracking-wide">VREN Platform</h3>
              <div className="flex flex-col gap-3 font-ui text-[12px] font-normal tracking-[-0.24px] text-stone">
                <Link href="#" className="hover:text-parchment transition-colors">Console</Link>
                <Link href="#" className="hover:text-parchment transition-colors">Pricing</Link>
                <Link href="#" className="hover:text-parchment transition-colors">API Reference</Link>
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <h3 className="font-ui text-[12px] font-medium text-parchment tracking-wide">Resources</h3>
              <div className="flex flex-col gap-3 font-ui text-[12px] font-normal tracking-[-0.24px] text-stone">
                <Link href="#" className="hover:text-parchment transition-colors">Documentation</Link>
                <Link href="#" className="hover:text-parchment transition-colors">Guides</Link>
                <Link href="#" className="hover:text-parchment transition-colors">Community</Link>
                <Link href="#" className="hover:text-parchment transition-colors">Blog</Link>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-ui text-[12px] font-medium text-parchment tracking-wide">Help and security</h3>
              <div className="flex flex-col gap-3 font-ui text-[12px] font-normal tracking-[-0.24px] text-stone">
                <Link href="#" className="hover:text-parchment transition-colors">Support center</Link>
                <Link href="#" className="hover:text-parchment transition-colors">System status</Link>
                <Link href="#" className="hover:text-parchment transition-colors">Audits</Link>
              </div>
            </div>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <h3 className="font-ui text-[12px] font-medium text-parchment tracking-wide">Company</h3>
              <div className="flex flex-col gap-3 font-ui text-[12px] font-normal tracking-[-0.24px] text-stone">
                <Link href="/about" className="hover:text-parchment transition-colors">About VREN</Link>
                <Link href="/changelog" className="hover:text-parchment transition-colors">Changelog</Link>
                <Link href="#" className="hover:text-parchment transition-colors">Careers</Link>
                <Link href="#" className="hover:text-parchment transition-colors">News</Link>
                <Link href="#" className="hover:text-parchment transition-colors">Contact</Link>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-ui text-[12px] font-medium text-parchment tracking-wide">Terms and policies</h3>
              <div className="flex flex-col gap-3 font-ui text-[12px] font-normal tracking-[-0.24px] text-stone">
                <Link href="#" className="hover:text-parchment transition-colors">Terms of Service</Link>
                <Link href="#" className="hover:text-parchment transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-parchment transition-colors">Cookie Policy</Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
