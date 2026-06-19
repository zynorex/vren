import NextAuth from "next-auth";
import { PrismaClient } from "@prisma/client";
import authConfig from "./auth.config";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
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
  },
});

/**
 * Helper to get the session directly from NextAuth.
 */
export async function getSession() {
  const session = await auth();
  return session?.user ? session : null;
}

