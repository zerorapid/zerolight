import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const inputVariants = cva(
  'w-full transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none font-semibold text-content-main placeholder:text-content-tertiary placeholder:opacity-50 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-white border border-border-subtle hover:border-[#94A3B8] hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus:border-[#0B0F19] focus:shadow-[0_0_0_3.5px_rgba(11,15,25,0.08),0_4px_16px_rgba(0,0,0,0.04)]',
        subtle:
          'bg-surface-subtle border border-transparent hover:border-border-subtle hover:bg-white focus:bg-white focus:border-[#0B0F19] focus:shadow-[0_0_0_3.5px_rgba(11,15,25,0.08),0_4px_16px_rgba(0,0,0,0.04)]',
        ghost:
          'bg-transparent border-none focus:ring-0',
      },
      inputSize: {
        sm: 'h-9 px-3.5 text-xs',
        md: 'h-[42px] px-4 py-2 text-[13px] leading-normal',
        lg: 'h-12 px-5 py-2.5 text-sm',
      },
      radius: {
        pill: 'rounded-full',
        box: 'rounded-box',
        card: 'rounded-card',
      },
      isError: {
        true: 'border-status-error bg-status-error-tint hover:border-status-error focus:border-status-error focus:shadow-[0_0_0_3.5px_rgba(239,68,68,0.15)]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
      radius: 'pill',
      isError: false,
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  unit?: string;
  startIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, radius, isError, unit, startIcon, ...props }, ref) => {
    return (
      <div className="relative w-full flex items-center group">
        {startIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-content-muted transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:text-content-main group-focus-within:scale-110 z-10">
            {startIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            inputVariants({ variant, inputSize, radius, isError, className }),
            startIcon && 'pl-10',
            unit && (unit.length > 3 ? 'pr-16' : 'pr-12')
          )}
          {...props}
        />
        {unit && (
          <span className="absolute right-4 text-[11px] font-semibold text-content-tertiary select-none pointer-events-none transition-colors duration-200 group-focus-within:text-content-main z-10">
            {unit}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
