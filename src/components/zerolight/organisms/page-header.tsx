"use client";

import React from "react";
import { useZeroLight } from "../context";

export interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  bottomSlot?: React.ReactNode;
  bordered?: boolean;
  className?: string;
}

/**
 * Standardized SaaS PageHeader block with optional breadcrumbs, status badge, primary actions, and tabs slot.
 */
export function PageHeader({
  title,
  description,
  breadcrumbs,
  badge,
  actions,
  bottomSlot,
  bordered = true,
  className = "",
}: PageHeaderProps) {
  const { tokens, scaled } = useZeroLight();

  return (
    <header
      style={{
        borderColor: bordered ? tokens.universalBorderColor : undefined,
        color: tokens.textIconColor,
      }}
      className={`w-full font-sans ${bordered ? "pb-5 border-b" : "pb-3"} ${className}`}
    >
      {breadcrumbs && <div className="mb-2.5">{breadcrumbs}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1
              style={{
                fontSize: `${Math.max(20, scaled.headingFontSize + 6)}px`,
              }}
              className="font-semibold tracking-tight truncate"
            >
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p
              style={{ fontSize: `${scaled.scaledFontSize}px` }}
              className="opacity-65 max-w-2xl leading-relaxed"
            >
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {actions}
          </div>
        )}
      </div>

      {bottomSlot && <div className="mt-4">{bottomSlot}</div>}
    </header>
  );
}
