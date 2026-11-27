"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";

export type InputMaskPreset = "phone" | "tax-id" | "card" | "date" | "custom";

export interface MaskedInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (formatted: string, raw: string) => void;
  mask?: InputMaskPreset;
  customPattern?: string; // e.g. "###-###-####" where # = digit
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const MASK_PATTERNS: Record<Exclude<InputMaskPreset, "custom">, { pattern: string; placeholder: string }> = {
  phone: { pattern: "(###) ###-####", placeholder: "(555) 123-4567" },
  "tax-id": { pattern: "##-#######", placeholder: "12-3456789" },
  card: { pattern: "#### #### #### ####", placeholder: "4242 4242 4242 4242" },
  date: { pattern: "##/##/####", placeholder: "MM/DD/YYYY" },
};

function applyMask(rawDigits: string, pattern: string): string {
  let result = "";
  let dIdx = 0;
  for (let i = 0; i < pattern.length && dIdx < rawDigits.length; i++) {
    if (pattern[i] === "#") {
      result += rawDigits[dIdx++];
    } else {
      result += pattern[i];
    }
  }
  return result;
}

/**
 * Structured masked input for phone numbers, tax IDs, dates, and payment cards.
 */
export function MaskedInput({
  value: controlledValue,
  defaultValue = "",
  onChange,
  mask = "phone",
  customPattern,
  label,
  placeholder,
  error,
  disabled = false,
  className = "",
}: MaskedInputProps) {
  const { tokens, scaled } = useZeroLight();
  const preset = mask === "custom" ? { pattern: customPattern || "###-###", placeholder: "000-000" } : MASK_PATTERNS[mask];
  const [internal, setInternal] = useState(applyMask(defaultValue.replace(/\D/g, ""), preset.pattern));
  const current = controlledValue !== undefined ? controlledValue : internal;

  return (
    <div className={`space-y-1.5 ${className}`} style={{ fontFamily: scaled.resolvedFontFamily }}>
      {label && (
        <label className="block text-xs font-semibold" style={{ color: tokens.textIconColor }}>
          {label}
        </label>
      )}
      <input
        type="text"
        inputMode="numeric"
        value={current}
        disabled={disabled}
        placeholder={placeholder || preset.placeholder}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "");
          const formatted = applyMask(digits, preset.pattern);
          if (controlledValue === undefined) setInternal(formatted);
          onChange?.(formatted, digits);
        }}
        style={{
          backgroundColor: tokens.universalFillColor,
          borderColor: error ? "#EF4444" : tokens.universalBorderColor,
          borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
          borderStyle: "solid",
          borderRadius: `${scaled.scaledRadius}px`,
          color: tokens.textIconColor,
        }}
        className="w-full px-3 py-2 text-sm font-sans tabular-nums focus:outline-none disabled:opacity-50"
      />
      {error && <p className="text-[11px] font-medium text-red-600">{error}</p>}
    </div>
  );
}
