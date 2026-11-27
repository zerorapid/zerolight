"use client";

import React, { useState } from "react";
import { Webhook, RotateCw, CheckCircle2, XCircle, ChevronDown, ChevronRight } from "lucide-react";
import { useZeroLight } from "../context";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";

export interface WebhookDelivery {
  id: string;
  event: string;
  endpoint: string;
  statusCode: number;
  latencyMs: number;
  timestamp: string;
  payloadJson: string;
}

export interface WebhookInspectorProps {
  deliveries: WebhookDelivery[];
  onReplay?: (deliveryId: string) => void;
  className?: string;
}

/**
 * SaaS developer webhook delivery log & payload inspector with one-click event replay.
 */
export function WebhookInspector({
  deliveries,
  onReplay,
  className = "",
}: WebhookInspectorProps) {
  const { tokens, scaled } = useZeroLight();
  const [expandedId, setExpandedId] = useState<string | null>(deliveries[0]?.id ?? null);
  const [replayedId, setReplayedId] = useState<string | null>(null);

  return (
    <div
      style={{
        backgroundColor: tokens.universalFillColor,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
        borderStyle: "solid",
        borderRadius: `${scaled.scaledCardRadius}px`,
        boxShadow: scaled.cardShadow,
        color: tokens.textIconColor,
        fontFamily: scaled.resolvedFontFamily,
      }}
      className={`overflow-hidden ${className}`}
    >
      <div
        style={{ backgroundColor: tokens.hoverBackplateTint, borderColor: tokens.universalBorderColor }}
        className="flex items-center justify-between px-4 py-3 border-b"
      >
        <div className="flex items-center gap-2">
          <Webhook className="w-4 h-4 opacity-75" />
          <h3 className="text-sm font-semibold">Webhook Deliveries</h3>
        </div>
        <span className="text-xs opacity-60 font-sans tabular-nums">{deliveries.length} events</span>
      </div>

      <div className="divide-y" style={{ borderColor: tokens.universalBorderColor }}>
        {deliveries.map((d) => {
          const ok = d.statusCode >= 200 && d.statusCode < 300;
          const isOpen = expandedId === d.id;
          return (
            <div key={d.id} className="text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : d.id)}
                  className="flex items-center gap-2 text-left min-w-0 cursor-pointer"
                >
                  {isOpen ? <ChevronDown className="w-3.5 h-3.5 opacity-55" /> : <ChevronRight className="w-3.5 h-3.5 opacity-55" />}
                  {ok ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                  <span className="font-semibold truncate">{d.event}</span>
                  <span className="opacity-55 truncate hidden sm:inline">{d.endpoint}</span>
                </button>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={ok ? "healthy" : "critical"} size="xs">
                    HTTP {d.statusCode}
                  </Badge>
                  <span className="opacity-60 font-sans tabular-nums">{d.latencyMs}ms</span>
                  <span className="opacity-55 font-sans tabular-nums hidden md:inline">{d.timestamp}</span>
                  {onReplay && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onReplay(d.id);
                        setReplayedId(d.id);
                        setTimeout(() => setReplayedId(null), 1500);
                      }}
                      iconLeft={<RotateCw className="w-3 h-3" />}
                    >
                      {replayedId === d.id ? "Replayed" : "Replay"}
                    </Button>
                  )}
                </div>
              </div>

              {isOpen && (
                <div className="px-4 pb-3">
                  <pre
                    style={{
                      backgroundColor: tokens.hoverBackplateTint,
                      borderRadius: `${Math.max(4, scaled.scaledOptionRadius)}px`,
                    }}
                    className="p-3 text-[11px] font-mono overflow-x-auto"
                  >
                    {d.payloadJson}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
