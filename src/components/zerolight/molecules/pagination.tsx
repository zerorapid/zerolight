"use client";

import React from "react";
import { useZeroLight } from "../context";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  itemNoun?: string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalItems,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50],
  onPageChange,
  onPageSizeChange,
  itemNoun = "items",
  className = "",
}: PaginationProps) {
  const { tokens, scaled } = useZeroLight();

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  const getVisiblePages = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 w-full select-none text-xs ${className}`}
    >
      {/* Range text & Page Size Dropdown */}
      <div className="flex items-center gap-3">
        <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 tabular-nums">
          Showing <strong className="text-neutral-900 font-bold">{startItem}–{endItem}</strong> of{" "}
          <strong className="text-neutral-900 font-bold">{totalItems}</strong> {itemNoun}
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-neutral-200">
            <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">
              Per page:
            </span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              style={{
                borderRadius: `${scaled.scaledInnerRadius === 0 ? 0 : 6}px`,
                borderColor: tokens.universalBorderColor,
                borderWidth: `${tokens.borderWidth}px`,
                backgroundColor: tokens.universalFillColor,
                fontSize: `${scaled.sublabelFontSize}px`,
                color: tokens.textIconColor,
              }}
              className="py-1 px-2 border outline-none font-semibold cursor-pointer"
            >
              {pageSizeOptions.map((sz) => (
                <option key={sz} value={sz}>
                  {sz}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page Numbers & Direction Controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          style={{
            borderRadius: `${scaled.scaledPillRadius}px`,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            backgroundColor: tokens.universalFillColor,
            transition: scaled.transitionStyle,
          }}
          className={`p-1.5 border flex items-center justify-center ${
            currentPage <= 1
              ? "opacity-30 cursor-not-allowed"
              : "cursor-pointer hover:bg-neutral-100 text-neutral-700"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {getVisiblePages().map((page, idx) => {
          if (page === "ellipsis") {
            return (
              <span key={`ell-${idx}`} className="px-1 text-neutral-400 font-bold">
                …
              </span>
            );
          }

          const isSelected = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              style={{
                borderRadius: `${scaled.scaledPillRadius}px`,
                backgroundColor: isSelected ? tokens.primaryButtonColor : "transparent",
                color: isSelected ? scaled.primaryActionTextColor : tokens.textIconColor,
                transition: "background-color 0.15s ease, color 0.15s ease",
              }}
              className={`min-w-[28px] h-7 px-2 font-semibold tabular-nums text-xs cursor-pointer flex items-center justify-center ${
                isSelected ? "shadow-xs font-bold" : "hover:bg-neutral-100"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          style={{
            borderRadius: `${scaled.scaledPillRadius}px`,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            backgroundColor: tokens.universalFillColor,
            transition: scaled.transitionStyle,
          }}
          className={`p-1.5 border flex items-center justify-center ${
            currentPage >= totalPages
              ? "opacity-30 cursor-not-allowed"
              : "cursor-pointer hover:bg-neutral-100 text-neutral-700"
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
