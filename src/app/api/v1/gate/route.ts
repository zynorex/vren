import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-key-auth";
import { db } from "@/lib/db";
import { v1RateLimiter } from "@/lib/rate-limit";

/**
 * GET or POST /api/v1/gate
 * Server-to-Server endpoint for developers to check if a user's wallet has active subscription access.
 *
 * Headers:
 *   x-api-key: vren_live_... (or Authorization: Bearer vren_live_...)
 *
 * Parameters / JSON Body:
 *   appId: string
 *   wallet: string
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
  const wallet = url.searchParams.get("wallet");

  if (!appId || !wallet) {
    return NextResponse.json(
      { error: "Missing required query parameters 'appId' and 'wallet'" },
      { status: 400 }
    );
  }

  return checkGateAccess(auth.developerId, appId, wallet);
}

export async function POST(request: NextRequest) {
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

  let body: { appId?: string; wallet?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { appId, wallet } = body;
  if (!appId || !wallet) {
    return NextResponse.json(
      { error: "Missing required body fields 'appId' and 'wallet'" },
      { status: 400 }
    );
  }

  return checkGateAccess(auth.developerId, appId, wallet);
}

async function checkGateAccess(developerId: string, appId: string, rawWallet: string) {
  const wallet = rawWallet.toLowerCase();

  // Ensure the app belongs to the authenticated developer
  const app = await db.app.findFirst({
    where: {
      id: appId,
      developerId,
    },
    select: { id: true, name: true },
  });

  if (!app) {
    return NextResponse.json({ error: "App not found or unauthorized" }, { status: 404 });
  }

  // Lookup subscriber record
  const subscriber = await db.subscriber.findFirst({
    where: {
      appId,
      wallet: { equals: wallet, mode: "insensitive" },
    },
    include: {
      plan: {
        select: {
          name: true,
          onchainIdx: true,
          price: true,
        },
      },
    },
  });

  const now = new Date();

  if (!subscriber) {
    return NextResponse.json({
      access: false,
      wallet: rawWallet,
      appId,
      reason: "no_subscription_found",
    });
  }

  const isActive = subscriber.active && subscriber.expiry > now;

  if (!isActive) {
    return NextResponse.json({
      access: false,
      wallet: rawWallet,
      appId,
      reason: subscriber.expiry <= now ? "subscription_expired" : "subscription_inactive",
      expiresAt: subscriber.expiry.toISOString(),
    });
  }

  const timeRemainingSeconds = Math.max(0, Math.floor((subscriber.expiry.getTime() - now.getTime()) / 1000));

  return NextResponse.json({
    access: true,
    wallet: subscriber.wallet,
    appId,
    appName: app.name,
    tier: subscriber.plan.name,
    onchainIdx: subscriber.plan.onchainIdx,
    expiresAt: subscriber.expiry.toISOString(),
    timeRemainingSeconds,
    tokenId: subscriber.tokenId,
  });
}
