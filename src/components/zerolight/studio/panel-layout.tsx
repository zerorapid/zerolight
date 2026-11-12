"use client";

import React from "react";
import {
  CornerRadiusPreset,
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
  return (
    <div>
      <StudioSectionCard
        title="Scale & direction"
        badge={`${tokens.scaleMultiplier.toFixed(2)}x • ${(tokens.direction || "ltr").toUpperCase()}`}
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
              className={`py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                tokens.scaleMultiplier === val
                  ? "bg-white/[0.14] text-white font-medium"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-300">Layout direction</span>
            <span className="text-[10px] text-zinc-500 uppercase">
              {tokens.direction || "ltr"}
            </span>
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
      </StudioSectionCard>

      <StudioSectionCard
        title="Radius & density"
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
                  style={{
                    borderRadius: r === 999 ? "9999px" : `${Math.min(7, r / 3)}px`,
                  }}
                  className={`w-3 h-2.5 border ${
                    tokens.cornerRadius === r ? "border-white" : "border-zinc-500"
                  }`}
                />
                <span>{r === 0 ? "0" : r === 999 ? "Pill" : `${r}`}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 text-xs pt-0.5">
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

      <StudioAccordion
        title="Borders & menu gap"
        summary={`${tokens.borderWidth}px • ${tokens.menuOffsetGap}px`}
      >
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-zinc-300">Border width</span>
            {tokens.borderWidth === 0 ? (
              <span className="text-[10px] text-amber-400 font-medium">
                0px • Luminance Mode
              </span>
            ) : (
              <span className="text-zinc-400 tabular-nums">{tokens.borderWidth}px</span>
            )}
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={tokens.borderWidth}
            onChange={(e) =>
              setTokens((prev) => ({ ...prev, borderWidth: Number(e.target.value) }))
            }
            className="w-full cursor-pointer accent-zinc-200"
          />
          {tokens.borderWidth === 0 && (
            <p className="text-[10px] text-zinc-500">
              Compensatory luminance fill &amp; atmospheric elevation active.
            </p>
          )}
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-300">Menu offset gap</span>
            <span className="text-zinc-400 tabular-nums">{tokens.menuOffsetGap}px</span>
          </div>
          <div className="grid grid-cols-4 gap-0.5 p-0.5 rounded-lg bg-white/[0.04]">
            {([4, 8, 10, 14] as MenuOffsetPreset[]).map((g) => (
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
