"use client";

import React, { useMemo, useState, useRef } from "react";
import { Plus, Minus, RotateCcw, Globe2, Activity } from "lucide-react";
import { useZeroLight } from "../context";
import { GLOBAL_LAND_PATH, REAL_WORLD_COUNTRIES, CountryShape } from "./world-map-data";

export type { CountryShape };
export const WORLD_COUNTRIES: CountryShape[] = REAL_WORLD_COUNTRIES;

export type WorldMapRegionPreset =
  | "world"
  | "north-america"
  | "europe"
  | "asia"
  | "latam"
  | "mea"
  | "oceania";

export interface WorldMapRegionDatum {
  /** ISO-2 country code (e.g. "US", "GB", "DE", "IN", "JP", "SG", "AU", "BR") */
  id: string;
  label?: string;
  value: number;
  formattedValue?: string;
  delta?: string;
}

export interface WorldMapMarker {
  id: string;
  label: string;
  /** SVG coordinates in 800x400 equirectangular space or ISO-2 country code */
  countryId?: string;
  x?: number;
  y?: number;
  value?: string;
  status?: "active" | "warning" | "idle";
}

export interface WorldMapArc {
  from: string;
  to: string;
  label?: string;
}

export interface WorldMapProps {
  data?: WorldMapRegionDatum[];
  markers?: WorldMapMarker[];
  arcs?: WorldMapArc[];
  defaultRegion?: WorldMapRegionPreset;
  selectedRegionId?: string | null;
  onSelectRegion?: (regionId: string, datum?: WorldMapRegionDatum) => void;
  showControls?: boolean;
  showLegend?: boolean;
  height?: number;
  className?: string;
}

export const REGION_VIEWBOXES: Record<
  WorldMapRegionPreset,
  { x: number; y: number; w: number; h: number; label: string }
> = {
  world: { x: 0, y: 0, w: 800, h: 400, label: "Global" },
  "north-america": { x: 25, y: 15, w: 290, h: 195, label: "N. America" },
  europe: { x: 340, y: 20, w: 160, h: 130, label: "Europe" },
  asia: { x: 470, y: 25, w: 270, h: 220, label: "APAC" },
  latam: { x: 155, y: 165, w: 185, h: 220, label: "LATAM" },
  mea: { x: 340, y: 110, w: 200, h: 210, label: "MEA" },
  oceania: { x: 580, y: 220, w: 210, h: 160, label: "Oceania" },
};

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return `rgba(16, 185, 129, ${alpha})`;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function WorldMap({
  data = [],
  markers = [],
  arcs = [],
  defaultRegion = "world",
  selectedRegionId = null,
  onSelectRegion,
  showControls = true,
  showLegend = true,
  height = 300,
  className = "",
}: WorldMapProps) {
  const { tokens, scaled } = useZeroLight();
  const [region, setRegion] = useState<WorldMapRegionPreset>(defaultRegion);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const primaryColor = scaled.chartPrimaryColor || tokens.primaryButtonColor || "#10B981";
  const secondaryColor = scaled.chartSecondaryColor || "#8B5CF6";
  const borderColor = tokens.universalBorderColor || "#E4E4E7";
  const surfaceColor = tokens.universalFillColor || "#FFFFFF";
  const textColor = tokens.textIconColor || "#18181B";

  const isDark = scaled.isDarkSurface;
  const mutedLandFill = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.06)";
  const landStrokeColor = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(15, 23, 42, 0.12)";
  const hoverLandFill = hexToRgba(primaryColor, 0.35);

  const datumMap = useMemo(() => {
    const map = new Map<string, WorldMapRegionDatum>();
    for (const item of data) {
      map.set(item.id.toUpperCase(), item);
    }
    return map;
  }, [data]);

  const maxValue = useMemo(() => {
    let m = 0;
    for (const item of data) {
      if (item.value > m) m = item.value;
    }
    return m || 1;
  }, [data]);

  const countryById = useMemo(() => {
    const map = new Map<string, CountryShape>();
    for (const c of WORLD_COUNTRIES) {
      map.set(c.id, c);
    }
    return map;
  }, []);

  const viewBox = useMemo(() => {
    const base = REGION_VIEWBOXES[region];
    const w = base.w / zoomLevel;
    const h = base.h / zoomLevel;
    const x = base.x + (base.w - w) / 2;
    const y = base.y + (base.h - h) / 2;
    return `${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`;
  }, [region, zoomLevel]);

  const hoveredCountry = hoveredId ? countryById.get(hoveredId) : undefined;
  const hoveredDatum = hoveredId ? datumMap.get(hoveredId) : undefined;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setHoveredId(null);
        setMousePos(null);
      }}
      data-testid="zerolight-world-map"
      style={{
        backgroundColor: surfaceColor,
        borderColor,
        borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
        borderStyle: "solid",
        borderRadius: `${scaled.scaledCardRadius}px`,
        boxShadow: scaled.cardShadow,
        color: textColor,
        fontFamily: scaled.resolvedFontFamily,
      }}
      className={`relative overflow-hidden transition-colors select-none ${className}`}
    >
      {/* Top Toolbar: Region Presets + Zoom Controls */}
      {showControls && (
        <div
          style={{ borderBottom: `1px solid ${borderColor}` }}
          className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-black/[0.015] dark:bg-white/[0.015]"
        >
          <div className="flex items-center gap-1 flex-wrap">
            <Globe2 size={14} style={{ color: primaryColor }} className="mr-1 opacity-80 shrink-0" />
            {(
              [
                "world",
                "north-america",
                "europe",
                "asia",
                "latam",
                "mea",
                "oceania",
              ] as WorldMapRegionPreset[]
            ).map((preset) => {
              const active = region === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  data-testid={`world-map-region-${preset}`}
                  onClick={() => {
                    setRegion(preset);
                    setZoomLevel(1);
                  }}
                  style={{
                    borderRadius: `${Math.max(4, scaled.scaledOptionRadius)}px`,
                    backgroundColor: active ? hexToRgba(primaryColor, 0.14) : "transparent",
                    color: active ? primaryColor : textColor,
                    opacity: active ? 1 : 0.68,
                  }}
                  className="px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  {REGION_VIEWBOXES[preset].label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => setZoomLevel((z) => Math.max(1, Number((z - 0.35).toFixed(2))))}
              style={{
                borderColor,
                borderRadius: `${Math.max(4, scaled.scaledOptionRadius)}px`,
              }}
              className="p-1 border opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Minus size={12} />
            </button>
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => setZoomLevel((z) => Math.min(2.4, Number((z + 0.35).toFixed(2))))}
              style={{
                borderColor,
                borderRadius: `${Math.max(4, scaled.scaledOptionRadius)}px`,
              }}
              className="p-1 border opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Plus size={12} />
            </button>
            <button
              type="button"
              aria-label="Reset map view"
              onClick={() => {
                setRegion(defaultRegion);
                setZoomLevel(1);
              }}
              style={{
                borderColor,
                borderRadius: `${Math.max(4, scaled.scaledOptionRadius)}px`,
              }}
              className="p-1 border opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Interactive SVG Canvas */}
      <div className="relative w-full" style={{ height }}>
        <svg
          viewBox={viewBox}
          className="w-full h-full"
          role="img"
          aria-label="Natural Earth interactive telemetry map"
        >
          <defs>
            <linearGradient id="zl-telemetry-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={0.8} />
              <stop offset="100%" stopColor={secondaryColor} stopOpacity={0.9} />
            </linearGradient>
          </defs>

          {/* Precision Lat/Long Graticule Grid */}
          <g stroke={borderColor} strokeOpacity={0.35} strokeWidth={0.5} strokeDasharray="3 3">
            <line x1="0" y1="80" x2="800" y2="80" />
            <line x1="0" y1="160" x2="800" y2="160" />
            <line x1="0" y1="240" x2="800" y2="240" />
            <line x1="0" y1="320" x2="800" y2="320" />
            <line x1="160" y1="0" x2="160" y2="400" />
            <line x1="320" y1="0" x2="320" y2="400" />
            <line x1="480" y1="0" x2="480" y2="400" />
            <line x1="640" y1="0" x2="640" y2="400" />
          </g>

          {/* 1. Global Continuous Real Landmass Silhouette (The Authentic World Topography) */}
          <path
            d={GLOBAL_LAND_PATH}
            fill={mutedLandFill}
            stroke={landStrokeColor}
            strokeWidth={0.65}
            className="transition-colors duration-150"
          />

          {/* 2. Interactive Sovereign Country Polygons for Telemetry & Hover */}
          <g>
            {WORLD_COUNTRIES.map((country) => {
              const datum = datumMap.get(country.id);
              const isSelected = selectedRegionId?.toUpperCase() === country.id;
              const isHovered = hoveredId === country.id;
              const intensity = datum ? Math.max(0.25, Math.min(0.95, datum.value / maxValue)) : 0;

              // If country has data or is hovered/selected, render dedicated highlight path
              if (!datum && !isHovered && !isSelected) {
                return (
                  <path
                    key={country.id}
                    d={country.d}
                    fill="transparent"
                    stroke="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredId(country.id)}
                    onMouseLeave={() => setHoveredId((prev) => (prev === country.id ? null : prev))}
                    onClick={() => onSelectRegion?.(country.id, datum)}
                  />
                );
              }

              const fill = isHovered
                ? hoverLandFill
                : datum
                  ? hexToRgba(primaryColor, intensity)
                  : mutedLandFill;

              return (
                <path
                  key={country.id}
                  d={country.d}
                  data-country-id={country.id}
                  fill={fill}
                  stroke={isSelected || isHovered ? primaryColor : landStrokeColor}
                  strokeWidth={isSelected ? 1.8 : isHovered ? 1.4 : 0.8}
                  className="transition-colors duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredId(country.id)}
                  onMouseLeave={() => setHoveredId((prev) => (prev === country.id ? null : prev))}
                  onClick={() => onSelectRegion?.(country.id, datum)}
                />
              );
            })}
          </g>

          {/* 3. Animated Telemetry Flow Arcs with Traveling Packet Particles */}
          <g fill="none">
            {arcs.map((arc, i) => {
              const fromC = countryById.get(arc.from.toUpperCase());
              const toC = countryById.get(arc.to.toUpperCase());
              if (!fromC || !toC) return null;
              const midX = (fromC.cx + toC.cx) / 2;
              const midY = Math.min(fromC.cy, toC.cy) - Math.abs(toC.cx - fromC.cx) * 0.22;
              const pathD = `M ${fromC.cx} ${fromC.cy} Q ${midX} ${midY} ${toC.cx} ${toC.cy}`;
              return (
                <g key={`${arc.from}-${arc.to}-${i}`}>
                  <path
                    d={pathD}
                    stroke="url(#zl-telemetry-gradient)"
                    strokeWidth={1.4}
                    strokeOpacity={0.65}
                    strokeDasharray="4 3"
                  />
                  <circle r={2.5} fill={secondaryColor}>
                    <animateMotion
                      path={pathD}
                      dur={`${2.2 + (i % 3) * 0.6}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}
          </g>

          {/* 4. Active Node Markers with Pulsing Radar Rings */}
          <g>
            {markers.map((marker) => {
              const target = marker.countryId
                ? countryById.get(marker.countryId.toUpperCase())
                : undefined;
              const cx = marker.x ?? target?.cx;
              const cy = marker.y ?? target?.cy;
              if (cx === undefined || cy === undefined) return null;

              const dotColor =
                marker.status === "warning"
                  ? "#F59E0B"
                  : marker.status === "idle"
                    ? "#71717A"
                    : primaryColor;

              return (
                <g key={marker.id} transform={`translate(${cx}, ${cy})`}>
                  {marker.status === "active" && (
                    <circle r={8} fill={hexToRgba(dotColor, 0.3)}>
                      <animate
                        attributeName="r"
                        values="4;12;4"
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.8;0;0.8"
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  <circle r={3.5} fill={dotColor} stroke={surfaceColor} strokeWidth={1.5} />
                </g>
              );
            })}
          </g>
        </svg>

        {/* Dynamic Contextual Tooltip Following Mouse / Anchored to Region */}
        {hoveredCountry && (
          <div
            style={{
              backgroundColor: isDark ? "#18181B" : "#0F172A",
              color: "#FFFFFF",
              borderRadius: `${Math.max(6, scaled.scaledRadius)}px`,
              top: mousePos ? Math.min(mousePos.y + 12, height - 70) : 12,
              left: mousePos ? Math.min(mousePos.x + 12, 600) : "auto",
              right: mousePos ? "auto" : 12,
            }}
            className="pointer-events-none absolute z-20 px-3 py-2 text-xs shadow-xl border border-white/10 animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="font-semibold flex items-center gap-2">
              <span>{hoveredDatum?.label || hoveredCountry.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 font-bold">
                {hoveredCountry.id}
              </span>
            </div>

            {hoveredDatum ? (
              <div className="flex items-center gap-2.5 mt-1 text-[11px] tabular-nums font-sans tracking-tight">
                <span className="font-bold text-white text-xs">
                  {hoveredDatum.formattedValue ?? hoveredDatum.value.toLocaleString()}
                </span>
                {hoveredDatum.delta && (
                  <span
                    style={{ color: primaryColor }}
                    className="font-semibold flex items-center gap-0.5"
                  >
                    <Activity className="w-2.5 h-2.5" />
                    <span>{hoveredDatum.delta}</span>
                  </span>
                )}
              </div>
            ) : (
              <div className="text-[10px] text-white/50 mt-0.5">Zero live traffic</div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Scale Legend */}
      {showLegend && (
        <div
          style={{ borderTop: `1px solid ${borderColor}` }}
          className="flex items-center justify-between px-3 py-1.5 text-[11px] opacity-75"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
            <span>Regional telemetry density</span>
          </span>
          <div className="flex items-center gap-2">
            <span>Low</span>
            <div className="flex items-center gap-0.5">
              {[0.25, 0.5, 0.75, 0.95].map((op) => (
                <span
                  key={op}
                  style={{ backgroundColor: hexToRgba(primaryColor, op) }}
                  className="w-4 h-2 rounded-xs"
                />
              ))}
            </div>
            <span>High</span>
          </div>
        </div>
      )}
    </div>
  );
}
