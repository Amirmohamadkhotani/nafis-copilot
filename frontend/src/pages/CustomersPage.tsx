import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Bot,
  Download,
  LayoutGrid,
  List,
  Star,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Zap,
  ShieldAlert,
  Sparkles,
  Award,
} from 'lucide-react';
import type { PageId } from '../components/layout/Sidebar';
import { useCopan } from '../context/CopanContext';
import { type CopanCustomer } from '../data/copanIntelligence';
import { exportToCSV } from '../utils/exportUtils';

interface SpotlightCustomer {
  customer_id: string;
  customer_name: string;
  location_name: string;
  sales_rep_name: string;
  customer_segment: 'A' | 'B' | 'C';
  lifetime_revenue_mil: number;
  revenue_trend_pct: number;
  gross_margin_pct: number;
  nafis_share_pct: number;
  risk_score: number;
  status_badge: string;
  why_reason: string;
  action_title: string;
  tag: string;
}

const TOP_5_BEST_CUSTOMERS: SpotlightCustomer[] = [
  {
    customer_id: 'C_245948',
    customer_name: 'ریسندگی و بافندگی اطلس یزد',
    location_name: 'یزد',
    sales_rep_name: 'مهندس رضایی',
    customer_segment: 'A',
    lifetime_revenue_mil: 290,
    revenue_trend_pct: 14.2,
    gross_margin_pct: 12.8,
    nafis_share_pct: 78,
    risk_score: 12,
    status_badge: 'پیشتاز (Champion)',
    why_reason: 'نظم بی‌نقص در تسویه مطالبات، خرید تکرارشونده ماهانه ۵۰ تن نخ DTY، افزایش مداوم سهم سبد و انتقال سفارشات از رقیب سیرنگ.',
    action_title: 'صدور و ارسال پیش‌فاکتور تکرار سفارش ۵۰ تن',
    tag: 'رشد مداوم و وفاداری بالا',
  },
  {
    customer_id: 'C_937594',
    customer_name: 'نساجی نگین بافت کاشان',
    location_name: 'کاشان',
    sales_rep_name: 'مهندس کاظمی',
    customer_segment: 'A',
    lifetime_revenue_mil: 245,
    revenue_trend_pct: 18.5,
    gross_margin_pct: 11.5,
    nafis_share_pct: 82,
    risk_score: 10,
    status_badge: 'وفادار راهبردی',
    why_reason: 'مذاکره موفق هیئت‌مدیره برای افزایش ۱۰٪ تناژ سالانه و عقد قرارداد تامین انحصاری نخ POY مات با تسهیلات اعتباری ۴۵ روزه.',
    action_title: 'تنظیم متن نهایی قرارداد سالانه ۱۴۰۵',
    tag: 'قرارداد انحصاری سالانه',
  },
  {
    customer_id: 'C_384729',
    customer_name: 'فرش ستاره کویر یزد',
    location_name: 'یزد',
    sales_rep_name: 'مهندس رضایی',
    customer_segment: 'A',
    lifetime_revenue_mil: 310,
    revenue_trend_pct: 8.9,
    gross_margin_pct: 13.2,
    nafis_share_pct: 85,
    risk_score: 15,
    status_badge: 'حساب کلیدی سودآور',
    why_reason: 'بزرگ‌ترین حجم خرید پایدار در خانواده کالایی ۰۲، حاشیه سود ناخالص بالا و پایبندی کامل به زمان‌بندی تحویل و پرداخت نقدی.',
    action_title: 'معرفی خانواده محصول جدید سوپربرایت و بررسی آفر',
    tag: 'حاشیه سود بالا و تسویه نقدی',
  },
  {
    customer_id: 'C_719302',
    customer_name: 'بافندگی ابریشم تابان',
    location_name: 'اصفهان',
    sales_rep_name: 'مهندس کاظمی',
    customer_segment: 'B',
    lifetime_revenue_mil: 195,
    revenue_trend_pct: 22.1,
    gross_margin_pct: 14.0,
    nafis_share_pct: 75,
    risk_score: 18,
    status_badge: 'در حال جهش سریع',
    why_reason: 'بالاترین شتاب رشد ماهانه در میان مشتریان سگمنت B، تنوع‌بخشی به سبد با خرید همزمان نخ‌های خانواده ۰۳ و ۰۴ و تسویه سریع.',
    action_title: 'ارتقای سگمنت به A و افزایش سقف اعتبار',
    tag: 'بیشترین شتاب رشد ماهانه',
  },
  {
    customer_id: 'CUST-001',
    customer_name: 'صنایع نساجی تابیده‌باف کاشان',
    location_name: 'کاشان',
    sales_rep_name: 'مهندس رضایی',
    customer_segment: 'A',
    lifetime_revenue_mil: 280,
    revenue_trend_pct: 6.4,
    gross_margin_pct: 10.8,
    nafis_share_pct: 70,
    risk_score: 16,
    status_badge: 'پایدار و مطمئن',
    why_reason: 'ثبت بدون وقفه سفارشات هفتگی در تمام فصول سال، فقدان هرگونه چک برگشتی و پتانسیل تصاحب ۳۰٪ سهم باقیمانده از درخشان‌نخ.',
    action_title: 'پیگیری آفر تخفیف پلکانی برای جذب کل سفارشات',
    tag: 'خرید پیوسته بدون تاخیر وصول',
  },
];

const TOP_5_CRITICAL_CUSTOMERS: SpotlightCustomer[] = [
  {
    customer_id: 'CUST-008',
    customer_name: 'صنایع نساجی سبلان پارچه',
    location_name: 'اردبیل',
    sales_rep_name: 'مهندس رضایی',
    customer_segment: 'A',
    lifetime_revenue_mil: 540,
    revenue_trend_pct: -34.5,
    gross_margin_pct: 8.2,
    nafis_share_pct: 42,
    risk_score: 84,
    status_badge: 'بحرانی (P0)',
    why_reason: '۲ شکایت باز کیفیت پیرامون پرزدهی لات ۱۱۳۰۶۸ روی ماشین‌آلات بافندگی، تهدید رسمی به لغو قرارداد تامین سالانه و توقف خرید در ۴۵ روز اخیر.',
    action_title: 'مذاکره حضوری مدیر فروش و ارسال تیم فنی فوری به اردبیل',
    tag: 'نقص کیفی لات تولید و خطر لغو',
  },
  {
    customer_id: 'C_535756',
    customer_name: 'فرش و نساجی پرنیان مشهد',
    location_name: 'مشهد',
    sales_rep_name: 'مهندس احمدی',
    customer_segment: 'A',
    lifetime_revenue_mil: 390,
    revenue_trend_pct: -18.2,
    gross_margin_pct: 7.9,
    nafis_share_pct: 48,
    risk_score: 78,
    status_badge: 'بحرانی مالی (P1)',
    why_reason: '۲ فقره چک برگشتی معوق به مبلغ ۳۸ میلیون ریال با ۳۸ روز دیرکرد، کاهش اعتبارسنجی بانکی و ریسک نکول مطالبات.',
    action_title: 'توقف موقت فروش نسیه، ارسال اخطار اعتباری و وصول چک‌ها',
    tag: '۲ چک برگشتی و ریسک وصول',
  },
  {
    customer_id: 'C_683666',
    customer_name: 'نساجی تار و پود اصفهان',
    location_name: 'اصفهان',
    sales_rep_name: 'مهندس کاظمی',
    customer_segment: 'A',
    lifetime_revenue_mil: 410,
    revenue_trend_pct: -26.0,
    gross_margin_pct: 9.1,
    nafis_share_pct: 35,
    risk_score: 72,
    status_badge: 'هشدار جدی ریزش',
    why_reason: 'انتقال ۳۵٪ از سفارشات ماهانه به رقیب (نساجی بروجرد) به دلیل تاخیر واحد R&D در تایید نمونه نخ نمره P_091085.',
    action_title: 'تسریع تست خط R&D و ارسال ۵۰۰ کیلو نمونه آزمایشگاهی',
    tag: 'انتقال سفارشات به رقیب بروجرد',
  },
  {
    customer_id: 'C_819204',
    customer_name: 'ریسندگی زرین‌بافت تبریز',
    location_name: 'تبریز',
    sales_rep_name: 'مهندس احمدی',
    customer_segment: 'B',
    lifetime_revenue_mil: 165,
    revenue_trend_pct: -21.5,
    gross_margin_pct: 6.8,
    nafis_share_pct: 28,
    risk_score: 69,
    status_badge: 'ریزش سهم سبد',
    why_reason: 'جنگ قیمتی شدید با شرکت سیرنگ، افت شدید سهم سبد نفیس از ۶۵٪ به ۲۸٪ به دلیل عدم ارائه تخفیف‌های تجاری منعطف.',
    action_title: 'تدوین آفر تخفیف پلکانی حجمی با سود اقساطی ۴٪',
    tag: 'فشار قیمتی رقیب سیرنگ',
  },
  {
    customer_id: 'C_102938',
    customer_name: 'صنایع تریکو بافت سهند',
    location_name: 'تبریز',
    sales_rep_name: 'مهندس کاظمی',
    customer_segment: 'B',
    lifetime_revenue_mil: 140,
    revenue_trend_pct: -15.8,
    gross_margin_pct: 7.4,
    nafis_share_pct: 30,
    risk_score: 65,
    status_badge: 'راکد و تاخیر وصول',
    why_reason: 'دیرکرد ۴۵ روزه در تسویه فاکتورهای اقساطی، عدم ثبت هرگونه سفارش جدید در ۴۰ روز گذشته و کاهش گردش نقدینگی کارخانه.',
    action_title: 'تماس کارشناس مالی جهت تعیین جدول زمان‌بندی اقساط',
    tag: 'توقف سفارشات و دیرکرد ۴۵ روزه',
  },
];

// Spotlight ranking is not available from the current backend contract.
TOP_5_BEST_CUSTOMERS.length = 0;
TOP_5_CRITICAL_CUSTOMERS.length = 0;

interface CustomersPageProps {
  onNavigate: (page: PageId) => void;
  onSelectCustomer: (customerId: string) => void;
  onOpenCobat: (prompt?: string) => void;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({
  onNavigate,
  onSelectCustomer,
  onOpenCobat,
}) => {
  const { customers } = useCopan();
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<'All' | 'A' | 'B' | 'C'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Healthy' | 'Needs Attention' | 'At Risk'>('All');
  const [salesRepFilter, setSalesRepFilter] = useState('All');
  const [sortBy, setSortBy] = useState<keyof CopanCustomer>('risk_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [spotlightMode, setSpotlightMode] = useState<'BOTH' | 'BEST' | 'CRITICAL'>('BOTH');
  const pageSize = 10;

  // Filter and Sort Customers
  const filteredAndSortedCustomers = useMemo(() => {
    let list = customers.filter((c) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          c.customer_name.toLowerCase().includes(q) ||
          c.customer_id.toLowerCase().includes(q) ||
          c.location_name.toLowerCase().includes(q) ||
          c.main_competitor.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Segment
      if (segmentFilter !== 'All' && c.customer_segment !== segmentFilter) return false;

      // Status
      if (statusFilter !== 'All' && c.health_status !== statusFilter) return false;

      // Rep
      if (salesRepFilter !== 'All' && c.sales_rep_id !== salesRepFilter) return false;

      return true;
    });

    // Sorting
    list.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      }
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'desc' ? valB.localeCompare(valA) : valA.localeCompare(valB);
      }
      return 0;
    });

    return list;
  }, [customers, searchQuery, segmentFilter, statusFilter, salesRepFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedCustomers.length / pageSize) || 1;
  const paginatedCustomers = filteredAndSortedCustomers.slice(
    (currentPageNum - 1) * pageSize,
    currentPageNum * pageSize
  );

  const handleSort = (column: keyof CopanCustomer) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'کد مشتری',
      'نام مشتری',
      'سگمنت',
      'شهر / موقعیت',
      'کارشناس فروش',
      'فروش کل (ریال)',
      'روند فروش ٪',
      'حاشیه سود ٪',
      'سهم سبد ٪',
      'رقیب اصلی',
      'شاخص ریسک',
      'شاخص فرصت',
      'وضعیت سلامت',
      'اقدام بعدی (NBA)',
    ];
    const rows = filteredAndSortedCustomers.map((c) => [
      c.customer_id,
      c.customer_name,
      c.customer_segment,
      c.location_name,
      c.sales_rep_name,
      c.lifetime_revenue,
      c.revenue_trend_pct,
      c.avg_gross_margin_pct,
      c.avg_nafis_share_pct,
      c.main_competitor,
      c.risk_score,
      c.opportunity_score,
      c.health_status,
      c.latest_next_action,
    ]);
    exportToCSV(`COPAN_Customer_Matrix_${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* ============================================================
          0. SPOTLIGHT: 5 BEST ACCOUNTS (عالی) & 5 CRITICAL ACCOUNTS (بد)
          ============================================================ */}
      <div className="copan-card space-y-5 bg-gradient-to-b from-[var(--panel)] to-[var(--panel-2)]/50 border border-[var(--hair-strong)]">
        {/* Spotlight Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--hair)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--gold-soft)] text-[var(--gold)] border border-[var(--gold)]/30 flex items-center justify-center shrink-0">
              <Award size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-[16px] text-[var(--text)]">
                  دیده‌بان حساب‌های ویژه: ۵ مشتری عالی و ۵ مشتری بحرانی
                </h2>
                <span className="copan-badge badge-gold text-[10.5px] font-bold">
                  تحلیل و پایش راهبردی
                </span>
              </div>
              <p className="text-[11.5px] text-[var(--text-faint)] mt-0.5">
                معرفی ۵ حساب با بالاترین رشد و سودآوری در برابر ۵ حساب با ریسک بالای ریزش و چالش‌های مالی/کیفی
              </p>
            </div>
          </div>

          {/* Spotlight Tab Controls */}
          <div className="flex items-center bg-[var(--panel-2)] p-1 rounded-xl border border-[var(--hair)] text-[12px] gap-1 self-start sm:self-auto flex-wrap">
            <button
              onClick={() => setSpotlightMode('BOTH')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                spotlightMode === 'BOTH'
                  ? 'bg-[var(--gold)] text-[#0e1c12] shadow-xs'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              نمایش هر دو گروه (۱۰ حساب)
            </button>
            <button
              onClick={() => setSpotlightMode('BEST')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                spotlightMode === 'BEST'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <Star size={13} className="fill-current" />
              <span>۵ مشتری عالی (Star)</span>
            </button>
            <button
              onClick={() => setSpotlightMode('CRITICAL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                spotlightMode === 'CRITICAL'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              <ShieldAlert size={13} />
              <span>۵ مشتری بحرانی (At Risk)</span>
            </button>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* =========================================
              COLUMN 1: 5 BEST ACCOUNTS (عالی و سودآور)
              ========================================= */}
          {(spotlightMode === 'BOTH' || spotlightMode === 'BEST') && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                  <h3 className="font-extrabold text-[14.5px] text-emerald-400">
                    ۵ مشتری عالی و ارزش‌آفرین (Top 5 Champions)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-400/90 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  رشد مثبت • تسویه منظم
                </span>
              </div>

              {TOP_5_BEST_CUSTOMERS.map((best, idx) => (
                <div
                  key={best.customer_id}
                  className="rounded-xl bg-[var(--panel-2)] border border-emerald-500/25 p-3.5 space-y-2.5 hover:border-emerald-500/60 hover:shadow-md transition-all group"
                >
                  {/* Top Line: Rank, Name, Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div
                      onClick={() => {
                        onSelectCustomer(best.customer_id);
                        onNavigate('customer_360');
                      }}
                      className="flex items-center gap-2 cursor-pointer group/cust min-w-0"
                    >
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-[12px] shrink-0 font-mono">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-extrabold text-[13.5px] text-[var(--text)] group-hover/cust:text-[var(--gold)] transition-colors flex items-center gap-1">
                          <span>{best.customer_name}</span>
                          <ArrowUpRight size={13} className="opacity-0 group-hover/cust:opacity-100 transition-opacity text-[var(--gold)]" />
                        </div>
                        <div className="text-[11px] font-mono text-[var(--text-faint)]">
                          {best.customer_id} • {best.location_name} • کارشناس: {best.sales_rep_name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="copan-badge badge-gold text-[10px] font-bold">
                        سگمنت {best.customer_segment}
                      </span>
                      <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {best.status_badge}
                      </span>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-4 gap-1.5 text-center text-[11px]">
                    <div className="p-1.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)]">
                      <div className="text-[10px] text-[var(--text-faint)]">فروش کل</div>
                      <div className="font-bold text-[var(--text)] font-mono">{best.lifetime_revenue_mil} م.ر</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="text-[10px] text-emerald-400/80">رشد فروش</div>
                      <div className="font-extrabold text-emerald-400 font-mono flex items-center justify-center gap-0.5">
                        <TrendingUp size={11} />
                        <span>+{best.revenue_trend_pct}٪</span>
                      </div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)]">
                      <div className="text-[10px] text-[var(--text-faint)]">حاشیه سود</div>
                      <div className="font-bold text-[var(--gold)] font-mono">{best.gross_margin_pct}٪</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)]">
                      <div className="text-[10px] text-[var(--text-faint)]">سهم سبد نفیس</div>
                      <div className="font-bold text-emerald-400 font-mono">{best.nafis_share_pct}٪</div>
                    </div>
                  </div>

                  {/* Why it's Great (Reasoning) */}
                  <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15 text-[11.5px] text-[var(--text-dim)] leading-relaxed flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <b className="text-emerald-400">علت تمایز و عملکرد عالی: </b>
                      <span>{best.why_reason}</span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--hair)]/60 text-[11px]">
                    <div className="flex items-center gap-1.5 text-[var(--text-dim)] font-medium truncate">
                      <Sparkles size={12} className="text-[var(--gold)] shrink-0" />
                      <span className="truncate">اقدام بعدی: <b>{best.action_title}</b></span>
                    </div>
                    <button
                      onClick={() => {
                        onSelectCustomer(best.customer_id);
                        onNavigate('customer_360');
                      }}
                      className="copan-btn copan-btn-secondary copan-btn-sm text-[10.5px] font-bold shrink-0 cursor-pointer"
                    >
                      <span>پروفایل ۳۶۰°</span>
                      <ChevronLeft size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =========================================
              COLUMN 2: 5 CRITICAL ACCOUNTS (بحرانی و پرریسک)
              ========================================= */}
          {(spotlightMode === 'BOTH' || spotlightMode === 'CRITICAL') && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]" />
                  <h3 className="font-extrabold text-[14.5px] text-rose-400">
                    ۵ مشتری بحرانی و پرریسک (Top 5 At-Risk / Critical)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-rose-400/90 font-bold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                  نیازمند مداخله فوری
                </span>
              </div>

              {TOP_5_CRITICAL_CUSTOMERS.map((crit, idx) => (
                <div
                  key={crit.customer_id}
                  className="rounded-xl bg-[var(--panel-2)] border border-rose-500/25 p-3.5 space-y-2.5 hover:border-rose-500/60 hover:shadow-md transition-all group"
                >
                  {/* Top Line: Rank, Name, Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div
                      onClick={() => {
                        onSelectCustomer(crit.customer_id);
                        onNavigate('customer_360');
                      }}
                      className="flex items-center gap-2 cursor-pointer group/cust min-w-0"
                    >
                      <span className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-[12px] shrink-0 font-mono">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-extrabold text-[13.5px] text-[var(--text)] group-hover/cust:text-rose-400 transition-colors flex items-center gap-1">
                          <span>{crit.customer_name}</span>
                          <ArrowUpRight size={13} className="opacity-0 group-hover/cust:opacity-100 transition-opacity text-rose-400" />
                        </div>
                        <div className="text-[11px] font-mono text-[var(--text-faint)]">
                          {crit.customer_id} • {crit.location_name} • کارشناس: {crit.sales_rep_name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="copan-badge badge-neutral text-[10px] font-bold">
                        سگمنت {crit.customer_segment}
                      </span>
                      <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        {crit.status_badge}
                      </span>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-4 gap-1.5 text-center text-[11px]">
                    <div className="p-1.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)]">
                      <div className="text-[10px] text-[var(--text-faint)]">فروش کل</div>
                      <div className="font-bold text-[var(--text)] font-mono">{crit.lifetime_revenue_mil} م.ر</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                      <div className="text-[10px] text-rose-400/80">افت فروش</div>
                      <div className="font-extrabold text-rose-400 font-mono flex items-center justify-center gap-0.5">
                        <TrendingDown size={11} />
                        <span>{crit.revenue_trend_pct}٪</span>
                      </div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30">
                      <div className="text-[10px] text-rose-400/90 font-bold">شاخص ریسک</div>
                      <div className="font-black text-rose-400 font-mono">{crit.risk_score} / ۱۰۰</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[var(--panel)] border border-[var(--hair)]">
                      <div className="text-[10px] text-[var(--text-faint)]">سهم سبد نفیس</div>
                      <div className="font-bold text-[var(--text-dim)] font-mono">{crit.nafis_share_pct}٪</div>
                    </div>
                  </div>

                  {/* Root Cause / Why it's At Risk */}
                  <div className="p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/15 text-[11.5px] text-[var(--text-dim)] leading-relaxed flex items-start gap-2">
                    <AlertTriangle size={15} className="text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <b className="text-rose-400">علت ریشه‌ای بحران و ریسک: </b>
                      <span>{crit.why_reason}</span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--hair)]/60 text-[11px]">
                    <div className="flex items-center gap-1.5 text-rose-400 font-bold truncate">
                      <Zap size={12} className="shrink-0" />
                      <span className="truncate">اقدام اصلاحی: <b className="text-[var(--text)]">{crit.action_title}</b></span>
                    </div>
                    <button
                      onClick={() => {
                        onSelectCustomer(crit.customer_id);
                        onNavigate('customer_360');
                      }}
                      className="copan-btn copan-btn-secondary copan-btn-sm text-[10.5px] font-bold shrink-0 cursor-pointer border-rose-500/30 hover:border-rose-500/60"
                    >
                      <span>پروفایل ۳۶۰°</span>
                      <ChevronLeft size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================
          1. FULL CUSTOMER DIRECTORY & FILTERABLE TABLE
          ============================================================ */}
      <div className="copan-card space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--hair)]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-[16px] text-[var(--text)]">
                فهرست جامع مشتریان (Customer Directory)
              </h2>
              <span className="copan-badge badge-gold font-mono text-[11px]">
                {filteredAndSortedCustomers.length} حساب تجاری
              </span>
            </div>
            <p className="text-[11.5px] text-[var(--text-faint)] mt-0.5">
              جستجو و پیمایش در کل پایگاه مشتریان بر اساس رتبه‌بندی، سگمنت، شاخص ریسک و سهم سبد
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle (Table / Card) */}
            <div className="flex items-center bg-[var(--panel-2)] p-0.5 rounded-xl border border-[var(--hair)] text-[12px]">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-[var(--gold)] text-[#081610]' : 'text-[var(--text-dim)]'
                }`}
                title="حالت جدولی"
              >
                <List size={15} />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'cards' ? 'bg-[var(--gold)] text-[#081610]' : 'text-[var(--text-dim)]'
                }`}
                title="حالت کارتی (مناسب موبایل)"
              >
                <LayoutGrid size={15} />
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="copan-btn copan-btn-secondary text-[12px]"
              title="دریافت فایل اکسل فهرست مشتریان"
            >
              <Download size={14} />
              خروجی اکسل
            </button>

            <button
              onClick={() => onOpenCobat('مشتریان سگمنت A که بیشترین افت خرید را داشته‌اند را مقایسه کن')}
              className="copan-btn copan-btn-gold text-[12px] font-bold"
            >
              <Bot size={15} />
              تحلیل گروهی COBAT
            </button>
          </div>
        </div>

        {/* Filters Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-[12px]">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search size={15} className="absolute top-3 right-3 text-[var(--text-faint)]" />
            <input
              type="text"
              placeholder="جستجو در نام، کد مشتری، شهر یا رقیب..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPageNum(1);
              }}
              className="w-full bg-[var(--panel-2)] border border-[var(--hair-strong)] rounded-xl pr-9 pl-3 py-2 text-[12px] text-[var(--text)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-faint)]"
            />
          </div>

          {/* Segment Filter */}
          <div>
            <select
              value={segmentFilter}
              onChange={(e) => {
                setSegmentFilter(e.target.value as any);
                setCurrentPageNum(1);
              }}
              className="w-full bg-[var(--panel-2)] border border-[var(--hair-strong)] rounded-xl px-3 py-2 text-[12px] text-[var(--text)] focus:outline-none focus:border-[var(--gold)] cursor-pointer"
            >
              <option value="All">همه سگمنت‌ها (A/B/C)</option>
              <option value="A">سگمنت A (استراتژیک)</option>
              <option value="B">سگمنت B (متوسط)</option>
              <option value="C">سگمنت C (خرد)</option>
            </select>
          </div>

          {/* Health Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPageNum(1);
              }}
              className="w-full bg-[var(--panel-2)] border border-[var(--hair-strong)] rounded-xl px-3 py-2 text-[12px] text-[var(--text)] focus:outline-none focus:border-[var(--gold)] cursor-pointer"
            >
              <option value="All">همه وضعیت‌های سلامت</option>
              <option value="Healthy">سالم و پایدار (Healthy)</option>
              <option value="Needs Attention">نیازمند توجه (Needs Attention)</option>
              <option value="At Risk">در معرض ریزش (At Risk)</option>
            </select>
          </div>

          {/* Sales Rep Filter */}
          <div>
            <select
              value={salesRepFilter}
              onChange={(e) => {
                setSalesRepFilter(e.target.value);
                setCurrentPageNum(1);
              }}
              className="w-full bg-[var(--panel-2)] border border-[var(--hair-strong)] rounded-xl px-3 py-2 text-[12px] text-[var(--text)] focus:outline-none focus:border-[var(--gold)] cursor-pointer"
            >
              <option value="All">همه کارشناسان فروش</option>
              <option value="REP-001">مهندس احمدی (منطقه ۱)</option>
              <option value="REP-002">مهندس رضایی (منطقه ۲)</option>
              <option value="REP-003">مهندس کاظمی (منطقه ۳)</option>
              <option value="REP-004">مهندس موسوی (منطقه ۴)</option>
              <option value="REP-005">مهندس شجاعی (منطقه ۵)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Customers View (Table or Mobile Cards) */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedCustomers.map((cust) => (
            <div
              key={cust.customer_id}
              onClick={() => {
                onSelectCustomer(cust.customer_id);
                onNavigate('customer_360');
              }}
              className="copan-card p-4 space-y-3 cursor-pointer hover:border-[var(--gold)] transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-[15px] text-[var(--text)]">{cust.customer_name}</h3>
                  <div className="text-[11px] font-mono text-[var(--text-faint)]">
                    {cust.customer_id} • {cust.location_name}
                  </div>
                </div>
                <span
                  className={`copan-badge ${
                    cust.customer_segment === 'A' ? 'badge-gold' : 'badge-neutral'
                  }`}
                >
                  سگمنت {cust.customer_segment}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11.5px] p-2.5 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)]">
                <div>
                  <div className="text-[10px] text-[var(--text-faint)]">فروش (م.ر)</div>
                  <div className="font-mono font-bold text-[var(--text)]">{Number.isFinite(cust.lifetime_revenue) ? (cust.lifetime_revenue / 1000000).toFixed(0) : 'داده کافی موجود نیست'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-faint)]">شاخص ریسک</div>
                  <div className="font-mono font-bold text-[var(--risk)]">{Number.isFinite(cust.risk_score) ? cust.risk_score : 'داده کافی موجود نیست'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-faint)]">سهم سبد</div>
                  <div className="font-mono font-bold text-[var(--positive)]">{Number.isFinite(cust.avg_nafis_share_pct) ? `${cust.avg_nafis_share_pct}٪` : 'داده کافی موجود نیست'}</div>
                </div>
              </div>

              <div className="text-[11.5px] text-[var(--text-dim)] flex items-center justify-between">
                <span>اقدام بعدی: <b>{cust.latest_next_action}</b></span>
                <button className="copan-btn copan-btn-secondary copan-btn-sm text-[10.5px]">۳۶۰°</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="copan-card p-0 overflow-hidden space-y-0">
          <div className="overflow-x-auto">
            <table className="copan-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('customer_name')} className="cursor-pointer hover:text-[var(--text)]">
                    <div className="flex items-center gap-1">
                      <span>مشتری / موقعیت</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th>سگمنت</th>
                  <th>کارشناس</th>
                  <th onClick={() => handleSort('lifetime_revenue')} className="cursor-pointer hover:text-[var(--text)]">
                    <div className="flex items-center gap-1">
                      <span>فروش کل (م.ر)</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('revenue_trend_pct')} className="cursor-pointer hover:text-[var(--text)]">
                    <div className="flex items-center gap-1">
                      <span>روند فروش</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('avg_gross_margin_pct')} className="cursor-pointer hover:text-[var(--text)]">
                    <div className="flex items-center gap-1">
                      <span>حاشیه سود</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th>سهم سبد / رقیب</th>
                  <th onClick={() => handleSort('risk_score')} className="cursor-pointer hover:text-[var(--text)]">
                    <div className="flex items-center gap-1">
                      <span>شاخص ریسک</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('opportunity_score')} className="cursor-pointer hover:text-[var(--text)]">
                    <div className="flex items-center gap-1">
                      <span>پتانسیل رشد</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th>وضعیت سلامت</th>
                  <th>اقدام بعدی (NBA)</th>
                  <th className="text-center">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.map((cust) => (
                  <tr
                    key={cust.customer_id}
                    onClick={() => {
                      onSelectCustomer(cust.customer_id);
                      onNavigate('customer_360');
                    }}
                    className="cursor-pointer group"
                  >
                    <td className="font-bold text-[var(--text)]">
                      <div className="group-hover:text-[var(--gold)] transition-colors text-[14.5px] font-extrabold">{cust.customer_name}</div>
                      <div className="text-[11.5px] text-[var(--text-dim)] font-mono">
                        {cust.customer_id} • {cust.location_name}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`copan-badge ${
                          cust.customer_segment === 'A'
                            ? 'badge-gold'
                            : cust.customer_segment === 'B'
                            ? 'badge-brand'
                            : 'badge-neutral'
                        }`}
                      >
                        سگمنت {cust.customer_segment}
                      </span>
                    </td>
                    <td className="text-[12.5px] text-[var(--text-dim)] font-medium">{cust.sales_rep_name}</td>
                    <td className="font-mono font-bold text-[var(--text)] text-[13.5px]">
                      {Number.isFinite(cust.lifetime_revenue) ? (cust.lifetime_revenue / 1000000).toFixed(0) : 'داده کافی موجود نیست'}
                    </td>
                    <td className="font-mono font-bold text-[13.5px]">
                      <span
                        className={
                          cust.revenue_trend_pct >= 0 ? 'text-[var(--positive)]' : 'text-[var(--risk)]'
                        }
                      >
                        {!Number.isFinite(cust.revenue_trend_pct) ? 'داده کافی موجود نیست' : cust.revenue_trend_pct >= 0
                          ? `+${cust.revenue_trend_pct}%`
                          : `${cust.revenue_trend_pct}%`}
                      </span>
                    </td>
                    <td className="font-mono font-bold text-[13.5px]">{Number.isFinite(cust.avg_gross_margin_pct) ? `${cust.avg_gross_margin_pct}٪` : 'داده کافی موجود نیست'}</td>
                    <td>
                      <div className="font-mono font-bold text-[var(--text)] text-[13.5px]">{Number.isFinite(cust.avg_nafis_share_pct) ? `${cust.avg_nafis_share_pct}٪` : 'داده کافی موجود نیست'}</div>
                      <div className="text-[11.5px] text-[var(--gold)] font-bold">{cust.main_competitor}</div>
                    </td>
                    <td>
                      <span
                        className={`copan-badge font-mono ${
                          cust.risk_score > 70
                            ? 'badge-risk'
                            : cust.risk_score > 40
                            ? 'badge-gold'
                            : 'badge-positive'
                        }`}
                      >
                        {Number.isFinite(cust.risk_score) ? cust.risk_score : 'داده کافی موجود نیست'}
                      </span>
                    </td>
                    <td>
                      <span className="copan-badge badge-brand font-mono">
                        {Number.isFinite(cust.opportunity_score) ? cust.opportunity_score : 'داده کافی موجود نیست'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`copan-badge ${
                          cust.health_status === 'At Risk'
                            ? 'badge-risk'
                            : cust.health_status === 'Needs Attention'
                            ? 'badge-gold'
                            : 'badge-positive'
                        }`}
                      >
                        {cust.health_status === 'At Risk'
                          ? 'در معرض ریزش'
                          : cust.health_status === 'Needs Attention'
                          ? 'نیازمند توجه'
                          : cust.health_status === 'Healthy' ? 'سالم' : 'داده کافی موجود نیست'}
                      </span>
                    </td>
                    <td className="max-w-[200px] truncate text-[12px] text-[var(--text-dim)] font-medium">
                      {cust.latest_next_action}
                    </td>
                    <td className="text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          onSelectCustomer(cust.customer_id);
                          onNavigate('customer_360');
                        }}
                        className="copan-btn copan-btn-secondary copan-btn-sm text-[11px]"
                      >
                        پروفایل ۳۶۰°
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="px-5 py-3.5 bg-[var(--panel-2)] border border-[var(--hair)] rounded-2xl flex items-center justify-between text-[12px] text-[var(--text-faint)]">
        <div>
          صفحه {currentPageNum} از {totalPages} • نمایش {paginatedCustomers.length} حساب از {filteredAndSortedCustomers.length} مورد
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPageNum((p) => Math.max(1, p - 1))}
            disabled={currentPageNum === 1}
            className="copan-btn copan-btn-secondary copan-btn-sm disabled:opacity-40"
          >
            <ChevronRight size={15} />
            قبلی
          </button>
          <button
            onClick={() => setCurrentPageNum((p) => Math.min(totalPages, p + 1))}
            disabled={currentPageNum === totalPages}
            className="copan-btn copan-btn-secondary copan-btn-sm disabled:opacity-40"
          >
            بعدی
            <ChevronLeft size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
