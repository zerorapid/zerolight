"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Plus,
  Trash2,
  Search,
  ArrowRight,
  ChevronDown,
  Copy,
  Shield,
  Sparkles,
  RefreshCw,
  X,
  SlidersHorizontal,
  Settings,
  AlertCircle,
  Eye,
  Key,
  Clock,
  Terminal,
  Zap,
  Info,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Type,
  Minus,
  Code2,
  ExternalLink,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  Inbox,
  Mail,
  MoreHorizontal,
  FileText,
  Download,
  EyeOff,
  Layers,
  Compass,
  BarChart2,
  Command,
} from "lucide-react";
import {
  ZeroLightTokens,
  DEFAULT_TOKENS,
  CornerRadiusPreset,
  HeightDensityPreset,
  MenuOffsetPreset,
  MotionPhysicsPreset,
  computeScaledTokens,
} from "./types";

const ROLE_OPTIONS = [
  "Administrator",
  "Product Designer",
  "Software Engineer",
  "Billing Manager",
  "Operations Lead",
];

const TAG_OPTIONS = [
  "Design System",
  "Frontend",
  "Backend",
  "Infrastructure",
  "Security",
  "Analytics",
];

export function ZeroLightStudio({ initialTier = "atoms" }: { initialTier?: "atoms" | "molecules" }) {
  const [tokens, setTokens] = useState<ZeroLightTokens>(DEFAULT_TOKENS);
  const [activeTier, setActiveTier] = useState<"atoms" | "molecules">(initialTier);

  // Form input interactive state
  const [textInput, setTextInput] = useState<string>("sarah.connor@acme.inc");
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [textareaValue, setTextareaValue] = useState<string>(
    "ZeroLight provides rapid PoC design system atoms built for modern B2B SaaS micro-actions."
  );

  // Molecule: Search Select state
  const [role, setRole] = useState<string>("Product Designer");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [isRoleOpen, setIsRoleOpen] = useState<boolean>(false);
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Molecule: Tag Deck state
  const [tags, setTags] = useState<string[]>([
    "Design System",
    "Frontend",
    "Security",
  ]);
  const [tagFilter, setTagFilter] = useState<string>("");
  const [isTagOpen, setIsTagOpen] = useState<boolean>(false);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  // Molecule: Input Group state
  const [apiKey, setApiKey] = useState<string>("zl_live_8f93e2b17a");
  const [isApiKeyCopied, setIsApiKeyCopied] = useState<boolean>(false);

  // Molecule: Segmented Control state
  const [segmentValue, setSegmentValue] = useState<"monthly" | "quarterly" | "annual">("quarterly");

  // Atom interactive states
  const [radioValue, setRadioValue] = useState<"standard" | "pro">("pro");
  const [checkboxValue, setCheckboxValue] = useState<boolean>(true);
  const [triCheckboxState, setTriCheckboxState] = useState<"unchecked" | "indeterminate" | "checked">("indeterminate");
  const [switchValue, setSwitchValue] = useState<boolean>(true);
  const [sliderValue, setSliderValue] = useState<number>(64);
  const [progressValue, setProgressValue] = useState<number>(72);
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
  const [activeIconStroke, setActiveIconStroke] = useState<1.5 | 2.0 | 2.5>(2.0);

  // New Molecules State
  // 1. DateRangePicker
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [datePreset, setDatePreset] = useState<"7d" | "30d" | "quarter" | "custom">("30d");
  const [dateRangeString, setDateRangeString] = useState<string>("Oct 08, 2026 – Nov 06, 2026");
  const datePickerRef = useRef<HTMLDivElement>(null);

  // 2. AlertCallout
  const [alertVariant, setAlertVariant] = useState<"info" | "warning" | "success" | "critical">("warning");
  const [isAlertDismissed, setIsAlertDismissed] = useState<boolean>(false);

  // 3. EmptyStateCard
  const [emptySearchTerm, setEmptySearchTerm] = useState<string>("quantum-cache-v4");

  // 4. PaginationBar
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState<boolean>(false);
  const pageSizeRef = useRef<HTMLDivElement>(null);

  // FormField & SearchBar Enterprise States
  const [isEmailError, setIsEmailError] = useState<boolean>(false);
  const [searchBarQuery, setSearchBarQuery] = useState<string>("cluster-node-us-east-1");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isApiKeyMasked, setIsApiKeyMasked] = useState<boolean>(true);

  // Category Filtering & Breadcrumbs States
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<"all" | "cat1" | "cat2" | "cat3" | "cat4">("all");
  const [isBreadcrumbMenuOpen, setIsBreadcrumbMenuOpen] = useState<boolean>(false);
  const breadcrumbMenuRef = useRef<HTMLDivElement>(null);

  // MetricStat & DataTableRow Enterprise States
  const [metricHorizon, setMetricHorizon] = useState<"24h" | "7d" | "30d" | "1y">("30d");
  const [hoveredSparkPoint, setHoveredSparkPoint] = useState<number | null>(null);
  const [selectedTableRows, setSelectedTableRows] = useState<string[]>(["INV-2627-101"]);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [isRowActionsOpen, setIsRowActionsOpen] = useState<boolean>(false);
  const rowActionsRef = useRef<HTMLDivElement>(null);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Token Export modal state
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<"tailwind" | "css" | "json">("tailwind");
  const [isExportCopied, setIsExportCopied] = useState<boolean>(false);

  const getExportSnippet = (format: "tailwind" | "css" | "json", t: ZeroLightTokens) => {
    if (format === "tailwind") {
      return `// tailwind.config.js snippet
module.exports = {
  theme: {
    extend: {
      colors: {
        zl: {
          border: '${t.universalBorderColor}',
          fill: '${t.universalFillColor}',
          text: '${t.textIconColor}',
          primary: '${t.primaryButtonColor}',
          hover: '${t.hoverBackplateTint}',
        },
      },
      borderRadius: {
        zl: '${t.cornerRadius === 999 ? "9999px" : `${t.cornerRadius}px`}',
        'zl-inner': '${t.cornerRadius === 999 ? "9999px" : `${Math.max(0, t.cornerRadius - 4)}px`}',
      },
      borderWidth: {
        zl: '${t.borderWidth}px',
      },
      height: {
        zl: '${t.heightDensity}px',
      },
    },
  },
};`;
    }
    if (format === "css") {
      return `/* ZeroLight Universal Design Tokens */
:root {
  --zl-border-color: ${t.universalBorderColor};
  --zl-fill-color: ${t.universalFillColor};
  --zl-text-color: ${t.textIconColor};
  --zl-primary-action: ${t.primaryButtonColor};
  --zl-hover-tint: ${t.hoverBackplateTint};
  --zl-border-width: ${t.borderWidth}px;
  --zl-corner-radius: ${t.cornerRadius === 999 ? "9999px" : `${t.cornerRadius}px`};
  --zl-inner-radius: ${t.cornerRadius === 999 ? "9999px" : `${Math.max(0, t.cornerRadius - 4)}px`};
  --zl-height-density: ${t.heightDensity}px;
  --zl-menu-gap: ${t.menuOffsetGap}px;
  --zl-base-font-size: ${t.fontSize}px;
  --zl-scale-factor: ${t.scaleMultiplier};
}`;
    }
    return JSON.stringify(
      {
        scaleMultiplier: t.scaleMultiplier,
        universalBorderColor: t.universalBorderColor,
        universalFillColor: t.universalFillColor,
        textIconColor: t.textIconColor,
        primaryButtonColor: t.primaryButtonColor,
        hoverBackplateTint: t.hoverBackplateTint,
        borderWidth: t.borderWidth,
        cornerRadius: t.cornerRadius,
        heightDensity: t.heightDensity,
        menuOffsetGap: t.menuOffsetGap,
        fontSize: t.fontSize,
        motionPhysics: t.motionPhysics,
      },
      null,
      2
    );
  };

  // Memory leak protection: references for active timers
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerToast = useCallback((msg: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2200);
  }, []);

  const handleCopyApiKey = useCallback(() => {
    if (copyTimerRef.current) {
      clearTimeout(copyTimerRef.current);
    }
    navigator.clipboard.writeText(apiKey);
    setIsApiKeyCopied(true);
    triggerToast("API Key copied to clipboard");
    copyTimerRef.current = setTimeout(() => {
      setIsApiKeyCopied(false);
      copyTimerRef.current = null;
    }, 1800);
  }, [apiKey, triggerToast]);

  // Clean up all timer references on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  // Outside click & Escape dismiss listeners with robust cleanup
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setIsRoleOpen(false);
      }
      if (tagRef.current && !tagRef.current.contains(e.target as Node)) {
        setIsTagOpen(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setIsDatePickerOpen(false);
      }
      if (pageSizeRef.current && !pageSizeRef.current.contains(e.target as Node)) {
        setIsPageSizeOpen(false);
      }
      if (rowActionsRef.current && !rowActionsRef.current.contains(e.target as Node)) {
        setIsRowActionsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (breadcrumbMenuRef.current && !breadcrumbMenuRef.current.contains(e.target as Node)) {
        setIsBreadcrumbMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsRoleOpen(false);
        setIsTagOpen(false);
        setIsDatePickerOpen(false);
        setIsPageSizeOpen(false);
        setIsRowActionsOpen(false);
        setIsSearchFocused(false);
        setIsBreadcrumbMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleResetDefaults = () => {
    setTokens(DEFAULT_TOKENS);
    triggerToast("Restored default tokens");
  };

  const handleToggleTag = (t: string) => {
    setTags((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const handleRemoveTag = (t: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTags((prev) => prev.filter((item) => item !== t));
  };

  const filteredRoles = ROLE_OPTIONS.filter((opt) =>
    opt.toLowerCase().includes(roleFilter.toLowerCase())
  );

  const filteredTags = TAG_OPTIONS.filter((opt) =>
    opt.toLowerCase().includes(tagFilter.toLowerCase())
  );

  // Scaled tokens dynamically recomputed for visual accuracy
  const scaled = computeScaledTokens(tokens);

  const cardStyle: React.CSSProperties = {
    backgroundColor: tokens.universalFillColor,
    borderColor: tokens.universalBorderColor,
    borderWidth: `${tokens.borderWidth}px`,
    borderRadius: `${scaled.scaledCardRadius}px`,
    boxShadow: scaled.cardShadow,
    transition: scaled.transitionStyle,
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] flex flex-col font-sans selection:bg-neutral-200">
      {/* Toast Notification with Framer Motion spring enter/exit */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            style={{
              borderRadius: `${scaled.scaledRadius === 0 ? 0 : Math.max(6, scaled.scaledRadius)}px`,
            }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#111111] text-white text-xs font-medium px-4 py-2 shadow-xl flex items-center gap-2 border border-neutral-800"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2.5} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3-Column Studio Body */}
      <div className="flex-1 flex w-full">
        {/* ══════════════════════════════════════════════════════════
            COLUMN 1: LEFT SIDEBAR (CLEAN CATEGORICAL HIERARCHY)
           ══════════════════════════════════════════════════════════ */}
        <aside className="w-64 border-r border-[#EBEBEB] bg-[#FFFFFF] p-5 hidden lg:flex flex-col justify-between select-none sticky top-0 h-screen overflow-y-auto">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div
                style={{
                  backgroundColor: tokens.primaryButtonColor,
                  borderRadius: `${scaled.scaledRadius === 0 ? 0 : 8}px`,
                }}
                className="w-6 h-6 flex items-center justify-center font-bold text-xs text-white"
              >
                ZL
              </div>
              <span className="font-semibold text-sm tracking-tight text-[#111111]">
                ZeroLight
              </span>
            </Link>

            {/* View Switcher: Atoms vs Molecules */}
            <div
              style={{
                borderRadius: `${scaled.scaledRadius === 0 ? 0 : 12}px`,
              }}
              className="p-1 bg-neutral-100 flex items-center gap-1 text-xs"
            >
              <button
                type="button"
                onClick={() => setActiveTier("atoms")}
                style={{
                  borderRadius: `${scaled.scaledRadius === 0 ? 0 : 8}px`,
                  backgroundColor: activeTier === "atoms" ? tokens.primaryButtonColor : "transparent",
                  color: activeTier === "atoms" ? "#FFFFFF" : undefined,
                }}
                className={`flex-1 py-1.5 font-medium text-center transition-all cursor-pointer ${
                  activeTier === "atoms"
                    ? "shadow-sm font-semibold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Atoms
              </button>
              <button
                type="button"
                onClick={() => setActiveTier("molecules")}
                style={{
                  borderRadius: `${scaled.scaledRadius === 0 ? 0 : 8}px`,
                  backgroundColor: activeTier === "molecules" ? tokens.primaryButtonColor : "transparent",
                  color: activeTier === "molecules" ? "#FFFFFF" : undefined,
                }}
                className={`flex-1 py-1.5 font-medium text-center transition-all cursor-pointer ${
                  activeTier === "molecules"
                    ? "shadow-sm font-semibold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Molecules
              </button>
            </div>

            {/* Categorized Navigation matching Brad Frost Hierarchy */}
            <nav className="space-y-4">
              {activeTier === "atoms" ? (
                <>
                  <div className="space-y-0.5">
                    <div className="px-3 py-1 text-xs font-semibold text-neutral-400">
                      Actions
                    </div>
                    <a href="#atom-buttons" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Button matrix</span>
                    </a>
                    <a href="#atom-icon-button" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Icon button</span>
                    </a>
                  </div>

                  <div className="space-y-0.5 pt-2 border-t border-neutral-100">
                    <div className="px-3 py-1 text-xs font-semibold text-neutral-400">
                      Text &amp; Entry
                    </div>
                    <a href="#atom-input" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Input</span>
                    </a>
                    <a href="#atom-textarea" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Textarea</span>
                    </a>
                  </div>

                  <div className="space-y-0.5 pt-2 border-t border-neutral-100">
                    <div className="px-3 py-1 text-xs font-semibold text-neutral-400">
                      Selection &amp; Controls
                    </div>
                    <a href="#atom-checkbox" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Checkbox (Tri-state)</span>
                    </a>
                    <a href="#atom-radio" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Radio button</span>
                    </a>
                    <a href="#atom-switch" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Toggle switch</span>
                    </a>
                    <a href="#atom-slider" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Range slider</span>
                    </a>
                    <a href="#atom-progress" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Progress bar</span>
                    </a>
                  </div>

                  <div className="space-y-0.5 pt-2 border-t border-neutral-100">
                    <div className="px-3 py-1 text-xs font-semibold text-neutral-400">
                      Indicators &amp; Identity
                    </div>
                    <a href="#atom-lucide-icons" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Lucide icon atom</span>
                    </a>
                    <a href="#atom-badge" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Status badge</span>
                    </a>
                    <a href="#atom-tag-chip" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Tag chip</span>
                    </a>
                    <a href="#atom-kbd" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Keycap</span>
                    </a>
                    <a href="#atom-avatar" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Avatar &amp; loader</span>
                    </a>
                  </div>
                </>
              ) : (
                <>
                  {/* Category 1: Forms & Data Entry */}
                  <div className="space-y-1">
                    <div className="px-3 py-1 text-[11px] font-bold text-neutral-900 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="text-[10px] font-sans tabular-nums font-semibold px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600">01</span>
                        <span>Forms &amp; Entry</span>
                      </span>
                      <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-full">6</span>
                    </div>
                    <div className="space-y-0.5 pl-2 border-l-2 border-neutral-100 ml-3">
                      <a href="#mol-form-field" className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md flex items-center justify-between transition-colors">
                        <span>FormField</span>
                      </a>
                      <a href="#mol-input-group" className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md flex items-center justify-between transition-colors">
                        <span>InputGroup</span>
                      </a>
                      <a href="#mol-search-bar" className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md flex items-center justify-between transition-colors">
                        <span>SearchBar</span>
                      </a>
                      <a href="#mol-search-select" className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md flex items-center justify-between transition-colors">
                        <span>SearchableSelect</span>
                      </a>
                      <a href="#mol-tag-deck" className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md flex items-center justify-between transition-colors">
                        <span>TagDeck</span>
                      </a>
                      <a href="#mol-date-picker" className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md flex items-center justify-between transition-colors">
                        <span>DateRangePicker</span>
                      </a>
                    </div>
                  </div>

                  {/* Category 2: Navigation & Commands */}
                  <div className="space-y-1 pt-2 border-t border-neutral-100">
                    <div className="px-3 py-1 text-[11px] font-bold text-neutral-900 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="text-[10px] font-sans tabular-nums font-semibold px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600">02</span>
                        <span>Navigation</span>
                      </span>
                      <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-full">3</span>
                    </div>
                    <div className="space-y-0.5 pl-2 border-l-2 border-neutral-100 ml-3">
                      <a href="#mol-segmented" className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md flex items-center justify-between transition-colors">
                        <span>SegmentedControl</span>
                      </a>
                      <a href="#mol-breadcrumbs" className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md flex items-center justify-between transition-colors">
                        <span>Breadcrumbs</span>
                      </a>
                      <a href="#mol-pagination" className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md flex items-center justify-between transition-colors">
                        <span>PaginationBar</span>
                      </a>
                    </div>
                  </div>

                  {/* Category 3: Data Display & Analytics */}
                  <div className="space-y-1 pt-2 border-t border-neutral-100">
                    <div className="px-3 py-1 text-[11px] font-bold text-neutral-900 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="text-[10px] font-sans tabular-nums font-semibold px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600">03</span>
                        <span>Data Display</span>
                      </span>
                      <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-full">2</span>
                    </div>
                    <div className="space-y-0.5 pl-2 border-l-2 border-neutral-100 ml-3">
                      <a href="#mol-metric-stat" className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md flex items-center justify-between transition-colors">
                        <span>MetricStat</span>
                      </a>
                      <a href="#mol-table-row" className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md flex items-center justify-between transition-colors">
                        <span>DataTableRow</span>
                      </a>
                    </div>
                  </div>

                  {/* Category 4: Feedback & Overlays */}
                  <div className="space-y-1 pt-2 border-t border-neutral-100">
                    <div className="px-3 py-1 text-[11px] font-bold text-neutral-900 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="text-[10px] font-sans tabular-nums font-semibold px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600">04</span>
                        <span>Overlays</span>
                      </span>
                      <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-full">3</span>
                    </div>
                    <div className="space-y-0.5 pl-2 border-l-2 border-neutral-100 ml-3">
                      <a href="#mol-alert-callout" className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md flex items-center justify-between transition-colors">
                        <span>AlertCallout</span>
                      </a>
                      <a href="#mol-empty-state" className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md flex items-center justify-between transition-colors">
                        <span>EmptyStateCard</span>
                      </a>
                      <a href="#mol-tooltip" className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md flex items-center justify-between transition-colors">
                        <span>TooltipPopover</span>
                      </a>
                    </div>
                  </div>
                </>
              )}
            </nav>

            {/* Live PoC Apps & SaaS Navigation */}
            <div className="pt-4 border-t border-neutral-100 space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Live PoC SaaS &amp; Forms
              </div>
              <Link
                href="/saas-dashboard"
                className="px-3 py-2 text-xs font-semibold text-white bg-[#111111] hover:bg-neutral-800 rounded-lg flex items-center justify-between transition-colors shadow-xs"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>PulseHire SaaS</span>
                </span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                  Live
                </span>
              </Link>
              <Link
                href="/fresher-profile"
                className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors"
              >
                <span>Fresher Job Bio</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </Link>
              <Link
                href="/example-form"
                className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors"
              >
                <span>Workspace Settings</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </Link>
            </div>
          </div>

          <div className="text-xs text-neutral-400 pt-4 border-t border-neutral-100">
            Brad Frost Atomic Architecture
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════════════
            COLUMN 2: CENTER STAGE (ATOMS OR MOLECULES VIEW)
           ══════════════════════════════════════════════════════════ */}
        <main className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-start overflow-y-auto">
          <div className="w-full max-w-[620px] space-y-6 pb-24">
            
            {/* Stage Title */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <h1 style={{ fontSize: `${scaled.headingFontSize + 3}px` }} className="font-semibold text-neutral-900 tracking-tight">
                  {activeTier === "atoms" ? "Atoms Directory" : "Molecules Directory"}
                </h1>
                <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                  {activeTier === "atoms"
                    ? "Indivisible primitives with Lucide vector icons and universal token bindings."
                    : "Atomic compositions combining two or more primitives for cohesive tasks."}
                </p>
              </div>
              <span
                style={{
                  fontSize: `${scaled.sublabelFontSize}px`,
                  borderRadius: `${scaled.scaledRadius === 0 ? 0 : 9999}px`,
                }}
                className="text-neutral-500 bg-white border border-neutral-200 px-2.5 py-1 shadow-sm"
              >
                Scale: {tokens.scaleMultiplier.toFixed(2)}x
              </span>
            </div>

            {/* ══════════════════════════════════════════════════════════
                VIEW A: PURE ATOMS (UNIVERSAL TOKEN CONTROL)
               ══════════════════════════════════════════════════════════ */}
            {activeTier === "atoms" && (
              <>
                {/* ── 0. FOUNDATIONAL TYPE SCALE ── */}
                <div id="atom-typography" style={cardStyle} className="p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900 flex items-center gap-2">
                        <Type className="w-4 h-4 text-neutral-500" />
                        Typography &amp; type scale
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Modular typographical scale derived from base {tokens.fontSize}px and {tokens.scaleMultiplier.toFixed(2)}x scaling (clean sans-serif).
                      </p>
                    </div>
                    <span className="text-[11px] bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-md border border-neutral-200 font-medium">
                      base {tokens.fontSize}px
                    </span>
                  </div>

                  <div className="space-y-3 divide-y divide-neutral-100 pt-1">
                    {/* Display */}
                    <div className="flex items-baseline justify-between pt-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Display / Hero</span>
                        <div style={{ fontSize: `${Math.round(22 * scaled.scale)}px` }} className="font-bold text-neutral-900 leading-tight">
                          Enterprise Design Scale
                        </div>
                      </div>
                      <span className="text-[11px] text-neutral-500 font-medium">{Math.round(22 * scaled.scale)}px • Bold 700</span>
                    </div>

                    {/* Section Heading */}
                    <div className="flex items-baseline justify-between pt-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Section Header</span>
                        <div style={{ fontSize: `${Math.round(17 * scaled.scale)}px` }} className="font-semibold text-neutral-900 leading-snug">
                          Telemetry &amp; Operations
                        </div>
                      </div>
                      <span className="text-[11px] text-neutral-500 font-medium">{Math.round(17 * scaled.scale)}px • Semibold 600</span>
                    </div>

                    {/* Card Heading / Label */}
                    <div className="flex items-baseline justify-between pt-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Card Header / Form Label</span>
                        <div style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-800">
                          Parameter Filter Deck
                        </div>
                      </div>
                      <span className="text-[11px] text-neutral-500 font-medium">{scaled.headingFontSize}px • Semibold 600</span>
                    </div>

                    {/* Body Text */}
                    <div className="flex items-baseline justify-between pt-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Body &amp; Input Text</span>
                        <div style={{ fontSize: `${scaled.scaledFontSize}px` }} className="text-neutral-700">
                          Standard body copy for high-density tabular records, forms, and parameter controls.
                        </div>
                      </div>
                      <span className="text-[11px] text-neutral-500 font-medium">{scaled.scaledFontSize}px • Regular 400</span>
                    </div>

                    {/* Micro / Caption */}
                    <div className="flex items-baseline justify-between pt-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Micro Caption / Table Header</span>
                        <div style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="font-semibold uppercase tracking-wider text-neutral-500">
                          INVOICE NO • VALUE ($) • STATUS
                        </div>
                      </div>
                      <span className="text-[11px] text-neutral-500 font-medium">{scaled.sublabelFontSize}px • Semibold 600</span>
                    </div>

                    {/* Tabular Figures */}
                    <div className="flex items-baseline justify-between pt-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Tabular Figures (Sans-serif)</span>
                        <div style={{ fontSize: `${scaled.scaledFontSize}px` }} className="tabular-nums font-semibold text-neutral-900 tracking-tight">
                          $ 42,500.00 <span className="text-neutral-300">|</span> 1,840.50 kg <span className="text-neutral-300">|</span> <span className="text-emerald-600 font-semibold">+18.4%</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-neutral-500 font-medium">{scaled.scaledFontSize}px • Tabular Numerals</span>
                    </div>
                  </div>
                </div>

                {/* ── 1. BUTTON ATOM (UNIVERSAL CORNER RADIUS & BLACK PRIMARY DEFAULT) ── */}
                <div id="atom-buttons" style={cardStyle} className="p-5 shadow-sm space-y-4">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      Button state matrix
                    </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Primary, outline, and ghost variants dynamically honoring universal corner radius and color tokens.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-100">
                          <th style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="pb-3 text-neutral-400 font-medium">Variant</th>
                          <th style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="pb-3 text-neutral-400 font-medium text-center">Rest</th>
                          <th style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="pb-3 text-neutral-400 font-medium text-center">Hover</th>
                          <th style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="pb-3 text-neutral-400 font-medium text-center">Focused</th>
                          <th style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="pb-3 text-neutral-400 font-medium text-center">Disabled</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {/* 1. Primary Solid */}
                        <tr>
                          <td style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="py-2.5 text-neutral-600 font-medium whitespace-nowrap pr-3">
                            Primary
                          </td>
                          <td className="py-2.5 text-center">
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.95 }}
                              style={{
                                backgroundColor: tokens.primaryButtonColor,
                                borderRadius: `${scaled.scaledRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                                transition: scaled.transitionStyle,
                              }}
                              className="text-white font-medium shadow-xs cursor-pointer select-none"
                            >
                              Action
                            </motion.button>
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              style={{
                                backgroundColor: tokens.primaryButtonColor,
                                borderRadius: `${scaled.scaledRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                                transition: scaled.transitionStyle,
                              }}
                              className="text-white font-medium brightness-125 shadow-sm"
                            >
                              Action
                            </button>
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              style={{
                                backgroundColor: tokens.primaryButtonColor,
                                borderRadius: `${scaled.scaledRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                                boxShadow: `0 0 0 3px ${tokens.primaryButtonColor}40`,
                                transition: scaled.transitionStyle,
                              }}
                              className="text-white font-medium"
                            >
                              Action
                            </button>
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              disabled
                              style={{
                                backgroundColor: "#CBD5E1",
                                borderRadius: `${scaled.scaledRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                                transition: scaled.transitionStyle,
                              }}
                              className="text-white font-medium opacity-60 cursor-not-allowed"
                            >
                              Action
                            </button>
                          </td>
                        </tr>

                        {/* 2. Secondary Outline */}
                        <tr>
                          <td style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="py-2.5 text-neutral-600 font-medium whitespace-nowrap pr-3">
                            Secondary
                          </td>
                          <td className="py-2.5 text-center">
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.95 }}
                              style={{
                                borderColor: tokens.universalBorderColor,
                                borderWidth: `${tokens.borderWidth}px`,
                                backgroundColor: tokens.universalFillColor,
                                color: tokens.textIconColor,
                                borderRadius: `${scaled.scaledRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                                transition: scaled.transitionStyle,
                              }}
                              className="border font-medium shadow-xs cursor-pointer select-none"
                            >
                              Action
                            </motion.button>
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              style={{
                                borderColor: tokens.universalBorderColor,
                                borderWidth: `${tokens.borderWidth}px`,
                                backgroundColor: tokens.hoverBackplateTint,
                                color: tokens.textIconColor,
                                borderRadius: `${scaled.scaledRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                                transition: scaled.transitionStyle,
                              }}
                              className="border font-medium shadow-xs"
                            >
                              Action
                            </button>
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              style={{
                                borderColor: tokens.textIconColor,
                                borderWidth: `${tokens.borderWidth}px`,
                                backgroundColor: tokens.universalFillColor,
                                color: tokens.textIconColor,
                                borderRadius: `${scaled.scaledRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                                boxShadow: `0 0 0 3px ${tokens.textIconColor}25`,
                                transition: scaled.transitionStyle,
                              }}
                              className="border font-medium"
                            >
                              Action
                            </button>
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              disabled
                              style={{
                                borderColor: "#E2E8F0",
                                borderWidth: `${tokens.borderWidth}px`,
                                backgroundColor: "transparent",
                                color: "#94A3B8",
                                borderRadius: `${scaled.scaledRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                                transition: scaled.transitionStyle,
                              }}
                              className="border font-medium cursor-not-allowed opacity-50"
                            >
                              Action
                            </button>
                          </td>
                        </tr>

                        {/* 3. Ghost / Subtle */}
                        <tr>
                          <td style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="py-2.5 text-neutral-600 font-medium whitespace-nowrap pr-3">
                            Ghost
                          </td>
                          <td className="py-2.5 text-center">
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.95 }}
                              style={{
                                color: tokens.textIconColor,
                                borderRadius: `${scaled.scaledRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                                transition: scaled.transitionStyle,
                              }}
                              className="font-medium bg-transparent cursor-pointer select-none"
                            >
                              Action
                            </motion.button>
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              style={{
                                backgroundColor: tokens.hoverBackplateTint,
                                color: tokens.textIconColor,
                                borderRadius: `${scaled.scaledRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                                transition: scaled.transitionStyle,
                              }}
                              className="font-medium"
                            >
                              Action
                            </button>
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              style={{
                                backgroundColor: "transparent",
                                color: tokens.textIconColor,
                                borderRadius: `${scaled.scaledRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                                boxShadow: `0 0 0 3px ${tokens.textIconColor}25`,
                                transition: scaled.transitionStyle,
                              }}
                              className="font-medium"
                            >
                              Action
                            </button>
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              disabled
                              style={{
                                color: "#94A3B8",
                                borderRadius: `${scaled.scaledRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                                transition: scaled.transitionStyle,
                              }}
                              className="font-medium cursor-not-allowed opacity-40 bg-transparent"
                            >
                              Action
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── 2. ICON BUTTON ATOM ── */}
                <div id="atom-icon-button" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      Icon button primitive
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">
                      Universal radius &amp; border width
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    {/* Primary Icon Button */}
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.92 }}
                      whileHover={{ scale: 1.04 }}
                      style={{
                        backgroundColor: tokens.primaryButtonColor,
                        borderRadius: `${scaled.scaledRadius}px`,
                        width: `${scaled.scaledHeight}px`,
                        height: `${scaled.scaledHeight}px`,
                        transition: scaled.transitionStyle,
                      }}
                      className="text-white flex items-center justify-center shadow-xs cursor-pointer select-none"
                      title="Add item"
                    >
                      <Plus className="w-4 h-4" strokeWidth={2.5} />
                    </motion.button>

                    {/* Secondary Outline Icon Button */}
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.92 }}
                      whileHover={{ scale: 1.04 }}
                      style={{
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.universalFillColor,
                        color: tokens.textIconColor,
                        borderRadius: `${scaled.scaledRadius}px`,
                        width: `${scaled.scaledHeight}px`,
                        height: `${scaled.scaledHeight}px`,
                        transition: scaled.transitionStyle,
                      }}
                      className="border flex items-center justify-center shadow-xs cursor-pointer select-none hover:bg-neutral-50"
                      title="Filter"
                    >
                      <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
                    </motion.button>

                    {/* Ghost Icon Button */}
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.92 }}
                      whileHover={{ scale: 1.04 }}
                      style={{
                        backgroundColor: tokens.hoverBackplateTint,
                        color: tokens.textIconColor,
                        borderRadius: `${scaled.scaledRadius}px`,
                        width: `${scaled.scaledHeight}px`,
                        height: `${scaled.scaledHeight}px`,
                        transition: scaled.transitionStyle,
                      }}
                      className="flex items-center justify-center cursor-pointer select-none hover:brightness-95"
                      title="Settings"
                    >
                      <Settings className="w-4 h-4" strokeWidth={2} />
                    </motion.button>
                  </div>
                </div>

                {/* ── 3. INPUT ATOM (4 TRUTH STATES) ── */}
                <div id="atom-input" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      Input states
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">
                      Zero-flicker rasterization
                    </span>
                  </div>

                  <div className="space-y-2">
                    {/* Rest */}
                    <div
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: scaled.effectiveInputFill,
                        height: `${scaled.scaledHeight}px`,
                        paddingLeft: `${scaled.scaledPaddingX}px`,
                        paddingRight: `${scaled.scaledPaddingX}px`,
                        transition: scaled.transitionStyle,
                      }}
                      className="flex items-center gap-2 border"
                    >
                      <input
                        type="text"
                        readOnly
                        value="Rest state"
                        style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>

                    {/* Focused */}
                    <div
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: tokens.textIconColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: scaled.effectiveInputFill,
                        height: `${scaled.scaledHeight}px`,
                        paddingLeft: `${scaled.scaledPaddingX}px`,
                        paddingRight: `${scaled.scaledPaddingX}px`,
                        boxShadow: scaled.isZeroBorder ? scaled.focusHalo : `0 0 0 3px ${tokens.textIconColor}12`,
                        transition: scaled.transitionStyle,
                      }}
                      className="flex items-center gap-2 border"
                    >
                      <input
                        type="text"
                        readOnly
                        value="Focused state (zero flicker)"
                        style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>

                    {/* Error / Invalid */}
                    <div
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: "#EF4444",
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: scaled.effectiveInputFill,
                        height: `${scaled.scaledHeight}px`,
                        paddingLeft: `${scaled.scaledPaddingX}px`,
                        paddingRight: `${scaled.scaledPaddingX}px`,
                        boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.12)",
                        transition: scaled.transitionStyle,
                      }}
                      className="flex items-center gap-2 border"
                    >
                      <input
                        type="text"
                        readOnly
                        value="Invalid email format"
                        style={{ fontSize: `${scaled.scaledFontSize}px`, color: "#DC2626" }}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>

                    {/* Disabled */}
                    <div
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.universalFillColor,
                        height: `${scaled.scaledHeight}px`,
                        paddingLeft: `${scaled.scaledPaddingX}px`,
                        paddingRight: `${scaled.scaledPaddingX}px`,
                        transition: scaled.transitionStyle,
                      }}
                      className="flex items-center gap-2 border opacity-45 cursor-not-allowed"
                    >
                      <input
                        type="text"
                        disabled
                        value="Disabled state"
                        style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                        className="w-full bg-transparent outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* ── 4. TEXTAREA ATOM ── */}
                <div id="atom-textarea" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                    Textarea primitive
                  </h2>
                  <div
                    style={{
                      borderRadius: `${scaled.scaledRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      backgroundColor: scaled.effectiveInputFill,
                      padding: `${scaled.scaledPaddingY}px ${scaled.scaledPaddingX}px`,
                      transition: scaled.transitionStyle,
                    }}
                    className="flex items-start border"
                  >
                    <textarea
                      rows={2}
                      value={textareaValue}
                      onChange={(e) => setTextareaValue(e.target.value)}
                      style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                      className="w-full bg-transparent outline-none resize-none"
                    />
                  </div>
                </div>

                {/* ── 5. CHECKBOX ATOM (UNIVERSAL RADIUS & BORDER WIDTH) ── */}
                <div id="atom-checkbox" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      Checkbox primitive
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">
                      Adaptive geometry &amp; primary color
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {/* Interactive Animated Checkbox */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCheckboxValue((prev) => !prev)}
                        style={{
                          borderRadius: `${scaled.scaledCheckboxRadius}px`,
                          backgroundColor: checkboxValue ? tokens.primaryButtonColor : tokens.universalFillColor,
                          borderColor: checkboxValue ? tokens.primaryButtonColor : tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          transition: scaled.transitionStyle,
                        }}
                        className="w-4 h-4 flex items-center justify-center border cursor-pointer"
                      >
                        {checkboxValue && (
                          <motion.svg
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                          >
                            <motion.path
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 12.75 6 6 9-13.5"
                            />
                          </motion.svg>
                        )}
                      </motion.div>
                      <span style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="font-medium select-none">
                        Active check
                      </span>
                    </label>

                    {/* Tri-state Indeterminate Checkbox (Enterprise Bulk Selection) */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setTriCheckboxState((prev) =>
                            prev === "unchecked"
                              ? "indeterminate"
                              : prev === "indeterminate"
                              ? "checked"
                              : "unchecked"
                          );
                        }}
                        style={{
                          borderRadius: `${scaled.scaledCheckboxRadius}px`,
                          backgroundColor:
                            triCheckboxState !== "unchecked"
                              ? tokens.primaryButtonColor
                              : tokens.universalFillColor,
                          borderColor:
                            triCheckboxState !== "unchecked"
                              ? tokens.primaryButtonColor
                              : tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          transition: scaled.transitionStyle,
                        }}
                        className="w-4 h-4 flex items-center justify-center border cursor-pointer"
                      >
                        {triCheckboxState === "checked" && (
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        )}
                        {triCheckboxState === "indeterminate" && (
                          <Minus className="w-3 h-3 text-white" strokeWidth={4} />
                        )}
                      </motion.div>
                      <span style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="font-medium select-none">
                        Tri-state ({triCheckboxState})
                      </span>
                    </label>

                    {/* Disabled Checkbox */}
                    <div className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                      <div
                        style={{
                          borderRadius: `${scaled.scaledCheckboxRadius}px`,
                          backgroundColor: tokens.hoverBackplateTint,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                        }}
                        className="w-4 h-4 flex items-center justify-center border cursor-not-allowed"
                      >
                        <Check className="w-3 h-3 text-neutral-400" strokeWidth={2.5} />
                      </div>
                      <span style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="font-medium select-none">
                        Disabled check
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── 6. RADIO ATOM (UNIVERSAL PRIMARY BINDING) ── */}
                <div id="atom-radio" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      Radio primitive
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">
                      Concentric indicator with primary color
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setRadioValue(radioValue === "standard" ? "pro" : "standard")}
                        style={{
                          borderColor: radioValue === "pro" ? tokens.primaryButtonColor : tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.universalFillColor,
                          transition: scaled.transitionStyle,
                        }}
                        className="w-4 h-4 rounded-full flex items-center justify-center border"
                      >
                        {radioValue === "pro" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 700, damping: 30 }}
                            style={{ backgroundColor: tokens.primaryButtonColor }}
                            className="w-2 h-2 rounded-full"
                          />
                        )}
                      </motion.div>
                      <span style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="font-medium select-none">
                        Selected
                      </span>
                    </label>

                    <div className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                      <div
                        style={{
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.hoverBackplateTint,
                        }}
                        className="w-4 h-4 rounded-full flex items-center justify-center border cursor-not-allowed"
                      />
                      <span style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="font-medium select-none">
                        Disabled
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── 7. SWITCH ATOM (UNIVERSAL RADIUS & PRIMARY ACTION) ── */}
                <div id="atom-switch" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      Toggle switch
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">
                      Adaptive geometry &amp; primary action fill
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="font-medium">
                      Enabled state
                    </span>
                    <button
                      type="button"
                      onClick={() => setSwitchValue((prev) => !prev)}
                      style={{
                        backgroundColor: switchValue ? tokens.primaryButtonColor : tokens.universalBorderColor,
                        borderRadius: `${scaled.scaledRadius === 0 ? 0 : 9999}px`,
                        transition: scaled.transitionStyle,
                      }}
                      className="w-10 h-5 flex items-center p-0.5 cursor-pointer"
                    >
                      <motion.div
                        layout
                        transition={{ type: "spring", stiffness: 600, damping: 30 }}
                        style={{
                          backgroundColor: tokens.universalFillColor,
                          borderRadius: `${scaled.scaledRadius === 0 ? 0 : 9999}px`,
                        }}
                        className={`w-4 h-4 shadow-sm ${switchValue ? "ml-auto" : "mr-auto"}`}
                      />
                    </button>
                  </div>
                </div>

                {/* ── 8. SLIDER ATOM ── */}
                <div id="atom-slider" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      Continuous slider
                    </h2>
                    <span
                      style={{
                        fontSize: `${scaled.sublabelFontSize}px`,
                        borderRadius: `${scaled.scaledInnerRadius}px`,
                      }}
                      className="font-semibold text-neutral-900 bg-neutral-100 px-1.5 py-0.5"
                    >
                      {sliderValue}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(Number(e.target.value))}
                    style={{ accentColor: tokens.primaryButtonColor }}
                    className="w-full cursor-pointer"
                  />
                </div>

                {/* ── 9. LUCIDE ICON ATOM ── */}
                <div id="atom-lucide-icons" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                        Lucide icon atom
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Indivisible vector primitives across size, stroke weight, and corner radius tokens.
                      </p>
                    </div>

                    {/* Stroke selector */}
                    <div
                      style={{ borderRadius: `${scaled.scaledInnerRadius}px` }}
                      className="flex items-center gap-1 bg-neutral-100 p-0.5 text-xs"
                    >
                      {([1.5, 2.0, 2.5] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setActiveIconStroke(s)}
                          style={{
                            borderRadius: `${scaled.scaledInnerRadius === 0 ? 0 : Math.max(2, scaled.scaledInnerRadius - 2)}px`,
                          }}
                          className={`px-2 py-0.5 font-medium cursor-pointer transition-all ${
                            activeIconStroke === s
                              ? "bg-white text-neutral-900 shadow-xs font-semibold"
                              : "text-neutral-500 hover:text-neutral-900"
                          }`}
                        >
                          {s}px
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Curated SaaS Lucide glyph grid */}
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 pt-2">
                    {[
                      { icon: Check, label: "check" },
                      { icon: Plus, label: "plus" },
                      { icon: Search, label: "search" },
                      { icon: ChevronDown, label: "chevron" },
                      { icon: ArrowRight, label: "arrow" },
                      { icon: Copy, label: "copy" },
                      { icon: Trash2, label: "trash" },
                      { icon: Shield, label: "shield" },
                      { icon: Sparkles, label: "sparkles" },
                      { icon: RefreshCw, label: "refresh" },
                      { icon: X, label: "close" },
                      { icon: SlidersHorizontal, label: "sliders" },
                      { icon: Settings, label: "settings" },
                      { icon: AlertCircle, label: "alert" },
                      { icon: Key, label: "key" },
                      { icon: Zap, label: "zap" },
                    ].map(({ icon: IconComponent, label }) => (
                      <div
                        key={label}
                        style={{
                          backgroundColor: tokens.hoverBackplateTint,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          borderRadius: `${scaled.scaledInnerRadius}px`,
                        }}
                        className="flex flex-col items-center justify-center p-2 border hover:border-neutral-400 transition-colors cursor-pointer group"
                        title={label}
                      >
                        <IconComponent
                          className="w-4 h-4 transition-transform group-hover:scale-110"
                          style={{ color: tokens.textIconColor }}
                          strokeWidth={activeIconStroke}
                        />
                        <span className="text-[10px] text-neutral-400 mt-1 truncate max-w-full">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── 10. STATUS BADGES ATOM ── */}
                <div id="atom-badge" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                    Status badge indicators
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span
                      style={{
                        fontSize: `${scaled.sublabelFontSize}px`,
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderWidth: `${tokens.borderWidth}px`,
                      }}
                      className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-medium border border-emerald-200"
                    >
                      Active
                    </span>
                    <span
                      style={{
                        fontSize: `${scaled.sublabelFontSize}px`,
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderWidth: `${tokens.borderWidth}px`,
                      }}
                      className="px-2.5 py-0.5 bg-amber-50 text-amber-700 font-medium border border-amber-200"
                    >
                      Pending
                    </span>
                    <span
                      style={{
                        fontSize: `${scaled.sublabelFontSize}px`,
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderWidth: `${tokens.borderWidth}px`,
                      }}
                      className="px-2.5 py-0.5 bg-rose-50 text-rose-700 font-medium border border-rose-200"
                    >
                      Failed
                    </span>
                    <span
                      style={{
                        fontSize: `${scaled.sublabelFontSize}px`,
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderWidth: `${tokens.borderWidth}px`,
                      }}
                      className="px-2.5 py-0.5 bg-neutral-100 text-neutral-700 font-medium border border-neutral-200"
                    >
                      Draft
                    </span>
                  </div>
                </div>

                {/* ── 11. TAG CHIP ATOM (UNIVERSAL RADIUS) ── */}
                <div id="atom-tag-chip" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      Tag chip primitive
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">
                      Static &amp; dismissible states
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {/* Dismissible Chip */}
                    <span
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        fontSize: `${scaled.sublabelFontSize}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        color: tokens.textIconColor,
                        transition: scaled.transitionStyle,
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 font-medium border"
                    >
                      <span>Design System</span>
                      <button type="button" className="hover:text-red-600 transition-colors cursor-pointer" title="Dismiss">
                        <X className="w-3 h-3" strokeWidth={2.5} />
                      </button>
                    </span>

                    {/* Static Chip */}
                    <span
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        fontSize: `${scaled.sublabelFontSize}px`,
                        backgroundColor: tokens.universalFillColor,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        color: tokens.textIconColor,
                        transition: scaled.transitionStyle,
                      }}
                      className="inline-flex items-center px-3 py-1 font-medium border shadow-xs"
                    >
                      <span>Frontend</span>
                    </span>
                  </div>
                </div>

                {/* ── 12. KEYBOARD KEYCAP (KBD) ATOM ── */}
                <div id="atom-kbd" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                    Keycap primitives
                  </h2>

                  <div className="flex items-center gap-1.5 pt-1">
                    <kbd
                      style={{
                        borderRadius: `${scaled.scaledInnerRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                        color: tokens.textIconColor,
                        fontSize: `${scaled.sublabelFontSize}px`,
                        padding: `${Math.round(2 * scaled.scale)}px ${Math.round(6 * scaled.scale)}px`,
                      }}
                      className="font-medium border shadow-xs"
                    >
                      ⌘K
                    </kbd>
                    <kbd
                      style={{
                        borderRadius: `${scaled.scaledInnerRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                        color: tokens.textIconColor,
                        fontSize: `${scaled.sublabelFontSize}px`,
                        padding: `${Math.round(2 * scaled.scale)}px ${Math.round(6 * scaled.scale)}px`,
                      }}
                      className="font-medium border shadow-xs"
                    >
                      Esc
                    </kbd>
                    <kbd
                      style={{
                        borderRadius: `${scaled.scaledInnerRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                        color: tokens.textIconColor,
                        fontSize: `${scaled.sublabelFontSize}px`,
                        padding: `${Math.round(2 * scaled.scale)}px ${Math.round(6 * scaled.scale)}px`,
                      }}
                      className="font-medium border shadow-xs"
                    >
                      ↵ Enter
                    </kbd>
                  </div>
                </div>

                {/* ── 13. AVATAR & LOADER ATOM ── */}
                <div id="atom-avatar" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                    Avatar &amp; loader
                  </h2>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div
                          style={{
                            width: `${scaled.scaledHeight}px`,
                            height: `${scaled.scaledHeight}px`,
                            backgroundColor: tokens.primaryButtonColor,
                            borderRadius: `${scaled.scaledRadius === 0 ? 0 : 9999}px`,
                          }}
                          className="flex items-center justify-center text-white font-medium text-xs shadow-xs"
                        >
                          SC
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                      </div>
                      <span style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="font-medium">
                        Sarah Connor
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border-2 border-neutral-300 border-t-neutral-800 animate-spin" />
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Syncing...
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ══════════════════════════════════════════════════════════
                VIEW B: MOLECULES (UNIVERSAL TOKENS ON ALL INPUTS & DROPDOWNS)
               ══════════════════════════════════════════════════════════ */}
            {activeTier === "molecules" && (
              <>
                {/* ══════════════════════════════════════════════════════════
                    TIER 2 ARCHITECTURE OVERVIEW BANNER & QUICK FILTER BAR
                   ══════════════════════════════════════════════════════════ */}
                <div
                  style={{
                    borderRadius: `${scaled.scaledCardRadius}px`,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    backgroundColor: tokens.universalFillColor,
                    boxShadow: scaled.cardShadow,
                    padding: `${Math.round(20 * scaled.scale)}px`,
                  }}
                  className="border space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 text-white font-sans text-[10px] font-bold uppercase tracking-wider">
                        Tier 2 Architecture
                      </span>
                      <span className="text-xs text-neutral-400 font-medium">
                        Brad Frost Hierarchy
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium">
                      <span>Physics: <strong className="text-neutral-900 capitalize">{tokens.motionPhysics}</strong></span>
                      <span>•</span>
                      <span>14 Molecules</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h2 style={{ fontSize: `${scaled.headingFontSize + 4}px` }} className="font-bold text-neutral-900 tracking-tight">
                      Molecules Specification &amp; Composition Matrix
                    </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-600 leading-relaxed max-w-xl">
                      Molecules are functional UI patterns formed by composing two or more indivisible atomic primitives. Every molecule below strictly binds to universal studio tokens, contains zero unstyled OS controls, and exhibits fluid spring interaction physics.
                    </p>
                  </div>

                  {/* Interactive Category Filter Pills with Gliding Motion */}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-neutral-100 flex-wrap">
                    {[
                      { id: "all", label: "All Molecules", count: 14, icon: Layers },
                      { id: "cat1", label: "01 Forms & Entry", count: 6, icon: Mail },
                      { id: "cat2", label: "02 Navigation", count: 3, icon: Compass },
                      { id: "cat3", label: "03 Analytics", count: 2, icon: BarChart2 },
                      { id: "cat4", label: "04 Overlays", count: 3, icon: AlertCircle },
                    ].map((tab) => {
                      const isSelected = activeCategoryFilter === tab.id;
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            setActiveCategoryFilter(tab.id as any);
                            if (tab.id !== "all") {
                              const el = document.getElementById(`category-section-${tab.id}`);
                              el?.scrollIntoView({ behavior: "smooth", block: "start" });
                            }
                          }}
                          style={{
                            borderRadius: `${scaled.scaledRadius === 9999 ? 9999 : scaled.scaledInnerRadius}px`,
                            fontSize: `${scaled.sublabelFontSize}px`,
                            padding: `${Math.round(4 * scaled.scale)}px ${Math.round(10 * scaled.scale)}px`,
                          }}
                          className={`font-semibold cursor-pointer relative flex items-center gap-1.5 transition-colors select-none ${
                            isSelected ? "text-white" : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                          }`}
                        >
                          {isSelected && (
                            <motion.div
                              layoutId="activeCategoryFilterPill"
                              transition={scaled.motionConfig.pillTransition}
                              style={{
                                borderRadius: `${scaled.scaledRadius === 9999 ? 9999 : scaled.scaledInnerRadius}px`,
                                backgroundColor: tokens.primaryButtonColor,
                              }}
                              className="absolute inset-0 -z-10 shadow-xs"
                            />
                          )}
                          <Icon className="w-3.5 h-3.5" />
                          <span>{tab.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isSelected ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"
                          }`}>
                            {tab.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
                    CATEGORY 1: FORMS & DATA ENTRY
                   ══════════════════════════════════════════════════════════ */}
                <div id="category-section-cat1" className="w-full pt-4 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-neutral-900">
                    <div className="flex items-center gap-2.5">
                      <div
                        style={{ borderRadius: `${scaled.scaledInnerRadius}px` }}
                        className="w-7 h-7 bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shadow-xs"
                      >
                        01
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                          Forms &amp; Parameter Entry
                        </h2>
                        <p className="text-[11px] text-neutral-500">
                          Validated inputs, conjoined action groups, searchable select panels, and dynamic tag decks.
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-neutral-600 bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 rounded-full">
                      6 Production Molecules
                    </span>
                  </div>
                </div>

                {/* ── MOLECULE 1: FORM FIELD ── */}
                <div id="mol-form-field" style={cardStyle} className="p-5 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                          FormField
                        </h2>
                        <span className="text-[10px] font-sans tabular-nums px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-semibold border border-neutral-200">
                          Validated Compound
                        </span>
                      </div>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                        Label + Leading Icon + HelperText + Dynamic Validation Feedback
                      </span>
                    </div>
                    {/* Enterprise Error Simulation Toggle */}
                    <button
                      type="button"
                      onClick={() => setIsEmailError((prev) => !prev)}
                      style={{
                        borderRadius: `${scaled.scaledInnerRadius}px`,
                        fontSize: `${scaled.sublabelFontSize}px`,
                      }}
                      className={`px-2.5 py-1 font-semibold border cursor-pointer transition-all select-none ${
                        isEmailError
                          ? "bg-rose-50 text-rose-700 border-rose-300"
                          : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:text-black"
                      }`}
                    >
                      {isEmailError ? "Reset valid state" : "Simulate validation error"}
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px` }} className="block font-medium text-neutral-700">
                      Account email <span className="text-rose-500">*</span>
                    </label>
                    <div
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: isEmailError
                          ? "#F43F5E"
                          : isInputFocused
                          ? tokens.textIconColor
                          : tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: scaled.effectiveInputFill,
                        height: `${scaled.scaledHeight}px`,
                        paddingLeft: `${scaled.scaledPaddingX}px`,
                        paddingRight: `${scaled.scaledPaddingX}px`,
                        boxShadow: isEmailError
                          ? "0 0 0 3px rgba(244, 63, 94, 0.15)"
                          : isInputFocused
                          ? (scaled.isZeroBorder ? scaled.focusHalo : `0 0 0 3px ${tokens.textIconColor}12`)
                          : "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
                        transition: "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
                      }}
                      className="flex items-center gap-2.5 border"
                    >
                      <Mail className={`w-4 h-4 shrink-0 transition-colors ${isEmailError ? "text-rose-500" : "text-neutral-400"}`} strokeWidth={1.8} />
                      <input
                        type="email"
                        value={textInput}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="name@enterprise.com"
                        style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                        className="w-full bg-transparent outline-none"
                      />
                      {isEmailError && (
                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" strokeWidth={2} />
                      )}
                    </div>
                    {/* Fluid Animated Validation Feedback with AnimatePresence */}
                    <AnimatePresence mode="wait">
                      {isEmailError ? (
                        <motion.span
                          key="error"
                          initial={{ opacity: 0, y: -4, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -4, height: 0 }}
                          transition={scaled.motionConfig.spring}
                          style={{ fontSize: `${scaled.sublabelFontSize}px` }}
                          className="text-rose-600 font-medium flex items-center gap-1.5 pt-0.5 overflow-hidden"
                        >
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>Please enter a valid corporate email domain (e.g. name@enterprise.com)</span>
                        </motion.span>
                      ) : (
                        <motion.span
                          key="hint"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.12 }}
                          style={{ fontSize: `${scaled.sublabelFontSize}px` }}
                          className="text-neutral-500 flex items-center gap-1 pt-0.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>Monthly invoice telemetry and settlements will route to this inbox.</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Architecture Anatomy Footer */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1 font-sans text-[11px]">
                      <span>Anatomy:</span>
                      <strong className="text-neutral-600">Label + Input + LeadingIcon + ErrorAlert + HelperText</strong>
                    </span>
                    <span className="font-semibold text-neutral-500">Universal Halos Active</span>
                  </div>
                </div>

                {/* ── MOLECULE 2: INPUT GROUP (UNIVERSAL RADIUS & CONJOINED ACTION) ── */}
                <div id="mol-input-group" style={cardStyle} className="p-5 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                          InputGroup
                        </h2>
                        <span className="text-[10px] font-sans tabular-nums px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-semibold border border-neutral-200">
                          Conjoined Action
                        </span>
                      </div>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                        Input + Mask Toggle + Conjoined Copy Button
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsApiKeyMasked((prev) => !prev)}
                      style={{
                        borderRadius: `${scaled.scaledInnerRadius}px`,
                        fontSize: `${scaled.sublabelFontSize}px`,
                      }}
                      className="px-2.5 py-1 font-semibold border border-neutral-200 text-neutral-600 hover:text-black hover:bg-neutral-50 flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      {isApiKeyMasked ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{isApiKeyMasked ? "Reveal Secret" : "Mask Secret"}</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px` }} className="block font-medium text-neutral-700">
                      Secret API key
                    </label>
                    <div className="flex items-center">
                      <div
                        style={{
                          borderTopLeftRadius: `${scaled.scaledRadius}px`,
                          borderBottomLeftRadius: `${scaled.scaledRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          borderRightWidth: scaled.isZeroBorder ? 0 : 0,
                          backgroundColor: scaled.effectiveInputFill,
                          height: `${scaled.scaledHeight}px`,
                          paddingLeft: `${scaled.scaledPaddingX}px`,
                          paddingRight: `${scaled.scaledPaddingX}px`,
                          transition: scaled.transitionStyle,
                        }}
                        className="flex-1 flex items-center border"
                      >
                        <input
                          type={isApiKeyMasked ? "password" : "text"}
                          readOnly
                          value={apiKey}
                          style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                          className="w-full bg-transparent outline-none font-medium tabular-nums"
                        />
                      </div>
                      {/* Hairline divider when border is 0 to prevent visual collision */}
                      {scaled.isZeroBorder && (
                        <div
                          style={{
                            width: "1px",
                            height: `${Math.round(scaled.scaledHeight * 0.6)}px`,
                            backgroundColor: scaled.conjoinedDivider,
                          }}
                        />
                      )}
                      <motion.button
                        type="button"
                        whileTap={{ scale: scaled.motionConfig.tapScale }}
                        onClick={handleCopyApiKey}
                        style={{
                          borderTopRightRadius: `${scaled.scaledRadius}px`,
                          borderBottomRightRadius: `${scaled.scaledRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.primaryButtonColor,
                          color: "#FFFFFF",
                          height: `${scaled.scaledHeight}px`,
                          paddingLeft: `${scaled.scaledPaddingX}px`,
                          paddingRight: `${scaled.scaledPaddingX}px`,
                          fontSize: `${scaled.labelFontSize}px`,
                          transition: scaled.transitionStyle,
                        }}
                        className="border font-medium flex items-center gap-1.5 cursor-pointer shadow-xs select-none"
                      >
                        {isApiKeyCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2.5} />
                        ) : (
                          <Copy className="w-3.5 h-3.5" strokeWidth={2} />
                        )}
                        <span>{isApiKeyCopied ? "Copied" : "Copy"}</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Architecture Anatomy Footer */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1 font-sans text-[11px]">
                      <span>Anatomy:</span>
                      <strong className="text-neutral-600">Atom:Input + Atom:Button + Atom:EyeToggle + Atom:Divider</strong>
                    </span>
                    <span className="font-semibold text-neutral-500">Conjoined Geometry</span>
                  </div>
                </div>

                {/* ── MOLECULE 3: SEARCH BAR ── */}
                <div id="mol-search-bar" style={cardStyle} className="p-5 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                          SearchBar
                        </h2>
                        <span className="text-[10px] font-sans tabular-nums px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-semibold border border-neutral-200">
                          Live Command
                        </span>
                      </div>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                        Live Input + Fluid Clear Trigger + Command Palette Popover
                      </span>
                    </div>

                    <span className="text-[11px] text-neutral-400 font-medium">
                      Press ⌘K to focus
                    </span>
                  </div>

                  <div ref={searchRef} className="relative">
                    <div
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: isSearchFocused ? tokens.textIconColor : tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: scaled.effectiveInputFill,
                        height: `${scaled.scaledHeight}px`,
                        paddingLeft: `${scaled.scaledPaddingX}px`,
                        paddingRight: `${scaled.scaledPaddingX}px`,
                        boxShadow: isSearchFocused
                          ? (scaled.isZeroBorder ? scaled.focusHalo : `0 0 0 3px ${tokens.textIconColor}12`)
                          : "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
                        transition: "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
                      }}
                      className="flex items-center justify-between border select-none"
                    >
                      <div className="flex items-center gap-2.5 flex-1 mr-2">
                        <Search className={`w-4 h-4 shrink-0 transition-colors ${isSearchFocused ? "text-neutral-900" : "text-neutral-400"}`} strokeWidth={2} />
                        <input
                          type="text"
                          value={searchBarQuery}
                          onFocus={() => setIsSearchFocused(true)}
                          onChange={(e) => setSearchBarQuery(e.target.value)}
                          placeholder="Search clusters, telemetry metrics, audit logs..."
                          style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                          className="w-full bg-transparent outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <AnimatePresence>
                          {searchBarQuery && (
                            <motion.button
                              type="button"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={scaled.motionConfig.spring}
                              onClick={() => setSearchBarQuery("")}
                              className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer rounded-full hover:bg-neutral-100"
                              title="Clear query"
                            >
                              <X className="w-3.5 h-3.5" />
                            </motion.button>
                          )}
                        </AnimatePresence>
                        <kbd
                          style={{
                            borderRadius: `${scaled.scaledInnerRadius}px`,
                            backgroundColor: isSearchFocused ? tokens.primaryButtonColor : tokens.hoverBackplateTint,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            color: isSearchFocused ? "#FFFFFF" : undefined,
                            fontSize: `${scaled.sublabelFontSize - 1}px`,
                            padding: `${Math.round(2 * scaled.scale)}px ${Math.round(6 * scaled.scale)}px`,
                            transition: scaled.transitionStyle,
                          }}
                          className="font-medium border shadow-2xs select-none flex items-center gap-0.5"
                        >
                          <Command className="w-2.5 h-2.5" />
                          <span>K</span>
                        </kbd>
                      </div>
                    </div>

                    {/* Fluid Command Palette / Suggestions Popover */}
                    <AnimatePresence>
                      {isSearchFocused && (
                        <motion.div
                          initial={scaled.motionConfig.popover.initial}
                          animate={scaled.motionConfig.popover.animate}
                          exit={scaled.motionConfig.popover.exit}
                          transition={scaled.motionConfig.popover.transition}
                          style={{
                            marginTop: `${tokens.menuOffsetGap}px`,
                            borderRadius: `${scaled.scaledMenuRadius}px`,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            backgroundColor: tokens.universalFillColor,
                            boxShadow: "0 10px 25px -4px rgba(0,0,0,0.12)",
                            padding: `${Math.round(6 * scaled.scale)}px`,
                          }}
                          className="absolute top-full left-0 right-0 z-30 space-y-1 border"
                        >
                          <div className="px-2.5 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                            Suggested Quick Actions
                          </div>
                          {[
                            { icon: Zap, label: "Trigger automated cluster failover drill", category: "Operations" },
                            { icon: BarChart2, label: "Export monthly egress telemetry ledger (.csv)", category: "Analytics" },
                            { icon: Shield, label: "Review RBAC privilege escalation matrix", category: "Security" },
                          ].map((item, idx) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setSearchBarQuery(item.label);
                                  setIsSearchFocused(false);
                                  triggerToast(`Executing: ${item.label}`);
                                }}
                                style={{
                                  borderRadius: `${scaled.scaledOptionRadius}px`,
                                  fontSize: `${scaled.sublabelFontSize}px`,
                                  padding: `${Math.round(6 * scaled.scale)}px ${Math.round(10 * scaled.scale)}px`,
                                }}
                                className="w-full text-left flex items-center justify-between text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer group"
                              >
                                <span className="flex items-center gap-2">
                                  <Icon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900" />
                                  <span>{item.label}</span>
                                </span>
                                <span className="text-[10px] text-neutral-400 font-medium">
                                  {item.category}
                                </span>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Architecture Anatomy Footer */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1 font-sans text-[11px]">
                      <span>Anatomy:</span>
                      <strong className="text-neutral-600">Atom:Input + Atom:SearchIcon + Atom:ClearButton + Atom:KeycapKbd + FloatingPalette</strong>
                    </span>
                    <span className="font-semibold text-neutral-500">Fluid Motion Ready</span>
                  </div>
                </div>

                {/* ── MOLECULE 4: SEARCHABLE SELECT ── */}
                <div id="mol-search-select" style={cardStyle} className="p-5 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                          SearchableSelect
                        </h2>
                        <span className="text-[10px] font-sans tabular-nums px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-semibold border border-neutral-200">
                          Selection Popover
                        </span>
                      </div>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                        Trigger + Filtered Popover + Universal Tokens
                      </span>
                    </div>

                    <span className="text-[11px] text-neutral-400 font-medium">
                      Esc to close
                    </span>
                  </div>

                  <div ref={roleRef} className="relative space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px` }} className="block font-medium text-neutral-700">Team role</label>

                    <button
                      type="button"
                      onClick={() => setIsRoleOpen((prev) => !prev)}
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: isRoleOpen ? tokens.textIconColor : tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: scaled.effectiveInputFill,
                        height: `${scaled.scaledHeight}px`,
                        paddingLeft: `${scaled.scaledPaddingX}px`,
                        paddingRight: `${scaled.scaledPaddingX}px`,
                        boxShadow: isRoleOpen
                          ? (scaled.isZeroBorder ? scaled.focusHalo : `0 0 0 3px ${tokens.textIconColor}12`)
                          : "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
                        transition: "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
                      }}
                      className="w-full flex items-center justify-between text-left cursor-pointer border"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Key className="w-4 h-4 text-neutral-400 shrink-0" strokeWidth={1.8} />
                        <span style={{ fontSize: `${scaled.scaledFontSize}px`, color: role ? tokens.textIconColor : "#A3A3A3" }} className="truncate font-normal">
                          {role || "Select a role..."}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isRoleOpen ? 180 : 0 }}
                        transition={scaled.motionConfig.spring}
                        style={{
                          borderRadius: `${scaled.scaledInnerRadius}px`,
                          backgroundColor: tokens.hoverBackplateTint,
                          color: tokens.textIconColor,
                        }}
                        className="w-5 h-5 flex items-center justify-center shrink-0"
                      >
                        <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.2} />
                      </motion.div>
                    </button>

                    {/* Popover Dropdown adhering 100% to Universal Tokens & Fluid Motion */}
                    <AnimatePresence>
                      {isRoleOpen && (
                        <motion.div
                          initial={scaled.motionConfig.popover.initial}
                          animate={scaled.motionConfig.popover.animate}
                          exit={scaled.motionConfig.popover.exit}
                          transition={scaled.motionConfig.popover.transition}
                          style={{
                            marginTop: `${tokens.menuOffsetGap}px`,
                            borderRadius: `${scaled.scaledMenuRadius}px`,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            backgroundColor: tokens.universalFillColor,
                            boxShadow: "0 10px 25px -4px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.03)",
                            padding: `${Math.round(6 * scaled.scale)}px`,
                          }}
                          className="absolute top-full left-0 right-0 z-30 space-y-1 border"
                        >
                          <input
                            type="text"
                            autoFocus
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            placeholder="Search roles..."
                            style={{
                              borderRadius: `${scaled.scaledInnerRadius}px`,
                              borderColor: tokens.universalBorderColor,
                              borderWidth: `${tokens.borderWidth}px`,
                              backgroundColor: scaled.effectiveInputFill,
                              color: tokens.textIconColor,
                              fontSize: `${scaled.sublabelFontSize}px`,
                              padding: `${Math.round(6 * scaled.scale)}px ${Math.round(10 * scaled.scale)}px`,
                            }}
                            className="w-full outline-none border transition-colors focus:ring-1 focus:ring-neutral-900"
                          />
                          <div className="max-h-48 overflow-y-auto space-y-0.5 pt-1">
                            {filteredRoles.map((opt) => {
                              const isSelected = role === opt;
                              const isHovered = hoveredRole === opt;
                              return (
                                <motion.button
                                  key={opt}
                                  type="button"
                                  whileTap={{ scale: scaled.motionConfig.tapScale }}
                                  onMouseEnter={() => setHoveredRole(opt)}
                                  onMouseLeave={() => setHoveredRole(null)}
                                  onClick={() => {
                                    setRole(opt);
                                    setIsRoleOpen(false);
                                    setRoleFilter("");
                                  }}
                                  style={{
                                    borderRadius: `${scaled.scaledOptionRadius}px`,
                                    backgroundColor: isSelected ? tokens.primaryButtonColor : isHovered ? tokens.hoverBackplateTint : "transparent",
                                    color: isSelected ? "#FFFFFF" : tokens.textIconColor,
                                    fontSize: `${scaled.labelFontSize}px`,
                                    padding: `${Math.round(7 * scaled.scale)}px ${Math.round(10 * scaled.scale)}px`,
                                    transition: scaled.transitionStyle,
                                  }}
                                  className="w-full text-left flex items-center justify-between font-normal cursor-pointer select-none"
                                >
                                  <span>{opt}</span>
                                  {isSelected && (
                                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Architecture Anatomy Footer */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1 font-sans text-[11px]">
                      <span>Anatomy:</span>
                      <strong className="text-neutral-600">Atom:Button + Atom:KeyIcon + Atom:Chevron + FloatingMenu + OptionList</strong>
                    </span>
                    <span className="font-semibold text-neutral-500">Structured Menu Radius</span>
                  </div>
                </div>

                {/* ── MOLECULE 5: MULTI-TAG DECK ── */}
                <div id="mol-tag-deck" style={cardStyle} className="p-5 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                          TagDeck
                        </h2>
                        <span className="text-[10px] font-sans tabular-nums px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-semibold border border-neutral-200">
                          Composable Deck
                        </span>
                      </div>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Removable tag chips with calibrated container geometry, checkmark toggles, and spring animations.
                      </p>
                    </div>

                    <span className="text-[10px] font-sans tabular-nums font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                      {tags.length} Active Tags
                    </span>
                  </div>

                  <div ref={tagRef} className="relative space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px` }} className="block font-medium text-neutral-700">Project tags</label>

                    <div
                      style={{
                        borderRadius: tokens.cornerRadius === 999 ? `${Math.round(14 * scaled.scale)}px` : `${scaled.scaledRadius}px`,
                        borderColor: isTagOpen ? tokens.textIconColor : tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: scaled.effectiveInputFill,
                        minHeight: `${scaled.scaledHeight}px`,
                        padding: `${scaled.scaledPaddingY}px ${scaled.scaledPaddingX}px`,
                        boxShadow: isTagOpen
                          ? (scaled.isZeroBorder ? scaled.focusHalo : `0 0 0 3px ${tokens.textIconColor}12`)
                          : "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
                        transition: "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
                      }}
                      className="w-full flex flex-wrap items-center gap-1.5 border"
                    >
                      {/* Animated Tag Chips */}
                      <AnimatePresence>
                        {tags.map((item) => (
                          <motion.span
                            key={item}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={scaled.motionConfig.spring}
                            style={{
                              borderRadius: `${scaled.scaledRadius}px`,
                              fontSize: `${scaled.sublabelFontSize}px`,
                              backgroundColor: tokens.hoverBackplateTint,
                              borderColor: tokens.universalBorderColor,
                              borderWidth: `${tokens.borderWidth}px`,
                              color: tokens.textIconColor,
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 font-medium border"
                          >
                            <span>{item}</span>
                            <button
                              type="button"
                              onClick={(e) => handleRemoveTag(item, e)}
                              className="hover:text-red-600 transition-colors p-0.5 -mr-0.5 cursor-pointer"
                              title="Remove tag"
                            >
                              <X className="w-3 h-3" strokeWidth={2.5} />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>

                      {/* Clean SaaS "+ Add tag" Trigger Button */}
                      <motion.button
                        type="button"
                        whileTap={{ scale: scaled.motionConfig.tapScale }}
                        onClick={() => setIsTagOpen((prev) => !prev)}
                        style={{
                          borderRadius: `${scaled.scaledRadius}px`,
                          fontSize: `${scaled.sublabelFontSize}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          color: tokens.textIconColor,
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 font-medium border border-dashed hover:border-neutral-400 hover:bg-neutral-50 transition-colors cursor-pointer bg-white"
                      >
                        <Plus className="w-3 h-3 text-neutral-500" strokeWidth={2.5} />
                        <span>Add tag</span>
                      </motion.button>
                    </div>

                    {/* Tag Popover Dropdown adhering 100% to Universal Tokens */}
                    <AnimatePresence>
                      {isTagOpen && (
                        <motion.div
                          initial={scaled.motionConfig.popover.initial}
                          animate={scaled.motionConfig.popover.animate}
                          exit={scaled.motionConfig.popover.exit}
                          transition={scaled.motionConfig.popover.transition}
                          style={{
                            marginTop: `${tokens.menuOffsetGap}px`,
                            borderRadius: `${scaled.scaledMenuRadius}px`,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            backgroundColor: tokens.universalFillColor,
                            boxShadow: "0 10px 25px -4px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.03)",
                            padding: `${Math.round(6 * scaled.scale)}px`,
                          }}
                          className="absolute top-full left-0 right-0 z-30 space-y-1 border"
                        >
                          <input
                            type="text"
                            autoFocus
                            value={tagFilter}
                            onChange={(e) => setTagFilter(e.target.value)}
                            placeholder="Search tags..."
                            style={{
                              borderRadius: `${scaled.scaledInnerRadius}px`,
                              borderColor: tokens.universalBorderColor,
                              borderWidth: `${tokens.borderWidth}px`,
                              backgroundColor: scaled.effectiveInputFill,
                              color: tokens.textIconColor,
                              fontSize: `${scaled.sublabelFontSize}px`,
                              padding: `${Math.round(6 * scaled.scale)}px ${Math.round(10 * scaled.scale)}px`,
                            }}
                            className="w-full outline-none border transition-colors focus:ring-1 focus:ring-neutral-900"
                          />
                          <div className="max-h-48 overflow-y-auto space-y-0.5 pt-1">
                            {filteredTags.map((opt) => {
                              const isSelected = tags.includes(opt);
                              const isHovered = hoveredTag === opt;
                              return (
                                <div
                                  key={opt}
                                  onMouseEnter={() => setHoveredTag(opt)}
                                  onMouseLeave={() => setHoveredTag(null)}
                                  onClick={() => handleToggleTag(opt)}
                                  style={{
                                    borderRadius: `${scaled.scaledOptionRadius}px`,
                                    backgroundColor: isHovered ? tokens.hoverBackplateTint : "transparent",
                                    color: tokens.textIconColor,
                                    fontSize: `${scaled.labelFontSize}px`,
                                    padding: `${Math.round(7 * scaled.scale)}px ${Math.round(10 * scaled.scale)}px`,
                                  }}
                                  className="flex items-center justify-between cursor-pointer select-none"
                                >
                                  <span className={isSelected ? "font-semibold" : "font-normal"}>
                                    {opt}
                                  </span>
                                  <div
                                    style={{
                                      borderRadius: `${scaled.scaledCheckboxRadius}px`,
                                      backgroundColor: isSelected ? tokens.primaryButtonColor : tokens.universalFillColor,
                                      borderColor: isSelected ? tokens.primaryButtonColor : tokens.universalBorderColor,
                                      borderWidth: `${tokens.borderWidth}px`,
                                    }}
                                    className="w-4 h-4 flex items-center justify-center shrink-0 border transition-colors"
                                  >
                                    {isSelected && (
                                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Architecture Anatomy Footer */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1 font-sans text-[11px]">
                      <span>Anatomy:</span>
                      <strong className="text-neutral-600">Container + TagChips + PlusTrigger + PopoverChecklist</strong>
                    </span>
                    <span className="font-semibold text-neutral-500">Pill Mode Protected</span>
                  </div>
                </div>

                {/* ── MOLECULE 6: DATE RANGE PICKER ── */}
                <div id="mol-date-picker" style={cardStyle} className="p-5 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-neutral-500" />
                          <span>DateRangePicker</span>
                        </h2>
                        <span className="text-[10px] font-sans tabular-nums px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-semibold border border-neutral-200">
                          Temporal Filter
                        </span>
                      </div>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                        Trigger + Presets Matrix + Floating Popover
                      </span>
                    </div>

                    <span className="text-[11px] text-neutral-400 font-medium tabular-nums">
                      {dateRangeString}
                    </span>
                  </div>

                  <div ref={datePickerRef} className="relative space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px` }} className="block font-medium text-neutral-700">
                      Audit &amp; Query Period
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsDatePickerOpen((prev) => !prev)}
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: isDatePickerOpen ? tokens.textIconColor : tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: scaled.effectiveInputFill,
                        height: `${scaled.scaledHeight}px`,
                        paddingLeft: `${scaled.scaledPaddingX}px`,
                        paddingRight: `${scaled.scaledPaddingX}px`,
                        boxShadow: isDatePickerOpen
                          ? (scaled.isZeroBorder ? scaled.focusHalo : `0 0 0 3px ${tokens.textIconColor}12`)
                          : "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
                        transition: scaled.transitionStyle,
                      }}
                      className="w-full flex items-center justify-between text-left cursor-pointer border select-none font-medium tabular-nums text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Calendar className="w-4 h-4 text-neutral-400 shrink-0" strokeWidth={1.8} />
                        <span style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }} className="truncate">
                          {dateRangeString}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isDatePickerOpen ? 180 : 0 }}
                        transition={scaled.motionConfig.spring}
                        style={{
                          borderRadius: `${scaled.scaledInnerRadius}px`,
                          backgroundColor: tokens.hoverBackplateTint,
                          color: tokens.textIconColor,
                        }}
                        className="w-5 h-5 flex items-center justify-center shrink-0"
                      >
                        <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.2} />
                      </motion.div>
                    </button>

                    {/* Floating Popover adhering 100% to universal tokens & fluid motion */}
                    <AnimatePresence>
                      {isDatePickerOpen && (
                        <motion.div
                          initial={scaled.motionConfig.popover.initial}
                          animate={scaled.motionConfig.popover.animate}
                          exit={scaled.motionConfig.popover.exit}
                          transition={scaled.motionConfig.popover.transition}
                          style={{
                            marginTop: `${tokens.menuOffsetGap}px`,
                            borderRadius: `${scaled.scaledMenuRadius}px`,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            backgroundColor: tokens.universalFillColor,
                            boxShadow: "0 10px 25px -4px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.03)",
                            padding: `${Math.round(12 * scaled.scale)}px`,
                          }}
                          className="absolute top-full left-0 right-0 z-30 space-y-3 border"
                        >
                          <div className="space-y-1">
                            <span style={{ fontSize: `${scaled.sublabelFontSize - 1}px` }} className="text-neutral-400 font-semibold uppercase tracking-wider block">
                              Quick Presets
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 relative">
                              {[
                                { id: "7d", label: "Last 7 Days", range: "Oct 31, 2026 – Nov 06, 2026" },
                                { id: "30d", label: "Last 30 Days", range: "Oct 08, 2026 – Nov 06, 2026" },
                                { id: "quarter", label: "This Quarter", range: "Oct 01, 2026 – Dec 31, 2026" },
                                { id: "custom", label: "Year to Date", range: "Jan 01, 2026 – Nov 06, 2026" },
                              ].map((p) => {
                                const isSelected = datePreset === p.id;
                                return (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => {
                                      setDatePreset(p.id as any);
                                      setDateRangeString(p.range);
                                    }}
                                    style={{
                                      borderRadius: `${scaled.scaledOptionRadius}px`,
                                      fontSize: `${scaled.sublabelFontSize}px`,
                                      padding: `${Math.round(6 * scaled.scale)}px ${Math.round(8 * scaled.scale)}px`,
                                    }}
                                    className={`font-medium cursor-pointer text-center select-none relative transition-colors ${
                                      isSelected ? "text-white font-semibold" : "text-neutral-600 hover:text-black hover:bg-neutral-100"
                                    }`}
                                  >
                                    {isSelected && (
                                      <motion.div
                                        layoutId="activeDatePresetPill"
                                        transition={scaled.motionConfig.pillTransition}
                                        style={{
                                          borderRadius: `${scaled.scaledOptionRadius}px`,
                                          backgroundColor: tokens.primaryButtonColor,
                                        }}
                                        className="absolute inset-0 -z-10 shadow-xs"
                                      />
                                    )}
                                    <span className="relative z-10">{p.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                            <div className="text-[11px] text-neutral-500 tabular-nums">
                              Selected: <span className="font-semibold text-neutral-900">{dateRangeString}</span>
                            </div>
                            <motion.button
                              type="button"
                              whileTap={{ scale: scaled.motionConfig.tapScale }}
                              onClick={() => {
                                setIsDatePickerOpen(false);
                                triggerToast(`Applied date filter: ${dateRangeString}`);
                              }}
                              style={{
                                borderRadius: `${scaled.scaledInnerRadius}px`,
                                backgroundColor: tokens.primaryButtonColor,
                                color: "#FFFFFF",
                                fontSize: `${scaled.sublabelFontSize}px`,
                                padding: `${Math.round(5 * scaled.scale)}px ${Math.round(14 * scaled.scale)}px`,
                              }}
                              className="font-semibold cursor-pointer shadow-xs hover:bg-neutral-800 transition-colors"
                            >
                              Apply Range
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Architecture Anatomy Footer */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1 font-sans text-[11px]">
                      <span>Anatomy:</span>
                      <strong className="text-neutral-600">Atom:Button + Atom:CalendarIcon + SlidingPresets + ActionFooter</strong>
                    </span>
                    <span className="font-semibold text-neutral-500">Sliding LayoutId Active</span>
                  </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
                    CATEGORY 2: NAVIGATION & COMMANDS
                   ══════════════════════════════════════════════════════════ */}
                <div id="category-section-cat2" className="w-full pt-6 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-neutral-900">
                    <div className="flex items-center gap-2.5">
                      <div
                        style={{ borderRadius: `${scaled.scaledInnerRadius}px` }}
                        className="w-7 h-7 bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shadow-xs"
                      >
                        02
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                          Navigation &amp; Wayfinding Commands
                        </h2>
                        <p className="text-[11px] text-neutral-500">
                          Framer Motion segmented pill transitions, hierarchical wayfinding routes, and fluid pagination controls.
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-neutral-600 bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 rounded-full">
                      3 Production Molecules
                    </span>
                  </div>
                </div>

                {/* ── MOLECULE 7: SEGMENTED CONTROL ── */}
                <div id="mol-segmented" style={cardStyle} className="p-5 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                          SegmentedControl
                        </h2>
                        <span className="text-[10px] font-sans tabular-nums px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-semibold border border-neutral-200">
                          Sliding Switcher
                        </span>
                      </div>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                        Framer Motion layoutId sliding pill + Motion Physics binding
                      </span>
                    </div>

                    <span className="text-[11px] text-neutral-400 font-medium">
                      Active: <strong className="text-neutral-900 capitalize">{segmentValue}</strong>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px` }} className="block font-medium text-neutral-700">Billing frequency</label>
                    <div
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        padding: `${Math.round(3 * scaled.scale)}px`,
                      }}
                      className="inline-flex items-center gap-1 border relative"
                    >
                      {(
                        [
                          { key: "monthly", label: "Monthly" },
                          { key: "quarterly", label: "Quarterly" },
                          { key: "annual", label: "Annual (Save 20%)" },
                        ] as const
                      ).map(({ key, label }) => {
                        const isSelected = segmentValue === key;
                        return (
                          <motion.button
                            key={key}
                            type="button"
                            whileTap={{ scale: scaled.motionConfig.tapScale }}
                            onClick={() => {
                              setSegmentValue(key);
                              triggerToast(`Selected plan billing: ${label}`);
                            }}
                            style={{
                              borderRadius: tokens.cornerRadius === 999 ? "9999px" : `${scaled.scaledInnerRadius}px`,
                              fontSize: `${scaled.sublabelFontSize}px`,
                              padding: `${Math.round(5 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                            }}
                            className={`font-medium cursor-pointer relative z-10 transition-colors select-none ${
                              isSelected ? "text-white font-semibold" : "text-neutral-500 hover:text-neutral-900"
                            }`}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="activeSegmentPill"
                                transition={scaled.motionConfig.pillTransition}
                                style={{
                                  borderRadius: tokens.cornerRadius === 999 ? "9999px" : `${scaled.scaledInnerRadius}px`,
                                  backgroundColor: tokens.primaryButtonColor,
                                }}
                                className="absolute inset-0 shadow-sm -z-10"
                              />
                            )}
                            {label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Architecture Anatomy Footer */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1 font-sans text-[11px]">
                      <span>Anatomy:</span>
                      <strong className="text-neutral-600">ContainerTrack + SlidingActivePill + SegmentButtons</strong>
                    </span>
                    <span className="font-semibold text-neutral-500">Fluid Physics Connected</span>
                  </div>
                </div>

                {/* ── MOLECULE 8: BREADCRUMBS ── */}
                <div id="mol-breadcrumbs" style={cardStyle} className="p-5 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900 flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-neutral-500" />
                          <span>Breadcrumbs</span>
                        </h2>
                        <span className="text-[10px] font-sans tabular-nums px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-semibold border border-neutral-200">
                          Route Wayfinding
                        </span>
                      </div>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                        Hierarchical route + Collapsed Overflow Popover + Chevrons
                      </span>
                    </div>

                    <span className="text-[11px] text-neutral-400 font-medium">
                      4 Levels Deep
                    </span>
                  </div>

                  <nav className="flex items-center gap-1.5 flex-wrap text-xs pt-1 select-none">
                    <button
                      type="button"
                      onClick={() => triggerToast("Navigated to: Infrastructure Root")}
                      className="text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 px-2 py-1 rounded-md transition-colors font-medium cursor-pointer"
                    >
                      Infrastructure
                    </button>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" strokeWidth={2} />

                    {/* Interactive Collapsed Overflow Menu */}
                    <div ref={breadcrumbMenuRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setIsBreadcrumbMenuOpen((prev) => !prev)}
                        style={{
                          borderRadius: `${scaled.scaledInnerRadius}px`,
                        }}
                        className="px-1.5 py-0.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors font-bold cursor-pointer"
                        title="Show intermediate routes"
                      >
                        ...
                      </button>

                      <AnimatePresence>
                        {isBreadcrumbMenuOpen && (
                          <motion.div
                            initial={scaled.motionConfig.popover.initial}
                            animate={scaled.motionConfig.popover.animate}
                            exit={scaled.motionConfig.popover.exit}
                            transition={scaled.motionConfig.popover.transition}
                            style={{
                              borderRadius: `${scaled.scaledMenuRadius}px`,
                              borderColor: tokens.universalBorderColor,
                              borderWidth: `${tokens.borderWidth}px`,
                              backgroundColor: tokens.universalFillColor,
                              boxShadow: "0 10px 25px -4px rgba(0,0,0,0.12)",
                              padding: "4px",
                            }}
                            className="absolute top-full left-0 mt-1 w-44 z-30 border space-y-0.5 text-left"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setIsBreadcrumbMenuOpen(false);
                                triggerToast("Navigated to: AWS US-East Region");
                              }}
                              style={{ borderRadius: `${scaled.scaledOptionRadius}px` }}
                              className="w-full text-left px-2.5 py-1.5 text-xs text-neutral-700 hover:bg-neutral-100 flex items-center justify-between cursor-pointer"
                            >
                              <span>US-East Clusters</span>
                              <ChevronRight className="w-3 h-3 text-neutral-400" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsBreadcrumbMenuOpen(false);
                                triggerToast("Navigated to: Production Cluster A");
                              }}
                              style={{ borderRadius: `${scaled.scaledOptionRadius}px` }}
                              className="w-full text-left px-2.5 py-1.5 text-xs text-neutral-700 hover:bg-neutral-100 flex items-center justify-between cursor-pointer"
                            >
                              <span>Production Cluster A</span>
                              <ChevronRight className="w-3 h-3 text-neutral-400" />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" strokeWidth={2} />
                    <button
                      type="button"
                      onClick={() => triggerToast("Navigated to: Production Node-4")}
                      className="text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 px-2 py-1 rounded-md transition-colors font-medium cursor-pointer"
                    >
                      Production Node-4
                    </button>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" strokeWidth={2} />
                    <span
                      style={{
                        borderRadius: `${scaled.scaledInnerRadius}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                        color: tokens.textIconColor,
                      }}
                      className="px-2.5 py-1 font-semibold flex items-center gap-1.5 shadow-2xs"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Telemetry Metrics</span>
                    </span>
                  </nav>

                  {/* Architecture Anatomy Footer */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1 font-sans text-[11px]">
                      <span>Anatomy:</span>
                      <strong className="text-neutral-600">Nav + WaypointItems + ChevronDelimiters + OverflowMenu + ActiveLeaf</strong>
                    </span>
                    <span className="font-semibold text-neutral-500">Live Overflow Menu</span>
                  </div>
                </div>

                {/* ── MOLECULE 9: PAGINATION BAR ── */}
                <div id="mol-pagination" style={cardStyle} className="p-5 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900 flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-neutral-500" />
                          <span>PaginationBar</span>
                        </h2>
                        <span className="text-[10px] font-sans tabular-nums px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-semibold border border-neutral-200">
                          Data Navigation
                        </span>
                      </div>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                        Summary + Custom Popover + Fluid Sliding Page Indicator
                      </span>
                    </div>

                    <span className="text-[11px] text-neutral-400 font-medium tabular-nums">
                      Page {currentPage} of 15
                    </span>
                  </div>

                  <div
                    style={{
                      borderRadius: `${scaled.scaledMenuRadius}px`,
                      borderWidth: `${tokens.borderWidth}px`,
                      borderColor: tokens.universalBorderColor,
                      backgroundColor: scaled.effectiveInputFill,
                      boxShadow: scaled.isZeroBorder ? scaled.focusHalo : "none",
                      padding: `${Math.round(8 * scaled.scale)}px ${Math.round(14 * scaled.scale)}px`,
                    }}
                    className="border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
                  >
                    {/* Record Range Text in Tabular figures */}
                    <div style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 tabular-nums">
                      Showing <span className="font-semibold text-neutral-900">{(currentPage - 1) * pageSize + 1}</span>–
                      <span className="font-semibold text-neutral-900">{Math.min(currentPage * pageSize, 148)}</span> of{" "}
                      <span className="font-semibold text-neutral-900">148</span> candidate records
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                      {/* Rows per page selector - ZeroLight Tokenized Custom Popover (NO native select!) */}
                      <div ref={pageSizeRef} className="relative flex items-center gap-1.5">
                        <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">Rows:</span>
                        <button
                          type="button"
                          onClick={() => setIsPageSizeOpen((prev) => !prev)}
                          style={{
                            borderRadius: `${scaled.scaledInnerRadius}px`,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            backgroundColor: tokens.universalFillColor,
                            color: tokens.textIconColor,
                            fontSize: `${scaled.sublabelFontSize}px`,
                            height: `${Math.round(28 * scaled.scale)}px`,
                            padding: "0 8px",
                          }}
                          className="border flex items-center gap-1.5 font-medium cursor-pointer hover:bg-neutral-50 transition-colors select-none"
                        >
                          <span>{pageSize}</span>
                          <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${isPageSizeOpen ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                          {isPageSizeOpen && (
                            <motion.div
                              initial={scaled.motionConfig.popover.initial}
                              animate={scaled.motionConfig.popover.animate}
                              exit={scaled.motionConfig.popover.exit}
                              transition={scaled.motionConfig.popover.transition}
                              style={{
                                borderRadius: `${scaled.scaledMenuRadius}px`,
                                borderColor: tokens.universalBorderColor,
                                borderWidth: `${tokens.borderWidth}px`,
                                backgroundColor: tokens.universalFillColor,
                                boxShadow: "0 10px 25px -4px rgba(0,0,0,0.12)",
                                padding: "4px",
                              }}
                              className="absolute bottom-full mb-1.5 left-8 w-20 z-40 space-y-0.5 border"
                            >
                              {[10, 25, 50].map((size) => {
                                const isSelected = pageSize === size;
                                return (
                                  <button
                                    key={size}
                                    type="button"
                                    onClick={() => {
                                      setPageSize(size);
                                      setIsPageSizeOpen(false);
                                      triggerToast(`Page size set to ${size} rows`);
                                    }}
                                    style={{
                                      borderRadius: `${scaled.scaledOptionRadius}px`,
                                      backgroundColor: isSelected ? tokens.primaryButtonColor : "transparent",
                                      color: isSelected ? "#FFFFFF" : tokens.textIconColor,
                                      fontSize: `${scaled.sublabelFontSize}px`,
                                      padding: "4px 8px",
                                    }}
                                    className="w-full text-left flex items-center justify-between font-medium cursor-pointer transition-colors"
                                  >
                                    <span>{size}</span>
                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Previous Button */}
                      <motion.button
                        type="button"
                        whileTap={{ scale: scaled.motionConfig.tapScale }}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        style={{
                          borderRadius: `${scaled.scaledInnerRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.universalFillColor,
                          color: currentPage === 1 ? "#A3A3A3" : tokens.textIconColor,
                          height: `${Math.round(28 * scaled.scale)}px`,
                          padding: "0 8px",
                          fontSize: `${scaled.sublabelFontSize}px`,
                        }}
                        className="border flex items-center gap-1 font-medium cursor-pointer disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Prev</span>
                      </motion.button>

                      {/* Page Numbers with Fluid Sliding Pill */}
                      <div className="flex items-center gap-1 tabular-nums">
                        {[1, 2, 3, 4, 15].map((pageNum, idx) => {
                          const isActive = currentPage === pageNum;
                          return (
                            <React.Fragment key={pageNum}>
                              {idx === 4 && <span className="text-neutral-400 px-1">...</span>}
                              <motion.button
                                type="button"
                                whileTap={{ scale: scaled.motionConfig.tapScale }}
                                onClick={() => setCurrentPage(pageNum)}
                                style={{
                                  borderRadius: `${scaled.scaledInnerRadius}px`,
                                  color: isActive ? "#FFFFFF" : tokens.textIconColor,
                                  width: `${Math.round(28 * scaled.scale)}px`,
                                  height: `${Math.round(28 * scaled.scale)}px`,
                                  fontSize: `${scaled.sublabelFontSize}px`,
                                }}
                                className="font-semibold flex items-center justify-center cursor-pointer transition-colors relative select-none"
                              >
                                {isActive && (
                                  <motion.div
                                    layoutId="activePagePill"
                                    transition={scaled.motionConfig.pillTransition}
                                    style={{
                                      borderRadius: `${scaled.scaledInnerRadius}px`,
                                      backgroundColor: tokens.primaryButtonColor,
                                    }}
                                    className="absolute inset-0 -z-10 shadow-xs"
                                  />
                                )}
                                <span className="relative z-10">{pageNum}</span>
                              </motion.button>
                            </React.Fragment>
                          );
                        })}
                      </div>

                      {/* Next Button */}
                      <motion.button
                        type="button"
                        whileTap={{ scale: scaled.motionConfig.tapScale }}
                        disabled={currentPage === 15}
                        onClick={() => setCurrentPage((p) => Math.min(15, p + 1))}
                        style={{
                          borderRadius: `${scaled.scaledInnerRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.universalFillColor,
                          color: currentPage === 15 ? "#A3A3A3" : tokens.textIconColor,
                          height: `${Math.round(28 * scaled.scale)}px`,
                          padding: "0 8px",
                          fontSize: `${scaled.sublabelFontSize}px`,
                        }}
                        className="border flex items-center gap-1 font-medium cursor-pointer disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Architecture Anatomy Footer */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1 font-sans text-[11px]">
                      <span>Anatomy:</span>
                      <strong className="text-neutral-600">RecordSummary + PopoverSelector + SlidingPageNumbers + PrevNext</strong>
                    </span>
                    <span className="font-semibold text-neutral-500">Sliding Page Pill Active</span>
                  </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
                    CATEGORY 3: DATA DISPLAY & ANALYTICS
                   ══════════════════════════════════════════════════════════ */}
                <div id="category-section-cat3" className="w-full pt-6 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-neutral-900">
                    <div className="flex items-center gap-2.5">
                      <div
                        style={{ borderRadius: `${scaled.scaledInnerRadius}px` }}
                        className="w-7 h-7 bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shadow-xs"
                      >
                        03
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                          Data Display &amp; Analytics Telemetry
                        </h2>
                        <p className="text-[11px] text-neutral-500">
                          Real-time KPI metrics with time horizon switcher, live sparklines, and expandable tabular financial records.
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-neutral-600 bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 rounded-full">
                      2 Production Molecules
                    </span>
                  </div>
                </div>

                {/* ── MOLECULE 10: METRIC STAT MOLECULE ── */}
                <div id="mol-metric-stat" style={cardStyle} className="p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                          MetricStat
                        </h2>
                        <span className="text-[10px] font-sans tabular-nums px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-semibold border border-neutral-200">
                          Telemetry KPI
                        </span>
                      </div>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                        KPI Counter + Horizon Switcher + Live Sparkline
                      </span>
                    </div>

                    {/* Interactive Horizon Switcher */}
                    <div
                      style={{ borderRadius: `${scaled.scaledInnerRadius}px` }}
                      className="flex items-center gap-1 bg-neutral-100 p-0.5 border border-neutral-200"
                    >
                      {(["24h", "7d", "30d", "1y"] as const).map((h) => {
                        const isSelected = metricHorizon === h;
                        return (
                          <button
                            key={h}
                            type="button"
                            onClick={() => {
                              setMetricHorizon(h);
                              triggerToast(`Telemetry range set to ${h}`);
                            }}
                            className={`px-2 py-0.5 text-[11px] font-semibold cursor-pointer relative transition-colors ${
                              isSelected ? "text-white" : "text-neutral-500 hover:text-neutral-900"
                            }`}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="metricHorizonPill"
                                transition={scaled.motionConfig.pillTransition}
                                style={{
                                  borderRadius: `${scaled.scaledInnerRadius}px`,
                                  backgroundColor: tokens.primaryButtonColor,
                                }}
                                className="absolute inset-0 -z-10 shadow-xs"
                              />
                            )}
                            <span className="relative z-10">{h}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 font-medium block">
                        Net Revenue Run Rate
                      </span>
                      <div className="flex items-baseline gap-2 pt-0.5">
                        <motion.span
                          key={metricHorizon}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={scaled.motionConfig.spring}
                          style={{ fontSize: `${scaled.headingFontSize + 8}px` }}
                          className="font-semibold text-neutral-900 tracking-tight tabular-nums"
                        >
                          {metricHorizon === "24h" && "$4,820"}
                          {metricHorizon === "7d" && "$34,150"}
                          {metricHorizon === "30d" && "$148,200"}
                          {metricHorizon === "1y" && "$1,780,000"}
                        </motion.span>
                        <motion.span
                          key={`delta-${metricHorizon}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={scaled.motionConfig.spring}
                          style={{
                            fontSize: `${scaled.sublabelFontSize}px`,
                            borderRadius: `${scaled.scaledRadius}px`,
                          }}
                          className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 font-medium inline-flex items-center gap-1 select-none tabular-nums"
                        >
                          <TrendingUp className="w-3 h-3 text-emerald-600" strokeWidth={2.5} />
                          <span>
                            {metricHorizon === "24h" && "+8.2%"}
                            {metricHorizon === "7d" && "+12.6%"}
                            {metricHorizon === "30d" && "+18.4%"}
                            {metricHorizon === "1y" && "+34.2%"}
                          </span>
                        </motion.span>
                      </div>
                    </div>

                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">
                      vs. previous {metricHorizon} period
                    </span>
                  </div>

                  {/* Interactive Mini Sparkline */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 font-medium pb-1">
                      <span>Telemetry Trajectory</span>
                      <span>Hover node for point revenue</span>
                    </div>
                    <div className="h-16 w-full relative flex items-center">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 300 60" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="metricGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0,50 Q 50,45 100,35 T 200,20 T 300,8 L 300,60 L 0,60 Z"
                          fill="url(#metricGrad)"
                        />
                        <path
                          d="M 0,50 Q 50,45 100,35 T 200,20 T 300,8"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        {[
                          { cx: 0, cy: 50, val: "$120k", date: "Day 1" },
                          { cx: 75, cy: 40, val: "$128k", date: "Day 8" },
                          { cx: 150, cy: 30, val: "$136k", date: "Day 15" },
                          { cx: 225, cy: 18, val: "$142k", date: "Day 22" },
                          { cx: 300, cy: 8, val: "$148k", date: "Today" },
                        ].map((pt, idx) => (
                          <g key={idx} className="cursor-pointer">
                            <circle
                              cx={pt.cx}
                              cy={pt.cy}
                              r={hoveredSparkPoint === idx ? 5 : 3.5}
                              fill="#10B981"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                              onMouseEnter={() => setHoveredSparkPoint(idx)}
                              onMouseLeave={() => setHoveredSparkPoint(null)}
                              className="transition-all"
                            />
                            {hoveredSparkPoint === idx && (
                              <text
                                x={Math.min(270, Math.max(30, pt.cx))}
                                y={pt.cy - 10}
                                textAnchor="middle"
                                className="text-[10px] font-bold fill-neutral-900"
                              >
                                {pt.val} ({pt.date})
                              </text>
                            )}
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>

                  {/* Architecture Anatomy Footer */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1 font-sans text-[11px]">
                      <span>Anatomy:</span>
                      <strong className="text-neutral-600">MetricLabel + HorizonSwitch + ValueCounter + TrendBadge + Sparkline</strong>
                    </span>
                    <span className="font-semibold text-neutral-500">Interactive Telemetry</span>
                  </div>
                </div>

                {/* ── MOLECULE 11: DATA TABLE ROW ── */}
                <div id="mol-table-row" style={cardStyle} className="p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-neutral-500" />
                          <span>DataTableRow</span>
                        </h2>
                        <span className="text-[10px] font-sans tabular-nums px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-semibold border border-neutral-200">
                          Expandable Record
                        </span>
                      </div>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Multi-select checkbox, status pill, tabular figures, and click-to-expand telemetry details.
                      </p>
                    </div>
                    <span
                      style={{ borderRadius: `${scaled.scaledInnerRadius}px` }}
                      className="text-[11px] bg-neutral-100 text-neutral-700 px-2.5 py-1 border border-neutral-200 font-medium"
                    >
                      Click row to expand
                    </span>
                  </div>

                  {/* Financial Table Row Preview */}
                  <div
                    style={{
                      borderRadius: `${scaled.scaledMenuRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                    }}
                    className="border overflow-hidden bg-white"
                  >
                    <table className="w-full text-xs">
                      <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500">
                        <tr>
                          <th className="w-10 py-2.5 px-3 text-center">
                            <span className="sr-only">Select</span>
                          </th>
                          <th className="py-2.5 px-3.5 text-left font-semibold uppercase tracking-wider text-[10px]">Invoice / Batch</th>
                          <th className="py-2.5 px-3.5 text-left font-semibold uppercase tracking-wider text-[10px]">Plan Tier</th>
                          <th className="py-2.5 px-3.5 text-right font-semibold uppercase tracking-wider text-[10px]">Usage (GB)</th>
                          <th className="py-2.5 px-3.5 text-right font-semibold uppercase tracking-wider text-[10px]">Growth Delta</th>
                          <th className="py-2.5 px-3.5 text-right font-semibold uppercase tracking-wider text-[10px]">Settled Amount</th>
                          <th className="py-2.5 px-3.5 text-center font-semibold uppercase tracking-wider text-[10px]">Status</th>
                          <th className="w-12 py-2.5 px-3 text-center">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 tabular-nums">
                        {[
                          { id: "INV-2627-101", plan: "Enterprise Dedicated", usage: "1,840 GB", delta: "+14.8%", amount: "$ 42,500.00", status: "Settled", region: "AWS us-east-1", node: "cluster-primary-a", latency: "14ms" },
                          { id: "INV-2627-102", plan: "Pro Scale Cluster", usage: "920 GB", delta: "-3.2%", amount: "$ 19,850.00", status: "Auditing", region: "GCP us-central1", node: "worker-pool-8", latency: "22ms" },
                        ].map((row) => {
                          const isRowSelected = selectedTableRows.includes(row.id);
                          const isExpanded = expandedRowId === row.id;
                          return (
                            <React.Fragment key={row.id}>
                              <tr
                                onClick={() => setExpandedRowId((prev) => (prev === row.id ? null : row.id))}
                                className={`hover:bg-neutral-50/80 transition-colors cursor-pointer select-none ${
                                  isExpanded ? "bg-neutral-50/50" : ""
                                }`}
                              >
                                <td className="w-10 py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                                  <div
                                    onClick={() => {
                                      setSelectedTableRows((prev) =>
                                        prev.includes(row.id) ? prev.filter((id) => id !== row.id) : [...prev, row.id]
                                      );
                                    }}
                                    style={{
                                      borderRadius: `${scaled.scaledCheckboxRadius}px`,
                                      backgroundColor: isRowSelected ? tokens.primaryButtonColor : tokens.universalFillColor,
                                      borderColor: isRowSelected ? tokens.primaryButtonColor : tokens.universalBorderColor,
                                      borderWidth: `${tokens.borderWidth}px`,
                                    }}
                                    className="w-4 h-4 flex items-center justify-center cursor-pointer border mx-auto transition-colors"
                                  >
                                    {isRowSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                  </div>
                                </td>
                                <td className="py-2.5 px-3.5 font-medium text-neutral-900 flex items-center gap-1.5">
                                  <span>{row.id}</span>
                                  <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                </td>
                                <td className="py-2.5 px-3.5 text-neutral-600 font-normal">{row.plan}</td>
                                <td className="py-2.5 px-3.5 text-right text-neutral-700 font-medium">{row.usage}</td>
                                <td className={`py-2.5 px-3.5 text-right font-semibold ${row.delta.startsWith("+") ? "text-emerald-600" : "text-rose-600"}`}>
                                  <span className="inline-flex items-center gap-1 justify-end">
                                    {row.delta.startsWith("+") && <TrendingUp className="w-3 h-3" />}
                                    {row.delta}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3.5 text-right font-bold text-neutral-900">{row.amount}</td>
                                <td className="py-2.5 px-3.5 text-center">
                                  <span
                                    style={{ borderRadius: `${scaled.scaledRadius}px` }}
                                    className={`px-2 py-0.5 text-[10px] font-semibold border ${
                                      row.status === "Settled"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                    }`}
                                  >
                                    {row.status}
                                  </span>
                                </td>
                                <td className="w-12 py-2.5 px-3 text-center relative" onClick={(e) => e.stopPropagation()}>
                                  <div ref={row.id === "INV-2627-101" ? rowActionsRef : undefined} className="relative inline-block text-right">
                                    <button
                                      type="button"
                                      onClick={() => setIsRowActionsOpen((prev) => !prev)}
                                      style={{
                                        borderRadius: `${scaled.scaledInnerRadius}px`,
                                        padding: "4px 6px",
                                      }}
                                      className="text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </button>

                                    <AnimatePresence>
                                      {isRowActionsOpen && row.id === "INV-2627-101" && (
                                        <motion.div
                                          initial={scaled.motionConfig.popover.initial}
                                          animate={scaled.motionConfig.popover.animate}
                                          exit={scaled.motionConfig.popover.exit}
                                          transition={scaled.motionConfig.popover.transition}
                                          style={{
                                            borderRadius: `${scaled.scaledMenuRadius}px`,
                                            borderColor: tokens.universalBorderColor,
                                            borderWidth: `${tokens.borderWidth}px`,
                                            backgroundColor: tokens.universalFillColor,
                                            boxShadow: "0 10px 25px -4px rgba(0,0,0,0.12)",
                                          }}
                                          className="absolute right-0 top-full mt-1 w-44 p-1 z-30 border space-y-0.5 text-left"
                                        >
                                          <button
                                            type="button"
                                            onClick={() => { setIsRowActionsOpen(false); triggerToast("Opening batch invoice details"); }}
                                            style={{ borderRadius: `${scaled.scaledOptionRadius}px` }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs text-neutral-700 hover:bg-neutral-100 flex items-center gap-2 cursor-pointer"
                                          >
                                            <FileText className="w-3.5 h-3.5 text-neutral-400" />
                                            <span>View Invoice</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => { setIsRowActionsOpen(false); triggerToast("Downloading PDF audit receipt"); }}
                                            style={{ borderRadius: `${scaled.scaledOptionRadius}px` }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs text-neutral-700 hover:bg-neutral-100 flex items-center gap-2 cursor-pointer"
                                          >
                                            <Download className="w-3.5 h-3.5 text-neutral-400" />
                                            <span>Download Audit PDF</span>
                                          </button>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </td>
                              </tr>

                              {/* Fluid Animated Expandable Detail Row */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <tr>
                                    <td colSpan={8} className="p-0 border-b border-neutral-200">
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={scaled.motionConfig.spring}
                                        className="bg-neutral-50/60 p-3.5 space-y-2 border-t border-neutral-100 overflow-hidden text-xs"
                                      >
                                        <div className="flex items-center justify-between text-neutral-500 font-medium">
                                          <span>Expanded Telemetry Payload</span>
                                          <span className="font-sans tabular-nums text-[10px]">SHA-256: 8f9a2b10cd4e...</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div
                                            style={{ borderRadius: `${scaled.scaledInnerRadius}px` }}
                                            className="bg-white p-2.5 border border-neutral-200"
                                          >
                                            <div className="text-[10px] text-neutral-400 font-semibold uppercase">Cluster Region</div>
                                            <div className="font-semibold text-neutral-800">{row.region}</div>
                                          </div>
                                          <div
                                            style={{ borderRadius: `${scaled.scaledInnerRadius}px` }}
                                            className="bg-white p-2.5 border border-neutral-200"
                                          >
                                            <div className="text-[10px] text-neutral-400 font-semibold uppercase">Routing Target</div>
                                            <div className="font-semibold text-neutral-800">{row.node}</div>
                                          </div>
                                          <div
                                            style={{ borderRadius: `${scaled.scaledInnerRadius}px` }}
                                            className="bg-white p-2.5 border border-neutral-200"
                                          >
                                            <div className="text-[10px] text-neutral-400 font-semibold uppercase">Roundtrip Latency</div>
                                            <div className="font-semibold text-emerald-600">{row.latency}</div>
                                          </div>
                                        </div>
                                      </motion.div>
                                    </td>
                                  </tr>
                                )}
                              </AnimatePresence>
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Architecture Anatomy Footer */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1 font-sans text-[11px]">
                      <span>Anatomy:</span>
                      <strong className="text-neutral-600">TableHead + TableRow + Checkbox + StatusPill + ActionPopover + ExpandableDrawer</strong>
                    </span>
                    <span className="font-semibold text-neutral-500">Row Expansion Active</span>
                  </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
                    CATEGORY 4: FEEDBACK & OVERLAYS
                   ══════════════════════════════════════════════════════════ */}
                <div id="category-section-cat4" className="w-full pt-6 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-neutral-900">
                    <div className="flex items-center gap-2.5">
                      <div
                        style={{ borderRadius: `${scaled.scaledInnerRadius}px` }}
                        className="w-7 h-7 bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shadow-xs"
                      >
                        04
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                          Feedback &amp; Contextual Overlays
                        </h2>
                        <p className="text-[11px] text-neutral-500">
                          Multi-variant semantic alert callouts, zero-data empty state triggers, and contextual hover popover tooltips.
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-neutral-600 bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 rounded-full">
                      3 Production Molecules
                    </span>
                  </div>
                </div>

                {/* ── MOLECULE 12: ALERT CALLOUT (SEMANTIC FEEDBACK BANNER) ── */}
                <div id="mol-alert-callout" style={cardStyle} className="p-5 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-neutral-500" />
                          <span>AlertCallout</span>
                        </h2>
                        <span className="text-[10px] font-sans tabular-nums px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-semibold border border-neutral-200">
                          Semantic Alert
                        </span>
                      </div>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                        Icon + Severity Heading + Body Copy + Dismiss Action
                      </span>
                    </div>

                    <div
                      style={{ borderRadius: `${scaled.scaledInnerRadius}px` }}
                      className="flex items-center gap-1 bg-neutral-100 p-0.5 border border-neutral-200"
                    >
                      {(["info", "warning", "success", "critical"] as const).map((v) => {
                        const isSelected = alertVariant === v;
                        return (
                          <button
                            key={v}
                            type="button"
                            onClick={() => {
                              setAlertVariant(v);
                              setIsAlertDismissed(false);
                            }}
                            className={`px-2 py-0.5 text-[11px] capitalize font-medium cursor-pointer relative transition-colors ${
                              isSelected ? "text-white font-semibold" : "text-neutral-500 hover:text-neutral-900"
                            }`}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="activeAlertVariant"
                                transition={scaled.motionConfig.pillTransition}
                                style={{
                                  borderRadius: `${scaled.scaledInnerRadius}px`,
                                  backgroundColor: tokens.primaryButtonColor,
                                }}
                                className="absolute inset-0 -z-10 shadow-xs"
                              />
                            )}
                            <span className="relative z-10">{v}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {!isAlertDismissed ? (
                      <motion.div
                        key={alertVariant}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={scaled.motionConfig.spring}
                        style={{
                          borderRadius: `${scaled.scaledMenuRadius}px`,
                          borderWidth: `${tokens.borderWidth}px`,
                          borderColor:
                            alertVariant === "critical"
                              ? "#FCA5A5"
                              : alertVariant === "warning"
                              ? "#FCD34D"
                              : alertVariant === "success"
                              ? "#86EFAC"
                              : tokens.universalBorderColor,
                          backgroundColor:
                            alertVariant === "critical"
                              ? "#FEF2F2"
                              : alertVariant === "warning"
                              ? "#FFFBEB"
                              : alertVariant === "success"
                              ? "#F0FDF4"
                              : tokens.universalFillColor,
                          boxShadow: scaled.isZeroBorder ? scaled.focusHalo : "0 1px 2px 0 rgba(0,0,0,0.02)",
                          padding: `${Math.round(14 * scaled.scale)}px ${Math.round(16 * scaled.scale)}px`,
                        }}
                        className="border flex items-start gap-3 relative transition-all"
                      >
                        <div className="shrink-0 mt-0.5">
                          {alertVariant === "critical" && <AlertCircle className="w-4 h-4 text-rose-600" />}
                          {alertVariant === "warning" && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                          {alertVariant === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          {alertVariant === "info" && <Info className="w-4 h-4 text-neutral-700" />}
                        </div>

                        <div className="flex-1 space-y-1">
                          <div style={{ fontSize: `${scaled.labelFontSize}px` }} className="font-semibold text-neutral-900">
                            {alertVariant === "critical" && "Payment Gateway Authorization Failed"}
                            {alertVariant === "warning" && "API Rate Quota Nearing Threshold (88%)"}
                            {alertVariant === "success" && "Database Migration Successfully Applied"}
                            {alertVariant === "info" && "Scheduled System Maintenance Window"}
                          </div>
                          <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-600 leading-relaxed font-normal">
                            {alertVariant === "critical" && "Your monthly cluster subscription could not be charged. Automated retries will run in 24 hours."}
                            {alertVariant === "warning" && "Your workspace has consumed 88,400 of 100,000 monthly API calls. Upgrade your plan to prevent throttling."}
                            {alertVariant === "success" && "Schema batch #2026-v8 deployed to all 4 multi-region clusters with zero downtime."}
                            {alertVariant === "info" && "ZeroLight cluster telemetry upgrades are scheduled for Sunday 02:00 UTC."}
                          </p>
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => triggerToast("Opening audit logs...")}
                              style={{
                                fontSize: `${scaled.sublabelFontSize}px`,
                                color: tokens.textIconColor,
                              }}
                              className="font-semibold underline cursor-pointer hover:opacity-80"
                            >
                              View audit logs →
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setIsAlertDismissed(true);
                            triggerToast("Alert dismissed");
                          }}
                          style={{
                            borderRadius: `${scaled.scaledInnerRadius}px`,
                            padding: `${Math.round(4 * scaled.scale)}px`,
                          }}
                          className="text-neutral-400 hover:text-neutral-900 hover:bg-black/5 transition-colors cursor-pointer"
                          title="Dismiss notification"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ) : (
                      <div
                        style={{ borderRadius: `${scaled.scaledMenuRadius}px` }}
                        className="p-3 bg-neutral-50 border border-neutral-200 text-center"
                      >
                        <button
                          type="button"
                          onClick={() => setIsAlertDismissed(false)}
                          className="text-xs text-neutral-600 hover:text-neutral-900 font-semibold cursor-pointer"
                        >
                          Show dismissed alert again
                        </button>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Architecture Anatomy Footer */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1 font-sans text-[11px]">
                      <span>Anatomy:</span>
                      <strong className="text-neutral-600">Icon + SeverityHeading + BodyCopy + ActionLink + DismissTrigger</strong>
                    </span>
                    <span className="font-semibold text-neutral-500">Variant Switcher Active</span>
                  </div>
                </div>

                {/* ── MOLECULE 13: EMPTY STATE CARD (ZERO-DATA FALLBACK) ── */}
                <div id="mol-empty-state" style={cardStyle} className="p-5 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900 flex items-center gap-2">
                          <Inbox className="w-4 h-4 text-neutral-500" />
                          <span>EmptyStateCard</span>
                        </h2>
                        <span className="text-[10px] font-sans tabular-nums px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-semibold border border-neutral-200">
                          Zero-State
                        </span>
                      </div>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                        Zero-data fallback illustration + Action CTAs
                      </span>
                    </div>

                    <span className="text-[11px] text-neutral-400 font-medium">
                      Fallback Template
                    </span>
                  </div>

                  <div
                    style={{
                      borderRadius: `${scaled.scaledCardRadius}px`,
                      borderWidth: `${tokens.borderWidth}px`,
                      borderColor: tokens.universalBorderColor,
                      backgroundColor: scaled.effectiveInputFill,
                      boxShadow: scaled.isZeroBorder ? scaled.focusHalo : "none",
                      padding: `${Math.round(32 * scaled.scale)}px ${Math.round(20 * scaled.scale)}px`,
                    }}
                    className="border border-dashed text-center flex flex-col items-center justify-center space-y-3"
                  >
                    <motion.div
                      whileHover={{ y: -4, scale: 1.05 }}
                      transition={scaled.motionConfig.spring}
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        width: `${Math.round(48 * scaled.scale)}px`,
                        height: `${Math.round(48 * scaled.scale)}px`,
                      }}
                      className="flex items-center justify-center border shadow-2xs cursor-pointer"
                    >
                      <Inbox className="w-5 h-5 text-neutral-500" strokeWidth={1.8} />
                    </motion.div>

                    <div className="space-y-1 max-w-sm">
                      <h3 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-bold text-neutral-900">
                        No active telemetry records found
                      </h3>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed font-normal">
                        No clusters or database replications matched your current query criteria. Try resetting query parameters or create a new cluster.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <motion.button
                        type="button"
                        whileTap={{ scale: scaled.motionConfig.tapScale }}
                        onClick={() => triggerToast("Initializing new cluster registration...")}
                        style={{
                          borderRadius: `${scaled.scaledInnerRadius}px`,
                          backgroundColor: tokens.primaryButtonColor,
                          color: "#FFFFFF",
                          height: `${scaled.scaledHeight}px`,
                          paddingLeft: `${scaled.scaledPaddingX}px`,
                          paddingRight: `${scaled.scaledPaddingX}px`,
                          fontSize: `${scaled.ctaFontSize}px`,
                        }}
                        className="font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs hover:bg-neutral-800 transition-colors select-none"
                      >
                        <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                        <span>Register Cluster</span>
                      </motion.button>
                      <motion.button
                        type="button"
                        whileTap={{ scale: scaled.motionConfig.tapScale }}
                        onClick={() => triggerToast("Cleared active filters")}
                        style={{
                          borderRadius: `${scaled.scaledInnerRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.universalFillColor,
                          color: tokens.textIconColor,
                          height: `${scaled.scaledHeight}px`,
                          paddingLeft: `${scaled.scaledPaddingX}px`,
                          paddingRight: `${scaled.scaledPaddingX}px`,
                          fontSize: `${scaled.ctaFontSize}px`,
                        }}
                        className="font-semibold border hover:bg-neutral-50 transition-colors cursor-pointer select-none"
                      >
                        Clear All Filters
                      </motion.button>
                    </div>
                  </div>

                  {/* Architecture Anatomy Footer */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1 font-sans text-[11px]">
                      <span>Anatomy:</span>
                      <strong className="text-neutral-600">CenteredIcon + HeadingTitle + BodyText + PrimaryAction + SecondaryAction</strong>
                    </span>
                    <span className="font-semibold text-neutral-500">Zero-State Ready</span>
                  </div>
                </div>

                {/* ── MOLECULE 14: TOOLTIP POPOVER ── */}
                <div id="mol-tooltip" style={cardStyle} className="p-5 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900 flex items-center gap-2">
                          <Info className="w-4 h-4 text-neutral-500" />
                          <span>TooltipPopover</span>
                        </h2>
                        <span className="text-[10px] font-sans tabular-nums px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-semibold border border-neutral-200">
                          Hover Overlay
                        </span>
                      </div>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                        Trigger + Contextual Floating Card + Arrow Caret
                      </span>
                    </div>

                    <span className="text-[11px] text-neutral-400 font-medium">
                      Hover ⓘ below
                    </span>
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    <div className="relative inline-flex items-center gap-1.5">
                      <span style={{ fontSize: `${scaled.labelFontSize}px` }} className="font-medium text-neutral-700">
                        p99 Replication Latency
                      </span>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: scaled.motionConfig.tapScale }}
                        onMouseEnter={() => setIsTooltipOpen(true)}
                        onMouseLeave={() => setIsTooltipOpen(false)}
                        onClick={() => setIsTooltipOpen((prev) => !prev)}
                        style={{
                          borderRadius: `${scaled.scaledInnerRadius}px`,
                          backgroundColor: tokens.hoverBackplateTint,
                          color: tokens.textIconColor,
                        }}
                        className="w-4 h-4 flex items-center justify-center text-[11px] font-bold cursor-pointer hover:bg-neutral-200 transition-colors"
                      >
                        ⓘ
                      </motion.button>

                      {/* Floating Tooltip Card */}
                      <AnimatePresence>
                        {isTooltipOpen && (
                          <motion.div
                            initial={scaled.motionConfig.popover.initial}
                            animate={scaled.motionConfig.popover.animate}
                            exit={scaled.motionConfig.popover.exit}
                            transition={scaled.motionConfig.popover.transition}
                            style={{
                              borderRadius: `${scaled.scaledInnerRadius}px`,
                              borderColor: tokens.universalBorderColor,
                              borderWidth: `${tokens.borderWidth}px`,
                              boxShadow: "0 10px 25px -4px rgba(0,0,0,0.12)",
                            }}
                            className="absolute bottom-full left-0 mb-2 w-64 p-2.5 bg-[#111111] text-white text-[11px] leading-relaxed z-30"
                          >
                            <p className="font-medium text-white/90">
                              Calculated 99th percentile write-to-read sync latency across cross-regional database replica clusters.
                            </p>
                            <div className="w-2 h-2 bg-[#111111] rotate-45 absolute -bottom-1 left-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Architecture Anatomy Footer */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1 font-sans text-[11px]">
                      <span>Anatomy:</span>
                      <strong className="text-neutral-600">TriggerTarget + Caret + FloatingCard + BodyText</strong>
                    </span>
                    <span className="font-semibold text-neutral-500">Fluid Popover Ready</span>
                  </div>
                </div>
              </>
            )}

          </div>
        </main>

        {/* ══════════════════════════════════════════════════════════
            COLUMN 3: RIGHT SIDEBAR (DARK MODE "VISUAL STUDIO" DOCK)
           ══════════════════════════════════════════════════════════ */}
        <aside className="w-72 border-l border-[#27272A] bg-[#121214] text-[#E4E4E7] p-5 hidden xl:flex flex-col justify-between select-none sticky top-0 h-screen overflow-y-auto">
          <div className="space-y-5">
            {/* Dark Mode Header with Reset */}
            <div className="flex justify-between items-center pb-2 border-b border-[#27272A]">
              <span className="text-xs font-semibold tracking-wide text-white">
                Visual Studio
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsExportOpen(true)}
                  className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white text-black hover:bg-neutral-200 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Code2 className="w-3 h-3" />
                  <span>Export</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="text-xs text-neutral-400 hover:text-white transition-colors font-medium cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Dark Mode Scale Multiplier Controller */}
            <div className="space-y-2 p-3 rounded-xl bg-[#18181B] border border-[#27272A]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-300">
                  Scale multiplier
                </span>
                <span className="text-xs font-medium text-white bg-[#27272A] border border-[#3F3F46] px-1.5 py-0.5 rounded shadow-sm">
                  {tokens.scaleMultiplier.toFixed(2)}x
                </span>
              </div>

              <input
                type="range"
                min="0.80"
                max="1.30"
                step="0.05"
                value={tokens.scaleMultiplier}
                onChange={(e) =>
                  setTokens((prev) => ({ ...prev, scaleMultiplier: Number(e.target.value) }))
                }
                className="w-full cursor-pointer accent-white"
              />

              <div className="grid grid-cols-4 gap-1 pt-1">
                {[
                  { label: "0.85x", val: 0.85 },
                  { label: "1.00x", val: 1.0 },
                  { label: "1.15x", val: 1.15 },
                  { label: "1.30x", val: 1.3 },
                ].map(({ label, val }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setTokens((prev) => ({ ...prev, scaleMultiplier: val }))}
                    className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                      tokens.scaleMultiplier === val
                        ? "bg-white text-black border-white font-semibold shadow-sm"
                        : "bg-[#27272A] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dark Mode Colors Section */}
            <div className="space-y-2.5 pt-2 border-t border-[#27272A]">
              <div className="text-xs font-medium text-neutral-400">
                Colors
              </div>

              {/* Universal Border Color */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300">Border</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400 font-medium">{tokens.universalBorderColor.toUpperCase()}</span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.universalBorderColor }}
                      className="w-5 h-5 rounded border border-white/20 shadow-sm block transition-transform hover:scale-105"
                    />
                    <input
                      type="color"
                      value={tokens.universalBorderColor}
                      onChange={(e) => setTokens((prev) => ({ ...prev, universalBorderColor: e.target.value }))}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Universal Fill Color */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300">Surface</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400 font-medium">{tokens.universalFillColor.toUpperCase()}</span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.universalFillColor }}
                      className="w-5 h-5 rounded border border-white/20 shadow-sm block transition-transform hover:scale-105"
                    />
                    <input
                      type="color"
                      value={tokens.universalFillColor}
                      onChange={(e) => setTokens((prev) => ({ ...prev, universalFillColor: e.target.value }))}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Text & Icon Color */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300">Text &amp; icons</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400 font-medium">{tokens.textIconColor.toUpperCase()}</span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.textIconColor }}
                      className="w-5 h-5 rounded border border-white/20 shadow-sm block transition-transform hover:scale-105"
                    />
                    <input
                      type="color"
                      value={tokens.textIconColor}
                      onChange={(e) => setTokens((prev) => ({ ...prev, textIconColor: e.target.value }))}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Primary Action Color */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300">Primary action</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400 font-medium">{tokens.primaryButtonColor.toUpperCase()}</span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.primaryButtonColor }}
                      className="w-5 h-5 rounded border border-white/20 shadow-sm block transition-transform hover:scale-105"
                    />
                    <input
                      type="color"
                      value={tokens.primaryButtonColor}
                      onChange={(e) => setTokens((prev) => ({ ...prev, primaryButtonColor: e.target.value }))}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Hover Backplate Tint */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300">Hover tint</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400 font-medium">{tokens.hoverBackplateTint.toUpperCase()}</span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.hoverBackplateTint }}
                      className="w-5 h-5 rounded border border-white/20 shadow-sm block transition-transform hover:scale-105"
                    />
                    <input
                      type="color"
                      value={tokens.hoverBackplateTint}
                      onChange={(e) => setTokens((prev) => ({ ...prev, hoverBackplateTint: e.target.value }))}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Dark Mode Geometry Section */}
            <div className="space-y-2.5 pt-2 border-t border-[#27272A]">
              <div className="text-xs font-medium text-neutral-400">
                Geometry
              </div>

              {/* Border Width Slider */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Border width</span>
                  {tokens.borderWidth === 0 ? (
                    <span className="text-[10px] text-amber-400 font-medium bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.5 rounded">
                      0px • Luminance Mode
                    </span>
                  ) : (
                    <span className="text-neutral-400 font-medium">{tokens.borderWidth}px</span>
                  )}
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={tokens.borderWidth}
                  onChange={(e) => setTokens((prev) => ({ ...prev, borderWidth: Number(e.target.value) }))}
                  className="w-full cursor-pointer accent-white"
                />
                {tokens.borderWidth === 0 && (
                  <p className="text-[10px] text-neutral-500 pt-0.5">
                    Compensatory luminance fill & atmospheric elevation active to prevent edge bleed.
                  </p>
                )}
              </div>

              {/* Corner Radius */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-300">Corner radius</span>
                  <span className="text-neutral-400 font-medium">
                    {tokens.cornerRadius === 999 ? "Pill" : `${tokens.cornerRadius}px`}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {([0, 8, 16, 24, 999] as CornerRadiusPreset[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setTokens((prev) => ({ ...prev, cornerRadius: r }))}
                      className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                        tokens.cornerRadius === r
                          ? "bg-white text-black border-white font-semibold shadow-sm"
                          : "bg-[#18181B] text-neutral-300 border-[#27272A] hover:border-neutral-500"
                      }`}
                    >
                      {r === 0 ? "0px" : r === 999 ? "Pill" : `${r}px`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Height Density */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-300">Height density</span>
                  <span className="text-neutral-400 font-medium">{tokens.heightDensity}px</span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {([36, 40, 44, 48, 52] as HeightDensityPreset[]).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setTokens((prev) => ({ ...prev, heightDensity: h }))}
                      className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                        tokens.heightDensity === h
                          ? "bg-white text-black border-white font-semibold shadow-sm"
                          : "bg-[#18181B] text-neutral-300 border-[#27272A] hover:border-neutral-500"
                      }`}
                    >
                      {h}px
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu Offset */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-300">Menu offset</span>
                  <span className="text-neutral-400 font-medium">{tokens.menuOffsetGap}px</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {([4, 8, 10, 14] as MenuOffsetPreset[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setTokens((prev) => ({ ...prev, menuOffsetGap: g }))}
                      className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                        tokens.menuOffsetGap === g
                          ? "bg-white text-black border-white font-semibold shadow-sm"
                          : "bg-[#18181B] text-neutral-300 border-[#27272A] hover:border-neutral-500"
                      }`}
                    >
                      {g}px
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dark Mode Typography Section (Universally Calibrating) */}
            <div className="space-y-2 pt-2 border-t border-[#27272A]">
              <div className="text-xs font-medium text-neutral-400">
                Universal Typography
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-300">Base font scale</span>
                  <span className="text-neutral-400 font-medium">{tokens.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="18"
                  step="1"
                  value={tokens.fontSize}
                  onChange={(e) => setTokens((prev) => ({ ...prev, fontSize: Number(e.target.value) }))}
                  className="w-full cursor-pointer accent-white"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 pt-0.5">
                  <span>12px Compact</span>
                  <span>14px Standard</span>
                  <span>18px Roomy</span>
                </div>
              </div>
            </div>

            {/* Dark Mode Motion Section */}
            <div className="space-y-2 pt-2 border-t border-[#27272A]">
              <div className="text-xs font-medium text-neutral-400">
                Motion
              </div>

              <div className="grid grid-cols-3 gap-1">
                {(
                  [
                    { key: "linear", label: "Linear" },
                    { key: "damped", label: "Damped" },
                    { key: "elastic", label: "Elastic" },
                  ] as { key: MotionPhysicsPreset; label: string }[]
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTokens((prev) => ({ ...prev, motionPhysics: key }))}
                    className={`py-1.5 rounded text-xs font-medium border transition-colors cursor-pointer ${
                      tokens.motionPhysics === key
                        ? "bg-white text-black border-white font-semibold shadow-sm"
                        : "bg-[#18181B] text-neutral-300 border-[#27272A] hover:border-neutral-500"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 1-Click Export Tokens CTA */}
            <div className="pt-2 border-t border-[#27272A]">
              <button
                type="button"
                onClick={() => setIsExportOpen(true)}
                className="w-full py-2.5 px-3 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors select-none"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Export Theme Tokens</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#27272A] flex items-center justify-between text-xs text-neutral-500">
            <span>Visual Studio Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════════════
            1-CLICK TOKEN EXPORT MODAL (TAILWIND, CSS, JSON)
           ══════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {isExportOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
              onClick={() => setIsExportOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.15 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xl bg-[#121214] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden text-neutral-100 space-y-0"
              >
                {/* Modal Header */}
                <div className="px-5 py-4 border-b border-[#27272A] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Export Design Tokens</h3>
                      <p className="text-xs text-neutral-400">Copy configured tokens directly to your SaaS project</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsExportOpen(false)}
                    className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Format Switcher Tabs & Copy Action */}
                <div className="p-4 bg-[#18181B] border-b border-[#27272A] flex flex-wrap items-center justify-between gap-3">
                  <div className="p-1 bg-[#121214] rounded-lg border border-[#27272A] flex items-center gap-1 text-xs">
                    {(
                      [
                        { key: "tailwind", label: "Tailwind CSS" },
                        { key: "css", label: "CSS Variables" },
                        { key: "json", label: "TypeScript / JSON" },
                      ] as const
                    ).map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setExportFormat(key)}
                        className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                          exportFormat === key
                            ? "bg-white text-black font-semibold shadow-xs"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const snippet = getExportSnippet(exportFormat, tokens);
                      navigator.clipboard.writeText(snippet);
                      setIsExportCopied(true);
                      triggerToast("Token configuration copied to clipboard");
                      setTimeout(() => setIsExportCopied(false), 2000);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0 select-none"
                  >
                    {isExportCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Snippet</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Preview Box */}
                <div className="p-4 max-h-[380px] overflow-y-auto bg-[#0C0C0E]">
                  <pre className="text-xs leading-relaxed text-neutral-300 font-sans tabular-nums whitespace-pre overflow-x-auto p-3.5 rounded-xl bg-[#141417] border border-[#232328]">
                    {getExportSnippet(exportFormat, tokens)}
                  </pre>
                </div>

                {/* Modal Footer */}
                <div className="px-5 py-3 border-t border-[#27272A] bg-[#141417] flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span>Values synchronize live with Visual Studio</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsExportOpen(false)}
                    className="px-3 py-1 text-xs text-neutral-300 hover:text-white cursor-pointer font-medium"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
