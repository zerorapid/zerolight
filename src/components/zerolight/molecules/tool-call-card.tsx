"use client";

import React, { useState } from "react";
import { Terminal, CheckCircle2, AlertCircle, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { useZeroLight } from "../context";
import { Badge } from "../atoms/badge";

export interface ToolCallCardProps {
  toolName: string;
  status: "running" | "success" | "error";
  durationMs?: number;
  argumentsJson?: string;
  resultText?: string;
  defaultExpanded?: boolean;
  className?: string;
}

/**
 * Collapsible AI tool execution card displaying tool name, status, latency,
 * input arguments, and structured output.
 */
export function ToolCallCard({
  toolName,
  status,
  durationMs,
  argumentsJson,
  resultText,
  defaultExpanded = false,
  className = "",
}: ToolCallCardProps) {
  const { tokens, scaled } = useZeroLight();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const StatusIcon =
    status === "running" ? Loader2 : status === "success" ? CheckCircle2 : AlertCircle;
  const badgeVariant =
    status === "running" ? "syncing" : status === "success" ? "healthy" : "critical";

  return (
    <div
      style={{
        backgroundColor: tokens.universalFillColor,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
        borderStyle: "solid",
        borderRadius: `${scaled.scaledRadius}px`,
        color: tokens.textIconColor,
        fontFamily: scaled.resolvedFontFamily,
      }}
      className={`overflow-hidden ${className}`}
    >
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        style={{ backgroundColor: tokens.hoverBackplateTint }}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left cursor-pointer"
      >
        <div className="flex items-center gap-2 min-w-0">
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
          )}
          <Terminal className="w-3.5 h-3.5 opacity-75 shrink-0" />
          <span className="text-xs font-semibold truncate">{toolName}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {durationMs !== undefined && (
            <span className="text-[11px] opacity-60 font-sans tabular-nums">{durationMs}ms</span>
          )}
          <Badge variant={badgeVariant} size="xs">
            <StatusIcon className={`w-3 h-3 mr-1 inline ${status === "running" ? "animate-spin" : ""}`} />
            {status}
          </Badge>
        </div>
      </button>

      {expanded && (argumentsJson || resultText) && (
        <div className="p-3 space-y-2.5 border-t text-xs" style={{ borderColor: tokens.universalBorderColor }}>
          {argumentsJson && (
            <div className="space-y-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider opacity-55">
                Arguments
              </div>
              <pre
                style={{
                  backgroundColor: tokens.hoverBackplateTint,
                  borderRadius: `${Math.max(4, scaled.scaledOptionRadius)}px`,
                }}
                className="p-2 text-[11px] overflow-x-auto font-mono"
              >
                {argumentsJson}
              </pre>
            </div>
          )}
          {resultText && (
            <div className="space-y-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider opacity-55">
                Result
              </div>
              <pre
                style={{
                  backgroundColor: tokens.hoverBackplateTint,
                  borderRadius: `${Math.max(4, scaled.scaledOptionRadius)}px`,
                }}
                className="p-2 text-[11px] overflow-x-auto font-mono whitespace-pre-wrap"
              >
                {resultText}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
