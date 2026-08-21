import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Layers,
  RotateCcw,
} from 'lucide-react';
import type { PageId } from '../components/layout/Sidebar';
import { useCopan } from '../context/CopanContext';
import { ActionModal } from '../components/modals/ActionModal';
import { QualityChainModal } from '../components/modals/QualityChainModal';

interface CobatPageProps {
  onNavigate: (page: PageId) => void;
  onSelectCustomer: (customerId: string) => void;
  selectedCustomerId: string;
}

const DEMO_SCENARIOS: Array<{
  id: string; title: string; prompt: string; tag: string; tagColor: string; targetCustomerId: string;
}> = [];

export const CobatPage: React.FC<CobatPageProps> = ({
  onNavigate,
  onSelectCustomer,
}) => {
  const {
    cobatMessages,
    sendCobatMessage,
    clearCobatMemory,
    isCobatTyping,
    activeCustomer,
  } = useCopan();

  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'evidence' | 'context' | 'actions'>('evidence');

  // Modals
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [qualityModalOpen, setQualityModalOpen] = useState(false);
  const [actionModalTitle, setActionModalTitle] = useState('');
  const [targetCustomerName, setTargetCustomerName] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [cobatMessages, isCobatTyping]);

  const handleSend = (text?: string) => {
    const query = (text || inputValue).trim();
    if (!query) return;
    sendCobatMessage(query, 'cobat');
    setInputValue('');
  };

  // Find latest message with evidence / recommendations
  const latestCobatMsg = [...cobatMessages].reverse().find((m) => m.sender === 'cobat' && m.data_payload);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[640px] animate-in fade-in duration-150">
      {/* ==========================================
          LEFT / MAIN CHAT WORKSPACE (8 COLS)
          ========================================== */}
      <div className="lg:col-span-8 flex flex-col copan-card p-0 overflow-hidden border-[var(--hair)]">
        {/* Workspace Toolbar */}
        <div className="px-5 py-3.5 bg-[var(--panel-2)] border-b border-[var(--hair)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--text)] text-[var(--bg)] flex items-center justify-center shadow-xs">
              <Bot size={16} />
            </div>
            <div>
              <div className="font-extrabold text-[14px] text-[var(--text)] flex items-center gap-2">
                <span>میز کار تصمیم‌ساز COBAT Agentic</span>
                <span className="copan-badge badge-neutral font-mono text-[9.5px]">DuckDB Connected</span>
              </div>
              <div className="text-[11px] text-[var(--text-faint)]">
                مشتری منتخب: <b>{activeCustomer.customer_name}</b> ({activeCustomer.customer_id})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearCobatMemory}
              className="copan-btn copan-btn-secondary copan-btn-sm text-[11px]"
              title="پاکسازی حافظه جلسه"
            >
              <RotateCcw size={12} />
              شروع مجدد
            </button>
          </div>
        </div>

        {/* Demo Scenarios Quick Launcher Bar */}
        <div className="p-2.5 bg-[var(--panel-2)]/60 border-b border-[var(--hair)] flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10.5px] font-semibold text-[var(--text-faint)] shrink-0 flex items-center gap-1">
            <Sparkles size={12} className="text-[var(--gold)]" />
            سناریوها:
          </span>
          {DEMO_SCENARIOS.map((scen) => (
            <button
              key={scen.id}
              onClick={() => {
                onSelectCustomer(scen.targetCustomerId);
                handleSend(scen.prompt);
              }}
              className="px-2.5 py-1 rounded-lg bg-[var(--panel)] border border-[var(--hair)] hover:border-[var(--hair-strong)] text-[var(--text-dim)] shrink-0 text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span className={`copan-badge ${scen.tagColor} text-[9px]`}>{scen.tag}</span>
              <span>{scen.title}</span>
            </button>
          ))}
        </div>

        {/* Message Thread Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-right bg-[var(--bg)]/30">
          {cobatMessages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center gap-1.5 text-[12px] text-[var(--text-dim)] px-1 font-medium">
                  <span className="font-bold text-[var(--text)]">{isUser ? 'کاربر مدیر' : 'کوبات (COBAT Decision Agent)'}</span>
                  <span>•</span>
                  <span className="font-mono">{msg.timestamp}</span>
                </div>

                <div
                  className={`p-4.5 rounded-2xl max-w-[90%] text-[14px] leading-[1.8] shadow-xs ${
                    isUser
                      ? 'bg-[var(--text)] text-[var(--bg)] rounded-br-none border border-[var(--text)]'
                      : 'bg-[var(--panel)] text-[var(--text)] rounded-bl-none border border-[var(--hair)]'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2.5">
                    {msg.text.split('\n\n').map((para, pIdx) => {
                      if (para.startsWith('### ')) {
                        return (
                          <h4 key={pIdx} className="font-extrabold text-[15px] text-[var(--gold)] pt-1 border-b border-[var(--hair)] pb-1 mb-2">
                            {para.replace('### ', '')}
                          </h4>
                        );
                      }
                      return <p key={pIdx}>{para}</p>;
                    })}
                  </div>

                  {/* Render Table if attached */}
                  {msg.data_payload?.table && (
                    <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--hair)] bg-[var(--panel-2)]">
                      <table className="w-full text-right text-[12.5px]">
                        <thead className="bg-[var(--panel-3)] text-[var(--text-dim)]">
                          <tr>
                            {msg.data_payload.table.headers.map((h, hIdx) => (
                              <th key={hIdx} className="p-2.5 font-bold whitespace-nowrap">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--hair)]">
                          {msg.data_payload.table.rows.map((r, rIdx) => (
                            <tr key={rIdx} className="hover:bg-[var(--panel)]/70">
                              {r.map((c, cIdx) => (
                                <td key={cIdx} className="p-2.5 font-medium whitespace-nowrap">
                                  {c}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Render Action Trigger if attached */}
                  {msg.data_payload?.recommended_action && (
                    <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-[var(--gold-soft)] to-[var(--panel-2)] border border-[var(--gold)]/40 flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <div className="text-[11px] font-bold text-[var(--gold)] flex items-center gap-1">
                          <Zap size={13} />
                          اقدام پیشنهادی (Next Best Action):
                        </div>
                        <div className="font-bold text-[12.5px] text-[var(--text)] mt-0.5">
                          {msg.data_payload.recommended_action.title}
                        </div>
                        <div className="text-[10.5px] text-[var(--text-faint)]">
                          مهلت: {msg.data_payload.recommended_action.deadline} • اثر: {msg.data_payload.recommended_action.impact}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActionModalTitle(msg.data_payload!.recommended_action!.title);
                          setTargetCustomerName(activeCustomer.customer_name);
                          setActionModalOpen(true);
                        }}
                        className="copan-btn copan-btn-gold py-1.5 px-4 text-[12px] font-bold"
                      >
                        اجرای فوری
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isCobatTyping && (
            <div className="flex items-center gap-2 text-[12px] text-[var(--gold)] bg-[var(--panel)] border border-[var(--hair)] px-4 py-2.5 rounded-2xl w-fit">
              <Bot size={16} className="animate-spin text-[var(--gold)]" />
              <span>کوبات در حال تحلیل چندمنظوره و اجرای کوئری DuckDB...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[var(--panel)] border-t border-[var(--hair)] flex items-center gap-2">
          <input
            type="text"
            placeholder="پرسش خود را بنویسید (مثال: ۵ مشتری برتر از نظر فروش که اخیراً افت داشته‌اند کیا هستن؟)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 bg-[var(--panel-2)] border border-[var(--hair-strong)] rounded-xl px-4 py-2.5 text-[13px] text-[var(--text)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-faint)] transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
            className="copan-btn copan-btn-primary py-2.5 px-5 text-[13px] font-bold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>ارسال پرسش</span>
            <Send size={15} className="rotate-180" />
          </button>
        </div>
      </div>

      {/* ==========================================
          RIGHT SIDE PANEL: EVIDENCE & CONTEXT (4 COLS)
          ========================================== */}
      <div className="lg:col-span-4 copan-card p-0 flex flex-col overflow-hidden border-[var(--hair)]">
        {/* Right Panel Tabs */}
        <div className="px-4 py-3 bg-[var(--panel-2)] border-b border-[var(--hair)] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[12px] font-bold">
            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'evidence'
                  ? 'bg-[var(--gold)] text-[#081610] font-extrabold shadow-xs'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              شواهد و اعتماد
            </button>
            <button
              onClick={() => setActiveTab('context')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'context'
                  ? 'bg-[var(--gold)] text-[#081610] font-extrabold shadow-xs'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              زمینه حساب
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'actions'
                  ? 'bg-[var(--gold)] text-[#081610] font-extrabold shadow-xs'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              اقدامات HITL
            </button>
          </div>
        </div>

        {/* Tab 1: Evidence & Trust */}
        {activeTab === 'evidence' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-right">
            <div className="p-3.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[12px] text-[var(--gold)] flex items-center gap-1.5">
                  <ShieldCheck size={16} />
                  ضریب اطمینان تصمیم هوشمند
                </span>
                <span className="copan-badge badge-positive font-mono text-[11px]">۹۴٪ اطمینان</span>
              </div>
              <p className="text-[11.5px] text-[var(--text-dim)] leading-relaxed">
                تمام ادعاهای هوش مصنوعی بر اساس ردیابی تراکنش‌های پایگاه داده و استانداردهای نساجی استخراج شده‌اند.
              </p>
            </div>

            {/* Evidence items from latest analysis */}
            <div className="space-y-2">
              <div className="text-[11.5px] font-bold text-[var(--text-faint)]">
                شواهد فعال در پاسخ جاری:
              </div>

              {latestCobatMsg?.data_payload?.evidence ? (
                latestCobatMsg.data_payload.evidence.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[var(--panel-3)]/60 border border-[var(--hair)] text-[12px] text-[var(--text)] leading-relaxed flex items-start gap-2"
                  >
                    <CheckCircle2 size={15} className="text-[var(--positive)] shrink-0 mt-0.5" />
                    <span>{ev}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] text-[11.5px] text-[var(--text-faint)]">
                  هنوز تحلیلی دارای شواهد در این گفتگو ثبت نشده است. یکی از سناریوهای بالا را انتخاب کنید.
                </div>
              )}
            </div>

            {/* Quality Chain Investigation shortcut */}
            <div className="p-3.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-2">
              <div className="font-bold text-[12px] text-[var(--text)] flex items-center gap-1.5">
                <Layers size={15} />
                <span>ردیابی علّی کیفیت تا خط تولید:</span>
              </div>
              <p className="text-[11px] text-[var(--text-dim)]">
                بررسی انطباق شکایت‌ها با لات‌های تولید و آزمون‌های آزمایشگاه QMS
              </p>
              <button
                onClick={() => setQualityModalOpen(true)}
                className="copan-btn copan-btn-secondary copan-btn-sm w-full text-[11.5px]"
              >
                مشاهده زنجیره کیفیت لات LOT-113068
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Customer Context */}
        {activeTab === 'context' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-right">
            <div className="p-3.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[13px] text-[var(--text)]">
                  {activeCustomer.customer_name}
                </span>
                <span className="copan-badge badge-gold">سگمنت {activeCustomer.customer_segment}</span>
              </div>
              <div className="text-[11px] text-[var(--text-faint)] font-mono">
                {activeCustomer.customer_id} • {activeCustomer.location_name}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11.5px]">
              <div className="p-2.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)]">
                <div className="text-[10.5px] text-[var(--text-faint)]">فروش تجمعی</div>
                <div className="font-mono font-bold text-[13px] text-[var(--text)] mt-0.5">
                  {(activeCustomer.lifetime_revenue / 1000000).toFixed(0)} م.ر
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)]">
                <div className="text-[10.5px] text-[var(--text-faint)]">شاخص ریسک</div>
                <div className="font-mono font-bold text-[13px] text-[var(--risk)] mt-0.5">
                  {activeCustomer.risk_score} / ۱۰۰
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)]">
                <div className="text-[10.5px] text-[var(--text-faint)]">سهم از سبد</div>
                <div className="font-mono font-bold text-[13px] text-[var(--text)] mt-0.5">
                  {activeCustomer.avg_nafis_share_pct}٪
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)]">
                <div className="text-[10.5px] text-[var(--text-faint)]">رقیب اصلی</div>
                <div className="font-bold text-[12px] text-[var(--gold)] mt-0.5">
                  {activeCustomer.main_competitor}
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('customer_360')}
              className="copan-btn copan-btn-primary w-full py-2 text-[12px] font-bold"
            >
              مشاهده پروفایل کامل ۳۶۰ درجه
            </button>
          </div>
        )}

        {/* Tab 3: Action Audit Log */}
        {activeTab === 'actions' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-right text-[12px]">
            <div className="text-[11.5px] font-bold text-[var(--text-faint)]">
              گزارش ثبت اقدامات انسانی (HITL Audit Log):
            </div>

            <div className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[var(--positive)]">اقدام تایید شده</span>
                <span className="font-mono text-[10px] text-[var(--text-faint)]">امروز، ۱۴:۲۰</span>
              </div>
              <div className="font-bold text-[12px] text-[var(--text)]">
                ارسال نمونه ۵۰۰ کیلوگرمی به تار و پود اصفهان
              </div>
              <div className="text-[10.5px] text-[var(--text-faint)]">
                توسط: مدیر ارشد فروش • شناسه: ACT-005
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[var(--positive)]">اقدام تایید شده</span>
                <span className="font-mono text-[10px] text-[var(--text-faint)]">دیروز، ۱۰:۱۵</span>
              </div>
              <div className="font-bold text-[12px] text-[var(--text)]">
                توقف بارگیری لات LOT-113068 به علت انحراف تست کشش
              </div>
              <div className="text-[10.5px] text-[var(--text-faint)]">
                توسط: مدیر کنترل کیفیت QMS • شناسه: ACT-PRD-01
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ActionModal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        title={actionModalTitle}
        customerName={targetCustomerName}
        onConfirm={() => {
          // Action executed
        }}
      />

      <QualityChainModal
        isOpen={qualityModalOpen}
        onClose={() => setQualityModalOpen(false)}
        customerName={activeCustomer.customer_name}
      />
    </div>
  );
};
