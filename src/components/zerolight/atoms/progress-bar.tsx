"use client";

import React from "react";
import { useZeroLight } from "../context";
import { motion } from "framer-motion";

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
}: ProgressBarProps) {
  const { tokens, scaled } = useZeroLight();
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="space-y-1.5 w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && (
            <span style={{ color: tokens.textIconColor }} className="font-medium">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-neutral-500 tabular-nums font-semibold ml-auto">
              {Math.round(percentage)}% Complete
            </span>
          )}
        </div>
      )}

      <div
        style={{
          borderRadius: `${scaled.scaledPillRadius}px`,
          backgroundColor: "#E4E4E7",
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
        }}
        className="h-2 w-full overflow-hidden p-0.5 border"
      >
        <motion.div
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={scaled.motionConfig.transition}
          style={{
            borderRadius: `${scaled.scaledPillRadius}px`,
            backgroundColor: tokens.primaryButtonColor,
          }}
          className="h-full"
        />
      </div>
    </div>
  );
}
