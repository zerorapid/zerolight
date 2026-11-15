"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Copy,
  Check,
  X,
  Download,
  Archive,
  Settings,
  HelpCircle,
  HardDrive,
  Command,
  Trash2,
  UploadCloud,
  ShieldAlert,
  Share2,
  Edit2,
  Edit3,
  MessageSquare,
  Lock,
  Link2,
} from "lucide-react";
import { useZeroLight } from "../context";
import { Badge } from "../atoms/badge";
import { CodeModal, LibraryHeader } from "./common";

export type TooltipDensity = "small" | "medium" | "large";

export function SaaSTooltipLibrary() {
  const { tokens } = useZeroLight();

  // Control Bar States
  const [searchQuery, setSearchQuery] = useState("");
  const [density, setDensity] = useState<TooltipDensity>("medium");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Code Modal State
  const [activeCodeModal, setActiveCodeModal] = useState<{ title: string; code: string } | null>(null);

  // Active Popover State (for click-to-open variants)
  const [activePopover, setActivePopover] = useState<string | null>(null);

  // Interactive Action States
  const [copyConfirmed, setCopyConfirmed] = useState(false);
  const [pipelineTitle, setPipelineTitle] = useState("Q4 Sales Pipeline");
  const [renameInputVal, setRenameInputVal] = useState("Q4 Sales Pipeline");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Density Config
  const densityConfig = {
    small: {
      tooltipPad: "px-2 py-1",
      tooltipText: "text-[11px]",
      popoverWidth: "w-[220px]",
    },
    medium: {
      tooltipPad: "px-2.5 py-1.5",
      tooltipText: "text-xs",
      popoverWidth: "w-[248px]",
    },
    large: {
      tooltipPad: "px-3 py-2",
      tooltipText: "text-[13px]",
      popoverWidth: "w-[280px]",
    },
  }[density];

  // Outside click handler to dismiss popovers
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-popover-container]")) {
        setActivePopover(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const categories = [
    { id: "all", label: "All (22)" },
    { id: "cat1", label: "1. Directional Tooltips" },
    { id: "cat2", label: "2. Shortcuts & Status" },
    { id: "cat3", label: "3. Toolbar & Hints" },
    { id: "cat4", label: "4. Rich Popovers" },
    { id: "cat5", label: "5. Safety & Confirm" },
    { id: "cat6", label: "6. Quick-Edit & Notes" },
  ];

  // Helper Card
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
    const matchesSearch =
      searchQuery === "" ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return null;

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
          <p className="text-[11px] text-zinc-500 mb-6">{description}</p>
          <div className="p-6 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-center relative min-h-[90px]">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${previewOpen ? "preview-open-active" : ""}`}>
      {/* Workspace Control Strip */}
      <LibraryHeader
        countText="22 Patterns"
        description="22 directional hints, keyboard keycaps, quota cards, and safety confirmation popovers."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search tooltips..."
        action={
          <button
            type="button"
            onClick={() => setPreviewOpen(!previewOpen)}
            className="px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#121215] text-zinc-800 dark:text-zinc-200 font-semibold flex items-center gap-1.5 hover:bg-zinc-50 dark:hover:bg-white/5 transition cursor-pointer text-xs"
          >
            <span className={`w-2 h-2 rounded-full ${previewOpen ? "bg-emerald-500 shadow-xs" : "bg-zinc-400"}`} />
            <span>Preview: {previewOpen ? "On" : "Off"}</span>
          </button>
        }
      />

      {/* ── 1. DIRECTIONAL HOVER TOOLTIPS ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            1. Directional Hover Tooltips
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Micro directional hint bubbles positioned around interactive anchors.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card
          number="01"
          title="Top Hover Tooltip"
          category="cat1"
          description="Default dark obsidian tooltip appearing centered above the trigger."
          code={`<div className="group relative inline-flex justify-center">\n  <button className="px-3.5 py-1.5 bg-zinc-950 text-white rounded-xl">Save Draft</button>\n  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 rounded-lg bg-[#0B0F19] text-white px-2.5 py-1 text-xs whitespace-nowrap shadow-xl">\n    Saves your latest changes\n    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0B0F19]" />\n  </div>\n</div>`}
        >
          <div className="group relative inline-flex justify-center">
            <button className="px-3.5 py-1.5 rounded-xl bg-zinc-950 text-white text-xs font-semibold cursor-pointer shadow-xs">
              Save Draft
            </button>
            <div
              className={`absolute bottom-full mb-2 ${densityConfig.tooltipPad} ${densityConfig.tooltipText} ${
                previewOpen ? "opacity-100 translate-y-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 pointer-events-none"
              } transition-all rounded-lg bg-[#0B0F19] text-white font-medium whitespace-nowrap shadow-xl z-20`}
            >
              Saves your latest changes
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0B0F19]" />
            </div>
          </div>
        </Card>

        <Card
          number="02"
          title="Bottom Hover Tooltip"
          category="cat1"
          description="Downward tooltip positioned below navigation or header buttons."
          code={`<div className="group relative inline-flex justify-center">\n  <button className="px-3.5 py-1.5 border rounded-xl">Export Report</button>\n  <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 rounded-lg bg-[#0B0F19] text-white px-2.5 py-1 text-xs whitespace-nowrap shadow-xl">\n    Download report as PDF\n  </div>\n</div>`}
        >
          <div className="group relative inline-flex justify-center">
            <button className="px-3.5 py-1.5 rounded-xl border border-zinc-300 bg-white text-zinc-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs">
              <Download className="w-3.5 h-3.5" />
              Export Report
            </button>
            <div
              className={`absolute top-full mt-2 ${densityConfig.tooltipPad} ${densityConfig.tooltipText} ${
                previewOpen ? "opacity-100 translate-y-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-y-0 -translate-y-1 pointer-events-none"
              } transition-all rounded-lg bg-[#0B0F19] text-white font-medium whitespace-nowrap shadow-xl z-20`}
            >
              Download report as PDF
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[#0B0F19]" />
            </div>
          </div>
        </Card>

        <Card
          number="03"
          title="Left Side Tooltip"
          category="cat1"
          description="Leftward tooltip suited for right-side drawer and rail triggers."
          code={`<div className="group relative inline-flex items-center">\n  <div className="absolute right-full mr-2 opacity-0 group-hover:opacity-100 rounded-lg bg-[#0B0F19] text-white px-2.5 py-1 text-xs whitespace-nowrap shadow-xl">\n    Archive record\n  </div>\n  <button className="p-2 border rounded-xl"><Archive className="w-4 h-4" /></button>\n</div>`}
        >
          <div className="group relative inline-flex items-center">
            <div
              className={`absolute right-full mr-2 ${densityConfig.tooltipPad} ${densityConfig.tooltipText} ${
                previewOpen ? "opacity-100 translate-x-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-1 pointer-events-none"
              } transition-all rounded-lg bg-[#0B0F19] text-white font-medium whitespace-nowrap shadow-xl z-20`}
            >
              Archive record
              <div className="absolute top-1/2 left-full -translate-y-1/2 border-4 border-transparent border-l-[#0B0F19]" />
            </div>
            <button className="p-2 rounded-xl bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100 cursor-pointer shadow-xs">
              <Archive className="w-4 h-4" />
            </button>
          </div>
        </Card>

        <Card
          number="04"
          title="Right Side Tooltip"
          category="cat1"
          description="Rightward tooltip for collapsed icon sidebars (Fitts's Law)."
          code={`<div className="group relative inline-flex items-center">\n  <button className="p-2 border rounded-xl"><Settings className="w-4 h-4" /></button>\n  <div className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 rounded-lg bg-[#0B0F19] text-white px-2.5 py-1 text-xs whitespace-nowrap shadow-xl">\n    Open team settings\n  </div>\n</div>`}
        >
          <div className="group relative inline-flex items-center">
            <button className="p-2 rounded-xl bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100 cursor-pointer shadow-xs">
              <Settings className="w-4 h-4" />
            </button>
            <div
              className={`absolute left-full ml-2 ${densityConfig.tooltipPad} ${densityConfig.tooltipText} ${
                previewOpen ? "opacity-100 translate-x-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1 pointer-events-none"
              } transition-all rounded-lg bg-[#0B0F19] text-white font-medium whitespace-nowrap shadow-xl z-20`}
            >
              Open team settings
              <div className="absolute top-1/2 right-full -translate-y-1/2 border-4 border-transparent border-r-[#0B0F19]" />
            </div>
          </div>
        </Card>
        </div>
      </section>

      {/* ── 2. SHORTCUTS, LIGHT & STATUS TOOLTIPS ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            2. Shortcuts, Light & Status Tooltips
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Keyboard keycap shortcuts, live presence indicators, and health monitors.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card
          number="05"
          title="Keyboard Shortcut Tooltip"
          category="cat2"
          description="Action label paired with high-contrast keyboard shortcut badge."
          code={`<div className="group relative inline-flex justify-center">\n  <button className="p-2 border rounded-xl"><Search className="w-4 h-4" /></button>\n  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 rounded-lg bg-[#0B0F19] text-white px-2.5 py-1 text-xs flex items-center gap-2 shadow-xl">\n    <span>Quick Search</span>\n    <kbd className="px-1.5 py-0.2 bg-white/20 rounded font-bold text-[10px]">⌘K</kbd>\n  </div>\n</div>`}
        >
          <div className="group relative inline-flex justify-center">
            <button className="p-2 rounded-xl bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100 cursor-pointer shadow-xs">
              <Search className="w-4 h-4" />
            </button>
            <div
              className={`absolute bottom-full mb-2 ${densityConfig.tooltipPad} ${densityConfig.tooltipText} ${
                previewOpen ? "opacity-100 translate-y-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 pointer-events-none"
              } transition-all rounded-lg bg-[#0B0F19] text-white font-medium flex items-center gap-2 whitespace-nowrap shadow-xl z-20`}
            >
              <span>Quick Search</span>
              <span className="px-1.5 py-0.2 rounded bg-white/20 text-white font-bold text-[10px] tabular-nums">⌘K</span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0B0F19]" />
            </div>
          </div>
        </Card>

        <Card
          number="06"
          title="Light Surface Bordered Tooltip"
          category="cat2"
          description="Inverted crisp white card tooltip with subtle hairline border."
          code={`<div className="group relative inline-flex justify-center">\n  <button className="px-3.5 py-1.5 bg-zinc-950 text-white rounded-xl">Workspace Info</button>\n  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 rounded-xl bg-white border border-zinc-200 text-zinc-900 px-3 py-1.5 text-xs font-semibold whitespace-nowrap shadow-xl">\n    Primary AWS Asia Zone\n  </div>\n</div>`}
        >
          <div className="group relative inline-flex justify-center">
            <button className="px-3 py-1.5 rounded-xl bg-zinc-950 text-white text-xs font-semibold cursor-pointer shadow-xs">
              Workspace Info
            </button>
            <div
              className={`absolute bottom-full mb-2 ${densityConfig.tooltipPad} ${densityConfig.tooltipText} ${
                previewOpen ? "opacity-100 translate-y-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 pointer-events-none"
              } transition-all rounded-xl bg-white border border-zinc-200 text-zinc-900 font-semibold whitespace-nowrap shadow-xl z-20`}
            >
              Primary AWS Asia (Mumbai) Zone
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
            </div>
          </div>
        </Card>

        <Card
          number="07"
          title="Multi-Line Explanation Tooltip"
          category="cat2"
          description="Dashed underline term revealing structured calculations."
          code={`<span className="border-b border-dashed font-bold cursor-help">Net Revenue</span>\n<div className="absolute bottom-full mb-2 w-52 opacity-0 group-hover:opacity-100 rounded-xl bg-[#0B0F19] text-white text-[11px] p-2.5 shadow-xl">\n  Gross sales minus tax, refunds, and merchant processing charges.\n</div>`}
        >
          <div className="group relative inline-flex justify-center">
            <span className="border-b border-dashed border-zinc-500 text-xs font-bold text-zinc-950 cursor-help">
              Net Revenue
            </span>
            <div
              className={`absolute bottom-full mb-2 w-52 ${
                previewOpen ? "opacity-100 translate-y-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 pointer-events-none"
              } transition-all rounded-xl bg-[#0B0F19] text-white text-[11px] leading-relaxed p-2.5 shadow-xl z-20`}
            >
              Gross sales minus tax, refunds, and merchant processing charges for this cycle.
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0B0F19]" />
            </div>
          </div>
        </Card>

        <Card
          number="08"
          title="Click-to-Copy Confirmation Tooltip"
          category="cat2"
          description="Tooltip morphs from instruction to affirmative confirmation upon click."
          code={`<button onClick={handleCopy} className="px-3.5 py-1.5 border rounded-xl flex items-center gap-1">\n  {copied ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied</> : "Click to copy link"}\n</button>`}
        >
          <div className="group relative inline-flex justify-center">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText("https://zerolight.app/invite/hyderabad-lead");
                setCopyConfirmed(true);
                triggerToast("Invite link copied to clipboard");
                setTimeout(() => setCopyConfirmed(false), 2000);
              }}
              className="px-3.5 py-1.5 rounded-xl border border-zinc-300 bg-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Link2 className="w-3.5 h-3.5 text-zinc-500" />
              <span>Copy Invite Link</span>
            </button>
            <div
              className={`absolute bottom-full mb-2 ${densityConfig.tooltipPad} ${densityConfig.tooltipText} ${
                previewOpen || copyConfirmed ? "opacity-100 translate-y-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 pointer-events-none"
              } transition-all rounded-lg bg-[#0B0F19] text-white font-medium whitespace-nowrap shadow-xl z-20`}
            >
              {copyConfirmed ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Copied
                </span>
              ) : (
                "Click to copy link"
              )}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0B0F19]" />
            </div>
          </div>
        </Card>
        </div>
      </section>

      {/* ── 3. TOOLBAR & ICON CONTEXT HINTS ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            3. Toolbar & Icon Context Hints
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Quick formatting toolbars, table column metrics, and copy feedback.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card
          number="09"
          title="Icon Action Bar with Tooltips"
          category="cat3"
          description="Compact 4-icon action strip with individualized directional hints."
          code={`<div className="flex items-center gap-1 p-1 bg-white border rounded-xl">\n  <IconButton title="Edit Row" icon={<Edit3 />} />\n  <IconButton title="Duplicate" icon={<Copy />} />\n  <IconButton title="Share Link" icon={<Share2 />} />\n  <IconButton title="Delete" icon={<Trash2 />} />\n</div>`}
        >
          <div className="flex items-center gap-1 p-1 bg-white border border-zinc-200 rounded-xl shadow-xs">
            <div className="group relative">
              <button className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-700 cursor-pointer">
                <Edit3 className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 rounded-lg bg-[#0B0F19] text-white text-[11px] px-2 py-0.5 whitespace-nowrap z-20 pointer-events-none">
                Edit Row
              </div>
            </div>
            <div className="group relative">
              <button className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-700 cursor-pointer">
                <Copy className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 rounded-lg bg-[#0B0F19] text-white text-[11px] px-2 py-0.5 whitespace-nowrap z-20 pointer-events-none">
                Duplicate
              </div>
            </div>
            <div className="group relative">
              <button className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-700 cursor-pointer">
                <Share2 className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 rounded-lg bg-[#0B0F19] text-white text-[11px] px-2 py-0.5 whitespace-nowrap z-20 pointer-events-none">
                Share Link
              </div>
            </div>
            <div className="group relative">
              <button className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 rounded-lg bg-rose-600 text-white text-[11px] px-2 py-0.5 whitespace-nowrap z-20 pointer-events-none">
                Delete
              </div>
            </div>
          </div>
        </Card>

        <Card
          number="10"
          title="Disabled Button Reason Tooltip"
          category="cat3"
          description="Explains plan lock limitations without frustrating the user."
          code={`<div className="group relative inline-flex justify-center">\n  <button disabled className="px-3.5 py-1.5 bg-zinc-200 text-zinc-400 rounded-xl cursor-not-allowed">Export All</button>\n  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 rounded-lg bg-[#0B0F19] text-white px-2.5 py-1 text-xs whitespace-nowrap shadow-xl">\n    Available on Pro Plan\n  </div>\n</div>`}
        >
          <div className="group relative inline-flex justify-center">
            <button disabled className="px-3.5 py-1.5 rounded-xl bg-zinc-200 text-zinc-400 text-xs font-semibold cursor-not-allowed flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Export All (CSV)
            </button>
            <div
              className={`absolute bottom-full mb-2 ${densityConfig.tooltipPad} ${densityConfig.tooltipText} ${
                previewOpen ? "opacity-100 translate-y-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 pointer-events-none"
              } transition-all rounded-lg bg-[#0B0F19] text-white font-medium whitespace-nowrap shadow-xl z-20`}
            >
              Available on Pro Plan
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0B0F19]" />
            </div>
          </div>
        </Card>

        <Card
          number="11"
          title="Live Status Dot Tooltip"
          category="cat3"
          description="Health badge revealing exact uptime latency and cluster health."
          code={`<div className="group relative inline-flex justify-center">\n  <div className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">\n    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />\n    <span>API Healthy</span>\n  </div>\n  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 rounded-lg bg-[#0B0F19] text-white px-2.5 py-1 text-xs tabular-nums">\n    All 4 servers responding in 42ms\n  </div>\n</div>`}
        >
          <div className="group relative inline-flex justify-center">
            <div className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>API Healthy</span>
            </div>
            <div
              className={`absolute bottom-full mb-2 ${densityConfig.tooltipPad} ${densityConfig.tooltipText} ${
                previewOpen ? "opacity-100 translate-y-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 pointer-events-none"
              } transition-all rounded-lg bg-[#0B0F19] text-white font-medium whitespace-nowrap shadow-xl z-20 tabular-nums`}
            >
              All 4 servers responding in 42ms
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0B0F19]" />
            </div>
          </div>
        </Card>

        <Card
          number="12"
          title="Truncated Text Full-Name Hint"
          category="cat3"
          description="Ellipsized filenames seamlessly expand to full title on hover."
          code={`<div className="group relative inline-flex justify-center max-w-[200px]">\n  <span className="truncate text-xs cursor-help">q4_financial_audit_compliance_report.pdf</span>\n  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 rounded-lg bg-[#0B0F19] text-white px-2.5 py-1 text-xs whitespace-nowrap">\n    q4_financial_audit_compliance_report.pdf\n  </div>\n</div>`}
        >
          <div className="group relative inline-flex justify-center max-w-[200px]">
            <span className="truncate text-xs font-medium text-zinc-800 cursor-help">
              q4_financial_audit_compliance_report_final_v2.pdf
            </span>
            <div
              className={`absolute bottom-full mb-2 ${densityConfig.tooltipPad} ${densityConfig.tooltipText} ${
                previewOpen ? "opacity-100 translate-y-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 pointer-events-none"
              } transition-all rounded-lg bg-[#0B0F19] text-white font-medium whitespace-nowrap shadow-xl z-20`}
            >
              q4_financial_audit_compliance_report_final_v2.pdf
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0B0F19]" />
            </div>
          </div>
        </Card>
        </div>
      </section>

      {/* ── 4. RICH PROFILE & QUOTA POPOVERS ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            4. Rich Profile & Quota Popovers
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            User presence profiles, plan quota usages, and notification feeds.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card
          number="13"
          title="Feature Info Card Popover"
          category="cat4"
          description="Click-triggered contextual explanation of seat-based billing."
          code={`<button onClick={() => setOpen(!open)}>How Billing Works</button>\n<div className="w-64 bg-white border rounded-xl p-3 shadow-2xl">\n  <div className="font-bold">Prorated Seat Model</div>\n  <p className="text-xs text-zinc-500">Seats added mid-month are calculated to the minute.</p>\n</div>`}
        >
          <div className="relative" data-popover-container>
            <button
              type="button"
              onClick={() => setActivePopover(activePopover === "p13" ? null : "p13")}
              className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5 hover:text-zinc-950 cursor-pointer"
            >
              <span>How Billing Works</span>
              <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
            </button>
            {(activePopover === "p13" || previewOpen) && (
              <div
                className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 ${densityConfig.popoverWidth} bg-white border border-zinc-200 rounded-xl p-3 shadow-2xl z-30 text-xs animate-in fade-in duration-150`}
              >
                <div className="font-bold text-zinc-950 mb-1">Prorated Seat Model</div>
                <p className="text-[11px] text-zinc-500 leading-relaxed mb-2">
                  Seats added mid-month are calculated to the minute and automatically credited if removed before the 25th.
                </p>
                <a href="#learn-more" className="text-[11px] font-bold text-zinc-950 hover:underline flex items-center gap-1">
                  Learn about invoices &rarr;
                </a>
              </div>
            )}
          </div>
        </Card>

        <Card
          number="14"
          title="User Profile Preview Popover"
          category="cat4"
          description="Teammate mention tag revealing avatar, role, and quick actions."
          code={`<button onClick={() => setOpen(!open)}>@Ananya Reddy</button>\n<div className="w-64 bg-white border rounded-2xl p-3.5 shadow-2xl">\n  <div className="font-bold">Ananya Reddy</div>\n  <div className="text-xs text-zinc-500">Security Lead • Hyderabad</div>\n</div>`}
        >
          <div className="relative" data-popover-container>
            <button
              type="button"
              onClick={() => setActivePopover(activePopover === "p14" ? null : "p14")}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 text-xs font-semibold text-zinc-900 hover:bg-zinc-200 transition cursor-pointer"
            >
              @Ananya Reddy
            </button>
            {(activePopover === "p14" || previewOpen) && (
              <div
                className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 ${densityConfig.popoverWidth} bg-white border border-zinc-200 rounded-2xl p-3.5 shadow-2xl z-30 text-xs animate-in fade-in duration-150`}
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                    AR
                  </div>
                  <div>
                    <div className="font-bold text-zinc-950">Ananya Reddy</div>
                    <div className="text-[11px] text-zinc-500">Security Lead • Hyderabad</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-600 py-1.5 border-t border-zinc-100">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active Now
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePopover(null);
                      triggerToast("Direct message opened with Ananya");
                    }}
                    className="font-bold text-zinc-950 hover:underline cursor-pointer"
                  >
                    Message &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card
          number="15"
          title="Usage & Quota Breakdown Popover"
          category="cat4"
          description="Pill button opening full storage metrics with upgrade path."
          code={`<button onClick={() => setOpen(!open)}>82% Storage Used</button>\n<div className="w-64 bg-white border rounded-2xl p-3.5 shadow-2xl">\n  <div className="font-bold">Workspace Vault: 8.2 / 10 GB</div>\n  <ProgressBar value={82} />\n</div>`}
        >
          <div className="relative" data-popover-container>
            <button
              type="button"
              onClick={() => setActivePopover(activePopover === "p15" ? null : "p15")}
              className="px-3 py-1.5 rounded-xl border border-amber-300/80 bg-amber-50 text-amber-900 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span className="tabular-nums">82% Storage Used</span>
            </button>
            {(activePopover === "p15" || previewOpen) && (
              <div
                className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 ${densityConfig.popoverWidth} bg-white border border-zinc-200 rounded-2xl p-3.5 shadow-2xl z-30 text-xs animate-in fade-in duration-150`}
              >
                <div className="flex justify-between font-bold text-zinc-950 mb-1.5">
                  <span>Workspace Vault</span>
                  <span className="tabular-nums">8.2 / 10 GB</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-200 overflow-hidden mb-2">
                  <div className="h-full bg-amber-500 rounded-full w-[82%]" />
                </div>
                <p className="text-[11px] text-zinc-500 mb-2">1.8 GB remaining before sync slows down.</p>
                <button
                  type="button"
                  onClick={() => {
                    setActivePopover(null);
                    triggerToast("Upgraded storage to 50 GB");
                  }}
                  className="w-full py-1.5 rounded-lg bg-zinc-950 text-white font-semibold text-xs shadow-xs cursor-pointer"
                >
                  Upgrade to 50 GB
                </button>
              </div>
            )}
          </div>
        </Card>

        <Card
          number="16"
          title="Keyboard Shortcuts Cheat-Sheet Popover"
          category="cat4"
          description="Global key shortcuts card for power users and command palettes."
          code={`<button onClick={() => setOpen(!open)}>Shortcuts</button>\n<div className="w-64 bg-white border rounded-2xl p-3 shadow-2xl">\n  <div className="flex justify-between"><span>Search</span><kbd>⌘ K</kbd></div>\n</div>`}
        >
          <div className="relative" data-popover-container>
            <button
              type="button"
              onClick={() => setActivePopover(activePopover === "p16" ? null : "p16")}
              className="px-3 py-1.5 rounded-xl border border-zinc-300 bg-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Command className="w-3.5 h-3.5" />
              <span>Shortcuts</span>
            </button>
            {(activePopover === "p16" || previewOpen) && (
              <div
                className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 ${densityConfig.popoverWidth} bg-white border border-zinc-200 rounded-2xl p-3 shadow-2xl z-30 text-xs animate-in fade-in duration-150 space-y-1.5`}
              >
                <div className="font-bold text-zinc-950 mb-1">Global Hotkeys</div>
                <div className="flex justify-between items-center text-[11px] text-zinc-600">
                  <span>Search Everywhere</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 font-bold text-zinc-900">⌘ K</kbd>
                </div>
                <div className="flex justify-between items-center text-[11px] text-zinc-600">
                  <span>Create New Invoice</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 font-bold text-zinc-900">⌘ N</kbd>
                </div>
                <div className="flex justify-between items-center text-[11px] text-zinc-600">
                  <span>Quick Save</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 font-bold text-zinc-900">⌘ S</kbd>
                </div>
              </div>
            )}
          </div>
        </Card>
        </div>
      </section>

      {/* ── 5. SAFETY CONFIRMATION & WARNING POPOVERS ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            5. Safety Confirmation & Warning Popovers
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Two-step confirmation dialogs, permanent action locks, and danger zones.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card
          number="17"
          title="Delete Confirmation Popover"
          category="cat5"
          description="Non-modal lightweight safety check replacing intrusive browser popups."
          code={`<button onClick={() => setOpen(!open)}>Delete Invoice</button>\n<div className="w-64 bg-white border rounded-2xl p-3.5 shadow-2xl">\n  <div className="font-bold">Delete this record?</div>\n  <div className="flex justify-end gap-2"><button>Cancel</button><button className="bg-rose-600 text-white">Yes, Delete</button></div>\n</div>`}
        >
          <div className="relative" data-popover-container>
            <button
              type="button"
              onClick={() => setActivePopover(activePopover === "p17" ? null : "p17")}
              className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs hover:bg-rose-100"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Invoice</span>
            </button>
            {(activePopover === "p17" || previewOpen) && (
              <div
                className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 ${densityConfig.popoverWidth} bg-white border border-zinc-200 rounded-2xl p-3.5 shadow-2xl z-30 text-xs animate-in fade-in duration-150`}
              >
                <div className="font-bold text-zinc-950 mb-1">Delete this record?</div>
                <p className="text-[11px] text-zinc-500 mb-3">This action cannot be undone and will void tax logs.</p>
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActivePopover(null)}
                    className="px-2.5 py-1 rounded-lg text-zinc-600 hover:bg-zinc-100 text-[11px] font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePopover(null);
                      triggerToast("Invoice deleted successfully");
                    }}
                    className="px-3 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-semibold shadow-xs cursor-pointer"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card
          number="18"
          title="Publish Live Confirmation Popover"
          category="cat5"
          description="Confirms deployment to live production environment."
          code={`<button onClick={() => setOpen(!open)}>Publish Live</button>\n<div className="w-64 bg-white border rounded-2xl p-3.5 shadow-2xl">\n  <div className="font-bold">Push to production?</div>\n  <button className="bg-zinc-950 text-white">Publish Now</button>\n</div>`}
        >
          <div className="relative" data-popover-container>
            <button
              type="button"
              onClick={() => setActivePopover(activePopover === "p18" ? null : "p18")}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-950 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Publish Live</span>
            </button>
            {(activePopover === "p18" || previewOpen) && (
              <div
                className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 ${densityConfig.popoverWidth} bg-white border border-zinc-200 rounded-2xl p-3.5 shadow-2xl z-30 text-xs animate-in fade-in duration-150`}
              >
                <div className="font-bold text-zinc-950 mb-1">Push to production?</div>
                <p className="text-[11px] text-zinc-500 mb-3">All 48 workspace members will immediately see these design tokens.</p>
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActivePopover(null)}
                    className="px-2.5 py-1 rounded-lg text-zinc-600 hover:bg-zinc-100 text-[11px] font-semibold cursor-pointer"
                  >
                    Not Yet
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePopover(null);
                      triggerToast("Published live to production");
                    }}
                    className="px-3 py-1 rounded-lg bg-zinc-950 text-white text-[11px] font-semibold shadow-xs cursor-pointer"
                  >
                    Publish Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card
          number="19"
          title="Revoke Access Warning Popover"
          category="cat5"
          description="Safeguards API keys and critical integrations from accidental revocation."
          code={`<button onClick={() => setOpen(!open)}>Revoke Key</button>\n<div className="w-64 bg-white border rounded-2xl p-3.5 shadow-2xl">\n  <div className="font-bold">Revoke API Key?</div>\n  <button className="bg-amber-600 text-white">Revoke</button>\n</div>`}
        >
          <div className="relative" data-popover-container>
            <button
              type="button"
              onClick={() => setActivePopover(activePopover === "p19" ? null : "p19")}
              className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs hover:bg-amber-100"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Revoke Key</span>
            </button>
            {(activePopover === "p19" || previewOpen) && (
              <div
                className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 ${densityConfig.popoverWidth} bg-white border border-zinc-200 rounded-2xl p-3.5 shadow-2xl z-30 text-xs animate-in fade-in duration-150`}
              >
                <div className="font-bold text-amber-950 mb-1">Revoke sk_live_89a?</div>
                <p className="text-[11px] text-zinc-500 mb-3">Live payment webhooks using this key will immediately return 401 Unauthorized.</p>
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActivePopover(null)}
                    className="px-2.5 py-1 rounded-lg text-zinc-600 hover:bg-zinc-100 text-[11px] font-semibold cursor-pointer"
                  >
                    Keep Key
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePopover(null);
                      triggerToast("API Key revoked successfully");
                    }}
                    className="px-3 py-1 rounded-lg bg-amber-600 text-white text-[11px] font-semibold shadow-xs cursor-pointer"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
        </div>
      </section>

      {/* ── 6. QUICK-EDIT & IN-CONTEXT NOTES ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            6. Quick-Edit & In-Context Notes
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Inline cell annotations, workspace tags, and collaborative notes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card
          number="20"
          title="Share Link & Access Popover"
          category="cat6"
          description="Quick share input box with copy button and permission selector."
          code={`<button onClick={() => setOpen(!open)}>Share</button>\n<div className="w-64 bg-white border rounded-2xl p-3.5 shadow-2xl">\n  <input value="https://zerolight.app/p/erp" />\n</div>`}
        >
          <div className="relative" data-popover-container>
            <button
              type="button"
              onClick={() => setActivePopover(activePopover === "p20" ? null : "p20")}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-950 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            {(activePopover === "p20" || previewOpen) && (
              <div
                className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 ${densityConfig.popoverWidth} bg-white border border-zinc-200 rounded-2xl p-3.5 shadow-2xl z-30 text-xs animate-in fade-in duration-150`}
              >
                <div className="font-bold text-zinc-950 mb-2">Share Project Access</div>
                <div className="flex items-center gap-1.5 mb-2">
                  <input
                    readOnly
                    value="https://zerolight.app/p/erp-q4"
                    className="w-full px-2.5 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-[11px] text-zinc-700"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("https://zerolight.app/p/erp-q4");
                      triggerToast("Project link copied");
                      setActivePopover(null);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-zinc-950 text-white text-[11px] font-semibold whitespace-nowrap shadow-xs cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
                <div className="text-[11px] text-zinc-500">Anyone in your team with link can edit.</div>
              </div>
            )}
          </div>
        </Card>

        <Card
          number="21"
          title="Quick Rename Popover"
          category="cat6"
          description="Click-to-rename title with instant live label update."
          code={`<button onClick={() => setOpen(!open)} className="flex items-center gap-1.5">{title} <Edit2 className="w-3.5 h-3.5" /></button>\n<div className="w-64 bg-white border rounded-2xl p-3 shadow-2xl">\n  <input value={title} onChange={e => setTitle(e.target.value)} />\n</div>`}
        >
          <div className="relative" data-popover-container>
            <button
              type="button"
              onClick={() => setActivePopover(activePopover === "p21" ? null : "p21")}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-950 flex items-center gap-1.5 cursor-pointer shadow-xs hover:border-zinc-400"
            >
              <span>{pipelineTitle}</span>
              <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
            </button>
            {(activePopover === "p21" || previewOpen) && (
              <div
                className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 ${densityConfig.popoverWidth} bg-white border border-zinc-200 rounded-2xl p-3 shadow-2xl z-30 text-xs animate-in fade-in duration-150`}
              >
                <div className="font-bold text-zinc-950 mb-1.5">Rename Document</div>
                <input
                  type="text"
                  value={renameInputVal}
                  onChange={(e) => setRenameInputVal(e.target.value)}
                  className="w-full px-2.5 py-1 rounded-lg border border-zinc-200 bg-white text-xs mb-2 text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActivePopover(null)}
                    className="px-2 py-1 rounded-lg text-zinc-600 text-[11px] font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (renameInputVal.trim()) {
                        setPipelineTitle(renameInputVal.trim());
                        triggerToast(`Renamed to "${renameInputVal.trim()}"`);
                      }
                      setActivePopover(null);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-zinc-950 text-white text-[11px] font-semibold shadow-xs cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card
          number="22"
          title="Quick Note / Feedback Popover"
          category="cat6"
          description="Compact in-app feedback textarea popping up right next to trigger."
          code={`<button onClick={() => setOpen(!open)}>Send Feedback</button>\n<div className="w-64 bg-white border rounded-2xl p-3.5 shadow-2xl">\n  <textarea placeholder="Your notes..." />\n</div>`}
        >
          <div className="relative" data-popover-container>
            <button
              type="button"
              onClick={() => setActivePopover(activePopover === "p22" ? null : "p22")}
              className="px-3.5 py-1.5 rounded-xl border border-zinc-300 bg-white text-xs font-semibold text-zinc-800 flex items-center gap-1.5 cursor-pointer shadow-xs hover:bg-zinc-100"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send Feedback</span>
            </button>
            {(activePopover === "p22" || previewOpen) && (
              <div
                className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 ${densityConfig.popoverWidth} bg-white border border-zinc-200 rounded-2xl p-3.5 shadow-2xl z-30 text-xs animate-in fade-in duration-150`}
              >
                <div className="font-bold text-zinc-950 mb-1.5">Send Quick Note</div>
                <textarea
                  rows={3}
                  placeholder="Describe issue or request..."
                  className="w-full p-2 rounded-xl border border-zinc-200 bg-white text-xs mb-2 text-zinc-950 resize-none focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActivePopover(null)}
                    className="px-2 py-1 rounded-lg text-zinc-600 text-[11px] font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePopover(null);
                      triggerToast("Feedback submitted. Thank you!");
                    }}
                    className="px-3 py-1 rounded-lg bg-zinc-950 text-white text-[11px] font-semibold shadow-xs cursor-pointer"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
        </div>
      </section>

      {/* Code Modal */}
      <CodeModal
        modal={activeCodeModal}
        onClose={() => setActiveCodeModal(null)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0B0F19] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-white/10 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-150">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
