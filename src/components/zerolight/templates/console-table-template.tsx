"use client";

import React from "react";
import { useZeroLight } from "../context";
import { AppShell, NavItem } from "../organisms/app-shell";

export interface ConsoleTableTemplateProps {
  /** Optional breadcrumbs trail */
  breadcrumbs?: React.ReactNode;
  /** Entity/Fleet title (e.g. "Student Roster", "API Keys", "Cloud Clusters") */
  title: string;
  /** Subtitle context */
  subtitle?: string;
  /** Status or count pill (e.g. "438 Active Students") */
  badge?: React.ReactNode;
  /** Exactly 1 Primary Action button (e.g. "Register Student", "Create Key") */
  primaryAction?: React.ReactNode;
  /** Optional secondary actions (e.g. "Export CSV", "Sync") */
  secondaryActions?: React.ReactNode;
  /** Filter & search toolbar row (SearchBar, Status Filter, SegmentedControl) */
  toolbar?: React.ReactNode;
  /** Batch selection floating bar (renders when 1 or more rows are selected) */
  batchActionBar?: React.ReactNode;
  /** The primary DataTable component */
  table: React.ReactNode;
  /** Pagination controls */
  pagination?: React.ReactNode;
  /** Zone 3: Progressive disclosure drawer (e.g. DetailDrawer) */
  detailDrawer?: React.ReactNode;
  /** Zone 3: Progressive disclosure modal (e.g. ConfirmationModal) */
  modal?: React.ReactNode;
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

export function ConsoleTableTemplate({
  breadcrumbs,
  title,
  subtitle,
  badge,
  primaryAction,
  secondaryActions,
  toolbar,
  batchActionBar,
  table,
  pagination,
  detailDrawer,
  modal,
  shellConfig,
  className = "",
}: ConsoleTableTemplateProps) {
  const { scaled } = useZeroLight();

  const content = (
    <div className={`space-y-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none ${className}`}>
      {/* ── ZONE 1: BREADCRUMBS & CONSOLE HEADER ── */}
      <section className="space-y-3">
        {breadcrumbs && <div>{breadcrumbs}</div>}

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
              {badge && <div className="shrink-0">{badge}</div>}
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

          {(primaryAction || secondaryActions) && (
            <div className="flex items-center gap-2.5 shrink-0">
              {secondaryActions}
              {primaryAction}
            </div>
          )}
        </div>
      </section>

      {/* ── ZONE 2: UNIFIED WORKSPACE (TOOLBAR, TABLE & PAGINATION) ── */}
      <section className="space-y-3">
        {/* Filter & Search Toolbar */}
        {toolbar && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {toolbar}
          </div>
        )}

        {/* Batch Action Callout Bar (Progressive Activation) */}
        {batchActionBar && (
          <div className="w-full">
            {batchActionBar}
          </div>
        )}

        {/* Core Table View */}
        <div className="w-full">
          {table}
        </div>

        {/* Pagination Footer */}
        {pagination && (
          <div className="flex justify-end pt-1">
            {pagination}
          </div>
        )}
      </section>

      {/* ── ZONE 3: PROGRESSIVE DISCLOSURE (DRAWER & MODAL) ── */}
      {detailDrawer}
      {modal}
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
