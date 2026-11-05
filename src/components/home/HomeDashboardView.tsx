import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { CardSpotlight } from '@/components/ui/CardSpotlight';
import { WelcomeDeviFisheriesBanner } from './WelcomeDeviFisheriesBanner';
import {
  TrendingUp,
  Snowflake,
  ShieldCheck,
  Factory,
  ShoppingCart,
  Boxes,
  BarChart3,
  Palette,
  ChevronRight,
  ExternalLink,
  FileCheck,
  FileSpreadsheet,
  DownloadCloud,
  CalendarClock,
  Users,
  BookOpenCheck,
  LifeBuoy,
  Phone,
  Mail,
  Copy,
  Check,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HomeDashboardViewProps {
  onNavigate: (tab: string) => void;
  onShowToast?: (text: string, type?: 'success' | 'error') => void;
}

interface OperationalModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  hoverAccent: string;
}

interface QuickTool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<string | null>('faq-1');

  // Copy helper with feedback
  const handleCopy = (text: string, fieldName: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    onShowToast?.(`Copied ${label}: ${text}`);
    setTimeout(() => {
      setCopiedField(null);
    }, 2400);
  };

  // 1. Primary Operational Modules (Short, Clean Layman Descriptions)
  const modules: OperationalModule[] = [
    {
      id: 'sales',
      title: 'Sales & Export Contracts',
      description: 'Orders, shipping, and buyer invoices',
      icon: <TrendingUp className="w-5 h-5 stroke-[2.2]" />,
      iconBg: 'bg-teal-50',
      iconBorder: 'border-teal-200/80',
      iconColor: 'text-teal-700',
      hoverAccent: 'hover:border-teal-400 group-hover:text-teal-700',
    },
    {
      id: 'coldstore',
      title: 'Coldstore Terminal',
      description: 'Cold rooms, storage, and temperatures',
      icon: <Snowflake className="w-5 h-5 stroke-[2.2]" />,
      iconBg: 'bg-sky-50',
      iconBorder: 'border-sky-200/80',
      iconColor: 'text-sky-700',
      hoverAccent: 'hover:border-sky-400 group-hover:text-sky-700',
    },
    {
      id: 'qc',
      title: 'Quality Assurance & QC',
      description: 'Lab testing, batches, and safety checks',
      icon: <ShieldCheck className="w-5 h-5 stroke-[2.2]" />,
      iconBg: 'bg-emerald-50',
      iconBorder: 'border-emerald-200/80',
      iconColor: 'text-emerald-700',
      hoverAccent: 'hover:border-emerald-400 group-hover:text-emerald-700',
    },
    {
      id: 'production',
      title: 'Production Lines',
      description: 'Packing lines, grading, and blast freezing',
      icon: <Factory className="w-5 h-5 stroke-[2.2]" />,
      iconBg: 'bg-amber-50',
      iconBorder: 'border-amber-200/80',
      iconColor: 'text-amber-700',
      hoverAccent: 'hover:border-amber-400 group-hover:text-amber-700',
    },
    {
      id: 'purchase',
      title: 'Purchase & Farm Intake',
      description: 'Pond harvests, weighment, and grower receipts',
      icon: <ShoppingCart className="w-5 h-5 stroke-[2.2]" />,
      iconBg: 'bg-cyan-50',
      iconBorder: 'border-cyan-200/80',
      iconColor: 'text-cyan-700',
      hoverAccent: 'hover:border-cyan-400 group-hover:text-cyan-700',
    },
    {
      id: 'inventory',
      title: 'General & Packaging Stores',
      description: 'Master cartons, packaging, and supplies',
      icon: <Boxes className="w-5 h-5 stroke-[2.2]" />,
      iconBg: 'bg-indigo-50',
      iconBorder: 'border-indigo-200/80',
      iconColor: 'text-indigo-700',
      hoverAccent: 'hover:border-indigo-400 group-hover:text-indigo-700',
    },
    {
      id: 'reports',
      title: 'Reports & Export Analytics',
      description: 'Daily production, shipments, and analytics',
      icon: <BarChart3 className="w-5 h-5 stroke-[2.2]" />,
      iconBg: 'bg-blue-50',
      iconBorder: 'border-blue-200/80',
      iconColor: 'text-blue-700',
      hoverAccent: 'hover:border-blue-400 group-hover:text-blue-700',
    },
    {
      id: 'design-asset',
      title: 'Design Assets & Docs',
      description: 'Export carton labels, branding, and guides',
      icon: <Palette className="w-5 h-5 stroke-[2.2]" />,
      iconBg: 'bg-slate-100',
      iconBorder: 'border-slate-200/80',
      iconColor: 'text-slate-700',
      hoverAccent: 'hover:border-slate-400 group-hover:text-slate-800',
    },
  ];

  // 2. High-Frequency Links & Tools (Shortened Descriptions)
  const quickTools: QuickTool[] = [
    {
      id: 'usfda',
      title: 'USFDA & Export Portals',
      description: 'US & international export clearance',
      icon: <FileCheck className="w-4 h-4 stroke-[2.2]" />,
      iconBg: 'bg-emerald-50',
      iconBorder: 'border-emerald-200/70',
      iconColor: 'text-emerald-700',
    },
    {
      id: 'manifest',
      title: 'Export Manifest Generator',
      description: 'Packing lists and commercial invoices',
      icon: <FileSpreadsheet className="w-4 h-4 stroke-[2.2]" />,
      iconBg: 'bg-sky-50',
      iconBorder: 'border-sky-200/70',
      iconColor: 'text-sky-700',
    },
    {
      id: 'reefer-logs',
      title: 'Reefer Sensor Log Exports',
      description: 'Cold room and reefer temperature charts',
      icon: <DownloadCloud className="w-4 h-4 stroke-[2.2]" />,
      iconBg: 'bg-cyan-50',
      iconBorder: 'border-cyan-200/70',
      iconColor: 'text-cyan-700',
    },
    {
      id: 'harvest-sched',
      title: 'Daily Harvest Scheduling',
      description: 'Pond harvests and truck arrival schedules',
      icon: <CalendarClock className="w-4 h-4 stroke-[2.2]" />,
      iconBg: 'bg-teal-50',
      iconBorder: 'border-teal-200/70',
      iconColor: 'text-teal-700',
    },
    {
      id: 'directory',
      title: 'ERP System Directory',
      description: 'Staff directory and supervisor contacts',
      icon: <Users className="w-4 h-4 stroke-[2.2]" />,
      iconBg: 'bg-indigo-50',
      iconBorder: 'border-indigo-200/70',
      iconColor: 'text-indigo-700',
    },
    {
      id: 'haccp',
      title: 'HACCP Directives & SOPs',
      description: 'Factory hygiene and safety guidelines',
      icon: <BookOpenCheck className="w-4 h-4 stroke-[2.2]" />,
      iconBg: 'bg-amber-50',
      iconBorder: 'border-amber-200/70',
      iconColor: 'text-amber-700',
    },
  ];

  // 3. Frequently Asked Questions (Concise Layman Answers)
  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      question: 'How do I check cold room or container temperatures?',
      answer:
        'Open Coldstore Terminal or click Reefer Sensor Log Exports to download temperature records. For urgent issues, contact extension 402.',
    },
    {
      id: 'faq-2',
      question: 'Where do I log daily shrimp deliveries from farms?',
      answer:
        'Open Purchase & Farm Intake and click Dock Inward Arrivals to enter pond batches, grower details, and weights.',
    },
    {
      id: 'faq-3',
      question: 'How do I update export shipping documentation?',
      answer:
        'Go to Sales & Export Contracts, find your order, and update container numbers or shipping dates before port gate-in.',
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      {/* 1. Coastal Welcome Banner with Full-Bleed Graphic */}
      <div className="w-full">
        <WelcomeDeviFisheriesBanner />
      </div>

      {/* 2. Operational Modules (8 Connected Systems) */}
      <div className="flex flex-col gap-3 w-full">
        <div className="px-1">
          <h2 className="text-base sm:text-lg font-bold text-content-main tracking-tight">
            Operational Modules
          </h2>
        </div>

        {/* 4x2 Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((item) => (
            <CardSpotlight
              key={item.id}
              spotlightColor="rgba(0, 167, 188, 0.08)"
              className="rounded-cluster h-full"
            >
              <Card
                radius="cluster"
                padding="sm"
                onClick={() => onNavigate(item.id)}
                className={`p-5 h-full flex flex-col justify-between border border-border-subtle bg-white hover:shadow-subtle transition-all duration-200 cursor-pointer select-none group active:scale-[0.99] relative overflow-hidden ${item.hoverAccent}`}
              >
                <div>
                  {/* Icon & Arrow Row */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl ${item.iconBg} ${item.iconBorder} ${item.iconColor} border flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-all duration-200`}
                    >
                      {item.icon}
                    </div>
                    <ChevronRight className="w-4 h-4 text-content-tertiary group-hover:text-content-main group-hover:translate-x-0.5 transition-all duration-200" />
                  </div>

                  {/* Title & Concise Layman Description */}
                  <h3 className="text-sm sm:text-[15px] font-bold text-content-main tracking-tight group-hover:text-[#007584] transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs font-medium text-content-muted mt-1 leading-normal">
                    {item.description}
                  </p>
                </div>
              </Card>
            </CardSpotlight>
          ))}
        </div>
      </div>

      {/* 3. Important Links & Tools */}
      <div className="flex flex-col gap-3 w-full">
        <div className="px-1">
          <h2 className="text-base sm:text-lg font-bold text-content-main tracking-tight">
            Important Links & Tools
          </h2>
        </div>

        {/* 3x2 Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {quickTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => {
                onShowToast?.(`Opening ${tool.title}...`);
              }}
              className="bg-white rounded-xl p-4 border border-border-subtle hover:border-[#CBD5E1] hover:shadow-subtle transition-all duration-200 cursor-pointer group flex items-start gap-3.5 select-none"
            >
              <div
                className={`w-9 h-9 rounded-lg ${tool.iconBg} ${tool.iconBorder} ${tool.iconColor} border flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform`}
              >
                {tool.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-content-main group-hover:text-[#007584] transition-colors truncate">
                    {tool.title}
                  </h4>
                  <ExternalLink className="w-3.5 h-3.5 text-content-tertiary group-hover:text-[#00a7bc] shrink-0 transition-colors" />
                </div>
                <p className="text-[11px] font-medium text-content-muted mt-0.5 leading-normal">
                  {tool.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bottom Split Row: Frequently Asked Questions (Col-7) + Support Desk (Col-5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
        {/* Left: Frequently Asked Questions */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="px-1">
            <h2 className="text-base sm:text-lg font-bold text-content-main tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col gap-2.5">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl border border-border-subtle overflow-hidden transition-all duration-200 shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50/70 transition-colors cursor-pointer select-none"
                  >
                    <span className="text-xs sm:text-[13px] font-bold text-content-main">
                      {faq.question}
                    </span>

                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-content-tertiary transition-transform duration-200 shrink-0',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100 flex flex-col gap-2 bg-slate-50/40">
                      <p className="text-xs font-medium text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Central Operations Support Desk */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="px-1">
            <h2 className="text-base sm:text-lg font-bold text-content-main tracking-tight">
              Need Help?
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-subtle flex flex-col justify-between select-none">
            <div>
              {/* Icon & Heading */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0 shadow-xs">
                  <LifeBuoy className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-content-main tracking-tight">
                    Immediate Assistance
                  </h3>
                </div>
              </div>

              <p className="text-xs font-medium text-content-muted leading-relaxed">
                Our operations team and technical support desk are available 24/7.
              </p>

              {/* Direct Hotlines Card */}
              <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-2.5">
                {/* Internal Line */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-content-muted">
                    <Phone className="w-3.5 h-3.5 stroke-[2.2] text-teal-600" />
                    <span className="font-semibold">Internal Line:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-content-main">Ext. 402 / 419</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('402', 'phone', 'Internal Extension')}
                      title="Copy Extension"
                      className="p-1 rounded hover:bg-slate-200/70 text-content-muted hover:text-content-main transition-colors cursor-pointer"
                    >
                      {copiedField === 'phone' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Support Email */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-2 text-content-muted">
                    <Mail className="w-3.5 h-3.5 stroke-[2.2] text-teal-600" />
                    <span className="font-semibold">Support Email:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#007584]">ops@devifisheries.com</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('ops@devifisheries.com', 'email', 'Operations Email')}
                      title="Copy Email"
                      className="p-1 rounded hover:bg-slate-200/70 text-content-muted hover:text-content-main transition-colors cursor-pointer"
                    >
                      {copiedField === 'email' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
