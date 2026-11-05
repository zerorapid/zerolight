import { ZeroLightSettings } from '../../tokens/settings';
import { SelectOption } from '../select/types';

export interface TagSelectProps {
  /** Array of available string options or SelectOption objects */
  options: (string | SelectOption)[];
  /** Array of currently selected values (simple React state) */
  selected: string[];
  /** Selection change callback */
  onChange: (tags: string[]) => void;
  /** Placeholder text when no tags are selected */
  placeholder?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field is in an error state */
  isError?: boolean;
  /** Optional token settings override */
  settings?: ZeroLightSettings;
  /** Optional class name */
  className?: string;
}
