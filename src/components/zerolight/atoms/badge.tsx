"use client";

import React from "react";
import { useZeroLight } from "../context";

export type BadgeVariant =
  | "healthy"
  | "degraded"
  | "syncing"
  | "critical"
  | "neutral"
  | "info"
  | "lime"
  | "lilac"
  | "indigo";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  pulse?: boolean;
  showDot?: boolean;
  size?: "xs" | "sm";
  className?: string;
}

export function Badge({
  variant = "neutral",
  children,
  pulse = false,
  showDot = true,
  size = "sm",
  className = "",
}: BadgeProps) {
  const { tokens, scaled } = useZeroLight();
  const isDark = scaled.isDarkSurface;

  const getVariantStyles = (): { bg: string; text: string; border: string; dot: string } => {
    switch (variant) {
      case "healthy":
        return {
          bg: isDark ? "rgba(16, 185, 129, 0.15)" : "#ECFDF5",
          text: isDark ? "#34D399" : "#047857",
          border: isDark ? "rgba(16, 185, 129, 0.3)" : "#A7F3D0",
          dot: "#10B981",
        };
      case "degraded":
        return {
          bg: isDark ? "rgba(245, 158, 11, 0.15)" : "#FFFBEB",
          text: isDark ? "#FBBF24" : "#B45309",
          border: isDark ? "rgba(245, 158, 11, 0.3)" : "#FDE68A",
          dot: "#F59E0B",
        };
      case "syncing":
      case "info":
        return {
          bg: isDark ? "rgba(59, 130, 246, 0.15)" : "#EFF6FF",
          text: isDark ? "#60A5FA" : "#1D4ED8",
          border: isDark ? "rgba(59, 130, 246, 0.3)" : "#BFDBFE",
          dot: "#3B82F6",
        };
      case "lime":
        return {
          bg: isDark ? "rgba(132, 204, 22, 0.15)" : "#ECFCCB",
          text: isDark ? "#A3E635" : "#3F6212",
          border: isDark ? "rgba(132, 204, 22, 0.3)" : "#D9F99D",
          dot: "#84CC16",
        };
      case "lilac":
        return {
          bg: isDark ? "rgba(236, 72, 153, 0.15)" : "#FCE7F3",
          text: isDark ? "#F472B6" : "#9D174D",
          border: isDark ? "rgba(236, 72, 153, 0.3)" : "#FBCFE8",
          dot: "#EC4899",
        };
      case "indigo":
        return {
          bg: isDark ? "rgba(99, 102, 241, 0.15)" : "rgba(79, 70, 229, 0.08)",
          text: tokens.primaryButtonColor || "#4F46E5",
          border: isDark ? "rgba(99, 102, 241, 0.3)" : "rgba(79, 70, 229, 0.2)",
          dot: tokens.primaryButtonColor || "#4F46E5",
        };
      case "critical":
        return {
          bg: isDark ? "rgba(239, 68, 68, 0.15)" : "#FEF2F2",
          text: isDark ? "#F87171" : "#B91C1C",
          border: isDark ? "rgba(239, 68, 68, 0.3)" : "#FECACA",
          dot: "#EF4444",
        };
      case "neutral":
      default:
        return {
          bg: tokens.hoverBackplateTint || (isDark ? "rgba(255, 255, 255, 0.06)" : "#F4F4F5"),
          text: tokens.textIconColor || (isDark ? "#E4E4E7" : "#3F3F46"),
          border: tokens.universalBorderColor || (isDark ? "rgba(255, 255, 255, 0.1)" : "#E4E4E7"),
          dot: tokens.textIconColor || (isDark ? "#A1A1AA" : "#71717A"),
        };
    }
  };

  const v = getVariantStyles();
  const sizeClass =
    size === "xs"
      ? "px-2 py-0.5 text-[10px] font-bold tracking-wide"
      : "px-2.5 py-0.5 text-xs font-semibold";

  return (
    <span
      style={{
        borderRadius: `${scaled.scaledPillRadius}px`,
        backgroundColor: v.bg,
        color: v.text,
        borderColor: tokens.borderWidth > 0 ? v.border : "transparent",
        borderWidth: `${tokens.borderWidth}px`,
        transition: scaled.transitionStyle,
      }}
      className={`inline-flex items-center gap-1.5 border whitespace-nowrap shrink-0 ${sizeClass} ${className}`}
    >
      {showDot && (
        <span
          style={{ backgroundColor: v.dot }}
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${pulse ? "animate-pulse" : ""}`}
        />
      )}
      <span className="whitespace-nowrap">{children}</span>
    </span>
  );
}
