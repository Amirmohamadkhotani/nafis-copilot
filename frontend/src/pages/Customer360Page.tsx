import React, { useEffect, useState } from 'react';
import {
  Building2,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  CreditCard,
  Phone,
  FileText,
  Package,
  Lightbulb,
  Percent,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Bot,
  Zap,
  Search,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { PageId } from '../components/layout/Sidebar';
import { fetchCustomer360 } from '../api';
import type { Customer360Response, CustomerSignal, RecommendationType } from '../types';
import { QualityChainModal } from '../components/modals/QualityChainModal';
import { ActionModal } from '../components/modals/ActionModal';

import { useCopan } from '../context/CopanContext';
import { exportToCSV } from '../utils/exportUtils';
import { Download } from 'lucide-react';

interface Customer360PageProps {
  selectedCustomerId: string;
  onSelectCustomer?: (customerId: string) => void;
  onNavigate?: (page: PageId) => void;
  onOpenCobat: (prompt?: string) => void;
}

type TabKey =
  | 'overview'
  | 'sales'
  | 'financial'
  | 'complaints'
  | 'interactions'
  | 'offers'
  | 'products'
  | 'ai_insights'
  | 'profitability'
  | 'returns'
  | 'risks_opps'
  | 'rfm'
  | 'nba'
  | 'evidence_trust';

const UNAVAILABLE = 'داده کافی موجود نیست';

const RECOMMENDATION_LABELS: Record<RecommendationType, string> = {
  PROTECT_FIX: 'رفع ریسک پیش از توسعه فروش',
  GROW: 'فرصت توسعه فروش',
  REDUCE_FOCUS: 'بازبینی صرفه اقتصادی حساب',
};

const SIGNAL_LABELS: Record<CustomerSignal['type'], string> = {
  QUALITY_RISK: 'ریسک کیفیت',
  PAYMENT_RISK: 'ریسک پرداخت',
  GROWTH_SIGNAL: 'سیگنال فرصت رشد',
  PROFITABILITY_SIGNAL: 'سیگنال سودآوری',
};

const PRIORITY_LABELS: Record<string, string> = {
  Critical: 'بحرانی', High: 'بالا', Medium: 'متوسط', Low: 'پایین',
};

const METRIC_LABELS: Record<string, string> = {
  open_complaints: 'شکایت باز',
  open_complaint_count: 'شکایت باز',
  high_severity_complaints: 'شکایت با شدت بالا',
  high_severity_count: 'شکایت با شدت بالا',
  returned_checks: 'چک برگشتی',
  returned_check_count: 'چک برگشتی',
  complaint_linked_lab_rejections: 'رد آزمایشگاه مرتبط با شکایت',
  historical_wallet_share_pct: 'برآورد تاریخی سهم از سبد',
  historical_total_revenue: 'فروش تاریخی تجمعی',
  known_margin_pct: 'حاشیه سود شناخته‌شده',
  actual_cost_coverage_pct: 'پوشش هزینه واقعی',
  profitability_status: 'وضعیت سودآوری',
};

function signalTitle(signal: CustomerSignal): string {
  return `${SIGNAL_LABELS[signal.type]} (${signal.type})`;
}

function metricText(signal: CustomerSignal): string {
  const metrics = signal.metrics
    .map((metric) => `${METRIC_LABELS[metric.name] ?? metric.name}: ${metric.value ?? UNAVAILABLE}`)
    .join('، ');
  return metrics ? `${signalTitle(signal)} — ${metrics}` : signalTitle(signal);
}

function textField(record: Record<string, string | number | boolean | null>, key: string): string {
  const value = record[key];
  return typeof value === 'string' && value ? value : UNAVAILABLE;
}

function numberField(record: Record<string, string | number | boolean | null>, key: string): number {
  const value = record[key];
  return typeof value === 'number' ? value : Number.NaN;
}

function buildPresentationSignals(data: Customer360Response): CustomerSignal[] {
  const evidence = data.recommendation.evidence;
  const qualityMetrics = evidence
    .filter((item) => item.metric === 'open_complaint_count' || item.metric === 'high_severity_count')
    .map((item) => ({ name: item.metric, value: item.value, source: item.source }));
  const paymentMetrics = evidence
    .filter((item) => item.metric === 'returned_check_count')
    .map((item) => ({ name: item.metric, value: item.value, source: item.source }));
  const signals: CustomerSignal[] = [];
  if (qualityMetrics.length) signals.push({ type: 'QUALITY_RISK', severity: 'HIGH', title: 'Quality risk', metrics: qualityMetrics });
  if (paymentMetrics.length) signals.push({ type: 'PAYMENT_RISK', severity: 'HIGH', title: 'Payment risk', metrics: paymentMetrics });
  if (data.recommendation.suspended_opportunities.some((item) => item.recommendation_type === 'GROW')) {
    signals.push({ type: 'GROWTH_SIGNAL', severity: 'MEDIUM', title: 'Suspended growth opportunity', metrics: [] });
  }
  return signals;
}

function buildCustomer360ViewModel(data: Customer360Response) {
  const { profile, commercial, financial, recommendation } = data;
  const rfm = data.rfm;
  const signals = buildPresentationSignals(data);
  const lastInteraction = data.interactions[0];

  return {
    customer_id: data.customer_id,
    customer_name: profile.customer_name ?? UNAVAILABLE,
    customer_segment: profile.segment ?? UNAVAILABLE,
    location_name: profile.location ?? UNAVAILABLE,
    sales_rep_name: profile.sales_rep ?? UNAVAILABLE,
    last_purchase_date: commercial.last_invoice?.invoice_date ?? UNAVAILABLE,
    last_interaction_date: lastInteraction ? textField(lastInteraction, 'event_time') : UNAVAILABLE,
    lifetime_revenue: commercial.lifetime_revenue ?? Number.NaN,
    health_status: recommendation.recommendation_type ?? 'insufficient_evidence',
    rfm_score: rfm.available ? `${rfm.r_score}${rfm.f_score}${rfm.m_score}` : UNAVAILABLE,
    overview: {
      ai_summary: recommendation.summary ?? 'شواهد کافی برای پیشنهاد اقدام وجود ندارد.',
      key_signals: signals.map(metricText),
    },
    sales_monthly: [],
    financial: {
      credit_limit: financial.credit_limit ?? Number.NaN,
      outstanding_amount: financial.outstanding_amount ?? Number.NaN,
      avg_delay_days: financial.median_payment_delay_days ?? Number.NaN,
      bounced_checks_count: financial.returned_check_count,
      recent_invoices: commercial.last_invoice ? [{
        invoice_no: commercial.last_invoice.invoice_number ?? UNAVAILABLE,
        date: commercial.last_invoice.invoice_date ?? UNAVAILABLE,
        amount: commercial.last_invoice.amount ?? Number.NaN,
        due_date: UNAVAILABLE,
        delay_days: UNAVAILABLE,
        status: UNAVAILABLE,
      }] : [],
    },
    complaints: data.complaints.map((item) => ({
      id: textField(item, 'complaint_id'), title: textField(item, 'title'),
      severity: textField(item, 'severity'), text: textField(item, 'text'),
      product_id: textField(item, 'product_id'), lot_id: UNAVAILABLE,
      lab_result: UNAVAILABLE, resolution_text: textField(item, 'resolution'),
    })),
    interactions: data.interactions.map((item) => ({
      id: textField(item, 'interaction_id'), type: textField(item, 'interaction_type'),
      date: textField(item, 'event_time'), summary: textField(item, 'summary'),
      next_action: textField(item, 'next_action'),
    })),
    offers: data.offers.map((item) => ({
      id: textField(item, 'offer_id'), date: textField(item, 'offer_date'),
      product_family: textField(item, 'product_group'), base_price: numberField(item, 'base_price_per_unit'),
      offered_price: numberField(item, 'offered_price_per_unit'),
      discount_pct: numberField(item, 'discount_pct') * 100, status: textField(item, 'result'),
    })),
    products: data.products.map((item) => ({
      name: textField(item, 'description'), product_id: textField(item, 'product_id'),
      volume_kg: numberField(item, 'purchased_quantity'), trend: UNAVAILABLE,
    })),
    ai_insights: {
      patterns: signals.map(metricText),
      recommendations: recommendation.next_best_action ? [recommendation.next_best_action] : [],
    },
    returns: {
      returned_quantity_kg: Number.NaN,
      returned_value: Number.NaN,
      return_rate_pct: Number.NaN,
      reasons: [],
    },
    risks_opportunities: {
      active_risks: signals.filter((signal) => signal.type === 'QUALITY_RISK' || signal.type === 'PAYMENT_RISK').map((signal) => ({
        title: signalTitle(signal),
        severity: signal.severity,
        probability: UNAVAILABLE,
        impact: metricText(signal),
      })),
      active_opportunities: signals.filter((signal) => signal.type === 'GROWTH_SIGNAL').map((signal) => ({
        title: signalTitle(signal),
        probability: signal.severity,
        impact: metricText(signal),
      })),
    },
    rfm: {
      recency_days: rfm.available ? rfm.recency : Number.NaN,
      frequency_orders: rfm.available ? rfm.frequency : Number.NaN,
      monetary_value: rfm.available ? rfm.monetary : Number.NaN,
      rfm_segment: rfm.available ? rfm.segment : UNAVAILABLE,
    },
    nba: {
      recommended_action: recommendation.next_best_action ?? UNAVAILABLE,
      priority: recommendation.priority ?? UNAVAILABLE,
      rationale: recommendation.summary ?? UNAVAILABLE,
      expected_impact: UNAVAILABLE,
      contact_deadline: UNAVAILABLE,
    },
    evidence_and_trust: {
      risk_score_factors: recommendation.evidence.map((item) => ({
        factor: item.metric,
        value: item.value ?? UNAVAILABLE,
        weight: item.evidence_type,
        confidence: `${item.source} — ${item.note}`,
      })),
      overall_confidence: recommendation.confidence,
    },
  };
}

function formatNumber(value: number, suffix = ''): string {
  return Number.isFinite(value) ? `${value.toLocaleString('fa-IR')}${suffix}` : UNAVAILABLE;
}

function formatMillions(value: number, digits = 0): string {
  return Number.isFinite(value) ? `${(value / 1_000_000).toFixed(digits)} م.ر` : UNAVAILABLE;
}

export const Customer360Page: React.FC<Customer360PageProps> = ({
  selectedCustomerId,
  onSelectCustomer,
  onOpenCobat,
}) => {
  const { customers, setSelectedCustomerId } = useCopan();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  // Customer search & switcher state
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Modals
  const [qualityModalOpen, setQualityModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);

  const [customer360Data, setCustomer360Data] = useState<Customer360Response | null>(null);
  const [customer360Error, setCustomer360Error] = useState<string | null>(null);
  const [isCustomer360Loading, setIsCustomer360Loading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    setIsCustomer360Loading(true);
    setCustomer360Error(null);

    fetchCustomer360(selectedCustomerId)
      .then((response) => {
        if (isCurrent) setCustomer360Data(response);
      })
      .catch((error: unknown) => {
        if (!isCurrent) return;
        setCustomer360Data(null);
        setCustomer360Error(
          error instanceof Error ? error.message : 'دریافت اطلاعات مشتری ناموفق بود.',
        );
      })
      .finally(() => {
        if (isCurrent) setIsCustomer360Loading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [selectedCustomerId, reloadToken]);

  if (
    isCustomer360Loading ||
    (customer360Data !== null && customer360Data.customer_id !== selectedCustomerId)
  ) {
    return (
      <div className="copan-card min-h-[320px] flex flex-col items-center justify-center gap-3">
        <RotateCcw size={26} className="animate-spin text-[var(--gold)]" />
        <span className="text-[13px] font-bold text-[var(--text-dim)]">
          در حال دریافت نمای هوشمند مشتری...
        </span>
      </div>
    );
  }

  if (customer360Error || !customer360Data) {
    return (
      <div className="copan-card min-h-[320px] flex flex-col items-center justify-center gap-3 text-center">
        <AlertTriangle size={28} className="text-[var(--risk)]" />
        <div className="font-bold text-[var(--text)]">اطلاعات مشتری بارگذاری نشد</div>
        <div className="text-[12px] text-[var(--text-faint)]">{customer360Error ?? UNAVAILABLE}</div>
        <button
          type="button"
          className="copan-btn copan-btn-secondary"
          onClick={() => setReloadToken((value) => value + 1)}
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  const c360 = buildCustomer360ViewModel(customer360Data);
  const recommendation = customer360Data.recommendation;
  const allSignals = buildPresentationSignals(customer360Data);
  const recommendationLabel = recommendation.recommendation_type
    ? RECOMMENDATION_LABELS[recommendation.recommendation_type]
    : UNAVAILABLE;
  const priorityLabel = recommendation.priority
    ? `${PRIORITY_LABELS[recommendation.priority]} (${recommendation.priority})`
    : UNAVAILABLE;
  const walletShare = recommendation.evidence.find((item) => item.metric === 'historical_wallet_share_pct')?.value;
  const knownMargin = recommendation.evidence.find((item) => item.metric === 'known_margin_pct')?.value;
  const costCoverage = recommendation.evidence.find((item) => item.metric === 'actual_cost_coverage_pct')?.value;
  const profitabilityStatus = recommendation.evidence.find((item) => item.metric === 'profitability_status')?.value;

  // Selection handlers
  const handleSelect = (id: string) => {
    if (onSelectCustomer) {
      onSelectCustomer(id);
    }
    setSelectedCustomerId(id);
    setShowSearchDropdown(false);
    setCustomerSearchQuery('');
  };

  const currentIndex = customers.findIndex((c) => c.customer_id === selectedCustomerId);
  const handlePrevCustomer = () => {
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : customers.length - 1;
    handleSelect(customers[prevIdx].customer_id);
  };
  const handleNextCustomer = () => {
    const nextIdx = currentIndex < customers.length - 1 ? currentIndex + 1 : 0;
    handleSelect(customers[nextIdx].customer_id);
  };

  const filteredCustomers = customerSearchQuery.trim()
    ? customers.filter(
        (c) =>
          c.customer_name.toLowerCase().includes(customerSearchQuery.trim().toLowerCase()) ||
          c.customer_id.toLowerCase().includes(customerSearchQuery.trim().toLowerCase()) ||
          c.location_name.toLowerCase().includes(customerSearchQuery.trim().toLowerCase())
      ).slice(0, 8)
    : [];
  const quickKeyCustomers = customers.slice(0, 8).map((customer) => ({
    id: customer.customer_id,
    name: customer.customer_name === UNAVAILABLE ? customer.customer_id : customer.customer_name,
  }));

  const handleExportReport = () => {
    const headers = ['بخش تحلیل', 'شاخص', 'مقدار'];
    const rows = [
      ['اطلاعات پایه', 'نام مشتری', c360.customer_name],
      ['اطلاعات پایه', 'کد مشتری', c360.customer_id],
      ['اطلاعات پایه', 'سگمنت', c360.customer_segment],
      ['فروش', 'فروش کل تجمعی', formatMillions(c360.lifetime_revenue)],
      ['سودآوری', 'حاشیه سود شناخته‌شده', typeof knownMargin === 'number' ? `${knownMargin}%` : UNAVAILABLE],
      ['سودآوری', 'پوشش هزینه واقعی', typeof costCoverage === 'number' ? `${costCoverage}%` : UNAVAILABLE],
      ['پیشنهاد', 'نوع پیشنهاد', recommendation.recommendation_type ?? UNAVAILABLE],
      ['پیشنهاد', 'اولویت', recommendation.priority ?? UNAVAILABLE],
      ['NBA', 'اقدام بعدی', c360.nba.recommended_action],
      ['NBA', 'اثر مورد انتظار', c360.nba.expected_impact],
    ];
    exportToCSV(`COPAN_Profile360_${c360.customer_id}`, headers, rows);
  };

  const TABS: Array<{ id: TabKey; label: string; icon: any }> = [
    { id: 'overview', label: 'نمای کلی و سلامت', icon: Building2 },
    { id: 'sales', label: 'فروش و روند', icon: TrendingUp },
    { id: 'financial', label: 'مالی و وصول', icon: CreditCard },
    { id: 'complaints', label: 'شکایات و کیفیت', icon: ShieldAlert },
    { id: 'interactions', label: 'تعاملات CRM', icon: Phone },
    { id: 'offers', label: 'آفرها و پیشنهادها', icon: FileText },
    { id: 'products', label: 'محصولات و سبد', icon: Package },
    { id: 'ai_insights', label: 'بینش‌های هوشمند', icon: Lightbulb },
    { id: 'profitability', label: 'سودآوری و اقساط', icon: Percent },
    { id: 'returns', label: 'مرجوعی‌ها', icon: RotateCcw },
    { id: 'risks_opps', label: 'ریسک‌ها و فرصت‌ها', icon: AlertTriangle },
    { id: 'rfm', label: 'تحلیل RFM', icon: Layers },
    { id: 'nba', label: 'اقدام بعدی (NBA)', icon: Zap },
    { id: 'evidence_trust', label: 'شواهد و اعتماد', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* ==========================================
          0. CUSTOMER SEARCH & SWITCHER BAR
          ========================================== */}
      <div className="copan-card p-3.5 space-y-3 bg-[var(--panel)] border border-[var(--hair)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Right: Search Box + Dropdown */}
          <div className="flex items-center gap-2.5 flex-1 flex-wrap">
            {/* Search Input with Live Dropdown */}
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <div className="flex items-center bg-[var(--panel-2)] border border-[var(--hair-strong)] rounded-xl px-3 py-2 focus-within:border-[var(--gold)] transition-colors">
                <Search size={16} className="text-[var(--text-faint)] shrink-0 ml-2" />
                <input
                  type="text"
                  placeholder="جستجوی سریع مشتری ۳۶۰° (نام، کد یا شهر)..."
                  value={customerSearchQuery}
                  onChange={(e) => {
                    setCustomerSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  className="bg-transparent border-none text-[12.5px] text-[var(--text)] focus:outline-none w-full placeholder:text-[var(--text-faint)]"
                />
                {customerSearchQuery && (
                  <button
                    onClick={() => {
                      setCustomerSearchQuery('');
                      setShowSearchDropdown(false);
                    }}
                    className="p-1 text-[var(--text-faint)] hover:text-[var(--text)] cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Autocomplete Search Dropdown */}
              {showSearchDropdown && filteredCustomers.length > 0 && (
                <div className="absolute top-full right-0 mt-1.5 w-full bg-[var(--panel)] border border-[var(--hair-strong)] rounded-xl shadow-2xl z-50 p-2 space-y-1 max-h-72 overflow-y-auto">
                  <div className="px-2 py-1 text-[11px] font-bold text-[var(--text-faint)] flex items-center justify-between">
                    <span>نتایج منطبق ({filteredCustomers.length})</span>
                    <span>انتخاب برای نمایش ۳۶۰°</span>
                  </div>
                  {filteredCustomers.map((cust) => (
                    <button
                      key={cust.customer_id}
                      onClick={() => handleSelect(cust.customer_id)}
                      className={`w-full text-right p-2 rounded-lg flex items-center justify-between text-[12px] transition-colors cursor-pointer ${
                        cust.customer_id === selectedCustomerId
                          ? 'bg-[var(--gold-soft)] border border-[var(--gold)]/30 text-[var(--text)] font-bold'
                          : 'hover:bg-[var(--panel-2)] text-[var(--text)]'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{cust.customer_name}</div>
                        <div className="text-[10.5px] text-[var(--text-faint)] font-mono">
                          {cust.customer_id} • {cust.location_name} • سگمنت {cust.customer_segment}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          cust.health_status === 'At Risk'
                            ? 'bg-[var(--risk-soft)] text-[var(--risk)]'
                            : cust.health_status === 'Needs Attention'
                            ? 'bg-[var(--gold-soft)] text-[var(--gold)]'
                            : 'bg-[var(--positive-soft)] text-[var(--positive)]'
                        }`}
                      >
                        {cust.health_status === 'At Risk' ? 'در معرض ریزش' : cust.health_status === 'Needs Attention' ? 'نیازمند توجه' : 'سالم'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick <select> Dropdown */}
            <div className="flex items-center gap-1.5 bg-[var(--panel-2)] border border-[var(--hair)] px-3 py-2 rounded-xl text-[12px]">
              <UserCheck size={15} className="text-[var(--gold)] shrink-0" />
              <span className="text-[var(--text-faint)] text-[11.5px] whitespace-nowrap">انتخاب از لیست:</span>
              <select
                value={selectedCustomerId}
                onChange={(e) => handleSelect(e.target.value)}
                className="bg-transparent font-bold text-[var(--text)] border-none focus:outline-none cursor-pointer max-w-[180px] truncate text-[12px]"
              >
                {customers.map((c) => (
                  <option key={c.customer_id} value={c.customer_id} className="bg-[var(--panel)] text-[var(--text)]">
                    {c.customer_name} ({c.customer_id}) - سگمنت {c.customer_segment}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Left: Previous / Next Navigation */}
          <div className="flex items-center gap-1.5 shrink-0 self-end md:self-auto">
            <span className="text-[11px] text-[var(--text-faint)] ml-1">
              حساب {currentIndex >= 0 ? currentIndex + 1 : 1} از {customers.length}
            </span>
            <button
              onClick={handlePrevCustomer}
              className="copan-btn copan-btn-secondary copan-btn-sm text-[11.5px] font-bold flex items-center gap-1 cursor-pointer"
              title="مشتری قبلی"
            >
              <ChevronRight size={14} />
              <span>قبلی</span>
            </button>
            <button
              onClick={handleNextCustomer}
              className="copan-btn copan-btn-secondary copan-btn-sm text-[11.5px] font-bold flex items-center gap-1 cursor-pointer"
              title="مشتری بعدی"
            >
              <span>بعدی</span>
              <ChevronLeft size={14} />
            </button>
          </div>
        </div>

        {/* Quick Access Account Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1.5 border-t border-[var(--hair)] text-[11px]">
          <span className="text-[var(--text-faint)] shrink-0 font-medium">دسترسی سریع به حساب‌های کلیدی:</span>
          {quickKeyCustomers.map((q) => {
            const isSelected = q.id === selectedCustomerId;
            return (
              <button
                key={q.id}
                onClick={() => handleSelect(q.id)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--gold)] text-[#0e1c12] shadow-xs'
                    : 'bg-[var(--panel-2)] text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--panel-3)] border border-[var(--hair)]'
                }`}
              >
                {q.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ==========================================
          TOP SUMMARY HEADER (CLEAN & MINIMAL)
          ========================================== */}
      <div className="copan-card space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--hair)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--panel-2)] border border-[var(--hair-strong)] flex items-center justify-center text-[var(--gold)] shrink-0">
              <Building2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-extrabold text-[17px] text-[var(--text)]">
                  {c360.customer_name}
                </h2>
                <span className="copan-badge badge-neutral font-mono text-[11px]">
                  {c360.customer_id}
                </span>
                <span
                  className={`copan-badge ${
                    c360.customer_segment === 'A'
                      ? 'badge-gold'
                      : c360.customer_segment === 'B'
                      ? 'badge-brand'
                      : 'badge-neutral'
                  }`}
                >
                  سگمنت {c360.customer_segment}
                </span>
                <span
                  className={`copan-badge ${
                    c360.health_status === 'PROTECT_FIX'
                      ? 'badge-risk'
                      : c360.health_status === 'GROW'
                      ? 'badge-positive'
                      : 'badge-neutral'
                  }`}
                >
                  {recommendationLabel}
                </span>
                <span className="copan-badge badge-neutral font-mono text-[10px]">
                  {recommendation.recommendation_type ?? 'insufficient_evidence'}
                </span>
              </div>
              <div className="text-[12px] text-[var(--text-dim)] mt-1 flex items-center gap-3 flex-wrap font-medium">
                <span>موقعیت: <b className="text-[var(--text)]">{c360.location_name}</b></span>
                <span>• کارشناس: <b className="text-[var(--text)]">{c360.sales_rep_name}</b></span>
                <span>• آخرین فاکتور: <b className="font-mono text-[var(--text)]">{c360.last_purchase_date}</b></span>
                <span>• آخرین تعامل: <b className="font-mono text-[var(--text)]">{c360.last_interaction_date}</b></span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportReport}
              className="copan-btn copan-btn-secondary text-[12px]"
              title="دریافت گزارش تفصیلی حساب"
            >
              <Download size={14} />
              خروجی اکسل
            </button>
            <button
              onClick={() =>
                onOpenCobat(
                  `تحلیل کامل چندبعدی حساب ${c360.customer_name} (${c360.customer_id}) و پیشنهاد بهترین اقدام بعدی`
                )
              }
              className="copan-btn copan-btn-gold text-[12px] font-bold"
            >
              <Bot size={14} />
              تحلیل COBAT
            </button>
            <button
              onClick={() => setActionModalOpen(true)}
              className="copan-btn copan-btn-primary text-[12px] font-bold"
            >
              <Zap size={14} />
              اجرای NBA
            </button>
          </div>
        </div>

        {/* Top Mini KPI Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-right">
          <div className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)]">
            <div className="text-[11.5px] font-semibold text-[var(--text-dim)]">فروش تجمعی</div>
            <div className="font-mono font-extrabold text-[15px] text-[var(--text)] mt-0.5">
              {formatMillions(c360.lifetime_revenue)}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)]">
            <div className="text-[11.5px] font-semibold text-[var(--text-dim)]">اولویت پیشنهاد</div>
            <div className="font-mono font-extrabold text-[15px] mt-0.5 flex items-center gap-1">
              <span className="text-[var(--risk)]">{priorityLabel}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)]">
            <div className="text-[11.5px] font-semibold text-[var(--text-dim)]">ریسک‌های مسدودکننده</div>
            <div className="font-mono font-extrabold text-[15px] text-[var(--risk)] mt-0.5">
              {recommendation.blocking_risks.length.toLocaleString('fa-IR')}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)]">
            <div className="text-[11.5px] font-semibold text-[var(--text-dim)]">برآورد تاریخی سهم از سبد</div>
            <div className="font-mono font-extrabold text-[15px] text-[var(--gold)] mt-0.5">
              {typeof walletShare === 'number' ? `${walletShare.toLocaleString('fa-IR')}٪` : UNAVAILABLE}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)]">
            <div className="text-[11.5px] font-semibold text-[var(--text-dim)]">رتبه RFM</div>
            <div className="font-mono font-extrabold text-[15px] text-[var(--gold)] mt-0.5">
              {c360.rfm_score}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)]">
            <div className="text-[11.5px] font-semibold text-[var(--text-dim)]">وضعیت شواهد سودآوری</div>
            <div className="font-mono font-extrabold text-[15px] text-[var(--positive)] mt-0.5">
              {profitabilityStatus === 'actual' && costCoverage === 100 ? 'واقعی؛ پوشش ۱۰۰٪' : profitabilityStatus === 'partial' ? 'پوشش جزئی' : UNAVAILABLE}
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          IN-PAGE 14 TABS NAVIGATION (CLEAN & MINIMAL)
          ========================================== */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[var(--hair)] text-[12px]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-[10px] text-[12px] font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-[var(--panel-2)] text-[var(--gold)] border border-[var(--hair-strong)] shadow-xs'
                  : 'text-[var(--text-dim)] hover:bg-[var(--panel-2)] hover:text-[var(--text)]'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-[var(--gold)]' : 'text-[var(--text-faint)]'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ==========================================
          TAB CONTENTS
          ========================================== */}
      <div className="space-y-6">
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 copan-card space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[var(--hair)]">
                <Bot size={18} className="text-[var(--gold)]" />
                <h3 className="font-extrabold text-[15px] text-[var(--text)]">
                  خلاصه مدیریتی مبتنی بر داده
                </h3>
              </div>
              <div className="text-[13px] text-[var(--text-dim)] leading-relaxed bg-[var(--panel-2)] p-4 rounded-xl border border-[var(--hair)] space-y-3">
                <div><b className="text-[var(--text)]">چه چیزی می‌بینیم؟</b><p>{allSignals.length ? allSignals.map(metricText).join('؛ ') : UNAVAILABLE}</p></div>
                <div><b className="text-[var(--text)]">چرا مهم است؟</b><p>{recommendationLabel}{recommendation.suspended_opportunities.length ? '؛ فرصت رشد موجود است اما تا رفع ریسک مسدودکننده تعلیق شده است.' : ''}</p></div>
                <div><b className="text-[var(--text)]">اقدام بعدی چیست؟</b><p>{recommendation.next_best_action ?? UNAVAILABLE}</p></div>
              </div>

              <div className="space-y-2">
                <div className="text-[12px] font-bold text-[var(--text)]">سیگنال‌های کلیدی شناسایی‌شده:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {c360.overview.key_signals.map((sig, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] text-[12px] text-[var(--text)] flex items-start gap-2"
                    >
                      <CheckCircle2 size={15} className="text-[var(--gold)] shrink-0 mt-0.5" />
                      <span>{sig}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Health Radar & Next Best Action Box */}
            <div className="copan-card space-y-4 flex flex-col justify-between">
              <div>
                <div className="pb-3 border-b border-[var(--hair)] flex items-center justify-between">
                  <span className="font-extrabold text-[14px] text-[var(--text)]">اقدام بعدی هوشمند (NBA)</span>
                  <span className="copan-badge badge-risk text-[10px]">{priorityLabel}</span>
                </div>
                <div className="mt-3 p-3.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair-strong)] space-y-2">
                  <div className="font-bold text-[13px] text-[var(--text)] leading-snug">
                    {recommendationLabel}
                  </div>
                  <div className="text-[11px] text-[var(--text-dim)] font-medium">{c360.nba.recommended_action}</div>
                  <div className="text-[10.5px] text-[var(--text-faint)] font-mono">type: {recommendation.recommendation_type ?? UNAVAILABLE}</div>
                </div>
              </div>

              <button
                onClick={() => setActionModalOpen(true)}
                className="copan-btn copan-btn-primary w-full py-2.5 text-[12.5px] font-bold"
              >
                تأیید و اجرای NBA
              </button>
            </div>
          </div>
        )}

        {/* 2. SALES TAB */}
        {activeTab === 'sales' && (
          <div className="copan-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--hair)]">
              <div>
                <h3 className="font-extrabold text-[15px] text-[var(--text)]">
                  سوابق و روند خرید ماهانه مشتری
                </h3>
                <p className="text-[11.5px] text-[var(--text-faint)]">
                  تحلیل ۶ ماهه ارزش فروش، حجم سفارش و حاشیه سود
                </p>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={c360.sales_monthly} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(244, 241, 227, 0.08)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-faint)" tick={{ fontSize: 11, fill: 'var(--text-faint)' }} />
                  <YAxis
                    stroke="var(--text-faint)"
                    tick={{ fontSize: 11, fill: 'var(--text-faint)' }}
                    tickFormatter={(v) => `${(v / 1000000).toFixed(0)} م.ر`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--panel)',
                      borderColor: 'var(--hair-strong)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      direction: 'rtl',
                    }}
                  />
                  <Bar dataKey="revenue" name="فروش ماهانه (ریال)" fill="var(--gold)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="gross_profit" name="سود ناخالص (ریال)" fill="var(--brand)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 3. FINANCIAL TAB */}
        {activeTab === 'financial' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="copan-kpi">
                <div className="text-[11px] text-[var(--text-faint)]">سقف اعتبار مصوب</div>
                <div className="font-mono font-bold text-[18px] text-[var(--text)] mt-1">
                  {formatMillions(c360.financial.credit_limit)}
                </div>
              </div>
              <div className="copan-kpi">
                <div className="text-[11px] text-[var(--text-faint)]">مانده بدهی در جریان</div>
                <div className="font-mono font-bold text-[18px] text-[var(--gold)] mt-1">
                  {formatMillions(c360.financial.outstanding_amount)}
                </div>
              </div>
              <div className="copan-kpi">
                <div className="text-[11px] text-[var(--text-faint)]">میانگین تاخیر وصول</div>
                <div className="font-mono font-bold text-[18px] text-[var(--text)] mt-1">
                  {formatNumber(c360.financial.avg_delay_days, ' روز')}
                </div>
              </div>
              <div className="copan-kpi">
                <div className="text-[11px] text-[var(--text-faint)]">چک‌های برگشتی</div>
                <div className="font-mono font-bold text-[18px] text-[var(--risk)] mt-1">
                  {formatNumber(c360.financial.bounced_checks_count, ' فقره')}
                </div>
              </div>
            </div>

            <div className="copan-card space-y-3">
              <div className="font-bold text-[14px] text-[var(--text)]">فاکتورهای اخیر و وضعیت تسویه</div>
              <div className="overflow-x-auto rounded-xl border border-[var(--hair)]">
                <table className="copan-table">
                  <thead>
                    <tr>
                      <th>شماره فاکتور</th>
                      <th>تاریخ صدور</th>
                      <th>مبلغ فاکتور (م.ر)</th>
                      <th>تاریخ سررسید</th>
                      <th>روز تأخیر</th>
                      <th>وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c360.financial.recent_invoices.map((inv, idx) => (
                      <tr key={idx}>
                        <td className="font-mono font-bold text-[var(--text)]">{inv.invoice_no}</td>
                        <td className="font-mono">{inv.date}</td>
                        <td className="font-mono font-bold text-[var(--text)]">
                          {(inv.amount / 1000000).toFixed(1)}
                        </td>
                        <td className="font-mono">{inv.due_date}</td>
                        <td className="font-mono">{inv.delay_days} روز</td>
                        <td>
                          <span
                            className={`copan-badge ${
                              inv.status === 'تسویه شده' ? 'badge-positive' : 'badge-gold'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. COMPLAINTS TAB */}
        {activeTab === 'complaints' && (
          <div className="copan-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--hair)]">
              <div>
                <h3 className="font-extrabold text-[15px] text-[var(--text)]">
                  پرونده‌های شکایت کیفی و ردیابی لات تولیدی
                </h3>
                <p className="text-[11.5px] text-[var(--text-faint)]">
                  پیوند مستقیم شکایت مشتری با آزمون‌های آزمایشگاه کنترل کیفیت QMS
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {c360.complaints.map((cmp) => (
                <div
                  key={cmp.id}
                  className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[13.5px] text-[var(--text)]">{cmp.title}</span>
                      <span className="font-mono text-[11px] text-[var(--text-faint)]">({cmp.id})</span>
                    </div>
                    <span
                      className={`copan-badge ${cmp.severity === 'زیاد' ? 'badge-risk' : 'badge-gold'}`}
                    >
                      شدت: {cmp.severity}
                    </span>
                  </div>

                  <p className="text-[12px] text-[var(--text-dim)] leading-relaxed">{cmp.text}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11.5px] p-3 rounded-lg bg-[var(--panel-3)]/60 border border-[var(--hair)]">
                    <div>کالای مربوطه: <b>{cmp.product_id}</b></div>
                    <div>شناسه لات تولیدی: <b className="font-mono">{cmp.lot_id}</b></div>
                    <div>نتیجه آزمایشگاه: <b className="text-[var(--risk)]">{cmp.lab_result}</b></div>
                    <div>اقدام انجام‌شده: <b>{cmp.resolution_text}</b></div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setQualityModalOpen(true)}
                      className="copan-btn copan-btn-secondary copan-btn-sm text-[11.5px] flex items-center gap-1"
                    >
                      <Layers size={13} />
                      ردیابی کامل زنجیره کیفیت تا آزمون QMS
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. INTERACTIONS TAB */}
        {activeTab === 'interactions' && (
          <div className="copan-card space-y-4">
            <div className="font-extrabold text-[15px] text-[var(--text)] pb-3 border-b border-[var(--hair)]">
              تاریخچه تعاملات، جلسات و تماس‌های CRM
            </div>

            <div className="space-y-3">
              {c360.interactions.map((int) => (
                <div key={int.id} className="p-3.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-1.5 text-right">
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="font-bold text-[var(--gold)]">{int.type}</span>
                    <span className="font-mono text-[var(--text-faint)]">{int.date}</span>
                  </div>
                  <p className="text-[12px] text-[var(--text)] leading-relaxed">{int.summary}</p>
                  <div className="text-[11px] text-[var(--positive)] font-medium pt-1 border-t border-[var(--hair)]">
                    اقدام بعدی مقرر: {int.next_action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. OFFERS TAB */}
        {activeTab === 'offers' && (
          <div className="copan-card space-y-4">
            <div className="font-extrabold text-[15px] text-[var(--text)] pb-3 border-b border-[var(--hair)]">
              پیشنهادهای قیمت و آفرهای تجاری (Commercial Offers)
            </div>

            <div className="overflow-x-auto rounded-xl border border-[var(--hair)]">
              <table className="copan-table">
                <thead>
                  <tr>
                    <th>کد پیشنهاد</th>
                    <th>تاریخ</th>
                    <th>خانواده کالا</th>
                    <th>قیمت پایه (ریال)</th>
                    <th>قیمت پیشنهادی (ریال)</th>
                    <th>تخفیف ٪</th>
                    <th>وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {c360.offers.map((off) => (
                    <tr key={off.id}>
                      <td className="font-mono font-bold text-[var(--text)]">{off.id}</td>
                      <td className="font-mono">{off.date}</td>
                      <td>{off.product_family}</td>
                      <td className="font-mono">{off.base_price.toLocaleString('fa-IR')}</td>
                      <td className="font-mono font-bold text-[var(--text)]">
                        {off.offered_price.toLocaleString('fa-IR')}
                      </td>
                      <td className="font-mono text-[var(--gold)]">{off.discount_pct}٪</td>
                      <td>
                        <span
                          className={`copan-badge ${
                            off.status.includes('پذیرفته') ? 'badge-positive' : 'badge-gold'
                          }`}
                        >
                          {off.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="copan-card space-y-4">
            <div className="font-extrabold text-[15px] text-[var(--text)] pb-3 border-b border-[var(--hair)]">
              محصولات خریداری‌شده و تفکیک خانواده‌های کالایی
            </div>

            <div className="space-y-3">
              {c360.products.map((p, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="font-bold text-[13px] text-[var(--text)]">{p.name}</div>
                    <div className="text-[11px] text-[var(--text-faint)] font-mono">{p.product_id}</div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-[10px] text-[var(--text-faint)]">حجم بارگیری</div>
                      <div className="font-mono font-bold text-[12.5px] text-[var(--text)]">
                        {p.volume_kg.toLocaleString('fa-IR')} کیلوگرم
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[var(--text-faint)]">روند تقاضا</div>
                      <div className={`font-mono font-bold text-[12.5px] ${p.trend.startsWith('+') ? 'text-[var(--positive)]' : 'text-[var(--risk)]'}`}>
                        {p.trend}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. AI INSIGHTS TAB */}
        {activeTab === 'ai_insights' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="copan-card space-y-3">
              <div className="font-bold text-[14px] text-[var(--gold)] flex items-center gap-1.5 pb-2 border-b border-[var(--hair)]">
                <Lightbulb size={16} />
                الگوها و رفتارهای کشف‌شده
              </div>
              <ul className="space-y-2 text-[12px] text-[var(--text-dim)]">
                {c360.ai_insights.patterns.map((pat, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)]">
                    • {pat}
                  </li>
                ))}
              </ul>
            </div>

            <div className="copan-card space-y-3">
              <div className="font-bold text-[14px] text-[var(--brand-light)] flex items-center gap-1.5 pb-2 border-b border-[var(--hair)]">
                <Sparkles size={16} />
                توصیه‌های عملیاتی راهبری
              </div>
              <ul className="space-y-2 text-[12px] text-[var(--text-dim)]">
                {c360.ai_insights.recommendations.map((rec, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] text-[var(--positive)]">
                    ✓ {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 9. PROFITABILITY TAB */}
        {activeTab === 'profitability' && (
          <div className="copan-card space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--hair)]">
              <div>
                <h3 className="font-extrabold text-[15px] text-[var(--text)]">
                  وضعیت شواهد سودآوری
                </h3>
                <p className="text-[11.5px] text-[var(--text-faint)]">
                  حاشیه سود فقط در محدوده پوشش هزینه واقعی تفسیر می‌شود.
                </p>
              </div>
              <span className="copan-badge badge-gold font-mono text-[11px]">
                status: {profitabilityStatus ?? 'insufficient'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] text-right">
                <div className="text-[11px] text-[var(--text-faint)]">وضعیت سودآوری</div>
                <div className="font-mono font-bold text-[18px] text-[var(--text)] mt-1">
                  {profitabilityStatus === 'actual' ? 'واقعی' : profitabilityStatus === 'partial' ? 'جزئی' : UNAVAILABLE}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] text-right">
                <div className="text-[11px] text-[var(--text-faint)]">پوشش هزینه واقعی</div>
                <div className="font-mono font-bold text-[18px] text-[var(--gold)] mt-1">
                  {typeof costCoverage === 'number' ? `${costCoverage.toLocaleString('fa-IR')}٪` : UNAVAILABLE}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] text-right">
                <div className="text-[11px] text-[var(--text-faint)]">حاشیه سود شناخته‌شده</div>
                <div className="font-mono font-bold text-[18px] text-[var(--text)] mt-1">
                  {typeof knownMargin === 'number' ? `${knownMargin.toLocaleString('fa-IR')}٪` : UNAVAILABLE}
                </div>
                {typeof knownMargin === 'number' && !(profitabilityStatus === 'actual' && costCoverage === 100) && (
                  <div className="text-[10px] text-[var(--risk)] mt-1">این عدد حاشیه سود کل مشتری نیست؛ پوشش هزینه کامل نیست.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 10. RETURNS TAB */}
        {activeTab === 'returns' && (
          <div className="copan-card space-y-4">
            <div className="font-extrabold text-[15px] text-[var(--text)] pb-3 border-b border-[var(--hair)]">
              سوابق مرجوعی‌ها و ضایعات کالا (Returns Analysis)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)]">
                <div className="text-[11px] text-[var(--text-faint)]">مقدار مرجوعی کل</div>
                <div className="font-mono font-bold text-[18px] text-[var(--text)] mt-1">
                  {formatNumber(c360.returns.returned_quantity_kg, ' کیلوگرم')}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)]">
                <div className="text-[11px] text-[var(--text-faint)]">ارزش ریالی مرجوعی</div>
                <div className="font-mono font-bold text-[18px] text-[var(--risk)] mt-1">
                  {formatMillions(c360.returns.returned_value, 1)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)]">
                <div className="text-[11px] text-[var(--text-faint)]">نرخ مرجوعی دوره‌ای</div>
                <div className="font-mono font-bold text-[18px] text-[var(--gold)] mt-1">
                  {formatNumber(c360.returns.return_rate_pct, '٪')}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-2 text-[12px]">
              <div className="font-bold text-[var(--text)]">علل ثبت‌شده مرجوعی:</div>
              <ul className="list-disc list-inside space-y-1 text-[var(--text-dim)]">
                {c360.returns.reasons.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 11. RISKS & OPPORTUNITIES TAB */}
        {activeTab === 'risks_opps' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="copan-card space-y-3">
              <div className="font-bold text-[14px] text-[var(--risk)] flex items-center gap-1.5 pb-2 border-b border-[var(--hair)]">
                <AlertTriangle size={16} />
                ریسک‌های فعال حساب
              </div>
              <div className="space-y-2">
                {c360.risks_opportunities.active_risks.map((r, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-1 text-[12px]">
                    <div className="flex justify-between font-bold text-[var(--text)]">
                      <span>{r.title}</span>
                      <span className="copan-badge badge-risk">{r.severity}</span>
                    </div>
                    <div className="text-[11px] text-[var(--text-faint)] flex justify-between">
                      <span>احتمال: {r.probability}</span>
                      <span>اثر مالی: {r.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="copan-card space-y-3">
              <div className="font-bold text-[14px] text-[var(--brand-light)] flex items-center gap-1.5 pb-2 border-b border-[var(--hair)]">
                <Sparkles size={16} />
                فرصت‌های رشد و سهم سبد
              </div>
              <div className="space-y-2">
                {c360.risks_opportunities.active_opportunities.map((o, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-1 text-[12px]">
                    <div className="flex justify-between font-bold text-[var(--text)]">
                      <span>{o.title}</span>
                      <span className="copan-badge badge-positive">{o.probability}</span>
                    </div>
                    <div className="text-[11px] text-[var(--text-faint)] flex justify-between">
                      <span>درآمد بالقوه:</span>
                      <b className="font-mono text-[var(--text)]">{o.impact}</b>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 12. RFM TAB */}
        {activeTab === 'rfm' && (
          <div className="copan-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--hair)] gap-3 flex-wrap">
              <div className="font-extrabold text-[15px] text-[var(--text)]">تحلیل ماتریس RFM (Recency, Frequency, Monetary)</div>
              <span className="copan-badge badge-neutral text-[10px]">لنز رفتاری؛ خارج از منطق تصمیم NBA</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)]">
                <div className="text-[11px] text-[var(--text-faint)]">فاصله آخرین خرید (Recency)</div>
                <div className="font-mono font-bold text-[18px] text-[var(--text)] mt-1">
                  {formatNumber(c360.rfm.recency_days, ' روز پیش')}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)]">
                <div className="text-[11px] text-[var(--text-faint)]">تعداد کل سفارشات (Frequency)</div>
                <div className="font-mono font-bold text-[18px] text-[var(--text)] mt-1">
                  {formatNumber(c360.rfm.frequency_orders, ' فاکتور')}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)]">
                <div className="text-[11px] text-[var(--text-faint)]">ارزش کل خرید (Monetary)</div>
                <div className="font-mono font-bold text-[18px] text-[var(--gold)] mt-1">
                  {formatMillions(c360.rfm.monetary_value)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)]">
                <div className="text-[11px] text-[var(--text-faint)]">سگمنت رفتاری RFM</div>
                <div className="font-bold text-[14px] text-[var(--positive)] mt-1">
                  {c360.rfm.rfm_segment}
                </div>
                <div className="font-mono text-[10px] text-[var(--text-faint)] mt-1">R/F/M: {c360.rfm_score}</div>
              </div>
            </div>
          </div>
        )}

        {/* 13. NBA TAB */}
        {activeTab === 'nba' && (
          <div className="copan-card space-y-4">
            <div className="font-extrabold text-[15px] text-[var(--text)] pb-3 border-b border-[var(--hair)]">
              اقدام بعدی هوشمند (Next Best Action)
            </div>

            <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--gold)]/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[14px] text-[var(--text)]">
                  {recommendationLabel}
                </span>
                <div className="flex items-center gap-2"><span className="copan-badge badge-neutral font-mono">{recommendation.recommendation_type ?? UNAVAILABLE}</span><span className="copan-badge badge-risk">{priorityLabel}</span></div>
              </div>
              <p className="text-[12.5px] text-[var(--text-dim)] leading-relaxed">
                {c360.nba.rationale}
              </p>
              <div className="pt-2 border-t border-[var(--hair)] text-[11.5px]"><b>اقدام:</b> {c360.nba.recommended_action}</div>
              {recommendation.suspended_opportunities.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[var(--gold-soft)] text-[var(--gold)] text-[11.5px]">
                  فرصت {RECOMMENDATION_LABELS[item.recommendation_type]} فعلاً تعلیق شده است، چون ریسک مسدودکننده وجود دارد. <span className="font-mono">({item.status})</span> {item.note}
                </div>
              ))}
            </div>

            <button
              onClick={() => setActionModalOpen(true)}
              className="copan-btn copan-btn-primary w-full py-2.5 text-[12.5px] font-bold"
            >
              صدور دستور اجرای اقدام
            </button>
          </div>
        )}

        {/* 14. EVIDENCE & TRUST TAB */}
        {activeTab === 'evidence_trust' && (
          <div className="copan-card space-y-4">
            <div className="font-extrabold text-[15px] text-[var(--text)] pb-3 border-b border-[var(--hair)]">
              مستندات و شواهد پشتیبان هوش مصنوعی (Evidence & Trust)
            </div>

            <div className="space-y-3">
              <div className="text-[12px] font-bold text-[var(--text)]">
                شواهد پشتیبان پیشنهاد:
              </div>

              {recommendation.evidence.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] text-[12px] grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3"
                >
                  <div>
                    <div className="font-bold text-[var(--text)]">{METRIC_LABELS[item.metric] ?? item.metric} <span className="font-mono text-[10px] text-[var(--text-faint)]">({item.metric})</span></div>
                    <div className="text-[10.5px] text-[var(--text-faint)] mt-1">یادداشت: {item.note || UNAVAILABLE}</div>
                  </div>
                  <div className="md:text-left space-y-1">
                    <div><span className="text-[var(--text-faint)]">مقدار:</span> <b className="font-mono text-[var(--text)]">{String(item.value ?? UNAVAILABLE)}</b></div>
                    <div className="text-[10.5px] text-[var(--text-faint)]">نوع: <span className="font-mono">{item.evidence_type}</span> • منبع: {item.source}</div>
                  </div>
                </div>
              ))}

              <div className="p-3.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] text-[12px] text-[var(--positive)] font-bold">
                ضریب اطمینان کلی تحلیل: {c360.evidence_and_trust.overall_confidence}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <QualityChainModal
        isOpen={qualityModalOpen}
        onClose={() => setQualityModalOpen(false)}
        customerName={c360.customer_name}
      />

      <ActionModal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        title={c360.nba.recommended_action}
        customerName={c360.customer_name}
        expectedImpact={c360.nba.expected_impact}
        onConfirm={() => {
          // Confirmed
        }}
      />
    </div>
  );
};
