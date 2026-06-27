import { parseAbi } from "viem";

/**
 * VREN Contract ABIs — derived from VrenSubscription.sol and VrenRegistry.sol.
 * Uses viem's parseAbi for type-safe ABI definitions.
 */

export const VREN_SUBSCRIPTION_ABI = parseAbi([
  // ── Read ───────────────────────────────────────────────────────
  "function hasAccess(bytes32 appId, address wallet) external view returns (bool)",
  "function getSubscription(bytes32 appId, address wallet) external view returns (uint256 planId, uint256 expiry, bool active)",
  "function plans(bytes32 appId, uint256 planId) external view returns (uint256 price, uint256 duration, bool active)",
  "function subscriptions(bytes32 appId, address wallet) external view returns (uint256 planId, uint256 expiry, bool active)",
  "function platformFeeBps() external view returns (uint256)",
  "function treasury() external view returns (address)",
  // ── Write ──────────────────────────────────────────────────────
  "function createPlan(bytes32 appId, uint256 planId, uint256 price, uint256 duration) external",
  "function updatePlan(bytes32 appId, uint256 planId, uint256 price, uint256 duration, bool active) external",
  "function subscribe(bytes32 appId, uint256 planId) external",
  "function pause() external",
  "function unpause() external",
  "function setTreasury(address _newTreasury) external",
  "function setPlatformFeeBps(uint256 _newFee) external",
  // ── Events ────────────────────────────────────────────────────
  "event PlanCreated(bytes32 indexed appId, uint256 indexed planId, uint256 price, uint256 duration)",
  "event PlanUpdated(bytes32 indexed appId, uint256 indexed planId, uint256 price, uint256 duration, bool active)",
  "event Subscribed(bytes32 indexed appId, address indexed subscriber, uint256 indexed planId, uint256 tokenId, uint256 expiry)",
  "event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury)",
]);

export const VREN_REGISTRY_ABI = parseAbi([
  // ── Read ───────────────────────────────────────────────────────
  "function isOwner(bytes32 appId, address caller) external view returns (bool)",
  "function getPayoutWallet(bytes32 appId) external view returns (address)",
  "function getApp(bytes32 appId) external view returns (address owner, address payoutWallet, string memory name, bool active)",
  "function apps(bytes32 appId) external view returns (address owner, address payoutWallet, string memory name, bool active)",
  "function developerApps(address owner, uint256 index) external view returns (bytes32)",
  // ── Write ──────────────────────────────────────────────────────
  "function registerApp(string calldata name, address payoutWallet) external returns (bytes32 appId)",
  "function updatePayoutWallet(bytes32 appId, address newPayoutWallet) external",
  "function setAppStatus(bytes32 appId, bool active) external",
  // ── Events ────────────────────────────────────────────────────
  "event AppRegistered(bytes32 indexed appId, address indexed owner, string name)",
  "event AppPayoutWalletUpdated(bytes32 indexed appId, address newPayoutWallet)",
  "event AppStatusChanged(bytes32 indexed appId, bool active)",
]);

export const USDC_ABI = parseAbi([
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
]);

// ── Deployed addresses ─────────────────────────────────────────────────────

type Network = "polygon" | "amoy" | "localhost";

const network = (process.env.NEXT_PUBLIC_VREN_NETWORK || "localhost") as Network;

const addr = (process.env.NEXT_PUBLIC_VREN_REGISTRY_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;
const subAddr = (process.env.NEXT_PUBLIC_VREN_SUBSCRIPTION_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const VREN_ADDRESSES: Record<Network, { registry: `0x${string}`; subscription: `0x${string}` }> = {
  polygon:   { registry: addr, subscription: subAddr },
  amoy:      { registry: addr, subscription: subAddr },
  localhost: { registry: addr, subscription: subAddr },
};

export const USDC_ADDRESSES: Record<Network, `0x${string}`> = {
  polygon:   "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  amoy:      "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
  localhost: "0x0000000000000000000000000000000000000000",
};

export function getContracts(): { registry: `0x${string}`; subscription: `0x${string}` } {
  return VREN_ADDRESSES[network];
}

export function getUSDCAddress(): `0x${string}` {
  return USDC_ADDRESSES[network];
}
