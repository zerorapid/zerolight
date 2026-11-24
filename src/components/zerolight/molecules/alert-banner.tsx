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
    const isDark = scaled.isDarkSurface;
    switch (severity) {
      case "critical":
        return {
          icon: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />,
          bg: isDark ? "rgba(239, 68, 68, 0.12)" : "var(--zl-destructive-subtle, #FFF1F2)",
          border: isDark ? "rgba(239, 68, 68, 0.25)" : "var(--zl-destructive-border, #FECDD3)",
          titleColor: isDark ? "#FDA4AF" : "var(--zl-destructive-text, #9F1239)",
          descColor: isDark ? "#F43F5E" : "var(--zl-destructive-desc, #BE123C)",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
          bg: isDark ? "rgba(245, 158, 11, 0.12)" : "var(--zl-warning-subtle, #FFFBEB)",
          border: isDark ? "rgba(245, 158, 11, 0.25)" : "var(--zl-warning-border, #FDE68A)",
          titleColor: isDark ? "#FCD34D" : "var(--zl-warning-text, #92400E)",
          descColor: isDark ? "#FBBF24" : "var(--zl-warning-desc, #B45309)",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />,
          bg: isDark ? "rgba(16, 185, 129, 0.12)" : "var(--zl-success-subtle, #ECFDF5)",
          border: isDark ? "rgba(16, 185, 129, 0.25)" : "var(--zl-success-border, #A7F3D0)",
          titleColor: isDark ? "#6EE7B7" : "var(--zl-success-text, #065F46)",
          descColor: isDark ? "#34D399" : "var(--zl-success-desc, #047857)",
        };
      case "info":
      default:
        return {
          icon: <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />,
          bg: isDark ? "rgba(59, 130, 246, 0.12)" : "var(--zl-info-subtle, #EFF6FF)",
          border: isDark ? "rgba(59, 130, 246, 0.25)" : "var(--zl-info-border, #BFDBFE)",
          titleColor: isDark ? "#93C5FD" : "var(--zl-info-text, #1E40AF)",
          descColor: isDark ? "#60A5FA" : "var(--zl-info-desc, #1D4ED8)",
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
