"use client";

import React, { useState, useRef, useEffect } from "react";
import { useZeroLight } from "../context";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface SelectOption {
  value: string;
  label: string;
  badge?: string;
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
  id?: string;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option...",
  id,
  className = "",
}: SelectProps) {
  const { tokens, scaled } = useZeroLight();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOpt = options.find((o) => o.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className={`space-y-1.5 relative w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }}
          className="block font-medium"
        >
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          borderRadius: `${scaled.scaledRadius}px`,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          backgroundColor: scaled.effectiveInputFill,
          height: `${scaled.scaledHeight}px`,
          paddingLeft: `${scaled.scaledPaddingX}px`,
          paddingRight: `${scaled.scaledPaddingX}px`,
          transition: scaled.transitionStyle,
        }}
        className="w-full flex items-center justify-between border cursor-pointer select-none text-left"
      >
        <span
          style={{
            fontSize: `${scaled.scaledFontSize}px`,
            color: selectedOpt ? tokens.textIconColor : "#A1A1AA",
          }}
          className="font-medium truncate"
        >
          {selectedOpt ? selectedOpt.label : placeholder}
        </span>
        <ChevronDown
          size={scaled.iconSmSize || 16}
          strokeWidth={tokens.iconStrokeWidth || 1.75}
          color={tokens.iconColor || tokens.textIconColor}
          className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            style={{
              borderRadius: `${scaled.scaledMenuRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.universalFillColor,
              top: `calc(100% + ${tokens.menuOffsetGap}px)`,
            }}
            className="absolute left-0 right-0 z-50 p-1 border shadow-xl max-h-60 overflow-y-auto space-y-0.5"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  style={{
                    borderRadius: `${scaled.scaledOptionRadius}px`,
                    fontSize: `${scaled.scaledFontSize}px`,
                    color: tokens.textIconColor,
                  }}
                  className={`w-full px-3 py-2 flex items-center justify-between text-left cursor-pointer transition-colors ${
                    isSelected ? "bg-neutral-100 font-semibold" : "hover:bg-neutral-50 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{opt.label}</span>
                    {opt.badge && (
                      <span className="text-[10px] bg-neutral-200 px-1.5 py-0.5 rounded text-neutral-600 font-bold">
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
