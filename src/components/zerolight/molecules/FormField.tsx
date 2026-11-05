import React from 'react';

export interface FormFieldProps {
  /** Label text */
  label: string;
  /** Right-aligned subtext or badge (e.g. "Single-line", "Optional") */
  badge?: string;
  /** Primary child atom (e.g. <Input />, <SearchSelect />, <TagSelect />) */
  children: React.ReactNode;
  /** Error message to display under field */
  error?: string;
  /** Helper text displayed when no error */
  helperText?: string;
  /** Optional HTML for id */
  htmlFor?: string;
  className?: string;
}

/**
 * ZeroLight FormField Molecule
 * Standardizes label hierarchy, optional badges, error messaging, and spacing.
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  badge,
  children,
  error,
  helperText,
  htmlFor,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      <div className="flex justify-between items-baseline px-1">
        <label
          htmlFor={htmlFor}
          className="text-xs font-semibold text-neutral-800 select-none cursor-pointer"
        >
          {label}
        </label>
        {badge && (
          <span className="text-[11px] text-neutral-500 font-medium select-none">
            {badge}
          </span>
        )}
      </div>

      <div>{children}</div>

      {error ? (
        <p className="text-[11px] font-medium text-rose-500 px-1 select-none animate-in fade-in duration-150">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-neutral-500 px-1 select-none">{helperText}</p>
      ) : null}
    </div>
  );
};
