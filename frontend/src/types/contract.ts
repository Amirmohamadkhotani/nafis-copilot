/**
 * Phase 5 Standard API Contract interfaces.
 * All nullable fields are explicitly typed to support missing data states.
 */
export interface CustomerOverview {
  total_revenue: number | null;
  invoice_count: number | null;
  avg_deal_size: number | null;
  days_since_last_purchase: number | null;
}

export interface CustomerSalesContract {
  revenue_last_90d: number | null;
  revenue_prev_90d: number | null;
  revenue_change_pct: number | null;
  deal_size_change_pct: number | null;
}

export interface CustomerFinancialContract {
  margin_pct: number | null;
  average_payment_delay: number | null;
  returned_checks: number | null;
}

export interface CustomerComplaintsContract {
  total: number | null;
  open: number | null;
  high_severity: number | null;
}

export interface CustomerWalletContract {
  share_pct: number | null;
  main_competitor: string | null;
}

export interface CustomerIntelligenceContract {
  summary: string | null;
  risks: string[];
  opportunities: string[];
  next_best_action: string | null;
}

export interface CustomerContractResponse {
  customer_id: string;
  overview: CustomerOverview;
  sales: CustomerSalesContract;
  financial: CustomerFinancialContract;
  complaints: CustomerComplaintsContract;
  wallet: CustomerWalletContract;
  intelligence: CustomerIntelligenceContract;
}
