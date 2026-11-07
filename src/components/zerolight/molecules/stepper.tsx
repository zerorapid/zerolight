"use client";

import React from "react";
import { useZeroLight } from "../context";
import { Check } from "lucide-react";

export interface StepItem {
  id: string;
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStepIndex: number;
  onStepClick?: (idx: number) => void;
  className?: string;
}

export function Stepper({
  steps,
  currentStepIndex,
  onStepClick,
  className = "",
}: StepperProps) {
  const { tokens, scaled } = useZeroLight();

  return (
    <div className={`flex items-start justify-between w-full select-none ${className}`}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStepIndex;
        const isCurrent = idx === currentStepIndex;
        const isPending = idx > currentStepIndex;

        return (
          <div key={step.id} className="flex-1 flex flex-col items-center relative text-center px-1">
            {/* Connecting Track Line */}
            {idx > 0 && (
              <div
                style={{
                  height: `${Math.max(1, tokens.borderWidth)}px`,
                  backgroundColor: idx <= currentStepIndex ? tokens.primaryButtonColor : "#E4E4E7",
                  transition: scaled.transitionStyle,
                  left: "-50%",
                  right: "50%",
                  top: "14px",
                }}
                className="absolute z-0"
              />
            )}

            {/* Step Circle Indicator */}
            <button
              type="button"
              disabled={!onStepClick}
              onClick={() => onStepClick?.(idx)}
              style={{
                borderRadius: `${scaled.scaledPillRadius}px`,
                backgroundColor: isCompleted || isCurrent ? tokens.primaryButtonColor : tokens.universalFillColor,
                borderColor: isCompleted || isCurrent ? tokens.primaryButtonColor : tokens.universalBorderColor,
                borderWidth: `${tokens.borderWidth}px`,
                color: isCompleted || isCurrent ? scaled.primaryActionTextColor : tokens.textIconColor,
                transition: scaled.transitionStyle,
              }}
              className={`w-7 h-7 flex items-center justify-center font-bold text-xs relative z-10 shadow-xs tabular-nums ${
                onStepClick ? "cursor-pointer" : "cursor-default"
              }`}
            >
              {isCompleted ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : idx + 1}
            </button>

            {/* Step Label */}
            <div className="mt-2 space-y-0.5">
              <span
                style={{
                  fontSize: `${scaled.sublabelFontSize}px`,
                  color: isCurrent ? tokens.textIconColor : isCompleted ? "#52525B" : "#A1A1AA",
                }}
                className={`block font-semibold ${isCurrent ? "font-bold" : ""}`}
              >
                {step.title}
              </span>
              {step.description && (
                <span className="text-[10px] text-neutral-400 hidden sm:block">
                  {step.description}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
