"use client";

import React, { createContext, useContext, useState, useId } from "react";

export interface Settlement<T> {
  id: string;
  settledAt: Date;
  summary: string;
  payload: T;
}

export interface ApertureControls<T> {
  settle: (summary: string, payload: T) => void;
  dismiss: () => void;
  reopen: () => void;
  isSettled: boolean;
  settlement: Settlement<T> | null;
}

const ApertureContext = createContext<ApertureControls<any> | null>(null);

export function useAperture<T>(): ApertureControls<T> {
  const context = useContext(ApertureContext);
  if (!context) {
    throw new Error("useAperture must be used within an <Aperture /> component.");
  }
  return context as ApertureControls<T>;
}

export interface ApertureProps<T> {
  id?: string;
  title: string;
  badgeText?: string;
  badgeVariant?: "default" | "accent" | "warning";
  initialSettled?: Settlement<T> | null;
  onSettle?: (record: Settlement<T>) => void;
  onDismiss?: () => void;
  onReopen?: () => void;
  children: React.ReactNode | ((controls: ApertureControls<T>) => React.ReactNode);
  className?: string;
  renderTrace?: (record: Settlement<T>, reopen: () => void) => React.ReactNode;
}

export function Aperture<T>({
  id: propId,
  title,
  badgeText = "MICRO-ACTION",
  badgeVariant = "default",
  initialSettled = null,
  onSettle,
  onDismiss,
  onReopen,
  children,
  className = "",
  renderTrace,
}: ApertureProps<T>) {
  const generatedId = useId();
  const apertureId = propId || generatedId;

  const [settlement, setSettlement] = useState<Settlement<T> | null>(initialSettled);
  const [isSettled, setIsSettled] = useState<boolean>(Boolean(initialSettled));
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  const settle = (summary: string, payload: T) => {
    const record: Settlement<T> = {
      id: apertureId,
      settledAt: new Date(),
      summary,
      payload,
    };
    setSettlement(record);
    setIsSettled(true);
    onSettle?.(record);
  };

  const dismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const reopen = () => {
    setIsSettled(false);
    onReopen?.();
  };

  const controls: ApertureControls<T> = {
    settle,
    dismiss,
    reopen,
    isSettled,
    settlement,
  };

  if (isDismissed) {
    return null;
  }

  // --- Settled / Trace State ---
  if (isSettled && settlement) {
    if (renderTrace) {
      return (
        <ApertureContext.Provider value={controls}>
          {renderTrace(settlement, reopen)}
        </ApertureContext.Provider>
      );
    }

    const formattedTime = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
      hour12: false,
    }).format(settlement.settledAt);

    return (
      <ApertureContext.Provider value={controls}>
        <div
          role="status"
          aria-live="polite"
          data-aperture-id={apertureId}
          data-aperture-state="settled"
          className={`group flex items-center justify-between gap-4 px-3.5 py-2.5 rounded-md border border-neutral-800/80 bg-neutral-950/90 text-xs font-mono transition-all duration-200 hover:border-neutral-700 hover:bg-neutral-900/60 shadow-sm ${className}`}
        >
          <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
            {/* Live Audit Pulse Indicator */}
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>

            {/* Micro timestamp */}
            <span className="text-neutral-500 font-medium select-none flex-shrink-0 tabular-nums">
              [{formattedTime}]
            </span>

            {/* Trace Identifier */}
            <span className="text-neutral-400 font-semibold tracking-wider uppercase text-[10px] px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 flex-shrink-0">
              {title}
            </span>

            {/* Immutable Summary Receipt */}
            <span
              className="text-neutral-200 truncate font-normal tracking-tight"
              title={settlement.summary}
            >
              {settlement.summary}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="inline-flex items-center gap-1 text-[11px] font-sans text-emerald-400/90 font-medium bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
              <svg
                className="w-3 h-3 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Committed
            </span>

            {/* Subtle Modify Trigger to Re-open */}
            <button
              type="button"
              onClick={reopen}
              aria-label={`Modify ${title}`}
              className="text-neutral-400 hover:text-white px-2 py-0.5 rounded text-[11px] font-sans font-medium transition-colors hover:bg-neutral-800 active:scale-95 border border-transparent hover:border-neutral-700"
            >
              Modify
            </button>
          </div>
        </div>
      </ApertureContext.Provider>
    );
  }

  // --- Active State ---
  const badgeColorClasses =
    badgeVariant === "accent"
      ? "bg-rose-950/60 text-rose-300 border-rose-800/60"
      : badgeVariant === "warning"
      ? "bg-amber-950/60 text-amber-300 border-amber-800/60"
      : "bg-neutral-900 text-neutral-300 border-neutral-800";

  return (
    <ApertureContext.Provider value={controls}>
      <div
        data-aperture-id={apertureId}
        data-aperture-state="active"
        className={`rounded-lg border border-neutral-800 bg-neutral-950 shadow-2xl transition-all duration-150 overflow-hidden ${className}`}
      >
        {/* Header Boundary Styling */}
        <div className="flex items-center justify-between border-b border-neutral-800/90 px-4 py-2.5 bg-neutral-900/40 select-none">
          <div className="flex items-center gap-2.5">
            {/* Visual Micro-Actuator glyph */}
            <div className="flex items-center justify-center w-4 h-4 rounded bg-neutral-800/80 border border-neutral-700/60 text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-sm bg-rose-500 animate-pulse"></span>
            </div>
            <h3 className="text-xs font-semibold tracking-wider uppercase text-neutral-200">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border font-medium ${badgeColorClasses}`}
            >
              {badgeText}
            </span>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss Aperture"
              className="text-neutral-500 hover:text-neutral-300 p-1 rounded hover:bg-neutral-800/60 transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* High-density interactive controls container */}
        <div className="p-4 space-y-4">
          {typeof children === "function" ? children(controls) : children}
        </div>
      </div>
    </ApertureContext.Provider>
  );
}
