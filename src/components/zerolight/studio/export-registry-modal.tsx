"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Code2, Copy, X } from "lucide-react";
import { ZeroLightTokens } from "../types";
import {
  RegistryIndexItem,
  RegistryItemDetail,
  getExportSnippet,
} from "./studio-export";

export interface ExportRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: ZeroLightTokens;
  exportFormat: "tailwind" | "css" | "json" | "registry";
  setExportFormat: (fmt: "tailwind" | "css" | "json" | "registry") => void;
  isExportCopied: boolean;
  setIsExportCopied: (val: boolean) => void;
  registryItems: RegistryIndexItem[];
  registryTier: "all" | "atoms" | "molecules" | "organisms" | "templates" | "views" | "core";
  setRegistryTier: (tier: "all" | "atoms" | "molecules" | "organisms" | "templates" | "views" | "core") => void;
  registryQuery: string;
  setRegistryQuery: (q: string) => void;
  selectedRegistryName: string;
  setSelectedRegistryName: (name: string) => void;
  selectedRegistryDetail: RegistryItemDetail | null;
  isRegistryLoading: boolean;
  triggerToast: (msg: string) => void;
}

export function ExportRegistryModal({
  isOpen,
  onClose,
  tokens,
  exportFormat,
  setExportFormat,
  isExportCopied,
  setIsExportCopied,
  registryItems,
  registryTier,
  setRegistryTier,
  registryQuery,
  setRegistryQuery,
  selectedRegistryName,
  setSelectedRegistryName,
  selectedRegistryDetail,
  isRegistryLoading,
  triggerToast,
}: ExportRegistryModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${exportFormat === "registry" ? "max-w-4xl" : "max-w-xl"} bg-[#121214] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden text-neutral-100 space-y-0 transition-all`}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#27272A] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {exportFormat === "registry" ? "ZeroLight Component Registry" : "Export Design Tokens"}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {exportFormat === "registry"
                      ? "Browse & copy standalone Shadcn-style TSX source with resolved dependencies"
                      : "Copy configured tokens directly to your SaaS project"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Format Switcher Tabs & Copy Action */}
            <div className="p-4 bg-[#18181B] border-b border-[#27272A] flex flex-wrap items-center justify-between gap-3">
              <div className="p-1 bg-[#121214] rounded-lg border border-[#27272A] flex flex-wrap items-center gap-1 text-xs">
                {(
                  [
                    { key: "tailwind", label: "Tailwind CSS" },
                    { key: "css", label: "CSS Variables" },
                    { key: "json", label: "TypeScript / JSON" },
                    { key: "registry", label: "Component TSX" },
                  ] as const
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setExportFormat(key)}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                      exportFormat === key
                        ? "bg-white text-black font-semibold shadow-xs"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const snippet =
                    exportFormat === "registry"
                      ? selectedRegistryDetail?.files?.[0]?.content || ""
                      : getExportSnippet(exportFormat, tokens);
                  if (!snippet) return;
                  navigator.clipboard.writeText(snippet);
                  setIsExportCopied(true);
                  triggerToast(
                    exportFormat === "registry"
                      ? `Copied ${selectedRegistryName}.tsx to clipboard`
                      : "Token configuration copied to clipboard"
                  );
                  setTimeout(() => setIsExportCopied(false), 2000);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0 select-none"
              >
                {isExportCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{exportFormat === "registry" ? "Copy TSX" : "Copy Snippet"}</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Preview / Shadcn-Style Registry Explorer */}
            {exportFormat === "registry" ? (
              <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] bg-[#0C0C0E] h-[440px]">
                <div className="border-b md:border-b-0 md:border-r border-[#27272A] flex flex-col h-full overflow-hidden">
                  <div className="p-3 space-y-2 border-b border-[#27272A]/80">
                    <input
                      type="text"
                      value={registryQuery}
                      onChange={(e) => setRegistryQuery(e.target.value)}
                      placeholder="Search 97 components..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#18181B] border border-[#27272A] text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400"
                    />
                    <div className="flex flex-wrap gap-1">
                      {(
                        [
                          { key: "all", label: "All" },
                          { key: "atoms", label: "Atoms" },
                          { key: "molecules", label: "Molecules" },
                          { key: "organisms", label: "Organisms" },
                          { key: "templates", label: "Templates" },
                          { key: "core", label: "Core" },
                        ] as const
                      ).map(({ key, label }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setRegistryTier(key)}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium cursor-pointer transition-colors ${
                            registryTier === key
                              ? "bg-white text-black font-semibold"
                              : "bg-[#18181B] text-neutral-400 hover:text-neutral-200"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {registryItems
                      .filter((item) => {
                        const matchesTier = registryTier === "all" || item.tier === registryTier;
                        const q = registryQuery.trim().toLowerCase();
                        const matchesQuery =
                          !q ||
                          item.name.toLowerCase().includes(q) ||
                          item.title.toLowerCase().includes(q);
                        return matchesTier && matchesQuery;
                      })
                      .map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setSelectedRegistryName(item.name)}
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                            selectedRegistryName === item.name
                              ? "bg-white text-black font-semibold"
                              : "text-neutral-300 hover:bg-[#18181B]"
                          }`}
                        >
                          <span className="truncate">{item.title}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded tabular-nums shrink-0 ${
                              selectedRegistryName === item.name
                                ? "bg-black/10 text-black"
                                : "bg-[#1F1F23] text-neutral-400"
                            }`}
                          >
                            {item.lines}L
                          </span>
                        </button>
                      ))}
                  </div>
                </div>

                <div className="flex flex-col h-full overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-[#27272A]/80 bg-[#141417] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-white">
                        {selectedRegistryDetail?.files?.[0]?.path || `src/components/zerolight/${selectedRegistryName}.tsx`}
                      </div>
                      <div className="text-[11px] text-neutral-400 tabular-nums">
                        CLI: npm run registry:add -- {selectedRegistryName}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-1">
                      {(selectedRegistryDetail?.registryDependencies || []).map((dep) => (
                        <button
                          key={dep}
                          type="button"
                          onClick={() => setSelectedRegistryName(dep)}
                          className="px-2 py-0.5 rounded bg-[#27272A] hover:bg-[#3F3F46] text-[10px] text-neutral-200 cursor-pointer"
                        >
                          +{dep}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <pre className="text-xs leading-relaxed text-neutral-300 font-sans tabular-nums whitespace-pre overflow-x-auto p-3.5 rounded-xl bg-[#141417] border border-[#232328]">
                      {isRegistryLoading && !selectedRegistryDetail
                        ? "Loading component source..."
                        : selectedRegistryDetail?.files?.[0]?.content || "Select a component from the list"}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 max-h-[380px] overflow-y-auto bg-[#0C0C0E]">
                <pre className="text-xs leading-relaxed text-neutral-300 font-sans tabular-nums whitespace-pre overflow-x-auto p-3.5 rounded-xl bg-[#141417] border border-[#232328]">
                  {getExportSnippet(exportFormat, tokens)}
                </pre>
              </div>
            )}

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-[#27272A] bg-[#141417] flex items-center justify-between text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span>Values synchronize live with Visual Studio</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 text-xs text-neutral-300 hover:text-white cursor-pointer font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
