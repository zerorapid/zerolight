"use client";

import React, { useState } from "react";
import {
  Link2,
  Plus,
  Smartphone,
  ExternalLink,
  Code2,
  Calendar,
  BookOpen,
  Sparkles,
  Eye,
  BarChart2,
  Share2,
  Globe,
  Check,
} from "lucide-react";
import { useZeroLight } from "../../context";
import { Button } from "../../atoms/button";
import { Switch } from "../../atoms/switch";
import { Badge } from "../../atoms/badge";
import { Avatar } from "../../atoms/avatar";
import { BrandLogoRenderer } from "./brand-logo-renderer";

interface BioLinkItem {
  id: string;
  title: string;
  url: string;
  clicks: number;
  active: boolean;
  iconType?: "book" | "calendar" | "github" | "sparkles" | "globe";
}

const INITIAL_LINKS: BioLinkItem[] = [
  { id: "link-1", title: "Read My Weekly Engineering Dispatch", url: "newsletter.zerolight.io", clicks: 1420, active: true, iconType: "book" },
  { id: "link-2", title: "Book a 1:1 Architecture Review", url: "cal.com/sarahconnor", clicks: 840, active: true, iconType: "calendar" },
  { id: "link-3", title: "Open-Source Design System Repos", url: "github.com/zerolight-os", clicks: 3105, active: true, iconType: "github" },
  { id: "link-4", title: "ZeroLight SaaS Master Blueprint", url: "zerolight.io/blueprint", clicks: 590, active: true, iconType: "sparkles" },
];

export interface LinkInBioSampleProps {
  brandName?: string;
  brandMark?: string;
  brandLogoUrl?: string | null;
  selectedIconMark?: string;
}

export function LinkInBioSample({
  brandName = "ZeroLight",
  brandMark = "ZL",
  brandLogoUrl = null,
  selectedIconMark = "shield",
}: LinkInBioSampleProps) {
  const { tokens, scaled } = useZeroLight();
  const [links, setLinks] = useState<BioLinkItem[]>(INITIAL_LINKS);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const toggleLink = (id: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l))
    );
  };

  const handleAddLink = () => {
    if (!newTitle) return;
    setLinks((prev) => [
      ...prev,
      {
        id: `link-${Date.now()}`,
        title: newTitle,
        url: newUrl || "zerolight.io",
        clicks: 0,
        active: true,
      },
    ]);
    setNewTitle("");
    setNewUrl("");
  };

  const primaryColor = tokens.primaryButtonColor || "#0F172A";
  const primaryTextColor = scaled.primaryActionTextColor || "#FFFFFF";

  return (
    <div
      className="w-full flex flex-col lg:flex-row gap-6 font-sans select-none"
      style={{
        color: tokens.textIconColor,
        fontFamily: scaled.resolvedFontFamily,
      }}
    >
      {/* ── LEFT PANE: LINK MANAGER CONTROLS ── */}
      <div className="flex-1 space-y-4">
        <div
          className="space-y-1 pb-3 border-b"
          style={{ borderColor: tokens.universalBorderColor }}
        >
          <div className="flex items-center gap-2.5">
            <BrandLogoRenderer
              brandLogoUrl={brandLogoUrl}
              selectedIconMark={selectedIconMark}
              brandMark={brandMark}
              size="sm"
            />
            <h2
              className="text-base font-bold tracking-tight"
              style={{
                fontFamily: scaled.resolvedHeadingFontFamily,
                color: tokens.textIconColor,
              }}
            >
              {brandName} Profile Manager
            </h2>
            <Badge variant="neutral" size="sm">Whitelabel Playground</Badge>
          </div>
          <p className="text-xs opacity-75">
            Whitelabel theme stress-test. Changing corner radii from Sharp to Pill dramatically reskins the buttons in real-time.
          </p>
        </div>

        {/* Quick Add Link Box */}
        <div
          className="p-3.5 space-y-3 border"
          style={{
            backgroundColor: tokens.hoverBackplateTint,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            borderRadius: `${scaled.scaledCardRadius}px`,
          }}
        >
          <div className="text-xs font-bold">Add New Destination Link</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Button Label (e.g. Join Community)"
              className="px-2.5 py-1.5 text-xs border focus:outline-none"
              style={{
                backgroundColor: tokens.universalFillColor,
                borderColor: tokens.universalBorderColor,
                borderRadius: `${scaled.scaledRadius}px`,
                color: tokens.textIconColor,
              }}
            />
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Destination URL (e.g. discord.gg/...)"
              className="px-2.5 py-1.5 text-xs border focus:outline-none"
              style={{
                backgroundColor: tokens.universalFillColor,
                borderColor: tokens.universalBorderColor,
                borderRadius: `${scaled.scaledRadius}px`,
                color: tokens.textIconColor,
              }}
            />
          </div>
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="sm"
              iconLeft={<Plus className="w-3.5 h-3.5" />}
              onClick={handleAddLink}
            >
              Add Link
            </Button>
          </div>
        </div>

        {/* Links List with Toggle */}
        <div className="space-y-2">
          {links.map((link) => (
            <div
              key={link.id}
              className="p-3 flex items-center justify-between gap-3 shadow-2xs border transition-shadow"
              style={{
                backgroundColor: tokens.universalFillColor,
                borderColor: tokens.universalBorderColor,
                borderWidth: `${tokens.borderWidth}px`,
                borderRadius: `${scaled.scaledCardRadius}px`,
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: tokens.hoverBackplateTint,
                    borderColor: tokens.universalBorderColor,
                  }}
                >
                  {link.iconType === "github" && <Code2 size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} />}
                  {link.iconType === "calendar" && <Calendar size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} />}
                  {link.iconType === "sparkles" && <Sparkles size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} />}
                  {(!link.iconType || link.iconType === "book") && <BookOpen size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} />}
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold truncate">{link.title}</div>
                  <div className="text-[11px] opacity-60 font-sans tabular-nums truncate">{link.url}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] opacity-60 font-sans tabular-nums hidden sm:inline">
                  {link.clicks} clicks
                </span>
                <Switch
                  checked={link.active}
                  onChange={() => toggleLink(link.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANE: REAL-TIME MOBILE DEVICE PREVIEW ── */}
      <div className="w-full lg:w-72 shrink-0 flex flex-col items-center">
        <div className="text-[11px] font-bold opacity-60 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Live Phone Canvas</span>
        </div>

        {/* Mobile Device Frame */}
        <div
          className="w-68 sm:w-72 rounded-[36px] border-[5px] shadow-xl overflow-hidden p-5 flex flex-col items-center space-y-4"
          style={{
            borderColor: "#0F172A",
            backgroundColor: tokens.universalFillColor,
          }}
        >
          {/* Top Notch / Dynamic Island */}
          <div className="w-20 h-3.5 rounded-full bg-slate-900 mb-1" />

          {/* Profile Header */}
          <div className="flex flex-col items-center text-center space-y-1.5">
            <BrandLogoRenderer
              brandLogoUrl={brandLogoUrl}
              selectedIconMark={selectedIconMark}
              brandMark={brandMark}
              size="lg"
            />
            <div>
              <h3
                className="text-sm font-bold"
                style={{
                  fontFamily: scaled.resolvedHeadingFontFamily,
                  color: tokens.textIconColor,
                }}
              >
                {brandName}
              </h3>
              <p className="text-[11px] opacity-60 font-sans tabular-nums">@{brandName.toLowerCase().replace(/\s+/g, "")} • Verified</p>
            </div>
            <p className="text-[11px] opacity-75 leading-snug px-2">
              Building resilient SaaS design systems and zero-latency web tools.
            </p>
          </div>

          {/* Stack of Custom Link Buttons (Directly Reflects Corner Radii & Accent) */}
          <div className="w-full space-y-2 pt-2">
            {links.filter((l) => l.active).map((link) => (
              <button
                key={link.id}
                type="button"
                className="w-full py-2.5 px-3 text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-2"
                style={{
                  backgroundColor: primaryColor,
                  color: primaryTextColor,
                  borderRadius: `${scaled.scaledRadius}px`,
                  transition: scaled.transitionStyle,
                }}
              >
                <div className="flex items-center gap-2 min-w-0 truncate">
                  {link.iconType === "github" && <Code2 size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} className="shrink-0" />}
                  {link.iconType === "calendar" && <Calendar size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} className="shrink-0" />}
                  {link.iconType === "sparkles" && <Sparkles size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} className="shrink-0" />}
                  {(!link.iconType || link.iconType === "book") && <BookOpen size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} className="shrink-0" />}
                  <span className="truncate pr-1">{link.title}</span>
                </div>
                <ExternalLink size={12} strokeWidth={tokens.iconStrokeWidth || 1.75} className="shrink-0 opacity-80" />
              </button>
            ))}
          </div>

          <div className="pt-2 text-[10px] opacity-60 font-semibold tracking-wider uppercase">
            Powered by {brandName}
          </div>
        </div>
      </div>
    </div>
  );
}
