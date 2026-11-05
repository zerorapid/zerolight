import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import {
  Input,
  SearchSelect,
  TagSelect,
  VisualStudioDock,
  SaaSPocCard,
  ZeroLightSettings,
  DEFAULT_ZEROLIGHT_SETTINGS,
  SPRING_PRESETS,
} from '../zerolight';

// Re-export types and constants for full backward compatibility
export type FluidStudioSettings = ZeroLightSettings;
export const DEFAULT_FLUID_SETTINGS = DEFAULT_ZEROLIGHT_SETTINGS;
export { SPRING_PRESETS };

export const REGION_OPTIONS = [
  'North America (us-east-1)',
  'Europe (eu-central-1)',
  'Asia Pacific (ap-south-1)',
  'South East (ap-southeast-1)',
];

export const PERMISSION_OPTIONS = [
  'View Invoices',
  'Manage Approvals',
  'Execute Settlement',
  'Administrator Access',
];

// Re-export modular atoms with legacy names
export const FluidStandardInput = Input;
export const FluidSearchableSelect = SearchSelect;
export const FluidMultiSelect = TagSelect;
export const FluidVisualStudioDock = VisualStudioDock;
export const SaaSPocForm = SaaSPocCard;

/**
 * ZeroLight Studio View
 * Interactive playground for designers and developers to test atoms and assemble SaaS PoCs.
 */
export const FluidInputAtomsStudio: React.FC = () => {
  const [settings, setSettings] = useState<ZeroLightSettings>(DEFAULT_ZEROLIGHT_SETTINGS);
  const [viewMode, setViewMode] = useState<'atoms' | 'poc'>('atoms');
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['View Invoices']);
  const [copied, setCopied] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTab, setExportTab] = useState<'css' | 'tailwind' | 'cli'>('css');

  const handleReset = () => {
    setSettings(DEFAULT_ZEROLIGHT_SETTINGS);
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

  const getCliCommand = () => `# 1. Initialize ZeroLight in your new SaaS PoC:
npx zerolight init

# 2. Add components into your project:
npx zerolight add input
npx zerolight add select
npx zerolight add multi-select
npx zerolight add poc-form`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 sm:p-8 selection:bg-neutral-900 selection:text-white">
      <div className="w-full max-w-[440px] space-y-6">
        {/* Studio Branding & Live Indicator */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-sm font-bold tracking-tight text-neutral-900">
              ZeroLight • SaaS Design System Studio
            </h1>
          </div>
          <button
            onClick={() => setShowExportModal(true)}
            className="text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 px-3 py-1 rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Copy className="w-3 h-3" />
            <span>Export Tokens</span>
          </button>
        </div>

        {/* View Mode Switcher: Atoms vs SaaS PoC Form */}
        <div className="flex bg-neutral-200/80 p-1 rounded-full text-xs font-semibold text-neutral-600">
          <button
            type="button"
            onClick={() => setViewMode('atoms')}
            className={`flex-1 py-1.5 rounded-full transition-all cursor-pointer ${
              viewMode === 'atoms' ? 'bg-white text-neutral-900 shadow-xs' : 'hover:text-neutral-900'
            }`}
          >
            1. Atomic Inputs
          </button>
          <button
            type="button"
            onClick={() => setViewMode('poc')}
            className={`flex-1 py-1.5 rounded-full transition-all cursor-pointer ${
              viewMode === 'poc' ? 'bg-white text-neutral-900 shadow-xs' : 'hover:text-neutral-900'
            }`}
          >
            2. SaaS PoC Form Preview
          </button>
        </div>

        {/* Dynamic Display: Atoms Showcase or SaaS PoC Form */}
        {viewMode === 'atoms' ? (
          <div className="p-7 bg-white rounded-[28px] border border-neutral-300 shadow-subtle space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-baseline px-1">
                <span className="text-xs font-semibold text-neutral-800">1. Standard Input</span>
                <span className="text-[11px] text-neutral-500 font-medium">Single-line</span>
              </div>
              <Input
                value={inputValue}
                onChange={setInputValue}
                placeholder="Search invoice or reference..."
                settings={settings}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline px-1">
                <span className="text-xs font-semibold text-neutral-800">2. Searchable Select</span>
                <span className="text-[11px] text-neutral-500 font-medium">Fluid Popover</span>
              </div>
              <SearchSelect
                options={REGION_OPTIONS}
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Select cluster region..."
                settings={settings}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline px-1">
                <span className="text-xs font-semibold text-neutral-800">3. Multi-Select Tags</span>
                <span className="text-[11px] text-neutral-500 font-medium">Dynamic Corner Tags</span>
              </div>
              <TagSelect
                options={PERMISSION_OPTIONS}
                selected={selectedTags}
                onChange={setSelectedTags}
                placeholder="Assign permissions..."
                settings={settings}
              />
            </div>
          </div>
        ) : (
          <SaaSPocCard settings={settings} />
        )}

        {/* Visual Studio Dock */}
        <VisualStudioDock
          settings={settings}
          onChange={setSettings}
          onReset={handleReset}
          onExport={() => setShowExportModal(true)}
        />
      </div>

      {/* Export Tokens Modal for Designers & Developers */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] border border-neutral-300 max-w-lg w-full p-6 shadow-floating space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Export ZeroLight Tokens & CLI
                </h3>
                <p className="text-xs text-neutral-500">
                  Handoff between designers and developers for new SaaS PoCs
                </p>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
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
                npx CLI
              </button>
            </div>

            {/* Tab Content */}
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
