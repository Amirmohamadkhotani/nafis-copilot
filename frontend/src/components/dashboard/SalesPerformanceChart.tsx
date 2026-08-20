import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import type { SalesPerformanceMonth } from '../../types';

interface SalesPerformanceChartProps {
  data: SalesPerformanceMonth[];
  isLoading?: boolean;
}

export const SalesPerformanceChart: React.FC<SalesPerformanceChartProps> = ({
  data,
  isLoading,
}) => {
  const [viewMode, setViewMode] = useState<'6m' | '12m' | 'all'>('12m');

  const filteredData =
    viewMode === '6m'
      ? data.slice(-6)
      : viewMode === '12m'
      ? data.slice(-12)
      : data;

  const chartData = filteredData.map((d) => ({
    month: d.month ? d.month.slice(2) : 'N/A',
    revenueM: Math.round(d.revenue / 1_000_000), // in Million Rials
    grossProfitM: Math.round(d.gross_profit / 1_000_000),
    marginPct: d.avg_margin_pct ? Number(d.avg_margin_pct.toFixed(1)) : 0,
    activeCustomers: d.active_customers,
  }));

  const totalPeriodRevenue = chartData.reduce((acc, curr) => acc + curr.revenueM, 0);

  return (
    <div className="card-panel">
      {/* Header with Title and Period Switcher */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-surface-subtle border border-border-subtle text-ink flex items-center justify-center">
            <BarChart3 size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink">روند عملکرد فروش و حاشیه سود</h3>
            <span className="text-[11.5px] text-ink-muted">
              درآمد فروش در دوره: {(totalPeriodRevenue / 1000).toFixed(2)} میلیارد ریال
            </span>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1 bg-surface-subtle p-0.5 rounded-sm border border-border-subtle">
          <button
            type="button"
            className={`btn btn-sm ${
              viewMode === '6m' ? 'btn-primary' : 'btn-ghost text-ink-muted'
            }`}
            onClick={() => setViewMode('6m')}
          >
            ۶ ماه اخیر
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              viewMode === '12m' ? 'btn-primary' : 'btn-ghost text-ink-muted'
            }`}
            onClick={() => setViewMode('12m')}
          >
            ۱۲ ماه اخیر
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              viewMode === 'all' ? 'btn-primary' : 'btn-ghost text-ink-muted'
            }`}
            onClick={() => setViewMode('all')}
          >
            کل سوابق
          </button>
        </div>
      </div>

      {/* Visual Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-surface-subtle border border-border-subtle p-3 rounded-sm">
          <span className="text-[11px] text-ink-muted block mb-0.5">درآمد دوره انتخابی</span>
          <span className="text-sm font-bold font-mono text-ink">{(totalPeriodRevenue / 1000).toFixed(2)}B ریال</span>
        </div>
        <div className="bg-surface-subtle border border-border-subtle p-3 rounded-sm">
          <span className="text-[11px] text-ink-muted block mb-0.5">میانگین حاشیه سود دوره</span>
          <span className="text-sm font-bold font-mono text-brand">
            {chartData.length > 0
              ? (chartData.reduce((acc, c) => acc + c.marginPct, 0) / chartData.length).toFixed(1)
              : 0}%
          </span>
        </div>
        <div className="bg-surface-subtle border border-border-subtle p-3 rounded-sm">
          <span className="text-[11px] text-ink-muted block mb-0.5">میانگین مشتریان فعال</span>
          <span className="text-sm font-bold font-mono text-ink">
            {chartData.length > 0
              ? Math.round(chartData.reduce((acc, c) => acc + (c.activeCustomers || 0), 0) / chartData.length)
              : 0} حساب
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-ink-muted text-xs animate-pulse">
          در حال بارگذاری نمودار روند فروش...
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-ink-muted text-xs">
          در این بازه موردی برای نمایش وجود ندارد.
        </div>
      ) : (
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#E2E8E5" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#64746D' }}
                axisLine={{ stroke: '#CBD5D0' }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: '#64746D' }}
                axisLine={{ stroke: '#CBD5D0' }}
                tickFormatter={(v) => `${v}M`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: '#64746D' }}
                axisLine={{ stroke: '#CBD5D0' }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#CBD5D0',
                  borderRadius: '2px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '11.5px',
                  fontFamily: 'var(--font-fa)',
                  direction: 'rtl',
                }}
                formatter={(value: any, name: any) => {
                  const n = String(name || '');
                  if (n.includes('درآمد')) return [`${Number(value).toLocaleString()} میلیون ریال`, 'درآمد'];
                  if (n.includes('حاشیه')) return [`${value}%`, 'حاشیه سود'];
                  return [value, n];
                }}
                labelFormatter={(label) => `ماه ${label}`}
              />
              <Bar
                yAxisId="left"
                dataKey="revenueM"
                name="درآمد فروش"
                fill="#006937"
                radius={[0, 0, 0, 0]}
                barSize={20}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="marginPct"
                name="حاشیه سود (%)"
                stroke="#D97706"
                strokeWidth={2}
                dot={{ r: 3, fill: '#D97706' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
