import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
    "/((?!api/auth|_next/static|_next/image|favicon.ico|logo.png).*)",
  ],
};
