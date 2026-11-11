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
    <div className="space-y-3">
      <StudioSectionCard
        title="Scale & Direction"
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

        <div className="grid grid-cols-4 gap-1">
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
                  : "bg-[#222226] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-1.5 pt-2 border-t border-[#27272A]/70">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-300 font-medium">Layout Direction</span>
            <span className="text-[10px] text-neutral-500 uppercase">
              {tokens.direction || "ltr"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
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
                className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                  (tokens.direction || "ltr") === key
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

      <StudioSectionCard
        title="Geometry & Density"
        badge={`${tokens.cornerRadius === 999 ? "Pill" : `${tokens.cornerRadius}px`} • ${tokens.heightDensity}px`}
      >
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-neutral-300 font-medium">Corner radius</span>
            <span className="text-neutral-400 tabular-nums">
              {tokens.cornerRadius === 999 ? "Pill" : `${tokens.cornerRadius}px`}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {([0, 8, 16, 24, 999] as CornerRadiusPreset[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTokens((prev) => ({ ...prev, cornerRadius: r }))}
                className={`py-1.5 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer flex flex-col items-center gap-1 ${
                  tokens.cornerRadius === r
                    ? "bg-white text-black border-white font-semibold shadow-sm"
                    : "bg-[#222226] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                }`}
              >
                <span
                  style={{
                    borderRadius: r === 999 ? "9999px" : `${Math.min(8, r / 3)}px`,
                  }}
                  className={`w-3.5 h-3 border ${
                    tokens.cornerRadius === r ? "border-black" : "border-neutral-400"
                  }`}
                />
                <span>{r === 0 ? "0px" : r === 999 ? "Pill" : `${r}px`}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 text-xs pt-1">
          <div className="flex justify-between">
            <span className="text-neutral-300 font-medium">Height density</span>
            <span className="text-neutral-400 tabular-nums">{tokens.heightDensity}px</span>
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
                    : "bg-[#222226] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                }`}
              >
                {h}px
              </button>
            ))}
          </div>
        </div>
      </StudioSectionCard>

      <StudioAccordion
        title="Fine-Tune Borders & Menus"
        summary={`${tokens.borderWidth}px border • ${tokens.menuOffsetGap}px gap`}
      >
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-neutral-300">Border width</span>
            {tokens.borderWidth === 0 ? (
              <span className="text-[10px] text-amber-400 font-medium bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.5 rounded">
                0px • Luminance Mode
              </span>
            ) : (
              <span className="text-neutral-400 font-medium tabular-nums">
                {tokens.borderWidth}px
              </span>
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
            className="w-full cursor-pointer accent-white"
          />
          {tokens.borderWidth === 0 && (
            <p className="text-[10px] text-neutral-500 pt-0.5">
              Compensatory luminance fill &amp; atmospheric elevation active to prevent edge bleed.
            </p>
          )}
        </div>

        <div className="space-y-1.5 text-xs pt-1">
          <div className="flex justify-between">
            <span className="text-neutral-300">Menu offset gap</span>
            <span className="text-neutral-400 font-medium tabular-nums">
              {tokens.menuOffsetGap}px
            </span>
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
                    : "bg-[#222226] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
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
