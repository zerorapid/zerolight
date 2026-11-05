"use client";

import React, { useEffect, useRef, useState } from "react";

export type MonoValueVariant = "default" | "success" | "muted";
export type MonoValueSize = "sm" | "md" | "lg";

export interface MonoValueProps {
  value: number | string;
  prefix?: string;
  suffix?: string;
  previousValue?: number | string;
  variant?: MonoValueVariant;
  size?: MonoValueSize;
  className?: string;
}

export function MonoValue({
  value,
  prefix,
  suffix,
  previousValue,
  variant = "default",
  size = "md",
  className = "",
}: MonoValueProps) {
  const [shimmer, setShimmer] = useState<boolean>(false);
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setShimmer(true);
    const timer = setTimeout(() => setShimmer(false), 400);
    return () => clearTimeout(timer);
  }, [value]);

  const sizeClasses = {
    sm: "text-xs leading-none",
    md: "text-sm leading-tight",
    lg: "text-base font-semibold leading-normal",
  }[size];

  const variantClasses = {
    default: "text-neutral-100",
    success: "text-emerald-400",
    muted: "text-neutral-400",
  }[variant];

  return (
    <span
      className={`inline-flex items-baseline gap-1.5 font-mono tabular-nums tracking-tight ${sizeClasses} ${className}`}
    >
      {previousValue !== undefined && previousValue !== null && (
        <span
          className="text-neutral-500 line-through text-[0.85em] font-normal opacity-75 select-none transition-opacity duration-200"
          aria-label={`Previous value: ${prefix ?? ""}${previousValue}${suffix ?? ""}`}
        >
          {prefix}
          {typeof previousValue === "number" ? previousValue.toLocaleString() : previousValue}
          {suffix}
        </span>
      )}

      <span
        className={`inline-block transform-gpu will-change-transform ${variantClasses} ${
          shimmer ? "animate-value-shimmer text-emerald-300" : "transition-colors duration-200"
        }`}
      >
        {prefix && <span className="opacity-70 font-normal mr-0.5">{prefix}</span>}
        <span className="font-medium">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {suffix && <span className="opacity-70 font-normal ml-0.5">{suffix}</span>}
      </span>
    </span>
  );
}
