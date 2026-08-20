import React from 'react';
import { Target, ArrowLeft, ChevronLeft } from 'lucide-react';
import type { SalesOpportunity } from '../../types';
import { formatPercent, formatRials } from '../../utils/formatters';
import { getCustomerTradeName } from '../../utils/customerNames';

interface TopOpportunitiesCardProps {
  opportunities: SalesOpportunity[];
  onSelectCustomer: (customerId: string) => void;
  onViewAll: () => void;
  isLoading?: boolean;
}

export const TopOpportunitiesCard: React.FC<TopOpportunitiesCardProps> = ({
  opportunities,
  onSelectCustomer,
  onViewAll,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="card-panel h-64 flex items-center justify-center text-ink-muted text-xs animate-pulse">
        در حال محاسبه برترین فرصت‌های رشد سهم سبد...
      </div>
    );
  }

  // Sorted by estimated_value descending
  const sorted = [...opportunities].sort((a, b) => (b.estimated_value || 0) - (a.estimated_value || 0));
  const top5 = sorted.slice(0, 5);

  return (
    <div className="card-panel flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="section-header">
          <div>
            <div className="section-title">
              <span className="w-6 h-6 rounded-[6px] bg-brand-pale text-brand flex items-center justify-center">
                <Target size={14} />
              </span>
              <span>برترین فرصت‌های رشد سهم سبد</span>
            </div>
            <span className="section-subtitle">۵ فرصت برتر بر اساس ارزش تخمینی و پتانسیل تصاحب سهم</span>
          </div>

          <button type="button" className="view-all-cta" onClick={onViewAll}>
            <span>مشاهده همه ({opportunities.length})</span>
            <ArrowLeft size={13} />
          </button>
        </div>

        {/* Top 5 Items List */}
        <div className="flex flex-col gap-2.5 mt-3.5">
          {top5.length === 0 ? (
            <div className="text-center py-6 text-xs text-ink-muted">فرصتی با این معیارها یافت نشد.</div>
          ) : (
            top5.map((opp, idx) => {
              const companyName = getCustomerTradeName(opp.customer_id);

              return (
                <div
                  key={opp.customer_id}
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
                          onClick={() => onSelectCustomer(opp.customer_id)}
                          title={`${companyName} (${opp.customer_id})`}
                        >
                          {companyName}
                        </button>
                        <span className="font-mono text-[10px] text-ink-muted px-1.5 py-0.2 rounded-[4px] bg-surface-subtle border border-border-subtle shrink-0">
                          {opp.customer_id}
                        </span>
                        <span className="badge badge-neutral text-[10px]">سگمنت {opp.customer_segment}</span>
                      </div>
                      <div className="text-[11.5px] text-ink-secondary truncate mt-0.5">
                        سهم فعلی نفیس: <strong className="text-ink">{formatPercent(opp.current_nafis_share_pct)}</strong>
                        {opp.main_competitor && ` | رقیب: ${opp.main_competitor}`}
                      </div>
                    </div>
                  </div>

                  {/* Hero Value */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="text-left">
                      <span className="font-mono font-bold text-brand text-[13px] block">
                        {formatRials(opp.estimated_value)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="p-1 rounded-[6px] text-ink-muted hover:text-brand hover:bg-brand-pale transition-colors cursor-pointer"
                      onClick={() => onSelectCustomer(opp.customer_id)}
                    >
                      <ChevronLeft size={14} />
                    </button>
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
