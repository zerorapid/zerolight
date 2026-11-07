"use client";

import React, { useState, useEffect } from "react";
import { useZeroLight } from "../context";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, ArrowRight, CornerDownLeft, X } from "lucide-react";

export interface CommandItem {
  id: string;
  title: string;
  category: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CommandItem[];
}

const DEFAULT_COMMANDS: CommandItem[] = [
  { id: "1", title: "View Cloud Infrastructure Nodes", category: "Navigation", onSelect: () => {} },
  { id: "2", title: "Open Cluster Metrics & Sparklines", category: "Telemetry", onSelect: () => {} },
  { id: "3", title: "Decommission Selected Worker Nodes", category: "Actions", onSelect: () => {} },
  { id: "4", title: "Export Theme Tokens as JSON", category: "Design System", onSelect: () => {} },
  { id: "5", title: "Switch to Dark Mode Studio", category: "Settings", onSelect: () => {} },
];

export function CommandPalette({
  isOpen,
  onClose,
  items = DEFAULT_COMMANDS,
}: CommandPaletteProps) {
  const { tokens, scaled } = useZeroLight();
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === "Enter" && filtered[selectedIdx]) {
        e.preventDefault();
        filtered[selectedIdx].onSelect();
        onClose();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIdx, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-[12vh] px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={scaled.motionConfig.spring}
            style={{
              borderRadius: `${scaled.scaledCardRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.universalFillColor,
              boxShadow: scaled.cardShadow,
            }}
            className="w-full max-w-[calc(100vw-2rem)] sm:max-w-lg border shadow-2xl overflow-hidden select-none transform-gpu"
          >
            {/* Search Input Bar */}
            <div
              style={{
                borderColor: tokens.universalBorderColor,
                borderBottomWidth: `${tokens.borderWidth}px`,
              }}
              className="flex items-center gap-3 px-4 py-3.5 border-b"
            >
              <Search
                size={scaled.iconSmSize || 16}
                strokeWidth={tokens.iconStrokeWidth || 1.75}
                color={tokens.iconColor || tokens.textIconColor}
                className="shrink-0"
              />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or search action..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                className="w-full bg-transparent outline-none font-medium placeholder:text-neutral-400"
              />
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer transition-colors shrink-0"
                aria-label="Close command palette"
                title="Close"
              >
                <X
                  size={scaled.iconSmSize || 16}
                  strokeWidth={tokens.iconStrokeWidth || 1.75}
                  color={tokens.iconColor || tokens.textIconColor}
                />
              </button>
            </div>

            {/* Command List */}
            <div className="p-2 max-h-72 overflow-y-auto space-y-1">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-400 font-medium">
                  No matching commands found.
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isSelected = idx === selectedIdx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        item.onSelect();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIdx(idx)}
                      style={{
                        borderRadius: `${scaled.scaledRadius}px`,
                        backgroundColor: isSelected ? tokens.hoverBackplateTint : "transparent",
                      }}
                      className="group w-full px-3 py-2.5 flex items-center justify-between text-left cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 shrink-0">
                          {item.category}
                        </span>
                        <span
                          style={{
                            fontSize: `${scaled.scaledFontSize}px`,
                            color: tokens.textIconColor,
                          }}
                          className="font-medium truncate"
                        >
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isSelected ? (
                          <CornerDownLeft
                            size={14}
                            strokeWidth={tokens.iconStrokeWidth || 1.75}
                            color={tokens.primaryButtonColor}
                          />
                        ) : (
                          <ArrowRight
                            size={14}
                            strokeWidth={tokens.iconStrokeWidth || 1.75}
                            className="text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                borderColor: tokens.universalBorderColor,
                borderTopWidth: `${tokens.borderWidth}px`,
              }}
              className="px-4 py-2 bg-neutral-50/80 text-[11px] text-neutral-400 flex items-center justify-between border-t"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <Command size={12} strokeWidth={tokens.iconStrokeWidth || 1.75} />
                <span>Command & Quick Action Launcher</span>
              </span>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1 text-neutral-400 hover:text-neutral-700 cursor-pointer transition-colors"
              >
                <X size={12} strokeWidth={2} />
                <span>Close</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
