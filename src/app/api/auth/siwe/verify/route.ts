import { NextResponse, NextRequest } from "next/server";
import { signIn } from "@/lib/auth";

/**
 * POST /api/auth/siwe/verify
 *
 * Verifies a SIWE signature and creates an authenticated session.
 * This endpoint is called by the login client after the user signs
 * the SIWE message with their wallet.
 *
 * Request body:
 * - message: The SIWE message string
 * - signature: The wallet's signature of the message
 *
 * Security:
 * - Delegates verification to NextAuth's Credentials provider
 * - Domain validation happens inside the SIWE message verification
 * - Nonce is validated to prevent replay attacks
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, signature } = body;

    if (!message || !signature) {
      return NextResponse.json(
        { error: "Missing message or signature" },
        { status: 400 }
      );
    }

    if (typeof message !== "string" || typeof signature !== "string") {
      return NextResponse.json(
        { error: "Invalid message or signature format" },
        { status: 400 }
      );
    }

    // Validate signature format (must be a hex string starting with 0x)
    if (!/^0x[0-9a-fA-F]+$/.test(signature)) {
      return NextResponse.json(
        { error: "Invalid signature format" },
        { status: 400 }
      );
    }

    try {
      await signIn("siwe", {
        message,
        signature,
        redirect: false,
      });

      return NextResponse.json({ ok: true });
    } catch (signInError: any) {
      // NextAuth throws a specific error type for credential failures
      if (signInError?.type === "CredentialsSignin") {
        return NextResponse.json(
          { error: "Signature verification failed" },
          { status: 401 }
        );
      }
      throw signInError;
    }
  } catch (error) {
    console.error("[SIWE Verify] Error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
