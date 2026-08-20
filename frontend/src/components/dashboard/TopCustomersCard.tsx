import React from 'react';
import { Users, ArrowLeft, ChevronLeft, TrendingUp, TrendingDown } from 'lucide-react';
import type { CustomerAccount } from '../../types';
import { formatPercent, formatRials } from '../../utils/formatters';
import { getCustomerTradeName } from '../../utils/customerNames';

interface TopCustomersCardProps {
  accounts: CustomerAccount[];
  total: number;
  onSelectCustomer: (customerId: string) => void;
  onViewAll: () => void;
  isLoading?: boolean;
}

export const TopCustomersCard: React.FC<TopCustomersCardProps> = ({
  accounts,
  total,
  onSelectCustomer,
  onViewAll,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="card-panel h-64 flex items-center justify-center text-ink-muted text-xs animate-pulse">
        در حال ارزیابی برترین مشتریان تجاری...
      </div>
    );
  }

  // Sorted by lifetime_revenue descending
  const sorted = [...accounts].sort((a, b) => (b.lifetime_revenue || 0) - (a.lifetime_revenue || 0));
  const top5 = sorted.slice(0, 5);

  return (
    <div className="card-panel flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="section-header">
          <div>
            <div className="section-title">
              <span className="w-6 h-6 rounded-[6px] bg-brand-pale text-brand flex items-center justify-center">
                <Users size={14} />
              </span>
              <span>مشتریان استراتژیک و کلیدی</span>
            </div>
            <span className="section-subtitle">۵ مشتری برتر بر اساس ارزش درآمدی کل دوران و سهم سبد</span>
          </div>

          <button type="button" className="view-all-cta" onClick={onViewAll}>
            <span>مشاهده همه ({total})</span>
            <ArrowLeft size={13} />
          </button>
        </div>

        {/* Top 5 Items List */}
        <div className="flex flex-col gap-2.5 mt-3.5">
          {top5.length === 0 ? (
            <div className="text-center py-6 text-xs text-ink-muted">حسابی با این فیلتر یافت نشد.</div>
          ) : (
            top5.map((acc, idx) => {
              const isGrowth = (acc.revenue_trend_pct ?? 0) >= 0;
              const companyName = getCustomerTradeName(acc.customer_id);

              return (
                <div
                  key={acc.customer_id}
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
                          onClick={() => onSelectCustomer(acc.customer_id)}
                          title={`${companyName} (${acc.customer_id})`}
                        >
                          {companyName}
                        </button>
                        <span className="font-mono text-[10px] text-ink-muted px-1.5 py-0.2 rounded-[4px] bg-surface-subtle border border-border-subtle shrink-0">
                          {acc.customer_id}
                        </span>
                        <span
                          className={`font-mono text-[11px] inline-flex items-center gap-0.5 font-bold ${
                            isGrowth ? 'text-brand' : 'text-alert-red'
                          }`}
                        >
                          {isGrowth ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {formatPercent(acc.revenue_trend_pct)}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-ink-secondary truncate mt-0.5">
                        سهم سبد: <strong className="text-ink">{formatPercent(acc.avg_nafis_share_pct)}</strong> | حاشیه سود: <strong>{formatPercent(acc.avg_gross_margin_pct)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Hero Value */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="text-left">
                      <span className="font-mono font-bold text-ink text-[13px] block">
                        {formatRials(acc.lifetime_revenue)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="p-1 rounded-[6px] text-ink-muted hover:text-brand hover:bg-brand-pale transition-colors cursor-pointer"
                      onClick={() => onSelectCustomer(acc.customer_id)}
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
