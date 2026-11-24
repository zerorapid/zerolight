"use client";

import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  Zap,
  Terminal,
  Activity,
  Server,
  Database,
  Key,
  Plus,
  ArrowRight,
  Bookmark,
  Settings,
  Mail,
  X,
  ChevronDown,
  Sparkles,
  Cpu,
  Globe,
  Info,
} from "lucide-react";
import { useZeroLight } from "../context";
import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";
import { TagChip } from "../atoms/tag-chip";
import { Input } from "../atoms/input";
import { Switch } from "../atoms/switch";
import { Checkbox } from "../atoms/checkbox";
import { RadioGroup } from "../atoms/radio-group";
import { Avatar } from "../atoms/avatar";
import { Textarea } from "../atoms/textarea";
import { Select } from "../molecules/select";
import { DropdownMenu } from "../molecules/dropdown-menu";
import { Calendar } from "../molecules/calendar";
import { Pagination } from "../molecules/pagination";
import { Breadcrumbs } from "../molecules/breadcrumbs";
import { Tabs } from "../molecules/tabs";
import { ChatBubble } from "../molecules/chat-bubble";
import { AreaChart } from "../molecules/area-chart";
import { BarChart } from "../molecules/bar-chart";
import { DonutChart } from "../molecules/donut-chart";
import { Tooltip } from "../molecules/tooltip";
import { DynamicIcon } from "../atoms/dynamic-icon";

export interface ZeroLightCoreSpecStageProps {
  brandName?: string;
  brandMark?: string;
  brandLogoUrl?: string | null;
  selectedIconMark?: string;
  className?: string;
}

export function ZeroLightCoreSpecStage({
  brandName = "ZeroLight OS",
  brandMark = "ZL",
  brandLogoUrl,
  selectedIconMark = "layers",
  className = "",
}: ZeroLightCoreSpecStageProps) {
  const { tokens, scaled } = useZeroLight();

  // Interactive Form States
  const [inputValue, setInputValue] = useState("alex@zerolight.dev");
  const [selectedDropdown, setSelectedDropdown] = useState("enterprise");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date>(new Date(2026, 10, 20));
  const [textareaValue, setTextareaValue] = useState(
    "Production deployment completed with zero downtime across all regional edge zones."
  );
  const [switch1, setSwitch1] = useState(true);
  const [switch2, setSwitch2] = useState(false);
  const [radioChoice, setRadioChoice] = useState("auto");
  const [checkbox1, setCheckbox1] = useState(true);
  const [checkbox2, setCheckbox2] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilterChips, setActiveFilterChips] = useState([
    { id: "c1", label: "Production", active: true },
    { id: "c2", label: "US-East", active: false },
    { id: "c3", label: "Postgres v16", active: true },
    { id: "c4", label: "Latency < 20ms", active: false },
  ]);

  const removeChip = (id: string) => {
    setActiveFilterChips((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleChip = (id: string) => {
    setActiveFilterChips((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const primColor = tokens.primaryButtonColor || "#0F172A";
  const secColor =
    tokens.chartSecondaryColor &&
    tokens.chartSecondaryColor.toUpperCase() !== "#FFFFFF" &&
    tokens.chartSecondaryColor.toUpperCase() !== "#FFF"
      ? tokens.chartSecondaryColor
      : tokens.universalFillColor?.toUpperCase() === "#FFFFFF" || !tokens.universalFillColor
      ? "#64748B"
      : tokens.chartSecondaryColor || "#64748B";

  return (
    <div className={`w-full max-w-6xl mx-auto px-6 pt-6 pb-8 space-y-8 font-sans ${className}`}>
      {/* ── EXECUTIVE MULTI-PAGE PRINT BANNER (VISIBLE ONLY IN PRINT / PDF EXPORT) ── */}
      <div className="hidden print:flex justify-between items-end pb-3 mb-6 border-b-2 border-slate-900">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {brandName} — Design System Specification
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise Design Tokens, Primitive Molecules &amp; Component Standards Catalog
          </p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Token Invariants: Verified</div>
          <div>Multi-Page Vector Specification</div>
        </div>
      </div>
      {/* ── BRAND LOCKUP BANNER ── */}
      <div
        className="p-5 border flex items-center gap-4 transition-all"
        style={{
          backgroundColor: tokens.universalFillColor || "#FFFFFF",
          borderColor: tokens.universalBorderColor || "#E2E8F0",
          borderWidth: `${tokens.borderWidth ?? 1}px`,
          borderRadius: `${tokens.cornerRadius || 12}px`,
          boxShadow: scaled.cardShadow,
        }}
      >
        {brandLogoUrl ? (
          <img
            src={brandLogoUrl}
            alt="Brand Logo"
            className="w-12 h-12 rounded-xl object-contain shadow-xs shrink-0 bg-white border border-slate-200 p-1"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-xs shrink-0"
            style={{ backgroundColor: primColor }}
          >
            {brandMark}
          </div>
        )}
        <div>
          <h2
            className="text-lg font-bold tracking-tight"
            style={{
              color: tokens.textIconColor || "#0F172A",
              fontFamily: tokens.headingFontFamily || "inherit",
            }}
          >
            {brandName}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Enterprise Brand Design System &amp; Live Runtime Tokens
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          LEVEL 0: BRAND LOGO VARIANTS (ZERO DOTS)
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="space-y-3">
        <div className="pb-2 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Brand Identity &amp; Logo Variants</h3>
          <p className="text-xs text-slate-500">Full logomark, wordmark, squircle app icon, and favicon indicators</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Wordmark (NO DOT!) */}
          <div
            className="p-5 border flex flex-col items-center justify-center gap-2 text-center bg-white shadow-2xs"
            style={{
              borderColor: tokens.universalBorderColor || "#E2E8F0",
              borderWidth: `${tokens.borderWidth ?? 1}px`,
              borderRadius: `${tokens.cornerRadius}px`,
            }}
          >
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Wordmark</span>
            <div
              className="text-xl font-bold tracking-tight"
              style={{
                fontFamily: tokens.headingFontFamily || "inherit",
                color: tokens.textIconColor || "#0F172A",
              }}
            >
              <span>{brandName}</span>
            </div>
            <span className="text-[11px] text-slate-400">Proportional Font Geometry</span>
          </div>

          {/* Full Logo Lockup */}
          <div
            className="p-5 border flex flex-col items-center justify-center gap-2 text-center bg-white shadow-2xs"
            style={{
              borderColor: tokens.universalBorderColor || "#E2E8F0",
              borderWidth: `${tokens.borderWidth ?? 1}px`,
              borderRadius: `${tokens.cornerRadius}px`,
            }}
          >
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Full Logo Lockup</span>
            <div className="flex items-center gap-2">
              {brandLogoUrl ? (
                <img src={brandLogoUrl} alt="Logo" className="w-6 h-6 rounded-md object-contain" />
              ) : selectedIconMark ? (
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center text-white"
                  style={{ backgroundColor: primColor }}
                >
                  <DynamicIcon
                    name={selectedIconMark as any}
                    library={tokens.iconLibrary}
                    size={14}
                    strokeWidth={tokens.iconStrokeWidth || 1.75}
                    color="#FFFFFF"
                  />
                </div>
              ) : (
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: primColor }}
                >
                  {brandMark}
                </div>
              )}
              <span className="font-bold text-sm text-slate-900" style={{ fontFamily: tokens.headingFontFamily }}>
                {brandName}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Symbol + Monogram + Name</span>
          </div>

          {/* App Icon */}
          <div
            className="p-5 border flex flex-col items-center justify-center gap-2 text-center bg-white shadow-2xs"
            style={{
              borderColor: tokens.universalBorderColor || "#E2E8F0",
              borderWidth: `${tokens.borderWidth ?? 1}px`,
              borderRadius: `${tokens.cornerRadius}px`,
            }}
          >
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">App Icon</span>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-2xl text-white shadow-sm overflow-hidden p-2"
              style={{
                background: `linear-gradient(135deg, ${primColor} 0%, #0F172A 100%)`,
              }}
            >
              {brandLogoUrl ? (
                <img src={brandLogoUrl} alt="App Icon" className="w-full h-full object-contain" />
              ) : selectedIconMark ? (
                <DynamicIcon
                  name={selectedIconMark as any}
                  library={tokens.iconLibrary}
                  size={28}
                  strokeWidth={tokens.iconStrokeWidth || 2}
                  color="#FFFFFF"
                />
              ) : (
                brandMark
              )}
            </div>
            <span className="text-[11px] text-slate-400">iOS &amp; Desktop App Squircle</span>
          </div>

          {/* Favicon Preview */}
          <div
            className="p-5 border flex flex-col items-center justify-center gap-2 text-center bg-white shadow-2xs"
            style={{
              borderColor: tokens.universalBorderColor || "#E2E8F0",
              borderWidth: `${tokens.borderWidth ?? 1}px`,
              borderRadius: `${tokens.cornerRadius}px`,
            }}
          >
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Favicon Preview</span>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-t-lg shadow-2xs">
              <div
                className="w-3.5 h-3.5 rounded-xs flex items-center justify-center text-[9px] font-bold text-white"
                style={{ backgroundColor: primColor }}
              >
                {selectedIconMark ? (
                  <DynamicIcon
                    name={selectedIconMark as any}
                    library={tokens.iconLibrary}
                    size={10}
                    strokeWidth={tokens.iconStrokeWidth || 2}
                    color="#FFFFFF"
                  />
                ) : (
                  brandMark.charAt(0)
                )}
              </div>
              <span className="text-xs font-medium text-slate-700">{brandName} &mdash; App</span>
            </div>
            <span className="text-[11px] text-slate-400">16&times;16 &bull; 32&times;32 Browser Tab</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          LEVEL 1: COLOR PALETTE & SEMANTIC SWATCHES
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="space-y-3">
        <div className="pb-2 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Color Palette &amp; Semantic Swatches</h3>
          <p className="text-xs text-slate-500">Primary brand ramp, secondary chart accent, and semantic status surfaces</p>
        </div>

        <div
          className="p-5 border bg-white space-y-4 shadow-2xs"
          style={{
            borderColor: tokens.universalBorderColor || "#E2E8F0",
            borderWidth: `${tokens.borderWidth ?? 1}px`,
            borderRadius: `${tokens.cornerRadius}px`,
          }}
        >
          {/* Swatches Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="space-y-1">
              <div
                className="h-10 rounded-lg shadow-2xs border border-slate-300"
                style={{ backgroundColor: primColor }}
              />
              <div className="text-[11px] font-semibold text-slate-900">Primary Brand</div>
              <div className="text-[10px] text-slate-400 tabular-nums">{primColor.toUpperCase()}</div>
            </div>

            <div className="space-y-1">
              <div
                className="h-10 rounded-lg shadow-2xs border border-slate-300"
                style={{ backgroundColor: secColor }}
              />
              <div className="text-[11px] font-semibold text-slate-900">Secondary Accent</div>
              <div className="text-[10px] text-slate-400 tabular-nums">{secColor.toUpperCase()}</div>
            </div>

            <div className="space-y-1">
              <div className="h-10 rounded-lg shadow-2xs border border-slate-200" style={{ backgroundColor: "#10B981" }} />
              <div className="text-[11px] font-semibold text-slate-900">Success</div>
              <div className="text-[10px] text-slate-400 tabular-nums">#10B981</div>
            </div>

            <div className="space-y-1">
              <div className="h-10 rounded-lg shadow-2xs border border-slate-200" style={{ backgroundColor: "#F59E0B" }} />
              <div className="text-[11px] font-semibold text-slate-900">Warning</div>
              <div className="text-[10px] text-slate-400 tabular-nums">#F59E0B</div>
            </div>

            <div className="space-y-1">
              <div className="h-10 rounded-lg shadow-2xs border border-slate-200" style={{ backgroundColor: "#F43F5E" }} />
              <div className="text-[11px] font-semibold text-slate-900">Destructive</div>
              <div className="text-[10px] text-slate-400 tabular-nums">#F43F5E</div>
            </div>

            <div className="space-y-1">
              <div className="h-10 rounded-lg shadow-2xs border border-slate-200" style={{ backgroundColor: "#0EA5E9" }} />
              <div className="text-[11px] font-semibold text-slate-900">Info</div>
              <div className="text-[10px] text-slate-400 tabular-nums">#0EA5E9</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          LEVEL 2: TYPOGRAPHY & TYPESCALE
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="space-y-3">
        <div className="pb-2 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Typography &amp; Typescale Hierarchy</h3>
          <p className="text-xs text-slate-500">Dynamic font pairing, line-height leading, and letter-spacing tracking</p>
        </div>

        <div
          className="p-5 border bg-white shadow-2xs overflow-x-auto"
          style={{
            borderColor: tokens.universalBorderColor || "#E2E8F0",
            borderWidth: `${tokens.borderWidth ?? 1}px`,
            borderRadius: `${tokens.cornerRadius}px`,
          }}
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-[11px] font-semibold">
                <th className="pb-2 w-28">Role</th>
                <th className="pb-2 w-32">Size / Weight</th>
                <th className="pb-2">Specimen Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 font-semibold text-slate-900">Display</td>
                <td className="py-3 text-slate-500 tabular-nums">32px &bull; Bold 700</td>
                <td
                  className="py-3 text-2xl font-bold tracking-tight text-slate-900"
                  style={{ fontFamily: tokens.headingFontFamily }}
                >
                  Next-Gen Cloud Ledger
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-900">Heading 1</td>
                <td className="py-3 text-slate-500 tabular-nums">24px &bull; Bold 700</td>
                <td
                  className="py-3 text-xl font-bold text-slate-900"
                  style={{ fontFamily: tokens.headingFontFamily }}
                >
                  Enterprise Telemetry Ops
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-900">Heading 2</td>
                <td className="py-3 text-slate-500 tabular-nums">20px &bull; SemiBold 600</td>
                <td
                  className="py-3 text-lg font-semibold text-slate-900"
                  style={{ fontFamily: tokens.headingFontFamily }}
                >
                  Global Infrastructure Overview
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-900">Body</td>
                <td className="py-3 text-slate-500 tabular-nums">14px &bull; Regular 400</td>
                <td className="py-3 text-sm text-slate-700 leading-relaxed" style={{ fontFamily: tokens.fontFamily }}>
                  ZeroLight provides token-driven design engineering with native mathematical physics and zero runtime overhead.
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-900">Caption</td>
                <td className="py-3 text-slate-500 tabular-nums">12px &bull; Medium 500</td>
                <td className="py-3 text-xs text-slate-400 tabular-nums">
                  Updated 4 minutes ago &bull; SHA-256: 7f3b890a &bull; Latency: 24ms
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          LEVEL 3: ICONOGRAPHY SYSTEM (WITH LIVE TOKEN BINDING)
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="space-y-3">
        <div className="pb-2 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Iconography System</h3>
          <p className="text-xs text-slate-500">Stroke, fill, and dual-tone styles across Lucide and Iconify open-source sets</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            className="p-4 border bg-white flex flex-col items-center justify-center gap-2 text-center shadow-2xs"
            style={{
              borderColor: tokens.universalBorderColor || "#E2E8F0",
              borderWidth: `${tokens.borderWidth ?? 1}px`,
              borderRadius: `${tokens.cornerRadius}px`,
            }}
          >
            <span className="text-[11px] font-semibold text-slate-400">Live Stroke ({tokens.iconStrokeWidth || 1.75}px)</span>
            <div className="flex items-center gap-2 text-slate-700">
              <DynamicIcon name="shield-check" size={20} strokeWidth={tokens.iconStrokeWidth || 1.75} />
              <DynamicIcon name="zap" size={20} strokeWidth={tokens.iconStrokeWidth || 1.75} />
              <DynamicIcon name="activity" size={20} strokeWidth={tokens.iconStrokeWidth || 1.75} />
            </div>
            <span className="text-[11px] text-slate-400">Responsive Vector Stroke</span>
          </div>

          <div
            className="p-4 border bg-white flex flex-col items-center justify-center gap-2 text-center shadow-2xs"
            style={{
              borderColor: tokens.universalBorderColor || "#E2E8F0",
              borderWidth: `${tokens.borderWidth ?? 1}px`,
              borderRadius: `${tokens.cornerRadius}px`,
            }}
          >
            <span className="text-[11px] font-semibold text-slate-400">Bold Glyphs</span>
            <div className="flex items-center gap-2 text-slate-800">
              <DynamicIcon name="server" size={20} strokeWidth={Math.max(2, (tokens.iconStrokeWidth || 1.75) + 0.6)} />
              <DynamicIcon name="database" size={20} strokeWidth={Math.max(2, (tokens.iconStrokeWidth || 1.75) + 0.6)} />
              <DynamicIcon name="key" size={20} strokeWidth={Math.max(2, (tokens.iconStrokeWidth || 1.75) + 0.6)} />
            </div>
            <span className="text-[11px] text-slate-400">Heavy Weight Stroke</span>
          </div>

          <div
            className="p-4 border bg-white flex flex-col items-center justify-center gap-2 text-center shadow-2xs"
            style={{
              borderColor: tokens.universalBorderColor || "#E2E8F0",
              borderWidth: `${tokens.borderWidth ?? 1}px`,
              borderRadius: `${tokens.cornerRadius}px`,
            }}
          >
            <span className="text-[11px] font-semibold text-slate-400">Dual-Tone Tint</span>
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ backgroundColor: `${primColor}18`, color: primColor }}
              >
                <DynamicIcon name="sparkles" size={16} color={primColor} />
              </div>
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ backgroundColor: `${primColor}18`, color: primColor }}
              >
                <DynamicIcon name="cpu" size={16} color={primColor} />
              </div>
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ backgroundColor: `${primColor}18`, color: primColor }}
              >
                <DynamicIcon name="globe" size={16} color={primColor} />
              </div>
            </div>
            <span className="text-[11px] text-slate-400">Backplate + Stroke</span>
          </div>

          <div
            className="p-4 border bg-white flex flex-col items-center justify-center gap-2 text-center shadow-2xs"
            style={{
              borderColor: tokens.universalBorderColor || "#E2E8F0",
              borderWidth: `${tokens.borderWidth ?? 1}px`,
              borderRadius: `${tokens.cornerRadius}px`,
            }}
          >
            <span className="text-[11px] font-semibold text-slate-400">Active Set: {(tokens.iconLibrary || "lucide").toUpperCase()}</span>
            <div className="flex items-center gap-2 justify-center py-0.5">
              <DynamicIcon name="shield-check" size={18} />
              <DynamicIcon name="zap" size={18} />
              <DynamicIcon name="cpu" size={18} />
              <DynamicIcon name="terminal" size={18} />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap justify-center pt-1">
              <Badge variant={(tokens.iconLibrary || "lucide") === "lucide" ? "info" : "neutral"} size="xs">Lucide</Badge>
              <Badge variant={tokens.iconLibrary === "tabler" ? "info" : "neutral"} size="xs">Tabler</Badge>
              <Badge variant={tokens.iconLibrary === "feather" ? "info" : "neutral"} size="xs">Feather</Badge>
              <Badge variant={tokens.iconLibrary === "heroicons" ? "info" : "neutral"} size="xs">Heroicons</Badge>
            </div>
            <span className="text-[11px] text-slate-400">Live Vector Geometry</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          LEVEL 4: ACTIONS & BUTTON SYSTEM
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="space-y-3">
        <div className="pb-2 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Actions &amp; Button System</h3>
          <p className="text-xs text-slate-500">Visual variants, icon anatomies, and interactive states</p>
        </div>

        <div
          className="p-5 border bg-white space-y-4 shadow-2xs"
          style={{
            borderColor: tokens.universalBorderColor || "#E2E8F0",
            borderWidth: `${tokens.borderWidth ?? 1}px`,
            borderRadius: `${tokens.cornerRadius}px`,
          }}
        >
          {/* Variants */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Visual Variants</span>
            <div className="flex flex-wrap gap-2.5 items-center">
              <Button variant="primary" size="sm">Primary</Button>
              <Button variant="secondary" size="sm">Secondary</Button>
              <Button variant="outline" size="sm">Outline</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
              <Button variant="destructive" size="sm">Destructive</Button>
            </div>
          </div>

          {/* Icon Anatomies */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Icon Variations</span>
            <div className="flex flex-wrap gap-2.5 items-center">
              <Button variant="primary" size="sm" iconLeft={<Plus className="w-3.5 h-3.5" />}>
                Icon Left
              </Button>
              <Button variant="outline" size="sm" iconRight={<ArrowRight className="w-3.5 h-3.5" />}>
                Icon Right
              </Button>
              <Button variant="secondary" size="sm" className="w-8 px-0 justify-center">
                <Bookmark className="w-3.5 h-3.5" />
              </Button>
              <Button variant="outline" size="sm" className="w-8 px-0 justify-center">
                <Settings className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* States */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Interactive States</span>
            <div className="flex flex-wrap gap-2.5 items-center">
              <Button variant="primary" size="sm">Rest / Default</Button>
              <Button variant="primary" size="sm" disabled>Disabled State</Button>
              <Button variant="primary" size="sm" loading>Loading State</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          LEVEL 5: FORM CONTROLS USING REAL ZEROLIGHT MOLECULES
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="space-y-3">
        <div className="pb-2 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Form Controls &amp; Input System</h3>
          <p className="text-xs text-slate-500">Real ZeroLight Select molecule, Calendar molecule, Input atom, and DropdownMenu</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {/* Single-Line Input with Icons (Real ZeroLight Input Atom) */}
          <div
            className="p-4 border bg-white space-y-2 shadow-2xs"
            style={{
              borderColor: tokens.universalBorderColor || "#E2E8F0",
              borderWidth: `${tokens.borderWidth ?? 1}px`,
              borderRadius: `${tokens.cornerRadius}px`,
            }}
          >
            <label className="text-xs font-semibold text-slate-900 block">Single-Line Input (ZeroLight Atom)</label>
            <Input
              iconLeft={<Mail className="w-4 h-4 text-slate-400" />}
              iconRight={
                inputValue ? (
                  <button
                    type="button"
                    onClick={() => setInputValue("")}
                    className="p-0.5 rounded text-slate-400 hover:text-slate-800 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : undefined
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="alex@zerolight.dev"
            />
            <span className="text-[11px] text-slate-400">Prefix icon and interactive clear button</span>
          </div>

          {/* REAL ZEROLIGHT SELECT MOLECULE */}
          <div
            className="p-4 border bg-white space-y-2 shadow-2xs"
            style={{
              borderColor: tokens.universalBorderColor || "#E2E8F0",
              borderWidth: `${tokens.borderWidth ?? 1}px`,
              borderRadius: `${tokens.cornerRadius}px`,
            }}
          >
            <label className="text-xs font-semibold text-slate-900 block">Select Molecule (Framer Motion Popover)</label>
            <Select
              value={selectedDropdown}
              onChange={setSelectedDropdown}
              options={[
                { value: "enterprise", label: "Enterprise Workspace" },
                { value: "prod-cluster", label: "Production Cluster 01" },
                { value: "staging", label: "Staging Sandbox" },
                { value: "vault", label: "Security Vault" },
              ]}
            />
            <span className="text-[11px] text-slate-400">Real ZeroLight Select with animated popover</span>
          </div>

          {/* REAL ZEROLIGHT CALENDAR MOLECULE */}
          <div
            className="p-4 border bg-white space-y-2 shadow-2xs"
            style={{
              borderColor: tokens.universalBorderColor || "#E2E8F0",
              borderWidth: `${tokens.borderWidth ?? 1}px`,
              borderRadius: `${tokens.cornerRadius}px`,
            }}
          >
            <label className="text-xs font-semibold text-slate-900 block">Calendar Molecule (Real Month Picker)</label>
            <div className="flex justify-center">
              <Calendar
                selectedDate={selectedCalendarDate}
                onSelectDate={setSelectedCalendarDate}
                className="w-full shadow-2xs"
              />
            </div>
            <span className="text-[11px] text-slate-400">ZeroLight Calendar with month/day navigation</span>
          </div>

          {/* Textarea & Dropdown Menu */}
          <div
            className="p-4 border bg-white space-y-3 shadow-2xs"
            style={{
              borderColor: tokens.universalBorderColor || "#E2E8F0",
              borderWidth: `${tokens.borderWidth ?? 1}px`,
              borderRadius: `${tokens.cornerRadius}px`,
            }}
          >
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-900 block">Multi-Line Text Area (ZeroLight Atom)</label>
              <span className="text-[11px] text-slate-400 tabular-nums">{textareaValue.length} / 200</span>
            </div>
            <Textarea
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
              rows={3}
              maxLength={200}
            />

            {/* REAL ZEROLIGHT DROPDOWN MENU MOLECULE */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-900">Action Menu</label>
              <DropdownMenu
                trigger={
                  <Button variant="outline" size="sm" iconRight={<ChevronDown className="w-3.5 h-3.5" />}>
                    Options
                  </Button>
                }
                items={[
                  { id: "1", label: "Export TSV Ledger" },
                  { id: "2", label: "View Telemetry Logs" },
                  { id: "sep", label: "", separator: true },
                  { id: "3", label: "Rotate Access Keys", destructive: true },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          LEVEL 6: SELECTION CONTROLS
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="space-y-3">
        <div className="pb-2 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Selection Controls</h3>
          <p className="text-xs text-slate-500">Radio button groups, tactile toggle switches, and multi-state checkboxes</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
          {/* Radio Group using REAL ZeroLight Atom */}
          <div
            className="p-4 border bg-white space-y-2 shadow-2xs flex flex-col justify-between"
            style={{
              borderColor: tokens.universalBorderColor || "#E2E8F0",
              borderWidth: `${tokens.borderWidth ?? 1}px`,
              borderRadius: `${tokens.cornerRadius}px`,
            }}
          >
            <label className="text-xs font-semibold text-slate-900 block">Radio Button Group (ZeroLight Primitive)</label>
            <div className="pt-1 flex-1 flex flex-col justify-center">
              <RadioGroup
                name="scaleChoice"
                value={radioChoice}
                onChange={setRadioChoice}
                options={[
                  { value: "auto", label: "Autonomous Scaling" },
                  { value: "manual", label: "Manual Provisioning" },
                ]}
              />
            </div>
          </div>

          {/* Toggle Switches */}
          <div
            className="p-4 border bg-white space-y-2 shadow-2xs flex flex-col justify-between"
            style={{
              borderColor: tokens.universalBorderColor || "#E2E8F0",
              borderWidth: `${tokens.borderWidth ?? 1}px`,
              borderRadius: `${tokens.cornerRadius}px`,
            }}
          >
            <label className="text-xs font-semibold text-slate-900 block">Toggle Switches (Spring Motion)</label>
            <div className="space-y-3 pt-1 flex-1 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-700">Two-Factor Auth</span>
                <Switch checked={switch1} onChange={setSwitch1} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-700">Telemetry Stream</span>
                <Switch checked={switch2} onChange={setSwitch2} />
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div
            className="p-4 border bg-white space-y-2 shadow-2xs flex flex-col justify-between"
            style={{
              borderColor: tokens.universalBorderColor || "#E2E8F0",
              borderWidth: `${tokens.borderWidth ?? 1}px`,
              borderRadius: `${tokens.cornerRadius}px`,
            }}
          >
            <label className="text-xs font-semibold text-slate-900 block">Checkboxes (ZeroLight Primitive)</label>
            <div className="space-y-2.5 pt-1 flex-1 flex flex-col justify-center">
              <Checkbox checked={checkbox1} onChange={setCheckbox1} label="Checked Option" />
              <Checkbox checked={checkbox2} onChange={setCheckbox2} label="Unchecked Option" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          LEVEL 7: CHIPS, TAGS & BADGES
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="space-y-3">
        <div className="pb-2 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Chips, Tags &amp; Status Badges</h3>
          <p className="text-xs text-slate-500">Status indicators, categorical tag pills, and dismissible filter chips</p>
        </div>

        <div
          className="p-5 border bg-white space-y-4 shadow-2xs"
          style={{
            borderColor: tokens.universalBorderColor || "#E2E8F0",
            borderWidth: `${tokens.borderWidth ?? 1}px`,
            borderRadius: `${tokens.cornerRadius}px`,
          }}
        >
          {/* Badges */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Status Badges (ZeroLight Badge)</span>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="healthy" size="sm" showDot>Active</Badge>
              <Badge variant="degraded" size="sm" showDot>Pending</Badge>
              <Badge variant="critical" size="sm" showDot>Failed</Badge>
              <Badge variant="neutral" size="sm" showDot>Archived</Badge>
            </div>
          </div>

          {/* Dismissible Chips using Real TagChip primitive */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Dismissible Filter Chips (ZeroLight TagChip)</span>
            <div className="flex flex-wrap gap-2 items-center">
              {activeFilterChips.map((chip) => (
                <TagChip
                  key={chip.id}
                  label={chip.label}
                  onRemove={() => removeChip(chip.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          LEVEL 8: NAVIGATION & REAL ZEROLIGHT PAGINATION MOLECULE
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="space-y-3">
        <div className="pb-2 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Navigation &amp; Progression</h3>
          <p className="text-xs text-slate-500">Real ZeroLight Breadcrumbs, Tabs with spring indicator, and Pagination molecule</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {/* REAL ZEROLIGHT BREADCRUMBS MOLECULE */}
          <div
            className="p-4 border bg-white space-y-2 shadow-2xs"
            style={{
              borderColor: tokens.universalBorderColor || "#E2E8F0",
              borderWidth: `${tokens.borderWidth ?? 1}px`,
              borderRadius: `${tokens.cornerRadius}px`,
            }}
          >
            <label className="text-xs font-semibold text-slate-900 block">Breadcrumbs Molecule</label>
            <Breadcrumbs
              items={[
                { label: "Organization", href: "#" },
                { label: "Design System", href: "#" },
                { label: "Components" },
              ]}
            />
          </div>

          {/* REAL ZEROLIGHT TABS MOLECULE WITH SPRING INDICATOR */}
          <div
            className="p-4 border bg-white space-y-2 shadow-2xs"
            style={{
              borderColor: tokens.universalBorderColor || "#E2E8F0",
              borderWidth: `${tokens.borderWidth ?? 1}px`,
              borderRadius: `${tokens.cornerRadius}px`,
            }}
          >
            <label className="text-xs font-semibold text-slate-900 block">Tabs Molecule (Framer Motion Spring)</label>
            <Tabs
              items={[
                { id: "overview", label: "Overview" },
                { id: "analytics", label: "Analytics" },
                { id: "settings", label: "Settings" },
              ]}
              variant="pills"
            />
          </div>

          {/* REAL ZEROLIGHT PAGINATION MOLECULE */}
          <div
            className="p-4 border bg-white space-y-2 shadow-2xs md:col-span-2"
            style={{
              borderColor: tokens.universalBorderColor || "#E2E8F0",
              borderWidth: `${tokens.borderWidth ?? 1}px`,
              borderRadius: `${tokens.cornerRadius}px`,
            }}
          >
            <label className="text-xs font-semibold text-slate-900 block">Pagination Molecule (ZeroLight Real Primitive)</label>
            <Pagination
              currentPage={currentPage}
              totalItems={100}
              pageSize={10}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          LEVEL 9: AVATARS & TOOLTIPS
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="space-y-3">
        <div className="pb-2 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Avatars &amp; Tooltips</h3>
          <p className="text-xs text-slate-500">Single user avatars, monogram fallbacks, stacked team groups, and tactile popovers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
          {/* Avatar Variations & Stack */}
          <div
            className="p-4 border bg-white space-y-2 shadow-2xs"
            style={{
              borderColor: tokens.universalBorderColor || "#E2E8F0",
              borderWidth: `${tokens.borderWidth ?? 1}px`,
              borderRadius: `${tokens.cornerRadius}px`,
            }}
          >
            <label className="text-xs font-semibold text-slate-900 block">Avatar Variations &amp; Stack</label>
            <div className="flex items-center gap-4 pt-1">
              <Avatar initials="JR" size="md" status="online" />
              <div className="flex items-center -space-x-2">
                <Avatar initials="AK" size="md" />
                <Avatar initials="SL" size="md" />
                <Avatar initials="DM" size="md" />
                <Avatar initials="+4" size="md" />
              </div>
            </div>
          </div>

          {/* Tooltip Demo */}
          <div
            className="p-4 border bg-white space-y-2 shadow-2xs flex flex-col justify-center items-center text-center"
            style={{
              borderColor: tokens.universalBorderColor || "#E2E8F0",
              borderWidth: `${tokens.borderWidth ?? 1}px`,
              borderRadius: `${tokens.cornerRadius}px`,
            }}
          >
            <label className="text-xs font-semibold text-slate-900 block mb-1">Tactile Hover Tooltip</label>
            <Tooltip content="Verified with YIQ Math & Tokens">
              <Button variant="outline" size="sm" iconLeft={<Info className="w-3.5 h-3.5" />}>
                Hover Target
              </Button>
            </Tooltip>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          LEVEL 10: REAL ZEROLIGHT DATA VISUALIZATION MOLECULES
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="space-y-3">
        <div className="pb-2 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Data Visualization</h3>
          <p className="text-xs text-slate-500">Real ZeroLight AreaChart, BarChart, and DonutChart molecules with live dual-accent tokens</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {/* REAL ZEROLIGHT AREA CHART MOLECULE */}
          <AreaChart
            title="Telemetry Trend"
            subtitle="Daily active edge connections"
            primaryLabel="Live Requests"
            secondaryLabel="Baseline Target"
            height={190}
            primaryColor={primColor}
            secondaryColor={secColor}
            data={[
              { label: "Oct 01", value: 55, secondaryValue: 35 },
              { label: "Oct 15", value: 68, secondaryValue: 45 },
              { label: "Nov 01", value: 42, secondaryValue: 50 },
              { label: "Nov 20", value: 94, secondaryValue: 60 },
            ]}
          />

          {/* REAL ZEROLIGHT BAR CHART MOLECULE */}
          <BarChart
            title="Run-Rate Comparison"
            subtitle="Quarterly throughput vs baseline"
            primaryLabel="Throughput"
            secondaryLabel="Target"
            height={190}
            primaryColor={primColor}
            secondaryColor={secColor}
            data={[
              { label: "Q1", value: 65, secondaryValue: 40 },
              { label: "Q2", value: 80, secondaryValue: 55 },
              { label: "Q3", value: 92, secondaryValue: 70 },
              { label: "Q4", value: 100, secondaryValue: 85 },
            ]}
          />

          {/* REAL ZEROLIGHT DONUT CHART MOLECULE */}
          <DonutChart
            title="Traffic Breakdown"
            subtitle="Edge distribution by protocol"
            size={140}
            strokeWidth={18}
            centerLabel="Total Edge"
            data={[
              { id: "1", label: "Direct", value: 58, color: primColor },
              { id: "2", label: "API Mesh", value: 28, color: secColor },
              { id: "3", label: "Other", value: 14, color: "#94A3B8" },
            ]}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          LEVEL 11: REAL ZEROLIGHT CHAT BUBBLE MOLECULES
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="space-y-3">
        <div className="pb-2 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Messaging &amp; Chat Workspace</h3>
          <p className="text-xs text-slate-500">Real ZeroLight ChatBubble molecules with sender, receipts, and avatars</p>
        </div>

        <div
          className="p-5 border bg-white space-y-3 shadow-2xs"
          style={{
            borderColor: tokens.universalBorderColor || "#E2E8F0",
            borderWidth: `${tokens.borderWidth ?? 1}px`,
            borderRadius: `${tokens.cornerRadius}px`,
          }}
        >
          {/* Assistant Bubble */}
          <ChatBubble
            sender="bot"
            senderName="ZeroLight Assistant"
            avatarInitials="AI"
            timestamp="10:42 AM"
            status="read"
            message="ZeroLight Design System tokens have been loaded. All math physics, colors, and typestyles are synced with the live runtime inspector."
          />

          {/* User Bubble */}
          <ChatBubble
            sender="user"
            avatarInitials="JR"
            timestamp="10:43 AM"
            status="read"
            message="Verify that primary and secondary accents respond across charts, buttons, and app icons."
          />
        </div>
      </section>
    </div>
  );
}
