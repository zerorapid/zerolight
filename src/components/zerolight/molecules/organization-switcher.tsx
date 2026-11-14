"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown, Plus, Building2, ShieldCheck, Sparkles } from "lucide-react";
import { useZeroLight } from "../context";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  tier: "Free" | "Pro" | "Enterprise";
  role: "Owner" | "Admin" | "Member";
  active?: boolean;
}

export interface OrganizationSwitcherProps {
  organizations?: Organization[];
  activeOrgId?: string;
  onSelectOrg?: (org: Organization) => void;
  onCreateOrg?: () => void;
  className?: string;
}

const DEFAULT_ORGS: Organization[] = [
  { id: "org_zerorapid", name: "ZeroRapid Core", slug: "zerorapid", tier: "Enterprise", role: "Owner", active: true },
  { id: "org_fintech_labs", name: "FinTech Labs", slug: "fintech-labs", tier: "Pro", role: "Admin" },
  { id: "org_acme_dev", name: "Acme Cloud Dev", slug: "acme-dev", tier: "Free", role: "Member" },
];

export function OrganizationSwitcher({
  organizations = DEFAULT_ORGS,
  activeOrgId,
  onSelectOrg,
  onCreateOrg,
  className = "",
}: OrganizationSwitcherProps) {
  const { tokens, scaled } = useZeroLight();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(activeOrgId || organizations.find((o) => o.active)?.id || organizations[0]?.id || "");

  const activeOrg = organizations.find((o) => o.id === selectedId) || organizations[0];

  const primaryColor = scaled.chartPrimaryColor || tokens.primaryButtonColor || "#10B981";
  const borderColor = tokens.universalBorderColor || "#E4E4E7";
  const surfaceColor = tokens.universalFillColor || "#FFFFFF";
  const textColor = tokens.textIconColor || "#18181B";

  return (
    <div className={`relative inline-block text-left ${className}`} data-testid="zerolight-org-switcher">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          borderRadius: `${Math.max(6, scaled.scaledRadius)}px`,
          borderColor,
          borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
          backgroundColor: surfaceColor,
          color: textColor,
          fontFamily: scaled.resolvedFontFamily,
        }}
        className="flex items-center justify-between gap-3 px-3 py-2 text-xs font-medium border shadow-xs hover:opacity-90 transition-all cursor-pointer min-w-[200px]"
      >
        <div className="flex items-center gap-2 truncate">
          <div
            style={{
              borderRadius: `${Math.max(4, scaled.scaledOptionRadius)}px`,
              backgroundColor: tokens.hoverBackplateTint || "rgba(0,0,0,0.04)",
              color: primaryColor,
            }}
            className="w-6 h-6 flex items-center justify-center shrink-0 border border-current/10"
          >
            <Building2 size={13} />
          </div>
          <div className="flex flex-col text-left truncate">
            <span className="font-semibold truncate leading-tight">{activeOrg?.name}</span>
            <span className="text-[10px] opacity-60 leading-tight uppercase tracking-wider">{activeOrg?.tier} • {activeOrg?.role}</span>
          </div>
        </div>
        <ChevronsUpDown size={14} className="opacity-50 shrink-0" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            style={{
              borderRadius: `${scaled.scaledCardRadius}px`,
              borderColor,
              borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
              backgroundColor: surfaceColor,
              color: textColor,
              boxShadow: scaled.cardShadow,
              fontFamily: scaled.resolvedFontFamily,
            }}
            className="absolute left-0 mt-1 w-64 z-50 py-1.5 border overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider opacity-50 font-semibold">
              Workspaces & Tenants
            </div>

            <div className="space-y-0.5 px-1">
              {organizations.map((org) => {
                const isSelected = org.id === activeOrg?.id;
                return (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(org.id);
                      setIsOpen(false);
                      onSelectOrg?.(org);
                    }}
                    style={{
                      borderRadius: `${Math.max(4, scaled.scaledOptionRadius)}px`,
                      backgroundColor: isSelected ? tokens.hoverBackplateTint : "transparent",
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 text-xs text-left hover:opacity-90 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Building2 size={14} className="opacity-60 shrink-0" />
                      <div className="truncate">
                        <div className="font-medium truncate">{org.name}</div>
                        <div className="text-[10px] opacity-50 capitalize">{org.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {org.tier === "Enterprise" && (
                        <span
                          style={{
                            backgroundColor: `${primaryColor}15`,
                            color: primaryColor,
                          }}
                          className="px-1.5 py-0.5 rounded text-[9px] font-semibold flex items-center gap-1"
                        >
                          <ShieldCheck size={10} />
                          ENT
                        </span>
                      )}
                      {isSelected && <Check size={14} style={{ color: primaryColor }} />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ borderColor }} className="border-t my-1" />

            <div className="px-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onCreateOrg?.();
                }}
                style={{
                  borderRadius: `${Math.max(4, scaled.scaledOptionRadius)}px`,
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-left opacity-75 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Plus size={13} />
                <span>Create new organization</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
