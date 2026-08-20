import React from 'react';
import { Sparkles, ChevronLeft, Bot } from 'lucide-react';
import type { SmartRecommendation } from '../../types';
import { getCustomerTradeName } from '../../utils/customerNames';

interface SmartRecommendationsPanelProps {
  recommendations: SmartRecommendation[];
  onSelectCustomer: (customerId: string) => void;
  onAskCopilot?: (prompt: string, customerId?: string) => void;
  isLoading?: boolean;
}

export const SmartRecommendationsPanel: React.FC<SmartRecommendationsPanelProps> = ({
  recommendations,
  onSelectCustomer,
  onAskCopilot,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="card-panel h-64 flex items-center justify-center text-ink-muted text-xs animate-pulse">
        در حال تولید توصیه‌های هوشمند تصمیم‌ساز فروش...
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  // Sorted by priority (Critical first, then High, then Medium)
  const sorted = [...recommendations].sort((a, b) => {
    const pMap: Record<string, number> = { Critical: 3, High: 2, Medium: 1, Low: 0 };
    return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
  });

  const top5 = sorted.slice(0, 5);

  return (
    <div className="card-panel border-brand/30 bg-gradient-to-b from-surface to-brand-pale/20 shadow-card" id="recommendations-section">
      {/* Section Header */}
      <div className="section-header">
        <div>
          <div className="section-title">
            <span className="w-7 h-7 rounded-[8px] bg-brand text-white flex items-center justify-center shadow-sm">
              <Sparkles size={15} />
            </span>
            <span className="text-sm font-bold text-ink">پیشنهادهای هوشمند تصمیم‌ساز (Smart Recommendations)</span>
            <span className="badge badge-brand text-[10.5px]">Evidence-First AI</span>
          </div>
          <span className="section-subtitle">
            اقدامات عملیاتی پیشنهادی بر اساس داده‌های قطعی فروش، رفتار مشتری و تحلیل ریسک
          </span>
        </div>
      </div>

      {/* Grid of Decision Action Cards (Top 5) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {top5.map((rec) => {
          const isCrit = rec.priority === 'Critical';
          const companyName = getCustomerTradeName(rec.customer_id);

          return (
            <div
              key={rec.id}
              className="decision-card bg-surface border border-border-subtle hover:border-brand/50 hover:shadow-hover p-4.5 rounded-[12px] flex flex-col justify-between"
            >
              <div>
                {/* 1. Header: Priority & Customer */}
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-border-subtle/60">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className={`badge shrink-0 ${
                        isCrit ? 'badge-risk-high' : 'badge-brand'
                      }`}
                    >
                      {isCrit ? '🔴 اقدام فوری (P0)' : '🟢 اولویت بالا (P1)'}
                    </span>
                    <button
                      type="button"
                      className="font-bold text-ink hover:text-brand text-xs cursor-pointer truncate text-right"
                      onClick={() => onSelectCustomer(rec.customer_id)}
                      title={`${companyName} (${rec.customer_id})`}
                    >
                      {companyName}
                    </button>
                    <span className="font-mono text-[10px] text-ink-muted shrink-0">
                      {rec.customer_id}
                    </span>
                  </div>
                  <span className="text-[11px] text-ink-faint font-medium shrink-0 mr-2">{rec.target_unit}</span>
                </div>

                {/* 2. ACTION: چه کاری انجام شود؟ */}
                <div className="mb-2.5">
                  <span className="text-[10.5px] font-bold text-brand block mb-0.5">اقدام پیشنهادی (ACTION):</span>
                  <h4 className="text-xs font-bold text-ink leading-snug">
                    {rec.title}
                  </h4>
                  <p className="text-[11.5px] text-ink-secondary mt-1 leading-relaxed">
                    {rec.action}
                  </p>
                </div>

                {/* 3. WHY & EVIDENCE: چرا و بر اساس چه داده‌ای؟ */}
                <div className="bg-surface-subtle/70 p-2.5 rounded-[8px] border border-border-subtle/70 text-[11px] flex flex-col gap-1.5 mb-3">
                  <div>
                    <strong className="text-ink">چرا (WHY): </strong>
                    <span className="text-ink-secondary">{rec.insight}</span>
                  </div>
                  <div className="pt-1 border-t border-border-subtle/50">
                    <strong className="text-brand">شواهد (EVIDENCE): </strong>
                    <span className="text-ink-muted">{rec.data_summary}</span>
                  </div>
                </div>
              </div>

              {/* 4. Action Footer */}
              <div className="flex items-center justify-between pt-2.5 border-t border-border-subtle/70 mt-1">
                {onAskCopilot && (
                  <button
                    type="button"
                    className="text-[11px] text-ink-muted hover:text-brand flex items-center gap-1 font-medium transition-colors cursor-pointer"
                    onClick={() =>
                      onAskCopilot(
                        `بررسی تصمیم: ${rec.title} برای مشتری ${rec.customer_id}`,
                        rec.customer_id
                      )
                    }
                  >
                    <Bot size={13} />
                    <span>تحلیل با Copilot</span>
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => onSelectCustomer(rec.customer_id)}
                >
                  <span>پرونده ۳۶۰</span>
                  <ChevronLeft size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
