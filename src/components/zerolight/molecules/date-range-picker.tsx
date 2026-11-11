"use client";

import React, { useState, useRef, useEffect } from "react";
import { useZeroLight } from "../context";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, ChevronDown, Check } from "lucide-react";

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DateRangePreset {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
}

const DEFAULT_PRESETS: DateRangePreset[] = [
  { id: "today", label: "Today", startDate: "10 Apr 2026", endDate: "10 Apr 2026" },
  { id: "7d", label: "Last 7 Days", startDate: "03 Apr 2026", endDate: "10 Apr 2026" },
  { id: "30d", label: "Last 30 Days", startDate: "11 Mar 2026", endDate: "10 Apr 2026" },
  { id: "mtd", label: "Month to Date", startDate: "01 Apr 2026", endDate: "10 Apr 2026" },
  { id: "qtd", label: "Quarter to Date", startDate: "01 Jan 2026", endDate: "10 Apr 2026" },
];

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  presets?: DateRangePreset[];
  className?: string;
}

export function DateRangePicker({
  value = { startDate: "03 Apr 2026", endDate: "10 Apr 2026" },
  onChange,
  presets = DEFAULT_PRESETS,
  className = "",
}: DateRangePickerProps) {
  const { tokens, scaled } = useZeroLight();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>(value);
  const [activePresetId, setActivePresetId] = useState<string>("7d");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelectPreset = (preset: DateRangePreset) => {
    setActivePresetId(preset.id);
    const newRange = { startDate: preset.startDate, endDate: preset.endDate };
    setSelectedRange(newRange);
    onChange?.(newRange);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          borderRadius: `${scaled.scaledRadius}px`,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          backgroundColor: tokens.universalFillColor,
          height: `${tokens.heightDensity}px`,
        }}
        className="px-3.5 border flex items-center gap-2.5 text-xs font-semibold text-neutral-800 hover:border-neutral-400 transition-colors shadow-2xs cursor-pointer select-none"
      >
        <CalendarIcon className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
        <span className="tabular-nums font-sans font-medium text-neutral-700">
          {selectedRange.startDate} – {selectedRange.endDate}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-1" />
      </button>

      {/* Floating Preset Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={scaled.motionConfig.spring}
            style={{
              borderRadius: `${scaled.scaledCardRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.universalFillColor,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
            }}
            className="absolute top-full mt-1.5 left-0 z-50 p-3 border w-64 select-none"
          >
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 px-1">
              Select Date Range
            </div>
            <div className="space-y-1">
              {presets.map((preset) => {
                const isActive = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    style={{
                      borderRadius: `${Math.max(4, scaled.scaledRadius - 4)}px`,
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer ${
                      isActive
                        ? "bg-neutral-900 text-white font-bold"
                        : "text-neutral-700 hover:bg-neutral-100 font-medium"
                    }`}
                  >
                    <span>{preset.label}</span>
                    {isActive ? (
                      <Check className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <span className="text-[10px] text-neutral-400 tabular-nums font-sans">
                        {preset.startDate.slice(0, 6)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
