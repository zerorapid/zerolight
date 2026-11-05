"use client";

import React from "react";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  description?: string;
  size?: "sm" | "md";
  className?: string;
  id?: string;
}

export function Checkbox({
  checked,
  onChange,
  indeterminate = false,
  disabled = false,
  label,
  description,
  size = "md",
  className = "",
  id,
}: CheckboxProps) {
  const inputId = id || `checkbox-${Math.random().toString(36).substring(2, 8)}`;

  const boxSizeClasses = size === "sm" ? "w-3.5 h-3.5 rounded" : "w-4 h-4 rounded-md";

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex items-start gap-2.5 font-sans select-none cursor-pointer group ${
        disabled ? "opacity-45 cursor-not-allowed" : ""
      } ${className}`}
    >
      <div className="relative mt-0.5 flex items-center justify-center">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />

        <div
          className={`${boxSizeClasses} border transition-all duration-200 ease-spring-tactile flex items-center justify-center transform-gpu will-change-transform ${
            checked || indeterminate
              ? "bg-emerald-500 border-emerald-400 text-neutral-950 shadow-[0_0_8px_rgba(16,185,129,0.35)]"
              : "bg-neutral-950 border-neutral-750 group-hover:border-neutral-600"
          } ${disabled ? "" : "group-active:scale-95"}`}
        >
          {indeterminate ? (
            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5}>
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          ) : checked ? (
            <svg
              className="w-2.5 h-2.5 transition-transform duration-200 ease-spring-tactile scale-100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          ) : null}
        </div>
      </div>

      {(label || description) && (
        <div className="flex flex-col text-xs">
          {label && <span className="font-medium text-neutral-200">{label}</span>}
          {description && <span className="text-[11px] text-neutral-500">{description}</span>}
        </div>
      )}
    </label>
  );
}
