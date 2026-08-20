import React from 'react';
import {
  ShieldAlert,
  X,
  Database,
  FlaskConical,
  Layers,
  FileText,
  CheckCircle2,
} from 'lucide-react';

interface QualityChainModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaintId?: string;
  customerName?: string;
}

export const QualityChainModal: React.FC<QualityChainModalProps> = ({
  isOpen,
  onClose,
  complaintId = 'CMP-0001',
  customerName = 'صنایع نساجی سبلان پارچه',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[var(--panel)] border border-[var(--hair-strong)] rounded-2xl w-full max-w-2xl shadow-2xl p-6 text-right space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--hair)]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[var(--risk-soft)] text-[var(--risk)] border border-[var(--risk-border)]">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-[15px] text-[var(--text)]">
                ردیابی زنجیره کیفیت: از شکایت تا آزمایشگاه QMS
              </h3>
              <p className="text-[11.5px] text-[var(--text-faint)]">
                کالبدشکافی علّی پرونده {complaintId} • مشتری: {customerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--panel-2)] cursor-pointer"
          >
            <X size={17} />
          </button>
        </div>

        {/* 4-Step Causal Chain */}
        <div className="space-y-3">
          {/* Step 1: Customer Complaint (CRM) */}
          <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-2">
            <div className="flex items-center justify-between text-[11.5px]">
              <span className="font-bold text-[var(--risk)] flex items-center gap-1.5">
                <FileText size={15} />
                گام ۱: ثبت شکایت در سامانه CRM
              </span>
              <span className="font-mono text-[var(--text-faint)]">۱۴۰۴/۱۱/۲۰</span>
            </div>
            <div className="font-bold text-[13px] text-[var(--text)]">
              «پرز شدید و پارگی مکرر در خط بافت ماشین‌آلات»
            </div>
            <p className="text-[12px] text-[var(--text-dim)]">
              مشتری گزارش نموده است که در حین بافت پارچه تاری-پودی، نخ دچار پارگی فیلامنت شده و ضایعات خط به بیش از ۴.۵٪ افزایش یافته است.
            </p>
          </div>

          {/* Step 2: Invoice & Sales Item (ERP Sales) */}
          <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-2">
            <div className="flex items-center justify-between text-[11.5px]">
              <span className="font-bold text-[var(--gold)] flex items-center gap-1.5">
                <Database size={15} />
                گام ۲: انطباق با ردیف فاکتور فروش (ERP Sales)
              </span>
              <span className="font-mono text-[var(--text-faint)]">فاکتور: T_285604</span>
            </div>
            <div className="text-[12px] text-[var(--text)] grid grid-cols-2 gap-2">
              <div>کد کالا: <b>PRD-POY-001</b></div>
              <div>خانواده: <b>Product_Family_03</b></div>
              <div>مقدار محموله: <b>۴,۵۰۰ کیلوگرم</b></div>
              <div>لات ارسالی: <b className="font-mono text-[var(--gold)]">LOT-202504-113068</b></div>
            </div>
          </div>

          {/* Step 3: Production Line & Lot (MES/PLM) */}
          <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-2">
            <div className="flex items-center justify-between text-[11.5px]">
              <span className="font-bold text-[var(--teal)] flex items-center gap-1.5">
                <Layers size={15} />
                گام ۳: سوابق خط تولید و اکستروژن (MES/PLM)
              </span>
              <span className="font-mono text-[var(--text-faint)]">خط ریسندگی ۳ - موقعیت B</span>
            </div>
            <p className="text-[12px] text-[var(--text-dim)]">
              لات مذکور در تاریخ ۱۴۰۴/۱۱/۱۵ تولید شده است. در شیفت شب همان تاریخ، نوسان فشار پلیمر در اکسترودر و تعویض بسته فیلتر گزارش شده است.
            </p>
          </div>

          {/* Step 4: Laboratory Test Results (QMS Lab) */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--risk-soft)] to-[var(--panel-2)] border border-[var(--risk-border)] space-y-2">
            <div className="flex items-center justify-between text-[11.5px]">
              <span className="font-bold text-[var(--risk)] flex items-center gap-1.5">
                <FlaskConical size={15} />
                گام ۴: آزمون آزمایشگاه کنترل کیفیت مرکزی (QMS)
              </span>
              <span className="copan-badge badge-risk text-[10px]">مردود در تست کشش</span>
            </div>
            <div className="text-[12px] text-[var(--text)] space-y-1.5">
              <div className="grid grid-cols-2 gap-2 font-mono text-[11.5px] p-2.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)]">
                <div>استحکام کششی (Tensile): <b className="text-[var(--risk)]">2.85 cN/dtex (حد استاندارد: ≥3.40)</b></div>
                <div>انحراف یکنواختی CV: <b className="text-[var(--risk)]">1.45% (حد مجاز: ≤1.10%)</b></div>
              </div>
              <div className="text-[11.5px] text-[var(--text-dim)] pt-1">
                <b>نتیجه قطعی هوش مصنوعی:</b> شکایت مشتری <b>کاملاً موجه و ناشی از نقص خط تولید</b> بوده است.
              </div>
            </div>
          </div>
        </div>

        {/* Resolution Recommendation */}
        <div className="p-4 rounded-xl bg-[var(--positive-soft)] border border-green-500/20 text-[12px] space-y-1.5">
          <div className="font-bold text-[var(--positive)] flex items-center gap-1.5">
            <CheckCircle2 size={15} />
            اقدام مصوب جهت جلوگیری از ریزش مشتری:
          </div>
          <p className="text-[var(--text)] leading-relaxed">
            مقرر گردید ۵۰۰ کیلوگرم باقیمانده از این لات بدون هزینه مرجوع و با یک محموله کنترل‌شده از لات جدید LOT-113090 جایگزین گردد.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-[var(--hair)]">
          <button
            onClick={onClose}
            className="copan-btn copan-btn-secondary py-2 px-5 text-[12px]"
          >
            بستن پرونده
          </button>
        </div>
      </div>
    </div>
  );
};
