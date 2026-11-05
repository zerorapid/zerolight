"use client";

import React from "react";

export interface SkeletonBarProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}

export function SkeletonBar({
  width = "w-full",
  height = "h-4",
  className = "",
  rounded = "md",
}: SkeletonBarProps) {
  const roundedClasses = {
    sm: "rounded-sm",
    md: "rounded",
    lg: "rounded-lg",
    full: "rounded-full",
  }[rounded];

  return (
    <div
      role="status"
      aria-label="Loading content..."
      className={`${width} ${height} ${roundedClasses} bg-neutral-900 border border-neutral-800/80 animate-pulse ${className}`}
    />
  );
}
