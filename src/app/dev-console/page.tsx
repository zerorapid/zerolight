"use client";

import React from "react";
import { ZeroLightProvider, DEFAULT_TOKENS } from "@/components/zerolight";
import { DevConsoleView } from "@/components/zerolight/views/dev-console-view";

export default function DevConsolePage() {
  return (
    <ZeroLightProvider tokens={DEFAULT_TOKENS}>
      <DevConsoleView />
    </ZeroLightProvider>
  );
}
