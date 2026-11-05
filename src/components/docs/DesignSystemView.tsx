import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { CapsuleSegment } from '@/components/ui/CapsuleSegment';
import { TagInput } from '@/components/ui/TagInput';
import { DatePickerPopover } from '@/components/ui/DatePickerPopover';
import { Copy, Palette, Box, Sparkles, Layers, LayoutGrid, Droplets, Activity, Scale, Sliders } from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { RadialProgressCard } from '@/components/ui/RadialProgressCard';
import { UsageMeterCard } from '@/components/ui/UsageMeterCard';
import { QuickActionCard } from '@/components/ui/QuickActionCard';
import { FluidInputAtomsStudio } from '@/components/studio/FluidInputAtomsStudio';

export const DesignSystemView: React.FC = () => {
  const [studioSection, setStudioSection] = useState<'fluid-studio' | 'tokens'>('fluid-studio');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [demoSelect, setDemoSelect] = useState('P. vannamei');
  const [demoPhase, setDemoPhase] = useState<'Seed' | 'Grow-out' | 'Harvest'>('Grow-out');
  const [demoTags, setDemoTags] = useState(['B. subtilis', 'Molasses']);
  const [demoDate, setDemoDate] = useState('Oct 29, 2026');
  const [demoInput, setDemoInput] = useState('6.5');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(label);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const tokens = {
    canvas: [
      { name: '--bg-canvas', val: '#F4F5F8', desc: 'Main application background' },
      { name: '--surface-card', val: '#FFFFFF', desc: 'Panel & Card surfaces' },
      { name: '--surface-subtle', val: '#F0F2F6', desc: 'Subtle pills, headers & secondary inputs' },
      { name: '--surface-hover', val: '#E6E9EE', desc: 'Interactive hover feedback' },
    ],
    text: [
      { name: '--text-main', val: '#0B0F19', desc: 'Primary titles & strong metrics (High contrast)' },
      { name: '--text-muted', val: '#5E697D', desc: 'Field labels, subtext & metadata' },
      { name: '--text-tertiary', val: '#929EB2', desc: 'Placeholders & unit notations' },
    ],
    brand: [
      { name: '--brand-base', val: '#00a7bc', desc: 'Core Brand Color (Primary Volume & Data Visualizations)' },
      { name: '--brand-accessible-text', val: '#007584', desc: 'Accessible colored text on white (4.8:1 WCAG AA)' },
      { name: '--brand-solid-fill', val: '#00545e', desc: 'Solid primary button fill with white text (7.0:1 WCAG AAA)' },
      { name: '--brand-accent-tint', val: '#e6f6f8', desc: 'Soft accessible background tint' },
    ],
    status: [
      { name: '--color-success', val: '#10B981', tint: '#ECFDF5', label: 'Normal / Optimal' },
      { name: '--color-warning', val: '#F59E0B', tint: '#FFFBEB', label: 'Attention / Caution' },
      { name: '--color-error', val: '#EF4444', tint: '#FEF2F2', label: 'Critical / Alarm' },
    ],
    radii: [
      { name: '--radius-card', val: '20px', desc: 'Outer panels, dashboard containers & views' },
      { name: '--radius-sidebar', val: '20px', desc: 'Floating dark sidebar container' },
      { name: '--radius-cluster', val: '18px', desc: 'Grouped parameter cluster cards' },
      { name: '--radius-pill', val: '9999px', desc: 'Interactive controls, buttons, inputs & badges' },
    ],
  };

  return (
    <div className="flex flex-col gap-7 w-full">
      {/* View Switcher: Fluid Input Studio vs Living Design Tokens */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <CapsuleSegment
          options={[
            { value: 'fluid-studio', label: 'ZeroLight • Fluid Input Atoms Studio' },
            { value: 'tokens', label: 'Living Design System & Primitives' },
          ]}
          value={studioSection}
          onChange={(val) => setStudioSection(val as 'fluid-studio' | 'tokens')}
          layoutId="design-system-segment"
        />
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-content-muted font-medium">
            {studioSection === 'fluid-studio' ? 'Dynamic Spring Kinetics & Realtime Studio' : 'Enterprise Design Tokens'}
          </span>
        </div>
      </div>

      {studioSection === 'fluid-studio' ? (
        <FluidInputAtomsStudio />
      ) : (
        <>
          {/* Overview Banner */}
          <Card padding="lg" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                  Living Design System
                </span>
              </div>
              <h1 className="text-2xl font-bold text-content-main tracking-tight">
                Black Dot Design Tokens & Primitives
              </h1>
              <p className="text-sm text-content-muted mt-1 max-w-2xl">
                A precise, tactile design language engineered for telemetry operations. Follows strict 60-30-10 color balance, Apple HIG micro-interactions, single-source-of-truth design tokens, and atomic primitives.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => copyToClipboard(':root { --bg-canvas: #F4F5F8; --brand-base: #00a7bc; --brand-solid-fill: #00545e; --brand-accessible-text: #007584; --radius-card: 20px; --radius-pill: 9999px; }', 'CSS')}
                icon={<Copy className="w-3.5 h-3.5" />}
              >
                {copiedToken === 'CSS' ? 'Copied Tokens!' : 'Copy :root CSS'}
              </Button>
            </div>
          </Card>

      {/* SECTION 1: COLOR PALETTE */}
      <Card padding="lg">
        <div className="flex items-center gap-2.5 mb-5">
          <Palette className="w-4 h-4 text-brand-accent stroke-[2.4]" />
          <h2 className="text-base font-bold text-content-main">60-30-10 Color Architecture</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 60% Canvas */}
          <Card variant="cluster" radius="cluster" padding="sm" className="flex flex-col gap-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-content-muted">
              60% Canvas & Neutral
            </div>
            {tokens.canvas.map((c) => (
              <div
                key={c.name}
                onClick={() => copyToClipboard(c.val, c.name)}
                className="flex items-center justify-between p-2 rounded-full hover:bg-white cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-border-subtle"
                    style={{ backgroundColor: c.val }}
                  />
                  <span className="text-xs font-semibold">{c.name}</span>
                </div>
                <span className="text-[11px] text-content-tertiary">{c.val}</span>
              </div>
            ))}
          </Card>

          {/* 30% Text & Contrast */}
          <Card variant="cluster" radius="cluster" padding="sm" className="flex flex-col gap-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-content-muted">
              30% High Contrast
            </div>
            {tokens.text.map((t) => (
              <div
                key={t.name}
                onClick={() => copyToClipboard(t.val, t.name)}
                className="flex items-center justify-between p-2 rounded-full hover:bg-white cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-border-subtle"
                    style={{ backgroundColor: t.val }}
                  />
                  <span className="text-xs font-semibold">{t.name}</span>
                </div>
                <span className="text-[11px] text-content-tertiary">{t.val}</span>
              </div>
            ))}
          </Card>

          {/* 10% Brand Ocean */}
          <Card variant="cluster" radius="cluster" padding="sm" className="flex flex-col gap-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-brand-accent">
              10% Brand Ocean
            </div>
            {tokens.brand.map((b) => (
              <div
                key={b.name}
                onClick={() => copyToClipboard(b.val, b.name)}
                className="flex items-center justify-between p-2 rounded-full hover:bg-white cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-border-subtle"
                    style={{ backgroundColor: b.val }}
                  />
                  <span className="text-xs font-semibold">{b.name}</span>
                </div>
                <span className="text-[11px] text-content-tertiary">{b.val}</span>
              </div>
            ))}
          </Card>

          {/* Functional Status */}
          <Card variant="cluster" radius="cluster" padding="sm" className="flex flex-col gap-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-content-muted">
              Status Feedback
            </div>
            {tokens.status.map((s) => (
              <div
                key={s.name}
                onClick={() => copyToClipboard(s.val, s.name)}
                className="flex items-center justify-between p-2 rounded-full hover:bg-white cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: s.val }}
                  />
                  <span className="text-xs font-semibold">{s.label}</span>
                </div>
                <span className="text-[11px] text-content-tertiary">{s.val}</span>
              </div>
            ))}
          </Card>
        </div>
      </Card>

      {/* SECTION 2: BORDER RADII TOKENS */}
      <Card padding="lg">
        <div className="flex items-center gap-2.5 mb-5">
          <Box className="w-4 h-4 text-brand-accent stroke-[2.4]" />
          <h2 className="text-base font-bold text-content-main">
            Corner Geometry & Radius Hierarchy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tokens.radii.map((r) => (
            <Card
              key={r.name}
              variant="cluster"
              radius="cluster"
              padding="sm"
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-content-main">{r.name}</span>
                  <Badge variant="brand" size="sm">
                    {r.val}
                  </Badge>
                </div>
                <p className="text-[11px] text-content-muted">{r.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* SECTION 3: ATOMIC COMPONENT PRIMITIVES */}
      <Card padding="lg">
        <div className="flex items-center gap-2.5 mb-5">
          <Layers className="w-4 h-4 text-brand-accent stroke-[2.4]" />
          <h2 className="text-base font-bold text-content-main">
            Atomic Primitives Showcase (CVA & Radix)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Buttons */}
          <Card variant="cluster" radius="cluster" padding="sm" className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
              1. Buttons (Variants & Sizes)
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="brand" size="sm">
                Primary SM
              </Button>
              <Button variant="brand" size="md">
                Primary MD
              </Button>
              <Button variant="secondary" size="md">
                Secondary
              </Button>
              <Button variant="ghost" size="md">
                Ghost
              </Button>
            </div>
          </Card>

          {/* 2. Badges */}
          <Card variant="cluster" radius="cluster" padding="sm" className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
              2. Badges (Status Variants)
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">Normal</Badge>
              <Badge variant="warning">Attention</Badge>
              <Badge variant="error" pulse>Critical</Badge>
              <Badge variant="brand">Brand</Badge>
              <Badge variant="neutral">Neutral</Badge>
            </div>
          </Card>

          {/* 3. Unified Input */}
          <Card variant="cluster" radius="cluster" padding="sm" className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
              3. Input Primitive (with Unit)
            </span>
            <Input
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              unit="mg/L"
              placeholder="Enter telemetry..."
            />
          </Card>

          {/* 4. Capsule Segmented Control */}
          <Card variant="cluster" radius="cluster" padding="sm" className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
              4. Capsule Segmented Control
            </span>
            <CapsuleSegment
              options={[
                { label: 'Seed', value: 'Seed' },
                { label: 'Grow', value: 'Grow-out' },
                { label: 'Harvest', value: 'Harvest' },
              ]}
              value={demoPhase}
              onChange={(v) => setDemoPhase(v as any)}
            />
          </Card>

          {/* 5. DatePicker Popover */}
          <Card variant="cluster" radius="cluster" padding="sm" className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
              5. DatePicker Popover
            </span>
            <DatePickerPopover value={demoDate} onChange={setDemoDate} />
          </Card>

          {/* 6. Tag Input */}
          <Card variant="cluster" radius="cluster" padding="sm" className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
              6. Multi-Chip Tag Deck
            </span>
            <TagInput tags={demoTags} onChange={setDemoTags} />
          </Card>
        </div>
      </Card>

      {/* SECTION 4: ENTERPRISE SAAS CARDS & WORKFLOW SUITE */}
      <Card padding="lg">
        <div className="flex items-center gap-2.5 mb-5">
          <LayoutGrid className="w-4 h-4 text-brand-accent stroke-[2.4]" />
          <h2 className="text-base font-bold text-content-main">
            Enterprise SaaS Card Primitives
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          {/* Enterprise Metric Cards (100% Lucide Icons, 0 Sparklines) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              title="D.O. Saturation Index"
              value="6.5 mg/L"
              delta="+4.2%"
              isPositive={true}
              subtext="Optimal post-larval window"
              icon={<Droplets className="w-4 h-4 text-[#00a7bc] stroke-[2.2]" />}
            />
            <MetricCard
              title="Nitrite Threshold Loss"
              value="0.03 mg/L"
              delta="-12.5%"
              isPositive={true}
              subtext="Toxicity risk: Safe"
              icon={<Activity className="w-4 h-4 text-[#10b981] stroke-[2.2]" />}
            />
            <MetricCard
              title="Standing Biomass Target"
              value="8,400 kg"
              delta="+320 kg"
              isPositive={true}
              subtext="Harvest projected in 12 days"
              icon={<Scale className="w-4 h-4 text-[#0284c7] stroke-[2.2]" />}
            />
          </div>

          {/* SaaS Composite Health & Resource Meter Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <RadialProgressCard score={94} grade="Grade A+ / Certified" />
            <UsageMeterCard planName="Black Dot Enterprise Node Cluster" />
          </div>

          {/* Interactive Automation Rules Toggle Card */}
          <QuickActionCard />
        </div>
      </Card>
        </>
      )}
    </div>
  );
};
