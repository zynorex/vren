export interface SubscriberRow {
  id: string;
  wallet: string;
  planName: string;
  planPrice: string;    // USDC 6-decimal string
  planDuration: number; // Seconds
  active: boolean;
  expiry: string;       // ISO date string
  createdAt: string;    // ISO date string
  ltvUsd: number;       // Estimated lifetime value in USD
}

export interface TransactionRow {
  id: string;
  transactionHash: string;
  type: "new_subscription" | "renewal" | "cancelled";
  usdcAmount: string | null;  // 6-decimal string
  wallet: string;
  planName: string | null;
  tokenId: string | null;
  createdAt: string;          // ISO date string
}

export interface AnalyticsData {
  mrr: number;
  arr: number;
  mrrGrowthPct: number;
  activeSubscribers: number;
  subscriberGrowthPct: number;
  churnRate: number;
  arpu: number;
  ltv: number;
  newThisPeriod: number;
  cancelledThisPeriod: number;
  planBreakdown: Array<{ name: string; mrr: number; pct: number }>;
}
