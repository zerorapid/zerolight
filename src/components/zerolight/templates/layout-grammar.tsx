"use client";

import React from "react";
import { useZeroLight } from "../context";
import type { SpatialDensity } from "../composition-engine";

const DENSITY_MAP: Record<SpatialDensity, { pagePad: string; sectionGap: string; cardPad: string; gridGap: string }> = {
  compact: { pagePad: "p-4", sectionGap: "space-y-4", cardPad: "p-3", gridGap: "gap-3" },
  standard: { pagePad: "p-6", sectionGap: "space-y-6", cardPad: "p-4", gridGap: "gap-4" },
  comfortable: { pagePad: "p-8", sectionGap: "space-y-8", cardPad: "p-6", gridGap: "gap-6" },
};

export interface PageProps {
  density?: SpatialDensity;
  maxWidth?: "6xl" | "7xl" | "full";
  children: React.ReactNode;
  className?: string;
}

/**
 * ZeroLight Layout Grammar: Page owns outer padding, max-width, and semantic background.
 */
export function Page({
  density = "standard",
  maxWidth = "7xl",
  children,
  className = "",
}: PageProps) {
  const { tokens, scaled } = useZeroLight();
  const d = DENSITY_MAP[density];
  const maxW = maxWidth === "full" ? "max-w-full" : maxWidth === "6xl" ? "max-w-6xl" : "max-w-7xl";

  return (
    <div
      style={{
        color: tokens.textIconColor,
        fontFamily: scaled.resolvedFontFamily,
      }}
      className={`w-full mx-auto ${maxW} ${d.pagePad} ${d.sectionGap} ${className}`}
    >
      {children}
    </div>
  );
}

export interface SectionProps {
  title?: string;
  subtitle?: string;
  density?: SpatialDensity;
  children: React.ReactNode;
  className?: string;
}

/**
 * ZeroLight Layout Grammar: Section owns vertical grouping and section header rhythm.
 */
export function Section({
  title,
  subtitle,
  density = "standard",
  children,
  className = "",
}: SectionProps) {
  const { scaled } = useZeroLight();
  const d = DENSITY_MAP[density];

  return (
    <section className={`${d.sectionGap} ${className}`}>
      {(title || subtitle) && (
        <div className="space-y-0.5">
          {title && (
            <h2
              style={{ fontFamily: scaled.resolvedHeadingFontFamily, fontWeight: scaled.headingWeight }}
              className="text-base font-semibold tracking-tight"
            >
              {title}
            </h2>
          )}
          {subtitle && <p className="text-xs opacity-65">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

export interface MetricGridProps {
  columns?: 2 | 3 | 4;
  density?: SpatialDensity;
  children: React.ReactNode;
  className?: string;
}

/**
 * ZeroLight Layout Grammar: MetricGrid enforces balanced KPI columns across viewports.
 */
export function MetricGrid({
  columns = 4,
  density = "standard",
  children,
  className = "",
}: MetricGridProps) {
  const d = DENSITY_MAP[density];
  const cols =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return <div className={`grid ${cols} ${d.gridGap} ${className}`}>{children}</div>;
}

export interface SplitProps {
  ratio?: "1:1" | "2:1" | "3:1" | "8:4";
  density?: SpatialDensity;
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string;
}

/**
 * ZeroLight Layout Grammar: Split enforces proportional two-column desk layouts.
 */
export function Split({
  ratio = "2:1",
  density = "standard",
  left,
  right,
  className = "",
}: SplitProps) {
  const d = DENSITY_MAP[density];
  const leftSpan =
    ratio === "1:1" ? "lg:col-span-6" : ratio === "3:1" ? "lg:col-span-9" : "lg:col-span-8";
  const rightSpan =
    ratio === "1:1" ? "lg:col-span-6" : ratio === "3:1" ? "lg:col-span-3" : "lg:col-span-4";

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 ${d.gridGap} items-start ${className}`}>
      <div className={`${leftSpan} min-w-0`}>{left}</div>
      <div className={`${rightSpan} min-w-0`}>{right}</div>
    </div>
  );
}

export interface PanelProps {
  density?: SpatialDensity;
  children: React.ReactNode;
  className?: string;
}

/**
 * ZeroLight Layout Grammar: Panel owns surface border, radius, and internal padding.
 */
export function Panel({ density = "standard", children, className = "" }: PanelProps) {
  const { tokens, scaled } = useZeroLight();
  const d = DENSITY_MAP[density];

  return (
    <div
      style={{
        backgroundColor: tokens.universalFillColor,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
        borderStyle: "solid",
        borderRadius: `${scaled.scaledCardRadius}px`,
        boxShadow: scaled.cardShadow,
        color: tokens.textIconColor,
      }}
      className={`${d.cardPad} ${className}`}
    >
      {children}
    </div>
  );
}
