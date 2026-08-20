import React, { useState } from 'react';
import {
  Target,
  CreditCard,
  ShieldAlert,
  Flame,
  UserCheck,
  ChevronLeft,
} from 'lucide-react';
import type {
  SalesOpportunity,
  RiskyCollection,
  OpenComplaint,
  NegotiationOffer,
  FollowUpCustomer,
} from '../../types';
import { formatPercent, formatDays } from '../../utils/formatters';

interface OperationsMatrixProps {
  opportunities: SalesOpportunity[];
  collections: RiskyCollection[];
  complaints: OpenComplaint[];
  negotiations: NegotiationOffer[];
  followups: FollowUpCustomer[];
  onSelectCustomer: (customerId: string) => void;
  onOpenQualityModal?: (complaintId: string) => void;
  onOpenMeetingBrief?: (customerId: string) => void;
  isLoading?: boolean;
}

export const OperationsMatrix: React.FC<OperationsMatrixProps> = ({
  opportunities,
  collections,
  complaints,
  negotiations,
  followups,
  onSelectCustomer,
  onOpenQualityModal,
  onOpenMeetingBrief: _onOpenMeetingBrief,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<
    'followups' | 'opportunities' | 'collections' | 'complaints' | 'negotiations'
  >('followups');
  const [showAll, setShowAll] = useState(false);

  // Switch tab resets showAll to top 5
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setShowAll(false);
  };

  const getListLength = () => {
    switch (activeTab) {
      case 'followups': return followups.length;
      case 'opportunities': return opportunities.length;
      case 'collections': return collections.length;
      case 'complaints': return complaints.length;
      case 'negotiations': return negotiations.length;
    }
  };

  const totalCount = getListLength();

  const displayedFollowups = showAll ? followups : followups.slice(0, 5);
  const displayedOpportunities = showAll ? opportunities : opportunities.slice(0, 5);
  const displayedCollections = showAll ? collections : collections.slice(0, 5);
  const displayedComplaints = showAll ? complaints : complaints.slice(0, 5);
  const displayedNegotiations = showAll ? negotiations : negotiations.slice(0, 5);

  return (
    <div className="card-panel">
      {/* Header & Tabs */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 pb-3 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-ink">ماتریس عملیاتی فروش و تصمیم‌گیری</h3>
            <span className="badge badge-brand text-[10.5px]">Top 5 Operational Queue</span>
          </div>
          <span className="text-[11.5px] text-ink-muted">
            صف پیگیری، فرصت‌های پایپ‌لاین، مطالبات معوق، شکایات باز و آفرهای فعال
          </span>
        </div>

        {/* 5 Operational Tabs */}
        <div className="flex flex-wrap gap-1 bg-surface-subtle p-1 rounded-sm border border-border-subtle">
          <button
            type="button"
            className={`btn btn-sm ${
              activeTab === 'followups' ? 'btn-primary' : 'btn-ghost text-ink-muted'
            }`}
            onClick={() => handleTabChange('followups')}
          >
            <UserCheck size={13} />
            <span>صف پیگیری ({followups.length})</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              activeTab === 'opportunities' ? 'btn-primary' : 'btn-ghost text-ink-muted'
            }`}
            onClick={() => handleTabChange('opportunities')}
          >
            <Target size={13} />
            <span>فرصت‌ها ({opportunities.length})</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              activeTab === 'collections' ? 'btn-primary' : 'btn-ghost text-ink-muted'
            }`}
            onClick={() => handleTabChange('collections')}
          >
            <CreditCard size={13} />
            <span>مطالبات ({collections.length})</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              activeTab === 'complaints' ? 'btn-primary' : 'btn-ghost text-ink-muted'
            }`}
            onClick={() => handleTabChange('complaints')}
          >
            <ShieldAlert size={13} />
            <span>شکایات ({complaints.length})</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              activeTab === 'negotiations' ? 'btn-primary' : 'btn-ghost text-ink-muted'
            }`}
            onClick={() => handleTabChange('negotiations')}
          >
            <Flame size={13} />
            <span>آفرها ({negotiations.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {isLoading ? (
        <div className="h-60 flex items-center justify-center text-ink-muted text-xs animate-pulse">
          در حال استخراج ماتریس عملیات فروش...
        </div>
      ) : (
        <div className="data-table-container">
          {/* 1. Follow-up Queue */}
          {activeTab === 'followups' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>مشتری</th>
                  <th>اولویت اقدام</th>
                  <th>دلیل شواهد‌محور</th>
                  <th>اقدام پیشنهادی</th>
                  <th>پرونده ۳۶۰</th>
                </tr>
              </thead>
              <tbody>
                {displayedFollowups.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-ink-muted">
                      در حال حاضر موردی در صف پیگیری وجود ندارد.
                    </td>
                  </tr>
                ) : (
                  displayedFollowups.map((fol) => (
                    <tr key={fol.customer_id}>
                      <td className="font-mono font-bold text-ink">{fol.customer_id}</td>
                      <td>
                        <span
                          className={`badge ${
                            fol.priority === 'Critical'
                              ? 'badge-risk-high'
                              : fol.priority === 'High'
                              ? 'badge-risk-medium'
                              : 'badge-neutral'
                          }`}
                        >
                          {fol.priority === 'Critical' ? 'P0 - فوری' : fol.priority === 'High' ? 'P1 - مهم' : 'P2 - عادی'}
                        </span>
                      </td>
                      <td className="text-ink-secondary text-[12px]">{fol.factual_reason}</td>
                      <td className="font-medium text-ink text-[12px]">{fol.recommended_action}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => onSelectCustomer(fol.customer_id)}
                        >
                          <span>بررسی</span>
                          <ChevronLeft size={11} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* 2. Opportunities Pipeline */}
          {activeTab === 'opportunities' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>مشتری</th>
                  <th>سگمنت</th>
                  <th>ارزش تخمینی پایپ‌لاین</th>
                  <th>سهم فعلی نفیس</th>
                  <th>رقیب اصلی</th>
                  <th>اقدام پیشنهادی</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {displayedOpportunities.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-ink-muted">
                      در حال حاضر فرصتی با معیارهای فعلی یافت نشد.
                    </td>
                  </tr>
                ) : (
                  displayedOpportunities.map((opp) => (
                    <tr key={opp.customer_id}>
                      <td className="font-mono font-bold text-ink">{opp.customer_id}</td>
                      <td>
                        <span className="badge badge-neutral">سگمنت {opp.customer_segment}</span>
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-brand text-[13px]">
                            {(opp.estimated_value / 1_000_000).toFixed(0)}M ریال
                          </span>
                          <div className="w-24 bg-surface-subtle h-1 rounded-none overflow-hidden mt-1">
                            <div
                              className="h-full bg-brand"
                              style={{ width: `${Math.min(100, Math.max(15, (opp.estimated_value / 50_000_000) * 100))}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold">{formatPercent(opp.current_nafis_share_pct)}</span>
                          <div className="w-16 bg-surface-subtle h-1 rounded-none overflow-hidden">
                            <div
                              className="h-full bg-brand-light"
                              style={{ width: `${opp.current_nafis_share_pct || 20}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="text-ink-secondary">{opp.main_competitor}</td>
                      <td className="text-[12px]">{opp.next_action}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => onSelectCustomer(opp.customer_id)}
                        >
                          <span>پرونده</span>
                          <ChevronLeft size={11} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* 3. Risky Collections */}
          {activeTab === 'collections' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>مشتری</th>
                  <th>مبلغ مطالبات معوق</th>
                  <th>مدت تأخیر</th>
                  <th>چک برگشتی</th>
                  <th>سطح ریسک</th>
                  <th>اقدام</th>
                </tr>
              </thead>
              <tbody>
                {displayedCollections.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-ink-muted">
                      مطالبات معوق بحرانی وجود ندارد.
                    </td>
                  </tr>
                ) : (
                  displayedCollections.map((col) => (
                    <tr key={col.customer_id}>
                      <td className="font-mono font-bold text-ink">{col.customer_id}</td>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-alert-red text-[13px]">
                            {(col.amount / 1_000_000).toFixed(0)} میلیون ریال
                          </span>
                          <div className="w-24 bg-surface-subtle h-1 rounded-none overflow-hidden mt-1">
                            <div
                              className="h-full bg-alert-red"
                              style={{ width: `${Math.min(100, Math.max(20, (col.amount / 15_000_000) * 100))}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="font-mono text-alert-amber-ink font-semibold">
                        {formatDays(col.delay_days)}
                      </td>
                      <td>
                        {col.bounced_check ? (
                          <span className="badge badge-risk-high">چک برگشتی</span>
                        ) : (
                          <span className="text-ink-muted text-xs">ندارد</span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            col.risk_level === 'Critical'
                              ? 'badge-risk-high'
                              : col.risk_level === 'High'
                              ? 'badge-risk-medium'
                              : 'badge-risk-low'
                          }`}
                        >
                          {col.risk_level}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => onSelectCustomer(col.customer_id)}
                        >
                          <span>پیگیری</span>
                          <ChevronLeft size={11} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* 4. Open Complaints */}
          {activeTab === 'complaints' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>شناسه</th>
                  <th>مشتری</th>
                  <th>شدت</th>
                  <th>عنوان عیب کیفی</th>
                  <th>مدت باز بودن</th>
                  <th>بررسی زنجیره کیفیت</th>
                </tr>
              </thead>
              <tbody>
                {displayedComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-ink-muted">
                      شکایت بازی در سیستم ثبت نشده است.
                    </td>
                  </tr>
                ) : (
                  displayedComplaints.map((cmp) => (
                    <tr key={cmp.complaint_id}>
                      <td className="font-mono text-xs">{cmp.complaint_id}</td>
                      <td className="font-mono font-bold text-ink">{cmp.customer_id}</td>
                      <td>
                        <span
                          className={`badge ${
                            cmp.severity === 'Critical'
                              ? 'badge-risk-high'
                              : cmp.severity === 'High'
                              ? 'badge-risk-medium'
                              : 'badge-neutral'
                          }`}
                        >
                          {cmp.severity}
                        </span>
                      </td>
                      <td className="text-ink font-medium">{cmp.complaint_title}</td>
                      <td className="font-mono">{formatDays(cmp.days_open)}</td>
                      <td>
                        {onOpenQualityModal && (
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => onOpenQualityModal(cmp.complaint_id)}
                          >
                            <span>ردیابی QMS</span>
                            <ChevronLeft size={11} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* 5. Negotiation Offers */}
          {activeTab === 'negotiations' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>شناسه آفر</th>
                  <th>مشتری</th>
                  <th>خانواده محصول</th>
                  <th>درصد تخفیف</th>
                  <th>مدت در مذاکره</th>
                  <th>وضعیت راکد بودن</th>
                  <th>اقدام</th>
                </tr>
              </thead>
              <tbody>
                {displayedNegotiations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-ink-muted">
                      پیشنهاد قیمتی در حال حاضر در مرحله مذاکره نیست.
                    </td>
                  </tr>
                ) : (
                  displayedNegotiations.map((neg) => (
                    <tr key={neg.offer_id}>
                      <td className="font-mono text-xs">{neg.offer_id}</td>
                      <td className="font-mono font-bold text-ink">{neg.customer_id}</td>
                      <td>
                        <span className="badge badge-neutral">خانواده {neg.product_family}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-brand">{formatPercent(neg.discount_pct)}</span>
                          <div className="w-16 bg-surface-subtle h-1 rounded-none overflow-hidden">
                            <div
                              className="h-full bg-brand"
                              style={{ width: `${Math.min(100, (neg.discount_pct || 5) * 6)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="font-mono">{formatDays(neg.days_in_negotiation)}</td>
                      <td>
                        <span
                          className={`badge ${
                            neg.aging_severity === 'Critical'
                              ? 'badge-risk-high'
                              : neg.aging_severity === 'High'
                              ? 'badge-risk-medium'
                              : 'badge-risk-low'
                          }`}
                        >
                          {neg.aging_severity === 'Critical' ? 'راکد بحرانی' : neg.aging_severity === 'High' ? 'طولانی' : 'عادی'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => onSelectCustomer(neg.customer_id)}
                        >
                          <span>پیگیری آفر</span>
                          <ChevronLeft size={11} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* View All / Collapse Button */}
      {totalCount > 5 && (
        <div className="mt-3.5 pt-3 border-t border-border-subtle/80 flex justify-center">
          <button
            type="button"
            className="text-xs font-semibold text-brand hover:text-brand-light flex items-center gap-1.5 py-1 px-3.5 rounded-sm hover:bg-brand-pale transition-colors cursor-pointer"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                <span>نمایش ۵ مورد اول (مهم‌ترین‌ها)</span>
                <span>↑</span>
              </>
            ) : (
              <>
                <span>مشاهده همه ({totalCount} مورد)</span>
                <span>↓</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
