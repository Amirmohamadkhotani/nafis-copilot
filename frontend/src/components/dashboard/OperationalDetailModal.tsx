import React from 'react';
import {
  X,
  CreditCard,
  ShieldAlert,
  FileText,
  AlertTriangle,
  PhoneCall,
  Layers,
} from 'lucide-react';
import {
  COPAN_DELAYED_COLLECTIONS,
  COPAN_BOUNCED_CHECKS,
  COPAN_OPEN_COMPLAINTS_DETAILS,
  COPAN_PENDING_OFFERS_DETAILS,
  COPAN_ALERTS,
} from '../../data/copanIntelligence';
import type { PageId } from '../layout/Sidebar';

export type OperationalViewType =
  | 'COLLECTIONS'
  | 'BOUNCED_CHECKS'
  | 'COMPLAINTS'
  | 'OFFERS'
  | 'RISKS'
  | null;

interface OperationalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewType: OperationalViewType;
  onSelectCustomer: (customerId: string) => void;
  onNavigate: (page: PageId) => void;
  onOpenInteractionModal: (customerId: string, defaultTitle: string) => void;
  onOpenQualityModal: (complaintId: string, customerName: string) => void;
}

export const OperationalDetailModal: React.FC<OperationalDetailModalProps> = ({
  isOpen,
  onClose,
  viewType,
  onSelectCustomer,
  onNavigate,
  onOpenInteractionModal,
  onOpenQualityModal,
}) => {
  if (!isOpen || !viewType) return null;

  const titles: Record<string, { title: string; subtitle: string; icon: any; badge: string }> = {
    COLLECTIONS: {
      title: 'پایش و مدیریت وصول مطالبات معوق (Delayed Collections)',
      subtitle: 'فاکتورهای سررسیدشده با تاخیر غیرعادی نیازمند پیگیری فوری',
      icon: CreditCard,
      badge: 'وصول و اعتبارات',
    },
    BOUNCED_CHECKS: {
      title: 'دیده‌بان چک‌های برگشتی و واخواست‌شده (Returned Checks)',
      subtitle: 'فهرست چک‌های برگشتی، حساب‌های درگیر و اقدامات حقوقی/اعتباری',
      icon: AlertTriangle,
      badge: 'ریسک اعتباری',
    },
    COMPLAINTS: {
      title: 'شکایات باز کیفی نیازمند مداخله (Open Complaints)',
      subtitle: 'ارتباط مستقیم با خط تولید کارخانه، لات‌های تولیدی و آزمایشگاه QMS',
      icon: ShieldAlert,
      badge: 'کنترل کیفیت',
    },
    OFFERS: {
      title: 'پیشنهادهای قیمت و آفرها در جریان مذاکره (Pending Offers)',
      subtitle: 'پیش‌فاکتورهای نیازمند پیگیری و نهایی‌سازی پیش از اتمام مهلت اعتبار',
      icon: FileText,
      badge: 'پایپ‌لاین فروش',
    },
    RISKS: {
      title: 'دیده‌بان هشدارهای فوری و پرریسک (Critical Alerts)',
      subtitle: 'حساب‌های در معرض خطر ریزش، ضرر حاشیه سود و تهدید رقبا',
      icon: AlertTriangle,
      badge: 'فرماندهی ریسک',
    },
  };

  const currentMeta = titles[viewType] || titles.COLLECTIONS;
  const Icon = currentMeta.icon;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs z-50 transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[860px] max-h-[90vh] overflow-hidden bg-[var(--bg)] border border-[var(--hair-strong)] z-50 rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95"
        style={{ background: 'var(--panel)' }}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--hair)] flex items-center justify-between gap-3 bg-[var(--panel-2)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--gold-soft)] border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] shrink-0">
              <Icon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-[15.5px] text-[var(--text)]">
                  {currentMeta.title}
                </h2>
                <span className="copan-badge badge-gold text-[10.5px]">
                  {currentMeta.badge}
                </span>
              </div>
              <p className="text-[11.5px] text-[var(--text-faint)] mt-0.5">
                {currentMeta.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--panel)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-[12.5px]">
          {/* VIEW: DELAYED COLLECTIONS */}
          {viewType === 'COLLECTIONS' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-xl border border-[var(--hair)]">
                <table className="copan-table">
                  <thead>
                    <tr>
                      <th>مشتری / شناسه</th>
                      <th>شماره فاکتور</th>
                      <th>مبلغ معوق</th>
                      <th>روز تأخیر</th>
                      <th>چک برگشتی</th>
                      <th>وضعیت اعتبار</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COPAN_DELAYED_COLLECTIONS.map((c) => (
                      <tr key={c.customer_id}>
                        <td>
                          <div className="font-bold text-[var(--text)]">{c.customer_name}</div>
                          <div className="text-[10.5px] text-[var(--text-faint)] font-mono">
                            {c.customer_id} • {c.location}
                          </div>
                        </td>
                        <td className="font-mono text-[var(--text-dim)]">{c.invoice_no}</td>
                        <td className="font-mono font-bold text-[var(--risk)]">
                          {(c.amount / 1000000).toFixed(1)} م.ر
                        </td>
                        <td className="font-mono font-bold text-[var(--risk)]">
                          {c.delay_days} روز
                        </td>
                        <td>
                          {c.bounced_checks > 0 ? (
                            <span className="copan-badge badge-risk font-mono font-bold">
                              {c.bounced_checks} فقره
                            </span>
                          ) : (
                            <span className="copan-badge badge-neutral">۰</span>
                          )}
                        </td>
                        <td>
                          <span className="text-[11px] text-[var(--text-dim)]">{c.credit_status}</span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                onOpenInteractionModal(c.customer_id, `پیگیری وصول فاکتور ${c.invoice_no}`);
                                onClose();
                              }}
                              className="copan-btn copan-btn-gold copan-btn-sm text-[11px]"
                              title="ثبت تماس وصول"
                            >
                              <PhoneCall size={12} />
                              <span>پیگیری</span>
                            </button>
                            <button
                              onClick={() => {
                                onSelectCustomer(c.customer_id);
                                onNavigate('customer_360');
                                onClose();
                              }}
                              className="copan-btn copan-btn-secondary copan-btn-sm text-[11px]"
                            >
                              ۳۶۰°
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: BOUNCED CHECKS */}
          {viewType === 'BOUNCED_CHECKS' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-xl border border-[var(--hair)]">
                <table className="copan-table">
                  <thead>
                    <tr>
                      <th>مشتری</th>
                      <th>شماره چک</th>
                      <th>بانک و شعبه</th>
                      <th>مبلغ چک</th>
                      <th>تاریخ برگشت</th>
                      <th>وضعیت پیگیری</th>
                      <th>اقدام فوری</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COPAN_BOUNCED_CHECKS.map((chk) => (
                      <tr key={chk.id}>
                        <td>
                          <div className="font-bold text-[var(--text)]">{chk.customer_name}</div>
                          <div className="text-[10.5px] text-[var(--text-faint)] font-mono">
                            {chk.customer_id} • مسئول: {chk.sales_rep}
                          </div>
                        </td>
                        <td className="font-mono font-bold text-[var(--text)]">{chk.check_number}</td>
                        <td className="text-[11.5px] text-[var(--text-dim)]">{chk.bank}</td>
                        <td className="font-mono font-bold text-[var(--risk)]">
                          {(chk.amount / 1000000).toFixed(1)} م.ر
                        </td>
                        <td className="font-mono text-[var(--text-dim)]">{chk.bounce_date}</td>
                        <td>
                          <span className="copan-badge badge-risk text-[11px]">{chk.status}</span>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              onOpenInteractionModal(chk.customer_id, `اخطار چک برگشتی شماره ${chk.check_number}`);
                              onClose();
                            }}
                            className="copan-btn copan-btn-primary copan-btn-sm text-[11px] font-bold"
                          >
                            اخطار و پیگیری
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: OPEN COMPLAINTS */}
          {viewType === 'COMPLAINTS' && (
            <div className="space-y-3">
              {COPAN_OPEN_COMPLAINTS_DETAILS.map((cmp) => (
                <div
                  key={cmp.complaint_id}
                  className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-2 hover:border-[var(--gold)]/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[13.5px] text-[var(--text)]">
                        {cmp.customer_name}
                      </span>
                      <span className="copan-badge badge-neutral font-mono text-[11px]">
                        {cmp.complaint_id}
                      </span>
                    </div>
                    <span className="copan-badge badge-risk text-[11px] font-bold">
                      {cmp.severity}
                    </span>
                  </div>

                  <div className="text-[12px] text-[var(--text-dim)] font-medium leading-relaxed">
                    «{cmp.defect_type}»
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11.5px] text-[var(--text-faint)] pt-2 border-t border-[var(--hair)]">
                    <div>
                      کد کالا: <b className="font-mono text-[var(--text)]">{cmp.product_id}</b> • لات:{' '}
                      <b className="font-mono text-[var(--gold)]">{cmp.lot_id}</b>
                    </div>
                    <div>
                      اقدام الزامی: <b className="text-[var(--text)]">{cmp.action_required}</b>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => {
                        onOpenQualityModal(cmp.complaint_id, cmp.customer_name);
                        onClose();
                      }}
                      className="copan-btn copan-btn-secondary copan-btn-sm text-[11.5px] font-bold flex items-center gap-1"
                    >
                      <Layers size={13} />
                      <span>ردیابی زنجیره کیفیت QMS</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenInteractionModal(cmp.customer_id, `هماهنگی رفع شکایت ${cmp.complaint_id}`);
                        onClose();
                      }}
                      className="copan-btn copan-btn-gold copan-btn-sm text-[11.5px] font-bold flex items-center gap-1"
                    >
                      <PhoneCall size={13} />
                      <span>ثبت مذاکره</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW: PENDING OFFERS */}
          {viewType === 'OFFERS' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-xl border border-[var(--hair)]">
                <table className="copan-table">
                  <thead>
                    <tr>
                      <th>مشتری / شناسه</th>
                      <th>کد آفر</th>
                      <th>خانواده کالا</th>
                      <th>قیمت پیشنهادی</th>
                      <th>تخفیف</th>
                      <th>مهلت اعتبار</th>
                      <th>ارزش بالقوه</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COPAN_PENDING_OFFERS_DETAILS.map((off) => (
                      <tr key={off.offer_id}>
                        <td>
                          <div className="font-bold text-[var(--text)]">{off.customer_name}</div>
                          <div className="text-[10.5px] text-[var(--text-faint)] font-mono">
                            {off.customer_id} • مسئول: {off.sales_rep}
                          </div>
                        </td>
                        <td className="font-mono font-bold text-[var(--gold)]">{off.offer_id}</td>
                        <td className="text-[11.5px] text-[var(--text-dim)]">{off.product_family}</td>
                        <td className="font-mono font-bold text-[var(--text)]">
                          {off.offered_price.toLocaleString('fa-IR')} ریال
                        </td>
                        <td>
                          <span className="copan-badge badge-gold font-mono">{off.discount_pct}٪</span>
                        </td>
                        <td>
                          <span className="text-[11.5px] font-mono text-[var(--text)]">
                            {off.valid_until} ({off.days_left} روز)
                          </span>
                        </td>
                        <td className="font-mono font-bold text-[var(--positive)]">
                          {(off.potential_revenue / 1000000).toFixed(0)} م.ر
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              onOpenInteractionModal(off.customer_id, `نهایی‌سازی آفر ${off.offer_id}`);
                              onClose();
                            }}
                            className="copan-btn copan-btn-gold copan-btn-sm text-[11px] font-bold"
                          >
                            نهایی‌سازی
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: RISKS */}
          {viewType === 'RISKS' && (
            <div className="space-y-3">
              {COPAN_ALERTS.churn_alerts.concat(COPAN_ALERTS.loss_alerts).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[13px] text-[var(--text)]">
                      {alert.customer_name}
                    </span>
                    <span className="copan-badge badge-risk">{alert.severity}</span>
                  </div>
                  <div className="font-bold text-[12px] text-[var(--risk)]">{alert.title}</div>
                  <div className="text-[11.5px] text-[var(--text-dim)] leading-relaxed">
                    {alert.reason}
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--hair)]">
                    <button
                      onClick={() => {
                        onSelectCustomer(alert.customer_id);
                        onNavigate('customer_360');
                        onClose();
                      }}
                      className="copan-btn copan-btn-secondary copan-btn-sm text-[11px]"
                    >
                      ۳۶۰° پروفایل
                    </button>
                    <button
                      onClick={() => {
                        onOpenInteractionModal(alert.customer_id, `اقدام پیشگیرانه: ${alert.title}`);
                        onClose();
                      }}
                      className="copan-btn copan-btn-gold copan-btn-sm text-[11px]"
                    >
                      ثبت اقدام
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--hair)] bg-[var(--panel-2)] flex items-center justify-between">
          <span className="text-[11.5px] text-[var(--text-faint)]">
            داده‌های همگام با پایگاه تحلیلی نفیس‌نخ
          </span>
          <button
            onClick={onClose}
            className="copan-btn copan-btn-secondary copan-btn-sm text-[12px] font-bold"
          >
            بستن پنجره
          </button>
        </div>
      </div>
    </>
  );
};
