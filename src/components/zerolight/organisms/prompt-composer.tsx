"use client";

import React, { useState } from "react";
import { Send, Square, Paperclip, X } from "lucide-react";
import { useZeroLight } from "../context";
import { Button } from "../atoms/button";

export interface PromptContextChip {
  id: string;
  label: string;
}

export interface PromptComposerProps {
  value?: string;
  onChange?: (val: string) => void;
  onSubmit?: (prompt: string, contextIds: string[]) => void;
  onStop?: () => void;
  onAttach?: () => void;
  isGenerating?: boolean;
  placeholder?: string;
  models?: string[];
  selectedModel?: string;
  onModelChange?: (model: string) => void;
  contextChips?: PromptContextChip[];
  onRemoveContext?: (id: string) => void;
  className?: string;
}

/**
 * Multimodal AI prompt composer with context chips, model selector,
 * attachment trigger, and streaming stop control.
 */
export function PromptComposer({
  value: controlledValue,
  onChange,
  onSubmit,
  onStop,
  onAttach,
  isGenerating = false,
  placeholder = "Ask ZeroLight AI to build or analyze...",
  models = ["Gemini 2.5 Pro", "Claude Sonnet", "GPT-5"],
  selectedModel,
  onModelChange,
  contextChips = [],
  onRemoveContext,
  className = "",
}: PromptComposerProps) {
  const { tokens, scaled } = useZeroLight();
  const [internal, setInternal] = useState("");
  const [internalModel, setInternalModel] = useState(models[0] || "Default");
  const text = controlledValue !== undefined ? controlledValue : internal;
  const activeModel = selectedModel || internalModel;

  const setText = (next: string) => {
    if (controlledValue === undefined) setInternal(next);
    onChange?.(next);
  };

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || isGenerating) return;
    onSubmit?.(
      trimmed,
      contextChips.map((c) => c.id)
    );
    if (controlledValue === undefined) setInternal("");
  };

  return (
    <div
      style={{
        backgroundColor: tokens.universalFillColor,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
        borderStyle: "solid",
        borderRadius: `${scaled.scaledCardRadius}px`,
        boxShadow: scaled.cardShadow,
        color: tokens.textIconColor,
        fontFamily: scaled.resolvedFontFamily,
      }}
      className={`p-3 space-y-2.5 ${className}`}
    >
      {contextChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {contextChips.map((chip) => (
            <span
              key={chip.id}
              style={{
                backgroundColor: tokens.hoverBackplateTint,
                borderColor: tokens.universalBorderColor,
                borderRadius: `${scaled.scaledPillRadius}px`,
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-medium border"
            >
              <span>{chip.label}</span>
              {onRemoveContext && (
                <button
                  type="button"
                  onClick={() => onRemoveContext(chip.id)}
                  aria-label={`Remove ${chip.label}`}
                  className="opacity-60 hover:opacity-100 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      <textarea
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder={placeholder}
        className="w-full resize-none bg-transparent text-sm focus:outline-none"
      />

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t" style={{ borderColor: tokens.universalBorderColor }}>
        <div className="flex items-center gap-2">
          {onAttach && (
            <Button variant="ghost" size="sm" onClick={onAttach} iconLeft={<Paperclip className="w-3.5 h-3.5" />}>
              Attach
            </Button>
          )}
          <select
            value={activeModel}
            onChange={(e) => {
              setInternalModel(e.target.value);
              onModelChange?.(e.target.value);
            }}
            style={{
              backgroundColor: tokens.hoverBackplateTint,
              borderColor: tokens.universalBorderColor,
              borderRadius: `${scaled.scaledRadius}px`,
            }}
            className="px-2 py-1 text-xs font-medium border focus:outline-none cursor-pointer"
          >
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {isGenerating ? (
          <Button variant="outline" size="sm" onClick={onStop} iconLeft={<Square className="w-3 h-3" />}>
            Stop
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            disabled={!text.trim()}
            onClick={handleSubmit}
            iconLeft={<Send className="w-3.5 h-3.5" />}
          >
            Send
          </Button>
        )}
      </div>
    </div>
  );
}
