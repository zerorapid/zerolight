"use client";

import React from "react";
import { useZeroLight } from "../context";

export interface ToolbarProps {
  leading?: React.ReactNode;
  children?: React.ReactNode;
  trailing?: React.ReactNode;
  variant?: "surface" | "floating";
  className?: string;
}

/**
 * Horizontal or floating Toolbar for editor actions, table bulk operations, and workspace controls.
 */
export function Toolbar({
  leading,
  children,
  trailing,
  variant = "surface",
  className = "",
}: ToolbarProps) {
  const { tokens, scaled } = useZeroLight();

  return (
    <div
      role="toolbar"
      style={{
        backgroundColor: tokens.universalFillColor,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
        borderRadius:
          variant === "floating"
            ? `${scaled.scaledPillRadius}px`
            : `${scaled.scaledCardRadius}px`,
        color: tokens.textIconColor,
        boxShadow:
          variant === "floating"
            ? scaled.isDarkSurface
              ? "0 12px 32px rgba(0,0,0,0.5)"
              : "0 10px 28px rgba(15,23,42,0.12)"
            : scaled.cardShadow,
        transition: scaled.transitionStyle,
      }}
      className={`px-3 py-2 border flex items-center justify-between gap-3 flex-wrap font-sans ${className}`}
    >
      {leading && <div className="flex items-center gap-2">{leading}</div>}
      {children && <div className="flex items-center gap-1.5 flex-wrap">{children}</div>}
      {trailing && <div className="flex items-center gap-2 ml-auto">{trailing}</div>}
    </div>
  );
}
