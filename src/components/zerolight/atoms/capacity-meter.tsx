"use client";

import React from "react";

export interface CapacityMeterProps {
  value: number;
  max?: number;
  unit?: string;
  label?: string;
  warningThreshold?: number; // Default 75%
  criticalThreshold?: number; // Default 90%
  showLabel?: boolean;
  className?: string;
}

export function CapacityMeter({
  value,
  max = 100,
  unit = "%",
  label,
  warningThreshold = 75,
  criticalThreshold = 90,
  showLabel = true,
  className = "",
}: CapacityMeterProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const isCritical = percentage >= criticalThreshold;
  const isWarning = percentage >= warningThreshold && !isCritical;

  let barColor = "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
  let textColor = "text-emerald-400";
  let statusText = "NOMINAL";

  if (isCritical) {
    barColor = "bg-rose-500 animate-critical-pulse";
    textColor = "text-rose-400";
    statusText = "CRITICAL (OVER 90%)";
  } else if (isWarning) {
    barColor = "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.55)]";
    textColor = "text-amber-400";
    statusText = "WARNING";
  }

  return (
    <div className={`space-y-1.5 w-full font-sans select-none ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-medium text-neutral-300">
            {label && <span>{label}</span>}
            <span
              className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 transition-colors duration-300 ${textColor} ${
                isCritical ? "animate-pulse border-rose-800/80 bg-rose-950/40" : ""
              }`}
            >
              {statusText}
            </span>
          </div>

          <div className="font-mono text-xs tabular-nums text-neutral-400">
            <span className={`font-semibold transition-colors duration-300 ${textColor}`}>{value}</span>
            <span className="text-neutral-500">/{max}{unit}</span>
            <span className="text-neutral-500 ml-1">({percentage}%)</span>
          </div>
        </div>
      )}

      {/* Progress Track with Hardware Acceleration */}
      <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800/80">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-spring-tactile transform-gpu will-change-transform ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
