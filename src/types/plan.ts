export interface PlanData {
  id: string;
  name: string;
  onchainIdx: number;
  price: string;          // USDC 6-decimal integer string (e.g. "19000000")
  priceUsd: number;       // Parsed USD value (e.g. 19.00)
  duration: number;       // Seconds
  durationLabel: string;  // Human-readable (e.g. "/ month")
  active: boolean;
  subscriberCount: number;
  mrr: number;            // Monthly revenue from this plan in USD
}

export interface CreatePlanInput {
  name: string;
  price: string;          // USDC 6-decimal integer string OR human-readable USD
  duration: number;       // Seconds
  onchainIdx: number;     // Must match the planId in VrenSubscription contract
}

export interface UpdatePlanInput {
  name?: string;
  price?: string;
  duration?: number;
  active?: boolean;
}
