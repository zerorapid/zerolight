"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { motion, AnimatePresence } from "framer-motion";

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom";
  className?: string;
}

export function Tooltip({
  content,
  children,
  position = "top",
  className = "",
}: TooltipProps) {
  const { scaled } = useZeroLight();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: position === "top" ? 4 : -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === "top" ? 4 : -4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            style={{
              borderRadius: `${scaled.scaledInnerRadius === 0 ? 0 : 6}px`,
            }}
            className={`absolute left-1/2 -translate-x-1/2 z-50 bg-[#18181B] text-white px-2.5 py-1 text-xs font-medium shadow-xl pointer-events-none whitespace-nowrap border border-neutral-700 ${
              position === "top" ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
