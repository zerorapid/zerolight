"use client";

import React from "react";
import { THEME_PRESETS, ThemePresetId, ZeroLightTokens } from "../types";
import { StudioAccordion, StudioColorRow, StudioSectionCard } from "./studio-ui";

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
    <div>
      <StudioSectionCard title="Polarity">
        <div className="grid grid-cols-2 gap-1.5">
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
                className={`px-2.5 py-2 rounded-lg border text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
                  isActive
                    ? "bg-white/[0.11] text-white border-white/25 font-medium"
                    : "bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:text-zinc-200 hover:bg-white/[0.06]"
                }`}
              >
                <span
                  style={{
                    backgroundColor: preset.swatchBg,
                    borderColor: preset.swatchAccent,
                  }}
                  className="w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center"
                >
                  <span
                    style={{ backgroundColor: preset.swatchAccent }}
                    className="w-1 h-1 rounded-full"
                  />
                </span>
                <span className="truncate">{preset.label}</span>
              </button>
            );
          })}
        </div>
      </StudioSectionCard>

      <StudioSectionCard title="Brand accent" badge={tokens.primaryButtonColor.toUpperCase()}>
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
                className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                  active
                    ? "ring-2 ring-white/80 ring-offset-2 ring-offset-[#0E0E10] scale-105"
                    : "border-white/20 opacity-80 hover:opacity-100 hover:scale-105"
                }`}
              />
            );
          })}
        </div>
      </StudioSectionCard>

      <StudioAccordion
        title="Surface & semantic tokens"
        summary={`${tokens.universalFillColor} • ${tokens.universalBorderColor}`}
      >
        <div className="space-y-0.5 pt-1">
          <StudioColorRow
            label="Surface fill"
            value={tokens.universalFillColor}
            onChange={(hex) => setTokens((prev) => ({ ...prev, universalFillColor: hex }))}
          />
          <StudioColorRow
            label="Border line"
            value={tokens.universalBorderColor}
            onChange={(hex) => setTokens((prev) => ({ ...prev, universalBorderColor: hex }))}
          />
          <StudioColorRow
            label="Text & icons"
            value={tokens.textIconColor}
            onChange={(hex) => setTokens((prev) => ({ ...prev, textIconColor: hex }))}
          />
          <StudioColorRow
            label="Primary action"
            value={tokens.primaryButtonColor}
            onChange={(hex) => setTokens((prev) => ({ ...prev, primaryButtonColor: hex }))}
          />
          <StudioColorRow
            label="Hover tint"
            value={tokens.hoverBackplateTint}
            onChange={(hex) => setTokens((prev) => ({ ...prev, hoverBackplateTint: hex }))}
          />
        </div>
      </StudioAccordion>
    </div>
  );
}
