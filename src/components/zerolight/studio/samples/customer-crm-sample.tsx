"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Building2,
  Globe,
  Mail,
  Plus,
  ArrowUpDown,
  Tag,
  Activity,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useZeroLight } from "../../context";
import { SearchBar } from "../../molecules/search-bar";
import { Badge } from "../../atoms/badge";
import { Button } from "../../atoms/button";
import { Avatar } from "../../atoms/avatar";
import { BrandLogoRenderer } from "./brand-logo-renderer";

interface CustomerRecord {
  id: string;
  name: string;
  domain: string;
  stage: "enterprise" | "growth" | "pilot" | "churned";
  acv: string;
  contactName: string;
  contactEmail: string;
  region: string;
  health: number;
}

const CUSTOMER_DATA: CustomerRecord[] = [
  {
    id: "cust-1",
    name: "Linear Logistics Inc",
    domain: "linear.app",
    stage: "enterprise",
    acv: "$84,000",
    contactName: "Marcus Vance",
    contactEmail: "marcus@linear.app",
    region: "US-East",
    health: 98,
  },
  {
    id: "cust-2",
    name: "Vercel Systems Corp",
    domain: "vercel.com",
    stage: "enterprise",
    acv: "$120,000",
    contactName: "Elena Rostova",
    contactEmail: "elena@vercel.com",
    region: "EU-West",
    health: 95,
  },
  {
    id: "cust-3",
    name: "Supabase Cloud Labs",
    domain: "supabase.io",
    stage: "growth",
    acv: "$42,500",
    contactName: "David Kim",
    contactEmail: "dkim@supabase.io",
    region: "US-West",
    health: 91,
  },
  {
    id: "cust-4",
    name: "Raycast Technologies",
    domain: "raycast.com",
    stage: "growth",
    acv: "$36,000",
    contactName: "Sarah Connor",
    contactEmail: "sarah@raycast.com",
    region: "EU-Central",
    health: 88,
  },
  {
    id: "cust-5",
    name: "Stripe Billing Enclave",
    domain: "stripe.com",
    stage: "pilot",
    acv: "$18,000",
    contactName: "Alex Chen",
    contactEmail: "alex@stripe.com",
    region: "US-East",
    health: 82,
  },
  {
    id: "cust-6",
    name: "Retool Internal Tools",
    domain: "retool.com",
    stage: "enterprise",
    acv: "$96,000",
    contactName: "Jordan Hayes",
    contactEmail: "jordan@retool.com",
    region: "APAC",
    health: 96,
  },
];

export interface CustomerCrmSampleProps {
  brandName?: string;
  brandMark?: string;
  brandLogoUrl?: string | null;
  selectedIconMark?: string;
}

export function CustomerCrmSample({
  brandName = "ZeroLight",
  brandMark = "ZL",
  brandLogoUrl = null,
  selectedIconMark = "shield",
}: CustomerCrmSampleProps) {
  const { tokens, scaled } = useZeroLight();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(["cust-1", "cust-2"]);

  const isCompact = (tokens.heightDensity ?? 44) <= 40;
  const isSpacious = (tokens.heightDensity ?? 44) >= 48;
  const cellPadding = isCompact ? "py-1.5 px-3" : isSpacious ? "py-3 px-3" : "py-2.5 px-3";

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === CUSTOMER_DATA.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(CUSTOMER_DATA.map((c) => c.id));
    }
  };

  const filtered = CUSTOMER_DATA.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="w-full flex flex-col space-y-4 font-sans select-none"
      style={{
        color: tokens.textIconColor,
        fontFamily: scaled.resolvedFontFamily,
      }}
    >
      {/* ── TOP ACTION & FILTER BAR ── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b"
        style={{ borderColor: tokens.universalBorderColor }}
      >
        <div className="space-y-0.5">
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
              {brandName} Customer Directory CRM
            </h2>
            <Badge variant="neutral" size="sm">
              {filtered.length} Accounts
            </Badge>
          </div>
          <p className="text-xs opacity-75">
            Information architecture, 1px hairlines, and hover backplate tint test-bench.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-48 sm:w-56">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search accounts..."
            />
          </div>
          <Button variant="outline" size="sm" iconLeft={<Download size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} />}>
            Export TSV
          </Button>
          <Button variant="primary" size="sm" iconLeft={<Plus size={13} strokeWidth={tokens.iconStrokeWidth || 2} />}>
            Add Account
          </Button>
        </div>
      </div>

      {/* ── HIGH DENSITY ENTERPRISE TABLE ── */}
      <div
        className="border overflow-hidden"
        style={{
          backgroundColor: tokens.universalFillColor,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          borderRadius: `${scaled.scaledCardRadius}px`,
          boxShadow: scaled.cardShadow,
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                className="border-b font-semibold opacity-80"
                style={{
                  backgroundColor: tokens.hoverBackplateTint,
                  borderColor: tokens.universalBorderColor,
                }}
              >
                <th className={`${cellPadding} w-10 text-center`}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === CUSTOMER_DATA.length}
                    onChange={toggleSelectAll}
                    className="cursor-pointer"
                  />
                </th>
                <th className={cellPadding}>
                  <div className="flex items-center gap-1.5">
                    <Building2 size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} className="opacity-60" />
                    <span>Company &amp; Domain</span>
                  </div>
                </th>
                <th className={cellPadding}>
                  <div className="flex items-center gap-1.5">
                    <Tag size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} className="opacity-60" />
                    <span>Lifecycle Stage</span>
                  </div>
                </th>
                <th className={cellPadding}>
                  <div className="flex items-center gap-1.5">
                    <ArrowUpDown size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} className="opacity-60" />
                    <span>Committed ACV</span>
                  </div>
                </th>
                <th className={cellPadding}>
                  <div className="flex items-center gap-1.5">
                    <Mail size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} className="opacity-60" />
                    <span>Primary Contact</span>
                  </div>
                </th>
                <th className={cellPadding}>
                  <div className="flex items-center gap-1.5">
                    <Globe size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} className="opacity-60" />
                    <span>Region</span>
                  </div>
                </th>
                <th className={cellPadding}>
                  <div className="flex items-center gap-1.5">
                    <Activity size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} className="opacity-60" />
                    <span>Health Score</span>
                  </div>
                </th>
                <th className={`${cellPadding} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: tokens.universalBorderColor }}
            >
              {filtered.map((cust) => {
                const isSelected = selectedIds.includes(cust.id);
                return (
                  <tr
                    key={cust.id}
                    onClick={() => toggleSelect(cust.id)}
                    className="transition-colors cursor-pointer"
                    style={{
                      backgroundColor: isSelected ? tokens.hoverBackplateTint : "transparent",
                    }}
                  >
                    <td className={`${cellPadding} text-center`} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(cust.id)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className={cellPadding}>
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={cust.name.slice(0, 2).toUpperCase()} size="sm" />
                        <div>
                          <div className="font-semibold">{cust.name}</div>
                          <div className="text-[11px] opacity-60 font-sans tabular-nums">{cust.domain}</div>
                        </div>
                      </div>
                    </td>
                    <td className={cellPadding}>
                      <span
                        className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: cust.stage === "enterprise" ? tokens.primaryButtonColor : tokens.hoverBackplateTint,
                          color: cust.stage === "enterprise" ? scaled.primaryActionTextColor : tokens.textIconColor,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          borderRadius: `${scaled.scaledRadius}px`,
                        }}
                      >
                        {cust.stage}
                      </span>
                    </td>
                    <td className={`${cellPadding} font-semibold font-sans tabular-nums`}>
                      {cust.acv}
                    </td>
                    <td className={cellPadding}>
                      <div>
                        <div>{cust.contactName}</div>
                        <div className="text-[11px] opacity-60">{cust.contactEmail}</div>
                      </div>
                    </td>
                    <td className={`${cellPadding} opacity-75 font-sans tabular-nums`}>
                      {cust.region}
                    </td>
                    <td className={`${cellPadding} font-sans tabular-nums`}>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-12 h-1.5 rounded-full overflow-hidden"
                          style={{ backgroundColor: tokens.hoverBackplateTint }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${cust.health}%`,
                              backgroundColor: cust.health >= 90 ? "#10B981" : "#F59E0B",
                            }}
                          />
                        </div>
                        <span className="text-[11px] font-bold">{cust.health}%</span>
                      </div>
                    </td>
                    <td className={`${cellPadding} text-right`} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="p-1 rounded opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination */}
        <div
          className="p-3 border-t flex items-center justify-between text-xs opacity-75"
          style={{
            backgroundColor: tokens.hoverBackplateTint,
            borderColor: tokens.universalBorderColor,
          }}
        >
          <span>
            Showing <strong className="font-sans tabular-nums">{filtered.length}</strong> of{" "}
            <strong className="font-sans tabular-nums">42</strong> accounts
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="px-2.5 py-1 border opacity-40 text-xs cursor-not-allowed"
              style={{
                borderColor: tokens.universalBorderColor,
                borderRadius: `${scaled.scaledRadius}px`,
              }}
            >
              Previous
            </button>
            <button
              type="button"
              className="px-2.5 py-1 border text-xs font-semibold cursor-pointer shadow-2xs"
              style={{
                backgroundColor: tokens.universalFillColor,
                borderColor: tokens.universalBorderColor,
                borderRadius: `${scaled.scaledRadius}px`,
                color: tokens.textIconColor,
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
