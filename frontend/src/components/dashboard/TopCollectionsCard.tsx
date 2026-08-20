import React from 'react';
import { CreditCard, ArrowLeft, ChevronLeft } from 'lucide-react';
import type { RiskyCollection } from '../../types';
import { formatDays, formatRials } from '../../utils/formatters';
import { getCustomerTradeName } from '../../utils/customerNames';

interface TopCollectionsCardProps {
  collections: RiskyCollection[];
  onSelectCustomer: (customerId: string) => void;
  onViewAll: () => void;
  isLoading?: boolean;
}

export const TopCollectionsCard: React.FC<TopCollectionsCardProps> = ({
  collections,
  onSelectCustomer,
  onViewAll,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="card-panel h-64 flex items-center justify-center text-ink-muted text-xs animate-pulse">
        در حال ارزیابی مطالبات معوق...
      </div>
    );
  }

  // Sorted by amount descending
  const sorted = [...collections].sort((a, b) => (b.amount || 0) - (a.amount || 0));
  const top5 = sorted.slice(0, 5);

  return (
    <div className="card-panel flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="section-header">
          <div>
            <div className="section-title">
              <span className="w-6 h-6 rounded-[6px] bg-alert-red-bg text-alert-red flex items-center justify-center border border-alert-red-border">
                <CreditCard size={14} />
              </span>
              <span>وصول‌های پرریسک و معوقات</span>
            </div>
            <span className="section-subtitle">۵ حساب با بیشترین مبلغ سررسیدشده و ریسک تاخیر پرداخت</span>
          </div>

          <button type="button" className="view-all-cta" onClick={onViewAll}>
            <span>مشاهده همه ({collections.length})</span>
            <ArrowLeft size={13} />
          </button>
        </div>

        {/* Top 5 Items List */}
        <div className="flex flex-col gap-2.5 mt-3.5">
          {top5.length === 0 ? (
            <div className="text-center py-6 text-xs text-ink-muted">مطالبات معوق بحرانی وجود ندارد.</div>
          ) : (
            top5.map((col, idx) => {
              const companyName = getCustomerTradeName(col.customer_id);

              return (
                <div
                  key={col.customer_id}
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
                          onClick={() => onSelectCustomer(col.customer_id)}
                          title={`${companyName} (${col.customer_id})`}
                        >
                          {companyName}
                        </button>
                        <span className="font-mono text-[10px] text-ink-muted px-1.5 py-0.2 rounded-[4px] bg-surface-subtle border border-border-subtle shrink-0">
                          {col.customer_id}
                        </span>
                        {col.bounced_check && (
                          <span className="badge badge-risk-high text-[10px]">چک برگشتی</span>
                        )}
                      </div>
                      <div className="text-[11.5px] text-ink-secondary truncate mt-0.5">
                        تاخیر: <span className="font-mono font-semibold text-alert-amber-ink">{formatDays(col.delay_days)}</span> | ریسک اعتباری: <span className="font-bold">{col.risk_level}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hero Outstanding Amount */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="text-left">
                      <span className="font-mono font-bold text-alert-red text-[13px] block">
                        {formatRials(col.amount)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="p-1 rounded-[6px] text-ink-muted hover:text-alert-red hover:bg-alert-red-bg transition-colors cursor-pointer"
                      onClick={() => onSelectCustomer(col.customer_id)}
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
