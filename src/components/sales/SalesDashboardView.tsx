import React, { useState } from 'react';
import { Download, FileSpreadsheet, Info, TrendingUp, Ship } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ShimmerButton } from '@/components/ui/ShimmerButton';
import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';
import { PageHeaderCard } from '@/components/ui/PageHeaderCard';
import { CapsuleSegment } from '@/components/ui/CapsuleSegment';
import { SalesKpiRow } from './components/SalesKpiRow';
import { SalesContractsTableCard } from './components/SalesContractsTableCard';
import { InvoiceVsShipmentsChart } from './components/InvoiceVsShipmentsChart';
import { CountryWisePieChart } from './components/CountryWisePieChart';
import { PortWisePieChart } from './components/PortWisePieChart';
import { PlantFulfillmentQuotaCard } from './components/PlantFulfillmentQuotaCard';
import { ShippedVsPendingQtyChart } from './components/ShippedVsPendingQtyChart';
import { FreightRatesAnalyzer } from './components/FreightRatesAnalyzer';

interface SalesDashboardViewProps {
  activeSubMenu?: string;
  onSelectSubMenu?: (sub: string) => void;
  onShowToast?: (text: string, type?: 'success' | 'error') => void;
}

const DASHBOARD_TABS = [
  { label: 'Overview', value: 'Overview' },
];

export const SalesDashboardView: React.FC<SalesDashboardViewProps> = ({
  activeSubMenu = 'DashBoard',
  onShowToast,
}) => {
  const isDashboard = activeSubMenu.toLowerCase() === 'dashboard';

  // Per user instruction: Remaining pages/submenus should not be shown anything
  if (!isDashboard) {
    return null;
  }

  const handleExportCSV = () => {
    onShowToast?.('Exporting Sales Manifest to CSV...');
  };

  const handleDownloadReport = () => {
    onShowToast?.('Generating Q4 Sales Audit PDF...');
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 1. Page Header Card (Clean Flowing Layout - No Stacking Collisions) */}
      <div className="w-full flex flex-col gap-3">
        <PageHeaderCard
          icon={<TrendingUp className="w-5 h-5 text-[#00a7bc] stroke-[2.2]" />}
          iconBg="bg-[#0B0F19]"
          title="Sales Operations Overview"
          subtitle="Global seafood export ledgers, reefer bill of ladings & port customs"
          actions={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportCSV}
                icon={<Download className="w-3.5 h-3.5 stroke-[2.2]" />}
              >
                Export Sales CSV
              </Button>
              <ShimmerButton
                size="sm"
                onClick={handleDownloadReport}
                icon={<FileSpreadsheet className="w-3.5 h-3.5 stroke-[2.2]" />}
              >
                Download Shipping Report
              </ShimmerButton>
            </>
          }
        />
      </div>

      {/* 1. ROW 1: 4 Balanced Metric Cards with Live Micro Sparklines */}
      <SalesKpiRow />

      {/* 2. ROW 2: Wide Data Deck (Full-Width) - Content-Aware Primary Transaction Ledger */}
      <SalesContractsTableCard onShowToast={onShowToast} />

      {/* 3. ROW 3: Balanced Analytical Split Row (col-7 + col-5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <InvoiceVsShipmentsChart />
        </div>
        <div className="lg:col-span-5">
          <PlantFulfillmentQuotaCard />
        </div>
      </div>

      {/* 4. ROW 4: Regional Distribution Comparative Pair (col-6 + col-6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6">
          <CountryWisePieChart />
        </div>
        <div className="lg:col-span-6">
          <PortWisePieChart />
        </div>
      </div>

      {/* 5. ROW 5: Full-Width Seafood Size Grade Comparison */}
      <ShippedVsPendingQtyChart />

      {/* 6. ROW 6: Strategic Ocean Logistics Spot Analyzer (Full-Width) */}
      <FreightRatesAnalyzer />
    </div>
  );
};
