"use client";

import React from "react";

export interface EntityAvatarProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

// Deterministic palette choices matching dark ZeroLight aesthetic
const PALETTES = [
  { bg: "bg-emerald-950/80 border-emerald-800/80 text-emerald-300" },
  { bg: "bg-rose-950/80 border-rose-800/80 text-rose-300" },
  { bg: "bg-amber-950/80 border-amber-800/80 text-amber-300" },
  { bg: "bg-cyan-950/80 border-cyan-800/80 text-cyan-300" },
  { bg: "bg-indigo-950/80 border-indigo-800/80 text-indigo-300" },
  { bg: "bg-purple-950/80 border-purple-800/80 text-purple-300" },
  { bg: "bg-teal-950/80 border-teal-800/80 text-teal-300" },
  { bg: "bg-blue-950/80 border-blue-800/80 text-blue-300" },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  if (!name) return "??";
  const words = name.trim().split(/[\s-_]+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function EntityAvatar({
  name,
  size = "sm",
  className = "",
}: EntityAvatarProps) {
  const initials = getInitials(name);
  const paletteIndex = hashString(name) % PALETTES.length;
  const palette = PALETTES[paletteIndex];

  const sizeClasses = {
    xs: "w-5 h-5 text-[9px]",
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-xs font-semibold",
    lg: "w-10 h-10 text-sm font-bold",
  }[size];

  return (
    <div
      role="img"
      aria-label={`Entity avatar for ${name}`}
      title={name}
      className={`inline-flex items-center justify-center rounded-md border font-mono select-none flex-shrink-0 ${sizeClasses} ${palette.bg} ${className}`}
    >
      {initials}
    </div>
  );
}
