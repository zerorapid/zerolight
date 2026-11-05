"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ZeroLightTokens,
  DEFAULT_TOKENS,
  CornerRadiusPreset,
  HeightDensityPreset,
  MenuOffsetPreset,
  MotionPhysicsPreset,
  computeScaledTokens,
} from "./types";

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

export function ZeroLightStudio({ initialTier = "atoms" }: { initialTier?: "atoms" | "molecules" }) {
  const [tokens, setTokens] = useState<ZeroLightTokens>(DEFAULT_TOKENS);
  const [activeTier, setActiveTier] = useState<"atoms" | "molecules">(initialTier);

  // Form input interactive state
  const [textInput, setTextInput] = useState<string>("sarah.connor@acme.inc");
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [textareaValue, setTextareaValue] = useState<string>(
    "ZeroLight provides rapid PoC design system atoms built for modern B2B SaaS micro-actions."
  );

  // Molecule: Search Select state
  const [role, setRole] = useState<string>("Product Designer");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [isRoleOpen, setIsRoleOpen] = useState<boolean>(false);
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Molecule: Tag Deck state
  const [tags, setTags] = useState<string[]>([
    "Design System",
    "Frontend",
    "Security",
  ]);
  const [tagFilter, setTagFilter] = useState<string>("");
  const [isTagOpen, setIsTagOpen] = useState<boolean>(false);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  // Molecule: Input Group state
  const [apiKey, setApiKey] = useState<string>("zl_live_8f93e2b17a");
  const [isApiKeyCopied, setIsApiKeyCopied] = useState<boolean>(false);

  // Molecule: Segmented Control state
  const [segmentValue, setSegmentValue] = useState<"monthly" | "quarterly" | "annual">("quarterly");

  // Atom interactive states
  const [radioValue, setRadioValue] = useState<"standard" | "pro">("pro");
  const [checkboxValue, setCheckboxValue] = useState<boolean>(true);
  const [switchValue, setSwitchValue] = useState<boolean>(true);
  const [sliderValue, setSliderValue] = useState<number>(64);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Memory leak protection: references for active timers
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerToast = useCallback((msg: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2200);
  }, []);

  const handleCopyApiKey = useCallback(() => {
    if (copyTimerRef.current) {
      clearTimeout(copyTimerRef.current);
    }
    navigator.clipboard.writeText(apiKey);
    setIsApiKeyCopied(true);
    triggerToast("API Key copied to clipboard");
    copyTimerRef.current = setTimeout(() => {
      setIsApiKeyCopied(false);
      copyTimerRef.current = null;
    }, 1800);
  }, [apiKey, triggerToast]);

  // Clean up all timer references on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  // Outside click & Escape dismiss listeners with robust cleanup
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

  const filteredRoles = ROLE_OPTIONS.filter((opt) =>
    opt.toLowerCase().includes(roleFilter.toLowerCase())
  );

  const filteredTags = TAG_OPTIONS.filter((opt) =>
    opt.toLowerCase().includes(tagFilter.toLowerCase())
  );

  // Scaled tokens dynamically recomputed for visual accuracy
  const scaled = computeScaledTokens(tokens);

  const cardStyle: React.CSSProperties = {
    backgroundColor: tokens.universalFillColor,
    borderColor: tokens.universalBorderColor,
    borderWidth: `${tokens.borderWidth}px`,
    borderRadius: `${scaled.scaledCardRadius}px`,
    transition: scaled.transitionStyle,
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] flex flex-col font-sans selection:bg-neutral-200">
      {/* Toast Notification with memory-safe timer */}
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
            COLUMN 1: LEFT SIDEBAR (HIERARCHICAL DIRECTORY)
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

            {/* View Switcher: Atoms vs Molecules */}
            <div className="p-1 rounded-xl bg-neutral-100 flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTier("atoms")}
                className={`flex-1 py-1.5 rounded-lg font-medium text-center transition-all cursor-pointer ${
                  activeTier === "atoms"
                    ? "bg-white text-neutral-900 shadow-sm font-semibold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Atoms
              </button>
              <button
                type="button"
                onClick={() => setActiveTier("molecules")}
                className={`flex-1 py-1.5 rounded-lg font-medium text-center transition-all cursor-pointer ${
                  activeTier === "molecules"
                    ? "bg-white text-neutral-900 shadow-sm font-semibold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Molecules
              </button>
            </div>

            {/* Navigation links dynamically matching active tier */}
            <nav className="space-y-4">
              {activeTier === "atoms" ? (
                <>
                  <div className="space-y-0.5">
                    <div className="px-3 py-1 text-xs font-medium text-neutral-400">
                      Action Primitives
                    </div>
                    <a href="#atom-buttons" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Button matrix</span>
                    </a>
                    <a href="#atom-icon-buttons" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Icon button</span>
                    </a>
                  </div>

                  <div className="space-y-0.5 pt-2 border-t border-neutral-100">
                    <div className="px-3 py-1 text-xs font-medium text-neutral-400">
                      Input Primitives
                    </div>
                    <a href="#atom-input" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Input states</span>
                    </a>
                    <a href="#atom-textarea" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Textarea</span>
                    </a>
                    <a href="#atom-selection" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Radio &amp; checkbox</span>
                    </a>
                    <a href="#atom-switch-slider" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Switch &amp; slider</span>
                    </a>
                  </div>

                  <div className="space-y-0.5 pt-2 border-t border-neutral-100">
                    <div className="px-3 py-1 text-xs font-medium text-neutral-400">
                      Tokens &amp; Indicators
                    </div>
                    <a href="#atom-chips-triggers" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Tag chip &amp; trigger</span>
                    </a>
                    <a href="#atom-status-kbd" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Status badge &amp; Kbd</span>
                    </a>
                    <a href="#atom-avatar-loader" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Avatar &amp; loader</span>
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-0.5">
                    <div className="px-3 py-1 text-xs font-medium text-neutral-400">
                      Form Molecules
                    </div>
                    <a href="#mol-form-field" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Form field</span>
                    </a>
                    <a href="#mol-input-group" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Input group</span>
                    </a>
                    <a href="#mol-search-bar" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Search bar</span>
                    </a>
                  </div>

                  <div className="space-y-0.5 pt-2 border-t border-neutral-100">
                    <div className="px-3 py-1 text-xs font-medium text-neutral-400">
                      Selection &amp; Control
                    </div>
                    <a href="#mol-search-select" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Searchable select</span>
                    </a>
                    <a href="#mol-tag-deck" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Multi-tag deck</span>
                    </a>
                    <a href="#mol-segmented" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Segmented control</span>
                    </a>
                  </div>

                  <div className="space-y-0.5 pt-2 border-t border-neutral-100">
                    <div className="px-3 py-1 text-xs font-medium text-neutral-400">
                      Feedback
                    </div>
                    <a href="#mol-metric-stat" className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors">
                      <span>Metric stat card</span>
                    </a>
                  </div>
                </>
              )}
            </nav>
          </div>

          <div className="text-xs text-neutral-400 pt-4 border-t border-neutral-100">
            Brad Frost Atomic Architecture
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════════════
            COLUMN 2: CENTER STAGE (ATOMS OR MOLECULES VIEW)
           ══════════════════════════════════════════════════════════ */}
        <main className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-start overflow-y-auto">
          <div className="w-full max-w-[620px] space-y-6 pb-24">
            
            {/* Stage Title */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <h1 style={{ fontSize: `${scaled.headingFontSize + 3}px` }} className="font-semibold text-neutral-900 tracking-tight">
                  {activeTier === "atoms" ? "Atoms Directory" : "Molecules Directory"}
                </h1>
                <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                  {activeTier === "atoms"
                    ? "Indivisible primitives across variants, interaction states, and tokens."
                    : "Atomic compositions combining two or more primitives for cohesive tasks."}
                </p>
              </div>
              <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 bg-white border border-neutral-200 px-2.5 py-1 rounded-full shadow-sm">
                Scale: {tokens.scaleMultiplier.toFixed(2)}x
              </span>
            </div>

            {/* ══════════════════════════════════════════════════════════
                VIEW A: PURE ATOMS (STANDARDIZED PERMUTATION TESTING)
               ══════════════════════════════════════════════════════════ */}
            {activeTier === "atoms" && (
              <>
                {/* ── ATOM 1: BUTTON PERMUTATION MATRIX ── */}
                <div id="atom-buttons" style={cardStyle} className="p-5 shadow-sm space-y-4">
                  <div>
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      Button state &amp; variant matrix
                    </h2>
                    <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                      Indivisible CTA primitives across canonical variants and standard interaction truth states.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-100">
                          <th style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="pb-3 text-neutral-400 font-medium">Variant</th>
                          <th style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="pb-3 text-neutral-400 font-medium text-center">Rest</th>
                          <th style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="pb-3 text-neutral-400 font-medium text-center">Hover</th>
                          <th style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="pb-3 text-neutral-400 font-medium text-center">Focused</th>
                          <th style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="pb-3 text-neutral-400 font-medium text-center">Disabled</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {/* 1. Primary Solid */}
                        <tr>
                          <td style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="py-2.5 text-neutral-600 font-medium whitespace-nowrap pr-3">
                            Primary solid
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              style={{
                                backgroundColor: tokens.primaryButtonColor,
                                borderRadius: `${scaled.scaledPillRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                              }}
                              className="text-white font-medium shadow-xs"
                            >
                              Button CTA
                            </button>
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              style={{
                                backgroundColor: tokens.primaryButtonColor,
                                borderRadius: `${scaled.scaledPillRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                              }}
                              className="text-white font-medium brightness-125 shadow-sm"
                            >
                              Button CTA
                            </button>
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              style={{
                                backgroundColor: tokens.primaryButtonColor,
                                borderRadius: `${scaled.scaledPillRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                                boxShadow: `0 0 0 3px ${tokens.primaryButtonColor}40`,
                              }}
                              className="text-white font-medium"
                            >
                              Button CTA
                            </button>
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              disabled
                              style={{
                                backgroundColor: "#CBD5E1",
                                borderRadius: `${scaled.scaledPillRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                              }}
                              className="text-white font-medium opacity-60 cursor-not-allowed"
                            >
                              Button CTA
                            </button>
                          </td>
                        </tr>

                        {/* 2. Secondary Outline */}
                        <tr>
                          <td style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="py-2.5 text-neutral-600 font-medium whitespace-nowrap pr-3">
                            Secondary outline
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              style={{
                                borderColor: tokens.primaryButtonColor,
                                borderWidth: `${tokens.borderWidth}px`,
                                backgroundColor: "transparent",
                                color: tokens.primaryButtonColor,
                                borderRadius: `${scaled.scaledPillRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                              }}
                              className="border font-medium shadow-xs"
                            >
                              Button CTA
                            </button>
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              style={{
                                borderColor: tokens.primaryButtonColor,
                                borderWidth: `${tokens.borderWidth}px`,
                                backgroundColor: `${tokens.primaryButtonColor}0A`,
                                color: tokens.primaryButtonColor,
                                borderRadius: `${scaled.scaledPillRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                              }}
                              className="border font-medium shadow-xs"
                            >
                              Button CTA
                            </button>
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              style={{
                                borderColor: tokens.primaryButtonColor,
                                borderWidth: `${tokens.borderWidth}px`,
                                backgroundColor: "transparent",
                                color: tokens.primaryButtonColor,
                                borderRadius: `${scaled.scaledPillRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                                boxShadow: `0 0 0 3px ${tokens.primaryButtonColor}35`,
                              }}
                              className="border font-medium"
                            >
                              Button CTA
                            </button>
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              disabled
                              style={{
                                borderColor: "#E2E8F0",
                                borderWidth: `${tokens.borderWidth}px`,
                                backgroundColor: "transparent",
                                color: "#94A3B8",
                                borderRadius: `${scaled.scaledPillRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                              }}
                              className="border font-medium cursor-not-allowed opacity-50"
                            >
                              Button CTA
                            </button>
                          </td>
                        </tr>

                        {/* 3. Ghost / Tertiary */}
                        <tr>
                          <td style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="py-2.5 text-neutral-600 font-medium whitespace-nowrap pr-3">
                            Ghost / Tertiary
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              style={{
                                color: tokens.textIconColor,
                                borderRadius: `${scaled.scaledPillRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                              }}
                              className="font-medium bg-transparent"
                            >
                              Button CTA
                            </button>
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              style={{
                                backgroundColor: tokens.hoverBackplateTint,
                                color: tokens.textIconColor,
                                borderRadius: `${scaled.scaledPillRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                              }}
                              className="font-medium"
                            >
                              Button CTA
                            </button>
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              style={{
                                backgroundColor: "transparent",
                                color: tokens.textIconColor,
                                borderRadius: `${scaled.scaledPillRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                                boxShadow: `0 0 0 3px ${tokens.primaryButtonColor}35`,
                              }}
                              className="font-medium"
                            >
                              Button CTA
                            </button>
                          </td>
                          <td className="py-2.5 text-center">
                            <button
                              type="button"
                              disabled
                              style={{
                                color: "#94A3B8",
                                borderRadius: `${scaled.scaledPillRadius}px`,
                                fontSize: `${scaled.ctaFontSize}px`,
                                padding: `${Math.round(4 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                              }}
                              className="font-medium cursor-not-allowed opacity-40 bg-transparent"
                            >
                              Button CTA
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── ATOM 2: ICON BUTTON PERMUTATIONS ── */}
                <div id="atom-icon-buttons" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      Icon button permutations
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">
                      Primary, outline &amp; ghost variants
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    {/* Primary Icon Button */}
                    <button
                      type="button"
                      style={{
                        backgroundColor: tokens.primaryButtonColor,
                        borderRadius: `${scaled.scaledRadius}px`,
                        width: `${scaled.scaledHeight}px`,
                        height: `${scaled.scaledHeight}px`,
                      }}
                      className="text-white flex items-center justify-center shadow-xs cursor-pointer hover:brightness-110 active:scale-95 transition-transform"
                      title="Add item"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>

                    {/* Secondary Outline Icon Button */}
                    <button
                      type="button"
                      style={{
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.universalFillColor,
                        color: tokens.textIconColor,
                        borderRadius: `${scaled.scaledRadius}px`,
                        width: `${scaled.scaledHeight}px`,
                        height: `${scaled.scaledHeight}px`,
                      }}
                      className="border flex items-center justify-center shadow-xs cursor-pointer hover:bg-neutral-50 active:scale-95 transition-all"
                      title="Filter"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                      </svg>
                    </button>

                    {/* Ghost Icon Button */}
                    <button
                      type="button"
                      style={{
                        backgroundColor: tokens.hoverBackplateTint,
                        color: tokens.textIconColor,
                        borderRadius: `${scaled.scaledRadius}px`,
                        width: `${scaled.scaledHeight}px`,
                        height: `${scaled.scaledHeight}px`,
                      }}
                      className="flex items-center justify-center cursor-pointer hover:brightness-95 active:scale-95 transition-all"
                      title="Settings"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* ── ATOM 3: INPUT ATOM PERMUTATIONS ── */}
                <div id="atom-input" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      Input atom permutations
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">
                      Zero-flicker rasterization
                    </span>
                  </div>

                  <div className="space-y-2">
                    {/* Default state */}
                    <div
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.universalFillColor,
                        height: `${scaled.scaledHeight}px`,
                        paddingLeft: `${scaled.scaledPaddingX}px`,
                        paddingRight: `${scaled.scaledPaddingX}px`,
                      }}
                      className="flex items-center gap-2 border"
                    >
                      <input
                        type="text"
                        readOnly
                        value="Rest state"
                        style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>

                    {/* Focused state */}
                    <div
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: tokens.textIconColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.universalFillColor,
                        height: `${scaled.scaledHeight}px`,
                        paddingLeft: `${scaled.scaledPaddingX}px`,
                        paddingRight: `${scaled.scaledPaddingX}px`,
                        boxShadow: `0 0 0 3px ${tokens.textIconColor}12`,
                      }}
                      className="flex items-center gap-2 border"
                    >
                      <input
                        type="text"
                        readOnly
                        value="Focused state (zero flicker)"
                        style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>

                    {/* Error / Invalid state */}
                    <div
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: "#EF4444",
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.universalFillColor,
                        height: `${scaled.scaledHeight}px`,
                        paddingLeft: `${scaled.scaledPaddingX}px`,
                        paddingRight: `${scaled.scaledPaddingX}px`,
                        boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.12)",
                      }}
                      className="flex items-center gap-2 border"
                    >
                      <input
                        type="text"
                        readOnly
                        value="Invalid email format"
                        style={{ fontSize: `${scaled.scaledFontSize}px`, color: "#DC2626" }}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>

                    {/* Disabled state */}
                    <div
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.universalFillColor,
                        height: `${scaled.scaledHeight}px`,
                        paddingLeft: `${scaled.scaledPaddingX}px`,
                        paddingRight: `${scaled.scaledPaddingX}px`,
                      }}
                      className="flex items-center gap-2 border opacity-45 cursor-not-allowed"
                    >
                      <input
                        type="text"
                        disabled
                        value="Disabled state"
                        style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                        className="w-full bg-transparent outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* ── ATOM 4: TEXTAREA ATOM ── */}
                <div id="atom-textarea" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                    Textarea atom
                  </h2>
                  <div
                    style={{
                      borderRadius: `${scaled.scaledRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      backgroundColor: tokens.universalFillColor,
                      padding: `${scaled.scaledPaddingY}px ${scaled.scaledPaddingX}px`,
                    }}
                    className="flex items-start border"
                  >
                    <textarea
                      rows={2}
                      value={textareaValue}
                      onChange={(e) => setTextareaValue(e.target.value)}
                      style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                      className="w-full bg-transparent outline-none resize-none"
                    />
                  </div>
                </div>

                {/* ── ATOM 5: RADIO & CHECKBOX PERMUTATIONS ── */}
                <div id="atom-selection" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                    Radio &amp; checkbox permutations
                  </h2>

                  <div className="flex items-center justify-between pt-1">
                    {/* Concentric Radio Atom */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div
                        onClick={() => setRadioValue(radioValue === "standard" ? "pro" : "standard")}
                        style={{
                          borderColor: radioValue === "pro" ? tokens.primaryButtonColor : tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.universalFillColor,
                        }}
                        className="w-4 h-4 rounded-full flex items-center justify-center border"
                      >
                        {radioValue === "pro" && (
                          <div style={{ backgroundColor: tokens.primaryButtonColor }} className="w-2 h-2 rounded-full" />
                        )}
                      </div>
                      <span style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="font-medium select-none">
                        Radio atom
                      </span>
                    </label>

                    {/* Kinetic Checkbox Atom */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div
                        onClick={() => setCheckboxValue((prev) => !prev)}
                        style={{
                          borderRadius: `${Math.max(4, scaled.scaledRadius - 10)}px`,
                          backgroundColor: checkboxValue ? tokens.primaryButtonColor : tokens.universalFillColor,
                          borderColor: checkboxValue ? tokens.primaryButtonColor : tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                        }}
                        className="w-4 h-4 flex items-center justify-center border cursor-pointer"
                      >
                        {checkboxValue && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        )}
                      </div>
                      <span style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="font-medium select-none">
                        Checkbox atom
                      </span>
                    </label>
                  </div>
                </div>

                {/* ── ATOM 6: SWITCH & SLIDER PERMUTATIONS ── */}
                <div id="atom-switch-slider" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                    Switch &amp; slider primitives
                  </h2>

                  <div className="flex items-center justify-between pt-1">
                    <span style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="font-medium">
                      Toggle switch
                    </span>
                    <button
                      type="button"
                      onClick={() => setSwitchValue((prev) => !prev)}
                      style={{
                        backgroundColor: switchValue ? tokens.primaryButtonColor : tokens.universalBorderColor,
                        transition: scaled.transitionStyle,
                      }}
                      className="w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer"
                    >
                      <div
                        style={{ backgroundColor: tokens.universalFillColor, transition: scaled.transitionStyle }}
                        className={`w-4 h-4 rounded-full shadow-sm transform ${switchValue ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 space-y-1">
                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: `${scaled.labelFontSize}px` }} className="text-neutral-600 font-medium">Continuous slider</span>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="font-semibold text-neutral-900 bg-neutral-100 px-1.5 py-0.5 rounded">
                        {sliderValue}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderValue}
                      onChange={(e) => setSliderValue(Number(e.target.value))}
                      className="w-full cursor-pointer accent-neutral-900"
                    />
                  </div>
                </div>

                {/* ── ATOM 7: STANDALONE TAG CHIP & CHEVRON TRIGGER ── */}
                <div id="atom-chips-triggers" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      Tag chip &amp; trigger primitives
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">
                      Isolated atomic primitives
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {/* Standalone Tag Chip Atom */}
                    <span
                      style={{
                        borderRadius: `${scaled.scaledPillRadius}px`,
                        fontSize: `${scaled.sublabelFontSize}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        color: tokens.textIconColor,
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 font-medium border"
                    >
                      <span>Design System</span>
                      <button type="button" className="hover:text-red-600 transition-colors cursor-pointer" title="Dismiss">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>

                    {/* Standalone Dropdown Trigger Primitive (Unified SVG Chevron) */}
                    <div
                      style={{
                        borderRadius: `${Math.max(6, scaled.scaledRadius - 8)}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                        color: tokens.textIconColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        borderColor: tokens.universalBorderColor,
                      }}
                      className="w-8 h-8 flex items-center justify-center border shadow-xs"
                      title="Dropdown chevron primitive"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* ── ATOM 8: STATUS BADGES & KEYBOARD KEYS ── */}
                <div id="atom-status-kbd" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                    Status badge &amp; Kbd primitives
                  </h2>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                        Active
                      </span>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium border border-amber-200">
                        Pending
                      </span>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-medium border border-rose-200">
                        Failed
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <kbd
                        style={{
                          borderRadius: `${Math.max(4, scaled.scaledRadius - 10)}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.hoverBackplateTint,
                          color: tokens.textIconColor,
                          fontSize: `${scaled.sublabelFontSize}px`,
                          padding: `${Math.round(2 * scaled.scale)}px ${Math.round(6 * scaled.scale)}px`,
                        }}
                        className="font-mono border shadow-xs"
                      >
                        ⌘K
                      </kbd>
                      <kbd
                        style={{
                          borderRadius: `${Math.max(4, scaled.scaledRadius - 10)}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.hoverBackplateTint,
                          color: tokens.textIconColor,
                          fontSize: `${scaled.sublabelFontSize}px`,
                          padding: `${Math.round(2 * scaled.scale)}px ${Math.round(6 * scaled.scale)}px`,
                        }}
                        className="font-mono border shadow-xs"
                      >
                        Esc
                      </kbd>
                    </div>
                  </div>
                </div>

                {/* ── ATOM 9: AVATAR & SPINNER LOADER ── */}
                <div id="atom-avatar-loader" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                    Avatar &amp; loader primitives
                  </h2>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div
                          style={{
                            width: `${scaled.scaledHeight}px`,
                            height: `${scaled.scaledHeight}px`,
                            backgroundColor: tokens.primaryButtonColor,
                          }}
                          className="rounded-full flex items-center justify-center text-white font-medium text-xs shadow-xs"
                        >
                          SC
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                      </div>
                      <span style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="font-medium">
                        Sarah Connor
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border-2 border-neutral-300 border-t-neutral-800 animate-spin" />
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Syncing...
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ══════════════════════════════════════════════════════════
                VIEW B: MOLECULES (ATOMIC COMPOSITIONS)
               ══════════════════════════════════════════════════════════ */}
            {activeTier === "molecules" && (
              <>
                {/* ── MOLECULE 1: FORM FIELD (LABEL + INPUT + VALIDATION) ── */}
                <div id="mol-form-field" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      FormField molecule
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                      Label + Input + HelperText
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px` }} className="block font-medium text-neutral-700">
                      Account email <span className="text-rose-500">*</span>
                    </label>
                    <div
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: isInputFocused ? tokens.textIconColor : tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.universalFillColor,
                        height: `${scaled.scaledHeight}px`,
                        paddingLeft: `${scaled.scaledPaddingX}px`,
                        paddingRight: `${scaled.scaledPaddingX}px`,
                        boxShadow: isInputFocused ? `0 0 0 3px ${tokens.textIconColor}12` : "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
                        transition: "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
                      }}
                      className="flex items-center gap-2.5 border"
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
                        style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 block">
                      We send monthly receipts and settlement summaries to this inbox.
                    </span>
                  </div>
                </div>

                {/* ── MOLECULE 2: INPUT GROUP (INPUT + BUTTON) ── */}
                <div id="mol-input-group" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      InputGroup molecule
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                      Input + Button joined
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px` }} className="block font-medium text-neutral-700">
                      Secret API key
                    </label>
                    <div className="flex items-center">
                      <div
                        style={{
                          borderTopLeftRadius: `${scaled.scaledRadius}px`,
                          borderBottomLeftRadius: `${scaled.scaledRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          borderRightWidth: 0,
                          backgroundColor: tokens.universalFillColor,
                          height: `${scaled.scaledHeight}px`,
                          paddingLeft: `${scaled.scaledPaddingX}px`,
                          paddingRight: `${scaled.scaledPaddingX}px`,
                        }}
                        className="flex-1 flex items-center border"
                      >
                        <input
                          type="text"
                          readOnly
                          value={apiKey}
                          style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                          className="w-full bg-transparent outline-none font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyApiKey}
                        style={{
                          borderTopRightRadius: `${scaled.scaledRadius}px`,
                          borderBottomRightRadius: `${scaled.scaledRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.primaryButtonColor,
                          color: "#FFFFFF",
                          height: `${scaled.scaledHeight}px`,
                          paddingLeft: `${scaled.scaledPaddingX}px`,
                          paddingRight: `${scaled.scaledPaddingX}px`,
                          fontSize: `${scaled.labelFontSize}px`,
                          transition: scaled.transitionStyle,
                        }}
                        className="border font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        {isApiKeyCopied ? (
                          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        )}
                        <span>{isApiKeyCopied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── MOLECULE 3: SEARCH BAR (ICON + INPUT + KBD) ── */}
                <div id="mol-search-bar" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      SearchBar molecule
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                      Icon + Input + Kbd shortcut
                    </span>
                  </div>

                  <div
                    style={{
                      borderRadius: `${scaled.scaledRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      backgroundColor: tokens.universalFillColor,
                      height: `${scaled.scaledHeight}px`,
                      paddingLeft: `${scaled.scaledPaddingX}px`,
                      paddingRight: `${scaled.scaledPaddingX}px`,
                    }}
                    className="flex items-center justify-between border"
                  >
                    <div className="flex items-center gap-2.5 flex-1 mr-2">
                      <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search resources, customers, invoices..."
                        style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                    <kbd
                      style={{
                        borderRadius: `${Math.max(4, scaled.scaledRadius - 10)}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        fontSize: `${scaled.sublabelFontSize - 1}px`,
                        padding: `${Math.round(2 * scaled.scale)}px ${Math.round(6 * scaled.scale)}px`,
                      }}
                      className="font-mono text-neutral-500 border"
                    >
                      ⌘K
                    </kbd>
                  </div>
                </div>

                {/* ── MOLECULE 4: SEARCHABLE SELECT ── */}
                <div id="mol-search-select" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      SearchableSelect molecule
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                      Trigger + Popover + Filter
                    </span>
                  </div>

                  <div ref={roleRef} className="relative space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px` }} className="block font-medium text-neutral-700">Team role</label>

                    <button
                      type="button"
                      onClick={() => setIsRoleOpen((prev) => !prev)}
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: isRoleOpen ? tokens.textIconColor : tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.universalFillColor,
                        height: `${scaled.scaledHeight}px`,
                        paddingLeft: `${scaled.scaledPaddingX}px`,
                        paddingRight: `${scaled.scaledPaddingX}px`,
                        boxShadow: isRoleOpen ? `0 0 0 3px ${tokens.textIconColor}12` : "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
                        transition: "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
                      }}
                      className="w-full flex items-center justify-between text-left cursor-pointer border"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        <span style={{ fontSize: `${scaled.scaledFontSize}px`, color: role ? tokens.textIconColor : "#A3A3A3" }} className="truncate font-normal">
                          {role || "Select a role..."}
                        </span>
                      </div>
                      <div
                        style={{
                          borderRadius: `${Math.max(4, scaled.scaledRadius - 8)}px`,
                          backgroundColor: tokens.hoverBackplateTint,
                          color: tokens.textIconColor,
                          transition: scaled.transitionStyle,
                        }}
                        className="w-5 h-5 flex items-center justify-center shrink-0"
                      >
                        <svg className={`w-3.5 h-3.5 transition-transform duration-150 ${isRoleOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </button>

                    {/* Popover Dropdown */}
                    {isRoleOpen && (
                      <div
                        style={{
                          marginTop: `${tokens.menuOffsetGap}px`,
                          borderRadius: `${scaled.scaledRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.universalFillColor,
                          boxShadow: "0 10px 25px -4px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.03)",
                          padding: `${Math.round(6 * scaled.scale)}px`,
                          transition: scaled.transitionStyle,
                        }}
                        className="absolute top-full left-0 right-0 z-30 space-y-1 border"
                      >
                        <input
                          type="text"
                          autoFocus
                          value={roleFilter}
                          onChange={(e) => setRoleFilter(e.target.value)}
                          placeholder="Search roles..."
                          style={{
                            borderRadius: `${Math.max(6, scaled.scaledRadius - 4)}px`,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            backgroundColor: tokens.universalFillColor,
                            color: tokens.textIconColor,
                            fontSize: `${scaled.sublabelFontSize}px`,
                            padding: `${Math.round(6 * scaled.scale)}px ${Math.round(10 * scaled.scale)}px`,
                            transition: scaled.transitionStyle,
                          }}
                          className="w-full outline-none border"
                        />
                        <div className="max-h-48 overflow-y-auto space-y-0.5 pt-1">
                          {filteredRoles.map((opt) => {
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
                                  borderRadius: `${Math.max(6, scaled.scaledRadius - 4)}px`,
                                  backgroundColor: isSelected ? tokens.primaryButtonColor : isHovered ? tokens.hoverBackplateTint : "transparent",
                                  color: isSelected ? "#FFFFFF" : tokens.textIconColor,
                                  fontSize: `${scaled.labelFontSize}px`,
                                  padding: `${Math.round(7 * scaled.scale)}px ${Math.round(10 * scaled.scale)}px`,
                                  transition: scaled.transitionStyle,
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
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── MOLECULE 5: MULTI-TAG DECK ── */}
                <div id="mol-tag-deck" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                        TagDeck molecule
                      </h2>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
                        Removable tag chips with unified &quot;+ Add tag&quot; trigger and live popover selector.
                      </p>
                    </div>
                  </div>

                  <div ref={tagRef} className="relative space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px` }} className="block font-medium text-neutral-700">Project tags</label>

                    <div
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        borderColor: isTagOpen ? tokens.textIconColor : tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.universalFillColor,
                        minHeight: `${scaled.scaledHeight}px`,
                        padding: `${scaled.scaledPaddingY}px ${scaled.scaledPaddingX}px`,
                        boxShadow: isTagOpen ? `0 0 0 3px ${tokens.textIconColor}12` : "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
                        transition: "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
                      }}
                      className="w-full flex flex-wrap items-center gap-1.5 border"
                    >
                      {/* Active Tag Chips */}
                      {tags.map((item) => (
                        <span
                          key={item}
                          style={{
                            borderRadius: `${scaled.scaledPillRadius}px`,
                            fontSize: `${scaled.sublabelFontSize}px`,
                            backgroundColor: tokens.hoverBackplateTint,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            color: tokens.textIconColor,
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 font-medium border"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveTag(item, e)}
                            className="hover:text-red-600 transition-colors p-0.5 -mr-0.5 cursor-pointer"
                            title="Remove tag"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}

                      {/* Clean SaaS "+ Add tag" Trigger Button */}
                      <button
                        type="button"
                        onClick={() => setIsTagOpen((prev) => !prev)}
                        style={{
                          borderRadius: `${scaled.scaledPillRadius}px`,
                          fontSize: `${scaled.sublabelFontSize}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          color: tokens.textIconColor,
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 font-medium border border-dashed hover:border-neutral-400 hover:bg-neutral-50 transition-colors cursor-pointer bg-white"
                      >
                        <svg className="w-3 h-3 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>Add tag</span>
                      </button>
                    </div>

                    {/* Tag Popover Dropdown */}
                    {isTagOpen && (
                      <div
                        style={{
                          marginTop: `${tokens.menuOffsetGap}px`,
                          borderRadius: `${scaled.scaledRadius}px`,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          backgroundColor: tokens.universalFillColor,
                          boxShadow: "0 10px 25px -4px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.03)",
                          padding: `${Math.round(6 * scaled.scale)}px`,
                          transition: scaled.transitionStyle,
                        }}
                        className="absolute top-full left-0 right-0 z-30 space-y-1 border"
                      >
                        <input
                          type="text"
                          autoFocus
                          value={tagFilter}
                          onChange={(e) => setTagFilter(e.target.value)}
                          placeholder="Search tags..."
                          style={{
                            borderRadius: `${Math.max(6, scaled.scaledRadius - 4)}px`,
                            borderColor: tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            backgroundColor: tokens.universalFillColor,
                            color: tokens.textIconColor,
                            fontSize: `${scaled.sublabelFontSize}px`,
                            padding: `${Math.round(6 * scaled.scale)}px ${Math.round(10 * scaled.scale)}px`,
                            transition: scaled.transitionStyle,
                          }}
                          className="w-full outline-none border"
                        />
                        <div className="max-h-48 overflow-y-auto space-y-0.5 pt-1">
                          {filteredTags.map((opt) => {
                            const isSelected = tags.includes(opt);
                            const isHovered = hoveredTag === opt;
                            return (
                              <div
                                key={opt}
                                onMouseEnter={() => setHoveredTag(opt)}
                                onMouseLeave={() => setHoveredTag(null)}
                                onClick={() => handleToggleTag(opt)}
                                style={{
                                  borderRadius: `${Math.max(6, scaled.scaledRadius - 4)}px`,
                                  backgroundColor: isHovered ? tokens.hoverBackplateTint : "transparent",
                                  color: tokens.textIconColor,
                                  fontSize: `${scaled.labelFontSize}px`,
                                  padding: `${Math.round(7 * scaled.scale)}px ${Math.round(10 * scaled.scale)}px`,
                                  transition: scaled.transitionStyle,
                                }}
                                className="flex items-center justify-between cursor-pointer"
                              >
                                <span className={isSelected ? "font-semibold" : "font-normal"}>
                                  {opt}
                                </span>
                                <div
                                  style={{
                                    borderRadius: `${Math.max(4, scaled.scaledRadius - 10)}px`,
                                    backgroundColor: isSelected ? tokens.primaryButtonColor : tokens.universalFillColor,
                                    borderColor: isSelected ? tokens.primaryButtonColor : tokens.universalBorderColor,
                                    borderWidth: `${tokens.borderWidth}px`,
                                    transition: scaled.transitionStyle,
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
                      </div>
                    )}
                  </div>
                </div>

                {/* ── MOLECULE 6: SEGMENTED CONTROL MOLECULE ── */}
                <div id="mol-segmented" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      SegmentedControl molecule
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                      Conjoined Button primitives
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label style={{ fontSize: `${scaled.labelFontSize}px` }} className="block font-medium text-neutral-700">Billing frequency</label>
                    <div
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                        padding: `${Math.round(3 * scaled.scale)}px`,
                      }}
                      className="inline-flex items-center gap-1 border border-neutral-200/60"
                    >
                      {(
                        [
                          { key: "monthly", label: "Monthly" },
                          { key: "quarterly", label: "Quarterly" },
                          { key: "annual", label: "Annual (Save 20%)" },
                        ] as const
                      ).map(({ key, label }) => {
                        const isSelected = segmentValue === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setSegmentValue(key)}
                            style={{
                              borderRadius: `${Math.max(4, scaled.scaledRadius - 4)}px`,
                              backgroundColor: isSelected ? tokens.universalFillColor : "transparent",
                              color: isSelected ? tokens.textIconColor : "#71717A",
                              fontSize: `${scaled.sublabelFontSize}px`,
                              padding: `${Math.round(5 * scaled.scale)}px ${Math.round(12 * scaled.scale)}px`,
                              boxShadow: isSelected ? "0 1px 3px 0 rgba(0, 0, 0, 0.08)" : "none",
                              transition: scaled.transitionStyle,
                            }}
                            className={`font-medium cursor-pointer ${isSelected ? "font-semibold" : "hover:text-neutral-900"}`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ── MOLECULE 7: METRIC STAT MOLECULE ── */}
                <div id="mol-metric-stat" style={cardStyle} className="p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontSize: `${scaled.headingFontSize}px` }} className="font-semibold text-neutral-900">
                      MetricStat molecule
                    </h2>
                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 font-medium">
                      Label + Value + TrendBadge
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 font-medium block">
                        Net Revenue Run Rate
                      </span>
                      <div className="flex items-baseline gap-2 pt-0.5">
                        <span style={{ fontSize: `${scaled.headingFontSize + 8}px` }} className="font-semibold text-neutral-900 tracking-tight">
                          $148,200
                        </span>
                        <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full font-medium inline-flex items-center gap-0.5">
                          <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                          </svg>
                          <span>+18.4%</span>
                        </span>
                      </div>
                    </div>

                    <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400">
                      vs. previous 30 days
                    </span>
                  </div>
                </div>
              </>
            )}

          </div>
        </main>

        {/* ══════════════════════════════════════════════════════════
            COLUMN 3: RIGHT SIDEBAR (DARK MODE "VISUAL STUDIO" DOCK)
           ══════════════════════════════════════════════════════════ */}
        <aside className="w-72 border-l border-[#27272A] bg-[#121214] text-[#E4E4E7] p-5 hidden xl:flex flex-col justify-between select-none sticky top-0 h-screen overflow-y-auto">
          <div className="space-y-5">
            {/* Dark Mode Header with Reset */}
            <div className="flex justify-between items-center pb-2 border-b border-[#27272A]">
              <span className="text-xs font-semibold tracking-wide text-white">
                Visual Studio
              </span>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-xs text-neutral-400 hover:text-white transition-colors font-medium cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Dark Mode Scale Multiplier Controller */}
            <div className="space-y-2 p-3 rounded-xl bg-[#18181B] border border-[#27272A]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-300">
                  Scale multiplier
                </span>
                <span className="text-xs font-medium text-white bg-[#27272A] border border-[#3F3F46] px-1.5 py-0.5 rounded shadow-sm">
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
                className="w-full cursor-pointer accent-white"
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
                        ? "bg-white text-black border-white font-semibold shadow-sm"
                        : "bg-[#27272A] text-neutral-300 border-[#3F3F46] hover:border-neutral-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dark Mode Colors Section */}
            <div className="space-y-2.5 pt-2 border-t border-[#27272A]">
              <div className="text-xs font-medium text-neutral-400">
                Colors
              </div>

              {/* Universal Border Color */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300">Border</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-500 font-mono">{tokens.universalBorderColor.toUpperCase()}</span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.universalBorderColor }}
                      className="w-5 h-5 rounded border border-white/20 shadow-sm block transition-transform hover:scale-105"
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
                <span className="text-neutral-300">Surface</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-500 font-mono">{tokens.universalFillColor.toUpperCase()}</span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.universalFillColor }}
                      className="w-5 h-5 rounded border border-white/20 shadow-sm block transition-transform hover:scale-105"
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
                <span className="text-neutral-300">Text &amp; icons</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-500 font-mono">{tokens.textIconColor.toUpperCase()}</span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.textIconColor }}
                      className="w-5 h-5 rounded border border-white/20 shadow-sm block transition-transform hover:scale-105"
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
                <span className="text-neutral-300">Primary action</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-500 font-mono">{tokens.primaryButtonColor.toUpperCase()}</span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.primaryButtonColor }}
                      className="w-5 h-5 rounded border border-white/20 shadow-sm block transition-transform hover:scale-105"
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
                <span className="text-neutral-300">Hover tint</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-500 font-mono">{tokens.hoverBackplateTint.toUpperCase()}</span>
                  <label className="relative cursor-pointer">
                    <span
                      style={{ backgroundColor: tokens.hoverBackplateTint }}
                      className="w-5 h-5 rounded border border-white/20 shadow-sm block transition-transform hover:scale-105"
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

            {/* Dark Mode Geometry Section */}
            <div className="space-y-2.5 pt-2 border-t border-[#27272A]">
              <div className="text-xs font-medium text-neutral-400">
                Geometry
              </div>

              {/* Border Width Slider */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-300">Border width</span>
                  <span className="text-neutral-400 font-medium">{tokens.borderWidth}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={tokens.borderWidth}
                  onChange={(e) => setTokens((prev) => ({ ...prev, borderWidth: Number(e.target.value) }))}
                  className="w-full cursor-pointer accent-white"
                />
              </div>

              {/* Corner Radius */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-300">Corner radius</span>
                  <span className="text-neutral-400 font-medium">
                    {tokens.cornerRadius === 999 ? "Pill" : `${tokens.cornerRadius}px`}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {([0, 8, 16, 24, 999] as CornerRadiusPreset[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setTokens((prev) => ({ ...prev, cornerRadius: r }))}
                      className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                        tokens.cornerRadius === r
                          ? "bg-white text-black border-white font-semibold shadow-sm"
                          : "bg-[#18181B] text-neutral-300 border-[#27272A] hover:border-neutral-500"
                      }`}
                    >
                      {r === 0 ? "0px" : r === 999 ? "Pill" : `${r}px`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Height Density */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-300">Height density</span>
                  <span className="text-neutral-400 font-medium">{tokens.heightDensity}px</span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {([36, 40, 44, 48, 52] as HeightDensityPreset[]).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setTokens((prev) => ({ ...prev, heightDensity: h }))}
                      className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                        tokens.heightDensity === h
                          ? "bg-white text-black border-white font-semibold shadow-sm"
                          : "bg-[#18181B] text-neutral-300 border-[#27272A] hover:border-neutral-500"
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
                  <span className="text-neutral-300">Menu offset</span>
                  <span className="text-neutral-400 font-medium">{tokens.menuOffsetGap}px</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {([4, 8, 10, 14] as MenuOffsetPreset[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setTokens((prev) => ({ ...prev, menuOffsetGap: g }))}
                      className={`py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                        tokens.menuOffsetGap === g
                          ? "bg-white text-black border-white font-semibold shadow-sm"
                          : "bg-[#18181B] text-neutral-300 border-[#27272A] hover:border-neutral-500"
                      }`}
                    >
                      {g}px
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dark Mode Typography Section (Universally Calibrating) */}
            <div className="space-y-2 pt-2 border-t border-[#27272A]">
              <div className="text-xs font-medium text-neutral-400">
                Universal Typography
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-300">Base font scale</span>
                  <span className="text-neutral-400 font-medium">{tokens.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="18"
                  step="1"
                  value={tokens.fontSize}
                  onChange={(e) => setTokens((prev) => ({ ...prev, fontSize: Number(e.target.value) }))}
                  className="w-full cursor-pointer accent-white"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 pt-0.5">
                  <span>12px Compact</span>
                  <span>14px Standard</span>
                  <span>18px Roomy</span>
                </div>
              </div>
            </div>

            {/* Dark Mode Motion Section */}
            <div className="space-y-2 pt-2 border-t border-[#27272A]">
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
                        ? "bg-white text-black border-white font-semibold shadow-sm"
                        : "bg-[#18181B] text-neutral-300 border-[#27272A] hover:border-neutral-500"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#27272A] flex items-center justify-between text-xs text-neutral-500">
            <span>Visual Studio Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          </div>
        </aside>
      </div>
    </div>
  );
}
