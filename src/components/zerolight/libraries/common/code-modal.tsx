"use client";

import React, { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { useZeroLight } from "../../context";
import { Button } from "../../atoms/button";

export interface CodeModalData {
  title: string;
  code: string;
}

export interface CodeModalProps {
  modal: CodeModalData | null;
  onClose: () => void;
}

export function CodeModal({ modal, onClose }: CodeModalProps) {
  const { tokens, scaled } = useZeroLight();
  const [copied, setCopied] = useState(false);

  if (!modal) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(modal.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        style={{
          borderRadius: `${scaled.scaledCardRadius}px`,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          backgroundColor: tokens.universalFillColor,
        }}
        className="w-full max-w-2xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
            <h4 className="text-xs font-bold text-zinc-900">{modal.title}</h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-zinc-950 text-emerald-400 font-sans tabular-nums text-xs overflow-x-auto max-h-[460px] no-scrollbar">
          <pre className="font-mono text-xs leading-relaxed">{modal.code}</pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-100 bg-zinc-50">
          <span className="text-[11px] text-zinc-500">ZeroLight Design System TSX Component</span>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCopy}
            iconLeft={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? "Copied!" : "Copy TSX Code"}
          </Button>
        </div>
      </div>
    </div>
  );
}
