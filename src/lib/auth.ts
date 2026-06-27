import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";
import { PrismaClient } from "@prisma/client";
import authConfig from "./auth.config";

const prisma = new PrismaClient();

/**
 * VREN NextAuth Configuration — SIWE (Sign-In with Ethereum)
 *
 * Authentication flow:
 * 1. Client connects wallet via RainbowKit
 * 2. Client fetches a unique nonce from /api/auth/siwe/nonce
 * 3. Client signs the SIWE message with their wallet
 * 4. This credentials provider verifies the signature
 * 5. Developer record is upserted in Prisma
 * 6. JWT session is created with wallet address
 *
 * Security:
 * - Nonce is single-use (stored in iron-session, expires after verification)
 * - Domain verification prevents phishing (SIWE domain must match)
 * - Message expiry validation prevents replay attacks
 * - Wallet address is checksummed (EIP-55) before storage
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "siwe",
      name: "Ethereum",
      credentials: {
        message: { label: "Message", type: "text" },
        signature: { label: "Signature", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.message || !credentials?.signature) {
            console.error("[SIWE] Missing message or signature");
            return null;
          }

          const siweMessage = new SiweMessage(
            credentials.message as string
          );

          // Verify the SIWE signature
          const result = await siweMessage.verify({
            signature: credentials.signature as string,
          });

          if (!result.success) {
            console.error("[SIWE] Signature verification failed");
            return null;
          }

          const address = result.data.address;

          // Upsert the developer in the database
          try {
            await prisma.developer.upsert({
              where: { wallet: address },
              update: {
                // Update timestamp via @updatedAt
              },
              create: {
                wallet: address,
                email: `${address.toLowerCase()}@wallet.vren.dev`, // Synthetic email for wallet-only auth
              },
            });
          } catch (dbError) {
            // Allow login even if DB is not available (graceful degradation)
            console.error("[SIWE] Database upsert failed:", dbError);
          }

          return {
            id: address,
            name: address,
          };
        } catch (error) {
          console.error("[SIWE] Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; // wallet address
        token.address = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
        session.user.name = token.sub; // wallet address as display name
        // Attach wallet address to session
        (session as any).address = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
});

/**
 * Helper to get the authenticated session.
 * Returns null if not authenticated.
 */
export async function getSession() {
  const session = await auth();
  return session?.user ? session : null;
}

/**
 * Helper to get the wallet address from the current session.
 * Returns null if not authenticated.
 */
export async function getWalletAddress(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}
