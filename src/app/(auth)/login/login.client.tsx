"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Shield } from "lucide-react";
import { PageLoader } from "@/components/PageLoader";
import { signIn } from "next-auth/react";

export default function LoginClient() {
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl: redirectTo });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Authentication failed. Please try again.");
      setIsSigningIn(false);
    }
  };

  // Check for error in URL params (e.g. from callback)
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  if (!mounted) return <PageLoader />;

  return (
    <div className="min-h-screen bg-parchment flex selection:bg-terracotta/20">
      {/* ═══════════════════════════════════════════════════════════════
          LEFT PANEL — Brand
      ═══════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] bg-charcoal text-parchment flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="VREN Logo"
              width={32}
              height={32}
              className="object-contain brightness-0 invert"
            />
          </div>
          <span className="font-display font-semibold tracking-wide text-xl text-parchment">
            VREN
          </span>
        </Link>

        <div className="relative z-10 max-w-[360px]">
          <h2 className="font-display text-[36px] font-medium leading-[1.15] tracking-tight mb-6">
            Developer
            <br />
            Ecosystem.
          </h2>
          <p className="font-body text-[17px] text-stone leading-relaxed mb-10">
            Sign in securely with Google to access your developer dashboard, manage your protocols, and track performance.
          </p>
          <div className="flex flex-col gap-4">
            {[
              "Instant authentication via Google",
              "Enterprise-grade security",
              "Seamless protocol management",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1 w-4 h-4 rounded-full border border-stone/30 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                </div>
                <span className="font-ui text-[14px] text-stone">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <Shield className="w-4 h-4 text-stone/60" />
          <span className="font-ui text-[12px] text-stone/60 tracking-wide">
            Protected by NextAuth
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          RIGHT PANEL — Auth Flow
      ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 relative">
        {/* Mobile logo */}
        <Link
          href="/"
          className="lg:hidden flex items-center gap-2 mb-10 absolute top-6 left-6"
        >
          <Image
            src="/logo.png"
            alt="VREN Logo"
            width={28}
            height={28}
            className="object-contain"
          />
          <span className="font-display font-semibold tracking-wide text-lg text-charcoal">
            VREN
          </span>
        </Link>

        <div className="w-full max-w-[440px]">
          <div className="bg-white border border-border-subtle rounded-2xl p-8 lg:p-10 shadow-[0_8px_32px_rgba(25,25,24,0.04)]">
            <div className="mb-8">
              <h2 className="font-display text-[28px] font-medium text-charcoal tracking-tight mb-2">
                Welcome back
              </h2>
              <p className="font-body text-[16px] text-text-secondary leading-relaxed">
                Sign in to continue to the VREN developer dashboard.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-[#fff8f7] border border-[#ffe0db] rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                <p className="font-ui text-[14px] text-terracotta leading-relaxed">
                  {error}
                </p>
              </div>
            )}

            {process.env.NEXT_PUBLIC_LOGIN_ENABLE === "false" ? (
              <div className="w-full flex flex-col items-center justify-center p-8 border border-border-subtle rounded-xl bg-[#fcf9f2] text-center">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-5">
                  <Shield className="w-6 h-6 text-text-muted" />
                </div>
                <h3 className="font-display text-[20px] font-medium text-charcoal mb-2">
                  System Maintenance
                </h3>
                <p className="font-body text-[15px] text-text-secondary leading-relaxed max-w-[280px]">
                  Authentication is currently in development. Please check back later.
                </p>
              </div>
            ) : (
              <>
                <button
                  onClick={handleGoogleLogin}
                  disabled={isSigningIn}
                  className="w-full flex items-center justify-center gap-3 p-4 border border-border-subtle rounded-xl bg-white hover:bg-gray-50 hover:shadow-sm transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="font-ui text-[16px] font-medium text-charcoal">
                    {isSigningIn ? "Connecting to Google..." : "Continue with Google"}
                  </span>
                </button>
                
                <div className="mt-8 pt-6 border-t border-border-subtle">
                  <p className="font-ui text-[13px] text-text-muted text-center leading-relaxed">
                    By continuing, you agree to VREN's Terms of Service and Privacy Policy. Secure authentication provided by NextAuth.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Trust footer */}
          <div className="mt-6 flex items-center justify-center gap-5 font-ui text-[12px] text-text-muted">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>OAuth 2.0</span>
            </div>
            <span className="text-border-subtle">|</span>
            <span>Enterprise Security</span>
          </div>
        </div>
      </div>
    </div>
  );
}

