"use client";

import React from "react";
import { useZeroLight } from "../context";
import { motion, HTMLMotionProps } from "framer-motion";

export interface IconButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
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

  const dimension = size === "sm" ? 28 : size === "lg" ? 44 : 36;
  const baseIconSize = size === "sm" ? (scaled.iconSmSize || 14) : size === "lg" ? (scaled.iconLgSize || 20) : (scaled.iconSize || 16);

  const iconColor = variant === "solid"
    ? scaled.primaryActionTextColor
    : (tokens.iconColor || tokens.textIconColor);

  const renderIcon = (node: React.ReactNode) => {
    if (!node || !React.isValidElement(node)) return node;
    const existingProps = (node.props as Record<string, any>) || {};
    const effectiveFill = existingProps.fill || (
      tokens.iconFill === "currentColor"
        ? iconColor
        : tokens.iconFill === "subtle"
        ? `${iconColor}25`
        : "none"
    );

    return React.cloneElement(node as React.ReactElement<any>, {
      size: existingProps.size || baseIconSize,
      strokeWidth: existingProps.strokeWidth || tokens.iconStrokeWidth,
      color: existingProps.color || iconColor,
      fill: effectiveFill,
      style: {
        width: `${baseIconSize}px`,
        height: `${baseIconSize}px`,
        transition: scaled.transitionStyle,
        ...(existingProps.style || {}),
      },
    });
  };

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
    <motion.button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.92 }}
      transition={scaled.motionConfig.spring}
      style={{
        width: `${dimension}px`,
        height: `${dimension}px`,
        borderRadius: `${scaled.scaledRadius}px`,
        borderWidth: `${variant === "ghost" ? 0 : tokens.borderWidth}px`,
        transition: scaled.transitionStyle,
        ...getVariantStyles(),
        ...style,
      }}
      className={`inline-flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 border transition-colors transform-gpu ${
        disabled ? "opacity-40 cursor-not-allowed" : ""
      } ${className}`}
      {...props}
    >
      {renderIcon(icon)}
    </motion.button>
  );
}
