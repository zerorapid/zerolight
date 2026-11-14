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
          bg: isDark ? "#2D0E14" : "#FFF1F2",
          border: isDark ? "#5B1924" : "#FECDD3",
          titleColor: isDark ? "#FDA4AF" : "#9F1239",
          descColor: isDark ? "#F43F5E" : "#BE123C",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
          bg: isDark ? "#2A1805" : "#FFFBEB",
          border: isDark ? "#5C350A" : "#FDE68A",
          titleColor: isDark ? "#FCD34D" : "#92400E",
          descColor: isDark ? "#FBBF24" : "#B45309",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />,
          bg: isDark ? "#06281E" : "#ECFDF5",
          border: isDark ? "#0E563F" : "#A7F3D0",
          titleColor: isDark ? "#6EE7B7" : "#065F46",
          descColor: isDark ? "#34D399" : "#047857",
        };
      case "info":
      default:
        return {
          icon: <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />,
          bg: isDark ? "#0B2144" : "#EFF6FF",
          border: isDark ? "#173E77" : "#BFDBFE",
          titleColor: isDark ? "#93C5FD" : "#1E40AF",
          descColor: isDark ? "#60A5FA" : "#1D4ED8",
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
