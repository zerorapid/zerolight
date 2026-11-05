import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-semibold rounded-button transition-all duration-150 ease-out active:scale-[0.98] cursor-pointer select-none whitespace-nowrap border disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 outline-none focus-visible:ring-2 focus-visible:ring-brand-glow',
  {
    variants: {
      variant: {
        black:
          'bg-[#0B0F19] hover:bg-[#1E293B] text-white border-transparent shadow-[0_2px_8px_rgba(11,15,25,0.25)]',
        brand:
          'bg-brand-solid hover:bg-brand-shade-60 text-white border-transparent shadow-[0_2px_8px_var(--brand-accent-glow)]',
        secondary:
          'bg-white hover:bg-surface-subtle text-content-main border-border-subtle shadow-xs',
        ghost:
          'bg-transparent hover:bg-surface-subtle text-content-muted hover:text-content-main border-transparent',
        danger:
          'bg-status-error-tint hover:bg-status-error text-status-error hover:text-white border-status-error/20',
      },
      size: {
        sm: 'h-8 px-3.5 text-xs gap-1.5',
        md: 'h-[42px] px-5 text-[13px] gap-2',
        lg: 'h-12 px-6 text-sm gap-2.5',
      },
      radius: {
        pill: 'rounded-pill',
        box: 'rounded-box',
      },
    },
    defaultVariants: {
      variant: 'brand',
      size: 'md',
      radius: 'pill',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, radius, icon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, radius, className }))}
        disabled={disabled}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
