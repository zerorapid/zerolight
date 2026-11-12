"use client";

import React, { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useZeroLight } from "../context";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

/**
 * Generic accessible portaled Modal / Dialog with Framer Motion spring and CLS-free body scroll lock.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
  className = "",
}: ModalProps) {
  const { tokens, scaled } = useZeroLight();
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => {
            if (closeOnOverlayClick) onClose();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descId : undefined}
            initial={scaled.motionConfig.popover.initial}
            animate={scaled.motionConfig.popover.animate}
            exit={scaled.motionConfig.popover.exit}
            transition={scaled.motionConfig.modalTransition}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: tokens.universalFillColor,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
              borderRadius: `${scaled.scaledCardRadius}px`,
              color: tokens.textIconColor,
            }}
            className={`w-full ${SIZE_CLASSES[size]} border p-6 shadow-2xl font-sans ${className}`}
          >
            {(title || description) && (
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="min-w-0">
                  {title && (
                    <h2
                      id={titleId}
                      style={{ fontSize: `${scaled.headingFontSize}px` }}
                      className="font-semibold tracking-tight"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      id={descId}
                      style={{ fontSize: `${scaled.sublabelFontSize}px` }}
                      className="opacity-65 mt-1 leading-relaxed"
                    >
                      {description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  style={{ color: tokens.textIconColor }}
                  className="p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {children && <div className="text-sm">{children}</div>}

            {footer && (
              <div
                style={{ borderColor: tokens.universalBorderColor }}
                className="mt-5 pt-4 border-t flex items-center justify-end gap-2"
              >
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export const Dialog = Modal;
