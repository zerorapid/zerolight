"use client";

import React from "react";
import { useZeroLight } from "../context";

export interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Spinner({
  size = "md",
  color,
  className = "",
  style,
}: SpinnerProps) {
  const { tokens } = useZeroLight();

  const dimensionMap = {
    xs: 14,
    sm: 18,
    md: 24,
    lg: 32,
  };

  const dim = dimensionMap[size];
  const strokeColor = color || tokens.primaryButtonColor;

  return (
    <svg
      role="status"
      aria-label="Loading..."
      viewBox="0 0 24 24"
      fill="none"
      style={{
        width: `${dim}px`,
        height: `${dim}px`,
        ...style,
      }}
      className={`animate-spin shrink-0 ${className}`}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-20"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
