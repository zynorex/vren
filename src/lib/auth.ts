import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        try {
          await prisma.developer.upsert({
            where: { email: user.email },
            update: {
              name: user.name || undefined,
            },
            create: {
              email: user.email,
              name: user.name,
            },
          });
        } catch (error) {
          console.error("Error upserting developer:", error);
          // Still allow sign in even if DB fails initially or schema isn't pushed
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

/**
 * Helper to get the session directly from NextAuth.
 */
export async function getSession() {
  const session = await auth();
  return session?.user ? session : null;
}

