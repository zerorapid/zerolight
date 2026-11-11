"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { AppShell, NavItem } from "../organisms/app-shell";
import { PanelRight, Plus, Search, MessageSquare, Bot, Sparkles, X } from "lucide-react";

export interface ChatSessionItem {
  id: string;
  title: string;
  timestamp: string;
  preview?: string;
  isActive?: boolean;
}

export interface ChatWorkspaceTemplateProps {
  /** Copilot or assistant title (e.g. "ZeroLight AI Copilot") */
  assistantTitle: string;
  /** Active model pill or badge (e.g. "Claude 3.7 Sonnet" or "Gemini 2.5 Pro") */
  modelBadge?: React.ReactNode;
  /** Left sidebar: Past chat sessions list */
  sessions: ChatSessionItem[];
  /** Callback when user selects a past chat session */
  onSelectSession: (id: string) => void;
  /** Callback when user clicks "New Chat" */
  onNewSession: () => void;
  /** Main conversation stream element (e.g. ChatConversation organism) */
  conversationStream: React.ReactNode;
  /** Bottom input area element (e.g. ChatInput organism) */
  inputArea: React.ReactNode;
  /** Suggested prompt chips or quick starters */
  quickStarters?: React.ReactNode;
  /** Right panel inspector (e.g. retrieved docs, token usage, system prompt) */
  inspectorPanel?: React.ReactNode;
  /** Whether the inspector panel is open by default */
  defaultInspectorOpen?: boolean;
  /** Optional AppShell wrapper configuration */
  shellConfig?: {
    brandName?: string;
    brandLogo?: React.ReactNode;
    navItems?: NavItem[];
    headerRight?: React.ReactNode;
    footerAction?: React.ReactNode;
  };
  className?: string;
}

export function ChatWorkspaceTemplate({
  assistantTitle,
  modelBadge,
  sessions,
  onSelectSession,
  onNewSession,
  conversationStream,
  inputArea,
  quickStarters,
  inspectorPanel,
  defaultInspectorOpen = false,
  shellConfig,
  className = "",
}: ChatWorkspaceTemplateProps) {
  const { tokens, scaled } = useZeroLight();
  const [isInspectorOpen, setIsInspectorOpen] = useState(defaultInspectorOpen);
  const [sessionSearch, setSessionSearch] = useState("");

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(sessionSearch.toLowerCase())
  );

  const content = (
    <div
      style={{
        backgroundColor: tokens.universalFillColor,
      }}
      className={`h-[calc(100vh-4rem)] flex overflow-hidden border-b border-neutral-200 select-none ${className}`}
    >
      {/* ── PANE 1: SESSIONS & THREADS SIDEBAR ── */}
      <aside
        style={{
          borderColor: tokens.universalBorderColor,
          borderRightWidth: `${tokens.borderWidth}px`,
        }}
        className={`w-72 border-r bg-neutral-50/70 shrink-0 flex flex-col justify-between hidden md:flex`}
      >
        <div className="p-4 space-y-3">
          {/* New Chat Button */}
          <button
            type="button"
            onClick={onNewSession}
            style={{
              backgroundColor: tokens.primaryButtonColor,
              color: scaled.primaryActionTextColor,
              borderRadius: `${scaled.scaledRadius}px`,
            }}
            className="w-full py-2 px-3 text-xs font-semibold shadow-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Conversation</span>
          </button>

          {/* Search Sessions */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search chats..."
              value={sessionSearch}
              onChange={(e) => setSessionSearch(e.target.value)}
              style={{
                borderRadius: `${scaled.scaledRadius}px`,
                borderColor: tokens.universalBorderColor,
                borderWidth: `${tokens.borderWidth}px`,
              }}
              className="w-full bg-white pl-8 pr-3 py-1.5 text-xs text-neutral-800 placeholder-neutral-400 border focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 px-2 py-1">
            Recent Conversations
          </div>
          {filteredSessions.map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => onSelectSession(session.id)}
              style={{
                borderRadius: `${scaled.scaledRadius}px`,
              }}
              className={`w-full text-left p-2.5 text-xs transition-colors cursor-pointer group flex items-start gap-2.5 ${
                session.isActive
                  ? "bg-white text-neutral-900 font-semibold shadow-2xs border border-neutral-200"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 mt-0.5 text-neutral-400 group-hover:text-neutral-700 shrink-0" />
              <div className="truncate flex-1">
                <div className="truncate">{session.title}</div>
                <div className="text-[10px] text-neutral-400 font-normal tabular-nums mt-0.5">
                  {session.timestamp}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* User / Agent Footnote */}
        <div className="p-3 border-t border-neutral-200/70 flex items-center justify-between text-xs text-neutral-500">
          <span className="flex items-center gap-1.5 text-[11px] font-medium">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>Agentic Copilot</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
        </div>
      </aside>

      {/* ── PANE 2: ACTIVE CONVERSATION STREAM & PINNED INPUT ── */}
      <main className="flex-1 flex flex-col justify-between min-w-0 bg-white">
        {/* Stream Header */}
        <header
          style={{
            borderColor: tokens.universalBorderColor,
            borderBottomWidth: `${tokens.borderWidth}px`,
          }}
          className="px-5 py-3 border-b flex items-center justify-between gap-4 shrink-0"
        >
          <div className="flex items-center gap-3 truncate">
            <div
              style={{
                backgroundColor: tokens.primaryButtonColor,
                borderRadius: `${scaled.scaledRadius}px`,
                color: scaled.primaryActionTextColor,
              }}
              className="w-8 h-8 flex items-center justify-center shrink-0 shadow-2xs"
            >
              <Bot className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-neutral-900 truncate">
                  {assistantTitle}
                </h2>
                {modelBadge}
              </div>
              <p className="text-[11px] text-neutral-400 truncate">
                Active streaming context • Tabular output &amp; code blocks supported
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {inspectorPanel && (
              <button
                type="button"
                onClick={() => setIsInspectorOpen((prev) => !prev)}
                style={{
                  borderRadius: `${scaled.scaledRadius}px`,
                }}
                className={`p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer ${
                  isInspectorOpen ? "bg-neutral-100 text-neutral-900" : ""
                }`}
                title="Toggle Inspector"
              >
                <PanelRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Conversation Stream Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {conversationStream}
        </div>

        {/* Pinned Input Container */}
        <footer className="p-4 border-t border-neutral-100 bg-white shrink-0 space-y-2.5">
          {quickStarters && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {quickStarters}
            </div>
          )}
          <div className="w-full">
            {inputArea}
          </div>
        </footer>
      </main>

      {/* ── PANE 3: CONTEXT & METADATA INSPECTOR ── */}
      {inspectorPanel && isInspectorOpen && (
        <aside
          style={{
            borderColor: tokens.universalBorderColor,
            borderLeftWidth: `${tokens.borderWidth}px`,
          }}
          className="w-80 border-l bg-neutral-50/60 p-4 shrink-0 overflow-y-auto hidden lg:block space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200/70">
            <span className="text-xs font-bold text-neutral-800 tracking-tight">
              Session Telemetry &amp; Context
            </span>
            <button
              type="button"
              onClick={() => setIsInspectorOpen(false)}
              className="text-neutral-400 hover:text-neutral-800 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {inspectorPanel}
        </aside>
      )}
    </div>
  );

  if (shellConfig) {
    return (
      <AppShell
        brandName={shellConfig.brandName}
        brandLogo={shellConfig.brandLogo}
        navItems={shellConfig.navItems}
        headerRight={shellConfig.headerRight}
        footerAction={shellConfig.footerAction}
      >
        {content}
      </AppShell>
    );
  }

  return content;
}
