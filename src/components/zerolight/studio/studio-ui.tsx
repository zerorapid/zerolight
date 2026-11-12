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
    <section className="py-3.5 border-b border-white/[0.06] last:border-b-0 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-zinc-400">{title}</span>
        {badge && (
          <span
            className={`text-[11px] tabular-nums ${
              accentBadge ? "text-emerald-400/90" : "text-zinc-500"
            }`}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="space-y-2.5">{children}</div>
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
    <div className="py-3 border-b border-white/[0.06] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full py-0.5 flex items-center justify-between text-left group cursor-pointer"
        aria-expanded={open}
      >
        <span className="text-[11px] font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {summary && (
            <span className="text-[10px] text-zinc-500 tabular-nums">{summary}</span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-150 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>
      {open && <div className="pt-3 space-y-2.5">{children}</div>}
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
        <span className="text-zinc-300">{label}</span>
        <span className="text-[11px] text-zinc-400 tabular-nums">{valueLabel}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer accent-zinc-200"
      />
      {marks && marks.length > 0 && (
        <div className="flex justify-between text-[10px] text-zinc-500">
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
    <div className="flex items-center justify-between text-xs py-1">
      <span className="text-zinc-300">{label}</span>
      <label className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] cursor-pointer transition-colors">
        <span
          style={{ backgroundColor: value }}
          className="w-3.5 h-3.5 rounded-sm border border-white/20 shrink-0"
        />
        <span className="text-[11px] text-zinc-300 tabular-nums">
          {value.toUpperCase()}
        </span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
      </label>
    </div>
  );
}
