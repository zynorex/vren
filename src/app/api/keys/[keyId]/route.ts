import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Params = { params: Promise<{ keyId: string }> };

/** DELETE /api/keys/[keyId] — revoke an API key */
export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { keyId } = await params;

  const developer = await db.developer.findUnique({ where: { wallet: session.user.id } });
  if (!developer) return NextResponse.json({ error: "Developer not found" }, { status: 404 });

  const key = await db.apiKey.findFirst({
    where: { id: keyId, developerId: developer.id },
  });
  if (!key) return NextResponse.json({ error: "API key not found" }, { status: 404 });

  await db.apiKey.delete({ where: { id: keyId } });

  return NextResponse.json({ success: true });
}
