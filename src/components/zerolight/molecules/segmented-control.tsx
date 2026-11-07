"use client";

import React from "react";
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

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledPillRadius}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: tokens.hoverBackplateTint,
      }}
      className={`inline-flex items-center gap-1 p-0.5 border select-none whitespace-nowrap shrink-0 ${className}`}
    >
      {options.map((opt) => {
        const isSelected = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            style={{
              borderRadius: `${scaled.scaledPillRadius}px`,
              transition: "background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease",
              backgroundColor: isSelected ? tokens.primaryButtonColor : "transparent",
              color: isSelected ? scaled.primaryActionTextColor : tokens.textIconColor,
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold cursor-pointer relative whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              isSelected ? "shadow-xs" : "hover:text-neutral-900"
            }`}
          >
            <span className="whitespace-nowrap">{opt.label}</span>
            {opt.count !== undefined && (
              <span
                style={{
                  borderRadius: `${scaled.scaledPillRadius}px`,
                  backgroundColor: isSelected
                    ? (scaled.primaryActionTextColor === "#FFFFFF" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)")
                    : "#E4E4E7",
                  color: isSelected ? scaled.primaryActionTextColor : "#71717A",
                }}
                className="text-[10px] px-1.5 py-0.2 font-bold tabular-nums whitespace-nowrap shrink-0"
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
