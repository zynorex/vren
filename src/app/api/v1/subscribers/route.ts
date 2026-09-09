import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-key-auth";
import { db } from "@/lib/db";
import { v1RateLimiter } from "@/lib/rate-limit";

/**
 * GET /api/v1/subscribers?appId=clx...&status=active|all&page=1&limit=50
 * Developer V1 API for programmatically listing subscribers via API Key.
 */
export async function GET(request: NextRequest) {
  const auth = await authenticateApiKey(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  // Rate limiting per API key
  const rateLimit = v1RateLimiter.check(auth.keyId);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please retry after the reset window." },
      { status: 429, headers: { ...v1RateLimiter.headers(rateLimit), "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } }
    );
  }

  const url = new URL(request.url);
  const appId = url.searchParams.get("appId");
  const statusFilter = url.searchParams.get("status") || "all";
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
  const skip = (page - 1) * limit;

  if (!appId) {
    return NextResponse.json({ error: "Missing required query parameter 'appId'" }, { status: 400 });
  }

  // Verify app ownership
  const app = await db.app.findFirst({
    where: { id: appId, developerId: auth.developerId },
    select: { id: true, name: true },
  });

  if (!app) {
    return NextResponse.json({ error: "App not found or unauthorized" }, { status: 404 });
  }

  const now = new Date();

  const where = {
    appId,
    ...(statusFilter === "active" && {
      active: true,
      expiry: { gt: now },
    }),
    ...(statusFilter === "expired" && {
      OR: [{ active: false }, { expiry: { lte: now } }],
    }),
  };

  const [subscribers, total] = await Promise.all([
    db.subscriber.findMany({
      where,
      include: {
        plan: {
          select: {
            name: true,
            onchainIdx: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.subscriber.count({ where }),
  ]);

  const rows = subscribers.map((s) => {
    const isActive = s.active && s.expiry > now;
    return {
      id: s.id,
      wallet: s.wallet,
      tokenId: s.tokenId,
      plan: {
        name: s.plan.name,
        onchainIdx: s.plan.onchainIdx,
        priceUsd: Number(s.plan.price) / 1_000_000,
      },
      status: isActive ? "active" : "expired",
      expiry: s.expiry.toISOString(),
      createdAt: s.createdAt.toISOString(),
    };
  });

  return NextResponse.json({
    app: { id: app.id, name: app.name },
    subscribers: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
