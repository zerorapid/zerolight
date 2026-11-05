"use client";

import React from "react";

export type TraceDotStatus = "active" | "settled" | "staged" | "failed";

export interface TraceDotProps {
  status?: TraceDotStatus;
  className?: string;
  ariaLabel?: string;
}

export function TraceDot({
  status = "active",
  className = "",
  ariaLabel,
}: TraceDotProps) {
  const getStatusAriaLabel = () => {
    switch (status) {
      case "active":
        return "Status: Active / In-Progress";
      case "settled":
        return "Status: Settled / Committed";
      case "staged":
        return "Status: Staged / Pending";
      case "failed":
        return "Status: Failed / Fault";
    }
  };

  return (
    <span
      role="status"
      aria-label={ariaLabel || getStatusAriaLabel()}
      className={`relative inline-flex items-center justify-center flex-shrink-0 w-2.5 h-2.5 ${className}`}
    >
      {status === "active" && (
        <>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
        </>
      )}

      {status === "settled" && (
        <>
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500/30" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
        </>
      )}

      {status === "staged" && (
        <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-600 ring-1 ring-neutral-700/60" />
      )}

      {status === "failed" && (
        <>
          <span className="absolute inline-flex h-full w-full rounded-full bg-rose-500/40" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
        </>
      )}
    </span>
  );
}
