"use client";

import React, { useState, useEffect } from "react";
import {
  Check,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Code2,
  X,
  Zap,
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  HardDrive,
  Calendar,
  Layers,
  Activity,
  Radio,
  Package,
  Truck,
  CheckCheck,
  ShieldCheck,
  Bell,
  Copy,
} from "lucide-react";
import { useZeroLight } from "../context";
import { Badge } from "../atoms/badge";

export type IndicatorDensity = "small" | "medium" | "large";
export type IndicatorSpeed = "normal" | "fast" | "paused";

export function SaaSIndicatorLibrary() {
  const { tokens } = useZeroLight();

  // Sticky Bar States
  const [searchQuery, setSearchQuery] = useState("");
  const [density, setDensity] = useState<IndicatorDensity>("medium");
  const [animSpeed, setAnimSpeed] = useState<IndicatorSpeed>("normal");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [speedDropdownOpen, setSpeedDropdownOpen] = useState(false);

  // Modal Code State
  const [activeCodeModal, setActiveCodeModal] = useState<{ title: string; code: string } | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Click outside to close custom popovers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-indicator-popover]")) {
        setSpeedDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Category 1 Interactive States
  const [cycleStatusIndex, setCycleStatusIndex] = useState(0);
  const cycleStatuses = [
    { label: "Active & Live", bg: "bg-emerald-50 text-emerald-800 border-emerald-200", dot: "bg-emerald-500" },
    { label: "Pending Review", bg: "bg-amber-50 text-amber-800 border-amber-200", dot: "bg-amber-500" },
    { label: "Paused Session", bg: "bg-zinc-100 text-zinc-700 border-zinc-200", dot: "bg-zinc-400" },
  ];

  // Category 2 Interactive States
  const [filterTags, setFilterTags] = useState(["Hyderabad", "Over ₹50,000", "This Month"]);

  // Category 3 Interactive States
  const [simulatedProgress, setSimulatedProgress] = useState(50);

  // Dynamic Density Styling
  const densityConfig = {
    small: {
      badgeText: "text-[11px] px-2 py-0.5",
      barHeight: "h-1.5",
      spinnerSize: "w-4 h-4",
      circleSize: 52,
      circleStroke: 4,
      waveHeight: "h-3",
    },
    medium: {
      badgeText: "text-xs px-2.5 py-1",
      barHeight: "h-2",
      spinnerSize: "w-5 h-5",
      circleSize: 64,
      circleStroke: 5,
      waveHeight: "h-4",
    },
    large: {
      badgeText: "text-sm px-3 py-1.5",
      barHeight: "h-2.5",
      spinnerSize: "w-6 h-6",
      circleSize: 76,
      circleStroke: 6,
      waveHeight: "h-5",
    },
  }[density];

  // Animation Play State
  const animationPlayStyle = {
    animationPlayState: animSpeed === "paused" ? "paused" : "running",
    animationDuration: animSpeed === "fast" ? "0.6s" : "1.2s",
  } as React.CSSProperties;

  const categories = [
    { id: "all", label: "All (28)" },
    { id: "cat1", label: "1. Status Badges" },
    { id: "cat2", label: "2. Tags & Counters" },
    { id: "cat3", label: "3. Progress & Quotas" },
    { id: "cat4", label: "4. Spinners & Loaders" },
    { id: "cat5", label: "5. Skeletons" },
    { id: "cat6", label: "6. Trackers & Timelines" },
  ];

  const handleCopyCode = () => {
    if (!activeCodeModal) return;
    navigator.clipboard?.writeText(activeCodeModal.code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Card Container Component
  const Card = ({
    number,
    title,
    category,
    code,
    children,
  }: {
    number: string;
    title: string;
    category: string;
    code: string;
    children: React.ReactNode;
  }) => {
    if (activeCategory !== "all" && activeCategory !== category) return null;
    if (searchQuery.trim() && !title.toLowerCase().includes(searchQuery.toLowerCase())) return null;

    return (
      <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs flex flex-col justify-between gap-4 transition-all hover:border-zinc-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-sans tabular-nums font-bold text-zinc-400">{number}</span>
            <h4 className="text-xs font-bold text-zinc-900 tracking-tight">{title}</h4>
          </div>
          <button
            type="button"
            onClick={() => setActiveCodeModal({ title, code })}
            className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-zinc-950 px-2 py-1 rounded-lg hover:bg-zinc-100 transition cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
        </div>

        <div className="min-h-[48px] flex items-center w-full">{children}</div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-semibold shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── STICKY GLOBAL CONTROL BAR ── */}
      <div className="sticky top-4 z-30 bg-white/95 backdrop-blur-xl border border-zinc-200/90 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-zinc-950 tracking-tight">SaaS Status & Indicator Library</h2>
                <Badge variant="healthy">28 Variants</Badge>
              </div>
              <p className="text-[11px] text-zinc-500">
                Pulsing status dots, progress simulators, SVG rings, skeletons & timelines with global speed control.
              </p>
            </div>
          </div>

          {/* Controls: Search, 3 Density Tiers, Animation Speed Selector */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Live Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search indicators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-950 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-950 w-36 sm:w-44"
              />
            </div>

            {/* 3 Size Density Toggles */}
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-xl border border-zinc-200/60 font-sans">
              {(["small", "medium", "large"] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setDensity(tier)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    density === tier ? "bg-white text-zinc-950 shadow-2xs font-bold" : "text-zinc-500 hover:text-zinc-950"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            {/* Custom Speed Dropdown */}
            <div className="relative" data-indicator-popover>
              <button
                type="button"
                onClick={() => setSpeedDropdownOpen(!speedDropdownOpen)}
                className="px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 hover:bg-zinc-100 transition cursor-pointer"
              >
                <span>Speed: <strong className="capitalize text-zinc-950">{animSpeed}</strong></span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {speedDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white border border-zinc-200 shadow-xl p-1 z-50 text-xs animate-in fade-in duration-150">
                  {(["normal", "fast", "paused"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setAnimSpeed(s);
                        setSpeedDropdownOpen(false);
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left capitalize font-semibold cursor-pointer ${
                        animSpeed === s ? "bg-zinc-950 text-white" : "text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Horizontal Category Filter Pill Rail */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-zinc-100">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                activeCategory === c.id
                  ? "bg-zinc-950 text-white shadow-2xs"
                  : "bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/80"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3-COLUMN RESPONSIVE INDICATOR GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ========================================================================= */}
        {/* 1. STATUS BADGES — ACTIVE, PENDING & ALERTS (6 VARIANTS) */}
        {/* ========================================================================= */}
        <Card
          number="01"
          title="Soft Status Pills"
          category="cat1"
          code={`<div className="flex gap-2">\n  <span className="bg-emerald-50 text-emerald-800 rounded-full">Active</span>\n  <span className="bg-amber-50 text-amber-800 rounded-full">Pending</span>\n</div>`}
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`${densityConfig.badgeText} rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60`}>
              Active
            </span>
            <span className={`${densityConfig.badgeText} rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200/60`}>
              Pending
            </span>
            <span className={`${densityConfig.badgeText} rounded-full font-bold bg-rose-50 text-rose-800 border border-rose-200/60`}>
              Overdue
            </span>
            <span className={`${densityConfig.badgeText} rounded-full font-bold bg-zinc-100 text-zinc-700 border border-zinc-200/60`}>
              Draft
            </span>
          </div>
        </Card>

        <Card
          number="02"
          title="Live Dot Status Badges"
          category="cat1"
          code={`<div className="flex items-center gap-2">\n  <span className="w-2 h-2 rounded-full bg-emerald-500" />\n  <span>Online</span>\n</div>`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Online</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold">
              <span
                style={animationPlayStyle}
                className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"
              />
              <span>Syncing</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-zinc-400" />
              <span>Offline</span>
            </div>
          </div>
        </Card>

        <Card
          number="03"
          title="Solid High-Contrast Badges"
          category="cat1"
          code={`<div className="flex gap-2">\n  <span className="bg-zinc-950 text-white rounded-md font-bold">Verified</span>\n</div>`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className={`${densityConfig.badgeText} rounded-lg font-bold bg-zinc-950 text-white shadow-2xs`}>
              Verified
            </span>
            <span className={`${densityConfig.badgeText} rounded-lg font-bold bg-emerald-600 text-white shadow-2xs`}>
              Paid
            </span>
            <span className={`${densityConfig.badgeText} rounded-lg font-bold bg-rose-600 text-white shadow-2xs`}>
              Action Needed
            </span>
          </div>
        </Card>

        <Card
          number="04"
          title="Icon Status Badges"
          category="cat1"
          code={`<span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800">\n  <CheckCircle2 className="w-3.5 h-3.5" />\n  <span>Approved</span>\n</span>`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Approved</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>In Review</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-900 text-xs font-bold">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Failed</span>
            </span>
          </div>
        </Card>

        <Card
          number="05"
          title="Click-to-Cycle Status Pill"
          category="cat1"
          code={`<button onClick={cycleStatus} className="flex items-center gap-2 px-3 py-1 rounded-full border">\n  <span className="w-2 h-2 rounded-full" />\n  <span>{status.label}</span>\n</button>`}
        >
          <button
            type="button"
            onClick={() => {
              const next = (cycleStatusIndex + 1) % cycleStatuses.length;
              setCycleStatusIndex(next);
              triggerToast(`Status switched to: ${cycleStatuses[next].label}`);
            }}
            className={`flex items-center gap-2 ${densityConfig.badgeText} rounded-full border font-bold transition-all cursor-pointer shadow-2xs hover:scale-105 ${cycleStatuses[cycleStatusIndex].bg}`}
          >
            <span className={`w-2 h-2 rounded-full ${cycleStatuses[cycleStatusIndex].dot}`} />
            <span>{cycleStatuses[cycleStatusIndex].label}</span>
            <RefreshCw className="w-3 h-3 opacity-60 ml-1" />
          </button>
        </Card>

        <Card
          number="06"
          title="Compact Square Tag"
          category="cat1"
          code={`<span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-900 font-bold uppercase text-[10px]">GST Filed</span>`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200/70 text-zinc-900 font-bold uppercase tracking-wider text-[10px] font-sans">
              GST Filed
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold uppercase tracking-wider text-[10px] font-sans">
              Auto-Pay Active
            </span>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 2. PLAN, FEATURE & FILTER TAGS (6 VARIANTS) */}
        {/* ========================================================================= */}
        <Card
          number="07"
          title="Plan & Release Badges"
          category="cat2"
          code={`<div className="flex gap-2">\n  <span className="bg-zinc-950 text-white rounded-full flex items-center gap-1"><Zap />Pro</span>\n</div>`}
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-950 text-white text-xs font-bold shadow-2xs">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>Pro</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold">
              Enterprise
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
              Beta
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider">
              New
            </span>
          </div>
        </Card>

        <Card
          number="08"
          title="Notification Counter Badges"
          category="cat2"
          code={`<div className="flex items-center gap-1.5">\n  <Bell />\n  <span className="bg-zinc-950 text-white rounded-full font-sans tabular-nums">14</span>\n</div>`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800">
              <Bell className="w-3.5 h-3.5 text-zinc-500" />
              <span>Inbox</span>
              <span className="px-1.5 py-0.2 rounded-full bg-zinc-950 text-white text-[10px] font-sans tabular-nums font-bold">
                14
              </span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Alerts</span>
              <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-sans tabular-nums font-bold">
                3
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-800 text-[10px] font-sans tabular-nums font-bold">
              99+
            </span>
          </div>
        </Card>

        <Card
          number="09"
          title="Removable Filter Tags"
          category="cat2"
          code={`<div className="flex gap-2">\n  {tags.map(t => <span key={t}>{t} <button onClick={remove}><X className="w-3 h-3" /></button></span>)}\n</div>`}
        >
          <div className="flex flex-wrap items-center gap-1.5">
            {filterTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => {
                    setFilterTags(filterTags.filter((t) => t !== tag));
                    triggerToast(`Filter removed: ${tag}`);
                  }}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filterTags.length === 0 && (
              <button
                type="button"
                onClick={() => setFilterTags(["Hyderabad", "Over ₹50,000", "This Month"])}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 underline cursor-pointer"
              >
                Reset tags
              </button>
            )}
          </div>
        </Card>

        <Card
          number="10"
          title="Key-Value Attribute Badge"
          category="cat2"
          code={`<div className="inline-flex rounded-lg border overflow-hidden text-xs">\n  <span className="bg-zinc-100 px-2 py-0.5 text-zinc-500 font-bold">Region</span>\n  <span className="bg-white px-2 py-0.5 text-zinc-950 font-semibold">India · HYD</span>\n</div>`}
        >
          <div className="inline-flex items-center rounded-lg border border-zinc-200 overflow-hidden text-xs shadow-2xs font-sans">
            <span className="bg-zinc-100 px-2.5 py-1 text-zinc-500 font-bold border-r border-zinc-200 uppercase text-[10px] tracking-wider">
              Region
            </span>
            <span className="bg-white px-2.5 py-1 text-zinc-950 font-bold">
              India · HYD-01
            </span>
          </div>
        </Card>

        <Card
          number="11"
          title="Trend Change Indicator"
          category="cat2"
          code={`<div className="flex gap-3 font-sans tabular-nums">\n  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">+24.8%</span>\n  <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded">-4.2%</span>\n</div>`}
        >
          <div className="flex items-center gap-3 font-sans tabular-nums">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-bold text-xs">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
              <span>+24.8%</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200/60 font-bold text-xs">
              <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
              <span>-4.2%</span>
            </div>
          </div>
        </Card>

        <Card
          number="12"
          title="AI Powered Tag"
          category="cat2"
          code={`<span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-zinc-900 to-zinc-800 text-white text-xs">\n  <Sparkles className="w-3 h-3 text-amber-400" />\n  <span>Smart Auto-Fill</span>\n</span>`}
        >
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950 text-white text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Smart Auto-Fill</span>
          </span>
        </Card>

        {/* ========================================================================= */}
        {/* 3. PROGRESS BARS & USAGE METERS (6 VARIANTS) */}
        {/* ========================================================================= */}
        <Card
          number="13"
          title="Simple Progress Bar with Percent"
          category="cat3"
          code={`<div className="space-y-1 w-full">\n  <div className="flex justify-between font-sans tabular-nums text-xs"><span>Syncing</span><span>72%</span></div>\n  <div className="w-full bg-zinc-100 rounded-full h-2"><div style={{ width: '72%' }} className="h-full bg-zinc-950 rounded-full" /></div>\n</div>`}
        >
          <div className="space-y-1.5 w-full">
            <div className="flex items-center justify-between text-xs font-sans tabular-nums">
              <span className="font-semibold text-zinc-700">Cluster Hydration</span>
              <span className="font-bold text-zinc-950">72%</span>
            </div>
            <div className={`w-full bg-zinc-100 rounded-full ${densityConfig.barHeight} overflow-hidden`}>
              <div style={{ width: "72%" }} className="h-full bg-zinc-950 rounded-full" />
            </div>
          </div>
        </Card>

        <Card
          number="14"
          title="Interactive Progress Simulator"
          category="cat3"
          code={`<div className="w-full">\n  <button onClick={inc}>+25%</button>\n  <div style={{ width: \`\${progress}%\` }} />\n</div>`}
        >
          <div className="space-y-2 w-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans tabular-nums font-bold text-zinc-900">
                {simulatedProgress}% Completed
              </span>
              <button
                type="button"
                onClick={() => {
                  const next = simulatedProgress >= 100 ? 25 : simulatedProgress + 25;
                  setSimulatedProgress(next);
                  triggerToast(`Progress advanced to ${next}%`);
                }}
                className="px-2.5 py-0.5 rounded-lg bg-zinc-950 text-white text-[11px] font-bold hover:bg-zinc-800 transition cursor-pointer"
              >
                +25% Step
              </button>
            </div>
            <div className={`w-full bg-zinc-100 rounded-full ${densityConfig.barHeight} overflow-hidden`}>
              <div
                style={{ width: `${simulatedProgress}%` }}
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              />
            </div>
          </div>
        </Card>

        <Card
          number="15"
          title="Storage & Plan Limit Meter"
          category="cat3"
          code={`<div className="w-full">\n  <span>8.4 GB of 10 GB used</span>\n  <div style={{ width: '84%' }} className="bg-amber-500" />\n</div>`}
        >
          <div className="space-y-1.5 w-full">
            <div className="flex items-center justify-between text-xs font-sans tabular-nums">
              <div className="flex items-center gap-1.5 text-zinc-700 font-semibold">
                <HardDrive className="w-3.5 h-3.5 text-zinc-500" />
                <span>SSD Storage</span>
              </div>
              <span className="font-bold text-zinc-950">8.4 GB of 10 GB</span>
            </div>
            <div className={`w-full bg-zinc-100 rounded-full ${densityConfig.barHeight} overflow-hidden`}>
              <div style={{ width: "84%" }} className="h-full bg-amber-500 rounded-full" />
            </div>
          </div>
        </Card>

        <Card
          number="16"
          title="Segmented Milestone Bar"
          category="cat3"
          code={`<div className="flex gap-1.5 w-full">\n  {[1,2,3,4].map(s => <div className={done ? "bg-zinc-950" : "bg-zinc-200"} />)}\n</div>`}
        >
          <div className="space-y-1.5 w-full">
            <div className="flex items-center justify-between text-xs font-sans tabular-nums">
              <span className="font-semibold text-zinc-700">Account Checklist</span>
              <span className="font-bold text-zinc-950">3 of 4 done</span>
            </div>
            <div className="flex items-center gap-1.5 w-full">
              {[1, 2, 3].map((step) => (
                <div key={step} className={`flex-1 rounded-full ${densityConfig.barHeight} bg-zinc-950`} />
              ))}
              <div className={`flex-1 rounded-full ${densityConfig.barHeight} bg-zinc-200`} />
            </div>
          </div>
        </Card>

        <Card
          number="17"
          title="Circular Progress Ring"
          category="cat3"
          code={`<svg width="64" height="64">\n  <circle stroke="#E4E4E7" />\n  <circle stroke="#09090B" strokeDasharray="188" strokeDashoffset="47" />\n  <text>75%</text>\n</svg>`}
        >
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <svg
                width={densityConfig.circleSize}
                height={densityConfig.circleSize}
                className="transform -rotate-90"
              >
                <circle
                  cx={densityConfig.circleSize / 2}
                  cy={densityConfig.circleSize / 2}
                  r={(densityConfig.circleSize - densityConfig.circleStroke * 2) / 2}
                  stroke="#E4E4E7"
                  strokeWidth={densityConfig.circleStroke}
                  fill="none"
                />
                <circle
                  cx={densityConfig.circleSize / 2}
                  cy={densityConfig.circleSize / 2}
                  r={(densityConfig.circleSize - densityConfig.circleStroke * 2) / 2}
                  stroke="#09090B"
                  strokeWidth={densityConfig.circleStroke}
                  strokeDasharray={2 * Math.PI * ((densityConfig.circleSize - densityConfig.circleStroke * 2) / 2)}
                  strokeDashoffset={
                    2 * Math.PI * ((densityConfig.circleSize - densityConfig.circleStroke * 2) / 2) * (1 - 0.75)
                  }
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute font-sans tabular-nums text-xs font-bold text-zinc-950">
                75%
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-950 block">Audit Score</span>
              <span className="text-[11px] text-zinc-400 block font-medium">SOC2 verified</span>
            </div>
          </div>
        </Card>

        <Card
          number="18"
          title="Continuous Activity Bar"
          category="cat3"
          code={`<div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">\n  <div className="w-1/3 bg-zinc-950 rounded-full animate-indeterminate" />\n</div>`}
        >
          <div className="space-y-1.5 w-full">
            <span className="text-xs font-semibold text-zinc-700 block">Edge Replication</span>
            <div className={`w-full bg-zinc-100 rounded-full ${densityConfig.barHeight} overflow-hidden relative`}>
              <div
                style={animationPlayStyle}
                className="absolute inset-y-0 left-0 w-1/3 bg-zinc-950 rounded-full animate-pulse"
              />
            </div>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 4. SPINNERS & LIVE LOADERS (4 VARIANTS) */}
        {/* ========================================================================= */}
        <Card
          number="19"
          title="Clean Ring Spinner"
          category="cat4"
          code={`<div className="flex items-center gap-2.5">\n  <div className="w-5 h-5 rounded-full border-2 border-zinc-200 border-t-zinc-950 animate-spin" />\n  <span>Loading records...</span>\n</div>`}
        >
          <div className="flex items-center gap-3">
            <div
              style={animationPlayStyle}
              className={`${densityConfig.spinnerSize} rounded-full border-2 border-zinc-200 border-t-zinc-950 animate-spin shrink-0`}
            />
            <span className="text-xs font-semibold text-zinc-800">Loading cluster telemetry...</span>
          </div>
        </Card>

        <Card
          number="20"
          title="Three Bouncing Dots"
          category="cat4"
          code={`<div className="flex items-center gap-1.5">\n  {[1,2,3].map(d => <span className="w-2 h-2 rounded-full bg-zinc-950 animate-bounce" />)}\n  <span>AI is thinking...</span>\n</div>`}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {[0, 150, 300].map((delay, i) => (
                <span
                  key={i}
                  style={{ ...animationPlayStyle, animationDelay: `${delay}ms` }}
                  className="w-2 h-2 rounded-full bg-zinc-950 animate-bounce"
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-zinc-800">AI is synthesizing layout...</span>
          </div>
        </Card>

        <Card
          number="21"
          title="Audio & AI Wave Loader"
          category="cat4"
          code={`<div className="flex items-center gap-1">\n  {[4,8,12,6,10].map(h => <div className="w-1 bg-zinc-950 animate-pulse" />)}\n</div>`}
        >
          <div className="flex items-center gap-3">
            <div className={`flex items-end gap-1 ${densityConfig.waveHeight}`}>
              {[12, 20, 16, 24, 14, 22].map((h, i) => (
                <div
                  key={i}
                  style={{
                    height: `${h}px`,
                    ...animationPlayStyle,
                    animationDelay: `${i * 120}ms`,
                  }}
                  className="w-1 bg-zinc-950 rounded-full animate-pulse"
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-zinc-800">Streaming voice token...</span>
          </div>
        </Card>

        <Card
          number="22"
          title="Inline Button Loader"
          category="cat4"
          code={`<button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 text-white text-xs font-semibold">\n  <RefreshCw className="animate-spin" />\n  <span>Saving changes...</span>\n</button>`}
        >
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 text-white text-xs font-semibold shadow-xs cursor-default"
          >
            <RefreshCw
              style={animationPlayStyle}
              className="w-3.5 h-3.5 animate-spin text-zinc-300"
            />
            <span>Saving changes...</span>
          </button>
        </Card>

        {/* ========================================================================= */}
        {/* 5. LOADING PLACEHOLDERS — SKELETONS (3 VARIANTS) */}
        {/* ========================================================================= */}
        <Card
          number="23"
          title="User Row Loading Placeholder"
          category="cat5"
          code={`<div className="flex items-center gap-3 w-full animate-pulse">\n  <div className="w-8 h-8 rounded-full bg-zinc-200" />\n  <div className="space-y-1.5 flex-1"><div className="h-3 bg-zinc-200 rounded" /><div className="h-2 w-2/3 bg-zinc-200 rounded" /></div>\n</div>`}
        >
          <div
            style={animationPlayStyle}
            className="flex items-center gap-3 w-full animate-pulse"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-200 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 bg-zinc-200 rounded-md w-3/4" />
              <div className="h-2 bg-zinc-100 rounded-md w-1/2" />
            </div>
          </div>
        </Card>

        <Card
          number="24"
          title="Text Paragraph Placeholder"
          category="cat5"
          code={`<div className="space-y-2 w-full animate-pulse">\n  <div className="h-3 bg-zinc-200 rounded w-full" />\n  <div className="h-3 bg-zinc-200 rounded w-5/6" />\n  <div className="h-3 bg-zinc-200 rounded w-2/3" />\n</div>`}
        >
          <div
            style={animationPlayStyle}
            className="space-y-2 w-full animate-pulse"
          >
            <div className="h-2.5 bg-zinc-200 rounded-md w-full" />
            <div className="h-2.5 bg-zinc-200 rounded-md w-4/5" />
            <div className="h-2.5 bg-zinc-100 rounded-md w-3/5" />
          </div>
        </Card>

        <Card
          number="25"
          title="Metric Card Placeholder"
          category="cat5"
          code={`<div className="p-3 border rounded-xl w-full animate-pulse space-y-2">\n  <div className="h-2.5 bg-zinc-200 rounded w-1/3" />\n  <div className="h-6 bg-zinc-200 rounded w-1/2" />\n</div>`}
        >
          <div
            style={animationPlayStyle}
            className="p-3 rounded-xl border border-zinc-200 bg-white w-full animate-pulse space-y-2 shadow-2xs"
          >
            <div className="h-2.5 bg-zinc-200 rounded-md w-1/3" />
            <div className="h-5 bg-zinc-200 rounded-md w-1/2" />
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 6. STEP TRACKERS & ORDER TIMELINES (3 VARIANTS) */}
        {/* ========================================================================= */}
        <Card
          number="26"
          title="Horizontal 3-Step Indicator"
          category="cat6"
          code={`<div className="flex items-center gap-2 w-full text-xs font-semibold">\n  <span className="text-emerald-700">✓ Details</span>\n  <span>—</span>\n  <span className="text-zinc-950 font-bold">2 Billing</span>\n  <span>—</span>\n  <span className="text-zinc-400">3 Done</span>\n</div>`}
        >
          <div className="flex items-center gap-2 w-full text-xs font-semibold font-sans">
            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Details</span>
            </span>
            <span className="text-zinc-300 font-bold">—</span>
            <span className="flex items-center gap-1.5 text-zinc-950 font-bold px-2 py-0.5 rounded-md bg-zinc-100">
              <span className="w-4 h-4 rounded-full bg-zinc-950 text-white flex items-center justify-center text-[10px] tabular-nums font-bold">
                2
              </span>
              <span>Billing</span>
            </span>
            <span className="text-zinc-300 font-bold">—</span>
            <span className="text-zinc-400 font-medium px-1">
              3 Done
            </span>
          </div>
        </Card>

        <Card
          number="27"
          title="Vertical Status Timeline"
          category="cat6"
          code={`<div className="space-y-3 border-l-2 pl-3 text-xs">\n  <div><p>Order Confirmed</p><p>10:15 AM</p></div>\n  <div><p>Out for Delivery</p><p>Now</p></div>\n</div>`}
        >
          <div className="space-y-2.5 border-l-2 border-zinc-200 pl-3.5 text-xs font-sans relative my-1">
            <div className="relative">
              <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-2xs" />
              <span className="font-bold text-zinc-900 block leading-tight">Order Confirmed</span>
              <span className="text-[10px] text-zinc-400 font-sans tabular-nums">10:15 AM • Payment Verified</span>
            </div>
            <div className="relative">
              <div
                style={animationPlayStyle}
                className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white shadow-2xs animate-ping"
              />
              <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 border-2 border-white shadow-2xs" />
              <span className="font-bold text-indigo-950 block leading-tight">Out for Delivery</span>
              <span className="text-[10px] text-indigo-600 font-bold font-sans tabular-nums">Now • Courier En Route</span>
            </div>
          </div>
        </Card>

        <Card
          number="28"
          title="SLA Health Bar (10-Day Uptime)"
          category="cat6"
          code={`<div className="space-y-1.5 w-full">\n  <div className="flex justify-between text-xs"><span>99.9% Uptime</span></div>\n  <div className="flex gap-1">{[1..10].map(d => <div className="h-6 flex-1 bg-emerald-500 rounded" />)}</div>\n</div>`}
        >
          <div className="space-y-2 w-full">
            <div className="flex items-center justify-between text-xs font-sans tabular-nums">
              <div className="flex items-center gap-1.5 text-zinc-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>System Operational</span>
              </div>
              <span className="font-bold text-emerald-700">99.98% SLA</span>
            </div>
            <div className="flex items-center gap-1 w-full">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  title={`Day ${10 - i}: 100% Uptime`}
                  className="h-5 flex-1 rounded bg-emerald-500 hover:bg-emerald-600 transition cursor-pointer"
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-400 font-sans tabular-nums font-semibold">
              <span>10 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ── CODE MODAL ── */}
      {activeCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-950 border border-white/10 text-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {activeCodeModal.title} TSX Snippet
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCodeModal(null)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-black/50 border border-white/10 font-sans tabular-nums text-xs text-zinc-300 overflow-x-auto leading-relaxed">
              <code>{activeCodeModal.code}</code>
            </pre>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveCodeModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-4 py-2 rounded-xl bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{codeCopied ? "Copied" : "Copy TSX Code"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
