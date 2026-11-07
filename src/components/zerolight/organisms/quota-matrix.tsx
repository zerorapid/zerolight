"use client";

import React from "react";
import { useZeroLight } from "../context";
import { Cpu, Database, Globe, Zap, AlertTriangle } from "lucide-react";
import { ProgressBar } from "../atoms/progress-bar";
import { Button } from "../atoms/button";

export interface QuotaItem {
  id: string;
  name: string;
  current: number;
  limit: number;
  unit: string;
  icon: React.ReactNode;
  warning?: boolean;
}

const DEFAULT_QUOTAS: QuotaItem[] = [
  { id: "q1", name: "Virtual vCPUs", current: 48, limit: 64, unit: "Cores", icon: <Cpu className="w-4 h-4 text-neutral-500" />, warning: false },
  { id: "q2", name: "Cluster Memory", current: 196, limit: 256, unit: "GB", icon: <Database className="w-4 h-4 text-neutral-500" />, warning: false },
  { id: "q3", name: "Network Egress", current: 8.9, limit: 10, unit: "TB", icon: <Globe className="w-4 h-4 text-amber-500" />, warning: true },
  { id: "q4", name: "API Rate Budget", current: 8500, limit: 10000, unit: "Req/s", icon: <Zap className="w-4 h-4 text-amber-500" />, warning: true },
];

export interface QuotaMatrixProps {
  quotas?: QuotaItem[];
  onRequestIncrease?: () => void;
  className?: string;
}

export function QuotaMatrix({
  quotas = DEFAULT_QUOTAS,
  onRequestIncrease,
  className = "",
}: QuotaMatrixProps) {
  const { tokens, scaled } = useZeroLight();

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledCardRadius}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: tokens.universalFillColor,
      }}
      className={`p-6 border space-y-5 select-none w-full ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div>
          <h4 style={{ color: tokens.textIconColor }} className="text-sm font-semibold">
            Tenant Resource Quotas &amp; Allocation
          </h4>
          <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
            Real-time infrastructure capacity consumption with threshold alerts.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={onRequestIncrease}>
          Request Quota Increase
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quotas.map((q) => {
          const pct = Math.round((q.current / q.limit) * 100);
          return (
            <div
              key={q.id}
              style={{
                borderRadius: `${scaled.scaledRadius}px`,
                borderColor: q.warning ? "#FDE68A" : tokens.universalBorderColor,
                backgroundColor: q.warning ? "#FFFDF5" : tokens.hoverBackplateTint,
                borderWidth: `${tokens.borderWidth}px`,
              }}
              className="p-4 border space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {q.icon}
                  <span style={{ color: tokens.textIconColor }} className="text-xs font-semibold">
                    {q.name}
                  </span>
                </div>
                {q.warning && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span>Near limit</span>
                  </span>
                )}
              </div>

              <ProgressBar value={pct} max={100} showValue={false} />

              <div className="flex items-baseline justify-between text-xs">
                <span className="text-neutral-500">
                  <strong className="text-neutral-900 font-bold tabular-nums">
                    {q.current}
                  </strong>{" "}
                  / {q.limit} {q.unit}
                </span>
                <span className="font-bold tabular-nums text-neutral-700">
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
