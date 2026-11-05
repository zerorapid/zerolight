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
      pill: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60",
      dot: "bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]",
    },
    warning: {
      pill: "bg-amber-950/60 text-amber-300 border-amber-800/60",
      dot: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]",
    },
    error: {
      pill: "bg-rose-950/60 text-rose-300 border-rose-800/60",
      dot: "bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]",
    },
    info: {
      pill: "bg-cyan-950/60 text-cyan-300 border-cyan-800/60",
      dot: "bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]",
    },
    brand: {
      pill: "bg-emerald-950/80 text-emerald-200 border-emerald-700/80",
      dot: "bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.9)]",
    },
    neutral: {
      pill: "bg-neutral-900 text-neutral-300 border-neutral-800",
      dot: "bg-neutral-500",
    },
  };

  const { pill, dot } = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[11px] font-medium border select-none ${pill} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />}
      <span>{label}</span>
    </span>
  );
}
