import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Database,
} from 'lucide-react';

export interface EvidenceFactor {
  factor: string;
  value: string;
  weight?: string;
  sourceSystem?: string;
  type?: 'FACT' | 'INFERENCE' | 'RECOMMENDATION';
  confidence?: 'High' | 'Medium' | 'Low';
}

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  entityName?: string;
  score?: number;
  scoreLabel?: string;
  factors: EvidenceFactor[];
  confidenceText?: string;
  methodologyNote?: string;
  onActionClick?: () => void;
  actionLabel?: string;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  isOpen,
  onClose,
  title,
  entityName,
  score,
  scoreLabel = 'شاخص ریسک',
  factors,
  confidenceText = '۹۴٪ (پشتیبانی‌شده با داده‌های قطعی DuckDB و ERP)',
  methodologyNote = 'محاسبات بر اساس ترکیب وزن‌دار داده‌های تراکنش فروش، تاخیر وصول، شکایات QMS و سیگنال‌های ثبت‌شده در CRM انجام گرفته است.',
  onActionClick,
  actionLabel = 'اجرای اقدام پیشنهادی (NBA)',
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div
        className="w-full max-w-lg h-full bg-[var(--panel)] border-r border-[var(--hair)] shadow-2xl p-6 overflow-y-auto flex flex-col justify-between text-right animate-in slide-in-from-left duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[var(--hair)]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[var(--gold-soft)] text-[var(--gold)]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-[15px] text-[var(--text)]">مستندات و شواهد تصمیم (Evidence & Trust)</h3>
                <p className="text-[11.5px] text-[var(--text-faint)]">شفافیت کامل در محاسبات و ریشه‌یابی سیگنال‌ها</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--panel-2)]"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Context Card */}
          <div className="mt-4 p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-2">
            <div className="text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-wider">موضوع تحلیل</div>
            <div className="font-extrabold text-[14px] text-[var(--text)]">{title}</div>
            {entityName && (
              <div className="text-[12px] text-[var(--gold)] font-bold">
                مرتبط با حساب: {entityName}
              </div>
            )}

            {score !== undefined && (
              <div className="pt-2 mt-2 border-t border-[var(--hair)] flex items-center justify-between">
                <span className="text-[12px] text-[var(--text-dim)]">{scoreLabel}:</span>
                <span className="font-mono font-extrabold text-[18px] text-[var(--risk)]">
                  {score} <small className="text-[11px] text-[var(--text-faint)]">/ ۱۰۰</small>
                </span>
              </div>
            )}
          </div>

          {/* Evidence Factors List */}
          <div className="mt-5 space-y-3">
            <div className="text-[12px] font-bold text-[var(--text)] flex items-center gap-1.5">
              <Database size={15} className="text-[var(--gold)]" />
              <span>فاکتورها و شواهد قطعی استخراج‌شده:</span>
            </div>

            <div className="space-y-2">
              {factors.map((item, idx) => {
                const isFact = item.type === 'FACT' || !item.type;
                const isInference = item.type === 'INFERENCE';

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[var(--panel-3)]/60 border border-[var(--hair)] space-y-1.5 transition-all hover:border-[var(--hair-strong)]"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[var(--text)]">{item.factor}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                          isFact
                            ? 'bg-[var(--positive-soft)] text-[var(--positive)] border border-green-500/20'
                            : isInference
                            ? 'bg-[var(--gold-soft)] text-[var(--gold)] border border-amber-500/20'
                            : 'bg-[var(--brand-pale)] text-[var(--brand-light)] border border-emerald-500/20'
                        }`}
                      >
                        {isFact ? 'داده قطعی [Fact]' : isInference ? 'استنتاج [Inference]' : 'پیشنهاد [Action]'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[12px] font-mono font-bold text-[var(--text)]">
                      <span>مقدار ثبت‌شده: {item.value}</span>
                      {item.weight && (
                        <span className="text-[11px] text-[var(--text-faint)] font-sans">
                          وزن فاکتور: {item.weight}
                        </span>
                      )}
                    </div>

                    {item.sourceSystem && (
                      <div className="text-[10px] text-[var(--text-faint)] flex items-center gap-1 pt-1">
                        <Database size={11} />
                        <span>منبع داده: {item.sourceSystem}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confidence & Trust Score */}
          <div className="mt-5 p-3.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-1.5 text-[11.5px]">
            <div className="flex items-center justify-between font-bold text-[var(--positive)]">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={14} />
                ضریب اطمینان الگوریتم:
              </span>
              <span className="font-mono">{confidenceText}</span>
            </div>
            <p className="text-[11px] text-[var(--text-faint)] leading-relaxed">{methodologyNote}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[var(--hair)] flex gap-2">
          {onActionClick && (
            <button
              onClick={() => {
                onActionClick();
                onClose();
              }}
              className="copan-btn copan-btn-primary flex-1 py-2.5 text-[13px] font-bold rounded-xl"
            >
              {actionLabel}
            </button>
          )}
          <button
            onClick={onClose}
            className="copan-btn copan-btn-secondary px-4 py-2.5 text-[12.5px] rounded-xl"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
