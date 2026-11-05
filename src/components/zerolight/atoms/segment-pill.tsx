"use client";

import React from "react";

export interface SegmentPillProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function SegmentPill({
  label,
  selected,
  onSelect,
  disabled = false,
  className = "",
  ariaLabel,
}: SegmentPillProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={ariaLabel || label}
      disabled={disabled}
      onClick={onSelect}
      className={`h-7 px-3 inline-flex items-center justify-center text-xs font-medium rounded transition-all duration-300 ease-spring-tactile select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 hover:scale-[1.02] transform-gpu will-change-transform ${
        selected
          ? "bg-neutral-100 text-neutral-950 font-semibold shadow-[0_0_14px_rgba(255,255,255,0.22)] border border-neutral-100"
          : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-100 hover:border-neutral-650 hover:bg-neutral-850"
      } ${className}`}
    >
      {label}
    </button>
  );
}
