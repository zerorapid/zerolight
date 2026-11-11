"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, Code2, RefreshCw, X } from "lucide-react";
import {
  ZeroLightTokens,
  ScaledTokens,
  THEME_PRESETS,
  ThemePresetId,
  CornerRadiusPreset,
  HeightDensityPreset,
  MenuOffsetPreset,
  MotionPhysicsPreset,
  IconStrokePreset,
  IconFillPreset,
  ChartPalettePreset,
  ChartGridPreset,
  ChartStrokePreset,
} from "../types";

export interface StudioInspectorProps {
  tokens: ZeroLightTokens;
  scaled: ScaledTokens;
  setTokens: React.Dispatch<React.SetStateAction<ZeroLightTokens>>;
  handleUpdateTokens: (updates: Partial<ZeroLightTokens>) => void;
  handleResetDefaults: () => void;
  studioCategory: "all" | "motion" | "general" | "colors" | "geometry" | "icons" | "dataviz";
  setStudioCategory: React.Dispatch<React.SetStateAction<"all" | "motion" | "general" | "colors" | "geometry" | "icons" | "dataviz">>;
  sandboxSlideActive: boolean;
  setSandboxSlideActive: React.Dispatch<React.SetStateAction<boolean>>;
  sandboxReplayKey: number;
  setSandboxReplayKey: React.Dispatch<React.SetStateAction<number>>;
  setIsExportOpen: (open: boolean) => void;
  isMobileStudioOpen: boolean;
  setIsMobileStudioOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerToast: (msg: string) => void;
}

export function StudioInspector({
  tokens,
  scaled,
  setTokens,
  handleUpdateTokens,
  handleResetDefaults,
  studioCategory,
  setStudioCategory,
  sandboxSlideActive,
  setSandboxSlideActive,
  sandboxReplayKey,
  setSandboxReplayKey,
  setIsExportOpen,
  isMobileStudioOpen,
  setIsMobileStudioOpen,
  setIsDrawerOpen,
  triggerToast,
}: StudioInspectorProps) {
  return (
    <>
      <div className="space-y-4">
        {/* Dark Mode Header with Reset */}
        <div className="flex justify-between items-center pb-2 border-b border-[#27272A]">
          <span className="text-xs font-semibold tracking-wide text-white">
            Visual Studio
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white text-black hover:bg-neutral-200 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Code2 className="w-3 h-3" />
              <span>Export</span>
            </button>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs text-neutral-400 hover:text-white transition-colors font-medium cursor-pointer"
            >
              Reset
            </button>
            {isMobileStudioOpen && (
              <button
                type="button"
                onClick={() => setIsMobileStudioOpen(false)}
                className="xl:hidden ml-1 p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Segmented Switcher */}
        <div className="grid grid-cols-4 gap-1 bg-[#18181B] p-1 rounded-lg border border-[#27272A]">
          {[
            { id: "all", label: "All" },
            { id: "motion", label: "Motion" },
            { id: "general", label: "General" },
            { id: "colors", label: "Colors" },
            { id: "geometry", label: "Geometry" },
            { id: "icons", label: "Icons" },
            { id: "dataviz", label: "Data Viz" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setStudioCategory(cat.id as any)}
              className={`py-1 text-[11px] font-medium rounded transition-all text-center cursor-pointer ${
                studioCategory === cat.id
                  ? "bg-white text-black font-semibold shadow-xs"
                  : "text-neutral-400 hover:text-white hover:bg-[#27272A]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── 1. General & Scale ── */}
        {(studioCategory === "all" || studioCategory === "general") && (
          <div className="space-y-3 p-3 rounded-xl bg-[#18181B] border border-[#27272A]">
            <div className="flex items-center justify-between pb-1 border-b border-[#27272A]/70">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                General &amp; Scale
              </span>
              <span className="text-[10px] text-neutral-500 tabular-nums">
                {tokens.scaleMultiplier.toFixed(2)}x
              </span>
            </div>

            {/* Dark Mode Scale Multiplier Controller */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-300">
                  Scale multiplier
                </span>
                <span className="text-xs font-medium text-white bg-[#27272A] border border-[#3F3F46] px-1.5 py-0.5 rounded shadow-sm">
                  {tokens.scaleMultiplier.toFixed(2)}x
                </span>
              </div>

              <input
                type="range"
                min="0.80"
                max="1.30"
                step="0.05"
                value={tokens.scaleMultiplier}
                onChange={(e) =>
                  setTokens((prev) => ({ ...prev, scaleMultiplier: Number(e.target.value) }))
                }
                className="w-full cursor-pointer accent-white"
              />

              <div className="grid grid-cols-4 gap-1 pt-1">
                {[
                  { label: "0.85x", val: 0.85 },
                  { label: "1.00x", val: 1.0 },
                  { label: "1.15x", val: 1.15 },
                  { label: "1.30x", val: 1.3 },
                ].map(({ label, val }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setTokens((prev) => ({ ...prev, scaleMultiplier: val }))}
                    className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                      tokens.scaleMultiplier === val
                        ? "bg-white text-black border-white font-semibold shadow-sm"
                        : "bg-[#27272A] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Section */}
            <div className="space-y-1 text-xs pt-2 border-t border-[#27272A]/70">
              <div className="flex justify-between">
                <span className="text-neutral-300">Base font scale</span>
                <span className="text-neutral-400 font-medium">{tokens.fontSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="18"
                step="1"
                value={tokens.fontSize}
                onChange={(e) => setTokens((prev) => ({ ...prev, fontSize: Number(e.target.value) }))}
                className="w-full cursor-pointer accent-white"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 pt-0.5">
                <span>12px Compact</span>
                <span>14px Standard</span>
                <span>18px Roomy</span>
              </div>
            </div>

            {/* Bi-Directional RTL / LTR Engine */}
            <div className="space-y-1.5 pt-2 border-t border-[#27272A]/70">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-400">Layout Direction</span>
                <span className="text-[10px] text-neutral-500 uppercase">{tokens.direction || "ltr"}</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {(
                  [
                    { key: "ltr", label: "LTR (Left-to-Right)" },
                    { key: "rtl", label: "RTL (Right-to-Left)" },
                  ] as const
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTokens((prev) => ({ ...prev, direction: key }))}
                    className={`py-1.5 px-2 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                      (tokens.direction || "ltr") === key
                        ? "bg-white text-black border-white font-semibold shadow-sm"
                        : "bg-[#27272A] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 2. Motion Physics & Animation Engine ── */}
        {(studioCategory === "all" || studioCategory === "motion") && (
          <div className="space-y-3 p-3 rounded-xl bg-[#18181B] border border-[#27272A]">
            <div className="flex items-center justify-between pb-1 border-b border-[#27272A]/70">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Motion Physics Engine
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold tabular-nums">
                {tokens.motionPhysics} • {tokens.motionSpeedMultiplier ?? 1.0}x
              </span>
            </div>

            {/* Presets Grid */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-300 font-medium">Physics Profiles</span>
                <span className="text-[10px] text-neutral-500 font-sans">6 Presets</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(
                  [
                    { key: "instant", label: "Instant", badge: "0ms" },
                    { key: "snappy", label: "Snappy", badge: "120ms" },
                    { key: "damped", label: "Damped", badge: "200ms" },
                    { key: "gentle", label: "Gentle", badge: "320ms" },
                    { key: "elastic", label: "Elastic", badge: "360ms" },
                    { key: "linear", label: "Linear", badge: "150ms" },
                  ] as { key: MotionPhysicsPreset; label: string; badge: string }[]
                ).map(({ key, label, badge }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setTokens((prev) => ({
                        ...prev,
                        motionPhysics: key,
                        motionStiffness: undefined,
                        motionDamping: undefined,
                        motionMass: undefined,
                        motionDistance: undefined,
                        tapScale: undefined,
                        hoverScale: undefined,
                      }))
                    }
                    className={`py-1.5 px-2 rounded text-xs border transition-colors cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      tokens.motionPhysics === key
                        ? "bg-white text-black border-white font-semibold shadow-sm"
                        : "bg-[#27272A] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                    }`}
                  >
                    <span>{label}</span>
                    <span
                      className={`text-[9px] tabular-nums ${
                        tokens.motionPhysics === key ? "text-neutral-600" : "text-neutral-500"
                      }`}
                    >
                      {badge}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-neutral-400 leading-snug pt-0.5">
                {scaled.motionConfig.description}
              </p>
            </div>

            {/* Speed Multiplier / Time Dilation */}
            <div className="space-y-1 text-xs pt-2 border-t border-[#27272A]/70">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Animation Speed / Time Dilation</span>
                <span className="text-neutral-400 font-medium tabular-nums">
                  {tokens.motionSpeedMultiplier ?? 1.0}x
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {[
                  { label: "0.25x", val: 0.25 },
                  { label: "0.5x", val: 0.5 },
                  { label: "1.0x", val: 1.0 },
                  { label: "1.5x", val: 1.5 },
                  { label: "2.0x", val: 2.0 },
                ].map(({ label, val }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setTokens((prev) => ({ ...prev, motionSpeedMultiplier: val }))}
                    className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                      (tokens.motionSpeedMultiplier ?? 1.0) === val
                        ? "bg-white text-black border-white font-semibold shadow-sm"
                        : "bg-[#27272A] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Spring Stiffness, Damping, Mass & Distance */}
            <div className="space-y-2.5 text-xs pt-2 border-t border-[#27272A]/70">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Spring Stiffness (Tension)</span>
                  <span className="text-neutral-400 font-medium tabular-nums">
                    {scaled.motionConfig.spring.stiffness}
                  </span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="700"
                  step="10"
                  value={Math.min(700, scaled.motionConfig.spring.stiffness)}
                  onChange={(e) => setTokens((prev) => ({ ...prev, motionStiffness: Number(e.target.value) }))}
                  className="w-full accent-white bg-[#27272A] rounded h-1 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Spring Damping (Friction)</span>
                  <span className="text-neutral-400 font-medium tabular-nums">
                    {scaled.motionConfig.spring.damping}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="55"
                  step="1"
                  value={Math.min(55, scaled.motionConfig.spring.damping)}
                  onChange={(e) => setTokens((prev) => ({ ...prev, motionDamping: Number(e.target.value) }))}
                  className="w-full accent-white bg-[#27272A] rounded h-1 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Spring Mass (Inertia)</span>
                  <span className="text-neutral-400 font-medium tabular-nums">
                    {(scaled.motionConfig.spring.mass ?? 0.9).toFixed(1)}kg
                  </span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="2.5"
                  step="0.1"
                  value={scaled.motionConfig.spring.mass ?? 0.9}
                  onChange={(e) => setTokens((prev) => ({ ...prev, motionMass: Number(e.target.value) }))}
                  className="w-full accent-white bg-[#27272A] rounded h-1 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Entrance Slide Distance</span>
                  <span className="text-neutral-400 font-medium tabular-nums">
                    {scaled.motionConfig.distance}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="2"
                  value={scaled.motionConfig.distance}
                  onChange={(e) => setTokens((prev) => ({ ...prev, motionDistance: Number(e.target.value) }))}
                  className="w-full accent-white bg-[#27272A] rounded h-1 cursor-pointer"
                />
              </div>
            </div>

            {/* Hover Lift Scale */}
            <div className="space-y-1 text-xs pt-2 border-t border-[#27272A]/70">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Tactile Hover Lift</span>
                <span className="text-neutral-400 font-medium tabular-nums">
                  {scaled.motionConfig.hoverScale.toFixed(2)}x
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { label: "1.00x", val: 1.0, sub: "Flat" },
                  { label: "1.01x", val: 1.01, sub: "Subtle" },
                  { label: "1.02x", val: 1.02, sub: "Crisp" },
                  { label: "1.04x", val: 1.04, sub: "Pop" },
                ].map(({ label, val, sub }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setTokens((prev) => ({ ...prev, hoverScale: val }))}
                    className={`py-1 rounded text-xs border transition-colors cursor-pointer flex flex-col items-center ${
                      scaled.motionConfig.hoverScale === val
                        ? "bg-white text-black border-white font-semibold shadow-sm"
                        : "bg-[#27272A] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                    }`}
                  >
                    <span>{label}</span>
                    <span className="text-[9px] opacity-70">{sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Haptic Tap Compression Scale */}
            <div className="space-y-1 text-xs pt-2 border-t border-[#27272A]/70">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Tactile Tap Compression</span>
                <span className="text-neutral-400 font-medium tabular-nums">
                  {Math.round(scaled.motionConfig.tapScale * 100)}%
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { label: "100%", val: 1.0, sub: "Rigid" },
                  { label: "98%", val: 0.98, sub: "Subtle" },
                  { label: "95%", val: 0.95, sub: "Tactile" },
                  { label: "90%", val: 0.90, sub: "Deep" },
                ].map(({ label, val, sub }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setTokens((prev) => ({ ...prev, tapScale: val }))}
                    className={`py-1 rounded text-xs border transition-colors cursor-pointer flex flex-col items-center ${
                      scaled.motionConfig.tapScale === val
                        ? "bg-white text-black border-white font-semibold shadow-sm"
                        : "bg-[#27272A] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                    }`}
                  >
                    <span>{label}</span>
                    <span className="text-[9px] opacity-70">{sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Live Motion Oscilloscope & Sandbox */}
            <div className="p-3 rounded-lg bg-[#27272A]/70 border border-[#3F3F46] space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-neutral-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  Live Motion Sandbox
                </span>
                <button
                  type="button"
                  onClick={() => setSandboxReplayKey((k) => k + 1)}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Replay</span>
                </button>
              </div>

              {/* Dynamic Physics Response Waveform (reflects stiffness, damping, mass, speed & preset) */}
              <div className="h-11 w-full bg-[#18181B] rounded border border-[#3F3F46]/70 flex items-center justify-center overflow-hidden px-2 relative">
                <svg className="w-full h-9 overflow-visible" viewBox="0 0 200 40">
                  <line x1="8" y1="20" x2="192" y2="20" stroke="#3F3F46" strokeWidth="1" strokeDasharray="3 3" />
                  {(() => {
                    if (tokens.motionPhysics === "instant") {
                      return (
                        <path
                          d="M 8 34 L 24 34 L 24 10 L 192 10"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="2"
                          strokeLinecap="square"
                        />
                      );
                    }
                    if (tokens.motionPhysics === "linear" && tokens.motionStiffness === undefined && tokens.motionDamping === undefined) {
                      const riseEnd = Math.max(24, Math.min(180, Math.round(90 / (tokens.motionSpeedMultiplier ?? 1))));
                      return (
                        <path
                          d={`M 8 34 L ${riseEnd} 10 L 192 10`}
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      );
                    }
                    const k = scaled.motionConfig.spring.stiffness;
                    const c = scaled.motionConfig.spring.damping;
                    const m = scaled.motionConfig.spring.mass ?? 0.9;
                    const omega = Math.sqrt(k / m) * 0.35;
                    const zeta = c / (2 * Math.sqrt(k * m));
                    const points: string[] = [];
                    for (let i = 0; i <= 46; i++) {
                      const t = (i / 46) * 2.2;
                      const x = 8 + (i / 46) * 184;
                      const env = Math.exp(-zeta * omega * t * 1.4);
                      const disp =
                        zeta < 1
                          ? env * Math.cos(omega * Math.sqrt(Math.max(0.05, 1 - zeta * zeta)) * t * 2.4)
                          : env * (1 + omega * t);
                      const y = Math.max(3, Math.min(37, 14 + disp * 20));
                      points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
                    }
                    return (
                      <path
                        d={points.join(" ")}
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    );
                  })()}
                </svg>
              </div>

              {/* Interactive Spring Pill Glide Test */}
              <button
                type="button"
                onClick={() => setSandboxSlideActive((v) => !v)}
                className="w-full p-1 rounded-lg bg-[#18181B] border border-[#3F3F46] flex items-center justify-between relative cursor-pointer"
              >
                <div className="flex-1 py-1 text-[10px] font-semibold text-center relative z-10 text-neutral-300">
                  State A
                </div>
                <div className="flex-1 py-1 text-[10px] font-semibold text-center relative z-10 text-neutral-300">
                  State B
                </div>
                <motion.div
                  animate={{ x: sandboxSlideActive ? "100%" : "0%" }}
                  transition={scaled.motionConfig.pillTransition}
                  className="absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] rounded bg-emerald-500/25 border border-emerald-400/70"
                />
              </button>

              {/* Entrance Distance & Replay Box */}
              <motion.div
                key={sandboxReplayKey}
                initial={{
                  opacity: tokens.motionPhysics === "instant" ? 1 : 0,
                  y: scaled.motionConfig.distance,
                  scale: scaled.motionConfig.popover.initial.scale,
                }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={scaled.motionConfig.transition}
                className="px-2.5 py-1.5 rounded bg-[#18181B] border border-[#3F3F46]/80 flex items-center justify-between text-[10px] text-neutral-300"
              >
                <span>Slide Travel Preview ({scaled.motionConfig.distance}px)</span>
                <span className="text-emerald-400 font-semibold tabular-nums">
                  {Math.round((scaled.motionConfig.spring.mass ?? 0.9) * 10) / 10}kg
                </span>
              </motion.div>

              {/* Live Interactive Physics Controls */}
              <div className="flex items-center gap-2 pt-0.5">
                <motion.button
                  type="button"
                  whileHover={{ scale: scaled.motionConfig.hoverScale }}
                  whileTap={{ scale: scaled.motionConfig.tapScale }}
                  transition={scaled.motionConfig.transition}
                  onClick={() => triggerToast(`Spring pulse triggered (${tokens.motionPhysics} • ${tokens.motionSpeedMultiplier ?? 1}x)`)}
                  className="flex-1 py-1.5 px-2 rounded text-xs font-semibold bg-white text-black hover:bg-neutral-200 cursor-pointer shadow-xs text-center transform-gpu"
                >
                  Test Tap &amp; Hover
                </motion.button>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="py-1.5 px-2.5 rounded text-xs font-medium border border-[#3F3F46] text-neutral-300 hover:text-white hover:border-neutral-400 cursor-pointer text-center"
                >
                  Test Drawer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── 2. Colors ── */}
        {(studioCategory === "all" || studioCategory === "colors") && (
          <div className="space-y-2.5 p-3 rounded-xl bg-[#18181B] border border-[#27272A]">
            <div className="flex items-center justify-between pb-1 border-b border-[#27272A]/70">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Colors &amp; Theme Polarity
              </span>
              <span className="text-[10px] text-neutral-500 tabular-nums">5 Tokens</span>
            </div>

            {/* 1-Click Theme Polarity Presets */}
            <div className="space-y-1.5 pb-2 border-b border-[#27272A]/60">
              <span className="text-[11px] text-neutral-400">Theme Polarity</span>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(THEME_PRESETS) as ThemePresetId[]).map((presetKey) => {
                  const preset = THEME_PRESETS[presetKey];
                  const isActive =
                    tokens.universalFillColor.toLowerCase() === (preset.tokens.universalFillColor || "").toLowerCase() &&
                    tokens.primaryButtonColor.toLowerCase() === (preset.tokens.primaryButtonColor || "").toLowerCase() &&
                    tokens.universalBorderColor.toLowerCase() === (preset.tokens.universalBorderColor || "").toLowerCase();
                  return (
                    <button
                      key={presetKey}
                      type="button"
                      data-testid={`theme-preset-${presetKey}`}
                      onClick={() => {
                        handleUpdateTokens(preset.tokens);
                        triggerToast(`Theme preset: ${preset.label}`);
                      }}
                      className={`px-2 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                        isActive
                          ? "bg-white text-black border-white font-semibold shadow-sm"
                          : "bg-[#222226] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                      }`}
                    >
                      <span
                        style={{ backgroundColor: preset.swatchBg, borderColor: preset.swatchAccent }}
                        className="w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center"
                      >
                        <span
                          style={{ backgroundColor: preset.swatchAccent }}
                          className="w-1.5 h-1.5 rounded-full"
                        />
                      </span>
                      <span className="truncate">{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Universal Border Color */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300">Border</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-400 font-medium">{tokens.universalBorderColor.toUpperCase()}</span>
                <label className="relative cursor-pointer">
                  <span
                    style={{ backgroundColor: tokens.universalBorderColor }}
                    className="w-5 h-5 rounded border border-white/20 shadow-sm block transition-transform hover:scale-105"
                  />
                  <input
                    type="color"
                    value={tokens.universalBorderColor}
                    onChange={(e) => setTokens((prev) => ({ ...prev, universalBorderColor: e.target.value }))}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            {/* Universal Fill Color */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300">Surface</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-400 font-medium">{tokens.universalFillColor.toUpperCase()}</span>
                <label className="relative cursor-pointer">
                  <span
                    style={{ backgroundColor: tokens.universalFillColor }}
                    className="w-5 h-5 rounded border border-white/20 shadow-sm block transition-transform hover:scale-105"
                  />
                  <input
                    type="color"
                    value={tokens.universalFillColor}
                    onChange={(e) => setTokens((prev) => ({ ...prev, universalFillColor: e.target.value }))}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            {/* Text & Icon Color */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300">Text &amp; icons</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-400 font-medium">{tokens.textIconColor.toUpperCase()}</span>
                <label className="relative cursor-pointer">
                  <span
                    style={{ backgroundColor: tokens.textIconColor }}
                    className="w-5 h-5 rounded border border-white/20 shadow-sm block transition-transform hover:scale-105"
                  />
                  <input
                    type="color"
                    value={tokens.textIconColor}
                    onChange={(e) => setTokens((prev) => ({ ...prev, textIconColor: e.target.value }))}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            {/* Primary Action Color */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300">Primary action</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-400 font-medium">{tokens.primaryButtonColor.toUpperCase()}</span>
                <label className="relative cursor-pointer">
                  <span
                    style={{ backgroundColor: tokens.primaryButtonColor }}
                    className="w-5 h-5 rounded border border-white/20 shadow-sm block transition-transform hover:scale-105"
                  />
                  <input
                    type="color"
                    value={tokens.primaryButtonColor}
                    onChange={(e) => setTokens((prev) => ({ ...prev, primaryButtonColor: e.target.value }))}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            {/* Hover Backplate Tint */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300">Hover tint</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-400 font-medium">{tokens.hoverBackplateTint.toUpperCase()}</span>
                <label className="relative cursor-pointer">
                  <span
                    style={{ backgroundColor: tokens.hoverBackplateTint }}
                    className="w-5 h-5 rounded border border-white/20 shadow-sm block transition-transform hover:scale-105"
                  />
                  <input
                    type="color"
                    value={tokens.hoverBackplateTint}
                    onChange={(e) => setTokens((prev) => ({ ...prev, hoverBackplateTint: e.target.value }))}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ── 3. Geometry ── */}
        {(studioCategory === "all" || studioCategory === "geometry") && (
          <div className="space-y-3 p-3 rounded-xl bg-[#18181B] border border-[#27272A]">
            <div className="flex items-center justify-between pb-1 border-b border-[#27272A]/70">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Geometry
              </span>
              <span className="text-[10px] text-neutral-500 tabular-nums">
                {tokens.borderWidth}px • {tokens.cornerRadius === 999 ? "Pill" : `${tokens.cornerRadius}px`}
              </span>
            </div>

            {/* Border Width Slider */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Border width</span>
                {tokens.borderWidth === 0 ? (
                  <span className="text-[10px] text-amber-400 font-medium bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.5 rounded">
                    0px • Luminance Mode
                  </span>
                ) : (
                  <span className="text-neutral-400 font-medium">{tokens.borderWidth}px</span>
                )}
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={tokens.borderWidth}
                onChange={(e) => setTokens((prev) => ({ ...prev, borderWidth: Number(e.target.value) }))}
                className="w-full cursor-pointer accent-white"
              />
              {tokens.borderWidth === 0 && (
                <p className="text-[10px] text-neutral-500 pt-0.5">
                  Compensatory luminance fill & atmospheric elevation active to prevent edge bleed.
                </p>
              )}
            </div>

            {/* Corner Radius */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-300">Corner radius</span>
                <span className="text-neutral-400 font-medium">
                  {tokens.cornerRadius === 999 ? "Pill" : `${tokens.cornerRadius}px`}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {([0, 8, 16, 24, 999] as CornerRadiusPreset[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setTokens((prev) => ({ ...prev, cornerRadius: r }))}
                    className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                      tokens.cornerRadius === r
                        ? "bg-white text-black border-white font-semibold shadow-sm"
                        : "bg-[#27272A] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                    }`}
                  >
                    {r === 0 ? "0px" : r === 999 ? "Pill" : `${r}px`}
                  </button>
                ))}
              </div>
            </div>

            {/* Height Density */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-300">Height density</span>
                <span className="text-neutral-400 font-medium">{tokens.heightDensity}px</span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {([36, 40, 44, 48, 52] as HeightDensityPreset[]).map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setTokens((prev) => ({ ...prev, heightDensity: h }))}
                    className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                      tokens.heightDensity === h
                        ? "bg-white text-black border-white font-semibold shadow-sm"
                        : "bg-[#27272A] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                    }`}
                  >
                    {h}px
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Offset */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-300">Menu offset</span>
                <span className="text-neutral-400 font-medium">{tokens.menuOffsetGap}px</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {([4, 8, 10, 14] as MenuOffsetPreset[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setTokens((prev) => ({ ...prev, menuOffsetGap: g }))}
                    className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                      tokens.menuOffsetGap === g
                        ? "bg-white text-black border-white font-semibold shadow-sm"
                        : "bg-[#27272A] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                    }`}
                  >
                    {g}px
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 4. Iconography & Vectors ── */}
        {(studioCategory === "all" || studioCategory === "icons") && (
          <div className="space-y-3 p-3 rounded-xl bg-[#18181B] border border-[#27272A]">
            <div className="flex items-center justify-between pb-1 border-b border-[#27272A]/70">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Iconography &amp; Vectors
              </span>
              <span className="text-[10px] text-emerald-400 tabular-nums">
                {tokens.iconScaleMultiplier.toFixed(2)}x • {tokens.iconStrokeWidth}px
              </span>
            </div>

            {/* Icon Scale Multiplier */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Icon scale</span>
                <span className="text-neutral-400 font-medium">
                  {tokens.iconScaleMultiplier.toFixed(2)}x ({scaled.iconSize}px)
                </span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.50"
                step="0.05"
                value={tokens.iconScaleMultiplier}
                onChange={(e) =>
                  setTokens((prev) => ({ ...prev, iconScaleMultiplier: Number(e.target.value) }))
                }
                className="w-full cursor-pointer accent-white"
              />
              <div className="grid grid-cols-4 gap-1 pt-0.5">
                {[
                  { label: "0.85x", val: 0.85 },
                  { label: "1.00x", val: 1.0 },
                  { label: "1.20x", val: 1.2 },
                  { label: "1.40x", val: 1.4 },
                ].map(({ label, val }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setTokens((prev) => ({ ...prev, iconScaleMultiplier: val }))}
                    className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                      Math.abs(tokens.iconScaleMultiplier - val) < 0.02
                        ? "bg-white text-black border-white font-semibold shadow-sm"
                        : "bg-[#27272A] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Stroke Width */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Stroke width</span>
                <span className="text-neutral-400 font-medium">{tokens.iconStrokeWidth}px</span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {([1.25, 1.5, 2.0, 2.5, 3.0] as IconStrokePreset[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTokens((prev) => ({ ...prev, iconStrokeWidth: s }))}
                    className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                      tokens.iconStrokeWidth === s
                        ? "bg-white text-black border-white font-semibold shadow-sm"
                        : "bg-[#27272A] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                    }`}
                  >
                    {s}px
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Fill */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Fill style</span>
                <span className="text-neutral-400 font-medium capitalize">{tokens.iconFill}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(
                  [
                    { key: "none", label: "None" },
                    { key: "subtle", label: "Subtle Tint" },
                    { key: "currentColor", label: "Solid" },
                  ] as { key: IconFillPreset; label: string }[]
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTokens((prev) => ({ ...prev, iconFill: key }))}
                    className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                      tokens.iconFill === key
                        ? "bg-white text-black border-white font-semibold shadow-sm"
                        : "bg-[#27272A] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Color */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-300">Icon color</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400 font-sans font-medium">
                    {tokens.iconColor.toUpperCase()}
                  </span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.iconColor }}
                      className="w-5 h-5 rounded border border-white/20 shadow-sm block transition-transform hover:scale-105"
                    />
                    <input
                      type="color"
                      value={tokens.iconColor}
                      onChange={(e) => setTokens((prev) => ({ ...prev, iconColor: e.target.value }))}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Quick Swatches */}
              <div className="flex items-center justify-between gap-1 pt-1">
                {[
                  { label: "Muted", color: "#71717A" },
                  { label: "Deep", color: "#18181B" },
                  { label: "Brand", color: tokens.primaryButtonColor },
                  { label: "Indigo", color: "#6366F1" },
                  { label: "Emerald", color: "#10B981" },
                  { label: "Amber", color: "#F59E0B" },
                  { label: "Rose", color: "#EF4444" },
                ].map(({ label, color }) => (
                  <button
                    key={label}
                    type="button"
                    title={label}
                    onClick={() => setTokens((prev) => ({ ...prev, iconColor: color }))}
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 rounded-md border transition-all cursor-pointer ${
                      tokens.iconColor.toLowerCase() === color.toLowerCase()
                        ? "ring-2 ring-white ring-offset-1 ring-offset-[#121214] scale-110"
                        : "border-white/20 hover:scale-105 opacity-80 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 5. Data Visualization ── */}
        {(studioCategory === "all" || studioCategory === "dataviz") && (
          <div className="space-y-3 p-3 rounded-xl bg-[#18181B] border border-[#27272A]">
            <div className="flex items-center justify-between pb-1 border-b border-[#27272A]/70">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Data Visualization
              </span>
              <span className="text-[10px] text-emerald-400 tabular-nums capitalize">
                {tokens.chartPalette} • {tokens.chartStrokeWidth || 2.5}px
              </span>
            </div>

            {/* Chart Theme Palette Presets */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Palette preset</span>
                <span className="text-neutral-400 font-medium capitalize">{tokens.chartPalette}</span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {(
                  [
                    { key: "emerald", label: "Emerald", color: "#10B981" },
                    { key: "violet", label: "Violet", color: "#6366F1" },
                    { key: "sky", label: "Sky", color: "#0284C7" },
                    { key: "amber", label: "Amber", color: "#F59E0B" },
                    { key: "monochrome", label: "Mono", color: "#18181B" },
                  ] as { key: ChartPalettePreset; label: string; color: string }[]
                ).map(({ key, label, color }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setTokens((prev) => ({
                        ...prev,
                        chartPalette: key,
                        chartPrimaryColor: color,
                      }))
                    }
                    className={`py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer flex flex-col items-center gap-1 ${
                      tokens.chartPalette === key
                        ? "bg-white text-black border-white font-semibold shadow-sm"
                        : "bg-[#27272A] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                    }`}
                  >
                    <span
                      style={{ backgroundColor: color }}
                      className="w-2 h-2 rounded-full inline-block"
                    />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Chart Accent Color */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-300">Accent color</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400 font-sans font-medium">
                    {(tokens.chartPrimaryColor || "#10B981").toUpperCase()}
                  </span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.chartPrimaryColor || "#10B981" }}
                      className="w-5 h-5 rounded border border-white/20 shadow-sm block transition-transform hover:scale-105"
                    />
                    <input
                      type="color"
                      value={tokens.chartPrimaryColor || "#10B981"}
                      onChange={(e) =>
                        setTokens((prev) => ({ ...prev, chartPrimaryColor: e.target.value }))
                      }
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Quick Swatches */}
              <div className="flex items-center justify-between gap-1 pt-1">
                {[
                  { label: "Emerald", color: "#10B981" },
                  { label: "Lime", color: "#84CC16" },
                  { label: "Violet", color: "#8B5CF6" },
                  { label: "Sky", color: "#0EA5E9" },
                  { label: "Amber", color: "#F59E0B" },
                  { label: "Rose", color: "#F43F5E" },
                  { label: "Dark", color: "#18181B" },
                ].map(({ label, color }) => (
                  <button
                    key={label}
                    type="button"
                    title={label}
                    onClick={() =>
                      setTokens((prev) => ({ ...prev, chartPrimaryColor: color }))
                    }
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 rounded-md border transition-all cursor-pointer ${
                      (tokens.chartPrimaryColor || "#10B981").toLowerCase() === color.toLowerCase()
                        ? "ring-2 ring-white ring-offset-1 ring-offset-[#121214] scale-110"
                        : "border-white/20 hover:scale-105 opacity-80 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Chart Stroke Width */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Stroke width</span>
                <span className="text-neutral-400 font-medium">{tokens.chartStrokeWidth || 2.5}px</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {([1.5, 2.0, 2.5, 3.0] as ChartStrokePreset[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTokens((prev) => ({ ...prev, chartStrokeWidth: s }))}
                    className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                      tokens.chartStrokeWidth === s
                        ? "bg-white text-black border-white font-semibold shadow-sm"
                        : "bg-[#27272A] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                    }`}
                  >
                    {s}px
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Fill Opacity */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Gradient fill opacity</span>
                <span className="text-neutral-400 font-medium">
                  {Math.round((tokens.chartFillOpacity ?? 0.25) * 100)}%
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { label: "15%", val: 0.15 },
                  { label: "25%", val: 0.25 },
                  { label: "40%", val: 0.4 },
                  { label: "60%", val: 0.6 },
                ].map(({ label, val }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setTokens((prev) => ({ ...prev, chartFillOpacity: val }))}
                    className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                      Math.abs((tokens.chartFillOpacity ?? 0.25) - val) < 0.05
                        ? "bg-white text-black border-white font-semibold shadow-sm"
                        : "bg-[#27272A] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Lines Style */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Grid lines</span>
                <span className="text-neutral-400 font-medium capitalize">{tokens.chartGridStyle}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(
                  [
                    { key: "dotted", label: "Dotted" },
                    { key: "solid", label: "Solid" },
                    { key: "none", label: "Hidden" },
                  ] as { key: ChartGridPreset; label: string }[]
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTokens((prev) => ({ ...prev, chartGridStyle: key }))}
                    className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                      tokens.chartGridStyle === key
                        ? "bg-white text-black border-white font-semibold shadow-sm"
                        : "bg-[#27272A] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 1-Click Export Tokens CTA */}
        <div className="pt-2 border-t border-[#27272A]">
          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="w-full py-2.5 px-3 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors select-none"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Export Theme Tokens</span>
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-[#27272A] flex items-center justify-between text-xs text-neutral-500">
        <span>Visual Studio Engine</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
      </div>
    </>
  );
}
