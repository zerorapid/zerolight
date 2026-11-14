"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Copy,
  Check,
  X,
  ChevronDown,
  ArrowLeft,
  Download,
  ShieldCheck,
  Key,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { useZeroLight } from "../context";
import { Badge } from "../atoms/badge";

export type SpacingScale = "tight" | "default" | "relaxed";

export function SaaSDividerLibrary() {
  const { tokens } = useZeroLight();

  // Sticky Bar States
  const [searchQuery, setSearchQuery] = useState("");
  const [spacingScale, setSpacingScale] = useState<SpacingScale>("default");
  const [guidesActive, setGuidesActive] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Modal Code State
  const [activeCodeModal, setActiveCodeModal] = useState<{ title: string; code: string } | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Interactive Variant States
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [interactiveGap, setInteractiveGap] = useState<8 | 16 | 24 | 32>(16);

  // Spacing Scale Config
  const scaleConfig = {
    tight: { margin: "my-2.5", label: "Tight (10px)" },
    default: { margin: "my-4", label: "Default (16px)" },
    relaxed: { margin: "my-6", label: "Relaxed (24px)" },
  }[spacingScale];

  const categories = [
    { id: "all", label: "All (22)" },
    { id: "cat1", label: "1. Horizontal Rules" },
    { id: "cat2", label: "2. Labeled & Interactive" },
    { id: "cat3", label: "3. Vertical & Splitters" },
    { id: "cat4", label: "4. Consistent Spacing" },
    { id: "cat5", label: "5. Auto-Push & Layout" },
    { id: "cat6", label: "6. Card & List" },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 1800);
  };

  // Helper Card Component
  const Card = ({
    number,
    title,
    category,
    description,
    code,
    children,
  }: {
    number: string;
    title: string;
    category: string;
    description: string;
    code: string;
    children: React.ReactNode;
  }) => {
    const matchesCategory = activeCategory === "all" || activeCategory === category;
    const matchesSearch =
      searchQuery === "" ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesCategory || !matchesSearch) return null;

    return (
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs flex flex-col justify-between transition-all hover:border-zinc-300">
        <div>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100">
            <span className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
              <span className="text-zinc-400 font-sans tabular-nums font-semibold">{number}</span>
              {title}
            </span>
            <button
              type="button"
              onClick={() => setActiveCodeModal({ title: `${number} ${title}`, code })}
              className="px-2 py-0.5 rounded-md text-[11px] font-semibold text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition cursor-pointer"
            >
              &lt;/&gt; Code
            </button>
          </div>
          <p className="text-[11px] text-zinc-500 mb-4">{description}</p>
          <div className="w-full">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${guidesActive ? "guides-active" : ""}`}>
      {/* Sticky Top Control Bar */}
      <div className="sticky top-0 z-30 -mx-6 px-6 py-3 bg-[#FAFAFA]/95 backdrop-blur-md border-b border-zinc-200/80 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand & Counter */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-sm">
              ZL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-zinc-950 tracking-tight">SaaS Divider & Spacer Library</h2>
                <Badge variant="healthy">22 Variants</Badge>
              </div>
              <p className="text-[11px] text-zinc-500">
                Horizontal rules, splitters, 8px-32px spacing blocks & layout pushers.
              </p>
            </div>
          </div>

          {/* Controls: Search, Spacing Scale, Guides Toggle */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Live Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dividers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition w-44"
              />
            </div>

            {/* Spacing Scale Toggles (Tight, Default, Relaxed) */}
            <div className="flex items-center p-0.5 rounded-xl bg-zinc-200/70 border border-zinc-300/40">
              {(["tight", "default", "relaxed"] as const).map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => setSpacingScale(scale)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                    spacingScale === scale
                      ? "bg-white text-zinc-950 shadow-xs"
                      : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  {scale}
                </button>
              ))}
            </div>

            {/* Visual Guides Toggle */}
            <button
              type="button"
              onClick={() => setGuidesActive(!guidesActive)}
              className="px-2.5 py-1.5 rounded-xl border border-zinc-200 bg-white text-zinc-800 font-semibold flex items-center gap-1.5 hover:bg-zinc-50 transition cursor-pointer"
            >
              <span className={`w-2 h-2 rounded-full ${guidesActive ? "bg-emerald-500 shadow-xs" : "bg-zinc-400"}`} />
              <span>Guides: {guidesActive ? "On" : "Off"}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Rail */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-full font-semibold transition cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Variants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* ============================================== */}
        {/* CATEGORY 1: HORIZONTAL RULES & LINE STYLES (5) */}
        {/* ============================================== */}

        <Card
          number="01"
          title="Simple Hairline Rule"
          category="cat1"
          description="Solid separating hairline line between related form groups."
          code={`<hr className="border-0 h-[1px] bg-zinc-200 my-4" />`}
        >
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs">
            <div className="font-semibold text-zinc-900">Personal Details</div>
            <div className="text-[11px] text-zinc-500">Legal first and last names for KYC.</div>
            <hr className={`border-0 h-[1px] bg-zinc-200 ${scaleConfig.margin}`} />
            <div className="font-semibold text-zinc-900">Contact Address</div>
            <div className="text-[11px] text-zinc-500">Official registered billing address.</div>
          </div>
        </Card>

        <Card
          number="02"
          title="Dashed Receipt Divider"
          category="cat1"
          description="Dashed boundary line separating subtotal and final total due."
          code={`<div className="border-t border-dashed border-zinc-300 my-3" />`}
        >
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs">
            <div className="flex justify-between text-zinc-600 text-[11px]">
              <span>Enterprise Plan (Monthly)</span>
              <span className="tabular-nums font-semibold text-zinc-900">₹4,999</span>
            </div>
            <div className="flex justify-between text-zinc-600 text-[11px] mt-1">
              <span>GST Tax (18%)</span>
              <span className="tabular-nums font-semibold text-zinc-900">₹899</span>
            </div>
            <div className={`border-t border-dashed border-zinc-300 ${scaleConfig.margin}`} />
            <div className="flex justify-between font-bold text-zinc-950 text-xs">
              <span>Total Due</span>
              <span className="tabular-nums">₹5,898</span>
            </div>
          </div>
        </Card>

        <Card
          number="03"
          title="Dotted Soft Rule"
          category="cat1"
          description="Subtle dotted separator for secondary metadata groupings."
          code={`<div className="border-t-2 border-dotted border-zinc-300 my-3" />`}
        >
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-600">Cluster Nodes</span>
              <span className="font-semibold tabular-nums text-zinc-950">8 Active</span>
            </div>
            <div className={`border-t-2 border-dotted border-zinc-300 ${scaleConfig.margin}`} />
            <div className="flex items-center justify-between">
              <span className="text-zinc-600">Memory Utilization</span>
              <span className="font-semibold tabular-nums text-zinc-950">42.8 GB / 64 GB</span>
            </div>
          </div>
        </Card>

        <Card
          number="04"
          title="Soft Edge-Fade Divider"
          category="cat1"
          description="Gradient rule fading smoothly toward both lateral edges."
          code={`<div className="h-[1px] bg-gradient-to-r from-transparent via-zinc-400 to-transparent my-3" />`}
        >
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs text-center">
            <span className="text-zinc-500 text-[11px]">Primary Workspace Telemetry</span>
            <div className={`h-[1px] bg-gradient-to-r from-transparent via-zinc-400 to-transparent ${scaleConfig.margin}`} />
            <span className="text-zinc-500 text-[11px]">Regional Geo Distribution</span>
          </div>
        </Card>

        <Card
          number="05"
          title="Inset List Divider"
          category="cat1"
          description="Left-offset divider aligned with text beside icons."
          code={`<div className="ml-10 border-t border-zinc-200 my-1" />`}
        >
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs space-y-1">
            <div className="flex items-center gap-3 py-1">
              <div className="w-7 h-7 rounded-lg bg-zinc-200 flex items-center justify-center text-zinc-700">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-medium text-zinc-900">Audit Compliance</span>
            </div>
            <div className="ml-10 border-t border-zinc-200 my-1" />
            <div className="flex items-center gap-3 py-1">
              <div className="w-7 h-7 rounded-lg bg-zinc-200 flex items-center justify-center text-zinc-700">
                <Key className="w-4 h-4" />
              </div>
              <span className="font-medium text-zinc-900">API Credentials</span>
            </div>
          </div>
        </Card>

        {/* ==================================================== */}
        {/* CATEGORY 2: LABELED & INTERACTIVE SECTION DIVIDERS (5) */}
        {/* ==================================================== */}

        <Card
          number="06"
          title="Centered Text Divider"
          category="cat2"
          description="Centered text label balanced between two horizontal rules."
          code={`<div className="relative flex py-2 items-center">\n  <div className="flex-grow border-t border-zinc-300" />\n  <span className="flex-shrink mx-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Or continue with</span>\n  <div className="flex-grow border-t border-zinc-300" />\n</div>`}
        >
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-zinc-300" />
              <span className="flex-shrink mx-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Or continue with
              </span>
              <div className="flex-grow border-t border-zinc-300" />
            </div>
          </div>
        </Card>

        <Card
          number="07"
          title="Left-Aligned Section Title Rule"
          category="cat2"
          description="Bold section title followed by an extending horizontal rule."
          code={`<div className="flex items-center gap-3">\n  <span className="font-bold text-xs whitespace-nowrap">Tax & Compliance</span>\n  <div className="flex-1 border-t border-zinc-300" />\n</div>`}
        >
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-zinc-950 whitespace-nowrap text-xs">Tax & Compliance</span>
              <div className="flex-1 border-t border-zinc-300" />
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">Manage GSTIN and e-way bill generation credentials.</p>
          </div>
        </Card>

        <Card
          number="08"
          title="Date Stamp Pill Divider"
          category="cat2"
          description="Rounded pill date badge centered on an event stream line."
          code={`<div className="relative flex items-center justify-center my-1">\n  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200" /></div>\n  <span className="relative bg-white px-3 py-1 rounded-full border border-zinc-200 text-xs font-semibold shadow-xs">Today · 15 Nov</span>\n</div>`}
        >
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs">
            <div className="relative flex items-center justify-center my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200" />
              </div>
              <div className="relative bg-white px-3 py-1 rounded-full border border-zinc-200 text-[11px] font-semibold text-zinc-600 shadow-xs tabular-nums">
                Today · 15 Nov
              </div>
            </div>
          </div>
        </Card>

        <Card
          number="09"
          title="Expand / Collapse Section Divider"
          category="cat2"
          description="Interactive divider button toggling advanced options."
          code={`<button onClick={() => setOpen(!open)} className="relative bg-white px-3 py-1 rounded-full border text-xs font-semibold">\n  {open ? "Hide Advanced Options" : "Show Advanced Options"}\n</button>`}
        >
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs">
            <div className="relative flex items-center justify-center my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-300" />
              </div>
              <button
                type="button"
                onClick={() => setAdvancedOpen(!advancedOpen)}
                className="relative bg-white px-3 py-1 rounded-full border border-zinc-300 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>{advancedOpen ? "Hide Advanced Options" : "Show Advanced Options"}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${advancedOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
            {advancedOpen && (
              <div className="mt-3 p-3 rounded-lg bg-white border border-zinc-200 text-[11px] space-y-1.5 animate-in fade-in duration-150">
                <div className="flex justify-between text-zinc-600">
                  <span>Webhook Signature</span>
                  <span className="font-semibold text-zinc-900">SHA-256 HMAC</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Retry Interval</span>
                  <span className="font-semibold text-zinc-900">Exponential backoff</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card
          number="10"
          title="New Unread Activity Line"
          category="cat2"
          description="Accent line demarcating unread chat or notification items."
          code={`<div className="relative flex items-center justify-center my-1">\n  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-rose-400" /></div>\n  <span className="relative bg-rose-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">New Updates</span>\n</div>`}
        >
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs">
            <div className="relative flex items-center justify-center my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-rose-400" />
              </div>
              <span className="relative bg-rose-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-xs">
                New Updates
              </span>
            </div>
          </div>
        </Card>

        {/* ============================================== */}
        {/* CATEGORY 3: VERTICAL & INLINE SPLITTERS (3)   */}
        {/* ============================================== */}

        <Card
          number="11"
          title="Toolbar Action Divider"
          category="cat3"
          description="Vertical hairline separator grouping toolbar button pairs."
          code={`<div className="h-4 w-[1px] bg-zinc-300 mx-1" />`}
        >
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs">
            <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-zinc-200 w-fit">
              <button className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-700 font-bold text-xs">B</button>
              <button className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-700 italic text-xs">I</button>
              <div className="h-4 w-[1px] bg-zinc-300 mx-1" />
              <button className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-700">
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-700">
                <ImageIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Card>

        <Card
          number="12"
          title="KPI Metric Column Splitters"
          category="cat3"
          description="Vertical rules neatly separating three core SaaS telemetry metrics."
          code={`<div className="flex items-center divide-x divide-zinc-200 text-center">\n  <div className="flex-1">Clients: 142</div>\n  <div className="flex-1">Revenue: ₹1.2 Cr</div>\n  <div className="flex-1">Growth: +28%</div>\n</div>`}
        >
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs">
            <div className="flex items-center divide-x divide-zinc-200 text-center">
              <div className="flex-1 px-2">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Clients</div>
                <div className="text-sm font-bold tabular-nums text-zinc-950">142</div>
              </div>
              <div className="flex-1 px-2">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Revenue</div>
                <div className="text-sm font-bold tabular-nums text-zinc-950">₹1.2 Cr</div>
              </div>
              <div className="flex-1 px-2">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Growth</div>
                <div className="text-sm font-bold tabular-nums text-emerald-600">+28%</div>
              </div>
            </div>
          </div>
        </Card>

        <Card
          number="13"
          title="Dot & Slash Breadcrumb Dividers"
          category="cat3"
          description="Inline bullet dots and slashes separating multi-tier hierarchy."
          code={`<div className="flex items-center gap-2 text-xs text-zinc-500">\n  <span>Projects</span><span className="font-bold">/</span><span>ERP Suite</span>\n</div>`}
        >
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs space-y-2">
            <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
              <span>Projects</span>
              <span className="text-zinc-400 font-bold">/</span>
              <span>ERP Suite</span>
              <span className="text-zinc-400 font-bold">/</span>
              <span className="text-zinc-950 font-semibold">Settings</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
              <span>Hyderabad</span>
              <span className="text-zinc-400 font-bold">•</span>
              <span>Enterprise</span>
              <span className="text-zinc-400 font-bold">•</span>
              <span className="text-emerald-600 font-semibold">Active</span>
            </div>
          </div>
        </Card>

        {/* ============================================== */}
        {/* CATEGORY 4: CONSISTENT SPACING UNITS 8-32PX (5)*/}
        {/* ============================================== */}

        <Card
          number="14"
          title="Tight Element Spacer (8px)"
          category="cat4"
          description="Predictable 8px gap between label and input box."
          code={`<label className="text-xs font-semibold">Billing Email</label>\n<div className="h-2" />\n<input className="px-3 py-1.5 border rounded-xl" />`}
        >
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs">
            <label className="block font-semibold text-zinc-900 text-xs">Billing Email</label>
            <div className={`h-2 ${guidesActive ? "border border-dashed border-emerald-500 bg-emerald-50 relative flex items-center justify-center text-[9px] text-emerald-700 font-bold" : ""}`}>
              {guidesActive && "8px"}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white border border-zinc-300 text-zinc-500 text-xs">
              accounts@company.com
            </div>
          </div>
        </Card>

        <Card
          number="15"
          title="Standard Form Gap (16px)"
          category="cat4"
          description="Uniform 16px cadence separating successive input rows."
          code={`<input className="w-full px-3 py-1.5 border rounded-xl" />\n<div className="h-4" />\n<input className="w-full px-3 py-1.5 border rounded-xl" />`}
        >
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 text-xs">
              Full Legal Name
            </div>
            <div className={`h-4 ${guidesActive ? "border border-dashed border-emerald-500 bg-emerald-50 relative flex items-center justify-center text-[9px] text-emerald-700 font-bold" : ""}`}>
              {guidesActive && "16px"}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 text-xs">
              Corporate Designation
            </div>
          </div>
        </Card>

        <Card
          number="16"
          title="Section Break Spacer (24px)"
          category="cat4"
          description="Generous 24px vertical breathing room between distinct card zones."
          code={`<div>Zone A</div>\n<div className="h-6" />\n<div>Zone B</div>`}
        >
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-zinc-200 font-medium text-xs">
              Zone A: Organization Identity
            </div>
            <div className={`h-6 ${guidesActive ? "border border-dashed border-emerald-500 bg-emerald-50 relative flex items-center justify-center text-[9px] text-emerald-700 font-bold" : ""}`}>
              {guidesActive && "24px"}
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-zinc-200 font-medium text-xs">
              Zone B: Audit Log Destination
            </div>
          </div>
        </Card>

        <Card
          number="17"
          title="Page Block Spacer (32px)"
          category="cat4"
          description="Major 32px gap separating high-level KPI cards from data tables."
          code={`<div>KPI Summary Strip</div>\n<div className="h-8" />\n<div>Enterprise Data Grid</div>`}
        >
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-zinc-200 font-medium text-xs">
              KPI Summary Strip
            </div>
            <div className={`h-8 ${guidesActive ? "border border-dashed border-emerald-500 bg-emerald-50 relative flex items-center justify-center text-[9px] text-emerald-700 font-bold" : ""}`}>
              {guidesActive && "32px"}
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-zinc-200 font-medium text-xs">
              Enterprise Data Grid
            </div>
          </div>
        </Card>

        <Card
          number="18"
          title="Interactive Spacing Scale Preview"
          category="cat4"
          description="Clickable 8px to 32px buttons dynamically resizing the gap live."
          code={`<!-- Use h-2 (8px), h-4 (16px), h-6 (24px), or h-8 (32px) -->\n<div className="p-3 border rounded-xl">Header</div>\n<div className="h-4" />\n<div className="p-3 border rounded-xl">Body</div>`}
        >
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs">
            <div className="flex items-center gap-1.5 mb-3">
              {([8, 16, 24, 32] as const).map((gap) => (
                <button
                  key={gap}
                  type="button"
                  onClick={() => setInteractiveGap(gap)}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition tabular-nums cursor-pointer ${
                    interactiveGap === gap
                      ? "bg-zinc-950 text-white shadow-xs"
                      : "bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-400"
                  }`}
                >
                  {gap}px
                </button>
              ))}
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-zinc-200 text-xs font-semibold">
              Primary Header Card
            </div>
            <div
              className={`transition-all duration-200 ${
                interactiveGap === 8
                  ? "h-2"
                  : interactiveGap === 16
                  ? "h-4"
                  : interactiveGap === 24
                  ? "h-6"
                  : "h-8"
              } ${guidesActive ? "border border-dashed border-emerald-500 bg-emerald-50 flex items-center justify-center text-[9px] text-emerald-700 font-bold" : ""}`}
            >
              {guidesActive && `${interactiveGap}px`}
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-zinc-200 text-xs font-semibold">
              Sub-Workspace Body
            </div>
          </div>
        </Card>

        {/* ============================================== */}
        {/* CATEGORY 5: AUTO-PUSH & LAYOUT SPACERS (2)    */}
        {/* ============================================== */}

        <Card
          number="19"
          title="Left-to-Right Auto Spacer"
          category="cat5"
          description="Flexible flex-1 spacer automatically pushing action buttons to the far edge."
          code={`<div className="flex items-center">\n  <span>Active Invoices</span>\n  <div className="flex-1" />\n  <button className="px-3 py-1 bg-zinc-950 text-white rounded-lg">Download</button>\n</div>`}
        >
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs">
            <div className="flex items-center p-2 rounded-xl bg-white border border-zinc-200">
              <span className="font-bold text-zinc-950">Active Invoices</span>
              <div className={`flex-1 h-6 mx-2 ${guidesActive ? "border border-dashed border-emerald-500 bg-emerald-50 flex items-center justify-center text-[9px] text-emerald-700 font-bold" : ""}`}>
                {guidesActive && "auto flex-1"}
              </div>
              <button className="px-2.5 py-1 rounded-lg bg-zinc-950 text-white font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer shadow-xs">
                <Download className="w-3 h-3" />
                Download
              </button>
            </div>
          </div>
        </Card>

        <Card
          number="20"
          title="3-Column Header Spacer"
          category="cat5"
          description="Balanced header spacing centering a progress indicator between navigation buttons."
          code={`<div className="flex items-center justify-between">\n  <button>Back</button>\n  <span>Step 2 of 3</span>\n  <button>Skip</button>\n</div>`}
        >
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-zinc-200">
              <button className="px-2.5 py-1 rounded-lg border border-zinc-200 text-zinc-700 font-semibold text-[11px] flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" />
                Back
              </button>
              <span className="font-bold text-zinc-950 text-xs tabular-nums">
                Step 2 of 3
              </span>
              <button className="px-2.5 py-1 rounded-lg text-zinc-500 hover:text-zinc-900 font-semibold text-[11px]">
                Skip
              </button>
            </div>
          </div>
        </Card>

        {/* ============================================== */}
        {/* CATEGORY 6: CARD & LIST DIVIDERS (2)          */}
        {/* ============================================== */}

        <Card
          number="21"
          title="Clean List Row Divider"
          category="cat6"
          description="Structured divide-y summary card rows cleanly partitioning data."
          code={`<div className="divide-y divide-zinc-200">\n  <div className="py-2 flex justify-between"><span>Plan</span><span>Enterprise</span></div>\n  <div className="py-2 flex justify-between"><span>Seats</span><span>48 Seats</span></div>\n</div>`}
        >
          <div className="rounded-xl bg-white border border-zinc-200 divide-y divide-zinc-200 text-xs">
            <div className="p-2.5 flex justify-between items-center">
              <span className="text-zinc-500 text-[11px]">Current Plan</span>
              <span className="font-semibold text-zinc-950">Enterprise Cloud</span>
            </div>
            <div className="p-2.5 flex justify-between items-center">
              <span className="text-zinc-500 text-[11px]">Seat Count</span>
              <span className="font-semibold text-zinc-950 tabular-nums">48 Seats</span>
            </div>
            <div className="p-2.5 flex justify-between items-center">
              <span className="text-zinc-500 text-[11px]">Next Renewal</span>
              <span className="font-semibold text-zinc-950 tabular-nums">01 Jan 2027</span>
            </div>
          </div>
        </Card>

        <Card
          number="22"
          title="Card Footer Action Divider"
          category="cat6"
          description="Card body cleanly separated from a subtle action footer."
          code={`<div className="rounded-xl border">\n  <div className="p-4">Card Content</div>\n  <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-2 flex justify-end gap-2">\n    <button>Cancel</button>\n    <button className="bg-zinc-950 text-white px-3 py-1 rounded-lg">Publish</button>\n  </div>\n</div>`}
        >
          <div className="rounded-xl bg-white border border-zinc-200 text-xs overflow-hidden">
            <div className="p-3">
              <div className="font-semibold text-zinc-950">Security Access Policy</div>
              <p className="text-[11px] text-zinc-500 mt-1">Changes require two-person cryptographic review.</p>
            </div>
            <div className="border-t border-zinc-200 bg-zinc-50/70 px-3 py-2 flex items-center justify-end gap-2">
              <button className="px-2.5 py-1 rounded-lg text-zinc-600 hover:text-zinc-950 text-[11px] font-semibold cursor-pointer">
                Cancel
              </button>
              <button className="px-3 py-1 rounded-lg bg-zinc-950 text-white font-semibold text-[11px] cursor-pointer shadow-xs">
                Publish
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Code Modal */}
      {activeCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-200">
              <h3 className="text-sm font-bold text-zinc-950">{activeCodeModal.title}</h3>
              <button
                type="button"
                onClick={() => setActiveCodeModal(null)}
                className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              <div className="relative">
                <pre className="p-4 rounded-xl bg-zinc-900 text-zinc-100 text-xs overflow-x-auto font-sans leading-relaxed">
                  {activeCodeModal.code}
                </pre>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-zinc-200 bg-zinc-50">
              <button
                type="button"
                onClick={() => setActiveCodeModal(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-600 hover:text-zinc-950 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleCopyCode(activeCodeModal.code)}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-950 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:opacity-90 transition cursor-pointer"
              >
                {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{codeCopied ? "Copied!" : "Copy Code"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
