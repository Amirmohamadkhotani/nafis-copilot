import React, { useState } from 'react';
import {
  Search,
  Moon,
  Sun,
  Menu,
  Bell,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import type { PageId } from './Sidebar';
import { useCopan } from '../../context/CopanContext';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onSelectCustomer: (customerId: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenMobileSidebar: () => void;
  onOpenCobat?: (initialPrompt?: string) => void;
}

const PAGE_TITLES: Record<PageId, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'مرکز فرماندهی فروش نفیس‌نخ (Sales Command Center)',
    subtitle: 'درک وضعیت جاری، شناسایی نقاط در معرض خطر و هدایت اقدام بعدی فروش (وضعیت ← هشدار ← اقدام ← پیگیری)',
  },
  cobat: {
    title: 'کوبات (COBAT) — میز کار تصمیم‌ساز هوشمند',
    subtitle: 'دستیار عاملی و تحلیل‌گر چندبعدی داده‌های فروش، کیفیت، مالی و بازار',
  },
  customers: {
    title: 'فهرست مشتریان (Customer Directory & Intelligence)',
    subtitle: 'فهرست کامل ۶۴۴ حساب تجاری به همراه رتبه‌بندی RFM، معرفی ۵ مشتری عالی و ۵ مشتری بحرانی',
  },
  customer_360: {
    title: 'نمای ۳۶۰ درجه مشتری (Customer 360)',
    subtitle: 'تحلیل ۱۴ بعدی سوابق خرید، شکایات کیفی، رفتار مالی، فرمول سود اقساط و NBA',
  },
  priorities: {
    title: 'اولویت‌های اقدام امروز (Today’s Priorities / NBA)',
    subtitle: 'تبدیل بینش‌های تحلیلی به اقدامات قطعی و وظایف اولویت‌بندی شده تیم فروش',
  },
  opportunities: {
    title: 'فرصت‌های رشد و تصاحب سهم بازار',
    subtitle: 'کشف پتانسیل‌های درآمدی بر اساس الگوهای تناوب خرید و افت سهم رقبا',
  },
  sales_intel: {
    title: 'تحلیل هوشمند فروش و ساختار تقاضا',
    subtitle: 'روند‌های زمانی، مشتریان در حال رشد و افت، خانواده‌های کالایی و توزیع پارتو',
  },
  market_intel: {
    title: 'هوش بازار و تحرکات رقبا (Market 3C)',
    subtitle: 'سیگنال‌های هفتگی بازار، تغییرات تقاضا، شاخص قیمت و تفکیک داده قطعی از استنتاج',
  },
  risks_alerts: {
    title: 'مرکز فرماندهی ریسک‌ها و هشدارها',
    subtitle: 'شناسایی زودهنگام ریسک‌های ریزش مشتری، عیوب کیفی لات‌های تولید و فشارهای قیمتی',
  },
  settings: {
    title: 'تنظیمات سیستم و راهبری داده‌ها',
    subtitle: 'وضعیت اتصال پایگاه‌های داده ERP/CRM/QMS، زمان‌بندی گزارشات و آستانه‌های هوش مصنوعی',
  },
};

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onSelectCustomer,
  isDarkMode,
  onToggleTheme,
  onOpenMobileSidebar,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { customers } = useCopan();

  const activePageInfo = PAGE_TITLES[currentPage] || PAGE_TITLES.dashboard;

  const filteredCustomers = searchQuery.trim()
    ? customers.filter(
        (c) =>
          c.customer_name.includes(searchQuery.trim()) ||
          c.customer_id.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
          c.location_name.includes(searchQuery.trim())
      ).slice(0, 6)
    : [];

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg-soft)]/90 backdrop-blur-md border-b border-[var(--hair)] px-4 lg:px-8 py-3.5 flex flex-col gap-3 transition-colors">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Left Side (RTL Start): Mobile Hamburger + Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--panel-2)] border border-[var(--hair)]"
          >
            <Menu size={20} />
          </button>

          <div>
            <h1 className="text-[17px] lg:text-[20px] font-extrabold text-[var(--text)] tracking-tight">
              {activePageInfo.title}
            </h1>
            <p className="text-[11.5px] lg:text-[12px] text-[var(--text-faint)] max-w-xl truncate hidden sm:block">
              {activePageInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right Side (RTL End): Global Search + Active Customer + Status Chips + Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Search */}
          <div className="relative">
            <div className="flex items-center bg-[var(--panel-2)] border border-[var(--hair-strong)] rounded-xl px-3 py-1.5 focus-within:border-[var(--gold)] transition-colors w-44 sm:w-60">
              <Search size={15} className="text-[var(--text-faint)] shrink-0 ml-2" />
              <input
                type="text"
                placeholder="جستجوی مشتری یا شناسه..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="bg-transparent border-none text-[12px] text-[var(--text)] focus:outline-none w-full placeholder:text-[var(--text-faint)]"
              />
            </div>

            {/* Search Results Dropdown */}
            {showSearchDropdown && filteredCustomers.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-[var(--panel)] border border-[var(--hair-strong)] rounded-xl shadow-2xl z-50 p-2 space-y-1">
                <div className="px-2 py-1 text-[11px] font-bold text-[var(--text-faint)]">
                  مشتریان منطبق ({filteredCustomers.length})
                </div>
                {filteredCustomers.map((cust) => (
                  <button
                    key={cust.customer_id}
                    onClick={() => {
                      onSelectCustomer(cust.customer_id);
                      onNavigate('customer_360');
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-right p-2 rounded-lg hover:bg-[var(--panel-2)] flex items-center justify-between text-[12px] transition-colors"
                  >
                    <div>
                      <div className="font-bold text-[var(--text)]">{cust.customer_name}</div>
                      <div className="text-[10.5px] text-[var(--text-faint)] font-mono">
                        {cust.customer_id} • {cust.location_name}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        cust.health_status === 'At Risk'
                          ? 'bg-[var(--risk-soft)] text-[var(--risk)]'
                          : 'bg-[var(--positive-soft)] text-[var(--positive)]'
                      }`}
                    >
                      سگمنت {cust.customer_segment}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>



          {/* Period Chip */}
          <div className="hidden xl:flex items-center gap-1.5 chip">
            <Calendar size={13} className="text-[var(--gold)]" />
            <span>بازه: <b>داده کافی موجود نیست</b></span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 chip warn">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
            <span>نسخهٔ متصل به داده</span>
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--panel-2)] border border-[var(--hair)] relative transition-colors"
              title="هشدارها و اعلانات هوشمند"
            >
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--risk)]" />
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute top-full left-0 sm:right-auto sm:left-0 mt-2 w-80 bg-[var(--panel)] border border-[var(--hair-strong)] rounded-xl shadow-2xl z-50 p-3 space-y-2 text-right">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--hair)]">
                  <span className="font-bold text-[12px] text-[var(--text)]">هشدارهای بحرانی سیستم</span>
                  <span className="text-[10.5px] font-mono text-[var(--text-faint)]">داده کافی موجود نیست</span>
                </div>
                <div className="space-y-1.5 text-[11.5px]">
                  <div className="p-3 rounded-lg bg-[var(--panel-2)] border border-[var(--hair)] text-[var(--text-faint)] flex items-center gap-2">
                    <AlertTriangle size={13} />
                    برای هشدارهای عملیاتی endpoint پشتیبان موجود نیست.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--panel-2)] border border-[var(--hair)] transition-colors cursor-pointer"
            title={isDarkMode ? 'تغییر به تم روشن' : 'تغییر به تم تاریک'}
          >
            {isDarkMode ? <Sun size={15} className="text-[var(--gold)]" /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
};
