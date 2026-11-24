"use client";

import React, { useState, useMemo, useRef } from "react";
import { Palette, Upload, Check, Copy, Sparkles, Wand2, Layers, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { useZeroLight } from "../context";
import { getContrastColor, GOOGLE_FONT_CATALOG, CornerRadiusPreset } from "../types";
import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";
import { Card } from "../atoms/card";
import { Input } from "../atoms/input";
import { ProgressBar } from "../atoms/progress-bar";
import { Select } from "../molecules/select";
import { FormField } from "../molecules/form-field";
import { StatCard } from "../molecules/stat-card";

interface BrandCheckItem {
  id: string;
  label: string;
  passed: boolean;
  fixHint: string;
}

const QUICK_PALETTES = [
  { name: "Obsidian Executive", primary: "#09090B", secondary: "#10B981", radius: 8 as CornerRadiusPreset, headingFont: "Plus Jakarta Sans", bodyFont: "Inter" },
  { name: "Royal Violet SaaS", primary: "#6D28D9", secondary: "#0EA5E9", radius: 16 as CornerRadiusPreset, headingFont: "Outfit", bodyFont: "Inter" },
  { name: "Clinical Sky", primary: "#0284C7", secondary: "#10B981", radius: 8 as CornerRadiusPreset, headingFont: "Plus Jakarta Sans", bodyFont: "DM Sans" },
  { name: "Editorial Serif", primary: "#18181B", secondary: "#D97706", radius: 0 as CornerRadiusPreset, headingFont: "Fraunces", bodyFont: "DM Sans" },
];

export interface ZeroFlashToolProps {
  brandName: string;
  onBrandNameChange: (name: string) => void;
  brandLogoUrl: string | null;
  onBrandLogoUpload: (url: string | null) => void;
  onStatusToast?: (msg: string) => void;
}

export function ZeroFlashTool({
  brandName,
  onBrandNameChange,
  brandLogoUrl,
  onBrandLogoUpload,
  onStatusToast,
}: ZeroFlashToolProps) {
  const { tokens, scaled, updateTokens } = useZeroLight();

  const [tagline, setTagline] = useState("Sovereign B2B SaaS Design Architecture");
  const [primaryHex, setPrimaryHex] = useState(tokens.primaryButtonColor || "#09090B");
  const [secondaryHex, setSecondaryHex] = useState(tokens.chartSecondaryColor || "#10B981");
  const [headingFont, setHeadingFont] = useState(tokens.headingFontFamily || tokens.fontFamily || "Plus Jakarta Sans");
  const [bodyFont, setBodyFont] = useState(tokens.fontFamily || "Inter");
  const [radiusPreset, setRadiusPreset] = useState<CornerRadiusPreset>(tokens.cornerRadius);
  const [copiedW3C, setCopiedW3C] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [detectedSvgHexes, setDetectedSvgHexes] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fontOptions = useMemo(
    () =>
      GOOGLE_FONT_CATALOG.map((f) => ({
        value: f.family,
        label: f.family,
      })),
    []
  );

  const primaryContrastText = getContrastColor(primaryHex);

  const deckSlides = useMemo(
    () => [
      { id: "cover", num: "01", title: "Identity Cover", note: `${brandName || "ZeroLight OS"} · Brand Architecture` },
      { id: "voice", num: "02", title: "Positioning & Voice", note: tagline },
      { id: "colors", num: "03", title: "Color Contrast System", note: `Primary ${primaryHex} · Secondary ${secondaryHex}` },
      { id: "type", num: "04", title: "Typography & Numerals", note: `${headingFont} / ${bodyFont} · tabular-nums` },
      { id: "lockup", num: "05", title: "Logo Lockup & Radii", note: `Clearspace 24px · Card Radius ${radiusPreset}px` },
      { id: "specimen", num: "06", title: "SaaS UI Specimen", note: "Live ZeroLight token preview" },
    ],
    [brandName, tagline, primaryHex, secondaryHex, headingFont, bodyFont, radiusPreset]
  );

  const checks: BrandCheckItem[] = useMemo(() => {
    const cleanName = Boolean(brandName.trim() && brandName.trim() !== "Northwind" && brandName.trim() !== "Acme Corp");
    const hasTagline = tagline.trim().length >= 8;
    const validHex = /^#[0-9a-fA-F]{6}$/.test(primaryHex);
    const hasCustomPair = headingFont !== bodyFont || bodyFont !== "Arial";
    return [
      { id: "name", label: "Distinct SaaS Brand Identity", passed: cleanName, fixHint: "Set a specific brand name" },
      { id: "tagline", label: "Concise Value Proposition", passed: hasTagline, fixHint: "Add an 8+ char tagline" },
      { id: "contrast", label: "Valid YIQ Brand Primary Hex", passed: validHex, fixHint: "Provide a valid 6-digit hex" },
      { id: "type", label: "Google Font Token Pairing", passed: hasCustomPair, fixHint: "Select heading & body fonts" },
      { id: "logo", label: "SVG / Raster Brand Mark", passed: Boolean(brandLogoUrl), fixHint: "Upload brand mark" },
    ];
  }, [brandName, tagline, primaryHex, headingFont, bodyFont, brandLogoUrl]);

  const healthScore = useMemo(() => {
    const passed = checks.filter((c) => c.passed).length;
    return Math.round((passed / checks.length) * 100);
  }, [checks]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.name.toLowerCase().endsWith(".svg") || file.type === "image/svg+xml") {
      file.text().then((svgText) => {
        const matches = svgText.match(/#[0-9a-fA-F]{6}\b/g) || [];
        const unique = Array.from(new Set(matches.map((h) => h.toUpperCase())))
          .filter((h) => h !== "#FFFFFF" && h !== "#000000")
          .slice(0, 6);
        setDetectedSvgHexes(unique);
        if (unique[0]) setPrimaryHex(unique[0]);
        if (unique[1]) setSecondaryHex(unique[1]);
      }).catch(() => {});
    } else {
      setDetectedSvgHexes([]);
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onBrandLogoUpload(reader.result);
        updateTokens?.({ logoLight: reader.result, logoDark: reader.result });
        onStatusToast?.("Brand mark uploaded and synced");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSyncToZeroLight = () => {
    updateTokens?.({
      primaryButtonColor: primaryHex,
      chartSecondaryColor: secondaryHex,
      fontFamily: bodyFont,
      headingFontFamily: headingFont,
      cornerRadius: radiusPreset,
      logoBrandName: brandName.trim() || "ZeroLight OS",
    });
    onStatusToast?.(`Applied "${brandName || "Brand"}" tokens across ZeroLight Studio`);
  };

  const handleCopyFigmaW3C = () => {
    const payload = {
      $schema: "https://tr.designtokens.org/format/",
      brand: brandName,
      color: {
        brand: { primary: { $value: primaryHex, $type: "color" }, secondary: { $value: secondaryHex, $type: "color" } },
        surface: { card: { $value: tokens.universalFillColor, $type: "color" }, border: { $value: tokens.universalBorderColor, $type: "color" } },
      },
      typography: {
        heading: { $value: headingFont, $type: "fontFamily" },
        body: { $value: bodyFont, $type: "fontFamily" },
      },
      borderRadius: {
        card: { $value: `${scaled.scaledCardRadius}px`, $type: "dimension" },
      },
    };
    navigator.clipboard?.writeText(JSON.stringify(payload, null, 2));
    setCopiedW3C(true);
    onStatusToast?.("Copied W3C / Figma Variables JSON");
    setTimeout(() => setCopiedW3C(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b" style={{ borderColor: tokens.universalBorderColor }}>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight" style={{ color: tokens.textIconColor }}>
              ZeroFlash Brand & Token Generator
            </h1>
            <Badge variant={healthScore >= 80 ? "healthy" : "degraded"} size="xs">
              Brand Health {healthScore}%
            </Badge>
          </div>
          <p className="text-xs opacity-70 mt-0.5" style={{ color: tokens.textIconColor }}>
            Turn a client brand brief and SVG logo into live ZeroLight tokens, brand slides, and W3C Figma variables.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyFigmaW3C}
            iconLeft={copiedW3C ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copiedW3C ? "Copied Tokens JSON" : "Export W3C JSON"}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSyncToZeroLight}
            iconLeft={<Wand2 className="w-3.5 h-3.5" />}
          >
            Push Brand to ZeroLight
          </Button>
        </div>
      </div>

      {/* Quick Archetype Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {QUICK_PALETTES.map((preset) => (
          <Card
            key={preset.name}
            variant="interactive"
            padding="sm"
            role="button"
            tabIndex={0}
            onClick={() => {
              setPrimaryHex(preset.primary);
              setSecondaryHex(preset.secondary);
              setRadiusPreset(preset.radius);
              setHeadingFont(preset.headingFont);
              setBodyFont(preset.bodyFont);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setPrimaryHex(preset.primary);
                setSecondaryHex(preset.secondary);
                setRadiusPreset(preset.radius);
                setHeadingFont(preset.headingFont);
                setBodyFont(preset.bodyFont);
              }
            }}
            className="text-left flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="text-xs font-bold truncate" title={preset.name} style={{ color: tokens.textIconColor }}>
                {preset.name}
              </div>
              <div className="text-[11px] opacity-65 font-sans tabular-nums truncate" style={{ color: tokens.textIconColor }}>
                {preset.headingFont} · {preset.radius}px
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="w-4 h-4 rounded-full border border-black/15" style={{ backgroundColor: preset.primary }} />
              <span className="w-4 h-4 rounded-full border border-black/15" style={{ backgroundColor: preset.secondary }} />
            </div>
          </Card>
        ))}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Brand Identity Controls */}
        <Card padding="md" className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 opacity-70" style={{ color: tokens.textIconColor }} />
            <h2 className="text-sm font-bold" style={{ color: tokens.textIconColor }}>
              Client Brand Configuration
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <FormField
              id="zf-brand-name"
              label="Brand Name"
              value={brandName}
              onChange={(e) => onBrandNameChange(e.target.value)}
              placeholder="e.g. Finexy Treasury"
            />

            <FormField
              id="zf-brand-tagline"
              label="Brand Tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="One-line SaaS positioning..."
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1.5" style={{ color: tokens.textIconColor, fontSize: `${scaled.labelFontSize}px` }}>
                  Primary Accent
                </label>
                <div className="flex items-center gap-2">
                  <label
                    className="relative w-9 h-9 border cursor-pointer shrink-0 block overflow-hidden"
                    style={{
                      borderRadius: `${scaled.scaledRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      backgroundColor: primaryHex,
                    }}
                    title="Pick Primary Accent Hex"
                  >
                    <input
                      type="color"
                      value={primaryHex}
                      onChange={(e) => setPrimaryHex(e.target.value)}
                      className="sr-only"
                    />
                  </label>
                  <Input
                    value={primaryHex}
                    onChange={(e) => setPrimaryHex(e.target.value)}
                    className="font-sans tabular-nums"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1.5" style={{ color: tokens.textIconColor, fontSize: `${scaled.labelFontSize}px` }}>
                  Secondary Chart Color
                </label>
                <div className="flex items-center gap-2">
                  <label
                    className="relative w-9 h-9 border cursor-pointer shrink-0 block overflow-hidden"
                    style={{
                      borderRadius: `${scaled.scaledRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      backgroundColor: secondaryHex,
                    }}
                    title="Pick Secondary Chart Hex"
                  >
                    <input
                      type="color"
                      value={secondaryHex}
                      onChange={(e) => setSecondaryHex(e.target.value)}
                      className="sr-only"
                    />
                  </label>
                  <Input
                    value={secondaryHex}
                    onChange={(e) => setSecondaryHex(e.target.value)}
                    className="font-sans tabular-nums"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Heading Typeface"
                options={fontOptions}
                value={headingFont}
                onChange={setHeadingFont}
                size="sm"
              />
              <Select
                label="Body Typeface"
                options={fontOptions}
                value={bodyFont}
                onChange={setBodyFont}
                size="sm"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: tokens.universalBorderColor }}>
              <span className="font-semibold" style={{ color: tokens.textIconColor }}>
                Brand Mark (SVG / PNG)
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.svg"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                iconLeft={<Upload className="w-3.5 h-3.5" />}
              >
                {brandLogoUrl ? "Replace Logo" : "Upload Logo"}
              </Button>
            </div>
            {detectedSvgHexes.length > 0 && (
              <div className="pt-2 space-y-1.5">
                <span className="text-[11px] font-semibold opacity-70" style={{ color: tokens.textIconColor }}>
                  Detected SVG Palette Swatches (Click to Set Primary)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {detectedSvgHexes.map((hex) => (
                    <Button
                      key={hex}
                      variant={primaryHex === hex ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setPrimaryHex(hex)}
                    >
                      <span className="w-3 h-3 rounded-full border border-black/15 inline-block" style={{ backgroundColor: hex }} />
                      <span className="font-sans tabular-nums">{hex}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Right: Interactive Brand Deck Viewer + Deterministic Agent Zap Auditor */}
        <div className="lg:col-span-7 space-y-5">
          <Card padding="md" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 opacity-70" style={{ color: tokens.textIconColor }} />
                <h2 className="text-sm font-bold" style={{ color: tokens.textIconColor }}>
                  Brand Deck Slide {deckSlides[activeSlideIndex].num}: {deckSlides[activeSlideIndex].title}
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveSlideIndex((i) => Math.max(0, i - 1))}
                  disabled={activeSlideIndex === 0}
                  iconLeft={<ChevronLeft className="w-3.5 h-3.5" />}
                >
                  Prev
                </Button>
                <span className="text-xs font-sans tabular-nums font-semibold px-1.5" style={{ color: tokens.textIconColor }}>
                  {activeSlideIndex + 1} / {deckSlides.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveSlideIndex((i) => Math.min(deckSlides.length - 1, i + 1))}
                  disabled={activeSlideIndex === deckSlides.length - 1}
                  iconRight={<ChevronRight className="w-3.5 h-3.5" />}
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Slide Canvas Preview */}
            <div
              className="p-6 border flex flex-col justify-between min-h-[168px] gap-4"
              style={{
                borderRadius: `${radiusPreset === 999 ? 20 : radiusPreset}px`,
                backgroundColor: activeSlideIndex === 0 || activeSlideIndex === 2 ? primaryHex : tokens.hoverBackplateTint,
                borderColor: tokens.universalBorderColor,
                color: activeSlideIndex === 0 || activeSlideIndex === 2 ? primaryContrastText : tokens.textIconColor,
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                  SLIDE {deckSlides[activeSlideIndex].num} · {deckSlides[activeSlideIndex].title}
                </span>
                <span className="text-xs font-sans tabular-nums px-2 py-0.5 rounded bg-black/15 font-semibold">
                  {radiusPreset}px · {headingFont}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2.5">
                    {brandLogoUrl ? (
                      <img src={brandLogoUrl} alt={`${brandName} logo`} className="w-9 h-9 rounded-lg object-contain bg-white p-1 shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-white/15 border border-current/20 flex items-center justify-center font-bold text-xs shrink-0">
                        {(brandName || "ZL").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <h3 className="text-lg font-bold tracking-tight truncate" style={{ fontFamily: headingFont }} title={brandName}>
                      {brandName || "ZeroLight OS"}
                    </h3>
                  </div>
                  <p className="text-xs opacity-85" style={{ fontFamily: bodyFont }}>
                    {deckSlides[activeSlideIndex].note}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-6 h-6 rounded-md border border-black/15" style={{ backgroundColor: primaryHex }} title={`Primary ${primaryHex}`} />
                  <span className="w-6 h-6 rounded-md border border-black/15" style={{ backgroundColor: secondaryHex }} title={`Secondary ${secondaryHex}`} />
                </div>
              </div>
            </div>

            {/* Slide Switcher Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {deckSlides.map((slide, idx) => (
                <Button
                  key={slide.id}
                  variant={activeSlideIndex === idx ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setActiveSlideIndex(idx)}
                  className="whitespace-nowrap shrink-0"
                >
                  {slide.num} · {slide.title}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <StatCard
                label="YIQ Contrast Lock"
                value={primaryContrastText === "#FFFFFF" ? "Light On Dark" : "Dark On Light"}
                comparisonText={`Primary text resolves to ${primaryContrastText}`}
                trend="up"
              />
              <StatCard
                label="Typeface Pair"
                value={`${headingFont}`}
                comparisonText={`Body: ${bodyFont} · tabular-nums`}
                trend="neutral"
              />
            </div>
          </Card>

          {/* Agent Zap Deterministic Auditor */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: tokens.primaryButtonColor }} />
                <h2 className="text-sm font-bold" style={{ color: tokens.textIconColor }}>
                  Brand Readiness Check (Zero-Cost Auditor)
                </h2>
              </div>
              <span className="text-xs font-bold font-sans tabular-nums" style={{ color: tokens.textIconColor }}>
                {healthScore}% Complete
              </span>
            </div>

            <ProgressBar value={healthScore} showValue={false} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {checks.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 border flex items-center justify-between gap-2 text-xs"
                  style={{
                    borderRadius: `${scaled.scaledRadius}px`,
                    borderColor: tokens.universalBorderColor,
                    backgroundColor: tokens.hoverBackplateTint,
                  }}
                >
                  <span className="truncate font-medium" title={item.label} style={{ color: tokens.textIconColor }}>
                    {item.label}
                  </span>
                  <Badge variant={item.passed ? "healthy" : "degraded"} size="xs">
                    {item.passed ? "Pass" : item.fixHint}
                  </Badge>
                </div>
              ))}
            </div>

            <div
              className="mt-3 pt-3 border-t flex flex-wrap items-center justify-between gap-2 text-xs"
              style={{ borderColor: tokens.universalBorderColor, color: tokens.textIconColor }}
            >
              <span className="opacity-75">
                Ready to ship your full landing page and SaaS app in this exact brand system?
              </span>
              <a href="https://zerorapid.in" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" iconRight={<ArrowUpRight className="w-3.5 h-3.5" />}>
                  Build with ZeroRapid
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
