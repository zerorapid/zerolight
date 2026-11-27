"use client";

import React, { useState } from "react";
import { Briefcase, Users, TrendingUp, Target, Plus, Download } from "lucide-react";
import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";
import { StatCard } from "../molecules/stat-card";
import { AsyncCombobox } from "../molecules/async-combobox";
import { DataTable, type DataTableColumn } from "../organisms/data-table";
import { Page, Section, MetricGrid, Split, Panel } from "./layout-grammar";

export interface CRMPipelineBlockProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

interface DealRow {
  id: string;
  deal: string;
  account: string;
  owner: string;
  stage: string;
  value: string;
}

const DEALS: DealRow[] = [
  { id: "d1", deal: "Annual Logistics Suite", account: "Northstar Freight", owner: "Sarah Mitchell", stage: "Proposal", value: "$84,000" },
  { id: "d2", deal: "Global ERP Rollout", account: "Apex Industrial", owner: "David Chen", stage: "Negotiation", value: "$142,500" },
  { id: "d3", deal: "Warehouse Telemetry", account: "Vertex Supply", owner: "Arjun Mehta", stage: "Qualified", value: "$38,200" },
];

const COLUMNS: DataTableColumn<DealRow>[] = [
  { key: "deal", header: "Opportunity" },
  { key: "account", header: "Account" },
  { key: "owner", header: "Owner" },
  {
    key: "stage",
    header: "Stage",
    render: (r) => <Badge variant={r.stage === "Negotiation" ? "healthy" : "degraded"} size="xs">{r.stage}</Badge>,
  },
  { key: "value", header: "Amount", align: "right" },
];

/**
 * Tier 3 CRM & Sales Pipeline Block built with ZeroLight Layout Grammar.
 */
export function CRMPipelineBlock({
  title = "CRM Sales Pipeline",
  subtitle = "Lead qualification, active opportunities, and account ownership.",
  className = "",
}: CRMPipelineBlockProps) {
  const [selectedRep, setSelectedRep] = useState("all");

  return (
    <Page density="standard" className={className}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          <p className="text-xs opacity-65 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" iconLeft={<Download className="w-3.5 h-3.5" />}>Export Pipeline</Button>
          <Button variant="primary" size="sm" iconLeft={<Plus className="w-3.5 h-3.5" />}>New Deal</Button>
        </div>
      </div>

      <MetricGrid columns={4} density="standard">
        <StatCard label="Open Pipeline" value="$1.42M" delta="+18.4%" trend="up" icon={<Briefcase className="w-4 h-4" />} />
        <StatCard label="Qualified Leads" value="318" delta="+24" trend="up" icon={<Users className="w-4 h-4" />} />
        <StatCard label="Win Rate" value="34.2%" delta="+3.1%" trend="up" icon={<Target className="w-4 h-4" />} />
        <StatCard label="Avg Deal Size" value="$48,500" delta="+6.8%" trend="up" icon={<TrendingUp className="w-4 h-4" />} />
      </MetricGrid>

      <Split
        ratio="8:4"
        density="standard"
        left={
          <Section title="Active Opportunities" density="standard">
            <DataTable
              rows={DEALS}
              columns={COLUMNS}
              rowKey={(r) => r.id}
              showToolbar={true}
              searchPlaceholder="Search deals or accounts..."
            />
          </Section>
        }
        right={
          <Panel density="standard" className="space-y-4">
            <h3 className="text-sm font-semibold">Territory & Owner Filter</h3>
            <AsyncCombobox
              label="Sales Representative"
              value={selectedRep}
              onChange={setSelectedRep}
              options={[
                { value: "all", label: "All Representatives", description: "Full organization" },
                { value: "sarah", label: "Sarah Mitchell", description: "Enterprise West" },
                { value: "david", label: "David Chen", description: "Strategic Accounts" },
                { value: "arjun", label: "Arjun Mehta", description: "APAC Mid-Market" },
              ]}
            />
          </Panel>
        }
      />
    </Page>
  );
}
