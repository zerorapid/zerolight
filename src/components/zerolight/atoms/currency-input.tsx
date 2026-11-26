"use client";

import React, { useState, useEffect } from "react";
import { useZeroLight } from "../context";

export interface CurrencyInputProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  currency?: "USD" | "INR" | "EUR" | "GBP" | "JPY" | string;
  locale?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
  "aria-label"?: string;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  INR: "₹",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

/**
 * Tokenized monetary input with locale-aware formatting, currency prefix,
 * and tabular-nums alignment for SaaS, FinTech, and ERP forms.
 */
export function CurrencyInput({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  currency = "USD",
  locale = "en-US",
  min = 0,
  max,
  disabled = false,
  readOnly = false,
  placeholder = "0.00",
  label,
  error,
  className = "",
  "aria-label": ariaLabel,
}: CurrencyInputProps) {
  const { tokens, scaled } = useZeroLight();
  const [internalValue, setInternalValue] = useState<number>(defaultValue);
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;
  const [isFocused, setIsFocused] = useState(false);
  const [draft, setDraft] = useState<string>(String(currentValue || ""));

  useEffect(() => {
    if (!isFocused) {
      setDraft(
        currentValue
          ? currentValue.toLocaleString(locale, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : ""
      );
    }
  }, [currentValue, isFocused, locale]);

  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  const commitValue = (raw: string) => {
    const cleaned = raw.replace(/[^0-9.-]/g, "");
    let num = parseFloat(cleaned);
    if (Number.isNaN(num)) num = 0;
    if (min !== undefined) num = Math.max(min, num);
    if (max !== undefined) num = Math.min(max, num);
    const rounded = Math.round(num * 100) / 100;
    if (controlledValue === undefined) setInternalValue(rounded);
    onChange?.(rounded);
    return rounded;
  };

  return (
    <div className={`space-y-1.5 ${className}`} style={{ fontFamily: scaled.resolvedFontFamily }}>
      {label && (
        <label className="block text-xs font-semibold" style={{ color: tokens.textIconColor }}>
          {label}
        </label>
      )}
      <div
        style={{
          backgroundColor: tokens.universalFillColor,
          borderColor: error ? "#EF4444" : isFocused ? tokens.primaryButtonColor : tokens.universalBorderColor,
          borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
          borderStyle: "solid",
          borderRadius: `${scaled.scaledRadius}px`,
          color: tokens.textIconColor,
          transition: scaled.transitionStyle,
        }}
        className={`flex items-center overflow-hidden ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        <span
          style={{
            borderColor: tokens.universalBorderColor,
            backgroundColor: tokens.hoverBackplateTint,
          }}
          className="px-2.5 py-2 text-xs font-semibold border-r select-none shrink-0 font-sans tabular-nums"
        >
          {symbol}
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={draft}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          aria-label={ariaLabel || label || `Amount in ${currency}`}
          onFocus={() => {
            setIsFocused(true);
            setDraft(currentValue ? String(currentValue) : "");
          }}
          onChange={(e) => {
            setDraft(e.target.value);
          }}
          onBlur={() => {
            setIsFocused(false);
            const finalVal = commitValue(draft);
            setDraft(
              finalVal
                ? finalVal.toLocaleString(locale, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : ""
            );
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commitValue(draft);
            }
          }}
          className="w-full bg-transparent px-3 py-2 text-sm font-sans tabular-nums focus:outline-none text-right"
        />
        <span className="pr-2.5 text-[10px] font-semibold opacity-55 uppercase shrink-0">
          {currency}
        </span>
      </div>
      {error && <p className="text-[11px] font-medium text-red-600">{error}</p>}
    </div>
  );
}
