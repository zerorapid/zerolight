"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { ZeroLightProvider, DEFAULT_TOKENS } from "@/components/zerolight";
import { Card } from "@/components/zerolight/atoms/card";
import { Input } from "@/components/zerolight/atoms/input";
import { Button } from "@/components/zerolight/atoms/button";
import { Badge } from "@/components/zerolight/atoms/badge";
import { AlertBanner } from "@/components/zerolight/molecules/alert-banner";

function TeamLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Invalid password.");
        return;
      }
      const params = new URLSearchParams(window.location.search);
      const nextPath = params.get("next") || "/";
      window.location.assign(nextPath.startsWith("/") ? nextPath : "/");
    } catch {
      setError("Network error while verifying password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] flex items-center justify-center p-4 font-sans">
      <Card padding="lg" className="w-full max-w-md space-y-6 bg-white">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <Badge variant="neutral" size="xs" showDot={false}>
              Zerorapid Internal
            </Badge>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950 pt-1">
            ZeroLight Component Platform
          </h1>
          <p className="text-xs text-zinc-500">
            Sign in with your Zerorapid team password to access all 200+ UI components, Visual Studio Dock, and the shadcn registry.
          </p>
        </div>

        {error && (
          <AlertBanner severity="critical" title="Access Denied" description={error} />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="zl-team-password"
              className="block text-xs font-semibold text-zinc-800"
            >
              Team Password
            </label>
            <Input
              id="zl-team-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Zerorapid team password..."
              iconLeft={<Lock className="w-3.5 h-3.5" />}
              autoFocus
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={loading || !password.trim()}
            iconRight={<ArrowRight className="w-3.5 h-3.5" />}
            className="w-full"
          >
            {loading ? "Verifying..." : "Enter ZeroLight Platform"}
          </Button>
        </form>

        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
          <span>Protected by Edge Middleware</span>
          <a
            href="https://zerorapid.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-700 font-medium"
          >
            zerorapid.in
          </a>
        </div>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <ZeroLightProvider tokens={DEFAULT_TOKENS}>
      <TeamLoginForm />
    </ZeroLightProvider>
  );
}
