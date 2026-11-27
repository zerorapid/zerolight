"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useZeroLight } from "../context";

export interface VirtualGridColumn<T> {
  key: keyof T | string;
  header: string;
  width?: number;
  align?: "left" | "right";
  render?: (row: T) => React.ReactNode;
}

export interface VirtualDataGridProps<T extends Record<string, unknown>> {
  rows: T[];
  columns: VirtualGridColumn<T>[];
  rowHeight?: number;
  viewportHeight?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
}

/**
 * Windowed virtualized data grid for rendering 10,000+ enterprise records smoothly at 60fps.
 */
export function VirtualDataGrid<T extends Record<string, unknown>>({
  rows,
  columns,
  rowHeight = 40,
  viewportHeight = 360,
  searchable = true,
  searchPlaceholder = "Filter records...",
  className = "",
}: VirtualDataGridProps<T>) {
  const { tokens, scaled } = useZeroLight();
  const [scrollTop, setScrollTop] = useState(0);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(q))
    );
  }, [rows, query]);

  const overscan = 5;
  const totalHeight = filtered.length * rowHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const visibleCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2;
  const endIndex = Math.min(filtered.length, startIndex + visibleCount);
  const visibleRows = filtered.slice(startIndex, endIndex);

  return (
    <div
      style={{
        backgroundColor: tokens.universalFillColor,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
        borderStyle: "solid",
        borderRadius: `${scaled.scaledCardRadius}px`,
        boxShadow: scaled.cardShadow,
        color: tokens.textIconColor,
        fontFamily: scaled.resolvedFontFamily,
      }}
      className={`overflow-hidden ${className}`}
    >
      {searchable && (
        <div
          style={{ borderColor: tokens.universalBorderColor }}
          className="flex items-center justify-between gap-2 px-4 py-2.5 border-b"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Search className="w-3.5 h-3.5 opacity-55 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setScrollTop(0);
              }}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-xs focus:outline-none"
            />
          </div>
          <span className="text-[11px] opacity-60 font-sans tabular-nums shrink-0">
            {filtered.length.toLocaleString()} rows
          </span>
        </div>
      )}

      <div
        style={{ backgroundColor: tokens.hoverBackplateTint, borderColor: tokens.universalBorderColor }}
        className="flex items-center border-b text-[11px] font-semibold uppercase tracking-wider opacity-75 px-4 py-2"
      >
        {columns.map((c) => (
          <div
            key={String(c.key)}
            style={c.width ? { width: `${c.width}px` } : undefined}
            className={`${c.width ? "shrink-0" : "flex-1 min-w-0"} ${c.align === "right" ? "text-right" : "text-left"} truncate px-2`}
          >
            {c.header}
          </div>
        ))}
      </div>

      <div
        style={{ height: `${viewportHeight}px` }}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        className="overflow-y-auto relative"
      >
        <div style={{ height: `${totalHeight}px`, position: "relative" }}>
          {visibleRows.map((row, idx) => {
            const actualIndex = startIndex + idx;
            return (
              <div
                key={actualIndex}
                style={{
                  position: "absolute",
                  top: `${actualIndex * rowHeight}px`,
                  height: `${rowHeight}px`,
                  left: 0,
                  right: 0,
                  borderColor: tokens.universalBorderColor,
                }}
                className="flex items-center border-b px-4 text-xs"
              >
                {columns.map((c) => (
                  <div
                    key={String(c.key)}
                    style={c.width ? { width: `${c.width}px` } : undefined}
                    className={`${c.width ? "shrink-0" : "flex-1 min-w-0"} ${c.align === "right" ? "text-right" : "text-left"} font-sans tabular-nums truncate px-2`}
                  >
                    {c.render ? c.render(row) : String(row[c.key as keyof T] ?? "")}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
