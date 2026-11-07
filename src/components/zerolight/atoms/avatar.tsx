"use client";

import React from "react";
import { useZeroLight } from "../context";

export interface AvatarProps {
  initials?: string;
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  status?: "online" | "idle" | "offline" | "busy";
  className?: string;
}

export function Avatar({
  initials = "ZL",
  src,
  alt = "User Avatar",
  size = "md",
  status,
  className = "",
}: AvatarProps) {
  const { tokens, scaled } = useZeroLight();

  const dimension = size === "sm" ? 28 : size === "lg" ? 44 : 36;
  const fontSize = size === "sm" ? 11 : size === "lg" ? 15 : 12;

  const statusColors: Record<string, string> = {
    online: "#10B981",
    idle: "#F59E0B",
    offline: "#9CA3AF",
    busy: "#EF4444",
  };

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <div
        style={{
          width: `${dimension}px`,
          height: `${dimension}px`,
          borderRadius: `${scaled.scaledPillRadius}px`,
          backgroundColor: tokens.primaryButtonColor,
          color: scaled.primaryActionTextColor,
          fontSize: `${fontSize}px`,
          borderWidth: `${tokens.borderWidth}px`,
          borderColor: tokens.universalBorderColor,
        }}
        className="flex items-center justify-center font-bold overflow-hidden shadow-2xs select-none"
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {status && (
        <span
          style={{
            backgroundColor: statusColors[status],
            borderColor: tokens.universalFillColor,
          }}
          className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 shadow-xs"
        />
      )}
    </div>
  );
}
