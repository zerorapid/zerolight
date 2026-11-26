"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, XCircle, Send, UserCheck } from "lucide-react";
import { useZeroLight } from "../context";
import { useMorphic, MorphicSlot, type MorphicStage } from "../morphic-engine";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";

export interface ApprovalStep {
  id: string;
  role: string;
  approver: string;
  status: "approved" | "pending" | "rejected" | "waiting";
  timestamp?: string;
}

export interface ApprovalWorkflowProps {
  documentId: string;
  title: string;
  amountLabel: string;
  requester: string;
  budgetImpact: string;
  steps: ApprovalStep[];
  onApprove?: (comment: string) => void;
  onReject?: (reason: string) => void;
  onDelegate?: () => void;
  stage?: MorphicStage;
  className?: string;
}

/**
 * ERP multi-stage approval workflow with timeline chain, budget impact summary,
 * and Approve / Reject with Reason / Delegate actions.
 */
export function ApprovalWorkflow({
  documentId,
  title,
  amountLabel,
  requester,
  budgetImpact,
  steps: initialSteps,
  onApprove,
  onReject,
  onDelegate,
  stage,
  className = "",
}: ApprovalWorkflowProps) {
  const { tokens, scaled } = useZeroLight();
  const m = useMorphic(stage);
  const [steps, setSteps] = useState<ApprovalStep[]>(initialSteps);
  const [reason, setReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const handleApprove = () => {
    setSteps((prev) => {
      const idx = prev.findIndex((s) => s.status === "pending");
      if (idx === -1) return prev;
      return prev.map((s, i) => {
        if (i === idx) return { ...s, status: "approved", timestamp: "Just now" };
        if (i === idx + 1 && s.status === "waiting") return { ...s, status: "pending" };
        return s;
      });
    });
    onApprove?.(reason);
  };

  const handleReject = () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    if (!reason.trim()) return;
    setSteps((prev) =>
      prev.map((s) =>
        s.status === "pending" ? { ...s, status: "rejected", timestamp: "Just now" } : s
      )
    );
    onReject?.(reason);
    setShowRejectInput(false);
  };

  const hasPending = steps.some((s) => s.status === "pending");

  return (
    <div
      data-morphic-stage={m.stage}
      style={{
        backgroundColor: tokens.universalFillColor,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        borderStyle: "solid",
        borderRadius: `${scaled.scaledCardRadius}px`,
        color: tokens.textIconColor,
        boxShadow: m.isM1 ? "none" : scaled.cardShadow,
      }}
      className={`${m.padClass} space-y-4 ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b" style={{ borderColor: tokens.universalBorderColor }}>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold opacity-60 font-sans tabular-nums">{documentId}</span>
            <Badge variant={hasPending ? "degraded" : "healthy"} size="xs">
              {hasPending ? "Pending Approval" : "Completed"}
            </Badge>
          </div>
          <h3 className="text-sm font-bold tracking-tight">{title}</h3>
          <MorphicSlot minStage="M2" stage={stage}>
            <p className="text-xs opacity-65">Requested by {requester}</p>
          </MorphicSlot>
        </div>

        <div className="text-right font-sans tabular-nums">
          <div className="text-base font-extrabold">{amountLabel}</div>
          <MorphicSlot minStage="M3" stage={stage}>
            <div className="text-[11px] opacity-65">{budgetImpact}</div>
          </MorphicSlot>
        </div>
      </div>

      {/* Approval Chain (M2+) */}
      <MorphicSlot minStage="M2" stage={stage}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          {steps.map((step) => {
            const Icon =
              step.status === "approved"
                ? CheckCircle2
                : step.status === "rejected"
                ? XCircle
                : step.status === "pending"
                ? Clock
                : UserCheck;
            const iconColor =
              step.status === "approved"
                ? "#10B981"
                : step.status === "rejected"
                ? "#EF4444"
                : step.status === "pending"
                ? "#F59E0B"
                : undefined;

            return (
              <div
                key={step.id}
                style={{
                  backgroundColor: tokens.hoverBackplateTint,
                  borderRadius: `${scaled.scaledRadius}px`,
                  borderColor: tokens.universalBorderColor,
                  borderWidth: `${tokens.borderWidth}px`,
                  borderStyle: "solid",
                }}
                className="p-3 space-y-1"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 truncate">
                    {step.role}
                  </span>
                  <Icon className="w-3.5 h-3.5 shrink-0" style={iconColor ? { color: iconColor } : { opacity: 0.45 }} />
                </div>
                <div className="text-xs font-semibold truncate">{step.approver}</div>
                <MorphicSlot minStage="M3" stage={stage}>
                  <div className="text-[10px] opacity-60 font-sans tabular-nums">
                    {step.timestamp || step.status}
                  </div>
                </MorphicSlot>
              </div>
            );
          })}
        </div>
      </MorphicSlot>

      {showRejectInput && (
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold">Rejection Reason (Required)</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Specify variance, missing quote, or budget hold..."
            style={{
              borderColor: tokens.universalBorderColor,
              borderRadius: `${scaled.scaledRadius}px`,
              backgroundColor: tokens.hoverBackplateTint,
            }}
            className="w-full px-3 py-2 text-xs border focus:outline-none"
          />
        </div>
      )}

      {hasPending && (
        <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
          {onDelegate && (
            <Button variant="ghost" size="sm" iconLeft={<Send className="w-3.5 h-3.5" />} onClick={onDelegate}>
              Delegate
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleReject}>
            {showRejectInput ? "Confirm Rejection" : "Reject"}
          </Button>
          <Button variant="primary" size="sm" onClick={handleApprove}>
            Approve Step
          </Button>
        </div>
      )}
    </div>
  );
}
