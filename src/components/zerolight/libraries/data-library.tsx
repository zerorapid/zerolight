"use client";

import React, { useState } from "react";
import {
  Search,
  Copy,
  Check,
  X,
  TrendingUp,
  AlertTriangle,
  ArrowUpDown,
  Download,
  CheckCircle2,
  Plus,
  ChevronDown,
  UploadCloud,
  FileSpreadsheet,
  FileText,
  Clock,
  Trash2,
  Share2,
} from "lucide-react";
import { useZeroLight } from "../context";
import { LibraryHeader, CodeModal } from "./common";

export type DataDensity = "compact" | "default" | "relaxed";

export function SaaSDataLibrary() {
  const { tokens } = useZeroLight();

  // Sticky Bar States
  const [searchQuery, setSearchQuery] = useState("");
  const [density, setDensity] = useState<DataDensity>("default");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Code Modal State
  const [activeCodeModal, setActiveCodeModal] = useState<{ title: string; code: string } | null>(null);

  // Variant 07 State: Interactive Table
  const [tableSearch, setTableSearch] = useState("");
  const [sortAscending, setSortAscending] = useState(true);
  const [invoices, setInvoices] = useState([
    { id: "INV-9042", client: "Zerorapid India Pvt Ltd", amount: 125000, status: "Paid", date: "15 Nov 2026", selected: false },
    { id: "INV-9041", client: "Deccan Logistics Hub", amount: 84200, status: "Pending", date: "14 Nov 2026", selected: false },
    { id: "INV-9040", client: "Apex Retail Solutions", amount: 32600, status: "Overdue", date: "10 Nov 2026", selected: false },
    { id: "INV-9039", client: "Kaveri Global Exports", amount: 210000, status: "Paid", date: "08 Nov 2026", selected: false },
    { id: "INV-9038", client: "Bangalore Silicon Labs", amount: 65400, status: "Paid", date: "05 Nov 2026", selected: false },
  ]);

  // Variant 08 State: Inline Spreadsheet Math
  const [unitPrice, setUnitPrice] = useState(18500);
  const [qty, setQty] = useState(4);

  // Variant 10 State: Removable Chips
  const [activeChips, setActiveChips] = useState(["City: Hyderabad", "Amount > ₹50,000"]);

  // Variant 13 State: Kanban Deal Cards
  const [deals, setDeals] = useState([
    { id: "d1", title: "Deccan Telecom", amount: "₹8,50,000", desc: "50 Enterprise Seats", stage: 1 },
    { id: "d2", title: "Apex Logistics", amount: "₹4,20,000", desc: "Fleet Telemetry API", stage: 1 },
    { id: "d3", title: "Zerorapid Payments", amount: "₹14,00,000", desc: "Custom Gateway", stage: 2 },
    { id: "d4", title: "Global Finserve", amount: "₹22,50,000", desc: "Annual Contract", stage: 3 },
  ]);

  // Variant 16 State: File Dropzone Status
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Density Config
  const densityConfig = {
    compact: { cellPy: "py-1.5", cellPx: "px-2.5", text: "text-xs" },
    default: { cellPy: "py-2.5", cellPx: "px-3.5", text: "text-[13px]" },
    relaxed: { cellPy: "py-3.5", cellPx: "px-4.5", text: "text-sm" },
  }[density];

  const categories = [
    { id: "all", label: "All Data Patterns", count: 18 },
    { id: "kpi", label: "KPI & Metrics", count: 6 },
    { id: "tables", label: "Interactive Data Tables", count: 2 },
    { id: "filters", label: "Filters & Saved Views", count: 4 },
    { id: "kanban", label: "Kanban Pipeline", count: 1 },
    { id: "audit", label: "Audit & Activity", count: 2 },
    { id: "files", label: "File Upload & Import", count: 3 },
  ];

  const variants = [
    // Category 1: KPI Stat Cards & Metrics
    {
      id: "v01",
      cat: "kpi",
      num: "01",
      title: "KPI Stat Card with Trend Pill",
      desc: "High-contrast revenue metric paired with a percentage delta pill.",
      type: "Metric Card",
    },
    {
      id: "v02",
      cat: "kpi",
      num: "02",
      title: "KPI Card with Mini Sparkline Bar",
      desc: "Daily active user count visualized with a 7-day CSS bar chart.",
      type: "Sparkline Card",
    },
    {
      id: "v03",
      cat: "kpi",
      num: "03",
      title: "Quota & Target Goal Stat Card",
      desc: "Linear progress bar tracking quarterly target realization.",
      type: "Quota Card",
    },
    {
      id: "v04",
      cat: "kpi",
      num: "04",
      title: "Multi-Metric Summary Strip",
      desc: "Segmented 3-in-1 billing metric strip with total, paid, and overdue counts.",
      type: "Metric Strip",
    },
    {
      id: "v05",
      cat: "kpi",
      num: "05",
      title: "Key-Value Record Summary List",
      desc: "Structured metadata dossier for tax identification and customer terms.",
      type: "Dossier List",
    },
    {
      id: "v06",
      cat: "kpi",
      num: "06",
      title: "Alert KPI Card",
      desc: "Attention-demanding status card highlighting pending approval queues.",
      type: "Alert Metric",
    },

    // Category 2: Interactive Data Tables
    {
      id: "v07",
      cat: "tables",
      num: "07",
      title: "Full Interactive Invoice Data Table + Bulk Action Bar",
      desc: "Live search, row selection highlighting, amount sorting, and bulk action strip.",
      type: "Data Table",
    },
    {
      id: "v08",
      cat: "tables",
      num: "08",
      title: "Inline Editable Spreadsheet Grid Row",
      desc: "Editable unit price and quantity fields that recalculate total in real time.",
      type: "Spreadsheet Grid",
    },

    // Category 3: Saved Views & Filters
    {
      id: "v09",
      cat: "filters",
      num: "09",
      title: "Saved Views Tab Bar + Save View Trigger",
      desc: "Quick query bookmarks with live tabular record counts and save action.",
      type: "Saved Views",
    },
    {
      id: "v10",
      cat: "filters",
      num: "10",
      title: "Faceted Filter Bar + Active Chips",
      desc: "Compound query bar with dismissible filter chips.",
      type: "Filter Bar",
    },
    {
      id: "v11",
      cat: "filters",
      num: "11",
      title: "Floating Bulk Selection Action Bar",
      desc: "High-contrast action banner for batch operations across selected records.",
      type: "Bulk Actions",
    },
    {
      id: "v12",
      cat: "filters",
      num: "12",
      title: "Faceted Sidebar Filter Group",
      desc: "Checklist taxonomy for branch locations and regional nodes.",
      type: "Sidebar Filter",
    },

    // Category 4: Kanban Pipeline
    {
      id: "v13",
      cat: "kanban",
      num: "13",
      title: "Interactive 3-Stage SaaS Deal Pipeline Board",
      desc: "Card workflow with stage advancing triggers and dynamic column counters.",
      type: "Kanban Board",
    },

    // Category 5: Audit & Activity
    {
      id: "v14",
      cat: "audit",
      num: "14",
      title: "Workspace Audit Log Feed",
      desc: "Chronological security and tax activity ledger for enterprise compliance.",
      type: "Audit Log",
    },
    {
      id: "v15",
      cat: "audit",
      num: "15",
      title: "Compact Order Tracking List",
      desc: "Dense logistics status tiles pairing purchase IDs with state badges.",
      type: "Order Tracking",
    },

    // Category 6: File Upload & Import
    {
      id: "v16",
      cat: "files",
      num: "16",
      title: "CSV / Excel Bulk Import Dropzone",
      desc: "Interactive file drag-and-drop zone wired to native file picker.",
      type: "Dropzone",
    },
    {
      id: "v17",
      cat: "files",
      num: "17",
      title: "Active Upload Progress Card",
      desc: "Real-time parsing and validation progress indicator with row counts.",
      type: "Progress Card",
    },
    {
      id: "v18",
      cat: "files",
      num: "18",
      title: "Attached Invoice PDF Card",
      desc: "Verified receipt preview with file size and download trigger.",
      type: "File Preview",
    },
  ];

  // Filtering
  const filteredVariants = variants.filter((v) => {
    const matchesQuery =
      searchQuery.trim() === "" ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesQuery;
  });

  // Table Helpers
  const filteredInvoices = invoices
    .filter((inv) => {
      const q = tableSearch.toLowerCase().trim();
      if (!q) return true;
      return (
        inv.id.toLowerCase().includes(q) ||
        inv.client.toLowerCase().includes(q) ||
        inv.status.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (sortAscending ? a.amount - b.amount : b.amount - a.amount));

  const selectedCount = invoices.filter((i) => i.selected).length;

  const toggleSelectRow = (id: string, checked: boolean) => {
    setInvoices(invoices.map((inv) => (inv.id === id ? { ...inv, selected: checked } : inv)));
  };

  const toggleSelectAll = (checked: boolean) => {
    setInvoices(invoices.map((inv) => ({ ...inv, selected: checked })));
  };

  const markSelectedPaid = () => {
    setInvoices(
      invoices.map((inv) => (inv.selected ? { ...inv, status: "Paid", selected: false } : inv))
    );
  };

  // Kanban Card Advance
  const advanceDeal = (id: string) => {
    setDeals(
      deals.map((d) => {
        if (d.id === id && d.stage < 3) {
          return { ...d, stage: d.stage + 1 };
        }
        return d;
      })
    );
  };

  const getCodeSnippet = (id: string, title: string) => {
    return `// ZeroLight Level 3 Organism: ${title}
import React from "react";
import { useZeroLight } from "@/components/zerolight/context";

export function ${title.replace(/[^a-zA-Z0-9]/g, "")}() {
  const { tokens } = useZeroLight();

  return (
    <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#121215]">
      <h3 className="text-sm font-bold text-zinc-950 dark:text-white font-sans">${title}</h3>
    </div>
  );
}`;
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          STICKY TOP CONTROL BAR
      ========================================================================= */}
      <LibraryHeader
        countText={`${filteredVariants.length} of 18 Variants`}
        description="Organism-level metric cards, interactive invoice grids, faceted filters, deal pipelines, and import cards."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Filter data modules..."
      />

      {/* =========================================================================
          VARIANTS RENDER
      ========================================================================= */}
      <div className="space-y-8">
        {/* Render Grid for Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVariants
            .filter((v) => v.cat !== "tables" && v.cat !== "kanban")
            .map((v) => (
              <div
                key={v.id}
                className="group flex flex-col justify-between p-5 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#121215] shadow-xs hover:border-zinc-300 dark:hover:border-white/20 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 font-sans tabular-nums">
                        #{v.num}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-white/5">
                        {v.type}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveCodeModal({
                          title: v.title,
                          code: getCodeSnippet(v.id, v.title),
                        })
                      }
                      className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-xs flex items-center gap-1 transition cursor-pointer"
                      title="View TSX Code"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white tracking-tight mb-1">
                    {v.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
                    {v.desc}
                  </p>

                  {/* Previews */}
                  <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-[#09090B] border border-zinc-150 dark:border-white/5">
                    {/* V01: KPI Stat Card */}
                    {v.id === "v01" && (
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Monthly Revenue</span>
                        <div className="flex items-baseline justify-between gap-2 pt-1">
                          <h4 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white font-sans tabular-nums">
                            ₹48,20,000
                          </h4>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 font-sans tabular-nums">
                            <TrendingUp className="w-3 h-3" />
                            <span>+14.2%</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 pt-1 font-sans tabular-nums">vs. ₹42,20,500 last month</p>
                      </div>
                    )}

                    {/* V02: Sparkline Bar */}
                    {v.id === "v02" && (
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Active Customers</span>
                        <div className="flex items-end justify-between gap-2 pt-1">
                          <h4 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white font-sans tabular-nums">
                            1,428
                          </h4>
                          <div className="flex items-end gap-1 h-8">
                            <div className="w-1.5 h-3 rounded-xs bg-zinc-300 dark:bg-zinc-700"></div>
                            <div className="w-1.5 h-4 rounded-xs bg-zinc-300 dark:bg-zinc-700"></div>
                            <div className="w-1.5 h-3.5 rounded-xs bg-zinc-300 dark:bg-zinc-700"></div>
                            <div className="w-1.5 h-5 rounded-xs bg-zinc-400 dark:bg-zinc-600"></div>
                            <div className="w-1.5 h-6 rounded-xs bg-zinc-500 dark:bg-zinc-500"></div>
                            <div className="w-1.5 h-7 rounded-xs bg-zinc-700 dark:bg-zinc-300"></div>
                            <div className="w-1.5 h-8 rounded-xs bg-zinc-950 dark:bg-white"></div>
                          </div>
                        </div>
                        <p className="text-[11px] text-zinc-400 pt-1 font-sans tabular-nums">Last 7 days daily active users</p>
                      </div>
                    )}

                    {/* V03: Quota Card */}
                    {v.id === "v03" && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-zinc-500 dark:text-zinc-400">Quarterly Sales Goal</span>
                          <span className="font-bold text-zinc-950 dark:text-white font-sans tabular-nums">82%</span>
                        </div>
                        <h4 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white font-sans tabular-nums">
                          ₹82.0L <span className="text-xs font-normal text-zinc-400">/ ₹1.0 Cr</span>
                        </h4>
                        <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-white/10 overflow-hidden">
                          <div className="h-full bg-zinc-950 dark:bg-white rounded-full" style={{ width: "82%" }}></div>
                        </div>
                        <p className="text-[11px] text-zinc-400 pt-0.5 font-sans tabular-nums">₹18.0L remaining · 14 days left</p>
                      </div>
                    )}

                    {/* V04: Multi-Metric Strip */}
                    {v.id === "v04" && (
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Billing Overview</span>
                        <div className="grid grid-cols-3 gap-2 pt-2 divide-x divide-zinc-200 dark:divide-white/10">
                          <div>
                            <div className="text-[10px] text-zinc-400">Total</div>
                            <div className="text-lg font-bold font-sans tabular-nums text-zinc-950 dark:text-white">248</div>
                          </div>
                          <div className="pl-2">
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Paid</div>
                            <div className="text-lg font-bold font-sans tabular-nums text-emerald-600 dark:text-emerald-400">214</div>
                          </div>
                          <div className="pl-2">
                            <div className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">Overdue</div>
                            <div className="text-lg font-bold font-sans tabular-nums text-rose-600 dark:text-rose-400">11</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* V05: Key-Value Dossier */}
                    {v.id === "v05" && (
                      <dl className="space-y-1.5 text-xs">
                        <div className="flex justify-between py-1 border-b border-zinc-150 dark:border-white/5">
                          <dt className="text-zinc-500 dark:text-zinc-400">Client GSTIN</dt>
                          <dd className="font-bold text-zinc-950 dark:text-white font-sans tabular-nums">36AAACZ1234F1Z5</dd>
                        </div>
                        <div className="flex justify-between py-1 border-b border-zinc-150 dark:border-white/5">
                          <dt className="text-zinc-500 dark:text-zinc-400">Payment Terms</dt>
                          <dd className="font-semibold text-zinc-900 dark:text-zinc-100">Net 30 Days</dd>
                        </div>
                        <div className="flex justify-between py-1">
                          <dt className="text-zinc-500 dark:text-zinc-400">Account Owner</dt>
                          <dd className="font-semibold text-zinc-900 dark:text-zinc-100">Vikram Rao (Admin)</dd>
                        </div>
                      </dl>
                    )}

                    {/* V06: Alert KPI Card */}
                    {v.id === "v06" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold text-xs">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Pending Approvals</span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <h4 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white font-sans tabular-nums">
                            9 Invoices
                          </h4>
                          <span className="text-xs text-amber-700 dark:text-amber-400 font-bold font-sans tabular-nums">
                            ₹14.8L Total
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Requires dual-signoff before bank dispatch.</p>
                      </div>
                    )}

                    {/* V09: Saved Views Tab Bar */}
                    {v.id === "v09" && (
                      <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                        <button type="button" className="px-2.5 py-1 rounded-md font-bold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs flex items-center gap-1 whitespace-nowrap">
                          <span>All Invoices</span>
                          <span className="text-[10px] font-sans tabular-nums opacity-80">248</span>
                        </button>
                        <button type="button" className="px-2.5 py-1 rounded-md font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-white/10 transition flex items-center gap-1 whitespace-nowrap">
                          <span>Overdue</span>
                          <span className="text-[10px] font-sans tabular-nums px-1 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold">11</span>
                        </button>
                        <button type="button" className="px-2 py-1 rounded-md font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition flex items-center gap-1 whitespace-nowrap">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Save View</span>
                        </button>
                      </div>
                    )}

                    {/* V10: Faceted Filter Bar */}
                    {v.id === "v10" && (
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                            <span>Status: All</span>
                            <ChevronDown className="w-3 h-3 text-zinc-400" />
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {activeChips.map((chip) => (
                            <span key={chip} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-200/80 dark:bg-white/10 text-xs text-zinc-800 dark:text-zinc-200 font-medium">
                              <span>{chip}</span>
                              <button
                                type="button"
                                onClick={() => setActiveChips(activeChips.filter((c) => c !== chip))}
                                className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* V11: Floating Bulk Action Bar */}
                    {v.id === "v11" && (
                      <div className="p-2 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-xl flex items-center justify-between text-xs shadow-lg">
                        <span className="font-bold font-sans tabular-nums">3 items selected</span>
                        <div className="flex items-center gap-1.5">
                          <button type="button" className="px-2 py-1 rounded bg-white/10 dark:bg-black/10 font-semibold">Assign</button>
                          <button type="button" className="px-2 py-1 rounded bg-white/10 dark:bg-black/10 font-semibold">Export</button>
                          <button type="button" className="px-2 py-1 rounded bg-rose-600 text-white font-semibold">Delete</button>
                        </div>
                      </div>
                    )}

                    {/* V12: Faceted Sidebar Filter */}
                    {v.id === "v12" && (
                      <div className="space-y-2 text-xs">
                        <div className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[10px]">Branch Locations</div>
                        <div className="space-y-1.5">
                          <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-zinc-800 dark:text-zinc-200">Hyderabad Hub</span>
                            <span className="text-[10px] text-zinc-400 font-sans tabular-nums">142</span>
                          </label>
                          <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-zinc-800 dark:text-zinc-200">Bengaluru Fleet</span>
                            <span className="text-[10px] text-zinc-400 font-sans tabular-nums">84</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* V14: Audit Log */}
                    {v.id === "v14" && (
                      <div className="space-y-2 text-xs">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0"></div>
                          <div>
                            <div className="text-zinc-900 dark:text-zinc-100"><strong>Priya S.</strong> exported GST Tax Report.</div>
                            <div className="text-[10px] text-zinc-400 font-sans tabular-nums">12 mins ago · IP 182.74.20.14</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0"></div>
                          <div>
                            <div className="text-zinc-900 dark:text-zinc-100"><strong>Vikram R.</strong> approved #INV-9042.</div>
                            <div className="text-[10px] text-zinc-400 font-sans tabular-nums">48 mins ago</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* V15: Order Tracking */}
                    {v.id === "v15" && (
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#121215] border border-zinc-200/60 dark:border-white/5">
                          <div>
                            <div className="font-bold font-sans tabular-nums">#ORD-412</div>
                            <div className="text-[10px] text-zinc-400">Delhivery Express</div>
                          </div>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700">Delivered</span>
                        </div>
                      </div>
                    )}

                    {/* V16: Dropzone */}
                    {v.id === "v16" && (
                      <div className="p-4 rounded-xl border-2 border-dashed border-zinc-200 dark:border-white/15 text-center space-y-1">
                        <UploadCloud className="w-5 h-5 mx-auto text-zinc-400" />
                        <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                          {uploadedFileName || "Click to browse CSV / Excel"}
                        </div>
                        <div className="text-[10px] text-zinc-400">Supports .CSV, .XLSX up to 25 MB</div>
                      </div>
                    )}

                    {/* V17: Upload Progress */}
                    {v.id === "v17" && (
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between font-bold">
                          <span className="truncate">Customers_Nov2026.csv</span>
                          <span className="font-sans tabular-nums">68%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-white/10 overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: "68%" }}></div>
                        </div>
                        <div className="text-[10px] text-zinc-400 font-sans tabular-nums">Validating row 1,640 of 2,410...</div>
                      </div>
                    )}

                    {/* V18: Invoice PDF Card */}
                    {v.id === "v18" && (
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className="p-1.5 rounded bg-rose-50 text-rose-600 shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <div className="font-bold truncate">Tax_Invoice_9042.pdf</div>
                            <div className="text-[10px] text-zinc-400 font-sans tabular-nums">1.8 MB · Verified</div>
                          </div>
                        </div>
                        <button type="button" className="p-1.5 rounded hover:bg-zinc-200/60 dark:hover:bg-white/10 text-zinc-500">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-zinc-150 dark:border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Category: {v.cat}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Interactive Metric</span>
                </div>
              </div>
            ))}
        </div>

        {/* =====================================================================
             FULL WIDTH SECTION: DATA TABLES (V07 & V08)
        ====================================================================== */}
        {(activeCategory === "all" || activeCategory === "tables") && (
          <div className="space-y-6">
            {/* V07: Full Interactive Invoice Data Table */}
            <div className="p-5 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#121215] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 font-sans tabular-nums">#07</span>
                    <h3 className="text-sm font-bold text-zinc-950 dark:text-white tracking-tight">
                      Full Interactive Invoice Data Table + Bulk Action Bar
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Live instant search filtering, row selection highlighting, numerical amount sorting, and high-contrast bulk action bar.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative min-w-[200px]">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Filter client or invoice..."
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setSortAscending(!sortAscending)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>Sort: {sortAscending ? "Low to High" : "High to Low"}</span>
                  </button>
                </div>
              </div>

              {/* Bulk Action Bar */}
              {selectedCount > 0 && (
                <div className="flex items-center justify-between p-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-xl shadow-lg transition-all animate-in fade-in duration-150 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold font-sans tabular-nums pl-1">{selectedCount} selected</span>
                    <span className="text-zinc-400">|</span>
                    <button type="button" onClick={() => alert(`Exporting ${selectedCount} invoices`)} className="hover:underline font-semibold flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                    <button type="button" onClick={markSelectedPaid} className="hover:underline font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Paid</span>
                    </button>
                  </div>
                  <button type="button" onClick={() => toggleSelectAll(false)} className="text-zinc-400 hover:text-white dark:hover:text-zinc-950 text-xs pr-1">
                    Clear Selection
                  </button>
                </div>
              )}

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-zinc-200/80 dark:border-white/10">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-zinc-100/70 dark:bg-white/5 border-b border-zinc-200/80 dark:border-white/10 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    <tr>
                      <th className={`${densityConfig.cellPy} ${densityConfig.cellPx} w-10`}>
                        <input
                          type="checkbox"
                          checked={selectedCount === invoices.length && invoices.length > 0}
                          onChange={(e) => toggleSelectAll(e.target.checked)}
                          className="rounded cursor-pointer"
                        />
                      </th>
                      <th className={`${densityConfig.cellPy} ${densityConfig.cellPx}`}>Invoice</th>
                      <th className={`${densityConfig.cellPy} ${densityConfig.cellPx}`}>Client Company</th>
                      <th className={`${densityConfig.cellPy} ${densityConfig.cellPx}`}>Status</th>
                      <th className={`${densityConfig.cellPy} ${densityConfig.cellPx} text-right`}>Amount</th>
                      <th className={`${densityConfig.cellPy} ${densityConfig.cellPx}`}>Date</th>
                      <th className={`${densityConfig.cellPy} ${densityConfig.cellPx} text-right`}>Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y divide-zinc-200/60 dark:divide-white/5 ${densityConfig.text}`}>
                    {filteredInvoices.map((inv) => (
                      <tr
                        key={inv.id}
                        className={`hover:bg-zinc-50/80 dark:hover:bg-white/5 transition ${
                          inv.selected ? "bg-zinc-100/70 dark:bg-white/10 font-medium" : ""
                        }`}
                      >
                        <td className={`${densityConfig.cellPy} ${densityConfig.cellPx}`}>
                          <input
                            type="checkbox"
                            checked={inv.selected}
                            onChange={(e) => toggleSelectRow(inv.id, e.target.checked)}
                            className="rounded cursor-pointer"
                          />
                        </td>
                        <td className={`${densityConfig.cellPy} ${densityConfig.cellPx} font-bold text-zinc-950 dark:text-white font-sans tabular-nums`}>
                          {inv.id}
                        </td>
                        <td className={`${densityConfig.cellPy} ${densityConfig.cellPx} font-medium text-zinc-800 dark:text-zinc-200`}>
                          {inv.client}
                        </td>
                        <td className={`${densityConfig.cellPy} ${densityConfig.cellPx}`}>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              inv.status === "Paid"
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60"
                                : inv.status === "Pending"
                                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60"
                                : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200/60"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className={`${densityConfig.cellPy} ${densityConfig.cellPx} text-right font-bold text-zinc-950 dark:text-white font-sans tabular-nums`}>
                          ₹{inv.amount.toLocaleString("en-IN")}
                        </td>
                        <td className={`${densityConfig.cellPy} ${densityConfig.cellPx} text-zinc-500 font-sans tabular-nums`}>
                          {inv.date}
                        </td>
                        <td className={`${densityConfig.cellPy} ${densityConfig.cellPx} text-right`}>
                          <button type="button" className="px-2 py-1 rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 transition cursor-pointer">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* V08: Inline Editable Spreadsheet Grid Row */}
            <div className="p-5 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#121215] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 font-sans tabular-nums">#08</span>
                    <h3 className="text-sm font-bold text-zinc-950 dark:text-white tracking-tight">
                      Inline Editable Spreadsheet Grid Row
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Live editable inputs calculating Line Total dynamically in real time.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-zinc-200/80 dark:border-white/10">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-zinc-100/70 dark:bg-white/5 border-b border-zinc-200/80 dark:border-white/10 font-semibold text-zinc-600 dark:text-zinc-400">
                    <tr>
                      <th className={`${densityConfig.cellPy} ${densityConfig.cellPx}`}>Item Description</th>
                      <th className={`${densityConfig.cellPy} ${densityConfig.cellPx} w-36`}>Unit Price (₹)</th>
                      <th className={`${densityConfig.cellPy} ${densityConfig.cellPx} w-28`}>Qty</th>
                      <th className={`${densityConfig.cellPy} ${densityConfig.cellPx} text-right w-40`}>Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/60 dark:divide-white/5">
                    <tr>
                      <td className={`${densityConfig.cellPy} ${densityConfig.cellPx} font-medium text-zinc-900 dark:text-zinc-100`}>
                        Cloud Infrastructure Engine v2.4 (Dedicated Cluster)
                      </td>
                      <td className={`${densityConfig.cellPy} ${densityConfig.cellPx}`}>
                        <input
                          type="number"
                          value={unitPrice}
                          onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-900 dark:text-white font-sans tabular-nums focus:outline-none focus:ring-1 focus:ring-zinc-400"
                        />
                      </td>
                      <td className={`${densityConfig.cellPy} ${densityConfig.cellPx}`}>
                        <input
                          type="number"
                          value={qty}
                          min="1"
                          onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-900 dark:text-white font-sans tabular-nums focus:outline-none focus:ring-1 focus:ring-zinc-400"
                        />
                      </td>
                      <td className={`${densityConfig.cellPy} ${densityConfig.cellPx} text-right font-bold text-zinc-950 dark:text-white font-sans tabular-nums text-sm`}>
                        ₹{(unitPrice * qty).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
             FULL WIDTH SECTION: KANBAN BOARD (V13)
        ====================================================================== */}
        {(activeCategory === "all" || activeCategory === "kanban") && (
          <div className="p-5 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#121215] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 font-sans tabular-nums">#13</span>
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white tracking-tight">
                    Interactive 3-Stage SaaS Deal Pipeline Board
                  </h3>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Click Move Next → on any deal card to advance it across stages in real time.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { stage: 1, title: "New Leads", color: "bg-blue-500" },
                { stage: 2, title: "Proposal Sent", color: "bg-amber-500" },
                { stage: 3, title: "Closed Won", color: "bg-emerald-500" },
              ].map((col) => {
                const stageDeals = deals.filter((d) => d.stage === col.stage);
                return (
                  <div key={col.stage} className="p-3.5 rounded-xl bg-zinc-100/60 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-white">
                        <span className={`w-2 h-2 rounded-full ${col.color}`}></span>
                        <span>{col.title}</span>
                      </div>
                      <span className="px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-white/10 text-[10px] font-bold font-sans tabular-nums text-zinc-600 dark:text-zinc-300">
                        {stageDeals.length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {stageDeals.map((deal) => (
                        <div key={deal.id} className="p-3 rounded-lg bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 shadow-xs space-y-2 text-xs">
                          <div className="flex items-center justify-between font-bold text-zinc-950 dark:text-white">
                            <span>{deal.title}</span>
                            <span className="font-sans tabular-nums text-emerald-600 dark:text-emerald-400">{deal.amount}</span>
                          </div>
                          <p className="text-[11px] text-zinc-500">{deal.desc}</p>
                          <div className="flex justify-end pt-1">
                            {deal.stage < 3 ? (
                              <button
                                type="button"
                                onClick={() => advanceDeal(deal.id)}
                                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 text-zinc-900 dark:text-white transition cursor-pointer"
                              >
                                Advance Deal
                              </button>
                            ) : (
                              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Closed Deal
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          CLEAN CODE MODAL
      ========================================================================= */}
      <CodeModal
        modal={activeCodeModal}
        onClose={() => setActiveCodeModal(null)}
      />
    </div>
  );
}
