"use client";

import React, { useState, useEffect } from "react";
import { useZeroLight } from "../context";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, ArrowRight, CornerDownLeft } from "lucide-react";
import { Kbd } from "../atoms/kbd";

export interface CommandItem {
  id: string;
  title: string;
  category: string;
  shortcut?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CommandItem[];
}

const DEFAULT_COMMANDS: CommandItem[] = [
  { id: "1", title: "View Cloud Infrastructure Nodes", category: "Navigation", shortcut: "G N", onSelect: () => {} },
  { id: "2", title: "Open Cluster Metrics & Sparklines", category: "Telemetry", shortcut: "G M", onSelect: () => {} },
  { id: "3", title: "Decommission Selected Worker Nodes", category: "Actions", shortcut: "⌥ ⌫", onSelect: () => {} },
  { id: "4", title: "Export Theme Tokens as JSON", category: "Design System", shortcut: "⌘ E", onSelect: () => {} },
  { id: "5", title: "Switch to Dark Mode Studio", category: "Settings", shortcut: "⌘ D", onSelect: () => {} },
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
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      } else if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIdx((prev) => (prev + 1) % Math.max(1, filtered.length));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIdx((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
        } else if (e.key === "Enter" && filtered[selectedIdx]) {
          e.preventDefault();
          filtered[selectedIdx].onSelect();
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, filtered, selectedIdx]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center p-4 pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={scaled.motionConfig.modalTransition}
            style={{
              borderRadius: `${scaled.scaledCardRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.universalFillColor,
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
            }}
            className="w-full max-w-lg border shadow-2xl overflow-hidden select-none transform-gpu"
          >
            {/* Search Input Bar */}
            <div
              style={{
                borderColor: tokens.universalBorderColor,
                borderBottomWidth: `${tokens.borderWidth}px`,
              }}
              className="flex items-center gap-3 px-4 py-3.5 border-b"
            >
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or search action..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                className="w-full bg-transparent outline-none font-medium placeholder:text-neutral-400"
              />
              <Kbd className="shrink-0">ESC</Kbd>
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
                      className="w-full px-3 py-2.5 flex items-center justify-between text-left cursor-pointer transition-colors"
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
                        {item.shortcut && <Kbd>{item.shortcut}</Kbd>}
                        {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-neutral-400" />}
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
              className="px-4 py-2 bg-neutral-50 text-[11px] text-neutral-400 flex items-center justify-between border-t"
            >
              <span>Navigation: ↑ ↓ • Select: ↵</span>
              <span className="flex items-center gap-1 font-medium">ZeroLight ⌘K</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
