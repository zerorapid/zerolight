"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  badge?: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({
  items,
  defaultOpenId,
  allowMultiple = false,
  className = "",
}: AccordionProps) {
  const { tokens, scaled } = useZeroLight();
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenId ? [defaultOpenId] : [items[0]?.id || ""]);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledCardRadius}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: tokens.universalFillColor,
      }}
      className={`divide-y divide-neutral-100 border overflow-hidden w-full select-none ${className}`}
    >
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="transition-colors">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-neutral-50/70 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span
                  style={{
                    fontSize: `${scaled.scaledFontSize}px`,
                    color: tokens.textIconColor,
                  }}
                  className="font-semibold text-xs"
                >
                  {item.title}
                </span>
                {item.badge && (
                  <span
                    style={{
                      borderRadius: `${scaled.scaledPillRadius}px`,
                    }}
                    className="text-[10px] font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 border border-neutral-200"
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <ChevronDown
                size={scaled.iconSmSize || 16}
                strokeWidth={tokens.iconStrokeWidth || 1.75}
                color={tokens.iconColor || tokens.textIconColor}
                className={`transition-transform duration-200 shrink-0 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={scaled.motionConfig.spring}
                  className="overflow-hidden"
                >
                  <div
                    style={{ fontSize: `${scaled.sublabelFontSize}px` }}
                    className="px-5 pb-4 text-neutral-600 leading-relaxed pt-1"
                  >
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
