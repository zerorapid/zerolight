import React, { useState, useMemo } from 'react';
import { Factory, Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Tooltip } from '@/components/ui/Tooltip';
import { PLANT_WISE_ORDERS } from '../data/salesDashboardData';
import { cn } from '@/lib/utils';

type Period = 'Day' | 'Week' | 'Month';

export const PlantFulfillmentQuotaCard: React.FC = () => {
  const [period, setPeriod] = useState<Period>('Month');

  const plantData = useMemo(() => {
    const scale = period === 'Day' ? 0.05 : period === 'Week' ? 0.25 : 1.0;
    return PLANT_WISE_ORDERS.filter((p) => p.unit !== 'All').map((plant) => {
      const total = Math.max(1, Math.round(plant.total * scale));
      const shipped = Math.max(0, Math.min(total, Math.round(plant.shipped * scale)));
      const pct = Math.round((shipped / total) * 100);
      return { ...plant, total, shipped, pct };
    });
  }, [period]);

  return (
    <Card radius="card" padding="lg" className="h-[340px] border border-border-subtle bg-white shadow-subtle flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#101828] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Factory className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h3 className="text-sm font-bold text-content-main tracking-tight">
            Plant Wise Fulfillment
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

      {/* 2. Balanced Quota Bars Row (Zero Dead Space) */}
      <div className="flex flex-col gap-2.5 flex-1 justify-center my-auto">
        {plantData.map((plant, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-content-main">{plant.unit}</span>
              <span className="font-bold text-content-muted text-[11px]">
                {plant.shipped} / {plant.total} Orders ({plant.pct}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  plant.pct >= 80 ? 'bg-[#00a7bc]' : 'bg-[#0B0F19]'
                )}
                style={{ width: `${plant.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
