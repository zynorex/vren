import { SessionOptions } from "iron-session";

/**
 * VREN Session Configuration
 *
 * Uses iron-session for encrypted, stateless, cookie-based sessions.
 * The session is sealed (encrypted + signed) using the SESSION_SECRET.
 *
 * SECURITY:
 * - SESSION_SECRET must be at least 32 characters. Generate via:
 *   `openssl rand -hex 32`
 * - httpOnly: true — prevents XSS from reading the session cookie
 * - secure: true in production — ensures HTTPS-only transmission
 * - sameSite: "lax" — prevents CSRF while allowing normal navigation
 * - ttl: 7 days — sessions auto-expire
 */

export interface SessionData {
  /** The authenticated wallet address (checksummed) */
  address: string;
  /** Chain ID the user authenticated on */
  chainId: number;
  /** ISO timestamp of when the session was created */
  authenticatedAt: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long_for_dev",
  cookieName: "vren-session",
  ttl: 60 * 60 * 24 * 7, // 7 days
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
  },
};
