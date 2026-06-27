import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Params = { params: Promise<{ appId: string }> };

/** GET /api/apps/[appId]/transactions?page=1&limit=20 */
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
  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    db.transaction.findMany({
      where: { appId },
      include: { plan: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.transaction.count({ where: { appId } }),
  ]);

  const rows = transactions.map((tx) => ({
    id: tx.id,
    transactionHash: tx.transactionHash,
    type: tx.type,
    usdcAmount: tx.usdcAmount,
    wallet: tx.wallet,
    planName: tx.plan?.name ?? null,
    tokenId: tx.tokenId,
    createdAt: tx.createdAt.toISOString(),
  }));

  return NextResponse.json({
    data: rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
