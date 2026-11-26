"use client";

import React, { useState } from "react";
import { Plus, Trash2, Receipt } from "lucide-react";
import { useZeroLight } from "../context";
import { useMorphic, MorphicSlot, type MorphicStage } from "../morphic-engine";
import { Button } from "../atoms/button";

export interface MatrixLineItem {
  id: string;
  sku: string;
  name: string;
  qty: number;
  unitPrice: number;
  taxPct: number;
}

export interface LineItemMatrixProps {
  title?: string;
  currency?: string;
  initialItems: MatrixLineItem[];
  onSave?: (items: MatrixLineItem[], grandTotal: number) => void;
  stage?: MorphicStage;
  className?: string;
}

/**
 * ERP Purchase Order & Invoice line-item matrix with inline quantity/rate
 * editing and automatic subtotal, tax, and grand total calculation.
 */
export function LineItemMatrix({
  title = "Purchase Order Line Items",
  currency = "₹",
  initialItems,
  onSave,
  stage,
  className = "",
}: LineItemMatrixProps) {
  const { tokens, scaled } = useZeroLight();
  const m = useMorphic(stage);
  const [items, setItems] = useState<MatrixLineItem[]>(initialItems);

  const updateItem = (id: string, field: "qty" | "unitPrice" | "taxPct", raw: string) => {
    const val = Math.max(0, Number(raw) || 0);
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: val } : it)));
  };

  const addRow = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}`,
        sku: `SKU-${100 + prev.length + 1}`,
        name: "Industrial Component",
        qty: 1,
        unitPrice: 1200,
        taxPct: 18,
      },
    ]);
  };

  const removeRow = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const subtotal = items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
  const taxTotal = items.reduce((s, it) => s + it.qty * it.unitPrice * (it.taxPct / 100), 0);
  const grandTotal = subtotal + taxTotal;

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
        className={`${m.isM1 ? "p-3" : "p-4"} border-b flex items-center justify-between gap-3`}
      >
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 opacity-70" />
          <h3 className="text-xs font-bold tracking-tight">{title}</h3>
        </div>
        <MorphicSlot minStage="M2" stage={stage}>
          <Button variant="outline" size="sm" iconLeft={<Plus className="w-3.5 h-3.5" />} onClick={addRow}>
            Add Line
          </Button>
        </MorphicSlot>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              style={{ backgroundColor: tokens.hoverBackplateTint, borderColor: tokens.universalBorderColor }}
              className="border-b text-[11px] uppercase tracking-wider opacity-70"
            >
              <th className="py-2 px-3 font-semibold">SKU / Item</th>
              <th className="py-2 px-3 font-semibold text-right">Qty</th>
              <th className="py-2 px-3 font-semibold text-right">Unit Rate</th>
              <th className="py-2 px-3 font-semibold text-right">Tax %</th>
              <th className="py-2 px-3 font-semibold text-right">Line Total</th>
              <th className="py-2 px-3" />
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: tokens.universalBorderColor }}>
            {items.map((item) => {
              const lineTotal = item.qty * item.unitPrice * (1 + item.taxPct / 100);
              return (
                <tr key={item.id}>
                  <td className="py-2 px-3">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-[10px] opacity-60 font-sans tabular-nums">{item.sku}</div>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <input
                      type="number"
                      min={0}
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                      style={{ borderColor: tokens.universalBorderColor, borderRadius: `${scaled.scaledRadius}px` }}
                      className="w-16 px-2 py-1 text-right border font-sans tabular-nums text-xs bg-transparent"
                    />
                  </td>
                  <td className="py-2 px-3 text-right">
                    <input
                      type="number"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, "unitPrice", e.target.value)}
                      style={{ borderColor: tokens.universalBorderColor, borderRadius: `${scaled.scaledRadius}px` }}
                      className="w-24 px-2 py-1 text-right border font-sans tabular-nums text-xs bg-transparent"
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-sans tabular-nums">{item.taxPct}%</td>
                  <td className="py-2 px-3 text-right font-bold font-sans tabular-nums">
                    {currency}{Math.round(lineTotal).toLocaleString()}
                  </td>
                  <td className="py-2 px-2 text-right">
                    <button
                      type="button"
                      onClick={() => removeRow(item.id)}
                      aria-label={`Remove ${item.sku}`}
                      className="p-1 rounded hover:bg-rose-50 text-zinc-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        style={{ backgroundColor: tokens.hoverBackplateTint, borderColor: tokens.universalBorderColor }}
        className="p-4 border-t flex flex-wrap items-center justify-between gap-4 text-xs"
      >
        <div className="flex flex-wrap items-center gap-5 font-sans tabular-nums">
          <span>Subtotal: <strong>{currency}{Math.round(subtotal).toLocaleString()}</strong></span>
          <span>Tax: <strong>{currency}{Math.round(taxTotal).toLocaleString()}</strong></span>
          <span className="text-sm font-extrabold">
            Grand Total: {currency}{Math.round(grandTotal).toLocaleString()}
          </span>
        </div>

        {onSave && (
          <Button variant="primary" size="sm" onClick={() => onSave(items, grandTotal)}>
            Save Line Items
          </Button>
        )}
      </div>
    </div>
  );
}
