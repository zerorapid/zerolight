"use client";

import React, { useState } from "react";
import { ArrowUpRight, Layers, Palette, ShieldCheck, Globe } from "lucide-react";
import { useZeroLight } from "../context";
import { Card, CardHeader, CardTitle, CardDescription } from "../atoms/card";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";
import { Switch } from "../atoms/switch";
import { ProgressBar } from "../atoms/progress-bar";
import { TagChip } from "../atoms/tag-chip";

export type ToolDirectoryId = "studio" | "zeroflash" | "zeroauditor" | "atlas";

export interface ToolsDirectoryProps {
  brandName?: string;
  onOpenTool: (toolId: ToolDirectoryId) => void;
}

export function ToolsDirectory({
  brandName = "ZeroLight OS",
  onOpenTool,
}: ToolsDirectoryProps) {
  const { tokens, scaled } = useZeroLight();
  const [previewSwitchOn, setPreviewSwitchOn] = useState(true);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Zone 1: Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b"
        style={{ borderColor: tokens.universalBorderColor }}
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight" style={{ color: tokens.textIconColor }}>
              Tools
            </h1>
            <Badge variant="neutral" size="xs" showDot={false}>
              4 ZeroLight Utilities
            </Badge>
          </div>
          <p className="text-xs opacity-70 mt-0.5" style={{ color: tokens.textIconColor }}>
            Choose a tool below to open its full dedicated workspace. Every tool runs directly on ZeroLight tokens and components.
          </p>
        </div>
      </div>

      {/* Zone 2: Preview Card Grid (Collection First -> Opens Dedicated Tool Page) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Visual Studio Dock */}
        <Card
          variant="interactive"
          padding="lg"
          onClick={() => onOpenTool("studio")}
          className="flex flex-col justify-between gap-5"
        >
          <div className="space-y-4">
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 border flex items-center justify-center shrink-0"
                  style={{
                    borderRadius: `${scaled.scaledRadius}px`,
                    borderColor: tokens.universalBorderColor,
                    backgroundColor: tokens.hoverBackplateTint,
                    color: tokens.textIconColor,
                  }}
                >
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle>Visual Studio Dock</CardTitle>
                  <Badge variant="info" size="xs" showDot={false}>
                    Tokens
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconRight={<ArrowUpRight className="w-3.5 h-3.5" />}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTool("studio");
                }}
              >
                Open Tool
              </Button>
            </CardHeader>

            <CardDescription>
              Customize runtime theme polarity, accent colors, Google Font pairs, corner radius, and motion physics across live SaaS templates.
            </CardDescription>

            {/* Live Miniature Design-System Preview */}
            <div
              className="p-4 border flex flex-wrap items-center justify-between gap-3"
              style={{
                borderRadius: `${scaled.scaledRadius}px`,
                borderColor: tokens.universalBorderColor,
                backgroundColor: tokens.hoverBackplateTint,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-5 h-5 border"
                  style={{
                    borderRadius: `${scaled.scaledInnerRadius}px`,
                    backgroundColor: tokens.primaryButtonColor,
                    borderColor: tokens.universalBorderColor,
                  }}
                  title={`Primary ${tokens.primaryButtonColor}`}
                />
                <span
                  className="w-5 h-5 border"
                  style={{
                    borderRadius: `${scaled.scaledInnerRadius}px`,
                    backgroundColor: tokens.chartSecondaryColor || tokens.primaryButtonColor,
                    borderColor: tokens.universalBorderColor,
                  }}
                  title={`Chart ${tokens.chartSecondaryColor}`}
                />
                <span className="text-xs font-semibold tabular-nums" style={{ color: tokens.textIconColor }}>
                  {tokens.cornerRadius ?? 16}px · {tokens.fontFamily || "Inter"}
                </span>
              </div>
              <Switch
                checked={previewSwitchOn}
                onChange={setPreviewSwitchOn}
                id="tools-preview-switch"
              />
            </div>
          </div>
        </Card>

        {/* Card 2: ZeroFlash Brand */}
        <Card
          variant="interactive"
          padding="lg"
          onClick={() => onOpenTool("zeroflash")}
          className="flex flex-col justify-between gap-5"
        >
          <div className="space-y-4">
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 border flex items-center justify-center shrink-0"
                  style={{
                    borderRadius: `${scaled.scaledRadius}px`,
                    borderColor: tokens.universalBorderColor,
                    backgroundColor: tokens.hoverBackplateTint,
                    color: tokens.textIconColor,
                  }}
                >
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle>ZeroFlash Brand</CardTitle>
                  <Badge variant="neutral" size="xs" showDot={false}>
                    Brand Deck
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconRight={<ArrowUpRight className="w-3.5 h-3.5" />}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTool("zeroflash");
                }}
              >
                Open Tool
              </Button>
            </CardHeader>

            <CardDescription>
              Turn client brand briefs and SVG logos into YIQ-checked palettes, a 6-slide Brand Deck preview, and W3C Figma token JSON.
            </CardDescription>

            {/* Live Miniature Brand Deck Preview */}
            <div
              className="p-4 border flex items-center justify-between gap-3"
              style={{
                borderRadius: `${scaled.scaledRadius}px`,
                borderColor: tokens.universalBorderColor,
                backgroundColor: tokens.primaryButtonColor,
                color: scaled.primaryActionTextColor,
              }}
            >
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                  SLIDE 01 · IDENTITY COVER
                </div>
                <div className="text-sm font-bold truncate" title={brandName}>
                  {brandName || "ZeroLight OS"}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <TagChip label="6 Slides" />
                <TagChip label="W3C JSON" />
              </div>
            </div>
          </div>
        </Card>

        {/* Card 3: ZeroAuditor */}
        <Card
          variant="interactive"
          padding="lg"
          onClick={() => onOpenTool("zeroauditor")}
          className="flex flex-col justify-between gap-5"
        >
          <div className="space-y-4">
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 border flex items-center justify-center shrink-0"
                  style={{
                    borderRadius: `${scaled.scaledRadius}px`,
                    borderColor: tokens.universalBorderColor,
                    backgroundColor: tokens.hoverBackplateTint,
                    color: tokens.textIconColor,
                  }}
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle>ZeroAuditor</CardTitle>
                  <Badge variant="healthy" size="xs" showDot={false}>
                    33 Rules
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconRight={<ArrowUpRight className="w-3.5 h-3.5" />}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTool("zeroauditor");
                }}
              >
                Open Tool
              </Button>
            </CardHeader>

            <CardDescription>
              Audit live DOM surfaces or pasted HTML/JSX against 33 anti-slop, YIQ contrast, truncation, and accessibility checks with Excel TSV export.
            </CardDescription>

            {/* Live Miniature Audit Score Preview */}
            <div
              className="p-4 border space-y-2.5"
              style={{
                borderRadius: `${scaled.scaledRadius}px`,
                borderColor: tokens.universalBorderColor,
                backgroundColor: tokens.hoverBackplateTint,
              }}
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span style={{ color: tokens.textIconColor }}>Clean Craft Benchmark</span>
                <Badge variant="healthy" size="xs">
                  Grade A · 96/100
                </Badge>
              </div>
              <ProgressBar value={96} showValue={false} />
            </div>
          </div>
        </Card>

        {/* Card 4: World Atlas Map */}
        <Card
          variant="interactive"
          padding="lg"
          onClick={() => onOpenTool("atlas")}
          className="flex flex-col justify-between gap-5"
        >
          <div className="space-y-4">
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 border flex items-center justify-center shrink-0"
                  style={{
                    borderRadius: `${scaled.scaledRadius}px`,
                    borderColor: tokens.universalBorderColor,
                    backgroundColor: tokens.hoverBackplateTint,
                    color: tokens.textIconColor,
                  }}
                >
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle>World Atlas Map</CardTitle>
                  <Badge variant="neutral" size="xs" showDot={false}>
                    SVG Studio
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconRight={<ArrowUpRight className="w-3.5 h-3.5" />}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTool("atlas");
                }}
              >
                Open Tool
              </Button>
            </CardHeader>

            <CardDescription>
              Configure 2D monochrome vector maps across 6 dot/pixel/hatch pattern styles, regional zoom presets, and export standalone SVGs.
            </CardDescription>

            {/* Live Miniature Vector Studio Preview */}
            <div
              className="p-4 border flex items-center justify-between gap-3"
              style={{
                borderRadius: `${scaled.scaledRadius}px`,
                borderColor: tokens.universalBorderColor,
                backgroundColor: tokens.hoverBackplateTint,
              }}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <TagChip label="6 Pattern Styles" />
                <TagChip label="Natural Earth" />
                <TagChip label="Zero API Key" />
              </div>
              <Badge variant="neutral" size="xs" showDot={false}>
                SVG Ready
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* ZeroRapid Agency Conversion Footer */}
      <Card variant="muted" padding="md" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-0.5">
          <div className="text-xs font-bold tracking-tight" style={{ color: tokens.textIconColor }}>
            Built by ZeroRapid · UI/UX, Branding & Vibe-Coded MVPs
          </div>
          <p className="text-xs opacity-70" style={{ color: tokens.textIconColor }}>
            Want a dedicated design system, custom SaaS product, or 48-hour craft overhaul built with ZeroLight?
          </p>
        </div>
        <a href="https://zerorapid.in" target="_blank" rel="noopener noreferrer" className="shrink-0">
          <Button variant="primary" size="sm" iconRight={<ArrowUpRight className="w-3.5 h-3.5" />}>
            Visit zerorapid.in
          </Button>
        </a>
      </Card>
    </div>
  );
}
