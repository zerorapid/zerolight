"use client";

import React from "react";
import { ZeroLightProvider, DEFAULT_TOKENS } from "@/components/zerolight";
import { BillingView } from "@/components/zerolight/views/billing-view";

export default function BillingPage() {
  return (
    <ZeroLightProvider tokens={DEFAULT_TOKENS}>
      <BillingView />
    </ZeroLightProvider>
  );
}
