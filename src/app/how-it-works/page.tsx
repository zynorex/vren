import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | ARTHA Protocol",
  description: "A detailed breakdown of the ARTHA payment architecture.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-parchment text-charcoal font-body flex flex-col items-center overflow-hidden">
      <main className="w-full flex flex-col items-center pt-32 lg:pt-48 pb-32">
        
        {/* Header Section */}
        <div className="w-full max-w-[1000px] px-6 lg:px-12 flex flex-col animate-[fade-in-up_600ms_cubic-bezier(0.0,0.0,0.2,1)_forwards] opacity-0">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-[1px] bg-terracotta"></span>
            <span className="font-ui text-[11px] tracking-[0.2em] uppercase text-terracotta font-semibold">
              Architecture
            </span>
          </div>
          
          <h1 className="font-display font-medium text-[48px] leading-[1.05] tracking-tight text-charcoal sm:text-[64px] lg:text-[80px] text-balance mb-8">
            The mechanics of autonomy.
          </h1>
          <p className="font-body text-[20px] lg:text-[24px] text-text-secondary leading-relaxed max-w-2xl">
            A precise technical breakdown of how the ARTHA protocol replaces traditional fiat gateways with absolute programmatic certainty.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="w-full max-w-[1000px] px-6 lg:px-12 mt-20 lg:mt-32 flex flex-col gap-24 animate-[fade-in-up_600ms_cubic-bezier(0.0,0.0,0.2,1)_150ms_forwards] opacity-0">
          
          {/* Step 1 */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 border-t border-border-subtle pt-12">
            <div className="md:col-span-4 flex flex-col">
              <span className="font-mono text-[14px] text-terracotta mb-4">Phase 01</span>
              <h2 className="font-display text-3xl lg:text-4xl text-charcoal">Protocol Deployment</h2>
            </div>
            <div className="md:col-span-8 flex flex-col font-body text-[18px] lg:text-[20px] leading-[1.6] text-text-secondary space-y-6">
              <p>
                The lifecycle begins entirely on your terms. You initialize an isolated smart contract on the blockchain network of your choice. This contract acts as your autonomous vault and access controller.
              </p>
              <p>
                There is no approval process. You define the subscription tiers, the duration of access, and the required payment amount directly within the contract state. Once deployed, the rules are immutable and entirely under your cryptographic control.
              </p>
            </div>
          </section>

          {/* Step 2 */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 border-t border-border-subtle pt-12">
            <div className="md:col-span-4 flex flex-col">
              <span className="font-mono text-[14px] text-terracotta mb-4">Phase 02</span>
              <h2 className="font-display text-3xl lg:text-4xl text-charcoal">The Minting Event</h2>
            </div>
            <div className="md:col-span-8 flex flex-col font-body text-[18px] lg:text-[20px] leading-[1.6] text-text-secondary space-y-6">
              <p>
                When a user decides to subscribe to your product, they interact with the ARTHA frontend component embedded in your website. This triggers a transaction request to their digital wallet.
              </p>
              <p>
                Upon confirming the transaction, the specified crypto funds are transferred into your smart contract vault. Simultaneously, the contract mints a unique cryptographic token directly to the wallet of the user. This token represents their active subscription.
              </p>
            </div>
          </section>

          {/* Step 3 */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 border-t border-border-subtle pt-12">
            <div className="md:col-span-4 flex flex-col">
              <span className="font-mono text-[14px] text-terracotta mb-4">Phase 03</span>
              <h2 className="font-display text-3xl lg:text-4xl text-charcoal">Cryptographic Verification</h2>
            </div>
            <div className="md:col-span-8 flex flex-col font-body text-[18px] lg:text-[20px] leading-[1.6] text-text-secondary space-y-6">
              <p>
                Your application backend no longer relies on centralized databases or third party webhooks to determine if a user has paid. Instead, it queries the blockchain directly.
              </p>
              <p>
                When the user attempts to access a premium route, your server simply checks their connected wallet address. If the wallet holds a valid, unexpired subscription token issued by your contract, access is granted. The verification is mathematically proven and cannot be spoofed.
              </p>
            </div>
          </section>

          {/* Step 4 */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 border-t border-border-subtle pt-12">
            <div className="md:col-span-4 flex flex-col">
              <span className="font-mono text-[14px] text-terracotta mb-4">Phase 04</span>
              <h2 className="font-display text-3xl lg:text-4xl text-charcoal">Autonomous Settlement</h2>
            </div>
            <div className="md:col-span-8 flex flex-col font-body text-[18px] lg:text-[20px] leading-[1.6] text-text-secondary space-y-6">
              <p>
                In standard systems, your funds are held hostage by the payment processor until scheduled payout dates. With ARTHA, the concept of settlement is completely rewritten.
              </p>
              <p>
                The revenue generated from minting events sits directly in your smart contract vault. You possess the exclusive administrative rights to call the withdrawal function. When you do, the entire balance is transferred to your personal wallet instantly. The liquidity is yours the moment the transaction clears.
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
