import React from 'react';
import { ShieldAlert, ArrowLeft, ChevronLeft } from 'lucide-react';
import type { OpenComplaint } from '../../types';
import { formatDays } from '../../utils/formatters';
import { getCustomerTradeName } from '../../utils/customerNames';

interface TopComplaintsCardProps {
  complaints: OpenComplaint[];
  onSelectCustomer: (customerId: string) => void;
  onOpenQualityModal?: (complaintId: string) => void;
  onViewAll: () => void;
  isLoading?: boolean;
}

export const TopComplaintsCard: React.FC<TopComplaintsCardProps> = ({
  complaints,
  onSelectCustomer,
  onOpenQualityModal,
  onViewAll,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="card-panel h-64 flex items-center justify-center text-ink-muted text-xs animate-pulse">
        در حال پایش شکایات کیفی و آزمایشگاهی...
      </div>
    );
  }

  // Sorted by severity (Critical first) then days_open
  const sorted = [...complaints].sort((a, b) => {
    const sevMap: Record<string, number> = { Critical: 3, High: 2, Medium: 1, Low: 0 };
    const diff = (sevMap[b.severity] || 0) - (sevMap[a.severity] || 0);
    if (diff !== 0) return diff;
    return (b.days_open || 0) - (a.days_open || 0);
  });

  const top5 = sorted.slice(0, 5);

  return (
    <div className="card-panel flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="section-header">
          <div>
            <div className="section-title">
              <span className="w-6 h-6 rounded-[6px] bg-alert-red-bg text-alert-red flex items-center justify-center border border-alert-red-border">
                <ShieldAlert size={14} />
              </span>
              <span>شکایات باز و انطباق کیفی</span>
            </div>
            <span className="section-subtitle">۵ شکایت مهم بر اساس شدت عیب فیلامنت و مدت باز بودن</span>
          </div>

          <button type="button" className="view-all-cta" onClick={onViewAll}>
            <span>مشاهده همه ({complaints.length})</span>
            <ArrowLeft size={13} />
          </button>
        </div>

        {/* Top 5 Items List */}
        <div className="flex flex-col gap-2.5 mt-3.5">
          {top5.length === 0 ? (
            <div className="text-center py-6 text-xs text-ink-muted">شکایت بازی در سیستم ثبت نشده است.</div>
          ) : (
            top5.map((cmp, idx) => {
              const isCrit = cmp.severity === 'Critical';
              const companyName = getCustomerTradeName(cmp.customer_id);

              return (
                <div
                  key={cmp.complaint_id}
                  className="flex items-center justify-between p-2.5 rounded-[8px] border border-border-subtle bg-surface hover:bg-surface-subtle/50 transition-all text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="font-mono text-ink-faint font-semibold text-[11px] w-4 text-center">
                      0{idx + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="font-bold text-ink hover:text-brand truncate text-right cursor-pointer"
                          onClick={() => onSelectCustomer(cmp.customer_id)}
                          title={`${companyName} (${cmp.customer_id})`}
                        >
                          {companyName}
                        </button>
                        <span className="font-mono text-[10px] text-ink-muted px-1.5 py-0.2 rounded-[4px] bg-surface-subtle border border-border-subtle shrink-0">
                          {cmp.customer_id}
                        </span>
                        <span className={`badge ${isCrit ? 'badge-risk-high' : 'badge-risk-medium'}`}>
                          {isCrit ? 'بحرانی' : 'اولویت بالا'}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-ink-secondary truncate mt-0.5 font-medium">
                        {cmp.complaint_title}
                      </div>
                    </div>
                  </div>

                  {/* Hero Days Open & Action */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="text-left">
                      <span className="font-mono font-bold text-ink text-[12px] block">
                        {formatDays(cmp.days_open)}
                      </span>
                      <span className="text-[10px] text-ink-muted">مدت باز بودن</span>
                    </div>

                    {onOpenQualityModal ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary text-[11px]"
                        onClick={() => onOpenQualityModal(cmp.complaint_id)}
                      >
                        <span>ردیابی QMS</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="p-1 rounded-[6px] text-ink-muted hover:text-brand transition-colors cursor-pointer"
                        onClick={() => onSelectCustomer(cmp.customer_id)}
                      >
                        <ChevronLeft size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
