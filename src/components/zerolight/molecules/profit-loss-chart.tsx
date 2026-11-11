"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { motion, AnimatePresence } from "framer-motion";

export interface MonthlyBarData {
  month: string;
  profit: number; // in thousands (e.g. 24 = $24k)
  loss: number;   // in thousands (e.g. 14 = $14k)
}

export interface ProfitLossChartProps {
  title?: string;
  subtitle?: string;
  data?: MonthlyBarData[];
  profitColor?: string;
  lossColor?: string;
  className?: string;
}

const DEFAULT_DATA: MonthlyBarData[] = [
  { month: "Jan", profit: 24, loss: 12 },
  { month: "Feb", profit: 32, loss: 16 },
  { month: "Mar", profit: 22, loss: 10 },
  { month: "Apr", profit: 28, loss: 14 },
  { month: "May", profit: 36, loss: 18 },
  { month: "Jun", profit: 42, loss: 22 },
  { month: "Jul", profit: 30, loss: 15 },
  { month: "Aug", profit: 20, loss: 11 },
];

export function ProfitLossChart({
  title = "Total Income",
  subtitle = "View your income in a certain period of time",
  data = DEFAULT_DATA,
  profitColor = "#84CC16", // Lime green from image
  lossColor = "#18181B",   // Dark slate/black from image
  className = "",
}: ProfitLossChartProps) {
  const { tokens, scaled } = useZeroLight();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxY = 50; // 50k max scale from image

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledCardRadius}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: tokens.universalFillColor,
        boxShadow: scaled.cardShadow,
        transition: scaled.transitionStyle,
      }}
      className={`p-5 border space-y-4 select-none ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 style={{ color: tokens.textIconColor }} className="text-sm font-bold tracking-tight">
            {title}
          </h3>
          <p className="text-[11px] text-neutral-400 mt-0.5" title={subtitle}>
            {subtitle}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span
              style={{
                backgroundColor: profitColor,
                borderRadius: tokens.cornerRadius === 0 ? "0px" : tokens.cornerRadius === 999 ? "9999px" : "2px",
              }}
              className="w-2.5 h-2.5 inline-block"
            />
            <span className="text-neutral-600 text-[11px]">Profit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              style={{
                backgroundColor: lossColor,
                borderRadius: tokens.cornerRadius === 0 ? "0px" : tokens.cornerRadius === 999 ? "9999px" : "2px",
              }}
              className="w-2.5 h-2.5 inline-block"
            />
            <span className="text-neutral-600 text-[11px]">Loss</span>
          </div>
        </div>
      </div>

      {/* Sub-label */}
      <div className="text-xs font-semibold text-neutral-800">
        Profit and Loss
      </div>

      {/* Chart Canvas */}
      <div className="relative pt-2">
        {/* Y-Axis lines & labels */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-neutral-400 tabular-nums">
          {[50, 40, 30, 20, 10, 0].map((val) => (
            <div key={val} className="flex items-center w-full">
              <span className="w-6 shrink-0">{val === 0 ? "00" : `${val}k`}</span>
              <div className="flex-1 border-b border-neutral-100 ml-2" />
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="ml-8 flex items-end justify-between h-[160px] pt-2 relative z-10">
          {data.map((item, idx) => {
            const isHovered = hoveredIndex === idx;
            // Heights as percentages of 50k
            const profitHeight = (item.profit / maxY) * 100;
            const lossHeight = (item.loss / maxY) * 100;

            const isFirst = idx === 0;
            const isLast = idx === data.length - 1;
            const xPosClass = isFirst ? "left-0" : isLast ? "right-0" : "left-1/2 -translate-x-1/2";

            return (
              <div
                key={item.month}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative px-1"
              >
                {/* Tooltip on hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={scaled.motionConfig.spring}
                      style={{
                        borderRadius: `${scaled.scaledInnerRadius || 6}px`,
                        borderWidth: `${tokens.borderWidth}px`,
                        borderColor: tokens.universalBorderColor,
                      }}
                      className={`absolute -top-12 z-30 bg-[#18181B] text-white px-2.5 py-1 text-[10px] font-semibold shadow-lg whitespace-nowrap tabular-nums pointer-events-none ${xPosClass}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#84CC16]">P: +${item.profit}k</span>
                        <span className="text-white/40">|</span>
                        <span className="text-white/80">L: -${item.loss}k</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Stacked Vertical Bar with Token Corner Radius & Spring Motion */}
                <div className="w-4 sm:w-5 flex flex-col items-center justify-end h-full">
                  {/* Top segment: Profit (Green) */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${profitHeight}%` }}
                    transition={scaled.motionConfig.spring}
                    style={{
                      backgroundColor: profitColor,
                      borderTopLeftRadius: tokens.cornerRadius === 0 ? "0px" : tokens.cornerRadius === 999 ? "9999px" : "6px",
                      borderTopRightRadius: tokens.cornerRadius === 0 ? "0px" : tokens.cornerRadius === 999 ? "9999px" : "6px",
                      opacity: isHovered ? 1 : 0.9,
                    }}
                    className="w-full transition-opacity shadow-2xs"
                  />
                  {/* Bottom segment: Loss (Dark) */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${lossHeight}%` }}
                    transition={scaled.motionConfig.spring}
                    style={{
                      backgroundColor: lossColor,
                      borderBottomLeftRadius: tokens.cornerRadius === 0 ? "0px" : tokens.cornerRadius === 999 ? "9999px" : "6px",
                      borderBottomRightRadius: tokens.cornerRadius === 0 ? "0px" : tokens.cornerRadius === 999 ? "9999px" : "6px",
                      opacity: isHovered ? 1 : 0.95,
                    }}
                    className="w-full transition-opacity shadow-2xs"
                  />
                </div>

                {/* X-Axis Month Label */}
                <span className="text-[10px] text-neutral-500 font-semibold mt-2 tabular-nums">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
