"use client";

import React from "react";
import { WorldAtlasMap, WorldAtlasMapProps, MapRenderStyle, PatternDensity } from "../../WorldAtlasMap";
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

export const REGION_VIEWBOXES: Record<
  WorldMapRegionPreset,
  { x: number; y: number; width: number; height: number }
> = {
  world: { x: 0, y: 0, width: 800, height: 400 },
  "north-america": { x: 60, y: 40, width: 260, height: 300 },
  europe: { x: 340, y: 40, width: 180, height: 140 },
  asia: { x: 460, y: 40, width: 260, height: 220 },
  latam: { x: 180, y: 160, width: 180, height: 220 },
  mea: { x: 360, y: 110, width: 190, height: 200 },
  oceania: { x: 580, y: 180, width: 200, height: 180 },
};

export interface WorldMapRegionDatum {
  id: string;
  label?: string;
  value: number;
  formattedValue?: string;
  delta?: string;
}

export interface WorldMapMarker {
  id: string;
  label: string;
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
  renderStyle?: MapRenderStyle;
  patternDensity?: PatternDensity;
}

/**
 * WorldMap - Canonical ZeroLight Geo-Visualization Primitive
 * Powered by WorldAtlasMap: 2D flat monochrome vector canvas, 6 customizable render styles,
 * and high-precision Natural Earth 110m antimeridian-clipped geometry.
 */
export function WorldMap({
  selectedRegionId,
  onSelectRegion,
  className = "",
  renderStyle = "vector",
  patternDensity = "standard",
}: WorldMapProps) {
  const selectedCountryIds = selectedRegionId ? [selectedRegionId] : [];

  return (
    <WorldAtlasMap
      className={className}
      defaultStyle={renderStyle}
      defaultDensity={patternDensity}
      selectedCountryIds={selectedCountryIds}
      onSelectCountry={(countryId) => {
        onSelectRegion?.(countryId);
      }}
      showTelemetryMarkers={true}
      interactive={true}
    />
  );
}

export default WorldMap;
