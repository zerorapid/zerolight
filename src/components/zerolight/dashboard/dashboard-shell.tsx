"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Home,
  Layers,
  Settings,
  LogOut,
  ShieldCheck,
  User,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ArrowUpRight,
  PanelLeftClose,
  PanelLeft,
  Check,
  Search,
  Bell,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../auth/auth-context";
import { useZeroLight } from "../context";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";
import { OverviewTab } from "./overview-tab";
import { DesignSystemTab } from "./design-system-tab";
import { SettingsTab } from "./settings-tab";

export type DashboardTab = "overview" | "docs" | "settings";
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

interface GlobalSearchEntry {
  id: string;
  label: string;
  tierLabel: string;
  keywords: string;
  tab: DashboardTab;
  docsTier?: DocsTier;
  docsSubView?: DocsSubView;
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
  { id: "comp-charts", label: "AreaChart, BarChart & DonutChart", tierLabel: "Molecules Directory", keywords: "chart analytics data viz svg bezier graph telemetry", tab: "docs", docsTier: "molecules", docsSubView: "catalog-molecules" },
  { id: "comp-datatable", label: "Enterprise DataTable & Kanban", tierLabel: "Organisms / Data & Tables", keywords: "table grid csv tsv export filter kanban sort", tab: "docs", docsTier: "organisms", docsSubView: "data" },
  { id: "comp-otp", label: "OTP Input, Currency & Calendar", tierLabel: "Atoms / Inputs & Fields", keywords: "otp phone pin password datepicker currency inr usd", tab: "docs", docsTier: "atoms", docsSubView: "inputs" },
  { id: "comp-cmdk", label: "Command Palette (⌘K), Modals & Drawers", tierLabel: "Organisms / Overlays", keywords: "modal dialog drawer cmdk command palette overlay sheet", tab: "docs", docsTier: "organisms", docsSubView: "overlays" },
  { id: "comp-mcp", label: "MCP Agent Server & Security Settings", tierLabel: "Settings & MCP", keywords: "mcp json-rpc api key webhook compliance soc2", tab: "settings" },
];

export interface DashboardShellProps {
  onRequireAuth?: () => void;
}

export function DashboardShell({ onRequireAuth }: DashboardShellProps = {}) {
  const { isAuthenticated, user, logout } = useAuth();
  const { tokens } = useZeroLight();
  const [activeTab, setActiveTab] = useState<DashboardTab>("docs");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab") as DashboardTab | null;
    if (tabParam && ["overview", "docs", "settings"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);
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
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

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
    if (entry.tab === "docs") setDocsMenuExpanded(true);
    setGlobalSearch("");
    setSearchFocused(false);
  };
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

  const navItems = [
    { id: "overview", label: "Overview", icon: <Home className="w-4 h-4" /> },
    { id: "docs", label: "Design System", icon: <Layers className="w-4 h-4" />, badge: "120" },
    { id: "settings", label: "Settings & MCP", icon: <Settings className="w-4 h-4" /> },
  ];

  const showToolToast = (msg: string) => {
    setToastMessage(msg);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2500);
  };

  return (
    <div className="h-screen w-full bg-[#F1F3F5] text-zinc-950 flex p-3 md:p-4 gap-3 md:gap-4 overflow-hidden font-sans print:h-auto print:overflow-visible print:bg-white print:p-0 print:block">
      {/* Toast Notification */}
      {saveSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Slide-Over Navigation Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-10 w-64 h-full bg-[#0B0F19] text-white p-3 flex flex-col justify-between shadow-2xl">
            <div className="space-y-3">
              <div className="h-10 px-1 flex items-center justify-between border-b border-white/[0.08] pb-2">
                <span className="font-bold text-sm tracking-tight">ZeroLight OS</span>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
                  aria-label="Close navigation menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id as DashboardTab);
                      setMobileNavOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-2.5 text-xs font-medium ${
                      activeTab === item.id ? "bg-white/15 text-white font-semibold" : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="pt-2 border-t border-white/[0.08] text-[11px] text-zinc-400 px-2">
              <a href="https://zerorapid.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                zerorapid.in
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── HIGH-DEPTH OBSIDIAN DARK FIXED/STICKY SIDEBAR (EXACT MATCH TO ATOM/MOLECULE USER REFERENCE) ── */}
      <LayoutGroup>
        <motion.aside
          animate={{ width: isCollapsed ? 68 : 256 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex h-full bg-[#0B0F19] text-white border border-white/[0.08] rounded-[20px] p-2.5 flex-col justify-between shadow-lg select-none overflow-hidden shrink-0 print:hidden"
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
      <div className="flex-1 flex flex-col h-full min-w-0 gap-2.5 md:gap-3 overflow-hidden print:h-auto print:overflow-visible print:block">
        {/* ── MASTER PERSISTENT TOP HEADER (OPTION A: GLOBAL SEARCH + UTILITY CONTROLS) ── */}
        <header
          data-zl-studio-chrome="true"
          className="shrink-0 border rounded-[18px] px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4 shadow-2xs z-20 print:hidden"
          style={{
            backgroundColor: tokens.universalFillColor,
            borderColor: tokens.universalBorderColor,
            color: tokens.textIconColor,
          }}
        >
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 rounded-xl border shrink-0 cursor-pointer"
            style={{
              borderColor: tokens.universalBorderColor,
              color: tokens.textIconColor,
            }}
          >
            <Menu className="w-4 h-4" />
          </button>
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
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium px-2 shrink-0 print:hidden">
          <span className="hover:text-zinc-600 cursor-pointer" onClick={() => setActiveTab("overview")}>ZeroLight OS</span>
          <span>/</span>
          <span className="text-zinc-700 font-semibold capitalize">
            {activeTab === "overview" && "Overview"}
            {activeTab === "docs" && `Design System / ${activeTierData.label}`}
            {activeTab === "settings" && "Settings & MCP"}
          </span>
        </div>

        {/* ── BIG ROUNDED WHITE WORKSPACE CARD (ONLY THIS BOX HAS OVERFLOW-Y-AUTO EXCEPT STUDIO DOCK WHICH IS A FULL-HEIGHT DOCK) ── */}
        <main
          className="flex-1 rounded-[18px] border shadow-xs min-h-0 print:border-0 print:shadow-none print:rounded-none print:overflow-visible print:h-auto print:block overflow-y-auto p-4 sm:p-6 md:p-8"
          style={{
            backgroundColor: tokens.universalFillColor,
            borderColor: tokens.universalBorderColor,
            color: tokens.textIconColor,
          }}
        >
          {activeTab === "overview" && (
            <OverviewTab
              onNavigateDocs={() => setActiveTab("docs")}
              onNavigateOrganisms={() => {
                setActiveTab("docs");
                setDocsTier("organisms");
                setDocsSubView("data");
              }}
            />
          )}

          {activeTab === "docs" && (
            <DesignSystemTab
              activeTierData={activeTierData}
              docsSubView={docsSubView}
              setDocsSubView={setDocsSubView}
            />
          )}

          {activeTab === "settings" && (
            <SettingsTab
              isAuthenticated={isAuthenticated}
              userName={user?.name}
              onRequireAuth={onRequireAuth}
              onNavigateDocs={() => setActiveTab("docs")}
              onNavigateOverview={() => setActiveTab("overview")}
              onShowToast={showToolToast}
            />
          )}
        </main>
      </div>
    </div>
  );
}
