"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { motion } from "framer-motion";

export interface FunnelStage {
  id: string;
  name: string;
  count: number;
  subtext?: string;
}

export interface FunnelChartProps {
  stages: FunnelStage[];
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  valueFormatter?: (val: number) => string;
  className?: string;
}

export function FunnelChart({
  stages,
  title,
  subtitle,
  primaryColor,
  valueFormatter = (val) => val.toLocaleString(),
  className = "",
}: FunnelChartProps) {
  const { tokens, scaled } = useZeroLight();
  const [hoveredStageId, setHoveredStageId] = useState<string | null>(null);

  const baseColor = primaryColor || scaled.chartPrimaryColor || tokens.chartPrimaryColor || "#10B981";
  const initialCount = stages[0]?.count || 1;

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

      {/* Funnel Steps */}
      <div className="space-y-2.5 my-auto">
        {stages.map((stage, idx) => {
          const isHovered = hoveredStageId === stage.id;
          const pctOfInitial = Math.round((stage.count / initialCount) * 100);
          
          // Dropoff from previous step
          const prevCount = idx > 0 ? stages[idx - 1].count : stage.count;
          const stepConversion = Math.round((stage.count / prevCount) * 100);

          return (
            <div
              key={stage.id}
              onMouseEnter={() => setHoveredStageId(stage.id)}
              onMouseLeave={() => setHoveredStageId(null)}
              className="flex flex-col gap-1 cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs">
                <span
                  className={`font-semibold transition-colors ${
                    isHovered ? "text-neutral-900 font-bold" : "text-neutral-700"
                  }`}
                >
                  {stage.name}
                </span>
                <div className="flex items-center gap-2 tabular-nums">
                  <span className="font-bold text-neutral-900">
                    {valueFormatter(stage.count)}
                  </span>
                  <span className="text-[11px] font-medium text-neutral-400">
                    ({pctOfInitial}%)
                  </span>
                </div>
              </div>

              {/* Centered Funnel Bar */}
              <div
                style={{
                  borderRadius: `${scaled.scaledRadius === 0 ? 0 : scaled.scaledRadius}px`,
                }}
                className="w-full bg-neutral-100 h-6 overflow-hidden flex items-center justify-center p-0.5"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(8, pctOfInitial)}%` }}
                  transition={scaled.motionConfig.spring}
                  style={{
                    backgroundColor: baseColor,
                    borderRadius: `${scaled.scaledRadius === 0 ? 0 : Math.max(2, scaled.scaledRadius - 2)}px`,
                  }}
                  className={`h-full flex items-center justify-end px-2 text-[10px] font-bold text-white transition-opacity ${
                    isHovered ? "opacity-100 brightness-105" : "opacity-85"
                  }`}
                >
                  {pctOfInitial >= 20 && (
                    <span className="tabular-nums drop-shadow-xs">{stepConversion}%</span>
                  )}
                </motion.div>
              </div>

              {/* Inter-step dropoff indicator */}
              {idx < stages.length - 1 && (
                <div className="flex justify-center -my-1">
                  <span className="text-[9px] text-neutral-400 font-sans font-bold">↓</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
