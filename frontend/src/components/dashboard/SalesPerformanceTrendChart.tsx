import React, { useState } from 'react';
import {
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
type MockDataModule = typeof import('../../data/copanIntelligence');
const COPAN_SALES_TREND: MockDataModule['COPAN_SALES_TREND'] = [];

export const SalesPerformanceTrendChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'3M' | '6M' | '12M'>('12M');
  const [chartMetric, setChartMetric] = useState<'revenue' | 'quantity' | 'margin'>('revenue');

  const filteredTrend =
    timeRange === '3M'
      ? COPAN_SALES_TREND.slice(-3)
      : timeRange === '6M'
      ? COPAN_SALES_TREND.slice(-6)
      : COPAN_SALES_TREND;

  const totalPeriodRevenue = filteredTrend.reduce((acc, curr) => acc + curr.revenue, 0);
  const avgMonthlyRevenue = totalPeriodRevenue / (filteredTrend.length || 1);
  const avgPeriodMargin = (
    filteredTrend.reduce((acc, curr) => acc + curr.avg_margin_pct, 0) / (filteredTrend.length || 1)
  ).toFixed(1);

  if (filteredTrend.length === 0) {
    return <div className="copan-card min-h-32 flex items-center justify-center text-[13px] text-[var(--text-faint)]">داده کافی موجود نیست</div>;
  }

  return (
    <div className="copan-card space-y-4">
      {/* Chart Top Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[var(--hair)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[var(--gold-soft)] text-[var(--gold)] border border-[var(--gold)]/30">
              <TrendingUp size={16} />
            </div>
            <h3 className="font-extrabold text-[15.5px] text-[var(--text)]">
              روند عملکرد فروش و پویایی درآمد (Sales Performance & Dynamics)
            </h3>
            <span className="copan-badge badge-gold text-[10.5px] font-bold">
              پایش عملکرد دوره‌ای
            </span>
          </div>
          <p className="text-[11.5px] text-[var(--text-faint)] mt-0.5">
            تحلیل زمانی درآمد کل، سود ناخالص، حجم بارگیری و روند تغییرات ماهانه
          </p>
        </div>

        {/* Interactive Metric & Time Period Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Metric Toggle */}
          <div className="flex items-center bg-[var(--panel-2)] p-0.5 rounded-xl border border-[var(--hair)] text-[11px]">
            <button
              onClick={() => setChartMetric('revenue')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                chartMetric === 'revenue'
                  ? 'bg-[var(--text)] text-[var(--bg)] shadow-xs'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              ارزش ریالی
            </button>
            <button
              onClick={() => setChartMetric('quantity')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                chartMetric === 'quantity'
                  ? 'bg-[var(--text)] text-[var(--bg)] shadow-xs'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              حجم (کیلوگرم)
            </button>
            <button
              onClick={() => setChartMetric('margin')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                chartMetric === 'margin'
                  ? 'bg-[var(--text)] text-[var(--bg)] shadow-xs'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              حاشیه سود ٪
            </button>
          </div>

          {/* Time Period Filter */}
          <div className="flex items-center bg-[var(--panel-2)] p-0.5 rounded-xl border border-[var(--hair)] text-[11px]">
            {(['3M', '6M', '12M'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                  timeRange === r
                    ? 'bg-[var(--text)] text-[var(--bg)] shadow-xs'
                    : 'text-[var(--text-dim)] hover:text-[var(--text)]'
                }`}
              >
                {r === '3M' ? '۳ ماهه' : r === '6M' ? '۶ ماهه' : 'سالانه (۱۲M)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mini KPI Summary Pills above Chart */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] flex items-center justify-between">
          <span className="text-[11.5px] text-[var(--text-faint)] font-medium">مجموع فروش در دوره:</span>
          <b className="font-mono text-[14.5px] text-[var(--gold)]">
            {(totalPeriodRevenue / 1000000).toFixed(0)} <small className="text-[11px]">میلیون ریال</small>
          </b>
        </div>
        <div className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] flex items-center justify-between">
          <span className="text-[11.5px] text-[var(--text-faint)] font-medium">میانگین فروش ماهانه:</span>
          <b className="font-mono text-[14.5px] text-[var(--text)]">
            {(avgMonthlyRevenue / 1000000).toFixed(0)} <small className="text-[11px]">م.ر / ماه</small>
          </b>
        </div>
        <div className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--hair)] flex items-center justify-between">
          <span className="text-[11.5px] text-[var(--text-faint)] font-medium">میانگین مارجین سود:</span>
          <b className="font-mono text-[14.5px] text-[var(--positive)]">
            {avgPeriodMargin}٪
          </b>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="copanRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.45} />
                <stop offset="95%" stopColor="var(--gold)" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="copanProfitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--brand)" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="copanQtyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(244, 241, 227, 0.08)" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="var(--text-faint)"
              tick={{ fontSize: 11, fill: 'var(--text-faint)' }}
            />
            <YAxis
              stroke="var(--text-faint)"
              tick={{ fontSize: 11, fill: 'var(--text-faint)' }}
              tickFormatter={(val) =>
                chartMetric === 'revenue'
                  ? `${(val / 1000000).toFixed(0)} م.ر`
                  : chartMetric === 'quantity'
                  ? `${(val / 1000).toFixed(0)} تن`
                  : `${val}٪`
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--panel)',
                borderColor: 'var(--hair-strong)',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                fontSize: '12px',
                direction: 'rtl',
                textAlign: 'right',
                color: 'var(--text)',
              }}
              formatter={(val: any, name: any) => {
                if (name === 'فروش کل')
                  return [`${(Number(val) / 1000000).toFixed(0)} میلیون ریال`, name];
                if (name === 'سود ناخالص')
                  return [`${(Number(val) / 1000000).toFixed(0)} میلیون ریال`, name];
                if (name === 'حجم بارگیری')
                  return [`${Number(val).toLocaleString('fa-IR')} کیلوگرم`, name];
                if (name === 'حاشیه سود') return [`${val}٪`, name];
                return [val, name];
              }}
            />
            {chartMetric === 'revenue' && (
              <>
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="فروش کل"
                  stroke="var(--gold)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#copanRevenueGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="gross_profit"
                  name="سود ناخالص"
                  stroke="var(--brand)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#copanProfitGrad)"
                />
              </>
            )}
            {chartMetric === 'quantity' && (
              <Area
                type="monotone"
                dataKey="quantity"
                name="حجم بارگیری"
                stroke="#2563eb"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#copanQtyGrad)"
              />
            )}
            {chartMetric === 'margin' && (
              <Area
                type="monotone"
                dataKey="avg_margin_pct"
                name="حاشیه سود"
                stroke="var(--positive)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#copanProfitGrad)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
