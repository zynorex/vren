import React from "react";
import { TrendingUp, TrendingDown, DollarSign, Users, Activity, BarChart2 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[32px] font-medium text-charcoal tracking-tight mb-2">
            Analytics
          </h1>
          <p className="font-body text-[16px] text-text-secondary max-w-[600px]">
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
              <span className="font-mono text-[24px] text-charcoal font-medium">$14.80</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-ui text-[13px]">
            <TrendingUp className="w-4 h-4 text-[#28C840]" />
            <span className="text-[#28C840] font-medium">+2.1%</span>
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
              <span className="font-mono text-[24px] text-charcoal font-medium">$285.00</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-ui text-[13px]">
            <TrendingUp className="w-4 h-4 text-[#28C840]" />
            <span className="text-[#28C840] font-medium">+15.3%</span>
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
              <span className="font-mono text-[24px] text-charcoal font-medium">104%</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-ui text-[13px]">
            <TrendingDown className="w-4 h-4 text-terracotta" />
            <span className="text-terracotta font-medium">-1.2%</span>
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
            {[
              { name: "Pro Tier", pct: 65, color: "bg-charcoal" },
              { name: "Business", pct: 25, color: "bg-terracotta" },
              { name: "Starter", pct: 10, color: "bg-[#d5d0c4]" },
            ].map((plan, i) => (
              <div key={i}>
                <div className="flex justify-between font-ui text-[14px] mb-2">
                  <span className="text-charcoal font-medium">{plan.name}</span>
                  <span className="text-text-secondary">{plan.pct}%</span>
                </div>
                <div className="w-full h-3 bg-[#f5f3ec] rounded-full overflow-hidden">
                  <div className={`h-full ${plan.color} rounded-full`} style={{ width: `${plan.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
