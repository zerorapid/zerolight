"use client";

import React from "react";
import { useZeroLight } from "../context";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  error?: boolean;
}

export function Input({
  iconLeft,
  iconRight,
  error = false,
  disabled,
  className = "",
  style,
  ...props
}: InputProps) {
  const { tokens, scaled } = useZeroLight();

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledRadius}px`,
        borderColor: error ? "#F43F5E" : tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: scaled.effectiveInputFill,
        height: `${scaled.scaledHeight}px`,
        transition: scaled.transitionStyle,
      }}
      className={`flex items-center gap-2 border px-3 transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed bg-neutral-100" : "focus-within:ring-2 focus-within:ring-black/10"
      } ${className}`}
    >
      {iconLeft && <span className="text-neutral-400 shrink-0 flex items-center">{iconLeft}</span>}
      <input
        disabled={disabled}
        style={{
          fontSize: `${scaled.scaledFontSize}px`,
          color: tokens.textIconColor,
          ...style,
        }}
        className="w-full bg-transparent outline-none font-medium placeholder:text-neutral-400"
        {...props}
      />
      {iconRight && <span className="text-neutral-400 shrink-0 flex items-center">{iconRight}</span>}
    </div>
  );
}
