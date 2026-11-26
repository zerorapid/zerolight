"use client";

import React, { useState } from "react";
import {
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Download,
  RefreshCw,
} from "lucide-react";
import { useZeroLight } from "../../context";
import { StatCard } from "../../molecules/stat-card";
import { AreaChart } from "../../molecules/area-chart";
import { SegmentedControl } from "../../molecules/segmented-control";
import { Badge } from "../../atoms/badge";
import { Button } from "../../atoms/button";
import { BrandLogoRenderer } from "./brand-logo-renderer";

export interface MetricDeckSampleProps {
  brandName?: string;
  brandMark?: string;
  brandLogoUrl?: string | null;
  selectedIconMark?: string;
}

const TIMEFRAME_DATA = {
  "7d": {
    mrr: "$32,140.00",
    mrrDelta: "+4.8%",
    churn: "0.92%",
    churnDelta: "-0.2%",
    workspaces: "4,940",
    wsDelta: "+2.4%",
    conversion: "4.12%",
    convDelta: "+0.5%",
    series: [
      { label: "Mon", value: 24500 },
      { label: "Tue", value: 26200 },
      { label: "Wed", value: 27100 },
      { label: "Thu", value: 28900 },
      { label: "Fri", value: 30400 },
      { label: "Sat", value: 31200 },
      { label: "Sun", value: 32140 },
    ],
  },
  "30d": {
    mrr: "$128,450.00",
    mrrDelta: "+14.2%",
    churn: "1.18%",
    churnDelta: "-0.4%",
    workspaces: "4,892",
    wsDelta: "+8.1%",
    conversion: "3.84%",
    convDelta: "+1.2%",
    series: [
      { label: "Day 1", value: 34000 },
      { label: "Day 5", value: 42000 },
      { label: "Day 10", value: 39000 },
      { label: "Day 15", value: 58000 },
      { label: "Day 20", value: 64000 },
      { label: "Day 25", value: 78000 },
      { label: "Day 30", value: 92450 },
    ],
  },
  "90d": {
    mrr: "$384,920.00",
    mrrDelta: "+31.6%",
    churn: "1.34%",
    churnDelta: "-0.7%",
    workspaces: "5,210",
    wsDelta: "+19.5%",
    conversion: "4.05%",
    convDelta: "+1.9%",
    series: [
      { label: "W1", value: 140000 },
      { label: "W3", value: 185000 },
      { label: "W5", value: 220000 },
      { label: "W7", value: 265000 },
      { label: "W9", value: 310000 },
      { label: "W11", value: 352000 },
      { label: "W13", value: 384920 },
    ],
  },
} as const;

export function MetricDeckSample({
  brandName = "ZeroLight",
  brandMark = "ZL",
  brandLogoUrl = null,
  selectedIconMark = "shield",
}: MetricDeckSampleProps) {
  const { tokens, scaled } = useZeroLight();
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d");
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const active = TIMEFRAME_DATA[timeframe];
  const primaryColor = tokens.chartPrimaryColor || tokens.primaryButtonColor || "#0F172A";
  const rawSec = (tokens.chartSecondaryColor || "").toUpperCase();
  const secondaryColor =
    !rawSec || rawSec === "#FFFFFF" ? "#10B981" : tokens.chartSecondaryColor!;

  const handleExportTsv = () => {
    const tsv = [
      "Period\tValue",
      ...active.series.map((d) => `${d.label}\t${d.value}`),
    ].join("\n");
    const blob = new Blob([tsv], { type: "text/tab-separated-values" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brandName.toLowerCase().replace(/\s+/g, "-")}-metrics-${timeframe}.tsv`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusNotice(`Exported ${timeframe} TSV`);
    setTimeout(() => setStatusNotice(null), 2500);
  };

  return (
    <div
      className="w-full min-w-0 flex flex-col space-y-5 font-sans select-none"
      style={{
        color: tokens.textIconColor,
        fontFamily: scaled.resolvedFontFamily,
      }}
    >
      {/* ── TOP KPI HEADER & TIMEFRAME SELECTOR ── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b"
        style={{ borderColor: tokens.universalBorderColor }}
      >
        <div className="space-y-0.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="shrink-0">
              <BrandLogoRenderer
                brandLogoUrl={brandLogoUrl}
                selectedIconMark={selectedIconMark}
                brandMark={brandMark}
                size="sm"
              />
            </div>
            <h2
              className="text-base font-bold tracking-tight"
              style={{
                fontFamily: scaled.resolvedHeadingFontFamily,
                color: tokens.textIconColor,
              }}
            >
              {brandName} Revenue Metrics
            </h2>
            <Badge variant="neutral" size="sm">
              {statusNotice || "Live HSM Stream"}
            </Badge>
          </div>
          <p className="text-xs opacity-75">
            Card elevation, dual-accent SVG gradients, and tabular-nums telemetry test-bench.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SegmentedControl
            value={timeframe}
            onChange={(val) => setTimeframe(val as "7d" | "30d" | "90d")}
            options={[
              { key: "7d", label: "7 Days" },
              { key: "30d", label: "30 Days" },
              { key: "90d", label: "90 Days" },
            ]}
          />
          <Button
            variant="outline"
            size="sm"
            iconLeft={<Download size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} />}
            onClick={handleExportTsv}
          >
            Export
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<RefreshCw size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} />}
            onClick={() => {
              setStatusNotice("Synced just now");
              setTimeout(() => setStatusNotice(null), 2000);
            }}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* ── 4 KEY METRIC STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Monthly Recurring Revenue"
          value={active.mrr}
          delta={active.mrrDelta}
          trend="up"
          comparisonText={`over ${timeframe}`}
          icon={<DollarSign className="w-4 h-4 text-emerald-500" />}
        />
        <StatCard
          label="Net Revenue Churn"
          value={active.churn}
          delta={active.churnDelta}
          trend="up"
          comparisonText="healthy baseline"
          icon={<TrendingDown className="w-4 h-4 text-emerald-500" />}
        />
        <StatCard
          label="Active Workspaces"
          value={active.workspaces}
          delta={active.wsDelta}
          trend="up"
          comparisonText="across 14 regions"
          icon={<Users className="w-4 h-4" style={{ color: tokens.textIconColor }} />}
        />
        <StatCard
          label="Conversion Rate"
          value={active.conversion}
          delta={active.convDelta}
          trend="up"
          comparisonText="organic funnel"
          icon={<Activity className="w-4 h-4" style={{ color: tokens.textIconColor }} />}
        />
      </div>

      {/* ── MAIN SVG TELEMETRY CHART CARD ── */}
      <div
        className="p-5 space-y-4 border"
        style={{
          backgroundColor: tokens.universalFillColor,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          borderRadius: `${scaled.scaledCardRadius}px`,
          boxShadow: scaled.cardShadow,
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h3
              className="text-sm font-bold"
              style={{
                fontFamily: scaled.resolvedHeadingFontFamily,
                color: tokens.textIconColor,
              }}
            >
              MRR Expansion Curve ({timeframe})
            </h3>
            <p className="text-xs opacity-75">
              Interactive SVG area fill dynamically recalculates fill opacity and stroke hairlines based on token colors.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
              <span className="font-semibold opacity-85">Gross MRR</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
              <span className="font-semibold opacity-85">Net Expansion</span>
            </div>
          </div>
        </div>

        {/* Real AreaChart Component */}
        <div className="h-56 w-full pt-2">
          <AreaChart
            data={[...active.series]}
            height={210}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </div>
      </div>
    </div>
  );
}
