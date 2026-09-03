"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Shield,
  Wallet,
  CheckCircle2,
  Loader2,
  ArrowRight,
  XCircle,
  ExternalLink,
  Lock,
  Cpu
} from "lucide-react";
import { PageLoader } from "@/components/PageLoader";
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { SiweMessage } from "siwe";
import { signIn, useSession } from "next-auth/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/* ═══════════════════════════════════════════════════════════════════
   AUTH STATE MACHINE
   ═══════════════════════════════════════════════════════════════════ */
type AuthState =
  | "idle"          // Waiting for user to connect wallet
  | "connected"     // Wallet connected, ready to sign
  | "signing"       // User is being prompted to sign the SIWE message
  | "verifying"     // Server is verifying the signature
  | "success"       // Authenticated — redirecting to dashboard
  | "error";        // Something went wrong — showing recovery options

/* ═══════════════════════════════════════════════════════════════════
   ERROR CODES → USER-FRIENDLY MESSAGES
   ═══════════════════════════════════════════════════════════════════ */
const ERROR_MESSAGES: Record<string, string> = {
  user_rejected:
    "You rejected the signature request. Please try again to sign in.",
  nonce_failed:
    "Failed to generate a secure nonce. Please refresh and try again.",
  signature_failed:
    "Signature verification failed. Please try signing again.",
  network_error:
    "Network error. Please check your connection and try again.",
  session_expired:
    "Your session has expired. Please reconnect your wallet.",
  connector_failed:
    "Failed to connect wallet. Make sure your wallet extension is installed and unlocked.",
  no_wallet:
    "No wallet detected. Please install MetaMask or another EVM wallet.",
  unknown: "An unexpected error occurred. Please try again.",
};

function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.unknown;
}

/* ═══════════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════════ */
function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Known wallet connector metadata for professional display.
 */
const WALLET_META: Record<string, { name: string; icon: string; color: string }> = {
  metaMask: {
    name: "MetaMask",
    icon: "🦊",
    color: "#E8831D",
  },
  coinbaseWalletSDK: {
    name: "Coinbase Wallet",
    icon: "🔵",
    color: "#0052FF",
  },
  walletConnect: {
    name: "WalletConnect",
    icon: "🔗",
    color: "#3B99FC",
  },
  injected: {
    name: "Browser Wallet",
    icon: "🌐",
    color: "#ffffff",
  },
};

function getWalletMeta(connectorId: string) {
  return WALLET_META[connectorId] || WALLET_META.injected;
}

/* ═══════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function LoginClient() {
  const [authState, setAuthState] = useState<AuthState>("idle");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const hasAttemptedSignIn = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  // Wagmi hooks
  const { address, isConnected, chain, connector } = useAccount();
  const { connectors, connectAsync, isPending: isConnecting } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();

  // NextAuth session
  const { data: session, status: sessionStatus } = useSession();

  // GSAP Animations
  useGSAP(() => {
    if (!mounted) return;

    const tl = gsap.timeline();

    // Background gradient animation
    gsap.to(bgRef.current, {
      backgroundPosition: "200% center",
      duration: 20,
      ease: "none",
      repeat: -1,
    });

    // Card entrance
    tl.fromTo(
      cardRef.current,
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "expo.out" }
    );

    // Staggered elements inside card
    if (elementsRef.current) {
      tl.fromTo(
        elementsRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
        "-=0.8"
      );
    }
  }, { scope: containerRef, dependencies: [mounted] });

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Redirect if already authenticated ────────────────────────────
  useEffect(() => {
    if (sessionStatus === "authenticated" && session) {
      router.replace(redirectTo);
    }
  }, [sessionStatus, session, redirectTo, router]);

  // ── Sync wallet connection state ─────────────────────────────────
  useEffect(() => {
    if (isConnected && address && authState === "idle") {
      setAuthState("connected");
      setErrorCode(null);
    }
    if (!isConnected && authState !== "idle" && authState !== "success") {
      setAuthState("idle");
    }
  }, [isConnected, address, authState]);

  // ── Check for URL error params ───────────────────────────────────
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setErrorCode(errorParam);
      setAuthState("error");
    }
  }, [searchParams]);

  /* ═══════════════════════════════════════════════════════════════════
     CONNECT WALLET
     ═══════════════════════════════════════════════════════════════════ */
  const handleConnect = useCallback(
    async (connectorInstance: (typeof connectors)[number]) => {
      setErrorCode(null);
      try {
        await connectAsync({ connector: connectorInstance });
        setAuthState("connected");
      } catch (error: any) {
        console.error("[Login] Connect error:", error);

        if (
          error?.code === 4001 ||
          error?.message?.includes("User rejected") ||
          error?.message?.includes("user rejected") ||
          error?.message?.includes("User denied")
        ) {
          setErrorCode("user_rejected");
          return;
        }

        if (
          error?.message?.includes("Connector not found") ||
          error?.message?.includes("No provider")
        ) {
          setErrorCode("no_wallet");
          return;
        }

        setErrorCode("connector_failed");
      }
    },
    [connectAsync]
  );

  /* ═══════════════════════════════════════════════════════════════════
     SIWE SIGN-IN FLOW
     ═══════════════════════════════════════════════════════════════════ */
  const handleSignIn = useCallback(async () => {
    if (!address || !isConnected) return;
    if (hasAttemptedSignIn.current) return;
    hasAttemptedSignIn.current = true;

    try {
      setAuthState("signing");
      setErrorCode(null);

      let nonce: string;
      try {
        const nonceRes = await fetch("/api/auth/siwe/nonce", {
          cache: "no-store",
        });
        if (!nonceRes.ok) throw new Error("Nonce fetch failed");
        const nonceData = await nonceRes.json();
        nonce = nonceData.nonce;
      } catch {
        setAuthState("error");
        setErrorCode("nonce_failed");
        hasAttemptedSignIn.current = false;
        return;
      }

      const siweMessage = new SiweMessage({
        domain: window.location.host,
        address,
        statement:
          "Sign in to the VREN developer dashboard. This request will not trigger a blockchain transaction or cost any gas fees.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id ?? 137,
        nonce,
        issuedAt: new Date().toISOString(),
        expirationTime: new Date(
          Date.now() + 10 * 60 * 1000
        ).toISOString(),
      });

      const messageToSign = siweMessage.prepareMessage();

      let signature: string;
      try {
        signature = await signMessageAsync({ message: messageToSign });
      } catch (signError: any) {
        if (
          signError?.name === "UserRejectedRequestError" ||
          signError?.code === 4001 ||
          signError?.message?.includes("User rejected") ||
          signError?.message?.includes("user rejected") ||
          signError?.message?.includes("User denied")
        ) {
          setAuthState("connected");
          setErrorCode("user_rejected");
          hasAttemptedSignIn.current = false;
          return;
        }
        throw signError;
      }

      setAuthState("verifying");

      try {
        const result = await signIn("siwe", {
          message: messageToSign,
          signature,
          redirect: false,
        });

        if (result?.error) {
          setAuthState("error");
          setErrorCode("signature_failed");
          hasAttemptedSignIn.current = false;
          return;
        }

        setAuthState("success");
        await new Promise((resolve) => setTimeout(resolve, 800));
        router.replace(redirectTo);
      } catch {
        setAuthState("error");
        setErrorCode("signature_failed");
        hasAttemptedSignIn.current = false;
      }
    } catch (error) {
      console.error("[Login] Sign-in error:", error);
      setAuthState("error");
      setErrorCode("unknown");
      hasAttemptedSignIn.current = false;
    }
  }, [address, isConnected, chain, signMessageAsync, router, redirectTo]);

  const handleRetry = useCallback(() => {
    setErrorCode(null);
    hasAttemptedSignIn.current = false;
    if (isConnected) {
      setAuthState("connected");
    } else {
      setAuthState("idle");
    }
  }, [isConnected]);

  const handleDisconnectAndRetry = useCallback(() => {
    disconnect();
    setErrorCode(null);
    setAuthState("idle");
    hasAttemptedSignIn.current = false;
  }, [disconnect]);

  const uniqueConnectors = connectors.filter(
    (c, i, arr) => arr.findIndex((x) => x.id === c.id) === i
  );

  if (!mounted) return <PageLoader />;
  if (sessionStatus === "loading") return <PageLoader />;

  /* ═══════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════ */
  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden text-parchment selection:bg-terracotta/30">
      
      {/* ─── DYNAMIC BACKGROUND ───────────────────────────────────────── */}
      <div 
        ref={bgRef}
        className="absolute inset-0 z-0 opacity-40"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(217, 119, 87, 0.15) 0%, rgba(25, 25, 24, 0) 50%)",
          backgroundSize: "200% 200%",
        }}
      />
      <div className="absolute inset-0 z-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(circle at center, black, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at center, black, transparent 80%)",
        }}
      />

      {/* ─── BRAND HEADER (Absolute) ──────────────────────────────────── */}
      <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg border border-white/10 group-hover:bg-white/10 transition-colors duration-300">
            <Image
              src="/logo.png"
              alt="VREN Logo"
              width={20}
              height={20}
              className="object-contain brightness-0 invert"
            />
          </div>
          <span className="font-display font-semibold tracking-widest text-lg text-white">
            VREN
          </span>
        </Link>
      </div>

      {/* ─── MAIN CARD ────────────────────────────────────────────────── */}
      <div 
        ref={cardRef}
        className="relative z-10 w-full max-w-[480px] p-10 md:p-12 mx-4"
      >
        {/* Glassmorphic Container */}
        <div className="absolute inset-0 bg-[#121212]/60 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden" />
        
        {/* Subtle top highlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-terracotta/50 to-transparent" />

        <div className="relative z-20" ref={elementsRef}>
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 mb-6 shadow-inner">
              <Cpu className="w-8 h-8 text-terracotta" strokeWidth={1.5} />
            </div>
            <h1 className="font-display text-[32px] font-medium text-white tracking-tight mb-3">
              {authState === "success" ? "Access Granted" : "Developer Portal"}
            </h1>
            <p className="font-body text-[15px] text-stone/80 leading-relaxed max-w-[300px] mx-auto">
              {authState === "success"
                ? "Establishing secure session..."
                : "Authenticate with your wallet to manage your on-chain protocols."}
            </p>
          </div>

          {/* Error Banner */}
          {errorCode && authState !== "success" && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 backdrop-blur-md">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-ui text-[14px] text-red-200 leading-relaxed">
                  {getErrorMessage(errorCode)}
                </p>
              </div>
              <button
                onClick={() => setErrorCode(null)}
                className="text-red-400/60 hover:text-red-300 transition-colors shrink-0 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ─── STATE: Maintenance Mode ──────────────────────────── */}
          {process.env.NEXT_PUBLIC_LOGIN_ENABLE === "false" ? (
            <div className="w-full flex flex-col items-center justify-center py-8 text-center">
              <Shield className="w-10 h-10 text-stone/50 mb-4" />
              <h3 className="font-display text-[20px] font-medium text-white mb-2">
                System Offline
              </h3>
              <p className="font-body text-[15px] text-stone/70 leading-relaxed">
                Authentication is currently disabled for maintenance.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              
              {/* ─── STATE: Idle — Wallet Selection ──────────────── */}
              {(authState === "idle" || (authState === "error" && !isConnected)) && (
                <div className="flex flex-col gap-3">
                  {uniqueConnectors.map((c) => {
                    const meta = getWalletMeta(c.id);
                    return (
                      <button
                        id={`connect-${c.id}`}
                        key={c.id}
                        onClick={() => handleConnect(c)}
                        disabled={isConnecting}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-terracotta/30 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer overflow-hidden relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-terracotta/0 via-terracotta/5 to-terracotta/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                        
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm border border-white/10 relative z-10 bg-[#1A1A1A]"
                        >
                          {meta.icon}
                        </div>
                        <div className="flex-1 text-left relative z-10">
                          <span className="font-ui text-[16px] font-medium text-white block mb-0.5">
                            {meta.name}
                          </span>
                          <span className="font-mono text-[11px] text-stone/60 uppercase tracking-wider">
                            {c.id === "injected"
                              ? "Auto-detected"
                              : "Connect"}
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-terracotta/20 transition-colors relative z-10">
                          <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-terracotta transition-colors" />
                        </div>
                      </button>
                    );
                  })}
                  
                  <div className="mt-6 text-center">
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-ui text-[13px] text-stone/60 hover:text-white transition-colors group"
                    >
                      New to Web3? Get a wallet
                      <ExternalLink className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              )}

              {/* ─── STATE: Connected — Sign Message ───────────────── */}
              {authState === "connected" && address && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center justify-between p-4 mb-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-terracotta to-warm-gold flex items-center justify-center">
                          <Wallet className="w-4 h-4 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#121212] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#28C840] shadow-[0_0_8px_rgba(40,200,64,0.6)]" />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-[14px] font-medium text-white tracking-wide">
                          {truncateAddress(address)}
                        </span>
                        <span className="font-ui text-[12px] text-stone/60">
                          {chain?.name || "Unknown Network"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    id="sign-message-btn"
                    onClick={handleSignIn}
                    className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-terracotta to-terracotta-dark text-white hover:shadow-[0_0_24px_rgba(217,119,87,0.4)] transition-all duration-300 group cursor-pointer border border-terracotta/50"
                  >
                    <Lock className="w-5 h-5" />
                    <span className="font-ui text-[16px] font-medium tracking-wide">
                      Sign In & Verify
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    onClick={handleDisconnectAndRetry}
                    className="w-full mt-4 text-center font-ui text-[13px] text-stone/50 hover:text-white transition-colors cursor-pointer"
                  >
                    Disconnect wallet
                  </button>
                </div>
              )}

              {/* ─── STATE: Signing ────────────────────────────────── */}
              {authState === "signing" && (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center relative z-10 bg-[#121212]">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-terracotta border-t-transparent animate-spin" />
                  </div>
                  <h3 className="font-display text-[20px] font-medium text-white mb-2 tracking-tight">
                    Awaiting Signature
                  </h3>
                  <p className="font-body text-[14px] text-stone/70 leading-relaxed max-w-[260px] mx-auto">
                    Please confirm the request in your wallet extension. Zero gas fees.
                  </p>
                </div>
              )}

              {/* ─── STATE: Verifying ──────────────────────────────── */}
              {authState === "verifying" && (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center relative z-10 bg-[#121212]">
                      <Shield className="w-6 h-6 text-terracotta" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-terracotta/20 animate-ping" />
                  </div>
                  <h3 className="font-display text-[20px] font-medium text-white mb-2 tracking-tight">
                    Verifying
                  </h3>
                  <p className="font-body text-[14px] text-stone/70 leading-relaxed">
                    Validating cryptographic proof...
                  </p>
                </div>
              )}

              {/* ─── STATE: Success ────────────────────────────────── */}
              {authState === "success" && (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <p className="font-mono text-[13px] text-green-400 mb-2 tracking-widest uppercase">
                    Verification Complete
                  </p>
                  <p className="font-body text-[15px] text-stone/70">
                    Routing to dashboard...
                  </p>
                </div>
              )}

              {/* ─── STATE: Error (with wallet connected) ──────────── */}
              {authState === "error" && isConnected && (
                <div className="flex flex-col gap-4 animate-fade-in-up">
                  <button
                    onClick={handleRetry}
                    className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/10 text-white hover:bg-white/15 border border-white/10 transition-all cursor-pointer"
                  >
                    <span className="font-ui text-[16px] font-medium">
                      Try Again
                    </span>
                  </button>
                  <button
                    onClick={handleDisconnectAndRetry}
                    className="w-full text-center font-ui text-[13px] text-stone/50 hover:text-white transition-colors cursor-pointer"
                  >
                    Use a different wallet
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Footer Metrics */}
          <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-stone/50 uppercase tracking-widest">
            <span>EIP-4361 Protocol</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#28C840]" />
              System Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
