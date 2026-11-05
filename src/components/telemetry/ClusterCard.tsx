import React from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface ClusterCardProps {
  badgeText: string;
  badgeIcon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  accentColor?: 'indigo' | 'ocean' | 'emerald' | 'amber';
}

export const ClusterCard: React.FC<ClusterCardProps> = ({
  badgeText,
  badgeIcon,
  children,
  className,
  accentColor = 'indigo',
}) => {
  const accentStyles = {
    indigo: {
      badge: 'text-indigo-600 bg-indigo-50/80 border border-indigo-100',
      icon: 'text-indigo-600',
    },
    ocean: {
      badge: 'text-sky-600 bg-sky-50/80 border border-sky-100',
      icon: 'text-sky-600',
    },
    emerald: {
      badge: 'text-emerald-700 bg-emerald-50/80 border border-emerald-100',
      icon: 'text-emerald-600',
    },
    amber: {
      badge: 'text-amber-700 bg-amber-50/80 border border-amber-100',
      icon: 'text-amber-600',
    },
  };

  const currentAccent = accentStyles[accentColor];

  return (
    <Card
      variant="cluster"
      radius="cluster"
      padding="cluster"
      className={cn(
        'flex flex-col gap-3.5 border border-border-subtle bg-white hover:border-[#CBD5E1] hover:shadow-xs transition-all duration-150 select-none',
        className
      )}
    >
      <div className="flex items-center justify-between px-0.5 mb-0.5">
        <div
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-bold tracking-[0.04em] uppercase select-none',
            currentAccent.badge
          )}
        >
          <span className={currentAccent.icon}>{badgeIcon}</span>
          <span>{badgeText}</span>
        </div>
      </div>
      <div className="flex flex-col gap-3.5 w-full">{children}</div>
    </Card>
  );
};
