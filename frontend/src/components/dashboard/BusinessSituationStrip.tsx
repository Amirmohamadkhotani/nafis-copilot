import React from 'react';
import {
  DollarSign,
  AlertTriangle,
  CreditCard,
  ShieldAlert,
  FileText,
  Clock,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';
import { useCopan } from '../../context/CopanContext';
import type { OperationalViewType } from './OperationalDetailModal';

interface BusinessSituationStripProps {
  onOpenDrilldown: (viewType: OperationalViewType) => void;
  onScrollToTasks: () => void;
}

export const BusinessSituationStrip: React.FC<BusinessSituationStripProps> = ({
  onOpenDrilldown,
  onScrollToTasks,
}) => {
  const { tasks } = useCopan();
  const pendingTasksCount = tasks.filter((t) => t.status === 'To Do' || t.status === 'In Progress').length;
  const criticalTasksCount = tasks.filter(
    (t) => (t.status === 'To Do' || t.status === 'In Progress') && t.priority === 'Critical'
  ).length;

  return (
    <div className="space-y-3">
      {/* Section Subtitle */}
      <div className="flex items-center justify-between text-[13px]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--gold)] animate-pulse" />
          <h3 className="font-extrabold text-[15px] text-[var(--text)]">
            وضعیت جاری کسب‌وکار و سیگنال‌های عملیاتی (Current Business Situation)
          </h3>
        </div>
        <span className="text-[11.5px] text-[var(--text-faint)] font-medium">
          خلاصه تصمیم‌ساز اجرایی • برای مشاهده جزئیات و اقدام روی هر کارت کلیک کنید
        </span>
      </div>

      {/* 6 Executive Interactive Operational Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* BLOCK 1: Sales & Margin Pulse */}
        <div className="copan-card p-3.5 space-y-2 hover:border-[var(--gold)]/40 transition-all cursor-default">
          <div className="flex items-center justify-between text-[11.5px] text-[var(--text-faint)] font-bold">
            <span>فروش و حاشیه سود</span>
            <span className="p-1 rounded-md bg-[var(--brand-pale)] text-[var(--brand-light)]">
              <DollarSign size={15} />
            </span>
          </div>

          <div className="my-1">
            <div className="text-[20px] font-black font-mono text-[var(--text)] tracking-tight">
              ۴.۴۲ <small className="text-[12px] font-bold text-[var(--gold)]">میلیارد ریال</small>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold">
              <span className="copan-badge badge-positive text-[10px]">مارجین ۱۰.۱٪</span>
              <span className="text-[var(--risk)] font-mono font-bold">-۴.۲٪ MoM</span>
            </div>
          </div>

          <div className="text-[10.5px] text-[var(--text-faint)] pt-1.5 border-t border-[var(--hair)] truncate">
            ۷۸٪ فروش در ۱۰٪ مشتریان برتر
          </div>
        </div>

        {/* BLOCK 2: Delayed Collections (Actionable Drilldown) */}
        <button
          onClick={() => onOpenDrilldown('COLLECTIONS')}
          className="copan-card p-3.5 space-y-2 hover:border-[var(--risk-border)] transition-all text-right cursor-pointer group hover:bg-[var(--panel-2)]/70 relative"
        >
          <div className="flex items-center justify-between text-[11.5px] text-[var(--text-faint)] font-bold">
            <span className="text-[var(--risk)] font-bold">مطالبات معوق</span>
            <span className="p-1 rounded-md bg-[var(--risk-soft)] text-[var(--risk)]">
              <CreditCard size={15} />
            </span>
          </div>

          <div className="my-1">
            <div className="text-[20px] font-black font-mono text-[var(--risk)] tracking-tight">
              ۸۴.۵ <small className="text-[12px] font-bold text-[var(--text-dim)]">م.ر</small>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-[var(--text-dim)]">
              <span className="copan-badge badge-risk text-[10px]">۳ حساب با تاخیر</span>
              <span>حداکثر ۳۸ روز</span>
            </div>
          </div>

          <div className="text-[10.5px] text-[var(--gold)] pt-1.5 border-t border-[var(--hair)] flex items-center justify-between font-bold">
            <span>مشاهده و پیگیری وصول</span>
            <ChevronLeft size={13} className="transition-transform group-hover:-translate-x-1" />
          </div>
        </button>

        {/* BLOCK 3: Returned Checks (Actionable Drilldown) */}
        <button
          onClick={() => onOpenDrilldown('BOUNCED_CHECKS')}
          className="copan-card p-3.5 space-y-2 hover:border-[var(--risk-border)] transition-all text-right cursor-pointer group hover:bg-[var(--panel-2)]/70 relative"
        >
          <div className="flex items-center justify-between text-[11.5px] text-[var(--text-faint)] font-bold">
            <span className="text-[var(--risk)] font-bold">چک‌های برگشتی</span>
            <span className="p-1 rounded-md bg-[var(--risk-soft)] text-[var(--risk)]">
              <AlertTriangle size={15} />
            </span>
          </div>

          <div className="my-1">
            <div className="text-[20px] font-black font-mono text-[var(--risk)] tracking-tight">
              ۳ <small className="text-[12px] font-bold text-[var(--text-dim)]">فقره (۶۶ م.ر)</small>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-[var(--text-dim)]">
              <span className="copan-badge badge-risk text-[10px]">۲ مشتری درگیر</span>
              <span>واخواست حقوقی</span>
            </div>
          </div>

          <div className="text-[10.5px] text-[var(--gold)] pt-1.5 border-t border-[var(--hair)] flex items-center justify-between font-bold">
            <span>دیده‌بان چک‌ها و اخطار</span>
            <ChevronLeft size={13} className="transition-transform group-hover:-translate-x-1" />
          </div>
        </button>

        {/* BLOCK 4: Open Quality Complaints (Actionable Drilldown) */}
        <button
          onClick={() => onOpenDrilldown('COMPLAINTS')}
          className="copan-card p-3.5 space-y-2 hover:border-[var(--gold)]/40 transition-all text-right cursor-pointer group hover:bg-[var(--panel-2)]/70 relative"
        >
          <div className="flex items-center justify-between text-[11.5px] text-[var(--text-faint)] font-bold">
            <span className="text-[var(--gold)] font-bold">شکایات باز کیفی</span>
            <span className="p-1 rounded-md bg-[var(--gold-soft)] text-[var(--gold)]">
              <ShieldAlert size={15} />
            </span>
          </div>

          <div className="my-1">
            <div className="text-[20px] font-black font-mono text-[var(--gold)] tracking-tight">
              ۱۲ <small className="text-[12px] font-bold text-[var(--text-dim)]">پرونده باز</small>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-[var(--text-dim)]">
              <span className="copan-badge badge-risk text-[10px]">۳ مورد بحرانی</span>
              <span>نقص لات ۱۱۳۰۶۸</span>
            </div>
          </div>

          <div className="text-[10.5px] text-[var(--gold)] pt-1.5 border-t border-[var(--hair)] flex items-center justify-between font-bold">
            <span>ردیابی خط و شکایات</span>
            <ChevronLeft size={13} className="transition-transform group-hover:-translate-x-1" />
          </div>
        </button>

        {/* BLOCK 5: Pending Offers Aging (Actionable Drilldown) */}
        <button
          onClick={() => onOpenDrilldown('OFFERS')}
          className="copan-card p-3.5 space-y-2 hover:border-[var(--gold)]/40 transition-all text-right cursor-pointer group hover:bg-[var(--panel-2)]/70 relative"
        >
          <div className="flex items-center justify-between text-[11.5px] text-[var(--text-faint)] font-bold">
            <span className="text-[var(--text-dim)] font-bold">پیشنهادهای قیمت (Offers)</span>
            <span className="p-1 rounded-md bg-[var(--gold-soft)] text-[var(--gold)]">
              <FileText size={15} />
            </span>
          </div>

          <div className="my-1">
            <div className="text-[20px] font-black font-mono text-[var(--text)] tracking-tight">
              ۱۵ <small className="text-[12px] font-bold text-[var(--text-dim)]">آفر فعال</small>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-[var(--text-dim)]">
              <span className="copan-badge badge-gold text-[10px]">۴ مورد در حال انقضا</span>
              <span className="font-mono">۸۹۰ م.ر</span>
            </div>
          </div>

          <div className="text-[10.5px] text-[var(--gold)] pt-1.5 border-t border-[var(--hair)] flex items-center justify-between font-bold">
            <span>نهایی‌سازی پیش‌فاکتورها</span>
            <ChevronLeft size={13} className="transition-transform group-hover:-translate-x-1" />
          </div>
        </button>

        {/* BLOCK 6: Today's Action Required (Scroll to Task Center) */}
        <button
          onClick={onScrollToTasks}
          className="copan-card p-3.5 space-y-2 hover:border-[var(--gold)] transition-all text-right cursor-pointer group bg-gradient-to-br from-[var(--panel)] to-[var(--panel-2)] border-2 border-[var(--gold)]/30"
        >
          <div className="flex items-center justify-between text-[11.5px] text-[var(--gold)] font-bold">
            <span className="font-extrabold flex items-center gap-1">
              <Sparkles size={13} />
              اقدامات امروز
            </span>
            <span className="p-1 rounded-md bg-[var(--gold-soft)] text-[var(--gold)]">
              <Clock size={15} />
            </span>
          </div>

          <div className="my-1">
            <div className="text-[20px] font-black font-mono text-[var(--text)] tracking-tight">
              {pendingTasksCount} <small className="text-[12px] font-bold text-[var(--gold)]">وظیفه باز</small>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold">
              <span className="copan-badge badge-risk text-[10px]">{criticalTasksCount} اقدام P0</span>
              <span className="text-[var(--text-faint)]">سررسید امروز</span>
            </div>
          </div>

          <div className="text-[10.5px] text-[var(--gold)] pt-1.5 border-t border-[var(--hair)] flex items-center justify-between font-bold">
            <span>کارتابل اقدامات</span>
            <ChevronLeft size={13} className="transition-transform group-hover:-translate-x-1" />
          </div>
        </button>
      </div>
    </div>
  );
};
