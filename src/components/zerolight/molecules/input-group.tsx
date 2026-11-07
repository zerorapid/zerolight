"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { Copy, Check, Eye, EyeOff } from "lucide-react";

export interface InputGroupProps {
  label: string;
  value: string;
  prefix?: string;
  masked?: boolean;
  canCopy?: boolean;
  onCopy?: () => void;
  id: string;
}

export function InputGroup({
  label,
  value,
  prefix,
  masked = false,
  canCopy = true,
  onCopy,
  id,
}: InputGroupProps) {
  const { tokens, scaled } = useZeroLight();
  const [isMasked, setIsMasked] = useState<boolean>(masked);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };

  const displayValue = isMasked ? "•".repeat(Math.min(value.length, 24)) : value;

  return (
    <div className="space-y-1.5 w-full">
      <label
        htmlFor={id}
        style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }}
        className="block font-medium"
      >
        {label}
      </label>

      <div
        style={{
          borderRadius: `${scaled.scaledRadius}px`,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          backgroundColor: scaled.effectiveInputFill,
          height: `${scaled.scaledHeight}px`,
          transition: scaled.transitionStyle,
        }}
        className="flex items-center overflow-hidden border divide-x divide-neutral-200"
      >
        {prefix && (
          <span
            style={{ fontSize: `${scaled.sublabelFontSize}px` }}
            className="px-3 bg-neutral-100 text-neutral-500 font-medium select-none whitespace-nowrap shrink-0 flex items-center h-full"
          >
            {prefix}
          </span>
        )}

        <input
          id={id}
          type="text"
          readOnly
          value={displayValue}
          style={{
            fontSize: `${scaled.scaledFontSize}px`,
            color: tokens.textIconColor,
          }}
          className="w-full px-3 bg-transparent outline-none font-medium tabular-nums select-all"
        />

        {masked && (
          <button
            type="button"
            onClick={() => setIsMasked((prev) => !prev)}
            aria-label={isMasked ? "Reveal token" : "Hide token"}
            className="px-3 h-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 cursor-pointer transition-colors shrink-0"
          >
            {isMasked ? (
              <Eye
                size={scaled.iconSmSize || 14}
                strokeWidth={tokens.iconStrokeWidth || 1.75}
                color={tokens.iconColor || tokens.textIconColor}
              />
            ) : (
              <EyeOff
                size={scaled.iconSmSize || 14}
                strokeWidth={tokens.iconStrokeWidth || 1.75}
                color={tokens.iconColor || tokens.textIconColor}
              />
            )}
          </button>
        )}

        {canCopy && (
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy to clipboard"
            className="px-3 h-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 cursor-pointer transition-colors shrink-0"
          >
            {copied ? (
              <Check
                size={scaled.iconSmSize || 14}
                strokeWidth={tokens.iconStrokeWidth || 2}
                color="#059669"
              />
            ) : (
              <Copy
                size={scaled.iconSmSize || 14}
                strokeWidth={tokens.iconStrokeWidth || 1.75}
                color={tokens.iconColor || tokens.textIconColor}
              />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
