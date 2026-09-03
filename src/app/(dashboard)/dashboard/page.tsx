import React from "react";
import { ArrowUpRight, ArrowDownRight, CreditCard, Users, DollarSign, Activity } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { calcMRR, formatUSD, formatDelta, growthRate, truncateAddress, formatRelativeTime, formatUSDC } from "@/lib/utils";

export default async function DashboardOverviewPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const developer = await db.developer.findUnique({
    where: { wallet: session.user.id },
    include: { apps: { select: { id: true } } },
  });

  const appIds = developer?.apps.map((a) => a.id) ?? [];
  const now = new Date();
  const d30 = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
  const d60 = new Date(now.getTime() - 60 * 24 * 3600 * 1000);

  const [currentSubs, prevSubs, churned, recentTxns, txns30d, prevTxns30d] =
    appIds.length === 0
      ? [[], [], 0, [], [], []]
      : await Promise.all([
          db.subscriber.findMany({
            where: { appId: { in: appIds }, expiry: { gt: now } },
            include: { plan: { select: { price: true, duration: true } } },
          }),
          db.subscriber.findMany({
            where: { appId: { in: appIds }, createdAt: { lt: d30 }, expiry: { gt: d30 } },
            include: { plan: { select: { price: true, duration: true } } },
          }),
          db.subscriber.count({
            where: { appId: { in: appIds }, active: false, updatedAt: { gte: d30 } },
          }),
          db.transaction.findMany({
            where: { appId: { in: appIds } },
            include: { plan: { select: { name: true } } },
            orderBy: { createdAt: "desc" },
            take: 6,
          }),
          db.transaction.findMany({
            where: { appId: { in: appIds }, createdAt: { gte: d30 } },
            select: { usdcAmount: true },
          }),
          db.transaction.findMany({
            where: { appId: { in: appIds }, createdAt: { gte: d60, lt: d30 } },
            select: { usdcAmount: true },
          }),
        ]);

  const currentMRR = calcMRR((currentSubs as { plan: { price: string; duration: number } }[]).map((s) => s.plan));
  const prevMRR = calcMRR((prevSubs as { plan: { price: string; duration: number } }[]).map((s) => s.plan));
  const mrrGrowth = growthRate(currentMRR, prevMRR);

  const activeCount = (currentSubs as unknown[]).length;
  const prevCount = (prevSubs as unknown[]).length;
  const subGrowth = growthRate(activeCount, prevCount);

  const churnedCount = churned as number;
  const churnRate = activeCount + churnedCount > 0 ? (churnedCount / (activeCount + churnedCount)) * 100 : 0;

  const sumVol = (txs: { usdcAmount: string | null }[]) =>
    txs.reduce((s, t) => s + (t.usdcAmount ? Number(t.usdcAmount) / 1_000_000 : 0), 0);
  const vol30d = sumVol(txns30d as { usdcAmount: string | null }[]);
  const prevVol30d = sumVol(prevTxns30d as { usdcAmount: string | null }[]);
  const volGrowth = growthRate(vol30d, prevVol30d);

  const mrrFormatted = formatUSD(currentMRR, 0);
  const volFormatted = formatUSD(vol30d, 0);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-[32px] font-medium text-charcoal tracking-tight mb-2">
          Overview
        </h1>
        <p className="font-body text-[16px] text-text-secondary">
          Monitor your MRR, subscription health, and recent blockchain transactions.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* MRR Card */}
        <div className="bg-white border border-border-subtle rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="font-ui text-[13px] font-semibold text-text-secondary uppercase tracking-wider">MRR</span>
            <div className="w-8 h-8 rounded-full bg-[#f5f3ec] flex items-center justify-center text-terracotta">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-display text-[32px] text-charcoal font-medium leading-none">{mrrFormatted}</span>
          </div>
          <div className="flex items-center gap-1.5 font-ui text-[13px]">
            {mrrGrowth >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 text-[#28C840]" /> : <ArrowDownRight className="w-3.5 h-3.5 text-terracotta" />}
            <span className={mrrGrowth >= 0 ? "text-[#28C840] font-medium" : "text-terracotta font-medium"}>{formatDelta(mrrGrowth)}</span>
            <span className="text-text-muted">vs last month</span>
          </div>
        </div>

        {/* Active Subscribers Card */}
        <div className="bg-white border border-border-subtle rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="font-ui text-[13px] font-semibold text-text-secondary uppercase tracking-wider">Active Subs</span>
            <div className="w-8 h-8 rounded-full bg-[#f5f3ec] flex items-center justify-center text-terracotta">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-display text-[32px] text-charcoal font-medium leading-none">{activeCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 font-ui text-[13px]">
            {subGrowth >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 text-[#28C840]" /> : <ArrowDownRight className="w-3.5 h-3.5 text-terracotta" />}
            <span className={subGrowth >= 0 ? "text-[#28C840] font-medium" : "text-terracotta font-medium"}>{formatDelta(subGrowth)}</span>
            <span className="text-text-muted">vs last month</span>
          </div>
        </div>

        {/* Churn Rate Card */}
        <div className="bg-white border border-border-subtle rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="font-ui text-[13px] font-semibold text-text-secondary uppercase tracking-wider">Churn Rate</span>
            <div className="w-8 h-8 rounded-full bg-[#f5f3ec] flex items-center justify-center text-terracotta">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-display text-[32px] text-charcoal font-medium leading-none">{churnRate.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-1.5 font-ui text-[13px]">
            <ArrowDownRight className="w-3.5 h-3.5 text-terracotta" />
            <span className="text-terracotta font-medium">0.3%</span>
            <span className="text-text-muted">vs last month</span>
          </div>
        </div>

        {/* Total Volume Card */}
        <div className="bg-white border border-border-subtle rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="font-ui text-[13px] font-semibold text-text-secondary uppercase tracking-wider">Total Vol (30d)</span>
            <div className="w-8 h-8 rounded-full bg-[#f5f3ec] flex items-center justify-center text-terracotta">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-display text-[32px] text-charcoal font-medium leading-none">{volFormatted}</span>
          </div>
          <div className="flex items-center gap-1.5 font-ui text-[13px]">
            {volGrowth >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 text-[#28C840]" /> : <ArrowDownRight className="w-3.5 h-3.5 text-terracotta" />}
            <span className={volGrowth >= 0 ? "text-[#28C840] font-medium" : "text-terracotta font-medium"}>{formatDelta(volGrowth)}</span>
            <span className="text-text-muted">vs last month</span>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-white border border-border-subtle rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-display text-[18px] font-medium text-charcoal">Revenue Growth</h3>
            <div className="flex gap-2 font-ui text-[12px]">
              <button className="px-3 py-1 rounded bg-[#f5f3ec] text-charcoal font-semibold">1M</button>
              <button className="px-3 py-1 rounded hover:bg-[#fafafa] text-text-secondary transition-colors">3M</button>
              <button className="px-3 py-1 rounded hover:bg-[#fafafa] text-text-secondary transition-colors">1Y</button>
              <button className="px-3 py-1 rounded hover:bg-[#fafafa] text-text-secondary transition-colors">ALL</button>
            </div>
          </div>
          
          {/* Static Chart Mockup since Recharts isn't installed */}
          <div className="flex-1 min-h-60 flex items-end gap-2 pt-4 relative">
            {/* Y Axis Guides */}
            <div className="absolute inset-0 flex flex-col justify-between pb-8 z-0">
               {[...Array(5)].map((_, i) => (
                 <div key={i} className="w-full border-b border-border-subtle/50 h-0 flex items-center">
                    <span className="font-mono text-[10px] text-text-muted absolute -left-1 -translate-x-full">
                      ${(15 - i * 3)}k
                    </span>
                 </div>
               ))}
            </div>

            {/* Bars */}
            {[40, 45, 35, 50, 60, 55, 75, 80, 95, 85, 100, 110].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center group z-10 h-full pb-8">
                <div 
                  className="w-full max-w-8 bg-charcoal rounded-t-[4px] opacity-80 group-hover:opacity-100 group-hover:bg-terracotta transition-colors relative"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-charcoal text-parchment font-mono text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ${Math.floor(height * 120)}
                  </div>
                </div>
              </div>
            ))}

            {/* X Axis labels */}
            <div className="absolute bottom-0 left-0 right-0 h-8 flex justify-between items-center font-mono text-[10px] text-text-muted px-2">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display text-[18px] font-medium text-charcoal">Recent Activity</h3>
            <button className="font-ui text-[13px] text-terracotta hover:underline">View all</button>
          </div>
          
          <div className="flex flex-col gap-5 flex-1">
            {(recentTxns as { id: string; type: string; wallet: string; plan: { name: string } | null; createdAt: Date; usdcAmount: string | null }[]).length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="font-ui text-[13px] text-text-muted">No transactions yet.</p>
              </div>
            ) : (
              (recentTxns as { id: string; type: string; wallet: string; plan: { name: string } | null; createdAt: Date; usdcAmount: string | null }[]).map((act) => {
                const isSub = act.type !== "cancelled";
                const amountStr = act.usdcAmount ? (isSub ? "+" : "-") + formatUSDC(act.usdcAmount) : "";
                return (
                  <div key={act.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSub ? "bg-[#eefcf0] text-[#28C840]" : "bg-[#fff0f0] text-terracotta"}`}>
                        {isSub ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-[13px] text-charcoal font-medium">{truncateAddress(act.wallet)}</span>
                        <span className="font-ui text-[12px] text-text-muted">{act.plan?.name ?? "â€”"} â€¢ {formatRelativeTime(act.createdAt)}</span>
                      </div>
                    </div>
                    <span className={`font-mono text-[13px] font-medium ${isSub ? "text-charcoal" : "text-text-muted"}`}>{amountStr}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

