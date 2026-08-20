import { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  RotateCcw,
  Check,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import type { CopilotResponse } from '../types';

interface AICopilotPanelProps {
  currentCustomerId?: string;
  activeStatus: string;
  messages: Array<{
    sender: 'user' | 'ai';
    text: string;
    payload?: CopilotResponse;
  }>;
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
  onDispatchAction: (action: any) => void;
  onClose?: () => void;
  onClearChat?: () => void;
}

export const AICopilotPanel: React.FC<AICopilotPanelProps> = ({
  currentCustomerId,
  activeStatus: _activeStatus,
  messages,
  onSendMessage,
  isLoading,
  onDispatchAction,
  onClose,
  onClearChat,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    onSendMessage(inputVal.trim());
    setInputVal('');
  };

  const handleCopyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const samplePrompts = [
    'مشتری‌های در حال بدتر شدن را پیدا کن',
    'فرصت‌های رشد سهم سبد را نشان بده',
    currentCustomerId
      ? `چرا فروش مشتری ${currentCustomerId} افت کرده؟`
      : 'چرا فروش مشتری C_773326 افت کرده؟',
    currentCustomerId
      ? `برای جلسه با ${currentCustomerId} چه نکاتی مهم است؟`
      : 'شکایات باز و بحرانی کدامند؟',
  ];

  return (
    <div className="fixed bottom-5 left-5 z-50 w-[420px] max-w-[calc(100vw-40px)] bg-surface border border-border-medium rounded-sm shadow-modal flex flex-col max-h-[600px] h-[560px] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Copilot Header */}
      <div className="bg-surface-subtle border-b border-border-subtle p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-sm bg-brand text-white flex items-center justify-center font-bold shadow-sm">
            <Bot size={15} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ink">COPAN AI Copilot</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            </div>
            <span className="text-[10.5px] text-ink-muted block">
              دستیار هوشمند و تحلیلگر قطعی داده‌های فروش
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {currentCustomerId && (
            <span className="badge badge-brand text-[10px] font-mono">
              {currentCustomerId}
            </span>
          )}
          {onClearChat && (
            <button
              type="button"
              className="p-1 rounded-sm text-ink-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer"
              onClick={onClearChat}
              title="پاک کردن تاریخچه"
            >
              <RotateCcw size={13} />
            </button>
          )}
          {onClose && (
            <button
              type="button"
              className="p-1 rounded-sm text-ink-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer"
              onClick={onClose}
              title="بستن"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 overflow-y-auto flex flex-col gap-3 text-xs">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          const p = msg.payload;

          return (
            <div
              key={idx}
              className={`flex flex-col ${
                isUser ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[88%] p-3 rounded-sm leading-relaxed text-xs ${
                  isUser
                    ? 'bg-brand text-white shadow-sm'
                    : 'bg-surface-subtle border border-border-subtle text-ink'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Evidence & Facts Tags */}
                {p && p.evidence && p.evidence.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-border-subtle/80 flex flex-wrap gap-1">
                    {p.evidence.map((ev, i) => (
                      <span
                        key={i}
                        className="badge badge-neutral text-[10px]"
                        title={`منبع: ${ev.source}`}
                      >
                        📌 {ev.metric}: <strong>{ev.value}</strong>
                      </span>
                    ))}
                  </div>
                )}

                {/* Pending HITL Action */}
                {p && p.pending_action && (
                  <div className="mt-2.5 p-2.5 rounded-sm bg-alert-amber-bg border border-alert-amber-border text-alert-amber-ink">
                    <div className="font-bold text-[11.5px] mb-1">
                      ⚠️ اقدام آماده اجرا (تأیید کاربر الزامی است):
                    </div>
                    <div className="text-[11px] mb-2">{p.pending_action.confirmation_prompt}</div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-primary text-[11px]"
                        onClick={() => onSendMessage('بله، اقدام را تأیید و اجرا کن')}
                      >
                        <CheckCircle2 size={12} />
                        <span>تأیید و ثبت در سیستم</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary text-[11px]"
                        onClick={() => onSendMessage('خیر، انصراف')}
                      >
                        <span>لغو</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* UI Direct Action Button */}
                {p && p.ui_action && (
                  <div className="mt-2.5 pt-2 border-t border-border-subtle/80">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary w-full text-brand"
                      onClick={() => onDispatchAction(p.ui_action)}
                    >
                      <span>اجرای فیلتر / مشاهده پرونده در صفحه</span>
                    </button>
                  </div>
                )}
              </div>

              {!isUser && (
                <button
                  type="button"
                  className="text-[10px] text-ink-faint hover:text-ink mt-1 flex items-center gap-1 self-start mr-1 cursor-pointer"
                  onClick={() => handleCopyText(msg.text, idx)}
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check size={10} className="text-brand" />
                      <span>کپی شد</span>
                    </>
                  ) : (
                    <>
                      <Copy size={10} />
                      <span>کپی متن</span>
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-surface-subtle border border-border-subtle rounded-sm max-w-[70%] text-ink-muted">
            <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
            <span className="text-[11.5px]">در حال تحلیل و استخراج شواهد...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-2 bg-surface border-t border-border-subtle overflow-x-auto flex gap-1.5 no-scrollbar">
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            type="button"
            className="text-[11px] px-2.5 py-1 rounded-sm bg-surface-subtle border border-border-subtle text-ink-secondary hover:border-brand hover:text-brand transition-colors whitespace-nowrap cursor-pointer"
            onClick={() => onSendMessage(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-surface border-t border-border-subtle flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          className="input-field flex-1 text-xs"
          placeholder="پرسش خود را بپرسید (مثال: وضعیت فروش C_773326)..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="btn btn-sm btn-primary h-8 px-3 cursor-pointer"
          disabled={isLoading || !inputVal.trim()}
        >
          <Send size={13} />
        </button>
      </form>
    </div>
  );
};
