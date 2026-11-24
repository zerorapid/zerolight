"use client";

import React from "react";
import { ZeroLightProvider, DEFAULT_TOKENS } from "@/components/zerolight";
import { NotificationsView } from "@/components/zerolight/views/notifications-view";

export default function NotificationsPage() {
  return (
    <ZeroLightProvider tokens={DEFAULT_TOKENS}>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-8 max-w-5xl mx-auto flex flex-col">
        <NotificationsView />
      </div>
    </ZeroLightProvider>
  );
}
