import React from 'react';
import {
  Users,
  PhoneCall,
  ChevronLeft,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useCopan } from '../../context/CopanContext';
import type { PageId } from '../layout/Sidebar';

interface CustomerFollowupsCardProps {
  onSelectCustomer: (customerId: string) => void;
  onNavigate: (page: PageId) => void;
  onOpenInteractionModal: (customerId: string, defaultAction: string) => void;
}

export const CustomerFollowupsCard: React.FC<CustomerFollowupsCardProps> = ({
  onSelectCustomer,
  onNavigate,
  onOpenInteractionModal,
}) => {
  const { customers } = useCopan();

  // Filter customers that have a critical/high next step or are at risk / needs attention
  const priorityFollowups = customers
    .filter((c) => c.health_status === 'At Risk' || c.health_status === 'Needs Attention' || c.opportunity_score >= 80)
    .slice(0, 5);

  return (
    <div className="copan-card space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--hair)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[var(--gold-soft)] text-[var(--gold)]">
              <Users size={16} />
            </div>
            <h3 className="font-extrabold text-[15px] text-[var(--text)]">
              دیده‌بان پیگیری مشتریان و اقدام بعدی (Customer Follow-ups & Next Steps)
            </h3>
            <span className="copan-badge badge-gold text-[10.5px] font-mono font-bold">
              {priorityFollowups.length} حساب نیازمند تماس
            </span>
          </div>
          <p className="text-[11.5px] text-[var(--text-faint)] mt-0.5">
            ارائه اقدام بعدی هوشمند (Next Step) به همراه علت داده‌محور برای هر مشتری
          </p>
        </div>

        <button
          onClick={() => onNavigate('customers')}
          className="text-[12px] font-bold text-[var(--gold)] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>مشاهده کل ۶۴۴ حساب</span>
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* Customer Follow-up Items */}
      <div className="space-y-3">
        {priorityFollowups.map((cust) => {
          const isAtRisk = cust.health_status === 'At Risk';
          return (
            <div
              key={cust.customer_id}
              className={`p-4 rounded-xl bg-[var(--panel-2)] border transition-all duration-150 space-y-2.5 ${
                isAtRisk
                  ? 'border-[var(--risk-border)]/70 hover:border-[var(--risk)]'
                  : 'border-[var(--hair)] hover:border-[var(--gold)]/40'
              }`}
            >
              {/* Top Row: Customer info & Status */}
              <div className="flex items-center justify-between gap-2">
                <div
                  onClick={() => {
                    onSelectCustomer(cust.customer_id);
                    onNavigate('customer_360');
                  }}
                  className="flex items-center gap-2 cursor-pointer group/cust min-w-0"
                >
                  <Building2 size={16} className="text-[var(--gold)] shrink-0" />
                  <span className="font-extrabold text-[14px] text-[var(--text)] group-hover/cust:text-[var(--gold)] group-hover/cust:underline truncate">
                    {cust.customer_name}
                  </span>
                  <span className="text-[10.5px] font-mono text-[var(--text-faint)]">
                    ({cust.customer_id})
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`copan-badge ${
                      isAtRisk
                        ? 'badge-risk'
                        : cust.health_status === 'Needs Attention'
                        ? 'badge-gold'
                        : 'badge-positive'
                    } text-[10.5px] font-bold`}
                  >
                    {isAtRisk ? 'در معرض ریزش' : 'نیازمند توجه'}
                  </span>
                </div>
              </div>

              {/* 🎯 PROMINENT NEXT STEP & WHY */}
              <div className="p-3 rounded-lg bg-[var(--panel)] border border-[var(--hair)] space-y-1.5 text-[12px] leading-relaxed">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="font-extrabold text-[var(--gold)] flex items-center gap-1.5">
                    <Sparkles size={14} />
                    <span>اقدام بعدی الزامی: {cust.next_step_action || cust.latest_next_action}</span>
                  </div>
                  {cust.next_step_due && (
                    <span className="text-[10.5px] font-mono font-bold text-[var(--text-faint)]">
                      موعد: {cust.next_step_due}
                    </span>
                  )}
                </div>

                <div className="text-[11.5px] text-[var(--text-dim)] pt-1 border-t border-[var(--hair)]">
                  <span className="font-bold text-[var(--text-faint)]">علت پیشنهاد: </span>
                          <span>{cust.next_step_reason || 'داده کافی موجود نیست'}</span>
                </div>
              </div>

              {/* Footer: Sales & Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="text-[11.5px] text-[var(--text-faint)] flex items-center gap-3">
                  <span>گردش مالی: <b className="font-mono text-[var(--text)]">{(cust.lifetime_revenue / 1000000).toFixed(0)} م.ر</b></span>
                  <span>آخرین تعامل: <b className="font-mono text-[var(--text)]">{cust.last_interaction_date}</b></span>
                  <span>مسئول: {cust.sales_rep_name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenInteractionModal(cust.customer_id, cust.next_step_action || cust.latest_next_action)}
                    className="copan-btn copan-btn-gold copan-btn-sm text-[11px] font-bold flex items-center gap-1 shadow-xs"
                    title="ثبت مکالمه جدید با این مشتری"
                  >
                    <PhoneCall size={12} />
                    <span>ثبت مکالمه</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectCustomer(cust.customer_id);
                      onNavigate('customer_360');
                    }}
                    className="copan-btn copan-btn-secondary copan-btn-sm text-[11px] font-bold"
                  >
                    پروفایل ۳۶۰°
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
