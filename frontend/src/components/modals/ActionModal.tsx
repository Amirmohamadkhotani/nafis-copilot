import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  Zap,
} from 'lucide-react';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  customerName?: string;
  actionId?: string;
  expectedImpact?: string;
  onConfirm: (actionNote: string) => void;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  title,
  customerName,
  actionId = 'ACT-001',
  expectedImpact = 'حفظ سالانه ۱۲۰ میلیون ریال درآمد و بازیابی سهم سبد به ۵۰٪',
  onConfirm,
}) => {
  const [note, setNote] = useState('');
  const [authorizedBy, setAuthorizedBy] = useState('مدیر ارشد فروش');
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleExecute = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onConfirm(note);
      setIsSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[var(--panel)] border border-[var(--hair-strong)] rounded-2xl w-full max-w-lg shadow-2xl p-6 text-right space-y-4 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--hair)]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[var(--brand-pale)] text-[var(--brand-light)] border border-[var(--brand)]/30">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-[15px] text-[var(--text)]">
                تأیید و اجرای اقدام تصمیم‌ساز (HITL Action Execution)
              </h3>
              <p className="text-[11.5px] text-[var(--text-faint)]">
                ثبت تصمیم انسانی در زنجیره حسابرسی COPAN ({actionId})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--panel-2)]"
          >
            <X size={17} />
          </button>
        </div>

        {/* Action Details */}
        <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-2 text-[12px]">
          <div className="text-[10.5px] font-bold text-[var(--gold)]">عنوان اقدام:</div>
          <div className="font-bold text-[13.5px] text-[var(--text)]">{title}</div>
          {customerName && (
            <div className="text-[11.5px] text-[var(--text-dim)]">
              طرف حساب: <b>{customerName}</b>
            </div>
          )}
          <div className="pt-2 border-t border-[var(--hair)] text-[11px] text-[var(--positive)] font-medium">
            اثر مورد انتظار: {expectedImpact}
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3 text-[12px]">
          <div>
            <label className="block font-bold text-[var(--text)] mb-1">
              ثبت‌کننده / مقام مجاز:
            </label>
            <select
              value={authorizedBy}
              onChange={(e) => setAuthorizedBy(e.target.value)}
              className="w-full bg-[var(--panel-2)] border border-[var(--hair-strong)] rounded-xl px-3 py-2 text-[12px] text-[var(--text)] focus:outline-none focus:border-[var(--gold)]"
            >
              <option value="مدیر ارشد فروش">مدیر ارشد فروش و بازرگانی (شما)</option>
              <option value="مدیرعامل">مدیرعامل / هیئت مدیره</option>
              <option value="سرپرست منطقه فروش">سرپرست منطقه فروش</option>
              <option value="کارشناس حساب">کارشناس تخصصی حساب</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[var(--text)] mb-1">
              یادداشت یا دستور تکمیلی (اختیاری):
            </label>
            <textarea
              rows={3}
              placeholder="مثال: دستور تخفیف ۳ درصدی برای سفارش ۲۰۰ تنی فروردین صادر شد..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[var(--panel-2)] border border-[var(--hair-strong)] rounded-xl p-3 text-[12px] text-[var(--text)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-faint)] resize-none"
            />
          </div>
        </div>

        {/* Success or Actions */}
        {isSuccess ? (
          <div className="p-3.5 rounded-xl bg-[var(--positive-soft)] border border-green-500/30 text-center text-[var(--positive)] font-bold text-[13px] flex items-center justify-center gap-2">
            <CheckCircle2 size={18} />
            اقدام با موفقیت تأیید و در کارتابل و پایگاه داده ثبت شد.
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--hair)]">
            <button
              onClick={onClose}
              className="copan-btn copan-btn-secondary py-2 px-4 text-[12px]"
            >
              انصراف
            </button>
            <button
              onClick={handleExecute}
              className="copan-btn copan-btn-primary py-2 px-5 text-[12px] font-bold"
            >
              تأیید و صدور دستور اقدام
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
