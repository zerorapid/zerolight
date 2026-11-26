"use client";

import React from "react";
import { DollarSign, Users, TrendingUp, AlertCircle, Download, Plus } from "lucide-react";
import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";
import { StatCard } from "../molecules/stat-card";
import { AreaChart, type AreaDataPoint } from "../molecules/area-chart";
import { DataTable, type DataTableColumn } from "../organisms/data-table";
import { Page, Section, MetricGrid } from "./layout-grammar";

export interface SimpleAnalyticsBlockProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const DEFAULT_TREND: AreaDataPoint[] = [
  { label: "Jan", value: 42000 },
  { label: "Feb", value: 48500 },
  { label: "Mar", value: 46200 },
  { label: "Apr", value: 53800 },
  { label: "May", value: 59400 },
  { label: "Jun", value: 64200 },
];

interface RecentAccountRow {
  id: string;
  account: string;
  plan: string;
  mrr: string;
  status: string;
}

const DEFAULT_ROWS: RecentAccountRow[] = [
  { id: "1", account: "Northstar Logistics", plan: "Enterprise", mrr: "$4,800", status: "Active" },
  { id: "2", account: "Apex Manufacturing", plan: "Growth", mrr: "$1,450", status: "Active" },
  { id: "3", account: "Vertex BioLabs", plan: "Enterprise", mrr: "$6,200", status: "Trial" },
];

const COLUMNS: DataTableColumn<RecentAccountRow>[] = [
  { key: "account", header: "Account" },
  { key: "plan", header: "Plan" },
  { key: "mrr", header: "MRR", align: "right" },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge variant={row.status === "Active" ? "healthy" : "degraded"} size="xs">
        {row.status}
      </Badge>
    ),
  },
];

/**
 * Tier 1 Simple Analytics Block — clean 4-KPI + 1 Chart + 1 DataTable layout.
 */
export function SimpleAnalyticsBlock({
  title = "Revenue Overview",
  subtitle = "Recurring revenue, active workspaces, and recent account activity.",
  className = "",
}: SimpleAnalyticsBlockProps) {
  return (
    <Page density="standard" className={className}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          <p className="text-xs opacity-65 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" iconLeft={<Download className="w-3.5 h-3.5" />}>Export CSV</Button>
          <Button variant="primary" size="sm" iconLeft={<Plus className="w-3.5 h-3.5" />}>New Report</Button>
        </div>
      </div>

      <MetricGrid columns={4} density="standard">
        <StatCard label="Monthly Recurring Revenue" value="$64,200" delta="+14.2%" trend="up" subValue="vs. $56,210 last month" icon={<DollarSign className="w-4 h-4" />} />
        <StatCard label="Active Workspaces" value="1,284" delta="+8.1%" trend="up" subValue="42 upgraded this week" icon={<Users className="w-4 h-4" />} />
        <StatCard label="Net Retention" value="112.4%" delta="+2.1%" trend="up" subValue="Target: 108%" icon={<TrendingUp className="w-4 h-4" />} />
        <StatCard label="Churn Rate" value="1.4%" delta="-0.3%" trend="up" subValue="3 accounts flagged" icon={<AlertCircle className="w-4 h-4" />} />
      </MetricGrid>

      <Section density="standard">
        <AreaChart
          title="MRR Growth"
          subtitle="Six-month recurring revenue trajectory"
          data={DEFAULT_TREND}
          height={240}
          summaryStats={[
            { label: "6-Month Total", value: "$314,100" },
            { label: "Monthly Average", value: "$52,350" },
            { label: "Peak Month", value: "$64,200" },
          ]}
        />
      </Section>

      <DataTable
        rows={DEFAULT_ROWS}
        columns={COLUMNS}
        rowKey={(r) => r.id}
        showToolbar={true}
        searchPlaceholder="Search accounts..."
      />
    </Page>
  );
}
