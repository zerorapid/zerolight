"use client";

import React from "react";
import { useZeroLight } from "../context";
import { Wifi } from "lucide-react";

export interface PaymentCardProps {
  last4: string;
  expiry: string;
  cvv?: string;
  cardholderName?: string;
  cardholder?: string;
  brand?: "mastercard" | "visa";
  variant?: "dark" | "gradient" | "emerald";
  status?: "active" | "inactive";
  isDefault?: boolean;
  className?: string;
}

export function PaymentCard({
  last4,
  expiry,
  cvv = "611",
  brand = "mastercard",
  variant = "dark",
  status = "active",
  isDefault = false,
  className = "",
}: PaymentCardProps) {
  const { scaled } = useZeroLight();

  const getBackgroundStyle = () => {
    switch (variant) {
      case "gradient":
        return "linear-gradient(135deg, #064E3B 0%, #065F46 50%, #047857 100%)";
      case "emerald":
        return "linear-gradient(135deg, #10B981 0%, #059669 100%)";
      case "dark":
      default:
        return "linear-gradient(135deg, #18181B 0%, #09090B 100%)";
    }
  };

  return (
    <div
      style={{
        background: getBackgroundStyle(),
        borderRadius: `${scaled.scaledCardRadius}px`,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        transition: scaled.transitionStyle,
      }}
      className={`p-4 sm:p-5 text-white flex flex-col justify-between w-64 h-40 shrink-0 select-none relative overflow-hidden transform-gpu hover:scale-[1.02] transition-transform ${className}`}
    >
      {/* Decorative ambient lighting reflection */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

      {/* Top row: Contactless wave & Status */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 text-white/80">
          <Wifi className="w-4 h-4 rotate-90" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
            Debit
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-white text-[10px] font-semibold backdrop-blur-xs">
          {isDefault && <span className="text-emerald-300 font-semibold mr-1">DEFAULT •</span>}
          <span className={`w-1.5 h-1.5 rounded-full ${status === "active" ? "bg-emerald-400" : "bg-neutral-400"}`} />
          <span className="capitalize">{status}</span>
        </div>
      </div>

      {/* Middle row: Brand logo (Mastercard or Visa) */}
      <div className="flex items-center justify-between my-auto relative z-10">
        <div className="w-7 h-5 rounded bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
          <div className="w-3.5 h-2.5 rounded-xs bg-amber-300/60" />
        </div>

        {brand === "mastercard" ? (
          <div className="flex -space-x-2">
            <span className="w-5 h-5 rounded-full bg-rose-500/90 shadow-sm" />
            <span className="w-5 h-5 rounded-full bg-amber-500/90 shadow-sm" />
          </div>
        ) : (
          <span className="text-xs font-black tracking-widest italic text-white/90">
            VISA
          </span>
        )}
      </div>

      {/* Bottom row: Card Number & Details */}
      <div className="space-y-1.5 relative z-10">
        <div className="font-sans tabular-nums text-xs font-semibold tracking-wider text-white/90">
          •••• •••• •••• {last4}
        </div>
        <div className="flex items-center justify-between text-[10px] text-white/60 tabular-nums">
          <div>
            <span className="block text-[8px] uppercase tracking-wider text-white/40">Card Number</span>
            <span className="text-white/80 font-medium font-sans">•••• {last4}</span>
          </div>
          <div>
            <span className="block text-[8px] uppercase tracking-wider text-white/40">EXP</span>
            <span className="text-white/80 font-medium font-sans">{expiry}</span>
          </div>
          {cvv && (
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-white/40">CVV</span>
              <span className="text-white/80 font-medium font-sans">{cvv}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
