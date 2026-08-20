import React from 'react';
import { Flame, ArrowLeft, ChevronLeft, Clock } from 'lucide-react';
import type { NegotiationOffer } from '../../types';
import { formatPercent, formatDays } from '../../utils/formatters';
import { getCustomerTradeName } from '../../utils/customerNames';

interface TopNegotiationsCardProps {
  negotiations: NegotiationOffer[];
  onSelectCustomer: (customerId: string) => void;
  onViewAll: () => void;
  isLoading?: boolean;
}

export const TopNegotiationsCard: React.FC<TopNegotiationsCardProps> = ({
  negotiations,
  onSelectCustomer,
  onViewAll,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="card-panel h-64 flex items-center justify-center text-ink-muted text-xs animate-pulse">
        در حال پایش آفرهای در حال مذاکره...
      </div>
    );
  }

  // Sorted by aging severity (Critical first) then discount_pct
  const sorted = [...negotiations].sort((a, b) => {
    const sevMap: Record<string, number> = { Critical: 3, High: 2, Medium: 1, Low: 0 };
    const diff = (sevMap[b.aging_severity] || 0) - (sevMap[a.aging_severity] || 0);
    if (diff !== 0) return diff;
    return (b.discount_pct || 0) - (a.discount_pct || 0);
  });

  const top5 = sorted.slice(0, 5);

  return (
    <div className="card-panel flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="section-header">
          <div>
            <div className="section-title">
              <span className="w-6 h-6 rounded-[6px] bg-brand-pale text-brand flex items-center justify-center">
                <Flame size={14} />
              </span>
              <span>آفرهای تجاری و مینی‌پایپ‌لاین مذاکرات</span>
            </div>
            <span className="section-subtitle">۵ آفر مهم بر اساس درصد تخفیف و زمان راکد بودن معامله</span>
          </div>

          <button type="button" className="view-all-cta" onClick={onViewAll}>
            <span>مشاهده همه ({negotiations.length})</span>
            <ArrowLeft size={13} />
          </button>
        </div>

        {/* Top 5 Items List with Mini-Pipeline */}
        <div className="flex flex-col gap-2.5 mt-3.5">
          {top5.length === 0 ? (
            <div className="text-center py-6 text-xs text-ink-muted">پیشنهاد قیمتی بازی یافت نشد.</div>
          ) : (
            top5.map((neg, idx) => {
              const isCrit = neg.aging_severity === 'Critical';
              const companyName = getCustomerTradeName(neg.customer_id);

              return (
                <div
                  key={neg.offer_id}
                  className="flex flex-col p-2.5 rounded-[8px] border border-border-subtle bg-surface hover:bg-surface-subtle/50 transition-all text-xs gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="font-mono text-ink-faint font-semibold text-[11px] w-4 text-center">
                        0{idx + 1}
                      </span>

                      <button
                        type="button"
                        className="font-bold text-ink hover:text-brand truncate text-right cursor-pointer"
                        onClick={() => onSelectCustomer(neg.customer_id)}
                        title={`${companyName} (${neg.customer_id})`}
                      >
                        {companyName}
                      </button>

                      <span className="font-mono text-[10px] text-ink-muted px-1.5 py-0.2 rounded-[4px] bg-surface-subtle border border-border-subtle shrink-0">
                        {neg.customer_id}
                      </span>

                      <span className="badge badge-neutral text-[10px] shrink-0">{neg.product_family}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold text-brand text-[12.5px]">
                        تخفیف: {formatPercent(neg.discount_pct)}
                      </span>
                      <button
                        type="button"
                        className="p-1 rounded-[6px] text-ink-muted hover:text-brand hover:bg-brand-pale transition-colors cursor-pointer"
                        onClick={() => onSelectCustomer(neg.customer_id)}
                      >
                        <ChevronLeft size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Mini Pipeline Stage Indicator */}
                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-border-subtle/60 text-ink-muted">
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} className={isCrit ? 'text-alert-red' : 'text-alert-amber'} />
                      <span>مدت راکد بودن: <strong className="font-mono text-ink">{formatDays(neg.days_in_negotiation)}</strong></span>
                    </div>

                    <span
                      className={`badge text-[10px] ${
                        isCrit ? 'badge-risk-high' : 'badge-risk-medium'
                      }`}
                    >
                      {isCrit ? 'راکد بحرانی (نیاز به مداخله)' : 'در جریان مذاکره'}
                    </span>
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
