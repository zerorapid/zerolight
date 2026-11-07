"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
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

  const isVerified = inputText.trim() === verificationPhrase;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={scaled.motionConfig.modalTransition}
            style={{
              borderRadius: `${scaled.scaledCardRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.universalFillColor,
              boxShadow: scaled.cardShadow,
            }}
            className="w-full max-w-md p-6 border shadow-2xl space-y-5 select-none transform-gpu"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 style={{ color: tokens.textIconColor }} className="font-semibold text-sm">
                    {title}
                  </h3>
                  <p className="text-xs text-rose-600 font-medium">Irreversible destructive action</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer p-1 rounded-full"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-600 leading-relaxed">
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
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
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
    </AnimatePresence>
  );
}
