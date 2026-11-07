"use client";

import React from "react";
import { useZeroLight } from "../context";
import { motion } from "framer-motion";

export interface TypingIndicatorProps {
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export function TypingIndicator({
  label,
  size = "md",
  className = "",
}: TypingIndicatorProps) {
  const { tokens, scaled } = useZeroLight();

  const dotSize = size === "sm" ? 4 : 6;
  const dotGap = size === "sm" ? 3 : 4;

  const dotTransition = {
    duration: 0.6,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut" as const,
  };

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledPillRadius}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: tokens.universalFillColor,
      }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 border shadow-2xs select-none ${className}`}
    >
      <div className="flex items-center" style={{ gap: `${dotGap}px` }}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            initial={{ y: 0, opacity: 0.4 }}
            animate={{ y: -3, opacity: 1 }}
            transition={{
              ...dotTransition,
              delay: i * 0.15,
            }}
            style={{
              width: `${dotSize}px`,
              height: `${dotSize}px`,
              backgroundColor: tokens.primaryButtonColor,
              borderRadius: "9999px",
            }}
          />
        ))}
      </div>
      {label && (
        <span
          style={{
            fontSize: `${scaled.sublabelFontSize}px`,
            color: tokens.textIconColor,
          }}
          className="font-medium text-neutral-500"
        >
          {label}
        </span>
      )}
    </div>
  );
}
