"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { ShieldCheck, ArrowRight, User, Terminal } from "lucide-react";
import { Badge } from "../atoms/badge";
import { Avatar } from "../atoms/avatar";

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: { name: string; email: string; initials: string };
  action: string;
  resource: string;
  severity: "healthy" | "critical" | "syncing" | "degraded";
  details?: string;
}

const DEFAULT_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "evt-101",
    timestamp: "14:48:22 UTC",
    actor: { name: "Sarah Chen", email: "schen@enterprise.io", initials: "SC" },
    action: "Scaled worker pool nodes",
    resource: "pool-us-east-1 (4 → 8 instances)",
    severity: "healthy",
    details: "Automated autoscaling triggered by API gateway ingress spike > 8,500 req/sec.",
  },
  {
    id: "evt-102",
    timestamp: "13:12:05 UTC",
    actor: { name: "DevOps Bot", email: "automation@infra.internal", initials: "DB" },
    action: "Rotated mTLS ingress certificate",
    resource: "ingress-edge-gateway-04",
    severity: "syncing",
    details: "Automated 90-day cryptographic cert rotation completed with zero connection drops.",
  },
  {
    id: "evt-103",
    timestamp: "11:05:40 UTC",
    actor: { name: "Alex Rivera", email: "arivera@enterprise.io", initials: "AR" },
    action: "Terminated degraded Redis cache node",
    resource: "ap-south-cache-02",
    severity: "critical",
    details: "Manual operator decommissioning following memory pressure threshold (89% / 15.1 GB).",
  },
];

export interface AuditLogProps {
  events?: AuditEvent[];
  className?: string;
}

export function AuditLog({
  events = DEFAULT_AUDIT_EVENTS,
  className = "",
}: AuditLogProps) {
  const { tokens, scaled } = useZeroLight();
  const [expandedId, setExpandedId] = useState<string | null>("evt-101");

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledCardRadius}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: tokens.universalFillColor,
      }}
      className={`border overflow-hidden divide-y divide-neutral-100 select-none w-full ${className}`}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: tokens.hoverBackplateTint,
          borderColor: tokens.universalBorderColor,
          borderBottomWidth: `${tokens.borderWidth}px`,
        }}
        className="p-4 border-b flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span style={{ color: tokens.textIconColor }} className="text-xs font-semibold">
            Compliance &amp; Operational Audit Feed
          </span>
        </div>
        <span className="text-[11px] text-neutral-400 font-medium tabular-nums">
          Immutable SOC2 Log • 24h Horizon
        </span>
      </div>

      {/* Events List */}
      <div className="divide-y divide-neutral-100">
        {events.map((evt) => {
          const isExpanded = expandedId === evt.id;
          return (
            <div
              key={evt.id}
              className="p-4 hover:bg-neutral-50/60 transition-colors cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : evt.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Avatar initials={evt.actor.initials} size="sm" status="online" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span style={{ color: tokens.textIconColor }} className="font-semibold text-xs">
                        {evt.actor.name}
                      </span>
                      <span className="text-[11px] text-neutral-400">{evt.action}</span>
                    </div>
                    <div className="text-xs text-neutral-600 font-medium tabular-nums mt-0.5">
                      {evt.resource}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={evt.severity}>
                    {evt.severity.toUpperCase()}
                  </Badge>
                  <span className="text-[11px] text-neutral-400 font-medium tabular-nums">
                    {evt.timestamp}
                  </span>
                </div>
              </div>

              {isExpanded && evt.details && (
                <div
                  style={{
                    borderRadius: `${scaled.scaledInnerRadius === 0 ? 0 : 6}px`,
                    backgroundColor: tokens.hoverBackplateTint,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                  }}
                  className="mt-3 p-3 text-xs text-neutral-600 border space-y-1.5"
                >
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                    <Terminal className="w-3 h-3" />
                    <span>Audit Metadata &amp; Justification</span>
                  </div>
                  <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="leading-relaxed">
                    {evt.details}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
