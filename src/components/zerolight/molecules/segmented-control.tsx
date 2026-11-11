"use client";

import React, { useId } from "react";
import { useZeroLight } from "../context";
import { motion } from "framer-motion";

export interface SegmentOption<T extends string = string> {
  key: T;
  label: string;
  count?: string | number;
}

export interface SegmentedControlProps<T extends string = string> {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  className = "",
}: SegmentedControlProps<T>) {
  const { tokens, scaled } = useZeroLight();
  const controlId = useId();

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledPillRadius}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: tokens.hoverBackplateTint,
      }}
      className={`inline-flex items-center gap-1 p-0.5 border select-none whitespace-nowrap shrink-0 max-w-full overflow-x-auto scrollbar-none ${className}`}
    >
      {options.map((opt) => {
        const isSelected = value === opt.key;
        return (
          <motion.button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            whileTap={{ scale: scaled.motionConfig.tapScale }}
            transition={scaled.motionConfig.transition}
            style={{
              borderRadius: `${scaled.scaledPillRadius}px`,
              transition: scaled.transitionStyle,
              color: isSelected ? scaled.primaryActionTextColor : tokens.textIconColor,
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold cursor-pointer relative whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              isSelected ? "" : "hover:text-neutral-900"
            }`}
          >
            {isSelected && (
              <motion.span
                layoutId={`segment-pill-${controlId}`}
                transition={scaled.motionConfig.pillTransition}
                style={{
                  borderRadius: `${scaled.scaledPillRadius}px`,
                  backgroundColor: tokens.primaryButtonColor,
                }}
                className="absolute inset-0 shadow-xs z-0"
              />
            )}
            <span className="relative z-10 whitespace-nowrap">{opt.label}</span>
            {opt.count !== undefined && (
              <span
                style={{
                  borderRadius: `${scaled.scaledPillRadius}px`,
                  backgroundColor: isSelected
                    ? (scaled.primaryActionTextColor === "#FFFFFF" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)")
                    : "#E4E4E7",
                  color: isSelected ? scaled.primaryActionTextColor : "#71717A",
                }}
                className="relative z-10 text-[10px] px-1.5 py-0.2 font-bold tabular-nums whitespace-nowrap shrink-0"
              >
                {opt.count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
