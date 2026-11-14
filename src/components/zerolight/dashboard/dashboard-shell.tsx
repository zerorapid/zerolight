"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Home,
  SlidersHorizontal,
  Layers,
  Wrench,
  Settings,
  LogOut,
  ShieldCheck,
  Zap,
  Terminal,
  Activity,
  User,
  Key,
  Globe,
  Plus,
  ArrowUpRight,
  Sparkles,
  ChevronDown,
  HelpCircle,
  FileCode2,
  CheckCircle2,
  Lock,
  PanelLeftClose,
  PanelLeft,
  Copy,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  Server,
  Clock,
  Laptop,
  Radio,
  Download,
  AlertTriangle,
  Building,
  Cpu,
  Database,
  Sliders,
} from "lucide-react";
import { useAuth } from "../auth/auth-context";
import { useZeroLight } from "../context";
import { ZeroLightStudio } from "../docs-studio";
import { WorldAtlasMap } from "../../WorldAtlasMap";
import { ZeroLightDocsPortal } from "../docs/zerolight-docs-portal";
import { SaaSButtonLibrary, SaaSInputFieldLibrary, SaaSSelectionLibrary, SaaSIndicatorLibrary, SaaSDividerLibrary, SaaSTooltipLibrary, SaaSFeedbackLibrary, SaaSOverlaysLibrary, SaaSNavigationLibrary, SaaSDataLibrary, SaaSBusinessLibrary, SaaSLayoutLibrary } from "../libraries";
import { StatCard } from "../molecules/stat-card";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";

export type DashboardTab = "overview" | "ds-editor" | "docs" | "tools" | "settings";
export type DocsSubView = "catalog" | "buttons" | "inputs" | "selections" | "indicators" | "dividers" | "tooltips" | "feedback" | "overlays" | "navigation" | "data" | "business" | "layouts";
export type SettingsSubTab = "general" | "security" | "mcp" | "api" | "compliance";

export function DashboardShell() {
  const { user, logout } = useAuth();
  const { tokens } = useZeroLight();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [docsSubView, setDocsSubView] = useState<DocsSubView>("catalog");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
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
  const [mcpStatus, setMcpStatus] = useState<"connected" | "standby">("connected");
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
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
    { id: "ds-editor", label: "Visual Studio Dock", icon: <SlidersHorizontal className="w-4 h-4" />, badge: "Tokens" },
    { id: "docs", label: "Design System", icon: <Layers className="w-4 h-4" />, badge: "119" },
    { id: "tools", label: "Map Studio & Tools", icon: <Wrench className="w-4 h-4" />, badge: "Vector" },
    { id: "settings", label: "Settings & MCP", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-zinc-950 flex relative font-sans">
      {/* Toast Notification */}
      {saveSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── HIGH-DEPTH OBSIDIAN DARK FLOATING SIDEBAR ── */}
      <LayoutGroup>
        <motion.aside
          animate={{ width: isCollapsed ? 72 : 260 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed left-4 top-4 bottom-4 z-40 bg-[#0B0F19] text-white border border-white/[0.08] rounded-[24px] p-2.5 flex flex-col justify-between shadow-[0_12px_30px_rgba(0,0,0,0.5)] select-none overflow-hidden"
        >
          <div className="space-y-4">
            {/* Top Brand Mark with Invariant Centroid + Collapse Button */}
            <div className="h-10 px-1 flex items-center justify-between border-b border-white/[0.08] pb-2.5">
              <div className="flex items-center min-w-0">
                {/* Invariant horizontal icon centroid (centered at x = 36px) */}
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

            {/* Navigation Items with Shared Layout Glide Indicator */}
            <nav className="space-y-1">
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
                      onClick={() => setActiveTab(item.id as DashboardTab)}
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

                      {/* Invariant Horizontal Icon Centroid */}
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 z-10">
                        {item.icon}
                      </div>

                      {/* Animated Label & Badges Reveal */}
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

                    {/* Submenu for Design System in Expanded Mode */}
                    {item.id === "docs" && !isCollapsed && (
                      <div className="ml-7 pl-3 py-1 my-1 border-l border-white/10 space-y-1 relative">
                        {[
                          { id: "catalog", label: "Catalog & Tokens", count: "119" },
                          { id: "buttons", label: "Button Library", count: "33" },
                          { id: "inputs", label: "Input Library", count: "44" },
                          { id: "selections", label: "Selection Controls", count: "26" },
                          { id: "indicators", label: "Status & Indicators", count: "28" },
                          { id: "dividers", label: "Dividers & Spacers", count: "22" },
                          { id: "tooltips", label: "Tooltips & Popovers", count: "22" },
                          { id: "feedback", label: "Alerts & Empty States", count: "20" },
                          { id: "overlays", label: "Overlays & ⌘K", count: "16" },
                          { id: "navigation", label: "Navigation & Menus", count: "20" },
                          { id: "data", label: "Data & Tables", count: "18" },
                          { id: "business", label: "Business & Billing", count: "16" },
                          { id: "layouts", label: "Page Layouts", count: "12" },
                        ].map((sub) => {
                          const isSubActive = activeTab === "docs" && docsSubView === sub.id;
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTab("docs");
                                setDocsSubView(sub.id as DocsSubView);
                              }}
                              className={`w-full px-2 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-between transition-colors cursor-pointer relative ${
                                isSubActive
                                  ? "text-white bg-white/10 font-bold"
                                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                              }`}
                            >
                              {isSubActive && (
                                <motion.div
                                  layoutId="sidebar-sub-pip"
                                  className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-1.5 h-3 rounded-full bg-white shadow-xs"
                                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                                />
                              )}
                              <span className="truncate">{sub.label}</span>
                              <span className="text-[10px] font-sans tabular-nums text-zinc-500 font-bold">
                                {sub.count}
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
                            {[
                              { id: "catalog", label: "Catalog (119)" },
                              { id: "buttons", label: "Buttons (33)" },
                              { id: "inputs", label: "Inputs (44)" },
                              { id: "selections", label: "Selections (26)" },
                              { id: "indicators", label: "Indicators (28)" },
                              { id: "dividers", label: "Dividers (22)" },
                              { id: "tooltips", label: "Tooltips (22)" },
                              { id: "feedback", label: "Feedback (20)" },
                              { id: "overlays", label: "Overlays (16)" },
                              { id: "navigation", label: "Navigation (20)" },
                              { id: "data", label: "Data (18)" },
                              { id: "business", label: "Business (16)" },
                              { id: "layouts", label: "Layouts (12)" },
                            ].map((sub) => (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => {
                                  setActiveTab("docs");
                                  setDocsSubView(sub.id as DocsSubView);
                                  setHoveredTab(null);
                                }}
                                className={`w-full px-2 py-1 rounded-lg text-left text-xs font-medium cursor-pointer transition ${
                                  activeTab === "docs" && docsSubView === sub.id
                                    ? "bg-white/20 text-white font-bold"
                                    : "text-zinc-300 hover:bg-white/10"
                                }`}
                              >
                                {sub.label}
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
          <div className="space-y-2 pt-2.5 border-t border-white/[0.08]">
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

            {/* User Profile Card */}
            <div className={`p-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-white/15 text-white font-bold flex items-center justify-center text-[11px] shrink-0 border border-white/10">
                  {user?.avatar || "ZL"}
                </div>
                {!isCollapsed && (
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-white truncate block">
                      {user?.username || "zerolight"}
                    </span>
                    <span className="text-[10px] text-zinc-400 truncate block">Root Admin</span>
                  </div>
                )}
              </div>

              {!isCollapsed && (
                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Sign Out / Lock Session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </motion.aside>
      </LayoutGroup>

      {/* ── MAIN WORKSPACE CONTENT CANVAS ── */}
      <main
        className={`flex-1 transition-[margin] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isCollapsed ? "ml-[96px]" : "ml-[288px]"
        } p-6 md:p-8 min-h-screen bg-[#F8FAFC]`}
      >
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === "overview" && (
          <div className="max-w-7xl mx-auto space-y-7 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-200/80">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
                  Welcome to ZeroLight OS
                </h1>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Authenticated as <strong className="text-zinc-800">zerolight</strong> • Session token active
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  iconLeft={<Layers className="w-3.5 h-3.5" />}
                  onClick={() => setActiveTab("docs")}
                >
                  Design System
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  iconLeft={<SlidersHorizontal className="w-3.5 h-3.5" />}
                  onClick={() => setActiveTab("ds-editor")}
                >
                  Launch Visual Studio
                </Button>
              </div>
            </div>

            {/* 4 Live Informational Trust Data Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="TOTAL COMPONENTS ADDED"
                value="119 Primitives"
                delta="42 Atoms • 44 Molecules • 18 Organisms • 15 Blocks"
                trend="up"
                comparisonText="Zero-dependency registry synced"
              />
              <StatCard
                label="TOTAL SAAS TEMPLATES"
                value="12 Templates"
                delta="Production B2B & Fintech"
                trend="up"
                comparisonText="ZeroLight token-bound"
              />
              <StatCard
                label="TOTAL NICHES COVERED"
                value="8 Verticals"
                delta="Fintech, DevTools, AI & Health"
                trend="neutral"
                comparisonText="Enterprise domain spectrum"
              />
              <StatCard
                label="TOTAL CLIENTS SERVED"
                value="1,420+ Teams"
                delta="99.98% Uptime"
                trend="up"
                comparisonText="SOC2 Type II & HIPAA certified"
              />
            </div>

            {/* Tools Section Preview Card */}
            <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-zinc-950 tracking-tight">
                        Vector Map Studio & Asset Downloader
                      </h3>
                      <Badge variant="healthy">Tools Preview</Badge>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 max-w-2xl leading-relaxed">
                      Interactive tool for customizing 6 monochrome render styles (Vector, Halftone Dots, Pixels, Architectural Crosses, Diamonds, and Hatching), projecting regional edge telemetry, and downloading standalone high-resolution SVG vector maps directly into your codebase.
                    </p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  iconRight={<ArrowUpRight className="w-3.5 h-3.5" />}
                  onClick={() => setActiveTab("tools")}
                  className="shrink-0"
                >
                  Launch Map Studio
                </Button>
              </div>

              {/* Feature Highlights Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-zinc-100">
                <div className="p-3 rounded-xl bg-zinc-50/70 border border-zinc-200/60">
                  <span className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">RENDER MODES</span>
                  <span className="text-xs font-semibold text-zinc-900 mt-0.5 block">6 Pattern Styles</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50/70 border border-zinc-200/60">
                  <span className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">EXPORT FORMAT</span>
                  <span className="text-xs font-semibold text-zinc-900 mt-0.5 block">Standalone SVG</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50/70 border border-zinc-200/60">
                  <span className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">EXTERNAL DEPENDENCY</span>
                  <span className="text-xs font-semibold text-zinc-900 mt-0.5 block">Zero API Keys</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50/70 border border-zinc-200/60">
                  <span className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">GEOMETRY ENGINE</span>
                  <span className="text-xs font-semibold text-zinc-900 mt-0.5 block">D3 Natural Earth</span>
                </div>
              </div>
            </div>

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
                onClick={() => setActiveTab("tools")}
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

        {/* TAB 2: VISUAL STUDIO DOCK */}
        {activeTab === "ds-editor" && (
          <div className="w-full -mt-2 -ml-2 -mr-2 animate-in fade-in duration-200">
            <ZeroLightStudio initialTier="atoms" />
          </div>
        )}

        {/* TAB 3: ZEROLIGHT DESIGN SYSTEM DOCUMENTATION & LIBRARIES */}
        {activeTab === "docs" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Sub-Nav Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200/80">
              <div className="flex items-center gap-1.5 p-1 bg-zinc-200/60 rounded-xl border border-zinc-300/40 w-fit">
                {[
                  { id: "catalog", label: "Component Catalog & Foundations", count: "119" },
                  { id: "buttons", label: "SaaS Button Library", count: "33" },
                  { id: "inputs", label: "SaaS Input Field Library", count: "44" },
                  { id: "selections", label: "SaaS Selection Controls", count: "26" },
                  { id: "indicators", label: "SaaS Status & Indicators", count: "28" },
                  { id: "dividers", label: "SaaS Dividers & Spacers", count: "22" },
                  { id: "tooltips", label: "SaaS Tooltips & Popovers", count: "22" },
                  { id: "feedback", label: "SaaS Feedback & Alerts", count: "20" },
                  { id: "overlays", label: "SaaS Overlays & ⌘K", count: "16" },
                  { id: "navigation", label: "SaaS Navigation & Sidebars", count: "20" },
                  { id: "data", label: "SaaS Data & Tables", count: "18" },
                  { id: "business", label: "SaaS Business & Billing", count: "16" },
                  { id: "layouts", label: "SaaS Page Layouts", count: "12" },
                ].map((sub) => {
                  const active = docsSubView === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setDocsSubView(sub.id as DocsSubView)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        active
                          ? "bg-white text-zinc-950 shadow-xs font-bold"
                          : "text-zinc-600 hover:text-zinc-950 hover:bg-white/50"
                      }`}
                    >
                      <span>{sub.label}</span>
                      <span
                        className={`text-[10px] font-sans tabular-nums px-1.5 py-0.2 rounded-md font-bold ${
                          active ? "bg-zinc-950 text-white" : "bg-zinc-300/70 text-zinc-600"
                        }`}
                      >
                        {sub.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="healthy">277 SaaS Pattern Variants Active</Badge>
              </div>
            </div>

            {/* Sub-view Content */}
            {docsSubView === "catalog" && (
              <div className="w-full -mt-2 -ml-6 -mr-6 md:-mt-4 md:-ml-8 md:-mr-8 -mb-8">
                <ZeroLightDocsPortal />
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
          </div>
        )}

        {/* TAB 4: TOOLS & VECTOR MAP ASSET GENERATOR */}
        {activeTab === "tools" && (
          <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200/80">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-zinc-950">
                  Vector Map Studio & Asset Generator
                </h1>
                <p className="text-xs text-zinc-500">
                  Interactive tool for styling 2D monochrome vector maps, regional focus, and downloading standalone SVG assets.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="healthy">6 Styles Active</Badge>
                <Badge variant="neutral">SVG Export Ready</Badge>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-xs">
              <WorldAtlasMap className="w-full min-h-[580px]" />
            </div>
          </div>
        )}

        {/* TAB 5: COMPREHENSIVE ENTERPRISE SETTINGS & MCP INTEGRATION */}
        {activeTab === "settings" && (
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
        )}
      </main>
    </div>
  );
}
