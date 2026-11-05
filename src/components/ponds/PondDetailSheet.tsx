import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import {
  X,
  Waves,
  Wind,
  Thermometer,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  Sliders,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PondDetailData {
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

interface PondDetailSheetProps {
  pond: PondDetailData | null;
  onClose: () => void;
  onToggleAerator: (id: string) => void;
  onShowToast?: (text: string, type?: 'success' | 'error') => void;
}

export const PondDetailSheet: React.FC<PondDetailSheetProps> = ({
  pond,
  onClose,
  onToggleAerator,
  onShowToast,
}) => {
  if (!pond) return null;

  const isCritical = pond.status === 'Critical';
  const progressPct = Math.min(100, Math.round((pond.biomass / pond.targetBiomass) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
        onClick={onClose}
      />

      {/* Slide-over Drawer (Pure light surface, obsidian black accents) */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl z-10 flex flex-col overflow-y-auto no-scrollbar animate-in slide-in-from-right duration-250 border-l border-border-subtle">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm p-5 border-b border-border-subtle flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0B0F19] text-white flex items-center justify-center shrink-0">
              <Waves className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-content-main">{pond.name} Live Diagnostics</h2>
                <Badge
                  variant={pond.status === 'Normal' ? 'success' : pond.status === 'Attention' ? 'warning' : 'error'}
                  size="sm"
                >
                  {pond.status}
                </Badge>
              </div>
              <span className="text-xs text-content-muted font-medium">
                {pond.species} &bull; Phase: {pond.phase} &bull; Sector Alpha
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F4F5F8] hover:bg-[#E2E8F0] flex items-center justify-center text-content-muted hover:text-content-main transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col gap-6 flex-1">
          {/* Key Water Parameters Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-cluster bg-[#F8FAFC] border border-border-subtle flex flex-col items-center">
              <span className="text-[10px] font-bold text-content-muted uppercase">Dissolved O₂</span>
              <span className={cn('text-lg font-bold mt-0.5', isCritical ? 'text-status-error' : 'text-content-main')}>
                {pond.do.toFixed(1)} <span className="text-[10px] font-normal text-content-muted">mg/L</span>
              </span>
              <span className="text-[9px] font-semibold text-status-success mt-1">Normal &gt; 5.0</span>
            </div>

            <div className="p-3 rounded-cluster bg-[#F8FAFC] border border-border-subtle flex flex-col items-center">
              <span className="text-[10px] font-bold text-content-muted uppercase">Water Temp</span>
              <span className="text-lg font-bold text-content-main mt-0.5">
                {pond.temp.toFixed(1)}° <span className="text-[10px] font-normal text-content-muted">C</span>
              </span>
              <span className="text-[9px] font-semibold text-content-muted mt-1">Opt: 28-31°C</span>
            </div>

            <div className="p-3 rounded-cluster bg-[#F8FAFC] border border-border-subtle flex flex-col items-center">
              <span className="text-[10px] font-bold text-content-muted uppercase">Acidity (pH)</span>
              <span className="text-lg font-bold text-content-main mt-0.5">
                {pond.ph.toFixed(2)}
              </span>
              <span className="text-[9px] font-semibold text-content-muted mt-1">Opt: 7.5-8.2</span>
            </div>
          </div>

          {/* 24-Hour Dissolved Oxygen Historical Sparkline */}
          <div className="p-4 rounded-cluster bg-[#FAF8F5] border border-border-subtle flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-content-main">24h Diurnal Dissolved Oxygen Curve</span>
              <span className="text-[11px] text-content-muted font-medium">Night Minimum: 4.8 mg/L</span>
            </div>

            {/* SVG Diurnal Curve */}
            <svg viewBox="0 0 400 80" className="w-full h-20 overflow-visible">
              <defs>
                <linearGradient id="doGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284C7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Critical threshold line */}
              <line x1="0" y1="60" x2="400" y2="60" stroke="#EF4444" strokeWidth="1" strokeDasharray="3 3" />
              <text x="395" y="56" fontSize="9" textAnchor="end" fill="#EF4444" fontWeight="600">Critical: 4.0 mg/L</text>

              {/* Area */}
              <path
                d="M 0 35 C 50 38, 90 62, 140 58 C 200 48, 250 18, 300 20 C 350 24, 380 30, 400 32 L 400 80 L 0 80 Z"
                fill="url(#doGradient)"
              />
              {/* Stroke */}
              <path
                d="M 0 35 C 50 38, 90 62, 140 58 C 200 48, 250 18, 300 20 C 350 24, 380 30, 400 32"
                fill="none"
                stroke="#0284C7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            <div className="flex justify-between text-[10px] font-semibold text-content-muted">
              <span>00:00 (Midnight)</span>
              <span>06:00 (Dawn Dip)</span>
              <span>12:00 (Noon High)</span>
              <span>18:00 (Sunset)</span>
            </div>
          </div>

          {/* Aerators & VFD Mechanical Telemetry */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-content-main">Active Aeration Systems</span>
              <Button
                variant={pond.aeratorRunning ? 'secondary' : 'black'}
                size="sm"
                onClick={() => onToggleAerator(pond.id)}
                icon={<Wind className="w-3.5 h-3.5" />}
              >
                {pond.aeratorRunning ? 'Pause Aerators' : 'Engage All Aerators'}
              </Button>
            </div>

            <div className="p-3.5 rounded-cluster bg-[#F8FAFC] border border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                    pond.aeratorRunning ? 'bg-[#0B0F19] text-white' : 'bg-surface-subtle text-content-muted'
                  )}
                >
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-content-main">Paddlewheel Aerator #1</span>
                  <span className="text-[11px] text-content-muted block">VFD 50 Hz &bull; 3.0 kW Power</span>
                </div>
              </div>
              <Badge variant={pond.aeratorRunning ? 'success' : 'neutral'} size="sm">
                {pond.aeratorRunning ? '880 RPM' : 'Idle'}
              </Badge>
            </div>

            <div className="p-3.5 rounded-cluster bg-[#F8FAFC] border border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                    pond.aeratorRunning ? 'bg-[#0B0F19] text-white' : 'bg-surface-subtle text-content-muted'
                  )}
                >
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-content-main">Submerged Venturi Injector #2</span>
                  <span className="text-[11px] text-content-muted block">Direct Bottom Oxygen Transfer</span>
                </div>
              </div>
              <Badge variant={pond.aeratorRunning ? 'success' : 'neutral'} size="sm">
                {pond.aeratorRunning ? 'Flow Active' : 'Off'}
              </Badge>
            </div>
          </div>

          {/* Biomass Growth Progress */}
          <div className="p-4 rounded-cluster bg-white border border-border-subtle flex flex-col gap-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-content-muted">Pond Carry Biomass</span>
              <span className="text-content-main font-bold">
                {pond.biomass.toLocaleString()} / {pond.targetBiomass.toLocaleString()} kg ({progressPct}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-subtle overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  isCritical ? 'bg-status-error' : 'bg-[#0284C7]'
                )}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-[10px] text-content-muted">
              Estimated days to target biomass: 18 days based on 1.28 FCR
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-border-subtle bg-[#FAF8F5] flex items-center justify-between gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              onShowToast?.(`Manual water sampling ticket initiated for ${pond.name}`);
              onClose();
            }}
          >
            Log Water Sample
          </Button>

          <Button
            variant="black"
            size="sm"
            onClick={() => {
              onShowToast?.(`Threshold safety limits updated for ${pond.name}`);
              onClose();
            }}
            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
          >
            Save & Close
          </Button>
        </div>
      </div>
    </div>
  );
};
