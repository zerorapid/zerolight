"use client";

import React from "react";
import { useZeroLight } from "../context";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  hint?: string;
  error?: boolean;
}

/**
 * Accessible standalone form label bound to ZeroLight typography and polarity tokens.
 */
export function Label({
  children,
  required = false,
  hint,
  error = false,
  className = "",
  style,
  ...props
}: LabelProps) {
  const { tokens, scaled } = useZeroLight();

  return (
    <label
      style={{
        fontSize: `${Math.max(11, scaled.sublabelFontSize)}px`,
        color: error ? "#EF4444" : tokens.textIconColor,
        ...style,
      }}
      className={`inline-flex items-center gap-1.5 font-medium font-sans select-none ${className}`}
      {...props}
    >
      <span>{children}</span>
      {required && (
        <span className="text-rose-500 font-semibold" aria-hidden="true">
          *
        </span>
      )}
      {hint && (
        <span className="text-[11px] font-normal opacity-60">{hint}</span>
      )}
    </label>
  );
}
