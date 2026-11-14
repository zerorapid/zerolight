"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Save,
  Check,
  Copy,
  Plus,
  ArrowRight,
  Download,
  ExternalLink,
  ChevronDown,
  LayoutGrid,
  List,
  Columns,
  Star,
  Eye,
  EyeOff,
  RefreshCw,
  Upload,
  Trash2,
  X,
  Share2,
  Pin,
  ChevronLeft,
  Sparkles,
  Wand2,
  Zap,
  Search,
  Filter,
  Code2,
  FileSpreadsheet,
  FileText,
  UserPlus,
  Receipt,
  ShoppingCart,
  MoreHorizontal,
  Edit2,
  SlidersHorizontal,
} from "lucide-react";
import { useZeroLight } from "../context";
import { Kbd } from "../atoms/kbd";
import { Badge } from "../atoms/badge";

export type ButtonDensityTier = "28px" | "36px" | "42px" | "48px";
export type ButtonGlobalState = "ready" | "saving" | "saved" | "disabled";

export function SaaSButtonLibrary() {
  const { tokens, scaled } = useZeroLight();

  // Sticky Bar States
  const [searchQuery, setSearchQuery] = useState("");
  const [density, setDensity] = useState<ButtonDensityTier>("36px");
  const [globalState, setGlobalState] = useState<ButtonGlobalState>("ready");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);

  // Modal Code State
  const [activeCodeModal, setActiveCodeModal] = useState<{ title: string; code: string } | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Interactive Variant States
  const [splitSaveOpen, setSplitSaveOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [rowActionsOpen, setRowActionsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid" | "board">("grid");
  const [isStarred, setIsStarred] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [savingProgress, setSavingProgress] = useState<"idle" | "saving" | "saved">("idle");
  const [linkCopied, setLinkCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [deleteConfirmStep, setDeleteConfirmStep] = useState<"idle" | "confirm">("idle");
  const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Click outside to close custom popovers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-button-popover]")) {
        setStateDropdownOpen(false);
        setSplitSaveOpen(false);
        setExportOpen(false);
        setQuickAddOpen(false);
        setRowActionsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Compute CSS height based on active density tier
  const heightStyle = {
    height: density,
  };

  const categories = [
    { id: "all", label: "All (33)" },
    { id: "main", label: "1. Main Action Styles" },
    { id: "icons", label: "2. Icons & Shortcuts" },
    { id: "split", label: "3. Split & Menus" },
    { id: "toggle", label: "4. Toggle & Views" },
    { id: "loading", label: "5. Loading & Progress" },
    { id: "delete", label: "6. Safety & Delete" },
    { id: "tools", label: "7. Compact Tools" },
    { id: "ai", label: "8. Smart AI & Upgrade" },
  ];

  const handleCopyCode = () => {
    if (!activeCodeModal) return;
    navigator.clipboard?.writeText(activeCodeModal.code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleSaveProgressClick = () => {
    if (savingProgress !== "idle") return;
    setSavingProgress("saving");
    setTimeout(() => {
      setSavingProgress("saved");
      triggerToast("Record saved successfully");
      setTimeout(() => setSavingProgress("idle"), 2500);
    }, 1200);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText("https://zerolight.io/share/record_9481");
    setLinkCopied(true);
    triggerToast("Shareable link copied to clipboard");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleSyncRefresh = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      triggerToast("Telemetry data synced with edge cluster");
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0].name);
      triggerToast(`File selected: ${e.target.files[0].name}`);
    }
  };

  const handleDeleteClick = () => {
    if (deleteConfirmStep === "idle") {
      setDeleteConfirmStep("confirm");
      const t = setTimeout(() => {
        setDeleteConfirmStep("idle");
      }, 2500);
      setDeleteTimer(t);
    } else {
      if (deleteTimer) clearTimeout(deleteTimer);
      setDeleteConfirmStep("idle");
      triggerToast("Item permanently deleted from database");
    }
  };

  // Card Wrapper for consistent styling
  const Card = ({
    number,
    title,
    children,
    category,
    code,
  }: {
    number: string;
    title: string;
    children: React.ReactNode;
    category: string;
    code: string;
  }) => {
    // Filter matching
    if (activeCategory !== "all" && activeCategory !== category) return null;
    if (searchQuery.trim() && !title.toLowerCase().includes(searchQuery.toLowerCase())) return null;

    return (
      <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs flex flex-col justify-between gap-4 transition-all hover:border-zinc-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-sans tabular-nums font-bold text-zinc-400">{number}</span>
            <h4 className="text-xs font-bold text-zinc-900 tracking-tight">{title}</h4>
          </div>
          <button
            type="button"
            onClick={() => setActiveCodeModal({ title, code })}
            className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-zinc-950 px-2 py-1 rounded-lg hover:bg-zinc-100 transition cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
        </div>

        <div className="min-h-[52px] flex items-center justify-center relative w-full">{children}</div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-semibold shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── WORKSPACE CONTROL STRIP ── */}
      <div className="sticky top-0 z-30 -mx-6 px-6 py-2.5 bg-[#FAFAFA]/95 backdrop-blur-md border-b border-zinc-200/80">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Category Filter Pill Rail */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  activeCategory === c.id
                    ? "bg-zinc-950 text-white shadow-2xs"
                    : "bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/80"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Controls: Search, Density, State */}
          <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
            {/* Live Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search buttons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-zinc-950 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-950 w-36 sm:w-44"
              />
            </div>

            {/* 4 Density Tiers */}
            <div className="flex items-center bg-zinc-200/70 p-0.5 rounded-xl border border-zinc-300/40 font-sans tabular-nums">
              {(["28px", "36px", "42px", "48px"] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setDensity(tier)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    density === tier ? "bg-white text-zinc-950 shadow-2xs font-bold" : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            {/* Custom State Dropdown */}
            <div className="relative" data-button-popover>
              <button
                type="button"
                onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
                className="px-2.5 py-1.5 rounded-xl bg-white border border-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 hover:bg-zinc-50 transition cursor-pointer"
              >
                <span>State: <strong className="capitalize text-zinc-950">{globalState}</strong></span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {stateDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white border border-zinc-200 shadow-xl p-1 z-50 text-xs animate-in fade-in duration-150">
                  {(["ready", "saving", "saved", "disabled"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setGlobalState(s);
                        setStateDropdownOpen(false);
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left capitalize font-semibold cursor-pointer ${
                        globalState === s ? "bg-zinc-950 text-white" : "text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3-COLUMN RESPONSIVE BUTTON GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ========================================================================= */}
        {/* 1. MAIN ACTION STYLES (6 VARIANTS) */}
        {/* ========================================================================= */}
        <Card
          number="01"
          title="Main Solid Button"
          category="main"
          code={`<button className="px-5 rounded-xl bg-zinc-950 text-white font-semibold text-xs hover:bg-zinc-800 transition shadow-xs">\n  Save Changes\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            disabled={globalState === "disabled"}
            onClick={() => triggerToast("Main Action: Changes saved")}
            className="w-full sm:w-auto px-5 rounded-xl bg-zinc-950 text-white font-semibold text-xs hover:bg-zinc-800 transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {globalState === "saving" ? (
              <span>Saving...</span>
            ) : globalState === "saved" ? (
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Saved
              </span>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </Card>

        <Card
          number="02"
          title="Soft Secondary Button"
          category="main"
          code={`<button className="px-5 rounded-xl bg-zinc-100 text-zinc-900 font-semibold text-xs hover:bg-zinc-200 transition">\n  Save Draft\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            disabled={globalState === "disabled"}
            onClick={() => triggerToast("Secondary Action: Draft saved")}
            className="w-full sm:w-auto px-5 rounded-xl bg-zinc-100 text-zinc-900 font-semibold text-xs hover:bg-zinc-200 transition flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Draft
          </button>
        </Card>

        <Card
          number="03"
          title="Clean Border Button"
          category="main"
          code={`<button className="px-5 rounded-xl bg-white border border-zinc-200 text-zinc-900 font-semibold text-xs hover:bg-zinc-50 transition shadow-2xs">\n  Preview\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            disabled={globalState === "disabled"}
            onClick={() => triggerToast("Border Action: Opening preview")}
            className="w-full sm:w-auto px-5 rounded-xl bg-white border border-zinc-200 text-zinc-900 font-semibold text-xs hover:bg-zinc-50 transition shadow-2xs flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Preview
          </button>
        </Card>

        <Card
          number="04"
          title="Subtle Ghost Button"
          category="main"
          code={`<button className="px-4 rounded-xl text-zinc-600 font-semibold text-xs hover:text-zinc-950 hover:bg-zinc-100 transition">\n  Cancel\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            disabled={globalState === "disabled"}
            onClick={() => triggerToast("Ghost Action: Operation canceled")}
            className="w-full sm:w-auto px-4 rounded-xl text-zinc-600 font-semibold text-xs hover:text-zinc-950 hover:bg-zinc-100 transition flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </Card>

        <Card
          number="05"
          title="Rounded Pill Button"
          category="main"
          code={`<button className="px-6 rounded-full bg-zinc-950 text-white font-semibold text-xs hover:bg-zinc-800 transition shadow-xs">\n  Publish Live\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            disabled={globalState === "disabled"}
            onClick={() => triggerToast("Pill Action: Project published live")}
            className="w-full sm:w-auto px-6 rounded-full bg-zinc-950 text-white font-semibold text-xs hover:bg-zinc-800 transition shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Publish Live
          </button>
        </Card>

        <Card
          number="06"
          title="Full-Width Card Button"
          category="main"
          code={`<button className="w-full rounded-xl bg-zinc-950 text-white font-semibold text-xs hover:bg-zinc-800 transition shadow-xs">\n  Continue to Next Step\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            disabled={globalState === "disabled"}
            onClick={() => triggerToast("Full-Width CTA: Navigating to step 2")}
            className="w-full px-4 rounded-xl bg-zinc-950 text-white font-semibold text-xs hover:bg-zinc-800 transition shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Next Step
          </button>
        </Card>

        {/* ========================================================================= */}
        {/* 2. BUTTONS WITH ICONS & SHORTCUTS (6 VARIANTS) */}
        {/* ========================================================================= */}
        <Card
          number="07"
          title="Create Button with Plus"
          category="icons"
          code={`<button className="px-4 rounded-xl bg-zinc-950 text-white font-semibold text-xs flex items-center gap-2 hover:bg-zinc-800 transition shadow-xs">\n  <Plus className="w-4 h-4" />\n  <span>New Project</span>\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            disabled={globalState === "disabled"}
            onClick={() => triggerToast("Create Action: Initializing new project")}
            className="w-full sm:w-auto px-4 rounded-xl bg-zinc-950 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 transition shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </Card>

        <Card
          number="08"
          title="Next Step Button with Arrow"
          category="icons"
          code={`<button className="px-4 rounded-xl bg-zinc-950 text-white font-semibold text-xs flex items-center gap-2 hover:bg-zinc-800 transition shadow-xs">\n  <span>Next Step</span>\n  <ArrowRight className="w-4 h-4" />\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            disabled={globalState === "disabled"}
            onClick={() => triggerToast("Next Action: Advancing workflow")}
            className="w-full sm:w-auto px-4 rounded-xl bg-zinc-950 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 transition shadow-xs cursor-pointer disabled:opacity-50"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Card>

        <Card
          number="09"
          title="Keyboard Shortcut Button"
          category="icons"
          code={`<button className="px-3.5 rounded-xl bg-white border border-zinc-200 text-zinc-900 font-semibold text-xs flex items-center gap-2.5 hover:bg-zinc-50 transition shadow-2xs">\n  <span>Save Record</span>\n  <Kbd>⌘S</Kbd>\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            disabled={globalState === "disabled"}
            onClick={() => triggerToast("Shortcut Action: Saved via ⌘S")}
            className="w-full sm:w-auto px-3.5 rounded-xl bg-white border border-zinc-200 text-zinc-900 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-zinc-50 transition shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <span>Save</span>
            <Kbd>⌘S</Kbd>
          </button>
        </Card>

        <Card
          number="10"
          title="Counter Badge Button"
          category="icons"
          code={`<button className="px-3.5 rounded-xl bg-zinc-100 text-zinc-900 font-semibold text-xs flex items-center gap-2 hover:bg-zinc-200 transition">\n  <span>Selected</span>\n  <span className="px-1.5 py-0.2 rounded-md bg-zinc-950 text-white text-[10px] font-sans tabular-nums">12</span>\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            disabled={globalState === "disabled"}
            onClick={() => triggerToast("Badge Action: 12 items batch selected")}
            className="w-full sm:w-auto px-3.5 rounded-xl bg-zinc-100 text-zinc-900 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition cursor-pointer disabled:opacity-50"
          >
            <span>Selected</span>
            <span className="px-1.5 py-0.5 rounded-md bg-zinc-950 text-white text-[10px] font-sans tabular-nums font-bold">
              12
            </span>
          </button>
        </Card>

        <Card
          number="11"
          title="Download Report Button"
          category="icons"
          code={`<button className="px-4 rounded-xl bg-white border border-zinc-200 text-zinc-900 font-semibold text-xs flex items-center gap-2 hover:bg-zinc-50 transition shadow-2xs">\n  <Download className="w-3.5 h-3.5 text-zinc-600" />\n  <span>Download PDF</span>\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            disabled={globalState === "disabled"}
            onClick={() => triggerToast("Download Action: Generating PDF summary")}
            className="w-full sm:w-auto px-4 rounded-xl bg-white border border-zinc-200 text-zinc-900 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-zinc-50 transition shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-zinc-600" />
            <span>Download PDF</span>
          </button>
        </Card>

        <Card
          number="12"
          title="External Link Button"
          category="icons"
          code={`<button className="px-4 rounded-xl bg-white border border-zinc-200 text-zinc-900 font-semibold text-xs flex items-center gap-1.5 hover:bg-zinc-50 transition shadow-2xs">\n  <span>Open Live Page</span>\n  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            disabled={globalState === "disabled"}
            onClick={() => triggerToast("External Link: Navigating to external origin")}
            className="w-full sm:w-auto px-4 rounded-xl bg-white border border-zinc-200 text-zinc-900 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-zinc-50 transition shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <span>Open Live Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </Card>

        {/* ========================================================================= */}
        {/* 3. SPLIT & CUSTOM MENU BUTTONS (4 VARIANTS) */}
        {/* ========================================================================= */}
        <Card
          number="13"
          title="Split Save Button"
          category="split"
          code={`<div className="inline-flex rounded-xl shadow-xs bg-zinc-950 text-white text-xs font-semibold">\n  <button className="px-4 py-2 border-r border-white/10 hover:bg-zinc-800">Save</button>\n  <button className="px-2 hover:bg-zinc-800">▾</button>\n</div>`}
        >
          <div className="relative inline-flex rounded-xl shadow-xs" data-button-popover>
            <button
              type="button"
              style={heightStyle}
              onClick={() => triggerToast("Split Action: Primary save executed")}
              className="px-4 rounded-l-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition border-r border-white/10 flex items-center cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              style={heightStyle}
              onClick={() => setSplitSaveOpen(!splitSaveOpen)}
              className="px-2.5 rounded-r-xl bg-zinc-950 text-white hover:bg-zinc-800 transition flex items-center cursor-pointer"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {splitSaveOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-44 rounded-xl bg-white border border-zinc-200 shadow-xl p-1 z-50 text-xs animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => {
                    triggerToast("Saved & closed");
                    setSplitSaveOpen(false);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-zinc-700 hover:bg-zinc-100 font-medium cursor-pointer"
                >
                  Save & Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerToast("Saved as reusable template");
                    setSplitSaveOpen(false);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-zinc-700 hover:bg-zinc-100 font-medium cursor-pointer"
                >
                  Save as Template
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerToast("Saved & shared link copied");
                    setSplitSaveOpen(false);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-zinc-700 hover:bg-zinc-100 font-medium cursor-pointer"
                >
                  Save & Share Link
                </button>
              </div>
            )}
          </div>
        </Card>

        <Card
          number="14"
          title="Export Options Menu"
          category="split"
          code={`<button className="px-4 rounded-xl bg-white border border-zinc-200 text-zinc-900 font-semibold text-xs flex items-center gap-1.5">\n  <span>Export</span>\n  <ChevronDown className="w-3.5 h-3.5" />\n</button>`}
        >
          <div className="relative" data-button-popover>
            <button
              type="button"
              style={heightStyle}
              onClick={() => setExportOpen(!exportOpen)}
              className="px-4 rounded-xl bg-white border border-zinc-200 text-zinc-900 font-semibold text-xs flex items-center gap-2 hover:bg-zinc-50 transition shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-zinc-500" />
              <span>Export</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {exportOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-48 rounded-xl bg-white border border-zinc-200 shadow-xl p-1 z-50 text-xs animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => {
                    triggerToast("Exporting to Microsoft Excel (.xlsx)");
                    setExportOpen(false);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-zinc-700 hover:bg-zinc-100 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Excel Spreadsheet</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerToast("Exporting to PDF Document");
                    setExportOpen(false);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-zinc-700 hover:bg-zinc-100 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-600" />
                  <span>PDF Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerToast("Shareable snapshot link copied");
                    setExportOpen(false);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-zinc-700 hover:bg-zinc-100 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Copy Share Link</span>
                </button>
              </div>
            )}
          </div>
        </Card>

        <Card
          number="15"
          title="Quick Add Menu Button"
          category="split"
          code={`<button className="px-4 rounded-full bg-zinc-950 text-white font-semibold text-xs flex items-center gap-1.5">\n  <Plus className="w-3.5 h-3.5" />\n  <span>Create</span>\n  <ChevronDown className="w-3.5 h-3.5" />\n</button>`}
        >
          <div className="relative" data-button-popover>
            <button
              type="button"
              style={heightStyle}
              onClick={() => setQuickAddOpen(!quickAddOpen)}
              className="px-4 rounded-full bg-zinc-950 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-zinc-800 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {quickAddOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-40 rounded-xl bg-white border border-zinc-200 shadow-xl p-1 z-50 text-xs animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => {
                    triggerToast("New invoice modal opened");
                    setQuickAddOpen(false);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-zinc-700 hover:bg-zinc-100 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5 text-zinc-600" />
                  <span>New Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerToast("New client modal opened");
                    setQuickAddOpen(false);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-zinc-700 hover:bg-zinc-100 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-zinc-600" />
                  <span>New Client</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerToast("New order draft created");
                    setQuickAddOpen(false);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-zinc-700 hover:bg-zinc-100 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-zinc-600" />
                  <span>New Order</span>
                </button>
              </div>
            )}
          </div>
        </Card>

        <Card
          number="16"
          title="Row More Actions Button"
          category="split"
          code={`<button className="w-9 h-9 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-100">\n  <MoreHorizontal className="w-4 h-4" />\n</button>`}
        >
          <div className="relative" data-button-popover>
            <button
              type="button"
              style={{ width: density, height: density }}
              onClick={() => setRowActionsOpen(!rowActionsOpen)}
              className="rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 flex items-center justify-center transition shadow-2xs cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {rowActionsOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-36 rounded-xl bg-white border border-zinc-200 shadow-xl p-1 z-50 text-xs animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => {
                    triggerToast("Editing record details");
                    setRowActionsOpen(false);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-zinc-700 hover:bg-zinc-100 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Edit Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerToast("Row duplicated");
                    setRowActionsOpen(false);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-zinc-700 hover:bg-zinc-100 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Duplicate</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerToast("Item archived");
                    setRowActionsOpen(false);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Archive</span>
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 4. TOGGLE, SWITCH & VIEW BUTTONS (4 VARIANTS) */}
        {/* ========================================================================= */}
        <Card
          number="17"
          title="List / Grid / Board View"
          category="toggle"
          code={`<div className="inline-flex rounded-xl bg-zinc-100 p-1 border border-zinc-200/60">\n  <button className="px-2.5 py-1 rounded-lg bg-white shadow-2xs">Grid</button>\n</div>`}
        >
          <div className="inline-flex rounded-xl bg-zinc-100 p-1 border border-zinc-200/60 items-center">
            {(["list", "grid", "board"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === mode
                    ? "bg-white text-zinc-950 shadow-2xs font-bold"
                    : "text-zinc-500 hover:text-zinc-950"
                }`}
              >
                {mode === "list" && <List className="w-3.5 h-3.5" />}
                {mode === "grid" && <LayoutGrid className="w-3.5 h-3.5" />}
                {mode === "board" && <Columns className="w-3.5 h-3.5" />}
                <span>{mode}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card
          number="18"
          title="Star / Favorite Toggle"
          category="toggle"
          code={`<button className="px-4 rounded-xl border border-zinc-200 flex items-center gap-2">\n  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />\n  <span>Favorite</span>\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            onClick={() => {
              setIsStarred(!isStarred);
              triggerToast(!isStarred ? "Added to favorites" : "Removed from favorites");
            }}
            className={`px-4 rounded-xl border text-xs font-semibold flex items-center gap-2 transition shadow-2xs cursor-pointer ${
              isStarred
                ? "bg-amber-50/70 border-amber-300 text-amber-900"
                : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 transition-colors ${
                isStarred ? "fill-amber-400 text-amber-500" : "text-zinc-400"
              }`}
            />
            <span>{isStarred ? "Starred" : "Favorite"}</span>
          </button>
        </Card>

        <Card
          number="19"
          title="Filter Toggle with Active Dot"
          category="toggle"
          code={`<button className="px-4 rounded-xl border border-zinc-200 flex items-center gap-2">\n  <span className="w-2 h-2 rounded-full bg-emerald-500" />\n  <span>Filter Active</span>\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            onClick={() => {
              setIsFilterActive(!isFilterActive);
              triggerToast(isFilterActive ? "Filters cleared" : "Filters engaged");
            }}
            className={`px-4 rounded-xl border text-xs font-semibold flex items-center gap-2 transition shadow-2xs cursor-pointer ${
              isFilterActive
                ? "bg-white border-zinc-950 text-zinc-950"
                : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50"
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <span>Filters</span>
            {isFilterActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          </button>
        </Card>

        <Card
          number="20"
          title="Show / Hide Details Button"
          category="toggle"
          code={`<button className="px-4 rounded-xl text-zinc-600 font-semibold text-xs flex items-center gap-1.5 hover:text-zinc-950">\n  <span>{showDetails ? "Show Less" : "Show More"}</span>\n  <ChevronDown className="w-3.5 h-3.5" />\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-zinc-100 transition cursor-pointer"
          >
            <span>{showDetails ? "Show Less" : "Show More"}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${showDetails ? "rotate-180" : ""}`} />
          </button>
        </Card>

        {/* ========================================================================= */}
        {/* 5. LOADING, COPY & PROGRESS BUTTONS (4 VARIANTS) */}
        {/* ========================================================================= */}
        <Card
          number="21"
          title="Click-to-Save Progress"
          category="loading"
          code={`<button onClick={handleSave} className="px-5 rounded-xl bg-zinc-950 text-white font-semibold text-xs flex items-center gap-2">\n  {savingProgress === "saving" && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}\n  {savingProgress === "saved" && <Check className="w-3.5 h-3.5" />}\n  <span>{savingProgress === "saving" ? "Saving..." : savingProgress === "saved" ? "Saved" : "Save Record"}</span>\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            onClick={handleSaveProgressClick}
            className={`px-5 rounded-xl font-semibold text-xs flex items-center gap-2 transition shadow-xs cursor-pointer ${
              savingProgress === "saved"
                ? "bg-emerald-600 text-white"
                : "bg-zinc-950 text-white hover:bg-zinc-800"
            }`}
          >
            {savingProgress === "saving" && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            {savingProgress === "saved" && <Check className="w-3.5 h-3.5" />}
            <span>
              {savingProgress === "saving" ? "Saving..." : savingProgress === "saved" ? "Saved" : "Save Record"}
            </span>
          </button>
        </Card>

        <Card
          number="22"
          title="One-Click Copy Link"
          category="loading"
          code={`<button onClick={handleCopy} className="px-4 rounded-xl border border-zinc-200 text-xs font-semibold flex items-center gap-2">\n  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}\n  <span>{copied ? "Copied" : "Copy Link"}</span>\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            onClick={handleCopyLink}
            className="px-4 rounded-xl bg-white border border-zinc-200 text-zinc-900 font-semibold text-xs flex items-center gap-2 hover:bg-zinc-50 transition shadow-2xs cursor-pointer"
          >
            {linkCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
            <span>{linkCopied ? "Copied" : "Copy Link"}</span>
          </button>
        </Card>

        <Card
          number="23"
          title="Sync / Refresh Button"
          category="loading"
          code={`<button onClick={handleSync} className="px-4 rounded-xl bg-zinc-100 text-zinc-900 font-semibold text-xs flex items-center gap-2">\n  <RefreshCw className={isSyncing ? "animate-spin" : ""} />\n  <span>Sync Telemetry</span>\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            onClick={handleSyncRefresh}
            className="px-4 rounded-xl bg-zinc-100 text-zinc-900 font-semibold text-xs flex items-center gap-2 hover:bg-zinc-200 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-zinc-600 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Sync Telemetry"}</span>
          </button>
        </Card>

        <Card
          number="24"
          title="Upload File Button"
          category="loading"
          code={`<button onClick={() => fileRef.current?.click()} className="px-4 rounded-xl border border-zinc-200 flex items-center gap-2">\n  <Upload className="w-3.5 h-3.5" />\n  <span>{file ? file.name : "Upload File"}</span>\n</button>`}
        >
          <div>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <button
              type="button"
              style={heightStyle}
              onClick={() => fileInputRef.current?.click()}
              className="px-4 rounded-xl bg-white border border-zinc-200 text-zinc-900 font-semibold text-xs flex items-center gap-2 hover:bg-zinc-50 transition shadow-2xs cursor-pointer max-w-[220px]"
            >
              <Upload className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="truncate">{uploadedFile || "Upload File"}</span>
            </button>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 6. DELETE & SAFETY CONFIRM BUTTONS (3 VARIANTS) */}
        {/* ========================================================================= */}
        <Card
          number="25"
          title="Two-Click Delete Confirm"
          category="delete"
          code={`<button onClick={handleDelete} className="px-4 rounded-xl text-xs font-semibold transition">\n  {step === "confirm" ? "Click Again to Delete" : "Delete Item"}\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            onClick={handleDeleteClick}
            className={`px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              deleteConfirmStep === "confirm"
                ? "bg-rose-600 text-white animate-pulse shadow-md"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{deleteConfirmStep === "confirm" ? "Click Again to Delete" : "Delete Item"}</span>
          </button>
        </Card>

        <Card
          number="26"
          title="Solid Remove Button"
          category="delete"
          code={`<button className="px-4 rounded-xl bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 shadow-xs">\n  Remove Access\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            onClick={() => triggerToast("User access removed")}
            className="px-4 rounded-xl bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Remove Access</span>
          </button>
        </Card>

        <Card
          number="27"
          title="Reset Changes Button"
          category="delete"
          code={`<button className="px-4 rounded-xl text-zinc-600 hover:text-rose-600 text-xs font-semibold">\n  Reset All\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            onClick={() => triggerToast("All draft fields reset to default")}
            className="px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        </Card>

        {/* ========================================================================= */}
        {/* 7. COMPACT TOOL BUTTONS (3 VARIANTS) */}
        {/* ========================================================================= */}
        <Card
          number="28"
          title="Toolbar Action Strip"
          category="tools"
          code={`<div className="inline-flex rounded-xl border border-zinc-200 bg-white shadow-2xs divide-x divide-zinc-200">\n  <button className="p-2 hover:bg-zinc-50"><Edit2 className="w-3.5 h-3.5" /></button>\n</div>`}
        >
          <div className="inline-flex rounded-xl border border-zinc-200 bg-white shadow-2xs divide-x divide-zinc-200 overflow-hidden">
            <button
              type="button"
              style={{ width: density, height: density }}
              onClick={() => triggerToast("Toolbar: Edit action")}
              className="flex items-center justify-center text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition cursor-pointer"
              title="Edit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              style={{ width: density, height: density }}
              onClick={() => triggerToast("Toolbar: Duplicate action")}
              className="flex items-center justify-center text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition cursor-pointer"
              title="Duplicate"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              style={{ width: density, height: density }}
              onClick={() => triggerToast("Toolbar: Share action")}
              className="flex items-center justify-center text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition cursor-pointer"
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              style={{ width: density, height: density }}
              onClick={() => triggerToast("Toolbar: Pin action")}
              className="flex items-center justify-center text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition cursor-pointer"
              title="Pin"
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>

        <Card
          number="29"
          title="Floating Plus Circle Button"
          category="tools"
          code={`<button className="w-10 h-10 rounded-full bg-zinc-950 text-white flex items-center justify-center shadow-lg hover:bg-zinc-800">\n  <Plus className="w-5 h-5" />\n</button>`}
        >
          <button
            type="button"
            style={{ width: density, height: density }}
            onClick={() => triggerToast("FAB: Quick action executed")}
            className="rounded-full bg-zinc-950 text-white flex items-center justify-center shadow-md hover:bg-zinc-800 transition cursor-pointer"
            title="Create Item"
          >
            <Plus className="w-4 h-4" />
          </button>
        </Card>

        <Card
          number="30"
          title="Previous / Next Pager"
          category="tools"
          code={`<div className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white p-1 text-xs font-semibold">\n  <button className="p-1.5 hover:bg-zinc-100">‹</button>\n  <span>Page 1 of 8</span>\n  <button className="p-1.5 hover:bg-zinc-100">›</button>\n</div>`}
        >
          <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-2 py-1 shadow-2xs text-xs font-sans tabular-nums text-zinc-700">
            <button
              type="button"
              onClick={() => triggerToast("Pager: Previous page")}
              className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-semibold text-zinc-900">Page 1 of 8</span>
            <button
              type="button"
              onClick={() => triggerToast("Pager: Next page")}
              className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 8. SMART AI & UPGRADE BUTTONS (3 VARIANTS) */}
        {/* ========================================================================= */}
        <Card
          number="31"
          title="Auto-Build with AI Button"
          category="ai"
          code={`<button className="px-4 rounded-xl bg-gradient-to-r from-zinc-950 to-zinc-800 text-white font-semibold text-xs flex items-center gap-2 shadow-xs">\n  <Sparkles className="w-3.5 h-3.5 text-amber-400" />\n  <span>Auto-Build Screen</span>\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            onClick={() => triggerToast("AI Agent: Synthesizing requested layout")}
            className="px-4 rounded-xl bg-zinc-950 text-white font-semibold text-xs flex items-center gap-2 hover:bg-zinc-800 transition shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Auto-Build Screen</span>
          </button>
        </Card>

        <Card
          number="32"
          title="Clean Up Text Button"
          category="ai"
          code={`<button className="px-4 rounded-xl bg-white border border-zinc-200 text-zinc-900 font-semibold text-xs flex items-center gap-2 hover:bg-zinc-50 shadow-2xs">\n  <Wand2 className="w-3.5 h-3.5 text-indigo-600" />\n  <span>Polish Text</span>\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            onClick={() => triggerToast("AI Polish: Grammar and tone optimized")}
            className="px-4 rounded-xl bg-white border border-zinc-200 text-zinc-900 font-semibold text-xs flex items-center gap-2 hover:bg-zinc-50 transition shadow-2xs cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Polish Text</span>
          </button>
        </Card>

        <Card
          number="33"
          title="Upgrade Plan Pill Button"
          category="ai"
          code={`<button className="px-5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs">\n  <Zap className="w-3.5 h-3.5 fill-white" />\n  <span>Upgrade to Pro</span>\n</button>`}
        >
          <button
            type="button"
            style={heightStyle}
            onClick={() => triggerToast("Billing: Redirecting to enterprise checkout")}
            className="px-5 rounded-full bg-zinc-950 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-zinc-800 transition shadow-xs cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Upgrade to Pro</span>
          </button>
        </Card>
      </div>

      {/* ── CODE MODAL ── */}
      {activeCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-950 border border-white/10 text-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {activeCodeModal.title} TSX Snippet
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCodeModal(null)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-black/50 border border-white/10 font-sans tabular-nums text-xs text-zinc-300 overflow-x-auto leading-relaxed">
              <code>{activeCodeModal.code}</code>
            </pre>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveCodeModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-4 py-2 rounded-xl bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{codeCopied ? "Copied" : "Copy TSX Code"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
