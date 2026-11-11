"use client";

import React from "react";
import { useZeroLight } from "../context";

export interface ConjoinedFieldProps {
  children: React.ReactNode;
  label?: string;
  helperText?: string;
  error?: string;
  id?: string;
  className?: string;
}

/**
 * ConjoinedField merges 2 or more design elements (Inputs, Buttons, Dropdowns, Badges)
 * into a single unified seamless control with flush zero-space boundaries and reactive tokens.
 */
export function ConjoinedField({
  children,
  label,
  helperText,
  error,
  id,
  className = "",
}: ConjoinedFieldProps) {
  const { tokens, scaled } = useZeroLight();

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: `${scaled.labelFontSize}px`,
            color: tokens.textIconColor,
          }}
          className="block font-medium select-none"
        >
          {label}
        </label>
      )}

      {/* Unified Outer Container: Zero-gap flush boundary */}
      <div
        style={{
          borderRadius: `${scaled.scaledRadius}px`,
          borderColor: error ? "#F43F5E" : tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          backgroundColor: scaled.effectiveInputFill,
          height: `${scaled.scaledHeight}px`,
          transition: scaled.transitionStyle,
        }}
        className="flex items-center overflow-hidden border divide-x divide-neutral-200 focus-within:ring-2 focus-within:ring-neutral-900/15"
      >
        {children}
      </div>

      {error ? (
        <p className="text-xs text-rose-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-neutral-400">{helperText}</p>
      ) : null}
    </div>
  );
}
