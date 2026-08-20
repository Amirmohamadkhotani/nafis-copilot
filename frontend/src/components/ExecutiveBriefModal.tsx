import React from 'react';
import { X, Printer, Sparkles, Building2, AlertTriangle, Target, Users, ShieldAlert, CheckCircle2 } from 'lucide-react';
import type { DashboardKPISummary, SalesOpportunity, RiskyCollection, CustomerAccount } from '../types';
import { formatPercent, formatDays, formatRials } from '../utils/formatters';
import { getCustomerTradeName } from '../utils/customerNames';

interface ExecutiveBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpis: DashboardKPISummary | null;
  alerts: any[];
  opportunities: SalesOpportunity[];
  collections: RiskyCollection[];
  accounts: CustomerAccount[];
}

export const ExecutiveBriefModal: React.FC<ExecutiveBriefModalProps> = ({
  isOpen,
  onClose,
  kpis,
  alerts,
  opportunities,
  collections,
  accounts,
}) => {
  if (!isOpen) return null;

  const todayDate = new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'full',
  }).format(new Date());

  const top5Alerts = alerts.slice(0, 5);
  const top5Opps = [...opportunities].sort((a, b) => (b.estimated_value || 0) - (a.estimated_value || 0)).slice(0, 5);
  const top5Accounts = [...accounts].sort((a, b) => (b.lifetime_revenue || 0) - (a.lifetime_revenue || 0)).slice(0, 5);
  const top5Collections = [...collections].sort((a, b) => (b.amount || 0) - (a.amount || 0)).slice(0, 5);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="bg-surface rounded-[14px] border border-border-subtle shadow-modal w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden print:max-w-none print:max-h-none print:shadow-none print:border-0 print:rounded-none">
        {/* Modal Actions Header (Hidden in Print) */}
        <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-surface-subtle/50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[6px] bg-brand text-white flex items-center justify-center font-bold text-xs">
              <Sparkles size={15} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-ink">مستند خلاصه راهبردی و نبض تجاری (Executive Brief)</h2>
              <span className="text-[11px] text-ink-muted">گزارش خلاصه یک‌صفحه‌ای مناسب جلسات مدیریت ارشد و هیئت‌مدیره</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={handlePrint}
            >
              <Printer size={13} />
              <span>چاپ / خروجی PDF</span>
            </button>
            <button
              type="button"
              className="p-1.5 rounded-[8px] bg-surface text-ink-muted hover:text-ink hover:bg-surface-subtle border border-border-subtle transition-colors cursor-pointer"
              onClick={onClose}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Executive Document Body */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 text-ink print:p-6 print:overflow-visible">
          {/* Document Header */}
          <div className="border-b-2 border-brand pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[8px] bg-brand text-white flex items-center justify-center font-bold text-lg">
                <Building2 size={22} />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-ink tracking-tight">شرکت تولیدی و صنعتی نفیس نخ</h1>
                <p className="text-xs text-ink-secondary mt-0.5">
                  گزارش هفتگی هوش تجاری و تصمیم‌سازی فروش (COPAN AI Executive Report)
                </p>
              </div>
            </div>

            <div className="text-left font-mono text-xs text-ink-secondary">
              <div>تاریخ گزارش: <strong>{todayDate}</strong></div>
              <div className="text-[11px] text-ink-muted mt-0.5">وضعیت پایگاه داده: DuckDB Verified</div>
            </div>
          </div>

          {/* 1. Executive KPI Summary Grid */}
          <div>
            <h3 className="text-xs font-bold text-brand uppercase mb-2.5 flex items-center gap-1.5">
              <span>۱. نبض شاخص‌های کلیدی عملکرد (Key Performance Indicators)</span>
            </h3>

            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 rounded-[8px] border border-border-subtle bg-surface-subtle/30">
                <span className="text-[11px] text-ink-muted block">فروش کل دوران</span>
                <span className="text-base font-bold font-mono text-ink block my-1">
                  {kpis ? (kpis.total_sales.value / 1_000_000_000).toFixed(2) : 'N/A'} B ریال
                </span>
                <span className="text-[10px] text-brand font-medium">حاشیه سود: {formatPercent(kpis?.total_sales.avg_margin_pct)}</span>
              </div>

              <div className="p-3 rounded-[8px] border border-border-subtle bg-surface-subtle/30">
                <span className="text-[11px] text-ink-muted block">نرخ رشد دوره‌ای فروش</span>
                <span className="text-base font-bold font-mono text-brand block my-1">
                  {formatPercent(kpis?.sales_growth.growth_rate_pct)}
                </span>
                <span className="text-[10px] text-ink-muted">شتاب تقاضای فصلی</span>
              </div>

              <div className="p-3 rounded-[8px] border border-alert-red-border/60 bg-alert-red-bg/30">
                <span className="text-[11px] text-alert-red-ink block">مشتریان در معرض ریسک</span>
                <span className="text-base font-bold font-mono text-alert-red block my-1">
                  {kpis?.at_risk_customers.total_at_risk || 0} حساب
                </span>
                <span className="text-[10px] text-alert-red-ink">از مجموع {kpis?.at_risk_customers.total_accounts || 644} مشتری</span>
              </div>

              <div className="p-3 rounded-[8px] border border-brand-border/60 bg-brand-pale/30">
                <span className="text-[11px] text-brand block">پایپ‌لاین فرصت‌های رشد</span>
                <span className="text-base font-bold font-mono text-ink block my-1">
                  {kpis?.sales_opportunities.count || 0} فرصت فعال
                </span>
                <span className="text-[10px] text-brand font-medium">
                  ارزش: {formatRials(kpis?.sales_opportunities.pipeline_estimated_value)}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Top Critical Actions */}
          <div>
            <h3 className="text-xs font-bold text-alert-red-ink mb-2.5 flex items-center gap-1.5">
              <AlertTriangle size={13} />
              <span>۲. پنج اقدام فوری و ریسک‌های بحرانی (Top 5 Critical Actions)</span>
            </h3>

            <div className="border border-border-subtle rounded-[8px] overflow-hidden text-xs">
              <table className="w-full text-right border-collapse">
                <thead className="bg-surface-subtle/80 border-b border-border-subtle text-ink-muted text-[11px]">
                  <tr>
                    <th className="p-2">اولویت</th>
                    <th className="p-2">مشتری / کارخانه</th>
                    <th className="p-2">عنوان هشدار</th>
                    <th className="p-2">علت و شواهد</th>
                  </tr>
                </thead>
                <tbody>
                  {top5Alerts.map((alt, i) => (
                    <tr key={i} className="border-b border-border-subtle/60 last:border-0">
                      <td className="p-2">
                        <span className={`badge text-[10px] ${alt.severity === 'Critical' ? 'badge-risk-high' : 'badge-risk-medium'}`}>
                          {alt.severity === 'Critical' ? 'بحرانی' : 'مهم'}
                        </span>
                      </td>
                      <td className="p-2 font-bold">{getCustomerTradeName(alt.customer_id)} ({alt.customer_id})</td>
                      <td className="p-2 font-medium text-ink">{alt.title}</td>
                      <td className="p-2 text-ink-secondary text-[11.5px]">{alt.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Two Columns: Opportunities & Collections */}
          <div className="grid grid-cols-2 gap-4">
            {/* Top 5 Opportunities */}
            <div>
              <h3 className="text-xs font-bold text-brand mb-2 flex items-center gap-1.5">
                <Target size={13} />
                <span>۳. برترین فرصت‌های افزایش سهم سبد</span>
              </h3>
              <div className="border border-border-subtle rounded-[8px] overflow-hidden text-xs">
                <table className="w-full text-right border-collapse">
                  <thead className="bg-surface-subtle/80 border-b border-border-subtle text-ink-muted text-[11px]">
                    <tr>
                      <th className="p-2">مشتری</th>
                      <th className="p-2">ارزش تخمینی</th>
                      <th className="p-2">رقیب</th>
                    </tr>
                  </thead>
                  <tbody>
                    {top5Opps.map((opp, i) => (
                      <tr key={i} className="border-b border-border-subtle/60 last:border-0">
                        <td className="p-2 font-bold text-[11.5px] truncate">{getCustomerTradeName(opp.customer_id)}</td>
                        <td className="p-2 font-mono font-bold text-brand">{formatRials(opp.estimated_value)}</td>
                        <td className="p-2 text-ink-muted text-[11px]">{opp.main_competitor || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top 5 Collections */}
            <div>
              <h3 className="text-xs font-bold text-alert-red-ink mb-2 flex items-center gap-1.5">
                <ShieldAlert size={13} />
                <span>۴. بیشترین مطالبات معوق سررسیدشده</span>
              </h3>
              <div className="border border-border-subtle rounded-[8px] overflow-hidden text-xs">
                <table className="w-full text-right border-collapse">
                  <thead className="bg-surface-subtle/80 border-b border-border-subtle text-ink-muted text-[11px]">
                    <tr>
                      <th className="p-2">مشتری</th>
                      <th className="p-2">مبلغ معوق</th>
                      <th className="p-2">تأخیر</th>
                    </tr>
                  </thead>
                  <tbody>
                    {top5Collections.map((col, i) => (
                      <tr key={i} className="border-b border-border-subtle/60 last:border-0">
                        <td className="p-2 font-bold text-[11.5px] truncate">{getCustomerTradeName(col.customer_id)}</td>
                        <td className="p-2 font-mono font-bold text-alert-red">{formatRials(col.amount)}</td>
                        <td className="p-2 font-mono text-alert-amber-ink">{formatDays(col.delay_days)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 4. Strategic Key Accounts Table */}
          <div>
            <h3 className="text-xs font-bold text-ink mb-2 flex items-center gap-1.5">
              <Users size={13} className="text-brand" />
              <span>۵. برترین حساب‌های تجاری استراتژیک (Strategic Key Accounts)</span>
            </h3>
            <div className="border border-border-subtle rounded-[8px] overflow-hidden text-xs">
              <table className="w-full text-right border-collapse">
                <thead className="bg-surface-subtle/80 border-b border-border-subtle text-ink-muted text-[11px]">
                  <tr>
                    <th className="p-2">نام کارخانه / مشتری</th>
                    <th className="p-2">سگمنت</th>
                    <th className="p-2">درآمد کل دوران</th>
                    <th className="p-2">حاشیه سود</th>
                    <th className="p-2">سهم سبد نفیس</th>
                  </tr>
                </thead>
                <tbody>
                  {top5Accounts.map((acc, i) => (
                    <tr key={i} className="border-b border-border-subtle/60 last:border-0">
                      <td className="p-2 font-bold">{getCustomerTradeName(acc.customer_id)} ({acc.customer_id})</td>
                      <td className="p-2"><span className="badge badge-neutral text-[10px]">سگمنت {acc.customer_segment}</span></td>
                      <td className="p-2 font-mono font-bold text-ink">{formatRials(acc.lifetime_revenue)}</td>
                      <td className="p-2 font-mono font-semibold">{formatPercent(acc.avg_gross_margin_pct)}</td>
                      <td className="p-2 font-mono font-bold text-brand">{formatPercent(acc.avg_nafis_share_pct)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Document Footer */}
          <div className="pt-4 border-t border-border-subtle/80 flex items-center justify-between text-[11px] text-ink-muted">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-brand" />
              <span>تولید خودکار توسط موتور تصمیم‌ساز COPAN AI Sales Assistant</span>
            </div>
            <span>نسخه ۲.۰ — شرکت نفیس نخ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
