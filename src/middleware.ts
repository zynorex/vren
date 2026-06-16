import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

/**
 * VREN Auth Middleware (Wallet-Based)
 *
 * Protects dashboard routes by checking for a valid iron-session
 * containing an authenticated wallet address (set after SIWE verification).
 *
 * SECURITY:
 * - iron-session cookies are encrypted + signed — cannot be tampered with.
 * - Session TTL is enforced server-side (7 days).
 * - Unauthenticated API requests return 401 JSON, not HTML redirects.
 * - Authenticated users visiting /login are redirected to /dashboard.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the encrypted session from the cookie
  const session = await getIronSession<SessionData>(
    request.cookies as any,
    sessionOptions
  );

  const isAuthenticated = !!session.address;

  // ── Protected dashboard routes ─────────────────────────────────
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/subscribers") ||
    pathname.startsWith("/plans") ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/api-keys") ||
    pathname.startsWith("/settings");

  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Redirect authenticated users away from login ───────────────
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── Protected API routes ───────────────────────────────────────
  const isProtectedApi =
    pathname.startsWith("/api/apps") || pathname.startsWith("/api/keys");

  if (!isAuthenticated && isProtectedApi) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/subscribers/:path*",
    "/plans/:path*",
    "/transactions/:path*",
    "/analytics/:path*",
    "/api-keys/:path*",
    "/settings/:path*",
    "/login",
    "/api/apps/:path*",
    "/api/keys/:path*",
  ],
};
