"use client";

import React from "react";
import { useZeroLight } from "../context";
import { AppShell, NavItem } from "../organisms/app-shell";

export interface AnalyticsReportTemplateProps {
  /** Report title */
  title: string;
  /** Subtitle context */
  subtitle?: string;
  /** Period selector or DateRangePicker slot */
  dateRangeFilter?: React.ReactNode;
  /** Export or secondary action (e.g. Export CSV, Share Report) */
  exportAction?: React.ReactNode;
  /** High-signal top metrics deck (3 to 4 StatCards with Sparklines) */
  kpiCards?: React.ReactNode;
  /** Primary hero visualization (e.g. AreaChart) */
  heroChart: React.ReactNode;
  /** Companion composite visualization row (e.g. DonutChart + HeatmapMatrix + FunnelChart) */
  compositeGrid?: React.ReactNode;
  /** Bottom drill-down table or breakdown list */
  breakdownSection?: React.ReactNode;
  /** Zone 3: Progressive disclosure drawer or modal */
  progressiveDisclosure?: React.ReactNode;
  /** Optional AppShell wrapper configuration */
  shellConfig?: {
    brandName?: string;
    brandLogo?: React.ReactNode;
    navItems?: NavItem[];
    headerRight?: React.ReactNode;
    footerAction?: React.ReactNode;
  };
  className?: string;
}

export function AnalyticsReportTemplate({
  title,
  subtitle,
  dateRangeFilter,
  exportAction,
  kpiCards,
  heroChart,
  compositeGrid,
  breakdownSection,
  progressiveDisclosure,
  shellConfig,
  className = "",
}: AnalyticsReportTemplateProps) {
  const { scaled } = useZeroLight();

  const content = (
    <div className={`space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none ${className}`}>
      {/* ── ZONE 1: ANALYTICS HEADER & PERIOD SELECTOR ── */}
      <section className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-200/70">
          <div className="space-y-1 min-w-0">
            <h1
              style={{ fontSize: `${scaled.headingFontSize}px` }}
              className="font-bold text-neutral-900 tracking-tight truncate max-w-xl"
              title={title}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                style={{ fontSize: `${scaled.sublabelFontSize}px` }}
                className="text-neutral-500 line-clamp-2 max-w-2xl leading-relaxed"
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Date Range Picker & Export Controls */}
          {(dateRangeFilter || exportAction) && (
            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              {dateRangeFilter}
              {exportAction}
            </div>
          )}
        </div>

        {/* Top KPI Telemetry (Anti-Crowding Law: Max 4 Cards) */}
        {kpiCards && (
          <div className="w-full">
            {React.isValidElement(kpiCards) && (kpiCards.props as any)?.className?.includes("grid") ? (
              kpiCards
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {kpiCards}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── ZONE 2: PRIMARY HERO CHART & COMPOSITE VISUALIZATION ── */}
      <section className="space-y-6">
        {/* Hero Chart (e.g. AreaChart) */}
        <div className="w-full">
          {heroChart}
        </div>

        {/* Secondary Composite Visualization Grid */}
        {compositeGrid && (
          <div className="w-full">
            {React.isValidElement(compositeGrid) && (compositeGrid.props as any)?.className?.includes("grid") ? (
              compositeGrid
            ) : (
              <div className="w-full">
                {compositeGrid}
              </div>
            )}
          </div>
        )}

        {/* Granular Breakdown Section */}
        {breakdownSection && (
          <div className="w-full">
            {breakdownSection}
          </div>
        )}
      </section>

      {/* ── ZONE 3: PROGRESSIVE DISCLOSURE ── */}
      {progressiveDisclosure}
    </div>
  );

  if (shellConfig) {
    return (
      <AppShell
        brandName={shellConfig.brandName}
        brandLogo={shellConfig.brandLogo}
        navItems={shellConfig.navItems}
        headerRight={shellConfig.headerRight}
        footerAction={shellConfig.footerAction}
      >
        {content}
      </AppShell>
    );
  }

  return content;
}
