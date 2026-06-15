import { NextResponse } from "next/server";
import { generateNonce } from "siwe";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session";

/**
 * GET /api/auth/nonce
 *
 * Generates a cryptographically random nonce for the SIWE message.
 * The nonce is stored in the session to prevent replay attacks —
 * the verify endpoint checks that the signed nonce matches what
 * was issued here.
 *
 * SECURITY:
 * - Nonce is generated using `crypto.randomBytes` (via siwe lib)
 * - Stored server-side in an encrypted iron-session cookie
 * - Each nonce is single-use — consumed during verification
 */
export async function GET() {
  const cookieStore = await cookies();
  const session = await getIronSession<{ nonce: string }>(
    cookieStore,
    sessionOptions
  );

  const nonce = generateNonce();
  session.nonce = nonce;
  await session.save();

  return NextResponse.json({ nonce });
}
