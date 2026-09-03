import { http, createConfig } from "wagmi";
import { polygon, polygonAmoy, hardhat } from "wagmi/chains";
import { injected, coinbaseWallet } from "wagmi/connectors";

/**
 * VREN Wagmi Configuration
 *
 * Uses manual connector setup instead of RainbowKit's getDefaultConfig
 * to avoid the mandatory WalletConnect projectId requirement during development.
 *
 * Wallet support:
 * - Injected wallets (MetaMask, Phantom, Brave, etc.) — always available
 * - Coinbase Wallet — always available
 * - WalletConnect — optional, enabled only when projectId is provided
 *
 * Chain support:
 * - Polygon PoS (mainnet) — production
 * - Polygon Amoy (testnet) — staging
 * - Hardhat (localhost) — development
 *
 * SECURITY:
 * - SSR is enabled for Next.js hydration safety
 * - Only Polygon-family chains are whitelisted
 * - shimDisconnect prevents stale connection state
 */

const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

export const wagmiConfig = createConfig({
  chains: [polygon, polygonAmoy, hardhat],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    coinbaseWallet({
      appName: "VREN",
    }),
  ],
  transports: {
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
  ssr: true,
});

// Export for RainbowKit
export const walletConnectProjectId = WALLETCONNECT_PROJECT_ID;
