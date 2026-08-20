/**
 * COPAN Global Intelligence Data Store & Business Logic Engine.
 * Provides high-fidelity domain data representing 644 B2B textile customers,
 * multi-dimensional sales trends, categorized alerts, pipeline opportunities,
 * RFM segmentation, 4% installment profitability formulas, and COBAT AI decision responses.
 */

export { getCustomerTradeName } from '../utils/customerNames';

// ==========================================
// 1. EXECUTIVE KPIS & DASHBOARD SUMMARY
// ==========================================
export const COPAN_KPIS = {
  total_sales: {
    value: 4420000000, // 4.42 Billion Rials
    current_period: 4420000000,
    previous_period: 4613000000,
    currency: 'ریال',
    avg_margin_pct: 10.1,
    formatted_value: '۴.۴۲ میلیارد ریال',
    explanation: '۷۸٪ از کل فروش تجمعی متمرکز در ۱۰٪ برترین مشتریان سازمانی است.',
  },
  sales_growth: {
    growth_rate_pct: -4.2,
    trend_direction: 'DOWN' as const,
    status: 'نیازمند اقدام فوری',
    explanation: '۶۳٪ از افت فروش اخیر در ۱۲ مشتری کلیدی سگمنت A رخ داده است.',
  },
  at_risk_customers: {
    total_at_risk: 38,
    total_accounts: 644,
    breakdown: {
      critical: 8,
      high: 14,
      medium: 16,
      low: 24,
    },
    explanation: '۵۷ مشتری در دوره‌های اخیر زیان‌ده یا با افت سهم سبد بیش از ۲۵٪ مواجه شده‌اند.',
  },
  sales_opportunities: {
    count: 24,
    pipeline_estimated_value: 890000000, // 890 Million Rials
    active_negotiations_count: 15,
    open_complaints_count: 12,
    critical_complaints_count: 3,
    explanation: 'پتانسیل تصاحب ۳۴۰ میلیون ریال از سهم رقیب X و رقیب Y در ۶ ماهه آینده.',
  },
};

// ==========================================
// 2. SALES PERFORMANCE MONTHLY TREND (12 MONTHS)
// ==========================================
export const COPAN_SALES_TREND = [
  { month: '۱۴۰۴/۰۱', revenue: 345000000, gross_profit: 41400000, quantity: 58200, avg_margin_pct: 12.0, active_customers: 240, growth_change_pct: 5.4 },
  { month: '۱۴۰۴/۰۲', revenue: 380000000, gross_profit: 43700000, quantity: 64100, avg_margin_pct: 11.5, active_customers: 255, growth_change_pct: 10.1 },
  { month: '۱۴۰۴/۰۳', revenue: 410000000, gross_profit: 45100000, quantity: 69500, avg_margin_pct: 11.0, active_customers: 268, growth_change_pct: 7.9 },
  { month: '۱۴۰۴/۰۴', revenue: 395000000, gross_profit: 39500000, quantity: 67000, avg_margin_pct: 10.0, active_customers: 250, growth_change_pct: -3.7 },
  { month: '۱۴۰۴/۰۵', revenue: 360000000, gross_profit: 34200000, quantity: 61000, avg_margin_pct: 9.5, active_customers: 235, growth_change_pct: -8.9 },
  { month: '۱۴۰۴/۰۶', revenue: 375000000, gross_profit: 37500000, quantity: 63800, avg_margin_pct: 10.0, active_customers: 242, growth_change_pct: 4.2 },
  { month: '۱۴۰۴/۰۷', revenue: 350000000, gross_profit: 33250000, quantity: 59200, avg_margin_pct: 9.5, active_customers: 228, growth_change_pct: -6.7 },
  { month: '۱۴۰۴/۰۸', revenue: 340000000, gross_profit: 30600000, quantity: 57500, avg_margin_pct: 9.0, active_customers: 220, growth_change_pct: -2.9 },
  { month: '۱۴۰۴/۰۹', revenue: 330000000, gross_profit: 28050000, quantity: 55900, avg_margin_pct: 8.5, active_customers: 215, growth_change_pct: -2.9 },
  { month: '۱۴۰۴/۱۰', revenue: 365000000, gross_profit: 36500000, quantity: 61800, avg_margin_pct: 10.0, active_customers: 230, growth_change_pct: 10.6 },
  { month: '۱۴۰۴/۱۱', revenue: 385000000, gross_profit: 40425000, quantity: 65200, avg_margin_pct: 10.5, active_customers: 245, growth_change_pct: 5.5 },
  { month: '۱۴۰۴/۱۲', revenue: 385000000, gross_profit: 38885000, quantity: 64900, avg_margin_pct: 10.1, active_customers: 248, growth_change_pct: 0.0 },
];

// ==========================================
// 3. CATEGORIZED ALERTS (CUSTOMER, PRODUCT, COMMERCIAL)
// ==========================================
export const COPAN_ALERTS = {
  // ── ۱. هشدار ضرر و حاشیه سود منفی (Loss & Margin Alerts) ──
  loss_alerts: [
    {
      id: 'ALT-LOSS-001',
      title: 'فروش زیان‌ده با حاشیه سود منفی (-۴.۲٪)',
      category: 'Loss & Margin',
      category_label: 'هشدار ضرر و حاشیه سود',
      severity: 'Critical' as const,
      customer_id: 'CUST-009',
      customer_name: 'بافندگی اطلس یزد',
      product_id: 'PRD-FDY-002',
      reason: 'اعمال همزمان تخفیف تجاری ۷٪ و تاخیر وصول ۶۵ روزه که بهای پول را از حاشیه سود فراتر برده است.',
      impact: 'زیان مستقیم ۲۸ میلیون ریالی در فاکتورهای فصل جاری',
      evidence: ['قیمت تمام‌شده: ۶۸۰ هزار ریال | قیمت فروش: ۶۵۱ هزار ریال', 'دوره تسویه تعهدی ۳۰ روز بوده اما ۶۵ روز طول کشیده است', 'عدم احتساب نرخ کارمزد اقساطی ۴٪ در فاکتور'],
      recommended_action: 'اصلاح فوری نرخ فاکتور و لغو تخفیف‌های ویژه تا زمان تسویه مطالبات معوق',
      urgency_score: 96,
    },
    {
      id: 'ALT-LOSS-002',
      title: 'فروش زیر بهای تمام‌شده به دلیل جهش نرخ چیپس',
      category: 'Loss & Margin',
      category_label: 'هشدار ضرر و حاشیه سود',
      severity: 'High' as const,
      customer_id: 'CUST-012',
      customer_name: 'صنایع نساجی سپهر قزوین',
      product_id: 'Product_Family_02',
      reason: 'افزایش ۱۲٪ بهای مواد اولیه در بورس کالا بدون تعدیل قیمت فروش در قراردادهای پیش‌فروش.',
      impact: 'کاهش حاشیه سود ناخالص از ۱۸٪ به ۱.۵٪ در تناژ تحویلی ۴۰ تن',
      evidence: ['رشد نرخ چیپس پلی‌استر پتروشیمی تندگویان', 'قرارداد تحویل قطعی با نرخ ثابت ۲ ماه قبل'],
      recommended_action: 'اعمال فرمول تعدیل نرخ مواد اولیه (Escalation Clause) در پارت دوم محموله',
      urgency_score: 89,
    },
  ],

  // ── ۲. هشدار ریزش و توقف خرید مشتری (Customer Churn Alerts) ──
  churn_alerts: [
    {
      id: 'ALT-CUST-001',
      title: 'افت شدید خرید و خطر ریزش حساب استراتژیک',
      category: 'Customer Churn',
      category_label: 'هشدار ریزش مشتریان',
      severity: 'Critical' as const,
      customer_id: 'CUST-008',
      customer_name: 'صنایع نساجی سبلان پارچه',
      product_id: 'PRD-POY-001',
      reason: 'افت خرید ۳۴.۵٪ در ۶۰ روز گذشته همراه با ۲ شکایت حل‌نشده کیفی',
      impact: 'خطر از دست رفتن سالانه ۱۲۰ میلیون ریال درآمد ناخالص',
      evidence: ['کاهش سهم سبد از ۵۴٪ به ۲۸٪', 'افزایش دوره وصول به ۲۸ روز', 'مذاکره فعال رقیب بروجرد با آفر تخفیف ۵٪'],
      recommended_action: 'هماهنگی جلسه اضطراری مدیر فروش با مدیر فنی کارخانه ظرف ۴۸ ساعت',
      urgency_score: 94,
    },
    {
      id: 'ALT-CUST-002',
      title: 'توقف سفارش‌گذاری حساب سگمنت A بیش از ۴۵ روز',
      category: 'Customer Churn',
      category_label: 'هشدار ریزش مشتریان',
      severity: 'High' as const,
      customer_id: 'C_683666',
      customer_name: 'نساجی تار و پود اصفهان',
      product_id: 'P_091085',
      reason: 'افت ۷۵.۵٪ خرید دوره‌ای و عدم ثبت فاکتور جدید در ۴۵ روز اخیر',
      impact: 'افت ۱۵۰ میلیون ریال از بودجه فروش فصلی منطقه مرکز',
      evidence: ['آخرین فاکتور ۴۵ روز پیش صادر شده', 'درخواست توسعه محصول در وضعیت معلق است', 'حاشیه سود تاریخی مطلوب ۱۶.۲٪'],
      recommended_action: 'ارائه بسته احیای خرید با تخفیف حجمی پلکانی و مهلت اعتبار ۷ روزه',
      urgency_score: 88,
    },
    {
      id: 'ALT-CUST-003',
      title: 'ریسک اعتباری و افزایش چک‌های سررسیدشده',
      category: 'Customer Churn',
      category_label: 'هشدار ریسک مالی و وصول',
      severity: 'High' as const,
      customer_id: 'C_746892',
      customer_name: 'تکمیل و رنگرزی ماهان',
      product_id: 'P_310017',
      reason: '۲ فقره چک برگشتی به مبلغ ۳۸ میلیون ریال و میانگین تاخیر ۳۴ روز در تسویه',
      impact: 'قفل شدن سقف اعتباری مشتری و توقف بارگیری سفارش‌های جدید',
      evidence: ['دوره تسویه مصوب: ۱۵ روز | عملکرد واقعی: ۴۹ روز', 'سقف اعتبار ۵۰ میلیون ریال کاملاً تکمیل شده'],
      recommended_action: 'مذاکره وصول با وثیقه ملکی یا تبدیل به پرداخت نقدی با تخفیف ۲٪',
      urgency_score: 85,
    },
  ],

  // ── ۳. هشدار کیفیت و مرجوعی کالا (Quality & Defect Alerts) ──
  quality_alerts: [
    {
      id: 'ALT-PRD-001',
      title: 'افزایش نرخ پرز و پارگی فیلامنت در خط تولید ۳',
      category: 'Product Quality',
      category_label: 'هشدار کیفیت و کالا',
      severity: 'Critical' as const,
      customer_id: 'CUST-015',
      customer_name: 'ریسندگی ممتاز سمنان',
      product_id: 'PRD-POY-006 (Product_Family_03)',
      reason: 'تست کشش لات LOT-202504-113068 پایین‌تر از استاندارد (2.85 cN/dtex)',
      impact: '۳ شکایت همزمان در یک هفته و خطر مرجوعی ۲۴ تن نخ به ارزش ۶۵ م.ر',
      evidence: ['نمره عدم یکنواختی CV: 1.45% (حد مجاز 1.1%)', 'ثبت شکایت کیفی رسمی از ۲ مشتری بزرگ'],
      recommended_action: 'توقف ارسال لات‌های مرتبط و مصرف داخلی در خطوط ثانویه تا کالیبراسیون دستگاه',
      urgency_score: 92,
    },
    {
      id: 'ALT-PRD-002',
      title: 'انحراف شید رنگ در کالای Color_Class_03',
      category: 'Product Quality',
      category_label: 'هشدار کیفیت و کالا',
      severity: 'Medium' as const,
      customer_id: 'CUST-010',
      customer_name: 'تکمیل و رنگرزی ماهان',
      product_id: 'P_003511',
      reason: 'تفاوت تلرانس دلتا E در محموله تحویلی هفته دوم اردیبهشت',
      impact: 'احتمال ادعای خسارت رنگرزی به میزان ۱۲ میلیون ریال',
      evidence: ['گزارش کنترل کیفیت آزمایشگاه نساجی', 'تصاویر ارسالی مشتری در سامانه QMS'],
      recommended_action: 'اعزام کارشناس فنی کنترل کیفیت جهت تست میدانی در محل کارخانه مشتری',
      urgency_score: 72,
    },
  ],

  // ── ۴. هشدار تهدید رقبا و سهم سبد (Competitor & Wallet Share Threats) ──
  competitor_alerts: [
    {
      id: 'ALT-COM-001',
      title: 'جنگ قیمتی رقیب Y در نخ‌های دنیر ریز (Denier_Subgroup_01)',
      category: 'Competitor Threat',
      category_label: 'هشدار تهدید رقبا',
      severity: 'High' as const,
      customer_id: 'CUST-003',
      customer_name: 'صنایع پارچه تریکو البرز',
      product_id: 'Product_Family_01',
      reason: 'رقیب Y قیمت فی را ۶٪ زیر نرخ پایه مصوب با شرایط پرداخت ۹۰ روزه اعلام کرده است',
      impact: 'کاهش سهم سبد ۴ مشتری استراتژیک در منطقه البرز و قزوین',
      evidence: ['سیگنال بازار ثبت‌شده در گزارش هفتگی W-008', 'آفر ثبت‌شده رد شده توسط مشتری CUST-003'],
      recommended_action: 'بازنگری در ساختار تخفیف پلکانی سالانه به جای تخفیف نقدی مقطعی',
      urgency_score: 84,
    },
    {
      id: 'ALT-COM-002',
      title: 'تغییر تقاضای بازار به سمت فیلامنت‌های مات (Luster_Class_01)',
      category: 'Competitor Threat',
      category_label: 'هشدار تهدید رقبا',
      severity: 'Medium' as const,
      customer_id: 'C_937594',
      customer_name: 'نساجی نگین بافت کاشان',
      product_id: 'Product_Family_04',
      reason: 'افزایش ۱۸٪ سفارشات کالاهای مات در مقابل افت ۱۰٪ براق در بازار کاشان',
      impact: 'کمبود موجودی انبار در گریدهای پرتقاضا ظرف ۲۰ روز آینده',
      evidence: ['سیگنال‌های هفتگی بازار نساجی', 'افزایش پیش‌فاکتورهای تاییدنشده'],
      recommended_action: 'تعدیل برنامه تولید ماهانه در واحد برنامه‌ریزی به نفع گریدهای مات',
      urgency_score: 76,
    },
  ],

  // Legacy mappings for backwards compatibility
  get risk_alerts() {
    return this.churn_alerts;
  },
  get product_alerts() {
    return this.quality_alerts;
  },
  get commercial_alerts() {
    return this.competitor_alerts;
  },
};

// ==========================================
// 4. EXTENSIVE CUSTOMER DATABASE (50+ RICH ENTITIES)
// ==========================================
export interface CopanCustomer {
  customer_id: string;
  customer_name: string;
  location_id: string;
  location_name: string;
  customer_segment: 'A' | 'B' | 'C';
  sales_rep_id: string;
  sales_rep_name: string;
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
  health_status: 'Healthy' | 'Needs Attention' | 'At Risk';
  rfm_score: string;
  rfm_segment: string;
  last_purchase_date: string;
  last_interaction_date: string;
  payment_status: string;
  installment_share_pct: number;
  latest_next_action: string;
  next_step_action?: string;
  next_step_reason?: string;
  next_step_due?: string;
  next_step_priority?: 'Critical' | 'High' | 'Medium' | 'Low';
}

// ==========================================
// 4.1. UNIFIED TASK & NEXT BEST ACTION MODEL
// ==========================================
export type TaskState = 'To Do' | 'In Progress' | 'Completed' | 'Overdue' | 'Snoozed';
export type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TaskType =
  | 'CONTACT_CUSTOMER'
  | 'FOLLOW_UP'
  | 'SEND_OFFER'
  | 'REVIEW_OFFER'
  | 'SCHEDULE_MEETING'
  | 'RESOLVE_COMPLAINT'
  | 'FOLLOW_UP_COMPLAINT'
  | 'REVIEW_PAYMENT'
  | 'FOLLOW_UP_COLLECTION'
  | 'REVIEW_BOUNCED_CHECK'
  | 'REVIEW_DEV_REQUEST'
  | 'REVIEW_OPPORTUNITY';

export interface CopanTask {
  id: string;
  customer_id: string;
  customer_name: string;
  location_name: string;
  sales_rep_name: string;
  task_type: TaskType;
  task_type_label: string;
  title: string;
  reason: string; // Structured: "Because [X event/signal], you should [Y action]"
  because_signal: string;
  should_action: string;
  priority: TaskPriority;
  priority_label: string;
  due_date: string;
  status: TaskState;
  context_type: 'SALES' | 'COLLECTION' | 'COMPLAINT' | 'OFFER' | 'CRM' | 'DEV_REQUEST';
  context_data?: {
    crm_interaction_summary?: string;
    financial_amount?: number;
    delay_days?: number;
    bounced_checks_count?: number;
    complaint_id?: string;
    lot_id?: string;
    offer_id?: string;
    product_id?: string;
    expected_impact?: string;
  };
  suggested_next_step: string;
  notes?: Array<{ text: string; created_at: string; author: string }>;
  created_at: string;
  completed_at?: string;
}

// ==========================================
// 4.2. CRM INTERACTION & CONVERSATION MODEL
// ==========================================
export type InteractionType =
  | 'جلسه حضوری'
  | 'تماس تلفنی'
  | 'ویزیت میدانی'
  | 'مذاکره قیمت'
  | 'پیام‌رسان / ایمیل'
  | 'مکاتبه رسمی';

export type ConversationStatus =
  | 'Follow-up Required'
  | 'Active'
  | 'Waiting for Customer'
  | 'Opportunity'
  | 'At Risk'
  | 'Closed';

export type SalesStage =
  | 'Lead'
  | 'Contacted'
  | 'Qualified'
  | 'Negotiation'
  | 'Won';

export interface CopanCRMInteraction {
  id: string;
  customer_id: string;
  customer_name: string;
  sales_rep_name: string;
  interaction_type: InteractionType;
  event_time: string;
  summary_text: string;
  customer_feedback?: string;
  key_outcome?: string;
  related_product?: string;
  next_action: string;
  follow_up_date?: string;
  priority: TaskPriority;
  record_status: 'قطعی' | 'در جریان' | 'مختومه';
  conversation_status: ConversationStatus;
  sales_stage: SalesStage;
  created_at: string;
}

// ==========================================
// 4.3. CURRENT BUSINESS SITUATION SIGNALS
// ==========================================
export const COPAN_BUSINESS_SITUATION = {
  sales_summary: {
    revenue: 4420000000,
    gross_profit: 446420000,
    margin_pct: 10.1,
    mom_growth_pct: -4.2,
    active_accounts: 248,
    total_accounts: 644,
  },
  collections_summary: {
    total_overdue_amount: 84500000, // 84.5 Million Rials
    overdue_accounts_count: 3,
    avg_delay_days: 28,
    worst_delay_days: 38,
  },
  bounced_checks_summary: {
    bounced_count: 3,
    bounced_amount: 66000000, // 66 Million Rials
    affected_customers_count: 2,
  },
  open_complaints_summary: {
    total_open: 12,
    critical_count: 3,
    affected_customers_count: 5,
    avg_resolution_days: 14,
  },
  pending_offers_summary: {
    active_count: 15,
    expiring_soon_count: 4,
    pipeline_value: 890000000,
  },
  followups_summary: {
    due_today_count: 5,
    overdue_count: 2,
    total_upcoming: 9,
  },
  critical_risks_summary: {
    p0_count: 8,
    p1_count: 14,
    total_exposure: 280000000,
  },
};

// Detailed Records for Interactive Business Situation Drilldowns
export const COPAN_DELAYED_COLLECTIONS = [
  {
    customer_id: 'C_535756',
    customer_name: 'بافندگی پرنیان مشهد',
    location: 'مشهد / خراسان',
    sales_rep: 'مهندس موسوی',
    invoice_no: 'INV-2025-8812',
    due_date: '۱۴۰۴/۱۱/۰۵',
    amount: 38000000,
    delay_days: 38,
    bounced_checks: 2,
    credit_status: 'قفل اعتبار / واخواست چک',
    recommended_action: 'ارسال اخطار رسمی و توقف ارسال بار نسیه',
  },
  {
    customer_id: 'C_746892',
    customer_name: 'تکمیل و رنگرزی ماهان',
    location: 'تهران / شمس آباد',
    sales_rep: 'مهندس احمدی',
    invoice_no: 'INV-2025-8940',
    due_date: '۱۴۰۴/۱۱/۱۰',
    amount: 28500000,
    delay_days: 34,
    bounced_checks: 1,
    credit_status: 'تأخیر بحرانی',
    recommended_action: 'مذاکره وصول با ضمانت بانکی یا تسویه نقدی',
  },
  {
    customer_id: 'C_633661',
    customer_name: 'تریکو البرز (واحد ۲)',
    location: 'قزوین / کاسپین',
    sales_rep: 'مهندس احمدی',
    invoice_no: 'INV-2025-9102',
    due_date: '۱۴۰۴/۱۱/۲۰',
    amount: 18000000,
    delay_days: 24,
    bounced_checks: 0,
    credit_status: 'تأخیر متوسط',
    recommended_action: 'پیگیری تلفنی تسویه و تعیین زمان پرداخت',
  },
];

export const COPAN_BOUNCED_CHECKS = [
  {
    id: 'CHK-001',
    customer_id: 'C_535756',
    customer_name: 'بافندگی پرنیان مشهد',
    check_number: '۸۸۲۳۴۰۱',
    bank: 'ملت - شعبه بلوار سجاد مشهد',
    amount: 22000000,
    bounce_date: '۱۴۰۴/۱۱/۱۵',
    reason: 'کسری موجودی حساب جاری',
    status: 'واخواست شده / اقدام حقوقی',
    sales_rep: 'مهندس موسوی',
  },
  {
    id: 'CHK-002',
    customer_id: 'C_535756',
    customer_name: 'بافندگی پرنیان مشهد',
    check_number: '۸۸۲۳۴۰۲',
    bank: 'ملت - شعبه بلوار سجاد مشهد',
    amount: 16000000,
    bounce_date: '۱۴۰۴/۱۱/۲۲',
    reason: 'عدم تطابق امضا و کسری موجودی',
    status: 'در دست پیگیری واحد وصول',
    sales_rep: 'مهندس موسوی',
  },
  {
    id: 'CHK-003',
    customer_id: 'C_746892',
    customer_name: 'تکمیل و رنگرزی ماهان',
    check_number: '۵۴۱۹۰۲۳',
    bank: 'تجارت - شعبه شمس‌آباد',
    amount: 28000000,
    bounce_date: '۱۴۰۴/۱۱/۲۸',
    reason: 'کسری موجودی',
    status: 'مهلت ۵ روزه جهت تامین وجه',
    sales_rep: 'مهندس احمدی',
  },
];

export const COPAN_OPEN_COMPLAINTS_DETAILS = [
  {
    complaint_id: 'CMP-0001',
    customer_id: 'CUST-008',
    customer_name: 'صنایع نساجی سبلان پارچه',
    created_at: '۱۴۰۴/۱۱/۲۰',
    severity: 'بحرانی (Critical)',
    defect_type: 'پرز شدید و پارگی مکرر در خط بافت ماشین‌آلات',
    product_id: 'PRD-POY-001',
    lot_id: 'LOT-202504-113068',
    status: 'پذیرفته‌شده / در حال اصلاح خط',
    sales_rep: 'مهندس رضایی',
    action_required: 'ملاقات حضوری مدیر فنی در کارخانه اردبیل و تعویض محموله',
  },
  {
    complaint_id: 'CMP-0004',
    customer_id: 'CUST-015',
    customer_name: 'ریسندگی ممتاز سمنان',
    created_at: '۱۴۰۴/۱۲/۰۱',
    severity: 'زیاد (High)',
    defect_type: 'انحراف استحکام کششی زیر حد استاندارد (Tensile: 2.85)',
    product_id: 'PRD-POY-006',
    lot_id: 'LOT-202504-113068',
    status: 'در دست بررسی آزمایشگاه QMS',
    sales_rep: 'مهندس شجاعی',
    action_required: 'ارائه گزارش تست کشش و توقف ارسال باقی‌مانده لات',
  },
  {
    complaint_id: 'CMP-0007',
    customer_id: 'C_633661',
    customer_name: 'صنایع پارچه تریکو البرز (واحد ۲)',
    created_at: '۱۴۰۴/۱۱/۲۵',
    severity: 'متوسط (Medium)',
    defect_type: 'نایکنواختی شید رنگ در پارت محموله دوم',
    product_id: 'PRD-DTY-004',
    lot_id: 'LOT-202501-094110',
    status: 'اعزام کارشناس کنترل کیفیت',
    sales_rep: 'مهندس احمدی',
    action_required: 'تست میدانی دلتا E در سالن رنگرزی مشتری',
  },
];

export const COPAN_PENDING_OFFERS_DETAILS = [
  {
    offer_id: 'OFF-0000002',
    customer_id: 'CUST-010',
    customer_name: 'تکمیل و رنگرزی ماهان',
    product_family: 'خانواده ۰۳ (POY نیمه‌مات)',
    base_price: 680000,
    offered_price: 665000,
    discount_pct: 2.2,
    valid_until: '۱۴۰۴/۱۲/۲۰',
    days_left: 5,
    status: 'در حال مذاکره',
    sales_rep: 'مهندس احمدی',
    potential_revenue: 62000000,
    next_step: 'ارسال نمونه دوک جدید و اخذ امضای پیش‌فاکتور',
  },
  {
    offer_id: 'OFF-0000003',
    customer_id: 'CUST-003',
    customer_name: 'صنایع پارچه تریکو البرز',
    product_family: 'خانواده ۰۱ (POY مات نمره ۱۵۰)',
    base_price: 540000,
    offered_price: 521000,
    discount_pct: 3.5,
    valid_until: '۱۴۰۴/۱۲/۲۲',
    days_left: 7,
    status: 'پیشنهاد ارسال‌شده',
    sales_rep: 'مهندس احمدی',
    potential_revenue: 145000000,
    next_step: 'تماس با مدیر بازرگانی جهت نهایی‌سازی قرارداد ۶ ماهه',
  },
  {
    offer_id: 'OFF-0000004',
    customer_id: 'C_245948',
    customer_name: 'ریسندگی و بافندگی اطلس یزد',
    product_family: 'خانواده ۰۴ (DTY سوپربرایت)',
    base_price: 790000,
    offered_price: 770000,
    discount_pct: 2.5,
    valid_until: '۱۴۰۴/۱۲/۱۸',
    days_left: 3,
    status: 'در انتظار تایید مشتری',
    sales_rep: 'مهندس رضایی',
    potential_revenue: 110000000,
    next_step: 'پیگیری پیش‌فاکتور تکرار سفارش دوره ماهانه',
  },
];

export const COPAN_CUSTOMERS: CopanCustomer[] = [
  {
    customer_id: 'CUST-008',
    customer_name: 'صنایع نساجی سبلان پارچه',
    location_id: 'LOC-003',
    location_name: 'اردبیل / تهران',
    customer_segment: 'A',
    sales_rep_id: 'REP-002',
    sales_rep_name: 'مهندس رضایی',
    lifetime_revenue: 124500000,
    revenue_trend_pct: -34.5,
    avg_gross_margin_pct: 16.2,
    avg_nafis_share_pct: 28.0,
    main_competitor: 'نساجی بروجرد',
    total_complaints: 4,
    high_severity_complaints: 2,
    bounced_checks_count: 1,
    avg_delay_days: 28,
    risk_score: 88,
    opportunity_score: 82,
    health_status: 'At Risk',
    rfm_score: '2-4-5',
    rfm_segment: 'مشتری بزرگ در معرض ریزش',
    last_purchase_date: '۱۴۰۴/۱۱/۱۸',
    last_interaction_date: '۱۴۰۴/۱۲/۰۲',
    payment_status: 'تأخیر در وصول',
    installment_share_pct: 45,
    latest_next_action: 'مذاکره حضوری مدیر فروش پیرامون رفع نقص کیفی پرز و توافق تخفیف حجمی',
    next_step_action: 'مذاکره حضوری و رفع شکایت پرز نخ',
    next_step_reason: 'افت ۳۴.۵٪ سفارشات و ثبت شکایت کیفی CMP-0001 به همراه تحویل نمونه رقیب بروجرد',
    next_step_due: '۱۴۰۴/۱۲/۱۵',
    next_step_priority: 'Critical',
  },
  {
    customer_id: 'CUST-003',
    customer_name: 'صنایع پارچه تریکو البرز',
    location_id: 'LOC-002',
    location_name: 'البرز / کرج',
    customer_segment: 'A',
    sales_rep_id: 'REP-001',
    sales_rep_name: 'مهندس احمدی',
    lifetime_revenue: 148000000,
    revenue_trend_pct: 14.8,
    avg_gross_margin_pct: 18.5,
    avg_nafis_share_pct: 22.0,
    main_competitor: 'رقیب X',
    total_complaints: 1,
    high_severity_complaints: 0,
    bounced_checks_count: 0,
    avg_delay_days: 8,
    risk_score: 22,
    opportunity_score: 95,
    health_status: 'Healthy',
    rfm_score: '5-4-5',
    rfm_segment: 'حساب استراتژیک با پتانسیل رشد بالا',
    last_purchase_date: '۱۴۰۴/۱۲/۰۵',
    last_interaction_date: '۱۴۰۴/۱۲/۰۸',
    payment_status: 'خوش‌حساب',
    installment_share_pct: 20,
    latest_next_action: 'ارائه پیشنهاد توسعه نمره نخ‌های فیلامنتی جدید برای افزایش سهم سبد به ۴۵٪',
    next_step_action: 'ارسال آفر ۳.۵٪ تخفیف پلکانی',
    next_step_reason: 'خوش‌حسابی با تاخیر ۸ روز و نارضایتی مشتری از تاخیرهای تحویل رقیب X',
    next_step_due: '۱۴۰۴/۱۲/۱۸',
    next_step_priority: 'High',
  },
  {
    customer_id: 'C_937594',
    customer_name: 'نساجی نگین بافت کاشان',
    location_id: 'LOC-004',
    location_name: 'کاشان / اصفهان',
    customer_segment: 'A',
    sales_rep_id: 'REP-003',
    sales_rep_name: 'مهندس کاظمی',
    lifetime_revenue: 360000000,
    revenue_trend_pct: 44.5,
    avg_gross_margin_pct: 14.2,
    avg_nafis_share_pct: 68.0,
    main_competitor: 'رقیب Y',
    total_complaints: 2,
    high_severity_complaints: 0,
    bounced_checks_count: 0,
    avg_delay_days: 12,
    risk_score: 18,
    opportunity_score: 74,
    health_status: 'Healthy',
    rfm_score: '5-5-5',
    rfm_segment: 'قهرمان / مشتری کلیدی (Champions)',
    last_purchase_date: '۱۴۰۴/۱۲/۱۰',
    last_interaction_date: '۱۴۰۴/۱۲/۱۱',
    payment_status: 'منظم',
    installment_share_pct: 60,
    latest_next_action: 'تمدید قرارداد سالانه تامین انحصاری نخ POY مات با شرایط پرداخت ویژه',
    next_step_action: 'جلسه تمدید قرارداد سالانه انحصاری',
    next_step_reason: 'رشد ۴۴.۵٪ خرید و سررسید تمدید قرارداد تامین خطوط بافندگی بهاره',
    next_step_due: '۱۴۰۴/۱۲/۲۲',
    next_step_priority: 'Medium',
  },
  {
    customer_id: 'C_245948',
    customer_name: 'ریسندگی و بافندگی اطلس یزد',
    location_id: 'LOC-005',
    location_name: 'یزد',
    customer_segment: 'A',
    sales_rep_id: 'REP-002',
    sales_rep_name: 'مهندس رضایی',
    lifetime_revenue: 310000000,
    revenue_trend_pct: 224.6,
    avg_gross_margin_pct: 15.8,
    avg_nafis_share_pct: 55.0,
    main_competitor: 'نساجی بروجرد',
    total_complaints: 1,
    high_severity_complaints: 0,
    bounced_checks_count: 0,
    avg_delay_days: 9,
    risk_score: 15,
    opportunity_score: 88,
    health_status: 'Healthy',
    rfm_score: '5-5-5',
    rfm_segment: 'رشد سریع / قهرمان نوظهور',
    last_purchase_date: '۱۴۰۴/۱۲/۰۹',
    last_interaction_date: '۱۴۰۴/۱۲/۱۰',
    payment_status: 'منظم',
    installment_share_pct: 35,
    latest_next_action: 'پیشنهاد عقد قرارداد فوروارد خرید ماهانه ۱۰۰ تن نخ DTY',
    next_step_action: 'تماس جهت صدور پیش‌فاکتور تکرار سفارش',
    next_step_reason: 'سررسید چرخه خرید ۲۲ روزه و نیاز به تامین ۱۰۰ تن نخ DTY پیش از اتمام موجودی',
    next_step_due: '۱۴۰۴/۱۲/۱۶',
    next_step_priority: 'High',
  },
  {
    customer_id: 'C_633661',
    customer_name: 'صنایع پارچه تریکو البرز (واحد ۲)',
    location_id: 'LOC-002',
    location_name: 'قزوین / کاسپین',
    customer_segment: 'A',
    sales_rep_id: 'REP-001',
    sales_rep_name: 'مهندس احمدی',
    lifetime_revenue: 220000000,
    revenue_trend_pct: -35.1,
    avg_gross_margin_pct: 11.2,
    avg_nafis_share_pct: 31.0,
    main_competitor: 'رقیب X',
    total_complaints: 3,
    high_severity_complaints: 1,
    bounced_checks_count: 1,
    avg_delay_days: 24,
    risk_score: 79,
    opportunity_score: 65,
    health_status: 'At Risk',
    rfm_score: '2-3-4',
    rfm_segment: 'در خطر ریزش / ناراضی',
    last_purchase_date: '۱۴۰۴/۱۰/۲۵',
    last_interaction_date: '۱۴۰۴/۱۱/۲۸',
    payment_status: 'تأخیر متوسط',
    installment_share_pct: 50,
    latest_next_action: 'اعزام کارشناس خدمات پس از فروش و تعیین تکلیف تسویه فاکتور T_285604',
    next_step_action: 'پیگیری وصول فاکتور معوق و اعزام کارشناس فنی',
    next_step_reason: 'تاخیر ۲۴ روز در تسویه فاکتور ۱۸ م.ر همراه با شکایت ناهمگونی شید رنگ CMP-0007',
    next_step_due: '۱۴۰۴/۱۲/۱۷',
    next_step_priority: 'High',
  },
  {
    customer_id: 'C_535756',
    customer_name: 'بافندگی پرنیان مشهد',
    location_id: 'LOC-006',
    location_name: 'مشهد / خراسان',
    customer_segment: 'B',
    sales_rep_id: 'REP-004',
    sales_rep_name: 'مهندس موسوی',
    lifetime_revenue: 170000000,
    revenue_trend_pct: -49.0,
    avg_gross_margin_pct: 8.5,
    avg_nafis_share_pct: 20.0,
    main_competitor: 'رقیب Y',
    total_complaints: 2,
    high_severity_complaints: 1,
    bounced_checks_count: 2,
    avg_delay_days: 38,
    risk_score: 91,
    opportunity_score: 42,
    health_status: 'At Risk',
    rfm_score: '1-2-4',
    rfm_segment: 'ریسک بالا / چک برگشتی',
    last_purchase_date: '۱۴۰۴/۰۹/۱۴',
    last_interaction_date: '۱۴۰۴/۱۱/۱۰',
    payment_status: 'بحرانی / قفل اعتبار',
    installment_share_pct: 80,
    latest_next_action: 'پیگیری حقوقی چک‌های برگشتی و توقف کامل فروش نسیه',
    next_step_action: 'اخطار حقوقی و توقف فروش نسیه',
    next_step_reason: '۲ فقره چک برگشتی به مبلغ ۳۸ م.ر و میانگین تاخیر ۳۸ روزه در وصول',
    next_step_due: '۱۴۰۴/۱۲/۱۴',
    next_step_priority: 'Critical',
  },
  {
    customer_id: 'C_683666',
    customer_name: 'نساجی تار و پود اصفهان',
    location_id: 'LOC-004',
    location_name: 'اصفهان',
    customer_segment: 'A',
    sales_rep_id: 'REP-003',
    sales_rep_name: 'مهندس کاظمی',
    lifetime_revenue: 150000000,
    revenue_trend_pct: -75.5,
    avg_gross_margin_pct: 16.2,
    avg_nafis_share_pct: 15.0,
    main_competitor: 'نساجی بروجرد',
    total_complaints: 1,
    high_severity_complaints: 0,
    bounced_checks_count: 0,
    avg_delay_days: 14,
    risk_score: 84,
    opportunity_score: 89,
    health_status: 'Needs Attention',
    rfm_score: '2-2-4',
    rfm_segment: 'مشتری خاموش با پتانسیل احیا',
    last_purchase_date: '۱۴۰۴/۱۰/۰۲',
    last_interaction_date: '۱۴۰۴/۱۲/۰۱',
    payment_status: 'منظم',
    installment_share_pct: 30,
    latest_next_action: 'ارائه بسته حمایتی تخفیف نقدی و پیگیری درخواست توسعه نمره نخ P_091085',
    next_step_action: 'جلسه پیگیری درخواست توسعه محصول نمره P_091085',
    next_step_reason: 'معلق ماندن نمونه آزمایشی در واحد فنی که باعث افت ۷۵.۵٪ خرید در ۴۵ روز شده است',
    next_step_due: '۱۴۰۴/۱۲/۲۲',
    next_step_priority: 'Medium',
  },
  {
    customer_id: 'CUST-010',
    customer_name: 'تکمیل و رنگرزی ماهان',
    location_id: 'LOC-001',
    location_name: 'تهران / شمس آباد',
    customer_segment: 'B',
    sales_rep_id: 'REP-001',
    sales_rep_name: 'مهندس احمدی',
    lifetime_revenue: 98000000,
    revenue_trend_pct: 8.2,
    avg_gross_margin_pct: 13.5,
    avg_nafis_share_pct: 42.0,
    main_competitor: 'رقیب X',
    total_complaints: 2,
    high_severity_complaints: 1,
    bounced_checks_count: 0,
    avg_delay_days: 15,
    risk_score: 48,
    opportunity_score: 78,
    health_status: 'Needs Attention',
    rfm_score: '4-3-3',
    rfm_segment: 'مشتری نیازمند توجه و مذاکره',
    last_purchase_date: '۱۴۰۴/۱۲/۰۱',
    last_interaction_date: '۱۴۰۴/۱۲/۰۷',
    payment_status: 'منظم',
    installment_share_pct: 40,
    latest_next_action: 'برگزاری جلسه مذاکره نهایی آفر OFF-0000002 و توافق بر سر کیفیت دوک‌ها',
    next_step_action: 'نهایی‌سازی آفر OFF-0000002 قبل از انقضا',
    next_step_reason: 'پیشنهاد تخفیف ۲.۱۱٪ با اعتبار تا ۱۴۰۴/۱۲/۲۰ در وضعیت مذاکره معلق است',
    next_step_due: '۱۴۰۴/۱۲/۱۹',
    next_step_priority: 'High',
  },
  {
    customer_id: 'CUST-015',
    customer_name: 'ریسندگی ممتاز سمنان',
    location_id: 'LOC-007',
    location_name: 'سمنان',
    customer_segment: 'B',
    sales_rep_id: 'REP-005',
    sales_rep_name: 'مهندس شجاعی',
    lifetime_revenue: 84000000,
    revenue_trend_pct: -18.4,
    avg_gross_margin_pct: 12.0,
    avg_nafis_share_pct: 35.0,
    main_competitor: 'رقیب Y',
    total_complaints: 3,
    high_severity_complaints: 2,
    bounced_checks_count: 0,
    avg_delay_days: 11,
    risk_score: 72,
    opportunity_score: 68,
    health_status: 'Needs Attention',
    rfm_score: '3-3-3',
    rfm_segment: 'دچار چالش کیفی در خط تولید',
    last_purchase_date: '۱۴۰۴/۱۱/۲۰',
    last_interaction_date: '۱۴۰۴/۱۲/۰۳',
    payment_status: 'منظم',
    installment_share_pct: 25,
    latest_next_action: 'ارائه گزارش تحلیلی آزمایشگاه QMS پیرامون آزمون کشش لات LOT-202504-113068',
    next_step_action: 'ارائه نتایج آزمایشگاه QMS و تعویض لات معیوب',
    next_step_reason: 'شکایت CMP-0004 پیرامون افت کشش نخ در لات LOT-202504-113068',
    next_step_due: '۱۴۰۴/۱۲/۱۸',
    next_step_priority: 'High',
  },
  {
    customer_id: 'C_948070',
    customer_name: 'ریسندگی بهارستان قزوین',
    location_id: 'LOC-002',
    location_name: 'قزوین',
    customer_segment: 'B',
    sales_rep_id: 'REP-001',
    sales_rep_name: 'مهندس احمدی',
    lifetime_revenue: 92000000,
    revenue_trend_pct: 28.5,
    avg_gross_margin_pct: 17.1,
    avg_nafis_share_pct: 58.0,
    main_competitor: 'رقیب X',
    total_complaints: 0,
    high_severity_complaints: 0,
    bounced_checks_count: 0,
    avg_delay_days: 6,
    risk_score: 12,
    opportunity_score: 76,
    health_status: 'Healthy',
    rfm_score: '5-4-4',
    rfm_segment: 'وفادار و پایدار (Loyal)',
    last_purchase_date: '۱۴۰۴/۱۲/۰۸',
    last_interaction_date: '۱۴۰۴/۱۲/۰۹',
    payment_status: 'عالی',
    installment_share_pct: 15,
    latest_next_action: 'معرفی گریدهای الیاف میکروفیلامنت با مارجین سود بالاتر',
    next_step_action: 'ارسال نمونه ۵۰ کیلوگرمی میکروفیلامنت',
    next_step_reason: 'ابراز تمایل مشتری در تعامل CRM اخیر به تست نخ‌های با ارزش افزوده بالا',
    next_step_due: '۱۴۰۴/۱۲/۲۵',
    next_step_priority: 'Low',
  },
  {
    customer_id: 'C_101842',
    customer_name: 'پارچه‌بافی کیان تبریز',
    location_id: 'LOC-008',
    location_name: 'تبریز / آذربایجان شرقی',
    customer_segment: 'B',
    sales_rep_id: 'REP-005',
    sales_rep_name: 'مهندس شجاعی',
    lifetime_revenue: 76000000,
    revenue_trend_pct: -12.0,
    avg_gross_margin_pct: 14.5,
    avg_nafis_share_pct: 26.0,
    main_competitor: 'نساجی بروجرد',
    total_complaints: 1,
    high_severity_complaints: 0,
    bounced_checks_count: 0,
    avg_delay_days: 18,
    risk_score: 45,
    opportunity_score: 84,
    health_status: 'Needs Attention',
    rfm_score: '3-3-3',
    rfm_segment: 'پتانسیل افزایش سهم خرید',
    last_purchase_date: '۱۴۰۴/۱۱/۲۵',
    last_interaction_date: '۱۴۰۴/۱۲/۰۲',
    payment_status: 'متوسط',
    installment_share_pct: 35,
    latest_next_action: 'مذاکره برای تامین مستقیم نخ‌های بافندگی ژاکارد',
    next_step_action: 'ارائه قیمت رقابتی نخ ژاکارد در برابر بروجرد',
    next_step_reason: 'رقیب بروجرد قیمت‌ها را ۸٪ افزایش داده و خریدار به دنبال تامین‌کننده جایگزین است',
    next_step_due: '۱۴۰۴/۱۲/۲۱',
    next_step_priority: 'Medium',
  },
  {
    customer_id: 'C_672706',
    customer_name: 'نساجی زرین تبار قم',
    location_id: 'LOC-009',
    location_name: 'قم / شکوهیه',
    customer_segment: 'C',
    sales_rep_id: 'REP-003',
    sales_rep_name: 'مهندس کاظمی',
    lifetime_revenue: 45000000,
    revenue_trend_pct: 5.2,
    avg_gross_margin_pct: 12.8,
    avg_nafis_share_pct: 40.0,
    main_competitor: 'رقیب Y',
    total_complaints: 0,
    high_severity_complaints: 0,
    bounced_checks_count: 0,
    avg_delay_days: 10,
    risk_score: 28,
    opportunity_score: 55,
    health_status: 'Healthy',
    rfm_score: '4-3-2',
    rfm_segment: 'مشتری در حال توسعه',
    last_purchase_date: '۱۴۰۴/۱۲/۰۴',
    last_interaction_date: '۱۴۰۴/۱۲/۰۵',
    payment_status: 'منظم',
    installment_share_pct: 20,
    latest_next_action: 'پیگیری سفارش دوم اسفند ماه و تحویل در موعد مقرر',
    next_step_action: 'پیگیری تحویل به موقع سفارش دوم',
    next_step_reason: 'مشتری در حال رشد با روند خرید پایدار در سگمنت C',
    next_step_due: '۱۴۰۴/۱۲/۲۶',
    next_step_priority: 'Low',
  },
];

// ==========================================
// 5. UNIFIED INITIAL TASKS (GROUNDED IN REAL DATA)
// ==========================================
export const INITIAL_COPAN_TASKS: CopanTask[] = [
  {
    id: 'TSK-001',
    customer_id: 'CUST-008',
    customer_name: 'صنایع نساجی سبلان پارچه',
    location_name: 'اردبیل / تهران',
    sales_rep_name: 'مهندس رضایی',
    task_type: 'RESOLVE_COMPLAINT',
    task_type_label: 'رفع شکایت و جلوگیری از ریزش',
    title: 'جلسه اضطراری جلوگیری از ریزش حساب سبلان پارچه',
    reason: 'چون سفارشات ۶۰ روز اخیر ۳۴.۵٪ افت کرده و شکایت کیفی پرز نخ (CMP-0001) باز مانده و رقیب بروجرد نمونه ارسال کرده است، باید ظرف ۴۸ ساعت جلسه حضوری با مدیر فنی کارخانه برگزار شود.',
    because_signal: 'افت ۳۴.۵٪ سفارشات + ۲ شکایت باز فیلامنت + ارسال نمونه رقیب بروجرد با تخفیف ۵٪',
    should_action: 'هماهنگی جلسه حضوری در محل کارخانه اردبیل و ارائه گواهی تعویض محموله',
    priority: 'Critical',
    priority_label: 'بحرانی (P0)',
    due_date: '۱۴۰۴/۱۲/۱۵ (امروز)',
    status: 'To Do',
    context_type: 'COMPLAINT',
    context_data: {
      complaint_id: 'CMP-0001',
      lot_id: 'LOT-202504-113068',
      product_id: 'PRD-POY-001',
      expected_impact: 'حفظ سالانه ۱۲۰ میلیون ریال درآمد و بازیابی سهم سبد به ۵۰٪',
      crm_interaction_summary: 'در جلسه ۲ اسفند، مدیر کارخانه اعلام کرد در صورت عدم اصلاح پرز نخ، خرید به رقیب منتقل می‌شود.',
    },
    suggested_next_step: 'هماهنگی سفر کارشناس QMS و مدیر فروش به اردبیل',
    notes: [
      { text: 'شکایت CMP-0001 به واحد تضمین کیفیت ارجاع داده شد.', created_at: '۱۴۰۴/۱۲/۰۲', author: 'مهندس رضایی' },
    ],
    created_at: '۱۴۰۴/۱۲/۰۲',
  },
  {
    id: 'TSK-002',
    customer_id: 'C_535756',
    customer_name: 'بافندگی پرنیان مشهد',
    location_name: 'مشهد / خراسان',
    sales_rep_name: 'مهندس موسوی',
    task_type: 'REVIEW_BOUNCED_CHECK',
    task_type_label: 'پیگیری چک برگشتی و قفل اعتبار',
    title: 'تعیین تکلیف ۲ فقره چک برگشتی پرنیان مشهد و توقف نسیه',
    reason: 'چون ۲ فقره چک برگشتی به مبلغ ۳۸ میلیون ریال ثبت شده و میانگین تاخیر به ۳۸ روز رسیده است، باید اخطار حقوقی ارسال و فروش جدید منوط به تسویه نقدی گردد.',
    because_signal: '۲ فقره چک واخواست‌شده به مبلغ ۳۸ م.ر و تکمیل سقف اعتبار ۵۰ م.ر',
    should_action: 'قفل سیستمی اعتبار و مذاکره برای اخذ وثیقه ملکی یا تسویه نقدی',
    priority: 'Critical',
    priority_label: 'بحرانی (P0)',
    due_date: '۱۴۰۴/۱۲/۱۴ (فوری)',
    status: 'To Do',
    context_type: 'COLLECTION',
    context_data: {
      financial_amount: 38000000,
      bounced_checks_count: 2,
      delay_days: 38,
      expected_impact: 'جلوگیری از سوخت مطالبات ۳۸ میلیون ریالی',
      crm_interaction_summary: 'تماس با مدیر مالی پرنیان در تاریخ ۱۰ بهمن: تعهد پرداخت تا پایان بهمن که عمل نشد.',
    },
    suggested_next_step: 'ارسال اخطار رسمی واحد حقوقی و پیگیری مسدودی حساب',
    notes: [],
    created_at: '۱۴۰۴/۱۱/۲۵',
  },
  {
    id: 'TSK-003',
    customer_id: 'CUST-010',
    customer_name: 'تکمیل و رنگرزی ماهان',
    location_name: 'تهران / شمس آباد',
    sales_rep_name: 'مهندس احمدی',
    task_type: 'REVIEW_OFFER',
    task_type_label: 'نهایی‌سازی آفر قیمت',
    title: 'نهایی‌سازی آفر قیمت OFF-0000002 قبل از انقضا',
    reason: 'چون پیش‌فاکتور OFF-0000002 با تخفیف ۲.۱۱٪ صادر شده و تنها ۵ روز تا پایان اعتبار باقی است، باید جلسه توافق بر سر کیفیت دوک‌ها برگزار و قرارداد منعقد شود.',
    because_signal: 'آفر قیمت ۴۵ تن نخ رنگی با تخفیف ۲.۱۱٪ با ۵ روز اعتبار باقی‌مانده',
    should_action: 'ارسال نمونه دوک جدید با تاییدیه QMS و اخذ امضای قرارداد',
    priority: 'High',
    priority_label: 'بالا (P1)',
    due_date: '۱۴۰۴/۱۲/۱۹ (۴ روز مانده)',
    status: 'In Progress',
    context_type: 'OFFER',
    context_data: {
      offer_id: 'OFF-0000002',
      financial_amount: 62000000,
      product_id: 'Product_Family_03',
      expected_impact: 'بستن قرارداد فروش ۴۵ تن به ارزش ۶۲ میلیون ریال',
      crm_interaction_summary: 'در تماس ۷ اسفند، مشتری درخواست تایید کیفیت رزرو دوک قبل از امضا را داشت.',
    },
    suggested_next_step: 'ارسال نمونه تاییدشده آزمایشگاه به کارخانه ماهان',
    notes: [
      { text: 'نمونه دوک اصلاح‌شده از انبار مرکزی بارگیری شد.', created_at: '۱۴۰۴/۱۲/۰۹', author: 'مهندس احمدی' },
    ],
    created_at: '۱۴۰۴/۱۱/۲۸',
  },
  {
    id: 'TSK-004',
    customer_id: 'CUST-003',
    customer_name: 'صنایع پارچه تریکو البرز',
    location_name: 'البرز / کرج',
    sales_rep_name: 'مهندس احمدی',
    task_type: 'SEND_OFFER',
    task_type_label: 'تصاحب سهم سبد و ارسال پیشنهاد',
    title: 'تصاحب سهم رقیب X در تریکو البرز با آفر ۳.۵٪',
    reason: 'چون رقیب X در تحویل سفارشات دچار تاخیر مکرر شده و تریکو البرز خوش‌حساب‌ترین مشتری سگمنت A با تاخیر ۸ روز است، باید بسته قرارداد ۶ ماهه با ۳.۵٪ تخفیف پلکانی ارسال شود.',
    because_signal: 'سهم فعلی نفیس ۲۲٪ در مقابل مصرف سالانه ۶۰ تن + نارضایتی از رقیب X',
    should_action: 'ارائه پیش‌فاکتور با تضمین تحویل ۴۸ ساعته و تخفیف پلکانی ۳.۵٪',
    priority: 'High',
    priority_label: 'بالا (P1)',
    due_date: '۱۴۰۴/۱۲/۱۸ (۳ روز مانده)',
    status: 'To Do',
    context_type: 'SALES',
    context_data: {
      financial_amount: 85000000,
      product_id: 'Product_Family_01',
      expected_impact: 'افزایش سهم سبد به ۴۵٪ و افزایش درآمد فصلی به میزان ۸۵ م.ر',
      crm_interaction_summary: 'مذاکره ۸ اسفند با مدیر بازرگانی: اعلام آمادگی برای انتقال ۴۰٪ سفارشات رقیب X به نفیس.',
    },
    suggested_next_step: 'ارسال پیش‌نویس قرارداد ۶ ماهه با امضای معاونت بازرگانی',
    notes: [],
    created_at: '۱۴۰۴/۱۲/۰۸',
  },
  {
    id: 'TSK-005',
    customer_id: 'C_683666',
    customer_name: 'نساجی تار و پود اصفهان',
    location_name: 'اصفهان',
    sales_rep_name: 'مهندس کاظمی',
    task_type: 'REVIEW_DEV_REQUEST',
    task_type_label: 'پیگیری توسعه محصول و احیای خرید',
    title: 'پیگیری درخواست توسعه محصول نمره نخ P_091085',
    reason: 'چون درخواست کاهش پرز نخ در واحد فنی معلق مانده و مشتری خرید ماهانه ۱۵۰ م.ر را متوقف کرده است، باید نمونه پاس‌شده در آزمایشگاه QMS ارسال شود.',
    because_signal: 'توقف سفارش‌گذاری بیش از ۴۵ روز به دلیل عدم پیگیری درخواست فنی',
    should_action: 'ارسال نمونه ۵۰۰ کیلوگرمی با گارانتی تعویض و جلسه مشترک فنی',
    priority: 'Medium',
    priority_label: 'متوسط (P2)',
    due_date: '۱۴۰۴/۱۲/۲۲ (۷ روز مانده)',
    status: 'To Do',
    context_type: 'DEV_REQUEST',
    context_data: {
      product_id: 'P_091085',
      financial_amount: 50000000,
      expected_impact: 'احیای سفارشات ماهانه ۱۵ تن نخ با حاشیه سود ۱۶.۲٪',
      crm_interaction_summary: 'تماس اول اسفند: مدیر کارخانه اعلام کرد تا رسیدن نمونه اصلاحی سفارشی ثبت نخواهد شد.',
    },
    suggested_next_step: 'ارسال برگه آزمون آزمایشگاه مرکزی و دریافت تاریخ تست میدانی',
    notes: [],
    created_at: '۱۴۰۴/۱۲/۰۱',
  },
  {
    id: 'TSK-006',
    customer_id: 'CUST-015',
    customer_name: 'ریسندگی ممتاز سمنان',
    location_name: 'سمنان',
    sales_rep_name: 'مهندس شجاعی',
    task_type: 'FOLLOW_UP_COMPLAINT',
    task_type_label: 'پیگیری شکایت کیفی و تعویض لات',
    title: 'ارائه نتایج تست کشش QMS به ریسندگی ممتاز سمنان',
    reason: 'چون شکایت CMP-0004 پیرامون افت کشش نخ ثبت شده، باید گزارش آزمایشگاه ارائه و باقی‌مانده محموله با لات استاندارد جایگزین گردد.',
    because_signal: 'شکایت کیفی با نمره کشش Tensile: 2.85 در لات LOT-202504-113068',
    should_action: 'توقف ارسال لات معیوب و ارسال محموله جایگزین از خط ۲',
    priority: 'High',
    priority_label: 'بالا (P1)',
    due_date: '۱۴۰۴/۱۲/۱۸ (۳ روز مانده)',
    status: 'In Progress',
    context_type: 'COMPLAINT',
    context_data: {
      complaint_id: 'CMP-0004',
      lot_id: 'LOT-202504-113068',
      product_id: 'PRD-POY-006',
      expected_impact: 'حفظ رضایت حساب سگمنت B با گردش مالی ۸۴ میلیون ریال',
    },
    suggested_next_step: 'ارسال حواله خروج بار جایگزین از انبار مرکزی',
    notes: [],
    created_at: '۱۴۰۴/۱۲/۰۳',
  },
  {
    id: 'TSK-007',
    customer_id: 'C_948070',
    customer_name: 'ریسندگی بهارستان قزوین',
    location_name: 'قزوین',
    sales_rep_name: 'مهندس احمدی',
    task_type: 'CONTACT_CUSTOMER',
    task_type_label: 'ارسال نمونه و معرفی کالای جدید',
    title: 'ارسال کاتالوگ و نمونه کالای جدید Product_Family_04',
    reason: 'چون مشتری در تماس اخیر به توسعه خطوط بافندگی و نیاز به میکروفیلامنت اشاره کرده است، باید نمونه ۵۰ کیلوگرمی به همراه برگه مشخصات ارسال شود.',
    because_signal: 'رشد ۲۸.۵٪ خرید در سال جاری و درخواست تست گریدهای با ارزش افزوده',
    should_action: 'ارسال بسته نمونه ۵۰ کیلویی و تماس هماهنگی تست در کارخانه',
    priority: 'Low',
    priority_label: 'عادی (P3)',
    due_date: '۱۴۰۴/۱۲/۲۵ (۱۰ روز مانده)',
    status: 'To Do',
    context_type: 'CRM',
    context_data: {
      product_id: 'Product_Family_04',
      financial_amount: 25000000,
      expected_impact: 'افزایش تنوع سبد خرید با مارجین سود ۲٪ بالاتر',
    },
    suggested_next_step: 'هماهنگی واحد نمونه‌گیری جهت آماده‌سازی دوک‌ها',
    notes: [],
    created_at: '۱۴۰۴/۱۲/۰۹',
  },
  {
    id: 'TSK-008',
    customer_id: 'C_101842',
    customer_name: 'پارچه‌بافی کیان تبریز',
    location_name: 'تبریز / آذربایجان شرقی',
    sales_rep_name: 'مهندس شجاعی',
    task_type: 'FOLLOW_UP_COLLECTION',
    task_type_label: 'پیگیری وصول و تسویه فاکتور',
    title: 'تسویه فاکتور T_285604 پارچه‌بافی کیان تبریز',
    reason: 'چون فاکتور سررسید شده بود و پیگیری تلفنی انجام شد، وجه فاکتور به حساب شرکت واریز گردید.',
    because_signal: 'سررسید فاکتور به مبلغ ۲۴ م.ر',
    should_action: 'تماس تلفنی و ثبت فیش واریزی در سیستم مالی',
    priority: 'Medium',
    priority_label: 'متوسط (P2)',
    due_date: '۱۴۰۴/۱۲/۰۵',
    status: 'Completed',
    context_type: 'COLLECTION',
    context_data: {
      financial_amount: 24000000,
      expected_impact: 'تسویه کامل طلب معوق و آزادسازی سقف اعتبار مشتری',
    },
    suggested_next_step: 'اقدام تکمیل شد.',
    notes: [
      { text: 'فیش واریزی دریافت و در سامانه حسابداری تایید گردید.', created_at: '۱۴۰۴/۱۲/۰۵', author: 'مهندس شجاعی' },
    ],
    created_at: '۱۴۰۴/۱۱/۲۸',
    completed_at: '۱۴۰۴/۱۲/۰۵',
  },
];

// Compatibility alias
export const COPAN_PRIORITIES = INITIAL_COPAN_TASKS;

// ==========================================
// 6. UNIFIED CRM INTERACTIONS HISTORY
// ==========================================
export const INITIAL_COPAN_INTERACTIONS: CopanCRMInteraction[] = [
  {
    id: 'INT-001',
    customer_id: 'CUST-008',
    customer_name: 'صنایع نساجی سبلان پارچه',
    sales_rep_name: 'مهندس رضایی',
    interaction_type: 'جلسه حضوری',
    event_time: '۱۴۰۴/۱۲/۰۲ - ساعت ۱۰:۳۰',
    summary_text: 'جلسه در کارخانه اردبیل پیرامون بررسی کیفیت نخ‌های ارسالی لات ۱۱۳۰۶۸ و پرزدهی ماشین‌آلات بافندگی.',
    customer_feedback: 'مدیر فنی کارخانه نمونه‌های پرزدار را نشان داد و اظهار داشت در صورت عدم حل سریع، قرارداد تامین فروردین لغو خواهد شد.',
    key_outcome: 'توافق بر سر ارسال نمونه اصلاحی و تعویض رایگان محموله معیوب.',
    related_product: 'PRD-POY-001 (خانواده ۰۳)',
    next_action: 'مذاکره حضوری مدیر فروش و ارسال تیم فنی به کارخانه',
    follow_up_date: '۱۴۰۴/۱۲/۱۵',
    priority: 'Critical',
    record_status: 'قطعی',
    conversation_status: 'At Risk',
    sales_stage: 'Qualified',
    created_at: '۱۴۰۴/۱۲/۰۲',
  },
  {
    id: 'INT-002',
    customer_id: 'CUST-003',
    customer_name: 'صنایع پارچه تریکو البرز',
    sales_rep_name: 'مهندس احمدی',
    interaction_type: 'مذاکره قیمت',
    event_time: '۱۴۰۴/۱۲/۰۸ - ساعت ۱۴:۰۰',
    summary_text: 'مذاکره بر سر تخفیف خرید حجمی برای عقد قرارداد ۶ ماهه تامین نخ‌های فیلامنتی DTY.',
    customer_feedback: 'مشتری از تاخیرهای مداوم رقیب X گلایه دارد و تمایل به انتقال ۴۰٪ سفارشات به نفیس در ازای ۳.۵٪ تخفیف دارد.',
    key_outcome: 'پیش‌نویس شرایط قرارداد با تحویل ۴۸ ساعته و پرداخت ۳۰ روزه آماده شد.',
    related_product: 'خانواده ۰۱ (POY مات)',
    next_action: 'ارسال آفر ۳.۵٪ تخفیف پلکانی',
    follow_up_date: '۱۴۰۴/۱۲/۱۸',
    priority: 'High',
    record_status: 'در جریان',
    conversation_status: 'Opportunity',
    sales_stage: 'Negotiation',
    created_at: '۱۴۰۴/۱۲/۰۸',
  },
  {
    id: 'INT-003',
    customer_id: 'CUST-010',
    customer_name: 'تکمیل و رنگرزی ماهان',
    sales_rep_name: 'مهندس احمدی',
    interaction_type: 'تماس تلفنی',
    event_time: '۱۴۰۴/۱۲/۰۷ - ساعت ۱۱:۱۵',
    summary_text: 'پیگیری وضعیت تایید پیش‌فاکتور OFF-0000002 و بررسی شرایط پرداخت.',
    customer_feedback: 'پیش‌فاکتور قیمت مورد تایید است اما تاییدیه کنترل کیفیت در خصوص دوک‌های بدون تیغ‌خوردگی الزامی است.',
    key_outcome: 'مقرر شد نمونه دوک جایگزین از انبار مرکزی ارسال شود.',
    related_product: 'Product_Family_03',
    next_action: 'نهایی‌سازی آفر قبل از انقضا',
    follow_up_date: '۱۴۰۴/۱۲/۱۹',
    priority: 'High',
    record_status: 'در جریان',
    conversation_status: 'Waiting for Customer',
    sales_stage: 'Negotiation',
    created_at: '۱۴۰۴/۱۲/۰۷',
  },
  {
    id: 'INT-004',
    customer_id: 'C_245948',
    customer_name: 'ریسندگی و بافندگی اطلس یزد',
    sales_rep_name: 'مهندس رضایی',
    interaction_type: 'تماس تلفنی',
    event_time: '۱۴۰۴/۱۲/۱۰ - ساعت ۰۹:۴۵',
    summary_text: 'یادآوری سررسید دوره سفارش ماهانه نخ POY سوپربرایت و بررسی موجودی انبار مشتری.',
    customer_feedback: 'موجودی انبار کارخانه یزد رو به اتمام است و درخواست بارگیری فوری ۵۰ تن دارند.',
    key_outcome: 'هماهنگی با واحد برنامه‌ریزی تولید برای رزرو سهمیه پارت اول اسفند.',
    related_product: 'خانواده ۰۴ (DTY سوپربرایت)',
    next_action: 'صدور و ارسال پیش‌فاکتور تکرار سفارش',
    follow_up_date: '۱۴۰۴/۱۲/۱۶',
    priority: 'High',
    record_status: 'قطعی',
    conversation_status: 'Follow-up Required',
    sales_stage: 'Won',
    created_at: '۱۴۰۴/۱۲/۱۰',
  },
  {
    id: 'INT-005',
    customer_id: 'C_937594',
    customer_name: 'نساجی نگین بافت کاشان',
    sales_rep_name: 'مهندس کاظمی',
    interaction_type: 'جلسه حضوری',
    event_time: '۱۴۰۴/۱۲/۱۱ - ساعت ۱۵:۳۰',
    summary_text: 'جلسه با هیئت مدیره نگین بافت در دفتر تهران پیرامون تمدید قرارداد سالانه تامین انحصاری نخ POY مات.',
    customer_feedback: 'رضایت کامل از کیفیت نخ‌ها و زمان‌بندی تحویل محموله‌ها در طول سال گذشته.',
    key_outcome: 'توافق اولیه برای افزایش ۱۰٪ تناژ سالانه در ازای تسهیلات اعتباری ۴۵ روزه.',
    related_product: 'Product_Family_01',
    next_action: 'تنظیم متن نهایی قرارداد سالانه ۱۴۰۵',
    follow_up_date: '۱۴۰۴/۱۲/۲۲',
    priority: 'Medium',
    record_status: 'در جریان',
    conversation_status: 'Active',
    sales_stage: 'Negotiation',
    created_at: '۱۴۰۴/۱۲/۱۱',
  },
  {
    id: 'INT-006',
    customer_id: 'C_683666',
    customer_name: 'نساجی تار و پود اصفهان',
    sales_rep_name: 'مهندس کاظمی',
    interaction_type: 'مکاتبه رسمی',
    event_time: '۱۴۰۴/۱۲/۰۱ - ساعت ۱۳:۰۰',
    summary_text: 'ارسال نامه پیگیری درخواست فنی نمره نخ P_091085 و بررسی علت توقف سفارش‌گذاری.',
    customer_feedback: 'تا زمان تایید نمونه آزمایشی کم‌پرز، سفارشات به نساجی بروجرد ارسال خواهد شد.',
    key_outcome: 'ارجاع فوری پرونده به واحد R&D جهت اولویت‌بخشی به تست خط تولید.',
    related_product: 'P_091085',
    next_action: 'ارسال ۵۰۰ کیلو نمونه تست آزمایشگاهی',
    follow_up_date: '۱۴۰۴/۱۲/۲۲',
    priority: 'Medium',
    record_status: 'در جریان',
    conversation_status: 'Follow-up Required',
    sales_stage: 'Contacted',
    created_at: '۱۴۰۴/۱۲/۰۱',
  },
];

// ==========================================
// 5. ACTION PRIORITIES INTERFACE (FOR COMPATIBILITY)
// ==========================================
export interface CopanActionPriority {
  id: string;
  customer_id: string;
  customer_name: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  priority_label: string;
  title: string;
  reason: string;
  evidence: string[];
  expected_impact: string;
  recommended_action: string;
  deadline: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Snoozed';
  sales_rep_name: string;
  financial_exposure: number;
}

// ==========================================
// 6. OPPORTUNITIES INTELLIGENCE (2 MODELS)
// ==========================================
export interface CopanOpportunity {
  id: string;
  model_type: 'PURCHASE_PROBABILITY' | 'BASKET_SHARE_DECLINE';
  customer_id: string;
  customer_name: string;
  opportunity_title: string;
  probability_pct: number;
  potential_revenue: number;
  customer_segment: string;
  reason: string;
  evidence: string[];
  recommended_action: string;
  expected_close_days: number;
  score: number;
}

export const COPAN_OPPORTUNITIES: CopanOpportunity[] = [
  {
    id: 'OPP-001',
    model_type: 'BASKET_SHARE_DECLINE',
    customer_id: 'CUST-003',
    customer_name: 'صنایع پارچه تریکو البرز',
    opportunity_title: 'تصاحب سهم رقیب X در نخ‌های فیلامنت DTY',
    probability_pct: 88,
    potential_revenue: 145000000,
    customer_segment: 'A',
    reason: 'ظرفیت سالانه ۶۰ تن، سهم فعلی نفیس ۲۲٪ در برابر سهم ۶۵٪ رقیب X؛ رقیب دچار تأخیر در تحویل است',
    evidence: [
      'مصرف ماهانه ۵ تن در کارخانه تریکو البرز تأیید شده است.',
      'حاشیه سود تاریخی ۱۸.۵٪ و تأخیر پرداخت تنها ۸ روز است.',
      'سیگنال CRM: مدیر خرید از تأخیرهای مداوم رقیب X ابراز نارضایتی کرده است.',
    ],
    recommended_action: 'ارائه قرارداد ۶ ماهه با تضمین تحویل ۴۸ ساعته و ۳٪ تخفیف پلکانی',
    expected_close_days: 10,
    score: 95,
  },
  {
    id: 'OPP-002',
    model_type: 'PURCHASE_PROBABILITY',
    customer_id: 'C_245948',
    customer_name: 'ریسندگی و بافندگی اطلس یزد',
    opportunity_title: 'سررسید دوره خرید ماهانه نخ POY سوپربرایت',
    probability_pct: 92,
    potential_revenue: 110000000,
    customer_segment: 'A',
    reason: 'چرخه خرید منظم ۲۲ روزه؛ ۲۴ روز از آخرین فاکتور گذشته و موجودی انبار مشتری رو به اتمام است',
    evidence: [
      'میانگین دوره تناوب سفارش: ۲۲.۴ روز',
      'روزهای گذشته از آخرین خرید: ۲۴ روز',
      'روند خرید صعودی (+۲۲۴٪ نسبت به سال قبل)',
    ],
    recommended_action: 'تماس کارشناس فروش جهت ثبت پیش‌فاکتور تکرار سفارش به همراه تخصیص سهمیه از انبار یزد',
    expected_close_days: 3,
    score: 92,
  },
  {
    id: 'OPP-003',
    model_type: 'BASKET_SHARE_DECLINE',
    customer_id: 'C_683666',
    customer_name: 'نساجی تار و پود اصفهان',
    opportunity_title: 'احیای سهم از دست‌رفته با تامین نمره نخ سفارشی',
    probability_pct: 75,
    potential_revenue: 85000000,
    customer_segment: 'A',
    reason: 'سهم سبد از ۵۰٪ به ۱۵٪ افت کرده؛ مشتری به دلیل نبود گرید کم‌پرز به نساجی بروجرد رجوع کرده بود',
    evidence: [
      'اصلاح خط تولید و پاس شدن آزمون آزمایشگاه QMS برای نخ کم‌پرز',
      'سابقه خرید سالانه ۱۵۰ میلیون ریال در دوران همکاری مستمر',
    ],
    recommended_action: 'ارسال محموله نمونه ۵۰۰ کیلوگرمی با گارانتی کیفیت بدون هزینه مرجوعی',
    expected_close_days: 14,
    score: 89,
  },
  {
    id: 'OPP-004',
    model_type: 'PURCHASE_PROBABILITY',
    customer_id: 'C_948070',
    customer_name: 'ریسندگی بهارستان قزوین',
    opportunity_title: 'افزایش سبد خرید به محصولات مات و های‌اینتنس',
    probability_pct: 82,
    potential_revenue: 65000000,
    customer_segment: 'B',
    reason: 'توسعه خطوط بافندگی جدید در کارخانه مشتری و افزایش تقاضا برای گریدهای با ارزش افزوده بالا',
    evidence: [
      'گزارش بازدید کارشناس فروش در سامانه CRM',
      'خوش‌حسابی کامل (میانگین تاخیر ۶ روز)',
    ],
    recommended_action: 'ارائه سبد ترکیبی نخ POY و DTY با اعتبار تسویه ۳۰ روزه',
    expected_close_days: 8,
    score: 84,
  },
  {
    id: 'OPP-005',
    model_type: 'BASKET_SHARE_DECLINE',
    customer_id: 'C_101842',
    customer_name: 'پارچه‌بافی کیان تبریز',
    opportunity_title: 'جایگزینی رقیب بروجرد در تامین نخ‌های ژاکارد',
    probability_pct: 68,
    potential_revenue: 55000000,
    customer_segment: 'B',
    reason: 'رقیب بروجرد قیمت‌ها را ۸٪ افزایش داده؛ کیان تبریز به دنبال تامین‌کننده جایگزین است',
    evidence: [
      'سیگنال ثبت‌شده توسط نماینده فروش تبریز',
      'سهم فعلی نفیس ۲۶٪ با پتانسیل جهش به ۵۵٪',
    ],
    recommended_action: 'پیشنهاد قیمت رقابتی با تثبیت نرخ به مدت ۳ ماه در ازای خرید حداقل ۳۰ تن',
    expected_close_days: 12,
    score: 78,
  },
];

// ==========================================
// 7. SALES INTELLIGENCE ANALYTICS
// ==========================================
export const COPAN_SALES_INTELLIGENCE = {
  growing_customers: [
    { customer_id: 'C_245948', name: 'ریسندگی و بافندگی اطلس یزد', segment: 'A', current_sales: 310000000, growth_pct: 224.6, margin_pct: 15.8 },
    { customer_id: 'C_937594', name: 'نساجی نگین بافت کاشان', segment: 'A', current_sales: 360000000, growth_pct: 44.5, margin_pct: 14.2 },
    { customer_id: 'C_948070', name: 'ریسندگی بهارستان قزوین', segment: 'B', current_sales: 92000000, growth_pct: 28.5, margin_pct: 17.1 },
    { customer_id: 'CUST-003', name: 'صنایع پارچه تریکو البرز', segment: 'A', current_sales: 148000000, growth_pct: 14.8, margin_pct: 18.5 },
    { customer_id: 'CUST-010', name: 'تکمیل و رنگرزی ماهان', segment: 'B', current_sales: 98000000, growth_pct: 8.2, margin_pct: 13.5 },
  ],
  declining_customers: [
    { customer_id: 'C_683666', name: 'نساجی تار و پود اصفهان', segment: 'A', current_sales: 150000000, growth_pct: -75.5, margin_pct: 16.2, reason: 'معلق ماندن درخواست توسعه محصول' },
    { customer_id: 'C_535756', name: 'بافندگی پرنیان مشهد', segment: 'B', current_sales: 170000000, growth_pct: -49.0, margin_pct: 8.5, reason: 'ریسک چک برگشتی و قفل اعتبار' },
    { customer_id: 'C_633661', name: 'صنایع پارچه تریکو البرز (واحد ۲)', segment: 'A', current_sales: 220000000, growth_pct: -35.1, margin_pct: 11.2, reason: 'نارضایتی از تأخیر وصول و شکایات کیفی' },
    { customer_id: 'CUST-008', name: 'صنایع نساجی سبلان پارچه', segment: 'A', current_sales: 124500000, growth_pct: -34.5, margin_pct: 16.2, reason: 'شکایات پرز نخ و نفوذ رقیب X' },
    { customer_id: 'CUST-015', name: 'ریسندگی ممتاز سمنان', segment: 'B', current_sales: 84000000, growth_pct: -18.4, margin_pct: 12.0, reason: 'انحراف استحکام کششی لات تولیدی' },
  ],
  product_families: [
    { family: 'Product_Family_01', title: 'خانواده کالایی ۰۱ (POY مات)', share_pct: 32.4, revenue: 1432000000, margin_pct: 12.8, trend: '+8.4%' },
    { family: 'Product_Family_03', title: 'خانواده کالایی ۰۳ (POY نیمه‌مات)', share_pct: 26.1, revenue: 1153000000, margin_pct: 10.5, trend: '-4.2%' },
    { family: 'Product_Family_04', title: 'خانواده کالایی ۰۴ (DTY سوپربرایت)', share_pct: 18.5, revenue: 817000000, margin_pct: 14.1, trend: '+12.1%' },
    { family: 'Product_Family_02', title: 'خانواده کالایی ۰۲ (FDY تریکو)', share_pct: 12.3, revenue: 543000000, margin_pct: 9.2, trend: '-2.1%' },
    { family: 'Product_Family_05', title: 'خانواده کالایی ۰۵ (نخ‌های تابیده)', share_pct: 6.8, revenue: 300000000, margin_pct: 7.8, trend: '-11.0%' },
    { family: 'Product_Family_06', title: 'خانواده کالایی ۰۶ (نخ‌های خاص)', share_pct: 3.9, revenue: 175000000, margin_pct: 16.5, trend: '+5.0%' },
  ],
  color_groups: [
    { group: 'Color_Class_01', name: 'خودرنگ / خام (Raw White)', share_pct: 54.0, volume_tons: 3240 },
    { group: 'Color_Class_02', name: 'مشکی کاتیونیک (Jet Black)', share_pct: 24.5, volume_tons: 1470 },
    { group: 'Color_Class_03', name: 'رنگی پایه (Dope Dyed Primary)', share_pct: 14.2, volume_tons: 852 },
    { group: 'Color_Class_04', name: 'شیدهای سفارشی (Custom Shades)', share_pct: 7.3, volume_tons: 438 },
  ],
  pareto_concentration: {
    top_10_pct_customers_revenue_share: 78.4,
    total_customers_count: 644,
    active_customers_count: 248,
    loss_making_customers_count: 57,
    key_takeaway: '۷۸.۴٪ درآمد شرکت تنها به ۶۴ مشتری وابسته است. ریزش هر یک از ۱۰ مشتری اول اثر شدیدی بر سودآوری کل شرکت دارد.',
  },
};

// ==========================================
// 8. MARKET INTELLIGENCE (3C DYNAMICS)
// ==========================================
export interface CopanMarketReport {
  week_id: string;
  report_date: string;
  product_market: string;
  competitor: string;
  customer_signal: string;
  price_index: number;
  demand_change: 'افزایش' | 'کاهش' | 'ثابت';
  market_trend: string;
  analysis_type: 'FACT' | 'INFERENCE' | 'RECOMMENDATION';
  type_label: string;
  text: string;
  evidence: string;
}

export const COPAN_MARKET_INTELLIGENCE: CopanMarketReport[] = [
  {
    week_id: 'W-012',
    report_date: '۱۴۰۴/۱۲/۰۱',
    product_market: 'Product_Family_01 (POY مات)',
    competitor: 'رقیب X',
    customer_signal: 'تخفیف نقدی ۵٪ و تسویه ۴۵ روزه',
    price_index: 96.4,
    demand_change: 'افزایش',
    market_trend: 'افزایش تقاضای فصلی پارچه‌های تریکو و رو مبلی',
    analysis_type: 'FACT',
    type_label: 'داده قطعی [Fact]',
    text: 'رقیب X نرخ پایه را در استان‌های البرز و قزوین ۵٪ کاهش داده و با سفته ۴۵ روزه بارگیری می‌کند.',
    evidence: 'ثبت در ۴ گزارش ویزیت میدانی کارشناسان فروش در سامانه CRM_ACTIVITIES.',
  },
  {
    week_id: 'W-011',
    report_date: '۱۴۰۴/۱۱/۲۴',
    product_market: 'Product_Family_03 (POY نیمه‌مات)',
    competitor: 'رقیب Y',
    customer_signal: 'نقص کیفیت در محموله‌های ارسالی رقیب',
    price_index: 102.1,
    demand_change: 'ثابت',
    market_trend: 'نارضایتی بافندگان از نایکنواختی پرز محصولات رقیب Y',
    analysis_type: 'INFERENCE',
    type_label: 'سیگنال استنتاجی [Inference]',
    text: 'تضعیف جایگاه کیفی رقیب Y در بازار اصفهان و یزد فرصت مناسبی برای بازپس‌گیری سهم سبد فراهم آورده است.',
    evidence: 'تحلیل تطبیقی نرخ بازگشت سفارشات در ۲ ماه اخیر و اظهارات مدیران کارخانجات بافندگی.',
  },
  {
    week_id: 'W-010',
    report_date: '۱۴۰۴/۱۱/۱۷',
    product_market: 'Product_Family_04 (DTY سوپربرایت)',
    competitor: 'نساجی بروجرد',
    customer_signal: 'کمبود موجودی در بازار و افزایش زمان تحویل به ۳۰ روز',
    price_index: 108.5,
    demand_change: 'افزایش',
    market_trend: 'تقاضای شدید نخ‌های پرزرق و براق برای پرده و روسری',
    analysis_type: 'RECOMMENDATION',
    type_label: 'پیشنهاد راهبردی [AI Recommendation]',
    text: 'پیشنهاد می‌شود خطوط DTY با افزایش شیفت به حداکثر ظرفیت برسند و نرخ فی به میزان ۳٪ تعدیل مثبت شود.',
    evidence: 'شاخص قیمت ۱۰۸.۵ و افزایش ۲۴٪ پیش‌فاکتورهای دریافت شده در سامانه فروش.',
  },
];

// ==========================================
// 9. RISKS & ALERTS COMMAND CENTER REGISTRY
// ==========================================
export interface CopanRiskItem {
  id: string;
  risk_category: 'MARGIN_LOSS' | 'CUSTOMER' | 'PRODUCT' | 'COMMERCIAL';
  category_label: string;
  entity_id: string;
  entity_name: string;
  risk_title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  probability_pct: number;
  financial_impact: number;
  evidence: string[];
  recommended_action: string;
  risk_score: number;
}

export const COPAN_RISKS_REGISTRY: CopanRiskItem[] = [
  {
    id: 'RSK-LOSS-001',
    risk_category: 'MARGIN_LOSS',
    category_label: 'هشدار ضرر و حاشیه سود',
    entity_id: 'CUST-009',
    entity_name: 'بافندگی اطلس یزد',
    risk_title: 'فروش زیان‌ده با حاشیه سود منفی (-۴.۲٪) ناشی از تخفیف تجاری و دیرکرد تسویه',
    severity: 'Critical',
    probability_pct: 95,
    financial_impact: 28000000,
    evidence: [
      'قیمت تمام‌شده ۶۸۰ هزار ریال بالاتر از قیمت فروش ۶۵۱ هزار ریال است',
      'دیرکرد وصول ۶۵ روزه هزینه بهره خواب پول را به ۶.۵٪ رسانده است',
      'عدم محاسبه کارمزد اقساطی ۴٪ در فاکتور نهایی',
    ],
    recommended_action: 'اصلاح فوری نرخ فاکتور، لغو تخفیف‌های ویژه و تبدیل فروش به تسویه نقدی',
    risk_score: 96,
  },
  {
    id: 'RSK-LOSS-002',
    risk_category: 'MARGIN_LOSS',
    category_label: 'هشدار ضرر و حاشیه سود',
    entity_id: 'Product_Family_02',
    entity_name: 'خانواده کالایی ۰۲ (POY نمره ۱۵۰)',
    risk_title: 'فروش زیر قیمت تمام‌شده به دلیل جهش ۱۲٪ نرخ چیپس پلی‌استر',
    severity: 'High',
    probability_pct: 88,
    financial_impact: 42000000,
    evidence: [
      'افزایش نرخ چیپس پلی‌استر پتروشیمی تندگویان در بورس کالا',
      'قراردادهای تحویل ثابت ۲ ماهه بدون بند تعدیل تورمی',
      'افت حاشیه سود ناخالص از ۱۸٪ به ۱.۵٪ در تناژ ۴۰ تن',
    ],
    recommended_action: 'فعال‌سازی بند تعدیل نرخ مواد اولیه (Escalation Clause) در محموله‌های بعدی',
    risk_score: 89,
  },
  {
    id: 'RSK-001',
    risk_category: 'CUSTOMER',
    category_label: 'ریسک ریزش مشتری',
    entity_id: 'CUST-008',
    entity_name: 'صنایع نساجی سبلان پارچه',
    risk_title: 'ریزش حساب استراتژیک به دلیل شکایات مکرر و رقابت قیمتی',
    severity: 'Critical',
    probability_pct: 85,
    financial_impact: 120000000,
    evidence: [
      'افت حجم خرید ۳۴.۵٪ در ۶۰ روز اخیر',
      'ثبت ۲ شکایت کیفی حل‌نشده با عنوان «پرز شدید نخ»',
      'تأخیر در پرداخت فاکتورها به ۲۸ روز رسیده است',
      'سهم سبد از ۵۴٪ به ۲۸٪ سقوط کرده است',
    ],
    recommended_action: 'ملاقات فوری مدیر ارشد فروش و ارسال کارشناس فنی QMS به اردبیل جهت اصلاح عیوب',
    risk_score: 88,
  },
  {
    id: 'RSK-002',
    risk_category: 'PRODUCT',
    category_label: 'ریسک کیفیت محصول',
    entity_id: 'LOT-202504-113068',
    entity_name: 'لات تولیدی نخ POY گرید 06 (PRD-POY-001)',
    risk_title: 'انحراف استحکام کششی زیر حد استاندارد (Tensile Strength: 2.85)',
    severity: 'Critical',
    probability_pct: 90,
    financial_impact: 65000000,
    evidence: [
      'نتایج آزمون QMS نشان‌دهنده پارگی فیلامنت بیش از حد نرمال است.',
      'شکایت‌های CMP-0001 و CMP-0004 دقیقاً به این لات متصل هستند.',
    ],
    recommended_action: 'توقف ارسال باقی‌مانده لات (۱۸ تن در انبار) و مصرف در محصولات درجه ۲',
    risk_score: 92,
  },
  {
    id: 'RSK-003',
    risk_category: 'CUSTOMER',
    category_label: 'ریسک مالی و اعتباری',
    entity_id: 'C_535756',
    entity_name: 'بافندگی پرنیان مشهد',
    risk_title: 'واخواست چک‌ها و تاخیر پرداخت بیش از ۳۸ روز',
    severity: 'High',
    probability_pct: 80,
    financial_impact: 38000000,
    evidence: [
      '۲ فقره چک برگشتی ثبت‌شده در سامانه ERP_COLLECTIONS',
      'سقف اعتبار ۵۰ میلیون ریالی پر شده است',
    ],
    recommended_action: 'قفل اعتبار سیستمی و تبدیل به تسویه نقدی همراه با پیگیری واحد حقوقی',
    risk_score: 91,
  },
  {
    id: 'RSK-004',
    risk_category: 'COMMERCIAL',
    category_label: 'ریسک تجاری و رقابتی',
    entity_id: 'Product_Family_05',
    entity_name: 'خانواده کالایی ۰۵ (نخ‌های تابیده)',
    risk_title: 'افت حاشیه سود به ۷.۸٪ ناشی از فشار قیمت رقبای داخلی',
    severity: 'Medium',
    probability_pct: 65,
    financial_impact: 45000000,
    evidence: [
      'افت ۱۱٪ در فروش کل این خانواده در ۳ ماه اخیر',
      'افزایش بهای تمام‌شده تحقق‌یافته به ۹۱٪ نرخ فروش',
    ],
    recommended_action: 'کاهش تیراژ تولید خانواده ۰۵ و تمرکز بر خانواده‌های سودده ۰۱ و ۰۴',
    risk_score: 68,
  },
];

// ==========================================
// 10. SYSTEM SETTINGS & DATA GOVERNANCE
// ==========================================
export const COPAN_SETTINGS_DATA = {
  data_sources: [
    { name: 'ERP Sales (سیستم فروش و فاکتورها)', status: 'Connected', last_sync: 'امروز، ۱۰ دقیقه پیش', records_count: 52987, coverage_pct: 100, health: 'Optimal' },
    { name: 'CRM Activities (تعاملات و پیگیری‌ها)', status: 'Connected', last_sync: 'امروز، ۱۵ دقیقه پیش', records_count: 4184, coverage_pct: 98.5, health: 'Optimal' },
    { name: 'QMS Complaints (شکایات و آزمون کیفیت)', status: 'Connected', last_sync: 'امروز، ۱ ساعت پیش', records_count: 520, coverage_pct: 96.2, health: 'Optimal' },
    { name: 'ERP Collections (وصول و اعتبارات)', status: 'Connected', last_sync: 'امروز، ۳۰ دقیقه پیش', records_count: 15652, coverage_pct: 99.1, health: 'Optimal' },
    { name: 'Market 3C (سیگنال‌های بازار و رقبا)', status: 'Connected', last_sync: 'دیروز، ساعت ۱۸:۰۰', records_count: 130, coverage_pct: 94.0, health: 'Warning' },
    { name: 'PLM Requests (درخواست‌های توسعه محصول)', status: 'Connected', last_sync: 'امروز، ۳ ساعت پیش', records_count: 800, coverage_pct: 95.0, health: 'Optimal' },
    { name: 'Costing Plan (بهای تمام‌شده و بودجه)', status: 'Connected', last_sync: 'هفته گذشته', records_count: 8546, coverage_pct: 100, health: 'Optimal' },
  ],
  report_schedules: [
    { id: 'REP-W', frequency: 'هفتگی (Weekly)', title: 'گزارش پایش ریسک‌های هفتگی و اولویت‌های اقدام', recipients: 'مدیر فروش، کارشناسان فروش، مدیرعامل', last_sent: '۱۴۰۴/۱۲/۰۱', next_run: '۱۴۰۴/۱۲/۰۸', status: 'Active' },
    { id: 'REP-M', frequency: 'ماهانه (Monthly)', title: 'گزارش جامع عملکرد تجاری، سهم سبد و حاشیه سود', recipients: 'هیئت مدیره، مدیر مالی، مدیر کارخانه', last_sent: '۱۴۰۴/۱۱/۳۰', next_run: '۱۴۰۴/۱۲/۲۹', status: 'Active' },
    { id: 'REP-3M', frequency: 'سه ماهه (3 Months)', title: 'تحلیل جامع رقبا، روند بازار و رتبه‌بندی RFM مشتریان', recipients: 'مدیران ارشد', last_sent: '۱۴۰۴/۰۹/۳۰', next_run: '۱۴۰۴/۱۲/۲۹', status: 'Active' },
    { id: 'REP-6M', frequency: 'شش ماهه (6 Months)', title: 'ارزیابی اثربخشی تصمیمات هوش مصنوعی و نرخ تحقق فرصت‌ها', recipients: 'تیم راهبری COPAN', last_sent: '۱۴۰۴/۰۶/۳۱', next_run: '۱۴۰۴/۱۲/۲۹', status: 'Active' },
    { id: 'REP-1Y', frequency: 'سالانه (Yearly)', title: 'کتابچه جامع هوش تجاری و استراتژی فروش سالانه', recipients: 'سهامداران و مدیران ارشد', last_sent: '۱۴۰۳/۱۲/۲۸', next_run: '۱۴۰۴/۱۲/۲۸', status: 'Active' },
  ],
  ai_settings: {
    risk_threshold_critical: 80,
    risk_threshold_high: 60,
    opportunity_threshold_high: 75,
    installment_profit_bonus_pct: 4.0, // Strict 4% rule
    llm_provider: 'COBAT Agentic Decision Engine v2.0 (DeepSeek + DuckDB Semantic Layer)',
    auto_nba_generation: true,
    strict_evidence_mode: true,
    notification_channels: ['In-App Badge', 'Telegram Bot', 'SMS Alert for P0'],
  },
};

// ==========================================
// 11. DETAILED CUSTOMER 360 GENERATOR
// ==========================================
export function getDetailedCustomer360(customerId: string) {
  const base = COPAN_CUSTOMERS.find((c) => c.customer_id === customerId) || COPAN_CUSTOMERS[0];
  
  // Calculate Profitability with 4% installment formula
  const cashRevenue = base.lifetime_revenue * ((100 - base.installment_share_pct) / 100);
  const installmentRevenue = base.lifetime_revenue * (base.installment_share_pct / 100);
  const baseMargin = base.avg_gross_margin_pct / 100;
  
  // Installment purchase adds specified 4% consideration
  const cashProfit = cashRevenue * baseMargin;
  const installmentProfit = installmentRevenue * (baseMargin + 0.04);
  const totalGrossProfit = cashProfit + installmentProfit;
  const netProfit = totalGrossProfit * 0.72; // Deducting SGA and tax
  const effectiveGrossMarginPct = (totalGrossProfit / base.lifetime_revenue) * 100;
  const effectiveNetMarginPct = (netProfit / base.lifetime_revenue) * 100;

  return {
    customer_id: base.customer_id,
    customer_name: base.customer_name,
    customer_segment: base.customer_segment,
    location_id: base.location_id,
    location_name: base.location_name,
    sales_rep_id: base.sales_rep_id,
    sales_rep_name: base.sales_rep_name,
    health_status: base.health_status,
    risk_score: base.risk_score,
    opportunity_score: base.opportunity_score,
    rfm_score: base.rfm_score,
    rfm_segment: base.rfm_segment,
    lifetime_revenue: base.lifetime_revenue,
    revenue_trend_pct: base.revenue_trend_pct,
    last_purchase_date: base.last_purchase_date,
    last_interaction_date: base.last_interaction_date,
    avg_gross_margin_pct: base.avg_gross_margin_pct,
    avg_nafis_share_pct: base.avg_nafis_share_pct,
    
    // Overview Section
    overview: {
      ai_summary: `مشتری ${base.customer_name} در سگمنت ${base.customer_segment} با حجم فروش تجمعی ${(base.lifetime_revenue / 1000000).toFixed(0)} میلیون ریال است. در دوره‌های اخیر ${base.revenue_trend_pct < 0 ? `افت ${Math.abs(base.revenue_trend_pct)}٪ در حجم سفارشات` : `رشد ${base.revenue_trend_pct}٪ در فروش`} ثبت شده است. سهم خرید از نفیس ${base.avg_nafis_share_pct}٪ بوده و رقیب اصلی در این حساب ${base.main_competitor} است.`,
      commercial_health_score: 100 - base.risk_score,
      key_signals: [
        `سهم خرید از سبد: ${base.avg_nafis_share_pct}٪ (${base.avg_nafis_share_pct < 35 ? 'سهم پایین / فرصت تصاحب' : 'سهم بالا / نگهداری حساب'})`,
        `تعداد کل شکایات ثبت‌شده: ${base.total_complaints} مورد (${base.high_severity_complaints} مورد با شدت بحرانی)`,
        `وضعیت تسویه مالی: میانگین تاخیر ${base.avg_delay_days} روز با ${base.bounced_checks_count} فقره چک برگشتی`,
        `سهم خرید اعتباری/اقساطی: ${base.installment_share_pct}٪ (محاسبه سود با احتساب نرخ ۴٪ مصوب)`,
      ],
    },

    // Sales History
    sales_monthly: [
      { month: '۱۴۰۴/۰۷', revenue: base.lifetime_revenue * 0.14, quantity: 8200, gross_profit: base.lifetime_revenue * 0.14 * (base.avg_gross_margin_pct / 100), avg_margin_pct: base.avg_gross_margin_pct },
      { month: '۱۴۰۴/۰۸', revenue: base.lifetime_revenue * 0.16, quantity: 9400, gross_profit: base.lifetime_revenue * 0.16 * (base.avg_gross_margin_pct / 100), avg_margin_pct: base.avg_gross_margin_pct },
      { month: '۱۴۰۴/۰۹', revenue: base.lifetime_revenue * 0.18, quantity: 10500, gross_profit: base.lifetime_revenue * 0.18 * (base.avg_gross_margin_pct / 100), avg_margin_pct: base.avg_gross_margin_pct },
      { month: '۱۴۰۴/۱۰', revenue: base.lifetime_revenue * 0.17, quantity: 9800, gross_profit: base.lifetime_revenue * 0.17 * (base.avg_gross_margin_pct / 100), avg_margin_pct: base.avg_gross_margin_pct },
      { month: '۱۴۰۴/۱۱', revenue: base.lifetime_revenue * 0.18, quantity: 10200, gross_profit: base.lifetime_revenue * 0.18 * (base.avg_gross_margin_pct / 100), avg_margin_pct: base.avg_gross_margin_pct },
      { month: '۱۴۰۴/۱۲', revenue: base.lifetime_revenue * 0.17, quantity: 9900, gross_profit: base.lifetime_revenue * 0.17 * (base.avg_gross_margin_pct / 100), avg_margin_pct: base.avg_gross_margin_pct },
    ],

    // Financial & Collections
    financial: {
      credit_limit: 80000000,
      outstanding_amount: base.bounced_checks_count > 0 ? 38000000 : 18500000,
      avg_delay_days: base.avg_delay_days,
      max_delay_days: base.avg_delay_days + 15,
      bounced_checks_count: base.bounced_checks_count,
      payment_behavior: base.bounced_checks_count > 0 ? 'پرریسک / نیازمند وثیقه' : base.avg_delay_days > 20 ? 'تأخیر متوسط' : 'بسیار خوش‌حساب',
      recent_invoices: [
        { invoice_no: 'T_285604', date: '۱۴۰۴/۱۱/۱۸', amount: 34500000, due_date: '۱۴۰۴/۱۲/۰۳', status: 'تسویه شده', delay_days: base.avg_delay_days },
        { invoice_no: 'T_286190', date: '۱۴۰۴/۱۱/۲۸', amount: 28000000, due_date: '۱۴۰۴/۱۲/۱۳', status: 'در جریان وصول', delay_days: 0 },
        { invoice_no: 'T_287410', date: '۱۴۰۴/۱۲/۰۸', amount: 18500000, due_date: '۱۴۰۴/۱۲/۲۳', status: 'سررسید نشده', delay_days: 0 },
      ],
    },

    // Complaints & Quality
    complaints: [
      {
        id: 'CMP-0001',
        title: 'پرز شدید نخ و پارگی فیلامنت در فرایند بافت',
        text: 'نخ در برخی دوک‌ها سیمی بوده و پرزدهی شدید در ماشین بافندگی ایجاد کرده است. در صورت تکرار مشتری اعلام قطع همکاری نموده است.',
        severity: base.high_severity_complaints > 0 ? 'زیاد' : 'متوسط',
        created_at: '۱۴۰۴/۱۱/۲۰',
        status: 'پذیرفته‌شده / در حال اصلاح',
        resolved_at: '۱۴۰۴/۱۲/۰۲',
        product_id: 'PRD-POY-001 (Product_Family_03)',
        lot_id: 'LOT-202504-113068',
        lab_result: 'رد در آزمون کشش و یکنواختی CV (Tensile: 2.85, CV: 1.45%)',
        resolution_text: 'مقرر گردید تا زمان رفع مشکل خط تولید، کلیه محصولات این لات در داخل شرکت مصرف شده و از ارسال برای مشتری خودداری شود.',
      },
      {
        id: 'CMP-0002',
        title: 'خرابی دوک و آسیب‌دیدگی رزرو نخ',
        text: 'استفاده از دوک‌های تیغ‌خورده و کثیفی در قسمت رزرو نخ باعث افت راندمان تغذیه ماشین گردیده است.',
        severity: 'متوسط',
        created_at: '۱۴۰۴/۱۰/۱۵',
        status: 'مختومه',
        resolved_at: '۱۴۰۴/۱۰/۲۵',
        product_id: 'PRD-POY-006',
        lot_id: 'LOT-202410-073300',
        lab_result: 'تعویض محموله دوک‌های تأمین‌کننده خارجی',
        resolution_text: 'محموله معیوب جایگزین گردید و فرآیند بازرسی ورودی دوک‌ها تشدید شد.',
      },
    ],

    // Interactions
    interactions: [
      { id: 'INT-001', type: 'جلسه حضوری', date: '۱۴۰۴/۱۲/۰۲', rep: base.sales_rep_name, summary: 'جلسه با مدیر کارخانه پیرامون بررسی کیفیت نخ‌های ارسالی و برنامه تولید بهار', next_action: 'ارائه پیشنهاد قیمت جدید' },
      { id: 'INT-002', type: 'تماس تلفنی', date: '۱۴۰۴/۱۱/۲۵', rep: base.sales_rep_name, summary: 'پیگیری وصول فاکتور و اعلام رضایت نسبی از سرعت بارگیری', next_action: 'بدون اقدام' },
      { id: 'INT-003', type: 'صورتجلسه قیمت', date: '۱۴۰۴/۱۱/۱۰', rep: base.sales_rep_name, summary: 'مذاکره بر سر درصد تخفیف نقدی و سهمیه سالانه', next_action: 'جلسه هیئت مدیره' },
    ],

    // Commercial Offers
    offers: [
      { id: 'OFF-0000002', date: '۱۴۰۴/۱۱/۲۸', product_family: 'Product_Family_03', base_price: 680000, offered_price: 665000, discount_pct: 2.2, validity_days: 15, status: 'در حال مذاکره' },
      { id: 'OFF-0000001', date: '۱۴۰۴/۰۹/۱۰', product_family: 'Product_Family_01', base_price: 520000, offered_price: 495000, discount_pct: 4.8, validity_days: 30, status: 'پذیرفته‌شده / بسته شد' },
    ],

    // Purchased Products
    products: [
      { product_id: 'PRD-POY-001', name: 'Product_Family_03 / Denier_Subgroup_01 / Luster_Class_02', volume_kg: 24500, revenue: base.lifetime_revenue * 0.45, trend: '-12%' },
      { product_id: 'PRD-POY-006', name: 'Product_Family_01 / Denier_Subgroup_04 / Luster_Class_01', volume_kg: 18200, revenue: base.lifetime_revenue * 0.35, trend: '+18%' },
      { product_id: 'PRD-DTY-004', name: 'Product_Family_04 / Denier_Subgroup_03 / Color_Class_03', volume_kg: 9800, revenue: base.lifetime_revenue * 0.20, trend: '+5%' },
    ],

    // AI Insights
    ai_insights: {
      patterns: [
        'سفارشات معمولاً در دهه دوم هر ماه شمسی پس از واریز مطالبات بافندگان ثبت می‌شود.',
        'حساسیت مشتری به کیفیت پرز نخ بسیار بالاتر از حساسیت قیمتی است.',
      ],
      risks: [
        `ریزش سهم سبد به میزان ${Math.abs(base.revenue_trend_pct)}٪ در ماه‌های اخیر.`,
        `فعالیت رقیب ${base.main_competitor} در این حساب با ارائه تخفیف‌های نقدی.`,
      ],
      opportunities: [
        `پتانسیل افزایش فروش ماهانه تا ۳۰ تن در صورت تایید نخ‌های گرید بدون پرز.`,
        `سودآوری بالاتر در فروش اقساطی به دلیل بهره‌مندی از فرمول سود ۴٪ مصوب.`,
      ],
      recommendations: [
        'اعزام کارشناس فنی جهت کالیبراسیون دستگاه‌های بافندگی مشتری',
        'عقد قرارداد سالانه با تثبیت قیمت و تضمین پارگی زیر ۱ در ۱۰۰ هزار متر',
      ],
    },

    // Profitability with 4% Installment Formula
    profitability: {
      total_revenue: base.lifetime_revenue,
      cash_revenue: cashRevenue,
      installment_revenue: installmentRevenue,
      installment_share_pct: base.installment_share_pct,
      base_margin_pct: base.avg_gross_margin_pct,
      installment_bonus_rule: 'طبق ضوابط مالی، خرید‌های اقساطی مشمول ۴٪ حاشیه سود بیشتر (۴.۰٪ Profit Consideration) محاسبه می‌شوند.',
      cash_gross_profit: cashProfit,
      installment_gross_profit: installmentProfit,
      total_gross_profit: totalGrossProfit,
      net_profit: netProfit,
      gross_margin_pct: effectiveGrossMarginPct,
      net_margin_pct: effectiveNetMarginPct,
    },

    // Returns
    returns: {
      returned_quantity_kg: base.high_severity_complaints > 0 ? 380 : 0,
      returned_value: base.high_severity_complaints > 0 ? 2580000 : 0,
      return_rate_pct: base.high_severity_complaints > 0 ? 1.5 : 0.0,
      defective_products: base.high_severity_complaints > 0 ? ['PRD-POY-001 (لات LOT-202504-113068)'] : [],
      reasons: base.high_severity_complaints > 0 ? ['پرز شدید و پارگی مکرر در خط بافت'] : ['بدون مرجوعی در دوره جاری'],
    },

    // Risks & Opportunities
    risks_opportunities: {
      active_risks: [
        { title: 'افت سهم سبد و نارضایتی کیفی', severity: base.risk_score > 70 ? 'بحرانی' : 'متوسط', probability: `${base.risk_score}٪`, impact: `${(base.lifetime_revenue * 0.35 / 1000000).toFixed(0)} میلیون ریال` },
        { title: 'ریسک نوسان دوره وصول', severity: base.avg_delay_days > 20 ? 'بالا' : 'عادی', probability: '۴۵٪', impact: `${base.bounced_checks_count > 0 ? '۳۸' : '۱۸'} میلیون ریال` },
      ],
      active_opportunities: [
        { title: 'تصاحب سهم رقیب در خطوط تریکو', probability: `${base.opportunity_score}٪`, impact: `${(base.lifetime_revenue * 0.4 / 1000000).toFixed(0)} میلیون ریال` },
        { title: 'فروش گریدهای سوپربرایت با حاشیه سود بالا', probability: '۸۰٪', impact: '۴۵ میلیون ریال' },
      ],
    },

    // RFM Analysis
    rfm: {
      recency_days: 12,
      frequency_orders: 18,
      monetary_value: base.lifetime_revenue,
      rfm_score: base.rfm_score,
      rfm_segment: base.rfm_segment,
      explanation: 'شاخص RFM نشان‌دهنده موقعیت تجاری حساب در ماتریس ارزش مشتریان است.',
    },

    // Next Best Action
    nba: {
      priority: base.risk_score > 70 ? 'Critical (بحرانی)' : base.opportunity_score > 80 ? 'High (بالا)' : 'Medium (متوسط)',
      contact_deadline: 'ظرف ۳ روز آینده',
      expected_impact: base.risk_score > 70 ? 'جلوگیری از ریزش سالانه ۱۲۰ میلیون ریال درآمد' : 'افزایش درآمد فصلی به میزان ۸۵ میلیون ریال',
      recommended_action: base.latest_next_action,
      rationale: `حساب ${base.customer_name} با شاخص ریسک ${base.risk_score} و پتانسیل ${base.opportunity_score} نیازمند مداخله مستقیم است.`,
    },

    // Evidence & Trust
    evidence_and_trust: {
      risk_score_factors: [
        { factor: 'افت روند خرید در مقایسه با دوره قبل', value: `${base.revenue_trend_pct}%`, weight: '35%', confidence: 'High (قطعی - برگرفته از ERP Sales)' },
        { factor: 'تعداد شکایات باز و تکراری', value: `${base.total_complaints} مورد`, weight: '25%', confidence: 'High (ثبت در QMS)' },
        { factor: 'میانگین تاخیر در وصول فاکتورها', value: `${base.avg_delay_days} روز`, weight: '20%', confidence: 'High (ERP Collections)' },
        { factor: 'کاهش سهم سبد و نفوذ رقیب', value: `سهم فعلی ${base.avg_nafis_share_pct}%`, weight: '20%', confidence: 'Medium (سیگنال میدانی CRM)' },
      ],
      overall_confidence: '۹۴٪ (پشتیبانی‌شده با داده‌های قطعی اردیبهشت و اسفند ۱۴۰۴)',
    },
  };
}

// ==========================================
// 12. COBAT AI CONTEXTUAL RESPONSES & GENERATOR
// ==========================================
export interface CobatMessage {
  id: string;
  sender: 'user' | 'cobat';
  text: string;
  timestamp: string;
  context_page?: string;
  customer_id?: string;
  data_payload?: {
    kpis?: Array<{ label: string; value: string; trend?: 'UP' | 'DOWN'; delta?: string }>;
    table?: { headers: string[]; rows: (string | number)[][] };
    evidence?: string[];
    risk_badge?: { label: string; severity: 'Critical' | 'High' | 'Medium' | 'Low' };
    recommended_action?: { title: string; deadline: string; impact: string; action_id: string };
  };
}

export function generateCobatResponse(query: string, context?: { page?: string; customerId?: string }): CobatMessage {
  const customer = context?.customerId ? COPAN_CUSTOMERS.find(c => c.customer_id === context.customerId) : null;
  const q = query.trim().toLowerCase();

  // 1. Customer-specific query
  if (customer || q.includes('این مشتری') || q.includes('چرا پرریسک') || q.includes('سبلان') || q.includes('cust-008')) {
    const target = customer || COPAN_CUSTOMERS[0];
    return {
      id: 'cobat-' + Date.now(),
      sender: 'cobat',
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      context_page: context?.page || 'customer_360',
      customer_id: target.customer_id,
      text: `### تحلیل وضعیت هوشمند حساب: **${target.customer_name}** (${target.customer_id})

با بررسی پایگاه داده یکپارچه فروش، مالی، کیفی و تعاملات CRM، تحلیل چندبعدی این مشتری به شرح زیر است:

**۱. دلیل اصلی قرارگیری در وضعیت پرریسک (${target.risk_score}/۱۰۰):**
حجم سفارشات در ۶۰ روز گذشته **${Math.abs(target.revenue_trend_pct)}٪ کاهش** یافته است. همزمان، **${target.total_complaints} فقره شکایت کیفی** ثبت شده که شکایت مربوط به پرز نخ هنوز در وضعیت اقدام معلق است.

**۲. بررسی سودآوری با فرمول اقساط:**
فروش کل تجمعی **${(target.lifetime_revenue / 1000000).toFixed(0)} میلیون ریال** با حاشیه سود پایه **${target.avg_gross_margin_pct}٪** بوده که با اعمال نرخ ۴٪ خرید اقساطی، بازدهی ناخالص به **${(target.avg_gross_margin_pct + 1.8).toFixed(1)}٪** می‌رسد.

**۳. تهدید رقیب:**
رقیب **${target.main_competitor}** سهم سبد خود را از این مشتری به **${100 - target.avg_nafis_share_pct}٪** رسانده است.`,
      data_payload: {
        risk_badge: { label: `شاخص ریسک: ${target.risk_score}/۱۰۰ (بحرانی)`, severity: 'Critical' },
        evidence: [
          `افت خرید دوره‌ای: ${target.revenue_trend_pct}٪`,
          `ثبت ${target.total_complaints} شکایت کیفی در سامانه QMS`,
          `میانگین تأخیر وصول: ${target.avg_delay_days} روز`,
          `سهم سبد خرید از نفیس: ${target.avg_nafis_share_pct}٪`,
        ],
        kpis: [
          { label: 'فروش تجمعی', value: `${(target.lifetime_revenue / 1000000).toFixed(0)} م.ر` },
          { label: 'روند فروش', value: `${target.revenue_trend_pct}%`, trend: 'DOWN', delta: 'افت شدید' },
          { label: 'حاشیه سود', value: `${target.avg_gross_margin_pct}%` },
          { label: 'سهم سبد', value: `${target.avg_nafis_share_pct}%` },
        ],
        recommended_action: {
          title: 'هماهنگی جلسه اضطراری مدیر فروش با مدیر فنی کارخانه ظرف ۴۸ ساعت',
          deadline: '۱۴۰۴/۱۲/۱۵',
          impact: 'حفظ سالانه ۱۲۰ میلیون ریال درآمد و بازیابی سهم سبد به ۵۰٪',
          action_id: 'ACT-001',
        },
      },
    };
  }

  // 2. Risk query
  if (q.includes('ریسک') || q.includes('خطر') || q.includes('افت') || q.includes('بدتر')) {
    return {
      id: 'cobat-' + Date.now(),
      sender: 'cobat',
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      context_page: 'risks_alerts',
      text: `### گزارش پایش هوشمند حساب‌های در معرض ریسک ریزش (Spot Deterioration)

بر اساس ماتریس ریسک چندبعدی COPAN، در حال حاضر **۳۸ مشتری در معرض خطر** شناسایی شده‌اند که **۸ مشتری در وضعیت فوق‌بحرانی (P0)** قرار دارند:

1. **صنایع نساجی سبلان پارچه (CUST-008):** شاخص ریسک ۸۸/۱۰۰ | افت خرید ۳۴.۵٪ | ۲ شکایت باز کیفی پرز نخ
2. **بافندگی پرنیان مشهد (C_535756):** شاخص ریسک ۹۱/۱۰۰ | ۲ فقره چک برگشتی | ۳۸ روز تأخیر وصول
3. **نساجی تار و پود اصفهان (C_683666):** شاخص ریسک ۸۴/۱۰۰ | افت ۷۵.۵٪ خرید به دلیل معلق ماندن درخواست فنی
4. **ریسندگی ممتاز سمنان (CUST-015):** شاخص ریسک ۷۲/۱۰۰ | انحراف تست کشش در لات LOT-202504-113068

📌 **بینش کلیدی:** ۶۳٪ از افت فروش اخیر در ۱۲ مشتری کلیدی سگمنت A متمرکز است. حل سریع شکایات کیفی و تعدیل شرایط اعتباری اولویت اصلی امروز است.`,
      data_payload: {
        table: {
          headers: ['مشتری', 'سگمنت', 'شاخص ریسک', 'علت اصلی', 'اقدام پیشنهادی'],
          rows: [
            ['سبلان پارچه (CUST-008)', 'A', '۸۸', 'شکایت پرز + نفوذ رقیب X', 'جلسه اضطراری در اردبیل'],
            ['پرنیان مشهد (C_535756)', 'B', '۹۱', '۲ چک برگشتی + ۳۸ روز تاخیر', 'قفل اعتبار و اخطار حقوقی'],
            ['تار و پود اصفهان (C_683666)', 'A', '۸۴', 'توقف سفارش ناشی از عدم پیگیری R&D', 'ارسال محموله نمونه جدید'],
            ['تریکو البرز ۲ (C_633661)', 'A', '۷۹', 'نارضایتی از کیفیت تحویل', 'اعزام کارشناس فنی'],
          ],
        },
        evidence: [
          'استخراج از دیتابیس DuckDB بر پایه ترکیب فاکتورهای فروش، وصول، QMS و CRM',
          'عدم مشاهده سفارش جدید در بیش از ۴۰ روز در ۴ حساب استراتژیک',
        ],
        recommended_action: {
          title: 'تفویض وظایف پیگیری P0 به کارشناسان فروش مربوطه در داشبورد اقدامات',
          deadline: 'امروز، ساعت ۱۷:۰۰',
          impact: 'جلوگیری از سوخت ۲۸۰ میلیون ریال درآمد سالانه',
          action_id: 'ACT-BATCH-RISK',
        },
      },
    };
  }

  // 3. Opportunity query
  if (q.includes('فرصت') || q.includes('رشد') || q.includes('بهترین مشتری') || q.includes('سودآور')) {
    return {
      id: 'cobat-' + Date.now(),
      sender: 'cobat',
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      context_page: 'opportunities',
      text: `### فرصت‌های طلایی رشد و تصاحب سهم بازار (Growth Opportunities)

مدل پیش‌بین خرید و تحلیل سهم سبد COPAN، **۲۴ فرصت درآمدی با ارزش تخمینی ۸۹۰ میلیون ریال** کشف کرده است:

🎯 **۱. تریکو البرز (CUST-003) — پتانسیل تصاحب ۱۴۵ میلیون ریال:**
مشتری فوق‌العاده خوش‌حساب (میانگین تاخیر ۸ روز) با حاشیه سود ۱۸.۵٪؛ سهم فعلی ما ۲۲٪ است در حالی که رقیب X دچار تاخیر در ارسال شده است.

🎯 **۲. اطلس یزد (C_245948) — سررسید چرخه خرید ۱۱۰ میلیون ریال:**
۲۴ روز از آخرین خرید گذشته است (چرخه معمول: ۲۲ روز). احتمال خرید مجدد بالای ۹۲٪ است.

🎯 **۳. نساجی نگین بافت کاشان (C_937594) — تمدید قرارداد سالانه:**
رشد ۴۴.۵٪ با فروش ۳۶۰ میلیون ریال؛ پتانسیل تثبیت سهم انحصاری POY مات.`,
      data_payload: {
        table: {
          headers: ['مشتری', 'نوع فرصت', 'احتمال تحقق', 'درآمد بالقوه', 'استراتژی'],
          rows: [
            ['تریکو البرز (CUST-003)', 'تصاحب سهم رقیب X', '۸۸٪', '۱۴۵ م.ر', 'قرارداد ۶ ماهه با ۳٪ تخفیف'],
            ['اطلس یزد (C_245948)', 'سررسید دوره خرید', '۹۲٪', '۱۱۰ م.ر', 'پیش‌فاکتور تکرار سفارش فوری'],
            ['تار و پود اصفهان (C_683666)', 'احیای مشتری با نخ سفارشی', '۷۵٪', '۸۵ م.ر', 'ارسال ۵۰۰ کیلو نمونه تست'],
            ['بهارستان قزوین (C_948070)', 'توسعه سبد کالای مات', '۸۲٪', '۶۵ م.ر', 'سبد ترکیبی POY و DTY'],
          ],
        },
        kpis: [
          { label: 'ارزش کل پایپ‌لاین', value: '۸۹۰ م.ر', trend: 'UP', delta: '+۱۸٪' },
          { label: 'تعداد فرصت فعال', value: '۲۴ مورد' },
          { label: 'میانگین احتمال موفقیت', value: '۸۱٪' },
        ],
        recommended_action: {
          title: 'ارسال بسته پیشنهادی آفر ۳٪ تخفیف حجمی به شرکت تریکو البرز',
          deadline: '۱۴۰۴/۱۲/۱۸',
          impact: 'افزایش سهم سبد از ۲۲٪ به ۴۵٪ ظرف ۳۰ روز',
          action_id: 'ACT-003',
        },
      },
    };
  }

  // Default response
  return {
    id: 'cobat-' + Date.now(),
    sender: 'cobat',
    timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    context_page: context?.page || 'dashboard',
    text: `### تحلیل جامع هوش تجاری COPAN

پاسخ به سوال شما: «${query}»

بر اساس ارزیابی داده‌های یکپارچه، وضعیت تجاری سیستم در شرایط زیر است:
- **فروش کل دوره:** ۴.۴۲ میلیارد ریال (با حاشیه سود ترکیبی ۱۰.۱٪)
- **مهم‌ترین ریسک روز:** افت سفارشات در حساب‌های سگمنت A و ۲ پرونده شکایت باز در خط تولید ۳
- **مهم‌ترین اقدام فوری:** اعزام کارشناس فنی به کارخانه سبلان پارچه و تعیین تکلیف چک‌های پرنیان مشهد
- **فرصت کلیدی:** افزایش سهم سبد در شرکت تریکو البرز به دلیل ضعف خدمات رقیب X

برای بررسی دقیق‌تر، می‌توانید هر بخش را انتخاب کنید یا نام مشتری مورد نظرتان را بفرمایید.`,
    data_payload: {
      evidence: [
        'داده‌های تجمیعی فاکتورهای اردیبهشت تا اسفند ۱۴۰۴',
        'اتصال داده‌های آزمون کیفیت QMS به خطوط فروش و لات‌های کارخانه',
      ],
      kpis: [
        { label: 'فروش کل', value: '۴.۴۲ میلیارد ریال' },
        { label: 'مشتریان پرریسک', value: '۳۸ حساب' },
        { label: 'فرصت‌های فعال', value: '۲۴ پایپ‌لاین' },
      ],
    },
  };
}
