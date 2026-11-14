"use client";

import React, { useState } from "react";
import { Key, Copy, Check, Eye, EyeOff, Trash2, ShieldAlert } from "lucide-react";
import { useZeroLight } from "../context";

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  fullSecret?: string;
  createdDate: string;
  lastUsedDate?: string;
  scopes: string[];
}

export interface ApiKeyVaultProps {
  keys?: ApiKeyItem[];
  onGenerateKey?: (name: string, scopes: string[]) => void;
  onRevokeKey?: (id: string) => void;
  className?: string;
}

const DEFAULT_KEYS: ApiKeyItem[] = [
  {
    id: "key_prod_01",
    name: "Production Stripe Ingest",
    keyPrefix: "zl_live_89f0...4a12",
    fullSecret: "zl_live_89f0c29487b14a12ec8401",
    createdDate: "Nov 10, 2026",
    lastUsedDate: "4 mins ago",
    scopes: ["telemetry:write", "webhooks:read"],
  },
  {
    id: "key_dev_02",
    name: "Staging Cluster Sync",
    keyPrefix: "zl_test_33a1...9b77",
    fullSecret: "zl_test_33a19e88b2019b77fa1120",
    createdDate: "Nov 02, 2026",
    lastUsedDate: "Yesterday",
    scopes: ["cluster:read"],
  },
];

export function ApiKeyVault({
  keys = DEFAULT_KEYS,
  onGenerateKey,
  onRevokeKey,
  className = "",
}: ApiKeyVaultProps) {
  const { tokens, scaled } = useZeroLight();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const primaryColor = scaled.chartPrimaryColor || tokens.primaryButtonColor || "#10B981";
  const borderColor = tokens.universalBorderColor || "#E4E4E7";
  const surfaceColor = tokens.universalFillColor || "#FFFFFF";
  const textColor = tokens.textIconColor || "#18181B";

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      data-testid="zerolight-api-key-vault"
      style={{
        borderRadius: `${scaled.scaledCardRadius}px`,
        borderColor,
        borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
        backgroundColor: surfaceColor,
        color: textColor,
        boxShadow: scaled.cardShadow,
        fontFamily: scaled.resolvedFontFamily,
      }}
      className={`border overflow-hidden transition-all ${className}`}
    >
      <div
        style={{ borderColor }}
        className="flex items-center justify-between px-5 py-4 border-b"
      >
        <div className="flex items-center gap-2.5">
          <div
            style={{
              borderRadius: `${Math.max(4, scaled.scaledOptionRadius)}px`,
              backgroundColor: tokens.hoverBackplateTint || "rgba(0,0,0,0.04)",
              color: primaryColor,
            }}
            className="w-7 h-7 flex items-center justify-center shrink-0 border border-current/10"
          >
            <Key size={14} />
          </div>
          <div>
            <h3
              style={{
                fontFamily: scaled.resolvedHeadingFontFamily,
                fontWeight: scaled.headingWeight,
              }}
              className="text-sm font-semibold"
            >
              Developer API Keys
            </h3>
            <p className="text-xs opacity-60">Authentication tokens for edge ingestion and SDK automation</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onGenerateKey?.("New API Key", ["read", "write"])}
          style={{
            borderRadius: `${Math.max(6, scaled.scaledRadius)}px`,
            backgroundColor: primaryColor,
            color: "#FFFFFF",
          }}
          className="px-3 py-1.5 text-xs font-medium hover:opacity-95 transition-opacity cursor-pointer shadow-xs"
        >
          Generate New Key
        </button>
      </div>

      <div className="divide-y" style={{ borderColor }}>
        {keys.map((k) => {
          const isRevealed = revealedIds.has(k.id);
          const isCopied = copiedId === k.id;
          const displayKey = isRevealed ? (k.fullSecret || k.keyPrefix) : k.keyPrefix;

          return (
            <div key={k.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{k.name}</span>
                  <div className="flex items-center gap-1">
                    {k.scopes.map((s) => (
                      <span
                        key={s}
                        style={{
                          borderRadius: `${Math.max(3, scaled.scaledOptionRadius)}px`,
                          backgroundColor: tokens.hoverBackplateTint,
                        }}
                        className="px-1.5 py-0.5 text-[10px] opacity-75 font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] opacity-60">
                  <span>Created {k.createdDate}</span>
                  <span>•</span>
                  <span>Last used {k.lastUsedDate || "Never"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div
                  style={{
                    borderRadius: `${Math.max(4, scaled.scaledOptionRadius)}px`,
                    backgroundColor: tokens.hoverBackplateTint,
                    borderColor,
                  }}
                  className="px-2.5 py-1.5 font-mono text-[11px] border tracking-wider flex items-center gap-2 tabular-nums"
                >
                  <span>{displayKey}</span>
                  <button
                    type="button"
                    aria-label={isRevealed ? "Hide API key" : "Reveal API key"}
                    onClick={() => toggleReveal(k.id)}
                    className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>

                <button
                  type="button"
                  aria-label="Copy API key"
                  onClick={() => handleCopy(k.id, k.fullSecret || k.keyPrefix)}
                  style={{
                    borderRadius: `${Math.max(4, scaled.scaledOptionRadius)}px`,
                    borderColor,
                  }}
                  className="p-1.5 border opacity-75 hover:opacity-100 transition-all cursor-pointer"
                >
                  {isCopied ? <Check size={14} style={{ color: primaryColor }} /> : <Copy size={14} />}
                </button>

                <button
                  type="button"
                  aria-label="Revoke API key"
                  onClick={() => onRevokeKey?.(k.id)}
                  style={{
                    borderRadius: `${Math.max(4, scaled.scaledOptionRadius)}px`,
                  }}
                  className="p-1.5 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
