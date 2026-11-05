import React from 'react';
import { Info } from 'lucide-react';
import { Badge, type BadgeProps } from '@/components/ui/Badge';
import { Tooltip, SmartTooltipData } from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';

export interface PageHeaderCardProps {
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: BadgeProps['variant'];
  tooltip?: React.ReactNode | SmartTooltipData;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeaderCard: React.FC<PageHeaderCardProps> = ({
  icon,
  iconBg = 'bg-[#0B0F19]',
  iconColor = 'text-white',
  title,
  subtitle,
  badge,
  badgeVariant = 'brand',
  tooltip,
  actions,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-card p-4 sm:p-5 border border-border-subtle shadow-subtle select-none',
        className
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={cn(
            'w-11 h-11 rounded-button flex items-center justify-center shrink-0 shadow-xs',
            iconBg,
            iconColor
          )}
        >
          {icon}
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-bold tracking-tight text-content-main leading-tight truncate">
              {title}
            </h1>
            {badge && (
              <Badge variant={badgeVariant} size="sm">
                {badge}
              </Badge>
            )}
            {tooltip && (
              <Tooltip content={tooltip} side="bottom">
                <span className="p-0.5 rounded-full text-content-tertiary hover:text-content-main cursor-pointer shrink-0">
                  <Info className="w-4 h-4" />
                </span>
              </Tooltip>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-content-muted mt-0.5 font-medium leading-normal truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};
