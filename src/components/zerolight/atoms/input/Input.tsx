import React, { useRef, useImperativeHandle } from 'react';
import { InputProps } from './types';
import { DEFAULT_ZEROLIGHT_SETTINGS } from '../../tokens/settings';

/**
 * ZeroLight Input Atom
 * Single-line kinetic input with tactile press deflection, clear action, and dynamic token projection.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Type here...',
      startIcon,
      endIcon,
      isError = false,
      clearable = true,
      settings = DEFAULT_ZEROLIGHT_SETTINGS,
      className = '',
      disabled = false,
      autoComplete = 'off',
      ...rest
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    const outerRadius = `${settings.radius}px`;

    const handleClear = () => {
      onChange('');
      internalRef.current?.focus();
    };

    return (
      <div className="relative w-full flex items-center group">
        {startIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-neutral-400 z-10 transition-colors group-focus-within:text-neutral-900">
            {startIcon}
          </div>
        )}

        <input
          ref={internalRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          style={{
            backgroundColor: settings.fillColor,
            borderColor: isError ? '#EF4444' : settings.borderColor,
            borderWidth: `${settings.borderWidth}px`,
            color: settings.textColor,
            borderRadius: outerRadius,
            height: `${settings.height}px`,
            fontSize: `${settings.fontSize}px`,
          }}
          className={`tactile-press w-full outline-none font-medium transition-all select-none placeholder:text-neutral-400 placeholder:font-normal focus:ring-1 focus:ring-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed ${
            startIcon ? 'pl-10' : 'pl-4'
          } ${clearable && value.length > 0 ? 'pr-10' : endIcon ? 'pr-10' : 'pr-4'} ${className}`}
          {...rest}
        />

        {clearable && value.length > 0 && !disabled && (
          <button
            type="button"
            aria-label="Clear field"
            onClick={handleClear}
            className="absolute right-3 w-5 h-5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center text-xs transition-transform active:scale-90 cursor-pointer z-10"
          >
            ✕
          </button>
        )}

        {!clearable && endIcon && (
          <div className="absolute right-3.5 flex items-center pointer-events-none text-neutral-400 z-10">
            {endIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'ZeroLightInput';

// Aliases for seamless developer ergonomics
export const ZlInput = Input;
export const ZeroInput = Input;
export const FluidStandardInput = Input;
