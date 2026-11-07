"use client";

import React from "react";
import { useZeroLight } from "../context";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  comparisonText?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  delta,
  trend = "up",
  comparisonText = "vs last month",
  className = "",
}: StatCardProps) {
  const { tokens, scaled } = useZeroLight();

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledCardRadius}px`,
        backgroundColor: tokens.universalFillColor,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        boxShadow: scaled.cardShadow,
        transition: scaled.transitionStyle,
      }}
      className={`p-5 border space-y-2 select-none ${className}`}
    >
      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
        {label}
      </div>

      <div
        style={{
          fontSize: `${Math.round(24 * scaled.scale)}px`,
          color: tokens.textIconColor,
        }}
        className="font-bold tabular-nums tracking-tight"
      >
        {value}
      </div>

      {delta && (
        <div className="flex items-center gap-1.5 text-xs">
          <span
            className={`inline-flex items-center gap-1 font-semibold ${
              trend === "up" ? "text-emerald-600" : trend === "down" ? "text-rose-600" : "text-neutral-500"
            }`}
          >
            {trend === "up" && <TrendingUp className="w-3.5 h-3.5 shrink-0" />}
            {trend === "down" && <TrendingDown className="w-3.5 h-3.5 shrink-0" />}
            <span>{delta}</span>
          </span>
          <span className="text-neutral-400 font-medium">{comparisonText}</span>
        </div>
      )}
    </div>
  );
}
