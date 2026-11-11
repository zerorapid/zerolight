"use client";

import React from "react";
import { useZeroLight } from "../context";
import { AppShell, NavItem } from "../organisms/app-shell";

export interface DashboardMetricItem {
  id: string;
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: "positive" | "negative" | "neutral";
  subtext?: string;
  icon?: React.ReactNode;
}

export interface DashboardTemplateProps {
  /** Page title (max 4-6 words) */
  title: string;
  /** Subtitle context (max 12-16 words) */
  subtitle?: string;
  /** Status badge or live indicator (e.g., "Live Production") */
  statusIndicator?: React.ReactNode;
  /** Exactly 1 primary CTA action button */
  primaryAction?: React.ReactNode;
  /** Optional secondary action buttons (e.g., Export, Refresh) */
  secondaryActions?: React.ReactNode;
  /** High-signal telemetry metrics: Strictly 3 to 4 metrics */
  metrics?: React.ReactNode;
  /** Zone 2: Main primary visualization or primary workspace (e.g., AreaChart, Fleet map) */
  primaryWidget: React.ReactNode;
  /** Zone 2: Secondary companion widget (e.g., Ranked list, Donut chart, Activity stream) */
  secondaryWidget?: React.ReactNode;
  /** Zone 2: Additional full-width data section below the split row (e.g., Recent Activities table) */
  dataSection?: React.ReactNode;
  /** Zone 3: Progressive disclosure drawer, modal, or toast host */
  progressiveDisclosure?: React.ReactNode;
  /** Optional AppShell wrapper configuration (if true or props provided, wraps in AppShell) */
  shellConfig?: {
    brandName?: string;
    brandLogo?: React.ReactNode;
    navItems?: NavItem[];
    headerRight?: React.ReactNode;
    footerAction?: React.ReactNode;
  };
  className?: string;
}

export function DashboardTemplate({
  title,
  subtitle,
  statusIndicator,
  primaryAction,
  secondaryActions,
  metrics,
  primaryWidget,
  secondaryWidget,
  dataSection,
  progressiveDisclosure,
  shellConfig,
  className = "",
}: DashboardTemplateProps) {
  const { scaled } = useZeroLight();

  const content = (
    <div className={`space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none ${className}`}>
      {/* ── ZONE 1: HERO SESSION BAR & HIGH-SIGNAL TELEMETRY ── */}
      <section className="space-y-5">
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/70">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1
                style={{ fontSize: `${scaled.headingFontSize}px` }}
                className="font-bold text-neutral-900 tracking-tight truncate max-w-xl"
                title={title}
              >
                {title}
              </h1>
              {statusIndicator && (
                <div className="shrink-0">{statusIndicator}</div>
              )}
            </div>
            {subtitle && (
              <p
                style={{ fontSize: `${scaled.sublabelFontSize}px` }}
                className="text-neutral-500 line-clamp-2 max-w-2xl leading-relaxed"
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Action CTAs: Exactly 1 Primary Action + Optional Secondary */}
          {(primaryAction || secondaryActions) && (
            <div className="flex items-center gap-2.5 shrink-0">
              {secondaryActions}
              {primaryAction}
            </div>
          )}
        </div>

        {/* High-Signal Metrics Grid (Anti-Crowding Law: Max 4 Cards) */}
        {metrics && (
          <div className="w-full">
            {React.isValidElement(metrics) && (metrics.props as any)?.className?.includes("grid") ? (
              metrics
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {metrics}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── ZONE 2: UNIFIED CORE WORKSPACE (SPLIT ANALYTICS & ACTIVITY) ── */}
      <section className="space-y-5">
        <div className={`grid grid-cols-1 ${secondaryWidget ? "lg:grid-cols-3" : "grid-cols-1"} gap-5 items-stretch`}>
          <div className={`${secondaryWidget ? "lg:col-span-2" : "col-span-1"} w-full h-full flex flex-col [&>*]:h-full`}>
            {primaryWidget}
          </div>
          {secondaryWidget && (
            <div className="lg:col-span-1 w-full h-full flex flex-col space-y-4 [&>*]:h-full">
              {secondaryWidget}
            </div>
          )}
        </div>

        {/* Full-Width Workspace Data Section (e.g. Transactions Table, Fleet Roster) */}
        {dataSection && (
          <div className="w-full">
            {dataSection}
          </div>
        )}
      </section>

      {/* ── ZONE 3: PROGRESSIVE DISCLOSURE (DRAWERS, MODALS & TOASTS) ── */}
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
