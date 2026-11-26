"use client";

import React, { useState } from "react";
import { Lock, Scale, CheckCircle2, AlertCircle } from "lucide-react";
import { useZeroLight } from "../context";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";

export interface JournalLine {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface LedgerBalancerProps {
  journalId?: string;
  fiscalPeriod?: string;
  periodLocked?: boolean;
  currency?: string;
  initialLines: JournalLine[];
  onPostJournal?: (lines: JournalLine[]) => void;
  className?: string;
}

/**
 * ERP General Ledger double-entry journal editor with real-time Debit vs Credit
 * reconciliation bar and fiscal period lock status.
 */
export function LedgerBalancer({
  journalId = "JE-2026-0418",
  fiscalPeriod = "FY26-Q3",
  periodLocked = false,
  currency = "₹",
  initialLines,
  onPostJournal,
  className = "",
}: LedgerBalancerProps) {
  const { tokens, scaled } = useZeroLight();
  const [lines, setLines] = useState<JournalLine[]>(initialLines);

  const totalDebit = lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
  const diff = Math.abs(totalDebit - totalCredit);
  const isBalanced = diff < 0.01 && totalDebit > 0;

  const updateAmount = (id: string, field: "debit" | "credit", value: string) => {
    const num = Math.max(0, Number(value) || 0);
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: num } : l)));
  };

  return (
    <div
      style={{
        backgroundColor: tokens.universalFillColor,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        borderStyle: "solid",
        borderRadius: `${scaled.scaledCardRadius}px`,
        color: tokens.textIconColor,
        boxShadow: scaled.cardShadow,
      }}
      className={`overflow-hidden ${className}`}
    >
      <div
        style={{ borderColor: tokens.universalBorderColor }}
        className="p-4 border-b flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 opacity-70" />
          <div>
            <h3 className="text-xs font-bold tracking-tight">General Ledger Journal Entry</h3>
            <p className="text-[11px] opacity-65 font-sans tabular-nums">
              {journalId} &bull; {fiscalPeriod}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {periodLocked && (
            <Badge variant="neutral" size="xs">
              <Lock className="w-3 h-3 mr-1 inline" /> Period Locked
            </Badge>
          )}
          <Badge variant={isBalanced ? "healthy" : "critical"} size="xs">
            {isBalanced ? "Balanced" : `Variance ${currency}${diff.toLocaleString()}`}
          </Badge>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              style={{ backgroundColor: tokens.hoverBackplateTint, borderColor: tokens.universalBorderColor }}
              className="border-b text-[11px] uppercase tracking-wider opacity-70"
            >
              <th className="py-2 px-3 font-semibold">Account Code</th>
              <th className="py-2 px-3 font-semibold">GL Account</th>
              <th className="py-2 px-3 font-semibold text-right">Debit ({currency})</th>
              <th className="py-2 px-3 font-semibold text-right">Credit ({currency})</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: tokens.universalBorderColor }}>
            {lines.map((line) => (
              <tr key={line.id}>
                <td className="py-2 px-3 font-sans tabular-nums font-semibold opacity-75">{line.accountCode}</td>
                <td className="py-2 px-3 font-medium">{line.accountName}</td>
                <td className="py-2 px-3 text-right">
                  <input
                    type="number"
                    min={0}
                    disabled={periodLocked}
                    value={line.debit}
                    onChange={(e) => updateAmount(line.id, "debit", e.target.value)}
                    style={{
                      borderColor: tokens.universalBorderColor,
                      borderRadius: `${scaled.scaledRadius}px`,
                    }}
                    className="w-28 px-2 py-1 text-right border font-sans tabular-nums text-xs bg-transparent"
                  />
                </td>
                <td className="py-2 px-3 text-right">
                  <input
                    type="number"
                    min={0}
                    disabled={periodLocked}
                    value={line.credit}
                    onChange={(e) => updateAmount(line.id, "credit", e.target.value)}
                    style={{
                      borderColor: tokens.universalBorderColor,
                      borderRadius: `${scaled.scaledRadius}px`,
                    }}
                    className="w-28 px-2 py-1 text-right border font-sans tabular-nums text-xs bg-transparent"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{ backgroundColor: tokens.hoverBackplateTint, borderColor: tokens.universalBorderColor }}
        className="p-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs"
      >
        <div className="flex items-center gap-4 font-sans tabular-nums">
          <span>Debits: <strong>{currency}{totalDebit.toLocaleString()}</strong></span>
          <span>Credits: <strong>{currency}{totalCredit.toLocaleString()}</strong></span>
          {isBalanced ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Reconciled to Zero
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-rose-600 font-semibold">
              <AlertCircle className="w-3.5 h-3.5" /> Out of Balance
            </span>
          )}
        </div>

        <Button
          variant="primary"
          size="sm"
          disabled={!isBalanced || periodLocked}
          onClick={() => onPostJournal?.(lines)}
        >
          Post Journal Entry
        </Button>
      </div>
    </div>
  );
}
