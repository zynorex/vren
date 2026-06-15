import { http, createConfig } from "wagmi";
import { polygon, polygonAmoy, hardhat } from "wagmi/chains";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";

/**
 * VREN Wagmi Configuration
 *
 * Configures wallet connectors and chain support for the VREN dashboard.
 * Supports MetaMask (injected), WalletConnect, and Coinbase Wallet.
 *
 * SECURITY:
 * - Only Polygon chains are configured (mainnet + Amoy testnet + local Hardhat).
 * - WalletConnect requires a projectId from cloud.walletconnect.com.
 * - The `injected` connector auto-detects MetaMask, Brave Wallet, etc.
 */

const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

export const wagmiConfig = createConfig({
  chains: [polygon, polygonAmoy, hardhat],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    ...(WALLETCONNECT_PROJECT_ID
      ? [
          walletConnect({
            projectId: WALLETCONNECT_PROJECT_ID,
            metadata: {
              name: "VREN",
              description: "Permissionless payment infrastructure",
              url: "https://vren.tech",
              icons: ["https://vren.tech/logo.png"],
            },
          }),
        ]
      : []),
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
