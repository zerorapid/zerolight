"use client";

import React, { useState } from "react";
import { GitCompare, Copy, Check } from "lucide-react";
import { useZeroLight } from "../context";
import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";

export interface CodeDiffLine {
  type: "context" | "add" | "remove";
  content: string;
  oldLine?: number;
  newLine?: number;
}

export interface CodeDiffViewerProps {
  filePath: string;
  lines: CodeDiffLine[];
  onAccept?: () => void;
  onReject?: () => void;
  className?: string;
}

/**
 * AI & Developer code diff viewer with line numbers, addition/deletion counts,
 * copy action, and optional accept/reject controls.
 */
export function CodeDiffViewer({
  filePath,
  lines,
  onAccept,
  onReject,
  className = "",
}: CodeDiffViewerProps) {
  const { tokens, scaled } = useZeroLight();
  const [copied, setCopied] = useState(false);

  const added = lines.filter((l) => l.type === "add").length;
  const removed = lines.filter((l) => l.type === "remove").length;

  const handleCopy = () => {
    navigator.clipboard?.writeText(lines.map((l) => l.content).join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

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
        className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b"
      >
        <div className="flex items-center gap-2 min-w-0">
          <GitCompare className="w-4 h-4 opacity-75 shrink-0" />
          <span className="text-xs font-semibold truncate">{filePath}</span>
          <Badge variant="healthy" size="xs">+{added}</Badge>
          <Badge variant="critical" size="xs">-{removed}</Badge>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            iconLeft={copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
          {onReject && (
            <Button variant="outline" size="sm" onClick={onReject}>
              Reject
            </Button>
          )}
          {onAccept && (
            <Button variant="primary" size="sm" onClick={onAccept}>
              Apply Diff
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto text-xs font-mono">
        {lines.map((line, idx) => {
          const bg =
            line.type === "add"
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : line.type === "remove"
              ? "bg-red-500/10 text-red-700 dark:text-red-300"
              : "";
          const prefix = line.type === "add" ? "+" : line.type === "remove" ? "-" : " ";
          return (
            <div key={idx} className={`flex items-start px-3 py-0.5 ${bg}`}>
              <span className="w-8 shrink-0 text-right pr-2 opacity-45 select-none tabular-nums">
                {line.oldLine ?? ""}
              </span>
              <span className="w-8 shrink-0 text-right pr-2 opacity-45 select-none tabular-nums">
                {line.newLine ?? ""}
              </span>
              <span className="w-4 shrink-0 select-none font-bold">{prefix}</span>
              <pre className="whitespace-pre flex-1">{line.content}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
