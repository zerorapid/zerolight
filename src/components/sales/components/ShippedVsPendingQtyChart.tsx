import React, { useState, useMemo } from 'react';
import { Layers, Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Tooltip } from '@/components/ui/Tooltip';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/Chart';
import { SIZE_GRADE_COMPARISON } from '../data/salesDashboardData';
import { cn } from '@/lib/utils';

const chartConfig: ChartConfig = {
  toBeShipped: {
    label: 'To be shipped (Tons)',
    color: '#0B0F19',
  },
  shipped: {
    label: 'Shipped (Tons)',
    color: '#00a7bc',
  },
};

type Period = 'Day' | 'Week' | 'Month';

export const ShippedVsPendingQtyChart: React.FC = () => {
  const [period, setPeriod] = useState<Period>('Month');

  const chartData = useMemo(() => {
    const scale = period === 'Day' ? 0.04 : period === 'Week' ? 0.22 : 1.0;
    return SIZE_GRADE_COMPARISON.map((d) => ({
      ...d,
      toBeShipped: Number((d.toBeShipped * scale).toFixed(1)),
      shipped: Number((d.shipped * scale).toFixed(1)),
    }));
  }, [period]);

  return (
    <Card radius="card" padding="lg" className="w-full flex flex-col justify-between border border-border-subtle bg-white shadow-subtle">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#101828] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Layers className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h3 className="text-sm font-bold text-content-main tracking-tight">
            Shipped vs Pending Quantity by Grade
          </h3>
        </div>

        {/* Period Selector */}
        <div className="flex items-center bg-[#F1F5F9] p-0.5 rounded-full border border-border-subtle shrink-0">
          {(['Day', 'Week', 'Month'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                'px-2.5 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer',
                period === p
                  ? 'bg-[#0B0F19] text-white shadow-xs'
                  : 'text-content-muted hover:text-content-main'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Responsive shadcn Recharts Dual-Bar Stream */}
      <div className="w-full overflow-x-auto no-scrollbar pt-1">
        <div className="min-w-[760px] h-[260px]">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart
              data={chartData}
              margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
              barGap={3}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="grade"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: '#5E697D', fontSize: 10, fontWeight: 600 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: '#929EB2', fontSize: 10, fontWeight: 500 }}
                tickFormatter={(val) => `${val}T`}
              />
              <ChartTooltip
                cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    formatter={(val, name, item) => (
                      <div className="flex items-center justify-between w-full gap-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{
                              backgroundColor:
                                (item as any)?.color || (item as any)?.payload?.fill,
                            }}
                          />
                          <span className="text-white/80 text-[11px] font-medium">
                            {name === 'toBeShipped'
                              ? 'To be shipped'
                              : 'Shipped'}
                          </span>
                        </div>
                        <span className="font-bold text-white text-xs">
                          {Number(val).toFixed(1)} MT
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey="toBeShipped"
                name="toBeShipped"
                fill="#0B0F19"
                radius={[6, 6, 0, 0]}
                maxBarSize={16}
              />
              <Bar
                dataKey="shipped"
                name="shipped"
                fill="#00a7bc"
                radius={[6, 6, 0, 0]}
                maxBarSize={16}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </Card>
  );
};
