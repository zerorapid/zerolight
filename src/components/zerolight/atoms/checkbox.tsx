"use client";

import React from "react";
import { useZeroLight } from "../context";
import { Check, Minus } from "lucide-react";
import { motion } from "framer-motion";

export interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  id?: string;
}

export function Checkbox({
  checked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  label,
  description,
  id,
}: CheckboxProps) {
  const { tokens, scaled } = useZeroLight();

  const isCheckedOrIndeterminate = checked || indeterminate;

  return (
    <label
      htmlFor={id}
      className={`inline-flex items-start gap-2.5 select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <motion.button
        id={id}
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? "mixed" : checked}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : scaled.motionConfig.hoverScale }}
        whileTap={{ scale: disabled ? 1 : scaled.motionConfig.tapScale }}
        transition={scaled.motionConfig.transition}
        onClick={() => !disabled && onChange?.(!checked)}
        style={{
          borderRadius: `${scaled.scaledCheckboxRadius}px`,
          borderColor: isCheckedOrIndeterminate ? tokens.primaryButtonColor : tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          backgroundColor: isCheckedOrIndeterminate ? tokens.primaryButtonColor : tokens.universalFillColor,
          transition: scaled.transitionStyle,
        }}
        className="w-4 h-4 flex items-center justify-center border mt-0.5 shrink-0 shadow-2xs transform-gpu"
      >
        {checked && !indeterminate && (
          <motion.span
            key="checked"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={scaled.motionConfig.transition}
            className="flex items-center justify-center"
          >
            <Check
              size={12}
              strokeWidth={tokens.iconStrokeWidth || 2.5}
              color={scaled.primaryActionTextColor}
            />
          </motion.span>
        )}
        {indeterminate && (
          <motion.span
            key="indeterminate"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={scaled.motionConfig.transition}
            className="flex items-center justify-center"
          >
            <Minus
              size={12}
              strokeWidth={tokens.iconStrokeWidth || 2.5}
              color={scaled.primaryActionTextColor}
            />
          </motion.span>
        )}
      </motion.button>

      {(label || description) && (
        <div className="space-y-0.5">
          {label && (
            <span
              style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
              className="font-medium leading-none block"
            >
              {label}
            </span>
          )}
          {description && (
            <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 block">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}
