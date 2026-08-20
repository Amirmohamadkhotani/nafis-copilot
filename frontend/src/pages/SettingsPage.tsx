import React, { useState } from 'react';
import {
  CheckCircle2,
  RefreshCw,
  Cpu,
  Percent,
} from 'lucide-react';
import { useCopan } from '../context/CopanContext';
import { COPAN_SETTINGS_DATA } from '../data/copanIntelligence';

export const SettingsPage: React.FC = () => {
  const {
    installmentProfitRatePct,
    setInstallmentProfitRatePct,
  } = useCopan();

  const [activeTab, setActiveTab] = useState<'sources' | 'reports' | 'ai'>('sources');
  const [riskThreshold, setRiskThreshold] = useState(80);
  const [oppThreshold, setOppThreshold] = useState(75);
  const [tempRate, setTempRate] = useState(installmentProfitRatePct);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1200);
  };

  const handleSaveSettings = () => {
    setInstallmentProfitRatePct(tempRate);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="copan-card space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--hair)]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-[16px] text-[var(--text)]">
                تنظیمات سیستم، راهبری داده‌ها و هوش مصنوعی
              </h2>
              <span className="copan-badge badge-brand text-[11px]">System Governance</span>
            </div>
            <p className="text-[11.5px] text-[var(--text-faint)] mt-0.5">
              پیکربندی خطوط همگام‌سازی ERP/CRM/QMS، زمان‌بندی گزارشات خودکار و آستانه‌های مدل‌های عاملی
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center bg-[var(--panel-2)] p-1 rounded-xl border border-[var(--hair)] text-[12px]">
            <button
              onClick={() => setActiveTab('sources')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'sources'
                  ? 'bg-[var(--gold)] text-[#081610] shadow-xs'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              پایگاه‌های داده و همگام‌سازی
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'reports'
                  ? 'bg-[var(--gold)] text-[#081610] shadow-xs'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              زمان‌بندی گزارشات دوره‌ای
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'ai'
                  ? 'bg-[var(--gold)] text-[#081610] shadow-xs'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              پارامترها و آستانه‌های هوش مصنوعی
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Data Sources & Sync */}
      {activeTab === 'sources' && (
        <div className="copan-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--hair)]">
            <div>
              <h3 className="font-extrabold text-[15px] text-[var(--text)]">
                وضعیت سلامت و پوشش داده‌های سامانه‌ها (Data Sources Health)
              </h3>
              <p className="text-[11.5px] text-[var(--text-faint)]">
                اتصال مستقیم ۷ پایگاه داده تخصصی سازمان به لایه دانشی COPAN
              </p>
            </div>
            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="copan-btn copan-btn-primary text-[12px] font-bold"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'در حال همگام‌سازی...' : 'همگام‌سازی کامل پایگاه‌ها'}</span>
            </button>
          </div>

          {syncSuccess && (
            <div className="p-3 rounded-xl bg-[var(--positive-soft)] border border-green-500/30 text-[12px] text-[var(--positive)] font-bold flex items-center gap-2">
              <CheckCircle2 size={16} />
              همگام‌سازی کلیه جداول DuckDB با موفقیت انجام شد. کلیه شاخص‌های ریسک و فرصت به‌روز شدند.
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-[var(--hair)]">
            <table className="copan-table">
              <thead>
                <tr>
                  <th>سامانه و جدول منبع</th>
                  <th>وضعیت اتصال</th>
                  <th>آخرین همگام‌سازی</th>
                  <th>تعداد رکوردها</th>
                  <th>پوشش فیلدها</th>
                  <th>سلامت کیفیت</th>
                </tr>
              </thead>
              <tbody>
                {COPAN_SETTINGS_DATA.data_sources.map((src, idx) => (
                  <tr key={idx}>
                    <td className="font-bold text-[var(--text)]">{src.name}</td>
                    <td>
                      <span className="copan-badge badge-positive flex items-center gap-1 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--positive)] animate-pulse" />
                        {src.status}
                      </span>
                    </td>
                    <td className="text-[11.5px] text-[var(--text-dim)]">{src.last_sync}</td>
                    <td className="font-mono font-bold text-[var(--text)]">
                      {src.records_count.toLocaleString('fa-IR')}
                    </td>
                    <td className="font-mono">{src.coverage_pct}٪</td>
                    <td>
                      <span
                        className={`copan-badge ${
                          src.health === 'Optimal' ? 'badge-positive' : 'badge-gold'
                        }`}
                      >
                        {src.health === 'Optimal' ? 'عالی / بدون خطا' : 'نیازمند بررسی'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Report Schedules */}
      {activeTab === 'reports' && (
        <div className="copan-card space-y-4">
          <div className="pb-3 border-b border-[var(--hair)]">
            <h3 className="font-extrabold text-[15px] text-[var(--text)]">
              زمان‌بندی صدور گزارشات هوشمند تجاری (Automated Reporting)
            </h3>
            <p className="text-[11.5px] text-[var(--text-faint)]">
              تولید و ارسال خودکار گزارشات تحلیلی هفتگی، ماهانه، ۳ ماهه، ۶ ماهه و سالانه
            </p>
          </div>

          <div className="space-y-3">
            {COPAN_SETTINGS_DATA.report_schedules.map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="copan-badge badge-gold font-bold">{rep.frequency}</span>
                    <span className="font-bold text-[14px] text-[var(--text)]">{rep.title}</span>
                  </div>
                  <div className="text-[11.5px] text-[var(--text-dim)] mt-1">
                    دریافت‌کنندگان: <b>{rep.recipients}</b>
                  </div>
                  <div className="text-[10.5px] text-[var(--text-faint)] font-mono mt-0.5">
                    آخرین ارسال: {rep.last_sent} • موعد بعدی: {rep.next_run}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="copan-badge badge-positive text-[11px]">فعال</span>
                  <button className="copan-btn copan-btn-secondary copan-btn-sm text-[11.5px]">
                    ارسال آنی نمونه
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: AI Configuration */}
      {activeTab === 'ai' && (
        <div className="copan-card space-y-5">
          <div className="pb-3 border-b border-[var(--hair)]">
            <h3 className="font-extrabold text-[15px] text-[var(--text)]">
              تنظیمات حساسیت الگوریتم‌ها و آستانه‌های ریسک (AI Parameters)
            </h3>
            <p className="text-[11.5px] text-[var(--text-faint)]">
              تنظیم وزن‌های مدل رتبه‌بندی، آستانه حساسیت هشدارهای P0 و ضوابط محاسبه سود اقساطی
            </p>
          </div>

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-[var(--positive-soft)] border border-green-500/30 text-[12px] text-[var(--positive)] font-bold flex items-center gap-2">
              <CheckCircle2 size={16} />
              تنظیمات با موفقیت در پایگاه داده ذخیره شد و محاسبات سودآوری کلیه مشتریان بازسنجی گردید.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Sliders */}
            <div className="space-y-4 text-right text-[12.5px]">
              <div>
                <div className="flex justify-between font-bold text-[var(--text)] mb-1.5">
                  <span>آستانه شاخص ریسک بحرانی (P0 Risk Cutoff):</span>
                  <span className="font-mono text-[var(--risk)]">{riskThreshold} / ۱۰۰</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={riskThreshold}
                  onChange={(e) => setRiskThreshold(Number(e.target.value))}
                  className="w-full accent-[var(--risk)] cursor-pointer"
                />
                <p className="text-[10.5px] text-[var(--text-faint)] mt-1">
                  حساب‌های با ریسک بالاتر از {riskThreshold} بلافاصله به عنوان وظیفه بحرانی (P0) در اولویت‌ها ثبت می‌شوند.
                </p>
              </div>

              <div>
                <div className="flex justify-between font-bold text-[var(--text)] mb-1.5">
                  <span>حداقل شاخص فرصت رشد برای پیگیری فعال:</span>
                  <span className="font-mono text-[var(--gold)]">{oppThreshold} / ۱۰۰</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={oppThreshold}
                  onChange={(e) => setOppThreshold(Number(e.target.value))}
                  className="w-full accent-[var(--gold)] cursor-pointer"
                />
              </div>

              {/* Installment Rule Parameter */}
              <div className="p-3.5 rounded-xl bg-[var(--panel-2)] border border-[var(--gold)]/30 space-y-2 text-[11.5px]">
                <div className="flex items-center justify-between font-bold text-[var(--gold)]">
                  <span className="flex items-center gap-1.5">
                    <Percent size={14} />
                    نرخ سود مصوب خریدهای اقساطی:
                  </span>
                  <span className="font-mono text-[13px] bg-[var(--panel)] px-2 py-0.5 rounded-md border border-[var(--hair)]">
                    +{tempRate.toFixed(1)}٪
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="10.0"
                  step="0.5"
                  value={tempRate}
                  onChange={(e) => setTempRate(parseFloat(e.target.value))}
                  className="w-full accent-[var(--gold)] cursor-pointer"
                />
                <p className="text-[10.5px] text-[var(--text-dim)] leading-relaxed">
                  سود ناخالص خریدهای اقساطی بر اساس فرمول: <code>Margin_Base + {tempRate.toFixed(1)}%</code> محاسبه می‌شود.
                </p>
              </div>
            </div>

            {/* Right: Engine Details */}
            <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] space-y-3 text-[12px] flex flex-col justify-between">
              <div className="space-y-2">
                <div className="font-bold text-[var(--text)] flex items-center gap-1.5">
                  <Cpu size={16} className="text-[var(--gold)]" />
                  مشخصات موتور هوش مصنوعی فعال:
                </div>
                <div className="space-y-2 text-[11.5px] text-[var(--text-dim)]">
                  <div>مدل پردازشی: <b>COBAT Agentic Decision Framework</b></div>
                  <div>پایگاه داده رابطه‌ای معنایی: <b>DuckDB Deterministic Engine</b></div>
                  <div>حالت استخراج شواهد: <b>Strict Evidence-First Mode (فعال)</b></div>
                  <div>تولید خودکار اقدام بعدی: <b>Autonomous NBA Synthesis (فعال)</b></div>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--hair)] flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  className="copan-btn copan-btn-primary text-[12px] font-bold py-2 px-5"
                >
                  ذخیره و اعمال تنظیمات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
