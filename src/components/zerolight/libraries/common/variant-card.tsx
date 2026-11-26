"use client";

import React, { useState } from "react";
import { Code2, Copy, Check } from "lucide-react";
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
  /** Optional registry slug for `npx zerolight add <slug>` */
  cliName?: string;
}

type MorphicStage = "M1" | "M2" | "M3";

const MORPHIC_STYLES: Record<MorphicStage, { padding: string; bg: string; label: string }> = {
  M1: { padding: "p-3", bg: "bg-zinc-50/50", label: "Compact" },
  M2: { padding: "p-4", bg: "bg-zinc-50/70", label: "Tactile" },
  M3: { padding: "p-5", bg: "bg-white shadow-2xs", label: "Enterprise" },
};

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
  cliName,
}: VariantCardProps) {
  const { tokens, scaled } = useZeroLight();
  const [morphicStage, setMorphicStage] = useState<MorphicStage>("M2");
  const [copiedCli, setCopiedCli] = useState(false);

  const slug =
    cliName ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const cliCommand = `npx zerolight add ${slug}`;

  const handleCopyCli = () => {
    navigator.clipboard?.writeText(cliCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 1600);
  };

  return (
    <div
      data-zl-card="true"
      style={getZeroLightCardStyle(tokens, scaled)}
      className={`group flex flex-col justify-between p-5 border hover:border-zinc-400 transition-all ${className}`}
    >
      <div>
        {/* Header: Number, Tag, Morphic Toggle, CLI Copy & Code Button */}
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

          <div className="flex items-center gap-1 shrink-0">
            <div
              className="hidden sm:inline-flex items-center rounded-md bg-zinc-100/90 p-0.5 border border-zinc-200/60"
              title="Morphic Evolution Density"
            >
              {(["M1", "M2", "M3"] as const).map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setMorphicStage(stage)}
                  title={`${stage} ${MORPHIC_STYLES[stage].label}`}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                    morphicStage === stage
                      ? "bg-white text-zinc-950 shadow-2xs"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCopyCli}
              title={`Copy: ${cliCommand}`}
              className="px-2 py-0.5 rounded-md text-[11px] font-semibold text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition flex items-center gap-1 cursor-pointer"
            >
              {copiedCli ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span className="hidden md:inline">{copiedCli ? "Copied" : "CLI"}</span>
            </button>

            {onViewCode && (
              <button
                type="button"
                onClick={onViewCode}
                className="px-2 py-0.5 rounded-md text-[11px] font-semibold text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition flex items-center gap-1 cursor-pointer"
              >
                <Code2 className="w-3 h-3" />
                <span>Code</span>
              </button>
            )}
          </div>
        </div>

        {description && (
          <p className="text-[11px] text-zinc-500 leading-relaxed mb-4">
            {description}
          </p>
        )}

        {/* Live Interactive Preview Box */}
        <div
          style={{ borderRadius: `${scaled.scaledRadius}px` }}
          className={`w-full flex items-center justify-center border border-zinc-200/60 relative transition-all ${MORPHIC_STYLES[morphicStage].padding} ${MORPHIC_STYLES[morphicStage].bg} ${minHeight}`}
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
