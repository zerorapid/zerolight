"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

export type CornerRadiusPreset = 0 | 8 | 16 | 24;
export type HeightDensityPreset = 40 | 44 | 48 | 52;
export type MenuOffsetPreset = 4 | 8 | 10 | 14;
export type MotionPhysicsPreset = "linear" | "damped" | "elastic";

export interface ZeroLightTokens {
  scaleMultiplier: number;
  universalBorderColor: string;
  universalFillColor: string;
  textIconColor: string;
  primaryButtonColor: string;
  hoverBackplateTint: string;
  borderWidth: number;
  cornerRadius: CornerRadiusPreset;
  heightDensity: HeightDensityPreset;
  menuOffsetGap: MenuOffsetPreset;
  fontSize: number;
  motionPhysics: MotionPhysicsPreset;
}

const DEFAULT_TOKENS: ZeroLightTokens = {
  scaleMultiplier: 1.0,
  universalBorderColor: "#D4D4D4",
  universalFillColor: "#FFFFFF",
  textIconColor: "#111111",
  primaryButtonColor: "#171717",
  hoverBackplateTint: "#F0F0F0",
  borderWidth: 1,
  cornerRadius: 16,
  heightDensity: 48,
  menuOffsetGap: 8,
  fontSize: 14,
  motionPhysics: "damped",
};

const REGION_OPTIONS = [
  "North America (us-east-1)",
  "Europe (eu-central-1)",
  "Asia Pacific (ap-south-1)",
  "South East (ap-southeast-1)",
];

const PERMISSION_OPTIONS = [
  "View Invoices",
  "Manage Approvals",
  "Execute Settlement",
  "Administrator Access",
];

export default function ZeroLightStudio() {
  const [tokens, setTokens] = useState<ZeroLightTokens>(DEFAULT_TOKENS);

  // Live Atom States
  const [textInput, setTextInput] = useState<string>("acme-workspace-prod");
  const [region, setRegion] = useState<string>("North America (us-east-1)");
  const [regionFilter, setRegionFilter] = useState<string>("");
  const [isRegionOpen, setIsRegionOpen] = useState<boolean>(false);
  const regionRef = useRef<HTMLDivElement>(null);

  const [permissions, setPermissions] = useState<string[]>([
    "View Invoices",
    "Manage Approvals",
  ]);
  const [isPermOpen, setIsPermOpen] = useState<boolean>(false);
  const permRef = useRef<HTMLDivElement>(null);

  // Dynamic Hover States for Dropdowns
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredPerm, setHoveredPerm] = useState<string | null>(null);

  const [checkboxChecked, setCheckboxChecked] = useState<boolean>(true);
  const [switchEnabled, setSwitchEnabled] = useState<boolean>(true);
  const [sliderValue, setSliderValue] = useState<number>(64);

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Outside click & Escape dismiss
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setIsRegionOpen(false);
      }
      if (permRef.current && !permRef.current.contains(e.target as Node)) {
        setIsPermOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsRegionOpen(false);
        setIsPermOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const handleResetDefaults = () => {
    setTokens(DEFAULT_TOKENS);
    triggerToast("Reset tokens to defaults");
  };

  const handleTogglePermission = (perm: string) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleRemovePermission = (perm: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPermissions((prev) => prev.filter((p) => p !== perm));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("https://zerolight.dev");
    setCopied(true);
    triggerToast("Copied link to clipboard");
    setTimeout(() => setCopied(false), 1800);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setIsSyncing(true);
    triggerToast("Action confirmed");
    setTimeout(() => {
      setConfirmed(false);
      setIsSyncing(false);
    }, 2000);
  };

  const filteredRegions = REGION_OPTIONS.filter((opt) =>
    opt.toLowerCase().includes(regionFilter.toLowerCase())
  );

  // Dynamic Scale Calculations
  const scale = tokens.scaleMultiplier;
  const scaledHeight = Math.round(tokens.heightDensity * scale);
  const scaledFontSize = Math.round(tokens.fontSize * scale);
  const scaledRadius = Math.round(tokens.cornerRadius * scale);
  const scaledPaddingX = Math.round(16 * scale);
  const scaledPaddingY = Math.round(10 * scale);
  const scaledCardRadius = Math.round(24 * scale);

  const getTransitionStyle = () => {
    switch (tokens.motionPhysics) {
      case "linear":
        return "all 0.15s linear";
      case "elastic":
        return "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      case "damped":
      default:
        return "all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)";
    }
  };

  // Reusable card styling
  const cardStyle = {
    backgroundColor: tokens.universalFillColor,
    borderColor: tokens.universalBorderColor,
    borderWidth: `${tokens.borderWidth}px`,
    borderRadius: `${scaledCardRadius}px`,
    transition: getTransitionStyle(),
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] flex flex-col font-sans selection:bg-neutral-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#111111] text-white text-xs font-medium px-4 py-2 rounded-xl shadow-xl flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3-Column Studio Body */}
      <div className="flex-1 flex w-full">
        {/* ══════════════════════════════════════════════════════════
            COLUMN 1: LEFT SIDEBAR (ATOMS DIRECTORY)
           ══════════════════════════════════════════════════════════ */}
        <aside className="w-64 border-r border-[#EBEBEB] bg-[#FFFFFF] p-6 hidden lg:flex flex-col justify-between select-none sticky top-0 h-screen overflow-y-auto">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#111111] flex items-center justify-center font-bold text-xs text-white shadow-sm">
                ZL
              </div>
              <span className="font-semibold text-sm tracking-tight text-[#111111]">
                ZeroLight
              </span>
            </Link>

            <nav className="space-y-4">
              <div className="space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-neutral-400">
                  Directory
                </div>
                <div className="px-3 py-2 rounded-xl bg-neutral-100 text-neutral-900 font-semibold text-xs flex items-center justify-between">
                  <span>Atoms Studio</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                </div>
              </div>

              {/* Data Capture Atoms */}
              <div className="space-y-1 pt-2 border-t border-neutral-100">
                <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-neutral-400">
                  Data Capture Atoms
                </div>
                <a
                  href="#text-input"
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>Text Input</span>
                  <span className="text-[10px] text-neutral-400">Capture</span>
                </a>
                <a
                  href="#search-select"
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>Search Select</span>
                  <span className="text-[10px] text-neutral-400">Choice</span>
                </a>
                <a
                  href="#tag-select"
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>Tag Select</span>
                  <span className="text-[10px] text-neutral-400">Multi</span>
                </a>
                <a
                  href="#binary-toggles"
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>Checkbox &amp; Switch</span>
                  <span className="text-[10px] text-neutral-400">Toggle</span>
                </a>
                <a
                  href="#slider"
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>Slider Atom</span>
                  <span className="text-[10px] text-neutral-400">Range</span>
                </a>
              </div>

              {/* Action Atoms */}
              <div className="space-y-1 pt-2 border-t border-neutral-100">
                <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-neutral-400">
                  Action Atoms
                </div>
                <a
                  href="#action-buttons"
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>Action Buttons</span>
                  <span className="text-[10px] text-neutral-400">Exec</span>
                </a>
                <a
                  href="#micro-actions"
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>Micro Actions</span>
                  <span className="text-[10px] text-neutral-400">Utility</span>
                </a>
              </div>

              {/* Feedback Atoms */}
              <div className="space-y-1 pt-2 border-t border-neutral-100">
                <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-neutral-400">
                  Telemetry &amp; Perception
                </div>
                <a
                  href="#telemetry"
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>Status &amp; Telemetry</span>
                  <span className="text-[10px] text-neutral-400">Metric</span>
                </a>
                <a
                  href="#loading-placeholders"
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>Loading &amp; Shimmer</span>
                  <span className="text-[10px] text-neutral-400">State</span>
                </a>
              </div>
            </nav>
          </div>

          <div className="text-[11px] text-neutral-400 font-normal leading-relaxed pt-4 border-t border-neutral-100">
            ZeroLight Atomic Studio
            <div className="text-neutral-300 text-[10px]">Scale: {tokens.scaleMultiplier.toFixed(2)}x</div>
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════════════
            COLUMN 2: CENTER STAGE (INDIVIDUAL ATOMS SHOWCASE)
           ══════════════════════════════════════════════════════════ */}
        <main className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-start overflow-y-auto">
          <div className="w-full max-w-[540px] space-y-6 pb-24">
            
            {/* Stage Title */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <div>
                <h1 className="text-base font-bold text-neutral-900 tracking-tight">ZeroLight Atoms Workbench</h1>
                <p className="text-xs text-neutral-500">Individually calibrated and tested across micro-interactions.</p>
              </div>
              <span className="text-[11px] font-semibold text-neutral-600 bg-white border border-neutral-200 px-2.5 py-1 rounded-full shadow-sm">
                Scale: {tokens.scaleMultiplier.toFixed(2)}x
              </span>
            </div>

            {/* ── CARD 1: TEXT INPUT ATOM ── */}
            <div id="text-input" style={cardStyle} className="p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">1. Text Input Atom</h2>
                  <p className="text-[11px] text-neutral-400">Single-line data capture with leading glyph and tactile clear action</p>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                  Capture
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-neutral-700">Workspace Identifier</span>
                  <span className="text-[10px] text-neutral-400">{textInput.length} chars</span>
                </div>
                <div
                  style={{
                    borderRadius: `${scaledRadius}px`,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    backgroundColor: tokens.universalFillColor,
                    height: `${scaledHeight}px`,
                    paddingLeft: `${scaledPaddingX}px`,
                    paddingRight: `${scaledPaddingX}px`,
                    transition: getTransitionStyle(),
                  }}
                  className="flex items-center gap-2.5 shadow-sm focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/10 transition-shadow"
                >
                  <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Search invoices or customer ID..."
                    style={{
                      fontSize: `${scaledFontSize}px`,
                      color: tokens.textIconColor,
                    }}
                    className="w-full bg-transparent outline-none placeholder:text-neutral-400"
                  />
                  {textInput && (
                    <button
                      type="button"
                      onClick={() => setTextInput("")}
                      className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
                      title="Clear field"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── CARD 2: SEARCHABLE SELECT ATOM ── */}
            <div id="search-select" style={cardStyle} className="p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">2. Searchable Select Atom</h2>
                  <p className="text-[11px] text-neutral-400">Contextual popover menu with query filtering and outside-click dismiss</p>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                  Choice
                </span>
              </div>

              <div ref={regionRef} className="relative space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-neutral-700">Cluster Region</span>
                  <span className="text-[10px] text-neutral-400">Regional Gateway</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsRegionOpen((prev) => !prev)}
                  style={{
                    borderRadius: `${scaledRadius}px`,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    backgroundColor: tokens.universalFillColor,
                    height: `${scaledHeight}px`,
                    paddingLeft: `${scaledPaddingX}px`,
                    paddingRight: `${scaledPaddingX}px`,
                    transition: getTransitionStyle(),
                  }}
                  className="w-full flex items-center justify-between shadow-sm hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 text-left"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <circle cx="12" cy="12" r="10" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20" />
                    </svg>
                    <span
                      style={{
                        fontSize: `${scaledFontSize}px`,
                        color: region ? tokens.textIconColor : "#A3A3A3",
                      }}
                      className="truncate font-normal"
                    >
                      {region || "Select cluster region..."}
                    </span>
                  </div>
                  <div
                    style={{
                      borderRadius: `${Math.max(6, scaledRadius - 8)}px`,
                      backgroundColor: tokens.hoverBackplateTint,
                      color: tokens.textIconColor,
                      transition: getTransitionStyle(),
                    }}
                    className="w-6 h-6 flex items-center justify-center shrink-0"
                  >
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${isRegionOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>

                {/* Popover Dropdown */}
                {isRegionOpen && (
                  <div
                    style={{
                      marginTop: `${tokens.menuOffsetGap}px`,
                      borderRadius: `${scaledRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      backgroundColor: tokens.universalFillColor,
                      boxShadow: "0 14px 35px -4px rgba(0,0,0,0.12), 0 4px 6px -2px rgba(0,0,0,0.04)",
                      padding: `${Math.round(8 * scale)}px`,
                      transition: getTransitionStyle(),
                    }}
                    className="absolute top-full left-0 right-0 z-30 space-y-1.5"
                  >
                    <input
                      type="text"
                      autoFocus
                      value={regionFilter}
                      onChange={(e) => setRegionFilter(e.target.value)}
                      placeholder="Filter regions..."
                      style={{
                        borderRadius: `${Math.max(6, scaledRadius - 4)}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.universalFillColor,
                        color: tokens.textIconColor,
                        fontSize: `${scaledFontSize - 2}px`,
                        padding: `${Math.round(6 * scale)}px ${Math.round(10 * scale)}px`,
                        transition: getTransitionStyle(),
                      }}
                      className="w-full outline-none focus:ring-1 focus:ring-neutral-900/20"
                    />
                    <div className="max-h-48 overflow-y-auto space-y-0.5 pt-1">
                      {filteredRegions.length === 0 ? (
                        <div className="py-2 text-center text-xs text-neutral-400">No match found</div>
                      ) : (
                        filteredRegions.map((opt) => {
                          const isSelected = region === opt;
                          const isHovered = hoveredRegion === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onMouseEnter={() => setHoveredRegion(opt)}
                              onMouseLeave={() => setHoveredRegion(null)}
                              onClick={() => {
                                setRegion(opt);
                                setIsRegionOpen(false);
                                setRegionFilter("");
                              }}
                              style={{
                                borderRadius: `${Math.max(6, scaledRadius - 4)}px`,
                                backgroundColor: isSelected
                                  ? tokens.primaryButtonColor
                                  : isHovered
                                  ? tokens.hoverBackplateTint
                                  : "transparent",
                                color: isSelected ? "#FFFFFF" : tokens.textIconColor,
                                fontSize: `${scaledFontSize - 1}px`,
                                padding: `${Math.round(8 * scale)}px ${Math.round(12 * scale)}px`,
                                transition: getTransitionStyle(),
                              }}
                              className="w-full text-left flex items-center justify-between font-normal cursor-pointer"
                            >
                              <span>{opt}</span>
                              {isSelected && (
                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── CARD 3: MULTI-SELECT TAGS ATOM ── */}
            <div id="tag-select" style={cardStyle} className="p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">3. Multi-Select Tags Atom</h2>
                  <p className="text-[11px] text-neutral-400">Removable chip tags with quick permission scope assigner</p>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                  Multi
                </span>
              </div>

              <div ref={permRef} className="relative space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-neutral-700">Security Scopes</span>
                  <span className="text-[10px] text-neutral-400">{permissions.length} selected</span>
                </div>

                <div
                  onClick={() => setIsPermOpen((prev) => !prev)}
                  style={{
                    borderRadius: `${scaledRadius}px`,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    backgroundColor: tokens.universalFillColor,
                    minHeight: `${scaledHeight}px`,
                    padding: `${scaledPaddingY}px ${scaledPaddingX}px`,
                    transition: getTransitionStyle(),
                  }}
                  className="flex flex-wrap items-center gap-1.5 shadow-sm cursor-pointer hover:opacity-95"
                >
                  <svg className="w-4 h-4 text-neutral-400 shrink-0 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>

                  {permissions.map((perm) => (
                    <span
                      key={perm}
                      style={{
                        borderRadius: `${Math.max(6, scaledRadius - 8)}px`,
                        fontSize: `${Math.max(10, scaledFontSize - 3)}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        color: tokens.textIconColor,
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 font-medium border"
                    >
                      <span>{perm}</span>
                      <button
                        type="button"
                        onClick={(e) => handleRemovePermission(perm, e)}
                        className="hover:text-red-600 transition-colors"
                        title="Remove tag"
                      >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}

                  <span className="text-neutral-400 text-xs ml-auto flex items-center gap-1">
                    <span>Add</span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${isPermOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>

                {/* Dropdown Options */}
                {isPermOpen && (
                  <div
                    style={{
                      marginTop: `${tokens.menuOffsetGap}px`,
                      borderRadius: `${scaledRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      backgroundColor: tokens.universalFillColor,
                      boxShadow: "0 14px 35px -4px rgba(0,0,0,0.12), 0 4px 6px -2px rgba(0,0,0,0.04)",
                      padding: `${Math.round(8 * scale)}px`,
                      transition: getTransitionStyle(),
                    }}
                    className="absolute top-full left-0 right-0 z-30 space-y-1"
                  >
                    {PERMISSION_OPTIONS.map((opt) => {
                      const isSelected = permissions.includes(opt);
                      const isHovered = hoveredPerm === opt;
                      return (
                        <div
                          key={opt}
                          onMouseEnter={() => setHoveredPerm(opt)}
                          onMouseLeave={() => setHoveredPerm(null)}
                          onClick={() => handleTogglePermission(opt)}
                          style={{
                            borderRadius: `${Math.max(6, scaledRadius - 4)}px`,
                            backgroundColor: isHovered ? tokens.hoverBackplateTint : "transparent",
                            color: tokens.textIconColor,
                            fontSize: `${scaledFontSize - 1}px`,
                            padding: `${Math.round(8 * scale)}px ${Math.round(12 * scale)}px`,
                            transition: getTransitionStyle(),
                          }}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <span className={isSelected ? "font-semibold" : "font-normal"}>
                            {opt}
                          </span>
                          <div
                            style={{
                              borderRadius: `${Math.max(4, scaledRadius - 10)}px`,
                              backgroundColor: isSelected ? tokens.primaryButtonColor : tokens.universalFillColor,
                              borderColor: isSelected ? tokens.primaryButtonColor : tokens.universalBorderColor,
                              borderWidth: `${tokens.borderWidth}px`,
                              transition: getTransitionStyle(),
                            }}
                            className="w-4 h-4 flex items-center justify-center shrink-0 border"
                          >
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                              </svg>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ── CARD 4: CHECKBOX & SWITCH ATOMS ── */}
            <div id="binary-toggles" style={cardStyle} className="p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">4. Binary Selection Atoms</h2>
                  <p className="text-[11px] text-neutral-400">Tactile checkmark and sliding kinetic switch with optical centering</p>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                  Boolean
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {/* Checkbox Atom */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => setCheckboxChecked((prev) => !prev)}
                    style={{
                      borderRadius: `${Math.max(6, scaledRadius - 10)}px`,
                      backgroundColor: checkboxChecked ? tokens.primaryButtonColor : tokens.universalFillColor,
                      borderColor: checkboxChecked ? tokens.primaryButtonColor : tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      transition: getTransitionStyle(),
                    }}
                    className="w-5 h-5 flex items-center justify-center shrink-0 border transition-colors cursor-pointer"
                  >
                    {checkboxChecked && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: `${scaledFontSize}px`,
                      color: tokens.textIconColor,
                    }}
                    className="font-medium select-none"
                  >
                    Enable automated settlement notifications
                  </span>
                </label>

                {/* Switch Atom */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  <span
                    style={{
                      fontSize: `${scaledFontSize}px`,
                      color: tokens.textIconColor,
                    }}
                    className="font-medium select-none"
                  >
                    Real-time telemetry stream
                  </span>
                  <button
                    type="button"
                    onClick={() => setSwitchEnabled((prev) => !prev)}
                    style={{
                      backgroundColor: switchEnabled ? tokens.primaryButtonColor : tokens.universalBorderColor,
                      transition: getTransitionStyle(),
                    }}
                    className="w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors"
                  >
                    <div
                      style={{
                        backgroundColor: tokens.universalFillColor,
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.15)",
                        transition: getTransitionStyle(),
                      }}
                      className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        switchEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* ── CARD 5: SLIDER ATOM ── */}
            <div id="slider" style={cardStyle} className="p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">5. Continuous Value Slider Atom</h2>
                  <p className="text-[11px] text-neutral-400">Smooth range selector with live readouts and physical stops</p>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                  Range
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-neutral-700">Allocated Memory Capacity</span>
                  <span className="font-semibold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                    {sliderValue} GB
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="128"
                  step="4"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="w-full cursor-pointer accent-neutral-900"
                />
                <div className="flex justify-between text-[10px] text-neutral-400">
                  <span>4 GB (Base)</span>
                  <span>64 GB (Standard)</span>
                  <span>128 GB (Max)</span>
                </div>
              </div>
            </div>

            {/* ── CARD 6: ACTION BUTTONS ATOM ── */}
            <div id="action-buttons" style={cardStyle} className="p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">6. Action Buttons Atom</h2>
                  <p className="text-[11px] text-neutral-400">Physical click deflection (`active:scale-[0.985]`) and semantic states</p>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                  Interactive
                </span>
              </div>

              <div className="space-y-3">
                {/* Row 1: Primary Confirm & Secondary Export */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleConfirm}
                    style={{
                      backgroundColor: tokens.primaryButtonColor,
                      borderRadius: `${scaledRadius}px`,
                      height: `${scaledHeight}px`,
                      fontSize: `${scaledFontSize - 1}px`,
                      transition: getTransitionStyle(),
                    }}
                    className="px-4 text-white font-semibold flex items-center justify-center gap-2 shadow-sm tactile-press active:opacity-90"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>{confirmed ? "Confirmed" : "Confirm"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerToast("Exporting data bundle...")}
                    style={{
                      borderRadius: `${scaledRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      backgroundColor: tokens.universalFillColor,
                      color: tokens.textIconColor,
                      height: `${scaledHeight}px`,
                      fontSize: `${scaledFontSize - 1}px`,
                      transition: getTransitionStyle(),
                    }}
                    className="px-4 font-semibold flex items-center justify-center gap-2 border hover:opacity-90 tactile-press shadow-sm"
                  >
                    <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <span>Export</span>
                  </button>
                </div>

                {/* Row 2: Directional Step & Destructive Revoke */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => triggerToast("Proceeding to next step")}
                    style={{
                      borderRadius: `${scaledRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      backgroundColor: tokens.universalFillColor,
                      color: tokens.textIconColor,
                      height: `${scaledHeight}px`,
                      fontSize: `${scaledFontSize - 1}px`,
                      transition: getTransitionStyle(),
                    }}
                    className="px-4 font-semibold flex items-center justify-center gap-2 border hover:opacity-90 tactile-press shadow-sm"
                  >
                    <span>Next Step</span>
                    <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerToast("Revoked security token")}
                    style={{
                      borderRadius: `${scaledRadius}px`,
                      backgroundColor: tokens.universalFillColor,
                      height: `${scaledHeight}px`,
                      fontSize: `${scaledFontSize - 1}px`,
                      transition: getTransitionStyle(),
                    }}
                    className="px-4 text-[#E11D48] font-semibold flex items-center justify-center gap-2 border border-[#FECDD3] hover:bg-rose-50/50 tactile-press shadow-sm"
                  >
                    <svg className="w-4 h-4 text-[#E11D48]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    <span>Revoke</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── CARD 7: MICRO ACTION ATOMS ── */}
            <div id="micro-actions" style={cardStyle} className="p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">7. Micro Actions &amp; Utility Atoms</h2>
                  <p className="text-[11px] text-neutral-400">Compact square triggers and live background sync indicators</p>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                  Utility
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Settings Trigger */}
                <button
                  type="button"
                  title="Settings"
                  onClick={() => triggerToast("Opening settings dock")}
                  style={{
                    borderRadius: `${Math.max(8, scaledRadius - 6)}px`,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    backgroundColor: tokens.universalFillColor,
                    color: tokens.textIconColor,
                    width: `${Math.round(40 * scale)}px`,
                    height: `${Math.round(40 * scale)}px`,
                    transition: getTransitionStyle(),
                  }}
                  className="border flex items-center justify-center hover:opacity-90 tactile-press shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>

                {/* Copy Trigger */}
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy link"
                  style={{
                    borderRadius: `${Math.max(8, scaledRadius - 6)}px`,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    backgroundColor: tokens.universalFillColor,
                    color: tokens.textIconColor,
                    width: `${Math.round(40 * scale)}px`,
                    height: `${Math.round(40 * scale)}px`,
                    transition: getTransitionStyle(),
                  }}
                  className="border flex items-center justify-center hover:opacity-90 tactile-press shadow-sm"
                >
                  {copied ? (
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </button>

                {/* Live Sync Status Pill */}
                <div
                  style={{
                    height: `${Math.round(38 * scale)}px`,
                    borderRadius: `${scaledRadius}px`,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    backgroundColor: tokens.universalFillColor,
                    color: tokens.textIconColor,
                    fontSize: `${scaledFontSize - 2}px`,
                  }}
                  className="ml-auto inline-flex items-center gap-2 px-3.5 border shadow-sm select-none"
                >
                  <span className="w-2 h-2 rounded-full border-2 border-neutral-400 border-t-neutral-800 animate-spin" />
                  <span>{isSyncing ? "Syncing..." : "Live Runtime"}</span>
                </div>
              </div>
            </div>

            {/* ── CARD 8: TELEMETRY & STATUS ATOMS ── */}
            <div id="telemetry" style={cardStyle} className="p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">8. Status &amp; Telemetry Atoms</h2>
                  <p className="text-[11px] text-neutral-400">Semantic status indicators, pulse dots, and quantitative delta tags</p>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                  Feedback
                </span>
              </div>

              {/* Status Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Active</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Pending Approval</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium border border-neutral-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  <span>Offline</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Degraded</span>
                </span>
              </div>

              {/* Progress & Deltas */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-600 font-medium">Cluster Storage Quota</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">76%</span>
                    <span className="inline-flex items-center text-[10px] text-emerald-600 font-medium">
                      +14.2% MoM
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div className="h-full bg-neutral-900 rounded-full" style={{ width: "76%" }} />
                </div>
              </div>
            </div>

            {/* ── CARD 9: LOADING & PLACEHOLDER ATOMS ── */}
            <div id="loading-placeholders" style={cardStyle} className="p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">9. Loading &amp; Placeholder Atoms</h2>
                  <p className="text-[11px] text-neutral-400">Kinetic spinning loader and shimmer skeleton bar</p>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                  Perception
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin shrink-0" />
                  <span className="text-xs text-neutral-500">Resolving DNS route across distributed regions...</span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="h-3 w-3/4 bg-neutral-200 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-neutral-200 rounded animate-pulse" />
                </div>
              </div>
            </div>

          </div>
        </main>

        {/* ══════════════════════════════════════════════════════════
            COLUMN 3: RIGHT SIDEBAR ("VISUAL STUDIO" TOKEN INSPECTOR)
           ══════════════════════════════════════════════════════════ */}
        <aside className="w-80 border-l border-[#EBEBEB] bg-[#FFFFFF] p-6 hidden xl:flex flex-col justify-between select-none sticky top-0 h-screen overflow-y-auto">
          <div className="space-y-5">
            {/* Header with Reset Default */}
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                VISUAL STUDIO
              </span>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-xs text-neutral-400 hover:text-neutral-900 underline underline-offset-4 transition-colors font-medium"
              >
                Reset Default
              </button>
            </div>

            {/* 0. MASTER ATOM SCALE CONTROLLER */}
            <div className="space-y-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Atom Scale Multiplier
                </span>
                <span className="text-xs font-semibold text-neutral-900 bg-white border border-neutral-200 px-2 py-0.5 rounded-md shadow-sm">
                  {tokens.scaleMultiplier.toFixed(2)}x
                </span>
              </div>

              <input
                type="range"
                min="0.80"
                max="1.30"
                step="0.05"
                value={tokens.scaleMultiplier}
                onChange={(e) =>
                  setTokens((prev) => ({ ...prev, scaleMultiplier: Number(e.target.value) }))
                }
                className="w-full cursor-pointer accent-neutral-900"
              />

              <div className="grid grid-cols-4 gap-1 pt-1">
                {[
                  { label: "0.85x", val: 0.85 },
                  { label: "1.00x", val: 1.0 },
                  { label: "1.15x", val: 1.15 },
                  { label: "1.30x", val: 1.3 },
                ].map(({ label, val }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setTokens((prev) => ({ ...prev, scaleMultiplier: val }))}
                    className={`py-1 rounded-lg text-[10px] font-semibold border transition-colors ${
                      tokens.scaleMultiplier === val
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                        : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 1. COLOR TOKENS */}
            <div className="space-y-2.5 pt-2 border-t border-neutral-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                1. Color Tokens
              </div>

              {/* Universal Border Color */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-700">Universal Border Color</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400">{tokens.universalBorderColor.toUpperCase()}</span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.universalBorderColor }}
                      className="w-5 h-5 rounded-md border border-black/10 shadow-sm block transition-transform hover:scale-110"
                    />
                    <input
                      type="color"
                      value={tokens.universalBorderColor}
                      onChange={(e) => setTokens((prev) => ({ ...prev, universalBorderColor: e.target.value }))}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Universal Fill Color */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-700">Universal Fill Color</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400">{tokens.universalFillColor.toUpperCase()}</span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.universalFillColor }}
                      className="w-5 h-5 rounded-md border border-black/15 shadow-sm block transition-transform hover:scale-110"
                    />
                    <input
                      type="color"
                      value={tokens.universalFillColor}
                      onChange={(e) => setTokens((prev) => ({ ...prev, universalFillColor: e.target.value }))}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Text & Icon Color */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-700">Text &amp; Icon Color</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400">{tokens.textIconColor.toUpperCase()}</span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.textIconColor }}
                      className="w-5 h-5 rounded-md border border-black/10 shadow-sm block transition-transform hover:scale-110"
                    />
                    <input
                      type="color"
                      value={tokens.textIconColor}
                      onChange={(e) => setTokens((prev) => ({ ...prev, textIconColor: e.target.value }))}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Primary Button Color */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-700">Primary Button Color</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400">{tokens.primaryButtonColor.toUpperCase()}</span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.primaryButtonColor }}
                      className="w-5 h-5 rounded-md border border-black/10 shadow-sm block transition-transform hover:scale-110"
                    />
                    <input
                      type="color"
                      value={tokens.primaryButtonColor}
                      onChange={(e) => setTokens((prev) => ({ ...prev, primaryButtonColor: e.target.value }))}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Hover Backplate Tint */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-700">Hover Backplate Tint</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400">{tokens.hoverBackplateTint.toUpperCase()}</span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.hoverBackplateTint }}
                      className="w-5 h-5 rounded-md border border-black/10 shadow-sm block transition-transform hover:scale-110"
                    />
                    <input
                      type="color"
                      value={tokens.hoverBackplateTint}
                      onChange={(e) => setTokens((prev) => ({ ...prev, hoverBackplateTint: e.target.value }))}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* 2. GEOMETRY & SPATIAL TOKENS */}
            <div className="space-y-2.5 pt-2 border-t border-neutral-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                2. Geometry &amp; Spatial Tokens
              </div>

              {/* Border Width Scale Slider (0px to 5px) */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-700">Border Width Scale</span>
                  <span className="text-neutral-500 font-medium">{tokens.borderWidth}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={tokens.borderWidth}
                  onChange={(e) => setTokens((prev) => ({ ...prev, borderWidth: Number(e.target.value) }))}
                  className="w-full cursor-pointer accent-neutral-900"
                />
              </div>

              {/* Universal Corner Radius (0px, 8px, 16px, 24px) */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-700">Universal Corner Radius</span>
                  <span className="text-neutral-500 font-medium">{tokens.cornerRadius}px</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {([0, 8, 16, 24] as CornerRadiusPreset[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setTokens((prev) => ({ ...prev, cornerRadius: r }))}
                      className={`py-1 rounded-lg text-[10px] font-medium border transition-colors ${
                        tokens.cornerRadius === r
                          ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                          : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      {r === 0 ? "0px" : `${r}px`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Universal Height Density (40px, 44px, 48px, 52px) */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-700">Universal Height Density</span>
                  <span className="text-neutral-500 font-medium">{tokens.heightDensity}px</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {([40, 44, 48, 52] as HeightDensityPreset[]).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setTokens((prev) => ({ ...prev, heightDensity: h }))}
                      className={`py-1 rounded-lg text-[10px] font-medium border transition-colors ${
                        tokens.heightDensity === h
                          ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                          : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      {h}px
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu Offset Gap (4px, 8px, 10px, 14px) */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-700">Menu Offset Gap</span>
                  <span className="text-neutral-500 font-medium">{tokens.menuOffsetGap}px</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {([4, 8, 10, 14] as MenuOffsetPreset[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setTokens((prev) => ({ ...prev, menuOffsetGap: g }))}
                      className={`py-1 rounded-lg text-[10px] font-medium border transition-colors ${
                        tokens.menuOffsetGap === g
                          ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                          : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      {g}px
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. TYPOGRAPHY TOKEN */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                3. Typography Token
              </div>

              {/* Font Size Scale (13px to 16px) */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-700">Font Size Scale</span>
                  <span className="text-neutral-500 font-medium">{tokens.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="13"
                  max="16"
                  step="1"
                  value={tokens.fontSize}
                  onChange={(e) => setTokens((prev) => ({ ...prev, fontSize: Number(e.target.value) }))}
                  className="w-full cursor-pointer accent-neutral-900"
                />
              </div>
            </div>

            {/* 4. MOTION & ANIMATION TOKEN */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                4. Motion &amp; Animation Token
              </div>

              <div className="grid grid-cols-3 gap-1">
                {(
                  [
                    { key: "linear", label: "Linear" },
                    { key: "damped", label: "Damped" },
                    { key: "elastic", label: "Elastic" },
                  ] as { key: MotionPhysicsPreset; label: string }[]
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTokens((prev) => ({ ...prev, motionPhysics: key }))}
                    className={`py-1.5 rounded-lg text-[10px] font-medium border transition-colors ${
                      tokens.motionPhysics === key
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                        : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Global Reactive Tokens</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </aside>
      </div>
    </div>
  );
}
