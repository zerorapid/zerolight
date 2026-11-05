"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TraceDot,
  TraceDotStatus,
  MonoValue,
  SegmentPill,
  ApertureSlider,
  KeyBadge,
  ApertureAction,
  TrendDelta,
  KbdShortcut,
  MicroInput,
  ApertureSwitch,
  AuditTimestamp,
  CopyTrigger,
  CapacityMeter,
  EntityAvatar,
} from "@/components/zerolight/atoms";

export default function AtomsDocumentationPage() {
  // TraceDot Interactive State
  const [selectedDotStatus, setSelectedDotStatus] = useState<TraceDotStatus>("active");

  // MonoValue Interactive State & Randomizer
  const [metricValue, setMetricValue] = useState<number>(14250);
  const [prevMetricValue, setPrevMetricValue] = useState<number>(18000);

  const randomizeMetric = () => {
    setPrevMetricValue(metricValue);
    setMetricValue(Math.floor(5000 + Math.random() * 20000));
  };

  // SegmentPill Interactive State
  const [selectedTier, setSelectedTier] = useState<string>("Enterprise");
  const [selectedReason, setSelectedReason] = useState<string>("Volume SLA");

  // ApertureSlider Interactive State
  const [sliderVal, setSliderVal] = useState<number>(20);

  // TrendDelta & Latency
  const [trendVal, setTrendVal] = useState<number>(16.4);
  const [latencyDelta, setLatencyDelta] = useState<number>(-48);

  // MicroInput State
  const [microNumVal, setMicroNumVal] = useState<string>("2400");
  const [microRateVal, setMicroRateVal] = useState<string>("15");

  // ApertureSwitch Tactile Physics State
  const [switchTransitCoverage, setSwitchTransitCoverage] = useState<boolean>(true);
  const [switchAutoReconcile, setSwitchAutoReconcile] = useState<boolean>(false);
  const [switchAuditLock, setSwitchAuditLock] = useState<boolean>(true);

  // CapacityMeter Tactile Physics State
  const [quotaVal, setQuotaVal] = useState<number>(94); // Default to >90% to showcase critical pulse immediately

  // EntityAvatar State
  const [avatarInputName, setAvatarInputName] = useState<string>("Acme Cloud");

  // Action Logger State
  const [actionLog, setActionLog] = useState<string[]>([]);

  const logAction = (name: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setActionLog((prev) => [`[${timestamp}] Executed: ${name}`, ...prev.slice(0, 3)]);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Header */}
      <header className="border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur sticky top-0 z-50 px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center font-mono font-bold text-xs text-neutral-950 shadow-sm shadow-emerald-900/40 hover:bg-emerald-500 transition-colors"
            >
              ZL
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold tracking-wide text-neutral-100">
                  ZeroLight Living Atomic Laboratory
                </h1>
                <KeyBadge label="Tactile Physics" variant="emerald" size="xs" />
              </div>
              <p className="text-xs text-neutral-400">
                Micro-Spring Dynamics • Native CSS Cubic-Bezier Transitions • Zero External Dependencies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-mono px-3 py-1.5 rounded border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 transition text-neutral-300"
            >
              ← Back to Workbench
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-12">
        {/* Architecture Manifesto Banner */}
        <section className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-5 space-y-2">
          <div className="flex items-center gap-2">
            <TraceDot status="settled" />
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-200">
              Tactile Motion Physics Architecture
            </h2>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            ZeroLight eschews heavy JavaScript animation packages. All motion is engineered via native CSS GPU-accelerated
            transforms with a custom spring curve: <code className="text-emerald-400 font-mono">cubic-bezier(0.175, 0.885, 0.32, 1.275)</code>.
            Test the live value shimmers, ripple feedbacks, and threshold pulsing below.
          </p>
        </section>

        {/* 01: MonoValue Shimmer Physics */}
        <section className="space-y-4">
          <div className="border-b border-neutral-800/80 pb-2 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
                <span className="text-emerald-400">01</span>
                <span>MonoValue: Value-Update Shimmer Physics</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Automatically detects data revisions via reactive state hook and executes a micro-bump scale shimmer.
              </p>
            </div>
            <KeyBadge label="Motion Atom" variant="emerald" size="xs" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
              <div className="text-[11px] font-mono uppercase text-neutral-400 font-medium">Live Value Display</div>
              <div className="p-6 rounded bg-neutral-950 border border-neutral-850 text-center space-y-1.5">
                <div className="text-[10px] text-neutral-500 font-mono uppercase">Audited Metric Readout:</div>
                <MonoValue
                  value={metricValue}
                  previousValue={prevMetricValue}
                  prefix="$"
                  variant="success"
                  size="lg"
                  className="scale-110"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-mono text-neutral-500">Click to trigger spring bump:</span>
                <button
                  type="button"
                  onClick={randomizeMetric}
                  className="px-3 py-1.5 text-xs font-mono font-semibold rounded border border-emerald-700 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 transition-all active:scale-95 shadow-sm"
                >
                  ⚡ Randomize Value (Preview Shimmer)
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
              <div className="text-[11px] font-mono uppercase text-neutral-400 font-medium">Manual Micro Slider</div>
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-mono text-neutral-400 mb-1">
                    <span>Adjust Amount:</span>
                    <span>${metricValue.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="30000"
                    step="500"
                    value={metricValue}
                    onChange={(e) => setMetricValue(Number(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                </div>
                <p className="text-[11px] text-neutral-500 leading-normal font-sans">
                  Notice how each discrete numeric shift triggers a hardware-accelerated bump without framer-motion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 02: ApertureSwitch Spring Thumb & Glow Physics */}
        <section className="space-y-4">
          <div className="border-b border-neutral-800/80 pb-2 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
                <span className="text-emerald-400">02</span>
                <span>ApertureSwitch: Spring-Damped Slide &amp; Glow Ring</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Features cubic-bezier spring thumb dynamics (`translate-x-[15px]`) with emerald peripheral glow.
              </p>
            </div>
            <KeyBadge label="Motion Atom" variant="emerald" size="xs" />
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded bg-neutral-950 border border-neutral-850 flex items-center justify-between">
                <ApertureSwitch
                  checked={switchTransitCoverage}
                  onChange={setSwitchTransitCoverage}
                  label="Marine Cargo"
                  description="Spring-damped"
                />
                <span className="text-[11px] font-mono font-bold text-neutral-400">
                  {switchTransitCoverage ? "ON" : "OFF"}
                </span>
              </div>

              <div className="p-3.5 rounded bg-neutral-950 border border-neutral-850 flex items-center justify-between">
                <ApertureSwitch
                  checked={switchAutoReconcile}
                  onChange={setSwitchAutoReconcile}
                  label="Auto Ledger"
                  description="Glow active"
                />
                <span className="text-[11px] font-mono font-bold text-neutral-400">
                  {switchAutoReconcile ? "ON" : "OFF"}
                </span>
              </div>

              <div className="p-3.5 rounded bg-neutral-950 border border-neutral-850 flex items-center justify-between">
                <ApertureSwitch
                  checked={switchAuditLock}
                  onChange={setSwitchAuditLock}
                  label="Audit Lock"
                  description="Hardened state"
                />
                <span className="text-[11px] font-mono font-bold text-neutral-400">
                  {switchAuditLock ? "ON" : "OFF"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 03: CopyTrigger Ripple Burst & Checkmark Morph */}
        <section className="space-y-4">
          <div className="border-b border-neutral-800/80 pb-2 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
                <span className="text-emerald-400">03</span>
                <span>CopyTrigger: Ripple Burst &amp; Checkmark Morph</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Displays expanding ping ripple, emerald border flash, and 45-degree rotating checkmark icon morph.
              </p>
            </div>
            <KeyBadge label="Motion Atom" variant="emerald" size="xs" />
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
            <div className="text-[11px] font-mono uppercase text-neutral-400 font-medium">Click Any Trigger Below to Test Ripple Physics:</div>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <CopyTrigger text="0x9482f7192a83c0" displayText="0x9482...3c0" />
              <CopyTrigger text="INV-2026-9041" displayText="INV-2026-9041" />
              <CopyTrigger text="BAT-408-AUSTIN" displayText="BAT-408" />
              <CopyTrigger text="sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069" displayText="sha256:7f83...9069" />
            </div>
          </div>
        </section>

        {/* 04: CapacityMeter 90% Threshold Pulse Glow */}
        <section className="space-y-4">
          <div className="border-b border-neutral-800/80 pb-2 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
                <span className="text-emerald-400">04</span>
                <span>CapacityMeter: 90% Threshold Pulse Glow</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Interpolates bar width smoothly with spring easing; triggers hardware-pulsing glow when exceeding 90%.
              </p>
            </div>
            <KeyBadge label="Motion Atom" variant="emerald" size="xs" />
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-5 space-y-5">
            <CapacityMeter
              value={quotaVal}
              max={100}
              unit="%"
              label="Real-Time SaaS Concession Quota"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-neutral-800/80">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-neutral-400">Quick Test:</span>
                <button
                  type="button"
                  onClick={() => setQuotaVal(45)}
                  className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 hover:text-white text-xs text-neutral-300"
                >
                  45% (Nominal)
                </button>
                <button
                  type="button"
                  onClick={() => setQuotaVal(82)}
                  className="px-2.5 py-1 rounded bg-amber-950/40 border border-amber-800/60 hover:text-amber-200 text-xs text-amber-300"
                >
                  82% (Warning)
                </button>
                <button
                  type="button"
                  onClick={() => setQuotaVal(95)}
                  className="px-2.5 py-1 rounded bg-rose-950/60 border border-rose-800/80 hover:text-rose-200 text-xs text-rose-300 font-semibold animate-pulse"
                >
                  🚨 95% (Trigger Critical Pulse)
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <label className="text-neutral-400">Slider:</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={quotaVal}
                  onChange={(e) => setQuotaVal(Number(e.target.value))}
                  className="w-40 accent-emerald-400"
                />
                <span className="text-neutral-100 font-bold">{quotaVal}%</span>
              </div>
            </div>
          </div>
        </section>

        {/* 05: SegmentPill Micro-Scale Bounce */}
        <section className="space-y-4">
          <div className="border-b border-neutral-800/80 pb-2 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
                <span className="text-emerald-400">05</span>
                <span>SegmentPill: Spring Bounce &amp; Selection Glow</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Features `active:scale-95`, `hover:scale-[1.02]`, and a soft white peripheral glow when selected.
              </p>
            </div>
            <KeyBadge label="Motion Atom" variant="emerald" size="xs" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
              <div className="text-[11px] font-mono uppercase text-neutral-400 font-medium">Customer Tier Segment</div>
              <div className="flex flex-wrap gap-2.5 p-3 rounded bg-neutral-950 border border-neutral-850">
                {["Standard", "Enterprise", "VIP", "Global Partner"].map((tier) => (
                  <SegmentPill
                    key={tier}
                    label={tier}
                    selected={selectedTier === tier}
                    onSelect={() => setSelectedTier(tier)}
                  />
                ))}
              </div>
              <div className="text-[11px] font-mono text-neutral-500">
                Active Selection: <span className="text-neutral-100 font-bold">{selectedTier}</span>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
              <div className="text-[11px] font-mono uppercase text-neutral-400 font-medium">SLA Justification Segment</div>
              <div className="flex flex-wrap gap-2.5 p-3 rounded bg-neutral-950 border border-neutral-850">
                {["Volume SLA", "Early Settlement", "Dispute Waiver", "Executive Signoff"].map((reason) => (
                  <SegmentPill
                    key={reason}
                    label={reason}
                    selected={selectedReason === reason}
                    onSelect={() => setSelectedReason(reason)}
                  />
                ))}
              </div>
              <div className="text-[11px] font-mono text-neutral-500">
                Active Justification: <span className="text-neutral-100 font-bold">{selectedReason}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 06: TrendDelta & Inverse Metrics */}
        <section className="space-y-4">
          <div className="border-b border-neutral-800/80 pb-2 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
                <span className="text-emerald-400">06</span>
                <span>TrendDelta: Real-Time Sentiment Grading</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Displays math deltas with automatic color-coding and inverse metric mode (e.g. lower latency is green).
              </p>
            </div>
            <KeyBadge label="atom" variant="outline" size="xs" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
              <div className="text-[11px] font-mono uppercase text-neutral-400 font-medium">Standard Sentiment (Revenue / Margin)</div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="-40"
                  max="40"
                  value={trendVal}
                  onChange={(e) => setTrendVal(Number(e.target.value))}
                  className="w-48 accent-emerald-400"
                />
                <TrendDelta value={trendVal} unit="%" size="sm" />
              </div>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
              <div className="text-[11px] font-mono uppercase text-neutral-400 font-medium">Inverse Sentiment (Latency / Churn)</div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={latencyDelta}
                  onChange={(e) => setLatencyDelta(Number(e.target.value))}
                  className="w-48 accent-emerald-400"
                />
                <TrendDelta value={latencyDelta} unit="ms" isInverse={true} size="sm" />
              </div>
            </div>
          </div>
        </section>

        {/* 07: MicroInput & EntityAvatar */}
        <section className="space-y-4">
          <div className="border-b border-neutral-800/80 pb-2 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
                <span className="text-emerald-400">07</span>
                <span>MicroInput, EntityAvatar &amp; KbdShortcut</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Compact inline fields, deterministic string hash avatars, and obsidian keycaps.
              </p>
            </div>
            <KeyBadge label="primitives" variant="outline" size="xs" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 space-y-2">
              <div className="text-[11px] font-mono uppercase text-neutral-400 font-medium">MicroInput</div>
              <MicroInput value={microNumVal} onChange={setMicroNumVal} prefix="$" className="w-full" />
              <MicroInput value={microRateVal} onChange={setMicroRateVal} suffix="%" className="w-full" />
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 space-y-2">
              <div className="text-[11px] font-mono uppercase text-neutral-400 font-medium">EntityAvatar Generator</div>
              <input
                type="text"
                value={avatarInputName}
                onChange={(e) => setAvatarInputName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-100 font-mono"
              />
              <div className="flex items-center gap-2 pt-1">
                <EntityAvatar name={avatarInputName} size="md" />
                <span className="text-xs font-mono text-neutral-300 truncate">{avatarInputName}</span>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 space-y-2">
              <div className="text-[11px] font-mono uppercase text-neutral-400 font-medium">KbdShortcut Keycaps</div>
              <div className="space-y-1.5 pt-1 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Search:</span>
                  <KbdShortcut shortcut="⌘+K" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Sign &amp; Collapse:</span>
                  <KbdShortcut shortcut="⌘+Enter" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 08: Full Composition with Motion Physics */}
        <section className="space-y-4 pt-4 border-t border-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-200">
                08 • Micro-Action Card with Tactile Motion Integration
              </h3>
              <p className="text-xs text-neutral-400">
                All spring transitions, shimmer bumps, and threshold alarms active simultaneously in a single container.
              </p>
            </div>
            <KeyBadge label="Compound Assembly" variant="emerald" size="xs" />
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-5 space-y-4 max-w-xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
              <div className="flex items-center gap-2.5">
                <EntityAvatar name="Acme Cloud" size="sm" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-200">Acme Cloud Infrastructure</span>
                    <KeyBadge label="VIP" variant="amber" size="xs" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono">
                    <CopyTrigger text="INV-2026-9041" displayText="INV-2026-9041" />
                    <AuditTimestamp format="compact" />
                  </div>
                </div>
              </div>
              <TraceDot status="active" />
            </div>

            {/* Calculations & Delta */}
            <div className="flex justify-between items-center text-xs font-mono p-3 rounded bg-neutral-900/60 border border-neutral-800">
              <div>
                <span className="text-neutral-500 text-[10px] block font-sans">NET PAYABLE TOTAL</span>
                <MonoValue
                  value={18400 - (18400 * sliderVal) / 100}
                  previousValue={18400}
                  prefix="$"
                  variant="success"
                  size="md"
                />
              </div>
              <div className="text-right">
                <span className="text-neutral-500 text-[10px] block font-sans">CONCESSION DELTA</span>
                <TrendDelta value={-sliderVal} unit="%" size="xs" />
              </div>
            </div>

            {/* Slider */}
            <ApertureSlider
              label="Concession Limit"
              unit="%"
              min={0}
              max={40}
              value={sliderVal}
              onChange={setSliderVal}
            />

            {/* Quota meter */}
            <CapacityMeter
              value={quotaVal}
              max={100}
              label="Monthly Concession Quota"
            />

            {/* Switch & Action */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-850">
              <ApertureSwitch
                checked={switchTransitCoverage}
                onChange={setSwitchTransitCoverage}
                label="Transit Underwriting"
              />
              <div className="flex items-center gap-2">
                <ApertureAction
                  label="Abort"
                  variant="ghost"
                  onClick={() => logAction("Voucher Abort")}
                />
                <ApertureAction
                  label="Sign &amp; Settle"
                  variant="primary"
                  onClick={() => logAction("Voucher Sign & Settle")}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 px-6 py-4 text-center text-xs text-neutral-500 font-mono">
        ZeroLight Design Engine • Tactile Motion Physics • Principal Frontend Systems Architecture
      </footer>
    </main>
  );
}
