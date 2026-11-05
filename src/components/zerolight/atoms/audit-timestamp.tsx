"use client";

import React from "react";

export type AuditTimestampFormat = "compact" | "iso" | "full" | "time-only";

export interface AuditTimestampProps {
  date?: Date | string | number;
  format?: AuditTimestampFormat;
  showPill?: boolean;
  className?: string;
}

export function AuditTimestamp({
  date = new Date(),
  format = "compact",
  showPill = false,
  className = "",
}: AuditTimestampProps) {
  const d = date instanceof Date ? date : new Date(date);

  // Fallback for invalid date
  if (isNaN(d.getTime())) {
    return <span className="font-mono text-neutral-500 text-xs">[INVALID_DATE]</span>;
  }

  let formatted = "";
  switch (format) {
    case "iso":
      formatted = d.toISOString();
      break;
    case "time-only":
      formatted = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(d);
      break;
    case "full":
      formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
        hour12: false,
      }).format(d);
      break;
    case "compact":
    default:
      formatted = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
        hour12: false,
      }).format(d);
      break;
  }

  if (showPill) {
    return (
      <span
        className={`inline-flex items-center gap-1 font-mono text-[10px] tabular-nums text-neutral-400 bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded select-none ${className}`}
        title={`ISO: ${d.toISOString()}`}
      >
        <span className="w-1 h-1 rounded-full bg-neutral-500" />
        <span>{formatted}</span>
      </span>
    );
  }

  return (
    <span
      className={`font-mono text-xs tabular-nums text-neutral-400 select-none ${className}`}
      title={`ISO: ${d.toISOString()}`}
    >
      [{formatted}]
    </span>
  );
}
