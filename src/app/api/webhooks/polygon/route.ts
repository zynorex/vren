import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import type { PrismaClient } from "@prisma/client";

// The secret key provided by Alchemy Custom Webhooks (or your relayer)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";

/**
 * Validates the HMAC SHA-256 signature sent by the webhook provider.
 */
function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return false;
  
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  const expectedSignature = hmac.update(payload).digest("hex");
  
  return expectedSignature === signature;
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-webhook-signature") || "";

    // 1. Cryptographic Verification
    if (process.env.NODE_ENV === "production" && !verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { transactionHash, eventType, data } = payload;

    if (!transactionHash || !eventType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Idempotency Check (Prevent processing the same on-chain event twice)
    const existingEvent = await db.webhookEvent.findUnique({
      where: { transactionHash },
    });

    if (existingEvent) {
      return NextResponse.json({ message: "Event already processed" }, { status: 200 });
    }

    // 3. Process the Event based on type
    if (eventType === "Subscribed") {
      const { appId, subscriber, planId, tokenId, expiry } = data;

      // Find the App ID and Plan from DB
      const app = await db.app.findUnique({
        where: { contractId: appId },
        include: { plans: true },
      });

      if (!app) {
        throw new Error(`App with contractId ${appId} not found in database`);
      }

      const plan = app.plans.find((p: { onchainIdx: number; id: string }) => p.onchainIdx === Number(planId));
      if (!plan) {
        throw new Error(`Plan ID ${planId} not found for App ${appId}`);
      }

      // Convert blockchain timestamp (seconds) to JS Date (ms)
      const expiryDate = new Date(Number(expiry) * 1000);

      // Upsert the Subscriber record
      await db.$transaction(async (prisma: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) => {
        await prisma.subscriber.upsert({
          where: {
            appId_wallet: {
              appId: app.id,
              wallet: subscriber.toLowerCase(),
            },
          },
          update: {
            planId: plan.id,
            tokenId: tokenId ? String(tokenId) : null,
            expiry: expiryDate,
            active: true,
          },
          create: {
            wallet: subscriber.toLowerCase(),
            appId: app.id,
            planId: plan.id,
            tokenId: tokenId ? String(tokenId) : null,
            expiry: expiryDate,
            active: true,
          },
        });

        // Record the idempotency event
        await prisma.webhookEvent.create({
          data: {
            transactionHash,
            eventType,
          },
        });
      });

      return NextResponse.json({ message: "Subscription processed successfully" });
    }

    // ... Handle other events like PlanCreated, AppRegistered here ...

    return NextResponse.json({ message: "Event ignored" });

  } catch (error) {
    console.error("[WEBHOOK ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
