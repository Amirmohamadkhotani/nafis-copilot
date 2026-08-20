import { useState } from 'react';
import {
  AlertTriangle, ShieldAlert,
  Calendar, CheckCircle2, ChevronRight, FileText,
  DollarSign, Package, CreditCard, Sparkles, Building2
} from 'lucide-react';
import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  ComposedChart
} from 'recharts';
import type { Customer360Data } from '../types';
import { formatPercent, formatNumber, formatDays } from '../utils/formatters';
import { getCustomerTradeName } from '../utils/customerNames';

interface Customer360Props {
  data: Customer360Data | null;
  customerId?: string;
  onBackToList?: () => void;
  onBack?: () => void;
  onOpenQualityModal?: (complaintId: string) => void;
  onInvestigateQuality?: (complaintId: string) => void;
  onOpenMeetingBrief?: (customerId: string) => void;
  onGenerateMeetingBrief?: (customerId: string) => void;
  onAskCopilot?: (prompt: string) => void;
}

export const Customer360 = ({
  data,
  customerId,
  onBackToList,
  onBack,
  onOpenQualityModal,
  onInvestigateQuality,
  onOpenMeetingBrief,
  onGenerateMeetingBrief,
  onAskCopilot,
}: Customer360Props) => {
  const [activeTab, setActiveTab] = useState<'contract_overview' | 'commercial' | 'profitability' | 'payment' | 'quality' | 'basket' | 'crm'>('contract_overview');

  const handleBack = onBack || onBackToList || (() => {});
  const handleQuality = onOpenQualityModal || onInvestigateQuality || (() => {});
  const handleBrief = onOpenMeetingBrief || onGenerateMeetingBrief || (() => {});

  if (!data) {
    return (
      <div className="p-8 text-center text-ink-muted text-xs flex flex-col items-center justify-center gap-3">
        <span className="w-4 h-4 rounded-full bg-brand animate-ping" />
        <span>در حال دریافت پرونده جامع مشتری ۳۶۰ ({customerId || ''})...</span>
      </div>
    );
  }

  const {
    profile,
    kpis,
    sales_monthly,
    product_breakdown,
    complaints,
    crm_history,
    payment_financials,
    basket_share,
    development_requests,
    next_best_action
  } = data;

  const isNegTrend = (kpis.revenue_trend_pct ?? 0) < 0;

  const healthBadge = {
    'At Risk': { cls: 'badge badge-risk-high', text: 'وضعیت: در معرض ریزش' },
    'Needs Attention': { cls: 'badge badge-risk-medium', text: 'وضعیت: نیازمند توجه' },
    Healthy: { cls: 'badge badge-risk-low', text: 'وضعیت: پایدار و سالم' },
  }[profile.health_status] || { cls: 'badge', text: profile.health_status || 'N/A' };

  const tabs = [
    { key: 'contract_overview', label: 'خلاصه پرونده (Contract 360)', icon: Sparkles },
    { key: 'commercial', label: 'تجاری و روند فروش', icon: DollarSign },
    { key: 'profitability', label: 'سودآوری و کالاها', icon: Package },
    { key: 'payment', label: 'وصول و مالی', icon: CreditCard },
    { key: 'quality', label: `کیفیت (${complaints.length})`, icon: ShieldAlert },
    { key: 'basket', label: 'سهم سبد و رقبا', icon: Building2 },
    { key: 'crm', label: 'CRM و R&D', icon: Calendar },
  ] as const;

  // Prepare chart data for Recharts
  const chartData = sales_monthly.map((s) => ({
    month: s.month ? s.month.slice(2) : 'N/A',
    revenue: Math.round(s.revenue / 1000), // in thousands
    quantity: s.quantity,
    marginPct: s.avg_margin_pct ? Number(s.avg_margin_pct.toFixed(1)) : 0,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Back + Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <button className="btn btn-sm btn-secondary" onClick={handleBack}>
          <ChevronRight size={14} />
          <span>بازگشت به لیست حساب‌ها</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <span>مسئول: {profile.sales_rep_id || 'N/A'}</span>
          <span>شروع رابطه: {profile.relationship_start_date || 'N/A'}</span>
          <button className="btn btn-sm btn-primary" onClick={() => handleBrief(profile.customer_id)}>
            <FileText size={14} />
            <span>مستند توجیهی جلسه</span>
          </button>
        </div>
      </div>

      {/* AI Account Executive Summary */}
      <div className="ai-brief-card">
        <div className="ai-brief-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge badge-brand text-mono font-extrabold" style={{ fontSize: '13px', padding: '6px 14px' }}>
              {profile.customer_id}
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '17px', fontWeight: 700 }}>{getCustomerTradeName(profile.customer_id)}</h2>
                <span className={healthBadge.cls}>{healthBadge.text}</span>
              </div>
              <span className="text-secondary" style={{ fontSize: '12px' }}>
                سگمنت: {profile.customer_segment || 'N/A'} | منطقه: {profile.location_id || 'N/A'} | سقف اعتبار: {formatNumber(profile.credit_limit)} ریال | تسویه: {formatDays(profile.payment_terms_days)}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onAskCopilot && (
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => onAskCopilot(`تحلیل جامع وضعیت حساب ${getCustomerTradeName(profile.customer_id)} (${profile.customer_id})، ریسک‌ها و اقدام بعدی را ارائه بده.`)}
              >
                <Sparkles size={13} style={{ color: 'var(--brand)' }} />
                <span>تحلیل عمیق با Copilot</span>
              </button>
            )}
            <span className="badge badge-purple">
              <Sparkles size={12} /> هوش تصمیم‌ساز نفیس
            </span>
          </div>
        </div>

        <div className="ai-brief-grid">
          {/* What Changed */}
          <div className="brief-block">
            <div className="brief-block-title">
              <Sparkles size={13} style={{ color: 'var(--brand)' }} />
              <span>سیگنال‌های کلیدی حساب</span>
            </div>
            <ul style={{ paddingRight: '18px', fontSize: '13px', lineHeight: '1.9' }}>
              <li>
                <strong>ترند درآمدی: </strong>
                <span style={{ color: isNegTrend ? 'var(--color-danger)' : 'var(--color-success)', fontWeight: 700 }}>
                  {formatPercent(kpis.revenue_trend_pct)}
                </span>
              </li>
              <li>
                <strong>شکایات کیفی: </strong>
                {complaints.length > 0
                  ? `${complaints.length} فقره (${kpis.high_severity_complaints ?? 'N/A'} بحرانی)`
                  : 'بدون شکایت'}
              </li>
              <li>
                <strong>سهم سبد نفیس: </strong>
                {formatPercent(kpis.avg_nafis_share_pct)} (رقیب اصلی: {kpis.main_competitor || 'N/A'})
              </li>
            </ul>
          </div>

          {/* Why It Matters */}
          <div className="brief-block">
            <div className="brief-block-title">
              <AlertTriangle size={13} style={{ color: 'var(--color-warning)' }} />
              <span>تحلیل سطح ریسک و فرصت</span>
            </div>
            <p style={{ fontSize: '13px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
              {profile.health_status === 'At Risk'
                ? 'حساب در وضعیت پرریسک قرار دارد. همزمانی افت سفارشات و مشکلات کیفی یا مالی، اقدام فوری اصلاحی را ضروری می‌سازد.'
                : profile.health_status === 'Needs Attention'
                ? 'حساب دارای پتانسیل رشد بالا یا عدم قطعیت در تسویه و سهم سبد است که با پیگیری به موقع تثبیت می‌شود.'
                : 'رابطه خرید مطلوب و پایدار است. پتانسیل توسعه سفارشات به سایر گروه‌های کالایی وجود دارد.'}
            </p>
          </div>

          {/* Next Best Action */}
          <div className="nba-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--color-success)', fontSize: '14px' }}>
                <CheckCircle2 size={16} />
                <span>اقدام بعدی پیشنهادی: {next_best_action?.action || 'N/A'}</span>
              </div>
              <span className="badge badge-risk-high">{next_best_action?.priority || 'P1'}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <div><strong>دلیل: </strong>{next_best_action?.rationale || 'N/A'}</div>
              <div>
                <strong>واحد مسئول: </strong>{next_best_action?.target_unit || 'N/A'}<br />
                <strong>اثر مورد انتظار: </strong>{next_best_action?.expected_impact || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Deep Dive */}
      <div className="card-panel">
        <div className="tabs-header">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. Contract Overview Tab (Phase 5 Standard Contract Matrix) */}
        {activeTab === 'contract_overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="kpi-grid kpi-grid-4">
              {/* Overview Domain */}
              <div className="kpi-card">
                <span className="kpi-label">درآمد کل دوران فعالیت</span>
                <div className="kpi-value text-mono text-brand">
                  {kpis.lifetime_revenue !== null && kpis.lifetime_revenue !== undefined
                    ? `${(kpis.lifetime_revenue / 1000).toLocaleString()} هزار`
                    : 'N/A'}
                </div>
                <small className="text-secondary" style={{ fontSize: '11px' }}>
                  تعداد فاکتور: {kpis.total_invoices ?? 'N/A'} | میانگین معامله:{' '}
                  {kpis.total_invoices && kpis.lifetime_revenue
                    ? `${Math.round(kpis.lifetime_revenue / kpis.total_invoices).toLocaleString()}`
                    : 'N/A'}
                </small>
              </div>

              {/* Sales 90d Domain */}
              <div className="kpi-card">
                <span className="kpi-label">فروش ۹۰ روز اخیر</span>
                <div className="kpi-value text-mono">
                  {kpis.recent_revenue !== null && kpis.recent_revenue !== undefined
                    ? `${(kpis.recent_revenue / 1000).toLocaleString()} هزار`
                    : 'N/A'}
                </div>
                <small className="text-secondary" style={{ fontSize: '11px' }}>
                  تغییر نسبت به دوره قبل:{' '}
                  <strong style={{ color: isNegTrend ? 'var(--color-danger)' : 'var(--color-success)' }}>
                    {formatPercent(kpis.revenue_trend_pct)}
                  </strong>
                </small>
              </div>

              {/* Financial Domain */}
              <div className="kpi-card">
                <span className="kpi-label">حاشیه سود و تأخیر پرداخت</span>
                <div className="kpi-value text-mono text-success">
                  {formatPercent(kpis.avg_gross_margin_pct)}
                </div>
                <small className="text-secondary" style={{ fontSize: '11px' }}>
                  میانگین تأخیر: {formatDays(kpis.avg_delay_days)} | چک برگشتی: {kpis.bounced_checks_count ?? 'N/A'}
                </small>
              </div>

              {/* Wallet Domain */}
              <div className="kpi-card">
                <span className="kpi-label">سهم سبد نفیس / رقیب</span>
                <div className="kpi-value text-mono">
                  {formatPercent(kpis.avg_nafis_share_pct)}
                </div>
                <small className="text-secondary" style={{ fontSize: '11px' }}>
                  رقیب اصلی: <strong>{kpis.main_competitor || 'N/A'}</strong>
                </small>
              </div>
            </div>

            {/* Visual Trend Chart with Recharts */}
            {chartData.length > 0 && (
              <div>
                <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={16} />
                  <span>نمودار فروش و حاشیه سود ماهانه (Recharts)</span>
                </h3>
                <div style={{ width: '100%', height: 260, background: '#FAFAFA', borderRadius: '8px', padding: '12px 0' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} domain={[0, 40]} />
                      <Tooltip
                        formatter={(val: any, name: any) => {
                          if (name === 'درآمد (هزار ریال)') return [val?.toLocaleString(), name];
                          if (name === 'حاشیه سود (%)') return [`${val}%`, name];
                          return [val, name];
                        }}
                      />
                      <Bar yAxisId="left" dataKey="revenue" name="درآمد (هزار ریال)" fill="#15803D" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="marginPct" name="حاشیه سود (%)" stroke="#D97706" strokeWidth={2} dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Commercial Tab */}
        {activeTab === 'commercial' && (
          <div>
            <div className="kpi-grid kpi-grid-4">
              <div className="kpi-card">
                <span className="kpi-label">درآمد کل دوران فعالیت</span>
                <div className="kpi-value text-mono">
                  {kpis.lifetime_revenue !== null && kpis.lifetime_revenue !== undefined
                    ? `${(kpis.lifetime_revenue / 1_000).toLocaleString()} هزار`
                    : 'N/A'}
                </div>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">حجم کل خریداری شده</span>
                <div className="kpi-value text-mono">
                  {kpis.lifetime_quantity !== null && kpis.lifetime_quantity !== undefined
                    ? `${kpis.lifetime_quantity.toLocaleString()} کیلوگرم`
                    : 'N/A'}
                </div>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">تعداد کل فاکتورها</span>
                <div className="kpi-value text-mono">{kpis.total_invoices ?? 'N/A'}</div>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">تاریخ آخرین خرید</span>
                <div className="kpi-value text-mono text-brand" style={{ fontSize: '16px' }}>
                  {kpis.last_purchase_date || 'N/A'}
                </div>
              </div>
            </div>

            <h3 className="section-title">تفکیک فروش بر اساس گروه کالا</h3>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>گروه کالا</th>
                    <th>تعداد خط فروش</th>
                    <th>درآمد کل</th>
                    <th>مقدار (کیلو)</th>
                    <th>حاشیه سود</th>
                  </tr>
                </thead>
                <tbody>
                  {product_breakdown.map((p) => (
                    <tr key={p.product_family}>
                      <td><strong>{p.product_family || 'N/A'}</strong></td>
                      <td>{p.order_lines ?? 'N/A'}</td>
                      <td className="text-mono">
                        {p.total_revenue !== null && p.total_revenue !== undefined
                          ? `${(p.total_revenue / 1000).toLocaleString()} هزار`
                          : 'N/A'}
                      </td>
                      <td className="text-mono">{formatNumber(p.total_quantity)}</td>
                      <td className="text-mono font-bold">{formatPercent(p.avg_margin_pct)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Profitability Tab */}
        {activeTab === 'profitability' && (
          <div>
            <div className="kpi-grid kpi-grid-3">
              <div className="kpi-card">
                <span className="kpi-label">سود ناخالص کل</span>
                <div className="kpi-value text-mono text-success">
                  {kpis.lifetime_gross_profit !== null && kpis.lifetime_gross_profit !== undefined
                    ? `${(kpis.lifetime_gross_profit / 1000).toLocaleString()} هزار`
                    : 'N/A'}
                </div>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">حاشیه سود ناخالص میانگین</span>
                <div className="kpi-value text-mono text-brand">{formatPercent(kpis.avg_gross_margin_pct)}</div>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">مبنای محاسبه بهای تمام شده</span>
                <div className="kpi-value" style={{ fontSize: '14px', fontWeight: 600 }}>بهای واقعی (Actual BOM)</div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Payment Tab */}
        {activeTab === 'payment' && (
          <div>
            <div className="kpi-grid kpi-grid-3">
              <div className="kpi-card">
                <span className="kpi-label">سطح ریسک وصول مطالبات</span>
                <div className="kpi-value text-mono">
                  <span className={payment_financials.payment_risk_level === 'High' ? 'badge badge-risk-high' : 'badge badge-risk-low'}>
                    {payment_financials.payment_risk_level || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">میانگین تأخیر وصول</span>
                <div className="kpi-value text-mono">{formatDays(payment_financials.avg_delay_days)}</div>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">تعداد چک‌های برگشتی</span>
                <div className="kpi-value text-mono" style={{ color: payment_financials.bounced_checks_count > 0 ? 'var(--color-danger)' : 'inherit' }}>
                  {payment_financials.bounced_checks_count ?? 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Quality Tab */}
        {activeTab === 'quality' && (
          <div>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>کد شکایت</th>
                    <th>کد محصول</th>
                    <th>عنوان شکایت</th>
                    <th>شدت</th>
                    <th>وضعیت</th>
                    <th>تاریخ ثبت</th>
                    <th>بررسی زنجیره کیفیت</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>
                        هیچ شکایتی برای این مشتری ثبت نشده است.
                      </td>
                    </tr>
                  ) : (
                    complaints.map((c) => (
                      <tr key={c.complaint_id}>
                        <td className="text-mono font-bold">{c.complaint_id}</td>
                        <td className="text-mono">{c.product_id || 'N/A'}</td>
                        <td>{c.complaint_title || 'N/A'}</td>
                        <td>
                          <span className={c.severity === 'زیاد' || c.severity === 'بحرانی' ? 'badge badge-risk-high' : 'badge'}>
                            {c.severity || 'N/A'}
                          </span>
                        </td>
                        <td>{c.complaint_status || 'N/A'}</td>
                        <td className="text-mono">{c.created_at || 'N/A'}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleQuality(c.complaint_id)}
                          >
                            <span>ردیابی زنجیره کیفیت</span>
                            <ShieldAlert size={12} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. Basket Share & Competitors Tab */}
        {activeTab === 'basket' && (
          <div>
            <div className="kpi-grid kpi-grid-2" style={{ marginBottom: '16px' }}>
              <div className="kpi-card">
                <span className="kpi-label">میانگین سهم نفیس از سبد خرید</span>
                <div className="kpi-value text-mono text-brand">{formatPercent(kpis.avg_nafis_share_pct)}</div>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">رقیب اصلی در خطوط مشتری</span>
                <div className="kpi-value" style={{ fontSize: '16px', fontWeight: 700 }}>{kpis.main_competitor || 'N/A'}</div>
              </div>
            </div>

            {basket_share && basket_share.length > 0 ? (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ماه</th>
                      <th>تخمین خرید کل</th>
                      <th>خرید از نفیس</th>
                      <th>درصد سهم نفیس</th>
                      <th>رقیب اصلی</th>
                      <th>منبع تخمین</th>
                    </tr>
                  </thead>
                  <tbody>
                    {basket_share.map((b) => (
                      <tr key={b.month_key}>
                        <td className="text-mono font-bold">{b.month_key}</td>
                        <td className="text-mono">{formatNumber(b.estimated_total_purchase)}</td>
                        <td className="text-mono">{formatNumber(b.nafis_purchase)}</td>
                        <td className="text-mono font-bold text-brand">{formatPercent(b.nafis_share_pct)}</td>
                        <td>{b.main_competitor || 'N/A'}</td>
                        <td className="text-secondary">{b.estimate_source || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-secondary" style={{ fontSize: '13px', textAlign: 'center', padding: '16px' }}>
                داده‌های تخمین سهم سبد برای این مشتری ثبت نشده است.
              </p>
            )}
          </div>
        )}

        {/* 7. CRM & R&D Tab */}
        {activeTab === 'crm' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h3 className="section-title">تاریخچه تعاملات CRM</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {crm_history.length === 0 ? (
                    <p className="text-secondary" style={{ fontSize: '13px' }}>تعاملی ثبت نشده است.</p>
                  ) : (
                    crm_history.map((crm) => (
                      <div key={crm.interaction_id} style={{ background: '#FAFAFA', padding: '12px', borderRadius: '6px', border: '1px solid #EEEEEE' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                          <strong>{crm.interaction_type || 'تعامل'}</strong>
                          <span className="text-mono text-secondary">{crm.event_time || 'N/A'}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#444', lineHeight: '1.6' }}>{crm.summary_text || 'N/A'}</p>
                        {crm.next_action && (
                          <div style={{ marginTop: '6px', fontSize: '11.5px', color: 'var(--brand)' }}>
                            <strong>اقدام بعدی: </strong>{crm.next_action}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h3 className="section-title">درخواست‌های تحقیق و توسعه (R&D)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {development_requests.length === 0 ? (
                    <p className="text-secondary" style={{ fontSize: '13px' }}>درخواست توسعه محصولی ثبت نشده است.</p>
                  ) : (
                    development_requests.map((dev) => (
                      <div key={dev.request_id} style={{ background: '#FAFAFA', padding: '12px', borderRadius: '6px', border: '1px solid #EEEEEE' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                          <strong>{dev.request_type || 'درخواست فنی'}</strong>
                          <span className="badge">{dev.status || 'N/A'}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#444' }}>{dev.requirement_text || 'N/A'}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
