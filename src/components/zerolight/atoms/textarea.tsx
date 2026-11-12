"use client";

import React, { useEffect, useRef, useState } from "react";
import { useZeroLight } from "../context";

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "style"> {
  error?: boolean;
  autoResize?: boolean;
  maxRows?: number;
  showCount?: boolean;
  style?: React.CSSProperties;
}

/**
 * Token-bound multi-line Textarea / InputArea with optional auto-resize and character count.
 */
export function Textarea({
  error = false,
  autoResize = false,
  maxRows = 8,
  showCount = false,
  maxLength,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  rows = 3,
  className = "",
  style,
  ...props
}: TextareaProps) {
  const { tokens, scaled } = useZeroLight();
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState<number>(() => {
    const initial = value ?? defaultValue ?? "";
    return String(initial).length;
  });
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setCharCount(String(value).length);
    }
  }, [value]);

  useEffect(() => {
    if (!autoResize || !ref.current) return;
    const el = ref.current;
    el.style.height = "auto";
    const lineH = Math.round(scaled.scaledFontSize * 1.5);
    const maxH = maxRows * lineH + 20;
    el.style.height = `${Math.min(el.scrollHeight, maxH)}px`;
  }, [autoResize, maxRows, scaled.scaledFontSize, value, charCount]);

  return (
    <div className="w-full space-y-1">
      <textarea
        ref={ref}
        rows={rows}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => {
          if (value === undefined) setCharCount(e.target.value.length);
          onChange?.(e);
        }}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        style={{
          backgroundColor: scaled.effectiveInputFill,
          borderColor: error
            ? "#EF4444"
            : isFocused
            ? tokens.primaryButtonColor
            : tokens.universalBorderColor,
          borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
          borderRadius: `${scaled.scaledRadius === 999 ? 16 : scaled.scaledRadius}px`,
          color: tokens.textIconColor,
          fontSize: `${scaled.scaledFontSize}px`,
          boxShadow: isFocused ? scaled.focusHalo : undefined,
          transition: scaled.transitionStyle,
          ...style,
        }}
        className={`w-full px-3 py-2.5 font-sans outline-none resize-y placeholder:opacity-50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
      {showCount && (
        <div
          style={{ color: tokens.textIconColor }}
          className="flex justify-end text-[11px] opacity-55 tabular-nums font-sans"
        >
          {maxLength !== undefined ? `${charCount} / ${maxLength}` : `${charCount}`}
        </div>
      )}
    </div>
  );
}

export const InputArea = Textarea;
