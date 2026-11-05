import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center justify-center font-bold transition-colors select-none tracking-tight',
  {
    variants: {
      variant: {
        default: 'bg-surface-subtle text-content-main border border-border-subtle',
        neutral: 'bg-surface-subtle text-content-muted',
        secondary: 'bg-slate-100 text-slate-700 border border-slate-200/80',
        brand: 'bg-[var(--brand-tint-90)] text-[var(--brand-shade-30)] border border-[var(--brand-tint-70)]',
        success: 'bg-status-success-tint text-status-success',
        warning: 'bg-status-warning-tint text-status-warning',
        error: 'bg-status-error-tint text-status-error',
        outline: 'bg-transparent border border-border-subtle text-content-muted',
      },
      size: {
        sm: 'text-[10px] px-2.5 py-0.5',
        md: 'text-[11px] px-3 py-1',
        lg: 'text-xs px-3.5 py-1.5',
      },
      radius: {
        pill: 'rounded-pill',
        box: 'rounded-box',
      },
      pulse: {
        true: 'animate-pulse',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      radius: 'pill',
      pulse: false,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant,
  size,
  radius,
  pulse,
  icon,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(badgeVariants({ variant, size, radius, pulse, className }))}
      {...props}
    >
      {icon && <span className="mr-1.5 shrink-0">{icon}</span>}
      {children}
    </div>
  );
};
