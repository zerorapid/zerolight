"use client";

import React, { useId } from "react";

export interface ApertureSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
  label?: string;
  unit?: string;
  className?: string;
  showLimits?: boolean;
}

export function ApertureSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  disabled = false,
  label,
  unit = "",
  className = "",
  showLimits = true,
}: ApertureSliderProps) {
  const generatedId = useId();
  const inputId = `slider-${generatedId}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className={`space-y-1.5 w-full font-sans ${className}`}>
      {(label || unit) && (
        <div className="flex items-center justify-between text-xs">
          {label && (
            <label
              htmlFor={inputId}
              className="font-medium text-neutral-300 select-none flex items-center gap-2"
            >
              {label}
            </label>
          )}

          <div className="flex items-center gap-1 font-mono text-xs font-semibold tabular-nums text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
            <span>{value}</span>
            {unit && <span className="text-[10px] text-emerald-500 font-normal">{unit}</span>}
          </div>
        </div>
      )}

      <div className="relative flex items-center">
        <input
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          aria-label={label || "Constraint Slider"}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value}${unit}`}
          className="w-full h-1.5 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-emerald-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        />
      </div>

      {showLimits && (
        <div className="flex justify-between text-[10px] font-mono text-neutral-500 tabular-nums select-none px-0.5">
          <span>
            {min}
            {unit}
          </span>
          <span>
            {max}
            {unit}
          </span>
        </div>
      )}
    </div>
  );
}
