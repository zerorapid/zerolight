"use client";

import React, { useState, useRef, useEffect } from "react";
import { useZeroLight } from "../context";
import { ChevronLeft, ChevronRight, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsPageSizeOpen(false);
      }
    };
    if (isPageSizeOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isPageSizeOpen]);

  // Generate page numbers with ellipsis
  const getVisiblePages = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
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
          <div ref={dropdownRef} className="relative flex items-center gap-1.5 pl-2 border-l border-neutral-200">
            <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">
              Per page:
            </span>
            <button
              type="button"
              onClick={() => setIsPageSizeOpen((prev) => !prev)}
              style={{
                borderRadius: `${scaled.scaledInnerRadius === 0 ? 0 : 6}px`,
                borderColor: tokens.universalBorderColor,
                borderWidth: `${tokens.borderWidth}px`,
                backgroundColor: tokens.universalFillColor,
                fontSize: `${scaled.sublabelFontSize}px`,
                color: tokens.textIconColor,
                transition: scaled.transitionStyle,
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 border font-semibold cursor-pointer shadow-2xs hover:bg-neutral-50"
              aria-haspopup="listbox"
              aria-expanded={isPageSizeOpen}
            >
              <span className="tabular-nums">{pageSize}</span>
              <ChevronDown
                size={12}
                strokeWidth={tokens.iconStrokeWidth || 1.75}
                color={tokens.iconColor || tokens.textIconColor}
                className={`transition-transform duration-200 ${isPageSizeOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Custom Token-Reactive Dropdown Menu */}
            <AnimatePresence>
              {isPageSizeOpen && (
                <motion.div
                  initial={scaled.motionConfig.popover.initial}
                  animate={scaled.motionConfig.popover.animate}
                  exit={scaled.motionConfig.popover.exit}
                  transition={scaled.motionConfig.popover.transition}
                  style={{
                    borderRadius: `${scaled.scaledMenuRadius === 0 ? 0 : 8}px`,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    backgroundColor: tokens.universalFillColor,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                  }}
                  className="absolute left-16 bottom-full mb-1 z-50 min-w-[70px] p-1 border overflow-hidden"
                  role="listbox"
                >
                  {pageSizeOptions.map((sz) => {
                    const isSelected = sz === pageSize;
                    return (
                      <button
                        key={sz}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onPageSizeChange(sz);
                          setIsPageSizeOpen(false);
                        }}
                        style={{
                          borderRadius: `${scaled.scaledInnerRadius === 0 ? 0 : 4}px`,
                          backgroundColor: isSelected ? tokens.hoverBackplateTint : "transparent",
                          color: isSelected ? tokens.primaryButtonColor : tokens.textIconColor,
                          fontSize: `${scaled.sublabelFontSize}px`,
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1 font-semibold cursor-pointer text-left transition-colors hover:bg-neutral-100 ${
                          isSelected ? "font-bold" : ""
                        }`}
                      >
                        <span className="tabular-nums">{sz}</span>
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
          className={`p-1.5 border flex items-center justify-center transition-all ${
            currentPage <= 1
              ? "opacity-30 cursor-not-allowed text-neutral-400"
              : "hover:bg-neutral-100 text-neutral-700 cursor-pointer shadow-2xs"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft
            size={scaled.iconSmSize || 16}
            strokeWidth={tokens.iconStrokeWidth || 1.75}
            color={tokens.iconColor || tokens.textIconColor}
          />
        </button>

        {getVisiblePages().map((p, idx) => {
          if (p === "ellipsis") {
            return (
              <span key={`ell-${idx}`} className="px-2 text-neutral-400 font-medium select-none">
                …
              </span>
            );
          }
          const isSelected = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              style={{
                borderRadius: `${scaled.scaledPillRadius}px`,
                borderColor: isSelected ? tokens.primaryButtonColor : tokens.universalBorderColor,
                borderWidth: `${tokens.borderWidth}px`,
                backgroundColor: isSelected ? tokens.primaryButtonColor : tokens.universalFillColor,
                color: isSelected ? scaled.primaryActionTextColor : tokens.textIconColor,
                fontSize: `${scaled.sublabelFontSize}px`,
                transition: scaled.transitionStyle,
              }}
              className={`min-w-[28px] h-7 px-2 flex items-center justify-center font-bold tabular-nums cursor-pointer ${
                isSelected ? "shadow-2xs" : "hover:bg-neutral-100"
              }`}
            >
              {p}
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
          className={`p-1.5 border flex items-center justify-center transition-all ${
            currentPage >= totalPages
              ? "opacity-30 cursor-not-allowed text-neutral-400"
              : "hover:bg-neutral-100 text-neutral-700 cursor-pointer shadow-2xs"
          }`}
          aria-label="Next page"
        >
          <ChevronRight
            size={scaled.iconSmSize || 16}
            strokeWidth={tokens.iconStrokeWidth || 1.75}
            color={tokens.iconColor || tokens.textIconColor}
          />
        </button>
      </div>
    </div>
  );
}
