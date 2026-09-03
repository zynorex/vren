import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Params = { params: Promise<{ appId: string }> };

async function getOwnedApp(developerId: string, appId: string) {
  return db.app.findFirst({ where: { id: appId, developerId } });
}

/** GET /api/apps/[appId] */
export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { appId } = await params;

  const developer = await db.developer.findUnique({ where: { wallet: session.user.id } });
  if (!developer) return NextResponse.json({ error: "Developer not found" }, { status: 404 });

  const app = await db.app.findFirst({
    where: { id: appId, developerId: developer.id },
    include: {
      plans: { orderBy: { onchainIdx: "asc" } },
      _count: { select: { subscribers: true } },
    },
  });
  if (!app) return NextResponse.json({ error: "App not found" }, { status: 404 });

  return NextResponse.json(app);
}

/** PUT /api/apps/[appId] — update app name, payoutWallet, or contractId */
export async function PUT(request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { appId } = await params;

  let body: { name?: string; payoutWallet?: string; contractId?: string | null; active?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const developer = await db.developer.findUnique({ where: { wallet: session.user.id } });
  if (!developer) return NextResponse.json({ error: "Developer not found" }, { status: 404 });

  const existing = await getOwnedApp(developer.id, appId);
  if (!existing) return NextResponse.json({ error: "App not found" }, { status: 404 });

  const { name, payoutWallet, contractId, active } = body;

  if (payoutWallet && !/^0x[0-9a-fA-F]{40}$/.test(payoutWallet)) {
    return NextResponse.json({ error: "payoutWallet must be a valid EVM address" }, { status: 400 });
  }
  if (contractId && !/^0x[0-9a-fA-F]{64}$/.test(contractId)) {
    return NextResponse.json({ error: "contractId must be a valid bytes32 hex string" }, { status: 400 });
  }

  const updated = await db.app.update({
    where: { id: appId },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(payoutWallet !== undefined && { payoutWallet }),
      ...(contractId !== undefined && { contractId }),
      ...(active !== undefined && { active }),
    },
  });

  return NextResponse.json(updated);
}

/** DELETE /api/apps/[appId] */
export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { appId } = await params;

  const developer = await db.developer.findUnique({ where: { wallet: session.user.id } });
  if (!developer) return NextResponse.json({ error: "Developer not found" }, { status: 404 });

  const existing = await getOwnedApp(developer.id, appId);
  if (!existing) return NextResponse.json({ error: "App not found" }, { status: 404 });

  await db.app.delete({ where: { id: appId } });

  return NextResponse.json({ success: true });
}
