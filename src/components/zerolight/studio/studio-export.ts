import { ZeroLightTokens } from "../types";

export const TOKENS_STORAGE_KEY = "zerolight.tokens.v1";
export const STUDIO_WIDTH_STORAGE_KEY = "zerolight.studioWidth.v1";

export interface RegistryIndexItem {
  name: string;
  title: string;
  type: string;
  tier: "core" | "atoms" | "molecules" | "organisms" | "templates" | "views";
  targetPath: string;
  dependencies: string[];
  registryDependencies: string[];
  lines: number;
  registryUrl: string;
}

export interface RegistryItemDetail {
  name: string;
  title: string;
  tier: string;
  dependencies: string[];
  registryDependencies: string[];
  files: { path: string; content: string }[];
}

export function getExportSnippet(
  format: "tailwind" | "css" | "json",
  t: ZeroLightTokens
): string {
  if (format === "tailwind") {
    return `// tailwind.config.js snippet
module.exports = {
  theme: {
    extend: {
      colors: {
        zl: {
          border: '${t.universalBorderColor}',
          fill: '${t.universalFillColor}',
          text: '${t.textIconColor}',
          primary: '${t.primaryButtonColor}',
          hover: '${t.hoverBackplateTint}',
        },
      },
      borderRadius: {
        zl: '${t.cornerRadius === 999 ? "9999px" : `${t.cornerRadius}px`}',
        'zl-inner': '${t.cornerRadius === 999 ? "9999px" : `${Math.max(0, t.cornerRadius - 4)}px`}',
      },
      borderWidth: {
        zl: '${t.borderWidth}px',
      },
      height: {
        zl: '${t.heightDensity}px',
      },
    },
  },
};`;
  }
  if (format === "css") {
    return `/* ZeroLight Universal Design Tokens */
:root {
  --zl-border-color: ${t.universalBorderColor};
  --zl-fill-color: ${t.universalFillColor};
  --zl-text-color: ${t.textIconColor};
  --zl-primary-action: ${t.primaryButtonColor};
  --zl-hover-tint: ${t.hoverBackplateTint};
  --zl-border-width: ${t.borderWidth}px;
  --zl-corner-radius: ${t.cornerRadius === 999 ? "9999px" : `${t.cornerRadius}px`};
  --zl-inner-radius: ${t.cornerRadius === 999 ? "9999px" : `${Math.max(0, t.cornerRadius - 4)}px`};
  --zl-height-density: ${t.heightDensity}px;
  --zl-menu-gap: ${t.menuOffsetGap}px;
  --zl-base-font-size: ${t.fontSize}px;
  --zl-scale-factor: ${t.scaleMultiplier};
  --zl-icon-scale: ${t.iconScaleMultiplier};
  --zl-icon-stroke: ${t.iconStrokeWidth}px;
  --zl-icon-fill: ${t.iconFill};
  --zl-icon-color: ${t.iconColor};
  --zl-direction: ${t.direction};
  --zl-motion-physics: ${t.motionPhysics};
  --zl-motion-speed: ${t.motionSpeedMultiplier};
  --zl-motion-mass: ${t.motionMass ?? "auto"};
  --zl-motion-distance: ${t.motionDistance ?? "auto"};
  --zl-hover-scale: ${t.hoverScale ?? "auto"};
  --zl-chart-primary: ${t.chartPrimaryColor};
}`;
  }
  return JSON.stringify(
    {
      scaleMultiplier: t.scaleMultiplier,
      direction: t.direction,
      universalBorderColor: t.universalBorderColor,
      universalFillColor: t.universalFillColor,
      textIconColor: t.textIconColor,
      primaryButtonColor: t.primaryButtonColor,
      hoverBackplateTint: t.hoverBackplateTint,
      borderWidth: t.borderWidth,
      cornerRadius: t.cornerRadius,
      heightDensity: t.heightDensity,
      menuOffsetGap: t.menuOffsetGap,
      fontSize: t.fontSize,
      motionPhysics: t.motionPhysics,
      motionSpeedMultiplier: t.motionSpeedMultiplier,
      motionStiffness: t.motionStiffness,
      motionDamping: t.motionDamping,
      motionMass: t.motionMass,
      motionDistance: t.motionDistance,
      tapScale: t.tapScale,
      hoverScale: t.hoverScale,
      iconScaleMultiplier: t.iconScaleMultiplier,
      iconStrokeWidth: t.iconStrokeWidth,
      iconFill: t.iconFill,
      iconColor: t.iconColor,
      chartPalette: t.chartPalette,
      chartPrimaryColor: t.chartPrimaryColor,
      chartSecondaryColor: t.chartSecondaryColor,
      chartStrokeWidth: t.chartStrokeWidth,
      chartFillOpacity: t.chartFillOpacity,
      chartGridStyle: t.chartGridStyle,
    },
    null,
    2
  );
}
