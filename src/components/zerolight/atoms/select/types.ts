import React from 'react';
import { ZeroLightSettings } from '../../tokens/settings';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SearchSelectProps {
  /** Array of string options or structured SelectOption objects */
  options: (string | SelectOption)[];
  /** Current selected value */
  value: string;
  /** Selection change callback (simple React state) */
  onChange: (val: string) => void;
  /** Trigger placeholder text when nothing is selected */
  placeholder?: string;
  /** Search filter input placeholder text */
  searchPlaceholder?: string;
  /** Message displayed when no options match search query */
  emptyMessage?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field is in an error state */
  isError?: boolean;
  /** Optional token settings override */
  settings?: ZeroLightSettings;
  /** Optional class name on outer wrapper */
  className?: string;
}
