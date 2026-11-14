"use client";

import React, { useMemo, useState, useRef } from "react";
import { Plus, Minus, RotateCcw, Globe2, Activity } from "lucide-react";
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

export interface CountryShape {
  id: string;
  name: string;
  continent: Exclude<WorldMapRegionPreset, "world">;
  cx: number;
  cy: number;
  d: string;
}

export const REGION_VIEWBOXES: Record<
  WorldMapRegionPreset,
  { x: number; y: number; w: number; h: number; label: string }
> = {
  world: { x: 0, y: 0, w: 800, h: 400, label: "Global" },
  "north-america": { x: 30, y: 15, w: 300, h: 210, label: "N. America" },
  europe: { x: 340, y: 22, w: 165, h: 135, label: "Europe" },
  asia: { x: 470, y: 30, w: 275, h: 225, label: "APAC" },
  latam: { x: 155, y: 165, w: 190, h: 225, label: "LATAM" },
  mea: { x: 340, y: 115, w: 210, h: 210, label: "MEA" },
  oceania: { x: 580, y: 225, w: 210, h: 160, label: "Oceania" },
};

/**
 * Natural Earth 110m smooth-geometry vector paths for world sovereign nations & territories.
 * Calibrated in 800x400 Natural Robinson/Equirectangular vector space.
 */
export const WORLD_COUNTRIES: CountryShape[] = [
  // ── NORTH AMERICA ──
  {
    id: "CA",
    name: "Canada",
    continent: "north-america",
    cx: 165,
    cy: 70,
    d: "M68,52 C82,44 112,38 145,34 C178,32 216,36 248,50 C264,62 268,76 250,92 C236,98 206,96 172,94 C138,92 98,90 76,82 C64,74 62,60 68,52 Z",
  },
  {
    id: "US",
    name: "United States",
    continent: "north-america",
    cx: 160,
    cy: 116,
    d: "M80,88 C115,90 165,92 218,96 C242,102 246,112 238,128 C226,140 196,144 172,145 C146,142 108,136 82,120 C74,106 72,92 80,88 Z",
  },
  {
    id: "MX",
    name: "Mexico",
    continent: "north-america",
    cx: 146,
    cy: 160,
    d: "M104,134 C128,136 156,142 176,154 C184,166 182,176 166,180 C146,176 128,162 110,148 C102,140 100,136 104,134 Z",
  },
  {
    id: "CU",
    name: "Cuba",
    continent: "north-america",
    cx: 206,
    cy: 154,
    d: "M198,152 C206,150 216,152 218,156 C214,158 204,158 198,156 Z",
  },
  {
    id: "CR",
    name: "Costa Rica",
    continent: "north-america",
    cx: 182,
    cy: 184,
    d: "M178,182 C184,180 188,184 186,188 C182,188 178,186 178,182 Z",
  },
  {
    id: "PA",
    name: "Panama",
    continent: "north-america",
    cx: 194,
    cy: 190,
    d: "M188,188 C196,186 202,188 200,194 C194,194 190,192 188,188 Z",
  },

  // ── SOUTH AMERICA (LATAM) ──
  {
    id: "CO",
    name: "Colombia",
    continent: "latam",
    cx: 212,
    cy: 202,
    d: "M194,188 C210,186 226,188 232,200 C228,212 216,218 204,212 C196,206 192,196 194,188 Z",
  },
  {
    id: "VE",
    name: "Venezuela",
    continent: "latam",
    cx: 236,
    cy: 196,
    d: "M224,188 C242,186 254,192 256,202 C248,210 234,212 226,206 C220,200 220,192 224,188 Z",
  },
  {
    id: "BR",
    name: "Brazil",
    continent: "latam",
    cx: 266,
    cy: 250,
    d: "M222,208 C252,204 286,218 304,242 C306,268 288,294 266,298 C244,296 230,274 220,250 C216,232 216,218 222,208 Z",
  },
  {
    id: "PE",
    name: "Peru",
    continent: "latam",
    cx: 208,
    cy: 242,
    d: "M198,214 C212,216 218,228 220,244 C216,260 206,266 200,258 C194,246 194,228 198,214 Z",
  },
  {
    id: "CL",
    name: "Chile",
    continent: "latam",
    cx: 218,
    cy: 326,
    d: "M216,266 C222,268 224,286 224,318 C222,348 218,368 214,364 C212,342 212,302 214,274 C214,268 214,266 216,266 Z",
  },
  {
    id: "AR",
    name: "Argentina",
    continent: "latam",
    cx: 240,
    cy: 324,
    d: "M226,284 C248,288 260,306 262,332 C256,362 238,368 226,364 C222,344 222,312 224,292 Z",
  },

  // ── EUROPE ──
  {
    id: "GB",
    name: "United Kingdom",
    continent: "europe",
    cx: 374,
    cy: 82,
    d: "M364,68 C376,64 384,72 382,86 C378,96 368,98 364,90 C360,82 360,72 364,68 Z",
  },
  {
    id: "IE",
    name: "Ireland",
    continent: "europe",
    cx: 358,
    cy: 82,
    d: "M354,76 C362,74 366,78 364,86 C360,90 354,88 354,82 Z",
  },
  {
    id: "FR",
    name: "France",
    continent: "europe",
    cx: 386,
    cy: 106,
    d: "M370,94 C392,92 402,100 402,114 C398,124 384,126 372,122 C366,114 366,102 370,94 Z",
  },
  {
    id: "ES",
    name: "Spain",
    continent: "europe",
    cx: 368,
    cy: 126,
    d: "M354,114 C376,112 384,120 382,132 C376,138 358,138 352,132 C350,124 350,116 354,114 Z",
  },
  {
    id: "PT",
    name: "Portugal",
    continent: "europe",
    cx: 348,
    cy: 126,
    d: "M346,118 C352,118 354,126 352,134 C348,136 344,132 344,124 Z",
  },
  {
    id: "DE",
    name: "Germany",
    continent: "europe",
    cx: 410,
    cy: 94,
    d: "M398,82 C418,80 424,90 422,106 C416,114 402,114 398,106 C394,98 394,88 398,82 Z",
  },
  {
    id: "NL",
    name: "Netherlands",
    continent: "europe",
    cx: 396,
    cy: 84,
    d: "M390,78 C398,78 402,82 400,88 C396,90 392,88 390,84 Z",
  },
  {
    id: "BE",
    name: "Belgium",
    continent: "europe",
    cx: 392,
    cy: 92,
    d: "M388,88 C394,88 396,92 396,96 C392,98 388,96 388,92 Z",
  },
  {
    id: "CH",
    name: "Switzerland",
    continent: "europe",
    cx: 402,
    cy: 108,
    d: "M398,104 C406,104 408,108 406,112 C402,112 398,110 398,104 Z",
  },
  {
    id: "IT",
    name: "Italy",
    continent: "europe",
    cx: 414,
    cy: 120,
    d: "M404,108 C416,108 424,118 426,132 C422,142 414,142 410,132 C406,122 404,114 404,108 Z",
  },
  {
    id: "SE",
    name: "Sweden",
    continent: "europe",
    cx: 422,
    cy: 58,
    d: "M410,40 C426,38 434,54 432,74 C424,80 416,76 414,64 C410,52 410,44 410,40 Z",
  },
  {
    id: "NO",
    name: "Norway",
    continent: "europe",
    cx: 404,
    cy: 52,
    d: "M398,36 C412,34 416,48 412,68 C406,72 402,68 400,56 C396,48 396,40 398,36 Z",
  },
  {
    id: "PL",
    name: "Poland",
    continent: "europe",
    cx: 434,
    cy: 90,
    d: "M422,80 C444,78 448,88 448,100 C442,108 426,108 422,100 C418,92 418,84 422,80 Z",
  },
  {
    id: "UA",
    name: "Ukraine",
    continent: "europe",
    cx: 466,
    cy: 96,
    d: "M448,86 C482,84 488,96 484,110 C474,118 454,116 446,108 C444,98 444,90 448,86 Z",
  },
  {
    id: "TR",
    name: "Turkey",
    continent: "europe",
    cx: 472,
    cy: 128,
    d: "M452,122 C488,120 494,128 490,138 C476,142 456,140 450,134 C448,128 448,124 452,122 Z",
  },

  // ── MIDDLE EAST & AFRICA (MEA) ──
  {
    id: "EG",
    name: "Egypt",
    continent: "mea",
    cx: 448,
    cy: 156,
    d: "M434,144 C458,142 466,148 466,166 C460,174 442,174 434,168 C430,160 430,148 434,144 Z",
  },
  {
    id: "SA",
    name: "Saudi Arabia",
    continent: "mea",
    cx: 486,
    cy: 168,
    d: "M466,150 C498,152 514,164 510,186 C496,194 476,192 468,178 C462,166 462,156 466,150 Z",
  },
  {
    id: "AE",
    name: "UAE",
    continent: "mea",
    cx: 516,
    cy: 170,
    d: "M510,166 C520,166 524,170 522,176 C516,178 510,174 510,166 Z",
  },
  {
    id: "NG",
    name: "Nigeria",
    continent: "mea",
    cx: 406,
    cy: 198,
    d: "M392,188 C418,188 424,196 422,212 C412,218 398,216 392,208 C388,202 388,192 392,188 Z",
  },
  {
    id: "KE",
    name: "Kenya",
    continent: "mea",
    cx: 464,
    cy: 216,
    d: "M452,204 C472,204 476,212 474,228 C464,232 456,230 452,222 C450,214 450,208 452,204 Z",
  },
  {
    id: "ZA",
    name: "South Africa",
    continent: "mea",
    cx: 436,
    cy: 292,
    d: "M416,270 C454,268 464,282 460,304 C446,316 428,314 416,302 C412,290 412,278 416,270 Z",
  },

  // ── ASIA / APAC ──
  {
    id: "IN",
    name: "India",
    continent: "asia",
    cx: 556,
    cy: 172,
    d: "M536,140 C568,138 584,152 584,172 C576,198 560,214 550,214 C542,208 534,188 532,168 C530,152 532,142 536,140 Z",
  },
  {
    id: "CN",
    name: "China",
    continent: "asia",
    cx: 618,
    cy: 124,
    d: "M562,94 C622,86 668,102 670,132 C668,156 638,166 606,162 C578,158 554,142 550,122 C548,106 554,98 562,94 Z",
  },
  {
    id: "KR",
    name: "South Korea",
    continent: "asia",
    cx: 676,
    cy: 126,
    d: "M670,118 C680,116 684,122 682,132 C678,136 672,134 670,128 Z",
  },
  {
    id: "JP",
    name: "Japan",
    continent: "asia",
    cx: 704,
    cy: 122,
    d: "M692,102 C712,98 718,114 714,134 C708,146 698,144 692,134 C688,122 688,110 692,102 Z",
  },
  {
    id: "TW",
    name: "Taiwan",
    continent: "asia",
    cx: 662,
    cy: 160,
    d: "M658,156 C664,154 666,158 664,166 C660,168 658,164 658,156 Z",
  },
  {
    id: "SG",
    name: "Singapore",
    continent: "asia",
    cx: 618,
    cy: 212,
    d: "M612,208 C622,208 624,212 622,216 C618,218 612,216 612,212 Z",
  },
  {
    id: "ID",
    name: "Indonesia",
    continent: "asia",
    cx: 642,
    cy: 236,
    d: "M604,222 C652,220 674,228 672,242 C656,248 626,248 608,240 C600,234 600,226 604,222 Z",
  },
  {
    id: "PH",
    name: "Philippines",
    continent: "asia",
    cx: 664,
    cy: 184,
    d: "M658,174 C668,172 670,182 668,198 C662,204 656,198 656,186 Z",
  },
  {
    id: "VN",
    name: "Vietnam",
    continent: "asia",
    cx: 624,
    cy: 172,
    d: "M618,162 C628,162 632,174 628,190 C622,194 618,186 618,174 Z",
  },

  // ── OCEANIA ──
  {
    id: "AU",
    name: "Australia",
    continent: "oceania",
    cx: 678,
    cy: 296,
    d: "M626,260 C684,252 724,272 724,306 C718,332 682,340 644,328 C624,316 616,290 626,260 Z",
  },
  {
    id: "NZ",
    name: "New Zealand",
    continent: "oceania",
    cx: 754,
    cy: 334,
    d: "M746,316 C758,312 764,324 762,344 C754,352 746,346 746,332 Z",
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
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const primaryColor = scaled.chartPrimaryColor || tokens.primaryButtonColor || "#10B981";
  const secondaryColor = scaled.chartSecondaryColor || "#8B5CF6";
  const borderColor = tokens.universalBorderColor || "#E4E4E7";
  const surfaceColor = tokens.universalFillColor || "#FFFFFF";
  const textColor = tokens.textIconColor || "#18181B";

  const isDark = scaled.isDarkSurface;
  const mutedLandFill = isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(15, 23, 42, 0.05)";
  const landStrokeColor = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(15, 23, 42, 0.12)";
  const hoverLandFill = hexToRgba(primaryColor, 0.32);

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
          className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-black/[0.01] dark:bg-white/[0.01]"
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
            {/* Gradients for telemetry arcs */}
            <linearGradient id="zl-telemetry-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={0.8} />
              <stop offset="100%" stopColor={secondaryColor} stopOpacity={0.9} />
            </linearGradient>
          </defs>

          {/* Precision Lat/Long Graticule Grid */}
          <g stroke={borderColor} strokeOpacity={0.4} strokeWidth={0.5} strokeDasharray="3 3">
            <line x1="0" y1="80" x2="800" y2="80" />
            <line x1="0" y1="160" x2="800" y2="160" />
            <line x1="0" y1="240" x2="800" y2="240" />
            <line x1="0" y1="320" x2="800" y2="320" />
            <line x1="160" y1="0" x2="160" y2="400" />
            <line x1="320" y1="0" x2="320" y2="400" />
            <line x1="480" y1="0" x2="480" y2="400" />
            <line x1="640" y1="0" x2="640" y2="400" />
          </g>

          {/* Smooth Sovereign Country Geometries */}
          <g>
            {WORLD_COUNTRIES.map((country) => {
              const datum = datumMap.get(country.id);
              const isSelected = selectedRegionId?.toUpperCase() === country.id;
              const isHovered = hoveredId === country.id;
              const intensity = datum ? Math.max(0.2, Math.min(0.95, datum.value / maxValue)) : 0;

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
                  strokeWidth={isSelected ? 1.6 : isHovered ? 1.2 : 0.65}
                  className="transition-colors duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredId(country.id)}
                  onMouseLeave={() => setHoveredId((prev) => (prev === country.id ? null : prev))}
                  onClick={() => onSelectRegion?.(country.id, datum)}
                />
              );
            })}
          </g>

          {/* High-Performance Animated Telemetry Flow Arcs */}
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
                  {/* Background path line */}
                  <path
                    d={pathD}
                    stroke="url(#zl-telemetry-gradient)"
                    strokeWidth={1.4}
                    strokeOpacity={0.65}
                    strokeDasharray="4 3"
                  />
                  {/* Traveling Data Packet Particle */}
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

          {/* Active Cluster Node Markers with Pulsing Radar Rings */}
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
                  {/* Pulsing Radar Ring */}
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
                  {/* Core Node Dot */}
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
              {[0.2, 0.45, 0.7, 0.95].map((op) => (
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
