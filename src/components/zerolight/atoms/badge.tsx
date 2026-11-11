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

  const getVariantStyles = (): { bg: string; text: string; border: string; dot: string } => {
    switch (variant) {
      case "healthy":
        return { bg: "#ECFDF5", text: "#047857", border: "#A7F3D0", dot: "#10B981" };
      case "degraded":
        return { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A", dot: "#F59E0B" };
      case "syncing":
        return { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE", dot: "#3B82F6" };
      case "info":
        return { bg: "#DBEAFE", text: "#1D4ED8", border: "#BFDBFE", dot: "#3B82F6" };
      case "lime":
        return { bg: "#ECFCCB", text: "#3F6212", border: "#D9F99D", dot: "#84CC16" };
      case "lilac":
        return { bg: "#FCE7F3", text: "#9D174D", border: "#FBCFE8", dot: "#EC4899" };
      case "indigo":
        return { bg: "#E0E7FF", text: "#3730A3", border: "#C7D2FE", dot: "#6366F1" };
      case "critical":
        return { bg: "#FEF2F2", text: "#B91C1C", border: "#FECACA", dot: "#EF4444" };
      case "neutral":
      default:
        return { bg: "#F4F4F5", text: "#3F3F46", border: "#E4E4E7", dot: "#71717A" };
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
