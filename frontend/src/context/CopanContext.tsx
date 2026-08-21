import React, { createContext, useContext, useState , useEffect } from 'react';
import {
  type CopanCustomer,
  type CopanTask,
  type TaskState,
  type TaskPriority,
  type CopanCRMInteraction,
  type CobatMessage,
  type CopanActionPriority,
} from '../data/copanIntelligence';
import { fetchCustomers } from '../api';

const UNAVAILABLE = 'داده کافی موجود نیست';
const EMPTY_CUSTOMER: CopanCustomer = {
  customer_id: '', customer_name: UNAVAILABLE, location_id: '', location_name: UNAVAILABLE,
  customer_segment: UNAVAILABLE, sales_rep_id: '', sales_rep_name: UNAVAILABLE,
  lifetime_revenue: Number.NaN, revenue_trend_pct: Number.NaN,
  avg_gross_margin_pct: Number.NaN, avg_nafis_share_pct: Number.NaN,
  main_competitor: UNAVAILABLE, total_complaints: 0, high_severity_complaints: 0,
  bounced_checks_count: 0, avg_delay_days: Number.NaN, risk_score: Number.NaN,
  opportunity_score: Number.NaN, health_status: UNAVAILABLE, rfm_score: UNAVAILABLE,
  rfm_segment: UNAVAILABLE, last_purchase_date: UNAVAILABLE, last_interaction_date: UNAVAILABLE,
  payment_status: UNAVAILABLE, installment_share_pct: Number.NaN, latest_next_action: UNAVAILABLE,
};

export interface LogInteractionInput {
  customer_id: string;
  customer_name: string;
  sales_rep_name?: string;
  interaction_type: CopanCRMInteraction['interaction_type'];
  event_time?: string;
  summary_text: string;
  customer_feedback?: string;
  key_outcome?: string;
  related_product?: string;
  next_action: string;
  follow_up_date?: string;
  priority?: TaskPriority;
  record_status?: 'قطعی' | 'در جریان' | 'مختومه';
  conversation_status?: CopanCRMInteraction['conversation_status'];
  sales_stage?: CopanCRMInteraction['sales_stage'];
}

interface CopanContextType {
  // Customers
  customers: CopanCustomer[];
  selectedCustomerId: string;
  setSelectedCustomerId: (id: string) => void;
  activeCustomer: CopanCustomer;
  updateCustomerNextStep: (customerId: string, nextAction: string, reason: string, dueDate: string, priority?: TaskPriority) => void;

  // Unified Task System with LocalStorage Persistence
  tasks: CopanTask[];
  addTask: (task: Omit<CopanTask, 'id' | 'created_at'>) => string;
  updateTaskStatus: (id: string, status: TaskState, note?: string) => void;
  updateTaskPriority: (id: string, priority: TaskPriority) => void;
  updateTaskDueDate: (id: string, dueDate: string) => void;
  addTaskNote: (id: string, note: string, author?: string) => void;
  snoozeTask: (id: string, days: number) => void;
  deleteTask: (id: string) => void;

  // CRM Interactions with Continuous Follow-up Loop
  interactions: CopanCRMInteraction[];
  logInteraction: (data: LogInteractionInput, autoCreateTask?: boolean) => { interactionId: string; taskId?: string };

  // Backwards compatibility for PrioritiesPage
  priorities: CopanActionPriority[];
  updatePriorityStatus: (id: string, status: any, note?: string) => void;

  // Global COBAT Conversational Memory
  cobatMessages: CobatMessage[];
  sendCobatMessage: (query: string, contextPage?: string) => void;
  clearCobatMemory: () => void;
  isCobatTyping: boolean;

  // Dynamic Installment Rate (Default 4.0%)
  installmentProfitRatePct: number;
  setInstallmentProfitRatePct: (rate: number) => void;

  // Theme
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

const CopanContext = createContext<CopanContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_TASKS = 'copan_tasks_v3';
const LOCAL_STORAGE_KEY_INTERACTIONS = 'copan_interactions_v3';
const LOCAL_STORAGE_KEY_THEME = 'copan_theme_v1';
const LOCAL_STORAGE_KEY_RATE = 'copan_installment_rate_v1';
const LOCAL_STORAGE_KEY_COBAT = 'copan_cobat_msgs_v2';
const LOCAL_STORAGE_KEY_SELECTED_CUSTOMER = 'copan_selected_customer_v1';

export const CopanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCustomerId, setSelectedCustomerIdState] = useState<string>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEY_SELECTED_CUSTOMER) || '';
    } catch {
      return '';
    }
  });

  const setSelectedCustomerId = (id: string) => {
    setSelectedCustomerIdState(id);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SELECTED_CUSTOMER, id);
    } catch {
      // Customer selection still works when browser storage is unavailable.
    }
  };
  const [isDarkMode, setIsDarkModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_THEME);
    return saved ? saved === 'dark' : false;
  });

  const setIsDarkMode = (dark: boolean) => {
    setIsDarkModeState(dark);
    localStorage.setItem(LOCAL_STORAGE_KEY_THEME, dark ? 'dark' : 'light');
  };

  const [isCobatTyping, setIsCobatTyping] = useState<boolean>(false);

  // Installment Profit Rate (Default: 4.0%)
  const [installmentProfitRatePct, setInstallmentProfitRatePctState] = useState<number>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_RATE);
    return saved ? parseFloat(saved) : 4.0;
  });

  const setInstallmentProfitRatePct = (rate: number) => {
    setInstallmentProfitRatePctState(rate);
    localStorage.setItem(LOCAL_STORAGE_KEY_RATE, rate.toString());
  };

  // Customers with live dynamic state
  const [customers, setCustomers] = useState<CopanCustomer[]>([]);

  useEffect(() => {
  const loadCustomers = async () => {
    try {
      const data = await fetchCustomers();
      const apiCustomers: CopanCustomer[] = data.map((item) => ({
        ...EMPTY_CUSTOMER,
        customer_id: item.customer_id,
        customer_name: UNAVAILABLE,
        lifetime_revenue: item.historical_total_revenue ?? Number.NaN,
        total_complaints: item.complaint_count,
        bounced_checks_count: item.returned_check_count,
        avg_delay_days: item.median_payment_delay_days ?? Number.NaN,
        avg_gross_margin_pct: item.known_margin_pct ?? Number.NaN,
        avg_nafis_share_pct: item.historical_wallet_share_pct ?? Number.NaN,
      }));

      if (Array.isArray(apiCustomers) && apiCustomers.length > 0) {
        setCustomers(apiCustomers);
        if (!selectedCustomerId || !apiCustomers.some((item) => item.customer_id === selectedCustomerId)) {
          setSelectedCustomerId(apiCustomers[0].customer_id);
        }
      }

    } catch (error) {
      console.warn(
        'Backend customer data unavailable',
        error
      );
    }
  };

  loadCustomers();
}, []);

  const updateCustomerNextStep = (
    customerId: string,
    nextAction: string,
    reason: string,
    dueDate: string,
    priority: TaskPriority = 'High'
  ) => {
    setCustomers((prev) => {
      const updated = prev.map((c) => {
        if (c.customer_id === customerId) {
          return {
            ...c,
            next_step_action: nextAction,
            next_step_reason: reason,
            next_step_due: dueDate,
            next_step_priority: priority,
            latest_next_action: nextAction,
          };
        }
        return c;
      });
      return updated;
    });
  };

  // Tasks with Persistence
  const [tasks, setTasks] = useState<CopanTask[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TASKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveTasks = (newTasks: CopanTask[]) => {
    setTasks(newTasks);
    localStorage.setItem(LOCAL_STORAGE_KEY_TASKS, JSON.stringify(newTasks));
  };

  const addTask = (newTaskData: Omit<CopanTask, 'id' | 'created_at'>): string => {
    const newId = `TSK-${String(Date.now()).slice(-5)}`;
    const createdDate = new Date().toLocaleDateString('fa-IR');
    const fullTask: CopanTask = {
      ...newTaskData,
      id: newId,
      created_at: createdDate,
      notes: newTaskData.notes || [],
    };
    const updated = [fullTask, ...tasks];
    saveTasks(updated);
    return newId;
  };

  const updateTaskStatus = (id: string, status: TaskState, note?: string) => {
    const now = new Date().toLocaleDateString('fa-IR');
    const updated = tasks.map((item) => {
      if (item.id === id) {
        const existingNotes = item.notes || [];
        const newNotes = note
          ? [...existingNotes, { text: note, created_at: now, author: 'کاربر سیستم' }]
          : existingNotes;
        return {
          ...item,
          status,
          completed_at: status === 'Completed' ? now : undefined,
          notes: newNotes,
        };
      }
      return item;
    });
    saveTasks(updated);
  };

  const updateTaskPriority = (id: string, priority: TaskPriority) => {
    const labelMap: Record<TaskPriority, string> = {
      Critical: 'بحرانی (P0)',
      High: 'بالا (P1)',
      Medium: 'متوسط (P2)',
      Low: 'عادی (P3)',
    };
    const updated = tasks.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          priority,
          priority_label: labelMap[priority],
        };
      }
      return item;
    });
    saveTasks(updated);
  };

  const updateTaskDueDate = (id: string, dueDate: string) => {
    const updated = tasks.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          due_date: dueDate,
        };
      }
      return item;
    });
    saveTasks(updated);
  };

  const addTaskNote = (id: string, noteText: string, author: string = 'کارشناس فروش') => {
    const now = new Date().toLocaleDateString('fa-IR');
    const updated = tasks.map((item) => {
      if (item.id === id) {
        const existingNotes = item.notes || [];
        return {
          ...item,
          notes: [...existingNotes, { text: noteText, created_at: now, author }],
        };
      }
      return item;
    });
    saveTasks(updated);
  };

  const snoozeTask = (id: string, days: number = 3) => {
    const updated = tasks.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: 'Snoozed' as TaskState,
          due_date: `${days} روز دیگر`,
        };
      }
      return item;
    });
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
  };

  // CRM Interactions with Persistence
  const [interactions, setInteractions] = useState<CopanCRMInteraction[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_INTERACTIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveInteractions = (newInteractions: CopanCRMInteraction[]) => {
    setInteractions(newInteractions);
    localStorage.setItem(LOCAL_STORAGE_KEY_INTERACTIONS, JSON.stringify(newInteractions));
  };

  // THE CORE CONTINUOUS LOOP:
  // Interaction -> Insight -> Next Action -> Auto Task -> Follow-up
  const logInteraction = (
    data: LogInteractionInput,
    autoCreateTask: boolean = true
  ): { interactionId: string; taskId?: string } => {
    const interactionId = `INT-${String(Date.now()).slice(-4)}`;
    const nowStr = new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

    const newInteraction: CopanCRMInteraction = {
      id: interactionId,
      customer_id: data.customer_id,
      customer_name: data.customer_name,
      sales_rep_name: data.sales_rep_name || 'کارشناس فروش',
      interaction_type: data.interaction_type,
      event_time: data.event_time || nowStr,
      summary_text: data.summary_text,
      customer_feedback: data.customer_feedback,
      key_outcome: data.key_outcome,
      related_product: data.related_product,
      next_action: data.next_action,
      follow_up_date: data.follow_up_date,
      priority: data.priority || 'High',
      record_status: data.record_status || 'قطعی',
      conversation_status: data.conversation_status || 'Follow-up Required',
      sales_stage: data.sales_stage || 'Negotiation',
      created_at: new Date().toLocaleDateString('fa-IR'),
    };

    const updatedInteractions = [newInteraction, ...interactions];
    saveInteractions(updatedInteractions);

    // Update customer's prominent next step
    updateCustomerNextStep(
      data.customer_id,
      data.next_action,
      data.summary_text,
      data.follow_up_date || '۳ روز آینده',
      data.priority || 'High'
    );

    let createdTaskId: string | undefined = undefined;

    // Automatic follow-up task generation
    if (autoCreateTask && data.next_action) {
      const priorityLabel = data.priority === 'Critical' ? 'بحرانی (P0)' : data.priority === 'High' ? 'بالا (P1)' : data.priority === 'Medium' ? 'متوسط (P2)' : 'عادی (P3)';
      
      createdTaskId = addTask({
        customer_id: data.customer_id,
        customer_name: data.customer_name,
        location_name: '',
        sales_rep_name: data.sales_rep_name || 'کارشناس فروش',
        task_type: 'FOLLOW_UP',
        task_type_label: 'پیگیری تعامل ثبت‌شده',
        title: data.next_action,
        reason: `چون در تعامل ${data.interaction_type} (${data.summary_text}) مقرر شد اقدام بعدی انجام شود، باید پیگیری لازم در موعد مقرر صورت گیرد.`,
        because_signal: `مکالمه ${data.interaction_type}: ${data.summary_text.slice(0, 80)}...`,
        should_action: data.next_action,
        priority: data.priority || 'High',
        priority_label: priorityLabel,
        due_date: data.follow_up_date || '۳ روز مانده',
        status: 'To Do',
        context_type: 'CRM',
        context_data: {
          crm_interaction_summary: data.summary_text,
          product_id: data.related_product,
        },
        suggested_next_step: data.next_action,
        notes: [
          {
            text: `ثبت خودکار از تعامل ${interactionId}: ${data.summary_text}`,
            created_at: new Date().toLocaleDateString('fa-IR'),
            author: data.sales_rep_name || 'کارشناس فروش',
          },
        ],
      });
    }

    return { interactionId, taskId: createdTaskId };
  };

  // Backwards compatibility for PrioritiesPage
  const priorities: CopanActionPriority[] = tasks.map((t) => ({
    id: t.id,
    customer_id: t.customer_id,
    customer_name: t.customer_name,
    priority: t.priority,
    priority_label: t.priority_label,
    title: t.title,
    reason: t.reason,
    evidence: [t.because_signal, t.suggested_next_step],
    expected_impact: t.context_data?.expected_impact || 'تثبیت و رشد درآمد حساب',
    recommended_action: t.should_action || t.suggested_next_step,
    deadline: t.due_date,
    status: t.status === 'Completed' ? 'Completed' : t.status === 'Snoozed' ? 'Snoozed' : 'Pending',
    sales_rep_name: t.sales_rep_name,
    financial_exposure: t.context_data?.financial_amount || 0,
  }));

  const updatePriorityStatus = (id: string, status: any, note?: string) => {
    const taskState: TaskState = status === 'Completed' ? 'Completed' : status === 'Snoozed' ? 'Snoozed' : 'To Do';
    updateTaskStatus(id, taskState, note);
  };

  // Global COBAT Conversational Memory
  const [cobatMessages, setCobatMessages] = useState<CobatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_COBAT);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [
      {
        id: 'cobat-init',
        sender: 'cobat',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        text: 'داده کافی موجود نیست؛ سرویس گفت‌وگوی COBAT در backend فعلی پشتیبانی نمی‌شود.',
      },
    ];
  });

  const sendCobatMessage = (query: string, contextPage: string = 'dashboard') => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const userMsg: CobatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      context_page: contextPage,
      customer_id: selectedCustomerId,
    };

    const newMsgs = [...cobatMessages, userMsg];
    setCobatMessages(newMsgs);
    setIsCobatTyping(true);

    setTimeout(() => {
      const response: CobatMessage = {
        id: 'cobat-unavailable-' + Date.now(),
        sender: 'cobat',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        text: 'داده کافی موجود نیست؛ سرویس گفت‌وگوی COBAT در backend فعلی پشتیبانی نمی‌شود.',
        context_page: contextPage,
        customer_id: selectedCustomerId || undefined,
      };

      const updated = [...newMsgs, response];
      setCobatMessages(updated);
      setIsCobatTyping(false);
      localStorage.setItem(LOCAL_STORAGE_KEY_COBAT, JSON.stringify(updated));
    }, 500);
  };

  const clearCobatMemory = () => {
    const resetMsgs: CobatMessage[] = [
      {
        id: 'cobat-reset-' + Date.now(),
        sender: 'cobat',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        text: 'حافظه جلسه بازنشانی شد. آماده بررسی حساب‌ها و وظایف بعدی هستم.',
      },
    ];
    setCobatMessages(resetMsgs);
    localStorage.setItem(LOCAL_STORAGE_KEY_COBAT, JSON.stringify(resetMsgs));
  };

  const activeCustomer =
    customers.find((c) => c.customer_id === selectedCustomerId) || customers[0] || EMPTY_CUSTOMER;

  return (
    <CopanContext.Provider
      value={{
        customers,
        selectedCustomerId,
        setSelectedCustomerId,
        activeCustomer,
        updateCustomerNextStep,
        tasks,
        addTask,
        updateTaskStatus,
        updateTaskPriority,
        updateTaskDueDate,
        addTaskNote,
        snoozeTask,
        deleteTask,
        interactions,
        logInteraction,
        priorities,
        updatePriorityStatus,
        cobatMessages,
        sendCobatMessage,
        clearCobatMemory,
        isCobatTyping,
        installmentProfitRatePct,
        setInstallmentProfitRatePct,
        isDarkMode,
        setIsDarkMode,
      }}
    >
      {children}
    </CopanContext.Provider>
  );
};

export const useCopan = () => {
  const context = useContext(CopanContext);
  if (!context) {
    throw new Error('useCopan must be used within a CopanProvider');
  }
  return context;
};
