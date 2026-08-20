import React, { useState } from 'react';
import {
  X,
  Building2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  PhoneCall,
  Bot,
  ExternalLink,
  Plus,
  FileText,
  CreditCard,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useCopan } from '../../context/CopanContext';
import { type CopanTask, type TaskPriority, type TaskState } from '../../data/copanIntelligence';
import type { PageId } from '../layout/Sidebar';

interface TaskDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: CopanTask | null;
  onSelectCustomer: (customerId: string) => void;
  onNavigate: (page: PageId) => void;
  onOpenInteractionModal: (task: CopanTask) => void;
  onOpenCobat: (prompt?: string) => void;
}

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({
  isOpen,
  onClose,
  task,
  onSelectCustomer,
  onNavigate,
  onOpenInteractionModal,
  onOpenCobat,
}) => {
  const { updateTaskStatus, updateTaskPriority, updateTaskDueDate, addTaskNote } = useCopan();
  const [newNote, setNewNote] = useState('');
  const [isEditingDueDate, setIsEditingDueDate] = useState(false);
  const [customDueDate, setCustomDueDate] = useState('');

  if (!isOpen || !task) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addTaskNote(task.id, newNote.trim());
    setNewNote('');
  };

  const handleStatusChange = (status: TaskState) => {
    updateTaskStatus(task.id, status);
  };

  const handlePriorityChange = (priority: TaskPriority) => {
    updateTaskPriority(task.id, priority);
  };

  const handleQuickReschedule = (_days: number, label: string) => {
    updateTaskDueDate(task.id, label);
    setIsEditingDueDate(false);
  };

  const handleCustomDueDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDueDate.trim()) return;
    updateTaskDueDate(task.id, customDueDate.trim());
    setIsEditingDueDate(false);
    setCustomDueDate('');
  };

  const priorityStyles = {
    Critical: {
      badge: 'bg-[var(--risk-soft)] text-[var(--risk)] border-[var(--risk-border)]',
      border: 'border-r-[var(--risk)]',
      icon: <AlertTriangle size={15} className="text-[var(--risk)]" />,
    },
    High: {
      badge: 'bg-[var(--gold-soft)] text-[var(--gold)] border-[var(--gold)]/30',
      border: 'border-r-[var(--gold)]',
      icon: <Clock size={15} className="text-[var(--gold)]" />,
    },
    Medium: {
      badge: 'bg-[var(--brand-pale)] text-[var(--brand-light)] border-[var(--hair)]',
      border: 'border-r-[var(--brand)]',
      icon: <Clock size={15} className="text-[var(--brand)]" />,
    },
    Low: {
      badge: 'bg-[var(--panel-2)] text-[var(--text-dim)] border-[var(--hair)]',
      border: 'border-r-[var(--text-faint)]',
      icon: <Clock size={15} className="text-[var(--text-faint)]" />,
    },
  }[task.priority];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer Container (Sliding from Right in RTL) */}
      <div
        className="fixed top-0 bottom-0 right-0 w-full max-w-[620px] bg-[var(--bg)] border-l border-[var(--hair-strong)] z-50 shadow-2xl flex flex-col transition-transform duration-200 animate-in slide-in-from-right"
        style={{ background: 'var(--panel)' }}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--hair)] flex items-center justify-between gap-3 bg-[var(--panel-2)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[var(--gold-soft)] border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] shrink-0">
              <Sparkles size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-[var(--text-faint)]">
                  {task.id}
                </span>
                <span className={`copan-badge ${priorityStyles.badge} text-[11px] font-bold`}>
                  {task.priority_label}
                </span>
                <span className="copan-badge badge-neutral text-[10.5px]">
                  {task.task_type_label}
                </span>
              </div>
              <h2 className="font-extrabold text-[15.5px] text-[var(--text)] truncate mt-0.5">
                {task.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--panel)] transition-colors"
            title="بستن پنجره"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Customer Link Card */}
          <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[var(--panel)] border border-[var(--hair-strong)] flex items-center justify-center text-[var(--gold)] shrink-0">
                <Building2 size={20} />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-[14.5px] text-[var(--text)] truncate">
                  {task.customer_name}
                </div>
                <div className="text-[11.5px] text-[var(--text-faint)] flex items-center gap-2 mt-0.5">
                  <span className="font-mono">{task.customer_id}</span>
                  {task.location_name && <span>• {task.location_name}</span>}
                  <span>• کارشناس: {task.sales_rep_name}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectCustomer(task.customer_id);
                onNavigate('customer_360');
                onClose();
              }}
              className="copan-btn copan-btn-secondary copan-btn-sm text-[11.5px] shrink-0 font-bold flex items-center gap-1"
            >
              <span>پروفایل ۳۶۰°</span>
              <ExternalLink size={13} />
            </button>
          </div>

          {/* 🎯 CORE REASONING: Because X -> Do Y */}
          <div className="p-4 rounded-xl bg-[var(--panel-2)] border-r-4 border-r-[var(--gold)] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-extrabold text-[var(--gold)] flex items-center gap-1.5">
                <Sparkles size={15} />
                منطق و چرایی اقدام (Decision Rationale)
              </span>
              <span className="text-[11px] font-bold text-[var(--text-faint)]">
                موتور هوشمند تصمیم‌ساز
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[var(--panel)] border border-[var(--hair)] space-y-2 text-[12.5px] leading-relaxed">
              <div>
                <span className="font-extrabold text-[var(--risk)]">چرا این اتفاق افتاد؟ </span>
                <span className="text-[var(--text-dim)]">{task.because_signal || task.reason}</span>
              </div>
              <div className="pt-2 border-t border-[var(--hair)]">
                <span className="font-extrabold text-[var(--positive)]">چه کاری باید انجام شود؟ </span>
                <span className="text-[var(--text)] font-semibold">{task.should_action || task.suggested_next_step}</span>
              </div>
            </div>
          </div>

          {/* Contextual Information Card */}
          {task.context_data && (
            <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-3">
              <span className="text-[12px] font-bold text-[var(--text-dim)] block">
                داده‌ها و شواهد پشتیبان مرتبط
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                {task.context_data.financial_amount && (
                  <div className="p-2.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)] flex items-center justify-between">
                    <span className="text-[var(--text-faint)] flex items-center gap-1">
                      <CreditCard size={14} /> مبلغ درگیر:
                    </span>
                    <b className="font-mono text-[var(--text)]">
                      {(task.context_data.financial_amount / 1000000).toFixed(1)} میلیون ریال
                    </b>
                  </div>
                )}

                {task.context_data.delay_days !== undefined && (
                  <div className="p-2.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)] flex items-center justify-between">
                    <span className="text-[var(--text-faint)] flex items-center gap-1">
                      <Clock size={14} /> تاخیر وصول:
                    </span>
                    <b className="font-mono text-[var(--risk)]">{task.context_data.delay_days} روز</b>
                  </div>
                )}

                {task.context_data.complaint_id && (
                  <div className="p-2.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)] flex items-center justify-between">
                    <span className="text-[var(--text-faint)] flex items-center gap-1">
                      <ShieldAlert size={14} /> پرونده شکایت:
                    </span>
                    <b className="font-mono text-[var(--gold)]">{task.context_data.complaint_id}</b>
                  </div>
                )}

                {task.context_data.offer_id && (
                  <div className="p-2.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)] flex items-center justify-between">
                    <span className="text-[var(--text-faint)] flex items-center gap-1">
                      <FileText size={14} /> کد آفر قیمت:
                    </span>
                    <b className="font-mono text-[var(--text)]">{task.context_data.offer_id}</b>
                  </div>
                )}

                {task.context_data.expected_impact && (
                  <div className="sm:col-span-2 p-2.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)] flex items-center justify-between text-[11.5px]">
                    <span className="text-[var(--text-faint)]">اثر مورد انتظار:</span>
                    <b className="text-[var(--positive)]">{task.context_data.expected_impact}</b>
                  </div>
                )}

                {task.context_data.crm_interaction_summary && (
                  <div className="sm:col-span-2 p-2.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)] space-y-1">
                    <span className="text-[11px] text-[var(--text-faint)] block">آخرین تعامل CRM:</span>
                    <p className="text-[11.5px] text-[var(--text-dim)] leading-relaxed">
                      {task.context_data.crm_interaction_summary}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Interactive Status & Priority Management */}
          <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-4">
            <span className="text-[12px] font-bold text-[var(--text-dim)] block">
              تنظیمات وضعیت و زمان‌بندی اقدام
            </span>

            {/* Status Tabs */}
            <div>
              <label className="text-[11px] text-[var(--text-faint)] block mb-1.5 font-medium">
                وضعیت فرآیندی وظیفه:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-[var(--panel)] p-1 rounded-xl border border-[var(--hair)] text-[11.5px]">
                {(['To Do', 'In Progress', 'Completed', 'Snoozed'] as TaskState[]).map((st) => {
                  const isActive = task.status === st;
                  const labelMap: Record<TaskState, string> = {
                    'To Do': 'در انتظار انجام',
                    'In Progress': 'در جریان',
                    Completed: 'تکمیل‌شده',
                    Snoozed: 'به‌تعویق‌افتاده',
                    Overdue: 'معوق',
                  };
                  return (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(st)}
                      className={`py-1.5 px-2 rounded-lg font-bold transition-all text-center ${
                        isActive
                          ? st === 'Completed'
                            ? 'bg-[var(--positive)] text-white shadow-xs'
                            : st === 'In Progress'
                            ? 'bg-[var(--brand-deep)] text-white shadow-xs'
                            : 'bg-[var(--text)] text-[var(--bg)] shadow-xs'
                          : 'text-[var(--text-dim)] hover:text-[var(--text)]'
                      }`}
                    >
                      {labelMap[st]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority Selector */}
            <div>
              <label className="text-[11px] text-[var(--text-faint)] block mb-1.5 font-medium">
                سطح اولویت تجاری:
              </label>
              <div className="grid grid-cols-4 gap-1.5 bg-[var(--panel)] p-1 rounded-xl border border-[var(--hair)] text-[11.5px]">
                {(['Critical', 'High', 'Medium', 'Low'] as TaskPriority[]).map((pr) => {
                  const isActive = task.priority === pr;
                  const labelMap: Record<TaskPriority, string> = {
                    Critical: 'بحرانی (P0)',
                    High: 'بالا (P1)',
                    Medium: 'متوسط (P2)',
                    Low: 'عادی (P3)',
                  };
                  return (
                    <button
                      key={pr}
                      onClick={() => handlePriorityChange(pr)}
                      className={`py-1.5 px-1.5 rounded-lg font-bold transition-all text-center ${
                        isActive
                          ? pr === 'Critical'
                            ? 'bg-[var(--risk)] text-white shadow-xs'
                            : pr === 'High'
                            ? 'bg-[var(--gold)] text-[#0e1c12] shadow-xs'
                            : 'bg-[var(--text)] text-[var(--bg)] shadow-xs'
                          : 'text-[var(--text-dim)] hover:text-[var(--text)]'
                      }`}
                    >
                      {labelMap[pr]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due Date & Reschedule Shortcuts */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] text-[var(--text-faint)] font-medium">
                  مهلت اقدام / سررسید:
                </label>
                <span className="text-[11.5px] font-mono font-bold text-[var(--gold)]">
                  {task.due_date}
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => handleQuickReschedule(0, 'امروز')}
                  className="px-2.5 py-1 rounded-lg bg-[var(--panel)] border border-[var(--hair)] text-[11px] font-bold text-[var(--text-dim)] hover:text-[var(--text)]"
                >
                  امروز
                </button>
                <button
                  onClick={() => handleQuickReschedule(1, 'فردا')}
                  className="px-2.5 py-1 rounded-lg bg-[var(--panel)] border border-[var(--hair)] text-[11px] font-bold text-[var(--text-dim)] hover:text-[var(--text)]"
                >
                  +۱ روز
                </button>
                <button
                  onClick={() => handleQuickReschedule(3, '۳ روز مانده')}
                  className="px-2.5 py-1 rounded-lg bg-[var(--panel)] border border-[var(--hair)] text-[11px] font-bold text-[var(--text-dim)] hover:text-[var(--text)]"
                >
                  +۳ روز
                </button>
                <button
                  onClick={() => handleQuickReschedule(7, '۷ روز مانده')}
                  className="px-2.5 py-1 rounded-lg bg-[var(--panel)] border border-[var(--hair)] text-[11px] font-bold text-[var(--text-dim)] hover:text-[var(--text)]"
                >
                  +۱ هفته
                </button>
                <button
                  onClick={() => setIsEditingDueDate(!isEditingDueDate)}
                  className="px-2.5 py-1 rounded-lg bg-[var(--panel)] border border-[var(--hair)] text-[11px] font-bold text-[var(--gold)] hover:underline"
                >
                  تاریخ دستی...
                </button>
              </div>

              {isEditingDueDate && (
                <form onSubmit={handleCustomDueDateSubmit} className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="مثال: ۱۴۰۴/۱۲/۲۸ یا ۳ روز مانده"
                    value={customDueDate}
                    onChange={(e) => setCustomDueDate(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)] text-[12px] text-[var(--text)] focus:outline-none focus:border-[var(--gold)]"
                  />
                  <button type="submit" className="copan-btn copan-btn-gold copan-btn-sm text-[11.5px]">
                    ثبت تاریخ
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Task History & Notes */}
          <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-[var(--text-dim)]">
                یادداشت‌ها و سابقه پیشرفت اقدام
              </span>
              <span className="text-[11px] font-mono text-[var(--text-faint)]">
                {task.notes?.length || 0} یادداشت
              </span>
            </div>

            {/* Notes List */}
            <div className="space-y-2">
              {task.notes && task.notes.length > 0 ? (
                task.notes.map((n, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)] text-[12px] space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10.5px] text-[var(--text-faint)]">
                      <span className="font-bold text-[var(--text-dim)]">{n.author}</span>
                      <span className="font-mono">{n.created_at}</span>
                    </div>
                    <p className="text-[var(--text)] leading-relaxed">{n.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-[11.5px] text-[var(--text-faint)] text-center py-2">
                  هنوز یادداشتی برای این اقدام ثبت نشده است.
                </div>
              )}
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="ثبت یادداشت جدید در خصوص این اقدام..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)] text-[12px] text-[var(--text)] focus:outline-none focus:border-[var(--gold)]"
              />
              <button
                type="submit"
                disabled={!newNote.trim()}
                className="copan-btn copan-btn-secondary copan-btn-sm text-[11.5px] shrink-0 font-bold disabled:opacity-50"
              >
                <Plus size={13} />
                ثبت
              </button>
            </form>
          </div>
        </div>

        {/* Drawer Bottom Action Bar */}
        <div className="p-4 sm:p-5 border-t border-[var(--hair)] bg-[var(--panel-2)] flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onOpenCobat(`راهنمای اقدام بهینه برای وظیفه ${task.title} مشتری ${task.customer_name}`);
            }}
            className="copan-btn copan-btn-secondary text-[12px] font-bold flex items-center gap-1.5"
            title="تحلیل و مشاوره با هوش مصنوعی"
          >
            <Bot size={15} className="text-[var(--gold)]" />
            <span>مشاوره COBAT</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onOpenInteractionModal(task);
                onClose();
              }}
              className="copan-btn copan-btn-gold text-[12px] font-bold flex items-center gap-1.5 shadow-sm"
            >
              <PhoneCall size={14} />
              <span>ثبت مکالمه و پیگیری</span>
            </button>

            {task.status !== 'Completed' ? (
              <button
                onClick={() => {
                  handleStatusChange('Completed');
                  onClose();
                }}
                className="copan-btn copan-btn-primary text-[12px] font-bold flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} />
                <span>تکمیل اقدام</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  handleStatusChange('To Do');
                }}
                className="copan-btn copan-btn-secondary text-[12px] font-bold"
              >
                بازگشایی مجدد
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
