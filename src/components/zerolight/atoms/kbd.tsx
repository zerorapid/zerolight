"use client";

import React from "react";
import { useZeroLight } from "../context";

export interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

export function Kbd({ children, className = "" }: KbdProps) {
  const { tokens, scaled } = useZeroLight();

  return (
    <kbd
      style={{
        borderRadius: `${scaled.scaledInnerRadius === 0 ? 0 : 5}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: tokens.universalFillColor,
        color: tokens.textIconColor,
        boxShadow: "0 1px 0 rgba(0,0,0,0.15)",
      }}
      className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-semibold font-sans tracking-tight border whitespace-nowrap shrink-0 ${className}`}
    >
      {children}
    </kbd>
  );
}
