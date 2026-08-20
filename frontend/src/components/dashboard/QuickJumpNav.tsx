import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Target,
  CreditCard,
  MessageSquare,
} from 'lucide-react';

interface QuickJumpNavProps {
  counts?: {
    alerts?: number;
    recommendations?: number;
    opportunities?: number;
    collections?: number;
    complaints?: number;
    negotiations?: number;
  };
}

export const QuickJumpNav: React.FC<QuickJumpNavProps> = ({ counts }) => {
  const [activeSection, setActiveSection] = useState<string>('kpi-section');

  const navItems = useMemo(() => [
    { id: 'kpi-section', label: 'شاخص‌های کلیدی', icon: BarChart3 },
    { id: 'sales-trend-section', label: 'روند فروش', icon: TrendingUp },
    {
      id: 'actions-section',
      label: 'اقدامات فوری',
      icon: AlertCircle,
      badge: counts?.alerts || 5,
      badgeColor: 'badge-risk-high',
    },
    {
      id: 'recommendations-section',
      label: 'پیشنهادهای هوشمند',
      icon: Sparkles,
      badge: counts?.recommendations || 5,
      badgeColor: 'badge-brand',
    },
    {
      id: 'opportunities-customers-section',
      label: 'فرصت‌ها و مشتریان',
      icon: Target,
    },
    {
      id: 'collections-complaints-section',
      label: 'مطالبات و شکایات',
      icon: CreditCard,
    },
    {
      id: 'negotiations-followups-section',
      label: 'مذاکرات و پیگیری‌ها',
      icon: MessageSquare,
    },
  ], [counts]);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (let i = navItems.length - 1; i >= 0; i--) {
        const el = document.getElementById(navItems[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  return (
    <nav className="sticky top-14 z-20 bg-surface/90 backdrop-blur-md border-b border-border-subtle/80 py-2 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[11.5px] font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand text-white shadow-xs font-semibold'
                    : 'text-ink-secondary hover:text-ink hover:bg-surface-subtle border border-transparent'
                }`}
                onClick={() => handleScrollTo(item.id)}
              >
                <Icon size={13} className={isActive ? 'text-white' : 'text-ink-muted'} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded-[4px] ${
                      isActive
                        ? 'bg-white/20 text-white font-bold'
                        : item.badgeColor === 'badge-risk-high'
                        ? 'bg-alert-red-bg text-alert-red-ink font-bold border border-alert-red-border'
                        : 'bg-brand-pale text-brand font-bold border border-brand-border'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
