"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Kanban,
  Users,
  CreditCard,
  Settings,
  Search,
  Bell,
  Plus,
  ChevronsUpDown,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Check,
  Download,
  UserPlus,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useZeroLight } from "../context";
import { LibraryHeader, CodeModal } from "./common";

export function SaaSAppScreensLibrary() {
  const { tokens, scaled } = useZeroLight();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCodeModal, setActiveCodeModal] = useState<{ title: string; code: string } | null>(null);

  // App Shell State
  const [activePage, setActivePage] = useState<"dashboard" | "invoices" | "pipeline" | "team" | "billing" | "settings">("dashboard");
  const [workspace, setWorkspace] = useState("Hyderabad HQ");
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(true);

  // Command Palette & Modals State
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [cmdSearch, setCmdSearch] = useState("");
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isInviteMemberOpen, setIsInviteMemberOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Detail Drawer State
  const [inspectedInvoice, setInspectedInvoice] = useState<{
    id: string;
    client: string;
    amount: number;
    status: string;
    city: string;
    date: string;
    notes: string;
  } | null>(null);

  // Invoices & Table Filter State
  const [invoiceFilter, setInvoiceFilter] = useState<"all" | "Paid" | "Pending" | "Overdue">("all");
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);

  // Invoices Data
  const [invoices, setInvoices] = useState([
    { id: "INV-9042", client: "Zerorapid India Pvt Ltd", amount: 125000, status: "Paid", city: "Hyderabad, Telangana", date: "15 Nov 2026", notes: "Input tax credit verified via GSTR-2B filing. Payment routed via ICICI RTGS." },
    { id: "INV-9041", client: "Deccan Logistics Hub", amount: 84200, status: "Pending", city: "Bengaluru, Karnataka", date: "14 Nov 2026", notes: "Vehicle tracking telemetry integration milestone." },
    { id: "INV-9040", client: "Apex Retail Solutions", amount: 32600, status: "Overdue", city: "Mumbai, Maharashtra", date: "10 Nov 2026", notes: "Point of sale synchronization in progress. Awaiting store manager clearance." },
    { id: "INV-9039", client: "Kaveri Global Exports", amount: 210000, status: "Paid", city: "Chennai, Tamil Nadu", date: "08 Nov 2026", notes: "Container export duty paid. GST input tax credit submitted to portal." },
    { id: "INV-9038", client: "Bangalore Silicon Labs", amount: 65400, status: "Paid", city: "Bengaluru, Karnataka", date: "05 Nov 2026", notes: "Custom webhook event processor license." },
    { id: "INV-9037", client: "Godavari Agro Mills", amount: 48000, status: "Pending", city: "Vijayawada, AP", date: "01 Nov 2026", notes: "Commodity weighbridge automation bridge." }
  ]);

  // Create Invoice Form State
  const [newInvClient, setNewInvClient] = useState("");
  const [newInvAmount, setNewInvAmount] = useState(95000);
  const [newInvStatus, setNewInvStatus] = useState("Pending");
  const [newInvCity, setNewInvCity] = useState("Hyderabad");
  const [newInvNotes] = useState("Quarterly accounting telemetry and GST filing...");

  // Deals Data
  const [deals, setDeals] = useState([
    { id: "d1", title: "Deccan Telecom Hub", amount: 850000, company: "Deccan Telecom", stage: "new", desc: "50 Enterprise Seats & Custom Webhooks" },
    { id: "d2", title: "Apex Logistics Gateway", amount: 420000, company: "Apex Logistics", stage: "new", desc: "Fleet Telemetry API Bridge" },
    { id: "d3", title: "Zerorapid Payments Expansion", amount: 1400000, company: "Zerorapid Global", stage: "proposal", desc: "Enterprise Multi-Tenant Routing" },
    { id: "d4", title: "Global Finserve Hub", amount: 2250000, company: "Global Finserve", stage: "won", desc: "Annual Contract + Dedicated Support" }
  ]);

  // Team Data
  const [team, setTeam] = useState([
    { id: "m1", name: "Sai Joshna", email: "sai@zerorapid.com", role: "Owner", presence: "Online" },
    { id: "m2", name: "Rahul Verma", email: "rahul@zerorapid.com", role: "Admin", presence: "Online" },
    { id: "m3", name: "Priya Sharma", email: "priya@zerorapid.com", role: "Editor", presence: "Away" },
    { id: "m4", name: "Vikram Reddy", email: "vikram@zerorapid.com", role: "Viewer", presence: "Offline" }
  ]);

  // Invite Member Form State
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole] = useState("Editor");

  // Billing Period State
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");

  // Toast Trigger
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // KPI Calculations
  const totalBilled = invoices.reduce((acc, inv) => acc + inv.amount, 0);
  const paidCount = invoices.filter((i) => i.status === "Paid").length;
  const overdueBalance = invoices.filter((i) => i.status === "Overdue").reduce((acc, inv) => acc + inv.amount, 0);
  const openDealsCount = deals.filter((d) => d.stage !== "won").length;

  // Filtered Invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchStatus = invoiceFilter === "all" || inv.status.toLowerCase() === invoiceFilter.toLowerCase();
    const matchSearch =
      invoiceSearch === "" ||
      inv.client.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      inv.id.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      inv.city.toLowerCase().includes(invoiceSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      <LibraryHeader
        countText="6 Full Interactive Pages"
        description="Complete Level 5 SaaS App Screens with billing, invoices, Kanban & RBAC."
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          const match = (["dashboard", "invoices", "pipeline", "team", "billing", "settings"] as const).find((p) =>
            p.includes(q.trim().toLowerCase())
          );
          if (q.trim() && match) setActivePage(match);
        }}
        searchPlaceholder="Jump to screen (billing, pipeline, team)..."
        categories={[
          { id: "dashboard", label: "1. Dashboard" },
          { id: "invoices", label: "2. Invoices" },
          { id: "pipeline", label: "3. Pipeline" },
          { id: "team", label: "4. Team & Roles" },
          { id: "billing", label: "5. Billing" },
          { id: "settings", label: "6. Settings" },
        ]}
        activeCategory={activePage}
        onCategoryChange={(cat) => setActivePage(cat as typeof activePage)}
        action={
          <button
            type="button"
            onClick={() =>
              setActiveCodeModal({
                title: `Level 5 Screen: ${activePage.toUpperCase()}`,
                code: `import { ZeroLightProvider, DashboardTemplate, BillingPortal, DataTable, TeamPermissions } from "@/components/zerolight";

export function ${activePage.charAt(0).toUpperCase() + activePage.slice(1)}Screen() {
  return (
    <ZeroLightProvider>
      <DashboardTemplate title="${workspace}" />
    </ZeroLightProvider>
  );
}`,
              })
            }
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 text-white hover:opacity-90 transition cursor-pointer"
          >
            View Screen TSX
          </button>
        }
      />

      {/* Main SaaS Application Sandbox Container */}
      <div
        style={{
          borderRadius: `${scaled.scaledCardRadius}px`,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
        }}
        className="border rounded-2xl overflow-hidden bg-white shadow-sm flex h-[760px] relative"
      >
        
        {/* =====================================================================
             1. AUTHENTICATED APP SHELL: LEFT SIDEBAR
        ===================================================================== */}
        <aside
          className={`h-full border-r border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#0E0E10] flex flex-col justify-between shrink-0 transition-all duration-300 z-20 ${
            isSidebarCollapsed ? "w-16" : "w-56"
          }`}
        >
          {/* Workspace Switcher Header */}
          <div className="p-3 border-b border-zinc-100 dark:border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 mr-1">
                <button
                  type="button"
                  onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
                  className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition cursor-pointer text-left"
                >
                  <div className="w-6 h-6 rounded-md bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center text-xs font-bold shrink-0">
                    Z
                  </div>
                  {!isSidebarCollapsed && (
                    <div className="truncate flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-950 dark:text-white truncate">{workspace}</p>
                      <p className="text-[10px] text-zinc-400 truncate">Enterprise Hub</p>
                    </div>
                  )}
                  {!isSidebarCollapsed && <ChevronsUpDown className="w-3 h-3 text-zinc-400 shrink-0" />}
                </button>

                {/* Workspace Dropdown */}
                {isWorkspaceMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 w-52 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 shadow-xl p-1.5 space-y-1 z-50 text-xs">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block px-2 py-1">
                      Switch Organization
                    </span>
                    {["Hyderabad HQ", "Bengaluru Tech Hub", "Dubai Global Office"].map((org) => (
                      <button
                        key={org}
                        type="button"
                        onClick={() => {
                          setWorkspace(org);
                          setIsWorkspaceMenuOpen(false);
                          triggerToast(`Switched workspace to ${org}`);
                        }}
                        className={`w-full px-2 py-1.5 rounded-lg flex items-center justify-between text-left font-medium ${
                          workspace === org
                            ? "bg-zinc-100 dark:bg-white/10 font-bold text-zinc-950 dark:text-white"
                            : "hover:bg-zinc-50 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        <span>{org}</span>
                        {workspace === org && (
                          <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                            Active
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
              >
                {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-2 space-y-4 overflow-y-auto text-xs">
            {/* Section 1: Workspace */}
            <div className="space-y-1">
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2 block pb-1">
                  Workspace
                </span>
              )}
              {[
                { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
                { id: "invoices" as const, label: "Client Invoices", icon: FileText, badge: invoices.length },
                { id: "pipeline" as const, label: "Deal Pipeline", icon: Kanban },
              ].map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActivePage(item.id)}
                    className={`w-full px-2.5 py-2 rounded-lg flex items-center justify-between cursor-pointer transition ${
                      isActive
                        ? "font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                        : "font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!isSidebarCollapsed && item.badge !== undefined && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-sans tabular-nums">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Section 2: Administration */}
            <div className="space-y-1">
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2 block pb-1">
                  Administration
                </span>
              )}
              {[
                { id: "team" as const, label: "Team & Roles", icon: Users },
                { id: "billing" as const, label: "Billing & Plan", icon: CreditCard },
                { id: "settings" as const, label: "Settings", icon: Settings },
              ].map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActivePage(item.id)}
                    className={`w-full px-2.5 py-2 rounded-lg flex items-center gap-2.5 cursor-pointer transition ${
                      isActive
                        ? "font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                        : "font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* User Card */}
          <div className="p-3 border-t border-zinc-100 dark:border-white/5 flex items-center gap-2 bg-zinc-50/50 dark:bg-white/[0.02]">
            <div className="relative shrink-0">
              <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-800 dark:text-zinc-200">
                SJ
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0E0E10]" />
            </div>
            {!isSidebarCollapsed && (
              <div className="truncate text-xs">
                <p className="font-bold text-zinc-950 dark:text-white truncate">Sai Joshna</p>
                <p className="text-[10px] text-zinc-400 truncate">Owner</p>
              </div>
            )}
          </div>
        </aside>

        {/* =====================================================================
             2. GLOBAL TOP BAR & WORKSPACE MAIN CANVAS
        ===================================================================== */}
        <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-[#FAFAFA] dark:bg-[#09090B]">
          
          {/* Header */}
          <header className="h-14 border-b border-zinc-200/80 dark:border-white/10 px-4 sm:px-6 flex items-center justify-between bg-white dark:bg-[#0E0E10] shrink-0 z-10">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-zinc-500 dark:text-zinc-400">{workspace}</span>
              <span className="text-zinc-300 dark:text-zinc-600">/</span>
              <span className="font-bold text-zinc-950 dark:text-white capitalize">{activePage}</span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* ⌘K Trigger */}
              <button
                type="button"
                onClick={() => setIsCmdOpen(true)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quick search...</span>
                <span className="px-1.5 py-0.2 rounded font-sans text-[10px] font-bold bg-white dark:bg-white/10 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-white/5">
                  ⌘K
                </span>
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-1.5 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition cursor-pointer relative"
                >
                  <Bell className="w-4 h-4" />
                  {hasUnreadNotifs && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600 ring-1 ring-white dark:ring-[#0E0E10]" />
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 shadow-xl p-3 space-y-2 z-50 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/5">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">Notifications</span>
                      <button
                        type="button"
                        onClick={() => {
                          setHasUnreadNotifs(false);
                          setIsNotifOpen(false);
                          triggerToast("All notifications marked as read");
                        }}
                        className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      <div className="p-2 rounded-lg bg-zinc-50 dark:bg-white/5 space-y-0.5">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">Invoice #INV-9042 Paid</p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">₹1,25,000 received via RTGS.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Primary + New Invoice Button */}
              <button
                type="button"
                onClick={() => setIsCreateInvoiceOpen(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Invoice</span>
              </button>
            </div>
          </header>

          {/* Canvas Sub-views */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* 1. DASHBOARD VIEW */}
            {activePage === "dashboard" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-zinc-200/80 dark:border-white/10">
                  <div>
                    <h3 className="text-base font-bold text-zinc-950 dark:text-white">Executive Operations Hub</h3>
                    <p className="text-xs text-zinc-400">Live collections and institutional telemetry for {workspace}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActivePage("invoices")}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-white/10 border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100"
                    >
                      Inspect Invoices
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePage("pipeline")}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                    >
                      Pipeline Deals →
                    </button>
                  </div>
                </div>

                {/* 4-KPI Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs space-y-1">
                    <span className="text-xs text-zinc-400 font-medium">Total Billed</span>
                    <div className="text-2xl font-bold text-zinc-950 dark:text-white font-sans tabular-nums">
                      ₹{totalBilled.toLocaleString("en-IN")}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold font-sans tabular-nums">+18.4% MoM</span>
                  </div>

                  <div className="p-4 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs space-y-1">
                    <span className="text-xs text-zinc-400 font-medium">Paid Invoices</span>
                    <div className="text-2xl font-bold text-zinc-950 dark:text-white font-sans tabular-nums">
                      {paidCount} <span className="text-xs font-normal text-zinc-400">of {invoices.length}</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold font-sans tabular-nums">100% Reconciled</span>
                  </div>

                  <div className="p-4 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs space-y-1">
                    <span className="text-xs text-zinc-400 font-medium">Overdue Balance</span>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400 font-sans tabular-nums">
                      ₹{overdueBalance.toLocaleString("en-IN")}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setInvoiceFilter("Overdue");
                        setActivePage("invoices");
                      }}
                      className="text-[10px] text-red-600 font-semibold underline cursor-pointer"
                    >
                      Follow up client →
                    </button>
                  </div>

                  <div className="p-4 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs space-y-1">
                    <span className="text-xs text-zinc-400 font-medium">Open Pipeline Deals</span>
                    <div className="text-2xl font-bold text-zinc-950 dark:text-white font-sans tabular-nums">
                      {openDealsCount}
                    </div>
                    <span className="text-[10px] text-zinc-400 font-sans tabular-nums">Weighted ₹35.2L</span>
                  </div>
                </div>

                {/* 8/4 Asymmetric Chart & Activity Split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 p-5 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-bold text-zinc-950 dark:text-white text-sm">Monthly Collections</h4>
                        <p className="text-zinc-400 text-[11px]">H2 FY26 Automated Receipts</p>
                      </div>
                      <span className="font-bold font-sans tabular-nums text-xs bg-zinc-100 dark:bg-white/10 px-2.5 py-1 rounded-md">
                        ₹64.2L Total
                      </span>
                    </div>

                    <div className="h-36 flex items-end justify-between gap-3 pt-4 border-b border-zinc-100 dark:border-white/5">
                      {["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"].map((m, idx) => {
                        const heights = ["40%", "55%", "70%", "65%", "85%", "100%"];
                        const isLast = idx === 5;
                        return (
                          <div key={m} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                            <div
                              className={`w-full rounded-t transition-all ${
                                isLast ? "bg-zinc-950 dark:bg-white" : "bg-zinc-200 dark:bg-zinc-800"
                              }`}
                              style={{ height: heights[idx] }}
                            />
                            <span className="text-[10px] text-zinc-400 font-sans">{m}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span>Peak: November (₹16.5L)</span>
                      <span className="font-sans tabular-nums">GST Portal Validated</span>
                    </div>
                  </div>

                  <div className="lg:col-span-4 p-5 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs space-y-3">
                    <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-100 dark:border-white/5">
                      <h4 className="font-bold text-zinc-950 dark:text-white text-sm">Live Activity</h4>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="space-y-2 text-xs">
                      {invoices.slice(0, 4).map((inv) => (
                        <div key={inv.id} className="p-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 space-y-1">
                          <div className="flex justify-between font-bold">
                            <span className="truncate">{inv.client}</span>
                            <span className="font-sans tabular-nums">
                              {inv.status === "Paid" ? `₹${inv.amount.toLocaleString("en-IN")}` : inv.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-[10px] text-zinc-400">
                            <span>{inv.id}</span>
                            <span>{inv.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. CLIENT INVOICES VIEW */}
            {activePage === "invoices" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-white/5 rounded-xl border border-zinc-200/80 dark:border-white/10 text-xs">
                    {(["all", "Paid", "Pending", "Overdue"] as const).map((f) => {
                      const count = f === "all" ? invoices.length : invoices.filter((i) => i.status === f).length;
                      const isActive = invoiceFilter === f;
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setInvoiceFilter(f)}
                          className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                            isActive
                              ? "font-bold bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs"
                              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                          }`}
                        >
                          <span className="capitalize">{f}</span>
                          <span
                            className={`text-[10px] font-sans tabular-nums font-bold px-1.5 py-0.2 rounded-full ${
                              isActive ? "bg-zinc-100 dark:bg-white/10" : "bg-zinc-200 dark:bg-white/5"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative min-w-[220px]">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search client or ID..."
                      value={invoiceSearch}
                      onChange={(e) => setInvoiceSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                {/* Invoices Table */}
                <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-white/5 bg-zinc-50/60 dark:bg-white/[0.02] text-zinc-400 text-[11px]">
                        <th className="p-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={filteredInvoices.length > 0 && selectedInvoiceIds.length === filteredInvoices.length}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedInvoiceIds(filteredInvoices.map((i) => i.id));
                              else setSelectedInvoiceIds([]);
                            }}
                            className="rounded border-zinc-300 text-zinc-950 focus:ring-0 cursor-pointer"
                          />
                        </th>
                        <th className="py-3 px-3 font-semibold">Invoice ID</th>
                        <th className="py-3 px-3 font-semibold">Client Name</th>
                        <th className="py-3 px-3 font-semibold">Amount</th>
                        <th className="py-3 px-3 font-semibold">City</th>
                        <th className="py-3 px-3 font-semibold">Date</th>
                        <th className="py-3 px-3 font-semibold">Status</th>
                        <th className="py-3 px-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                      {filteredInvoices.map((inv) => {
                        const isSelected = selectedInvoiceIds.includes(inv.id);
                        const statusClass =
                          inv.status === "Paid"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : inv.status === "Pending"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300";

                        return (
                          <tr
                            key={inv.id}
                            className={`hover:bg-zinc-50/70 dark:hover:bg-white/[0.02] transition ${
                              isSelected ? "bg-zinc-50 dark:bg-white/5" : ""
                            }`}
                          >
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedInvoiceIds([...selectedInvoiceIds, inv.id]);
                                  else setSelectedInvoiceIds(selectedInvoiceIds.filter((id) => id !== inv.id));
                                }}
                                className="rounded border-zinc-300 text-zinc-950 focus:ring-0 cursor-pointer"
                              />
                            </td>
                            <td className="py-3 px-3 font-bold font-sans tabular-nums text-zinc-900 dark:text-zinc-100">
                              {inv.id}
                            </td>
                            <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{inv.client}</td>
                            <td className="py-3 px-3 font-bold font-sans tabular-nums">
                              ₹{inv.amount.toLocaleString("en-IN")}
                            </td>
                            <td className="py-3 px-3 text-zinc-500">{inv.city}</td>
                            <td className="py-3 px-3 font-sans tabular-nums text-zinc-400">{inv.date}</td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusClass}`}>
                                {inv.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => setInspectedInvoice(inv)}
                                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/15 text-zinc-900 dark:text-white transition cursor-pointer"
                              >
                                Inspect
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="p-3 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Showing {filteredInvoices.length} of {invoices.length} invoices</span>
                    <span className="font-sans tabular-nums">GST Compliant</span>
                  </div>
                </div>

                {/* Bulk Actions Floating Bar */}
                {selectedInvoiceIds.length > 0 && (
                  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-2xl flex items-center gap-4 text-xs">
                    <span className="font-bold font-sans tabular-nums">{selectedInvoiceIds.length} invoices selected</span>
                    <button
                      type="button"
                      onClick={() => {
                        setInvoices(
                          invoices.map((inv) =>
                            selectedInvoiceIds.includes(inv.id) ? { ...inv, status: "Paid" } : inv
                          )
                        );
                        triggerToast(`Marked ${selectedInvoiceIds.length} invoices as Paid`);
                        setSelectedInvoiceIds([]);
                      }}
                      className="font-semibold hover:underline cursor-pointer"
                    >
                      Mark Paid
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerToast(`Exported ${selectedInvoiceIds.length} invoices to CSV`);
                        setSelectedInvoiceIds([]);
                      }}
                      className="font-semibold hover:underline cursor-pointer"
                    >
                      Export CSV
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedInvoiceIds([])}
                      className="text-zinc-400 hover:text-white dark:hover:text-zinc-950 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3. PIPELINE KANBAN VIEW */}
            {activePage === "pipeline" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-white/10">
                  <div>
                    <h3 className="text-base font-bold text-zinc-950 dark:text-white">Deal Pipeline</h3>
                    <p className="text-xs text-zinc-400">Institutional contract progression for {workspace}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newDeal = {
                        id: `d_${Date.now()}`,
                        title: "Hyderabad Retail Cloud",
                        amount: 680000,
                        company: "Deccan Retail",
                        stage: "new",
                        desc: "Point of sale inventory telemetry contract",
                      };
                      setDeals([newDeal, ...deals]);
                      triggerToast("New deal added to pipeline");
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Deal</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "new", title: "New Leads" },
                    { id: "proposal", title: "Proposal Sent" },
                    { id: "won", title: "Closed Won" },
                  ].map((stage) => {
                    const stageDeals = deals.filter((d) => d.stage === stage.id);
                    return (
                      <div
                        key={stage.id}
                        className="p-3.5 rounded-2xl bg-zinc-100/70 dark:bg-white/[0.03] border border-zinc-200/70 dark:border-white/5 space-y-3"
                      >
                        <div className="flex items-center justify-between pb-1">
                          <span className="text-xs font-bold text-zinc-950 dark:text-white">{stage.title}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-zinc-200 dark:bg-white/10 font-sans tabular-nums">
                            {stageDeals.length}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {stageDeals.map((d) => (
                            <div
                              key={d.id}
                              className="p-3 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-xl shadow-xs space-y-2 text-xs"
                            >
                              <div className="flex justify-between items-start">
                                <span className="font-bold text-zinc-900 dark:text-zinc-100">{d.title}</span>
                                <span className="font-bold font-sans tabular-nums text-zinc-950 dark:text-white">
                                  ₹{d.amount.toLocaleString("en-IN")}
                                </span>
                              </div>
                              <p className="text-[11px] text-zinc-400">{d.desc}</p>
                              {stage.id !== "won" ? (
                                <div className="pt-1 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDeals(
                                        deals.map((deal) =>
                                          deal.id === d.id
                                            ? { ...deal, stage: stage.id === "new" ? "proposal" : "won" }
                                            : deal
                                        )
                                      );
                                      triggerToast(`Advanced "${d.title}" to next stage`);
                                    }}
                                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>Move Next</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <div className="pt-1 flex justify-end">
                                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    <span>Contract Won</span>
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. TEAM & ROLES VIEW */}
            {activePage === "team" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-white/10">
                  <div>
                    <h3 className="text-base font-bold text-zinc-950 dark:text-white">Team & Permissions</h3>
                    <p className="text-xs text-zinc-400">Manage member privileges for {workspace}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsInviteMemberOpen(true)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Invite Member</span>
                  </button>
                </div>

                <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden divide-y divide-zinc-100 dark:divide-white/5">
                  {team.map((m) => {
                    const presenceDot =
                      m.presence === "Online"
                        ? "bg-emerald-500"
                        : m.presence === "Away"
                        ? "bg-amber-500"
                        : "bg-zinc-400";
                    return (
                      <div key={m.id} className="p-4 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-800 dark:text-zinc-200">
                              {m.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <span
                              className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${presenceDot} ring-2 ring-white dark:ring-[#121215]`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-zinc-900 dark:text-zinc-100">{m.name}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300">
                                {m.role}
                              </span>
                            </div>
                            <span className="text-zinc-400 text-[11px]">{m.email}</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-zinc-400">{m.presence}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. BILLING & PLAN VIEW */}
            {activePage === "billing" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-2 border-b border-zinc-200/80 dark:border-white/10">
                  <h3 className="text-base font-bold text-zinc-950 dark:text-white">Billing & Plan Quota</h3>
                  <p className="text-xs text-zinc-400">Current subscription and monthly API limits</p>
                </div>

                <div className="p-5 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Plan</span>
                      <h4 className="text-lg font-bold text-zinc-950 dark:text-white mt-0.5">Enterprise Growth Tier</h4>
                      <p className="text-xs text-zinc-400">Next renewal on 15 Dec 2026 · Auto-debited from VISA •••• 4242</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-white/5 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">API Requests (Monthly)</span>
                        <span className="font-sans tabular-nums text-zinc-500">8,240 / 10,000</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-white/10 overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: "82.4%" }} />
                      </div>
                      <span className="text-[10px] text-zinc-400">Resets on 01 Dec 2026</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-white/5 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">Active Team Seats</span>
                        <span className="font-sans tabular-nums text-zinc-500">4 / 25 Allocated</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-white/10 overflow-hidden">
                        <div className="h-full bg-zinc-950 dark:bg-white rounded-full" style={{ width: "16%" }} />
                      </div>
                      <span className="text-[10px] text-zinc-400">21 seats available</span>
                    </div>
                  </div>
                </div>

                {/* 3-Tier Comparison */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-zinc-950 dark:text-white">Compare Available Tiers</h4>
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
                        <span className="text-[10px] font-bold px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Save 20%
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#121215] space-y-3">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Starter</span>
                      <div className="text-2xl font-bold font-sans tabular-nums">
                        {billingPeriod === "yearly" ? "₹999" : "₹1,299"}
                        <span className="text-xs text-zinc-400 font-normal">/mo</span>
                      </div>
                      <p className="text-xs text-zinc-400">For early-stage operations.</p>
                      <button type="button" className="w-full py-1.5 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-white/10">
                        Downgrade
                      </button>
                    </div>

                    <div className="p-4 rounded-xl border-2 border-zinc-950 dark:border-white bg-white dark:bg-[#121215] space-y-3 shadow-md relative">
                      <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                        Active Tier
                      </span>
                      <span className="text-xs font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                        Enterprise Growth
                      </span>
                      <div className="text-2xl font-bold font-sans tabular-nums">
                        {billingPeriod === "yearly" ? "₹2,499" : "₹2,999"}
                        <span className="text-xs text-zinc-400 font-normal">/mo</span>
                      </div>
                      <p className="text-xs text-zinc-400">Complete Tally Prime bridge & GST.</p>
                      <button type="button" className="w-full py-1.5 rounded-lg text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                        Manage Current
                      </button>
                    </div>

                    <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#121215] space-y-3">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Unlimited Scale</span>
                      <div className="text-2xl font-bold font-sans tabular-nums">
                        {billingPeriod === "yearly" ? "₹6,499" : "₹7,999"}
                        <span className="text-xs text-zinc-400 font-normal">/mo</span>
                      </div>
                      <p className="text-xs text-zinc-400">Dedicated account executive.</p>
                      <button type="button" className="w-full py-1.5 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-white/10">
                        Contact Sales
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. SETTINGS VIEW */}
            {activePage === "settings" && (
              <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
                <div className="pb-2 border-b border-zinc-200/80 dark:border-white/10">
                  <h3 className="text-base font-bold text-zinc-950 dark:text-white">Workspace Settings</h3>
                  <p className="text-xs text-zinc-400">Manage legal identification and organization preferences</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-4 space-y-1">
                    <h4 className="text-sm font-bold text-zinc-950 dark:text-white">Workspace Identity</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Configure your verified company title, legal GSTIN registration, and regional hub for tax compliance certificates.
                    </p>
                  </div>

                  <div className="md:col-span-8 p-5 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs space-y-4">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        triggerToast("Workspace settings saved successfully");
                      }}
                      className="space-y-3 text-xs"
                    >
                      <div>
                        <label className="font-semibold block text-zinc-700 dark:text-zinc-300 mb-1">Company Legal Name</label>
                        <input
                          type="text"
                          defaultValue="Zerorapid India Pvt Ltd"
                          className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block text-zinc-700 dark:text-zinc-300 mb-1">Registered GSTIN Number</label>
                        <input
                          type="text"
                          defaultValue="36AABCP1234F1Z5"
                          className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-zinc-900 dark:text-zinc-100 font-sans tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block text-zinc-700 dark:text-zinc-300 mb-1">Regional Headquarters</label>
                        <input
                          type="text"
                          value={workspace}
                          onChange={(e) => setWorkspace(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-white/5">
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* =====================================================================
             3. SLIDE-OVER DETAIL DRAWER
        ===================================================================== */}
        {inspectedInvoice && (
          <aside className="absolute right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white dark:bg-[#121215] border-l border-zinc-200 dark:border-white/10 z-40 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div className="p-5 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-zinc-950 dark:text-white font-sans tabular-nums">
                  {inspectedInvoice.id}
                </h4>
                <p className="text-xs text-zinc-400">{inspectedInvoice.client}</p>
              </div>
              <button
                type="button"
                onClick={() => setInspectedInvoice(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-medium">Payment State</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      inspectedInvoice.status === "Paid"
                        ? "bg-emerald-50 text-emerald-700"
                        : inspectedInvoice.status === "Pending"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {inspectedInvoice.status}
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-zinc-500 font-medium">Total Billed</span>
                  <span className="text-xl font-bold text-zinc-950 dark:text-white font-sans tabular-nums">
                    ₹{inspectedInvoice.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-zinc-400 text-[11px] block">Client City / Region</span>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">{inspectedInvoice.city}</p>
                </div>
                <div>
                  <span className="text-zinc-400 text-[11px] block">Invoice Issue Date</span>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 font-sans tabular-nums">
                    {inspectedInvoice.date}
                  </p>
                </div>
                <div>
                  <span className="text-zinc-400 text-[11px] block">Operational Audit Notes</span>
                  <p className="text-zinc-600 dark:text-zinc-300 text-[12px] leading-relaxed p-3 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 mt-1">
                    {inspectedInvoice.notes}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-zinc-100 dark:border-white/5 flex items-center gap-2 bg-zinc-50/50 dark:bg-white/[0.02]">
              <button
                type="button"
                onClick={() => triggerToast(`Generating PDF for ${inspectedInvoice.id}...`)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold border border-zinc-200/80 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInvoices(
                    invoices.map((inv) => (inv.id === inspectedInvoice.id ? { ...inv, status: "Paid" } : inv))
                  );
                  setInspectedInvoice({ ...inspectedInvoice, status: "Paid" });
                  triggerToast(`Invoice ${inspectedInvoice.id} marked as Paid`);
                }}
                disabled={inspectedInvoice.status === "Paid"}
                className="flex-1 py-2 rounded-lg text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{inspectedInvoice.status === "Paid" ? "Already Paid" : "Mark as Paid"}</span>
              </button>
            </div>
          </aside>
        )}

        {/* =====================================================================
             4. MODALS (CREATE INVOICE & INVITE MEMBER)
        ===================================================================== */}
        {isCreateInvoiceOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 dark:border-white/10">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Create Client Invoice</h4>
                <button
                  type="button"
                  onClick={() => setIsCreateInvoiceOpen(false)}
                  className="text-zinc-400 hover:text-zinc-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const newId = `#INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
                  setInvoices([
                    {
                      id: newId,
                      client: newInvClient,
                      amount: newInvAmount,
                      status: newInvStatus,
                      city: newInvCity,
                      date: "Today",
                      notes: newInvNotes,
                    },
                    ...invoices,
                  ]);
                  setIsCreateInvoiceOpen(false);
                  setNewInvClient("");
                  triggerToast(`Invoice ${newId} created successfully`);
                }}
                className="p-5 space-y-3 text-xs"
              >
                <div>
                  <label className="font-semibold block text-zinc-700 dark:text-zinc-300 mb-1">Client Entity Name</label>
                  <input
                    type="text"
                    required
                    value={newInvClient}
                    onChange={(e) => setNewInvClient(e.target.value)}
                    placeholder="e.g. Deccan FinTech Systems"
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block text-zinc-700 dark:text-zinc-300 mb-1">Amount (INR)</label>
                    <input
                      type="number"
                      required
                      value={newInvAmount}
                      onChange={(e) => setNewInvAmount(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 font-sans tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block text-zinc-700 dark:text-zinc-300 mb-1">Initial Status</label>
                    <select
                      value={newInvStatus}
                      onChange={(e) => setNewInvStatus(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-semibold block text-zinc-700 dark:text-zinc-300 mb-1">Operational City</label>
                  <input
                    type="text"
                    required
                    value={newInvCity}
                    onChange={(e) => setNewInvCity(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsCreateInvoiceOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs cursor-pointer"
                  >
                    Generate Invoice
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invite Member Modal */}
        {isInviteMemberOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 dark:border-white/10">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Invite Team Member</h4>
                <button
                  type="button"
                  onClick={() => setIsInviteMemberOpen(false)}
                  className="text-zinc-400 hover:text-zinc-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setTeam([
                    ...team,
                    {
                      id: `m_${Date.now()}`,
                      name: newMemberName,
                      email: newMemberEmail,
                      role: newMemberRole,
                      presence: "Online",
                    },
                  ]);
                  setIsInviteMemberOpen(false);
                  triggerToast(`Invitation sent to ${newMemberEmail}`);
                  setNewMemberName("");
                  setNewMemberEmail("");
                }}
                className="p-5 space-y-3 text-xs"
              >
                <div>
                  <label className="font-semibold block text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="e.g. Vikram Rao"
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-zinc-700 dark:text-zinc-300 mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="vikram@company.com"
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsInviteMemberOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs cursor-pointer"
                  >
                    Send Invite
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =====================================================================
             5. ⌘K COMMAND PALETTE
        ===================================================================== */}
        {isCmdOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 border-b border-zinc-100 dark:border-white/10 flex items-center gap-2.5">
                <Search className="w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  autoFocus
                  value={cmdSearch}
                  onChange={(e) => setCmdSearch(e.target.value)}
                  placeholder="Type a command or jump to page..."
                  className="w-full text-xs bg-transparent focus:outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
                />
                <button type="button" onClick={() => setIsCmdOpen(false)} className="text-zinc-400 hover:text-zinc-600 p-1 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-2 space-y-1 text-xs max-h-64 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIsCmdOpen(false);
                    setIsCreateInvoiceOpen(true);
                  }}
                  className="w-full px-3 py-2 rounded-lg flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-white/5 text-left font-medium cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5 text-blue-600" />
                    <span>Create New Invoice</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-sans">Action</span>
                </button>
                {[
                  { id: "dashboard" as const, label: "Jump to Dashboard Home", icon: LayoutDashboard },
                  { id: "invoices" as const, label: "Jump to Client Invoices", icon: FileText },
                  { id: "pipeline" as const, label: "Jump to Deal Pipeline", icon: Kanban },
                  { id: "team" as const, label: "Jump to Team & Roles", icon: Users },
                  { id: "billing" as const, label: "Jump to Billing & Plan", icon: CreditCard },
                  { id: "settings" as const, label: "Jump to Workspace Settings", icon: Settings },
                ]
                  .filter((item) => cmdSearch === "" || item.label.toLowerCase().includes(cmdSearch.toLowerCase()))
                  .map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActivePage(item.id);
                        setIsCmdOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-lg flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-white/5 text-left font-medium cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-sans">Navigation</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Floating Toast */}
        {toastMessage && (
          <div className="absolute bottom-5 right-5 z-50 px-4 py-3 rounded-xl bg-zinc-950 text-white shadow-2xl flex items-center gap-3 text-xs animate-in slide-in-from-bottom duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}

      </div>

      <CodeModal modal={activeCodeModal} onClose={() => setActiveCodeModal(null)} />
    </div>
  );
}
