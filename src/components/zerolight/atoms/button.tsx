"use client";

import React from "react";
import { Spinner } from "./spinner";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  loadingText,
  iconLeft,
  iconRight,
  children,
  disabled,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const sizeClasses: Record<ButtonSize, string> = {
    sm: "h-7 px-2.5 text-xs gap-1.5 rounded-md",
    md: "h-9 px-3.5 text-xs font-semibold gap-2 rounded-lg",
    lg: "h-11 px-5 text-sm font-semibold gap-2.5 rounded-xl",
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      "bg-neutral-100 text-neutral-950 hover:bg-white active:bg-neutral-200 border border-neutral-100 shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500/50",
    secondary:
      "bg-neutral-900 text-neutral-200 hover:text-white hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 shadow-inner focus-visible:ring-2 focus-visible:ring-neutral-400/50",
    outline:
      "bg-transparent text-neutral-300 hover:text-white hover:bg-neutral-900/60 border border-neutral-750 hover:border-neutral-600 focus-visible:ring-2 focus-visible:ring-neutral-400/50",
    ghost:
      "bg-transparent text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 border border-transparent focus-visible:ring-2 focus-visible:ring-neutral-400/50",
    danger:
      "bg-rose-950/80 text-rose-300 hover:bg-rose-900/80 hover:text-rose-200 border border-rose-800/80 shadow-sm focus-visible:ring-2 focus-visible:ring-rose-500/50",
  };

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`relative inline-flex items-center justify-center font-sans select-none transition-all duration-200 ease-spring-tactile transform-gpu will-change-transform focus:outline-none active:scale-[0.985] ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        isDisabled ? "opacity-45 pointer-events-none cursor-not-allowed shadow-none" : ""
      } ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size={size === "lg" ? "md" : "xs"} color="currentColor" />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
          <span>{children}</span>
          {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
        </>
      )}
    </button>
  );
}
