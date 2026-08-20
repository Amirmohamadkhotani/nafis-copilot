import React from 'react';
import { Search, Bot, Layers } from 'lucide-react';
import type { DemoScenario } from '../types';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  scenarios: DemoScenario[];
  onSelectScenario: (scenario: DemoScenario) => void;
  activeScenarioId?: string;
  onResetView: () => void;
  isCopilotOpen?: boolean;
  onToggleCopilot?: () => void;
  onOpenExecutiveBrief?: () => void;
  onSwitchToBI?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  scenarios: _scenarios,
  onSelectScenario: _onSelectScenario,
  activeScenarioId: _activeScenarioId,
  onResetView,
  isCopilotOpen,
  onToggleCopilot,
  onOpenExecutiveBrief,
  onSwitchToBI,
}) => {
  return (
    <header className="header-container">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Brand & Context */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onResetView}>
            <div className="w-8 h-8 rounded-[8px] bg-brand text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Layers size={17} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-ink">نفیس نخ</span>
                <span className="text-[11px] font-mono font-medium px-1.5 py-0.5 rounded-[4px] bg-brand-pale text-brand border border-brand-border">
                  COPAN AI
                </span>
              </div>
              <span className="text-[11px] text-ink-muted block -mt-0.5">
                سامانه هوش تجاری و تصمیم‌سازی فروش (Sales Intelligence)
              </span>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                className="input-field w-full pr-8 pl-3 text-xs rounded-[8px]"
                placeholder="جستجوی هوشمند مشتری، شناسه، شهر (مثال: CUST-008، C_773326)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Actions & AI Copilot Launcher */}
          <div className="flex items-center gap-2.5">
            {/* Switch to BI Dashboard Button */}
            {onSwitchToBI && (
              <button
                type="button"
                className="btn btn-sm bg-brand text-white hover:bg-brand-light shadow-xs"
                onClick={onSwitchToBI}
                title="مشاهده داشبورد تحلیلی هوش تجاری"
              >
                <span>داشبورد تحلیلی BI</span>
              </button>
            )}

            {/* Executive Report Button */}
            {onOpenExecutiveBrief && (
              <button
                type="button"
                className="btn btn-sm btn-secondary text-ink-secondary hover:text-ink hidden sm:inline-flex"
                onClick={onOpenExecutiveBrief}
                title="مشاهده و چاپ خلاصه گزارش یک‌صفحه‌ای مدیریتی"
              >
                <span>خلاصه گزارش مدیریتی</span>
              </button>
            )}

            {/* Live Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-ink-muted px-2.5 py-1 rounded-[6px] bg-surface-subtle border border-border-subtle">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              <span className="font-mono">DuckDB Active</span>
            </div>

            {/* AI Copilot CTA Button */}
            {onToggleCopilot && (
              <button
                type="button"
                className={`btn btn-sm rounded-[8px] ${
                  isCopilotOpen
                    ? 'btn-primary'
                    : 'bg-brand-pale text-brand border border-brand-border hover:bg-brand hover:text-white'
                }`}
                onClick={onToggleCopilot}
                title="باز کردن دستیار هوشمند فروش"
              >
                <Bot size={14} />
                <span className="font-semibold">دستیار هوشمند COPAN</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
