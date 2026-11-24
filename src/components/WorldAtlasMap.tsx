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
import { useZeroLight } from "@/components/zerolight/context";
import { Button } from "@/components/zerolight/atoms/button";
import { IconButton } from "@/components/zerolight/atoms/icon-button";
import { Input } from "@/components/zerolight/atoms/input";
import { Switch } from "@/components/zerolight/atoms/switch";
import { Slider } from "@/components/zerolight/atoms/slider";
import { TagChip } from "@/components/zerolight/atoms/tag-chip";
import { Badge } from "@/components/zerolight/atoms/badge";
import { Card } from "@/components/zerolight/atoms/card";
import { Kbd } from "@/components/zerolight/atoms/kbd";
import { SegmentedControl } from "@/components/zerolight/molecules/segmented-control";

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
  const { tokens, scaled } = useZeroLight();
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
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((document.activeElement as HTMLElement)?.tagName || "")) {
        e.preventDefault();
        setIsSearchOpen(true);
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
      className={`relative w-full select-none overflow-hidden border font-sans transition-all duration-300 ${className}`}
      style={{
        minHeight: "440px",
        borderRadius: `${scaled.scaledCardRadius}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: tokens.universalFillColor,
        color: tokens.textIconColor,
        boxShadow: scaled.cardShadow,
      }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* =========================================================================
          TOP FLOATING BAR (Search capsule + Style switcher + Advanced button)
         ========================================================================= */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 p-3 sm:p-5">
        {/* Top-Left: Search Capsule */}
        <div className="pointer-events-auto relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            iconLeft={<Search className="h-3.5 w-3.5 shrink-0" />}
            style={{ borderRadius: `${scaled.scaledPillRadius}px` }}
          >
            <span className="font-medium truncate max-w-[110px] sm:max-w-none">
              {activeInspectorCountry ? activeInspectorCountry.name : "Select country..."}
            </span>
            <Kbd className="hidden sm:inline-flex">/</Kbd>
          </Button>

          {/* Search Dropdown Modal */}
          {isSearchOpen && (
            <Card variant="elevated" padding="none" className="absolute left-0 top-11 z-50 w-72 p-2">
              <div className="mb-2">
                <Input
                  autoFocus
                  type="text"
                  placeholder="Search countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  iconLeft={<Search className="h-4 w-4" />}
                  iconRight={
                    searchQuery ? (
                      <IconButton
                        icon={<X className="h-3.5 w-3.5" />}
                        ariaLabel="Clear country search"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                      />
                    ) : undefined
                  }
                />
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1">
                {filteredCountries.map((country) => {
                  const isSelected = selectedIds.includes(country.id);
                  return (
                    <Button
                      key={country.id}
                      variant={isSelected ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => {
                        handleCountryClick(country.id);
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="w-full justify-between"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span className="font-semibold truncate">{country.name}</span>
                        <span className="text-[10px] opacity-65">({country.id})</span>
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                    </Button>
                  );
                })}
              </div>
            </Card>
          )}
        </div>

        {/* Top-Right: Style Segmented Pill + Advanced Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          <SegmentedControl<"vector" | "dots" | "pixels">
            value={style === "dots" || style === "pixels" ? style : "vector"}
            onChange={(s) => setStyle(s)}
            options={[
              { key: "vector", label: "Vector" },
              { key: "dots", label: "Dots" },
              { key: "pixels", label: "Pixels" },
            ]}
          />

          <Button
            variant={isAdvancedOpen ? "primary" : "outline"}
            size="sm"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            iconLeft={<SlidersHorizontal className="h-3.5 w-3.5" />}
          >
            Advanced
          </Button>
        </div>
      </div>

      {/* =========================================================================
          ADVANCED STUDIO DRAWER (Collapsible right panel)
         ========================================================================= */}
      {isAdvancedOpen && (
        <Card variant="elevated" padding="md" className="absolute right-4 top-16 z-40 w-80">
          <div
            className="mb-3 flex items-center justify-between border-b pb-2.5"
            style={{ borderColor: tokens.universalBorderColor }}
          >
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4" style={{ color: tokens.textIconColor }} />
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: tokens.textIconColor }}>
                Map Studio Settings
              </h4>
            </div>
            <IconButton
              icon={<X className="h-3.5 w-3.5" />}
              ariaLabel="Close map studio settings"
              size="sm"
              onClick={() => setIsAdvancedOpen(false)}
            />
          </div>

          <div className="space-y-4 text-xs">
            {/* 6 Render Styles Grid */}
            <div>
              <label className="mb-1.5 block font-semibold" style={{ color: tokens.textIconColor }}>
                Render Style
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["vector", "dots", "pixels", "crosses", "diamonds", "hatch"] as MapRenderStyle[]).map(
                  (s) => (
                    <Button
                      key={s}
                      variant={style === s ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setStyle(s)}
                      className="capitalize w-full justify-center"
                    >
                      {s}
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* Pattern Density */}
            {style !== "vector" && (
              <div>
                <label className="mb-1.5 block font-semibold" style={{ color: tokens.textIconColor }}>
                  Pattern Density
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["fine", "standard", "bold"] as PatternDensity[]).map((d) => (
                    <Button
                      key={d}
                      variant={density === d ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setDensity(d)}
                      className="capitalize w-full justify-center"
                    >
                      {d}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Element Scale Slider */}
            {style !== "vector" && (
              <Slider
                label="Element Scale"
                min={40}
                max={95}
                step={5}
                value={Math.round(scale * 100)}
                onChange={(pct) => setScale(pct / 100)}
              />
            )}

            {/* Region Presets */}
            <div>
              <label className="mb-1.5 block font-semibold" style={{ color: tokens.textIconColor }}>
                Focus Region
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["all", "americas", "europe", "asia", "africa", "oceania"] as MapRegion[]).map(
                  (r) => (
                    <Button
                      key={r}
                      variant={region === r ? "primary" : "outline"}
                      size="sm"
                      onClick={() => handleSelectRegion(r)}
                      className="capitalize w-full justify-center"
                    >
                      {r}
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* Toggles: Hairline borders, Choropleth, Hub Telemetry */}
            <div className="space-y-2.5 pt-2 border-t flex flex-col" style={{ borderColor: tokens.universalBorderColor }}>
              <Switch
                label="Country Hairline Borders"
                checked={borders}
                onChange={setBorders}
              />
              <Switch
                label="Choropleth Telemetry"
                checked={showChoropleth}
                onChange={setShowChoropleth}
              />
              <Switch
                label="Pulse Edge Hub Markers"
                checked={showTelemetry}
                onChange={setShowTelemetry}
              />
            </div>

            {/* SVG Export Action */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={handleExportSVG}
                iconLeft={<Download className="h-3.5 w-3.5" />}
                className="w-full justify-center"
              >
                Export Standalone SVG
              </Button>
            </div>
          </div>
        </Card>
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

          {/* SOFT ATMOSPHERIC BACKGROUND BASELINE (Apple/Airbnb Calm #F4F4F5) */}
          <rect width="800" height="400" fill="#F4F4F5" opacity="0.3" rx="12" />

          {/* 160 SOVEREIGN COUNTRY POLYGONS (Zero horizontal streaks or antimeridian line jumps) */}
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
                  stroke={isSelected ? "#09090B" : isHovered ? "#18181B" : borders ? "#CBD5E1" : "none"}
                  strokeWidth={borders ? 0.65 : 0}
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
      <Card
        variant="elevated"
        padding="none"
        className="absolute bottom-5 right-5 z-30 flex flex-col items-center p-1 gap-0.5"
        style={{ borderRadius: `${scaled.scaledPillRadius}px` }}
      >
        <IconButton
          icon={<Plus className="h-4 w-4" />}
          ariaLabel="Zoom In"
          size="sm"
          onClick={() => handleZoom("in")}
        />
        <IconButton
          icon={<Minus className="h-4 w-4" />}
          ariaLabel="Zoom Out"
          size="sm"
          onClick={() => handleZoom("out")}
        />
        <IconButton
          icon={<RotateCcw className="h-3.5 w-3.5" />}
          ariaLabel="Reset Map View"
          size="sm"
          onClick={handleReset}
        />
      </Card>

      {/* =========================================================================
          BOTTOM-LEFT SELECTED COUNTRIES PILL BAR & INSPECTOR
         ========================================================================= */}
      <div className="pointer-events-none absolute bottom-5 left-5 z-30 flex flex-wrap items-center gap-2">
        {selectedIds.length > 0 && (
          <Card
            variant="elevated"
            padding="none"
            className="pointer-events-auto flex flex-wrap items-center gap-1.5 px-2.5 py-1.5"
            style={{ borderRadius: `${scaled.scaledPillRadius}px` }}
          >
            <span className="px-1 text-[11px] font-bold uppercase tracking-wider opacity-65" style={{ color: tokens.textIconColor }}>
              Active ({selectedIds.length})
            </span>
            {selectedIds.map((id) => {
              const country = REAL_WORLD_COUNTRIES.find((c) => c.id === id);
              return (
                <TagChip
                  key={id}
                  label={country?.name || id}
                  onRemove={() => handleCountryClick(id)}
                />
              );
            })}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (onSelectCountry) {
                  selectedIds.forEach((id) => onSelectCountry(id, true));
                } else {
                  setInternalSelected([]);
                }
              }}
            >
              Clear all
            </Button>
          </Card>
        )}

        {/* Hover / Active Inspector Capsule */}
        {activeInspectorCountry && (
          <Badge variant="healthy" size="sm" className="pointer-events-auto">
            <span className="font-bold">{activeInspectorCountry.name}</span>
            <span className="opacity-65 font-sans">({activeInspectorCountry.id})</span>
            <span className="opacity-45">·</span>
            <span className="font-sans tabular-nums">
              {Math.round(18 + (activeInspectorCountry.id.charCodeAt(0) % 25))}ms edge latency
            </span>
          </Badge>
        )}
      </div>
    </div>
  );
};

export default WorldAtlasMap;
