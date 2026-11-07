"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sliders, CheckCircle2 } from "lucide-react";
import { Button } from "../atoms/button";

export interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  onSave?: () => void;
}

export function DetailDrawer({
  isOpen,
  onClose,
  title = "Node Diagnostic Sheet",
  subtitle = "us-east-prod-01 (API Gateway)",
  onSave,
}: DetailDrawerProps) {
  const { tokens, scaled } = useZeroLight();
  const [activeTab, setActiveTab] = useState<"overview" | "metrics" | "logs">("overview");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={scaled.motionConfig.drawerTransition}
            style={{
              borderColor: tokens.universalBorderColor,
              borderWidth: 0,
              borderLeftWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.universalFillColor,
            }}
            className="w-full max-w-[420px] h-full border-l shadow-2xl flex flex-col justify-between select-none transform-gpu"
          >
            {/* Drawer Header */}
            <div
              style={{ borderColor: tokens.universalBorderColor, borderBottomWidth: `${tokens.borderWidth}px` }}
              className="p-5 border-b flex items-start justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-neutral-500" />
                  <h3 style={{ color: tokens.textIconColor }} className="font-semibold text-sm">
                    {title}
                  </h3>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer p-1 rounded-full"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div
              style={{ borderColor: tokens.universalBorderColor, borderBottomWidth: `${tokens.borderWidth}px` }}
              className="px-5 pt-2 border-b flex items-center gap-4 text-xs font-semibold text-neutral-500"
            >
              {(["overview", "metrics", "logs"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveTab(t)}
                  className={`pb-2.5 capitalize cursor-pointer transition-colors relative ${
                    activeTab === t ? "text-neutral-900 border-b-2 border-neutral-900" : "hover:text-neutral-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
              <div
                style={{
                  borderRadius: `${scaled.scaledRadius}px`,
                  backgroundColor: tokens.hoverBackplateTint,
                  borderColor: tokens.universalBorderColor,
                  borderWidth: `${tokens.borderWidth}px`,
                }}
                className="p-3 border space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Instance ID</span>
                  <span className="font-semibold tabular-nums font-sans">i-04f828a1c9</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Health State</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">VPC Network</span>
                  <span className="font-medium">vpc-prod-east-1</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-neutral-500 font-medium block">Allocated Resources</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50">
                    <div className="text-[10px] text-neutral-400 uppercase font-bold">Memory</div>
                    <div className="text-sm font-bold tabular-nums">4.2 / 8.0 GB</div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50">
                    <div className="text-[10px] text-neutral-400 uppercase font-bold">CPU Usage</div>
                    <div className="text-sm font-bold tabular-nums">24% Load</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div
              style={{ borderColor: tokens.universalBorderColor, borderTopWidth: `${tokens.borderWidth}px` }}
              className="p-4 border-t flex items-center justify-end gap-2 bg-neutral-50/50"
            >
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onSave?.();
                  onClose();
                }}
              >
                Save Changes
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
