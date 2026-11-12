"use client";

import React, { useId, useState } from "react";
import { motion } from "framer-motion";
import { useZeroLight } from "../context";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  content?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  variant?: "underline" | "pills";
  className?: string;
}

/**
 * Underline and pill-style Tabs with Framer Motion spring indicator bound to ZeroLight motionConfig.
 */
export function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  variant = "underline",
  className = "",
}: TabsProps) {
  const { tokens, scaled } = useZeroLight();
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue ?? items[0]?.id ?? ""
  );
  const indicatorId = useId();
  const activeId = value ?? internalValue;

  const handleSelect = (id: string, disabled?: boolean) => {
    if (disabled) return;
    if (value === undefined) setInternalValue(id);
    onChange?.(id);
  };

  const activeItem = items.find((i) => i.id === activeId);

  return (
    <div className={`w-full font-sans ${className}`}>
      <div
        role="tablist"
        style={{
          borderColor: variant === "underline" ? tokens.universalBorderColor : undefined,
          backgroundColor: variant === "pills" ? tokens.hoverBackplateTint : undefined,
          borderRadius: variant === "pills" ? `${scaled.scaledPillRadius}px` : undefined,
        }}
        className={
          variant === "underline"
            ? "flex items-center gap-1 border-b overflow-x-auto scrollbar-none"
            : "inline-flex items-center gap-1 p-1 overflow-x-auto scrollbar-none"
        }
      >
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={item.disabled}
              onClick={() => handleSelect(item.id, item.disabled)}
              style={{
                color: isActive
                  ? variant === "pills"
                    ? scaled.primaryActionTextColor
                    : tokens.textIconColor
                  : tokens.textIconColor,
                fontSize: `${scaled.sublabelFontSize}px`,
              }}
              className={`relative px-3.5 py-2 font-medium inline-flex items-center gap-2 whitespace-nowrap transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isActive ? "opacity-100 font-semibold" : "opacity-60 hover:opacity-90"
              }`}
            >
              {isActive && variant === "pills" && (
                <motion.span
                  layoutId={`zl-tab-pill-${indicatorId}`}
                  transition={scaled.motionConfig.pillTransition}
                  style={{
                    backgroundColor: tokens.primaryButtonColor,
                    borderRadius: `${scaled.scaledPillRadius}px`,
                  }}
                  className="absolute inset-0 z-0"
                />
              )}

              <span className="relative z-10 inline-flex items-center gap-1.5">
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    style={{
                      backgroundColor: isActive
                        ? variant === "pills"
                          ? "rgba(255,255,255,0.2)"
                          : tokens.hoverBackplateTint
                        : tokens.hoverBackplateTint,
                    }}
                    className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold tabular-nums"
                  >
                    {item.badge}
                  </span>
                )}
              </span>

              {isActive && variant === "underline" && (
                <motion.span
                  layoutId={`zl-tab-line-${indicatorId}`}
                  transition={scaled.motionConfig.pillTransition}
                  style={{ backgroundColor: tokens.primaryButtonColor }}
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {activeItem?.content !== undefined && (
        <div role="tabpanel" className="mt-4">
          {activeItem.content}
        </div>
      )}
    </div>
  );
}
