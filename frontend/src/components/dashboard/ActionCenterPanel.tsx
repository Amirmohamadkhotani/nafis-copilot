import React from 'react';
import { AlertCircle, ChevronLeft, ArrowLeft } from 'lucide-react';
import type { DashboardAlertsResponse } from '../../types';
import { getCustomerTradeName } from '../../utils/customerNames';

interface ActionCenterPanelProps {
  alerts: DashboardAlertsResponse | null;
  onSelectCustomer: (customerId: string) => void;
  onViewAll: () => void;
  isLoading?: boolean;
}

export const ActionCenterPanel: React.FC<ActionCenterPanelProps> = ({
  alerts,
  onSelectCustomer,
  onViewAll,
  isLoading,
}) => {
  if (isLoading || !alerts) {
    return (
      <div className="card-panel h-60 flex items-center justify-center text-ink-muted text-xs animate-pulse">
        در حال پایش و رتبه‌بندی هشدارهای عملیاتی...
      </div>
    );
  }

  // Combined and sorted by severity: Critical first, then High, then Recency
  const allAlerts = [
    ...alerts.risk_alerts,
    ...alerts.complaint_alerts,
    ...alerts.action_alerts,
  ].sort((a: any, b: any) => {
    const sevOrder: Record<string, number> = { Critical: 3, High: 2, Medium: 1, Low: 0 };
    return (sevOrder[b.severity] || 0) - (sevOrder[a.severity] || 0);
  });

  const top5 = allAlerts.slice(0, 5);

  return (
    <div className="card-panel" id="actions-section">
      {/* Section Header with View All CTA */}
      <div className="section-header">
        <div>
          <div className="section-title">
            <span className="w-6 h-6 rounded-[6px] bg-alert-red-bg text-alert-red flex items-center justify-center border border-alert-red-border">
              <AlertCircle size={14} />
            </span>
            <span>اقدامات فوری و ریسک‌های بحرانی (Critical Actions)</span>
          </div>
          <span className="section-subtitle">
            ۵ مورد با بالاترین اولویت بر اساس ریسک ریزش، چک برگشتی و شکایات کیفی
          </span>
        </div>

        <button
          type="button"
          className="view-all-cta"
          onClick={onViewAll}
        >
          <span>مشاهده همه ({allAlerts.length} مورد)</span>
          <ArrowLeft size={13} />
        </button>
      </div>

      {/* Top 5 Critical Action Items */}
      <div className="flex flex-col gap-2.5 mt-3.5">
        {top5.length === 0 ? (
          <div className="text-center py-6 text-xs text-ink-muted">
            در حال حاضر اقدام بحرانی بدون رسیدگی وجود ندارد.
          </div>
        ) : (
          top5.map((item: any, idx: number) => {
            const isCrit = item.severity === 'Critical';
            const companyName = getCustomerTradeName(item.customer_id);

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-[8px] border border-border-subtle bg-surface hover:bg-surface-subtle/50 transition-all gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="font-mono text-ink-faint font-semibold text-[11px] w-5 text-center">
                    0{idx + 1}
                  </span>

                  <span
                    className={`badge whitespace-nowrap ${
                      isCrit ? 'badge-risk-high' : 'badge-risk-medium'
                    }`}
                  >
                    {isCrit ? 'بحرانی (P0)' : 'مهم (P1)'}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="font-bold text-ink hover:text-brand truncate text-right cursor-pointer"
                        onClick={() => onSelectCustomer(item.customer_id)}
                      >
                        {companyName}
                      </button>
                      <span className="font-mono text-[10.5px] text-ink-muted px-1.5 py-0.2 rounded-[4px] bg-surface-subtle border border-border-subtle shrink-0">
                        {item.customer_id}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-ink-secondary truncate mt-0.5">
                      <strong className="text-ink">{item.title}: </strong>
                      {item.description || item.reason}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-secondary shrink-0"
                  onClick={() => onSelectCustomer(item.customer_id)}
                >
                  <span>بررسی اقدام</span>
                  <ChevronLeft size={12} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
