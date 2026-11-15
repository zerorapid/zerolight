"use client";

import React from "react";
import { Search, X } from "lucide-react";

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
}

export function LibraryHeader({
  countText,
  description,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search variants...",
  action,
}: LibraryHeaderProps) {
  return (
    <div className="sticky top-0 z-20 backdrop-blur-md bg-white/90 dark:bg-[#09090B]/90 border-b border-zinc-200/80 dark:border-white/10 -mx-6 px-6 py-2.5 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left: Summary Counter & Description */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-sans tabular-nums border border-zinc-200/60 dark:border-white/5">
            {countText}
          </span>
          {description && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">
              {description}
            </span>
          )}
        </div>

        {/* Right: Search & Action Controls */}
        <div className="flex items-center gap-2 text-xs">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-white/20 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
    </div>
  );
}
