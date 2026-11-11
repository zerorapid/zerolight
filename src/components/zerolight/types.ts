export type CornerRadiusPreset = 0 | 8 | 16 | 24 | 999;
export type HeightDensityPreset = 36 | 40 | 44 | 48 | 52;
export type MenuOffsetPreset = 4 | 8 | 10 | 14;
export type MotionPhysicsPreset = "instant" | "snappy" | "damped" | "gentle" | "elastic" | "linear";
export type IconStrokePreset = 1.25 | 1.5 | 2.0 | 2.5 | 3.0;
export type IconFillPreset = "none" | "currentColor" | "subtle";
export type ChartPalettePreset = "emerald" | "violet" | "sky" | "amber" | "monochrome";
export type ChartGridPreset = "dotted" | "solid" | "none";
export type ChartStrokePreset = 1.5 | 2.0 | 2.5 | 3.0;

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
  // Motion advanced tokens
  motionSpeedMultiplier?: number;
  motionStiffness?: number;
  motionDamping?: number;
  motionMass?: number;
  motionDistance?: number;
  tapScale?: number;
  hoverScale?: number;
  // Icon specific tokens
  iconScaleMultiplier: number;
  iconStrokeWidth: IconStrokePreset;
  iconFill: IconFillPreset;
  iconColor: string;
  // Data Visualization Tokens
  chartPalette?: ChartPalettePreset;
  chartPrimaryColor?: string;
  chartSecondaryColor?: string;
  chartStrokeWidth?: ChartStrokePreset;
  chartFillOpacity?: number;
  chartGridStyle?: ChartGridPreset;
  // Layout Direction (Bi-Directional RTL/LTR Engine)
  direction?: "ltr" | "rtl";
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
  motionSpeedMultiplier: 1.0,
  // Icon specific defaults
  iconScaleMultiplier: 1.0,
  iconStrokeWidth: 2.0,
  iconFill: "none",
  iconColor: "#71717A",
  // Data Visualization defaults
  chartPalette: "emerald",
  chartPrimaryColor: "#10B981",
  chartSecondaryColor: "#64748B",
  chartStrokeWidth: 2.5,
  chartFillOpacity: 0.25,
  chartGridStyle: "dotted",
  direction: "ltr",
};

export type ThemePresetId = "light" | "dark" | "slate" | "contrast";

export interface ThemePresetDefinition {
  id: ThemePresetId;
  label: string;
  swatchBg: string;
  swatchAccent: string;
  tokens: Partial<ZeroLightTokens>;
}

export const THEME_PRESETS: Record<ThemePresetId, ThemePresetDefinition> = {
  light: {
    id: "light",
    label: "Light",
    swatchBg: "#FFFFFF",
    swatchAccent: "#111111",
    tokens: {
      universalBorderColor: "#D4D4D4",
      universalFillColor: "#FFFFFF",
      textIconColor: "#111111",
      primaryButtonColor: "#111111",
      hoverBackplateTint: "#F4F4F5",
      iconColor: "#71717A",
      chartSecondaryColor: "#64748B",
      borderWidth: 1,
    },
  },
  dark: {
    id: "dark",
    label: "Dark",
    swatchBg: "#141418",
    swatchAccent: "#FAFAFA",
    tokens: {
      universalBorderColor: "#27272A",
      universalFillColor: "#141418",
      textIconColor: "#FAFAFA",
      primaryButtonColor: "#FFFFFF",
      hoverBackplateTint: "#27272A",
      iconColor: "#A1A1AA",
      chartSecondaryColor: "#94A3B8",
      borderWidth: 1,
    },
  },
  slate: {
    id: "slate",
    label: "Slate",
    swatchBg: "#0F172A",
    swatchAccent: "#38BDF8",
    tokens: {
      universalBorderColor: "#334155",
      universalFillColor: "#0F172A",
      textIconColor: "#F8FAFC",
      primaryButtonColor: "#38BDF8",
      hoverBackplateTint: "#1E293B",
      iconColor: "#94A3B8",
      chartSecondaryColor: "#64748B",
      borderWidth: 1,
    },
  },
  contrast: {
    id: "contrast",
    label: "Contrast",
    swatchBg: "#FFFFFF",
    swatchAccent: "#000000",
    tokens: {
      universalBorderColor: "#111111",
      universalFillColor: "#FFFFFF",
      textIconColor: "#000000",
      primaryButtonColor: "#000000",
      hoverBackplateTint: "#E4E4E7",
      iconColor: "#18181B",
      chartSecondaryColor: "#27272A",
      borderWidth: 2,
    },
  },
};

export interface MotionConfig {
  physics: MotionPhysicsPreset;
  speedMultiplier: number;
  spring: {
    type: "spring";
    stiffness: number;
    damping: number;
    mass?: number;
  };
  drawerTransition: any;
  modalTransition: any;
  transition: any;
  popover: {
    initial: { opacity: number; scale: number; y: number };
    animate: { opacity: number; scale: number; y: number };
    exit: { opacity: number; scale: number; y: number };
    transition: any;
  };
  pillTransition: any;
  tapScale: number;
  hoverScale: number;
  distance: number;
  description: string;
}

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
  scaledPillRadius: number;
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
  primaryActionTextColor: string;
  motionConfig: MotionConfig;
  // Vector Icon Tokens
  iconScale: number;
  iconSize: number;
  iconSmSize: number;
  iconLgSize: number;
  iconStrokeWidth: number;
  iconFill: string;
  iconColor: string;
  // Data Visualization Computations
  chartColors: string[];
  chartPrimaryColor: string;
  chartSecondaryColor: string;
  chartStrokeWidth: number;
  chartFillOpacity: number;
  chartGridStyle: ChartGridPreset;
  // Bi-Directional Layout Direction & Surface Polarity
  direction: "ltr" | "rtl";
  isRtl: boolean;
  isDarkSurface: boolean;
}

export function getContrastColor(hexColor: string): string {
  if (!hexColor) return "#FFFFFF";
  const hex = hexColor.replace("#", "");
  let r = 0, g = 0, b = 0;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    return "#FFFFFF";
  }
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? "#111111" : "#FFFFFF";
}

export function computeScaledTokens(tokens: ZeroLightTokens): ScaledTokens {
  const scale = tokens.scaleMultiplier;
  const baseFont = tokens.fontSize;

  const getTransitionStyle = (): string => {
    const speed = tokens.motionSpeedMultiplier ?? 1.0;
    const dur = (baseSec: number) => `${Math.max(0.01, baseSec / speed).toFixed(2)}s`;
    const props = "background-color, border-color, color, box-shadow, opacity";
    const mk = (baseSec: number, curve: string) =>
      `${props}`
        .split(", ")
        .map((p) => `${p} ${dur(baseSec)} ${curve}`)
        .join(", ");

    switch (tokens.motionPhysics) {
      case "instant":
        return "none";
      case "snappy":
        return mk(0.14, "cubic-bezier(0.16, 1, 0.3, 1)");
      case "gentle":
        return mk(0.32, "cubic-bezier(0.25, 1, 0.5, 1)");
      case "linear":
        return mk(0.15, "linear");
      case "elastic":
        return mk(0.3, "cubic-bezier(0.175, 0.885, 0.32, 1.275)");
      case "damped":
      default:
        return mk(0.2, "cubic-bezier(0.2, 0.8, 0.2, 1)");
    }
  };

  // True universal corner radius scaling with structured container protection
  let scaledRadius = 0;
  let scaledPillRadius = 0;
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
    scaledPillRadius = 9999;
    scaledCardRadius = Math.round(20 * scale);
    scaledMenuRadius = Math.round(14 * scale);
    scaledInnerRadius = 9999;
    scaledOptionRadius = Math.round(8 * scale);
    scaledCheckboxRadius = 4;
  } else if (tokens.cornerRadius === 0) {
    scaledRadius = 0;
    scaledPillRadius = 0;
    scaledCardRadius = 0;
    scaledMenuRadius = 0;
    scaledInnerRadius = 0;
    scaledOptionRadius = 0;
    scaledCheckboxRadius = 0;
  } else {
    scaledRadius = Math.round(tokens.cornerRadius * scale);
    scaledPillRadius = Math.round(tokens.cornerRadius * scale);
    scaledCardRadius = Math.round((tokens.cornerRadius + 4) * scale);
    scaledMenuRadius = Math.round(Math.min(tokens.cornerRadius, 14) * scale);
    scaledInnerRadius = Math.max(0, Math.round((tokens.cornerRadius - 4) * scale));
    scaledOptionRadius = Math.max(0, Math.round((tokens.cornerRadius - 6) * scale));
    scaledCheckboxRadius = Math.min(4, Math.round(tokens.cornerRadius * 0.25));
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

  const getMotionConfig = (): MotionConfig => {
    const speed = tokens.motionSpeedMultiplier ?? 1.0;
    const speedStiffnessFactor = Math.pow(speed, 1.4);
    const speedDampingFactor = Math.sqrt(speed);

    const resolveBaseConfig = (): MotionConfig => {
      switch (tokens.motionPhysics) {
        case "instant":
          return {
            physics: "instant",
            speedMultiplier: speed,
            spring: { type: "spring", stiffness: 1200, damping: 80, mass: 0.1 },
            drawerTransition: { duration: 0.001 },
            modalTransition: { duration: 0.001 },
            transition: { duration: 0.001 },
            popover: {
              initial: { opacity: 0, scale: 1, y: 0 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 1, y: 0 },
              transition: { duration: 0.001 },
            },
            pillTransition: { duration: 0.001 },
            tapScale: 1.0,
            hoverScale: 1.0,
            distance: 0,
            description: "Zero latency / reduced motion for high-frequency trading & accessibility",
          };
        case "snappy":
          return {
            physics: "snappy",
            speedMultiplier: speed,
            spring: { type: "spring", stiffness: 520, damping: 32, mass: 0.7 },
            drawerTransition: { type: "spring", stiffness: 500, damping: 34, mass: 0.7 },
            modalTransition: { type: "spring", stiffness: 530, damping: 30, mass: 0.7 },
            transition: { type: "spring", stiffness: 520, damping: 32, mass: 0.7 },
            popover: {
              initial: { opacity: 0, scale: 0.97, y: -4 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 0.97, y: -4 },
              transition: { type: "spring", stiffness: 520, damping: 32, mass: 0.7 },
            },
            pillTransition: { type: "spring", stiffness: 520, damping: 32, mass: 0.7 },
            tapScale: 0.96,
            hoverScale: 1.02,
            distance: 4,
            description: "Fast, agile Apple macOS-style response with crisp tactile feedback",
          };
        case "gentle":
          return {
            physics: "gentle",
            speedMultiplier: speed,
            spring: { type: "spring", stiffness: 280, damping: 30, mass: 1.1 },
            drawerTransition: { type: "spring", stiffness: 260, damping: 32, mass: 1.1 },
            modalTransition: { type: "spring", stiffness: 300, damping: 28, mass: 1.1 },
            transition: { type: "spring", stiffness: 280, damping: 30, mass: 1.1 },
            popover: {
              initial: { opacity: 0, scale: 0.95, y: -8 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 0.95, y: -8 },
              transition: { type: "spring", stiffness: 280, damping: 30, mass: 1.1 },
            },
            pillTransition: { type: "spring", stiffness: 280, damping: 30, mass: 1.1 },
            tapScale: 0.98,
            hoverScale: 1.01,
            distance: 8,
            description: "Luxurious, calm ambient deceleration with smooth easing",
          };
        case "elastic":
          return {
            physics: "elastic",
            speedMultiplier: speed,
            spring: { type: "spring", stiffness: 460, damping: 20, mass: 0.8 },
            drawerTransition: { type: "spring", stiffness: 440, damping: 24, mass: 0.8 },
            modalTransition: { type: "spring", stiffness: 480, damping: 22, mass: 0.8 },
            transition: { type: "spring", stiffness: 460, damping: 20, mass: 0.8 },
            popover: {
              initial: { opacity: 0, scale: 0.92, y: -12 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 0.92, y: -12 },
              transition: { type: "spring", stiffness: 460, damping: 20, mass: 0.8 },
            },
            pillTransition: { type: "spring", stiffness: 460, damping: 20, mass: 0.8 },
            tapScale: 0.94,
            hoverScale: 1.03,
            distance: 12,
            description: "Playful physics with subtle overshoot resonance for engaging feedback",
          };
        case "linear":
          return {
            physics: "linear",
            speedMultiplier: speed,
            spring: { type: "spring", stiffness: 500, damping: 45, mass: 1 },
            drawerTransition: { type: "tween", duration: Math.max(0.01, 0.16 / speed), ease: "linear" },
            modalTransition: { type: "tween", duration: Math.max(0.01, 0.14 / speed), ease: "linear" },
            transition: { type: "tween", duration: Math.max(0.01, 0.16 / speed), ease: "linear" },
            popover: {
              initial: { opacity: 0, scale: 0.98, y: -4 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 0.98, y: -4 },
              transition: { duration: Math.max(0.01, 0.12 / speed), ease: "linear" },
            },
            pillTransition: { duration: Math.max(0.01, 0.12 / speed), ease: "linear" },
            tapScale: 0.98,
            hoverScale: 1.0,
            distance: 4,
            description: "Strict uniform mechanical transition for consistent machine-like rhythm",
          };
        case "damped":
        default:
          return {
            physics: "damped",
            speedMultiplier: speed,
            spring: { type: "spring", stiffness: 400, damping: 28, mass: 0.9 },
            drawerTransition: { type: "spring", stiffness: 380, damping: 30 },
            modalTransition: { type: "spring", stiffness: 420, damping: 26 },
            transition: { type: "spring", stiffness: 400, damping: 28, mass: 0.9 },
            popover: {
              initial: { opacity: 0, scale: 0.96, y: -6 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 0.96, y: -6 },
              transition: { type: "spring", stiffness: 400, damping: 28 },
            },
            pillTransition: { type: "spring", stiffness: 400, damping: 28 },
            tapScale: 0.97,
            hoverScale: 1.02,
            distance: 6,
            description: "Refined, balanced harmonic motion designed for enterprise clarity",
          };
      }
    };

    const base = resolveBaseConfig();
    if (base.physics === "instant") {
      return {
        ...base,
        tapScale: tokens.tapScale ?? base.tapScale,
        hoverScale: tokens.hoverScale ?? base.hoverScale,
        distance: tokens.motionDistance ?? base.distance,
      };
    }

    const rawStiffness = tokens.motionStiffness ?? base.spring.stiffness;
    const rawDamping = tokens.motionDamping ?? base.spring.damping;
    const stiffness = Math.round(rawStiffness * speedStiffnessFactor);
    const damping = Math.round(rawDamping * speedDampingFactor);
    const mass = tokens.motionMass ?? base.spring.mass ?? 0.9;
    const tapScale = tokens.tapScale ?? base.tapScale;
    const hoverScale = tokens.hoverScale ?? base.hoverScale;
    const distance = tokens.motionDistance ?? base.distance;

    const drawerStiffness = Math.round(
      (tokens.motionStiffness !== undefined ? tokens.motionStiffness * 0.95 : base.drawerTransition.stiffness ?? 380) *
        speedStiffnessFactor
    );
    const drawerDamping = Math.round(
      (tokens.motionDamping !== undefined ? tokens.motionDamping * 1.06 : base.drawerTransition.damping ?? 30) *
        speedDampingFactor
    );

    const modalStiffness = Math.round(
      (tokens.motionStiffness !== undefined ? tokens.motionStiffness * 1.05 : base.modalTransition.stiffness ?? 420) *
        speedStiffnessFactor
    );
    const modalDamping = Math.round(
      (tokens.motionDamping !== undefined ? tokens.motionDamping * 0.94 : base.modalTransition.damping ?? 26) *
        speedDampingFactor
    );

    const effectiveSpring = { type: "spring" as const, stiffness, damping, mass };
    const linearTween = { type: "tween" as const, duration: Math.max(0.01, 0.16 / speed), ease: "linear" as const };
    const isLinear = base.physics === "linear" && tokens.motionStiffness === undefined && tokens.motionDamping === undefined;

    return {
      ...base,
      speedMultiplier: speed,
      spring: effectiveSpring,
      transition: isLinear ? linearTween : effectiveSpring,
      drawerTransition: isLinear
        ? linearTween
        : { type: "spring", stiffness: drawerStiffness, damping: drawerDamping, mass },
      modalTransition: isLinear
        ? { type: "tween", duration: Math.max(0.01, 0.14 / speed), ease: "linear" }
        : { type: "spring", stiffness: modalStiffness, damping: modalDamping, mass },
      popover: {
        initial: { opacity: 0, scale: base.popover.initial.scale, y: -distance },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: base.popover.exit.scale, y: -distance },
        transition: isLinear
          ? { duration: Math.max(0.01, 0.12 / speed), ease: "linear" }
          : effectiveSpring,
      },
      pillTransition: isLinear
        ? { duration: Math.max(0.01, 0.12 / speed), ease: "linear" }
        : effectiveSpring,
      tapScale,
      hoverScale,
      distance,
    };
  };

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
    scaledPillRadius,
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
    primaryActionTextColor: getContrastColor(tokens.primaryButtonColor),
    motionConfig: getMotionConfig(),
    // Vector Icon Computations
    iconScale: (tokens.iconScaleMultiplier ?? 1.0) * scale,
    iconSize: Math.max(12, Math.round(16 * (tokens.iconScaleMultiplier ?? 1.0) * scale)),
    iconSmSize: Math.max(10, Math.round(14 * (tokens.iconScaleMultiplier ?? 1.0) * scale)),
    iconLgSize: Math.max(16, Math.round(20 * (tokens.iconScaleMultiplier ?? 1.0) * scale)),
    iconStrokeWidth: tokens.iconStrokeWidth ?? 2.0,
    iconFill:
      tokens.iconFill === "currentColor"
        ? "currentColor"
        : tokens.iconFill === "subtle"
        ? tokens.hoverBackplateTint || "rgba(0,0,0,0.06)"
        : "none",
    iconColor: tokens.iconColor || tokens.textIconColor || "#71717A",
    // Data Visualization Computations
    chartColors: (() => {
      let basePalette: string[];
      switch (tokens.chartPalette) {
        case "violet":
          basePalette = ["#6366F1", "#A855F7", "#EC4899", "#06B6D4", "#10B981"];
          break;
        case "sky":
          basePalette = ["#0284C7", "#06B6D4", "#3B82F6", "#64748B", "#6366F1"];
          break;
        case "amber":
          basePalette = ["#F59E0B", "#F97316", "#F43F5E", "#EAB308", "#8B5CF6"];
          break;
        case "monochrome":
          basePalette = ["#18181B", "#3F3F46", "#71717A", "#A1A1AA", "#D4D4D8"];
          break;
        case "emerald":
        default:
          basePalette = ["#10B981", "#84CC16", "#0EA5E9", "#F59E0B", "#8B5CF6"];
          break;
      }
      if (tokens.chartPrimaryColor) {
        basePalette[0] = tokens.chartPrimaryColor;
      }
      if (tokens.chartSecondaryColor) {
        basePalette[1] = tokens.chartSecondaryColor;
      }
      return basePalette;
    })(),
    chartPrimaryColor: tokens.chartPrimaryColor || "#10B981",
    chartSecondaryColor: tokens.chartSecondaryColor || "#64748B",
    chartStrokeWidth: tokens.chartStrokeWidth ?? 2.5,
    chartFillOpacity: tokens.chartFillOpacity ?? 0.25,
    chartGridStyle: tokens.chartGridStyle ?? "dotted",
    direction: tokens.direction || "ltr",
    isRtl: tokens.direction === "rtl",
    isDarkSurface: getContrastColor(tokens.universalFillColor) === "#FFFFFF",
  };
}
