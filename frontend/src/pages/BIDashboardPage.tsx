import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  ShieldAlert,
  CreditCard,
  PieChart,
  Users,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Moon,
  Sun,
  ChevronLeft,
} from 'lucide-react';

interface BIDashboardPageProps {
  onSwitchToOperational?: () => void;
}

export const BIDashboardPage: React.FC<BIDashboardPageProps> = ({ onSwitchToOperational }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Scrollspy logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'revenue', 'profit', 'quality', 'payment', 'share', 'customers', 'insights'];
      const scrollPos = window.scrollY + 140;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'theme-dark bg-[#0b1d15] text-[#f2eee0]' : 'bg-[#f5f8f6] text-[#102419]'}`}>
      <div className="flex min-h-screen">
        {/* ============ SIDEBAR ============ */}
        <aside className={`w-64 shrink-0 p-6 sticky top-0 h-screen hidden lg:flex flex-col border-l transition-colors ${
          isDarkMode 
            ? 'bg-gradient-to-b from-[#0e2419] to-[#0a1a12] border-white/10 text-[#f2eee0]' 
            : 'bg-gradient-to-b from-white to-[#f0f6f2] border-[#e1ece5] text-[#102419] shadow-sm'
        }`}>
          {/* Brand */}
          <div className={`flex items-center gap-3 pb-5 mb-4 border-b ${isDarkMode ? 'border-white/10' : 'border-[#e1ece5]'}`}>
            <svg width="32" height="32" viewBox="0 0 30 30" fill="none">
              <circle cx="15" cy="6.2" r="2.5" fill={isDarkMode ? '#dcc888' : '#9d751b'} />
              <path
                d="M15 10c-6.5 0-10.5 5.4-10.5 11.2C4.5 24.7 8 27 15 27s10.5-2.3 10.5-5.8C25.5 15.4 21.5 10 15 10Z"
                stroke={isDarkMode ? '#f2eee0' : '#006937'}
                strokeWidth="1.8"
              />
            </svg>
            <div>
              <div className={`font-extrabold text-[17px] ${isDarkMode ? 'text-white' : 'text-[#06311f]'}`}>نفیس‌نخ</div>
              <div className={`text-[11px] font-medium ${isDarkMode ? 'text-white/40' : 'text-[#6e887a]'}`}>داشبورد هوش تجاری</div>
            </div>
          </div>

          <div className={`text-[11px] font-semibold px-2.5 mb-2 tracking-wider ${isDarkMode ? 'text-white/40' : 'text-[#6e887a]'}`}>
            نمای کلی
          </div>

          <nav className="flex flex-col gap-1">
            {[
              { id: 'overview', label: 'نمای کلی', icon: LayoutDashboard },
              { id: 'revenue', label: 'فروش و روند زمانی', icon: TrendingUp },
              { id: 'profit', label: 'سودآوری مشتریان', icon: DollarSign },
              { id: 'quality', label: 'شکایات و کیفیت', icon: ShieldAlert },
              { id: 'payment', label: 'وصول مطالبات', icon: CreditCard },
              { id: 'share', label: 'سهم از سبد مشتری', icon: PieChart },
              { id: 'customers', label: 'مشتریان برتر', icon: Users },
              { id: 'insights', label: 'بینش‌های کلیدی', icon: Lightbulb },
            ].map(({ id, label, icon: Icon }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollTo(id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all text-right cursor-pointer ${
                    isActive
                      ? isDarkMode
                        ? 'bg-[#173423] text-[#dcc888] font-bold border border-white/10'
                        : 'bg-[#e2efe7] text-[#006937] font-bold border border-[#c4ded0] shadow-xs'
                      : isDarkMode
                      ? 'text-white/60 hover:bg-[#173423]/60 hover:text-white'
                      : 'text-[#41594d] hover:bg-[#f1f6f3] hover:text-[#102419]'
                  }`}
                >
                  <Icon size={16} className={`shrink-0 ${isActive ? (isDarkMode ? 'text-[#dcc888]' : 'text-[#006937]') : 'opacity-70'}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          <div className={`my-4 h-px ${isDarkMode ? 'bg-white/10' : 'bg-[#e1ece5]'}`} />

          <div className={`text-[11px] font-semibold px-2.5 mb-1.5 tracking-wider ${isDarkMode ? 'text-white/40' : 'text-[#6e887a]'}`}>
            پوشش داده
          </div>
          <div className={`text-xs px-2.5 py-1.5 ${isDarkMode ? 'text-white/50' : 'text-[#6e887a]'}`}>
            ۲۰۱۹ – ۱۴۰۵ (شمسی ۱۳۹۸–۱۴۰۵)
          </div>

          <div className={`mt-auto pt-4 border-t ${isDarkMode ? 'border-white/10' : 'border-[#e1ece5]'}`}>
            <div className={`inline-flex items-center gap-2 text-[11px] font-semibold px-2.5 py-1 rounded-full border mb-2.5 ${
              isDarkMode
                ? 'text-[#dcc888] bg-[rgba(220,200,136,0.14)] border-[rgba(220,200,136,0.28)]'
                : 'text-[#9d751b] bg-[#9d751b]/10 border-[#9d751b]/25'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-[#dcc888]' : 'bg-[#9d751b]'}`} />
              داده آزمایشی / Test Data
            </div>
            <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-[#6e887a]'}`}>
              این محیط برای بازبینی ساختار بصری ساخته شده؛ اعداد از تحلیل دیتاست داخلی نفیس‌نخ استخراج شده‌اند.
            </p>
          </div>
        </aside>

        {/* ============ MAIN CONTENT ============ */}
        <main className="flex-1 min-w-0 p-6 sm:p-9 pb-20 max-w-[1360px]">
          {/* Topbar */}
          <div className="flex flex-wrap items-start justify-between gap-5 mb-7">
            <div>
              <h1 className={`text-2xl font-extrabold mb-1.5 ${isDarkMode ? 'text-white' : 'text-[#06311f]'}`}>
                نمای کلی عملکرد مشتریان و فروش
              </h1>
              <p className={`text-[13px] leading-relaxed max-w-2xl ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                یکپارچه‌سازی داده فروش، وصول، شکایات، کیفیت و روابط تجاری نفیس‌نخ — ساختار بصری داشبورد تحلیلی در حالت روشن (Light Mode).
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <div className={`text-xs px-3.5 py-2 rounded-full border flex items-center gap-1.5 font-medium shadow-xs ${
                isDarkMode ? 'bg-[#12291d] border-white/15 text-white/70' : 'bg-white border-[#cdded3] text-[#41594d]'
              }`}>
                <span>بازه:</span>
                <b className={isDarkMode ? 'text-white' : 'text-[#102419]'}>۱۳۹۸ تا ۱۴۰۵</b>
              </div>

              <div className={`text-xs px-3.5 py-2 rounded-full border flex items-center gap-1.5 font-semibold ${
                isDarkMode 
                  ? 'bg-[rgba(220,200,136,0.14)] border-[rgba(220,200,136,0.3)] text-[#dcc888]' 
                  : 'bg-[#9d751b]/10 border-[#9d751b]/30 text-[#9d751b]'
              }`}>
                <AlertTriangle size={13} />
                <span>نسخهٔ نمایشی</span>
              </div>

              {onSwitchToOperational && (
                <button
                  type="button"
                  onClick={onSwitchToOperational}
                  className={`text-xs px-3.5 py-2 rounded-full border font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
                    isDarkMode
                      ? 'bg-[#173423] text-[#f2eee0] border-white/20 hover:bg-[#1b3d28]'
                      : 'bg-[#006937] text-white border-transparent hover:bg-[#0d8449]'
                  }`}
                >
                  <span>ورود به سامانه عملیاتی و Copilot</span>
                  <ChevronLeft size={14} />
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
                  isDarkMode
                    ? 'bg-[#12291d] border-white/15 text-[#dcc888] hover:bg-[#173423]'
                    : 'bg-white border-[#cdded3] text-[#41594d] hover:bg-[#f1f6f3] hover:text-[#102419]'
                }`}
                title="تغییر تم"
              >
                {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
                <span className="hidden sm:inline">{isDarkMode ? 'تم روشن' : 'تم تاریک'}</span>
              </button>
            </div>
          </div>

          {/* ============ OVERVIEW (Hero Strip) ============ */}
          <section id="overview" className="mb-10">
            <div className={`rounded-2xl p-6 border flex flex-wrap lg:flex-nowrap items-stretch gap-4 sm:gap-0 overflow-x-auto shadow-sm ${
              isDarkMode
                ? 'bg-gradient-to-br from-[#1b3d28] to-[#12291d] border-white/15'
                : 'bg-gradient-to-br from-white to-[#f4faf6] border-[#cdded3]'
            }`}>
              <div className="flex-1 min-w-[140px] px-5 py-1">
                <div className={`text-3xl font-extrabold font-mono ${isDarkMode ? 'text-[#dcc888]' : 'text-[#006937]'}`}>۶۴۴</div>
                <div className={`text-xs mt-2 font-medium ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>مشتری فعال در پایگاه داده</div>
              </div>
              <div className={`hidden sm:block w-px my-1 ${isDarkMode ? 'bg-white/15' : 'bg-[#cdded3]'}`} />

              <div className="flex-1 min-w-[140px] px-5 py-1">
                <div className={`text-3xl font-extrabold font-mono ${isDarkMode ? 'text-[#dcc888]' : 'text-[#006937]'}`}>۶۴۶</div>
                <div className={`text-xs mt-2 font-medium ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>کد محصول در مسترِ کالا</div>
              </div>
              <div className={`hidden sm:block w-px my-1 ${isDarkMode ? 'bg-white/15' : 'bg-[#cdded3]'}`} />

              <div className="flex-1 min-w-[150px] px-5 py-1">
                <div className={`text-3xl font-extrabold font-mono ${isDarkMode ? 'text-[#dcc888]' : 'text-[#9d751b]'}`}>
                  ۴.۴۲<small className="text-[14px] font-sans mr-1 font-bold text-inherit">میلیارد</small>
                </div>
                <div className={`text-xs mt-2 font-medium ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                  درآمد تجمعی ثبت‌شده <span className="text-[#15803d] font-bold inline-flex items-center gap-0.5 mr-1">▲ ۷۸٪ از ۱۰٪ مشتریان</span>
                </div>
              </div>
              <div className={`hidden sm:block w-px my-1 ${isDarkMode ? 'bg-white/15' : 'bg-[#cdded3]'}`} />

              <div className="flex-1 min-w-[140px] px-5 py-1">
                <div className={`text-3xl font-extrabold font-mono ${isDarkMode ? 'text-[#dcc888]' : 'text-[#006937]'}`}>
                  ۱۰.۱<small className="text-[14px] font-sans mr-0.5 font-bold text-inherit">٪</small>
                </div>
                <div className={`text-xs mt-2 font-medium ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                  حاشیهٔ ناخالص ترکیبی <span className="text-[#c03425] font-bold inline-flex items-center gap-0.5 mr-1">▼ ۵۷ مشتری زیان‌ده</span>
                </div>
              </div>
              <div className={`hidden sm:block w-px my-1 ${isDarkMode ? 'bg-white/15' : 'bg-[#cdded3]'}`} />

              <div className="flex-1 min-w-[130px] px-5 py-1">
                <div className={`text-3xl font-extrabold font-mono ${isDarkMode ? 'text-[#dcc888]' : 'text-[#006937]'}`}>۲</div>
                <div className={`text-xs mt-2 font-medium ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                  سال بدون هیچ رکورد ثبت‌شده <span className="text-[#c03425] font-bold mr-1">۱۴۰۲–۱۴۰۳</span>
                </div>
              </div>
            </div>
          </section>

          {/* ============ REVENUE TIMELINE ============ */}
          <section id="revenue" className="mb-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
              <div>
                <span className={`text-[11.5px] font-bold tracking-wide block mb-1 ${isDarkMode ? 'text-[#8fae8a]' : 'text-[#006937]'}`}>
                  فروش و روند زمانی
                </span>
                <h2 className={`text-lg font-extrabold ${isDarkMode ? 'text-white' : 'text-[#06311f]'}`}>
                  روند درآمد سالانه — و شکاف کامل داده
                </h2>
              </div>
              <div className={`text-xs max-w-md text-left leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-[#6e887a]'}`}>
                مجموع «مبلغ کل» فروش به تفکیک سال میلادی. بین ۲۰۲۲ و ۲۰۲۵ هیچ رکوردی در هیچ‌یک از ۱۶ جدول دیتاست ثبت نشده است.
              </div>
            </div>

            <div className={`rounded-xl p-5 border relative shadow-sm ${
              isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'
            }`}>
              <svg className="w-full h-72 block overflow-visible" viewBox="0 0 1000 280" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaFillLightReact" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isDarkMode ? '#dcc888' : '#9d751b'} stopOpacity={isDarkMode ? 0.32 : 0.25} />
                    <stop offset="60%" stopColor={isDarkMode ? '#3d7a51' : '#006937'} stopOpacity={0.08} />
                    <stop offset="100%" stopColor={isDarkMode ? '#3d7a51' : '#006937'} stopOpacity={0} />
                  </linearGradient>
                  <pattern id="gapHatchReact" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="8" stroke={isDarkMode ? 'rgba(178,89,63,0.35)' : 'rgba(192,52,37,0.35)'} strokeWidth="2" />
                  </pattern>
                </defs>

                {/* Gridlines */}
                <g stroke={isDarkMode ? 'rgba(244,241,227,0.07)' : 'rgba(20,48,32,0.08)'} strokeWidth="1">
                  <line x1="0" y1="40" x2="1000" y2="40" />
                  <line x1="0" y1="100" x2="1000" y2="100" />
                  <line x1="0" y1="160" x2="1000" y2="160" />
                  <line x1="0" y1="220" x2="1000" y2="220" />
                </g>

                {/* Gap Zone */}
                <rect x="571" y="14" width="143" height="206" fill="url(#gapHatchReact)" rx="4" />
                <rect
                  x="571"
                  y="14"
                  width="143"
                  height="206"
                  fill="none"
                  stroke={isDarkMode ? 'rgba(178,89,63,0.4)' : 'rgba(192,52,37,0.4)'}
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  rx="4"
                />

                {/* Area & Line */}
                <path
                  d="M20,218 L163,215 L306,32 L449,4 L591,55 L734,214 L877,216 L980,220 L980,236 L20,236 Z"
                  fill="url(#areaFillLightReact)"
                />
                <path
                  d="M20,218 L163,215 L306,32 L449,4 L591,55 L734,214 L877,216 L980,220"
                  fill="none"
                  stroke={isDarkMode ? '#dcc888' : '#9d751b'}
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                {/* Points */}
                <g fill={isDarkMode ? '#0b1d15' : '#ffffff'} stroke={isDarkMode ? '#dcc888' : '#9d751b'} strokeWidth="2.5">
                  <circle cx="20" cy="218" r="4.5" />
                  <circle cx="163" cy="215" r="4.5" />
                  <circle cx="306" cy="32" r="5" />
                  <circle cx="449" cy="4" r="5" />
                  <circle cx="591" cy="55" r="4.5" />
                  <circle cx="734" cy="214" r="4.5" />
                  <circle cx="877" cy="216" r="4.5" />
                  <circle cx="980" cy="220" r="4.5" />
                </g>

                {/* Callout Line */}
                <line x1="734" y1="214" x2="734" y2="245" stroke={isDarkMode ? 'rgba(220,200,136,0.45)' : 'rgba(157,117,27,0.45)'} strokeWidth="1.2" strokeDasharray="2 2" />

                {/* Labels */}
                <g fontFamily="Vazirmatn" fontSize="13" fontWeight="600" fill={isDarkMode ? 'rgba(242,238,224,0.7)' : 'rgba(65,89,77,0.9)'}>
                  <text x="20" y="260" textAnchor="middle">۱۳۹۸</text>
                  <text x="163" y="260" textAnchor="middle">۱۳۹۹</text>
                  <text x="306" y="260" textAnchor="middle">۱۴۰۰</text>
                  <text x="449" y="260" textAnchor="middle">۱۴۰۱</text>
                  <text x="591" y="260" textAnchor="middle">۱۴۰۲*</text>
                  <text x="734" y="260" textAnchor="middle" fill={isDarkMode ? '#dcc888' : '#9d751b'} fontWeight="700">۱۴۰۳-۱۴۰۴</text>
                  <text x="877" y="260" textAnchor="middle">۱۴۰۴</text>
                  <text x="980" y="260" textAnchor="middle">۱۴۰۵</text>
                </g>
              </svg>

              <div className={`absolute top-4 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-2 rounded-full border shadow-sm ${
                isDarkMode 
                  ? 'bg-[rgba(178,89,63,0.16)] border-[rgba(178,89,63,0.35)] text-[#e8a58f]' 
                  : 'bg-[#fff3f0] border-[#c03425]/35 text-[#ab281b]'
              }`}>
                شکاف کامل داده در تمام ۱۶ جدول — صفر رکورد در ۲۰۲۳ و ۲۰۲۴ میلادی
              </div>

              <div className="flex flex-wrap gap-5 mt-4 pt-3 border-t border-inherit">
                <div className={`flex items-center gap-2 text-xs font-medium ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                  <span className={`w-2.5 h-2.5 rounded-xs ${isDarkMode ? 'bg-[#dcc888]' : 'bg-[#9d751b]'}`} />
                  درآمد سالانه (مقیاس نسبی)
                </div>
                <div className={`flex items-center gap-2 text-xs font-medium ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                  <span className={`w-2.5 h-2.5 rounded-xs ${isDarkMode ? 'bg-[#b2593f]' : 'bg-[#c03425]'}`} />
                  بازهٔ بدون داده
                </div>
                <div className={`flex items-center gap-2 text-xs font-medium ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                  <span className={`w-2.5 h-2.5 rounded-xs border ${isDarkMode ? 'bg-[#1b3d28] border-white/20' : 'bg-[#e5efe9] border-[#cdded3]'}`} />
                  ادامهٔ کم‌حجم پس از ۱۴۰۳ — فقط ۵۲ رکورد پایلوت ردیابی کیفیت
                </div>
              </div>
            </div>
          </section>

          {/* ============ PROFITABILITY ============ */}
          <section id="profit" className="mb-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
              <div>
                <span className={`text-[11.5px] font-bold tracking-wide block mb-1 ${isDarkMode ? 'text-[#8fae8a]' : 'text-[#006937]'}`}>
                  سودآوری مشتریان
                </span>
                <h2 className={`text-lg font-extrabold ${isDarkMode ? 'text-white' : 'text-[#06311f]'}`}>
                  درآمد در برابر حاشیهٔ سود
                </h2>
              </div>
              <div className={`text-xs max-w-md text-left leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-[#6e887a]'}`}>
                هزینه بر مبنای هزینهٔ تحقق‌یافته (۳۲٪ ردیف‌ها) و در نبود آن، برآورد محصول-ماه محاسبه شده است.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`rounded-xl p-5 border shadow-sm ${isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'}`}>
                <div className={`text-2xl font-extrabold font-mono ${isDarkMode ? 'text-[#dcc888]' : 'text-[#9d751b]'}`}>۷۸.۴٪</div>
                <div className={`text-xs mt-2 leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                  سهم ۱۰٪ برتر مشتریان از کل درآمد — تمرکز شدید درآمدی
                </div>
                <div className={`inline-flex items-center gap-1 text-[11.5px] font-semibold mt-3 px-2.5 py-1 rounded-full border ${
                  isDarkMode ? 'text-[#7bb17e] bg-[#7bb17e]/15 border-[#7bb17e]/30' : 'text-[#15803d] bg-[#15803d]/10 border-[#15803d]/20'
                }`}>
                  <ArrowUpRight size={13} />
                  ۶۴ مشتری از ۶۴۴
                </div>
              </div>

              <div className={`rounded-xl p-5 border shadow-sm ${isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'}`}>
                <div className={`text-2xl font-extrabold font-mono ${isDarkMode ? 'text-[#b2593f]' : 'text-[#c03425]'}`}>۵۷</div>
                <div className={`text-xs mt-2 leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                  مشتری با سود ناخالص منفی در کل دورهٔ فعالیت
                </div>
                <div className={`inline-flex items-center gap-1 text-[11.5px] font-semibold mt-3 px-2.5 py-1 rounded-full border ${
                  isDarkMode ? 'text-[#b2593f] bg-[#b2593f]/15 border-[#b2593f]/30' : 'text-[#c03425] bg-[#c03425]/10 border-[#c03425]/20'
                }`}>
                  <ArrowDownRight size={13} />
                  نیازمند بازبینی قیمت‌گذاری
                </div>
              </div>

              <div className={`rounded-xl p-5 border shadow-sm ${isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'}`}>
                <div className={`text-2xl font-extrabold font-mono ${isDarkMode ? 'text-white' : 'text-[#006937]'}`}>۳۰</div>
                <div className={`text-xs mt-2 leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                  مشتری «درآمد بالا / حاشیهٔ سود پایین» (چارک بالای درآمد و چارک پایین حاشیه)
                </div>
                <div className={`inline-flex items-center gap-1 text-[11.5px] font-semibold mt-3 px-2.5 py-1 rounded-full border ${
                  isDarkMode ? 'text-white/60 bg-white/5 border-white/10' : 'text-[#41594d] bg-[#f1f6f3] border-[#cdded3]'
                }`}>
                  فرصت بازنگری قرارداد
                </div>
              </div>

              <div className={`rounded-xl p-5 border shadow-sm ${isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'}`}>
                <div className={`text-2xl font-extrabold font-mono ${isDarkMode ? 'text-white' : 'text-[#102419]'}`}>۳۲.۶٪</div>
                <div className={`text-xs mt-2 leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                  سهم درآمدی خطوط فروش با هزینهٔ تحقق‌یافتهٔ واقعی؛ باقی متکی بر برآورد
                </div>
                <div className={`inline-flex items-center gap-1 text-[11.5px] font-semibold mt-3 px-2.5 py-1 rounded-full border ${
                  isDarkMode ? 'text-white/60 bg-white/5 border-white/10' : 'text-[#41594d] bg-[#f1f6f3] border-[#cdded3]'
                }`}>
                  پوشش هزینه محدود
                </div>
              </div>
            </div>

            {/* Bars */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <div className={`rounded-xl p-5 border shadow-sm ${isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#102419]'}`}>۵ مشتری برتر بر اساس درآمد</h3>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${isDarkMode ? 'bg-[#173423] border-white/10 text-white/50' : 'bg-[#f1f6f3] border-[#cdded3] text-[#6e887a]'}`}>
                    تومان / واحد پایه
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { id: 'C_937594', w: '100%', val: '۳۶۰.۶M' },
                    { id: 'C_245948', w: '87%', val: '۳۱۳.۶M' },
                    { id: 'C_633661', w: '60%', val: '۲۱۵.۳M' },
                    { id: 'C_535756', w: '46%', val: '۱۶۶.۸M' },
                    { id: 'C_683666', w: '42%', val: '۱۵۳.۰M' },
                  ].map((item) => (
                    <div key={item.id} className="grid grid-cols-[100px_1fr_60px] items-center gap-3">
                      <span className="text-xs font-mono font-medium text-right text-inherit opacity-80">{item.id}</span>
                      <div className={`h-2.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-[#f1f6f3] border border-[#e1ece5]'}`}>
                        <div className="h-full rounded-full bg-gradient-to-r from-[#386f4c] to-[#158f4a]" style={{ width: item.w }} />
                      </div>
                      <span className="text-xs font-mono font-bold text-left text-inherit">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`rounded-xl p-5 border shadow-sm ${isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#102419]'}`}>۵ مشتری با کمترین حاشیهٔ سود</h3>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${isDarkMode ? 'bg-[#173423] border-white/10 text-white/50' : 'bg-[#f1f6f3] border-[#cdded3] text-[#6e887a]'}`}>
                    درصد
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { id: 'C_672706', w: '100%', val: '−۲۰.۳٪' },
                    { id: 'C_265163', w: '95%', val: '−۱۹.۲٪' },
                    { id: 'C_571164', w: '63%', val: '−۱۲.۷٪' },
                    { id: 'C_530981', w: '56%', val: '−۱۱.۴٪' },
                    { id: 'C_237191', w: '56%', val: '−۱۱.۴٪' },
                  ].map((item) => (
                    <div key={item.id} className="grid grid-cols-[100px_1fr_60px] items-center gap-3">
                      <span className="text-xs font-mono font-medium text-right text-inherit opacity-80">{item.id}</span>
                      <div className={`h-2.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-[#f1f6f3] border border-[#e1ece5]'}`}>
                        <div className="h-full rounded-full bg-gradient-to-r from-[#e05344] to-[#c03425]" style={{ width: item.w }} />
                      </div>
                      <span className="text-xs font-mono font-bold text-left text-[#c03425]">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ============ QUALITY / COMPLAINTS ============ */}
          <section id="quality" className="mb-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
              <div>
                <span className={`text-[11.5px] font-bold tracking-wide block mb-1 ${isDarkMode ? 'text-[#8fae8a]' : 'text-[#006937]'}`}>
                  شکایات و کیفیت
                </span>
                <h2 className={`text-lg font-extrabold ${isDarkMode ? 'text-white' : 'text-[#06311f]'}`}>
                  ریشه‌یابی شکایت تا تولید
                </h2>
              </div>
              <div className={`text-xs max-w-md text-left leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-[#6e887a]'}`}>
                ۵۲۰ شکایت ثبت‌شده؛ زیرمجموعهٔ ۴۰ رکورد به‌طور کامل تا آزمایشگاه کیفیت قابل ردیابی است.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Donut Chart */}
              <div className={`rounded-xl p-5 border shadow-sm ${isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#102419]'}`}>توزیع شدت شکایت</h3>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${isDarkMode ? 'bg-[#173423] border-white/10 text-white/50' : 'bg-[#f1f6f3] border-[#cdded3] text-[#6e887a]'}`}>
                    ۵۲۰ رکورد
                  </span>
                </div>
                <div className="flex items-center gap-5">
                  <div
                    className="w-32 h-32 rounded-full shrink-0 relative shadow-sm"
                    style={{
                      background: 'conic-gradient(#c03425 0 6.5%, #b88d28 6.5% 31.7%, #1a786e 31.7% 56.9%, #15803d 56.9% 100%)',
                    }}
                  >
                    <div className={`absolute inset-4 rounded-full flex flex-col items-center justify-center ${isDarkMode ? 'bg-[#12291d]' : 'bg-white'}`}>
                      <div className={`text-lg font-mono font-extrabold ${isDarkMode ? 'text-white' : 'text-[#102419]'}`}>۳۴</div>
                      <div className={`text-[10px] font-semibold ${isDarkMode ? 'text-white/40' : 'text-[#6e887a]'}`}>بحرانی</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#c03425] shrink-0" />
                      <span>بحرانی — <b className="font-mono">۳۴</b> (۶.۵٪)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#b88d28] shrink-0" />
                      <span>زیاد — <b className="font-mono">۱۳۱</b> (۲۵.۲٪)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#1a786e] shrink-0" />
                      <span>متوسط — <b className="font-mono">۲۲۶</b> (۴۳.۵٪)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#15803d] shrink-0" />
                      <span>کم — <b className="font-mono">۱۲۹</b> (۲۴.۸٪)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Group Chart */}
              <div className={`rounded-xl p-5 border shadow-sm ${isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#102419]'}`}>شاخص شکایت به‌ازای گروه کالا</h3>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${isDarkMode ? 'bg-[#173423] border-white/10 text-white/50' : 'bg-[#f1f6f3] border-[#cdded3] text-[#6e887a]'}`}>
                    سهم شکایت ÷ درآمد
                  </span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    { name: 'گروه ۰۱', w: '100%', val: '×۲.۷۷', risk: true },
                    { name: 'گروه ۰۳', w: '56%', val: '×۱.۵۶', risk: true },
                    { name: 'گروه ۰۲', w: '46%', val: '×۱.۲۷', risk: false },
                    { name: 'گروه ۰۴', w: '27%', val: '×۰.۷۴', risk: false },
                    { name: 'گروه ۰۵', w: '20%', val: '×۰.۵۷', risk: false },
                  ].map((g) => (
                    <div key={g.name} className="grid grid-cols-[65px_1fr_45px] items-center gap-2.5 text-xs">
                      <span className="text-right opacity-80 font-medium">{g.name}</span>
                      <div className={`h-2.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-[#f1f6f3] border border-[#e1ece5]'}`}>
                        <div
                          className={`h-full rounded-full ${g.risk ? 'bg-gradient-to-r from-[#e05344] to-[#c03425]' : 'bg-gradient-to-r from-[#386f4c] to-[#158f4a]'}`}
                          style={{ width: g.w }}
                        />
                      </div>
                      <span className="font-mono font-bold text-left">{g.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality KPI Card */}
              <div className={`rounded-xl p-5 border shadow-sm flex flex-col justify-between ${isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'}`}>
                <div>
                  <div className={`text-2xl font-extrabold font-mono ${isDarkMode ? 'text-[#dcc888]' : 'text-[#9d751b]'}`}>
                    ۲۴.۷<small className="text-sm font-sans mr-1 font-bold">روز</small>
                  </div>
                  <div className={`text-xs mt-1.5 leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                    میانگین زمان رسیدگی به شکایات پذیرفته‌شده (میانه: ۲۴ روز)
                  </div>
                  <div className={`inline-flex text-[11px] font-semibold mt-2.5 px-2.5 py-0.5 rounded-full border ${
                    isDarkMode ? 'bg-white/5 border-white/10 text-white/60' : 'bg-[#f1f6f3] border-[#cdded3] text-[#41594d]'
                  }`}>
                    دامنه ۳ تا ۴۷ روز
                  </div>
                </div>

                <div className={`pt-4 mt-4 border-t ${isDarkMode ? 'border-white/10' : 'border-[#e1ece5]'}`}>
                  <div className={`text-xl font-extrabold font-mono ${isDarkMode ? 'text-white' : 'text-[#006937]'}`}>۹۹.۹۱٪</div>
                  <div className={`text-xs mt-1 leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                    نرخ قبولی آزمایش آزمایشگاه در کل رکوردهای کیفیت (۱۳,۸۵۳ از ۱۳,۸۶۵)
                  </div>
                </div>
              </div>
            </div>

            {/* Trace Chain Card */}
            <div className={`rounded-xl p-5 border shadow-sm mt-4 ${isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#102419]'}`}>نمونهٔ زنجیرهٔ ردیابی کامل — CMP-0001</h3>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${isDarkMode ? 'bg-[#173423] border-white/10 text-white/50' : 'bg-[#f1f6f3] border-[#cdded3] text-[#6e887a]'}`}>
                  شکایت ← فروش ← لات ← همبافت ← آزمایشگاه
                </span>
              </div>

              <div className="flex items-stretch gap-4 overflow-x-auto pb-2">
                {[
                  { k: 'شکایت', v: 'CMP-0001', v2: '«فیلامنت و پرز» · شدت: کم\nمشتری CUST-003 · محصول PRD-POY-001' },
                  { k: 'خط فروش', v: 'SL-CMP-000001', v2: 'فاکتور INV-000001 · مقدار ۴,۰۹۰\nمقدار برگشتی ۳۸۰ واحد' },
                  { k: 'لات تولید', v: 'LOT-CMP-6662179967', v2: 'تاریخ فروش ۱۴۰۴/۰۱/۰۵' },
                  { k: 'همبافت', v: 'HL-10FE7709AAB46FEE', v2: 'Hembaft_ID: 1173910000' },
                  { k: 'نتیجهٔ شکایت', v: 'پذیرفته‌شده ✓', v2: 'در ۱۷ روز رسیدگی شد', result: true },
                ].map((step, idx, arr) => (
                  <React.Fragment key={step.k}>
                    <div className={`flex-1 min-w-[170px] rounded-xl p-4 border relative shadow-xs ${
                      step.result
                        ? isDarkMode
                          ? 'bg-gradient-to-br from-[#dcc888]/15 to-[#173423] border-[#dcc888]/30'
                          : 'bg-gradient-to-br from-[#fefaf0] to-[#f2f8f4] border-[#9d751b]/35'
                        : isDarkMode
                        ? 'bg-[#173423] border-white/15'
                        : 'bg-[#f8fbf9] border-[#cdded3]'
                    }`}>
                      <div className={`text-[10.5px] font-bold mb-1.5 ${step.result ? (isDarkMode ? 'text-[#dcc888]' : 'text-[#9d751b]') : 'text-[#1a786e]'}`}>
                        {step.k}
                      </div>
                      <div className={`text-[13px] font-bold font-mono text-right dir-ltr ${step.result ? 'text-[#15803d] font-sans' : 'text-inherit'}`}>
                        {step.v}
                      </div>
                      <div className={`text-[11.5px] mt-1.5 leading-relaxed whitespace-pre-line ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                        {step.v2}
                      </div>
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="flex items-center text-lg font-bold text-inherit opacity-40 select-none">
                        ‹
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className={`text-xs mt-3 pt-3 border-t leading-relaxed ${isDarkMode ? 'border-white/10 text-white/60' : 'border-[#e1ece5] text-[#6e887a]'}`}>
                یافتهٔ آماری روی ۲۶ شکایتِ دارای رکورد آزمایشگاهی: وقتی نتیجهٔ آزمایشگاه «رد» بوده، شکایت در <b className={isDarkMode ? 'text-white' : 'text-[#102419]'}>۱۱ از ۱۱ مورد (۱۰۰٪)</b> پذیرفته شده؛ اما وقتی آزمایشگاه «قبول» بوده، همچنان <b className={isDarkMode ? 'text-white' : 'text-[#102419]'}>۹ از ۱۵ مورد (۶۰٪)</b> پذیرفته شده — یعنی بخش بزرگی از شکایات معتبر، ریشه در آزمایش‌های استاندارد کیفیت ندارند.
              </div>
            </div>
          </section>

          {/* ============ PAYMENT ============ */}
          <section id="payment" className="mb-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
              <div>
                <span className={`text-[11.5px] font-bold tracking-wide block mb-1 ${isDarkMode ? 'text-[#8fae8a]' : 'text-[#006937]'}`}>
                  وصول مطالبات
                </span>
                <h2 className={`text-lg font-extrabold ${isDarkMode ? 'text-white' : 'text-[#06311f]'}`}>
                  رفتار پرداخت مشتریان
                </h2>
              </div>
              <div className={`text-xs max-w-md text-left leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-[#6e887a]'}`}>
                بر پایهٔ ۱۵,۶۵۲ رویداد وصول برای ۶۳۱ مشتری.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`rounded-xl p-5 border shadow-sm ${isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'}`}>
                <div className={`text-2xl font-extrabold font-mono ${isDarkMode ? 'text-white' : 'text-[#006937]'}`}>
                  ۲۲.۸<small className="text-sm font-sans mr-1 font-bold">روز</small>
                </div>
                <div className={`text-xs mt-2 ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                  میانگین تأخیر پرداخت نسبت به سررسید
                </div>
              </div>

              <div className={`rounded-xl p-5 border shadow-sm ${isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'}`}>
                <div className={`text-2xl font-extrabold font-mono ${isDarkMode ? 'text-white' : 'text-[#102419]'}`}>
                  ۵۲<small className="text-sm font-sans mr-1 font-bold">روز</small>
                </div>
                <div className={`text-xs mt-2 ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                  بیشینهٔ تأخیر مشاهده‌شده در یک رویداد وصول
                </div>
              </div>

              <div className={`rounded-xl p-5 border shadow-sm ${isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'}`}>
                <div className={`text-2xl font-extrabold font-mono ${isDarkMode ? 'text-[#b2593f]' : 'text-[#c03425]'}`}>
                  ۰.۵۹٪
                </div>
                <div className={`text-xs mt-2 ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                  نرخ چک برگشتی از کل رویدادهای وصول (۹۳ رویداد)
                </div>
              </div>

              <div className={`rounded-xl p-5 border shadow-sm ${isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'}`}>
                <div className={`text-2xl font-extrabold font-mono ${isDarkMode ? 'text-white' : 'text-[#102419]'}`}>
                  ۶۴
                </div>
                <div className={`text-xs mt-2 ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                  مشتری با حداقل یک چک برگشتی (۱۰.۱٪ از مشتریان دارای وصول)
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-5 border shadow-sm mt-4 ${isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#102419]'}`}>همبستگی تأخیر پرداخت با سودآوری</h3>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${isDarkMode ? 'bg-[#173423] border-white/10 text-white/50' : 'bg-[#f1f6f3] border-[#cdded3] text-[#6e887a]'}`}>
                  ضریب همبستگی پیرسون
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { lbl: 'تأخیر ↔ حاشیهٔ سود', w: '14%', val: '۰.۱۴' },
                  { lbl: 'تأخیر ↔ درآمد', w: '2%', val: '۰.۰۲' },
                  { lbl: 'چک برگشتی ↔ حاشیهٔ سود', w: '1%', val: '۰.۰۱' },
                ].map((item) => (
                  <div key={item.lbl} className="grid grid-cols-[140px_1fr_45px] items-center gap-3 text-xs">
                    <span className="opacity-80 font-medium">{item.lbl}</span>
                    <div className={`h-2.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-[#f1f6f3] border border-[#e1ece5]'}`}>
                      <div className="h-full rounded-full bg-gradient-to-r from-[#386f4c] to-[#158f4a]" style={{ width: item.w }} />
                    </div>
                    <span className="font-mono font-bold text-left">{item.val}</span>
                  </div>
                ))}
              </div>
              <div className={`text-xs mt-3 pt-3 border-t ${isDarkMode ? 'border-white/10 text-white/60' : 'border-[#e1ece5] text-[#6e887a]'}`}>
                همبستگی ضعیف در هر سه مورد — یعنی ریسک پرداخت محوری مستقل از ارزش مشتری است و نباید صرفاً از روی حجم خرید پیش‌بینی شود.
              </div>
            </div>
          </section>

          {/* ============ BASKET SHARE ============ */}
          <section id="share" className="mb-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
              <div>
                <span className={`text-[11.5px] font-bold tracking-wide block mb-1 ${isDarkMode ? 'text-[#8fae8a]' : 'text-[#006937]'}`}>
                  سهم از سبد مشتری
                </span>
                <h2 className={`text-lg font-extrabold ${isDarkMode ? 'text-white' : 'text-[#06311f]'}`}>
                  روند سهم نفیس‌نخ در برابر رقبا
                </h2>
              </div>
              <div className={`text-xs max-w-md text-left leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-[#6e887a]'}`}>
                بر پایهٔ برآورد ۱۲ ماههٔ ۱۴۰۰/۰۴ تا ۱۴۰۱/۰۳ برای ۶۲۴ مشتری.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`rounded-xl p-5 border shadow-sm ${isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'}`}>
                <div className={`text-2xl font-extrabold font-mono ${isDarkMode ? 'text-white' : 'text-[#006937]'}`}>
                  ۱۲.۸<small className="text-sm font-sans mr-1 font-bold">٪</small>
                </div>
                <div className={`text-xs mt-2 ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                  میانگین سهم نفیس از خرید کل مشتری (میانه: ۷.۸٪)
                </div>
              </div>

              <div className={`rounded-xl p-5 border shadow-sm ${isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'}`}>
                <div className={`text-2xl font-extrabold font-mono ${isDarkMode ? 'text-[#b2593f]' : 'text-[#c03425]'}`}>
                  −۶.۳<small className="text-sm font-sans mr-1 font-bold">واحد</small>
                </div>
                <div className={`text-xs mt-2 ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                  میانگین افت سهم از نیمهٔ اول به نیمهٔ دوم بازه
                </div>
                <div className={`inline-flex items-center gap-1 text-[11.5px] font-semibold mt-3 px-2.5 py-0.5 rounded-full border ${
                  isDarkMode ? 'text-[#b2593f] bg-[#b2593f]/15 border-[#b2593f]/30' : 'text-[#c03425] bg-[#c03425]/10 border-[#c03425]/20'
                }`}>
                  <ArrowDownRight size={13} />
                  ۲۵۹ مشتری با افت بیش از ۵ واحد
                </div>
              </div>

              <div className={`rounded-xl p-5 border shadow-sm ${isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'}`}>
                <div className={`text-2xl font-extrabold font-mono ${isDarkMode ? 'text-[#dcc888]' : 'text-[#9d751b]'}`}>
                  ۱۷۳
                </div>
                <div className={`text-xs mt-2 ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                  مشتری «ارزش بالا / سهم پایین» — بالای میانهٔ درآمد اما سهم زیر ۳۰٪
                </div>
                <div className={`inline-flex items-center gap-1 text-[11.5px] font-semibold mt-3 px-2.5 py-0.5 rounded-full border ${
                  isDarkMode ? 'text-[#7bb17e] bg-[#7bb17e]/15 border-[#7bb17e]/30' : 'text-[#15803d] bg-[#15803d]/10 border-[#15803d]/20'
                }`}>
                  <ArrowUpRight size={13} />
                  فرصت رشد سهم بازار
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-5 border shadow-sm mt-4 ${isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#102419]'}`}>رقیب اصلی گزارش‌شده در برآوردهای سهم بازار</h3>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { name: 'تأمین‌کنندهٔ محلی', w: '100%', count: '۳۹' },
                  { name: 'رقیب Y', w: '92%', count: '۳۶' },
                  { name: 'رقیب X', w: '87%', count: '۳۴' },
                  { name: 'رقیب Z', w: '54%', count: '۲۱' },
                ].map((item) => (
                  <div key={item.name} className="grid grid-cols-[130px_1fr_45px] items-center gap-3 text-xs">
                    <span className="opacity-80 font-medium">{item.name}</span>
                    <div className={`h-2.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-[#f1f6f3] border border-[#e1ece5]'}`}>
                      <div className="h-full rounded-full bg-gradient-to-r from-[#386f4c] to-[#158f4a]" style={{ width: item.w }} />
                    </div>
                    <span className="font-mono font-bold text-left">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ============ CUSTOMERS TABLE ============ */}
          <section id="customers" className="mb-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
              <div>
                <span className={`text-[11.5px] font-bold tracking-wide block mb-1 ${isDarkMode ? 'text-[#8fae8a]' : 'text-[#006937]'}`}>
                  مشتریان برتر
                </span>
                <h2 className={`text-lg font-extrabold ${isDarkMode ? 'text-white' : 'text-[#06311f]'}`}>
                  فهرست مشتریان کلیدی
                </h2>
              </div>
              <div className={`text-xs max-w-md text-left leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-[#6e887a]'}`}>
                مرتب‌شده بر اساس درآمد تجمعی؛ داده نمایشی برای بررسی چیدمان جدول.
              </div>
            </div>

            <div className={`rounded-xl border overflow-x-auto shadow-sm ${isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'}`}>
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className={`border-b ${isDarkMode ? 'border-white/10 bg-[#173423]' : 'border-[#cdded3] bg-[#fbfdfc]'}`}>
                    <th className="py-3.5 px-4 font-bold opacity-70">شناسه مشتری</th>
                    <th className="py-3.5 px-4 font-bold opacity-70">سگمنت</th>
                    <th className="py-3.5 px-4 font-bold opacity-70">درآمد (تومان)</th>
                    <th className="py-3.5 px-4 font-bold opacity-70">سود ناخالص</th>
                    <th className="py-3.5 px-4 font-bold opacity-70">حاشیه</th>
                    <th className="py-3.5 px-4 font-bold opacity-70">تعداد فاکتور</th>
                    <th className="py-3.5 px-4 font-bold opacity-70">وضعیت</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-[#e1ece5]'}`}>
                  {[
                    { id: 'C_937594', seg: 'A', rev: '۳۶۰,۵۵۲,۲۴۲', gp: '۲۵,۲۳۸,۹۳۰', margin: '۷.۰٪', count: '۳۷۰', active: true },
                    { id: 'C_245948', seg: 'A', rev: '۳۱۳,۶۲۶,۰۹۳', gp: '۵۰,۴۵۲,۶۲۸', margin: '۱۶.۱٪', count: '۳۰۴', active: true },
                    { id: 'C_633661', seg: 'A', rev: '۲۱۵,۳۰۵,۲۶۶', gp: '۲۸,۵۱۴,۵۸۶', margin: '۱۳.۲٪', count: '۳۲۰', active: true },
                    { id: 'C_535756', seg: 'B', rev: '۱۶۶,۷۹۸,۷۳۰', gp: '۱۵,۴۴۰,۵۳۰', margin: '۹.۳٪', count: '۱۹۷', active: false },
                    { id: 'C_683666', seg: 'A', rev: '۱۵۳,۰۴۶,۷۶۶', gp: '۱۵,۴۱۲,۶۸۹', margin: '۱۰.۱٪', count: '۲۶۴', active: true },
                    { id: 'C_050237', seg: 'B', rev: '۱۳۰,۷۳۰,۰۸۰', gp: '۱۲,۳۰۸,۱۹۳', margin: '۹.۴٪', count: '۱۲۱', active: true },
                    { id: 'C_051535', seg: 'C', rev: '۱۱۸,۳۳۹,۲۶۹', gp: '۱۳,۸۵۳,۲۹۸', margin: '۱۱.۷٪', count: '۱۲۲', active: false },
                    { id: 'C_299317', seg: 'B', rev: '۹۰,۱۲۰,۰۳۱', gp: '۱۰,۱۹۳,۱۵۵', margin: '۱۱.۳٪', count: '۵۷', active: true },
                  ].map((row) => (
                    <tr key={row.id} className={`transition-colors ${isDarkMode ? 'hover:bg-[#173423]' : 'hover:bg-[#f1f6f3]'}`}>
                      <td className="py-3.5 px-4 font-mono font-bold text-inherit">{row.id}</td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          row.seg === 'A'
                            ? isDarkMode ? 'bg-[#dcc888]/15 text-[#dcc888] border-[#dcc888]/30' : 'bg-[#9d751b]/10 text-[#8e6a18] border-[#9d751b]/25'
                            : row.seg === 'B'
                            ? isDarkMode ? 'bg-[#6f9b93]/20 text-[#6f9b93] border-[#6f9b93]/30' : 'bg-[#1a786e]/10 text-[#14625a] border-[#1a786e]/20'
                            : isDarkMode ? 'bg-white/10 text-white/70 border-white/20' : 'bg-black/5 text-[#41594d] border-[#cdded3]'
                        }`}>
                          {row.seg}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-inherit">{row.rev}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-inherit">{row.gp}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-inherit">{row.margin}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-inherit">{row.count}</td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                          row.active
                            ? isDarkMode ? 'bg-[#7bb17e]/15 text-[#7bb17e] border-[#7bb17e]/30' : 'bg-[#15803d]/10 text-[#15803d] border-[#15803d]/20'
                            : isDarkMode ? 'bg-[#b2593f]/15 text-[#b2593f] border-[#b2593f]/30' : 'bg-[#c03425]/10 text-[#c03425] border-[#c03425]/20'
                        }`}>
                          {row.active ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
                          {row.active ? 'فعال' : 'غیرفعال'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ============ INSIGHTS ============ */}
          <section id="insights" className="mb-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
              <div>
                <span className={`text-[11.5px] font-bold tracking-wide block mb-1 ${isDarkMode ? 'text-[#8fae8a]' : 'text-[#006937]'}`}>
                  بینش‌های کلیدی
                </span>
                <h2 className={`text-lg font-extrabold ${isDarkMode ? 'text-white' : 'text-[#06311f]'}`}>
                  یافته‌های قابل اثبات از داده
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`rounded-xl p-5 border relative shadow-sm overflow-hidden ${
                isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'
              }`}>
                <div className="absolute top-0 right-0 w-1 h-full bg-[#c03425]" />
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isDarkMode ? 'text-[#b2593f] bg-[#b2593f]/15 border-[#b2593f]/30' : 'text-[#c03425] bg-[#c03425]/10 border-[#c03425]/30'
                }`}>
                  Fact
                </span>
                <div className={`text-sm font-bold mt-2.5 mb-1.5 ${isDarkMode ? 'text-white' : 'text-[#102419]'}`}>
                  شکاف کامل ۲ سالهٔ داده در تمام جداول
                </div>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                  در ۱۴۰۲ و ۱۴۰۳ (۲۰۲۳–۲۰۲۴ میلادی) هیچ رکوردی در هیچ‌یک از ۱۶ جدول دیتاست — از فروش تا CRM — ثبت نشده است.
                </p>
                <div className={`text-[11px] mt-3 pt-2.5 border-t ${isDarkMode ? 'border-white/10 text-white/40' : 'border-[#e1ece5] text-[#6e887a]'}`}>
                  منبع: مقایسهٔ سال تقویمی تمام ستون‌های تاریخ در ۱۳ شیت
                </div>
              </div>

              <div className={`rounded-xl p-5 border relative shadow-sm overflow-hidden ${
                isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'
              }`}>
                <div className="absolute top-0 right-0 w-1 h-full bg-[#9d751b]" />
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isDarkMode ? 'text-[#dcc888] bg-[#dcc888]/15 border-[#dcc888]/30' : 'text-[#9d751b] bg-[#9d751b]/10 border-[#9d751b]/30'
                }`}>
                  Fact
                </span>
                <div className={`text-sm font-bold mt-2.5 mb-1.5 ${isDarkMode ? 'text-white' : 'text-[#102419]'}`}>
                  شکایت پس از رد آزمایشگاه، همیشه پذیرفته می‌شود
                </div>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                  در نمونهٔ ردیابی‌شدهٔ کامل، هر شکایتی که با نتیجهٔ آزمایشگاهی «رد» همراه بوده، ۱۰۰٪ مواقع پذیرفته شده است.
                </p>
                <div className={`text-[11px] mt-3 pt-2.5 border-t ${isDarkMode ? 'border-white/10 text-white/40' : 'border-[#e1ece5] text-[#6e887a]'}`}>
                  منبع: تقاطع کیفیت_لات × اتصال_شکایت (n=۲۶)
                </div>
              </div>

              <div className={`rounded-xl p-5 border relative shadow-sm overflow-hidden ${
                isDarkMode ? 'bg-[#12291d] border-white/10' : 'bg-white border-[#e1ece5]'
              }`}>
                <div className="absolute top-0 right-0 w-1 h-full bg-[#c03425]" />
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isDarkMode ? 'text-[#b2593f] bg-[#b2593f]/15 border-[#b2593f]/30' : 'text-[#c03425] bg-[#c03425]/10 border-[#c03425]/30'
                }`}>
                  Inference
                </span>
                <div className={`text-sm font-bold mt-2.5 mb-1.5 ${isDarkMode ? 'text-white' : 'text-[#102419]'}`}>
                  افت سهم بازار در بیش از ۴۰٪ مشتریان
                </div>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-[#41594d]'}`}>
                  ۲۵۹ از ۶۲۴ مشتری، طی تنها ۶ ماه بیش از ۵ واحد درصد از سهم نفیس در سبد خریدشان را از دست داده‌اند.
                </p>
                <div className={`text-[11px] mt-3 pt-2.5 border-t ${isDarkMode ? 'border-white/10 text-white/40' : 'border-[#e1ece5] text-[#6e887a]'}`}>
                  منبع: شیت سهم_سبد، مقایسهٔ نیمهٔ اول با دوم
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className={`pt-5 border-t flex flex-wrap justify-between gap-3 text-xs ${isDarkMode ? 'border-white/10 text-white/40' : 'border-[#e1ece5] text-[#6e887a]'}`}>
            <p>داشبورد هوش تجاری — طراحی رابط کاربری بر پایهٔ هویت بصری نفیس‌نخ (nafisnakh.com). تمام اعداد از تحلیل داخلی دیتاست استخراج شده‌اند.</p>
            <p>© ۱۴۰۵ نفیس‌نخ · نسخهٔ نمایشی، صرفاً جهت بررسی UI</p>
          </footer>
        </main>
      </div>
    </div>
  );
};
