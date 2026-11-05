import React from 'react';
import { ZeroLightSettings } from '../../tokens/settings';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'size'> {
  /** Current controlled string value */
  value: string;
  /** Value change callback */
  onChange: (val: string) => void;
  /** Leading icon slot */
  startIcon?: React.ReactNode;
  /** Trailing icon slot */
  endIcon?: React.ReactNode;
  /** Whether the field is in an error state */
  isError?: boolean;
  /** Optional token settings override (defaults to DEFAULT_ZEROLIGHT_SETTINGS) */
  settings?: ZeroLightSettings;
  /** Whether to show clear button when text is present (default: true) */
  clearable?: boolean;
}
