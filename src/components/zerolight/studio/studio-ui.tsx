"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function StudioSectionCard({
  title,
  badge,
  accentBadge = false,
  children,
}: {
  title: string;
  badge?: string;
  accentBadge?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl bg-[#18181B]/95 border border-[#27272A] p-3.5 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[#27272A]/80">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          {title}
        </span>
        {badge && (
          <span
            className={`text-[10px] font-medium tabular-nums px-1.5 py-0.5 rounded bg-[#27272A]/80 ${
              accentBadge ? "text-emerald-400" : "text-neutral-400"
            }`}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function StudioAccordion({
  title,
  summary,
  defaultOpen = false,
  children,
}: {
  title: string;
  summary?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl bg-[#18181B]/60 border border-[#27272A] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-[#222226] transition-colors cursor-pointer"
        aria-expanded={open}
      >
        <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {summary && (
            <span className="text-[10px] text-neutral-500 tabular-nums">{summary}</span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-150 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>
      {open && (
        <div className="p-3.5 pt-2.5 border-t border-[#27272A]/80 space-y-3">{children}</div>
      )}
    </div>
  );
}

export function StudioSliderRow({
  label,
  valueLabel,
  min,
  max,
  step,
  value,
  onChange,
  marks,
}: {
  label: string;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
  marks?: string[];
}) {
  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="text-neutral-300 font-medium">{label}</span>
        <span className="text-[11px] font-medium text-white bg-[#27272A] border border-[#3F3F46] px-1.5 py-0.5 rounded tabular-nums">
          {valueLabel}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer accent-white"
      />
      {marks && marks.length > 0 && (
        <div className="flex justify-between text-[10px] text-neutral-500">
          {marks.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export function StudioColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  return (
    <div className="flex items-center justify-between text-xs py-0.5">
      <span className="text-neutral-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-neutral-400 font-medium tabular-nums">
          {value.toUpperCase()}
        </span>
        <label className="relative cursor-pointer">
          <span
            style={{ backgroundColor: value }}
            className="w-5 h-5 rounded-md border border-white/25 shadow-sm block transition-transform hover:scale-105"
          />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
}
