"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { useZeroLight } from "../context";
import { Send, Paperclip, Smile, Mic } from "lucide-react";
import { motion } from "framer-motion";

export interface ChatInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  onSend: (message: string) => void;
  onAttach?: () => void;
  disabled?: boolean;
  className?: string;
}

export function ChatInput({
  placeholder = "Write a message or prompt...",
  value: controlledValue,
  onChange,
  onSend,
  onAttach,
  disabled = false,
  className = "",
}: ChatInputProps) {
  const { tokens, scaled } = useZeroLight();
  const [internalValue, setInternalValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleInputChange = (text: string) => {
    if (controlledValue === undefined) {
      setInternalValue(text);
    }
    onChange?.(text);
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    if (controlledValue === undefined) {
      setInternalValue("");
    }
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    target.style.height = "auto";
    target.style.height = `${Math.min(target.scrollHeight, 140)}px`;
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledRadius === 0 ? 0 : Math.max(8, scaled.scaledRadius)}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: scaled.effectiveInputFill,
        transition: scaled.transitionStyle,
      }}
      className={`border shadow-2xs p-2.5 flex flex-col gap-2 w-full focus-within:ring-2 focus-within:ring-black/10 transition-shadow ${className}`}
    >
      {/* Auto-growing Textarea */}
      <textarea
        ref={inputRef}
        rows={1}
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onInput={handleTextareaInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          fontSize: `${scaled.scaledFontSize}px`,
          color: tokens.textIconColor,
        }}
        className="w-full bg-transparent outline-none resize-none min-h-[38px] max-h-[140px] leading-relaxed placeholder:text-neutral-400 font-normal"
      />

      {/* Composer Bottom Toolbar */}
      <div className="flex items-center justify-between pt-1 select-none border-t border-neutral-100">
        {/* Left media actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onAttach}
            disabled={disabled}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded cursor-pointer transition-colors"
            title="Attach file"
          >
            <Paperclip
              size={scaled.iconSmSize || 16}
              strokeWidth={tokens.iconStrokeWidth || 1.75}
              color={tokens.iconColor || tokens.textIconColor}
            />
          </button>

          <button
            type="button"
            disabled={disabled}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded cursor-pointer transition-colors"
            title="Add emoji"
          >
            <Smile
              size={scaled.iconSmSize || 16}
              strokeWidth={tokens.iconStrokeWidth || 1.75}
              color={tokens.iconColor || tokens.textIconColor}
            />
          </button>

          <button
            type="button"
            disabled={disabled}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded cursor-pointer transition-colors"
            title="Voice input"
          >
            <Mic
              size={scaled.iconSmSize || 16}
              strokeWidth={tokens.iconStrokeWidth || 1.75}
              color={tokens.iconColor || tokens.textIconColor}
            />
          </button>
        </div>

        {/* Right Send Action Button */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: canSend ? 0.94 : 1 }}
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            style={{
              backgroundColor: canSend ? tokens.primaryButtonColor : "transparent",
              color: canSend ? scaled.primaryActionTextColor : "#A1A1AA",
              borderRadius: `${scaled.scaledPillRadius}px`,
              transition: scaled.transitionStyle,
            }}
            className={`p-2 flex items-center justify-center transition-all ${
              canSend ? "shadow-2xs cursor-pointer opacity-100" : "opacity-40 cursor-not-allowed"
            }`}
            aria-label="Send message"
          >
            <Send
              size={scaled.iconSmSize || 14}
              strokeWidth={tokens.iconStrokeWidth || 2}
            />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
