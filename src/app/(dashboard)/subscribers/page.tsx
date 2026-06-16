import React from "react";
import { Search, Filter, MoreHorizontal, ArrowUpDown } from "lucide-react";

export default function SubscribersPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[32px] font-medium text-charcoal tracking-tight mb-2">
            Subscribers
          </h1>
          <p className="font-body text-[16px] text-text-secondary max-w-[600px]">
            Manage your active subscriptions, monitor user health, and view access history.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-subtle rounded-md hover:bg-[#fafafa] transition-colors font-ui text-[13px] text-charcoal shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white border border-border-subtle rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border-subtle flex gap-4 bg-[#fafafa]">
          <div className="relative flex-1 max-w-[320px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search by wallet address..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-border-subtle rounded-md font-mono text-[13px] placeholder:font-ui placeholder:text-text-muted focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border-subtle bg-[#fcfcfc]">
                <th className="py-3 px-5 font-ui text-[12px] uppercase tracking-wider font-semibold text-text-secondary whitespace-nowrap">Subscriber</th>
                <th className="py-3 px-5 font-ui text-[12px] uppercase tracking-wider font-semibold text-text-secondary whitespace-nowrap">Plan</th>
                <th className="py-3 px-5 font-ui text-[12px] uppercase tracking-wider font-semibold text-text-secondary whitespace-nowrap">Status</th>
                <th className="py-3 px-5 font-ui text-[12px] uppercase tracking-wider font-semibold text-text-secondary flex items-center gap-1 cursor-pointer hover:text-charcoal whitespace-nowrap">Joined <ArrowUpDown className="w-3 h-3" /></th>
                <th className="py-3 px-5 font-ui text-[12px] uppercase tracking-wider font-semibold text-text-secondary text-right whitespace-nowrap">LTV</th>
                <th className="py-3 px-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {[
                { wallet: "0x71C...49B", plan: "Pro Tier", status: "Active", joined: "Oct 12, 2025", ltv: "$228.00" },
                { wallet: "0x1A4...9f2", plan: "Pro Tier", status: "Active", joined: "Nov 04, 2025", ltv: "$114.00" },
                { wallet: "0x8B2...3a1", plan: "Business", status: "Active", joined: "Dec 21, 2025", ltv: "$474.00" },
                { wallet: "0x4F1...8c4", plan: "Starter", status: "Expired", joined: "Jan 15, 2026", ltv: "$19.00" },
                { wallet: "0x9C3...2e8", plan: "Pro Tier", status: "Active", joined: "Feb 02, 2026", ltv: "$76.00" },
                { wallet: "0x2D5...7b6", plan: "Starter", status: "Active", joined: "Mar 11, 2026", ltv: "$38.00" },
              ].map((sub, i) => (
                <tr key={i} className="hover:bg-[#fafafa] transition-colors group">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-charcoal to-terracotta opacity-80 flex items-center justify-center shadow-inner">
                        <span className="font-ui text-[10px] text-white font-bold">{sub.wallet.slice(2,4)}</span>
                      </div>
                      <span className="font-mono text-[14px] text-charcoal">{sub.wallet}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 font-ui text-[14px] text-charcoal font-medium">{sub.plan}</td>
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full font-ui text-[11px] font-semibold uppercase tracking-wider ${sub.status === 'Active' ? 'bg-[#eefcf0] text-[#28C840]' : 'bg-[#f5f5f5] text-text-muted'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-mono text-[13px] text-text-secondary">{sub.joined}</td>
                  <td className="py-4 px-5 font-mono text-[14px] text-charcoal text-right">{sub.ltv}</td>
                  <td className="py-4 px-5 text-right">
                    <button className="p-2 text-text-muted hover:text-charcoal hover:bg-white rounded-md transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-transparent group-hover:border-border-subtle">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-border-subtle flex items-center justify-between bg-[#fafafa]">
          <span className="font-ui text-[13px] text-text-secondary">Showing 1-6 of 842</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 border border-border-subtle bg-white rounded-md font-ui text-[13px] text-text-muted cursor-not-allowed">Previous</button>
            <button className="px-3 py-1.5 border border-border-subtle bg-white rounded-md font-ui text-[13px] text-charcoal hover:bg-[#f5f3ec] transition-colors shadow-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
