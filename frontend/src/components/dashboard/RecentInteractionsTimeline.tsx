import React, { useState, useMemo } from 'react';
import {
  Building2,
  Plus,
  Sparkles,
  MessageSquare,
  Clock,
  Activity,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Zap,
  PhoneCall,
  MessageCircle,
  Filter,
  Calendar,
  Layers,
  ChevronLeft,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { useCopan } from '../../context/CopanContext';
import type { PageId } from '../layout/Sidebar';
import type {
  ConversationStatus,
  SalesStage,
} from '../../data/copanIntelligence';

interface RecentInteractionsTimelineProps {
  onSelectCustomer: (customerId: string) => void;
  onNavigate: (page: PageId) => void;
  onOpenInteractionModal: (customerId?: string, defaultAction?: string) => void;
}

interface StatusConfig {
  label: string;
  badgeClass: string;
  dotColor: string;
  chartColor: string;
  icon: React.ElementType;
}

const STATUS_CONFIG: Record<ConversationStatus, StatusConfig> = {
  'Follow-up Required': {
    label: 'نیازمند پیگیری',
    badgeClass: 'bg-amber-500/10 text-amber-500 border border-amber-500/30',
    dotColor: 'bg-amber-500',
    chartColor: '#f59e0b',
    icon: Clock,
  },
  'Active': {
    label: 'فعال و در جریان',
    badgeClass: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    dotColor: 'bg-blue-500',
    chartColor: '#3b82f6',
    icon: Activity,
  },
  'Waiting for Customer': {
    label: 'در انتظار مشتری',
    badgeClass: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
    dotColor: 'bg-purple-500',
    chartColor: '#a855f7',
    icon: UserCheck,
  },
  'Opportunity': {
    label: 'فرصت فروش',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    dotColor: 'bg-emerald-500',
    chartColor: '#10b981',
    icon: TrendingUp,
  },
  'At Risk': {
    label: 'در معرض ریسک',
    badgeClass: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    dotColor: 'bg-rose-500',
    chartColor: '#f43f5e',
    icon: AlertTriangle,
  },
  'Closed': {
    label: 'نهایی‌شده',
    badgeClass: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/30',
    dotColor: 'bg-zinc-500',
    chartColor: '#71717a',
    icon: CheckCircle2,
  },
};

const SALES_STAGES: Array<{ id: SalesStage; step: number; label: string; enLabel: string }> = [
  { id: 'Lead', step: 1, label: 'سرنخ اولیه', enLabel: 'Lead' },
  { id: 'Contacted', step: 2, label: 'ارتباط', enLabel: 'Contacted' },
  { id: 'Qualified', step: 3, label: 'ارزیابی نیاز', enLabel: 'Qualified' },
  { id: 'Negotiation', step: 4, label: 'مذاکره قیمت', enLabel: 'Negotiation' },
  { id: 'Won', step: 5, label: 'عقد قرارداد', enLabel: 'Won' },
];

const STAGE_STEP_MAP: Record<SalesStage, number> = {
  Lead: 1,
  Contacted: 2,
  Qualified: 3,
  Negotiation: 4,
  Won: 5,
};

export const RecentInteractionsTimeline: React.FC<RecentInteractionsTimelineProps> = ({
  onSelectCustomer,
  onNavigate,
  onOpenInteractionModal,
}) => {
  const { interactions } = useCopan();
  const [statusFilter, setStatusFilter] = useState<ConversationStatus | 'ALL'>('ALL');

  // Distribution calculations for Donut Chart
  const statusCounts = useMemo(() => {
    const counts: Record<ConversationStatus, number> = {
      'Follow-up Required': 0,
      'Active': 0,
      'Waiting for Customer': 0,
      'Opportunity': 0,
      'At Risk': 0,
      'Closed': 0,
    };
    interactions.forEach((item) => {
      const st = item.conversation_status || 'Follow-up Required';
      if (counts[st] !== undefined) {
        counts[st]++;
      } else {
        counts['Follow-up Required']++;
      }
    });
    return counts;
  }, [interactions]);

  const totalConversations = interactions.length;

  const chartData = useMemo(() => {
    if (totalConversations === 0) return [];
    return (Object.keys(STATUS_CONFIG) as ConversationStatus[])
      .map((statusKey) => {
        const count = statusCounts[statusKey] || 0;
        const config = STATUS_CONFIG[statusKey];
        const pct = totalConversations > 0 ? Math.round((count / totalConversations) * 100) : 0;
        return {
          name: config.label,
          value: count,
          percentage: pct,
          color: config.chartColor,
          statusKey,
        };
      })
      .filter((item) => item.value > 0);
  }, [statusCounts, totalConversations]);

  // Filtered list
  const filteredInteractions = useMemo(() => {
    if (statusFilter === 'ALL') return interactions;
    return interactions.filter(
      (item) => (item.conversation_status || 'Follow-up Required') === statusFilter
    );
  }, [interactions, statusFilter]);

  // Operational metrics
  const followUpCount = statusCounts['Follow-up Required'] || 0;
  const atRiskCount = statusCounts['At Risk'] || 0;
  const opportunityCount = statusCounts['Opportunity'] || 0;

  return (
    <div className="copan-card space-y-6">
      {/* ==========================================
          HEADER SECTION
          ========================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--hair)]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--gold-soft)] text-[var(--gold)] border border-[var(--gold)]/30 flex items-center justify-center shrink-0">
              <MessageSquare size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-[16px] text-[var(--text)]">
                  هوش و وضعیت مکالمات مشتریان (Customer Conversation Intelligence)
                </h3>
                <span className="copan-badge badge-neutral text-[10.5px] font-mono font-bold">
                  {totalConversations} مکالمه ثبت‌شده
                </span>
              </div>
              <p className="text-[11.5px] text-[var(--text-faint)] mt-0.5">
                پایش لحظه‌ای مذاکرات، موقعیت در مسیر فروش (Sales Stage)، چرخه وضعیت و تفکیک اقدامات بعدی
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => onOpenInteractionModal()}
            className="copan-btn copan-btn-gold copan-btn-sm text-[12px] font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus size={14} />
            <span>ثبت مکالمه جدید</span>
          </button>
        </div>
      </div>

      {/* ==========================================
          TWO-PART MAIN LAYOUT:
          - Main Area (8 cols): Interactive Conversation Cards Stack
          - Secondary Area (4 cols): Compact Donut Overview & Insight
          ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ----------------------------------------------------
            LEFT / MAIN AREA (8 COLS): CONVERSATION CARDS STACK
            ---------------------------------------------------- */}
        <div className="lg:col-span-8 space-y-4">
          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11.5px]">
            <span className="text-[var(--text-faint)] shrink-0 font-medium flex items-center gap-1 ml-1">
              <Filter size={13} />
              فیلتر وضعیت:
            </span>
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-[var(--gold)] text-[#0e1c12] shadow-xs'
                  : 'bg-[var(--panel-2)] text-[var(--text-dim)] hover:text-[var(--text)] border border-[var(--hair)]'
              }`}
            >
              همه ({totalConversations})
            </button>
            {(Object.keys(STATUS_CONFIG) as ConversationStatus[]).map((stKey) => {
              const count = statusCounts[stKey] || 0;
              if (count === 0 && statusFilter !== stKey) return null;
              const isSelected = statusFilter === stKey;
              const cfg = STATUS_CONFIG[stKey];
              return (
                <button
                  key={stKey}
                  onClick={() => setStatusFilter(stKey)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--panel-2)] border-2 border-[var(--gold)] text-[var(--gold)] shadow-xs'
                      : 'bg-[var(--panel-2)] text-[var(--text-dim)] hover:text-[var(--text)] border border-[var(--hair)]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor}`} />
                  <span>{cfg.label}</span>
                  <span className="font-mono text-[10.5px] opacity-80">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Cards List */}
          <div className="space-y-3.5">
            {filteredInteractions.map((intItem) => {
              const currentStatus = intItem.conversation_status || 'Follow-up Required';
              const statusCfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG['Follow-up Required'];
              const StatusIcon = statusCfg.icon;

              const currentStage = intItem.sales_stage || 'Negotiation';
              const currentStageStep = STAGE_STEP_MAP[currentStage] || 3;
              const stageInfo = SALES_STAGES.find((s) => s.id === currentStage);

              return (
                <div
                  key={intItem.id}
                  className="rounded-2xl bg-[var(--panel-2)] border border-[var(--hair)] p-4 sm:p-5 space-y-3.5 hover:border-[var(--hair-strong)] hover:shadow-md transition-all group"
                >
                  {/* 1. Top Header Row: Customer, Status Badge, Interaction Type */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[var(--hair)]/70">
                    {/* Customer Info */}
                    <div
                      onClick={() => {
                        onSelectCustomer(intItem.customer_id);
                        onNavigate('customer_360');
                      }}
                      className="flex items-center gap-2.5 cursor-pointer group/cust min-w-0"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[var(--panel)] border border-[var(--hair-strong)] flex items-center justify-center text-[var(--gold)] shrink-0 group-hover/cust:border-[var(--gold)] transition-colors">
                        <Building2 size={17} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[14.5px] text-[var(--text)] group-hover/cust:text-[var(--gold)] transition-colors truncate">
                            {intItem.customer_name}
                          </span>
                          <ArrowUpRight size={13} className="opacity-0 group-hover/cust:opacity-100 transition-opacity text-[var(--gold)] shrink-0" />
                        </div>
                        <div className="text-[11px] font-mono text-[var(--text-faint)] flex items-center gap-2 mt-0.5">
                          <span>{intItem.customer_id}</span>
                          <span>•</span>
                          <span>کارشناس: <b className="text-[var(--text-dim)]">{intItem.sales_rep_name}</b></span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge + Interaction Type + Time */}
                    <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${statusCfg.badgeClass}`}
                      >
                        <StatusIcon size={13} />
                        {statusCfg.label}
                      </span>

                      <span className="copan-badge badge-brand text-[10.5px] font-bold">
                        {intItem.interaction_type}
                      </span>

                      <span className="text-[11px] font-mono text-[var(--text-faint)] bg-[var(--panel)] px-2 py-0.5 rounded-md border border-[var(--hair)]">
                        {intItem.event_time}
                      </span>
                    </div>
                  </div>

                  {/* 2. Sales Journey Progress Bar */}
                  <div className="bg-[var(--panel)] border border-[var(--hair)] rounded-xl p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2 shrink-0">
                      <Layers size={13} className="text-[var(--gold)]" />
                      <span className="font-bold text-[var(--text-faint)]">مسیر فروش:</span>
                      <span className="font-extrabold text-[var(--text)]">
                        {stageInfo?.label} <span className="font-mono text-[10px] text-[var(--text-faint)]">({stageInfo?.enLabel})</span>
                      </span>
                    </div>

                    {/* 5-Step Progress Stepper */}
                    <div className="flex items-center gap-1.5 flex-1 max-w-xs sm:mx-3">
                      {SALES_STAGES.map((st) => {
                        const isReached = currentStageStep >= st.step;
                        const isCurrent = currentStageStep === st.step;
                        return (
                          <div
                            key={st.id}
                            className="flex-1 group/step relative"
                            title={`${st.label} (${st.enLabel})`}
                          >
                            <div
                              className={`h-2 rounded-full transition-all ${
                                isCurrent
                                  ? 'bg-[var(--gold)] shadow-[0_0_8px_rgba(230,168,23,0.6)]'
                                  : isReached
                                  ? 'bg-[var(--gold)]/60'
                                  : 'bg-[var(--panel-2)] border border-[var(--hair-strong)]'
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>

                    <span className="text-[10.5px] font-mono text-[var(--text-dim)] shrink-0 self-end sm:self-auto font-bold">
                      گام {currentStageStep} از ۵
                    </span>
                  </div>

                  {/* 3. Conversation Context & Feedback */}
                  <div className="space-y-2">
                    <p className="text-[12.5px] text-[var(--text)] leading-relaxed font-medium">
                      {intItem.summary_text}
                    </p>

                    {/* Customer Voice / Feedback Callout */}
                    {intItem.customer_feedback && (
                      <div className="p-2.5 rounded-xl bg-[var(--panel)]/80 border border-[var(--hair)] text-[11.5px] text-[var(--text-dim)] flex items-start gap-2.5">
                        <MessageCircle size={15} className="text-[var(--gold)] shrink-0 mt-0.5" />
                        <div>
                          <b className="text-[var(--text)]">بازخورد و موضع مشتری: </b>
                          <span>{intItem.customer_feedback}</span>
                        </div>
                      </div>
                    )}

                    {/* Metadata tags */}
                    <div className="flex items-center gap-2 text-[11px] text-[var(--text-faint)] flex-wrap pt-0.5">
                      {intItem.related_product && (
                        <span className="px-2 py-0.5 rounded-md bg-[var(--panel)] border border-[var(--hair)]">
                          محصول: <b className="text-[var(--text-dim)]">{intItem.related_product}</b>
                        </span>
                      )}
                      {intItem.key_outcome && (
                        <span className="px-2 py-0.5 rounded-md bg-[var(--panel)] border border-[var(--hair)]">
                          دستاورد: <b className="text-[var(--text-dim)]">{intItem.key_outcome}</b>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 4. Actionable Next Best Action Footer */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-l from-[var(--gold-soft)]/60 via-[var(--panel)] to-[var(--panel)] border border-[var(--gold)]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[var(--gold)] text-[#0e1c12] flex items-center justify-center shrink-0 shadow-xs">
                        <Zap size={14} className="fill-[#0e1c12]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-[var(--gold)] flex items-center gap-1">
                          <Sparkles size={11} />
                          <span>اقدام بعدی هوشمند (Next Action)</span>
                        </div>
                        <div className="text-[12px] font-extrabold text-[var(--text)] truncate">
                          {intItem.next_action}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      {intItem.follow_up_date && (
                        <span className="text-[11px] font-mono text-[var(--text-faint)] bg-[var(--panel-2)] px-2.5 py-1 rounded-lg border border-[var(--hair)]">
                          موعد: <b className="text-[var(--text)]">{intItem.follow_up_date}</b>
                        </span>
                      )}
                      <button
                        onClick={() => onOpenInteractionModal(intItem.customer_id, intItem.next_action)}
                        className="copan-btn copan-btn-gold copan-btn-sm text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        title="ثبت پیگیری این مکالمه"
                      >
                        <PhoneCall size={12} />
                        <span>ثبت پیگیری</span>
                      </button>
                      <button
                        onClick={() => {
                          onSelectCustomer(intItem.customer_id);
                          onNavigate('customer_360');
                        }}
                        className="copan-btn copan-btn-secondary copan-btn-sm text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        title="مشاهده پروفایل ۳۶۰"
                      >
                        <span>پروفایل ۳۶۰°</span>
                        <ChevronLeft size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredInteractions.length === 0 && (
              <div className="p-8 text-center bg-[var(--panel-2)] border border-[var(--hair)] rounded-2xl text-[var(--text-faint)] space-y-2">
                <MessageSquare size={32} className="mx-auto text-[var(--text-faint)]/50" />
                <div className="font-bold text-[13px] text-[var(--text-dim)]">
                  هیچ مکالمه‌ای با فیلتر انتخاب‌شده یافت نشد.
                </div>
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className="text-[12px] text-[var(--gold)] font-bold hover:underline cursor-pointer"
                >
                  نمایش همه مکالمات
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ----------------------------------------------------
            RIGHT / SECONDARY AREA (4 COLS): DONUT OVERVIEW
            ---------------------------------------------------- */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-[var(--panel-2)] border border-[var(--hair)] p-4 space-y-4">
            {/* Box Title */}
            <div className="pb-3 border-b border-[var(--hair)]">
              <h4 className="font-extrabold text-[13.5px] text-[var(--text)] flex items-center gap-2">
                <Activity size={15} className="text-[var(--gold)]" />
                <span>دیده‌بان وضعیت مکالمات (Status Overview)</span>
              </h4>
              <p className="text-[11px] text-[var(--text-faint)] mt-0.5">
                توزیع آماری وضعیت تعاملات اخیر و اولویت‌بندی پیگیری‌ها
              </p>
            </div>

            {/* Donut Chart with Centered Metric */}
            <div className="relative h-[190px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={74}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="var(--panel-2)"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[var(--panel)] border border-[var(--hair-strong)] px-3 py-2 rounded-xl shadow-xl text-right text-[11.5px] space-y-0.5">
                            <div className="font-bold text-[var(--text)] flex items-center gap-1.5">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: data.color }}
                              />
                              <span>{data.name}</span>
                            </div>
                            <div className="text-[var(--text-dim)] font-mono">
                              تعداد: <b>{data.value}</b> ({data.percentage}٪)
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Centered Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[24px] font-black text-[var(--text)] font-mono leading-none">
                  {totalConversations}
                </span>
                <span className="text-[10px] font-bold text-[var(--text-faint)] mt-1">
                  کل مکالمات
                </span>
              </div>
            </div>

            {/* Status Breakdown Legend Table */}
            <div className="space-y-2 pt-1 border-t border-[var(--hair)] text-[11.5px]">
              {(Object.keys(STATUS_CONFIG) as ConversationStatus[]).map((stKey) => {
                const count = statusCounts[stKey] || 0;
                const cfg = STATUS_CONFIG[stKey];
                const pct = totalConversations > 0 ? Math.round((count / totalConversations) * 100) : 0;
                return (
                  <div
                    key={stKey}
                    onClick={() => setStatusFilter(statusFilter === stKey ? 'ALL' : stKey)}
                    className={`p-2 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                      statusFilter === stKey
                        ? 'bg-[var(--panel)] border border-[var(--gold)]/40 font-bold'
                        : 'hover:bg-[var(--panel)] text-[var(--text-dim)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${cfg.dotColor}`} />
                      <span className="text-[var(--text)] font-bold">{cfg.label}</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[var(--text)] font-bold">{count} مورد</span>
                      <span className="text-[10.5px] text-[var(--text-faint)] w-9 text-left">
                        ({pct}٪)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Operational Actionable Callout Box */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-[var(--gold-soft)]/50 to-[var(--panel)] border border-[var(--gold)]/25 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[11.5px] text-[var(--gold)]">
                <AlertTriangle size={14} />
                <span>وضعیت اقدام تیم فروش</span>
              </div>
              <p className="text-[11.5px] text-[var(--text-dim)] leading-relaxed">
                از مجموع <b>{totalConversations}</b> مکالمه اخیر،{' '}
                <b className="text-[var(--gold)]">{followUpCount} مکالمه نیازمند پیگیری فوری</b>،{' '}
                <b className="text-[var(--risk)]">{atRiskCount} مورد در معرض ریسک کیفیت/اعتبار</b> و{' '}
                <b className="text-[var(--positive)]">{opportunityCount} فرصت افزایش سهم بازار</b> در جریان است.
              </p>
            </div>

            {/* Sales Stages Funnel Mini-Summary */}
            <div className="p-3 rounded-xl bg-[var(--panel)] border border-[var(--hair)] space-y-2 text-[11px]">
              <div className="flex items-center justify-between text-[var(--text-faint)] font-bold">
                <span>توزیع در قیف فروش (Funnel)</span>
                <Calendar size={12} />
              </div>
              <div className="space-y-1.5">
                {SALES_STAGES.map((st) => {
                  const stageCount = interactions.filter(
                    (i) => (i.sales_stage || 'Negotiation') === st.id
                  ).length;
                  const pct = totalConversations > 0 ? (stageCount / totalConversations) * 100 : 0;
                  return (
                    <div key={st.id} className="space-y-0.5">
                      <div className="flex items-center justify-between text-[10.5px]">
                        <span className="text-[var(--text-dim)] font-medium">{st.label} ({st.enLabel})</span>
                        <span className="font-mono text-[var(--text)] font-bold">{stageCount}</span>
                      </div>
                      <div className="h-1 bg-[var(--panel-2)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--gold)] rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
