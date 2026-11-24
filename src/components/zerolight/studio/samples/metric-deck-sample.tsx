"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Download,
  RefreshCw,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
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

export function MetricDeckSample({
  brandName = "ZeroLight",
  brandMark = "ZL",
  brandLogoUrl = null,
  selectedIconMark = "shield",
}: MetricDeckSampleProps) {
  const { tokens, scaled } = useZeroLight();
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d");

  const telemetryData = [
    { label: "Day 1", value: 34000 },
    { label: "Day 5", value: 42000 },
    { label: "Day 10", value: 39000 },
    { label: "Day 15", value: 58000 },
    { label: "Day 20", value: 64000 },
    { label: "Day 25", value: 78000 },
    { label: "Day 30", value: 92450 },
  ];

  const primaryColor = tokens.chartPrimaryColor || tokens.primaryButtonColor || "#0F172A";
  const secondaryColor = tokens.chartSecondaryColor || "#059669";

  return (
    <div
      className="w-full flex flex-col space-y-5 font-sans select-none"
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
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <BrandLogoRenderer
              brandLogoUrl={brandLogoUrl}
              selectedIconMark={selectedIconMark}
              brandMark={brandMark}
              size="sm"
            />
            <h2
              className="text-base font-bold tracking-tight"
              style={{
                fontFamily: scaled.resolvedHeadingFontFamily,
                color: tokens.textIconColor,
              }}
            >
              {brandName} Revenue Metrics
            </h2>
            <Badge variant="neutral" size="sm">Live HSM Stream</Badge>
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
            onClick={() => alert("Exporting metrics TSV...")}
          >
            Export
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<RefreshCw size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} />}
            onClick={() => alert("Refreshed telemetry stream")}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* ── 4 KEY METRIC STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Monthly Recurring Revenue"
          value="$128,450.00"
          delta="+14.2%"
          trend="up"
          comparisonText="vs last month"
          icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          label="Net Revenue Churn"
          value="1.18%"
          delta="-0.4%"
          trend="up"
          comparisonText="healthy baseline"
          icon={<TrendingDown className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          label="Active Workspaces"
          value="4,892"
          delta="+8.1%"
          trend="up"
          comparisonText="across 14 regions"
          icon={<Users className="w-4 h-4 text-slate-700" />}
        />
        <StatCard
          label="Conversion Rate"
          value="3.84%"
          delta="+1.2%"
          trend="up"
          comparisonText="organic funnel"
          icon={<Activity className="w-4 h-4 text-slate-700" />}
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
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3
              className="text-sm font-bold"
              style={{
                fontFamily: scaled.resolvedHeadingFontFamily,
                color: tokens.textIconColor,
              }}
            >
              MRR Expansion Curve
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
            data={telemetryData}
            height={210}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </div>
      </div>
    </div>
  );
}
