"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Bookmark, Check, Sparkles } from "lucide-react";
import { THEME_PRESETS, ThemePresetId, ZeroLightTokens, CustomBrandTheme } from "../types";
import { StudioAccordion, StudioColorRow, StudioSectionCard } from "./studio-ui";

const STORAGE_CUSTOM_THEMES = "zl_user_custom_themes";

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
  const [newThemeName, setNewThemeName] = useState("");
  const [customThemes, setCustomThemes] = useState<CustomBrandTheme[]>([]);

  // Load custom saved themes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CUSTOM_THEMES);
      if (stored) {
        setCustomThemes(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to read custom themes", e);
    }
  }, []);

  const handleSaveCustomTheme = () => {
    if (!newThemeName.trim()) {
      triggerToast("Enter a theme name first");
      return;
    }

    const newTheme: CustomBrandTheme = {
      id: `theme_${Date.now()}`,
      name: newThemeName.trim(),
      createdAt: new Date().toLocaleDateString(),
      tokens: { ...tokens },
      logos: {
        light: tokens.logoLight,
        dark: tokens.logoDark,
        favicon: tokens.logoFavicon,
      },
    };

    const updated = [newTheme, ...customThemes];
    setCustomThemes(updated);
    try {
      localStorage.setItem(STORAGE_CUSTOM_THEMES, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to save custom theme", e);
    }
    setNewThemeName("");
    triggerToast(`Theme "${newTheme.name}" saved to My Themes!`);
  };

  const handleDeleteCustomTheme = (id: string, name: string) => {
    const updated = customThemes.filter((t) => t.id !== id);
    setCustomThemes(updated);
    try {
      localStorage.setItem(STORAGE_CUSTOM_THEMES, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to delete custom theme", e);
    }
    triggerToast(`Deleted theme "${name}"`);
  };

  const handleApplyCustomTheme = (theme: CustomBrandTheme) => {
    handleUpdateTokens({
      ...theme.tokens,
      logoLight: theme.logos?.light,
      logoDark: theme.logos?.dark,
      logoFavicon: theme.logos?.favicon,
      logoBrandName: theme.name,
    });
    triggerToast(`Applied theme: ${theme.name}`);
  };

  return (
    <div>
      {/* My Themes (Custom Theme & Logo Variations Library) */}
      <StudioSectionCard
        title="My Themes"
        badge={`${customThemes.length} saved`}
        accentBadge={customThemes.length > 0}
      >
        <div className="space-y-2.5 pt-0.5">
          {/* Save Current Tokens as Theme */}
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              placeholder="Save current theme as..."
              value={newThemeName}
              onChange={(e) => setNewThemeName(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white outline-none focus:border-white/30 transition placeholder:text-zinc-500"
            />
            <button
              type="button"
              onClick={handleSaveCustomTheme}
              className="px-3 py-1.5 rounded-lg bg-white/[0.12] hover:bg-white/[0.2] border border-white/20 text-xs font-semibold text-white transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>

          {/* Saved Custom Themes List */}
          {customThemes.length > 0 ? (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
              {customThemes.map((theme) => {
                const isSelected =
                  tokens.universalFillColor === theme.tokens.universalFillColor &&
                  tokens.primaryButtonColor === theme.tokens.primaryButtonColor;

                return (
                  <div
                    key={theme.id}
                    className={`p-2 rounded-lg border text-xs flex items-center justify-between transition group ${
                      isSelected
                        ? "bg-white/[0.1] border-white/30 text-white font-medium"
                        : "bg-white/[0.02] border-white/[0.06] text-zinc-300 hover:bg-white/[0.05]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleApplyCustomTheme(theme)}
                      className="flex-1 text-left flex items-center gap-2 min-w-0 cursor-pointer"
                    >
                      {/* Swatch indicator */}
                      <span
                        style={{
                          backgroundColor: theme.tokens.universalFillColor || "#FFFFFF",
                          borderColor: theme.tokens.primaryButtonColor || "#111111",
                        }}
                        className="w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center"
                      >
                        <span
                          style={{ backgroundColor: theme.tokens.primaryButtonColor || "#111111" }}
                          className="w-1 h-1 rounded-full"
                        />
                      </span>

                      <div className="min-w-0">
                        <span className="truncate block font-semibold text-[11px]">
                          {theme.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 block">
                          {theme.createdAt} {theme.logos?.light ? "• Logo Attached" : ""}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCustomTheme(theme.id, theme.name)}
                      className="p-1 text-zinc-500 hover:text-rose-400 opacity-60 group-hover:opacity-100 transition cursor-pointer"
                      title="Delete Theme"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[11px] text-zinc-500 italic">
              No custom themes yet. Customize colors and logos, then save them above!
            </p>
          )}
        </div>
      </StudioSectionCard>

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
