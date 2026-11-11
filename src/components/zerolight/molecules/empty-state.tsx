"use client";

import React from "react";
import { useZeroLight } from "../context";
import { Inbox } from "lucide-react";
import { Button } from "../atoms/button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className = "",
}: EmptyStateProps) {
  const { tokens, scaled } = useZeroLight();

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledCardRadius}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: tokens.universalFillColor,
      }}
      className={`p-8 text-center flex flex-col items-center justify-center space-y-4 border w-full max-w-md mx-auto select-none ${className}`}
    >
      <div
        style={{
          borderRadius: `${scaled.scaledPillRadius}px`,
          backgroundColor: tokens.hoverBackplateTint,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
        }}
        className="w-12 h-12 flex items-center justify-center text-neutral-400 border shadow-2xs"
      >
        {icon || <Inbox className="w-6 h-6" />}
      </div>

      <div className="space-y-1 max-w-sm">
        <h4 style={{ color: tokens.textIconColor }} className="text-sm font-semibold [text-wrap:balance]">
          {title}
        </h4>
        <p
          title={description}
          style={{ fontSize: `${scaled.sublabelFontSize}px` }}
          className="text-neutral-500 leading-relaxed line-clamp-3"
        >
          {description}
        </p>
      </div>

      {(actionText || secondaryActionText) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          {actionText && (
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionText}
            </Button>
          )}
          {secondaryActionText && (
            <Button variant="outline" size="sm" onClick={onSecondaryAction}>
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
