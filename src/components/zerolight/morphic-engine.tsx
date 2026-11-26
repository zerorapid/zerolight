"use client";

import React, { createContext, useContext, useMemo } from "react";

export type MorphicStage = "M1" | "M2" | "M3";

export const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2; // 1.61803398875
export const MAJOR_THIRD = 1.25;

export interface OklchColor {
  l: number; // 0..1
  c: number; // 0..0.4
  h: number; // 0..360
}

export interface MorphicMetrics {
  stage: MorphicStage;
  mu: number;
  smoothMu: number;
  infoBudget: number;
  dampingRatio: number;
  spring: { stiffness: number; damping: number; mass: number };
  elevationBlurPx: number;
  elevationOpacity: number;
  padPx: number;
  gapPx: number;
  fontSizePx: number;
  padClass: string;
  gapClass: string;
  isM1: boolean;
  isM2: boolean;
  isM3: boolean;
  atLeast: (minStage: MorphicStage) => boolean;
}

const STAGE_TO_MU: Record<MorphicStage, number> = {
  M1: 0.0,
  M2: 0.5,
  M3: 1.0,
};

const STAGE_ORDER: Record<MorphicStage, number> = {
  M1: 1,
  M2: 2,
  M3: 3,
};

/** 1. Quintic Smoothstep S(mu) = 6u^5 - 15u^4 + 10u^3 for zero-jerk transitions. */
export function quinticSmoothstep(mu: number): number {
  const u = Math.min(1, Math.max(0, mu));
  return u * u * u * (u * (u * 6 - 15) + 10);
}

/** 2. Geometric Modular Scale: Base * r^(n + alpha * S(mu)). */
export function modularScale(
  base: number,
  step: number,
  mu: number,
  ratio: number = MAJOR_THIRD,
  alpha: number = 0.65
): number {
  const s = quinticSmoothstep(mu);
  return Math.round(base * Math.pow(ratio, step + alpha * (s - 0.5)) * 100) / 100;
}

/** 3a. Hick-Hyman Cognitive Decision Latency: T = b * log2(n + 1). */
export function hickHymanLatencyMs(optionsCount: number, b: number = 150): number {
  return Math.round(b * Math.log2(Math.max(0, optionsCount) + 1));
}

/** 3b. Shannon Information Entropy: H(X) = -sum(P(x) * log2(P(x))). */
export function shannonEntropyBits(weights: number[]): number {
  const total = weights.reduce((acc, w) => acc + Math.max(0, w), 0);
  if (total <= 0) return 0;
  return weights.reduce((acc, w) => {
    if (w <= 0) return acc;
    const p = w / total;
    return acc - p * Math.log2(p);
  }, 0);
}

/** 4. Damped Harmonic Oscillator: m*x'' + c*x' + k*x = 0 -> c = 2*zeta*sqrt(k). */
export function computeDampedSpring(
  mu: number,
  stiffness: number = 420
): { stiffness: number; damping: number; mass: number; dampingRatio: number } {
  const s = quinticSmoothstep(mu);
  // M1: zeta = 1.0 (critically damped, 0 overshoot), M2: 0.70, M3: 0.55
  const dampingRatio = Number((1.0 - 0.45 * s).toFixed(3));
  const damping = Math.round(2 * dampingRatio * Math.sqrt(stiffness) * 10) / 10;
  return { stiffness, damping, mass: 1, dampingRatio };
}

/** 5. Perceptual OKLCH cylindrical interpolation with shortest hue path. */
export function interpolateOklch(a: OklchColor, b: OklchColor, mu: number): string {
  const s = quinticSmoothstep(mu);
  const l = a.l + s * (b.l - a.l);
  const c = a.c + s * (b.c - a.c);
  let dh = ((b.h - a.h + 540) % 360) - 180;
  const h = (a.h + s * dh + 360) % 360;
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`;
}

/** 6. Exponential Elevation Curve: sigma(mu) = max * (e^(a*mu) - 1) / (e^a - 1). */
export function exponentialElevation(
  mu: number,
  maxBlur: number = 16,
  alpha: number = 2.4
): { blurPx: number; opacity: number } {
  const u = Math.min(1, Math.max(0, mu));
  if (u <= 0.01) return { blurPx: 0, opacity: 0 };
  const norm = (Math.exp(alpha * u) - 1) / (Math.exp(alpha) - 1);
  return {
    blurPx: Math.round(maxBlur * norm * 10) / 10,
    opacity: Math.round(0.12 * norm * 1000) / 1000,
  };
}

export function computeMorphicMetrics(stage: MorphicStage = "M2"): MorphicMetrics {
  const mu = STAGE_TO_MU[stage];
  const smoothMu = quinticSmoothstep(mu);
  const spring = computeDampedSpring(mu);
  const elev = exponentialElevation(mu);
  const padPx = Math.round(modularScale(14, 0, mu));
  const gapPx = Math.round(modularScale(10, 0, mu));
  const fontSizePx = Math.round(modularScale(13, 0, mu, 1.125));
  const infoBudget = stage === "M1" ? 2 : stage === "M2" ? 4 : 7;

  return {
    stage,
    mu,
    smoothMu,
    infoBudget,
    dampingRatio: spring.dampingRatio,
    spring: { stiffness: spring.stiffness, damping: spring.damping, mass: spring.mass },
    elevationBlurPx: elev.blurPx,
    elevationOpacity: elev.opacity,
    padPx,
    gapPx,
    fontSizePx,
    padClass: stage === "M1" ? "p-2.5" : stage === "M2" ? "p-4" : "p-5",
    gapClass: stage === "M1" ? "gap-1.5" : stage === "M2" ? "gap-3" : "gap-4",
    isM1: stage === "M1",
    isM2: stage === "M2",
    isM3: stage === "M3",
    atLeast: (minStage: MorphicStage) => STAGE_ORDER[stage] >= STAGE_ORDER[minStage],
  };
}

const MorphicContext = createContext<MorphicStage>("M2");

export function MorphicScope({
  stage,
  children,
}: {
  stage: MorphicStage;
  children: React.ReactNode;
}) {
  return <MorphicContext.Provider value={stage}>{children}</MorphicContext.Provider>;
}

/** Resolve active Morphic stage (local prop overrides enclosing MorphicScope). */
export function useMorphic(propStage?: MorphicStage): MorphicMetrics {
  const inherited = useContext(MorphicContext);
  const activeStage = propStage || inherited;
  return useMemo(() => computeMorphicMetrics(activeStage), [activeStage]);
}

/** Cognitive disclosure gate: renders children only when active stage >= minStage. */
export function MorphicSlot({
  minStage,
  stage,
  children,
}: {
  minStage: MorphicStage;
  stage?: MorphicStage;
  children: React.ReactNode;
}) {
  const m = useMorphic(stage);
  if (!m.atLeast(minStage)) return null;
  return <>{children}</>;
}
