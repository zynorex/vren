import type { NextAuthConfig } from "next-auth";

/**
 * Shared NextAuth configuration.
 *
 * This config is used by both the full NextAuth handler (auth.ts)
 * and the Edge-safe middleware (middleware.ts).
 *
 * IMPORTANT: This file must remain Edge-compatible.
 * Do NOT import Prisma, Node.js APIs, or heavy libraries here.
 */
export default {
  providers: [], // Providers are set in auth.ts (not here — keeps this Edge-safe)
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.name = token.sub;
      }
      return session;
    },
    async authorized({ auth, request }) {
      // This callback is used by middleware for route protection
      const isAuthenticated = !!auth?.user;
      const { pathname } = request.nextUrl;

      const protectedRoutes = [
        "/dashboard",
        "/subscribers",
        "/plans",
        "/transactions",
        "/analytics",
        "/api-keys",
        "/settings",
      ];

      const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
      );

      if (isProtectedRoute && !isAuthenticated) {
        return false; // Redirects to signIn page
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
