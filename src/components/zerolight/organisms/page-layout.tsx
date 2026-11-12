"use client";

import React from "react";
import { useZeroLight } from "../context";

export interface PageGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

const COL_CLASSES = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
};

const GAP_CLASSES = {
  sm: "gap-3",
  md: "gap-5",
  lg: "gap-7",
};

/**
 * Responsive SaaS PageGrid block for organizing KPI cards, charts, and content panels.
 */
export function PageGrid({
  cols = 3,
  gap = "md",
  className = "",
  children,
  ...props
}: PageGridProps) {
  return (
    <div
      className={`grid ${COL_CLASSES[cols]} ${GAP_CLASSES[gap]} w-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ContentSectionProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Structured ContentSection block with clean heading row, optional actions, and body slot.
 */
export function ContentSection({
  title,
  description,
  actions,
  children,
  className = "",
}: ContentSectionProps) {
  const { tokens, scaled } = useZeroLight();

  return (
    <section
      style={{ color: tokens.textIconColor }}
      className={`w-full space-y-4 font-sans ${className}`}
    >
      {(title || description || actions) && (
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0 space-y-0.5">
            {title && (
              <h2
                style={{ fontSize: `${scaled.headingFontSize}px` }}
                className="font-semibold tracking-tight"
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                style={{ fontSize: `${scaled.sublabelFontSize}px` }}
                className="opacity-65"
              >
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 shrink-0">{actions}</div>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
