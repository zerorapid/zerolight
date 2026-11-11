"use client";

import React, { useState, useRef, useEffect, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import { useZeroLight } from "../context";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface SplitButtonOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  onClick: () => void;
}

export interface SplitButtonProps {
  label: string;
  onClick: () => void;
  options: SplitButtonOption[];
  iconLeft?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export function SplitButton({
  label,
  onClick,
  options,
  iconLeft,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}: SplitButtonProps) {
  const { tokens, scaled } = useZeroLight();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [coords, setCoords] = useState<{ top: number; left: number; placement: "top" | "bottom" }>({
    top: 0,
    left: 0,
    placement: "bottom",
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const margin = tokens.menuOffsetGap ?? 8;
    const menuWidth = 220;
    const estimatedHeight = options.length * 48 + 20;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let placement: "top" | "bottom" = "bottom";
    let top = rect.bottom + margin;

    if (rect.bottom + estimatedHeight > viewportHeight - 16 && rect.top - estimatedHeight > 16) {
      placement = "top";
      top = rect.top - margin;
    }

    let left = rect.right - menuWidth;
    if (left + menuWidth > viewportWidth - 12) {
      left = viewportWidth - menuWidth - 12;
    }
    if (left < 12) {
      left = 12;
    }

    setCoords({ top, left, placement });
  }, [options.length, tokens.menuOffsetGap]);

  const openMenu = () => {
    calculatePosition();
    setIsOpen(true);
    setActiveIndex(0);
  };

  const closeMenu = (restoreFocus = true) => {
    setIsOpen(false);
    setActiveIndex(-1);
    if (restoreFocus && chevronRef.current) {
      chevronRef.current.focus();
    }
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        openMenu();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % options.length);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setActiveIndex((prev) => (prev <= 0 ? options.length - 1 : prev - 1));
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < options.length) {
          options[activeIndex].onClick();
          closeMenu(true);
        }
        break;
      }
      case "Escape": {
        e.preventDefault();
        closeMenu(true);
        break;
      }
    }
  };

  const sizeMultiplier = size === "sm" ? 0.85 : size === "lg" ? 1.15 : 1.0;
  const height = Math.round(scaled.scaledHeight * sizeMultiplier);
  const paddingX = Math.round(scaled.scaledPaddingX * sizeMultiplier);
  const fontSize = Math.max(11, Math.round(scaled.ctaFontSize * (size === "sm" ? 0.9 : size === "lg" ? 1.1 : 1.0)));
  const iconSize = size === "sm" ? 13 : size === "lg" ? 18 : 15;

  const isPrimary = variant === "primary";
  const bg = isPrimary
    ? tokens.primaryButtonColor
    : variant === "secondary"
    ? tokens.hoverBackplateTint
    : "transparent";

  const textColor = isPrimary
    ? scaled.primaryActionTextColor
    : tokens.textIconColor;

  const borderColor = isPrimary
    ? tokens.primaryButtonColor
    : tokens.universalBorderColor;

  const dividerColor = isPrimary
    ? (scaled.primaryActionTextColor === "#FFFFFF" ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.15)")
    : tokens.universalBorderColor;

  const outerRadius = `${scaled.scaledRadius}px`;

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex items-stretch select-none shrink-0 ${className}`}
    >
      {/* Main Action Button */}
      <motion.button
        type="button"
        disabled={disabled}
        onClick={onClick}
        whileTap={{ scale: disabled ? 1 : scaled.motionConfig.tapScale }}
        transition={scaled.motionConfig.transition}
        style={{
          height: `${height}px`,
          paddingLeft: `${paddingX}px`,
          paddingRight: `${Math.round(paddingX * 0.8)}px`,
          fontSize: `${fontSize}px`,
          backgroundColor: bg,
          color: textColor,
          borderColor,
          borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
          borderRightWidth: 0,
          borderTopLeftRadius: outerRadius,
          borderBottomLeftRadius: outerRadius,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          transition: scaled.transitionStyle,
        }}
        className={`inline-flex items-center justify-center gap-2 font-semibold shadow-xs whitespace-nowrap cursor-pointer hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {iconLeft && <span className="shrink-0">{iconLeft}</span>}
        <span>{label}</span>
      </motion.button>

      {/* Flush Hairline Junction Seam */}
      <div
        style={{
          width: `${Math.max(1, tokens.borderWidth)}px`,
          backgroundColor: dividerColor,
        }}
        className="shrink-0"
      />

      {/* Conjoined Submenu Chevron Trigger */}
      <motion.button
        ref={chevronRef}
        type="button"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={() => {
          if (isOpen) closeMenu(false);
          else openMenu();
        }}
        whileTap={{ scale: disabled ? 1 : scaled.motionConfig.tapScale }}
        transition={scaled.motionConfig.transition}
        style={{
          height: `${height}px`,
          width: `${Math.round(height * 0.85)}px`,
          backgroundColor: bg,
          color: textColor,
          borderColor,
          borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
          borderLeftWidth: 0,
          borderTopRightRadius: outerRadius,
          borderBottomRightRadius: outerRadius,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          transition: scaled.transitionStyle,
        }}
        className={`inline-flex items-center justify-center shadow-xs cursor-pointer hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        aria-label="More actions"
      >
        <ChevronDown
          size={iconSize}
          strokeWidth={tokens.iconStrokeWidth || 2}
          className={`transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
        />
      </motion.button>

      {/* Floating Conjoined Submenu (Portaled to document.body) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={menuRef}
                id={menuId}
                role="menu"
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
                  width: 220,
                  borderRadius: `${scaled.scaledMenuRadius}px`,
                  borderColor: tokens.universalBorderColor,
                  borderWidth: `${tokens.borderWidth}px`,
                  backgroundColor: tokens.universalFillColor,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.06)",
                  zIndex: 99998,
                }}
                className="p-1.5 border select-none"
              >
                <div className="space-y-0.5">
                  {options.map((opt, idx) => {
                    const isHighlighted = activeIndex === idx;

                    return (
                      <button
                        key={opt.id}
                        role="menuitem"
                        type="button"
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => {
                          opt.onClick();
                          closeMenu(true);
                        }}
                        style={{
                          borderRadius: `${scaled.scaledOptionRadius}px`,
                        }}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-xs font-medium transition-colors cursor-pointer text-left ${
                          isHighlighted
                            ? "bg-neutral-100 text-neutral-900 font-semibold"
                            : "text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-900"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {opt.icon && <span className="text-neutral-400 shrink-0">{opt.icon}</span>}
                          <div className="truncate">
                            <div className="font-semibold text-neutral-800">{opt.label}</div>
                            {opt.description && (
                              <div className="text-[10px] text-neutral-400 truncate">{opt.description}</div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
