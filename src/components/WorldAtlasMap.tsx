"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  Plus,
  Minus,
  RotateCcw,
  Download,
  X,
  Layers,
  Activity,
  Check,
  ChevronDown,
  Globe,
  Radio,
} from "lucide-react";
import {
  REAL_WORLD_COUNTRIES,
  GLOBAL_LAND_PATH,
  CountryShape,
} from "@/components/zerolight/molecules/world-map-data";

export type MapRenderStyle = "vector" | "dots" | "pixels" | "crosses" | "diamonds" | "hatch";
export type PatternDensity = "fine" | "standard" | "bold";
export type MapProjection = "naturalEarth" | "mercator" | "equirectangular";
export type MapRegion = "all" | "americas" | "europe" | "asia" | "africa" | "oceania";

export interface WorldAtlasMapProps {
  className?: string;
  defaultStyle?: MapRenderStyle;
  defaultDensity?: PatternDensity;
  defaultScale?: number; // 0.4 to 0.95
  defaultProjection?: MapProjection;
  defaultRegion?: MapRegion;
  selectedCountryIds?: string[];
  onSelectCountry?: (countryId: string, multi: boolean) => void;
  showTelemetryMarkers?: boolean;
  showChoropleth?: boolean;
  interactive?: boolean;
}

// Major edge telemetry hubs for pulse visualization
const GLOBAL_EDGE_HUBS = [
  { id: "sfo", name: "San Francisco", x: 142, y: 135, ping: "12ms", load: "94%" },
  { id: "nyc", name: "New York", x: 228, y: 130, ping: "8ms", load: "98%" },
  { id: "lon", name: "London", x: 395, y: 92, ping: "6ms", load: "91%" },
  { id: "fra", name: "Frankfurt", x: 420, y: 95, ping: "5ms", load: "89%" },
  { id: "dxb", name: "Dubai", x: 495, y: 148, ping: "18ms", load: "76%" },
  { id: "blr", name: "Bengaluru", x: 546, y: 172, ping: "14ms", load: "88%" },
  { id: "sin", name: "Singapore", x: 590, y: 198, ping: "9ms", load: "82%" },
  { id: "tyo", name: "Tokyo", x: 672, y: 132, ping: "11ms", load: "95%" },
  { id: "syd", name: "Sydney", x: 698, y: 280, ping: "22ms", load: "67%" },
  { id: "sao", name: "São Paulo", x: 285, y: 252, ping: "19ms", load: "74%" },
];

// Region Viewport Matrix (x, y, width, height)
const REGION_BOUNDS: Record<MapRegion, { x: number; y: number; w: number; h: number }> = {
  all: { x: 0, y: 0, w: 800, h: 400 },
  americas: { x: 60, y: 40, w: 260, h: 300 },
  europe: { x: 340, y: 40, w: 180, h: 140 },
  asia: { x: 460, y: 40, w: 260, h: 220 },
  africa: { x: 360, y: 110, w: 190, h: 200 },
  oceania: { x: 580, y: 180, w: 200, h: 180 },
};

export const WorldAtlasMap: React.FC<WorldAtlasMapProps> = ({
  className = "",
  defaultStyle = "vector",
  defaultDensity = "standard",
  defaultScale = 0.75,
  defaultProjection = "naturalEarth",
  defaultRegion = "all",
  selectedCountryIds: externalSelectedIds,
  onSelectCountry,
  showTelemetryMarkers: initialTelemetry = true,
  showChoropleth: initialChoropleth = false,
  interactive = true,
}) => {
  // Render Config State
  const [style, setStyle] = useState<MapRenderStyle>(defaultStyle);
  const [density, setDensity] = useState<PatternDensity>(defaultDensity);
  const [scale, setScale] = useState<number>(defaultScale);
  const [borders, setBorders] = useState<boolean>(true);
  const [projection, setProjection] = useState<MapProjection>(defaultProjection);
  const [region, setRegion] = useState<MapRegion>(defaultRegion);

  // Overlay & Telemetry State
  const [showChoropleth, setShowChoropleth] = useState<boolean>(initialChoropleth);
  const [showTelemetry, setShowTelemetry] = useState<boolean>(initialTelemetry);

  // Interactive UI State
  const [internalSelected, setInternalSelected] = useState<string[]>(["US", "DE", "IN"]);
  const [hoveredCountryId, setHoveredCountryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);

  // Zoom and Pan State
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Effective selected country IDs
  const selectedIds = useMemo(() => {
    return externalSelectedIds !== undefined ? externalSelectedIds : internalSelected;
  }, [externalSelectedIds, internalSelected]);

  // Pattern Spacing & Dimensions based on Density
  const patternConfig = useMemo(() => {
    const spacingMap = { fine: 6, standard: 9, bold: 13 };
    const spacing = spacingMap[density];
    const elScale = Math.max(0.3, Math.min(0.95, scale));
    return {
      spacing,
      radius: (spacing / 2) * elScale * 0.72,
      rectSize: spacing * elScale * 0.78,
      crossSize: spacing * elScale * 0.75,
      strokeWidth: Math.max(0.8, spacing * 0.16 * elScale),
    };
  }, [density, scale]);

  // Keyboard shortcut listener ('/' to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsAdvancedOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filtered countries for search dropdown
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return REAL_WORLD_COUNTRIES.slice(0, 10);
    const q = searchQuery.toLowerCase();
    return REAL_WORLD_COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [searchQuery]);

  // Handle country selection
  const handleCountryClick = useCallback(
    (countryId: string, event?: React.MouseEvent) => {
      if (!interactive) return;
      const isMulti = event ? event.shiftKey || event.metaKey : false;

      if (onSelectCountry) {
        onSelectCountry(countryId, isMulti);
      } else {
        setInternalSelected((prev) => {
          if (isMulti) {
            return prev.includes(countryId)
              ? prev.filter((id) => id !== countryId)
              : [...prev, countryId];
          }
          return prev.includes(countryId) && prev.length === 1 ? [] : [countryId];
        });
      }
    },
    [interactive, onSelectCountry]
  );

  // Zoom In / Out / Reset
  const handleZoom = (direction: "in" | "out") => {
    setZoomLevel((prev) => {
      const next = direction === "in" ? prev * 1.35 : prev / 1.35;
      return Math.min(5, Math.max(0.8, Number(next.toFixed(2))));
    });
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setRegion("all");
  };

  // Region Focusing
  const handleSelectRegion = (r: MapRegion) => {
    setRegion(r);
    const bounds = REGION_BOUNDS[r];
    if (r === "all") {
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
    } else {
      const targetZoom = Math.min(3.2, 800 / bounds.w);
      const targetPanX = 400 - (bounds.x + bounds.w / 2) * targetZoom;
      const targetPanY = 200 - (bounds.y + bounds.h / 2) * targetZoom;
      setZoomLevel(Number(targetZoom.toFixed(2)));
      setPanOffset({ x: Number(targetPanX.toFixed(1)), y: Number(targetPanY.toFixed(1)) });
    }
  };

  // Pan interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Standalone SVG Snapshot Export
  const handleExportSVG = () => {
    if (!svgRef.current) return;
    const svgContent = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `zerolight-world-atlas-${style}-${new Date().toISOString().slice(0, 10)}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Focused / Inspector Country
  const activeInspectorCountry = useMemo(() => {
    if (hoveredCountryId) {
      return REAL_WORLD_COUNTRIES.find((c) => c.id === hoveredCountryId) || null;
    }
    if (selectedIds.length > 0) {
      return REAL_WORLD_COUNTRIES.find((c) => c.id === selectedIds[selectedIds.length - 1]) || null;
    }
    return null;
  }, [hoveredCountryId, selectedIds]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full select-none overflow-hidden rounded-2xl border border-zinc-200/80 bg-white font-sans text-zinc-900 shadow-sm transition-all duration-300 ${className}`}
      style={{ minHeight: "440px" }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* =========================================================================
          TOP FLOATING BAR (Search capsule + Style switcher + Advanced button)
         ========================================================================= */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between p-4 sm:p-5">
        {/* Top-Left: Search Capsule */}
        <div className="pointer-events-auto relative">
          <div
            onClick={() => {
              setIsSearchOpen(true);
              setTimeout(() => searchInputRef.current?.focus(), 50);
            }}
            className="flex cursor-pointer items-center gap-2.5 rounded-full border border-black/10 bg-white/85 px-4 py-2 text-sm text-zinc-600 shadow-lg backdrop-blur-xl transition hover:border-black/20 hover:bg-white"
          >
            <Search className="h-4 w-4 text-zinc-400" />
            <span className="font-medium">
              {activeInspectorCountry ? activeInspectorCountry.name : "Select country..."}
            </span>
            <kbd className="hidden rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] font-semibold text-zinc-400 sm:inline-block">
              /
            </kbd>
          </div>

          {/* Search Dropdown Modal */}
          {isSearchOpen && (
            <div className="absolute left-0 top-12 z-50 w-72 rounded-2xl border border-zinc-200/90 bg-white/95 p-2 shadow-2xl backdrop-blur-xl">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/80 py-2 pl-9 pr-8 text-xs font-medium text-zinc-800 outline-none focus:border-zinc-900 focus:bg-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto rounded-lg">
                {filteredCountries.map((country) => {
                  const isSelected = selectedIds.includes(country.id);
                  return (
                    <button
                      key={country.id}
                      onClick={() => {
                        handleCountryClick(country.id);
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition ${
                        isSelected
                          ? "bg-zinc-900 text-white font-medium"
                          : "text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{country.name}</span>
                        <span className={`text-[10px] ${isSelected ? "text-zinc-300" : "text-zinc-400"}`}>
                          ({country.id})
                        </span>
                      </div>
                      {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Top-Right: Style Segmented Pill + Advanced Button */}
        <div className="pointer-events-auto flex items-center gap-2.5">
          {/* Quick 3-Style Segmented Pill */}
          <div className="flex items-center rounded-full border border-black/10 bg-white/85 p-1 shadow-lg backdrop-blur-xl">
            {(["vector", "dots", "pixels"] as MapRenderStyle[]).map((s) => {
              const active = style === s;
              return (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold capitalize transition ${
                    active
                      ? "bg-zinc-950 text-white shadow-sm"
                      : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>

          {/* Advanced Studio Toggle Button */}
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={`flex items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-xl transition ${
              isAdvancedOpen
                ? "bg-zinc-950 text-white"
                : "bg-white/85 text-zinc-700 hover:bg-white hover:text-zinc-950"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Advanced</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          ADVANCED STUDIO DRAWER (Collapsible right panel)
         ========================================================================= */}
      {isAdvancedOpen && (
        <div className="absolute right-4 top-16 z-40 w-80 rounded-2xl border border-zinc-200/90 bg-white/95 p-4 shadow-2xl backdrop-blur-xl transition-all">
          <div className="mb-3 flex items-center justify-between border-b border-zinc-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-zinc-900" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                Map Studio Settings
              </h4>
            </div>
            <button
              onClick={() => setIsAdvancedOpen(false)}
              className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* 6 Render Styles Grid */}
            <div>
              <label className="mb-1.5 block font-semibold text-zinc-700">Render Style</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["vector", "dots", "pixels", "crosses", "diamonds", "hatch"] as MapRenderStyle[]).map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`rounded-lg py-1.5 text-[11px] font-medium capitalize transition ${
                        style === s
                          ? "bg-zinc-950 text-white font-semibold"
                          : "border border-zinc-200 bg-zinc-50/60 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      {s}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Pattern Density */}
            {style !== "vector" && (
              <div>
                <label className="mb-1.5 block font-semibold text-zinc-700">Pattern Density</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["fine", "standard", "bold"] as PatternDensity[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDensity(d)}
                      className={`rounded-lg py-1 text-[11px] font-medium capitalize transition ${
                        density === d
                          ? "bg-zinc-950 text-white font-semibold"
                          : "border border-zinc-200 bg-zinc-50/60 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Element Scale Slider */}
            {style !== "vector" && (
              <div>
                <div className="mb-1 flex justify-between font-semibold text-zinc-700">
                  <span>Element Scale</span>
                  <span className="font-sans tabular-nums text-zinc-500">{Math.round(scale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="0.95"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-zinc-950"
                />
              </div>
            )}

            {/* Region Presets */}
            <div>
              <label className="mb-1.5 block font-semibold text-zinc-700">Focus Region</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["all", "americas", "europe", "asia", "africa", "oceania"] as MapRegion[]).map(
                  (r) => (
                    <button
                      key={r}
                      onClick={() => handleSelectRegion(r)}
                      className={`rounded-lg py-1 text-[11px] font-medium capitalize transition ${
                        region === r
                          ? "bg-zinc-950 text-white font-semibold"
                          : "border border-zinc-200 bg-zinc-50/60 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      {r}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Toggles: Hairline borders, Choropleth, Hub Telemetry */}
            <div className="space-y-2 pt-1 border-t border-zinc-100">
              <label className="flex cursor-pointer items-center justify-between text-zinc-700">
                <span className="font-medium">Country Hairline Borders</span>
                <input
                  type="checkbox"
                  checked={borders}
                  onChange={(e) => setBorders(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 accent-zinc-950"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between text-zinc-700">
                <span className="font-medium">Choropleth Telemetry</span>
                <input
                  type="checkbox"
                  checked={showChoropleth}
                  onChange={(e) => setShowChoropleth(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 accent-zinc-950"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between text-zinc-700">
                <span className="font-medium">Pulse Edge Hub Markers</span>
                <input
                  type="checkbox"
                  checked={showTelemetry}
                  onChange={(e) => setShowTelemetry(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 accent-zinc-950"
                />
              </label>
            </div>

            {/* SVG Export Action */}
            <div className="pt-2">
              <button
                onClick={handleExportSVG}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-zinc-950 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Standalone SVG</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MAIN SVG 2D FLAT CANVASES (Hardware-accelerated pattern matrices)
         ========================================================================= */}
      <div
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 800 400"
          className="h-full w-full transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: "center center",
          }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* SVG PATTERN DEFINITIONS */}
          <defs>
            {/* 1. DOTS PATTERN */}
            <pattern
              id="zl-dots-default"
              width={patternConfig.spacing}
              height={patternConfig.spacing}
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx={patternConfig.spacing / 2}
                cy={patternConfig.spacing / 2}
                r={patternConfig.radius}
                fill="#D4D4D8"
              />
            </pattern>
            <pattern
              id="zl-dots-hover"
              width={patternConfig.spacing}
              height={patternConfig.spacing}
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx={patternConfig.spacing / 2}
                cy={patternConfig.spacing / 2}
                r={patternConfig.radius * 1.15}
                fill="#18181B"
              />
            </pattern>
            <pattern
              id="zl-dots-selected"
              width={patternConfig.spacing}
              height={patternConfig.spacing}
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx={patternConfig.spacing / 2}
                cy={patternConfig.spacing / 2}
                r={patternConfig.radius * 1.25}
                fill="#09090B"
              />
            </pattern>

            {/* 2. PIXELS PATTERN */}
            <pattern
              id="zl-pixels-default"
              width={patternConfig.spacing}
              height={patternConfig.spacing}
              patternUnits="userSpaceOnUse"
            >
              <rect
                x={(patternConfig.spacing - patternConfig.rectSize) / 2}
                y={(patternConfig.spacing - patternConfig.rectSize) / 2}
                width={patternConfig.rectSize}
                height={patternConfig.rectSize}
                rx={1}
                fill="#D4D4D8"
              />
            </pattern>
            <pattern
              id="zl-pixels-hover"
              width={patternConfig.spacing}
              height={patternConfig.spacing}
              patternUnits="userSpaceOnUse"
            >
              <rect
                x={(patternConfig.spacing - patternConfig.rectSize) / 2}
                y={(patternConfig.spacing - patternConfig.rectSize) / 2}
                width={patternConfig.rectSize}
                height={patternConfig.rectSize}
                rx={1}
                fill="#18181B"
              />
            </pattern>
            <pattern
              id="zl-pixels-selected"
              width={patternConfig.spacing}
              height={patternConfig.spacing}
              patternUnits="userSpaceOnUse"
            >
              <rect
                x={(patternConfig.spacing - patternConfig.rectSize) / 2}
                y={(patternConfig.spacing - patternConfig.rectSize) / 2}
                width={patternConfig.rectSize}
                height={patternConfig.rectSize}
                rx={1}
                fill="#09090B"
              />
            </pattern>

            {/* 3. CROSSES PATTERN */}
            <pattern
              id="zl-crosses-default"
              width={patternConfig.spacing}
              height={patternConfig.spacing}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M${patternConfig.spacing / 2},${(patternConfig.spacing - patternConfig.crossSize) / 2} V${(patternConfig.spacing + patternConfig.crossSize) / 2} M${(patternConfig.spacing - patternConfig.crossSize) / 2},${patternConfig.spacing / 2} H${(patternConfig.spacing + patternConfig.crossSize) / 2}`}
                stroke="#D4D4D8"
                strokeWidth={patternConfig.strokeWidth}
                strokeLinecap="round"
              />
            </pattern>
            <pattern
              id="zl-crosses-hover"
              width={patternConfig.spacing}
              height={patternConfig.spacing}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M${patternConfig.spacing / 2},${(patternConfig.spacing - patternConfig.crossSize) / 2} V${(patternConfig.spacing + patternConfig.crossSize) / 2} M${(patternConfig.spacing - patternConfig.crossSize) / 2},${patternConfig.spacing / 2} H${(patternConfig.spacing + patternConfig.crossSize) / 2}`}
                stroke="#18181B"
                strokeWidth={patternConfig.strokeWidth * 1.25}
                strokeLinecap="round"
              />
            </pattern>
            <pattern
              id="zl-crosses-selected"
              width={patternConfig.spacing}
              height={patternConfig.spacing}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M${patternConfig.spacing / 2},${(patternConfig.spacing - patternConfig.crossSize) / 2} V${(patternConfig.spacing + patternConfig.crossSize) / 2} M${(patternConfig.spacing - patternConfig.crossSize) / 2},${patternConfig.spacing / 2} H${(patternConfig.spacing + patternConfig.crossSize) / 2}`}
                stroke="#09090B"
                strokeWidth={patternConfig.strokeWidth * 1.4}
                strokeLinecap="round"
              />
            </pattern>

            {/* 4. DIAMONDS PATTERN */}
            <pattern
              id="zl-diamonds-default"
              width={patternConfig.spacing}
              height={patternConfig.spacing}
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points={`${patternConfig.spacing / 2},${patternConfig.spacing * 0.15} ${patternConfig.spacing * 0.85},${patternConfig.spacing / 2} ${patternConfig.spacing / 2},${patternConfig.spacing * 0.85} ${patternConfig.spacing * 0.15},${patternConfig.spacing / 2}`}
                fill="#D4D4D8"
              />
            </pattern>
            <pattern
              id="zl-diamonds-hover"
              width={patternConfig.spacing}
              height={patternConfig.spacing}
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points={`${patternConfig.spacing / 2},${patternConfig.spacing * 0.15} ${patternConfig.spacing * 0.85},${patternConfig.spacing / 2} ${patternConfig.spacing / 2},${patternConfig.spacing * 0.85} ${patternConfig.spacing * 0.15},${patternConfig.spacing / 2}`}
                fill="#18181B"
              />
            </pattern>
            <pattern
              id="zl-diamonds-selected"
              width={patternConfig.spacing}
              height={patternConfig.spacing}
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points={`${patternConfig.spacing / 2},${patternConfig.spacing * 0.15} ${patternConfig.spacing * 0.85},${patternConfig.spacing / 2} ${patternConfig.spacing / 2},${patternConfig.spacing * 0.85} ${patternConfig.spacing * 0.15},${patternConfig.spacing / 2}`}
                fill="#09090B"
              />
            </pattern>

            {/* 5. HATCH PATTERN (45-degree diagonal lines) */}
            <pattern
              id="zl-hatch-default"
              width={patternConfig.spacing}
              height={patternConfig.spacing}
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2={patternConfig.spacing}
                stroke="#D4D4D8"
                strokeWidth={patternConfig.strokeWidth}
              />
            </pattern>
            <pattern
              id="zl-hatch-hover"
              width={patternConfig.spacing}
              height={patternConfig.spacing}
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2={patternConfig.spacing}
                stroke="#18181B"
                strokeWidth={patternConfig.strokeWidth * 1.25}
              />
            </pattern>
            <pattern
              id="zl-hatch-selected"
              width={patternConfig.spacing}
              height={patternConfig.spacing}
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2={patternConfig.spacing}
                stroke="#09090B"
                strokeWidth={patternConfig.strokeWidth * 1.5}
              />
            </pattern>
          </defs>

          {/* BACKGROUND LAND SILHOUETTE (Subtle baseline underlay) */}
          <path d={GLOBAL_LAND_PATH} fill="#F4F4F5" />

          {/* 163 SOVEREIGN COUNTRY POLYGONS */}
          <g id="world-atlas-countries">
            {REAL_WORLD_COUNTRIES.map((country) => {
              const isSelected = selectedIds.includes(country.id);
              const isHovered = hoveredCountryId === country.id;

              // Determine fill based on style and selection
              let fillColor = "#E4E4E7";

              if (style === "vector") {
                if (isSelected) {
                  fillColor = "#09090B";
                } else if (isHovered) {
                  fillColor = "#18181B";
                } else if (showChoropleth) {
                  // Simulated telemetry quantile steps
                  const charCode = country.id.charCodeAt(0) + country.id.charCodeAt(1);
                  const step = charCode % 4;
                  fillColor =
                    step === 0 ? "#E4E4E7" : step === 1 ? "#D4D4D8" : step === 2 ? "#71717A" : "#27272A";
                } else {
                  fillColor = "#E4E4E7";
                }
              } else {
                // Pattern Fill ID
                const state = isSelected ? "selected" : isHovered ? "hover" : "default";
                fillColor = `url(#zl-${style}-${state})`;
              }

              return (
                <path
                  key={country.id}
                  id={`country-${country.id}`}
                  d={country.d}
                  fill={fillColor}
                  stroke={borders ? "#FFFFFF" : "none"}
                  strokeWidth={borders ? 0.6 : 0}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={(e) => handleCountryClick(country.id, e)}
                  onMouseEnter={() => setHoveredCountryId(country.id)}
                  onMouseLeave={() => setHoveredCountryId(null)}
                >
                  <title>{`${country.name} (${country.id})`}</title>
                </path>
              );
            })}
          </g>

          {/* TELEMETRY EDGE HUB PULSE MARKERS */}
          {showTelemetry && (
            <g id="edge-hub-markers" className="pointer-events-none">
              {GLOBAL_EDGE_HUBS.map((hub) => (
                <g key={hub.id} transform={`translate(${hub.x}, ${hub.y})`}>
                  {/* Subtle Expanding Radar Ring */}
                  <circle
                    r="6"
                    fill="none"
                    stroke="#09090B"
                    strokeWidth="0.75"
                    opacity="0.4"
                    className="animate-ping"
                  />
                  {/* Outer ring */}
                  <circle r="3.5" fill="#FFFFFF" stroke="#09090B" strokeWidth="1" />
                  {/* Core black dot */}
                  <circle r="1.75" fill="#09090B" />
                </g>
              ))}
            </g>
          )}
        </svg>
      </div>

      {/* =========================================================================
          BOTTOM-RIGHT VERTICAL ZOOM PILL [ + | - | ↺ ]
         ========================================================================= */}
      <div className="absolute bottom-5 right-5 z-30 flex flex-col items-center overflow-hidden rounded-full border border-black/10 bg-white/85 shadow-lg backdrop-blur-xl">
        <button
          onClick={() => handleZoom("in")}
          title="Zoom In"
          className="flex h-9 w-9 items-center justify-center text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 active:bg-zinc-200"
        >
          <Plus className="h-4 w-4" />
        </button>
        <div className="h-[1px] w-5 bg-zinc-200" />
        <button
          onClick={() => handleZoom("out")}
          title="Zoom Out"
          className="flex h-9 w-9 items-center justify-center text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 active:bg-zinc-200"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="h-[1px] w-5 bg-zinc-200" />
        <button
          onClick={handleReset}
          title="Reset Map View"
          className="flex h-9 w-9 items-center justify-center text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 active:bg-zinc-200"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* =========================================================================
          BOTTOM-LEFT SELECTED COUNTRIES PILL BAR & INSPECTOR
         ========================================================================= */}
      <div className="pointer-events-none absolute bottom-5 left-5 z-30 flex flex-wrap items-center gap-2">
        {selectedIds.length > 0 && (
          <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 rounded-full border border-black/10 bg-white/85 p-1.5 shadow-lg backdrop-blur-xl">
            <span className="px-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Active ({selectedIds.length})
            </span>
            {selectedIds.map((id) => {
              const country = REAL_WORLD_COUNTRIES.find((c) => c.id === id);
              return (
                <div
                  key={id}
                  className="flex items-center gap-1 rounded-full bg-zinc-950 px-2.5 py-1 text-xs font-semibold text-white shadow-sm"
                >
                  <span>{country?.name || id}</span>
                  <button
                    onClick={() => handleCountryClick(id)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-zinc-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
            <button
              onClick={() => {
                if (onSelectCountry) {
                  selectedIds.forEach((id) => onSelectCountry(id, true));
                } else {
                  setInternalSelected([]);
                }
              }}
              className="rounded-full px-2 py-1 text-[11px] font-semibold text-zinc-500 hover:text-zinc-900"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Hover / Active Inspector Capsule */}
        {activeInspectorCountry && (
          <div className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-black/10 bg-white/85 px-3.5 py-1.5 shadow-lg backdrop-blur-xl">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-zinc-900">{activeInspectorCountry.name}</span>
              <span className="font-sans text-[10px] text-zinc-400">({activeInspectorCountry.id})</span>
              <span className="text-zinc-300">·</span>
              <span className="font-sans tabular-nums text-[11px] text-zinc-600">
                {Math.round(18 + (activeInspectorCountry.id.charCodeAt(0) % 25))}ms edge latency
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldAtlasMap;
