import { NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

function generateApiKey(env: "live" | "test"): { key: string; prefix: string; hash: string } {
  const random = crypto.randomBytes(24).toString("hex");
  const key = `vren_${env}_${random}`;
  // Store first 16 chars (e.g. "vren_live_0a1b2c") for display; never store the full key
  const prefix = `${key.slice(0, 16)}********************`;
  const hash = crypto.createHash("sha256").update(key).digest("hex");
  return { key, prefix, hash };
}

/** GET /api/keys — list API keys for the authenticated developer */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const developer = await db.developer.findUnique({ where: { wallet: session.user.id } });
  if (!developer) return NextResponse.json({ error: "Developer not found" }, { status: 404 });

  const keys = await db.apiKey.findMany({
    where: { developerId: developer.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      lastUsedAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json(keys);
}

/** POST /api/keys — generate a new API key */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { name?: string; env?: "live" | "test" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, env = "live" } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  if (env !== "live" && env !== "test") {
    return NextResponse.json({ error: "env must be 'live' or 'test'" }, { status: 400 });
  }

  const developer = await db.developer.findUnique({ where: { wallet: session.user.id } });
  if (!developer) return NextResponse.json({ error: "Developer not found" }, { status: 404 });

  // Enforce a reasonable limit per developer
  const keyCount = await db.apiKey.count({ where: { developerId: developer.id } });
  if (keyCount >= 20) {
    return NextResponse.json({ error: "API key limit reached (20 max). Revoke unused keys first." }, { status: 429 });
  }

  const { key, prefix, hash } = generateApiKey(env);

  const record = await db.apiKey.create({
    data: {
      name: name.trim(),
      keyHash: hash,
      keyPrefix: prefix,
      developerId: developer.id,
    },
  });

  // Return the plaintext key ONCE — it is never stored again
  return NextResponse.json(
    { id: record.id, name: record.name, key, keyPrefix: prefix, createdAt: record.createdAt },
    { status: 201 }
  );
}
