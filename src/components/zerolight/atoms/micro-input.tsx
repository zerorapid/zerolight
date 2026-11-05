"use client";

import React from "react";

export interface MicroInputProps {
  value: string | number;
  onChange: (val: string) => void;
  type?: "text" | "number";
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  size?: "sm" | "md";
  align?: "left" | "right";
  className?: string;
  ariaLabel?: string;
}

export function MicroInput({
  value,
  onChange,
  type = "text",
  prefix,
  suffix,
  placeholder,
  disabled = false,
  min,
  max,
  step,
  size = "sm",
  align = "left",
  className = "",
  ariaLabel,
}: MicroInputProps) {
  const sizeClasses = {
    sm: "h-6 text-xs px-2",
    md: "h-7 text-xs px-2.5",
  }[size];

  const textAlign = align === "right" ? "text-right" : "text-left";

  return (
    <div
      className={`inline-flex items-center rounded border border-neutral-800 bg-neutral-950 font-mono transition-colors focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/50 ${sizeClasses} ${
        disabled ? "opacity-40 cursor-not-allowed bg-neutral-900/50" : ""
      } ${className}`}
    >
      {prefix && (
        <span className="text-neutral-500 select-none text-[11px] mr-1 flex-shrink-0">
          {prefix}
        </span>
      )}

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder || "Micro input"}
        className={`w-full bg-transparent text-neutral-100 placeholder-neutral-600 focus:outline-none tabular-nums ${textAlign} disabled:cursor-not-allowed`}
      />

      {suffix && (
        <span className="text-neutral-500 select-none text-[11px] ml-1 flex-shrink-0">
          {suffix}
        </span>
      )}
    </div>
  );
}
