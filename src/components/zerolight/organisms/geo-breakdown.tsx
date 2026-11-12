"use client";

import React, { useMemo, useState } from "react";
import { useZeroLight } from "../context";
import { ProgressBar } from "../atoms/progress-bar";
import { TrendDelta } from "../atoms/trend-delta";
import {
  WorldMap,
  WorldMapArc,
  WorldMapMarker,
  WorldMapRegionDatum,
  WorldMapRegionPreset,
} from "../molecules/world-map";

export interface GeoBreakdownItem extends WorldMapRegionDatum {
  name: string;
  sharePercent: number;
  deltaPercent?: number;
}

export interface GeoBreakdownProps {
  title?: string;
  subtitle?: string;
  items?: GeoBreakdownItem[];
  markers?: WorldMapMarker[];
  arcs?: WorldMapArc[];
  defaultRegion?: WorldMapRegionPreset;
  className?: string;
}

const DEFAULT_GEO_ITEMS: GeoBreakdownItem[] = [
  { id: "US", name: "United States", value: 48200, formattedValue: "$48.2K", sharePercent: 38, delta: "+14.2%", deltaPercent: 14.2 },
  { id: "GB", name: "United Kingdom", value: 24100, formattedValue: "$24.1K", sharePercent: 19, delta: "+9.4%", deltaPercent: 9.4 },
  { id: "DE", name: "Germany", value: 18900, formattedValue: "$18.9K", sharePercent: 15, delta: "+6.8%", deltaPercent: 6.8 },
  { id: "IN", name: "India", value: 15400, formattedValue: "$15.4K", sharePercent: 12, delta: "+22.1%", deltaPercent: 22.1 },
  { id: "SG", name: "Singapore", value: 10200, formattedValue: "$10.2K", sharePercent: 8, delta: "+11.5%", deltaPercent: 11.5 },
  { id: "AU", name: "Australia", value: 6400, formattedValue: "$6.4K", sharePercent: 5, delta: "-1.8%", deltaPercent: -1.8 },
];

const DEFAULT_MARKERS: WorldMapMarker[] = [
  { id: "iad", countryId: "US", label: "us-east-1", status: "active" },
  { id: "lhr", countryId: "GB", label: "eu-west-2", status: "active" },
  { id: "sin", countryId: "SG", label: "ap-southeast-1", status: "active" },
  { id: "bom", countryId: "IN", label: "ap-south-1", status: "warning" },
];

const DEFAULT_ARCS: WorldMapArc[] = [
  { from: "US", to: "GB" },
  { from: "GB", to: "IN" },
  { from: "IN", to: "SG" },
];

export function GeoBreakdown({
  title = "Global Revenue & Edge Traffic",
  subtitle = "Live regional distribution across active deployment zones",
  items = DEFAULT_GEO_ITEMS,
  markers = DEFAULT_MARKERS,
  arcs = DEFAULT_ARCS,
  defaultRegion = "world",
  className = "",
}: GeoBreakdownProps) {
  const { tokens, scaled } = useZeroLight();
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => b.value - a.value),
    [items]
  );

  const borderColor = tokens.universalBorderColor || "#E4E4E7";
  const surfaceColor = tokens.universalFillColor || "#FFFFFF";
  const textColor = tokens.textIconColor || "#18181B";
  const primaryColor = scaled.chartPrimaryColor || tokens.primaryButtonColor || "#10B981";

  return (
    <div
      data-testid="zerolight-geo-breakdown"
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
      className={`overflow-hidden transition-colors ${className}`}
    >
      <div
        style={{ borderBottom: `1px solid ${borderColor}` }}
        className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
      >
        <div>
          <h3
            style={{
              fontFamily: scaled.resolvedHeadingFontFamily,
              fontWeight: scaled.headingWeight,
            }}
            className="text-sm font-semibold"
          >
            {title}
          </h3>
          <p className="text-xs opacity-65">{subtitle}</p>
        </div>
        {selectedRegionId && (
          <button
            type="button"
            onClick={() => setSelectedRegionId(null)}
            style={{
              borderColor,
              borderRadius: `${Math.max(4, scaled.scaledOptionRadius)}px`,
            }}
            className="px-2 py-1 text-[11px] border opacity-75 hover:opacity-100 cursor-pointer"
          >
            Clear filter ({selectedRegionId})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 items-center">
        <div className="lg:col-span-7">
          <WorldMap
            data={sortedItems}
            markers={markers}
            arcs={arcs}
            defaultRegion={defaultRegion}
            selectedRegionId={selectedRegionId}
            onSelectRegion={(id) =>
              setSelectedRegionId((prev) => (prev === id ? null : id))
            }
            height={260}
          />
        </div>

        <div className="lg:col-span-5 space-y-3">
          {sortedItems.map((item) => {
            const active = selectedRegionId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setSelectedRegionId((prev) => (prev === item.id ? null : item.id))
                }
                style={{
                  borderRadius: `${Math.max(6, scaled.scaledRadius)}px`,
                  backgroundColor: active ? tokens.hoverBackplateTint : "transparent",
                  borderColor: active ? primaryColor : "transparent",
                }}
                className="w-full text-left p-2 border transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium flex items-center gap-1.5">
                    <span className="text-[10px] opacity-60 uppercase">{item.id}</span>
                    <span>{item.name}</span>
                  </span>
                  <span className="flex items-center gap-2 tabular-nums">
                    <span className="font-semibold">
                      {item.formattedValue ?? item.value.toLocaleString()}
                    </span>
                    {item.deltaPercent !== undefined && (
                      <TrendDelta value={item.deltaPercent} size="xs" />
                    )}
                  </span>
                </div>
                <ProgressBar value={item.sharePercent} max={100} showValue={false} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
