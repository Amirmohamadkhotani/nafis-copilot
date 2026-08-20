import React, { useState } from 'react';
import { ArrowUpDown, ChevronLeft, TrendingUp, TrendingDown } from 'lucide-react';
import type { CustomerAccount } from '../types';
import { formatPercent } from '../utils/formatters';

interface AccountListProps {
  accounts: CustomerAccount[];
  total: number;
  selectedCustomerId?: string;
  onSelectCustomer: (customerId: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: string;
  sortDir: string;
  onSortChange: (sortCol: string) => void;
}

export const AccountList: React.FC<AccountListProps> = ({
  accounts,
  total,
  selectedCustomerId,
  onSelectCustomer,
  statusFilter,
  onStatusFilterChange,
  sortBy: _sortBy,
  sortDir: _sortDir,
  onSortChange,
}) => {
  const [showAll, setShowAll] = useState(false);

  const displayedAccounts = showAll ? accounts : accounts.slice(0, 5);

  return (
    <div className="card-panel">
      {/* Header & Filter Pills */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-ink">حساب‌های تجاری مشتریان ({total})</h2>
              <span className="badge badge-brand text-[10.5px]">Top 5 Overview</span>
            </div>
            <span className="text-[11.5px] text-ink-muted">پایش عملکرد فروش و اولویت‌بندی تصمیم‌گیری</span>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-1 bg-surface-subtle p-1 rounded-sm border border-border-subtle">
          {[
            { id: 'All', label: 'همه حساب‌ها' },
            { id: 'At Risk', label: 'در معرض ریزش' },
            { id: 'Needs Attention', label: 'نیازمند پیگیری' },
            { id: 'Healthy', label: 'وضعیت مطلوب' },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              className={`btn btn-sm ${
                statusFilter === st.id ? 'btn-primary' : 'btn-ghost text-ink-muted'
              }`}
              onClick={() => {
                onStatusFilterChange(st.id);
                setShowAll(false);
              }}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Data Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => onSortChange('customer_id')} className="cursor-pointer">
                شناسه مشتری <ArrowUpDown size={11} className="inline mr-1" />
              </th>
              <th>سگمنت / موقعیت</th>
              <th onClick={() => onSortChange('lifetime_revenue')} className="cursor-pointer">
                درآمد کل <ArrowUpDown size={11} className="inline mr-1" />
              </th>
              <th onClick={() => onSortChange('revenue_trend_pct')} className="cursor-pointer">
                روند رشد <ArrowUpDown size={11} className="inline mr-1" />
              </th>
              <th onClick={() => onSortChange('avg_gross_margin_pct')} className="cursor-pointer">
                حاشیه سود <ArrowUpDown size={11} className="inline mr-1" />
              </th>
              <th onClick={() => onSortChange('avg_nafis_share_pct')} className="cursor-pointer">
                سهم نفیس / رقبا <ArrowUpDown size={11} className="inline mr-1" />
              </th>
              <th onClick={() => onSortChange('risk_score')} className="cursor-pointer">
                شاخص ریسک <ArrowUpDown size={11} className="inline mr-1" />
              </th>
              <th>اقدام بعدی پیشنهادی</th>
              <th>پرونده ۳۶۰</th>
            </tr>
          </thead>
          <tbody>
            {displayedAccounts.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-ink-muted">
                  هیچ حسابی با فیلترهای انتخابی یافت نشد.
                </td>
              </tr>
            ) : (
              displayedAccounts.map((acc) => {
                const isSelected = selectedCustomerId === acc.customer_id;
                const isGrowth = (acc.revenue_trend_pct ?? 0) >= 0;

                return (
                  <tr
                    key={acc.customer_id}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-brand-pale/60 font-semibold' : ''
                    }`}
                    onClick={() => onSelectCustomer(acc.customer_id)}
                  >
                    <td className="font-mono font-bold text-ink">{acc.customer_id}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <span className="badge badge-neutral text-[10px]">
                          سگمنت {acc.customer_segment}
                        </span>
                        <span className="text-ink-muted text-[11.5px]">{acc.location_id}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-ink">
                          {((acc.lifetime_revenue || 0) / 1_000_000).toFixed(0)}M ریال
                        </span>
                        <div className="w-20 bg-surface-subtle h-1 rounded-none overflow-hidden mt-1">
                          <div
                            className="h-full bg-brand"
                            style={{ width: `${Math.min(100, Math.max(10, ((acc.lifetime_revenue || 0) / 360_000_000) * 100))}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`font-mono text-xs inline-flex items-center gap-0.5 font-bold ${
                          isGrowth ? 'text-brand' : 'text-alert-red'
                        }`}
                      >
                        {isGrowth ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {formatPercent(acc.revenue_trend_pct)}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono font-semibold">{formatPercent(acc.avg_gross_margin_pct)}</span>
                    </td>
                    <td>
                      <div className="flex flex-col text-[11.5px]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-brand">
                            {formatPercent(acc.avg_nafis_share_pct)}
                          </span>
                          <div className="w-14 bg-surface-subtle h-1 rounded-none overflow-hidden">
                            <div
                              className="h-full bg-brand"
                              style={{ width: `${acc.avg_nafis_share_pct || 20}%` }}
                            />
                          </div>
                        </div>
                        {acc.main_competitor && (
                          <span className="text-ink-muted block text-[10.5px] mt-0.5">
                            رقیب: {acc.main_competitor}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          (acc.risk_score || 0) >= 70
                            ? 'badge-risk-high'
                            : (acc.risk_score || 0) >= 40
                            ? 'badge-risk-medium'
                            : 'badge-risk-low'
                        }`}
                      >
                        ریسک {acc.risk_score || 0}/100
                      </span>
                    </td>
                    <td className="text-[12px] text-ink-secondary max-w-[200px] truncate">
                      {acc.recommended_action || 'پیگیری تلفنی'}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCustomer(acc.customer_id);
                        }}
                      >
                        <span>پرونده</span>
                        <ChevronLeft size={11} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* View All / Collapse Button */}
      {accounts.length > 5 && (
        <div className="mt-4 pt-3 border-t border-border-subtle/80 flex justify-center">
          <button
            type="button"
            className="text-xs font-semibold text-brand hover:text-brand-light flex items-center gap-1.5 py-1 px-3.5 rounded-sm hover:bg-brand-pale transition-colors cursor-pointer"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                <span>نمایش ۵ حساب اول (برترین‌ها)</span>
                <span>↑</span>
              </>
            ) : (
              <>
                <span>مشاهده همه حساب‌ها ({accounts.length} حساب)</span>
                <span>↓</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
