import type { CustomerContractResponse, BusinessPulseSummary, CustomerAccount } from '../types';

/**
 * Centralized Mock Data Layer for Frontend.
 * Ensures Frontend has zero scattered fake data inside components.
 */

export const MOCK_CUSTOMER_360_CONTRACT: CustomerContractResponse = {
  customer_id: 'CUST-003',
  overview: {
    total_revenue: 7203837.4,
    invoice_count: 8,
    avg_deal_size: 900479.67,
    days_since_last_purchase: 43,
  },
  sales: {
    revenue_last_90d: 770944,
    revenue_prev_90d: 0,
    revenue_change_pct: null,
    deal_size_change_pct: null,
  },
  financial: {
    margin_pct: null,
    average_payment_delay: null,
    returned_checks: null,
  },
  complaints: {
    total: null,
    open: null,
    high_severity: null,
  },
  wallet: {
    share_pct: null,
    main_competitor: null,
  },
  intelligence: {
    summary: 'مشتری بزرگ با سابقه خریدهای تناژ بالا؛ در دوره‌های اخیر افت خرید داشته است.',
    risks: [
      'افت روند خرید در سه ماهه اخیر نسبت به میانگین تاریخی',
      'عدم ثبت داده‌های سنجش سهم سبد در ماه‌های اخیر',
    ],
    opportunities: [
      'حاشیه سود تاریخی مناسب',
      'پتانسیل افزایش تنوع نمره نخ‌های ارسالی',
    ],
    next_best_action: 'P0 (بسیار فوری): هماهنگی جلسه حضوری با مدیر بازرگانی جهت بررسی علل توقف سفارشات',
  },
};

export const MOCK_CUSTOMER_MISSING_DATA: CustomerContractResponse = {
  customer_id: 'CUST-099',
  overview: {
    total_revenue: null,
    invoice_count: null,
    avg_deal_size: null,
    days_since_last_purchase: null,
  },
  sales: {
    revenue_last_90d: null,
    revenue_prev_90d: null,
    revenue_change_pct: null,
    deal_size_change_pct: null,
  },
  financial: {
    margin_pct: null,
    average_payment_delay: null,
    returned_checks: null,
  },
  complaints: {
    total: null,
    open: null,
    high_severity: null,
  },
  wallet: {
    share_pct: null,
    main_competitor: null,
  },
  intelligence: {
    summary: null,
    risks: [],
    opportunities: [],
    next_best_action: null,
  },
};

export const MOCK_CUSTOMERS_LIST: CustomerAccount[] = [
  {
    customer_id: 'CUST-008',
    location_id: 'LOC-003',
    customer_segment: 'A',
    sales_rep_id: 'REP-002',
    lifetime_revenue: 12450000,
    revenue_trend_pct: -34.5,
    avg_gross_margin_pct: 16.2,
    avg_nafis_share_pct: 28.0,
    main_competitor: 'نساجی بروجرد',
    total_complaints: 4,
    high_severity_complaints: 2,
    bounced_checks_count: 1,
    avg_delay_days: 28,
    risk_score: 85,
    opportunity_score: 45,
    health_status: 'At Risk',
    payment_risk_level: 'High',
    quality_complaint_risk_level: 'High',
    latest_next_action: 'مذاکره فوری تضمین کیفیت و تسویه چک',
  },
  {
    customer_id: 'CUST-003',
    location_id: 'LOC-005',
    customer_segment: 'B',
    sales_rep_id: 'REP-008',
    lifetime_revenue: 7203837.4,
    revenue_trend_pct: -12.0,
    avg_gross_margin_pct: 22.4,
    avg_nafis_share_pct: 35.0,
    main_competitor: 'سیرنگ',
    total_complaints: 8,
    high_severity_complaints: 2,
    bounced_checks_count: 0,
    avg_delay_days: 8,
    risk_score: 35,
    opportunity_score: 65,
    health_status: 'Needs Attention',
    payment_risk_level: 'Low',
    quality_complaint_risk_level: 'High',
    latest_next_action: 'جلسه فوری بررسی کیفیت و ارائه لات جایگزین',
  },
  {
    customer_id: 'CUST-010',
    location_id: 'LOC-001',
    customer_segment: 'A',
    sales_rep_id: 'REP-001',
    lifetime_revenue: 18900000,
    revenue_trend_pct: 8.5,
    avg_gross_margin_pct: 19.8,
    avg_nafis_share_pct: 75.0,
    main_competitor: 'ندارد / تک‌سورس',
    total_complaints: 1,
    high_severity_complaints: 0,
    bounced_checks_count: 0,
    avg_delay_days: 5,
    risk_score: 12,
    opportunity_score: 80,
    health_status: 'Healthy',
    payment_risk_level: 'Low',
    quality_complaint_risk_level: 'Low',
    latest_next_action: 'پیشنهاد قرارداد سالانه بلندمدت',
  },
];

export const MOCK_BUSINESS_PULSE: BusinessPulseSummary = {
  total_accounts: 50,
  at_risk_accounts: 8,
  needs_attention_accounts: 14,
  healthy_accounts: 28,
  growth_opportunities_count: 12,
  quality_alerts_count: 6,
  payment_risks_count: 5,
  financials: {
    total_revenue: 185000000,
    total_gross_profit: 34500000,
    overall_avg_margin: 18.6,
  },
};
