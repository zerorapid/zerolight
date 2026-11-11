"use client";

import React, { useId } from "react";
import { useZeroLight } from "../context";
import { motion } from "framer-motion";

export interface SparklinePoint {
  value: number;
}

export interface SparklineProps {
  data: number[] | SparklinePoint[];
  width?: number;
  height?: number;
  color?: string;
  fillOpacity?: number;
  showMinMax?: boolean;
  strokeWidth?: number;
  className?: string;
}

export function Sparkline({
  data,
  width = 120,
  height = 36,
  color,
  fillOpacity = 0.15,
  showMinMax = false,
  strokeWidth = 2,
  className = "",
}: SparklineProps) {
  const { tokens, scaled } = useZeroLight();
  const gradientId = useId();

  const values: number[] = data.map((d) => (typeof d === "number" ? d : d.value));

  if (values.length < 2) {
    return (
      <div
        style={{ width, height }}
        className={`flex items-center justify-center text-[10px] text-neutral-400 tabular-nums font-sans ${className}`}
      >
        No data
      </div>
    );
  }

  const strokeColor = color || scaled.chartPrimaryColor || tokens.chartPrimaryColor || "#10B981";
  const effectiveStrokeWidth = strokeWidth ?? scaled.chartStrokeWidth ?? 2;
  const effectiveFillOpacity = fillOpacity ?? tokens.chartFillOpacity ?? 0.2;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const paddingY = 4;
  const usableHeight = height - paddingY * 2;

  const points = values.map((val, idx) => {
    const x = (idx / (values.length - 1)) * width;
    const y = height - paddingY - ((val - min) / range) * usableHeight;
    return { x, y, val };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    const prev = points[idx - 1];
    const midX = (prev.x + pt.x) / 2;
    return `${acc} C ${midX.toFixed(1)},${prev.y.toFixed(1)} ${midX.toFixed(1)},${pt.y.toFixed(1)} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }, "");

  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  const minPoint = points.reduce((p, c) => (c.val < p.val ? c : p), points[0]);
  const maxPoint = points.reduce((p, c) => (c.val > p.val ? c : p), points[0]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`overflow-visible select-none ${className}`}
      aria-label="Sparkline trend chart"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={effectiveFillOpacity} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Subtle Area Fill */}
      <motion.path
        d={areaD}
        fill={`url(#${gradientId})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={scaled.motionConfig.spring}
      />

      {/* Smooth Stroke Line with Token Linecap & Spring */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={effectiveStrokeWidth}
        strokeLinecap={tokens.cornerRadius === 0 ? "butt" : "round"}
        strokeLinejoin={tokens.cornerRadius === 0 ? "miter" : "round"}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={scaled.motionConfig.spring}
      />

      {/* Current/Last Point Pulse */}
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r={3}
        fill={strokeColor}
      />

      {/* Optional Min/Max Ticks */}
      {showMinMax && (
        <>
          <circle cx={maxPoint.x} cy={maxPoint.y} r={2.5} fill="#10B981" />
          <circle cx={minPoint.x} cy={minPoint.y} r={2.5} fill="#EF4444" />
        </>
      )}
    </svg>
  );
}
