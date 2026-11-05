import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Droplets, Thermometer, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RadialSubMetric {
  label: string;
  val: string;
  icon: React.ReactNode;
}

interface RadialProgressCardProps {
  title?: string;
  score?: number;
  grade?: string;
  subMetrics?: RadialSubMetric[];
  className?: string;
}

const DEFAULT_SUB_METRICS: RadialSubMetric[] = [
  { label: 'D.O. Saturation', val: '98.2%', icon: <Droplets className="w-3.5 h-3.5 text-[#0284C7]" /> },
  { label: 'Temp Stability', val: '96.0%', icon: <Thermometer className="w-3.5 h-3.5 text-[#F59E0B]" /> },
  { label: 'Aerator Power', val: '94.5%', icon: <Wind className="w-3.5 h-3.5 text-[#10B981]" /> },
  { label: 'Bio-Security', val: '92.0%', icon: <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" /> },
];

export const RadialProgressCard: React.FC<RadialProgressCardProps> = ({
  title = 'Composite Farm Health Index',
  score = 94,
  grade = 'Optimal / Grade A+',
  subMetrics = DEFAULT_SUB_METRICS,
  className,
}) => {
  const size = 110;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card
      padding="lg"
      className={cn('w-full flex flex-col justify-between border border-border-subtle bg-white shadow-subtle', className)}
    >
      <div>
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-accent stroke-[2.4]" />
            <h3 className="text-base font-bold text-content-main tracking-tight">
              {title}
            </h3>
          </div>
          <Badge variant="success" size="sm">
            {grade}
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5 py-1">
          {/* Circular Progress Gauge with Centered Labels */}
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                className="stroke-surface-subtle"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                className="stroke-brand-accent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeLinecap="round"
                fill="none"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-bold tracking-tight text-content-main leading-none">
                {score}
              </span>
              <span className="text-[9px] font-bold uppercase text-content-tertiary mt-1">
                Score / 100
              </span>
            </div>
          </div>

          {/* Sub-Metrics Grid with Clean Vertical Alignments */}
          <div className="grid grid-cols-2 gap-2 flex-1 w-full">
            {subMetrics.map((sm) => (
              <div
                key={sm.label}
                className="p-2.5 rounded-cluster bg-[#F8FAFC] border border-border-subtle flex flex-col gap-0.5"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-content-muted">
                  {sm.icon}
                  <span className="truncate">{sm.label}</span>
                </div>
                <span className="text-sm font-bold text-content-main">{sm.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
