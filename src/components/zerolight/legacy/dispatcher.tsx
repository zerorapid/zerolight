"use client";

import React from "react";
import { DiscountOverride } from "./discount-override";
import { BatchDispatch } from "./batch-dispatch";

export interface IntentPayload {
  id: string;
  aperture: "discount_override" | "batch_dispatch" | string;
  props: Record<string, any>;
}

export interface ZeroLightDispatcherProps {
  payload: IntentPayload;
  onSettled: (id: string, delta: any) => void;
  className?: string;
}

export function ZeroLightDispatcher({
  payload,
  onSettled,
  className = "",
}: ZeroLightDispatcherProps) {
  const { id, aperture, props } = payload;

  switch (aperture) {
    case "discount_override":
      return (
        <DiscountOverride
          id={id}
          invoiceId={props.invoiceId || "INV-UNKNOWN"}
          baseAmount={props.baseAmount ?? 0}
          clientTier={props.clientTier || "Standard"}
          onSettled={(delta) => onSettled(id, delta)}
          className={className}
        />
      );

    case "batch_dispatch":
      return (
        <BatchDispatch
          id={id}
          batchId={props.batchId || "BAT-UNKNOWN"}
          unitCount={props.unitCount ?? 0}
          destination={props.destination || "Unassigned Logistics Hub"}
          onSettled={(delta) => onSettled(id, delta)}
          className={className}
        />
      );

    default:
      return (
        <div
          role="alert"
          data-dispatcher-state="fault"
          className={`rounded-lg border border-amber-900/60 bg-neutral-950 p-4 space-y-3 font-mono text-xs shadow-xl ${className}`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-amber-950/80">
            <div className="flex items-center gap-2 text-amber-400 font-semibold uppercase tracking-wider text-[11px]">
              <svg
                className="w-4 h-4 text-amber-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
              <span>ZeroLight Runtime Fault: Uncataloged Aperture</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              ERR_APERTURE_UNREGISTERED
            </span>
          </div>

          <div className="space-y-1 text-neutral-400 font-sans text-xs">
            <p>
              The intent dispatcher failed to resolve aperture type:{" "}
              <code className="text-amber-300 font-mono bg-neutral-900 px-1 py-0.5 rounded border border-neutral-800">
                &quot;{aperture}&quot;
              </code>
            </p>
            <p className="text-[11px] text-neutral-500">
              Valid registry apertures: &quot;discount_override&quot;, &quot;batch_dispatch&quot;.
            </p>
          </div>

          <div className="p-2.5 rounded bg-neutral-900/90 border border-neutral-800 text-[10px] text-neutral-400 overflow-x-auto">
            <div className="text-neutral-500 mb-1 uppercase tracking-wider font-semibold">
              Trace Payload Diagnostic:
            </div>
            <pre>
              <code>{JSON.stringify({ id, aperture, props }, null, 2)}</code>
            </pre>
          </div>
        </div>
      );
  }
}
