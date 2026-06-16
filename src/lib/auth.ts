import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionOptions, SessionData } from "./session";

/**
 * Gets the currently authenticated wallet address from the session.
 *
 * SECURITY:
 * - iron-session cookies are encrypted and tamper-proof.
 * - The address was verified via SIWE signature during login.
 * - No database lookup required — session is stateless.
 *
 * @returns The session data or null if unauthenticated.
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions
  );

  if (!session.address) {
    return null;
  }

  return {
    address: session.address,
    chainId: session.chainId,
    authenticatedAt: session.authenticatedAt,
  };
}

/**
 * Gets the authenticated session or redirects to /login.
 * Use this in Server Components that require authentication.
 */
export async function requireSession(): Promise<SessionData> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
