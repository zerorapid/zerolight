"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ZeroLightProvider, DEFAULT_TOKENS, ZeroLightTokens } from "@/components/zerolight";
import { AuthProvider, useAuth } from "@/components/zerolight/auth/auth-context";
import { SignInCard } from "@/components/zerolight/auth/sign-in-card";
import { DashboardShell } from "@/components/zerolight/dashboard/dashboard-shell";

function AuthenticatedApp() {
  const { isAuthenticated } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);

  if (showSignIn && !isAuthenticated) {
    return (
      <div className="relative">
        <div className="fixed top-4 left-4 z-50">
          <button
            type="button"
            onClick={() => setShowSignIn(false)}
            className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-semibold text-zinc-800 shadow-xs hover:bg-zinc-50 cursor-pointer"
          >
            Back to Public Tools
          </button>
        </div>
        <SignInCard />
      </div>
    );
  }

  return <DashboardShell onRequireAuth={() => setShowSignIn(true)} />;
}

export default function HomePage() {
  const [tokens, setTokens] = useState<ZeroLightTokens>(DEFAULT_TOKENS);

  const handleUpdateTokens = (updates: Partial<ZeroLightTokens>) => {
    setTokens((prev) => ({ ...prev, ...updates }));
  };

  return (
    <ZeroLightProvider tokens={tokens} updateTokens={handleUpdateTokens}>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </ZeroLightProvider>
  );
}
