import React from "react";
import { Plus, Check, MoreVertical, Edit2, Archive, Globe } from "lucide-react";

export default function PlansPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[32px] font-medium text-charcoal tracking-tight mb-2">
            Subscription Plans
          </h1>
          <p className="font-body text-[16px] text-text-secondary max-w-[600px]">
            Configure and manage your available tiers. Changes sync instantly to your smart contract.
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-charcoal text-parchment rounded-md hover:bg-charcoal/90 transition-colors font-ui text-[14px] font-medium shadow-md">
          <Plus className="w-4 h-4" />
          Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pro Plan Card */}
        <div className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden group hover:border-terracotta/30 transition-colors">
          <div className="absolute top-0 right-0 p-4">
            <button className="text-text-muted hover:text-charcoal transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f5f3ec] text-charcoal font-ui text-[11px] font-semibold uppercase tracking-wider w-fit mb-4">
            <Globe className="w-3 h-3" /> Published
          </div>
          
          <h3 className="font-display text-[24px] font-medium text-charcoal mb-1">Pro Tier</h3>
          <p className="font-body text-[14px] text-text-secondary mb-6 line-clamp-2">
            Full access to premium features, high rate limits, and priority support.
          </p>
          
          <div className="flex items-end gap-1 mb-6">
            <span className="font-mono text-[32px] text-charcoal leading-none">$19</span>
            <span className="font-ui text-[14px] text-text-muted">/ month</span>
          </div>

          <div className="space-y-3 mb-8 flex-1">
            {['10,000 API requests', 'Premium component library', '48h support response time'].map((feature, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="mt-0.5 w-4 h-4 rounded-full bg-charcoal/5 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-charcoal" />
                </div>
                <span className="font-body text-[14px] text-charcoal">{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-5 border-t border-border-subtle flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-ui text-[11px] uppercase tracking-wider font-semibold text-text-muted mb-1">Active Subs</span>
              <span className="font-mono text-[16px] text-charcoal">642</span>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 border border-border-subtle rounded-md hover:bg-[#fafafa] text-text-secondary transition-colors" title="Edit">
                <Edit2 className="w-4 h-4" />
              </button>
              <button className="p-2 border border-border-subtle rounded-md hover:bg-[#fff0f0] hover:text-terracotta hover:border-terracotta/30 text-text-secondary transition-colors" title="Archive">
                <Archive className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Business Plan Card */}
        <div className="bg-white border-2 border-charcoal rounded-2xl p-6 shadow-md flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4">
            <button className="text-text-muted hover:text-charcoal transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f5f3ec] text-charcoal font-ui text-[11px] font-semibold uppercase tracking-wider w-fit mb-4">
            <Globe className="w-3 h-3" /> Published
          </div>
          
          <h3 className="font-display text-[24px] font-medium text-charcoal mb-1">Business</h3>
          <p className="font-body text-[14px] text-text-secondary mb-6 line-clamp-2">
            For teams requiring unlimited scale and dedicated onboarding.
          </p>
          
          <div className="flex items-end gap-1 mb-6">
            <span className="font-mono text-[32px] text-charcoal leading-none">$79</span>
            <span className="font-ui text-[14px] text-text-muted">/ month</span>
          </div>

          <div className="space-y-3 mb-8 flex-1">
            {['Unlimited API requests', 'White-labeling options', '1h dedicated support', 'Custom contract deployment'].map((feature, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="mt-0.5 w-4 h-4 rounded-full bg-charcoal flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="font-body text-[14px] text-charcoal">{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-5 border-t border-border-subtle flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-ui text-[11px] uppercase tracking-wider font-semibold text-text-muted mb-1">Active Subs</span>
              <span className="font-mono text-[16px] text-charcoal">200</span>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 border border-border-subtle rounded-md hover:bg-[#fafafa] text-text-secondary transition-colors" title="Edit">
                <Edit2 className="w-4 h-4" />
              </button>
              <button className="p-2 border border-border-subtle rounded-md hover:bg-[#fff0f0] hover:text-terracotta hover:border-terracotta/30 text-text-secondary transition-colors" title="Archive">
                <Archive className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Draft Plan Card */}
        <div className="bg-[#fafafa] border border-dashed border-border-subtle rounded-2xl p-6 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4">
            <button className="text-text-muted hover:text-charcoal transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-border-subtle text-text-muted font-ui text-[11px] font-semibold uppercase tracking-wider w-fit mb-4">
            Draft
          </div>
          
          <h3 className="font-display text-[24px] font-medium text-text-muted mb-1">Enterprise</h3>
          <p className="font-body text-[14px] text-text-muted mb-6 line-clamp-2">
            Custom solutions for massive scale operations.
          </p>
          
          <div className="flex items-end gap-1 mb-6 opacity-50">
            <span className="font-mono text-[32px] text-charcoal leading-none">$299</span>
            <span className="font-ui text-[14px] text-text-muted">/ month</span>
          </div>

          <div className="space-y-3 mb-8 flex-1 opacity-50">
            {['Self-hosted infrastructure', 'SLA guarantee', 'Account manager'].map((feature, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="mt-0.5 w-4 h-4 rounded-full bg-charcoal/5 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-charcoal" />
                </div>
                <span className="font-body text-[14px] text-charcoal">{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-5 border-t border-border-subtle flex justify-end">
            <button className="px-4 py-2 border border-border-subtle bg-white rounded-md font-ui text-[13px] text-charcoal shadow-sm hover:border-charcoal transition-colors">
              Edit Draft
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
