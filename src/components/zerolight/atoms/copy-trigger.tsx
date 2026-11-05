"use client";

import React, { useState } from "react";

export interface CopyTriggerProps {
  text: string;
  label?: string;
  displayText?: string;
  showText?: boolean;
  timeoutMs?: number;
  className?: string;
}

export function CopyTrigger({
  text,
  label,
  displayText,
  showText = true,
  timeoutMs = 1800,
  className = "",
}: CopyTriggerProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [isRippling, setIsRippling] = useState<boolean>(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRippling(true);
    setTimeout(() => setIsRippling(false), 350);

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeoutMs);
    } catch {
      // Safe fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), timeoutMs);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label || `Copy ${text} to clipboard`}
      title="Click to copy"
      className={`relative overflow-hidden inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-xs select-none transition-all duration-300 ease-spring-tactile transform-gpu will-change-transform focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 active:scale-95 ${
        copied
          ? "border border-emerald-500/80 bg-emerald-950/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.35)]"
          : "border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:border-neutral-700 hover:bg-neutral-850"
      } ${isRippling ? "animate-ripple-feedback" : ""} ${className}`}
    >
      {/* Dynamic Ripple Wave Overlay */}
      {isRippling && (
        <span className="absolute inset-0 bg-emerald-500/10 pointer-events-none rounded animate-ping opacity-60" />
      )}

      {showText && (
        <span className="truncate max-w-[120px] text-[11px] font-medium tracking-tight">
          {displayText || text}
        </span>
      )}

      {/* Morphing Icon Transition */}
      <span className="relative flex items-center justify-center w-3.5 h-3.5 flex-shrink-0">
        <svg
          className={`w-3.5 h-3.5 text-emerald-400 absolute transition-all duration-300 ease-spring-tactile transform-gpu ${
            copied ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-45 pointer-events-none"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>

        <svg
          className={`w-3 h-3 text-neutral-500 hover:text-neutral-300 absolute transition-all duration-300 ease-spring-tactile transform-gpu ${
            copied ? "opacity-0 scale-50 rotate-45 pointer-events-none" : "opacity-100 scale-100 rotate-0"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
          />
        </svg>
      </span>

      {copied && (
        <span className="text-[10px] text-emerald-400 font-sans font-semibold leading-none">
          Copied
        </span>
      )}
    </button>
  );
}
