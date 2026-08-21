import React, { useState } from 'react';
import {
  Bot,
  Zap,
  PhoneCall,
} from 'lucide-react';
import type { PageId } from '../components/layout/Sidebar';
import { useCopan } from '../context/CopanContext';
import { type CopanTask } from '../data/copanIntelligence';

// Subcomponents
import { BusinessSituationStrip } from '../components/dashboard/BusinessSituationStrip';
import { SalesPerformanceTrendChart } from '../components/dashboard/SalesPerformanceTrendChart';
import { NextBestActionsWidget } from '../components/dashboard/NextBestActionsWidget';
import { TaskManagementBlock } from '../components/tasks/TaskManagementBlock';
import { CustomerFollowupsCard } from '../components/dashboard/CustomerFollowupsCard';
import { RecentInteractionsTimeline } from '../components/dashboard/RecentInteractionsTimeline';
import { SupportingInsightsCard } from '../components/dashboard/SupportingInsightsCard';

// Interactive Drawers & Modals
import { TaskDetailDrawer } from '../components/tasks/TaskDetailDrawer';
import { InteractionReportingModal } from '../components/crm/InteractionReportingModal';
import {
  OperationalDetailModal,
  type OperationalViewType,
} from '../components/dashboard/OperationalDetailModal';
import { QualityChainModal } from '../components/modals/QualityChainModal';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
  onSelectCustomer: (customerId: string) => void;
  onOpenCobat: (prompt?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onSelectCustomer,
  onOpenCobat,
}) => {
  const { activeCustomer } = useCopan();

  // Drawer / Modal states
  const [selectedTask, setSelectedTask] = useState<CopanTask | null>(null);
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);

  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [interactionCustomerId, setInteractionCustomerId] = useState<string | undefined>(undefined);
  const [interactionTaskTitle, setInteractionTaskTitle] = useState<string | undefined>(undefined);

  const [drilldownViewType, setDrilldownViewType] = useState<OperationalViewType>(null);
  const [isDrilldownOpen, setIsDrilldownOpen] = useState(false);

  const [qualityModalData, setQualityModalData] = useState<{
    isOpen: boolean;
    complaintId: string;
    customerName: string;
  }>({
    isOpen: false,
    complaintId: '',
    customerName: 'داده کافی موجود نیست',
  });

  // Handlers
  const handleOpenTaskDetail = (task: CopanTask) => {
    setSelectedTask(task);
    setIsTaskDrawerOpen(true);
  };

  const handleOpenInteractionModal = (taskOrCustomerId?: CopanTask | string, defaultTitle?: string) => {
    if (typeof taskOrCustomerId === 'object' && taskOrCustomerId !== null) {
      setInteractionCustomerId(taskOrCustomerId.customer_id);
      setInteractionTaskTitle(taskOrCustomerId.title);
    } else if (typeof taskOrCustomerId === 'string') {
      setInteractionCustomerId(taskOrCustomerId);
      setInteractionTaskTitle(defaultTitle);
    } else {
      setInteractionCustomerId(activeCustomer?.customer_id || undefined);
      setInteractionTaskTitle(undefined);
    }
    setIsInteractionModalOpen(true);
  };

  const handleOpenDrilldown = (viewType: OperationalViewType) => {
    setDrilldownViewType(viewType);
    setIsDrilldownOpen(true);
  };

  const handleOpenQualityModal = (complaintId: string, customerName: string) => {
    setQualityModalData({
      isOpen: true,
      complaintId,
      customerName,
    });
  };

  const handleScrollToTasks = () => {
    const el = document.getElementById('task-management-block');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* 1. TOP EXECUTIVE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--hair)]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-[var(--gold-soft)] border border-[var(--gold)]/30 text-[var(--gold)]">
              <Zap size={20} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[20px] sm:text-[22px] font-black text-[var(--text)] tracking-tight">
                  مرکز فرماندهی فروش نفیس‌نخ (Sales Command Center)
                </h1>
                <span className="copan-badge badge-gold text-[10.5px] font-bold">
                  نسخه ۲.۰ تصمیم‌ساز
                </span>
              </div>
              <p className="text-[12.5px] text-[var(--text-dim)] mt-0.5">
                تمرکز روی درک وضعیت جاری، شناسایی نقاط در معرض خطر و هدایت اقدام بعدی فروش
              </p>
            </div>
          </div>
        </div>

        {/* Global Quick Action Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => handleOpenInteractionModal()}
            className="copan-btn copan-btn-gold text-[12.5px] font-bold flex items-center gap-1.5 shadow-sm"
          >
            <PhoneCall size={14} />
            <span>ثبت مکالمه جدید</span>
          </button>

          <button
            onClick={() => onOpenCobat('تحلیل وضعیت کلی فروش و ریسک‌های جاری حساب‌ها')}
            className="copan-btn copan-btn-secondary text-[12.5px] font-bold flex items-center gap-1.5"
          >
            <Bot size={15} className="text-[var(--gold)]" />
            <span>مشاوره هوشمند COBAT</span>
          </button>
        </div>
      </div>

      {/* 2. TOP SECTION — CURRENT BUSINESS SITUATION */}
      {/* Hierarchy: Situation */}
      <section aria-label="وضعیت جاری کسب‌وکار">
        <BusinessSituationStrip
          onOpenDrilldown={handleOpenDrilldown}
          onScrollToTasks={handleScrollToTasks}
        />
      </section>

      {/* 2.5 PERFORMANCE & SALES TREND DYNAMICS */}
      <section aria-label="روند عملکرد فروش و پویایی درآمد">
        <SalesPerformanceTrendChart />
      </section>

      {/* 3. OPERATIONAL HEART — NEXT BEST ACTIONS */}
      {/* Hierarchy: Attention & Action */}
      <section aria-label="اقدامات هوشمند اولویت‌دار">
        <NextBestActionsWidget
          onOpenTaskDetail={handleOpenTaskDetail}
          onOpenInteractionModal={(task) => handleOpenInteractionModal(task)}
          onSelectCustomer={onSelectCustomer}
          onNavigate={onNavigate}
          onViewAllTasks={handleScrollToTasks}
        />
      </section>

      {/* 4. TASK SYSTEM & FOLLOW-UPS GRID */}
      {/* Hierarchy: Action & Follow-up */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left/Main Column: Full Task Management (7 Cols) */}
        <div className="xl:col-span-7 space-y-6">
          <TaskManagementBlock
            onOpenTaskDetail={handleOpenTaskDetail}
            onOpenInteractionModal={(task) => handleOpenInteractionModal(task)}
            onSelectCustomer={onSelectCustomer}
            onNavigate={onNavigate}
          />
        </div>

        {/* Right Column: Customer Follow-ups (5 Cols) */}
        <div className="xl:col-span-5 space-y-6">
          <CustomerFollowupsCard
            onSelectCustomer={onSelectCustomer}
            onNavigate={onNavigate}
            onOpenInteractionModal={(cid, defaultAction) =>
              handleOpenInteractionModal(cid, defaultAction)
            }
          />
        </div>
      </div>

      {/* 5. CUSTOMER CONVERSATION INTELLIGENCE MODULE */}
      <section aria-label="هوش و وضعیت مکالمات مشتریان">
        <RecentInteractionsTimeline
          onSelectCustomer={onSelectCustomer}
          onNavigate={onNavigate}
          onOpenInteractionModal={(cid, defaultAction) =>
            handleOpenInteractionModal(cid, defaultAction)
          }
        />
      </section>

      {/* 6. SUPPORTING OPERATIONAL INSIGHTS (Growth & Margin Watchlist) */}
      <section aria-label="بینش‌های پشتیبان عملیاتی">
        <SupportingInsightsCard
          onSelectCustomer={onSelectCustomer}
          onNavigate={onNavigate}
          onOpenInteractionModal={(cid, defaultAction) =>
            handleOpenInteractionModal(cid, defaultAction)
          }
        />
      </section>

      {/* 6. MODALS & DRAWERS */}
      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        isOpen={isTaskDrawerOpen}
        onClose={() => setIsTaskDrawerOpen(false)}
        task={selectedTask}
        onSelectCustomer={onSelectCustomer}
        onNavigate={onNavigate}
        onOpenInteractionModal={(task) => handleOpenInteractionModal(task)}
        onOpenCobat={onOpenCobat}
      />

      {/* CRM Interaction Reporting Modal */}
      <InteractionReportingModal
        isOpen={isInteractionModalOpen}
        onClose={() => setIsInteractionModalOpen(false)}
        initialCustomerId={interactionCustomerId}
        initialTaskTitle={interactionTaskTitle}
      />

      {/* Operational Situation Drilldown Modal */}
      <OperationalDetailModal
        isOpen={isDrilldownOpen}
        onClose={() => setIsDrilldownOpen(false)}
        viewType={drilldownViewType}
        onSelectCustomer={onSelectCustomer}
        onNavigate={onNavigate}
        onOpenInteractionModal={(cid, defaultAction) =>
          handleOpenInteractionModal(cid, defaultAction)
        }
        onOpenQualityModal={handleOpenQualityModal}
      />

      {/* Quality Chain Inspection Modal */}
      <QualityChainModal
        isOpen={qualityModalData.isOpen}
        onClose={() => setQualityModalData((prev) => ({ ...prev, isOpen: false }))}
        complaintId={qualityModalData.complaintId}
        customerName={qualityModalData.customerName}
      />
    </div>
  );
};
