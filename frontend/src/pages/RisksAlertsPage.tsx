import React, { useState } from 'react';
import {
  Bot,
  Zap,
  Layers,
} from 'lucide-react';
import type { PageId } from '../components/layout/Sidebar';
import { COPAN_RISKS_REGISTRY, type CopanRiskItem } from '../data/copanIntelligence';
import { ActionModal } from '../components/modals/ActionModal';
import { QualityChainModal } from '../components/modals/QualityChainModal';

interface RisksAlertsPageProps {
  onNavigate: (page: PageId) => void;
  onSelectCustomer: (customerId: string) => void;
  onOpenCobat: (prompt?: string) => void;
}

export const RisksAlertsPage: React.FC<RisksAlertsPageProps> = ({
  onNavigate,
  onSelectCustomer,
  onOpenCobat,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<
    'ALL' | 'MARGIN_LOSS' | 'CUSTOMER' | 'PRODUCT' | 'COMMERCIAL'
  >('ALL');

  // Modals
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [qualityModalOpen, setQualityModalOpen] = useState(false);
  const [activeRiskItem, setActiveRiskItem] = useState<CopanRiskItem | null>(null);

  const filteredRisks = COPAN_RISKS_REGISTRY.filter((r) => {
    if (categoryFilter !== 'ALL' && r.risk_category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header & Risk Exposure Summary */}
      <div className="copan-card space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--hair)]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-[16px] text-[var(--text)]">
                مرکز فرماندهی ریسک‌ها و هشدارهای زودهنگام (Risk Command Center)
              </h2>
              <span className="copan-badge badge-risk font-mono text-[11px]">
                {filteredRisks.length} ریسک تحت پایش
              </span>
            </div>
            <p className="text-[12px] text-[var(--text-dim)] mt-0.5 font-medium">
              پایش تفکیک‌شدهٔ ریسک‌های زیان مالی، ریزش مشتریان، عیوب کیفی کالا و تهدیدات رقابتی
            </p>
          </div>

          <button
            onClick={() => onOpenCobat('مهمترین ریسک‌های روز با بیشترین اثر مالی کدام‌اند و چه اقدامی باید کرد؟')}
            className="copan-btn copan-btn-gold text-[12.5px] font-bold"
          >
            <Bot size={15} />
            تحلیل جامع ریسک با COBAT
          </button>
        </div>

        {/* Category Filters Strip (5 Distinct Tabs) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-[12px]">
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
              categoryFilter === 'ALL'
                ? 'bg-[var(--panel-2)] border-[var(--gold)] shadow-xs'
                : 'bg-[var(--panel)] border-[var(--hair)] hover:border-[var(--hair-strong)]'
            }`}
          >
            <div className="text-[11.5px] font-semibold text-[var(--text-dim)]">کل ریسک‌های فعال</div>
            <div className="font-mono font-black text-[19px] text-[var(--text)] mt-1">
              {COPAN_RISKS_REGISTRY.length} ریسک
            </div>
          </button>

          <button
            onClick={() => setCategoryFilter('MARGIN_LOSS')}
            className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
              categoryFilter === 'MARGIN_LOSS'
                ? 'bg-[var(--panel-2)] border-[var(--risk)] shadow-xs'
                : 'bg-[var(--panel)] border-[var(--hair)] hover:border-[var(--hair-strong)]'
            }`}
          >
            <div className="text-[11.5px] font-semibold text-[var(--risk)]">۱. هشدار ضرر و حاشیه سود</div>
            <div className="font-mono font-black text-[19px] text-[var(--risk)] mt-1">
              {COPAN_RISKS_REGISTRY.filter((r) => r.risk_category === 'MARGIN_LOSS').length} مورد
            </div>
          </button>

          <button
            onClick={() => setCategoryFilter('CUSTOMER')}
            className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
              categoryFilter === 'CUSTOMER'
                ? 'bg-[var(--panel-2)] border-[#c26227] shadow-xs'
                : 'bg-[var(--panel)] border-[var(--hair)] hover:border-[var(--hair-strong)]'
            }`}
          >
            <div className="text-[11.5px] font-semibold text-[#c26227]">۲. هشدار ریزش مشتری</div>
            <div className="font-mono font-black text-[19px] text-[#c26227] mt-1">
              {COPAN_RISKS_REGISTRY.filter((r) => r.risk_category === 'CUSTOMER').length} مورد
            </div>
          </button>

          <button
            onClick={() => setCategoryFilter('PRODUCT')}
            className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
              categoryFilter === 'PRODUCT'
                ? 'bg-[var(--panel-2)] border-[var(--gold)] shadow-xs'
                : 'bg-[var(--panel)] border-[var(--hair)] hover:border-[var(--hair-strong)]'
            }`}
          >
            <div className="text-[11.5px] font-semibold text-[var(--gold)]">۳. هشدار کیفیت و کالا</div>
            <div className="font-mono font-black text-[19px] text-[var(--gold)] mt-1">
              {COPAN_RISKS_REGISTRY.filter((r) => r.risk_category === 'PRODUCT').length} مورد
            </div>
          </button>

          <button
            onClick={() => setCategoryFilter('COMMERCIAL')}
            className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
              categoryFilter === 'COMMERCIAL'
                ? 'bg-[var(--panel-2)] border-[var(--teal)] shadow-xs'
                : 'bg-[var(--panel)] border-[var(--hair)] hover:border-[var(--hair-strong)]'
            }`}
          >
            <div className="text-[11.5px] font-semibold text-[var(--teal)]">۴. هشدار تهدید رقبا</div>
            <div className="font-mono font-black text-[19px] text-[var(--teal)] mt-1">
              {COPAN_RISKS_REGISTRY.filter((r) => r.risk_category === 'COMMERCIAL').length} مورد
            </div>
          </button>
        </div>
      </div>

      {/* Risks Registry Cards */}
      <div className="space-y-4">
        {filteredRisks.map((risk) => (
          <div
            key={risk.id}
            className={`copan-card p-5 space-y-4 border-r-4 transition-all ${
              risk.severity === 'Critical'
                ? 'border-r-[var(--risk)]'
                : risk.severity === 'High'
                ? 'border-r-[var(--gold)]'
                : 'border-r-[var(--teal)]'
            }`}
          >
            {/* Risk Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--hair)]">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className={`copan-badge ${
                    risk.severity === 'Critical'
                      ? 'badge-risk'
                      : risk.severity === 'High'
                      ? 'badge-gold'
                      : 'badge-neutral'
                  }`}
                >
                  شدت: {risk.severity}
                </span>
                <span className="copan-badge badge-neutral text-[10.5px]">
                  {risk.category_label}
                </span>
                <h3 className="font-extrabold text-[15px] text-[var(--text)]">
                  {risk.entity_name}
                </h3>
                <span className="font-mono text-[11px] text-[var(--text-faint)]">
                  ({risk.entity_id})
                </span>
              </div>

              <div className="flex items-center gap-3 text-[12px]">
                <span className="text-[var(--text-faint)]">احتمال وقوع:</span>
                <span className="font-mono font-bold text-[var(--text)]">{risk.probability_pct}٪</span>
                <span className="text-[var(--text-faint)] mr-2">مبلغ در معرض خطر:</span>
                <b className="font-mono text-[14px] text-[var(--risk)]">
                  {(risk.financial_impact / 1000000).toFixed(0)} م.ر
                </b>
              </div>
            </div>

            {/* Risk Title & Explanation */}
            <div className="space-y-1 text-right">
              <div className="font-bold text-[14px] text-[var(--text)]">
                {risk.risk_title}
              </div>
            </div>

            {/* Evidence List */}
            <div className="p-3.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-1.5 text-[11.5px]">
              <div className="font-bold text-[var(--gold)] text-[11px]">
                شواهد و دلایل مستند در پایگاه داده:
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[var(--text-dim)] pr-1">
                {risk.evidence.map((ev, eIdx) => (
                  <li key={eIdx}>{ev}</li>
                ))}
              </ul>
            </div>

            {/* Recommended Action Footer */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-[var(--gold-soft)] to-[var(--panel-2)] border border-[var(--gold)]/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="text-[10.5px] font-bold text-[var(--gold)]">
                  اقدام پیشگیرانه پیشنهادی (Recommended Mitigation):
                </div>
                <div className="font-bold text-[13px] text-[var(--text)] mt-0.5">
                  {risk.recommended_action}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveRiskItem(risk);
                    setActionModalOpen(true);
                  }}
                  className="copan-btn copan-btn-primary copan-btn-sm text-[12px] font-bold"
                >
                  <Zap size={14} />
                  اجرای اقدام پیشگیرانه
                </button>

                {risk.risk_category === 'PRODUCT' ? (
                  <button
                    onClick={() => setQualityModalOpen(true)}
                    className="copan-btn copan-btn-secondary copan-btn-sm text-[11.5px]"
                  >
                    <Layers size={13} />
                    زنجیره کیفیت QMS
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onSelectCustomer(risk.entity_id);
                      onNavigate('customer_360');
                    }}
                    className="copan-btn copan-btn-secondary copan-btn-sm text-[11.5px]"
                  >
                    پروفایل ۳۶۰°
                  </button>
                )}

                <button
                  onClick={() =>
                    onOpenCobat(`سناریوی کامل کنترل ریسک «${risk.risk_title}» برای ${risk.entity_name}`)
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

      {/* Modals */}
      {activeRiskItem && (
        <ActionModal
          isOpen={actionModalOpen}
          onClose={() => setActionModalOpen(false)}
          title={activeRiskItem.recommended_action}
          customerName={activeRiskItem.entity_name}
          expectedImpact={`کنترل و کاهش ریسک مالی به مبلغ ${(activeRiskItem.financial_impact / 1000000).toFixed(0)} میلیون ریال`}
          onConfirm={() => {
            // Action executed
          }}
        />
      )}

      <QualityChainModal
        isOpen={qualityModalOpen}
        onClose={() => setQualityModalOpen(false)}
        customerName="ریسندگی ممتاز سمنان"
      />
    </div>
  );
};
