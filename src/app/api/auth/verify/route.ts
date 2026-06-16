import { NextResponse } from "next/server";
import { SiweMessage } from "siwe";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";

/**
 * POST /api/auth/verify
 *
 * Verifies a signed SIWE message and creates an authenticated session.
 *
 * SECURITY:
 * - Verifies the cryptographic signature against the message
 * - Checks the nonce matches what was issued by /api/auth/nonce
 *   (prevents replay attacks — each nonce is single-use)
 * - Validates the domain matches the request origin
 *   (prevents phishing — a message signed for evil.com won't work here)
 * - On success, creates an encrypted iron-session cookie containing
 *   the verified wallet address
 * - The nonce is consumed (deleted) after verification
 */
export async function POST(request: Request) {
  try {
    const { message, signature } = await request.json();

    if (!message || !signature) {
      return NextResponse.json(
        { error: "Message and signature are required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    // Retrieve the nonce we issued earlier
    const nonceSession = await getIronSession<{ nonce: string }>(
      cookieStore,
      sessionOptions
    );

    const siweMessage = new SiweMessage(message);

    // Verify the signature and validate the message fields
    const { data: fields } = await siweMessage.verify({
      signature,
      nonce: nonceSession.nonce,
    });

    // Signature is valid and nonce matches — create authenticated session
    // We get a fresh session handle to store the auth data
    const session = await getIronSession<SessionData & { nonce?: string }>(
      cookieStore,
      sessionOptions
    );

    session.address = fields.address;
    session.chainId = fields.chainId;
    session.authenticatedAt = new Date().toISOString();

    // Consume the nonce — it can never be reused
    delete session.nonce;

    await session.save();

    return NextResponse.json({
      ok: true,
      address: fields.address,
      chainId: fields.chainId,
    });
  } catch (error: any) {
    console.error("[SIWE VERIFY ERROR]", error?.message);
    return NextResponse.json(
      { error: "Signature verification failed" },
      { status: 401 }
    );
  }
}
