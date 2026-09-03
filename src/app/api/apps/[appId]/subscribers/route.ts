import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Params = { params: Promise<{ appId: string }> };

/** GET /api/apps/[appId]/subscribers?page=1&limit=20&search=0x... */
export async function GET(request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { appId } = await params;

  const developer = await db.developer.findUnique({ where: { wallet: session.user.id } });
  if (!developer) return NextResponse.json({ error: "Developer not found" }, { status: 404 });

  const app = await db.app.findFirst({ where: { id: appId, developerId: developer.id } });
  if (!app) return NextResponse.json({ error: "App not found" }, { status: 404 });

  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
  const search = url.searchParams.get("search") || "";
  const skip = (page - 1) * limit;

  const where = {
    appId,
    ...(search && { wallet: { contains: search, mode: "insensitive" as const } }),
  };

  const [subscribers, total] = await Promise.all([
    db.subscriber.findMany({
      where,
      include: { plan: { select: { name: true, price: true, duration: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.subscriber.count({ where }),
  ]);

  const now = new Date();

  const rows = subscribers.map((sub) => {
    const priceUsd = Number(sub.plan.price) / 1_000_000;
    // Approximate LTV: price * (months since joined / plan duration in months)
    const durationMonths = sub.plan.duration / (30 * 24 * 3600);
    const monthsSinceJoined = (now.getTime() - sub.createdAt.getTime()) / (30 * 24 * 3600 * 1000);
    const renewals = Math.max(1, Math.ceil(monthsSinceJoined / durationMonths));
    const ltvUsd = priceUsd * renewals;

    return {
      id: sub.id,
      wallet: sub.wallet,
      planName: sub.plan.name,
      planPrice: sub.plan.price,
      planDuration: sub.plan.duration,
      active: sub.active && sub.expiry > now,
      expiry: sub.expiry.toISOString(),
      createdAt: sub.createdAt.toISOString(),
      ltvUsd: Math.round(ltvUsd * 100) / 100,
    };
  });

  return NextResponse.json({
    data: rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
