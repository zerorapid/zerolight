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
    <div>
      <StudioSectionCard
        title="Data Visualization"
        badge={`${tokens.chartPalette || "emerald"} • ${tokens.chartStrokeWidth || 2.5}px`}
        accentBadge
      >
        <div className="space-y-1.5 text-xs">
          <span className="text-zinc-300">Palette</span>
          <div className="flex flex-wrap gap-1">
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
                className={`px-2 py-1 rounded-md text-[11px] transition-colors cursor-pointer flex items-center gap-1.5 border ${
                  tokens.chartPalette === key
                    ? "bg-white/[0.14] text-white font-medium border-white/20"
                    : "bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:text-zinc-200"
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
            <span className="text-zinc-300">Primary color</span>
            <label className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] cursor-pointer">
              <span
                style={{ backgroundColor: tokens.chartPrimaryColor || "#10B981" }}
                className="w-3.5 h-3.5 rounded-sm border border-white/20"
              />
              <span className="text-[11px] text-zinc-300 tabular-nums">
                {(tokens.chartPrimaryColor || "#10B981").toUpperCase()}
              </span>
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

          <div className="flex items-center justify-between gap-1">
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
                className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                  (tokens.chartPrimaryColor || "#10B981").toLowerCase() === color.toLowerCase()
                    ? "ring-2 ring-white/80 ring-offset-2 ring-offset-[#0E0E10] scale-105"
                    : "border-white/20 opacity-80 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-0.5">
          <span className="text-zinc-300">Secondary color</span>
          <label className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] cursor-pointer">
            <span
              style={{ backgroundColor: tokens.chartSecondaryColor || "#8B5CF6" }}
              className="w-3.5 h-3.5 rounded-sm border border-white/20"
            />
            <span className="text-[11px] text-zinc-300 tabular-nums">
              {(tokens.chartSecondaryColor || "#8B5CF6").toUpperCase()}
            </span>
            <input
              type="color"
              data-testid="chart-secondary-color"
              value={tokens.chartSecondaryColor || "#8B5CF6"}
              onChange={(e) =>
                setTokens((prev) => ({ ...prev, chartSecondaryColor: e.target.value }))
              }
              className="sr-only"
            />
          </label>
        </div>
      </StudioSectionCard>

      <StudioAccordion
        title="Chart geometry & grid"
        summary={`${tokens.chartStrokeWidth || 2.5}px • ${tokens.chartGridStyle || "dotted"}`}
      >
        <div className="space-y-1 text-xs">
          <span className="text-zinc-300">Line stroke</span>
          <div className="grid grid-cols-4 gap-0.5 p-0.5 rounded-lg bg-white/[0.04]">
            {([1.5, 2.0, 2.5, 3.0] as ChartStrokePreset[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setTokens((prev) => ({ ...prev, chartStrokeWidth: s }))}
                className={`py-1 rounded-md text-[11px] transition-colors cursor-pointer tabular-nums ${
                  tokens.chartStrokeWidth === s
                    ? "bg-white/[0.14] text-white font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {s}px
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <span className="text-zinc-300">Fill opacity</span>
          <div className="grid grid-cols-4 gap-0.5 p-0.5 rounded-lg bg-white/[0.04]">
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
                className={`py-1 rounded-md text-[11px] transition-colors cursor-pointer tabular-nums ${
                  Math.abs((tokens.chartFillOpacity ?? 0.25) - val) < 0.05
                    ? "bg-white/[0.14] text-white font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <span className="text-zinc-300">Grid lines</span>
          <div className="grid grid-cols-3 gap-0.5 p-0.5 rounded-lg bg-white/[0.04]">
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
                className={`py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                  tokens.chartGridStyle === key
                    ? "bg-white/[0.14] text-white font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </StudioAccordion>

      <StudioSectionCard
        title="Iconography"
        badge={`${tokens.iconScaleMultiplier.toFixed(2)}x • ${tokens.iconStrokeWidth}px`}
        accentBadge
      >
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-zinc-300">Icon scale</span>
            <span className="text-zinc-400 tabular-nums">
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
            className="w-full cursor-pointer accent-zinc-200"
          />
          <div className="grid grid-cols-4 gap-0.5 p-0.5 rounded-lg bg-white/[0.04]">
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
                className={`py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                  Math.abs(tokens.iconScaleMultiplier - val) < 0.02
                    ? "bg-white/[0.14] text-white font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <span className="text-zinc-300">Stroke width</span>
          <div className="grid grid-cols-5 gap-0.5 p-0.5 rounded-lg bg-white/[0.04]">
            {([1.25, 1.5, 2.0, 2.5, 3.0] as IconStrokePreset[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setTokens((prev) => ({ ...prev, iconStrokeWidth: s }))}
                className={`py-1 rounded-md text-[11px] transition-colors cursor-pointer tabular-nums ${
                  tokens.iconStrokeWidth === s
                    ? "bg-white/[0.14] text-white font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {s}px
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <span className="text-zinc-300">Fill style</span>
          <div className="grid grid-cols-3 gap-0.5 p-0.5 rounded-lg bg-white/[0.04]">
            {(
              [
                { key: "none", label: "None" },
                { key: "subtle", label: "Subtle" },
                { key: "currentColor", label: "Solid" },
              ] as { key: IconFillPreset; label: string }[]
            ).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTokens((prev) => ({ ...prev, iconFill: key }))}
                className={`py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                  tokens.iconFill === key
                    ? "bg-white/[0.14] text-white font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 text-xs pt-1">
          <div className="flex items-center justify-between">
            <span className="text-zinc-300">Icon color</span>
            <label className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] cursor-pointer">
              <span
                style={{ backgroundColor: tokens.iconColor }}
                className="w-3.5 h-3.5 rounded-sm border border-white/20"
              />
              <span className="text-[11px] text-zinc-300 tabular-nums">
                {tokens.iconColor.toUpperCase()}
              </span>
              <input
                type="color"
                value={tokens.iconColor}
                onChange={(e) => setTokens((prev) => ({ ...prev, iconColor: e.target.value }))}
                className="sr-only"
              />
            </label>
          </div>

          <div className="flex items-center justify-between gap-1">
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
                className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                  tokens.iconColor.toLowerCase() === color.toLowerCase()
                    ? "ring-2 ring-white/80 ring-offset-2 ring-offset-[#0E0E10] scale-105"
                    : "border-white/20 opacity-80 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>

      </StudioSectionCard>

    </div>
  );
}
