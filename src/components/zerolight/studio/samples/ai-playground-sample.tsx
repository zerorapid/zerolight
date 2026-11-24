"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Send,
  Copy,
  Check,
  Bot,
  User,
  MessageSquare,
  Terminal,
  Paperclip,
  Mic,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Sliders,
  Share2,
  Clock,
  Hash,
  Cpu,
} from "lucide-react";
import { useZeroLight } from "../../context";
import { Button } from "../../atoms/button";
import { Badge } from "../../atoms/badge";
import { Avatar } from "../../atoms/avatar";
import { BrandLogoRenderer } from "./brand-logo-renderer";

interface ChatThread {
  id: string;
  title: string;
  tokensUsed: string;
  timestamp: string;
}

const HISTORY_THREADS: ChatThread[] = [
  { id: "thread-1", title: "API latency telemetry & cluster logs", tokensUsed: "1.4k tokens", timestamp: "10m ago" },
  { id: "thread-2", title: "YIQ luminance formula verification", tokensUsed: "820 tokens", timestamp: "2h ago" },
  { id: "thread-3", title: "Tailwind config @import compiler", tokensUsed: "2.1k tokens", timestamp: "Yesterday" },
];

export interface AiPlaygroundSampleProps {
  brandName?: string;
  brandMark?: string;
  brandLogoUrl?: string | null;
  selectedIconMark?: string;
}

export function AiPlaygroundSample({
  brandName = "ZeroLight",
  brandMark = "ZL",
  brandLogoUrl = null,
  selectedIconMark = "shield",
}: AiPlaygroundSampleProps) {
  const { tokens, scaled } = useZeroLight();
  const [activeThread, setActiveThread] = useState("thread-1");
  const [copiedCode, setCopiedCode] = useState(false);
  const [promptText, setPromptText] = useState("");

  const sampleSnippet = `export function calculateContrast(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#09090B" : "#FFFFFF";
}`;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(sampleSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      className="w-full flex flex-col md:flex-row gap-4 font-sans select-none h-full min-h-[460px]"
      style={{
        color: tokens.textIconColor,
        fontFamily: scaled.resolvedFontFamily,
      }}
    >
      {/* ── LEFT CHAT HISTORY SIDEBAR ── */}
      <div
        className="w-full md:w-56 shrink-0 p-3 flex flex-col space-y-2.5"
        style={{
          backgroundColor: tokens.hoverBackplateTint,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          borderRadius: `${scaled.scaledCardRadius}px`,
        }}
      >
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold opacity-60 uppercase tracking-wider">Recent Sessions</span>
          <Badge variant="neutral" size="sm">Claude 3.7</Badge>
        </div>

        <div className="space-y-1">
          {HISTORY_THREADS.map((thread) => {
            const isSel = activeThread === thread.id;
            return (
              <button
                key={thread.id}
                type="button"
                onClick={() => setActiveThread(thread.id)}
                className={`w-full text-left p-2 transition-all cursor-pointer flex flex-col space-y-0.5 ${
                  isSel ? "font-semibold shadow-2xs" : "opacity-75 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: isSel ? tokens.universalFillColor : "transparent",
                  borderColor: isSel ? tokens.universalBorderColor : "transparent",
                  borderWidth: isSel ? `${tokens.borderWidth}px` : "0px",
                  borderRadius: `${scaled.scaledRadius}px`,
                  color: tokens.textIconColor,
                }}
              >
                <div className="flex items-center gap-1.5 truncate text-xs">
                  <MessageSquare className="w-3 h-3 opacity-60 shrink-0" />
                  <span className="truncate">{thread.title}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] opacity-60 pl-4 font-sans tabular-nums">
                  <span>{thread.tokensUsed}</span>
                  <span>{thread.timestamp}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MAIN CONVERSATIONAL CANVAS ── */}
      <div
        className="flex-1 flex flex-col justify-between p-4 space-y-4"
        style={{
          backgroundColor: tokens.universalFillColor,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          borderRadius: `${scaled.scaledCardRadius}px`,
          boxShadow: scaled.cardShadow,
        }}
      >
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* User Bubble */}
          <div className="flex items-start gap-3 max-w-xl">
            <Avatar initials="SC" size="sm" alt="Sarah Connor" />
            <div className="space-y-1">
              <span className="text-[11px] font-semibold opacity-60">Sarah Connor</span>
              <div
                className="p-3 text-xs leading-relaxed"
                style={{
                  backgroundColor: tokens.hoverBackplateTint,
                  borderRadius: `${scaled.scaledRadius}px`,
                  color: tokens.textIconColor,
                }}
              >
                Explain how {brandName} uses YIQ contrast physics to prevent black text on dark brand buttons.
              </div>
            </div>
          </div>

          {/* AI Response Bubble */}
          <div className="flex items-start gap-3">
            <BrandLogoRenderer
              brandLogoUrl={brandLogoUrl}
              selectedIconMark={selectedIconMark}
              brandMark={brandMark}
              size="sm"
            />
            <div className="space-y-2 max-w-2xl w-full">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold"
                  style={{
                    fontFamily: scaled.resolvedHeadingFontFamily,
                    color: tokens.textIconColor,
                  }}
                >
                  {brandName} Copilot
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.2 font-bold"
                  style={{
                    backgroundColor: tokens.hoverBackplateTint,
                    borderRadius: `${scaled.scaledRadius}px`,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                  }}
                >
                  Generated in 180ms
                </span>
              </div>

              <div
                className="p-3.5 text-xs space-y-3 leading-relaxed border"
                style={{
                  backgroundColor: tokens.hoverBackplateTint,
                  borderColor: tokens.universalBorderColor,
                  borderWidth: `${tokens.borderWidth}px`,
                  borderRadius: `${scaled.scaledCardRadius}px`,
                  color: tokens.textIconColor,
                }}
              >
                <p>
                  {brandName} calculates perceptual luminance using the NTSC YIQ color formula. It weights RGB values according to human retinal cone sensitivity:
                </p>

                {/* Code Block with Copy Trigger */}
                <div
                  className="relative p-3 overflow-x-auto text-[11px] font-sans tabular-nums text-slate-100"
                  style={{
                    backgroundColor: "#0F172A",
                    borderRadius: `${scaled.scaledRadius}px`,
                  }}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400">
                    <span>contrast-math.ts</span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <pre>{sampleSnippet}</pre>
                </div>

                <p className="text-[11px] opacity-75">
                  Whenever an engineer tweaks the Primary Accent in Token Studio, this formula executes synchronously without DOM layout shifts.
                </p>

                {/* Assistant Message Quick Actions Bar */}
                <div className="flex items-center gap-3 pt-1 text-[11px] opacity-60">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 hover:opacity-100 cursor-pointer"
                  >
                    <Copy size={12} strokeWidth={tokens.iconStrokeWidth || 1.75} />
                    <span>Copy</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:opacity-100 cursor-pointer"
                  >
                    <RotateCcw size={12} strokeWidth={tokens.iconStrokeWidth || 1.75} />
                    <span>Regenerate</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:opacity-100 cursor-pointer"
                  >
                    <ThumbsUp size={12} strokeWidth={tokens.iconStrokeWidth || 1.75} />
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:opacity-100 cursor-pointer"
                  >
                    <ThumbsDown size={12} strokeWidth={tokens.iconStrokeWidth || 1.75} />
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:opacity-100 cursor-pointer ml-auto"
                  >
                    <Share2 size={12} strokeWidth={tokens.iconStrokeWidth || 1.75} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── STICKY BOTTOM PROMPT INPUT BAR ── */}
        <div
          className="p-2 flex items-center gap-2 shrink-0 border shadow-2xs"
          style={{
            backgroundColor: tokens.hoverBackplateTint,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            borderRadius: `${scaled.scaledRadius}px`,
          }}
        >
          <div className="flex items-center gap-1 pl-1">
            <button
              type="button"
              className="p-1.5 rounded-md hover:bg-slate-200/60 opacity-60 hover:opacity-100 cursor-pointer transition-colors"
              title="Attach context file"
            >
              <Paperclip size={14} strokeWidth={tokens.iconStrokeWidth || 1.75} />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-md hover:bg-slate-200/60 opacity-60 hover:opacity-100 cursor-pointer transition-colors"
              title="Voice dictation"
            >
              <Mic size={14} strokeWidth={tokens.iconStrokeWidth || 1.75} />
            </button>
          </div>

          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder={`Ask ${brandName} Copilot to refactor or restyle components...`}
            className="flex-1 bg-transparent px-2.5 py-1 text-xs focus:outline-none font-sans"
            style={{ color: tokens.textIconColor }}
          />

          <div className="flex items-center gap-1.5 shrink-0 pr-1">
            <span className="text-[10px] opacity-60 font-sans tabular-nums hidden sm:flex items-center gap-1">
              <Hash size={11} strokeWidth={tokens.iconStrokeWidth || 1.75} />
              <span>128 / 4,096 tokens</span>
            </span>
            <Button
              variant="primary"
              size="sm"
              iconLeft={<Send size={13} strokeWidth={tokens.iconStrokeWidth || 2} />}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
