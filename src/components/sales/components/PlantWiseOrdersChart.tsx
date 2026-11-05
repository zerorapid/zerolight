import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PLANT_WISE_ORDERS } from '../data/salesDashboardData';

export const PlantWiseOrdersChart: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxVal = 2000;
  const chartHeight = 150;
  const topPad = 25;

  return (
    <Card radius="card" padding="md" className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-content-main tracking-tight">
            Plant Wise Orders
          </h3>
          <p className="text-xs font-medium text-content-muted">Processing line distribution</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="default"
            size="sm"
            icon={<span className="w-2 h-2 rounded-full bg-[#00a7bc] mr-1.5" />}
          >
            Total
          </Badge>
          <Badge
            variant="success"
            size="sm"
            icon={<span className="w-2 h-2 rounded-full bg-[#10b981] mr-1.5" />}
          >
            Shipped
          </Badge>
          <Badge
            variant="warning"
            size="sm"
            icon={<span className="w-2 h-2 rounded-full bg-[#f59e0b] mr-1.5" />}
          >
            Pending
          </Badge>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto no-scrollbar pt-2">
        <svg viewBox="0 0 540 220" className="w-full h-52 select-none">
          {/* Subtle Grid Lines */}
          {[0, 500, 1000, 1500, 2000].map((tick) => {
            const y = topPad + chartHeight - (tick / maxVal) * chartHeight;
            return (
              <g key={tick}>
                <line x1="35" y1={y} x2="530" y2={y} stroke="#f1f5f9" strokeDasharray="3 3" />
                <text x="30" y={y + 3} textAnchor="end" className="text-[10px] fill-slate-400 font-medium">
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Triple Bar Groups */}
          {PLANT_WISE_ORDERS.map((d, idx) => {
            const xBase = 50 + idx * 68;
            const totalH = (d.total / maxVal) * chartHeight;
            const shippedH = (d.shipped / maxVal) * chartHeight;
            const pendingH = (d.pending / maxVal) * chartHeight;

            const totalY = topPad + chartHeight - totalH;
            const shippedY = topPad + chartHeight - shippedH;
            const pendingY = topPad + chartHeight - pendingH;

            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Total Bar */}
                <rect
                  x={xBase}
                  y={totalY}
                  width="9"
                  height={totalH}
                  rx="3"
                  fill="#00a7bc"
                  opacity={hoveredIdx !== null && !isHovered ? 0.4 : 1}
                  className="transition-all duration-200"
                />

                {/* Shipped Bar */}
                <rect
                  x={xBase + 11}
                  y={shippedY}
                  width="9"
                  height={shippedH}
                  rx="3"
                  fill="#10b981"
                  opacity={hoveredIdx !== null && !isHovered ? 0.4 : 1}
                  className="transition-all duration-200"
                />

                {/* Pending Bar */}
                <rect
                  x={xBase + 22}
                  y={pendingY}
                  width="9"
                  height={pendingH}
                  rx="3"
                  fill="#f59e0b"
                  opacity={hoveredIdx !== null && !isHovered ? 0.4 : 1}
                  className="transition-all duration-200"
                />

                {/* X-axis Label */}
                <text
                  x={xBase + 15}
                  y="208"
                  textAnchor="middle"
                  className={`text-[9.5px] font-semibold transition-colors ${
                    isHovered ? 'fill-content-main' : 'fill-slate-400'
                  }`}
                >
                  {d.unit}
                </text>

                {/* Hover Tooltip Box */}
                {isHovered && (
                  <g>
                    <rect
                      x={xBase - 34}
                      y={Math.min(totalY, shippedY, pendingY) - 36}
                      width="100"
                      height="30"
                      rx="8"
                      fill="#101828"
                      className="shadow-floating"
                    />
                    <text
                      x={xBase + 16}
                      y={Math.min(totalY, shippedY, pendingY) - 17}
                      textAnchor="middle"
                      className="text-[9.5px] font-bold fill-white"
                    >
                      Tot: {d.total} | Shp: {d.shipped} | Pnd: {d.pending}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
};
