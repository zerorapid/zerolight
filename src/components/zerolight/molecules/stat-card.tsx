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
  subValue?: string;
  layout?: "vertical" | "horizontal";
  minorDecimal?: boolean;
  deltaPill?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  sparkline?: React.ReactNode;
  className?: string;
}

function renderFormattedValue(value: string | number, minorDecimal?: boolean) {
  const str = String(value);
  if (!minorDecimal) return str;
  const match = str.match(/^(.*?)(\.\d{2})$/);
  if (!match) return str;
  return (
    <>
      <span>{match[1]}</span>
      <span className="text-[0.62em] font-semibold opacity-75">{match[2]}</span>
    </>
  );
}

export function StatCard({
  label,
  value,
  delta,
  trend = "up",
  comparisonText = "vs last month",
  subValue,
  layout = "vertical",
  minorDecimal = false,
  deltaPill,
  icon,
  badge,
  sparkline,
  className = "",
}: StatCardProps) {
  const { tokens, scaled } = useZeroLight();

  if (layout === "horizontal") {
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
        className={`px-5 py-4 border select-none flex items-center justify-between gap-4 min-h-[84px] ${className}`}
      >
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              title={label}
              style={{ color: tokens.textIconColor }}
              className="text-xs sm:text-sm font-medium opacity-80 truncate"
            >
              {label}
            </span>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>

          {(delta || deltaPill || icon) && (
            <div className="flex items-center gap-2 text-xs">
              {deltaPill}
              {!deltaPill && delta && (
                <span
                  className={`inline-flex items-center gap-1.5 font-medium ${
                    trend === "up"
                      ? "text-emerald-600"
                      : trend === "down"
                      ? "text-rose-600"
                      : "text-neutral-500"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full inline-flex items-center justify-center shrink-0 ${
                      trend === "up"
                        ? "bg-emerald-50 text-emerald-600"
                        : trend === "down"
                        ? "bg-rose-50 text-rose-600"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {trend === "down" ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : (
                      <TrendingUp className="w-3 h-3" />
                    )}
                  </span>
                  <span className="tabular-nums text-neutral-500">{delta}</span>
                </span>
              )}
              {comparisonText && !deltaPill && (
                <span className="text-neutral-400 font-medium truncate">
                  {comparisonText}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="text-right shrink-0 space-y-0.5">
          <div
            title={String(value)}
            style={{
              fontSize: `${Math.round(24 * scaled.scale)}px`,
              color: tokens.textIconColor,
            }}
            className="font-semibold tabular-nums tracking-tight leading-none"
          >
            {renderFormattedValue(value, minorDecimal)}
          </div>
          {subValue && (
            <div className="text-[11px] text-neutral-400 font-medium tabular-nums">
              {subValue}
            </div>
          )}
        </div>
      </div>
    );
  }

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
      className={`p-5 border space-y-2 select-none min-h-[110px] flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 truncate">
            <span
              title={label}
              className="text-xs font-semibold uppercase tracking-wider text-neutral-400 truncate"
            >
              {label}
            </span>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>

          <div
            title={String(value)}
            style={{
              fontSize: `${Math.round(24 * scaled.scale)}px`,
              color: tokens.textIconColor,
            }}
            className="font-bold tabular-nums tracking-tight truncate pt-0.5"
          >
            {value}
          </div>
        </div>
        {icon && (
          <div
            style={{
              borderRadius: `${scaled.scaledRadius}px`,
              backgroundColor: tokens.hoverBackplateTint,
              color: tokens.iconColor || tokens.textIconColor,
            }}
            className="p-2 shrink-0 flex items-center justify-center"
          >
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        {delta && (
          <div className="flex items-center gap-1.5 text-xs truncate">
            <span
              className={`inline-flex items-center gap-1 font-semibold shrink-0 ${
                trend === "up" ? "text-emerald-600" : trend === "down" ? "text-rose-600" : "text-neutral-500"
              }`}
            >
              {trend === "up" && <TrendingUp className="w-3.5 h-3.5 shrink-0" />}
              {trend === "down" && <TrendingDown className="w-3.5 h-3.5 shrink-0" />}
              <span className="tabular-nums">{delta}</span>
            </span>
            {comparisonText && (
              <span title={comparisonText} className="text-neutral-400 font-medium truncate">
                {comparisonText}
              </span>
            )}
          </div>
        )}
        {sparkline && <div className="shrink-0 ml-auto">{sparkline}</div>}
      </div>
    </div>
  );
}
