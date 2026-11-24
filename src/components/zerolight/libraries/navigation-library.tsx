"use client";

import React, { useState } from "react";
import {
  Search,
  Copy,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Home,
  ArrowLeft,
  ArrowRight,
  User,
  Users,
  Key,
  CreditCard,
  LayoutDashboard,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  Compass,
  Folder,
  BookOpen,
  Receipt,
  BarChart2,
  Settings,
  Bell,
  Download,
  Plus,
  HelpCircle,
} from "lucide-react";
import { useZeroLight } from "../context";
import { LibraryHeader, LibrarySegmentControl, CodeModal, getZeroLightCardStyle } from "./common";

export type NavDensity = "small" | "medium" | "large";

export function SaaSNavigationLibrary() {
  const { tokens, scaled } = useZeroLight();

  // Sticky Bar States
  const [searchQuery, setSearchQuery] = useState("");
  const [density, setDensity] = useState<NavDensity>("medium");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Code Modal State
  const [activeCodeModal, setActiveCodeModal] = useState<{ title: string; code: string } | null>(null);

  // Variant 03 State: Collapsed Breadcrumb Popover
  const [isBreadcrumbOverflowOpen, setIsBreadcrumbOverflowOpen] = useState(false);

  // Variant 05 State: Underline Tabs
  const [activeUnderlineTab, setActiveUnderlineTab] = useState("Overview");

  // Variant 06 State: Pill Tabs
  const [activePillTab, setActivePillTab] = useState("All Records");

  // Variant 07 State: Count Tabs
  const [activeCountTab, setActiveCountTab] = useState<{ label: string; count: number }>({
    label: "Unpaid",
    count: 14,
  });

  // Variant 08 State: Vertical Settings Tab
  const [activeVerticalTab, setActiveVerticalTab] = useState("General Info");

  // Variant 09 State: Numbered Page Strip
  const [numberedPage, setNumberedPage] = useState(1);

  // Variant 10 State: Compact Table Pager
  const [compactPage, setCompactPage] = useState(1);

  // Variant 11 State: Custom Rows Popover
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [isRowsDropdownOpen, setIsRowsDropdownOpen] = useState(false);

  // Variant 12 State: Onboarding Wizard Stepper
  const [wizardStep, setWizardStep] = useState(2);

  // Variant 14 State: Segmented Bar Step
  const [segmentedBarStep, setSegmentedBarStep] = useState(2);

  // Variant 15 State: Collapsible Sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Density Config
  const densityConfig = {
    small: { padY: "py-1.5", padX: "px-2.5", text: "text-xs" },
    medium: { padY: "py-2", padX: "px-3", text: "text-[13px]" },
    large: { padY: "py-2.5", padX: "px-4", text: "text-sm" },
  }[density];

  const categories = [
    { id: "all", label: "All Navigation", count: 20 },
    { id: "breadcrumbs", label: "Breadcrumbs & Hierarchy", count: 4 },
    { id: "tabs", label: "Tabs (Horizontal & Vertical)", count: 4 },
    { id: "pagination", label: "List & Table Pagination", count: 3 },
    { id: "steppers", label: "Steppers & Onboarding", count: 3 },
    { id: "sidebars", label: "App Sidebars & Rails", count: 3 },
    { id: "topnav", label: "Top Navbars & Headers", count: 3 },
  ];

  const variants = [
    // Category 1: Breadcrumbs
    {
      id: "v01",
      cat: "breadcrumbs",
      num: "01",
      title: "Chevron Breadcrumb Trail",
      desc: "Clean nested hierarchy path using hairline chevrons and interactive hover states.",
      type: "Breadcrumb",
    },
    {
      id: "v02",
      cat: "breadcrumbs",
      num: "02",
      title: "Home Icon & Slash Breadcrumbs",
      desc: "Slash-separated navigation route originating from a root home dashboard icon.",
      type: "Breadcrumb",
    },
    {
      id: "v03",
      cat: "breadcrumbs",
      num: "03",
      title: "Collapsed Overflow Breadcrumb",
      desc: "Deep folder path with interactive ellipsis disclosure revealing intermediate folders.",
      type: "Breadcrumb",
    },
    {
      id: "v04",
      cat: "breadcrumbs",
      num: "04",
      title: "Back Button + Current Page Title",
      desc: "Direct contextual escape link paired with high-clarity destination page heading.",
      type: "Breadcrumb",
    },

    // Category 2: Tabs
    {
      id: "v05",
      cat: "tabs",
      num: "05",
      title: "Clean Underline Tabs",
      desc: "Underline indicator tracking the active view with zero visual noise.",
      type: "Tabs",
    },
    {
      id: "v06",
      cat: "tabs",
      num: "06",
      title: "Segmented Pill Tabs",
      desc: "Tactile segmented pill container with solid background on active selection.",
      type: "Tabs",
    },
    {
      id: "v07",
      cat: "tabs",
      num: "07",
      title: "Tabs with Live Item Counters",
      desc: "Navigational status tabs paired with dynamic tabular numeric counts.",
      type: "Tabs",
    },
    {
      id: "v08",
      cat: "tabs",
      num: "08",
      title: "Vertical Settings Navigation Tabs",
      desc: "Stacked vertical sidebar tabs with icon prefixes for settings & account consoles.",
      type: "Vertical Tabs",
    },

    // Category 3: Pagination
    {
      id: "v09",
      cat: "pagination",
      num: "09",
      title: "Numbered Page Strip",
      desc: "Clickable numbered page strip with active pill highlight and prev/next chevron navigation.",
      type: "Pagination",
    },
    {
      id: "v10",
      cat: "pagination",
      num: "10",
      title: "Compact Table Footer Pager",
      desc: "Standard SaaS table bottom bar pairing record range count with outline action buttons.",
      type: "Pagination",
    },
    {
      id: "v11",
      cat: "pagination",
      num: "11",
      title: "Rows Per Page + Pager Bar",
      desc: "Custom floating popover rows selector (zero native select) paired with page jump index.",
      type: "Pagination",
    },

    // Category 4: Steppers
    {
      id: "v12",
      cat: "steppers",
      num: "12",
      title: "Interactive 3-Step Onboarding Wizard",
      desc: "Complete horizontal process stepper with checkmarks, active numbers, and Next/Back buttons.",
      type: "Stepper",
    },
    {
      id: "v13",
      cat: "steppers",
      num: "13",
      title: "Vertical Setup Checklist Stepper",
      desc: "Vertical timeline layout ideal for onboarding guides, compliance audits, and server provisioning.",
      type: "Stepper",
    },
    {
      id: "v14",
      cat: "steppers",
      num: "14",
      title: "Segmented Bar Stepper",
      desc: "Multi-segment progress bar with current percentage counter and step name indicator.",
      type: "Stepper",
    },

    // Category 5: Sidebars
    {
      id: "v15",
      cat: "sidebars",
      num: "15",
      title: "Collapsible SaaS App Sidebar",
      desc: "Complete application navigation sidebar with working toggle button smoothly shrinking from 224px to 62px.",
      type: "Sidebar",
    },
    {
      id: "v16",
      cat: "sidebars",
      num: "16",
      title: "Grouped Section Sidebar with Sub-Items",
      desc: "Categorized sections with collapsible parent headers and indented child navigation.",
      type: "Sidebar",
    },
    {
      id: "v17",
      cat: "sidebars",
      num: "17",
      title: "Icon-Only Mini Rail + Sub-Panel",
      desc: "High-density dual column rail pairing a 50px icon bar with a contextual secondary pane.",
      type: "Sidebar",
    },

    // Category 6: Topnav
    {
      id: "v18",
      cat: "topnav",
      num: "18",
      title: "Enterprise Top Navbar with Search & Profile",
      desc: "Complete full-width application header with product logo, menu links, ⌘K search pill, notification bell, and user avatar.",
      type: "Top Navbar",
    },
    {
      id: "v19",
      cat: "topnav",
      num: "19",
      title: "Contextual Page Header + Action Bar",
      desc: "Workspace page banner pairing breadcrumb navigation with primary create CTA and secondary export action.",
      type: "Page Header",
    },
    {
      id: "v20",
      cat: "topnav",
      num: "20",
      title: "Focused Checkout / Wizard Top Header",
      desc: "Distraction-free top navigation bar for onboarding funnels, multi-step checkout, and compliance flows.",
      type: "Wizard Header",
    },
  ];

  // Filtering
  const filteredVariants = variants.filter((v) => {
    const matchesCat = activeCategory === "all" || v.cat === activeCategory;
    const matchesQuery =
      searchQuery.trim() === "" ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const getCodeSnippet = (id: string, title: string) => {
    const num = Number(id.replace("v", "")) || 1;
    if (num <= 4) {
      return `// ${title} — ZeroLight Breadcrumbs Molecule
import { Breadcrumbs, useZeroLight } from "@/components/zerolight";

export function NavigationExample() {
  const { tokens } = useZeroLight();
  return (
    <Breadcrumbs
      items={[
        { label: "Workspace", href: "#workspace" },
        { label: "Invoices", href: "#invoices" },
        { label: "#INV-9042" },
      ]}
    />
  );
}`;
    }
    if (num <= 8) {
      return `// ${title} — ZeroLight Tabs Molecule
import { Tabs, useZeroLight } from "@/components/zerolight";

export function TabsExample() {
  const { scaled } = useZeroLight();
  return (
    <Tabs
      variant="${id === "v06" ? "pills" : "underline"}"
      items={[
        { id: "overview", label: "Overview", badge: 14 },
        { id: "analytics", label: "Analytics" },
        { id: "settings", label: "Settings" },
      ]}
    />
  );
}`;
    }
    if (num <= 11) {
      return `// ${title} — ZeroLight Pagination Molecule
import React, { useState } from "react";
import { Pagination } from "@/components/zerolight";

export function PaginationExample() {
  const [page, setPage] = useState(1);
  return (
    <Pagination
      currentPage={page}
      totalItems={248}
      pageSize={25}
      onPageChange={setPage}
    />
  );
}`;
    }
    if (num <= 14) {
      return `// ${title} — ZeroLight Stepper Molecule
import React, { useState } from "react";
import { Stepper } from "@/components/zerolight";

export function StepperExample() {
  const [currentStep, setCurrentStep] = useState(1);
  return (
    <Stepper
      currentStep={currentStep}
      steps={[
        { id: "account", label: "Organization Details" },
        { id: "billing", label: "GSTIN & Tax Setup" },
        { id: "launch", label: "Activate Workspace" },
      ]}
    />
  );
}`;
    }
    return `// ${title} — ZeroLight ${num <= 17 ? "AppShell" : "PageHeader"} Organism
import { ${num <= 17 ? "AppShell" : "PageHeader"}, Button, Breadcrumbs } from "@/components/zerolight";

export function NavigationShellExample() {
  return (
    <PageHeader
      title="Enterprise Workspace"
      subtitle="Unified navigation chrome & token alignment"
      breadcrumbs={<Breadcrumbs items={[{ label: "Home" }, { label: "Navigation" }]} />}
      actions={<Button variant="primary" size="sm">New Deployment</Button>}
    />
  );
}`;
  };

  const renderNavCard = (v: typeof variants[0]) => {
    const isFullWidthTopnav = v.id === "v20";
          return (
            <div
              key={v.id}
              data-zl-card="true"
              style={getZeroLightCardStyle(tokens, scaled)}
              className={`group flex flex-col justify-between p-5 border shadow-xs hover:border-zinc-300 dark:hover:border-white/20 transition ${
                isFullWidthTopnav ? "lg:col-span-2" : ""
              }`}
            >
              <div>
                {/* Header: Number, Category Badge & Type */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 font-sans tabular-nums">
                      {v.num}
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

                {/* Title & Description */}
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white tracking-tight mb-1">
                  {v.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
                  {v.desc}
                </p>

                {/* Live Preview Container */}
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-[#09090B] border border-zinc-200/80 dark:border-white/5">
                  {/* V01: Chevron Breadcrumb */}
                  {v.id === "v01" && (
                    <nav aria-label="Breadcrumb">
                      <ol className={`flex items-center gap-1.5 flex-wrap ${densityConfig.text}`}>
                        <li>
                          <a href="#workspace" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition font-medium">
                            Workspace
                          </a>
                        </li>
                        <li className="text-zinc-300 dark:text-zinc-600">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </li>
                        <li>
                          <a href="#invoices" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition font-medium">
                            Invoices
                          </a>
                        </li>
                        <li className="text-zinc-300 dark:text-zinc-600">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </li>
                        <li className="font-semibold text-zinc-900 dark:text-white font-sans tabular-nums">
                          #INV-9042
                        </li>
                      </ol>
                    </nav>
                  )}

                  {/* V02: Home Icon & Slash Breadcrumbs */}
                  {v.id === "v02" && (
                    <nav aria-label="Breadcrumb">
                      <ol className={`flex items-center gap-2 flex-wrap ${densityConfig.text}`}>
                        <li>
                          <a href="#home" title="Root Dashboard" className="p-1 rounded text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition flex items-center">
                            <Home className="w-3.5 h-3.5" />
                          </a>
                        </li>
                        <li className="text-zinc-300 dark:text-zinc-600 font-medium">/</li>
                        <li>
                          <a href="#clients" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition font-medium">
                            Clients
                          </a>
                        </li>
                        <li className="text-zinc-300 dark:text-zinc-600 font-medium">/</li>
                        <li className="font-semibold text-zinc-900 dark:text-white">
                          Deccan Logistics
                        </li>
                      </ol>
                    </nav>
                  )}

                  {/* V03: Collapsed Overflow Breadcrumb */}
                  {v.id === "v03" && (
                    <nav aria-label="Breadcrumb" className="relative">
                      <ol className={`flex items-center gap-1.5 flex-wrap ${densityConfig.text}`}>
                        <li>
                          <a href="#files" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition font-medium">
                            Files
                          </a>
                        </li>
                        <li className="text-zinc-300 dark:text-zinc-600">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </li>
                        <li className="relative">
                          <button
                            type="button"
                            onClick={() => setIsBreadcrumbOverflowOpen(!isBreadcrumbOverflowOpen)}
                            className="px-1.5 py-0.5 rounded text-xs font-semibold bg-zinc-200/70 hover:bg-zinc-300 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-700 dark:text-zinc-300 transition cursor-pointer"
                            title="Click to reveal hidden intermediate path"
                          >
                            •••
                          </button>
                          {isBreadcrumbOverflowOpen && (
                            <div className="absolute left-0 top-full mt-1.5 z-20 w-44 p-1.5 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/10 rounded-xl shadow-xl text-xs space-y-1">
                              <a href="#q4" className="block px-2.5 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 transition">
                                2026_Q4_Audits
                              </a>
                              <a href="#compliance" className="block px-2.5 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 transition">
                                Tax_Compliance
                              </a>
                            </div>
                          )}
                        </li>
                        <li className="text-zinc-300 dark:text-zinc-600">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </li>
                        <li className="font-semibold text-zinc-900 dark:text-white">
                          Tax_Summary.pdf
                        </li>
                      </ol>
                    </nav>
                  )}

                  {/* V04: Back Button + Current Page Title */}
                  {v.id === "v04" && (
                    <div className="space-y-1">
                      <a href="#customers" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition font-medium">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Customers</span>
                      </a>
                      <div className="flex items-center gap-2 pt-1">
                        <h4 className="text-base font-bold text-zinc-950 dark:text-white">Apex Retail Solutions</h4>
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 font-sans">
                          Active Client
                        </span>
                      </div>
                    </div>
                  )}

                  {/* V05: Clean Underline Tabs */}
                  {v.id === "v05" && (
                    <div className="space-y-3">
                      <div className="border-b border-zinc-200 dark:border-white/10 flex items-center gap-4">
                        {["Overview", "Activity", "Members", "Billing"].map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveUnderlineTab(tab)}
                            className={`pb-2 transition font-medium cursor-pointer ${densityConfig.text} ${
                              activeUnderlineTab === tab
                                ? "font-semibold text-zinc-950 dark:text-white border-b-2 border-zinc-950 dark:border-white"
                                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 border-b-2 border-transparent"
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        Active tab view: <strong className="text-zinc-900 dark:text-zinc-100">{activeUnderlineTab}</strong>
                      </div>
                    </div>
                  )}

                  {/* V06: Segmented Pill Tabs */}
                  {v.id === "v06" && (
                    <div className="space-y-3">
                      <div className="inline-flex p-1 rounded-lg bg-zinc-200/60 dark:bg-white/10 border border-zinc-200/80 dark:border-white/5">
                        {["All Records", "Active", "Archived"].map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setActivePillTab(tab)}
                            className={`rounded-md transition cursor-pointer ${densityConfig.padY} ${densityConfig.padX} ${densityConfig.text} ${
                              activePillTab === tab
                                ? "font-bold bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs"
                                : "font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        Showing: <strong className="text-zinc-900 dark:text-zinc-100">{activePillTab} (248 Total)</strong>
                      </div>
                    </div>
                  )}

                  {/* V07: Tabs with Live Item Counters */}
                  {v.id === "v07" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {[
                          { label: "Unpaid", count: 14, color: "bg-white/20 dark:bg-black/20 text-white dark:text-black" },
                          { label: "Paid", count: 86, color: "bg-zinc-300/80 dark:bg-white/10 text-zinc-700 dark:text-zinc-300" },
                          { label: "Overdue", count: 3, color: "bg-rose-200/80 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400" },
                        ].map((t) => {
                          const isActive = activeCountTab.label === t.label;
                          return (
                            <button
                              key={t.label}
                              type="button"
                              onClick={() => setActiveCountTab({ label: t.label, count: t.count })}
                              className={`rounded-lg transition flex items-center gap-2 cursor-pointer ${densityConfig.padY} ${densityConfig.padX} ${densityConfig.text} ${
                                isActive
                                  ? "font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                                  : "font-medium bg-zinc-200/70 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-white/20"
                              }`}
                            >
                              <span>{t.label}</span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md font-sans tabular-nums ${t.color}`}>
                                {t.count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        Filter: <strong className="text-zinc-900 dark:text-zinc-100">{activeCountTab.label} Invoices ({activeCountTab.count} records require action)</strong>
                      </div>
                    </div>
                  )}

                  {/* V08: Vertical Settings Navigation Tabs */}
                  {v.id === "v08" && (
                    <div className="space-y-1">
                      {[
                        { label: "General Info", icon: User },
                        { label: "Team & Roles", icon: Users },
                        { label: "API & Webhooks", icon: Key },
                        { label: "Billing Plan", icon: CreditCard },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isActive = activeVerticalTab === item.label;
                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => setActiveVerticalTab(item.label)}
                            className={`w-full flex items-center gap-2.5 rounded-lg text-left transition cursor-pointer ${densityConfig.padY} ${densityConfig.padX} ${densityConfig.text} ${
                              isActive
                                ? "font-semibold bg-white dark:bg-white/10 text-zinc-950 dark:text-white shadow-xs"
                                : "font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-white/5"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* V09: Numbered Page Strip */}
                  {v.id === "v09" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-1 font-sans tabular-nums">
                        <button
                          type="button"
                          onClick={() => setNumberedPage((p) => Math.max(1, p - 1))}
                          className="p-1.5 rounded-md hover:bg-zinc-200/60 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 transition cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        {[1, 2, 3, 4, 5].map((page) => (
                          <button
                            key={page}
                            type="button"
                            onClick={() => setNumberedPage(page)}
                            className={`w-7 h-7 rounded-md text-xs font-sans tabular-nums transition cursor-pointer ${
                              page === numberedPage
                                ? "font-bold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                                : "font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-white/10"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setNumberedPage((p) => Math.min(5, p + 1))}
                          className="p-1.5 rounded-md hover:bg-zinc-200/60 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 transition cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-center text-xs text-zinc-500 font-sans tabular-nums">
                        Showing page {numberedPage} of 5
                      </div>
                    </div>
                  )}

                  {/* V10: Compact Table Footer Pager */}
                  {v.id === "v10" && (
                    <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-sans tabular-nums">
                      <span className="text-zinc-500 dark:text-zinc-400">
                        Showing <strong>{(compactPage - 1) * 20 + 1}–{Math.min(248, compactPage * 20)}</strong> of <strong>248</strong> results
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={compactPage === 1}
                          onClick={() => setCompactPage((p) => Math.max(1, p - 1))}
                          className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          disabled={compactPage === 13}
                          onClick={() => setCompactPage((p) => Math.min(13, p + 1))}
                          className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {/* V11: Rows Per Page + Pager Bar */}
                  {v.id === "v11" && (
                    <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-sans tabular-nums">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsRowsDropdownOpen(!isRowsDropdownOpen)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10 transition cursor-pointer"
                        >
                          <span>{rowsPerPage} rows</span>
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                        </button>
                        {isRowsDropdownOpen && (
                          <div className="absolute left-0 bottom-full mb-1 z-20 w-28 p-1 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/10 rounded-xl shadow-xl space-y-0.5">
                            {[10, 25, 50, 100].map((count) => (
                              <button
                                key={count}
                                type="button"
                                onClick={() => {
                                  setRowsPerPage(count);
                                  setIsRowsDropdownOpen(false);
                                }}
                                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                                  rowsPerPage === count
                                    ? "font-bold text-zinc-950 dark:text-white bg-zinc-100 dark:bg-white/10"
                                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5"
                                }`}
                              >
                                {count} rows
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500 dark:text-zinc-400">Page <strong>1</strong> of <strong>10</strong></span>
                        <div className="flex items-center gap-0.5">
                          <button type="button" className="p-1 rounded hover:bg-zinc-200/60 dark:hover:bg-white/10 text-zinc-400 hover:text-zinc-800 transition">
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button type="button" className="p-1 rounded hover:bg-zinc-200/60 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 transition">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* V12: Interactive 3-Step Onboarding Wizard */}
                  {v.id === "v12" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between relative">
                        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-zinc-200 dark:bg-white/10 z-0"></div>
                        
                        {/* Step 1 */}
                        <div className="relative z-10 flex flex-col items-center gap-1">
                          <div className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center font-sans tabular-nums shadow-xs ${
                            wizardStep > 1 ? "bg-emerald-600 text-white" : "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950"
                          }`}>
                            {wizardStep > 1 ? <Check className="w-3.5 h-3.5" /> : "1"}
                          </div>
                          <span className={`text-[11px] ${wizardStep >= 1 ? "font-bold text-zinc-950 dark:text-white" : "text-zinc-400"}`}>Account</span>
                        </div>

                        {/* Step 2 */}
                        <div className="relative z-10 flex flex-col items-center gap-1">
                          <div className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center font-sans tabular-nums shadow-xs ${
                            wizardStep > 2 ? "bg-emerald-600 text-white" : wizardStep === 2 ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950" : "bg-zinc-200 dark:bg-white/10 text-zinc-500"
                          }`}>
                            {wizardStep > 2 ? <Check className="w-3.5 h-3.5" /> : "2"}
                          </div>
                          <span className={`text-[11px] ${wizardStep >= 2 ? "font-bold text-zinc-950 dark:text-white" : "text-zinc-400"}`}>Workspace</span>
                        </div>

                        {/* Step 3 */}
                        <div className="relative z-10 flex flex-col items-center gap-1">
                          <div className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center font-sans tabular-nums ${
                            wizardStep === 3 ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-xs" : "bg-zinc-200 dark:bg-white/10 text-zinc-500"
                          }`}>
                            3
                          </div>
                          <span className={`text-[11px] ${wizardStep === 3 ? "font-bold text-zinc-950 dark:text-white" : "text-zinc-400"}`}>Invite</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/5 text-xs text-zinc-600 dark:text-zinc-400">
                        {wizardStep === 1 && "Create team username, primary administrator email, and cryptographic key."}
                        {wizardStep === 2 && "Configure production cluster subdomain and default regional currency."}
                        {wizardStep === 3 && "Add collaborator email addresses and assign role permission tiers."}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          disabled={wizardStep === 1}
                          onClick={() => setWizardStep((s) => Math.max(1, s - 1))}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-white/5 disabled:opacity-40 transition cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setWizardStep((s) => (s < 3 ? s + 1 : 1))}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 shadow-xs transition cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{wizardStep === 3 ? "Reset Wizard" : "Continue"}</span>
                          {wizardStep < 3 && <ArrowRight className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* V13: Vertical Setup Checklist Stepper */}
                  {v.id === "v13" && (
                    <div className="space-y-4 relative">
                      <div className="absolute left-3 top-3 bottom-3 w-[2px] bg-zinc-200 dark:bg-white/10 z-0"></div>

                      <div className="relative z-10 flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Verify Organization Identity</h4>
                          <p className="text-[11px] text-zinc-500">Corporate GSTIN and domain DNS authenticated.</p>
                        </div>
                      </div>

                      <div className="relative z-10 flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center text-xs font-bold font-sans tabular-nums shrink-0 shadow-xs ring-4 ring-zinc-200 dark:ring-white/10">
                          2
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-zinc-950 dark:text-white">Connect Payment Gateway</h4>
                          <p className="text-[11px] text-zinc-500">Authorize automated recurring subscriptions via UPI / Wire.</p>
                        </div>
                      </div>

                      <div className="relative z-10 flex items-start gap-3 opacity-60">
                        <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-white/10 text-zinc-500 flex items-center justify-center text-xs font-bold font-sans tabular-nums shrink-0">
                          3
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Deploy Production Cluster</h4>
                          <p className="text-[11px] text-zinc-400">Provision dedicated Redis and database shards.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* V14: Segmented Bar Stepper */}
                  {v.id === "v14" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">
                          Step {segmentedBarStep} of 4 · {["Account", "Plan Selection", "Payment Setup", "Review"][segmentedBarStep - 1]}
                        </span>
                        <span className="font-bold font-sans tabular-nums text-zinc-900 dark:text-zinc-100">
                          {segmentedBarStep * 25}%
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-1.5 h-1.5">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`rounded-full transition-all ${
                              step <= segmentedBarStep
                                ? "bg-zinc-950 dark:bg-white"
                                : "bg-zinc-200 dark:bg-white/10"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-zinc-400">Estimated: 1 min remaining</span>
                        <button
                          type="button"
                          onClick={() => setSegmentedBarStep((s) => (s % 4) + 1)}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-200/80 dark:bg-white/10 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-white/20 transition cursor-pointer"
                        >
                          Advance Step
                        </button>
                      </div>
                    </div>
                  )}

                  {/* V15: Collapsible SaaS App Sidebar */}
                  {v.id === "v15" && (
                    <div className="overflow-hidden">
                      <div
                        className={`transition-all duration-200 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-xl p-3 shadow-xs space-y-4 ${
                          isSidebarCollapsed ? "w-[62px]" : "w-[224px]"
                        }`}
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <div className="w-7 h-7 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs flex items-center justify-center shrink-0">
                              A
                            </div>
                            {!isSidebarCollapsed && (
                              <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                                Acme ERP
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="p-1 rounded text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 transition shrink-0 cursor-pointer"
                            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                          >
                            {isSidebarCollapsed ? (
                              <PanelLeftOpen className="w-4 h-4" />
                            ) : (
                              <PanelLeftClose className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Navigation links */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <LayoutDashboard className="w-4 h-4 shrink-0" />
                              {!isSidebarCollapsed && <span className="truncate">Dashboard</span>}
                            </div>
                          </div>
                          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <FileText className="w-4 h-4 shrink-0" />
                              {!isSidebarCollapsed && <span className="truncate">Invoices</span>}
                            </div>
                            {!isSidebarCollapsed && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-zinc-200 dark:bg-white/10 font-sans tabular-nums">
                                12
                              </span>
                            )}
                          </div>
                        </div>

                        {/* User Footer */}
                        <div className="pt-3 border-t border-zinc-100 dark:border-white/5 flex items-center gap-2.5 overflow-hidden">
                          <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-bold text-xs flex items-center justify-center shrink-0">
                            JS
                          </div>
                          {!isSidebarCollapsed && (
                            <div className="overflow-hidden">
                              <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 truncate">Sai Joshna</div>
                              <div className="text-[10px] text-zinc-400 truncate">Admin Seat</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* V16: Grouped Section Sidebar with Sub-Items */}
                  {v.id === "v16" && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                          Workspace
                        </div>
                        <div className="space-y-0.5 mt-1">
                          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                            <Compass className="w-3.5 h-3.5" />
                            <span>Overview</span>
                          </div>
                          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-white/5">
                            <Folder className="w-3.5 h-3.5" />
                            <span>Projects</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                          Finance
                        </div>
                        <div className="space-y-0.5 mt-1">
                          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-white/5">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>General Ledgers</span>
                          </div>
                          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-white/5">
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Tax Returns</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* V17: Icon-Only Mini Rail + Sub-Panel */}
                  {v.id === "v17" && (
                    <div className="flex rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#121215] overflow-hidden shadow-xs h-36">
                      <div className="w-12 bg-zinc-100/60 dark:bg-white/5 border-r border-zinc-200 dark:border-white/10 flex flex-col items-center py-2.5 gap-2 shrink-0">
                        <button type="button" className="p-2 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs" title="Analytics">
                          <BarChart2 className="w-4 h-4" />
                        </button>
                        <button type="button" className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition" title="Settings">
                          <Settings className="w-4 h-4" />
                        </button>
                        <button type="button" className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition" title="Team">
                          <Users className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex-1 p-2.5 space-y-1 overflow-y-auto text-xs">
                        <div className="font-bold text-[11px] text-zinc-400 uppercase tracking-wider px-2 py-0.5">
                          Analytics
                        </div>
                        <div className="block px-2.5 py-1.5 rounded-md font-semibold bg-zinc-100 dark:bg-white/10 text-zinc-950 dark:text-white">
                          Revenue Telemetry
                        </div>
                        <div className="block px-2.5 py-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5">
                          API Quotas
                        </div>
                      </div>
                    </div>
                  )}

                  {/* V18: Enterprise Top Navbar */}
                  {v.id === "v18" && (
                    <header className="flex items-center justify-between gap-3 p-3 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-xl shadow-xs">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs flex items-center justify-center">
                            A
                          </div>
                          <span className="font-bold text-xs text-zinc-900 dark:text-white">Acme Suite</span>
                        </div>
                        <nav className="hidden sm:flex items-center gap-3 text-xs">
                          <span className="font-semibold text-zinc-950 dark:text-white">Dashboard</span>
                          <span className="font-medium text-zinc-500">Projects</span>
                        </nav>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200/60 dark:border-white/10 text-xs text-zinc-400">
                          <Search className="w-3.5 h-3.5" />
                          <span>Search...</span>
                          <span className="px-1 py-0.2 rounded bg-zinc-200/70 dark:bg-white/10 text-[10px] font-sans tabular-nums text-zinc-600 dark:text-zinc-300 font-bold">⌘K</span>
                        </div>
                        <button type="button" className="relative p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition">
                          <Bell className="w-4 h-4" />
                          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
                        </button>
                        <div className="w-7 h-7 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center text-xs font-bold font-sans">
                          SJ
                        </div>
                      </div>
                    </header>
                  )}

                  {/* V19: Contextual Page Header */}
                  {v.id === "v19" && (
                    <div className="p-3.5 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                          <span>Finance</span>
                          <span>›</span>
                          <span>Invoices</span>
                        </div>
                        <div className="flex items-center gap-2 pt-0.5">
                          <h2 className="text-base font-bold text-zinc-950 dark:text-white">Client Invoices</h2>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-sans tabular-nums">
                            124
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button type="button" className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 transition flex items-center gap-1.5">
                          <Download className="w-3.5 h-3.5" />
                          <span>Export</span>
                        </button>
                        <button type="button" className="px-3.5 py-1.5 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition shadow-xs flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5" />
                          <span>New Invoice</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* V20: Focused Checkout Top Header */}
                  {v.id === "v20" && (
                    <header className="flex items-center justify-between gap-3 p-3 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-xl shadow-xs">
                      <button type="button" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition flex items-center gap-1.5">
                        <X className="w-4 h-4" />
                        <span>Save & Exit</span>
                      </button>

                      <div className="text-center">
                        <div className="text-xs font-bold text-zinc-950 dark:text-white">Workspace Setup</div>
                        <div className="text-[10px] text-zinc-400 font-sans tabular-nums">Step 2 of 3 · Billing Profile</div>
                      </div>

                      <div className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Need Help?</span>
                      </div>
                    </header>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 mt-4 border-t border-zinc-200/80 dark:border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Category: {v.cat}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Interactive State</span>
              </div>
            </div>
          );
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
           STICKY TOP CONTROL BAR (SLIMMED UTILITY BAR)
      ========================================================================= */}
      <LibraryHeader
        countText={`${filteredVariants.length} of 20 Variants Active`}
        description="Breadcrumbs, tabs, steppers, pagination & app rails."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Filter navigation..."
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        action={
          <LibrarySegmentControl
            options={["small", "medium", "large"] as const}
            value={density}
            onChange={setDensity}
            ariaLabel="Navigation density"
          />
        }
      />

      {/* =========================================================================
          IN-PAGE GROUPED SECTIONS (6 SECTIONS, 20 NAVIGATION PATTERNS)
      ========================================================================= */}
      <div className="space-y-8">
        {[
          { id: "breadcrumbs", title: "1. Breadcrumbs & Hierarchy", desc: "Hierarchy breadcrumb trails with chevrons, slashes, dropdown history & project scopes." },
          { id: "tabs", title: "2. Tabs (Horizontal & Vertical)", desc: "Underline tab rails, segmented pill switches, vertical settings tabs & badges." },
          { id: "pagination", title: "3. List & Table Pagination", desc: "Compact numeric pagination, cursor next/prev buttons & rows-per-page selectors." },
          { id: "steppers", title: "4. Steppers & Onboarding", desc: "Horizontal milestone steppers, numbered steps & wizard progress trackers." },
          { id: "sidebars", title: "5. App Sidebars & Rails", desc: "Collapsible icon sidebars, nested group menus & user account footers." },
          { id: "topnav", title: "6. Top Navbars & Headers", desc: "Workspace header navigation with team switchers, search bars & profile avatars." },
        ].map((sec) => {
          const secVariants = filteredVariants.filter((v) => v.cat === sec.id);
          if (secVariants.length === 0) return null;

          return (
            <section key={sec.id} className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                  {sec.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {sec.desc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {secVariants.map(renderNavCard)}
              </div>
            </section>
          );
        })}
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
