"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import {
  Building2,
  ShieldCheck,
  Users,
  Database,
  ChevronDown,
  Lock,
  Globe,
  Plus,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "../atoms/badge";
import { ProgressBar } from "../atoms/progress-bar";

export interface TenantOrganization {
  id: string;
  name: string;
  slug: string;
  tier: "Starter" | "Growth" | "Enterprise" | "Sovereign";
  region: string;
  isolation: "Logical" | "Schema-Isolated" | "Dedicated VPC";
  seatsUsed: number;
  seatsLimit: number;
  apiRequestsUsed: string;
  apiRequestsLimit: string;
  compliance: string[];
}

export interface TenantKitProps {
  tenants?: TenantOrganization[];
  activeTenantId?: string;
  onSelectTenant?: (tenantId: string) => void;
  onInviteMember?: (tenantId: string) => void;
  onUpgradeTier?: (tenantId: string) => void;
  className?: string;
}

const DEFAULT_TENANTS: TenantOrganization[] = [
  {
    id: "tenant-acme",
    name: "Acme Aerospace",
    slug: "acme-aero",
    tier: "Enterprise",
    region: "us-east-1 (N. Virginia)",
    isolation: "Dedicated VPC",
    seatsUsed: 42,
    seatsLimit: 50,
    apiRequestsUsed: "842K",
    apiRequestsLimit: "1.0M",
    compliance: ["SOC2 Type II", "HIPAA", "ISO 27001"],
  },
  {
    id: "tenant-vortex",
    name: "Vortex Labs Europe",
    slug: "vortex-eu",
    tier: "Growth",
    region: "eu-central-1 (Frankfurt)",
    isolation: "Schema-Isolated",
    seatsUsed: 14,
    seatsLimit: 20,
    apiRequestsUsed: "310K",
    apiRequestsLimit: "500K",
    compliance: ["GDPR", "SOC2"],
  },
  {
    id: "tenant-tokyo",
    name: "Nippon Edge Sovereign",
    slug: "nippon-sovereign",
    tier: "Sovereign",
    region: "ap-northeast-1 (Tokyo)",
    isolation: "Dedicated VPC",
    seatsUsed: 88,
    seatsLimit: 100,
    apiRequestsUsed: "2.4M",
    apiRequestsLimit: "5.0M",
    compliance: ["ISMAP", "APPI", "ISO 27001"],
  },
];

export function TenantKit({
  tenants = DEFAULT_TENANTS,
  activeTenantId = "tenant-acme",
  onSelectTenant,
  onInviteMember,
  onUpgradeTier,
  className = "",
}: TenantKitProps) {
  const { tokens, scaled } = useZeroLight();
  const [selectedId, setSelectedId] = useState<string>(activeTenantId);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const activeTenant = tenants.find((t) => t.id === selectedId) || tenants[0];
  const seatPercentage = Math.round((activeTenant.seatsUsed / activeTenant.seatsLimit) * 100);

  return (
    <div
      data-testid="zerolight-tenant-kit"
      style={{
        borderRadius: `${scaled.scaledCardRadius}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: tokens.universalFillColor,
        boxShadow: scaled.cardShadow,
        color: tokens.textIconColor,
        fontFamily: scaled.resolvedFontFamily,
      }}
      className={`border overflow-hidden p-5 space-y-5 ${className}`}
    >
      {/* Header: Tenant Selector & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            style={{
              borderRadius: `${scaled.scaledRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.hoverBackplateTint,
            }}
            className="flex items-center gap-3 px-3.5 py-2 border hover:bg-neutral-100/80 transition-colors text-left cursor-pointer"
          >
            <div
              style={{
                borderRadius: `${scaled.scaledInnerRadius}px`,
                backgroundColor: tokens.primaryButtonColor,
                color: scaled.primaryActionTextColor,
              }}
              className="w-7 h-7 flex items-center justify-center shrink-0 font-bold text-xs"
            >
              {activeTenant.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{activeTenant.name}</span>
                <Badge variant={activeTenant.tier === "Enterprise" || activeTenant.tier === "Sovereign" ? "healthy" : "neutral"}>
                  {activeTenant.tier}
                </Badge>
              </div>
              <p className="text-[11px] text-neutral-500 font-medium">{activeTenant.slug}.saas.internal</p>
            </div>
            <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0 ml-1" />
          </button>

          {dropdownOpen && (
            <div
              style={{
                borderRadius: `${scaled.scaledRadius}px`,
                borderColor: tokens.universalBorderColor,
                borderWidth: `${tokens.borderWidth}px`,
                backgroundColor: tokens.universalFillColor,
                boxShadow: scaled.cardShadow,
              }}
              className="absolute left-0 top-full mt-2 w-72 z-20 border py-1.5 shadow-lg"
            >
              <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Switch Micro-Tenant
              </div>
              {tenants.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(t.id);
                    onSelectTenant?.(t.id);
                    setDropdownOpen(false);
                  }}
                  style={{
                    backgroundColor: t.id === selectedId ? tokens.hoverBackplateTint : "transparent",
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-neutral-50 cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-neutral-400" />
                    <div>
                      <div className="font-semibold text-neutral-800">{t.name}</div>
                      <div className="text-[10px] text-neutral-400">{t.region}</div>
                    </div>
                  </div>
                  <Badge variant={t.id === selectedId ? "healthy" : "neutral"}>
                    {t.tier}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Security & Isolation Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            style={{
              borderRadius: `${scaled.scaledPillRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.hoverBackplateTint,
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 border text-xs font-medium text-neutral-700"
          >
            <Lock className="w-3.5 h-3.5 text-neutral-500" />
            <span>{activeTenant.isolation}</span>
          </div>
          <div
            style={{
              borderRadius: `${scaled.scaledPillRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.hoverBackplateTint,
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 border text-xs font-medium text-neutral-700"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-500" />
            <span>{activeTenant.region}</span>
          </div>
        </div>
      </div>

      {/* Resource Allocation & Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Seats Usage Card */}
        <div
          style={{
            borderRadius: `${scaled.scaledRadius}px`,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            backgroundColor: tokens.hoverBackplateTint,
          }}
          className="p-3.5 border space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5" />
              Allocated Seats
            </span>
            <span className="tabular-nums font-semibold text-neutral-900">{seatPercentage}%</span>
          </div>
          <div className="text-xl font-bold tabular-nums text-neutral-900">
            {activeTenant.seatsUsed} <span className="text-xs font-normal text-neutral-400">/ {activeTenant.seatsLimit}</span>
          </div>
          <ProgressBar value={seatPercentage} showValue={false} />
        </div>

        {/* Monthly Ingestion Card */}
        <div
          style={{
            borderRadius: `${scaled.scaledRadius}px`,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            backgroundColor: tokens.hoverBackplateTint,
          }}
          className="p-3.5 border space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="flex items-center gap-1.5 font-medium">
              <Database className="w-3.5 h-3.5" />
              API Operations
            </span>
            <span className="tabular-nums font-semibold text-emerald-600">Within Quota</span>
          </div>
          <div className="text-xl font-bold tabular-nums text-neutral-900">
            {activeTenant.apiRequestsUsed} <span className="text-xs font-normal text-neutral-400">/ {activeTenant.apiRequestsLimit}</span>
          </div>
          <ProgressBar value={84} showValue={false} />
        </div>

        {/* Sovereign Security & Compliance Card */}
        <div
          style={{
            borderRadius: `${scaled.scaledRadius}px`,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            backgroundColor: tokens.hoverBackplateTint,
          }}
          className="p-3.5 border space-y-2 flex flex-col justify-between"
        >
          <div className="text-xs text-neutral-500 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Active Certifications
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeTenant.compliance.map((cert) => (
              <span
                key={cert}
                style={{
                  borderRadius: `${scaled.scaledPillRadius}px`,
                  backgroundColor: tokens.universalFillColor,
                  borderColor: tokens.universalBorderColor,
                  borderWidth: `${tokens.borderWidth}px`,
                }}
                className="px-2 py-0.5 text-[10px] font-semibold border text-neutral-700"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Controls: Invite & Upgrade */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100">
        <p className="text-xs text-neutral-500">
          Managed by ZeroLight Micro-Tenant Controller · Zero shared memory leaks
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onInviteMember?.(activeTenant.id)}
            style={{
              borderRadius: `${scaled.scaledRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.universalFillColor,
              color: tokens.textIconColor,
              fontSize: `${scaled.scaledFontSize}px`,
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border font-medium hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Invite Seat</span>
          </button>
          <button
            type="button"
            onClick={() => onUpgradeTier?.(activeTenant.id)}
            style={{
              borderRadius: `${scaled.scaledRadius}px`,
              backgroundColor: tokens.primaryButtonColor,
              color: scaled.primaryActionTextColor,
              fontSize: `${scaled.scaledFontSize}px`,
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scale Tenant</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TenantKit;
