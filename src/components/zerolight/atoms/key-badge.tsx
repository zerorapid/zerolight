"use client";

import React from "react";

export type KeyBadgeVariant = "neutral" | "emerald" | "amber" | "outline";
export type KeyBadgeSize = "xs" | "sm";

export interface KeyBadgeProps {
  label: string;
  variant?: KeyBadgeVariant;
  size?: KeyBadgeSize;
  className?: string;
}

export function KeyBadge({
  label,
  variant = "neutral",
  size = "xs",
  className = "",
}: KeyBadgeProps) {
  const sizeClasses = {
    xs: "text-[10px] px-1.5 py-0.5 tracking-wider",
    sm: "text-xs px-2 py-0.5 tracking-wide",
  }[size];

  const variantClasses = {
    neutral: "bg-neutral-900 text-neutral-300 border border-neutral-800",
    emerald: "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60",
    amber: "bg-amber-950/60 text-amber-300 border border-amber-800/60",
    outline: "bg-transparent text-neutral-400 border border-neutral-800",
  }[variant];

  return (
    <span
      className={`inline-flex items-center justify-center font-mono uppercase font-medium rounded select-none ${sizeClasses} ${variantClasses} ${className}`}
    >
      {label}
    </span>
  );
}
