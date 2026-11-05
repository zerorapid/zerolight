"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Button,
  ButtonVariant,
  ButtonSize,
  Input,
  InputStatus,
  Checkbox,
  Spinner,
  Heading,
  Text,
  Icon,
  IconName,
  IconSize,
  StatusPill,
  StatusPillVariant,
  SkeletonBar,
  TraceDot,
  TraceDotStatus,
  MonoValue,
  SegmentPill,
  ApertureSlider,
  KeyBadge,
  KeyBadgeVariant,
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

type GlobalScale = "sm" | "md" | "lg";
type SimulatedState = "rest" | "error" | "success" | "loading" | "disabled";

export default function AtomsStudioPage() {
  // Global Studio Calibration State
  const [globalScale, setGlobalScale] = useState<GlobalScale>("md");
  const [simulatedState, setSimulatedState] = useState<SimulatedState>("rest");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Editable Atom State: Button
  const [buttonText, setButtonText] = useState<string>("Authorize Action");
  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>("primary");

  // Editable Atom State: Input
  const [inputText, setInputText] = useState<string>("acme-workspace-prod");
  const [inputPlaceholder, setInputPlaceholder] = useState<string>("Enter identifier...");

  // Editable Atom State: Checkbox
  const [checkboxChecked, setCheckboxChecked] = useState<boolean>(true);
  const [checkboxLabel, setCheckboxLabel] = useState<string>("Enable SLA Underwriting");

  // Editable Atom State: Typography
  const [headingText, setHeadingText] = useState<string>("Enterprise Access Provisioning");
  const [bodyText, setBodyText] = useState<string>(
    "Indivisible SaaS atom built from first principles with zero external UI packages."
  );

  // Editable Atom State: Icon
  const [selectedIcon, setSelectedIcon] = useState<IconName>("shield");
  const [iconSize, setIconSize] = useState<IconSize>("md");

  // Editable Atom State: StatusPill
  const [statusPillText, setStatusPillText] = useState<string>("Audit Certified");
  const [statusPillVariant, setStatusPillVariant] = useState<StatusPillVariant>("success");

  // Editable Atom State: MonoValue
  const [monoVal, setMonoVal] = useState<number>(14250);
  const [prevMonoVal, setPrevMonoVal] = useState<number>(18000);

  // Editable Atom State: TrendDelta
  const [trendVal, setTrendVal] = useState<number>(24.5);
  const [isInverseTrend, setIsInverseTrend] = useState<boolean>(false);

  // Editable Atom State: ApertureSlider
  const [sliderVal, setSliderVal] = useState<number>(20);

  // Editable Atom State: ApertureSwitch
  const [switchState, setSwitchState] = useState<boolean>(true);

  // Editable Atom State: CapacityMeter
  const [quotaVal, setQuotaVal] = useState<number>(85);

  // Editable Atom State: SegmentPill
  const [selectedPill, setSelectedPill] = useState<string>("Enterprise");

  // Editable Atom State: EntityAvatar
  const [avatarName, setAvatarName] = useState<string>("Acme Industrial Cloud");

  // Editable Atom State: KeyBadge
  const [badgeText, setBadgeText] = useState<string>("SOC2-CERTIFIED");
  const [badgeVariant, setBadgeVariant] = useState<KeyBadgeVariant>("emerald");

  // Copy Feedback
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const ATOM_NAV = [
    {
      group: "Brad Frost Core 4",
      items: [
        { id: "atom-button", label: "<Button />", tag: "Action" },
        { id: "atom-input", label: "<Input />", tag: "Capture" },
        { id: "atom-icon", label: "<Icon />", tag: "Visual" },
        { id: "atom-typography", label: "<Typography />", tag: "Text" },
      ],
    },
    {
      group: "Precision Data Capture",
      items: [
        { id: "atom-checkbox", label: "<Checkbox />", tag: "Binary" },
        { id: "atom-switch", label: "<ApertureSwitch />", tag: "Toggle" },
        { id: "atom-segment", label: "<SegmentPill />", tag: "Choice" },
        { id: "atom-slider", label: "<ApertureSlider />", tag: "Range" },
        { id: "atom-micro-input", label: "<MicroInput />", tag: "Inline" },
      ],
    },
    {
      group: "Quantitative & Telemetry",
      items: [
        { id: "atom-mono-value", label: "<MonoValue />", tag: "Math" },
        { id: "atom-trend-delta", label: "<TrendDelta />", tag: "Sentiment" },
        { id: "atom-capacity-meter", label: "<CapacityMeter />", tag: "Quota" },
        { id: "atom-timestamp", label: "<AuditTimestamp />", tag: "Chrono" },
      ],
    },
    {
      group: "Identity, Status & Utility",
      items: [
        { id: "atom-trace-dot", label: "<TraceDot />", tag: "Pulse" },
        { id: "atom-key-badge", label: "<KeyBadge />", tag: "Meta" },
        { id: "atom-status-pill", label: "<StatusPill />", tag: "State" },
        { id: "atom-entity-avatar", label: "<EntityAvatar />", tag: "Initials" },
        { id: "atom-spinner", label: "<Spinner />", tag: "Loader" },
        { id: "atom-copy-trigger", label: "<CopyTrigger />", tag: "Action" },
        { id: "atom-skeleton", label: "<SkeletonBar />", tag: "Speed" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Header */}
      <header className="border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur sticky top-0 z-50 px-6 py-3">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center font-mono font-bold text-xs text-neutral-950 shadow-sm shadow-emerald-900/50 hover:bg-emerald-400 transition"
            >
              ZL
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold tracking-wide text-neutral-100">
                  ZeroLight SaaS Atom Studio
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-medium">
                  20 Canonical Atoms
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Brad Frost Atomic Model • Editable • Scalable • Customizable • Tactile Motion
              </p>
            </div>
          </div>

          {/* Quick Calibration Bar */}
          <div className="flex items-center gap-4">
            {/* Scale Controller */}
            <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono">
              <span className="text-neutral-500 text-[10px] px-1 uppercase">Scale:</span>
              {(["sm", "md", "lg"] as GlobalScale[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setGlobalScale(s)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                    globalScale === s
                      ? "bg-emerald-500 text-neutral-950 shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>

            {/* State Simulator */}
            <div className="hidden md:flex items-center gap-1.5 p-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono">
              <span className="text-neutral-500 text-[10px] px-1 uppercase">State:</span>
              {(["rest", "error", "success", "loading", "disabled"] as SimulatedState[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSimulatedState(st)}
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold transition ${
                    simulatedState === st
                      ? "bg-neutral-100 text-neutral-950 shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <Link
              href="/"
              className="text-xs font-mono px-3 py-1.5 rounded-md border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 transition"
            >
              ← Workbench
            </Link>
          </div>
        </div>
      </header>

      {/* Studio Workspace Layout */}
      <div className="flex-1 max-w-[1500px] mx-auto w-full flex">
        {/* LEFT SIDEBAR: Atoms Directory */}
        <aside className="w-64 border-r border-neutral-800/80 p-4 space-y-6 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto hidden lg:block select-none bg-neutral-950/60">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
              <span className="font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Atoms Directory
              </span>
              <span className="text-[10px] text-neutral-500">Brad Frost</span>
            </div>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter atoms..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-2.5 py-1 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <nav className="space-y-5 text-xs">
            {ATOM_NAV.map((group) => {
              const filteredItems = group.items.filter(
                (item) =>
                  item.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  item.tag.toLowerCase().includes(searchFilter.toLowerCase())
              );
              if (filteredItems.length === 0) return null;

              return (
                <div key={group.group} className="space-y-1.5">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 px-2">
                    {group.group}
                  </div>
                  <div className="space-y-0.5 font-mono">
                    {filteredItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="flex items-center justify-between px-2 py-1.5 rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 transition-colors"
                      >
                        <span className="truncate">{item.label}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-800 text-neutral-500">
                          {item.tag}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* RIGHT WORKBENCH: Editable, Scalable, Customizable Atoms Showcase */}
        <main className="flex-1 p-6 sm:p-8 space-y-12 overflow-y-auto">
          {/* Studio Banner */}
          <section className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TraceDot status="settled" />
                <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-200">
                  Living Atomic Atelier &amp; Component Lab
                </h2>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">
                Interactive Canvas • Zero External Bloat
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans max-w-3xl">
              Every atom on this canvas is 100% interactive. Tweak labels, adjust sizes, and toggle states
              in the inline control drawers. All physics (spring deflections, shimmers, morphs) run via native GPU CSS.
            </p>
          </section>

          {/* ══════════════════════════════════════════════════════════
              SECTION 1: BRAD FROST CORE 4 ATOMS
             ══════════════════════════════════════════════════════════ */}
          <div className="space-y-8">
            <div className="border-b border-neutral-800 pb-2">
              <Heading level="h3" className="flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-sm">01</span>
                <span>The Core 4 Atoms (Brad Frost Foundation)</span>
              </Heading>
              <Text variant="caption" color="muted">
                The indivisible foundation: Action, Data Capture, Visual Container, and Typography.
              </Text>
            </div>

            {/* ATOM: BUTTON */}
            <section id="atom-button" className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-neutral-200">&lt;Button /&gt;</span>
                  <KeyBadge label="Action Atom" variant="emerald" size="xs" />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyCode(
                      `<Button variant="${buttonVariant}" size="${globalScale}">${buttonText}</Button>`,
                      "btn"
                    )
                  }
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                >
                  {copiedSnippet === "btn" ? "Copied!" : "Copy JSX"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Live Preview Stage */}
                <div className="md:col-span-7 flex flex-col items-center justify-center p-8 rounded-lg bg-neutral-950 border border-neutral-850 min-h-[140px] space-y-4">
                  <Button
                    variant={simulatedState === "error" ? "danger" : buttonVariant}
                    size={globalScale}
                    loading={simulatedState === "loading"}
                    disabled={simulatedState === "disabled"}
                    onClick={() => alert(`Executed: ${buttonText}`)}
                  >
                    {buttonText}
                  </Button>
                  <span className="text-[10px] font-mono text-neutral-500">
                    Click to test spring deflection (`active:scale-[0.985]`)
                  </span>
                </div>

                {/* Inline Customizer */}
                <div className="md:col-span-5 space-y-3 text-xs font-mono bg-neutral-950/60 p-4 rounded-lg border border-neutral-850">
                  <div className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                    Customizer Controls
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Button Label:</label>
                    <input
                      type="text"
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-neutral-100 font-sans text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Variant:</label>
                    <div className="flex flex-wrap gap-1">
                      {(["primary", "secondary", "outline", "ghost", "danger"] as ButtonVariant[]).map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setButtonVariant(v)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                            buttonVariant === v
                              ? "bg-emerald-500 text-neutral-950"
                              : "bg-neutral-900 text-neutral-400 hover:text-white"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ATOM: INPUT */}
            <section id="atom-input" className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-neutral-200">&lt;Input /&gt;</span>
                  <KeyBadge label="Data Capture Atom" variant="emerald" size="xs" />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyCode(
                      `<Input value={val} onChange={setVal} placeholder="${inputPlaceholder}" size="${globalScale}" />`,
                      "inp"
                    )
                  }
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                >
                  {copiedSnippet === "inp" ? "Copied!" : "Copy JSX"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7 flex flex-col justify-center p-8 rounded-lg bg-neutral-950 border border-neutral-850 min-h-[140px] space-y-3">
                  <Input
                    value={inputText}
                    onChange={setInputText}
                    size={globalScale}
                    status={
                      simulatedState === "error"
                        ? "error"
                        : simulatedState === "success"
                        ? "success"
                        : "default"
                    }
                    disabled={simulatedState === "disabled"}
                    placeholder={inputPlaceholder}
                    prefixIcon={<Icon name="search" size="sm" />}
                  />
                  <div className="flex justify-between text-[11px] font-mono text-neutral-500">
                    <span>Value: {inputText || "(empty)"}</span>
                    <span>Includes tactile clear button &amp; focus ring</span>
                  </div>
                </div>

                <div className="md:col-span-5 space-y-3 text-xs font-mono bg-neutral-950/60 p-4 rounded-lg border border-neutral-850">
                  <div className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                    Customizer Controls
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Placeholder:</label>
                    <input
                      type="text"
                      value={inputPlaceholder}
                      onChange={(e) => setInputPlaceholder(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-neutral-100 font-sans text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Quick Presets:</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setInputText("dev@zerorapid.com")}
                        className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 text-[10px]"
                      >
                        Email
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputText("api_live_849204")}
                        className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 text-[10px]"
                      >
                        API Key
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputText("")}
                        className="px-2 py-0.5 rounded bg-neutral-900 text-rose-400 text-[10px]"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ATOM: ICON */}
            <section id="atom-icon" className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-neutral-200">&lt;Icon /&gt;</span>
                  <KeyBadge label="Visual Asset Container Atom" variant="emerald" size="xs" />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyCode(`<Icon name="${selectedIcon}" size="${iconSize}" />`, "ico")
                  }
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                >
                  {copiedSnippet === "ico" ? "Copied!" : "Copy JSX"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7 flex items-center justify-center p-8 rounded-lg bg-neutral-950 border border-neutral-850 min-h-[140px] gap-6">
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-400 shadow-sm flex items-center justify-center">
                    <Icon name={selectedIcon} size={iconSize} stroke="regular" />
                  </div>
                  <div className="text-xs font-mono text-neutral-400">
                    <div>Name: <span className="text-neutral-100 font-bold">{selectedIcon}</span></div>
                    <div>Scale: <span className="text-neutral-100 font-bold">{iconSize}</span></div>
                    <div className="text-[10px] text-neutral-500">Auto `currentColor` inheritance</div>
                  </div>
                </div>

                <div className="md:col-span-5 space-y-3 text-xs font-mono bg-neutral-950/60 p-4 rounded-lg border border-neutral-850">
                  <div className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                    Select Icon
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    {(
                      [
                        "shield",
                        "zap",
                        "terminal",
                        "cloud",
                        "cube",
                        "key",
                        "check",
                        "alert",
                        "search",
                        "settings",
                        "sparkle",
                        "clock",
                      ] as IconName[]
                    ).map((ic) => (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => setSelectedIcon(ic)}
                        className={`p-1.5 rounded flex flex-col items-center gap-1 transition ${
                          selectedIcon === ic
                            ? "bg-emerald-500 text-neutral-950 font-bold"
                            : "bg-neutral-900 text-neutral-400 hover:text-white"
                        }`}
                      >
                        <Icon name={ic} size="sm" />
                        <span className="text-[8px] truncate max-w-full">{ic}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ATOM: TYPOGRAPHY */}
            <section id="atom-typography" className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-neutral-200">
                    &lt;Heading /&gt; &amp; &lt;Text /&gt;
                  </span>
                  <KeyBadge label="Typography Atoms" variant="emerald" size="xs" />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyCode(
                      `<Heading level="h2">${headingText}</Heading>\n<Text variant="body">${bodyText}</Text>`,
                      "typ"
                    )
                  }
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                >
                  {copiedSnippet === "typ" ? "Copied!" : "Copy JSX"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7 flex flex-col justify-center p-8 rounded-lg bg-neutral-950 border border-neutral-850 min-h-[140px] space-y-2">
                  <Heading level="h2">{headingText}</Heading>
                  <Text variant="body" color="secondary">
                    {bodyText}
                  </Text>
                  <div className="pt-2 flex gap-2">
                    <Text variant="label" color="brand">LABEL ATOM</Text>
                    <Text variant="code">@zerorapid/zerolight</Text>
                  </div>
                </div>

                <div className="md:col-span-5 space-y-3 text-xs font-mono bg-neutral-950/60 p-4 rounded-lg border border-neutral-850">
                  <div className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                    Edit Text Tokens
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Heading String:</label>
                    <input
                      type="text"
                      value={headingText}
                      onChange={(e) => setHeadingText(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-neutral-100 font-sans text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Body Text:</label>
                    <textarea
                      value={bodyText}
                      onChange={(e) => setBodyText(e.target.value)}
                      rows={2}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-neutral-100 font-sans text-xs"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ══════════════════════════════════════════════════════════
              SECTION 2: PRECISION DATA CAPTURE ATOMS
             ══════════════════════════════════════════════════════════ */}
          <div className="space-y-8 pt-6 border-t border-neutral-800">
            <div className="border-b border-neutral-800 pb-2">
              <Heading level="h3" className="flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-sm">02</span>
                <span>Precision Data Capture Atoms</span>
              </Heading>
              <Text variant="caption" color="muted">
                Indivisible selection toggles, binary switches, range constraints, and inline fields.
              </Text>
            </div>

            {/* Checkbox */}
            <section id="atom-checkbox" className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-neutral-200">&lt;Checkbox /&gt;</span>
                  <KeyBadge label="Binary Capture" variant="emerald" size="xs" />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyCode(
                      `<Checkbox checked={checked} onChange={setChecked} label="${checkboxLabel}" />`,
                      "chk"
                    )
                  }
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                >
                  {copiedSnippet === "chk" ? "Copied!" : "Copy JSX"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7 flex items-center justify-center p-8 rounded-lg bg-neutral-950 border border-neutral-850 min-h-[120px]">
                  <Checkbox
                    checked={checkboxChecked}
                    onChange={setCheckboxChecked}
                    label={checkboxLabel}
                    description="Kinetic SVG stroke draw with spring deflection"
                    disabled={simulatedState === "disabled"}
                  />
                </div>
                <div className="md:col-span-5 space-y-3 text-xs font-mono bg-neutral-950/60 p-4 rounded-lg border border-neutral-850">
                  <label className="text-[11px] text-neutral-400 block mb-1">Checkbox Label:</label>
                  <input
                    type="text"
                    value={checkboxLabel}
                    onChange={(e) => setCheckboxLabel(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-neutral-100 font-sans text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setCheckboxChecked(!checkboxChecked)}
                    className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs"
                  >
                    Toggle State ({checkboxChecked ? "Checked" : "Unchecked"})
                  </button>
                </div>
              </div>
            </section>

            {/* ApertureSwitch */}
            <section id="atom-switch" className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-neutral-200">&lt;ApertureSwitch /&gt;</span>
                  <KeyBadge label="Spring Thumb Physics" variant="emerald" size="xs" />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyCode(
                      `<ApertureSwitch checked={state} onChange={setState} label="Auto Settle" />`,
                      "sw"
                    )
                  }
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                >
                  {copiedSnippet === "sw" ? "Copied!" : "Copy JSX"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7 flex items-center justify-center p-8 rounded-lg bg-neutral-950 border border-neutral-850 min-h-[120px]">
                  <ApertureSwitch
                    checked={switchState}
                    onChange={setSwitchState}
                    label="Underwriting Coverage"
                    description="Features cubic-bezier spring thumb with emerald peripheral glow"
                    disabled={simulatedState === "disabled"}
                  />
                </div>
                <div className="md:col-span-5 space-y-3 text-xs font-mono bg-neutral-950/60 p-4 rounded-lg border border-neutral-850">
                  <div className="text-[11px] text-neutral-400">Current Physics State:</div>
                  <div className="font-bold text-emerald-400">
                    {switchState ? "ACTIVE • GLOW RING ON" : "IDLE • OBSIDIAN REST"}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSwitchState(!switchState)}
                    className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs"
                  >
                    Toggle Switch
                  </button>
                </div>
              </div>
            </section>

            {/* SegmentPill */}
            <section id="atom-segment" className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-neutral-200">&lt;SegmentPill /&gt;</span>
                  <KeyBadge label="Mode Choice" variant="emerald" size="xs" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-lg bg-neutral-950 border border-neutral-850 gap-4">
                <div className="flex flex-wrap gap-2">
                  {["Standard", "Enterprise", "VIP", "Global Partner"].map((tier) => (
                    <SegmentPill
                      key={tier}
                      label={tier}
                      selected={selectedPill === tier}
                      onSelect={() => setSelectedPill(tier)}
                      disabled={simulatedState === "disabled"}
                    />
                  ))}
                </div>
                <div className="text-xs font-mono text-neutral-400">
                  Selected: <span className="text-emerald-400 font-bold">{selectedPill}</span>
                </div>
              </div>
            </section>

            {/* ApertureSlider */}
            <section id="atom-slider" className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-neutral-200">&lt;ApertureSlider /&gt;</span>
                  <KeyBadge label="Constraint Range" variant="emerald" size="xs" />
                </div>
              </div>

              <div className="p-6 rounded-lg bg-neutral-950 border border-neutral-850 space-y-4">
                <ApertureSlider
                  label="Concession Limit Threshold"
                  unit="%"
                  min={0}
                  max={40}
                  value={sliderVal}
                  onChange={setSliderVal}
                  disabled={simulatedState === "disabled"}
                />
              </div>
            </section>
          </div>

          {/* ══════════════════════════════════════════════════════════
              SECTION 3: QUANTITATIVE & TELEMETRY ATOMS
             ══════════════════════════════════════════════════════════ */}
          <div className="space-y-8 pt-6 border-t border-neutral-800">
            <div className="border-b border-neutral-800 pb-2">
              <Heading level="h3" className="flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-sm">03</span>
                <span>Quantitative &amp; Telemetry Atoms</span>
              </Heading>
              <Text variant="caption" color="muted">
                Mathematical delta grading, monospace numbers with value update shimmers, and quota progress bars.
              </Text>
            </div>

            {/* MonoValue */}
            <section id="atom-mono-value" className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-neutral-200">&lt;MonoValue /&gt;</span>
                  <KeyBadge label="Value-Shimmer Physics" variant="emerald" size="xs" />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPrevMonoVal(monoVal);
                    setMonoVal(Math.floor(5000 + Math.random() * 25000));
                  }}
                  className="px-3 py-1 text-xs font-mono font-semibold rounded bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 transition active:scale-95 shadow-sm"
                >
                  ⚡ Trigger Shimmer Bump
                </button>
              </div>

              <div className="p-8 rounded-lg bg-neutral-950 border border-neutral-850 flex flex-col items-center justify-center space-y-2">
                <div className="text-[10px] font-mono uppercase text-neutral-500">Live Mathematical Readout</div>
                <MonoValue
                  value={monoVal}
                  previousValue={prevMonoVal}
                  prefix="$"
                  variant="success"
                  size={globalScale}
                  className="scale-125"
                />
              </div>
            </section>

            {/* TrendDelta */}
            <section id="atom-trend-delta" className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-neutral-200">&lt;TrendDelta /&gt;</span>
                  <KeyBadge label="Math Sentiment" variant="emerald" size="xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-lg bg-neutral-950 border border-neutral-850 space-y-3">
                  <div className="text-xs font-mono text-neutral-400">Standard Metric (Higher = Green):</div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={trendVal}
                      onChange={(e) => setTrendVal(Number(e.target.value))}
                      className="w-48 accent-emerald-400"
                    />
                    <TrendDelta value={trendVal} unit="%" size="md" />
                  </div>
                </div>

                <div className="p-6 rounded-lg bg-neutral-950 border border-neutral-850 space-y-3">
                  <div className="text-xs font-mono text-neutral-400">Inverse Metric (Lower = Green, e.g. Latency):</div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={trendVal}
                      onChange={(e) => setTrendVal(Number(e.target.value))}
                      className="w-48 accent-emerald-400"
                    />
                    <TrendDelta value={trendVal} unit="ms" isInverse={true} size="md" />
                  </div>
                </div>
              </div>
            </section>

            {/* CapacityMeter */}
            <section id="atom-capacity-meter" className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-neutral-200">&lt;CapacityMeter /&gt;</span>
                  <KeyBadge label="90% Critical Threshold Pulse" variant="emerald" size="xs" />
                </div>
              </div>

              <div className="p-6 rounded-lg bg-neutral-950 border border-neutral-850 space-y-5">
                <CapacityMeter value={quotaVal} max={100} label="SaaS Quota Consumption" />
                <div className="flex items-center gap-2 text-xs font-mono pt-2 border-t border-neutral-850">
                  <span className="text-neutral-500">Quick Thresholds:</span>
                  <button
                    type="button"
                    onClick={() => setQuotaVal(40)}
                    className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800 text-[10px]"
                  >
                    40% (Nominal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuotaVal(80)}
                    className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800 text-[10px]"
                  >
                    80% (Warning)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuotaVal(95)}
                    className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800 text-[10px] animate-pulse font-semibold"
                  >
                    🚨 95% (Critical Pulse)
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={quotaVal}
                    onChange={(e) => setQuotaVal(Number(e.target.value))}
                    className="w-32 accent-emerald-400 ml-auto"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* ══════════════════════════════════════════════════════════
              SECTION 4: IDENTITY, STATUS & UTILITY ATOMS
             ══════════════════════════════════════════════════════════ */}
          <div className="space-y-8 pt-6 border-t border-neutral-800">
            <div className="border-b border-neutral-800 pb-2">
              <Heading level="h3" className="flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-sm">04</span>
                <span>Identity, Status &amp; Utility Atoms</span>
              </Heading>
              <Text variant="caption" color="muted">
                Heartbeats, compliance tags, deterministic hash avatars, and copy actuators.
              </Text>
            </div>

            {/* StatusPill & KeyBadge */}
            <section id="atom-status-pill" className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-neutral-200">
                    &lt;StatusPill /&gt; &amp; &lt;KeyBadge /&gt;
                  </span>
                  <KeyBadge label="Status &amp; Entity" variant="emerald" size="xs" />
                </div>
              </div>

              <div className="p-6 rounded-lg bg-neutral-950 border border-neutral-850 flex flex-wrap items-center gap-4">
                <StatusPill label="Active Contract" variant="success" />
                <StatusPill label="Pending Review" variant="warning" />
                <StatusPill label="SLA Breached" variant="error" />
                <StatusPill label="Audit Frozen" variant="info" />

                <span className="text-neutral-700">|</span>

                <KeyBadge label="SOC2-TYPE-II" variant="emerald" />
                <KeyBadge label="VIP" variant="amber" />
                <KeyBadge label="ENV:PROD" variant="neutral" />
                <KeyBadge label="US-EAST-1" variant="outline" />
              </div>
            </section>

            {/* EntityAvatar */}
            <section id="atom-entity-avatar" className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-neutral-200">&lt;EntityAvatar /&gt;</span>
                  <KeyBadge label="Deterministic Hash Tinting" variant="emerald" size="xs" />
                </div>
              </div>

              <div className="p-6 rounded-lg bg-neutral-950 border border-neutral-850 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <EntityAvatar name={avatarName} size="lg" />
                  <div>
                    <div className="font-semibold text-sm text-neutral-200">{avatarName}</div>
                    <div className="text-[10px] font-mono text-neutral-500">Deterministic 2-letter fallback</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={avatarName}
                    onChange={(e) => setAvatarName(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-100 font-mono"
                    placeholder="Type client name..."
                  />
                </div>
              </div>
            </section>

            {/* CopyTrigger */}
            <section id="atom-copy-trigger" className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-neutral-200">&lt;CopyTrigger /&gt;</span>
                  <KeyBadge label="Ripple Burst &amp; Morph" variant="emerald" size="xs" />
                </div>
              </div>

              <div className="p-6 rounded-lg bg-neutral-950 border border-neutral-850 flex flex-wrap items-center gap-4">
                <CopyTrigger text="0x9482f7192a83c0" displayText="0x9482...3c0" />
                <CopyTrigger text="INV-2026-9041" displayText="INV-2026-9041" />
                <CopyTrigger text="npm i @zerorapid/zerolight" displayText="npm i @zerorapid/zerolight" />
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 px-6 py-4 text-center text-xs text-neutral-500 font-mono">
        ZeroLight Design Engine • Indivisible Atomic Model Laboratory • Principal Frontend Systems Architecture
      </footer>
    </div>
  );
}
