import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MetricCard } from '@/components/ui/MetricCard';
import { Input } from '@/components/ui/Input';
import { Tooltip } from '@/components/ui/Tooltip';
import { PageHeaderCard } from '@/components/ui/PageHeaderCard';
import {
  LifeBuoy,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Radio,
  FileQuestion,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SupportViewProps {
  onShowToast?: (text: string, type?: 'success' | 'error') => void;
}

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Optical Sensors',
    question: 'How often should optical dissolved oxygen (DO) caps be recalibrated?',
    answer:
      'Luminescent optical DO sensors require zero-point and water-saturated air 100% calibration every 30 days under standard biological biofilm accumulation. If Secchi depth drops below 25 cm, clean the optical window with isopropyl alcohol wipes.',
  },
  {
    id: 'faq-2',
    category: 'Biomass & Feeding',
    question: 'What triggers automated feeding suspension during nighttime hours?',
    answer:
      'The Black Dot Telemetry OS automatically locks out automated acoustic feed dispensers if pond dissolved oxygen drops below 4.5 mg/L or if water temperature drops below 24°C, preventing feed waste and anaerobic sludge formation.',
  },
  {
    id: 'faq-3',
    category: 'Bacteriology',
    question: 'What is the safe ratio between Yellow and Green Vibrio colonies on TCBS plates?',
    answer:
      'A healthy pond biota maintains a Yellow (V. alginolyticus) to Green (V. parahaemolyticus) colony ratio greater than 20:1. If green colonies exceed 200 CFU/mL, immediately schedule high-potency Bacillus probiotic inoculation.',
  },
  {
    id: 'faq-4',
    category: 'Hardware & Telemetry',
    question: 'How do LoRaWAN edge nodes maintain connectivity during monsoon storms?',
    answer:
      'All Black Dot IoT edge nodes feature dual 868/915 MHz long-range LoRa radios with IP68 marine grade enclosures and solar-buffered LiFePO4 battery banks providing up to 96 hours of autonomy without direct sunlight.',
  },
];

export const SupportView: React.FC<SupportViewProps> = ({ onShowToast }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaq, setOpenFaq] = useState<string | null>('faq-1');
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketCategory, setTicketCategory] = useState<string>('Sensor Drift');
  const [ticketPriority, setTicketPriority] = useState<'Normal' | 'High' | 'Emergency'>('Normal');
  const [ticketDetails, setTicketDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) {
      onShowToast?.('Please specify a ticket subject.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onShowToast?.(`Priority ticket [#TK-9821] "${ticketSubject}" dispatched to Black Dot On-Call Support.`);
      setTicketSubject('');
      setTicketDetails('');
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Sticky Sub-Menu Header Dock with Smooth Fade */}
      <div className="sticky top-[86px] z-20 bg-canvas/95 backdrop-blur-md pt-1 pb-3 -mt-1 flex flex-col gap-2">
        <PageHeaderCard
          icon={<LifeBuoy className="w-5 h-5 stroke-[2.2]" />}
          iconBg="bg-[#0B0F19] text-white"
          title="Enterprise Operations & Support"
          subtitle="24/7 dedicated telemetry agronomy desk, edge gateway diagnostics, and priority tickets"
          badge="99.98% SLA Active"
          badgeVariant="success"
          tooltip={{
            title: 'Devi Operations Support',
            description: 'Tier-1 agronomist response within 15 minutes',
          }}
          actions={
            <span className="flex items-center gap-1.5 text-xs font-bold text-[#0B0F19] bg-[#FAF8F5] px-3 py-1.5 rounded-full border border-border-subtle">
              <Radio className="w-3.5 h-3.5 text-status-success animate-pulse" />
              12/12 Edge Gateways Live
            </span>
          }
        />
        {/* Organic Dissolving Feather */}
        <div className="h-6 w-full pointer-events-none bg-gradient-to-b from-canvas via-canvas/60 to-transparent -mb-6" />
      </div>

      {/* Top 4 SLA Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Gateway Uptime (30d)"
          value="99.98%"
          subtext="Downtime: 4.2 mins"
          delta="+0.02%"
          isPositive={true}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-500 stroke-[2.2]" />}
          sparklineData={[99.92, 99.94, 99.95, 99.96, 99.97, 99.98, 99.98]}
        />
        <MetricCard
          title="Sensor Ping Latency"
          value="14 ms"
          subtext="LoRaWAN 868MHz Sync"
          delta="-2 ms"
          isPositive={true}
          icon={<Radio className="w-4 h-4 text-brand-accent stroke-[2.2]" />}
          sparklineData={[22, 20, 18, 17, 16, 15, 14]}
        />
        <MetricCard
          title="Mean Resolution Time"
          value="4.8 mins"
          subtext="Target: < 15 mins"
          delta="-1.2m"
          isPositive={true}
          icon={<Sparkles className="w-4 h-4 text-amber-500 stroke-[2.2]" />}
          sparklineData={[8.5, 7.2, 6.4, 5.8, 5.2, 5.0, 4.8]}
        />
        <MetricCard
          title="Dedicated Agronomist"
          value="Dr. Aris Thorne"
          subtext="Direct Desk Online"
          delta="Assigned"
          isPositive={true}
          icon={<LifeBuoy className="w-4 h-4 text-[#0B0F19] stroke-[2.2]" />}
          sparklineData={[50, 50, 50, 50, 50, 50, 50]}
        />
      </div>

      {/* Main Grid: Troubleshooting Accordion + Priority Ticket Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Searchable FAQ & Knowledge Base */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card padding="lg" className="flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-content-main">Operational Knowledge Base</h3>
                <p className="text-xs text-content-muted">Standard operating procedures & sensor diagnostics</p>
              </div>

              {/* Search Pill Input */}
              <div className="w-full sm:w-64">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="rounded-full"
                />
              </div>
            </div>

            {/* Accordion FAQ Items */}
            <div className="flex flex-col gap-3">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="rounded-cluster border border-border-subtle bg-white overflow-hidden transition-all shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF8F5] text-content-main border border-border-subtle">
                          {faq.category}
                        </span>
                        <span className="text-xs font-bold text-content-main">{faq.question}</span>
                      </div>
                      <span className="text-content-muted shrink-0">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="p-4 pt-1 bg-[#F8FAFC] border-t border-border-subtle text-xs text-content-muted leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredFaqs.length === 0 && (
                <div className="p-8 text-center text-xs text-content-muted">
                  No troubleshooting documents found matching "{searchQuery}".
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column (5 Cols): Dispatch Priority Support Ticket */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card padding="lg" className="flex flex-col border-2 border-border-subtle bg-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-content-main">Create Dispatch Ticket</h3>
                <p className="text-xs text-content-muted">Direct telemetry engineering escalation</p>
              </div>
              <Badge variant="brand" size="sm">
                Priority Desk
              </Badge>
            </div>

            <form onSubmit={handleSubmitTicket} className="flex flex-col gap-3.5">
              {/* Category Selection */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-content-main">Issue Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Sensor Drift', 'Hardware Fail', 'Bio Outbreak'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setTicketCategory(cat)}
                      className={cn(
                        'px-2 py-1.5 text-xs font-bold rounded-full border transition-all text-center',
                        ticketCategory === cat
                          ? 'bg-[#0B0F19] text-white border-[#0B0F19] shadow-xs'
                          : 'bg-[#F8FAFC] text-content-muted border-border-subtle hover:text-content-main'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Pill Select */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-content-main">Severity SLA</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Normal', 'High', 'Emergency'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setTicketPriority(sev)}
                      className={cn(
                        'px-2 py-1.5 text-xs font-bold rounded-full border transition-all text-center',
                        ticketPriority === sev
                          ? sev === 'Emergency'
                            ? 'bg-[#EF4444] text-white border-[#EF4444]'
                            : 'bg-[#0B0F19] text-white border-[#0B0F19]'
                          : 'bg-[#F8FAFC] text-content-muted border-border-subtle hover:text-content-main'
                      )}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-content-main">Incident Summary</label>
                <Input
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Pond 03 DO probe fluctuating +/- 2.5 mg/L"
                  className="rounded-full"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-content-main">Telemetry Diagnostics Note</label>
                <textarea
                  value={ticketDetails}
                  onChange={(e) => setTicketDetails(e.target.value)}
                  placeholder="Provide any observed symptoms, recent feeding changes, or weather events..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-cluster bg-white border border-border-subtle text-xs text-content-main placeholder:text-content-tertiary focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all resize-none"
                />
              </div>

              {/* Obsidian Black Action Button */}
              <Button
                type="submit"
                variant="black"
                size="md"
                disabled={isSubmitting}
                className="w-full mt-2"
                icon={<MessageSquare className="w-4 h-4 stroke-[2.2]" />}
              >
                {isSubmitting ? 'Dispatching Ticket...' : 'Dispatch Priority Ticket'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
