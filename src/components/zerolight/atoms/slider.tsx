"use client";

import React from "react";
import { useZeroLight } from "../context";

export interface SliderProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  id?: string;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  label,
  id,
}: SliderProps) {
  const { tokens, scaled } = useZeroLight();

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2 w-full">
      {(label || true) && (
        <div className="flex items-center justify-between text-xs">
          {label && (
            <label htmlFor={id} style={{ color: tokens.textIconColor }} className="font-medium">
              {label}
            </label>
          )}
          <span style={{ color: tokens.textIconColor }} className="tabular-nums font-semibold ml-auto">
            {value}%
          </span>
        </div>
      )}

      <div className="relative flex items-center h-5 w-full select-none">
        {/* Track */}
        <div
          style={{
            borderRadius: `${scaled.scaledPillRadius}px`,
            backgroundColor: "#E4E4E7",
          }}
          className="h-1.5 w-full overflow-hidden"
        >
          {/* Active fill */}
          <div
            style={{
              width: `${percentage}%`,
              backgroundColor: tokens.primaryButtonColor,
              borderRadius: `${scaled.scaledPillRadius}px`,
              transition: "width 0.05s linear",
            }}
            className="h-full"
          />
        </div>

        {/* Real native range input overlaid invisibly for full keyboard & accessibility support */}
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        {/* Visual Thumb */}
        <div
          style={{
            left: `calc(${percentage}% - 8px)`,
            borderRadius: `${scaled.scaledPillRadius}px`,
            borderColor: tokens.primaryButtonColor,
            borderWidth: "2px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          }}
          className="absolute w-4 h-4 pointer-events-none transition-transform"
        />
      </div>
    </div>
  );
}
