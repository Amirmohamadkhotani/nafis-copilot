import React, { useState, useEffect } from 'react';
import {
  X,
  PhoneCall,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useCopan, type LogInteractionInput } from '../../context/CopanContext';
import {
  type InteractionType,
  type TaskPriority,
} from '../../data/copanIntelligence';

interface InteractionReportingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCustomerId?: string;
  initialTaskTitle?: string;
}

export const InteractionReportingModal: React.FC<InteractionReportingModalProps> = ({
  isOpen,
  onClose,
  initialCustomerId,
  initialTaskTitle,
}) => {
  const { customers, logInteraction } = useCopan();

  const [customerId, setCustomerId] = useState(initialCustomerId || 'CUST-008');
  const [interactionType, setInteractionType] = useState<InteractionType>('تماس تلفنی');
  const [summaryText, setSummaryText] = useState('');
  const [customerFeedback, setCustomerFeedback] = useState('');
  const [keyOutcome, setKeyOutcome] = useState('');
  const [relatedProduct, setRelatedProduct] = useState('Product_Family_01');
  const [nextAction, setNextAction] = useState(initialTaskTitle ? `پیگیری: ${initialTaskTitle}` : '');
  const [followUpDate, setFollowUpDate] = useState('۳ روز مانده');
  const [priority, setPriority] = useState<TaskPriority>('High');
  const [autoCreateTask, setAutoCreateTask] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialCustomerId) {
      setCustomerId(initialCustomerId);
    }
    if (initialTaskTitle) {
      setNextAction(`پیگیری: ${initialTaskTitle}`);
    }
  }, [initialCustomerId, initialTaskTitle]);

  if (!isOpen) return null;

  const selectedCustomer = customers.find((c) => c.customer_id === customerId) || customers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summaryText.trim() || !nextAction.trim()) return;

    const payload: LogInteractionInput = {
      customer_id: selectedCustomer.customer_id,
      customer_name: selectedCustomer.customer_name,
      sales_rep_name: selectedCustomer.sales_rep_name,
      interaction_type: interactionType,
      summary_text: summaryText.trim(),
      customer_feedback: customerFeedback.trim() || undefined,
      key_outcome: keyOutcome.trim() || undefined,
      related_product: relatedProduct,
      next_action: nextAction.trim(),
      follow_up_date: followUpDate,
      priority,
      record_status: 'قطعی',
    };

    logInteraction(payload, autoCreateTask);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Reset form
      setSummaryText('');
      setCustomerFeedback('');
      setKeyOutcome('');
      setNextAction('');
    }, 1200);
  };

  const NEXT_ACTION_PRESETS = [
    'ارسال پیش‌فاکتور قیمت با تخفیف حجمی',
    'پیگیری وصول فاکتور معوق و چک سررسیدشده',
    'اعزام کارشناس فنی و ارائه نمونه بدون پرز',
    'هماهنگی جلسه حضوری در محل کارخانه',
    'ارسال کاتالوگ و نمونه آزمایشی کالا',
    'تنظیم و ارسال پیش‌نویس قرارداد سالانه',
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs z-50 transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[680px] max-h-[92vh] overflow-y-auto bg-[var(--bg)] border border-[var(--hair-strong)] z-50 rounded-2xl shadow-2xl flex flex-col p-5 sm:p-6 animate-in zoom-in-95"
        style={{ background: 'var(--panel)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--hair)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--gold-soft)] border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] shrink-0">
              <PhoneCall size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-[16px] text-[var(--text)]">
                  ثبت تعامل و مکالمه با مشتری (Log Interaction)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--brand-pale)] text-[var(--brand-light)]">
                  حلقه تصمیم‌ساز
                </span>
              </div>
              <p className="text-[11.5px] text-[var(--text-faint)] mt-0.5">
                ثبت خلاصه مذاکره و تولید خودکار اقدام بعدی در کارتابل پیگیری
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--panel-2)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Success Banner */}
        {isSuccess && (
          <div className="my-4 p-4 rounded-xl bg-[var(--positive-soft)] border border-[var(--positive-border)] text-[var(--positive)] flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 size={20} />
            <div className="text-[13px] font-bold">
              تعامل با موفقیت ثبت شد و وظیفه اقدام بعدی به کارتابل افزوده گردید!
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-[12.5px]">
          {/* Customer & Interaction Type Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Customer Select */}
            <div>
              <label className="text-[11.5px] font-bold text-[var(--text-dim)] block mb-1">
                مشتری طرف مذاکره:
              </label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] text-[var(--text)] font-semibold focus:outline-none focus:border-[var(--gold)] cursor-pointer"
              >
                {customers.map((c) => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.customer_name} ({c.customer_id}) - سگمنت {c.customer_segment}
                  </option>
                ))}
              </select>
            </div>

            {/* Interaction Type Select */}
            <div>
              <label className="text-[11.5px] font-bold text-[var(--text-dim)] block mb-1">
                نوع تعامل / کانال ارتباطی:
              </label>
              <select
                value={interactionType}
                onChange={(e) => setInteractionType(e.target.value as InteractionType)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] text-[var(--text)] font-semibold focus:outline-none focus:border-[var(--gold)] cursor-pointer"
              >
                <option value="تماس تلفنی">تماس تلفنی (Phone Call)</option>
                <option value="جلسه حضوری">جلسه حضوری (In-Person Meeting)</option>
                <option value="ویزیت میدانی">ویزیت میدانی در کارخانه (Site Visit)</option>
                <option value="مذاکره قیمت">مذاکره قیمت و شرایط (Price Negotiation)</option>
                <option value="پیام‌رسان / ایمیل">پیام‌رسان / ایمیل (Messaging / Email)</option>
                <option value="مکاتبه رسمی">مکاتبه رسمی و اداری (Official Letter)</option>
              </select>
            </div>
          </div>

          {/* Discussion Summary */}
          <div>
            <label className="text-[11.5px] font-bold text-[var(--text-dim)] block mb-1">
              موضوع و خلاصه موارد مطرح‌شده در مکالمه: <span className="text-[var(--risk)]">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="مثال: مذاکره با مدیر کارخانه در خصوص رفع مشکل پرز نخ در خط تولید ۳ و برنامه سفارش‌گذاری فروردین ماه..."
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--gold)] resize-none"
            />
          </div>

          {/* Outcome & Customer Feedback */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11.5px] font-bold text-[var(--text-dim)] block mb-1">
                بازخورد یا تمایل مشتری (Feedback):
              </label>
              <input
                type="text"
                placeholder="مثال: اعلام رضایت از سرعت بارگیری یا ابراز گلایه از قیمت"
                value={customerFeedback}
                onChange={(e) => setCustomerFeedback(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--gold)]"
              />
            </div>

            <div>
              <label className="text-[11.5px] font-bold text-[var(--text-dim)] block mb-1">
                دسته محصول مرتبط:
              </label>
              <select
                value={relatedProduct}
                onChange={(e) => setRelatedProduct(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] text-[var(--text)] focus:outline-none focus:border-[var(--gold)]"
              >
                <option value="Product_Family_01">خانواده ۰۱ (POY مات)</option>
                <option value="Product_Family_03">خانواده ۰۳ (POY نیمه‌مات)</option>
                <option value="Product_Family_04">خانواده ۰۴ (DTY سوپربرایت)</option>
                <option value="Product_Family_02">خانواده ۰۲ (FDY تریکو)</option>
                <option value="Product_Family_05">خانواده ۰۵ (نخ‌های تابیده)</option>
              </select>
            </div>
          </div>

          {/* 🎯 PROMINENT NEXT ACTION & FOLLOW-UP SECTION */}
          <div className="p-4 rounded-xl bg-[var(--panel-2)] border-2 border-[var(--gold)]/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-extrabold text-[var(--gold)] flex items-center gap-1.5">
                <Sparkles size={16} />
                اقدام بعدی الزامی (Next Best Action):
              </span>
              <span className="text-[11px] font-bold text-[var(--text-faint)]">
                خروجی عملیاتی مکالمه
              </span>
            </div>

            {/* Next Action Input */}
            <div>
              <input
                type="text"
                required
                placeholder="عنوان اقدام بعدی (مثال: ارسال نمونه بدون پرز یا تماس با مدیر بازرگانی)..."
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--panel)] border border-[var(--hair-strong)] text-[var(--text)] font-bold placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--gold)]"
              />
            </div>

            {/* Next Action Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-[var(--text-faint)]">پیشنهادات سریع:</span>
              {NEXT_ACTION_PRESETS.slice(0, 3).map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNextAction(preset)}
                  className="px-2 py-0.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)] text-[11px] text-[var(--text-dim)] hover:text-[var(--gold)] hover:border-[var(--gold)]/30 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Follow-up Date & Priority Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--hair)]">
              {/* Follow-up Date */}
              <div>
                <label className="text-[11.5px] font-bold text-[var(--text-dim)] block mb-1">
                  موعد پیگیری / تاریخ اقدام:
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="مثال: ۱۴۰۴/۱۲/۲۲ یا فردا"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)] text-[12px] text-[var(--text)] font-mono focus:outline-none focus:border-[var(--gold)]"
                  />
                  <button
                    type="button"
                    onClick={() => setFollowUpDate('فردا')}
                    className="px-2 py-1 rounded-lg bg-[var(--panel)] border border-[var(--hair)] text-[11px] font-bold text-[var(--text-dim)] hover:text-[var(--text)]"
                  >
                    فردا
                  </button>
                  <button
                    type="button"
                    onClick={() => setFollowUpDate('۳ روز مانده')}
                    className="px-2 py-1 rounded-lg bg-[var(--panel)] border border-[var(--hair)] text-[11px] font-bold text-[var(--text-dim)] hover:text-[var(--text)]"
                  >
                    +۳ روز
                  </button>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="text-[11.5px] font-bold text-[var(--text-dim)] block mb-1">
                  اولویت اقدام بعدی:
                </label>
                <div className="grid grid-cols-4 gap-1 bg-[var(--panel)] p-1 rounded-lg border border-[var(--hair)] text-[11px]">
                  {(['Critical', 'High', 'Medium', 'Low'] as TaskPriority[]).map((pr) => (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => setPriority(pr)}
                      className={`py-1 rounded-md font-bold transition-all text-center ${
                        priority === pr
                          ? pr === 'Critical'
                            ? 'bg-[var(--risk)] text-white shadow-xs'
                            : pr === 'High'
                            ? 'bg-[var(--gold)] text-[#0e1c12] shadow-xs'
                            : 'bg-[var(--text)] text-[var(--bg)] shadow-xs'
                          : 'text-[var(--text-dim)] hover:text-[var(--text)]'
                      }`}
                    >
                      {pr === 'Critical' ? 'بحرانی' : pr === 'High' ? 'بالا' : pr === 'Medium' ? 'متوسط' : 'عادی'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Auto Create Task Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="autoTaskCheckbox"
                checked={autoCreateTask}
                onChange={(e) => setAutoCreateTask(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--hair)] text-[var(--gold)] focus:ring-[var(--gold)] cursor-pointer accent-[var(--gold)]"
              />
              <label
                htmlFor="autoTaskCheckbox"
                className="text-[12px] font-bold text-[var(--text)] cursor-pointer select-none"
              >
                ایجاد خودکار وظیفه پیگیری در کارتابل اقدامات داشبورد (توصیه سیستم)
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--hair)]">
            <button
              type="button"
              onClick={onClose}
              className="copan-btn copan-btn-secondary text-[12px] font-bold"
            >
              انصراف
            </button>

            <button
              type="submit"
              disabled={!summaryText.trim() || !nextAction.trim()}
              className="copan-btn copan-btn-gold text-[12.5px] font-bold flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              <span>ثبت مکالمه و صدور اقدام بعدی</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
