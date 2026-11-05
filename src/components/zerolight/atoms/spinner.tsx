"use client";

import React from "react";

export type SpinnerSize = "xs" | "sm" | "md" | "lg";

export interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  color?: string;
  ariaLabel?: string;
}

export function Spinner({
  size = "sm",
  className = "",
  color = "currentColor",
  ariaLabel = "Loading...",
}: SpinnerProps) {
  const sizeMap: Record<SpinnerSize, number> = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 28,
  };

  const dimension = sizeMap[size];

  return (
    <svg
      role="status"
      aria-label={ariaLabel}
      width={dimension}
      height={dimension}
      viewBox="0 0 24 24"
      fill="none"
      className={`animate-spin flex-shrink-0 ${className}`}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="3"
        className="opacity-20"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        className="opacity-90"
      />
    </svg>
  );
}
