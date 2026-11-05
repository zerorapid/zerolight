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
  hoverBackplateTint: "#F4F4F5",
  borderWidth: 1,
  cornerRadius: 16,
  heightDensity: 48,
  menuOffsetGap: 8,
  fontSize: 14,
  motionPhysics: "damped",
};

const ROLE_OPTIONS = [
  "Administrator",
  "Product Designer",
  "Software Engineer",
  "Billing Manager",
  "Operations Lead",
];

const TAG_OPTIONS = [
  "Design System",
  "Frontend",
  "Backend",
  "Infrastructure",
  "Security",
  "Analytics",
];

export default function ZeroLightStudio() {
  const [tokens, setTokens] = useState<ZeroLightTokens>(DEFAULT_TOKENS);

  // Input states with focus tracking for zero-flicker transitions
  const [textInput, setTextInput] = useState<string>("sarah.connor@acme.inc");
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  // Role select state
  const [role, setRole] = useState<string>("Product Designer");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [isRoleOpen, setIsRoleOpen] = useState<boolean>(false);
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Tags state
  const [tags, setTags] = useState<string[]>([
    "Design System",
    "Frontend",
    "Security",
  ]);
  const [tagFilter, setTagFilter] = useState<string>("");
  const [isTagOpen, setIsTagOpen] = useState<boolean>(false);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  // Toggles & slider
  const [emailDigest, setEmailDigest] = useState<boolean>(true);
  const [desktopNotifs, setDesktopNotifs] = useState<boolean>(true);
  const [seatLimit, setSeatLimit] = useState<number>(24);

  // Action states
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Close menus on outside click or Escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setIsRoleOpen(false);
      }
      if (tagRef.current && !tagRef.current.contains(e.target as Node)) {
        setIsTagOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsRoleOpen(false);
        setIsTagOpen(false);
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
    setTimeout(() => setToastMessage(null), 2200);
  };

  const handleResetDefaults = () => {
    setTokens(DEFAULT_TOKENS);
    triggerToast("Restored default tokens");
  };

  const handleToggleTag = (t: string) => {
    setTags((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const handleRemoveTag = (t: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTags((prev) => prev.filter((item) => item !== t));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://zerolight.dev");
    setCopied(true);
    triggerToast("Link copied to clipboard");
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSave = () => {
    setIsSaving(true);
    setSavedSuccess(false);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      triggerToast("Changes saved successfully");
      setTimeout(() => setSavedSuccess(false), 2400);
    }, 900);
  };

  const filteredRoles = ROLE_OPTIONS.filter((opt) =>
    opt.toLowerCase().includes(roleFilter.toLowerCase())
  );

  const filteredTags = TAG_OPTIONS.filter((opt) =>
    opt.toLowerCase().includes(tagFilter.toLowerCase())
  );

  // Dynamic Scale
  const scale = tokens.scaleMultiplier;
  const scaledHeight = Math.round(tokens.heightDensity * scale);
  const scaledFontSize = Math.round(tokens.fontSize * scale);
  const scaledRadius = Math.round(tokens.cornerRadius * scale);
  const scaledPaddingX = Math.round(14 * scale);
  const scaledPaddingY = Math.round(8 * scale);
  const scaledCardRadius = Math.round(20 * scale);

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
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#111111] text-white text-xs font-medium px-3.5 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3-Column Studio Body */}
      <div className="flex-1 flex w-full">
        {/* ══════════════════════════════════════════════════════════
            COLUMN 1: LEFT SIDEBAR (CLEAN HUMAN NAVIGATION)
           ══════════════════════════════════════════════════════════ */}
        <aside className="w-60 border-r border-[#EBEBEB] bg-[#FFFFFF] p-5 hidden lg:flex flex-col justify-between select-none sticky top-0 h-screen overflow-y-auto">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#111111] flex items-center justify-center font-bold text-xs text-white">
                ZL
              </div>
              <span className="font-semibold text-sm tracking-tight text-[#111111]">
                ZeroLight
              </span>
            </Link>

            <nav className="space-y-4">
              <div className="space-y-0.5">
                <div className="px-3 py-1 text-xs font-medium text-neutral-400">
                  Overview
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-900 font-medium text-xs flex items-center justify-between">
                  <span>Atoms preview</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                </div>
              </div>

              {/* Form elements */}
              <div className="space-y-0.5 pt-2 border-t border-neutral-100">
                <div className="px-3 py-1 text-xs font-medium text-neutral-400">
                  Inputs
                </div>
                <a
                  href="#text-input"
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>Text input</span>
                </a>
                <a
                  href="#select-menu"
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>Select menu</span>
                </a>
                <a
                  href="#tags"
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>Tags</span>
                </a>
                <a
                  href="#toggles"
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>Checkbox &amp; switch</span>
                </a>
                <a
                  href="#slider"
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>Slider</span>
                </a>
              </div>

              {/* Actions */}
              <div className="space-y-0.5 pt-2 border-t border-neutral-100">
                <div className="px-3 py-1 text-xs font-medium text-neutral-400">
                  Actions
                </div>
                <a
                  href="#buttons"
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>Buttons</span>
                </a>
                <a
                  href="#micro-actions"
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>Icon buttons</span>
                </a>
              </div>

              {/* Feedback */}
              <div className="space-y-0.5 pt-2 border-t border-neutral-100">
                <div className="px-3 py-1 text-xs font-medium text-neutral-400">
                  Feedback
                </div>
                <a
                  href="#status-badges"
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>Status badges</span>
                </a>
                <a
                  href="#loading-states"
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>Loading states</span>
                </a>
              </div>
            </nav>
          </div>

          <div className="text-xs text-neutral-400 pt-4 border-t border-neutral-100">
            ZeroLight Design System
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════════════
            COLUMN 2: CENTER STAGE (NATURAL HUMAN ATOMS SHOWCASE)
           ══════════════════════════════════════════════════════════ */}
        <main className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-start overflow-y-auto">
          <div className="w-full max-w-[500px] space-y-5 pb-24">
            
            {/* Stage Title */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <h1 className="text-sm font-semibold text-neutral-900 tracking-tight">Atoms</h1>
                <p className="text-xs text-neutral-500">Core interactive elements and micro-interactions.</p>
              </div>
              <span className="text-xs text-neutral-500 bg-white border border-neutral-200 px-2.5 py-1 rounded-full shadow-sm">
                Scale: {tokens.scaleMultiplier.toFixed(2)}x
              </span>
            </div>

            {/* ── CARD 1: TEXT INPUT ── */}
            <div id="text-input" style={cardStyle} className="p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-neutral-900">Text input</h2>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-700">Work email</label>
                <div
                  style={{
                    borderRadius: `${scaledRadius}px`,
                    borderColor: isInputFocused ? tokens.textIconColor : tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    backgroundColor: tokens.universalFillColor,
                    height: `${scaledHeight}px`,
                    paddingLeft: `${scaledPaddingX}px`,
                    paddingRight: `${scaledPaddingX}px`,
                    boxShadow: isInputFocused ? `0 0 0 3px ${tokens.textIconColor}12` : "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
                    transition: "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
                  }}
                  className="flex items-center gap-2.5"
                >
                  <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <input
                    type="email"
                    value={textInput}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="name@company.com"
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
                      title="Clear"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── CARD 2: SELECT MENU ── */}
            <div id="select-menu" style={cardStyle} className="p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-neutral-900">Select menu</h2>
              </div>

              <div ref={roleRef} className="relative space-y-1.5">
                <label className="block text-xs font-medium text-neutral-700">Role</label>

                <button
                  type="button"
                  onClick={() => setIsRoleOpen((prev) => !prev)}
                  style={{
                    borderRadius: `${scaledRadius}px`,
                    borderColor: isRoleOpen ? tokens.textIconColor : tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    backgroundColor: tokens.universalFillColor,
                    height: `${scaledHeight}px`,
                    paddingLeft: `${scaledPaddingX}px`,
                    paddingRight: `${scaledPaddingX}px`,
                    boxShadow: isRoleOpen ? `0 0 0 3px ${tokens.textIconColor}12` : "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
                    transition: "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
                  }}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <span
                      style={{
                        fontSize: `${scaledFontSize}px`,
                        color: role ? tokens.textIconColor : "#A3A3A3",
                      }}
                      className="truncate font-normal"
                    >
                      {role || "Select a role..."}
                    </span>
                  </div>
                  <div
                    style={{
                      borderRadius: `${Math.max(4, scaledRadius - 8)}px`,
                      backgroundColor: tokens.hoverBackplateTint,
                      color: tokens.textIconColor,
                      transition: getTransitionStyle(),
                    }}
                    className="w-5 h-5 flex items-center justify-center shrink-0"
                  >
                    <svg
                      className={`w-3 h-3 transition-transform duration-150 ${isRoleOpen ? "rotate-180" : ""}`}
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
                {isRoleOpen && (
                  <div
                    style={{
                      marginTop: `${tokens.menuOffsetGap}px`,
                      borderRadius: `${scaledRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      backgroundColor: tokens.universalFillColor,
                      boxShadow: "0 10px 25px -4px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.03)",
                      padding: `${Math.round(6 * scale)}px`,
                      transition: getTransitionStyle(),
                    }}
                    className="absolute top-full left-0 right-0 z-30 space-y-1"
                  >
                    <input
                      type="text"
                      autoFocus
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      placeholder="Search roles..."
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
                      className="w-full outline-none"
                    />
                    <div className="max-h-48 overflow-y-auto space-y-0.5 pt-1">
                      {filteredRoles.length === 0 ? (
                        <div className="py-2 text-center text-xs text-neutral-400">No role found</div>
                      ) : (
                        filteredRoles.map((opt) => {
                          const isSelected = role === opt;
                          const isHovered = hoveredRole === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onMouseEnter={() => setHoveredRole(opt)}
                              onMouseLeave={() => setHoveredRole(null)}
                              onClick={() => {
                                setRole(opt);
                                setIsRoleOpen(false);
                                setRoleFilter("");
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
                                padding: `${Math.round(7 * scale)}px ${Math.round(10 * scale)}px`,
                                transition: getTransitionStyle(),
                              }}
                              className="w-full text-left flex items-center justify-between font-normal cursor-pointer"
                            >
                              <span>{opt}</span>
                              {isSelected && (
                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
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

            {/* ── CARD 3: TAGS ── */}
            <div id="tags" style={cardStyle} className="p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-neutral-900">Tags</h2>
              </div>

              <div ref={tagRef} className="relative space-y-1.5">
                <label className="block text-xs font-medium text-neutral-700">Project tags</label>

                <div
                  onClick={() => setIsTagOpen((prev) => !prev)}
                  style={{
                    borderRadius: `${scaledRadius}px`,
                    borderColor: isTagOpen ? tokens.textIconColor : tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    backgroundColor: tokens.universalFillColor,
                    minHeight: `${scaledHeight}px`,
                    padding: `${scaledPaddingY}px ${scaledPaddingX}px`,
                    boxShadow: isTagOpen ? `0 0 0 3px ${tokens.textIconColor}12` : "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
                    transition: "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
                  }}
                  className="w-full flex items-center justify-between gap-2 cursor-pointer"
                >
                  <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
                    {tags.length === 0 ? (
                      <span className="text-neutral-400 text-xs font-normal">
                        Select tags...
                      </span>
                    ) : (
                      tags.map((item) => (
                        <span
                          key={item}
                          style={{
                            borderRadius: `${Math.max(4, scaledRadius - 8)}px`,
                            fontSize: `${Math.max(11, scaledFontSize - 3)}px`,
                            backgroundColor: tokens.hoverBackplateTint,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            color: tokens.textIconColor,
                          }}
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 font-medium border"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveTag(item, e)}
                            className="hover:text-red-600 transition-colors p-0.5 -mr-0.5"
                            title="Remove"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Standardized Dropdown Chevron matching Select Menu */}
                  <div
                    style={{
                      borderRadius: `${Math.max(4, scaledRadius - 8)}px`,
                      backgroundColor: tokens.hoverBackplateTint,
                      color: tokens.textIconColor,
                      transition: getTransitionStyle(),
                    }}
                    className="w-5 h-5 flex items-center justify-center shrink-0"
                  >
                    <svg
                      className={`w-3 h-3 transition-transform duration-150 ${isTagOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>

                {/* Popover Dropdown */}
                {isTagOpen && (
                  <div
                    style={{
                      marginTop: `${tokens.menuOffsetGap}px`,
                      borderRadius: `${scaledRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      backgroundColor: tokens.universalFillColor,
                      boxShadow: "0 10px 25px -4px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.03)",
                      padding: `${Math.round(6 * scale)}px`,
                      transition: getTransitionStyle(),
                    }}
                    className="absolute top-full left-0 right-0 z-30 space-y-1"
                  >
                    <input
                      type="text"
                      autoFocus
                      value={tagFilter}
                      onChange={(e) => setTagFilter(e.target.value)}
                      placeholder="Search tags..."
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
                      className="w-full outline-none"
                    />
                    <div className="max-h-48 overflow-y-auto space-y-0.5 pt-1">
                      {filteredTags.length === 0 ? (
                        <div className="py-2 text-center text-xs text-neutral-400">No tag found</div>
                      ) : (
                        filteredTags.map((opt) => {
                          const isSelected = tags.includes(opt);
                          const isHovered = hoveredTag === opt;
                          return (
                            <div
                              key={opt}
                              onMouseEnter={() => setHoveredTag(opt)}
                              onMouseLeave={() => setHoveredTag(null)}
                              onClick={() => handleToggleTag(opt)}
                              style={{
                                borderRadius: `${Math.max(6, scaledRadius - 4)}px`,
                                backgroundColor: isHovered ? tokens.hoverBackplateTint : "transparent",
                                color: tokens.textIconColor,
                                fontSize: `${scaledFontSize - 1}px`,
                                padding: `${Math.round(7 * scale)}px ${Math.round(10 * scale)}px`,
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
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── CARD 4: CHECKBOX & SWITCH ── */}
            <div id="toggles" style={cardStyle} className="p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-neutral-900">Checkbox &amp; switch</h2>
              </div>

              <div className="space-y-3 pt-1">
                {/* Checkbox */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => setEmailDigest((prev) => !prev)}
                    style={{
                      borderRadius: `${Math.max(4, scaledRadius - 10)}px`,
                      backgroundColor: emailDigest ? tokens.primaryButtonColor : tokens.universalFillColor,
                      borderColor: emailDigest ? tokens.primaryButtonColor : tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      transition: getTransitionStyle(),
                    }}
                    className="w-4 h-4 flex items-center justify-center shrink-0 border transition-colors cursor-pointer"
                  >
                    {emailDigest && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: `${scaledFontSize}px`,
                      color: tokens.textIconColor,
                    }}
                    className="font-medium select-none text-xs"
                  >
                    Send weekly digest email
                  </span>
                </label>

                {/* Switch */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  <span
                    style={{
                      fontSize: `${scaledFontSize}px`,
                      color: tokens.textIconColor,
                    }}
                    className="font-medium select-none text-xs"
                  >
                    Desktop notifications
                  </span>
                  <button
                    type="button"
                    onClick={() => setDesktopNotifs((prev) => !prev)}
                    style={{
                      backgroundColor: desktopNotifs ? tokens.primaryButtonColor : tokens.universalBorderColor,
                      transition: getTransitionStyle(),
                    }}
                    className="w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors"
                  >
                    <div
                      style={{
                        backgroundColor: tokens.universalFillColor,
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.2)",
                        transition: getTransitionStyle(),
                      }}
                      className={`w-4 h-4 rounded-full transform ${
                        desktopNotifs ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* ── CARD 5: SLIDER ── */}
            <div id="slider" style={cardStyle} className="p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-neutral-900">Slider</h2>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-neutral-700">Monthly seat limit</span>
                  <span className="font-semibold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded text-[11px]">
                    {seatLimit} seats
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={seatLimit}
                  onChange={(e) => setSeatLimit(Number(e.target.value))}
                  className="w-full cursor-pointer accent-neutral-900"
                />
                <div className="flex justify-between text-[11px] text-neutral-400">
                  <span>5 seats</span>
                  <span>50 seats</span>
                  <span>100 seats</span>
                </div>
              </div>
            </div>

            {/* ── CARD 6: BUTTONS ── */}
            <div id="buttons" style={cardStyle} className="p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-neutral-900">Buttons</h2>
              </div>

              <div className="space-y-2.5">
                {/* Row 1: Primary & Secondary */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleSave}
                    style={{
                      backgroundColor: tokens.primaryButtonColor,
                      borderRadius: `${scaledRadius}px`,
                      height: `${scaledHeight}px`,
                      fontSize: `${scaledFontSize - 1}px`,
                      transition: getTransitionStyle(),
                    }}
                    className="px-4 text-white font-medium flex items-center justify-center gap-2 shadow-sm tactile-press active:opacity-90 cursor-pointer"
                  >
                    {isSaving ? (
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : savedSuccess ? (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    ) : null}
                    <span>{savedSuccess ? "Saved" : isSaving ? "Saving..." : "Save changes"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerToast("Report downloaded")}
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
                    className="px-4 font-medium flex items-center justify-center gap-2 border hover:opacity-90 tactile-press shadow-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <span>Download report</span>
                  </button>
                </div>

                {/* Row 2: Tertiary & Destructive */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => triggerToast("Continued to next step")}
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
                    className="px-4 font-medium flex items-center justify-center gap-2 border hover:opacity-90 tactile-press shadow-sm cursor-pointer"
                  >
                    <span>Continue</span>
                    <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerToast("Project deleted")}
                    style={{
                      borderRadius: `${scaledRadius}px`,
                      backgroundColor: tokens.universalFillColor,
                      height: `${scaledHeight}px`,
                      fontSize: `${scaledFontSize - 1}px`,
                      transition: getTransitionStyle(),
                    }}
                    className="px-4 text-rose-600 font-medium flex items-center justify-center gap-2 border border-rose-200 hover:bg-rose-50/50 tactile-press shadow-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    <span>Delete project</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── CARD 7: MICRO ACTIONS ── */}
            <div id="micro-actions" style={cardStyle} className="p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-neutral-900">Icon buttons</h2>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Settings Trigger */}
                <button
                  type="button"
                  title="Project settings"
                  onClick={() => triggerToast("Opening settings")}
                  style={{
                    borderRadius: `${Math.max(6, scaledRadius - 6)}px`,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    backgroundColor: tokens.universalFillColor,
                    color: tokens.textIconColor,
                    width: `${Math.round(38 * scale)}px`,
                    height: `${Math.round(38 * scale)}px`,
                    transition: getTransitionStyle(),
                  }}
                  className="border flex items-center justify-center hover:opacity-90 tactile-press shadow-sm cursor-pointer"
                >
                  <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>

                {/* Copy Link Trigger */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  title="Copy link"
                  style={{
                    borderRadius: `${Math.max(6, scaledRadius - 6)}px`,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    backgroundColor: tokens.universalFillColor,
                    color: tokens.textIconColor,
                    width: `${Math.round(38 * scale)}px`,
                    height: `${Math.round(38 * scale)}px`,
                    transition: getTransitionStyle(),
                  }}
                  className="border flex items-center justify-center hover:opacity-90 tactile-press shadow-sm cursor-pointer"
                >
                  {copied ? (
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </button>

                {/* Save status badge */}
                <div
                  style={{
                    height: `${Math.round(36 * scale)}px`,
                    borderRadius: `${scaledRadius}px`,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    backgroundColor: tokens.universalFillColor,
                    color: tokens.textIconColor,
                    fontSize: `${scaledFontSize - 2}px`,
                  }}
                  className="ml-auto inline-flex items-center gap-2 px-3 border shadow-sm select-none"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Changes saved</span>
                </div>
              </div>
            </div>

            {/* ── CARD 8: STATUS BADGES ── */}
            <div id="status-badges" style={cardStyle} className="p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-neutral-900">Status badges</h2>
              </div>

              {/* Status Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Active</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>In review</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium border border-neutral-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  <span>Draft</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Paused</span>
                </span>
              </div>

              {/* Quota Progress */}
              <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-600 font-medium">Storage limit</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">68%</span>
                    <span className="text-[11px] text-emerald-600 font-medium">+4.2% this month</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                  <div className="h-full bg-neutral-900 rounded-full" style={{ width: "68%" }} />
                </div>
              </div>
            </div>

            {/* ── CARD 9: LOADING STATES ── */}
            <div id="loading-states" style={cardStyle} className="p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-neutral-900">Loading states</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin shrink-0" />
                  <span className="text-xs text-neutral-500">Loading team members...</span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="h-2.5 w-3/4 bg-neutral-200 rounded animate-pulse" />
                  <div className="h-2.5 w-1/2 bg-neutral-200 rounded animate-pulse" />
                </div>
              </div>
            </div>

          </div>
        </main>

        {/* ══════════════════════════════════════════════════════════
            COLUMN 3: RIGHT SIDEBAR (NATURAL VISUAL STUDIO INSPECTOR)
           ══════════════════════════════════════════════════════════ */}
        <aside className="w-72 border-l border-[#EBEBEB] bg-[#FFFFFF] p-5 hidden xl:flex flex-col justify-between select-none sticky top-0 h-screen overflow-y-auto">
          <div className="space-y-5">
            {/* Header with Reset */}
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <span className="text-xs font-semibold text-neutral-900">
                Visual Studio
              </span>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors font-medium cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Scale Controller */}
            <div className="space-y-2 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-800">
                  Scale multiplier
                </span>
                <span className="text-xs font-medium text-neutral-700 bg-white border border-neutral-200 px-1.5 py-0.5 rounded shadow-sm">
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
                    className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
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

            {/* Colors */}
            <div className="space-y-2.5 pt-2 border-t border-neutral-100">
              <div className="text-xs font-medium text-neutral-400">
                Colors
              </div>

              {/* Border Color */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-700">Border</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400">{tokens.universalBorderColor.toUpperCase()}</span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.universalBorderColor }}
                      className="w-5 h-5 rounded border border-black/10 shadow-sm block transition-transform hover:scale-105"
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

              {/* Surface Fill */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-700">Surface</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400">{tokens.universalFillColor.toUpperCase()}</span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.universalFillColor }}
                      className="w-5 h-5 rounded border border-black/15 shadow-sm block transition-transform hover:scale-105"
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
                <span className="text-neutral-700">Text &amp; icons</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400">{tokens.textIconColor.toUpperCase()}</span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.textIconColor }}
                      className="w-5 h-5 rounded border border-black/10 shadow-sm block transition-transform hover:scale-105"
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

              {/* Primary Action Color */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-700">Primary action</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400">{tokens.primaryButtonColor.toUpperCase()}</span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.primaryButtonColor }}
                      className="w-5 h-5 rounded border border-black/10 shadow-sm block transition-transform hover:scale-105"
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
                <span className="text-neutral-700">Hover tint</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400">{tokens.hoverBackplateTint.toUpperCase()}</span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.hoverBackplateTint }}
                      className="w-5 h-5 rounded border border-black/10 shadow-sm block transition-transform hover:scale-105"
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

            {/* Geometry */}
            <div className="space-y-2.5 pt-2 border-t border-neutral-100">
              <div className="text-xs font-medium text-neutral-400">
                Geometry
              </div>

              {/* Border Width Slider */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-700">Border width</span>
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

              {/* Corner Radius */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-700">Corner radius</span>
                  <span className="text-neutral-500 font-medium">{tokens.cornerRadius}px</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {([0, 8, 16, 24] as CornerRadiusPreset[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setTokens((prev) => ({ ...prev, cornerRadius: r }))}
                      className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
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

              {/* Height Density */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-700">Height density</span>
                  <span className="text-neutral-500 font-medium">{tokens.heightDensity}px</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {([40, 44, 48, 52] as HeightDensityPreset[]).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setTokens((prev) => ({ ...prev, heightDensity: h }))}
                      className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
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

              {/* Menu Offset */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-700">Menu offset</span>
                  <span className="text-neutral-500 font-medium">{tokens.menuOffsetGap}px</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {([4, 8, 10, 14] as MenuOffsetPreset[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setTokens((prev) => ({ ...prev, menuOffsetGap: g }))}
                      className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
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

            {/* Typography */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <div className="text-xs font-medium text-neutral-400">
                Typography
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-700">Font size</span>
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

            {/* Motion */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <div className="text-xs font-medium text-neutral-400">
                Motion
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
                    className={`py-1.5 rounded text-xs font-medium border transition-colors cursor-pointer ${
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

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
            <span>Tokens active</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
        </aside>
      </div>
    </div>
  );
}
