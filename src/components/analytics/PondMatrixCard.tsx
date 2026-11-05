import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Waves, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PondRow {
  id: string;
  name: string;
  sector: string;
  species: string;
  phase: string;
  do: number;
  temp: number;
  ph: number;
  salinity: number;
  biomass: number;
  targetBiomass: number;
  aeratorHz: number;
  powerKw: number;
  status: 'Normal' | 'Attention' | 'Critical';
  sparkline: number[];
}

const PONDS_MATRIX: PondRow[] = [
  {
    id: 'PND-01',
    name: 'Pond 01',
    sector: 'Nursery Sector Alpha',
    species: 'P. vannamei',
    phase: 'Seed',
    do: 7.1,
    temp: 29.2,
    ph: 7.9,
    salinity: 18,
    biomass: 3200,
    targetBiomass: 9000,
    aeratorHz: 50,
    powerKw: 3.2,
    status: 'Normal',
    sparkline: [6.8, 6.9, 7.0, 7.2, 7.1],
  },
  {
    id: 'PND-02',
    name: 'Pond 02',
    sector: 'Grow-out Sector Beta',
    species: 'P. vannamei',
    phase: 'Grow-out',
    do: 5.3,
    temp: 28.6,
    ph: 7.6,
    salinity: 18,
    biomass: 7800,
    targetBiomass: 9500,
    aeratorHz: 45,
    powerKw: 2.8,
    status: 'Attention',
    sparkline: [5.8, 5.6, 5.4, 5.2, 5.3],
  },
  {
    id: 'PND-03',
    name: 'Pond 03',
    sector: 'Grow-out Sector Gamma',
    species: 'O. niloticus',
    phase: 'Grow-out',
    do: 4.1,
    temp: 27.5,
    ph: 7.3,
    salinity: 5,
    biomass: 11200,
    targetBiomass: 12000,
    aeratorHz: 60,
    powerKw: 4.5,
    status: 'Critical',
    sparkline: [4.9, 4.6, 4.3, 4.0, 4.1],
  },
  {
    id: 'PND-04',
    name: 'Pond 04',
    sector: 'Harvest Sector Delta',
    species: 'P. vannamei',
    phase: 'Harvest',
    do: 6.5,
    temp: 28.4,
    ph: 7.8,
    salinity: 18,
    biomass: 8400,
    targetBiomass: 8500,
    aeratorHz: 50,
    powerKw: 3.2,
    status: 'Normal',
    sparkline: [6.2, 6.3, 6.4, 6.6, 6.5],
  },
];

export const PondMatrixCard: React.FC = () => {
  return (
    <Card padding="lg" className="w-full flex flex-col border border-border-subtle bg-white shadow-subtle">
      {/* Header with Clean Spacing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#0B0F19] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Waves className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-content-main tracking-tight">
              Production Ponds Comparison Matrix
            </h3>
            <p className="text-xs text-content-muted">
              Live multi-sector telemetry stream across all 4 production ponds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm">
            2 Optimal
          </Badge>
          <Badge variant="warning" size="sm">
            1 Attention
          </Badge>
          <Badge variant="error" size="sm">
            1 Critical
          </Badge>
        </div>
      </div>

      {/* Table Container with guaranteed overflow scrolling & fixed column widths */}
      <div className="overflow-x-auto no-scrollbar -mx-5 px-5">
        <table className="w-full text-left border-collapse min-w-[680px]">
          <thead>
            <tr className="border-b border-border-subtle text-[11px] font-bold uppercase tracking-wider text-content-muted">
              <th className="py-2.5 pr-4 w-44">Pond & Sector</th>
              <th className="py-2.5 px-3 w-32">D.O. (mg/L)</th>
              <th className="py-2.5 px-3 w-28">Temp / pH</th>
              <th className="py-2.5 px-3 w-44">Biomass / Harvest</th>
              <th className="py-2.5 px-3 w-32">Aeration VFD</th>
              <th className="py-2.5 pl-3 text-right w-24">Health Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/70 text-xs">
            {PONDS_MATRIX.map((p) => {
              const isCrit = p.status === 'Critical';
              const isWarn = p.status === 'Attention';
              const progressPct = Math.min(100, Math.round((p.biomass / p.targetBiomass) * 100));

              return (
                <tr
                  key={p.id}
                  className="hover:bg-[#F8FAFC] transition-colors duration-150 group cursor-pointer"
                >
                  {/* Pond & Sector (No awkward mid-word breaks or hanging bullets!) */}
                  <td className="py-3.5 pr-4">
                    <div className="flex flex-col whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-content-main text-xs group-hover:text-brand-accent transition-colors">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-content-tertiary">
                          &bull; {p.species}
                        </span>
                      </div>
                      <span className="text-[11px] text-content-muted font-medium mt-0.5">
                        {p.sector}
                      </span>
                    </div>
                  </td>

                  {/* DO in clean pill badge with embedded sparkline */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-pill bg-[#F4F5F8] border border-border-subtle/60 w-fit">
                      <span
                        className={cn(
                          'text-xs font-bold',
                          isCrit ? 'text-status-error' : isWarn ? 'text-status-warning' : 'text-content-main'
                        )}
                      >
                        {p.do.toFixed(1)}
                      </span>
                      <svg className="w-10 h-3.5 shrink-0" viewBox="0 0 45 16">
                        <polyline
                          fill="none"
                          stroke={isCrit ? '#EF4444' : isWarn ? '#F59E0B' : '#0284C7'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points="0,12 11,10 22,12 33,6 45,8"
                        />
                      </svg>
                    </div>
                  </td>

                  {/* Temp / pH with clean vertical stacking */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col whitespace-nowrap">
                      <span className="font-bold text-content-main text-xs">{p.temp.toFixed(1)}°C</span>
                      <span className="text-[11px] text-content-muted font-medium">pH {p.ph.toFixed(2)}</span>
                    </div>
                  </td>

                  {/* Biomass with integrated progress track */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col gap-1.5 w-36">
                      <div className="flex items-baseline justify-between text-xs font-semibold">
                        <span className="font-bold text-content-main text-xs">{p.biomass.toLocaleString()} kg</span>
                        <span className="text-[10px] font-bold text-content-muted">{progressPct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            isCrit ? 'bg-status-error' : 'bg-[#0284C7]'
                          )}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Aeration VFD centered */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <span className="w-2 h-2 rounded-full bg-status-success animate-pulse shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-bold text-content-main text-xs">{p.aeratorHz} Hz</span>
                        <span className="text-[10px] text-content-muted font-medium">{p.powerKw} kW Power</span>
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 pl-3 text-right">
                    <Badge
                      variant={p.status === 'Normal' ? 'success' : isWarn ? 'warning' : 'error'}
                      pulse={isCrit}
                      size="sm"
                    >
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
