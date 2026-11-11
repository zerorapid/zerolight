"use client";

import React from "react";
import { useZeroLight } from "../context";
import { AppShell, NavItem } from "../organisms/app-shell";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Check, RefreshCw } from "lucide-react";

export interface SettingsTabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  description?: string;
}

export interface SettingsFormTemplateProps {
  /** Settings section title */
  title: string;
  /** Subtitle context */
  subtitle?: string;
  /** Navigation tabs list */
  tabs: SettingsTabItem[];
  /** Current active tab id */
  activeTabId: string;
  /** Tab change callback */
  onTabChange: (id: string) => void;
  /** Main active form content */
  children: React.ReactNode;
  /** Whether the user has modified fields without saving */
  isDirty?: boolean;
  /** Save callback for unsaved changes bar */
  onSave?: () => void;
  /** Discard callback for unsaved changes bar */
  onDiscard?: () => void;
  /** Saving spinner state */
  isSaving?: boolean;
  /** Orientation of navigation tabs (default: "horizontal" on mobile, "vertical" on desktop or flexible) */
  navLayout?: "vertical" | "horizontal";
  /** Optional AppShell wrapper configuration */
  shellConfig?: {
    brandName?: string;
    brandLogo?: React.ReactNode;
    navItems?: NavItem[];
    headerRight?: React.ReactNode;
    footerAction?: React.ReactNode;
  };
  className?: string;
}

export function SettingsFormTemplate({
  title,
  subtitle,
  tabs,
  activeTabId,
  onTabChange,
  children,
  isDirty = false,
  onSave,
  onDiscard,
  isSaving = false,
  navLayout = "vertical",
  shellConfig,
  className = "",
}: SettingsFormTemplateProps) {
  const { tokens, scaled } = useZeroLight();

  const content = (
    <div className={`space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none ${className}`}>
      {/* ── ZONE 1: SETTINGS HEADER ── */}
      <section className="pb-3 border-b border-neutral-200/70">
        <h1
          style={{ fontSize: `${scaled.headingFontSize}px` }}
          className="font-bold text-neutral-900 tracking-tight truncate max-w-xl"
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{ fontSize: `${scaled.sublabelFontSize}px` }}
            className="text-neutral-500 line-clamp-2 max-w-2xl mt-1 leading-relaxed"
          >
            {subtitle}
          </p>
        )}
      </section>

      {/* ── ZONE 2: NAVIGATION TABS & FORM CONTENT ── */}
      <section>
        {navLayout === "vertical" ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Vertical Tab Navigation Rail */}
            <aside className="md:col-span-3 space-y-1">
              <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
                {tabs.map((tab) => {
                  const isActive = tab.id === activeTabId;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => onTabChange(tab.id)}
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        backgroundColor: isActive ? tokens.universalFillColor : "transparent",
                        borderColor: isActive ? tokens.universalBorderColor : "transparent",
                        borderWidth: isActive ? `${tokens.borderWidth}px` : "1px",
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer text-left shrink-0 ${
                        isActive
                          ? "text-neutral-900 shadow-2xs font-bold"
                          : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/70"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {tab.icon && (
                          <span className={isActive ? "text-neutral-900" : "text-neutral-400"}>
                            {tab.icon}
                          </span>
                        )}
                        <span className="truncate">{tab.label}</span>
                      </div>
                      {tab.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium shrink-0 ml-2">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Active Form Body */}
            <main className="md:col-span-9 space-y-6">
              {children}
            </main>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Horizontal Tabs Bar */}
            <nav className="flex items-center gap-1 border-b border-neutral-200/70 overflow-x-auto pb-1">
              {tabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange(tab.id)}
                    style={{
                      borderBottomColor: isActive ? tokens.primaryButtonColor : "transparent",
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "text-neutral-900 border-b-2"
                        : "text-neutral-500 hover:text-neutral-800 border-transparent"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-100 text-neutral-600">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <main className="space-y-6">
              {children}
            </main>
          </div>
        )}
      </section>

      {/* ── ZONE 3: FLOATING STICKY UNSAVED CHANGES BAR ── */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={scaled.motionConfig.spring}
            style={{
              borderRadius: `${scaled.scaledCardRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
            }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-neutral-900 text-white px-5 py-3 shadow-2xl flex items-center justify-between gap-6 border w-[90%] max-w-xl backdrop-blur-md"
          >
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-300 truncate">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">Careful — you have unsaved changes!</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onDiscard && (
                <button
                  type="button"
                  onClick={onDiscard}
                  disabled={isSaving}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Discard
                </button>
              )}
              {onSave && (
                <button
                  type="button"
                  onClick={onSave}
                  disabled={isSaving}
                  style={{
                    backgroundColor: tokens.primaryButtonColor,
                    color: scaled.primaryActionTextColor,
                    borderRadius: `${scaled.scaledRadius}px`,
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold shadow-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (shellConfig) {
    return (
      <AppShell
        brandName={shellConfig.brandName}
        brandLogo={shellConfig.brandLogo}
        navItems={shellConfig.navItems}
        headerRight={shellConfig.headerRight}
        footerAction={shellConfig.footerAction}
      >
        {content}
      </AppShell>
    );
  }

  return content;
}
