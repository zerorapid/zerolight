"use client";

import React, { useRef } from "react";
import { UploadCloud, Image as ImageIcon, Trash2, Check, Sparkles } from "lucide-react";
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

      {/* Brand & Logo Variations Manager */}
      <StudioSectionCard
        title="Logo Variations"
        badge={tokens.logoBrandName || "Default"}
        accentBadge
      >
        <div className="space-y-3 text-xs pt-1">
          <div className="space-y-1">
            <span className="text-zinc-300">Brand Name</span>
            <input
              type="text"
              value={tokens.logoBrandName || ""}
              placeholder="e.g. ZeroLight OS / Acme"
              onChange={(e) => setTokens((prev) => ({ ...prev, logoBrandName: e.target.value }))}
              className="w-full px-2.5 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-white text-xs outline-none focus:border-white/30 transition"
            />
          </div>

          {/* Slot 1: Primary Light Logo */}
          <LogoSlot
            title="Primary Light Logo"
            desc="Rendered on light/white surfaces"
            previewBg="bg-white"
            value={tokens.logoLight}
            onChange={(val) => setTokens((prev) => ({ ...prev, logoLight: val }))}
          />

          {/* Slot 2: Dark Logo */}
          <LogoSlot
            title="Dark Surface Logo"
            desc="Rendered on dark/obsidian surfaces"
            previewBg="bg-zinc-950"
            value={tokens.logoDark}
            onChange={(val) => setTokens((prev) => ({ ...prev, logoDark: val }))}
          />

          {/* Slot 3: Favicon / Mark */}
          <LogoSlot
            title="Favicon / Icon Mark (32×32)"
            desc="Browser tab, avatar mark & compact rail"
            previewBg="bg-zinc-900"
            isFavicon
            value={tokens.logoFavicon}
            onChange={(val) => setTokens((prev) => ({ ...prev, logoFavicon: val }))}
          />
        </div>
      </StudioSectionCard>

    </div>
  );
}

// Logo Slot with drag-and-drop / file upload & preview
function LogoSlot({
  title,
  desc,
  previewBg,
  value,
  isFavicon = false,
  onChange,
}: {
  title: string;
  desc: string;
  previewBg: string;
  value?: string;
  isFavicon?: boolean;
  onChange: (val: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-semibold text-zinc-200 block text-[11px]">{title}</span>
          <span className="text-[10px] text-zinc-400 block">{desc}</span>
        </div>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-1 text-zinc-400 hover:text-rose-400 transition"
            title="Remove Logo"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        {/* Preview Frame */}
        <div
          className={`shrink-0 rounded-md border border-white/10 flex items-center justify-center overflow-hidden ${previewBg} ${
            isFavicon ? "w-9 h-9" : "w-20 h-9"
          }`}
        >
          {value ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={value}
              alt={title}
              className={`max-h-full max-w-full object-contain ${isFavicon ? "p-1" : "p-1.5"}`}
            />
          ) : (
            <span className="text-[9px] text-zinc-500 tabular-nums">None</span>
          )}
        </div>

        {/* Upload Action */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.svg"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-1.5 px-2 rounded-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-zinc-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <UploadCloud className="w-3 h-3 text-zinc-400" />
            <span>{value ? "Replace" : "Upload File"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
