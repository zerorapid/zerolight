"use client";

import React from "react";

export type StatusPillVariant =
  | "success"
  | "warning"
  | "error"
  | "neutral"
  | "info"
  | "brand";

export interface StatusPillProps {
  label: string;
  variant?: StatusPillVariant;
  showDot?: boolean;
  className?: string;
}

export function StatusPill({
  label,
  variant = "neutral",
  showDot = true,
  className = "",
}: StatusPillProps) {
  const variantStyles: Record<StatusPillVariant, { pill: string; dot: string }> = {
    success: {
      pill: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
      dot: "bg-emerald-500",
    },
    warning: {
      pill: "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
      dot: "bg-amber-500",
    },
    error: {
      pill: "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60",
      dot: "bg-rose-500",
    },
    info: {
      pill: "bg-sky-50 dark:bg-cyan-950/60 text-sky-800 dark:text-cyan-300 border-sky-200 dark:border-cyan-800/60",
      dot: "bg-sky-500",
    },
    brand: {
      pill: "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700/80",
      dot: "bg-emerald-500",
    },
    neutral: {
      pill: "bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800",
      dot: "bg-neutral-500",
    },
  };

  const { pill, dot } = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-sans text-[11px] font-medium border select-none ${pill} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />}
      <span>{label}</span>
    </span>
  );
}
