"use client";

import React, { useRef, useState } from "react";
import { useZeroLight } from "../context";

export interface InputOTPProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  masked?: boolean;
  label?: string;
  error?: string;
  className?: string;
}

/**
 * Multi-cell OTP / MFA verification input with auto-advance, backspace navigation,
 * and clipboard paste support.
 */
export function InputOTP({
  length = 6,
  value: controlledValue,
  defaultValue = "",
  onChange,
  onComplete,
  disabled = false,
  masked = false,
  label,
  error,
  className = "",
}: InputOTPProps) {
  const { tokens, scaled } = useZeroLight();
  const [internal, setInternal] = useState(defaultValue.slice(0, length));
  const current = (controlledValue !== undefined ? controlledValue : internal).slice(0, length);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const update = (next: string) => {
    const sanitized = next.replace(/[^a-zA-Z0-9]/g, "").slice(0, length);
    if (controlledValue === undefined) setInternal(sanitized);
    onChange?.(sanitized);
    if (sanitized.length === length) onComplete?.(sanitized);
  };

  const chars = Array.from({ length }, (_, i) => current[i] || "");

  return (
    <div className={`space-y-1.5 ${className}`} style={{ fontFamily: scaled.resolvedFontFamily }}>
      {label && (
        <label className="block text-xs font-semibold" style={{ color: tokens.textIconColor }}>
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        {chars.map((ch, idx) => (
          <input
            key={idx}
            ref={(el) => {
              refs.current[idx] = el;
            }}
            type={masked ? "password" : "text"}
            inputMode="numeric"
            maxLength={1}
            value={ch}
            disabled={disabled}
            aria-label={`Digit ${idx + 1} of ${length}`}
            onChange={(e) => {
              const val = e.target.value.slice(-1);
              const nextArr = [...chars];
              nextArr[idx] = val;
              update(nextArr.join(""));
              if (val && idx < length - 1) {
                refs.current[idx + 1]?.focus();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !chars[idx] && idx > 0) {
                refs.current[idx - 1]?.focus();
              } else if (e.key === "ArrowLeft" && idx > 0) {
                refs.current[idx - 1]?.focus();
              } else if (e.key === "ArrowRight" && idx < length - 1) {
                refs.current[idx + 1]?.focus();
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              const pasted = e.clipboardData.getData("text");
              update(pasted);
              const nextFocus = Math.min(length - 1, pasted.replace(/[^a-zA-Z0-9]/g, "").length);
              refs.current[nextFocus]?.focus();
            }}
            style={{
              backgroundColor: tokens.universalFillColor,
              borderColor: error ? "#EF4444" : tokens.universalBorderColor,
              borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
              borderStyle: "solid",
              borderRadius: `${scaled.scaledRadius}px`,
              color: tokens.textIconColor,
              transition: scaled.transitionStyle,
            }}
            className="w-10 h-11 text-center text-base font-bold font-sans tabular-nums focus:outline-none focus:ring-1"
          />
        ))}
      </div>
      {error && <p className="text-[11px] font-medium text-red-600">{error}</p>}
    </div>
  );
}
