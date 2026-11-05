"use client";

import React, { useState } from "react";
import { Aperture, Settlement } from "./aperture";

export type ClientTier = "Standard" | "Enterprise" | "VIP";

export interface DiscountOverrideDelta {
  overrideId: string;
  invoiceId: string;
  clientTier: ClientTier;
  baseAmount: number;
  percentage: number;
  discountAmount: number;
  adjustedTotal: number;
  reason: string;
  timestamp: string;
}

export interface DiscountOverrideProps {
  id: string;
  invoiceId: string;
  baseAmount: number;
  clientTier: ClientTier;
  onSettled?: (delta: DiscountOverrideDelta, record: Settlement<DiscountOverrideDelta>) => void;
  className?: string;
}

const PRESET_REASONS = [
  "Volume SLA",
  "Early Settlement",
  "Dispute Waiver",
] as const;

export function DiscountOverride({
  id,
  invoiceId,
  baseAmount,
  clientTier,
  onSettled,
  className = "",
}: DiscountOverrideProps) {
  const [percentage, setPercentage] = useState<number>(10);
  const [selectedReason, setSelectedReason] = useState<string>("Volume SLA");

  // Real-time calculations
  const discountAmount = Number(((baseAmount * percentage) / 100).toFixed(2));
  const adjustedTotal = Number((baseAmount - discountAmount).toFixed(2));

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(val);

  const getTierBadgeStyle = (tier: ClientTier) => {
    switch (tier) {
      case "VIP":
        return "bg-amber-950/40 text-amber-300 border-amber-800/60";
      case "Enterprise":
        return "bg-purple-950/40 text-purple-300 border-purple-800/60";
      case "Standard":
      default:
        return "bg-neutral-800 text-neutral-300 border-neutral-700";
    }
  };

  return (
    <Aperture<DiscountOverrideDelta>
      id={id}
      title="Discount Override"
      badgeText={clientTier}
      badgeVariant={clientTier === "VIP" ? "warning" : clientTier === "Enterprise" ? "accent" : "default"}
      className={className}
      onSettle={(record) => {
        onSettled?.(record.payload, record);
      }}
    >
      {({ settle, dismiss }) => {
        const handleSignAndCollapse = () => {
          const delta: DiscountOverrideDelta = {
            overrideId: id,
            invoiceId,
            clientTier,
            baseAmount,
            percentage,
            discountAmount,
            adjustedTotal,
            reason: selectedReason,
            timestamp: new Date().toISOString(),
          };

          const summary = `${invoiceId} • -${percentage}% (-${formatCurrency(
            discountAmount
          )}) → Net ${formatCurrency(adjustedTotal)} • [${selectedReason}]`;

          settle(summary, delta);
        };

        return (
          <div className="space-y-4">
            {/* Context Meta Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800/70 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-neutral-400">Target Invoice:</span>
                <span className="font-semibold text-neutral-100">{invoiceId}</span>
                <span
                  className={`text-[10px] font-sans px-2 py-0.5 rounded border uppercase tracking-wider font-semibold ${getTierBadgeStyle(
                    clientTier
                  )}`}
                >
                  {clientTier} Tier
                </span>
              </div>
              <div className="text-right">
                <span className="text-neutral-500 mr-2">Base Balance:</span>
                <span className="text-neutral-200 font-semibold">
                  {formatCurrency(baseAmount)}
                </span>
              </div>
            </div>

            {/* Range Slider for Discount Adjustment (0% to 40%) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label
                  htmlFor={`discount-range-${id}`}
                  className="font-medium text-neutral-300 flex items-center gap-2"
                >
                  <span>Override Concession</span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    (Limit: 40% Max Policy)
                  </span>
                </label>
                <span className="font-mono text-sm font-bold text-rose-400 bg-rose-950/40 border border-rose-900/50 px-2 py-0.5 rounded">
                  {percentage}%
                </span>
              </div>

              <input
                id={`discount-range-${id}`}
                type="range"
                min="0"
                max="40"
                step="1"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="w-full cursor-pointer accent-rose-500 transition-all"
              />

              <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                <span>0% (Standard)</span>
                <span>10%</span>
                <span>20% (Director Approval)</span>
                <span>30%</span>
                <span>40% (VP Cap)</span>
              </div>
            </div>

            {/* Real-time Net Payable Calculator Board */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-md bg-neutral-900/70 border border-neutral-800 font-mono text-xs">
              <div className="space-y-0.5">
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-sans">
                  Gross Original
                </div>
                <div className="text-neutral-300 font-medium">
                  {formatCurrency(baseAmount)}
                </div>
              </div>

              <div className="space-y-0.5 border-x border-neutral-800/80 px-2">
                <div className="text-[10px] text-rose-400/90 uppercase tracking-wider font-sans">
                  Concession Delta
                </div>
                <div className="text-rose-400 font-medium">
                  -{formatCurrency(discountAmount)}
                </div>
              </div>

              <div className="space-y-0.5 pl-1">
                <div className="text-[10px] text-emerald-400/90 uppercase tracking-wider font-sans">
                  Net Payable Total
                </div>
                <div className="text-emerald-400 font-bold text-sm">
                  {formatCurrency(adjustedTotal)}
                </div>
              </div>
            </div>

            {/* Reason Tag Chips */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                Audited Justification Reason
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESET_REASONS.map((reason) => {
                  const isSelected = selectedReason === reason;
                  return (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setSelectedReason(reason)}
                      className={`text-xs px-2.5 py-1 rounded border transition-all ${
                        isSelected
                          ? "bg-neutral-100 text-neutral-900 border-neutral-100 font-semibold shadow-sm"
                          : "bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:text-neutral-200 hover:border-neutral-700"
                      }`}
                    >
                      {reason}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons: Cancel and Sign & Collapse */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-800/80">
              <button
                type="button"
                onClick={dismiss}
                className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 rounded border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSignAndCollapse}
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
                Sign & Collapse
              </button>
            </div>
          </div>
        );
      }}
    </Aperture>
  );
}
