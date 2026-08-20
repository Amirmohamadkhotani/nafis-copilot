import React from 'react';
import { Users, AlertOctagon, TrendingUp, ShieldAlert, DollarSign, Activity } from 'lucide-react';
import type { BusinessPulseSummary } from '../types';
import { formatPercent } from '../utils/formatters';

interface BusinessPulseProps {
  summary: BusinessPulseSummary | null;
  onFilterClick: (status: string) => void;
  activeStatus: string;
}

export const BusinessPulse: React.FC<BusinessPulseProps> = ({
  summary,
  onFilterClick,
  activeStatus,
}) => {
  if (!summary) return null;

  const totalRev = summary.financials?.total_revenue;
  const avgMargin = summary.financials?.overall_avg_margin;

  const revenueDisplay =
    totalRev !== undefined && totalRev !== null && !isNaN(totalRev)
      ? `${(totalRev / 1_000_000).toFixed(1)}M`
      : 'N/A';

  return (
    <div className="pulse-strip">
      {/* 1. Total Accounts */}
      <div
        className={`pulse-card ${activeStatus === 'All' ? 'active-pulse' : ''}`}
        onClick={() => onFilterClick('All')}
      >
        <div className="pulse-icon-box bg-brand-pale text-brand">
          <Users size={18} />
        </div>
        <div className="pulse-meta">
          <span>کل حساب‌ها</span>
          <strong>{summary.total_accounts}</strong>
        </div>
      </div>

      {/* 2. High Risk / At Risk */}
      <div
        className={`pulse-card ${activeStatus === 'At Risk' ? 'active-pulse' : ''}`}
        onClick={() => onFilterClick('At Risk')}
      >
        <div className="pulse-icon-box bg-alert-red-bg text-alert-red border border-alert-red-border/50">
          <AlertOctagon size={18} />
        </div>
        <div className="pulse-meta">
          <span>حساب‌های در معرض ریزش</span>
          <strong className="text-alert-red">{summary.at_risk_accounts}</strong>
        </div>
      </div>

      {/* 3. Needs Attention */}
      <div
        className={`pulse-card ${activeStatus === 'Needs Attention' ? 'active-pulse' : ''}`}
        onClick={() => onFilterClick('Needs Attention')}
      >
        <div className="pulse-icon-box bg-alert-amber-bg text-alert-amber border border-alert-amber-border/50">
          <Activity size={18} />
        </div>
        <div className="pulse-meta">
          <span>نیازمند پیگیری</span>
          <strong className="text-alert-amber">{summary.needs_attention_accounts}</strong>
        </div>
      </div>

      {/* 4. Growth Opportunities */}
      <div
        className="pulse-card"
        onClick={() => onFilterClick('Growth')}
      >
        <div className="pulse-icon-box bg-alert-green-bg text-alert-green border border-alert-green-border/50">
          <TrendingUp size={18} />
        </div>
        <div className="pulse-meta">
          <span>فرصت‌های رشد سبد</span>
          <strong className="text-alert-green">{summary.growth_opportunities_count}</strong>
        </div>
      </div>

      {/* 5. Quality Alerts */}
      <div
        className="pulse-card"
        onClick={() => onFilterClick('QualityAlert')}
      >
        <div className="pulse-icon-box bg-alert-purple-bg text-alert-purple border border-alert-purple-border/50">
          <ShieldAlert size={18} />
        </div>
        <div className="pulse-meta">
          <span>هشدارهای کیفی</span>
          <strong className="text-alert-purple">{summary.quality_alerts_count}</strong>
        </div>
      </div>

      {/* 6. Overall Revenue & Margin */}
      <div className="pulse-card cursor-default">
        <div className="pulse-icon-box bg-[#FAF8F2] text-brand-gold border border-brand-gold-light/40">
          <DollarSign size={18} />
        </div>
        <div className="pulse-meta">
          <span>درآمد کل / حاشیه سود</span>
          <strong>
            {revenueDisplay}{' '}
            <small className="text-[11px] text-ink-muted">
              ({formatPercent(avgMargin)})
            </small>
          </strong>
        </div>
      </div>
    </div>
  );
};
