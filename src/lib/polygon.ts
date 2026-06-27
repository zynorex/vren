import { createPublicClient, http } from "viem";
import { polygon, polygonAmoy, hardhat } from "viem/chains";

/**
 * Server-side viem public client for on-chain reads.
 *
 * Use this in:
 *  - Server Components (data fetching)
 *  - API route handlers (server-side gate checks, on-chain state queries)
 *
 * Do NOT use in Client Components — use wagmi hooks there instead.
 */

const network = process.env.NEXT_PUBLIC_VREN_NETWORK || "localhost";

function resolveChainAndRpc() {
  switch (network) {
    case "polygon":
      return { chain: polygon, rpcUrl: process.env.POLYGON_MAINNET_RPC_URL };
    case "amoy":
      return { chain: polygonAmoy, rpcUrl: process.env.POLYGON_AMOY_RPC_URL };
    default:
      return { chain: hardhat, rpcUrl: "http://127.0.0.1:8545" };
  }
}

const { chain, rpcUrl } = resolveChainAndRpc();

export const polygonClient = createPublicClient({
  chain,
  transport: http(rpcUrl),
});
