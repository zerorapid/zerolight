"use client";

import React from "react";
import { useZeroLight } from "../context";
import { IconLibraryPreset } from "../types";

export interface DynamicIconProps extends React.SVGProps<SVGSVGElement> {
  name:
    | "shield"
    | "shield-check"
    | "zap"
    | "terminal"
    | "cpu"
    | "globe"
    | "activity"
    | "server"
    | "database"
    | "key"
    | "sparkles"
    | "mail"
    | "check"
    | "x";
  library?: IconLibraryPreset;
  size?: number;
  strokeWidth?: number;
  color?: string;
  fill?: string;
  className?: string;
}

export function DynamicIcon({
  name,
  library,
  size = 20,
  strokeWidth,
  color,
  fill,
  className = "",
  style,
  ...rest
}: DynamicIconProps) {
  const { tokens } = useZeroLight();

  const activeLib: IconLibraryPreset = library || tokens.iconLibrary || "lucide";
  const effectiveStrokeWidth = strokeWidth ?? tokens.iconStrokeWidth ?? 1.75;
  const effectiveColor = color || tokens.iconColor || tokens.textIconColor || "#0F172A";
  
  // Resolve fill logic based on tokens
  let effectiveFill = fill;
  if (!effectiveFill) {
    if (tokens.iconFill === "currentColor") {
      effectiveFill = effectiveColor;
    } else if (tokens.iconFill === "subtle") {
      effectiveFill = tokens.hoverBackplateTint || "rgba(0,0,0,0.06)";
    } else {
      effectiveFill = "none";
    }
  }

  const effectiveSize = Math.max(12, Math.round(size * (tokens.iconScaleMultiplier || 1)));

  // ──────────────────────────────────────────────────────────────────────────
  // 1. LUCIDE (Modern, Balanced, Rounded Geometry, 24x24)
  // ──────────────────────────────────────────────────────────────────────────
  if (activeLib === "lucide") {
    switch (name) {
      case "shield":
      case "shield-check":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            {name === "shield-check" && <path d="m9 12 2 2 4-4" />}
          </svg>
        );

      case "zap":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        );

      case "terminal":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
        );

      case "cpu":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <path d="M15 2v2M9 2v2M20 15h2M20 9h2M9 20v2M15 20v2M2 9h2M2 15h2" />
          </svg>
        );

      case "globe":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        );

      case "activity":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        );

      case "sparkles":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4M3 5h4M19 17v4M17 19h4" />
          </svg>
        );

      case "server":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <rect width="20" height="8" x="2" y="2" rx="2" />
            <rect width="20" height="8" x="2" y="14" rx="2" />
            <line x1="6" y1="6" x2="6.01" y2="6" />
            <line x1="6" y1="18" x2="6.01" y2="18" />
          </svg>
        );

      case "database":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
            <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
          </svg>
        );

      case "key":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <circle cx="7.5" cy="15.5" r="5.5" />
            <path d="m21 2-9.6 9.6M15.5 7.5l3 3M18.5 4.5l3 3" />
          </svg>
        );

      default:
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <circle cx="12" cy="12" r="9" />
          </svg>
        );
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. TABLER (Crisp, Technical, Sharp Geometric Cuts, Square Caps)
  // ──────────────────────────────────────────────────────────────────────────
  if (activeLib === "tabler") {
    switch (name) {
      case "shield":
      case "shield-check":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="square"
            strokeLinejoin="miter"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            {/* Tabler sharp technical shield with angled shoulders */}
            <path d="M12 3a12 12 0 0 0 8.5 3A12 12 0 0 1 12 21 12 12 0 0 1 3.5 6 12 12 0 0 0 12 3" />
            {name === "shield-check" && <path d="M9 12l2 2 4-4" strokeLinecap="square" />}
          </svg>
        );

      case "zap":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="square"
            strokeLinejoin="miter"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            {/* Tabler crisp angled flash bolt */}
            <path d="M13 3l-10 12.5h7l-1 5.5 11-13h-7.5l1.5-5z" />
          </svg>
        );

      case "terminal":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="square"
            strokeLinejoin="miter"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            {/* Tabler framed terminal box with prompt */}
            <rect x="3" y="4" width="18" height="16" rx="1" />
            <path d="M7 9l3 3-3 3" />
            <line x1="13" y1="15" x2="17" y2="15" />
          </svg>
        );

      case "cpu":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="square"
            strokeLinejoin="miter"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            {/* Tabler technical processor chip with sharp corner notch */}
            <rect x="5" y="5" width="14" height="14" />
            <path d="M9 9h6v6H9z" />
            <path d="M3 10h2M3 14h2M19 10h2M19 14h2M10 3v2M14 3v2M10 19v2M14 19v2" />
          </svg>
        );

      case "globe":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="square"
            strokeLinejoin="miter"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            {/* Tabler geometric wireframe sphere */}
            <circle cx="12" cy="12" r="9" />
            <line x1="3.6" y1="9" x2="20.4" y2="9" />
            <line x1="3.6" y1="15" x2="20.4" y2="15" />
            <path d="M11.5 3a17 17 0 0 0 0 18M12.5 3a17 17 0 0 1 0 18" />
          </svg>
        );

      case "activity":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="square"
            strokeLinejoin="miter"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            {/* Tabler sharp stepped heartbeat trace */}
            <path d="M3 12h4l2-6 3 12 3-9 2 3h4" />
          </svg>
        );

      case "sparkles":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="square"
            strokeLinejoin="miter"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            {/* Tabler 4-point faceted diamond spark */}
            <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" />
          </svg>
        );

      case "server":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="square"
            strokeLinejoin="miter"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <rect x="3" y="4" width="18" height="6" />
            <rect x="3" y="14" width="18" height="6" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
            <line x1="7" y1="17" x2="7.01" y2="17" />
            <line x1="11" y1="7" x2="13" y2="7" />
            <line x1="11" y1="17" x2="13" y2="17" />
          </svg>
        );

      case "database":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="square"
            strokeLinejoin="miter"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <ellipse cx="12" cy="6" rx="8" ry="3" />
            <path d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6" />
            <path d="M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6" />
          </svg>
        );

      case "key":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="square"
            strokeLinejoin="miter"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <circle cx="8" cy="15" r="4" />
            <path d="M10.85 12.15L19 4M18 5l2 2M15 8l2 2" />
          </svg>
        );

      default:
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="square"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <rect x="4" y="4" width="16" height="16" />
          </svg>
        );
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 3. FEATHER (Classic, Minimal, Utilitarian Curves, Open Terminals)
  // ──────────────────────────────────────────────────────────────────────────
  if (activeLib === "feather") {
    switch (name) {
      case "shield":
      case "shield-check":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            {/* Feather classic flared heraldic shield */}
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            {name === "shield-check" && <polyline points="9 12 11 14 15 10" />}
          </svg>
        );

      case "zap":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            {/* Feather minimal high-voltage stroke */}
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        );

      case "terminal":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
        );

      case "cpu":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
            <rect x="9" y="9" width="6" height="6" />
            <line x1="9" y1="1" x2="9" y2="4" />
            <line x1="15" y1="1" x2="15" y2="4" />
            <line x1="9" y1="20" x2="9" y2="23" />
            <line x1="15" y1="20" x2="15" y2="23" />
            <line x1="20" y1="9" x2="23" y2="9" />
            <line x1="20" y1="14" x2="23" y2="14" />
            <line x1="1" y1="9" x2="4" y2="9" />
            <line x1="1" y1="14" x2="4" y2="14" />
          </svg>
        );

      case "globe":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        );

      case "activity":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        );

      case "sparkles":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );

      case "server":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
            <line x1="6" y1="6" x2="6.01" y2="6" />
            <line x1="6" y1="18" x2="6.01" y2="18" />
          </svg>
        );

      case "database":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
        );

      case "key":
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <path d="M21 2l-2 2m-1.5 1.5L14 9M19 4l-2 2m-3-1l-2 2" />
            <circle cx="7.5" cy="16.5" r="4.5" />
          </svg>
        );

      default:
        return (
          <svg
            width={effectiveSize}
            height={effectiveSize}
            viewBox="0 0 24 24"
            fill={effectiveFill}
            stroke={effectiveColor}
            strokeWidth={effectiveStrokeWidth}
            className={`transition-all ${className}`}
            style={style}
            {...rest}
          >
            <circle cx="12" cy="12" r="9" />
          </svg>
        );
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 4. HEROICONS (Dense Micro Proportions, Solid Accent Geometry, 24x24)
  // ──────────────────────────────────────────────────────────────────────────
  switch (name) {
    case "shield":
    case "shield-check":
      return (
        <svg
          width={effectiveSize}
          height={effectiveSize}
          viewBox="0 0 24 24"
          fill={effectiveFill}
          stroke={effectiveColor}
          strokeWidth={effectiveStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-all ${className}`}
          style={style}
          {...rest}
        >
          {/* Heroicons dense curved crest shield */}
          <path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
      );

    case "zap":
      return (
        <svg
          width={effectiveSize}
          height={effectiveSize}
          viewBox="0 0 24 24"
          fill={effectiveFill}
          stroke={effectiveColor}
          strokeWidth={effectiveStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-all ${className}`}
          style={style}
          {...rest}
        >
          {/* Heroicons angular dynamic bolt */}
          <path d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
      );

    case "terminal":
      return (
        <svg
          width={effectiveSize}
          height={effectiveSize}
          viewBox="0 0 24 24"
          fill={effectiveFill}
          stroke={effectiveColor}
          strokeWidth={effectiveStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-all ${className}`}
          style={style}
          {...rest}
        >
          {/* Heroicons code prompt bracket */}
          <path d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H4.5A2.25 2.25 0 0 0 2.25 6v12A2.25 2.25 0 0 0 4.5 20.25Z" />
        </svg>
      );

    case "cpu":
      return (
        <svg
          width={effectiveSize}
          height={effectiveSize}
          viewBox="0 0 24 24"
          fill={effectiveFill}
          stroke={effectiveColor}
          strokeWidth={effectiveStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-all ${className}`}
          style={style}
          {...rest}
        >
          {/* Heroicons dense square compute core */}
          <path d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
        </svg>
      );

    case "globe":
      return (
        <svg
          width={effectiveSize}
          height={effectiveSize}
          viewBox="0 0 24 24"
          fill={effectiveFill}
          stroke={effectiveColor}
          strokeWidth={effectiveStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-all ${className}`}
          style={style}
          {...rest}
        >
          <path d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      );

    case "activity":
      return (
        <svg
          width={effectiveSize}
          height={effectiveSize}
          viewBox="0 0 24 24"
          fill={effectiveFill}
          stroke={effectiveColor}
          strokeWidth={effectiveStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-all ${className}`}
          style={style}
          {...rest}
        >
          {/* Heroicons heart rate telemetry trace */}
          <path d="M2.25 12h3.75l2.25-6 3.75 12 2.25-6H21.75" />
        </svg>
      );

    case "sparkles":
      return (
        <svg
          width={effectiveSize}
          height={effectiveSize}
          viewBox="0 0 24 24"
          fill={effectiveFill}
          stroke={effectiveColor}
          strokeWidth={effectiveStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-all ${className}`}
          style={style}
          {...rest}
        >
          <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
        </svg>
      );

    case "server":
      return (
        <svg
          width={effectiveSize}
          height={effectiveSize}
          viewBox="0 0 24 24"
          fill={effectiveFill}
          stroke={effectiveColor}
          strokeWidth={effectiveStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-all ${className}`}
          style={style}
          {...rest}
        >
          <path d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.75 5.1a3 3 0 0 1 2.4-1.35h7.7a3 3 0 0 1 2.4 1.35l2.6 3.45a4.5 4.5 0 0 1 .9 2.7" />
        </svg>
      );

    case "database":
      return (
        <svg
          width={effectiveSize}
          height={effectiveSize}
          viewBox="0 0 24 24"
          fill={effectiveFill}
          stroke={effectiveColor}
          strokeWidth={effectiveStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-all ${className}`}
          style={style}
          {...rest}
        >
          <path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>
      );

    case "key":
      return (
        <svg
          width={effectiveSize}
          height={effectiveSize}
          viewBox="0 0 24 24"
          fill={effectiveFill}
          stroke={effectiveColor}
          strokeWidth={effectiveStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-all ${className}`}
          style={style}
          {...rest}
        >
          <path d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
        </svg>
      );

    default:
      return (
        <svg
          width={effectiveSize}
          height={effectiveSize}
          viewBox="0 0 24 24"
          fill={effectiveFill}
          stroke={effectiveColor}
          strokeWidth={effectiveStrokeWidth}
          className={`transition-all ${className}`}
          style={style}
          {...rest}
        >
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
