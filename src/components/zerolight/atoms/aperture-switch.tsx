"use client";

import React from "react";

export interface ApertureSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
  ariaLabel?: string;
}

export function ApertureSwitch({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  className = "",
  ariaLabel,
}: ApertureSwitchProps) {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className={`inline-flex items-center gap-2.5 font-sans ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel || label || "Aperture toggle switch"}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex h-[18px] w-8 flex-shrink-0 cursor-pointer rounded-full border transition-all duration-300 ease-spring-tactile focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transform-gpu will-change-transform ${
          checked
            ? "bg-emerald-500 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.55),0_0_2px_rgba(16,185,129,0.9)] ring-1 ring-emerald-400/50"
            : "bg-neutral-900 border-neutral-750 hover:border-neutral-600 shadow-inner"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-3.5 w-3.5 transform-gpu rounded-full shadow-sm ring-0 transition-all duration-300 ease-spring-tactile will-change-transform mt-[1px] ${
            checked
              ? "translate-x-[15px] bg-neutral-950 scale-105"
              : "translate-x-[2px] bg-neutral-400 scale-95"
          }`}
        />
      </button>

      {(label || description) && (
        <div className="flex flex-col select-none text-left" onClick={handleToggle}>
          {label && (
            <span
              className={`text-xs font-medium cursor-pointer transition-colors ${
                disabled ? "text-neutral-500" : checked ? "text-neutral-100" : "text-neutral-300"
              }`}
            >
              {label}
            </span>
          )}
          {description && (
            <span className="text-[10px] text-neutral-500 cursor-pointer">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
