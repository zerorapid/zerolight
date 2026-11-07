"use client";

import React from "react";
import { useZeroLight } from "../context";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  ariaLabel: string;
  variant?: "ghost" | "outline" | "solid";
  size?: "sm" | "md" | "lg";
}

export function IconButton({
  icon,
  ariaLabel,
  variant = "ghost",
  size = "md",
  className = "",
  style,
  disabled,
  ...props
}: IconButtonProps) {
  const { tokens, scaled } = useZeroLight();

  const dimension = size === "sm" ? 28 : size === "lg" ? 40 : 34;

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "solid":
        return {
          backgroundColor: tokens.primaryButtonColor,
          color: scaled.primaryActionTextColor,
          borderColor: tokens.primaryButtonColor,
        };
      case "outline":
        return {
          backgroundColor: tokens.universalFillColor,
          color: tokens.textIconColor,
          borderColor: tokens.universalBorderColor,
        };
      case "ghost":
      default:
        return {
          backgroundColor: "transparent",
          color: tokens.textIconColor,
          borderColor: "transparent",
        };
    }
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      style={{
        width: `${dimension}px`,
        height: `${dimension}px`,
        borderRadius: `${scaled.scaledRadius}px`,
        borderWidth: `${variant === "ghost" ? 0 : tokens.borderWidth}px`,
        transition: scaled.transitionStyle,
        ...getVariantStyles(),
        ...style,
      }}
      className={`inline-flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 active:scale-95 border transition-all ${
        disabled ? "opacity-40 cursor-not-allowed" : ""
      } ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}
