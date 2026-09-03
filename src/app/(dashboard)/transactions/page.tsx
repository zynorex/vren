import React from "react";
import { Download, ExternalLink, Search } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { truncateAddress, formatDateTime, formatUSDC } from "@/lib/utils";

export default async function TransactionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const developer = await db.developer.findUnique({
    where: { wallet: session.user.id },
    include: { apps: { select: { id: true } } },
  });

  const appIds = developer?.apps.map((a) => a.id) ?? [];

  const transactions = appIds.length === 0
    ? []
    : await db.transaction.findMany({
        where: { appId: { in: appIds } },
        include: { plan: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      });

  type TxRow = { id: string; type: string; usdcAmount: string | null; wallet: string; plan: { name: string } | null; createdAt: Date; transactionHash: string };

  const TYPE_LABELS: Record<string, string> = {
    new_subscription: "New Sub",
    renewal: "Renewal",
    cancelled: "Cancelled",
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[32px] font-medium text-charcoal tracking-tight mb-2">
            Transactions
          </h1>
          <p className="font-body text-[16px] text-text-secondary max-w-150">
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
          <div className="relative flex-1 max-w-100">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search by TxHash, Wallet, or Block..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-border-subtle rounded-md font-mono text-[13px] placeholder:font-ui placeholder:text-text-muted focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-225">
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
              {(transactions as TxRow[]).length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center font-ui text-[14px] text-text-muted">
                    No transactions yet. They will appear here once subscriptions are processed.
                  </td>
                </tr>
              ) : (transactions as TxRow[]).map((tx) => (
                <tr key={tx.id} className="hover:bg-[#fafafa] transition-colors group">
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full font-ui text-[11px] font-semibold uppercase tracking-wider ${
                      tx.type === "cancelled" ? "bg-[#fff0f0] text-terracotta" : "bg-[#eefcf0] text-[#28C840]"
                    }`}>
                      {TYPE_LABELS[tx.type] ?? tx.type}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-mono text-[14px] text-charcoal font-medium">
                    {tx.usdcAmount ? formatUSDC(tx.usdcAmount) : "â€”"} <span className="text-text-muted text-[12px] ml-1">USDC</span>
                  </td>
                  <td className="py-4 px-5 font-mono text-[14px] text-charcoal">{truncateAddress(tx.wallet)}</td>
                  <td className="py-4 px-5 font-ui text-[14px] text-text-secondary">{tx.plan?.name ?? "â€”"}</td>
                  <td className="py-4 px-5 font-mono text-[13px] text-text-secondary">{formatDateTime(tx.createdAt)}</td>
                  <td className="py-4 px-5">
                    <a
                      href={`https://polygonscan.com/tx/${tx.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-mono text-[13px] text-terracotta hover:underline"
                    >
                      {truncateAddress(tx.transactionHash, 6, 4)} <ExternalLink className="w-3 h-3" />
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

