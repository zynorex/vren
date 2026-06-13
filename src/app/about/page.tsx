import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ARTHA | The Payment Protocol",
  description: "Learn why ARTHA exists and how we are rebuilding the payment layer for the global internet.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-parchment text-charcoal font-body flex flex-col items-center overflow-hidden">
      <main className="w-full flex flex-col items-center pt-32 lg:pt-48 pb-32">
        
        {/* Header Section */}
        <div className="w-full max-w-[1000px] px-6 lg:px-12 flex flex-col items-center text-center animate-[fade-in-up_600ms_cubic-bezier(0.0,0.0,0.2,1)_forwards] opacity-0">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-8 h-[1px] bg-terracotta"></span>
            <span className="font-ui text-[11px] tracking-[0.2em] uppercase text-terracotta font-semibold">
              Our Mission
            </span>
            <span className="w-8 h-[1px] bg-terracotta"></span>
          </div>
          
          <h1 className="font-display font-medium text-[48px] leading-[1.05] tracking-tight text-charcoal sm:text-[64px] lg:text-[80px] text-balance mb-8">
            Software is borderless.
            <br />
            Now, the revenue is too.
          </h1>
        </div>

        {/* Essay Section */}
        <div className="w-full max-w-[1000px] px-6 lg:px-12 mt-16 lg:mt-24 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start animate-[fade-in-up_600ms_cubic-bezier(0.0,0.0,0.2,1)_150ms_forwards] opacity-0">
          
          {/* Left Column: Metadata & TOC */}
          <div className="md:col-span-3 flex flex-col sticky top-32">
            <div className="border-t border-border-subtle pt-4 mb-8">
              <span className="font-ui text-[11px] uppercase tracking-[0.15em] text-text-muted font-semibold block mb-2">Established</span>
              <span className="font-ui text-[14px] text-charcoal">June 2026</span>
            </div>
            <div className="border-t border-border-subtle pt-4 mb-8">
              <span className="font-ui text-[11px] uppercase tracking-[0.15em] text-text-muted font-semibold block mb-2">Location</span>
              <span className="font-ui text-[14px] text-charcoal">Built in India</span>
            </div>
            <div className="border-t border-border-subtle pt-4">
              <span className="font-ui text-[11px] uppercase tracking-[0.15em] text-text-muted font-semibold block mb-4">Contents</span>
              <div className="flex flex-col gap-3 font-ui text-[14px]">
                <a href="#the-problem" className="text-text-secondary hover:text-terracotta transition-colors">The Geographic Lottery</a>
                <a href="#the-protocol" className="text-text-secondary hover:text-terracotta transition-colors">The ARTHA Protocol</a>
                <a href="#the-philosophy" className="text-text-secondary hover:text-terracotta transition-colors">Core Philosophy</a>
              </div>
            </div>
          </div>

          {/* Right Column: The Long-form Essay */}
          <div className="md:col-span-9 flex flex-col font-body text-[20px] lg:text-[22px] leading-[1.6] text-charcoal space-y-12">
            
            <section id="the-problem">
              <h2 className="font-display text-3xl lg:text-4xl mb-6">The Geographic Lottery</h2>
              <p className="mb-6">
                We observed a structural flaw in the internet economy: your ability to capture the value you create is entirely dependent on where you were born. A developer in San Francisco and a developer in Lagos can write the exact same quality of code, deploy to the exact same global audience, and provide the exact same utility. 
              </p>
              <p className="mb-6">
                Yet, standard financial infrastructure systematically excludes over 60 countries. Traditional payment gateways like Stripe are bound by archaic banking regulations, meaning millions of developers are arbitrarily blocked from monetizing their work. They are told to rely on unsustainable workarounds or incorporate expensive shadow companies abroad.
              </p>
              <p className="text-terracotta font-medium italic">
                This is a failure of infrastructure, not talent. ARTHA is the door that was always supposed to be open.
              </p>
            </section>

            <div className="w-full h-[1px] bg-border-subtle my-4"></div>

            <section id="the-protocol">
              <h2 className="font-display text-3xl lg:text-4xl mb-6">The ARTHA Protocol</h2>
              <p className="mb-6">
                ARTHA stands for <span className="font-medium">Allowing Revenue To flow Honestly, Autonomously</span>. We bypass the fiat choke points entirely by building a decentralized payment layer running natively on Ethereum and Polygon.
              </p>
              <ul className="flex flex-col gap-6 list-none mb-6">
                <li className="flex gap-4">
                  <span className="font-mono text-terracotta mt-1">01.</span>
                  <div>
                    <strong className="font-display text-2xl block mb-2">ERC-1155 Subscription NFTs</strong>
                    <span className="text-[18px] text-text-secondary">Instead of charging a credit card monthly, developers deploy an ARTHA smart contract. Users purchase a time-bound NFT (representing a month or year of access). Your frontend simply checks if the user holds a valid token to grant access.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-mono text-terracotta mt-1">02.</span>
                  <div>
                    <strong className="font-display text-2xl block mb-2">Instant Settlement</strong>
                    <span className="text-[18px] text-text-secondary">Because the system relies on autonomous smart contracts, funds flow directly from the user to your vault. There is no waiting period, no rolling reserve, and absolutely zero percentage taken by ARTHA as a platform tax.</span>
                  </div>
                </li>
              </ul>
            </section>

            <div className="w-full h-[1px] bg-border-subtle my-4"></div>

            <section id="the-philosophy">
              <h2 className="font-display text-3xl lg:text-4xl mb-6">Core Philosophy</h2>
              <div className="bg-sand/30 border border-border-subtle p-8 rounded-lg mb-6">
                <h3 className="font-ui text-xs tracking-[0.2em] uppercase text-terracotta font-semibold mb-4">1. Premium without permission</h3>
                <p className="text-[18px]">
                  Web3 tools often look like toys. ARTHA is built for serious businesses. It provides an enterprise-grade, highly polished checkout experience that your users will trust, without requiring you to seek approval from a centralized board.
                </p>
              </div>
              <div className="bg-sand/30 border border-border-subtle p-8 rounded-lg">
                <h3 className="font-ui text-xs tracking-[0.2em] uppercase text-terracotta font-semibold mb-4">2. Indian without apology</h3>
                <p className="text-[18px]">
                  Historically, developer tools built in the Global South have tried to mask their origins to appear "Silicon Valley standard." ARTHA reverses this. Our name is Sanskrit. Our logo is the Torana gateway of Sanchi. We believe the next generation of global infrastructure will be built here, and we wear our origin as a mark of absolute quality.
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
