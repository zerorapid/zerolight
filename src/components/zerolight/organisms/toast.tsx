"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useZeroLight } from "../context";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  action?: ToastAction;
  duration?: number; // ms, default: 4000
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { tokens, scaled } = useZeroLight();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "info", action, duration = 4000 }: ToastOptions) => {
      const id = "toast-" + Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, title, description, variant, action, duration };

      setToasts((prev) => [...prev.slice(-3), newToast]); // keep max 4 toasts

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    [dismiss]
  );

  const getVariantStyles = (variant: ToastVariant) => {
    switch (variant) {
      case "success":
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
          border: "#A7F3D0",
          bg: "#FFFFFF",
          badge: "bg-emerald-50 text-emerald-700",
        };
      case "error":
        return {
          icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />,
          border: "#FECACA",
          bg: "#FFFFFF",
          badge: "bg-rose-50 text-rose-700",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />,
          border: "#FDE68A",
          bg: "#FFFFFF",
          badge: "bg-amber-50 text-amber-700",
        };
      case "info":
      default:
        return {
          icon: <Info className="w-4 h-4 text-blue-600 shrink-0" />,
          border: tokens.universalBorderColor,
          bg: "#FFFFFF",
          badge: "bg-blue-50 text-blue-700",
        };
    }
  };

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}

      {/* Floating Toast Viewport */}
      <aside
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const v = getVariantStyles(t.variant || "info");
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                transition={scaled.motionConfig.spring}
                style={{
                  borderRadius: `${scaled.scaledRadius}px`,
                  borderColor: v.border,
                  borderWidth: `${tokens.borderWidth}px`,
                  backgroundColor: v.bg,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                }}
                className="p-3.5 border pointer-events-auto flex items-start gap-3 relative overflow-hidden"
              >
                {/* Variant Icon */}
                <div className="mt-0.5">{v.icon}</div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="text-xs font-bold text-neutral-900 leading-tight">
                    {t.title}
                  </h4>
                  {t.description && (
                    <p className="text-[11px] text-neutral-500 mt-1 leading-normal line-clamp-2">
                      {t.description}
                    </p>
                  )}
                  {t.action && (
                    <button
                      type="button"
                      onClick={() => {
                        t.action?.onClick();
                        dismiss(t.id);
                      }}
                      className="mt-2 text-xs font-bold text-neutral-900 underline hover:text-neutral-700 cursor-pointer"
                    >
                      {t.action.label}
                    </button>
                  )}
                </div>

                {/* Dismiss Button */}
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  className="text-neutral-400 hover:text-neutral-700 p-1 rounded cursor-pointer"
                  aria-label="Dismiss toast"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </aside>
    </ToastContext.Provider>
  );
}
