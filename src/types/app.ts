export interface AppSummary {
  id: string;
  name: string;
  contractId: string | null;
  payoutWallet: string;
  active: boolean;
  createdAt: string;
  planCount: number;
  subscriberCount: number;
  mrr: number;
}

export interface AppDetail extends AppSummary {
  plans: import("./plan").PlanData[];
}

export interface CreateAppInput {
  name: string;
  payoutWallet: string;
  contractId?: string;
}

export interface UpdateAppInput {
  name?: string;
  payoutWallet?: string;
  contractId?: string;
  active?: boolean;
}
