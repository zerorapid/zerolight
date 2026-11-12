"use client";

import React from "react";
import {
  CornerRadiusPreset,
  ElevationPreset,
  HeightDensityPreset,
  MenuOffsetPreset,
  ZeroLightTokens,
} from "../types";
import { StudioAccordion, StudioSectionCard, StudioSliderRow } from "./studio-ui";

export interface PanelLayoutProps {
  tokens: ZeroLightTokens;
  setTokens: React.Dispatch<React.SetStateAction<ZeroLightTokens>>;
}

export function PanelLayout({ tokens, setTokens }: PanelLayoutProps) {
  const activeElevation: ElevationPreset = tokens.elevation || "soft";

  return (
    <div>
      {/* 1. Primary Geometry: Corner radius & Height density */}
      <StudioSectionCard
        title="Shape & density"
        badge={`${tokens.cornerRadius === 999 ? "Pill" : `${tokens.cornerRadius}px`} • ${tokens.heightDensity}px`}
      >
        <div className="space-y-1.5 text-xs">
          <span className="text-zinc-300">Corner radius</span>
          <div className="grid grid-cols-5 gap-0.5 p-0.5 rounded-lg bg-white/[0.04]">
            {([0, 8, 16, 24, 999] as CornerRadiusPreset[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTokens((prev) => ({ ...prev, cornerRadius: r }))}
                className={`py-1.5 rounded-md text-[11px] transition-colors cursor-pointer flex flex-col items-center gap-1 ${
                  tokens.cornerRadius === r
                    ? "bg-white/[0.14] text-white font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <span
                  className="w-3 h-2 border border-current opacity-80"
                  style={{ borderRadius: r === 999 ? 999 : Math.min(r / 3, 6) }}
                />
                <span>{r === 999 ? "Pill" : r}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          <span className="text-zinc-300">Height density</span>
          <div className="grid grid-cols-5 gap-0.5 p-0.5 rounded-lg bg-white/[0.04]">
            {([36, 40, 44, 48, 52] as HeightDensityPreset[]).map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setTokens((prev) => ({ ...prev, heightDensity: h }))}
                className={`py-1 rounded-md text-[11px] transition-colors cursor-pointer tabular-nums ${
                  tokens.heightDensity === h
                    ? "bg-white/[0.14] text-white font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {h}px
              </button>
            ))}
          </div>
        </div>
      </StudioSectionCard>

      {/* 2. Proportion & Depth: Scale multiplier & Elevation */}
      <StudioSectionCard
        title="Scale & elevation"
        badge={`${tokens.scaleMultiplier.toFixed(2)}x • ${activeElevation}`}
      >
        <StudioSliderRow
          label="Scale multiplier"
          valueLabel={`${tokens.scaleMultiplier.toFixed(2)}x`}
          min={0.8}
          max={1.3}
          step={0.05}
          value={tokens.scaleMultiplier}
          onChange={(val) => setTokens((prev) => ({ ...prev, scaleMultiplier: val }))}
        />

        <div className="grid grid-cols-4 gap-0.5 p-0.5 rounded-lg bg-white/[0.04]">
          {[0.85, 1.0, 1.15, 1.3].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setTokens((prev) => ({ ...prev, scaleMultiplier: val }))}
              className={`py-1 rounded-md text-[11px] transition-colors cursor-pointer tabular-nums ${
                Math.abs(tokens.scaleMultiplier - val) < 0.02
                  ? "bg-white/[0.14] text-white font-medium"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {val.toFixed(2)}x
            </button>
          ))}
        </div>

        <div className="space-y-1.5 text-xs pt-1">
          <div className="flex justify-between items-center">
            <span className="text-zinc-300">Elevation</span>
            <span className="text-zinc-500 capitalize">{activeElevation}</span>
          </div>
          <div className="grid grid-cols-3 gap-0.5 p-0.5 rounded-lg bg-white/[0.04]">
            {(
              [
                { id: "flat", label: "Flat" },
                { id: "soft", label: "Soft" },
                { id: "elevated", label: "Elevated" },
              ] as const
            ).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                data-testid={`elevation-${id}`}
                onClick={() => setTokens((prev) => ({ ...prev, elevation: id }))}
                className={`py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                  activeElevation === id
                    ? "bg-white/[0.14] text-white font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </StudioSectionCard>

      {/* 3. Advanced Structural Details: Direction, Borders & Menu gap */}
      <StudioAccordion
        title="Direction, borders & menu gap"
        summary={`${(tokens.direction || "ltr").toUpperCase()} • ${tokens.borderWidth}px • ${tokens.menuOffsetGap}px`}
      >
        <div className="space-y-1.5 text-xs pt-1">
          <div className="flex justify-between items-center">
            <span className="text-zinc-300">Layout direction</span>
            <span className="text-zinc-500 uppercase">{tokens.direction || "ltr"}</span>
          </div>
          <div className="grid grid-cols-2 gap-0.5 p-0.5 rounded-lg bg-white/[0.04]">
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
                className={`py-1.5 px-2 rounded-md text-[11px] transition-colors cursor-pointer ${
                  (tokens.direction || "ltr") === key
                    ? "bg-white/[0.14] text-white font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-zinc-300">Border width</span>
            <span className="text-zinc-400 tabular-nums">{tokens.borderWidth}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="3"
            step="0.5"
            value={tokens.borderWidth}
            onChange={(e) =>
              setTokens((prev) => ({ ...prev, borderWidth: Number(e.target.value) }))
            }
            className="w-full h-1 rounded-full appearance-none bg-white/10 accent-white cursor-pointer"
          />
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-zinc-300">Menu offset gap</span>
            <span className="text-zinc-400 tabular-nums">{tokens.menuOffsetGap}px</span>
          </div>
          <div className="grid grid-cols-5 gap-0.5 p-0.5 rounded-lg bg-white/[0.04]">
            {([4, 6, 8, 12, 16] as MenuOffsetPreset[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setTokens((prev) => ({ ...prev, menuOffsetGap: g }))}
                className={`py-1 rounded-md text-[11px] transition-colors cursor-pointer tabular-nums ${
                  tokens.menuOffsetGap === g
                    ? "bg-white/[0.14] text-white font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {g}px
              </button>
            ))}
          </div>
        </div>
      </StudioAccordion>
    </div>
  );
}
