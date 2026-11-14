"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
  const [demoCheckbox, setDemoCheckbox] = useState<boolean>(true);
  const [demoSwitch, setDemoSwitch] = useState<boolean>(true);
  const [demoSlider, setDemoSlider] = useState<number>(68);
  const [demoMotionPreset, setDemoMotionPreset] = useState<string>("snappy");
  const [motionTrigger, setMotionTrigger] = useState<number>(0);
  const [activeLogoTheme, setActiveLogoTheme] = useState<"light" | "dark" | "outline" | "favicon">("light");
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
            119 Primitives Active
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

          {/* FOUNDATION: TYPOGRAPHY */}
          {activeId === "typography" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white p-6 space-y-6">
                <div className="space-y-1 border-b border-zinc-100 pb-4">
                  <h4 className="text-sm font-bold text-zinc-950">Typography Hierarchy & Tabular Discipline</h4>
                  <p className="text-xs text-zinc-500">ZeroLight strictly mandates font-sans tabular-nums for all numbers, metrics, currency, and charts.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-100 pb-3">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider w-24">Display (36px)</span>
                    <span className="text-3xl font-bold tracking-tight text-zinc-950 flex-1">Tactile Calm Engineering</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-100 pb-3">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider w-24">H1 (28px)</span>
                    <span className="text-2xl font-bold tracking-tight text-zinc-950 flex-1">High Velocity UI Primitives</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-100 pb-3">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider w-24">H2 (22px)</span>
                    <span className="text-xl font-semibold tracking-tight text-zinc-900 flex-1">Micro-Tenant Security Vault</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-100 pb-3">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider w-24">H3 (18px)</span>
                    <span className="text-base font-semibold text-zinc-900 flex-1">Sovereign Node Telemetry</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-100 pb-3">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider w-24">Body (14px)</span>
                    <span className="text-sm text-zinc-600 flex-1 leading-relaxed">
                      Zero-dependency, accessible React primitives bound to unified mathematical tokens with 1px hairline borders.
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-1">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider w-24">Tabular Numbers</span>
                    <div className="flex flex-wrap items-center gap-4 flex-1 font-sans tabular-nums text-sm font-semibold text-zinc-900">
                      <span>$1,420,891.00</span>
                      <span className="text-zinc-300">•</span>
                      <span>18.42ms (P99)</span>
                      <span className="text-zinc-300">•</span>
                      <span>+14.8% YoY</span>
                    </div>
                  </div>
                </div>
              </div>
              <CollapsibleCode
                code={`// ZeroLight Rule 1: Tabular-nums with font-sans (never font-mono)
<span className="font-sans tabular-nums text-sm font-semibold">
  $1,420,891.00 USD
</span>`}
              />
            </div>
          )}

          {/* FOUNDATION: MATERIALS & ELEVATION */}
          {activeId === "materials" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl border border-zinc-200/90 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-950">Flat Surface</span>
                    <Badge variant="neutral">0px Shadow</Badge>
                  </div>
                  <p className="text-xs text-zinc-500">1px hairline border (#E4E4E7) with zero drop shadow for calm density.</p>
                </div>

                <div className="p-5 rounded-2xl border border-zinc-200/90 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-950">Soft Elevation</span>
                    <Badge variant="neutral">Soft Shadow</Badge>
                  </div>
                  <p className="text-xs text-zinc-500">1px hairline border with gentle 4px ambient shadow for card layers.</p>
                </div>

                <div className="p-5 rounded-2xl border border-zinc-200/90 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.08)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-950">Elevated Modal</span>
                    <Badge variant="healthy">16px Float</Badge>
                  </div>
                  <p className="text-xs text-zinc-500">Floating elevation with deep ambient blur for modals and drawers.</p>
                </div>
              </div>
              <CollapsibleCode
                code={`import { useZeroLight } from "@/components/zerolight";

const { tokens, scaled } = useZeroLight();
// styled with scaled.cardShadow and tokens.universalBorderColor`}
              />
            </div>
          )}

          {/* FOUNDATION: MOTION PHYSICS */}
          {activeId === "motion" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950">Spring Physics Playground</h4>
                    <p className="text-xs text-zinc-500">Test calibrated spring tension and damping profiles.</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl">
                    {["snappy", "gentle", "bouncy", "stiff"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setDemoMotionPreset(preset);
                          setMotionTrigger((prev) => prev + 1);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                          demoMotionPreset === preset ? "bg-white text-zinc-950 shadow-xs" : "text-zinc-500 hover:text-zinc-950"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-44 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center relative overflow-hidden">
                  <motion.div
                    key={motionTrigger}
                    initial={{ scale: 0.8, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={
                      demoMotionPreset === "snappy"
                        ? { type: "spring", stiffness: 400, damping: 28 }
                        : demoMotionPreset === "gentle"
                        ? { type: "spring", stiffness: 180, damping: 22 }
                        : demoMotionPreset === "bouncy"
                        ? { type: "spring", stiffness: 320, damping: 14 }
                        : { type: "spring", stiffness: 500, damping: 40 }
                    }
                    className="p-5 rounded-2xl bg-zinc-950 text-white shadow-xl flex items-center gap-3 cursor-pointer"
                    onClick={() => setMotionTrigger((prev) => prev + 1)}
                  >
                    <Activity className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold block">Spring Physics Active</span>
                      <span className="text-[10px] text-zinc-400 capitalize">Preset: {demoMotionPreset} (Click to re-trigger)</span>
                    </div>
                  </motion.div>
                </div>
              </div>
              <CollapsibleCode
                code={`import { motion } from "framer-motion";
import { useZeroLight } from "@/components/zerolight";

const { scaled } = useZeroLight();
<motion.div transition={scaled.motionConfig.spring} />`}
              />
            </div>
          )}

          {/* FOUNDATION: TERMINAL & MCP */}
          {activeId === "terminal" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 text-white overflow-hidden shadow-2xl">
                <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 text-xs font-semibold text-zinc-400">zerolight-cli — zsh</span>
                  </div>
                  <Badge variant="healthy">MCP Server Online</Badge>
                </div>

                <div className="p-5 space-y-4 text-xs font-sans">
                  <div>
                    <span className="text-emerald-400 font-bold">$ </span>
                    <span className="text-zinc-200">npx zerolight add world-atlas-map</span>
                    <div className="text-zinc-400 pl-4 mt-1">
                      &gt; Resolved 119 registry components<br />
                      &gt; Injected src/components/WorldAtlasMap.tsx with D3 Natural Earth projection<br />
                      &gt; Synced zero-dependency token bindings
                    </div>
                  </div>

                  <div>
                    <span className="text-emerald-400 font-bold">$ </span>
                    <span className="text-zinc-200">node bin/zerolight-mcp.mjs</span>
                    <div className="text-zinc-400 pl-4 mt-1">
                      [ZeroLight MCP] Initialized JSON-RPC 2.0 stdio server on port 3002<br />
                      [ZeroLight MCP] Exposing tools: zerolight_list_components, zerolight_get_tokens
                    </div>
                  </div>
                </div>
              </div>
              <CollapsibleCode
                code={`// Start ZeroLight MCP Server for Cursor & Claude Code
node bin/zerolight-mcp.mjs`}
              />
            </div>
          )}

          {/* ATOM: BADGE */}
          {activeId === "badge" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white p-6 space-y-4">
                <h4 className="text-sm font-bold text-zinc-950">Semantic Status Badges</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="healthy">Healthy (200 OK)</Badge>
                  <Badge variant="info">Info / Syncing</Badge>
                  <Badge variant="degraded">Degraded (High P99)</Badge>
                  <Badge variant="critical">Critical Outage</Badge>
                  <Badge variant="neutral">Neutral v2.4</Badge>
                </div>
              </div>
              <CollapsibleCode
                code={`import { Badge } from "@/components/zerolight";

<Badge variant="healthy">Healthy</Badge>
<Badge variant="degraded">Degraded</Badge>
<Badge variant="critical">Critical</Badge>`}
              />
            </div>
          )}

          {/* ATOM: CHECKBOX */}
          {activeId === "checkbox" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white p-6 space-y-4">
                <h4 className="text-sm font-bold text-zinc-950">Interactive Tri-State Checkbox</h4>
                <div className="space-y-3">
                  <Checkbox
                    checked={demoCheckbox}
                    onChange={(checked) => setDemoCheckbox(checked)}
                    label="Enforce FIDO2 Hardware Key for Root Admin"
                  />
                  <Checkbox
                    checked={false}
                    disabled
                    label="Disabled Checkbox Option"
                  />
                </div>
              </div>
              <CollapsibleCode
                code={`import { Checkbox } from "@/components/zerolight";

<Checkbox
  checked={demoCheckbox}
  onChange={(checked) => setDemoCheckbox(checked)}
  label="Enforce Hardware Key"
/>`}
              />
            </div>
          )}

          {/* ATOM: SWITCH */}
          {activeId === "switch" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white p-6 space-y-4">
                <h4 className="text-sm font-bold text-zinc-950">Tactile Spring Switch</h4>
                <div className="space-y-3">
                  <Switch
                    checked={demoSwitch}
                    onChange={(checked) => setDemoSwitch(checked)}
                    label="Real-time Webhook Edge Dispatcher"
                  />
                </div>
              </div>
              <CollapsibleCode
                code={`import { Switch } from "@/components/zerolight";

<Switch
  checked={demoSwitch}
  onChange={(checked) => setDemoSwitch(checked)}
  label="Edge Dispatcher"
/>`}
              />
            </div>
          )}

          {/* ATOM: SLIDER */}
          {activeId === "slider" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-zinc-950">Continuous Range Slider</h4>
                  <span className="text-xs font-semibold font-sans tabular-nums text-zinc-700">{demoSlider}%</span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={demoSlider}
                  onChange={(val) => setDemoSlider(val)}
                />
              </div>
              <CollapsibleCode
                code={`import { Slider } from "@/components/zerolight";

<Slider
  min={0}
  max={100}
  value={demoSlider}
  onChange={(val) => setDemoSlider(val)}
/>`}
              />
            </div>
          )}

          {/* ATOM: PROGRESS BAR */}
          {activeId === "progress-bar" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white p-6 space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Tenant Ingress Quota</span>
                    <span className="font-sans tabular-nums text-zinc-500">{demoSlider}%</span>
                  </div>
                  <ProgressBar value={demoSlider} />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-zinc-700 block">Edge Synchronization Cache</span>
                  <ProgressBar value={84} label="CDN Replication" />
                </div>
              </div>
              <CollapsibleCode
                code={`import { ProgressBar } from "@/components/zerolight";

<ProgressBar value={76} label="Quota" />
<ProgressBar value={84} label="CDN Replication" />`}
              />
            </div>
          )}

          {/* ATOM: AVATAR */}
          {activeId === "avatar" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white p-6 space-y-4">
                <h4 className="text-sm font-bold text-zinc-950">Avatar Scales & Presence Indicators</h4>
                <div className="flex items-center gap-6">
                  <Avatar size="sm" initials="ZL" status="online" />
                  <Avatar size="md" initials="AP" status="online" />
                  <Avatar size="lg" initials="JD" status="offline" />
                </div>
              </div>
              <CollapsibleCode
                code={`import { Avatar } from "@/components/zerolight";

<Avatar size="md" initials="ZL" status="online" />`}
              />
            </div>
          )}

          {/* ATOM: SKELETON */}
          {activeId === "skeleton" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white p-6 space-y-4">
                <h4 className="text-sm font-bold text-zinc-950">Shimmering Pulse Skeleton</h4>
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-3 w-1/2 rounded-md" />
                  </div>
                </div>
              </div>
              <CollapsibleCode
                code={`import { Skeleton } from "@/components/zerolight";

<Skeleton className="h-4 w-3/4 rounded-md" />`}
              />
            </div>
          )}

          {/* ATOM: KBD */}
          {activeId === "kbd" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white p-6 space-y-4">
                <h4 className="text-sm font-bold text-zinc-950">Keyboard Shortcuts (Kbd)</h4>
                <p className="text-xs text-zinc-500">Rendered in crisp font-sans (never monospace) for human-crafted aesthetics.</p>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-700">
                    <span>Search Command:</span>
                    <Kbd>⌘K</Kbd>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-700">
                    <span>Multi-Select:</span>
                    <Kbd>⇧ Shift + Click</Kbd>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-700">
                    <span>Submit:</span>
                    <Kbd>↵</Kbd>
                  </div>
                </div>
              </div>
              <CollapsibleCode
                code={`import { Kbd } from "@/components/zerolight";

<Kbd>⌘K</Kbd>
<Kbd>↵</Kbd>`}
              />
            </div>
          )}

          {/* MOLECULE: STAT CARD */}
          {activeId === "stat-card" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard
                  label="API LATENCY (P99)"
                  value="18.4ms"
                  delta="-4.2ms drop"
                  trend="up"
                  comparisonText="Global edge CDN cached"
                />
                <StatCard
                  label="TOTAL ENTERPRISE CLIENTS"
                  value="1,420+"
                  delta="+18% MoM"
                  trend="up"
                  comparisonText="Zero memory leaks verified"
                />
              </div>
              <CollapsibleCode
                code={`import { StatCard } from "@/components/zerolight";

<StatCard
  label="API LATENCY (P99)"
  value="18.4ms"
  delta="-4.2ms drop"
  trend="up"
  comparisonText="Global edge CDN cached"
/>`}
              />
            </div>
          )}

          {/* MOLECULE: ALERT BANNER */}
          {activeId === "alert-banner" && (
            <div className="space-y-6">
              <div className="space-y-3">
                <AlertBanner
                  severity="success"
                  title="Cluster Health Verified"
                  description="All 16 edge regions report 100% telemetry synchronicity."
                />
                <AlertBanner
                  severity="warning"
                  title="Traffic Spike Detected"
                  description="Regional ingress into EU-Central exceeds 85% bandwidth baseline."
                />
                <AlertBanner
                  severity="critical"
                  title="Token HSM Revocation"
                  description="Root admin cryptographic session expires in 12 minutes."
                />
              </div>
              <CollapsibleCode
                code={`import { AlertBanner } from "@/components/zerolight";

<AlertBanner
  severity="success"
  title="Cluster Health Verified"
  description="All regions operational."
/>`}
              />
            </div>
          )}

          {/* MOLECULE: TOOLTIP */}
          {activeId === "tooltip" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white p-8 flex items-center justify-center gap-6">
                <Tooltip content="Quick command trigger palette (⌘K)" position="top">
                  <Button variant="outline" size="sm">Hover Me (Top)</Button>
                </Tooltip>
                <Tooltip content="ZeroLight mathematical token compiler" position="bottom">
                  <Button variant="primary" size="sm">Hover Me (Bottom)</Button>
                </Tooltip>
              </div>
              <CollapsibleCode
                code={`import { Tooltip, Button } from "@/components/zerolight";

<Tooltip content="Command palette (⌘K)" position="top">
  <Button variant="outline">Hover Me</Button>
</Tooltip>`}
              />
            </div>
          )}

          {/* BRAND: LOGO VARIATIONS */}
          {activeId === "brand-variations" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950">Multi-Tenant Brand Asset Variations</h4>
                    <p className="text-xs text-zinc-500">Switch variations managed in Visual Studio.</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl">
                    {(["light", "dark", "outline", "favicon"] as const).map((theme) => (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => setActiveLogoTheme(theme)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                          activeLogoTheme === theme ? "bg-white text-zinc-950 shadow-xs" : "text-zinc-500 hover:text-zinc-950"
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-8 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col items-center justify-center space-y-3">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                      activeLogoTheme === "dark"
                        ? "bg-zinc-950 text-white shadow-xl"
                        : activeLogoTheme === "outline"
                        ? "bg-white border-2 border-zinc-950 text-zinc-950"
                        : activeLogoTheme === "favicon"
                        ? "w-8 h-8 rounded-lg bg-zinc-950 text-white shadow-sm"
                        : "bg-zinc-950 text-white shadow-md"
                    }`}
                  >
                    <svg
                      width={activeLogoTheme === "favicon" ? 16 : 28}
                      height={activeLogoTheme === "favicon" ? 16 : 28}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 22 20 2 20 12 2" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-zinc-950 block capitalize">
                      ZeroLight {activeLogoTheme} Variation
                    </span>
                    <span className="text-[11px] text-zinc-400">Pure SVG vector geometry</span>
                  </div>
                </div>
              </div>
              <CollapsibleCode
                code={`// Standalone SVG Logo Export
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
  <polygon points="12 2 22 20 2 20 12 2" />
</svg>`}
              />
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
