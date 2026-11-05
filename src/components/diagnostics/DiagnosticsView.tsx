import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MetricCard } from '@/components/ui/MetricCard';
import { Tooltip } from '@/components/ui/Tooltip';
import { PageHeaderCard } from '@/components/ui/PageHeaderCard';
import {
  Droplets,
  Microscope,
  AlertTriangle,
  CheckCircle2,
  Activity,
  FileText,
  Sparkles,
  Info,
  Beaker,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiagnosticsViewProps {
  onShowToast?: (text: string, type?: 'success' | 'error') => void;
}

interface TCBSMetric {
  species: string;
  type: 'green' | 'yellow';
  colonyCount: number; // CFU/mL
  thresholdMax: number;
  status: 'safe' | 'caution' | 'danger';
  description: string;
}

const TCBS_DATA: TCBSMetric[] = [
  {
    species: 'Vibrio parahaemolyticus (Green)',
    type: 'green',
    colonyCount: 140,
    thresholdMax: 200,
    status: 'caution',
    description: 'Pathogenic luminous bacteria associated with Early Mortality Syndrome (AHPND).',
  },
  {
    species: 'Vibrio harveyi (Green)',
    type: 'green',
    colonyCount: 45,
    thresholdMax: 100,
    status: 'safe',
    description: 'Bioluminescent pathogen; maintained below physiological stress levels.',
  },
  {
    species: 'Vibrio alginolyticus (Yellow)',
    type: 'yellow',
    colonyCount: 8600,
    thresholdMax: 10000,
    status: 'safe',
    description: 'Beneficial probiotic competitor occupying ecological niches on epithelial lining.',
  },
  {
    species: 'Vibrio vulnificus (Green)',
    type: 'green',
    colonyCount: 12,
    thresholdMax: 50,
    status: 'safe',
    description: 'Opportunistic pathogen; negligible counts recorded across all pond sectors.',
  },
];

const ALGAE_SPECTRUM = [
  {
    name: 'Diatoms (Bacillariophyta)',
    pct: 64,
    color: 'bg-[#0284C7]', // Ocean blue
    border: 'border-[#0284C7]',
    textColor: 'text-[#0284C7]',
    bgLight: 'bg-[#E0F2FE]',
    role: 'Optimal feed source, rich in PUFAs and silicates',
    risk: 'Low Risk (Desirable)',
  },
  {
    name: 'Chlorophyta (Green Algae)',
    pct: 22,
    color: 'bg-[#10B981]', // Emerald
    border: 'border-[#10B981]',
    textColor: 'text-[#10B981]',
    bgLight: 'bg-[#D1FAE5]',
    role: 'Stabilizes dissolved oxygen; biofilters ammonia',
    risk: 'Stable',
  },
  {
    name: 'Cyanobacteria (Blue-Green)',
    pct: 11,
    color: 'bg-[#F59E0B]', // Amber
    border: 'border-[#F59E0B]',
    textColor: 'text-[#F59E0B]',
    bgLight: 'bg-[#FEF3C7]',
    role: 'Potential geosmin & 2-MIB taint; requires monitoring',
    risk: 'Cautionary Threshold (<15%)',
  },
  {
    name: 'Dinoflagellates',
    pct: 3,
    color: 'bg-[#EF4444]', // Crimson
    border: 'border-[#EF4444]',
    textColor: 'text-[#EF4444]',
    bgLight: 'bg-[#FEE2E2]',
    role: 'Toxin producer in warm hypersaline conditions',
    risk: 'Suppressed (<5%)',
  },
];

export const DiagnosticsView: React.FC<DiagnosticsViewProps> = ({ onShowToast }) => {
  const [selectedPond, setSelectedPond] = useState<string>('Pond 01');
  const [isInoculating, setIsInoculating] = useState<boolean>(false);
  const [activeTabSub, setActiveTabSub] = useState<'bacteriology' | 'algae' | 'optical'>('bacteriology');

  const handleRunInoculation = () => {
    setIsInoculating(true);
    onShowToast?.(`Initiated automated Bacillus probiotic dosing for ${selectedPond}...`);
    setTimeout(() => {
      setIsInoculating(false);
      onShowToast?.(`Probiotic dosing completed for ${selectedPond}. Colony suppression active.`);
    }, 2400);
  };

  const handleRetest = () => {
    onShowToast?.(`Laboratory TCBS PCR re-test scheduled for ${selectedPond}. Courier notified.`);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Sticky Sub-Menu Header Dock with Smooth Fade */}
      <div className="sticky top-[86px] z-20 bg-canvas/95 backdrop-blur-md pt-1 pb-3 -mt-1 flex flex-col gap-2">
        <PageHeaderCard
          icon={<Microscope className="w-5 h-5 stroke-[2.2]" />}
          iconBg="bg-[#0B0F19] text-white"
          title="Water Diagnostics & Microbiology"
          subtitle="Live microbiological pathogen profiling, Vibrio colony ratio, and phytoplankton speciation"
          badge="TCBS + Flow Cytometry"
          badgeVariant="default"
          tooltip={{
            title: 'Microbiological Profiling',
            description: 'TCBS agar counts & luminous bacteria monitoring',
          }}
          actions={
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center bg-[#F4F5F8] p-1 rounded-full border border-border-subtle">
                {['Pond 01', 'Pond 02', 'Pond 03', 'Pond 04'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setSelectedPond(p);
                      onShowToast?.(`Displaying diagnostic data for ${p}`);
                    }}
                    className={cn(
                      'px-3 py-1 text-xs font-bold rounded-full transition-all',
                      selectedPond === p
                        ? 'bg-[#0B0F19] text-white shadow-xs'
                        : 'text-content-muted hover:text-content-main'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <Button
                variant="black"
                size="sm"
                onClick={handleRetest}
                icon={<FileText className="w-3.5 h-3.5" />}
              >
                Order PCR Lab Test
              </Button>
            </div>
          }
        />
        {/* Organic Dissolving Feather */}
        <div className="h-6 w-full pointer-events-none bg-gradient-to-b from-canvas via-canvas/60 to-transparent -mb-6" />
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Green Vibrio (Pathogenic)"
          value="185 CFU/mL"
          subtext="Threshold: < 200 CFU/mL"
          delta="+12%"
          isPositive={false}
          icon={<ShieldAlert className="w-4 h-4 text-red-500 stroke-[2.2]" />}
          sparklineData={[120, 135, 140, 155, 168, 172, 185]}
        />
        <MetricCard
          title="Yellow Vibrio (Beneficial)"
          value="8,600 CFU/mL"
          subtext="Y:G Ratio: 46.5:1 (Optimal)"
          delta="+18%"
          isPositive={true}
          icon={<Beaker className="w-4 h-4 text-emerald-500 stroke-[2.2]" />}
          sparklineData={[6200, 6800, 7100, 7500, 7900, 8300, 8600]}
        />
        <MetricCard
          title="Microalgae Index"
          value="92 / 100"
          subtext="Diatom Fraction: 64%"
          delta="+3%"
          isPositive={true}
          icon={<Microscope className="w-4 h-4 text-brand-accent stroke-[2.2]" />}
          sparklineData={[84, 85, 87, 88, 89, 91, 92]}
        />
        <MetricCard
          title="Sediment Redox (ORP)"
          value="+245 mV"
          subtext="Critical Min: +50 mV"
          delta="+14 mV"
          isPositive={true}
          icon={<Activity className="w-4 h-4 text-[#0B0F19] stroke-[2.2]" />}
          sparklineData={[190, 205, 215, 220, 230, 240, 245]}
        />
      </div>

      {/* Main Grid: TCBS Plate Culture Matrix + Phytoplankton Spectrum */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): TCBS Bacterial Culture Analysis */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card padding="lg" className="flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-content-main">
                    Thiosulfate-Citrate-Bile Salts (TCBS) Plate Panel
                  </h3>
                  <Badge variant="brand" size="sm">
                    Lab Grade
                  </Badge>
                </div>
                <p className="text-xs text-content-muted mt-0.5">
                  Direct quantification of pathogenic sucrose-negative vs benign sucrose-positive Vibrio
                </p>
              </div>

              {/* Action Button Anchor */}
              <Button
                variant={isInoculating ? 'secondary' : 'black'}
                size="sm"
                onClick={handleRunInoculation}
                disabled={isInoculating}
                icon={<Sparkles className="w-3.5 h-3.5 text-amber-400" />}
              >
                {isInoculating ? 'Dispensing Probiotics...' : 'Trigger Probiotics'}
              </Button>
            </div>

            {/* Visual Agar Plate Preview Simulation */}
            <div className="p-4 rounded-cluster bg-[#FAF8F5] border border-border-subtle mb-5 flex flex-col md:flex-row items-center gap-5">
              {/* Simulated Agar Plate Visual */}
              <div className="relative w-28 h-28 rounded-full bg-[#1A3A2A] border-4 border-[#0B0F19] shadow-inner flex items-center justify-center shrink-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:10px_10px] opacity-40" />
                {/* Yellow colonies */}
                <div className="absolute top-5 left-7 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_6px_#fde047]" />
                <div className="absolute top-12 left-14 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fde047]" />
                <div className="absolute bottom-6 left-8 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_6px_#fde047]" />
                <div className="absolute bottom-10 right-6 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_6px_#fde047]" />
                <div className="absolute top-8 right-9 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_6px_#fde047]" />
                {/* Green colony (pathogen) */}
                <div className="absolute top-14 left-6 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500 shadow-[0_0_8px_#34d399]" />
                <div className="text-[9px] font-bold text-white/90 bg-[#0B0F19]/80 px-2 py-0.5 rounded-full backdrop-blur-xs tracking-wide">
                  TCBS 24h
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-1.5 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-content-main">
                    Plating Incubation Status: 24h at 35°C Complete
                  </span>
                  <Badge variant="success" size="sm">
                    Verified
                  </Badge>
                </div>
                <p className="text-xs text-content-muted leading-relaxed">
                  Agar scan reveals high density of competitive yellow colonies (<strong className="text-content-main">V. alginolyticus</strong>), which effectively starve virulent green colonies (<strong className="text-content-main">V. parahaemolyticus</strong>). Biological control index remains within safe parameters.
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold text-content-muted mt-1">
                  <span>Green Colonies: <strong className="text-status-warning">185 CFU</strong></span>
                  <span>Yellow Colonies: <strong className="text-status-success">8,600 CFU</strong></span>
                  <span>Ratio: <strong className="text-[#0284C7]">46.5x</strong></span>
                </div>
              </div>
            </div>

            {/* List of 4 Bacterial Strains */}
            <div className="flex flex-col gap-3">
              {TCBS_DATA.map((strain) => {
                const pct = Math.min(100, Math.round((strain.colonyCount / strain.thresholdMax) * 100));
                const isGreen = strain.type === 'green';
                const isCaution = strain.status === 'caution';

                return (
                  <div
                    key={strain.species}
                    className="p-3.5 rounded-cluster bg-[#F8FAFC] border border-border-subtle flex flex-col gap-2 hover:bg-white hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'w-2.5 h-2.5 rounded-full',
                            isGreen ? 'bg-[#10B981]' : 'bg-[#F59E0B]'
                          )}
                        />
                        <span className="text-xs font-bold text-content-main">{strain.species}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-content-main">
                          {strain.colonyCount.toLocaleString()} CFU/mL
                        </span>
                        <Badge variant={isCaution ? 'warning' : 'success'} size="sm">
                          {isCaution ? 'Near Limit' : 'Suppressed'}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-surface-subtle overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            isCaution ? 'bg-[#F59E0B]' : isGreen ? 'bg-[#10B981]' : 'bg-[#0284C7]'
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-content-muted shrink-0 w-24 text-right">
                        Max: {strain.thresholdMax.toLocaleString()} CFU
                      </span>
                    </div>

                    <p className="text-[11px] text-content-muted">{strain.description}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column (5 Cols): Microalgae Spectrum & High-Frequency Optical Matrix */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Microalgae Spectrum Card */}
          <Card padding="lg" className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-content-main">Microalgae Community</h3>
                <p className="text-xs text-content-muted">Phytoplankton taxonomy via flow cytometry</p>
              </div>
              <Tooltip
                content={{
                  title: 'Phytoplankton Taxonomy',
                  description: 'Maintains balanced water turbidity and organic DO without algae bloom crash',
                }}
                side="left"
              >
                <span className="p-1 rounded-full text-content-tertiary hover:text-content-main cursor-pointer">
                  <Info className="w-4 h-4" />
                </span>
              </Tooltip>
            </div>

            {/* Stacked Horizontal Bar Chart */}
            <div className="flex flex-col gap-2 mb-5">
              <div className="flex justify-between text-xs font-bold text-content-main">
                <span>Community Speciation</span>
                <span>100% Total Density</span>
              </div>

              {/* Responsive Multi-Color Stacked Bar */}
              <div className="w-full h-4 rounded-full overflow-hidden flex bg-surface-subtle shadow-inner">
                {ALGAE_SPECTRUM.map((algae) => (
                  <Tooltip
                    key={algae.name}
                    content={{
                      title: algae.name,
                      description: `${algae.pct}% density • ${algae.risk} profile.`,
                      tag: `${algae.pct}%`,
                    }}
                    side="top"
                  >
                    <div
                      className={cn('h-full transition-all duration-300 hover:opacity-80 cursor-pointer', algae.color)}
                      style={{ width: `${algae.pct}%` }}
                    />
                  </Tooltip>
                ))}
              </div>

              {/* Legend with Tints */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                {ALGAE_SPECTRUM.map((algae) => (
                  <div
                    key={algae.name}
                    className="p-2 rounded-cluster bg-[#F8FAFC] border border-border-subtle flex items-start gap-2"
                  >
                    <span className={cn('w-2 h-2 rounded-full mt-1 shrink-0', algae.color)} />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-content-main truncate">
                          {algae.name.split(' ')[0]}
                        </span>
                        <span className="text-[11px] font-bold text-content-muted">
                          {algae.pct}%
                        </span>
                      </div>
                      <span className="text-[10px] text-content-muted leading-tight">
                        {algae.risk}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostic Insight Note */}
            <div className="p-3 rounded-cluster bg-[#FAF8F5] border border-border-subtle flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-content-muted">
                <strong className="text-content-main font-semibold">Agronomist Recommendation:</strong>{' '}
                Diatom dominance (64%) ensures abundant natural live feed and optimal light attenuation (Secchi depth 32 cm). Maintain silicate supplementation.
              </div>
            </div>
          </Card>

          {/* High-Frequency Optical Gateway Matrix */}
          <Card padding="lg" className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-content-main">Optical Multi-Sensor Gateways</h3>
                <p className="text-xs text-content-muted">Calibrated submerged spectrophotometers</p>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-bold text-status-success">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                Live 1s Polling
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-cluster bg-[#F8FAFC] border border-border-subtle">
                <span className="text-[10px] font-bold text-content-muted uppercase">Turbidity (NTU)</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl font-bold text-content-main">18.4</span>
                  <span className="text-[10px] font-semibold text-content-muted">NTU</span>
                </div>
                <span className="text-[10px] text-status-success font-medium">Clear / Normal</span>
              </div>

              <div className="p-3 rounded-cluster bg-[#F8FAFC] border border-border-subtle">
                <span className="text-[10px] font-bold text-content-muted uppercase">BGA-Phycocyanin</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl font-bold text-content-main">3.2</span>
                  <span className="text-[10px] font-semibold text-content-muted">µg / L</span>
                </div>
                <span className="text-[10px] text-status-success font-medium">Safe (&lt;10 µg/L)</span>
              </div>

              <div className="p-3 rounded-cluster bg-[#F8FAFC] border border-border-subtle">
                <span className="text-[10px] font-bold text-content-muted uppercase">CDOM Organic Matter</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl font-bold text-content-main">14.1</span>
                  <span className="text-[10px] font-semibold text-content-muted">ppb QSE</span>
                </div>
                <span className="text-[10px] text-status-success font-medium">Low Accumulation</span>
              </div>

              <div className="p-3 rounded-cluster bg-[#F8FAFC] border border-border-subtle">
                <span className="text-[10px] font-bold text-content-muted uppercase">Salinity Refraction</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl font-bold text-content-main">22.8</span>
                  <span className="text-[10px] font-semibold text-content-muted">ppt</span>
                </div>
                <span className="text-[10px] text-status-success font-medium">Optimal Penaeid</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
