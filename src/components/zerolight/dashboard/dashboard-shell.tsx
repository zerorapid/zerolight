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

export type DashboardTab = "home" | "ds-editor" | "docs" | "tools" | "settings";

export function DashboardShell() {
  const { user, logout } = useAuth();
  const { tokens, scaled, updateTokens } = useZeroLight();
  const [activeTab, setActiveTab] = useState<DashboardTab>("home");
  const [toolsRegistered, setToolsRegistered] = useState(false);

  // Settings form states
  const [displayName, setDisplayName] = useState(user?.name || "ZeroLight Root Admin");
  const [workEmail, setWorkEmail] = useState("admin@zerolight.io");
  const [orgDomain, setOrgDomain] = useState("zerolight.enterprise.internal");
  const [mcpStatus, setMcpStatus] = useState<"connected" | "standby">("connected");
  const [twoFactorEnforced, setTwoFactorEnforced] = useState(true);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  const toggleTheme = () => {
    if (scaled.isDarkSurface) {
      updateTokens?.({
        universalFillColor: "#FFFFFF",
        universalBorderColor: "#E4E4E7",
        textIconColor: "#18181B",
        hoverBackplateTint: "#F4F4F5",
      });
    } else {
      updateTokens?.({
        universalFillColor: "#09090B",
        universalBorderColor: "#27272A",
        textIconColor: "#FAFAFA",
        hoverBackplateTint: "#18181B",
      });
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2500);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 flex relative font-sans">
      {/* Toast Notification */}
      {saveSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Enterprise settings successfully persisted to HSM vault</span>
        </div>
      )}

      {/* ── ARC/LINEAR-GRADE FLOATING SIDEBAR ── */}
      <aside className="fixed left-4 top-4 bottom-4 w-64 z-40 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-3 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.06)] select-none">
        <div className="space-y-4">
          {/* Top Brand Mark */}
          <div className="p-2.5 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 22 20 2 20 12 2" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 block tracking-tight">
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
              { id: "home", label: "Home Dashboard", icon: <Home className="w-4 h-4" /> },
              { id: "ds-editor", label: "Visual Studio Dock", icon: <SlidersHorizontal className="w-4 h-4" />, badge: "Tokens" },
              { id: "docs", label: "Design System", icon: <Layers className="w-4 h-4" />, badge: "118" },
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
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
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
                          ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
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
        <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          {/* Quick theme & system status pills */}
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer flex items-center gap-1.5 text-[11px]"
              title="Toggle Light/Dark Theme"
            >
              {scaled.isDarkSurface ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
              <span>{scaled.isDarkSurface ? "Light" : "Dark"}</span>
            </button>

            <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-md border border-emerald-200/50 dark:border-emerald-900/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>MCP Active</span>
            </div>
          </div>

          {/* User profile card */}
          <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold flex items-center justify-center text-[11px]">
                {user?.avatar || "ZL"}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate block">
                  {user?.username || "zerolight"}
                </span>
                <span className="text-[10px] text-zinc-400 truncate block">Root Admin</span>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              title="Sign Out / Lock Session"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN WORKSPACE CONTENT CANVAS ── */}
      <main className="flex-1 ml-72 p-6 md:p-8 min-h-screen">
        {/* TAB 1: HOME DASHBOARD */}
        {activeTab === "home" && (
          <div className="max-w-7xl mx-auto space-y-7 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Welcome to ZeroLight OS
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Authenticated as <strong className="text-zinc-700 dark:text-zinc-300">zerolight</strong> • Session token active
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

            {/* Quick KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="DESIGN PRIMITIVES"
                value="118 Active"
                delta="+2 Organisms"
                trend="up"
                comparisonText="Registry index synced"
              />
              <StatCard
                label="ACTIVE SEATS"
                value="38 / 50"
                delta="76% occupied"
                trend="neutral"
                comparisonText="12 licenses unallocated"
              />
              <StatCard
                label="API LATENCY (P99)"
                value="18ms"
                delta="-4.2ms drop"
                trend="up"
                comparisonText="Global edge CDN cached"
              />
              <StatCard
                label="AUTOMATED TESTS"
                value="164 Passed"
                delta="0 Failures"
                trend="up"
                comparisonText="100% test integrity"
              />
            </div>

            {/* Apple / Airbnb Monochrome World Atlas */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Monochrome World Atlas (Apple / Airbnb Studio)
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Pure 2D flat canvas • 6 switchable render styles (Vector, Dots, Pixels, Crosses, Diamonds, Hatch) • Edge telemetry hubs.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="healthy">6 Styles Active</Badge>
                  <Badge variant="neutral">SVG Export Ready</Badge>
                </div>
              </div>

              <WorldAtlasMap />
            </div>

            {/* Regional Ranked Breakdown */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Regional Traffic & Ingress Distribution
                  </h3>
                  <p className="text-xs text-zinc-500">Ranked country telemetry with latency percentiles and delta progress bars.</p>
                </div>
                <Badge variant="neutral">Telemetry Feed</Badge>
              </div>

              <GeoBreakdown />
            </div>

            {/* Quick Links to Core Organisms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div
                onClick={() => setActiveTab("docs")}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer shadow-xs group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                      ZeroLight Design System Documentation
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                </div>
                <p className="text-xs text-zinc-500">
                  Minimalist, developer-focused set of visual foundations, UI component primitives (Atoms, Molecules, Organisms), and brand assets.
                </p>
              </div>

              <div
                onClick={() => setActiveTab("tools")}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer shadow-xs group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                      Vector Map Studio & Asset Downloader
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
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

            <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
              <WorldAtlasMap className="w-full min-h-[560px]" />
            </div>
          </div>
        )}

        {/* TAB 5: ENTERPRISE SETTINGS & MCP INTEGRATION */}
        {activeTab === "settings" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Platform Settings & Agent Integration
              </h1>
              <p className="text-xs text-zinc-500">
                Manage profile credentials, corporate workspace domains, FIDO2 keys, and AI Agent MCP server bindings.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Profile Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-4 shadow-2xs">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <User className="w-4 h-4 text-zinc-500" />
                  <span>Administrator Profile</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                      Corporate Work Email
                    </label>
                    <input
                      type="email"
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                </div>
              </div>

              {/* Workspace & MCP Agent Configuration */}
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-500" />
                    <span>AI Coding Agent (MCP) Protocol Bindings</span>
                  </h3>
                  <Badge variant="healthy">MCP Active</Badge>
                </div>

                <p className="text-xs text-zinc-500">
                  Allow external AI coding agents (Cursor, Claude Code, Antigravity) to query ZeroLight design primitives and inject token-bound components.
                </p>

                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span>MCP Server Endpoint:</span>
                    <span className="font-sans tabular-nums text-emerald-600 dark:text-emerald-400">
                      http://localhost:3002/api/mcp
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>Supported Clients:</span>
                    <span>Cursor IDE, Claude Desktop, Antigravity CLI</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>Component Injection Capability:</span>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">Read & Insert (118 Primitives)</span>
                  </div>
                </div>
              </div>

              {/* Security & 2FA Enforcement */}
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-4 shadow-2xs">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  <span>Hardware Authentication & Cryptographic Keys</span>
                </h3>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold block text-zinc-900 dark:text-zinc-100">
                      Enforce FIDO2 / WebAuthn Hardware Keys
                    </span>
                    <span className="text-zinc-500">Require physical YubiKey or TouchID for root admin sessions.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactorEnforced}
                    onChange={(e) => setTwoFactorEnforced(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-900 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setActiveTab("home")}>
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
