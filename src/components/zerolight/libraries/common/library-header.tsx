"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { useZeroLight } from "../../context";
import { getContrastColor } from "../../types";

export interface LibraryCategoryOption {
  id: string;
  label: string;
  count?: number;
}

export interface LibraryHeaderProps {
  /** Active count text e.g. "16 of 16 Variants Active" or "33 Buttons Active" */
  countText: string;
  /** Subtitle description for the library */
  description?: string;
  /** Current search input value */
  searchQuery: string;
  /** Search change handler */
  onSearchChange: (value: string) => void;
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Optional quick action slot on the right (e.g. Launch Command Bar, Guides toggle, Restore Hidden) */
  action?: React.ReactNode;
  /** Optional category filter pills */
  categories?: LibraryCategoryOption[];
  /** Currently active category id */
  activeCategory?: string;
  /** Category selection handler */
  onCategoryChange?: (id: string) => void;
}

export interface LibrarySegmentControlProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  formatLabel?: (value: T) => string;
}

/** Shared ZeroLight segmented pill toggle with automatic YIQ active text contrast. */
export function LibrarySegmentControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  formatLabel,
}: LibrarySegmentControlProps<T>) {
  const { tokens, scaled } = useZeroLight();
  const primColor = tokens.primaryButtonColor || "#0F172A";
  const primText = getContrastColor(primColor);

  return (
    <div
      className="inline-flex items-center p-0.5 border"
      style={{
        borderRadius: `${scaled.scaledRadius}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${Math.min(tokens.borderWidth, 1)}px`,
        backgroundColor: tokens.universalFillColor,
      }}
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((opt) => {
        const isActive = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="px-2 py-1 text-[11px] font-semibold capitalize font-sans tabular-nums transition cursor-pointer"
            style={{
              borderRadius: `${Math.max(4, scaled.scaledRadius - 2)}px`,
              backgroundColor: isActive ? primColor : "transparent",
              color: isActive ? primText : tokens.textIconColor,
              opacity: isActive ? 1 : 0.72,
            }}
          >
            {formatLabel ? formatLabel(opt) : opt}
          </button>
        );
      })}
    </div>
  );
}

export function LibraryHeader({
  countText,
  description,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search variants...",
  action,
  categories,
  activeCategory = "all",
  onCategoryChange,
}: LibraryHeaderProps) {
  const { tokens, scaled } = useZeroLight();
  const primColor = tokens.primaryButtonColor || "#0F172A";
  const primText = getContrastColor(primColor);

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledCardRadius}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: tokens.universalFillColor,
      }}
      className="relative z-10 border px-4 sm:px-5 py-3 mb-6 transition-colors shadow-2xs space-y-2.5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left: Summary Counter & Description */}
        <div className="flex items-center gap-2 min-w-0">
          <span
            style={{ borderRadius: `${scaled.scaledRadius === 0 ? 0 : 9999}px` }}
            className="text-xs font-semibold px-2.5 py-0.5 bg-zinc-100 text-zinc-700 font-sans tabular-nums border border-zinc-200/60 shrink-0"
          >
            {countText}
          </span>
          {description && (
            <span className="text-xs text-zinc-500 hidden sm:inline truncate" title={description}>
              {description}
            </span>
          )}
        </div>

        {/* Right: Search & Action Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ borderRadius: `${scaled.scaledRadius}px`, borderColor: tokens.universalBorderColor }}
              className="w-full pl-8 pr-7 py-1.5 bg-zinc-100 border text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>

      {/* Category Filter Pill Strip */}
      {categories && categories.length > 0 && onCategoryChange && (
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-zinc-100 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                style={{
                  borderRadius: `${scaled.scaledRadius === 0 ? 0 : 9999}px`,
                  backgroundColor: isActive ? primColor : undefined,
                  color: isActive ? primText : undefined,
                }}
                className={`px-2.5 py-1 text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? "shadow-2xs"
                    : "bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/70"
                }`}
              >
                <span>{cat.label}</span>
                {cat.count !== undefined && (
                  <span className={`text-[10px] tabular-nums ${isActive ? "opacity-80" : "text-zinc-400"}`}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
