"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { useZeroLight } from "../context";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Trash2 } from "lucide-react";
import { Button } from "../atoms/button";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  verificationPhrase?: string;
  confirmButtonText?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Decommission Microservice Node",
  description = "This action will immediately terminate the selected container instance and evict all active client sessions. Type DELETE below to proceed.",
  verificationPhrase = "DELETE",
  confirmButtonText = "Decommission Node",
}: ConfirmationModalProps) {
  const { tokens, scaled } = useZeroLight();
  const [inputText, setInputText] = useState("");
  const [mounted, setMounted] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Body Scroll Lock with Layout Shift Compensation (CLS = 0)
  useEffect(() => {
    if (!isOpen) {
      setInputText("");
      return;
    }

    previousActiveElement.current = document.activeElement as HTMLElement;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Auto-focus input on open
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);

    return () => {
      clearTimeout(timer);
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

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
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

  const isVerified = inputText.trim() === verificationPhrase;

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="alertdialog"
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
            ref={modalRef}
            initial={{ opacity: 0, scale: scaled.motionConfig.popover.initial.scale, y: scaled.motionConfig.distance }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: scaled.motionConfig.popover.exit.scale, y: scaled.motionConfig.distance }}
            transition={scaled.motionConfig.modalTransition}
            style={{
              borderRadius: `${scaled.scaledCardRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.universalFillColor,
              boxShadow: scaled.cardShadow,
            }}
            className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md p-6 border shadow-2xl space-y-5 select-none transform-gpu"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <AlertTriangle
                    size={scaled.iconSize || 20}
                    strokeWidth={tokens.iconStrokeWidth || 1.75}
                  />
                </div>
                <div>
                  <h3
                    id={titleId}
                    style={{ color: tokens.textIconColor }}
                    className="font-semibold text-sm [text-wrap:balance]"
                  >
                    {title}
                  </h3>
                  <p className="text-xs text-rose-600 font-medium">Irreversible destructive action</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer p-1 rounded-full hover:bg-neutral-100 transition-colors shrink-0"
                aria-label="Close modal"
              >
                <X
                  size={scaled.iconSmSize || 16}
                  strokeWidth={tokens.iconStrokeWidth || 1.75}
                  color={tokens.iconColor || tokens.textIconColor}
                />
              </button>
            </div>

            <p
              id={descId}
              title={description}
              style={{ fontSize: `${scaled.sublabelFontSize}px` }}
              className="text-neutral-600 leading-relaxed line-clamp-3"
            >
              {description}
            </p>

            <div className="space-y-1.5">
              <label
                htmlFor="confirm-phrase-input"
                style={{ fontSize: `${scaled.sublabelFontSize}px` }}
                className="font-medium text-neutral-500 block"
              >
                Type <strong className="text-neutral-900 font-bold">{verificationPhrase}</strong> to confirm:
              </label>
              <input
                ref={inputRef}
                id="confirm-phrase-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={verificationPhrase}
                style={{
                  borderRadius: `${scaled.scaledRadius}px`,
                  borderColor: tokens.universalBorderColor,
                  borderWidth: `${tokens.borderWidth}px`,
                  height: `${scaled.scaledHeight}px`,
                  fontSize: `${scaled.scaledFontSize}px`,
                  color: tokens.textIconColor,
                }}
                className="w-full border px-3 bg-transparent outline-none font-medium focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                iconLeft={<X />}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                iconLeft={<Trash2 />}
                disabled={!isVerified}
                onClick={() => {
                  if (isVerified) {
                    onConfirm();
                    onClose();
                  }
                }}
              >
                {confirmButtonText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
