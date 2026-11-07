"use client";

import React from "react";
import { useZeroLight } from "../context";
import { motion } from "framer-motion";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  id?: string;
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  id,
}: SwitchProps) {
  const { tokens, scaled } = useZeroLight();

  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center justify-between gap-4 select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      {(label || description) && (
        <div className="space-y-0.5">
          {label && (
            <span
              style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
              className="font-medium block leading-snug"
            >
              {label}
            </span>
          )}
          {description && (
            <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 block leading-snug">
              {description}
            </span>
          )}
        </div>
      )}

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        style={{
          borderRadius: `${scaled.scaledPillRadius}px`,
          backgroundColor: checked ? tokens.primaryButtonColor : "#E4E4E7",
          borderColor: tokens.borderWidth > 0 ? tokens.universalBorderColor : "transparent",
          borderWidth: `${tokens.borderWidth}px`,
          width: "44px",
          height: "24px",
          transition: scaled.transitionStyle,
        }}
        className="relative p-0.5 border cursor-pointer shrink-0 transition-colors shadow-2xs"
      >
        <motion.div
          animate={{ x: checked ? 20 : 0 }}
          transition={scaled.motionConfig.spring}
          style={{
            borderRadius: `${scaled.scaledPillRadius}px`,
            backgroundColor: "#FFFFFF",
          }}
          className="w-4 h-4 shadow-sm"
        />
      </button>
    </label>
  );
}
