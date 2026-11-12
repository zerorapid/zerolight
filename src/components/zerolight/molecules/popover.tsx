"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useZeroLight } from "../context";

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "center" | "end";
  width?: number | string;
  className?: string;
}

/**
 * Portaled generic Popover container positioned cleanly around trigger with ZeroLight spring physics.
 */
export function Popover({
  trigger,
  children,
  open,
  onOpenChange,
  align = "start",
  width = 280,
  className = "",
}: PopoverProps) {
  const { tokens, scaled } = useZeroLight();
  const [internalOpen, setInternalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const isOpen = open ?? internalOpen;
  const setOpen = (next: boolean) => {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const gap = tokens.menuOffsetGap ?? 8;
    const wNum = typeof width === "number" ? width : 280;
    let left = rect.left;
    if (align === "center") left = rect.left + rect.width / 2 - wNum / 2;
    if (align === "end") left = rect.right - wNum;
    left = Math.max(8, Math.min(window.innerWidth - wNum - 8, left));
    setCoords({ top: rect.bottom + gap, left });
  }, [isOpen, align, width, tokens.menuOffsetGap]);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        popoverRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setOpen(!isOpen)}
        className="inline-flex cursor-pointer"
      >
        {trigger}
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={popoverRef}
                initial={scaled.motionConfig.popover.initial}
                animate={scaled.motionConfig.popover.animate}
                exit={scaled.motionConfig.popover.exit}
                transition={scaled.motionConfig.popover.transition}
                style={{
                  position: "fixed",
                  top: `${coords.top}px`,
                  left: `${coords.left}px`,
                  width: typeof width === "number" ? `${width}px` : width,
                  backgroundColor: tokens.universalFillColor,
                  borderColor: tokens.universalBorderColor,
                  borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
                  borderRadius: `${scaled.scaledMenuRadius}px`,
                  color: tokens.textIconColor,
                  zIndex: 60,
                }}
                className={`p-3.5 shadow-xl border font-sans ${className}`}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
