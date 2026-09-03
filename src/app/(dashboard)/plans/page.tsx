import React from "react";
import { Plus, Check, MoreVertical, Edit2, Archive, Globe } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { formatUSDC, getDurationLabel } from "@/lib/utils";

export default async function PlansPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const developer = await db.developer.findUnique({
    where: { wallet: session.user.id },
    include: { apps: { select: { id: true } } },
  });

  const appIds = developer?.apps.map((a) => a.id) ?? [];
  const now = new Date();

  const plans = appIds.length === 0
    ? []
    : await db.plan.findMany({
        where: { appId: { in: appIds } },
        include: { _count: { select: { subscribers: true } } },
        orderBy: { onchainIdx: "asc" },
      });

  // Active subscriber counts per plan
  const activeCounts = appIds.length === 0
    ? {}
    : Object.fromEntries(
        await Promise.all(
          plans.map(async (p) => [
            p.id,
            await db.subscriber.count({ where: { planId: p.id, active: true, expiry: { gt: now } } }),
          ])
        )
      );

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[32px] font-medium text-charcoal tracking-tight mb-2">
            Subscription Plans
          </h1>
          <p className="font-body text-[16px] text-text-secondary max-w-150">
            Configure and manage your available tiers. Changes sync instantly to your smart contract.
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-charcoal text-parchment rounded-md hover:bg-charcoal/90 transition-colors font-ui text-[14px] font-medium shadow-md">
          <Plus className="w-4 h-4" />
          Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.length === 0 ? (
          <div className="col-span-3 bg-white border border-dashed border-border-subtle rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <Globe className="w-10 h-10 text-text-muted mb-4" />
            <h3 className="font-display text-[20px] font-medium text-charcoal mb-2">No plans yet</h3>
            <p className="font-body text-[14px] text-text-secondary mb-6 max-w-85">
              Create your first subscription plan. Plans are deployed on-chain to your VrenSubscription contract.
            </p>
          </div>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden group hover:border-terracotta/30 transition-colors">
              <div className="absolute top-0 right-0 p-4">
                <button className="text-text-muted hover:text-charcoal transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-ui text-[11px] font-semibold uppercase tracking-wider w-fit mb-4 ${
                plan.active
                  ? "bg-[#f5f3ec] text-charcoal"
                  : "bg-white border border-border-subtle text-text-muted"
              }`}>
                <Globe className="w-3 h-3" />
                {plan.active ? "Published" : "Inactive"}
              </div>

              <h3 className="font-display text-[24px] font-medium text-charcoal mb-1">{plan.name}</h3>
              <p className="font-body text-[14px] text-text-secondary mb-6">
                Onchain index #{plan.onchainIdx}
              </p>

              <div className="flex items-end gap-1 mb-6">
                <span className="font-mono text-[32px] text-charcoal leading-none">{formatUSDC(plan.price)}</span>
                <span className="font-ui text-[14px] text-text-muted">{getDurationLabel(plan.duration)}</span>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-charcoal/5 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-charcoal" />
                  </div>
                  <span className="font-body text-[14px] text-charcoal">Duration: {getDurationLabel(plan.duration).replace("/ ", "")}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-charcoal/5 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-charcoal" />
                  </div>
                  <span className="font-body text-[14px] text-charcoal">ERC-1155 subscription NFT</span>
                </div>
              </div>

              <div className="pt-5 border-t border-border-subtle flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-ui text-[11px] uppercase tracking-wider font-semibold text-text-muted mb-1">Active Subs</span>
                  <span className="font-mono text-[16px] text-charcoal">{(activeCounts[plan.id] ?? 0).toLocaleString()}</span>
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
          ))
        )}

      </div>
    </div>
  );
}

