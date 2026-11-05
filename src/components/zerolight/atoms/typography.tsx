"use client";

import React from "react";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4";

export interface HeadingProps {
  level?: HeadingLevel;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Heading({
  level = "h2",
  children,
  className = "",
  as,
}: HeadingProps) {
  const Component = as || level;

  const styleMap: Record<HeadingLevel, string> = {
    h1: "text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-100",
    h2: "text-xl sm:text-2xl font-bold tracking-tight text-neutral-100",
    h3: "text-lg sm:text-xl font-bold tracking-normal text-neutral-200",
    h4: "text-sm sm:text-base font-semibold tracking-normal text-neutral-200",
  };

  return (
    <Component className={`${styleMap[level]} font-sans ${className}`}>
      {children}
    </Component>
  );
}

export type TextVariant = "body" | "body-bold" | "caption" | "label" | "code";
export type TextColor = "default" | "muted" | "secondary" | "error" | "success" | "brand";

export interface TextProps {
  variant?: TextVariant;
  color?: TextColor;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Text({
  variant = "body",
  color = "default",
  children,
  className = "",
  as = "p",
}: TextProps) {
  const Component = variant === "code" ? "code" : as;

  const variantStyles: Record<TextVariant, string> = {
    body: "text-sm font-normal leading-relaxed",
    "body-bold": "text-sm font-semibold leading-relaxed",
    caption: "text-xs font-medium leading-normal",
    label: "text-[11px] font-semibold uppercase tracking-wider select-none",
    code: "text-xs font-mono font-medium px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800",
  };

  const colorStyles: Record<TextColor, string> = {
    default: "text-neutral-200",
    muted: "text-neutral-500",
    secondary: "text-neutral-400",
    error: "text-rose-400",
    success: "text-emerald-400",
    brand: "text-emerald-300",
  };

  return (
    <Component
      className={`${variantStyles[variant]} ${colorStyles[color]} ${className}`}
    >
      {children}
    </Component>
  );
}
