import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { HardDrive, Server, Activity, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UsageMetric {
  label: string;
  displayUsed: string;
  pct: number;
  icon: React.ReactNode;
}

interface UsageMeterCardProps {
  title?: string;
  tierLabel?: string;
  planName?: string;
  metrics?: UsageMetric[];
  className?: string;
  onManagePlan?: () => void;
}

const DEFAULT_METRICS: UsageMetric[] = [
  {
    label: 'Active IoT Telemetry Gateways',
    displayUsed: '16 / 20 Nodes',
    pct: 80,
    icon: <Server className="w-4 h-4 text-brand-accent stroke-[2.2]" />,
  },
  {
    label: 'Cloud Telemetry Archive Storage',
    displayUsed: '2.4 / 10 GB',
    pct: 24,
    icon: <HardDrive className="w-4 h-4 text-[#10B981] stroke-[2.2]" />,
  },
  {
    label: 'Real-Time Streaming Probe Calls',
    displayUsed: '64k / 100k calls',
    pct: 64,
    icon: <Activity className="w-4 h-4 text-[#F59E0B] stroke-[2.2]" />,
  },
];

export const UsageMeterCard: React.FC<UsageMeterCardProps> = ({
  title = 'SaaS Resource Quota & Usage',
  tierLabel = 'Active Tier',
  planName = 'Enterprise Sector Cluster',
  metrics = DEFAULT_METRICS,
  className,
  onManagePlan,
}) => {
  return (
    <Card
      padding="lg"
      className={cn('w-full flex flex-col justify-between border border-border-subtle bg-white shadow-subtle', className)}
    >
      <div>
        {/* Streamlined Header (Single line, zero awkward wrapping) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-border-subtle gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-content-main tracking-tight">
                {title}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF8F5] text-content-main border border-border-subtle">
                {tierLabel}
              </span>
            </div>
            <p className="text-xs text-content-muted mt-0.5">
              Plan: <strong className="text-content-main">{planName}</strong>
            </p>
          </div>

          <Button variant="secondary" size="sm" onClick={onManagePlan} className="active:scale-[0.98]">
            Manage Tier
          </Button>
        </div>

        {/* Meters */}
        <div className="flex flex-col gap-3">
          {metrics.map((m, idx) => {
            const isHigh = m.pct >= 85;

            return (
              <div
                key={idx}
                className="flex flex-col gap-1.5 p-3 rounded-cluster bg-[#F8FAFC] border border-border-subtle"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {m.icon}
                    <span className="font-semibold text-content-main text-xs">{m.label}</span>
                  </div>
                  <span className="font-bold text-content-main text-xs">
                    {m.displayUsed}{' '}
                    <span className={cn('text-[11px] font-bold ml-1', isHigh ? 'text-status-warning' : 'text-content-muted')}>
                      ({m.pct}%)
                    </span>
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      isHigh ? 'bg-status-warning' : 'bg-brand-accent'
                    )}
                    style={{ width: `${m.pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 mt-4 border-t border-border-subtle text-xs text-content-muted">
        <span>Cycle renews Nov 28, 2026 &bull; Auto-billing</span>
        <button
          type="button"
          onClick={onManagePlan}
          className="text-brand-accessible font-semibold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 text-xs active:scale-[0.97] transition-transform"
        >
          View Billing Invoices <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>
      </div>
    </Card>
  );
};
