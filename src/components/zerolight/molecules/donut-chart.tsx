"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { motion } from "framer-motion";

export interface DonutSegment {
  id: string;
  label: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  data: DonutSegment[];
  title?: string;
  subtitle?: string;
  centerLabel?: string;
  centerValue?: string;
  valueFormatter?: (val: number) => string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function DonutChart({
  data,
  title,
  subtitle,
  centerLabel = "Total",
  centerValue,
  valueFormatter = (v) => v.toLocaleString(),
  size = 140,
  strokeWidth = 20,
  className = "",
}: DonutChartProps) {
  const { tokens, scaled } = useZeroLight();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const total = data.reduce((acc, d) => acc + d.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute strokeDasharray offsets with token colors fallback
  let accumulatedAngle = 0;
  const segmentsWithAngles = data.map((d, idx) => {
    const fraction = d.value / total;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedAngle * circumference;
    accumulatedAngle += fraction;
    const percentage = Math.round(fraction * 100);
    const color = d.color || scaled.chartColors[idx % scaled.chartColors.length];
    return { ...d, color, fraction, strokeDasharray, strokeDashoffset, percentage };
  });

  const activeSegment = hoveredId
    ? segmentsWithAngles.find((s) => s.id === hoveredId)
    : null;

  const displayCenterValue = activeSegment
    ? valueFormatter(activeSegment.value)
    : centerValue || valueFormatter(total);

  const displayCenterLabel = activeSegment
    ? `${activeSegment.label} (${activeSegment.percentage}%)`
    : centerLabel;

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledCardRadius}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: tokens.universalFillColor,
      }}
      className={`p-5 border shadow-2xs flex flex-col justify-between select-none ${className}`}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-3">
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

      {/* Donut Canvas & Legend Stack */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto">
        {/* SVG Donut Ring */}
        <div className="relative shrink-0 mx-auto sm:mx-0" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90 overflow-visible"
          >
            {/* Background Base Ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
            />

            {/* Segments with Motion Spring & Geometric Cut */}
            {segmentsWithAngles.map((seg) => {
              const isHovered = hoveredId === seg.id;
              return (
                <motion.circle
                  key={seg.id}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap={tokens.cornerRadius === 0 ? "butt" : "round"}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={scaled.motionConfig.spring}
                  onMouseEnter={() => setHoverIdSafe(seg.id)}
                  onMouseLeave={() => setHoverIdSafe(null)}
                  className="cursor-pointer"
                />
              );
            })}
          </svg>

          {/* Center Metric Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
            <span className="text-base sm:text-lg font-black tracking-tight text-neutral-900 tabular-nums">
              {displayCenterValue}
            </span>
            <span className="text-[10px] font-semibold text-neutral-500 line-clamp-1 max-w-[85px] mt-0.5">
              {displayCenterLabel}
            </span>
          </div>
        </div>

        {/* Legend List with Geometric Responsive Swatches */}
        <div className="flex flex-col gap-1.5 w-full flex-1 min-w-0">
          {segmentsWithAngles.map((seg) => {
            const isHovered = hoveredId === seg.id;
            return (
              <div
                key={seg.id}
                onMouseEnter={() => setHoverIdSafe(seg.id)}
                onMouseLeave={() => setHoverIdSafe(null)}
                style={{
                  borderRadius: `${scaled.scaledRadius === 0 ? 0 : Math.min(scaled.scaledRadius, 8)}px`,
                }}
                className={`flex items-center justify-between px-2 py-1 transition-colors cursor-pointer text-xs ${
                  isHovered ? "bg-neutral-100 font-bold" : "hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <span
                    style={{
                      backgroundColor: seg.color,
                      borderRadius: tokens.cornerRadius === 0 ? "0px" : tokens.cornerRadius === 999 ? "9999px" : "3px",
                    }}
                    className="w-2.5 h-2.5 shrink-0"
                  />
                  <span className="truncate text-neutral-700 text-[11px]" title={seg.label}>
                    {seg.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 tabular-nums text-neutral-900 font-semibold shrink-0 text-[11px]">
                  <span>{valueFormatter(seg.value)}</span>
                  <span className="text-[10px] text-neutral-400 font-normal">
                    {seg.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  function setHoverIdSafe(id: string | null) {
    setHoveredId(id);
  }
}
