import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Params = { params: Promise<{ appId: string }> };

/** GET /api/apps/[appId]/plans */
export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { appId } = await params;

  const developer = await db.developer.findUnique({ where: { wallet: session.user.id } });
  if (!developer) return NextResponse.json({ error: "Developer not found" }, { status: 404 });

  const app = await db.app.findFirst({ where: { id: appId, developerId: developer.id } });
  if (!app) return NextResponse.json({ error: "App not found" }, { status: 404 });

  const now = new Date();
  const plans = await db.plan.findMany({
    where: { appId },
    include: {
      _count: { select: { subscribers: true } },
    },
    orderBy: { onchainIdx: "asc" },
  });

  // Attach active subscriber count (expiry > now) per plan
  const plansWithActiveCounts = await Promise.all(
    plans.map(async (plan) => {
      const activeCount = await db.subscriber.count({
        where: { planId: plan.id, active: true, expiry: { gt: now } },
      });
      return { ...plan, activeSubscriberCount: activeCount };
    })
  );

  return NextResponse.json(plansWithActiveCounts);
}

/** POST /api/apps/[appId]/plans */
export async function POST(request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { appId } = await params;

  let body: { name?: string; price?: string; duration?: number; onchainIdx?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, price, duration, onchainIdx } = body;

  if (!name || typeof name !== "string") return NextResponse.json({ error: "name is required" }, { status: 400 });
  if (!price || typeof price !== "string") return NextResponse.json({ error: "price is required (USDC 6-decimal string)" }, { status: 400 });
  if (!duration || typeof duration !== "number" || duration <= 0) return NextResponse.json({ error: "duration must be a positive number of seconds" }, { status: 400 });
  if (onchainIdx === undefined || typeof onchainIdx !== "number") return NextResponse.json({ error: "onchainIdx is required" }, { status: 400 });

  const developer = await db.developer.findUnique({ where: { wallet: session.user.id } });
  if (!developer) return NextResponse.json({ error: "Developer not found" }, { status: 404 });

  const app = await db.app.findFirst({ where: { id: appId, developerId: developer.id } });
  if (!app) return NextResponse.json({ error: "App not found" }, { status: 404 });

  // Check for duplicate onchainIdx
  const existing = await db.plan.findUnique({ where: { appId_onchainIdx: { appId, onchainIdx } } });
  if (existing) return NextResponse.json({ error: "A plan with this onchainIdx already exists" }, { status: 409 });

  const plan = await db.plan.create({
    data: { name: name.trim(), price, duration, onchainIdx, appId },
  });

  return NextResponse.json(plan, { status: 201 });
}
