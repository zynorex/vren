import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isAuthenticated = !!req.auth;
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
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|logo.png).*)",
  ],
};
