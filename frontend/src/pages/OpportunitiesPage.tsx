import React, { useState } from 'react';
import {
  PieChart,
  Bot,
  Zap,
  Calendar,
} from 'lucide-react';
import type { PageId } from '../components/layout/Sidebar';
import { COPAN_OPPORTUNITIES, type CopanOpportunity } from '../data/copanIntelligence';
import { ActionModal } from '../components/modals/ActionModal';

interface OpportunitiesPageProps {
  onNavigate: (page: PageId) => void;
  onSelectCustomer: (customerId: string) => void;
  onOpenCobat: (prompt?: string) => void;
}

export const OpportunitiesPage: React.FC<OpportunitiesPageProps> = ({
  onNavigate,
  onSelectCustomer,
  onOpenCobat,
}) => {
  const [modelFilter, setModelFilter] = useState<'ALL' | 'PURCHASE_PROBABILITY' | 'BASKET_SHARE_DECLINE'>('ALL');
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<CopanOpportunity | null>(null);

  const filteredOpps = COPAN_OPPORTUNITIES.filter((opp) => {
    if (modelFilter !== 'ALL' && opp.model_type !== modelFilter) return false;
    return true;
  });

  const totalPotentialRevenue = filteredOpps.reduce((acc, curr) => acc + curr.potential_revenue, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header & Models Strip */}
      <div className="copan-card space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--hair)]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-[16px] text-[var(--text)]">
                موتور کشف فرصت‌های رشد و سهم بازار (Opportunities Engine)
              </h2>
              <span className="copan-badge badge-positive font-mono text-[11px]">
                {filteredOpps.length} فرصت درآمدی
              </span>
            </div>
            <p className="text-[11.5px] text-[var(--text-faint)] mt-0.5">
              مدل‌های تحلیلی مبتنی بر پیش‌بینی موعد خرید دوره‌ای و تصاحب سهم از دست‌رفته رقبا
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onOpenCobat('استراتژی‌های پیشنهادی برای تصاحب سهم رقبای X و Y چیست؟')}
              className="copan-btn copan-btn-gold text-[12px] font-bold"
            >
              <Bot size={15} />
              استراتژی تصاحب با COBAT
            </button>
          </div>
        </div>

        {/* 2 Core Models Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Model 1: Purchase Probability */}
          <div
            onClick={() => setModelFilter(modelFilter === 'PURCHASE_PROBABILITY' ? 'ALL' : 'PURCHASE_PROBABILITY')}
            className={`p-4 rounded-xl border text-right transition-all cursor-pointer ${
              modelFilter === 'PURCHASE_PROBABILITY'
                ? 'bg-[var(--panel-2)] border-[var(--gold)] shadow-xs'
                : 'bg-[var(--panel)] border-[var(--hair)] hover:border-[var(--hair-strong)]'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] text-[var(--gold)] font-bold">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                مدل ۱: احتمال خرید دوره‌ای
              </span>
              <span className="copan-badge badge-gold">Purchase Probability</span>
            </div>
            <div className="font-extrabold text-[14px] text-[var(--text)] mt-2">
              سررسید چرخه سفارش و اتمام موجودی
            </div>
            <p className="text-[11.5px] text-[var(--text-dim)] mt-1 leading-relaxed">
              شناسایی حساب‌هایی که بر اساس الگوهای تناوب تاریخی در هفته جاری موعد سفارش مجدد دارند.
            </p>
          </div>

          {/* Model 2: Basket Share Decline */}
          <div
            onClick={() => setModelFilter(modelFilter === 'BASKET_SHARE_DECLINE' ? 'ALL' : 'BASKET_SHARE_DECLINE')}
            className={`p-4 rounded-xl border text-right transition-all cursor-pointer ${
              modelFilter === 'BASKET_SHARE_DECLINE'
                ? 'bg-[var(--panel-2)] border-[var(--brand)] shadow-xs'
                : 'bg-[var(--panel)] border-[var(--hair)] hover:border-[var(--hair-strong)]'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] text-[var(--positive)] font-bold">
              <span className="flex items-center gap-1">
                <PieChart size={14} />
                مدل ۲: احیای سهم سبد و تصاحب رقیب
              </span>
              <span className="copan-badge badge-positive">Basket Share Recovery</span>
            </div>
            <div className="font-extrabold text-[14px] text-[var(--text)] mt-2">
              کاهش سهم سبد و نفوذ رقیب
            </div>
            <p className="text-[11.5px] text-[var(--text-dim)] mt-1 leading-relaxed">
              کشف مشتریان با ارزش که سهم نفیس در آن‌ها کاهش یافته اما پتانسیل تصاحب مجدد دارند.
            </p>
          </div>

          {/* Total Revenue Potential Metric */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--gold-soft)] to-[var(--panel-2)] border border-[var(--gold)]/30 text-right flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-[var(--gold)]">مجموع پتانسیل درآمدی فعال</div>
              <div className="text-[24px] font-extrabold font-mono text-[var(--text)] mt-1">
                {(totalPotentialRevenue / 1000000).toFixed(0)} <small className="text-[13px] font-sans font-bold text-[var(--gold)]">میلیون ریال</small>
              </div>
            </div>
            <div className="text-[10.5px] text-[var(--positive)] font-medium pt-2 border-t border-[var(--hair)]">
              میانگین احتمال موفقیت پیگیری‌ها: ۸۱.۵٪
            </div>
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filteredOpps.map((opp) => (
          <div
            key={opp.id}
            className="copan-card p-5 space-y-4 hover:border-[var(--gold)]/40 transition-colors"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--hair)]">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className={`copan-badge ${
                    opp.model_type === 'BASKET_SHARE_DECLINE' ? 'badge-positive' : 'badge-gold'
                  }`}
                >
                  {opp.model_type === 'BASKET_SHARE_DECLINE' ? 'تصاحب سهم رقیب' : 'موعد خرید دوره‌ای'}
                </span>
                <h3
                  onClick={() => {
                    onSelectCustomer(opp.customer_id);
                    onNavigate('customer_360');
                  }}
                  className="font-extrabold text-[15px] text-[var(--text)] hover:text-[var(--gold)] cursor-pointer transition-colors"
                >
                  {opp.customer_name}
                </h3>
                <span className="text-[11px] font-mono text-[var(--text-faint)]">
                  ({opp.customer_id}) • سگمنت {opp.customer_segment}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[12px]">
                <span className="text-[var(--text-faint)]">احتمال تحقق:</span>
                <span className="copan-badge badge-positive font-mono text-[12px] font-bold">
                  {opp.probability_pct}٪
                </span>
                <span className="text-[var(--text-faint)] mr-2">درآمد بالقوه:</span>
                <b className="font-mono text-[14px] text-[var(--text)]">
                  {(opp.potential_revenue / 1000000).toFixed(0)} م.ر
                </b>
              </div>
            </div>

            {/* Title & Reason */}
            <div className="space-y-1 text-right">
              <div className="font-bold text-[14px] text-[var(--gold)]">
                {opp.opportunity_title}
              </div>
              <p className="text-[12.5px] text-[var(--text-dim)] leading-relaxed">
                {opp.reason}
              </p>
            </div>

            {/* Evidence */}
            <div className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-1 text-[11.5px]">
              <div className="font-bold text-[var(--gold)] text-[11px]">
                شواهد مستند در پایگاه داده (Evidence):
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[var(--text-dim)] pr-1">
                {opp.evidence.map((ev, eIdx) => (
                  <li key={eIdx}>{ev}</li>
                ))}
              </ul>
            </div>

            {/* Action Box */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-[var(--gold-soft)] to-[var(--panel-2)] border border-[var(--gold)]/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="text-[10.5px] font-bold text-[var(--gold)]">
                  اقدام پیشنهادی راهبردی (NBA):
                </div>
                <div className="font-bold text-[13px] text-[var(--text)] mt-0.5">
                  {opp.recommended_action}
                </div>
                <div className="text-[10.5px] text-[var(--text-faint)]">
                  زمان تخمینی بستن معامله: <b>{opp.expected_close_days} روز</b>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedOpp(opp);
                    setActionModalOpen(true);
                  }}
                  className="copan-btn copan-btn-primary copan-btn-sm text-[12px] font-bold"
                >
                  <Zap size={14} />
                  اجرای آفر و پیشنهاد
                </button>
                <button
                  onClick={() => {
                    onSelectCustomer(opp.customer_id);
                    onNavigate('customer_360');
                  }}
                  className="copan-btn copan-btn-secondary copan-btn-sm text-[11.5px]"
                >
                  پروفایل ۳۶۰°
                </button>
                <button
                  onClick={() =>
                    onOpenCobat(`سناریوی مذاکره و قیمت پیشنهادی برای فرصت «${opp.opportunity_title}» در مشتری ${opp.customer_name}`)
                  }
                  className="copan-btn copan-btn-gold copan-btn-sm text-[11.5px]"
                >
                  <Bot size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Modal */}
      {selectedOpp && (
        <ActionModal
          isOpen={actionModalOpen}
          onClose={() => setActionModalOpen(false)}
          title={selectedOpp.recommended_action}
          customerName={selectedOpp.customer_name}
          expectedImpact={`تحقق درآمد بالقوه به میزان ${(selectedOpp.potential_revenue / 1000000).toFixed(0)} میلیون ریال`}
          onConfirm={() => {
            // Action executed
          }}
        />
      )}
    </div>
  );
};
