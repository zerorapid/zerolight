"use client";

import React, { useId } from "react";
import { useZeroLight } from "../context";
import { motion } from "framer-motion";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  orientation?: "vertical" | "horizontal";
  cardMode?: boolean; // When true, renders each option as a clickable card
  className?: string;
}

export function RadioGroup({
  name,
  value,
  onChange,
  options,
  orientation = "vertical",
  cardMode = false,
  className = "",
}: RadioGroupProps) {
  const { tokens, scaled } = useZeroLight();
  const generatedName = useId();
  const groupName = name || generatedName;

  const activeColor = tokens.primaryButtonColor || "#10B981";

  return (
    <div
      role="radiogroup"
      className={`flex ${
        orientation === "horizontal"
          ? "flex-row flex-wrap gap-4"
          : "flex-col gap-2.5"
      } ${className}`}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const isDisabled = option.disabled;

        if (cardMode) {
          return (
            <motion.label
              key={option.value}
              whileHover={{ scale: isDisabled ? 1 : scaled.motionConfig.hoverScale }}
              whileTap={{ scale: isDisabled ? 1 : scaled.motionConfig.tapScale }}
              transition={scaled.motionConfig.transition}
              style={{
                borderRadius: `${scaled.scaledRadius}px`,
                borderColor: isSelected
                  ? activeColor
                  : tokens.universalBorderColor,
                borderWidth: `${tokens.borderWidth}px`,
                backgroundColor: isSelected
                  ? `${activeColor}08`
                  : tokens.universalFillColor,
                transition: scaled.transitionStyle,
              }}
              className={`p-3.5 border flex items-start gap-3 cursor-pointer select-none transform-gpu ${
                isDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : isSelected
                  ? "shadow-2xs ring-1"
                  : "hover:border-neutral-400"
              }`}
            >
              <input
                type="radio"
                name={groupName}
                value={option.value}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => !isDisabled && onChange(option.value)}
                className="sr-only"
              />
              {/* Custom Radio Circle */}
              <div
                style={{
                  borderColor: isSelected ? activeColor : tokens.universalBorderColor,
                  borderWidth: "1.5px",
                  transition: scaled.transitionStyle,
                }}
                className="w-4 h-4 rounded-full mt-0.5 shrink-0 flex items-center justify-center bg-white"
              >
                <motion.span
                  initial={false}
                  animate={{ scale: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
                  transition={scaled.motionConfig.transition}
                  style={{ backgroundColor: activeColor }}
                  className="w-2 h-2 rounded-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    style={{ color: tokens.textIconColor }}
                    className="text-xs font-bold truncate"
                  >
                    {option.label}
                  </span>
                  {option.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                      {option.badge}
                    </span>
                  )}
                </div>
                {option.description && (
                  <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                    {option.description}
                  </p>
                )}
              </div>
            </motion.label>
          );
        }

        return (
          <motion.label
            key={option.value}
            whileTap={{ scale: isDisabled ? 1 : scaled.motionConfig.tapScale }}
            transition={scaled.motionConfig.transition}
            className={`flex items-start gap-2.5 cursor-pointer select-none group ${
              isDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <input
              type="radio"
              name={groupName}
              value={option.value}
              checked={isSelected}
              disabled={isDisabled}
              onChange={() => !isDisabled && onChange(option.value)}
              className="sr-only"
            />
            {/* Custom Radio Circle Indicator */}
            <div
              style={{
                borderColor: isSelected ? activeColor : tokens.universalBorderColor,
                borderWidth: "1.5px",
                transition: scaled.transitionStyle,
              }}
              className="w-4 h-4 rounded-full mt-0.5 shrink-0 flex items-center justify-center bg-white group-hover:border-neutral-500"
            >
              <motion.span
                initial={false}
                animate={{ scale: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
                transition={scaled.motionConfig.transition}
                style={{ backgroundColor: activeColor }}
                className="w-2 h-2 rounded-full"
              />
            </div>
            <div className="min-w-0">
              <span
                style={{ color: tokens.textIconColor }}
                className={`text-xs font-medium ${
                  isSelected ? "font-bold" : "text-neutral-700"
                }`}
              >
                {option.label}
              </span>
              {option.description && (
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-tight">
                  {option.description}
                </p>
              )}
            </div>
          </motion.label>
        );
      })}
    </div>
  );
}
