"use client";

import React, { useState } from "react";
import { Aperture, Settlement } from "./aperture";

export type TransportMode = "Standard Ground" | "Priority Air" | "Express Freight";

export interface BatchDispatchDelta {
  dispatchId: string;
  batchId: string;
  unitCount: number;
  destination: string;
  transportMode: TransportMode;
  insuranceCovered: boolean;
  departureWindowDays: number;
  authorizedAt: string;
}

export interface BatchDispatchProps {
  id: string;
  batchId: string;
  unitCount: number;
  destination: string;
  onSettled?: (delta: BatchDispatchDelta, record: Settlement<BatchDispatchDelta>) => void;
  className?: string;
}

const TRANSPORT_MODES: { mode: TransportMode; speed: string; costIndex: string }[] = [
  { mode: "Standard Ground", speed: "3-5d Transit", costIndex: "Economical" },
  { mode: "Priority Air", speed: "1-2d Transit", costIndex: "Expedited" },
  { mode: "Express Freight", speed: "Same-Day Priority", costIndex: "Critical" },
];

export function BatchDispatch({
  id,
  batchId,
  unitCount,
  destination,
  onSettled,
  className = "",
}: BatchDispatchProps) {
  const [transportMode, setTransportMode] = useState<TransportMode>("Priority Air");
  const [hasInsurance, setHasInsurance] = useState<boolean>(true);
  const [departureWindowDays, setDepartureWindowDays] = useState<number>(2);

  return (
    <Aperture<BatchDispatchDelta>
      id={id}
      title="Batch Dispatch"
      badgeText={batchId}
      badgeVariant="accent"
      className={className}
      onSettle={(record) => {
        onSettled?.(record.payload, record);
      }}
    >
      {({ settle, dismiss }) => {
        const handleAuthorizeAndCollapse = () => {
          const delta: BatchDispatchDelta = {
            dispatchId: id,
            batchId,
            unitCount,
            destination,
            transportMode,
            insuranceCovered: hasInsurance,
            departureWindowDays,
            authorizedAt: new Date().toISOString(),
          };

          // Destination city name extraction or full name
          const destinationLabel = destination.split(" ")[0] || destination;
          const insuranceSnippet = hasInsurance ? " • Insured" : "";
          const summary = `Dispatched ${batchId} (${unitCount.toLocaleString()} units) to ${destinationLabel} via ${transportMode} [Window: ${departureWindowDays}d]${insuranceSnippet}`;

          settle(summary, delta);
        };

        return (
          <div className="space-y-4">
            {/* Header: Batch ID, Unit Count, Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-3 border-b border-neutral-800/70 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 text-[11px]">Batch:</span>
                <span className="text-neutral-200 font-bold bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded">
                  {batchId}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 text-[11px]">Payload Units:</span>
                <span className="text-rose-400 font-semibold tabular-nums">
                  {unitCount.toLocaleString()} units
                </span>
              </div>
              <div className="flex items-center gap-2 sm:justify-end">
                <span className="text-neutral-500 text-[11px]">Destination:</span>
                <span className="text-neutral-300 truncate max-w-[150px]" title={destination}>
                  {destination}
                </span>
              </div>
            </div>

            {/* Transport Mode Selector Toggle Chips */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block">
                Transport Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {TRANSPORT_MODES.map(({ mode, speed, costIndex }) => {
                  const isSelected = transportMode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setTransportMode(mode)}
                      className={`flex flex-col text-left p-2.5 rounded border transition-all ${
                        isSelected
                          ? "bg-neutral-900 border-rose-500/80 ring-1 ring-rose-500/40 text-neutral-100 shadow-sm"
                          : "bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-300 hover:border-neutral-700"
                      }`}
                    >
                      <span className="text-xs font-semibold">{mode}</span>
                      <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-neutral-500">
                        <span>{speed}</span>
                        <span className={isSelected ? "text-rose-400" : ""}>{costIndex}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Departure Window Slider (1 to 7 business days) */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center text-xs">
                <label
                  htmlFor={`window-range-${id}`}
                  className="font-medium text-neutral-300 flex items-center gap-2"
                >
                  <span>Departure Window Allocation</span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    (Dock hold threshold)
                  </span>
                </label>
                <span className="font-mono text-xs font-bold text-rose-400 bg-rose-950/40 border border-rose-900/50 px-2 py-0.5 rounded">
                  {departureWindowDays} {departureWindowDays === 1 ? "Business Day" : "Business Days"}
                </span>
              </div>

              <input
                id={`window-range-${id}`}
                type="range"
                min="1"
                max="7"
                step="1"
                value={departureWindowDays}
                onChange={(e) => setDepartureWindowDays(Number(e.target.value))}
                className="w-full cursor-pointer accent-rose-500 transition-all"
              />

              <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                <span>1d (Express Release)</span>
                <span>3d (Standard)</span>
                <span>5d (Consolidated)</span>
                <span>7d (Max Hold)</span>
              </div>
            </div>

            {/* Insurance Toggle Checkbox */}
            <div className="p-3 rounded-md bg-neutral-900/50 border border-neutral-800/80">
              <label
                htmlFor={`insurance-${id}`}
                className="flex items-start gap-3 cursor-pointer select-none"
              >
                <input
                  id={`insurance-${id}`}
                  type="checkbox"
                  checked={hasInsurance}
                  onChange={(e) => setHasInsurance(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-neutral-700 bg-neutral-950 text-rose-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-rose-500"
                />
                <div className="text-xs space-y-0.5">
                  <div className="font-medium text-neutral-200">
                    Add Marine &amp; Transit Loss Coverage
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    Underwrites 110% CIF cargo replacement value against transit damage, carrier abandonment, or port demurrage.
                  </p>
                </div>
              </label>
            </div>

            {/* Action Buttons: Abort and Authorize Dispatch & Collapse */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-800/80">
              <button
                type="button"
                onClick={dismiss}
                className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 rounded border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 hover:bg-neutral-800 transition-colors"
              >
                Abort
              </button>

              <button
                type="button"
                onClick={handleAuthorizeAndCollapse}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-rose-500 hover:bg-rose-400 active:bg-rose-600 rounded shadow-md shadow-rose-950/50 transition-all active:scale-[0.98]"
              >
                <svg
                  className="w-3.5 h-3.5 text-neutral-950"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
                Authorize Dispatch &amp; Collapse
              </button>
            </div>
          </div>
        );
      }}
    </Aperture>
  );
}
