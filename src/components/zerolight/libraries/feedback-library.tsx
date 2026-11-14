"use client";

import React, { useState } from "react";
import {
  Search,
  Copy,
  Check,
  X,
  RotateCcw,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Lightbulb,
  Clock,
  CreditCard,
  RotateCw,
  FolderPlus,
  SearchX,
  Users,
  CheckCheck,
  WifiOff,
  ShieldAlert,
  Lock,
  FileSpreadsheet,
} from "lucide-react";
import { useZeroLight } from "../context";
import { Badge } from "../atoms/badge";

export type FeedbackDensity = "small" | "medium" | "large";

export function SaaSFeedbackLibrary() {
  const { tokens } = useZeroLight();

  // Sticky Bar States
  const [searchQuery, setSearchQuery] = useState("");
  const [density, setDensity] = useState<FeedbackDensity>("medium");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Code Modal State
  const [activeCodeModal, setActiveCodeModal] = useState<{ title: string; code: string } | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Dismissed Alerts Set
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Interactive Live Toast Stack
  const [liveToasts, setLiveToasts] = useState<Array<{ id: number; message: string; withUndo: boolean }>>([]);

  // Retry Simulator
  const [isRetrying, setIsRetrying] = useState(false);

  // Density Config
  const densityConfig = {
    small: { padding: "p-2.5", text: "text-xs" },
    medium: { padding: "p-3.5", text: "text-[13px]" },
    large: { padding: "p-4.5", text: "text-sm" },
  }[density];

  const categories = [
    { id: "all", label: "All (20)" },
    { id: "cat1", label: "1. Inline Page Alerts" },
    { id: "cat2", label: "2. Top Banners" },
    { id: "cat3", label: "3. Snackbars & Toasts" },
    { id: "cat4", label: "4. Empty States" },
    { id: "cat5", label: "5. Error & Locked States" },
  ];

  const handleDismiss = (id: string) => {
    setDismissedAlerts((prev) => new Set([...prev, id]));
    spawnToast("Alert dismissed. Click 'Restore Hidden' to restore.", false);
  };

  const handleRestoreAll = () => {
    setDismissedAlerts(new Set());
    spawnToast("All dismissed alerts and banners restored.", false);
  };

  const spawnToast = (message: string, withUndo: boolean) => {
    const id = Date.now();
    setLiveToasts((prev) => [...prev, { id, message, withUndo }]);
    setTimeout(() => {
      setLiveToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleRetryAction = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      spawnToast("Analytics reports reconnected successfully!", false);
    }, 1200);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 1800);
  };

  // Helper Card
  const Card = ({
    id,
    number,
    title,
    category,
    description,
    code,
    children,
  }: {
    id: string;
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
    <div className="space-y-6">
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
                <h2 className="text-sm font-bold text-zinc-950 tracking-tight">SaaS Feedback, Alerts & Empty States</h2>
                <Badge variant="healthy">20 Variants</Badge>
              </div>
              <p className="text-[11px] text-zinc-500">
                Inline alerts, top announcement bars, undo toasts, empty records & recoverable error states.
              </p>
            </div>
          </div>

          {/* Controls: Search, 3 Density Tiers, Restore Hidden */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Live Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition w-44"
              />
            </div>

            {/* Density Tiers */}
            <div className="flex items-center p-0.5 rounded-xl bg-zinc-200/70 border border-zinc-300/40">
              {(["small", "medium", "large"] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setDensity(tier)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                    density === tier
                      ? "bg-white text-zinc-950 shadow-xs"
                      : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            {/* Restore Hidden Button */}
            <button
              type="button"
              onClick={handleRestoreAll}
              className="px-2.5 py-1.5 rounded-xl border border-zinc-200 bg-white text-zinc-800 font-semibold flex items-center gap-1.5 hover:bg-zinc-50 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
              <span>Restore Hidden</span>
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* ============================================== */}
        {/* CATEGORY 1: INLINE PAGE ALERTS (6)             */}
        {/* ============================================== */}

        <Card
          id="alert-01"
          number="01"
          title="Neutral Info Alert"
          category="cat1"
          description="Subtle informative notice with dismiss button."
          code={`<div className="p-3.5 rounded-xl bg-zinc-100 border border-zinc-200 flex justify-between">\n  <div><div className="font-bold text-zinc-900">Automatic Tax Calculation</div><p className="text-xs text-zinc-600">GST rates synchronized dynamically.</p></div>\n  <button><X className="w-3.5 h-3.5" /></button>\n</div>`}
        >
          {!dismissedAlerts.has("alert-01") ? (
            <div className={`${densityConfig.padding} ${densityConfig.text} rounded-xl bg-zinc-100 border border-zinc-200 flex items-start justify-between gap-3 transition-all duration-200`}>
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-zinc-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-zinc-900">Automatic Tax Calculation</div>
                  <div className="text-[11px] text-zinc-600 mt-0.5">GST rates are synchronized dynamically based on client state jurisdiction.</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDismiss("alert-01")}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-zinc-50 border border-dashed border-zinc-200 text-center text-xs text-zinc-400 italic">
              Alert dismissed. Click Restore Hidden.
            </div>
          )}
        </Card>

        <Card
          id="alert-02"
          number="02"
          title="Success Confirmation Alert"
          category="cat1"
          description="Soft emerald callout confirming verified business identity."
          code={`<div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between">\n  <div><div className="font-bold text-emerald-950">Bank Account Verified</div><p className="text-xs text-emerald-800">Penny-drop verification completed.</p></div>\n  <button><X className="w-3.5 h-3.5" /></button>\n</div>`}
        >
          {!dismissedAlerts.has("alert-02") ? (
            <div className={`${densityConfig.padding} ${densityConfig.text} rounded-xl bg-emerald-50 border border-emerald-200 flex items-start justify-between gap-3 transition-all duration-200`}>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-emerald-950">Bank Account Verified</div>
                  <div className="text-[11px] text-emerald-800 mt-0.5">Automated penny-drop verification completed with HDFC Bank.</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDismiss("alert-02")}
                className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-100 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-zinc-50 border border-dashed border-zinc-200 text-center text-xs text-zinc-400 italic">
              Alert dismissed. Click Restore Hidden.
            </div>
          )}
        </Card>

        <Card
          id="alert-03"
          number="03"
          title="Warning Alert with Action"
          category="cat1"
          description="Seat capacity warning with inline expansion link."
          code={`<div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex justify-between">\n  <div><div className="font-bold text-amber-950">90% of Monthly Seats Used</div><a href="#" className="font-bold">Add seats</a></div>\n  <button><X className="w-3.5 h-3.5" /></button>\n</div>`}
        >
          {!dismissedAlerts.has("alert-03") ? (
            <div className={`${densityConfig.padding} ${densityConfig.text} rounded-xl bg-amber-50 border border-amber-200 flex items-start justify-between gap-3 transition-all duration-200`}>
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-amber-950">90% of Monthly Seats Used</div>
                  <div className="text-[11px] text-amber-800 mt-0.5">45 of 50 team member seats are currently active.</div>
                  <button
                    type="button"
                    onClick={() => spawnToast("Redirecting to Seat Upgrade page", false)}
                    className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-amber-950 hover:underline cursor-pointer"
                  >
                    Add more seats &rarr;
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDismiss("alert-03")}
                className="p-1 rounded-lg text-amber-600 hover:bg-amber-100 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-zinc-50 border border-dashed border-zinc-200 text-center text-xs text-zinc-400 italic">
              Alert dismissed. Click Restore Hidden.
            </div>
          )}
        </Card>

        <Card
          id="alert-04"
          number="04"
          title="Danger Error Alert with Fix Button"
          category="cat1"
          description="Critical sync alert with prominent primary reconnect button."
          code={`<div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">\n  <div className="font-bold text-rose-950">Invoice Sync Failed</div>\n  <button className="bg-rose-600 text-white px-2.5 py-1 rounded-lg mt-2">Reconnect Now</button>\n</div>`}
        >
          {!dismissedAlerts.has("alert-04") ? (
            <div className={`${densityConfig.padding} ${densityConfig.text} rounded-xl bg-rose-50 border border-rose-200 flex items-start justify-between gap-3 transition-all duration-200`}>
              <div className="flex items-start gap-2.5">
                <AlertOctagon className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-rose-950">Invoice Sync Failed</div>
                  <div className="text-[11px] text-rose-800 mt-0.5">Zoho Books authentication token expired 14 minutes ago.</div>
                  <button
                    type="button"
                    onClick={() => spawnToast("Re-authenticating Zoho Books OAuth...", false)}
                    className="mt-2 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-semibold text-xs shadow-xs hover:bg-rose-700 cursor-pointer"
                  >
                    Reconnect Now
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDismiss("alert-04")}
                className="p-1 rounded-lg text-rose-600 hover:bg-rose-100 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-zinc-50 border border-dashed border-zinc-200 text-center text-xs text-zinc-400 italic">
              Alert dismissed. Click Restore Hidden.
            </div>
          )}
        </Card>

        <Card
          id="alert-05"
          number="05"
          title="Left-Accent Border Callout"
          category="cat1"
          description="Structured tips with thick high-visibility left border bar."
          code={`<div className="p-3.5 rounded-r-xl border-l-4 border-l-zinc-950 bg-zinc-50 border-y border-r border-zinc-200">\n  <div className="font-bold">Tip: Use Keyboard Shortcuts</div>\n  <p className="text-xs text-zinc-500">Press ⌘B to toggle dock.</p>\n</div>`}
        >
          <div className={`${densityConfig.padding} ${densityConfig.text} rounded-r-xl rounded-l-xs bg-zinc-50 border-l-4 border-l-zinc-950 border-y border-r border-zinc-200`}>
            <div className="font-bold text-zinc-950 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-zinc-600" />
              Tip: Use Keyboard Shortcuts
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
              Press <kbd className="px-1.5 py-0.2 rounded bg-zinc-200 font-bold text-zinc-800">⌘ + B</kbd> anywhere to toggle the obsidian navigation dock.
            </div>
          </div>
        </Card>

        <Card
          id="alert-06"
          number="06"
          title="Compact Single-Line Notice"
          category="cat1"
          description="Low-profile auto-save strip for content editors and settings pages."
          code={`<div className="px-3 py-2 rounded-xl bg-zinc-100 border flex justify-between text-xs">\n  <span>Auto-save is active for all changes</span>\n  <span className="text-zinc-400">Just now</span>\n</div>`}
        >
          <div className="px-3 py-2 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-zinc-700 font-medium">Auto-save is active for all changes</span>
            </div>
            <span className="text-[10px] text-zinc-400 tabular-nums">Just now</span>
          </div>
        </Card>

        {/* ============================================== */}
        {/* CATEGORY 2: TOP BANNERS (3)                    */}
        {/* ============================================== */}

        <Card
          id="banner-07"
          number="07"
          title="Free Trial Countdown Banner"
          category="cat2"
          description="High-contrast top announcement bar for trial conversions."
          code={`<div className="p-3 rounded-xl bg-[#0B0F19] text-white flex justify-between text-xs">\n  <span>4 days left in trial</span>\n  <button className="bg-white text-zinc-950 px-2.5 py-1 rounded font-bold">Upgrade Now</button>\n</div>`}
        >
          {!dismissedAlerts.has("banner-07") ? (
            <div className="p-3 rounded-xl bg-[#0B0F19] text-white flex items-center justify-between gap-2 shadow-sm text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="font-medium text-[11px]"><strong>4 days left</strong> in your Enterprise trial.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => spawnToast("Opened Upgrade Billing Modal", false)}
                  className="px-2.5 py-1 rounded-lg bg-white text-zinc-950 font-bold text-[11px] shadow-xs hover:bg-zinc-100 cursor-pointer"
                >
                  Upgrade Now
                </button>
                <button
                  type="button"
                  onClick={() => handleDismiss("banner-07")}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-zinc-50 border border-dashed border-zinc-200 text-center text-xs text-zinc-400 italic">
              Banner dismissed. Click Restore Hidden.
            </div>
          )}
        </Card>

        <Card
          id="banner-08"
          number="08"
          title="Failed Payment Action Banner"
          category="cat2"
          description="Urgent top bar alerting user to settle declined card invoice."
          code={`<div className="p-3 rounded-xl bg-rose-600 text-white flex justify-between text-xs">\n  <span>Your last card payment failed. Access locks in 48h.</span>\n  <button className="bg-white text-rose-700 px-2.5 py-1 rounded font-bold">Update Card</button>\n</div>`}
        >
          {!dismissedAlerts.has("banner-08") ? (
            <div className="p-3 rounded-xl bg-rose-600 text-white flex items-center justify-between gap-2 shadow-sm text-xs">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-white flex-shrink-0" />
                <span className="font-medium text-[11px]">Your last card payment failed. Access locks in 48h.</span>
              </div>
              <button
                type="button"
                onClick={() => spawnToast("Navigating to Payment Settings", false)}
                className="px-2.5 py-1 rounded-lg bg-white text-rose-700 font-bold text-[11px] shadow-xs hover:bg-rose-50 cursor-pointer"
              >
                Update Card
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-zinc-50 border border-dashed border-zinc-200 text-center text-xs text-zinc-400 italic">
              Banner dismissed. Click Restore Hidden.
            </div>
          )}
        </Card>

        <Card
          id="banner-09"
          number="09"
          title="New Feature Release Banner"
          category="cat2"
          description="Product announcement bar highlighting major software release."
          code={`<div className="p-3 rounded-xl bg-zinc-900 text-white flex justify-between text-xs">\n  <div className="flex items-center gap-2"><span className="bg-emerald-500 px-1.5 py-0.5 rounded text-[10px]">New</span><span>Bulk GST invoice export is live.</span></div>\n  <button><X className="w-3.5 h-3.5" /></button>\n</div>`}
        >
          {!dismissedAlerts.has("banner-09") ? (
            <div className="p-3 rounded-xl bg-zinc-900 text-white flex items-center justify-between gap-2 shadow-sm text-xs">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-zinc-950 font-bold text-[10px] uppercase">New</span>
                <span className="text-[11px] text-zinc-200">Bulk GST invoice export is now live in ERP.</span>
              </div>
              <button
                type="button"
                onClick={() => handleDismiss("banner-09")}
                className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-zinc-50 border border-dashed border-zinc-200 text-center text-xs text-zinc-400 italic">
              Banner dismissed. Click Restore Hidden.
            </div>
          )}
        </Card>

        {/* ============================================== */}
        {/* CATEGORY 3: SNACKBARS & UNDO TOASTS (3)        */}
        {/* ============================================== */}

        <Card
          id="toast-10"
          number="10"
          title="Deleted Item with Undo Toast"
          category="cat3"
          description="Safety net toast allowing users to instantly reverse deletions."
          code={`<div className="p-3 rounded-xl bg-zinc-900 text-white flex justify-between text-xs">\n  <span>Invoice #1042 deleted</span>\n  <button className="text-amber-400 font-bold">Undo</button>\n</div>`}
        >
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-zinc-900 text-white flex items-center justify-between text-xs">
              <span>Invoice #1042 deleted</span>
              <button
                type="button"
                onClick={() => spawnToast("Deletion undone!", false)}
                className="font-bold text-amber-400 hover:underline cursor-pointer"
              >
                Undo
              </button>
            </div>
            <button
              type="button"
              onClick={() => spawnToast("Invoice #1042 deleted", true)}
              className="w-full py-1.5 rounded-xl border border-zinc-300 bg-zinc-50 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 transition cursor-pointer"
            >
              Trigger Live Undo Toast
            </button>
          </div>
        </Card>

        <Card
          id="toast-11"
          number="11"
          title="Saved Confirmation Toast"
          category="cat3"
          description="Affirmative notification upon successful settings persistence."
          code={`<div className="p-3 rounded-xl bg-[#0B0F19] text-white flex items-center gap-2 text-xs">\n  <Check className="w-4 h-4 text-emerald-400" />\n  <span>Workspace preferences saved</span>\n</div>`}
        >
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#0B0F19] text-white flex items-center gap-2 text-xs">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Workspace preferences saved</span>
            </div>
            <button
              type="button"
              onClick={() => spawnToast("Workspace preferences saved", false)}
              className="w-full py-1.5 rounded-xl border border-zinc-300 bg-zinc-50 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 transition cursor-pointer"
            >
              Trigger Live Save Toast
            </button>
          </div>
        </Card>

        <Card
          id="toast-12"
          number="12"
          title="Background Export Ready Toast"
          category="cat3"
          description="Completes async data worker pipeline with download trigger."
          code={`<div className="p-3 rounded-xl bg-zinc-900 text-white flex justify-between text-xs">\n  <div className="flex items-center gap-2"><FileSpreadsheet className="w-4 h-4 text-emerald-400" /><span>Q4_Report.xlsx is ready</span></div>\n  <button className="font-bold">Download</button>\n</div>`}
        >
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-zinc-900 text-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px]">Q4_Report.xlsx is ready</span>
              </div>
              <button
                type="button"
                onClick={() => spawnToast("Downloading Q4_Report.xlsx...", false)}
                className="font-bold text-white hover:underline flex items-center gap-1 cursor-pointer"
              >
                Download
              </button>
            </div>
            <button
              type="button"
              onClick={() => spawnToast("Q4_Report.xlsx is ready for download", false)}
              className="w-full py-1.5 rounded-xl border border-zinc-300 bg-zinc-50 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 transition cursor-pointer"
            >
              Trigger Live Export Toast
            </button>
          </div>
        </Card>

        {/* ============================================== */}
        {/* CATEGORY 4: EMPTY STATES (4)                   */}
        {/* ============================================== */}

        <Card
          id="empty-13"
          number="13"
          title="First-Time Empty Table State"
          category="cat4"
          description="Onboarding zero-state guiding user to create first record."
          code={`<div className="p-6 rounded-xl border border-dashed text-center">\n  <div className="font-bold mb-1">No projects yet</div>\n  <p className="text-xs text-zinc-500 mb-3">Get started by creating your first workspace.</p>\n  <button className="bg-zinc-950 text-white px-3 py-1.5 rounded-xl">+ Create Project</button>\n</div>`}
        >
          <div className="p-6 rounded-xl bg-zinc-50 border border-dashed border-zinc-300 text-center">
            <div className="w-10 h-10 rounded-2xl bg-zinc-200 flex items-center justify-center mx-auto mb-2 text-zinc-600">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div className="font-bold text-zinc-950 text-xs mb-1">No projects yet</div>
            <p className="text-[11px] text-zinc-500 mb-3 max-w-[200px] mx-auto">Get started by creating your first client workspace.</p>
            <button
              type="button"
              onClick={() => spawnToast("Opened New Project Wizard", false)}
              className="px-3 py-1.5 rounded-xl bg-zinc-950 text-white font-semibold text-xs shadow-xs hover:opacity-90 cursor-pointer"
            >
              + Create Project
            </button>
          </div>
        </Card>

        <Card
          id="empty-14"
          number="14"
          title="No Search Results Empty State"
          category="cat4"
          description="Filter dead-end state with one-click filter reset action."
          code={`<div className="p-6 rounded-xl border text-center">\n  <div className="font-bold mb-1">No matching records</div>\n  <button className="border px-3 py-1.5 rounded-xl text-xs">Clear All Filters</button>\n</div>`}
        >
          <div className="p-6 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
            <div className="w-10 h-10 rounded-2xl bg-zinc-200 flex items-center justify-center mx-auto mb-2 text-zinc-600">
              <SearchX className="w-5 h-5" />
            </div>
            <div className="font-bold text-zinc-950 text-xs mb-1">No matching records</div>
            <p className="text-[11px] text-zinc-500 mb-3">No invoices matched your selected search filters.</p>
            <button
              type="button"
              onClick={() => spawnToast("Search filters cleared", false)}
              className="px-3 py-1.5 rounded-xl border border-zinc-300 bg-white text-zinc-800 font-semibold text-xs shadow-xs hover:bg-zinc-100 cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        </Card>

        <Card
          id="empty-15"
          number="15"
          title="Import or Create Empty State"
          category="cat4"
          description="Dual onboarding choice: bulk CSV spreadsheet import or manual client entry."
          code={`<div className="p-6 rounded-xl border text-center">\n  <div className="font-bold mb-1">No customers added</div>\n  <div className="flex justify-center gap-2"><button className="border px-3 py-1.5 rounded-xl">Import CSV</button><button className="bg-zinc-950 text-white px-3 py-1.5 rounded-xl">+ Add Client</button></div>\n</div>`}
        >
          <div className="p-6 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
            <div className="w-10 h-10 rounded-2xl bg-zinc-200 flex items-center justify-center mx-auto mb-2 text-zinc-600">
              <Users className="w-5 h-5" />
            </div>
            <div className="font-bold text-zinc-950 text-xs mb-1">No customers added</div>
            <p className="text-[11px] text-zinc-500 mb-3">Bring your client list via CSV or create manually.</p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => spawnToast("Opened CSV Spreadsheet Import Drawer", false)}
                className="px-3 py-1.5 rounded-xl border border-zinc-300 bg-white text-zinc-800 font-semibold text-xs cursor-pointer shadow-xs"
              >
                Import CSV
              </button>
              <button
                type="button"
                onClick={() => spawnToast("Opened New Client Modal", false)}
                className="px-3 py-1.5 rounded-xl bg-zinc-950 text-white font-semibold text-xs shadow-xs cursor-pointer"
              >
                + Add Client
              </button>
            </div>
          </div>
        </Card>

        <Card
          id="empty-16"
          number="16"
          title="Inbox Zero / All Caught Up State"
          category="cat4"
          description="Satisfying zero inbox notification state with emerald badge."
          code={`<div className="p-6 rounded-xl border text-center">\n  <div className="font-bold mb-1">All caught up!</div>\n  <p className="text-xs text-zinc-500">There are no pending approval requests.</p>\n</div>`}
        >
          <div className="p-6 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-2 text-emerald-600">
              <CheckCheck className="w-5 h-5" />
            </div>
            <div className="font-bold text-zinc-950 text-xs mb-1">All caught up!</div>
            <p className="text-[11px] text-zinc-500 max-w-[200px] mx-auto">There are no pending approval requests or unread audit flags.</p>
          </div>
        </Card>

        {/* ============================================== */}
        {/* CATEGORY 5: ERROR & LOCKED STATES (4)          */}
        {/* ============================================== */}

        <Card
          id="error-17"
          number="17"
          title="Failed to Load with Retry Button"
          category="cat5"
          description="Network recovery state with spinning retry feedback."
          code={`<div className="p-6 rounded-xl border text-center">\n  <div className="font-bold mb-1">Couldn't load reports</div>\n  <button onClick={handleRetry} className="bg-zinc-950 text-white px-3.5 py-1.5 rounded-xl">Try Again</button>\n</div>`}
        >
          <div className="p-6 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-2 text-rose-600">
              <WifiOff className="w-5 h-5" />
            </div>
            <div className="font-bold text-zinc-950 text-xs mb-1">Couldn't load reports</div>
            <p className="text-[11px] text-zinc-500 mb-3">Gateway timeout while fetching analytics data.</p>
            <button
              type="button"
              onClick={handleRetryAction}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-950 text-white font-semibold text-xs flex items-center gap-1.5 mx-auto shadow-xs cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />
              <span>{isRetrying ? "Retrying..." : "Try Again"}</span>
            </button>
          </div>
        </Card>

        <Card
          id="error-18"
          number="18"
          title="Permission Denied / Admin Only State"
          category="cat5"
          description="RBAC wall protecting sensitive audit credentials and billing."
          code={`<div className="p-6 rounded-xl border text-center">\n  <div className="font-bold mb-1">Admin Access Required</div>\n  <button className="border px-3 py-1.5 rounded-xl">Request Access</button>\n</div>`}
        >
          <div className="p-6 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
            <div className="w-10 h-10 rounded-2xl bg-zinc-200 flex items-center justify-center mx-auto mb-2 text-zinc-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="font-bold text-zinc-950 text-xs mb-1">Admin Access Required</div>
            <p className="text-[11px] text-zinc-500 mb-3 max-w-[200px] mx-auto">Only workspace owners can view and regenerate production API keys.</p>
            <button
              type="button"
              onClick={() => spawnToast("Access request sent to workspace owner", false)}
              className="px-3 py-1.5 rounded-xl border border-zinc-300 bg-white text-zinc-800 font-semibold text-xs shadow-xs hover:bg-zinc-100 cursor-pointer"
            >
              Request Access
            </button>
          </div>
        </Card>

        <Card
          id="error-19"
          number="19"
          title="Pro Plan Locked Feature State"
          category="cat5"
          description="Contextual upgrade card gating automated SLA monitoring."
          code={`<div className="p-6 rounded-xl border text-center">\n  <div className="font-bold mb-1">Available on Pro Plan</div>\n  <button className="bg-zinc-950 text-white px-3.5 py-1.5 rounded-xl">Upgrade to Pro</button>\n</div>`}
        >
          <div className="p-6 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-2 text-amber-600">
              <Lock className="w-5 h-5" />
            </div>
            <div className="font-bold text-zinc-950 text-xs mb-1">Available on Pro Plan</div>
            <p className="text-[11px] text-zinc-500 mb-3 max-w-[200px] mx-auto">Automated SLA health monitoring and Webhook replays require Pro tier.</p>
            <button
              type="button"
              onClick={() => spawnToast("Opened Pro Tier Checkout", false)}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-950 text-white font-semibold text-xs shadow-xs cursor-pointer"
            >
              Upgrade to Pro
            </button>
          </div>
        </Card>

        <Card
          id="error-20"
          number="20"
          title="404 Page Not Found Card"
          category="cat5"
          description="Tactile missing route fallback card keeping users in flow."
          code={`<div className="p-6 rounded-xl border text-center">\n  <div className="font-bold mb-1">Page not found</div>\n  <button className="border px-3 py-1.5 rounded-xl">Back to Dashboard</button>\n</div>`}
        >
          <div className="p-6 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
            <div className="inline-block px-2 py-0.5 rounded-md bg-zinc-200 text-zinc-700 font-bold text-xs tabular-nums mb-2">
              404
            </div>
            <div className="font-bold text-zinc-950 text-xs mb-1">Page not found</div>
            <p className="text-[11px] text-zinc-500 mb-3">This link may have expired or been moved by an admin.</p>
            <button
              type="button"
              onClick={() => spawnToast("Navigating back to Dashboard", false)}
              className="px-3 py-1.5 rounded-xl border border-zinc-300 bg-white text-zinc-800 font-semibold text-xs shadow-xs hover:bg-zinc-100 cursor-pointer"
            >
              Back to Dashboard
            </button>
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

      {/* Real Interactive Floating Toasts */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {liveToasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#0B0F19] text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/10 text-xs flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-150 min-w-[280px]"
          >
            <span>{toast.message}</span>
            {toast.withUndo && (
              <button
                type="button"
                onClick={() => {
                  setLiveToasts((prev) => prev.filter((t) => t.id !== toast.id));
                  spawnToast("Deletion cancelled!", false);
                }}
                className="font-bold text-amber-400 hover:underline cursor-pointer"
              >
                Undo
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
