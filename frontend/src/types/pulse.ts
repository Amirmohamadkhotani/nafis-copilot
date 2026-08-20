export interface BusinessPulseSummary {
  total_accounts: number;
  at_risk_accounts: number;
  needs_attention_accounts: number;
  healthy_accounts: number;
  growth_opportunities_count: number;
  quality_alerts_count: number;
  payment_risks_count: number;
  financials?: {
    total_revenue: number;
    total_gross_profit: number;
    overall_avg_margin: number;
  };
}
