import React from 'react';
import { MetricCard } from '@/components/ui/MetricCard';
import { TelemetryChartCard } from './TelemetryChartCard';
import { PondMatrixCard } from './PondMatrixCard';
import { ActivityFeedCard } from '@/components/ui/ActivityFeedCard';
import { UsageMeterCard } from '@/components/ui/UsageMeterCard';
import { QuickActionCard } from '@/components/ui/QuickActionCard';
import { RadialProgressCard } from '@/components/ui/RadialProgressCard';
import { PageHeaderCard } from '@/components/ui/PageHeaderCard';
import { Button } from '@/components/ui/Button';
import { ShimmerButton } from '@/components/ui/ShimmerButton';
import {
  Droplets,
  Thermometer,
  Layers,
  Zap,
  BarChart3,
  Download,
  FileSpreadsheet,
} from 'lucide-react';

interface AnalyticsViewProps {
  onShowToast?: (text: string, type?: 'success' | 'error') => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onShowToast }) => {
  const metrics = [
    {
      title: 'Average Dissolved Oxygen',
      value: '6.4 mg/L',
      delta: '+4.2%',
      isPositive: true,
      icon: <Droplets className="w-4 h-4 text-[#0284C7] stroke-[2.2]" />,
      subtext: 'Safe threshold (> 5.0 mg/L)',
      sparkline: [5.8, 6.0, 5.9, 6.2, 6.1, 6.3, 6.4],
    },
    {
      title: 'Mean Sector Temp',
      value: '28.4 °C',
      delta: '-0.3 °C',
      isPositive: true,
      icon: <Thermometer className="w-4 h-4 text-[#F59E0B] stroke-[2.2]" />,
      subtext: 'Optimal range (26-30 °C)',
      sparkline: [28.8, 28.7, 28.5, 28.6, 28.4, 28.5, 28.4],
    },
    {
      title: 'Total Active Biomass',
      value: '30,600 kg',
      delta: '+640 kg',
      isPositive: true,
      icon: <Layers className="w-4 h-4 text-[#10B981] stroke-[2.2]" />,
      subtext: '4 Ponds across Sector Alpha',
      sparkline: [29200, 29500, 29800, 30100, 30300, 30450, 30600],
    },
    {
      title: 'Daily Feed Dispatched',
      value: '835 kg/d',
      delta: '+12 kg',
      isPositive: true,
      icon: <Zap className="w-4 h-4 text-[#0B0F19] stroke-[2.2]" />,
      subtext: 'FCR 1.28 (High Efficiency)',
      sparkline: [810, 815, 820, 825, 830, 830, 835],
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Sticky Sub-Menu Header Dock with Smooth Fade */}
      <div className="sticky top-[86px] z-20 bg-canvas/95 backdrop-blur-md pt-1 pb-3 -mt-1 flex flex-col gap-2">
        <PageHeaderCard
          icon={<BarChart3 className="w-5 h-5 stroke-[2.2]" />}
          iconBg="bg-brand-solid text-white"
          title="Enterprise Telemetry Analytics & Executive Reporting"
          subtitle="Sector Alpha live sensor telemetry, water diagnostics & biomass yield curves"
          badge="Live Stream Active"
          badgeVariant="brand"
          tooltip={{
            title: 'Executive Analytics',
            description: 'Synthesized water chemistry, feeding metrics and automated alerts',
          }}
          actions={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onShowToast?.('Exporting Telemetry Analytics CSV...')}
                icon={<Download className="w-3.5 h-3.5 stroke-[2.2]" />}
              >
                Export CSV
              </Button>
              <ShimmerButton
                size="sm"
                onClick={() => onShowToast?.('Generating Executive PDF Report...')}
                icon={<FileSpreadsheet className="w-3.5 h-3.5 stroke-[2.2]" />}
              >
                Executive PDF
              </ShimmerButton>
            </>
          }
        />
        {/* Organic Dissolving Feather */}
        <div className="h-6 w-full pointer-events-none bg-gradient-to-b from-canvas via-canvas/60 to-transparent -mb-6" />
      </div>

      {/* ROW 1: 4 Metric Cards with Live Micro Sparklines and Hover Lift */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <MetricCard
            key={idx}
            title={m.title}
            value={m.value}
            delta={m.delta}
            isPositive={m.isPositive}
            icon={m.icon}
            subtext={m.subtext}
            sparklineData={m.sparkline}
          />
        ))}
      </div>

      {/* ROW 2: Rebuilt Interactive Dual-Axis Telemetry Stream Chart */}
      <TelemetryChartCard />

      {/* ROW 3: High-Density 12-Column Operations & Governance Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 Cols): Multi-Pond Live Matrix + Filterable Activity Audit Stream */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <PondMatrixCard />
          <ActivityFeedCard />
        </div>

        {/* Right Column (5 Cols): Health Index + Resource Quotas + Automation Workflows */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <RadialProgressCard score={94} grade="Optimal / Grade A+" />
          <UsageMeterCard planName="Enterprise Sector Cluster" />
          <QuickActionCard />
        </div>
      </div>
    </div>
  );
};
