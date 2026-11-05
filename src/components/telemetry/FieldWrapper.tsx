import React from 'react';
import { cn } from '@/lib/utils';

interface FieldWrapperProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  label,
  error,
  children,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      <div className="flex justify-between items-center px-1 text-[11px] font-bold text-content-muted select-none">
        <span>{label}</span>
        {error && <span className="text-status-error font-semibold text-[11px]">{error}</span>}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};
