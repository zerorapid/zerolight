"use client";

import React, { useRef } from "react";

export type InputSize = "sm" | "md" | "lg";
export type InputStatus = "default" | "error" | "success";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> {
  value: string;
  onChange: (val: string) => void;
  size?: InputSize;
  status?: InputStatus;
  clearable?: boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  prefixText?: string;
  suffixText?: string;
  className?: string;
}

export function Input({
  value,
  onChange,
  size = "md",
  status = "default",
  clearable = true,
  prefixIcon,
  suffixIcon,
  prefixText,
  suffixText,
  disabled = false,
  placeholder,
  className = "",
  type = "text",
  ...props
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses: Record<InputSize, string> = {
    sm: "h-7 text-xs px-2.5 rounded-md",
    md: "h-9 text-xs px-3 rounded-lg",
    lg: "h-11 text-sm px-4 rounded-xl",
  };

  const statusBorderClasses: Record<InputStatus, string> = {
    default: "border-neutral-800 focus-within:border-emerald-500/80 focus-within:ring-2 focus-within:ring-emerald-500/20",
    error: "border-rose-500/90 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20 text-rose-300",
    success: "border-emerald-500/90 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 text-emerald-300",
  };

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={`relative inline-flex items-center w-full font-sans bg-neutral-950 border transition-all duration-200 ease-spring-tactile ${
        sizeClasses[size]
      } ${statusBorderClasses[status]} ${
        disabled ? "opacity-45 cursor-not-allowed bg-neutral-900/60" : "hover:border-neutral-700"
      } ${className}`}
    >
      {prefixIcon && <span className="text-neutral-500 mr-2 flex-shrink-0">{prefixIcon}</span>}
      {prefixText && <span className="text-neutral-500 font-mono text-xs mr-1.5 select-none">{prefixText}</span>}

      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full bg-transparent text-neutral-100 placeholder-neutral-500 focus:outline-none disabled:cursor-not-allowed font-medium text-inherit"
        {...props}
      />

      {/* Clear Button */}
      {clearable && value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear input"
          className="text-neutral-500 hover:text-neutral-200 p-0.5 ml-1 rounded-full hover:bg-neutral-800 transition-colors flex-shrink-0"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Status Icons */}
      {status === "error" && (
        <span className="text-rose-400 ml-1.5 flex-shrink-0" title="Error state">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </span>
      )}

      {status === "success" && (
        <span className="text-emerald-400 ml-1.5 flex-shrink-0" title="Success state">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </span>
      )}

      {suffixText && <span className="text-neutral-500 font-mono text-xs ml-1.5 select-none">{suffixText}</span>}
      {suffixIcon && <span className="text-neutral-500 ml-2 flex-shrink-0">{suffixIcon}</span>}
    </div>
  );
}
