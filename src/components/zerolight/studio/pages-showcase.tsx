"use client";

import React from "react";
import {
  Bot,
  CreditCard,
  DollarSign,
  ExternalLink,
  Globe,
  GraduationCap,
  Settings,
  Terminal,
} from "lucide-react";
import { ZeroLightTokens, ScaledTokens } from "../types";
import { Badge } from "../atoms";
import {
  AiAssistantView,
  BillingView,
  DevConsoleView,
  FinexyDashboardInner,
  SchoolAttendanceInner,
  SettingsView,
} from "../views";

export type StudioPageTab =
  | "dev-console"
  | "billing"
  | "ai-assistant"
  | "settings"
  | "finexy"
  | "school-attendance";

export interface PagesShowcaseProps {
  activePageTab: StudioPageTab;
  setActivePageTab: React.Dispatch<React.SetStateAction<StudioPageTab>>;
  tokens: ZeroLightTokens;
  scaled: ScaledTokens;
  cardStyle: React.CSSProperties;
}

export function PagesShowcase({
  activePageTab,
  setActivePageTab,
  tokens,
  scaled,
  cardStyle,
}: PagesShowcaseProps) {
  return (
              <div className="space-y-6">
                {/* Header Banner & Page Sub-Switcher */}
                <div style={cardStyle} className="p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Globe size={scaled.iconSmSize || 16} strokeWidth={tokens.iconStrokeWidth || 1.75} color={tokens.iconColor || tokens.textIconColor} />
                        <h2 style={{ fontSize: `${scaled.headingFontSize}px`, color: tokens.textIconColor }} className="font-semibold">
                          Atomic Tier 5: Enterprise SaaS Pages
                        </h2>
                        <Badge variant="healthy">6 Full Screens</Badge>
                      </div>
                      <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500 leading-relaxed max-w-2xl">
                        Production domain applications rendered live with active design tokens. Tweak any Visual Studio slider or color on the right to see the screen transform instantly.
                      </p>
                    </div>

                    {/* Open standalone button */}
                    <a
                      href={`/${activePageTab}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg transition-colors shrink-0 shadow-2xs"
                    >
                      <span>Open Standalone Tab</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Page Selector Pill Tabs - Single Line, Never Wraps */}
                  <div
                    style={{
                      borderRadius: `${scaled.scaledPillRadius}px`,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      backgroundColor: tokens.hoverBackplateTint,
                    }}
                    className="flex items-center gap-1.5 p-1 border shadow-xs overflow-x-auto whitespace-nowrap scrollbar-none"
                  >
                    {[
                      { id: "dev-console", label: "Dev Console", icon: <Terminal className="w-3.5 h-3.5" /> },
                      { id: "billing", label: "Billing Hub", icon: <CreditCard className="w-3.5 h-3.5" /> },
                      { id: "ai-assistant", label: "AI Copilot", icon: <Bot className="w-3.5 h-3.5" /> },
                      { id: "settings", label: "Org Settings", icon: <Settings className="w-3.5 h-3.5" /> },
                      { id: "finexy", label: "Finexy FinTech", icon: <DollarSign className="w-3.5 h-3.5" /> },
                      { id: "school-attendance", label: "School Attendance", icon: <GraduationCap className="w-3.5 h-3.5" /> },
                    ].map((pg) => {
                      const isSelected = activePageTab === pg.id;
                      return (
                        <button
                          key={pg.id}
                          type="button"
                          onClick={() => setActivePageTab(pg.id as any)}
                          style={{
                            backgroundColor: isSelected ? tokens.primaryButtonColor : "transparent",
                            color: isSelected ? scaled.primaryActionTextColor : tokens.textIconColor,
                            borderRadius: `${scaled.scaledPillRadius}px`,
                            transition: "all 0.2s ease",
                          }}
                          className={`px-3.5 py-2 text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 ${
                            isSelected ? "shadow-xs" : "hover:text-neutral-900"
                          }`}
                        >
                          {pg.icon}
                          <span>{pg.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Render Selected Screen */}
                <div style={cardStyle} className="p-0 border shadow-md overflow-hidden rounded-xl">
                  {activePageTab === "dev-console" && <DevConsoleView />}
                  {activePageTab === "billing" && <BillingView />}
                  {activePageTab === "ai-assistant" && <AiAssistantView />}
                  {activePageTab === "settings" && <SettingsView />}
                  {activePageTab === "finexy" && <FinexyDashboardInner />}
                  {activePageTab === "school-attendance" && <SchoolAttendanceInner />}
                </div>
              </div>
  );
}
