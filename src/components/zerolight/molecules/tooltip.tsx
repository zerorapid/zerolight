"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { useZeroLight } from "../context";
import { motion, AnimatePresence } from "framer-motion";

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  delay?: number;
}

export function Tooltip({
  content,
  children,
  position = "top",
  className = "",
  delay = 100,
}: TooltipProps) {
  const { tokens, scaled } = useZeroLight();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; actualPosition: "top" | "bottom" | "left" | "right" }>({
    top: 0,
    left: 0,
    actualPosition: position,
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipId = useId();

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const margin = tokens.menuOffsetGap ?? 8;
    const viewportWidth = window.innerWidth;

    let targetPos = position;
    let top = 0;
    let left = 0;

    // Flip top to bottom if too close to viewport top
    if (position === "top" && rect.top < 40) {
      targetPos = "bottom";
    } else if (position === "bottom" && rect.bottom + 40 > window.innerHeight) {
      targetPos = "top";
    }

    if (targetPos === "top") {
      top = rect.top - margin;
      left = Math.max(margin, Math.min(viewportWidth - margin, rect.left + rect.width / 2));
    } else if (targetPos === "bottom") {
      top = rect.bottom + margin;
      left = Math.max(margin, Math.min(viewportWidth - margin, rect.left + rect.width / 2));
    } else if (targetPos === "left") {
      top = rect.top + rect.height / 2;
      left = rect.left - margin;
    } else if (targetPos === "right") {
      top = rect.top + rect.height / 2;
      left = rect.right + margin;
    }

    setCoords({ top, left, actualPosition: targetPos });
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updatePosition();
      setIsOpen(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(false);
  };

  const handleFocus = () => {
    updatePosition();
    setIsOpen(true);
  };

  const handleBlur = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen]);

  const getTransformOrigin = () => {
    switch (coords.actualPosition) {
      case "top":
        return "bottom center";
      case "bottom":
        return "top center";
      case "left":
        return "center right";
      case "right":
        return "center left";
    }
  };

  const getTransform = () => {
    switch (coords.actualPosition) {
      case "top":
        return "translate(-50%, -100%)";
      case "bottom":
        return "translate(-50%, 0%)";
      case "left":
        return "translate(-100%, -50%)";
      case "right":
        return "translate(0%, -50%)";
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={`relative inline-block ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={isOpen ? tooltipId : undefined}
      >
        {children}
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                id={tooltipId}
                role="tooltip"
                initial={{ opacity: 0, scale: scaled.motionConfig.popover.initial.scale }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: scaled.motionConfig.popover.exit.scale }}
                transition={scaled.motionConfig.popover.transition}
                style={{
                  position: "fixed",
                  top: coords.top,
                  left: coords.left,
                  transform: getTransform(),
                  transformOrigin: getTransformOrigin(),
                  borderRadius: `${scaled.scaledInnerRadius === 0 ? 0 : 6}px`,
                  zIndex: 99999,
                }}
                className="bg-[#18181B] text-white px-2.5 py-1 text-xs font-medium shadow-xl pointer-events-none whitespace-nowrap border border-neutral-700 select-none"
              >
                {content}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
