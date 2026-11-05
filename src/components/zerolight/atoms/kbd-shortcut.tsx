"use client";

import React from "react";

export interface KbdShortcutProps {
  keys?: string[];
  shortcut?: string;
  size?: "xs" | "sm";
  className?: string;
}

export function KbdShortcut({
  keys,
  shortcut,
  size = "xs",
  className = "",
}: KbdShortcutProps) {
  const parsedKeys = keys || (shortcut ? shortcut.split("+") : ["⌘", "K"]);

  const sizeClasses = {
    xs: "text-[10px] px-1 py-0.5 min-w-[16px]",
    sm: "text-xs px-1.5 py-0.5 min-w-[20px]",
  }[size];

  return (
    <span className={`inline-flex items-center gap-1 font-mono ${className}`}>
      {parsedKeys.map((key, idx) => (
        <kbd
          key={idx}
          className={`inline-flex items-center justify-center rounded bg-neutral-900 border border-neutral-750 text-neutral-300 font-semibold shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)] leading-none select-none ${sizeClasses}`}
        >
          {key.trim()}
        </kbd>
      ))}
    </span>
  );
}
