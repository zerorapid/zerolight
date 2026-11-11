"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import { useZeroLight } from "../context";
import { ChevronDown, ChevronRight, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface CascaderOption {
  value: string;
  label: string;
  disabled?: boolean;
  children?: CascaderOption[];
}

export interface CascaderProps {
  options: CascaderOption[];
  value: string[];
  onChange: (value: string[], selectedOptions: CascaderOption[]) => void;
  label?: string;
  placeholder?: string;
  separator?: string;
  changeOnSelect?: boolean;
  className?: string;
}

export function Cascader({
  options,
  value,
  onChange,
  label,
  placeholder = "Select cluster / namespace path...",
  separator = " / ",
  changeOnSelect = false,
  className = "",
}: CascaderProps) {
  const { tokens, scaled } = useZeroLight();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activePath, setActivePath] = useState<string[]>(value);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    placement: "top" | "bottom";
  }>({
    top: 0,
    left: 0,
    placement: "bottom",
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setActivePath(value);
    }
  }, [isOpen, value]);

  // Resolve full option objects from value path
  const resolveOptions = useCallback(
    (path: string[]): CascaderOption[] => {
      const resolved: CascaderOption[] = [];
      let currentLevel = options;
      for (const val of path) {
        const found = currentLevel.find((o) => o.value === val);
        if (!found) break;
        resolved.push(found);
        currentLevel = found.children || [];
      }
      return resolved;
    },
    [options]
  );

  const selectedOptions = useMemo(() => resolveOptions(value), [resolveOptions, value]);
  const displayLabel = selectedOptions.map((o) => o.label).join(separator);

  // Build visible columns based on activePath
  const columns = useMemo(() => {
    const cols: CascaderOption[][] = [options];
    let current = options;
    for (const val of activePath) {
      const found = current.find((o) => o.value === val);
      if (found && found.children && found.children.length > 0) {
        cols.push(found.children);
        current = found.children;
      } else {
        break;
      }
    }
    return cols;
  }, [options, activePath]);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const margin = tokens.menuOffsetGap || 6;
    const estimatedHeight = 260;
    const estimatedWidth = Math.max(rect.width, columns.length * 180);
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let placement: "top" | "bottom" = "bottom";
    let top = rect.bottom + margin;

    if (
      rect.bottom + estimatedHeight > viewportHeight - 16 &&
      rect.top - estimatedHeight > 16
    ) {
      placement = "top";
      top = rect.top - margin;
    }

    let left = rect.left;
    if (left + estimatedWidth > viewportWidth - 12) {
      left = Math.max(12, viewportWidth - estimatedWidth - 12);
    }

    setCoords({ top, left, placement });
  }, [columns.length, tokens.menuOffsetGap]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("scroll", calculatePosition, true);
      window.addEventListener("resize", calculatePosition);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", calculatePosition, true);
      window.removeEventListener("resize", calculatePosition);
    };
  }, [isOpen, calculatePosition]);

  const handleSelectOption = (option: CascaderOption, levelIndex: number) => {
    if (option.disabled) return;
    const nextPath = [...activePath.slice(0, levelIndex), option.value];
    setActivePath(nextPath);

    const hasChildren = Boolean(option.children && option.children.length > 0);
    if (!hasChildren || changeOnSelect) {
      const resolved = resolveOptions(nextPath);
      onChange(nextPath, resolved);
      if (!hasChildren) {
        setIsOpen(false);
      }
    }
  };

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label
          style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }}
          className="block font-medium"
        >
          {label}
        </label>
      )}

      {/* Trigger */}
      <div
        ref={triggerRef}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        tabIndex={0}
        onClick={() => {
          if (!isOpen) calculatePosition();
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!isOpen) calculatePosition();
            setIsOpen((prev) => !prev);
          }
        }}
        style={{
          borderRadius: `${scaled.scaledRadius}px`,
          borderColor: isOpen ? tokens.primaryButtonColor : tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          backgroundColor: scaled.effectiveInputFill,
          height: `${scaled.scaledHeight}px`,
          paddingLeft: `${scaled.scaledPaddingX}px`,
          paddingRight: `${scaled.scaledPaddingX}px`,
          transition: scaled.transitionStyle,
        }}
        className="w-full flex items-center justify-between gap-2 border cursor-pointer select-none focus:outline-none"
      >
        <span
          style={{
            fontSize: `${scaled.scaledFontSize}px`,
            color: displayLabel ? tokens.textIconColor : "#A1A1AA",
          }}
          className="font-medium truncate"
        >
          {displayLabel || placeholder}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          {value.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange([], []);
                setActivePath([]);
              }}
              className="text-neutral-400 hover:text-neutral-700 p-0.5 cursor-pointer"
              aria-label="Clear path"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            size={scaled.iconSmSize || 16}
            strokeWidth={tokens.iconStrokeWidth || 1.75}
            color={tokens.iconColor || tokens.textIconColor}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Portaled Multi-Column Miller Menu */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={menuRef}
                id={menuId}
                initial={{ opacity: 0, scale: 0.97, y: coords.placement === "bottom" ? -4 : 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: coords.placement === "bottom" ? -4 : 4 }}
                transition={scaled.motionConfig.spring}
                style={{
                  position: "fixed",
                  top: coords.placement === "bottom" ? coords.top : undefined,
                  bottom: coords.placement === "top" ? window.innerHeight - coords.top : undefined,
                  left: coords.left,
                  borderRadius: `${scaled.scaledMenuRadius}px`,
                  borderColor: tokens.universalBorderColor,
                  borderWidth: `${tokens.borderWidth}px`,
                  backgroundColor: tokens.universalFillColor,
                  boxShadow: "0 14px 30px -6px rgba(0, 0, 0, 0.12), 0 8px 12px -6px rgba(0, 0, 0, 0.06)",
                  zIndex: 99998,
                }}
                className="border flex overflow-x-auto max-w-[calc(100vw-24px)] select-none"
              >
                {columns.map((colOptions, levelIndex) => (
                  <div
                    key={levelIndex}
                    style={{
                      borderColor: tokens.universalBorderColor,
                      borderLeftWidth: levelIndex > 0 ? `${tokens.borderWidth}px` : 0,
                    }}
                    className="min-w-[165px] max-h-60 overflow-y-auto p-1 space-y-0.5 shrink-0"
                  >
                    {colOptions.map((opt) => {
                      const isActive = activePath[levelIndex] === opt.value;
                      const isLeaf = !opt.children || opt.children.length === 0;
                      const isCommitted = isActive && value[levelIndex] === opt.value && isLeaf;

                      return (
                        <button
                          key={opt.value}
                          type="button"
                          disabled={opt.disabled}
                          onClick={() => handleSelectOption(opt, levelIndex)}
                          style={{
                            borderRadius: `${scaled.scaledOptionRadius}px`,
                            backgroundColor: isActive ? tokens.hoverBackplateTint : "transparent",
                            color: tokens.textIconColor,
                          }}
                          className={`w-full px-2.5 py-1.5 text-xs flex items-center justify-between gap-2 text-left transition-colors ${
                            opt.disabled
                              ? "opacity-40 cursor-not-allowed"
                              : "cursor-pointer hover:bg-neutral-100/70"
                          } ${isActive ? "font-semibold" : "font-medium"}`}
                        >
                          <span className="truncate">{opt.label}</span>
                          {!isLeaf ? (
                            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          ) : isCommitted ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
