"use client";

import React from "react";
import { Shield, Zap, Terminal, Cpu, Globe } from "lucide-react";
import { useZeroLight } from "../../context";

export interface BrandLogoRendererProps {
  brandLogoUrl?: string | null;
  selectedIconMark?: string;
  brandMark?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function BrandLogoRenderer({
  brandLogoUrl,
  selectedIconMark = "shield",
  brandMark = "ZL",
  size = "md",
  className = "",
}: BrandLogoRendererProps) {
  const { tokens, scaled } = useZeroLight();

  const sizeDimensions = {
    xs: { box: "w-5 h-5", text: "text-[10px]", icon: 11 },
    sm: { box: "w-6 h-6", text: "text-[11px]", icon: 13 },
    md: { box: "w-8 h-8", text: "text-xs font-bold", icon: 16 },
    lg: { box: "w-10 h-10", text: "text-sm font-extrabold", icon: 20 },
  }[size];

  // 1. Uploaded Image Logo has top priority
  if (brandLogoUrl) {
    return (
      <div
        className={`${sizeDimensions.box} overflow-hidden shrink-0 flex items-center justify-center border shadow-2xs ${className}`}
        style={{
          borderRadius: `${Math.min(scaled.scaledRadius, 10)}px`,
          borderColor: tokens.universalBorderColor,
          backgroundColor: tokens.universalFillColor,
        }}
      >
        <img
          src={brandLogoUrl}
          alt="Brand Logo"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // 2. Preset SVG Icon Symbol
  const renderIcon = () => {
    switch (selectedIconMark) {
      case "zap":
        return <Zap size={sizeDimensions.icon} strokeWidth={tokens.iconStrokeWidth || 2} />;
      case "terminal":
        return <Terminal size={sizeDimensions.icon} strokeWidth={tokens.iconStrokeWidth || 2} />;
      case "cpu":
        return <Cpu size={sizeDimensions.icon} strokeWidth={tokens.iconStrokeWidth || 2} />;
      case "globe":
        return <Globe size={sizeDimensions.icon} strokeWidth={tokens.iconStrokeWidth || 2} />;
      case "shield":
      default:
        return <Shield size={sizeDimensions.icon} strokeWidth={tokens.iconStrokeWidth || 2} />;
    }
  };

  // If brandMark is explicitly something other than ZL or icon not chosen
  if (selectedIconMark === "text" || !selectedIconMark) {
    return (
      <div
        className={`${sizeDimensions.box} ${sizeDimensions.text} shrink-0 flex items-center justify-center font-sans tracking-tight uppercase shadow-2xs ${className}`}
        style={{
          borderRadius: `${Math.min(scaled.scaledRadius, 10)}px`,
          backgroundColor: tokens.primaryButtonColor,
          color: scaled.primaryActionTextColor,
        }}
      >
        {brandMark.slice(0, 2)}
      </div>
    );
  }

  return (
    <div
      className={`${sizeDimensions.box} shrink-0 flex items-center justify-center shadow-2xs ${className}`}
      style={{
        borderRadius: `${Math.min(scaled.scaledRadius, 10)}px`,
        backgroundColor: tokens.primaryButtonColor,
        color: scaled.primaryActionTextColor,
      }}
    >
      {renderIcon()}
    </div>
  );
}
