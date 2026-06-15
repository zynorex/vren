import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";

/**
 * POST /api/auth/logout
 *
 * Destroys the authenticated session by clearing the encrypted cookie.
 *
 * SECURITY:
 * - POST-only to prevent CSRF-based forced logout attacks.
 * - `session.destroy()` clears all session data and removes the cookie.
 */
export async function POST() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions
  );

  session.destroy();

  return NextResponse.json({ ok: true });
}
