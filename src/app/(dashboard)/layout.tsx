import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Activity, 
  Key, 
  Settings,
  ArrowRightLeft,
  LogOut,
  BarChart2
} from "lucide-react";
import Image from "next/image";

// In a real app, this layout would also handle authentication checks.

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#f5f3ec] text-charcoal font-body overflow-hidden selection:bg-terracotta/20">
      
      {/* ═══════════════════════════════════════════════════════════════
          SIDEBAR
      ═══════════════════════════════════════════════════════════════ */}
      <aside className="w-[260px] bg-white border-r border-border-subtle flex flex-col justify-between shrink-0 h-full z-20 shadow-[4px_0_24px_rgba(25,25,24,0.02)]">
        <div className="flex flex-col">
          {/* Logo / Brand Area */}
          <div className="h-[68px] px-6 flex items-center border-b border-border-subtle">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <Image src="/logo.png" alt="VREN Logo" width={28} height={28} className="object-contain" />
              </div>
              <span className="font-display font-semibold tracking-wide leading-none text-lg text-charcoal">
                VREN
              </span>
            </Link>
          </div>

          {/* Project Selector (Mock) */}
          <div className="px-4 py-6">
            <button className="w-full flex items-center justify-between px-3 py-2 border border-border-subtle rounded-md hover:border-terracotta hover:bg-[#fafafa] transition-all group">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-[4px] bg-charcoal text-parchment flex items-center justify-center font-ui text-[10px] font-bold">
                  A
                </div>
                <span className="font-ui text-[14px] font-medium text-charcoal">Acme Corp</span>
              </div>
              <ArrowRightLeft className="w-3.5 h-3.5 text-text-muted group-hover:text-charcoal transition-colors" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 px-4 font-ui text-[14px]">
            <span className="px-3 mb-2 font-ui text-[11px] uppercase tracking-widest font-semibold text-text-muted">Menu</span>
            
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md bg-parchment text-terracotta font-medium">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </Link>
            
            <Link href="/subscribers" className="flex items-center gap-3 px-3 py-2 rounded-md text-text-secondary hover:text-charcoal hover:bg-[#fafafa] transition-colors">
              <Users className="w-4 h-4" />
              Subscribers
            </Link>
            
            <Link href="/plans" className="flex items-center gap-3 px-3 py-2 rounded-md text-text-secondary hover:text-charcoal hover:bg-[#fafafa] transition-colors">
              <CreditCard className="w-4 h-4" />
              Subscription Plans
            </Link>
            
            <Link href="/transactions" className="flex items-center gap-3 px-3 py-2 rounded-md text-text-secondary hover:text-charcoal hover:bg-[#fafafa] transition-colors">
              <Activity className="w-4 h-4" />
              Transactions
            </Link>

            <Link href="/analytics" className="flex items-center gap-3 px-3 py-2 rounded-md text-text-secondary hover:text-charcoal hover:bg-[#fafafa] transition-colors">
              <BarChart2 className="w-4 h-4" />
              Analytics
            </Link>

            <div className="mt-6 mb-2 px-3 font-ui text-[11px] uppercase tracking-widest font-semibold text-text-muted">Developer</div>

            <Link href="/api-keys" className="flex items-center gap-3 px-3 py-2 rounded-md text-text-secondary hover:text-charcoal hover:bg-[#fafafa] transition-colors">
              <Key className="w-4 h-4" />
              API Keys
            </Link>

            <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-md text-text-secondary hover:text-charcoal hover:bg-[#fafafa] transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </nav>
        </div>

        {/* User Profile / Logout Area */}
        <div className="p-4 border-t border-border-subtle">
          <form action={async () => {
            "use server";
            const { signOut } = await import("@/lib/auth");
            await signOut({ redirectTo: "/login" });
          }}>
            <button type="submit" className="w-full flex items-center justify-between px-3 py-2 rounded-md text-text-secondary hover:text-charcoal hover:bg-[#fafafa] transition-colors group">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-terracotta to-warm-gold flex items-center justify-center font-ui text-[11px] font-bold text-parchment">
                  G
                </div>
                <span className="font-mono text-[13px] font-medium text-charcoal">Sign Out</span>
              </div>
              <LogOut className="w-4 h-4 text-text-muted group-hover:text-terracotta transition-colors" />
            </button>
          </form>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN CONTENT AREA
      ═══════════════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#fafafa]">
        {/* Top Header */}
        <header className="h-[68px] bg-white border-b border-border-subtle flex items-center justify-between px-8 shrink-0">
          <div className="font-ui text-[14px] text-text-secondary">
            <span className="text-charcoal font-medium">Acme Corp</span> / Overview
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#f5f3ec] border border-border-subtle px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-[#28C840] animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-charcoal">Polygon Mainnet</span>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="w-full max-w-[1000px] mx-auto">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
