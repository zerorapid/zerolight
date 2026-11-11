"use client";

import React from "react";
import { THEME_PRESETS, ThemePresetId, ZeroLightTokens } from "../types";
import { StudioColorRow, StudioSectionCard } from "./studio-ui";

export interface PanelThemeProps {
  tokens: ZeroLightTokens;
  setTokens: React.Dispatch<React.SetStateAction<ZeroLightTokens>>;
  handleUpdateTokens: (updates: Partial<ZeroLightTokens>) => void;
  triggerToast: (msg: string) => void;
}

const BRAND_ACCENTS = [
  { label: "Obsidian", primary: "#111111", chart: "#10B981" },
  { label: "Indigo", primary: "#4F46E5", chart: "#6366F1" },
  { label: "Emerald", primary: "#059669", chart: "#10B981" },
  { label: "Cobalt", primary: "#2563EB", chart: "#3B82F6" },
  { label: "Violet", primary: "#7C3AED", chart: "#8B5CF6" },
  { label: "Rose", primary: "#E11D48", chart: "#F43F5E" },
  { label: "Amber", primary: "#D97706", chart: "#F59E0B" },
];

export function PanelTheme({
  tokens,
  setTokens,
  handleUpdateTokens,
  triggerToast,
}: PanelThemeProps) {
  return (
    <div className="space-y-3">
      <StudioSectionCard title="Theme Polarity" badge="4 Presets">
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(THEME_PRESETS) as ThemePresetId[]).map((presetKey) => {
            const preset = THEME_PRESETS[presetKey];
            const isActive =
              tokens.universalFillColor.toLowerCase() ===
                (preset.tokens.universalFillColor || "").toLowerCase() &&
              tokens.primaryButtonColor.toLowerCase() ===
                (preset.tokens.primaryButtonColor || "").toLowerCase() &&
              tokens.universalBorderColor.toLowerCase() ===
                (preset.tokens.universalBorderColor || "").toLowerCase();
            return (
              <button
                key={presetKey}
                type="button"
                data-testid={`theme-preset-${presetKey}`}
                onClick={() => {
                  handleUpdateTokens(preset.tokens);
                  triggerToast(`Theme preset: ${preset.label}`);
                }}
                className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-black border-white font-semibold shadow-sm"
                    : "bg-[#222226] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                }`}
              >
                <span
                  style={{
                    backgroundColor: preset.swatchBg,
                    borderColor: preset.swatchAccent,
                  }}
                  className="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center"
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
      </StudioSectionCard>

      <StudioSectionCard title="Brand Accent" badge={tokens.primaryButtonColor.toUpperCase()}>
        <div className="flex items-center justify-between gap-1.5">
          {BRAND_ACCENTS.map(({ label, primary, chart }) => {
            const active = tokens.primaryButtonColor.toLowerCase() === primary.toLowerCase();
            return (
              <button
                key={label}
                type="button"
                title={label}
                onClick={() => {
                  setTokens((prev) => ({
                    ...prev,
                    primaryButtonColor: primary,
                    chartPrimaryColor: chart,
                  }));
                  triggerToast(`Accent: ${label}`);
                }}
                style={{ backgroundColor: primary }}
                className={`w-7 h-7 rounded-lg border transition-all cursor-pointer ${
                  active
                    ? "ring-2 ring-white ring-offset-2 ring-offset-[#18181B] scale-105"
                    : "border-white/20 opacity-85 hover:opacity-100 hover:scale-105"
                }`}
              />
            );
          })}
        </div>
      </StudioSectionCard>

      <StudioSectionCard title="Semantic Colors" badge="5 Tokens">
        <div className="space-y-2">
          <StudioColorRow
            label="Surface Fill"
            value={tokens.universalFillColor}
            onChange={(hex) => setTokens((prev) => ({ ...prev, universalFillColor: hex }))}
          />
          <StudioColorRow
            label="Border Line"
            value={tokens.universalBorderColor}
            onChange={(hex) => setTokens((prev) => ({ ...prev, universalBorderColor: hex }))}
          />
          <StudioColorRow
            label="Text & Icons"
            value={tokens.textIconColor}
            onChange={(hex) => setTokens((prev) => ({ ...prev, textIconColor: hex }))}
          />
          <StudioColorRow
            label="Primary Action"
            value={tokens.primaryButtonColor}
            onChange={(hex) => setTokens((prev) => ({ ...prev, primaryButtonColor: hex }))}
          />
          <StudioColorRow
            label="Hover Tint"
            value={tokens.hoverBackplateTint}
            onChange={(hex) => setTokens((prev) => ({ ...prev, hoverBackplateTint: hex }))}
          />
        </div>
      </StudioSectionCard>
    </div>
  );
}
