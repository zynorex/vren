import React from "react";
import { Download, ExternalLink, Search } from "lucide-react";

export default function TransactionsPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[32px] font-medium text-charcoal tracking-tight mb-2">
            Transactions
          </h1>
          <p className="font-body text-[16px] text-text-secondary max-w-[600px]">
            Immutable history of all on-chain payments, mints, and renewals.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-subtle rounded-md hover:bg-[#fafafa] transition-colors font-ui text-[13px] text-charcoal shadow-sm">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white border border-border-subtle rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border-subtle flex gap-4 bg-[#fafafa]">
          <div className="relative flex-1 max-w-[400px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search by TxHash, Wallet, or Block..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-border-subtle rounded-md font-mono text-[13px] placeholder:font-ui placeholder:text-text-muted focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-border-subtle bg-[#fcfcfc]">
                <th className="py-3 px-5 font-ui text-[12px] uppercase tracking-wider font-semibold text-text-secondary">Type</th>
                <th className="py-3 px-5 font-ui text-[12px] uppercase tracking-wider font-semibold text-text-secondary">Amount</th>
                <th className="py-3 px-5 font-ui text-[12px] uppercase tracking-wider font-semibold text-text-secondary">From (Wallet)</th>
                <th className="py-3 px-5 font-ui text-[12px] uppercase tracking-wider font-semibold text-text-secondary">Plan</th>
                <th className="py-3 px-5 font-ui text-[12px] uppercase tracking-wider font-semibold text-text-secondary">Date & Time</th>
                <th className="py-3 px-5 font-ui text-[12px] uppercase tracking-wider font-semibold text-text-secondary">TxHash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {[
                { type: "New Sub", amount: "$19.00", wallet: "0x1A4...9f2", plan: "Pro Tier", date: "Today, 14:32", tx: "0x8f2a...19b4" },
                { type: "Renewal", amount: "$79.00", wallet: "0x8B2...3a1", plan: "Business", date: "Today, 11:14", tx: "0x3c9e...82d1" },
                { type: "New Sub", amount: "$19.00", wallet: "0x9C3...2e8", plan: "Pro Tier", date: "Yesterday, 16:45", tx: "0x5a7d...34f9" },
                { type: "New Sub", amount: "$19.00", wallet: "0x2D5...7b6", plan: "Pro Tier", date: "Yesterday, 09:20", tx: "0x1b4c...98e2" },
                { type: "Renewal", amount: "$79.00", wallet: "0x7E6...1d3", plan: "Business", date: "Oct 12, 18:05", tx: "0x9d2f...56a7" },
                { type: "New Sub", amount: "$19.00", wallet: "0x71C...49B", plan: "Pro Tier", date: "Oct 12, 10:30", tx: "0x4e1a...23c8" },
              ].map((tx, i) => (
                <tr key={i} className="hover:bg-[#fafafa] transition-colors group">
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md font-ui text-[11px] font-semibold uppercase tracking-wider border ${tx.type === 'New Sub' ? 'border-[#28C840]/30 bg-[#eefcf0] text-[#28C840]' : 'border-[#4A90E2]/30 bg-[#f0f7ff] text-[#4A90E2]'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-mono text-[14px] text-charcoal font-medium">{tx.amount} <span className="text-text-muted text-[12px] ml-1">USDC</span></td>
                  <td className="py-4 px-5 font-mono text-[14px] text-charcoal">{tx.wallet}</td>
                  <td className="py-4 px-5 font-ui text-[14px] text-text-secondary">{tx.plan}</td>
                  <td className="py-4 px-5 font-mono text-[13px] text-text-secondary">{tx.date}</td>
                  <td className="py-4 px-5">
                    <a href="#" className="flex items-center gap-1.5 font-mono text-[13px] text-terracotta hover:underline">
                      {tx.tx} <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
