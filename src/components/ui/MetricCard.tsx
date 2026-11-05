import React from 'react';
import { Card } from '@/components/ui/Card';
import { CardSpotlight } from '@/components/ui/CardSpotlight';
import { Badge } from '@/components/ui/Badge';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MetricCardProps {
  title: string;
  value: string | number;
  delta?: string;
  isPositive?: boolean;
  subtext?: string;
  icon?: React.ReactNode;
  sparklineData?: number[]; // Deprecated: preserved for interface backwards-compatibility
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  delta,
  isPositive = true,
  subtext,
  icon,
  className,
}) => {
  return (
    <CardSpotlight
      spotlightColor={isPositive ? 'rgba(0, 167, 188, 0.08)' : 'rgba(239, 68, 68, 0.08)'}
      className="rounded-cluster h-full"
    >
      <Card
        radius="cluster"
        padding="sm"
        className={cn(
          'p-5 h-full flex flex-col justify-between hover:shadow-floating hover:border-[#CBD5E1] transition-all duration-200 border border-border-subtle bg-white select-none',
          className
        )}
      >
        <div>
          {/* Header Row: Metric Title + Prominent Lucide Icon Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
              {title}
            </span>
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[#0B0F19] shrink-0 border border-slate-200/80 shadow-xs">
              {icon || <Activity className="w-4 h-4 stroke-[2.2] text-[#0B0F19]" />}
            </div>
          </div>

          {/* Value Row: Bold Typography, Zero Sparkline Distortion */}
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="text-2xl font-bold tracking-tight text-content-main">
              {value}
            </span>
          </div>
        </div>

        {/* Footer Row: Context Subtext + Trend Badge */}
        {(delta || subtext) && (
          <div className="flex items-center justify-between pt-3 border-t border-border-subtle/50 mt-3 gap-2">
            {subtext ? (
              <span className="text-[11px] font-medium text-content-muted">
                {subtext}
              </span>
            ) : <div />}
            {delta && (
              <Badge
                variant={isPositive ? 'success' : 'neutral'}
                size="sm"
                icon={
                  delta.startsWith('+') || delta.startsWith('-') ? (
                    isPositive ? (
                      <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                    )
                  ) : undefined
                }
              >
                {delta}
              </Badge>
            )}
          </div>
        )}
      </Card>
    </CardSpotlight>
  );
};
