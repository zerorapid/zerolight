"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { useAuth } from "./auth-context";

export function SignInCard() {
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 select-none font-sans relative overflow-hidden">
      {/* Subtle Atmospheric Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-emerald-500/10 via-zinc-400/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      <motion.div
        key={shakeKey}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: error ? [-8, 8, -6, 6, -3, 3, 0] : 0,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Floating Apple/Airbnb-grade Glassmorphic Card */}
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-7 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md mx-auto">
              {/* Minimalist Geometric ZeroLight Delta Mark */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 22 20 2 20 12 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                ZeroLight Enterprise
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Sign in to unlock the platform dashboard & design system
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="zerolight"
                  className="w-full px-3.5 py-2.5 pl-10 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all font-sans"
                />
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Access PIN / Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter 8-digit PIN..."
                  className="w-full px-3.5 py-2.5 pl-10 pr-10 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all font-sans"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-3 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-semibold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.985] disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 dark:border-zinc-900/30 border-t-white dark:border-t-zinc-900 rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick autofill pill for testing */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-full bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Autofill Credentials (zerolight / 22121997)</span>
            </button>
          </div>

          {/* Security attestation */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>FIDO2 Hardware Key & Session Token Encrypted</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
