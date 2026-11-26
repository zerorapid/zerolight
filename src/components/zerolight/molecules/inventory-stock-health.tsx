"use client";

import React from "react";
import { MapPin, Package, RefreshCw } from "lucide-react";
import { useZeroLight } from "../context";
import { useMorphic, MorphicSlot, type MorphicStage } from "../morphic-engine";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";

export interface InventoryStockHealthProps {
  sku: string;
  name: string;
  warehouseBin: string[];
  onHand: number;
  reorderPoint: number;
  maxCapacity: number;
  unit?: string;
  onReorder?: (sku: string) => void;
  stage?: MorphicStage;
  className?: string;
}

/**
 * ERP inventory stock health card with warehouse bin breadcrumb,
 * reorder threshold bar, and tabular-nums capacity telemetry.
 */
export function InventoryStockHealth({
  sku,
  name,
  warehouseBin,
  onHand,
  reorderPoint,
  maxCapacity,
  unit = "units",
  onReorder,
  stage,
  className = "",
}: InventoryStockHealthProps) {
  const { tokens, scaled } = useZeroLight();
  const m = useMorphic(stage);
  const pct = Math.min(100, Math.max(0, Math.round((onHand / Math.max(1, maxCapacity)) * 100)));
  const reorderPct = Math.min(100, Math.max(0, Math.round((reorderPoint / Math.max(1, maxCapacity)) * 100)));

  const status =
    onHand <= 0 ? "stockout" : onHand <= reorderPoint ? "low" : "optimal";

  const barColor =
    status === "stockout"
      ? "#EF4444"
      : status === "low"
      ? "#F59E0B"
      : tokens.primaryButtonColor || "#10B981";

  return (
    <div
      data-morphic-stage={m.stage}
      style={{
        backgroundColor: tokens.universalFillColor,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        borderStyle: "solid",
        borderRadius: `${scaled.scaledCardRadius}px`,
        color: tokens.textIconColor,
        boxShadow: m.isM1 ? "none" : scaled.cardShadow,
      }}
      className={`${m.padClass} ${m.isM1 ? "space-y-2" : "space-y-3"} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <Package className="w-3.5 h-3.5 opacity-60 shrink-0" />
            <span className="text-[11px] font-semibold opacity-60 font-sans tabular-nums">
              {sku}
            </span>
          </div>
          <h4 className="text-xs font-bold tracking-tight truncate" title={name}>
            {name}
          </h4>
        </div>

        <Badge
          variant={status === "optimal" ? "healthy" : status === "low" ? "degraded" : "critical"}
          size="xs"
        >
          {status === "optimal" ? "Optimal" : status === "low" ? "Reorder" : "Stockout"}
        </Badge>
      </div>

      {/* Warehouse Bin Breadcrumb (M2+) */}
      <MorphicSlot minStage="M2" stage={stage}>
        <div
          style={{
            backgroundColor: tokens.hoverBackplateTint,
            borderRadius: `${scaled.scaledRadius}px`,
          }}
          className="px-2.5 py-1.5 flex items-center gap-1.5 text-[11px] overflow-x-auto no-scrollbar"
        >
          <MapPin className="w-3 h-3 opacity-60 shrink-0" />
          {warehouseBin.map((segment, i) => (
            <React.Fragment key={`${segment}-${i}`}>
              <span className="font-medium whitespace-nowrap">{segment}</span>
              {i < warehouseBin.length - 1 && <span className="opacity-40">/</span>}
            </React.Fragment>
          ))}
        </div>
      </MorphicSlot>

      {/* Stock Bar with Reorder Marker */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-sans tabular-nums">
          <span>
            <strong className="font-bold">{onHand.toLocaleString()}</strong>{" "}
            <span className="opacity-60">/ {maxCapacity.toLocaleString()} {unit}</span>
          </span>
          <MorphicSlot minStage="M2" stage={stage}>
            <span className="opacity-60">Reorder at {reorderPoint.toLocaleString()}</span>
          </MorphicSlot>
        </div>

        <MorphicSlot minStage="M2" stage={stage}>
          <div
            style={{
              backgroundColor: tokens.hoverBackplateTint,
              borderRadius: "9999px",
            }}
            className="relative h-2 w-full overflow-hidden"
          >
            <div
              style={{ width: `${pct}%`, backgroundColor: barColor }}
              className="h-full transition-all duration-300"
            />
            <div
              style={{ left: `${reorderPct}%` }}
              title={`Reorder threshold: ${reorderPoint}`}
              className="absolute top-0 bottom-0 w-0.5 bg-zinc-900/50"
            />
          </div>
        </MorphicSlot>
      </div>

      <MorphicSlot minStage="M3" stage={stage}>
        {onReorder && status !== "optimal" && (
          <div className="pt-1 flex items-center justify-between gap-2">
            <span className="text-[11px] opacity-60 font-sans tabular-nums">
              Capacity: {pct}% &bull; Deficit: {Math.max(0, reorderPoint - onHand).toLocaleString()} {unit}
            </span>
            <Button
              variant="outline"
              size="sm"
              iconLeft={<RefreshCw className="w-3 h-3" />}
              onClick={() => onReorder(sku)}
            >
              Trigger Reorder PO
            </Button>
          </div>
        )}
      </MorphicSlot>
    </div>
  );
}
