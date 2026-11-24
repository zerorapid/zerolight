"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useZeroLight } from "../context";
import { Lock, ArrowLeft, ArrowRight, RotateCw } from "lucide-react";

export type WindowChromeKind = "macos" | "browser" | "glass" | "card";

export interface ProductWindowProps {
  children: React.ReactNode;
  chrome?: WindowChromeKind;
  title?: string;
  url?: string;
  tabs?: { id: string; label: string; active?: boolean }[];
  toolbar?: React.ReactNode;
  bleed?: "none" | "bottom" | "right" | "bottom-right";
  showTrafficLights?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ProductWindow: Framed device & browser canvas for marketing hero demos, feature cards, and bento tiles.
 * Follows Stageshow & ZeroLight invariants: Real tokens, authentic chrome, and intentional bleed cropping.
 */
export function ProductWindow({
  children,
  chrome = "macos",
  title = "ZeroLight OS — Enterprise Console",
  url = "app.zerolight.dev/clusters",
  tabs,
  toolbar,
  bleed = "none",
  showTrafficLights = true,
  className = "",
  style = {},
}: ProductWindowProps) {
  const { tokens, scaled } = useZeroLight();

  const isGlass = chrome === "glass";
  const isCard = chrome === "card";
  const isBrowser = chrome === "browser";

  // Bleed styling (letting the window bleed off the edge rather than shrinking to a boxed screenshot)
  const bleedClasses =
    bleed === "bottom"
      ? "rounded-b-none border-b-0 pb-0"
      : bleed === "right"
      ? "rounded-r-none border-r-0 pr-0"
      : bleed === "bottom-right"
      ? "rounded-br-none border-b-0 border-r-0 pb-0 pr-0"
      : "";

  return (
    <div
      style={{
        borderRadius: isCard ? `${scaled.scaledCardRadius}px` : `${Math.max(12, scaled.scaledCardRadius)}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: isGlass
          ? "rgba(255, 255, 255, 0.72)"
          : tokens.universalFillColor || "#FFFFFF",
        boxShadow: scaled.cardShadow,
        ...style,
      }}
      className={`relative overflow-hidden flex flex-col transition-all select-none ${
        isGlass ? "backdrop-blur-xl shadow-xl" : "shadow-lg"
      } ${bleedClasses} ${className}`}
    >
      {/* ── WINDOW TITLE BAR / HEADER CHROME ── */}
      {!isCard && (
        <div
          style={{
            borderColor: tokens.universalBorderColor,
            borderBottomWidth: `${tokens.borderWidth}px`,
            backgroundColor: isGlass ? "rgba(248, 250, 252, 0.55)" : "#F8FAFC",
          }}
          className="h-10 px-3.5 flex items-center justify-between gap-3 shrink-0"
        >
          {/* Traffic Lights (macOS standard) */}
          <div className="flex items-center gap-2 w-16 shrink-0">
            {showTrafficLights && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 inline-block" />
              </div>
            )}
          </div>

          {/* Browser URL Bar OR Window Title */}
          {isBrowser ? (
            <div className="flex-1 max-w-sm h-6 px-2.5 rounded-md bg-white/90 border border-slate-200/90 flex items-center gap-1.5 text-[11px] text-slate-600 shadow-2xs mx-auto">
              <Lock className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
              <span className="font-mono text-[10px] text-slate-800 tracking-tight truncate">
                {url}
              </span>
            </div>
          ) : (
            <div className="flex-1 text-center font-sans font-semibold text-xs text-slate-700 tracking-tight truncate">
              {title}
            </div>
          )}

          {/* Optional Right Action Toolbar */}
          <div className="w-16 flex items-center justify-end gap-1.5 shrink-0 text-slate-400">
            {toolbar ? (
              toolbar
            ) : isBrowser ? (
              <div className="flex items-center gap-1 text-slate-400">
                <ArrowLeft className="w-3 h-3 hover:text-slate-600 cursor-pointer" />
                <ArrowRight className="w-3 h-3 hover:text-slate-600 cursor-pointer" />
                <RotateCw className="w-2.5 h-2.5 hover:text-slate-600 cursor-pointer ml-0.5" />
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Optional Tabs Bar */}
      {tabs && tabs.length > 0 && (
        <div
          style={{
            borderColor: tokens.universalBorderColor,
            borderBottomWidth: `${tokens.borderWidth}px`,
          }}
          className="flex items-center gap-1 px-3 bg-slate-100/70 border-b text-xs font-medium text-slate-600 overflow-x-auto scrollbar-none"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`px-3 py-1.5 text-[11px] font-semibold border-b-2 transition-colors ${
                tab.active
                  ? "border-slate-900 text-slate-900 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ── WINDOW CONTENT CANVAS ── */}
      <div className="relative flex-1 min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

export interface ChoreographedCursorProps {
  x: number;
  y: number;
  isPressing?: boolean;
  cursorState?: "default" | "pointer" | "text" | "grab" | "grabbing";
  label?: string;
  avatarInitials?: string;
  avatarColor?: string;
  color?: string;
  className?: string;
}

/**
 * ChoreographedCursor: Motion-interpolated cursor that simulates human interaction for hero walkthroughs.
 * Features realistic arcs, click ripples, and multi-user team labels.
 */
export function ChoreographedCursor({
  x,
  y,
  isPressing = false,
  cursorState = "pointer",
  label,
  avatarInitials,
  avatarColor = "#059669",
  color = "#0F172A",
  className = "",
}: ChoreographedCursorProps) {
  const { scaled } = useZeroLight();

  return (
    <motion.div
      animate={{
        x,
        y,
        scale: isPressing ? 0.88 : 1,
      }}
      transition={scaled.motionConfig.spring}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 50,
      }}
      className={`flex items-start select-none ${className}`}
    >
      {/* ── THE CURSOR GLYPH ── */}
      <div className="relative">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          <path
            d="M4.5 3.5L11 20.5L14.5 13.5L21.5 10L4.5 3.5Z"
            fill={color}
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>

        {/* Click Ripple Indicator */}
        <AnimatePresence>
          {isPressing && (
            <motion.div
              initial={{ scale: 0.6, opacity: 0.8 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ borderColor: color }}
              className="absolute -top-1 -left-1 w-6 h-6 rounded-full border-2 pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Multi-User Collaboration Pill (like Figma / Linear) */}
      {label && (
        <motion.div
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ backgroundColor: color }}
          className="ml-1.5 px-2 py-0.5 rounded-full text-white text-[10px] font-semibold tracking-tight shadow-md flex items-center gap-1 whitespace-nowrap"
        >
          {avatarInitials && (
            <span
              style={{ backgroundColor: avatarColor }}
              className="w-3.5 h-3.5 rounded-full text-[8px] font-bold flex items-center justify-center text-white shrink-0"
            >
              {avatarInitials}
            </span>
          )}
          <span>{label}</span>
        </motion.div>
      )}
    </motion.div>
  );
}

export interface CounterRollProps {
  value: number;
  prefix?: string;
  suffix?: string;
  formatter?: (val: number) => string;
  className?: string;
}

/**
 * CounterRoll: Digits that roll cleanly during micro-interactions without jumping or layout shift.
 */
export function CounterRoll({
  value,
  prefix = "",
  suffix = "",
  formatter = (v) => v.toLocaleString(),
  className = "",
}: CounterRollProps) {
  return (
    <span className={`inline-flex items-baseline font-sans tabular-nums tracking-tight ${className}`}>
      {prefix && <span>{prefix}</span>}
      <motion.span
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        className="inline-block"
      >
        {formatter(value)}
      </motion.span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

export interface PlaceholderLinesProps {
  count?: number;
  widths?: (string | number)[];
  className?: string;
}

/**
 * PlaceholderLines: Calm, low-contrast placeholder lines to prevent the "Too Much / Text Clutter" AI trap.
 */
export function PlaceholderLines({
  count = 3,
  widths = ["80%", "95%", "60%"],
  className = "",
}: PlaceholderLinesProps) {
  return (
    <div className={`space-y-2 py-1 select-none pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{ width: widths[i % widths.length] || "80%" }}
          className="h-2 rounded-full bg-slate-200/70"
        />
      ))}
    </div>
  );
}
