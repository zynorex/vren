import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";

/**
 * GET /api/auth/session
 *
 * Returns the current authenticated session data.
 * Used by the frontend to check if the user is logged in
 * and to display their wallet address.
 */
export async function GET() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions
  );

  if (!session.address) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    address: session.address,
    chainId: session.chainId,
    authenticatedAt: session.authenticatedAt,
  });
}
