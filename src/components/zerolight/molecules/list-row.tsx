"use client";

import React from "react";
import { useZeroLight } from "../context";

export interface ListRowProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  leading?: React.ReactNode;
  meta?: React.ReactNode;
  trailing?: React.ReactNode;
  selected?: boolean;
  bordered?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Universal SaaS ListRow for people directories, settings rows, notification items, and selection lists.
 */
export function ListRow({
  title,
  subtitle,
  leading,
  meta,
  trailing,
  selected = false,
  bordered = true,
  onClick,
  className = "",
}: ListRowProps) {
  const { tokens, scaled } = useZeroLight();
  const interactive = Boolean(onClick);

  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      style={{
        backgroundColor: selected
          ? tokens.hoverBackplateTint
          : tokens.universalFillColor,
        borderColor: tokens.universalBorderColor,
        borderRadius: `${scaled.scaledInnerRadius}px`,
        color: tokens.textIconColor,
        transition: scaled.transitionStyle,
      }}
      className={`px-3.5 py-2.5 flex items-center justify-between gap-3 font-sans ${
        bordered ? "border" : ""
      } ${
        interactive
          ? "cursor-pointer hover:brightness-95 active:scale-[0.995]"
          : ""
      } ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {leading && <div className="shrink-0">{leading}</div>}
        <div className="min-w-0 flex-1">
          <div
            style={{ fontSize: `${scaled.scaledFontSize}px` }}
            className="font-medium truncate"
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{ fontSize: `${scaled.sublabelFontSize}px` }}
              className="opacity-65 truncate mt-0.5"
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {(meta || trailing) && (
        <div className="flex items-center gap-3 shrink-0">
          {meta && (
            <span
              style={{ fontSize: `${scaled.sublabelFontSize}px` }}
              className="opacity-60 tabular-nums whitespace-nowrap"
            >
              {meta}
            </span>
          )}
          {trailing}
        </div>
      )}
    </div>
  );
}
