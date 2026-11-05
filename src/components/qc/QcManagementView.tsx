import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ShimmerButton } from '@/components/ui/ShimmerButton';
import { Input } from '@/components/ui/Input';
import { MetricCard } from '@/components/ui/MetricCard';
import { CapsuleSegment } from '@/components/ui/CapsuleSegment';
import { Tooltip } from '@/components/ui/Tooltip';
import { PageHeaderCard } from '@/components/ui/PageHeaderCard';
import { RadialProgressCard } from '@/components/ui/RadialProgressCard';
import { UsageMeterCard } from '@/components/ui/UsageMeterCard';
import { QuickActionCard, AutomationRule } from '@/components/ui/QuickActionCard';
import {
  ShieldCheck,
  Search,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  Package,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Droplets,
  Thermometer,
  Activity,
  Server,
  HardDrive,
  Truck,
  Zap,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QcManagementViewProps {
  onShowToast?: (text: string, type?: 'success' | 'error') => void;
}

interface LotRecord {
  id: string;
  lotNo: string;
  supplier: string;
  center: string;
  harvestDate: string;
  weightKg: number;
  qcResult: 'Passed (Negative)' | 'In Review' | 'Positive (Alert)';
  status: 'RELEASED' | 'HOLD' | 'UNDER QC';
}

interface PoRecord {
  sNo: number;
  poNo: string;
  buyer: string;
  brand: string;
  packingDate: string;
  country: string;
  productDesc: string;
  packingStyle: string;
  releaseStatus: 'RELEASED' | 'INSPECTION PENDING' | 'TCBS RETEST';
}

const INITIAL_LOTS: LotRecord[] = [
  {
    id: 'LOT-1',
    lotNo: 'DMS1231012',
    supplier: 'Murugappa Aqua Farms',
    center: 'Bhimavaram Central',
    harvestDate: '24-Oct-2026',
    weightKg: 122500,
    qcResult: 'Passed (Negative)',
    status: 'RELEASED',
  },
  {
    id: 'LOT-2',
    lotNo: 'NLOT2026023',
    supplier: 'Coastal Aqua Tech',
    center: 'Nellore Facility',
    harvestDate: '23-Oct-2026',
    weightKg: 35000,
    qcResult: 'Passed (Negative)',
    status: 'RELEASED',
  },
  {
    id: 'LOT-3',
    lotNo: 'AML01026033',
    supplier: 'Godavari Bio-Harvest',
    center: 'Amalapuram Hub',
    harvestDate: '22-Oct-2026',
    weightKg: 78000,
    qcResult: 'In Review',
    status: 'UNDER QC',
  },
  {
    id: 'LOT-4',
    lotNo: 'NLOT2026024',
    supplier: 'Venkateswara Aqua',
    center: 'Nellore Facility',
    harvestDate: '21-Oct-2026',
    weightKg: 42000,
    qcResult: 'Positive (Alert)',
    status: 'HOLD',
  },
  {
    id: 'LOT-5',
    lotNo: 'BMS1231014',
    supplier: 'Royal Marine Farms',
    center: 'Bhimavaram Central',
    harvestDate: '20-Oct-2026',
    weightKg: 21400,
    qcResult: 'Passed (Negative)',
    status: 'RELEASED',
  },
  {
    id: 'LOT-6',
    lotNo: 'ONG1022026',
    supplier: 'Pranitha Bio-Exports',
    center: 'Ongole Hub',
    harvestDate: '19-Oct-2026',
    weightKg: 16500,
    qcResult: 'Passed (Negative)',
    status: 'RELEASED',
  },
  {
    id: 'LOT-7',
    lotNo: 'KKD1231025',
    supplier: 'Kora Aqua Industries',
    center: 'Kakinada Port Hub',
    harvestDate: '18-Oct-2026',
    weightKg: 18000,
    qcResult: 'Passed (Negative)',
    status: 'RELEASED',
  },
  {
    id: 'LOT-8',
    lotNo: 'BMS1231015',
    supplier: 'Divya Sankalp Aqua',
    center: 'Bhimavaram Central',
    harvestDate: '18-Oct-2026',
    weightKg: 5500,
    qcResult: 'Passed (Negative)',
    status: 'RELEASED',
  },
];

const INITIAL_POS: PoRecord[] = [
  {
    sNo: 1,
    poNo: 'PO-98412',
    buyer: 'Sysco Corporation',
    brand: 'Devi Royal',
    packingDate: '18-Oct-2026',
    country: 'USA',
    productDesc: 'HLSO P. vannamei 16/20 IQF Block Frozen',
    packingStyle: '6 x 4 LBS',
    releaseStatus: 'RELEASED',
  },
  {
    sNo: 2,
    poNo: 'PO-98413',
    buyer: 'Apex Ocean Prime',
    brand: 'Ocean Crest',
    packingDate: '19-Oct-2026',
    country: 'USA',
    productDesc: 'PDTO Raw Tail-On 21/25 Quick Frozen',
    packingStyle: '10 x 1 KG',
    releaseStatus: 'RELEASED',
  },
  {
    sNo: 3,
    poNo: 'PO-98414',
    buyer: 'Red Lobster USA',
    brand: 'Golden Harvest',
    packingDate: '20-Oct-2026',
    country: 'USA',
    productDesc: 'Cooked Peeled Tail-On 26/30 Glazed',
    packingStyle: '5 x 2 LBS',
    releaseStatus: 'RELEASED',
  },
  {
    sNo: 4,
    poNo: 'PO-98415',
    buyer: 'Maruha Nichiro (Japan)',
    brand: 'Pacific Wave',
    packingDate: '21-Oct-2026',
    country: 'Japan',
    productDesc: 'Nobashi Ebi Stretched Shrimp 30 pcs Tray',
    packingStyle: '20 x 300 G',
    releaseStatus: 'INSPECTION PENDING',
  },
  {
    sNo: 5,
    poNo: 'PO-98416',
    buyer: 'Seafood Imports Canada',
    brand: 'Devi Selection',
    packingDate: '22-Oct-2026',
    country: 'Canada',
    productDesc: 'Easy Peel Raw 31/40 Farm Harvested',
    packingStyle: '10 x 2 LBS',
    releaseStatus: 'RELEASED',
  },
  {
    sNo: 6,
    poNo: 'PO-98417',
    buyer: 'Vinafood Regional',
    brand: 'Mekong Delta',
    packingDate: '23-Oct-2026',
    country: 'Vietnam',
    productDesc: 'Raw Head-On Shell-On 41/50 Semi-IQF',
    packingStyle: '6 x 1.8 KG',
    releaseStatus: 'TCBS RETEST',
  },
];

const QC_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'QC-RULE-01',
    name: 'Zero Chloramphenicol Antibiotic Hold',
    description: 'Auto-locks lot and triggers quarantine hold if LC-MS/MS testing detects antibiotic residue > 0.1 ppb.',
    icon: <ShieldCheck className="w-4 h-4 text-brand-accent stroke-[2.2]" />,
    enabled: true,
    category: 'Food Safety Gate',
  },
  {
    id: 'QC-RULE-02',
    name: 'Vibrio TCBS Colony Threshold Guard',
    description: 'Enforces mandatory 24h incubation hold when pathogenic green Vibrio colony count exceeds 200 CFU/mL.',
    icon: <Droplets className="w-4 h-4 text-[#10B981] stroke-[2.2]" />,
    enabled: true,
    category: 'Microbiological Gate',
  },
  {
    id: 'QC-RULE-03',
    name: 'Automated Export Health Cert Dispatch',
    description: 'Dispatches digital MPEDA & US-FDA export clearance certificates once dual-lab tests confirm zero defects.',
    icon: <Zap className="w-4 h-4 text-[#F59E0B] stroke-[2.2]" />,
    enabled: true,
    category: 'Regulatory Sync',
  },
];

const SUB_TABS = [
  { label: 'Overview', value: 'Overview' },
  { label: 'Labs', value: 'Labs' },
  { label: 'Chemistry', value: 'Chemistry' },
  { label: 'Audit', value: 'Audit' },
  { label: 'Reports', value: 'Reports' },
];

const LAB_PANELS = [
  {
    plateId: 'TCBS-901',
    lotNo: 'DMS1231012',
    sample: 'P. vannamei Muscle',
    greenColony: '0 CFU/g',
    yellowColony: '< 10 CFU/g',
    status: 'PASSED',
    incubated: '24 hrs (37°C)',
  },
  {
    plateId: 'TCBS-902',
    lotNo: 'NLOT2026023',
    sample: 'Hepatopancreas',
    greenColony: '0 CFU/g',
    yellowColony: '12 CFU/g',
    status: 'IN REVIEW',
    incubated: '18 hrs (37°C)',
  },
  {
    plateId: 'TCBS-903',
    lotNo: 'KKD1022026',
    sample: 'Water & Muscle',
    greenColony: '0 CFU/g',
    yellowColony: '< 5 CFU/g',
    status: 'PASSED',
    incubated: '24 hrs (37°C)',
  },
  {
    plateId: 'TCBS-904',
    lotNo: 'NLOT2026024',
    sample: 'Tail Hemolymph',
    greenColony: '45 CFU/g (Alert)',
    yellowColony: '80 CFU/g',
    status: 'FAILED',
    incubated: '24 hrs (37°C)',
  },
];

const CHEMISTRY_PANELS = [
  {
    testId: 'LCMS-401',
    lotNo: 'DMS1231012',
    compound: 'Chloramphenicol',
    reading: '0.00 ppb',
    limit: '< 0.30 ppb',
    method: 'LC-MS/MS',
    result: 'Compliant',
  },
  {
    testId: 'LCMS-402',
    lotNo: 'DMS1231012',
    compound: 'Nitrofurans (AOZ, AMOZ)',
    reading: '0.00 ppb',
    limit: '< 1.00 ppb',
    method: 'LC-MS/MS',
    result: 'Compliant',
  },
  {
    testId: 'LCMS-403',
    lotNo: 'NLOT2026023',
    compound: 'Oxytetracycline',
    reading: '1.20 ppb',
    limit: '< 100.0 ppb',
    method: 'HPLC-UV',
    result: 'Compliant',
  },
  {
    testId: 'ICP-501',
    lotNo: 'DMS1231012',
    compound: 'Lead (Pb) & Cadmium (Cd)',
    reading: '< 0.01 ppm',
    limit: '< 0.50 ppm',
    method: 'ICP-MS',
    result: 'Compliant',
  },
];

const AUDIT_TRAIL = [
  {
    timestamp: 'Oct 29, 2026 14:32 IST',
    lotNo: 'DMS1231012',
    action: 'Final Release Signoff',
    inspector: 'Dr. R. Ramanathan (Lead Microbiologist)',
    hash: 'sha256:7f9a2b8...c4',
    badge: 'VERIFIED',
  },
  {
    timestamp: 'Oct 29, 2026 11:15 IST',
    lotNo: 'DMS1231012',
    action: 'LC-MS/MS Negative Affirmation',
    inspector: 'A. Sridevi (Analytical Chemist)',
    hash: 'sha256:3a1e9c2...d1',
    badge: 'VERIFIED',
  },
  {
    timestamp: 'Oct 28, 2026 17:40 IST',
    lotNo: 'NLOT2026024',
    action: 'Vibrio Detection Hold Flagged',
    inspector: 'Automated TCBS Gate Scanner',
    hash: 'sha256:9c4b7e1...a8',
    badge: 'HOLD',
  },
  {
    timestamp: 'Oct 28, 2026 09:12 IST',
    lotNo: 'DMS1231012',
    action: 'Cold Chain Intake Verification (-19.2°C)',
    inspector: 'M. Venkat (Logistics Officer)',
    hash: 'sha256:1f2a3b4...e5',
    badge: 'VERIFIED',
  },
];

const EXPORT_REPORTS = [
  {
    docId: 'COA-2026-881',
    type: 'Certificate of Analysis (CoA)',
    destination: 'US - Los Angeles Port',
    buyer: 'Pacific Seafood Group',
    date: '29-Oct-2026',
    format: 'PDF / XML',
    status: 'Ready',
  },
  {
    docId: 'EHC-2026-412',
    type: 'EU Phytosanitary Health Cert',
    destination: 'EU - Rotterdam Gateway',
    buyer: 'Nordic Marine Imports',
    date: '28-Oct-2026',
    format: 'PDF / EDI',
    status: 'Ready',
  },
  {
    docId: 'FDA-PN-909',
    type: 'US FDA Prior Notice & Bioterrorism',
    destination: 'US - Long Beach Hub',
    buyer: 'Apex Shellfish Global',
    date: '27-Oct-2026',
    format: 'EDI 856',
    status: 'Ready',
  },
];

const STATUS_FILTER_OPTIONS = [
  { label: 'All Lots', value: 'All Lots' },
  { label: 'Released', value: 'Released (Passed)' },
  { label: 'Under QC', value: 'Under Lab QC' },
  { label: 'Quarantine', value: 'Quarantine Hold' },
];

export const QcManagementView: React.FC<QcManagementViewProps> = ({ onShowToast }) => {
  // Navigation & Filter States
  const [activeSubTab, setActiveSubTab] = useState<string>('Overview');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All Lots');
  const [lotSearchQuery, setLotSearchQuery] = useState<string>('');
  const [poSearchQuery, setPoSearchQuery] = useState<string>('');
  const [lotPage, setLotPage] = useState<number>(1);
  const [poPage, setPoPage] = useState<number>(1);

  const handleExportLots = () => {
    onShowToast?.('Exporting QC Lot Inspection Matrix to CSV...');
    const csvContent =
      'Lot No,Supplier,Center,Harvest Date,Weight Kg,QC Result,Status\n' +
      INITIAL_LOTS.map(
        (l) =>
          `"${l.lotNo}","${l.supplier}","${l.center}","${l.harvestDate}",${l.weightKg},"${l.qcResult}","${l.status}"`
      ).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Devi_Sea_Foods_QC_Lots_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPOs = () => {
    onShowToast?.('Generating PO Clearance Manifest for Customs Export...');
    setTimeout(() => {
      onShowToast?.('PO Manifest downloaded successfully.');
    }, 800);
  };

  // Filtered Lots Data
  const filteredLots = INITIAL_LOTS.filter((lot) => {
    const matchesSearch =
      lot.lotNo.toLowerCase().includes(lotSearchQuery.toLowerCase()) ||
      lot.supplier.toLowerCase().includes(lotSearchQuery.toLowerCase()) ||
      lot.center.toLowerCase().includes(lotSearchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedStatusFilter === 'All Lots') return true;
    if (selectedStatusFilter === 'Released (Passed)') return lot.status === 'RELEASED';
    if (selectedStatusFilter === 'Under Lab QC') return lot.status === 'UNDER QC';
    if (selectedStatusFilter === 'Quarantine Hold') return lot.status === 'HOLD';
    return true;
  });

  // Filtered POs Data
  const filteredPOs = INITIAL_POS.filter((po) => {
    return (
      po.poNo.toLowerCase().includes(poSearchQuery.toLowerCase()) ||
      po.buyer.toLowerCase().includes(poSearchQuery.toLowerCase()) ||
      po.country.toLowerCase().includes(poSearchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Sticky Sub-Menu Header & Tabs Dock with Smooth Fade */}
      <div className="sticky top-[86px] z-20 bg-canvas/95 backdrop-blur-md pt-1 pb-3 -mt-1 flex flex-col gap-3">
        <PageHeaderCard
          icon={<ShieldCheck className="w-5 h-5 stroke-[2.2]" />}
          iconBg="bg-[#0B0F19] text-white"
          title="Quality Control & Lot Traceability"
          subtitle="Microbiological testing, TCBS pathogen clearance & lot custody chain"
          badge="Devi Sea Foods Standard"
          badgeVariant="brand"
          tooltip={{
            title: 'Export Bio-Clearance',
            description: 'TCBS agar verification & chain-of-custody compliance',
          }}
          actions={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportLots}
                icon={<Download className="w-3.5 h-3.5 stroke-[2.2]" />}
              >
                Export Lots CSV
              </Button>
              <ShimmerButton
                size="sm"
                onClick={handleExportPOs}
                icon={<FileSpreadsheet className="w-3.5 h-3.5 stroke-[2.2]" />}
              >
                Download Lab Excel
              </ShimmerButton>
            </>
          }
        />

        {/* 2. Sub-Navigation Tabs using CapsuleSegment (Crisp 1-line layout, zero wrapping) */}
        <div className="w-full sm:w-[480px]">
          <CapsuleSegment
            options={SUB_TABS}
            value={activeSubTab}
            onChange={setActiveSubTab}
            layoutId="qc-sub-tabs"
          />
        </div>

        {/* Organic Dissolving Feather */}
        <div className="h-6 w-full pointer-events-none bg-gradient-to-b from-canvas via-canvas/60 to-transparent -mb-6" />
      </div>

      {/* 3. ROW 1: 4 Metric Cards with Live Micro Sparklines and Hover Lift */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Export Lots"
          value="571"
          delta="+12%"
          isPositive={true}
          subtext="Pending 12h intake queue"
          icon={<Package className="w-4 h-4 text-brand-accent stroke-[2.2]" />}
          sparklineData={[520, 535, 540, 555, 560, 568, 571]}
        />
        <MetricCard
          title="Inspected Lots"
          value="126"
          delta="+28 lots"
          isPositive={true}
          subtext="100% TCBS plated"
          icon={<CheckCircle2 className="w-4 h-4 text-[#10B981] stroke-[2.2]" />}
          sparklineData={[90, 98, 105, 112, 118, 122, 126]}
        />
        <MetricCard
          title="QC In Progress"
          value="445"
          delta="Active"
          isPositive={true}
          subtext="Pre-assembly staging"
          icon={<Clock className="w-4 h-4 text-[#F59E0B] stroke-[2.2]" />}
          sparklineData={[410, 420, 428, 435, 438, 442, 445]}
        />
        <MetricCard
          title="Rejection Rate"
          value="0.0%"
          delta="0 defects"
          isPositive={true}
          subtext="Zero antibiotic residue"
          icon={<ShieldCheck className="w-4 h-4 text-[#0B0F19] stroke-[2.2]" />}
          sparklineData={[0, 0, 0, 0, 0, 0, 0]}
        />
      </div>

      {/* 4. ROW 2: High-Density Operations & Governance (Tab Switched) */}
      {activeSubTab === 'Overview' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 Cols): Lot Traceability Table + Purchase Order Clearance Table */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Card 1: Lot Traceability & Inspection Matrix */}
          <Card padding="lg" className="w-full flex flex-col border border-border-subtle bg-white shadow-subtle">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0B0F19] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-content-main tracking-tight">
                    Lot Traceability Matrix
                  </h3>
                  <Tooltip
                    content={{
                      title: 'Lot Traceability Matrix',
                      description: 'Real-time CFU colony counts & harvest batch tracking',
                    }}
                    side="right"
                  >
                    <Info className="w-3.5 h-3.5 text-content-tertiary hover:text-content-main cursor-pointer shrink-0" />
                  </Tooltip>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="success" size="sm">
                  126 Released
                </Badge>
                <Badge variant="warning" size="sm">
                  445 In Review
                </Badge>
                <Badge variant="error" size="sm">
                  6 Hold
                </Badge>
              </div>
            </div>

            {/* Filters Bar: CapsuleSegment for Status + Search Input */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
              <div className="w-full sm:w-[360px]">
                <CapsuleSegment
                  options={STATUS_FILTER_OPTIONS}
                  value={selectedStatusFilter}
                  onChange={setSelectedStatusFilter}
                  layoutId="qc-status-filter"
                />
              </div>

              <div className="w-full sm:w-60">
                <Input
                  placeholder="Search lot, supplier, hub..."
                  value={lotSearchQuery}
                  onChange={(e) => setLotSearchQuery(e.target.value)}
                  startIcon={<Search className="w-3.5 h-3.5 text-content-muted stroke-[2.2]" />}
                />
              </div>
            </div>

            {/* Table Container with guaranteed overflow scrolling & fixed column widths */}
            <div className="overflow-x-auto no-scrollbar -mx-5 px-5">
              <table className="w-full text-left border-collapse min-w-[680px]">
                <thead>
                  <tr className="border-b border-border-subtle text-[11px] font-bold uppercase tracking-wider text-content-muted">
                    <th className="py-2.5 pr-4 w-44">Lot No & Supplier</th>
                    <th className="py-2.5 px-3 w-36">Plant / Hub</th>
                    <th className="py-2.5 px-3 w-28">Harvest Date</th>
                    <th className="py-2.5 px-3 w-28">Weight (kg)</th>
                    <th className="py-2.5 px-3 w-36">Lab QC Gate</th>
                    <th className="py-2.5 pl-3 text-right w-28">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/70 text-xs">
                  {filteredLots.map((lot) => {
                    const isReleased = lot.status === 'RELEASED';
                    const isUnderQc = lot.status === 'UNDER QC';
                    const isHold = lot.status === 'HOLD';

                    return (
                      <tr
                        key={lot.id}
                        className="hover:bg-[#F8FAFC] transition-colors duration-150 group cursor-pointer"
                      >
                        {/* Lot No & Supplier */}
                        <td className="py-3.5 pr-4">
                          <div className="flex flex-col whitespace-nowrap">
                            <span className="font-bold text-content-main text-xs group-hover:text-brand-accent transition-colors">
                              {lot.lotNo}
                            </span>
                            <span className="text-[11px] text-content-muted">
                              {lot.supplier}
                            </span>
                          </div>
                        </td>

                        {/* Plant / Hub */}
                        <td className="py-3.5 px-3">
                          <span className="font-medium text-content-main whitespace-nowrap">
                            {lot.center}
                          </span>
                        </td>

                        {/* Harvest Date */}
                        <td className="py-3.5 px-3">
                          <span className="text-content-muted whitespace-nowrap">
                            {lot.harvestDate}
                          </span>
                        </td>

                        {/* Weight (kg) */}
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-content-main whitespace-nowrap">
                            {lot.weightKg.toLocaleString()} kg
                          </span>
                        </td>

                        {/* Lab QC Gate */}
                        <td className="py-3.5 px-3">
                          <span
                            className={cn(
                              'font-semibold whitespace-nowrap text-[11px]',
                              isReleased
                                ? 'text-status-success'
                                : isUnderQc
                                ? 'text-status-warning'
                                : 'text-status-error'
                            )}
                          >
                            {lot.qcResult}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 pl-3 text-right">
                          <div className="flex justify-end">
                            <Badge
                              variant={isReleased ? 'success' : isUnderQc ? 'warning' : 'error'}
                              size="sm"
                            >
                              {lot.status}
                            </Badge>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-border-subtle text-xs text-content-muted">
              <span>Showing 1 to {filteredLots.length} of 571 total lots</span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={lotPage === 1}
                  onClick={() => setLotPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 h-7"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                <span className="px-2.5 py-1 text-[11px] font-bold text-content-main rounded-md bg-[#F4F5F8]">
                  Page {lotPage} of 72
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setLotPage((p) => p + 1)}
                  className="px-2.5 h-7"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Card 2: Purchase Order (PO) Export Clearance Matrix */}
          <Card padding="lg" className="w-full flex flex-col border border-border-subtle bg-white shadow-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0B0F19] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <FileSpreadsheet className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-content-main tracking-tight">
                    PO Export Clearance
                  </h3>
                  <Tooltip
                    content={{
                      title: 'PO Customs Clearance',
                      description: 'Reefer container seal verification & port releases',
                    }}
                    side="right"
                  >
                    <Info className="w-3.5 h-3.5 text-content-tertiary hover:text-content-main cursor-pointer shrink-0" />
                  </Tooltip>
                </div>
              </div>

              <div className="w-full sm:w-56">
                <Input
                  placeholder="Filter PO or buyer..."
                  value={poSearchQuery}
                  onChange={(e) => setPoSearchQuery(e.target.value)}
                  startIcon={<Search className="w-3.5 h-3.5 text-content-muted stroke-[2.2]" />}
                />
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar -mx-5 px-5">
              <table className="w-full text-left border-collapse min-w-[680px]">
                <thead>
                  <tr className="border-b border-border-subtle text-[11px] font-bold uppercase tracking-wider text-content-muted">
                    <th className="py-2.5 pr-4 w-32">PO No & Brand</th>
                    <th className="py-2.5 px-3 w-40">Buyer Account</th>
                    <th className="py-2.5 px-3 w-28">Packing Date</th>
                    <th className="py-2.5 px-3 w-24">Destination</th>
                    <th className="py-2.5 px-3 w-44">Product Specification</th>
                    <th className="py-2.5 pl-3 text-right w-28">Release Gate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/70 text-xs">
                  {filteredPOs.map((po) => {
                    const isReleased = po.releaseStatus === 'RELEASED';
                    const isPending = po.releaseStatus === 'INSPECTION PENDING';

                    return (
                      <tr
                        key={po.poNo}
                        className="hover:bg-[#F8FAFC] transition-colors duration-150 group cursor-pointer"
                      >
                        <td className="py-3.5 pr-4">
                          <div className="flex flex-col whitespace-nowrap">
                            <span className="font-bold text-content-main text-xs group-hover:text-brand-accent transition-colors">
                              {po.poNo}
                            </span>
                            <span className="text-[11px] text-content-muted">{po.brand}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-medium text-content-main whitespace-nowrap">
                            {po.buyer}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="text-content-muted whitespace-nowrap">
                            {po.packingDate}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-bold text-content-main whitespace-nowrap">
                            {po.country}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="flex flex-col whitespace-nowrap">
                            <span className="font-medium text-content-main text-[11px]">
                              {po.productDesc}
                            </span>
                            <span className="text-[10px] text-content-tertiary">
                              {po.packingStyle}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 pl-3 text-right">
                          <div className="flex justify-end">
                            <Badge
                              variant={isReleased ? 'success' : isPending ? 'warning' : 'error'}
                              size="sm"
                            >
                              {po.releaseStatus}
                            </Badge>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-border-subtle text-xs text-content-muted">
              <span>Showing 1 to {filteredPOs.length} of 52 orders</span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={poPage === 1}
                  onClick={() => setPoPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 h-7"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                <span className="px-2.5 py-1 text-[11px] font-bold text-content-main rounded-md bg-[#F4F5F8]">
                  Page {poPage} of 9
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPoPage((p) => p + 1)}
                  className="px-2.5 h-7"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (5 Cols): Health Index + Resource Quotas + QC Guardrail Rules */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Radial Progress Gauge: Export QC Pass & Microbiological Index */}
          <RadialProgressCard
            title="Export Microbiological Pass Index"
            score={99}
            grade="Optimal / Grade A+ Clearance"
            subMetrics={[
              { label: 'TCBS Pathogen', val: '0 CFU/mL', icon: <Droplets className="w-3.5 h-3.5 text-status-success" /> },
              { label: 'Antibiotic Residue', val: '0.00 ppb', icon: <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" /> },
              { label: 'Heavy Metals', val: '< 0.01 ppm', icon: <Activity className="w-3.5 h-3.5 text-[#0284C7]" /> },
              { label: 'Cold Chain Core', val: '-18.4 °C', icon: <Thermometer className="w-3.5 h-3.5 text-[#F59E0B]" /> },
            ]}
          />

          {/* Usage Meter Card: Export Processing Quotas & Lab Capacity */}
          <UsageMeterCard
            title="QC Processing Quota & Lab Capacity"
            planName="Devi Sea Foods Enterprise Lot Quota"
            tierLabel="FY 2024-25"
            metrics={[
              {
                label: 'Inspected Lots Clearance',
                displayUsed: '126 / 571 Lots',
                pct: 22,
                icon: <CheckCircle2 className="w-4 h-4 text-brand-accent stroke-[2.2]" />,
              },
              {
                label: 'Internal Microbiological Lab',
                displayUsed: '384 / 400 Capacity',
                pct: 96,
                icon: <Server className="w-4 h-4 text-[#10B981] stroke-[2.2]" />,
              },
              {
                label: 'SGS Third-Party Verification',
                displayUsed: '106 / 150 Lots',
                pct: 71,
                icon: <HardDrive className="w-4 h-4 text-[#F59E0B] stroke-[2.2]" />,
              },
            ]}
          />

          {/* QC Bio-Security Guardrails & Automation Rules */}
          <QuickActionCard
            title="Automated QC Bio-Security Guardrails"
            badgeLabel="3 Protocols"
            rules={QC_AUTOMATION_RULES}
          />
        </div>
      </div>
      )}

      {/* LABS SUB-TAB: TCBS Microbiology & Culture Plates */}
      {activeSubTab === 'Labs' && (
        <Card padding="lg" className="border border-border-subtle bg-white shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-border-subtle">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
                <Droplets className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-content-main">TCBS Agar Pathogen & Vibrio Colony Plates</h3>
                <span className="text-xs text-content-muted">Automated colony enumeration after 24h selective incubation at 37°C</span>
              </div>
            </div>
            <Badge variant="success" size="sm">4 Incubator Bays Online</Badge>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border-subtle bg-[#F8FAFC] text-[11px] font-bold text-content-muted uppercase tracking-wider">
                  <th className="py-2.5 px-3">Plate ID</th>
                  <th className="py-2.5 px-3">Lot Reference</th>
                  <th className="py-2.5 px-3">Sample Matrix</th>
                  <th className="py-2.5 px-3">V. parahaemolyticus (Green)</th>
                  <th className="py-2.5 px-3">V. cholerae (Yellow)</th>
                  <th className="py-2.5 px-3">Incubation Cycle</th>
                  <th className="py-2.5 px-3">QC Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-medium text-content-main">
                {LAB_PANELS.map((p) => (
                  <tr key={p.plateId} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-3 font-semibold text-brand-accessible">{p.plateId}</td>
                    <td className="py-3 px-3 font-semibold text-content-main">{p.lotNo}</td>
                    <td className="py-3 px-3">{p.sample}</td>
                    <td className="py-3 px-3">{p.greenColony}</td>
                    <td className="py-3 px-3">{p.yellowColony}</td>
                    <td className="py-3 px-3 text-content-muted">{p.incubated}</td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={p.status === 'PASSED' ? 'success' : p.status === 'FAILED' ? 'error' : 'warning'}
                        size="sm"
                      >
                        {p.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* CHEMISTRY SUB-TAB: LC-MS/MS Antibiotic Residue & Heavy Metals */}
      {activeSubTab === 'Chemistry' && (
        <Card padding="lg" className="border border-border-subtle bg-white shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-border-subtle">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0284C7]/15 text-[#0284C7] flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-content-main">LC-MS/MS Antibiotic Residue & Heavy Metal Screening</h3>
                <span className="text-xs text-content-muted">Ultra-trace quantitative mass spectrometry (FDA / EU MRL Zero-Tolerance Standard)</span>
              </div>
            </div>
            <Badge variant="neutral" size="sm">Triple Quadrupole Active</Badge>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border-subtle bg-[#F8FAFC] text-[11px] font-bold text-content-muted uppercase tracking-wider">
                  <th className="py-2.5 px-3">Batch Run</th>
                  <th className="py-2.5 px-3">Lot No</th>
                  <th className="py-2.5 px-3">Target Analytes</th>
                  <th className="py-2.5 px-3">Instrument Method</th>
                  <th className="py-2.5 px-3">Detected Level</th>
                  <th className="py-2.5 px-3">Regulatory Limit (MRL)</th>
                  <th className="py-2.5 px-3">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-medium text-content-main">
                {CHEMISTRY_PANELS.map((c) => (
                  <tr key={c.testId} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-3 font-semibold text-brand-accessible">{c.testId}</td>
                    <td className="py-3 px-3 font-semibold text-content-main">{c.lotNo}</td>
                    <td className="py-3 px-3 font-semibold">{c.compound}</td>
                    <td className="py-3 px-3 font-medium text-content-muted">{c.method}</td>
                    <td className="py-3 px-3 font-bold text-emerald-600">{c.reading}</td>
                    <td className="py-3 px-3 font-medium text-content-muted">{c.limit}</td>
                    <td className="py-3 px-3">
                      <Badge variant="success" size="sm">{c.result}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* AUDIT SUB-TAB: HACCP Chain-of-Custody Immutable Signoffs */}
      {activeSubTab === 'Audit' && (
        <Card padding="lg" className="border border-border-subtle bg-white shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-border-subtle">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0B0F19] text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-content-main">HACCP Chain-of-Custody Immutable Audit Trail</h3>
                <span className="text-xs text-content-muted">Cryptographically verified operator actions and electronic signoffs</span>
              </div>
            </div>
            <Badge variant="neutral" size="sm">ISO 22000 & BAP Certified</Badge>
          </div>

          <div className="flex flex-col divide-y divide-border-subtle">
            {AUDIT_TRAIL.map((a, idx) => (
              <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8FAFC] px-2 rounded-lg transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-accent mt-1.5 shrink-0" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-content-main text-xs">{a.action}</span>
                      <span className="text-[11px] font-semibold text-content-muted">({a.lotNo})</span>
                    </div>
                    <span className="text-xs text-content-muted mt-0.5">{a.inspector}</span>
                    <span className="text-[10px] font-medium text-content-tertiary mt-0.5">{a.hash}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-content-muted font-medium">{a.timestamp}</span>
                  <Badge variant={a.badge === 'VERIFIED' ? 'success' : 'warning'} size="sm">
                    {a.badge}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* REPORTS SUB-TAB: Export Clearance Documentation Hub */}
      {activeSubTab === 'Reports' && (
        <Card padding="lg" className="border border-border-subtle bg-white shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-border-subtle">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-accent text-white flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-content-main">Export Clearance Documentation Manifests</h3>
                <span className="text-xs text-content-muted">Instant generation of digital Certificates of Analysis and Phytosanitary packages</span>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-3.5 h-3.5 stroke-[2.2]" />}
              onClick={() => onShowToast?.('Exporting all regulatory clearance documents...')}
            >
              Batch Export All
            </Button>
          </div>

          <div className="flex flex-col divide-y divide-border-subtle">
            {EXPORT_REPORTS.map((r) => (
              <div key={r.docId} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8FAFC] px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center shrink-0 font-bold text-xs">
                    DOC
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-content-main text-xs">{r.type}</span>
                      <span className="text-[11px] font-semibold text-content-muted">[{r.docId}]</span>
                    </div>
                    <span className="text-xs text-content-muted">{r.buyer} &bull; {r.destination}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-xs text-content-muted font-medium">{r.date}</span>
                  <Badge variant="success" size="sm">{r.status}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2.5 text-brand-accent"
                    icon={<Download className="w-3.5 h-3.5" />}
                    onClick={() => onShowToast?.(`Downloading ${r.docId} (${r.type})...`)}
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
