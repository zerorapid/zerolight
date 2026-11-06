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
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsRoleOpen(false);
        setIsTagOpen(false);
        setIsDatePickerOpen(false);
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
                  <div className="space-y-0.5">
                    <div className="px-3 py-1 text-xs font-semibold text-neutral-400">
                      Form Compositions
                    </div>
                    <a href="#mol-form-field" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>FormField</span>
                    </a>
                    <a href="#mol-input-group" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>InputGroup</span>
                    </a>
                    <a href="#mol-search-bar" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>SearchBar</span>
                    </a>
                    <a href="#mol-date-picker" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>DateRangePicker</span>
                    </a>
                  </div>

                  <div className="space-y-0.5 pt-2 border-t border-neutral-100">
                    <div className="px-3 py-1 text-xs font-semibold text-neutral-400">
                      Selection &amp; Control
                    </div>
                    <a href="#mol-search-select" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>SearchableSelect</span>
                    </a>
                    <a href="#mol-tag-deck" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>TagDeck</span>
                    </a>
                    <a href="#mol-segmented" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>SegmentedControl</span>
                    </a>
                  </div>

                  <div className="space-y-0.5 pt-2 border-t border-neutral-100">
                    <div className="px-3 py-1 text-xs font-semibold text-neutral-400">
                      Feedback &amp; Alerts
                    </div>
                    <a href="#mol-alert-callout" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>AlertCallout</span>
                    </a>
                    <a href="#mol-empty-state" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>EmptyStateCard</span>
                    </a>
                  </div>

                  <div className="space-y-0.5 pt-2 border-t border-neutral-100">
                    <div className="px-3 py-1 text-xs font-semibold text-neutral-400">
                      Overlays &amp; Navigation
                    </div>
                    <a href="#mol-tooltip" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Tooltip popover</span>
                    </a>
                    <a href="#mol-breadcrumbs" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Breadcrumbs</span>
                    </a>
                    <a href="#mol-pagination" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>PaginationBar</span>
                    </a>
                  </div>

                  <div className="space-y-0.5 pt-2 border-t border-neutral-100">
                    <div className="px-3 py-1 text-xs font-semibold text-neutral-400">
                      Data &amp; Telemetry
                    </div>
                    <a href="#mol-table-row" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>DataTableRow</span>
                    </a>
                    <a href="#mol-metric-stat" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>MetricStat</span>
                    </a>
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
                          borderRadius: `${scaled.scaledRadius === 0 ? 0 : Math.max(2, Math.round(scaled.scaledRadius * 0.35))}px`,
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
                          borderRadius: `${scaled.scaledRadius === 0 ? 0 : Math.max(2, Math.round(scaled.scaledRadius * 0.35))}px`,
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
                          borderRadius: `${scaled.scaledRadius === 0 ? 0 : Math.max(2, Math.round(scaled.scaledRadius * 0.35))}px`,
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
                {/* ── MOLECULE 1: FORM FIELD ── */}
                <div id="mol-form-field" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      FormField molecule
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                      Label + Input + HelperText
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px` }} className="block font-medium text-neutral-700">
                      Account email <span className="text-rose-500">*</span>
                    </label>
                    <div
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: isInputFocused ? tokens.textIconColor : tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: scaled.effectiveInputFill,
                        height: `${scaled.scaledHeight}px`,
                        paddingLeft: `${scaled.scaledPaddingX}px`,
                        paddingRight: `${scaled.scaledPaddingX}px`,
                        boxShadow: isInputFocused
                          ? (scaled.isZeroBorder ? scaled.focusHalo : `0 0 0 3px ${tokens.textIconColor}12`)
                          : "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
                        transition: "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
                      }}
                      className="flex items-center gap-2.5 border"
                    >
                      <Search className="w-4 h-4 text-neutral-400 shrink-0" strokeWidth={1.8} />
                      <input
                        type="email"
                        value={textInput}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="name@company.com"
                        style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 block">
                      We send monthly receipts and settlement summaries to this inbox.
                    </span>
                  </div>
                </div>

                {/* ── MOLECULE 2: INPUT GROUP (UNIVERSAL RADIUS & BLACK BUTTON) ── */}
                <div id="mol-input-group" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      InputGroup molecule
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                      Input + Conjoined Button
                    </span>
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
                          type="text"
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
                        whileTap={{ scale: 0.96 }}
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
                </div>

                {/* ── MOLECULE 3: SEARCH BAR ── */}
                <div id="mol-search-bar" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      SearchBar molecule
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                      Icon + Input + Kbd Shortcut
                    </span>
                  </div>

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
                    className="flex items-center justify-between border"
                  >
                    <div className="flex items-center gap-2.5 flex-1 mr-2">
                      <Search className="w-4 h-4 text-neutral-400 shrink-0" strokeWidth={2} />
                      <input
                        type="text"
                        placeholder="Search resources, customers, invoices..."
                        style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                    <kbd
                      style={{
                        borderRadius: `${scaled.scaledInnerRadius}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        fontSize: `${scaled.sublabelFontSize - 1}px`,
                        padding: `${Math.round(2 * scaled.scale)}px ${Math.round(6 * scaled.scale)}px`,
                      }}
                      className="font-medium text-neutral-500 border shadow-2xs"
                    >
                      ⌘K
                    </kbd>
                  </div>
                </div>

                {/* ── MOLECULE: DATE RANGE PICKER ── */}
                <div id="mol-date-picker" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      DateRangePicker molecule
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                      Trigger + Floating Presets Popover
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
                        transition={{ duration: 0.15 }}
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

                    {/* Floating Popover adhering 100% to universal tokens */}
                    <AnimatePresence>
                      {isDatePickerOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.97, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.97, y: -4 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          style={{
                            marginTop: `${tokens.menuOffsetGap}px`,
                            borderRadius: `${scaled.scaledRadius}px`,
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
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
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
                                      borderRadius: `${scaled.scaledInnerRadius}px`,
                                      backgroundColor: isSelected ? tokens.primaryButtonColor : tokens.hoverBackplateTint,
                                      color: isSelected ? "#FFFFFF" : tokens.textIconColor,
                                      fontSize: `${scaled.sublabelFontSize}px`,
                                      padding: `${Math.round(6 * scaled.scale)}px ${Math.round(8 * scaled.scale)}px`,
                                    }}
                                    className={`font-medium transition-colors cursor-pointer text-center select-none ${
                                      isSelected ? "font-semibold shadow-xs" : "hover:text-black"
                                    }`}
                                  >
                                    {p.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                            <div className="text-[11px] text-neutral-500 tabular-nums">
                              Selected: <span className="font-semibold text-neutral-900">{dateRangeString}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsDatePickerOpen(false)}
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
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* ── MOLECULE 4: SEARCHABLE SELECT (UNIVERSAL DROPDOWN TOKEN APPLIED!) ── */}
                <div id="mol-search-select" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      SearchableSelect molecule
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                      Trigger + Universal Popover + Filter
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
                        transition={{ duration: 0.15 }}
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

                    {/* Popover Dropdown adhering 100% to Universal Tokens */}
                    <AnimatePresence>
                      {isRoleOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.97, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.97, y: -4 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          style={{
                            marginTop: `${tokens.menuOffsetGap}px`,
                            borderRadius: `${scaled.scaledRadius}px`,
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
                                <button
                                  key={opt}
                                  type="button"
                                  onMouseEnter={() => setHoveredRole(opt)}
                                  onMouseLeave={() => setHoveredRole(null)}
                                  onClick={() => {
                                    setRole(opt);
                                    setIsRoleOpen(false);
                                    setRoleFilter("");
                                  }}
                                  style={{
                                    borderRadius: `${scaled.scaledInnerRadius}px`,
                                    backgroundColor: isSelected ? tokens.primaryButtonColor : isHovered ? tokens.hoverBackplateTint : "transparent",
                                    color: isSelected ? "#FFFFFF" : tokens.textIconColor,
                                    fontSize: `${scaled.labelFontSize}px`,
                                    padding: `${Math.round(7 * scaled.scale)}px ${Math.round(10 * scaled.scale)}px`,
                                    transition: scaled.transitionStyle,
                                  }}
                                  className="w-full text-left flex items-center justify-between font-normal cursor-pointer"
                                >
                                  <span>{opt}</span>
                                  {isSelected && (
                                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* ── MOLECULE 5: MULTI-TAG DECK (UNIVERSAL DROPDOWN TOKEN APPLIED!) ── */}
                <div id="mol-tag-deck" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                        TagDeck molecule
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Removable tag chips with universal corner radius, border width, and black action defaults.
                      </p>
                    </div>
                  </div>

                  <div ref={tagRef} className="relative space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px` }} className="block font-medium text-neutral-700">Project tags</label>

                    <div
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
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
                            transition={{ duration: 0.15 }}
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
                        whileTap={{ scale: 0.95 }}
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
                          initial={{ opacity: 0, scale: 0.97, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.97, y: -4 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          style={{
                            marginTop: `${tokens.menuOffsetGap}px`,
                            borderRadius: `${scaled.scaledRadius}px`,
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
                                    borderRadius: `${scaled.scaledInnerRadius}px`,
                                    backgroundColor: isHovered ? tokens.hoverBackplateTint : "transparent",
                                    color: tokens.textIconColor,
                                    fontSize: `${scaled.labelFontSize}px`,
                                    padding: `${Math.round(7 * scaled.scale)}px ${Math.round(10 * scaled.scale)}px`,
                                  }}
                                  className="flex items-center justify-between cursor-pointer"
                                >
                                  <span className={isSelected ? "font-semibold" : "font-normal"}>
                                    {opt}
                                  </span>
                                  <div
                                    style={{
                                      borderRadius: `${scaled.scaledRadius === 0 ? 0 : Math.max(2, Math.round(scaled.scaledRadius * 0.35))}px`,
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
                </div>

                {/* ── MOLECULE 6: SEGMENTED CONTROL ── */}
                <div id="mol-segmented" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      SegmentedControl molecule
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                      Framer Motion layoutId sliding pill
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
                          <button
                            key={key}
                            type="button"
                            onClick={() => setSegmentValue(key)}
                            style={{
                              borderRadius: `${scaled.scaledInnerRadius}px`,
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
                                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                style={{
                                  borderRadius: `${scaled.scaledInnerRadius}px`,
                                  backgroundColor: tokens.primaryButtonColor,
                                }}
                                className="absolute inset-0 shadow-sm -z-10"
                              />
                            )}
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ── MOLECULE 7: METRIC STAT MOLECULE ── */}
                <div id="mol-metric-stat" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      MetricStat molecule
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                      Label + Value + TrendBadge
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 font-medium block">
                        Net Revenue Run Rate
                      </span>
                      <div className="flex items-baseline gap-2 pt-0.5">
                        <span style={{ fontSize: `${scaled.headingFontSize + 8}px` }} className="font-semibold text-neutral-900 tracking-tight">
                          $148,200
                        </span>
                        <span
                          style={{
                            fontSize: `${scaled.sublabelFontSize}px`,
                            borderRadius: `${scaled.scaledRadius}px`,
                          }}
                          className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 font-medium inline-flex items-center gap-0.5"
                        >
                          <ArrowRight className="w-3 h-3 text-emerald-600 -rotate-45" strokeWidth={2.5} />
                          <span>+18.4%</span>
                        </span>
                      </div>
                    </div>

                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">
                      vs. previous 30 days
                    </span>
                  </div>
                </div>

                {/* ── MOLECULE 8: TOOLTIP POPOVER (COMPOSED TRIGGER + OVERLAY) ── */}
                <div id="mol-tooltip" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900 flex items-center gap-2">
                      <Info className="w-4 h-4 text-neutral-500" />
                      Tooltip popover molecule
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                      Trigger + Contextual Card
                    </span>
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    <div className="relative inline-flex items-center gap-1.5">
                      <span style={{ fontSize: `${scaled.labelFontSize}px` }} className="font-medium text-neutral-700">
                        Glaze percentage
                      </span>
                      <button
                        type="button"
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
                      </button>

                      {/* Floating Tooltip Card */}
                      <AnimatePresence>
                        {isTooltipOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.96 }}
                            transition={{ duration: 0.12 }}
                            style={{
                              borderRadius: `${scaled.scaledInnerRadius}px`,
                              borderColor: tokens.universalBorderColor,
                              borderWidth: `${tokens.borderWidth}px`,
                              boxShadow: "0 10px 25px -4px rgba(0,0,0,0.12)",
                            }}
                            className="absolute bottom-full left-0 mb-2 w-64 p-2.5 bg-[#111111] text-white text-[11px] leading-relaxed z-30"
                          >
                            <p className="font-medium text-white/90">
                              Sub-zero protective ice glaze added to frozen seafood to prevent dehydration during cold-chain transit.
                            </p>
                            <div className="w-2 h-2 bg-[#111111] rotate-45 absolute -bottom-1 left-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* ── MOLECULE 9: BREADCRUMBS (COMPOSED LINKS + SEPARATORS) ── */}
                <div id="mol-breadcrumbs" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                      Breadcrumbs wayfinding molecule
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                      Links + Chevrons
                    </span>
                  </div>

                  <nav className="flex items-center gap-1.5 flex-wrap text-xs pt-1">
                    <span className="text-neutral-500 hover:text-neutral-900 transition-colors font-medium cursor-pointer">
                      Operations
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" strokeWidth={2} />
                    <span className="text-neutral-500 hover:text-neutral-900 transition-colors font-medium cursor-pointer">
                      Coldstore Unit-1
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" strokeWidth={2} />
                    <span className="text-neutral-500 hover:text-neutral-900 transition-colors font-medium cursor-pointer">
                      Pre-Processing
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" strokeWidth={2} />
                    <span
                      style={{
                        borderRadius: `${scaled.scaledInnerRadius}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                        color: tokens.textIconColor,
                      }}
                      className="px-2 py-0.5 font-semibold"
                    >
                      Batch #8812-B
                    </span>
                  </nav>
                </div>

                {/* ── MOLECULE 10: DATA TABLE ROW (FORMATTED FINANCIAL & METRIC RECORD) ── */}
                <div id="mol-table-row" style={cardStyle} className="p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-neutral-500" />
                        DataTableRow molecule
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Composed tabular record with deterministic numerical alignment (tabular figures without monospace fonts).
                      </p>
                    </div>
                    <span className="text-[11px] bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-md border border-neutral-200 font-medium">
                      tabular-nums
                    </span>
                  </div>

                  {/* Financial Table Row Preview */}
                  <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
                    <table className="w-full text-xs">
                      <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500">
                        <tr>
                          <th className="py-2.5 px-3.5 text-left font-semibold uppercase tracking-wider text-[10px]">Invoice / Batch</th>
                          <th className="py-2.5 px-3.5 text-right font-semibold uppercase tracking-wider text-[10px]">Weight (kg)</th>
                          <th className="py-2.5 px-3.5 text-right font-semibold uppercase tracking-wider text-[10px]">Yield Delta</th>
                          <th className="py-2.5 px-3.5 text-right font-semibold uppercase tracking-wider text-[10px]">Settled Value ($)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 tabular-nums">
                        <tr className="hover:bg-neutral-50/70 transition-colors">
                          <td className="py-2.5 px-3.5 font-medium text-neutral-900">INV-2627-101</td>
                          <td className="py-2.5 px-3.5 text-right text-neutral-700 font-medium">1,840.50 kg</td>
                          <td className="py-2.5 px-3.5 text-right text-emerald-600 font-semibold">
                            <span className="inline-flex items-center gap-1 justify-end">
                              <TrendingUp className="w-3 h-3" /> +14.8%
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-bold text-neutral-900">$ 42,500.00</td>
                        </tr>
                        <tr className="hover:bg-neutral-50/70 transition-colors">
                          <td className="py-2.5 px-3.5 font-medium text-neutral-900">INV-2627-102</td>
                          <td className="py-2.5 px-3.5 text-right text-neutral-700 font-medium">920.00 kg</td>
                          <td className="py-2.5 px-3.5 text-right text-rose-600 font-semibold">
                            -3.2%
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-bold text-neutral-900">$ 19,850.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── MOLECULE 11: ALERT CALLOUT (SEMANTIC FEEDBACK BANNER) ── */}
                <div id="mol-alert-callout" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-neutral-500" />
                      AlertCallout molecule
                    </h2>
                    <div className="flex items-center gap-1">
                      {(["info", "warning", "success", "critical"] as const).map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            setAlertVariant(v);
                            setIsAlertDismissed(false);
                          }}
                          style={{
                            borderRadius: `${scaled.scaledInnerRadius}px`,
                            backgroundColor: alertVariant === v ? tokens.primaryButtonColor : tokens.hoverBackplateTint,
                            color: alertVariant === v ? "#FFFFFF" : tokens.textIconColor,
                            fontSize: `${scaled.sublabelFontSize - 1}px`,
                            padding: "2px 8px",
                          }}
                          className={`capitalize font-medium cursor-pointer transition-colors ${
                            alertVariant === v ? "font-semibold shadow-2xs" : ""
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {!isAlertDismissed ? (
                      <motion.div
                        key={alertVariant}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          borderRadius: `${scaled.scaledRadius}px`,
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
                          onClick={() => setIsAlertDismissed(true)}
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
                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
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
                </div>

                {/* ── MOLECULE 12: EMPTY STATE CARD (ZERO-DATA FALLBACK) ── */}
                <div id="mol-empty-state" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900 flex items-center gap-2">
                      <Inbox className="w-4 h-4 text-neutral-500" />
                      EmptyStateCard molecule
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                      Zero-data fallback + Action CTA
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
                    <div
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        width: `${Math.round(48 * scaled.scale)}px`,
                        height: `${Math.round(48 * scaled.scale)}px`,
                      }}
                      className="flex items-center justify-center border shadow-2xs"
                    >
                      <Inbox className="w-5 h-5 text-neutral-500" strokeWidth={1.8} />
                    </div>

                    <div className="space-y-1 max-w-sm">
                      <h3 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-bold text-neutral-900">
                        No active requisitions found
                      </h3>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed font-normal">
                        No candidates or open positions matched your current query criteria. Try clearing active filters or create a new job profile.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
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
                        <span>Create New Job</span>
                      </button>
                      <button
                        type="button"
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
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── MOLECULE 13: PAGINATION BAR (DATASET CONTROLS) ── */}
                <div id="mol-pagination" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                      PaginationBar molecule
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                      Summary + Page Selection + Chevrons
                    </span>
                  </div>

                  <div
                    style={{
                      borderRadius: `${scaled.scaledRadius}px`,
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
                      {/* Rows per page selector */}
                      <div className="flex items-center gap-1.5">
                        <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">Rows:</span>
                        <select
                          value={pageSize}
                          onChange={(e) => setPageSize(Number(e.target.value))}
                          style={{
                            borderRadius: `${scaled.scaledInnerRadius}px`,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            backgroundColor: tokens.universalFillColor,
                            color: tokens.textIconColor,
                            fontSize: `${scaled.sublabelFontSize}px`,
                            padding: "3px 6px",
                          }}
                          className="border outline-none cursor-pointer"
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                        </select>
                      </div>

                      {/* Previous Button */}
                      <button
                        type="button"
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
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1 tabular-nums">
                        {[1, 2, 3, 4, 15].map((pageNum, idx) => {
                          const isActive = currentPage === pageNum;
                          return (
                            <React.Fragment key={pageNum}>
                              {idx === 4 && <span className="text-neutral-400 px-1">...</span>}
                              <button
                                type="button"
                                onClick={() => setCurrentPage(pageNum)}
                                style={{
                                  borderRadius: `${scaled.scaledInnerRadius}px`,
                                  backgroundColor: isActive ? tokens.primaryButtonColor : "transparent",
                                  color: isActive ? "#FFFFFF" : tokens.textIconColor,
                                  width: `${Math.round(28 * scaled.scale)}px`,
                                  height: `${Math.round(28 * scaled.scale)}px`,
                                  fontSize: `${scaled.sublabelFontSize}px`,
                                }}
                                className={`flex items-center justify-center font-medium transition-colors cursor-pointer select-none ${
                                  isActive ? "font-semibold shadow-xs" : "hover:bg-black/5"
                                }`}
                              >
                                {pageNum}
                              </button>
                            </React.Fragment>
                          );
                        })}
                      </div>

                      {/* Next Button */}
                      <button
                        type="button"
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
                      </button>
                    </div>
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
