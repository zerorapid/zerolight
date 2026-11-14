"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  Command,
  Sun,
  Moon,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Code2,
  Terminal,
  Layers,
  Sparkles,
  AlertTriangle,
  Info,
  Sliders,
  Eye,
  CheckCircle2,
  X,
  FileCode,
  Layout,
  Maximize2,
  Smile,
  Meh,
  Frown,
  Download,
  Palette,
  Shield,
  Activity,
  Compass,
} from "lucide-react";
import { useZeroLight } from "../context";
import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";
import { Input } from "../atoms/input";
import { Checkbox } from "../atoms/checkbox";
import { Switch } from "../atoms/switch";
import { Slider } from "../atoms/slider";
import { ProgressBar } from "../atoms/progress-bar";
import { Kbd } from "../atoms/kbd";
import { Avatar } from "../atoms/avatar";
import { Skeleton } from "../atoms/skeleton";
import { TagChip } from "../atoms/tag-chip";
import { StatCard } from "../molecules/stat-card";
import { AlertBanner } from "../molecules/alert-banner";
import { Tooltip } from "../molecules/tooltip";
import { WorldAtlasMap } from "../../WorldAtlasMap";
import { DataTable } from "../organisms/data-table";
import { TenantKit } from "../organisms/tenant-kit";

export interface DocItem {
  id: string;
  title: string;
  category: "foundations" | "components" | "brand";
  description: string;
  tier?: "atom" | "molecule" | "organism" | "foundation" | "brand";
  badge?: string;
}

export const ZEROLIGHT_DOCS_NAV: DocItem[] = [
  // FOUNDATIONS
  { id: "philosophy", title: "Tactile Calm & Principles", category: "foundations", tier: "foundation", description: "Design principles prioritizing quiet surfaces, 1px hairline borders, and zero AI decorative noise." },
  { id: "colors", title: "Color Tokens & Palette", category: "foundations", tier: "foundation", description: "Universal grayscale luminance tokens, dual-accent charting hexes, and accessible contrast math." },
  { id: "typography", title: "Typography Scale & Numbers", category: "foundations", tier: "foundation", description: "Type hierarchy, letter spacing, optical sizing, and mandatory tabular-nums discipline." },
  { id: "materials", title: "Materials & Elevation", category: "foundations", tier: "foundation", description: "Frosted glassmorphism, 1px hairline borders, and flat/soft/elevated shadow tokens." },
  { id: "motion", title: "Motion Physics Engine", category: "foundations", tier: "foundation", description: "Spring physics presets (damped, snappy, elastic, gentle, instant) and GPU acceleration." },
  { id: "terminal", title: "Terminal CLI & MCP", category: "foundations", tier: "foundation", description: "Registry CLI distribution (`npx zerolight add`), JSON schema manifests, and AI agent bindings." },

  // UI COMPONENTS - ATOMS
  { id: "button", title: "Button", category: "components", tier: "atom", description: "Primary, secondary, outline, ghost, and destructive interactive triggers with spring feedback." },
  { id: "input", title: "Input", category: "components", tier: "atom", description: "Text, search, and credential input field with left/right icon slots and focus glow." },
  { id: "badge", title: "Badge", category: "components", tier: "atom", description: "Categorical status tags, numeric counters, and semantic pill indicators." },
  { id: "checkbox", title: "Checkbox", category: "components", tier: "atom", description: "Tri-state indeterminate checkbox with accessible keyboard controls." },
  { id: "switch", title: "Switch", category: "components", tier: "atom", description: "Tactile boolean toggle switch with spring physics." },
  { id: "slider", title: "Slider", category: "components", tier: "atom", description: "Continuous and stepped value range slider." },
  { id: "progress-bar", title: "Progress Bar", category: "components", tier: "atom", description: "Visual completion progress bar with optional indeterminate pulse." },
  { id: "avatar", title: "Avatar", category: "components", tier: "atom", description: "User avatar with image fallback, presence indicator, and initials." },
  { id: "skeleton", title: "Skeleton", category: "components", tier: "atom", description: "Shimmering placeholder pulse during asynchronous data fetches." },
  { id: "kbd", title: "Keyboard Shortcut (Kbd)", category: "components", tier: "atom", description: "Monospace-free keyboard shortcut capsule for command accelerators." },

  // UI COMPONENTS - MOLECULES & ORGANISMS
  { id: "stat-card", title: "Stat Card", category: "components", tier: "molecule", description: "KPI metric container with trend delta, comparison text, and horizontal layout." },
  { id: "alert-banner", title: "Alert Banner", category: "components", tier: "molecule", description: "System notification banner for healthy, warning, error, and neutral operational states." },
  { id: "tooltip", title: "Tooltip", category: "components", tier: "molecule", description: "Portaled micro-copy popup attached to trigger element." },
  { id: "world-atlas-map", title: "World Atlas Map", category: "components", tier: "organism", description: "Apple/Airbnb 2D flat monochrome vector atlas with 6 pattern styles and zero antimeridian artifacts." },
  { id: "data-table", title: "Enterprise Data Grid", category: "components", tier: "organism", description: "Enterprise data grid with Excel TSV/CSV clipboard paste, sticky column pinning, and instant export." },
  { id: "tenant-kit", title: "Micro-Tenant Kit", category: "components", tier: "organism", description: "Multi-tenant workspace switcher, isolation badges, quota progress, and sovereign tenancy matrix." },
  { id: "toast", title: "Toast Notification", category: "components", tier: "organism", description: "A succinct message that is displayed temporarily with stackable physics." },

  // BRAND ASSETS
  { id: "brand-identity", title: "ZeroLight Identity", category: "brand", tier: "brand", description: "Primary geometric delta mark, wordmark, clear space guidelines, and SVG downloads." },
  { id: "brand-variations", title: "Logo Variations & Themes", category: "brand", tier: "brand", description: "Multi-tenant light, dark, and favicon variations managed directly in Visual Studio." },
];

export function ZeroLightDocsPortal() {
  const { tokens, scaled } = useZeroLight();
  const [activeId, setActiveId] = useState<string>("button");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackSent, setFeedbackSent] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const activeItem = useMemo(() => {
    return ZEROLIGHT_DOCS_NAV.find((item) => item.id === activeId) || ZEROLIGHT_DOCS_NAV[0];
  }, [activeId]);

  const currentIndex = useMemo(() => {
    return ZEROLIGHT_DOCS_NAV.findIndex((item) => item.id === activeId);
  }, [activeId]);

  const prevItem = currentIndex > 0 ? ZEROLIGHT_DOCS_NAV[currentIndex - 1] : null;
  const nextItem = currentIndex < ZEROLIGHT_DOCS_NAV.length - 1 ? ZEROLIGHT_DOCS_NAV[currentIndex + 1] : null;

  const filteredNav = useMemo(() => {
    if (!searchQuery.trim()) return ZEROLIGHT_DOCS_NAV;
    const q = searchQuery.toLowerCase();
    return ZEROLIGHT_DOCS_NAV.filter(
      (item) => item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchModalOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else if (e.key === "Escape") {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    triggerToast("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (sentiment: string) => {
    setFeedbackSent(sentiment);
    triggerToast(`Feedback recorded: ${sentiment}`);
    setTimeout(() => setFeedbackSent(null), 4000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-zinc-900 antialiased">
      {/* ── TOP HEADER (ZeroLight Delta Mark + Search Cmd+K) ── */}
      <header className="sticky top-0 z-40 h-14 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => setActiveId("philosophy")}
          >
            <div className="w-6 h-6 rounded-md bg-zinc-950 flex items-center justify-center text-white shadow-xs">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 22 20 2 20 12 2" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight text-zinc-950">
              ZeroLight Design System
            </span>
            <Badge variant="neutral" className="text-[10px] py-0 px-1.5 ml-1">
              v2.0 Documentation
            </Badge>
          </div>
        </div>

        {/* Center Search Capsule (Cmd+K) */}
        <div
          onClick={() => {
            setIsSearchModalOpen(true);
            setTimeout(() => searchInputRef.current?.focus(), 50);
          }}
          className="flex items-center gap-3 w-64 md:w-80 px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 text-xs text-zinc-500 cursor-pointer hover:border-zinc-300 transition"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span className="flex-1 text-zinc-400">Search foundations & components...</span>
          <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-200/80 text-[10px] font-semibold text-zinc-600 font-sans tabular-nums">
            ⌘K
          </kbd>
        </div>

        {/* Right Info Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="healthy" className="text-[11px]">
            118 Primitives Active
          </Badge>
        </div>
      </header>

      {/* ── BODY LAYOUT (Sticky Sidebar + Center Content) ── */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="w-64 shrink-0 border-r border-zinc-200/80 p-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto space-y-6 text-xs">
          {/* Quick Filter Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Filter documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 rounded-md border border-zinc-200 bg-zinc-50 text-xs outline-none focus:border-zinc-950 transition"
            />
          </div>

          {/* Section 1: Foundations */}
          <div className="space-y-1">
            <h5 className="px-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Visual Foundations
            </h5>
            <div className="space-y-0.5 pt-1">
              {filteredNav
                .filter((item) => item.category === "foundations")
                .map((item) => {
                  const active = activeId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveId(item.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center justify-between ${
                        active
                          ? "bg-zinc-100 text-zinc-950 font-semibold"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                      }`}
                    >
                      <span>{item.title}</span>
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Section 2: UI Components */}
          <div className="space-y-1">
            <h5 className="px-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              UI Components
            </h5>
            <div className="space-y-0.5 pt-1">
              {filteredNav
                .filter((item) => item.category === "components")
                .map((item) => {
                  const active = activeId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveId(item.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center justify-between ${
                        active
                          ? "bg-zinc-100 text-zinc-950 font-semibold"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      {item.tier && (
                        <span className="text-[10px] px-1 rounded bg-zinc-100 text-zinc-500 font-sans capitalize">
                          {item.tier}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Section 3: Brand Assets */}
          <div className="space-y-1">
            <h5 className="px-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Brand Assets
            </h5>
            <div className="space-y-0.5 pt-1">
              {filteredNav
                .filter((item) => item.category === "brand")
                .map((item) => {
                  const active = activeId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveId(item.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center justify-between ${
                        active
                          ? "bg-zinc-100 text-zinc-950 font-semibold"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />}
                    </button>
                  );
                })}
            </div>
          </div>
        </aside>

        {/* ── CENTER WORKSPACE CONTENT AREA ── */}
        <main className="flex-1 max-w-4xl px-8 py-10 space-y-10 min-w-0">
          {/* Header Title & Description */}
          <div className="space-y-2 pb-6 border-b border-zinc-200/80">
            <div className="flex items-center gap-2 text-xs text-zinc-400 capitalize">
              <span>{activeItem.category}</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-zinc-900 font-medium">{activeItem.title}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">
              {activeItem.title}
            </h1>
            <p className="text-sm text-zinc-600 max-w-2xl leading-relaxed">
              {activeItem.description}
            </p>
          </div>

          {/* =========================================================================
              DYNAMIC CONTENT RENDERER
             ========================================================================= */}

          {/* FOUNDATION: PHILOSOPHY */}
          {activeId === "philosophy" && (
            <div className="space-y-6 text-xs text-zinc-600 leading-relaxed">
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                <h3 className="text-sm font-bold text-zinc-950">Tactile Calm Over Decorative Noise</h3>
                <p>
                  ZeroLight is built for enterprise engineers who value optical clarity, predictable layouts, and immediate accessibility. Every surface relies on 1px hairline borders, subtle luminance stepping, and generous breathing room rather than AI-generated multi-stop gradients or glowing drop shadows.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-zinc-200 space-y-1.5">
                  <span className="font-bold text-zinc-950 block">1. One Primary CTA</span>
                  <p className="text-[11px] text-zinc-500">
                    Exactly one primary action button per viewport. Secondary actions use outline or ghost styling to eliminate decision friction.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-zinc-200 space-y-1.5">
                  <span className="font-bold text-zinc-950 block">2. Tabular Numbers</span>
                  <p className="text-[11px] text-zinc-500">
                    KPIs, currency figures, timestamps, and charts use font-sans with tabular-nums alignment to ensure rock-solid numerical readability.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-zinc-200 space-y-1.5">
                  <span className="font-bold text-zinc-950 block">3. 3-Zone Architecture</span>
                  <p className="text-[11px] text-zinc-500">
                    Zone 1: Compact header + KPIs. Zone 2: Unified filter bar + primary table/canvas. Zone 3: Drawer for details.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* FOUNDATION: COLORS */}
          {activeId === "colors" && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-zinc-950">Universal Luminance Tokens</h3>
              <p className="text-xs text-zinc-500">
                Click any swatch to copy its hex value directly to your clipboard.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "White Canvas", hex: "#FFFFFF", note: "Primary background" },
                  { label: "Zinc 50", hex: "#FAFAFA", note: "Card underlay tint" },
                  { label: "Zinc 100", hex: "#F4F4F5", note: "Hover backplate" },
                  { label: "Zinc 200", hex: "#E4E4E7", note: "Hairline border" },
                  { label: "Zinc 400", hex: "#A1A1AA", note: "Secondary icons" },
                  { label: "Zinc 600", hex: "#52525B", note: "Body text muted" },
                  { label: "Zinc 900", hex: "#18181B", note: "Headings high contrast" },
                  { label: "Black", hex: "#09090B", note: "Primary button" },
                ].map((color) => (
                  <div
                    key={color.hex}
                    onClick={() => copyToClipboard(color.hex, color.hex)}
                    className="p-3 rounded-xl border border-zinc-200 hover:border-zinc-400 cursor-pointer transition space-y-2 group bg-white"
                  >
                    <div
                      style={{ backgroundColor: color.hex }}
                      className="h-12 w-full rounded-lg border border-black/10"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-900">{color.label}</span>
                      <span className="text-[10px] font-sans tabular-nums text-zinc-400 group-hover:text-zinc-950">
                        {color.hex}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 block">{color.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COMPONENT: BUTTON */}
          {activeId === "button" && (
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-zinc-950">Button Variants</h3>
                <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white">
                  <div className="p-8 flex flex-wrap items-center justify-center gap-3 min-h-[140px] bg-zinc-50/50">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                  <CollapsibleCode
                    code={`import { Button } from "@/components/zerolight";

// ZeroLight Button Primitives
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete Item</Button>`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* COMPONENT: INPUT */}
          {activeId === "input" && (
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-zinc-950">Input Fields</h3>
                <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white">
                  <div className="p-8 max-w-sm mx-auto space-y-4 bg-zinc-50/50">
                    <Input placeholder="Standard text input..." />
                    <Input iconLeft={<Search className="w-4 h-4 text-zinc-400" />} placeholder="Search records..." />
                  </div>
                  <CollapsibleCode
                    code={`import { Input } from "@/components/zerolight";

<Input placeholder="Standard text input..." />
<Input iconLeft={<Search className="w-4 h-4" />} placeholder="Search records..." />`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* COMPONENT: WORLD ATLAS MAP */}
          {activeId === "world-atlas-map" && (
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-zinc-950">
                  Monochrome World Atlas (Apple / Airbnb Studio)
                </h3>
                <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white p-4">
                  <WorldAtlasMap className="h-[460px]" />
                  <CollapsibleCode
                    code={`import { WorldAtlasMap } from "@/components/zerolight";

// 6 hardware-accelerated render styles: vector, dots, pixels, crosses, diamonds, hatch
<WorldAtlasMap
  defaultStyle="vector"
  defaultDensity="standard"
  defaultScale={0.75}
  showTelemetryMarkers={true}
/>`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* COMPONENT: TOAST */}
          {activeId === "toast" && (
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-zinc-950">Default Toast</h3>
                <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white">
                  <div className="p-8 flex items-center justify-center min-h-[140px] bg-zinc-50/50">
                    <Button
                      variant="primary"
                      onClick={() => triggerToast("Your changes have been saved successfully.")}
                    >
                      Show Toast
                    </Button>
                  </div>
                  <CollapsibleCode
                    code={`import { useToast } from "@/components/zerolight";

const { toast } = useToast();
toast("Your changes have been saved successfully.");`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* COMPONENT: ENTERPRISE DATA GRID */}
          {activeId === "data-table" && (
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-zinc-950">Enterprise Data Grid with TSV/CSV Paste & Export</h3>
                <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white p-4">
                  <DataTable editable={true} enableClipboardPaste={true} enableExport={true} />
                  <div className="mt-4">
                    <CollapsibleCode
                      code={`import { DataTable } from "@/components/zerolight";

// Enterprise Data Grid with Excel Clipboard TSV Paste & CSV/JSON Export
<DataTable
  editable={true}
  enableClipboardPaste={true}
  enableExport={true}
  pinSelectionColumn={true}
  pinActionsColumn={true}
/>`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COMPONENT: MICRO-TENANT KIT */}
          {activeId === "tenant-kit" && (
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-zinc-950">Micro-Tenant Kit with Sovereign Isolation</h3>
                <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white p-4">
                  <TenantKit />
                  <div className="mt-4">
                    <CollapsibleCode
                      code={`import { TenantKit } from "@/components/zerolight";

// Micro-Tenant Workspace Switcher & Sovereign Isolation Controller
<TenantKit
  onSelectTenant={(id) => console.log("Switched tenant:", id)}
  onInviteMember={(id) => console.log("Invite seat:", id)}
  onUpgradeTier={(id) => console.log("Scale tenant:", id)}
/>`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BRAND: IDENTITY */}
          {activeId === "brand-identity" && (
            <div className="space-y-8">
              <div className="rounded-2xl border border-zinc-200 p-8 flex flex-col items-center justify-center bg-zinc-50/50 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-950 flex items-center justify-center text-white shadow-lg">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 22 20 2 20 12 2" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-zinc-950">ZeroLight Geometric Delta</h3>
                  <p className="text-xs text-zinc-500">Pure monochrome 24×24 vector mark representing velocity and structural balance.</p>
                </div>
              </div>
            </div>
          )}

          {/* DEFAULT FALLBACK COMPONENT SHOWCASE */}
          {activeId !== "philosophy" &&
            activeId !== "colors" &&
            activeId !== "button" &&
            activeId !== "input" &&
            activeId !== "world-atlas-map" &&
            activeId !== "data-table" &&
            activeId !== "tenant-kit" &&
            activeId !== "toast" &&
            activeId !== "brand-identity" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white">
                  <div className="p-8 flex items-center justify-center min-h-[160px] bg-zinc-50/50">
                    <div className="text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-700">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-zinc-950">
                        {activeItem.title} Preview
                      </h4>
                      <p className="text-xs text-zinc-500 max-w-sm">
                        {activeItem.description}
                      </p>
                    </div>
                  </div>
                  <CollapsibleCode
                    code={`import { ${activeItem.title.replace(/[\s\(\)]+/g, "")} } from "@/components/zerolight";

export default function Example() {
  return (
    <${activeItem.title.replace(/[\s\(\)]+/g, "")} />
  );
}`}
                  />
                </div>
              </div>
            )}

          {/* =========================================================================
              BOTTOM PAGINATION (Previous < / Give feedback / Next >)
             ========================================================================= */}
          <div className="pt-10 border-t border-zinc-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              {prevItem ? (
                <button
                  type="button"
                  onClick={() => setActiveId(prevItem.id)}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 transition cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                  <span className="font-semibold text-zinc-900 ml-1">
                    {prevItem.title}
                  </span>
                </button>
              ) : (
                <div />
              )}
            </div>

            {/* Give feedback capsule pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 text-xs shadow-xs">
              <span className="text-zinc-500 text-[11px] font-medium">Give feedback</span>
              <div className="flex items-center gap-1 text-zinc-400">
                <button
                  onClick={() => handleFeedback("positive")}
                  className="p-1 hover:text-emerald-600 transition cursor-pointer"
                  title="Helpful"
                >
                  <Smile className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleFeedback("neutral")}
                  className="p-1 hover:text-amber-500 transition cursor-pointer"
                  title="Neutral"
                >
                  <Meh className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleFeedback("negative")}
                  className="p-1 hover:text-rose-500 transition cursor-pointer"
                  title="Needs Improvement"
                >
                  <Frown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              {nextItem ? (
                <button
                  type="button"
                  onClick={() => setActiveId(nextItem.id)}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 transition cursor-pointer"
                >
                  <span>Next</span>
                  <span className="font-semibold text-zinc-900 mr-1">
                    {nextItem.title}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ── SEARCH MODAL DIALOG (⌘K) ── */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-3 shadow-2xl space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search ZeroLight components and foundations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm outline-none focus:border-zinc-950 transition"
              />
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-1">
              {filteredNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveId(item.id);
                    setIsSearchModalOpen(false);
                    setSearchQuery("");
                  }}
                  className="w-full p-2.5 rounded-lg text-left hover:bg-zinc-100 transition flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-semibold text-zinc-900">
                      {item.title}
                    </span>
                    <p className="text-[11px] text-zinc-500 truncate max-w-md">{item.description}</p>
                  </div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-sans">
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FLOATING TOAST NOTIFICATION ── */}
      {toastVisible && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-medium shadow-2xl animate-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

// Collapsible Code Accordion with zero font-mono
function CollapsibleCode({ code }: { code: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div className="border-t border-zinc-200 text-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-zinc-500 hover:text-zinc-950 transition bg-zinc-50/40 cursor-pointer"
      >
        <div className="flex items-center gap-2 font-medium">
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-90" : ""}`} />
          <span>Show code</span>
        </div>
        <FileCode className="w-3.5 h-3.5 text-zinc-400" />
      </button>

      {isOpen && (
        <div className="relative p-4 bg-zinc-950 font-sans text-[11px] text-zinc-200 border-t border-zinc-200 overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="absolute top-3 right-3 p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition cursor-pointer flex items-center gap-1"
            title="Copy Code"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
          <pre className="pr-10 leading-relaxed font-sans">{code}</pre>
        </div>
      )}
    </div>
  );
}

export default ZeroLightDocsPortal;
