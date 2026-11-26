"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  RotateCcw,
  Check,
  Copy,
  FileCode2,
  X,
  Activity,
  Palette,
  Type,
  Maximize,
  Layers,
  ChevronDown,
  Sparkles,
  Shield,
  ShieldCheck,
  Zap,
  Terminal,
  Cpu,
  Globe,
  Upload,
  Shapes,
  Download,
  Landmark,
  Stethoscope,
} from "lucide-react";
import { useZeroLight } from "../context";
import {
  DEFAULT_TOKENS,
  CornerRadiusPreset,
  HeightDensityPreset,
  ElevationPreset,
  MotionPhysicsPreset,
  IconStrokePreset,
  IconFillPreset,
  IconLibraryPreset,
  GOOGLE_FONT_CATALOG,
} from "../types";
import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";
import { Switch } from "../atoms/switch";
import { Slider } from "../atoms/slider";
import { Input } from "../atoms/input";
import { Select } from "../molecules/select";
import { FileUpload } from "../molecules/file-upload";
import { DynamicIcon } from "../atoms/dynamic-icon";

export interface TokenStudioSidebarProps {
  className?: string;
  brandName?: string;
  onBrandNameChange?: (name: string) => void;
  brandMark?: string;
  onBrandMarkChange?: (mark: string) => void;
  brandLogoUrl?: string | null;
  onBrandLogoUpload?: (url: string | null) => void;
  selectedIconMark?: string;
  onSelectedIconMarkChange?: (id: string) => void;
  exportOpen?: boolean;
  onExportOpenChange?: (open: boolean) => void;
}

const BRAND_ACCENT_PRESETS = [
  { hex: "#0F172A", name: "Obsidian Ink" },
  { hex: "#4F46E5", name: "Indigo" },
  { hex: "#2563EB", name: "Royal Blue" },
  { hex: "#059669", name: "Emerald" },
  { hex: "#7C3AED", name: "Violet" },
  { hex: "#E11D48", name: "Rose" },
  { hex: "#D97706", name: "Amber" },
];

const SURFACE_FILL_PRESETS = [
  { hex: "#FFFFFF", name: "Pure White" },
  { hex: "#F8F9FA", name: "Stage Gray" },
  { hex: "#F1F5F9", name: "Cool Slate" },
  { hex: "#0F172A", name: "Obsidian Dark" },
];

const BORDER_COLOR_PRESETS = [
  { hex: "#E2E8F0", name: "Subtle Hairline" },
  { hex: "#CBD5E1", name: "Medium Slate" },
  { hex: "#94A3B8", name: "Crisp Stroke" },
  { hex: "#000000", name: "Ink Black" },
];

const POPULAR_SANS_FONTS = [
  { family: "Plus Jakarta Sans", label: "Plus Jakarta" },
  { family: "Inter", label: "Inter UI" },
  { family: "Geist", label: "Geist" },
  { family: "Space Grotesk", label: "Space Grotesk" },
  { family: "DM Sans", label: "DM Sans" },
  { family: "Outfit", label: "Outfit" },
];

const LOGO_PRESET_ICONS = [
  { id: "shield", icon: Shield, label: "Shield" },
  { id: "zap", icon: Zap, label: "Zap" },
  { id: "terminal", icon: Terminal, label: "Terminal" },
  { id: "cpu", icon: Cpu, label: "Cpu" },
  { id: "globe", icon: Globe, label: "Globe" },
];

export const INDUSTRY_ARCHETYPES = [
  {
    id: "fintech",
    label: "Fintech",
    icon: Landmark,
    caption: "Obsidian & Emerald",
    brandName: "Finexy Ledger",
    brandMark: "FL",
    selectedIconMark: "shield",
    tokens: {
      primaryButtonColor: "#059669",
      chartSecondaryColor: "#0EA5E9",
      universalFillColor: "#09090B",
      universalBorderColor: "#27272A",
      textIconColor: "#F4F4F5",
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      cornerRadius: 0 as const,
      density: "compact" as const,
      chartPalette: "emerald" as const,
      elevation: "flat" as const,
    },
  },
  {
    id: "healthcare",
    label: "Healthcare",
    icon: Stethoscope,
    caption: "Clean Pure White",
    brandName: "MediPulse Health",
    brandMark: "MP",
    selectedIconMark: "activity",
    tokens: {
      primaryButtonColor: "#2563EB",
      chartSecondaryColor: "#06B6D4",
      universalFillColor: "#FFFFFF",
      universalBorderColor: "#E2E8F0",
      textIconColor: "#0F172A",
      fontFamily: "Plus Jakarta Sans",
      headingFontFamily: "Plus Jakarta Sans",
      cornerRadius: 8 as const,
      density: "normal" as const,
      chartPalette: "sky" as const,
      elevation: "soft" as const,
    },
  },
  {
    id: "devops",
    label: "DevOps",
    icon: Terminal,
    caption: "Dark Slate & Amber",
    brandName: "KubeStream Ops",
    brandMark: "KS",
    selectedIconMark: "terminal",
    tokens: {
      primaryButtonColor: "#F59E0B",
      chartSecondaryColor: "#8B5CF6",
      universalFillColor: "#0F172A",
      universalBorderColor: "#334155",
      textIconColor: "#F8FAFC",
      fontFamily: "Space Grotesk",
      headingFontFamily: "Space Grotesk",
      cornerRadius: 0 as const,
      density: "compact" as const,
      chartPalette: "amber" as const,
      elevation: "elevated" as const,
    },
  },
  {
    id: "creative",
    label: "Creative",
    icon: Palette,
    caption: "Violet & Stage Gray",
    brandName: "Vivid Studio",
    brandMark: "VS",
    selectedIconMark: "sparkles",
    tokens: {
      primaryButtonColor: "#7C3AED",
      chartSecondaryColor: "#F43F5E",
      universalFillColor: "#F8F9FA",
      universalBorderColor: "#E2E8F0",
      textIconColor: "#18181B",
      fontFamily: "Outfit",
      headingFontFamily: "Outfit",
      cornerRadius: 16 as const,
      density: "spacious" as const,
      chartPalette: "violet" as const,
      elevation: "soft" as const,
    },
  },
];

type AccordionSection = "brand" | "typography" | "geometry" | "surface" | "icons" | "motion" | null;

export function TokenStudioSidebar({
  className = "",
  brandName = "ZeroLight OS",
  onBrandNameChange,
  brandMark = "ZL",
  onBrandMarkChange,
  brandLogoUrl = null,
  onBrandLogoUpload,
  selectedIconMark: selectedIconMarkProp = "shield",
  onSelectedIconMarkChange,
  exportOpen: exportOpenProp,
  onExportOpenChange,
}: TokenStudioSidebarProps) {
  const { tokens, scaled, updateTokens } = useZeroLight();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Single-Section Exclusive Accordion State (only one open at a time, smooth in-place toggle)
  const [activeSection, setActiveSection] = useState<string | null>("brand");

  const toggleSection = (sec: string) => {
    setActiveSection((prev) => (prev === sec ? null : sec));
  };

  // Local state for custom hex typing
  const [customHex, setCustomHex] = useState(tokens.primaryButtonColor || "#0F172A");
  const [customSecHex, setCustomSecHex] = useState(tokens.chartSecondaryColor || "#FFFFFF");
  const [localIconMark, setLocalIconMark] = useState<string>("shield");
  const activeIconMark = selectedIconMarkProp || localIconMark;

  const handleIconSelect = (id: string) => {
    setLocalIconMark(id);
    onSelectedIconMarkChange?.(id);
  };
  const [springTestActive, setSpringTestActive] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);

  // Helper functions for custom 2D HSV color picker (ZERO system popup)
  const hsvToHex = (h: number, s: number, v: number): string => {
    const f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    const rgb = [f(5), f(3), f(1)].map((x) => Math.round(x * 255).toString(16).padStart(2, "0"));
    return ("#" + rgb.join("")).toUpperCase();
  };

  const hexToHsv = (hex: string): { h: number; s: number; v: number } => {
    let cleanHex = hex.replace("#", "");
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split("").map((c) => c + c).join("");
    }
    const r = parseInt(cleanHex.slice(0, 2) || "0", 16) / 255;
    const g = parseInt(cleanHex.slice(2, 4) || "0", 16) / 255;
    const b = parseInt(cleanHex.slice(4, 6) || "0", 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    if (max !== min) {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s, v };
  };

  // Export Modal state (lifted or local)
  const [internalExportOpen, setInternalExportOpen] = useState(false);
  const exportOpen = exportOpenProp !== undefined ? exportOpenProp : internalExportOpen;
  const setExportOpen = (val: boolean) => {
    setInternalExportOpen(val);
    onExportOpenChange?.(val);
  };
  const [exportFormat, setExportFormat] = useState<"css" | "tailwind" | "tsx">("css");
  const [copied, setCopied] = useState(false);

  const resetAllTokens = () => {
    updateTokens?.(DEFAULT_TOKENS);
    setCustomHex(DEFAULT_TOKENS.primaryButtonColor);
    setHighContrastMode(false);
    onBrandNameChange?.("ZeroLight OS");
    onBrandMarkChange?.("ZL");
    onBrandLogoUpload?.(null);
  };

  const handleAccentChange = (hex: string) => {
    setCustomHex(hex);
    updateTokens?.({ primaryButtonColor: hex });
  };

  const handleStart2dDrag = (e: React.MouseEvent<HTMLDivElement>, target: "primary" | "secondary") => {
    e.preventDefault();
    const targetElem = e.currentTarget;
    const updateFromMouse = (clientX: number, clientY: number) => {
      const rect = targetElem.getBoundingClientRect();
      const s = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const v = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));
      const currentColor = target === "primary" ? tokens.primaryButtonColor : (tokens.chartSecondaryColor || "#FFFFFF");
      const hsv = hexToHsv(currentColor);
      const hex = hsvToHex(hsv.h, s, v);
      if (target === "primary") {
        handleAccentChange(hex);
      } else {
        updateTokens?.({ chartSecondaryColor: hex });
        setCustomSecHex(hex);
      }
    };
    updateFromMouse(e.clientX, e.clientY);

    const onMove = (moveEvt: MouseEvent) => {
      updateFromMouse(moveEvt.clientX, moveEvt.clientY);
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handleStartHueDrag = (e: React.MouseEvent<HTMLDivElement>, target: "primary" | "secondary") => {
    e.preventDefault();
    const targetElem = e.currentTarget;
    const updateFromMouse = (clientX: number) => {
      const rect = targetElem.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const currentColor = target === "primary" ? tokens.primaryButtonColor : (tokens.chartSecondaryColor || "#FFFFFF");
      const hsv = hexToHsv(currentColor);
      const hex = hsvToHex(Math.round(percent * 360), hsv.s, hsv.v);
      if (target === "primary") {
        handleAccentChange(hex);
      } else {
        updateTokens?.({ chartSecondaryColor: hex });
        setCustomSecHex(hex);
      }
    };
    updateFromMouse(e.clientX);

    const onMove = (moveEvt: MouseEvent) => {
      updateFromMouse(moveEvt.clientX);
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onBrandLogoUpload?.(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getExportCode = () => {
    if (exportFormat === "css") {
      return `:root {
  /* ZeroLight Light-Mode Token Architecture */
  --zl-brand-name: "${brandName}";
  --zl-accent: ${tokens.primaryButtonColor};
  --zl-accent-fg: #FFFFFF;
  --zl-surface: ${tokens.universalFillColor || "#FFFFFF"};
  --zl-border-hairline: ${tokens.universalBorderColor || "#E2E8F0"};
  --zl-ink-primary: ${tokens.textIconColor || "#0F172A"};
  --zl-font-body: "${tokens.fontFamily || "Plus Jakarta Sans"}", sans-serif;
  --zl-font-heading: "${tokens.headingFontFamily || "Plus Jakarta Sans"}", sans-serif;
  --zl-radius: ${tokens.cornerRadius}px;
  --zl-border-w: ${tokens.borderWidth}px;
  --zl-control-h: ${tokens.heightDensity || 40}px;
  --zl-elevation: ${tokens.elevation || "soft"};
  --zl-motion-physics: ${tokens.motionPhysics || "damped"};
}`;
    }
    if (exportFormat === "tailwind") {
      return `// tailwind.config.js - ZeroLight Light-Mode Theme Extension
module.exports = {
  theme: {
    extend: {
      colors: {
        zlAccent: "${tokens.primaryButtonColor}",
        zlSurface: "${tokens.universalFillColor || "#FFFFFF"}",
        zlBorder: "${tokens.universalBorderColor || "#E2E8F0"}",
        zlInk: "${tokens.textIconColor || "#0F172A"}",
      },
      fontFamily: {
        body: ["${tokens.fontFamily || "Plus Jakarta Sans"}", "sans-serif"],
        heading: ["${tokens.headingFontFamily || "Plus Jakarta Sans"}", "sans-serif"],
      },
      borderRadius: {
        zl: "${tokens.cornerRadius}px",
      },
    },
  },
};`;
    }
    return `// ZeroLight Provider Initialization (React TSX)
import { ZeroLightProvider } from "@zerolight/design-system";

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <ZeroLightProvider
      tokens={{
        primaryButtonColor: "${tokens.primaryButtonColor}",
        fontFamily: "${tokens.fontFamily || "Plus Jakarta Sans"}",
        headingFontFamily: "${tokens.headingFontFamily || "Plus Jakarta Sans"}",
        cornerRadius: ${tokens.cornerRadius},
        borderWidth: ${tokens.borderWidth},
        heightDensity: ${tokens.heightDensity},
        universalFillColor: "${tokens.universalFillColor || "#FFFFFF"}",
        universalBorderColor: "${tokens.universalBorderColor || "#E2E8F0"}",
        textIconColor: "${tokens.textIconColor || "#0F172A"}",
      }}
    >
      {children}
    </ZeroLightProvider>
  );
}`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getExportCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerSpringPreview = () => {
    setSpringTestActive(true);
    setTimeout(() => setSpringTestActive(false), 600);
  };

  const applyArchetype = (arch: typeof INDUSTRY_ARCHETYPES[number]) => {
    updateTokens?.(arch.tokens);
    onBrandNameChange?.(arch.brandName);
    onBrandMarkChange?.(arch.brandMark);
    onSelectedIconMarkChange?.(arch.selectedIconMark);
  };

  return (
    <aside
      data-zl-studio-chrome="true"
      className={`w-full shrink-0 bg-white p-4 flex flex-col justify-between shadow-none select-none font-sans text-slate-800 h-full min-h-0 ${className}`}
    >
      {/* ── TOP HEADER (PINNED) ── */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-700" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">Token Studio</h3>
            <p className="text-[10px] text-slate-400">Design System Architecture</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={resetAllTokens}
            title="Reset all design tokens to default"
            className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* ── MIDDLE SCROLLABLE ACCORDIONS (FLEX-1, EXPANDS/CONTRACTS INSIDE) ── */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pr-1 py-3 space-y-2 scroll-pt-4 scrollbar-thin scrollbar-thumb-slate-200"
      >
        {/* ── 1-CLICK INDUSTRY ARCHETYPES ── */}
        <div className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Industry Presets</span>
            <span className="text-[9px] text-slate-400 font-medium">1-Click Live Transform</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {INDUSTRY_ARCHETYPES.map((arch) => {
              const IconComp = arch.icon;
              return (
              <button
                key={arch.id}
                type="button"
                onClick={() => applyArchetype(arch)}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:border-slate-400 hover:shadow-xs transition-all flex items-center gap-2 text-left cursor-pointer group min-w-0"
              >
                <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0 text-slate-700 group-hover:text-slate-950">
                  <IconComp className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-slate-800 leading-tight group-hover:text-slate-900 truncate">{arch.label}</div>
                  <div className="text-[9px] text-slate-400 truncate">{arch.caption}</div>
                </div>
              </button>
              );
            })}
          </div>
        </div>

        {/* ── ACCORDION 1: BRAND IDENTITY & LOGO ── */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("brand")}
            className="w-full px-3 py-2.5 flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:bg-slate-100/60 transition-colors cursor-pointer shrink-0"
          >
            <div className="flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-slate-600" />
              <span>Brand Identity & Logo</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                activeSection === "brand" ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence initial={false}>
            {activeSection === "brand" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="p-3 pt-1 space-y-3 border-t border-slate-200/60 bg-white">
                  {/* Brand Name Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 block">Brand / Company Name</label>
                    <Input
                      value={brandName}
                      onChange={(e) => onBrandNameChange?.(e.target.value)}
                      placeholder="ZeroLight OS"
                    />
                  </div>

                  {/* Brand Monogram & Preset Icons */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-700 block">Logo Mark / Symbol</label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={brandMark}
                        maxLength={3}
                        onChange={(e) => onBrandMarkChange?.(e.target.value.toUpperCase())}
                        placeholder="ZL"
                        className="w-14 text-center font-bold uppercase"
                      />

                      <div className="flex items-center gap-1">
                        {LOGO_PRESET_ICONS.map((item) => {
                          const isSel = activeIconMark === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleIconSelect(item.id)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                isSel ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                              }`}
                              title={item.label}
                            >
                              <DynamicIcon
                                name={item.id as any}
                                library={tokens.iconLibrary}
                                size={14}
                                strokeWidth={tokens.iconStrokeWidth || 1.75}
                                color={isSel ? "#FFFFFF" : tokens.textIconColor}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Custom Logo Upload using real ZeroLight FileUpload molecule */}
                  <div className="pt-1">
                    <FileUpload
                      label="Custom Brand Logo"
                      acceptText="PNG, SVG, or JPG"
                      accept="image/*"
                      compact={true}
                      files={
                        brandLogoUrl
                          ? [
                              {
                                id: "brand-logo",
                                name: "brand-logo.png",
                                size: "Custom Brand Mark",
                                progress: 100,
                                status: "complete",
                                previewUrl: brandLogoUrl,
                              },
                            ]
                          : []
                      }
                      onUpload={(fileList) => {
                        if (fileList && fileList[0]) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            onBrandLogoUpload?.(e.target?.result as string);
                          };
                          reader.readAsDataURL(fileList[0]);
                        }
                      }}
                      onRemoveFile={() => onBrandLogoUpload?.(null)}
                    />
                  </div>

                  {/* Primary Accent Color */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-700">Primary Accent</label>
                      <Badge variant="neutral" size="xs" showDot={false} className="font-sans tabular-nums text-[10px]">
                        {tokens.primaryButtonColor.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {BRAND_ACCENT_PRESETS.map((preset) => {
                        const isSelected = tokens.primaryButtonColor.toUpperCase() === preset.hex.toUpperCase();
                        return (
                          <button
                            key={preset.hex}
                            type="button"
                            onClick={() => handleAccentChange(preset.hex)}
                            style={{ backgroundColor: preset.hex }}
                            className={`w-5 h-5 rounded-full border border-slate-300 transition-transform cursor-pointer relative ${
                              isSelected
                                ? "ring-2 ring-slate-900 ring-offset-2 ring-offset-white scale-110 shadow-xs"
                                : "hover:scale-105 opacity-85 hover:opacity-100"
                            }`}
                            title={preset.name}
                          />
                        );
                      })}
                    </div>

                    {/* 2D Saturation-Brightness Spectrum Box (No OS Popup) */}
                    <div
                      className="relative h-24 w-full rounded-lg cursor-crosshair overflow-hidden border border-slate-200"
                      style={{
                        backgroundColor: hsvToHex(hexToHsv(tokens.primaryButtonColor).h, 1, 1),
                        backgroundImage:
                          "linear-gradient(to right, #FFFFFF 0%, rgba(255,255,255,0) 100%), linear-gradient(to top, #000000 0%, rgba(0,0,0,0) 100%)",
                      }}
                      onMouseDown={(e) => handleStart2dDrag(e, "primary")}
                    >
                      <div
                        className="absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs pointer-events-none -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${hexToHsv(tokens.primaryButtonColor).s * 100}%`,
                          top: `${(1 - hexToHsv(tokens.primaryButtonColor).v) * 100}%`,
                        }}
                      />
                    </div>

                    {/* Hue Spectrum Bar */}
                    <div
                      className="relative h-2.5 rounded-full cursor-pointer shadow-inner my-1 border border-slate-200"
                      style={{
                        background:
                          "linear-gradient(to right, #FF0000 0%, #FFFF00 17%, #00FF00 33%, #00FFFF 50%, #0000FF 67%, #FF00FF 83%, #FF0000 100%)",
                      }}
                      onMouseDown={(e) => handleStartHueDrag(e, "primary")}
                    />

                    {/* Direct Hex Input */}
                    <div className="flex items-center gap-2 pt-1">
                      <div
                        className="w-6 h-6 rounded-lg border border-slate-300 shrink-0 shadow-2xs"
                        style={{ backgroundColor: tokens.primaryButtonColor }}
                      />
                      <Input
                        value={customHex}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomHex(val);
                          if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                            updateTokens?.({ primaryButtonColor: val });
                          }
                        }}
                        placeholder="#0F172A"
                        maxLength={7}
                        className="w-full font-sans tabular-nums uppercase"
                      />
                    </div>
                  </div>

                  {/* Secondary Chart Accent Color (Live Dynamic Binding) */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-700">Secondary Chart Accent</label>
                      <Badge variant="neutral" size="xs" showDot={false} className="font-sans tabular-nums text-[10px]">
                        {(tokens.chartSecondaryColor || "#FFFFFF").toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        { name: "White", hex: "#FFFFFF" },
                        { name: "Slate", hex: "#64748B" },
                        { name: "Cyan", hex: "#06B6D4" },
                        { name: "Sky", hex: "#0EA5E9" },
                        { name: "Emerald", hex: "#10B981" },
                        { name: "Amber", hex: "#F59E0B" },
                        { name: "Violet", hex: "#8B5CF6" },
                        { name: "Rose", hex: "#F43F5E" },
                      ].map((preset) => {
                        const isSelected = (tokens.chartSecondaryColor || "#FFFFFF").toUpperCase() === preset.hex.toUpperCase();
                        return (
                          <button
                            key={preset.hex}
                            type="button"
                            onClick={() => {
                              updateTokens?.({ chartSecondaryColor: preset.hex });
                              setCustomSecHex(preset.hex);
                            }}
                            style={{ backgroundColor: preset.hex }}
                            className={`w-5 h-5 rounded-full border border-slate-300 transition-transform cursor-pointer relative ${
                              isSelected
                                ? "ring-2 ring-slate-900 ring-offset-2 ring-offset-white scale-110 shadow-xs"
                                : "hover:scale-105 opacity-85 hover:opacity-100"
                            }`}
                            title={preset.name}
                          />
                        );
                      })}
                    </div>

                    {/* 2D Saturation-Brightness Spectrum Box for Secondary */}
                    <div
                      className="relative h-24 w-full rounded-lg cursor-crosshair overflow-hidden border border-slate-200"
                      style={{
                        backgroundColor: hsvToHex(hexToHsv(tokens.chartSecondaryColor || "#FFFFFF").h, 1, 1),
                        backgroundImage:
                          "linear-gradient(to right, #FFFFFF 0%, rgba(255,255,255,0) 100%), linear-gradient(to top, #000000 0%, rgba(0,0,0,0) 100%)",
                      }}
                      onMouseDown={(e) => handleStart2dDrag(e, "secondary")}
                    >
                      <div
                        className="absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs pointer-events-none -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${hexToHsv(tokens.chartSecondaryColor || "#FFFFFF").s * 100}%`,
                          top: `${(1 - hexToHsv(tokens.chartSecondaryColor || "#FFFFFF").v) * 100}%`,
                        }}
                      />
                    </div>

                    {/* Secondary Rainbow Hue Slider */}
                    <div
                      className="relative h-2.5 rounded-full cursor-pointer shadow-inner my-1 border border-slate-200"
                      style={{
                        background:
                          "linear-gradient(to right, #FF0000 0%, #FFFF00 17%, #00FF00 33%, #00FFFF 50%, #0000FF 67%, #FF00FF 83%, #FF0000 100%)",
                      }}
                      onMouseDown={(e) => handleStartHueDrag(e, "secondary")}
                    />

                    {/* Secondary Hex Input */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <div
                        className="w-6 h-6 rounded-lg border border-slate-300 shrink-0 shadow-2xs"
                        style={{ backgroundColor: tokens.chartSecondaryColor || "#FFFFFF" }}
                      />
                      <Input
                        value={customSecHex}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomSecHex(val);
                          if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                            updateTokens?.({ chartSecondaryColor: val });
                          }
                        }}
                        placeholder="#FFFFFF"
                        maxLength={7}
                        className="w-full font-sans tabular-nums uppercase"
                      />
                    </div>
                  </div>

                  {/* Surface Fill Color */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-700 block">Surface Fill</label>
                    <div className="grid grid-cols-4 gap-1">
                      {SURFACE_FILL_PRESETS.map((sf) => (
                        <button
                          key={sf.hex}
                          type="button"
                          onClick={() => updateTokens?.({ universalFillColor: sf.hex })}
                          className={`py-1 text-[10px] font-medium rounded-lg border transition-colors cursor-pointer text-center truncate ${
                            (tokens.universalFillColor || "#FFFFFF").toUpperCase() === sf.hex.toUpperCase()
                              ? "bg-slate-900 text-white border-slate-900 font-bold"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {sf.name.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Border Hairline Color */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-700 block">Border Stroke Color</label>
                    <div className="grid grid-cols-4 gap-1">
                      {BORDER_COLOR_PRESETS.map((bc) => (
                        <button
                          key={bc.hex}
                          type="button"
                          onClick={() => updateTokens?.({ universalBorderColor: bc.hex })}
                          className={`py-1 text-[10px] font-medium rounded-lg border transition-colors cursor-pointer text-center truncate ${
                            (tokens.universalBorderColor || "#E2E8F0").toUpperCase() === bc.hex.toUpperCase()
                              ? "bg-slate-900 text-white border-slate-900 font-bold"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {bc.name.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── ACCORDION 2: UNIFIED TYPOGRAPHY ENGINE (NO CLIPPING) ── */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("typography")}
            className="w-full px-3 py-2 flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:bg-slate-100/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Type className="w-3.5 h-3.5 text-slate-600" />
              <span>Typography & Fonts</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                activeSection === "typography" ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence initial={false}>
            {activeSection === "typography" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="p-3 pt-1 space-y-3.5 border-t border-slate-200/60 bg-white">
                  {/* Unified Single Font Family */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-700">Font Family</label>
                      <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/50 truncate max-w-[140px]">
                        {tokens.fontFamily || "Plus Jakarta Sans"}
                      </span>
                    </div>

                    {/* Quick Curated Sans Pills */}
                    <div className="grid grid-cols-3 gap-1 pt-0.5">
                      {POPULAR_SANS_FONTS.map((font) => {
                        const isSelected = (tokens.fontFamily || "Plus Jakarta Sans") === font.family;
                        return (
                          <button
                            key={font.family}
                            type="button"
                            onClick={() =>
                              updateTokens?.({
                                fontFamily: font.family,
                                headingFontFamily: font.family,
                              })
                            }
                            className={`px-1.5 py-1 text-[10px] rounded-md border text-center transition-all truncate cursor-pointer ${
                              isSelected
                                ? "border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-xs"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                            title={font.family}
                          >
                            {font.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Complete Google Font Catalog Dropdown (Native - Zero Clipping) */}
                    <div className="pt-1">
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">
                        All Sans-Serif & Editorial Fonts:
                      </label>
                      <div className="relative">
                        <select
                          value={tokens.fontFamily || "Plus Jakarta Sans"}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateTokens?.({ fontFamily: val, headingFontFamily: val });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-slate-800 transition-colors cursor-pointer pr-8 appearance-none shadow-2xs"
                        >
                          {GOOGLE_FONT_CATALOG.map((f) => (
                            <option key={f.family} value={f.family}>
                              {f.family} ({f.category})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Font Size Scaling */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-700">Font Size Ramp</label>
                      <span className="text-[10px] font-sans tabular-nums text-slate-600 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                        {tokens.fontSize || 14}px
                      </span>
                    </div>
                    <Slider
                      value={tokens.fontSize || 14}
                      min={12}
                      max={18}
                      step={1}
                      onChange={(val) => updateTokens?.({ fontSize: val })}
                    />
                    <div className="grid grid-cols-4 gap-1 pt-0.5">
                      {[
                        { size: 12, label: "12px", note: "Dense" },
                        { size: 13, label: "13px", note: "Compact" },
                        { size: 14, label: "14px", note: "Default" },
                        { size: 16, label: "16px", note: "Spacious" },
                      ].map((preset) => (
                        <button
                          key={preset.size}
                          type="button"
                          onClick={() => updateTokens?.({ fontSize: preset.size })}
                          className={`px-1 py-1 text-[10px] rounded-md border text-center transition-all cursor-pointer ${
                            (tokens.fontSize || 14) === preset.size
                              ? "border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-xs"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <span className="block font-semibold font-sans tabular-nums">{preset.label}</span>
                          <span className="block text-[8px] text-slate-400">{preset.note}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Styles & Weights */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-700">Font Weight</label>
                      <span className="text-[10px] font-sans tabular-nums text-slate-500">
                        w{tokens.bodyWeight ?? 400}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {[
                        { weight: 300, label: "300" },
                        { weight: 400, label: "400" },
                        { weight: 500, label: "500" },
                        { weight: 600, label: "600" },
                        { weight: 700, label: "700" },
                      ].map((w) => {
                        const active = (tokens.bodyWeight ?? 400) === w.weight;
                        return (
                          <button
                            key={w.weight}
                            type="button"
                            onClick={() =>
                              updateTokens?.({
                                bodyWeight: w.weight as any,
                                headingWeight: (w.weight >= 600 ? 800 : Math.min(800, w.weight + 200)) as any,
                              })
                            }
                            className={`py-1 text-[10px] rounded-md border text-center transition-all cursor-pointer font-sans tabular-nums ${
                              active
                                ? "border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-xs"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                            style={{ fontWeight: w.weight }}
                          >
                            {w.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Posture & Tracking */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    {/* Style / Posture */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-600">Style</label>
                      <div className="flex rounded-md border border-slate-200 p-0.5 bg-slate-50">
                        <button
                          type="button"
                          onClick={() => updateTokens?.({ fontStyle: "normal" })}
                          className={`flex-1 py-1 text-[10px] rounded text-center transition-all cursor-pointer ${
                            (tokens.fontStyle || "normal") === "normal"
                              ? "bg-white text-slate-900 font-semibold shadow-xs"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          Normal
                        </button>
                        <button
                          type="button"
                          onClick={() => updateTokens?.({ fontStyle: "italic" })}
                          className={`flex-1 py-1 text-[10px] rounded text-center italic transition-all cursor-pointer ${
                            tokens.fontStyle === "italic"
                              ? "bg-white text-slate-900 font-semibold shadow-xs"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          Italic
                        </button>
                      </div>
                    </div>

                    {/* Tracking / Letter Spacing */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-600">Tracking</label>
                      <div className="flex rounded-md border border-slate-200 p-0.5 bg-slate-50">
                        {(["tight", "normal", "wide"] as const).map((spacing) => (
                          <button
                            key={spacing}
                            type="button"
                            onClick={() => updateTokens?.({ letterSpacing: spacing })}
                            className={`flex-1 py-1 text-[10px] capitalize rounded text-center transition-all cursor-pointer ${
                              (tokens.letterSpacing || "normal") === spacing
                                ? "bg-white text-slate-900 font-semibold shadow-xs"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                          >
                            {spacing}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Line Height (Leading) */}
                  <div className="space-y-1 pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-semibold text-slate-600">Line Height</label>
                      <span className="text-[9px] font-sans tabular-nums text-slate-400 capitalize">
                        {tokens.lineHeight || "normal"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { id: "compact", label: "Compact 1.35" },
                        { id: "normal", label: "Normal 1.50" },
                        { id: "relaxed", label: "Relaxed 1.65" },
                      ].map((lh) => (
                        <button
                          key={lh.id}
                          type="button"
                          onClick={() => updateTokens?.({ lineHeight: lh.id as any })}
                          className={`py-1 text-[10px] rounded-md border text-center transition-all cursor-pointer ${
                            (tokens.lineHeight || "normal") === lh.id
                              ? "border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-xs"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {lh.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Typography Specimen Box */}
                  <div
                    className="mt-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/80 space-y-1 text-slate-900 transition-all"
                    style={{
                      fontFamily: scaled.resolvedFontFamily,
                      fontStyle: tokens.fontStyle || "normal",
                      letterSpacing: scaled.letterSpacingCss,
                      lineHeight: scaled.lineHeightCss,
                    }}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-200/60 pb-1">
                      <span className="font-semibold text-slate-700">{tokens.fontFamily || "Plus Jakarta Sans"}</span>
                      <span className="font-sans tabular-nums">{tokens.fontSize || 14}px · w{tokens.bodyWeight ?? 400}</span>
                    </div>
                    <div
                      className="pt-0.5"
                      style={{
                        fontSize: `${tokens.fontSize || 14}px`,
                        fontWeight: tokens.bodyWeight ?? 400,
                      }}
                    >
                      The quick brown fox jumps over the lazy dog.
                    </div>
                    <div className="text-[11px] text-slate-500 font-sans tabular-nums">
                      ARR: $482,900.00 (+14.2%) · 99.98% SLA
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── ACCORDION 3: SHAPE & GEOMETRY ── */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("geometry")}
            className="w-full px-3 py-2 flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:bg-slate-100/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Maximize className="w-3.5 h-3.5 text-slate-600" />
              <span>Shape & Density</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                activeSection === "geometry" ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence initial={false}>
            {activeSection === "geometry" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="p-3 pt-1 space-y-3 border-t border-slate-200/60 bg-white">
                  {/* Corner Radius */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-700">Corner Radius</label>
                      <span className="text-[10px] font-sans tabular-nums text-slate-500">
                        {tokens.cornerRadius}px
                      </span>
                    </div>
                    <Slider
                      value={tokens.cornerRadius > 20 ? 20 : tokens.cornerRadius}
                      min={0}
                      max={20}
                      step={1}
                      onChange={(val) => updateTokens?.({ cornerRadius: val as CornerRadiusPreset })}
                    />
                    <div className="grid grid-cols-4 gap-1 pt-1">
                      {[
                        { label: "Sharp", radius: 0 },
                        { label: "Apple", radius: 8 },
                        { label: "Curved", radius: 14 },
                        { label: "Pill", radius: 20 },
                      ].map((r) => (
                        <button
                          key={r.label}
                          type="button"
                          onClick={() => updateTokens?.({ cornerRadius: r.radius as CornerRadiusPreset })}
                          className={`py-1 text-[10px] font-medium rounded border transition-colors cursor-pointer text-center ${
                            tokens.cornerRadius === r.radius
                              ? "bg-slate-900 text-white border-slate-900 font-semibold"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Border Stroke Width */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-700 block">Border Stroke Width</label>
                    <div className="grid grid-cols-4 p-0.5 rounded-lg bg-slate-100 border border-slate-200/80 gap-0.5">
                      {[0, 1, 1.5, 2].map((bw) => (
                        <button
                          key={bw}
                          type="button"
                          onClick={() => updateTokens?.({ borderWidth: bw })}
                          className={`py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                            tokens.borderWidth === bw
                              ? "bg-white text-slate-950 font-bold shadow-2xs"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          {bw}px
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Height Density */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-700 block">Height Density</label>
                    <div className="grid grid-cols-3 p-0.5 rounded-lg bg-slate-100 border border-slate-200/80 gap-0.5">
                      {[
                        { key: "SM", density: 36, label: "SM (36px)" },
                        { key: "MD", density: 40, label: "MD (40px)" },
                        { key: "LG", density: 44, label: "LG (44px)" },
                      ].map((sz) => (
                        <button
                          key={sz.key}
                          type="button"
                          onClick={() => updateTokens?.({ heightDensity: sz.density as HeightDensityPreset })}
                          className={`py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                            (tokens.heightDensity || 40) === sz.density
                              ? "bg-white text-slate-950 font-bold shadow-2xs"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          {sz.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── ACCORDION 4: SURFACE & ELEVATION ── */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("surface")}
            className="w-full px-3 py-2 flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:bg-slate-100/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              <span>Surface & Elevation</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                activeSection === "surface" ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence initial={false}>
            {activeSection === "surface" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="p-3 pt-1 space-y-3 border-t border-slate-200/60 bg-white">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-700 block">Card Elevation</label>
                    <div className="grid grid-cols-3 p-0.5 rounded-lg bg-slate-100 border border-slate-200/80 gap-0.5">
                      {(["flat", "soft", "elevated"] as ElevationPreset[]).map((sh) => (
                        <button
                          key={sh}
                          type="button"
                          onClick={() => updateTokens?.({ elevation: sh })}
                          className={`py-1 text-[11px] font-medium rounded-md capitalize transition-all cursor-pointer ${
                            (tokens.elevation || "soft") === sh
                              ? "bg-white text-slate-950 font-bold shadow-2xs"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          {sh === "flat" ? "Flat" : sh === "soft" ? "Subtle" : "Elevated"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Switch
                      checked={highContrastMode}
                      onChange={(val) => {
                        setHighContrastMode(val);
                        if (val) {
                          updateTokens?.({ textIconColor: "#000000", universalBorderColor: "#CBD5E1" });
                        } else {
                          updateTokens?.({ textIconColor: DEFAULT_TOKENS.textIconColor, universalBorderColor: DEFAULT_TOKENS.universalBorderColor });
                        }
                      }}
                      label="High Contrast Lock"
                      description="Ensure WCAG compliance"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── ACCORDION 5: ICONS & GRAPHIC ASSETS ── */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("icons")}
            className="w-full px-3 py-2 flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:bg-slate-100/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Shapes className="w-3.5 h-3.5 text-slate-600" />
              <span>Icons &amp; Graphic Assets</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                activeSection === "icons" ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence initial={false}>
            {activeSection === "icons" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="p-3 pt-1 space-y-3.5 border-t border-slate-200/60 bg-white">
                  {/* Live Dynamic Vector Preview Strip */}
                  <div
                    className="p-2.5 rounded-lg border flex items-center justify-around shadow-2xs"
                    style={{
                      backgroundColor: tokens.hoverBackplateTint,
                      borderColor: tokens.universalBorderColor,
                    }}
                  >
                    {(["shield-check", "terminal", "zap", "sparkles", "cpu", "globe"] as const).map((iconName, idx) => (
                      <div key={idx} className="flex items-center justify-center p-1">
                        <DynamicIcon
                          name={iconName}
                          library={tokens.iconLibrary}
                          size={16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                        />
                      </div>
                    ))}
                  </div>

                  {/* 1. Open Source Icon Library Preset */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-700">Open Source Icon Library</label>
                      <Badge variant="neutral" size="xs" showDot={false} className="font-sans tabular-nums text-[10px]">
                        {(tokens.iconLibrary || "lucide").toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { id: "lucide", label: "Lucide (Rounded)", desc: "Balanced modern default" },
                        { id: "tabler", label: "Tabler (Geometric)", desc: "Crisp technical lines" },
                        { id: "feather", label: "Feather (Classic)", desc: "Minimal utilitarian" },
                        { id: "heroicons", label: "Heroicons (Micro)", desc: "Dense enterprise UI" },
                      ].map((lib) => {
                        const isMatch = (tokens.iconLibrary || "lucide") === lib.id;
                        return (
                          <button
                            key={lib.id}
                            type="button"
                            onClick={() => updateTokens?.({ iconLibrary: lib.id as IconLibraryPreset })}
                            className={`p-1.5 text-left rounded-lg border transition-all cursor-pointer ${
                              isMatch
                                ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            <div className="text-[11px] font-bold leading-tight">{lib.label}</div>
                            <div className={`text-[9px] truncate ${isMatch ? "text-slate-300" : "text-slate-500"}`}>
                              {lib.desc}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Stroke Width Preset */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-700">Icon Stroke Weight</label>
                      <span className="text-[10px] font-sans tabular-nums text-slate-500">
                        {tokens.iconStrokeWidth || 2.0}px
                      </span>
                    </div>
                    <div className="grid grid-cols-5 p-0.5 rounded-lg bg-slate-100 border border-slate-200/80 gap-0.5">
                      {([1.25, 1.5, 1.75, 2.0, 2.5] as IconStrokePreset[]).map((stroke) => {
                        const isMatch = (tokens.iconStrokeWidth || 2.0) === stroke;
                        return (
                          <button
                            key={stroke}
                            type="button"
                            onClick={() => updateTokens?.({ iconStrokeWidth: stroke })}
                            className={`py-1 text-[10px] font-semibold rounded-md transition-all cursor-pointer ${
                              isMatch
                                ? "bg-white text-slate-950 font-bold shadow-2xs"
                                : "text-slate-500 hover:text-slate-900"
                            }`}
                          >
                            {stroke}px
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Icon Fill Mode */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-700 block">Fill Mode</label>
                    <div className="grid grid-cols-3 p-0.5 rounded-lg bg-slate-100 border border-slate-200/80 gap-0.5">
                      {[
                        { id: "none", label: "Outline" },
                        { id: "subtle", label: "Subtle Tint" },
                        { id: "currentColor", label: "Solid Fill" },
                      ].map((fillOpt) => {
                        const isMatch = (tokens.iconFill || "none") === fillOpt.id;
                        return (
                          <button
                            key={fillOpt.id}
                            type="button"
                            onClick={() => updateTokens?.({ iconFill: fillOpt.id as IconFillPreset })}
                            className={`py-1 text-[10px] font-semibold rounded-md transition-all cursor-pointer ${
                              isMatch
                                ? "bg-white text-slate-950 font-bold shadow-2xs"
                                : "text-slate-500 hover:text-slate-900"
                            }`}
                          >
                            {fillOpt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Icon Color & Tint */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-700">Icon Color &amp; Tint</label>
                      <button
                        type="button"
                        onClick={() => updateTokens?.({ iconColor: tokens.primaryButtonColor })}
                        className="text-[10px] text-slate-500 hover:text-slate-900 underline cursor-pointer"
                      >
                        Match Accent
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        { hex: tokens.textIconColor || "#0F172A", name: "Text Color" },
                        { hex: tokens.primaryButtonColor || "#10B981", name: "Accent" },
                        { hex: "#64748B", name: "Medium Slate" },
                        { hex: "#059669", name: "Emerald" },
                        { hex: "#4F46E5", name: "Indigo" },
                        { hex: "#7C3AED", name: "Violet" },
                        { hex: "#0284C7", name: "Sky" },
                        { hex: "#D97706", name: "Amber" },
                        { hex: "#E11D48", name: "Rose" },
                      ].map((c) => {
                        const isMatch = (tokens.iconColor || tokens.textIconColor).toUpperCase() === c.hex.toUpperCase();
                        return (
                          <button
                            key={c.hex}
                            type="button"
                            onClick={() => updateTokens?.({ iconColor: c.hex })}
                            style={{ backgroundColor: c.hex }}
                            className={`w-5 h-5 rounded-full border border-slate-300 transition-transform cursor-pointer ${
                              isMatch ? "ring-2 ring-slate-900 ring-offset-2 scale-110 shadow-xs" : "hover:scale-105 opacity-85 hover:opacity-100"
                            }`}
                            title={c.name}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. Icon Scale Multiplier Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-700">Icon Scale Multiplier</label>
                      <span className="text-[10px] font-sans tabular-nums text-slate-500">
                        {((tokens.iconScaleMultiplier ?? 1.0) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Slider
                      value={Math.round((tokens.iconScaleMultiplier ?? 1.0) * 100)}
                      min={80}
                      max={130}
                      onChange={(v) => updateTokens?.({ iconScaleMultiplier: v / 100 })}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── ACCORDION 6: MOTION PHYSICS ── */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("motion")}
            className="w-full px-3 py-2 flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:bg-slate-100/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-slate-600" />
              <span>Motion Physics Engine</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                activeSection === "motion" ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence initial={false}>
            {activeSection === "motion" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="p-3 pt-1 space-y-3 border-t border-slate-200/60 bg-white">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-700 block">Preset Curve</label>
                    <div className="grid grid-cols-4 p-0.5 rounded-lg bg-slate-100 border border-slate-200/80 gap-0.5">
                      {(["instant", "snappy", "damped", "gentle"] as MotionPhysicsPreset[]).map((preset) => {
                        const isMatch = (tokens.motionPhysics || "damped") === preset;
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => updateTokens?.({ motionPhysics: preset })}
                            className={`py-1 text-[10px] font-medium rounded-md capitalize transition-all cursor-pointer ${
                              isMatch
                                ? "bg-white text-slate-950 font-bold shadow-2xs"
                                : "text-slate-500 hover:text-slate-900"
                            }`}
                          >
                            {preset}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-700">Spring Stiffness</label>
                      <span className="text-[10px] font-sans tabular-nums text-slate-500">{tokens.motionStiffness || 400}</span>
                    </div>
                    <Slider
                      value={tokens.motionStiffness || 400}
                      min={200}
                      max={600}
                      step={20}
                      onChange={(val) => updateTokens?.({ motionStiffness: val })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-700">Spring Damping</label>
                      <span className="text-[10px] font-sans tabular-nums text-slate-500">{tokens.motionDamping || 28}</span>
                    </div>
                    <Slider
                      value={tokens.motionDamping || 28}
                      min={15}
                      max={45}
                      step={1}
                      onChange={(val) => updateTokens?.({ motionDamping: val })}
                    />
                  </div>

                  <div className="pt-1">
                    <motion.button
                      type="button"
                      onClick={triggerSpringPreview}
                      animate={springTestActive ? { scale: [1, 0.92, 1.08, 0.98, 1], rotate: [0, -3, 3, 0] } : {}}
                      transition={{ type: "spring", stiffness: tokens.motionStiffness || 400, damping: tokens.motionDamping || 28 }}
                      className="w-full py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Activity className="w-3.5 h-3.5 text-violet-600" />
                      <span>Test Spring Recoil</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── BOTTOM CTA (PINNED FIRMLY AT BOTTOM) ── */}
      <div className="pt-3 border-t border-slate-100 shrink-0">
        <Button
          variant="primary"
          size="md"
          className="w-full text-xs font-semibold justify-center shadow-xs"
          iconLeft={<FileCode2 className="w-4 h-4" strokeWidth={1.75} />}
          onClick={() => setExportOpen(true)}
        >
          Export Design System
        </Button>
      </div>

      {/* ── EXPORT MODAL ── */}
      <AnimatePresence>
        {exportOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-5 space-y-4 text-slate-800"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <FileCode2 className="w-4 h-4 text-slate-800" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Export Design System Tokens</h3>
                    <p className="text-[11px] text-slate-500">Universal compilation for web, CSS variables, and Tailwind</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setExportOpen(false)}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 3-Way Format Switcher */}
              <div className="p-1 rounded-xl bg-slate-100 border border-slate-200/80 grid grid-cols-3 gap-1">
                {(["css", "tailwind", "tsx"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setExportFormat(fmt)}
                    className={`py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      exportFormat === fmt ? "bg-white text-slate-950 font-bold shadow-2xs" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {fmt === "css" ? "CSS Variables" : fmt === "tailwind" ? "Tailwind Config" : "React TSX"}
                  </button>
                ))}
              </div>

              {/* Code Viewer */}
              <div className="relative rounded-xl bg-slate-900 text-slate-200 p-3.5 max-h-60 overflow-y-auto font-sans tabular-nums text-[11px]">
                <pre>{getExportCode()}</pre>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExportOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const code = getExportCode();
                    const ext = exportFormat === "css" ? "css" : exportFormat === "tailwind" ? "js" : "tsx";
                    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `zerolight-tokens.${ext}`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  iconLeft={<Download className="w-3.5 h-3.5" />}
                >
                  Download {exportFormat === "css" ? "CSS" : exportFormat.toUpperCase()}
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCopyCode}
                  iconLeft={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                >
                  {copied ? "Copied!" : "Copy Code"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </aside>
  );
}
