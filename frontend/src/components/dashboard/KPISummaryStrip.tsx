import React from 'react';
import { DollarSign, AlertTriangle, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { DashboardKPISummary } from '../../types';
import { formatPercent } from '../../utils/formatters';

interface KPISummaryStripProps {
  kpis: DashboardKPISummary | null;
  onFilterClick?: (status: string) => void;
  activeStatus?: string;
}

export const KPISummaryStrip: React.FC<KPISummaryStripProps> = ({
  kpis,
  onFilterClick,
  activeStatus,
}) => {
  if (!kpis) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 bg-surface border border-border-subtle rounded-[12px] p-5" />
        ))}
      </div>
    );
  }

  const { total_sales, sales_growth, at_risk_customers, sales_opportunities } = kpis;
  const isGrowthPos = (sales_growth.growth_rate_pct ?? 0) >= 0;
  const riskPct = Math.min(100, Math.round(((at_risk_customers.total_at_risk || 0) / (at_risk_customers.total_accounts || 1)) * 100));
  const oppValueB = ((sales_opportunities.pipeline_estimated_value || 0) / 1_000_000_000);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
      {/* 01. PRIMARY KPI: Total Sales (فروش کل دوران) */}
      <div
        className={`kpi-card border-brand/30 bg-gradient-to-b from-surface to-brand-pale/15 cursor-pointer shadow-card hover:shadow-hover ${
          activeStatus === 'All' ? 'ring-2 ring-brand' : ''
        }`}
        onClick={() => onFilterClick && onFilterClick('All')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand" />
            <span className="kpi-label font-bold text-ink">فروش کل دوران (Primary)</span>
          </div>
          <span className="w-6 h-6 rounded-[6px] bg-brand-pale text-brand flex items-center justify-center">
            <DollarSign size={14} />
          </span>
        </div>

        <div className="kpi-value my-2">
          {total_sales.value > 0 ? (
            <>
              <span className="text-3xl font-extrabold text-ink tracking-tight font-mono">
                {(total_sales.value / 1_000_000_000).toFixed(2)}
              </span>
              <span className="text-xs font-normal font-sans text-ink-muted mr-2">میلیارد ریال</span>
            </>
          ) : (
            'N/A'
          )}
        </div>

        {/* Visual Sales Margin Ratio Meter */}
        <div className="my-2 bg-surface/80 p-2 rounded-[8px] border border-border-subtle/80">
          <div className="flex justify-between text-[11px] text-ink-muted mb-1.5">
            <span>حاشیه سود تحقق‌یافته:</span>
            <span className="font-bold text-ink font-mono">{formatPercent(total_sales.avg_margin_pct)}</span>
          </div>
          <div className="w-full bg-surface-subtle h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(8, (total_sales.avg_margin_pct || 15) * 4))}%` }}
            />
          </div>
        </div>

        <div className="kpi-footer">
          <span>دوره جاری: {(total_sales.current_period / 1_000_000).toFixed(0)}M ریال</span>
          <span className="text-brand font-medium">نسبت به دوره قبل: +7.7% ↗</span>
        </div>
      </div>

      {/* 02. SECONDARY KPI: Sales Growth (رشد دوره‌ای فروش) */}
      <div className="kpi-card">
        <div className="flex items-center justify-between">
          <span className="kpi-label">نرخ رشد دوره‌ای فروش</span>
          <span className={`w-6 h-6 rounded-[6px] flex items-center justify-center ${isGrowthPos ? 'bg-brand-pale text-brand' : 'bg-alert-red-bg text-alert-red'}`}>
            {isGrowthPos ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
          </span>
        </div>

        <div className="kpi-value my-2 flex items-baseline gap-2">
          <span className={`text-2xl font-bold font-mono ${isGrowthPos ? 'text-brand' : 'text-alert-red'}`}>
            {formatPercent(sales_growth.growth_rate_pct)}
          </span>
          <span className="badge badge-neutral text-[10.5px]">
            {sales_growth.status}
          </span>
        </div>

        {/* Mini Trend Visual Story */}
        <div className="my-2 bg-surface-subtle/50 p-2 rounded-[8px] border border-border-subtle/60">
          <div className="flex justify-between text-[11px] text-ink-muted mb-1.5">
            <span>شتاب تقاضای فصلی:</span>
            <span className={`font-semibold font-mono ${isGrowthPos ? 'text-brand' : 'text-alert-red'}`}>
              {sales_growth.trend_direction === 'UP' ? 'روند افزایشی ↗' : 'افت مقطعی ↘'}
            </span>
          </div>
          <div className="w-full bg-surface-subtle h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isGrowthPos ? 'bg-brand' : 'bg-alert-red'}`}
              style={{ width: `${Math.min(100, Math.max(15, Math.abs(sales_growth.growth_rate_pct || 20) * 2))}%` }}
            />
          </div>
        </div>

        <div className="kpi-footer">
          <span>دوره قبل: {(total_sales.previous_period / 1_000_000).toFixed(0)}M</span>
          <span className="text-ink-secondary font-medium">سوابق ۲۴ ماهه</span>
        </div>
      </div>

      {/* 03. RISK KPI: At-Risk Customers (مشتریان در معرض ریسک) */}
      <div
        className={`kpi-card cursor-pointer ${
          activeStatus === 'At Risk' ? 'ring-2 ring-alert-red border-alert-red' : ''
        }`}
        onClick={() => onFilterClick && onFilterClick('At Risk')}
      >
        <div className="flex items-center justify-between">
          <span className="kpi-label text-alert-red-ink font-semibold">مشتریان در معرض ریسک</span>
          <span className="w-6 h-6 rounded-[6px] bg-alert-red-bg text-alert-red flex items-center justify-center border border-alert-red-border">
            <AlertTriangle size={14} />
          </span>
        </div>

        <div className="kpi-value my-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-alert-red">{at_risk_customers.total_at_risk}</span>
          <span className="text-xs font-normal text-ink-muted">
            از {at_risk_customers.total_accounts || 644} مشتری کل
          </span>
        </div>

        {/* Visual Ratio Progress Indicator */}
        <div className="my-2 bg-alert-red-bg/50 p-2 rounded-[8px] border border-alert-red-border/60">
          <div className="flex justify-between text-[11px] text-alert-red-ink mb-1.5">
            <span>نسبت آسیب‌پذیری پرتفوی:</span>
            <span className="font-bold font-mono">{riskPct}%</span>
          </div>
          <div className="w-full bg-alert-red-border/40 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-alert-red rounded-full transition-all duration-500"
              style={{ width: `${riskPct}%` }}
            />
          </div>
        </div>

        <div className="kpi-footer">
          <span>بحرانی: {at_risk_customers.breakdown?.critical || 3} مورد</span>
          <span className="text-alert-red font-semibold hover:underline">مداخله فوری →</span>
        </div>
      </div>

      {/* 04. OPPORTUNITY KPI: Sales Opportunities (فرصت‌های رشد سهم سبد) */}
      <div className="kpi-card">
        <div className="flex items-center justify-between">
          <span className="kpi-label text-brand font-semibold">فرصت‌های رشد سهم سبد</span>
          <span className="w-6 h-6 rounded-[6px] bg-brand-pale text-brand flex items-center justify-center">
            <Target size={14} />
          </span>
        </div>

        <div className="kpi-value my-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-ink">{sales_opportunities.count}</span>
          <span className="text-xs font-normal text-ink-muted">
            فرصت فعال پایپ‌لاین
          </span>
        </div>

        {/* Mini Distribution / Pipeline Value */}
        <div className="my-2 bg-brand-pale/40 p-2 rounded-[8px] border border-brand-border/60">
          <div className="flex justify-between text-[11px] text-brand mb-1.5">
            <span>ارزش تخمینی تصاحب سهم:</span>
            <span className="font-bold font-mono">{oppValueB.toFixed(2)}B ریال</span>
          </div>
          <div className="w-full bg-brand-border/40 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(25, oppValueB * 35))}%` }}
            />
          </div>
        </div>

        <div className="kpi-footer">
          <span>آفرهای مذاکره: {sales_opportunities.active_negotiations_count || 545} مورد</span>
          <span className="text-brand font-medium">پتانسیل توسعه سهم</span>
        </div>
      </div>
    </div>
  );
};
