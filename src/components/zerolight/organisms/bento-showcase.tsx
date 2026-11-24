"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { ProductWindow, PlaceholderLines } from "../molecules/product-stage";
import { Badge } from "../atoms/badge";
import { Switch } from "../atoms/switch";
import { Button } from "../atoms/button";
import { Avatar } from "../atoms/avatar";
import { Sparkline } from "../molecules/sparkline";
import { DonutChart } from "../molecules/donut-chart";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Lock,
} from "lucide-react";

export interface BentoShowcaseProps {
  className?: string;
  title?: string;
  subtitle?: string;
}

/**
 * BentoShowcase: Human-crafted SaaS Bento Grid Organism.
 * Implements Benji Taylor's Stageshow Bento Rules + ZeroLight Math Tokens:
 * 1. Window chrome appears exactly ONCE across the entire grid (no "wall of screenshots").
 * 2. Only 1/3 of tiles show detailed UI; others are an impactful stat, a tactile control, and a micro-diagram.
 * 3. Strict 1px hairline borders, high-contrast YIQ typography, and intentional overflow bleed.
 */
export function BentoShowcase({
  className = "",
  title = "Enterprise Autonomous Infrastructure",
  subtitle = "ZeroLight Design System assembled into a Linear/Stripe-grade product showcase.",
}: BentoShowcaseProps) {
  const { tokens, scaled } = useZeroLight();

  const [auditToggle, setAuditToggle] = useState(true);
  const [mfaToggle, setMfaToggle] = useState(true);

  const primColor = tokens.primaryButtonColor || "#0F172A";
  const secColor = tokens.chartSecondaryColor || "#10B981";

  return (
    <section className={`w-full max-w-5xl mx-auto space-y-6 ${className}`}>
      {/* ── SECTION HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: primColor }}
            />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              SaaS Bento Architecture
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="healthy" size="sm" showDot>
            Framing Verified
          </Badge>
          <Badge variant="info" size="sm">
            Zero Fake Screencaps
          </Badge>
        </div>
      </div>

      {/* ── BENTO GRID CANVAS (4 ASYMMETRICAL TILES) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {/* ════ TILE 1: THE HERO WINDOW CHROME (SPANS 2 COLS, CROPPED BOTTOM) ════ */}
        <div
          className="md:col-span-2 rounded-2xl border bg-white p-5 flex flex-col justify-between overflow-hidden shadow-xs relative"
          style={{
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            borderRadius: `${Math.max(16, scaled.scaledCardRadius)}px`,
          }}
        >
          <div className="flex items-center justify-between pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Core Workspace
              </span>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Active Edge Mesh Workloads
              </h3>
            </div>
            <Button variant="outline" size="sm" iconRight={<ArrowUpRight className="w-3 h-3" />}>
              Open Console
            </Button>
          </div>

          {/* Window Chrome with Bleed (Runs off bottom edge gracefully) */}
          <div className="mt-2 -mb-5 -mx-1">
            <ProductWindow
              chrome="macos"
              title="Cluster Registry &bull; 48 Pods"
              bleed="bottom"
              className="shadow-md"
            >
              <div className="p-3.5 space-y-2 bg-white text-xs">
                {/* Micro-table rows */}
                {[
                  { name: "gateway-ingress-01", region: "us-east-1", status: "healthy", qps: "42.8k" },
                  { name: "auth-mesh-worker", region: "eu-west-1", status: "healthy", qps: "18.2k" },
                  { name: "telemetry-indexer", region: "ap-south-1", status: "syncing", qps: "8.9k" },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ backgroundColor: primColor }}
                      >
                        {row.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block">{row.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{row.region}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono tabular-nums text-slate-600 font-medium">
                        {row.qps}
                      </span>
                      <Badge variant={row.status as any} size="xs" showDot>
                        {row.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ProductWindow>
          </div>
        </div>

        {/* ════ TILE 2: THE HIGH-CONTRAST STAT TILE (OBSIDIAN INK / DARK) ════ */}
        <div
          className="rounded-2xl p-5 flex flex-col justify-between text-white shadow-xs relative overflow-hidden"
          style={{
            backgroundColor: "#09090B",
            borderColor: "#27272A",
            borderWidth: `${tokens.borderWidth}px`,
            borderRadius: `${Math.max(16, scaled.scaledCardRadius)}px`,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              SLA Guarantee
            </span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-1 my-4">
            <div className="text-3xl font-extrabold tracking-tight font-sans tabular-nums text-white">
              99.995%
            </div>
            <div className="text-xs text-zinc-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero unplanned downtime (40d)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800">
            <Sparkline
              data={[98, 99, 99.5, 99.8, 99.99, 99.995]}
              height={40}
              color="#10B981"
            />
          </div>
        </div>

        {/* ════ TILE 3: THE TACTILE CONTROL CARD (INTERACTIVE PERMISSIONS) ════ */}
        <div
          className="rounded-2xl border bg-white p-5 flex flex-col justify-between shadow-xs"
          style={{
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            borderRadius: `${Math.max(16, scaled.scaledCardRadius)}px`,
            backgroundColor: tokens.universalFillColor || "#FFFFFF",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Security &amp; Policy
              </span>
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Access Governance
            </h3>
          </div>

          <div className="space-y-3.5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  Enforce Hardware MFA
                </span>
                <span className="text-[10px] text-slate-400">FIDO2 / YubiKey Only</span>
              </div>
              <Switch checked={mfaToggle} onChange={setMfaToggle} />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  Immutable Audit Stream
                </span>
                <span className="text-[10px] text-slate-400">SOC2 Type II Sync</span>
              </div>
              <Switch checked={auditToggle} onChange={setAuditToggle} />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <div className="flex items-center -space-x-1.5">
              <Avatar initials="JR" size="xs" />
              <Avatar initials="TL" size="xs" />
            </div>
            <span className="text-[10px] font-medium text-slate-500">
              2 Organization Admins Active
            </span>
          </div>
        </div>

        {/* ════ TILE 4: THE MICRO-DIAGRAM / CHART TILE (SPANS 2 COLS) ════ */}
        <div
          className="md:col-span-2 rounded-2xl border bg-white p-5 flex flex-col justify-between shadow-xs"
          style={{
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            borderRadius: `${Math.max(16, scaled.scaledCardRadius)}px`,
            backgroundColor: tokens.universalFillColor || "#FFFFFF",
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Traffic Telemetry
              </span>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Global Edge Distribution by Protocol
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500 tabular-nums">
              Total Volume: 14.8M req/day
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center py-2">
            <div className="flex justify-center">
              <DonutChart
                size={135}
                strokeWidth={18}
                data={[
                  { id: "1", label: "HTTP/3 Quic", value: 58, color: primColor },
                  { id: "2", label: "gRPC Mesh", value: 28, color: secColor },
                  { id: "3", label: "WebSockets", value: 14, color: "#94A3B8" },
                ]}
              />
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primColor }} />
                    HTTP/3 Quic (Edge)
                  </span>
                  <span className="tabular-nums font-mono font-bold">58%</span>
                </div>
                <PlaceholderLines count={1} widths={["85%"]} />
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: secColor }} />
                    gRPC Internal Mesh
                  </span>
                  <span className="tabular-nums font-mono font-bold">28%</span>
                </div>
                <PlaceholderLines count={1} widths={["70%"]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
