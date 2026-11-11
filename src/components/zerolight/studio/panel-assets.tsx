"use client";

import React from "react";
import {
  ChartGridPreset,
  ChartPalettePreset,
  ChartStrokePreset,
  IconFillPreset,
  IconStrokePreset,
  ScaledTokens,
  ZeroLightTokens,
} from "../types";
import { StudioAccordion, StudioSectionCard } from "./studio-ui";

export interface PanelAssetsProps {
  tokens: ZeroLightTokens;
  scaled: ScaledTokens;
  setTokens: React.Dispatch<React.SetStateAction<ZeroLightTokens>>;
}

export function PanelAssets({ tokens, scaled, setTokens }: PanelAssetsProps) {
  return (
    <div className="space-y-3">
      <StudioSectionCard
        title="Iconography & Vectors"
        badge={`${tokens.iconScaleMultiplier.toFixed(2)}x • ${tokens.iconStrokeWidth}px`}
        accentBadge
      >
        {/* Icon Scale Multiplier */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-neutral-300 font-medium">Icon scale</span>
            <span className="text-neutral-400 font-medium tabular-nums">
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
                    : "bg-[#222226] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Icon Stroke Width */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-neutral-300 font-medium">Stroke width</span>
            <span className="text-neutral-400 font-medium tabular-nums">
              {tokens.iconStrokeWidth}px
            </span>
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
                    : "bg-[#222226] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                }`}
              >
                {s}px
              </button>
            ))}
          </div>
        </div>

        {/* Icon Fill */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-neutral-300 font-medium">Fill style</span>
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
                    : "bg-[#222226] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Icon Color */}
        <div className="space-y-1.5 text-xs pt-1 border-t border-[#27272A]/70">
          <div className="flex items-center justify-between">
            <span className="text-neutral-300 font-medium">Icon color</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-400 font-sans font-medium tabular-nums">
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

          <div className="flex items-center justify-between gap-1 pt-0.5">
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
                    ? "ring-2 ring-white ring-offset-1 ring-offset-[#18181B] scale-110"
                    : "border-white/20 hover:scale-105 opacity-80 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>
      </StudioSectionCard>

      <StudioSectionCard
        title="Data Visualization"
        badge={`${tokens.chartPalette || "emerald"} • ${tokens.chartStrokeWidth || 2.5}px`}
        accentBadge
      >
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-neutral-300 font-medium">Palette preset</span>
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
                    : "bg-[#222226] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                }`}
              >
                <span style={{ backgroundColor: color }} className="w-2 h-2 rounded-full" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-neutral-300 font-medium">Accent color</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-400 font-sans font-medium tabular-nums">
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

          <div className="flex items-center justify-between gap-1 pt-0.5">
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
                onClick={() => setTokens((prev) => ({ ...prev, chartPrimaryColor: color }))}
                style={{ backgroundColor: color }}
                className={`w-6 h-6 rounded-md border transition-all cursor-pointer ${
                  (tokens.chartPrimaryColor || "#10B981").toLowerCase() === color.toLowerCase()
                    ? "ring-2 ring-white ring-offset-1 ring-offset-[#18181B] scale-110"
                    : "border-white/20 hover:scale-105 opacity-80 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>
      </StudioSectionCard>

      <StudioAccordion
        title="Chart Geometry & Grid"
        summary={`${tokens.chartStrokeWidth || 2.5}px • ${tokens.chartGridStyle || "dotted"}`}
      >
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-neutral-300">Stroke width</span>
            <span className="text-neutral-400 font-medium tabular-nums">
              {tokens.chartStrokeWidth || 2.5}px
            </span>
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
                    : "bg-[#222226] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                }`}
              >
                {s}px
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-neutral-300">Gradient fill opacity</span>
            <span className="text-neutral-400 font-medium tabular-nums">
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
                    : "bg-[#222226] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
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
                    : "bg-[#222226] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </StudioAccordion>
    </div>
  );
}
