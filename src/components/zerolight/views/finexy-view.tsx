"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Calendar,
  Mail,
  CreditCard,
  Users,
  Coins,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  Info,
  ChevronDown,
  ArrowRightLeft,
  ArrowUpRight,
  Plus,
  Filter,
  MoreHorizontal,
  Smartphone,
  Building,
  Plane,
  ShoppingCart,
  Code,
  Sun,
  Moon,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Download,
  X,
} from "lucide-react";
import {
  ZeroLightProvider,
  ZeroLightTokens,
  useZeroLight,
} from "@/components/zerolight";
import {
  Badge,
  Avatar,
  PaymentCard,
  CurrencyPill,
} from "@/components/zerolight/atoms";
import {
  ProfitLossChart,
} from "@/components/zerolight/molecules";
import { DetailDrawer } from "@/components/zerolight/organisms";

// Design tokens tuned specifically for Finexy SaaS FinTech
const FINEXY_TOKENS: ZeroLightTokens = {
  scaleMultiplier: 1.0,
  universalBorderColor: "#E2E8F0",
  universalFillColor: "#FFFFFF",
  textIconColor: "#0F172A",
  primaryButtonColor: "#84CC16", // Lime green accent from screenshot
  hoverBackplateTint: "#F8FAFC",
  borderWidth: 1,
  cornerRadius: 24,
  heightDensity: 44,
  menuOffsetGap: 8,
  fontSize: 14,
  motionPhysics: "damped",
  iconScaleMultiplier: 1.0,
  iconStrokeWidth: 2.0,
  iconFill: "none",
  iconColor: "#84CC16",
};

interface Transaction {
  id: string;
  orderId: string;
  title: string;
  category: "app" | "hotel" | "flight" | "grocery" | "software";
  price: string;
  amount: number;
  status: "Completed" | "Pending" | "In Progress";
  date: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    orderId: "INV_000076",
    title: "Mobile App Purchase",
    category: "app",
    price: "$25,500",
    amount: 25500,
    status: "Completed",
    date: "17 Apr, 2026 03:45 PM",
  },
  {
    id: "tx-2",
    orderId: "INV_000075",
    title: "Hotel Booking",
    category: "hotel",
    price: "$32,750",
    amount: 32750,
    status: "Pending",
    date: "15 Apr, 2026 11:30 AM",
  },
  {
    id: "tx-3",
    orderId: "INV_000074",
    title: "Flight Ticket Booking",
    category: "flight",
    price: "$40,200",
    amount: 40200,
    status: "Completed",
    date: "15 Apr, 2026 12:00 PM",
  },
  {
    id: "tx-4",
    orderId: "INV_000073",
    title: "Grocery Purchase",
    category: "grocery",
    price: "$50,200",
    amount: 50200,
    status: "In Progress",
    date: "14 Apr, 2026 09:15 PM",
  },
  {
    id: "tx-5",
    orderId: "INV_000072",
    title: "Software License",
    category: "software",
    price: "$15,900",
    amount: 15900,
    status: "Completed",
    date: "10 Apr, 2026 06:00 AM",
  },
];

export default function FinexyPage() {
  return (
    <ZeroLightProvider tokens={FINEXY_TOKENS}>
      <FinexyDashboardInner />
    </ZeroLightProvider>
  );
}

export function FinexyDashboardInner() {
  const { tokens, scaled } = useZeroLight();
  const [activeNavTab, setActiveNavTab] = useState("Overview");
  const [activeRailItem, setActiveRailItem] = useState("dashboard");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedTxIds, setSelectedTxIds] = useState<string[]>(["tx-4"]);
  const [selectedTxForDetail, setSelectedTxForDetail] = useState<Transaction | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferRecipient, setTransferRecipient] = useState("");
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return INITIAL_TRANSACTIONS.filter((tx) => {
      const matchesSearch =
        tx.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || tx.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const toggleSelectTx = (id: string) => {
    setSelectedTxIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTxIds.length === filteredTransactions.length) {
      setSelectedTxIds([]);
    } else {
      setSelectedTxIds(filteredTransactions.map((tx) => tx.id));
    }
  };

  const getCategoryIcon = (category: Transaction["category"]) => {
    switch (category) {
      case "app":
        return <Smartphone className="w-4 h-4 text-blue-600" />;
      case "hotel":
        return <Building className="w-4 h-4 text-sky-600" />;
      case "flight":
        return <Plane className="w-4 h-4 text-indigo-600" />;
      case "grocery":
        return <ShoppingCart className="w-4 h-4 text-amber-600" />;
      case "software":
        return <Code className="w-4 h-4 text-rose-600" />;
      default:
        return <CreditCard className="w-4 h-4 text-neutral-600" />;
    }
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Completed
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Pending
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            In Progress
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-neutral-900 font-sans p-2 sm:p-5 flex flex-col justify-between">
      {/* Top Banner Navigation back to ZeroLight Design Studio */}
      <div className="max-w-[1520px] mx-auto w-full mb-3 flex items-center justify-between text-xs text-neutral-500 px-2">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            ZeroLight Studio
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="font-semibold text-neutral-800">Finexy SaaS FinTech Redesign</span>
          <Badge variant="neutral">ZeroLight v2.0</Badge>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-neutral-500 text-xs font-medium">Anti-Crowding & Copywriting Guardrails Active</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
        </div>
      </div>

      {/* Main SaaS Shell Canvas */}
      <div
        style={{
          borderRadius: "32px",
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.08)",
        }}
        className="max-w-[1520px] mx-auto w-full bg-[#FAFAFA] border border-neutral-200/90 overflow-hidden flex flex-col md:flex-row min-h-[920px]"
      >
        {/* ==================== LEFT ICON RAIL ==================== */}
        <aside className="w-full md:w-20 bg-white border-b md:border-b-0 md:border-r border-neutral-200/80 p-3 flex md:flex-col items-center justify-between shrink-0">
          {/* Top: Sun / Moon Mode Switch */}
          <div className="flex flex-col items-center gap-4">
            <div className="bg-neutral-100 p-1 rounded-2xl flex md:flex-col gap-1 border border-neutral-200/60">
              <button
                type="button"
                onClick={() => setThemeMode("light")}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  themeMode === "light"
                    ? "bg-white text-neutral-900 shadow-2xs font-medium"
                    : "text-neutral-400 hover:text-neutral-700"
                }`}
                title="Light Mode"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setThemeMode("dark")}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  themeMode === "dark"
                    ? "bg-neutral-900 text-white shadow-2xs font-medium"
                    : "text-neutral-400 hover:text-neutral-700"
                }`}
                title="Dark Mode"
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Icons Stack */}
            <nav className="flex md:flex-col items-center gap-1.5 md:pt-4">
              {[
                { id: "dashboard", icon: LayoutGrid, label: "Dashboard" },
                { id: "calendar", icon: Calendar, label: "Schedule" },
                { id: "mail", icon: Mail, label: "Inbox" },
                { id: "cards", icon: CreditCard, label: "Cards" },
                { id: "users", icon: Users, label: "Team" },
                { id: "coins", icon: Coins, label: "Wallets" },
                { id: "settings", icon: Settings, label: "Settings" },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeRailItem === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveRailItem(item.id)}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                      isActive
                        ? "bg-neutral-900 text-white shadow-sm"
                        : "text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100"
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Rail Actions: Help & Logout */}
          <div className="flex md:flex-col items-center gap-2 pt-2">
            <button
              type="button"
              className="w-10 h-10 rounded-xl text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer"
              title="Help & Support"
            >
              <HelpCircle className="w-5 h-5 stroke-[1.8]" />
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-xl text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>
        </aside>

        {/* ==================== MAIN DASHBOARD BODY ==================== */}
        <main className="flex-1 flex flex-col p-4 sm:p-7 overflow-x-hidden">
          {/* Top Bar: Brand Logo, Segmented Tabs & Profile Menu */}
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-neutral-200/70">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#15803D] flex items-center justify-center text-white shadow-sm font-bold text-lg">
                <span className="tracking-tighter">↗</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-900">
                Finexy
              </span>
            </div>

            {/* Segmented Control Navigation Tabs */}
            <div className="overflow-x-auto pb-1 lg:pb-0">
              <div className="bg-neutral-100/90 p-1 rounded-2xl flex items-center gap-1 border border-neutral-200/60 shadow-2xs">
                {[
                  "Overview",
                  "Activity",
                  "Manage",
                  "Program",
                  "Account",
                  "Reports",
                ].map((tab) => {
                  const isActive = activeNavTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveNavTab(tab)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "bg-neutral-900 text-white shadow-sm"
                          : "text-neutral-600 hover:text-neutral-900 hover:bg-white/60"
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Header Utilities & User Profile */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 flex items-center justify-center transition-colors cursor-pointer shadow-2xs relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                title="System Info"
              >
                <Info className="w-4 h-4" />
              </button>

              {/* User Profile Pill */}
              <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-neutral-200 bg-white shadow-2xs cursor-pointer hover:border-neutral-300 transition-colors">
                <Avatar
                  initials="OS"
                  size="sm"
                  status="online"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-neutral-900 leading-tight">
                    Oripio Studio
                  </div>
                  <div className="text-[10px] text-neutral-400 leading-tight truncate max-w-[110px]">
                    oripiostudio@gmail...
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </div>
            </div>
          </header>

          {/* Greeting Hero Section */}
          <section className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                Good morning, Oripio
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Stay on top of your tasks, monitor progress, and track status.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="healthy">Live Vault Active</Badge>
              <span className="text-xs text-neutral-400 font-sans tabular-nums">UTC+05:30</span>
            </div>
          </section>

          {/* ==================== 3-COLUMN DASHBOARD GRID ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* -------------------- COLUMN 1: WALLETS & CARDS (col-span-12 lg:col-span-4) -------------------- */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              {/* Card 1: Total Balance & Wallets */}
              <div
                style={{
                  borderRadius: "24px",
                  borderColor: tokens.universalBorderColor,
                }}
                className="bg-white border p-5 shadow-2xs flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500 tracking-wide uppercase">
                    Total Balance
                  </span>
                  {/* Currency Dropdown Selector */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neutral-200 text-xs font-semibold text-neutral-700 bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      <span>🇺🇸 {selectedCurrency}</span>
                      <ChevronDown className="w-3 h-3 text-neutral-400" />
                    </button>
                    {currencyDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-28 bg-white border border-neutral-200 rounded-xl shadow-lg z-20 py-1">
                        {["USD", "EUR", "GBP", "CAD", "JPY"].map((curr) => (
                          <button
                            key={curr}
                            type="button"
                            onClick={() => {
                              setSelectedCurrency(curr);
                              setCurrencyDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-neutral-100 text-neutral-800 flex items-center justify-between"
                          >
                            <span>{curr}</span>
                            {selectedCurrency === curr && (
                              <span className="text-emerald-600 font-bold">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Big Balance Number */}
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 tabular-nums">
                    $689,372.00
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-emerald-600">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>↑ 5% than last month</span>
                  </div>
                </div>

                {/* Transfer & Request Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsTransferModalOpen(true)}
                    style={{
                      backgroundColor: tokens.primaryButtonColor,
                      borderRadius: "16px",
                    }}
                    className="h-11 px-4 font-bold text-xs text-neutral-900 flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span>Transfer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTransferModalOpen(true)}
                    style={{
                      borderRadius: "16px",
                      borderColor: tokens.universalBorderColor,
                    }}
                    className="h-11 px-4 font-bold text-xs text-neutral-800 bg-neutral-50/80 border hover:bg-neutral-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 stroke-[2.2] rotate-90" />
                    <span>Request</span>
                  </button>
                </div>

                {/* Horizontal Wallets Pills */}
                <div className="pt-2 border-t border-neutral-100">
                  <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold mb-2.5">
                    <span>Wallets</span>
                    <span className="text-[11px] text-neutral-400 font-normal">Total 6 wallets</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    <CurrencyPill
                      flag="🇺🇸"
                      currencyCode="USD"
                      balance="$22,678.00"
                      monthlyLimit="Limit is $10k a month"
                      status="Active"
                    />
                    <CurrencyPill
                      flag="🇪🇺"
                      currencyCode="EUR"
                      balance="€18,345.00"
                      monthlyLimit="Limit is €6k a month"
                      status="Active"
                    />
                    <CurrencyPill
                      flag="🇬🇧"
                      currencyCode="GBP"
                      balance="£15,000.00"
                      monthlyLimit="Limit is £7.5k a month"
                      status="Inactive"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Monthly Spending Limit */}
              <div
                style={{
                  borderRadius: "24px",
                  borderColor: tokens.universalBorderColor,
                }}
                className="bg-white border p-5 shadow-2xs flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-800 tracking-tight">
                    Monthly Spending Limit
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    25.4% spent
                  </span>
                </div>
                {/* Progress track */}
                <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: "25.4%" }}
                    className="bg-[#15803D] h-full rounded-full transition-all duration-500"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">
                    <strong className="text-neutral-900 tabular-nums font-bold">$1,400.00</strong> spent out of
                  </span>
                  <span className="text-neutral-900 tabular-nums font-bold">$5,500.00</span>
                </div>
              </div>

              {/* Card 3: My Cards Stack */}
              <div
                style={{
                  borderRadius: "24px",
                  borderColor: tokens.universalBorderColor,
                }}
                className="bg-white border p-5 shadow-2xs flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-neutral-700" />
                    <span className="text-xs font-bold text-neutral-800 tracking-tight">
                      My Cards
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddCardModalOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add new</span>
                  </button>
                </div>

                {/* Horizontal scrollable cards */}
                <div className="flex gap-3 overflow-x-auto pb-1 pt-1">
                  <PaymentCard
                    last4="6782"
                    expiry="09/29"
                    cvv="611"
                    cardholderName="Oripio Studio"
                    brand="mastercard"
                    variant="dark"
                    status="active"
                  />
                  <PaymentCard
                    last4="4356"
                    expiry="11/28"
                    cvv="402"
                    cardholderName="Oripio Vault"
                    brand="visa"
                    variant="gradient"
                    status="active"
                  />
                </div>
              </div>
            </div>

            {/* -------------------- COLUMN 2: 2x2 METRICS & RECENT ACTIVITIES (col-span-12 lg:col-span-5) -------------------- */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              {/* 2x2 Metric Cards Grid */}
              <div className="grid grid-cols-2 gap-3.5">
                {/* Total Earnings - Featured Green Card */}
                <div
                  style={{
                    borderRadius: "20px",
                    background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                  }}
                  className="p-4 text-white shadow-sm flex flex-col justify-between h-32 transform-gpu hover:scale-[1.01] transition-transform select-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-emerald-100">
                      Total Earnings
                    </span>
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                      <Coins className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums">
                      $950
                    </div>
                    <div className="text-[11px] font-medium text-emerald-100 mt-1 flex items-center gap-1">
                      <span>↑ 7% This month</span>
                    </div>
                  </div>
                </div>

                {/* Total Spending - White Card */}
                <div
                  style={{
                    borderRadius: "20px",
                    borderColor: tokens.universalBorderColor,
                  }}
                  className="bg-white border p-4 shadow-2xs flex flex-col justify-between h-32 hover:border-neutral-300 transition-colors select-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-500">
                      Total Spending
                    </span>
                    <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 tabular-nums">
                      $700
                    </div>
                    <div className="text-[11px] font-medium text-rose-600 mt-1 flex items-center gap-1">
                      <span>↓ 5% This month</span>
                    </div>
                  </div>
                </div>

                {/* Total Income - White Card */}
                <div
                  style={{
                    borderRadius: "20px",
                    borderColor: tokens.universalBorderColor,
                  }}
                  className="bg-white border p-4 shadow-2xs flex flex-col justify-between h-32 hover:border-neutral-300 transition-colors select-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-500">
                      Total Income
                    </span>
                    <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 tabular-nums">
                      $1,050
                    </div>
                    <div className="text-[11px] font-medium text-emerald-600 mt-1 flex items-center gap-1">
                      <span>↑ 8% This month</span>
                    </div>
                  </div>
                </div>

                {/* Total Revenue - White Card */}
                <div
                  style={{
                    borderRadius: "20px",
                    borderColor: tokens.universalBorderColor,
                  }}
                  className="bg-white border p-4 shadow-2xs flex flex-col justify-between h-32 hover:border-neutral-300 transition-colors select-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-500">
                      Total Revenue
                    </span>
                    <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 tabular-nums">
                      $850
                    </div>
                    <div className="text-[11px] font-medium text-emerald-600 mt-1 flex items-center gap-1">
                      <span>↑ 4% This month</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activities Interactive Table Card */}
              <div
                style={{
                  borderRadius: "24px",
                  borderColor: tokens.universalBorderColor,
                }}
                className="bg-white border p-5 shadow-2xs flex flex-col gap-4 flex-1"
              >
                {/* Header & Search / Filter Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
                      Recent Activities
                    </h2>
                    <p className="text-[11px] text-neutral-400">
                      Click any row to view ledger details & receipt
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8 pl-8 pr-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-hidden focus:bg-white focus:border-neutral-400 transition-colors w-32 sm:w-40"
                      />
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          const next = statusFilter === "All" ? "Completed" : statusFilter === "Completed" ? "Pending" : "All";
                          setStatusFilter(next);
                        }}
                        className="h-8 px-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Filter className="w-3 h-3 text-neutral-500" />
                        <span>{statusFilter === "All" ? "Filter" : statusFilter}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table Component */}
                <div className="overflow-x-auto -mx-5 px-5">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-100 text-neutral-400 text-[11px] font-semibold uppercase tracking-wider">
                        <th className="py-2.5 pr-2 w-7">
                          <input
                            type="checkbox"
                            checked={
                              filteredTransactions.length > 0 &&
                              selectedTxIds.length === filteredTransactions.length
                            }
                            onChange={toggleSelectAll}
                            className="rounded border-neutral-300 text-neutral-900 focus:ring-0 cursor-pointer"
                          />
                        </th>
                        <th className="py-2.5 px-2">Order ID</th>
                        <th className="py-2.5 px-2">Activity</th>
                        <th className="py-2.5 px-2">Price</th>
                        <th className="py-2.5 px-2">Status</th>
                        <th className="py-2.5 px-2">Date</th>
                        <th className="py-2.5 pl-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {filteredTransactions.map((tx) => {
                        const isSelected = selectedTxIds.includes(tx.id);
                        return (
                          <tr
                            key={tx.id}
                            onClick={() => setSelectedTxForDetail(tx)}
                            className={`group hover:bg-neutral-50 transition-colors cursor-pointer ${
                              isSelected ? "bg-neutral-50/80" : ""
                            }`}
                          >
                            <td
                              className="py-3 pr-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSelectTx(tx.id);
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectTx(tx.id)}
                                className="rounded border-neutral-300 text-neutral-900 focus:ring-0 cursor-pointer"
                              />
                            </td>
                            <td className="py-3 px-2 font-sans font-medium text-neutral-600 tabular-nums">
                              {tx.orderId}
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                                  {getCategoryIcon(tx.category)}
                                </div>
                                <span className="font-semibold text-neutral-800 line-clamp-1">
                                  {tx.title}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-2 font-bold text-neutral-900 tabular-nums">
                              {tx.price}
                            </td>
                            <td className="py-3 px-2 whitespace-nowrap">
                              {getStatusBadge(tx.status)}
                            </td>
                            <td className="py-3 px-2 text-neutral-500 whitespace-nowrap tabular-nums text-[11px]">
                              {tx.date}
                            </td>
                            <td className="py-3 pl-2 text-right">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTxForDetail(tx);
                                }}
                                className="text-neutral-400 hover:text-neutral-700 p-1 rounded cursor-pointer"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* -------------------- COLUMN 3: PROFIT & LOSS CHART (col-span-12 lg:col-span-3) -------------------- */}
            <div className="lg:col-span-3 flex flex-col gap-5">
              {/* Dual-Series Profit & Loss Stacked Bar Chart */}
              <ProfitLossChart
                title="Total Income"
                subtitle="View your income in a certain period of time"
                profitColor="#84CC16" // Lime green from image
                lossColor="#18181B"   // Dark slate/black from image
              />

              {/* Quick Card: Security & Verification Audit */}
              <div
                style={{
                  borderRadius: "24px",
                  borderColor: tokens.universalBorderColor,
                }}
                className="bg-white border p-5 shadow-2xs flex flex-col gap-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-neutral-900">
                      Vault Protection Active
                    </h3>
                    <p className="text-[10px] text-neutral-500">
                      PCI-DSS v4.0 Level 1 Verified
                    </p>
                  </div>
                </div>
                <div className="text-[11px] text-neutral-600 leading-relaxed bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                  Real-time fraud guard is actively monitoring 6 international wallets with instant settlement rails.
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ==================== PROGRESSIVE DISCLOSURE DRAWER ==================== */}
      <DetailDrawer
        isOpen={!!selectedTxForDetail}
        onClose={() => setSelectedTxForDetail(null)}
        title={selectedTxForDetail ? `Invoice Details: ${selectedTxForDetail.orderId}` : "Invoice Details"}
        subtitle="Comprehensive audit trace and transaction receipt."
        footer={
          <div className="flex items-center justify-between gap-3 w-full">
            <button
              type="button"
              onClick={() => setSelectedTxForDetail(null)}
              className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              Close
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => alert(`Receipt downloaded for ${selectedTxForDetail?.orderId}`)}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Receipt</span>
              </button>
            </div>
          </div>
        }
      >
        {selectedTxForDetail && (
          <div className="flex flex-col gap-5 py-2">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-neutral-500">Amount Paid</span>
                <div className="text-2xl font-black text-neutral-900 tabular-nums">
                  {selectedTxForDetail.price}
                </div>
              </div>
              <div>{getStatusBadge(selectedTxForDetail.status)}</div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-500 font-medium">Activity Category</span>
                <span className="font-semibold text-neutral-800 capitalize">
                  {selectedTxForDetail.category}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-500 font-medium">Merchant / Destination</span>
                <span className="font-semibold text-neutral-800">
                  {selectedTxForDetail.title}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-500 font-medium">Timestamp</span>
                <span className="font-sans font-medium text-neutral-700 tabular-nums">
                  {selectedTxForDetail.date}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-500 font-medium">Payment Method</span>
                <span className="font-semibold text-neutral-800">
                  Mastercard •••• 6782
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-500 font-medium">Reference Code</span>
                <span className="font-sans tabular-nums text-[11px] text-neutral-500">
                  REF-{selectedTxForDetail.orderId}-9941
                </span>
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* ==================== TRANSFER MODAL ==================== */}
      <AnimatePresence>
        {isTransferModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={scaled.motionConfig.modalTransition}
              style={{
                borderRadius: `${scaled.scaledCardRadius}px`,
                borderColor: tokens.universalBorderColor,
                backgroundColor: tokens.universalFillColor,
              }}
              className="w-full max-w-md p-6 border shadow-2xl space-y-5 select-none"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">Initiate Fund Transfer</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Transfer capital securely via FedNow / SEPA rails.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsTransferModalOpen(false);
                    setTransferSuccess(false);
                  }}
                  className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 py-2 text-xs">
                {transferSuccess ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-1">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <div className="font-bold text-sm">Transfer Dispatched Successfully!</div>
                    <div className="text-xs text-emerald-600">Settling via instant FedNow / SEPA rails.</div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">Recipient Account / IBAN</label>
                      <input
                        type="text"
                        placeholder="e.g. US94 0001 2026 4488 91"
                        value={transferRecipient}
                        onChange={(e) => setTransferRecipient(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">Transfer Amount ($ USD)</label>
                      <input
                        type="number"
                        placeholder="e.g. 5000"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-800 tabular-nums"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsTransferModalOpen(false);
                    setTransferSuccess(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTransferSuccess(true);
                    setTimeout(() => {
                      setIsTransferModalOpen(false);
                      setTransferSuccess(false);
                    }, 1500);
                  }}
                  style={{
                    backgroundColor: tokens.primaryButtonColor,
                  }}
                  className="px-5 py-2 rounded-xl text-neutral-900 text-xs font-bold hover:brightness-105"
                >
                  Confirm Transfer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== ADD CARD MODAL ==================== */}
      <AnimatePresence>
        {isAddCardModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={scaled.motionConfig.modalTransition}
              style={{
                borderRadius: `${scaled.scaledCardRadius}px`,
                borderColor: tokens.universalBorderColor,
                backgroundColor: tokens.universalFillColor,
              }}
              className="w-full max-w-md p-6 border shadow-2xl space-y-5 select-none"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">Issue New Virtual Card</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Generate an encrypted corporate spending card.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddCardModalOpen(false)}
                  className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 py-2 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    defaultValue="Oripio Studio"
                    className="w-full h-10 px-3 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Network</label>
                    <select className="w-full h-10 px-3 rounded-xl border border-neutral-300 text-xs text-neutral-900 bg-white">
                      <option>Mastercard World Elite</option>
                      <option>Visa Infinite</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Monthly Limit</label>
                    <input
                      type="text"
                      defaultValue="$10,000"
                      className="w-full h-10 px-3 rounded-xl border border-neutral-300 text-xs text-neutral-900 tabular-nums"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddCardModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert("Virtual card issued and added to your wallet!");
                    setIsAddCardModalOpen(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800"
                >
                  Issue Virtual Card
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
