export type RecommendationType = 'GROW' | 'PROTECT_FIX' | 'REDUCE_FOCUS';
export type RecommendationPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type RecommendationConfidence = 'high' | 'medium' | 'limited';

export interface HealthResponse { status: string; service: string }

export interface CustomerListItem {
  customer_id: string;
  historical_total_revenue: number | null;
  historical_invoice_count: number | null;
  historical_wallet_share_pct: number | null;
  complaint_count: number;
  open_complaint_count: number;
  median_payment_delay_days: number | null;
  returned_check_count: number;
  known_margin_pct: number | null;
  actual_cost_coverage_pct: number | null;
  profitability_status: 'actual' | 'partial' | 'insufficient';
  wallet_data_available: boolean;
}

export type CustomerMasterRecord = {
  Customer_ID: string;
  [field: string]: string | number | boolean | null;
};

export interface RecommendationEvidence {
  metric: string;
  value: string | number | boolean | null;
  source: string;
  evidence_type: string;
  note: string;
}

export interface SuspendedOpportunity {
  recommendation_type: RecommendationType;
  status: 'suspended_until_risk_resolution';
  note: string;
}

export interface CustomerRecommendation {
  customer_id: string;
  recommendation_type: RecommendationType | null;
  priority: RecommendationPriority | null;
  summary: string | null;
  next_best_action: string | null;
  evidence: RecommendationEvidence[];
  blocking_risks: string[];
  suspended_opportunities: SuspendedOpportunity[];
  confidence: RecommendationConfidence;
  status: 'ready' | 'insufficient_evidence';
}

export type ActionableRecommendation = Pick<CustomerRecommendation,
  'customer_id' | 'recommendation_type' | 'priority' | 'summary' |
  'next_best_action' | 'confidence' | 'blocking_risks' | 'suspended_opportunities'
> & { recommendation_type: RecommendationType; priority: RecommendationPriority };

export interface RecommendationFocusSummary {
  total_customers: number;
  grow: number;
  protect_fix: number;
  reduce_focus: number;
  insufficient_evidence: number;
  actionable: number;
}

export interface RecommendationFocusListResponse {
  summary: RecommendationFocusSummary;
  recommendations: ActionableRecommendation[];
}

export interface CustomerProfileRecord {
  Customer_ID: string;
  Location_ID?: string | null;
  Customer_Segment?: string | null;
  Relationship_Start_Date?: string | null;
  Credit_Limit?: number | null;
  Payment_Terms_Days?: number | null;
  Customer_Status?: string | null;
  Source_System?: string | null;
  Sales_Rep_ID?: string | null;
}

export interface CommercialSummary {
  historical_total_revenue: number | null;
  historical_invoice_count: number | null;
}

export type CustomerRfm = { available: false } | {
  available: true;
  recency: number;
  frequency: number;
  monetary: number;
  r_score: number;
  f_score: number;
  m_score: number;
  segment: string;
};

export interface SignalMetric {
  name: string;
  value: string | number | boolean | null;
  source: string;
}

export interface CustomerSignal {
  type: 'QUALITY_RISK' | 'PAYMENT_RISK' | 'GROWTH_SIGNAL' | 'PROFITABILITY_SIGNAL';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  metrics: SignalMetric[];
}

export interface CategorizedSignals {
  risk_signals: CustomerSignal[];
  opportunity_signals: CustomerSignal[];
  economic_signals: CustomerSignal[];
}

export interface CustomerIntelligenceResponse {
  customer_id: string;
  profile: CustomerProfileRecord;
  commercial_summary: CommercialSummary;
  rfm: CustomerRfm;
  signals: CategorizedSignals;
  recommendation: CustomerRecommendation;
  evidence: RecommendationEvidence[];
}

export interface DashboardSummaryResponse {
  total_customers: number;
  recommendation_distribution: {
    GROW: number;
    PROTECT_FIX: number;
    REDUCE_FOCUS: number;
    insufficient_evidence: number;
  };
  signal_distribution: Record<string, number>;
  priority_distribution: Record<RecommendationPriority, number>;
}

export interface UnavailableFeature {
  available: false;
  reason: 'not_supported_by_backend';
}

export interface Customer360Response {
  customer_id: string;
  profile: {
    customer_name: string | null;
    customer_id: string;
    segment: string | null;
    location: string | null;
    sales_rep: string | null;
    status: string | null;
    source: string | null;
  };
  commercial: {
    lifetime_revenue: number | null;
    invoice_count: number;
    last_invoice: {
      invoice_number: string | null;
      invoice_date: string | null;
      amount: number | null;
      source: string | null;
    } | null;
    source: string;
  };
  financial: {
    credit_limit: number | null;
    payment_terms_days: number | null;
    median_payment_delay_days: number | null;
    returned_check_count: number;
    collection_count: number;
    total_collected: number | null;
    outstanding_amount: number | null;
    outstanding_method: string;
    recent_collections: Array<Record<string, string | number | boolean | null>>;
  };
  complaints: Array<Record<string, string | number | boolean | null>>;
  interactions: Array<Record<string, string | number | boolean | null>>;
  offers: Array<Record<string, string | number | boolean | null>>;
  products: Array<Record<string, string | number | boolean | null>>;
  rfm: CustomerRfm;
  recommendation: CustomerRecommendation;
}
