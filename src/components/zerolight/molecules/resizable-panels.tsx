"use client";

import React, { useState, useRef } from "react";
import { GripVertical, GripHorizontal } from "lucide-react";
import { useZeroLight } from "../context";

export interface ResizablePanelsProps {
  left: React.ReactNode;
  right: React.ReactNode;
  direction?: "horizontal" | "vertical";
  defaultSplit?: number; // percentage 20-80
  minSplit?: number;
  maxSplit?: number;
  className?: string;
}

/**
 * Interactive two-pane resizable workspace container with keyboard & pointer drag handle.
 */
export function ResizablePanels({
  left,
  right,
  direction = "horizontal",
  defaultSplit = 50,
  minSplit = 20,
  maxSplit = 80,
  className = "",
}: ResizablePanelsProps) {
  const { tokens, scaled } = useZeroLight();
  const [split, setSplit] = useState(defaultSplit);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const clamp = (val: number) => Math.min(maxSplit, Math.max(minSplit, val));

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (direction === "horizontal") {
      setSplit(clamp(((e.clientX - rect.left) / rect.width) * 100));
    } else {
      setSplit(clamp(((e.clientY - rect.top) / rect.height) * 100));
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={onPointerMove}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerLeave={() => {
        dragging.current = false;
      }}
      style={{
        borderColor: tokens.universalBorderColor,
        borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
        borderStyle: "solid",
        borderRadius: `${scaled.scaledCardRadius}px`,
        backgroundColor: tokens.universalFillColor,
        color: tokens.textIconColor,
      }}
      className={`flex ${direction === "horizontal" ? "flex-row" : "flex-col"} overflow-hidden ${className}`}
    >
      <div
        style={direction === "horizontal" ? { width: `${split}%` } : { height: `${split}%` }}
        className="min-w-0 min-h-0 overflow-auto p-4"
      >
        {left}
      </div>

      <button
        type="button"
        aria-label="Resize panels"
        onPointerDown={() => {
          dragging.current = true;
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowUp") setSplit((s) => clamp(s - 5));
          if (e.key === "ArrowRight" || e.key === "ArrowDown") setSplit((s) => clamp(s + 5));
        }}
        style={{
          borderColor: tokens.universalBorderColor,
          backgroundColor: tokens.hoverBackplateTint,
        }}
        className={`flex items-center justify-center shrink-0 select-none ${
          direction === "horizontal"
            ? "w-2 border-x cursor-col-resize"
            : "h-2 border-y cursor-row-resize"
        }`}
      >
        {direction === "horizontal" ? (
          <GripVertical className="w-3 h-3 opacity-55" />
        ) : (
          <GripHorizontal className="w-3 h-3 opacity-55" />
        )}
      </button>

      <div className="flex-1 min-w-0 min-h-0 overflow-auto p-4">{right}</div>
    </div>
  );
}
