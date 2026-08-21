import React, { useState } from 'react';
import {
  Bot,
} from 'lucide-react';
import type { PageId } from '../components/layout/Sidebar';
import type { CopanMarketReport } from '../data/copanIntelligence';
const COPAN_MARKET_INTELLIGENCE: CopanMarketReport[] = [];

interface MarketIntelligencePageProps {
  onNavigate?: (page: PageId) => void;
  onOpenCobat: (prompt?: string) => void;
}

export const MarketIntelligencePage: React.FC<MarketIntelligencePageProps> = ({
  onOpenCobat,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'FACT' | 'INFERENCE' | 'RECOMMENDATION'>('ALL');

  const filteredReports = COPAN_MARKET_INTELLIGENCE.filter((rep) => {
    if (filterType !== 'ALL' && rep.analysis_type !== filterType) return false;
    return true;
  });

  if (filteredReports.length === 0) {
    return <div className="copan-card min-h-64 flex items-center justify-center text-[13px] text-[var(--text-faint)]">داده کافی موجود نیست؛ endpoint هوش بازار در backend فعلی موجود نیست.</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header & Distinction Legend */}
      <div className="copan-card space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--hair)]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-[16px] text-[var(--text)]">
                هوش بازار، رقبا و پایش سیگنال‌ها (Market 3C Intelligence)
              </h2>
              <span className="copan-badge badge-brand text-[11px]">3C Analysis</span>
            </div>
            <p className="text-[11.5px] text-[var(--text-faint)] mt-0.5">
              تفکیک شفاف و ساختاریافته داده‌های قطعی میدانی از استنتاج‌های تحلیلی و توصیه‌های هوش مصنوعی
            </p>
          </div>

          <button
            onClick={() => onOpenCobat('تحلیل تطبیقی استراتژی قیمت‌گذاری رقبای X و Y و پیشنهاد واکنش مناسب')}
            className="copan-btn copan-btn-gold text-[12px] font-bold"
          >
            <Bot size={15} />
            تحلیل رقابتی با COBAT
          </button>
        </div>

        {/* Fact / Inference / Recommendation Legend Filter Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px]">
          <button
            onClick={() => setFilterType(filterType === 'FACT' ? 'ALL' : 'FACT')}
            className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
              filterType === 'FACT'
                ? 'bg-[var(--panel-2)] border-[var(--positive)] shadow-xs'
                : 'bg-[var(--panel)] border-[var(--hair)] hover:border-[var(--hair-strong)]'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-[var(--positive)]">
              <span>داده قطعی [Fact]</span>
              <span className="copan-badge badge-positive">ثبت مستقیم</span>
            </div>
            <p className="text-[11.5px] text-[var(--text-dim)] mt-1">
              مستقیماً از فاکتورها، گزارش‌های میدانی کارشناسان فروش و سامانه‌های رسمی استخراج شده است.
            </p>
          </button>

          <button
            onClick={() => setFilterType(filterType === 'INFERENCE' ? 'ALL' : 'INFERENCE')}
            className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
              filterType === 'INFERENCE'
                ? 'bg-[var(--panel-2)] border-[var(--gold)] shadow-xs'
                : 'bg-[var(--panel)] border-[var(--hair)] hover:border-[var(--hair-strong)]'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-[var(--gold)]">
              <span>سیگنال استنتاجی [Inference]</span>
              <span className="copan-badge badge-gold">تحلیل الگو</span>
            </div>
            <p className="text-[11.5px] text-[var(--text-dim)] mt-1">
              حاصل تحلیل همبستگی بین نوسانات سفارش، تاخیر رقبا و تغییرات سهم سبد مشتریان.
            </p>
          </button>

          <button
            onClick={() => setFilterType(filterType === 'RECOMMENDATION' ? 'ALL' : 'RECOMMENDATION')}
            className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
              filterType === 'RECOMMENDATION'
                ? 'bg-[var(--panel-2)] border-[var(--brand)] shadow-xs'
                : 'bg-[var(--panel)] border-[var(--hair)] hover:border-[var(--hair-strong)]'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-[var(--brand-light)]">
              <span>پیشنهاد راهبردی [AI Recommendation]</span>
              <span className="copan-badge badge-brand">اقدام تصمیم‌ساز</span>
            </div>
            <p className="text-[11.5px] text-[var(--text-dim)] mt-1">
              راهکارهای عملیاتی پیشنهادی کوبات جهت بیشینه‌سازی سودآوری و تصاحب بازار.
            </p>
          </button>
        </div>
      </div>

      {/* Market Reports Feed */}
      <div className="space-y-4">
        {filteredReports.map((rep) => (
          <div
            key={rep.week_id}
            className="copan-card p-5 space-y-3 hover:border-[var(--gold)]/40 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--hair)]">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className={`copan-badge ${
                    rep.analysis_type === 'FACT'
                      ? 'badge-positive'
                      : rep.analysis_type === 'INFERENCE'
                      ? 'badge-gold'
                      : 'badge-brand'
                  }`}
                >
                  {rep.type_label}
                </span>
                <span className="font-extrabold text-[14px] text-[var(--text)]">
                  {rep.product_market}
                </span>
                <span className="text-[11px] font-mono text-[var(--text-faint)]">
                  هفته: {rep.week_id} • تاریخ گزارش: {rep.report_date}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[12px]">
                <span>رقیب فعال: <b className="text-[var(--gold)]">{rep.competitor}</b></span>
                <span>• شاخص قیمت: <b className="font-mono text-[var(--text)]">{rep.price_index}</b></span>
                <span>
                  تغییر تقاضا:{' '}
                  <b
                    className={
                      rep.demand_change === 'افزایش'
                        ? 'text-[var(--positive)]'
                        : rep.demand_change === 'کاهش'
                        ? 'text-[var(--risk)]'
                        : 'text-[var(--text-dim)]'
                    }
                  >
                    {rep.demand_change}
                  </b>
                </span>
              </div>
            </div>

            <div className="text-[13px] text-[var(--text)] leading-relaxed text-right">
              {rep.text}
            </div>

            <div className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] text-[11.5px] space-y-1">
              <div className="font-bold text-[var(--gold)] text-[11px]">
                شواهد و مراجع راستی‌آزمایی (Evidence Reference):
              </div>
              <div className="text-[var(--text-dim)]">{rep.evidence}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
