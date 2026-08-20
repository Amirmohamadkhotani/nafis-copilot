import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Users,
  UserCheck,
  CheckSquare,
  Sparkles,
  TrendingUp,
  Globe2,
  AlertTriangle,
  Settings,
  ChevronLeft,
  X,
} from 'lucide-react';

export type PageId =
  | 'dashboard'
  | 'cobat'
  | 'customers'
  | 'customer_360'
  | 'priorities'
  | 'opportunities'
  | 'sales_intel'
  | 'market_intel'
  | 'risks_alerts'
  | 'settings';

interface NavItem {
  id: PageId;
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  count?: number;
  badgeColor?: string;
}

interface NavSection {
  groupLabel: string;
  items: NavItem[];
}

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  counts?: {
    priorities?: number;
    risks?: number;
    opportunities?: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpenMobile = false,
  onCloseMobile,
  counts = { priorities: 6, risks: 4, opportunities: 24 },
}) => {
  const navSections: NavSection[] = [
    {
      groupLabel: 'فرماندهی فروش',
      items: [
        {
          id: 'dashboard',
          label: 'مرکز فرماندهی فروش',
          icon: LayoutDashboard,
          badge: 'Live',
          badgeColor: 'badge-gold',
        },
      ],
    },
    {
      groupLabel: 'هوش مصنوعی',
      items: [
        {
          id: 'cobat',
          label: 'کوبات (COBAT)',
          sublabel: 'دستیار تصمیم‌ساز',
          icon: Bot,
          badge: 'AI',
          badgeColor: 'badge-gold',
        },
      ],
    },
    {
      groupLabel: 'مشتریان',
      items: [
        { id: 'customers', label: 'فهرست مشتریان', icon: Users },
        { id: 'customer_360', label: 'پروفایل ۳۶۰ درجه', icon: UserCheck },
      ],
    },
    {
      groupLabel: 'عملیات و اقدامات',
      items: [
        {
          id: 'priorities',
          label: 'اولویت‌های امروز (NBA)',
          icon: CheckSquare,
          count: counts.priorities,
          badgeColor: 'badge-risk',
        },
        {
          id: 'opportunities',
          label: 'فرصت‌های رشد و سهم سبد',
          icon: Sparkles,
          count: counts.opportunities,
          badgeColor: 'badge-gold',
        },
      ],
    },
    {
      groupLabel: 'هوش و تحلیل',
      items: [
        { id: 'sales_intel', label: 'هوش فروش و پارتو', icon: TrendingUp },
        { id: 'market_intel', label: 'هوش بازار و رقبا (3C)', icon: Globe2 },
        {
          id: 'risks_alerts',
          label: 'دیده‌بان ریسک‌ها و هشدارها',
          icon: AlertTriangle,
          count: counts.risks,
          badgeColor: 'badge-risk',
        },
      ],
    },
    {
      groupLabel: 'سیستم',
      items: [
        { id: 'settings', label: 'تنظیمات و پایگاه‌های داده', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 right-0 w-[260px] border-l border-[var(--hair)] z-50 flex flex-col transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
        style={{
          background: 'linear-gradient(185deg, var(--bg-soft), #ece3cd 78%)',
        }}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[var(--hair)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" className="shrink-0">
              <circle cx="15" cy="6.2" r="2.2" fill="#a97c22" />
              <path
                d="M15 10c-6.5 0-10.5 5.4-10.5 11.2C4.5 24.7 8 27 15 27s10.5-2.3 10.5-5.8C25.5 15.4 21.5 10 15 10Z"
                stroke="#182a1d"
                strokeWidth="1.6"
              />
            </svg>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[16.5px] tracking-tight text-[var(--text)]">
                  نفیس‌نخ
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[var(--gold-soft)] text-[var(--gold)] border border-[var(--gold)]/30">
                  COPAN
                </span>
              </div>
              <p className="text-[10.5px] text-[var(--text-faint)] leading-none mt-1">
                داشبورد هوش تجاری و تصمیم‌ساز
              </p>
            </div>
          </div>

          {isOpenMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--panel-2)] lg:hidden"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-2.5 text-[10.5px] font-bold text-[var(--text-faint)] tracking-wider">
                {section.groupLabel}
              </div>

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        if (isOpenMobile && onCloseMobile) {
                          onCloseMobile();
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] text-[13px] transition-all duration-150 text-right cursor-pointer group ${
                        isActive
                          ? 'bg-[var(--panel-2)] text-[var(--gold)] font-bold border border-[var(--hair-strong)] shadow-xs'
                          : 'text-[var(--text-dim)] hover:bg-[var(--panel-2)] hover:text-[var(--text)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          size={16}
                          className={`shrink-0 transition-opacity ${
                            isActive ? 'opacity-100 text-[var(--gold)]' : 'opacity-75 text-[var(--text-dim)]'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span className="copan-badge badge-gold text-[9.5px]">
                            {item.badge}
                          </span>
                        )}
                        {typeof item.count === 'number' && item.count > 0 && (
                          <span
                            className={`text-[10.5px] font-mono font-bold px-2 py-0.2 rounded-full ${
                              item.badgeColor === 'badge-risk'
                                ? 'bg-[var(--risk-soft)] text-[var(--risk)]'
                                : 'bg-[var(--gold-soft)] text-[var(--gold)]'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                        <ChevronLeft
                          size={13}
                          className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                            isActive ? 'opacity-100 text-[var(--gold)]' : 'text-[var(--text-faint)]'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[var(--hair)] space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-[var(--gold)] bg-[var(--gold-soft)] border border-[var(--gold)]/25 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
            <span>پایگاه داده زنده نفیس‌نخ</span>
          </div>
          <p className="text-[10.5px] text-[var(--text-faint)] leading-relaxed">
            نسخهٔ متصل به موتور تصمیم‌ساز عاملی COBAT و داده‌های فروش.
          </p>
        </div>
      </aside>
    </>
  );
};
