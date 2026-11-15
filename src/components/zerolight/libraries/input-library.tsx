"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Check,
  Copy,
  ChevronDown,
  Calendar as CalendarIcon,
  Clock,
  Globe,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Plus,
  Minus,
  X,
  Code2,
  SlidersHorizontal,
  Sparkles,
  Wand2,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  UploadCloud,
  FileText,
  MapPin,
  Mic,
  Tag,
  Hash,
  DollarSign,
  Maximize2,
  List,
  Bold,
  Italic,
  QrCode,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useZeroLight } from "../context";
import { Kbd } from "../atoms/kbd";
import { Badge } from "../atoms/badge";
import { LibraryHeader, CodeModal } from "./common";

export type InputDensityTier = "28px" | "36px" | "44px" | "52px";
export type InputGlobalState = "idle" | "checking" | "verified" | "warning" | "error" | "disabled" | "readonly";
export type InputLabelLayout = "top" | "small-top" | "side" | "hidden";

export function SaaSInputFieldLibrary() {
  const { tokens } = useZeroLight();

  // Global Sticky Bar State
  const [searchQuery, setSearchQuery] = useState("");
  const [density, setDensity] = useState<InputDensityTier>("36px");
  const [globalState, setGlobalState] = useState<InputGlobalState>("idle");
  const [labelLayout, setLabelLayout] = useState<InputLabelLayout>("top");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Sticky Bar Popover Controls
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [layoutDropdownOpen, setLayoutDropdownOpen] = useState(false);

  // Modal Code State
  const [activeCodeModal, setActiveCodeModal] = useState<{ title: string; code: string } | null>(null);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Interactive Variant States
  // Category 1
  const [simpleText, setSimpleText] = useState("Acme Enterprise");
  const [titleEditing, setTitleEditing] = useState(false);
  const [projectTitle, setProjectTitle] = useState("Q4 Inventory Upgrade");
  const [slugText, setSlugText] = useState("hyderabad-team");
  const [password, setPassword] = useState("Zerolight@2026");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["4", "8", "2", "9", "1", "0"]);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const [apiKeyVal, setApiKeyVal] = useState("sk_live_98a7f6d5e4c3b2a1");

  // Category 2
  const [seatCount, setSeatCount] = useState(25);
  const [currencyAmount, setCurrencyAmount] = useState("1,00,000");
  const [selectedCurrency, setSelectedCurrency] = useState("₹ INR");
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [taxPercent, setTaxPercent] = useState("18");
  const [weightVal, setWeightVal] = useState("450");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [weightDropdownOpen, setWeightDropdownOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("5000");
  const [maxPrice, setMaxPrice] = useState("50000");
  const [gstin, setGstin] = useState("36AABCU9603R1ZM");

  // Category 3
  const [emailIconInput, setEmailIconInput] = useState("contact@zerolight.io");
  const [barcodeVal, setBarcodeVal] = useState("8901030456128");
  const [urlPath, setUrlPath] = useState("zerolight.io/dashboard");
  const [apiMethod, setApiMethod] = useState("POST");
  const [apiMethodOpen, setApiMethodOpen] = useState(false);
  const [apiPath, setApiPath] = useState("/v1/telemetry/nodes");
  const [timeUnitVal, setTimeUnitVal] = useState("14");
  const [timeUnitName, setTimeUnitName] = useState("Days");
  const [timeUnitOpen, setTimeUnitOpen] = useState(false);
  const [categoryFilterName, setCategoryFilterName] = useState("Production");
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false);
  const [categorySearchVal, setCategorySearchVal] = useState("");

  // Category 4
  const [cmdSearchVal, setCmdSearchVal] = useState("");
  const [filterBadges, setFilterBadges] = useState(["Status: Active", "Role: Admin"]);
  const [badgeSearchText, setBadgeSearchText] = useState("");
  const [tagChips, setTagChips] = useState(["React", "TypeScript", "Tailwind"]);
  const [tagInputText, setTagInputText] = useState("");
  const [smartRule, setSmartRule] = useState("country == 'India' AND latency < 20ms");
  const [columnFilter, setColumnFilter] = useState("");
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceText, setVoiceText] = useState("Show me all active enterprise tenants");

  // Category 5
  const [selectedDate, setSelectedDate] = useState("2026-11-15");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [rangeStart, setRangeStart] = useState<number | null>(4);
  const [rangeEnd, setRangeEnd] = useState<number | null>(18);
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("02:30 PM");
  const [timeSlotOpen, setTimeSlotOpen] = useState(false);
  const [quickDatePreset, setQuickDatePreset] = useState("7D");
  const [selectedTimezone, setSelectedTimezone] = useState("UTC (GMT+0)");
  const [timezoneOpen, setTimezoneOpen] = useState(false);

  // Category 6
  const [dialCode, setDialCode] = useState("🇮🇳 +91");
  const [dialCodeOpen, setDialCodeOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("98765 43210");
  const [streetAddress, setStreetAddress] = useState("Suite 400, Innovation Tower, Financial District");
  const [pinCode, setPinCode] = useState("500032");
  const [cityDetected, setCityDetected] = useState("Hyderabad, TG");
  const [latVal, setLatVal] = useState("17.4399° N");
  const [longVal, setLongVal] = useState("78.3489° E");
  const [recipientEmails, setRecipientEmails] = useState(["lead@corp.io", "sec@corp.io"]);
  const [emailTagDraft, setEmailTagDraft] = useState("");

  // Category 7
  const [autoGrowingNote, setAutoGrowingNote] = useState("ZeroLight Tactile Calm architecture reduces visual fatigue during extended multi-hour operational shifts.");
  const [charLimitText, setCharLimitText] = useState("ZeroLight eliminates all gratuitous gradients, rainbow badges, and decorative noise.");
  const [richTextDraft, setRichTextDraft] = useState("This text supports bolding, italicizing, and bullet point markers.");

  // Category 8
  const [aiPrompt, setAiPrompt] = useState("Generate an enterprise billing summary dashboard with 4 KPI cards and a profit/loss area chart");
  const [plainFilter, setPlainFilter] = useState("Show users who logged in last 24 hours from Frankfurt region");
  const [polishDraft, setPolishDraft] = useState("our system works good and fast with low latency");

  // Category 9
  const [uploadedFileName, setUploadedFileName] = useState("enterprise_contract_v2.pdf");
  const [colorHex, setColorHex] = useState("#10B981");

  // Category 10
  const [workspaceId, setWorkspaceId] = useState("zl_corp_node_091");

  // Click outside to dismiss all custom popovers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-dd-root]")) {
        setStateDropdownOpen(false);
        setLayoutDropdownOpen(false);
        setCurrencyDropdownOpen(false);
        setWeightDropdownOpen(false);
        setApiMethodOpen(false);
        setTimeUnitOpen(false);
        setCategoryFilterOpen(false);
        setCalendarOpen(false);
        setDateRangeOpen(false);
        setTimeSlotOpen(false);
        setTimezoneOpen(false);
        setDialCodeOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Compute Height Style from Density
  const heightStyle = {
    height: density,
  };

  // Compute Border & Ring Style based on Global State
  const getStateClass = () => {
    if (globalState === "checking") return "border-indigo-400 ring-2 ring-indigo-100";
    if (globalState === "verified") return "border-emerald-500 ring-2 ring-emerald-100";
    if (globalState === "warning") return "border-amber-400 ring-2 ring-amber-100";
    if (globalState === "error") return "border-rose-500 ring-2 ring-rose-100";
    if (globalState === "disabled") return "opacity-50 cursor-not-allowed bg-zinc-100 border-zinc-200";
    if (globalState === "readonly") return "bg-zinc-50/70 border-zinc-200 cursor-default";
    return "border-zinc-200 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950 bg-white";
  };

  const categories = [
    { id: "all", label: "All (44)" },
    { id: "cat1", label: "1. Basic & Login" },
    { id: "cat2", label: "2. Numbers & Money" },
    { id: "cat3", label: "3. Prefixes & Dropdowns" },
    { id: "cat4", label: "4. Search & Tags" },
    { id: "cat5", label: "5. Date & Times" },
    { id: "cat6", label: "6. Country & Address" },
    { id: "cat7", label: "7. Multi-Line" },
    { id: "cat8", label: "8. AI Assistants" },
    { id: "cat9", label: "9. Files & Color" },
    { id: "cat10", label: "10. Status Preview" },
  ];

  // OTP auto-advance handler
  const handleOtpChange = (index: number, val: string) => {
    const digit = val.slice(-1);
    const updated = [...otp];
    updated[index] = digit;
    setOtp(updated);
    if (digit && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  // Card Container Component
  const InputCard = ({
    number,
    title,
    label,
    category,
    code,
    children,
  }: {
    number: string;
    title: string;
    label: string;
    category: string;
    code: string;
    children: React.ReactNode;
  }) => {
    if (searchQuery.trim() && !title.toLowerCase().includes(searchQuery.toLowerCase())) return null;

    return (
      <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs flex flex-col justify-between gap-3.5 transition-all hover:border-zinc-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-sans tabular-nums font-bold text-zinc-400">{number}</span>
            <h4 className="text-xs font-bold text-zinc-900 tracking-tight">{title}</h4>
          </div>
          <button
            type="button"
            onClick={() => setActiveCodeModal({ title, code })}
            className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-zinc-950 px-2 py-1 rounded-lg hover:bg-zinc-100 transition cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
        </div>

        {/* Layout Rendering: Top / Small Top / Side / Hidden */}
        <div className={labelLayout === "side" ? "grid grid-cols-1 sm:grid-cols-3 gap-2 items-center" : "space-y-1.5"}>
          {labelLayout !== "hidden" && (
            <label
              className={
                labelLayout === "small-top"
                  ? "text-[10px] font-bold uppercase tracking-wider text-zinc-400 block"
                  : labelLayout === "side"
                  ? "text-xs font-semibold text-zinc-700 truncate block"
                  : "text-xs font-semibold text-zinc-800 block"
              }
            >
              {label}
            </label>
          )}
          <div className={labelLayout === "side" ? "sm:col-span-2 w-full" : "w-full"}>{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-semibold shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── WORKSPACE CONTROL STRIP ── */}
      <LibraryHeader
        countText="44 Input Variants Active"
        description="Live validation, conjoined prefixes, and keyboard navigation."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search inputs..."
        action={
          <div className="flex items-center gap-2">
            {/* Global State Selector (Custom Popover) */}
            <div className="relative" data-dd-root>
              <button
                type="button"
                onClick={() => {
                  setStateDropdownOpen(!stateDropdownOpen);
                  setLayoutDropdownOpen(false);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-zinc-800 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-zinc-200/60 dark:hover:bg-white/10 transition cursor-pointer"
              >
                <span>State: <strong className="capitalize text-zinc-950 dark:text-white">{globalState}</strong></span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {stateDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-40 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/10 shadow-xl p-1 z-50 text-xs animate-in fade-in duration-150">
                  {(["idle", "checking", "verified", "warning", "error", "disabled", "readonly"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setGlobalState(s);
                        setStateDropdownOpen(false);
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left capitalize font-semibold cursor-pointer ${
                        globalState === s ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Label Layout Selector (Custom Popover) */}
            <div className="relative" data-dd-root>
              <button
                type="button"
                onClick={() => {
                  setLayoutDropdownOpen(!layoutDropdownOpen);
                  setStateDropdownOpen(false);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-zinc-800 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-zinc-200/60 dark:hover:bg-white/10 transition cursor-pointer"
              >
                <span>Label: <strong className="capitalize text-zinc-950 dark:text-white">{labelLayout}</strong></span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {layoutDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/10 shadow-xl p-1 z-50 text-xs animate-in fade-in duration-150">
                  {(["top", "small-top", "side", "hidden"] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => {
                        setLabelLayout(l);
                        setLayoutDropdownOpen(false);
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left capitalize font-semibold cursor-pointer ${
                        labelLayout === l ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        }
      />

      {/* ── 1. BASIC TEXT & LOGIN INPUTS ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            1. Basic Text & Login Inputs
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Single-line text, email validation, password masks, and authentication fields.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputCard
          number="01"
          title="Simple Text Box"
          label="Company Name"
          category="cat1"
          code={`<input className="w-full px-3.5 rounded-xl border border-zinc-200 text-xs" value="${simpleText}" />`}
        >
          <div className={`rounded-xl border transition-all ${getStateClass()}`} style={heightStyle}>
            <input
              type="text"
              value={simpleText}
              disabled={globalState === "disabled"}
              readOnly={globalState === "readonly"}
              onChange={(e) => setSimpleText(e.target.value)}
              className="w-full h-full px-3.5 bg-transparent text-xs text-zinc-950 focus:outline-none"
            />
          </div>
        </InputCard>

        <InputCard
          number="02"
          title="Click-to-Edit Title"
          label="Project Title"
          category="cat1"
          code={`<div onClick={() => setEditing(true)} className="flex items-center justify-between px-3.5 border rounded-xl">\n  <span>{title}</span>\n  <Edit2 className="w-3.5 h-3.5" />\n</div>`}
        >
          <div className={`rounded-xl border transition-all px-3.5 flex items-center justify-between ${getStateClass()}`} style={heightStyle}>
            {titleEditing ? (
              <input
                type="text"
                autoFocus
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                onBlur={() => setTitleEditing(false)}
                onKeyDown={(e) => e.key === "Enter" && setTitleEditing(false)}
                className="w-full bg-transparent text-xs font-bold text-zinc-950 focus:outline-none"
              />
            ) : (
              <div
                onClick={() => setTitleEditing(true)}
                className="flex items-center justify-between w-full cursor-pointer group"
              >
                <span className="text-xs font-bold text-zinc-950 truncate">{projectTitle}</span>
                <Edit2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-950 transition" />
              </div>
            )}
          </div>
        </InputCard>

        <InputCard
          number="03"
          title="Website Link Input"
          label="Workspace Slug"
          category="cat1"
          code={`<div className="flex rounded-xl border">\n  <input className="px-3" value="${slugText}" />\n  <span className="px-3 bg-zinc-100 text-zinc-400">.app.com</span>\n</div>`}
        >
          <div className={`rounded-xl border overflow-hidden flex items-center transition-all ${getStateClass()}`} style={heightStyle}>
            <input
              type="text"
              value={slugText}
              disabled={globalState === "disabled"}
              readOnly={globalState === "readonly"}
              onChange={(e) => setSlugText(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              className="flex-1 px-3.5 bg-transparent text-xs text-zinc-950 focus:outline-none font-sans"
            />
            <span className="px-3 text-xs text-zinc-400 bg-zinc-50 border-l border-zinc-200 font-sans tabular-nums select-none flex items-center h-full">
              .app.com
            </span>
          </div>
        </InputCard>

        <InputCard
          number="04"
          title="Password with Show Button"
          label="Password"
          category="cat1"
          code={`<div className="relative rounded-xl border">\n  <input type={show ? "text" : "password"} />\n  <button onClick={() => setShow(!show)}>Show</button>\n  <div className="h-1 bg-emerald-500 rounded-b-xl" />\n</div>`}
        >
          <div className="space-y-1">
            <div className={`rounded-xl border px-3 flex items-center justify-between transition-all relative ${getStateClass()}`} style={heightStyle}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                disabled={globalState === "disabled"}
                readOnly={globalState === "readonly"}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-xs text-zinc-950 focus:outline-none pr-8 font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {/* Live Password Strength Indicator Bar */}
            <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden flex gap-0.5">
              <div className="h-full flex-1 bg-emerald-500" />
              <div className="h-full flex-1 bg-emerald-500" />
              <div className="h-full flex-1 bg-emerald-500" />
              <div className="h-full flex-1 bg-zinc-200" />
            </div>
          </div>
        </InputCard>

        <InputCard
          number="05"
          title="6-Digit Verification Code"
          label="Security Code"
          category="cat1"
          code={`<div className="flex gap-2">\n  {otp.map(d => <input key={d} className="w-9 h-10 text-center font-bold" />)}\n</div>`}
        >
          <div className="flex items-center gap-1.5 justify-between">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={otpRefs[idx]}
                type="text"
                maxLength={1}
                value={digit}
                disabled={globalState === "disabled"}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                style={heightStyle}
                className="w-10 rounded-xl border border-zinc-200 bg-white text-center font-sans tabular-nums text-xs font-bold text-zinc-950 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 shadow-2xs"
              />
            ))}
          </div>
        </InputCard>

        <InputCard
          number="06"
          title="Copyable Secret Key"
          label="API Secret Key"
          category="cat1"
          code={`<div className="flex rounded-xl border">\n  <input readOnly value="${apiKeyVal}" />\n  <button onClick={copy}>Copy</button>\n</div>`}
        >
          <div className={`rounded-xl border overflow-hidden flex items-center transition-all ${getStateClass()}`} style={heightStyle}>
            <input
              type="text"
              readOnly
              value={apiKeyVal}
              className="flex-1 px-3.5 bg-transparent text-xs text-zinc-950 font-sans tabular-nums focus:outline-none select-all"
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(apiKeyVal);
                triggerToast("API Key copied to clipboard");
              }}
              className="px-3 text-xs font-semibold text-zinc-600 hover:text-zinc-950 bg-zinc-50 border-l border-zinc-200 h-full flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>
        </InputCard>
        </div>
      </section>

      {/* ── 2. NUMBERS, MONEY & TAX INPUTS ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            2. Numbers, Money & Tax Inputs
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Currency formats, decimal precision, numeric steppers, and tax percentages.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputCard
          number="07"
          title="Stepper Counter"
          label="User Seats"
          category="cat2"
          code={`<div className="flex items-center justify-between border rounded-xl px-2">\n  <button onClick={dec}><Minus className="w-3.5 h-3.5" /></button>\n  <span className="tabular-nums">{seats}</span>\n  <button onClick={inc}><Plus className="w-3.5 h-3.5" /></button>\n</div>`}
        >
          <div className={`rounded-xl border px-2 flex items-center justify-between transition-all ${getStateClass()}`} style={heightStyle}>
            <button
              type="button"
              onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
              className="w-7 h-7 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-600 transition cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-sans tabular-nums text-xs font-bold text-zinc-950">{seatCount}</span>
            <button
              type="button"
              onClick={() => setSeatCount(seatCount + 1)}
              className="w-7 h-7 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-600 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </InputCard>

        <InputCard
          number="08"
          title="Custom Currency Money Input"
          label="Total Amount"
          category="cat2"
          code={`<div className="flex rounded-xl border" data-dd-root>\n  <button onClick={toggle}>{currency}</button>\n  <input value="${currencyAmount}" />\n</div>`}
        >
          <div className={`rounded-xl border flex items-center transition-all relative ${getStateClass()}`} style={heightStyle} data-dd-root>
            <button
              type="button"
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="px-3 text-xs font-semibold text-zinc-900 border-r border-zinc-200 h-full flex items-center gap-1 bg-zinc-50 hover:bg-zinc-100 rounded-l-xl cursor-pointer"
            >
              <span>{selectedCurrency}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-32 rounded-xl bg-white border border-zinc-200 shadow-xl p-1 z-50 text-xs animate-in fade-in duration-150">
                {["₹ INR", "$ USD", "€ EUR", "£ GBP", "AED"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setSelectedCurrency(c);
                      setCurrencyDropdownOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            <input
              type="text"
              value={currencyAmount}
              onChange={(e) => setCurrencyAmount(e.target.value)}
              className="flex-1 px-3 bg-transparent text-xs text-right font-sans tabular-nums font-semibold text-zinc-950 focus:outline-none"
            />
          </div>
        </InputCard>

        <InputCard
          number="09"
          title="Tax / Discount Percentage"
          label="GST Rate"
          category="cat2"
          code={`<div className="flex rounded-xl border">\n  <input value="${taxPercent}" />\n  <span className="px-3">%</span>\n</div>`}
        >
          <div className={`rounded-xl border flex items-center justify-between px-3 transition-all ${getStateClass()}`} style={heightStyle}>
            <input
              type="text"
              value={taxPercent}
              onChange={(e) => setTaxPercent(e.target.value)}
              className="flex-1 bg-transparent text-xs font-sans tabular-nums font-semibold text-zinc-950 focus:outline-none"
            />
            <span className="text-xs font-bold text-zinc-400 font-sans">%</span>
          </div>
        </InputCard>

        <InputCard
          number="10"
          title="Weight & Unit Picker"
          label="Package Weight"
          category="cat2"
          code={`<div className="flex rounded-xl border" data-dd-root>\n  <input value="${weightVal}" />\n  <button>{unit}</button>\n</div>`}
        >
          <div className={`rounded-xl border flex items-center transition-all relative ${getStateClass()}`} style={heightStyle} data-dd-root>
            <input
              type="text"
              value={weightVal}
              onChange={(e) => setWeightVal(e.target.value)}
              className="flex-1 px-3 bg-transparent text-xs font-sans tabular-nums font-semibold text-zinc-950 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setWeightDropdownOpen(!weightDropdownOpen)}
              className="px-3 text-xs font-semibold text-zinc-700 border-l border-zinc-200 h-full flex items-center gap-1 bg-zinc-50 hover:bg-zinc-100 rounded-r-xl cursor-pointer"
            >
              <span>{weightUnit}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {weightDropdownOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-28 rounded-xl bg-white border border-zinc-200 shadow-xl p-1 z-50 text-xs animate-in fade-in duration-150">
                {["kg", "tons", "lbs", "boxes"].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => {
                      setWeightUnit(u);
                      setWeightDropdownOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                  >
                    {u}
                  </button>
                ))}
              </div>
            )}
          </div>
        </InputCard>

        <InputCard
          number="11"
          title="Min to Max Price Range"
          label="Price Range (₹)"
          category="cat2"
          code={`<div className="flex items-center gap-2">\n  <input placeholder="Min" />\n  <span>—</span>\n  <input placeholder="Max" />\n</div>`}
        >
          <div className="flex items-center gap-2">
            <div className={`rounded-xl border flex-1 px-2.5 flex items-center ${getStateClass()}`} style={heightStyle}>
              <span className="text-[10px] text-zinc-400 mr-1.5 font-bold">Min</span>
              <input
                type="text"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-transparent text-xs font-sans tabular-nums font-semibold text-zinc-950 focus:outline-none"
              />
            </div>
            <span className="text-zinc-400 text-xs font-bold">—</span>
            <div className={`rounded-xl border flex-1 px-2.5 flex items-center ${getStateClass()}`} style={heightStyle}>
              <span className="text-[10px] text-zinc-400 mr-1.5 font-bold">Max</span>
              <input
                type="text"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-transparent text-xs font-sans tabular-nums font-semibold text-zinc-950 focus:outline-none"
              />
            </div>
          </div>
        </InputCard>

        <InputCard
          number="12"
          title="GST Number Box"
          label="Company GSTIN"
          category="cat2"
          code={`<div className="flex rounded-xl border">\n  <span className="px-2.5 font-bold">GST</span>\n  <input value="${gstin}" />\n</div>`}
        >
          <div className={`rounded-xl border flex items-center overflow-hidden transition-all ${getStateClass()}`} style={heightStyle}>
            <span className="px-3 bg-zinc-50 border-r border-zinc-200 text-[10px] font-bold text-zinc-500 font-sans tracking-wider h-full flex items-center">
              GST
            </span>
            <input
              type="text"
              maxLength={15}
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              className="flex-1 px-3 bg-transparent text-xs font-sans tabular-nums font-bold text-zinc-950 focus:outline-none tracking-wide"
            />
          </div>
        </InputCard>
        </div>
      </section>

      {/* ── 3. ICONS, PREFIXES & CUSTOM DROPDOWN INPUTS ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            3. Icons, Prefixes & Custom Dropdowns
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Domain URL pre-fills, leading icon triggers, and currency selectors.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputCard
          number="13"
          title="Email with Left Icon"
          label="Corporate Email"
          category="cat3"
          code={`<div className="flex items-center px-3 border rounded-xl">\n  <Mail className="w-4 h-4" />\n  <input value="${emailIconInput}" />\n</div>`}
        >
          <div className={`rounded-xl border px-3 flex items-center gap-2.5 transition-all ${getStateClass()}`} style={heightStyle}>
            <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <input
              type="email"
              value={emailIconInput}
              onChange={(e) => setEmailIconInput(e.target.value)}
              className="w-full bg-transparent text-xs text-zinc-950 focus:outline-none"
            />
          </div>
        </InputCard>

        <InputCard
          number="14"
          title="Barcode & Clear Input"
          label="Serial Number"
          category="cat3"
          code={`<div className="flex items-center px-3 border rounded-xl">\n  <QrCode />\n  <input value="${barcodeVal}" />\n  <button onClick={clear}><X /></button>\n</div>`}
        >
          <div className={`rounded-xl border px-3 flex items-center gap-2 transition-all ${getStateClass()}`} style={heightStyle}>
            <QrCode className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={barcodeVal}
              onChange={(e) => setBarcodeVal(e.target.value)}
              className="w-full bg-transparent text-xs font-sans tabular-nums text-zinc-950 focus:outline-none"
            />
            {barcodeVal && (
              <button
                type="button"
                onClick={() => setBarcodeVal("")}
                className="text-zinc-400 hover:text-zinc-700 cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </InputCard>

        <InputCard
          number="15"
          title="Website URL Prefix"
          label="Target Hostname"
          category="cat3"
          code={`<div className="flex border rounded-xl">\n  <span className="px-3">https://</span>\n  <input value="${urlPath}" />\n</div>`}
        >
          <div className={`rounded-xl border flex items-center overflow-hidden transition-all ${getStateClass()}`} style={heightStyle}>
            <span className="px-3 bg-zinc-50 border-r border-zinc-200 text-xs font-semibold text-zinc-400 font-sans select-none h-full flex items-center">
              https://
            </span>
            <input
              type="text"
              value={urlPath}
              onChange={(e) => setUrlPath(e.target.value)}
              className="flex-1 px-3 bg-transparent text-xs text-zinc-950 focus:outline-none"
            />
          </div>
        </InputCard>

        <InputCard
          number="16"
          title="Custom Action Type + Path"
          label="API Endpoint"
          category="cat3"
          code={`<div className="flex border rounded-xl" data-dd-root>\n  <button>{method}</button>\n  <input value="${apiPath}" />\n</div>`}
        >
          <div className={`rounded-xl border flex items-center transition-all relative ${getStateClass()}`} style={heightStyle} data-dd-root>
            <button
              type="button"
              onClick={() => setApiMethodOpen(!apiMethodOpen)}
              className="px-2.5 text-[11px] font-bold text-zinc-800 border-r border-zinc-200 h-full flex items-center gap-1 bg-zinc-50 hover:bg-zinc-100 rounded-l-xl cursor-pointer"
            >
              <span>{apiMethod}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {apiMethodOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-28 rounded-xl bg-white border border-zinc-200 shadow-xl p-1 z-50 text-xs animate-in fade-in duration-150">
                {["GET", "POST", "PUT", "DELETE"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setApiMethod(m);
                      setApiMethodOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left font-bold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}

            <input
              type="text"
              value={apiPath}
              onChange={(e) => setApiPath(e.target.value)}
              className="flex-1 px-3 bg-transparent text-xs font-sans text-zinc-950 focus:outline-none"
            />
          </div>
        </InputCard>

        <InputCard
          number="17"
          title="Number + Custom Time Unit"
          label="Retention Policy"
          category="cat3"
          code={`<div className="flex border rounded-xl" data-dd-root>\n  <input value="${timeUnitVal}" />\n  <button>{unit}</button>\n</div>`}
        >
          <div className={`rounded-xl border flex items-center transition-all relative ${getStateClass()}`} style={heightStyle} data-dd-root>
            <input
              type="text"
              value={timeUnitVal}
              onChange={(e) => setTimeUnitVal(e.target.value)}
              className="flex-1 px-3 bg-transparent text-xs font-sans tabular-nums font-semibold text-zinc-950 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setTimeUnitOpen(!timeUnitOpen)}
              className="px-3 text-xs font-semibold text-zinc-700 border-l border-zinc-200 h-full flex items-center gap-1 bg-zinc-50 hover:bg-zinc-100 rounded-r-xl cursor-pointer"
            >
              <span>{timeUnitName}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {timeUnitOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-32 rounded-xl bg-white border border-zinc-200 shadow-xl p-1 z-50 text-xs animate-in fade-in duration-150">
                {["Days", "Weeks", "Months", "Years"].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => {
                      setTimeUnitName(u);
                      setTimeUnitOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                  >
                    {u}
                  </button>
                ))}
              </div>
            )}
          </div>
        </InputCard>

        <InputCard
          number="18"
          title="Category Filter + Search"
          label="Search Scope"
          category="cat3"
          code={`<div className="flex border rounded-xl" data-dd-root>\n  <button>{category}</button>\n  <input placeholder="Search..." />\n</div>`}
        >
          <div className={`rounded-xl border flex items-center transition-all relative ${getStateClass()}`} style={heightStyle} data-dd-root>
            <button
              type="button"
              onClick={() => setCategoryFilterOpen(!categoryFilterOpen)}
              className="px-2.5 text-xs font-semibold text-zinc-800 border-r border-zinc-200 h-full flex items-center gap-1 bg-zinc-50 hover:bg-zinc-100 rounded-l-xl cursor-pointer"
            >
              <span>{categoryFilterName}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {categoryFilterOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-36 rounded-xl bg-white border border-zinc-200 shadow-xl p-1 z-50 text-xs animate-in fade-in duration-150">
                {["Production", "Staging", "Dev Cluster", "Archived"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCategoryFilterName(c);
                      setCategoryFilterOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            <input
              type="text"
              placeholder="Search scope..."
              value={categorySearchVal}
              onChange={(e) => setCategorySearchVal(e.target.value)}
              className="flex-1 px-3 bg-transparent text-xs text-zinc-950 focus:outline-none"
            />
          </div>
        </InputCard>
        </div>
      </section>

      {/* ── 4. SEARCH BARS & TAG INPUTS ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            4. Search Bars & Tag Inputs
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Filter inputs, tokenizers, auto-complete search, and multi-tag fields.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputCard
          number="19"
          title="Quick Command Search"
          label="Omni-Search"
          category="cat4"
          code={`<div className="flex items-center justify-between px-3 border rounded-xl">\n  <Search className="w-4 h-4" />\n  <input placeholder="Search commands..." />\n  <Kbd>⌘K</Kbd>\n</div>`}
        >
          <div className={`rounded-xl border px-3 flex items-center justify-between transition-all ${getStateClass()}`} style={heightStyle}>
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <input
                type="text"
                placeholder="Search commands or files..."
                value={cmdSearchVal}
                onChange={(e) => setCmdSearchVal(e.target.value)}
                className="w-full bg-transparent text-xs text-zinc-950 focus:outline-none"
              />
            </div>
            <Kbd>⌘K</Kbd>
          </div>
        </InputCard>

        <InputCard
          number="20"
          title="Filter Badge Search"
          label="Active Filters"
          category="cat4"
          code={`<div className="flex items-center gap-1.5 px-2 border rounded-xl overflow-x-auto">\n  {badges.map(b => <span key={b}>{b} ×</span>)}\n  <input placeholder="Add filter..." />\n</div>`}
        >
          <div className={`rounded-xl border px-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar transition-all ${getStateClass()}`} style={heightStyle}>
            {filterBadges.map((badge, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-lg bg-zinc-100 text-zinc-800 text-[10px] font-semibold flex items-center gap-1 shrink-0"
              >
                <span>{badge}</span>
                <button
                  type="button"
                  onClick={() => setFilterBadges(filterBadges.filter((_, i) => i !== idx))}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="+ Add filter"
              value={badgeSearchText}
              onChange={(e) => setBadgeSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && badgeSearchText.trim()) {
                  setFilterBadges([...filterBadges, badgeSearchText.trim()]);
                  setBadgeSearchText("");
                }
              }}
              className="min-w-[70px] bg-transparent text-xs text-zinc-950 focus:outline-none"
            />
          </div>
        </InputCard>

        <InputCard
          number="21"
          title="Addable Tag Chips"
          label="Technology Stack"
          category="cat4"
          code={`<div className="flex items-center gap-1.5 px-2 border rounded-xl">\n  {tags.map(t => <span>{t}</span>)}\n  <input onKeyDown={e => e.key === 'Enter' && addTag()} />\n</div>`}
        >
          <div className={`rounded-xl border px-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar transition-all ${getStateClass()}`} style={heightStyle}>
            {tagChips.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-zinc-950 text-white text-[10px] font-semibold flex items-center gap-1 shrink-0"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => setTagChips(tagChips.filter((_, i) => i !== idx))}
                  className="hover:text-rose-400 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Type & press Enter"
              value={tagInputText}
              onChange={(e) => setTagInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && tagInputText.trim()) {
                  setTagChips([...tagChips, tagInputText.trim()]);
                  setTagInputText("");
                }
              }}
              className="min-w-[90px] bg-transparent text-xs text-zinc-950 focus:outline-none"
            />
          </div>
        </InputCard>

        <InputCard
          number="22"
          title="Smart Rule Search"
          label="Rule Expression"
          category="cat4"
          code={`<div className="flex items-center px-3 border rounded-xl">\n  <Tag className="w-3.5 h-3.5" />\n  <input value="${smartRule}" />\n</div>`}
        >
          <div className={`rounded-xl border px-3 flex items-center gap-2 transition-all ${getStateClass()}`} style={heightStyle}>
            <Tag className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <input
              type="text"
              value={smartRule}
              onChange={(e) => setSmartRule(e.target.value)}
              className="w-full bg-transparent text-xs font-sans tabular-nums text-zinc-950 focus:outline-none"
            />
          </div>
        </InputCard>

        <InputCard
          number="23"
          title="Compact Table Column Search"
          label="Table Header Filter"
          category="cat4"
          code={`<input className="px-2 py-1 text-[11px] rounded-lg border" placeholder="Filter..." />`}
        >
          <div className={`rounded-lg border px-2.5 flex items-center transition-all ${getStateClass()}`} style={{ height: "28px" }}>
            <input
              type="text"
              placeholder="Quick column filter..."
              value={columnFilter}
              onChange={(e) => setColumnFilter(e.target.value)}
              className="w-full bg-transparent text-[11px] text-zinc-950 focus:outline-none"
            />
          </div>
        </InputCard>

        <InputCard
          number="24"
          title="Voice Search Bar"
          label="Voice Dictation"
          category="cat4"
          code={`<div className="flex items-center px-3 border rounded-xl">\n  <input value="${voiceText}" />\n  <button onClick={toggleMic}><Mic /></button>\n</div>`}
        >
          <div className={`rounded-xl border px-3 flex items-center justify-between transition-all ${getStateClass()}`} style={heightStyle}>
            <input
              type="text"
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
              className="w-full bg-transparent text-xs text-zinc-950 focus:outline-none pr-2"
            />
            <button
              type="button"
              onClick={() => {
                setIsVoiceRecording(!isVoiceRecording);
                triggerToast(isVoiceRecording ? "Voice listening paused" : "Voice listening active (speak now)");
              }}
              className={`p-1 rounded-lg transition cursor-pointer ${
                isVoiceRecording ? "bg-rose-100 text-rose-600 animate-pulse" : "text-zinc-400 hover:text-zinc-950"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>
        </InputCard>
        </div>
      </section>

      {/* ── 5. CUSTOM DATE, CALENDAR & TIME PICKERS ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            5. Custom Date, Calendar & Time Pickers
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Date selection, calendar popups, range spans, and time scheduling.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputCard
          number="25"
          title="Custom Calendar Date Picker"
          label="Scheduled Date"
          category="cat5"
          code={`<div data-dd-root>\n  <button onClick={toggle}>{date}</button>\n  {calendarOpen && <Custom30DayCalendarGrid />}\n</div>`}
        >
          <div className="relative" data-dd-root>
            <button
              type="button"
              style={heightStyle}
              onClick={() => setCalendarOpen(!calendarOpen)}
              className={`w-full rounded-xl border px-3 flex items-center justify-between transition-all cursor-pointer ${getStateClass()}`}
            >
              <span className="text-xs font-sans tabular-nums font-semibold text-zinc-900">{selectedDate}</span>
              <CalendarIcon className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            {calendarOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-64 rounded-2xl bg-white border border-zinc-200 shadow-2xl p-3 z-50 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 mb-2">
                  <span className="text-xs font-bold text-zinc-950">November 2026</span>
                  <Badge variant="neutral">30 Days</Badge>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center font-sans tabular-nums text-[10px]">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <span key={i} className="text-zinc-400 font-bold py-1">{d}</span>
                  ))}
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        setSelectedDate(`2026-11-${String(day).padStart(2, "0")}`);
                        setCalendarOpen(false);
                        triggerToast(`Date picked: Nov ${day}, 2026`);
                      }}
                      className={`h-7 rounded-lg font-semibold flex items-center justify-center transition cursor-pointer ${
                        day === 15 ? "bg-zinc-950 text-white font-bold" : "text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </InputCard>

        <InputCard
          number="26"
          title="Custom Date Range Picker"
          label="Billing Period"
          category="cat5"
          code={`<div data-dd-root>\n  <button onClick={toggle}>{rangeStart} to {rangeEnd}</button>\n</div>`}
        >
          <div className="relative" data-dd-root>
            <button
              type="button"
              style={heightStyle}
              onClick={() => setDateRangeOpen(!dateRangeOpen)}
              className={`w-full rounded-xl border px-3 flex items-center justify-between transition-all cursor-pointer ${getStateClass()}`}
            >
              <span className="text-xs font-sans tabular-nums font-semibold text-zinc-900">
                Nov {rangeStart || 1} — Nov {rangeEnd || 30}, 2026
              </span>
              <CalendarIcon className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            {dateRangeOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-64 rounded-2xl bg-white border border-zinc-200 shadow-2xl p-3 z-50 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 mb-2">
                  <span className="text-xs font-bold text-zinc-950">Select Range</span>
                  <span className="text-[10px] text-zinc-500 font-sans tabular-nums">2-Click Range</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center font-sans tabular-nums text-[10px]">
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                    const isSelected = day === rangeStart || day === rangeEnd;
                    const inRange = rangeStart && rangeEnd && day > rangeStart && day < rangeEnd;
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          if (!rangeStart || (rangeStart && rangeEnd)) {
                            setRangeStart(day);
                            setRangeEnd(null);
                          } else {
                            if (day >= rangeStart) setRangeEnd(day);
                            else {
                              setRangeEnd(rangeStart);
                              setRangeStart(day);
                            }
                            setDateRangeOpen(false);
                            triggerToast(`Date range set: Nov ${rangeStart} - Nov ${day}`);
                          }
                        }}
                        className={`h-7 rounded-lg font-semibold flex items-center justify-center transition cursor-pointer ${
                          isSelected
                            ? "bg-zinc-950 text-white font-bold"
                            : inRange
                            ? "bg-zinc-100 text-zinc-900"
                            : "text-zinc-700 hover:bg-zinc-100"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </InputCard>

        <InputCard
          number="27"
          title="Custom Time Slot Picker"
          label="Appointment Slot"
          category="cat5"
          code={`<div data-dd-root>\n  <button onClick={toggle}>{timeSlot}</button>\n  {timeSlotOpen && <CustomTimeSlotsList />}\n</div>`}
        >
          <div className="relative" data-dd-root>
            <button
              type="button"
              style={heightStyle}
              onClick={() => setTimeSlotOpen(!timeSlotOpen)}
              className={`w-full rounded-xl border px-3 flex items-center justify-between transition-all cursor-pointer ${getStateClass()}`}
            >
              <span className="text-xs font-sans tabular-nums font-semibold text-zinc-900">{selectedTimeSlot}</span>
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            {timeSlotOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-48 max-h-48 overflow-y-auto no-scrollbar rounded-xl bg-white border border-zinc-200 shadow-2xl p-1 z-50 text-xs font-sans tabular-nums animate-in fade-in duration-150">
                {[
                  "09:00 AM",
                  "09:30 AM",
                  "10:00 AM",
                  "10:30 AM",
                  "11:00 AM",
                  "01:00 PM",
                  "02:00 PM",
                  "02:30 PM",
                  "04:00 PM",
                  "05:30 PM",
                  "08:00 PM",
                ].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      setSelectedTimeSlot(slot);
                      setTimeSlotOpen(false);
                      triggerToast(`Time slot selected: ${slot}`);
                    }}
                    className={`w-full px-3 py-1.5 rounded-lg text-left font-semibold cursor-pointer ${
                      selectedTimeSlot === slot ? "bg-zinc-950 text-white" : "text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        </InputCard>

        <InputCard
          number="28"
          title="Quick Date Preset Buttons"
          label="Telemetry Window"
          category="cat5"
          code={`<div className="flex gap-1.5">\n  {['1D', '7D', '3M', 'YTD'].map(p => <button key={p}>{p}</button>)}\n</div>`}
        >
          <div className="flex items-center gap-1.5 w-full">
            {["1D", "7D", "3M", "YTD"].map((p) => (
              <button
                key={p}
                type="button"
                style={heightStyle}
                onClick={() => {
                  setQuickDatePreset(p);
                  triggerToast(`Telemetry range set to ${p}`);
                }}
                className={`flex-1 rounded-xl text-xs font-sans tabular-nums font-semibold transition cursor-pointer ${
                  quickDatePreset === p
                    ? "bg-zinc-950 text-white shadow-xs font-bold"
                    : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </InputCard>

        <InputCard
          number="29"
          title="Date & Custom Timezone Picker"
          label="Event Timezone"
          category="cat5"
          code={`<div className="flex border rounded-xl" data-dd-root>\n  <span>Nov 15, 2026</span>\n  <button>{timezone}</button>\n</div>`}
        >
          <div className={`rounded-xl border flex items-center justify-between px-3 transition-all relative ${getStateClass()}`} style={heightStyle} data-dd-root>
            <span className="text-xs font-sans tabular-nums font-semibold text-zinc-900">Nov 15, 2026</span>
            <button
              type="button"
              onClick={() => setTimezoneOpen(!timezoneOpen)}
              className="text-xs font-bold text-zinc-700 hover:text-zinc-950 flex items-center gap-1 cursor-pointer bg-zinc-100 px-2 py-0.5 rounded-md"
            >
              <span>{selectedTimezone}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {timezoneOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-44 rounded-xl bg-white border border-zinc-200 shadow-xl p-1 z-50 text-xs animate-in fade-in duration-150">
                {["UTC (GMT+0)", "EST (GMT-5)", "PST (GMT-8)", "IST (GMT+5:30)", "JST (GMT+9)"].map((tz) => (
                  <button
                    key={tz}
                    type="button"
                    onClick={() => {
                      setSelectedTimezone(tz);
                      setTimezoneOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                  >
                    {tz}
                  </button>
                ))}
              </div>
            )}
          </div>
        </InputCard>
        </div>
      </section>

      {/* ── 6. COUNTRY CODE, ADDRESS & CONTACT INPUTS ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            6. Country Code, Address & Contact Inputs
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            International phone codes, street address fields, and postal codes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputCard
          number="30"
          title="Custom Country Code Phone"
          label="Direct Phone"
          category="cat6"
          code={`<div className="flex border rounded-xl" data-dd-root>\n  <button>{dialCode}</button>\n  <input value="${phoneNumber}" />\n</div>`}
        >
          <div className={`rounded-xl border flex items-center transition-all relative ${getStateClass()}`} style={heightStyle} data-dd-root>
            <button
              type="button"
              onClick={() => setDialCodeOpen(!dialCodeOpen)}
              className="px-2.5 text-xs font-semibold text-zinc-800 border-r border-zinc-200 h-full flex items-center gap-1 bg-zinc-50 hover:bg-zinc-100 rounded-l-xl cursor-pointer"
            >
              <span>{dialCode}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {dialCodeOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-36 rounded-xl bg-white border border-zinc-200 shadow-xl p-1 z-50 text-xs animate-in fade-in duration-150">
                {["🇮🇳 +91", "🇺🇸 +1", "🇦🇪 +971", "🇬🇧 +44", "🇸🇬 +65"].map((dc) => (
                  <button
                    key={dc}
                    type="button"
                    onClick={() => {
                      setDialCode(dc);
                      setDialCodeOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                  >
                    {dc}
                  </button>
                ))}
              </div>
            )}

            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 px-3 bg-transparent text-xs font-sans tabular-nums text-zinc-950 focus:outline-none"
            />
          </div>
        </InputCard>

        <InputCard
          number="31"
          title="Street Address Input"
          label="Headquarters Address"
          category="cat6"
          code={`<div className="flex items-center px-3 border rounded-xl">\n  <MapPin className="w-4 h-4" />\n  <input value="${streetAddress}" />\n</div>`}
        >
          <div className={`rounded-xl border px-3 flex items-center gap-2.5 transition-all ${getStateClass()}`} style={heightStyle}>
            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className="w-full bg-transparent text-xs text-zinc-950 focus:outline-none"
            />
          </div>
        </InputCard>

        <InputCard
          number="32"
          title="PIN Code with Auto City badge"
          label="Postal Code"
          category="cat6"
          code={`<div className="flex border rounded-xl">\n  <input value="${pinCode}" />\n  <Badge>{cityDetected}</Badge>\n</div>`}
        >
          <div className={`rounded-xl border px-3 flex items-center justify-between transition-all ${getStateClass()}`} style={heightStyle}>
            <input
              type="text"
              maxLength={6}
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className="flex-1 bg-transparent text-xs font-sans tabular-nums font-bold text-zinc-950 focus:outline-none"
            />
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              {cityDetected}
            </span>
          </div>
        </InputCard>

        <InputCard
          number="33"
          title="Map Location Coordinates"
          label="Geocoordinates"
          category="cat6"
          code={`<div className="flex gap-2">\n  <input value="${latVal}" />\n  <input value="${longVal}" />\n</div>`}
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={latVal}
              onChange={(e) => setLatVal(e.target.value)}
              style={heightStyle}
              className={`rounded-xl border px-3 text-xs font-sans tabular-nums text-zinc-950 flex-1 focus:outline-none ${getStateClass()}`}
            />
            <input
              type="text"
              value={longVal}
              onChange={(e) => setLongVal(e.target.value)}
              style={heightStyle}
              className={`rounded-xl border px-3 text-xs font-sans tabular-nums text-zinc-950 flex-1 focus:outline-none ${getStateClass()}`}
            />
          </div>
        </InputCard>

        <InputCard
          number="34"
          title="Multiple Email Recipients"
          label="CC Recipients"
          category="cat6"
          code={`<div className="flex items-center gap-1.5 px-2 border rounded-xl">\n  {emails.map(e => <span>{e}</span>)}\n  <input placeholder="Add email..." />\n</div>`}
        >
          <div className={`rounded-xl border px-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar transition-all ${getStateClass()}`} style={heightStyle}>
            {recipientEmails.map((email, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-lg bg-zinc-100 text-zinc-800 text-[10px] font-semibold flex items-center gap-1 shrink-0"
              >
                <span>{email}</span>
                <button
                  type="button"
                  onClick={() => setRecipientEmails(recipientEmails.filter((_, i) => i !== idx))}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="email"
              placeholder="+ Add email"
              value={emailTagDraft}
              onChange={(e) => setEmailTagDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && emailTagDraft.includes("@")) {
                  setRecipientEmails([...recipientEmails, emailTagDraft.trim()]);
                  setEmailTagDraft("");
                }
              }}
              className="min-w-[80px] bg-transparent text-xs text-zinc-950 focus:outline-none"
            />
          </div>
        </InputCard>
        </div>
      </section>

      {/* ── 7. MULTI-LINE NOTES & TEXT EDITORS ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            7. Multi-Line Notes & Text Editors
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Expanding textareas, Markdown text blocks, and structured notes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputCard
          number="35"
          title="Auto-Growing Note Box"
          label="Internal Notes"
          category="cat7"
          code={`<textarea className="w-full p-3 rounded-xl border" rows={3} value="${autoGrowingNote}" />`}
        >
          <div className={`rounded-xl border p-2 transition-all ${getStateClass()}`}>
            <textarea
              rows={3}
              value={autoGrowingNote}
              onChange={(e) => setAutoGrowingNote(e.target.value)}
              className="w-full bg-transparent text-xs text-zinc-950 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </InputCard>

        <InputCard
          number="36"
          title="Character Limit Box"
          label="Meta Summary"
          category="cat7"
          code={`<div>\n  <textarea maxLength={160} />\n  <span className="font-sans tabular-nums">{len} / 160</span>\n</div>`}
        >
          <div className={`rounded-xl border p-2 transition-all space-y-1 ${getStateClass()}`}>
            <textarea
              rows={2}
              maxLength={160}
              value={charLimitText}
              onChange={(e) => setCharLimitText(e.target.value)}
              className="w-full bg-transparent text-xs text-zinc-950 focus:outline-none resize-none leading-relaxed"
            />
            <div className="flex justify-end">
              <span className="text-[10px] font-sans tabular-nums text-zinc-400 font-semibold">
                {charLimitText.length} / 160
              </span>
            </div>
          </div>
        </InputCard>

        <InputCard
          number="37"
          title="Formatted Text Box"
          label="Styled Description"
          category="cat7"
          code={`<div className="rounded-xl border">\n  <div className="flex gap-2 p-1.5 border-b"><Bold /><Italic /><List /></div>\n  <textarea />\n</div>`}
        >
          <div className={`rounded-xl border overflow-hidden transition-all ${getStateClass()}`}>
            <div className="flex items-center gap-1 p-1 bg-zinc-50 border-b border-zinc-200">
              <button
                type="button"
                onClick={() => triggerToast("Format: Bold toggled")}
                className="p-1 rounded hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 cursor-pointer"
              >
                <Bold className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => triggerToast("Format: Italic toggled")}
                className="p-1 rounded hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 cursor-pointer"
              >
                <Italic className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => triggerToast("Format: Bullet list toggled")}
                className="p-1 rounded hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 cursor-pointer"
              >
                <List className="w-3 h-3" />
              </button>
            </div>
            <textarea
              rows={2}
              value={richTextDraft}
              onChange={(e) => setRichTextDraft(e.target.value)}
              className="w-full p-2 bg-transparent text-xs text-zinc-950 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </InputCard>
        </div>
      </section>

      {/* ── 8. SMART AI & ASSISTANT INPUTS ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            8. Smart AI & Assistant Inputs
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Prompt drafting fields, token streaming indicators, and AI commands.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputCard
          number="38"
          title="AI Prompt Box"
          label="Prompt Assistant"
          category="cat8"
          code={`<div className="flex items-center px-3 border rounded-xl">\n  <Sparkles className="w-4 h-4 text-amber-500" />\n  <input value="${aiPrompt}" />\n  <button onClick={send}>Send</button>\n</div>`}
        >
          <div className={`rounded-xl border px-3 flex items-center gap-2 transition-all ${getStateClass()}`} style={heightStyle}>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full bg-transparent text-xs text-zinc-950 focus:outline-none pr-1"
            />
            <button
              type="button"
              onClick={() => triggerToast("AI Assistant executing prompt")}
              className="p-1 rounded-lg bg-zinc-950 text-white hover:bg-zinc-800 transition cursor-pointer shrink-0"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </InputCard>

        <InputCard
          number="39"
          title="Plain-English Filter Bar"
          label="Natural Language Query"
          category="cat8"
          code={`<div className="flex items-center px-3 border rounded-xl">\n  <Wand2 className="w-4 h-4 text-indigo-500" />\n  <input value="${plainFilter}" />\n</div>`}
        >
          <div className={`rounded-xl border px-3 flex items-center gap-2 transition-all ${getStateClass()}`} style={heightStyle}>
            <Wand2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <input
              type="text"
              value={plainFilter}
              onChange={(e) => setPlainFilter(e.target.value)}
              className="w-full bg-transparent text-xs text-zinc-950 focus:outline-none"
            />
          </div>
        </InputCard>

        <InputCard
          number="40"
          title="One-Click Text Polish"
          label="Draft Review"
          category="cat8"
          code={`<div className="flex border rounded-xl">\n  <input value="${polishDraft}" />\n  <button onClick={polish}>Polish</button>\n</div>`}
        >
          <div className={`rounded-xl border overflow-hidden flex items-center transition-all ${getStateClass()}`} style={heightStyle}>
            <input
              type="text"
              value={polishDraft}
              onChange={(e) => setPolishDraft(e.target.value)}
              className="flex-1 px-3 bg-transparent text-xs text-zinc-950 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setPolishDraft("Our distributed architecture provides sub-20ms edge latency with 99.98% reliability.");
                triggerToast("Text polished with professional tone");
              }}
              className="px-3 bg-zinc-50 border-l border-zinc-200 text-xs font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 flex items-center gap-1.5 h-full cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Polish</span>
            </button>
          </div>
        </InputCard>
        </div>
      </section>

      {/* ── 9. FILE UPLOAD & COLOR INPUTS ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            9. File Upload & Color Inputs
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Drag-and-drop dropzones, file attachments, and hex color selectors.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputCard
          number="41"
          title="File Upload Box"
          label="Contract Document"
          category="cat9"
          code={`<div className="flex items-center justify-between px-3 border rounded-xl">\n  <FileText />\n  <span>{filename}</span>\n  <button>Choose</button>\n</div>`}
        >
          <div className={`rounded-xl border px-3 flex items-center justify-between transition-all ${getStateClass()}`} style={heightStyle}>
            <div className="flex items-center gap-2 truncate">
              <FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="text-xs font-semibold text-zinc-800 truncate">{uploadedFileName}</span>
            </div>
            <button
              type="button"
              onClick={() => triggerToast("Opening native file selector")}
              className="text-[11px] font-bold text-zinc-600 hover:text-zinc-950 px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 cursor-pointer shrink-0"
            >
              Replace
            </button>
          </div>
        </InputCard>

        <InputCard
          number="42"
          title="Drag & Drop File Zone"
          label="Drop Target"
          category="cat9"
          code={`<div className="border border-dashed rounded-xl p-3 text-center">\n  <UploadCloud />\n  <span>Drag files here or browse</span>\n</div>`}
        >
          <div
            onClick={() => triggerToast("Dropzone ready for document drop")}
            className="rounded-xl border border-dashed border-zinc-300 p-3 text-center hover:border-zinc-500 hover:bg-zinc-50/50 transition cursor-pointer flex flex-col items-center justify-center gap-1"
          >
            <UploadCloud className="w-4 h-4 text-zinc-400" />
            <span className="text-[11px] font-semibold text-zinc-600">Drag files here or click to browse</span>
          </div>
        </InputCard>

        <InputCard
          number="43"
          title="Brand Color Picker"
          label="Accent Token"
          category="cat9"
          code={`<div className="flex border rounded-xl">\n  <div style={{ background: color }} className="w-6 h-6 rounded-md m-1.5" />\n  <input value="${colorHex}" />\n</div>`}
        >
          <div className={`rounded-xl border flex items-center px-2 transition-all ${getStateClass()}`} style={heightStyle}>
            <div
              style={{ backgroundColor: colorHex }}
              className="w-5 h-5 rounded-lg border border-black/10 shrink-0 shadow-2xs mr-2"
            />
            <input
              type="text"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              className="flex-1 bg-transparent text-xs font-sans tabular-nums font-bold text-zinc-950 focus:outline-none"
            />
          </div>
        </InputCard>

        {/* ========================================================================= */}
        {/* 10. LIVE STATUS PREVIEW (1 VARIANT) */}
        {/* ========================================================================= */}
        <InputCard
          number="44"
          title="Workspace ID (Live Status Slot)"
          label="Node Identifier"
          category="cat10"
          code={`<div className="flex border rounded-xl">\n  <input value="${workspaceId}" />\n  <Badge variant={globalState}>{globalState}</Badge>\n</div>`}
        >
          <div className={`rounded-xl border px-3 flex items-center justify-between transition-all ${getStateClass()}`} style={heightStyle}>
            <input
              type="text"
              value={workspaceId}
              onChange={(e) => setWorkspaceId(e.target.value)}
              className="flex-1 bg-transparent text-xs font-sans tabular-nums font-semibold text-zinc-950 focus:outline-none mr-2"
            />
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize ${
                globalState === "verified"
                  ? "bg-emerald-100 text-emerald-800"
                  : globalState === "warning"
                  ? "bg-amber-100 text-amber-800"
                  : globalState === "error"
                  ? "bg-rose-100 text-rose-800"
                  : globalState === "checking"
                  ? "bg-indigo-100 text-indigo-800 animate-pulse"
                  : "bg-zinc-100 text-zinc-700"
              }`}
            >
              {globalState}
            </span>
          </div>
        </InputCard>
        </div>
      </section>

      {/* ── CODE MODAL ── */}
      <CodeModal
        modal={activeCodeModal}
        onClose={() => setActiveCodeModal(null)}
      />
    </div>
  );
}
