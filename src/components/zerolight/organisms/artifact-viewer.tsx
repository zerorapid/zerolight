"use client";

import React, { useState } from "react";
import { FileCode2, Copy, Check, Download } from "lucide-react";
import { useZeroLight } from "../context";
import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";

export interface ArtifactViewerProps {
  title: string;
  artifactType?: "code" | "document" | "json" | "spec";
  content: string;
  previewNode?: React.ReactNode;
  onDownload?: () => void;
  className?: string;
}

/**
 * AI-generated deliverable viewer with Preview / Source toggle, copy, and download.
 */
export function ArtifactViewer({
  title,
  artifactType = "code",
  content,
  previewNode,
  onDownload,
  className = "",
}: ArtifactViewerProps) {
  const { tokens, scaled } = useZeroLight();
  const [mode, setMode] = useState<"preview" | "source">(previewNode ? "preview" : "source");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(content);
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
          <FileCode2 className="w-4 h-4 opacity-75 shrink-0" />
          <h3 className="text-xs font-semibold truncate">{title}</h3>
          <Badge variant="healthy" size="xs">{artifactType}</Badge>
        </div>

        <div className="flex items-center gap-1.5">
          {previewNode && (
            <div
              style={{ borderColor: tokens.universalBorderColor, borderRadius: `${scaled.scaledRadius}px` }}
              className="inline-flex border p-0.5 text-[11px]"
            >
              <button
                type="button"
                onClick={() => setMode("preview")}
                className={`px-2 py-0.5 rounded cursor-pointer ${mode === "preview" ? "font-semibold opacity-100" : "opacity-60"}`}
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => setMode("source")}
                className={`px-2 py-0.5 rounded cursor-pointer ${mode === "source" ? "font-semibold opacity-100" : "opacity-60"}`}
              >
                Source
              </button>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            iconLeft={copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
          {onDownload && (
            <Button variant="outline" size="sm" onClick={onDownload} iconLeft={<Download className="w-3.5 h-3.5" />}>
              Export
            </Button>
          )}
        </div>
      </div>

      {mode === "preview" && previewNode ? (
        <div className="p-4">{previewNode}</div>
      ) : (
        <pre className="p-4 text-xs font-mono overflow-x-auto max-h-96 whitespace-pre-wrap leading-relaxed">
          {content}
        </pre>
      )}
    </div>
  );
}
