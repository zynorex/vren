import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Params = { params: Promise<{ appId: string; wallet: string }> };

/**
 * GET /api/apps/[appId]/subscribers/[wallet]
 * Returns comprehensive details and transaction history for a single subscriber.
 */
export async function GET(request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { appId, wallet: rawWallet } = await params;
  const wallet = rawWallet.toLowerCase();

  const developer = await db.developer.findUnique({ where: { wallet: session.user.id } });
  if (!developer) return NextResponse.json({ error: "Developer not found" }, { status: 404 });

  const app = await db.app.findFirst({ where: { id: appId, developerId: developer.id } });
  if (!app) return NextResponse.json({ error: "App not found" }, { status: 404 });

  // Query subscriber by appId & wallet
  const subscriber = await db.subscriber.findFirst({
    where: {
      appId,
      wallet: { equals: wallet, mode: "insensitive" },
    },
    include: {
      plan: {
        select: {
          id: true,
          onchainIdx: true,
          name: true,
          price: true,
          duration: true,
        },
      },
    },
  });

  if (!subscriber) {
    return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
  }

  // Fetch transaction history for this subscriber
  const transactions = await db.transaction.findMany({
    where: {
      appId,
      wallet: { equals: wallet, mode: "insensitive" },
    },
    orderBy: { createdAt: "desc" },
    include: {
      plan: { select: { name: true } },
    },
  });

  const now = new Date();
  const isActive = subscriber.active && subscriber.expiry > now;
  const timeRemainingSeconds = Math.max(0, Math.floor((subscriber.expiry.getTime() - now.getTime()) / 1000));

  // Compute total spent in USDC (USDC has 6 decimals)
  const totalSpentMicroUsdc = transactions.reduce((acc, tx) => {
    return acc + (tx.usdcAmount ? BigInt(tx.usdcAmount) : BigInt(0));
  }, BigInt(0));

  const totalSpentUsd = Number(totalSpentMicroUsdc) / 1_000_000;
  const planPriceUsd = Number(subscriber.plan.price) / 1_000_000;

  return NextResponse.json({
    subscriber: {
      id: subscriber.id,
      wallet: subscriber.wallet,
      tokenId: subscriber.tokenId,
      active: isActive,
      expiry: subscriber.expiry.toISOString(),
      timeRemainingSeconds,
      createdAt: subscriber.createdAt.toISOString(),
      updatedAt: subscriber.updatedAt.toISOString(),
      plan: {
        id: subscriber.plan.id,
        onchainIdx: subscriber.plan.onchainIdx,
        name: subscriber.plan.name,
        priceUsd: planPriceUsd,
        durationSeconds: subscriber.plan.duration,
      },
      stats: {
        totalSpentUsd: Math.round(totalSpentUsd * 100) / 100,
        transactionCount: transactions.length,
      },
    },
    transactions: transactions.map((tx) => ({
      id: tx.id,
      transactionHash: tx.transactionHash,
      type: tx.type,
      usdcAmount: tx.usdcAmount ? Number(tx.usdcAmount) / 1_000_000 : null,
      planName: tx.plan?.name ?? null,
      createdAt: tx.createdAt.toISOString(),
    })),
  });
}
