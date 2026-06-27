import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * VREN Middleware — Route Protection
 *
 * Protects dashboard routes and API endpoints.
 * Uses raw cookie checks (not NextAuth imports) to stay Edge-compatible.
 *
 * NextAuth v5 (Auth.js) uses these cookie names:
 * - Development: "authjs.session-token"
 * - Production (HTTPS): "__Secure-authjs.session-token"
 *
 * SECURITY:
 * - Cookie-only check (no DB call in middleware — keeps it fast)
 * - Protected API routes return 401, not redirect
 * - Login page redirects authenticated users to dashboard
 */
export function middleware(req: NextRequest) {
  // NextAuth sets different cookie names in development vs production
  const isAuthenticated =
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("__Secure-authjs.session-token");

  const { pathname } = req.nextUrl;

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
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Redirect authenticated users away from login ───────────────
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
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
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes — must be publicly accessible)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - logo.png
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|logo.png).*)",
  ],
};
