import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Plus,
  Clock,
  PhoneCall,
  CheckCircle2,
  Circle,
  X,
} from 'lucide-react';
import { useCopan } from '../../context/CopanContext';
import { type CopanTask, type TaskPriority, type TaskState } from '../../data/copanIntelligence';
import type { PageId } from '../layout/Sidebar';

interface TaskManagementBlockProps {
  onOpenTaskDetail: (task: CopanTask) => void;
  onOpenInteractionModal: (task: CopanTask) => void;
  onSelectCustomer: (customerId: string) => void;
  onNavigate: (page: PageId) => void;
}

export const TaskManagementBlock: React.FC<TaskManagementBlockProps> = ({
  onOpenTaskDetail,
  onOpenInteractionModal,
  onSelectCustomer,
  onNavigate,
}) => {
  const { tasks, customers, updateTaskStatus, addTask } = useCopan();

  const [statusTab, setStatusTab] = useState<TaskState | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const newCustomerId = customers[0]?.customer_id ?? '';
  const [newCustomerName, setNewCustomerName] = useState('داده کافی موجود نیست');
  const [newReason, setNewReason] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('High');
  const [newDueDate, setNewDueDate] = useState('');

  const filteredTasks = tasks.filter((t) => {
    if (statusTab !== 'ALL' && t.status !== statusTab) return false;
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        t.title.toLowerCase().includes(q) ||
        t.customer_name.toLowerCase().includes(q) ||
        t.customer_id.toLowerCase().includes(q) ||
        t.reason.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const countsByStatus = {
    ALL: tasks.length,
    'To Do': tasks.filter((t) => t.status === 'To Do').length,
    'In Progress': tasks.filter((t) => t.status === 'In Progress').length,
    Completed: tasks.filter((t) => t.status === 'Completed').length,
    Snoozed: tasks.filter((t) => t.status === 'Snoozed').length,
    Overdue: tasks.filter((t) => t.status === 'Overdue').length,
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      customer_id: newCustomerId,
      customer_name: newCustomerName,
      location_name: '',
      sales_rep_name: 'کارشناس فروش',
      task_type: 'FOLLOW_UP',
      task_type_label: 'اقدام دستی',
      title: newTitle.trim(),
      reason: newReason.trim() || 'ثبت دستی توسط کارشناس فروش جهت پیگیری تجاری',
      because_signal: 'وظیفه ثبت‌شده توسط کاربر',
      should_action: newTitle.trim(),
      priority: newPriority,
      priority_label:
        newPriority === 'Critical'
          ? 'بحرانی (P0)'
          : newPriority === 'High'
          ? 'بالا (P1)'
          : newPriority === 'Medium'
          ? 'متوسط (P2)'
          : 'عادی (P3)',
      due_date: newDueDate,
      status: 'To Do',
      context_type: 'CRM',
      suggested_next_step: newTitle.trim(),
    });

    setIsCreatingTask(false);
    setNewTitle('');
    setNewReason('');
  };

  return (
    <div id="task-management-block" className="copan-card space-y-4">
      {/* Header & Main Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[var(--hair)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[var(--brand-pale)] text-[var(--brand-light)]">
              <CheckSquare size={16} />
            </div>
            <h3 className="font-extrabold text-[15.5px] text-[var(--text)]">
              کارتابل جامع مدیریت اقدامات و وظایف (Task Management)
            </h3>
            <span className="copan-badge badge-neutral text-[11px] font-mono font-bold">
              {filteredTasks.length} وظیفه
            </span>
          </div>
          <p className="text-[11.5px] text-[var(--text-faint)] mt-0.5">
            سیستم دووجهی کارتابل وظایف • فیلتر، تغییر وضعیت آنی، ثبت پیگیری و بازگشایی جزئیات
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Box */}
          <div className="relative">
            <Search
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]"
            />
            <input
              type="text"
              placeholder="جستجو در وظایف و مشتریان..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-8 pl-3 py-1.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] text-[11.5px] text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--gold)] w-[200px]"
            />
          </div>

          {/* Create Task Button */}
          <button
            onClick={() => setIsCreatingTask(!isCreatingTask)}
            className="copan-btn copan-btn-gold copan-btn-sm text-[11.5px] font-bold flex items-center gap-1"
          >
            <Plus size={13} />
            <span>ثبت وظیفه جدید</span>
          </button>
        </div>
      </div>

      {/* Quick Task Creation Drawer/Box */}
      {isCreatingTask && (
        <form
          onSubmit={handleCreateTask}
          className="p-4 rounded-xl bg-[var(--panel-2)] border-2 border-[var(--gold)]/40 space-y-3 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[var(--gold)]">
              افزودن سریع وظیفه جدید به کارتابل
            </span>
            <button
              type="button"
              onClick={() => setIsCreatingTask(false)}
              className="p-1 rounded-md text-[var(--text-faint)] hover:text-[var(--text)]"
            >
              <X size={15} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[12px]">
            <div>
              <label className="text-[11px] text-[var(--text-faint)] block mb-1">عنوان وظیفه:</label>
              <input
                type="text"
                required
                placeholder="مثال: پیگیری تسویه فاکتور یا ارسال کاتالوگ..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)] text-[var(--text)] focus:outline-none focus:border-[var(--gold)]"
              />
            </div>

            <div>
              <label className="text-[11px] text-[var(--text-faint)] block mb-1">مشتری:</label>
              <input
                type="text"
                required
                placeholder="نام شرکت مشتری..."
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)] text-[var(--text)] focus:outline-none focus:border-[var(--gold)]"
              />
            </div>

            <div>
              <label className="text-[11px] text-[var(--text-faint)] block mb-1">سررسید:</label>
              <input
                type="text"
                placeholder="مثال: فردا یا ۱۴۰۴/۱۲/۲۵"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)] text-[var(--text)] focus:outline-none focus:border-[var(--gold)]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-[var(--text-faint)]">اولویت:</span>
              {(['Critical', 'High', 'Medium', 'Low'] as TaskPriority[]).map((pr) => (
                <button
                  key={pr}
                  type="button"
                  onClick={() => setNewPriority(pr)}
                  className={`px-2 py-0.5 rounded-md font-bold text-[10.5px] ${
                    newPriority === pr
                      ? 'bg-[var(--gold)] text-[#0e1c12]'
                      : 'bg-[var(--panel)] text-[var(--text-dim)] border border-[var(--hair)]'
                  }`}
                >
                  {pr === 'Critical' ? 'بحرانی' : pr === 'High' ? 'بالا' : pr === 'Medium' ? 'متوسط' : 'عادی'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreatingTask(false)}
                className="copan-btn copan-btn-secondary copan-btn-sm text-[11px]"
              >
                انصراف
              </button>
              <button type="submit" className="copan-btn copan-btn-gold copan-btn-sm text-[11.5px] font-bold">
                افزودن وظیفه
              </button>
            </div>
          </div>
        </form>
      )}

      {/* State Tabs Filter Strip */}
      <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
        <div className="flex items-center bg-[var(--panel-2)] p-0.5 rounded-xl border border-[var(--hair)] text-[11.5px] overflow-x-auto">
          {(
            [
              { key: 'ALL', label: 'همه وظایف' },
              { key: 'To Do', label: 'در انتظار انجام' },
              { key: 'In Progress', label: 'در جریان' },
              { key: 'Completed', label: 'تکمیل‌شده' },
              { key: 'Snoozed', label: 'به‌تعویق‌افتاده' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusTab(tab.key)}
              className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                statusTab === tab.key
                  ? 'bg-[var(--text)] text-[var(--bg)] shadow-xs'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  statusTab === tab.key
                    ? 'bg-[var(--bg)] text-[var(--text)]'
                    : 'bg-[var(--panel)] text-[var(--text-faint)]'
                }`}
              >
                {countsByStatus[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Priority Filter Pills */}
        <div className="flex items-center gap-1 bg-[var(--panel-2)] p-0.5 rounded-xl border border-[var(--hair)] text-[11px]">
          {(['ALL', 'Critical', 'High', 'Medium'] as const).map((pr) => (
            <button
              key={pr}
              onClick={() => setPriorityFilter(pr)}
              className={`px-2.5 py-0.5 rounded-lg font-bold transition-all ${
                priorityFilter === pr
                  ? pr === 'Critical'
                    ? 'bg-[var(--risk)] text-white'
                    : pr === 'High'
                    ? 'bg-[var(--gold)] text-[#0e1c12]'
                    : 'bg-[var(--text)] text-[var(--bg)]'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              {pr === 'ALL' ? 'همه اولویت‌ها' : pr === 'Critical' ? 'P0 بحرانی' : pr === 'High' ? 'P1 بالا' : 'P2 متوسط'}
            </button>
          ))}
        </div>
      </div>

      {/* Task List Table */}
      {filteredTasks.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-[var(--hair)]">
          <table className="copan-table">
            <thead>
              <tr>
                <th className="w-10 text-center">وضعیت</th>
                <th>عنوان وظیفه / اقدام</th>
                <th>مشتری طرف حساب</th>
                <th>اولویت</th>
                <th>منطق اقدام (Reason)</th>
                <th>مهلت سررسید</th>
                <th className="text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => {
                const isDone = t.status === 'Completed';
                const isCritical = t.priority === 'Critical';

                return (
                  <tr
                    key={t.id}
                    className={`transition-colors ${isDone ? 'opacity-60 bg-[var(--panel-2)]/40' : ''}`}
                  >
                    {/* Inline Status Checkbox */}
                    <td className="text-center">
                      <button
                        onClick={() => updateTaskStatus(t.id, isDone ? 'To Do' : 'Completed')}
                        className="p-1 rounded-md text-[var(--text-dim)] hover:text-[var(--positive)] transition-colors cursor-pointer"
                        title={isDone ? 'علامت‌گذاری به عنوان در انتظار انجام' : 'علامت‌گذاری به عنوان انجام‌شده'}
                      >
                        {isDone ? (
                          <CheckCircle2 size={18} className="text-[var(--positive)]" />
                        ) : (
                          <Circle size={18} className="text-[var(--text-faint)] hover:text-[var(--gold)]" />
                        )}
                      </button>
                    </td>

                    {/* Title */}
                    <td>
                      <div
                        onClick={() => onOpenTaskDetail(t)}
                        className={`font-extrabold text-[13px] text-[var(--text)] hover:text-[var(--gold)] cursor-pointer ${
                          isDone ? 'line-through text-[var(--text-faint)]' : ''
                        }`}
                      >
                        {t.title}
                      </div>
                      <div className="text-[10.5px] text-[var(--text-faint)] flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono">{t.id}</span>
                        <span>• {t.task_type_label}</span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td>
                      <div
                        onClick={() => {
                          onSelectCustomer(t.customer_id);
                          onNavigate('customer_360');
                        }}
                        className="font-bold text-[var(--text)] hover:text-[var(--gold)] cursor-pointer text-[12.5px]"
                      >
                        {t.customer_name}
                      </div>
                      <div className="text-[10.5px] text-[var(--text-faint)] font-mono">
                        {t.customer_id}
                      </div>
                    </td>

                    {/* Priority Badge */}
                    <td>
                      <span
                        className={`copan-badge ${
                          isCritical
                            ? 'badge-risk'
                            : t.priority === 'High'
                            ? 'badge-gold'
                            : t.priority === 'Medium'
                            ? 'badge-brand'
                            : 'badge-neutral'
                        } text-[10.5px] font-bold`}
                      >
                        {t.priority_label}
                      </span>
                    </td>

                    {/* Reason Snippet */}
                    <td className="max-w-[240px]">
                      <div className="text-[11.5px] text-[var(--text-dim)] truncate" title={t.reason}>
                        {t.because_signal || t.reason}
                      </div>
                    </td>

                    {/* Due Date */}
                    <td>
                      <span className="text-[11.5px] font-mono font-bold text-[var(--text)] flex items-center gap-1">
                        <Clock size={12} className={isCritical ? 'text-[var(--risk)]' : 'text-[var(--text-faint)]'} />
                        {t.due_date}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenInteractionModal(t)}
                          className="copan-btn copan-btn-gold copan-btn-sm text-[11px]"
                          title="ثبت مکالمه"
                        >
                          <PhoneCall size={12} />
                        </button>
                        <button
                          onClick={() => onOpenTaskDetail(t)}
                          className="copan-btn copan-btn-secondary copan-btn-sm text-[11px] font-bold"
                        >
                          جزئیات
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="p-8 text-center rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-2">
          <CheckCircle2 size={30} className="text-[var(--positive)] mx-auto" />
          <h4 className="font-extrabold text-[13.5px] text-[var(--text)]">
            هیچ وظیفه‌ای در این دسته‌بندی یافت نشد
          </h4>
          <p className="text-[11.5px] text-[var(--text-faint)]">
            می‌توانید با دکمه «ثبت وظیفه جدید» وظایف اختصاصی خود را اضافه نمایید.
          </p>
        </div>
      )}
    </div>
  );
};
