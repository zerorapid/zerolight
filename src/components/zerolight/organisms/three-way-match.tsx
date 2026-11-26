"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, FileCheck2 } from "lucide-react";
import { useZeroLight } from "../context";
import { useMorphic, MorphicSlot, type MorphicStage } from "../morphic-engine";
import { Badge } from "../atoms/badge";

export interface ThreeWayMatchLine {
  sku: string;
  description: string;
  poQty: number;
  grnQty: number;
  invoiceQty: number;
  poUnitPrice: number;
  invoiceUnitPrice: number;
}

export interface ThreeWayMatchProps {
  poNumber: string;
  grnNumber: string;
  invoiceNumber: string;
  currency?: string;
  lines: ThreeWayMatchLine[];
  stage?: MorphicStage;
  className?: string;
}

/**
 * ERP procurement three-way matching table comparing Purchase Order (PO),
 * Goods Receipt Note (GRN), and Supplier Invoice for quantity and price variances.
 */
export function ThreeWayMatch({
  poNumber,
  grnNumber,
  invoiceNumber,
  currency = "₹",
  lines,
  stage,
  className = "",
}: ThreeWayMatchProps) {
  const { tokens, scaled } = useZeroLight();
  const m = useMorphic(stage);

  const evaluated = lines.map((line) => {
    const qtyMismatch = line.poQty !== line.grnQty || line.grnQty !== line.invoiceQty;
    const priceMismatch = Math.abs(line.poUnitPrice - line.invoiceUnitPrice) > 0.001;
    const status = qtyMismatch ? "qty-variance" : priceMismatch ? "price-variance" : "matched";
    return { ...line, status };
  });

  const allMatched = evaluated.every((l) => l.status === "matched");

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
      className={`overflow-hidden ${className}`}
    >
      <div
        style={{ borderColor: tokens.universalBorderColor }}
        className={`${m.isM1 ? "p-3" : "p-4"} border-b flex flex-wrap items-center justify-between gap-3`}
      >
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 opacity-70" />
          <div>
            <h3 className="text-xs font-bold tracking-tight">Three-Way Procurement Match</h3>
            <MorphicSlot minStage="M2" stage={stage}>
              <p className="text-[11px] opacity-65 font-sans tabular-nums">
                {poNumber} &bull; {grnNumber} &bull; {invoiceNumber}
              </p>
            </MorphicSlot>
          </div>
        </div>

        <Badge variant={allMatched ? "healthy" : "degraded"} size="xs">
          {allMatched ? "100% Matched" : "Variance Detected"}
        </Badge>
      </div>

      <MorphicSlot minStage="M2" stage={stage}>
        <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              style={{
                backgroundColor: tokens.hoverBackplateTint,
                borderColor: tokens.universalBorderColor,
              }}
              className="border-b text-[11px] uppercase tracking-wider opacity-70"
            >
              <th className="py-2.5 px-3 font-semibold">Item / SKU</th>
              <th className="py-2.5 px-3 font-semibold text-right">PO Qty</th>
              <th className="py-2.5 px-3 font-semibold text-right">GRN Qty</th>
              <th className="py-2.5 px-3 font-semibold text-right">Inv Qty</th>
              <th className="py-2.5 px-3 font-semibold text-right">PO Rate</th>
              <th className="py-2.5 px-3 font-semibold text-right">Inv Rate</th>
              <th className="py-2.5 px-3 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: tokens.universalBorderColor }}>
            {evaluated.map((row) => (
              <tr key={row.sku} className="hover:bg-zinc-50/60 transition-colors">
                <td className="py-2.5 px-3">
                  <div className="font-semibold">{row.description}</div>
                  <div className="text-[10px] opacity-60 font-sans tabular-nums">{row.sku}</div>
                </td>
                <td className="py-2.5 px-3 text-right font-sans tabular-nums">{row.poQty}</td>
                <td className="py-2.5 px-3 text-right font-sans tabular-nums">{row.grnQty}</td>
                <td className="py-2.5 px-3 text-right font-sans tabular-nums">{row.invoiceQty}</td>
                <td className="py-2.5 px-3 text-right font-sans tabular-nums">
                  {currency}{row.poUnitPrice.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right font-sans tabular-nums">
                  {currency}{row.invoiceUnitPrice.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right">
                  {row.status === "matched" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {row.status === "qty-variance" ? "Qty Mismatch" : "Rate Variance"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </MorphicSlot>
    </div>
  );
}
