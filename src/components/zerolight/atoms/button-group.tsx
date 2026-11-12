"use client";

import React from "react";
import { useZeroLight } from "../context";

export interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/**
 * Groups action buttons into a single unified pill/bar with shared borders and outer radius.
 */
export function ButtonGroup({
  children,
  orientation = "horizontal",
  className = "",
}: ButtonGroupProps) {
  const { tokens, scaled } = useZeroLight();

  return (
    <div
      role="group"
      style={{
        borderColor: tokens.universalBorderColor,
        borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
        borderRadius: `${scaled.scaledRadius === 999 ? 9999 : scaled.scaledRadius}px`,
        backgroundColor: tokens.universalFillColor,
      }}
      className={`inline-flex ${
        orientation === "vertical"
          ? "flex-col divide-y"
          : "flex-row items-center divide-x"
      } overflow-hidden border shadow-2xs [&>button]:rounded-none [&>button]:border-0 ${className}`}
    >
      {children}
    </div>
  );
}
