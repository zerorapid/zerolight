"use client";

import React, { useState } from "react";
import {
  Search,
  Copy,
  Check,
  X,
  Bell,
  MessageSquare,
  Send,
  HelpCircle,
  Headphones,
  CheckCircle2,
  CreditCard,
  Download,
  BarChart3,
  TrendingUp,
  PieChart,
  Layers,
  Calendar,
  RefreshCw,
  Key,
  Building2,
  ExternalLink,
  ShieldCheck,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useZeroLight } from "../context";
import { LibraryHeader, CodeModal } from "./common";

export type BusinessDensity = "small" | "medium" | "large";

export function SaaSBusinessLibrary() {
  const { tokens } = useZeroLight();

  // Sticky Bar States
  const [searchQuery, setSearchQuery] = useState("");
  const [density, setDensity] = useState<BusinessDensity>("medium");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Code Modal State
  const [activeCodeModal, setActiveCodeModal] = useState<{ title: string; code: string } | null>(null);

  // Module 01: Notification Popover
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(true);

  // Module 02: @Mention Comment Thread
  const [comments, setComments] = useState([
    {
      id: "c1",
      author: "Priya Sharma",
      time: "10 mins ago",
      text: "Hey @Rahul, please verify the input tax credit on invoice #INV-9042 before our Friday filing.",
    },
    {
      id: "c2",
      author: "Rahul Verma",
      time: "3 mins ago",
      text: "Checked @Priya. 18% IGST is reconciled with GST portal. Proceeding with export approval.",
    },
  ]);
  const [newCommentInput, setNewCommentInput] = useState("");

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentInput.trim()) return;
    setComments([
      ...comments,
      {
        id: `c_${Date.now()}`,
        author: "Sai Joshna",
        time: "Just now",
        text: newCommentInput.trim(),
      },
    ]);
    setNewCommentInput("");
  };

  // Module 04: Monthly / Yearly Pricing Switcher
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");

  // Module 13: Chart Period Switcher
  const [chartPeriod, setChartPeriod] = useState<"7D" | "30D" | "1Y">("30D");

  // Module 14: Tally Sync Simulation
  const [tallySyncState, setTallySyncState] = useState<"idle" | "syncing" | "synced">("idle");

  const handleTallySync = () => {
    if (tallySyncState === "syncing") return;
    setTallySyncState("syncing");
    setTimeout(() => {
      setTallySyncState("synced");
      setTimeout(() => {
        setTallySyncState("idle");
      }, 2500);
    }, 1200);
  };

  // Module 15: Copy API Key
  const [apiCopied, setApiCopied] = useState(false);
  const handleCopyApiKey = () => {
    navigator.clipboard.writeText("sk_live_94a298bf01ec49b9802");
    setApiCopied(true);
    setTimeout(() => setApiCopied(false), 2000);
  };

  // Density Config
  const densityConfig = {
    small: { pad: "p-3", font: "text-xs", textSm: "text-[11px]" },
    medium: { pad: "p-4", font: "text-[13px]", textSm: "text-xs" },
    large: { pad: "p-5 sm:p-6", font: "text-sm", textSm: "text-xs" },
  }[density];

  const categories = [
    { id: "all", label: "All Business Modules", count: 16 },
    { id: "collab", label: "Notifications & @Mentions", count: 3 },
    { id: "pricing", label: "SaaS Pricing & Plans", count: 1 },
    { id: "usage", label: "Usage, Limits & Billing", count: 3 },
    { id: "analytics", label: "SVG Analytics Panels", count: 6 },
    { id: "integrations", label: "Integrations & Workspaces", count: 3 },
  ];

  const variants = [
    // Category 1: Notifications & @Mentions
    {
      id: "v01",
      cat: "collab",
      num: "01",
      title: "Notification Inbox Popover",
      desc: "Interactive notification feed with unread pills and 'Mark all read' action.",
      type: "Collaboration",
    },
    {
      id: "v02",
      cat: "collab",
      num: "02",
      title: "Interactive @Mention Comment Thread",
      desc: "Live threaded comments with highlighted @mentions and fast reply input.",
      type: "Collaboration",
    },
    {
      id: "v03",
      cat: "collab",
      num: "03",
      title: "In-App Support & Help Launcher",
      desc: "Support widget featuring live team presence beacon and fast help desk access.",
      type: "Support",
    },

    // Category 2: SaaS Pricing & Plans
    {
      id: "v04",
      cat: "pricing",
      num: "04",
      title: "Interactive 3-Tier SaaS Pricing Table",
      desc: "Dynamic monthly/yearly toggle adjusting Starter, Pro Growth, and Enterprise tiers.",
      type: "Monetization",
    },

    // Category 3: Usage, Limits & Billing
    {
      id: "v05",
      cat: "usage",
      num: "05",
      title: "Plan Usage & Limit Meters",
      desc: "Visual progress meters tracking monthly API quotas and team seat allocations.",
      type: "Quotas",
    },
    {
      id: "v06",
      cat: "usage",
      num: "06",
      title: "Saved Payment Method & Next Charge",
      desc: "Stored corporate card overview with live billing renewal schedule and invoice estimate.",
      type: "Billing",
    },
    {
      id: "v07",
      cat: "usage",
      num: "07",
      title: "Billing Invoice History List",
      desc: "Downloadable PDF invoice log with paid status pills and currency amounts.",
      type: "Invoicing",
    },

    // Category 4: SVG Analytics Panels
    {
      id: "v08",
      cat: "analytics",
      num: "08",
      title: "Monthly Revenue Bar Chart Panel",
      desc: "Pure SVG/CSS 6-month vertical bar chart with active month highlight.",
      type: "Analytics",
    },
    {
      id: "v09",
      cat: "analytics",
      num: "09",
      title: "Smooth Trend Line & Area Chart",
      desc: "Gradient area polyline chart showing daily active user growth trajectory.",
      type: "Analytics",
    },
    {
      id: "v10",
      cat: "analytics",
      num: "10",
      title: "Conversion Funnel Chart Panel",
      desc: "Multi-stage pipeline tracking Visitor to Paid Customer drop-off rates.",
      type: "Analytics",
    },
    {
      id: "v11",
      cat: "analytics",
      num: "11",
      title: "Donut Breakdown Chart Card",
      desc: "Dual-segment circular SVG donut ring visualizing subscription revenue shares.",
      type: "Analytics",
    },
    {
      id: "v12",
      cat: "analytics",
      num: "12",
      title: "7×4 Weekly Activity Heatmap Grid",
      desc: "GitHub-style 28-day customer activity density grid with 4 intensity levels.",
      type: "Analytics",
    },
    {
      id: "v13",
      cat: "analytics",
      num: "13",
      title: "Interactive Chart Period Switcher Card",
      desc: "Net profit card featuring dynamic 7D, 30D, and 1Y timeframe buttons.",
      type: "Analytics",
    },

    // Category 5: Integrations & Workspaces
    {
      id: "v14",
      cat: "integrations",
      num: "14",
      title: "Connected Integration Card (Tally Prime)",
      desc: "Enterprise accounting bridge with live sync status simulation and timestamp.",
      type: "Integrations",
    },
    {
      id: "v15",
      cat: "integrations",
      num: "15",
      title: "API Key Management Row",
      desc: "Masked production secret key with active status pill and one-click copy.",
      type: "Developer",
    },
    {
      id: "v16",
      cat: "integrations",
      num: "16",
      title: "Multi-Workspace Organization Switcher",
      desc: "Multi-tenant company hub switcher with member count readouts and active tags.",
      type: "Workspaces",
    },
  ];

  // Filtering
  const filteredVariants = variants.filter((v) => {
    const matchCategory = activeCategory === "all" || v.cat === activeCategory;
    const matchSearch =
      searchQuery === "" ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.num.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* =========================================================================
           STICKY GLOBAL CONTROL BAR (SLIMMED UTILITY BAR)
      ========================================================================= */}
      <LibraryHeader
        countText={`${filteredVariants.length} of 16 Modules Active`}
        description="Inboxes, @mentions, pricing tiers, usage limits, SVG analytics & Tally sync."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Filter business modules..."
      />

      <div className="space-y-8">
        {/* ── 1. NOTIFICATIONS & @MENTIONS ── */}
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
              1. Notifications & @Mentions
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Notification inboxes, collaborative mention feeds, and in-app support launchers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* VARIANT 01: Notification Inbox Popover */}
        {filteredVariants.some((v) => v.id === "v01") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div className={densityConfig.pad}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 font-sans tabular-nums">
                    01
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Notification Inbox Popover</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "01 Notification Inbox Popover",
                      code: `<div class="p-3 bg-white border rounded-xl shadow-xs text-xs">\n  <div class="flex justify-between items-center pb-2 border-b">\n    <span class="font-bold">Inbox</span>\n    <button onclick="markAllRead()">Mark all read</button>\n  </div>\n</div>`,
                    })
                  }
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>

              {/* Module Component Container */}
              <div className="p-3 bg-zinc-50/60 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Bell className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                      {hasUnreadNotifs && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Team Notifications</span>
                    {hasUnreadNotifs && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-sans tabular-nums">
                        2 New
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasUnreadNotifs(false)}
                    className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#121215] border border-zinc-200/60 dark:border-white/5 flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">GST Invoice #INV-9042 Approved</p>
                      <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">₹1,25,000 received via ICICI NEFT.</p>
                      <span className="text-[10px] text-zinc-400 font-sans tabular-nums">4 mins ago</span>
                    </div>
                    {hasUnreadNotifs && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1" />}
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#121215] border border-zinc-200/60 dark:border-white/5 flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">Tally Prime Sync Completed</p>
                      <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">84 ledgers synchronized without mismatch.</p>
                      <span className="text-[10px] text-zinc-400 font-sans tabular-nums">18 mins ago</span>
                    </div>
                    {hasUnreadNotifs && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1" />}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
              <span>Interactive unread state</span>
              <span className="font-sans tabular-nums">2 Unread • 0 Arch</span>
            </div>
          </div>
        )}

        {/* VARIANT 02: Interactive @Mention Comment Thread */}
        {filteredVariants.some((v) => v.id === "v02") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div className={densityConfig.pad}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 font-sans tabular-nums">
                    02
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Interactive @Mention Comment Thread</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "02 @Mention Comment Thread",
                      code: `<div class="p-3 bg-white border rounded-xl space-y-2 text-xs">\n  <p>Hey <span class="text-blue-600 font-bold">@Rahul</span> verify GST credit.</p>\n  <input placeholder="Reply or @mention..." class="border p-1.5 rounded-lg w-full" />\n</div>`,
                    })
                  }
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>

              {/* Module Component Container */}
              <div className="p-3 bg-zinc-50/60 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-3">
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {comments.map((c) => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-lg bg-white dark:bg-[#121215] border border-zinc-200/60 dark:border-white/5 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">{c.author}</span>
                        <span className="text-[10px] text-zinc-400 font-sans tabular-nums">{c.time}</span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-300 text-[12px] leading-relaxed">
                        {c.text.split(" ").map((word, i) => {
                          if (word.startsWith("@")) {
                            return (
                              <span key={i} className="text-blue-600 dark:text-blue-400 font-semibold mr-1">
                                {word}
                              </span>
                            );
                          }
                          return word + " ";
                        })}
                      </p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handlePostComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newCommentInput}
                    onChange={(e) => setNewCommentInput(e.target.value)}
                    placeholder="Reply or type @mention..."
                    className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center gap-1 cursor-pointer transition hover:opacity-90"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
              <span>Inline mentions parsed</span>
              <span className="font-sans tabular-nums">{comments.length} Comments</span>
            </div>
          </div>
        )}

        {/* VARIANT 03: In-App Support & Help Launcher Card */}
        {filteredVariants.some((v) => v.id === "v03") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div className={densityConfig.pad}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 font-sans tabular-nums">
                    03
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">In-App Support & Help Launcher</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "03 In-App Help Launcher",
                      code: `<div class="p-4 bg-white border rounded-xl text-xs space-y-2">\n  <div class="flex justify-between font-bold"><span>Need Help?</span><span class="text-emerald-600">● Team Online</span></div>\n  <button class="bg-zinc-950 text-white w-full py-1.5 rounded-lg">Start Live Chat</button>\n</div>`,
                    })
                  }
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>

              {/* Module Component Container */}
              <div className="p-4 bg-zinc-50/60 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">ZeroLight Concierge</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Team Online
                  </span>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Have questions regarding GST reconciliations, API webhook limits, or role permissions? Average response time under 4 minutes.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center gap-1.5 cursor-pointer transition hover:opacity-90"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Start Live Chat</span>
                  </button>
                  <button
                    type="button"
                    className="py-1.5 px-3 rounded-lg text-xs font-medium bg-white dark:bg-white/10 border border-zinc-200/80 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Docs</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
              <span>SLA Target: 4 mins</span>
              <span className="font-sans tabular-nums">24/7 Priority Support</span>
            </div>
          </div>
        )}

                  </div>
        </section>

        {/* ── 2. SAAS PRICING & PLANS ── */}
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
              2. SaaS Pricing & Plans
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Multi-tier subscription matrix with annual discounts, feature lists, and checkout buttons.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {/* VARIANT 04: Interactive 3-Tier SaaS Pricing Table */}
        {filteredVariants.some((v) => v.id === "v04") && (
          <div className="md:col-span-2 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div className={densityConfig.pad}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/5 mb-4 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 font-sans tabular-nums">
                    04
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Interactive 3-Tier SaaS Pricing Table</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Live Monthly / Yearly switch with automated discount calculations</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Period Switcher */}
                  <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-xs">
                    <button
                      type="button"
                      onClick={() => setBillingPeriod("monthly")}
                      className={`px-3 py-1 rounded-md transition cursor-pointer ${
                        billingPeriod === "monthly"
                          ? "font-bold bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs"
                          : "font-medium text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingPeriod("yearly")}
                      className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                        billingPeriod === "yearly"
                          ? "font-bold bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs"
                          : "font-medium text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      <span>Yearly</span>
                      <span className="text-[10px] px-1 py-0.2 rounded font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Save 20%
                      </span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveCodeModal({
                        title: "04 3-Tier Pricing Table",
                        code: `<div class="grid grid-cols-3 gap-4">\n  <div class="border p-4 rounded-xl"><h4>Starter</h4><div class="text-2xl font-bold font-sans tabular-nums">₹999/mo</div></div>\n  <div class="border-2 border-zinc-950 p-4 rounded-xl"><h4>Pro Growth</h4><div class="text-2xl font-bold font-sans tabular-nums">₹2,499/mo</div></div>\n  <div class="border p-4 rounded-xl"><h4>Enterprise</h4><div class="text-2xl font-bold font-sans tabular-nums">₹6,499/mo</div></div>\n</div>`,
                      })
                    }
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Code</span>
                  </button>
                </div>
              </div>

              {/* 3 Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tier 1: Starter */}
                <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Starter</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-zinc-950 dark:text-white font-sans tabular-nums">
                        {billingPeriod === "monthly" ? "₹1,299" : "₹999"}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">/month</span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Essential tools for independent founders and micro teams validating early ideas.
                    </p>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-zinc-200/60 dark:border-white/5 text-xs text-zinc-700 dark:text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                      <span>Up to 3 Team Seats</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                      <span>1,000 API Requests/mo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                      <span>Standard Community Support</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full py-2 rounded-lg text-xs font-semibold border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-white/10 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/15 transition cursor-pointer"
                  >
                    Select Starter
                  </button>
                </div>

                {/* Tier 2: Pro Growth (Featured) */}
                <div className="p-4 rounded-xl border-2 border-zinc-950 dark:border-white bg-white dark:bg-[#121215] space-y-3 relative shadow-md flex flex-col justify-between">
                  <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                    Most Popular
                  </span>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-950 dark:text-white uppercase tracking-wider">Pro Growth</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-zinc-950 dark:text-white font-sans tabular-nums">
                        {billingPeriod === "monthly" ? "₹2,999" : "₹2,499"}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">/month</span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Advanced automation, Tally synchronization, and dedicated team workflow hubs.
                    </p>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-zinc-200/60 dark:border-white/5 text-xs text-zinc-700 dark:text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                      <span>Up to 25 Team Seats</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                      <span>10,000 API Requests/mo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                      <span>Automated Tally Prime Bridge</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                      <span>Priority SLA Response</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full py-2 rounded-lg text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 transition cursor-pointer shadow-xs"
                  >
                    Upgrade to Pro Growth
                  </button>
                </div>

                {/* Tier 3: Enterprise */}
                <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Enterprise</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-zinc-950 dark:text-white font-sans tabular-nums">
                        {billingPeriod === "monthly" ? "₹7,999" : "₹6,499"}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">/month</span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Custom volume contracts, dedicated audit trails, and 99.99% uptime guarantees.
                    </p>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-zinc-200/60 dark:border-white/5 text-xs text-zinc-700 dark:text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                      <span>Unlimited Team Seats</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                      <span>Unlimited Custom API Endpoints</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                      <span>Dedicated Account Manager</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full py-2 rounded-lg text-xs font-semibold border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-white/10 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/15 transition cursor-pointer"
                  >
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
              <span>All plans include 18% GST invoice generation</span>
              <span className="font-sans tabular-nums">Zero Hidden Fees</span>
            </div>
          </div>
        )}

                  </div>
        </section>

        {/* ── 3. USAGE, LIMITS & BILLING ── */}
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
              3. Usage, Limits & Billing
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Seat utilization meters, saved card credentials, and downloadable GST invoice history.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* VARIANT 05: Plan Usage & Limit Meters */}
        {filteredVariants.some((v) => v.id === "v05") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div className={densityConfig.pad}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 font-sans tabular-nums">
                    05
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Plan Usage & Limit Meters</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "05 Plan Usage Meters",
                      code: `<div class="space-y-2 text-xs">\n  <div class="flex justify-between font-bold"><span>API Requests</span><span class="tabular-nums">8,240 / 10,000</span></div>\n  <div class="h-1.5 bg-zinc-200 rounded-full"><div class="h-full bg-amber-500 rounded-full" style="width: 82.4%"></div></div>\n</div>`,
                    })
                  }
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>

              {/* Module Component Container */}
              <div className="p-3.5 bg-zinc-50/60 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-4">
                {/* Meter 1: API Requests */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">API Requests (Monthly)</span>
                    <span className="font-sans tabular-nums text-zinc-600 dark:text-zinc-400">
                      <strong>8,240</strong> / 10,000 (82.4%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-200/80 dark:bg-white/10 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "82.4%" }} />
                  </div>
                  <span className="text-[10px] text-zinc-400">Resets automatically on 01 Dec 2026</span>
                </div>

                {/* Meter 2: Active Team Seats */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">Active Team Seats</span>
                    <span className="font-sans tabular-nums text-zinc-600 dark:text-zinc-400">
                      <strong>18</strong> / 25 Allocated
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-200/80 dark:bg-white/10 overflow-hidden">
                    <div className="h-full bg-zinc-950 dark:bg-white rounded-full" style={{ width: "72%" }} />
                  </div>
                  <span className="text-[10px] text-zinc-400">7 additional seats available on Pro plan</span>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
              <span>Automatic quota alerts enabled</span>
              <span className="font-sans tabular-nums">Billing Period: 16 Days Left</span>
            </div>
          </div>
        )}

        {/* VARIANT 06: Saved Payment Method & Next Charge */}
        {filteredVariants.some((v) => v.id === "v06") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div className={densityConfig.pad}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 font-sans tabular-nums">
                    06
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Saved Payment Method & Next Charge</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "06 Saved Payment Method",
                      code: `<div class="p-3 bg-white border rounded-xl text-xs flex justify-between items-center">\n  <div><strong>VISA •••• 4242</strong><div class="text-zinc-400">Next charge: ₹2,499 on 15 Dec</div></div>\n  <button class="underline">Change</button>\n</div>`,
                    })
                  }
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>

              {/* Module Component Container */}
              <div className="p-3.5 bg-zinc-50/60 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-7 rounded bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-[10px]">
                      VISA
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-sans tabular-nums">
                          •••• 4242
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-300">
                          Default
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 font-sans tabular-nums">Expires 09/2029</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-semibold text-zinc-900 dark:text-white underline hover:opacity-80 cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-white dark:bg-[#121215] border border-zinc-200/60 dark:border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400">Next automatic renewal:</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 ml-1.5">15 Dec 2026</span>
                  </div>
                  <span className="font-bold text-zinc-950 dark:text-white font-sans tabular-nums">₹2,499</span>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
              <span>PCI-DSS Tier 1 Encrypted</span>
              <span className="font-sans tabular-nums">Auto-Debited</span>
            </div>
          </div>
        )}

        {/* VARIANT 07: Billing Invoice History List */}
        {filteredVariants.some((v) => v.id === "v07") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div className={densityConfig.pad}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 font-sans tabular-nums">
                    07
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Billing Invoice History List</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "07 Invoice History List",
                      code: `<div class="p-2 border rounded-lg text-xs flex justify-between items-center font-sans tabular-nums">\n  <div><strong>#INV-2026-11</strong> - Paid ₹2,499</div>\n  <button><svg class="w-3.5 h-3.5"></svg></button>\n</div>`,
                    })
                  }
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>

              {/* Module Component Container */}
              <div className="p-3 bg-zinc-50/60 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-2">
                {[
                  { id: "#INV-2026-11", date: "15 Nov 2026", amount: "₹2,499", status: "Paid" },
                  { id: "#INV-2026-10", date: "15 Oct 2026", amount: "₹2,499", status: "Paid" },
                  { id: "#INV-2026-09", date: "15 Sep 2026", amount: "₹2,499", status: "Paid" },
                ].map((inv) => (
                  <div
                    key={inv.id}
                    className="p-2.5 rounded-lg bg-white dark:bg-[#121215] border border-zinc-200/60 dark:border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 font-sans tabular-nums">
                          {inv.id}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          {inv.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 font-sans tabular-nums">{inv.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 font-sans tabular-nums">
                        {inv.amount}
                      </span>
                      <button
                        type="button"
                        title="Download Tax Invoice PDF"
                        className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
              <span>GST Compliance Certificate ready</span>
              <span className="font-sans tabular-nums">3 Invoices Archived</span>
            </div>
          </div>
        )}

                  </div>
        </section>

        {/* ── 4. SVG ANALYTICS PANELS ── */}
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
              4. SVG Analytics Panels
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Zero-dependency SVG revenue charts, conversion funnels, donut shares & weekly activity heatmaps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* VARIANT 08: Monthly Revenue Bar Chart Panel */}
        {filteredVariants.some((v) => v.id === "v08") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div className={densityConfig.pad}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 font-sans tabular-nums">
                    08
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Monthly Revenue Bar Chart Panel</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "08 Monthly Revenue Bar Chart",
                      code: `<div class="flex items-end h-24 gap-2">\n  <div class="w-4 bg-zinc-300 rounded-t" style="height: 40%"></div>\n  <div class="w-4 bg-zinc-950 rounded-t" style="height: 100%"></div>\n</div>`,
                    })
                  }
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>

              {/* Module Component Container */}
              <div className="p-4 bg-zinc-50/60 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-bold text-zinc-950 dark:text-white font-sans tabular-nums">₹64.2L</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1.5 font-sans">Total H2 Revenue</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-sans tabular-nums">
                    +18% MoM
                  </span>
                </div>

                {/* Pure CSS Bar Chart */}
                <div className="flex items-end justify-between gap-2 h-24 pt-4 border-b border-zinc-200/80 dark:border-white/10">
                  {[
                    { month: "Jun", height: "45%", val: "₹7.8L" },
                    { month: "Jul", height: "55%", val: "₹9.2L" },
                    { month: "Aug", height: "70%", val: "₹11.4L" },
                    { month: "Sep", height: "65%", val: "₹10.5L" },
                    { month: "Oct", height: "85%", val: "₹13.8L" },
                    { month: "Nov", height: "100%", val: "₹16.5L", active: true },
                  ].map((bar) => (
                    <div key={bar.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div
                        className={`w-full max-w-[28px] rounded-t transition-all duration-300 ${
                          bar.active
                            ? "bg-zinc-950 dark:bg-white"
                            : "bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600"
                        }`}
                        style={{ height: bar.height }}
                        title={`${bar.month}: ${bar.val}`}
                      />
                      <span className="text-[10px] text-zinc-400 font-medium font-sans">{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
              <span>Peak: Nov (₹16.5L)</span>
              <span className="font-sans tabular-nums">Zero Third-Party JS</span>
            </div>
          </div>
        )}

        {/* VARIANT 09: Smooth Trend Line & Area Chart */}
        {filteredVariants.some((v) => v.id === "v09") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div className={densityConfig.pad}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 font-sans tabular-nums">
                    09
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Smooth Trend Line & Area Chart</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "09 Trend Line Area Chart",
                      code: `<svg viewBox="0 0 300 90" class="w-full h-20">\n  <path d="M 0 70 Q 150 20, 300 10 L 300 90 L 0 90 Z" fill="rgba(0,0,0,0.1)" />\n  <path d="M 0 70 Q 150 20, 300 10" fill="none" stroke="#09090B" stroke-width="2" />\n</svg>`,
                    })
                  }
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>

              {/* Module Component Container */}
              <div className="p-4 bg-zinc-50/60 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-bold text-zinc-950 dark:text-white font-sans tabular-nums">3,840</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1.5 font-sans">Active Daily Users</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-sans tabular-nums">
                    +14.2%
                  </span>
                </div>

                {/* Inline SVG Polyline Chart */}
                <div className="w-full h-24 pt-2">
                  <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" className="text-zinc-900 dark:text-zinc-100" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" className="text-zinc-900 dark:text-zinc-100" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 65 Q 50 50, 100 45 T 200 30 T 300 10 L 300 80 L 0 80 Z"
                      fill="url(#areaGradient)"
                    />
                    <path
                      d="M 0 65 Q 50 50, 100 45 T 200 30 T 300 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="text-zinc-900 dark:text-white"
                    />
                    <circle cx="300" cy="10" r="3.5" className="fill-zinc-950 dark:fill-white" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
              <span>SVG Vector Bézier Spline</span>
              <span className="font-sans tabular-nums">30-Day Rolling</span>
            </div>
          </div>
        )}

        {/* VARIANT 10: Conversion Funnel Chart Panel */}
        {filteredVariants.some((v) => v.id === "v10") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div className={densityConfig.pad}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 font-sans tabular-nums">
                    10
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Conversion Funnel Chart Panel</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "10 Conversion Funnel Chart",
                      code: `<div class="space-y-1 text-xs">\n  <div class="h-2 rounded bg-zinc-950 w-full"></div>\n  <div class="h-2 rounded bg-zinc-700 w-2/3"></div>\n  <div class="h-2 rounded bg-emerald-600 w-1/4"></div>\n</div>`,
                    })
                  }
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>

              {/* Module Component Container */}
              <div className="p-3.5 bg-zinc-50/60 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">Signup to Paid Conversion</span>
                  <span className="font-sans tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                    3.91% End-to-End
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mb-1">
                      <span>1. Page Visitors</span>
                      <span className="font-sans tabular-nums">12,400 (100%)</span>
                    </div>
                    <div className="w-full h-2 rounded bg-zinc-950 dark:bg-white" />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mb-1">
                      <span>2. Account Signups</span>
                      <span className="font-sans tabular-nums">3,100 (25.0%)</span>
                    </div>
                    <div className="w-full h-2 rounded bg-zinc-200 dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-zinc-700 dark:bg-zinc-300 rounded" style={{ width: "25%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mb-1">
                      <span>3. Connected Tally Bridge</span>
                      <span className="font-sans tabular-nums">1,240 (10.0%)</span>
                    </div>
                    <div className="w-full h-2 rounded bg-zinc-200 dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-zinc-500 dark:bg-zinc-400 rounded" style={{ width: "10%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mb-1">
                      <span>4. Paid Pro Subscriptions</span>
                      <span className="font-sans tabular-nums font-bold text-emerald-600 dark:text-emerald-400">485 (3.91%)</span>
                    </div>
                    <div className="w-full h-2 rounded bg-zinc-200 dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded" style={{ width: "3.91%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
              <span>Drop-off analysis enabled</span>
              <span className="font-sans tabular-nums">4 Stages Tracked</span>
            </div>
          </div>
        )}

        {/* VARIANT 11: Donut Breakdown Chart Card */}
        {filteredVariants.some((v) => v.id === "v11") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div className={densityConfig.pad}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 font-sans tabular-nums">
                    11
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Donut Breakdown Chart Card</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "11 Donut Breakdown Chart",
                      code: `<svg viewBox="0 0 36 36" class="w-20 h-20 -rotate-90">\n  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e4e4e7" stroke-width="3.5"/>\n  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#09090b" stroke-width="3.8" stroke-dasharray="66 34"/>\n</svg>`,
                    })
                  }
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>

              {/* Module Component Container */}
              <div className="p-3.5 bg-zinc-50/60 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-2 text-xs flex-1">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">Revenue Contribution</span>
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-zinc-950 dark:bg-white" />
                        <span className="text-zinc-600 dark:text-zinc-300">Enterprise</span>
                      </div>
                      <span className="font-bold font-sans tabular-nums">66%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                        <span className="text-zinc-600 dark:text-zinc-300">Pro Growth</span>
                      </div>
                      <span className="font-bold font-sans tabular-nums">34%</span>
                    </div>
                  </div>
                </div>

                {/* Pure SVG Donut Ring */}
                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      className="text-zinc-300 dark:text-zinc-700"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.8"
                      strokeDasharray="66 34"
                      strokeDashoffset="0"
                      className="text-zinc-950 dark:text-white"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[13px] font-bold font-sans tabular-nums text-zinc-950 dark:text-white">66%</span>
                    <span className="text-[9px] text-zinc-400 font-sans">Main</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
              <span>Dual-Accent Token Ready</span>
              <span className="font-sans tabular-nums">100% Calculated</span>
            </div>
          </div>
        )}

        {/* VARIANT 12: 7×4 Weekly Activity Heatmap Grid */}
        {filteredVariants.some((v) => v.id === "v12") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div className={densityConfig.pad}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 font-sans tabular-nums">
                    12
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">7×4 Weekly Activity Heatmap Grid</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "12 7x4 Activity Heatmap",
                      code: `<div class="grid grid-cols-7 gap-1">\n  <div class="h-4 bg-zinc-200 rounded-xs"></div>\n  <div class="h-4 bg-zinc-950 rounded-xs"></div>\n</div>`,
                    })
                  }
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>

              {/* Module Component Container */}
              <div className="p-3.5 bg-zinc-50/60 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">Platform Ledger Activity</span>
                  <span className="text-[11px] text-zinc-400 font-sans tabular-nums">Past 28 Days</span>
                </div>

                {/* 7 Columns x 4 Rows */}
                <div className="grid grid-cols-7 gap-1.5 pt-1">
                  {[
                    1, 2, 0, 3, 4, 2, 1,
                    0, 1, 3, 4, 4, 3, 2,
                    2, 3, 1, 0, 2, 4, 3,
                    4, 4, 3, 2, 1, 4, 3
                  ].map((intensity, idx) => {
                    const colorClass = [
                      "bg-zinc-200/80 dark:bg-white/5",
                      "bg-zinc-300 dark:bg-zinc-800",
                      "bg-zinc-500 dark:bg-zinc-600",
                      "bg-zinc-700 dark:bg-zinc-400",
                      "bg-zinc-950 dark:bg-white",
                    ][intensity];
                    return (
                      <div
                        key={idx}
                        className={`h-5 rounded-[3px] ${colorClass} transition-all hover:scale-110 cursor-pointer`}
                        title={`Day ${idx + 1}: Level ${intensity} Sync Volume`}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                  <span>Less Active</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-zinc-200/80 dark:bg-white/5" />
                    <span className="w-2.5 h-2.5 rounded-xs bg-zinc-300 dark:bg-zinc-800" />
                    <span className="w-2.5 h-2.5 rounded-xs bg-zinc-500 dark:bg-zinc-600" />
                    <span className="w-2.5 h-2.5 rounded-xs bg-zinc-700 dark:bg-zinc-400" />
                    <span className="w-2.5 h-2.5 rounded-xs bg-zinc-950 dark:bg-white" />
                  </div>
                  <span>High Volume</span>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
              <span>Monochrome luminance stepped</span>
              <span className="font-sans tabular-nums">28 Days Visualized</span>
            </div>
          </div>
        )}

        {/* VARIANT 13: Interactive Chart Period Switcher Card */}
        {filteredVariants.some((v) => v.id === "v13") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div className={densityConfig.pad}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 font-sans tabular-nums">
                    13
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Interactive Chart Period Switcher Card</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "13 Interactive Chart Period Switcher",
                      code: `<div class="flex justify-between items-center text-xs">\n  <h3 class="text-xl font-bold tabular-nums">₹18,45,000</h3>\n  <div class="flex gap-1"><button>7D</button><button class="font-bold">30D</button><button>1Y</button></div>\n</div>`,
                    })
                  }
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>

              {/* Module Component Container */}
              <div className="p-4 bg-zinc-50/60 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Net Operating Profit</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-zinc-950 dark:text-white font-sans tabular-nums">
                        {chartPeriod === "7D" && "₹4,12,000"}
                        {chartPeriod === "30D" && "₹18,45,000"}
                        {chartPeriod === "1Y" && "₹2,14,80,000"}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-sans tabular-nums">
                        {chartPeriod === "7D" && "+8.4%"}
                        {chartPeriod === "30D" && "+12.8%"}
                        {chartPeriod === "1Y" && "+24.6%"}
                      </span>
                    </div>
                  </div>

                  {/* Period Pills */}
                  <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-xs">
                    {(["7D", "30D", "1Y"] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setChartPeriod(p)}
                        className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                          chartPeriod === p
                            ? "font-bold bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs"
                            : "font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-zinc-400">
                  {chartPeriod === "7D" && "Generated across past 7 days"}
                  {chartPeriod === "30D" && "Generated across past 30 days"}
                  {chartPeriod === "1Y" && "Generated across past 12 calendar months"}
                </p>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
              <span>Instant reactive re-render</span>
              <span className="font-sans tabular-nums">Live Filter Active</span>
            </div>
          </div>
        )}

                  </div>
        </section>

        {/* ── 5. INTEGRATIONS & WORKSPACES ── */}
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
              5. Integrations & Workspaces
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Tally Prime accounting connectors, API key secret management & multi-tenant org switchers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* VARIANT 14: Connected Integration Card (Tally Prime) */}
        {filteredVariants.some((v) => v.id === "v14") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div className={densityConfig.pad}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 font-sans tabular-nums">
                    14
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Connected Integration Card (Tally Prime)</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "14 Tally Prime Sync Card",
                      code: `<div class="p-3 bg-white border rounded-xl text-xs flex justify-between items-center">\n  <div><strong>Tally Prime v4.1</strong><div class="text-zinc-400">Connected</div></div>\n  <button onclick="sync()">Sync Now</button>\n</div>`,
                    })
                  }
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>

              {/* Module Component Container */}
              <div className="p-3.5 bg-zinc-50/60 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      TP
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Tally Prime v4.1</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          Connected
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 font-sans tabular-nums">
                        {tallySyncState === "synced" ? "Last sync: Just now" : "Last sync: Today at 03:45 AM"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleTallySync}
                    disabled={tallySyncState === "syncing"}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-white/10 border border-zinc-200/80 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/15 flex items-center gap-1.5 cursor-pointer transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${tallySyncState === "syncing" ? "animate-spin" : ""}`} />
                    <span>
                      {tallySyncState === "syncing" ? "Syncing..." : tallySyncState === "synced" ? "Synced" : "Sync Now"}
                    </span>
                  </button>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Continuous two-way ledger synchronization for automated GST filing and reconciliation.
                </p>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
              <span>Automated Daily Sync</span>
              <span className="font-sans tabular-nums">Status: Operational</span>
            </div>
          </div>
        )}

        {/* VARIANT 15: API Key Management Row */}
        {filteredVariants.some((v) => v.id === "v15") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div className={densityConfig.pad}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 font-sans tabular-nums">
                    15
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">API Key Management Row</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "15 API Key Row",
                      code: `<div class="p-2 border rounded-lg text-xs flex justify-between items-center font-sans tabular-nums">\n  <span>sk_live_••••••••••••94a2</span>\n  <button onclick="copy()">Copy</button>\n</div>`,
                    })
                  }
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>

              {/* Module Component Container */}
              <div className="p-3.5 bg-zinc-50/60 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Production Secret Key</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    Active
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white dark:bg-[#121215] border border-zinc-200/60 dark:border-white/5 flex items-center justify-between gap-2">
                  <span className="text-xs font-sans tabular-nums text-zinc-600 dark:text-zinc-400 tracking-wider">
                    sk_live_••••••••••••94a2
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyApiKey}
                    className="px-2.5 py-1 rounded text-xs font-semibold bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/15 text-zinc-900 dark:text-white flex items-center gap-1 transition cursor-pointer"
                  >
                    {apiCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
              <span>Read & Write Permissions</span>
              <span className="font-sans tabular-nums">Created: 02 Nov 2026</span>
            </div>
          </div>
        )}

        {/* VARIANT 16: Multi-Workspace Organization Switcher */}
        {filteredVariants.some((v) => v.id === "v16") && (
          <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div className={densityConfig.pad}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 font-sans tabular-nums">
                    16
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Multi-Workspace Organization Switcher</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCodeModal({
                      title: "16 Multi-Workspace Switcher",
                      code: `<div class="p-2 border rounded-lg text-xs flex justify-between items-center">\n  <div><strong>Hyderabad Head Office</strong> (248 Members)</div>\n  <button>Switch →</button>\n</div>`,
                    })
                  }
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>

              {/* Module Component Container */}
              <div className="p-3 bg-zinc-50/60 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 rounded-xl space-y-2">
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#121215] border-2 border-zinc-950 dark:border-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Hyderabad Head Office</span>
                        <span className="text-[10px] px-1 py-0.2 rounded font-bold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                          Active
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 font-sans tabular-nums">248 Members • Pro Growth</span>
                    </div>
                  </div>
                  <Check className="w-4 h-4 text-zinc-950 dark:text-white" />
                </div>

                <div className="p-2.5 rounded-lg bg-white dark:bg-[#121215] border border-zinc-200/60 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-zinc-400" />
                    <div>
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Bengaluru Retail Hub</span>
                      <div className="text-[11px] text-zinc-400 font-sans tabular-nums">36 Members • Starter</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
                  >
                    Switch →
                  </button>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
              <span>Multi-tenant Isolation</span>
              <span className="font-sans tabular-nums">2 Workspaces Linked</span>
            </div>
          </div>
        )}
          </div>
        </section>
      </div>

      {/* =========================================================================
           CODE MODAL
      ========================================================================= */}
      <CodeModal
        modal={activeCodeModal}
        onClose={() => setActiveCodeModal(null)}
      />
    </div>
  );
}
