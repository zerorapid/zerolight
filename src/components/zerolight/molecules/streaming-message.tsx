"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check, ExternalLink } from "lucide-react";
import { useZeroLight } from "../context";
import { Badge } from "../atoms/badge";

export interface StreamingCitation {
  id: string;
  label: string;
  href?: string;
}

export interface StreamingMessageProps {
  content: string;
  isStreaming?: boolean;
  modelName?: string;
  citations?: StreamingCitation[];
  timestamp?: string;
  onCopy?: () => void;
  className?: string;
}

/**
 * Incremental AI response bubble with live streaming indicator, model badge,
 * source citations, and copy trigger.
 */
export function StreamingMessage({
  content,
  isStreaming = false,
  modelName = "ZeroLight AI",
  citations = [],
  timestamp,
  onCopy,
  className = "",
}: StreamingMessageProps) {
  const { tokens, scaled } = useZeroLight();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(content);
    setCopied(true);
    onCopy?.();
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
        color: tokens.textIconColor,
        fontFamily: scaled.resolvedFontFamily,
      }}
      className={`p-4 space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 opacity-75" />
          <span className="text-xs font-semibold">{modelName}</span>
          {isStreaming && (
            <Badge variant="syncing" size="xs">
              Streaming
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {timestamp && (
            <span className="text-[11px] opacity-55 font-sans tabular-nums">{timestamp}</span>
          )}
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy response"
            className="p-1 rounded opacity-60 hover:opacity-100 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        {content}
        {isStreaming && (
          <span
            style={{ backgroundColor: tokens.primaryButtonColor }}
            className="inline-block w-1.5 h-4 ml-1 align-middle animate-pulse"
          />
        )}
      </div>

      {citations.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t" style={{ borderColor: tokens.universalBorderColor }}>
          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-55 mr-1">
            Sources
          </span>
          {citations.map((c) =>
            c.href ? (
              <a
                key={c.id}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: tokens.hoverBackplateTint,
                  borderColor: tokens.universalBorderColor,
                  borderRadius: `${scaled.scaledPillRadius}px`,
                }}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium border hover:opacity-80"
              >
                <span>{c.label}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            ) : (
              <span
                key={c.id}
                style={{
                  backgroundColor: tokens.hoverBackplateTint,
                  borderColor: tokens.universalBorderColor,
                  borderRadius: `${scaled.scaledPillRadius}px`,
                }}
                className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium border"
              >
                {c.label}
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
}
