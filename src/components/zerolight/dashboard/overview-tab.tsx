"use client";

import React, { useState } from "react";
import {
  Sliders,
  FileCode2,
  Building,
  User,
  HelpCircle,
  ChevronDown,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "../atoms/badge";

export interface OverviewTabProps {
  onNavigateDocs: () => void;
  onNavigateOrganisms: () => void;
}

const OVERVIEW_FAQS = [
  {
    q: "How does ZeroLight prevent AI agent hallucination during UI development?",
    a: "ZeroLight features a native Model Context Protocol (MCP) server located at bin/zerolight-mcp.mjs. AI coding agents (such as Cursor, Claude Code, and Antigravity) connect over JSON-RPC 2.0 to query the exact component registry, typed props, and token schemas directly from source files, preventing hallucinated hex colors, arbitrary CSS classes, and invalid props.",
  },
  {
    q: "What is the core philosophy of 'Tactile Calm' across ZeroLight surfaces?",
    a: "Tactile Calm enforces clean, high-density typography with font-sans tabular-nums, single primary CTA per viewport, 1px hairline borders, subtle luminance stepping, and zero decorative noise (no multi-stop gradients, no glowing drop-shadows, and zero gratuitous emojis).",
  },
  {
    q: "Why is Apple/Airbnb-grade light mode enforced by default across the OS?",
    a: "B2B SaaS dashboards require maximum contrast, instant legibility, and visual calmness during extended operational shifts. ZeroLight defaults to a crisp #FFFFFF and #F8FAFC canvas with high-contrast slate text and 1px borders, offering dark surfaces as an opt-in token mode.",
  },
  {
    q: "How are components synced between npm packages and the zero-dependency registry?",
    a: "ZeroLight maintains a public/registry/index.json and public/r/index.json registry with 125 items categorized into Foundations, Atoms, Molecules, Organisms, Templates, and Views. Developers can run 'npx zerolight add <component>' to copy production TSX directly into their repository.",
  },
  {
    q: "Can the World Atlas Map run completely offline without map tile subscriptions?",
    a: "Yes. ZeroLight's World Atlas Map uses a pure mathematical SVG projection pipeline powered by D3 Natural Earth geometry with full antimeridian boundary clipping. It requires zero Mapbox/Google Maps API keys, produces zero SSR hydration mismatches, and can be exported as standalone SVG vector files.",
  },
];

/** Overview tab showing workspace metrics, architecture FAQs, and quick links. */
export function OverviewTab({ onNavigateDocs, onNavigateOrganisms }: OverviewTabProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="pb-0.5 shrink-0">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Welcome to ZeroLight OS
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Enterprise Design System &amp; Component Workspace
        </p>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">PRIMITIVES</span>
            <span className="sr-only">TOTAL COMPONENTS ADDED</span>
            <Sliders className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-950 tracking-tight font-sans tabular-nums">
            120
          </div>
          <div className="text-xs text-zinc-500 pt-1">
            43 Atoms • 45 Molecules • 19 Organisms • 13 Templates &amp; Views
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">TEMPLATES</span>
            <span className="sr-only">TOTAL SAAS TEMPLATES</span>
            <FileCode2 className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-950 tracking-tight font-sans tabular-nums">
            12
          </div>
          <div className="text-xs text-zinc-500 pt-1">
            Production B2B &amp; Fintech
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">VERTICALS</span>
            <span className="sr-only">TOTAL NICHES COVERED</span>
            <Building className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-950 tracking-tight font-sans tabular-nums">
            8
          </div>
          <div className="text-xs text-zinc-500 pt-1">
            Fintech, DevTools, AI &amp; Health
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">TEAMS</span>
            <span className="sr-only">TOTAL CLIENTS SERVED</span>
            <User className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-950 tracking-tight font-sans tabular-nums">
            1,420+
          </div>
          <div className="text-xs text-zinc-500 pt-1">
            99.98% Uptime • SOC2 Type II &amp; HIPAA
          </div>
        </div>
      </div>

      {/* Enterprise FAQ Section */}
      <div className="space-y-4 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-zinc-600" />
              <span>Frequently Asked Questions & Architecture</span>
            </h3>
            <p className="text-xs text-zinc-500">
              Enterprise answers on AI agent hallucination prevention, Tactile Calm rules, and light-mode baseline.
            </p>
          </div>
          <Badge variant="neutral">Architecture Spec</Badge>
        </div>

        <div className="space-y-2.5">
          {OVERVIEW_FAQS.map((faq, index) => {
            const isOpen = expandedFaq === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-zinc-200/90 bg-white overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-zinc-50/60 transition cursor-pointer"
                >
                  <span className="text-xs font-semibold text-zinc-900">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-zinc-900" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-zinc-600 border-t border-zinc-100 bg-zinc-50/30 leading-relaxed animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Links to Core Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        <div
          onClick={onNavigateDocs}
          className="p-5 rounded-2xl bg-white border border-zinc-200/90 hover:border-zinc-400 transition-all cursor-pointer shadow-xs group space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-xs text-zinc-950">
                ZeroLight Design System Documentation
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
          </div>
          <p className="text-xs text-zinc-500">
            Minimalist, developer-focused set of visual foundations, UI component primitives (Atoms, Molecules, Organisms), and brand assets.
          </p>
        </div>

        <div
          onClick={onNavigateOrganisms}
          className="p-5 rounded-2xl bg-white border border-zinc-200/90 hover:border-zinc-400 transition-all cursor-pointer shadow-xs group space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-xs text-zinc-950">
                Organisms, Templates &amp; Views
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
          </div>
          <p className="text-xs text-zinc-500">
            Browse enterprise data tables, billing portals, multi-tenant kits, and full-page SaaS layouts.
          </p>
        </div>
      </div>
    </div>
  );
}
