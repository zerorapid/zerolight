"use client";

import React from "react";
import { useZeroLight } from "../context";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

export type AlertSeverity = "info" | "warning" | "success" | "critical";

export interface AlertBannerProps {
  severity?: AlertSeverity;
  title: string;
  description?: string;
  onDismiss?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export function AlertBanner({
  severity = "info",
  title,
  description,
  onDismiss,
  action,
  className = "",
}: AlertBannerProps) {
  const { tokens, scaled } = useZeroLight();

  const getSeverityConfig = () => {
    switch (severity) {
      case "critical":
        return {
          icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
          bg: "#FFF1F2",
          border: "#FECDD3",
          titleColor: "#9F1239",
          descColor: "#BE123C",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
          bg: "#FFFBEB",
          border: "#FDE68A",
          titleColor: "#92400E",
          descColor: "#B45309",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
          bg: "#ECFDF5",
          border: "#A7F3D0",
          titleColor: "#065F46",
          descColor: "#047857",
        };
      case "info":
      default:
        return {
          icon: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
          bg: "#EFF6FF",
          border: "#BFDBFE",
          titleColor: "#1E40AF",
          descColor: "#1D4ED8",
        };
    }
  };

  const cfg = getSeverityConfig();

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledRadius}px`,
        backgroundColor: cfg.bg,
        borderColor: tokens.borderWidth > 0 ? cfg.border : "transparent",
        borderWidth: `${tokens.borderWidth}px`,
        transition: scaled.transitionStyle,
      }}
      className={`p-4 border flex items-start gap-3 w-full shadow-2xs ${className}`}
    >
      {cfg.icon}

      <div className="flex-1 space-y-0.5">
        <h4 style={{ color: cfg.titleColor }} className="text-xs font-semibold leading-snug [text-wrap:balance]">
          {title}
        </h4>
        {description && (
          <p
            title={description}
            style={{ color: cfg.descColor, fontSize: `${scaled.sublabelFontSize}px` }}
            className="leading-relaxed line-clamp-2"
          >
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-neutral-400 hover:text-neutral-700 cursor-pointer p-0.5 rounded shrink-0"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
