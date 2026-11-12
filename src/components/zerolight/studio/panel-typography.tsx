"use client";

import React, { useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
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
  const [pickerSlot, setPickerSlot] = useState<"body" | "heading" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [customFontInput, setCustomFontInput] = useState("");

  const activeBodyFont = tokens.fontFamily || "Plus Jakarta Sans";
  const activeHeadingFont = tokens.headingFontFamily || activeBodyFont;
  const isPaired = activeHeadingFont.toLowerCase() !== activeBodyFont.toLowerCase();

  const filteredFonts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return GOOGLE_FONT_CATALOG.filter((f) => {
      const catOk = categoryFilter === "All" || f.category === categoryFilter;
      const queryOk =
        !q || f.family.toLowerCase().includes(q) || f.note.toLowerCase().includes(q);
      return catOk && queryOk;
    });
  }, [searchQuery, categoryFilter]);

  const handleSelectFont = (family: string, slot: "body" | "heading") => {
    if (slot === "body") {
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
    setPickerSlot(null);
  };

  const handleLoadCustomFont = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = customFontInput.trim();
    if (!cleaned || !pickerSlot) return;
    handleSelectFont(cleaned, pickerSlot);
    setCustomFontInput("");
  };

  return (
    <div>
      {/* Quiet Live Specimen */}
      <StudioSectionCard
        title="Quick pairings"
        badge={`${tokens.fontSize}px • ${scaled.bodyWeight}/${scaled.headingWeight}`}
      >
        <div className="grid grid-cols-2 gap-1.5">
          {FONT_PAIRING_PRESETS.map((preset, idx) => {
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
                className={`px-2.5 py-1.5 rounded-lg text-[11px] text-left transition-colors cursor-pointer ${
                  idx === FONT_PAIRING_PRESETS.length - 1 && FONT_PAIRING_PRESETS.length % 2 === 1
                    ? "col-span-2"
                    : ""
                } ${
                  active
                    ? "bg-white/[0.12] text-white font-medium border border-white/20"
                    : "bg-white/[0.03] text-zinc-400 border border-white/[0.06] hover:text-zinc-200"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </StudioSectionCard>

      {/* Clean Compact Google Fonts Triggers */}
      <StudioSectionCard title="Google Fonts">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-zinc-300">Body</span>
            <button
              type="button"
              data-testid="open-body-font-picker"
              onClick={() => setPickerSlot((s) => (s === "body" ? null : "body"))}
              className="px-2.5 py-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-white flex items-center gap-2 cursor-pointer transition-colors max-w-[190px]"
            >
              <span className="truncate">{activeBodyFont}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform ${
                  pickerSlot === "body" ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-zinc-300">Headings</span>
            <button
              type="button"
              data-testid="open-heading-font-picker"
              onClick={() => setPickerSlot((s) => (s === "heading" ? null : "heading"))}
              className="px-2.5 py-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-white flex items-center gap-2 cursor-pointer transition-colors max-w-[190px]"
            >
              <span className="truncate">
                {isPaired ? activeHeadingFont : "Match body"}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform ${
                  pickerSlot === "heading" ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Expandable Searchable Google Fonts Picker */}
        {pickerSlot && (
          <div className="mt-2 p-2.5 rounded-lg bg-[#141417] border border-white/[0.08] space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${pickerSlot} font...`}
                className="w-full pl-8 pr-2.5 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/25"
              />
            </div>

            <div className="grid grid-cols-4 gap-0.5 p-0.5 rounded-md bg-white/[0.03]">
              {(["All", "Sans", "Editorial Serif", "Display"] as CategoryFilter[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`py-1 rounded text-[10px] transition-colors cursor-pointer truncate ${
                    categoryFilter === cat
                      ? "bg-white/[0.12] text-white font-medium"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {cat === "Editorial Serif" ? "Serif" : cat}
                </button>
              ))}
            </div>

            <div className="max-h-40 overflow-y-auto space-y-0.5 pr-0.5">
              {filteredFonts.map((font) => {
                const selected =
                  (pickerSlot === "body" ? activeBodyFont : activeHeadingFont).toLowerCase() ===
                  font.family.toLowerCase();
                return (
                  <button
                    key={font.family}
                    type="button"
                    data-testid={`google-font-${font.family.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => handleSelectFont(font.family, pickerSlot)}
                    className={`w-full px-2 py-1.5 rounded-md text-left transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                      selected
                        ? "bg-white/[0.12] text-white"
                        : "text-zinc-300 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate">{font.family}</div>
                      <div className="text-[10px] text-zinc-500 truncate">
                        {font.category} • {font.note}
                      </div>
                    </div>
                    {selected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleLoadCustomFont} className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={customFontInput}
                onChange={(e) => setCustomFontInput(e.target.value)}
                placeholder="Any Google Font (e.g. Figtree)"
                aria-label="Custom Google Font family"
                className="flex-1 min-w-0 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/25"
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded-md bg-white/[0.1] hover:bg-white/[0.18] text-white text-xs font-medium transition-colors cursor-pointer shrink-0"
              >
                Load
              </button>
            </form>
          </div>
        )}
      </StudioSectionCard>

      {/* Font Size & Weights */}
      <StudioSectionCard title="Size & weights">
        <StudioSliderRow
          label="Base font scale"
          valueLabel={`${tokens.fontSize}px`}
          min={12}
          max={18}
          step={1}
          value={tokens.fontSize}
          onChange={(val) => setTokens((prev) => ({ ...prev, fontSize: val }))}
          marks={["12px", "14px", "18px"]}
        />

        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-300">Body weight</span>
            <span className="text-zinc-500 tabular-nums">{scaled.bodyWeight}</span>
          </div>
          <div className="grid grid-cols-4 gap-0.5 p-0.5 rounded-lg bg-white/[0.04]">
            {([300, 400, 500, 600] as FontWeightPreset[]).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setTokens((prev) => ({ ...prev, bodyWeight: w }))}
                className={`py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                  scaled.bodyWeight === w
                    ? "bg-white/[0.14] text-white font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {w === 300 ? "Light" : w === 400 ? "Reg" : w === 500 ? "Med" : "Semi"}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-300">Heading weight</span>
            <span className="text-zinc-500 tabular-nums">{scaled.headingWeight}</span>
          </div>
          <div className="grid grid-cols-4 gap-0.5 p-0.5 rounded-lg bg-white/[0.04]">
            {([500, 600, 700, 800] as FontWeightPreset[]).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setTokens((prev) => ({ ...prev, headingWeight: w }))}
                className={`py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                  scaled.headingWeight === w
                    ? "bg-white/[0.14] text-white font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {w === 500 ? "Med" : w === 600 ? "Semi" : w === 700 ? "Bold" : "Extra"}
              </button>
            ))}
          </div>
        </div>

      </StudioSectionCard>

      <StudioSectionCard title="Live preview">
        <div
          className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2 space-y-0.5"
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
              className="text-base text-white leading-snug truncate"
            >
              Aa Bb £12,296
            </span>
            <span
              style={{ fontFamily: scaled.resolvedFontFamily }}
              className="text-[10px] text-emerald-400 shrink-0 tabular-nums"
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
            className="text-[11px] text-zinc-400 truncate"
          >
            {isPaired
              ? `${activeHeadingFont} + ${activeBodyFont}`
              : activeBodyFont}
          </p>
        </div>
      </StudioSectionCard>

      <StudioAccordion
        title="Style & rhythm"
        summary={`${scaled.fontStyle} • ${tokens.letterSpacing || "normal"} • ${tokens.lineHeight || "normal"}`}
      >
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <div className="space-y-1 text-xs">
            <span className="text-zinc-400 text-[11px]">Style</span>
            <div className="grid grid-cols-2 gap-0.5 p-0.5 rounded-lg bg-white/[0.04]">
              {(["normal", "italic"] as FontStylePreset[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setTokens((prev) => ({ ...prev, fontStyle: st }))}
                  className={`py-1 rounded-md text-[11px] capitalize transition-colors cursor-pointer ${
                    scaled.fontStyle === st
                      ? "bg-white/[0.14] text-white font-medium"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <span className="text-zinc-400 text-[11px]">Numerals</span>
            <div className="grid grid-cols-2 gap-0.5 p-0.5 rounded-lg bg-white/[0.04]">
              {[
                { label: "Tabular", val: true },
                { label: "Auto", val: false },
              ].map(({ label, val }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setTokens((prev) => ({ ...prev, tabularNums: val }))}
                  className={`py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                    (tokens.tabularNums !== false) === val
                      ? "bg-white/[0.14] text-white font-medium"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-1 text-xs">
          <span className="text-zinc-300">Letter spacing</span>
          <div className="grid grid-cols-3 gap-0.5 p-0.5 rounded-lg bg-white/[0.04]">
            {(["tight", "normal", "wide"] as LetterSpacingPreset[]).map((ls) => (
              <button
                key={ls}
                type="button"
                onClick={() => setTokens((prev) => ({ ...prev, letterSpacing: ls }))}
                className={`py-1 rounded-md text-[11px] capitalize transition-colors cursor-pointer ${
                  (tokens.letterSpacing || "normal") === ls
                    ? "bg-white/[0.14] text-white font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {ls}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <span className="text-zinc-300">Line height</span>
          <div className="grid grid-cols-3 gap-0.5 p-0.5 rounded-lg bg-white/[0.04]">
            {(["compact", "normal", "relaxed"] as LineHeightPreset[]).map((lh) => (
              <button
                key={lh}
                type="button"
                onClick={() => setTokens((prev) => ({ ...prev, lineHeight: lh }))}
                className={`py-1 rounded-md text-[11px] capitalize transition-colors cursor-pointer ${
                  (tokens.lineHeight || "normal") === lh
                    ? "bg-white/[0.14] text-white font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
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
