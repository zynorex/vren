import { Card } from "@/components/Card";

export default function Home() {
  return (
    <div className="min-h-screen bg-parchment text-charcoal font-body flex flex-col items-center overflow-hidden">


      <main className="w-full flex flex-col items-center pt-32 lg:pt-48 pb-24">
        {/* Asymmetric Hero Grid */}
        <div className="w-full max-w-[1440px] px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column - Massive Headline */}
          <div className="lg:col-span-7 flex flex-col animate-[fade-in-up_600ms_cubic-bezier(0.0,0.0,0.2,1)_forwards] opacity-0">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-[1px] bg-terracotta"></span>
              <span className="font-ui text-xs tracking-widest uppercase text-terracotta font-semibold">
                Built in India
              </span>
            </div>
            
            <h1 className="font-display font-medium text-[56px] leading-[1.05] tracking-tight text-charcoal sm:text-[80px] lg:text-[100px] xl:text-[120px]">
              Your revenue.
              <br />
              <span className="text-terracotta">Your terms.</span>
            </h1>
          </div>

          {/* Right Column - Editorial Paragraph & CTAs */}
          <div className="lg:col-span-5 flex flex-col pt-4 lg:pt-16 animate-[fade-in-up_600ms_cubic-bezier(0.0,0.0,0.2,1)_150ms_forwards] opacity-0">
            <p className="font-body text-[22px] sm:text-[28px] leading-[1.4] text-charcoal mb-10 text-balance">
              ARTHA exists for builders the system forgot. Developers with real skills and real products, locked out of Stripe for reasons that have nothing to do with their ability to build.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#"
                className="bg-terracotta hover:brightness-105 text-white font-ui text-[15px] font-medium px-8 py-3.5 rounded-[4px] transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-[1px] flex items-center gap-2 group w-full sm:w-auto justify-center"
              >
                Start Integrating
                <span className="transform transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#"
                className="bg-transparent border border-border-subtle text-charcoal font-ui text-[15px] font-medium px-8 py-3.5 rounded-[4px] transition-all duration-200 hover:bg-sand w-full sm:w-auto justify-center flex items-center"
              >
                Read the Docs
              </a>
            </div>

            <div className="mt-16 flex items-center gap-6 border-t border-border-subtle pt-6">
              <div className="flex flex-col">
                <span className="font-display text-2xl text-charcoal">ERC-1155</span>
                <span className="font-ui text-xs text-text-secondary uppercase tracking-widest mt-1">Standard</span>
              </div>
              <div className="w-[1px] h-10 bg-border-subtle"></div>
              <div className="flex flex-col">
                <span className="font-display text-2xl text-charcoal">0.0%</span>
                <span className="font-ui text-xs text-text-secondary uppercase tracking-widest mt-1">Platform Fee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Sections / Editorial Grid */}
        <div className="w-full max-w-[1440px] px-6 lg:px-12 mt-32 lg:mt-48">
          <div className="border-t border-border-subtle pt-8 pb-16">
            <h2 className="font-display text-[40px] lg:text-[64px] leading-tight text-charcoal tracking-tight max-w-4xl">
              Premium without permission. Indian without apology.
            </h2>
          </div>

          {/* Grid Layout for Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 border-t border-border-subtle pt-12">
            {[
              {
                num: "01",
                title: "Permissionless",
                desc: "No KYC to start accepting payments. Deploy your contract and you're instantly in business.",
              },
              {
                num: "02",
                title: "Instant Settlement",
                desc: "Funds flow directly into your smart contract vault. Withdraw immediately, not in 7 business days.",
              },
              {
                num: "03",
                title: "Global by Default",
                desc: "Accept crypto from anywhere in the world. No supported country lists. No currency conversion fees.",
              },
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col group cursor-pointer">
                <div className="font-mono text-xs text-text-muted mb-6 group-hover:text-terracotta transition-colors">{feature.num}</div>
                <h3 className="font-display text-2xl lg:text-3xl mb-4 text-charcoal">{feature.title}</h3>
                <p className="font-body text-lg text-text-secondary leading-relaxed pr-4">
                  {feature.desc}
                </p>
                <div className="mt-8 w-full h-[1px] bg-border-subtle group-hover:bg-terracotta transition-colors duration-500"></div>
              </div>
            ))}
          </div>
        </div>

        {/* The Code Section (Cowork mock) */}
        <div className="w-full max-w-[1440px] px-6 lg:px-12 mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border-subtle rounded-xl overflow-hidden bg-bg-surface shadow-sm">
            <div className="p-10 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border-subtle">
              <span className="font-ui text-xs tracking-widest uppercase text-terracotta font-semibold mb-4">
                Smart Contract Access
              </span>
              <h3 className="font-display text-4xl lg:text-5xl leading-tight mb-6">
                Integration in 3 lines of code.
              </h3>
              <p className="font-body text-xl text-text-secondary leading-relaxed mb-10">
                We replace closed financial networks with a decentralized architecture. You deploy an ERC-1155 subscription NFT. Your users mint access. You withdraw revenue directly.
              </p>
              <a href="#" className="font-ui text-charcoal font-medium underline underline-offset-4 decoration-border-subtle hover:decoration-terracotta transition-all inline-flex items-center w-fit">
                View the documentation →
              </a>
            </div>
            <div className="bg-charcoal p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-12 border-b border-[#3d3c37] flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3d3c37]"></div>
                <div className="w-3 h-3 rounded-full bg-[#3d3c37]"></div>
                <div className="w-3 h-3 rounded-full bg-[#3d3c37]"></div>
                <div className="ml-4 font-mono text-[11px] text-stone tracking-widest uppercase">Subscription.sol</div>
              </div>
              <div className="pt-10">
                <pre className="font-mono text-[13px] sm:text-[14px] leading-[1.7] overflow-x-auto text-parchment">
                  <code>
                    <span className="text-terracotta">function</span>{" "}
                    <span className="text-warm-gold">mintSubscription</span>() <span className="text-terracotta">external</span> <span className="text-terracotta">payable</span> {"{"}
                    {"\n"}  <span className="text-sage">require</span>(msg.value {">="} price, <span className="text-sage">"Insufficient funds"</span>);
                    {"\n"}  
                    {"\n"}  <span className="text-dim">// Issue access token</span>
                    {"\n"}  _mint(msg.sender, TIER_PRO, <span className="text-sky">1</span>, <span className="text-sage">""</span>);
                    {"\n"}  
                    {"\n"}  <span className="text-dim">// Direct settlement to your wallet</span>
                    {"\n"}  revenueVault += msg.value;
                    {"\n"}  emit <span className="text-warm-gold">SubscriptionMinted</span>(msg.sender);
                    {"\n"}{"}"}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* The Problem Section */}
        <div className="w-full max-w-[1440px] px-6 lg:px-12 mt-32 lg:mt-48">
          <div className="border-t border-border-subtle pt-8 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="font-display text-[40px] lg:text-[56px] leading-[1.1] text-charcoal tracking-tight">
                The geographic lottery of global finance.
              </h2>
            </div>
            <div className="lg:col-span-7 flex flex-col gap-10 lg:pt-4">
              <p className="font-body text-[20px] lg:text-[24px] text-text-secondary leading-relaxed">
                We observed a structural flaw in the internet economy: your ability to capture the value you create is entirely dependent on where you were born. Standard financial infrastructure excludes over 60 countries, arbitrarily blocking millions of developers from monetizing their work.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 border-t border-border-subtle pt-10">
                <div className="flex flex-col">
                  <span className="font-display text-4xl text-charcoal mb-4">60+</span>
                  <span className="font-ui font-medium text-charcoal mb-2">Countries Excluded</span>
                  <p className="font-body text-[16px] text-text-secondary leading-relaxed">By major traditional payment gateways due to archaic banking regulations.</p>
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-4xl text-charcoal mb-4">$0</span>
                  <span className="font-ui font-medium text-charcoal mb-2">Platform Tax</span>
                  <p className="font-body text-[16px] text-text-secondary leading-relaxed">ARTHA takes exactly zero percentage of your hard-earned revenue.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Updates / Editorial Cards Section */}
        <div className="w-full max-w-[1440px] px-6 lg:px-12 mt-32 lg:mt-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="font-ui text-xs tracking-widest uppercase text-terracotta font-semibold mb-6 block">Dispatch</span>
              <h2 className="font-display text-[40px] lg:text-[56px] leading-[1.1] text-charcoal tracking-tight">
                Latest updates
              </h2>
            </div>
            <a href="#" className="font-ui text-[15px] text-charcoal hover:text-terracotta transition-colors flex items-center gap-2 group pb-2">
              View all dispatches
              <span className="transform transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card 
              eyebrow="Architecture"
              title="State Machine Consensus in Web3 Subscriptions"
              description="A deep dive into how ARTHA utilizes multi-signature wallet verification to prevent replay attacks and ensure instantaneous global settlements."
              date="Jun 12, 2026"
              href="#"
            />
            <Card 
              eyebrow="Release"
              title="ARTHA Protocol v1.0 Mainnet Launch"
              description="After three rigorous security audits, the core ERC-1155 protocol is officially live on Ethereum and Polygon mainnets."
              date="Jun 05, 2026"
              href="#"
            />
            <Card 
              eyebrow="Community"
              title="Unlocking the Global South for Builders"
              description="Why traditional fiat gateways systematically exclude emerging markets, and how decentralized infrastructure forces an open door."
              date="May 28, 2026"
              href="#"
            />
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="w-full bg-charcoal text-parchment py-32 lg:py-48 mt-32 lg:mt-48">
          <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="mb-20">
              <span className="font-ui text-xs tracking-widest uppercase text-stone font-semibold mb-6 block">Capabilities</span>
              <h2 className="font-display text-[40px] lg:text-[64px] leading-tight tracking-tight max-w-4xl text-parchment">
                What can you build with ARTHA?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
              {[
                {
                  title: "SaaS Subscriptions",
                  desc: "Deploy a recurring payment smart contract that grants users a time-bound NFT. Connect it to your Next.js app to gate premium routes.",
                },
                {
                  title: "API Gateways",
                  desc: "Monetize your machine learning models or data APIs. Users purchase compute credits directly on-chain, unlocking API keys instantly.",
                },
                {
                  title: "Creator Communities",
                  desc: "Bypass Patreon and Substack. Launch a private Discord or content vault where access is strictly verified by wallet signatures.",
                },
              ].map((useCase, idx) => (
                <div key={idx} className="flex flex-col border-t border-[#3d3c37] pt-8 group">
                  <h3 className="font-display text-2xl lg:text-3xl mb-4 text-parchment">{useCase.title}</h3>
                  <p className="font-body text-lg text-stone leading-relaxed">
                    {useCase.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
