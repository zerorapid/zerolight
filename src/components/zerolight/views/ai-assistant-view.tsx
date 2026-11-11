"use client";

import React, { useState } from "react";
import {
  ChatWorkspaceTemplate,
  ChatConversation,
  ChatInput,
  Badge,
  TagChip,
} from "@/components/zerolight";
import {
  Sparkles,
} from "lucide-react";

export function AiAssistantView() {
  const [inputText, setInputText] = useState("");
  const [activeSessionId, setActiveSessionId] = useState("session-1");

  return (
    <div className="min-h-screen bg-white">
      <ChatWorkspaceTemplate
        assistantTitle="ZeroLight AI Copilot"
        modelBadge={
          <Badge variant="healthy">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>Claude 3.7 Sonnet</span>
            </span>
          </Badge>
        }
        sessions={[
          {
            id: "session-1",
            title: "Analyze Latency & SLO Violations",
            timestamp: "10:14 AM",
            isActive: activeSessionId === "session-1",
          },
          {
            id: "session-2",
            title: "Stripe Webhook Redis Pipeline",
            timestamp: "Yesterday",
            isActive: activeSessionId === "session-2",
          },
          {
            id: "session-3",
            title: "Design System Anti-Crowding Audit",
            timestamp: "Nov 8",
            isActive: activeSessionId === "session-3",
          },
          {
            id: "session-4",
            title: "PostgreSQL Migration Schema",
            timestamp: "Nov 5",
            isActive: activeSessionId === "session-4",
          },
        ]}
        onSelectSession={(id) => setActiveSessionId(id)}
        onNewSession={() => {
          setActiveSessionId(`session-${Date.now()}`);
        }}
        conversationStream={
          <ChatConversation
            peerName="ZeroLight AI Copilot"
            peerRole="Autonomous Coding Assistant"
          />
        }
        inputArea={
          <ChatInput
            placeholder="Instruct the copilot or paste a code snippet..."
            value={inputText}
            onChange={(val) => setInputText(val)}
            onSend={() => {
              setInputText("");
            }}
          />
        }
        quickStarters={
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-neutral-400 mr-1">Starters:</span>
            {[
              "Audit P99 Latency Spikes",
              "Generate Postgres Migration",
              "Optimize AreaChart Bezier Curve",
              "Review RBAC Role Policies",
            ].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setInputText(prompt)}
                className="px-2.5 py-1 rounded-full text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        }
        inspectorPanel={
          <div className="space-y-6 text-xs">
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">
                Model Hyperparameters
              </span>
              <div className="space-y-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Engine</span>
                  <span className="font-semibold text-neutral-900">claude-3-7-sonnet-20250219</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Temperature</span>
                  <span className="tabular-nums font-semibold text-neutral-900">0.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Top-P</span>
                  <span className="tabular-nums font-semibold text-neutral-900">0.95</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Max Tokens</span>
                  <span className="tabular-nums font-semibold text-neutral-900">8,192</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">
                Session Token Telemetry
              </span>
              <div className="space-y-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Prompt Tokens</span>
                  <span className="tabular-nums font-bold text-neutral-900">1,420</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Completion Tokens</span>
                  <span className="tabular-nums font-bold text-neutral-900">388</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Estimated Cost</span>
                  <span className="tabular-nums text-emerald-700 font-semibold">$0.0054</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">
                Connected Tool Plugins
              </span>
              <div className="flex flex-wrap gap-1.5">
                <TagChip label="Kubernetes Telemetry" />
                <TagChip label="Stripe Billing API" />
                <TagChip label="Postgres ETL" />
                <TagChip label="Audit Logger" />
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
