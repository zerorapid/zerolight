"use client";

import React from "react";
import { ZeroLightProvider, DEFAULT_TOKENS } from "@/components/zerolight";
import { AuthProvider, useAuth } from "@/components/zerolight/auth/auth-context";
import { SignInCard } from "@/components/zerolight/auth/sign-in-card";
import { DashboardShell } from "@/components/zerolight/dashboard/dashboard-shell";

function AuthenticatedApp() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <SignInCard />;
  }

  return <DashboardShell />;
}

export default function HomePage() {
  return (
    <ZeroLightProvider tokens={DEFAULT_TOKENS}>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </ZeroLightProvider>
  );
}
