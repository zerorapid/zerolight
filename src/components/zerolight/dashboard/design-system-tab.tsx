"use client";

import React from "react";
import { useZeroLight } from "../context";
import { ZeroLightDocsPortal } from "../docs/zerolight-docs-portal";
import {
  SaaSTokensLibrary,
  SaaSButtonLibrary,
  SaaSInputFieldLibrary,
  SaaSSelectionLibrary,
  SaaSIndicatorLibrary,
  SaaSDividerLibrary,
  SaaSTooltipLibrary,
  SaaSFeedbackLibrary,
  SaaSOverlaysLibrary,
  SaaSNavigationLibrary,
  SaaSDataLibrary,
  SaaSBusinessLibrary,
  SaaSLayoutLibrary,
  SaaSAppScreensLibrary,
  SaaSEdgeCasesLibrary,
} from "../libraries";
import { Badge } from "../atoms/badge";
import { DynamicIcon } from "../atoms/dynamic-icon";
import type { DocsSubView, DocsTier } from "./dashboard-shell";

export interface DesignSystemTabProps {
  activeTierData: {
    id: DocsTier;
    label: string;
    tabs: { id: DocsSubView; label: string; count: string | number }[];
  };
  docsSubView: DocsSubView;
  setDocsSubView: (sub: DocsSubView) => void;
}

/** 6-tier Design System catalog view with sub-navigation tabs. */
export function DesignSystemTab({
  activeTierData,
  docsSubView,
  setDocsSubView,
}: DesignSystemTabProps) {
  const { tokens } = useZeroLight();

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="pb-0.5 shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Design System
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            6-tier atomic component registry, token foundations, and enterprise SaaS UI patterns.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div
            className="px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200/80 text-[11px] font-semibold text-zinc-700 flex items-center gap-2"
            title="Active Design System Tokens"
          >
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: tokens.primaryButtonColor || "#0F172A" }}
            />
            <span className="tabular-nums">{tokens.cornerRadius ?? 12}px</span>
            <span className="text-zinc-300">•</span>
            <span className="truncate max-w-[110px]" title={tokens.fontFamily || "Plus Jakarta Sans"}>
              {tokens.fontFamily || "Plus Jakarta Sans"}
            </span>
            <span className="text-zinc-300">•</span>
            <DynamicIcon name="sparkles" size={12} library={tokens.iconLibrary} />
            <span className="text-zinc-500">Live Tokens</span>
          </div>
          <Badge variant="healthy">295 SaaS Pattern Variants Active</Badge>
        </div>
      </div>

      {/* Top Sub-Nav Switcher */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200/90 dark:border-white/10 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tier /</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                {activeTierData.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeTierData.id === "foundations" && "Core tokens, hairlines, dividers, and spring motion physics."}
              {activeTierData.id === "atoms" && "Foundational interactive controls, inputs, and status indicators."}
              {activeTierData.id === "molecules" && "Composite form fields, stat cards, alerts, and micro-charts."}
              {activeTierData.id === "organisms" && "Functional modules, data tables, navigation shells, and command palettes."}
              {activeTierData.id === "templates" && "Full-page structural blueprints and authenticated layout skeletons."}
              {activeTierData.id === "pages" && "Complete working SaaS destination applications with live workflows."}
            </p>
          </div>
        </div>

        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 pb-1">
          <div className="inline-flex p-1 rounded-xl bg-zinc-100/90 dark:bg-white/[0.06] border border-zinc-200/60 dark:border-white/10 items-center gap-1">
            {activeTierData.tabs.map((sub) => {
              const active = docsSubView === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setDocsSubView(sub.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? "bg-white dark:bg-white/20 text-zinc-950 dark:text-white shadow-xs font-bold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.08]"
                  }`}
                >
                  <span>{sub.label}</span>
                  <span
                    className={`text-[10px] font-sans tabular-nums px-1.5 py-0.2 rounded-full font-bold ${
                      active
                        ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950"
                        : "bg-zinc-200/80 dark:bg-white/10 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {sub.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sub-view Content */}
      {docsSubView === "catalog" && <SaaSTokensLibrary />}
      {docsSubView === "catalog-molecules" && (
        <div className="w-full">
          <ZeroLightDocsPortal embedded defaultSectionId="area-chart" />
        </div>
      )}
      {docsSubView === "buttons" && <SaaSButtonLibrary />}
      {docsSubView === "inputs" && <SaaSInputFieldLibrary />}
      {docsSubView === "selections" && <SaaSSelectionLibrary />}
      {docsSubView === "indicators" && <SaaSIndicatorLibrary />}
      {docsSubView === "dividers" && <SaaSDividerLibrary />}
      {docsSubView === "tooltips" && <SaaSTooltipLibrary />}
      {docsSubView === "feedback" && <SaaSFeedbackLibrary />}
      {docsSubView === "overlays" && <SaaSOverlaysLibrary />}
      {docsSubView === "navigation" && <SaaSNavigationLibrary />}
      {docsSubView === "data" && <SaaSDataLibrary />}
      {docsSubView === "business" && <SaaSBusinessLibrary />}
      {docsSubView === "layouts" && <SaaSLayoutLibrary />}
      {docsSubView === "screens" && <SaaSAppScreensLibrary />}
      {docsSubView === "edge-cases" && <SaaSEdgeCasesLibrary />}
    </div>
  );
}
