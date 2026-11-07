"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarStatus = "online" | "idle" | "offline" | "busy";

export interface AvatarProps {
  initials?: string;
  src?: string;
  alt?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
}

const SIZE_CONFIG: Record<
  AvatarSize,
  { dimension: number; fontSize: number; statusSize: number }
> = {
  xs: { dimension: 24, fontSize: 10, statusSize: 7 },
  sm: { dimension: 32, fontSize: 11, statusSize: 8 },
  md: { dimension: 40, fontSize: 13, statusSize: 10 },
  lg: { dimension: 48, fontSize: 15, statusSize: 12 },
  xl: { dimension: 64, fontSize: 20, statusSize: 14 },
};

export function Avatar({
  initials = "ZL",
  src,
  alt = "User Avatar",
  size = "md",
  status,
  className = "",
}: AvatarProps) {
  const { tokens, scaled } = useZeroLight();
  const [imageError, setImageError] = useState(false);

  const { dimension, fontSize, statusSize } = SIZE_CONFIG[size] || SIZE_CONFIG.md;

  const statusColors: Record<AvatarStatus, string> = {
    online: "#10B981",
    idle: "#F59E0B",
    offline: "#9CA3AF",
    busy: "#EF4444",
  };

  const borderRadius =
    scaled.scaledRadius === 0
      ? 0
      : tokens.cornerRadius === 999
      ? 9999
      : Math.max(4, Math.round(tokens.cornerRadius * tokens.scaleMultiplier * (dimension / 40)));

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <div
        style={{
          width: `${dimension}px`,
          height: `${dimension}px`,
          borderRadius: `${borderRadius}px`,
          backgroundColor: tokens.primaryButtonColor,
          color: scaled.primaryActionTextColor,
          fontSize: `${fontSize}px`,
          borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
          borderColor: tokens.universalBorderColor,
        }}
        className="flex items-center justify-center font-bold overflow-hidden shadow-2xs select-none transition-all"
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {status && (
        <span
          style={{
            width: `${statusSize}px`,
            height: `${statusSize}px`,
            backgroundColor: statusColors[status],
            borderColor: tokens.universalFillColor || "#FFFFFF",
            borderRadius: `${scaled.scaledRadius === 0 ? 0 : 9999}px`,
          }}
          className="absolute bottom-0 right-0 border-2 shadow-xs ring-1 ring-black/5"
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
}
