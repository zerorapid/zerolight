"use client";

import React, { useMemo } from "react";
import {
  Activity,
  Check,
  Code2,
  Copy,
  Palette,
  RotateCcw,
  Shapes,
  SlidersHorizontal,
  Type,
  X,
} from "lucide-react";
import { DEFAULT_TOKENS, ScaledTokens, ZeroLightTokens } from "../types";
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

const STUDIO_TABS: {
  id: StudioCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "theme", label: "Theme", icon: Palette },
  { id: "type", label: "Type", icon: Type },
  { id: "layout", label: "Layout", icon: SlidersHorizontal },
  { id: "motion", label: "Motion", icon: Activity },
  { id: "assets", label: "Assets", icon: Shapes },
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

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* ── Sticky Studio Header ── */}
      <div className="shrink-0 px-4 pt-4 pb-3 border-b border-[#27272A] bg-[#121214] space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] shrink-0" />
            <span className="text-xs font-semibold tracking-wide text-white truncate">
              Visual Studio
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleResetDefaults}
              title="Reset tokens & dock width"
              className="px-2 py-1 rounded-md text-[11px] text-neutral-400 hover:text-white hover:bg-[#1E1E22] transition-colors font-medium cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white text-black hover:bg-neutral-200 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Code2 className="w-3 h-3" />
              <span>Export</span>
            </button>
            {isMobileStudioOpen && (
              <button
                type="button"
                onClick={() => setIsMobileStudioOpen(false)}
                aria-label="Close Visual Studio"
                className="xl:hidden p-1 rounded-md text-neutral-400 hover:text-white hover:bg-[#1E1E22] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Clean 5-Tab Studio Switcher with Icons */}
        <nav
          aria-label="Visual Studio Categories"
          className="grid grid-cols-5 gap-1 bg-[#18181B] p-1 rounded-xl border border-[#27272A]"
        >
          {STUDIO_TABS.map(({ id, label, icon: Icon }) => {
            const active = studioCategory === id;
            return (
              <button
                key={id}
                type="button"
                data-testid={`studio-tab-${id}`}
                onClick={() => setStudioCategory(id)}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-medium transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  active
                    ? "bg-white text-black font-semibold shadow-xs"
                    : "text-neutral-400 hover:text-white hover:bg-[#222226]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Focused Scrollable Inspector Body ── */}
      <div className="flex-1 overflow-y-auto px-4 py-3.5">
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

      {/* ── Sticky Compact Footer ── */}
      <div className="shrink-0 px-4 py-2.5 border-t border-[#27272A] bg-[#121214] flex items-center justify-between gap-2 text-[11px]">
        <div className="text-neutral-400 truncate">
          {customizedCount > 0 ? (
            <span>
              <strong className="text-white font-semibold tabular-nums">{customizedCount}</strong>{" "}
              customized
            </span>
          ) : (
            <span>Default baseline</span>
          )}
        </div>
        <button
          type="button"
          onClick={handleQuickCopyCss}
          className="px-2.5 py-1 rounded-md bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-neutral-200 font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          {copiedQuickCss ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Copied CSS</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-neutral-400" />
              <span>Copy CSS</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
