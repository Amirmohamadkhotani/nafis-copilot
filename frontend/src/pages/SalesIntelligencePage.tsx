import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Bot,
} from 'lucide-react';
import type { PageId } from '../components/layout/Sidebar';
import {
  COPAN_SALES_INTELLIGENCE,
} from '../data/copanIntelligence';

interface SalesIntelligencePageProps {
  onNavigate: (page: PageId) => void;
  onSelectCustomer: (customerId: string) => void;
  onOpenCobat: (prompt?: string) => void;
}

const COLOR_PALETTE = ['#dcc888', '#22c55e', '#1a786e', '#386f4c', '#e05344', '#b88d28'];

export const SalesIntelligencePage: React.FC<SalesIntelligencePageProps> = ({
  onNavigate,
  onSelectCustomer,
  onOpenCobat,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header & Pareto Callout */}
      <div className="copan-card space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--hair)]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-[16px] text-[var(--text)]">
                تحلیل جامع فروش و ساختار سودآوری (Sales Intelligence)
              </h2>
              <span className="copan-badge badge-gold text-[11px]">Analytical Workspace</span>
            </div>
            <p className="text-[11.5px] text-[var(--text-faint)] mt-0.5">
              واکاوی چندبعدی مشتریان در حال رشد و افت، تمرکز درآمدی پارتو و خانواده‌های کالایی
            </p>
          </div>

          <button
            onClick={() => onOpenCobat('تحلیل علل اصلی افت فروش و راهکارهای افزایش حاشیه سود چیست؟')}
            className="copan-btn copan-btn-gold text-[12px] font-bold"
          >
            <Bot size={15} />
            تحلیل هوشمند فروش با COBAT
          </button>
        </div>

        {/* Pareto Concentration Callout Strip */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--gold-soft)] to-[var(--panel-2)] border border-[var(--gold)]/30 grid grid-cols-1 md:grid-cols-4 gap-4 text-right">
          <div>
            <div className="text-[11px] text-[var(--text-faint)]">تمرکز فروش (قانون پارتو)</div>
            <div className="font-mono font-extrabold text-[20px] text-[var(--gold)] mt-0.5">
              ۷۸.۴٪ <small className="text-[12px] font-sans font-bold text-[var(--text)]">از ۱۰٪ مشتریان</small>
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[var(--text-faint)]">تعداد کل مشتریان ثبت‌شده</div>
            <div className="font-mono font-extrabold text-[20px] text-[var(--text)] mt-0.5">
              ۶۴۴ حساب
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[var(--text-faint)]">مشتریان با خرید فعال دوره</div>
            <div className="font-mono font-extrabold text-[20px] text-[var(--positive)] mt-0.5">
              ۲۴۸ مشتری
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[var(--text-faint)]">مشتریان با حاشیه سود منفی/پایین</div>
            <div className="font-mono font-extrabold text-[20px] text-[var(--risk)] mt-0.5">
              ۵۷ حساب زیان‌ده
            </div>
          </div>
        </div>
      </div>

      {/* Growing vs Declining Cohorts Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growing Customers */}
        <div className="copan-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--hair)]">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[var(--positive-soft)] text-[var(--positive)]">
                <TrendingUp size={17} />
              </span>
              <div>
                <h3 className="font-extrabold text-[14.5px] text-[var(--text)]">
                  مشتریان با بالاترین نرخ رشد دوره‌ای (Growing Cohort)
                </h3>
                <p className="text-[11px] text-[var(--text-faint)]">افزایش چشمگیر حجم و ارزش سفارشات</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[var(--hair)]">
            <table className="copan-table">
              <thead>
                <tr>
                  <th>مشتری</th>
                  <th>سگمنت</th>
                  <th>فروش دوره (م.ر)</th>
                  <th>نرخ رشد</th>
                  <th>حاشیه سود</th>
                </tr>
              </thead>
              <tbody>
                {COPAN_SALES_INTELLIGENCE.growing_customers.map((c) => (
                  <tr
                    key={c.customer_id}
                    onClick={() => {
                      onSelectCustomer(c.customer_id);
                      onNavigate('customer_360');
                    }}
                    className="cursor-pointer"
                  >
                    <td className="font-bold text-[var(--text)]">{c.name}</td>
                    <td>
                      <span className="copan-badge badge-gold">سگمنت {c.segment}</span>
                    </td>
                    <td className="font-mono font-bold text-[var(--text)]">
                      {(c.current_sales / 1000000).toFixed(0)}
                    </td>
                    <td className="font-mono font-bold text-[var(--positive)]">
                      +{c.growth_pct}%
                    </td>
                    <td className="font-mono">{c.margin_pct}٪</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Declining Customers */}
        <div className="copan-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--hair)]">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[var(--risk-soft)] text-[var(--risk)]">
                <TrendingDown size={17} />
              </span>
              <div>
                <h3 className="font-extrabold text-[14.5px] text-[var(--text)]">
                  مشتریان با بیشترین افت خرید (Declining Cohort)
                </h3>
                <p className="text-[11px] text-[var(--text-faint)]">نیازمند عارضه‌یابی و مداخله سریع</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[var(--hair)]">
            <table className="copan-table">
              <thead>
                <tr>
                  <th>مشتری</th>
                  <th>فروش (م.ر)</th>
                  <th>میزان افت</th>
                  <th>علت شناسایی‌شده</th>
                </tr>
              </thead>
              <tbody>
                {COPAN_SALES_INTELLIGENCE.declining_customers.map((c) => (
                  <tr
                    key={c.customer_id}
                    onClick={() => {
                      onSelectCustomer(c.customer_id);
                      onNavigate('customer_360');
                    }}
                    className="cursor-pointer"
                  >
                    <td className="font-bold text-[var(--text)]">{c.name}</td>
                    <td className="font-mono font-bold text-[var(--text)]">
                      {(c.current_sales / 1000000).toFixed(0)}
                    </td>
                    <td className="font-mono font-bold text-[var(--risk)]">
                      {c.growth_pct}%
                    </td>
                    <td className="text-[11px] text-[var(--text-dim)]">{c.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Product Family Breakdown & Color Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Product Families Bar & Table */}
        <div className="lg:col-span-2 copan-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--hair)]">
            <div>
              <h3 className="font-extrabold text-[15px] text-[var(--text)]">
                عملکرد خانواده‌های کالایی (Product Families Breakdown)
              </h3>
              <p className="text-[11.5px] text-[var(--text-faint)]">
                سهم درآمدی، حاشیه سود و روند تقاضا در ۶ خانواده اصلی
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[var(--hair)]">
            <table className="copan-table">
              <thead>
                <tr>
                  <th>خانواده کالا</th>
                  <th>سهم از کل فروش</th>
                  <th>درآمد کل (م.ر)</th>
                  <th>حاشیه سود</th>
                  <th>روند تقاضا</th>
                </tr>
              </thead>
              <tbody>
                {COPAN_SALES_INTELLIGENCE.product_families.map((pf, idx) => (
                  <tr key={idx}>
                    <td className="font-bold text-[var(--text)]">{pf.title}</td>
                    <td className="font-mono font-bold text-[var(--gold)]">{pf.share_pct}٪</td>
                    <td className="font-mono font-bold text-[var(--text)]">
                      {(pf.revenue / 1000000).toFixed(0)}
                    </td>
                    <td className="font-mono">{pf.margin_pct}٪</td>
                    <td className="font-mono font-bold">
                      <span className={pf.trend.startsWith('+') ? 'text-[var(--positive)]' : 'text-[var(--risk)]'}>
                        {pf.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Color Groups Distribution */}
        <div className="copan-card space-y-4">
          <div className="pb-3 border-b border-[var(--hair)]">
            <h3 className="font-extrabold text-[15px] text-[var(--text)]">
              توزیع گروه‌های رنگی (Color Groups)
            </h3>
            <p className="text-[11.5px] text-[var(--text-faint)]">
              تفکیک تناژ بارگیری بر اساس کلاس رنگ
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {COPAN_SALES_INTELLIGENCE.color_groups.map((cg, idx) => (
              <div key={idx} className="space-y-1 text-[12px]">
                <div className="flex justify-between font-bold text-[var(--text)]">
                  <span>{cg.name}</span>
                  <span className="font-mono text-[var(--gold)]">{cg.share_pct}٪ ({cg.volume_tons} تن)</span>
                </div>
                <div className="w-full h-2 bg-[var(--panel-2)] rounded-full overflow-hidden border border-[var(--hair)]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cg.share_pct}%`,
                      backgroundColor: COLOR_PALETTE[idx % COLOR_PALETTE.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
