import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CapsuleOption<T extends string> {
  label: string;
  value: T;
}

interface CapsuleSegmentProps<T extends string> {
  options: CapsuleOption<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
  layoutId?: string;
}

export function CapsuleSegment<T extends string>({
  options,
  value,
  onChange,
  className,
  layoutId = 'capsule-active-pill',
}: CapsuleSegmentProps<T>) {
  // If the tab menu has only 1 item (or none), do not show it - hide it cleanly
  if (!options || options.length <= 1) {
    return null;
  }

  return (
    <div
      className={cn(
        'inline-flex w-fit max-w-full h-9 bg-[#F1F5F9] rounded-full p-1 items-center gap-1 border border-border-subtle select-none relative overflow-x-auto no-scrollbar',
        className
      )}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'relative shrink-0 h-7 rounded-full text-xs cursor-pointer flex items-center justify-center px-3.5 transition-colors duration-150 outline-none z-10 active:scale-[0.97] whitespace-nowrap select-none',
              isActive
                ? 'text-white font-bold'
                : 'text-content-muted hover:text-content-main font-semibold'
            )}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                className="absolute inset-0 bg-[#0B0F19] rounded-full shadow-[0_2px_8px_rgba(11,15,25,0.22)] -z-10"
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
