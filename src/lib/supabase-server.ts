import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client for use in Server Components, Route Handlers,
 * and Server Actions. This client reads and writes auth cookies through
 * Next.js's `cookies()` API, keeping the session in sync with the middleware.
 *
 * SECURITY NOTES:
 * - Always use `getUser()` over `getSession()` for auth checks.
 *   `getSession()` reads from the JWT stored in cookies without server
 *   validation; `getUser()` makes a round-trip to Supabase's auth server
 *   to verify the token hasn't been tampered with.
 * - This client uses the `anon` key. Row Level Security (RLS) on your
 *   Supabase tables is what enforces authorization.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                // Enforce secure cookies in production
                secure: process.env.NODE_ENV === "production",
                // Prevent CSRF — cookie is only sent with same-site requests
                sameSite: "lax",
                // Prevent client-side JS from reading auth cookies
                httpOnly: true,
              })
            );
          } catch {
            // `setAll` can be called from a Server Component where cookies
            // are read-only. This is safe to ignore when middleware is
            // handling session refresh.
          }
        },
      },
    }
  );
}
