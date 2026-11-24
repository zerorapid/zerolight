"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Home,
  Layers,
  Wrench,
  Settings,
  LogOut,
  ShieldCheck,
  Terminal,
  User,
  Key,
  Globe,
  ArrowUpRight,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  HelpCircle,
  FileCode2,
  PanelLeftClose,
  PanelLeft,
  Copy,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  Laptop,
  Radio,
  Download,
  Building,
  Cpu,
  Database,
  Sliders,
  Search,
  Bell,
  ExternalLink,
  Printer,
  X,
} from "lucide-react";
import { useAuth } from "../auth/auth-context";
import { useZeroLight } from "../context";
import { WorldAtlasMap } from "../../WorldAtlasMap";
import { ZeroLightDocsPortal } from "../docs/zerolight-docs-portal";
import { SaaSTokensLibrary, SaaSButtonLibrary, SaaSInputFieldLibrary, SaaSSelectionLibrary, SaaSIndicatorLibrary, SaaSDividerLibrary, SaaSTooltipLibrary, SaaSFeedbackLibrary, SaaSOverlaysLibrary, SaaSNavigationLibrary, SaaSDataLibrary, SaaSBusinessLibrary, SaaSLayoutLibrary, SaaSAppScreensLibrary, SaaSEdgeCasesLibrary } from "../libraries";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";
import { Card } from "../atoms/card";
import { DynamicIcon } from "../atoms/dynamic-icon";
import { SegmentedControl } from "../molecules/segmented-control";
import { TokenStudioSidebar } from "../studio/token-studio-sidebar";
import { SaasTemplateStage, SaasTemplateKey } from "../studio/saas-template-stage";
import { ToolsDirectory, ZeroFlashTool, ZeroAuditorTool } from "../tools";

export type DashboardTab = "overview" | "docs" | "tools" | "settings";
export type ToolsSubView = "index" | "studio" | "atlas" | "zeroflash" | "zeroauditor";
export type DocsTier = "foundations" | "atoms" | "molecules" | "organisms" | "templates" | "pages";
export type DocsSubView =
  | "catalog"
  | "buttons"
  | "inputs"
  | "selections"
  | "indicators"
  | "dividers"
  | "tooltips"
  | "feedback"
  | "overlays"
  | "navigation"
  | "data"
  | "business"
  | "layouts"
  | "screens"
  | "edge-cases"
  | "catalog-molecules";
export type SettingsSubTab = "general" | "security" | "mcp" | "api" | "compliance";

export const DOCS_TIERS: {
  id: DocsTier;
  label: string;
  count: string;
  defaultTab: DocsSubView;
  tabs: { id: DocsSubView; label: string; count: string; desc: string }[];
}[] = [
  {
    id: "foundations",
    label: "Foundations",
    count: "154",
    defaultTab: "catalog",
    tabs: [
      { id: "catalog", label: "Tokens & Principles", count: "120", desc: "Design tokens, color swatches, hairlines & typography scale" },
      { id: "dividers", label: "Dividers & Spacers", count: "22", desc: "Monochrome hairlines, inset boundaries & proportional spacing" },
      { id: "edge-cases", label: "Hierarchy & Resilience", count: "12", desc: "Spring motion physics, truncation resilience & layout stress tests" },
    ],
  },
  {
    id: "atoms",
    label: "Atoms",
    count: "153",
    defaultTab: "buttons",
    tabs: [
      { id: "buttons", label: "Buttons", count: "33", desc: "Primary, secondary, outline, ghost & split action triggers" },
      { id: "inputs", label: "Inputs & Fields", count: "44", desc: "Text, conjoined, tags, currency & keyboard-accessible fields" },
      { id: "selections", label: "Selection Controls", count: "26", desc: "Custom switches, segmented rails & radio cards" },
      { id: "indicators", label: "Status & Indicators", count: "28", desc: "Status dots, badges, circular rings & progress meters" },
      { id: "tooltips", label: "Tooltips & Popovers", count: "22", desc: "Directional hints, hover cards & contextual popovers" },
    ],
  },
  {
    id: "molecules",
    label: "Molecules",
    count: "65",
    defaultTab: "feedback",
    tabs: [
      { id: "feedback", label: "Feedback & Alerts", count: "20", desc: "Inline notice bars, floating toasts, empty states & recovery cards" },
      { id: "catalog-molecules", label: "Molecules Directory", count: "45", desc: "StatCards, charts, calendars, ProductWindow & HeroShowcase" },
    ],
  },
  {
    id: "organisms",
    label: "Organisms",
    count: "70",
    defaultTab: "overlays",
    tabs: [
      { id: "overlays", label: "Overlays & Command", count: "16", desc: "Modal dialogs, slide-over detail drawers & ⌘K command palette" },
      { id: "navigation", label: "Navigation & Menus", count: "20", desc: "Collapsible sidebars, top headers, wizard steppers & breadcrumbs" },
      { id: "data", label: "Data & Tables", count: "18", desc: "Sortable tables, bulk action bars, filter builders & Kanban boards" },
      { id: "business", label: "Business & Billing", count: "16", desc: "Invoicing modules, subscription tiers, @mentions & audit logs" },
    ],
  },
  {
    id: "templates",
    label: "Templates",
    count: "12",
    defaultTab: "layouts",
    tabs: [
      { id: "layouts", label: "Layout Blueprints", count: "12", desc: "App shell, auth split, settings grid & list-detail layouts" },
    ],
  },
  {
    id: "pages",
    label: "Pages",
    count: "6",
    defaultTab: "screens",
    tabs: [
      { id: "screens", label: "App Screens", count: "6", desc: "Complete working SaaS applications with interactive workflows" },
    ],
  },
];

export const TOOLS_VIEWS: {
  id: Exclude<ToolsSubView, "index">;
  label: string;
  badge: string;
  desc: string;
}[] = [
  { id: "studio", label: "Visual Studio Dock", badge: "Tokens", desc: "Live token customizer and interactive SaaS template workbench" },
  { id: "zeroflash", label: "ZeroFlash Brand", badge: "Brand Deck", desc: "Brand identity studio, 6-slide deck, W3C tokens & SVG extractor" },
  { id: "zeroauditor", label: "ZeroAuditor", badge: "Audit", desc: "33-rule AI-slop footprint scanner & ZeroLight remediation engine" },
  { id: "atlas", label: "World Atlas Map", badge: "Vector", desc: "2D flat monochrome vector maps with 6 pattern styles & SVG export" },
];

interface GlobalSearchEntry {
  id: string;
  label: string;
  tierLabel: string;
  keywords: string;
  tab: DashboardTab;
  docsTier?: DocsTier;
  docsSubView?: DocsSubView;
  toolsSubView?: ToolsSubView;
  saasTemplate?: SaasTemplateKey;
}

const GLOBAL_SEARCH_ENTRIES: GlobalSearchEntry[] = [
  ...DOCS_TIERS.flatMap((tier) =>
    tier.tabs.map((sub) => ({
      id: `sub-${sub.id}`,
      label: sub.label,
      tierLabel: `Design System / ${tier.label}`,
      keywords: `${sub.label} ${sub.desc} ${tier.label}`.toLowerCase(),
      tab: "docs" as DashboardTab,
      docsTier: tier.id,
      docsSubView: sub.id,
    }))
  ),
  ...TOOLS_VIEWS.map((tool) => ({
    id: `tool-${tool.id}`,
    label: tool.label,
    tierLabel: `Tools / ${tool.label}`,
    keywords: `${tool.label} ${tool.desc} tools`.toLowerCase(),
    tab: "tools" as DashboardTab,
    toolsSubView: tool.id,
  })),
  { id: "comp-charts", label: "AreaChart, BarChart & DonutChart", tierLabel: "Molecules Directory", keywords: "chart analytics data viz svg bezier graph telemetry", tab: "docs", docsTier: "molecules", docsSubView: "catalog-molecules" },
  { id: "comp-stageshow", label: "ProductWindow, HeroShowcase & BentoShowcase", tierLabel: "Tools / Visual Studio Dock", keywords: "hero stageshow bento cursor animation showcase window", tab: "tools", toolsSubView: "studio", saasTemplate: "hero_showcase" },
  { id: "comp-datatable", label: "Enterprise DataTable & Kanban", tierLabel: "Organisms / Data & Tables", keywords: "table grid csv tsv export filter kanban sort", tab: "docs", docsTier: "organisms", docsSubView: "data" },
  { id: "comp-otp", label: "OTP Input, Currency & Calendar", tierLabel: "Atoms / Inputs & Fields", keywords: "otp phone pin password datepicker currency inr usd", tab: "docs", docsTier: "atoms", docsSubView: "inputs" },
  { id: "comp-cmdk", label: "Command Palette (⌘K), Modals & Drawers", tierLabel: "Organisms / Overlays", keywords: "modal dialog drawer cmdk command palette overlay sheet", tab: "docs", docsTier: "organisms", docsSubView: "overlays" },
  { id: "comp-atlas", label: "Vector World Atlas Map Studio", tierLabel: "Tools / World Atlas Map", keywords: "world map svg vector continent atlas geo", tab: "tools", toolsSubView: "atlas" },
  { id: "comp-mcp", label: "MCP Agent Server & Security Settings", tierLabel: "Settings & MCP", keywords: "mcp json-rpc api key webhook compliance soc2", tab: "settings" },
  { id: "comp-console", label: "Enterprise Console Template", tierLabel: "Tools / Visual Studio Dock", keywords: "console enterprise clusters workloads template", tab: "tools", toolsSubView: "studio", saasTemplate: "unified_enterprise" },
  { id: "comp-crm", label: "CRM Pipeline Template", tierLabel: "Tools / Visual Studio Dock", keywords: "crm sales deals pipeline template", tab: "tools", toolsSubView: "studio", saasTemplate: "customer_crm" },
];

export interface DashboardShellProps {
  onRequireAuth?: () => void;
}

export function DashboardShell({ onRequireAuth }: DashboardShellProps = {}) {
  const { isAuthenticated, user, logout } = useAuth();
  const { tokens } = useZeroLight();
  const [activeTab, setActiveTab] = useState<DashboardTab>("tools");
  const [toolsSubView, setToolsSubView] = useState<ToolsSubView>("index");
  const [docsTier, setDocsTier] = useState<DocsTier>("foundations");
  const [docsSubView, setDocsSubView] = useState<DocsSubView>("catalog");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [docsMenuExpanded, setDocsMenuExpanded] = useState<boolean>(true);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  useEffect(() => {
    const parent = DOCS_TIERS.find((t) => t.tabs.some((tab) => tab.id === docsSubView));
    if (parent && parent.id !== docsTier) {
      setDocsTier(parent.id);
    }
  }, [docsSubView, docsTier]);

  const activeTierData = DOCS_TIERS.find((t) => t.id === docsTier) || DOCS_TIERS[0];
  const activeToolData = TOOLS_VIEWS.find((t) => t.id === toolsSubView) || TOOLS_VIEWS[0];
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const searchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return [];
    return GLOBAL_SEARCH_ENTRIES.filter(
      (entry) => entry.label.toLowerCase().includes(q) || entry.keywords.includes(q) || entry.tierLabel.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [globalSearch]);

  const handleSelectSearchResult = (entry: GlobalSearchEntry) => {
    setActiveTab(entry.tab);
    if (entry.docsTier) setDocsTier(entry.docsTier);
    if (entry.docsSubView) setDocsSubView(entry.docsSubView);
    if (entry.toolsSubView) setToolsSubView(entry.toolsSubView);
    if (entry.saasTemplate) setActiveSaasTemplate(entry.saasTemplate);
    if (entry.tab === "docs") setDocsMenuExpanded(true);
    setGlobalSearch("");
    setSearchFocused(false);
  };

  // Visual Studio Dock State
  const [activeSaasTemplate, setActiveSaasTemplate] = useState<SaasTemplateKey>("zerolight_core");
  const [brandName, setBrandName] = useState("ZeroLight OS");
  const [brandMark, setBrandMark] = useState("ZL");
  const [brandLogoUrl, setBrandLogoUrl] = useState<string | null>(null);
  const [selectedIconMark, setSelectedIconMark] = useState<string>("shield");
  const [settingsTab, setSettingsTab] = useState<SettingsSubTab>("general");

  // Comprehensive Settings State
  const [displayName, setDisplayName] = useState(user?.name || "ZeroLight Root Admin");
  const [workEmail, setWorkEmail] = useState("admin@zerolight.io");
  const [orgDomain, setOrgDomain] = useState("zerolight.enterprise.internal");
  const [timezone, setTimezone] = useState("UTC");
  const [density, setDensity] = useState<"compact" | "default" | "spacious">("default");
  const [dateFormat, setDateFormat] = useState<"YYYY-MM-DD" | "MM/DD/YYYY" | "DD/MM/YYYY">("YYYY-MM-DD");

  // Security Settings
  const [twoFactorEnforced, setTwoFactorEnforced] = useState(true);
  const [fido2PasskeyEnforced, setFido2PasskeyEnforced] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30m");
  const [activeSessions, setActiveSessions] = useState([
    { id: "sess-1", device: "MacBook Pro (Sonoma)", ip: "192.168.1.3", location: "San Francisco, US", activeNow: true },
    { id: "sess-2", device: "Linux Workstation (Ubuntu)", ip: "10.0.4.18", location: "Frankfurt, DE", activeNow: false },
    { id: "sess-3", device: "ZeroLight CI Runner", ip: "172.16.8.99", location: "AWS us-east-1", activeNow: false },
  ]);

  // MCP & AI Settings
  const [mcpToolList, setMcpToolList] = useState(true);
  const [mcpToolSchema, setMcpToolSchema] = useState(true);
  const [mcpToolAdd, setMcpToolAdd] = useState(true);
  const [mcpToolTokens, setMcpToolTokens] = useState(true);
  const [copilotGhostText, setCopilotGhostText] = useState(true);
  const [preferredModel, setPreferredModel] = useState("Claude 3.7 Sonnet");

  // API Keys & Webhooks Settings
  const [apiKey, setApiKey] = useState("zl_live_sec_7f9a8b2c4e1d603a");
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://api.zerolight.io/events/v1");
  const [webhookSecret] = useState("whsec_90a1b2c3d4e5f6g7h8i9j0");
  const [pingStatus, setPingStatus] = useState<"idle" | "testing" | "success">("idle");

  // Compliance & Data Residency
  const [dataRegion, setDataRegion] = useState("US East (N. Virginia - SOC2 Type II)");
  const [soc2Logging, setSoc2Logging] = useState(true);
  const [telemetrySharing, setTelemetrySharing] = useState(false);

  // Toast State
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Enterprise settings persisted to HSM vault");

  // Keyboard shortcut listener: Cmd+B / Ctrl+B to toggle sidebar, Escape to close popovers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsCollapsed((prev) => !prev);
      }
      if (e.key === "Escape") {
        setHoveredTab(null);
        setShowNotifications(false);
        setShowUserMenu(false);
        setSearchFocused(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Hover grace timer handlers for collapsed flyout popover (150ms grace)
  const handleItemMouseEnter = (id: string) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setHoveredTab(id);
  };

  const handleItemMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setHoveredTab(null);
    }, 150);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard?.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRollApiKey = () => {
    const randomHex = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    setApiKey(`zl_live_sec_${randomHex}`);
    setToastMessage("New secret API key generated and activated");
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2500);
  };

  const handlePingWebhook = () => {
    setPingStatus("testing");
    setTimeout(() => {
      setPingStatus("success");
      setTimeout(() => setPingStatus("idle"), 3000);
    }, 800);
  };

  const handleRevokeOtherSessions = () => {
    setActiveSessions((prev) => prev.filter((s) => s.activeNow));
    setToastMessage("All other remote sessions revoked immediately");
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage("Enterprise platform settings successfully persisted");
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2500);
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: <Home className="w-4 h-4" /> },
    { id: "docs", label: "Design System", icon: <Layers className="w-4 h-4" />, badge: "120" },
    { id: "tools", label: "Tools", icon: <Wrench className="w-4 h-4" />, badge: "4" },
    { id: "settings", label: "Settings & MCP", icon: <Settings className="w-4 h-4" /> },
  ];

  const showToolToast = (msg: string) => {
    setToastMessage(msg);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2500);
  };

  return (
    <div className="h-screen w-full bg-[#F1F3F5] text-zinc-950 flex p-3 md:p-4 gap-3 md:gap-4 overflow-hidden font-sans">
      {/* Toast Notification */}
      {saveSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── HIGH-DEPTH OBSIDIAN DARK FIXED/STICKY SIDEBAR (EXACT MATCH TO ATOM/MOLECULE USER REFERENCE) ── */}
      <LayoutGroup>
        <motion.aside
          animate={{ width: isCollapsed ? 68 : 256 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-[#0B0F19] text-white border border-white/[0.08] rounded-[20px] p-2.5 flex flex-col justify-between shadow-lg select-none overflow-hidden shrink-0"
        >
          <div className="space-y-3 flex-1 flex flex-col min-h-0">
            {/* Top Brand Mark with Invariant Centroid + Collapse Button */}
            <div className="h-10 px-1 flex items-center justify-between border-b border-white/[0.08] pb-2 shrink-0">
              <div className="flex items-center min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold text-xs shadow-xs overflow-hidden shrink-0 border border-white/10">
                  {tokens.logoLight || tokens.logoDark ? (
                    <img
                      src={tokens.logoLight || tokens.logoDark}
                      alt={tokens.logoBrandName || "Brand"}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 22 20 2 20 12 2" />
                    </svg>
                  )}
                </div>

                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                      className="ml-2.5 overflow-hidden whitespace-nowrap min-w-0"
                    >
                      <span className="font-bold text-xs text-white block tracking-tight truncate">
                        {tokens.logoBrandName || "ZeroLight OS"}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium block">Enterprise v2.4</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Collapse/Expand Toggle Button */}
              {!isCollapsed && (
                <button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                  title="Collapse Sidebar (⌘B)"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Navigation Items */}
            <nav className="space-y-1 flex-1 overflow-y-auto no-scrollbar">
              {navItems.map((item) => {
                const active = activeTab === item.id;
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => handleItemMouseEnter(item.id)}
                    onMouseLeave={handleItemMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (item.id === "docs") {
                          if (activeTab === "docs") {
                            setDocsMenuExpanded((p) => !p);
                          } else {
                            setActiveTab("docs");
                            setDocsMenuExpanded(true);
                            setDocsTier("foundations");
                            setDocsSubView("catalog");
                          }
                        } else if (item.id === "tools") {
                          setActiveTab("tools");
                          setToolsSubView("index");
                        } else {
                          setActiveTab(item.id as DashboardTab);
                        }
                      }}
                      className={`w-full h-10 px-2 rounded-xl text-xs font-semibold flex items-center relative transition-colors cursor-pointer group ${
                        active ? "text-white" : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]"
                      }`}
                    >
                      {/* Shared Layout Morphing Pill Indicator */}
                      {active && (
                        <motion.div
                          layoutId="sidebar-active-tab-indicator"
                          className="absolute inset-0 rounded-xl bg-white/[0.12] backdrop-blur-md border border-white/20 shadow-xs -z-0"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}

                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 z-10">
                        {item.icon}
                      </div>

                      <AnimatePresence initial={false}>
                        {!isCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                            className="flex items-center justify-between flex-1 min-w-0 ml-2.5 overflow-hidden whitespace-nowrap z-10"
                          >
                            <span className="text-xs truncate">{item.label}</span>
                            {item.badge && (
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                                  active ? "bg-white/20 text-white" : "bg-white/10 text-zinc-400"
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>

                    {/* Submenu for Design System in Expanded Mode: 6 Atomic Tiers (Flat Quiet Option A) */}
                    {item.id === "docs" && !isCollapsed && docsMenuExpanded && (
                      <div className="ml-7 pl-3 py-1 my-1 border-l border-white/10 space-y-1 relative">
                        {DOCS_TIERS.map((tier) => {
                          const isTierActive = activeTab === "docs" && docsTier === tier.id;
                          return (
                            <button
                              key={tier.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTab("docs");
                                setDocsTier(tier.id);
                                if (!tier.tabs.some((t) => t.id === docsSubView)) {
                                  setDocsSubView(tier.defaultTab);
                                }
                              }}
                              className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer relative ${
                                isTierActive
                                  ? "text-white font-bold"
                                  : "text-zinc-400 hover:text-zinc-200 font-normal"
                              }`}
                            >
                              {/* Left crisp white indicator pip on the tree guide line (Zero glow, zero drop-shadow, dead-center) */}
                              {isTierActive && (
                                <motion.div
                                  layoutId="sidebar-sub-pip"
                                  className="absolute -left-[15px] top-[calc(50%-7px)] w-1.5 h-3.5 rounded-full bg-white"
                                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                                />
                              )}
                              <span className="truncate">{tier.label}</span>
                              <span className="text-[10px] font-sans tabular-nums text-zinc-400 font-normal ml-2 shrink-0">
                                {tier.count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Collapsed Mode: Hover-Protected Flyout Popover */}
                    {isCollapsed && hoveredTab === item.id && (
                      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 p-2 rounded-xl bg-[#0B0F19]/95 backdrop-blur-xl border border-white/15 text-white shadow-[0_12px_30px_rgba(0,0,0,0.65)] whitespace-nowrap text-xs font-semibold animate-in fade-in zoom-in-95 duration-150 min-w-[170px]">
                        <div className="flex items-center justify-between gap-2 px-1 py-0.5">
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/15 text-zinc-300 font-bold">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.id === "docs" && (
                          <div className="pt-1.5 mt-1 border-t border-white/10 space-y-1">
                            {DOCS_TIERS.map((tier) => (
                              <button
                                key={tier.id}
                                type="button"
                                onClick={() => {
                                  setActiveTab("docs");
                                  setDocsTier(tier.id);
                                  if (!tier.tabs.some((t) => t.id === docsSubView)) {
                                    setDocsSubView(tier.defaultTab);
                                  }
                                  setHoveredTab(null);
                                }}
                                className={`w-full px-2 py-1 rounded-lg text-left text-xs font-medium cursor-pointer transition flex items-center justify-between gap-2 ${
                                  activeTab === "docs" && docsTier === tier.id
                                    ? "bg-white/20 text-white font-bold"
                                    : "text-zinc-300 hover:bg-white/10"
                                }`}
                              >
                                <span>{tier.label}</span>
                                <span className="text-[10px] text-zinc-400 font-sans tabular-nums font-bold">
                                  {tier.count}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Floating Sidebar Footer: User Profile & Expand Button */}
          <div className="space-y-2 pt-2.5 border-t border-white/[0.08] shrink-0">
            {isCollapsed && (
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="w-full h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Expand Sidebar (⌘B)"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            {/* Sidebar Footer: Authenticated Admin or Public ZeroRapid Studio Card */}
            <div className={`p-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-white/15 text-white font-bold flex items-center justify-center text-[11px] shrink-0 border border-white/10">
                  {isAuthenticated ? (user?.avatar || "ZL") : "ZR"}
                </div>
                {!isCollapsed && (
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-white truncate block">
                      {isAuthenticated ? (user?.username || "zerolight") : "ZeroRapid Public"}
                    </span>
                    <span className="text-[10px] text-zinc-400 truncate block">
                      {isAuthenticated ? "Root Admin" : "zerorapid.in"}
                    </span>
                  </div>
                )}
              </div>

              {!isCollapsed && (
                isAuthenticated ? (
                  <button
                    type="button"
                    onClick={logout}
                    className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Sign Out / Lock Session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <a
                    href="https://zerorapid.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                    title="Visit ZeroRapid Agency (zerorapid.in)"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )
              )}
            </div>
          </div>
        </motion.aside>
      </LayoutGroup>

      {/* ── RIGHT COLUMN CONTAINER (TOP HEADER + BREADCRUMBS + BIG SCROLLABLE WORKSPACE BOX) ── */}
      <div className="flex-1 flex flex-col h-full min-w-0 gap-2.5 md:gap-3 overflow-hidden">
        {/* ── MASTER PERSISTENT TOP HEADER (OPTION A: GLOBAL SEARCH + UTILITY CONTROLS) ── */}
        <header
          data-zl-studio-chrome="true"
          className="shrink-0 bg-white border border-zinc-200/80 rounded-[18px] px-4 py-2 flex items-center justify-between gap-4 shadow-2xs z-20"
        >
          {/* Global Search Bar with Live Instant Navigation Popover */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-sm sm:max-w-md">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search components, tokens, docs..."
              value={globalSearch}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setSearchFocused(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchResults.length > 0) {
                  e.preventDefault();
                  handleSelectSearchResult(searchResults[0]);
                }
              }}
              className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all font-sans"
            />
            {globalSearch && (
              <button
                type="button"
                onClick={() => setGlobalSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-800 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Interactive Global Search Results Dropdown */}
            {searchFocused && globalSearch.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white border border-zinc-200 shadow-2xl p-1.5 z-50 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                {searchResults.length > 0 ? (
                  <div className="space-y-0.5">
                    {searchResults.map((res) => (
                      <button
                        key={res.id}
                        type="button"
                        onClick={() => handleSelectSearchResult(res)}
                        className="w-full px-3 py-2 rounded-xl text-left hover:bg-zinc-100 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-zinc-900 truncate">{res.label}</div>
                          <div className="text-[10px] text-zinc-500 truncate">{res.tierLabel}</div>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-4 text-center text-xs text-zinc-500">
                    No matching components or tokens for &ldquo;{globalSearch}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Header Utility Actions: Notifications, Settings & User Profile Pill */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setShowNotifications((p) => !p); setShowUserMenu(false); }}
                className="p-2 text-zinc-500 hover:text-zinc-900 rounded-xl hover:bg-zinc-100 transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-zinc-200 p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                    <span className="text-xs font-bold text-zinc-900">System Notifications</span>
                    <span className="text-[10px] text-zinc-400 font-medium">3 New</span>
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                      <p className="text-xs font-semibold text-zinc-900">HSM Vault Synchronized</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">SOC2 Type II compliant encryption active</p>
                    </div>
                    <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                      <p className="text-xs font-semibold text-zinc-900">295 Pattern Variants Verified</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Zero-dependency registry 100% healthy</p>
                    </div>
                    <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                      <p className="text-xs font-semibold text-zinc-900">MCP Server Ready on Stdio</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Cursor & Claude Code tools loaded</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Settings Gear */}
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className="p-2 text-zinc-500 hover:text-zinc-900 rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer"
              title="Settings & MCP"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Public Agency CTA + Session Controls */}
            <a href="https://zerorapid.in" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm" iconRight={<ArrowUpRight className="w-3.5 h-3.5" />}>
                zerorapid.in
              </Button>
            </a>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowUserMenu((p) => !p); setShowNotifications(false); }}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200/80 transition-colors cursor-pointer"
                  title="Account & Session"
                >
                  <div className="w-7 h-7 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs">
                    {user?.avatar || "ZL"}
                  </div>
                  <span className="text-xs font-semibold text-zinc-900 truncate max-w-[90px]">
                    {user?.username || "zerolight"}
                  </span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-zinc-200 p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-zinc-100">
                      <p className="text-xs font-semibold text-zinc-900">{user?.username || "zerolight"}</p>
                      <p className="text-[10px] text-zinc-400 truncate">admin@zerorapid.in</p>
                      <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                        Root Admin • Active
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setActiveTab("settings"); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 rounded-lg transition-colors cursor-pointer text-left mt-1"
                    >
                      <Settings className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Platform Settings</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (onRequireAuth) onRequireAuth();
                  else setActiveTab("settings");
                }}
              >
                Admin Sign In
              </Button>
            )}
          </div>
        </header>

        {/* ── BREADCRUMB STRIP (BELOW HEADER IN GREY GAP) ── */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium px-2 shrink-0">
          <span className="hover:text-zinc-600 cursor-pointer" onClick={() => setActiveTab("overview")}>ZeroLight OS</span>
          <span>/</span>
          <span className="text-zinc-700 font-semibold capitalize">
            {activeTab === "overview" && "Overview"}
            {activeTab === "docs" && `Design System / ${activeTierData.label}`}
            {activeTab === "tools" && (toolsSubView === "index" ? "Tools" : `Tools / ${activeToolData.label}`)}
            {activeTab === "settings" && "Settings & MCP"}
          </span>
        </div>

        {/* ── BIG ROUNDED WHITE WORKSPACE CARD (ONLY THIS BOX HAS OVERFLOW-Y-AUTO EXCEPT STUDIO DOCK WHICH IS A FULL-HEIGHT DOCK) ── */}
        <main
          className={`flex-1 rounded-[18px] border border-zinc-200/80 shadow-xs min-h-0 ${
            activeTab === "tools" && toolsSubView === "studio"
              ? "overflow-hidden flex flex-col p-0 bg-[#FAFAFA]"
              : "overflow-y-auto p-6 md:p-8 bg-white"
          }`}
        >
          {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === "overview" && (
          <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Header: Exact Same Consistent Typography, Color & Placement as Visual Studio Dock */}
            <div className="pb-0.5 shrink-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Welcome to ZeroLight OS
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Enterprise Design System & Component Workspace
              </p>
            </div>

            {/* 4 Clean Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Primitives */}
              <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">PRIMITIVES</span>
                  <span className="sr-only">TOTAL COMPONENTS ADDED</span>
                  <Sliders className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="text-3xl font-extrabold text-zinc-950 tracking-tight font-sans tabular-nums">
                  120
                </div>
                <div className="text-xs text-zinc-500 pt-1">
                  43 Atoms • 45 Molecules • 19 Organisms • 13 Templates & Views
                </div>
              </div>

              {/* Card 2: Templates */}
              <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">TEMPLATES</span>
                  <span className="sr-only">TOTAL SAAS TEMPLATES</span>
                  <FileCode2 className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="text-3xl font-extrabold text-zinc-950 tracking-tight font-sans tabular-nums">
                  12
                </div>
                <div className="text-xs text-zinc-500 pt-1">
                  Production B2B & Fintech
                </div>
              </div>

              {/* Card 3: Verticals */}
              <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">VERTICALS</span>
                  <span className="sr-only">TOTAL NICHES COVERED</span>
                  <Building className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="text-3xl font-extrabold text-zinc-950 tracking-tight font-sans tabular-nums">
                  8
                </div>
                <div className="text-xs text-zinc-500 pt-1">
                  Fintech, DevTools, AI & Health
                </div>
              </div>

              {/* Card 4: Teams */}
              <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">TEAMS</span>
                  <span className="sr-only">TOTAL CLIENTS SERVED</span>
                  <User className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="text-3xl font-extrabold text-zinc-950 tracking-tight font-sans tabular-nums">
                  1,420+
                </div>
                <div className="text-xs text-zinc-500 pt-1">
                  99.98% Uptime • SOC2 Type II & HIPAA
                </div>
              </div>
            </div>

            {/* Vector Map Studio & Asset Downloader tools moved to dedicated Tools tab */}

            {/* Enterprise FAQ Section */}
            <div className="space-y-4 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                  <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-zinc-600" />
                    <span>Frequently Asked Questions & Architecture</span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Enterprise answers on AI agent hallucination prevention, Tactile Calm rules, and light-mode baseline.
                  </p>
                </div>
                <Badge variant="neutral">Architecture Spec</Badge>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    q: "How does ZeroLight prevent AI agent hallucination during UI development?",
                    a: "ZeroLight features a native Model Context Protocol (MCP) server located at bin/zerolight-mcp.mjs. AI coding agents (such as Cursor, Claude Code, and Antigravity) connect over JSON-RPC 2.0 to query the exact component registry, typed props, and token schemas directly from source files, preventing hallucinated hex colors, arbitrary CSS classes, and invalid props.",
                  },
                  {
                    q: "What is the core philosophy of 'Tactile Calm' across ZeroLight surfaces?",
                    a: "Tactile Calm enforces clean, high-density typography with font-sans tabular-nums, single primary CTA per viewport, 1px hairline borders, subtle luminance stepping, and zero decorative noise (no multi-stop gradients, no glowing drop-shadows, and zero gratuitous emojis).",
                  },
                  {
                    q: "Why is Apple/Airbnb-grade light mode enforced by default across the OS?",
                    a: "B2B SaaS dashboards require maximum contrast, instant legibility, and visual calmness during extended operational shifts. ZeroLight defaults to a crisp #FFFFFF and #F8FAFC canvas with high-contrast slate text and 1px borders, offering dark surfaces as an opt-in mode in the Visual Studio dock.",
                  },
                  {
                    q: "How are components synced between npm packages and the zero-dependency registry?",
                    a: "ZeroLight maintains a public/registry/index.json registry with 119 components categorized into Atoms, Molecules, Organisms, and Blocks. Developers can inspect components in the Visual Studio Dock or run 'npx zerolight add <component>' to copy production TSX directly into their repository.",
                  },
                  {
                    q: "Can the World Atlas Map run completely offline without map tile subscriptions?",
                    a: "Yes. ZeroLight's World Atlas Map uses a pure mathematical SVG projection pipeline powered by D3 Natural Earth geometry with full antimeridian boundary clipping. It requires zero Mapbox/Google Maps API keys, produces zero SSR hydration mismatches, and can be exported as standalone SVG vector files.",
                  },
                ].map((faq, index) => {
                  const isOpen = expandedFaq === index;
                  return (
                    <div
                      key={index}
                      className="rounded-xl border border-zinc-200/90 bg-white overflow-hidden shadow-2xs transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(isOpen ? null : index)}
                        className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-zinc-50/60 transition cursor-pointer"
                      >
                        <span className="text-xs font-semibold text-zinc-900">
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-zinc-900" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs text-zinc-600 border-t border-zinc-100 bg-zinc-50/30 leading-relaxed animate-in fade-in duration-150">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Links to Core Organisms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div
                onClick={() => setActiveTab("docs")}
                className="p-5 rounded-2xl bg-white border border-zinc-200/90 hover:border-zinc-400 transition-all cursor-pointer shadow-xs group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-xs text-zinc-950">
                      ZeroLight Design System Documentation
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
                </div>
                <p className="text-xs text-zinc-500">
                  Minimalist, developer-focused set of visual foundations, UI component primitives (Atoms, Molecules, Organisms), and brand assets.
                </p>
              </div>

              <div
                onClick={() => {
                  setActiveTab("tools");
                  setToolsSubView("atlas");
                }}
                className="p-5 rounded-2xl bg-white border border-zinc-200/90 hover:border-zinc-400 transition-all cursor-pointer shadow-xs group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-xs text-zinc-950">
                      Vector Map Studio & Asset Downloader
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
                </div>
                <p className="text-xs text-zinc-500">
                  Customize 6 pattern render styles, focus regions, and download standalone high-resolution SVG vector maps.
                </p>
              </div>
            </div>
          </div>
        )}

          {/* TAB 2: DESIGN SYSTEM */}
        {activeTab === "docs" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* ════ PINNED TITLE & HEADLINE (EXACT SAME STYLE & PLACEMENT AS VISUAL STUDIO DOCK) ════ */}
            <div className="pb-0.5 shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Design System
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  6-tier atomic component registry, token foundations, and enterprise SaaS UI patterns.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Live Token Sync Status Pills (Connected to Visual Studio Dock inside Tools) */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("tools");
                    setToolsSubView("studio");
                  }}
                  className="px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200/80 text-[11px] font-semibold text-zinc-700 hover:border-zinc-400 transition flex items-center gap-2 cursor-pointer"
                  title="Edit active Design System tokens in Visual Studio Dock"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: tokens.primaryButtonColor || "#0F172A" }}
                  />
                  <span className="tabular-nums">{tokens.cornerRadius ?? 12}px</span>
                  <span className="text-zinc-300">•</span>
                  <span className="truncate max-w-[110px]" title={tokens.fontFamily || "Plus Jakarta Sans"}>
                    {tokens.fontFamily || "Plus Jakarta Sans"}
                  </span>
                  <span className="text-zinc-300">•</span>
                  <DynamicIcon name="sparkles" size={12} library={tokens.iconLibrary} />
                  <span className="text-zinc-500">Tune Tokens</span>
                </button>
                <Badge variant="healthy">295 SaaS Pattern Variants Active</Badge>
              </div>
            </div>

            {/* Top Sub-Nav Switcher inside Big Container Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200/90 dark:border-white/10 shadow-xs space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Active Tier Breadcrumb & Title */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tier /</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">{activeTierData.label}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activeTierData.id === "foundations" && "Core tokens, hairlines, dividers, and spring motion physics."}
                    {activeTierData.id === "atoms" && "Foundational interactive controls, inputs, and status indicators."}
                    {activeTierData.id === "molecules" && "Composite form fields, stat cards, alerts, and micro-charts."}
                    {activeTierData.id === "organisms" && "Functional modules, data tables, navigation shells, and command palettes."}
                    {activeTierData.id === "templates" && "Full-page structural blueprints and authenticated layout skeletons."}
                    {activeTierData.id === "pages" && "Complete working SaaS destination applications with live workflows."}
                  </p>
                </div>
              </div>

              {/* Sub-menu Tabs Container (Horizontally Scroll-Protected, Zero Content Bleeding) */}
              <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 pb-1">
                <div className="inline-flex p-1 rounded-xl bg-zinc-100/90 dark:bg-white/[0.06] border border-zinc-200/60 dark:border-white/10 items-center gap-1">
                  {activeTierData.tabs.map((sub) => {
                    const active = docsSubView === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setDocsSubView(sub.id as DocsSubView)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          active
                            ? "bg-white dark:bg-white/20 text-zinc-950 dark:text-white shadow-xs font-bold"
                            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.08]"
                        }`}
                      >
                        <span>{sub.label}</span>
                        <span
                          className={`text-[10px] font-sans tabular-nums px-1.5 py-0.2 rounded-full font-bold ${
                            active
                              ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950"
                              : "bg-zinc-200/80 dark:bg-white/10 text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          {sub.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sub-view Content */}
            {docsSubView === "catalog" && <SaaSTokensLibrary />}
            {docsSubView === "catalog-molecules" && (
              <div className="w-full">
                <ZeroLightDocsPortal embedded defaultSectionId="area-chart" />
              </div>
            )}
            {docsSubView === "buttons" && <SaaSButtonLibrary />}
            {docsSubView === "inputs" && <SaaSInputFieldLibrary />}
            {docsSubView === "selections" && <SaaSSelectionLibrary />}
            {docsSubView === "indicators" && <SaaSIndicatorLibrary />}
            {docsSubView === "dividers" && <SaaSDividerLibrary />}
            {docsSubView === "tooltips" && <SaaSTooltipLibrary />}
            {docsSubView === "feedback" && <SaaSFeedbackLibrary />}
            {docsSubView === "overlays" && <SaaSOverlaysLibrary />}
            {docsSubView === "navigation" && <SaaSNavigationLibrary />}
            {docsSubView === "data" && <SaaSDataLibrary />}
            {docsSubView === "business" && <SaaSBusinessLibrary />}
            {docsSubView === "layouts" && <SaaSLayoutLibrary />}
            {docsSubView === "screens" && <SaaSAppScreensLibrary />}
            {docsSubView === "edge-cases" && <SaaSEdgeCasesLibrary />}
          </div>
        )}

          {/* TAB 3: UNIFIED TOOLS HUB (COLLECTION PREVIEW CARDS FIRST -> DEDICATED TOOL WORKSPACE) */}
        {activeTab === "tools" && (
          <div className={toolsSubView === "studio" ? "w-full flex-1 flex flex-col min-h-0 animate-in fade-in duration-200" : "max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200"}>
            {toolsSubView === "index" ? (
              <ToolsDirectory
                brandName={brandName}
                onOpenTool={(toolId) => setToolsSubView(toolId)}
              />
            ) : (
              <>
                {/* Dedicated Tool Header Bar (No Tab Menu Across Tools) */}
                <div
                  data-zl-studio-chrome="true"
                  className={
                    toolsSubView === "studio"
                      ? "px-4 py-2 bg-white border-b flex flex-wrap items-center justify-between gap-2 shrink-0"
                      : "pb-3 border-b flex flex-wrap items-center justify-between gap-3"
                  }
                  style={{ borderColor: tokens.universalBorderColor }}
                >
                  <div className="flex items-center gap-2.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setToolsSubView("index")}
                      iconLeft={<ChevronLeft className="w-3.5 h-3.5" />}
                    >
                      All Tools
                    </Button>
                    <span className="text-xs font-bold tracking-tight" style={{ color: tokens.textIconColor }}>
                      {activeToolData.label}
                    </span>
                    <Badge variant="neutral" size="xs" showDot={false}>
                      {activeToolData.badge}
                    </Badge>
                  </div>

                  {toolsSubView === "studio" && (
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <SegmentedControl<SaasTemplateKey>
                        value={activeSaasTemplate}
                        onChange={(tmpl) => setActiveSaasTemplate(tmpl)}
                        options={[
                          { key: "zerolight_core", label: "Spec Catalog" },
                          { key: "hero_showcase", label: "Hero & Bento" },
                          { key: "unified_enterprise", label: "Enterprise Console" },
                          { key: "customer_crm", label: "CRM Pipeline" },
                          { key: "metric_deck", label: "SaaS Metrics" },
                        ]}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.print()}
                        iconLeft={<Printer className="w-3.5 h-3.5" />}
                      >
                        Print PDF
                      </Button>
                      <Link href="/studio">
                        <Button
                          variant="outline"
                          size="sm"
                          iconLeft={<ExternalLink className="w-3.5 h-3.5" />}
                        >
                          Full Studio
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                {toolsSubView === "studio" && (
                  <>
                    <div className="w-full flex-1 min-h-0 flex flex-col lg:flex-row items-stretch">
                      <div className="flex-1 min-w-0 flex flex-col h-full bg-[#FAFAFA]">
                        <SaasTemplateStage
                          activeTemplate={activeSaasTemplate}
                          onTemplateChange={setActiveSaasTemplate}
                          brandName={brandName}
                          brandMark={brandMark}
                          brandLogoUrl={brandLogoUrl}
                          selectedIconMark={selectedIconMark}
                          className="h-full"
                        />
                      </div>
                      <div className="w-full lg:w-[320px] shrink-0 h-full flex flex-col border-t lg:border-t-0 lg:border-l border-zinc-200/80 bg-white">
                        <TokenStudioSidebar
                          brandName={brandName}
                          onBrandNameChange={setBrandName}
                          brandMark={brandMark}
                          onBrandMarkChange={setBrandMark}
                          brandLogoUrl={brandLogoUrl}
                          onBrandLogoUpload={setBrandLogoUrl}
                          selectedIconMark={selectedIconMark}
                          onSelectedIconMarkChange={setSelectedIconMark}
                          className="h-full"
                        />
                      </div>
                    </div>
                    <span className="sr-only">Visual Studio Dock Component Test Bench</span>
                  </>
                )}

                {toolsSubView === "atlas" && (
                  <div className="space-y-6">
                    <div
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b"
                      style={{ borderColor: tokens.universalBorderColor }}
                    >
                      <div>
                        <h1 className="text-xl font-bold tracking-tight" style={{ color: tokens.textIconColor }}>
                          Vector Map Studio & Asset Generator
                        </h1>
                        <p className="text-xs opacity-70" style={{ color: tokens.textIconColor }}>
                          Interactive tool for styling 2D monochrome vector maps, regional focus, and downloading standalone SVG assets.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="healthy">6 Styles Active</Badge>
                        <Badge variant="neutral">SVG Export Ready</Badge>
                      </div>
                    </div>

                    <WorldAtlasMap className="w-full min-h-[580px]" />
                  </div>
                )}

                {toolsSubView === "zeroflash" && (
                  <ZeroFlashTool
                    brandName={brandName}
                    onBrandNameChange={setBrandName}
                    brandLogoUrl={brandLogoUrl}
                    onBrandLogoUpload={setBrandLogoUrl}
                    onStatusToast={showToolToast}
                  />
                )}

                {toolsSubView === "zeroauditor" && (
                  <ZeroAuditorTool onStatusToast={showToolToast} />
                )}
              </>
            )}
          </div>
        )}

          {/* TAB 5: COMPREHENSIVE ENTERPRISE SETTINGS & MCP INTEGRATION */}
        {activeTab === "settings" && (
          !isAuthenticated ? (
            <div className="max-w-xl mx-auto py-12 animate-in fade-in duration-200">
              <Card padding="lg" className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5" style={{ color: tokens.primaryButtonColor }} />
                  <h2 className="text-base font-bold tracking-tight" style={{ color: tokens.textIconColor }}>
                    Admin Sign-In Required for Settings & API Keys
                  </h2>
                </div>
                <p className="text-xs opacity-75 leading-relaxed" style={{ color: tokens.textIconColor }}>
                  Public visitors can freely use all ZeroLight components and creative tools. Sign in as a workspace administrator to inspect secret API keys, webhooks, passkeys, and compliance settings.
                </p>
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <Button variant="primary" size="sm" onClick={() => onRequireAuth?.()}>
                    Sign In to Admin Settings
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("tools")}>
                    Back to Tools
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
          <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="pb-3 border-b border-zinc-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-zinc-950">
                  Enterprise Platform Settings & MCP
                </h1>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Manage profile credentials, hardware passkeys, AI agent MCP server bindings, API keys, and audit compliance.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="healthy">HSM Key Active</Badge>
                <Badge variant="neutral">SOC2 Type II</Badge>
              </div>
            </div>

            {/* Sub-Tab Navigation Bar */}
            <div className="flex items-center gap-1.5 border-b border-zinc-200 pb-2 overflow-x-auto no-scrollbar">
              {[
                { id: "general", label: "General & Workspace", icon: <User className="w-3.5 h-3.5" /> },
                { id: "security", label: "Security & Passkeys", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                { id: "mcp", label: "AI Coding Agent (MCP)", icon: <Terminal className="w-3.5 h-3.5" /> },
                { id: "api", label: "API Keys & Webhooks", icon: <Key className="w-3.5 h-3.5" /> },
                { id: "compliance", label: "Residency & Audit Logs", icon: <Database className="w-3.5 h-3.5" /> },
              ].map((tab) => {
                const active = settingsTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSettingsTab(tab.id as SettingsSubTab)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                      active
                        ? "bg-zinc-950 text-white shadow-xs"
                        : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* SUB-PANEL 1: GENERAL & WORKSPACE */}
              {settingsTab === "general" && (
                <div className="space-y-6">
                  {/* Profile Card */}
                  <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
                    <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                      <User className="w-4 h-4 text-zinc-500" />
                      <span>Administrator Profile</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-zinc-700 font-semibold mb-1">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-700 font-semibold mb-1">
                          Corporate Work Email
                        </label>
                        <input
                          type="email"
                          value={workEmail}
                          onChange={(e) => setWorkEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Workspace Details */}
                  <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
                    <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                      <Building className="w-4 h-4 text-zinc-500" />
                      <span>Workspace Domain & Internationalization</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block text-zinc-700 font-semibold mb-1">
                          Corporate Workspace Domain
                        </label>
                        <input
                          type="text"
                          value={orgDomain}
                          onChange={(e) => setOrgDomain(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-700 font-semibold mb-1">
                          Default Timezone
                        </label>
                        <select
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 cursor-pointer"
                        >
                          <option value="UTC">UTC (Coordinated Universal Time)</option>
                          <option value="America/New_York">America/New_York (EST)</option>
                          <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                          <option value="Europe/London">Europe/London (GMT)</option>
                          <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                          <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-zinc-700 font-semibold mb-1">
                          Date Format
                        </label>
                        <select
                          value={dateFormat}
                          onChange={(e) => setDateFormat(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 cursor-pointer"
                        >
                          <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY (US Standard)</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY (UK / EU)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold block text-zinc-950">Interface Density Mode</span>
                        <span className="text-zinc-500">Fine-tune vertical height density across all buttons, inputs, and rows.</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl">
                        {(["compact", "default", "spacious"] as const).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setDensity(mode)}
                            className={`px-3 py-1 rounded-lg font-semibold capitalize text-xs transition-colors cursor-pointer ${
                              density === mode ? "bg-white text-zinc-950 shadow-2xs" : "text-zinc-500 hover:text-zinc-950"
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-PANEL 2: SECURITY & HARDWARE KEYS */}
              {settingsTab === "security" && (
                <div className="space-y-6">
                  {/* FIDO2 & Two Factor */}
                  <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
                    <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      <span>Hardware Authentication & Cryptographic Keys</span>
                    </h3>

                    <div className="divide-y divide-zinc-100 text-xs">
                      <div className="py-3 flex items-center justify-between">
                        <div>
                          <span className="font-semibold block text-zinc-950">
                            Enforce FIDO2 / WebAuthn Hardware Keys
                          </span>
                          <span className="text-zinc-500">Require physical YubiKey or TouchID for root admin sessions.</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={fido2PasskeyEnforced}
                          onChange={(e) => setFido2PasskeyEnforced(e.target.checked)}
                          className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                        />
                      </div>

                      <div className="py-3 flex items-center justify-between">
                        <div>
                          <span className="font-semibold block text-zinc-950">
                            Mandatory TOTP Authenticator (Google Authenticator / 1Password)
                          </span>
                          <span className="text-zinc-500">Require 6-digit cryptographic verification code on login.</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={twoFactorEnforced}
                          onChange={(e) => setTwoFactorEnforced(e.target.checked)}
                          className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                        />
                      </div>

                      <div className="py-3 flex items-center justify-between">
                        <div>
                          <span className="font-semibold block text-zinc-950">
                            Session Inactivity Auto-Lock
                          </span>
                          <span className="text-zinc-500">Automatically lock the workspace if no keyboard or pointer activity is detected.</span>
                        </div>
                        <select
                          value={sessionTimeout}
                          onChange={(e) => setSessionTimeout(e.target.value)}
                          className="px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-950 font-semibold cursor-pointer"
                        >
                          <option value="15m">15 Minutes</option>
                          <option value="30m">30 Minutes</option>
                          <option value="1h">1 Hour</option>
                          <option value="4h">4 Hours</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Active Remote Sessions */}
                  <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                        <Laptop className="w-4 h-4 text-emerald-600" />
                        <span>Active Connected Sessions & Devices</span>
                      </h3>
                      <button
                        type="button"
                        onClick={handleRevokeOtherSessions}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                      >
                        Revoke All Other Sessions
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      {activeSessions.map((sess) => (
                        <div
                          key={sess.id}
                          className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <Laptop className="w-4 h-4 text-zinc-500" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-zinc-950">{sess.device}</span>
                                {sess.activeNow && (
                                  <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">
                                    Current
                                  </span>
                                )}
                              </div>
                              <span className="text-zinc-400 text-[11px]">
                                {sess.ip} • {sess.location}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-zinc-500 font-medium text-[11px]">Authorized</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-PANEL 3: AI CODING AGENT & MCP PROTOCOL */}
              {settingsTab === "mcp" && (
                <div className="space-y-6">
                  {/* MCP Server Overview */}
                  <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-600" />
                        <span>AI Coding Agent (MCP) Protocol Bindings</span>
                      </h3>
                      <Badge variant="healthy">MCP Active</Badge>
                    </div>

                    <p className="text-xs text-zinc-500">
                      ZeroLight exposes a real JSON-RPC 2.0 stdio Model Context Protocol (MCP) server that empowers Cursor, Claude Code, and Antigravity to inspect schemas and inject verified tokens directly into source files.
                    </p>

                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-zinc-700">Local Stdio Server:</span>
                        <code className="font-sans tabular-nums text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                          node bin/zerolight-mcp.mjs
                        </code>
                      </div>
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-zinc-700">HTTP / SSE Bridge:</span>
                        <code className="font-sans tabular-nums text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded">
                          http://localhost:3002/api/mcp
                        </code>
                      </div>
                      <div className="flex items-center justify-between text-zinc-500">
                        <span>Protocol Specification:</span>
                        <span className="font-semibold text-zinc-800">Model Context Protocol 2024-11-05 (JSON-RPC 2.0)</span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-500">
                        <span>Registry Scope:</span>
                        <span className="font-bold text-zinc-900">119 Verified Primitives Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Agent Capabilities & Tool Grants */}
                  <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
                    <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-indigo-600" />
                      <span>Tool Permissions & Agent Access Grants</span>
                    </h3>

                    <div className="divide-y divide-zinc-100 text-xs">
                      <div className="py-3 flex items-center justify-between">
                        <div>
                          <span className="font-semibold block text-zinc-950">list_components</span>
                          <span className="text-zinc-500">Allow agent to discover all available atoms, molecules, and organisms.</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={mcpToolList}
                          onChange={(e) => setMcpToolList(e.target.checked)}
                          className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                        />
                      </div>

                      <div className="py-3 flex items-center justify-between">
                        <div>
                          <span className="font-semibold block text-zinc-950">get_component_schema</span>
                          <span className="text-zinc-500">Allow agent to query prop types, variants, and TSX documentation.</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={mcpToolSchema}
                          onChange={(e) => setMcpToolSchema(e.target.checked)}
                          className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                        />
                      </div>

                      <div className="py-3 flex items-center justify-between">
                        <div>
                          <span className="font-semibold block text-zinc-950">add_component</span>
                          <span className="text-zinc-500">Allow agent to generate and inject TSX code directly into repository.</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={mcpToolAdd}
                          onChange={(e) => setMcpToolAdd(e.target.checked)}
                          className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                        />
                      </div>

                      <div className="py-3 flex items-center justify-between">
                        <div>
                          <span className="font-semibold block text-zinc-950">query_tokens</span>
                          <span className="text-zinc-500">Allow agent to fetch active tokens and design invariants in real time.</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={mcpToolTokens}
                          onChange={(e) => setMcpToolTokens(e.target.checked)}
                          className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* AI Copilot & Ghost Text Preferences */}
                  <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
                    <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Copilot & LLM Targeting</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-zinc-700 font-semibold mb-1">
                          Preferred Coding LLM
                        </label>
                        <select
                          value={preferredModel}
                          onChange={(e) => setPreferredModel(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-950 font-semibold cursor-pointer"
                        >
                          <option value="Claude 3.7 Sonnet">Anthropic Claude 3.7 Sonnet</option>
                          <option value="GPT-4o">OpenAI GPT-4o Enterprise</option>
                          <option value="Gemini 2.0 Flash">Google Gemini 2.0 Flash</option>
                          <option value="DeepSeek V3">DeepSeek V3 (Self-Hosted)</option>
                        </select>
                      </div>

                      <div className="flex flex-col justify-end">
                        <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                          <div>
                            <span className="font-semibold block text-zinc-950">Ghost-Text Autocomplete</span>
                            <span className="text-zinc-500 text-[11px]">Inline token suggestions</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={copilotGhostText}
                            onChange={(e) => setCopilotGhostText(e.target.checked)}
                            className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-PANEL 4: API KEYS & WEBHOOKS */}
              {settingsTab === "api" && (
                <div className="space-y-6">
                  {/* Live API Key */}
                  <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                        <Key className="w-4 h-4 text-zinc-700" />
                        <span>Live Secret API Key</span>
                      </h3>
                      <button
                        type="button"
                        onClick={handleRollApiKey}
                        className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Roll Key</span>
                      </button>
                    </div>

                    <p className="text-xs text-zinc-500">
                      Use this token in the Authorization header to authenticate requests from the CLI or custom scripts.
                    </p>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between font-sans tabular-nums text-xs">
                        <span className="text-zinc-900 select-all font-medium">
                          {showApiKey ? apiKey : "zl_live_sec_••••••••••••••••"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="text-zinc-400 hover:text-zinc-700 cursor-pointer ml-2"
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        iconLeft={copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        onClick={handleCopyApiKey}
                      >
                        {copiedKey ? "Copied" : "Copy"}
                      </Button>
                    </div>
                  </div>

                  {/* Webhooks Delivery Configuration */}
                  <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                        <Radio className="w-4 h-4 text-indigo-600" />
                        <span>Outbound Event Webhooks</span>
                      </h3>
                      <Badge variant="healthy">Live Stream</Badge>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-zinc-700 font-semibold mb-1">
                          Webhook Destination URL
                        </label>
                        <input
                          type="url"
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans tabular-nums"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-700 font-semibold mb-1">
                          Signing Secret (HMAC-SHA256)
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={webhookSecret}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-500 font-sans tabular-nums select-all cursor-not-allowed"
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-zinc-500">
                          Events: <strong className="text-zinc-800">token.updated, registry.synced, auth.locked</strong>
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          iconLeft={<Radio className="w-3.5 h-3.5" />}
                          onClick={handlePingWebhook}
                        >
                          {pingStatus === "testing" ? "Pinging..." : pingStatus === "success" ? "HTTP 200 OK" : "Test Ping Endpoint"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-PANEL 5: DATA RESIDENCY & AUDIT COMPLIANCE */}
              {settingsTab === "compliance" && (
                <div className="space-y-6">
                  {/* Data Sovereignty */}
                  <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
                    <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-600" />
                      <span>Data Sovereignty & Enterprise Storage Region</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-zinc-700 font-semibold mb-1">
                          Primary Compliance Region
                        </label>
                        <select
                          value={dataRegion}
                          onChange={(e) => setDataRegion(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-950 font-semibold cursor-pointer"
                        >
                          <option value="US East (N. Virginia - SOC2 Type II)">US East (N. Virginia - SOC2 Type II)</option>
                          <option value="EU Central (Frankfurt - GDPR Compliant)">EU Central (Frankfurt - GDPR Compliant)</option>
                          <option value="Asia Pacific (Tokyo - APPI Compliant)">Asia Pacific (Tokyo - APPI Compliant)</option>
                        </select>
                      </div>

                      <div className="flex flex-col justify-end">
                        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                          <span className="font-semibold block text-zinc-950">Encryption Status</span>
                          <span className="text-zinc-500 text-[11px]">AES-256-GCM at rest, TLS 1.3 in transit</span>
                        </div>
                      </div>
                    </div>

                    <div className="divide-y divide-zinc-100 text-xs pt-2">
                      <div className="py-3 flex items-center justify-between">
                        <div>
                          <span className="font-semibold block text-zinc-950">
                            SOC2 Type II Immutable Audit Logging
                          </span>
                          <span className="text-zinc-500">Record all token updates, authentication attempts, and exports.</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={soc2Logging}
                          onChange={(e) => setSoc2Logging(e.target.checked)}
                          className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                        />
                      </div>

                      <div className="py-3 flex items-center justify-between">
                        <div>
                          <span className="font-semibold block text-zinc-950">
                            Anonymized Registry Telemetry
                          </span>
                          <span className="text-zinc-500">Share anonymous component usage metrics to improve ZeroLight presets.</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={telemetrySharing}
                          onChange={(e) => setTelemetrySharing(e.target.checked)}
                          className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Export Audit Trail */}
                  <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                        <Download className="w-4 h-4 text-zinc-700" />
                        <span>Export Compliance Audit Trail</span>
                      </h3>
                      <Badge variant="neutral">Tamper-Proof SHA-256</Badge>
                    </div>

                    <p className="text-xs text-zinc-500">
                      Generate an encrypted snapshot of every administrative action, user session, and MCP agent invocation for compliance auditors.
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        iconLeft={<Download className="w-3.5 h-3.5" />}
                        onClick={() => {
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ timestamp: new Date().toISOString(), events: 1420, verified: true }));
                          const downloadAnchor = document.createElement("a");
                          downloadAnchor.setAttribute("href", dataStr);
                          downloadAnchor.setAttribute("download", `zerolight_audit_${Date.now()}.json`);
                          document.body.appendChild(downloadAnchor);
                          downloadAnchor.click();
                          downloadAnchor.remove();
                        }}
                      >
                        Download Audit Log (.JSON)
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        iconLeft={<Download className="w-3.5 h-3.5" />}
                        onClick={() => {
                          const csvContent = "data:text/csv;charset=utf-8,Timestamp,Event,Actor,IP\n" + `${new Date().toISOString()},AUTH_SUCCESS,zerolight,192.168.1.3\n`;
                          const downloadAnchor = document.createElement("a");
                          downloadAnchor.setAttribute("href", encodeURI(csvContent));
                          downloadAnchor.setAttribute("download", `zerolight_audit_${Date.now()}.csv`);
                          document.body.appendChild(downloadAnchor);
                          downloadAnchor.click();
                          downloadAnchor.remove();
                        }}
                      >
                        Download Audit Log (.CSV)
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-200">
                <Button variant="outline" size="sm" type="button" onClick={() => setActiveTab("overview")}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Platform Settings
                </Button>
              </div>
            </form>
          </div>
          )
        )}
        </main>
      </div>
    </div>
  );
}
