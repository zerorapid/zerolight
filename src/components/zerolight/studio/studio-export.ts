import { ZeroLightTokens, buildGoogleFontsUrl } from "../types";

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
  const fontFamily = t.fontFamily || "Plus Jakarta Sans";
  const headingFont = t.headingFontFamily || fontFamily;
  const googleFontsUrl = buildGoogleFontsUrl([fontFamily, headingFont]);

  if (format === "tailwind") {
    return `// tailwind.config.js snippet
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['"${fontFamily}"', 'system-ui', 'sans-serif'],
        heading: ['"${headingFont}"', 'system-ui', 'sans-serif'],
      },
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
@import url('${googleFontsUrl}');

:root {
  --zl-font-family: '${fontFamily}', system-ui, sans-serif;
  --zl-heading-font: '${headingFont}', system-ui, sans-serif;
  --zl-body-weight: ${t.bodyWeight ?? 400};
  --zl-heading-weight: ${t.headingWeight ?? 700};
  --zl-font-style: ${t.fontStyle ?? "normal"};
  --zl-letter-spacing: ${t.letterSpacing === "tight" ? "-0.025em" : t.letterSpacing === "wide" ? "0.025em" : "0em"};
  --zl-line-height: ${t.lineHeight === "compact" ? "1.35" : t.lineHeight === "relaxed" ? "1.65" : "1.5"};
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
      fontFamily,
      headingFontFamily: headingFont,
      bodyWeight: t.bodyWeight ?? 400,
      headingWeight: t.headingWeight ?? 700,
      fontStyle: t.fontStyle ?? "normal",
      letterSpacing: t.letterSpacing ?? "normal",
      lineHeight: t.lineHeight ?? "normal",
      tabularNums: t.tabularNums !== false,
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
