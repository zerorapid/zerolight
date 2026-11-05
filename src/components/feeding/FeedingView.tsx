import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MetricCard } from '@/components/ui/MetricCard';
import { Tooltip } from '@/components/ui/Tooltip';
import { PageHeaderCard } from '@/components/ui/PageHeaderCard';
import {
  Package,
  TrendingUp,
  Sliders,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Info,
  Calendar,
  Scale,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedingViewProps {
  onShowToast?: (text: string, type?: 'success' | 'error') => void;
}

interface TrayStatus {
  id: string;
  name: string;
  location: string;
  consumptionPct: number;
  status: 'Clean (100%)' | 'Normal (85%)' | 'Underfed' | 'Overfed';
  inspectedAt: string;
}

const TRAYS: TrayStatus[] = [
  {
    id: 'TR-1',
    name: 'Tray Alpha',
    location: 'North-East Sector',
    consumptionPct: 96,
    status: 'Clean (100%)',
    inspectedAt: '18m ago',
  },
  {
    id: 'TR-2',
    name: 'Tray Beta',
    location: 'South-East Sector',
    consumptionPct: 88,
    status: 'Normal (85%)',
    inspectedAt: '18m ago',
  },
  {
    id: 'TR-3',
    name: 'Tray Gamma',
    location: 'South-West Sector',
    consumptionPct: 92,
    status: 'Clean (100%)',
    inspectedAt: '22m ago',
  },
  {
    id: 'TR-4',
    name: 'Tray Delta',
    location: 'North-West Sector',
    consumptionPct: 76,
    status: 'Normal (85%)',
    inspectedAt: '22m ago',
  },
];

export const FeedingView: React.FC<FeedingViewProps> = ({ onShowToast }) => {
  const [fcrTarget, setFcrTarget] = useState<number>(1.28);
  const [selectedPond, setSelectedPond] = useState<string>('Pond 01');
  const [isDispensing, setIsDispensing] = useState<boolean>(false);
  const [hoveredDoc, setHoveredDoc] = useState<number | null>(null);

  // Economic calculations based on dynamic FCR
  const targetBiomassKg = 15000;
  const feedCostPerKg = 1.45; // USD
  const totalFeedKg = Math.round(targetBiomassKg * fcrTarget);
  const totalFeedCost = totalFeedKg * feedCostPerKg;
  const baselineCost = targetBiomassKg * 1.4 * feedCostPerKg;
  const costDelta = baselineCost - totalFeedCost;

  const handleDispense = () => {
    setIsDispensing(true);
    onShowToast?.(`Initiating automated acoustic feeding cycle for ${selectedPond}...`);
    setTimeout(() => {
      setIsDispensing(false);
      onShowToast?.(`Fed 25.5 kg into ${selectedPond}. Feed spread 18m radius.`);
    }, 2000);
  };

  const handleSaveFcr = () => {
    onShowToast?.(`Updated FCR target to ${fcrTarget.toFixed(2)} for ${selectedPond}. Feeding tables adjusted.`);
  };

  // S-Curve Coordinates for SVG Canvas (Viewbox: 0 0 700 240)
  // DOC 0 to 120, Biomass 0 to 16,000 kg
  const sCurveTargetPoints = [
    { doc: 0, kg: 200, x: 50, y: 215 },
    { doc: 20, kg: 1100, x: 140, y: 198 },
    { doc: 40, kg: 3400, x: 230, y: 165 },
    { doc: 60, kg: 7200, x: 320, y: 118 },
    { doc: 80, kg: 11800, x: 420, y: 65 },
    { doc: 100, kg: 14850, x: 520, y: 35 },
    { doc: 120, kg: 15600, x: 640, y: 25 },
  ];

  const actualFarmPoints = [
    { doc: 0, kg: 200, x: 50, y: 215 },
    { doc: 20, kg: 1250, x: 140, y: 195 },
    { doc: 40, kg: 3750, x: 230, y: 160 },
    { doc: 60, kg: 7800, x: 320, y: 110 },
    { doc: 80, kg: 12200, x: 420, y: 60 },
    { doc: 92, kg: 14200, x: 480, y: 42 }, // Current DOC 92
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Sticky Sub-Menu Header Dock with Smooth Fade */}
      <div className="sticky top-[86px] z-20 bg-canvas/95 backdrop-blur-md pt-1 pb-3 -mt-1 flex flex-col gap-2">
        <PageHeaderCard
          icon={<Package className="w-5 h-5 stroke-[2.2]" />}
          iconBg="bg-[#0B0F19] text-white"
          title="Biomass Growth & Precision Feeding"
          subtitle="Sigmoidal S-curve projections, dynamic FCR economic simulator, and feeding tray consumption"
          badge="Acoustic Auto-Feed v3"
          badgeVariant="default"
          tooltip={{
            title: 'Precision Feed Dispensing',
            description: 'Hydrophone feeding sensors & S-curve biomass tracking',
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
                      onShowToast?.(`Viewing biomass telemetry for ${p}`);
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
                variant={isDispensing ? 'secondary' : 'black'}
                size="sm"
                onClick={handleDispense}
                disabled={isDispensing}
                icon={<Zap className="w-3.5 h-3.5 text-amber-400" />}
              >
                {isDispensing ? 'Dispensing Feed...' : 'Trigger Auto Dispenser'}
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
          title="Standing Biomass"
          value="14,200 kg"
          subtext="Target: 15,000 kg"
          delta="+8.4%"
          isPositive={true}
          icon={<Scale className="w-4 h-4 text-brand-accent stroke-[2.2]" />}
          sparklineData={[11000, 11800, 12400, 13100, 13600, 14000, 14200]}
        />
        <MetricCard
          title="Mean Body Weight (MBW)"
          value="24.6 g"
          subtext="Growth: 0.32 g/day"
          delta="+8.0%"
          isPositive={true}
          icon={<TrendingUp className="w-4 h-4 text-emerald-500 stroke-[2.2]" />}
          sparklineData={[18.2, 19.5, 20.8, 22.1, 23.0, 23.9, 24.6]}
        />
        <MetricCard
          title="Daily Feed Ration"
          value="412.5 kg/d"
          subtext="4 Doses • Next 14:00"
          delta="+2.9%"
          isPositive={true}
          icon={<Package className="w-4 h-4 text-amber-500 stroke-[2.2]" />}
          sparklineData={[380, 390, 395, 400, 405, 410, 412.5]}
        />
        <MetricCard
          title="Effective FCR"
          value={fcrTarget.toFixed(2)}
          subtext={`Saving $${Math.round(costDelta).toLocaleString()}`}
          delta="-0.12"
          isPositive={true}
          icon={<DollarSign className="w-4 h-4 text-[#0B0F19] stroke-[2.2]" />}
          sparklineData={[1.45, 1.42, 1.38, 1.34, 1.31, 1.29, fcrTarget]}
        />
      </div>

      {/* Main Grid: Interactive S-Curve Chart + Dynamic FCR Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): S-Curve Biomass Projection SVG Chart */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card padding="lg" className="flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-content-main">
                    Sigmoidal Biomass Growth Curve (S-Curve)
                  </h3>
                  <Badge variant="brand" size="sm">
                    Von Bertalanffy
                  </Badge>
                </div>
                <p className="text-xs text-content-muted mt-0.5">
                  Actual production trajectory vs mathematical model with harvest transition zone
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-content-main">
                  <span className="w-3 h-0.5 bg-[#0B0F19]" /> Target Model
                </span>
                <span className="flex items-center gap-1.5 text-[#0284C7]">
                  <span className="w-3 h-1 bg-[#0284C7] rounded-full" /> Actual Trajectory
                </span>
              </div>
            </div>

            {/* SVG Graph Canvas */}
            <div className="relative w-full bg-[#FAF8F5] rounded-cluster border border-border-subtle p-4 overflow-hidden">
              <svg
                viewBox="0 0 700 240"
                className="w-full h-auto overflow-visible select-none"
              >
                {/* Horizontal Grid lines */}
                <line x1="50" y1="35" x2="650" y2="35" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="50" y1="85" x2="650" y2="85" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="50" y1="135" x2="650" y2="135" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="50" y1="185" x2="650" y2="185" stroke="#E2E8F0" strokeDasharray="3 3" />

                {/* Y-axis labels */}
                <text x="42" y="38" fontSize="10" textAnchor="end" fill="#94A3B8" fontWeight="600">15k kg</text>
                <text x="42" y="88" fontSize="10" textAnchor="end" fill="#94A3B8" fontWeight="600">10k kg</text>
                <text x="42" y="138" fontSize="10" textAnchor="end" fill="#94A3B8" fontWeight="600">5k kg</text>
                <text x="42" y="188" fontSize="10" textAnchor="end" fill="#94A3B8" fontWeight="600">1k kg</text>

                {/* X-axis labels */}
                <text x="50" y="235" fontSize="10" textAnchor="middle" fill="#94A3B8" fontWeight="600">DOC 0</text>
                <text x="140" y="235" fontSize="10" textAnchor="middle" fill="#94A3B8" fontWeight="600">DOC 20</text>
                <text x="230" y="235" fontSize="10" textAnchor="middle" fill="#94A3B8" fontWeight="600">DOC 40</text>
                <text x="320" y="235" fontSize="10" textAnchor="middle" fill="#94A3B8" fontWeight="600">DOC 60</text>
                <text x="420" y="235" fontSize="10" textAnchor="middle" fill="#94A3B8" fontWeight="600">DOC 80</text>
                <text x="520" y="235" fontSize="10" textAnchor="middle" fill="#94A3B8" fontWeight="600">DOC 100</text>
                <text x="640" y="235" fontSize="10" textAnchor="middle" fill="#94A3B8" fontWeight="600">DOC 120</text>

                {/* Harvest Zone Highlight */}
                <rect x="470" y="20" width="160" height="200" fill="#10B981" fillOpacity="0.08" rx="8" />
                <text x="550" y="32" fontSize="10" textAnchor="middle" fill="#059669" fontWeight="700">OPTIMAL HARVEST WINDOW</text>

                {/* Theoretical S-Curve Path */}
                <path
                  d="M 50 215 C 200 215, 270 140, 370 85 C 470 30, 560 25, 640 25"
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />

                {/* Actual Farm Growth Curve */}
                <path
                  d="M 50 215 C 190 210, 260 135, 360 80 C 420 50, 460 42, 480 42"
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Actual Milestone Points */}
                {actualFarmPoints.map((pt, idx) => (
                  <g
                    key={pt.doc}
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredDoc(pt.doc)}
                    onMouseLeave={() => setHoveredDoc(null)}
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={hoveredDoc === pt.doc ? 7 : 5}
                      className={cn(
                        'transition-all',
                        idx === actualFarmPoints.length - 1
                          ? 'fill-[#0B0F19] stroke-white stroke-2'
                          : 'fill-[#0284C7] stroke-white stroke-2'
                      )}
                    />
                  </g>
                ))}

                {/* Current DOC 92 Marker */}
                <line x1="480" y1="42" x2="480" y2="220" stroke="#0B0F19" strokeWidth="1.5" strokeDasharray="2 2" />
                <rect x="440" y="10" width="80" height="22" rx="11" fill="#0B0F19" />
                <text x="480" y="24" fontSize="10" textAnchor="middle" fill="#FFFFFF" fontWeight="700">DOC 92 (Today)</text>
              </svg>
            </div>

            {/* Explanatory Callout */}
            <div className="flex items-center justify-between text-xs font-semibold text-content-muted mt-4 pt-3 border-t border-border-subtle">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-content-tertiary" />
                Sigmoid saturation point projected at DOC 105 (15,400 kg maximum carry capacity).
              </span>
              <span className="text-[#0284C7] font-bold">13 Days to Harvest Window</span>
            </div>
          </Card>

          {/* Feeding Trays Consumption Status */}
          <Card padding="lg" className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-content-main">Observation Check Trays</h3>
                <p className="text-xs text-content-muted">45-minute appetite evaluation following dosing</p>
              </div>
              <Badge variant="success" size="sm">
                4/4 Monitored
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TRAYS.map((tray) => (
                <div
                  key={tray.id}
                  className="p-3.5 rounded-cluster bg-[#F8FAFC] border border-border-subtle flex flex-col gap-2 hover:bg-white hover:shadow-xs transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-content-main">{tray.name}</span>
                      <span className="text-[11px] text-content-muted block">{tray.location}</span>
                    </div>
                    <Badge variant={tray.consumptionPct >= 90 ? 'success' : 'brand'} size="sm">
                      {tray.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-surface-subtle overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          tray.consumptionPct >= 90 ? 'bg-[#10B981]' : 'bg-[#0284C7]'
                        )}
                        style={{ width: `${tray.consumptionPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-content-main">{tray.consumptionPct}%</span>
                  </div>

                  <span className="text-[10px] text-content-muted">Checked {tray.inspectedAt}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (5 Cols): Dynamic FCR Simulator & Feed Inventory */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Dynamic FCR Simulator Card */}
          <Card padding="lg" className="flex flex-col border-2 border-border-subtle bg-gradient-to-b from-white to-[#FAF8F5]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-content-main">Target FCR Simulator</h3>
                <p className="text-xs text-content-muted">Dynamic economic feed efficiency modeling</p>
              </div>
              <Tooltip
                content={{
                  title: 'FCR Simulation Model',
                  description: 'Dynamic feed budget modeling vs. water nitrogen loading',
                }}
                side="left"
              >
                <span className="p-1 rounded-full text-content-tertiary hover:text-content-main cursor-pointer">
                  <Info className="w-4 h-4" />
                </span>
              </Tooltip>
            </div>

            {/* Slider Control Container */}
            <div className="p-4 rounded-cluster bg-white border border-border-subtle shadow-xs mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-content-muted">Simulate FCR Target</span>
                <span className="text-lg font-bold text-content-main px-3 py-0.5 rounded-full bg-[#0B0F19] text-white">
                  {fcrTarget.toFixed(2)}
                </span>
              </div>

              <input
                type="range"
                min="1.05"
                max="1.70"
                step="0.01"
                value={fcrTarget}
                onChange={(e) => setFcrTarget(parseFloat(e.target.value))}
                className="w-full h-2 bg-[#E2E8F0] rounded-full appearance-none cursor-pointer accent-[#0B0F19]"
              />

              <div className="flex justify-between text-[10px] font-bold text-content-muted mt-2">
                <span>1.05 (World Class)</span>
                <span>1.40 (Industry Avg)</span>
                <span>1.70 (Inefficient)</span>
              </div>
            </div>

            {/* Real-time Economic Impact Breakdown */}
            <div className="flex flex-col gap-2.5 mb-5">
              <div className="flex items-center justify-between p-3 rounded-cluster bg-[#F8FAFC] border border-border-subtle">
                <span className="text-xs font-semibold text-content-muted">Total Projected Feed</span>
                <span className="text-xs font-bold text-content-main">{totalFeedKg.toLocaleString()} kg</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-cluster bg-[#F8FAFC] border border-border-subtle">
                <span className="text-xs font-semibold text-content-muted">Total Feed Cost (@ $1.45/kg)</span>
                <span className="text-xs font-bold text-content-main">${totalFeedCost.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-cluster bg-[#FAF8F5] border border-border-subtle">
                <span className="text-xs font-bold text-content-main">Estimated Cost Savings</span>
                <span
                  className={cn(
                    'text-xs font-bold px-2 py-0.5 rounded-full',
                    costDelta >= 0
                      ? 'bg-[#D1FAE5] text-[#065F46]'
                      : 'bg-[#FEE2E2] text-[#991B1B]'
                  )}
                >
                  {costDelta >= 0 ? `+$${Math.round(costDelta).toLocaleString()} Saved` : `-$${Math.abs(Math.round(costDelta)).toLocaleString()} Deficit`}
                </span>
              </div>
            </div>

            {/* Obsidian Black Action Button */}
            <Button
              variant="black"
              size="md"
              onClick={handleSaveFcr}
              className="w-full"
              icon={<CheckCircle2 className="w-4 h-4 stroke-[2.2]" />}
            >
              Apply FCR Target to Ration Schedules
            </Button>
          </Card>

          {/* Feed Batch Inventory & Nutrition */}
          <Card padding="lg" className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-content-main">Warehouse Feed Inventory</h3>
                <p className="text-xs text-content-muted">Batch: #AQF-EXT-2026-B4</p>
              </div>
              <Badge variant="brand" size="sm">
                Pellet 1.8mm
              </Badge>
            </div>

            {/* Warehouse Stock Runway */}
            <div className="flex flex-col gap-1.5 mb-4">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-content-muted">Warehouse Runway</span>
                <span className="text-content-main font-bold">284 Bags (7,100 kg) &bull; 17.2 Days</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-subtle overflow-hidden">
                <div className="h-full rounded-full bg-[#10B981]" style={{ width: '68%' }} />
              </div>
            </div>

            {/* Nutritional Specifications */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-cluster bg-[#F8FAFC] border border-border-subtle">
                <span className="text-[10px] font-bold text-content-muted uppercase">Crude Protein</span>
                <span className="text-sm font-bold text-content-main block">38.5%</span>
                <span className="text-[10px] text-content-muted">High marine meal</span>
              </div>

              <div className="p-2.5 rounded-cluster bg-[#F8FAFC] border border-border-subtle">
                <span className="text-[10px] font-bold text-content-muted uppercase">Crude Lipid</span>
                <span className="text-sm font-bold text-content-main block">8.2%</span>
                <span className="text-[10px] text-content-muted">Fish oil enriched</span>
              </div>

              <div className="p-2.5 rounded-cluster bg-[#F8FAFC] border border-border-subtle">
                <span className="text-[10px] font-bold text-content-muted uppercase">Moisture Content</span>
                <span className="text-sm font-bold text-content-main block">9.4%</span>
                <span className="text-[10px] text-status-success font-medium">Safe storage</span>
              </div>

              <div className="p-2.5 rounded-cluster bg-[#F8FAFC] border border-border-subtle">
                <span className="text-[10px] font-bold text-content-muted uppercase">Stability in Water</span>
                <span className="text-sm font-bold text-content-main block">&gt; 180 min</span>
                <span className="text-[10px] text-content-muted">Zero dissolution</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
