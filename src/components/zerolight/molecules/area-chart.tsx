"use client";

import React, { useState, useRef, useId } from "react";
import { useZeroLight } from "../context";
import { motion, AnimatePresence } from "framer-motion";

export interface AreaDataPoint {
  label: string; // e.g. "Mon", "Jan", "10:00"
  value: number; // primary series value
  secondaryValue?: number; // optional secondary series
}

export interface AreaChartProps {
  data: AreaDataPoint[];
  title?: string;
  subtitle?: string;
  headerMeta?: React.ReactNode;
  kpiHeader?: React.ReactNode;
  summaryStats?: Array<{ label: string; value: string }>;
  curve?: "smooth" | "linear";
  showArea?: boolean;
  showLegend?: boolean;
  height?: number;
  primaryColor?: string;
  secondaryColor?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  valueFormatter?: (val: number) => string;
  yAxisFormatter?: (val: number) => string;
  showGrid?: boolean;
  className?: string;
}

export function AreaChart({
  data,
  title,
  subtitle,
  headerMeta,
  kpiHeader,
  summaryStats,
  curve = "smooth",
  showArea = true,
  showLegend = true,
  height = 220,
  primaryColor,
  secondaryColor = "#64748B",
  primaryLabel = "Primary Metric",
  secondaryLabel = "Comparison",
  valueFormatter = (val) => `$${val.toLocaleString()}`,
  yAxisFormatter,
  showGrid = true,
  className = "",
}: AreaChartProps) {
  const { tokens, scaled } = useZeroLight();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientId = useId();
  const secondaryGradientId = useId();

  const color1 = primaryColor || scaled.chartPrimaryColor || tokens.chartPrimaryColor || "#10B981";
  const color2 = secondaryColor || scaled.chartSecondaryColor || tokens.chartSecondaryColor || "#64748B";
  const effectiveStrokeWidth = scaled.chartStrokeWidth || tokens.chartStrokeWidth || 2.5;
  const effectiveFillOpacity = tokens.chartFillOpacity ?? 0.25;
  const effectiveGridStyle = tokens.chartGridStyle ?? "dotted";
  const shouldShowGrid = showGrid && effectiveGridStyle !== "none";

  if (!data || data.length < 2) {
    return (
      <div
        style={{
          borderRadius: `${scaled.scaledCardRadius}px`,
          borderColor: tokens.universalBorderColor,
        }}
        className="p-6 border bg-white text-center text-xs text-neutral-400"
      >
        Insufficient data for chart
      </div>
    );
  }

  const values1 = data.map((d) => d.value);
  const values2 = data.map((d) => d.secondaryValue ?? 0);
  const hasSecondary = data.some((d) => d.secondaryValue !== undefined);

  const allValues = hasSecondary ? [...values1, ...values2] : values1;
  const rawMin = Math.min(0, ...allValues);
  const rawMax = Math.max(...allValues);
  const max = Math.ceil(rawMax * 1.15) || 100;
  const min = Math.min(0, rawMin);
  const range = max - min || 1;

  // Coordinate math inside SVG viewBox (0 0 1000 height)
  const svgWidth = 1000;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;
  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const points1 = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * chartW;
    const y = paddingTop + chartH - ((d.value - min) / range) * chartH;
    return { x, y, ...d };
  });

  const points2 = hasSecondary
    ? data.map((d, i) => {
        const x = paddingLeft + (i / (data.length - 1)) * chartW;
        const y = paddingTop + chartH - (((d.secondaryValue ?? 0) - min) / range) * chartH;
        return { x, y, val: d.secondaryValue ?? 0 };
      })
    : [];

  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    return pts.reduce((acc, pt, idx) => {
      if (idx === 0) return `M ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
      if (curve === "linear") {
        return `${acc} L ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
      }
      const prev = pts[idx - 1];
      const cp1x = prev.x + (pt.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (pt.x - prev.x) / 2;
      const cp2y = pt.y;
      return `${acc} C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    }, "");
  };

  const linePath1 = createSmoothPath(points1);
  const areaPath1 = `${linePath1} L ${paddingLeft + chartW},${paddingTop + chartH} L ${paddingLeft},${paddingTop + chartH} Z`;

  const linePath2 = hasSecondary ? createSmoothPath(points2) : "";
  const areaPath2 = hasSecondary
    ? `${linePath2} L ${paddingLeft + chartW},${paddingTop + chartH} L ${paddingLeft},${paddingTop + chartH} Z`
    : "";

  // 4 Y-axis ticks
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => {
    const val = min + pct * range;
    const y = paddingTop + chartH - pct * chartH;
    return { val, y };
  });

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const relativeX = (mouseX / rect.width) * svgWidth;
    
    // Find closest data point
    let closestIndex = 0;
    let minDistance = Infinity;
    points1.forEach((pt, idx) => {
      const dist = Math.abs(pt.x - relativeX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });
    setHoverIndex(closestIndex);
  };

  const activePoint = hoverIndex !== null ? points1[hoverIndex] : null;

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: `${scaled.scaledCardRadius}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: tokens.universalFillColor,
      }}
      className={`p-5 border shadow-2xs flex flex-col justify-between select-none relative ${className}`}
    >
      {/* Header & Legend */}
      {(title || hasSecondary || headerMeta || kpiHeader || (summaryStats && summaryStats.length > 0)) && (
        <div className="space-y-3 mb-4">
          {(title || headerMeta || (showLegend && (hasSecondary || !kpiHeader))) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="min-w-0">
                {title && (
                  <h3
                    style={{ color: tokens.textIconColor }}
                    className="text-sm font-semibold tracking-tight truncate"
                  >
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{subtitle}</p>
                )}
              </div>
              {headerMeta ? (
                <div className="text-xs font-medium text-neutral-500 shrink-0">{headerMeta}</div>
              ) : (
                showLegend && (
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
                )
              )}
            </div>
          )}
          {kpiHeader && <div>{kpiHeader}</div>}
          {summaryStats && summaryStats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {summaryStats.map((stat) => (
                <div key={stat.label} className="min-w-0">
                  <div className="text-[11px] font-medium opacity-60 truncate">{stat.label}</div>
                  <div
                    style={{ color: tokens.textIconColor }}
                    className="text-base font-bold font-sans tabular-nums tracking-tight truncate"
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SVG Canvas & Tooltip Container (No overflow-hidden so tooltips never clip) */}
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${svgWidth} ${height}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color1} stopOpacity={effectiveFillOpacity} />
              <stop offset="90%" stopColor={color1} stopOpacity={0.01} />
              <stop offset="100%" stopColor={color1} stopOpacity={0} />
            </linearGradient>
            {hasSecondary && (
              <linearGradient id={secondaryGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color2} stopOpacity={effectiveFillOpacity * 0.6} />
                <stop offset="100%" stopColor={color2} stopOpacity={0} />
              </linearGradient>
            )}
          </defs>

          {/* Grid lines & Y axis ticks */}
          {shouldShowGrid &&
            yTicks.map((tick, idx) => (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={tick.y}
                  x2={paddingLeft + chartW}
                  y2={tick.y}
                  stroke={tokens.universalBorderColor}
                  strokeDasharray={effectiveGridStyle === "solid" ? "" : "4 4"}
                  strokeWidth="1"
                  opacity={0.8}
                />
                <text
                  x={paddingLeft - 10}
                  y={tick.y + 4}
                  textAnchor="end"
                  fill="#64748B"
                  fontSize="11"
                  fontWeight="600"
                  className="tabular-nums font-sans"
                >
                  {yAxisFormatter ? yAxisFormatter(Math.round(tick.val)) : valueFormatter(Math.round(tick.val))}
                </text>
              </g>
            ))}

          {/* Secondary Series with Motion Transition */}
          {hasSecondary && (
            <>
              {showArea && (
                <motion.path
                  d={areaPath2}
                  fill={`url(#${secondaryGradientId})`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <motion.path
                d={linePath2}
                fill="none"
                stroke={color2}
                strokeWidth={Math.max(1.5, effectiveStrokeWidth * 0.8)}
                strokeDasharray="4 4"
                strokeLinecap={tokens.cornerRadius === 0 ? "butt" : "round"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </>
          )}

          {/* Primary Series Area & Line with Reactive Stroke & Motion */}
          {showArea && (
            <motion.path
              d={areaPath1}
              fill={`url(#${gradientId})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
          <motion.path
            d={linePath1}
            fill="none"
            stroke={color1}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap={tokens.cornerRadius === 0 ? "butt" : "round"}
            strokeLinejoin={tokens.cornerRadius === 0 ? "miter" : "round"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          {/* X Axis Labels */}
          {points1.map((pt, idx) => (
            <text
              key={idx}
              x={pt.x}
              y={paddingTop + chartH + 20}
              textAnchor="middle"
              fill={hoverIndex === idx ? "#0F172A" : "#94A3B8"}
              fontWeight={hoverIndex === idx ? "700" : "500"}
              fontSize="11"
              className="tabular-nums select-none"
            >
              {pt.label}
            </text>
          ))}

          {/* Interactive Scrubbing Crosshair & Points */}
          {activePoint && (
            <g>
              <line
                x1={activePoint.x}
                y1={paddingTop}
                x2={activePoint.x}
                y2={paddingTop + chartH}
                stroke={color1}
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="5"
                fill="#FFFFFF"
                stroke={color1}
                strokeWidth="3"
                className="filter drop-shadow-sm"
              />
              {hasSecondary && points2[hoverIndex!] && (
                <circle
                  cx={points2[hoverIndex!].x}
                  cy={points2[hoverIndex!].y}
                  r="4"
                  fill="#FFFFFF"
                  stroke={color2}
                  strokeWidth="2.5"
                />
              )}
            </g>
          )}
        </svg>

        {/* Floating Tooltip Card with Intelligent Flipping & Zero-Clipping */}
        <AnimatePresence>
          {activePoint && hoverIndex !== null && (() => {
            const isNearLeft = activePoint.x / svgWidth < 0.20;
            const isNearRight = activePoint.x / svgWidth > 0.80;
            const xAlign = isNearLeft ? "0%" : isNearRight ? "-100%" : "-50%";
            // Intelligent vertical flip: when in the top half of the chart, flip downward so it never clips or overlaps the header
            const isNearTop = activePoint.y < 110;
            const yTransform = isNearTop ? "16px" : "calc(-100% - 14px)";

            return (
              <div
                key={`tooltip-${hoverIndex}`}
                style={{
                  position: "absolute",
                  left: `${(activePoint.x / svgWidth) * 100}%`,
                  top: `${(activePoint.y / height) * 100}%`,
                  transform: `translate(${xAlign}, ${yTransform})`,
                  pointerEvents: "none",
                  zIndex: 50,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={scaled.motionConfig.spring}
                  style={{
                    borderRadius: `${scaled.scaledRadius === 0 ? 0 : Math.min(scaled.scaledRadius, 10)}px`,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                  }}
                  className="bg-neutral-900/95 text-white backdrop-blur-md px-3 py-2 border shadow-2xl text-xs min-w-[130px] whitespace-nowrap"
                >
                  <div className="text-[10px] text-neutral-400 font-semibold mb-1">
                    {activePoint.label}
                  </div>
                  <div className="flex items-center justify-between gap-3 font-semibold">
                    <span className="flex items-center gap-1.5 text-neutral-300">
                      <span
                        style={{
                          backgroundColor: color1,
                          borderRadius: tokens.cornerRadius === 0 ? "0px" : tokens.cornerRadius === 999 ? "9999px" : "2px",
                        }}
                        className="w-2 h-2 inline-block shrink-0"
                      />
                      <span>{primaryLabel}:</span>
                    </span>
                    <span className="font-bold tabular-nums text-white">
                      {valueFormatter(activePoint.value)}
                    </span>
                  </div>
                  {hasSecondary && data[hoverIndex].secondaryValue !== undefined && (
                    <div className="flex items-center justify-between gap-3 text-neutral-300 mt-1">
                      <span className="flex items-center gap-1.5 text-neutral-400">
                        <span
                          style={{
                            backgroundColor: color2,
                            borderRadius: tokens.cornerRadius === 0 ? "0px" : tokens.cornerRadius === 999 ? "9999px" : "2px",
                          }}
                          className="w-2 h-2 inline-block shrink-0"
                        />
                        <span>{secondaryLabel}:</span>
                      </span>
                      <span className="font-bold tabular-nums text-neutral-200">
                        {valueFormatter(data[hoverIndex].secondaryValue!)}
                      </span>
                    </div>
                  )}
                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
}
