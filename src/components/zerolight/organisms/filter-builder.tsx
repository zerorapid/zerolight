"use client";

import React, { useState, useRef, useEffect } from "react";
import { useZeroLight } from "../context";
import { Plus, Trash2, ChevronDown, Check } from "lucide-react";
import { Button } from "../atoms/button";
import { motion, AnimatePresence } from "framer-motion";

export interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export interface FilterBuilderProps {
  conditions?: FilterCondition[];
  onChange?: (conditions: FilterCondition[]) => void;
  className?: string;
}

const FIELD_OPTIONS = [
  { value: "region", label: "Region" },
  { value: "status", label: "Status" },
  { value: "role", label: "Role" },
  { value: "latency", label: "Latency" },
];

const OPERATOR_OPTIONS = [
  { value: "equals", label: "equals" },
  { value: "not_equals", label: "does not equal" },
  { value: "in", label: "is in" },
  { value: "less_than", label: "less than" },
];

function FilterDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
}) {
  const { tokens, scaled } = useZeroLight();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const selectedOpt = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          borderRadius: `${scaled.scaledInnerRadius === 0 ? 0 : 6}px`,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          backgroundColor: scaled.effectiveInputFill,
          color: tokens.textIconColor,
          transition: scaled.transitionStyle,
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border cursor-pointer shadow-2xs hover:bg-neutral-50"
      >
        <span>{selectedOpt.label}</span>
        <ChevronDown
          size={12}
          strokeWidth={tokens.iconStrokeWidth || 1.75}
          color={tokens.iconColor || tokens.textIconColor}
          className={`transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            style={{
              borderRadius: `${scaled.scaledMenuRadius === 0 ? 0 : 8}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.universalFillColor,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
            }}
            className="absolute left-0 top-full mt-1 z-50 min-w-[120px] p-1 border overflow-hidden"
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
                    borderRadius: `${scaled.scaledInnerRadius === 0 ? 0 : 4}px`,
                    backgroundColor: isSelected ? tokens.hoverBackplateTint : "transparent",
                    color: isSelected ? tokens.primaryButtonColor : tokens.textIconColor,
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium cursor-pointer text-left transition-colors hover:bg-neutral-100 ${
                    isSelected ? "font-semibold" : ""
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <Check
                      size={12}
                      strokeWidth={2.5}
                      color={tokens.primaryButtonColor}
                      className="shrink-0 ml-1.5"
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const DEFAULT_CONDITIONS: FilterCondition[] = [
  { id: "c1", field: "region", operator: "equals", value: "us-east-1" },
  { id: "c2", field: "status", operator: "in", value: "healthy, syncing" },
  { id: "c3", field: "latency", operator: "less_than", value: "50ms" },
];

export function FilterBuilder({
  conditions: initialConditions = DEFAULT_CONDITIONS,
  onChange,
  className = "",
}: FilterBuilderProps) {
  const { tokens, scaled } = useZeroLight();
  const [conditions, setConditions] = useState<FilterCondition[]>(initialConditions);
  const [logic, setLogic] = useState<"AND" | "OR">("AND");

  const addClause = () => {
    const newCond: FilterCondition = {
      id: `c_${Date.now()}`,
      field: "role",
      operator: "equals",
      value: "Worker",
    };
    const updated = [...conditions, newCond];
    setConditions(updated);
    onChange?.(updated);
  };

  const removeClause = (id: string) => {
    const updated = conditions.filter((c) => c.id !== id);
    setConditions(updated);
    onChange?.(updated);
  };

  const updateClause = (id: string, updates: Partial<FilterCondition>) => {
    const updated = conditions.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setConditions(updated);
    onChange?.(updated);
  };

  return (
    <div className={`space-y-3 w-full ${className}`}>
      {/* Logic Operator Pill */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-neutral-400">Match rules:</span>
        <div
          style={{
            borderRadius: `${scaled.scaledPillRadius}px`,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            backgroundColor: tokens.hoverBackplateTint,
          }}
          className="inline-flex p-0.5 border"
        >
          {(["AND", "OR"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLogic(l)}
              style={{
                borderRadius: `${scaled.scaledPillRadius}px`,
                backgroundColor: logic === l ? tokens.primaryButtonColor : "transparent",
                color: logic === l ? scaled.primaryActionTextColor : tokens.textIconColor,
              }}
              className="px-2.5 py-0.5 text-xs font-semibold cursor-pointer"
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Conditions Rows */}
      <div className="space-y-2">
        {conditions.map((cond, idx) => (
          <div
            key={cond.id}
            style={{
              borderRadius: `${scaled.scaledRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.universalFillColor,
            }}
            className="flex flex-wrap items-center gap-2 p-2.5 border"
          >
            <span className="text-[11px] font-bold text-neutral-400 w-6 text-center tabular-nums">
              {idx + 1}
            </span>

            {/* Field Dropdown */}
            <FilterDropdown
              value={cond.field}
              options={FIELD_OPTIONS}
              onChange={(val) => updateClause(cond.id, { field: val })}
            />

            {/* Operator Dropdown */}
            <FilterDropdown
              value={cond.operator}
              options={OPERATOR_OPTIONS}
              onChange={(val) => updateClause(cond.id, { operator: val })}
            />

            {/* Value Input */}
            <input
              type="text"
              value={cond.value}
              onChange={(e) => updateClause(cond.id, { value: e.target.value })}
              style={{
                borderRadius: `${scaled.scaledInnerRadius === 0 ? 0 : 6}px`,
                borderColor: tokens.universalBorderColor,
                borderWidth: `${tokens.borderWidth}px`,
                backgroundColor: scaled.effectiveInputFill,
                color: tokens.textIconColor,
                transition: scaled.transitionStyle,
              }}
              className="border text-xs px-2.5 py-1.5 font-medium outline-none flex-1 min-w-[120px] focus:ring-1 focus:ring-black/10"
              placeholder="Filter value..."
            />

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => removeClause(cond.id)}
              className="p-1.5 text-neutral-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
              aria-label="Remove filter rule"
            >
              <Trash2
                size={scaled.iconSmSize || 14}
                strokeWidth={tokens.iconStrokeWidth || 1.75}
                color={tokens.iconColor || tokens.textIconColor}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Add Clause Button */}
      <Button
        variant="outline"
        size="sm"
        iconLeft={
          <Plus
            size={scaled.iconSmSize || 14}
            strokeWidth={tokens.iconStrokeWidth || 1.75}
          />
        }
        onClick={addClause}
      >
        Add filter rule
      </Button>
    </div>
  );
}
