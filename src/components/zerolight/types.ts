export type CornerRadiusPreset = 0 | 8 | 16 | 24 | 999;
export type HeightDensityPreset = 36 | 40 | 44 | 48 | 52;
export type MenuOffsetPreset = 4 | 8 | 10 | 14;
export type MotionPhysicsPreset = "linear" | "damped" | "elastic";

export interface ZeroLightTokens {
  scaleMultiplier: number;
  universalBorderColor: string;
  universalFillColor: string;
  textIconColor: string;
  primaryButtonColor: string;
  hoverBackplateTint: string;
  borderWidth: number;
  cornerRadius: CornerRadiusPreset;
  heightDensity: HeightDensityPreset;
  menuOffsetGap: MenuOffsetPreset;
  fontSize: number;
  motionPhysics: MotionPhysicsPreset;
}

export const DEFAULT_TOKENS: ZeroLightTokens = {
  scaleMultiplier: 1.0,
  universalBorderColor: "#D4D4D4",
  universalFillColor: "#FFFFFF",
  textIconColor: "#111111",
  primaryButtonColor: "#0E625B",
  hoverBackplateTint: "#F4F4F5",
  borderWidth: 1,
  cornerRadius: 16,
  heightDensity: 44,
  menuOffsetGap: 8,
  fontSize: 14,
  motionPhysics: "damped",
};

export interface ScaledTokens {
  scale: number;
  scaledHeight: number;
  scaledFontSize: number;
  labelFontSize: number;
  sublabelFontSize: number;
  ctaFontSize: number;
  headingFontSize: number;
  scaledRadius: number;
  scaledPillRadius: number;
  scaledPaddingX: number;
  scaledPaddingY: number;
  scaledCardRadius: number;
  transitionStyle: string;
}

export function computeScaledTokens(tokens: ZeroLightTokens): ScaledTokens {
  const scale = tokens.scaleMultiplier;
  const baseFont = tokens.fontSize;

  const getTransitionStyle = (): string => {
    switch (tokens.motionPhysics) {
      case "linear":
        return "all 0.15s linear";
      case "elastic":
        return "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      case "damped":
      default:
        return "all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)";
    }
  };

  return {
    scale,
    scaledHeight: Math.round(tokens.heightDensity * scale),
    scaledFontSize: Math.round(baseFont * scale),
    labelFontSize: Math.round(baseFont * scale),
    sublabelFontSize: Math.max(10, Math.round((baseFont - 2) * scale)),
    ctaFontSize: Math.max(11, Math.round((baseFont - 2) * scale)),
    headingFontSize: Math.max(13, Math.round((baseFont + 2) * scale)),
    scaledRadius: tokens.cornerRadius === 999 ? 9999 : Math.round(tokens.cornerRadius * scale),
    scaledPillRadius: 9999,
    scaledPaddingX: Math.round(14 * scale),
    scaledPaddingY: Math.round(8 * scale),
    scaledCardRadius: Math.round(20 * scale),
    transitionStyle: getTransitionStyle(),
  };
}
