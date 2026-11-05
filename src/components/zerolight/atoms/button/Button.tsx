import React from 'react';
import { ZeroLightSettings, DEFAULT_ZEROLIGHT_SETTINGS } from '../../tokens/settings';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: React.ReactNode;
  loading?: boolean;
  settings?: ZeroLightSettings;
}

/**
 * ZeroLight Kinetic Button Atom
 * Tactile action button with tactile press deflection and token-scaled geometry.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      icon,
      loading = false,
      disabled = false,
      settings = DEFAULT_ZEROLIGHT_SETTINGS,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const radius = settings.radius >= 20 ? '9999px' : `${settings.radius}px`;

    const variantStyles = {
      primary: 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm',
      secondary: 'bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300',
      ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-700',
      danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        style={{
          borderRadius: radius,
          height: `${settings.height}px`,
          fontSize: `${settings.fontSize}px`,
          ...style,
        }}
        className={`tactile-press w-full font-semibold px-5 inline-flex items-center justify-center gap-2 transition-all outline-none select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variantStyles[variant]} ${className}`}
        {...rest}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'ZeroLightButton';

// Aliases
export const ZlButton = Button;
export const ZeroButton = Button;
