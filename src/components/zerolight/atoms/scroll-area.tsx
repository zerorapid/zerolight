"use client";

import React from "react";
import { useZeroLight } from "../context";

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: number | string;
  orientation?: "vertical" | "horizontal" | "both";
  bordered?: boolean;
}

/**
 * Clean scrollable viewport container respecting ZeroLight border & radius tokens.
 */
export function ScrollArea({
  maxHeight = 280,
  orientation = "vertical",
  bordered = false,
  className = "",
  style,
  children,
  ...props
}: ScrollAreaProps) {
  const { tokens, scaled } = useZeroLight();

  const overflowClass =
    orientation === "horizontal"
      ? "overflow-x-auto overflow-y-hidden"
      : orientation === "both"
      ? "overflow-auto"
      : "overflow-y-auto overflow-x-hidden";

  return (
    <div
      style={{
        maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
        borderColor: bordered ? tokens.universalBorderColor : undefined,
        borderWidth: bordered ? `${tokens.borderWidth}px` : undefined,
        borderRadius: bordered ? `${scaled.scaledCardRadius}px` : undefined,
        ...style,
      }}
      className={`${overflowClass} ${bordered ? "border" : ""} font-sans ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
