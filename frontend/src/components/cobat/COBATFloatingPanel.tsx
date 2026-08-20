import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Maximize2,
  Minimize2,
  AlertTriangle,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import type { PageId } from '../layout/Sidebar';
import { useCopan } from '../../context/CopanContext';

interface COBATFloatingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: PageId;
  selectedCustomerId: string;
  onNavigateToCustomer: (customerId: string) => void;
  onNavigateToPage: (page: PageId) => void;
  initialPrompt?: string;
  onOpenFullWorkspace: () => void;
}

const PAGE_SUGGESTED_PROMPTS: Record<PageId, string[]> = {
  dashboard: [
    'وضعیت کلی فروش چیست؟',
    'مهمترین ریسک امروز چیست؟',
    'کدام مشتری نیاز به اقدام فوری دارد؟',
    'پیش‌بینی تحقق هدف فروش فصل جاری',
  ],
  cobat: [
    'مشتری‌های در حال ریزش را بیاب',
    'فرصت‌های رشد سهم سبد',
    'بررسی کیفی شکایت سبلان پارچه',
    'خلاصه جلسه با تریکو البرز',
  ],
  customers: [
    'مشتریان سگمنت A با بیشترین افت خرید',
    'مشتری‌های با ریسک بالای ۸۰',
    'مقایسه ۵ مشتری پرسود',
    'کدام مشتریان چک برگشتی دارند؟',
  ],
  customer_360: [
    'تحلیل ریشه‌ای رفتار خرید این حساب',
    'سودآوری دقیق با احتساب ۴٪ اقساط',
    'علت شکایات کیفی ثبت‌شده چیست؟',
    'اقدام بعدی پیشنهادی (NBA) چیست؟',
  ],
  priorities: [
    'بالاترین اولویت اقدام امروز چیست؟',
    'اقدامات P0 با بیشترین اثر مالی',
    'راهکار مذاکره برای سبلان پارچه',
  ],
  opportunities: [
    'پتانسیل‌های دوره‌ای در هفته جاری',
    'مشتریانی که سهم رقیب در آنها بالاست',
    'پیشنهاد بسته قیمتی خانواده ۰۳',
  ],
  sales_intel: [
    'تمرکز پارتو چگونه است؟',
    'علت افت فروش در خانواده ۰۲',
    'رشد فروش در استان اصفهان',
  ],
  market_intel: [
    'تحرکات اخیر رقیب بروجرد',
    'تغییرات تقاضای نخ‌های سوپربرایت',
    'سیگنال‌های قطعی در برابر استنتاج',
  ],
  risks_alerts: [
    'میزان کل سرمایه در معرض خطر',
    'لات‌های معیوب نیازمند توقف',
    'برنامه کنترل ریسک پرنیان مشهد',
  ],
  settings: [
    'وضعیت اتصال پایگاه داده DuckDB',
    'مشتریان در معرض ریزش را مقایسه کن',
    'پیشنهاد بسته تخفیف حجمی برای سگمنت A',
  ],
};

export const COBATFloatingPanel: React.FC<COBATFloatingPanelProps> = ({
  isOpen,
  onClose,
  currentPage,
  onNavigateToCustomer,
  onNavigateToPage,
  initialPrompt,
  onOpenFullWorkspace,
}) => {
  const {
    cobatMessages,
    sendCobatMessage,
    isCobatTyping,
    activeCustomer,
  } = useCopan();

  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [cobatMessages, isCobatTyping]);

  // Handle passed initial prompt
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() !== '') {
      sendCobatMessage(initialPrompt, currentPage);
    }
  }, [initialPrompt]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;
    sendCobatMessage(query, currentPage);
    setInputValue('');
  };

  if (!isOpen) return null;

  const currentPrompts = PAGE_SUGGESTED_PROMPTS[currentPage] || PAGE_SUGGESTED_PROMPTS.dashboard;

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 flex flex-col bg-[var(--panel)] border border-[var(--hair-strong)] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
        isExpanded
          ? 'w-[95vw] sm:w-[680px] h-[88vh] max-h-[820px]'
          : 'w-[92vw] sm:w-[440px] h-[580px]'
      }`}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-[var(--panel-2)] border-b border-[var(--hair)] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--text)] text-[var(--bg)] flex items-center justify-center shadow-xs">
            <Bot size={16} />
          </div>
          <div>
            <div className="font-extrabold text-[13px] text-[var(--text)] flex items-center gap-1.5">
              <span>کوبات (COBAT)</span>
              <span className="copan-badge badge-neutral text-[9px]">
                Decision Agent
              </span>
            </div>
            <div
              onClick={() => onNavigateToCustomer(activeCustomer.customer_id)}
              className="text-[10.5px] text-[var(--text-faint)] flex items-center gap-1 cursor-pointer hover:text-[var(--gold)] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--positive)] animate-pulse" />
              <span>محیط متصل: {currentPage} • حساب: {activeCustomer.customer_name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[var(--text-faint)]">
          <button
            onClick={() => {
              onOpenFullWorkspace();
              onClose();
            }}
            className="p-1.5 rounded-lg hover:text-[var(--text)] hover:bg-[var(--panel-3)]"
            title="انتقال به میز کار تمام‌صفحه COBAT"
          >
            <Maximize2 size={15} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg hover:text-[var(--text)] hover:bg-[var(--panel-3)]"
            title={isExpanded ? 'حالت کوچک' : 'بزرگ‌نمایی پنل'}
          >
            {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:text-[var(--text)] hover:bg-[var(--panel-3)]"
            title="بستن"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Suggested Scenario Chips for Current Page */}
      <div className="px-3 py-2 bg-[var(--panel-2)]/60 border-b border-[var(--hair)] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10.5px] font-bold text-[var(--text-faint)] shrink-0 flex items-center gap-1">
          <Sparkles size={11} className="text-[var(--gold)]" />
          پیشنهادها:
        </span>
        {currentPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 rounded-lg bg-[var(--panel)] border border-[var(--hair)] hover:border-[var(--gold)] hover:text-[var(--text)] text-[var(--text-dim)] shrink-0 text-[11px] font-medium transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-right bg-[var(--bg)]/40">
        {cobatMessages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-faint)] px-1">
                <span>{isUser ? 'شما' : 'کوبات'}</span>
                <span>•</span>
                <span className="font-mono">{msg.timestamp}</span>
              </div>

              <div
                className={`p-3.5 rounded-2xl max-w-[92%] text-[12.5px] leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-[var(--brand-deep)] text-white rounded-br-none border border-[var(--brand)]'
                    : 'bg-[var(--panel)] text-[var(--text)] rounded-bl-none border border-[var(--hair)]'
                }`}
              >
                {/* Text Content */}
                <div className="whitespace-pre-wrap space-y-2">
                  {msg.text.split('\n\n').map((para, pIdx) => {
                    if (para.startsWith('### ')) {
                      return (
                        <h4 key={pIdx} className="font-extrabold text-[13.5px] text-[var(--gold)] pt-1">
                          {para.replace('### ', '')}
                        </h4>
                      );
                    }
                    return <p key={pIdx}>{para}</p>;
                  })}
                </div>

                {/* Rich Data Payload: Risk Badge */}
                {msg.data_payload?.risk_badge && (
                  <div className="mt-3 p-2 rounded-xl bg-[var(--risk-soft)] border border-[var(--risk-border)] flex items-center justify-between text-[11.5px] font-bold text-[var(--risk)]">
                    <span className="flex items-center gap-1">
                      <AlertTriangle size={14} />
                      {msg.data_payload.risk_badge.label}
                    </span>
                    <span className="text-[10.5px]">فوریت بالا</span>
                  </div>
                )}

                {/* Rich Data Payload: Table */}
                {msg.data_payload?.table && (
                  <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--hair)]">
                    <table className="w-full text-right text-[11px]">
                      <thead className="bg-[var(--panel-2)] text-[var(--text-faint)]">
                        <tr>
                          {msg.data_payload.table.headers.map((h, hIdx) => (
                            <th key={hIdx} className="p-2 font-bold whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--hair)]">
                        {msg.data_payload.table.rows.map((r, rIdx) => (
                          <tr key={rIdx} className="hover:bg-[var(--panel-2)]/60">
                            {r.map((c, cIdx) => (
                              <td key={cIdx} className="p-2 font-medium whitespace-nowrap">
                                {c}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Rich Data Payload: Evidence Chain */}
                {msg.data_payload?.evidence && (
                  <div className="mt-3 p-2.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] text-[11px] space-y-1">
                    <div className="font-bold text-[var(--gold)] flex items-center gap-1 text-[10.5px]">
                      <ShieldCheck size={13} />
                      شواهد مستند در پایگاه داده (Evidence):
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-[var(--text-dim)] pr-1">
                      {msg.data_payload.evidence.map((ev, eIdx) => (
                        <li key={eIdx}>{ev}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Rich Data Payload: Recommended Action */}
                {msg.data_payload?.recommended_action && (
                  <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-[var(--gold-soft)] to-[var(--panel-2)] border border-[var(--gold)]/40 text-right space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-[var(--gold)] flex items-center gap-1">
                        <Zap size={13} />
                        اقدام پیشنهادی (Next Best Action)
                      </span>
                      <span className="font-mono text-[10px] text-[var(--text-faint)]">
                        مهلت: {msg.data_payload.recommended_action.deadline}
                      </span>
                    </div>
                    <div className="text-[12px] font-bold text-[var(--text)]">
                      {msg.data_payload.recommended_action.title}
                    </div>
                    <div className="text-[10.5px] text-[var(--text-faint)]">
                      اثر مورد انتظار: {msg.data_payload.recommended_action.impact}
                    </div>
                    <button
                      onClick={() => onNavigateToPage('priorities')}
                      className="copan-btn copan-btn-gold w-full py-1.5 text-[11.5px] font-bold rounded-lg mt-1"
                    >
                      مشاهده در کارتابل اقدامات
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isCobatTyping && (
          <div className="flex items-center gap-2 text-[11.5px] text-[var(--gold)] bg-[var(--panel)] border border-[var(--hair)] px-3.5 py-2 rounded-2xl w-fit">
            <Bot size={15} className="animate-spin text-[var(--gold)]" />
            <span>کوبات در حال تحلیل پایگاه داده و استخراج شواهد...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-[var(--panel-2)] border-t border-[var(--hair)] flex items-center gap-2">
        <input
          type="text"
          placeholder="از کوبات بپرسید..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="flex-1 bg-[var(--panel)] border border-[var(--hair-strong)] rounded-xl px-3.5 py-2 text-[12.5px] text-[var(--text)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-faint)]"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim()}
          className="p-2.5 rounded-xl bg-[var(--brand-deep)] hover:bg-[var(--brand)] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="ارسال"
        >
          <Send size={15} className="rotate-180" />
        </button>
      </div>
    </div>
  );
};
