/**
 * VREN — In-Memory Sliding Window Rate Limiter
 *
 * Provides per-key rate limiting for API endpoints.
 * Uses an in-memory Map with sliding window counters.
 *
 * For production at scale, replace with Redis-backed implementation.
 * This is suitable for single-instance Vercel deployments (serverless
 * functions share the same Node.js process within a region).
 *
 * Usage:
 *   const limiter = createRateLimiter({ windowMs: 60_000, max: 60 });
 *   const result = limiter.check(apiKeyId);
 *   if (!result.allowed) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimiterConfig {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum requests allowed per window */
  max: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

export function createRateLimiter(config: RateLimiterConfig) {
  const { windowMs, max } = config;
  const store = new Map<string, RateLimitEntry>();

  // Periodic cleanup of expired entries to prevent memory leaks
  // Run every 5 minutes
  const CLEANUP_INTERVAL = 5 * 60 * 1000;
  let lastCleanup = Date.now();

  function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;

    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) {
        store.delete(key);
      }
    }
  }

  return {
    /**
     * Check if a request from the given key is allowed.
     * @param key - Unique identifier (API key ID, IP address, etc.)
     */
    check(key: string): RateLimitResult {
      cleanup();

      const now = Date.now();
      const entry = store.get(key);

      // No existing entry or window expired — start fresh
      if (!entry || now > entry.resetAt) {
        const resetAt = now + windowMs;
        store.set(key, { count: 1, resetAt });
        return { allowed: true, remaining: max - 1, resetAt, limit: max };
      }

      // Within window — increment counter
      entry.count += 1;

      if (entry.count > max) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: entry.resetAt,
          limit: max,
        };
      }

      return {
        allowed: true,
        remaining: max - entry.count,
        resetAt: entry.resetAt,
        limit: max,
      };
    },

    /** Get rate limit headers for the response */
    headers(result: RateLimitResult): Record<string, string> {
      return {
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(Math.max(0, result.remaining)),
        "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
      };
    },
  };
}

// ── Pre-configured limiters for different API tiers ──────────────────

/** V1 API rate limiter: 120 requests per minute per API key */
export const v1RateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 120,
});

/** Webhook rate limiter: 300 requests per minute (high throughput for chain events) */
export const webhookRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 300,
});
