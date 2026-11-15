"use client";

import React from "react";
import { Code2 } from "lucide-react";

export interface VariantCardProps {
  /** Two-digit number string e.g. "01", "02" */
  number: string;
  /** Primary variant title */
  title: string;
  /** Concise single-line description */
  description?: string;
  /** Categorical tag pill e.g. "Primary", "Drawer", "Conjoined" */
  tag?: string;
  /** TSX code string for view/copy modal */
  code?: string;
  /** Callback when user clicks "</> Code" */
  onViewCode?: () => void;
  /** Live interactive element rendered inside */
  children: React.ReactNode;
  /** Optional bottom footer slot (action triggers, details, badges) */
  footer?: React.ReactNode;
  /** Custom min-height for preview area */
  minHeight?: string;
  /** Additional container classes */
  className?: string;
}

export function VariantCard({
  number,
  title,
  description,
  tag,
  onViewCode,
  children,
  footer,
  minHeight = "min-h-[80px]",
  className = "",
}: VariantCardProps) {
  return (
    <div
      className={`group flex flex-col justify-between p-5 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#121215] shadow-xs hover:border-zinc-300 dark:hover:border-white/20 transition-all ${className}`}
    >
      <div>
        {/* Header: Number, Tag, and Code Button */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 font-sans tabular-nums">
              {number}
            </span>
            <span className="text-xs font-bold text-zinc-950 dark:text-white tracking-tight">
              {title}
            </span>
            {tag && (
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-white/5">
                {tag}
              </span>
            )}
          </div>

          {onViewCode && (
            <button
              type="button"
              onClick={onViewCode}
              className="px-2 py-0.5 rounded-md text-[11px] font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition flex items-center gap-1 cursor-pointer"
            >
              <Code2 className="w-3 h-3" />
              <span>Code</span>
            </button>
          )}
        </div>

        {description && (
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
            {description}
          </p>
        )}

        {/* Live Interactive Preview Box */}
        <div
          className={`w-full flex items-center justify-center p-4 rounded-xl bg-zinc-50/70 dark:bg-white/[0.02] border border-zinc-200/60 dark:border-white/5 relative ${minHeight}`}
        >
          {children}
        </div>
      </div>

      {/* Optional Card Footer */}
      {footer && (
        <div className="pt-3 mt-4 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
}
