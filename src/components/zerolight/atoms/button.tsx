"use client";

import React from "react";
import { useZeroLight } from "../context";
import { useMorphic, type MorphicStage } from "../morphic-engine";
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
  stage?: MorphicStage;
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
  stage,
  className = "",
  style,
  type = "button",
  ...props
}: ButtonProps) {
  const { tokens, scaled } = useZeroLight();
  const m = useMorphic(stage);
  const isDisabled = Boolean(disabled || loading);

  const morphicScale = m.isM1 ? 0.92 : m.isM3 ? 1.06 : 1.0;
  const sizeMultiplier = (size === "sm" ? 0.85 : size === "lg" ? 1.15 : 1.0) * morphicScale;
  const height = Math.round(scaled.scaledHeight * sizeMultiplier);
  const paddingX = Math.round(scaled.scaledPaddingX * sizeMultiplier);
  const fontSize = Math.max(11, Math.round(scaled.ctaFontSize * (size === "sm" ? 0.9 : size === "lg" ? 1.1 : 1.0)));

  // Calculate dynamic icon sizing & styling reactive to Visual Studio icon tokens
  const baseIconSize = size === "sm" ? (scaled.iconSmSize || 14) : size === "lg" ? (scaled.iconLgSize || 20) : (scaled.iconSize || 16);
  const buttonIconColor = variant === "primary"
    ? scaled.primaryActionTextColor
    : variant === "destructive"
    ? "#E11D48"
    : (tokens.iconColor || tokens.textIconColor);

  const renderIcon = (node: React.ReactNode) => {
    if (!node || !React.isValidElement(node)) return node;
    const existingProps = (node.props as Record<string, any>) || {};
    const effectiveFill = existingProps.fill || (
      tokens.iconFill === "currentColor"
        ? buttonIconColor
        : tokens.iconFill === "subtle"
        ? `${buttonIconColor}25`
        : "none"
    );

    return React.cloneElement(node as React.ReactElement<any>, {
      size: existingProps.size || baseIconSize,
      strokeWidth: existingProps.strokeWidth || tokens.iconStrokeWidth,
      color: existingProps.color || buttonIconColor,
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
      case "primary":
        return {
          backgroundColor: tokens.primaryButtonColor,
          color: scaled.primaryActionTextColor,
          borderColor: tokens.borderWidth > 0 ? tokens.primaryButtonColor : "transparent",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.22)",
        };
      case "secondary":
        return {
          backgroundColor: tokens.hoverBackplateTint,
          color: tokens.textIconColor,
          borderColor: tokens.universalBorderColor,
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          color: tokens.textIconColor,
          borderColor: tokens.universalBorderColor,
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          color: tokens.textIconColor,
          borderColor: "transparent",
        };
      case "destructive":
        return {
          backgroundColor: scaled.isDarkSurface ? "#3A0D14" : "#FFF1F2",
          color: scaled.isDarkSurface ? "#FB7185" : "#E11D48",
          borderColor: scaled.isDarkSurface ? "#7F1D1D" : "#FECDD3",
        };
    }
  };

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      whileHover={{ scale: isDisabled ? 1 : scaled.motionConfig.hoverScale }}
      whileTap={{ scale: isDisabled ? 1 : scaled.motionConfig.tapScale }}
      transition={
        scaled.motionConfig.transition.duration === 0
          ? scaled.motionConfig.transition
          : { type: "spring", stiffness: m.spring.stiffness, damping: m.spring.damping, mass: m.spring.mass }
      }
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
      className={`inline-flex items-center justify-center gap-2 font-semibold shadow-xs select-none whitespace-nowrap shrink-0 transition-opacity transform-gpu focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1 ${
        isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90"
      } ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2
          size={baseIconSize}
          strokeWidth={tokens.iconStrokeWidth}
          className="animate-spin shrink-0"
        />
      ) : (
        iconLeft && <span className="shrink-0 flex items-center">{renderIcon(iconLeft)}</span>
      )}
      {children && <span className="whitespace-nowrap">{children}</span>}
      {!loading && iconRight && <span className="shrink-0 flex items-center">{renderIcon(iconRight)}</span>}
    </motion.button>
  );
}
