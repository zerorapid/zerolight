"use client";

import React from "react";
import { useZeroLight } from "../context";
import { useMorphic, type MorphicStage } from "../morphic-engine";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  error?: boolean;
  stage?: MorphicStage;
}

export function Input({
  iconLeft,
  iconRight,
  error = false,
  disabled,
  stage,
  className = "",
  style,
  ...props
}: InputProps) {
  const { tokens, scaled } = useZeroLight();
  const m = useMorphic(stage);
  const morphicHeight = Math.round(
    scaled.scaledHeight * (m.isM1 ? 0.88 : m.isM3 ? 1.06 : 1.0)
  );

  const renderIcon = (node: React.ReactNode) => {
    if (!node || !React.isValidElement(node)) return node;
    const existingProps = (node.props as Record<string, any>) || {};
    return React.cloneElement(node as React.ReactElement<any>, {
      size: existingProps.size || scaled.iconSmSize || 16,
      strokeWidth: existingProps.strokeWidth || tokens.iconStrokeWidth || 1.75,
      color: existingProps.color || tokens.iconColor || tokens.textIconColor,
      fill: existingProps.fill || (tokens.iconFill === "currentColor" ? (tokens.iconColor || tokens.textIconColor) : "none"),
    });
  };

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledRadius}px`,
        borderColor: error ? "#F43F5E" : tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: scaled.effectiveInputFill,
        height: `${morphicHeight}px`,
        transition: scaled.transitionStyle,
      }}
      className={`flex items-center gap-2 border px-3 transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed bg-neutral-100" : "focus-within:ring-2 focus-within:ring-black/10"
      } ${className}`}
    >
      {iconLeft && (
        <span
          style={{ color: tokens.iconColor || tokens.textIconColor }}
          className="shrink-0 flex items-center"
        >
          {renderIcon(iconLeft)}
        </span>
      )}
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
      {iconRight && (
        <span
          style={{ color: tokens.iconColor || tokens.textIconColor }}
          className="shrink-0 flex items-center"
        >
          {renderIcon(iconRight)}
        </span>
      )}
    </div>
  );
}
