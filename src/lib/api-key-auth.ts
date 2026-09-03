import { NextRequest } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export type ApiKeyAuthResult =
  | { authenticated: true; developerId: string; keyId: string }
  | { authenticated: false; error: string; status: number };

/**
 * Authenticates an incoming HTTP request using a VREN API key.
 * Checks `x-api-key` header or `Authorization: Bearer <key>`.
 */
export async function authenticateApiKey(request: NextRequest): Promise<ApiKeyAuthResult> {
  const apiKeyHeader = request.headers.get("x-api-key");
  const authHeader = request.headers.get("authorization");

  let rawKey: string | null = null;

  if (apiKeyHeader) {
    rawKey = apiKeyHeader.trim();
  } else if (authHeader && authHeader.startsWith("Bearer ")) {
    rawKey = authHeader.slice(7).trim();
  }

  if (!rawKey) {
    return { authenticated: false, error: "Missing API key in 'x-api-key' or 'Authorization: Bearer' header", status: 401 };
  }

  if (!rawKey.startsWith("vren_live_") && !rawKey.startsWith("vren_test_")) {
    return { authenticated: false, error: "Invalid API key format", status: 401 };
  }

  const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");

  const apiKeyRecord = await db.apiKey.findUnique({
    where: { keyHash },
    select: { id: true, developerId: true },
  });

  if (!apiKeyRecord) {
    return { authenticated: false, error: "Invalid or revoked API key", status: 401 };
  }

  // Asynchronously update lastUsedAt without blocking
  db.apiKey
    .update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() },
    })
    .catch((err) => console.error("Failed to update lastUsedAt for API key:", err));

  return {
    authenticated: true,
    developerId: apiKeyRecord.developerId,
    keyId: apiKeyRecord.id,
  };
}
