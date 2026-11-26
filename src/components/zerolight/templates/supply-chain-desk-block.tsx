"use client";

import React from "react";
import { Package, Clock, DollarSign, ShieldAlert, Download, Plus } from "lucide-react";
import { Button } from "../atoms/button";
import { StatCard } from "../molecules/stat-card";
import { AreaChart, type AreaDataPoint } from "../molecules/area-chart";
import { GeoBreakdown } from "../organisms/geo-breakdown";
import { LineItemMatrix, type MatrixLineItem } from "../organisms/line-item-matrix";
import { ApprovalWorkflow, type ApprovalStep } from "../organisms/approval-workflow";
import { Page, MetricGrid, Split } from "./layout-grammar";

export interface SupplyChainDeskBlockProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const FREIGHT_DATA: AreaDataPoint[] = [
  { label: "Jan", value: 142000 },
  { label: "Feb", value: 158000 },
  { label: "Mar", value: 136000 },
  { label: "Apr", value: 184000 },
  { label: "May", value: 172000 },
  { label: "Jun", value: 210000 },
];

const PO_ITEMS: MatrixLineItem[] = [
  { id: "1", sku: "ALU-6061-RAW", name: "Aluminium Alloy Sheets", qty: 1200, unitPrice: 42.5, taxPct: 18 },
  { id: "2", sku: "STL-304-COIL", name: "Stainless Steel Coils", qty: 800, unitPrice: 68, taxPct: 18 },
  { id: "3", sku: "COP-99-CATH", name: "Copper Cathodes", qty: 450, unitPrice: 96, taxPct: 12 },
];

const APPROVAL_STEPS: ApprovalStep[] = [
  { id: "s1", role: "Procurement Review", approver: "Sarah Mitchell", status: "approved", timestamp: "2h ago" },
  { id: "s2", role: "Finance Approval", approver: "David Chen", status: "pending" },
  { id: "s3", role: "Compliance Review", approver: "Amira Hassan", status: "waiting" },
  { id: "s4", role: "Final Authorization", approver: "James Wilson", status: "waiting" },
];

/**
 * Tier 3 Enterprise Supply Chain & PO Desk Block — full-width GeoBreakdown + 8/4 PO Desk split.
 */
export function SupplyChainDeskBlock({
  title = "Supply Chain & PO Desk",
  subtitle = "Global supplier intelligence, freight spend, and purchase order authorization.",
  className = "",
}: SupplyChainDeskBlockProps) {
  return (
    <Page density="standard" className={className}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          <p className="text-xs opacity-65 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" iconLeft={<Download className="w-3.5 h-3.5" />}>Export Report</Button>
          <Button variant="primary" size="sm" iconLeft={<Plus className="w-3.5 h-3.5" />}>New Purchase Order</Button>
        </div>
      </div>

      <MetricGrid columns={4} density="standard">
        <StatCard label="Active Shipments" value="1,284" delta="+12.8%" trend="up" subValue="186 arriving this week" icon={<Package className="w-4 h-4" />} />
        <StatCard label="On-Time Rate" value="96.4%" delta="+2.1%" trend="up" subValue="Target: 95%" icon={<Clock className="w-4 h-4" />} />
        <StatCard label="Open PO Value" value="$4.82M" delta="+8.3%" trend="up" subValue="142 open orders" icon={<DollarSign className="w-4 h-4" />} />
        <StatCard label="Customs Holds" value="12" delta="-3 cases" trend="up" subValue="4 exceeding 48 hours" icon={<ShieldAlert className="w-4 h-4" />} />
      </MetricGrid>

      <GeoBreakdown
        title="Regional Supplier & Shipment Breakdown"
        subtitle="Active supplier network and shipment distribution"
      />

      <AreaChart
        title="Monthly Freight Spend"
        subtitle="Consolidated global logistics expenditure"
        data={FREIGHT_DATA}
        height={240}
        summaryStats={[
          { label: "YTD Spend", value: "$1.00M" },
          { label: "Monthly Average", value: "$167k" },
          { label: "Peak Month", value: "$210k" },
        ]}
      />

      <Split
        ratio="8:4"
        density="standard"
        left={
          <LineItemMatrix
            title="PO-2026-0842 · Raw Material Procurement"
            currency="$"
            initialItems={PO_ITEMS}
          />
        }
        right={
          <ApprovalWorkflow
            layout="vertical"
            documentId="PO-2026-0842"
            title="Raw Material Procurement"
            amountLabel="$172,756"
            requester="Arjun Mehta · Procurement"
            budgetImpact="Within Q4 Cap"
            steps={APPROVAL_STEPS}
          />
        }
      />
    </Page>
  );
}
