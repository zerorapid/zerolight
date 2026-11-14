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
  ChevronDown,
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
  Angry,
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
import { DropdownMenu } from "../molecules/dropdown-menu";
import { WorldAtlasMap } from "../../WorldAtlasMap";

// Complete Navigation Hierarchy conforming to Vercel Geist structure
export interface DocItem {
  id: string;
  title: string;
  category: "foundations" | "brands" | "components";
  description: string;
  badge?: string;
  brandIcon?: string;
}

export const GEIST_DOCS_NAV: DocItem[] = [
  // FOUNDATIONS
  { id: "introduction", title: "Introduction", category: "foundations", description: "Design principles, philosophy, and mathematical design tokens." },
  { id: "colors", title: "Colors", category: "foundations", description: "Universal grayscale luminance tokens and semantic brand accents." },
  { id: "typography", title: "Typography", category: "foundations", description: "Type scale, weights, line heights, and tabular nums discipline." },
  { id: "font", title: "Font", category: "foundations", description: "Geist Sans, Geist Mono, Product Sans, and dynamic font pairing." },
  { id: "materials", title: "Materials", category: "foundations", description: "Hairline borders, frosted glassmorphism, and atmospheric elevation." },
  { id: "terminal", title: "Terminal", category: "foundations", description: "Registry CLI distribution, component scaffolding, and MCP server agent hooks." },

  // BRANDS
  { id: "brand-zerolight", title: "ZeroLight", category: "brands", description: "ZeroLight enterprise mark, identity rules, and usage standards.", brandIcon: "ZL" },
  { id: "brand-vercel", title: "Vercel", category: "brands", description: "Vercel trademark rules, geometry guidelines, and misuse examples.", brandIcon: "▲" },
  { id: "brand-nextjs", title: "Next.js", category: "brands", description: "The React framework for the Web logo assets and typography lockups.", brandIcon: "Ⓝ" },
  { id: "brand-turbo", title: "Turbo", category: "brands", description: "High-performance build system and Turborepo speed mark.", brandIcon: "Ⓣ" },
  { id: "brand-v0", title: "v0", category: "brands", description: "Generative UI engine and AI interface brand tokens.", brandIcon: "v0" },
  { id: "brand-eve", title: "eve", category: "brands", description: "Zero-latency autonomous agent design companion identity.", brandIcon: "eve" },
  { id: "brand-ai-sdk", title: "AI SDK", category: "brands", description: "Unified streaming LLM library mark and telemetry standards.", brandIcon: "AI" },

  // COMPONENTS
  { id: "address-input", title: "Address Input", category: "components", description: "International street address autocomplete input field." },
  { id: "avatar", title: "Avatar", category: "components", description: "User avatar with image fallback, presence indicator, and initials." },
  { id: "badge", title: "Badge", category: "components", description: "Categorical status tags, numeric counters, and pill indicators." },
  { id: "banner", title: "Banner", category: "components", description: "Full-width dismissible operational notice with action buttons." },
  { id: "book", title: "Book", category: "components", description: "Paginated multi-chapter documentation container." },
  { id: "breadcrumbs", title: "Breadcrumbs", category: "components", description: "Hierarchical pathway trail for deep information architecture." },
  { id: "browser", title: "Browser", category: "components", description: "Window mockup frame with traffic light controls and address bar." },
  { id: "button", title: "Button", category: "components", description: "Primary, secondary, outline, ghost, and destructive action triggers." },
  { id: "calendar", title: "Calendar", category: "components", description: "Single-date, range-selection, and recurring event calendar matrix." },
  { id: "checkbox", title: "Checkbox", category: "components", description: "Tri-state indeterminate checkbox with accessible keyboard controls." },
  { id: "choicebox", title: "Choicebox", category: "components", description: "Radio selection cards with pricing tiers, icons, and descriptions." },
  { id: "clearable-input", title: "Clearable Input", category: "components", description: "Text input with one-click clear button and keyboard focus." },
  { id: "code", title: "Code", category: "components", description: "Inline mono code span with subtle hairline border." },
  { id: "code-block", title: "Code Block", category: "components", description: "Syntax-highlighted multi-line code block with one-click copy." },
  { id: "collapse", title: "Collapse", category: "components", description: "Smooth spring-animated accordion disclosure for progressive discovery." },
  { id: "combobox", title: "Combobox", category: "components", description: "Autocomplete search dropdown with virtualized option list." },
  { id: "command-menu", title: "Command Menu", category: "components", description: "Raycast-style Cmd+K quick launcher with fuzzy action search." },
  { id: "context-card", title: "Context Card", category: "components", description: "Floating popover card previewing entity telemetry on hover." },
  { id: "context-menu", title: "Context Menu", category: "components", description: "Right-click mouse trigger action menu with shortcuts." },
  { id: "copy-button", title: "Copy Button", category: "components", description: "Tactile micro-interaction button with copy confirmation state." },
  { id: "description", title: "Description", category: "components", description: "Two-column key-value summary metadata list." },
  { id: "destructive-action-modal", title: "Destructive Action Modal", category: "components", description: "High-friction confirmation dialog for irreversible operations." },
  { id: "destructive-confirmation-input", title: "Destructive Confirmation Input", category: "components", description: "Strict type-to-confirm input requiring exact phrase match." },
  { id: "dots-menu", title: "Dots Menu", category: "components", description: "Three-dots horizontal action menu pill." },
  { id: "drawer", title: "Drawer", category: "components", description: "Slide-over detail sheet with focus trap and backdrop blur." },
  { id: "empty-state", title: "Empty State", category: "components", description: "Empty workspace placeholder with illustration and action CTA." },
  { id: "entity", title: "Entity", category: "components", description: "Structured record row with avatar, titles, and timestamp." },
  { id: "error", title: "Error", category: "components", description: "Compact inline error validation message." },
  { id: "error-card", title: "Error Card", category: "components", description: "Prominent error box with stack trace and retry trigger." },
  { id: "feedback", title: "Feedback", category: "components", description: "Customer sentiment emoji rating capsule with feedback text." },
  { id: "fieldset", title: "Fieldset", category: "components", description: "Grouped form section with legend and border styling." },
  { id: "file-tree", title: "File Tree", category: "components", description: "Collapsible nested directory tree with file icons." },
  { id: "skeleton", title: "Skeleton", category: "components", description: "Shimmering placeholder pulse during asynchronous data fetches." },
  { id: "slider", title: "Slider", category: "components", description: "Continuous and stepped value range slider." },
  { id: "snippet", title: "Snippet", category: "components", description: "Command-line terminal snippet with quick copy trigger." },
  { id: "spinner", title: "Spinner", category: "components", description: "Radial loading spinner indicator." },
  { id: "split-button", title: "Split Button", category: "components", description: "Dual-action button pairing primary trigger with dropdown arrow." },
  { id: "status-dot", title: "Status Dot", category: "components", description: "Pulsing health dot indicator (healthy, warning, error, neutral)." },
  { id: "switch", title: "Switch", category: "components", description: "Tactile boolean toggle switch with spring physics." },
  { id: "table", title: "Table", category: "components", description: "Dense enterprise data grid with sorting and spreadsheet editing." },
  { id: "tabs", title: "Tabs", category: "components", description: "Sliding pill and underline tab navigation." },
  { id: "toast", title: "Toast", category: "components", description: "A succinct message that is displayed temporarily." },
  { id: "toggle", title: "Toggle", category: "components", description: "Multi-option icon button toggle group." },
  { id: "tooltip", title: "Tooltip", category: "components", description: "Portaled micro-copy popup attached to trigger element." },
  { id: "world-atlas-map", title: "World Atlas Map", category: "components", description: "Apple/Airbnb 2D flat monochrome vector atlas with 6 pattern styles." },
];

export function GeistDocsPortal() {
  const { tokens, scaled, updateTokens } = useZeroLight();
  const [activeId, setActiveId] = useState<string>("toast");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackSent, setFeedbackSent] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Active Doc Item
  const activeItem = useMemo(() => {
    return GEIST_DOCS_NAV.find((item) => item.id === activeId) || GEIST_DOCS_NAV[0];
  }, [activeId]);

  // Current item index for prev/next pagination
  const currentIndex = useMemo(() => {
    return GEIST_DOCS_NAV.findIndex((item) => item.id === activeId);
  }, [activeId]);

  const prevItem = currentIndex > 0 ? GEIST_DOCS_NAV[currentIndex - 1] : null;
  const nextItem = currentIndex < GEIST_DOCS_NAV.length - 1 ? GEIST_DOCS_NAV[currentIndex + 1] : null;

  // Filtered Navigation based on search
  const filteredNav = useMemo(() => {
    if (!searchQuery.trim()) return GEIST_DOCS_NAV;
    const q = searchQuery.toLowerCase();
    return GEIST_DOCS_NAV.filter(
      (item) => item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Keyboard shortcut listener (Cmd+K)
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
    triggerToast(`Thank you for your ${sentiment} feedback!`);
    setTimeout(() => setFeedbackSent(null), 4000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black font-sans text-zinc-900 dark:text-zinc-100 antialiased">
      {/* ── TOP HEADER (Delta Mark + Search Cmd+K + Theme Toggle) ── */}
      <header className="sticky top-0 z-40 h-14 border-b border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-xl px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveId("introduction")}>
            {/* Vercel-style Delta triangle */}
            <svg viewBox="0 0 76 65" className="h-4 w-4 fill-zinc-950 dark:fill-white">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
            <span className="font-bold text-sm tracking-tight text-zinc-950 dark:text-white">
              Geist Design System
            </span>
            <Badge variant="neutral" className="text-[10px] py-0 px-1.5 ml-1">v2.0</Badge>
          </div>
        </div>

        {/* Center Search Capsule (Cmd+K) */}
        <div
          onClick={() => {
            setIsSearchModalOpen(true);
            setTimeout(() => searchInputRef.current?.focus(), 50);
          }}
          className="flex items-center gap-3 w-64 md:w-80 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-500 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span className="flex-1 text-zinc-400">Search Geist...</span>
          <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-800 text-[10px] font-semibold text-zinc-500">
            ⌘K
          </kbd>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const isDark = scaled.isDarkSurface;
              updateTokens?.({
                universalFillColor: isDark ? "#FFFFFF" : "#09090B",
                universalBorderColor: isDark ? "#E4E4E7" : "#27272A",
                textIconColor: isDark ? "#09090B" : "#F4F4F5",
              });
            }}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition cursor-pointer"
            title="Toggle Light/Dark Theme"
          >
            {scaled.isDarkSurface ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>
        </div>
      </header>

      {/* ── BODY LAYOUT (Sticky Sidebar + Center Content) ── */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="w-64 shrink-0 border-r border-zinc-200/80 dark:border-zinc-800 p-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto space-y-6 text-xs">
          {/* Quick Filter Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Filter items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs outline-none focus:border-zinc-950 dark:focus:border-white transition"
            />
          </div>

          {/* Section 1: Foundations */}
          <div className="space-y-1">
            <h5 className="px-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Foundations
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
                          ? "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-950 dark:text-white font-semibold"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-white"
                      }`}
                    >
                      <span>{item.title}</span>
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 dark:bg-white" />}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Section 2: Brands */}
          <div className="space-y-1">
            <h5 className="px-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Brands
            </h5>
            <div className="space-y-0.5 pt-1">
              {filteredNav
                .filter((item) => item.category === "brands")
                .map((item) => {
                  const active = activeId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveId(item.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center gap-2 ${
                        active
                          ? "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-950 dark:text-white font-semibold"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-white"
                      }`}
                    >
                      <span className="w-4 text-center font-mono text-[11px] text-zinc-400 font-bold">
                        {item.brandIcon}
                      </span>
                      <span className="truncate">{item.title}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Section 3: Components */}
          <div className="space-y-1">
            <h5 className="px-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Components
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
                          ? "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-950 dark:text-white font-semibold"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-white"
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <span className="text-[10px] px-1 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-500 font-mono">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        </aside>

        {/* ── CENTER WORKSPACE CONTENT AREA ── */}
        <main className="flex-1 max-w-4xl px-8 py-10 space-y-10 min-w-0">
          {/* Header Title & Description */}
          <div className="space-y-2 pb-6 border-b border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs text-zinc-400 capitalize">
              <span>{activeItem.category}</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-zinc-900 dark:text-white font-medium">{activeItem.title}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              {activeItem.title}
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              {activeItem.description}
            </p>
          </div>

          {/* =========================================================================
              DYNAMIC CONTENT RENDERER BASED ON ACTIVE ID
             ========================================================================= */}

          {/* COMPONENT: TOAST */}
          {activeId === "toast" && (
            <div className="space-y-8">
              {/* Variant 1: Default */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">Default</h3>
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950">
                  <div className="p-8 flex items-center justify-center min-h-[140px] bg-zinc-50/50 dark:bg-zinc-900/20">
                    <button
                      type="button"
                      onClick={() => triggerToast("Your changes have been saved successfully.")}
                      className="px-4 py-2 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition shadow-sm cursor-pointer"
                    >
                      Show Toast
                    </button>
                  </div>
                  <CollapsibleCode
                    code={`import { useToast } from "@/components/zerolight";

export default function Demo() {
  const { toast } = useToast();

  return (
    <button onClick={() => toast("Your changes have been saved successfully.")}>
      Show Toast
    </button>
  );
}`}
                  />
                </div>
              </div>

              {/* Variant 2: Multi-line / Action */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">Multi-line with Action</h3>
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950">
                  <div className="p-8 flex items-center justify-center min-h-[140px] bg-zinc-50/50 dark:bg-zinc-900/20">
                    <button
                      type="button"
                      onClick={() =>
                        triggerToast("Deployment finished. All 21 edge functions deployed in 480ms.")
                      }
                      className="px-4 py-2 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition shadow-sm cursor-pointer"
                    >
                      Show Multi-line Toast
                    </button>
                  </div>
                  <CollapsibleCode
                    code={`toast({
  title: "Deployment Finished",
  description: "All 21 edge functions deployed in 480ms.",
  action: <button onClick={() => undo()}>Undo</button>,
});`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* COMPONENT: BUTTON */}
          {activeId === "button" && (
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">Button Variants</h3>
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950">
                  <div className="p-8 flex flex-wrap items-center justify-center gap-3 min-h-[140px] bg-zinc-50/50 dark:bg-zinc-900/20">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                  <CollapsibleCode
                    code={`import { Button } from "@/components/zerolight";

<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete Project</Button>`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* COMPONENT: WORLD ATLAS MAP */}
          {activeId === "world-atlas-map" && (
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                  Apple / Airbnb Monochrome 2D Flat Map
                </h3>
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950 p-4">
                  <WorldAtlasMap className="h-[480px]" />
                  <CollapsibleCode
                    code={`import { WorldAtlasMap } from "@/components/zerolight";

// 6 switchable render styles: vector, dots, pixels, crosses, diamonds, hatch
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

          {/* FOUNDATION: COLORS */}
          {activeId === "colors" && (
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">Grayscale Luminance</h3>
                <p className="text-xs text-zinc-500">
                  Hairline borders, subtle surfaces, and high contrast typography tokens.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "White", hex: "#FFFFFF", variable: "--zl-white" },
                    { label: "Zinc 50", hex: "#FAFAFA", variable: "--zl-zinc-50" },
                    { label: "Zinc 100", hex: "#F4F4F5", variable: "--zl-zinc-100" },
                    { label: "Zinc 200", hex: "#E4E4E7", variable: "--zl-zinc-200" },
                    { label: "Zinc 400", hex: "#A1A1AA", variable: "--zl-zinc-400" },
                    { label: "Zinc 700", hex: "#3F3F46", variable: "--zl-zinc-700" },
                    { label: "Zinc 900", hex: "#18181B", variable: "--zl-zinc-900" },
                    { label: "Black", hex: "#000000", variable: "--zl-black" },
                  ].map((color) => (
                    <div
                      key={color.hex}
                      onClick={() => copyToClipboard(color.hex, color.hex)}
                      className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 cursor-pointer transition space-y-2 group"
                    >
                      <div
                        style={{ backgroundColor: color.hex }}
                        className="h-12 w-full rounded-lg border border-black/10 dark:border-white/10"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{color.label}</span>
                        <span className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white">
                          {color.hex}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BRAND: VERCEL (With exact Misuse section matching Image 6) */}
          {activeId === "brand-vercel" && (
            <div className="space-y-8">
              {/* Logo Presentation */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/20">
                <svg viewBox="0 0 76 65" className="h-16 w-16 fill-zinc-950 dark:fill-white">
                  <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                </svg>
              </div>

              {/* Exact Misuse rules from Image 6 */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-zinc-950 dark:text-white">Misuse</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Here are some examples of ways that you should not use the Vercel marks:
                </p>
                <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 list-disc pl-5 leading-relaxed">
                  <li>Do not use Vercel marks in the name of your business, product, service, application, domain name, publication, or other offering.</li>
                  <li>Do not use marks, logos, company names, slogans, domain names, or designs that are confusingly similar to any Vercel marks.</li>
                  <li>Do not use the Vercel marks in any manner likely to create confusion as to the sponsorship or relationship, affiliation, or endorsement of your company, product or service by Vercel.</li>
                  <li>Do not use the Vercel marks in a false or misleading manner.</li>
                  <li>Do not display the Vercel marks more prominently than your trademarks, product, service, or company name.</li>
                  <li>Do not use Vercel marks for commercial purposes. e.g. do not include Vercel marks on merchandise or marketing collateral for your commercial products or services.</li>
                  <li>Do not modify the Vercel marks.</li>
                  <li>Do not use the Vercel marks on or in connection with any defamatory, scandalous, pornographic, obscene or other objectionable materials.</li>
                </ul>
              </div>
            </div>
          )}

          {/* DEFAULT FALLBACK COMPONENT SHOWCASE */}
          {activeId !== "toast" &&
            activeId !== "button" &&
            activeId !== "world-atlas-map" &&
            activeId !== "colors" &&
            activeId !== "brand-vercel" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950">
                  <div className="p-8 flex items-center justify-center min-h-[160px] bg-zinc-50/50 dark:bg-zinc-900/20">
                    <div className="text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-700 dark:text-zinc-300">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                        {activeItem.title} Preview
                      </h4>
                      <p className="text-xs text-zinc-500 max-w-sm">
                        {activeItem.description}
                      </p>
                    </div>
                  </div>
                  <CollapsibleCode
                    code={`import { ${activeItem.title.replace(/\s+/g, "")} } from "@/components/zerolight";

// Usage in enterprise Next.js React 19 application
export default function Example() {
  return (
    <${activeItem.title.replace(/\s+/g, "")} />
  );
}`}
                  />
                </div>
              </div>
            )}

          {/* =========================================================================
              BOTTOM PAGINATION (Previous < / Give feedback / Next >)
             ========================================================================= */}
          <div className="pt-10 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Previous link */}
            <div>
              {prevItem ? (
                <button
                  type="button"
                  onClick={() => setActiveId(prevItem.id)}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-200 ml-1">
                    {prevItem.title}
                  </span>
                </button>
              ) : (
                <div />
              )}
            </div>

            {/* Give feedback capsule pill (Image 6 match) */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs shadow-xs">
              <span className="text-zinc-500 text-[11px] font-medium">Give feedback</span>
              <div className="flex items-center gap-1 text-zinc-400">
                <button
                  onClick={() => handleFeedback("positive")}
                  className="p-1 hover:text-emerald-500 transition cursor-pointer"
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

            {/* Next link */}
            <div>
              {nextItem ? (
                <button
                  type="button"
                  onClick={() => setActiveId(nextItem.id)}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition cursor-pointer"
                >
                  <span>Next</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-200 mr-1">
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
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 shadow-2xl space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search components, foundations, and brand guidelines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm outline-none focus:border-zinc-950 dark:focus:border-white transition"
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
                  className="w-full p-2.5 rounded-lg text-left hover:bg-zinc-100 dark:hover:bg-zinc-900 transition flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                      {item.title}
                    </span>
                    <p className="text-[11px] text-zinc-500 truncate max-w-md">{item.description}</p>
                  </div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-medium shadow-2xl animate-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

// Collapsible Code Accordion
function CollapsibleCode({ code }: { code: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 text-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition bg-zinc-50/30 dark:bg-zinc-900/10 cursor-pointer"
      >
        <div className="flex items-center gap-2 font-medium">
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-90" : ""}`} />
          <span>Show code</span>
        </div>
        <FileCode className="w-3.5 h-3.5 text-zinc-400" />
      </button>

      {isOpen && (
        <div className="relative p-4 bg-zinc-950 dark:bg-black font-mono text-[11px] text-zinc-200 border-t border-zinc-200 dark:border-zinc-800 overflow-x-auto">
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
          <pre className="pr-10 leading-relaxed">{code}</pre>
        </div>
      )}
    </div>
  );
}

export default GeistDocsPortal;
