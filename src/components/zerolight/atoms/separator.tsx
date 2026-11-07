"use client";

import React from "react";
import { useZeroLight } from "../context";

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Separator({
  orientation = "horizontal",
  label,
  className = "",
  style,
}: SeparatorProps) {
  const { tokens, scaled } = useZeroLight();

  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        style={{
          width: `${Math.max(1, tokens.borderWidth)}px`,
          backgroundColor: tokens.universalBorderColor,
          ...style,
        }}
        className={`self-stretch h-full shrink-0 ${className}`}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={`flex items-center gap-3 w-full my-2 select-none ${className}`}
        style={style}
      >
        <div
          style={{
            height: `${Math.max(1, tokens.borderWidth)}px`,
            backgroundColor: tokens.universalBorderColor,
          }}
          className="flex-1"
        />
        <span
          style={{
            fontSize: `${scaled.sublabelFontSize}px`,
            color: tokens.textIconColor,
            borderRadius: `${scaled.scaledPillRadius}px`,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            backgroundColor: tokens.hoverBackplateTint,
          }}
          className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border shadow-2xs whitespace-nowrap"
        >
          {label}
        </span>
        <div
          style={{
            height: `${Math.max(1, tokens.borderWidth)}px`,
            backgroundColor: tokens.universalBorderColor,
          }}
          className="flex-1"
        />
      </div>
    );
  }

  return (
    <hr
      role="separator"
      aria-orientation="horizontal"
      style={{
        height: `${Math.max(1, tokens.borderWidth)}px`,
        backgroundColor: tokens.universalBorderColor,
        border: "none",
        ...style,
      }}
      className={`w-full my-2 shrink-0 ${className}`}
    />
  );
}
