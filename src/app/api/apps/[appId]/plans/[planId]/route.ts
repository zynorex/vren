import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Params = { params: Promise<{ appId: string; planId: string }> };

async function verifyOwnership(developerWallet: string, appId: string, planId: string) {
  const developer = await db.developer.findUnique({ where: { wallet: developerWallet } });
  if (!developer) return null;
  const plan = await db.plan.findFirst({
    where: { id: planId, appId, app: { developerId: developer.id } },
  });
  return plan;
}

/** PUT /api/apps/[appId]/plans/[planId] — update plan */
export async function PUT(request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { appId, planId } = await params;

  let body: { name?: string; price?: string; duration?: number; active?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const plan = await verifyOwnership(session.user.id, appId, planId);
  if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });

  const { name, price, duration, active } = body;

  if (duration !== undefined && duration <= 0) {
    return NextResponse.json({ error: "duration must be positive" }, { status: 400 });
  }

  const updated = await db.plan.update({
    where: { id: planId },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(price !== undefined && { price }),
      ...(duration !== undefined && { duration }),
      ...(active !== undefined && { active }),
    },
  });

  return NextResponse.json(updated);
}

/** DELETE /api/apps/[appId]/plans/[planId] — soft-deactivate plan */
export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { appId, planId } = await params;

  const plan = await verifyOwnership(session.user.id, appId, planId);
  if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });

  // Soft delete — deactivate instead of hard delete to preserve subscriber history
  const deactivated = await db.plan.update({
    where: { id: planId },
    data: { active: false },
  });

  return NextResponse.json(deactivated);
}
