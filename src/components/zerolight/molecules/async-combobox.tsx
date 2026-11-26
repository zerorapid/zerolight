"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Check, ChevronDown, Loader2, X } from "lucide-react";
import { useZeroLight } from "../context";

export interface AsyncComboboxOption {
  value: string;
  label: string;
  description?: string;
}

export interface AsyncComboboxProps {
  value?: string;
  onChange?: (value: string, option?: AsyncComboboxOption) => void;
  options?: AsyncComboboxOption[];
  onSearch?: (query: string) => Promise<AsyncComboboxOption[]> | AsyncComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Remote-capable searchable entity selector (suppliers, customers, SKUs, users)
 * with loading, empty, and keyboard-friendly dropdown states.
 */
export function AsyncCombobox({
  value,
  onChange,
  options: staticOptions = [],
  onSearch,
  placeholder = "Select item...",
  searchPlaceholder = "Search...",
  emptyText = "No matching results",
  label,
  disabled = false,
  className = "",
}: AsyncComboboxProps) {
  const { tokens, scaled } = useZeroLight();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<AsyncComboboxOption[]>(staticOptions);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onSearch) {
      const q = query.trim().toLowerCase();
      setItems(
        q
          ? staticOptions.filter(
              (o) =>
                o.label.toLowerCase().includes(q) ||
                (o.description && o.description.toLowerCase().includes(q))
            )
          : staticOptions
      );
      return;
    }
    let active = true;
    setLoading(true);
    Promise.resolve(onSearch(query))
      .then((res) => {
        if (active) setItems(res);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [query, onSearch, staticOptions]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const selected = staticOptions.find((o) => o.value === value) || items.find((o) => o.value === value);

  return (
    <div ref={rootRef} className={`relative space-y-1.5 ${className}`} style={{ fontFamily: scaled.resolvedFontFamily }}>
      {label && (
        <label className="block text-xs font-semibold" style={{ color: tokens.textIconColor }}>
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        style={{
          backgroundColor: tokens.universalFillColor,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
          borderStyle: "solid",
          borderRadius: `${scaled.scaledRadius}px`,
          color: tokens.textIconColor,
        }}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium cursor-pointer disabled:opacity-50"
      >
        <span className={`truncate ${selected ? "" : "opacity-55"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />
      </button>

      {open && (
        <div
          style={{
            backgroundColor: tokens.universalFillColor,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
            borderStyle: "solid",
            borderRadius: `${scaled.scaledCardRadius}px`,
            boxShadow: scaled.cardShadow,
            color: tokens.textIconColor,
          }}
          className="absolute left-0 right-0 z-50 mt-1 overflow-hidden"
        >
          <div className="flex items-center gap-2 px-2.5 py-2 border-b" style={{ borderColor: tokens.universalBorderColor }}>
            <Search className="w-3.5 h-3.5 opacity-55 shrink-0" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-xs focus:outline-none"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="opacity-55 hover:opacity-100 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="max-h-56 overflow-y-auto p-1">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-4 text-xs opacity-65">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Searching...</span>
              </div>
            ) : items.length === 0 ? (
              <div className="py-4 text-center text-xs opacity-55">{emptyText}</div>
            ) : (
              items.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange?.(opt.value, opt);
                      setOpen(false);
                    }}
                    style={{
                      backgroundColor: isSelected ? tokens.hoverBackplateTint : "transparent",
                      borderRadius: `${Math.max(4, scaled.scaledOptionRadius)}px`,
                    }}
                    className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 text-left text-xs hover:opacity-90 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate">{opt.label}</div>
                      {opt.description && <div className="text-[10px] opacity-60 truncate">{opt.description}</div>}
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
