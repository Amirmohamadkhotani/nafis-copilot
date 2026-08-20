/**
 * COPAN Smart CRM Dashboard TypeScript Definitions.
 * Strictly typed interfaces for all 10 Decision-Support domains.
 */

// 1. KPI Summary
export interface DashboardKPISummary {
  total_sales: {
    value: number;
    current_period: number;
    previous_period: number;
    currency: string;
    avg_margin_pct: number | null;
  };
  sales_growth: {
    growth_rate_pct: number | null;
    trend_direction: 'UP' | 'DOWN';
    status: string;
  };
  at_risk_customers: {
    total_at_risk: number;
    total_accounts: number;
    breakdown: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
  };
  sales_opportunities: {
    count: number;
    pipeline_estimated_value: number;
    active_negotiations_count: number;
    open_complaints_count: number;
    critical_complaints_count: number;
  };
}

// 2. Sales Performance Trend
export interface SalesPerformanceMonth {
  month: string;
  revenue: number;
  quantity: number;
  gross_profit: number;
  avg_margin_pct: number | null;
  active_customers: number;
  invoices_count: number;
  growth_change_pct: number | null;
}

// 3. Operational Alerts
export interface DashboardAlert {
  id: string;
  title: string;
  type: 'Risk' | 'Important Action' | 'Important Complaint';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  customer_id: string;
  sales_rep_id?: string;
  reason: string;
  suggested_action: string;
}

export interface DashboardAlertsResponse {
  risk_alerts: DashboardAlert[];
  action_alerts: DashboardAlert[];
  complaint_alerts: DashboardAlert[];
}

// 4. Segmented Important Customers
export interface SegmentedCustomer {
  customer_id: string;
  customer_segment: string;
  sales_rep_id: string;
  location_id: string;
  lifetime_revenue: number;
  revenue_trend_pct: number | null;
  avg_gross_margin_pct: number | null;
  avg_nafis_share_pct: number | null;
  main_competitor: string | null;
  risk_score: number;
  opportunity_score: number;
  health_status: 'At Risk' | 'Needs Attention' | 'Healthy';
  total_complaints: number;
  latest_next_action?: string;
}

export interface ImportantCustomersResponse {
  strategic_high_value: SegmentedCustomer[];
  growth_opportunity: SegmentedCustomer[];
  at_risk: SegmentedCustomer[];
  needs_attention: SegmentedCustomer[];
}

// 5. Sales Opportunities Pipeline
export interface SalesOpportunity {
  customer_id: string;
  opportunity_title: string;
  customer_segment: string;
  sales_rep_id: string;
  opportunity_score: number;
  estimated_value: number;
  stage: string;
  win_probability_pct: number;
  avg_margin_pct: number | null;
  current_nafis_share_pct: number | null;
  main_competitor: string;
  last_activity_date?: string;
  next_action: string;
}

// 6. Risky Collections
export interface RiskyCollection {
  collection_id: string;
  customer_id: string;
  customer_segment: string;
  sales_rep_id: string;
  invoice_number: string;
  due_date: string;
  delay_days: number;
  amount: number;
  bounced_check: boolean;
  risk_level: 'Critical' | 'High' | 'Medium';
  recommended_action: string;
}

// 7. Open Complaints
export interface OpenComplaint {
  complaint_id: string;
  customer_id: string;
  customer_segment: string;
  sales_rep_id: string;
  product_id: string;
  product_family: string;
  complaint_title: string;
  complaint_text: string;
  severity: string;
  created_at: string;
  days_open: number;
  complaint_status: string;
  recommended_action: string;
}

// 8. Negotiation Offers
export interface NegotiationOffer {
  offer_id: string;
  customer_id: string;
  customer_segment: string;
  sales_rep_id: string;
  product_id: string;
  product_family: string;
  base_price: number;
  offered_price: number;
  discount_pct: number | null;
  offer_type: string;
  offer_reason: string;
  offer_date: string;
  days_in_negotiation: number;
  aging_severity: 'Critical' | 'High' | 'Medium';
  recommended_action: string;
}

// 9. Customers Requiring Follow-up
export interface FollowUpCustomer {
  customer_id: string;
  customer_segment: string;
  sales_rep_id: string;
  priority: 'Critical' | 'High' | 'Medium';
  factual_reason: string;
  last_activity: string;
  recommended_action: string;
}

// 10. Smart AI Recommendations
interface LegacyRecommendationEvidence {
  metric: string;
  value: string;
  source: string;
}

export interface SmartRecommendation {
  id: string;
  customer_id: string;
  sales_rep_id?: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  data_summary: string;
  signal: string;
  insight: string;
  action: string;
  target_unit: string;
  evidence: LegacyRecommendationEvidence[];
}
