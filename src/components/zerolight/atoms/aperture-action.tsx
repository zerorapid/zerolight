"use client";

import React from "react";

export type ApertureActionVariant = "primary" | "ghost" | "undo";

export interface ApertureActionProps {
  label: string;
  variant?: ApertureActionVariant;
  onClick: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

export function ApertureAction({
  label,
  variant = "primary",
  onClick,
  disabled = false,
  type = "button",
  className = "",
  icon,
  ariaLabel,
}: ApertureActionProps) {
  const variantClasses = {
    primary:
      "bg-neutral-100 text-neutral-950 hover:bg-white active:bg-neutral-200 font-semibold px-3.5 py-1.5 rounded shadow-sm border border-neutral-100 focus-visible:ring-1 focus-visible:ring-emerald-400 active:scale-[0.98]",
    ghost:
      "text-neutral-500 hover:text-neutral-300 active:text-neutral-200 px-2.5 py-1.5 rounded hover:bg-neutral-900 border border-transparent hover:border-neutral-800 font-medium",
    undo:
      "text-neutral-400 hover:text-neutral-100 text-[11px] underline underline-offset-4 decoration-neutral-600 hover:decoration-neutral-300 font-medium px-1 py-0.5 rounded focus-visible:ring-1 focus-visible:ring-emerald-400",
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || label}
      className={`inline-flex items-center justify-center gap-1.5 text-xs font-sans transition-all select-none disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none ${variantClasses} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}
