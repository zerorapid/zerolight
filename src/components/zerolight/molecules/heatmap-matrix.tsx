"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { motion } from "framer-motion";

export interface HeatmapCell {
  x: number | string; // column key (e.g. week 1, hour 00..23)
  y: number | string; // row key (e.g. "Mon", "Tue", or instance id)
  value: number;      // intensity or event count
  label?: string;     // e.g. "14 commits on Apr 18"
}

export interface HeatmapMatrixProps {
  data: HeatmapCell[];
  xLabels?: string[];
  yLabels?: string[];
  title?: string;
  subtitle?: string;
  color?: string; // base brand color (default: tokens.primaryButtonColor)
  className?: string;
}

export function HeatmapMatrix({
  data,
  xLabels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"],
  yLabels = ["Mon", "Wed", "Fri", "Sun"],
  title,
  subtitle,
  color,
  className = "",
}: HeatmapMatrixProps) {
  const { tokens, scaled } = useZeroLight();
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);

  const baseColor = color || scaled.chartPrimaryColor || tokens.chartPrimaryColor || "#10B981";

  // Compute maximum cell value for 5-tier color shade calculation
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const getCellColor = (val: number) => {
    if (val === 0) return "#F1F5F9"; // neutral slate 100
    const ratio = val / maxValue;
    if (ratio < 0.25) return `${baseColor}30`;
    if (ratio < 0.5) return `${baseColor}60`;
    if (ratio < 0.75) return `${baseColor}AA`;
    return baseColor; // full opacity
  };

  const cellRadius =
    tokens.cornerRadius === 0
      ? 0
      : tokens.cornerRadius === 999
      ? 4
      : Math.min(4, Math.max(1, Math.round(tokens.cornerRadius * 0.2)));

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            {title && (
              <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-medium">
            <span>Less</span>
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: getCellColor(pct * maxValue),
                  borderRadius: `${cellRadius}px`,
                }}
                className="w-3 h-3 inline-block"
              />
            ))}
            <span>More</span>
          </div>
        </div>
      )}

      {/* Grid Container */}
      <div className="overflow-x-auto pb-1">
        <div className="flex flex-col gap-1.5 min-w-[360px]">
          {/* Rows */}
          {yLabels.map((yLabel) => (
            <div key={yLabel} className="flex items-center gap-1.5">
              <span className="w-8 text-[11px] font-medium text-neutral-400 text-right shrink-0">
                {yLabel}
              </span>
              <div className="flex items-center gap-1.5 flex-1">
                {xLabels.map((xLabel) => {
                  const cell = data.find((d) => d.x === xLabel && d.y === yLabel) || {
                    x: xLabel,
                    y: yLabel,
                    value: 0,
                  };
                  const isHovered =
                    hoveredCell?.x === cell.x && hoveredCell?.y === cell.y;

                  return (
                    <motion.div
                      key={xLabel}
                      onMouseEnter={() => setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: isHovered ? 1.25 : 1, opacity: 1 }}
                      transition={scaled.motionConfig.spring}
                      style={{
                        backgroundColor: getCellColor(cell.value),
                        borderRadius: `${cellRadius}px`,
                      }}
                      className={`h-4 flex-1 cursor-pointer transition-transform relative ${
                        isHovered ? "z-10 ring-2 ring-neutral-900" : "hover:scale-110"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {/* X Axis Labels */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="w-8 shrink-0" />
            <div className="flex items-center justify-between flex-1 px-1 text-[10px] text-neutral-400 tabular-nums font-sans">
              <span>{xLabels[0]}</span>
              <span>{xLabels[Math.floor(xLabels.length / 2)]}</span>
              <span>{xLabels[xLabels.length - 1]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Tooltip Indicator */}
      {hoveredCell && (
        <div
          style={{
            borderRadius: `${scaled.scaledRadius === 0 ? 0 : Math.min(scaled.scaledRadius, 8)}px`,
            borderWidth: `${tokens.borderWidth}px`,
          }}
          className="mt-2 text-center text-xs font-medium text-neutral-600 bg-neutral-50 py-1 px-3 border border-neutral-200"
        >
          {hoveredCell.label || (
            <span>
              <strong className="text-neutral-900 tabular-nums">
                {hoveredCell.value} events
              </strong>{" "}
              on {hoveredCell.y}, {hoveredCell.x}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
