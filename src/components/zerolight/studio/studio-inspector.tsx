"use client";

import React, { useMemo } from "react";
import { Check, Code2, Copy, RotateCcw, X, Sun, Moon } from "lucide-react";
import { DEFAULT_TOKENS, ScaledTokens, ZeroLightTokens, THEME_PRESETS } from "../types";
import { getExportSnippet } from "./studio-export";
import { PanelTheme } from "./panel-theme";
import { PanelTypography } from "./panel-typography";
import { PanelLayout } from "./panel-layout";
import { PanelMotion } from "./panel-motion";
import { PanelAssets } from "./panel-assets";

export type StudioCategory = "theme" | "type" | "layout" | "motion" | "assets";

export interface StudioInspectorProps {
  tokens: ZeroLightTokens;
  scaled: ScaledTokens;
  setTokens: React.Dispatch<React.SetStateAction<ZeroLightTokens>>;
  handleUpdateTokens: (updates: Partial<ZeroLightTokens>) => void;
  handleResetDefaults: () => void;
  studioCategory: StudioCategory;
  setStudioCategory: React.Dispatch<React.SetStateAction<StudioCategory>>;
  sandboxSlideActive: boolean;
  setSandboxSlideActive: React.Dispatch<React.SetStateAction<boolean>>;
  sandboxReplayKey: number;
  setSandboxReplayKey: React.Dispatch<React.SetStateAction<number>>;
  setIsExportOpen: (open: boolean) => void;
  isMobileStudioOpen: boolean;
  setIsMobileStudioOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerToast: (msg: string) => void;
}

const STUDIO_TABS: { id: StudioCategory; label: string }[] = [
  { id: "theme", label: "Theme" },
  { id: "type", label: "Type" },
  { id: "layout", label: "Layout" },
  { id: "motion", label: "Motion" },
  { id: "assets", label: "Assets" },
];

export function StudioInspector({
  tokens,
  scaled,
  setTokens,
  handleUpdateTokens,
  handleResetDefaults,
  studioCategory,
  setStudioCategory,
  sandboxSlideActive,
  setSandboxSlideActive,
  sandboxReplayKey,
  setSandboxReplayKey,
  setIsExportOpen,
  isMobileStudioOpen,
  setIsMobileStudioOpen,
  setIsDrawerOpen,
  triggerToast,
}: StudioInspectorProps) {
  const [copiedQuickCss, setCopiedQuickCss] = React.useState(false);
  const [copiedQuickTailwind, setCopiedQuickTailwind] = React.useState(false);

  const customizedCount = useMemo(() => {
    let count = 0;
    const keys = Object.keys(DEFAULT_TOKENS) as (keyof ZeroLightTokens)[];
    for (const key of keys) {
      if (tokens[key] !== DEFAULT_TOKENS[key]) count++;
    }
    return count;
  }, [tokens]);

  const handleQuickCopyCss = async () => {
    try {
      await navigator.clipboard.writeText(getExportSnippet("css", tokens));
      setCopiedQuickCss(true);
      triggerToast("Copied CSS variables + Google Fonts");
      setTimeout(() => setCopiedQuickCss(false), 1600);
    } catch {
      setIsExportOpen(true);
    }
  };

  const handleQuickCopyTailwind = async () => {
    try {
      await navigator.clipboard.writeText(getExportSnippet("tailwind", tokens));
      setCopiedQuickTailwind(true);
      triggerToast("Copied Tailwind config snippet");
      setTimeout(() => setCopiedQuickTailwind(false), 1600);
    } catch {
      setIsExportOpen(true);
    }
  };

  const handleTogglePolarity = () => {
    const isDark = scaled.isDarkSurface;
    const target = isDark ? THEME_PRESETS.light : THEME_PRESETS.dark;
    setTokens((prev) => ({ ...prev, ...target.tokens }));
    triggerToast(isDark ? "Switched to Light Mode" : "Switched to Dark Mode");
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#0E0E10] text-zinc-200">
      {/* ── Minimalist Sticky Header ── */}
      <div className="shrink-0 px-4 pt-3.5 border-b border-white/[0.06]">
        <div className="flex items-center justify-between gap-2 pb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-white truncate">
              Visual Studio
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleTogglePolarity}
              title={scaled.isDarkSurface ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer flex items-center justify-center"
            >
              {scaled.isDarkSurface ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-zinc-400" />
              )}
            </button>
            <button
              type="button"
              onClick={handleResetDefaults}
              title="Reset tokens & dock width"
              className="px-2 py-1 rounded-md text-[11px] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/[0.1] hover:bg-white/[0.16] text-white border border-white/[0.08] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Code2 className="w-3 h-3" />
              <span>Export</span>
            </button>
            {isMobileStudioOpen && (
              <button
                type="button"
                onClick={() => setIsMobileStudioOpen(false)}
                aria-label="Close Visual Studio"
                className="xl:hidden p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.06] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Clean Single-Row Underline Tabs */}
        <nav
          aria-label="Visual Studio Categories"
          className="flex items-center justify-between gap-1"
        >
          {STUDIO_TABS.map(({ id, label }) => {
            const active = studioCategory === id;
            return (
              <button
                key={id}
                type="button"
                data-testid={`studio-tab-${id}`}
                onClick={() => setStudioCategory(id)}
                className={`relative pb-2.5 px-1.5 text-[11px] transition-colors cursor-pointer ${
                  active
                    ? "text-white font-semibold"
                    : "text-zinc-500 hover:text-zinc-300 font-medium"
                }`}
              >
                <span>{label}</span>
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Calm Scrollable Inspector Body ── */}
      <div className="flex-1 overflow-y-auto px-4 py-1">
        {studioCategory === "theme" && (
          <PanelTheme
            tokens={tokens}
            setTokens={setTokens}
            handleUpdateTokens={handleUpdateTokens}
            triggerToast={triggerToast}
          />
        )}

        {studioCategory === "type" && (
          <PanelTypography
            tokens={tokens}
            scaled={scaled}
            setTokens={setTokens}
            triggerToast={triggerToast}
          />
        )}

        {studioCategory === "layout" && (
          <PanelLayout tokens={tokens} setTokens={setTokens} />
        )}

        {studioCategory === "motion" && (
          <PanelMotion
            tokens={tokens}
            scaled={scaled}
            setTokens={setTokens}
            sandboxSlideActive={sandboxSlideActive}
            setSandboxSlideActive={setSandboxSlideActive}
            sandboxReplayKey={sandboxReplayKey}
            setSandboxReplayKey={setSandboxReplayKey}
            setIsDrawerOpen={setIsDrawerOpen}
            triggerToast={triggerToast}
          />
        )}

        {studioCategory === "assets" && (
          <PanelAssets tokens={tokens} scaled={scaled} setTokens={setTokens} />
        )}
      </div>

      {/* ── Quiet Sticky Footer ── */}
      <div className="shrink-0 px-4 py-2.5 border-t border-white/[0.06] flex items-center justify-between gap-2 text-[11px]">
        <span className="text-zinc-500 truncate">
          {customizedCount > 0 ? (
            <>
              <span className="text-zinc-200 font-medium tabular-nums">
                {customizedCount}
              </span>{" "}
              modified
            </>
          ) : (
            "Default tokens"
          )}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleQuickCopyTailwind}
            title="Copy Tailwind CSS config tokens"
            className="px-2 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-400 hover:text-zinc-200 font-medium flex items-center gap-1 transition-colors cursor-pointer shrink-0 text-[10px]"
          >
            {copiedQuickTailwind ? (
              <>
                <Check className="w-2.5 h-2.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Code2 className="w-2.5 h-2.5 text-zinc-400" />
                <span>Tailwind</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleQuickCopyCss}
            className="px-2.5 py-1 rounded-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-zinc-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            {copiedQuickCss ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-zinc-400" />
                <span>Copy CSS</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
