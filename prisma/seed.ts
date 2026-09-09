import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

/**
 * VREN — Database Seed Script
 *
 * Populates the database with realistic demo data for local development.
 * Creates a developer, app, plans, subscribers, transactions, and API keys.
 *
 * Usage: npx prisma db seed
 */

const prisma = new PrismaClient();

// ── Helpers ────────────────────────────────────────────────────────────

function randomWallet(): string {
  return `0x${crypto.randomBytes(20).toString("hex")}`;
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 3600 * 1000);
}

function futureDate(daysFromNow: number): Date {
  return new Date(Date.now() + daysFromNow * 24 * 3600 * 1000);
}

function randomTxHash(): string {
  return `0x${crypto.randomBytes(32).toString("hex")}`;
}

// ── Seed Data ──────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding VREN database...\n");

  // 1. Developer (the demo dashboard user)
  const devWallet = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Hardhat account #0
  const developer = await prisma.developer.upsert({
    where: { wallet: devWallet },
    update: {},
    create: {
      wallet: devWallet,
      email: "demo@vren.dev",
      name: "Demo Developer",
    },
  });
  console.log(`  ✅ Developer: ${developer.wallet} (${developer.id})`);

  // 2. App
  const app = await prisma.app.upsert({
    where: { contractId: "0x" + "ab".repeat(32) },
    update: {},
    create: {
      name: "Artha Protocol",
      contractId: "0x" + "ab".repeat(32),
      payoutWallet: devWallet,
      developerId: developer.id,
    },
  });
  console.log(`  ✅ App: ${app.name} (${app.id})`);

  // 3. Plans
  const planConfigs = [
    { name: "Starter", price: "9000000", duration: 30 * 24 * 3600, onchainIdx: 0 },  // $9/mo
    { name: "Growth", price: "29000000", duration: 30 * 24 * 3600, onchainIdx: 1 },   // $29/mo
    { name: "Enterprise", price: "99000000", duration: 30 * 24 * 3600, onchainIdx: 2 }, // $99/mo
    { name: "Annual Pro", price: "249000000", duration: 365 * 24 * 3600, onchainIdx: 3 }, // $249/yr
  ];

  const plans = [];
  for (const pc of planConfigs) {
    const plan = await prisma.plan.upsert({
      where: { appId_onchainIdx: { appId: app.id, onchainIdx: pc.onchainIdx } },
      update: {},
      create: {
        appId: app.id,
        name: pc.name,
        price: pc.price,
        duration: pc.duration,
        onchainIdx: pc.onchainIdx,
      },
    });
    plans.push(plan);
    console.log(`  ✅ Plan: ${plan.name} (${plan.id})`);
  }

  // 4. Subscribers — mix of active and churned
  const subscriberData = [
    // Active subscribers
    ...Array.from({ length: 12 }, (_, i) => ({
      wallet: randomWallet(),
      planIdx: i % 3, // Spread across Starter, Growth, Enterprise
      active: true,
      expiry: futureDate(Math.floor(Math.random() * 25) + 5),
      createdAt: daysAgo(Math.floor(Math.random() * 80) + 10),
    })),
    // Churned subscribers (last 30 days)
    ...Array.from({ length: 3 }, () => ({
      wallet: randomWallet(),
      planIdx: 0,
      active: false,
      expiry: daysAgo(Math.floor(Math.random() * 10)),
      createdAt: daysAgo(Math.floor(Math.random() * 60) + 30),
    })),
    // Churned subscribers (30-60 days ago, for prev period comparison)
    ...Array.from({ length: 2 }, () => ({
      wallet: randomWallet(),
      planIdx: 1,
      active: false,
      expiry: daysAgo(Math.floor(Math.random() * 20) + 30),
      createdAt: daysAgo(Math.floor(Math.random() * 60) + 60),
    })),
  ];

  let subCount = 0;
  for (const sd of subscriberData) {
    const plan = plans[sd.planIdx]!;
    await prisma.subscriber.upsert({
      where: { appId_wallet: { appId: app.id, wallet: sd.wallet } },
      update: {},
      create: {
        wallet: sd.wallet,
        appId: app.id,
        planId: plan.id,
        tokenId: `${1000 + subCount}`,
        expiry: sd.expiry,
        active: sd.active,
        createdAt: sd.createdAt,
      },
    });
    subCount++;
  }
  console.log(`  ✅ Subscribers: ${subCount} created (${subscriberData.filter((s) => s.active).length} active, ${subscriberData.filter((s) => !s.active).length} churned)`);

  // 5. Transactions — spread across last 6 months for chart data
  const txTypes = ["new_subscription", "renewal", "cancelled"] as const;
  let txCount = 0;

  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    // More transactions in recent months (growth pattern)
    const numTxns = Math.floor(Math.random() * 5) + 3 + (5 - monthOffset) * 2;

    for (let j = 0; j < numTxns; j++) {
      const plan = plans[Math.floor(Math.random() * 3)]!;
      const isCancelled = Math.random() < 0.15;
      const type = isCancelled ? "cancelled" : (Math.random() < 0.3 ? "renewal" : "new_subscription");
      const dayInMonth = Math.floor(Math.random() * 28) + 1;
      const txDate = new Date();
      txDate.setMonth(txDate.getMonth() - monthOffset);
      txDate.setDate(dayInMonth);

      try {
        await prisma.transaction.create({
          data: {
            transactionHash: randomTxHash(),
            type,
            usdcAmount: isCancelled ? null : plan.price,
            wallet: randomWallet(),
            appId: app.id,
            planId: isCancelled ? null : plan.id,
            createdAt: txDate,
          },
        });
        txCount++;
      } catch {
        // Skip duplicate tx hash (extremely unlikely but possible)
      }
    }
  }
  console.log(`  ✅ Transactions: ${txCount} created across 6 months`);

  // 6. API Key — generate a demo key
  const rawKey = `vren_test_${crypto.randomBytes(24).toString("hex")}`;
  const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");
  const keyPrefix = rawKey.slice(0, 16);

  await prisma.apiKey.upsert({
    where: { keyHash },
    update: {},
    create: {
      name: "Development Key",
      keyHash,
      keyPrefix,
      developerId: developer.id,
    },
  });
  console.log(`  ✅ API Key: ${keyPrefix}...`);
  console.log(`\n  🔑 Full API key (save this): ${rawKey}`);

  // 7. Webhook Events — simulate some processed events
  for (let i = 0; i < 5; i++) {
    try {
      await prisma.webhookEvent.create({
        data: {
          transactionHash: randomTxHash(),
          eventType: ["Subscribed", "PlanCreated", "Cancelled", "Renewed", "Subscribed"][i]!,
        },
      });
    } catch {
      // Skip duplicates
    }
  }
  console.log(`  ✅ WebhookEvents: 5 idempotency records`);

  console.log("\n🎉 Seeding complete!\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
