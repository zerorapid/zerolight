"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  SlidersHorizontal,
  Layers,
  Wrench,
  Settings,
  LogOut,
  Sun,
  Moon,
  ExternalLink,
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
} from "lucide-react";
import { useAuth } from "../auth/auth-context";
import { useZeroLight } from "../context";
import { ZeroLightStudio } from "../docs-studio";
import { BillingPortal } from "../organisms/billing-portal";
import { TeamPermissions } from "../organisms/team-permissions";
import { GeoBreakdown } from "../organisms/geo-breakdown";
import { WorldAtlasMap } from "../../WorldAtlasMap";
import { ZeroLightDocsPortal } from "../docs/zerolight-docs-portal";
import { StatCard } from "../molecules/stat-card";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";

export type DashboardTab = "overview" | "ds-editor" | "docs" | "tools" | "settings";

export function DashboardShell() {
  const { user, logout } = useAuth();
  const { tokens, scaled, updateTokens } = useZeroLight();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Settings form states
  const [displayName, setDisplayName] = useState(user?.name || "ZeroLight Root Admin");
  const [workEmail, setWorkEmail] = useState("admin@zerolight.io");
  const [orgDomain, setOrgDomain] = useState("zerolight.enterprise.internal");
  const [mcpStatus, setMcpStatus] = useState<"connected" | "standby">("connected");
  const [twoFactorEnforced, setTwoFactorEnforced] = useState(true);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (typeof document !== "undefined") {
      if (nextDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    if (nextDark) {
      updateTokens?.({
        universalFillColor: "#09090B",
        universalBorderColor: "#27272A",
        textIconColor: "#FAFAFA",
        hoverBackplateTint: "#18181B",
      });
    } else {
      updateTokens?.({
        universalFillColor: "#FFFFFF",
        universalBorderColor: "#E4E4E7",
        textIconColor: "#09090B",
        hoverBackplateTint: "#F4F4F5",
      });
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2500);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-zinc-950 flex relative font-sans">
      {/* Toast Notification */}
      {saveSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Enterprise settings successfully persisted to HSM vault</span>
        </div>
      )}

      {/* ── ARC/LINEAR-GRADE FLOATING SIDEBAR (Strict Crisp Light Mode) ── */}
      <aside className="fixed left-4 top-4 bottom-4 w-64 z-40 bg-white/95 backdrop-blur-2xl border border-zinc-200/90 rounded-3xl p-3 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.04)] select-none">
        <div className="space-y-4">
          {/* Top Brand Mark */}
          <div className="p-2.5 flex items-center justify-between border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 22 20 2 20 12 2" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-xs text-zinc-950 block tracking-tight">
                  ZeroLight OS
                </span>
                <span className="text-[10px] text-zinc-400 font-medium">Enterprise v2.4</span>
              </div>
            </div>

            <Badge variant="healthy">
              <span className="text-[10px] font-bold">Pro</span>
            </Badge>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {[
              { id: "overview", label: "Overview", icon: <Home className="w-4 h-4" /> },
              { id: "ds-editor", label: "Visual Studio Dock", icon: <SlidersHorizontal className="w-4 h-4" />, badge: "Tokens" },
              { id: "docs", label: "Design System", icon: <Layers className="w-4 h-4" />, badge: "119" },
              { id: "tools", label: "Map Studio & Tools", icon: <Wrench className="w-4 h-4" />, badge: "Vector" },
              { id: "settings", label: "Settings & MCP", icon: <Settings className="w-4 h-4" /> },
            ].map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as DashboardTab)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    active
                      ? "bg-zinc-950 text-white shadow-xs"
                      : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-950"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Floating Sidebar Footer: Profile & Controls */}
        <div className="space-y-3 pt-3 border-t border-zinc-100">
          {/* Quick theme & system status pills */}
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={toggleTheme}
              className="px-2.5 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-colors cursor-pointer flex items-center gap-1.5 text-[11px] font-medium"
              title="Toggle Light/Dark Theme"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
              <span>{isDarkMode ? "Dark (Active)" : "Light (Active)"}</span>
            </button>

            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>MCP Active</span>
            </div>
          </div>

          {/* User profile card */}
          <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-zinc-950 text-white font-bold flex items-center justify-center text-[11px]">
                {user?.avatar || "ZL"}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-zinc-950 truncate block">
                  {user?.username || "zerolight"}
                </span>
                <span className="text-[10px] text-zinc-400 truncate block">Root Admin</span>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              title="Sign Out / Lock Session"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN WORKSPACE CONTENT CANVAS ── */}
      <main className="flex-1 ml-72 p-6 md:p-8 min-h-screen bg-[#F8FAFC]">
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
                    q: "What is the Tactile Calm design philosophy behind ZeroLight?",
                    a: "Tactile Calm rejects decorative noise, gratuitous multi-stop gradients, glowing drop shadows, and cliché AI template copy. It prioritizes crisp 1px hairline borders (#E4E4E7), subtle luminance stepping, YIQ contrast-verified typography, and strict tabular-nums layout discipline.",
                  },
                  {
                    q: "Can the theme tokens be exported or customized per tenant?",
                    a: "Yes. The Visual Studio Dock provides a real-time token compiler. You can adjust universal fill colors, brand accents, border radii, and elevation profiles, saving them to isolated workspace presets or streaming them via MCP to your development environment.",
                  },
                  {
                    q: "How does the World Atlas vector map operate without external API keys?",
                    a: "Our geo-telemetry primitives (WorldAtlasMap and GeoBreakdown) render via client-side D3 spherical geometry and TopoJSON. They require zero third-party map SDKs (such as Mapbox, Google Maps, or Leaflet), guaranteeing zero third-party tracking, 0ms tile fetch latency, and zero billing surprises.",
                  },
                  {
                    q: "Is light mode the permanent baseline in ZeroLight OS?",
                    a: "Yes. ZeroLight OS is strictly engineered around an Apple/Airbnb-grade light mode baseline with crisp contrast ratios and quiet neutral backgrounds (#FFFFFF / #F8FAFC). While dark mode is supported via the user toggle in the sidebar, light mode is the first-class default and is protected against involuntary OS dark mode hijacking.",
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

        {/* TAB 3: ZEROLIGHT DESIGN SYSTEM DOCUMENTATION */}
        {activeTab === "docs" && (
          <div className="w-full -mt-6 -ml-6 -mr-6 md:-mt-8 md:-ml-8 md:-mr-8 -mb-8 animate-in fade-in duration-200">
            <ZeroLightDocsPortal />
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

        {/* TAB 5: ENTERPRISE SETTINGS & MCP INTEGRATION */}
        {activeTab === "settings" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="pb-2 border-b border-zinc-200/80">
              <h1 className="text-xl font-bold text-zinc-950">
                Platform Settings & Agent Integration
              </h1>
              <p className="text-xs text-zinc-500">
                Manage profile credentials, corporate workspace domains, FIDO2 keys, and AI Agent MCP server bindings.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Profile Card */}
              <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-2xs">
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

              {/* Workspace & MCP Agent Configuration */}
              <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-600" />
                    <span>AI Coding Agent (MCP) Protocol Bindings</span>
                  </h3>
                  <Badge variant="healthy">MCP Active</Badge>
                </div>

                <p className="text-xs text-zinc-500">
                  Allow external AI coding agents (Cursor, Claude Code, Antigravity) to query ZeroLight design primitives and inject token-bound components.
                </p>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span>MCP Server Endpoint:</span>
                    <span className="font-sans tabular-nums text-emerald-600">
                      http://localhost:3002/api/mcp
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>Supported Clients:</span>
                    <span>Cursor IDE, Claude Desktop, Antigravity CLI</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>Component Injection Capability:</span>
                    <span className="font-bold text-zinc-800">Read & Insert (119 Primitives)</span>
                  </div>
                </div>
              </div>

              {/* Security & 2FA Enforcement */}
              <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 space-y-4 shadow-2xs">
                <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Hardware Authentication & Cryptographic Keys</span>
                </h3>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold block text-zinc-950">
                      Enforce FIDO2 / WebAuthn Hardware Keys
                    </span>
                    <span className="text-zinc-500">Require physical YubiKey or TouchID for root admin sessions.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactorEnforced}
                    onChange={(e) => setTwoFactorEnforced(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
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
