"use client";

import React from "react";
import { useZeroLight } from "../context";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "muted" | "interactive";
  padding?: "none" | "sm" | "md" | "lg";
}

const PADDING_MAP = {
  none: "",
  sm: "p-3.5",
  md: "p-5",
  lg: "p-6",
};

/**
 * Composable Card container bound to ZeroLight surface, border, radius, and luminance elevation tokens.
 */
export function Card({
  variant = "default",
  padding = "md",
  className = "",
  style,
  children,
  ...props
}: CardProps) {
  const { tokens, scaled } = useZeroLight();

  const backgroundColor =
    variant === "muted" ? tokens.hoverBackplateTint : tokens.universalFillColor;

  const boxShadow =
    variant === "elevated"
      ? scaled.isDarkSurface
        ? "0 12px 32px rgba(0, 0, 0, 0.45)"
        : "0 10px 28px rgba(15, 23, 42, 0.08)"
      : scaled.cardShadow;

  return (
    <div
      style={{
        backgroundColor,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        borderRadius: `${scaled.scaledCardRadius}px`,
        color: tokens.textIconColor,
        boxShadow,
        transition: scaled.transitionStyle,
        ...style,
      }}
      className={`border font-sans ${PADDING_MAP[padding]} ${
        variant === "interactive"
          ? "hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-start justify-between gap-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const { scaled } = useZeroLight();
  return (
    <h3
      style={{ fontSize: `${scaled.headingFontSize}px` }}
      className={`font-semibold tracking-tight leading-snug ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { scaled } = useZeroLight();
  return (
    <p
      style={{ fontSize: `${scaled.sublabelFontSize}px` }}
      className={`opacity-65 leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { tokens } = useZeroLight();
  return (
    <div
      style={{ borderColor: tokens.universalBorderColor }}
      className={`mt-4 pt-3 border-t flex items-center justify-between gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
