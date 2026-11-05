import React, { useState, useMemo } from 'react';
import { Receipt, Info } from 'lucide-react';
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
import { MONTHLY_INVOICE_DATA } from '../data/salesDashboardData';
import { cn } from '@/lib/utils';

const DAILY_DATA = [
  { label: 'Mon', invoiced: 24, shipments: 28 },
  { label: 'Tue', invoiced: 32, shipments: 35 },
  { label: 'Wed', invoiced: 28, shipments: 30 },
  { label: 'Thu', invoiced: 41, shipments: 44 },
  { label: 'Fri', invoiced: 38, shipments: 40 },
  { label: 'Sat', invoiced: 18, shipments: 22 },
  { label: 'Sun', invoiced: 8, shipments: 12 },
];

const WEEKLY_DATA = [
  { label: 'Wk 1', invoiced: 142, shipments: 156 },
  { label: 'Wk 2', invoiced: 168, shipments: 180 },
  { label: 'Wk 3', invoiced: 155, shipments: 162 },
  { label: 'Wk 4', invoiced: 188, shipments: 204 },
];

const chartConfig: ChartConfig = {
  invoiced: {
    label: 'Invoiced Orders',
    color: '#0B0F19',
  },
  shipments: {
    label: 'Physical Shipments',
    color: '#00a7bc',
  },
};

type Period = 'Day' | 'Week' | 'Month';

export const InvoiceVsShipmentsChart: React.FC = () => {
  const [period, setPeriod] = useState<Period>('Month');

  const chartData = useMemo(() => {
    if (period === 'Day') return DAILY_DATA;
    if (period === 'Week') return WEEKLY_DATA;
    return MONTHLY_INVOICE_DATA.map((d) => ({
      label: d.month.slice(0, 3),
      invoiced: d.invoiced,
      shipments: d.shipments,
    }));
  }, [period]);

  return (
    <Card radius="card" padding="lg" className="h-[340px] flex flex-col justify-between border border-border-subtle bg-white shadow-subtle">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#101828] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Receipt className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h3 className="text-sm font-bold text-content-main tracking-tight">
            Invoice Vs Shipments
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

      {/* 2. shadcn Recharts Bar Chart Container */}
      <div className="w-full flex-1 pt-1">
        <div className="w-full h-[220px]">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart
              data={chartData}
              margin={{ top: 12, right: 8, left: -20, bottom: 0 }}
              barGap={3}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="label"
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
                            {name === 'invoiced' ? 'Invoiced' : 'Shipments'}
                          </span>
                        </div>
                        <span className="font-bold text-white text-xs">
                          {val} Lots
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey="invoiced"
                name="invoiced"
                fill="#0B0F19"
                radius={[6, 6, 0, 0]}
                maxBarSize={14}
              />
              <Bar
                dataKey="shipments"
                name="shipments"
                fill="#00a7bc"
                radius={[6, 6, 0, 0]}
                maxBarSize={14}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </Card>
  );
};
