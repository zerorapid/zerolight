import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeaderCard } from '@/components/ui/PageHeaderCard';
import { Waves, Wind, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PondDetailSheet, PondDetailData } from './PondDetailSheet';

interface PondData {
  id: string;
  name: string;
  species: string;
  phase: string;
  biomass: number;
  targetBiomass: number;
  do: number;
  temp: number;
  ph: number;
  status: 'Normal' | 'Attention' | 'Critical';
  aeratorRunning: boolean;
}

const PONDS: PondData[] = [
  {
    id: 'PND-01',
    name: 'Pond 01',
    species: 'P. vannamei',
    phase: 'Seed',
    biomass: 3200,
    targetBiomass: 9000,
    do: 7.1,
    temp: 29.2,
    ph: 7.9,
    status: 'Normal',
    aeratorRunning: true,
  },
  {
    id: 'PND-02',
    name: 'Pond 02',
    species: 'P. vannamei',
    phase: 'Grow-out',
    biomass: 7800,
    targetBiomass: 9500,
    do: 5.3,
    temp: 28.6,
    ph: 7.6,
    status: 'Attention',
    aeratorRunning: true,
  },
  {
    id: 'PND-03',
    name: 'Pond 03',
    species: 'O. niloticus',
    phase: 'Grow-out',
    biomass: 11200,
    targetBiomass: 12000,
    do: 4.1,
    temp: 27.5,
    ph: 7.3,
    status: 'Critical',
    aeratorRunning: false,
  },
  {
    id: 'PND-04',
    name: 'Pond 04',
    species: 'P. vannamei',
    phase: 'Harvest',
    biomass: 8400,
    targetBiomass: 8500,
    do: 6.5,
    temp: 28.4,
    ph: 7.8,
    status: 'Normal',
    aeratorRunning: true,
  },
];

interface PondsViewProps {
  onShowToast?: (text: string, type?: 'success' | 'error') => void;
}

export const PondsView: React.FC<PondsViewProps> = ({ onShowToast }) => {
  const [pondsList, setPondsList] = useState<PondData[]>(PONDS);
  const [selectedPond, setSelectedPond] = useState<PondData | null>(null);

  const toggleAerator = (id: string) => {
    setPondsList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.aeratorRunning;
          onShowToast?.(`Aerator for ${p.name} ${nextState ? 'engaged' : 'paused'}.`);
          return { ...p, aeratorRunning: nextState };
        }
        return p;
      })
    );
    setSelectedPond((current) =>
      current && current.id === id
        ? { ...current, aeratorRunning: !current.aeratorRunning }
        : current
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Sticky Sub-Menu Header Dock with Smooth Fade */}
      <div className="sticky top-[86px] z-20 bg-canvas/95 backdrop-blur-md pt-1 pb-3 -mt-1 flex flex-col gap-2">
        <PageHeaderCard
          icon={<Waves className="w-5 h-5 stroke-[2.2]" />}
          iconBg="bg-brand-solid text-white"
          title="Production Ponds Matrix"
          subtitle="Live automated dissolved oxygen monitoring & aeration control across 4 sectors"
          badge="Sector Alpha"
          badgeVariant="brand"
          tooltip={{
            title: 'Automated Aerator Telemetry',
            description: 'VFD surge aerators linked to optical DO probes',
          }}
          actions={
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm">
                3 Active
              </Badge>
              <Badge variant="warning" size="sm">
                1 Attention
              </Badge>
            </div>
          }
        />
        {/* Organic Dissolving Feather */}
        <div className="h-6 w-full pointer-events-none bg-gradient-to-b from-canvas via-canvas/60 to-transparent -mb-6" />
      </div>

      {/* Grid of Ponds */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {pondsList.map((pond) => {
          const progressPct = Math.min(
            100,
            Math.round((pond.biomass / pond.targetBiomass) * 100)
          );
          const isCritical = pond.status === 'Critical';
          const badgeVariant =
            pond.status === 'Normal'
              ? 'success'
              : pond.status === 'Attention'
              ? 'warning'
              : 'error';

          return (
            <Card
              key={pond.id}
              padding="md"
              className="flex flex-col justify-between hover:shadow-floating transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-content-main">{pond.name}</h3>
                    <span className="text-xs text-content-muted font-medium">
                      {pond.species} &bull; {pond.phase}
                    </span>
                  </div>

                  <Badge variant={badgeVariant} pulse={isCritical} size="sm">
                    {pond.status}
                  </Badge>
                </div>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-surface-subtle p-2 rounded-full flex flex-col items-center">
                    <span className="text-[10px] font-bold text-content-tertiary">DO</span>
                    <span className={cn('text-xs font-bold', isCritical && 'text-status-error')}>
                      {pond.do.toFixed(1)}
                    </span>
                  </div>
                  <div className="bg-surface-subtle p-2 rounded-full flex flex-col items-center">
                    <span className="text-[10px] font-bold text-content-tertiary">TEMP</span>
                    <span className="text-xs font-bold">{pond.temp.toFixed(1)}°</span>
                  </div>
                  <div className="bg-surface-subtle p-2 rounded-full flex flex-col items-center">
                    <span className="text-[10px] font-bold text-content-tertiary">pH</span>
                    <span className="text-xs font-bold">{pond.ph.toFixed(2)}</span>
                  </div>
                </div>

                {/* Biomass Growth Progress */}
                <div className="flex flex-col gap-1.5 mb-5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-content-muted">Biomass Growth</span>
                    <span className="text-content-main">
                      {pond.biomass.toLocaleString()} / {pond.targetBiomass.toLocaleString()} kg
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-subtle overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        isCritical ? 'bg-status-error' : 'bg-brand-accent'
                      )}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons: Aerator Toggle + Sheet Inspection */}
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant={pond.aeratorRunning ? 'brand' : 'secondary'}
                  size="sm"
                  onClick={() => toggleAerator(pond.id)}
                  icon={<Wind className="w-3.5 h-3.5" />}
                  className="w-full"
                >
                  {pond.aeratorRunning ? 'Aeration Active (VFD)' : 'Turn On Aerator'}
                </Button>

                <Button
                  type="button"
                  variant="black"
                  size="sm"
                  onClick={() => setSelectedPond(pond)}
                  icon={<ExternalLink className="w-3.5 h-3.5" />}
                  className="w-full"
                >
                  Inspect Telemetry
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pond Detail Slide-Over Sheet */}
      <PondDetailSheet
        pond={selectedPond}
        onClose={() => setSelectedPond(null)}
        onToggleAerator={toggleAerator}
        onShowToast={onShowToast}
      />
    </div>
  );
};
