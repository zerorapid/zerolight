import React, { useState, useMemo } from 'react';
import { Globe2, Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Tooltip } from '@/components/ui/Tooltip';
import { PieChart, Pie, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/Chart';
import { COUNTRY_DISTRIBUTION } from '../data/salesDashboardData';
import { cn } from '@/lib/utils';

const chartConfig = COUNTRY_DISTRIBUTION.reduce((acc, curr) => {
  acc[curr.name] = {
    label: curr.name,
    color: curr.color,
  };
  return acc;
}, {} as ChartConfig);

type Period = 'Day' | 'Week' | 'Month';

export const CountryWisePieChart: React.FC = () => {
  const [period, setPeriod] = useState<Period>('Month');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const displayData = useMemo(() => {
    const scale = period === 'Day' ? 0.05 : period === 'Week' ? 0.24 : 1.0;
    return COUNTRY_DISTRIBUTION.map((item) => ({
      ...item,
      count: Math.max(1, Math.round(item.count * scale)),
    }));
  }, [period]);

  const totalOrders = useMemo(() => {
    return displayData.reduce((acc, curr) => acc + curr.count, 0);
  }, [displayData]);

  return (
    <Card radius="card" padding="lg" className="h-[320px] flex flex-col justify-between border border-border-subtle bg-white shadow-subtle">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#101828] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Globe2 className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h3 className="text-sm font-bold text-content-main tracking-tight">
            Country Wise Export
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

      {/* 2. Donut & Balanced Legend Row (Zero Dead Space) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 flex-1 my-auto">
        {/* shadcn Recharts Donut Chart */}
        <div className="relative shrink-0 w-[180px] h-[180px] flex items-center justify-center">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    indicator="dot"
                    formatter={(val, name, item) => (
                      <div className="flex items-center justify-between w-full gap-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: (item as any)?.payload?.color || (item as any)?.color }}
                          />
                          <span className="text-white/80 text-[11px] font-medium">
                            {name}
                          </span>
                        </div>
                        <span className="font-bold text-white text-xs">
                          {(item as any)?.payload?.percentage}% ({val})
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Pie
                data={displayData}
                dataKey="count"
                nameKey="name"
                innerRadius={52}
                outerRadius={75}
                paddingAngle={2}
                stroke="#FFFFFF"
                strokeWidth={2}
              >
                {displayData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={hoveredIdx !== null && hoveredIdx !== index ? 0.35 : 1}
                    className="transition-all duration-200 cursor-pointer outline-none"
                    onMouseEnter={() => setHoveredIdx(index)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          {/* Centered Volume Label in the Donut Hub */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <span className="text-lg font-bold text-content-main leading-none">
              {totalOrders}
            </span>
            <span className="text-[10px] font-semibold text-content-muted uppercase tracking-wider mt-0.5">
              Orders
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 flex flex-col gap-1 max-h-[180px] overflow-y-auto no-scrollbar pr-1 w-full">
          {displayData.map((item, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center justify-between text-xs py-1.5 px-2 rounded-lg transition-colors cursor-pointer ${
                hoveredIdx === idx ? 'bg-surface-subtle font-bold' : 'hover:bg-surface-subtle font-medium'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-content-main font-medium truncate">{item.name}</span>
              </div>
              <span className="text-content-muted font-semibold text-xs shrink-0">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
