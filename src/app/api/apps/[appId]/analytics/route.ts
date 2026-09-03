import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { calcMRR, growthRate } from "@/lib/utils";

type Params = { params: Promise<{ appId: string }> };

/** GET /api/apps/[appId]/analytics */
export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { appId } = await params;

  const developer = await db.developer.findUnique({ where: { wallet: session.user.id } });
  if (!developer) return NextResponse.json({ error: "Developer not found" }, { status: 404 });

  const app = await db.app.findFirst({ where: { id: appId, developerId: developer.id } });
  if (!app) return NextResponse.json({ error: "App not found" }, { status: 404 });

  const now = new Date();
  const d30 = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
  const d60 = new Date(now.getTime() - 60 * 24 * 3600 * 1000);

  // Current active subscribers with plan data
  const currentSubs = await db.subscriber.findMany({
    where: { appId, expiry: { gt: now } },
    include: { plan: { select: { id: true, name: true, price: true, duration: true } } },
  });

  // Subscribers active 30 days ago
  const prevSubs = await db.subscriber.findMany({
    where: { appId, createdAt: { lt: d30 }, expiry: { gt: d30 } },
    include: { plan: { select: { price: true, duration: true } } },
  });

  const currentMRR = calcMRR(currentSubs.map((s) => s.plan));
  const prevMRR = calcMRR(prevSubs.map((s) => s.plan));

  const activeCount = currentSubs.length;
  const prevCount = prevSubs.length;

  // Churn: subscribers that became inactive in the last 30 days
  const churned = await db.subscriber.count({
    where: { appId, active: false, updatedAt: { gte: d30 } },
  });
  const prevChurned = await db.subscriber.count({
    where: { appId, active: false, updatedAt: { gte: d60, lt: d30 } },
  });

  const churnRate = activeCount + churned > 0 ? (churned / (activeCount + churned)) * 100 : 0;
  const prevChurnRate = prevCount + prevChurned > 0 ? (prevChurned / (prevCount + prevChurned)) * 100 : 0;

  // New subscribers in each period
  const newThisPeriod = await db.subscriber.count({ where: { appId, createdAt: { gte: d30 } } });
  const newPrevPeriod = await db.subscriber.count({ where: { appId, createdAt: { gte: d60, lt: d30 } } });

  // Revenue breakdown by plan
  const planRevenue: Record<string, { name: string; mrr: number }> = {};
  for (const sub of currentSubs) {
    const { id, name, price, duration } = sub.plan;
    const priceUsd = Number(price) / 1_000_000;
    const contribution = priceUsd * ((30 * 24 * 3600) / duration);
    if (!planRevenue[id]) planRevenue[id] = { name, mrr: 0 };
    planRevenue[id].mrr += contribution;
  }
  const planBreakdown = Object.values(planRevenue)
    .map((p) => ({
      name: p.name,
      mrr: Math.round(p.mrr * 100) / 100,
      pct: currentMRR > 0 ? Math.round((p.mrr / currentMRR) * 100) : 0,
    }))
    .sort((a, b) => b.mrr - a.mrr);

  const arpu = activeCount > 0 ? currentMRR / activeCount : 0;

  return NextResponse.json({
    mrr: Math.round(currentMRR * 100) / 100,
    arr: Math.round(currentMRR * 12 * 100) / 100,
    mrrGrowthPct: Math.round(growthRate(currentMRR, prevMRR) * 10) / 10,
    activeSubscribers: activeCount,
    subscriberGrowthPct: Math.round(growthRate(activeCount, prevCount) * 10) / 10,
    churnRate: Math.round(churnRate * 10) / 10,
    churnDelta: Math.round((churnRate - prevChurnRate) * 10) / 10,
    arpu: Math.round(arpu * 100) / 100,
    ltv: Math.round(arpu * 12 * 100) / 100,
    newThisPeriod,
    newPrevPeriod,
    newGrowthPct: Math.round(growthRate(newThisPeriod, newPrevPeriod) * 10) / 10,
    cancelledThisPeriod: churned,
    planBreakdown,
  });
}
