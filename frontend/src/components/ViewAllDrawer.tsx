import React, { useState, useMemo } from 'react';
import { X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPercent, formatDays, formatRials } from '../utils/formatters';
import { getCustomerTradeName } from '../utils/customerNames';

export type ViewAllCategory =
  | 'alerts'
  | 'opportunities'
  | 'collections'
  | 'complaints'
  | 'negotiations'
  | 'followups'
  | 'accounts';

interface ViewAllDrawerProps {
  category: ViewAllCategory | null;
  onClose: () => void;
  data: {
    alerts?: any[];
    opportunities?: any[];
    collections?: any[];
    complaints?: any[];
    negotiations?: any[];
    followups?: any[];
    accounts?: any[];
  };
  onSelectCustomer: (customerId: string) => void;
  onOpenQualityModal?: (complaintId: string) => void;
}

export const ViewAllDrawer: React.FC<ViewAllDrawerProps> = ({
  category,
  onClose,
  data,
  onSelectCustomer,
  onOpenQualityModal,
}) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const getCategoryMeta = () => {
    if (!category) {
      return { title: '', subtitle: '', items: [] };
    }
    switch (category) {
      case 'alerts':
        return {
          title: 'مرکز اقدامات و هشدارهای عملیاتی',
          subtitle: 'فهرست کامل هشدارهای بحرانی، ریسک‌های فوری و انحرافات مالی',
          items: data.alerts || [],
        };
      case 'opportunities':
        return {
          title: 'پایپ‌لاین کامل فرصت‌های رشد سهم سبد',
          subtitle: 'فهرست فرصت‌های ارتقای سهم بازار و پیشنهادهای افزایش فروش',
          items: data.opportunities || [],
        };
      case 'collections':
        return {
          title: 'فهرست کامل مطالبات معوق و اسناد پرریسک',
          subtitle: 'پایش کلیه حساب‌های دارای تاخیر پرداخت، چک‌های سررسیدشده و ریسک مالی',
          items: data.collections || [],
        };
      case 'complaints':
        return {
          title: 'سامانه پیگیری و مدیریت شکایات کیفی',
          subtitle: 'کلیه شکایات باز و در جریان همراه با ارزیابی شدت و روزهای باز بودن',
          items: data.complaints || [],
        };
      case 'negotiations':
        return {
          title: 'مدیریت و پایش آفرهای تجاری و مذاکرات قیمت',
          subtitle: 'فهرست پیشنهادهای قیمت صادرشده، درصد تخفیف و زمان راکد بودن',
          items: data.negotiations || [],
        };
      case 'followups':
        return {
          title: 'صف کامل پیگیری‌های مدیریت و کارشناسان فروش',
          subtitle: 'اولویت‌بندی حساب‌ها برای تماس، پیگیری آفرهای باز و بازیابی تقاضا',
          items: data.followups || [],
        };
      case 'accounts':
        return {
          title: 'بانک اطلاعاتی و پرونده‌های مشتریان B2B',
          subtitle: 'فهرست کلیه حساب‌های تجاری، درآمد دوران و ارزیابی ریسک و سلامت',
          items: data.accounts || [],
        };
    }
  };

  const meta = getCategoryMeta();

  // Filter & Search
  const filteredItems = useMemo(() => {
    let list = [...meta.items];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((item) => {
        const company = getCustomerTradeName(item.customer_id).toLowerCase();
        return (
          (item.customer_id && item.customer_id.toLowerCase().includes(q)) ||
          company.includes(q) ||
          (item.title && item.title.toLowerCase().includes(q)) ||
          (item.description && item.description.toLowerCase().includes(q)) ||
          (item.factual_reason && item.factual_reason.toLowerCase().includes(q)) ||
          (item.complaint_title && item.complaint_title.toLowerCase().includes(q)) ||
          (item.product_family && item.product_family.toLowerCase().includes(q))
        );
      });
    }
    return list;
  }, [meta.items, search]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleRowCustomerClick = (cid: string) => {
    onSelectCustomer(cid);
    onClose();
  };

  if (!category) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface rounded-[14px] border border-border-subtle shadow-modal w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-border-subtle flex items-center justify-between bg-surface-subtle/40">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-ink">{meta.title}</h2>
              <span className="badge badge-brand font-mono">
                {filteredItems.length} مورد
              </span>
            </div>
            <p className="text-xs text-ink-muted mt-0.5">{meta.subtitle}</p>
          </div>

          <button
            type="button"
            className="p-1.5 rounded-[8px] bg-surface text-ink-muted hover:text-ink hover:bg-surface-subtle border border-border-subtle transition-colors cursor-pointer"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-border-subtle flex flex-wrap items-center justify-between gap-3 bg-surface">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              className="input-field w-full pr-8 pl-3 text-xs"
              placeholder="جستجو بر اساس نام شرکت، شناسه مشتری، شرح، کالا..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="text-xs text-ink-muted flex items-center gap-2">
            <span>صفحه {currentPage} از {totalPages}</span>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="data-table-container">
            {/* 1. Alerts Table */}
            {category === 'alerts' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>شدت ریسک</th>
                    <th>نام مشتری / کارخانه</th>
                    <th>عنوان هشدار</th>
                    <th>دلیل و شواهد</th>
                    <th>اقدام</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((item, i) => {
                    const cName = getCustomerTradeName(item.customer_id);
                    return (
                      <tr key={i}>
                        <td>
                          <span className={`badge ${item.severity === 'Critical' ? 'badge-risk-high' : 'badge-risk-medium'}`}>
                            {item.severity === 'Critical' ? 'بحرانی' : 'اولویت بالا'}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-ink hover:text-brand cursor-pointer truncate" onClick={() => handleRowCustomerClick(item.customer_id)}>
                              {cName}
                            </span>
                            <span className="font-mono text-[10.5px] text-ink-muted">({item.customer_id})</span>
                          </div>
                        </td>
                        <td className="font-semibold text-ink">{item.title}</td>
                        <td className="text-ink-secondary text-[12px]">{item.description}</td>
                        <td>
                          <button type="button" className="btn btn-sm btn-secondary" onClick={() => handleRowCustomerClick(item.customer_id)}>
                            بررسی پرونده
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* 2. Opportunities Table */}
            {category === 'opportunities' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>مشتری / کارخانه</th>
                    <th>سگمنت</th>
                    <th>ارزش تخمینی پایپ‌لاین</th>
                    <th>سهم فعلی نفیس</th>
                    <th>رقیب اصلی</th>
                    <th>اقدام پیشنهادی</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((opp, i) => {
                    const cName = getCustomerTradeName(opp.customer_id);
                    return (
                      <tr key={i}>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-ink hover:text-brand cursor-pointer truncate" onClick={() => handleRowCustomerClick(opp.customer_id)}>
                              {cName}
                            </span>
                            <span className="font-mono text-[10.5px] text-ink-muted">({opp.customer_id})</span>
                          </div>
                        </td>
                        <td><span className="badge badge-neutral">سگمنت {opp.customer_segment}</span></td>
                        <td className="font-mono font-bold text-brand text-[13px]">{formatRials(opp.estimated_value)}</td>
                        <td className="font-mono font-semibold">{formatPercent(opp.current_nafis_share_pct)}</td>
                        <td className="text-ink-secondary">{opp.main_competitor}</td>
                        <td className="text-[12px]">{opp.next_action}</td>
                        <td>
                          <button type="button" className="btn btn-sm btn-secondary" onClick={() => handleRowCustomerClick(opp.customer_id)}>
                            مشاهده
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* 3. Collections Table */}
            {category === 'collections' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>مشتری / کارخانه</th>
                    <th>مبلغ بدهی معوق</th>
                    <th>مدت تأخیر</th>
                    <th>چک برگشتی</th>
                    <th>سطح ریسک</th>
                    <th>اقدام</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((col, i) => {
                    const cName = getCustomerTradeName(col.customer_id);
                    return (
                      <tr key={i}>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-ink hover:text-brand cursor-pointer truncate" onClick={() => handleRowCustomerClick(col.customer_id)}>
                              {cName}
                            </span>
                            <span className="font-mono text-[10.5px] text-ink-muted">({col.customer_id})</span>
                          </div>
                        </td>
                        <td className="font-mono font-bold text-alert-red text-[13px]">
                          {formatRials(col.amount)}
                        </td>
                        <td className="font-mono text-alert-amber-ink font-semibold">{formatDays(col.delay_days)}</td>
                        <td>{col.bounced_check ? <span className="badge badge-risk-high">دارد</span> : <span className="text-ink-muted">ندارد</span>}</td>
                        <td>
                          <span className={`badge ${col.risk_level === 'Critical' ? 'badge-risk-high' : 'badge-risk-medium'}`}>
                            {col.risk_level}
                          </span>
                        </td>
                        <td>
                          <button type="button" className="btn btn-sm btn-secondary" onClick={() => handleRowCustomerClick(col.customer_id)}>
                            پیگیری مالی
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* 4. Complaints Table */}
            {category === 'complaints' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>شناسه شکایت</th>
                    <th>مشتری / کارخانه</th>
                    <th>شدت</th>
                    <th>عنوان عیب کیفی</th>
                    <th>مدت باز بودن</th>
                    <th>ردیابی کیفیت</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((cmp, i) => {
                    const cName = getCustomerTradeName(cmp.customer_id);
                    return (
                      <tr key={i}>
                        <td className="font-mono text-xs">{cmp.complaint_id}</td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-ink hover:text-brand cursor-pointer truncate" onClick={() => handleRowCustomerClick(cmp.customer_id)}>
                              {cName}
                            </span>
                            <span className="font-mono text-[10.5px] text-ink-muted">({cmp.customer_id})</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${cmp.severity === 'Critical' ? 'badge-risk-high' : 'badge-risk-medium'}`}>
                            {cmp.severity}
                          </span>
                        </td>
                        <td className="text-ink font-medium">{cmp.complaint_title}</td>
                        <td className="font-mono">{formatDays(cmp.days_open)}</td>
                        <td>
                          {onOpenQualityModal && (
                            <button type="button" className="btn btn-sm btn-secondary" onClick={() => { onOpenQualityModal(cmp.complaint_id); onClose(); }}>
                              ردیابی QMS
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* 5. Negotiations Table */}
            {category === 'negotiations' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>شناسه آفر</th>
                    <th>مشتری / کارخانه</th>
                    <th>خانواده محصول</th>
                    <th>درصد تخفیف</th>
                    <th>مدت در مذاکره</th>
                    <th>وضعیت رکود</th>
                    <th>اقدام</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((neg, i) => {
                    const cName = getCustomerTradeName(neg.customer_id);
                    return (
                      <tr key={i}>
                        <td className="font-mono text-xs">{neg.offer_id}</td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-ink hover:text-brand cursor-pointer truncate" onClick={() => handleRowCustomerClick(neg.customer_id)}>
                              {cName}
                            </span>
                            <span className="font-mono text-[10.5px] text-ink-muted">({neg.customer_id})</span>
                          </div>
                        </td>
                        <td><span className="badge badge-neutral">{neg.product_family}</span></td>
                        <td className="font-mono font-bold text-brand">{formatPercent(neg.discount_pct)}</td>
                        <td className="font-mono">{formatDays(neg.days_in_negotiation)}</td>
                        <td>
                          <span className={`badge ${neg.aging_severity === 'Critical' ? 'badge-risk-high' : 'badge-risk-medium'}`}>
                            {neg.aging_severity === 'Critical' ? 'راکد بحرانی' : 'طولانی'}
                          </span>
                        </td>
                        <td>
                          <button type="button" className="btn btn-sm btn-secondary" onClick={() => handleRowCustomerClick(neg.customer_id)}>
                            پیگیری آفر
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* 6. Follow-ups Table */}
            {category === 'followups' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>مشتری / کارخانه</th>
                    <th>اولویت</th>
                    <th>علت تماس شواهد‌محور</th>
                    <th>اقدام بعدی پیشنهادی</th>
                    <th>اقدام</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((fol, i) => {
                    const cName = getCustomerTradeName(fol.customer_id);
                    return (
                      <tr key={i}>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-ink hover:text-brand cursor-pointer truncate" onClick={() => handleRowCustomerClick(fol.customer_id)}>
                              {cName}
                            </span>
                            <span className="font-mono text-[10.5px] text-ink-muted">({fol.customer_id})</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${fol.priority === 'Critical' ? 'badge-risk-high' : 'badge-risk-medium'}`}>
                            {fol.priority}
                          </span>
                        </td>
                        <td className="text-ink-secondary text-[12px]">{fol.factual_reason}</td>
                        <td className="font-medium text-ink text-[12px]">{fol.recommended_action}</td>
                        <td>
                          <button type="button" className="btn btn-sm btn-secondary" onClick={() => handleRowCustomerClick(fol.customer_id)}>
                            ثبت تماس
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* 7. Accounts Table */}
            {category === 'accounts' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>نام کارخانه / شناسه</th>
                    <th>سگمنت / موقعیت</th>
                    <th>فروش دوران</th>
                    <th>روند رشد</th>
                    <th>حاشیه سود</th>
                    <th>سهم نفیس</th>
                    <th>شاخص ریسک</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((acc, i) => {
                    const cName = getCustomerTradeName(acc.customer_id);
                    return (
                      <tr key={i}>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-ink hover:text-brand cursor-pointer truncate" onClick={() => handleRowCustomerClick(acc.customer_id)}>
                              {cName}
                            </span>
                            <span className="font-mono text-[10.5px] text-ink-muted">({acc.customer_id})</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-neutral text-[10px]">سگمنت {acc.customer_segment}</span>
                          <span className="text-ink-muted text-[11px] mr-1.5">{acc.location_id}</span>
                        </td>
                        <td className="font-mono font-bold">{formatRials(acc.lifetime_revenue)}</td>
                        <td className="font-mono font-semibold text-brand">{formatPercent(acc.revenue_trend_pct)}</td>
                        <td className="font-mono">{formatPercent(acc.avg_gross_margin_pct)}</td>
                        <td className="font-mono font-bold text-brand">{formatPercent(acc.avg_nafis_share_pct)}</td>
                        <td>
                          <span className={`badge ${(acc.risk_score || 0) >= 60 ? 'badge-risk-high' : 'badge-risk-low'}`}>
                            ریسک {acc.risk_score || 0}/100
                          </span>
                        </td>
                        <td>
                          <button type="button" className="btn btn-sm btn-secondary" onClick={() => handleRowCustomerClick(acc.customer_id)}>
                            پرونده ۳۶۰
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Drawer Footer with Pagination */}
        <div className="p-4 border-t border-border-subtle flex items-center justify-between bg-surface-subtle/30">
          <span className="text-xs text-ink-muted">
            نمایش {(currentPage - 1) * pageSize + 1} تا {Math.min(currentPage * pageSize, filteredItems.length)} از {filteredItems.length} رکورد
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronRight size={13} />
              <span>قبلی</span>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <span>بعدی</span>
              <ChevronLeft size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
