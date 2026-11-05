import React, { useState, useRef, useEffect, useId } from 'react';
import { Check, ChevronDown, X, RotateCcw, Copy, Sparkles, Layers, Sliders, CheckSquare, Search } from 'lucide-react';

// ==========================================
// 1. STUDIO SETTINGS & PRESETS TYPES
// ==========================================

export interface FluidStudioSettings {
  borderColor: string;
  fillColor: string;
  textColor: string;
  backplateColor: string;
  borderWidth: number; // 0 - 5
  radius: number; // 0 - 24
  height: number; // 40 - 52
  fontSize: number; // 13 - 16
  gap: number; // 4 - 14
  spring: '1' | '2' | '3';
}

export const DEFAULT_FLUID_SETTINGS: FluidStudioSettings = {
  borderColor: '#d4d4d4',
  fillColor: '#ffffff',
  textColor: '#111111',
  backplateColor: '#f0f0f0',
  borderWidth: 1,
  radius: 16,
  height: 48,
  fontSize: 14,
  gap: 8,
  spring: '2',
};

export const SPRING_PRESETS = {
  '1': { name: 'Subtle Linear', cubic: 'cubic-bezier(0, 0, 0.2, 1)' },
  '2': { name: 'Apple Damped', cubic: 'cubic-bezier(0.175, 0.885, 0.32, 1.25)' },
  '3': { name: 'Elastic Spring', cubic: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
};

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

// ==========================================
// 2. ATOMIC COMPONENT: FLUID STANDARD INPUT
// ==========================================

interface FluidStandardInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  settings: FluidStudioSettings;
}

export const FluidStandardInput: React.FC<FluidStandardInputProps> = ({
  value,
  onChange,
  placeholder = 'Search invoice or reference...',
  settings,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const outerRadius = `${settings.radius}px`;

  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between items-baseline px-1">
        <label className="text-xs font-semibold text-neutral-800">
          1. Standard Input
        </label>
        <span className="text-[11px] text-neutral-500 font-medium">Single-line</span>
      </div>

      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          style={{
            backgroundColor: settings.fillColor,
            borderColor: settings.borderColor,
            borderWidth: `${settings.borderWidth}px`,
            color: settings.textColor,
            borderRadius: outerRadius,
            height: `${settings.height}px`,
            fontSize: `${settings.fontSize}px`,
          }}
          className="tactile-press w-full px-4 pr-10 text-sm font-medium outline-none transition-all placeholder:text-neutral-400 placeholder:font-normal focus:ring-1 focus:ring-neutral-900"
        />

        {value.length > 0 && (
          <button
            type="button"
            aria-label="Clear field"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 w-5 h-5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center text-xs transition-transform active:scale-90 cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 3. ATOMIC COMPONENT: FLUID SEARCHABLE SELECT
// ==========================================

interface FluidSearchableSelectProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  settings: FluidStudioSettings;
}

export const FluidSearchableSelect: React.FC<FluidSearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select cluster region...',
  settings,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [hoverStyle, setHoverStyle] = useState({ top: 0, height: 40, opacity: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const filterInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const outerRadius = `${settings.radius}px`;
  const innerRadius = `${Math.max(0, Math.round(settings.radius * 0.65))}px`;
  const preset = SPRING_PRESETS[settings.spring];

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Autofocus search filter input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => filterInputRef.current?.focus(), 60);
    } else {
      setFilterQuery('');
      setHoverStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [isOpen]);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(filterQuery.toLowerCase().trim())
  );

  return (
    <div className="space-y-2 w-full" ref={containerRef}>
      <div className="flex justify-between items-baseline px-1">
        <label className="text-xs font-semibold text-neutral-800">
          2. Searchable Select
        </label>
        <span className="text-[11px] text-neutral-500 font-medium">Fluid Popover</span>
      </div>

      <div className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            backgroundColor: settings.fillColor,
            borderColor: settings.borderColor,
            borderWidth: `${settings.borderWidth}px`,
            color: settings.textColor,
            borderRadius: outerRadius,
            height: `${settings.height}px`,
            fontSize: `${settings.fontSize}px`,
          }}
          className="tactile-press w-full px-4 flex items-center justify-between text-sm font-medium outline-none select-none focus:ring-1 focus:ring-neutral-900 cursor-pointer"
        >
          <span className="truncate text-neutral-800">
            {value || <span className="text-neutral-400 font-normal">{placeholder}</span>}
          </span>
          <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center ml-2 shrink-0">
            <ChevronDown
              className={`w-3.5 h-3.5 text-neutral-600 transition-transform duration-200 stroke-[2.5] ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {/* Floating Spring Menu */}
        <div
          style={{
            backgroundColor: settings.fillColor,
            borderColor: settings.borderColor,
            borderWidth: `${settings.borderWidth}px`,
            borderRadius: outerRadius,
            marginTop: `${settings.gap}px`,
            transition: isOpen
              ? `opacity 220ms ${preset.cubic}, transform 280ms ${preset.cubic}`
              : 'opacity 140ms cubic-bezier(0.4, 0, 1, 1), transform 140ms cubic-bezier(0.4, 0, 1, 1)',
          }}
          className={`menu-transition ${
            isOpen ? 'menu-visible' : 'menu-hidden'
          } absolute left-0 right-0 p-2 z-50 flex flex-col gap-1 shadow-floating focus:outline-none`}
        >
          {/* Internal Search Filter Input */}
          <div className="px-1 pt-1 pb-1 relative z-10">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 pointer-events-none" />
              <input
                ref={filterInputRef}
                type="text"
                placeholder="Type to filter..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                autoComplete="off"
                style={{
                  borderColor: settings.borderColor,
                  borderWidth: settings.borderWidth === 0 ? '1px' : `${settings.borderWidth}px`,
                  color: settings.textColor,
                  borderRadius: innerRadius,
                }}
                className="w-full h-9 pl-8 pr-3 text-xs font-medium bg-neutral-100 placeholder:text-neutral-400 outline-none border transition-colors"
              />
            </div>
          </div>

          {/* Staggered Options List */}
          <ul
            ref={listRef}
            role="listbox"
            onMouseLeave={() => setHoverStyle((prev) => ({ ...prev, opacity: 0 }))}
            className="relative space-y-0.5 pt-0.5 max-h-56 overflow-y-auto no-scrollbar"
          >
            {/* Smooth Sliding Hover Indicator Backplate */}
            <div
              className="sliding-hover-indicator"
              style={{
                backgroundColor: settings.backplateColor,
                borderRadius: innerRadius,
                transform: `translateY(${hoverStyle.top}px)`,
                height: `${hoverStyle.height}px`,
                opacity: hoverStyle.opacity,
              }}
            />

            {filteredOptions.length === 0 ? (
              <li className="py-4 text-xs text-center text-neutral-400">
                No matching regions
              </li>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = opt === value;
                return (
                  <li
                    key={opt}
                    role="option"
                    aria-selected={isSelected}
                    data-value={opt}
                    onMouseEnter={(e) => {
                      const target = e.currentTarget;
                      setHoverStyle({
                        top: target.offsetTop,
                        height: target.offsetHeight,
                        opacity: 1,
                      });
                    }}
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                    }}
                    style={{
                      borderRadius: innerRadius,
                      fontSize: `${settings.fontSize}px`,
                      transitionDelay: isOpen ? `${20 + idx * 25}ms` : '0ms',
                    }}
                    className={`stagger-item h-10 px-3.5 text-sm font-medium cursor-pointer flex items-center justify-between transition-colors select-none ${
                      isSelected ? 'checked text-neutral-900 font-semibold' : 'text-neutral-700'
                    }`}
                  >
                    <span>{opt}</span>
                    <svg
                      className="w-4 h-4 text-neutral-900 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        className="check-path"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. ATOMIC COMPONENT: FLUID MULTI-SELECT TAGS
// ==========================================

interface FluidMultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
  settings: FluidStudioSettings;
}

export const FluidMultiSelect: React.FC<FluidMultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = 'Assign permissions...',
  settings,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverStyle, setHoverStyle] = useState({ top: 0, height: 40, opacity: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const outerRadius = `${settings.radius}px`;
  const innerRadius = `${Math.max(0, Math.round(settings.radius * 0.65))}px`;
  const tagRadius =
    settings.radius >= 20 ? '9999px' : `${Math.max(0, Math.round(settings.radius * 0.75))}px`;
  const preset = SPRING_PRESETS[settings.spring];

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleOption = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((item) => item !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  const removeFirstTag = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selected.length > 0) {
      onChange(selected.slice(1));
    }
  };

  const count = selected.length;
  const firstTag = count > 0 ? selected[0] : null;

  return (
    <div className="space-y-2 w-full" ref={containerRef}>
      <div className="flex justify-between items-baseline px-1">
        <label className="text-xs font-semibold text-neutral-800">
          3. Multi-Select Tags
        </label>
        <span className="text-[11px] text-neutral-500 font-medium">Dynamic Corner Tags</span>
      </div>

      <div className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            backgroundColor: settings.fillColor,
            borderColor: settings.borderColor,
            borderWidth: `${settings.borderWidth}px`,
            color: settings.textColor,
            borderRadius: outerRadius,
            height: `${settings.height}px`,
            fontSize: `${settings.fontSize}px`,
          }}
          className="tactile-press w-full px-4 flex items-center justify-between text-sm font-medium outline-none select-none overflow-hidden focus:ring-1 focus:ring-neutral-900 cursor-pointer"
        >
          <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2 overflow-hidden">
            {count === 0 && (
              <span className="text-neutral-400 font-normal truncate">
                {placeholder}
              </span>
            )}

            {firstTag && (
              <span
                style={{ borderRadius: tagRadius }}
                className="multi-tag-chip shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium bg-neutral-900 text-white truncate max-w-[170px] chip-animate transition-all"
              >
                <span className="truncate">{firstTag}</span>
                <span
                  onClick={removeFirstTag}
                  className="btn-remove-tag text-neutral-400 hover:text-white cursor-pointer text-xs font-bold leading-none"
                >
                  ×
                </span>
              </span>
            )}

            {count > 1 && (
              <span
                style={{ borderRadius: tagRadius }}
                className="multi-tag-chip shrink-0 px-2 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-300 chip-animate transition-all"
              >
                +{count - 1} more
              </span>
            )}
          </div>

          <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center ml-1 shrink-0">
            <ChevronDown
              className={`w-3.5 h-3.5 text-neutral-600 transition-transform duration-200 stroke-[2.5] ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {/* Floating Multi Menu */}
        <ul
          role="listbox"
          aria-multiselectable="true"
          onMouseLeave={() => setHoverStyle((prev) => ({ ...prev, opacity: 0 }))}
          style={{
            backgroundColor: settings.fillColor,
            borderColor: settings.borderColor,
            borderWidth: `${settings.borderWidth}px`,
            borderRadius: outerRadius,
            marginTop: `${settings.gap}px`,
            transition: isOpen
              ? `opacity 220ms ${preset.cubic}, transform 280ms ${preset.cubic}`
              : 'opacity 140ms cubic-bezier(0.4, 0, 1, 1), transform 140ms cubic-bezier(0.4, 0, 1, 1)',
          }}
          className={`menu-transition ${
            isOpen ? 'menu-visible' : 'menu-hidden'
          } absolute left-0 right-0 p-2 z-50 flex flex-col gap-1 shadow-floating focus:outline-none max-h-60 overflow-y-auto no-scrollbar`}
        >
          {/* Smooth Sliding Hover Indicator Backplate */}
          <div
            className="sliding-hover-indicator"
            style={{
              backgroundColor: settings.backplateColor,
              borderRadius: innerRadius,
              transform: `translateY(${hoverStyle.top}px)`,
              height: `${hoverStyle.height}px`,
              opacity: hoverStyle.opacity,
            }}
          />

          {options.map((opt, idx) => {
            const isSelected = selected.includes(opt);
            const checkboxRadius = `${Math.min(6, Math.max(0, Math.round(settings.radius * 0.25)))}px`;
            return (
              <li
                key={opt}
                role="option"
                aria-selected={isSelected}
                data-value={opt}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  setHoverStyle({
                    top: target.offsetTop,
                    height: target.offsetHeight,
                    opacity: 1,
                  });
                }}
                onClick={() => toggleOption(opt)}
                style={{
                  borderRadius: innerRadius,
                  fontSize: `${settings.fontSize}px`,
                  transitionDelay: isOpen ? `${20 + idx * 25}ms` : '0ms',
                }}
                className={`stagger-item h-10 px-3.5 text-sm font-medium cursor-pointer flex items-center justify-between transition-colors select-none ${
                  isSelected ? 'checked text-neutral-900 font-semibold' : 'text-neutral-700'
                }`}
              >
                <span>{opt}</span>
                <div
                  style={{
                    borderRadius: checkboxRadius,
                    borderColor: isSelected ? '#111111' : settings.borderColor,
                    backgroundColor: isSelected ? '#111111' : 'transparent',
                    borderWidth: settings.borderWidth === 0 ? '1px' : `${settings.borderWidth}px`,
                  }}
                  className="w-4 h-4 border flex items-center justify-center transition-all shrink-0"
                >
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      className="check-path"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

// ==========================================
// 5. VISUAL STUDIO DOCK (CONTROLS PANEL)
// ==========================================

interface FluidVisualStudioDockProps {
  settings: FluidStudioSettings;
  onChange: React.Dispatch<React.SetStateAction<FluidStudioSettings>>;
  onReset: () => void;
  onCopyCss: () => void;
  isCopied: boolean;
}

export const FluidVisualStudioDock: React.FC<FluidVisualStudioDockProps> = ({
  settings,
  onChange,
  onReset,
  onCopyCss,
  isCopied,
}) => {
  const updateSetting = <K extends keyof FluidStudioSettings>(
    key: K,
    val: FluidStudioSettings[K]
  ) => {
    onChange((prev) => ({ ...prev, [key]: val }));
  };

  const preset = SPRING_PRESETS[settings.spring];

  return (
    <div className="p-6 bg-white rounded-[28px] border border-neutral-300 shadow-subtle space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-neutral-900" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Visual Studio
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCopyCss}
            type="button"
            className="text-xs flex items-center gap-1 text-neutral-600 hover:text-neutral-900 font-medium transition-colors cursor-pointer"
          >
            <Copy className="w-3 h-3" />
            <span>{isCopied ? 'Copied CSS!' : 'Copy CSS'}</span>
          </button>
          <button
            onClick={onReset}
            type="button"
            className="text-xs flex items-center gap-1 text-neutral-500 hover:text-neutral-900 font-medium transition-colors underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Default</span>
          </button>
        </div>
      </div>

      {/* Universal Border Color */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-neutral-700 flex items-center gap-2">
          <span>Universal Border Color</span>
          <span className="text-xs text-neutral-400 font-normal">
            {settings.borderColor.toUpperCase()}
          </span>
        </label>
        <input
          type="color"
          value={settings.borderColor}
          onChange={(e) => updateSetting('borderColor', e.target.value)}
          className="w-8 h-8 rounded-full border border-neutral-300 cursor-pointer p-0 bg-transparent"
        />
      </div>

      {/* Universal Fill Color */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-neutral-700 flex items-center gap-2">
          <span>Universal Fill Color</span>
          <span className="text-xs text-neutral-400 font-normal">
            {settings.fillColor.toUpperCase()}
          </span>
        </label>
        <input
          type="color"
          value={settings.fillColor}
          onChange={(e) => updateSetting('fillColor', e.target.value)}
          className="w-8 h-8 rounded-full border border-neutral-300 cursor-pointer p-0 bg-transparent"
        />
      </div>

      {/* Text & Icon Color */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-neutral-700 flex items-center gap-2">
          <span>Text & Icon Color</span>
          <span className="text-xs text-neutral-400 font-normal">
            {settings.textColor.toUpperCase()}
          </span>
        </label>
        <input
          type="color"
          value={settings.textColor}
          onChange={(e) => updateSetting('textColor', e.target.value)}
          className="w-8 h-8 rounded-full border border-neutral-300 cursor-pointer p-0 bg-transparent"
        />
      </div>

      {/* Border Width Scale: 0 to 5 */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-neutral-700 font-medium">Border Width Scale</span>
          <span className="text-xs font-semibold text-neutral-800">
            {settings.borderWidth}px
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="5"
          step="1"
          value={settings.borderWidth}
          onChange={(e) => updateSetting('borderWidth', parseInt(e.target.value, 10))}
          className="w-full accent-neutral-900 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-neutral-500 font-medium px-0.5">
          <span>0px</span>
          <span>1px</span>
          <span>2px</span>
          <span>3px</span>
          <span>4px</span>
          <span>5px</span>
        </div>
      </div>

      {/* Universal Corner Radius: 0px to 24px */}
      <div className="space-y-1.5 pt-1 border-t border-neutral-100">
        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-neutral-700 font-medium">Corner Radius (Inputs & Tags)</span>
          <span className="text-xs font-semibold text-neutral-800">
            {settings.radius >= 24 ? `${settings.radius}px (Pill)` : `${settings.radius}px`}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="24"
          step="2"
          value={settings.radius}
          onChange={(e) => updateSetting('radius', parseInt(e.target.value, 10))}
          className="w-full accent-neutral-900 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-neutral-500 font-medium px-0.5">
          <span>0px (Square)</span>
          <span>8px</span>
          <span>16px</span>
          <span>24px (Pill)</span>
        </div>
      </div>

      {/* Field Height Density */}
      <div className="space-y-1.5 pt-1 border-t border-neutral-100">
        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-neutral-700 font-medium">Field Height Density</span>
          <span className="text-xs font-semibold text-neutral-800">
            {settings.height}px
          </span>
        </div>
        <input
          type="range"
          min="40"
          max="52"
          step="4"
          value={settings.height}
          onChange={(e) => updateSetting('height', parseInt(e.target.value, 10))}
          className="w-full accent-neutral-900 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-neutral-500 font-medium px-0.5">
          <span>40px (Compact)</span>
          <span>44px (Standard)</span>
          <span>48px</span>
          <span>52px (Spacious)</span>
        </div>
      </div>

      {/* Font Size Scale */}
      <div className="space-y-1.5 pt-1 border-t border-neutral-100">
        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-neutral-700 font-medium">Font Size Scale</span>
          <span className="text-xs font-semibold text-neutral-800">
            {settings.fontSize}px
          </span>
        </div>
        <input
          type="range"
          min="13"
          max="16"
          step="1"
          value={settings.fontSize}
          onChange={(e) => updateSetting('fontSize', parseInt(e.target.value, 10))}
          className="w-full accent-neutral-900 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-neutral-500 font-medium px-0.5">
          <span>13px</span>
          <span>14px</span>
          <span>15px</span>
          <span>16px</span>
        </div>
      </div>

      {/* Menu Floating Offset Gap */}
      <div className="space-y-1.5 pt-1 border-t border-neutral-100">
        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-neutral-700 font-medium">Menu Offset Gap</span>
          <span className="text-xs font-semibold text-neutral-800">
            {settings.gap}px
          </span>
        </div>
        <input
          type="range"
          min="4"
          max="14"
          step="2"
          value={settings.gap}
          onChange={(e) => updateSetting('gap', parseInt(e.target.value, 10))}
          className="w-full accent-neutral-900 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-neutral-500 font-medium px-0.5">
          <span>4px (Flush)</span>
          <span>8px</span>
          <span>10px</span>
          <span>14px (Separated)</span>
        </div>
      </div>

      {/* Motion Physics Spring Curve */}
      <div className="space-y-1.5 pt-1 border-t border-neutral-100">
        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-neutral-700 font-medium">Spring Motion Physics</span>
          <span className="text-xs font-semibold text-neutral-800">
            {preset.name}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="3"
          step="1"
          value={settings.spring}
          onChange={(e) => updateSetting('spring', e.target.value as '1' | '2' | '3')}
          className="w-full accent-neutral-900 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-neutral-500 font-medium px-0.5">
          <span>Subtle Linear</span>
          <span>Apple Damped</span>
          <span>Elastic Spring</span>
        </div>
      </div>

      {/* Kinetic Backplate Highlight Tint */}
      <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
        <label className="text-xs font-medium text-neutral-700 flex items-center gap-2">
          <span>Hover Backplate Tint</span>
          <span className="text-xs text-neutral-400 font-normal">
            {settings.backplateColor.toUpperCase()}
          </span>
        </label>
        <input
          type="color"
          value={settings.backplateColor}
          onChange={(e) => updateSetting('backplateColor', e.target.value)}
          className="w-8 h-8 rounded-full border border-neutral-300 cursor-pointer p-0 bg-transparent"
        />
      </div>
    </div>
  );
};

// ==========================================
// 6. PRE-BUILT SAAS POC TEMPLATE FORM
// ==========================================

export const SaaSPocForm: React.FC<{ settings: FluidStudioSettings }> = ({ settings }) => {
  const [workspaceName, setWorkspaceName] = useState('Acme SaaS Core');
  const [region, setRegion] = useState('North America (us-east-1)');
  const [permissions, setPermissions] = useState<string[]>([
    'View Invoices',
    'Manage Approvals',
  ]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-7 bg-white rounded-[28px] border border-neutral-300 shadow-subtle space-y-6 w-full"
    >
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900 tracking-tight">
            Create New SaaS Workspace
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            ZeroLight-powered rapid PoC workflow
          </p>
        </div>
        <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-800">
          PoC Live
        </span>
      </div>

      <FluidStandardInput
        value={workspaceName}
        onChange={setWorkspaceName}
        placeholder="Enter workspace name..."
        settings={settings}
      />

      <FluidSearchableSelect
        options={REGION_OPTIONS}
        value={region}
        onChange={setRegion}
        placeholder="Select deployment cloud region..."
        settings={settings}
      />

      <FluidMultiSelect
        options={PERMISSION_OPTIONS}
        selected={permissions}
        onChange={setPermissions}
        placeholder="Assign access roles & permissions..."
        settings={settings}
      />

      <button
        type="submit"
        style={{
          borderRadius: settings.radius >= 20 ? '9999px' : `${settings.radius}px`,
          height: `${settings.height}px`,
          fontSize: `${settings.fontSize}px`,
        }}
        className="tactile-press w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
      >
        <span>{submitted ? '✓ Workspace Provisioned!' : 'Launch SaaS PoC Workspace'}</span>
      </button>

      {submitted && (
        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-600 font-mono overflow-x-auto">
          {JSON.stringify({ workspaceName, region, permissions }, null, 2)}
        </div>
      )}
    </form>
  );
};

// ==========================================
// 7. MAIN STUDIO CONTAINER (COMPLETE ZERO LIGHT SUITE)
// ==========================================

export const FluidInputAtomsStudio: React.FC = () => {
  const [settings, setSettings] = useState<FluidStudioSettings>(DEFAULT_FLUID_SETTINGS);
  const [viewMode, setViewMode] = useState<'atoms' | 'poc'>('atoms');
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['View Invoices']);
  const [copied, setCopied] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTab, setExportTab] = useState<'css' | 'tailwind' | 'cli'>('css');

  const handleReset = () => {
    setSettings(DEFAULT_FLUID_SETTINGS);
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
            <FluidStandardInput
              value={inputValue}
              onChange={setInputValue}
              settings={settings}
            />

            <FluidSearchableSelect
              options={REGION_OPTIONS}
              value={searchValue}
              onChange={setSearchValue}
              settings={settings}
            />

            <FluidMultiSelect
              options={PERMISSION_OPTIONS}
              selected={selectedTags}
              onChange={setSelectedTags}
              settings={settings}
            />
          </div>
        ) : (
          <SaaSPocForm settings={settings} />
        )}

        {/* 2. FLUID VISUAL STUDIO DOCK */}
        <FluidVisualStudioDock
          settings={settings}
          onChange={setSettings}
          onReset={handleReset}
          onCopyCss={() => setShowExportModal(true)}
          isCopied={copied}
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
