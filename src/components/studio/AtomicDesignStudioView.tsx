import React, { useState } from 'react';
import {
  Atom,
  FlaskConical,
  Dna,
  FileCode2,
  Sliders,
  Copy,
  Mail,
  Lock,
  Search,
  Check,
  Building,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import {
  Input,
  SearchSelect,
  TagSelect,
  Button,
  FormField,
  VisualStudioDock,
  SaaSPocCard,
  ZeroLightSettings,
  DEFAULT_ZEROLIGHT_SETTINGS,
  SPRING_PRESETS,
} from '../zerolight';
import { CapsuleSegment } from '../ui/CapsuleSegment';

const STAGE_OPTIONS = [
  { value: 'all', label: 'All Atomic Stages' },
  { value: 'atoms', label: '⚛️ 1. Atoms' },
  { value: 'molecules', label: '🧪 2. Molecules' },
  { value: 'organisms', label: '🧬 3. Organisms' },
  { value: 'templates', label: '📄 4. Templates & PoC' },
];

const REGION_OPTIONS = [
  'North America (us-east-1)',
  'Europe (eu-central-1)',
  'Asia Pacific (ap-south-1)',
  'South East (ap-southeast-1)',
];

const PERMISSION_OPTIONS = [
  'View Invoices',
  'Manage Approvals',
  'Execute Settlement',
  'Administrator Access',
];

export const AtomicDesignStudioView: React.FC = () => {
  const [settings, setSettings] = useState<ZeroLightSettings>(DEFAULT_ZEROLIGHT_SETTINGS);
  const [activeStage, setActiveStage] = useState<'all' | 'atoms' | 'molecules' | 'organisms' | 'templates'>('all');

  // Interactive Atom state
  const [standardVal, setStandardVal] = useState('INV-2026-US-8921');
  const [emailVal, setEmailVal] = useState('dev@zerorapid.com');
  const [searchVal, setSearchVal] = useState('North America (us-east-1)');
  const [tagsVal, setTagsVal] = useState<string[]>(['View Invoices', 'Manage Approvals']);
  const [isErrorMode, setIsErrorMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTab, setExportTab] = useState<'css' | 'tailwind' | 'cli'>('css');

  const preset = SPRING_PRESETS[settings.spring];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCssVariables = () => `:root {
  --fluid-border-color: ${settings.borderColor};
  --fluid-fill-color: ${settings.fillColor};
  --fluid-text-color: ${settings.textColor};
  --fluid-backplate: ${settings.backplateColor};
  --fluid-border-width: ${settings.borderWidth}px;
  --fluid-radius: ${settings.radius}px;
  --fluid-height: ${settings.height}px;
  --fluid-font-size: ${settings.fontSize}px;
  --fluid-menu-gap: ${settings.gap}px;
  --fluid-spring: ${SPRING_PRESETS[settings.spring].cubic};
}`;

  const getTailwindConfig = () => `// tailwind.config.js - ZeroLight Extension
export default {
  theme: {
    extend: {
      borderRadius: {
        'fluid-outer': '${settings.radius}px',
        'fluid-inner': '${Math.max(0, Math.round(settings.radius * 0.65))}px',
        'fluid-tag': '${settings.radius >= 20 ? '9999px' : `${Math.max(0, Math.round(settings.radius * 0.75))}px`}',
      },
      colors: {
        'fluid-border': '${settings.borderColor}',
        'fluid-fill': '${settings.fillColor}',
        'fluid-text': '${settings.textColor}',
        'fluid-backplate': '${settings.backplateColor}',
      },
    },
  },
};`;

  const getCliCommand = () => `# Initialize ZeroLight in your office project:
npx zerolight init

# Add specific atomic components:
npx zerolight add input
npx zerolight add select
npx zerolight add tag-select
npx zerolight add button
npx zerolight add form-field
npx zerolight add poc-card`;

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-16 selection:bg-neutral-900 selection:text-white">
      {/* 1. Header Hero Card */}
      <div className="p-7 bg-white rounded-[28px] border border-neutral-300 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              ZeroLight Atomic Design Studio
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
              Brad Frost UI/UX Model
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Atomic Model Architecture
          </h1>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Every SaaS interface in your office is composed systematically: foundational <strong>Atoms</strong> bond into <strong>Molecules</strong>, combine into <strong>Organisms</strong>, and assemble into <strong>Templates & PoC Pages</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowExportModal(true)}
            className="h-10 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-full tactile-press transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Export Tokens & CLI</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Stage Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <CapsuleSegment
          options={STAGE_OPTIONS}
          value={activeStage}
          onChange={(val) => setActiveStage(val as any)}
          layoutId="atomic-stage-segment"
        />

        <div className="flex items-center gap-3 text-xs text-neutral-600 bg-white px-3.5 py-1.5 rounded-full border border-neutral-200 shadow-2xs">
          <span>Active Physics:</span>
          <span className="font-semibold text-neutral-900">{preset.name}</span>
          <span className="text-neutral-300">|</span>
          <span>Density:</span>
          <span className="font-semibold text-neutral-900">{settings.height}px</span>
          <span className="text-neutral-300">|</span>
          <span>Radius:</span>
          <span className="font-semibold text-neutral-900">{settings.radius}px</span>
        </div>
      </div>

      {/* Layout Grid: Content Showcase on Left (or Full), Calibration Dock on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Atomic Stages */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* ==================================================== */}
          {/* STAGE 1: ATOMS */}
          {/* ==================================================== */}
          {(activeStage === 'all' || activeStage === 'atoms') && (
            <div className="p-7 bg-white rounded-[28px] border border-neutral-300 shadow-subtle space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Atom className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-neutral-900">
                      1. Atoms (Foundational Units)
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Indivisible UI primitives with tactile physics and token scaling
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-neutral-400">@/components/zerolight/atoms</span>
              </div>

              {/* Atom 1: Standard Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline px-1">
                  <span className="text-xs font-semibold text-neutral-800">
                    &lt;Input /&gt; — Tactile Text Input
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono">Input.tsx</span>
                </div>
                <Input
                  value={standardVal}
                  onChange={setStandardVal}
                  placeholder="Enter reference or code..."
                  startIcon={<Building className="w-4 h-4" />}
                  settings={settings}
                />
              </div>

              {/* Atom 2: SearchSelect */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline px-1">
                  <span className="text-xs font-semibold text-neutral-800">
                    &lt;SearchSelect /&gt; — Fluid Popover Select
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono">SearchSelect.tsx</span>
                </div>
                <SearchSelect
                  options={REGION_OPTIONS}
                  value={searchVal}
                  onChange={setSearchVal}
                  placeholder="Select cloud region..."
                  settings={settings}
                />
              </div>

              {/* Atom 3: TagSelect */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline px-1">
                  <span className="text-xs font-semibold text-neutral-800">
                    &lt;TagSelect /&gt; — Dynamic Tag Deck
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono">TagSelect.tsx</span>
                </div>
                <TagSelect
                  options={PERMISSION_OPTIONS}
                  selected={tagsVal}
                  onChange={setTagsVal}
                  placeholder="Assign permissions..."
                  settings={settings}
                />
              </div>

              {/* Atom 4: Kinetic Button Variants */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-baseline px-1">
                  <span className="text-xs font-semibold text-neutral-800">
                    &lt;Button /&gt; — Kinetic Action Buttons
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono">Button.tsx</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <Button variant="primary" settings={settings}>
                    Primary
                  </Button>
                  <Button variant="secondary" settings={settings}>
                    Secondary
                  </Button>
                  <Button variant="ghost" settings={settings}>
                    Ghost
                  </Button>
                  <Button variant="danger" settings={settings}>
                    Danger
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STAGE 2: MOLECULES */}
          {/* ==================================================== */}
          {(activeStage === 'all' || activeStage === 'molecules') && (
            <div className="p-7 bg-white rounded-[28px] border border-neutral-300 shadow-subtle space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                    <FlaskConical className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-neutral-900">
                      2. Molecules (Atomic Combinations)
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Simple combinations of atoms bonded together as a functional unit
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsErrorMode(!isErrorMode)}
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                    isErrorMode ? 'bg-rose-100 text-rose-800' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {isErrorMode ? 'Disable Error State' : 'Simulate Error State'}
                </button>
              </div>

              {/* Molecule: FormField */}
              <FormField
                label="Corporate Email Address"
                badge="Required"
                error={isErrorMode ? 'Please provide a valid company email domain' : undefined}
                helperText="We will send your verification and API access tokens here."
              >
                <Input
                  value={emailVal}
                  onChange={setEmailVal}
                  placeholder="name@company.com"
                  startIcon={<Mail className="w-4 h-4" />}
                  isError={isErrorMode}
                  settings={settings}
                />
              </FormField>

              {/* Molecule: FormField with SearchSelect */}
              <FormField
                label="Primary Hosting Cluster"
                badge="Fluid Popover"
                error={isErrorMode ? 'Cluster region unavailable in this tier' : undefined}
              >
                <SearchSelect
                  options={REGION_OPTIONS}
                  value={searchVal}
                  onChange={setSearchVal}
                  isError={isErrorMode}
                  settings={settings}
                />
              </FormField>
            </div>
          )}

          {/* ==================================================== */}
          {/* STAGE 3 & 4: ORGANISMS & TEMPLATES */}
          {/* ==================================================== */}
          {(activeStage === 'all' || activeStage === 'organisms' || activeStage === 'templates') && (
            <div className="space-y-6">
              <div className="p-7 bg-white rounded-[28px] border border-neutral-300 shadow-subtle space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Dna className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-neutral-900">
                      3. Organisms & 4. Templates (SaaS PoC)
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Molecules bonded into distinct organisms and full SaaS workflow templates
                    </p>
                  </div>
                </div>
              </div>

              {/* Complete SaaS PoC Card Template */}
              <SaaSPocCard settings={settings} />
            </div>
          )}
        </div>

        {/* Right Column: Visual Studio Dock (Sticky on Desktop) */}
        <div className="lg:col-span-5 sticky top-4">
          <VisualStudioDock
            settings={settings}
            onChange={setSettings}
            onReset={() => setSettings(DEFAULT_ZEROLIGHT_SETTINGS)}
            onExport={() => setShowExportModal(true)}
          />
        </div>
      </div>

      {/* Export Tokens Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] border border-neutral-300 max-w-lg w-full p-6 shadow-floating space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Export ZeroLight Tokens & CLI
                </h3>
                <p className="text-xs text-neutral-500">
                  Instantly hand off calibrated tokens to developers or AI
                </p>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex bg-neutral-100 p-1 rounded-full text-xs font-semibold">
              <button
                onClick={() => setExportTab('css')}
                className={`flex-1 py-1 rounded-full transition-all cursor-pointer ${
                  exportTab === 'css' ? 'bg-white shadow-xs text-neutral-900' : 'text-neutral-500'
                }`}
              >
                CSS Variables
              </button>
              <button
                onClick={() => setExportTab('tailwind')}
                className={`flex-1 py-1 rounded-full transition-all cursor-pointer ${
                  exportTab === 'tailwind' ? 'bg-white shadow-xs text-neutral-900' : 'text-neutral-500'
                }`}
              >
                Tailwind Config
              </button>
              <button
                onClick={() => setExportTab('cli')}
                className={`flex-1 py-1 rounded-full transition-all cursor-pointer ${
                  exportTab === 'cli' ? 'bg-white shadow-xs text-neutral-900' : 'text-neutral-500'
                }`}
              >
                CLI Commands
              </button>
            </div>

            <div className="relative">
              <pre className="p-4 bg-neutral-900 text-neutral-100 text-xs rounded-2xl overflow-x-auto max-h-56">
                <code>
                  {exportTab === 'css' && getCssVariables()}
                  {exportTab === 'tailwind' && getTailwindConfig()}
                  {exportTab === 'cli' && getCliCommand()}
                </code>
              </pre>

              <button
                onClick={() => {
                  const text =
                    exportTab === 'css'
                      ? getCssVariables()
                      : exportTab === 'tailwind'
                      ? getTailwindConfig()
                      : getCliCommand();
                  handleCopy(text);
                }}
                className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-xs transition-colors cursor-pointer"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-full cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
