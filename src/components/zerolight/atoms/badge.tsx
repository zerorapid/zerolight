"use client";

import React from "react";
import { useZeroLight } from "../context";

export type BadgeVariant = "healthy" | "degraded" | "syncing" | "critical" | "neutral";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

export function Badge({
  variant = "neutral",
  children,
  pulse = false,
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
      case "critical":
        return { bg: "#FEF2F2", text: "#B91C1C", border: "#FECACA", dot: "#EF4444" };
      case "neutral":
      default:
        return { bg: "#F4F4F5", text: "#3F3F46", border: "#E4E4E7", dot: "#71717A" };
    }
  };

  const v = getVariantStyles();

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
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold border whitespace-nowrap shrink-0 ${className}`}
    >
      <span
        style={{ backgroundColor: v.dot }}
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${pulse ? "animate-pulse" : ""}`}
      />
      <span className="whitespace-nowrap">{children}</span>
    </span>
  );
}
