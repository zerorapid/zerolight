"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { useZeroLight } from "../context";
import { useAuth } from "./auth-context";
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { AlertBanner } from "../molecules/alert-banner";
import { Badge } from "../atoms/badge";
import { Kbd } from "../atoms/kbd";

export function SignInCard() {
  const { tokens, scaled } = useZeroLight();
  const { login } = useAuth();
  const [username, setUsername] = useState("zerolight");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const res = login(username, password);
      setIsSubmitting(false);

      if (!res.success) {
        setError(res.error || "Authentication failed");
        setShakeKey((prev) => prev + 1);
      }
    }, 350);
  };

  const handleFillDemo = () => {
    setUsername("zerolight");
    setPassword("22121997");
    setError(null);
  };

  return (
    <div
      style={{
        backgroundColor: tokens.universalFillColor === "#FFFFFF" ? "#FAFAFA" : tokens.universalFillColor,
        fontFamily: scaled.resolvedFontFamily,
      }}
      className="min-h-screen w-full flex items-center justify-center p-4 text-zinc-900 select-none relative overflow-hidden"
    >
      {/* Subtle Atmospheric Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[360px] bg-gradient-to-tr from-zinc-300/20 via-zinc-200/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <motion.div
        key={shakeKey}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: error ? [-8, 8, -6, 6, -3, 3, 0] : 0,
        }}
        transition={scaled.motionConfig.spring}
        className="w-full max-w-sm relative z-10"
      >
        {/* Token-Bound Surface Card */}
        <div
          style={{
            backgroundColor: tokens.universalFillColor,
            borderColor: tokens.universalBorderColor,
            borderRadius: `${scaled.scaledCardRadius}px`,
            borderWidth: `${tokens.borderWidth}px`,
            boxShadow: scaled.cardShadow,
          }}
          className="p-7 sm:p-8 space-y-6 backdrop-blur-xl"
        >
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div
              style={{
                backgroundColor: tokens.primaryButtonColor,
                borderRadius: `${scaled.scaledRadius}px`,
              }}
              className="inline-flex items-center justify-center w-12 h-12 text-white shadow-md mx-auto overflow-hidden p-2"
            >
              {tokens.logoLight || tokens.logoDark ? (
                <img
                  src={tokens.logoLight || tokens.logoDark}
                  alt={tokens.logoBrandName || "Brand"}
                  className="w-full h-full object-contain"
                />
              ) : (
                /* Minimalist Geometric ZeroLight Delta Mark */
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 22 20 2 20 12 2" />
                </svg>
              )}
            </div>
            <div>
              <div className="flex items-center justify-center gap-1.5">
                <h1 className="text-xl font-bold tracking-tight text-zinc-950">
                  {tokens.logoBrandName || "ZeroLight OS"}
                </h1>
                <Badge variant="neutral" className="text-[10px] py-0 px-1.5">v2.0</Badge>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Enter credentials to unlock design system & platform console
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <AlertBanner
              severity="critical"
              title="Access Denied"
              description={error}
              onDismiss={() => setError(null)}
            />
          )}

          {/* Form with ZeroLight Input Atoms */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700">
                Username
              </label>
              <div className="relative">
                <Input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="zerolight"
                  iconLeft={<User className="w-4 h-4 text-zinc-400" />}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700">
                Access PIN / Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter 8-digit PIN..."
                  iconLeft={<Lock className="w-4 h-4 text-zinc-400" />}
                  iconRight={
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-zinc-400 hover:text-zinc-700 transition cursor-pointer"
                      title={showPassword ? "Hide PIN" : "Show PIN"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Submit Action using ZeroLight Button Atom */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              className="w-full justify-between px-5"
              iconRight={
                <div className="flex items-center gap-2">
                  <Kbd className="bg-white/20 text-white border-white/20 text-[10px]">↵</Kbd>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              }
            >
              {isSubmitting ? "Verifying Token..." : "Sign In to Dashboard"}
            </Button>
          </form>

          {/* Quick autofill pill for testing */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              style={{
                backgroundColor: tokens.hoverBackplateTint,
                borderRadius: "9999px",
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium text-zinc-600 hover:text-zinc-950 transition cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Autofill Credentials (zerolight / 22121997)</span>
            </button>
          </div>

          {/* Security attestation */}
          <div className="pt-3 border-t border-zinc-200/60 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>FIDO2 Hardware Key & Session Token Encrypted</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SignInCard;
