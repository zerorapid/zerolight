import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MetricCard } from '@/components/ui/MetricCard';
import { CapsuleSegment } from '@/components/ui/CapsuleSegment';
import { Tooltip } from '@/components/ui/Tooltip';
import { PageHeaderCard } from '@/components/ui/PageHeaderCard';
import {
  TrendingUp,
  ShoppingCart,
  Layers,
  Factory,
  Snowflake,
  Boxes,
  BarChart3,
  Bell,
  LifeBuoy,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Info,
  DollarSign,
  Receipt,
  ShieldCheck,
  Scale,
  Package,
  Percent,
  PackageCheck,
  Droplets,
  Zap,
  Thermometer,
  Ship,
  Truck,
  Activity,
} from 'lucide-react';

export interface HubConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge: string;
  submenus: string[];
  metrics: {
    title: string;
    value: string;
    delta: string;
    isPositive: boolean;
    subtext: string;
    icon?: React.ReactNode;
    sparklineData?: number[];
  }[];
  tableTitle: string;
  tableHeaders: string[];
  tableRows: { id: string; col1: string; col2: string; col3: string; col4: string; status: 'SUCCESS' | 'PENDING' | 'ALERT' }[];
}

export const ENTERPRISE_HUBS: Record<string, HubConfig> = {
  sales: {
    id: 'sales',
    title: 'Sales Operations Hub',
    subtitle: 'Global export contracts, commercial invoices, and marine cargo insurance',
    icon: <TrendingUp className="w-5 h-5 stroke-[2.2]" />,
    badge: 'FY 2024-26',
    submenus: ['DashBoard', 'Orders', 'Payments', 'Insurance'],
    metrics: [
      { title: 'Gross Revenue', value: '$4.28M', delta: '+18.4%', isPositive: true, subtext: 'Q4 Export Manifests', icon: <DollarSign className="w-4 h-4 text-[#00a7bc] stroke-[2.2]" /> },
      { title: 'Confirmed Orders', value: '142', delta: '+12 orders', isPositive: true, subtext: 'US & EU Delivery Channels', icon: <CheckCircle2 className="w-4 h-4 text-[#10b981] stroke-[2.2]" /> },
      { title: 'Settled Payments', value: '$3.92M', delta: '91.5%', isPositive: true, subtext: 'LC Irrevocable 30 Days', icon: <Receipt className="w-4 h-4 text-[#0284c7] stroke-[2.2]" /> },
      { title: 'Cargo Insured', value: '100%', delta: 'Zero Loss', isPositive: true, subtext: 'Lloyds Marine Cold Chain Cover', icon: <ShieldCheck className="w-4 h-4 text-[#10b981] stroke-[2.2]" /> },
    ],
    tableTitle: 'Active Export Purchase Orders & Shipments',
    tableHeaders: ['Contract ID', 'Buyer / Destination', 'Volume (MT)', 'Payment Term', 'Fulfillment'],
    tableRows: [
      { id: 'SO-901', col1: 'Pacific Seafood LLC (US - LA)', col2: '48.5 MT Vannamei HLSO', col3: 'LC at Sight ($640k)', col4: 'Customs Ready', status: 'SUCCESS' },
      { id: 'SO-902', col1: 'Nordic Marine Imports (EU)', col2: '32.0 MT Cooked Tail-on', col3: 'CAD ($410k)', col4: 'Packing Stage', status: 'PENDING' },
      { id: 'SO-903', col1: 'Yokohama Marine Corp (JP)', col2: '60.0 MT Nobashi Shrimp', col3: 'LC Irrevocable ($890k)', col4: 'Quality Approved', status: 'SUCCESS' },
      { id: 'SO-904', col1: 'Great Ocean Foods (UK)', col2: '24.0 MT IQF Peeled', col3: 'Direct Wire ($320k)', col4: 'Coldstore Buffer', status: 'PENDING' },
    ],
  },
  purchase: {
    id: 'purchase',
    title: 'Procurement & Purchase Hub',
    subtitle: 'Raw harvest intake, feed vendor orders, and bio-additive replenishment',
    icon: <ShoppingCart className="w-5 h-5 stroke-[2.2]" />,
    badge: '18 Active Vendors',
    submenus: ['Dashboard', 'Operations', 'Transactions & Bills', 'Payments'],
    metrics: [
      { title: 'Monthly Raw Intake', value: '840 MT', delta: '+8.2%', isPositive: true, subtext: 'Farmgate Harvest Weighments', icon: <Scale className="w-4 h-4 text-[#00a7bc] stroke-[2.2]" /> },
      { title: 'Feed Procurement', value: '215 MT', delta: 'Stock 94%', isPositive: true, subtext: 'CP Aquaculture Extruded Pellet', icon: <Package className="w-4 h-4 text-[#0284c7] stroke-[2.2]" /> },
      { title: 'Pending Vendor Bills', value: '6 Bills', delta: '$184k', isPositive: true, subtext: 'Pre-Audit Verification', icon: <Clock className="w-4 h-4 text-[#f59e0b] stroke-[2.2]" /> },
      { title: 'Quality Acceptance', value: '99.4%', delta: '0.6% Rejection', isPositive: true, subtext: 'Strict TCBS Gate Standard', icon: <CheckCircle2 className="w-4 h-4 text-[#10b981] stroke-[2.2]" /> },
    ],
    tableTitle: 'Vendor Harvest Deliveries & Invoices',
    tableHeaders: ['Bill Ref', 'Supplier Farm / Node', 'Category', 'Amount', 'Gate Audit'],
    tableRows: [
      { id: 'PO-441', col1: 'Murugappa Aqua Farms (Bhimavaram)', col2: 'Raw Harvest Intake (12.4 MT)', col3: '₹62.4 Lakhs', col4: 'Passed QC', status: 'SUCCESS' },
      { id: 'PO-442', col1: 'Coastal Feeds Corporation', col2: 'Shrimp Grower #3 (45 MT)', col3: '₹34.8 Lakhs', col4: 'Verified', status: 'SUCCESS' },
      { id: 'PO-443', col1: 'Bio-Zyme Labs India Ltd', col2: 'B. subtilis Probiotic (800 L)', col3: '₹8.6 Lakhs', col4: 'In Review', status: 'PENDING' },
      { id: 'PO-444', col1: 'Ongole Marine Hatcheries', col2: 'P. vannamei Post-Larvae PL-10', col3: '₹14.2 Lakhs', col4: 'Passed QC', status: 'SUCCESS' },
    ],
  },
  preprocessing: {
    id: 'preprocessing',
    title: 'Pre-Processing & Grading Hub',
    subtitle: 'De-heading, grading, chemical wash screens, and yield optimization',
    icon: <Layers className="w-5 h-5 stroke-[2.2]" />,
    badge: 'Line Yield 92.4%',
    submenus: ['Dashboard', 'Operations', 'Chemical Screens'],
    metrics: [
      { title: 'Daily Throughput', value: '42.8 MT', delta: '+4.5 MT', isPositive: true, subtext: '6 Mechanical De-headers', icon: <Layers className="w-4 h-4 text-[#00a7bc] stroke-[2.2]" /> },
      { title: 'Head-On Yield', value: '93.2%', delta: '+0.8%', isPositive: true, subtext: 'Grading Sieve Efficiency', icon: <Percent className="w-4 h-4 text-[#10b981] stroke-[2.2]" /> },
      { title: 'Chilled Slurry Temp', value: '0.8 °C', delta: 'Optimal', isPositive: true, subtext: 'Continuous Flake Ice Ratio', icon: <Snowflake className="w-4 h-4 text-[#0284c7] stroke-[2.2]" /> },
      { title: 'Chemical Screen', value: '0 Residues', delta: 'Negative', isPositive: true, subtext: 'Chlorine-free Ozone Wash', icon: <Activity className="w-4 h-4 text-[#10b981] stroke-[2.2]" /> },
    ],
    tableTitle: 'Pre-Processing Line Operational Batches',
    tableHeaders: ['Batch ID', 'Source Pond', 'Count Grade (pcs/kg)', 'Yield Efficiency', 'Status'],
    tableRows: [
      { id: 'PRE-101', col1: 'Sector Alpha - Pond 01', col2: '30/40 Semi-IQF Grade', col3: '93.6% Recovery', col4: 'Passed Staging', status: 'SUCCESS' },
      { id: 'PRE-102', col1: 'Sector Alpha - Pond 02', col2: '40/50 HLSO Grade', col3: '91.8% Recovery', col4: 'Active Line 3', status: 'PENDING' },
      { id: 'PRE-103', col1: 'Sector Beta - Pond 04', col2: '20/30 Head-On Shell-On', col3: '94.2% Recovery', col4: 'Passed Staging', status: 'SUCCESS' },
    ],
  },
  production: {
    id: 'production',
    title: 'Production Operations Hub',
    subtitle: 'IQF blast tunnels, plate freezers, glazing stages, and packing lines',
    icon: <Factory className="w-5 h-5 stroke-[2.2]" />,
    badge: '3 Blast Tunnels Active',
    submenus: ['Dashboard', 'Pre Processing', 'Operations'],
    metrics: [
      { title: 'Packout Output', value: '38.4 MT/day', delta: '+12%', isPositive: true, subtext: 'Master Carton Staging', icon: <PackageCheck className="w-4 h-4 text-[#00a7bc] stroke-[2.2]" /> },
      { title: 'Blast Freezer Temp', value: '-38.2 °C', delta: 'Cryo Lock', isPositive: true, subtext: 'NH3 Cascade Refrigeration', icon: <Snowflake className="w-4 h-4 text-[#0284c7] stroke-[2.2]" /> },
      { title: 'Glaze Precision', value: '9.8%', delta: 'Within Spec', isPositive: true, subtext: 'US FDA 10% Target Standard', icon: <Droplets className="w-4 h-4 text-[#10b981] stroke-[2.2]" /> },
      { title: 'Line OEE Efficiency', value: '89.6%', delta: '+3.2%', isPositive: true, subtext: 'Overall Equipment Effectiveness', icon: <Zap className="w-4 h-4 text-[#f59e0b] stroke-[2.2]" /> },
    ],
    tableTitle: 'Master Packing Line Execution Logs',
    tableHeaders: ['Run No', 'Buyer Specification', 'Pack Style', 'Cartons Sealed', 'Metal Detection'],
    tableRows: [
      { id: 'PRD-801', col1: 'Pacific Seafood Prime 2lb', col2: '10 x 2lb Poly Bags', col3: '1,840 Cartons', col4: 'Fe 1.0 / NonFe 1.2 Passed', status: 'SUCCESS' },
      { id: 'PRD-802', col1: 'Nordic Blue Tail-On 1kg', col2: '10 x 1kg Inner Retail Box', col3: '2,200 Cartons', col4: 'Fe 1.0 / NonFe 1.2 Passed', status: 'SUCCESS' },
      { id: 'PRD-803', col1: 'Yokohama Block Frozen 1.8kg', col2: '6 x 1.8kg Block Glaze', col3: '1,450 Cartons', col4: 'Inline Verified', status: 'SUCCESS' },
    ],
  },
  coldstore: {
    id: 'coldstore',
    title: 'Coldstore & Cold Chain Logistics',
    subtitle: 'Automated warehouse staging, pallet racking, IBT transfer, and container loading',
    icon: <Snowflake className="w-5 h-5 stroke-[2.2]" />,
    badge: '-19.4°C Core Temp',
    submenus: ['DashBoard', 'Production', 'Stock', 'Orders', 'Store', 'Stock Approvals', 'IBT', 'Shipments'],
    metrics: [
      { title: 'Frozen Pallets Stored', value: '2,840', delta: '82% Capacity', isPositive: true, subtext: '4 High-Bay Chambers', icon: <Boxes className="w-4 h-4 text-[#00a7bc] stroke-[2.2]" /> },
      { title: 'Core Chamber Temp', value: '-19.4 °C', delta: 'Continuous 24/7', isPositive: true, subtext: 'Dual Compressor Loop A/B', icon: <Thermometer className="w-4 h-4 text-[#0284c7] stroke-[2.2]" /> },
      { title: 'Pending Shipments', value: '8 Reefer 40ft', delta: 'Customs Bound', isPositive: true, subtext: 'Visakhapatnam Port Quay', icon: <Ship className="w-4 h-4 text-[#10b981] stroke-[2.2]" /> },
      { title: 'IBT Inter-Branch Moves', value: '14 Transfers', delta: 'On Schedule', isPositive: true, subtext: 'Bhimavaram ↔ Nellore Link', icon: <Truck className="w-4 h-4 text-[#f59e0b] stroke-[2.2]" /> },
    ],
    tableTitle: 'Pallet Racking & Dispatch Containers',
    tableHeaders: ['Container ID', 'Chamber Rack', 'Lot Master Ref', 'Pallets', 'Temp Stamp'],
    tableRows: [
      { id: 'REEFER-01', col1: 'Chamber 2 (Bay 14-D)', col2: 'DMS1231012 (Devi Lot)', col3: '24 Pallets (21.6 MT)', col4: '-19.6 °C Verified', status: 'SUCCESS' },
      { id: 'REEFER-02', col1: 'Chamber 1 (Bay 08-B)', col2: 'NLOT2026023 (Coastal)', col3: '20 Pallets (18.0 MT)', col4: '-19.2 °C Verified', status: 'SUCCESS' },
      { id: 'REEFER-03', col1: 'Chamber 3 (Bay 04-A)', col2: 'KKD1231025 (Kora Aqua)', col3: '24 Pallets (21.6 MT)', col4: '-19.5 °C Verified', status: 'SUCCESS' },
    ],
  },
  inventory: {
    id: 'inventory',
    title: 'Inventory & Materials Store',
    subtitle: 'Corrugated cartons, inner poly liners, ozone sanitizers, and consumables',
    icon: <Boxes className="w-5 h-5 stroke-[2.2]" />,
    badge: '98.2% In Stock',
    submenus: ['General Store', 'Packing Material', 'Inventory'],
    metrics: [
      { title: 'Carton Inventory', value: '48,500 units', delta: 'Buffer 14 Days', isPositive: true, subtext: '5-Ply Export Kraft Board', icon: <Boxes className="w-4 h-4 text-[#00a7bc] stroke-[2.2]" /> },
      { title: 'Poly Film Liners', value: '120 rolls', delta: 'Food Grade LDPE', isPositive: true, subtext: 'BAP HACCP Certified', icon: <Layers className="w-4 h-4 text-[#0284c7] stroke-[2.2]" /> },
      { title: 'Spare Parts Reorder', value: '4 Items', delta: 'Routine Sync', isPositive: true, subtext: 'Seals & Pump Gaskets', icon: <Clock className="w-4 h-4 text-[#f59e0b] stroke-[2.2]" /> },
      { title: 'Stock Accuracy', value: '99.9%', delta: 'RFID Verified', isPositive: true, subtext: 'Continuous Cycle Count', icon: <CheckCircle2 className="w-4 h-4 text-[#10b981] stroke-[2.2]" /> },
    ],
    tableTitle: 'Critical Consumables & Packaging Inventory',
    tableHeaders: ['SKU Ref', 'Material Item', 'Stock Level', 'Reorder Point', 'Status'],
    tableRows: [
      { id: 'MAT-101', col1: 'Master Shipper 10x2kg (Devi Printed)', col2: '18,400 Cartons', col3: '5,000 Cartons', col4: 'Abundant', status: 'SUCCESS' },
      { id: 'MAT-102', col1: 'Inner Poly Bags 2lb (Anti-Fog)', col2: '84,000 Units', col3: '20,000 Units', col4: 'Abundant', status: 'SUCCESS' },
      { id: 'MAT-103', col1: 'Ozone Sanitizer Grade A (50L)', col2: '12 Carboys', col3: '8 Carboys', col4: 'Reorder Soon', status: 'PENDING' },
    ],
  },
  notifications: {
    id: 'notifications',
    title: 'Notification Center',
    subtitle: 'Real-time telemetry threshold triggers, QC holds, and export status dispatches',
    icon: <Bell className="w-5 h-5 stroke-[2.2]" />,
    badge: '3 Critical Alerts',
    submenus: ['Notification Center'],
    metrics: [
      { title: 'System Alerts (24h)', value: '14', delta: '11 Resolved', isPositive: true, subtext: 'Automated Rule Triggers', icon: <Bell className="w-4 h-4 text-[#f59e0b] stroke-[2.2]" /> },
      { title: 'Critical Gateway Warns', value: '1', delta: 'DO Sensor Pod 03', isPositive: false, subtext: 'Pond 03 Aerator Active', icon: <Clock className="w-4 h-4 text-[#ef4444] stroke-[2.2]" /> },
      { title: 'QC Releases', value: '8 Lots', delta: 'Cleared Customs', isPositive: true, subtext: 'US FDA Electronic Notice', icon: <CheckCircle2 className="w-4 h-4 text-[#10b981] stroke-[2.2]" /> },
      { title: 'MQTT Broker Uptime', value: '99.99%', delta: '0ms Latency', isPositive: true, subtext: 'LoRaWAN Edge Cluster', icon: <Activity className="w-4 h-4 text-[#00a7bc] stroke-[2.2]" /> },
    ],
    tableTitle: 'Recent System Notifications & Dispatches',
    tableHeaders: ['Time', 'Channel', 'Event Description', 'Target Node', 'Priority'],
    tableRows: [
      { id: 'NOTIF-1', col1: '14:32 IST Today', col2: 'Pond 03 Dissolved Oxygen dropped below 4.5 mg/L', col3: 'Automated Aerator VFD Surge', col4: 'HIGH ALERT', status: 'ALERT' },
      { id: 'NOTIF-2', col1: '12:15 IST Today', col2: 'Export Lot DMS1231012 TCBS negative clearance verified', col3: 'QC Microbiology Hub', col4: 'NORMAL', status: 'SUCCESS' },
      { id: 'NOTIF-3', col1: '09:40 IST Today', col2: 'Coldstore Chamber 2 defrost cycle completed (-19.6°C)', col3: 'Warehouse PLC SCADA', col4: 'NORMAL', status: 'SUCCESS' },
    ],
  },
};

interface EnterpriseHubViewProps {
  hubId: string;
  onShowToast?: (text: string, type?: 'success' | 'error') => void;
}

export const EnterpriseHubView: React.FC<EnterpriseHubViewProps> = ({ hubId, onShowToast }) => {
  const hub = ENTERPRISE_HUBS[hubId] || ENTERPRISE_HUBS.sales;
  const [activeSubmenu, setActiveSubmenu] = useState<string>(hub.submenus[0] || 'Dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRows = hub.tableRows.filter((row) =>
    row.col1.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.col2.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Sticky Sub-Menu Header & Tabs Dock with Smooth Fade */}
      <div className="sticky top-[86px] z-20 bg-canvas/95 backdrop-blur-md pt-1 pb-3 -mt-1 flex flex-col gap-3">
        <PageHeaderCard
          icon={hub.icon}
          iconBg="bg-[#0B0F19] text-white"
          title={hub.title}
          subtitle={hub.subtitle}
          badge={hub.badge}
          badgeVariant="default"
          actions={
            <>
              <Button
                variant="secondary"
                size="sm"
                icon={<Download className="w-3.5 h-3.5 stroke-[2.2]" />}
                onClick={() => onShowToast?.(`Exporting ${hub.title} report...`)}
              >
                Export Manifest
              </Button>
              <Button
                variant="black"
                size="sm"
                onClick={() => onShowToast?.(`${hub.title} action triggered.`)}
              >
                New Operation
              </Button>
            </>
          }
        />

        {/* 2. Submenu Capsule Tabs */}
        {hub.submenus.length > 1 && (
          <div className="w-full sm:w-auto self-start">
            <CapsuleSegment
              options={hub.submenus.map((s) => ({ label: s, value: s }))}
              value={activeSubmenu}
              onChange={setActiveSubmenu}
              layoutId={`hub-submenus-${hub.id}`}
            />
          </div>
        )}

        {/* Organic Dissolving Feather */}
        <div className="h-6 w-full pointer-events-none bg-gradient-to-b from-canvas via-canvas/60 to-transparent -mb-6" />
      </div>

      {/* 3. Conditional Content: Active Dashboard vs Under Development Screen */}
      {activeSubmenu !== hub.submenus[0] ? (
        <Card padding="lg" className="border border-border-subtle bg-white shadow-subtle py-14 px-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#0B0F19] text-white flex items-center justify-center mb-3.5 shadow-sm">
            <Clock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h3 className="text-base font-bold text-content-main tracking-tight">
            {activeSubmenu} &bull; Under Development
          </h3>
          <p className="text-xs text-content-muted max-w-md mt-1.5 mb-6">
            This module is currently being configured for enterprise deployment. Live data feeds and transactional flows will be linked in the upcoming build.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveSubmenu(hub.submenus[0])}
          >
            Return to {hub.submenus[0]}
          </Button>
        </Card>
      ) : (
        <>
          {/* 4 Domain Metric Cards (100% Lucide Icons, 0 Sparklines) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {hub.metrics.map((m, idx) => (
              <MetricCard
                key={idx}
                title={m.title}
                value={m.value}
                delta={m.delta}
                isPositive={m.isPositive}
                subtext={m.subtext}
                icon={m.icon}
              />
            ))}
          </div>

          {/* Active Operations Matrix Table Card */}
          <Card padding="lg" className="border border-border-subtle bg-white shadow-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-content-main tracking-tight">
                  {hub.tableTitle}
                </h3>
                <Tooltip
                  content={{
                    title: 'Live Enterprise Sync',
                    description: 'Audit logs synchronized across all processing plants in real-time',
                  }}
                  side="right"
                >
                  <Info className="w-3.5 h-3.5 text-content-tertiary hover:text-content-main cursor-pointer" />
                </Tooltip>
              </div>

              <div className="w-full sm:w-64">
                <Input
                  type="text"
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  startIcon={<Search className="w-3.5 h-3.5" />}
                  inputSize="sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border-subtle bg-[#F8FAFC] text-[11px] font-bold text-content-muted uppercase tracking-wider">
                    <th className="py-2.5 px-3">Reference</th>
                    {hub.tableHeaders.map((h, hIdx) => (
                      <th key={hIdx} className="py-2.5 px-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle font-medium text-content-main">
                  {filteredRows.map((r) => (
                    <tr key={r.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3 px-3 font-semibold text-brand-accessible">{r.id}</td>
                      <td className="py-3 px-3 font-semibold">{r.col1}</td>
                      <td className="py-3 px-3 text-content-muted">{r.col2}</td>
                      <td className="py-3 px-3 font-medium text-content-main">{r.col3}</td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={r.status === 'SUCCESS' ? 'success' : r.status === 'ALERT' ? 'error' : 'warning'}
                          size="sm"
                        >
                          {r.col4}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
