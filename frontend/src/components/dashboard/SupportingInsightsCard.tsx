import React from 'react';
import {
  TrendingDown,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';
import {
  COPAN_OPPORTUNITIES,
  COPAN_ALERTS,
} from '../../data/copanIntelligence';
import type { PageId } from '../layout/Sidebar';

interface SupportingInsightsCardProps {
  onSelectCustomer: (customerId: string) => void;
  onNavigate: (page: PageId) => void;
  onOpenInteractionModal: (customerId: string, defaultAction: string) => void;
}

export const SupportingInsightsCard: React.FC<SupportingInsightsCardProps> = ({
  onSelectCustomer,
  onNavigate,
  onOpenInteractionModal,
}) => {
  const topOpportunities = COPAN_OPPORTUNITIES.slice(0, 3);
  const criticalLossAlerts = COPAN_ALERTS.loss_alerts.slice(0, 2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Hot Pipeline Growth Opportunities */}
      <div className="copan-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--hair)]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[var(--gold-soft)] text-[var(--gold)]">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-extrabold text-[14.5px] text-[var(--text)]">
                فرصت‌های داغ رشد و تصاحب سهم (Pipeline Opportunities)
              </h3>
              <p className="text-[11px] text-[var(--text-faint)]">
                بالاترین پتانسیل‌های تحقق درآمد و تصاحب سهم رقیب
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('opportunities')}
            className="text-[12px] font-bold text-[var(--gold)] hover:underline flex items-center gap-0.5"
          >
            <span>همه ({COPAN_OPPORTUNITIES.length})</span>
            <ChevronLeft size={13} />
          </button>
        </div>

        <div className="space-y-3">
          {topOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="p-3.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-2 hover:border-[var(--gold)]/40 transition-all"
            >
              <div className="flex items-center justify-between text-[11.5px]">
                <div
                  onClick={() => {
                    onSelectCustomer(opp.customer_id);
                    onNavigate('customer_360');
                  }}
                  className="font-extrabold text-[var(--text)] hover:text-[var(--gold)] cursor-pointer"
                >
                  {opp.customer_name}
                </div>
                <span className="copan-badge badge-positive font-mono font-bold">
                  {opp.probability_pct}٪ احتمال
                </span>
              </div>

              <div className="font-bold text-[12px] text-[var(--gold)]">
                {opp.opportunity_title}
              </div>

              <div className="text-[11px] text-[var(--text-dim)] leading-relaxed">
                {opp.reason}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--hair)] text-[11px]">
                <span className="text-[var(--text-faint)]">
                  ارزش بالقوه: <b className="font-mono text-[var(--text)]">{(opp.potential_revenue / 1000000).toFixed(0)} م.ر</b>
                </span>

                <button
                  onClick={() => onOpenInteractionModal(opp.customer_id, opp.recommended_action)}
                  className="copan-btn copan-btn-gold copan-btn-sm text-[11px] font-bold"
                >
                  اقدام و ارسال پیشنهاد
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Loss & Margin Deterioration Watchlist */}
      <div className="copan-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--hair)]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[var(--risk-soft)] text-[var(--risk)]">
              <TrendingDown size={16} />
            </div>
            <div>
              <h3 className="font-extrabold text-[14.5px] text-[var(--text)]">
                دیده‌بان ضرر و خواب سرمایه (Margin Protection)
              </h3>
              <p className="text-[11px] text-[var(--text-faint)]">
                حساب‌های با حاشیه سود منفی یا فروش زیر بهای تمام‌شده
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('risks_alerts')}
            className="text-[12px] font-bold text-[var(--gold)] hover:underline flex items-center gap-0.5"
          >
            <span>دیده‌بان ریسک</span>
            <ChevronLeft size={13} />
          </button>
        </div>

        <div className="space-y-3">
          {criticalLossAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3.5 rounded-xl bg-[var(--panel-2)] border border-[var(--risk-border)]/60 space-y-2 hover:border-[var(--risk)] transition-all"
            >
              <div className="flex items-center justify-between text-[11.5px]">
                <div
                  onClick={() => {
                    onSelectCustomer(alert.customer_id);
                    onNavigate('customer_360');
                  }}
                  className="font-extrabold text-[var(--text)] hover:text-[var(--gold)] cursor-pointer"
                >
                  {alert.customer_name}
                </div>
                <span className="copan-badge badge-risk font-bold">{alert.severity}</span>
              </div>

              <div className="font-bold text-[12px] text-[var(--risk)]">{alert.title}</div>

              <div className="text-[11.5px] text-[var(--text-dim)] leading-relaxed">
                {alert.reason}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--hair)] text-[11px]">
                <span className="text-[var(--text-faint)]">
                  اثر مالی: <b className="text-[var(--risk)]">{alert.impact}</b>
                </span>

                <button
                  onClick={() => onOpenInteractionModal(alert.customer_id, alert.recommended_action)}
                  className="copan-btn copan-btn-primary copan-btn-sm text-[11px] font-bold"
                >
                  اصلاح فوری فاکتور
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
