"use client";

import React from "react";
import { useZeroLight } from "../context";
import { X } from "lucide-react";

export interface TagChipProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

export function TagChip({ label, onRemove, className = "" }: TagChipProps) {
  const { tokens, scaled } = useZeroLight();

  return (
    <span
      style={{
        borderRadius: `${scaled.scaledPillRadius}px`,
        backgroundColor: tokens.hoverBackplateTint,
        color: tokens.textIconColor,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        transition: scaled.transitionStyle,
      }}
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border shadow-2xs whitespace-nowrap shrink-0 ${className}`}
    >
      <span className="whitespace-nowrap">{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-neutral-400 hover:text-neutral-700 cursor-pointer ml-0.5 rounded-full p-0.5"
          aria-label={`Remove tag ${label}`}
        >
          <X
            size={scaled.iconSmSize ? Math.max(10, Math.round(scaled.iconSmSize * 0.75)) : 12}
            strokeWidth={tokens.iconStrokeWidth || 2}
            color={tokens.iconColor || tokens.textIconColor}
            className="shrink-0"
          />
        </button>
      )}
    </span>
  );
}
