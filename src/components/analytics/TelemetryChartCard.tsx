import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
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
import { Activity, Droplets, Thermometer } from 'lucide-react';
import { cn } from '@/lib/utils';

const TELEMETRY_SERIES_24H = [
  { time: '00:00', doVal: 5.9, tempVal: 27.8 },
  { time: '02:00', doVal: 5.2, tempVal: 27.4 },
  { time: '04:00', doVal: 4.7, tempVal: 27.0 },
  { time: '06:00', doVal: 4.8, tempVal: 26.8 },
  { time: '08:00', doVal: 5.6, tempVal: 27.5 },
  { time: '10:00', doVal: 6.8, tempVal: 28.6 },
  { time: '12:00', doVal: 7.5, tempVal: 29.5 },
  { time: '14:00', doVal: 7.8, tempVal: 29.8 },
  { time: '16:00', doVal: 7.4, tempVal: 29.4 },
  { time: '18:00', doVal: 6.9, tempVal: 28.9 },
  { time: '20:00', doVal: 6.5, tempVal: 28.5 },
  { time: '22:00', doVal: 6.2, tempVal: 28.1 },
  { time: 'Now', doVal: 6.4, tempVal: 28.4 },
];

const chartConfig: ChartConfig = {
  doVal: {
    label: 'Dissolved Oxygen (mg/L)',
    color: '#0284C7',
    icon: Droplets,
  },
  tempVal: {
    label: 'Water Temperature (°C)',
    color: '#F59E0B',
    icon: Thermometer,
  },
};

export const TelemetryChartCard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'6h' | '24h' | '7d' | '30d'>('24h');

  return (
    <Card radius="card" padding="lg" className="w-full flex flex-col gap-4">
      {/* Masthead Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-tint text-brand-accent flex items-center justify-center shrink-0 shadow-xs">
            <Activity className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-content-main tracking-tight">
                Live Sensor Telemetry Stream
              </h3>
              <Badge variant="success" size="sm" pulse>
                Active Broadcast
              </Badge>
            </div>
            <p className="text-xs text-content-muted font-medium mt-0.5">
              Dual-axis correlation: Optical Luminescent DO (mg/L) vs Submersible Temp (°C)
            </p>
          </div>
        </div>

        {/* Range Selector Pill Group */}
        <div className="flex items-center bg-[#F1F5F9] p-1 rounded-full border border-border-subtle self-start sm:self-auto">
          {(['6h', '24h', '7d', '30d'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setTimeRange(r)}
              className={cn(
                'px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer',
                timeRange === r
                  ? 'bg-[#0B0F19] text-white shadow-xs'
                  : 'text-content-muted hover:text-content-main'
              )}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* shadcn Recharts Dual-Axis Stream Chart */}
      <div className="w-full h-[280px] pt-2">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <LineChart
            data={TELEMETRY_SERIES_24H}
            margin={{ top: 12, right: 12, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#F1F5F9"
            />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: '#5E697D', fontSize: 11, fontWeight: 600 }}
            />
            {/* Left Y-Axis: Dissolved Oxygen (mg/L) */}
            <YAxis
              yAxisId="do"
              orientation="left"
              domain={[4.0, 9.0]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: '#0284C7', fontSize: 10, fontWeight: 600 }}
              tickFormatter={(val) => `${val} mg/L`}
            />
            {/* Right Y-Axis: Water Temperature (°C) */}
            <YAxis
              yAxisId="temp"
              orientation="right"
              domain={[24.0, 32.0]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: '#F59E0B', fontSize: 10, fontWeight: 600 }}
              tickFormatter={(val) => `${val}°C`}
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
                          {name === 'doVal'
                            ? 'Dissolved Oxygen'
                            : 'Temperature'}
                        </span>
                      </div>
                      <span className="font-bold text-white text-xs">
                        {name === 'doVal' ? `${val} mg/L` : `${val} °C`}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Line
              yAxisId="do"
              type="monotone"
              dataKey="doVal"
              name="doVal"
              stroke="#0284C7"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#0284C7', stroke: '#FFFFFF', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="tempVal"
              name="tempVal"
              stroke="#F59E0B"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#F59E0B', stroke: '#FFFFFF', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </div>
    </Card>
  );
};
