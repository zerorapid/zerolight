"use client";

import React from "react";
import { ZeroLightProvider, DEFAULT_TOKENS } from "@/components/zerolight";
import { AiAssistantView } from "@/components/zerolight/views/ai-assistant-view";

export default function AiAssistantPage() {
  return (
    <ZeroLightProvider tokens={DEFAULT_TOKENS}>
      <AiAssistantView />
    </ZeroLightProvider>
  );
}
