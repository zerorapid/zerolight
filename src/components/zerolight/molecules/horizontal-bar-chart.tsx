"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { motion } from "framer-motion";

export interface HorizontalBarItem {
  id: string;
  label: string;
  value: number;
  secondaryLabel?: string;
  color?: string;
}

export interface HorizontalBarChartProps {
  data: HorizontalBarItem[];
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  valueFormatter?: (val: number) => string;
  showRank?: boolean;
  className?: string;
}

export function HorizontalBarChart({
  data,
  title,
  subtitle,
  primaryColor,
  valueFormatter = (val) => val.toLocaleString(),
  showRank = true,
  className = "",
}: HorizontalBarChartProps) {
  const { tokens, scaled } = useZeroLight();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const defaultColor = primaryColor || scaled.chartPrimaryColor || tokens.chartPrimaryColor || "#10B981";
  const maxValue = Math.max(...data.map((d) => d.value), 1);

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
        <div className="mb-4">
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

      {/* Ranked Bars List */}
      <div className="space-y-3.5">
        {data.map((item, idx) => {
          const isHovered = hoveredId === item.id;
          const pct = Math.min(100, (item.value / maxValue) * 100);
          const barColor = item.color || defaultColor;

          return (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="flex flex-col gap-1.5 cursor-pointer group"
            >
              {/* Row Header: Rank, Label, Value */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate pr-2">
                  {showRank && (
                    <span className="w-5 text-[10px] font-sans font-bold text-neutral-400 tabular-nums">
                      0{idx + 1}
                    </span>
                  )}
                  <span
                    title={item.label}
                    className={`font-semibold truncate transition-colors ${
                      isHovered ? "text-neutral-900 font-bold" : "text-neutral-700"
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.secondaryLabel && (
                    <span className="text-[11px] text-neutral-400 shrink-0">
                      • {item.secondaryLabel}
                    </span>
                  )}
                </div>
                <span className="font-bold text-neutral-900 tabular-nums shrink-0">
                  {valueFormatter(item.value)}
                </span>
              </div>

              {/* Progress Track */}
              <div
                style={{
                  borderRadius: `${scaled.scaledRadius}px`,
                  backgroundColor: tokens.hoverBackplateTint || "#F4F4F5",
                }}
                className="w-full h-2.5 overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={scaled.motionConfig.spring}
                  style={{
                    backgroundColor: barColor,
                    borderRadius: `${scaled.scaledRadius}px`,
                  }}
                  className={`h-full transition-all ${
                    isHovered ? "brightness-110 filter drop-shadow-xs" : "opacity-90"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
