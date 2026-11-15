"use client";

import React, { useState } from "react";
import { X, Copy, Check } from "lucide-react";

export interface CodeModalData {
  title: string;
  code: string;
}

export interface CodeModalProps {
  modal: CodeModalData | null;
  onClose: () => void;
}

export function CodeModal({ modal, onClose }: CodeModalProps) {
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
        className="w-full max-w-2xl bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{modal.title}</h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-zinc-950 text-emerald-400 font-sans tabular-nums text-xs overflow-x-auto max-h-[460px] no-scrollbar">
          <pre className="font-mono text-xs leading-relaxed">{modal.code}</pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-100 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.02]">
          <span className="text-[11px] text-zinc-400">Pure React TSX Component</span>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy TSX Code</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
