"use client";

import React, { useMemo, useState } from "react";
import { Check, Search, Sparkles, Type } from "lucide-react";
import {
  FONT_PAIRING_PRESETS,
  FontStylePreset,
  FontWeightPreset,
  GOOGLE_FONT_CATALOG,
  LetterSpacingPreset,
  LineHeightPreset,
  ScaledTokens,
  ZeroLightTokens,
} from "../types";
import { StudioAccordion, StudioSectionCard, StudioSliderRow } from "./studio-ui";

export interface PanelTypographyProps {
  tokens: ZeroLightTokens;
  scaled: ScaledTokens;
  setTokens: React.Dispatch<React.SetStateAction<ZeroLightTokens>>;
  triggerToast: (msg: string) => void;
}

type CategoryFilter = "All" | "Sans" | "Editorial Serif" | "Display";

export function PanelTypography({
  tokens,
  scaled,
  setTokens,
  triggerToast,
}: PanelTypographyProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [targetSlot, setTargetSlot] = useState<"body" | "heading">("body");
  const [customFontInput, setCustomFontInput] = useState("");

  const activeBodyFont = tokens.fontFamily || "Plus Jakarta Sans";
  const activeHeadingFont = tokens.headingFontFamily || activeBodyFont;
  const isPaired = activeHeadingFont.toLowerCase() !== activeBodyFont.toLowerCase();

  const filteredFonts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return GOOGLE_FONT_CATALOG.filter((f) => {
      const catOk = categoryFilter === "All" || f.category === categoryFilter;
      const queryOk = !q || f.family.toLowerCase().includes(q) || f.note.toLowerCase().includes(q);
      return catOk && queryOk;
    });
  }, [searchQuery, categoryFilter]);

  const handleSelectFont = (family: string) => {
    if (targetSlot === "body") {
      setTokens((prev) => ({
        ...prev,
        fontFamily: family,
        headingFontFamily:
          !prev.headingFontFamily || prev.headingFontFamily === prev.fontFamily
            ? family
            : prev.headingFontFamily,
      }));
      triggerToast(`Body font: ${family}`);
    } else {
      setTokens((prev) => ({
        ...prev,
        headingFontFamily: family,
      }));
      triggerToast(`Heading font: ${family}`);
    }
  };

  const handleLoadCustomFont = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = customFontInput.trim();
    if (!cleaned) return;
    handleSelectFont(cleaned);
    setCustomFontInput("");
  };

  return (
    <div className="space-y-3">
      {/* Live Specimen Card rendering with dynamically loaded Google Fonts */}
      <div className="rounded-xl bg-[#18181B] border border-[#27272A] p-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-[10px] text-neutral-400">
          <span className="uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <Type className="w-3 h-3 text-emerald-400" />
            Live Specimen
          </span>
          <span className="tabular-nums text-neutral-500">
            {tokens.fontSize}px • {scaled.bodyWeight}/{scaled.headingWeight}
          </span>
        </div>

        <div
          className="rounded-lg bg-[#111113] border border-[#27272A] p-3 space-y-1"
          style={{
            fontStyle: scaled.fontStyle,
            letterSpacing: scaled.letterSpacingCss,
          }}
        >
          <div className="flex items-baseline justify-between gap-2">
            <span
              style={{
                fontFamily: scaled.resolvedHeadingFontFamily,
                fontWeight: scaled.headingWeight,
              }}
              className="text-lg text-white leading-tight truncate"
            >
              Aa Bb £12,296
            </span>
            <span
              style={{ fontFamily: scaled.resolvedFontFamily }}
              className="text-[10px] text-emerald-400 shrink-0"
            >
              +14.2%
            </span>
          </div>
          <p
            style={{
              fontFamily: scaled.resolvedFontFamily,
              fontWeight: scaled.bodyWeight,
              lineHeight: scaled.lineHeightCss,
            }}
            className="text-xs text-neutral-300"
          >
            {isPaired
              ? `${activeHeadingFont} headings + ${activeBodyFont} UI`
              : `${activeBodyFont} across headings & UI`}
          </p>
        </div>

        {/* One-Click Font Pairing Presets */}
        <div className="flex flex-wrap gap-1 pt-0.5">
          {FONT_PAIRING_PRESETS.map((preset) => {
            const active =
              activeBodyFont.toLowerCase() === preset.fontFamily.toLowerCase() &&
              activeHeadingFont.toLowerCase() === preset.headingFontFamily.toLowerCase();
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setTokens((prev) => ({
                    ...prev,
                    fontFamily: preset.fontFamily,
                    headingFontFamily: preset.headingFontFamily,
                    bodyWeight: preset.bodyWeight,
                    headingWeight: preset.headingWeight,
                    letterSpacing: preset.letterSpacing,
                  }));
                  triggerToast(`Typography: ${preset.label}`);
                }}
                className={`px-2 py-1 rounded-md text-[10px] font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                  active
                    ? "bg-white text-black border-white font-semibold"
                    : "bg-[#222226] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                }`}
              >
                <Sparkles className="w-2.5 h-2.5 opacity-70" />
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Google Fonts Browser */}
      <StudioSectionCard
        title="Google Fonts"
        badge={targetSlot === "body" ? activeBodyFont : activeHeadingFont}
        accentBadge
      >
        {/* Body vs Heading Slot Switcher */}
        <div className="grid grid-cols-2 gap-1 bg-[#111113] p-1 rounded-lg border border-[#27272A]">
          <button
            type="button"
            onClick={() => setTargetSlot("body")}
            className={`py-1 px-2 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              targetSlot === "body"
                ? "bg-white text-black font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Body ({activeBodyFont.split(" ")[0]})
          </button>
          <button
            type="button"
            onClick={() => setTargetSlot("heading")}
            className={`py-1 px-2 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              targetSlot === "heading"
                ? "bg-white text-black font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Headings ({activeHeadingFont.split(" ")[0]})
          </button>
        </div>

        {/* Category Filter + Search */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search curated Google Fonts..."
              className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-[#111113] border border-[#3F3F46] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-300"
            />
          </div>

          <div className="grid grid-cols-4 gap-1">
            {(["All", "Sans", "Editorial Serif", "Display"] as CategoryFilter[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`py-1 px-1 rounded text-[10px] font-medium border transition-colors cursor-pointer truncate ${
                  categoryFilter === cat
                    ? "bg-white text-black border-white font-semibold"
                    : "bg-[#222226] text-neutral-400 border-[#3F3F46] hover:text-white"
                }`}
              >
                {cat === "Editorial Serif" ? "Serif" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Font List */}
        <div className="max-h-44 overflow-y-auto pr-1 space-y-1">
          {filteredFonts.map((font) => {
            const selected =
              (targetSlot === "body" ? activeBodyFont : activeHeadingFont).toLowerCase() ===
              font.family.toLowerCase();
            return (
              <button
                key={font.family}
                type="button"
                data-testid={`google-font-${font.family.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => handleSelectFont(font.family)}
                className={`w-full px-2.5 py-1.5 rounded-lg border text-left transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                  selected
                    ? "bg-white text-black border-white"
                    : "bg-[#222226] text-neutral-200 border-[#27272A] hover:border-neutral-500"
                }`}
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate">{font.family}</div>
                  <div
                    className={`text-[10px] truncate ${
                      selected ? "text-neutral-600" : "text-neutral-500"
                    }`}
                  >
                    {font.category} • {font.note}
                  </div>
                </div>
                {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Custom Google Font Name Input */}
        <form onSubmit={handleLoadCustomFont} className="flex items-center gap-1.5 pt-1">
          <input
            type="text"
            value={customFontInput}
            onChange={(e) => setCustomFontInput(e.target.value)}
            placeholder="Any Google Font (e.g. Figtree)"
            aria-label="Custom Google Font family"
            className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-[#111113] border border-[#3F3F46] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-300"
          />
          <button
            type="submit"
            className="px-2.5 py-1.5 rounded-lg bg-[#27272A] hover:bg-white hover:text-black text-neutral-200 border border-[#3F3F46] text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            Load
          </button>
        </form>
      </StudioSectionCard>

      {/* Font Size & Styles */}
      <StudioSectionCard title="Font Styles & Scale" badge={`${tokens.fontSize}px`}>
        <StudioSliderRow
          label="Base font scale"
          valueLabel={`${tokens.fontSize}px`}
          min={12}
          max={18}
          step={1}
          value={tokens.fontSize}
          onChange={(val) => setTokens((prev) => ({ ...prev, fontSize: val }))}
          marks={["12px Compact", "14px Std", "18px Roomy"]}
        />

        {/* Body & Heading Weights */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-neutral-300">Body weight</span>
            <span className="text-neutral-400 tabular-nums">{scaled.bodyWeight}</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {([300, 400, 500, 600] as FontWeightPreset[]).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setTokens((prev) => ({ ...prev, bodyWeight: w }))}
                className={`py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                  scaled.bodyWeight === w
                    ? "bg-white text-black border-white font-semibold"
                    : "bg-[#222226] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                }`}
              >
                {w === 300 ? "Light" : w === 400 ? "Regular" : w === 500 ? "Medium" : "Semi"}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-neutral-300">Heading weight</span>
            <span className="text-neutral-400 tabular-nums">{scaled.headingWeight}</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {([500, 600, 700, 800] as FontWeightPreset[]).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setTokens((prev) => ({ ...prev, headingWeight: w }))}
                className={`py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                  scaled.headingWeight === w
                    ? "bg-white text-black border-white font-semibold"
                    : "bg-[#222226] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                }`}
              >
                {w === 500 ? "Medium" : w === 600 ? "Semi" : w === 700 ? "Bold" : "Extra"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="space-y-1 text-xs">
            <span className="text-neutral-400 text-[11px]">Style</span>
            <div className="grid grid-cols-2 gap-1">
              {(["normal", "italic"] as FontStylePreset[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setTokens((prev) => ({ ...prev, fontStyle: st }))}
                  className={`py-1 rounded text-[11px] capitalize border transition-colors cursor-pointer ${
                    scaled.fontStyle === st
                      ? "bg-white text-black border-white font-semibold"
                      : "bg-[#222226] text-neutral-300 border-[#3F3F46]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <span className="text-neutral-400 text-[11px]">Numerals</span>
            <div className="grid grid-cols-2 gap-1">
              {[
                { label: "Tabular", val: true },
                { label: "Auto", val: false },
              ].map(({ label, val }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setTokens((prev) => ({ ...prev, tabularNums: val }))}
                  className={`py-1 rounded text-[11px] border transition-colors cursor-pointer ${
                    (tokens.tabularNums !== false) === val
                      ? "bg-white text-black border-white font-semibold"
                      : "bg-[#222226] text-neutral-300 border-[#3F3F46]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </StudioSectionCard>

      <StudioAccordion
        title="Rhythm & Spacing"
        summary={`${tokens.letterSpacing || "normal"} • ${tokens.lineHeight || "normal"}`}
      >
        <div className="space-y-1.5 text-xs">
          <span className="text-neutral-300">Letter spacing</span>
          <div className="grid grid-cols-3 gap-1">
            {(["tight", "normal", "wide"] as LetterSpacingPreset[]).map((ls) => (
              <button
                key={ls}
                type="button"
                onClick={() => setTokens((prev) => ({ ...prev, letterSpacing: ls }))}
                className={`py-1 rounded text-[11px] capitalize border transition-colors cursor-pointer ${
                  (tokens.letterSpacing || "normal") === ls
                    ? "bg-white text-black border-white font-semibold"
                    : "bg-[#222226] text-neutral-300 border-[#3F3F46]"
                }`}
              >
                {ls}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          <span className="text-neutral-300">Line height</span>
          <div className="grid grid-cols-3 gap-1">
            {(["compact", "normal", "relaxed"] as LineHeightPreset[]).map((lh) => (
              <button
                key={lh}
                type="button"
                onClick={() => setTokens((prev) => ({ ...prev, lineHeight: lh }))}
                className={`py-1 rounded text-[11px] capitalize border transition-colors cursor-pointer ${
                  (tokens.lineHeight || "normal") === lh
                    ? "bg-white text-black border-white font-semibold"
                    : "bg-[#222226] text-neutral-300 border-[#3F3F46]"
                }`}
              >
                {lh}
              </button>
            ))}
          </div>
        </div>
      </StudioAccordion>
    </div>
  );
}
