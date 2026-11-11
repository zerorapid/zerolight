"use client";

import React from "react";
import { useZeroLight } from "../context";
import { MoreVertical } from "lucide-react";

export interface CurrencyPillProps {
  flag: string;
  currencyCode: string;
  balance: string;
  monthlyLimit: string;
  status?: "Active" | "Inactive";
  onMenuClick?: () => void;
  className?: string;
}

export function CurrencyPill({
  flag,
  currencyCode,
  balance,
  monthlyLimit,
  status = "Active",
  onMenuClick,
  className = "",
}: CurrencyPillProps) {
  const { tokens, scaled } = useZeroLight();

  const isActive = status === "Active";

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledRadius}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: tokens.universalFillColor,
        transition: scaled.transitionStyle,
      }}
      className={`p-3 border flex flex-col justify-between select-none min-w-[130px] flex-1 shadow-2xs hover:border-neutral-400 transition-colors ${className}`}
    >
      <div className="flex items-center justify-between pb-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
          <span className="text-sm">{flag}</span>
          <span className="tabular-nums tracking-tight">{currencyCode}</span>
        </div>
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="text-neutral-400 hover:text-neutral-700 p-0.5 rounded cursor-pointer"
            aria-label="Wallet options"
          >
            <MoreVertical size={13} />
          </button>
        )}
      </div>

      <div
        style={{ color: tokens.textIconColor }}
        className="font-bold tabular-nums text-xs tracking-tight"
        title={balance}
      >
        {balance}
      </div>

      <div className="text-[10px] text-neutral-400 truncate pt-0.5" title={monthlyLimit}>
        {monthlyLimit}
      </div>

      <div className="pt-2">
        <span
          className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
            isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-neutral-100 text-neutral-500 border border-neutral-200"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
