"use client";

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
      </main>
    </div>
  );
}
