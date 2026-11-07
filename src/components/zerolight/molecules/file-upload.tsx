"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { UploadCloud, File, CheckCircle2, X } from "lucide-react";

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: "uploading" | "complete" | "error";
}

export interface FileUploadProps {
  label?: string;
  acceptText?: string;
  maxSizeText?: string;
  files?: UploadedFile[];
  onUpload?: (files: FileList) => void;
  onRemoveFile?: (id: string) => void;
  className?: string;
}

const DEFAULT_MOCK_FILES: UploadedFile[] = [
  { id: "f1", name: "k8s-cluster-manifest.yaml", size: "24.5 KB", progress: 100, status: "complete" },
  { id: "f2", name: "tls-wildcard-cert.pem", size: "4.8 KB", progress: 68, status: "uploading" },
];

export function FileUpload({
  label = "Upload manifest or certificate",
  acceptText = "Supports .yaml, .json, .pem, or .crt files",
  maxSizeText = "Max payload size: 10 MB",
  files = DEFAULT_MOCK_FILES,
  onRemoveFile,
  className = "",
}: FileUploadProps) {
  const { tokens, scaled } = useZeroLight();
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div className={`space-y-3 w-full select-none ${className}`}>
      {label && (
        <span style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="font-medium block">
          {label}
        </span>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        style={{
          borderRadius: `${scaled.scaledCardRadius}px`,
          borderColor: isDragOver ? tokens.primaryButtonColor : tokens.universalBorderColor,
          backgroundColor: isDragOver ? tokens.hoverBackplateTint : tokens.universalFillColor,
          borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
          transition: scaled.transitionStyle,
        }}
        className="border-dashed p-6 text-center flex flex-col items-center justify-center space-y-2 cursor-pointer hover:bg-neutral-50/50 transition-colors"
      >
        <div
          style={{
            borderRadius: `${scaled.scaledPillRadius}px`,
            backgroundColor: tokens.hoverBackplateTint,
          }}
          className="w-10 h-10 flex items-center justify-center text-neutral-500 shadow-2xs"
        >
          <UploadCloud className="w-5 h-5" />
        </div>

        <div>
          <span style={{ color: tokens.textIconColor }} className="text-xs font-semibold block">
            Click to upload or drag and drop
          </span>
          <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 block mt-0.5">
            {acceptText} • {maxSizeText}
          </span>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2 pt-1">
          {files.map((file) => (
            <div
              key={file.id}
              style={{
                borderRadius: `${scaled.scaledRadius}px`,
                borderColor: tokens.universalBorderColor,
                borderWidth: `${tokens.borderWidth}px`,
                backgroundColor: tokens.universalFillColor,
              }}
              className="p-3 border flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 truncate">
                <File className="w-4 h-4 text-neutral-400 shrink-0" />
                <div className="truncate">
                  <div style={{ color: tokens.textIconColor }} className="font-semibold truncate">
                    {file.name}
                  </div>
                  <div className="text-[10px] text-neutral-400 tabular-nums">
                    {file.size} • {file.status === "complete" ? "Verified" : `${file.progress}% uploaded`}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {file.status === "complete" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <div className="w-16 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${file.progress}%`, backgroundColor: tokens.primaryButtonColor }}
                      className="h-full transition-all"
                    />
                  </div>
                )}
                {onRemoveFile && (
                  <button
                    type="button"
                    onClick={() => onRemoveFile(file.id)}
                    className="text-neutral-400 hover:text-neutral-700 cursor-pointer p-0.5"
                    aria-label={`Remove file ${file.name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
