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
  icon: React.ComponentType<{ size?: number; className?: string }>;
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
  counts = {},
}) => {
  const navSections: NavSection[] = [
    {
      groupLabel: 'فرماندهی فروش',
      items: [
        {
          id: 'dashboard',
          label: 'مرکز فرماندهی فروش',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      groupLabel: 'هوش مصنوعی',
      items: [
        {
          id: 'cobat',
          label: 'کوبات (COBAT)',
          icon: Bot,
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
        className={`fixed top-0 bottom-0 right-0 w-[260px] bg-[var(--bg-soft)] border-l border-[var(--hair)] z-50 flex flex-col transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[var(--hair)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/80 dark:bg-white/10 px-2 py-1 rounded-lg border border-[var(--hair)] flex items-center justify-center">
              <img src="/copan-logo.png" alt="COPAN - کوپان" className="h-6 w-auto object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[15px] tracking-tight text-[var(--text)]">
                  نفیس‌نخ
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[var(--panel-2)] text-[var(--text-faint)]">
                  v2.0
                </span>
              </div>
              <p className="text-[10.5px] text-[var(--text-faint)] leading-none mt-0.5">
                سامانه هوش فروش و تصمیم‌ساز
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
              <div className="px-2.5 text-[11px] font-bold text-[var(--text-faint)] tracking-wider">
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-all duration-150 text-right cursor-pointer group ${
                        isActive
                          ? 'bg-[var(--panel)] text-[var(--gold)] font-bold shadow-sm'
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
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[var(--hair)] flex items-center justify-center">
          <span className="text-[11px] font-medium text-[var(--text-faint)]">COPAN نسخه ۲.۰</span>
        </div>
      </aside>
    </>
  );
};
