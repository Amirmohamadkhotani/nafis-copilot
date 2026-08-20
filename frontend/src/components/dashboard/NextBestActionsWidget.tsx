import React from 'react';
import {
  Clock,
  Building2,
  PhoneCall,
  ChevronLeft,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useCopan } from '../../context/CopanContext';
import { type CopanTask } from '../../data/copanIntelligence';
import type { PageId } from '../layout/Sidebar';

interface NextBestActionsWidgetProps {
  onOpenTaskDetail: (task: CopanTask) => void;
  onOpenInteractionModal: (task: CopanTask) => void;
  onSelectCustomer: (customerId: string) => void;
  onNavigate: (page: PageId) => void;
  onViewAllTasks: () => void;
}

export const NextBestActionsWidget: React.FC<NextBestActionsWidgetProps> = ({
  onOpenTaskDetail,
  onOpenInteractionModal,
  onSelectCustomer,
  onNavigate,
  onViewAllTasks,
}) => {
  const { tasks } = useCopan();

  // Focus on top active high/critical priority tasks
  const topActions = tasks
    .filter((t) => t.status === 'To Do' || t.status === 'In Progress')
    .sort((a, b) => {
      const pWeight = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return pWeight[b.priority] - pWeight[a.priority];
    })
    .slice(0, 4);

  return (
    <div className="copan-card space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--hair)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[var(--gold-soft)] text-[var(--gold)] border border-[var(--gold)]/30">
              <Zap size={16} />
            </div>
            <h3 className="font-extrabold text-[15.5px] text-[var(--text)]">
              اقدامات هوشمند اولویت‌دار (Next Best Actions — NBA)
            </h3>
            <span className="copan-badge badge-risk text-[10.5px] font-bold font-mono">
              {topActions.length} اقدام نیازمند مداخله
            </span>
          </div>
          <p className="text-[11.5px] text-[var(--text-faint)] mt-0.5">
            قلب عملیاتی COPAN • هدایت دقیق کارشناس فروش: «به دلیل رویداد X، اقدام Y را انجام دهید»
          </p>
        </div>

        <button
          onClick={onViewAllTasks}
          className="text-[12px] font-bold text-[var(--gold)] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>مشاهده همه وظایف در کارتابل</span>
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* Action Cards Grid */}
      {topActions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topActions.map((task) => {
            const isCritical = task.priority === 'Critical';
            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl bg-[var(--panel-2)] border transition-all duration-150 space-y-3 relative group flex flex-col justify-between ${
                  isCritical
                    ? 'border-[var(--risk-border)] border-r-4 border-r-[var(--risk)]'
                    : 'border-[var(--hair)] border-r-4 border-r-[var(--gold)] hover:border-[var(--gold)]/40'
                }`}
              >
                <div className="space-y-2.5">
                  {/* Card Top Row: Customer & Priority Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div
                      onClick={() => {
                        onSelectCustomer(task.customer_id);
                        onNavigate('customer_360');
                      }}
                      className="flex items-center gap-2 cursor-pointer group/cust min-w-0"
                      title="مشاهده پروفایل ۳۶۰ مشتری"
                    >
                      <Building2 size={15} className="text-[var(--gold)] shrink-0" />
                      <span className="font-extrabold text-[13.5px] text-[var(--text)] group-hover/cust:text-[var(--gold)] group-hover/cust:underline truncate">
                        {task.customer_name}
                      </span>
                      <span className="text-[10.5px] font-mono text-[var(--text-faint)] shrink-0">
                        ({task.customer_id})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`copan-badge ${
                          isCritical ? 'badge-risk' : 'badge-gold'
                        } text-[10.5px] font-bold`}
                      >
                        {task.priority_label}
                      </span>
                    </div>
                  </div>

                  {/* Action Title */}
                  <h4 className="font-extrabold text-[13.5px] text-[var(--text)] leading-snug">
                    {task.title}
                  </h4>

                  {/* 🎯 STRUCTURED REASON: Because X -> Do Y */}
                  <div className="p-2.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)] space-y-1.5 text-[11.5px] leading-relaxed">
                    <div>
                      <span className="font-bold text-[var(--risk)]">علت: </span>
                      <span className="text-[var(--text-dim)]">{task.because_signal || task.reason}</span>
                    </div>
                    <div className="pt-1 border-t border-[var(--hair)]">
                      <span className="font-bold text-[var(--positive)]">اقدام پیشنهادی: </span>
                      <span className="text-[var(--text)] font-medium">
                        {task.should_action || task.suggested_next_step}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Due Date & Action Buttons */}
                <div className="pt-2 border-t border-[var(--hair)] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-faint)]">
                    <Clock size={13} className={isCritical ? 'text-[var(--risk)]' : 'text-[var(--gold)]'} />
                    <span>مهلت: <b className="text-[var(--text)]">{task.due_date}</b></span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenInteractionModal(task)}
                      className="copan-btn copan-btn-gold copan-btn-sm text-[11px] font-bold flex items-center gap-1 shadow-xs"
                      title="ثبت نتیجه تماس یا مذاکره"
                    >
                      <PhoneCall size={12} />
                      <span>ثبت مکالمه</span>
                    </button>

                    <button
                      onClick={() => onOpenTaskDetail(task)}
                      className="copan-btn copan-btn-secondary copan-btn-sm text-[11px] font-bold"
                    >
                      مدیریت اقدام
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-8 text-center rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-2">
          <CheckCircle2 size={32} className="text-[var(--positive)] mx-auto" />
          <h4 className="font-extrabold text-[14px] text-[var(--text)]">
            هیچ اقدام معوق یا بحرانی نیازمند توجه فوری وجود ندارد
          </h4>
          <p className="text-[12px] text-[var(--text-faint)] max-w-[420px] mx-auto">
            تمامی وظایف اولویت‌دار انجام شده‌اند یا در زمان‌بندی تعیین‌شده قرار دارند. می‌توانید از بخش زیر اقدامات جدید ثبت نمایید.
          </p>
        </div>
      )}
    </div>
  );
};
