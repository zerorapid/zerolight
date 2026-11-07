"use client";

import React from "react";
import { useZeroLight } from "../context";
import { Loader2 } from "lucide-react";
import { motion, HTMLMotionProps } from "framer-motion";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  iconLeft,
  iconRight,
  children,
  disabled,
  className = "",
  style,
  type = "button",
  ...props
}: ButtonProps) {
  const { tokens, scaled } = useZeroLight();
  const isDisabled = Boolean(disabled || loading);

  const sizeMultiplier = size === "sm" ? 0.85 : size === "lg" ? 1.15 : 1.0;
  const height = Math.round(scaled.scaledHeight * sizeMultiplier);
  const paddingX = Math.round(scaled.scaledPaddingX * sizeMultiplier);
  const fontSize = Math.max(11, Math.round(scaled.ctaFontSize * (size === "sm" ? 0.9 : size === "lg" ? 1.1 : 1.0)));

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: tokens.primaryButtonColor,
          color: scaled.primaryActionTextColor,
          borderColor: tokens.borderWidth > 0 ? tokens.primaryButtonColor : "transparent",
        };
      case "secondary":
        return {
          backgroundColor: tokens.hoverBackplateTint,
          color: tokens.textIconColor,
          borderColor: tokens.universalBorderColor,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          color: tokens.textIconColor,
          borderColor: tokens.universalBorderColor,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          color: tokens.textIconColor,
          borderColor: "transparent",
        };
      case "destructive":
        return {
          backgroundColor: "#FFF1F2",
          color: "#E11D48",
          borderColor: "#FECDD3",
        };
    }
  };

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      whileTap={{ scale: isDisabled ? 1 : scaled.motionConfig.tapScale }}
      transition={scaled.motionConfig.spring}
      style={{
        borderRadius: `${scaled.scaledRadius}px`,
        borderWidth: `${variant === "ghost" ? 0 : Math.max(1, tokens.borderWidth)}px`,
        minHeight: `${height}px`,
        paddingLeft: `${paddingX}px`,
        paddingRight: `${paddingX}px`,
        fontSize: `${fontSize}px`,
        transition: scaled.transitionStyle,
        ...getVariantStyles(),
        ...style,
      }}
      className={`inline-flex items-center justify-center gap-2 font-semibold shadow-xs select-none whitespace-nowrap shrink-0 transition-opacity transform-gpu ${
        isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90"
      } ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        iconLeft && <span className="shrink-0 flex items-center">{iconLeft}</span>
      )}
      {children && <span className="whitespace-nowrap">{children}</span>}
      {!loading && iconRight && <span className="shrink-0 flex items-center">{iconRight}</span>}
    </motion.button>
  );
}
