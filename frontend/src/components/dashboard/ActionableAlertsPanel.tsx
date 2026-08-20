import React, { useState } from 'react';
import { AlertCircle, ChevronLeft } from 'lucide-react';
import type { DashboardAlertsResponse } from '../../types';

interface ActionableAlertsPanelProps {
  alerts: DashboardAlertsResponse | null;
  onSelectCustomer: (customerId: string) => void;
  onOpenQualityModal?: (complaintId: string) => void;
  isLoading?: boolean;
}

export const ActionableAlertsPanel: React.FC<ActionableAlertsPanelProps> = ({
  alerts,
  onSelectCustomer,
  onOpenQualityModal: _onOpenQualityModal,
  isLoading,
}) => {
  const [category, setCategory] = useState<'critical' | 'action' | 'info'>('critical');
  const [showAll, setShowAll] = useState(false);

  if (isLoading || !alerts) {
    return (
      <div className="card-panel h-64 flex items-center justify-center text-ink-muted text-xs animate-pulse">
        در حال پایش هشدارهای عملیاتی...
      </div>
    );
  }

  // Map to 3 clean categories
  const criticalList = [
    ...alerts.risk_alerts.filter((a) => a.severity === 'Critical'),
    ...alerts.complaint_alerts.filter((c) => c.severity === 'Critical'),
  ];

  const actionList = [
    ...alerts.action_alerts,
    ...alerts.risk_alerts.filter((a) => a.severity === 'High'),
    ...alerts.complaint_alerts.filter((c) => c.severity !== 'Critical'),
  ];

  const infoList = alerts.risk_alerts.filter((a) => a.severity === 'Medium' || a.severity === 'Low');

  const activeItems =
    category === 'critical'
      ? criticalList
      : category === 'action'
      ? actionList
      : infoList;

  const displayedItems = showAll ? activeItems : activeItems.slice(0, 5);

  return (
    <div className="card-panel">
      {/* Header & Category Switcher */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-alert-red-bg text-alert-red flex items-center justify-center border border-alert-red-border">
            <AlertCircle size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-ink">مرکز اقدامات و هشدارهای فعال</h3>
              <span className="badge badge-neutral text-[10.5px]">Top Priorities</span>
            </div>
            <span className="text-[11.5px] text-ink-muted">پایش ریسک‌ها، تعهدات مالی و انطباق کیفی</span>
          </div>
        </div>

        {/* 3 Categories Pills */}
        <div className="flex items-center gap-1 bg-surface-subtle p-1 rounded-sm border border-border-subtle">
          <button
            type="button"
            className={`btn btn-sm ${
              category === 'critical' ? 'btn-primary bg-alert-red text-white' : 'btn-ghost text-ink-muted'
            }`}
            onClick={() => { setCategory('critical'); setShowAll(false); }}
          >
            فوری و بحرانی ({criticalList.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              category === 'action' ? 'btn-primary' : 'btn-ghost text-ink-muted'
            }`}
            onClick={() => { setCategory('action'); setShowAll(false); }}
          >
            نیازمند پیگیری ({actionList.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              category === 'info' ? 'btn-primary' : 'btn-ghost text-ink-muted'
            }`}
            onClick={() => { setCategory('info'); setShowAll(false); }}
          >
            اطلاع‌رسانی ({infoList.length})
          </button>
        </div>
      </div>

      {/* Alert List (Readable in <3s, 5 Top items by default) */}
      <div className="flex flex-col gap-2.5">
        {displayedItems.length === 0 ? (
          <div className="text-center py-8 text-xs text-ink-muted">
            در این بازه موردی برای نمایش وجود ندارد.
          </div>
        ) : (
          displayedItems.map((item: any) => {
            const isCrit = item.severity === 'Critical';
            const isHigh = item.severity === 'High';

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-sm border border-border-subtle bg-surface hover:bg-surface-subtle/50 transition-all gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span
                    className={`badge whitespace-nowrap ${
                      isCrit
                        ? 'badge-risk-high'
                        : isHigh
                        ? 'badge-risk-medium'
                        : 'badge-neutral'
                    }`}
                  >
                    {isCrit ? 'بحرانی' : isHigh ? 'اولویت بالا' : 'عادی'}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink truncate">
                        {item.title}
                      </span>
                      <button
                        type="button"
                        className="text-[11px] font-mono text-brand hover:underline font-bold"
                        onClick={() => onSelectCustomer(item.customer_id)}
                      >
                        {item.customer_id}
                      </button>
                    </div>
                    <p className="text-[11.5px] text-ink-muted truncate mt-0.5">
                      {item.description || item.reason}
                    </p>
                  </div>
                </div>

                {/* Direct Action Trigger */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => onSelectCustomer(item.customer_id)}
                  >
                    <span>بررسی اقدام</span>
                    <ChevronLeft size={12} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* View All / Collapse Button */}
      {activeItems.length > 5 && (
        <div className="mt-3 pt-3 border-t border-border-subtle flex justify-center">
          <button
            type="button"
            className="text-xs font-semibold text-brand hover:text-brand-light flex items-center gap-1.5 py-1 px-3 rounded-sm hover:bg-brand-pale transition-colors cursor-pointer"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                <span>نمایش ۵ مورد اول (مهم‌ترین‌ها)</span>
                <span>↑</span>
              </>
            ) : (
              <>
                <span>مشاهده همه ({activeItems.length} مورد)</span>
                <span>↓</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
