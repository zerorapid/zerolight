"use client";

import React, { useRef } from "react";
import { useZeroLight } from "../context";
import { Search, X } from "lucide-react";
import { Kbd } from "../atoms/kbd";

export interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onClear?: () => void;
  placeholder?: string;
  showKbd?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "Search resources, logs, and telemetry...",
  showKbd = true,
  className = "",
}: SearchBarProps) {
  const { tokens, scaled } = useZeroLight();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledRadius}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: scaled.effectiveInputFill,
        height: `${scaled.scaledHeight}px`,
        paddingLeft: `${scaled.scaledPaddingX}px`,
        paddingRight: `${scaled.scaledPaddingX}px`,
        transition: scaled.transitionStyle,
      }}
      className={`flex items-center gap-2 border w-full focus-within:ring-2 focus-within:ring-black/10 transition-colors ${className}`}
    >
      <Search className="w-4 h-4 text-neutral-400 shrink-0" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          fontSize: `${scaled.scaledFontSize}px`,
          color: tokens.textIconColor,
        }}
        className="w-full bg-transparent outline-none font-medium placeholder:text-neutral-400"
      />

      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            onClear?.();
            inputRef.current?.focus();
          }}
          className="text-neutral-400 hover:text-neutral-700 cursor-pointer shrink-0"
          aria-label="Clear search query"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {showKbd && !value && (
        <Kbd className="shrink-0 hidden sm:inline-flex">⌘K</Kbd>
      )}
    </div>
  );
}
