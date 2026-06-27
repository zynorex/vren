import React from "react";
import { TrendingUp, TrendingDown, DollarSign, Users, Activity, BarChart2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { calcMRR, formatUSD, growthRate } from "@/lib/utils";

export default async function AnalyticsPage() {
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

  const [currentSubs, prevSubs, churned, prevChurned, newThis, newPrev] =
    appIds.length === 0
      ? [[], [], 0, 0, 0, 0]
      : await Promise.all([
          db.subscriber.findMany({
            where: { appId: { in: appIds }, expiry: { gt: now } },
            include: { plan: { select: { id: true, name: true, price: true, duration: true } } },
          }),
          db.subscriber.findMany({
            where: { appId: { in: appIds }, createdAt: { lt: d30 }, expiry: { gt: d30 } },
            include: { plan: { select: { id: true, name: true, price: true, duration: true } } },
          }),
          db.subscriber.count({ where: { appId: { in: appIds }, active: false, updatedAt: { gte: d30 } } }),
          db.subscriber.count({ where: { appId: { in: appIds }, active: false, updatedAt: { gte: d60, lt: d30 } } }),
          db.subscriber.count({ where: { appId: { in: appIds }, createdAt: { gte: d30 } } }),
          db.subscriber.count({ where: { appId: { in: appIds }, createdAt: { gte: d60, lt: d30 } } }),
        ]);

  type SubWithPlan = { plan: { id: string; name: string; price: string; duration: number } };
  const currentMRR = calcMRR((currentSubs as SubWithPlan[]).map((s) => s.plan));
  const prevMRR = calcMRR((prevSubs as SubWithPlan[]).map((s) => s.plan));
  const activeCount = (currentSubs as unknown[]).length;
  const prevCount = (prevSubs as unknown[]).length;
  const churnedN = churned as number;
  const churnRate = activeCount + churnedN > 0 ? (churnedN / (activeCount + churnedN)) * 100 : 0;
  const prevChurnedN = prevChurned as number;
  const prevChurnRate = prevCount + prevChurnedN > 0 ? (prevChurnedN / (prevCount + prevChurnedN)) * 100 : 0;
  const churnDelta = churnRate - prevChurnRate;
  const arpu = activeCount > 0 ? currentMRR / activeCount : 0;
  const ltv = arpu * 12;
  const arpuGrowth = growthRate(arpu, prevCount > 0 ? prevMRR / prevCount : 0);
  const newGrowth = growthRate(newThis as number, newPrev as number);

  // Revenue by plan breakdown
  const planRevenue: Record<string, { name: string; mrr: number }> = {};
  for (const sub of currentSubs as SubWithPlan[]) {
    const { id, name, price, duration } = sub.plan;
    const contribution = (Number(price) / 1_000_000) * ((30 * 24 * 3600) / duration);
    if (!planRevenue[id]) planRevenue[id] = { name, mrr: 0 };
    planRevenue[id].mrr += contribution;
  }
  const planBreakdown = Object.values(planRevenue)
    .map((p) => ({ name: p.name, pct: currentMRR > 0 ? Math.round((p.mrr / currentMRR) * 100) : 0 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);

  const COLORS = ["bg-charcoal", "bg-terracotta", "bg-[#d5d0c4]", "bg-[#b5b0a4]", "bg-[#958f84]"];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[32px] font-medium text-charcoal tracking-tight mb-2">
            Analytics
          </h1>
          <p className="font-body text-[16px] text-text-secondary max-w-150">
            Deep dive into your revenue metrics, user retention, and contract interactions.
          </p>
        </div>
        <div className="flex items-center gap-2 font-ui text-[13px] bg-white border border-border-subtle rounded-md p-1 shadow-sm">
          <button className="px-4 py-1.5 rounded bg-[#f5f3ec] text-charcoal font-semibold">30D</button>
          <button className="px-4 py-1.5 rounded hover:bg-[#fafafa] text-text-secondary transition-colors">90D</button>
          <button className="px-4 py-1.5 rounded hover:bg-[#fafafa] text-text-secondary transition-colors">YTD</button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#f5f3ec] flex items-center justify-center text-terracotta">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="font-ui text-[13px] font-semibold text-text-secondary uppercase tracking-wider block">Avg Rev Per User</span>
              <span className="font-mono text-[24px] text-charcoal font-medium">{formatUSD(arpu, 2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-ui text-[13px]">
            {arpuGrowth >= 0 ? <TrendingUp className="w-4 h-4 text-[#28C840]" /> : <TrendingDown className="w-4 h-4 text-terracotta" />}
            <span className={arpuGrowth >= 0 ? "text-[#28C840] font-medium" : "text-terracotta font-medium"}>{arpuGrowth >= 0 ? "+" : ""}{arpuGrowth.toFixed(1)}%</span>
            <span className="text-text-muted">vs previous period</span>
          </div>
        </div>

        <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#f5f3ec] flex items-center justify-center text-terracotta">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="font-ui text-[13px] font-semibold text-text-secondary uppercase tracking-wider block">Customer LTV</span>
              <span className="font-mono text-[24px] text-charcoal font-medium">{formatUSD(ltv, 2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-ui text-[13px]">
            {newGrowth >= 0 ? <TrendingUp className="w-4 h-4 text-[#28C840]" /> : <TrendingDown className="w-4 h-4 text-terracotta" />}
            <span className={newGrowth >= 0 ? "text-[#28C840] font-medium" : "text-terracotta font-medium"}>{newGrowth >= 0 ? "+" : ""}{newGrowth.toFixed(1)}%</span>
            <span className="text-text-muted">vs previous period</span>
          </div>
        </div>

        <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#f5f3ec] flex items-center justify-center text-terracotta">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-ui text-[13px] font-semibold text-text-secondary uppercase tracking-wider block">Net Retention</span>
              <span className="font-mono text-[24px] text-charcoal font-medium">{churnRate.toFixed(1)}%</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-ui text-[13px]">
            {churnDelta <= 0 ? <TrendingDown className="w-4 h-4 text-[#28C840]" /> : <TrendingUp className="w-4 h-4 text-terracotta" />}
            <span className={churnDelta <= 0 ? "text-[#28C840] font-medium" : "text-terracotta font-medium"}>{churnDelta >= 0 ? "+" : ""}{churnDelta.toFixed(1)}%</span>
            <span className="text-text-muted">vs previous period</span>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Retention Cohorts Mock */}
        <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6 border-b border-border-subtle pb-4">
            <Users className="w-5 h-5 text-terracotta" />
            <h2 className="font-display text-[20px] font-medium text-charcoal">User Retention</h2>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center py-10 opacity-70">
            <BarChart2 className="w-12 h-12 text-text-muted mb-4" />
            <p className="font-ui text-[14px] text-text-secondary">Cohort retention chart will populate after 60 days of data.</p>
          </div>
        </div>

        {/* Plan Distribution Mock */}
        <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6 border-b border-border-subtle pb-4">
            <DollarSign className="w-5 h-5 text-terracotta" />
            <h2 className="font-display text-[20px] font-medium text-charcoal">Revenue by Plan</h2>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-6 py-4">
            {planBreakdown.length === 0 ? (
              <div className="flex-1 flex items-center justify-center py-8">
                <p className="font-ui text-[14px] text-text-muted">No subscriber data yet.</p>
              </div>
            ) : (
              planBreakdown.map((plan, i) => (
                <div key={plan.name}>
                  <div className="flex justify-between font-ui text-[14px] mb-2">
                    <span className="text-charcoal font-medium">{plan.name}</span>
                    <span className="text-text-secondary">{plan.pct}%</span>
                  </div>
                  <div className="w-full h-3 bg-[#f5f3ec] rounded-full overflow-hidden">
                    <div className={`h-full ${COLORS[i] ?? "bg-charcoal"} rounded-full`} style={{ width: `${plan.pct}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

