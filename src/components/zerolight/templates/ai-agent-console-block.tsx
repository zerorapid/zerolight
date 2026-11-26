"use client";

import React, { useState } from "react";
import { Bot, Cpu, ShieldCheck, Activity } from "lucide-react";
import { StatCard } from "../molecules/stat-card";
import { StreamingMessage } from "../molecules/streaming-message";
import { ToolCallCard } from "../molecules/tool-call-card";
import { PromptComposer } from "../organisms/prompt-composer";
import { ApprovalWorkflow, type ApprovalStep } from "../organisms/approval-workflow";
import { Page, Section, MetricGrid, Split, Panel } from "./layout-grammar";

export interface AIAgentConsoleBlockProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const AGENT_APPROVAL_STEPS: ApprovalStep[] = [
  { id: "a1", role: "Policy Check", approver: "Guardrail Engine", status: "approved", timestamp: "12s ago" },
  { id: "a2", role: "Human Authorization", approver: "Operations Lead", status: "pending" },
];

/**
 * Tier 3 AI Agent Command Center Block — built with ZeroLight Layout Grammar,
 * StreamingMessage, ToolCallCard, PromptComposer, and ApprovalWorkflow.
 */
export function AIAgentConsoleBlock({
  title = "AI Agent Command Center",
  subtitle = "Live agent execution traces, tool calls, and human-in-the-loop approval gates.",
  className = "",
}: AIAgentConsoleBlockProps) {
  const [messages, setMessages] = useState([
    "Audited PO-2026-0842 across 3 suppliers. Found a +4.2% freight variance on ALU-6061-RAW; awaiting budget authorization before releasing.",
  ]);

  return (
    <Page density="compact" className={className}>
      <Section title={title} subtitle={subtitle} density="compact">
        <MetricGrid columns={4} density="compact">
          <StatCard label="Active Runs" value="14" delta="+3" trend="up" icon={<Bot className="w-4 h-4" />} />
          <StatCard label="Tool Calls (24h)" value="1,842" delta="99.4% ok" trend="up" icon={<Cpu className="w-4 h-4" />} />
          <StatCard label="Pending Gates" value="02" delta="Action needed" trend="neutral" icon={<ShieldCheck className="w-4 h-4" />} />
          <StatCard label="Avg Latency" value="420ms" delta="-18%" trend="up" icon={<Activity className="w-4 h-4" />} />
        </MetricGrid>
      </Section>

      <Split
        ratio="2:1"
        density="compact"
        left={
          <div className="space-y-3">
            <ToolCallCard
              toolName="fetch_purchase_order"
              status="success"
              durationMs={142}
              argumentsJson={'{ "po": "PO-2026-0842" }'}
              resultText="3 line items · Subtotal $148,600 · Supplier verified"
            />
            <ToolCallCard
              toolName="check_freight_variance"
              status="running"
              durationMs={86}
              argumentsJson={'{ "sku": "ALU-6061-RAW" }'}
              defaultExpanded={true}
              resultText="Comparing Q4 contract rate vs spot carrier quote..."
            />
            {messages.map((msg, idx) => (
              <StreamingMessage
                key={idx}
                modelName="Procurement Agent"
                timestamp="Just now"
                content={msg}
                citations={[
                  { id: "c1", label: "PO-2026-0842" },
                  { id: "c2", label: "Q4 Rate Card" },
                ]}
              />
            ))}
            <PromptComposer
              contextChips={[
                { id: "po", label: "PO-2026-0842" },
                { id: "tier", label: "tier:enterprise" },
              ]}
              onSubmit={(prompt) => {
                setMessages((prev) => [...prev, `Executed instruction: "${prompt}"`]);
              }}
            />
          </div>
        }
        right={
          <Panel density="compact" className="space-y-3">
            <ApprovalWorkflow
              layout="vertical"
              documentId="RUN-AG-0824"
              title="Release Budget Hold"
              amountLabel="$148,600"
              requester="Procurement Agent"
              budgetImpact="Within Q4 Cap"
              steps={AGENT_APPROVAL_STEPS}
            />
          </Panel>
        }
      />
    </Page>
  );
}
