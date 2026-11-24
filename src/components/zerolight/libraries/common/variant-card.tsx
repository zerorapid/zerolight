"use client";

import React from "react";
import { Code2 } from "lucide-react";
import { useZeroLight } from "../../context";
import type { ScaledTokens, ZeroLightTokens } from "../../types";

/** Canonical token-bound surface style for showcase cards across all 15 libraries. */
export function getZeroLightCardStyle(
  tokens: ZeroLightTokens,
  scaled: ScaledTokens
): React.CSSProperties {
  return {
    borderRadius: `${scaled.scaledCardRadius}px`,
    borderColor: tokens.universalBorderColor,
    borderWidth: `${tokens.borderWidth}px`,
    borderStyle: "solid",
    backgroundColor: tokens.universalFillColor,
    boxShadow: scaled.cardShadow,
  };
}

/** Hook returning canonical token-bound surface styles for custom showcase cards. */
export function useZeroLightCardStyle(): React.CSSProperties {
  const { tokens, scaled } = useZeroLight();
  return getZeroLightCardStyle(tokens, scaled);
}

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
  const { tokens, scaled } = useZeroLight();

  return (
    <div
      data-zl-card="true"
      style={getZeroLightCardStyle(tokens, scaled)}
      className={`group flex flex-col justify-between p-5 border hover:border-zinc-400 transition-all ${className}`}
    >
      <div>
        {/* Header: Number, Tag, and Code Button */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100 gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
            <span className="text-xs font-bold text-zinc-400 font-sans tabular-nums shrink-0">
              {number}
            </span>
            <span className="text-xs font-bold text-zinc-950 tracking-tight truncate" title={title}>
              {title}
            </span>
            {tag && (
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 border border-zinc-200/60 shrink-0">
                {tag}
              </span>
            )}
          </div>

          {onViewCode && (
            <button
              type="button"
              onClick={onViewCode}
              className="shrink-0 px-2 py-0.5 rounded-md text-[11px] font-semibold text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition flex items-center gap-1 cursor-pointer"
            >
              <Code2 className="w-3 h-3" />
              <span>Code</span>
            </button>
          )}
        </div>

        {description && (
          <p className="text-[11px] text-zinc-500 leading-relaxed mb-4">
            {description}
          </p>
        )}

        {/* Live Interactive Preview Box */}
        <div
          style={{ borderRadius: `${scaled.scaledRadius}px` }}
          className={`w-full flex items-center justify-center p-4 bg-zinc-50/70 border border-zinc-200/60 relative ${minHeight}`}
        >
          {children}
        </div>
      </div>

      {/* Optional Card Footer */}
      {footer && (
        <div className="pt-3 mt-4 border-t border-zinc-100 flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
}
