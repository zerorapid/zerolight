"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { motion, AnimatePresence } from "framer-motion";

export interface BarDataPoint {
  label: string; // e.g. "Q1", "Mon", "Jan"
  value: number;
  secondaryValue?: number;
}

export interface BarChartProps {
  data: BarDataPoint[];
  title?: string;
  subtitle?: string;
  height?: number;
  primaryColor?: string;
  secondaryColor?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  valueFormatter?: (val: number) => string;
  mode?: "grouped" | "stacked";
  className?: string;
}

export function BarChart({
  data,
  title,
  subtitle,
  height = 220,
  primaryColor,
  secondaryColor = "#334155",
  primaryLabel = "Metric A",
  secondaryLabel = "Metric B",
  valueFormatter = (v) => v.toLocaleString(),
  mode = "grouped",
  className = "",
}: BarChartProps) {
  const { tokens, scaled } = useZeroLight();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const color1 = primaryColor || scaled.chartPrimaryColor || tokens.chartPrimaryColor || "#10B981";
  const color2 = secondaryColor || scaled.chartSecondaryColor || tokens.chartSecondaryColor || "#334155";
  const effectiveGridStyle = tokens.chartGridStyle ?? "dotted";

  const hasSecondary = data.some((d) => d.secondaryValue !== undefined);

  // Calculate scales
  const maxVal = Math.max(
    ...data.map((d) =>
      mode === "stacked"
        ? d.value + (d.secondaryValue ?? 0)
        : Math.max(d.value, d.secondaryValue ?? 0)
    )
  );

  const scaleMax = Math.ceil(maxVal * 1.15) || 100;

  // 4 Y axis grid ticks
  const yTicks = [1, 0.66, 0.33, 0].map((pct) => ({
    val: Math.round(pct * scaleMax),
    pct: pct * 100,
  }));

  const barRadius =
    tokens.cornerRadius === 0
      ? 0
      : tokens.cornerRadius === 999
      ? 9999
      : Math.round(tokens.cornerRadius * 0.4);

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
      {/* Header & Legend */}
      {(title || hasSecondary) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="min-w-0">
            {title && (
              <h3 className="text-sm font-bold text-neutral-900 tracking-tight truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-neutral-600 whitespace-nowrap shrink-0">
            <div className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
              <span
                style={{
                  backgroundColor: color1,
                  borderRadius: tokens.cornerRadius === 0 ? "0px" : tokens.cornerRadius === 999 ? "9999px" : "3px",
                }}
                className="w-2.5 h-2.5 inline-block shrink-0"
              />
              <span className="whitespace-nowrap">{primaryLabel}</span>
            </div>
            {hasSecondary && (
              <div className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <span
                  style={{
                    backgroundColor: color2,
                    borderRadius: tokens.cornerRadius === 0 ? "0px" : tokens.cornerRadius === 999 ? "9999px" : "3px",
                  }}
                  className="w-2.5 h-2.5 inline-block shrink-0"
                />
                <span className="whitespace-nowrap">{secondaryLabel}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chart Canvas */}
      <div className="relative shrink-0 w-full flex flex-col justify-end" style={{ height: `${height}px` }}>
        {/* Background Grid Lines */}
        {effectiveGridStyle !== "none" && (
          <div className="absolute inset-x-0 bottom-6 top-2 flex flex-col justify-between pointer-events-none">
            {yTicks.map((tick, idx) => (
              <div key={idx} className="flex items-center w-full">
                <span className="min-w-12 whitespace-nowrap text-[10px] text-neutral-500 font-semibold tabular-nums text-right pr-2 shrink-0">
                  {valueFormatter(tick.val)}
                </span>
                <div
                  style={{ borderColor: tokens.universalBorderColor }}
                  className={`w-full border-b opacity-70 ${
                    effectiveGridStyle === "solid" ? "border-solid" : "border-dashed"
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Bars Container */}
        <div className="relative pl-14 pr-2 pb-6 pt-8 h-full flex items-end justify-between gap-2 z-10 overflow-visible">
          {data.map((item, idx) => {
            const isHovered = hoverIndex === idx;
            const h1 = Math.max(8, (item.value / scaleMax) * 100);
            const h2 = item.secondaryValue ? Math.max(8, (item.secondaryValue / scaleMax) * 100) : 0;
            const isLight1 = color1.toLowerCase() === "#ffffff" || color1.toLowerCase() === "#fff";
            const isLight2 = color2.toLowerCase() === "#ffffff" || color2.toLowerCase() === "#fff";

            const isFirst = idx === 0;
            const isLast = idx === data.length - 1;
            const xPosClass = isFirst ? "left-0" : isLast ? "right-0" : "left-1/2 -translate-x-1/2";

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
                className="flex-1 flex flex-col items-center justify-end h-full relative cursor-pointer group"
              >
                {/* Floating Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={scaled.motionConfig.spring}
                      style={{
                        borderRadius: `${scaled.scaledRadius === 0 ? 0 : Math.min(scaled.scaledRadius, 10)}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                      }}
                      className={`absolute -top-12 z-30 bg-neutral-900/95 text-white backdrop-blur-md px-2.5 py-1.5 border shadow-xl text-[11px] whitespace-nowrap pointer-events-none ${xPosClass}`}
                    >
                      <span className="font-semibold text-neutral-300">{item.label}: </span>
                      <span className="font-bold tabular-nums text-white">
                        {valueFormatter(item.value)}
                      </span>
                      {hasSecondary && item.secondaryValue !== undefined && (
                        <span className="text-neutral-300 tabular-nums ml-1.5">
                          / {valueFormatter(item.secondaryValue)}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bars Rendering */}
                {mode === "stacked" ? (
                  <div className="w-full max-w-[32px] flex flex-col justify-end h-full">
                    {item.secondaryValue !== undefined && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${h2}%` }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        style={{
                          backgroundColor: color2,
                          borderTopLeftRadius: `${barRadius}px`,
                          borderTopRightRadius: `${barRadius}px`,
                          border: isLight2 ? "1px solid #CBD5E1" : "none",
                        }}
                        className={`w-full transition-opacity ${isHovered ? "opacity-100" : "opacity-90"}`}
                      />
                    )}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h1}%` }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      style={{
                        backgroundColor: color1,
                        borderTopLeftRadius: !item.secondaryValue ? `${barRadius}px` : 0,
                        borderTopRightRadius: !item.secondaryValue ? `${barRadius}px` : 0,
                        borderBottomLeftRadius: `${barRadius === 0 ? 0 : Math.max(1, Math.round(barRadius / 2))}px`,
                        borderBottomRightRadius: `${barRadius === 0 ? 0 : Math.max(1, Math.round(barRadius / 2))}px`,
                        border: isLight1 ? "1px solid #CBD5E1" : "none",
                      }}
                      className={`w-full transition-opacity ${isHovered ? "opacity-100 brightness-110" : "opacity-90"}`}
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-[48px] flex items-end justify-center gap-1 h-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h1}%` }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      style={{
                        backgroundColor: color1,
                        borderTopLeftRadius: `${barRadius}px`,
                        borderTopRightRadius: `${barRadius}px`,
                        border: isLight1 ? "1px solid #CBD5E1" : "none",
                      }}
                      className={`flex-1 min-w-[8px] transition-all ${
                        isHovered ? "brightness-110 scale-[1.02]" : "opacity-90"
                      }`}
                    />
                    {hasSecondary && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${h2}%` }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        style={{
                          backgroundColor: color2,
                          borderTopLeftRadius: `${barRadius}px`,
                          borderTopRightRadius: `${barRadius}px`,
                          border: isLight2 ? "1px solid #CBD5E1" : "none",
                        }}
                        className={`flex-1 min-w-[8px] transition-all ${
                          isHovered ? "brightness-110 scale-[1.02]" : "opacity-85"
                        }`}
                      />
                    )}
                  </div>
                )}

                {/* X Axis Label */}
                <span
                  className={`absolute -bottom-5 text-[11px] font-medium transition-colors select-none ${
                    isHovered ? "text-neutral-900 font-bold" : "text-neutral-500"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
