import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Clock, ShieldCheck, AlertTriangle, Cpu, Droplets, CheckCircle2, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActivityEvent {
  id: string;
  type: 'automation' | 'alert' | 'manual' | 'sync';
  title: string;
  description: string;
  timestamp: string;
  actor?: string;
  status?: 'success' | 'warning' | 'error' | 'neutral';
}

const DEFAULT_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'EVT-01',
    type: 'automation',
    title: 'Automated VFD Aeration Triggered',
    description: 'Pond 03 Dissolved Oxygen dropped below 4.5 mg/L threshold. Aerator ramped to 100% flow.',
    timestamp: '2m ago',
    actor: 'Black Dot IoT Gateway',
    status: 'warning',
  },
  {
    id: 'EVT-02',
    type: 'manual',
    title: 'Daily Feeding Dosing Committed',
    description: 'Logged 230 kg of high-protein ration for Pond 04 (Standing Biomass 8,400 kg).',
    timestamp: '14m ago',
    actor: 'Tech Lead R. Silva',
    status: 'success',
  },
  {
    id: 'EVT-03',
    type: 'sync',
    title: 'Sensor Node Gateway Array Synced',
    description: 'All 4 telemetry submersed probe arrays in Sector Alpha reported 100% signal strength.',
    timestamp: '32m ago',
    actor: 'Gateway Alpha-01',
    status: 'neutral',
  },
  {
    id: 'EVT-04',
    type: 'alert',
    title: 'Microalgae TCBS Plate Analysis Verified',
    description: 'Vibrio plate colony count within optimal health range (< 100 CFU/mL).',
    timestamp: '1h ago',
    actor: 'Diagnostics Lab #03',
    status: 'success',
  },
];

interface ActivityFeedCardProps {
  events?: ActivityEvent[];
  className?: string;
}

export const ActivityFeedCard: React.FC<ActivityFeedCardProps> = ({
  events = DEFAULT_ACTIVITIES,
  className,
}) => {
  const [filter, setFilter] = React.useState<string>('all');

  const filteredEvents = events.filter((e) => {
    if (filter === 'all') return true;
    return e.type === filter;
  });

  const getIcon = (type: ActivityEvent['type'], status?: ActivityEvent['status']) => {
    switch (type) {
      case 'automation':
        return <Cpu className="w-3.5 h-3.5 text-brand-accent stroke-[2.2]" />;
      case 'alert':
        return <AlertTriangle className="w-3.5 h-3.5 text-status-warning stroke-[2.2]" />;
      case 'manual':
        return <CheckCircle2 className="w-3.5 h-3.5 text-status-success stroke-[2.2]" />;
      case 'sync':
      default:
        return <Clock className="w-3.5 h-3.5 text-content-muted stroke-[2.2]" />;
    }
  };

  return (
    <Card
      padding="lg"
      className={cn('w-full flex flex-col justify-between border border-border-subtle bg-white shadow-subtle', className)}
    >
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[var(--brand-tint-90)] flex items-center justify-center text-brand-accessible shrink-0">
              <Activity className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
            <h3 className="text-base font-bold text-content-main tracking-tight">
              Real-Time Farm Audit & Activity Stream
            </h3>
          </div>
          <Badge variant="brand" size="sm">
            Live Gateway
          </Badge>
        </div>

        {/* Micro-interaction filter pills */}
        <div className="flex items-center gap-1.5 mb-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'automation', label: 'IoT Automated' },
            { id: 'alert', label: 'Lab & Alerts' },
            { id: 'manual', label: 'Manual Ops' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                'px-2.5 py-1 text-[11px] font-bold rounded-full transition-all duration-150 active:scale-[0.97] shrink-0',
                filter === tab.id
                  ? 'bg-[#0B0F19] text-white shadow-xs'
                  : 'bg-[#F8FAFC] text-content-muted hover:text-content-main border border-border-subtle/80'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="divide-y divide-border-subtle/60">
          {filteredEvents.map((evt) => (
            <div key={evt.id} className="py-3.5 flex items-start gap-3.5 first:pt-1 last:pb-1">
              <div className="w-8 h-8 rounded-full bg-surface-subtle flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(evt.type, evt.status)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-xs font-bold text-content-main truncate">
                    {evt.title}
                  </span>
                  <span className="text-[11px] font-semibold text-content-tertiary shrink-0">
                    {evt.timestamp}
                  </span>
                </div>

                <p className="text-xs font-normal text-content-muted leading-relaxed line-clamp-2">
                  {evt.description}
                </p>

                {evt.actor && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-semibold text-content-tertiary">
                      Triggered by:
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-subtle text-content-main">
                      {evt.actor}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
