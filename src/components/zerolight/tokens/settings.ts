import { SPRING_PRESETS } from './physics';

/**
 * Core ZeroLight Design Token Settings
 * Shared across all atoms, molecules, and templates.
 */
export interface ZeroLightSettings {
  /** Hex color for input borders, e.g. #D4D4D4 */
  borderColor: string;
  /** Hex color for input background fills, e.g. #FFFFFF */
  fillColor: string;
  /** Hex color for primary text & icons, e.g. #111111 */
  textColor: string;
  /** Hex color for kinetic sliding hover backplates, e.g. #F0F0F0 */
  backplateColor: string;
  /** Border stroke width in px (0 to 5) */
  borderWidth: number;
  /** Outer corner radius in px (0 to 24). Automatically scales inner & tag radii */
  radius: number;
  /** Interactive field height density in px (40, 44, 48, 52) */
  height: number;
  /** Base typography font size in px (13 to 16) */
  fontSize: number;
  /** Dropdown menu offset gap in px (4 to 14) */
  gap: number;
  /** Spring motion physics curve key ('1' | '2' | '3') */
  spring: '1' | '2' | '3';
}

/**
 * Canonical default configuration calibrated for enterprise SaaS PoCs
 */
export const DEFAULT_ZEROLIGHT_SETTINGS: ZeroLightSettings = {
  borderColor: '#d4d4d4',
  fillColor: '#ffffff',
  textColor: '#111111',
  backplateColor: '#f0f0f0',
  borderWidth: 1,
  radius: 16,
  height: 48,
  fontSize: 14,
  gap: 8,
  spring: '2',
};

// ==========================================
// GEOMETRIC HARMONY HELPERS
// ==========================================

/** Calculates proportional inner padding and radius to eliminate visual nesting gaps */
export const calculateInnerRadius = (outerRadius: number): string => {
  return `${Math.max(0, Math.round(outerRadius * 0.65))}px`;
};

/** Calculates tag chip radius: matches pill at >= 20px, scales proportionally otherwise */
export const calculateTagRadius = (outerRadius: number): string => {
  return outerRadius >= 20 ? '9999px' : `${Math.max(0, Math.round(outerRadius * 0.75))}px`;
};

/** Calculates checkbox corner radius proportionally */
export const calculateCheckboxRadius = (outerRadius: number): string => {
  return `${Math.min(6, Math.max(0, Math.round(outerRadius * 0.25)))}px`;
};
