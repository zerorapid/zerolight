"use client";

import React, { useState, useMemo } from "react";
import { useZeroLight } from "../context";
import { Checkbox } from "../atoms/checkbox";
import { ChevronRight, ChevronLeft, Search, X } from "lucide-react";
import { motion } from "framer-motion";

export interface TransferItem {
  id: string;
  label: string;
  description?: string;
  badge?: string;
  disabled?: boolean;
}

export interface TransferProps {
  dataSource: TransferItem[];
  targetKeys: string[];
  onChange: (nextTargetKeys: string[], direction: "left" | "right", moveKeys: string[]) => void;
  titles?: [string, string];
  showSearch?: boolean;
  searchPlaceholder?: string;
  className?: string;
}

export function Transfer({
  dataSource,
  targetKeys,
  onChange,
  titles = ["Available Permissions", "Assigned Roles"],
  showSearch = true,
  searchPlaceholder = "Filter items...",
  className = "",
}: TransferProps) {
  const { tokens, scaled } = useZeroLight();
  const [sourceSelected, setSourceSelected] = useState<string[]>([]);
  const [targetSelected, setTargetSelected] = useState<string[]>([]);
  const [sourceQuery, setSourceQuery] = useState("");
  const [targetQuery, setTargetQuery] = useState("");

  const targetKeySet = useMemo(() => new Set(targetKeys), [targetKeys]);

  const sourceItems = useMemo(
    () =>
      dataSource.filter(
        (item) =>
          !targetKeySet.has(item.id) &&
          (!sourceQuery ||
            item.label.toLowerCase().includes(sourceQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(sourceQuery.toLowerCase()))
      ),
    [dataSource, targetKeySet, sourceQuery]
  );

  const targetItems = useMemo(
    () =>
      dataSource.filter(
        (item) =>
          targetKeySet.has(item.id) &&
          (!targetQuery ||
            item.label.toLowerCase().includes(targetQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(targetQuery.toLowerCase()))
      ),
    [dataSource, targetKeySet, targetQuery]
  );

  // Move right (Available -> Assigned)
  const moveToTarget = () => {
    if (sourceSelected.length === 0) return;
    const nextKeys = Array.from(new Set([...targetKeys, ...sourceSelected]));
    onChange(nextKeys, "right", sourceSelected);
    setSourceSelected([]);
  };

  // Move left (Assigned -> Available)
  const moveToSource = () => {
    if (targetSelected.length === 0) return;
    const removeSet = new Set(targetSelected);
    const nextKeys = targetKeys.filter((k) => !removeSet.has(k));
    onChange(nextKeys, "left", targetSelected);
    setTargetSelected([]);
  };

  const renderPanel = (
    title: string,
    items: TransferItem[],
    selectedIds: string[],
    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>,
    query: string,
    setQuery: (q: string) => void
  ) => {
    const enabledItems = items.filter((i) => !i.disabled);
    const selectedSet = new Set(selectedIds);
    const checkedCount = enabledItems.filter((i) => selectedSet.has(i.id)).length;
    const allChecked = enabledItems.length > 0 && checkedCount === enabledItems.length;
    const isIndeterminate = checkedCount > 0 && checkedCount < enabledItems.length;

    const handleToggleAll = () => {
      if (allChecked) {
        const currentIds = new Set(enabledItems.map((i) => i.id));
        setSelectedIds((prev) => prev.filter((id) => !currentIds.has(id)));
      } else {
        const nextIds = Array.from(new Set([...selectedIds, ...enabledItems.map((i) => i.id)]));
        setSelectedIds(nextIds);
      }
    };

    const handleToggleItem = (id: string) => {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    };

    return (
      <div
        style={{
          borderRadius: `${scaled.scaledCardRadius}px`,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          backgroundColor: tokens.universalFillColor,
        }}
        className="border flex flex-col overflow-hidden h-[300px] shadow-2xs"
      >
        {/* Panel Header */}
        <div
          style={{
            borderColor: tokens.universalBorderColor,
            borderBottomWidth: `${tokens.borderWidth}px`,
            backgroundColor: tokens.hoverBackplateTint,
          }}
          className="px-3.5 py-2.5 border-b flex items-center justify-between gap-2 shrink-0"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Checkbox
              checked={allChecked}
              indeterminate={isIndeterminate}
              disabled={enabledItems.length === 0}
              onChange={handleToggleAll}
            />
            <span
              style={{ color: tokens.textIconColor }}
              className="text-xs font-semibold truncate"
            >
              {title}
            </span>
          </div>
          <span className="text-[11px] font-medium text-neutral-500 tabular-nums font-sans shrink-0">
            {checkedCount > 0 ? `${checkedCount} / ` : ""}
            {items.length}
          </span>
        </div>

        {/* Search Input */}
        {showSearch && (
          <div
            style={{
              borderColor: tokens.universalBorderColor,
              borderBottomWidth: `${tokens.borderWidth}px`,
            }}
            className="px-3 py-2 border-b flex items-center gap-2 shrink-0"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              style={{ color: tokens.textIconColor }}
              className="w-full text-xs bg-transparent outline-none font-medium placeholder:text-neutral-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                aria-label="Clear filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
          {items.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-neutral-400 font-medium px-4 text-center">
              {query ? "No matching records" : "No items in this bucket"}
            </div>
          ) : (
            items.map((item) => {
              const isChecked = selectedSet.has(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => !item.disabled && handleToggleItem(item.id)}
                  style={{
                    borderRadius: `${scaled.scaledOptionRadius}px`,
                    backgroundColor: isChecked ? tokens.hoverBackplateTint : "transparent",
                  }}
                  className={`px-2.5 py-2 flex items-center justify-between gap-2 transition-colors ${
                    item.disabled
                      ? "opacity-45 cursor-not-allowed"
                      : "cursor-pointer hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div className="pt-0.5 pointer-events-none">
                      <Checkbox checked={isChecked} disabled={item.disabled} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        style={{ color: tokens.textIconColor }}
                        className="text-xs font-medium truncate"
                      >
                        {item.label}
                      </div>
                      {item.description && (
                        <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      style={{ borderRadius: `${scaled.scaledPillRadius}px` }}
                      className="text-[10px] font-semibold px-2 py-0.5 bg-neutral-100 text-neutral-600 border border-neutral-200 shrink-0"
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const canMoveRight = sourceSelected.length > 0;
  const canMoveLeft = targetSelected.length > 0;

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch gap-3 w-full select-none ${className}`}
    >
      {/* Left: Available Pool */}
      {renderPanel(
        titles[0],
        sourceItems,
        sourceSelected,
        setSourceSelected,
        sourceQuery,
        setSourceQuery
      )}

      {/* Center: Action Shuttle Controls */}
      <div className="flex md:flex-col items-center justify-center gap-2 py-1">
        <motion.button
          type="button"
          disabled={!canMoveRight}
          whileTap={{ scale: canMoveRight ? scaled.motionConfig.tapScale : 1 }}
          transition={scaled.motionConfig.spring}
          onClick={moveToTarget}
          style={{
            borderRadius: `${scaled.scaledRadius}px`,
            backgroundColor: canMoveRight ? tokens.primaryButtonColor : tokens.hoverBackplateTint,
            color: canMoveRight ? scaled.primaryActionTextColor : "#A1A1AA",
            borderColor: canMoveRight ? tokens.primaryButtonColor : tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
          }}
          className={`w-9 h-9 flex items-center justify-center border transition-colors ${
            canMoveRight ? "cursor-pointer shadow-xs hover:opacity-90" : "cursor-not-allowed opacity-60"
          }`}
          aria-label="Move selected to assigned"
          title="Move to assigned"
        >
          <ChevronRight className="w-4 h-4 md:rotate-0 rotate-90" />
        </motion.button>

        <motion.button
          type="button"
          disabled={!canMoveLeft}
          whileTap={{ scale: canMoveLeft ? scaled.motionConfig.tapScale : 1 }}
          transition={scaled.motionConfig.spring}
          onClick={moveToSource}
          style={{
            borderRadius: `${scaled.scaledRadius}px`,
            backgroundColor: canMoveLeft ? tokens.primaryButtonColor : tokens.hoverBackplateTint,
            color: canMoveLeft ? scaled.primaryActionTextColor : "#A1A1AA",
            borderColor: canMoveLeft ? tokens.primaryButtonColor : tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
          }}
          className={`w-9 h-9 flex items-center justify-center border transition-colors ${
            canMoveLeft ? "cursor-pointer shadow-xs hover:opacity-90" : "cursor-not-allowed opacity-60"
          }`}
          aria-label="Move selected back to available"
          title="Move back to available"
        >
          <ChevronLeft className="w-4 h-4 md:rotate-0 rotate-90" />
        </motion.button>
      </div>

      {/* Right: Assigned Pool */}
      {renderPanel(
        titles[1],
        targetItems,
        targetSelected,
        setTargetSelected,
        targetQuery,
        setTargetQuery
      )}
    </div>
  );
}
