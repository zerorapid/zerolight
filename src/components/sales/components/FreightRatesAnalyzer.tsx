import React, { useState } from 'react';
import { Download, Navigation, Info, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { TagInput } from '@/components/ui/TagInput';
import { DatePickerPopover } from '@/components/ui/DatePickerPopover';
import {
  LineChart,
  Line,
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
import { FREIGHT_RATE_SERIES } from '../data/salesDashboardData';

const chartConfig: ChartConfig = {
  maersk: {
    label: 'Maersk Line (Spot Ref)',
    color: '#00a7bc',
  },
  msc: {
    label: 'MSC Line',
    color: '#0B0F19',
  },
  cma: {
    label: 'CMA CGM',
    color: '#475569',
  },
  evergreen: {
    label: 'Evergreen',
    color: '#64748B',
  },
  hapag: {
    label: 'Hapag-Lloyd',
    color: '#94A3B8',
  },
};

export const FreightRatesAnalyzer: React.FC = () => {
  const [liners, setLiners] = useState<string[]>(['MAERSK LINE', 'MSC LINE', 'CMA CGM']);
  const [ports, setPorts] = useState<string[]>(['SAVANNAH']);
  const [fromDate, setFromDate] = useState('Aug 30, 2026');
  const [toDate, setToDate] = useState('Oct 30, 2026');

  return (
    <Card radius="card" padding="lg" className="w-full flex flex-col gap-4 border border-border-subtle bg-white shadow-subtle">
      {/* 1. Card Header without redundant divider line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#101828] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Navigation className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-content-main tracking-tight">
              Freight Rates Ocean Spot Analyzer
            </h3>
            <p className="text-xs font-medium text-content-muted">
              Spot tariff benchmarks across major shipping lines (USD / 40ft Reefer)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm">
            Live Spot Index
          </Badge>
          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="w-3.5 h-3.5 stroke-[2.2]" />}
            className="text-xs font-semibold"
          >
            Export Rates
          </Button>
        </div>
      </div>

      {/* 2. Structured Dedicated Filter Sub-Bar (Zero Wrapping Gaps) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-[#F8FAFC] p-3 rounded-card border border-border-subtle">
        <div className="md:col-span-4 flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-content-muted">
            Liner:
          </span>
          <TagInput tags={liners} onChange={setLiners} placeholder="Add ocean liner..." />
        </div>

        <div className="md:col-span-3 flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-content-muted">
            Destination Port:
          </span>
          <TagInput tags={ports} onChange={setPorts} placeholder="Add port..." />
        </div>

        <div className="md:col-span-2 flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-content-muted">
            From Date:
          </span>
          <DatePickerPopover value={fromDate} onChange={setFromDate} />
        </div>

        <div className="md:col-span-2 flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-content-muted">
            To Date:
          </span>
          <DatePickerPopover value={toDate} onChange={setToDate} />
        </div>

        <div className="md:col-span-1 flex items-end">
          <Button
            variant="black"
            size="md"
            className="w-full h-[42px] rounded-full text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            Filter
          </Button>
        </div>
      </div>

      {/* 3. shadcn Recharts Multi-Line Curves (Snug, Zero Dead Vertical Margins) */}
      <div className="w-full overflow-x-auto no-scrollbar pt-2">
        <div className="min-w-[700px] h-[260px]">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <LineChart
              data={FREIGHT_RATE_SERIES}
              margin={{ top: 16, right: 24, left: 0, bottom: 4 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fill: '#5E697D', fontSize: 11, fontWeight: 600 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 12000]}
                tick={{ fill: '#929EB2', fontSize: 10, fontWeight: 500 }}
                tickFormatter={(val) => `$${val}`}
              />
              <ChartTooltip
                cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '3 3' }}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    formatter={(val, name, item) => (
                      <div className="flex items-center justify-between w-full gap-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{
                              backgroundColor:
                                (item as any)?.color || (item as any)?.payload?.fill,
                            }}
                          />
                          <span className="text-white/80 text-[11px] font-medium">
                            {chartConfig[name as string]?.label || name}
                          </span>
                        </div>
                        <span className="font-bold text-white text-xs">
                          ${Number(val).toLocaleString()}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="maersk"
                name="maersk"
                stroke="#00a7bc"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#00a7bc', stroke: '#FFFFFF', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#00a7bc' }}
              />
              <Line
                type="monotone"
                dataKey="msc"
                name="msc"
                stroke="#0B0F19"
                strokeWidth={2}
                dot={{ r: 3, fill: '#0B0F19' }}
              />
              <Line
                type="monotone"
                dataKey="cma"
                name="cma"
                stroke="#475569"
                strokeWidth={1.75}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#475569' }}
              />
              <Line
                type="monotone"
                dataKey="evergreen"
                name="evergreen"
                stroke="#64748B"
                strokeWidth={1.75}
                strokeDasharray="3 3"
                dot={{ r: 3, fill: '#64748B' }}
              />
              <Line
                type="monotone"
                dataKey="hapag"
                name="hapag"
                stroke="#94A3B8"
                strokeWidth={1.75}
                strokeDasharray="2 2"
                dot={{ r: 3, fill: '#94A3B8' }}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </Card>
  );
};
