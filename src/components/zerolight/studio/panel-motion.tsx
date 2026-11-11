"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, RefreshCw } from "lucide-react";
import { MotionPhysicsPreset, ScaledTokens, ZeroLightTokens } from "../types";
import { StudioAccordion, StudioSectionCard } from "./studio-ui";

export interface PanelMotionProps {
  tokens: ZeroLightTokens;
  scaled: ScaledTokens;
  setTokens: React.Dispatch<React.SetStateAction<ZeroLightTokens>>;
  sandboxSlideActive: boolean;
  setSandboxSlideActive: React.Dispatch<React.SetStateAction<boolean>>;
  sandboxReplayKey: number;
  setSandboxReplayKey: React.Dispatch<React.SetStateAction<number>>;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerToast: (msg: string) => void;
}

export function PanelMotion({
  tokens,
  scaled,
  setTokens,
  sandboxSlideActive,
  setSandboxSlideActive,
  sandboxReplayKey,
  setSandboxReplayKey,
  setIsDrawerOpen,
  triggerToast,
}: PanelMotionProps) {
  return (
    <div className="space-y-3">
      <StudioSectionCard
        title="Motion Physics Engine"
        badge={`${tokens.motionPhysics} • ${tokens.motionSpeedMultiplier ?? 1.0}x`}
        accentBadge
      >
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-300 font-medium">Physics Profiles</span>
            <span className="text-[10px] text-neutral-500">6 Presets</span>
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
                className={`py-1.5 px-2 rounded-lg text-xs border transition-colors cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  tokens.motionPhysics === key
                    ? "bg-white text-black border-white font-semibold shadow-sm"
                    : "bg-[#222226] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
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

        <div className="space-y-1.5 text-xs pt-2 border-t border-[#27272A]/70">
          <div className="flex justify-between items-center">
            <span className="text-neutral-300 font-medium">Animation Speed / Time Dilation</span>
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
                    : "bg-[#222226] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </StudioSectionCard>

      {/* Live Motion Sandbox */}
      <div className="rounded-xl bg-[#18181B] border border-[#27272A] p-3.5 space-y-2.5">
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

        <div className="h-11 w-full bg-[#111113] rounded-lg border border-[#27272A] flex items-center justify-center overflow-hidden px-2 relative">
          <svg className="w-full h-9 overflow-visible" viewBox="0 0 200 40">
            <line x1="8" y1="20" x2="192" y2="20" stroke="#27272A" strokeWidth="1" strokeDasharray="3 3" />
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
              if (
                tokens.motionPhysics === "linear" &&
                tokens.motionStiffness === undefined &&
                tokens.motionDamping === undefined
              ) {
                const riseEnd = Math.max(
                  24,
                  Math.min(180, Math.round(90 / (tokens.motionSpeedMultiplier ?? 1)))
                );
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

        <button
          type="button"
          onClick={() => setSandboxSlideActive((v) => !v)}
          className="w-full p-1 rounded-lg bg-[#111113] border border-[#27272A] flex items-center justify-between relative cursor-pointer"
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

        <motion.div
          key={sandboxReplayKey}
          initial={{
            opacity: tokens.motionPhysics === "instant" ? 1 : 0,
            y: scaled.motionConfig.distance,
            scale: scaled.motionConfig.popover.initial.scale,
          }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={scaled.motionConfig.transition}
          className="px-2.5 py-1.5 rounded-lg bg-[#111113] border border-[#27272A] flex items-center justify-between text-[10px] text-neutral-300"
        >
          <span>Slide Travel Preview ({scaled.motionConfig.distance}px)</span>
          <span className="text-emerald-400 font-semibold tabular-nums">
            {Math.round((scaled.motionConfig.spring.mass ?? 0.9) * 10) / 10}kg
          </span>
        </motion.div>

        <div className="flex items-center gap-2 pt-0.5">
          <motion.button
            type="button"
            whileHover={{ scale: scaled.motionConfig.hoverScale }}
            whileTap={{ scale: scaled.motionConfig.tapScale }}
            transition={scaled.motionConfig.transition}
            onClick={() =>
              triggerToast(
                `Spring pulse triggered (${tokens.motionPhysics} • ${tokens.motionSpeedMultiplier ?? 1}x)`
              )
            }
            className="flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold bg-white text-black hover:bg-neutral-200 cursor-pointer shadow-xs text-center transform-gpu"
          >
            Test Tap &amp; Hover
          </motion.button>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="py-1.5 px-2.5 rounded-lg text-xs font-medium border border-[#3F3F46] text-neutral-300 hover:text-white hover:border-neutral-400 cursor-pointer text-center"
          >
            Test Drawer
          </button>
        </div>
      </div>

      {/* Collapsible Spring Fine-Tuning Accordion */}
      <StudioAccordion
        title="Fine-Tune Spring & Micro-Physics"
        summary={`K=${scaled.motionConfig.spring.stiffness} • D=${scaled.motionConfig.spring.damping}`}
      >
        <div className="space-y-2.5 text-xs">
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
              onChange={(e) =>
                setTokens((prev) => ({ ...prev, motionStiffness: Number(e.target.value) }))
              }
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
              onChange={(e) =>
                setTokens((prev) => ({ ...prev, motionDamping: Number(e.target.value) }))
              }
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
              onChange={(e) =>
                setTokens((prev) => ({ ...prev, motionMass: Number(e.target.value) }))
              }
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
              onChange={(e) =>
                setTokens((prev) => ({ ...prev, motionDistance: Number(e.target.value) }))
              }
              className="w-full accent-white bg-[#27272A] rounded h-1 cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-1.5 text-xs pt-2 border-t border-[#27272A]/70">
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
                    : "bg-[#222226] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                }`}
              >
                <span>{label}</span>
                <span className="text-[9px] opacity-70">{sub}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 text-xs pt-2 border-t border-[#27272A]/70">
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
              { label: "90%", val: 0.9, sub: "Deep" },
            ].map(({ label, val, sub }) => (
              <button
                key={label}
                type="button"
                onClick={() => setTokens((prev) => ({ ...prev, tapScale: val }))}
                className={`py-1 rounded text-xs border transition-colors cursor-pointer flex flex-col items-center ${
                  scaled.motionConfig.tapScale === val
                    ? "bg-white text-black border-white font-semibold shadow-sm"
                    : "bg-[#222226] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                }`}
              >
                <span>{label}</span>
                <span className="text-[9px] opacity-70">{sub}</span>
              </button>
            ))}
          </div>
        </div>
      </StudioAccordion>
    </div>
  );
}
