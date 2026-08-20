export interface CustomerAccount {
  customer_id: string;
  location_id: string;
  customer_segment: string;
  sales_rep_id: string;
  lifetime_revenue: number;
  revenue_trend_pct: number;
  avg_gross_margin_pct: number;
  avg_nafis_share_pct: number;
  main_competitor: string;
  total_complaints: number;
  high_severity_complaints: number;
  bounced_checks_count: number;
  avg_delay_days: number;
  risk_score: number;
  opportunity_score: number;
  health_status: 'At Risk' | 'Needs Attention' | 'Healthy';
  payment_risk_level: string;
  quality_complaint_risk_level: string;
  latest_next_action?: string;
  recommended_action?: string;
}

export interface CustomerProfile {
  customer_id: string;
  location_id: string;
  customer_segment: string;
  relationship_start_date: string;
  credit_limit: number;
  payment_terms_days: number;
  customer_status: string;
  sales_rep_id: string;
  health_status: string;
  risk_score: number;
  opportunity_score: number;
  payment_risk_level: string;
  quality_complaint_risk_level: string;
}

export interface MonthlySalesRecord {
  month: string;
  revenue: number;
  quantity: number;
  gross_profit: number;
  avg_margin_pct: number;
}

export interface ProductBreakdown {
  product_family: string;
  order_lines: number;
  total_revenue: number;
  total_quantity: number;
  total_gross_profit: number;
  avg_margin_pct: number;
}

export interface ComplaintRecord {
  complaint_id: string;
  product_id: string;
  product_family: string;
  complaint_title: string;
  complaint_text: string;
  severity: string;
  created_at: string;
  complaint_status: string;
  resolved_at?: string;
  resolution_text?: string;
  hembaft_reference?: string;
}

export interface CRMRecord {
  interaction_id: string;
  record_version: number;
  event_time: string;
  interaction_type: string;
  summary_text: string;
  next_action: string;
  record_status: string;
  sales_rep_id: string;
  product_id?: string;
}

export interface DevRequestRecord {
  request_id: string;
  product_id: string;
  created_at: string;
  request_type: string;
  requirement_text: string;
  decision_at?: string;
  status: string;
  outcome_text?: string;
  owner_unit: string;
}

export interface BasketShareRecord {
  month_key: string;
  estimated_total_purchase: number;
  nafis_purchase: number;
  nafis_share_pct: number;
  main_competitor: string;
  estimate_source: string;
}

export interface OfferRecord {
  offer_id: string;
  offer_date: string;
  product_id: string;
  product_family: string;
  base_price_per_unit: number;
  offered_price_per_unit: number;
  offer_discount_pct: number;
  offer_type: string;
  offer_reason: string;
  result: string;
}

export interface RiskBreakdown {
  customer_id: string;
  total_risk_score: number;
  health_status: string;
  risk_components: Array<{
    factor: string;
    points: number;
    evidence: string;
  }>;
}

export interface NextBestAction {
  action: string;
  priority: string;
  rationale: string;
  target_unit: string;
  expected_impact: string;
}

export interface Customer360Data {
  customer_id: string;
  profile: CustomerProfile;
  kpis: Record<string, any>;
  sales_monthly: MonthlySalesRecord[];
  product_breakdown: ProductBreakdown[];
  complaints: ComplaintRecord[];
  crm_history: CRMRecord[];
  payment_financials: {
    payment_risk_level: string;
    avg_delay_days: number;
    max_delay_days: number;
    bounced_checks_count: number;
    recent_records: Array<{
      collection_id: string;
      invoice_number: string;
      invoice_date: string;
      due_date: string;
      collection_event_date: string;
      collected_amount: number;
      delay_days: number;
      bounced_check: string;
    }>;
  };
  basket_share: BasketShareRecord[];
  development_requests: DevRequestRecord[];
  offers: OfferRecord[];
  risk_breakdown: RiskBreakdown;
  next_best_action: NextBestAction;
}
