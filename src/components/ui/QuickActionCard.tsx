import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';
import { Zap, Bell, Droplets, ShieldAlert, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  category: string;
}

const DEFAULT_RULES: AutomationRule[] = [
  {
    id: 'RULE-01',
    name: 'Emergency D.O. Aerator Surge',
    description: 'Auto-ramps VFD aerator to 100% capacity whenever dissolved oxygen falls below 4.5 mg/L.',
    icon: <Zap className="w-4 h-4 text-brand-accent stroke-[2.2]" />,
    enabled: true,
    category: 'Telemetry Trigger',
  },
  {
    id: 'RULE-02',
    name: 'Diurnal Night Jet Aeration Mode',
    description: 'Automatically engages auxiliary 18kW water jets between 00:00 and 06:00 to mitigate dawn oxygen sags.',
    icon: <Droplets className="w-4 h-4 text-[#10B981] stroke-[2.2]" />,
    enabled: true,
    category: 'Time Schedule',
  },
  {
    id: 'RULE-03',
    name: 'Instant SMS & Webhook Bio-Alerts',
    description: 'Dispatches emergency SMS alarms to farm duty operators when critical ammonia or pH anomalies trigger.',
    icon: <Bell className="w-4 h-4 text-[#F59E0B] stroke-[2.2]" />,
    enabled: false,
    category: 'Notifications',
  },
];

interface QuickActionCardProps {
  title?: string;
  badgeLabel?: string;
  rules?: AutomationRule[];
  onToggleRule?: (id: string, nextState: boolean) => void;
  className?: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title = 'Automated Telemetry Workflows & Triggers',
  badgeLabel = '3 Workflows',
  rules = DEFAULT_RULES,
  onToggleRule,
  className,
}) => {
  const [localRules, setLocalRules] = useState<AutomationRule[]>(rules);

  const handleToggle = (id: string) => {
    setLocalRules((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const next = !r.enabled;
          onToggleRule?.(id, next);
          return { ...r, enabled: next };
        }
        return r;
      })
    );
  };

  return (
    <Card
      padding="lg"
      className={cn('w-full flex flex-col justify-between border border-border-subtle bg-white', className)}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-accent stroke-[2.2]" />
            <h3 className="text-base font-bold text-content-main tracking-tight">
              {title}
            </h3>
          </div>
          <Badge variant="neutral" size="sm">
            {badgeLabel}
          </Badge>
        </div>

        <div className="flex flex-col gap-3">
          {localRules.map((rule) => (
            <div
              key={rule.id}
              className={cn(
                'px-4 py-3 rounded-cluster border transition-all flex items-center justify-between gap-4',
                rule.enabled
                  ? 'bg-white border-border-subtle shadow-xs'
                  : 'bg-surface-subtle/50 border-border-subtle/50 opacity-70'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-surface-subtle flex items-center justify-center shrink-0">
                  {rule.icon}
                </div>
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <span className="text-xs font-bold text-content-main whitespace-nowrap">
                    {rule.name}
                  </span>
                  <Tooltip content={rule.description}>
                    <Info className="w-3.5 h-3.5 text-content-tertiary hover:text-content-main cursor-pointer shrink-0" />
                  </Tooltip>
                  <Badge variant={rule.enabled ? 'success' : 'neutral'} size="sm">
                    {rule.enabled ? 'Active' : 'Paused'}
                  </Badge>
                </div>
              </div>

              {/* iOS / Apple-Style Pill Switch */}
              <button
                type="button"
                onClick={() => handleToggle(rule.id)}
                className={cn(
                  'w-11 h-6 rounded-full transition-all duration-200 p-0.5 cursor-pointer relative shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-brand-glow active:scale-[0.96]',
                  rule.enabled ? 'bg-brand-accent' : 'bg-slate-300'
                )}
                aria-label={`Toggle ${rule.name}`}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    rule.enabled ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
