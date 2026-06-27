import React from "react";
import { Search, Filter, MoreHorizontal, ArrowUpDown } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { truncateAddress, formatDate, formatUSDC } from "@/lib/utils";

export default async function SubscribersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const developer = await db.developer.findUnique({
    where: { wallet: session.user.id },
    include: { apps: { select: { id: true } } },
  });

  const appIds = developer?.apps.map((a) => a.id) ?? [];
  const now = new Date();

  const [subscribers, total] = appIds.length === 0
    ? [[], 0]
    : await Promise.all([
        db.subscriber.findMany({
          where: { appId: { in: appIds } },
          include: { plan: { select: { name: true, price: true, duration: true } } },
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
        db.subscriber.count({ where: { appId: { in: appIds } } }),
      ]);

  type SubRow = { id: string; wallet: string; active: boolean; expiry: Date; createdAt: Date; plan: { name: string; price: string; duration: number } };

  const rows = (subscribers as SubRow[]).map((sub) => {
    const priceUsd = Number(sub.plan.price) / 1_000_000;
    const durationMonths = sub.plan.duration / (30 * 24 * 3600);
    const monthsSince = (now.getTime() - sub.createdAt.getTime()) / (30 * 24 * 3600 * 1000);
    const renewals = Math.max(1, Math.ceil(monthsSince / durationMonths));
    const ltvUsd = priceUsd * renewals;
    const isActive = sub.active && sub.expiry > now;
    return { ...sub, ltvUsd, isActive };
  });

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[32px] font-medium text-charcoal tracking-tight mb-2">
            Subscribers
          </h1>
          <p className="font-body text-[16px] text-text-secondary max-w-150">
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
          <div className="relative flex-1 max-w-80">
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
          <table className="w-full text-left border-collapse min-w-200">
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
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center font-ui text-[14px] text-text-muted">
                    No subscribers yet.
                  </td>
                </tr>
              ) : rows.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#fafafa] transition-colors group">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-charcoal to-terracotta opacity-80 flex items-center justify-center shadow-inner">
                        <span className="font-ui text-[10px] text-white font-bold">{sub.wallet.slice(2,4).toUpperCase()}</span>
                      </div>
                      <span className="font-mono text-[14px] text-charcoal">{truncateAddress(sub.wallet)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 font-ui text-[14px] text-charcoal font-medium">{sub.plan.name}</td>
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full font-ui text-[11px] font-semibold uppercase tracking-wider ${sub.isActive ? "bg-[#eefcf0] text-[#28C840]" : "bg-[#f5f5f5] text-text-muted"}`}>
                      {sub.isActive ? "Active" : "Expired"}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-mono text-[13px] text-text-secondary">{formatDate(sub.createdAt)}</td>
                  <td className="py-4 px-5 font-mono text-[14px] text-charcoal text-right">{formatUSDC(String(Math.round(sub.ltvUsd * 1_000_000)))}</td>
                  <td className="py-4 px-5 text-right">
                    <button className="p-2 text-text-muted hover:text-charcoal hover:bg-white rounded-md transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-transparent group-hover:border-border-subtle">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-charcoal to-terracotta opacity-80 flex items-center justify-center shadow-inner">
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
          <span className="font-ui text-[13px] text-text-secondary">Showing 1â€“{rows.length} of {(total as number).toLocaleString()}</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 border border-border-subtle bg-white rounded-md font-ui text-[13px] text-text-muted cursor-not-allowed">Previous</button>
            <button className="px-3 py-1.5 border border-border-subtle bg-white rounded-md font-ui text-[13px] text-charcoal hover:bg-[#f5f3ec] transition-colors shadow-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

