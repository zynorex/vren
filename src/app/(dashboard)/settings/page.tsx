import React from "react";
import { Save, Wallet, Globe, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 max-w-[800px]">
      <div>
        <h1 className="font-display text-[32px] font-medium text-charcoal tracking-tight mb-2">
          Project Settings
        </h1>
        <p className="font-body text-[16px] text-text-secondary">
          Configure your VREN integration, treasury, and app details.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* General Settings */}
        <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-border-subtle pb-4">
            <Globe className="w-5 h-5 text-terracotta" />
            <h2 className="font-display text-[20px] font-medium text-charcoal">General Information</h2>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block font-ui text-[13px] font-semibold text-charcoal mb-1.5">Project Name</label>
              <input 
                type="text" 
                defaultValue="Acme Corp" 
                className="w-full px-4 py-2 bg-[#fafafa] border border-border-subtle rounded-md font-ui text-[14px] focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all"
              />
            </div>
            
            <div>
              <label className="block font-ui text-[13px] font-semibold text-charcoal mb-1.5">Support Email</label>
              <input 
                type="email" 
                defaultValue="support@acmecorp.com" 
                className="w-full px-4 py-2 bg-[#fafafa] border border-border-subtle rounded-md font-ui text-[14px] focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all"
              />
              <p className="font-ui text-[12px] text-text-muted mt-1.5">Users will see this email in their payment receipts.</p>
            </div>
          </div>
        </div>

        {/* Treasury Settings */}
        <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-border-subtle pb-4">
            <Wallet className="w-5 h-5 text-terracotta" />
            <h2 className="font-display text-[20px] font-medium text-charcoal">Treasury & Smart Contract</h2>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block font-ui text-[13px] font-semibold text-charcoal mb-1.5">Payout Wallet Address</label>
              <input 
                type="text" 
                defaultValue="0x71C7656EC7ab88b098defB751B7401B5f6d8976F" 
                className="w-full px-4 py-2 bg-[#fafafa] border border-border-subtle rounded-md font-mono text-[13px] focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all"
              />
              <p className="font-ui text-[12px] text-text-muted mt-1.5">All USDC subscription revenue will be routed instantly to this address. We recommend using a multisig (e.g., Safe).</p>
            </div>

            <div>
              <label className="block font-ui text-[13px] font-semibold text-charcoal mb-1.5">Contract Network</label>
              <div className="flex items-center gap-3">
                <div className="px-3 py-2 bg-[#f5f3ec] border border-border-subtle rounded-md flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                  <span className="font-ui text-[13px] font-medium text-charcoal">Polygon Mainnet</span>
                </div>
                <button className="font-ui text-[13px] text-text-secondary hover:text-charcoal underline">Switch Network</button>
              </div>
            </div>
          </div>
        </div>

        {/* Webhooks */}
        <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-border-subtle pb-4">
            <Bell className="w-5 h-5 text-terracotta" />
            <h2 className="font-display text-[20px] font-medium text-charcoal">Webhooks</h2>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block font-ui text-[13px] font-semibold text-charcoal mb-1.5">Endpoint URL</label>
              <input 
                type="url" 
                placeholder="https://api.yourdomain.com/webhooks/vren" 
                defaultValue="https://api.acmecorp.com/webhooks/vren"
                className="w-full px-4 py-2 bg-[#fafafa] border border-border-subtle rounded-md font-mono text-[13px] focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all"
              />
              <p className="font-ui text-[12px] text-text-muted mt-1.5">We will send POST requests here when subscriptions are created, renewed, or cancelled.</p>
            </div>
            
            <div>
              <label className="block font-ui text-[13px] font-semibold text-charcoal mb-1.5">Webhook Secret</label>
              <div className="flex items-center gap-2">
                <code className="px-3 py-2 bg-[#f5f5f5] border border-border-subtle rounded-md font-mono text-[13px] text-text-secondary flex-1">
                  whsec_8f92kdj39ska02mcd83jf9
                </code>
                <button className="px-4 py-2 border border-border-subtle bg-white rounded-md font-ui text-[13px] text-charcoal shadow-sm hover:bg-[#fafafa] transition-colors">
                  Reveal
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-terracotta text-white rounded-md hover:bg-[#c94b46] transition-colors font-ui text-[14px] font-semibold shadow-md">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
