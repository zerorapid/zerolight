"use client";

import React, { useMemo, useState } from "react";
import { Plus, Minus, RotateCcw, Globe2 } from "lucide-react";
import { useZeroLight } from "../context";

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

interface CountryShape {
  id: string;
  name: string;
  continent: Exclude<WorldMapRegionPreset, "world">;
  cx: number;
  cy: number;
  d: string;
}

const REGION_VIEWBOXES: Record<
  WorldMapRegionPreset,
  { x: number; y: number; w: number; h: number; label: string }
> = {
  world: { x: 0, y: 0, w: 800, h: 400, label: "Global" },
  "north-america": { x: 40, y: 20, w: 280, h: 195, label: "N. America" },
  europe: { x: 345, y: 28, w: 150, h: 120, label: "Europe" },
  asia: { x: 485, y: 38, w: 255, h: 210, label: "APAC" },
  latam: { x: 165, y: 175, w: 170, h: 205, label: "LATAM" },
  mea: { x: 350, y: 128, w: 190, h: 195, label: "MEA" },
  oceania: { x: 590, y: 235, w: 190, h: 145, label: "Oceania" },
};

const WORLD_COUNTRIES: CountryShape[] = [
  // North America
  {
    id: "CA",
    name: "Canada",
    continent: "north-america",
    cx: 165,
    cy: 78,
    d: "M72,56 L108,42 L152,36 L204,40 L246,56 L264,74 L242,96 L205,98 L175,92 L120,92 L82,84 Z",
  },
  {
    id: "US",
    name: "United States",
    continent: "north-america",
    cx: 162,
    cy: 118,
    d: "M84,92 L174,94 L224,98 L244,106 L236,128 L208,142 L176,144 L148,138 L108,134 L84,116 Z",
  },
  {
    id: "MX",
    name: "Mexico",
    continent: "north-america",
    cx: 148,
    cy: 158,
    d: "M108,136 L152,140 L176,154 L182,174 L162,178 L138,166 L116,152 Z",
  },
  // South America
  {
    id: "CO",
    name: "Colombia",
    continent: "latam",
    cx: 214,
    cy: 198,
    d: "M196,184 L222,184 L232,202 L214,214 L196,204 Z",
  },
  {
    id: "BR",
    name: "Brazil",
    continent: "latam",
    cx: 262,
    cy: 248,
    d: "M220,206 L262,204 L298,224 L302,258 L278,288 L252,292 L236,262 L220,236 Z",
  },
  {
    id: "AR",
    name: "Argentina",
    continent: "latam",
    cx: 240,
    cy: 326,
    d: "M226,286 L256,292 L262,326 L246,364 L226,356 L222,318 Z",
  },
  // Europe
  {
    id: "GB",
    name: "United Kingdom",
    continent: "europe",
    cx: 374,
    cy: 84,
    d: "M366,70 L380,68 L384,88 L368,94 L364,82 Z",
  },
  {
    id: "FR",
    name: "France",
    continent: "europe",
    cx: 386,
    cy: 106,
    d: "M372,96 L396,94 L402,112 L386,118 L372,112 Z",
  },
  {
    id: "ES",
    name: "Spain",
    continent: "europe",
    cx: 370,
    cy: 124,
    d: "M356,114 L382,114 L382,132 L358,134 L354,124 Z",
  },
  {
    id: "DE",
    name: "Germany",
    continent: "europe",
    cx: 410,
    cy: 96,
    d: "M398,84 L420,84 L422,106 L402,108 L398,96 Z",
  },
  {
    id: "NL",
    name: "Netherlands",
    continent: "europe",
    cx: 396,
    cy: 86,
    d: "M390,80 L402,80 L402,90 L390,90 Z",
  },
  {
    id: "IT",
    name: "Italy",
    continent: "europe",
    cx: 414,
    cy: 120,
    d: "M404,110 L418,110 L426,132 L416,136 L406,120 Z",
  },
  {
    id: "SE",
    name: "Sweden",
    continent: "europe",
    cx: 422,
    cy: 60,
    d: "M410,44 L428,42 L434,74 L416,78 L412,60 Z",
  },
  {
    id: "PL",
    name: "Poland",
    continent: "europe",
    cx: 432,
    cy: 92,
    d: "M422,82 L446,82 L446,102 L424,102 Z",
  },
  // Middle East & Africa
  {
    id: "EG",
    name: "Egypt",
    continent: "mea",
    cx: 448,
    cy: 158,
    d: "M434,146 L462,146 L464,172 L436,172 Z",
  },
  {
    id: "SA",
    name: "Saudi Arabia",
    continent: "mea",
    cx: 486,
    cy: 164,
    d: "M466,148 L504,152 L512,178 L484,186 L468,172 Z",
  },
  {
    id: "AE",
    name: "UAE",
    continent: "mea",
    cx: 514,
    cy: 168,
    d: "M506,162 L522,162 L522,174 L508,176 Z",
  },
  {
    id: "NG",
    name: "Nigeria",
    continent: "mea",
    cx: 406,
    cy: 196,
    d: "M392,186 L422,186 L424,208 L394,208 Z",
  },
  {
    id: "KE",
    name: "Kenya",
    continent: "mea",
    cx: 462,
    cy: 214,
    d: "M450,202 L474,202 L474,226 L450,226 Z",
  },
  {
    id: "ZA",
    name: "South Africa",
    continent: "mea",
    cx: 436,
    cy: 288,
    d: "M416,268 L458,266 L462,296 L436,312 L416,296 Z",
  },
  // Asia / APAC
  {
    id: "IN",
    name: "India",
    continent: "asia",
    cx: 556,
    cy: 170,
    d: "M534,142 L572,144 L584,166 L562,208 L544,204 L532,172 Z",
  },
  {
    id: "CN",
    name: "China",
    continent: "asia",
    cx: 616,
    cy: 126,
    d: "M560,96 L632,88 L668,106 L662,146 L622,158 L576,144 L556,120 Z",
  },
  {
    id: "KR",
    name: "South Korea",
    continent: "asia",
    cx: 676,
    cy: 126,
    d: "M670,118 L682,118 L682,136 L670,136 Z",
  },
  {
    id: "JP",
    name: "Japan",
    continent: "asia",
    cx: 702,
    cy: 124,
    d: "M692,104 L710,100 L714,126 L698,144 L690,134 Z",
  },
  {
    id: "SG",
    name: "Singapore",
    continent: "asia",
    cx: 618,
    cy: 212,
    d: "M610,206 L626,206 L626,218 L610,218 Z",
  },
  {
    id: "ID",
    name: "Indonesia",
    continent: "asia",
    cx: 640,
    cy: 234,
    d: "M604,224 L658,224 L676,238 L644,246 L608,238 Z",
  },
  // Oceania
  {
    id: "AU",
    name: "Australia",
    continent: "oceania",
    cx: 676,
    cy: 294,
    d: "M626,262 L688,256 L724,278 L720,318 L680,332 L636,318 L620,290 Z",
  },
  {
    id: "NZ",
    name: "New Zealand",
    continent: "oceania",
    cx: 752,
    cy: 334,
    d: "M744,316 L760,314 L762,344 L744,352 Z",
  },
];

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
  height = 280,
  className = "",
}: WorldMapProps) {
  const { tokens, scaled } = useZeroLight();
  const [region, setRegion] = useState<WorldMapRegionPreset>(defaultRegion);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const primaryColor = scaled.chartPrimaryColor || tokens.primaryButtonColor || "#10B981";
  const secondaryColor = scaled.chartSecondaryColor || "#8B5CF6";
  const borderColor = tokens.universalBorderColor || "#E4E4E7";
  const surfaceColor = tokens.universalFillColor || "#FFFFFF";
  const textColor = tokens.textIconColor || "#18181B";
  const mutedLandFill = scaled.isDarkSurface
    ? "rgba(255, 255, 255, 0.06)"
    : "rgba(24, 24, 27, 0.06)";
  const hoverLandFill = hexToRgba(primaryColor, 0.28);

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

  return (
    <div
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
      className={`relative overflow-hidden transition-colors ${className}`}
    >
      {/* Top Toolbar: Region Presets + Zoom Controls */}
      {showControls && (
        <div
          style={{ borderBottom: `1px solid ${borderColor}` }}
          className="flex flex-wrap items-center justify-between gap-2 px-3 py-2"
        >
          <div className="flex items-center gap-1 flex-wrap">
            <Globe2 size={14} style={{ color: primaryColor }} className="mr-1 opacity-80" />
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

          <div className="flex items-center gap-1">
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

      {/* Interactive SVG Map Canvas */}
      <div className="relative w-full" style={{ height }}>
        <svg
          viewBox={viewBox}
          className="w-full h-full select-none"
          role="img"
          aria-label="Interactive world map"
        >
          {/* Subtle latitude / longitude graticule */}
          <g stroke={borderColor} strokeOpacity={0.35} strokeWidth={0.5} strokeDasharray="3 3">
            <line x1="0" y1="100" x2="800" y2="100" />
            <line x1="0" y1="200" x2="800" y2="200" />
            <line x1="0" y1="300" x2="800" y2="300" />
            <line x1="200" y1="0" x2="200" y2="400" />
            <line x1="400" y1="0" x2="400" y2="400" />
            <line x1="600" y1="0" x2="600" y2="400" />
          </g>

          {/* Country Choropleth Polygons */}
          <g>
            {WORLD_COUNTRIES.map((country) => {
              const datum = datumMap.get(country.id);
              const isSelected = selectedRegionId?.toUpperCase() === country.id;
              const isHovered = hoveredId === country.id;
              const intensity = datum ? Math.max(0.18, Math.min(0.92, datum.value / maxValue)) : 0;

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
                  stroke={isSelected || isHovered ? primaryColor : borderColor}
                  strokeWidth={isSelected ? 1.8 : isHovered ? 1.3 : 0.75}
                  className="transition-colors duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredId(country.id)}
                  onMouseLeave={() => setHoveredId((prev) => (prev === country.id ? null : prev))}
                  onClick={() => onSelectRegion?.(country.id, datum)}
                />
              );
            })}
          </g>

          {/* Animated Flow Arcs */}
          <g fill="none">
            {arcs.map((arc, i) => {
              const fromC = countryById.get(arc.from.toUpperCase());
              const toC = countryById.get(arc.to.toUpperCase());
              if (!fromC || !toC) return null;
              const midX = (fromC.cx + toC.cx) / 2;
              const midY = Math.min(fromC.cy, toC.cy) - Math.abs(toC.cx - fromC.cx) * 0.18;
              const pathD = `M ${fromC.cx} ${fromC.cy} Q ${midX} ${midY} ${toC.cx} ${toC.cy}`;
              return (
                <path
                  key={`${arc.from}-${arc.to}-${i}`}
                  d={pathD}
                  stroke={secondaryColor}
                  strokeWidth={1.6}
                  strokeOpacity={0.85}
                  strokeDasharray="4 3"
                />
              );
            })}
          </g>

          {/* Pin / Bubble Markers */}
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
                  <circle r={9} fill={hexToRgba(dotColor, 0.2)} />
                  <circle r={4} fill={dotColor} stroke={surfaceColor} strokeWidth={1.5} />
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating Hover Tooltip */}
        {hoveredCountry && (
          <div
            style={{
              backgroundColor: scaled.isDarkSurface ? "#18181B" : "#111111",
              color: "#FFFFFF",
              borderRadius: `${Math.max(6, scaled.scaledRadius)}px`,
            }}
            className="pointer-events-none absolute top-3 right-3 px-2.5 py-1.5 text-xs shadow-lg border border-white/10"
          >
            <div className="font-medium flex items-center gap-2">
              <span>{hoveredDatum?.label || hoveredCountry.name}</span>
              <span className="text-[10px] opacity-60">{hoveredCountry.id}</span>
            </div>
            {hoveredDatum ? (
              <div className="flex items-center gap-2 mt-0.5 text-[11px] tabular-nums">
                <span className="font-semibold">
                  {hoveredDatum.formattedValue ?? hoveredDatum.value.toLocaleString()}
                </span>
                {hoveredDatum.delta && (
                  <span style={{ color: primaryColor }}>{hoveredDatum.delta}</span>
                )}
              </div>
            ) : (
              <div className="text-[10px] opacity-60 mt-0.5">No telemetry</div>
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
          <span>Intensity scale</span>
          <div className="flex items-center gap-2">
            <span>Low</span>
            <div className="flex items-center gap-0.5">
              {[0.2, 0.4, 0.65, 0.9].map((op) => (
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
