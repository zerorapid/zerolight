"use client";

import React, { useState } from "react";
import {
  Search,
  Copy,
  Check,
  X,
  LayoutGrid,
  Monitor,
  Tablet,
  Smartphone,
  Code,
  ArrowRight,
  RefreshCw,
  UserPlus,
  Users,
  FileText,
  Settings,
  LayoutDashboard,
  Bell,
  CheckCircle2,
  PlusCircle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useZeroLight } from "../context";

export type ViewportMode = "desktop" | "tablet" | "mobile";

export function SaaSLayoutLibrary() {
  const { tokens } = useZeroLight();

  // Sticky Bar States
  const [searchQuery, setSearchQuery] = useState("");
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [zoneGuides, setZoneGuides] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Code Modal State
  const [activeCodeModal, setActiveCodeModal] = useState<{ title: string; code: string } | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Template 01 State: Active Nav Item
  const [shell01Nav, setShell01Nav] = useState("Overview");

  // Template 05 State: Active Client Detail
  const [selectedClient, setSelectedClient] = useState({
    name: "Zerorapid India Pvt Ltd",
    amount: "₹1,25,000",
    tier: "Enterprise Tier",
    status: "Paid",
    contact: "Rahul Verma",
    notes: "Deccan logistics bridge operational. Annual support agreement signed.",
    auditDate: "15 Dec 2026",
  });

  const categories = [
    { id: "all", label: "All Layouts", count: 12 },
    { id: "shells", label: "App Shells", count: 2 },
    { id: "executive", label: "Executive Dashboards", count: 2 },
    { id: "splits", label: "Master-Detail Splits", count: 2 },
    { id: "settings", label: "Settings & Forms", count: 2 },
    { id: "auth", label: "Auth & Onboarding", count: 2 },
    { id: "landing", label: "Landing & Starters", count: 2 },
  ];

  const templates = [
    // Category 1: App Shells
    {
      id: "t01",
      cat: "shells",
      num: "01",
      title: "Classic Left Sidebar + Top Bar App Shell",
      desc: "Standard enterprise SaaS framework: Persistent left navigation rail, contextual header bar, and scrollable KPI canvas.",
    },
    {
      id: "t02",
      cat: "shells",
      num: "02",
      title: "Top-Navigation Centered Container Shell",
      desc: "Full-width header bar with a focused, centered content container (max-w-3xl) for client portals, single tools, and documentation.",
    },

    // Category 2: Executive Dashboards
    {
      id: "t03",
      cat: "executive",
      num: "03",
      title: "4-KPI Top Row + 8/4 Chart & Activity Split",
      desc: "4 equal metric cards above a 12-column asymmetric split pairing an 8-column Revenue Growth bar chart with a 4-column Live Feed.",
    },
    {
      id: "t04",
      cat: "executive",
      num: "04",
      title: "Bento Summary Grid (Hero Metric + Quick Actions)",
      desc: "2/3 width Available Settlement Balance hero card paired with a 1/3 width Quick Shortcuts card, followed by 3 sub-metrics.",
    },

    // Category 3: Master-Detail Splits
    {
      id: "t05",
      cat: "splits",
      num: "05",
      title: "Interactive List-Detail Split View (Inbox / CRM Style)",
      desc: "5-column clickable client list paired with a 7-column Detail Inspector. Clicking any client updates the inspector immediately.",
    },
    {
      id: "t06",
      cat: "splits",
      num: "06",
      title: "Left Faceted Filter Rail + Main Records Table Layout",
      desc: "3-column checkbox filter rail with status chips paired with a 9-column filtered results table and bulk actions bar.",
    },

    // Category 4: Settings & Forms
    {
      id: "t07",
      cat: "settings",
      num: "07",
      title: "Left Settings Menu + Stacked Card Sections",
      desc: "3-column settings navigation tabs paired with a 9-column Workspace Identity form card with save/cancel footer.",
    },
    {
      id: "t08",
      cat: "settings",
      num: "08",
      title: "Two-Column Annotated Form Layout (Label Left, Card Right)",
      desc: "4-column explanatory title/description on the left paired with an 8-column Tax & Invoice Prefix form card on the right.",
    },

    // Category 5: Auth & Onboarding
    {
      id: "t09",
      cat: "auth",
      num: "09",
      title: "Split-Screen Brand & Sign-In Layout",
      desc: "High-contrast customer testimonial panel on the left paired with a clean sign-in form on the right.",
    },
    {
      id: "t10",
      cat: "auth",
      num: "10",
      title: "Focused Centered Onboarding Stepper Layout",
      desc: "Distraction-free centered card with STEP 2 OF 3 · 66% progress bar, workspace name input, and directional actions.",
    },

    // Category 6: Landing & Starters
    {
      id: "t11",
      cat: "landing",
      num: "11",
      title: "SaaS Hero + 3-Column Feature Grid Layout",
      desc: "Public top navigation bar, centered hero headline/subheadline, and 3-column feature highlight cards.",
    },
    {
      id: "t12",
      cat: "landing",
      num: "12",
      title: "Empty / Blank Canvas Starter Layout",
      desc: "Centered dashed starter canvas with + Add First Widget CTA for custom report builders, dashboard creators, and plugins.",
    },
  ];

  // Filtering
  const filteredTemplates = templates.filter((t) => {
    const matchCategory = activeCategory === "all" || t.cat === activeCategory;
    const matchSearch =
      searchQuery === "" ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.num.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  // Frame width class
  const frameWidthClass = {
    desktop: "max-w-full",
    tablet: "max-w-[768px] mx-auto",
    mobile: "max-w-[390px] mx-auto",
  }[viewport];

  const zoneGuideClasses = zoneGuides
    ? "outline-dashed outline-1.5 outline-blue-600/70 dark:outline-blue-400/70 -outline-offset-1 bg-[repeating-linear-gradient(45deg,rgba(37,99,235,0.03),rgba(37,99,235,0.03)_8px,transparent_8px,transparent_16px)]"
    : "";

  return (
    <div className="space-y-6">
      {/* =========================================================================
           STICKY GLOBAL CONTROL BAR (RESPONSIVE & BLUEPRINT CONTROLS)
      ========================================================================= */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-white/90 dark:bg-[#09090B]/90 border-b border-zinc-200/80 dark:border-white/10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3.5 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Left: L4 Badge, Title & Live Counter */}
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs">
              L4
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-zinc-950 dark:text-white">
                  SaaS Page Skeletons & Layout Blueprints
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-sans tabular-nums border border-zinc-200/60 dark:border-white/5">
                  {filteredTemplates.length} of 12 Templates
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Level 4 Layouts: App shells, executive grids, master-detail splits, settings forms, and onboarding steppers.
              </p>
            </div>
          </div>

          {/* Right: Search, Viewport Toggles, Blueprint Guides */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[210px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter layout templates..."
                className="w-full pl-8 pr-7 py-1.5 rounded-lg text-xs bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-white/20 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* 3 Responsive Viewport Frame Toggles */}
            <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setViewport("desktop")}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  viewport === "desktop"
                    ? "font-semibold bg-white dark:bg-white/15 text-zinc-950 dark:text-white shadow-xs"
                    : "font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
                title="Desktop 100% Full Width"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setViewport("tablet")}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  viewport === "tablet"
                    ? "font-semibold bg-white dark:bg-white/15 text-zinc-950 dark:text-white shadow-xs"
                    : "font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
                title="Tablet 768px Width"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablet</span>
              </button>
              <button
                type="button"
                onClick={() => setViewport("mobile")}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  viewport === "mobile"
                    ? "font-semibold bg-white dark:bg-white/15 text-zinc-950 dark:text-white shadow-xs"
                    : "font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
                title="Mobile 390px Width"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>

            {/* Blueprint Zone Guides Toggle */}
            <button
              type="button"
              onClick={() => setZoneGuides(!zoneGuides)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 shadow-xs ${
                zoneGuides
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                  : "border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/70 dark:hover:bg-white/10"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{zoneGuides ? "Zone Guides: On" : "Zone Guides: Off"}</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {categories.map((c) => {
            const isActive = activeCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                    : "bg-zinc-100/80 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-white/10"
                }`}
              >
                <span>{c.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans tabular-nums font-bold ${
                    isActive
                      ? "bg-white/20 dark:bg-zinc-950/20 text-white dark:text-zinc-950"
                      : "bg-zinc-200 dark:bg-white/10 text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
           TEMPLATES LIST
      ========================================================================= */}
      <div className="space-y-6">
        
        {/* TEMPLATE 01: Classic Left Sidebar + Top Bar App Shell */}
        {filteredTemplates.some((t) => t.id === "t01") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-sans tabular-nums">01</span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Classic Left Sidebar + Top Bar App Shell</h3>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Standard enterprise SaaS framework: Persistent left navigation rail, contextual header bar, and scrollable KPI canvas.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setActiveCodeModal({
                    title: "01 Classic Left Sidebar + Top Bar App Shell",
                    code: `<div class="flex h-screen bg-[#FAFAFA] dark:bg-[#09090B]">\n  <!-- Sidebar -->\n  <aside class="w-56 border-r border-zinc-200 dark:border-white/10 p-4">\n    <nav class="space-y-1">\n      <a href="#" class="block p-2 rounded-lg bg-zinc-950 text-white font-semibold">Overview</a>\n      <a href="#" class="block p-2 rounded-lg text-zinc-600 dark:text-zinc-400">Invoices</a>\n    </nav>\n  </aside>\n  <!-- Main Canvas -->\n  <div class="flex-1 flex flex-col min-w-0">\n    <header class="h-14 border-b border-zinc-200 dark:border-white/10 px-6 flex items-center justify-between">\n      <h1 class="text-sm font-bold">Overview</h1>\n    </header>\n    <main class="flex-1 p-6 overflow-y-auto">\n      <!-- Page Content -->\n    </main>\n  </div>\n</div>`,
                  })
                }
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/15 text-zinc-900 dark:text-white flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Copy Layout Code</span>
              </button>
            </div>

            <div className="p-4 sm:p-6 bg-zinc-50/70 dark:bg-white/[0.02]">
              <div className={`transition-all duration-300 ${frameWidthClass}`}>
                <div className="overflow-hidden border border-zinc-200/80 dark:border-white/10 rounded-xl bg-white dark:bg-[#09090B] shadow-sm">
                  <div className="flex h-[380px] w-full">
                    
                    {/* Zone: Sidebar */}
                    <aside className={`relative w-48 sm:w-56 border-r border-zinc-200/80 dark:border-white/10 p-3 flex flex-col justify-between shrink-0 bg-zinc-50/50 dark:bg-[#0E0E10] ${zoneGuideClasses}`}>
                      {zoneGuides && (
                        <span className="absolute top-1.5 left-1.5 z-20 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white shadow-xs pointer-events-none">
                          Sidebar · w-56
                        </span>
                      )}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2 py-1">
                          <div className="w-5 h-5 rounded bg-zinc-950 dark:bg-white flex items-center justify-center text-white dark:text-zinc-950 text-[10px] font-bold">Z</div>
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">ZeroLight Pro</span>
                        </div>
                        <nav className="space-y-1 text-xs">
                          {[
                            { name: "Overview", icon: LayoutDashboard },
                            { name: "Invoices", icon: FileText },
                            { name: "Customers", icon: Users },
                            { name: "Settings", icon: Settings },
                          ].map((item) => (
                            <button
                              key={item.name}
                              type="button"
                              onClick={() => setShell01Nav(item.name)}
                              className={`w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer transition ${
                                shell01Nav === item.name
                                  ? "font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
                                  : "font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-white/5"
                              }`}
                            >
                              <item.icon className="w-3.5 h-3.5" />
                              <span>{item.name}</span>
                            </button>
                          ))}
                        </nav>
                      </div>
                      <div className="pt-2 border-t border-zinc-200/60 dark:border-white/5 flex items-center gap-2 px-1">
                        <div className="w-6 h-6 rounded-full bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center text-[10px] font-bold">SJ</div>
                        <div className="truncate text-[11px]">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">Sai Joshna</p>
                          <p className="text-zinc-400 truncate">Admin</p>
                        </div>
                      </div>
                    </aside>

                    {/* Zone: Main Area (Header + Canvas) */}
                    <div className="flex-1 flex flex-col min-w-0">
                      
                      {/* Zone: Top Bar */}
                      <header className={`relative h-12 border-b border-zinc-200/80 dark:border-white/10 px-4 flex items-center justify-between shrink-0 bg-white dark:bg-[#09090B] ${zoneGuideClasses}`}>
                        {zoneGuides && (
                          <span className="absolute top-1.5 left-1.5 z-20 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white shadow-xs pointer-events-none">
                            Top Bar · h-12
                          </span>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{shell01Nav} Dashboard</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">Live</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                            <Bell className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                            + New Record
                          </button>
                        </div>
                      </header>

                      {/* Zone: Main Canvas */}
                      <main className={`relative flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAFAFA] dark:bg-[#09090B] ${zoneGuideClasses}`}>
                        {zoneGuides && (
                          <span className="absolute top-1.5 left-1.5 z-20 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white shadow-xs pointer-events-none">
                            Main Canvas · flex-1 p-4
                          </span>
                        )}
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="p-3 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 shadow-xs">
                            <span className="text-[11px] text-zinc-400 font-medium">Monthly Recurring</span>
                            <div className="text-lg font-bold text-zinc-950 dark:text-white font-sans tabular-nums mt-0.5">₹14.8L</div>
                            <span className="text-[10px] text-emerald-600 font-bold font-sans tabular-nums">+12.4% vs last mo</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 shadow-xs">
                            <span className="text-[11px] text-zinc-400 font-medium">Active Accounts</span>
                            <div className="text-lg font-bold text-zinc-950 dark:text-white font-sans tabular-nums mt-0.5">1,248</div>
                            <span className="text-[10px] text-zinc-400 font-sans tabular-nums">98.2% retention</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 shadow-xs">
                            <span className="text-[11px] text-zinc-400 font-medium">Pending Approvals</span>
                            <div className="text-lg font-bold text-zinc-950 dark:text-white font-sans tabular-nums mt-0.5">8 Invoices</div>
                            <span className="text-[10px] text-amber-600 font-bold font-sans tabular-nums">Requires action</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 shadow-xs">
                          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/5 text-xs">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">Recent Ledger Activity</span>
                            <span className="text-zinc-400 text-[11px]">Real-time stream</span>
                          </div>
                          <div className="divide-y divide-zinc-100 dark:divide-white/5 text-xs">
                            <div className="py-2 flex items-center justify-between">
                              <span>INV-9042 · Deccan Logistics</span>
                              <span className="font-bold font-sans tabular-nums text-emerald-600">₹1,25,000 Paid</span>
                            </div>
                            <div className="py-2 flex items-center justify-between">
                              <span>INV-9041 · Zerorapid Pay</span>
                              <span className="font-bold font-sans tabular-nums text-amber-600">₹84,200 Pending</span>
                            </div>
                          </div>
                        </div>
                      </main>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATE 03: 4-KPI Top Row + 8/4 Chart & Activity Split */}
        {filteredTemplates.some((t) => t.id === "t03") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-sans tabular-nums">03</span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">4-KPI Top Row + 8/4 Chart & Activity Split</h3>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  4 equal metric cards above a 12-column asymmetric split pairing an 8-column Revenue Growth bar chart with a 4-column Live Feed.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setActiveCodeModal({
                    title: "03 4-KPI Top Row + 8/4 Split",
                    code: `<div class="space-y-6">\n  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">\n    <div class="p-4 bg-white border rounded-xl"><h3>Net Revenue</h3><p class="text-2xl font-bold font-sans tabular-nums">₹48.2L</p></div>\n    <div class="p-4 bg-white border rounded-xl"><h3>Active Subs</h3><p class="text-2xl font-bold font-sans tabular-nums">3,480</p></div>\n  </div>\n  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">\n    <div class="lg:col-span-8 p-6 bg-white border rounded-xl"><h4>Revenue Growth Chart</h4></div>\n    <div class="lg:col-span-4 p-6 bg-white border rounded-xl"><h4>Live Activity Feed</h4></div>\n  </div>\n</div>`,
                  })
                }
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/15 text-zinc-900 dark:text-white flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Copy Layout Code</span>
              </button>
            </div>

            <div className="p-4 sm:p-6 bg-zinc-50/70 dark:bg-white/[0.02]">
              <div className={`transition-all duration-300 ${frameWidthClass}`}>
                <div className="overflow-hidden border border-zinc-200/80 dark:border-white/10 rounded-xl bg-[#FAFAFA] dark:bg-[#09090B] p-4 space-y-4 shadow-sm">
                  
                  {/* Zone: 4-KPI Row */}
                  <div className={`relative grid grid-cols-2 lg:grid-cols-4 gap-3 p-1 rounded-xl ${zoneGuideClasses}`}>
                    {zoneGuides && (
                      <span className="absolute top-1.5 left-1.5 z-20 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white shadow-xs pointer-events-none">
                        4-KPI Ribbon · grid-cols-4
                      </span>
                    )}
                    <div className="p-3 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-xl shadow-xs">
                      <span className="text-[11px] text-zinc-400 font-medium">Net Revenue</span>
                      <div className="text-base font-bold text-zinc-950 dark:text-white font-sans tabular-nums mt-0.5">₹48.2L</div>
                      <span className="text-[10px] text-emerald-600 font-bold font-sans tabular-nums">+14.2%</span>
                    </div>
                    <div className="p-3 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-xl shadow-xs">
                      <span className="text-[11px] text-zinc-400 font-medium">Active Subs</span>
                      <div className="text-base font-bold text-zinc-950 dark:text-white font-sans tabular-nums mt-0.5">3,480</div>
                      <span className="text-[10px] text-emerald-600 font-bold font-sans tabular-nums">+8.1%</span>
                    </div>
                    <div className="p-3 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-xl shadow-xs">
                      <span className="text-[11px] text-zinc-400 font-medium">Avg Order Value</span>
                      <div className="text-base font-bold text-zinc-950 dark:text-white font-sans tabular-nums mt-0.5">₹14,500</div>
                      <span className="text-[10px] text-emerald-600 font-bold font-sans tabular-nums">+3.6%</span>
                    </div>
                    <div className="p-3 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-xl shadow-xs">
                      <span className="text-[11px] text-zinc-400 font-medium">Dispute Rate</span>
                      <div className="text-base font-bold text-zinc-950 dark:text-white font-sans tabular-nums mt-0.5">0.04%</div>
                      <span className="text-[10px] text-zinc-400 font-sans tabular-nums">Healthy</span>
                    </div>
                  </div>

                  {/* Zone: 8 / 4 Asymmetric Split */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    
                    <div className={`relative lg:col-span-8 p-4 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-xl shadow-xs space-y-3 ${zoneGuideClasses}`}>
                      {zoneGuides && (
                        <span className="absolute top-1.5 left-1.5 z-20 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white shadow-xs pointer-events-none">
                          col-span-8 · Chart Canvas
                        </span>
                      )}
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Revenue Trajectory (H2 FY26)</h4>
                          <p className="text-zinc-400 text-[11px]">Aggregated collection through Razorpay & NEFT</p>
                        </div>
                        <span className="font-bold font-sans tabular-nums text-xs">₹64.2L Total</span>
                      </div>
                      <div className="h-28 flex items-end justify-between gap-3 pt-3 border-b border-zinc-100 dark:border-white/5">
                        <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-t h-[40%]" />
                        <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-t h-[55%]" />
                        <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-t h-[70%]" />
                        <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-t h-[65%]" />
                        <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-t h-[85%]" />
                        <div className="flex-1 bg-zinc-950 dark:bg-white rounded-t h-[100%]" />
                      </div>
                      <div className="flex justify-between text-[10px] text-zinc-400 font-medium">
                        <span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
                        <span className="font-bold text-zinc-950 dark:text-white">Nov (Peak)</span>
                      </div>
                    </div>

                    <div className={`relative lg:col-span-4 p-4 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-xl shadow-xs space-y-3 ${zoneGuideClasses}`}>
                      {zoneGuides && (
                        <span className="absolute top-1.5 left-1.5 z-20 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white shadow-xs pointer-events-none">
                          col-span-4 · Activity Feed
                        </span>
                      )}
                      <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-100 dark:border-white/5">
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Live Settlements</h4>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="p-2 rounded-lg bg-zinc-50 dark:bg-white/5">
                          <div className="flex justify-between font-semibold">
                            <span>Apex Retail</span>
                            <span className="font-sans tabular-nums text-emerald-600">₹32,600</span>
                          </div>
                          <span className="text-[10px] text-zinc-400 font-sans tabular-nums">2 mins ago via UPI</span>
                        </div>
                        <div className="p-2 rounded-lg bg-zinc-50 dark:bg-white/5">
                          <div className="flex justify-between font-semibold">
                            <span>Kaveri Exports</span>
                            <span className="font-sans tabular-nums text-emerald-600">₹2,10,000</span>
                          </div>
                          <span className="text-[10px] text-zinc-400 font-sans tabular-nums">14 mins ago via RTGS</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATE 05: Interactive List-Detail Split View (Inbox / CRM Style) */}
        {filteredTemplates.some((t) => t.id === "t05") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-sans tabular-nums">05</span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Interactive List-Detail Split View (Inbox / CRM Style)</h3>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  5-column clickable client list paired with a 7-column Detail Inspector. Clicking any client updates the inspector immediately.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setActiveCodeModal({
                    title: "05 List-Detail Split View",
                    code: `<div class="grid grid-cols-1 md:grid-cols-12 border rounded-2xl overflow-hidden divide-x divide-zinc-200">\n  <!-- Master List -->\n  <div class="md:col-span-5 p-4 space-y-2 overflow-y-auto">\n    <div class="p-3 border rounded-xl cursor-pointer"><strong>Zerorapid India</strong><p>₹1,25,000</p></div>\n  </div>\n  <!-- Detail Pane -->\n  <div class="md:col-span-7 p-6 space-y-4">\n    <h2>Customer Dossier</h2>\n  </div>\n</div>`,
                  })
                }
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/15 text-zinc-900 dark:text-white flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Copy Layout Code</span>
              </button>
            </div>

            <div className="p-4 sm:p-6 bg-zinc-50/70 dark:bg-white/[0.02]">
              <div className={`transition-all duration-300 ${frameWidthClass}`}>
                <div className="overflow-hidden border border-zinc-200/80 dark:border-white/10 rounded-xl bg-white dark:bg-[#09090B] shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-12 h-[360px] divide-y md:divide-y-0 md:divide-x divide-zinc-200/80 dark:divide-white/10">
                    
                    {/* Zone: 5-Column Master List */}
                    <div className={`relative md:col-span-5 p-3 flex flex-col justify-between overflow-y-auto bg-zinc-50/40 dark:bg-[#0E0E10] ${zoneGuideClasses}`}>
                      {zoneGuides && (
                        <span className="absolute top-1.5 left-1.5 z-20 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white shadow-xs pointer-events-none">
                          Master List · col-span-5
                        </span>
                      )}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60 dark:border-white/5">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Customer Records</span>
                          <span className="text-[10px] text-zinc-400 font-sans tabular-nums">3 Selected</span>
                        </div>
                        <div className="space-y-1.5 text-xs">
                          {[
                            {
                              name: "Zerorapid India Pvt Ltd",
                              amount: "₹1,25,000",
                              tier: "Enterprise Tier",
                              status: "Paid",
                              contact: "Rahul Verma",
                              notes: "Deccan logistics bridge operational. Annual support agreement signed.",
                              auditDate: "15 Dec 2026",
                            },
                            {
                              name: "Apex Retail Solutions",
                              amount: "₹32,600",
                              tier: "Pro Growth",
                              status: "Pending",
                              contact: "Sneha Patel",
                              notes: "Point of sale synchronization in progress. Awaiting store manager clearance.",
                              auditDate: "20 Dec 2026",
                            },
                            {
                              name: "Kaveri Global Exports",
                              amount: "₹2,10,000",
                              tier: "Enterprise Tier",
                              status: "Paid",
                              contact: "Manoj Kumar",
                              notes: "Container export duty paid. GST input tax credit submitted to portal.",
                              auditDate: "28 Dec 2026",
                            },
                          ].map((client) => {
                            const isSelected = selectedClient.name === client.name;
                            return (
                              <button
                                key={client.name}
                                type="button"
                                onClick={() => setSelectedClient(client)}
                                className={`w-full p-2.5 rounded-lg text-left border space-y-1 transition cursor-pointer ${
                                  isSelected
                                    ? "border-zinc-950 dark:border-white bg-white dark:bg-[#121215] shadow-xs"
                                    : "border-transparent hover:border-zinc-200 dark:hover:border-white/10 bg-white/60 dark:bg-white/5"
                                }`}
                              >
                                <div className="flex justify-between font-bold">
                                  <span>{client.name.split(" ")[0]} {client.name.split(" ")[1] || ""}</span>
                                  <span className="font-sans tabular-nums">{client.amount}</span>
                                </div>
                                <div className="flex justify-between text-[11px] text-zinc-400">
                                  <span>{client.tier}</span>
                                  <span className={client.status === "Paid" ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                                    {client.status}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="text-[10px] text-zinc-400 pt-2 border-t border-zinc-200/60 dark:border-white/5">
                        Click any client row to inspect record live
                      </div>
                    </div>

                    {/* Zone: 7-Column Detail Pane */}
                    <div className={`relative md:col-span-7 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto bg-white dark:bg-[#09090B] ${zoneGuideClasses}`}>
                      {zoneGuides && (
                        <span className="absolute top-1.5 left-1.5 z-20 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white shadow-xs pointer-events-none">
                          Detail Pane · col-span-7
                        </span>
                      )}
                      <div className="space-y-4">
                        <div className="flex items-start justify-between pb-3 border-b border-zinc-100 dark:border-white/5">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-zinc-950 dark:text-white">{selectedClient.name}</h4>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  selectedClient.status === "Paid"
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                    : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                }`}
                              >
                                {selectedClient.status}
                              </span>
                            </div>
                            <span className="text-xs text-zinc-400">{selectedClient.tier}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-zinc-400">Contract Value</span>
                            <div className="text-base font-bold text-zinc-950 dark:text-white font-sans tabular-nums">
                              {selectedClient.amount}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">Operational Notes</span>
                          <p className="text-zinc-600 dark:text-zinc-400 text-[12px] leading-relaxed p-3 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5">
                            {selectedClient.notes}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="p-2.5 rounded-lg border border-zinc-200/60 dark:border-white/5 bg-zinc-50/50 dark:bg-white/5">
                            <span className="text-zinc-400 text-[11px]">Primary Contact</span>
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">{selectedClient.contact}</p>
                          </div>
                          <div className="p-2.5 rounded-lg border border-zinc-200/60 dark:border-white/5 bg-zinc-50/50 dark:bg-white/5">
                            <span className="text-zinc-400 text-[11px]">Next Audit Date</span>
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 font-sans tabular-nums">
                              {selectedClient.auditDate}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-white/5">
                        <button type="button" className="px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300">
                          Download Invoice
                        </button>
                        <button type="button" className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                          Edit Dossier
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
           CODE MODAL
      ========================================================================= */}
      {activeCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 dark:border-white/10">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{activeCodeModal.title}</h4>
              <button
                type="button"
                onClick={() => setActiveCodeModal(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-zinc-950 text-zinc-100 font-sans text-xs overflow-x-auto max-h-[340px]">
              <pre className="whitespace-pre-wrap font-sans leading-relaxed">{activeCodeModal.code}</pre>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-zinc-100 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5">
              <button
                type="button"
                onClick={() => setActiveCodeModal(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(activeCodeModal.code);
                  setCodeCopied(true);
                  setTimeout(() => setCodeCopied(false), 2000);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center gap-1.5 cursor-pointer transition hover:opacity-90"
              >
                {codeCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Layout HTML</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
