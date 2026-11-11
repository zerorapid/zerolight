"use client";

import React from "react";
import { useZeroLight } from "../context";
import { motion } from "framer-motion";

export interface GaugeChartProps {
  value: number; // e.g. 74
  min?: number;
  max?: number;
  title?: string;
  subtitle?: string;
  unit?: string; // e.g. "%" or "pts"
  healthyThreshold?: number; // e.g. 95 for higher-is-better, or 60 for lower-is-better
  criticalThreshold?: number; // e.g. 90 for higher-is-better, or 85 for lower-is-better
  mode?: "higher-is-better" | "lower-is-better";
  color?: string;
  statusText?: string;
  size?: number;
  className?: string;
}

export function GaugeChart({
  value,
  min = 0,
  max = 100,
  title,
  subtitle,
  unit = "%",
  healthyThreshold = 95,
  criticalThreshold = 90,
  mode = "higher-is-better",
  color,
  statusText,
  size = 200,
  className = "",
}: GaugeChartProps) {
  const { tokens, scaled } = useZeroLight();

  const clampedVal = Math.min(max, Math.max(min, value));
  const percentage = (clampedVal - min) / (max - min);

  // Semicircle parameters
  const strokeWidth = 18;
  const radius = (size - strokeWidth * 2) / 2;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const arcLength = Math.PI * radius; // 180 degrees semicircle
  const strokeDashoffset = arcLength * (1 - percentage);

  // Status color determination respecting metric polarity
  const getStatusColor = () => {
    if (color) return color;
    const primary = scaled.chartPrimaryColor || tokens.chartPrimaryColor || "#10B981";
    if (mode === "higher-is-better") {
      if (clampedVal >= healthyThreshold) return primary;
      if (clampedVal >= criticalThreshold) return "#F59E0B";
      return "#EF4444";
    } else {
      if (clampedVal >= criticalThreshold) return "#EF4444";
      if (clampedVal >= healthyThreshold) return "#F59E0B";
      return primary;
    }
  };

  const statusColor = getStatusColor();

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledCardRadius}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: tokens.universalFillColor,
      }}
      className={`p-5 border shadow-2xs flex flex-col justify-between items-center select-none text-center ${className}`}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="w-full text-left mb-2">
          {title && (
            <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      )}

      {/* Semicircle SVG Gauge */}
      <div className="relative flex items-center justify-center my-auto">
        <svg
          width={size}
          height={size / 2 + 25}
          viewBox={`0 0 ${size} ${size / 2 + 25}`}
          className="overflow-visible"
        >
          {/* Background Gray Semicircle Track */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
            strokeLinecap={tokens.cornerRadius === 0 ? "butt" : "round"}
          />

          {/* Active Gradient Arc */}
          <motion.path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke={statusColor}
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset }}
            transition={scaled.motionConfig.spring}
            strokeLinecap={tokens.cornerRadius === 0 ? "butt" : "round"}
          />

          {/* Min & Max Endpoints */}
          <text
            x={cx - radius}
            y={cy + 18}
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="10"
            className="tabular-nums font-sans"
          >
            {min}
          </text>
          <text
            x={cx + radius}
            y={cy + 18}
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="10"
            className="tabular-nums font-sans"
          >
            {max}
          </text>
        </svg>

        {/* Center Readout Pinned inside Arc */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <div className="flex items-baseline gap-0.5">
            <span className="text-3xl font-black tracking-tight text-neutral-900 tabular-nums">
              {clampedVal}
            </span>
            <span className="text-sm font-bold text-neutral-500">{unit}</span>
          </div>
          {statusText && (
            <span
              style={{
                backgroundColor: `${statusColor}15`,
                color: statusColor,
                borderColor: `${statusColor}30`,
                borderRadius: `${scaled.scaledPillRadius}px`,
                borderWidth: `${tokens.borderWidth}px`,
              }}
              className="text-[10px] font-bold px-2 py-0.5 border mt-0.5 uppercase tracking-wider"
            >
              {statusText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
