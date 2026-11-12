"use client";

import React from "react";
import { Download, FileText, X } from "lucide-react";
import { useZeroLight } from "../context";
import { ProgressBar } from "../atoms/progress-bar";

export interface FileCardProps {
  name: string;
  size?: string;
  status?: "ready" | "uploading" | "error";
  progress?: number;
  icon?: React.ReactNode;
  onDownload?: () => void;
  onRemove?: () => void;
  className?: string;
}

/**
 * Compact FileCard for attachments, export artifacts, and upload status rows.
 */
export function FileCard({
  name,
  size,
  status = "ready",
  progress = 0,
  icon,
  onDownload,
  onRemove,
  className = "",
}: FileCardProps) {
  const { tokens, scaled } = useZeroLight();

  return (
    <div
      style={{
        backgroundColor: tokens.universalFillColor,
        borderColor: status === "error" ? "#EF4444" : tokens.universalBorderColor,
        borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
        borderRadius: `${scaled.scaledInnerRadius}px`,
        color: tokens.textIconColor,
        transition: scaled.transitionStyle,
      }}
      className={`p-3 border font-sans space-y-2 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            style={{
              backgroundColor: tokens.hoverBackplateTint,
              borderRadius: `${Math.max(6, scaled.scaledInnerRadius - 4)}px`,
            }}
            className="w-8 h-8 flex items-center justify-center shrink-0"
          >
            {icon ?? <FileText className="w-4 h-4 opacity-75" />}
          </div>
          <div className="min-w-0">
            <div
              style={{ fontSize: `${scaled.sublabelFontSize}px` }}
              className="font-medium truncate"
              title={name}
            >
              {name}
            </div>
            <div className="text-[11px] opacity-60 truncate">
              {status === "uploading"
                ? `Uploading ${Math.round(progress)}%`
                : status === "error"
                ? "Upload failed"
                : size ?? "Ready"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onDownload && status === "ready" && (
            <button
              type="button"
              onClick={onDownload}
              aria-label={`Download ${name}`}
              className="p-1.5 rounded-md opacity-65 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${name}`}
              className="p-1.5 rounded-md opacity-65 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {status === "uploading" && <ProgressBar value={progress} showValue={false} />}
    </div>
  );
}
