"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

export type CornerRadiusPreset = 0 | 8 | 16 | 24;
export type HeightDensityPreset = 40 | 44 | 48 | 52;
export type MenuOffsetPreset = 4 | 8 | 10 | 14;
export type MotionPhysicsPreset = "linear" | "damped" | "elastic";

export interface ZeroLightTokens {
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

  // Live Input Atom States
  const [textInput, setTextInput] = useState<string>("");

  // Select Atom State
  const [region, setRegion] = useState<string>("");
  const [regionFilter, setRegionFilter] = useState<string>("");
  const [isRegionOpen, setIsRegionOpen] = useState<boolean>(false);
  const regionRef = useRef<HTMLDivElement>(null);

  // Multi-Select Tags State
  const [permissions, setPermissions] = useState<string[]>(["View Invoices"]);
  const [isPermOpen, setIsPermOpen] = useState<boolean>(false);
  const permRef = useRef<HTMLDivElement>(null);

  // Action Atom States
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dismiss dropdowns on outside click or Escape key
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

  // Transition curve mapping
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
                  Navigation
                </div>
                <div className="px-3 py-2 rounded-xl bg-neutral-100 text-neutral-900 font-semibold text-xs flex items-center justify-between cursor-pointer">
                  <span>Atoms Studio</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                </div>
                <a
                  href="#input-atoms"
                  className="block px-3 py-2 rounded-xl text-xs text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                >
                  Input Atoms
                </a>
                <a
                  href="#action-atoms"
                  className="block px-3 py-2 rounded-xl text-xs text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                >
                  Action Atoms
                </a>
              </div>

              <div className="space-y-1 pt-2 border-t border-neutral-100">
                <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-neutral-400">
                  SaaS Atoms Index
                </div>
                <div className="px-3 py-1.5 text-xs text-neutral-600 flex items-center justify-between">
                  <span>Text Input</span>
                  <span className="text-[10px] text-neutral-400">Capture</span>
                </div>
                <div className="px-3 py-1.5 text-xs text-neutral-600 flex items-center justify-between">
                  <span>Search Select</span>
                  <span className="text-[10px] text-neutral-400">Dropdown</span>
                </div>
                <div className="px-3 py-1.5 text-xs text-neutral-600 flex items-center justify-between">
                  <span>Tag Select</span>
                  <span className="text-[10px] text-neutral-400">Multi</span>
                </div>
                <div className="px-3 py-1.5 text-xs text-neutral-600 flex items-center justify-between">
                  <span>Action Buttons</span>
                  <span className="text-[10px] text-neutral-400">Exec</span>
                </div>
              </div>
            </nav>
          </div>

          <div className="text-[11px] text-neutral-400 font-normal leading-relaxed pt-4 border-t border-neutral-100">
            ZeroLight Atomic Studio
            <div className="text-neutral-300 text-[10px]">Pure First Principles</div>
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════════════
            COLUMN 2: CENTER STAGE (LIVE ATOMS WORKBENCH)
           ══════════════════════════════════════════════════════════ */}
        <main className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-start overflow-y-auto">
          <div className="w-full max-w-[460px] space-y-6">
            {/* Live Atoms Card */}
            <div
              style={{
                backgroundColor: tokens.universalFillColor,
                borderColor: tokens.universalBorderColor,
                borderWidth: `${tokens.borderWidth}px`,
                borderRadius: "28px",
                transition: getTransitionStyle(),
              }}
              className="border shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-7 space-y-7"
            >
              {/* --- INPUT ATOMS --- */}
              <div id="input-atoms" className="space-y-4">
                <span className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase select-none block">
                  INPUT ATOMS
                </span>

                {/* 1. Text Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center" style={{ fontSize: `${tokens.fontSize - 2}px` }}>
                    <span className="font-medium text-neutral-800">1. Text Input</span>
                    <span className="text-neutral-400 font-normal">Leading Icon</span>
                  </div>
                  <div
                    style={{
                      height: `${tokens.heightDensity}px`,
                      borderRadius: `${tokens.cornerRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      fontSize: `${tokens.fontSize}px`,
                      transition: getTransitionStyle(),
                    }}
                    className="px-3.5 flex items-center bg-white border focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/10"
                  >
                    <svg
                      className="w-4 h-4 text-neutral-400 mr-2.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" />
                    </svg>
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Search invoices or customer ID..."
                      style={{ color: tokens.textIconColor }}
                      className="w-full bg-transparent placeholder:text-neutral-400 focus:outline-none"
                    />
                    {textInput && (
                      <button
                        type="button"
                        onClick={() => setTextInput("")}
                        aria-label="Clear input"
                        className="text-neutral-400 hover:text-neutral-700 p-1 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Searchable Select */}
                <div ref={regionRef} className="space-y-1.5 relative">
                  <div className="flex justify-between items-center" style={{ fontSize: `${tokens.fontSize - 2}px` }}>
                    <span className="font-medium text-neutral-800">2. Searchable Select</span>
                    <span className="text-neutral-400 font-normal">Regional Gateway</span>
                  </div>
                  <div
                    onClick={() => setIsRegionOpen(!isRegionOpen)}
                    role="button"
                    tabIndex={0}
                    style={{
                      height: `${tokens.heightDensity}px`,
                      borderRadius: `${tokens.cornerRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      fontSize: `${tokens.fontSize}px`,
                      transition: getTransitionStyle(),
                    }}
                    className="px-3.5 flex items-center justify-between bg-white border cursor-pointer select-none hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                  >
                    <div className="flex items-center min-w-0 mr-2">
                      <svg
                        className="w-4 h-4 text-neutral-400 mr-2.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20" strokeLinecap="round" />
                      </svg>
                      <span className={`truncate ${region ? "text-neutral-900 font-medium" : "text-neutral-400"}`}>
                        {region || "Select cluster region..."}
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                      <svg
                        className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${isRegionOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Dropdown Popover */}
                  {isRegionOpen && (
                    <div
                      style={{
                        top: `calc(${tokens.heightDensity}px + ${tokens.menuOffsetGap}px + 20px)`,
                        borderRadius: `${Math.max(12, tokens.cornerRadius)}px`,
                        transition: getTransitionStyle(),
                      }}
                      className="absolute left-0 right-0 z-30 bg-white border border-[#E5E5E5] shadow-xl p-2 space-y-1"
                    >
                      <div className="px-2 pb-1.5 pt-0.5 border-b border-neutral-100">
                        <input
                          type="text"
                          value={regionFilter}
                          onChange={(e) => setRegionFilter(e.target.value)}
                          placeholder="Search regions..."
                          autoFocus
                          className="w-full bg-neutral-50 px-2.5 py-1 text-xs rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-0.5 pt-1">
                        {filteredRegions.length === 0 ? (
                          <div className="px-3 py-2 text-xs text-neutral-400 text-center">No matching regions</div>
                        ) : (
                          filteredRegions.map((opt) => (
                            <div
                              key={opt}
                              onClick={() => {
                                setRegion(opt);
                                setIsRegionOpen(false);
                                setRegionFilter("");
                              }}
                              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                                region === opt
                                  ? "bg-neutral-100 text-neutral-900 font-semibold"
                                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                              }`}
                            >
                              <span>{opt}</span>
                              {region === opt && (
                                <svg className="w-3.5 h-3.5 text-neutral-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Multi-Select Tags */}
                <div ref={permRef} className="space-y-1.5 relative">
                  <div className="flex justify-between items-center" style={{ fontSize: `${tokens.fontSize - 2}px` }}>
                    <span className="font-medium text-neutral-800">3. Multi-Select Tags</span>
                    <span className="text-neutral-400 font-normal">Security Scopes</span>
                  </div>
                  <div
                    onClick={() => setIsPermOpen(!isPermOpen)}
                    role="button"
                    tabIndex={0}
                    style={{
                      minHeight: `${tokens.heightDensity}px`,
                      borderRadius: `${tokens.cornerRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      fontSize: `${tokens.fontSize}px`,
                      transition: getTransitionStyle(),
                    }}
                    className="px-3.5 py-1.5 flex items-center justify-between bg-white border cursor-pointer select-none hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                  >
                    <div className="flex items-center flex-wrap gap-1.5 min-w-0 mr-2 py-0.5">
                      <svg
                        className="w-4 h-4 text-neutral-400 mr-1 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>

                      {permissions.length === 0 ? (
                        <span className="text-xs text-neutral-400">Assign permissions...</span>
                      ) : (
                        permissions.map((p) => (
                          <span
                            key={p}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-neutral-100 text-neutral-900 text-[11px] font-medium border border-neutral-200"
                          >
                            <span>{p}</span>
                            <button
                              type="button"
                              onClick={(e) => handleRemovePermission(p, e)}
                              className="hover:text-neutral-500 rounded p-0.5"
                            >
                              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))
                      )}
                    </div>

                    <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                      <svg
                        className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${isPermOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Multi-Select Menu */}
                  {isPermOpen && (
                    <div
                      style={{
                        top: `calc(${tokens.heightDensity}px + ${tokens.menuOffsetGap}px + 20px)`,
                        borderRadius: `${Math.max(12, tokens.cornerRadius)}px`,
                        transition: getTransitionStyle(),
                      }}
                      className="absolute left-0 right-0 z-30 bg-white border border-[#E5E5E5] shadow-xl p-2 space-y-1"
                    >
                      {PERMISSION_OPTIONS.map((perm) => {
                        const isSelected = permissions.includes(perm);
                        return (
                          <div
                            key={perm}
                            onClick={() => handleTogglePermission(perm)}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer hover:bg-neutral-50 transition-colors select-none"
                          >
                            <span className={isSelected ? "font-semibold text-neutral-900" : "text-neutral-600"}>
                              {perm}
                            </span>
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                                isSelected
                                  ? "bg-neutral-900 border-neutral-900 text-white"
                                  : "border-neutral-300 bg-white"
                              }`}
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

              {/* --- ACTION ATOMS --- */}
              <div id="action-atoms" className="space-y-3.5 pt-1">
                <span className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase select-none block">
                  ACTION ATOMS
                </span>

                {/* Row 1: Confirm & Export */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleConfirm}
                    style={{
                      backgroundColor: tokens.primaryButtonColor,
                      borderRadius: `${tokens.cornerRadius}px`,
                      height: `${tokens.heightDensity}px`,
                      fontSize: `${tokens.fontSize - 1}px`,
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
                    onClick={() => triggerToast("Exporting payload...")}
                    style={{
                      borderRadius: `${tokens.cornerRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      height: `${tokens.heightDensity}px`,
                      fontSize: `${tokens.fontSize - 1}px`,
                      transition: getTransitionStyle(),
                    }}
                    className="px-4 bg-white text-[#111111] font-semibold flex items-center justify-center gap-2 border hover:bg-neutral-50 tactile-press"
                  >
                    <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <span>Export</span>
                  </button>
                </div>

                {/* Row 2: Next Step & Revoke */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => triggerToast("Next step initiated")}
                    style={{
                      borderRadius: `${tokens.cornerRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      height: `${tokens.heightDensity}px`,
                      fontSize: `${tokens.fontSize - 1}px`,
                      transition: getTransitionStyle(),
                    }}
                    className="px-4 bg-white text-[#111111] font-semibold flex items-center justify-center gap-2 border hover:bg-neutral-50 tactile-press"
                  >
                    <span>Next Step</span>
                    <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerToast("Action revoked")}
                    style={{
                      borderRadius: `${tokens.cornerRadius}px`,
                      height: `${tokens.heightDensity}px`,
                      fontSize: `${tokens.fontSize - 1}px`,
                      transition: getTransitionStyle(),
                    }}
                    className="px-4 bg-white text-[#E11D48] font-semibold flex items-center justify-center gap-2 border border-[#FECDD3] hover:bg-rose-50/50 tactile-press"
                  >
                    <svg className="w-4 h-4 text-[#E11D48]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    <span>Revoke</span>
                  </button>
                </div>

                {/* Row 3: Square Icon Triggers & Status Indicator */}
                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    title="Settings"
                    onClick={() => triggerToast("Opening settings")}
                    style={{
                      borderRadius: `${Math.max(10, tokens.cornerRadius - 4)}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      transition: getTransitionStyle(),
                    }}
                    className="w-10 h-10 bg-white border flex items-center justify-center text-neutral-600 hover:text-neutral-900 tactile-press"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopy}
                    title="Copy identifier"
                    style={{
                      borderRadius: `${Math.max(10, tokens.cornerRadius - 4)}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      transition: getTransitionStyle(),
                    }}
                    className="w-10 h-10 bg-white border flex items-center justify-center text-neutral-600 hover:text-neutral-900 tactile-press"
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

                  <div className="ml-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#E5E5E5] text-xs font-medium text-neutral-600 shadow-sm select-none">
                    <span className="w-2 h-2 rounded-full border-2 border-neutral-400 border-t-neutral-800 animate-spin" />
                    <span>{isSyncing ? "Syncing..." : "Live"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ══════════════════════════════════════════════════════════
            COLUMN 3: RIGHT SIDEBAR ("VISUAL STUDIO" TOKEN INSPECTOR)
           ══════════════════════════════════════════════════════════ */}
        <aside className="w-80 border-l border-[#EBEBEB] bg-[#FFFFFF] p-6 hidden xl:flex flex-col justify-between select-none sticky top-0 h-screen overflow-y-auto">
          <div className="space-y-6">
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

            {/* 1. COLOR TOKENS */}
            <div className="space-y-3">
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
            <div className="space-y-3 pt-3 border-t border-neutral-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                2. Geometry &amp; Spatial Tokens
              </div>

              {/* Border Width Scale Slider (0px to 5px) */}
              <div className="space-y-1.5 text-xs">
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
                  className="w-full"
                />
              </div>

              {/* Universal Corner Radius (0px, 8px, 16px, 24px) */}
              <div className="space-y-1.5 text-xs">
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
              <div className="space-y-1.5 text-xs">
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
              <div className="space-y-1.5 text-xs">
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
            <div className="space-y-3 pt-3 border-t border-neutral-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                3. Typography Token
              </div>

              {/* Font Size Scale (13px to 16px) */}
              <div className="space-y-1.5 text-xs">
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
                  className="w-full"
                />
              </div>
            </div>

            {/* 4. MOTION & ANIMATION TOKEN */}
            <div className="space-y-3 pt-3 border-t border-neutral-100">
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
