import React from "react";
import { ArrowUpRight, ArrowDownRight, CreditCard, Users, DollarSign, Activity } from "lucide-react";

export default function DashboardOverviewPage() {
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
            <span className="font-display text-[32px] text-charcoal font-medium leading-none">$12,450</span>
          </div>
          <div className="flex items-center gap-1.5 font-ui text-[13px]">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#28C840]" />
            <span className="text-[#28C840] font-medium">14.2%</span>
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
            <span className="font-display text-[32px] text-charcoal font-medium leading-none">842</span>
          </div>
          <div className="flex items-center gap-1.5 font-ui text-[13px]">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#28C840]" />
            <span className="text-[#28C840] font-medium">5.1%</span>
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
            <span className="font-display text-[32px] text-charcoal font-medium leading-none">2.4%</span>
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
            <span className="font-display text-[32px] text-charcoal font-medium leading-none">$15,200</span>
          </div>
          <div className="flex items-center gap-1.5 font-ui text-[13px]">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#28C840]" />
            <span className="text-[#28C840] font-medium">18.4%</span>
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
          <div className="flex-1 min-h-[240px] flex items-end gap-2 pt-4 relative">
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
                  className="w-full max-w-[32px] bg-charcoal rounded-t-[4px] opacity-80 group-hover:opacity-100 group-hover:bg-terracotta transition-colors relative"
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
            {[
              { type: 'sub', wallet: '0x1A4...9f2', plan: 'Pro', time: '2 mins ago', amount: '+$19' },
              { type: 'sub', wallet: '0x8B2...3a1', plan: 'Business', time: '14 mins ago', amount: '+$79' },
              { type: 'cancel', wallet: '0x4F1...8c4', plan: 'Pro', time: '1 hour ago', amount: '-$19' },
              { type: 'sub', wallet: '0x9C3...2e8', plan: 'Pro', time: '3 hours ago', amount: '+$19' },
              { type: 'sub', wallet: '0x2D5...7b6', plan: 'Pro', time: '5 hours ago', amount: '+$19' },
              { type: 'sub', wallet: '0x7E6...1d3', plan: 'Business', time: '12 hours ago', amount: '+$79' },
            ].map((act, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${act.type === 'sub' ? 'bg-[#eefcf0] text-[#28C840]' : 'bg-[#fff0f0] text-terracotta'}`}>
                    {act.type === 'sub' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[13px] text-charcoal font-medium">{act.wallet}</span>
                    <span className="font-ui text-[12px] text-text-muted">{act.plan} • {act.time}</span>
                  </div>
                </div>
                <span className={`font-mono text-[13px] font-medium ${act.type === 'sub' ? 'text-charcoal' : 'text-text-muted'}`}>
                  {act.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
