"use client";

import React, { useState, useRef } from "react";
import { useZeroLight } from "../context";
import { UploadCloud, File, CheckCircle2, X } from "lucide-react";

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: "uploading" | "complete" | "error";
  previewUrl?: string;
}

export interface FileUploadProps {
  label?: string;
  acceptText?: string;
  maxSizeText?: string;
  accept?: string;
  files?: UploadedFile[];
  onUpload?: (files: FileList) => void;
  onRemoveFile?: (id: string) => void;
  compact?: boolean;
  className?: string;
}

export const DEFAULT_MOCK_FILES: UploadedFile[] = [
  { id: "f1", name: "k8s-cluster-manifest.yaml", size: "24.5 KB", progress: 100, status: "complete" },
  { id: "f2", name: "tls-wildcard-cert.pem", size: "4.8 KB", progress: 68, status: "uploading" },
];

export function FileUpload({
  label = "Upload manifest or certificate",
  acceptText = "Supports .yaml, .json, .pem, or .crt files",
  maxSizeText = "Max payload size: 10 MB",
  accept,
  files = [],
  onUpload,
  onRemoveFile,
  compact = false,
  className = "",
}: FileUploadProps) {
  const { tokens, scaled } = useZeroLight();
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (fileList && fileList.length > 0) {
      onUpload?.(fileList);
    }
  };

  return (
    <div className={`space-y-2 w-full select-none ${className}`}>
      {label && (
        <span style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }} className="font-semibold block">
          {label}
        </span>
      )}

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Drop Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        style={{
          borderRadius: `${scaled.scaledRadius}px`,
          borderColor: isDragOver ? tokens.primaryButtonColor : tokens.universalBorderColor,
          backgroundColor: isDragOver ? tokens.hoverBackplateTint : tokens.universalFillColor,
          borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
          transition: scaled.transitionStyle,
        }}
        className={`border-dashed text-center flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50/50 transition-colors ${
          compact ? "p-3 space-y-1" : "p-6 space-y-2"
        }`}
      >
        <div
          style={{
            borderRadius: `${scaled.scaledPillRadius}px`,
            backgroundColor: tokens.hoverBackplateTint,
          }}
          className={`${compact ? "w-7 h-7" : "w-10 h-10"} flex items-center justify-center text-neutral-500 shadow-2xs`}
        >
          <UploadCloud className={compact ? "w-3.5 h-3.5" : "w-5 h-5"} />
        </div>

        <div>
          <span style={{ color: tokens.textIconColor, fontSize: compact ? "11px" : "12px" }} className="font-semibold block">
            Click to upload or drag &amp; drop
          </span>
          <span style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-400 block mt-0.5">
            {acceptText} {maxSizeText ? `• ${maxSizeText}` : ""}
          </span>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {files.map((file) => (
            <div
              key={file.id}
              style={{
                borderRadius: `${scaled.scaledRadius}px`,
                borderColor: tokens.universalBorderColor,
                borderWidth: `${tokens.borderWidth}px`,
                backgroundColor: tokens.universalFillColor,
              }}
              className="p-2 border flex items-center justify-between gap-2.5 text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                {file.previewUrl ? (
                  <img src={file.previewUrl} alt={file.name} className="w-6 h-6 rounded object-cover border border-neutral-200" />
                ) : (
                  <File className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                )}
                <div className="truncate">
                  <div style={{ color: tokens.textIconColor }} className="font-semibold truncate text-[11px]">
                    {file.name}
                  </div>
                  <div className="text-[10px] text-neutral-400 tabular-nums">
                    {file.size} • {file.status === "complete" ? "Ready" : `${file.progress}%`}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {file.status === "complete" && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
                {onRemoveFile && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFile(file.id);
                    }}
                    className="text-neutral-400 hover:text-neutral-700 cursor-pointer p-0.5"
                    aria-label={`Remove file ${file.name}`}
                  >
                    <X className="w-3 h-3" />
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
