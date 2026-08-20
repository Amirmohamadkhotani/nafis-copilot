import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Bot,
  Zap,
  UserCheck,
  Download,
} from 'lucide-react';
import type { PageId } from '../components/layout/Sidebar';
import { useCopan } from '../context/CopanContext';
import { type CopanActionPriority } from '../data/copanIntelligence';
import { ActionModal } from '../components/modals/ActionModal';
import { exportToCSV } from '../utils/exportUtils';

interface PrioritiesPageProps {
  onNavigate: (page: PageId) => void;
  onSelectCustomer: (customerId: string) => void;
  onOpenCobat: (prompt?: string) => void;
}

export const PrioritiesPage: React.FC<PrioritiesPageProps> = ({
  onNavigate,
  onSelectCustomer,
  onOpenCobat,
}) => {
  const { priorities, updatePriorityStatus } = useCopan();
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed' | 'Snoozed'>('Pending');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Critical' | 'High' | 'Medium' | 'Low'>('All');

  // Action modal
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [activeActionItem, setActiveActionItem] = useState<CopanActionPriority | null>(null);

  const filteredPriorities = priorities.filter((item) => {
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && item.priority !== priorityFilter) return false;
    return true;
  });

  const priorityGroups = [
    { key: 'Critical', label: 'اقدامات فوری و بحرانی (P0)', badgeColor: 'badge-risk', count: priorities.filter(p => p.priority === 'Critical' && p.status === 'Pending').length },
    { key: 'High', label: 'اقدامات با اولویت بالا (P1)', badgeColor: 'badge-gold', count: priorities.filter(p => p.priority === 'High' && p.status === 'Pending').length },
    { key: 'Medium', label: 'اقدامات با اولویت متوسط (P2)', badgeColor: 'badge-brand', count: priorities.filter(p => p.priority === 'Medium' && p.status === 'Pending').length },
    { key: 'Low', label: 'پیگیری‌های عادی و دوره‌ای (P3)', badgeColor: 'badge-neutral', count: priorities.filter(p => p.priority === 'Low' && p.status === 'Pending').length },
  ];

  const handleExportCSV = () => {
    const headers = ['شناسه', 'اولویت', 'نام مشتری', 'کد مشتری', 'مسئول فروش', 'عنوان اقدام', 'علت', 'اثر مورد انتظار', 'مهلت اقدام', 'وضعیت'];
    const rows = filteredPriorities.map((p) => [
      p.id,
      p.priority_label,
      p.customer_name,
      p.customer_id,
      p.sales_rep_name,
      p.title,
      p.reason,
      p.expected_impact,
      p.deadline,
      p.status,
    ]);
    exportToCSV(`COPAN_Priorities_${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header & Filter Controls */}
      <div className="copan-card space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--hair)]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-[16px] text-[var(--text)]">
                کارتابل اولویت‌های اقدام هوشمند (Today’s Priorities / NBA)
              </h2>
              <span className="copan-badge badge-risk font-mono text-[11px]">
                {priorities.filter((p) => p.status === 'Pending').length} اقدام باز
              </span>
            </div>
            <p className="text-[11.5px] text-[var(--text-faint)] mt-0.5">
              تبدیل سیگنال‌ها و تحلیل‌های هوش مصنوعی به وظایف مشخص با اثر درآمدی شفاف
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-[12px]">
            {/* Status Filter */}
            <div className="flex items-center bg-[var(--panel-2)] p-0.5 rounded-xl border border-[var(--hair)]">
              {(['Pending', 'Completed', 'Snoozed', 'All'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    statusFilter === st
                      ? 'bg-[var(--brand-deep)] text-white'
                      : 'text-[var(--text-dim)] hover:text-[var(--text)]'
                  }`}
                >
                  {st === 'Pending' ? 'اقدامات باز' : st === 'Completed' ? 'تکمیل‌شده' : st === 'Snoozed' ? 'به‌تعویق‌افتاده' : 'همه'}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportCSV}
              className="copan-btn copan-btn-secondary text-[11.5px]"
              title="دریافت فایل اکسل اقدامات"
            >
              <Download size={14} />
              خروجی اکسل
            </button>

            <button
              onClick={() => onOpenCobat('کدام اقدام امروز بالاترین اثر مالی را بر حفظ درآمد دارد؟')}
              className="copan-btn copan-btn-gold text-[12px] font-bold"
            >
              <Bot size={15} />
              اولویت‌بندی با COBAT
            </button>
          </div>
        </div>

        {/* Priority Summary Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {priorityGroups.map((g) => (
            <button
              key={g.key}
              onClick={() => setPriorityFilter(priorityFilter === g.key ? 'All' : (g.key as any))}
              className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                priorityFilter === g.key
                  ? 'bg-[var(--panel-2)] border-[var(--gold)] shadow-xs'
                  : 'bg-[var(--panel)] border-[var(--hair)] hover:border-[var(--hair-strong)]'
              }`}
            >
              <div className="text-[11px] text-[var(--text-faint)]">{g.label}</div>
              <div className="font-mono font-bold text-[18px] text-[var(--text)] mt-1 flex items-center justify-between">
                <span>{g.count} وظیفه</span>
                <span className={`copan-badge ${g.badgeColor} text-[10px]`}>{g.key}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Priority Action Cards List */}
      <div className="space-y-4">
        {filteredPriorities.length === 0 ? (
          <div className="copan-card p-12 text-center text-[var(--text-faint)] space-y-2">
            <CheckCircle2 size={36} className="mx-auto text-[var(--positive)]" />
            <div className="font-bold text-[14px] text-[var(--text)]">هیچ اقدامی در این فیلتر وجود ندارد</div>
            <p className="text-[12px]">تمامی وظایف این بخش انجام یا فیلتر شده‌اند.</p>
          </div>
        ) : (
          filteredPriorities.map((item) => (
            <div
              key={item.id}
              className={`copan-card p-5 space-y-4 border-r-4 transition-all ${
                item.priority === 'Critical'
                  ? 'border-r-[var(--risk)]'
                  : item.priority === 'High'
                  ? 'border-r-[var(--gold)]'
                  : item.priority === 'Medium'
                  ? 'border-r-[var(--teal)]'
                  : 'border-r-[var(--hair-strong)]'
              }`}
            >
              {/* Card Top */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--hair)]">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span
                    className={`copan-badge ${
                      item.priority === 'Critical'
                        ? 'badge-risk'
                        : item.priority === 'High'
                        ? 'badge-gold'
                        : 'badge-brand'
                    }`}
                  >
                    {item.priority_label}
                  </span>
                  <h3
                    onClick={() => {
                      onSelectCustomer(item.customer_id);
                      onNavigate('customer_360');
                    }}
                    className="font-extrabold text-[15px] text-[var(--text)] hover:text-[var(--gold)] cursor-pointer transition-colors"
                  >
                    {item.customer_name}
                  </h3>
                  <span className="text-[11px] font-mono text-[var(--text-faint)]">
                    ({item.customer_id})
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11.5px] text-[var(--text-faint)]">
                  <span>مسئول: <b>{item.sales_rep_name}</b></span>
                  <span>• مهلت: <b className="font-mono text-[var(--text)]">{item.deadline}</b></span>
                  <span>
                    وضعیت:{' '}
                    <b
                      className={
                        item.status === 'Completed'
                          ? 'text-[var(--positive)]'
                          : item.status === 'Snoozed'
                          ? 'text-[var(--gold)]'
                          : 'text-[var(--risk)]'
                      }
                    >
                      {item.status === 'Completed'
                        ? 'انجام شده'
                        : item.status === 'Snoozed'
                        ? 'به تعویق افتاده'
                        : 'در انتظار اقدام'}
                    </b>
                  </span>
                </div>
              </div>

              {/* Title & Reason */}
              <div className="space-y-2 text-right">
                <div className="font-extrabold text-[15px] text-[var(--text)]">
                  {item.title}
                </div>
                <p className="text-[13.5px] text-[var(--text-dim)] font-medium leading-relaxed">
                  {item.reason}
                </p>
              </div>

              {/* Evidence Box */}
              <div className="p-3.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-1.5 text-[12.5px]">
                <div className="font-bold text-[var(--gold)] flex items-center gap-1 text-[12px]">
                  <span>شواهد پشتیبان هوش مصنوعی (Evidence):</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[var(--text-dim)] font-medium pr-1">
                  {item.evidence.map((ev: string, eIdx: number) => (
                    <li key={eIdx}>{ev}</li>
                  ))}
                </ul>
              </div>

              {/* Recommended Action & Footer Controls */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[var(--gold-soft)] to-[var(--panel-2)] border border-[var(--gold)]/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="text-[11.5px] font-bold text-[var(--gold)]">
                    دستور اقدام پیشنهادی (Recommended NBA):
                  </div>
                  <div className="font-bold text-[14px] text-[var(--text)] mt-0.5">
                    {item.recommended_action}
                  </div>
                  <div className="text-[12px] text-[var(--positive)] font-bold mt-1">
                    اثر مورد انتظار: {item.expected_impact}
                  </div>
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.status !== 'Completed' && (
                    <button
                      onClick={() => {
                        setActiveActionItem(item);
                        setActionModalOpen(true);
                      }}
                      className="copan-btn copan-btn-primary copan-btn-sm text-[11.5px] font-bold"
                    >
                      <Zap size={13} />
                      انجام و ثبت تصمیم
                    </button>
                  )}

                  {item.status === 'Pending' && (
                    <button
                      onClick={() => updatePriorityStatus(item.id, 'Snoozed')}
                      className="copan-btn copan-btn-secondary copan-btn-sm text-[11px]"
                      title="به تعویق انداختن ۲ روزه"
                    >
                      <Clock size={13} />
                      تعویق (۲ روز)
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onSelectCustomer(item.customer_id);
                      onNavigate('customer_360');
                    }}
                    className="copan-btn copan-btn-secondary copan-btn-sm text-[11px]"
                  >
                    <UserCheck size={13} />
                    پروفایل ۳۶۰°
                  </button>

                  <button
                    onClick={() =>
                      onOpenCobat(
                        `درباره اقدام «${item.title}» برای مشتری ${item.customer_name} توضیح بده و سناریوی پیشنهادی مذاکره را مشخص کن.`
                      )
                    }
                    className="copan-btn copan-btn-gold copan-btn-sm text-[11px]"
                  >
                    <Bot size={13} />
                    مشاوره COBAT
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Execution Modal */}
      {activeActionItem && (
        <ActionModal
          isOpen={actionModalOpen}
          onClose={() => setActionModalOpen(false)}
          title={activeActionItem.recommended_action}
          customerName={activeActionItem.customer_name}
          expectedImpact={activeActionItem.expected_impact}
          onConfirm={(note) => {
            updatePriorityStatus(activeActionItem.id, 'Completed', note);
          }}
        />
      )}
    </div>
  );
};
