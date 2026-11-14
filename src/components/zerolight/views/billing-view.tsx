"use client";

import React from "react";
import { useZeroLight } from "../context";
import { BillingPortal } from "../organisms/billing-portal";

export function BillingView() {
  const { tokens } = useZeroLight();

  return (
    <div
      style={{
        backgroundColor: tokens.universalFillColor === "#FFFFFF" ? "#F8FAFC" : tokens.universalFillColor,
      }}
      className="min-h-screen p-6 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        <BillingPortal />
      </div>
    </div>
  );
}
