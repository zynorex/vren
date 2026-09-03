import { NextResponse } from "next/server";
import { generateSiweNonce } from "viem/siwe";

/**
 * GET /api/auth/siwe/nonce
 *
 * Generates a cryptographically secure nonce for SIWE authentication.
 * The nonce prevents replay attacks — each sign-in attempt requires a fresh nonce.
 *
 * Security:
 * - Nonce is generated using viem's secure random generator
 * - Nonce is single-use (client must request a new one for each login)
 * - Short cache: no-store to prevent nonce reuse via caching
 */
export async function GET() {
  try {
    const nonce = generateSiweNonce();

    return NextResponse.json(
      { nonce },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("[SIWE Nonce] Generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate nonce" },
      { status: 500 }
    );
  }
}
