"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ZeroLightSettings {
  universalBorderColor: string;
  universalFillColor: string;
  textIconColor: string;
  primaryButtonColor: string;
  borderWidth: number;
  cornerRadius: number;
}

const DEFAULT_SETTINGS: ZeroLightSettings = {
  universalBorderColor: "#D4D4D4",
  universalFillColor: "#FFFFFF",
  textIconColor: "#111111",
  primaryButtonColor: "#171717",
  borderWidth: 1,
  cornerRadius: 16,
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

export default function AtomsLightStudioPage() {
  const [settings, setSettings] = useState<ZeroLightSettings>(DEFAULT_SETTINGS);

  // Input states (simple React state)
  const [textInput, setTextInput] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [isRegionOpen, setIsRegionOpen] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<string[]>(["View Invoices"]);
  const [isPermOpen, setIsPermOpen] = useState<boolean>(false);

  // Action states
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const handleTogglePermission = (perm: string) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("https://zerolight.dev/atoms");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setIsSyncing(true);
    setTimeout(() => {
      setConfirmed(false);
      setIsSyncing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] flex font-sans selection:bg-neutral-200">
      {/* Clean Apple/Airbnb Sidebar */}
      <aside className="w-56 border-r border-[#EBEBEB] bg-[#FFFFFF] p-6 hidden md:flex flex-col justify-between select-none">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#111111] flex items-center justify-center font-bold text-xs text-white">
              ZL
            </div>
            <span className="font-semibold text-sm tracking-tight text-[#111111]">
              ZeroLight
            </span>
          </Link>

          <nav className="space-y-1">
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-100 text-neutral-900 font-semibold text-xs cursor-pointer">
              <span>Atoms</span>
              <span className="text-[10px] font-normal text-neutral-400 bg-white px-1.5 py-0.5 rounded-md border border-neutral-200">
                Studio
              </span>
            </div>
            <a
              href="#input-atoms"
              className="flex items-center px-3 py-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 text-xs transition-colors"
            >
              Inputs
            </a>
            <a
              href="#action-atoms"
              className="flex items-center px-3 py-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 text-xs transition-colors"
            >
              Actions
            </a>
            <a
              href="#visual-studio"
              className="flex items-center px-3 py-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 text-xs transition-colors"
            >
              Visual Studio
            </a>
          </nav>
        </div>

        <div className="text-[11px] text-neutral-400">
          ZeroLight UI • Apple &amp; Airbnb Spec
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-start overflow-y-auto">
        <div className="w-full max-w-[460px] space-y-6">
          {/* ══════════════════════════════════════════════════════════
              CARD 1: THE LIVE ATOMS SHOWCASE
             ══════════════════════════════════════════════════════════ */}
          <div
            style={{
              backgroundColor: settings.universalFillColor,
              borderColor: settings.universalBorderColor,
              borderWidth: `${settings.borderWidth}px`,
              borderRadius: "28px",
            }}
            className="border shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-7 space-y-7 transition-all duration-150"
          >
            {/* --- INPUT ATOMS --- */}
            <div id="input-atoms" className="space-y-4">
              <span className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase select-none block">
                INPUT ATOMS
              </span>

              {/* 1. Text Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-neutral-800">1. Text Input</span>
                  <span className="text-[11px] text-neutral-400 font-normal">Leading Icon</span>
                </div>
                <div
                  style={{
                    borderRadius: `${settings.cornerRadius}px`,
                    borderColor: settings.universalBorderColor,
                    borderWidth: `${settings.borderWidth}px`,
                  }}
                  className="h-11 px-3.5 flex items-center bg-white border transition-colors focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/10"
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
                    className="w-full bg-transparent text-xs text-[#111111] placeholder:text-neutral-400 focus:outline-none"
                  />
                  {textInput && (
                    <button
                      type="button"
                      onClick={() => setTextInput("")}
                      className="text-neutral-400 hover:text-neutral-600 p-1"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Searchable Select */}
              <div className="space-y-1.5 relative">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-neutral-800">2. Searchable Select</span>
                  <span className="text-[11px] text-neutral-400 font-normal">Regional Gateway</span>
                </div>
                <div
                  onClick={() => setIsRegionOpen(!isRegionOpen)}
                  style={{
                    borderRadius: `${settings.cornerRadius}px`,
                    borderColor: settings.universalBorderColor,
                    borderWidth: `${settings.borderWidth}px`,
                  }}
                  className="h-11 px-3.5 flex items-center justify-between bg-white border cursor-pointer select-none transition-colors hover:border-neutral-400"
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
                    <span className={`text-xs truncate ${region ? "text-neutral-900 font-medium" : "text-neutral-400"}`}>
                      {region || "Select cluster region..."}
                    </span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>

                {/* Dropdown Popover */}
                {isRegionOpen && (
                  <div className="absolute top-[68px] left-0 right-0 z-30 bg-white border border-[#E5E5E5] rounded-2xl shadow-xl p-1.5 space-y-0.5">
                    {REGION_OPTIONS.map((opt) => (
                      <div
                        key={opt}
                        onClick={() => {
                          setRegion(opt);
                          setIsRegionOpen(false);
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
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Multi-Select Tags */}
              <div className="space-y-1.5 relative">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-neutral-800">3. Multi-Select Tags</span>
                  <span className="text-[11px] text-neutral-400 font-normal">Security Scopes</span>
                </div>
                <div
                  onClick={() => setIsPermOpen(!isPermOpen)}
                  style={{
                    borderRadius: `${settings.cornerRadius}px`,
                    borderColor: settings.universalBorderColor,
                    borderWidth: `${settings.borderWidth}px`,
                  }}
                  className="h-11 px-3.5 flex items-center justify-between bg-white border cursor-pointer select-none transition-colors hover:border-neutral-400"
                >
                  <div className="flex items-center min-w-0 mr-2">
                    <svg
                      className="w-4 h-4 text-neutral-400 mr-2.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {permissions.length > 0 ? (
                      <span className="text-xs text-neutral-900 font-medium truncate">
                        {permissions.join(", ")}
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-400">Assign permissions...</span>
                    )}
                  </div>
                  <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>

                {/* Multi-Select Dropdown */}
                {isPermOpen && (
                  <div className="absolute top-[68px] left-0 right-0 z-30 bg-white border border-[#E5E5E5] rounded-2xl shadow-xl p-2 space-y-1">
                    {PERMISSION_OPTIONS.map((perm) => {
                      const isSelected = permissions.includes(perm);
                      return (
                        <div
                          key={perm}
                          onClick={() => handleTogglePermission(perm)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer hover:bg-neutral-50 transition-colors"
                        >
                          <span className={isSelected ? "font-semibold text-neutral-900" : "text-neutral-600"}>
                            {perm}
                          </span>
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
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
                    backgroundColor: settings.primaryButtonColor,
                    borderRadius: `${settings.cornerRadius}px`,
                  }}
                  className="h-11 px-4 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all tactile-press active:opacity-90"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span>{confirmed ? "Confirmed" : "Confirm"}</span>
                </button>

                <button
                  type="button"
                  style={{
                    borderRadius: `${settings.cornerRadius}px`,
                    borderColor: settings.universalBorderColor,
                    borderWidth: `${settings.borderWidth}px`,
                  }}
                  className="h-11 px-4 bg-white text-[#111111] text-xs font-semibold flex items-center justify-center gap-2 border hover:bg-neutral-50 transition-all tactile-press"
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
                  style={{
                    borderRadius: `${settings.cornerRadius}px`,
                    borderColor: settings.universalBorderColor,
                    borderWidth: `${settings.borderWidth}px`,
                  }}
                  className="h-11 px-4 bg-white text-[#111111] text-xs font-semibold flex items-center justify-center gap-2 border hover:bg-neutral-50 transition-all tactile-press"
                >
                  <span>Next Step</span>
                  <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </button>

                <button
                  type="button"
                  style={{
                    borderRadius: `${settings.cornerRadius}px`,
                  }}
                  className="h-11 px-4 bg-white text-[#E11D48] text-xs font-semibold flex items-center justify-center gap-2 border border-[#FECDD3] hover:bg-rose-50/50 transition-all tactile-press"
                >
                  <svg className="w-4 h-4 text-[#E11D48]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  <span>Revoke</span>
                </button>
              </div>

              {/* Row 3: Icon Buttons & Syncing Pill */}
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  title="Settings"
                  style={{
                    borderRadius: "14px",
                    borderColor: settings.universalBorderColor,
                    borderWidth: `${settings.borderWidth}px`,
                  }}
                  className="w-10 h-10 bg-white border flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors tactile-press"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy link"
                  style={{
                    borderRadius: "14px",
                    borderColor: settings.universalBorderColor,
                    borderWidth: `${settings.borderWidth}px`,
                  }}
                  className="w-10 h-10 bg-white border flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors tactile-press"
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
                  <span>Syncing...</span>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              CARD 2: THE "VISUAL STUDIO" EDITABLE SETTINGS DOCK
             ══════════════════════════════════════════════════════════ */}
          <div
            id="visual-studio"
            className="bg-white rounded-[28px] border border-[#E5E5E5] p-7 shadow-[0_2px_16px_rgba(0,0,0,0.04)] space-y-5"
          >
            <div className="flex justify-between items-center select-none pb-1 border-b border-neutral-100">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                VISUAL STUDIO
              </span>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-xs text-neutral-400 hover:text-neutral-900 underline underline-offset-4 transition-colors"
              >
                Reset Default
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Universal Border Color */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-700">Universal Border Color</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] text-neutral-400 font-normal">
                    {settings.universalBorderColor.toUpperCase()}
                  </span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: settings.universalBorderColor }}
                      className="w-5 h-5 rounded-md border border-black/10 shadow-sm block transition-transform hover:scale-110"
                    />
                    <input
                      type="color"
                      value={settings.universalBorderColor}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, universalBorderColor: e.target.value }))
                      }
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Universal Fill Color */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-700">Universal Fill Color</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] text-neutral-400 font-normal">
                    {settings.universalFillColor.toUpperCase()}
                  </span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: settings.universalFillColor }}
                      className="w-5 h-5 rounded-md border border-black/15 shadow-sm block transition-transform hover:scale-110"
                    />
                    <input
                      type="color"
                      value={settings.universalFillColor}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, universalFillColor: e.target.value }))
                      }
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Text & Icon Color */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-700">Text &amp; Icon Color</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] text-neutral-400 font-normal">
                    {settings.textIconColor.toUpperCase()}
                  </span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: settings.textIconColor }}
                      className="w-5 h-5 rounded-md border border-black/10 shadow-sm block transition-transform hover:scale-110"
                    />
                    <input
                      type="color"
                      value={settings.textIconColor}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, textIconColor: e.target.value }))
                      }
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Primary Button Color */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-700">Primary Button Color</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] text-neutral-400 font-normal">
                    {settings.primaryButtonColor.toUpperCase()}
                  </span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: settings.primaryButtonColor }}
                      className="w-5 h-5 rounded-md border border-black/10 shadow-sm block transition-transform hover:scale-110"
                    />
                    <input
                      type="color"
                      value={settings.primaryButtonColor}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, primaryButtonColor: e.target.value }))
                      }
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Border Width Scale */}
              <div className="space-y-2 pt-1 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-700">Border Width Scale</span>
                  <span className="text-[11px] text-neutral-500 font-normal">{settings.borderWidth}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="1"
                  value={settings.borderWidth}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, borderWidth: Number(e.target.value) }))
                  }
                  className="w-full"
                />
              </div>

              {/* Corner Radius Scale */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-700">Corner Radius Scale</span>
                  <span className="text-[11px] text-neutral-500 font-normal">{settings.cornerRadius}px</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="28"
                  step="2"
                  value={settings.cornerRadius}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, cornerRadius: Number(e.target.value) }))
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
