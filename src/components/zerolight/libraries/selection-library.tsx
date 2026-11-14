"use client";

import React, { useState, useEffect } from "react";
import {
  Check,
  Minus,
  ChevronDown,
  Code2,
  X,
  Star,
  Search,
  SlidersHorizontal,
  Shield,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  CreditCard,
  Building2,
  UserCheck,
  Users,
  Eye,
  Calendar,
  Lock,
  Copy,
} from "lucide-react";
import { useZeroLight } from "../context";
import { Badge } from "../atoms/badge";

export type SelectionDensity = "small" | "medium" | "large";
export type SelectionGlobalState = "ready" | "error" | "disabled";

export function SaaSSelectionLibrary() {
  const { tokens } = useZeroLight();

  // Sticky Bar States
  const [searchQuery, setSearchQuery] = useState("");
  const [density, setDensity] = useState<SelectionDensity>("medium");
  const [globalState, setGlobalState] = useState<SelectionGlobalState>("ready");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);

  // Modal Code State
  const [activeCodeModal, setActiveCodeModal] = useState<{ title: string; code: string } | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Click outside to dismiss custom popovers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-select-popover]")) {
        setStateDropdownOpen(false);
        setCustomSelectOpen(false);
        setMultiDropdownOpen(false);
        setStatusDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Category 1 States: Checkboxes
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(false);
  const [childChecks, setChildChecks] = useState([true, false, true]);
  const [check4, setCheck4] = useState(true);
  const [tagChecks, setTagChecks] = useState<string[]>(["Email", "WhatsApp"]);
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Category 2 States: Radio Buttons
  const [radioDelivery, setRadioDelivery] = useState("instant");
  const [radioBilling, setRadioBilling] = useState("monthly");
  const [radioRole, setRadioRole] = useState("admin");
  const [segmentedFilter, setSegmentedFilter] = useState("active");
  const [includeTax, setIncludeTax] = useState<"yes" | "no">("yes");

  // Category 3 States: Toggle Switches
  const [switch1, setSwitch1] = useState(true);
  const [switch2, setSwitch2] = useState(true);
  const [switch3, setSwitch3] = useState(false);
  const [switch4, setSwitch4] = useState(true);
  const [switch5, setSwitch5] = useState(false);

  // Category 4 States: Selectable Cards
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "pro">("pro");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["gst"]);
  const [selectedIconRole, setSelectedIconRole] = useState("editor");
  const [selectedPayment, setSelectedPayment] = useState("upi");

  // Category 5 States: Custom Select & Multi-Select
  const [customSelectOpen, setCustomSelectOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("Main Headquarters (Frankfurt)");
  const [multiDropdownOpen, setMultiDropdownOpen] = useState(false);
  const [selectedDepts, setSelectedDepts] = useState<string[]>(["Engineering", "Product"]);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"progress" | "pending" | "blocked">("progress");

  // Category 6 States: Permission Grid & Day Pickers
  const [activeDays, setActiveDays] = useState<string[]>(["M", "T", "W", "T", "F"]);
  const [permissions, setPermissions] = useState<{ [key: string]: boolean }>({
    "inv-view": true,
    "inv-edit": true,
    "inv-del": false,
    "client-view": true,
    "client-edit": false,
    "client-del": false,
  });
  const [starRating, setStarRating] = useState(4);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Tri-State Indeterminate Logic for Checkbox 3
  const allChildrenChecked = childChecks.every(Boolean);
  const isIndeterminate = childChecks.some(Boolean) && !allChildrenChecked;

  const handleParentCheckToggle = () => {
    if (allChildrenChecked) {
      setChildChecks([false, false, false]);
    } else {
      setChildChecks([true, true, true]);
    }
  };

  const handleChildToggle = (idx: number) => {
    const updated = [...childChecks];
    updated[idx] = !updated[idx];
    setChildChecks(updated);
  };

  // Dynamic Density Styling Constants
  const densityConfig = {
    small: {
      boxSize: "w-[15px] h-[15px]",
      radioInner: "w-1.5 h-1.5",
      checkIcon: "w-2.5 h-2.5",
      switchTrack: "w-8 h-[18px]",
      switchThumb: "w-3 h-3",
      switchTranslate: "translate-x-3.5",
      textClass: "text-xs",
      subtextClass: "text-[10px]",
    },
    medium: {
      boxSize: "w-[18px] h-[18px]",
      radioInner: "w-2 h-2",
      checkIcon: "w-3 h-3",
      switchTrack: "w-10 h-[22px]",
      switchThumb: "w-4 h-4",
      switchTranslate: "translate-x-4.5",
      textClass: "text-xs",
      subtextClass: "text-[11px]",
    },
    large: {
      boxSize: "w-[22px] h-[22px]",
      radioInner: "w-2.5 h-2.5",
      checkIcon: "w-3.5 h-3.5",
      switchTrack: "w-12 h-[26px]",
      switchThumb: "w-5 h-5",
      switchTranslate: "translate-x-5.5",
      textClass: "text-sm",
      subtextClass: "text-xs",
    },
  }[density];

  const categories = [
    { id: "all", label: "All (26)" },
    { id: "cat1", label: "1. Checkboxes" },
    { id: "cat2", label: "2. Radio Buttons" },
    { id: "cat3", label: "3. Toggle Switches" },
    { id: "cat4", label: "4. Selectable Cards" },
    { id: "cat5", label: "5. Custom Dropdowns" },
    { id: "cat6", label: "6. Permissions & Rating" },
  ];

  const handleCopyCode = () => {
    if (!activeCodeModal) return;
    navigator.clipboard?.writeText(activeCodeModal.code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Card Container Component
  const Card = ({
    number,
    title,
    category,
    code,
    children,
  }: {
    number: string;
    title: string;
    category: string;
    code: string;
    children: React.ReactNode;
  }) => {
    if (activeCategory !== "all" && activeCategory !== category) return null;
    if (searchQuery.trim() && !title.toLowerCase().includes(searchQuery.toLowerCase())) return null;

    return (
      <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs flex flex-col justify-between gap-4 transition-all hover:border-zinc-300">
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

        <div className="min-h-[48px] flex items-center w-full">{children}</div>
      </div>
    );
  };

  // Custom Styled Checkbox Component (Zero Native Controls)
  const CustomCheckbox = ({
    checked,
    indeterminate = false,
    onChange,
    disabled = false,
  }: {
    checked: boolean;
    indeterminate?: boolean;
    onChange?: () => void;
    disabled?: boolean;
  }) => {
    const isStateDisabled = disabled || globalState === "disabled";
    const isError = globalState === "error";

    return (
      <div
        onClick={() => !isStateDisabled && onChange?.()}
        className={`${densityConfig.boxSize} rounded-md border flex items-center justify-center transition-all cursor-pointer select-none shrink-0 ${
          isStateDisabled
            ? "bg-zinc-100 border-zinc-200 cursor-not-allowed opacity-50"
            : isError
            ? "border-rose-500 bg-rose-50"
            : checked || indeterminate
            ? "bg-zinc-950 border-zinc-950 text-white shadow-2xs"
            : "bg-white border-zinc-300 hover:border-zinc-500"
        }`}
      >
        {indeterminate ? (
          <Minus className={`${densityConfig.checkIcon} stroke-[3]`} />
        ) : checked ? (
          <Check className={`${densityConfig.checkIcon} stroke-[3]`} />
        ) : null}
      </div>
    );
  };

  // Custom Styled Radio Dot Component (Zero Native Controls)
  const CustomRadio = ({
    selected,
    onChange,
    disabled = false,
  }: {
    selected: boolean;
    onChange?: () => void;
    disabled?: boolean;
  }) => {
    const isStateDisabled = disabled || globalState === "disabled";
    const isError = globalState === "error";

    return (
      <div
        onClick={() => !isStateDisabled && onChange?.()}
        className={`${densityConfig.boxSize} rounded-full border flex items-center justify-center transition-all cursor-pointer select-none shrink-0 ${
          isStateDisabled
            ? "bg-zinc-100 border-zinc-200 cursor-not-allowed opacity-50"
            : isError
            ? "border-rose-500 bg-rose-50"
            : selected
            ? "border-zinc-950 bg-white"
            : "bg-white border-zinc-300 hover:border-zinc-500"
        }`}
      >
        {selected && (
          <div className={`${densityConfig.radioInner} rounded-full bg-zinc-950`} />
        )}
      </div>
    );
  };

  // Custom Styled Switch Component
  const CustomSwitch = ({
    active,
    onChange,
    disabled = false,
  }: {
    active: boolean;
    onChange?: () => void;
    disabled?: boolean;
  }) => {
    const isStateDisabled = disabled || globalState === "disabled";
    const isError = globalState === "error";

    return (
      <div
        onClick={() => !isStateDisabled && onChange?.()}
        className={`${densityConfig.switchTrack} p-0.5 rounded-full transition-colors cursor-pointer select-none relative flex items-center shrink-0 ${
          isStateDisabled
            ? "bg-zinc-200 cursor-not-allowed opacity-50"
            : isError
            ? "bg-rose-200"
            : active
            ? "bg-zinc-950"
            : "bg-zinc-200 hover:bg-zinc-300"
        }`}
      >
        <div
          className={`${densityConfig.switchThumb} rounded-full bg-white shadow-xs transition-transform transform ${
            active ? densityConfig.switchTranslate : "translate-x-0"
          }`}
        />
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
      <div className="sticky top-0 z-30 -mx-6 px-6 py-2.5 bg-[#FAFAFA]/95 backdrop-blur-md border-b border-zinc-200/80">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Horizontal Category Filter Pill Rail */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === c.id
                    ? "bg-zinc-950 text-white shadow-2xs"
                    : "bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/80"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Controls: Search, 3 Density Tiers, Global State Selector */}
          <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
            {/* Live Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search controls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-zinc-950 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-950 w-36 sm:w-44"
              />
            </div>

            {/* 3 Size Density Toggles */}
            <div className="flex items-center bg-zinc-200/70 p-0.5 rounded-xl border border-zinc-300/40 font-sans">
              {(["small", "medium", "large"] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setDensity(tier)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    density === tier ? "bg-white text-zinc-950 shadow-2xs font-bold" : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            {/* Custom State Dropdown */}
            <div className="relative" data-select-popover>
              <button
                type="button"
                onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
                className="px-2.5 py-1.5 rounded-xl bg-white border border-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 hover:bg-zinc-50 transition cursor-pointer"
              >
                <span>State: <strong className="capitalize text-zinc-950">{globalState}</strong></span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {stateDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white border border-zinc-200 shadow-xl p-1 z-50 text-xs animate-in fade-in duration-150">
                  {(["ready", "error", "disabled"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setGlobalState(s);
                        setStateDropdownOpen(false);
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left capitalize font-semibold cursor-pointer ${
                        globalState === s ? "bg-zinc-950 text-white" : "text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3-COLUMN RESPONSIVE SELECTION GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ========================================================================= */}
        {/* 1. CHECKBOXES & MULTI-SELECT LISTS (6 VARIANTS) */}
        {/* ========================================================================= */}
        <Card
          number="01"
          title="Simple Checkbox"
          category="cat1"
          code={`<label className="flex items-center gap-2.5 cursor-pointer">\n  <CustomCheckbox checked={checked} onChange={toggle} />\n  <span>Send weekly summary email</span>\n</label>`}
        >
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <CustomCheckbox checked={check1} onChange={() => setCheck1(!check1)} />
            <span className={`${densityConfig.textClass} font-semibold text-zinc-900`}>
              Send weekly summary email
            </span>
          </label>
        </Card>

        <Card
          number="02"
          title="Checkbox with Short Note"
          category="cat1"
          code={`<label className="flex items-start gap-2.5 cursor-pointer">\n  <CustomCheckbox checked={checked} />\n  <div>\n    <span className="font-semibold">Auto-approve recurring bills</span>\n    <span className="text-zinc-400">Under ₹50,000 threshold</span>\n  </div>\n</label>`}
        >
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <CustomCheckbox checked={check2} onChange={() => setCheck2(!check2)} />
            <div>
              <span className={`${densityConfig.textClass} font-semibold text-zinc-900 block`}>
                Auto-approve recurring bills
              </span>
              <span className={`${densityConfig.subtextClass} text-zinc-400 font-medium block`}>
                Under ₹50,000 threshold without manual review
              </span>
            </div>
          </label>
        </Card>

        <Card
          number="03"
          title="Select All Parent Checkbox"
          category="cat1"
          code={`<CustomCheckbox checked={allChecked} indeterminate={isIndeterminate} onChange={toggleAll} />`}
        >
          <div className="space-y-2 w-full">
            <label className="flex items-center gap-2.5 cursor-pointer select-none pb-1.5 border-b border-zinc-100">
              <CustomCheckbox
                checked={allChildrenChecked}
                indeterminate={isIndeterminate}
                onChange={handleParentCheckToggle}
              />
              <span className={`${densityConfig.textClass} font-bold text-zinc-950`}>
                Select All Clusters (3)
              </span>
            </label>

            <div className="pl-6 space-y-1.5">
              {["US-East Node", "EU-Central Node", "APAC-Tokyo Node"].map((name, i) => (
                <label key={name} className="flex items-center gap-2 cursor-pointer select-none">
                  <CustomCheckbox
                    checked={childChecks[i]}
                    onChange={() => handleChildToggle(i)}
                  />
                  <span className={`${densityConfig.subtextClass} font-semibold text-zinc-700`}>
                    {name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </Card>

        <Card
          number="04"
          title="Right-Aligned Settings Checkbox"
          category="cat1"
          code={`<div className="flex items-center justify-between w-full">\n  <span>Two-step verification</span>\n  <CustomCheckbox checked={check} />\n</div>`}
        >
          <div
            onClick={() => setCheck4(!check4)}
            className="flex items-center justify-between w-full p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 cursor-pointer select-none hover:bg-zinc-100/70 transition"
          >
            <div>
              <span className={`${densityConfig.textClass} font-semibold text-zinc-900 block`}>
                Two-step login verification
              </span>
              <span className={`${densityConfig.subtextClass} text-zinc-400 font-medium block`}>
                Require FIDO2 or TOTP code on login
              </span>
            </div>
            <CustomCheckbox checked={check4} />
          </div>
        </Card>

        <Card
          number="05"
          title="Horizontal Tag Checkboxes"
          category="cat1"
          code={`<div className="flex gap-2">\n  {tags.map(t => <button className={active ? "bg-zinc-950 text-white" : ""}>{t}</button>)}\n</div>`}
        >
          <div className="flex flex-wrap items-center gap-2">
            {["Email", "SMS", "WhatsApp", "Slack"].map((channel) => {
              const active = tagChecks.includes(channel);
              return (
                <button
                  key={channel}
                  type="button"
                  onClick={() => {
                    if (active) setTagChecks(tagChecks.filter((c) => c !== channel));
                    else setTagChecks([...tagChecks, channel]);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    active
                      ? "bg-zinc-950 text-white shadow-2xs"
                      : "bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200"
                  }`}
                >
                  <CustomCheckbox checked={active} />
                  <span>{channel}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card
          number="06"
          title="Terms & Agreement Checkbox"
          category="cat1"
          code={`<label className="flex items-start gap-2.5">\n  <CustomCheckbox checked={agreed} />\n  <span>I agree to the Master License Terms</span>\n</label>`}
        >
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <CustomCheckbox checked={termsAgreed} onChange={() => setTermsAgreed(!termsAgreed)} />
            <span className={`${densityConfig.subtextClass} text-zinc-600 font-medium leading-relaxed`}>
              I have read and agree to the{" "}
              <strong className="text-zinc-950 underline decoration-zinc-300">
                Master License Terms
              </strong>{" "}
              and SOC2 Privacy Charter.
            </span>
          </label>
        </Card>

        {/* ========================================================================= */}
        {/* 2. RADIO BUTTONS — PICK ONE OPTION (5 VARIANTS) */}
        {/* ========================================================================= */}
        <Card
          number="07"
          title="Vertical Radio List"
          category="cat2"
          code={`<div className="space-y-2">\n  {options.map(opt => <label key={opt}><CustomRadio selected={val === opt} /><span>{opt}</span></label>)}\n</div>`}
        >
          <div className="space-y-2 w-full">
            {[
              { id: "instant", label: "Instant CDN Delivery (0ms)" },
              { id: "standard", label: "Standard Cluster (2-3 Days)" },
              { id: "scheduled", label: "Scheduled Batch Deployment" },
            ].map((item) => (
              <label
                key={item.id}
                onClick={() => setRadioDelivery(item.id)}
                className="flex items-center gap-2.5 cursor-pointer select-none"
              >
                <CustomRadio selected={radioDelivery === item.id} />
                <span className={`${densityConfig.textClass} font-semibold text-zinc-800`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </Card>

        <Card
          number="08"
          title="Horizontal Inline Radios"
          category="cat2"
          code={`<div className="flex gap-4">\n  {cadences.map(c => <label key={c}><CustomRadio selected={cadence === c} /><span>{c}</span></label>)}\n</div>`}
        >
          <div className="flex flex-wrap items-center gap-4">
            {["Monthly", "Quarterly", "Yearly (Save 20%)"].map((cadence) => (
              <label
                key={cadence}
                onClick={() => setRadioBilling(cadence.toLowerCase())}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <CustomRadio selected={radioBilling.startsWith(cadence.split(" ")[0].toLowerCase())} />
                <span className={`${densityConfig.textClass} font-semibold text-zinc-800`}>
                  {cadence}
                </span>
              </label>
            ))}
          </div>
        </Card>

        <Card
          number="09"
          title="Radio Options with Subtitles"
          category="cat2"
          code={`<div className="space-y-2">\n  <label><CustomRadio /><div><p>Admin Access</p><p>Full read/write</p></div></label>\n</div>`}
        >
          <div className="space-y-2 w-full">
            {[
              { id: "admin", title: "Admin Access", sub: "Full cluster mutation & billing controls" },
              { id: "viewer", title: "Viewer Only", sub: "Read-only telemetry and log stream inspection" },
            ].map((role) => (
              <label
                key={role.id}
                onClick={() => setRadioRole(role.id)}
                className="flex items-start gap-2.5 p-2 rounded-xl border border-zinc-200/80 hover:bg-zinc-50 cursor-pointer select-none transition"
              >
                <div className="pt-0.5">
                  <CustomRadio selected={radioRole === role.id} />
                </div>
                <div>
                  <span className={`${densityConfig.textClass} font-bold text-zinc-950 block`}>
                    {role.title}
                  </span>
                  <span className={`${densityConfig.subtextClass} text-zinc-500 font-medium block`}>
                    {role.sub}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </Card>

        <Card
          number="10"
          title="Segmented Pill Radio Group"
          category="cat2"
          code={`<div className="inline-flex bg-zinc-100 p-1 rounded-xl">\n  {filters.map(f => <button className={active ? "bg-white text-zinc-950" : ""}>{f}</button>)}\n</div>`}
        >
          <div className="inline-flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200/60">
            {["all", "active", "archived"].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSegmentedFilter(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  segmentedFilter === mode
                    ? "bg-white text-zinc-950 shadow-2xs font-bold"
                    : "text-zinc-500 hover:text-zinc-950"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </Card>

        <Card
          number="11"
          title="Yes / No Quick Choice"
          category="cat2"
          code={`<div className="flex gap-2">\n  <button className={val === 'yes' ? "bg-zinc-950 text-white" : ""}>Yes</button>\n</div>`}
        >
          <div className="flex items-center gap-2">
            {[
              { id: "yes", label: "Yes, Include Tax" },
              { id: "no", label: "No, Exclude Tax" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setIncludeTax(opt.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                  includeTax === opt.id
                    ? "bg-zinc-950 text-white shadow-xs font-bold"
                    : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                <CustomRadio selected={includeTax === opt.id} />
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 3. TOGGLE SWITCHES — ON / OFF CONTROLS (5 VARIANTS) */}
        {/* ========================================================================= */}
        <Card
          number="12"
          title="Simple Toggle Switch"
          category="cat3"
          code={`<label className="flex items-center gap-3 cursor-pointer">\n  <CustomSwitch active={active} onChange={toggle} />\n  <span>Live Sync Enabled</span>\n</label>`}
        >
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <CustomSwitch active={switch1} onChange={() => setSwitch1(!switch1)} />
            <span className={`${densityConfig.textClass} font-semibold text-zinc-900`}>
              Live Sync Enabled
            </span>
          </label>
        </Card>

        <Card
          number="13"
          title="Settings Row Toggle"
          category="cat3"
          code={`<div className="flex items-center justify-between w-full">\n  <div><p>Automatic Backups</p></div>\n  <CustomSwitch active={active} />\n</div>`}
        >
          <div
            onClick={() => setSwitch2(!switch2)}
            className="flex items-center justify-between w-full p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 cursor-pointer select-none hover:bg-zinc-100/70 transition"
          >
            <div>
              <span className={`${densityConfig.textClass} font-semibold text-zinc-900 block`}>
                Automatic Database Snapshots
              </span>
              <span className={`${densityConfig.subtextClass} text-zinc-400 font-medium block`}>
                Triggered every 6 hours to encrypted cold storage
              </span>
            </div>
            <CustomSwitch active={switch2} />
          </div>
        </Card>

        <Card
          number="14"
          title="Toggle with Status Text"
          category="cat3"
          code={`<div className="flex items-center gap-2">\n  <CustomSwitch active={active} />\n  <span>{active ? "Active" : "Off"}</span>\n</div>`}
        >
          <div className="flex items-center gap-2.5">
            <CustomSwitch active={switch3} onChange={() => setSwitch3(!switch3)} />
            <span className={`${densityConfig.textClass} font-bold text-zinc-900`}>
              {switch3 ? "Active & Streaming" : "Inactive (Off)"}
            </span>
          </div>
        </Card>

        <Card
          number="15"
          title="Bordered Feature Switch Box"
          category="cat3"
          code={`<div className="p-3 border rounded-xl flex items-center justify-between">\n  <div><Zap /><span>AI Auto-Complete</span></div>\n  <CustomSwitch />\n</div>`}
        >
          <div
            onClick={() => setSwitch4(!switch4)}
            className="p-3 rounded-xl border border-zinc-200 bg-white flex items-center justify-between w-full cursor-pointer select-none hover:border-zinc-300 transition shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className={`${densityConfig.textClass} font-bold text-zinc-950 block`}>
                  AI Auto-Completion
                </span>
                <span className={`${densityConfig.subtextClass} text-zinc-400 block`}>
                  Ghost-text suggestions
                </span>
              </div>
            </div>
            <CustomSwitch active={switch4} />
          </div>
        </Card>

        <Card
          number="16"
          title="Compact Table Cell Switch"
          category="cat3"
          code={`<div className="flex items-center gap-2 text-xs">\n  <span>Public API Access:</span>\n  <CustomSwitch active={active} />\n</div>`}
        >
          <div className="flex items-center justify-between w-full p-2 rounded-lg bg-zinc-50 border border-zinc-200">
            <span className="text-[11px] font-semibold text-zinc-700">Public API Access</span>
            <CustomSwitch active={switch5} onChange={() => setSwitch5(!switch5)} />
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 4. SELECTABLE CARDS & PLAN BOXES (4 VARIANTS) */}
        {/* ========================================================================= */}
        <Card
          number="17"
          title="Single-Choice Plan Cards"
          category="cat4"
          code={`<div className="grid grid-cols-2 gap-2">\n  <div onClick={() => setPlan('starter')} className={selected ? "border-zinc-950" : ""}>Starter</div>\n</div>`}
        >
          <div className="grid grid-cols-2 gap-2 w-full">
            {[
              { id: "starter", name: "Starter", price: "₹999/mo", seats: "5 Seats" },
              { id: "pro", name: "Pro Team", price: "₹2,499/mo", seats: "Unlimited" },
            ].map((plan) => {
              const active = selectedPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id as any)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    active
                      ? "border-zinc-950 bg-zinc-950 text-white shadow-md"
                      : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{plan.name}</span>
                    <CustomRadio selected={active} />
                  </div>
                  <span className="text-xs font-sans tabular-nums font-bold block">{plan.price}</span>
                  <span className={`text-[10px] ${active ? "text-zinc-400" : "text-zinc-500"} block mt-0.5`}>
                    {plan.seats}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card
          number="18"
          title="Multi-Select Feature Cards"
          category="cat4"
          code={`<div className="grid grid-cols-2 gap-2">\n  {features.map(f => <div className={active ? "border-zinc-950" : ""}>{f}</div>)}\n</div>`}
        >
          <div className="grid grid-cols-2 gap-2 w-full">
            {[
              { id: "gst", name: "Automated GST", price: "+₹499/mo" },
              { id: "payroll", name: "Direct Payroll", price: "+₹799/mo" },
            ].map((feat) => {
              const active = selectedFeatures.includes(feat.id);
              return (
                <div
                  key={feat.id}
                  onClick={() => {
                    if (active) setSelectedFeatures(selectedFeatures.filter((f) => f !== feat.id));
                    else setSelectedFeatures([...selectedFeatures, feat.id]);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    active
                      ? "border-zinc-950 bg-zinc-50 text-zinc-950"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-zinc-900">{feat.name}</span>
                    <CustomCheckbox checked={active} />
                  </div>
                  <span className="text-[10px] font-sans tabular-nums text-zinc-500 font-bold block">
                    {feat.price}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card
          number="19"
          title="Icon Role Selector Cards"
          category="cat4"
          code={`<div className="grid grid-cols-3 gap-1.5">\n  {roles.map(r => <div className={selected ? "bg-zinc-950 text-white" : ""}>{r.icon}{r.name}</div>)}\n</div>`}
        >
          <div className="grid grid-cols-3 gap-1.5 w-full">
            {[
              { id: "owner", label: "Owner", icon: <Shield className="w-3.5 h-3.5" /> },
              { id: "editor", label: "Editor", icon: <UserCheck className="w-3.5 h-3.5" /> },
              { id: "guest", label: "Guest", icon: <Users className="w-3.5 h-3.5" /> },
            ].map((role) => {
              const active = selectedIconRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedIconRole(role.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                    active
                      ? "bg-zinc-950 text-white border-zinc-950 shadow-xs font-bold"
                      : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  {role.icon}
                  <span className="text-[11px] font-semibold">{role.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card
          number="20"
          title="Payment Method Row Cards"
          category="cat4"
          code={`<div className="space-y-2">\n  <div onClick={() => setPay('upi')}>UPI / Bank Transfer</div>\n</div>`}
        >
          <div className="space-y-1.5 w-full">
            {[
              { id: "upi", title: "UPI / Instant Bank Transfer", sub: "Zero surcharge fee" },
              { id: "card", title: "Corporate Credit Card", sub: "Visa, Mastercard, Amex" },
            ].map((method) => {
              const active = selectedPayment === method.id;
              return (
                <div
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer select-none transition ${
                    active
                      ? "bg-zinc-50 border-zinc-950 text-zinc-950"
                      : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{method.title}</span>
                    <span className="text-[10px] text-zinc-400 block">{method.sub}</span>
                  </div>
                  <CustomRadio selected={active} />
                </div>
              );
            })}
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 5. CUSTOM SELECT & MULTI-SELECT BOXES (3 VARIANTS) */}
        {/* ========================================================================= */}
        <Card
          number="21"
          title="Single Choice Select Box"
          category="cat5"
          code={`<div data-select-popover>\n  <button onClick={toggle}>{selectedBranch}</button>\n  {open && <PopoverList />}\n</div>`}
        >
          <div className="relative w-full" data-select-popover>
            <button
              type="button"
              onClick={() => setCustomSelectOpen(!customSelectOpen)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-xs font-semibold flex items-center justify-between shadow-2xs hover:bg-zinc-50 transition cursor-pointer"
            >
              <span className="truncate">{selectedBranch}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-1" />
            </button>

            {customSelectOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-full rounded-xl bg-white border border-zinc-200 shadow-xl p-1 z-50 text-xs animate-in fade-in duration-150">
                {[
                  "Main Headquarters (Frankfurt)",
                  "Silicon Valley Center (US-West)",
                  "Singapore Regional Hub (APAC)",
                  "London Office (UK)",
                ].map((branch) => (
                  <button
                    key={branch}
                    type="button"
                    onClick={() => {
                      setSelectedBranch(branch);
                      setCustomSelectOpen(false);
                      triggerToast(`Branch switched to: ${branch}`);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                  >
                    {branch}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card
          number="22"
          title="Multi-Select Checkbox Dropdown"
          category="cat5"
          code={`<div data-select-popover>\n  <button>{depts.length} Departments Selected</button>\n  {open && <CheckboxOptions />}\n</div>`}
        >
          <div className="relative w-full" data-select-popover>
            <button
              type="button"
              onClick={() => setMultiDropdownOpen(!multiDropdownOpen)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-xs font-semibold flex items-center justify-between shadow-2xs hover:bg-zinc-50 transition cursor-pointer"
            >
              <span className="font-sans tabular-nums">
                {selectedDepts.length} Departments Selected
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-1" />
            </button>

            {multiDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-full rounded-xl bg-white border border-zinc-200 shadow-xl p-2 z-50 text-xs space-y-1.5 animate-in fade-in duration-150">
                {["Engineering", "Product", "Operations", "Finance", "Security"].map((dept) => {
                  const active = selectedDepts.includes(dept);
                  return (
                    <label
                      key={dept}
                      onClick={() => {
                        if (active) setSelectedDepts(selectedDepts.filter((d) => d !== dept));
                        else setSelectedDepts([...selectedDepts, dept]);
                      }}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-50 cursor-pointer select-none"
                    >
                      <CustomCheckbox checked={active} />
                      <span className="font-semibold text-zinc-800">{dept}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        <Card
          number="23"
          title="Status Selector with Color Dot"
          category="cat5"
          code={`<div data-select-popover>\n  <button><Dot /><span>{status}</span></button>\n</div>`}
        >
          <div className="relative w-full" data-select-popover>
            <button
              type="button"
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-xs font-semibold flex items-center justify-between shadow-2xs hover:bg-zinc-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    selectedStatus === "progress"
                      ? "bg-emerald-500"
                      : selectedStatus === "pending"
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                />
                <span className="capitalize">
                  {selectedStatus === "progress"
                    ? "In Progress"
                    : selectedStatus === "pending"
                    ? "Pending Review"
                    : "Blocked"}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            </button>

            {statusDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-full rounded-xl bg-white border border-zinc-200 shadow-xl p-1 z-50 text-xs animate-in fade-in duration-150">
                {[
                  { id: "progress", label: "In Progress", dot: "bg-emerald-500" },
                  { id: "pending", label: "Pending Review", dot: "bg-amber-500" },
                  { id: "blocked", label: "Blocked", dot: "bg-rose-500" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelectedStatus(s.id as any);
                      setStatusDropdownOpen(false);
                      triggerToast(`Status updated to: ${s.label}`);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left font-semibold text-zinc-800 hover:bg-zinc-100 flex items-center gap-2 cursor-pointer"
                  >
                    <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 6. PERMISSION MATRIX & DAY PICKERS (3 VARIANTS) */}
        {/* ========================================================================= */}
        <Card
          number="24"
          title="Weekly Working Days Selector"
          category="cat6"
          code={`<div className="flex gap-1.5">\n  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => <button className={active ? "bg-zinc-950 text-white" : ""}>{d}</button>)}\n</div>`}
        >
          <div className="flex items-center gap-1.5 w-full justify-between">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => {
              const dayKey = `${day}-${idx}`;
              const active = activeDays.includes(dayKey) || (idx < 5 && activeDays.includes(day));
              return (
                <button
                  key={dayKey}
                  type="button"
                  onClick={() => {
                    if (active) setActiveDays(activeDays.filter((d) => d !== day && d !== dayKey));
                    else setActiveDays([...activeDays, dayKey]);
                  }}
                  className={`w-8 h-8 rounded-full text-xs font-bold font-sans flex items-center justify-center transition cursor-pointer ${
                    active
                      ? "bg-zinc-950 text-white shadow-2xs"
                      : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </Card>

        <Card
          number="25"
          title="Role Permission Mini-Grid"
          category="cat6"
          code={`<table className="w-full text-xs">\n  <thead><tr><th>Resource</th><th>View</th><th>Edit</th><th>Delete</th></tr></thead>\n</table>`}
        >
          <div className="w-full text-xs font-sans">
            <div className="grid grid-cols-4 pb-1.5 border-b border-zinc-200 font-bold text-zinc-400 text-[10px] uppercase">
              <span>Scope</span>
              <span className="text-center">View</span>
              <span className="text-center">Edit</span>
              <span className="text-center">Delete</span>
            </div>
            {[
              { id: "inv", name: "Invoices" },
              { id: "client", name: "Clients" },
            ].map((res) => (
              <div key={res.id} className="grid grid-cols-4 py-2 border-b border-zinc-100 items-center">
                <span className="font-semibold text-zinc-900">{res.name}</span>
                <div className="flex justify-center">
                  <CustomCheckbox
                    checked={permissions[`${res.id}-view`]}
                    onChange={() =>
                      setPermissions({
                        ...permissions,
                        [`${res.id}-view`]: !permissions[`${res.id}-view`],
                      })
                    }
                  />
                </div>
                <div className="flex justify-center">
                  <CustomCheckbox
                    checked={permissions[`${res.id}-edit`]}
                    onChange={() =>
                      setPermissions({
                        ...permissions,
                        [`${res.id}-edit`]: !permissions[`${res.id}-edit`],
                      })
                    }
                  />
                </div>
                <div className="flex justify-center">
                  <CustomCheckbox
                    checked={permissions[`${res.id}-del`]}
                    onChange={() =>
                      setPermissions({
                        ...permissions,
                        [`${res.id}-del`]: !permissions[`${res.id}-del`],
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          number="26"
          title="Star Rating Selector"
          category="cat6"
          code={`<div className="flex gap-1">\n  {[1,2,3,4,5].map(s => <Star key={s} onClick={() => setRating(s)} />)}\n</div>`}
        >
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || starRating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => {
                    setStarRating(star);
                    triggerToast(`Rating recorded: ${star} out of 5 stars`);
                  }}
                  className="p-1 hover:scale-110 transition cursor-pointer"
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      active ? "fill-amber-400 text-amber-500" : "text-zinc-300"
                    }`}
                  />
                </button>
              );
            })}
            <span className="ml-2 text-xs font-sans tabular-nums font-bold text-zinc-700">
              {hoverRating || starRating} / 5
            </span>
          </div>
        </Card>
      </div>

      {/* ── CODE MODAL ── */}
      {activeCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-950 border border-white/10 text-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {activeCodeModal.title} TSX Snippet
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCodeModal(null)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-black/50 border border-white/10 font-sans tabular-nums text-xs text-zinc-300 overflow-x-auto leading-relaxed">
              <code>{activeCodeModal.code}</code>
            </pre>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveCodeModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-4 py-2 rounded-xl bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{codeCopied ? "Copied" : "Copy TSX Code"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
