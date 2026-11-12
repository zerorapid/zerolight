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
  GraduationCap,
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
  Calendar as CalendarIcon,
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
  Tags,
  FolderTree,
  CalendarDays,
  Sliders,
  MousePointerClick,
  Edit3,
  CheckSquare,
  CircleDot,
  ToggleLeft,
  Tag,
  UploadCloud,
  ListOrdered,
  Loader2,
  Folder,
  File,
  MessageSquare,
  Send,
  CheckCheck,
  CreditCard,
  Bot,
  GripVertical,
} from "lucide-react";
import {
  ZeroLightTokens,
  DEFAULT_TOKENS,
  CornerRadiusPreset,
  HeightDensityPreset,
  MenuOffsetPreset,
  MotionPhysicsPreset,
  IconStrokePreset,
  IconFillPreset,
  ChartPalettePreset,
  ChartGridPreset,
  ChartStrokePreset,
  computeScaledTokens,
} from "./types";
import {
  TOKENS_STORAGE_KEY,
  STUDIO_WIDTH_STORAGE_KEY,
  RegistryIndexItem,
  RegistryItemDetail,
} from "./studio/studio-export";
import { StudioCategory, StudioInspector } from "./studio/studio-inspector";
import { ExportRegistryModal } from "./studio/export-registry-modal";
import { TemplatesShowcase } from "./studio/templates-showcase";
import { PagesShowcase } from "./studio/pages-showcase";
import { ZeroLightProvider } from "./context";
import {
  Skeleton,
  Separator,
  Spinner,
  Avatar,
  TypingIndicator,
  MessageStatus,
  Button,
  IconButton,
  Input,
  Checkbox,
  Switch,
  Slider,
  ProgressBar,
  Badge,
  TagChip,
  Kbd,
  RadioGroup,
} from "./atoms";
import {
  Pagination,
  EmptyState,
  Accordion,
  FileUpload,
  Stepper,
  ChatBubble,
  ChatInput,
  FormField,
  InputGroup,
  SearchBar,
  Select,
  TagInput,
  Calendar,
  SegmentedControl,
  Breadcrumbs,
  StatCard,
  AlertBanner,
  Tooltip,
  Sparkline,
  AreaChart,
  BarChart,
  HorizontalBarChart,
  DonutChart,
  GaugeChart,
  HeatmapMatrix,
  FunnelChart,
  ProfitLossChart,
  DropdownMenu,
  DateRangePicker,
  SplitButton,
  ConjoinedField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Transfer,
  TreeSelect,
  Cascader,
  WorldMap,
} from "./molecules";
import {
  DataTable,
  ConfirmationModal,
  DetailDrawer,
  CommandPalette,
  FilterBuilder,
  AuditLog,
  QuotaMatrix,
  TreeView,
  ChatConversation,
  ToastProvider,
  useToast,
  AppShell,
  GeoBreakdown,
} from "./organisms";
import {
  DashboardTemplate,
  ConsoleTableTemplate,
  SettingsFormTemplate,
  AnalyticsReportTemplate,
  ChatWorkspaceTemplate,
} from "./templates";
import {
  DevConsoleView,
  BillingView,
  AiAssistantView,
  SettingsView,
  FinexyDashboardInner,
  SchoolAttendanceInner,
} from "./views";

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
  { id: "nav-clusters", title: "Cluster Nodes & Pods", category: "Navigation", icon: Layers },
  { id: "nav-security", title: "Security & API Keys", category: "Navigation", icon: Shield },
  { id: "nav-audit", title: "Audit Trail & Logs", category: "Navigation", icon: Terminal },
  { id: "act-create-node", title: "Create New Cluster Node", category: "Quick Actions", icon: Plus },
  { id: "act-rotate-key", title: "Rotate Secret API Key", category: "Quick Actions", icon: Key },
  { id: "act-export-csv", title: "Export Active Audit Logs", category: "Quick Actions", icon: Download },
  { id: "act-invite", title: "Invite Team Member", category: "Quick Actions", icon: User },
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

export function ZeroLightStudio({ initialTier = "atoms" }: { initialTier?: "atoms" | "molecules" | "organisms" | "templates" | "pages" }) {
  const [tokens, setTokens] = useState<ZeroLightTokens>(DEFAULT_TOKENS);
  const [activeTier, setActiveTier] = useState<"atoms" | "molecules" | "organisms" | "templates" | "pages">(initialTier);
  const [activeTemplateTab, setActiveTemplateTab] = useState<"dashboard" | "console" | "settings" | "analytics" | "chat">("dashboard");
  const [activePageTab, setActivePageTab] = useState<"dev-console" | "billing" | "ai-assistant" | "settings" | "finexy" | "school-attendance" | "donations">("dev-console");
  const [isMobileStudioOpen, setIsMobileStudioOpen] = useState<boolean>(false);
  const [studioCategory, setStudioCategory] = useState<StudioCategory>("theme");
  const STUDIO_DEFAULT_WIDTH = 340;
  const STUDIO_MIN_WIDTH = 280;
  const STUDIO_MAX_WIDTH = 560;
  const [studioWidth, setStudioWidth] = useState<number>(STUDIO_DEFAULT_WIDTH);
  const [isResizingStudio, setIsResizingStudio] = useState<boolean>(false);
  const resizeStartRef = useRef<{ startX: number; startWidth: number; maxAllowed: number } | null>(null);
  const hasHydratedStorageRef = useRef<boolean>(false);
  const [sandboxSlideActive, setSandboxSlideActive] = useState<boolean>(false);
  const [sandboxReplayKey, setSandboxReplayKey] = useState<number>(0);

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
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");
  const [isApiKeyCopied, setIsApiKeyCopied] = useState<boolean>(false);

  // Molecule: Segmented Control state
  const [segmentValue, setSegmentValue] = useState<"monthly" | "quarterly" | "annual">("quarterly");

  // Enterprise Suite states (Transfer, TreeSelect, Cascader)
  const [transferTargetKeys, setTransferTargetKeys] = useState<string[]>(["perm-read", "perm-audit"]);
  const [treeSelectValues, setTreeSelectValues] = useState<string[]>(["k8s-us-east", "rds-primary"]);
  const [cascaderPath, setCascaderPath] = useState<string[]>(["us-east", "prod-01", "vpc-alpha"]);

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
  const mainRef = useRef<HTMLElement>(null);

  // 3. EmptyStateCard
  const [emptySearchTerm, setEmptySearchTerm] = useState<string>("quantum-cache-v4");

  // 4. PaginationBar
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState<boolean>(false);
  const pageSizeRef = useRef<HTMLDivElement>(null);

  // New Primitives & Compounds Interactive States
  const [isSkeletonSimulated, setIsSkeletonSimulated] = useState<boolean>(true);
  const [stepperStep, setStepperStep] = useState<number>(1);

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

  // Token Export & Shadcn-style Component Registry modal state
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<"tailwind" | "css" | "json" | "registry">("tailwind");
  const [isExportCopied, setIsExportCopied] = useState<boolean>(false);
  const [registryItems, setRegistryItems] = useState<RegistryIndexItem[]>([]);
  const [registryTier, setRegistryTier] = useState<"all" | "atoms" | "molecules" | "organisms" | "templates" | "views" | "core">("all");
  const [registryQuery, setRegistryQuery] = useState<string>("");
  const [selectedRegistryName, setSelectedRegistryName] = useState<string>("button");
  const [selectedRegistryDetail, setSelectedRegistryDetail] = useState<RegistryItemDetail | null>(null);
  const [isRegistryLoading, setIsRegistryLoading] = useState<boolean>(false);

  // SSR-safe localStorage hydration & persistence for design tokens + studio dock width
  useEffect(() => {
    try {
      const savedTokens = window.localStorage.getItem(TOKENS_STORAGE_KEY);
      if (savedTokens) {
        const parsed = JSON.parse(savedTokens) as Partial<ZeroLightTokens>;
        if (parsed && typeof parsed === "object") {
          setTokens((prev) => ({ ...prev, ...parsed }));
        }
      }
      const savedWidth = window.localStorage.getItem(STUDIO_WIDTH_STORAGE_KEY);
      if (savedWidth) {
        const parsedWidth = Number(savedWidth);
        if (!Number.isNaN(parsedWidth)) {
          setStudioWidth(Math.min(STUDIO_MAX_WIDTH, Math.max(STUDIO_MIN_WIDTH, parsedWidth)));
        }
      }
    } catch {
      // Ignore storage read failures in restricted contexts
    } finally {
      hasHydratedStorageRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasHydratedStorageRef.current) return;
    try {
      window.localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(tokens));
    } catch {
      // Ignore quota/storage write errors
    }
  }, [tokens]);

  useEffect(() => {
    if (!hasHydratedStorageRef.current) return;
    try {
      window.localStorage.setItem(STUDIO_WIDTH_STORAGE_KEY, String(studioWidth));
    } catch {
      // Ignore quota/storage write errors
    }
  }, [studioWidth]);

  // Lazy-load component registry index when viewing Component TSX tab
  useEffect(() => {
    if (!isExportOpen || exportFormat !== "registry" || registryItems.length > 0) return;
    let cancelled = false;
    setIsRegistryLoading(true);
    fetch("/registry/index.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.items) {
          setRegistryItems(data.items);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsRegistryLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isExportOpen, exportFormat, registryItems.length]);

  useEffect(() => {
    if (!isExportOpen || exportFormat !== "registry" || !selectedRegistryName) return;
    let cancelled = false;
    setIsRegistryLoading(true);
    fetch(`/registry/${selectedRegistryName}.json`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          setSelectedRegistryDetail(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsRegistryLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isExportOpen, exportFormat, selectedRegistryName]);


  // Memory leak protection: references for active timers
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleUpdateTokens = useCallback((updates: Partial<ZeroLightTokens>) => {
    setTokens((prev) => ({ ...prev, ...updates }));
  }, []);

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

  // Visual Studio left-side drag-to-resize engine
  useEffect(() => {
    if (!isResizingStudio) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!resizeStartRef.current) return;
      const { startX, startWidth, maxAllowed } = resizeStartRef.current;
      const deltaX = startX - e.clientX;
      const nextWidth = Math.min(maxAllowed, Math.max(STUDIO_MIN_WIDTH, Math.round(startWidth + deltaX)));
      setStudioWidth(nextWidth);
    };

    const stopResizing = () => {
      resizeStartRef.current = null;
      setIsResizingStudio(false);
    };

    const prevCursor = document.body.style.cursor;
    const prevUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResizing);
    window.addEventListener("pointercancel", stopResizing);

    return () => {
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = prevUserSelect;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResizing);
      window.removeEventListener("pointercancel", stopResizing);
    };
  }, [isResizingStudio]);

  const startStudioResize = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, maxCap = STUDIO_MAX_WIDTH) => {
      e.preventDefault();
      e.stopPropagation();
      const viewportCap =
        typeof window !== "undefined"
          ? Math.max(STUDIO_MIN_WIDTH, window.innerWidth >= 1280 ? window.innerWidth - 360 : window.innerWidth - 36)
          : maxCap;
      resizeStartRef.current = {
        startX: e.clientX,
        startWidth: studioWidth,
        maxAllowed: Math.min(maxCap, viewportCap),
      };
      setIsResizingStudio(true);
    },
    [studioWidth]
  );

  const handleStudioResizeKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const maxAllowed =
      typeof window !== "undefined"
        ? Math.min(STUDIO_MAX_WIDTH, Math.max(STUDIO_MIN_WIDTH, window.innerWidth - 360))
        : STUDIO_MAX_WIDTH;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setStudioWidth((w) => Math.min(maxAllowed, w + 16));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setStudioWidth((w) => Math.max(STUDIO_MIN_WIDTH, w - 16));
    } else if (e.key === "Home") {
      e.preventDefault();
      setStudioWidth(maxAllowed);
    } else if (e.key === "End") {
      e.preventDefault();
      setStudioWidth(STUDIO_MIN_WIDTH);
    } else if (e.key === "Enter" || e.key === "0") {
      e.preventDefault();
      setStudioWidth(STUDIO_DEFAULT_WIDTH);
    }
  }, []);

  const renderLeftResizer = (maxCap = STUDIO_MAX_WIDTH) => (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize Visual Studio panel"
      aria-valuemin={STUDIO_MIN_WIDTH}
      aria-valuemax={maxCap}
      aria-valuenow={studioWidth}
      tabIndex={0}
      title="Drag left or right to scale Visual Studio (Double-click to reset)"
      onPointerDown={(e) => startStudioResize(e, maxCap)}
      onDoubleClick={() => setStudioWidth(STUDIO_DEFAULT_WIDTH)}
      onKeyDown={handleStudioResizeKeyDown}
      className="group absolute inset-y-0 -left-2 w-4 z-30 cursor-col-resize touch-none flex items-center justify-center focus:outline-none"
    >
      {/* Active vertical highlight rail */}
      <div
        className={`w-[2px] h-full transition-colors duration-150 ${
          isResizingStudio
            ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.75)]"
            : "bg-transparent group-hover:bg-emerald-400/70 group-focus-visible:bg-emerald-400"
        }`}
      />
      {/* Tactile centered grip pill */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-4 h-10 rounded-full border shadow-lg transition-all duration-150 ${
          isResizingStudio
            ? "bg-emerald-500 border-emerald-300 text-black scale-105 opacity-100"
            : "bg-[#18181B] border-[#3F3F46] text-neutral-400 opacity-80 group-hover:opacity-100 group-hover:border-emerald-400/70 group-hover:text-white group-focus-visible:opacity-100"
        }`}
      >
        <GripVertical className="w-3 h-3" />
      </div>
      {/* Live width HUD while resizing or hovering */}
      <span
        className={`pointer-events-none absolute top-4 right-5 px-2 py-0.5 rounded bg-[#18181B] border border-[#3F3F46] text-[10px] font-semibold tabular-nums text-emerald-300 shadow-lg whitespace-nowrap transition-opacity duration-150 ${
          isResizingStudio ? "opacity-100" : "opacity-0 group-hover:opacity-90"
        }`}
      >
        {studioWidth}px
      </span>
    </div>
  );

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
    setStudioWidth(STUDIO_DEFAULT_WIDTH);
    try {
      window.localStorage.removeItem(TOKENS_STORAGE_KEY);
      window.localStorage.removeItem(STUDIO_WIDTH_STORAGE_KEY);
    } catch {
      // Ignore storage clear errors
    }
    triggerToast("Restored default tokens & dock width");
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


  const studioInspectorProps = {
    tokens,
    scaled,
    setTokens,
    handleUpdateTokens,
    handleResetDefaults,
    studioCategory,
    setStudioCategory,
    sandboxSlideActive,
    setSandboxSlideActive,
    sandboxReplayKey,
    setSandboxReplayKey,
    setIsExportOpen,
    isMobileStudioOpen,
    setIsMobileStudioOpen,
    setIsDrawerOpen,
    triggerToast,
  };
  return (
    <ZeroLightProvider tokens={tokens} updateTokens={handleUpdateTokens}>
      <div dir="ltr" className="h-screen bg-[#F8F9FA] text-[#111111] flex flex-col font-sans selection:bg-neutral-200 overflow-hidden">
      {/* Toast Notification with Framer Motion spring enter/exit */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -Math.max(8, scaled.motionConfig.distance * 2), scale: scaled.motionConfig.popover.initial.scale }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -Math.max(8, scaled.motionConfig.distance * 2), scale: scaled.motionConfig.popover.exit.scale }}
            transition={scaled.motionConfig.transition}
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
      <header
        style={{
          backgroundColor: scaled.isDarkSurface ? "rgba(18, 18, 21, 0.95)" : "rgba(255, 255, 255, 0.95)",
          borderColor: tokens.universalBorderColor,
          transition: "background-color 0.2s ease, border-color 0.2s ease",
        }}
        className="shrink-0 sticky top-0 z-40 backdrop-blur-md border-b px-4 sm:px-6 py-3 flex items-center justify-between gap-3 select-none shadow-2xs overflow-x-auto scrollbar-none"
      >
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
              <span style={{ color: tokens.textIconColor }} className="font-semibold text-sm tracking-tight">
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
          className="inline-flex items-center gap-1.5 p-1 border shadow-xs overflow-x-auto whitespace-nowrap scrollbar-none"
        >
          {(
            [
              { key: "atoms", label: "Atoms", count: "20" },
              { key: "molecules", label: "Molecules", count: "19" },
              { key: "organisms", label: "Organisms", count: "14" },
              { key: "templates", label: "Templates", count: "5" },
              { key: "pages", label: "Pages", count: "6" },
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
                  mainRef.current?.scrollTo({ top: 0, behavior: "instant" });
                }}
                style={{
                  backgroundColor: isSelected ? tokens.primaryButtonColor : "transparent",
                  color: isSelected ? scaled.primaryActionTextColor : tokens.textIconColor,
                  borderRadius: `${scaled.scaledPillRadius}px`,
                  transition: "background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease",
                }}
                className={`px-5 py-2 text-xs font-semibold cursor-pointer relative whitespace-nowrap shrink-0 flex items-center gap-2 ${
                  isSelected ? "shadow-xs" : "hover:text-neutral-900"
                }`}
              >
                <span className="whitespace-nowrap">{label}</span>
                <span
                  style={{
                    borderRadius: `${scaled.scaledPillRadius}px`,
                    backgroundColor: isSelected
                      ? (scaled.primaryActionTextColor === "#FFFFFF" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)")
                      : "#E4E4E7",
                    color: isSelected ? scaled.primaryActionTextColor : "#71717A",
                    transition: "background-color 0.2s ease, color 0.2s ease",
                  }}
                  className="text-[10px] px-1.5 py-0.2 font-bold tabular-nums whitespace-nowrap shrink-0"
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right meta: Scale & Export Tokens */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span
            style={{
              fontSize: `${scaled.sublabelFontSize}px`,
              borderRadius: `${scaled.scaledPillRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
            }}
            className="text-neutral-600 bg-neutral-50 border px-3 py-1 shadow-2xs tabular-nums font-medium hidden xl:inline-block"
          >
            Scale: {tokens.scaleMultiplier.toFixed(2)}x • {tokens.motionPhysics}
          </span>
          <button
            type="button"
            onClick={() => {
              setExportFormat("registry");
              setIsExportOpen(true);
            }}
            style={{
              borderRadius: `${scaled.scaledPillRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
              color: tokens.textIconColor,
              backgroundColor: tokens.universalFillColor,
            }}
            className="px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Component TSX</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setExportFormat((prev) => (prev === "registry" ? "tailwind" : prev));
              setIsExportOpen(true);
            }}
            style={{
              borderRadius: `${scaled.scaledPillRadius}px`,
            }}
            className="px-3.5 py-1.5 text-xs font-semibold bg-[#111111] hover:bg-neutral-800 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Export Tokens</span>
          </button>
        </div>
      </header>

      {/* 2-Column Studio Body (Center Stage + Visual Studio Dock) */}
      <div className="flex-1 flex w-full overflow-hidden">
        {/* ══════════════════════════════════════════════════════════
            CENTER STAGE (EXPANDED DEDICATED SHOWCASE)
           ══════════════════════════════════════════════════════════ */}
        <main
          ref={mainRef}
          dir={scaled.direction}
          style={{
            backgroundColor: scaled.isDarkSurface ? "#09090B" : "#F8F9FA",
            color: tokens.textIconColor,
            transition: "background-color 0.2s ease, color 0.2s ease",
          }}
          className="flex-1 min-w-0 p-6 sm:p-10 flex flex-col items-center justify-start h-full overflow-y-auto"
        >
          <div className={`w-full ${activeTier === "templates" || activeTier === "pages" ? "max-w-7xl" : activeTier === "organisms" ? "max-w-5xl" : "max-w-4xl"} space-y-8 pb-32`}>
            
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

                    {/* Live Copywriting & Overflow Invariants */}
                    <div className="pt-4 border-t border-neutral-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="font-semibold text-neutral-800">
                          Copywriting, Overflow &amp; Anti-Crowding Invariants
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          DESIGN_RULES.md Enforced
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* 1. Truncate + Title */}
                        <div
                          style={{
                            borderRadius: `${scaled.scaledRadius}px`,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            backgroundColor: tokens.hoverBackplateTint,
                          }}
                          className="p-3 border space-y-1"
                        >
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Single-Line Truncation</span>
                          <p
                            title="us-east-1-production-cluster-quantum-cache-ingress-gateway-node-0492"
                            className="font-semibold text-xs truncate"
                            style={{ color: tokens.textIconColor }}
                          >
                            us-east-1-production-cluster-quantum-cache-ingress-gateway-node-0492
                          </p>
                          <span className="text-[10px] text-neutral-500 block">Hover to preview full string</span>
                        </div>

                        {/* 2. 2-Line Clamping */}
                        <div
                          style={{
                            borderRadius: `${scaled.scaledRadius}px`,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            backgroundColor: tokens.hoverBackplateTint,
                          }}
                          className="p-3 border space-y-1"
                        >
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block">2-Line Clamping</span>
                          <p
                            title="Automated cluster health telemetry detects memory utilization exceeding nominal 85% threshold. Rolling restart initiated."
                            className="text-xs text-neutral-600 line-clamp-2 leading-relaxed"
                          >
                            Automated cluster health telemetry detects memory utilization exceeding nominal 85% threshold. Rolling restart initiated across all pods.
                          </p>
                          <span className="text-[10px] text-neutral-500 block">Clamps at line 2 with ellipsis</span>
                        </div>

                        {/* 3. Balanced Headings */}
                        <div
                          style={{
                            borderRadius: `${scaled.scaledRadius}px`,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            backgroundColor: tokens.hoverBackplateTint,
                          }}
                          className="p-3 border space-y-1"
                        >
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Widow Prevention</span>
                          <h5 className="font-semibold text-xs text-neutral-900 [text-wrap:balance] leading-snug">
                            Enterprise Telemetry Multi-Cloud Fleet Monitor
                          </h5>
                          <span className="text-[10px] text-neutral-500 block">text-wrap: balance active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── 1. BUTTON ATOM (UNIVERSAL CORNER RADIUS & BLACK PRIMARY DEFAULT) ── */}
                <div id="atom-buttons" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <MousePointerClick
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Button state matrix</span>
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
                            <Button variant="primary">Action</Button>
                          </td>
                          <td className="py-2.5 text-center">
                            <Button variant="primary" className="brightness-110">Action</Button>
                          </td>
                          <td className="py-2.5 text-center">
                            <Button variant="primary" style={{ boxShadow: `0 0 0 3px ${tokens.primaryButtonColor}40` }}>Action</Button>
                          </td>
                          <td className="py-2.5 text-center">
                            <Button variant="primary" disabled>Action</Button>
                          </td>
                        </tr>

                        {/* 2. Secondary Outline */}
                        <tr>
                          <td style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="py-2.5 text-neutral-600 font-medium whitespace-nowrap pr-3">
                            Secondary
                          </td>
                          <td className="py-2.5 text-center">
                            <Button variant="secondary">Action</Button>
                          </td>
                          <td className="py-2.5 text-center">
                            <Button variant="secondary" className="brightness-95">Action</Button>
                          </td>
                          <td className="py-2.5 text-center">
                            <Button variant="secondary" style={{ boxShadow: `0 0 0 3px ${tokens.textIconColor}25` }}>Action</Button>
                          </td>
                          <td className="py-2.5 text-center">
                            <Button variant="secondary" disabled>Action</Button>
                          </td>
                        </tr>

                        {/* 3. Ghost / Subtle */}
                        <tr>
                          <td style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="py-2.5 text-neutral-600 font-medium whitespace-nowrap pr-3">
                            Ghost
                          </td>
                          <td className="py-2.5 text-center">
                            <Button variant="ghost">Action</Button>
                          </td>
                          <td className="py-2.5 text-center">
                            <Button variant="ghost" style={{ backgroundColor: tokens.hoverBackplateTint }}>Action</Button>
                          </td>
                          <td className="py-2.5 text-center">
                            <Button variant="ghost" style={{ boxShadow: `0 0 0 3px ${tokens.textIconColor}25` }}>Action</Button>
                          </td>
                          <td className="py-2.5 text-center">
                            <Button variant="ghost" disabled>Action</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Buttons with Reactive Icons */}
                  <div className="pt-3 border-t border-neutral-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="font-semibold text-neutral-700">
                        Icon-Augmented Buttons (Bound to Visual Studio Icon Tuning)
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        Scale: {tokens.iconScaleMultiplier}x • Stroke: {tokens.iconStrokeWidth}px
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Button variant="primary" iconLeft={<Plus />}>
                        Create Cluster
                      </Button>
                      <Button variant="secondary" iconRight={<ArrowRight />}>
                        Deploy Workload
                      </Button>
                      <Button variant="outline" iconLeft={<SlidersHorizontal />}>
                        Filter Metrics
                      </Button>
                      <Button variant="destructive" iconLeft={<Trash2 />}>
                        Terminate Node
                      </Button>
                      <Button variant="outline" iconLeft={<X />}>
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>

                {/* ── 2. ICON BUTTON ATOM ── */}
                <div id="atom-icon-button" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-neutral-500 shrink-0" />
                      <span>Icon button primitive</span>
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">
                      Bound to Icon Scale ({tokens.iconScaleMultiplier}x) &amp; Stroke ({tokens.iconStrokeWidth}px)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {/* Solid Primary */}
                    <IconButton variant="solid" size="md" icon={<Plus />} ariaLabel="Add item" />
                    {/* Outline */}
                    <IconButton variant="outline" size="md" icon={<SlidersHorizontal />} ariaLabel="Filter" />
                    {/* Ghost */}
                    <IconButton variant="ghost" size="md" icon={<Settings />} ariaLabel="Settings" />
                    {/* Close / Dismiss */}
                    <IconButton variant="outline" size="md" icon={<X />} ariaLabel="Close or dismiss" />
                    {/* Confirm / Check */}
                    <IconButton variant="solid" size="md" icon={<Check />} ariaLabel="Confirm action" />

                    <div className="h-6 w-px bg-neutral-200 mx-1 hidden sm:block" />

                    {/* Sizing Spectrum */}
                    <div className="flex items-center gap-2">
                      <IconButton variant="outline" size="sm" icon={<Plus />} ariaLabel="Small add" />
                      <span className="text-[11px] text-neutral-400">sm</span>
                      <IconButton variant="outline" size="md" icon={<Plus />} ariaLabel="Medium add" />
                      <span className="text-[11px] text-neutral-400">md</span>
                      <IconButton variant="outline" size="lg" icon={<Plus />} ariaLabel="Large add" />
                      <span className="text-[11px] text-neutral-400">lg</span>
                    </div>
                  </div>
                </div>

                {/* ── 3. INPUT ATOM (4 TRUTH STATES) ── */}
                <div id="atom-input" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <Edit3
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Text input primitive</span>
                      </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">
                      Zero-flicker rasterization
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px`, color: tokens.textIconColor }} className="font-medium block mb-1">
                        Rest state
                      </span>
                      <Input readOnly value="Rest state input primitive" />
                    </div>
                    <div>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px`, color: tokens.textIconColor }} className="font-medium block mb-1">
                        Leading &amp; trailing vector iconography
                      </span>
                      <Input
                        readOnly
                        value="Search cluster logs and telemetry"
                        iconLeft={<Search size={scaled.iconSmSize || 16} strokeWidth={tokens.iconStrokeWidth || 1.75} />}
                        iconRight={<Check size={scaled.iconSmSize || 16} strokeWidth={tokens.iconStrokeWidth || 2} color="#059669" />}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px`, color: tokens.textIconColor }} className="font-medium block mb-1">
                        Error validation state
                      </span>
                      <Input
                        readOnly
                        error
                        value="invalid-corporate-domain@bad"
                        iconRight={<AlertCircle size={scaled.iconSmSize || 16} strokeWidth={tokens.iconStrokeWidth || 1.75} color="#F43F5E" />}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px`, color: tokens.textIconColor }} className="font-medium block mb-1">
                        Disabled state
                      </span>
                      <Input
                        disabled
                        value="Locked provisioning policy"
                        iconLeft={<Key size={scaled.iconSmSize || 16} strokeWidth={tokens.iconStrokeWidth || 1.75} />}
                      />
                    </div>
                  </div>
                </div>

                {/* ── 4. TEXTAREA ATOM ── */}
                <div id="atom-textarea" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
                  <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <FileText
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Textarea primitive</span>
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
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <CheckSquare
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Checkbox (Tri-state)</span>
                      </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">
                      Adaptive geometry &amp; primary color
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <Checkbox
                      checked={checkboxValue}
                      onChange={setCheckboxValue}
                      label="Active check"
                      description="Syncs live with dock primary action color"
                    />
                    <Checkbox
                      indeterminate={triCheckboxState === "indeterminate"}
                      checked={triCheckboxState === "checked"}
                      onChange={(c) => setTriCheckboxState(c ? "checked" : "unchecked")}
                      label="Indeterminate check"
                      description="Enterprise bulk selection state"
                    />
                    <Checkbox
                      disabled
                      checked
                      label="Disabled check"
                      description="Read-only compliance lock"
                    />
                  </div>
                </div>

                {/* ── 6. RADIO ATOM (UNIVERSAL PRIMARY BINDING) ── */}
                <div id="atom-radio" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <CircleDot
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Radio button group</span>
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
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <ToggleLeft
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Toggle switch</span>
                      </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">
                      Adaptive geometry &amp; primary action fill
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <Switch
                      checked={switchValue}
                      onChange={setSwitchValue}
                      label="Adaptive geometry switch"
                      description="Tokens: cornerRadius, heightDensity, and primary action"
                    />
                    <Switch
                      checked={false}
                      onChange={() => {}}
                      disabled
                      label="Disabled switch"
                      description="Provisioning in progress"
                    />
                  </div>
                </div>

                {/* ── 8. SLIDER ATOM ── */}
                <div id="atom-slider" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <SlidersHorizontal
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Range slider primitive</span>
                      </h2>
                    <span
                      style={{
                        fontSize: `${scaled.sublabelFontSize}px`,
                        borderRadius: `${scaled.scaledInnerRadius}px`,
                        color: tokens.textIconColor,
                      }}
                      className="font-semibold bg-neutral-100 px-1.5 py-0.5 tabular-nums"
                    >
                      {sliderValue}%
                    </span>
                  </div>
                  <Slider
                    value={sliderValue}
                    onChange={setSliderValue}
                    label="Bandwidth throttle threshold"
                  />
                </div>

                {/* ── 9. PROGRESS BAR ATOM ── */}
                <div id="atom-progress" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-neutral-100">
                    <div>
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold tracking-tight flex items-center gap-2">
                        <BarChart2
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Progress bar primitive</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Deterministic visual progress gauge with rounded caps and dynamic fill token.
                      </p>
                    </div>
                  </div>

                  <ProgressBar
                    value={sliderValue}
                    label="Database partition migration batch"
                    showValue
                  />
                </div>

                {/* ── 10. LUCIDE ICON ATOM ── */}
                <div id="atom-lucide-icons" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>Lucide vector icon catalog</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Indivisible vector primitives dynamically calibrated by Visual Studio scaling, stroke, fill, and color tokens.
                      </p>
                    </div>

                    {/* Live Icon Token Readout */}
                    <div
                      style={{
                        borderRadius: `${scaled.scaledPillRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1 border text-xs shadow-2xs self-start sm:self-auto shrink-0"
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tokens.iconColor }} />
                      <span className="font-sans text-[11px] text-neutral-700 font-medium">
                        {tokens.iconScaleMultiplier.toFixed(2)}x ({scaled.iconSize}px) • {tokens.iconStrokeWidth}px stroke • {tokens.iconFill}
                      </span>
                    </div>
                  </div>

                  {/* Curated SaaS Lucide glyph grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 pt-2">
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
                        className="flex flex-col items-center justify-center p-3 border hover:border-neutral-400 transition-all cursor-pointer group"
                        title={`${label} (${scaled.iconSize}px)`}
                      >
                        <div
                          style={{
                            width: `${Math.max(28, scaled.iconSize + 8)}px`,
                            height: `${Math.max(28, scaled.iconSize + 8)}px`,
                          }}
                          className="flex items-center justify-center"
                        >
                          <IconComponent
                            className="transition-transform group-hover:scale-110"
                            style={{
                              width: `${scaled.iconSize}px`,
                              height: `${scaled.iconSize}px`,
                              color: tokens.iconColor,
                              fill: scaled.iconFill,
                            }}
                            strokeWidth={tokens.iconStrokeWidth}
                          />
                        </div>
                        <span className="text-[10px] text-neutral-500 mt-1.5 truncate max-w-full font-medium">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── 11. STATUS BADGES ATOM ── */}
                <div id="atom-badge" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
                  <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <Tag
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Status badge chips</span>
                      </h2>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Badge variant="healthy" pulse>Active</Badge>
                    <Badge variant="degraded">Pending</Badge>
                    <Badge variant="critical">Failed</Badge>
                    <Badge variant="neutral">Draft</Badge>
                    <Badge variant="syncing">Syncing</Badge>
                  </div>
                </div>

                {/* ── 12. TAG CHIP ATOM (UNIVERSAL RADIUS) ── */}
                <div id="atom-tag-chip" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <Tags
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Tag chip component</span>
                      </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">
                      Static &amp; dismissible states
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <TagChip label="Design System" onRemove={() => triggerToast("Removed Design System tag")} />
                    <TagChip label="Frontend Architecture" onRemove={() => triggerToast("Removed Frontend tag")} />
                    <TagChip label="Enterprise SaaS" />
                  </div>
                </div>

                {/* ── 13. KEYBOARD KEYCAP (KBD) ATOM ── */}
                <div id="atom-kbd" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-4">
                  <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <Command
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Keycap primitive</span>
                      </h2>

                  <div className="flex items-center gap-2 pt-1">
                    <Kbd>Shift</Kbd>
                    <Kbd>Tab</Kbd>
                    <Kbd>Space</Kbd>
                    <Kbd>Option</Kbd>
                  </div>
                </div>

                {/* ── 13. AVATAR & SIZES ATOM ── */}
                <div id="atom-avatar" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>User avatar & size scale</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Profile avatars across enterprise sizes (24px–64px) with Unsplash portraits, initials fallback, and status halos.
                      </p>
                    </div>

                    <div
                      style={{
                        borderRadius: `${scaled.scaledPillRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                      }}
                      className="px-3 py-1 text-xs font-sans text-neutral-600 border shadow-2xs self-start sm:self-auto shrink-0"
                    >
                      5 Sizes • xs to xl
                    </div>
                  </div>

                  {/* Section A: Photo Avatars across all 5 sizes */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      Profile Avatars with Presence Indicators
                    </span>
                    <div className="flex flex-wrap items-end gap-6 p-4 rounded-xl border border-neutral-100 bg-neutral-50/60">
                      <div className="flex flex-col items-center gap-2">
                        <Avatar
                          size="xs"
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80"
                          alt="Alex Rivera"
                          status="online"
                        />
                        <span className="text-[10px] text-neutral-500 font-medium">24px (xs)</span>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <Avatar
                          size="sm"
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80"
                          alt="Elena Rostova"
                          status="idle"
                        />
                        <span className="text-[10px] text-neutral-500 font-medium">32px (sm)</span>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <Avatar
                          size="md"
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"
                          alt="Sarah Chen"
                          status="online"
                        />
                        <span className="text-[10px] text-neutral-500 font-semibold text-neutral-800">40px (md - default)</span>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <Avatar
                          size="lg"
                          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80"
                          alt="Marcus Vance"
                          status="busy"
                        />
                        <span className="text-[10px] text-neutral-500 font-medium">48px (lg)</span>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <Avatar
                          size="xl"
                          src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80"
                          alt="Maya Patel"
                          status="offline"
                        />
                        <span className="text-[10px] text-neutral-500 font-medium">64px (xl)</span>
                      </div>
                    </div>
                  </div>

                  {/* Section B: Initials Fallback Avatars across all 5 sizes */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      Initials Fallback Avatars (Token Color Reactive)
                    </span>
                    <div className="flex flex-wrap items-end gap-6 p-4 rounded-xl border border-neutral-100 bg-neutral-50/60">
                      <div className="flex flex-col items-center gap-2">
                        <Avatar size="xs" initials="AR" status="online" />
                        <span className="text-[10px] text-neutral-500 font-medium">24px</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Avatar size="sm" initials="ER" status="idle" />
                        <span className="text-[10px] text-neutral-500 font-medium">32px</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Avatar size="md" initials="SC" status="online" />
                        <span className="text-[10px] text-neutral-500 font-medium">40px</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Avatar size="lg" initials="MV" status="busy" />
                        <span className="text-[10px] text-neutral-500 font-medium">48px</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Avatar size="xl" initials="MP" status="offline" />
                        <span className="text-[10px] text-neutral-500 font-medium">64px</span>
                      </div>
                    </div>
                  </div>

                  {/* Section C: Team Avatar Stack & Profile Details */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-neutral-100">
                    <div className="flex items-center gap-3">
                      {/* Avatar Overlap Stack */}
                      <div className="flex -space-x-2.5 overflow-hidden p-0.5">
                        <Avatar
                          size="sm"
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"
                          alt="Sarah Chen"
                          className="ring-2 ring-white"
                        />
                        <Avatar
                          size="sm"
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80"
                          alt="Alex Rivera"
                          className="ring-2 ring-white"
                        />
                        <Avatar
                          size="sm"
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80"
                          alt="Elena Rostova"
                          className="ring-2 ring-white"
                        />
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: `${scaled.scaledPillRadius}px`,
                            backgroundColor: tokens.hoverBackplateTint,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                          }}
                          className="flex items-center justify-center text-[10px] font-bold text-neutral-600 ring-2 ring-white"
                        >
                          +4
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-neutral-800 block">Platform SRE Team</span>
                        <span className="text-[11px] text-neutral-500">7 members active on cluster</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Synchronized with IAM Directory
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── 15. SEPARATOR & HAIRLINE DIVIDER ── */}
                <div id="atom-separator" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <Minus className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>Hairline separator & labeled divider</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        Precision boundary primitive with horizontal hairline, labeled category chip, and vertical toolbar divider variations.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-1">
                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">Horizontal Hairline</span>
                      <Separator orientation="horizontal" />
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">Labeled Category Divider</span>
                      <Separator orientation="horizontal" label="Kubernetes Pod Fleet" />
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">Vertical Toolbar Dividers</span>
                      <div
                        style={{
                          borderRadius: `${scaled.scaledRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.hoverBackplateTint,
                        }}
                        className="flex items-center gap-4 px-4 py-2 border shadow-2xs w-fit"
                      >
                        <span style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="font-medium">
                          Cluster: us-east-prod-01
                        </span>
                        <Separator orientation="vertical" className="h-5" />
                        <span style={{ fontSize: `${scaled.labelFontSize}px` }} className="text-neutral-500">
                          12 Active Pods
                        </span>
                        <Separator orientation="vertical" className="h-5" />
                        <span style={{ fontSize: `${scaled.labelFontSize}px` }} className="text-emerald-600 font-semibold">
                          99.98% SLA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── 16. SKELETON LOADING PLACEHOLDER ── */}
                <div id="atom-skeleton" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <Layers className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>Shimmer skeleton placeholder</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        Low-contrast animated pulse shimmer placeholders preventing layout shift during asynchronous data hydration.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsSkeletonSimulated(!isSkeletonSimulated)}
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        minHeight: `${scaled.scaledHeight}px`,
                        padding: `0 ${scaled.scaledPaddingX}px`,
                        fontSize: `${scaled.ctaFontSize}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                        color: tokens.textIconColor,
                      }}
                      className="border font-medium inline-flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto py-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{isSkeletonSimulated ? "View Hydrated Data" : "Simulate Loading Skeleton"}</span>
                    </button>
                  </div>

                  <div className="pt-2">
                    {isSkeletonSimulated ? (
                      <div
                        style={{
                          borderRadius: `${scaled.scaledRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                        }}
                        className="p-5 border space-y-4 bg-white/50"
                      >
                        <div className="flex items-center gap-3">
                          <Skeleton variant="circle" width={38} height={38} />
                          <div className="space-y-1.5 flex-1">
                            <Skeleton variant="text" width="45%" height={14} />
                            <Skeleton variant="text" width="25%" height={11} />
                          </div>
                        </div>
                        <Skeleton variant="rect" width="100%" height={56} />
                        <div className="flex items-center justify-between pt-1">
                          <Skeleton variant="text" width="30%" height={12} />
                          <Skeleton variant="rect" width={90} height={28} />
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          borderRadius: `${scaled.scaledRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.hoverBackplateTint,
                        }}
                        className="p-5 border space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            style={{
                              borderRadius: `${scaled.scaledPillRadius}px`,
                              backgroundColor: tokens.primaryButtonColor,
                            }}
                            className="w-9 h-9 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-2xs"
                          >
                            K8
                          </div>
                          <div>
                            <h4 style={{ color: tokens.textIconColor }} className="font-semibold text-sm">
                              k8s-ap-south-worker-fleet
                            </h4>
                            <p className="text-xs text-neutral-500">Zone: ap-south-1a • 4 Nodes Active</p>
                          </div>
                        </div>
                        <p style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="leading-relaxed">
                          Fleet is healthy with 99.98% ingress uptime. Automated health-check probes passing with 14ms round-trip latency.
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Cluster In Sync
                          </span>
                          <span className="text-xs text-neutral-500 tabular-nums">Synced 2m ago</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── 17. ACTIVITY SPINNER ── */}
                <div id="atom-spinner" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-neutral-500 shrink-0 animate-spin" />
                        <span>Circular activity spinner</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        Pure rotary SVG activity spinner automatically synchronized to the active brand primary token color.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-8 pt-2">
                    <div className="flex items-center gap-3">
                      <Spinner size="xs" />
                      <span className="text-xs text-neutral-500">14px (xs)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Spinner size="sm" />
                      <span className="text-xs text-neutral-500">18px (sm)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Spinner size="md" />
                      <span className="text-xs text-neutral-500 font-medium">24px (md - default)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Spinner size="lg" />
                      <span className="text-xs text-neutral-500">32px (lg)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Spinner size="sm" color="#10B981" />
                      <span className="text-xs text-emerald-600 font-medium">Custom Tint</span>
                    </div>
                  </div>
                </div>

                {/* ── 19. TYPING INDICATOR ATOM ── */}
                <div id="atom-typing-indicator" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>Typing indicator</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        Animated spring dot telemetry communicating real-time conversational presence and active peer typing states.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <TypingIndicator size="sm" />
                    <TypingIndicator size="md" />
                    <TypingIndicator size="md" label="Sarah is typing..." />
                    <TypingIndicator size="md" label="AI Assistant generating response..." />
                  </div>
                </div>

                {/* ── 20. MESSAGE DELIVERY STATUS ATOM ── */}
                <div id="atom-message-status" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <CheckCheck className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>Message delivery status receipts</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        Granular message receipt indicators for dispatched, delivered, read, and active transmission states.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                    <div className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/60">
                      <MessageStatus status="sending" size={14} />
                      <span className="text-xs font-semibold text-neutral-600">Sending</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/60">
                      <MessageStatus status="sent" size={14} />
                      <span className="text-xs font-semibold text-neutral-600">Sent</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/60">
                      <MessageStatus status="delivered" size={14} />
                      <span className="text-xs font-semibold text-neutral-600">Delivered</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/60">
                      <MessageStatus status="read" size={14} />
                      <span className="text-xs font-semibold text-neutral-900">Read</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/60">
                      <MessageStatus status="failed" size={14} />
                      <span className="text-xs font-semibold text-rose-600">Failed</span>
                    </div>
                  </div>
                </div>

                {/* ── 18. RADIO GROUP ATOM ── */}
                <div id="atom-radio-group" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="space-y-1">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                      <CircleDot size={scaled.iconSmSize || 16} strokeWidth={tokens.iconStrokeWidth || 1.75} color={tokens.iconColor || tokens.textIconColor} />
                      <span>Radio group atom</span>
                    </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                      Mutually exclusive options with standard inline or interactive card selection modes.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Card Selection Mode</div>
                      <RadioGroup
                        value={selectedPlan}
                        onChange={setSelectedPlan}
                        cardMode
                        options={[
                          { value: "starter", label: "Starter Plan", description: "Up to 5 team seats with standard telemetry", badge: "$29/mo" },
                          { value: "pro", label: "Professional Plan", description: "Unlimited seats, dedicated compute and priority audit log", badge: "Recommended" },
                          { value: "enterprise", label: "Enterprise Custom", description: "Self-hosted VPC with bespoke SLA guarantees", badge: "Contact" },
                        ]}
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Standard Inline Mode</div>
                      <RadioGroup
                        value={selectedPlan}
                        onChange={setSelectedPlan}
                        options={[
                          { value: "starter", label: "Monthly billing cycle" },
                          { value: "pro", label: "Annual billing cycle (Save 20%)" },
                          { value: "enterprise", label: "Multi-year reserved instance" },
                        ]}
                      />
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
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <Mail
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Form field</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        Single Sign-On (SSO) email address with corporate domain verification and inline feedback.
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      iconLeft={isEmailError ? <Check className="text-emerald-600" /> : <AlertCircle className="text-rose-500" />}
                      onClick={() => setIsEmailError((prev) => !prev)}
                    >
                      {isEmailError ? "Clear error" : "Simulate error"}
                    </Button>
                  </div>

                  <FormField
                    id="sso-email"
                    label="Corporate Email Address"
                    value={textInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTextInput(val);
                      if (val.length > 0 && val.includes("@") && val.includes(".")) {
                        setIsEmailError(false);
                      }
                    }}
                    placeholder="name@enterprise.com"
                    iconLeft={<Mail size={scaled.iconSmSize || 16} strokeWidth={tokens.iconStrokeWidth || 1.75} />}
                    helperText="Monthly invoice and telemetry notifications will route to this inbox."
                    error={isEmailError}
                    errorMessage={isEmailError ? "Please enter a valid corporate email domain (e.g. name@enterprise.com)" : undefined}
                  />
                </div>

                {/* ── 2. INPUT GROUP ── */}
                <div id="mol-input-group" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <Key
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Input group (SSO Token &amp; API Key)</span>
                      </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Client credentials input conjoined with secret masking eye toggle and single-tap copy.
                    </p>
                  </div>

                  <InputGroup
                    id="api-key-group"
                    label="Secret API key"
                    value={apiKey}
                    prefix="Live Key"
                    masked={isApiKeyMasked}
                    onCopy={() => triggerToast("API Key copied to clipboard")}
                  />
                </div>

                {/* ── 3. SEARCH BAR ── */}
                <div id="mol-search-bar" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                      <Search
                        size={scaled.iconSmSize || 16}
                        strokeWidth={tokens.iconStrokeWidth || 1.75}
                        color={tokens.iconColor || tokens.textIconColor}
                        className="shrink-0"
                      />
                      <span>Search bar</span>
                    </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Search input with leading search icon and dynamic clear action trigger.
                    </p>
                  </div>

                  <SearchBar
                    value={searchBarQuery}
                    onChange={setSearchBarQuery}
                    onClear={() => setSearchBarQuery("")}
                    placeholder="Search records, users, tags..."
                  />
                </div>

                {/* ── 4. SELECT DROPDOWN ── */}
                <div id="mol-select" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <SlidersHorizontal
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Select dropdown (Cluster Region)</span>
                      </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Role and tenancy selector popover with keyboard navigation and checkmark indicators.
                    </p>
                  </div>

                  <Select
                    label="Team role selector"
                    value={role}
                    onChange={setRole}
                    options={ROLE_OPTIONS.map((r) => ({ value: r, label: r, badge: r === "Administrator" ? "Root" : undefined }))}
                  />
                </div>

                {/* ── 5. TAG INPUT ── */}
                <div id="mol-tag-input" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <Tags
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Tag input (VPC Security Groups)</span>
                      </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Multi-tag deployment classifier with animated remove transitions and popover tag selector.
                    </p>
                  </div>

                  <TagInput
                    tags={tags}
                    onChange={setTags}
                    label="VPC Security Group tags"
                  />
                </div>

                {/* ── 6. CALENDAR DROPDOWN ── */}
                <div id="mol-calendar" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>Calendar date picker</span>
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
                        <CalendarIcon className="w-4 h-4 text-neutral-400 shrink-0" strokeWidth={1.8} />
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
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                      <Clock
                        size={scaled.iconSmSize || 16}
                        strokeWidth={tokens.iconStrokeWidth || 1.75}
                        color={tokens.iconColor || tokens.textIconColor}
                        className="shrink-0"
                      />
                      <span>Segmented time range control</span>
                    </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Sliding billing cadence switcher with fluid spring pill transitions.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="block font-medium">
                      Billing cadence
                    </label>
                    <SegmentedControl
                      value={segmentValue}
                      onChange={setSegmentValue}
                      options={[
                        { key: "monthly", label: "Monthly" },
                        { key: "quarterly", label: "Quarterly" },
                        { key: "annual", label: "Annual (Save 20%)" },
                      ]}
                    />
                  </div>
                </div>

                {/* ── 8. BREADCRUMBS ── */}
                <div id="mol-breadcrumbs" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <FolderTree
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Breadcrumbs navigation</span>
                      </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Hierarchical wayfinding trail with chevron separators and collapsed overflow.
                    </p>
                  </div>

                  <Breadcrumbs
                    items={[
                      { label: "Infrastructure", href: "#" },
                      { label: "US-East Clusters", href: "#" },
                      { label: "Production Cluster A", href: "#" },
                      { label: "Node-4" },
                    ]}
                  />
                </div>

                {/* ── 9. METRIC STAT ── */}
                <div id="mol-stat-badge" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <TrendingUp
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Metric stat card</span>
                      </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Telemetry display pairing a metric label, primary value, and trend badge.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <StatCard
                      label="Net Revenue Run Rate"
                      value="$148,200"
                      delta="+18.4%"
                      trend="up"
                      comparisonText="vs. previous 30d"
                    />
                    <StatCard
                      label="Server Fleet CPU"
                      value="28.4%"
                      delta="-3.2%"
                      trend="down"
                      comparisonText="vs. peak threshold"
                    />
                  </div>
                </div>

                {/* ── 10. ALERT BANNER ── */}
                <div id="mol-alert" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <AlertCircle
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Alert banner</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        High-priority cluster notifications banner with semantic color tokens and dismiss action.
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(["info", "warning", "success", "critical"] as const).map((v) => (
                        <Button
                          key={v}
                          variant={alertVariant === v ? "primary" : "outline"}
                          size="sm"
                          onClick={() => {
                            setAlertVariant(v);
                            setIsAlertDismissed(false);
                          }}
                        >
                          {v}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {!isAlertDismissed ? (
                    <AlertBanner
                      severity={alertVariant}
                      title={
                        alertVariant === "critical"
                          ? "Payment Gateway Authorization Failed"
                          : alertVariant === "warning"
                          ? "API Rate Quota Nearing Threshold (88%)"
                          : alertVariant === "success"
                          ? "Database Migration Successfully Applied"
                          : "Scheduled System Maintenance Window"
                      }
                      description={
                        alertVariant === "critical"
                          ? "Your monthly cluster subscription could not be charged."
                          : alertVariant === "warning"
                          ? "Your workspace has consumed 88,400 of 100,000 monthly API calls."
                          : alertVariant === "success"
                          ? "Schema batch #2026-v8 deployed to all 4 clusters with zero downtime."
                          : "Cluster telemetry upgrades are scheduled for Sunday 02:00 UTC."
                      }
                      onDismiss={() => setIsAlertDismissed(true)}
                    />
                  ) : (
                    <div className="text-center py-2">
                      <Button variant="outline" size="sm" onClick={() => setIsAlertDismissed(false)}>
                        Show dismissed alert again
                      </Button>
                    </div>
                  )}
                </div>

                {/* ── 11. TOOLTIP POPOVER ── */}
                <div id="mol-tooltip" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                      <Info
                        size={scaled.iconSmSize || 16}
                        strokeWidth={tokens.iconStrokeWidth || 1.75}
                        color={tokens.iconColor || tokens.textIconColor}
                        className="shrink-0"
                      />
                      <span>Tooltip popover</span>
                    </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Contextual micro-popover providing supplementary assistance on hover.
                    </p>
                  </div>

                  <div className="pt-2">
                    <Tooltip content="Calculated 99th percentile write-to-read sync latency across database replica clusters.">
                      <Button variant="outline" iconLeft={<Info />}>
                        Hover for metric formula
                      </Button>
                    </Tooltip>
                  </div>
                </div>

                {/* ── 12. FILE UPLOAD DROPZONE ── */}
                <div id="mol-file-upload" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <UploadCloud className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>File upload dropzone</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        Drag-and-drop file ingestion zone with MIME-type filtering, file size validation, and simulated upload progress bars.
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <FileUpload
                      label="Upload Kubernetes manifest or certificate"
                      acceptText="Supports .yaml, .json, .pem, or .crt files"
                      maxSizeText="Max payload size: 25 MB"
                      onRemoveFile={() => triggerToast("Removed configuration file")}
                    />
                  </div>
                </div>

                {/* ── 13. WORKFLOW STEPPER ── */}
                <div id="mol-stepper" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <ListOrdered className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>Workflow stepper</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        Sequential multi-phase pipeline tracker with completed checkmarks, current active step halo, and future phase locks.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        type="button"
                        disabled={stepperStep <= 0}
                        onClick={() => setStepperStep((s) => Math.max(0, s - 1))}
                        style={{
                          borderRadius: `${scaled.scaledRadius}px`,
                          height: `${scaled.scaledHeight}px`,
                          padding: `0 ${scaled.scaledPaddingX}px`,
                          fontSize: `${scaled.ctaFontSize}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.hoverBackplateTint,
                          color: tokens.textIconColor,
                        }}
                        className={`border font-medium inline-flex items-center justify-center gap-1.5 shadow-2xs whitespace-nowrap shrink-0 ${
                          stepperStep <= 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-black/5"
                        }`}
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Previous</span>
                      </button>
                      <button
                        type="button"
                        disabled={stepperStep >= 3}
                        onClick={() => setStepperStep((s) => Math.min(3, s + 1))}
                        style={{
                          borderRadius: `${scaled.scaledRadius}px`,
                          height: `${scaled.scaledHeight}px`,
                          padding: `0 ${scaled.scaledPaddingX}px`,
                          fontSize: `${scaled.ctaFontSize}px`,
                          backgroundColor: tokens.primaryButtonColor,
                          color: scaled.primaryActionTextColor,
                        }}
                        className={`font-semibold inline-flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap shrink-0 ${
                          stepperStep >= 3 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90"
                        }`}
                      >
                        <span>Next Step</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-neutral-200 rounded-xl bg-white/50 pt-6 pb-6">
                    <Stepper
                      currentStepIndex={stepperStep}
                      onStepClick={setStepperStep}
                      steps={[
                        { id: "step-1", title: "Cluster Specs", description: "VPC & region" },
                        { id: "step-2", title: "Security & RBAC", description: "Mutual TLS & tokens" },
                        { id: "step-3", title: "Quota Allocation", description: "vCPU & memory" },
                        { id: "step-4", title: "Production Rollout", description: "Helm release" },
                      ]}
                    />
                  </div>
                </div>

                {/* ── 14. TABLE PAGINATION ── */}
                <div id="mol-pagination" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>Table pagination</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        Data table navigation control with total item telemetry, page size switcher, and boundary disabled guards.
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      borderRadius: `${scaled.scaledRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                    }}
                    className="p-4 border bg-neutral-50/60"
                  >
                    <Pagination
                      currentPage={currentPage}
                      totalItems={248}
                      pageSize={pageSize}
                      onPageChange={setCurrentPage}
                      onPageSizeChange={setPageSize}
                      itemNoun="nodes"
                    />
                  </div>
                </div>

                {/* ── 15. EMPTY STATE CALLOUT ── */}
                <div id="mol-empty-state" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <Inbox className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>Empty state callout</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        Zero-data informational container with contextual Lucide vector illustration, helpful guidance, and single-click recovery action.
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <EmptyState
                      title="No container pods scheduled in this region"
                      description="There are currently no Kubernetes pods running in the ap-south-1 availability zone. Deploy a new deployment manifest or adjust your fleet topology."
                      actionText="Deploy Pod Workload"
                      onAction={() => triggerToast("Workload manifest deploy triggered")}
                    />
                  </div>
                </div>

                {/* ── 16. ACCORDION DISCLOSURE ── */}
                <div id="mol-accordion" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>Accordion disclosure</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        Expandable stacked disclosure panels with smooth framer-motion spring height interpolation and chevron indicator rotation.
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <Accordion
                      defaultOpenId="acc-1"
                      items={[
                        {
                          id: "acc-1",
                          title: "Virtual Private Cloud (VPC) Peering & CIDR Block Routing",
                          content: "Configure cross-account peering connections between Amazon EKS and Google Cloud VPCs with dedicated 10.0.0.0/16 non-overlapping subnets and BGP route advertisements.",
                        },
                        {
                          id: "acc-2",
                          title: "Horizontal Pod Autoscaler (HPA) CPU & Memory Metrics",
                          content: "Automatically scales deployment replicas between 3 and 40 nodes based on 90th percentile latency spikes and average CPU utilization exceeding 75%.",
                        },
                        {
                          id: "acc-3",
                          title: "Mutual TLS (mTLS) Mesh & SPIFFE Identity Verification",
                          content: "Strict cryptographic workload identity validation enforcing short-lived X.509 certificates rotated every 12 hours across the service mesh data plane.",
                        },
                      ]}
                    />
                  </div>
                </div>

                {/* ── 17. CHAT MESSAGE BUBBLE MOLECULE ── */}
                <div id="mol-chat-bubble" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>Chat message bubble</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        Incoming and outgoing message bubbles with token-reactive corner geometry, high-contrast primary accent fills, Unsplash portrait avatars, hover action bars, and interactive emoji reactions.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-4">
                    {/* Incoming Peer Bubble */}
                    <ChatBubble
                      sender="peer"
                      senderName="Sarah Chen"
                      avatarSrc="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                      message="Hey team! The new ZeroLight design system token engine is live on staging. All corner radiuses, heights, and icon strokes are updating in real-time."
                      timestamp="11:42 AM"
                      reactions={[{ emoji: "🎉", count: 4, active: true }, { emoji: "🚀", count: 2 }]}
                      attachment={{
                        type: "file",
                        name: "zerolight-token-audit.pdf",
                        size: "1.8 MB",
                      }}
                      onCopy={() => triggerToast("Copied peer message to clipboard")}
                    />

                    {/* Outgoing User Bubble */}
                    <ChatBubble
                      sender="user"
                      message="Confirmed! Tested with 0px sharp geometry, pill presets, and custom primary colors. The contrast calculation is crisp across all screen densities."
                      timestamp="11:45 AM"
                      status="read"
                      reactions={[{ emoji: "🔥", count: 3 }]}
                      onCopy={() => triggerToast("Copied your message to clipboard")}
                    />
                  </div>
                </div>

                {/* ── 18. CHAT COMPOSER INPUT MOLECULE ── */}
                <div id="mol-chat-input" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <Send className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>Chat composer input</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        Rich multi-line auto-expanding conversational composer with file attachment trigger, emoji selector, keyboard submission hints, and token-reactive spring send button.
                      </p>
                    </div>
                  </div>

                  <div className="max-w-xl">
                    <ChatInput
                      placeholder="Type a message or paste a snippet..."
                      onSend={(msg) => triggerToast(`Message dispatched: "${msg.slice(0, 30)}..."`)}
                      onAttach={() => triggerToast("File attachment dialog triggered")}
                    />
                  </div>
                </div>

                {/* ── 19. ENTERPRISE DATA VISUALIZATION SUITE ── */}
                <div id="mol-dataviz" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <BarChart2
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                          Enterprise Data Visualization Family
                        </h2>
                        <Badge variant="healthy">8 Chart Molecules</Badge>
                      </div>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed max-w-2xl">
                        Zero-dependency SVG chart suite natively bound to ZeroLight tokens. Instant CLS=0 layout stability with tabular-nums typography, interactive mouse scrubbers, and dynamic corner radii.
                      </p>
                    </div>
                  </div>

                  {/* Row 1: AreaChart (Curved with Tooltip) & BarChart (Grouped/Stacked) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <AreaChart
                      title="API Request Throughput"
                      subtitle="Interactive cubic-bezier spline with scrub crosshair"
                      data={[
                        { label: "Mon", value: 1420, secondaryValue: 1100 },
                        { label: "Tue", value: 2100, secondaryValue: 1650 },
                        { label: "Wed", value: 1850, secondaryValue: 1720 },
                        { label: "Thu", value: 2980, secondaryValue: 2100 },
                        { label: "Fri", value: 3420, secondaryValue: 2600 },
                        { label: "Sat", value: 2780, secondaryValue: 2200 },
                        { label: "Sun", value: 3890, secondaryValue: 2900 },
                      ]}
                      primaryLabel="This Week"
                      secondaryLabel="Last Week"
                      valueFormatter={(v) => `${v.toLocaleString()} req/s`}
                    />

                    <BarChart
                      title="Quarterly Infrastructure Cost"
                      subtitle="Grouped columns with token-bound rounded caps"
                      data={[
                        { label: "Jan", value: 45000, secondaryValue: 28000 },
                        { label: "Feb", value: 52000, secondaryValue: 34000 },
                        { label: "Mar", value: 68000, secondaryValue: 41000 },
                        { label: "Apr", value: 74000, secondaryValue: 49000 },
                        { label: "May", value: 89000, secondaryValue: 62000 },
                        { label: "Jun", value: 95000, secondaryValue: 71000 },
                      ]}
                      primaryLabel="Cloud Compute"
                      secondaryLabel="Object Storage"
                      valueFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                  </div>

                  {/* Row 2: DonutChart, GaugeChart, and Sparkline Showcase */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <DonutChart
                      title="Resource Allocation"
                      subtitle="Interactive SVG radial ring with KPI center"
                      data={[
                        { id: "d-1", label: "Production API", value: 45, color: scaled.chartColors[0] },
                        { id: "d-2", label: "PostgreSQL DB", value: 25, color: scaled.chartColors[1] },
                        { id: "d-3", label: "Redis Cluster", value: 18, color: scaled.chartColors[2] },
                        { id: "d-4", label: "Edge CDN", value: 12, color: scaled.chartColors[3] },
                      ]}
                      centerLabel="Total Load"
                      centerValue="100%"
                    />

                    <GaugeChart
                      title="Service Level Objective (SLO)"
                      subtitle="Semicircle radial gauge with safety threshold"
                      value={99}
                      unit="%"
                      statusText="Within Spec"
                      healthyThreshold={95}
                      criticalThreshold={90}
                      mode="higher-is-better"
                    />

                    <div
                      style={{
                        borderRadius: `${scaled.scaledCardRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.universalFillColor,
                      }}
                      className="p-5 border shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
                          Mini Sparkline Trends
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Drop into StatCards and tables
                        </p>
                      </div>

                      <div className="space-y-4 my-auto py-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-neutral-500">Latency</div>
                            <div className="text-sm font-bold tabular-nums">18.4 ms</div>
                          </div>
                          <Sparkline
                            data={[32, 28, 25, 22, 19, 18, 17, 18]}
                            width={110}
                            height={32}
                            color={scaled.chartPrimaryColor}
                          />
                        </div>
                        <div className="flex items-center justify-between border-t border-neutral-100 pt-2">
                          <div>
                            <div className="text-xs text-neutral-500">Error Rate</div>
                            <div className="text-sm font-bold tabular-nums text-rose-600">0.02%</div>
                          </div>
                          <Sparkline
                            data={[4, 6, 8, 14, 18, 12, 5, 2]}
                            width={110}
                            height={32}
                            color="#EF4444"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: HorizontalBarChart, HeatmapMatrix & FunnelChart */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <HorizontalBarChart
                      title="Latency by Endpoint"
                      subtitle="Ranked horizontal comparison bars"
                      data={[
                        { id: "h-1", label: "/api/v2/auth", value: 18420, secondaryLabel: "18ms" },
                        { id: "h-2", label: "/api/v2/transactions", value: 14100, secondaryLabel: "24ms" },
                        { id: "h-3", label: "/api/v2/users", value: 9800, secondaryLabel: "38ms" },
                        { id: "h-4", label: "/api/v2/webhooks", value: 4200, secondaryLabel: "54ms" },
                      ]}
                      valueFormatter={(v) => `${(v / 1000).toFixed(1)}k req`}
                    />

                    <HeatmapMatrix
                      title="Commit & Deployment Matrix"
                      subtitle="Activity intensity over time"
                      data={[
                        { x: "W1", y: "Mon", value: 12 }, { x: "W2", y: "Mon", value: 24 }, { x: "W3", y: "Mon", value: 8 },
                        { x: "W1", y: "Wed", value: 45 }, { x: "W2", y: "Wed", value: 38 }, { x: "W3", y: "Wed", value: 19 },
                        { x: "W1", y: "Fri", value: 54 }, { x: "W2", y: "Fri", value: 62 }, { x: "W3", y: "Fri", value: 41 },
                        { x: "W1", y: "Sun", value: 6 },  { x: "W2", y: "Sun", value: 14 }, { x: "W3", y: "Sun", value: 3 },
                      ]}
                    />

                    <FunnelChart
                      title="Onboarding Conversion"
                      subtitle="Stage-by-stage user drop-off"
                      stages={[
                        { id: "f-1", name: "1. Unique Visitors", count: 124500 },
                        { id: "f-2", name: "2. Sign-ups", count: 48200 },
                        { id: "f-3", name: "3. Workspace Setup", count: 26800 },
                        { id: "f-4", name: "4. Paid Plan", count: 9400 },
                      ]}
                    />
                  </div>
                </div>

                {/* ── 20. FLOATING ACTION DROPDOWN & DATE RANGE PICKER ── */}
                <div id="mol-dropdown-menu" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="space-y-1">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                      <Sliders size={scaled.iconSmSize || 16} strokeWidth={tokens.iconStrokeWidth || 1.75} color={tokens.iconColor || tokens.textIconColor} />
                      <span>Dropdown action menu & Date range picker</span>
                    </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                      Floating keyboard-navigable action popovers with click-outside detection and analytics range presets.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <DropdownMenu
                      trigger={
                        <Button variant="outline" size="md" iconRight={<ChevronDown className="w-3.5 h-3.5" />}>
                          Table Row Actions
                        </Button>
                      }
                      items={[
                        { id: "edit", label: "Edit entity profile", icon: <Edit3 className="w-3.5 h-3.5" />, onClick: () => triggerToast("Edit entity clicked") },
                        { id: "duplicate", label: "Duplicate workload", icon: <Copy className="w-3.5 h-3.5" />, onClick: () => triggerToast("Duplicate clicked") },
                        { id: "export", label: "Export audit JSON", icon: <Download className="w-3.5 h-3.5" />, shortcut: "⌘E", onClick: () => triggerToast("Exporting JSON...") },
                        { id: "delete", label: "Decommission node", icon: <Trash2 className="w-3.5 h-3.5" />, destructive: true, separator: true, onClick: () => triggerToast("Decommission triggered") },
                      ]}
                    />

                    <DateRangePicker
                      onChange={(range) => triggerToast(`Selected: ${range.startDate} – ${range.endDate}`)}
                    />
                  </div>
                </div>

                {/* ── 21. HYBRID & CONJOINED COMPOSITE VARIATIONS ── */}
                <div id="mol-conjoined-composites" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Layers size={scaled.iconSmSize || 16} strokeWidth={tokens.iconStrokeWidth || 1.75} color={tokens.iconColor || tokens.textIconColor} />
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                        Hybrid & Conjoined Composites (Zero-Gap Fusion)
                      </h2>
                      <Badge variant="healthy">Adaptable Variations</Badge>
                    </div>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed max-w-3xl">
                      Demonstrates atomic composability where two or more design elements merge into new variations—from micro split buttons to conjoined inputs and metric-sparkline hybrids—without dead white spaces or double borders.
                    </p>
                  </div>

                  {/* Variation A: Split Buttons */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Variation 1: Split Action Buttons (Button + Submenu Trigger)
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <SplitButton
                        label="Deploy Cluster"
                        variant="primary"
                        onClick={() => triggerToast("Deploying to production cluster...")}
                        options={[
                          { id: "stage", label: "Deploy to Staging", description: "Automated canary release", onClick: () => triggerToast("Staging deployment initiated") },
                          { id: "dryrun", label: "Run Dry-Run Check", description: "Validate terraform manifests", onClick: () => triggerToast("Dry-run validation clean") },
                          { id: "rollback", label: "Emergency Rollback", description: "Revert to last stable commit", onClick: () => triggerToast("Rollback checkpoint selected") },
                        ]}
                      />
                      <SplitButton
                        label="Export Report"
                        variant="outline"
                        onClick={() => triggerToast("Exporting default CSV...")}
                        options={[
                          { id: "csv", label: "Comma-Separated (CSV)", description: "Raw spreadsheet export", onClick: () => triggerToast("CSV export queued") },
                          { id: "json", label: "Telemetry JSON", description: "Full audit data envelope", onClick: () => triggerToast("JSON export queued") },
                          { id: "pdf", label: "Executive PDF Summary", description: "Formatted chart document", onClick: () => triggerToast("PDF rendering...") },
                        ]}
                      />
                    </div>
                  </div>

                  {/* Variation B: Conjoined Fields */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Variation 2: Conjoined Field (Dropdown Select + Numeric Input + Action Button)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ConjoinedField label="International Payment Wire">
                        <select
                          className="px-3 bg-neutral-100 text-neutral-700 font-semibold text-xs border-0 outline-none cursor-pointer h-full"
                          defaultValue="USD"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                        <input
                          type="text"
                          defaultValue="2,450.00"
                          className="flex-1 px-3.5 text-xs text-neutral-900 font-medium tabular-nums outline-none bg-transparent h-full"
                          placeholder="0.00"
                        />
                        <button
                          type="button"
                          onClick={() => triggerToast("Transfer dispatched")}
                          style={{
                            backgroundColor: tokens.primaryButtonColor,
                            color: scaled.primaryActionTextColor,
                          }}
                          className="px-4 text-xs font-semibold h-full hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                        >
                          Transfer Now
                        </button>
                      </ConjoinedField>

                      <ConjoinedField label="Scoped Cluster Filter">
                        <span className="px-3 bg-neutral-100 text-neutral-500 font-medium text-xs select-none flex items-center h-full">
                          node://
                        </span>
                        <input
                          type="text"
                          defaultValue="us-east-01/ingress-gw"
                          className="flex-1 px-3 text-xs text-neutral-900 font-medium outline-none bg-transparent h-full"
                          placeholder="cluster/hostname"
                        />
                        <button
                          type="button"
                          onClick={() => triggerToast("Filter applied")}
                          className="px-3.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer h-full"
                        >
                          Filter
                        </button>
                      </ConjoinedField>
                    </div>
                  </div>

                  {/* Variation C: StatCard + Sparkline & Badge Hybrid */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Variation 3: Metric Fusion (StatCard + Sparkline + Live Badge)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <StatCard
                        label="REAL-TIME INGRESS"
                        value="3,480 req/s"
                        delta="+18.4%"
                        trend="up"
                        comparisonText="peak load"
                        badge={<Badge variant="healthy">LIVE SLA</Badge>}
                        sparkline={
                          <Sparkline
                            data={[14, 18, 22, 19, 28, 34, 42, 38, 48, 52]}
                            color="#10B981"
                            width={110}
                            height={32}
                            strokeWidth={2}
                          />
                        }
                      />
                      <StatCard
                        label="AVERAGE LATENCY"
                        value="14.2 ms"
                        delta="-3.8 ms"
                        trend="down"
                        comparisonText="healthy spec"
                        badge={<Badge variant="healthy">OPTIMIZED</Badge>}
                        sparkline={
                          <Sparkline
                            data={[38, 34, 30, 28, 24, 22, 19, 16, 15, 14]}
                            color="#3B82F6"
                            width={110}
                            height={32}
                            strokeWidth={2}
                          />
                        }
                      />
                    </div>
                  </div>

                  {/* Variation D: Composable Form Family (Shadcn-Grade Context & Validation) */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Variation 4: Composable Form Architecture (Context-Aware ARIA Binding)
                    </div>
                    <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          triggerToast("Configuration payload validated and saved");
                        }}
                        className="space-y-4 max-w-xl"
                      >
                        <FormItem name="cluster-alias">
                          <FormLabel>Cluster Domain Alias</FormLabel>
                          <FormControl>
                            <input
                              type="text"
                              defaultValue="prod-ingress.zerolight.io"
                              style={{
                                borderRadius: `${scaled.scaledRadius}px`,
                                borderColor: tokens.universalBorderColor,
                                borderWidth: `${tokens.borderWidth}px`,
                                height: `${scaled.scaledHeight}px`,
                                fontSize: `${scaled.scaledFontSize}px`,
                                color: tokens.textIconColor,
                              }}
                              className="w-full border px-3 bg-white outline-none font-medium focus:ring-2 focus:ring-neutral-400"
                            />
                          </FormControl>
                          <FormDescription>
                            Fully qualified domain name mapped to your edge proxy nodes.
                          </FormDescription>
                        </FormItem>

                        <FormItem name="rate-limit" error="Rate limit threshold must not exceed 50,000 req/s on Standard tier">
                          <FormLabel>Ingress Rate Limit (req/s)</FormLabel>
                          <FormControl>
                            <input
                              type="text"
                              defaultValue="75,000"
                              style={{
                                borderRadius: `${scaled.scaledRadius}px`,
                                borderColor: "#E11D48",
                                borderWidth: `${tokens.borderWidth}px`,
                                height: `${scaled.scaledHeight}px`,
                                fontSize: `${scaled.scaledFontSize}px`,
                                color: tokens.textIconColor,
                              }}
                              className="w-full border px-3 bg-white outline-none font-medium focus:ring-2 focus:ring-rose-500/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>

                        <div className="pt-1">
                          <Button type="submit" variant="primary" size="sm">
                            Validate & Update Schema
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>

                {/* ── GLOBAL ENTERPRISE SELECTORS & SHUTTLE SUITE ── */}
                <div id="mol-enterprise-selectors" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-6">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                        Enterprise Hierarchy &amp; Batch Assignment Suite
                      </h2>
                      <Badge variant="healthy">Global Enterprise Parity</Badge>
                    </div>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed max-w-3xl">
                      Portaled hierarchical resource selectors (TreeSelect with indeterminate branch math, Miller-column Cascader) and a spring-animated dual-list Transfer shuttle box.
                    </p>
                  </div>

                  {/* Row 1: TreeSelect + Cascader */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <TreeSelect
                      label="Cloud Resource Hierarchy (TreeSelect)"
                      value={treeSelectValues}
                      onChange={setTreeSelectValues}
                      maxTagCount={2}
                      data={[
                        {
                          id: "aws-prod",
                          label: "AWS Production Org",
                          badge: "Root",
                          children: [
                            {
                              id: "k8s-us-east",
                              label: "EKS Cluster (us-east-1)",
                              badge: "12 Nodes",
                            },
                            {
                              id: "k8s-eu-west",
                              label: "EKS Cluster (eu-west-1)",
                              badge: "8 Nodes",
                            },
                          ],
                        },
                        {
                          id: "data-tier",
                          label: "Managed Databases",
                          children: [
                            { id: "rds-primary", label: "Aurora PostgreSQL Primary", badge: "Multi-AZ" },
                            { id: "redis-cache", label: "ElastiCache Redis Cluster", badge: "6.2" },
                          ],
                        },
                      ]}
                    />

                    <Cascader
                      label="Region / Cluster / VPC Drill-Down (Cascader)"
                      value={cascaderPath}
                      onChange={(nextPath) => setCascaderPath(nextPath)}
                      options={[
                        {
                          value: "us-east",
                          label: "US East (N. Virginia)",
                          children: [
                            {
                              value: "prod-01",
                              label: "Cluster Prod-01",
                              children: [
                                { value: "vpc-alpha", label: "VPC Alpha (10.0.0.0/16)" },
                                { value: "vpc-beta", label: "VPC Beta (10.1.0.0/16)" },
                              ],
                            },
                            {
                              value: "staging-01",
                              label: "Cluster Staging-01",
                              children: [
                                { value: "vpc-stage", label: "VPC Staging" },
                              ],
                            },
                          ],
                        },
                        {
                          value: "eu-central",
                          label: "EU Central (Frankfurt)",
                          children: [
                            {
                              value: "eu-prod",
                              label: "Cluster EU-Prod",
                              children: [
                                { value: "vpc-gdpr", label: "VPC GDPR Strict" },
                              ],
                            },
                          ],
                        },
                      ]}
                    />
                  </div>

                  {/* Row 2: Dual-List Transfer Shuttle */}
                  <div className="space-y-2 pt-2 border-t border-neutral-100">
                    <div className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      IAM Role &amp; Permission Shuttle (Transfer)
                    </div>
                    <Transfer
                      titles={["Available Scopes", "Assigned Scopes"]}
                      targetKeys={transferTargetKeys}
                      onChange={(nextKeys, direction, moved) => {
                        setTransferTargetKeys(nextKeys);
                        triggerToast(`Moved ${moved.length} scope(s) ${direction === "right" ? "to Assigned" : "back to Available"}`);
                      }}
                      dataSource={[
                        { id: "perm-read", label: "telemetry:read", description: "View real-time cluster metrics", badge: "Safe" },
                        { id: "perm-audit", label: "audit:export", description: "Download immutable security logs", badge: "Compliance" },
                        { id: "perm-deploy", label: "cluster:deploy", description: "Push container images to edge", badge: "Write" },
                        { id: "perm-billing", label: "billing:manage", description: "Update payment cards & limits", badge: "Admin" },
                        { id: "perm-iam", label: "iam:escalate", description: "Grant root privileges to SSO", badge: "Critical" },
                        { id: "perm-kms", label: "kms:rotate", description: "Trigger envelope key rotation", badge: "Security" },
                      ]}
                    />
                  </div>
                </div>

                {/* ── 19. WORLD MAP & GEO TELEMETRY ── */}
                <div id="mol-world-map" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex items-start justify-between border-b pb-4" style={{ borderColor: tokens.universalBorderColor }}>
                    <div>
                      <h2 className="text-lg font-semibold tracking-tight">World Map & Geo-Visualization</h2>
                      <p className="text-xs opacity-60 mt-0.5">
                        Zero-API-key SVG choropleth heatmap, edge pins, flow arcs, and continent zoom presets.
                      </p>
                    </div>
                    <Badge variant="neutral">molecules/world-map</Badge>
                  </div>
                  <WorldMap
                    data={[
                      { id: "US", value: 48200, formattedValue: "$48.2K", delta: "+14.2%" },
                      { id: "GB", value: 24100, formattedValue: "$24.1K", delta: "+9.4%" },
                      { id: "DE", value: 18900, formattedValue: "$18.9K", delta: "+6.8%" },
                      { id: "IN", value: 15400, formattedValue: "$15.4K", delta: "+22.1%" },
                      { id: "SG", value: 10200, formattedValue: "$10.2K", delta: "+11.5%" },
                      { id: "JP", value: 9400, formattedValue: "$9.4K", delta: "+5.3%" },
                      { id: "BR", value: 7800, formattedValue: "$7.8K", delta: "+8.9%" },
                      { id: "AU", value: 6400, formattedValue: "$6.4K", delta: "-1.8%" },
                    ]}
                    markers={[
                      { id: "iad", countryId: "US", label: "us-east-1", status: "active" },
                      { id: "lhr", countryId: "GB", label: "eu-west-2", status: "active" },
                      { id: "sin", countryId: "SG", label: "ap-southeast-1", status: "active" },
                      { id: "bom", countryId: "IN", label: "ap-south-1", status: "warning" },
                    ]}
                    arcs={[
                      { from: "US", to: "GB" },
                      { from: "GB", to: "IN" },
                      { from: "IN", to: "SG" },
                    ]}
                  />
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
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <Server className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>Microservice nodes data table</span>
                        <Badge variant="healthy">Inline Editable</Badge>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Production node fleet grid with tri-state multi-select, role filter pills, and inline cell editing (click Name, Region, or Latency to edit).
                      </p>
                    </div>
                  </div>

                  <DataTable
                    editable
                    onSelectNode={(_nodeId) => {
                      setIsDrawerOpen(true);
                    }}
                  />
                </div>

                {/* ── 2. GLOBAL APPLICATION HEADER ORGANISM ── */}
                <div id="org-global-header" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                      <Compass className="w-4 h-4 text-neutral-500 shrink-0" />
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
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <Layers className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>Collapsible navigation sidebar</span>
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
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <Command
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Global command palette</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        Interactive command runner modal with instant filtering, icon-augmented action list, and quick dispatch.
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      iconLeft={<Command />}
                      onClick={() => setIsCmdPaletteOpen(true)}
                    >
                      Open Command Palette
                    </Button>
                  </div>

                  <CommandPalette
                    isOpen={isCmdPaletteOpen}
                    onClose={() => setIsCmdPaletteOpen(false)}
                  />
                </div>

                {/* ── 5. COMPOUND FILTER BUILDER ORGANISM ── */}
                <div id="org-filter-builder" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <Filter
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Multi-clause filter builder</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        Multi-condition parameter query builder with dynamic criteria rows, logic joiners, and saved views.
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      iconLeft={<Filter />}
                      onClick={() => triggerToast("Saved active filter view to workspace")}
                    >
                      Save Filter View
                    </Button>
                  </div>

                  <FilterBuilder />
                </div>

                {/* ── 6. DATE RANGE PICKER ORGANISM ── */}
                <div id="org-date-picker" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>Date range picker popover</span>
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
                        <CalendarIcon className="w-4 h-4 text-neutral-400 shrink-0" strokeWidth={1.8} />
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
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-neutral-500 shrink-0" />
                        Metric telemetry chart card
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
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
                      className="flex items-center gap-1 p-0.5 border shrink-0 self-start sm:self-auto"
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
                        className="absolute top-2 right-3 bg-neutral-900 text-white text-[11px] px-2 py-1 shadow-md font-sans tabular-nums"
                      >
                        {hoveredChartPoint.time} → {hoveredChartPoint.value} req/s
                      </div>
                    )}

                    {/* X-Axis Timestamps */}
                    <div className="flex justify-between text-[10px] text-neutral-400 font-sans pt-1">
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
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <Sliders
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color={tokens.iconColor || tokens.textIconColor}
                          className="shrink-0"
                        />
                        <span>Slide-over detail drawer</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        Node diagnostic inspector sheet sliding from the screen edge with key-value metadata and action footer.
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      iconLeft={<Layers size={scaled.iconSmSize || 16} />}
                      onClick={() => setIsDrawerOpen(true)}
                    >
                      Open Inspector Drawer
                    </Button>
                  </div>

                  <DetailDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    onSave={() => {
                      setIsDrawerOpen(false);
                      triggerToast("Node properties saved");
                    }}
                  />
                </div>

                {/* ── 9. CONFIRMATION MODAL ORGANISM ── */}
                <div id="org-confirmation-modal" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <AlertTriangle
                          size={scaled.iconSmSize || 16}
                          strokeWidth={tokens.iconStrokeWidth || 1.75}
                          color="#E11D48"
                          className="shrink-0"
                        />
                        <span>Confirmation dialog modal</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        High-stakes safety confirmation dialog requiring explicit phrase verification before executing destructive operations.
                      </p>
                    </div>

                    <Button
                      variant="destructive"
                      iconLeft={<AlertTriangle size={scaled.iconSmSize || 16} />}
                      onClick={() => setIsConfirmModalOpen(true)}
                    >
                      Trigger Confirmation Modal
                    </Button>
                  </div>

                  <ConfirmationModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={() => {
                      setIsConfirmModalOpen(false);
                      triggerToast("Successfully decommissioned node us-east-prod-01");
                    }}
                    title="Decommission Cluster Node"
                    description="Are you sure you want to terminate us-east-prod-01? Running workloads will experience traffic interruption. Type DELETE below to proceed."
                    verificationPhrase="DELETE"
                    confirmButtonText="Decommission Node"
                  />
                </div>

                {/* ── 10. RESOURCE HIERARCHY TREE VIEW ── */}
                <div id="org-tree-view" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <FolderTree className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>Resource hierarchy tree view</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        Hierarchical explorer for multi-region cloud resources, Kubernetes cluster pods, and secure telemetry object stores.
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <TreeView
                      onSelectNode={(node) => {
                        triggerToast(`Selected resource: ${node.name}`);
                      }}
                    />
                  </div>
                </div>

                {/* ── 11. COMPLIANCE AUDIT LOG TRAIL ── */}
                <div id="org-audit-log" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>Audit log compliance trail</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        SOC2 and FedRAMP immutable audit log tracking authentication events, security group modifications, and RBAC changes.
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <AuditLog />
                  </div>
                </div>

                {/* ── 12. TENANT RESOURCE QUOTA MATRIX ── */}
                <div id="org-quota-matrix" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <Activity className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>Tenant resource quota matrix</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        Real-time tenant resource consumption telemetry tracking vCPU cores, memory, outbound egress bandwidth, and monthly API calls.
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <QuotaMatrix
                      onRequestIncrease={() => {
                        triggerToast("Quota expansion request dispatched to billing administrator");
                      }}
                    />
                  </div>
                </div>

                {/* ── 13. SAAS CHAT CONVERSATION THREAD ORGANISM ── */}
                <div id="org-chat-conversation" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex-1 max-w-xl space-y-1">
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>SaaS chat conversation thread</span>
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                        Full-stack conversational workspace with live peer presence, date dividers, interactive outgoing message dispatch, simulated intelligent responses, and token-reactive message bubbles.
                      </p>
                    </div>
                  </div>

                  <div className="pt-1 max-w-3xl">
                    <ChatConversation />
                  </div>
                </div>

                {/* ── 14. ENTERPRISE APP SHELL & GLOBAL TOAST ORGANISM ── */}
                <div id="org-app-shell" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-6">
                  <div className="space-y-1">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold flex items-center gap-2">
                      <Layers size={scaled.iconSmSize || 16} strokeWidth={tokens.iconStrokeWidth || 1.75} color={tokens.iconColor || tokens.textIconColor} />
                      <span>Enterprise AppShell & Global Toast Notification Suite</span>
                    </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed">
                      Standardized layout framework with responsive collapsible sidebar/rail, plus non-blocking stacked notifications with auto-dismiss timers.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-4">
                    <div className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                      Interactive Notification Triggers
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => triggerToast("Success: Microservice node us-east-01 deployed successfully")}
                      >
                        Trigger Success Toast
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => triggerToast("Warning: Node memory threshold reached 88% capacity")}
                      >
                        Trigger Warning Toast
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => triggerToast("Error: Database replica sync timed out (504 Gateway Error)")}
                      >
                        Trigger Error Toast
                      </Button>
                    </div>
                  </div>
                </div>

                {/* ── 14. GEO BREAKDOWN ORGANISM ── */}
                <div id="org-geo-breakdown" style={cardStyle} className="p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex items-start justify-between border-b pb-4" style={{ borderColor: tokens.universalBorderColor }}>
                    <div>
                      <h2 className="text-lg font-semibold tracking-tight">Geo Breakdown Block</h2>
                      <p className="text-xs opacity-60 mt-0.5">
                        SaaS regional analytics pairing interactive WorldMap with ranked country telemetry.
                      </p>
                    </div>
                    <Badge variant="neutral">organisms/geo-breakdown</Badge>
                  </div>
                  <GeoBreakdown />
                </div>
              </>
            )}

            {/* ══════════════════════════════════════════════════════════
                VIEW D: TEMPLATES (ATOMIC TIER 4 REUSABLE BLUEPRINTS)
               ══════════════════════════════════════════════════════════ */}
            {activeTier === "templates" && (
              <TemplatesShowcase
                activeTemplateTab={activeTemplateTab}
                setActiveTemplateTab={setActiveTemplateTab}
                tokens={tokens}
                scaled={scaled}
                cardStyle={cardStyle}
                triggerToast={triggerToast}
              />
            )}

            {/* ══════════════════════════════════════════════════════════
                VIEW E: ENTERPRISE PAGES (ATOMIC TIER 5 PRODUCTION SCREENS)
               ══════════════════════════════════════════════════════════ */}
            {activeTier === "pages" && (
              <PagesShowcase
                activePageTab={activePageTab}
                setActivePageTab={setActivePageTab}
                tokens={tokens}
                scaled={scaled}
                cardStyle={cardStyle}
              />
            )}
          </div>
        </main>

        {/* ══════════════════════════════════════════════════════════
            COLUMN 3: RIGHT SIDEBAR (DARK MODE "VISUAL STUDIO" DOCK)
           ══════════════════════════════════════════════════════════ */}
        <div className="hidden xl:flex relative h-full shrink-0">
          {renderLeftResizer(STUDIO_MAX_WIDTH)}
          <aside
            data-zl-studio-chrome="true"
            style={{ width: `${studioWidth}px` }}
            className="border-l border-[#27272A] bg-[#121214] text-[#E4E4E7] flex flex-col select-none h-full overflow-hidden"
          >
            <StudioInspector {...studioInspectorProps} />
          </aside>
        </div>

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
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={scaled.motionConfig.drawerTransition}
                onClick={(e) => e.stopPropagation()}
                style={{ width: `${Math.min(studioWidth, 480)}px` }}
                className="relative max-w-[92vw] h-full shrink-0 flex"
              >
                {renderLeftResizer(480)}
                <aside
                  data-zl-studio-chrome="true"
                  className="w-full bg-[#121214] text-[#E4E4E7] h-full overflow-hidden border-l border-[#27272A] flex flex-col select-none"
                >
                  <StudioInspector {...studioInspectorProps} />
                </aside>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════════════════════
            1-CLICK TOKEN EXPORT MODAL (TAILWIND, CSS, JSON)
           ══════════════════════════════════════════════════════════ */}
        <ExportRegistryModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          tokens={tokens}
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          isExportCopied={isExportCopied}
          setIsExportCopied={setIsExportCopied}
          registryItems={registryItems}
          registryTier={registryTier}
          setRegistryTier={setRegistryTier}
          registryQuery={registryQuery}
          setRegistryQuery={setRegistryQuery}
          selectedRegistryName={selectedRegistryName}
          setSelectedRegistryName={setSelectedRegistryName}
          selectedRegistryDetail={selectedRegistryDetail}
          isRegistryLoading={isRegistryLoading}
          triggerToast={triggerToast}
        />
      </div>
    </div>
    </ZeroLightProvider>
  );
}
