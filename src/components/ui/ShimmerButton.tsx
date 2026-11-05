import React from 'react';
import { cn } from '@/lib/utils';

export interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ children, icon, className, size = 'md', disabled, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-8 px-3.5 text-xs gap-1.5',
      md: 'h-[42px] px-5 text-[13px] gap-2',
      lg: 'h-12 px-6 text-sm gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          // Guaranteed rock-solid obsidian black background (never dropped by JIT)
          'relative inline-flex items-center justify-center font-semibold rounded-full select-none cursor-pointer overflow-hidden outline-none',
          'bg-[#0B0F19] text-white border border-white/10 hover:bg-[#1E293B] shadow-[0_2px_10px_rgba(11,15,25,0.3)]',
          'transition-all duration-150 ease-out active:scale-[0.98]',
          'disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 group',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {/* Subtle, non-intrusive luminous shimmer highlight sweep */}
        <span
          className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
        />

        {icon && <span className="shrink-0 relative z-10">{icon}</span>}
        <span className="relative z-10 flex items-center gap-1.5">{children}</span>
      </button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';
