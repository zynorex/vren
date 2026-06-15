"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useConnect,
  useAccount,
  useDisconnect,
  useSignMessage,
  Connector,
} from "wagmi";
import { SiweMessage } from "siwe";
import {
  ArrowRight,
  Loader2,
  CheckCircle2,
  Shield,
  Wallet,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { PageLoader } from "@/components/PageLoader";

// ── Wallet icon map ──────────────────────────────────────────────
function getWalletMeta(connector: Connector) {
  const id = connector.id.toLowerCase();
  const name = connector.name;

  if (id.includes("metamask") || name.includes("MetaMask")) {
    return {
      name: "MetaMask",
      description: "Connect with your browser extension",
      icon: "🦊",
      color: "from-[#f6851b]/10 to-[#e2761b]/5",
      border: "hover:border-[#f6851b]/40",
    };
  }
  if (id.includes("walletconnect") || name.includes("WalletConnect")) {
    return {
      name: "WalletConnect",
      description: "Scan with your mobile wallet",
      icon: "🔗",
      color: "from-[#3b99fc]/10 to-[#3b99fc]/5",
      border: "hover:border-[#3b99fc]/40",
    };
  }
  if (id.includes("coinbase") || name.includes("Coinbase")) {
    return {
      name: "Coinbase Wallet",
      description: "Connect with Coinbase Wallet",
      icon: "🔵",
      color: "from-[#0052ff]/10 to-[#0052ff]/5",
      border: "hover:border-[#0052ff]/40",
    };
  }
  return {
    name: name,
    description: "Connect your wallet",
    icon: "💎",
    color: "from-charcoal/5 to-charcoal/5",
    border: "hover:border-charcoal/30",
  };
}

type Step = "connect" | "sign" | "success";

export default function LoginClient() {
  const [step, setStep] = useState<Step>("connect");
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { address, isConnected, chain, connector: activeConnector } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  // Prevent hydration mismatch — wagmi connectors differ between server and client
  useEffect(() => {
    setMounted(true);
  }, []);

  // When wallet connects, move to sign step
  useEffect(() => {
    if (isConnected && address && step === "connect") {
      setStep("sign");
      setError(null);
    }
  }, [isConnected, address, step]);

  // Handle wallet connection
  const handleConnect = useCallback(
    (connector: Connector) => {
      setError(null);
      connect(
        { connector },
        {
          onError: (err) => {
            if (err.message.includes("rejected")) {
              setError("Connection was rejected. Please try again.");
            } else {
              setError("Failed to connect wallet. Please try again.");
            }
          },
        }
      );
    },
    [connect]
  );

  // SIWE Sign-In flow
  const handleSignIn = useCallback(async () => {
    if (!address || !chain) return;

    setIsSigningIn(true);
    setError(null);

    try {
      // 1. Get a fresh nonce from the server
      const nonceRes = await fetch("/api/auth/nonce");
      if (!nonceRes.ok) throw new Error("Failed to get nonce");
      const { nonce } = await nonceRes.json();

      // 2. Create the SIWE message
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in to VREN Developer Dashboard",
        uri: window.location.origin,
        version: "1",
        chainId: chain.id,
        nonce,
      });

      const messageStr = message.prepareMessage();

      // 3. Ask user to sign the message
      const signature = await signMessageAsync({ message: messageStr });

      // 4. Verify the signature on the server
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageStr, signature }),
      });

      if (!verifyRes.ok) {
        const data = await verifyRes.json();
        throw new Error(data.error || "Verification failed");
      }

      // 5. Success — show confirmation then redirect
      setStep("success");
      setTimeout(() => {
        router.push(redirectTo);
      }, 1500);
    } catch (err: any) {
      if (err?.message?.includes("rejected") || err?.message?.includes("denied")) {
        setError("Signature was rejected. Please try again to sign in.");
      } else {
        setError(err.message || "Authentication failed. Please try again.");
      }
    } finally {
      setIsSigningIn(false);
    }
  }, [address, chain, signMessageAsync, router, redirectTo]);

  // Format address for display
  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

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
            Your wallet is
            <br />
            your identity.
          </h2>
          <p className="font-body text-[17px] text-stone leading-relaxed mb-10">
            No email. No password. Connect your wallet and sign a message to
            prove ownership. Your private key never leaves your device.
          </p>
          <div className="flex flex-col gap-4">
            {[
              "One-click sign in with any EVM wallet",
              "Cryptographic proof of ownership via SIWE",
              "No personal data collected or stored",
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
            EIP-4361 (Sign-In With Ethereum) standard
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
            {/* ── Step 1: Connect Wallet ────────────────────────── */}
            {step === "connect" && (
              <>
                <div className="mb-8">
                  <div className="w-12 h-12 bg-[#f5f3ec] rounded-xl flex items-center justify-center mb-5">
                    <Wallet className="w-6 h-6 text-charcoal" />
                  </div>
                  <h2 className="font-display text-[28px] font-medium text-charcoal tracking-tight mb-2">
                    Connect Wallet
                  </h2>
                  <p className="font-body text-[16px] text-text-secondary leading-relaxed">
                    Select your preferred wallet to sign in to the VREN developer
                    dashboard.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 p-4 bg-[#fff8f7] border border-[#ffe0db] rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                    <p className="font-ui text-[14px] text-terracotta leading-relaxed">
                      {error}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  {connectors.map((connector) => {
                    const meta = getWalletMeta(connector);
                    return (
                      <button
                        key={connector.uid}
                        onClick={() => handleConnect(connector)}
                        disabled={isConnecting}
                        className={`w-full flex items-center gap-4 p-4 border border-border-subtle rounded-xl bg-gradient-to-r ${meta.color} ${meta.border} hover:shadow-sm transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center text-[22px] shrink-0 border border-border-subtle/50">
                          {meta.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-ui text-[15px] font-medium text-charcoal block">
                            {meta.name}
                          </span>
                          <span className="font-ui text-[13px] text-text-muted block">
                            {meta.description}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-charcoal group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-border-subtle">
                  <p className="font-ui text-[13px] text-text-muted text-center">
                    Don't have a wallet?{" "}
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-charcoal font-medium hover:text-terracotta transition-colors underline underline-offset-4 inline-flex items-center gap-1"
                    >
                      Get MetaMask <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </>
            )}

            {/* ── Step 2: Sign Message ──────────────────────────── */}
            {step === "sign" && (
              <>
                <div className="mb-8">
                  <div className="w-12 h-12 bg-[#eefcf0] rounded-xl flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-6 h-6 text-[#28C840]" />
                  </div>
                  <h2 className="font-display text-[28px] font-medium text-charcoal tracking-tight mb-2">
                    Verify Ownership
                  </h2>
                  <p className="font-body text-[16px] text-text-secondary leading-relaxed">
                    Sign a message to prove you own this wallet. This does not
                    cost any gas or grant transaction permissions.
                  </p>
                </div>

                {/* Connected wallet info */}
                <div className="mb-6 p-4 bg-[#f5f3ec] rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-charcoal to-terracotta flex items-center justify-center shadow-inner">
                    <span className="font-mono text-[11px] text-white font-bold">
                      {address?.slice(2, 4).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[14px] text-charcoal font-medium block">
                      {shortAddress}
                    </span>
                    <span className="font-ui text-[12px] text-text-muted block">
                      {chain?.name || "Unknown network"} ·{" "}
                      {activeConnector?.name || "Connected"}
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="mb-5 p-4 bg-[#fff8f7] border border-[#ffe0db] rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                    <p className="font-ui text-[14px] text-terracotta leading-relaxed">
                      {error}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleSignIn}
                    disabled={isSigningIn}
                    className="w-full bg-charcoal text-parchment font-ui text-[15px] font-medium px-4 py-4 rounded-xl hover:bg-[#2b2a27] active:scale-[0.99] transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {isSigningIn ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Waiting for signature...
                      </>
                    ) : (
                      <>
                        Sign Message
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      disconnect();
                      setStep("connect");
                      setError(null);
                    }}
                    className="w-full py-3 font-ui text-[14px] text-text-secondary hover:text-charcoal transition-colors"
                  >
                    Use a different wallet
                  </button>
                </div>
              </>
            )}

            {/* ── Step 3: Success ───────────────────────────────── */}
            {step === "success" && (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 bg-[#eefcf0] text-[#28C840] rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="font-display text-[28px] font-medium text-charcoal tracking-tight mb-3">
                  Welcome back
                </h2>
                <p className="font-mono text-[14px] text-charcoal bg-[#f5f3ec] px-4 py-2 rounded-lg mb-4">
                  {shortAddress}
                </p>
                <p className="font-body text-[16px] text-text-secondary mb-6">
                  Redirecting to your dashboard...
                </p>
                <Loader2 className="w-5 h-5 text-text-muted animate-spin" />
              </div>
            )}
          </div>

          {/* Trust footer */}
          <div className="mt-6 flex items-center justify-center gap-5 font-ui text-[12px] text-text-muted">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>No Gas Required</span>
            </div>
            <span className="text-border-subtle">|</span>
            <span>SIWE Standard</span>
            <span className="text-border-subtle">|</span>
            <span>Self-Custodial</span>
          </div>
        </div>
      </div>
    </div>
  );
}
