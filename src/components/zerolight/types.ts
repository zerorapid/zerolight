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
  primaryButtonColor: "#111111", // Default black for primary actions
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
  scaledInnerRadius: number;
  scaledMenuRadius: number;
  scaledOptionRadius: number;
  scaledCheckboxRadius: number;
  scaledPaddingX: number;
  scaledPaddingY: number;
  scaledCardRadius: number;
  transitionStyle: string;
  isZeroBorder: boolean;
  cardShadow: string;
  effectiveInputFill: string;
  conjoinedDivider: string;
  focusHalo: string;
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

  // True universal corner radius scaling with structured container protection
  let scaledRadius = 0;
  let scaledCardRadius = 0;
  let scaledInnerRadius = 0;
  let scaledMenuRadius = 0;
  let scaledOptionRadius = 0;
  let scaledCheckboxRadius = 0;

  if (tokens.cornerRadius === 999) {
    // When Pill mode is chosen, interactive trigger elements (buttons, pills, chips, standalone inputs)
    // receive 9999px pill curves, while multi-row popover menus, cards, and list items maintain
    // crisp, structural modern B2B SaaS geometry to prevent distorted capsule/egg clipping.
    scaledRadius = 9999;
    scaledCardRadius = Math.round(20 * scale);
    scaledMenuRadius = Math.round(14 * scale);
    scaledInnerRadius = Math.round(10 * scale);
    scaledOptionRadius = Math.round(8 * scale);
    scaledCheckboxRadius = 4;
  } else if (tokens.cornerRadius === 0) {
    scaledRadius = 0;
    scaledCardRadius = 0;
    scaledMenuRadius = 0;
    scaledInnerRadius = 0;
    scaledOptionRadius = 0;
    scaledCheckboxRadius = 0;
  } else {
    scaledRadius = Math.round(tokens.cornerRadius * scale);
    scaledCardRadius = Math.round((tokens.cornerRadius + 4) * scale);
    scaledMenuRadius = Math.round(Math.min(tokens.cornerRadius, 14) * scale);
    scaledInnerRadius = Math.max(2, Math.round((tokens.cornerRadius - 4) * scale));
    scaledOptionRadius = Math.max(2, Math.round((tokens.cornerRadius - 6) * scale));
    scaledCheckboxRadius = Math.max(2, Math.min(4, Math.round(tokens.cornerRadius * 0.25)));
  }

  const isZeroBorder = tokens.borderWidth === 0;

  // When border is 0, activate atmospheric elevation so cards don't dissolve
  const cardShadow = isZeroBorder
    ? "0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)"
    : "0 1px 2px rgba(0, 0, 0, 0.02)";

  // Luminance stepping: when border is 0, inputs/controls step down to a soft neutral tint
  // so their boundary remains crisp against the white card backplate
  const effectiveInputFill = isZeroBorder
    ? tokens.hoverBackplateTint || "#F4F4F5"
    : tokens.universalFillColor || "#FFFFFF";

  // When border is 0, conjoined elements use a subtle hairline divider to prevent collisions
  const conjoinedDivider = isZeroBorder ? "#E4E4E7" : tokens.universalBorderColor;

  // Inset focus ring to guarantee ZERO cumulative layout shift
  const focusHalo = `inset 0 0 0 2px ${tokens.primaryButtonColor}`;

  return {
    scale,
    scaledHeight: Math.round(tokens.heightDensity * scale),
    scaledFontSize: Math.round(baseFont * scale),
    labelFontSize: Math.round(baseFont * scale),
    sublabelFontSize: Math.max(10, Math.round((baseFont - 2) * scale)),
    ctaFontSize: Math.max(11, Math.round((baseFont - 2) * scale)),
    headingFontSize: Math.max(13, Math.round((baseFont + 2) * scale)),
    scaledRadius,
    scaledInnerRadius,
    scaledMenuRadius,
    scaledOptionRadius,
    scaledCheckboxRadius,
    scaledPaddingX: Math.round(14 * scale),
    scaledPaddingY: Math.round(8 * scale),
    scaledCardRadius,
    transitionStyle: getTransitionStyle(),
    isZeroBorder,
    cardShadow,
    effectiveInputFill,
    conjoinedDivider,
    focusHalo,
  };
}
