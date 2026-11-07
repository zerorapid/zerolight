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
  Bell,
  Server,
  Cpu,
  Database,
  Activity,
  Filter,
  Globe,
  LogOut,
  User,
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

const CALENDAR_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CALENDAR_WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const getCalendarDays = (year: number, month: number) => {
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days: { day: number; month: "prev" | "curr" | "next"; year: number; monthIndex: number }[] = [];

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      month: "prev",
      year: month === 0 ? year - 1 : year,
      monthIndex: month === 0 ? 11 : month - 1,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      day: d,
      month: "curr",
      year,
      monthIndex: month,
    });
  }

  const remaining = (7 - (days.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    days.push({
      day: d,
      month: "next",
      year: month === 11 ? year + 1 : year,
      monthIndex: month === 11 ? 0 : month + 1,
    });
  }

  return days;
};

const CLUSTER_NODES = [
  { id: "node-1", name: "us-east-prod-01", region: "us-east-1", role: "API Gateway", status: "healthy", cpu: "24%", memory: "4.2 GB", latency: "18ms" },
  { id: "node-2", name: "eu-west-worker-03", region: "eu-west-1", role: "Worker", status: "healthy", cpu: "68%", memory: "11.4 GB", latency: "34ms" },
  { id: "node-3", name: "ap-south-cache-02", region: "ap-south-1", role: "Cache", status: "degraded", cpu: "89%", memory: "15.1 GB", latency: "112ms" },
  { id: "node-4", name: "us-west-ingress-04", region: "us-west-2", role: "Ingress", status: "healthy", cpu: "12%", memory: "2.1 GB", latency: "22ms" },
  { id: "node-5", name: "sa-east-sync-01", region: "sa-east-1", role: "Data Sync", status: "syncing", cpu: "45%", memory: "6.8 GB", latency: "64ms" },
];

const COMMAND_PALETTE_ITEMS = [
  { id: "nav-clusters", title: "Cluster Nodes & Pods", category: "Navigation", icon: Layers, shortcut: "G C" },
  { id: "nav-security", title: "Security & API Keys", category: "Navigation", icon: Shield, shortcut: "G S" },
  { id: "nav-audit", title: "Audit Trail & Logs", category: "Navigation", icon: Terminal, shortcut: "G A" },
  { id: "act-create-node", title: "Create New Cluster Node", category: "Quick Actions", icon: Plus, shortcut: "C N" },
  { id: "act-rotate-key", title: "Rotate Secret API Key", category: "Quick Actions", icon: Key, shortcut: "R K" },
  { id: "act-export-csv", title: "Export Active Audit Logs", category: "Quick Actions", icon: Download, shortcut: "E A" },
  { id: "act-invite", title: "Invite Team Member", category: "Quick Actions", icon: User, shortcut: "I M" },
];

const INITIAL_FILTER_CONDITIONS = [
  { id: "cond-1", field: "status", operator: "equals", value: "healthy" },
  { id: "cond-2", field: "region", operator: "equals", value: "us-east-1" },
];

const CHART_SPARKLINE_POINTS = [
  { time: "00:00", value: "84k", val: 84 },
  { time: "04:00", value: "62k", val: 62 },
  { time: "08:00", value: "118k", val: 118 },
  { time: "12:00", value: "194k", val: 194 },
  { time: "16:00", value: "210k", val: 210 },
  { time: "20:00", value: "168k", val: 168 },
  { time: "24:00", value: "142k", val: 142 },
];

export function ZeroLightStudio({ initialTier = "atoms" }: { initialTier?: "atoms" | "molecules" | "organisms" }) {
  const [tokens, setTokens] = useState<ZeroLightTokens>(DEFAULT_TOKENS);
  const [activeTier, setActiveTier] = useState<"atoms" | "molecules" | "organisms">(initialTier);
  const [isMobileStudioOpen, setIsMobileStudioOpen] = useState<boolean>(false);

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

  // Calendar Dropdown with Year Change State
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<{
    year: number;
    month: number;
    day: number;
  }>({
    year: 2026,
    month: 10, // 0-indexed: 10 = November
    day: 6,
  });
  const [calendarViewYear, setCalendarViewYear] = useState<number>(2026);
  const [calendarViewMonth, setCalendarViewMonth] = useState<number>(10);
  const [isYearPickerOpen, setIsYearPickerOpen] = useState<boolean>(false);
  const calendarRef = useRef<HTMLDivElement>(null);

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

  // ══════════════════════════════════════════════════════════
  // ORGANISMS TIER INTERACTIVE STATES
  // ══════════════════════════════════════════════════════════
  // Organism 1: DataTable
  const [orgTableSelected, setOrgTableSelected] = useState<string[]>(["node-1", "node-3"]);
  const [orgTableSearch, setOrgTableSearch] = useState<string>("");
  const [orgTableRoleFilter, setOrgTableRoleFilter] = useState<string>("all");
  const [orgTableRowMenuOpen, setOrgTableRowMenuOpen] = useState<string | null>(null);

  // Organism 2: Global Header
  const [activeWorkspace, setActiveWorkspace] = useState<string>("Acme Corp (Production)");
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(3);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Organism 3: App Sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [activeSidebarRoute, setActiveSidebarRoute] = useState<string>("nodes");

  // Organism 4: Command Palette (Cmd+K)
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState<boolean>(false);
  const [cmdPaletteQuery, setCmdPaletteQuery] = useState<string>("");
  const [cmdPaletteSelectedIdx, setCmdPaletteSelectedIdx] = useState<number>(0);

  // Organism 5: Filter Builder
  const [filterConditions, setFilterConditions] = useState(INITIAL_FILTER_CONDITIONS);
  const [filterLogic, setFilterLogic] = useState<"AND" | "OR">("AND");

  // Organism 6: Metric Telemetry Chart Card
  const [chartHorizon, setChartHorizon] = useState<"24h" | "7d" | "30d">("24h");
  const [hoveredChartPoint, setHoveredChartPoint] = useState<(typeof CHART_SPARKLINE_POINTS)[0] | null>(null);

  // Organism 7: Slide-Over Detail Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerActiveTab, setDrawerActiveTab] = useState<"overview" | "config" | "logs">("overview");

  // Organism 8: Confirmation Modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [confirmInputText, setConfirmInputText] = useState<string>("");

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
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false);
        setIsYearPickerOpen(false);
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
      if (workspaceRef.current && !workspaceRef.current.contains(e.target as Node)) {
        setIsWorkspaceMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsRoleOpen(false);
        setIsTagOpen(false);
        setIsDatePickerOpen(false);
        setIsCalendarOpen(false);
        setIsYearPickerOpen(false);
        setIsPageSizeOpen(false);
        setIsRowActionsOpen(false);
        setIsSearchFocused(false);
        setIsBreadcrumbMenuOpen(false);
        setIsWorkspaceMenuOpen(false);
        setIsNotificationsOpen(false);
        setIsProfileMenuOpen(false);
        setOrgTableRowMenuOpen(null);
        setIsCmdPaletteOpen(false);
        setIsDrawerOpen(false);
        setIsConfirmModalOpen(false);
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCmdPaletteOpen((prev) => !prev);
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


  const renderStudioControls = () => (
    <>

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
                {isMobileStudioOpen && (
                  <button
                    type="button"
                    onClick={() => setIsMobileStudioOpen(false)}
                    className="xl:hidden ml-1 p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
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
        
    </>
  );
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

      {/* ── Top Header Bar with Spacious Tier Switcher & Quick Meta ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EBEBEB] px-6 py-3 flex items-center justify-between select-none shadow-2xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              style={{
                backgroundColor: tokens.primaryButtonColor,
                borderRadius: `${scaled.scaledRadius === 0 ? 0 : 8}px`,
                color: scaled.primaryActionTextColor,
              }}
              className="w-7 h-7 flex items-center justify-center font-bold text-xs shadow-xs"
            >
              ZL
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-sm tracking-tight text-[#111111]">
                ZeroLight
              </span>
              <span className="text-[11px] font-medium text-neutral-400 hidden sm:inline-block">
                Design System Studio
              </span>
            </div>
          </Link>
        </div>

        {/* Elevated Spacious Tier Switcher */}
        <div
          style={{
            borderRadius: `${scaled.scaledPillRadius}px`,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            backgroundColor: tokens.hoverBackplateTint,
          }}
          className="inline-flex items-center gap-1.5 p-1 border shadow-xs"
        >
          {(
            [
              { key: "atoms", label: "Atoms", count: "15" },
              { key: "molecules", label: "Molecules", count: "11" },
              { key: "organisms", label: "Organisms", count: "9" },
            ] as const
          ).map(({ key, label, count }) => {
            const isSelected = activeTier === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveTier(key);
                  if (typeof window !== "undefined") {
                    window.history.replaceState(null, "", `/docs/${key}`);
                  }
                }}
                className={`px-5 py-2 text-xs font-semibold rounded-full cursor-pointer relative transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                  isSelected ? "" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeGlobalTierPill"
                    transition={scaled.motionConfig.pillTransition}
                    style={{
                      borderRadius: `${scaled.scaledPillRadius}px`,
                      backgroundColor: tokens.primaryButtonColor,
                    }}
                    className="absolute inset-0 shadow-sm"
                  />
                )}
                <span
                  style={{
                    color: isSelected ? scaled.primaryActionTextColor : undefined,
                  }}
                  className="relative z-10"
                >
                  {label}
                </span>
                <span
                  style={{
                    borderRadius: `${scaled.scaledPillRadius}px`,
                    backgroundColor: isSelected
                      ? (scaled.primaryActionTextColor === "#FFFFFF" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)")
                      : "#E4E4E7",
                    color: isSelected ? scaled.primaryActionTextColor : "#71717A",
                  }}
                  className="relative z-10 text-[10px] px-1.5 py-0.2 font-bold tabular-nums"
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right meta: Scale & PoC quick links */}
        <div className="flex items-center gap-3">
          <span
            style={{
              fontSize: `${scaled.sublabelFontSize}px`,
              borderRadius: `${scaled.scaledPillRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
            }}
            className="text-neutral-600 bg-neutral-50 border px-3 py-1 shadow-2xs tabular-nums font-medium hidden sm:inline-block"
          >
            Scale: {tokens.scaleMultiplier.toFixed(2)}x • {tokens.motionPhysics}
          </span>
          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            style={{
              borderRadius: `${scaled.scaledPillRadius}px`,
            }}
            className="px-3.5 py-1.5 text-xs font-semibold bg-[#111111] hover:bg-neutral-800 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Export Tokens</span>
          </button>
        </div>
      </header>

      {/* 3-Column Studio Body */}
      <div className="flex-1 flex w-full">
        {/* ══════════════════════════════════════════════════════════
            COLUMN 1: LEFT SIDEBAR (CLEAN CATEGORICAL HIERARCHY)
           ══════════════════════════════════════════════════════════ */}
        <aside className="w-64 border-r border-[#EBEBEB] bg-[#FFFFFF] p-5 hidden lg:flex flex-col justify-between select-none sticky top-0 h-screen overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                  {activeTier === "atoms"
                    ? "Atoms Directory"
                    : activeTier === "molecules"
                    ? "Molecules Directory"
                    : "Organisms Directory"}
                </span>
                <span className="text-xs font-semibold text-neutral-800">Component Index</span>
              </div>
              <span
                style={{ borderRadius: `${scaled.scaledPillRadius}px` }}
                className="text-[10px] font-semibold bg-neutral-100 text-neutral-600 px-2.5 py-1 tabular-nums border border-neutral-200"
              >
                {activeTier === "atoms" ? "15 Primitives" : activeTier === "molecules" ? "11 Compounds" : "9 Organisms"}
              </span>
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
              ) : activeTier === "molecules" ? (
                <>
                  <div className="space-y-0.5">
                    <div className="px-3 py-1 text-xs font-semibold text-neutral-400">
                      Form &amp; Entry
                    </div>
                    <a href="#mol-form-field" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Form field</span>
                    </a>
                    <a href="#mol-input-group" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Input group</span>
                    </a>
                    <a href="#mol-search-bar" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Search bar</span>
                    </a>
                    <a href="#mol-select" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Select dropdown</span>
                    </a>
                    <a href="#mol-tag-input" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Tag input</span>
                    </a>
                    <a href="#mol-calendar" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Calendar dropdown</span>
                    </a>
                    
                  </div>

                  <div className="space-y-0.5 pt-2 border-t border-neutral-100">
                    <div className="px-3 py-1 text-xs font-semibold text-neutral-400">
                      Navigation
                    </div>
                    <a href="#mol-segmented" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Segmented control</span>
                    </a>
                    <a href="#mol-breadcrumbs" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Breadcrumbs</span>
                    </a>
                  </div>

                  <div className="space-y-0.5 pt-2 border-t border-neutral-100">
                    <div className="px-3 py-1 text-xs font-semibold text-neutral-400">
                      Display &amp; Feedback
                    </div>
                    <a href="#mol-stat-badge" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Metric stat</span>
                    </a>
                    <a href="#mol-alert" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Alert banner</span>
                    </a>
                    <a href="#mol-tooltip" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Tooltip popover</span>
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-0.5">
                    <div className="px-3 py-1 text-xs font-semibold text-neutral-400">
                      Data &amp; Layout
                    </div>
                    <a href="#org-data-table" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Data table</span>
                    </a>
                    <a href="#org-global-header" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Global header</span>
                    </a>
                    <a href="#org-navigation-sidebar" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>App sidebar</span>
                    </a>
                  </div>

                  <div className="space-y-0.5 pt-2 border-t border-neutral-100">
                    <div className="px-3 py-1 text-xs font-semibold text-neutral-400">
                      Query &amp; Actions
                    </div>
                    <a href="#org-command-palette" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Command palette</span>
                    </a>
                    <a href="#org-filter-builder" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Filter builder</span>
                    </a>
                    <a href="#org-date-picker" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Date range picker</span>
                    </a>
                    <a href="#org-metric-card" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Metric chart card</span>
                    </a>
                  </div>

                  <div className="space-y-0.5 pt-2 border-t border-neutral-100">
                    <div className="px-3 py-1 text-xs font-semibold text-neutral-400">
                      Overlays &amp; Sheets
                    </div>
                    <a href="#org-detail-drawer" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Slide-over drawer</span>
                    </a>
                    <a href="#org-confirmation-modal" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Confirmation modal</span>
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
          <div className={`w-full ${activeTier === "organisms" ? "max-w-5xl" : "max-w-[720px]"} space-y-8 pb-32`}>
            
            {/* ══════════════════════════════════════════════════════════
                VIEW A: PURE ATOMS (UNIVERSAL TOKEN CONTROL)
               ══════════════════════════════════════════════════════════ */}
            {activeTier === "atoms" && (
              <>
                {/* ── 0. FOUNDATIONAL TYPE SCALE ── */}
                <div id="atom-typography" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
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
                <div id="atom-buttons" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
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
                <div id="atom-icon-button" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
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
                <div id="atom-input" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
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
                <div id="atom-textarea" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
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
                <div id="atom-checkbox" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
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
                <div id="atom-radio" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
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
                <div id="atom-switch" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
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
                <div id="atom-slider" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
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

                {/* ── 9. PROGRESS BAR ATOM ── */}
                <div id="atom-progress" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-neutral-100">
                    <div>
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold tracking-tight">
                        Progress bar primitive
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Deterministic visual progress gauge with rounded caps and dynamic fill token.
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: `${scaled.sublabelFontSize}px`,
                        borderRadius: `${scaled.scaledPillRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                      }}
                      className="font-semibold text-neutral-800 bg-neutral-50 px-2.5 py-1 tabular-nums border shrink-0"
                    >
                      {sliderValue}% Complete
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-neutral-500 font-medium">
                      <span>Database partition migration batch</span>
                      <span className="tabular-nums">{sliderValue} of 100 shards</span>
                    </div>
                    <div
                      style={{
                        borderRadius: `${scaled.scaledPillRadius}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        height: "10px",
                      }}
                      className="w-full overflow-hidden border p-0.5"
                    >
                      <motion.div
                        style={{
                          borderRadius: `${scaled.scaledPillRadius}px`,
                          backgroundColor: tokens.primaryButtonColor,
                          height: "100%",
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${sliderValue}%` }}
                        transition={scaled.motionConfig.spring}
                      />
                    </div>
                  </div>
                </div>

                {/* ── 10. LUCIDE ICON ATOM ── */}
                <div id="atom-lucide-icons" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
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
                <div id="atom-badge" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
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
                <div id="atom-tag-chip" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
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
                <div id="atom-kbd" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
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
                <div id="atom-avatar" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
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
                VIEW B: MOLECULES (DEEPLY BOUND TO UNIVERSAL STUDIO TOKENS)
               ══════════════════════════════════════════════════════════ */}
            {activeTier === "molecules" && (
              <>
                {/* ── 1. FORM FIELD ── */}
                <div id="mol-form-field" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                        Form field
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Single Sign-On (SSO) email address with corporate domain verification and inline feedback.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEmailError((prev) => !prev)}
                      style={{
                        borderRadius: `${scaled.scaledPillRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.universalFillColor,
                        color: tokens.textIconColor,
                        fontSize: `${scaled.sublabelFontSize}px`,
                        padding: "4px 10px",
                        transition: scaled.transitionStyle,
                      }}
                      className="border font-medium cursor-pointer shadow-2xs hover:opacity-80 transition-opacity whitespace-nowrap shrink-0 px-3"
                    >
                      {isEmailError ? "Clear error" : "Simulate error"}
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="block font-medium">
                      Email address
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
                        transition: scaled.transitionStyle,
                      }}
                      className="flex items-center gap-2.5 border"
                    >
                      <Mail className={`w-4 h-4 shrink-0 transition-colors ${isEmailError ? "text-rose-500" : "text-neutral-400"}`} strokeWidth={1.8} />
                      <input
                        type="email"
                        value={textInput}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => {
                          setIsInputFocused(false);
                          if (textInput.length > 0 && (!textInput.includes("@") || !textInput.includes("."))) {
                            setIsEmailError(true);
                          }
                        }}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTextInput(val);
                          if (val.length > 0 && val.includes("@") && val.includes(".")) {
                            setIsEmailError(false);
                          }
                        }}
                        placeholder="name@enterprise.com"
                        style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                        className="w-full bg-transparent outline-none"
                      />
                      {isEmailError && (
                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" strokeWidth={2} />
                      )}
                    </div>

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
                        <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 block pt-0.5">
                          Monthly invoice and telemetry notifications will route to this inbox.
                        </span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* ── 2. INPUT GROUP ── */}
                <div id="mol-input-group" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                      Input group
                    </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Client credentials input conjoined with secret masking eye toggle and single-tap copy.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="block font-medium">
                      Secret API key
                    </label>

                    <div className="flex items-center">
                      <div
                        style={{
                          borderTopLeftRadius: `${scaled.scaledRadius}px`,
                          borderBottomLeftRadius: `${scaled.scaledRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          borderRightWidth: 0,
                          backgroundColor: scaled.effectiveInputFill,
                          height: `${scaled.scaledHeight}px`,
                          paddingLeft: `${scaled.scaledPaddingX}px`,
                          paddingRight: `${Math.round(8 * scaled.scale)}px`,
                          transition: scaled.transitionStyle,
                        }}
                        className="flex-1 flex items-center border"
                      >
                        <input
                          type={isApiKeyMasked ? "password" : "text"}
                          readOnly
                          value={apiKey}
                          style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                          className="w-full bg-transparent outline-none font-medium tabular-nums tracking-wide"
                        />
                        <button
                          type="button"
                          onClick={() => setIsApiKeyMasked((prev) => !prev)}
                          title={isApiKeyMasked ? "Reveal secret key" : "Hide secret key"}
                          aria-label={isApiKeyMasked ? "Reveal secret key" : "Hide secret key"}
                          style={{
                            borderRadius: `${scaled.scaledInnerRadius}px`,
                            transition: scaled.transitionStyle,
                          }}
                          className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer shrink-0 ml-1.5 focus:outline-none"
                        >
                          {isApiKeyMasked ? (
                            <Eye className="w-4 h-4" strokeWidth={1.8} />
                          ) : (
                            <EyeOff className="w-4 h-4" strokeWidth={1.8} />
                          )}
                        </button>
                      </div>
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
                          color: scaled.primaryActionTextColor,
                          height: `${scaled.scaledHeight}px`,
                          paddingLeft: `${scaled.scaledPaddingX}px`,
                          paddingRight: `${scaled.scaledPaddingX}px`,
                          fontSize: `${scaled.ctaFontSize}px`,
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

                {/* ── 3. SEARCH BAR ── */}
                <div id="mol-search-bar" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                      Search bar
                    </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Search input with leading search icon, clear trigger, and keyboard shortcut badge.
                    </p>
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
                        transition: scaled.transitionStyle,
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
                          placeholder="Search records, users, tags..."
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
                              style={{
                                borderRadius: `${scaled.scaledPillRadius}px`,
                                transition: scaled.transitionStyle,
                              }}
                              className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer hover:bg-black/5"
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
                            color: isSearchFocused
                              ? (scaled.primaryActionTextColor)
                              : tokens.textIconColor,
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
                            padding: "4px",
                          }}
                          className="absolute top-full left-0 right-0 z-30 space-y-0.5 border"
                        >
                          {["Documentation guides", "Security policy configuration", "User permission roles"].map((item, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setSearchBarQuery(item);
                                setIsSearchFocused(false);
                              }}
                              style={{
                                borderRadius: `${scaled.scaledOptionRadius}px`,
                                fontSize: `${scaled.sublabelFontSize}px`,
                                color: tokens.textIconColor,
                                padding: "6px 10px",
                                transition: scaled.transitionStyle,
                              }}
                              className="w-full text-left flex items-center gap-2 hover:opacity-80 hover:bg-black/5 cursor-pointer"
                            >
                              <Search className="w-3.5 h-3.5 text-neutral-400" />
                              <span>{item}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* ── 4. SELECT DROPDOWN ── */}
                <div id="mol-select" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                      Select dropdown
                    </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Role and tenancy selector popover with keyboard navigation and checkmark indicators.
                    </p>
                  </div>

                  <div ref={roleRef} className="relative space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="block font-medium">
                      Team role
                    </label>

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
                        transition: scaled.transitionStyle,
                      }}
                      className="w-full flex items-center justify-between text-left cursor-pointer border select-none"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Key className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }} className="truncate font-medium">
                          {role}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isRoleOpen ? 180 : 0 }}
                        transition={scaled.motionConfig.spring}
                        className="w-4 h-4 flex items-center justify-center shrink-0 text-neutral-400"
                      >
                        <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.2} />
                      </motion.div>
                    </button>

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
                            padding: "4px",
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
                              padding: "5px 8px",
                              transition: scaled.transitionStyle,
                            }}
                            className="w-full outline-none border transition-colors"
                          />
                          <div className="max-h-48 overflow-y-auto space-y-0.5 pt-0.5">
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
                                    backgroundColor: isSelected
                                      ? tokens.primaryButtonColor
                                      : isHovered
                                      ? tokens.hoverBackplateTint
                                      : "transparent",
                                    color: isSelected
                                      ? (scaled.primaryActionTextColor)
                                      : tokens.textIconColor,
                                    fontSize: `${scaled.labelFontSize}px`,
                                    padding: "6px 8px",
                                    transition: scaled.transitionStyle,
                                  }}
                                  className="w-full text-left flex items-center justify-between cursor-pointer select-none"
                                >
                                  <span>{opt}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={2.5} />}
                                </motion.button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* ── 5. TAG INPUT ── */}
                <div id="mol-tag-input" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                      Tag input
                    </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Multi-tag deployment classifier with animated remove transitions and popover tag selector.
                    </p>
                  </div>

                  <div ref={tagRef} className="relative space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="block font-medium">
                      Project tags
                    </label>

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
                        transition: scaled.transitionStyle,
                      }}
                      className="w-full flex flex-wrap items-center gap-1.5 border"
                    >
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
                              borderRadius: `${scaled.scaledPillRadius}px`,
                              fontSize: `${scaled.sublabelFontSize}px`,
                              backgroundColor: tokens.hoverBackplateTint,
                              borderColor: tokens.universalBorderColor,
                              borderWidth: `${tokens.borderWidth}px`,
                              color: tokens.textIconColor,
                              transition: scaled.transitionStyle,
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
                              <X className="w-3 h-3" />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>

                      <motion.button
                        type="button"
                        whileTap={{ scale: scaled.motionConfig.tapScale }}
                        onClick={() => setIsTagOpen((prev) => !prev)}
                        style={{
                          borderRadius: `${scaled.scaledPillRadius}px`,
                          fontSize: `${scaled.sublabelFontSize}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.universalFillColor,
                          color: tokens.textIconColor,
                          transition: scaled.transitionStyle,
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 font-medium border border-dashed hover:opacity-80 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-neutral-500" strokeWidth={2.5} />
                        <span>Add tag</span>
                      </motion.button>
                    </div>

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
                            padding: "4px",
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
                              padding: "5px 8px",
                              transition: scaled.transitionStyle,
                            }}
                            className="w-full outline-none border transition-colors"
                          />
                          <div className="max-h-48 overflow-y-auto space-y-0.5 pt-0.5">
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
                                    padding: "6px 8px",
                                    transition: scaled.transitionStyle,
                                  }}
                                  className="flex items-center justify-between cursor-pointer select-none"
                                >
                                  <span className={isSelected ? "font-semibold" : "font-normal"}>{opt}</span>
                                  <div
                                    style={{
                                      borderRadius: `${scaled.scaledCheckboxRadius}px`,
                                      backgroundColor: isSelected ? tokens.primaryButtonColor : tokens.universalFillColor,
                                      borderColor: isSelected ? tokens.primaryButtonColor : tokens.universalBorderColor,
                                      borderWidth: `${tokens.borderWidth}px`,
                                      transition: scaled.transitionStyle,
                                    }}
                                    className="w-4 h-4 flex items-center justify-center shrink-0 border"
                                  >
                                    {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
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

                {/* ── 6. CALENDAR DROPDOWN ── */}
                <div id="mol-calendar" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                      Calendar dropdown
                    </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Target maintenance deployment date picker with month stepper buttons and year dropdown selector.
                    </p>
                  </div>

                  <div ref={calendarRef} className="relative space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="block font-medium">
                      Scheduled deployment date
                    </label>

                    {/* Trigger button */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsCalendarOpen((prev) => !prev);
                        setIsYearPickerOpen(false);
                      }}
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: isCalendarOpen ? tokens.textIconColor : tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: scaled.effectiveInputFill,
                        height: `${scaled.scaledHeight}px`,
                        paddingLeft: `${scaled.scaledPaddingX}px`,
                        paddingRight: `${scaled.scaledPaddingX}px`,
                        boxShadow: isCalendarOpen
                          ? (scaled.isZeroBorder ? scaled.focusHalo : `0 0 0 3px ${tokens.textIconColor}12`)
                          : "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
                        transition: scaled.transitionStyle,
                      }}
                      className="w-full flex items-center justify-between text-left cursor-pointer border select-none font-medium tabular-nums text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Calendar className="w-4 h-4 text-neutral-400 shrink-0" strokeWidth={1.8} />
                        <span style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }} className="truncate">
                          {selectedCalendarDate
                            ? new Date(selectedCalendarDate.year, selectedCalendarDate.month, selectedCalendarDate.day).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Select date"}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isCalendarOpen ? 180 : 0 }}
                        transition={scaled.motionConfig.spring}
                        className="w-4 h-4 flex items-center justify-center shrink-0 text-neutral-400"
                      >
                        <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.2} />
                      </motion.div>
                    </button>

                    {/* Calendar Popover */}
                    <AnimatePresence>
                      {isCalendarOpen && (
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
                            boxShadow: "0 12px 28px -4px rgba(0,0,0,0.12), 0 4px 8px -2px rgba(0,0,0,0.04)",
                            width: "310px",
                            maxWidth: "100%",
                          }}
                          className="absolute top-full left-0 z-30 p-3 border space-y-3"
                        >
                          {/* Calendar Header with Month Nav & Year Change */}
                          <div
                            style={{ borderColor: tokens.universalBorderColor, borderBottomWidth: `${tokens.borderWidth}px` }}
                            className="flex items-center justify-between gap-1 pb-2 border-b"
                          >
                            {/* Month Selector with Prev / Next */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  if (calendarViewMonth === 0) {
                                    setCalendarViewMonth(11);
                                    setCalendarViewYear((y) => y - 1);
                                  } else {
                                    setCalendarViewMonth((m) => m - 1);
                                  }
                                }}
                                aria-label="Previous month"
                                style={{ borderRadius: `${scaled.scaledInnerRadius}px`, color: tokens.textIconColor }}
                                className="p-1 text-neutral-400 hover:opacity-80 hover:bg-black/5 transition-colors cursor-pointer"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2.2} />
                              </button>
                              <span style={{ color: tokens.textIconColor }} className="text-xs font-semibold w-[74px] text-center select-none">
                                {CALENDAR_MONTHS[calendarViewMonth]}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (calendarViewMonth === 11) {
                                    setCalendarViewMonth(0);
                                    setCalendarViewYear((y) => y + 1);
                                  } else {
                                    setCalendarViewMonth((m) => m + 1);
                                  }
                                }}
                                aria-label="Next month"
                                style={{ borderRadius: `${scaled.scaledInnerRadius}px`, color: tokens.textIconColor }}
                                className="p-1 text-neutral-400 hover:opacity-80 hover:bg-black/5 transition-colors cursor-pointer"
                              >
                                <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.2} />
                              </button>
                            </div>

                            {/* Year Selector with Stepper & Jump Toggle */}
                            <div
                              style={{
                                borderRadius: `${scaled.scaledPillRadius}px`,
                                borderColor: tokens.universalBorderColor,
                                borderWidth: `${tokens.borderWidth}px`,
                                backgroundColor: tokens.hoverBackplateTint,
                              }}
                              className="flex items-center gap-1 p-0.5 border"
                            >
                              <button
                                type="button"
                                onClick={() => setCalendarViewYear((y) => y - 1)}
                                aria-label="Previous year"
                                style={{ borderRadius: `${scaled.scaledInnerRadius}px`, color: tokens.textIconColor }}
                                className="p-0.5 text-neutral-500 hover:opacity-80 hover:bg-white transition-colors cursor-pointer"
                              >
                                <ChevronLeft className="w-3 h-3" strokeWidth={2.2} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsYearPickerOpen((prev) => !prev)}
                                title="Click to jump year"
                                style={{ borderRadius: `${scaled.scaledInnerRadius}px`, color: tokens.textIconColor }}
                                className="px-1.5 py-0.5 text-xs font-semibold hover:bg-white transition-colors cursor-pointer flex items-center gap-0.5 select-none tabular-nums"
                              >
                                <span>{calendarViewYear}</span>
                                <ChevronDown
                                  className={`w-2.5 h-2.5 text-neutral-400 transition-transform ${isYearPickerOpen ? "rotate-180" : ""}`}
                                  strokeWidth={2.5}
                                />
                              </button>
                              <button
                                type="button"
                                onClick={() => setCalendarViewYear((y) => y + 1)}
                                aria-label="Next year"
                                style={{ borderRadius: `${scaled.scaledInnerRadius}px`, color: tokens.textIconColor }}
                                className="p-0.5 text-neutral-500 hover:opacity-80 hover:bg-white transition-colors cursor-pointer"
                              >
                                <ChevronRight className="w-3 h-3" strokeWidth={2.2} />
                              </button>
                            </div>
                          </div>

                          {/* Year Grid View OR Days Grid View */}
                          {isYearPickerOpen ? (
                            <div className="space-y-2 py-1">
                              <div className="flex items-center justify-between px-1 text-[11px] font-medium text-neutral-400">
                                <span>Select year</span>
                                <span>2020 – 2031</span>
                              </div>
                              <div className="grid grid-cols-4 gap-1.5">
                                {Array.from({ length: 12 }, (_, i) => 2020 + i).map((y) => {
                                  const isSelectedYear = calendarViewYear === y;
                                  return (
                                    <button
                                      key={y}
                                      type="button"
                                      onClick={() => {
                                        setCalendarViewYear(y);
                                        setIsYearPickerOpen(false);
                                      }}
                                      style={{
                                        borderRadius: `${scaled.scaledPillRadius}px`,
                                        backgroundColor: isSelectedYear ? tokens.primaryButtonColor : undefined,
                                        color: isSelectedYear
                                          ? (scaled.primaryActionTextColor)
                                          : tokens.textIconColor,
                                        transition: scaled.transitionStyle,
                                      }}
                                      className={`py-1.5 text-xs font-medium tabular-nums text-center transition-colors cursor-pointer ${
                                        isSelectedYear
                                          ? "font-semibold shadow-xs"
                                          : "hover:bg-black/5"
                                      }`}
                                    >
                                      {y}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {/* Weekdays Row */}
                              <div className="grid grid-cols-7 gap-1 text-center">
                                {CALENDAR_WEEKDAYS.map((w) => (
                                  <div key={w} className="text-[10px] font-semibold text-neutral-400 py-0.5 select-none">
                                    {w}
                                  </div>
                                ))}
                              </div>

                              {/* Days Grid */}
                              <div className="grid grid-cols-7 gap-1">
                                {getCalendarDays(calendarViewYear, calendarViewMonth).map((d, idx) => {
                                  const isSelected =
                                    selectedCalendarDate &&
                                    selectedCalendarDate.year === d.year &&
                                    selectedCalendarDate.month === d.monthIndex &&
                                    selectedCalendarDate.day === d.day;
                                  const isToday =
                                    d.year === 2026 && d.monthIndex === 10 && d.day === 6;
                                  const isCurrentMonth = d.month === "curr";

                                  return (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => {
                                        setSelectedCalendarDate({
                                          year: d.year,
                                          month: d.monthIndex,
                                          day: d.day,
                                        });
                                        if (d.month !== "curr") {
                                          setCalendarViewYear(d.year);
                                          setCalendarViewMonth(d.monthIndex);
                                        }
                                        setIsCalendarOpen(false);
                                      }}
                                      style={{
                                        borderRadius: `${scaled.scaledPillRadius}px`,
                                        backgroundColor: isSelected ? tokens.primaryButtonColor : undefined,
                                        color: isSelected
                                          ? (scaled.primaryActionTextColor)
                                          : !isCurrentMonth
                                          ? "#A3A3A3"
                                          : tokens.textIconColor,
                                        borderColor: isToday && !isSelected ? tokens.universalBorderColor : "transparent",
                                        borderWidth: isToday && !isSelected ? `${tokens.borderWidth}px` : "0",
                                        transition: scaled.transitionStyle,
                                      }}
                                      className={`h-7 w-full flex items-center justify-center text-xs tabular-nums select-none transition-colors cursor-pointer ${
                                        isSelected
                                          ? "font-semibold shadow-xs"
                                          : !isCurrentMonth
                                          ? "opacity-50"
                                          : "hover:bg-black/5"
                                      }`}
                                    >
                                      {d.day}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Quick Action Footer */}
                          <div
                            style={{ borderColor: tokens.universalBorderColor, borderTopWidth: `${tokens.borderWidth}px` }}
                            className="pt-2 border-t flex items-center justify-between text-xs"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCalendarDate({ year: 2026, month: 10, day: 6 });
                                setCalendarViewYear(2026);
                                setCalendarViewMonth(10);
                                setIsYearPickerOpen(false);
                                setIsCalendarOpen(false);
                              }}
                              style={{ borderRadius: `${scaled.scaledInnerRadius}px`, color: tokens.textIconColor }}
                              className="font-medium px-2 py-1 hover:bg-black/5 transition-colors cursor-pointer"
                            >
                              Today (Nov 6)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsCalendarOpen(false);
                                setIsYearPickerOpen(false);
                              }}
                              style={{ borderRadius: `${scaled.scaledInnerRadius}px` }}
                              className="text-neutral-400 hover:text-neutral-700 font-medium px-2 py-1 hover:bg-black/5 transition-colors cursor-pointer"
                            >
                              Close
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* ── 7. SEGMENTED CONTROL ── */}
                <div id="mol-segmented" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                      Segmented control
                    </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Sliding billing cadence switcher with fluid spring pill transitions.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="block font-medium">
                      Billing cadence
                    </label>
                    <div
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        padding: "3px",
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
                            onClick={() => setSegmentValue(key)}
                            style={{
                              borderRadius: `${scaled.scaledPillRadius}px`,
                              fontSize: `${scaled.sublabelFontSize}px`,
                              padding: `${Math.round(5 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                              transition: scaled.transitionStyle,
                            }}
                            className="font-medium cursor-pointer relative transition-colors select-none whitespace-nowrap shrink-0"
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="activeSegmentPill"
                                transition={scaled.motionConfig.pillTransition}
                                style={{
                                  borderRadius: `${scaled.scaledPillRadius}px`,
                                  backgroundColor: tokens.primaryButtonColor,
                                }}
                                className="absolute inset-0 shadow-sm"
                              />
                            )}
                            <span
                              style={{
                                color: isSelected
                                  ? (scaled.primaryActionTextColor)
                                  : tokens.textIconColor,
                              }}
                              className="relative z-10"
                            >
                              {label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ── 8. BREADCRUMBS ── */}
                <div id="mol-breadcrumbs" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                      Breadcrumbs
                    </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Hierarchical wayfinding trail with chevron separators and collapsed overflow.
                    </p>
                  </div>

                  <nav className="flex items-center gap-1.5 flex-wrap text-xs pt-1 select-none">
                    <button
                      type="button"
                      style={{ color: tokens.textIconColor }}
                      className="hover:opacity-80 transition-colors font-medium cursor-pointer"
                    >
                      Infrastructure
                    </button>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" strokeWidth={2} />

                    <div ref={breadcrumbMenuRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setIsBreadcrumbMenuOpen((prev) => !prev)}
                        style={{
                          borderRadius: `${scaled.scaledInnerRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.hoverBackplateTint,
                          color: tokens.textIconColor,
                        }}
                        className="px-1.5 py-0.5 border font-bold cursor-pointer hover:opacity-80 transition-opacity"
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
                              onClick={() => setIsBreadcrumbMenuOpen(false)}
                              style={{ borderRadius: `${scaled.scaledOptionRadius}px`, color: tokens.textIconColor }}
                              className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-black/5 flex items-center justify-between cursor-pointer"
                            >
                              <span>US-East Clusters</span>
                              <ChevronRight className="w-3 h-3 text-neutral-400" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsBreadcrumbMenuOpen(false)}
                              style={{ borderRadius: `${scaled.scaledOptionRadius}px`, color: tokens.textIconColor }}
                              className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-black/5 flex items-center justify-between cursor-pointer"
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
                      style={{ color: tokens.textIconColor }}
                      className="hover:opacity-80 transition-colors font-medium cursor-pointer"
                    >
                      Node-4
                    </button>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" strokeWidth={2} />
                    <span
                      style={{
                        borderRadius: `${scaled.scaledPillRadius}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        color: tokens.textIconColor,
                      }}
                      className="px-2.5 py-1 font-semibold flex items-center gap-1.5 border"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Telemetry</span>
                    </span>
                  </nav>
                </div>

                {/* ── 9. METRIC STAT ── */}
                <div id="mol-stat-badge" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                      Metric stat
                    </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Telemetry display pairing a metric label, primary value, and trend badge.
                    </p>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 font-medium block">
                        Net Revenue Run Rate
                      </span>
                      <div className="flex items-baseline gap-2.5 pt-1">
                        <span
                          style={{ fontSize: `${scaled.headingFontSize + 8}px`, color: tokens.textIconColor }}
                          className="font-semibold tracking-tight tabular-nums"
                        >
                          $148,200
                        </span>
                        <span
                          style={{
                            fontSize: `${scaled.sublabelFontSize}px`,
                            borderRadius: `${scaled.scaledPillRadius}px`,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                          }}
                          className="text-emerald-700 bg-emerald-50 border px-2 py-0.5 font-medium inline-flex items-center gap-1 select-none tabular-nums"
                        >
                          <TrendingUp className="w-3 h-3 text-emerald-600" strokeWidth={2.5} />
                          <span>+18.4%</span>
                        </span>
                      </div>
                    </div>

                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">
                      vs. previous 30d
                    </span>
                  </div>
                </div>

                {/* ── 10. ALERT BANNER ── */}
                <div id="mol-alert" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                        Alert banner
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        High-priority cluster notifications banner with semantic color tokens and dismiss action.
                      </p>
                    </div>

                    <div
                      style={{
                        borderRadius: `${scaled.scaledPillRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                      }}
                      className="flex items-center gap-1 p-0.5 border"
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
                            className={`px-3 py-1.5 text-xs capitalize font-medium cursor-pointer relative transition-colors whitespace-nowrap shrink-0 ${
                              isSelected ? "font-semibold" : "opacity-70 hover:opacity-100"
                            }`}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="activeAlertVariant"
                                transition={scaled.motionConfig.pillTransition}
                                style={{
                                  borderRadius: `${scaled.scaledPillRadius}px`,
                                  backgroundColor: tokens.primaryButtonColor === "#FFFFFF" ? "#111111" : tokens.primaryButtonColor,
                                }}
                                className="absolute inset-0 shadow-xs"
                              />
                            )}
                            <span
                              style={{
                                color: isSelected
                                  ? (scaled.primaryActionTextColor)
                                  : tokens.textIconColor,
                              }}
                              className="relative z-10"
                            >
                              {v}
                            </span>
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
                          padding: `${Math.round(12 * scaled.scale)}px ${Math.round(14 * scaled.scale)}px`,
                        }}
                        className="border flex items-start gap-3 relative transition-all"
                      >
                        <div className="shrink-0 mt-0.5">
                          {alertVariant === "critical" && <AlertCircle className="w-4 h-4 text-rose-600" />}
                          {alertVariant === "warning" && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                          {alertVariant === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          {alertVariant === "info" && <Info className="w-4 h-4 text-neutral-700" />}
                        </div>

                        <div className="flex-1 space-y-0.5">
                          <div style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                            {alertVariant === "critical" && "Payment Gateway Authorization Failed"}
                            {alertVariant === "warning" && "API Rate Quota Nearing Threshold (88%)"}
                            {alertVariant === "success" && "Database Migration Successfully Applied"}
                            {alertVariant === "info" && "Scheduled System Maintenance Window"}
                          </div>
                          <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-600 leading-relaxed font-normal">
                            {alertVariant === "critical" && "Your monthly cluster subscription could not be charged."}
                            {alertVariant === "warning" && "Your workspace has consumed 88,400 of 100,000 monthly API calls."}
                            {alertVariant === "success" && "Schema batch #2026-v8 deployed to all 4 clusters with zero downtime."}
                            {alertVariant === "info" && "Cluster telemetry upgrades are scheduled for Sunday 02:00 UTC."}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsAlertDismissed(true)}
                          className="text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer p-0.5"
                          title="Dismiss alert"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ) : (
                      <div
                        style={{
                          borderRadius: `${scaled.scaledMenuRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.hoverBackplateTint,
                        }}
                        className="p-3 border text-center"
                      >
                        <button
                          type="button"
                          onClick={() => setIsAlertDismissed(false)}
                          style={{ color: tokens.textIconColor }}
                          className="text-xs font-semibold cursor-pointer hover:opacity-80"
                        >
                          Show dismissed alert again
                        </button>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── 11. TOOLTIP POPOVER ── */}
                <div id="mol-tooltip" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                      Tooltip popover
                    </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Contextual micro-popover providing supplementary assistance on hover.
                    </p>
                  </div>

                  <div className="pt-2">
                    <div className="relative inline-block">
                      <button
                        type="button"
                        onMouseEnter={() => setIsTooltipOpen(true)}
                        onMouseLeave={() => setIsTooltipOpen(false)}
                        onFocus={() => setIsTooltipOpen(true)}
                        onBlur={() => setIsTooltipOpen(false)}
                        style={{
                          borderRadius: `${scaled.scaledRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: scaled.effectiveInputFill,
                          color: tokens.textIconColor,
                          height: `${scaled.scaledHeight}px`,
                          paddingLeft: `${scaled.scaledPaddingX}px`,
                          paddingRight: `${scaled.scaledPaddingX}px`,
                          transition: scaled.transitionStyle,
                        }}
                        className="border font-medium flex items-center gap-2 cursor-pointer shadow-2xs select-none"
                      >
                        <Info className="w-4 h-4 text-neutral-400" />
                        <span>Hover for metric formula</span>
                      </button>

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
                              Calculated 99th percentile write-to-read sync latency across database replica clusters.
                            </p>
                            <div className="w-2 h-2 bg-[#111111] rotate-45 absolute -bottom-1 left-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ══════════════════════════════════════════════════════════
                VIEW C: ENTERPRISE ORGANISMS (DEEPLY BOUND TO STUDIO TOKENS)
               ══════════════════════════════════════════════════════════ */}
            {activeTier === "organisms" && (
              <>
                {/* ── 1. INTERACTIVE DATA TABLE ORGANISM ── */}
                <div id="org-data-table" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                        Interactive data table
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Production node fleet grid with tri-state multi-select, role filter pills, and batch actions toolbar.
                      </p>
                    </div>

                    {/* Filter Pills */}
                    <div
                      style={{
                        borderRadius: `${scaled.scaledPillRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                      }}
                      className="inline-flex items-center gap-1.5 p-1 border self-start sm:self-auto shrink-0 whitespace-nowrap"
                    >
                      {(["all", "API Gateway", "Worker", "Cache"] as const).map((r) => {
                        const isSelected = orgTableRoleFilter === r;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setOrgTableRoleFilter(r)}
                            className="px-3.5 py-1.5 text-xs capitalize cursor-pointer relative transition-colors font-medium whitespace-nowrap shrink-0"
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="activeOrgTableRolePill"
                                transition={scaled.motionConfig.pillTransition}
                                style={{
                                  borderRadius: `${scaled.scaledPillRadius}px`,
                                  backgroundColor: tokens.primaryButtonColor === "#FFFFFF" ? "#111111" : tokens.primaryButtonColor,
                                }}
                                className="absolute inset-0 shadow-xs"
                              />
                            )}
                            <span
                              style={{
                                color: isSelected
                                  ? (scaled.primaryActionTextColor)
                                  : tokens.textIconColor,
                              }}
                              className="relative z-10 whitespace-nowrap"
                            >
                              {r === "all" ? "All Roles" : r}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Search Toolbar */}
                  <div className="flex items-center gap-2">
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
                      className="flex-1 flex items-center gap-2 border"
                    >
                      <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Search by node name, region, or IP..."
                        value={orgTableSearch}
                        onChange={(e) => setOrgTableSearch(e.target.value)}
                        style={{ fontSize: `${scaled.sublabelFontSize}px`, color: tokens.textIconColor }}
                        className="w-full bg-transparent outline-none font-medium"
                      />
                      {orgTableSearch && (
                        <button type="button" onClick={() => setOrgTableSearch("")} className="text-neutral-400 hover:text-neutral-700">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Data Table Element */}
                  <div
                    style={{
                      borderRadius: `${scaled.scaledRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      transition: scaled.transitionStyle,
                    }}
                    className="overflow-x-auto border"
                  >
                    <table className="w-full text-left text-xs border-collapse min-w-[740px]">
                      <thead>
                        <tr
                          style={{
                            borderColor: tokens.universalBorderColor,
                            borderBottomWidth: `${tokens.borderWidth}px`,
                            backgroundColor: tokens.hoverBackplateTint,
                            color: tokens.textIconColor,
                          }}
                          className="border-b font-semibold select-none"
                        >
                          <th className="p-3.5 w-12 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                if (orgTableSelected.length === CLUSTER_NODES.length) {
                                  setOrgTableSelected([]);
                                } else {
                                  setOrgTableSelected(CLUSTER_NODES.map((n) => n.id));
                                }
                              }}
                              style={{
                                borderRadius: `${scaled.scaledCheckboxRadius}px`,
                                borderColor: orgTableSelected.length > 0 ? tokens.primaryButtonColor : tokens.universalBorderColor,
                                borderWidth: `${tokens.borderWidth}px`,
                                backgroundColor: orgTableSelected.length > 0 ? tokens.primaryButtonColor : tokens.universalFillColor,
                                transition: scaled.transitionStyle,
                              }}
                              className="w-4 h-4 flex items-center justify-center cursor-pointer border transition-colors"
                              title="Toggle select all"
                            >
                              {orgTableSelected.length === CLUSTER_NODES.length && (
                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                              )}
                              {orgTableSelected.length > 0 && orgTableSelected.length < CLUSTER_NODES.length && (
                                <Minus className="w-3 h-3 text-white" strokeWidth={3} />
                              )}
                            </button>
                          </th>
                          <th className="p-3.5 whitespace-nowrap">Node / Cluster</th>
                          <th className="p-3.5 whitespace-nowrap">Region</th>
                          <th className="p-3.5 whitespace-nowrap">Role</th>
                          <th className="p-3.5 whitespace-nowrap">Status</th>
                          <th className="p-3.5 whitespace-nowrap">CPU / Memory</th>
                          <th className="p-3.5 whitespace-nowrap">Latency</th>
                          <th className="p-3.5 text-right whitespace-nowrap">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {CLUSTER_NODES.filter((n) => {
                          const matchesRole = orgTableRoleFilter === "all" || n.role === orgTableRoleFilter;
                          const matchesSearch =
                            !orgTableSearch ||
                            n.name.toLowerCase().includes(orgTableSearch.toLowerCase()) ||
                            n.region.toLowerCase().includes(orgTableSearch.toLowerCase());
                          return matchesRole && matchesSearch;
                        }).map((node) => {
                          const isSelected = orgTableSelected.includes(node.id);
                          return (
                            <tr
                              key={node.id}
                              style={{
                                borderColor: tokens.universalBorderColor,
                                borderBottomWidth: `${tokens.borderWidth}px`,
                                minHeight: `${scaled.scaledHeight}px`,
                                backgroundColor: isSelected ? tokens.hoverBackplateTint : "transparent",
                                transition: scaled.transitionStyle,
                              }}
                              className="border-b transition-colors hover:bg-black/5"
                            >
                              <td className="p-3.5 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOrgTableSelected((prev) =>
                                      prev.includes(node.id) ? prev.filter((id) => id !== node.id) : [...prev, node.id]
                                    );
                                  }}
                                  style={{
                                    borderRadius: `${scaled.scaledCheckboxRadius}px`,
                                    borderColor: isSelected ? tokens.primaryButtonColor : tokens.universalBorderColor,
                                    borderWidth: `${tokens.borderWidth}px`,
                                    backgroundColor: isSelected ? tokens.primaryButtonColor : tokens.universalFillColor,
                                    transition: scaled.transitionStyle,
                                  }}
                                  className="w-4 h-4 flex items-center justify-center cursor-pointer border transition-colors"
                                >
                                  {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                </button>
                              </td>
                              <td className="p-3.5 font-medium whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <Server className="w-3.5 h-3.5 text-neutral-400" />
                                  <span style={{ color: tokens.textIconColor }} className="tabular-nums font-semibold">
                                    {node.name}
                                  </span>
                                </div>
                              </td>
                              <td style={{ color: tokens.textIconColor }} className="p-3.5 tabular-nums opacity-80 whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <Globe className="w-3 h-3 text-neutral-400" />
                                  <span>{node.region}</span>
                                </div>
                              </td>
                              <td className="p-3.5 whitespace-nowrap">
                                <span
                                  style={{
                                    borderRadius: `${scaled.scaledPillRadius}px`,
                                    borderColor: tokens.universalBorderColor,
                                    borderWidth: `${tokens.borderWidth}px`,
                                    backgroundColor: tokens.hoverBackplateTint,
                                    color: tokens.textIconColor,
                                  }}
                                  className="inline-block px-2.5 py-1 text-xs font-medium border whitespace-nowrap shrink-0"
                                >
                                  {node.role}
                                </span>
                              </td>
                              <td className="p-3.5 whitespace-nowrap">
                                {node.status === "healthy" && (
                                  <span
                                    style={{
                                      borderRadius: `${scaled.scaledPillRadius}px`,
                                      borderColor: tokens.universalBorderColor,
                                      borderWidth: `${tokens.borderWidth}px`,
                                    }}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border whitespace-nowrap shrink-0"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Healthy
                                  </span>
                                )}
                                {node.status === "degraded" && (
                                  <span
                                    style={{
                                      borderRadius: `${scaled.scaledPillRadius}px`,
                                      borderColor: tokens.universalBorderColor,
                                      borderWidth: `${tokens.borderWidth}px`,
                                    }}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 border whitespace-nowrap shrink-0"
                                  >
                                    <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />
                                    Degraded
                                  </span>
                                )}
                                {node.status === "syncing" && (
                                  <span
                                    style={{
                                      borderRadius: `${scaled.scaledPillRadius}px`,
                                      borderColor: tokens.universalBorderColor,
                                      borderWidth: `${tokens.borderWidth}px`,
                                    }}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-sky-700 bg-sky-50 border whitespace-nowrap shrink-0"
                                  >
                                    <RefreshCw className="w-2.5 h-2.5 text-sky-500 animate-spin" />
                                    Syncing
                                  </span>
                                )}
                              </td>
                              <td style={{ color: tokens.textIconColor }} className="p-3.5 tabular-nums font-medium whitespace-nowrap">
                                {node.cpu} / {node.memory}
                              </td>
                              <td style={{ color: tokens.textIconColor }} className="p-3.5 tabular-nums opacity-80 whitespace-nowrap">
                                {node.latency}
                              </td>
                              <td className="p-3.5 text-right relative whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => setOrgTableRowMenuOpen((curr) => (curr === node.id ? null : node.id))}
                                  style={{
                                    borderRadius: `${scaled.scaledInnerRadius}px`,
                                    color: tokens.textIconColor,
                                  }}
                                  className="p-1 hover:bg-black/5 transition-colors cursor-pointer"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>

                                {/* Row Actions Popover */}
                                <AnimatePresence>
                                  {orgTableRowMenuOpen === node.id && (
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
                                      className="absolute right-0 mt-1 w-44 p-1 z-30 border text-left space-y-0.5"
                                    >
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setIsDrawerOpen(true);
                                          setOrgTableRowMenuOpen(null);
                                        }}
                                        style={{
                                          borderRadius: `${scaled.scaledOptionRadius}px`,
                                          color: tokens.textIconColor,
                                        }}
                                        className="w-full px-2.5 py-1.5 text-xs hover:bg-black/5 flex items-center gap-2 cursor-pointer transition-colors"
                                      >
                                        <Layers className="w-3.5 h-3.5 text-neutral-400" />
                                        <span>Inspect Node</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          triggerToast(`Restarting node ${node.name}...`);
                                          setOrgTableRowMenuOpen(null);
                                        }}
                                        style={{
                                          borderRadius: `${scaled.scaledOptionRadius}px`,
                                          color: tokens.textIconColor,
                                        }}
                                        className="w-full px-2.5 py-1.5 text-xs hover:bg-black/5 flex items-center gap-2 cursor-pointer transition-colors"
                                      >
                                        <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
                                        <span>Restart Node</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          triggerToast(`Copied ${node.name} ID to clipboard`);
                                          setOrgTableRowMenuOpen(null);
                                        }}
                                        style={{
                                          borderRadius: `${scaled.scaledOptionRadius}px`,
                                          color: tokens.textIconColor,
                                        }}
                                        className="w-full px-2.5 py-1.5 text-xs hover:bg-black/5 flex items-center gap-2 cursor-pointer transition-colors"
                                      >
                                        <Copy className="w-3.5 h-3.5 text-neutral-400" />
                                        <span>Copy ID</span>
                                      </button>
                                      <div
                                        style={{ borderColor: tokens.universalBorderColor, borderTopWidth: `${tokens.borderWidth}px` }}
                                        className="my-1 border-t"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setIsConfirmModalOpen(true);
                                          setOrgTableRowMenuOpen(null);
                                        }}
                                        style={{
                                          borderRadius: `${scaled.scaledOptionRadius}px`,
                                        }}
                                        className="w-full px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition-colors font-medium"
                                      >
                                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                        <span>Decommission</span>
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Floating Spring Bulk Actions Bar */}
                  <AnimatePresence>
                    {orgTableSelected.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={scaled.motionConfig.spring}
                        style={{
                          borderRadius: `${scaled.scaledRadius}px`,
                          backgroundColor: tokens.primaryButtonColor === "#FFFFFF" ? "#111111" : tokens.primaryButtonColor,
                          color: "#FFFFFF",
                        }}
                        className="p-3 shadow-xl flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            style={{ borderRadius: `${scaled.scaledPillRadius}px` }}
                            className="font-semibold bg-white/20 px-2 py-0.5 tabular-nums"
                          >
                            {orgTableSelected.length}
                          </span>
                          <span>cluster nodes selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => triggerToast(`Exported ${orgTableSelected.length} cluster nodes to CSV`)}
                            style={{
                              borderRadius: `${scaled.scaledPillRadius}px`,
                              height: `${Math.round(scaled.scaledHeight * 0.75)}px`,
                            }}
                            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 font-medium transition-colors cursor-pointer flex items-center justify-center"
                          >
                            Export CSV
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerToast(`Restarting ${orgTableSelected.length} selected nodes...`)}
                            style={{
                              borderRadius: `${scaled.scaledPillRadius}px`,
                              height: `${Math.round(scaled.scaledHeight * 0.75)}px`,
                            }}
                            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 font-medium transition-colors cursor-pointer flex items-center justify-center"
                          >
                            Restart
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsConfirmModalOpen(true)}
                            style={{
                              borderRadius: `${scaled.scaledPillRadius}px`,
                              height: `${Math.round(scaled.scaledHeight * 0.75)}px`,
                            }}
                            className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 font-medium transition-colors cursor-pointer text-white flex items-center justify-center"
                          >
                            Decommission
                          </button>
                          <button
                            type="button"
                            onClick={() => setOrgTableSelected([])}
                            style={{
                              borderRadius: `${scaled.scaledPillRadius}px`,
                              height: `${Math.round(scaled.scaledHeight * 0.75)}px`,
                            }}
                            className="text-white/70 hover:text-white px-2 py-1 font-medium transition-colors cursor-pointer flex items-center justify-center"
                          >
                            Clear
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Table Pagination Organism Footer */}
                  <div
                    style={{ borderColor: tokens.universalBorderColor, borderTopWidth: `${tokens.borderWidth}px` }}
                    className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t"
                  >
                    <span style={{ color: tokens.textIconColor }} className="tabular-nums opacity-80">
                      Showing 1–5 of 12 cluster nodes
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        style={{
                          borderRadius: `${scaled.scaledPillRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          color: tokens.textIconColor,
                          opacity: 0.5,
                        }}
                        className="px-2.5 py-1 border cursor-not-allowed"
                        disabled
                      >
                        Prev
                      </button>
                      <button
                        type="button"
                        style={{
                          borderRadius: `${scaled.scaledPillRadius}px`,
                          backgroundColor: tokens.primaryButtonColor,
                          color: scaled.primaryActionTextColor,
                        }}
                        className="w-6 h-6 flex items-center justify-center font-semibold text-xs shadow-xs"
                      >
                        1
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerToast("Paging to page 2")}
                        style={{
                          borderRadius: `${scaled.scaledPillRadius}px`,
                          color: tokens.textIconColor,
                        }}
                        className="w-6 h-6 flex items-center justify-center font-medium text-xs hover:bg-black/5"
                      >
                        2
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerToast("Paging to next page")}
                        style={{
                          borderRadius: `${scaled.scaledPillRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          color: tokens.textIconColor,
                        }}
                        className="px-2.5 py-1 border cursor-pointer font-medium hover:bg-black/5"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── 2. GLOBAL APPLICATION HEADER ORGANISM ── */}
                <div id="org-global-header" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                      Global application header
                    </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Enterprise application header with workspace selector, global search accelerator, and active health pulse.
                    </p>
                  </div>

                  {/* Live Header Component Bar */}
                  <div
                    style={{
                      borderRadius: `${scaled.scaledRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      backgroundColor: scaled.effectiveInputFill,
                      height: `${scaled.scaledHeight + 12}px`,
                      transition: scaled.transitionStyle,
                    }}
                    className="p-3 border flex items-center justify-between gap-3 relative select-none"
                  >
                    {/* Left: Organization / Workspace Switcher */}
                    <div ref={workspaceRef} className="relative flex items-center gap-2">
                      <div
                        style={{
                          backgroundColor: tokens.primaryButtonColor,
                          borderRadius: `${scaled.scaledPillRadius}px`,
                          color: scaled.primaryActionTextColor,
                        }}
                        className="w-7 h-7 flex items-center justify-center font-bold text-xs shrink-0"
                      >
                        ZL
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsWorkspaceMenuOpen((prev) => !prev)}
                        style={{
                          borderRadius: `${scaled.scaledPillRadius}px`,
                          color: tokens.textIconColor,
                        }}
                        className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold hover:bg-black/5 transition-colors cursor-pointer"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span className="truncate max-w-[130px] sm:max-w-[180px]">{activeWorkspace}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                      </button>

                      {/* Workspace Dropdown */}
                      <AnimatePresence>
                        {isWorkspaceMenuOpen && (
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
                            className="absolute top-full left-0 mt-1 w-56 p-1 z-30 border text-left space-y-0.5"
                          >
                            <div className="px-2 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                              Switch Workspace
                            </div>
                            {[
                              "Acme Corp (Production)",
                              "Staging Cluster (us-east)",
                              "Dev Sandbox",
                            ].map((ws) => (
                              <button
                                key={ws}
                                type="button"
                                onClick={() => {
                                  setActiveWorkspace(ws);
                                  setIsWorkspaceMenuOpen(false);
                                  triggerToast(`Switched workspace to ${ws}`);
                                }}
                                style={{
                                  borderRadius: `${scaled.scaledOptionRadius}px`,
                                  color: tokens.textIconColor,
                                }}
                                className="w-full px-2.5 py-1.5 text-xs hover:bg-black/5 flex items-center justify-between cursor-pointer transition-colors"
                              >
                                <span className={activeWorkspace === ws ? "font-semibold" : ""}>{ws}</span>
                                {activeWorkspace === ws && <Check className="w-3.5 h-3.5" />}
                              </button>
                            ))}
                            <div
                              style={{ borderColor: tokens.universalBorderColor, borderTopWidth: `${tokens.borderWidth}px` }}
                              className="my-1 border-t"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setIsWorkspaceMenuOpen(false);
                                triggerToast("Opening workspace creator modal...");
                              }}
                              style={{
                                borderRadius: `${scaled.scaledOptionRadius}px`,
                                color: tokens.textIconColor,
                              }}
                              className="w-full px-2.5 py-1.5 text-xs hover:bg-black/5 flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5 text-neutral-400" />
                              <span>Create workspace</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Middle: Command Search Trigger */}
                    <button
                      type="button"
                      onClick={() => setIsCmdPaletteOpen(true)}
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.universalFillColor,
                        height: `${scaled.scaledHeight * 0.85}px`,
                        transition: scaled.transitionStyle,
                      }}
                      className="hidden md:flex items-center justify-between w-64 px-2.5 py-1.5 border text-xs text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Search commands...</span>
                      </div>
                      <span
                        style={{
                          borderRadius: `${scaled.scaledInnerRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.hoverBackplateTint,
                          color: tokens.textIconColor,
                        }}
                        className="font-mono text-[10px] border px-1.5 py-0.5"
                      >
                        ⌘K
                      </span>
                    </button>

                    {/* Right: Telemetry Pulse, Notifications, Profile */}
                    <div className="flex items-center gap-2">
                      <div
                        style={{
                          borderRadius: `${scaled.scaledPillRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                        }}
                        className="hidden sm:flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border px-3 py-1 whitespace-nowrap shrink-0"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>All clusters 100%</span>
                      </div>

                      {/* Notification Bell */}
                      <div ref={notificationsRef} className="relative">
                        <button
                          type="button"
                          onClick={() => setIsNotificationsOpen((prev) => !prev)}
                          style={{
                            borderRadius: `${scaled.scaledPillRadius}px`,
                            color: tokens.textIconColor,
                          }}
                          className="p-1.5 hover:bg-black/5 transition-colors relative cursor-pointer"
                          aria-label="View notifications"
                        >
                          <Bell className="w-4 h-4" />
                          {unreadNotifications > 0 && (
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                          )}
                        </button>

                        <AnimatePresence>
                          {isNotificationsOpen && (
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
                                boxShadow: "0 12px 28px -4px rgba(0,0,0,0.12)",
                              }}
                              className="absolute right-0 mt-2 w-72 p-3 z-30 border text-left space-y-2.5"
                            >
                              <div
                                style={{ borderColor: tokens.universalBorderColor, borderBottomWidth: `${tokens.borderWidth}px` }}
                                className="flex items-center justify-between pb-1.5 border-b"
                              >
                                <span style={{ color: tokens.textIconColor }} className="font-semibold text-xs">
                                  Notifications
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setUnreadNotifications(0);
                                    triggerToast("Marked all notifications as read");
                                  }}
                                  className="text-[10px] text-neutral-400 hover:text-neutral-700 font-medium cursor-pointer"
                                >
                                  Mark all read
                                </button>
                              </div>
                              <div className="space-y-1.5 text-xs">
                                <div
                                  style={{
                                    borderRadius: `${scaled.scaledOptionRadius}px`,
                                    borderColor: tokens.universalBorderColor,
                                    borderWidth: `${tokens.borderWidth}px`,
                                    backgroundColor: tokens.hoverBackplateTint,
                                  }}
                                  className="p-2 border transition-colors"
                                >
                                  <div style={{ color: tokens.textIconColor }} className="font-medium">
                                    Deployment v2.4.1 Live
                                  </div>
                                  <div className="text-[11px] text-neutral-500">Production cluster updated cleanly.</div>
                                </div>
                                <div
                                  style={{
                                    borderRadius: `${scaled.scaledOptionRadius}px`,
                                    borderColor: tokens.universalBorderColor,
                                    borderWidth: `${tokens.borderWidth}px`,
                                    backgroundColor: tokens.hoverBackplateTint,
                                  }}
                                  className="p-2 border transition-colors"
                                >
                                  <div className="font-medium text-amber-700">High Memory on ap-south-cache</div>
                                  <div className="text-[11px] text-neutral-500">Utilization hit 89% threshold.</div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Profile Avatar Trigger */}
                      <div ref={profileMenuRef} className="relative">
                        <button
                          type="button"
                          onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                          style={{
                            borderRadius: `${scaled.scaledPillRadius}px`,
                            backgroundColor: tokens.primaryButtonColor,
                            color: scaled.primaryActionTextColor,
                          }}
                          className="w-7 h-7 flex items-center justify-center font-bold text-[11px] cursor-pointer shadow-xs"
                        >
                          SC
                        </button>

                        <AnimatePresence>
                          {isProfileMenuOpen && (
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
                              className="absolute right-0 mt-2 w-48 p-1 z-30 border text-left space-y-0.5"
                            >
                              <div
                                style={{ borderColor: tokens.universalBorderColor, borderBottomWidth: `${tokens.borderWidth}px` }}
                                className="p-2 border-b"
                              >
                                <div style={{ color: tokens.textIconColor }} className="font-semibold text-xs">
                                  Sarah Connor
                                </div>
                                <div className="text-[11px] text-neutral-400 truncate">sarah.connor@acme.inc</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsProfileMenuOpen(false);
                                  triggerToast("Opening Account Settings...");
                                }}
                                style={{ borderRadius: `${scaled.scaledOptionRadius}px`, color: tokens.textIconColor }}
                                className="w-full px-2.5 py-1.5 text-xs hover:bg-black/5 flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <Settings className="w-3.5 h-3.5 text-neutral-400" />
                                <span>Settings</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsProfileMenuOpen(false);
                                  triggerToast("Opening API Keys...");
                                }}
                                style={{ borderRadius: `${scaled.scaledOptionRadius}px`, color: tokens.textIconColor }}
                                className="w-full px-2.5 py-1.5 text-xs hover:bg-black/5 flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <Key className="w-3.5 h-3.5 text-neutral-400" />
                                <span>API Tokens</span>
                              </button>
                              <div
                                style={{ borderColor: tokens.universalBorderColor, borderTopWidth: `${tokens.borderWidth}px` }}
                                className="my-1 border-t"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setIsProfileMenuOpen(false);
                                  triggerToast("Signing out...");
                                }}
                                style={{ borderRadius: `${scaled.scaledOptionRadius}px` }}
                                className="w-full px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition-colors font-medium"
                              >
                                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                                <span>Sign out</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── 3. COLLAPSIBLE APP SIDEBAR ORGANISM ── */}
                <div id="org-navigation-sidebar" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                        Collapsible navigation sidebar
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Collapsible navigation sidebar with categorical route hierarchy and real-time status telemetry.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.universalFillColor,
                        color: tokens.textIconColor,
                        height: `${scaled.scaledHeight * 0.8}px`,
                        fontSize: `${scaled.sublabelFontSize}px`,
                        transition: scaled.transitionStyle,
                      }}
                      className="px-2.5 py-1 border font-medium shadow-2xs cursor-pointer hover:opacity-80"
                    >
                      {isSidebarCollapsed ? "Expand (240px)" : "Collapse (72px)"}
                    </button>
                  </div>

                  {/* Sidebar Simulation Frame */}
                  <div
                    style={{
                      borderRadius: `${scaled.scaledCardRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      backgroundColor: tokens.hoverBackplateTint,
                    }}
                    className="p-4 border flex items-start justify-start"
                  >
                    <motion.div
                      animate={{ width: isSidebarCollapsed ? 72 : 240 }}
                      transition={scaled.motionConfig.spring}
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.universalFillColor,
                      }}
                      className="p-3 border shadow-sm flex flex-col justify-between h-[360px] overflow-hidden select-none"
                    >
                      {/* Top Brand / Header */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2.5 px-1 py-1">
                          <div
                            style={{
                              backgroundColor: tokens.primaryButtonColor,
                              borderRadius: `${scaled.scaledPillRadius}px`,
                              color: scaled.primaryActionTextColor,
                            }}
                            className="w-6 h-6 flex items-center justify-center font-bold text-xs shrink-0"
                          >
                            ZL
                          </div>
                          {!isSidebarCollapsed && (
                            <span style={{ color: tokens.textIconColor }} className="font-semibold text-xs tracking-tight truncate">
                              Platform Engine
                            </span>
                          )}
                        </div>

                        {/* Navigation Routes */}
                        <div className="space-y-1">
                          {[
                            { id: "overview", label: "Overview", icon: Compass },
                            { id: "nodes", label: "Cluster Nodes", icon: Layers, badge: "5" },
                            { id: "deployments", label: "Deployments", icon: Zap },
                            { id: "logs", label: "Audit Logs", icon: Terminal },
                            { id: "security", label: "Security & Keys", icon: Shield },
                            { id: "settings", label: "Settings", icon: Settings },
                          ].map((item) => {
                            const isSelected = activeSidebarRoute === item.id;
                            const IconComponent = item.icon;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setActiveSidebarRoute(item.id)}
                                title={isSidebarCollapsed ? item.label : undefined}
                                style={{
                                  borderRadius: `${scaled.scaledPillRadius}px`,
                                  height: `${Math.round(scaled.scaledHeight * 0.85)}px`,
                                }}
                                className="w-full px-2.5 text-xs font-medium flex items-center justify-between cursor-pointer relative transition-colors"
                              >
                                {isSelected && (
                                  <motion.div
                                    layoutId="activeOrgNavHighlight"
                                    transition={scaled.motionConfig.pillTransition}
                                    style={{
                                      borderRadius: `${scaled.scaledPillRadius}px`,
                                      backgroundColor: tokens.primaryButtonColor === "#FFFFFF" ? "#111111" : tokens.primaryButtonColor,
                                    }}
                                    className="absolute inset-0 shadow-xs"
                                  />
                                )}
                                <div
                                  style={{
                                    color: isSelected
                                      ? (scaled.primaryActionTextColor)
                                      : tokens.textIconColor,
                                  }}
                                  className="flex items-center gap-2.5 relative z-10 truncate"
                                >
                                  <IconComponent className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                                </div>
                                {!isSidebarCollapsed && item.badge && (
                                  <span
                                    style={{
                                      borderRadius: `${scaled.scaledPillRadius}px`,
                                    }}
                                    className={`relative z-10 text-[10px] px-1.5 py-0.2 tabular-nums font-semibold ${
                                      isSelected ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"
                                    }`}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Bottom Telemetry Gauge */}
                      <div
                        style={{ borderColor: tokens.universalBorderColor, borderTopWidth: `${tokens.borderWidth}px` }}
                        className="pt-3 border-t"
                      >
                        {!isSidebarCollapsed ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] text-neutral-500">
                              <span>Memory Quota</span>
                              <span style={{ color: tokens.textIconColor }} className="font-semibold tabular-nums">
                                74%
                              </span>
                            </div>
                            <div
                              style={{
                                borderRadius: `${scaled.scaledRadius}px`,
                                backgroundColor: tokens.hoverBackplateTint,
                              }}
                              className="w-full h-1.5 overflow-hidden"
                            >
                              <div
                                style={{
                                  backgroundColor: tokens.primaryButtonColor,
                                  borderRadius: `${scaled.scaledRadius}px`,
                                }}
                                className="h-full w-[74%]"
                              />
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              borderRadius: `${scaled.scaledRadius}px`,
                              backgroundColor: tokens.hoverBackplateTint,
                            }}
                            className="w-full h-1.5 overflow-hidden"
                          >
                            <div
                              style={{
                                backgroundColor: tokens.primaryButtonColor,
                                borderRadius: `${scaled.scaledRadius}px`,
                              }}
                              className="h-full w-[74%]"
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* ── 4. COMMAND PALETTE MODAL ORGANISM ── */}
                <div id="org-command-palette" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                        Command palette (Cmd + K)
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Universal keyboard-driven command runner modal with fuzzy filtering and categorized actions.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsCmdPaletteOpen(true)}
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        backgroundColor: tokens.primaryButtonColor,
                        color: scaled.primaryActionTextColor,
                        height: `${scaled.scaledHeight}px`,
                        fontSize: `${scaled.ctaFontSize}px`,
                        padding: `0 ${scaled.scaledPaddingX}px`,
                        transition: scaled.transitionStyle,
                      }}
                      className="font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 px-4"
                    >
                      <Command className="w-3.5 h-3.5" />
                      <span>Open Palette (⌘K)</span>
                    </button>
                  </div>

                  <p
                    style={{
                      borderRadius: `${scaled.scaledInnerRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      backgroundColor: tokens.hoverBackplateTint,
                      color: tokens.textIconColor,
                    }}
                    className="text-xs p-2.5 border"
                  >
                    💡 Tip: You can press{" "}
                    <kbd
                      style={{
                        borderRadius: `${scaled.scaledInnerRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: scaled.effectiveInputFill,
                        color: tokens.textIconColor,
                      }}
                      className="px-1.5 py-0.5 border text-xs font-semibold"
                    >
                      ⌘K
                    </kbd>{" "}
                    (or{" "}
                    <kbd
                      style={{
                        borderRadius: `${scaled.scaledInnerRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: scaled.effectiveInputFill,
                        color: tokens.textIconColor,
                      }}
                      className="px-1.5 py-0.5 border text-xs font-semibold"
                    >
                      Ctrl+K
                    </kbd>
                    ) anywhere on this page to trigger the modal.
                  </p>

                  {/* Command Palette Modal */}
                  <AnimatePresence>
                    {isCmdPaletteOpen && (
                      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={scaled.motionConfig.spring}
                          style={{
                            borderRadius: `${scaled.scaledCardRadius}px`,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            backgroundColor: tokens.universalFillColor,
                            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                          }}
                          className="w-full max-w-xl border overflow-hidden shadow-2xl select-none"
                        >
                          {/* Search Header */}
                          <div
                            style={{ borderColor: tokens.universalBorderColor, borderBottomWidth: `${tokens.borderWidth}px` }}
                            className="p-3 border-b flex items-center gap-2.5"
                          >
                            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                            <input
                              autoFocus
                              type="text"
                              placeholder="Type a command or search..."
                              value={cmdPaletteQuery}
                              onChange={(e) => {
                                setCmdPaletteQuery(e.target.value);
                                setCmdPaletteSelectedIdx(0);
                              }}
                              style={{ color: tokens.textIconColor }}
                              className="w-full bg-transparent outline-none text-xs font-medium placeholder:text-neutral-400"
                            />
                            {cmdPaletteQuery && (
                              <button
                                type="button"
                                onClick={() => setCmdPaletteQuery("")}
                                className="text-neutral-400 hover:text-neutral-700"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setIsCmdPaletteOpen(false)}
                              style={{
                                borderRadius: `${scaled.scaledInnerRadius}px`,
                                borderColor: tokens.universalBorderColor,
                                borderWidth: `${tokens.borderWidth}px`,
                                backgroundColor: tokens.hoverBackplateTint,
                                color: tokens.textIconColor,
                              }}
                              className="font-mono text-[10px] px-1.5 py-0.5 border cursor-pointer"
                            >
                              esc
                            </button>
                          </div>

                          {/* Commands List */}
                          <div className="max-h-64 overflow-y-auto p-1.5 space-y-1">
                            {COMMAND_PALETTE_ITEMS.filter((item) =>
                              !cmdPaletteQuery ||
                              item.title.toLowerCase().includes(cmdPaletteQuery.toLowerCase()) ||
                              item.category.toLowerCase().includes(cmdPaletteQuery.toLowerCase())
                            ).map((item, idx) => {
                              const isSelected = cmdPaletteSelectedIdx === idx;
                              const IconComponent = item.icon;
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => {
                                    triggerToast(`Executed: ${item.title}`);
                                    setIsCmdPaletteOpen(false);
                                  }}
                                  onMouseEnter={() => setCmdPaletteSelectedIdx(idx)}
                                  style={{
                                    borderRadius: `${scaled.scaledOptionRadius}px`,
                                    backgroundColor: isSelected
                                      ? (tokens.primaryButtonColor === "#FFFFFF" ? "#111111" : tokens.primaryButtonColor)
                                      : "transparent",
                                    color: isSelected ? "#FFFFFF" : tokens.textIconColor,
                                    height: `${scaled.scaledHeight * 0.85}px`,
                                    transition: scaled.transitionStyle,
                                  }}
                                  className={`w-full px-3 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                                    isSelected
                                      ? "font-semibold shadow-xs"
                                      : "hover:bg-black/5"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <IconComponent className="w-3.5 h-3.5" strokeWidth={1.8} />
                                    <span>{item.title}</span>
                                    <span
                                      style={{
                                        borderRadius: `${scaled.scaledPillRadius}px`,
                                        borderColor: tokens.universalBorderColor,
                                        borderWidth: `${tokens.borderWidth}px`,
                                      }}
                                      className={`text-[10px] px-1.5 py-0.5 border ${
                                        isSelected ? "bg-white/20 text-white/90 border-transparent" : "bg-black/5 text-neutral-500"
                                      }`}
                                    >
                                      {item.category}
                                    </span>
                                  </div>
                                  <span
                                    className={`font-mono text-[10px] ${
                                      isSelected ? "text-white/80" : "text-neutral-400"
                                    }`}
                                  >
                                    {item.shortcut}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Keyboard Navigation Footer */}
                          <div
                            style={{
                              borderColor: tokens.universalBorderColor,
                              borderTopWidth: `${tokens.borderWidth}px`,
                              backgroundColor: tokens.hoverBackplateTint,
                            }}
                            className="p-2 border-t flex items-center justify-between text-[11px] text-neutral-400"
                          >
                            <div className="flex items-center gap-3">
                              <span>
                                <kbd
                                  style={{
                                    borderRadius: `${scaled.scaledInnerRadius}px`,
                                    borderColor: tokens.universalBorderColor,
                                    borderWidth: `${tokens.borderWidth}px`,
                                    backgroundColor: tokens.universalFillColor,
                                    color: tokens.textIconColor,
                                  }}
                                  className="font-mono px-1 py-0.5 border mr-1"
                                >
                                  ↑↓
                                </kbd>
                                navigate
                              </span>
                              <span>
                                <kbd
                                  style={{
                                    borderRadius: `${scaled.scaledInnerRadius}px`,
                                    borderColor: tokens.universalBorderColor,
                                    borderWidth: `${tokens.borderWidth}px`,
                                    backgroundColor: tokens.universalFillColor,
                                    color: tokens.textIconColor,
                                  }}
                                  className="font-mono px-1 py-0.5 border mr-1"
                                >
                                  ↵
                                </kbd>
                                select
                              </span>
                            </div>
                            <span>
                              <kbd
                                style={{
                                  borderRadius: `${scaled.scaledInnerRadius}px`,
                                  borderColor: tokens.universalBorderColor,
                                  borderWidth: `${tokens.borderWidth}px`,
                                  backgroundColor: tokens.universalFillColor,
                                  color: tokens.textIconColor,
                                }}
                                className="font-mono px-1 py-0.5 border mr-1"
                              >
                                esc
                              </kbd>
                              dismiss
                            </span>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── 5. COMPOUND FILTER BUILDER ORGANISM ── */}
                <div id="org-filter-builder" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                        Compound filter &amp; query builder
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Multi-condition parameter query builder with dynamic criteria rows, logic joiners, and saved views.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => triggerToast("Saved active filter view to workspace")}
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        backgroundColor: tokens.primaryButtonColor,
                        color: scaled.primaryActionTextColor,
                        height: `${scaled.scaledHeight}px`,
                        padding: `0 ${scaled.scaledPaddingX}px`,
                        fontSize: `${scaled.ctaFontSize}px`,
                        transition: scaled.transitionStyle,
                      }}
                      className="font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 px-4"
                    >
                      <Filter className="w-3.5 h-3.5" />
                      <span>Save View</span>
                    </button>
                  </div>

                  {/* Filter Rows Stack */}
                  <div className="space-y-2">
                    {filterConditions.map((cond, index) => (
                      <div
                        key={cond.id}
                        style={{
                          borderRadius: `${scaled.scaledRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: scaled.effectiveInputFill,
                          transition: scaled.transitionStyle,
                        }}
                        className="p-2.5 border flex flex-wrap items-center gap-2 text-xs"
                      >
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => setFilterLogic((l) => (l === "AND" ? "OR" : "AND"))}
                            style={{
                              borderRadius: `${scaled.scaledPillRadius}px`,
                              backgroundColor: tokens.hoverBackplateTint,
                              color: tokens.textIconColor,
                            }}
                            className="font-bold text-[10px] px-2 py-1 cursor-pointer select-none hover:opacity-80 transition-opacity"
                          >
                            {filterLogic}
                          </button>
                        )}

                        <span className="text-neutral-400 font-medium">Field:</span>
                        <span
                          style={{
                            borderRadius: `${scaled.scaledPillRadius}px`,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            backgroundColor: tokens.universalFillColor,
                            color: tokens.textIconColor,
                          }}
                          className="font-semibold px-2 py-1 border"
                        >
                          {cond.field}
                        </span>

                        <span className="text-neutral-400 font-medium">Operator:</span>
                        <span
                          style={{
                            borderRadius: `${scaled.scaledPillRadius}px`,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            backgroundColor: tokens.universalFillColor,
                            color: tokens.textIconColor,
                          }}
                          className="font-mono px-2 py-1 border"
                        >
                          {cond.operator}
                        </span>

                        <span className="text-neutral-400 font-medium">Value:</span>
                        <span
                          style={{
                            borderRadius: `${scaled.scaledPillRadius}px`,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            backgroundColor: tokens.universalFillColor,
                            color: tokens.textIconColor,
                          }}
                          className="font-semibold px-2 py-1 border"
                        >
                          &quot;{cond.value}&quot;
                        </span>

                        <div className="ml-auto">
                          <button
                            type="button"
                            onClick={() => setFilterConditions((prev) => prev.filter((c) => c.id !== cond.id))}
                            className="p-1 text-neutral-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove condition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Condition & Quick Presets */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const newId = `cond-${Date.now()}`;
                        setFilterConditions((prev) => [
                          ...prev,
                          { id: newId, field: "latency", operator: "greater_than", value: "50ms" },
                        ]);
                        triggerToast("Added latency filter rule");
                      }}
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.universalFillColor,
                        color: tokens.textIconColor,
                        height: `${scaled.scaledHeight * 0.8}px`,
                        transition: scaled.transitionStyle,
                      }}
                      className="px-2.5 py-1 text-xs font-medium border flex items-center gap-1 cursor-pointer hover:opacity-80 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add filter rule</span>
                    </button>

                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-neutral-400 text-[11px]">Presets:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFilterConditions([
                            { id: "p1", field: "status", operator: "equals", value: "degraded" },
                          ]);
                          triggerToast("Applied preset: Degraded Only");
                        }}
                        style={{
                          borderRadius: `${scaled.scaledPillRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.hoverBackplateTint,
                          color: tokens.textIconColor,
                          transition: scaled.transitionStyle,
                        }}
                        className="px-2 py-0.5 text-[11px] border cursor-pointer font-medium hover:opacity-80"
                      >
                        Degraded Only
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFilterConditions(INITIAL_FILTER_CONDITIONS);
                          triggerToast("Reset to production filters");
                        }}
                        style={{
                          borderRadius: `${scaled.scaledPillRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.hoverBackplateTint,
                          color: tokens.textIconColor,
                          transition: scaled.transitionStyle,
                        }}
                        className="px-2 py-0.5 text-[11px] border cursor-pointer font-medium hover:opacity-80"
                      >
                        Reset Defaults
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── 6. DATE RANGE PICKER ORGANISM ── */}
                <div id="org-date-picker" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                      Date range picker
                    </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Audit telemetry evaluation interval with quick presets matrix, date range inputs, and action footer.
                    </p>
                  </div>

                  <div ref={datePickerRef} className="relative space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="block font-medium">
                      Query period
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
                        className="w-4 h-4 flex items-center justify-center shrink-0 text-neutral-400"
                      >
                        <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.2} />
                      </motion.div>
                    </button>

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
                            padding: "10px",
                          }}
                          className="absolute top-full left-0 right-0 z-30 space-y-2 border"
                        >
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
                                    setIsDatePickerOpen(false);
                                  }}
                                  style={{
                                    borderRadius: `${scaled.scaledPillRadius}px`,
                                    fontSize: `${scaled.sublabelFontSize}px`,
                                    padding: "6px 8px",
                                    transition: scaled.transitionStyle,
                                  }}
                                  className={`font-medium cursor-pointer text-center select-none relative transition-colors ${
                                    isSelected
                                      ? "text-white font-semibold"
                                      : "hover:opacity-80 hover:bg-black/5"
                                  }`}
                                >
                                  {isSelected && (
                                    <motion.div
                                      layoutId="activeDatePresetPill"
                                      transition={scaled.motionConfig.pillTransition}
                                      style={{
                                        borderRadius: `${scaled.scaledPillRadius}px`,
                                        backgroundColor: tokens.primaryButtonColor,
                                      }}
                                      className="absolute inset-0 shadow-xs"
                                    />
                                  )}
                                  <span
                                    style={{
                                      color: isSelected
                                        ? (scaled.primaryActionTextColor)
                                        : tokens.textIconColor,
                                    }}
                                    className="relative z-10"
                                  >
                                    {p.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                

                {/* ── 6. METRIC TELEMETRY CHART CARD ORGANISM ── */}
                <div id="org-metric-card" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                        Metric telemetry chart card
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        API gateway telemetry card with time horizon switcher, metric stats, and interactive SVG line chart.
                      </p>
                    </div>

                    {/* Time Horizon Segmented Switcher */}
                    <div
                      style={{
                        borderRadius: `${scaled.scaledPillRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                      }}
                      className="flex items-center gap-1 p-0.5 border"
                    >
                      {(["24h", "7d", "30d"] as const).map((h) => {
                        const isSelected = chartHorizon === h;
                        return (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setChartHorizon(h)}
                            className="px-3.5 py-1.5 text-xs cursor-pointer relative transition-colors font-medium whitespace-nowrap shrink-0"
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="activeChartHorizonPill"
                                transition={scaled.motionConfig.pillTransition}
                                style={{
                                  borderRadius: `${scaled.scaledPillRadius}px`,
                                  backgroundColor: tokens.primaryButtonColor === "#FFFFFF" ? "#111111" : tokens.primaryButtonColor,
                                }}
                                className="absolute inset-0 shadow-xs"
                              />
                            )}
                            <span
                              style={{
                                color: isSelected
                                  ? (scaled.primaryActionTextColor)
                                  : tokens.textIconColor,
                              }}
                              className="relative z-10"
                            >
                              {h}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Primary KPI Row */}
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <div
                        style={{ fontSize: `${scaled.headingFontSize + 8}px`, color: tokens.textIconColor }}
                        className="font-bold tabular-nums tracking-tight"
                      >
                        2,842,109
                      </div>
                      <div className="text-xs text-neutral-500">Total API Gateway Calls ({chartHorizon})</div>
                    </div>
                    <div
                      style={{
                        borderRadius: `${scaled.scaledPillRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border px-2.5 py-1 tabular-nums"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+18.4%</span>
                    </div>
                  </div>

                  {/* Interactive SVG Sparkline Chart Container */}
                  <div
                    style={{
                      borderRadius: `${scaled.scaledRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      backgroundColor: scaled.effectiveInputFill,
                      transition: scaled.transitionStyle,
                    }}
                    className="p-3 border relative overflow-hidden"
                  >
                    <svg viewBox="0 0 500 120" className="w-full h-28 overflow-visible">
                      <defs>
                        <linearGradient id="orgChartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={tokens.primaryButtonColor === "#FFFFFF" ? "#111111" : tokens.primaryButtonColor} stopOpacity="0.25" />
                          <stop offset="100%" stopColor={tokens.primaryButtonColor === "#FFFFFF" ? "#111111" : tokens.primaryButtonColor} stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Area Fill */}
                      <path
                        d="M 10 100 L 10 80 Q 90 95 170 50 T 330 20 T 490 60 L 490 100 Z"
                        fill="url(#orgChartGrad)"
                      />

                      {/* Line Stroke */}
                      <path
                        d="M 10 80 Q 90 95 170 50 T 330 20 T 490 60"
                        fill="none"
                        stroke={tokens.primaryButtonColor === "#FFFFFF" ? "#111111" : tokens.primaryButtonColor}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Data Point Dots with Hover */}
                      {CHART_SPARKLINE_POINTS.map((pt, i) => {
                        const cx = 10 + i * 80;
                        const cy = 110 - pt.val * 0.45;
                        return (
                          <circle
                            key={pt.time}
                            cx={cx}
                            cy={cy}
                            r={hoveredChartPoint?.time === pt.time ? 5 : 3}
                            className="cursor-pointer transition-all fill-white"
                            stroke={tokens.primaryButtonColor === "#FFFFFF" ? "#111111" : tokens.primaryButtonColor}
                            strokeWidth={hoveredChartPoint?.time === pt.time ? "3" : "2"}
                            onMouseEnter={() => setHoveredChartPoint(pt)}
                            onMouseLeave={() => setHoveredChartPoint(null)}
                          />
                        );
                      })}
                    </svg>

                    {/* Tooltip Overlay */}
                    {hoveredChartPoint && (
                      <div
                        style={{
                          borderRadius: `${scaled.scaledInnerRadius}px`,
                        }}
                        className="absolute top-2 right-3 bg-neutral-900 text-white text-[11px] px-2 py-1 shadow-md font-mono tabular-nums"
                      >
                        {hoveredChartPoint.time} → {hoveredChartPoint.value} req/s
                      </div>
                    )}

                    {/* X-Axis Timestamps */}
                    <div className="flex justify-between text-[10px] text-neutral-400 font-mono pt-1">
                      {CHART_SPARKLINE_POINTS.map((pt) => (
                        <span key={pt.time}>{pt.time}</span>
                      ))}
                    </div>
                  </div>

                  {/* Footnote Telemetry Breakdown */}
                  <div
                    style={{ borderColor: tokens.universalBorderColor, borderTopWidth: `${tokens.borderWidth}px` }}
                    className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t"
                  >
                    <div
                      style={{
                        borderRadius: `${scaled.scaledInnerRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                      }}
                      className="p-1.5 border"
                    >
                      <div className="text-[10px] text-neutral-400 font-medium">p95 Latency</div>
                      <div style={{ color: tokens.textIconColor }} className="font-semibold tabular-nums">42ms</div>
                    </div>
                    <div
                      style={{
                        borderRadius: `${scaled.scaledInnerRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                      }}
                      className="p-1.5 border"
                    >
                      <div className="text-[10px] text-neutral-400 font-medium">p99 Latency</div>
                      <div style={{ color: tokens.textIconColor }} className="font-semibold tabular-nums">118ms</div>
                    </div>
                    <div
                      style={{
                        borderRadius: `${scaled.scaledInnerRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                      }}
                      className="p-1.5 border"
                    >
                      <div className="text-[10px] text-neutral-400 font-medium">Error Rate</div>
                      <div className="font-semibold text-emerald-600 tabular-nums">0.01%</div>
                    </div>
                  </div>
                </div>

                {/* ── 8. SLIDE-OVER DETAIL DRAWER ORGANISM ── */}
                <div id="org-detail-drawer" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                        Slide-over detail drawer
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Node diagnostic inspector sheet sliding from the screen edge with key-value metadata and action footer.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(true)}
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        backgroundColor: tokens.primaryButtonColor,
                        color: scaled.primaryActionTextColor,
                        height: `${scaled.scaledHeight}px`,
                        padding: `0 ${scaled.scaledPaddingX}px`,
                        fontSize: `${scaled.ctaFontSize}px`,
                        transition: scaled.transitionStyle,
                      }}
                      className="font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 px-4"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Open Inspector Drawer</span>
                    </button>
                  </div>

                  {/* Drawer Overlay & Panel */}
                  <AnimatePresence>
                    {isDrawerOpen && (
                      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
                        <motion.div
                          initial={{ x: "100%" }}
                          animate={{ x: 0 }}
                          exit={{ x: "100%" }}
                          transition={scaled.motionConfig.spring}
                          style={{
                            borderColor: tokens.universalBorderColor,
                            borderWidth: 0,
                            borderLeftWidth: `${tokens.borderWidth}px`,
                            backgroundColor: tokens.universalFillColor,
                          }}
                          className="w-full max-w-[400px] h-full border-l shadow-2xl flex flex-col justify-between select-none"
                        >
                          {/* Drawer Header */}
                          <div
                            style={{ borderColor: tokens.universalBorderColor, borderBottomWidth: `${tokens.borderWidth}px` }}
                            className="p-4 border-b flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <Server className="w-4 h-4 text-neutral-400" />
                              <span style={{ color: tokens.textIconColor }} className="font-semibold text-sm">
                                us-east-prod-01
                              </span>
                              <span
                                style={{
                                  borderRadius: `${scaled.scaledPillRadius}px`,
                                  borderColor: tokens.universalBorderColor,
                                  borderWidth: `${tokens.borderWidth}px`,
                                }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-emerald-700 bg-emerald-50 border"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Active
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsDrawerOpen(false)}
                              style={{ borderRadius: `${scaled.scaledInnerRadius}px` }}
                              className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-black/5 transition-colors cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Drawer Content: Key-Value Properties */}
                          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                            <div className="space-y-1">
                              <h4 style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                                Node Attributes &amp; Telemetry
                              </h4>
                              <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                                Real-time metadata bound to the production cluster cluster-01.
                              </p>
                            </div>

                            <div
                              style={{
                                borderRadius: `${scaled.scaledRadius}px`,
                                borderColor: tokens.universalBorderColor,
                                borderWidth: `${tokens.borderWidth}px`,
                                backgroundColor: scaled.effectiveInputFill,
                              }}
                              className="divide-y divide-neutral-100 border text-xs"
                            >
                              {[
                                { label: "Instance ID", value: "i-08f3a9e2c140", isCopyable: true },
                                { label: "Cloud Region", value: "us-east-1a (N. Virginia)" },
                                { label: "Public IPv4", value: "54.210.18.92" },
                                { label: "Assigned Role", value: "API Gateway" },
                                { label: "Memory Allocation", value: "32 GB ECC DDR5" },
                                { label: "CPU Allocation", value: "8 vCPUs (Intel Xeon)" },
                                { label: "Measured Uptime", value: "99.98% (42 days)" },
                                { label: "Security Profile", value: "sg-prod-ingress-tls" },
                              ].map((prop) => (
                                <div key={prop.label} className="p-2.5 flex items-center justify-between gap-2">
                                  <span className="text-neutral-500 font-medium">{prop.label}</span>
                                  <div className="flex items-center gap-1.5">
                                    <span style={{ color: tokens.textIconColor }} className="font-medium tabular-nums">
                                      {prop.value}
                                    </span>
                                    {prop.isCopyable && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          navigator.clipboard.writeText(prop.value);
                                          triggerToast("Instance ID copied");
                                        }}
                                        className="text-neutral-400 hover:text-neutral-700 cursor-pointer p-0.5"
                                        title="Copy value"
                                      >
                                        <Copy className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Drawer Action Footer */}
                          <div
                            style={{
                              borderColor: tokens.universalBorderColor,
                              borderTopWidth: `${tokens.borderWidth}px`,
                              backgroundColor: tokens.universalFillColor,
                            }}
                            className="p-4 border-t flex items-center justify-end gap-2"
                          >
                            <button
                              type="button"
                              onClick={() => setIsDrawerOpen(false)}
                              style={{
                                borderRadius: `${scaled.scaledRadius}px`,
                                borderColor: tokens.universalBorderColor,
                                borderWidth: `${tokens.borderWidth}px`,
                                color: tokens.textIconColor,
                                height: `${scaled.scaledHeight}px`,
                                padding: `0 ${scaled.scaledPaddingX}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                transition: scaled.transitionStyle,
                              }}
                              className="border font-medium cursor-pointer hover:bg-black/5 transition-colors"
                            >
                              Close
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsDrawerOpen(false);
                                triggerToast("Node properties updated");
                              }}
                              style={{
                                borderRadius: `${scaled.scaledRadius}px`,
                                backgroundColor: tokens.primaryButtonColor,
                                color: scaled.primaryActionTextColor,
                                height: `${scaled.scaledHeight}px`,
                                padding: `0 ${scaled.scaledPaddingX}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                transition: scaled.transitionStyle,
                              }}
                              className="font-semibold shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                            >
                              Done
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── 8. CONFIRMATION MODAL ORGANISM ── */}
                <div id="org-confirmation-modal" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                        Destructive confirmation modal
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        High-stakes safety confirmation dialog requiring explicit phrase verification before executing destructive operations.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setConfirmInputText("");
                        setIsConfirmModalOpen(true);
                      }}
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        height: `${scaled.scaledHeight}px`,
                        padding: `0 ${scaled.scaledPaddingX}px`,
                        fontSize: `${scaled.ctaFontSize}px`,
                        transition: scaled.transitionStyle,
                      }}
                      className="bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-semibold shadow-2xs cursor-pointer transition-colors whitespace-nowrap shrink-0 px-4"
                    >
                      Trigger Modal
                    </button>
                  </div>

                  {/* Confirmation Modal Component */}
                  <AnimatePresence>
                    {isConfirmModalOpen && (
                      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={scaled.motionConfig.spring}
                          style={{
                            borderRadius: `${scaled.scaledCardRadius}px`,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            backgroundColor: tokens.universalFillColor,
                          }}
                          className="w-full max-w-md p-6 border shadow-2xl space-y-4 select-none"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              style={{
                                borderRadius: `${scaled.scaledPillRadius}px`,
                              }}
                              className="w-10 h-10 bg-rose-100 flex items-center justify-center text-rose-600 shrink-0"
                            >
                              <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <h3 style={{ color: tokens.textIconColor }} className="font-semibold text-base">
                                Decommission Cluster Node
                              </h3>
                              <p className="text-xs text-neutral-500 leading-relaxed">
                                Are you sure you want to terminate <strong style={{ color: tokens.textIconColor }}>us-east-prod-01</strong>? Running workloads will experience traffic interruption.
                              </p>
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            <label style={{ color: tokens.textIconColor }} className="block text-xs font-medium">
                              Type <span className="font-mono font-bold select-all">us-east-prod-01</span> to confirm:
                            </label>
                            <input
                              autoFocus
                              type="text"
                              value={confirmInputText}
                              onChange={(e) => setConfirmInputText(e.target.value)}
                              placeholder="us-east-prod-01"
                              style={{
                                borderRadius: `${scaled.scaledRadius}px`,
                                borderColor: tokens.universalBorderColor,
                                borderWidth: `${tokens.borderWidth}px`,
                                backgroundColor: scaled.effectiveInputFill,
                                color: tokens.textIconColor,
                                height: `${scaled.scaledHeight}px`,
                                padding: `0 ${scaled.scaledPaddingX}px`,
                                fontSize: `${scaled.scaledFontSize}px`,
                                transition: scaled.transitionStyle,
                              }}
                              className="w-full border font-mono outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                            />
                          </div>

                          <div
                            style={{ borderColor: tokens.universalBorderColor, borderTopWidth: `${tokens.borderWidth}px` }}
                            className="flex items-center justify-end gap-2 pt-2 border-t"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setIsConfirmModalOpen(false);
                                setConfirmInputText("");
                              }}
                              style={{
                                borderRadius: `${scaled.scaledRadius}px`,
                                borderColor: tokens.universalBorderColor,
                                borderWidth: `${tokens.borderWidth}px`,
                                backgroundColor: tokens.universalFillColor,
                                color: tokens.textIconColor,
                                height: `${scaled.scaledHeight}px`,
                                padding: `0 ${scaled.scaledPaddingX}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                transition: scaled.transitionStyle,
                              }}
                              className="border font-medium hover:bg-black/5 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={confirmInputText !== "us-east-prod-01"}
                              onClick={() => {
                                setIsConfirmModalOpen(false);
                                setConfirmInputText("");
                                triggerToast("Successfully decommissioned node us-east-prod-01");
                              }}
                              style={{
                                borderRadius: `${scaled.scaledRadius}px`,
                                height: `${scaled.scaledHeight}px`,
                                padding: `0 ${scaled.scaledPaddingX}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                transition: scaled.transitionStyle,
                              }}
                              className={`font-semibold text-white transition-all ${
                                confirmInputText === "us-east-prod-01"
                                  ? "bg-rose-600 hover:bg-rose-700 cursor-pointer shadow-xs"
                                  : "bg-neutral-300 cursor-not-allowed opacity-60"
                              }`}
                            >
                              Decommission Node
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </main>

        {/* ══════════════════════════════════════════════════════════
            COLUMN 3: RIGHT SIDEBAR (DARK MODE "VISUAL STUDIO" DOCK)
           ══════════════════════════════════════════════════════════ */}
        <aside className="w-72 border-l border-[#27272A] bg-[#121214] text-[#E4E4E7] p-5 hidden xl:flex flex-col justify-between select-none sticky top-0 h-screen overflow-y-auto">
          {renderStudioControls()}
        </aside>

        {/* Floating trigger for viewports < 1280px */}
        <button
          type="button"
          onClick={() => setIsMobileStudioOpen(true)}
          className="xl:hidden fixed bottom-6 right-6 z-40 bg-[#121214] text-white border border-[#27272A] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold hover:bg-neutral-800 transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          <span>Visual Studio</span>
        </button>

        {/* Responsive Drawer for viewports < 1280px */}
        <AnimatePresence>
          {isMobileStudioOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs xl:hidden flex justify-end"
              onClick={() => setIsMobileStudioOpen(false)}
            >
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="w-80 max-w-[90vw] bg-[#121214] text-[#E4E4E7] p-5 h-full overflow-y-auto border-l border-[#27272A] flex flex-col justify-between select-none"
              >
                {renderStudioControls()}
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

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
