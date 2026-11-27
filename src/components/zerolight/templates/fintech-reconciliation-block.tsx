"use client";

import React from "react";
import { Scale, CheckCircle2, AlertTriangle, Landmark, Download, Plus } from "lucide-react";
import { Button } from "../atoms/button";
import { StatCard } from "../molecules/stat-card";
import { ThreeWayMatch } from "../organisms/three-way-match";
import { LedgerBalancer } from "../organisms/ledger-balancer";
import { Page, MetricGrid, Split } from "./layout-grammar";

export interface FintechReconciliationBlockProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * Tier 3 FinTech & Accounting Reconciliation Block — ThreeWayMatch + LedgerBalancer.
 */
export function FintechReconciliationBlock({
  title = "Financial Reconciliation Desk",
  subtitle = "Three-way invoice matching, ledger balancing, and exception resolution.",
  className = "",
}: FintechReconciliationBlockProps) {
  return (
    <Page density="compact" className={className}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          <p className="text-xs opacity-65 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" iconLeft={<Download className="w-3.5 h-3.5" />}>Export Audit CSV</Button>
          <Button variant="primary" size="sm" iconLeft={<Plus className="w-3.5 h-3.5" />}>New Journal Entry</Button>
        </div>
      </div>

      <MetricGrid columns={4} density="compact">
        <StatCard label="Matched Volume" value="$2.84M" delta="98.2%" trend="up" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatCard label="Open Variances" value="04" delta="-2" trend="up" icon={<AlertTriangle className="w-4 h-4" />} />
        <StatCard label="Trial Balance" value="$0.00" delta="Balanced" trend="up" icon={<Scale className="w-4 h-4" />} />
        <StatCard label="Settlement Pool" value="$612,400" delta="+5.4%" trend="up" icon={<Landmark className="w-4 h-4" />} />
      </MetricGrid>

      <Split
        ratio="1:1"
        density="compact"
        left={
          <ThreeWayMatch
            poNumber="PO-2026-0842"
            grnNumber="GRN-2026-0411"
            invoiceNumber="INV-2026-0842"
            currency="$"
            lines={[
              { sku: "ALU-6061-RAW", description: "Aluminium Alloy Sheets", poQty: 1200, grnQty: 1200, invoiceQty: 1200, poUnitPrice: 42.5, invoiceUnitPrice: 42.5 },
              { sku: "STL-304-COIL", description: "Stainless Steel Coils", poQty: 800, grnQty: 780, invoiceQty: 800, poUnitPrice: 68, invoiceUnitPrice: 68 },
            ]}
          />
        }
        right={
          <LedgerBalancer
            journalId="JRN-2026-114"
            fiscalPeriod="Nov 2026"
            currency="$"
            initialLines={[
              { id: "l1", accountCode: "1400", accountName: "Raw Material Inventory", debit: 105400, credit: 0 },
              { id: "l2", accountCode: "2000", accountName: "Accounts Payable", debit: 0, credit: 105400 },
            ]}
          />
        }
      />
    </Page>
  );
}
