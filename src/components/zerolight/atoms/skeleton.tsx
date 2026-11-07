"use client";

import React from "react";
import { useZeroLight } from "../context";

export interface SkeletonProps {
  variant?: "rect" | "circle" | "text";
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({
  variant = "rect",
  width,
  height,
  className = "",
  style,
}: SkeletonProps) {
  const { tokens, scaled } = useZeroLight();

  const getBorderRadius = (): string => {
    if (variant === "circle") return "9999px";
    if (variant === "text") return `${scaled.scaledPillRadius}px`;
    return `${scaled.scaledRadius}px`;
  };

  const defaultHeight = variant === "text" ? 14 : variant === "circle" ? 36 : 24;
  const defaultWidth = variant === "circle" ? 36 : "100%";

  return (
    <div
      style={{
        borderRadius: getBorderRadius(),
        backgroundColor: tokens.hoverBackplateTint,
        borderColor: tokens.borderWidth > 0 ? tokens.universalBorderColor : "transparent",
        borderWidth: `${tokens.borderWidth}px`,
        width: width ?? defaultWidth,
        height: height ?? defaultHeight,
        ...style,
      }}
      className={`animate-pulse relative overflow-hidden select-none shrink-0 ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
}
