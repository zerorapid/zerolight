"use client";

import React, { useState, useRef, useEffect, useId, useCallback } from "react";
import { createPortal } from "react-dom";
import { useZeroLight } from "../context";
import { motion, AnimatePresence } from "framer-motion";

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  destructive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  separator?: boolean; // When true, renders a divider before this item
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: "left" | "right";
  width?: number | string;
  className?: string;
}

export function DropdownMenu({
  trigger,
  items,
  align = "right",
  width = 200,
  className = "",
}: DropdownMenuProps) {
  const { tokens, scaled } = useZeroLight();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [coords, setCoords] = useState<{ top: number; left: number; placement: "top" | "bottom" }>({
    top: 0,
    left: 0,
    placement: "bottom",
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const typeaheadBuffer = useRef("");
  const typeaheadTimer = useRef<NodeJS.Timeout | null>(null);
  const menuId = useId();

  // Active items list (ignoring separators and disabled)
  const getNavigableIndices = useCallback(() => {
    return items
      .map((item, idx) => (!item.disabled ? idx : -1))
      .filter((idx) => idx !== -1);
  }, [items]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const margin = tokens.menuOffsetGap ?? 8;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const menuWidthNum = typeof width === "number" ? width : 200;

    // Estimate menu height: ~36px per item + separators
    const estimatedHeight = items.length * 36 + 20;

    let placement: "top" | "bottom" = "bottom";
    let top = rect.bottom + margin;

    // If bottom overflow, flip to top
    if (rect.bottom + estimatedHeight > viewportHeight - 16 && rect.top - estimatedHeight > 16) {
      placement = "top";
      top = rect.top - margin;
    }

    let left = align === "right" ? rect.right - menuWidthNum : rect.left;
    // Viewport clamping
    if (left + menuWidthNum > viewportWidth - 12) {
      left = viewportWidth - menuWidthNum - 12;
    }
    if (left < 12) {
      left = 12;
    }

    setCoords({ top, left, placement });
  }, [align, items.length, width, tokens.menuOffsetGap]);

  const openMenu = () => {
    calculatePosition();
    setIsOpen(true);
    setActiveIndex(-1);
  };

  const closeMenu = (restoreFocus = true) => {
    setIsOpen(false);
    setActiveIndex(-1);
    if (restoreFocus && triggerRef.current) {
      const focusable = triggerRef.current.querySelector<HTMLElement>("button, [tabindex='0']");
      if (focusable) focusable.focus();
      else triggerRef.current.focus();
    }
  };

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        closeMenu(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", calculatePosition, true);
      window.addEventListener("resize", calculatePosition);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", calculatePosition, true);
      window.removeEventListener("resize", calculatePosition);
    };
  }, [isOpen, calculatePosition]);

  // Keyboard navigation & typeahead state machine
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const validIndices = getNavigableIndices();
    if (!validIndices.length) return;

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openMenu();
        setActiveIndex(validIndices[0]);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const currentPos = validIndices.indexOf(activeIndex);
        const nextIdx = currentPos === -1 || currentPos === validIndices.length - 1
          ? validIndices[0]
          : validIndices[currentPos + 1];
        setActiveIndex(nextIdx);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const currentPos = validIndices.indexOf(activeIndex);
        const prevIdx = currentPos <= 0
          ? validIndices[validIndices.length - 1]
          : validIndices[currentPos - 1];
        setActiveIndex(prevIdx);
        break;
      }
      case "Home": {
        e.preventDefault();
        setActiveIndex(validIndices[0]);
        break;
      }
      case "End": {
        e.preventDefault();
        setActiveIndex(validIndices[validIndices.length - 1]);
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < items.length) {
          const item = items[activeIndex];
          if (!item.disabled) {
            item.onClick?.();
            closeMenu(true);
          }
        }
        break;
      }
      case "Escape": {
        e.preventDefault();
        closeMenu(true);
        break;
      }
      case "Tab": {
        closeMenu(false);
        break;
      }
      default: {
        // Typeahead support: 1 char search
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          if (typeaheadTimer.current) clearTimeout(typeaheadTimer.current);
          typeaheadBuffer.current += e.key.toLowerCase();
          typeaheadTimer.current = setTimeout(() => {
            typeaheadBuffer.current = "";
          }, 500);

          const match = items.findIndex((it) =>
            !it.disabled && it.label.toLowerCase().startsWith(typeaheadBuffer.current)
          );
          if (match !== -1) {
            setActiveIndex(match);
          }
        }
        break;
      }
    }
  };

  return (
    <div
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Wrapper */}
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={() => {
          if (isOpen) closeMenu(false);
          else openMenu();
        }}
        className="cursor-pointer inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-1 rounded-sm"
      >
        {trigger}
      </div>

      {/* Floating Menu Popover (Portaled to document.body) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={menuRef}
                id={menuId}
                role="menu"
                aria-orientation="vertical"
                tabIndex={-1}
                initial={{
                  opacity: 0,
                  scale: scaled.motionConfig.popover.initial.scale,
                  y: coords.placement === "bottom" ? -scaled.motionConfig.distance : scaled.motionConfig.distance,
                }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: scaled.motionConfig.popover.exit.scale,
                  y: coords.placement === "bottom" ? -scaled.motionConfig.distance : scaled.motionConfig.distance,
                }}
                transition={scaled.motionConfig.popover.transition}
                style={{
                  position: "fixed",
                  top: coords.placement === "bottom" ? coords.top : undefined,
                  bottom: coords.placement === "top" ? window.innerHeight - coords.top : undefined,
                  left: coords.left,
                  width,
                  borderRadius: `${scaled.scaledRadius}px`,
                  borderColor: tokens.universalBorderColor,
                  borderWidth: `${tokens.borderWidth}px`,
                  backgroundColor: tokens.universalFillColor,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                  zIndex: 99998,
                }}
                className="p-1 border select-none focus:outline-none"
              >
                {items.map((item, idx) => {
                  const isHighlighted = activeIndex === idx;

                  return (
                    <React.Fragment key={item.id}>
                      {item.separator && (
                        <div
                          role="separator"
                          style={{ borderColor: tokens.universalBorderColor }}
                          className="border-t my-1 -mx-1 opacity-60"
                        />
                      )}
                      <button
                        role="menuitem"
                        type="button"
                        tabIndex={-1}
                        disabled={item.disabled}
                        aria-disabled={item.disabled}
                        onMouseEnter={() => {
                          if (!item.disabled) setActiveIndex(idx);
                        }}
                        onClick={() => {
                          if (!item.disabled) {
                            item.onClick?.();
                            closeMenu(true);
                          }
                        }}
                        style={{
                          borderRadius: `${Math.max(4, scaled.scaledRadius - 4)}px`,
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer outline-none ${
                          item.disabled
                            ? "opacity-40 cursor-not-allowed"
                            : item.destructive
                            ? isHighlighted
                              ? "bg-rose-50 text-rose-600 font-semibold"
                              : "text-rose-600"
                            : isHighlighted
                            ? "bg-neutral-100 text-neutral-900 font-semibold"
                            : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {item.icon && (
                            <span className="shrink-0 text-neutral-400 group-hover:text-neutral-600">
                              {item.icon}
                            </span>
                          )}
                          <span className="truncate font-medium">{item.label}</span>
                        </div>
                        {item.shortcut && (
                          <span className="text-[10px] text-neutral-400 font-sans tabular-nums pl-2">
                            {item.shortcut}
                          </span>
                        )}
                      </button>
                    </React.Fragment>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
