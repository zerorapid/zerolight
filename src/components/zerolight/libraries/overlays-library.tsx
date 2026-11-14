"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Copy,
  Check,
  X,
  Command,
  Sliders,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  FileText,
  UserPlus,
  Zap,
  ArrowRight,
  Filter,
  Menu,
  FileSpreadsheet,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  MousePointer,
  Layers,
  Calendar,
  CreditCard,
  Settings,
  FolderPlus,
  RefreshCw,
  Folder,
} from "lucide-react";
import { useZeroLight } from "../context";
import { Badge } from "../atoms/badge";

export type OverlaySize = "small" | "medium" | "large";

export function SaaSOverlaysLibrary() {
  const { tokens } = useZeroLight();

  // Sticky Bar States
  const [searchQuery, setSearchQuery] = useState("");
  const [overlaySize, setOverlaySize] = useState<OverlaySize>("medium");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Code Modal State
  const [activeCodeModal, setActiveCodeModal] = useState<{ title: string; code: string } | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Active Interactive Overlay State
  const [activeOverlayId, setActiveOverlayId] = useState<string | null>(null);

  // Type-to-delete input state
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  // Command palette search
  const [commandSearch, setCommandSearch] = useState("");

  // Scoped switcher search
  const [switcherSearch, setSwitcherSearch] = useState("");

  // Context menu position state for custom demo triggers
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [canvasContextMenuPos, setCanvasContextMenuPos] = useState<{ x: number; y: number } | null>(null);

  // Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [onboardingStep, setOnboardingStep] = useState(1);

  // Global Keydown Listener for Cmd+K / Ctrl+K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setActiveOverlayId("v11");
      } else if (e.key === "Escape") {
        setActiveOverlayId(null);
        setContextMenuPos(null);
        setCanvasContextMenuPos(null);
        setActiveCodeModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Size Configuration (width for modals and drawers)
  const sizeConfig = {
    small: {
      modalWidth: "max-w-[380px]",
      drawerWidth: "max-w-[360px]",
      padding: "p-4",
      headerText: "text-sm",
    },
    medium: {
      modalWidth: "max-w-[460px]",
      drawerWidth: "max-w-[420px]",
      padding: "p-6",
      headerText: "text-base",
    },
    large: {
      modalWidth: "max-w-[560px]",
      drawerWidth: "max-w-[520px]",
      padding: "p-7",
      headerText: "text-lg",
    },
  }[overlaySize];

  const categories = [
    { id: "all", label: "All Overlays", count: 16 },
    { id: "confirmations", label: "Dialogs & Confirmations", count: 3 },
    { id: "modals", label: "Form & Creation Modals", count: 3 },
    { id: "drawers", label: "Slide-Over Drawers", count: 4 },
    { id: "commands", label: "Command Palettes & ⌘K", count: 2 },
    { id: "context-menus", label: "Context & Micro-Overlays", count: 2 },
    { id: "wizards", label: "Steppers & Multi-Step Wizards", count: 2 },
  ];

  const variants = [
    // Category 1: Dialogs & Action Confirmations
    {
      id: "v01",
      cat: "confirmations",
      num: "01",
      title: "Standard Action Confirm Dialog",
      desc: "Compact alert dialog for destructive or reversible user actions with clear primary and cancel actions.",
      type: "Dialog",
    },
    {
      id: "v02",
      cat: "confirmations",
      num: "02",
      title: "Type-to-Confirm Critical Delete Dialog",
      desc: "High-stakes confirmation requiring user to type DELETE before unlocking destructive action.",
      type: "Dialog",
    },
    {
      id: "v03",
      cat: "confirmations",
      num: "03",
      title: "Success / Receipt Modal Dialog",
      desc: "Delightful operational confirmation with amount, transaction hash, and download PDF button.",
      type: "Receipt",
    },

    // Category 2: Form & Creation Modals
    {
      id: "v04",
      cat: "modals",
      num: "04",
      title: "Create Record Multi-Input Modal",
      desc: "Centered modal dialog with form validation, helper hints, and sticky footer action buttons.",
      type: "Form Modal",
    },
    {
      id: "v05",
      cat: "modals",
      num: "05",
      title: "Team Member Invite Modal",
      desc: "Collaboration invitation modal with email tags, role permission dropdown, and copy invite link.",
      type: "Form Modal",
    },
    {
      id: "v06",
      cat: "modals",
      num: "06",
      title: "Plan Upgrade / Pricing Modal",
      desc: "High-converting upgrade modal with feature comparison checklist, billing toggle, and tier badge.",
      type: "Pricing Modal",
    },

    // Category 3: Slide-Over Drawers
    {
      id: "v07",
      cat: "drawers",
      num: "07",
      title: "Right Slide-Over Record Detail Drawer",
      desc: "Deep inspection sheet sliding from right edge with tabs, metadata grid, and audit timeline.",
      type: "Drawer",
    },
    {
      id: "v08",
      cat: "drawers",
      num: "08",
      title: "Right Slide-Over Edit Form Drawer",
      desc: "Complex multi-section editing drawer preserving background context while editing customer records.",
      type: "Drawer",
    },
    {
      id: "v09",
      cat: "drawers",
      num: "09",
      title: "Right Slide-Over Filter Panel Drawer",
      desc: "Faceted query builder with date pickers, multi-select checkboxes, and range sliders.",
      type: "Drawer",
    },
    {
      id: "v10",
      cat: "drawers",
      num: "10",
      title: "Left Slide-Over Mobile Navigation Drawer",
      desc: "Off-canvas primary navigation sheet with workspace selector, navigation links, and account menu.",
      type: "Left Drawer",
    },

    // Category 4: Command Palettes & Quick Search
    {
      id: "v11",
      cat: "commands",
      num: "11",
      title: "Global Command Palette (⌘K)",
      desc: "Super-fast global action launcher with keyboard navigation, section groupings, and recent history.",
      type: "Command Palette",
    },
    {
      id: "v12",
      cat: "commands",
      num: "12",
      title: "Scoped Record Quick-Switcher",
      desc: "Targeted entity jumper for rapid workspace, customer, or invoice navigation across large apps.",
      type: "Quick Switcher",
    },

    // Category 5: Context Menus & Micro-Overlays
    {
      id: "v13",
      cat: "context-menus",
      num: "13",
      title: "Table Row Action Context Menu",
      desc: "Right-click floating micro-overlay positioned at exact cursor coordinates with keyboard hotkeys.",
      type: "Context Menu",
    },
    {
      id: "v14",
      cat: "context-menus",
      num: "14",
      title: "Canvas / Card Context Menu",
      desc: "Subtle floating context menu for whiteboard, dashboard card, or kanban tile operations.",
      type: "Context Menu",
    },

    // Category 6: Stepper & Multi-Step Wizards
    {
      id: "v15",
      cat: "wizards",
      num: "15",
      title: "3-Step CSV Column Mapping Modal",
      desc: "Guided step-by-step import wizard with progress stepper, field matching, and validation summary.",
      type: "Wizard",
    },
    {
      id: "v16",
      cat: "wizards",
      num: "16",
      title: "Welcome & Feature Walkthrough Onboarding Modal",
      desc: "Interactive multi-step product tour with illustrative iconography, feature cards, and step counter.",
      type: "Onboarding",
    },
  ];

  // Filtering
  const filteredVariants = variants.filter((v) => {
    const matchesCat = activeCategory === "all" || v.cat === activeCategory;
    const matchesQuery =
      searchQuery.trim() === "" ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const getCodeSnippet = (id: string, title: string) => {
    return `// ZeroLight Level 3 Organism: ${title}
import React, { useState } from "react";
import { useZeroLight } from "@/components/zerolight/context";

export function ${title.replace(/[^a-zA-Z0-9]/g, "")}() {
  const [isOpen, setIsOpen] = useState(false);
  const { tokens } = useZeroLight();

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 transition hover:opacity-90"
      >
        Open ${title}
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-full max-w-[460px] bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/10 rounded-xl shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/10">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">${title}</h3>
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </div>
            <div className="py-4 text-xs text-zinc-600 dark:text-zinc-400">
              Complete modal and overlay contents with clean spring transitions.
            </div>
          </div>
        </div>
      )}
    </>
  );
}`;
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          STICKY TOP CONTROL BAR
      ========================================================================= */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-white/90 dark:bg-[#09090B]/90 border-b border-zinc-200/80 dark:border-white/10 -mx-6 px-6 py-3.5 space-y-3 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Title & Live Variant Counter Badge */}
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-900 text-white dark:bg-white dark:text-zinc-950">
              Level 3
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  SaaS Overlays, Modals, Drawers & ⌘K
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-sans tabular-nums">
                  {filteredVariants.length} of 16 Variants
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Organism-level dialogs, slide-over sheets, floating command launchers, and micro-overlays.
              </p>
            </div>
          </div>

          {/* Quick Launch & Global Width Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Launch ⌘K */}
            <button
              type="button"
              onClick={() => setActiveOverlayId("v11")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Command className="w-3.5 h-3.5" />
              <span>Launch Command Bar</span>
              <span className="text-[10px] bg-white/20 dark:bg-black/10 px-1 py-0.2 rounded font-sans tabular-nums">
                ⌘K
              </span>
            </button>

            {/* Instant Search */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Filter overlays..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-white/20 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Global Overlay Width Toggles */}
            <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs">
              {(["small", "medium", "large"] as OverlaySize[]).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setOverlaySize(sz)}
                  className={`px-2.5 py-1 rounded-md font-medium capitalize transition cursor-pointer ${
                    overlaySize === sz
                      ? "bg-white dark:bg-white/20 text-zinc-950 dark:text-white shadow-xs font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Category Filter Rail */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                    : "bg-zinc-100/80 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/70 dark:hover:bg-white/10"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans tabular-nums font-bold ${
                    isActive
                      ? "bg-white/20 dark:bg-zinc-950/20 text-white dark:text-zinc-950"
                      : "bg-zinc-200 dark:bg-white/10 text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          VARIANTS GRID (16 OVERLAYS)
      ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVariants.map((v) => (
          <div
            key={v.id}
            className="group relative flex flex-col justify-between p-5 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#121215] shadow-xs hover:border-zinc-300 dark:hover:border-white/20 transition"
          >
            <div>
              {/* Header: Number, Category Badge & Type */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 font-sans tabular-nums">
                    #{v.num}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-white/5">
                    {v.type}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: v.title,
                      code: getCodeSnippet(v.id, v.title),
                    })
                  }
                  className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-xs flex items-center gap-1 transition"
                  title="View TSX Code"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>

              {/* Title & Description */}
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-1.5">
                {v.title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                {v.desc}
              </p>

              {/* Mini Preview Box */}
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-[#09090B] border border-zinc-150 dark:border-white/5 mb-4 text-xs">
                {v.id === "v01" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      <span>Discard unpublished changes?</span>
                    </div>
                    <div className="flex justify-end gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-white/10 text-[10px]">Cancel</span>
                      <span className="px-2 py-0.5 rounded bg-zinc-900 text-white dark:bg-white dark:text-black text-[10px] font-semibold">Discard</span>
                    </div>
                  </div>
                )}
                {v.id === "v02" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold">
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Type DELETE to confirm</span>
                    </div>
                    <div className="px-2 py-1 rounded border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 text-[11px] text-zinc-400">
                      DELETE
                    </div>
                  </div>
                )}
                {v.id === "v03" && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-zinc-800 dark:text-zinc-200 font-semibold">
                      <span>Payment Received</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-sans tabular-nums">₹1,25,000</span>
                    </div>
                    <div className="text-[10px] text-zinc-400">Invoice #INV-9042 • Verified via UPI</div>
                  </div>
                )}
                {v.id === "v04" && (
                  <div className="space-y-1.5">
                    <div className="h-2 w-24 bg-zinc-300 dark:bg-white/20 rounded" />
                    <div className="h-6 w-full bg-white dark:bg-white/5 rounded border border-zinc-200 dark:border-white/10 px-2 flex items-center text-[10px] text-zinc-400">
                      e.g. Production Analytics
                    </div>
                  </div>
                )}
                {v.id === "v05" && (
                  <div className="space-y-1">
                    <div className="text-[11px] text-zinc-700 dark:text-zinc-300 font-semibold">Add collaborator emails</div>
                    <div className="text-[10px] text-zinc-400">Assign Admin, Member, or Billing role</div>
                  </div>
                )}
                {v.id === "v06" && (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Team Pro</div>
                      <div className="text-[10px] text-zinc-500">Unlimited workspaces</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold font-sans tabular-nums">₹2,499</span>
                      <span className="text-[10px] text-zinc-400">/mo</span>
                    </div>
                  </div>
                )}
                {v.id === "v07" && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">Invoice #INV-9042 Details</div>
                    <div className="text-[10px] text-zinc-400">Customer: Zerorapid India Pvt Ltd • Billed ₹84,200</div>
                  </div>
                )}
                {v.id === "v08" && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">Edit Customer Profile</div>
                    <div className="text-[10px] text-zinc-400">Update GSTIN, legal address, and payment terms</div>
                  </div>
                )}
                {v.id === "v09" && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400">Filters Active</span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-white/10 text-[10px] font-bold font-sans tabular-nums">3 applied</span>
                  </div>
                )}
                {v.id === "v10" && (
                  <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                    <Menu className="w-3.5 h-3.5" />
                    <span>Off-Canvas Drawer Navigation</span>
                  </div>
                )}
                {v.id === "v11" && (
                  <div className="flex items-center justify-between text-xs text-zinc-700 dark:text-zinc-300">
                    <div className="flex items-center gap-1.5">
                      <Command className="w-3.5 h-3.5" />
                      <span>Search commands...</span>
                    </div>
                    <span className="text-[10px] bg-zinc-200 dark:bg-white/10 px-1 py-0.2 rounded font-sans tabular-nums">⌘K</span>
                  </div>
                )}
                {v.id === "v12" && (
                  <div className="flex items-center justify-between text-xs text-zinc-700 dark:text-zinc-300">
                    <div className="flex items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5" />
                      <span>Switch Workspace...</span>
                    </div>
                    <span className="text-[10px] bg-zinc-200 dark:bg-white/10 px-1 py-0.2 rounded font-sans tabular-nums">⌘P</span>
                  </div>
                )}
                {v.id === "v13" && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">Table Context Menu</div>
                    <div className="text-[10px] text-zinc-400">Right-click table row for instant inline actions</div>
                  </div>
                )}
                {v.id === "v14" && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">Canvas Floating Menu</div>
                    <div className="text-[10px] text-zinc-400">Right-click canvas for Duplicate, Lock, Export</div>
                  </div>
                )}
                {v.id === "v15" && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">CSV Column Matcher</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">12 / 12 mapped</span>
                  </div>
                )}
                {v.id === "v16" && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Product Tour</span>
                    <span className="text-[10px] text-zinc-400 font-sans tabular-nums">Step 1 of 3</span>
                  </div>
                )}
              </div>
            </div>

            {/* Test Action Trigger */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-150 dark:border-white/5">
              <span className="text-[11px] text-zinc-400">
                {v.cat === "drawers" ? "Slide-over" : v.cat === "commands" ? "Shortcut" : "Centered"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveOverlayId(v.id);
                  setDeleteConfirmationText("");
                  setCommandSearch("");
                  setSwitcherSearch("");
                  setWizardStep(1);
                  setOnboardingStep(1);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-white/10 dark:hover:bg-white/15 text-zinc-900 dark:text-zinc-100 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Test Overlay</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================================
          INTERACTIVE BACKDROP STAGE & MODALS / DRAWERS
      ========================================================================= */}
      {activeOverlayId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
          onClick={() => setActiveOverlayId(null)}
        >
          {/* V01: Standard Action Confirm Dialog */}
          {activeOverlayId === "v01" && (
            <div
              className={`w-full ${sizeConfig.modalWidth} bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl ${sizeConfig.padding} space-y-4 animate-in zoom-in-95 duration-150`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    Discard unpublished changes?
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    You have uncommitted modifications in this workspace. Exiting now will permanently discard your last 4 edits.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveOverlayId(null)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition"
                >
                  Keep Editing
                </button>
                <button
                  type="button"
                  onClick={() => setActiveOverlayId(null)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition shadow-xs"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          )}

          {/* V02: Type-to-Confirm Critical Delete Dialog */}
          {activeOverlayId === "v02" && (
            <div
              className={`w-full ${sizeConfig.modalWidth} bg-white dark:bg-[#121215] border border-rose-200 dark:border-rose-950/40 rounded-2xl shadow-2xl ${sizeConfig.padding} space-y-4 animate-in zoom-in-95 duration-150`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    Delete Production Cluster?
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    This action is destructive and irreversible. All 14 microservices and telemetry logs will be destroyed.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block">
                  Please type <span className="font-bold text-rose-600 dark:text-rose-400">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  placeholder="DELETE"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveOverlayId(null)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteConfirmationText !== "DELETE"}
                  onClick={() => setActiveOverlayId(null)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    deleteConfirmationText === "DELETE"
                      ? "bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
                      : "bg-zinc-200 dark:bg-white/10 text-zinc-400 cursor-not-allowed"
                  }`}
                >
                  Permanently Delete
                </button>
              </div>
            </div>
          )}

          {/* V03: Success / Receipt Modal Dialog */}
          {activeOverlayId === "v03" && (
            <div
              className={`w-full ${sizeConfig.modalWidth} bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl ${sizeConfig.padding} space-y-5 animate-in zoom-in-95 duration-150 text-center`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Payment Successful
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Transaction receipt has been transmitted to accounts@zerorapid.in
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#09090B] border border-zinc-200 dark:border-white/10 space-y-2 text-left text-xs">
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Amount Paid</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm font-sans tabular-nums">
                    ₹1,25,000.00
                  </span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Invoice Number</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 font-sans tabular-nums">
                    #INV-9042
                  </span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Date & Timestamp</span>
                  <span className="font-sans tabular-nums">15 Nov 2026, 03:45 AM</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Payment Channel</span>
                  <span>Direct Bank Wire (HDFC)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveOverlayId(null)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 transition shadow-xs"
                >
                  Done
                </button>
                <button
                  type="button"
                  onClick={() => setActiveOverlayId(null)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10 transition"
                >
                  Download PDF
                </button>
              </div>
            </div>
          )}

          {/* V04: Create Record Multi-Input Modal */}
          {activeOverlayId === "v04" && (
            <div
              className={`w-full ${sizeConfig.modalWidth} bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl ${sizeConfig.padding} space-y-4 animate-in zoom-in-95 duration-150`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-150 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-zinc-200">
                    <FolderPlus className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Create New Workspace
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveOverlayId(null)}
                  className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">Workspace Name</label>
                  <input
                    type="text"
                    defaultValue="Enterprise Analytics Pod"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">Environment Target</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="p-2.5 rounded-lg border border-zinc-900 dark:border-white bg-zinc-50 dark:bg-white/10 text-left font-semibold"
                    >
                      Production
                    </button>
                    <button
                      type="button"
                      className="p-2.5 rounded-lg border border-zinc-200 dark:border-white/10 text-left text-zinc-500"
                    >
                      Staging
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-150 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveOverlayId(null)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setActiveOverlayId(null)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 transition shadow-xs"
                >
                  Create Workspace
                </button>
              </div>
            </div>
          )}

          {/* V05: Team Member Invite Modal */}
          {activeOverlayId === "v05" && (
            <div
              className={`w-full ${sizeConfig.modalWidth} bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl ${sizeConfig.padding} space-y-4 animate-in zoom-in-95 duration-150`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-150 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-zinc-200">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Invite Team Collaborators
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveOverlayId(null)}
                  className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">Email Addresses</label>
                  <input
                    type="text"
                    defaultValue="vikram@zerorapid.in, priya@enterprise.org"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">Access Permissions</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      className="p-2 rounded-lg border border-zinc-900 dark:border-white bg-zinc-50 dark:bg-white/10 text-center font-semibold"
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg border border-zinc-200 dark:border-white/10 text-center text-zinc-500"
                    >
                      Editor
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg border border-zinc-200 dark:border-white/10 text-center text-zinc-500"
                    >
                      Viewer
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-150 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveOverlayId(null)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setActiveOverlayId(null)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 transition shadow-xs"
                >
                  Send 2 Invitations
                </button>
              </div>
            </div>
          )}

          {/* V06: Plan Upgrade / Pricing Modal */}
          {activeOverlayId === "v06" && (
            <div
              className={`w-full ${sizeConfig.modalWidth} bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl ${sizeConfig.padding} space-y-4 animate-in zoom-in-95 duration-150`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-150 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      Upgrade to Team Pro
                    </h3>
                    <p className="text-[11px] text-zinc-500">Scale without limits across regional teams</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveOverlayId(null)}
                  className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#09090B] border border-zinc-200 dark:border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Team Pro Membership</div>
                  <div className="text-[11px] text-zinc-500">Billed annually • Save 20%</div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-sans tabular-nums text-zinc-900 dark:text-zinc-100">
                    ₹2,499
                  </span>
                  <span className="text-xs text-zinc-500">/mo</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Unlimited collaborative workspaces & clusters</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Real-time audit telemetry & SOC2 compliance logs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Dedicated Slack channel & 1-hour SLA response</span>
                </li>
              </ul>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-150 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveOverlayId(null)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => setActiveOverlayId(null)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 transition shadow-xs"
                >
                  Confirm & Pay ₹2,499
                </button>
              </div>
            </div>
          )}

          {/* V07, V08, V09: Slide-Over Drawers (Right edge) */}
          {(activeOverlayId === "v07" || activeOverlayId === "v08" || activeOverlayId === "v09") && (
            <div
              className={`fixed inset-y-0 right-0 z-50 w-full ${sizeConfig.drawerWidth} bg-white dark:bg-[#121215] border-l border-zinc-200 dark:border-white/10 shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-200`}
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-zinc-150 dark:border-white/10">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {activeOverlayId === "v07" && "Invoice #INV-9042 Details"}
                      {activeOverlayId === "v08" && "Edit Customer Record"}
                      {activeOverlayId === "v09" && "Filter Data Queries"}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {activeOverlayId === "v07" && "Billed to Zerorapid India Pvt Ltd"}
                      {activeOverlayId === "v08" && "Update billing address and tax codes"}
                      {activeOverlayId === "v09" && "Apply criteria to current table view"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveOverlayId(null)}
                    className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="py-5 space-y-4 text-xs">
                  {activeOverlayId === "v07" && (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#09090B] border border-zinc-200 dark:border-white/10 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Status</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">PAID</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Subtotal</span>
                          <span className="font-sans tabular-nums font-semibold">₹71,356.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">GST (18%)</span>
                          <span className="font-sans tabular-nums font-semibold">₹12,844.00</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-white/10">
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">Total Billed</span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-100 font-sans tabular-nums">₹84,200.00</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeOverlayId === "v08" && (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="font-medium text-zinc-700 dark:text-zinc-300">Company Legal Name</label>
                        <input
                          type="text"
                          defaultValue="Zerorapid India Private Limited"
                          className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-medium text-zinc-700 dark:text-zinc-300">GSTIN / Tax ID</label>
                        <input
                          type="text"
                          defaultValue="36AAACZ1234F1Z5"
                          className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 font-sans tabular-nums"
                        />
                      </div>
                    </div>
                  )}

                  {activeOverlayId === "v09" && (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="font-medium text-zinc-700 dark:text-zinc-300">Status Filter</label>
                        <div className="flex flex-wrap gap-1.5">
                          {["All", "Paid", "Pending", "Overdue"].map((st, idx) => (
                            <span
                              key={st}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                                idx === 1
                                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
                                  : "bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400"
                              }`}
                            >
                              {st}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-150 dark:border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveOverlayId(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setActiveOverlayId(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* V10: Left Slide-Over Mobile Navigation Drawer */}
          {activeOverlayId === "v10" && (
            <div
              className={`fixed inset-y-0 left-0 z-50 w-full ${sizeConfig.drawerWidth} bg-white dark:bg-[#121215] border-r border-zinc-200 dark:border-white/10 shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-left duration-200`}
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-zinc-150 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs">
                      ZL
                    </div>
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      ZeroLight App
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveOverlayId(null)}
                    className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="py-4 space-y-1 text-xs font-semibold">
                  {["Dashboard Overview", "Customers & Accounts", "Invoices & Billing", "API Keys & Integrations", "Security & Telemetry"].map((menuItem, idx) => (
                    <button
                      key={menuItem}
                      type="button"
                      onClick={() => setActiveOverlayId(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        idx === 0
                          ? "bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white"
                          : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                    >
                      {menuItem}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-150 dark:border-white/10 flex items-center justify-between text-xs text-zinc-500">
                <span>Enterprise v2.4</span>
                <span className="font-sans tabular-nums">SOC2 Compliant</span>
              </div>
            </div>
          )}

          {/* V11: Global Command Palette (⌘K) */}
          {activeOverlayId === "v11" && (
            <div
              className={`w-full max-w-[560px] bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-150 dark:border-white/10">
                <Command className="w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type a command or search actions..."
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  className="flex-1 text-xs bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
                />
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-400 font-sans tabular-nums">
                  ESC to close
                </span>
              </div>

              <div className="p-2 max-h-[300px] overflow-y-auto space-y-3 text-xs">
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Quick Navigation
                  </div>
                  {[
                    { label: "Go to Dashboard Overview", shortcut: "G D" },
                    { label: "Go to Billing & Invoices", shortcut: "G B" },
                    { label: "Go to API Keys & Telemetry", shortcut: "G A" },
                  ]
                    .filter((item) =>
                      item.label.toLowerCase().includes(commandSearch.toLowerCase())
                    )
                    .map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setActiveOverlayId(null)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition text-left cursor-pointer"
                      >
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                          {item.label}
                        </span>
                        <span className="text-[10px] font-semibold text-zinc-400 font-sans tabular-nums">
                          {item.shortcut}
                        </span>
                      </button>
                    ))}
                </div>

                <div>
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    System Actions
                  </div>
                  {[
                    { label: "Create New Workspace Cluster", shortcut: "⌘N" },
                    { label: "Invite Collaborators", shortcut: "⌘I" },
                    { label: "Export Audit Log as CSV", shortcut: "⌘E" },
                  ]
                    .filter((item) =>
                      item.label.toLowerCase().includes(commandSearch.toLowerCase())
                    )
                    .map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setActiveOverlayId(null)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition text-left cursor-pointer"
                      >
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                          {item.label}
                        </span>
                        <span className="text-[10px] font-semibold text-zinc-400 font-sans tabular-nums">
                          {item.shortcut}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* V12: Scoped Record Quick-Switcher */}
          {activeOverlayId === "v12" && (
            <div
              className={`w-full max-w-[500px] bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-150 dark:border-white/10">
                <Folder className="w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Switch project or client..."
                  value={switcherSearch}
                  onChange={(e) => setSwitcherSearch(e.target.value)}
                  className="flex-1 text-xs bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
                />
              </div>

              <div className="p-2 space-y-1 text-xs">
                {[
                  { name: "ZeroLight Core UI Library", tag: "Active" },
                  { name: "Zerorapid Payments Gateway", tag: "Production" },
                  { name: "Cloud Telemetry Fleet", tag: "Staging" },
                ]
                  .filter((item) =>
                    item.name.toLowerCase().includes(switcherSearch.toLowerCase())
                  )
                  .map((item, idx) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setActiveOverlayId(null)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition text-left ${
                        idx === 0
                          ? "bg-zinc-100 dark:bg-white/10 font-bold"
                          : "hover:bg-zinc-50 dark:hover:bg-white/5 font-medium"
                      }`}
                    >
                      <span className="text-zinc-800 dark:text-zinc-200">{item.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-200 dark:bg-white/10 font-sans">
                        {item.tag}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* V13: Table Row Context Menu */}
          {activeOverlayId === "v13" && (
            <div
              className="w-full max-w-[280px] bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/10 rounded-xl shadow-2xl p-1.5 space-y-1 text-xs animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-2 py-1 text-[10px] font-bold uppercase text-zinc-400">
                Invoice Actions
              </div>
              <button
                type="button"
                onClick={() => setActiveOverlayId(null)}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-white/5 font-medium text-zinc-800 dark:text-zinc-200 flex justify-between"
              >
                <span>View Details</span>
                <span className="text-zinc-400 text-[10px]">↵</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveOverlayId(null)}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-white/5 font-medium text-zinc-800 dark:text-zinc-200 flex justify-between"
              >
                <span>Duplicate Invoice</span>
                <span className="text-zinc-400 text-[10px]">⌘D</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveOverlayId(null)}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-medium flex justify-between"
              >
                <span>Delete Invoice</span>
                <span className="text-rose-400 text-[10px]">⌫</span>
              </button>
            </div>
          )}

          {/* V14: Canvas Context Menu */}
          {activeOverlayId === "v14" && (
            <div
              className="w-full max-w-[280px] bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/10 rounded-xl shadow-2xl p-1.5 space-y-1 text-xs animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-2 py-1 text-[10px] font-bold uppercase text-zinc-400">
                Canvas Node
              </div>
              <button
                type="button"
                onClick={() => setActiveOverlayId(null)}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-white/5 font-medium text-zinc-800 dark:text-zinc-200 flex justify-between"
              >
                <span>Copy Node ID</span>
                <span className="text-zinc-400 text-[10px]">⌘C</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveOverlayId(null)}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-white/5 font-medium text-zinc-800 dark:text-zinc-200 flex justify-between"
              >
                <span>Lock in Position</span>
                <span className="text-zinc-400 text-[10px]">⌘L</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveOverlayId(null)}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-white/5 font-medium text-zinc-800 dark:text-zinc-200 flex justify-between"
              >
                <span>Export SVG</span>
                <span className="text-zinc-400 text-[10px]">⇧⌘E</span>
              </button>
            </div>
          )}

          {/* V15: 3-Step CSV Column Mapping Modal */}
          {activeOverlayId === "v15" && (
            <div
              className={`w-full ${sizeConfig.modalWidth} bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl ${sizeConfig.padding} space-y-4 animate-in zoom-in-95 duration-150`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-150 dark:border-white/10">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Import Customer Records
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-sans tabular-nums">Step {wizardStep} of 3</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveOverlayId(null)}
                  className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold">
                {["1. Upload", "2. Map Columns", "3. Confirm"].map((st, idx) => (
                  <div
                    key={st}
                    className={`pb-1 border-b-2 text-center ${
                      wizardStep >= idx + 1
                        ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
                        : "border-zinc-200 dark:border-white/10 text-zinc-400"
                    }`}
                  >
                    {st}
                  </div>
                ))}
              </div>

              <div className="py-2 text-xs space-y-2">
                {wizardStep === 1 && (
                  <div className="p-4 border border-dashed border-zinc-300 dark:border-white/20 rounded-xl text-center space-y-1">
                    <FileSpreadsheet className="w-6 h-6 mx-auto text-zinc-400" />
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200">customers_q4_export.csv</div>
                    <div className="text-[10px] text-zinc-400 font-sans tabular-nums">2,410 rows ready to parse</div>
                  </div>
                )}
                {wizardStep === 2 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-zinc-50 dark:bg-white/5">
                      <span className="text-zinc-500 font-sans">Full Name</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">→ legal_name</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-zinc-50 dark:bg-white/5">
                      <span className="text-zinc-500 font-sans">Billing Email</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">→ email_address</span>
                    </div>
                  </div>
                )}
                {wizardStep === 3 && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 space-y-1 text-center">
                    <CheckCircle2 className="w-5 h-5 mx-auto" />
                    <div className="font-semibold">Ready to import 2,410 records</div>
                    <div className="text-[10px] opacity-80">Zero schema conflicts detected</div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-150 dark:border-white/10">
                <button
                  type="button"
                  disabled={wizardStep === 1}
                  onClick={() => setWizardStep((s) => Math.max(1, s - 1))}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-500 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (wizardStep < 3) {
                      setWizardStep((s) => s + 1);
                    } else {
                      setActiveOverlayId(null);
                    }
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 transition shadow-xs"
                >
                  {wizardStep === 3 ? "Complete Import" : "Next Step"}
                </button>
              </div>
            </div>
          )}

          {/* V16: Welcome & Feature Walkthrough Onboarding Modal */}
          {activeOverlayId === "v16" && (
            <div
              className={`w-full ${sizeConfig.modalWidth} bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl ${sizeConfig.padding} space-y-4 animate-in zoom-in-95 duration-150 text-center`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-zinc-200 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {onboardingStep === 1 && "Welcome to ZeroLight SaaS"}
                  {onboardingStep === 2 && "Global Command Launching"}
                  {onboardingStep === 3 && "You're all set to build"}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {onboardingStep === 1 && "Streamlined monochrome components engineered for human-crafted interfaces."}
                  {onboardingStep === 2 && "Press ⌘K anywhere in the dashboard to invoke actions and switch records."}
                  {onboardingStep === 3 && "Start building scalable production enterprise applications effortlessly."}
                </p>
              </div>

              <div className="flex justify-center gap-1.5 py-1">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 rounded-full transition-all ${
                      onboardingStep === step
                        ? "w-6 bg-zinc-900 dark:bg-white"
                        : "w-2 bg-zinc-200 dark:bg-white/20"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-150 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveOverlayId(null)}
                  className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                >
                  Skip Tour
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onboardingStep < 3) {
                      setOnboardingStep((s) => s + 1);
                    } else {
                      setActiveOverlayId(null);
                    }
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 transition shadow-xs"
                >
                  {onboardingStep === 3 ? "Get Started" : "Continue"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          CODE MODAL
      ========================================================================= */}
      {activeCodeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
          onClick={() => setActiveCodeModal(null)}
        >
          <div
            className="w-full max-w-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-150 dark:border-white/10">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                TSX Implementation: {activeCodeModal.title}
              </h3>
              <button
                type="button"
                onClick={() => setActiveCodeModal(null)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-zinc-950 text-zinc-100 text-xs overflow-x-auto max-h-[360px] font-sans">
              <code>{activeCodeModal.code}</code>
            </pre>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-500">
                Level 3 Organism Component
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(activeCodeModal.code);
                  setCodeCopied(true);
                  setTimeout(() => setCodeCopied(false), 2000);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {codeCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy TSX</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
