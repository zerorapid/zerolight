"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  Terminal,
} from "lucide-react";
import { useZeroLight } from "../context";
import { LibraryHeader } from "./common";

export function SaaSTokensLibrary() {
  const { tokens, scaled } = useZeroLight();
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [motionTrigger, setMotionTrigger] = useState<string | null>(null);
  const [elevationMode, setElevationMode] = useState<"flat" | "soft" | "elevated">(tokens.elevation || "soft");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const triggerSpring = (name: string) => {
    setMotionTrigger(name);
    setTimeout(() => setMotionTrigger(null), 600);
  };

  const primColor = tokens.primaryButtonColor || "#0F172A";
  const secColor = tokens.chartSecondaryColor || "#FFFFFF";

  // Color Swatches (Bound live to ZeroLight Runtime Tokens)
  const colorTokens = [
    { id: "brand-primary", name: "Primary Brand Accent", hex: primColor, role: "Primary CTAs, focus rings & chart series 1 (live token)" },
    { id: "chart-secondary", name: "Secondary Chart Accent", hex: secColor, role: "Dual-accent comparisons & secondary chart series (live token)" },
    { id: "surface", name: "Surface Fill", hex: tokens.universalFillColor || "#FFFFFF", role: "Cards, modals & panel backplates (live token)" },
    { id: "border", name: "Hairline Border", hex: tokens.universalBorderColor || "#E4E4E7", role: `${tokens.borderWidth ?? 1}px structural boundaries (live token)` },
    { id: "text-primary", name: "Text & Icon Color", hex: tokens.textIconColor || "#09090B", role: "Headings & YIQ contrast text (live token)" },
    { id: "hover-tint", name: "Hover Backplate Tint", hex: tokens.hoverBackplateTint || "#F4F4F5", role: "Row hover & quiet pill fill (live token)" },
    { id: "emerald", name: "Status Healthy", hex: "#10B981", role: "Success, positive deltas & online" },
    { id: "amber", name: "Status Warning", hex: "#F59E0B", role: "Alerts, trial limits & pending" },
    { id: "rose", name: "Status Danger", hex: "#EF4444", role: "Errors, destructive & failed" },
  ];

  // Typography Scales
  const typeScales = [
    { level: "Display", size: "32px", line: "36px", weight: "font-extrabold", track: "tracking-tight", sample: "Executive Dashboard" },
    { level: "Title", size: "24px", line: "28px", weight: "font-bold", track: "tracking-tight", sample: "Design System Tokens" },
    { level: "Heading", size: "16px", line: "22px", weight: "font-bold", track: "tracking-normal", sample: "Section & Card Headings" },
    { level: "Subhead", size: "14px", line: "20px", weight: "font-semibold", track: "tracking-normal", sample: "Navigation & Filter Labels" },
    { level: "Body", size: "13px", line: "18px", weight: "font-normal", track: "tracking-normal", sample: "Clean SaaS body copy with optimal readability." },
    { level: "Caption", size: "11px", line: "14px", weight: "font-medium", track: "tracking-wider uppercase", sample: "METRIC LABELS & TAGS" },
    { level: "Tabular Num", size: "24px", line: "28px", weight: "font-bold", track: "tabular-nums", sample: "₹1,42,850.00" },
  ];

  // Motion Curves
  const motionPresets = [
    { id: "snappy", name: "Snappy Spring", stiffness: 520, damping: 32, desc: "Instant click feedback, toggles & select boxes." },
    { id: "damped", name: "Damped Spring", stiffness: 400, damping: 28, desc: "Modal appearances, drawers & toast mounts." },
    { id: "elastic", name: "Elastic Spring", stiffness: 460, damping: 20, desc: "Celebration icons, playful badges & pin drops." },
    { id: "gentle", name: "Gentle Spring", stiffness: 280, damping: 30, desc: "Smooth canvas pans & accordion rollouts." },
  ];

  const matchesSearch = (text: string) => {
    if (!searchQuery) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="space-y-8">
      {/* ── UNIFIED LIBRARY UTILITY HEADER (ZERO STICKY OVERLAP, ZERO BLEEDING) ── */}
      <LibraryHeader
        countText="120 Foundations & Tokens Active"
        description="Live-bound tactile calm tokens, Google Fonts, YIQ contrast, materials & spring physics."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Filter tokens & principles..."
        action={
          <button
            type="button"
            onClick={() => copyToClipboard("npx zerolight tokens export", "cli-export")}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 text-white hover:opacity-90 transition flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{copiedToken === "cli-export" ? "Copied Command!" : "Export Tokens CLI"}</span>
          </button>
        }
      />

      {/* =========================================================================
           SECTION 1: TACTILE CALM & PRINCIPLES
      ========================================================================= */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            1. Tactile Calm & Principles
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Core architectural principles prioritizing quiet surfaces, 1px hairlines, and zero AI decorative noise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              num: "01",
              title: "1px Hairline Borders",
              desc: "Crisp hairline boundaries provide visual structure without heavy, dated shadows or noisy multi-stop gradients.",
              tag: "Structure",
            },
            {
              num: "02",
              title: "Grayscale Luminance",
              desc: "Quiet neutral backgrounds with subtle luminance stepping give data and interactive controls supreme focus.",
              tag: "Luminance",
            },
            {
              num: "03",
              title: "Tabular Numbers Discipline",
              desc: "All figures, currencies, IDs, and metrics use font-sans with tabular-nums alignment. Zero monospace clutter.",
              tag: "Metrics",
            },
            {
              num: "04",
              title: "Zero AI Clutter",
              desc: "No gratuitous neon drop-shadows, rainbow badges, or decorative emojis in headings. Handcrafted calm.",
              tag: "Simplicity",
            },
          ].map((item) => (
            <div
              key={item.num}
              className="p-5 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#121215] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100 dark:border-white/5">
                  <span className="text-xs font-bold text-zinc-400 font-sans tabular-nums">{item.num}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400">
                    {item.tag}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">{item.title}</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
           SECTION 2: COLOR TOKENS & SEMANTIC PALETTE
      ========================================================================= */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            2. Color Tokens & Semantic Palette
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Universal grayscale luminance tokens, dual-accent charting hexes, and accessible contrast math. Click any swatch to copy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {colorTokens
            .filter((c) => matchesSearch(c.name) || matchesSearch(c.role))
            .map((c) => (
              <div
                key={c.id}
                onClick={() => copyToClipboard(c.hex, c.id)}
                className="group p-3.5 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#121215] shadow-xs hover:border-zinc-300 dark:hover:border-white/20 transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg border border-black/10 dark:border-white/10 shadow-xs shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{c.name}</div>
                    <div className="text-[11px] text-zinc-400 dark:text-zinc-500 font-sans tabular-nums">{c.hex}</div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">{c.role}</div>
                  </div>
                </div>

                <button
                  type="button"
                  className="opacity-0 group-hover:opacity-100 transition p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-500"
                >
                  {copiedToken === c.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
        </div>
      </section>

      {/* =========================================================================
           SECTION 3: TYPOGRAPHY SCALE & NUMBERS
      ========================================================================= */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            3. Typography Scale & Numbers
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Inter font-sans hierarchy, optical sizing, and mandatory tabular-nums discipline for financial and operational data.
          </p>
        </div>

        <div
          style={{
            borderRadius: `${scaled.scaledCardRadius}px`,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
          }}
          className="border bg-white divide-y divide-zinc-100 overflow-hidden shadow-xs"
        >
          {typeScales.map((t, idx) => (
            <div key={t.level} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-48 shrink-0">
                <span className="text-xs font-bold text-zinc-400 font-sans tabular-nums">0{idx + 1}</span>
                <div>
                  <div className="text-xs font-bold text-zinc-900">{t.level}</div>
                  <div className="text-[10px] text-zinc-400 font-sans tabular-nums">
                    {t.size} · line {t.line}
                  </div>
                </div>
              </div>

              <div
                className={`flex-1 text-zinc-900 ${t.weight} ${t.track}`}
                style={{
                  fontSize: t.size,
                  fontFamily: idx <= 2 ? scaled.resolvedHeadingFontFamily : scaled.resolvedFontFamily,
                }}
              >
                {t.sample}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
           SECTION 4: MATERIALS, HAIRLINES & ELEVATION
      ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
              4. Materials, Hairlines & Elevation
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Flat, soft, and elevated shadow presets with automatic atmospheric fallback.
            </p>
          </div>

          <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs">
            {(["flat", "soft", "elevated"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setElevationMode(mode)}
                className={`px-2.5 py-1 rounded-md font-medium capitalize transition cursor-pointer ${
                  elevationMode === mode
                    ? "bg-white dark:bg-white/20 text-zinc-950 dark:text-white shadow-xs font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              name: "Flat Surface",
              level: "Level 1",
              shadow: "shadow-none border border-zinc-200/80 dark:border-white/10",
              desc: "1px crisp hairline border with zero drop-shadow for dense tables and data canvases.",
            },
            {
              name: "Soft Atmosphere",
              level: "Level 2",
              shadow: "shadow-sm border border-zinc-200/80 dark:border-white/10",
              desc: "Atmospheric shadow stepping for interactive cards, dropdowns, and form panels.",
            },
            {
              name: "Elevated Overlay",
              level: "Level 3",
              shadow: "shadow-xl border border-zinc-200/80 dark:border-white/10",
              desc: "Full viewport modal dialogs, slide-over detail drawers, and ⌘K command palettes.",
            },
          ].map((card, i) => (
            <div
              key={card.name}
              className={`p-5 rounded-xl bg-white dark:bg-[#121215] transition-all duration-300 ${card.shadow}`}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100 dark:border-white/5">
                <span className="text-xs font-bold text-zinc-400 font-sans tabular-nums">0{i + 1}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400">
                  {card.level}
                </span>
              </div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">{card.name}</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">{card.desc}</p>
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200/80 dark:border-white/5 text-center text-xs text-zinc-600 dark:text-zinc-300 font-semibold">
                Elevation Preview Active
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
           SECTION 5: SPRING MOTION PHYSICS ENGINE
      ========================================================================= */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            5. Spring Motion Physics Engine
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Calibrated natural spring dynamics with GPU transform acceleration. Test each curve below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {motionPresets.map((m, idx) => (
            <div
              key={m.id}
              className="p-5 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#121215] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100 dark:border-white/5">
                  <span className="text-xs font-bold text-zinc-400 font-sans tabular-nums">0{idx + 1}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 font-sans tabular-nums">
                    k={m.stiffness} c={m.damping}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-1">{m.name}</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">{m.desc}</p>
              </div>

              <motion.button
                type="button"
                onClick={() => triggerSpring(m.id)}
                animate={{
                  scale: motionTrigger === m.id ? 0.94 : 1,
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: m.stiffness, damping: m.damping }}
                style={{ borderRadius: `${scaled.scaledRadius}px` }}
                className="w-full py-2 text-xs font-semibold border border-zinc-200 bg-zinc-50 text-zinc-800 cursor-pointer"
              >
                {motionTrigger === m.id ? "Spring Fired!" : "Trigger Spring"}
              </motion.button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
