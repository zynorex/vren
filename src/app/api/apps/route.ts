import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { calcMRR } from "@/lib/utils";

/** GET /api/apps — list all apps for the authenticated developer */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const developer = await db.developer.findUnique({
    where: { wallet: session.user.id },
  });
  if (!developer) {
    return NextResponse.json({ error: "Developer account not found" }, { status: 404 });
  }

  const now = new Date();

  const apps = await db.app.findMany({
    where: { developerId: developer.id },
    include: {
      _count: { select: { plans: true, subscribers: true } },
      subscribers: {
        where: { active: true, expiry: { gt: now } },
        include: { plan: { select: { price: true, duration: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const result = apps.map((app) => ({
    id: app.id,
    name: app.name,
    contractId: app.contractId,
    payoutWallet: app.payoutWallet,
    active: app.active,
    createdAt: app.createdAt,
    planCount: app._count.plans,
    subscriberCount: app.subscribers.length,
    mrr: Math.round(calcMRR(app.subscribers.map((s) => s.plan)) * 100) / 100,
  }));

  return NextResponse.json(result);
}

/** POST /api/apps — register a new application */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { name?: string; payoutWallet?: string; contractId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, payoutWallet, contractId } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  if (!payoutWallet || typeof payoutWallet !== "string" || !/^0x[0-9a-fA-F]{40}$/.test(payoutWallet)) {
    return NextResponse.json({ error: "payoutWallet must be a valid EVM address" }, { status: 400 });
  }
  if (contractId && !/^0x[0-9a-fA-F]{64}$/.test(contractId)) {
    return NextResponse.json({ error: "contractId must be a valid bytes32 hex string" }, { status: 400 });
  }

  const developer = await db.developer.findUnique({
    where: { wallet: session.user.id },
  });
  if (!developer) {
    return NextResponse.json({ error: "Developer account not found" }, { status: 404 });
  }

  const app = await db.app.create({
    data: {
      name: name.trim(),
      payoutWallet,
      contractId: contractId || null,
      developerId: developer.id,
    },
  });

  return NextResponse.json(app, { status: 201 });
}
