"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../atoms/button";

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

            {/* Field */}
            <select
              defaultValue={cond.field}
              className="bg-neutral-100 border border-neutral-200 text-xs rounded px-2.5 py-1.5 font-medium outline-none text-neutral-800"
            >
              <option value="region">Region</option>
              <option value="status">Status</option>
              <option value="role">Role</option>
              <option value="latency">Latency</option>
            </select>

            {/* Operator */}
            <select
              defaultValue={cond.operator}
              className="bg-neutral-100 border border-neutral-200 text-xs rounded px-2.5 py-1.5 font-medium outline-none text-neutral-800"
            >
              <option value="equals">equals</option>
              <option value="not_equals">does not equal</option>
              <option value="in">is in</option>
              <option value="less_than">less than</option>
            </select>

            {/* Value */}
            <input
              type="text"
              defaultValue={cond.value}
              className="bg-neutral-50 border border-neutral-200 text-xs rounded px-2.5 py-1.5 font-medium outline-none text-neutral-800 flex-1 min-w-[120px]"
            />

            {/* Remove */}
            <button
              type="button"
              onClick={() => removeClause(cond.id)}
              className="p-1.5 text-neutral-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
              aria-label="Remove filter rule"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Clause Button */}
      <Button variant="outline" size="sm" iconLeft={<Plus className="w-3.5 h-3.5" />} onClick={addClause}>
        Add filter rule
      </Button>
    </div>
  );
}
