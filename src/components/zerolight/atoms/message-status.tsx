"use client";

import React from "react";
import { useZeroLight } from "../context";
import { Check, CheckCheck, Loader2, AlertCircle } from "lucide-react";

export type MessageStatusType = "sending" | "sent" | "delivered" | "read" | "failed";

export interface MessageStatusProps {
  status: MessageStatusType;
  size?: number;
  className?: string;
}

export function MessageStatus({
  status,
  size = 13,
  className = "",
}: MessageStatusProps) {
  const { tokens } = useZeroLight();
  const strokeWidth = tokens.iconStrokeWidth || 1.75;

  switch (status) {
    case "sending":
      return (
        <Loader2
          size={size}
          strokeWidth={strokeWidth}
          className={`animate-spin text-neutral-400 shrink-0 ${className}`}
          aria-label="Sending message"
        />
      );
    case "sent":
      return (
        <Check
          size={size}
          strokeWidth={strokeWidth}
          className={`text-neutral-400 shrink-0 ${className}`}
          aria-label="Message sent"
        />
      );
    case "delivered":
      return (
        <CheckCheck
          size={size + 2}
          strokeWidth={strokeWidth}
          className={`text-neutral-400 shrink-0 ${className}`}
          aria-label="Message delivered"
        />
      );
    case "read":
      return (
        <CheckCheck
          size={size + 2}
          strokeWidth={strokeWidth + 0.25}
          color={tokens.primaryButtonColor}
          className={`shrink-0 ${className}`}
          aria-label="Message read"
        />
      );
    case "failed":
      return (
        <AlertCircle
          size={size}
          strokeWidth={strokeWidth}
          className={`text-rose-500 shrink-0 ${className}`}
          aria-label="Message delivery failed"
        />
      );
  }
}
