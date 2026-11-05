"use client";

import React from "react";

export interface TrendDeltaProps {
  value: number;
  unit?: string;
  prefix?: string;
  isInverse?: boolean; // When true: negative is favorable (green), positive is unfavorable (rose) e.g. latency, churn
  format?: (val: number) => string;
  size?: "xs" | "sm" | "md";
  showArrow?: boolean;
  className?: string;
}

export function TrendDelta({
  value,
  unit = "%",
  prefix = "",
  isInverse = false,
  format,
  size = "xs",
  showArrow = true,
  className = "",
}: TrendDeltaProps) {
  const isZero = value === 0;
  const isPositive = value > 0;

  // Compute sentiment considering inverse metrics (e.g., lower latency is favorable)
  const isFavorable = isInverse ? value < 0 : value > 0;
  const isUnfavorable = isInverse ? value > 0 : value < 0;

  const sizeClasses = {
    xs: "text-[10px] px-1.5 py-0.25 tracking-tight gap-1",
    sm: "text-xs px-2 py-0.5 tracking-tight gap-1",
    md: "text-sm px-2.5 py-1 tracking-normal gap-1.5 font-medium",
  }[size];

  let colorClasses = "bg-neutral-900 text-neutral-400 border-neutral-800";
  if (!isZero) {
    if (isFavorable) {
      colorClasses = "bg-emerald-950/60 text-emerald-400 border-emerald-800/60";
    } else if (isUnfavorable) {
      colorClasses = "bg-rose-950/60 text-rose-400 border-rose-800/60";
    }
  }

  const sign = isPositive ? "+" : "";
  const formattedVal = format ? format(value) : `${sign}${prefix}${value}${unit}`;

  return (
    <span
      className={`inline-flex items-center font-mono rounded border select-none tabular-nums ${sizeClasses} ${colorClasses} ${className}`}
      aria-label={`Trend: ${formattedVal} ${isFavorable ? "Favorable" : isUnfavorable ? "Unfavorable" : "Neutral"}`}
    >
      {showArrow && !isZero && (
        <span className="flex-shrink-0 text-[0.85em] leading-none font-bold">
          {isPositive ? "▲" : "▼"}
        </span>
      )}
      <span>{formattedVal}</span>
    </span>
  );
}
