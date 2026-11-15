"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Copy,
  Check,
  X,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Code,
  WifiOff,
  RefreshCw,
  PanelRight,
  Inbox,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useZeroLight } from "../context";
import { LibraryHeader, CodeModal } from "./common";

export type MotionCurve = "snappy" | "damped" | "gentle" | "instant";

export function SaaSEdgeCasesLibrary() {
  const { tokens } = useZeroLight();

  // Sticky Bar States
  const [searchQuery, setSearchQuery] = useState("");
  const [motionCurve, setMotionCurve] = useState<MotionCurve>("snappy");
  const [isStressTest, setIsStressTest] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Code Modal State
  const [activeCodeModal, setActiveCodeModal] = useState<{ title: string; code: string } | null>(null);

  // Pattern 01: Copy State
  const [p01Copied, setP01Copied] = useState(false);

  // Pattern 02: Line Clamp Expanded State
  const [p02Expanded, setP02Expanded] = useState(false);

  // Pattern 06: Offline Simulation State
  const [p06Offline, setP06Offline] = useState(false);

  // Pattern 08: Stagger Replay Key
  const [p08Key, setP08Key] = useState(0);

  // Pattern 09: Sample Drawer State
  const [isSampleDrawerOpen, setIsSampleDrawerOpen] = useState(false);

  // Pattern 10: Skeleton vs Loaded State
  const [p10IsSkeleton, setP10IsSkeleton] = useState(true);

  // Pattern 12: Auto-retry Countdown State
  const [p12Countdown, setP12Countdown] = useState(4);
  const [p12Retrying, setP12Retrying] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setP12Countdown((prev) => {
        if (prev <= 1) {
          setP12Retrying(true);
          setTimeout(() => setP12Retrying(false), 800);
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Motion Style Mapping
  const motionStyle = {
    snappy: "transition-all duration-150 ease-[cubic-bezier(0.19,1,0.22,1)]",
    damped: "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
    gentle: "transition-all duration-350 ease-[cubic-bezier(0.25,1,0.5,1)]",
    instant: "transition-none",
  }[motionCurve];

  const categories = [
    { id: "all", label: "All Patterns", count: 12 },
    { id: "typography", label: "Typography & Truncation", count: 3 },
    { id: "metrics", label: "Metrics & Zero States", count: 3 },
    { id: "motion", label: "Motion Physics", count: 3 },
    { id: "recovery", label: "Recovery & Skeletons", count: 3 },
  ];

  const patterns = [
    { id: "p01", cat: "typography", num: "01", title: "Single-Line Truncation with One-Click Copy & Tooltip", desc: "Never breaks container bounds. Exposes full value on hover and one-click copy." },
    { id: "p02", cat: "typography", num: "02", title: "Multi-Line Clamp with Interactive Read More Toggle", desc: "Strict line-clamp-2 preserves vertical card rhythm with inline expansion." },
    { id: "p03", cat: "typography", num: "03", title: "Wrapping Tag & Badge Cloud with Dynamic +N More Counter", desc: "Flex wrap layout gracefully folds multiple tags without blowing out tables." },
    { id: "p04", cat: "metrics", num: "04", title: "Zero, Negative & Large Value Formatter", desc: "Clean zero handling and distinct red treatment for credit note adjustments." },
    { id: "p05", cat: "metrics", num: "05", title: "Tabular-Nums KPI Strip with Dynamic Delta Arrows", desc: "Prevents jitter during real-time streaming updates with fixed character widths." },
    { id: "p06", cat: "metrics", num: "06", title: "Currency Rate Fallback & Offline Sync Warning", desc: "Gracefully indicates cached values when RBI or bank exchange rates are unreachable." },
    { id: "p07", cat: "motion", num: "07", title: "Spring Physics Interactive Button & Elevation Card", desc: "Subtle active:scale-[0.98] depression mimics physical tactile hardware switches." },
    { id: "p08", cat: "motion", num: "08", title: "Staggered List Item Entrance with Gesture Spring", desc: "Sequential 40ms stagger delays avoid visual cognitive overwhelm on table load." },
    { id: "p09", cat: "motion", num: "09", title: "Smooth Easing Slide-Over Drawer with Backdrop Blur", desc: "Non-blocking progressive disclosure with hardware-accelerated translateX." },
    { id: "p10", cat: "recovery", num: "10", title: "Geometric Skeleton Shimmer Placeholder Grid", desc: "Zero layout shift (CLS 0.0) by mirroring loaded card height and widths." },
    { id: "p11", cat: "recovery", num: "11", title: "Actionable Zero-State Empty Canvas with Primary CTA", desc: "Avoids dead ends by guiding users immediately toward their primary action." },
    { id: "p12", cat: "recovery", num: "12", title: "Network Timeout Error Card with Live Retry Countdown Loop", desc: "Self-healing network error card with active countdown timer & manual trigger." },
  ];

  const filteredPatterns = patterns.filter((p) => {
    const matchCategory = activeCategory === "all" || p.cat === activeCategory;
    const matchSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.num.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* =========================================================================
           STICKY GLOBAL CONTROL BAR (SLIMMED UTILITY BAR)
      ========================================================================= */}
      <LibraryHeader
        countText={`${filteredPatterns.length} of 12 Patterns Active`}
        description="Resilience: Truncation, extreme metrics, spring physics curves & network recovery."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search edge cases..."
        action={
          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-xs">
              {(["snappy", "damped", "gentle", "instant"] as MotionCurve[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setMotionCurve(c)}
                  className={`px-2 py-1 rounded-md capitalize transition cursor-pointer ${
                    motionCurve === c
                      ? "font-semibold bg-white dark:bg-white/15 text-zinc-950 dark:text-white shadow-xs"
                      : "font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsStressTest(!isStressTest)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 shadow-xs ${
                isStressTest
                  ? "border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                  : "border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/70"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{isStressTest ? "Stress Test: ON!" : "Stress Test: Off"}</span>
            </button>
          </div>
        }
      />

      <div className="space-y-8">
        {/* ── 1. TYPOGRAPHY & TRUNCATION ── */}
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
              1. Typography & Truncation
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Single-line ellipsis, multi-line clamps & long non-breaking string containment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pattern 01: Single-Line Truncation */}
        {filteredPatterns.some((p) => p.id === "p01") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-sans tabular-nums">01</span>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Single-Line Ellipsis</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "01 Single-Line Truncation",
                      code: `<div class="flex items-center justify-between gap-2">\n  <span class="truncate text-xs font-bold" title="Long Title">Long Title...</span>\n  <button onclick="copy()">Copy</button>\n</div>`,
                    })
                  }
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">Never breaks container bounds. Exposes full value on hover and one-click copy.</p>

              <div className="p-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-1.5">
                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Legal Entity Title</span>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-xs font-bold text-zinc-950 dark:text-white truncate"
                    title={
                      isStressTest
                        ? "HubSpot International Holdings & Global Cloud Infrastructure Operations Private Limited"
                        : "Zerorapid India Private Limited (Regional Logistics Hub)"
                    }
                  >
                    {isStressTest
                      ? "HubSpot International Holdings & Global Cloud Infrastructure Operations Private Limited"
                      : "Zerorapid India Private Limited (Regional Logistics Hub)"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        isStressTest
                          ? "HubSpot International Holdings & Global Cloud Infrastructure Operations Private Limited"
                          : "Zerorapid India Private Limited (Regional Logistics Hub)"
                      );
                      setP01Copied(true);
                      setTimeout(() => setP01Copied(false), 1500);
                    }}
                    className="shrink-0 p-1 rounded hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-500 hover:text-zinc-900 transition cursor-pointer"
                    title="Copy full title"
                  >
                    {p01Copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[10px] text-zinc-400 flex justify-between">
              <span>Class: truncate</span>
              <span className="font-sans tabular-nums">Max Width: 100%</span>
            </div>
          </div>
        )}

        {/* Pattern 02: Multi-Line Clamp */}
        {filteredPatterns.some((p) => p.id === "p02") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-sans tabular-nums">02</span>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Multi-Line 2-Line Clamp</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "02 Multi-Line Line Clamp",
                      code: `<p class="line-clamp-2 text-xs leading-relaxed">\n  Detailed audit logs...\n</p>\n<button onclick="toggle()">Show more</button>`,
                    })
                  }
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">Strict line-clamp-2 preserves vertical card rhythm with inline expansion.</p>

              <div className="p-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-1.5 text-xs">
                <p className={`text-zinc-600 dark:text-zinc-300 text-[12px] leading-relaxed transition-all ${p02Expanded ? "" : "line-clamp-2"}`}>
                  {isStressTest
                    ? "GST audit discrepancy flagged under Section 16(4) regarding invoice #INV-9042. Credit reversal of ₹1,48,200 pending reconciliation with Central Board of Indirect Taxes and Customs portal across multiple state tax jurisdictions."
                    : "The Indian Goods and Services Tax input tax credit reconciliation was verified against GSTR-2B filings across ICICI RTGS settlements without discrepancy."}
                </p>
                <button
                  type="button"
                  onClick={() => setP02Expanded(!p02Expanded)}
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  {p02Expanded ? "Show less ↑" : "Show more ↓"}
                </button>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[10px] text-zinc-400 flex justify-between">
              <span>Class: line-clamp-2</span>
              <span>Smooth Toggle</span>
            </div>
          </div>
        )}

        {/* Pattern 03: Tag Overflow Wrapping */}
        {filteredPatterns.some((p) => p.id === "p03") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-sans tabular-nums">03</span>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Tag Overflow Wrapping</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "03 Tag Overflow Wrap",
                      code: `<div class="flex flex-wrap gap-1.5">\n  <span class="px-2 py-0.5 rounded text-[10px] bg-zinc-100">Tag 1</span>\n  <span class="px-2 py-0.5 rounded text-[10px] bg-blue-100">+3 More</span>\n</div>`,
                    })
                  }
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">Flex wrap layout gracefully folds multiple tags without blowing out tables.</p>

              <div className="p-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-white/10 border border-zinc-200/80 dark:border-white/10 text-zinc-800 dark:text-zinc-200">GST-18%</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-white/10 border border-zinc-200/80 dark:border-white/10 text-zinc-800 dark:text-zinc-200">Enterprise</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-white/10 border border-zinc-200/80 dark:border-white/10 text-zinc-800 dark:text-zinc-200">RTGS</span>
                {isStressTest && (
                  <>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-white/10 border border-zinc-200/80 text-zinc-800">Tally-v4.1</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-white/10 border border-zinc-200/80 text-zinc-800">Audited</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-sans tabular-nums">+6 More</span>
                  </>
                )}
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[10px] text-zinc-400 flex justify-between">
              <span>Container: flex-wrap</span>
              <span className="font-sans tabular-nums">Zero Overflow</span>
            </div>
          </div>
        )}

                  </div>
        </section>

        {/* ── 2. METRICS & ZERO STATES ── */}
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
              2. Metrics & Zero States
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Extreme numeric formats, null telemetry metrics & responsive tabular number alignment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pattern 04: Zero, Negative & Large Value Formatter */}
        {filteredPatterns.some((p) => p.id === "p04") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-sans tabular-nums">04</span>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Zero & Negative Metrics</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "04 Zero & Negative Numbers",
                      code: `<span class="text-red-600 font-sans tabular-nums font-bold">-₹14,200</span>\n<span class="text-zinc-400 font-sans tabular-nums font-bold">₹0.00</span>`,
                    })
                  }
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">Clean zero handling and distinct red treatment for credit note adjustments.</p>

              <div className="p-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Unsettled Returns</span>
                  <span className="font-bold text-red-600 font-sans tabular-nums">
                    {isStressTest ? "-₹48,200 (Credit Note Issued)" : "-₹14,200"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Pending Dispute Balance</span>
                  <span className="font-bold text-zinc-400 font-sans tabular-nums">
                    {isStressTest ? "₹0.00 (Zero Balance)" : "₹0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Annual Gross Scaled</span>
                  <span className="font-bold text-zinc-950 dark:text-white font-sans tabular-nums">
                    {isStressTest ? "₹124.8 Cr (Large Cap)" : "₹12.48 Cr"}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[10px] text-zinc-400 flex justify-between">
              <span>Font: tabular-nums</span>
              <span>Zero Monospace</span>
            </div>
          </div>
        )}

        {/* Pattern 05: Tabular-Nums KPI Strip */}
        {filteredPatterns.some((p) => p.id === "p05") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-sans tabular-nums">05</span>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">KPI Delta Arrows</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "05 Tabular-Nums Delta Strip",
                      code: `<div class="flex items-baseline gap-2 font-sans tabular-nums">\n  <span class="text-2xl font-bold">98.42%</span>\n  <span class="text-xs text-emerald-600">+1.2%</span>\n</div>`,
                    })
                  }
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">Prevents jitter during real-time streaming updates with fixed character widths.</p>

              <div className="p-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Average Retention</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold font-sans tabular-nums text-zinc-950 dark:text-white">
                    {isStressTest ? "100.00%" : "98.42%"}
                  </span>
                  <span className={`text-xs font-bold flex items-center gap-0.5 font-sans tabular-nums ${isStressTest ? "text-red-500" : "text-emerald-600"}`}>
                    {isStressTest ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                    <span>{isStressTest ? "-0.00%" : "+1.2%"}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[10px] text-zinc-400 flex justify-between">
              <span>Jitter-free font rendering</span>
              <span>Delta verified</span>
            </div>
          </div>
        )}

        {/* Pattern 06: Currency Rate Fallback */}
        {filteredPatterns.some((p) => p.id === "p06") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-sans tabular-nums">06</span>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Offline Ledger Fallback</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "06 Offline Fallback Warning",
                      code: `<div class="p-2 bg-amber-50 text-amber-800 rounded-lg text-xs flex gap-2">\n  <span>Cached offline. Live sync pending.</span>\n</div>`,
                    })
                  }
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">Gracefully indicates cached values when RBI or bank exchange rates are unreachable.</p>

              <div className="p-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">USD to INR Rate</span>
                  <span className={`font-bold font-sans tabular-nums ${p06Offline ? "text-zinc-400" : ""}`}>₹84.42</span>
                </div>
                {(p06Offline || isStressTest) && (
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 text-[11px] flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Cached offline. Live RBI sync pending reconnect.</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setP06Offline(!p06Offline)}
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  {p06Offline ? "Reconnect Live Feed" : "Simulate Offline Disconnect"}
                </button>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[10px] text-zinc-400 flex justify-between">
              <span>Fallback: Local Cache</span>
              <span>Fail-Safe</span>
            </div>
          </div>
        )}

                  </div>
        </section>

        {/* ── 3. MOTION PHYSICS ENGINE ── */}
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
              3. Motion Physics Engine
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Tactile scale-95 press physics, stagger entrance choreography & slide-over sheets.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pattern 07: Tactile Press Physics */}
        {filteredPatterns.some((p) => p.id === "p07") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-sans tabular-nums">07</span>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Tactile Press Physics</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "07 Spring Physics Button",
                      code: `<button class="transition-transform duration-150 active:scale-[0.97] hover:scale-[1.02] bg-zinc-950 text-white px-4 py-2 rounded-xl text-xs">\n  Interactive Spring Button\n</button>`,
                    })
                  }
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">Subtle active:scale-[0.98] depression mimics physical tactile hardware switches.</p>

              <div className="p-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-3 flex flex-col items-center justify-center py-6">
                <button className={`${motionStyle} px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md hover:scale-[1.02] active:scale-[0.97] cursor-pointer`}>
                  Interactive Spring Button
                </button>
                <span className="text-[10px] text-zinc-400">Click & hold to test spring recoil</span>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[10px] text-zinc-400 flex justify-between">
              <span>CSS: active:scale-[0.97]</span>
              <span>Recoil Physics</span>
            </div>
          </div>
        )}

        {/* Pattern 08: Staggered List Entrance */}
        {filteredPatterns.some((p) => p.id === "p08") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-sans tabular-nums">08</span>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Staggered List Entrance</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "08 Staggered List Entrance",
                      code: `<div class="space-y-1">\n  <div style="transition-delay: 40ms" class="p-2 border rounded-lg">Item 1</div>\n  <div style="transition-delay: 80ms" class="p-2 border rounded-lg">Item 2</div>\n</div>`,
                    })
                  }
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">Sequential 40ms stagger delays avoid visual cognitive overwhelm on table load.</p>

              <div key={p08Key} className="space-y-1.5 text-xs animate-in fade-in duration-200">
                <div className="p-2 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 flex justify-between items-center hover:translate-x-1 transition-transform">
                  <span>1. Ledger Verified</span>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="p-2 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 flex justify-between items-center hover:translate-x-1 transition-transform">
                  <span>2. Tax Calculation</span>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="p-2 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 flex justify-between items-center hover:translate-x-1 transition-transform">
                  <span>3. Settlement Release</span>
                  <span className="font-bold font-sans tabular-nums text-blue-600">Syncing</span>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[10px] text-zinc-400 flex justify-between">
              <button
                type="button"
                onClick={() => setP08Key(p08Key + 1)}
                className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer"
              >
                Replay Entrance
              </button>
              <span className="font-sans tabular-nums">40ms Stagger</span>
            </div>
          </div>
        )}

        {/* Pattern 09: Slide-Over Drawer Spring */}
        {filteredPatterns.some((p) => p.id === "p09") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-sans tabular-nums">09</span>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Slide-Over Drawer Spring</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "09 Slide-Over Drawer",
                      code: `<aside class="fixed right-0 top-0 bottom-0 w-96 bg-white border-l transition-transform duration-250 ease-out translate-x-full">\n  <div class="p-5">Drawer Content</div>\n</aside>`,
                    })
                  }
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">Non-blocking progressive disclosure with hardware-accelerated translateX.</p>

              <div className="p-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-3 flex flex-col items-center justify-center py-6">
                <button
                  type="button"
                  onClick={() => setIsSampleDrawerOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-white/10 border border-zinc-200/80 dark:border-white/10 text-zinc-900 dark:text-white shadow-xs hover:bg-zinc-100 cursor-pointer flex items-center gap-1.5"
                >
                  <PanelRight className="w-3.5 h-3.5" />
                  <span>Open Slide-Over Drawer</span>
                </button>
                <span className="text-[10px] text-zinc-400">Tests cubic-bezier physics curve</span>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[10px] text-zinc-400 flex justify-between">
              <span>Curve: cubic-bezier</span>
              <span>Backdrop Blur</span>
            </div>
          </div>
        )}

                  </div>
        </section>

        {/* ── 4. RECOVERY & SKELETONS ── */}
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
              4. Recovery & Skeletons
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Geometric shimmer skeletons, optimistic updates & automated retry countdown banners.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pattern 10: Geometric Skeleton Shimmer */}
        {filteredPatterns.some((p) => p.id === "p10") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-sans tabular-nums">10</span>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Exact Shimmer Skeletons</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "10 Exact Skeleton Shimmer",
                      code: `<div class="shimmer-bg h-4 w-1/3 bg-zinc-200 rounded"></div>\n<div class="shimmer-bg h-6 w-2/3 bg-zinc-200 rounded"></div>`,
                    })
                  }
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">Zero layout shift (CLS 0.0) by mirroring loaded card height and widths.</p>

              <div className="p-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-2.5">
                {p10IsSkeleton ? (
                  <>
                    <div className="h-4 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-6 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                  </>
                ) : (
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-400">Total Billed</span>
                    <div className="text-xl font-bold font-sans tabular-nums text-zinc-950 dark:text-white">₹48,20,000</div>
                    <span className="text-[10px] text-emerald-600 font-bold">+18.4% vs last month</span>
                  </div>
                )}
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[10px] text-zinc-400 flex justify-between">
              <button
                type="button"
                onClick={() => setP10IsSkeleton(!p10IsSkeleton)}
                className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer"
              >
                {p10IsSkeleton ? "Toggle Loaded Content" : "Toggle Skeleton Shimmer"}
              </button>
              <span>CLS: 0.00</span>
            </div>
          </div>
        )}

        {/* Pattern 11: Actionable Zero-State Empty Canvas */}
        {filteredPatterns.some((p) => p.id === "p11") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-sans tabular-nums">11</span>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Actionable Empty Canvas</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "11 Actionable Empty State",
                      code: `<div class="border-2 border-dashed p-8 rounded-xl text-center space-y-2">\n  <h4>No Invoices Found</h4>\n  <button class="bg-zinc-950 text-white px-3 py-1.5 rounded-lg text-xs">+ Create Invoice</button>\n</div>`,
                    })
                  }
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">Avoids dead ends by guiding users immediately toward their primary action.</p>

              <div className="p-6 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-xl text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/10 mx-auto flex items-center justify-center text-zinc-400">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-950 dark:text-white">No Invoices Generated Yet</p>
                  <p className="text-[10px] text-zinc-400">Start billing your institutional clients today.</p>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs cursor-pointer"
                >
                  + Create First Invoice
                </button>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[10px] text-zinc-400 flex justify-between">
              <span>Primary CTA: Included</span>
              <span>Zero Dead-Ends</span>
            </div>
          </div>
        )}

        {/* Pattern 12: Network Timeout Error Card */}
        {filteredPatterns.some((p) => p.id === "p12") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-sans tabular-nums">12</span>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Live Auto-Retry Loop</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "12 Network Timeout Auto-Retry",
                      code: `<div class="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex justify-between">\n  <span>Gateway Timeout (504)</span>\n  <button onclick="retry()">Retry Now</button>\n</div>`,
                    })
                  }
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">Self-healing network error card with active countdown timer & manual trigger.</p>

              <div className="p-3 bg-red-50/60 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/30 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-bold">
                  <WifiOff className="w-4 h-4" />
                  <span>GST Portal Timeout (504)</span>
                </div>
                <p className="text-[11px] text-red-600 dark:text-red-400">Gateway did not respond within 4,000ms. Retrying connection...</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-zinc-400 font-sans tabular-nums">
                    Auto-retry in <strong className="text-zinc-900 dark:text-white">{p12Countdown}</strong>s
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setP12Retrying(true);
                      setTimeout(() => setP12Retrying(false), 800);
                      setP12Countdown(4);
                    }}
                    className="px-2.5 py-1 rounded bg-white dark:bg-white/10 border border-zinc-200 text-zinc-900 dark:text-white font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${p12Retrying ? "animate-spin" : ""}`} />
                    <span>Retry Now</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[10px] text-zinc-400 flex justify-between">
              <span>State: Auto-recovering</span>
              <span>Manual Override</span>
            </div>
          </div>
        )}

          </div>
        </section>
      </div>

      {/* Slide-Over Drawer Sample */}
      {isSampleDrawerOpen && (
        <aside className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-white dark:bg-[#121215] border-l border-zinc-200 dark:border-white/10 z-50 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
          <div className="p-5 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white font-sans tabular-nums">#INV-9042 Inspector</h4>
              <p className="text-xs text-zinc-400">Spring physics transition demonstration</p>
            </div>
            <button
              type="button"
              onClick={() => setIsSampleDrawerOpen(false)}
              className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5 space-y-4 text-xs flex-1 overflow-y-auto">
            <div className="p-3 bg-zinc-50 dark:bg-white/5 border rounded-xl space-y-1">
              <span className="text-zinc-400 font-medium">Billed Amount</span>
              <div className="text-xl font-bold font-sans tabular-nums">₹1,25,000</div>
            </div>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-[12px]">
              Slide-over drawer utilizes cubic-bezier(0.16, 1, 0.3, 1) spring physics for natural entrance without jarring deceleration.
            </p>
          </div>
          <div className="p-5 border-t border-zinc-100 dark:border-white/5 flex justify-end">
            <button
              type="button"
              onClick={() => setIsSampleDrawerOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 cursor-pointer"
            >
              Close Drawer
            </button>
          </div>
        </aside>
      )}

      {/* Code Modal */}
      <CodeModal
        modal={activeCodeModal}
        onClose={() => setActiveCodeModal(null)}
      />
    </div>
  );
}
