"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { useZeroLight } from "../context";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sliders, CheckCircle2, Check } from "lucide-react";
import { Button } from "../atoms/button";

export interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  onSave?: () => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export function DetailDrawer({
  isOpen,
  onClose,
  title = "Node Diagnostic Sheet",
  subtitle = "us-east-prod-01 (API Gateway)",
  onSave,
  children,
  footer,
}: DetailDrawerProps) {
  const { tokens, scaled } = useZeroLight();
  const [activeTab, setActiveTab] = useState<"overview" | "metrics" | "logs">("overview");
  const [mounted, setMounted] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Body Scroll Lock with Layout Shift Compensation (CLS = 0)
  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  // Focus Trap & Escape Key Listener
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          dir={scaled.direction}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            ref={drawerRef}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={scaled.motionConfig.transition}
            style={{
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              borderStyle: "solid",
              borderRadius: `${scaled.scaledCardRadius}px`,
              backgroundColor: tokens.universalFillColor,
            }}
            className={`w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl flex flex-col justify-between select-none transform-gpu ${
              scaled.isRtl ? "text-right" : "text-left"
            }`}
          >
            {/* Drawer Header */}
            <div
              style={{ borderColor: tokens.universalBorderColor, borderBottomWidth: `${tokens.borderWidth}px` }}
              className="p-5 border-b flex items-start justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-neutral-500 shrink-0" />
                  <h3
                    id={titleId}
                    title={title}
                    style={{ color: tokens.textIconColor }}
                    className="font-semibold text-sm truncate max-w-[260px]"
                  >
                    {title}
                  </h3>
                </div>
                <p
                  id={descId}
                  title={subtitle}
                  className="text-xs text-neutral-500 mt-0.5 truncate max-w-[260px]"
                >
                  {subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer p-1 rounded-full hover:bg-neutral-100 transition-colors"
                aria-label="Close drawer"
                title="Close"
              >
                <X
                  size={scaled.iconSmSize || 16}
                  strokeWidth={tokens.iconStrokeWidth || 1.75}
                  color={tokens.iconColor || tokens.textIconColor}
                />
              </button>
            </div>

            {/* If children provided, render children directly */}
            {children ? (
              <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
                {children}
              </div>
            ) : (
              <>
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
                      style={
                        activeTab === t
                          ? { color: tokens.textIconColor, borderColor: tokens.primaryButtonColor }
                          : undefined
                      }
                      className={`pb-2.5 capitalize cursor-pointer transition-colors relative ${
                        activeTab === t ? "border-b-2" : "opacity-75 hover:opacity-100"
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
                      <div
                        style={{
                          backgroundColor: tokens.hoverBackplateTint,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                        }}
                        className="p-2.5 rounded-lg border"
                      >
                        <div className="text-[10px] text-neutral-400 uppercase font-bold">Memory</div>
                        <div className="text-sm font-bold tabular-nums">4.2 / 8.0 GB</div>
                      </div>
                      <div
                        style={{
                          backgroundColor: tokens.hoverBackplateTint,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                        }}
                        className="p-2.5 rounded-lg border"
                      >
                        <div className="text-[10px] text-neutral-400 uppercase font-bold">CPU Usage</div>
                        <div className="text-sm font-bold tabular-nums">24% Load</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Drawer Footer */}
            {footer ? (
              <div
                style={{
                  borderColor: tokens.universalBorderColor,
                  borderTopWidth: `${tokens.borderWidth}px`,
                  backgroundColor: tokens.hoverBackplateTint,
                }}
                className="p-4 border-t flex items-center"
              >
                {footer}
              </div>
            ) : (
              <div
                style={{
                  borderColor: tokens.universalBorderColor,
                  borderTopWidth: `${tokens.borderWidth}px`,
                  backgroundColor: tokens.hoverBackplateTint,
                }}
                className="p-4 border-t flex items-center justify-end gap-2"
              >
                <Button
                  variant="outline"
                  size="sm"
                  iconLeft={<X />}
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  iconLeft={<Check />}
                  onClick={() => {
                    onSave?.();
                    onClose();
                  }}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
