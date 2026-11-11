"use client";

import React from "react";
import { ZeroLightProvider, DEFAULT_TOKENS } from "@/components/zerolight";
import { SettingsView } from "@/components/zerolight/views/settings-view";

export default function SettingsPage() {
  return (
    <ZeroLightProvider tokens={DEFAULT_TOKENS}>
      <SettingsView />
    </ZeroLightProvider>
  );
}
